"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClassTimetable = exports.deleteSchedule = exports.updateSchedule = exports.addScheduleToAssignment = exports.getProfesseurTimetable = exports.getClassTimetable = exports.createAssignment = exports.getAssignments = void 0;
const prisma_1 = require("../../generated/prisma");
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const timetableTypes_1 = require("../types/timetableTypes");
const prisma = new prisma_1.PrismaClient();
/**
 * @desc Récupère la liste des assignations de classe
 * @route GET /api/timetables/assignments
 * @access Admin/Staff/Professeurs
 */
const getAssignments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { page = 1, limit = 20, academicYearId, classLevel, professeurId, subjectId, status = "Active", search, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Construire la requête de filtrage
        const where = {};
        if (academicYearId && academicYearId !== "all") {
            where.academicYearId = academicYearId;
        }
        if (classLevel && classLevel !== "all") {
            where.classLevel = classLevel;
        }
        if (professeurId && professeurId !== "all") {
            where.professeurId = professeurId;
        }
        if (subjectId && subjectId !== "all") {
            where.subjectId = subjectId;
        }
        if (status && status !== "all") {
            where.status = status;
        }
        if (search) {
            const searchStr = search;
            where.OR = [
                {
                    subject: {
                        name: { contains: searchStr, mode: "insensitive" },
                    },
                },
                {
                    subject: {
                        code: { contains: searchStr, mode: "insensitive" },
                    },
                },
                {
                    professeur: {
                        firstName: { contains: searchStr, mode: "insensitive" },
                    },
                },
                {
                    professeur: {
                        lastName: { contains: searchStr, mode: "insensitive" },
                    },
                },
            ];
        }
        // Définir l'ordre de tri
        let orderBy = {};
        const validSortFields = ["createdAt", "updatedAt", "classLevel"];
        if (validSortFields.includes(sortBy)) {
            orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
        }
        else {
            orderBy = { createdAt: "desc" };
        }
        // Récupérer les assignations avec pagination
        const [assignments, totalAssignments] = await Promise.all([
            prisma.classAssignment.findMany({
                where,
                select: {
                    id: true,
                    subjectId: true,
                    professeurId: true,
                    classLevel: true,
                    academicYearId: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    subject: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            coefficient: true,
                            type: true,
                        },
                    },
                    professeur: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            matricule: true,
                        },
                    },
                    academicYear: {
                        select: {
                            id: true,
                            year: true,
                        },
                    },
                    _count: {
                        select: {
                            schedules: true,
                            grades: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.classAssignment.count({ where }),
        ]);
        const totalPages = Math.ceil(totalAssignments / limitNum);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.ASSIGNMENT_CREATED, // Note: devrait être un type spécifique pour liste
            entity: "ClassAssignment",
            description: "Liste des assignations récupérée avec succès",
            status: "SUCCESS",
            metadata: {
                page: pageNum,
                limit: limitNum,
                totalAssignments,
                filters: {
                    academicYearId,
                    classLevel,
                    professeurId,
                    subjectId,
                    status,
                    search,
                },
            },
        });
        const response = {
            success: true,
            message: "Liste des assignations récupérée avec succès",
            data: {
                assignments,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalAssignments,
                    totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1,
                },
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - getAssignments error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.ASSIGNMENT_CREATION_ERROR,
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getAssignments = getAssignments;
/**
 * @desc Crée une nouvelle assignation avec ses horaires
 * @route POST /api/timetables/assignments
 * @access Admin/Staff
 */
const createAssignment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { subjectId, professeurId, classLevel, academicYearId, schedules = [], } = req.body;
        // Validation des données requises
        if (!subjectId || !professeurId || !classLevel || !academicYearId) {
            const response = {
                success: false,
                message: "Tous les champs sont requis (matière, professeur, niveau, année académique)",
                code: "MISSING_REQUIRED_FIELDS",
            };
            res.status(400).json(response);
            return;
        }
        // Validation du niveau de classe
        const validClassLevels = Object.values(timetableTypes_1.ClassLevel);
        if (!validClassLevels.includes(classLevel)) {
            const response = {
                success: false,
                message: "Niveau de classe invalide",
                code: "INVALID_CLASS_LEVEL",
                data: { validClassLevels },
            };
            res.status(400).json(response);
            return;
        }
        // Utiliser une transaction
        const result = await prisma.$transaction(async (tx) => {
            // Vérifier l'existence des entités
            const [subject, professeur, academicYear] = await Promise.all([
                tx.subject.findUnique({ where: { id: subjectId } }),
                tx.professeur.findUnique({ where: { id: professeurId } }),
                tx.academicYear.findUnique({ where: { id: academicYearId } }),
            ]);
            if (!subject) {
                throw new Error("SUBJECT_NOT_FOUND");
            }
            if (!professeur) {
                throw new Error("PROFESSEUR_NOT_FOUND");
            }
            if (!academicYear) {
                throw new Error("ACADEMIC_YEAR_NOT_FOUND");
            }
            // Vérifier l'unicité de l'assignation
            const existingAssignment = await tx.classAssignment.findUnique({
                where: {
                    subjectId_classLevel_academicYearId_professeurId: {
                        subjectId,
                        classLevel: classLevel,
                        academicYearId,
                        professeurId,
                    },
                },
            });
            if (existingAssignment) {
                throw new Error("ASSIGNMENT_ALREADY_EXISTS");
            }
            // Créer l'assignation
            const assignment = await tx.classAssignment.create({
                data: {
                    subjectId,
                    professeurId,
                    classLevel: classLevel,
                    academicYearId,
                    status: "Active",
                },
            });
            const createdSchedules = [];
            // Créer les horaires si fournis
            if (schedules.length > 0) {
                for (const scheduleData of schedules) {
                    // Validation des données de l'horaire
                    if (!scheduleData.dayOfWeek ||
                        !scheduleData.startTime ||
                        !scheduleData.endTime) {
                        throw new Error("SCHEDULE_MISSING_FIELDS");
                    }
                    // Validation du jour de la semaine
                    const validDays = [
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                    ];
                    if (!validDays.includes(scheduleData.dayOfWeek)) {
                        throw new Error("INVALID_DAY_OF_WEEK");
                    }
                    // Vérifier l'existence de la classe
                    const schoolClass = await tx.schoolClass.findUnique({
                        where: { id: scheduleData.classId },
                    });
                    if (!schoolClass) {
                        throw new Error("CLASS_NOT_FOUND");
                    }
                    // Vérifier que la classe correspond au niveau
                    if (schoolClass.level !== classLevel) {
                        throw new Error("CLASS_LEVEL_MISMATCH");
                    }
                    // Vérifier les conflits d'horaire
                    await checkScheduleConflicts(tx, {
                        assignmentId: assignment.id,
                        classId: scheduleData.classId,
                        professeurId,
                        dayOfWeek: scheduleData.dayOfWeek,
                        startTime: scheduleData.startTime,
                        endTime: scheduleData.endTime,
                        excludeScheduleId: null,
                    });
                    // Créer l'horaire
                    const schedule = await tx.schedule.create({
                        data: {
                            assignmentId: assignment.id,
                            classId: scheduleData.classId,
                            professeurId,
                            dayOfWeek: scheduleData.dayOfWeek,
                            startTime: scheduleData.startTime,
                            endTime: scheduleData.endTime,
                            classroom: scheduleData.classroom || null,
                            status: "ACTIVE",
                            recurrence: scheduleData.recurrence || null,
                            untilDate: scheduleData.untilDate
                                ? new Date(scheduleData.untilDate)
                                : null,
                            notes: scheduleData.notes || null,
                        },
                    });
                    createdSchedules.push(schedule);
                }
            }
            return {
                assignment,
                schedules: createdSchedules,
            };
        }, {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: prisma_1.Prisma.TransactionIsolationLevel.Serializable,
        });
        // Récupérer l'assignation complète pour la réponse
        const completeAssignment = await prisma.classAssignment.findUnique({
            where: { id: result.assignment.id },
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
                professeur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                    },
                },
                schedules: {
                    include: {
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                            },
                        },
                    },
                },
            },
        });
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.ASSIGNMENT_CREATED,
            entity: "ClassAssignment",
            entityId: result.assignment.id,
            description: "Assignation créée avec succès",
            status: "SUCCESS",
            metadata: {
                subjectId,
                professeurId,
                classLevel,
                academicYearId,
                schedulesCount: result.schedules.length,
            },
        });
        const response = {
            success: true,
            message: "Assignation créée avec succès",
            data: {
                assignment: completeAssignment,
            },
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - createAssignment error:", error);
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "SUBJECT_NOT_FOUND") {
            statusCode = 404;
            errorCode = "SUBJECT_NOT_FOUND";
            errorMessage = "La matière spécifiée n'existe pas";
        }
        else if (error.message === "PROFESSEUR_NOT_FOUND") {
            statusCode = 404;
            errorCode = "PROFESSEUR_NOT_FOUND";
            errorMessage = "Le professeur spécifié n'existe pas";
        }
        else if (error.message === "ACADEMIC_YEAR_NOT_FOUND") {
            statusCode = 404;
            errorCode = "ACADEMIC_YEAR_NOT_FOUND";
            errorMessage = "L'année académique spécifiée n'existe pas";
        }
        else if (error.message === "ASSIGNMENT_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "ASSIGNMENT_ALREADY_EXISTS";
            errorMessage =
                "Cette assignation existe déjà pour cette matière, niveau et année académique";
        }
        else if (error.message === "SCHEDULE_MISSING_FIELDS") {
            statusCode = 400;
            errorCode = "SCHEDULE_MISSING_FIELDS";
            errorMessage = "Jour et horaires sont requis pour chaque emploi du temps";
        }
        else if (error.message === "INVALID_DAY_OF_WEEK") {
            statusCode = 400;
            errorCode = "INVALID_DAY_OF_WEEK";
            errorMessage = "Jour de la semaine invalide";
        }
        else if (error.message === "CLASS_NOT_FOUND") {
            statusCode = 404;
            errorCode = "CLASS_NOT_FOUND";
            errorMessage = "La classe spécifiée n'existe pas";
        }
        else if (error.message === "CLASS_LEVEL_MISMATCH") {
            statusCode = 400;
            errorCode = "CLASS_LEVEL_MISMATCH";
            errorMessage = "Le niveau de la classe ne correspond pas à l'assignation";
        }
        else if (error.message === "PROFESSEUR_CONFLICT") {
            statusCode = 409;
            errorCode = "PROFESSEUR_CONFLICT";
            errorMessage = "Le professeur a déjà un cours à ce créneau";
        }
        else if (error.message === "CLASS_CONFLICT") {
            statusCode = 409;
            errorCode = "CLASS_CONFLICT";
            errorMessage = "La classe a déjà un cours à ce créneau";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.ASSIGNMENT_CREATION_ERROR,
            entity: "ClassAssignment",
            description: "Erreur lors de la création de l'assignation",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.createAssignment = createAssignment;
/**
 * @desc Récupère l'emploi du temps d'une classe
 * @route GET /api/timetables/class/:classId
 * @access Admin/Staff/Professeurs/Students
 */
const getClassTimetable = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId } = req.params;
        const { academicYearId, dayOfWeek } = req.query;
        // Vérifier si la classe existe
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: classId },
        });
        if (!schoolClass) {
            const response = {
                success: false,
                message: "Classe non trouvée",
                code: "CLASS_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Construire les filtres
        const where = {
            classId,
            status: "ACTIVE",
        };
        if (academicYearId) {
            where.classAssignment = {
                academicYearId: academicYearId,
            };
        }
        if (dayOfWeek) {
            where.dayOfWeek = dayOfWeek;
        }
        // Récupérer les horaires
        const schedules = await prisma.schedule.findMany({
            where,
            select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                classroom: true,
                status: true,
                notes: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
                classAssignment: {
                    select: {
                        id: true,
                        subject: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                coefficient: true,
                            },
                        },
                        professeur: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        });
        // Grouper par jour
        const groupedSchedules = schedules.reduce((acc, schedule) => {
            const day = schedule.dayOfWeek;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(schedule);
            return acc;
        }, {});
        // Calculer les statistiques
        const statistics = {
            totalSessions: schedules.length,
            sessionsByDay: Object.keys(groupedSchedules).length,
            totalHours: schedules.reduce((total, schedule) => {
                const [startHour, startMinute] = schedule.startTime
                    .split(":")
                    .map(Number);
                const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
                const hours = endHour + endMinute / 60 - (startHour + startMinute / 60);
                return total + hours;
            }, 0),
        };
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_CREATED, // Note: devrait être un type spécifique pour consultation
            entity: "Schedule",
            description: `Emploi du temps de la classe ${schoolClass.name} récupéré`,
            status: "SUCCESS",
            metadata: {
                classId,
                academicYearId,
                schedulesCount: schedules.length,
            },
        });
        const response = {
            success: true,
            message: "Emploi du temps récupéré avec succès",
            data: {
                class: schoolClass,
                schedules,
                groupedSchedules,
                statistics,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - getClassTimetable error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_CREATION_ERROR,
            entity: "Schedule",
            description: "Erreur lors de la récupération de l'emploi du temps",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getClassTimetable = getClassTimetable;
/**
 * @desc Récupère l'emploi du temps d'un professeur
 * @route GET /api/timetables/professeur/:professeurId
 * @access Admin/Staff/Professeurs
 */
const getProfesseurTimetable = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { professeurId } = req.params;
        const { academicYearId, dayOfWeek } = req.query;
        // Vérifier si le professeur existe
        const professeur = await prisma.professeur.findUnique({
            where: { id: professeurId },
        });
        if (!professeur) {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Construire les filtres
        const where = {
            professeurId,
            status: "ACTIVE",
        };
        if (academicYearId) {
            where.classAssignment = {
                academicYearId: academicYearId,
            };
        }
        if (dayOfWeek) {
            where.dayOfWeek = dayOfWeek;
        }
        // Récupérer les horaires
        const schedules = await prisma.schedule.findMany({
            where,
            select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                classroom: true,
                status: true,
                notes: true,
                classAssignment: {
                    select: {
                        id: true,
                        subject: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                coefficient: true,
                            },
                        },
                        classLevel: true,
                    },
                },
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
            },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        });
        // Grouper par jour
        const groupedSchedules = schedules.reduce((acc, schedule) => {
            const day = schedule.dayOfWeek;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(schedule);
            return acc;
        }, {});
        // Calculer les statistiques
        const statistics = {
            totalSessions: schedules.length,
            sessionsByDay: Object.keys(groupedSchedules).length,
            totalHours: schedules.reduce((total, schedule) => {
                const [startHour, startMinute] = schedule.startTime
                    .split(":")
                    .map(Number);
                const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
                const hours = endHour + endMinute / 60 - (startHour + startMinute / 60);
                return total + hours;
            }, 0),
        };
        const response = {
            success: true,
            message: "Emploi du temps du professeur récupéré avec succès",
            data: {
                professeur: {
                    id: professeur.id,
                    firstName: professeur.firstName,
                    lastName: professeur.lastName,
                    email: professeur.email,
                    matricule: professeur.matricule,
                },
                schedules,
                groupedSchedules,
                statistics,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" TimetableController - getProfesseurTimetable error:", error);
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getProfesseurTimetable = getProfesseurTimetable;
/**
 * @desc Ajoute un horaire à une assignation existante
 * @route POST /api/timetables/assignments/:assignmentId/schedules
 * @access Admin/Staff
 */
const addScheduleToAssignment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { assignmentId } = req.params;
        const scheduleData = req.body;
        // Validation des données
        if (!scheduleData.dayOfWeek ||
            !scheduleData.startTime ||
            !scheduleData.endTime ||
            !scheduleData.classId) {
            const response = {
                success: false,
                message: "Jour, horaires et classe sont requis",
                code: "MISSING_REQUIRED_FIELDS",
            };
            res.status(400).json(response);
            return;
        }
        // Vérifier si l'assignation existe
        const assignment = await prisma.classAssignment.findUnique({
            where: { id: assignmentId },
            include: {
                professeur: true,
            },
        });
        if (!assignment) {
            const response = {
                success: false,
                message: "Assignation non trouvée",
                code: "ASSIGNMENT_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Vérifier si la classe existe
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: scheduleData.classId },
        });
        if (!schoolClass) {
            const response = {
                success: false,
                message: "Classe non trouvée",
                code: "CLASS_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Vérifier que la classe correspond au niveau
        if (schoolClass.level !== assignment.classLevel) {
            const response = {
                success: false,
                message: "Le niveau de la classe ne correspond pas à l'assignation",
                code: "CLASS_LEVEL_MISMATCH",
            };
            res.status(400).json(response);
            return;
        }
        // Vérifier les conflits d'horaire
        await checkScheduleConflicts(prisma, {
            assignmentId,
            classId: scheduleData.classId,
            professeurId: assignment.professeurId,
            dayOfWeek: scheduleData.dayOfWeek,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            excludeScheduleId: null,
        });
        // Créer l'horaire
        const schedule = await prisma.schedule.create({
            data: {
                assignmentId,
                classId: scheduleData.classId,
                professeurId: assignment.professeurId,
                dayOfWeek: scheduleData.dayOfWeek,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                classroom: scheduleData.classroom || null,
                status: "ACTIVE",
                recurrence: scheduleData.recurrence || null,
                untilDate: scheduleData.untilDate
                    ? new Date(scheduleData.untilDate)
                    : null,
                notes: scheduleData.notes || null,
            },
            include: {
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
            },
        });
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_CREATED,
            entity: "Schedule",
            entityId: schedule.id,
            description: "Horaire ajouté à l'assignation",
            status: "SUCCESS",
            metadata: {
                assignmentId,
                classId: scheduleData.classId,
                dayOfWeek: scheduleData.dayOfWeek,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
            },
        });
        const response = {
            success: true,
            message: "Horaire ajouté avec succès",
            data: { schedule },
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error(" TimetableController - addScheduleToAssignment error:", error);
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "PROFESSEUR_CONFLICT") {
            statusCode = 409;
            errorCode = "PROFESSEUR_CONFLICT";
            errorMessage = "Le professeur a déjà un cours à ce créneau";
        }
        else if (error.message === "CLASS_CONFLICT") {
            statusCode = 409;
            errorCode = "CLASS_CONFLICT";
            errorMessage = "La classe a déjà un cours à ce créneau";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_CREATION_ERROR,
            entity: "Schedule",
            description: "Erreur lors de l'ajout de l'horaire",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.addScheduleToAssignment = addScheduleToAssignment;
/**
 * @desc Met à jour un horaire
 * @route PUT /api/timetables/schedules/:scheduleId
 * @access Admin/Staff
 */
const updateSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { scheduleId } = req.params;
        const updateData = req.body;
        // Vérifier si l'horaire existe
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                classAssignment: {
                    include: {
                        professeur: true,
                    },
                },
            },
        });
        if (!existingSchedule) {
            const response = {
                success: false,
                message: "Horaire non trouvé",
                code: "SCHEDULE_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Préparer les données de mise à jour
        const data = {};
        if (updateData.dayOfWeek !== undefined)
            data.dayOfWeek = updateData.dayOfWeek;
        if (updateData.startTime !== undefined)
            data.startTime = updateData.startTime;
        if (updateData.endTime !== undefined)
            data.endTime = updateData.endTime;
        if (updateData.classroom !== undefined)
            data.classroom = updateData.classroom || null;
        if (updateData.status !== undefined)
            data.status = updateData.status;
        if (updateData.recurrence !== undefined)
            data.recurrence = updateData.recurrence || null;
        if (updateData.untilDate !== undefined)
            data.untilDate = updateData.untilDate
                ? new Date(updateData.untilDate)
                : null;
        if (updateData.notes !== undefined)
            data.notes = updateData.notes || null;
        // Vérifier les conflits si les horaires changent
        if (updateData.startTime || updateData.endTime || updateData.dayOfWeek) {
            const startTime = updateData.startTime || existingSchedule.startTime;
            const endTime = updateData.endTime || existingSchedule.endTime;
            const dayOfWeek = updateData.dayOfWeek || existingSchedule.dayOfWeek;
            await checkScheduleConflicts(prisma, {
                assignmentId: existingSchedule.assignmentId,
                classId: existingSchedule.classId,
                professeurId: existingSchedule.professeurId,
                dayOfWeek: dayOfWeek,
                startTime,
                endTime,
                excludeScheduleId: scheduleId,
            });
        }
        // Mettre à jour l'horaire
        const updatedSchedule = await prisma.schedule.update({
            where: { id: scheduleId },
            data,
            include: {
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
                classAssignment: {
                    select: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        professeur: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_UPDATED,
            entity: "Schedule",
            entityId: scheduleId,
            description: "Horaire mis à jour avec succès",
            status: "SUCCESS",
            metadata: {
                updatedFields: Object.keys(updateData),
            },
        });
        const response = {
            success: true,
            message: "Horaire mis à jour avec succès",
            data: { schedule: updatedSchedule },
        };
        res.json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - updateSchedule error:", error);
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "PROFESSEUR_CONFLICT") {
            statusCode = 409;
            errorCode = "PROFESSEUR_CONFLICT";
            errorMessage = "Le professeur a déjà un cours à ce créneau";
        }
        else if (error.message === "CLASS_CONFLICT") {
            statusCode = 409;
            errorCode = "CLASS_CONFLICT";
            errorMessage = "La classe a déjà un cours à ce créneau";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_UPDATE_ERROR,
            entity: "Schedule",
            description: "Erreur lors de la mise à jour de l'horaire",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.updateSchedule = updateSchedule;
/**
 * @desc Supprime un horaire
 * @route DELETE /api/timetables/schedules/:scheduleId
 * @access Admin/Staff
 */
const deleteSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { scheduleId } = req.params;
        // Vérifier si l'horaire existe
        const schedule = await prisma.schedule.findUnique({
            where: { id: scheduleId },
        });
        if (!schedule) {
            const response = {
                success: false,
                message: "Horaire non trouvé",
                code: "SCHEDULE_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Supprimer l'horaire
        await prisma.schedule.delete({
            where: { id: scheduleId },
        });
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_DELETED,
            entity: "Schedule",
            entityId: scheduleId,
            description: "Horaire supprimé avec succès",
            status: "SUCCESS",
            metadata: {
                assignmentId: schedule.assignmentId,
                classId: schedule.classId,
                dayOfWeek: schedule.dayOfWeek,
            },
        });
        const response = {
            success: true,
            message: "Horaire supprimé avec succès",
        };
        res.json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - deleteSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_DELETION_ERROR,
            entity: "Schedule",
            description: "Erreur lors de la suppression de l'horaire",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.deleteSchedule = deleteSchedule;
/**
 * @desc Génère un emploi du temps automatiquement pour une classe
 * @route POST /api/timetables/generate/class/:classId
 * @access Admin/Staff
 */
const generateClassTimetable = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId } = req.params;
        const { academicYearId, constraints = {} } = req.body;
        if (!academicYearId) {
            const response = {
                success: false,
                message: "L'année académique est requise",
                code: "MISSING_ACADEMIC_YEAR",
            };
            res.status(400).json(response);
            return;
        }
        // Vérifier si la classe existe
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: classId },
        });
        if (!schoolClass) {
            const response = {
                success: false,
                message: "Classe non trouvée",
                code: "CLASS_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Récupérer les assignations pour cette classe/année/niveau
        const assignments = await prisma.classAssignment.findMany({
            where: {
                classLevel: schoolClass.level,
                academicYearId,
                status: "Active",
            },
            include: {
                subject: true,
                professeur: true,
                schedules: {
                    where: {
                        classId,
                        status: "ACTIVE",
                    },
                },
            },
        });
        if (assignments.length === 0) {
            const response = {
                success: false,
                message: "Aucune assignation trouvée pour cette classe",
                code: "NO_ASSIGNMENTS_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        // Définir les créneaux horaires
        const timeSlots = [
            { start: "08:00", end: "09:30" },
            { start: "09:45", end: "11:15" },
            { start: "11:30", end: "13:00" },
            { start: "14:00", end: "15:30" },
            { start: "15:45", end: "17:15" },
            { start: "17:30", end: "19:00" },
        ];
        const days = [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];
        const generatedSchedules = [];
        const errors = [];
        // Utiliser une transaction
        await prisma.$transaction(async (tx) => {
            // Supprimer les anciens horaires si demandé
            if (constraints.clearExisting) {
                await tx.schedule.deleteMany({
                    where: {
                        classId,
                        classAssignment: {
                            academicYearId,
                        },
                    },
                });
            }
            // Générer les horaires
            for (const assignment of assignments) {
                // Déterminer le nombre de sessions nécessaires (basé sur le coefficient)
                const sessionsNeeded = Math.max(1, Math.floor(assignment.subject.coefficient / 2));
                let sessionsCreated = 0;
                for (let i = 0; i < sessionsNeeded && sessionsCreated < sessionsNeeded; i++) {
                    for (const day of days) {
                        if (sessionsCreated >= sessionsNeeded)
                            break;
                        for (const slot of timeSlots) {
                            if (sessionsCreated >= sessionsNeeded)
                                break;
                            try {
                                // Vérifier les conflits
                                await checkScheduleConflicts(tx, {
                                    assignmentId: assignment.id,
                                    classId,
                                    professeurId: assignment.professeurId,
                                    dayOfWeek: day,
                                    startTime: slot.start,
                                    endTime: slot.end,
                                    excludeScheduleId: null,
                                });
                                // Créer l'horaire
                                const schedule = await tx.schedule.create({
                                    data: {
                                        assignmentId: assignment.id,
                                        classId,
                                        professeurId: assignment.professeurId,
                                        dayOfWeek: day,
                                        startTime: slot.start,
                                        endTime: slot.end,
                                        status: "ACTIVE",
                                    },
                                });
                                generatedSchedules.push(schedule);
                                sessionsCreated++;
                            }
                            catch (error) {
                                if (error.message === "PROFESSEUR_CONFLICT" ||
                                    error.message === "CLASS_CONFLICT") {
                                    // Ignorer les conflits, essayer le prochain créneau
                                    continue;
                                }
                                else {
                                    errors.push({
                                        assignment: assignment.id,
                                        error: error.message,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        });
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.TIMETABLE_GENERATED,
            entity: "Schedule",
            description: `Emploi du temps généré pour la classe ${schoolClass.name}`,
            status: errors.length > 0 ? "INFO" : "SUCCESS",
            metadata: {
                classId,
                academicYearId,
                generatedSchedules: generatedSchedules.length,
                errors: errors.length,
                constraints,
            },
        });
        const response = {
            success: true,
            message: `Emploi du temps généré: ${generatedSchedules.length} sessions créées, ${errors.length} erreurs`,
            data: {
                generatedSchedules,
                errors,
                class: schoolClass,
            },
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("❌ TimetableController - generateClassTimetable error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: timetableTypes_1.TimetableActionTypes.SCHEDULE_CREATION_ERROR,
            entity: "Schedule",
            description: "Erreur lors de la génération de l'emploi du temps",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.generateClassTimetable = generateClassTimetable;
// Fonction utilitaire pour vérifier les conflits d'horaire
const checkScheduleConflicts = async (tx, params) => {
    const { assignmentId, classId, professeurId, dayOfWeek, startTime, endTime, excludeScheduleId, } = params;
    // Convertir les heures en minutes pour la comparaison
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    if (startMinutes >= endMinutes) {
        throw new Error("INVALID_TIME_RANGE");
    }
    // Vérifier les conflits du professeur
    const professorConflicts = await tx.schedule.findMany({
        where: {
            professeurId,
            dayOfWeek,
            id: { not: excludeScheduleId || undefined },
            status: "ACTIVE",
        },
    });
    for (const conflict of professorConflicts) {
        const [conflictStartHour, conflictStartMinute] = conflict.startTime
            .split(":")
            .map(Number);
        const [conflictEndHour, conflictEndMinute] = conflict.endTime
            .split(":")
            .map(Number);
        const conflictStartMinutes = conflictStartHour * 60 + conflictStartMinute;
        const conflictEndMinutes = conflictEndHour * 60 + conflictEndMinute;
        if (startMinutes < conflictEndMinutes &&
            endMinutes > conflictStartMinutes) {
            throw new Error("PROFESSEUR_CONFLICT");
        }
    }
    // Vérifier les conflits de la classe
    const classConflicts = await tx.schedule.findMany({
        where: {
            classId,
            dayOfWeek,
            id: { not: excludeScheduleId || undefined },
            status: "ACTIVE",
        },
    });
    for (const conflict of classConflicts) {
        const [conflictStartHour, conflictStartMinute] = conflict.startTime
            .split(":")
            .map(Number);
        const [conflictEndHour, conflictEndMinute] = conflict.endTime
            .split(":")
            .map(Number);
        const conflictStartMinutes = conflictStartHour * 60 + conflictStartMinute;
        const conflictEndMinutes = conflictEndHour * 60 + conflictEndMinute;
        if (startMinutes < conflictEndMinutes &&
            endMinutes > conflictStartMinutes) {
            throw new Error("CLASS_CONFLICT");
        }
    }
};
//# sourceMappingURL=timetableController.js.map