"use strict";
/**
 * @file scheduleService.ts
 * @description Service pour la gestion des emplois du temps avec support ISO
 * @version 1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * @class ScheduleService
 * @description Service pour la gestion des emplois du temps avec support ISO
 */
class ScheduleService {
    /**
     * Valide et convertit un timestamp ISO en HH:MM:SS
     */
    static convertISOTimeToHHMMSS(isoTime) {
        try {
            const date = new Date(isoTime);
            if (isNaN(date.getTime())) {
                throw new Error("Timestamp ISO invalide");
            }
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            const seconds = date.getUTCSeconds().toString().padStart(2, "0");
            return {
                time: `${hours}:${minutes}:${seconds}`,
                date,
            };
        }
        catch (error) {
            throw {
                status: 400,
                message: "Format de temps invalide",
                code: "INVALID_TIME_FORMAT",
            };
        }
    }
    /**
     * Vérifie si deux créneaux se chevauchent
     */
    static checkTimeOverlap(start1, // HH:MM:SS
    end1, // HH:MM:SS
    start2, // HH:MM:SS
    end2 // HH:MM:SS
    ) {
        // Convertir en minutes pour comparaison
        const toMinutes = (time) => {
            const [hours, minutes, seconds] = time.split(":").map(Number);
            return hours * 60 + minutes + seconds / 60;
        };
        const s1 = toMinutes(start1);
        const e1 = toMinutes(end1);
        const s2 = toMinutes(start2);
        const e2 = toMinutes(end2);
        return s1 < e2 && e1 > s2;
    }
    /**
     * Vérifier les conflits d'horaire - VERSION ISO
     */
    static async checkScheduleConflicts(professeurId, classId, dayOfWeek, startTime, // Format ISO: "2000-01-01T08:00:00.000Z"
    endTime, // Format ISO: "2000-01-01T09:30:00.000Z"
    classroom, excludeScheduleId) {
        const conflicts = [];
        try {
            // Convertir les temps ISO en HH:MM:SS
            const { time: startTimeStr, date: startDate } = this.convertISOTimeToHHMMSS(startTime);
            const { time: endTimeStr, date: endDate } = this.convertISOTimeToHHMMSS(endTime);
            // Vérifier l'ordre des temps
            if (endDate <= startDate) {
                conflicts.push({
                    type: "INVALID_TIME_RANGE",
                    message: "L'heure de fin doit être après l'heure de début",
                    details: [],
                });
                return { hasConflict: true, conflicts };
            }
            // Construire la condition WHERE
            const baseWhere = {
                dayOfWeek,
                OR: [
                    // Cas 1: Le nouveau créneau commence pendant un créneau existant
                    {
                        AND: [
                            { startTime: { lt: endTimeStr } },
                            { endTime: { gt: startTimeStr } },
                        ],
                    },
                    // Cas 2: Le nouveau créneau est contenu dans un créneau existant
                    {
                        AND: [
                            { startTime: { lte: startTimeStr } },
                            { endTime: { gte: endTimeStr } },
                        ],
                    },
                ],
            };
            if (excludeScheduleId) {
                baseWhere.id = { not: excludeScheduleId };
            }
            // 1. Vérifier conflits pour le professeur
            const professeurConflicts = await prisma.schedule.findMany({
                where: {
                    ...baseWhere,
                    professeurId,
                    status: "ACTIVE",
                },
                include: {
                    schoolClass: true,
                    classAssignment: {
                        include: {
                            subject: true,
                        },
                    },
                },
            });
            if (professeurConflicts.length > 0) {
                conflicts.push({
                    type: "PROFESSEUR_CONFLICT",
                    message: `Le professeur a déjà un cours de ${professeurConflicts[0].startTime} à ${professeurConflicts[0].endTime}`,
                    details: professeurConflicts.map((c) => ({
                        id: c.id,
                        subject: c.classAssignment?.subject?.name || "Inconnu",
                        class: c.schoolClass?.name || "Inconnu",
                        startTime: c.startTime,
                        endTime: c.endTime,
                        classroom: c.classroom,
                    })),
                });
            }
            // 2. Vérifier conflits pour la classe
            const classConflicts = await prisma.schedule.findMany({
                where: {
                    ...baseWhere,
                    classId,
                    status: "ACTIVE",
                },
                include: {
                    professeur: true,
                    classAssignment: {
                        include: {
                            subject: true,
                        },
                    },
                },
            });
            if (classConflicts.length > 0) {
                conflicts.push({
                    type: "CLASS_CONFLICT",
                    message: `La classe a déjà un cours de ${classConflicts[0].startTime} à ${classConflicts[0].endTime}`,
                    details: classConflicts.map((c) => ({
                        id: c.id,
                        subject: c.classAssignment?.subject?.name || "Inconnu",
                        professeur: c.professeur
                            ? `${c.professeur.firstName} ${c.professeur.lastName}`
                            : "Inconnu",
                        startTime: c.startTime,
                        endTime: c.endTime,
                        classroom: c.classroom,
                    })),
                });
            }
            // 3. Vérifier conflits de salle (si spécifiée)
            if (classroom) {
                const roomConflicts = await prisma.schedule.findMany({
                    where: {
                        ...baseWhere,
                        classroom,
                        status: "ACTIVE",
                    },
                    include: {
                        schoolClass: true,
                        professeur: true,
                    },
                });
                if (roomConflicts.length > 0) {
                    conflicts.push({
                        type: "ROOM_CONFLICT",
                        message: `La salle ${classroom} est déjà occupée de ${roomConflicts[0].startTime} à ${roomConflicts[0].endTime}`,
                        details: roomConflicts.map((c) => ({
                            id: c.id,
                            class: c.schoolClass?.name || "Inconnu",
                            professeur: c.professeur
                                ? `${c.professeur.firstName} ${c.professeur.lastName}`
                                : "Inconnu",
                            startTime: c.startTime,
                            endTime: c.endTime,
                        })),
                    });
                }
            }
            return {
                hasConflict: conflicts.length > 0,
                conflicts,
            };
        }
        catch (error) {
            console.error("Erreur checkScheduleConflicts:", error);
            conflicts.push({
                type: "VALIDATION_ERROR",
                message: error.message || "Erreur lors de la vérification des conflits",
                details: [],
            });
            return { hasConflict: true, conflicts };
        }
    }
    /**
     * Crée un nouvel horaire - VERSION ISO
     */
    static async createSchedule(data) {
        try {
            const { assignmentId, classId, dayOfWeek, startTime, endTime, classroom, recurrence, untilDate, notes, } = data;
            // Validation des données de base
            if (!assignmentId || !classId || !dayOfWeek || !startTime || !endTime) {
                throw {
                    status: 400,
                    message: "Données manquantes",
                    code: "MISSING_DATA",
                };
            }
            // Convertir et valider les temps ISO
            const { time: startTimeStr, date: startDate } = this.convertISOTimeToHHMMSS(startTime);
            const { time: endTimeStr, date: endDate } = this.convertISOTimeToHHMMSS(endTime);
            // Vérifier que l'heure de fin est après l'heure de début
            if (endDate <= startDate) {
                throw {
                    status: 400,
                    message: "L'heure de fin doit être après l'heure de début",
                    code: "INVALID_TIME_RANGE",
                };
            }
            // Vérifier l'assignation
            const assignment = await prisma.classAssignment.findUnique({
                where: { id: assignmentId },
                include: {
                    professeur: true,
                    subject: true,
                    academicYear: true,
                },
            });
            if (!assignment) {
                throw {
                    status: 404,
                    message: "Assignation non trouvée",
                    code: "ASSIGNMENT_NOT_FOUND",
                };
            }
            // Vérifier que la classe existe
            const schoolClass = await prisma.schoolClass.findUnique({
                where: { id: classId },
            });
            if (!schoolClass) {
                throw {
                    status: 404,
                    message: "Classe non trouvée",
                    code: "CLASS_NOT_FOUND",
                };
            }
            // Vérifier que le niveau de classe correspond
            if (schoolClass.level !== assignment.classLevel) {
                throw {
                    status: 400,
                    message: "Le niveau de la classe ne correspond pas à l'assignation",
                    code: "CLASS_LEVEL_MISMATCH",
                    details: {
                        classLevel: schoolClass.level,
                        assignmentLevel: assignment.classLevel,
                    },
                };
            }
            // Vérifier les conflits
            const conflictCheck = await this.checkScheduleConflicts(assignment.professeurId, classId, dayOfWeek, startTime, endTime, classroom);
            if (conflictCheck.hasConflict) {
                throw {
                    status: 409,
                    message: "Conflit d'horaire détecté",
                    code: "SCHEDULE_CONFLICT",
                    data: {
                        conflicts: conflictCheck.conflicts,
                    },
                };
            }
            // Créer l'horaire
            const schedule = await prisma.schedule.create({
                data: {
                    assignmentId,
                    classId,
                    professeurId: assignment.professeurId,
                    dayOfWeek,
                    startTime: startTimeStr, // Stocké en HH:MM:SS
                    endTime: endTimeStr, // Stocké en HH:MM:SS
                    classroom: classroom || null,
                    recurrence: recurrence || null,
                    untilDate: untilDate ? new Date(untilDate) : null,
                    notes: notes || null,
                    status: "ACTIVE",
                },
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            professeur: true,
                            academicYear: true,
                        },
                    },
                    schoolClass: true,
                    professeur: true,
                },
            });
            return {
                success: true,
                message: "Horaire créé avec succès",
                data: { schedule },
                metadata: {
                    dayOfWeek,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    classroom,
                    professeur: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
                    subject: assignment.subject.name,
                    class: schoolClass.name,
                    duration: `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes`,
                },
            };
        }
        catch (error) {
            console.error("Erreur création horaire:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Erreur lors de la création de l'horaire",
                code: error.code || "CREATE_ERROR",
                data: error.data,
            };
        }
    }
    /**
     * Met à jour un horaire - VERSION ISO
     */
    static async updateSchedule(id, data) {
        try {
            // Vérifier si l'horaire existe
            const existingSchedule = await prisma.schedule.findUnique({
                where: { id },
                include: {
                    classAssignment: {
                        include: {
                            professeur: true,
                            subject: true,
                        },
                    },
                    schoolClass: true,
                },
            });
            if (!existingSchedule) {
                throw {
                    status: 404,
                    message: "Horaire non trouvé",
                    code: "SCHEDULE_NOT_FOUND",
                };
            }
            // Variables pour les temps convertis
            let startTimeStr = existingSchedule.startTime;
            let endTimeStr = existingSchedule.endTime;
            // Convertir startTime si fourni
            if (data.startTime) {
                const { time: convertedStartTime } = this.convertISOTimeToHHMMSS(data.startTime);
                startTimeStr = convertedStartTime;
            }
            // Convertir endTime si fourni
            if (data.endTime) {
                const { time: convertedEndTime } = this.convertISOTimeToHHMMSS(data.endTime);
                endTimeStr = convertedEndTime;
            }
            // Vérifier la validité des heures
            const toMinutes = (time) => {
                const [hours, minutes, seconds] = time.split(":").map(Number);
                return hours * 60 + minutes + seconds / 60;
            };
            const startMinutes = toMinutes(startTimeStr);
            const endMinutes = toMinutes(endTimeStr);
            if (endMinutes <= startMinutes) {
                throw {
                    status: 400,
                    message: "L'heure de fin doit être après l'heure de début",
                    code: "INVALID_TIME_RANGE",
                };
            }
            const duration = endMinutes - startMinutes;
            if (duration < 30) {
                throw {
                    status: 400,
                    message: "Durée minimale: 30 minutes",
                    code: "MIN_DURATION_NOT_MET",
                };
            }
            if (duration > 240) {
                throw {
                    status: 400,
                    message: "Durée maximale: 4 heures",
                    code: "MAX_DURATION_EXCEEDED",
                };
            }
            // Vérifier les conflits (sauf avec lui-même)
            const conflictCheck = await this.checkScheduleConflicts(existingSchedule.professeurId, existingSchedule.classId, data.dayOfWeek || existingSchedule.dayOfWeek, data.startTime || `2000-01-01T${existingSchedule.startTime}Z`, data.endTime || `2000-01-01T${existingSchedule.endTime}Z`, data.classroom !== undefined
                ? data.classroom
                : existingSchedule.classroom, id);
            if (conflictCheck.hasConflict) {
                throw {
                    status: 409,
                    message: "Conflit d'horaire détecté",
                    code: "SCHEDULE_CONFLICT",
                    data: {
                        conflicts: conflictCheck.conflicts,
                    },
                };
            }
            // Préparer les données de mise à jour
            const updateData = {
                dayOfWeek: data.dayOfWeek || existingSchedule.dayOfWeek,
                startTime: startTimeStr,
                endTime: endTimeStr,
                classroom: data.classroom !== undefined
                    ? data.classroom
                    : existingSchedule.classroom,
                recurrence: data.recurrence !== undefined
                    ? data.recurrence
                    : existingSchedule.recurrence,
                untilDate: data.untilDate
                    ? new Date(data.untilDate)
                    : existingSchedule.untilDate,
                notes: data.notes !== undefined ? data.notes : existingSchedule.notes,
                status: data.status || existingSchedule.status,
            };
            // Mettre à jour l'horaire
            const schedule = await prisma.schedule.update({
                where: { id },
                data: updateData,
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            professeur: true,
                        },
                    },
                    schoolClass: true,
                    professeur: true,
                },
            });
            const changes = Object.keys(data)
                .filter((key) => data[key] !== undefined)
                .map((key) => `${key}: ${data[key]}`);
            return {
                success: true,
                message: "Horaire mis à jour avec succès",
                data: { schedule },
                metadata: {
                    changes,
                    duration: `${Math.round(duration)} minutes`,
                },
            };
        }
        catch (error) {
            console.error("Erreur mise à jour horaire:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Erreur lors de la mise à jour de l'horaire",
                code: error.code || "UPDATE_ERROR",
                data: error.data,
            };
        }
    }
    /**
     * Récupère tous les horaires
     */
    static async getAllSchedules(filters) {
        try {
            const { page = 1, limit = 20, classId, professeurId, dayOfWeek, status, academicYearId, } = filters;
            const pageNum = Math.max(1, parseInt(page.toString()));
            const limitNum = Math.max(1, Math.min(100, parseInt(limit.toString())));
            const skip = (pageNum - 1) * limitNum;
            const where = {};
            if (status)
                where.status = status;
            if (classId)
                where.classId = classId;
            if (professeurId)
                where.professeurId = professeurId;
            if (dayOfWeek)
                where.dayOfWeek = dayOfWeek;
            // Filtrer par année académique via l'assignation
            if (academicYearId) {
                const assignments = await prisma.classAssignment.findMany({
                    where: { academicYearId },
                    select: { id: true },
                });
                const assignmentIds = assignments.map((a) => a.id);
                where.assignmentId = { in: assignmentIds };
            }
            const [schedules, total] = await Promise.all([
                prisma.schedule.findMany({
                    where,
                    include: {
                        classAssignment: {
                            include: {
                                subject: true,
                                professeur: true,
                                academicYear: true,
                            },
                        },
                        schoolClass: true,
                        professeur: true,
                    },
                    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
                    skip,
                    take: limitNum,
                }),
                prisma.schedule.count({ where }),
            ]);
            // Formater les heures pour l'affichage
            const formattedSchedules = schedules.map((schedule) => ({
                ...schedule,
                displayStartTime: schedule.startTime,
                displayEndTime: schedule.endTime,
            }));
            return {
                success: true,
                message: "Horaires récupérés avec succès",
                data: {
                    schedules: formattedSchedules,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                },
            };
        }
        catch (error) {
            console.error("Erreur récupération horaires:", error);
            throw {
                status: 500,
                message: "Erreur lors de la récupération des horaires",
                code: "FETCH_ERROR",
            };
        }
    }
    /**
     * Récupère un horaire par ID
     */
    static async getScheduleById(id) {
        try {
            const schedule = await prisma.schedule.findUnique({
                where: { id },
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            professeur: true,
                            academicYear: true,
                        },
                    },
                    schoolClass: true,
                    professeur: true,
                },
            });
            if (!schedule) {
                throw {
                    status: 404,
                    message: "Horaire non trouvé",
                    code: "SCHEDULE_NOT_FOUND",
                };
            }
            // Formater les heures
            const formattedSchedule = {
                ...schedule,
                displayStartTime: schedule.startTime,
                displayEndTime: schedule.endTime,
            };
            return {
                success: true,
                message: "Horaire récupéré avec succès",
                data: { schedule: formattedSchedule },
            };
        }
        catch (error) {
            console.error("Erreur récupération horaire:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Erreur lors de la récupération de l'horaire",
                code: error.code || "FETCH_ERROR",
            };
        }
    }
    /**
     * Récupère l'emploi du temps d'une classe
     */
    static async getClassTimetable(classId, academicYearId) {
        try {
            const where = {
                classId,
                status: "ACTIVE",
            };
            // Filtrer par année académique via l'assignation
            if (academicYearId) {
                const assignments = await prisma.classAssignment.findMany({
                    where: { academicYearId },
                    select: { id: true },
                });
                const assignmentIds = assignments.map((a) => a.id);
                where.assignmentId = { in: assignmentIds };
            }
            const schedules = await prisma.schedule.findMany({
                where,
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            professeur: true,
                        },
                    },
                    schoolClass: true,
                    professeur: true,
                },
                orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            });
            // Organiser par jour de la semaine
            const timetableByDay = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
                SATURDAY: [],
                SUNDAY: [],
            };
            // Formater chaque horaire
            schedules.forEach((schedule) => {
                if (timetableByDay[schedule.dayOfWeek]) {
                    timetableByDay[schedule.dayOfWeek].push({
                        id: schedule.id,
                        subject: schedule.classAssignment.subject,
                        professeur: schedule.professeur,
                        classroom: schedule.classroom,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        displayStartTime: schedule.startTime,
                        displayEndTime: schedule.endTime,
                        status: schedule.status,
                        notes: schedule.notes,
                    });
                }
            });
            // Trier chaque jour par heure de début
            Object.keys(timetableByDay).forEach((day) => {
                timetableByDay[day].sort((a, b) => {
                    return a.startTime.localeCompare(b.startTime);
                });
            });
            // Calculer les statistiques
            const weekSummary = Object.keys(timetableByDay).reduce((acc, day) => {
                acc[day] = {
                    count: timetableByDay[day].length,
                    hours: timetableByDay[day].reduce((total, schedule) => {
                        const [startHour, startMinute] = schedule.startTime
                            .split(":")
                            .map(Number);
                        const [endHour, endMinute] = schedule.endTime
                            .split(":")
                            .map(Number);
                        return (total + (endHour - startHour) + (endMinute - startMinute) / 60);
                    }, 0),
                };
                return acc;
            }, {});
            return {
                success: true,
                message: "Emploi du temps récupéré",
                data: {
                    classId,
                    timetable: timetableByDay,
                    schedules,
                    totalSchedules: schedules.length,
                    weekSummary,
                },
            };
        }
        catch (error) {
            console.error("Erreur récupération emploi du temps:", error);
            throw {
                status: 500,
                message: "Erreur lors de la récupération de l'emploi du temps",
                code: "FETCH_TIMETABLE_ERROR",
            };
        }
    }
    /**
     * Génère un emploi du temps automatiquement
     */
    static async generateTimetable(data) {
        try {
            const { classId, academicYearId, constraints } = data;
            // Récupérer la classe
            const schoolClass = await prisma.schoolClass.findUnique({
                where: { id: classId },
            });
            if (!schoolClass) {
                throw {
                    status: 404,
                    message: "Classe non trouvée",
                    code: "CLASS_NOT_FOUND",
                };
            }
            // Récupérer toutes les assignations pour cette classe et année
            const assignments = await prisma.classAssignment.findMany({
                where: {
                    classLevel: schoolClass.level,
                    academicYearId,
                    status: "Active",
                },
                include: {
                    subject: true,
                    professeur: true,
                },
            });
            if (assignments.length === 0) {
                throw {
                    status: 404,
                    message: "Aucune assignation trouvée pour cette classe",
                    code: "NO_ASSIGNMENTS",
                };
            }
            // Configuration des créneaux
            const daysOfWeek = [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
            ];
            const timeSlots = [
                { start: "08:00:00", end: "09:30:00" },
                { start: "09:45:00", end: "11:15:00" },
                { start: "11:30:00", end: "13:00:00" },
                { start: "14:00:00", end: "15:30:00" },
                { start: "15:45:00", end: "17:15:00" },
            ];
            // Contraintes par défaut
            const defaultConstraints = {
                maxHoursPerDay: constraints?.maxHoursPerDay || 6,
                breakTime: constraints?.breakTime || { start: "12:00", end: "14:00" },
            };
            const generatedSchedules = [];
            const errors = [];
            const professeurAssignments = new Map();
            const classroomAssignments = new Map();
            // Tenter de placer chaque assignation
            for (const assignment of assignments) {
                let placed = false;
                for (const day of daysOfWeek) {
                    if (placed)
                        break;
                    for (const slot of timeSlots) {
                        if (placed)
                            break;
                        // Vérifier les contraintes de pause
                        if (defaultConstraints.breakTime) {
                            const breakStart = defaultConstraints.breakTime.start;
                            const breakEnd = defaultConstraints.breakTime.end;
                            const slotStartHour = parseInt(slot.start.split(":")[0]);
                            const slotStartMinute = parseInt(slot.start.split(":")[1]);
                            const breakStartHour = parseInt(breakStart.split(":")[0]);
                            const breakEndHour = parseInt(breakEnd.split(":")[0]);
                            if (slotStartHour >= breakStartHour &&
                                slotStartHour < breakEndHour) {
                                continue; // Skip les créneaux pendant la pause
                            }
                        }
                        // Créer les timestamps ISO pour la vérification
                        const isoStartTime = `2000-01-01T${slot.start}Z`;
                        const isoEndTime = `2000-01-01T${slot.end}Z`;
                        // Vérifier les conflits
                        const conflictCheck = await this.checkScheduleConflicts(assignment.professeurId, classId, day, isoStartTime, isoEndTime);
                        if (!conflictCheck.hasConflict) {
                            try {
                                // Assigner une salle disponible
                                const availableClassrooms = [
                                    "A101",
                                    "A102",
                                    "A103",
                                    "B201",
                                    "B202",
                                ];
                                const assignedClassroom = availableClassrooms.find((room) => !classroomAssignments
                                    .get(`${day}-${slot.start}`)
                                    ?.includes(room)) || "A101";
                                const schedule = await prisma.schedule.create({
                                    data: {
                                        assignmentId: assignment.id,
                                        classId,
                                        professeurId: assignment.professeurId,
                                        dayOfWeek: day,
                                        startTime: slot.start,
                                        endTime: slot.end,
                                        classroom: assignedClassroom,
                                        status: "ACTIVE",
                                        notes: "Généré automatiquement",
                                        recurrence: null,
                                        untilDate: null,
                                    },
                                });
                                generatedSchedules.push(schedule);
                                placed = true;
                                // Mettre à jour les compteurs
                                const professeurKey = `${assignment.professeurId}-${day}`;
                                professeurAssignments.set(professeurKey, (professeurAssignments.get(professeurKey) || 0) + 1);
                                const classroomKey = `${day}-${slot.start}`;
                                classroomAssignments.set(classroomKey, [
                                    ...(classroomAssignments.get(classroomKey) || []),
                                    assignedClassroom,
                                ]);
                            }
                            catch (error) {
                                errors.push({
                                    assignmentId: assignment.id,
                                    subject: assignment.subject.name,
                                    error: error.message,
                                });
                            }
                        }
                    }
                }
                if (!placed) {
                    errors.push({
                        assignmentId: assignment.id,
                        subject: assignment.subject.name,
                        message: `Impossible de placer ${assignment.subject.name}`,
                    });
                }
            }
            const totalAssignments = assignments.length;
            const successfullyPlaced = generatedSchedules.length;
            const successRate = (successfullyPlaced / totalAssignments) * 100;
            return {
                success: true,
                message: `Emploi du temps généré avec ${successfullyPlaced} créneaux sur ${totalAssignments} assignations`,
                data: {
                    schedules: generatedSchedules,
                    errors,
                    statistics: {
                        totalAssignments,
                        successfullyPlaced,
                        failed: errors.length,
                        successRate: Math.round(successRate * 100) / 100,
                    },
                },
                metadata: {
                    classId,
                    academicYearId,
                    generated: successfullyPlaced,
                    errors: errors.length,
                    successRate: `${Math.round(successRate)}%`,
                },
            };
        }
        catch (error) {
            console.error("Erreur génération emploi du temps:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Erreur lors de la génération de l'emploi du temps",
                code: error.code || "GENERATION_ERROR",
            };
        }
    }
    /**
     * Récupère l'emploi du temps d'un professeur
     */
    static async getProfessorSchedule(professeurId, filters) {
        try {
            const { startDate, endDate } = filters || {};
            const where = {
                professeurId,
                status: "ACTIVE",
            };
            if (startDate && endDate) {
                where.createdAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }
            const schedules = await prisma.schedule.findMany({
                where,
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            academicYear: true,
                        },
                    },
                    schoolClass: true,
                },
                orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            });
            // Organiser par jour
            const scheduleByDay = {};
            schedules.forEach((schedule) => {
                if (!scheduleByDay[schedule.dayOfWeek]) {
                    scheduleByDay[schedule.dayOfWeek] = [];
                }
                scheduleByDay[schedule.dayOfWeek].push({
                    ...schedule,
                    displayStartTime: schedule.startTime,
                    displayEndTime: schedule.endTime,
                });
            });
            // Calculer les heures totales
            const weeklyHours = schedules.reduce((total, s) => {
                const [startHour, startMinute] = s.startTime.split(":").map(Number);
                const [endHour, endMinute] = s.endTime.split(":").map(Number);
                const hours = endHour - startHour + (endMinute - startMinute) / 60;
                return total + hours;
            }, 0);
            return {
                success: true,
                message: "Emploi du temps du professeur récupéré",
                data: {
                    schedules,
                    scheduleByDay,
                    totalSchedules: schedules.length,
                    weeklyHours: Math.round(weeklyHours * 100) / 100,
                    dailyAverage: Math.round((weeklyHours / Object.keys(scheduleByDay).length) * 100) / 100,
                },
            };
        }
        catch (error) {
            console.error("Erreur récupération emploi du temps professeur:", error);
            throw {
                status: 500,
                message: "Erreur lors de la récupération de l'emploi du temps du professeur",
                code: "FETCH_PROFESSOR_SCHEDULE_ERROR",
            };
        }
    }
    /**
     * Vérifie les conflits d'horaire
     */
    static async checkConflicts(filters) {
        try {
            const { professeurId, classId, dayOfWeek, startTime, endTime, classroom, excludeScheduleId, } = filters;
            const conflictCheck = await this.checkScheduleConflicts(professeurId, classId, dayOfWeek, startTime, endTime, classroom, excludeScheduleId);
            return {
                success: true,
                message: conflictCheck.hasConflict
                    ? "Conflits détectés"
                    : "Aucun conflit",
                data: conflictCheck,
            };
        }
        catch (error) {
            console.error("Erreur vérification conflits:", error);
            throw {
                status: 500,
                message: "Erreur lors de la vérification des conflits",
                code: "CHECK_CONFLICTS_ERROR",
            };
        }
    }
    /**
     * Récupère les créneaux disponibles
     */
    static async getAvailableTimeSlots(filters) {
        try {
            const { classId, dayOfWeek, professeurId, classroom } = filters;
            // Créneaux de base
            const baseTimeSlots = [
                { start: "08:00:00", end: "09:30:00" },
                { start: "09:45:00", end: "11:15:00" },
                { start: "11:30:00", end: "13:00:00" },
                { start: "14:00:00", end: "15:30:00" },
                { start: "15:45:00", end: "17:15:00" },
            ];
            // Récupérer les créneaux occupés
            const where = { status: "ACTIVE" };
            if (dayOfWeek)
                where.dayOfWeek = dayOfWeek;
            if (classId)
                where.classId = classId;
            if (professeurId)
                where.professeurId = professeurId;
            if (classroom)
                where.classroom = classroom;
            const occupiedSchedules = await prisma.schedule.findMany({
                where,
                select: {
                    startTime: true,
                    endTime: true,
                },
            });
            // Filtrer les créneaux disponibles
            const availableSlots = baseTimeSlots.filter((slot) => {
                return !occupiedSchedules.some((occupied) => {
                    return this.checkTimeOverlap(occupied.startTime, occupied.endTime, slot.start, slot.end);
                });
            });
            // Formater les créneaux pour l'affichage
            const formattedSlots = availableSlots.map((slot) => ({
                ...slot,
                displayStartTime: slot.start.substring(0, 5), // HH:MM
                displayEndTime: slot.end.substring(0, 5), // HH:MM
                duration: `${(parseInt(slot.end.split(":")[0]) -
                    parseInt(slot.start.split(":")[0])) *
                    60 +
                    (parseInt(slot.end.split(":")[1]) -
                        parseInt(slot.start.split(":")[1]))} minutes`,
            }));
            return {
                success: true,
                message: "Créneaux disponibles récupérés",
                data: {
                    dayOfWeek,
                    availableSlots: formattedSlots,
                    totalAvailable: formattedSlots.length,
                    totalBase: baseTimeSlots.length,
                    occupancyRate: ((baseTimeSlots.length - formattedSlots.length) /
                        baseTimeSlots.length) *
                        100,
                },
            };
        }
        catch (error) {
            console.error("Erreur récupération créneaux disponibles:", error);
            throw {
                status: 500,
                message: "Erreur lors de la récupération des créneaux disponibles",
                code: "FETCH_AVAILABLE_SLOTS_ERROR",
            };
        }
    }
    /**
     * Supprime un horaire
     */
    static async deleteSchedule(id) {
        try {
            // Vérifier si l'horaire existe
            const schedule = await prisma.schedule.findUnique({
                where: { id },
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                        },
                    },
                    schoolClass: true,
                },
            });
            if (!schedule) {
                throw {
                    status: 404,
                    message: "Horaire non trouvé",
                    code: "SCHEDULE_NOT_FOUND",
                };
            }
            // Supprimer l'horaire
            await prisma.schedule.delete({
                where: { id },
            });
            return {
                success: true,
                message: "Horaire supprimé avec succès",
                metadata: {
                    subject: schedule.classAssignment.subject.name,
                    class: schedule.schoolClass.name,
                    dayOfWeek: schedule.dayOfWeek,
                    time: `${schedule.startTime.substring(0, 5)} - ${schedule.endTime.substring(0, 5)}`,
                },
            };
        }
        catch (error) {
            console.error("Erreur suppression horaire:", error);
            throw {
                status: error.status || 500,
                message: error.message || "Erreur lors de la suppression de l'horaire",
                code: error.code || "DELETE_ERROR",
            };
        }
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=scheduleService.js.map