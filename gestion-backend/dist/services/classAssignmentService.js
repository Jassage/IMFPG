"use strict";
/**
 * @file classAssignmentService.ts
 * @description Service pour la gestion des assignations de cours aux classes
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassAssignmentService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const isValidClassLevel = (level) => {
    const validLevels = [
        "Sixieme",
        "Cinquieme",
        "Quatrieme",
        "Troisieme",
        "Seconde",
        "Premiere",
        "Terminale",
        "NSI",
        "NSII",
        "NSIII",
        "NSIV",
    ];
    return validLevels.includes(level);
};
/**
 * Service pour les opérations CRUD des assignations de classes
 */
class ClassAssignmentService {
    /**
     * Récupère la liste des assignations avec filtres et pagination
     */
    static async getClassAssignments(filters) {
        const { page = 1, limit = 20, search, classLevel, academicYearId, professeurId, subjectId, status, sortBy = "createdAt", sortOrder = "desc", } = filters;
        const pageNum = parseInt(page.toString());
        const limitNum = parseInt(limit.toString());
        const skip = (pageNum - 1) * limitNum;
        // Construction des filtres
        const where = {};
        // Filtrer par statut si fourni
        if (status) {
            where.status = status;
        }
        // Ne pas inclure classLevel si la valeur est "all" ou vide
        if (classLevel && classLevel !== "all" && classLevel !== "") {
            // Validation du niveau de classe
            if (!isValidClassLevel(classLevel)) {
                throw {
                    status: 400,
                    response: {
                        success: false,
                        message: "Niveau de classe invalide",
                        code: "INVALID_CLASS_LEVEL",
                        data: {
                            received: classLevel,
                            validLevels: [
                                "Sixieme",
                                "Cinquieme",
                                "Quatrieme",
                                "Troisieme",
                                "Seconde",
                                "Premiere",
                                "Terminale",
                                "NSI",
                                "NSII",
                                "NSIII",
                                "NSIV",
                            ],
                        },
                    },
                };
            }
            where.classLevel = classLevel;
        }
        // Autres filtres
        if (academicYearId)
            where.academicYearId = academicYearId;
        if (professeurId)
            where.professeurId = professeurId;
        if (subjectId)
            where.subjectId = subjectId;
        // Filtre de recherche
        if (search) {
            where.OR = [
                {
                    subject: {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { code: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
                {
                    professeur: {
                        OR: [
                            { firstName: { contains: search, mode: "insensitive" } },
                            { lastName: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
            ];
        }
        // Déterminer l'ordre de tri
        const orderBy = {};
        if (sortBy === "subject") {
            orderBy.subject = { name: sortOrder };
        }
        else if (sortBy === "professeur") {
            orderBy.professeur = { lastName: sortOrder };
        }
        else if (sortBy === "classLevel") {
            orderBy.classLevel = sortOrder;
        }
        else if (sortBy === "academicYear") {
            orderBy.academicYear = { year: sortOrder };
        }
        else {
            orderBy[sortBy] = sortOrder;
        }
        // Récupération avec pagination
        const [assignments, total] = await Promise.all([
            prisma.classAssignment.findMany({
                where,
                include: {
                    subject: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            type: true,
                            coefficient: true,
                        },
                    },
                    professeur: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            matricule: true,
                            status: true,
                            speciality: true,
                        },
                    },
                    academicYear: {
                        select: {
                            id: true,
                            year: true,
                            isCurrent: true,
                            startDate: true,
                            endDate: true,
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
        return {
            success: true,
            message: "Assignations récupérées avec succès",
            data: {
                assignments,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
                filters: {
                    classLevel: classLevel || null,
                    status: status || null,
                    search: search || null,
                },
            },
        };
    }
    /**
     * Récupère une assignation par ID
     */
    static async getClassAssignmentById(id) {
        const assignment = await prisma.classAssignment.findUnique({
            where: { id },
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        type: true,
                        coefficient: true,
                        passingGrade: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                professeur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        matricule: true,
                        speciality: true,
                        status: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                        startDate: true,
                        endDate: true,
                        isCurrent: true,
                    },
                },
                schedules: {
                    include: {
                        schoolClass: true,
                    },
                    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
                },
                grades: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentCode: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        schedules: true,
                        grades: true,
                    },
                },
            },
        });
        if (!assignment) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Assignation non trouvée",
                    code: "ASSIGNMENT_NOT_FOUND",
                },
            };
        }
        return {
            success: true,
            message: "Assignation récupérée avec succès",
            data: { assignment },
        };
    }
    /**
     * Crée une nouvelle assignation
     */
    static async createClassAssignment(data) {
        const { subjectId, professeurId, classLevel, academicYearId, status = "Active", } = data;
        // Validation de l'unicité
        const existingAssignment = await prisma.classAssignment.findFirst({
            where: {
                subjectId,
                classLevel,
                academicYearId,
                professeurId,
            },
        });
        if (existingAssignment) {
            throw {
                status: 400,
                response: {
                    success: false,
                    message: "Cette assignation existe déjà",
                    code: "ASSIGNMENT_EXISTS",
                },
            };
        }
        // Vérifier les relations
        const [subject, professeur, academicYear] = await Promise.all([
            prisma.subject.findUnique({ where: { id: subjectId } }),
            prisma.professeur.findUnique({ where: { id: professeurId } }),
            prisma.academicYear.findUnique({ where: { id: academicYearId } }),
        ]);
        if (!subject) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                },
            };
        }
        if (!professeur) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Professeur non trouvé",
                    code: "PROFESSEUR_NOT_FOUND",
                },
            };
        }
        if (!academicYear) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Année académique non trouvée",
                    code: "ACADEMIC_YEAR_NOT_FOUND",
                },
            };
        }
        // Créer l'assignation
        const assignment = await prisma.classAssignment.create({
            data: {
                subjectId,
                professeurId,
                classLevel,
                academicYearId,
                status,
            },
            include: {
                subject: true,
                professeur: true,
                academicYear: true,
            },
        });
        return {
            success: true,
            message: "Assignation créée avec succès",
            data: { assignment },
        };
    }
    /**
     * Met à jour une assignation
     */
    static async updateClassAssignment(id, data) {
        // Vérifier si l'assignation existe
        const existingAssignment = await prisma.classAssignment.findUnique({
            where: { id },
        });
        if (!existingAssignment) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Assignation non trouvée",
                    code: "ASSIGNMENT_NOT_FOUND",
                },
            };
        }
        // Vérifier l'unicité si les champs changent
        if (data.subjectId ||
            data.professeurId ||
            data.classLevel ||
            data.academicYearId) {
            const duplicateAssignment = await prisma.classAssignment.findFirst({
                where: {
                    id: { not: id },
                    subjectId: data.subjectId || existingAssignment.subjectId,
                    classLevel: data.classLevel || existingAssignment.classLevel,
                    academicYearId: data.academicYearId || existingAssignment.academicYearId,
                    professeurId: data.professeurId || existingAssignment.professeurId,
                },
            });
            if (duplicateAssignment) {
                throw {
                    status: 400,
                    response: {
                        success: false,
                        message: "Cette assignation existe déjà",
                        code: "ASSIGNMENT_EXISTS",
                    },
                };
            }
        }
        // Mettre à jour l'assignation
        const assignment = await prisma.classAssignment.update({
            where: { id },
            data: {
                subjectId: data.subjectId,
                professeurId: data.professeurId,
                classLevel: data.classLevel,
                academicYearId: data.academicYearId,
                status: data.status,
            },
            include: {
                subject: true,
                professeur: true,
                academicYear: true,
            },
        });
        return {
            success: true,
            message: "Assignation mise à jour avec succès",
            data: { assignment },
        };
    }
    /**
     * Supprime une assignation
     */
    static async deleteClassAssignment(id) {
        // Vérifier si l'assignation existe
        const assignment = await prisma.classAssignment.findUnique({
            where: { id },
            include: {
                subject: true,
                professeur: true,
                _count: {
                    select: {
                        schedules: true,
                        grades: true,
                    },
                },
            },
        });
        if (!assignment) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Assignation non trouvée",
                    code: "ASSIGNMENT_NOT_FOUND",
                },
            };
        }
        // Vérifier les dépendances
        if (assignment._count.schedules > 0) {
            throw {
                status: 400,
                response: {
                    success: false,
                    message: "Impossible de supprimer: des cours sont planifiés",
                    code: "HAS_SCHEDULES",
                    data: {
                        schedulesCount: assignment._count.schedules,
                    },
                },
            };
        }
        if (assignment._count.grades > 0) {
            throw {
                status: 400,
                response: {
                    success: false,
                    message: "Impossible de supprimer: des notes sont associées",
                    code: "HAS_GRADES",
                    data: {
                        gradesCount: assignment._count.grades,
                    },
                },
            };
        }
        // Supprimer l'assignation
        await prisma.classAssignment.delete({
            where: { id },
        });
        return {
            success: true,
            message: "Assignation supprimée avec succès",
        };
    }
    /**
     * Récupère les assignations d'une classe
     */
    static async getClassAssignmentsByClass(classId, filters) {
        const { academicYearId, level } = filters;
        // Trouver le niveau de la classe
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: classId },
        });
        if (!schoolClass) {
            throw {
                status: 404,
                response: {
                    success: false,
                    message: "Classe non trouvée",
                    code: "CLASS_NOT_FOUND",
                },
            };
        }
        const where = {
            // Utiliser le niveau fourni en paramètre ou celui de la classe
            classLevel: level || schoolClass.level,
        };
        if (academicYearId) {
            where.academicYearId = academicYearId;
        }
        const assignments = await prisma.classAssignment.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        type: true,
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
                academicYear: true,
                _count: {
                    select: {
                        schedules: true,
                    },
                },
            },
            orderBy: {
                subject: { name: "asc" },
            },
        });
        return {
            success: true,
            message: "Assignations de la classe récupérées",
            data: {
                class: schoolClass,
                assignments,
                total: assignments.length,
            },
        };
    }
    /**
     * Récupère les assignations d'un professeur
     */
    static async getClassAssignmentsByProfessor(professeurId, academicYearId) {
        const where = {
            professeurId,
        };
        if (academicYearId) {
            where.academicYearId = academicYearId;
        }
        const assignments = await prisma.classAssignment.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        type: true,
                        coefficient: true,
                    },
                },
                academicYear: true,
                _count: {
                    select: {
                        schedules: true,
                        grades: true,
                    },
                },
            },
            orderBy: [{ academicYear: { startDate: "desc" } }, { classLevel: "asc" }],
        });
        return {
            success: true,
            message: "Assignations du professeur récupérées",
            data: {
                assignments,
                total: assignments.length,
            },
        };
    }
    /**
     * Récupère les assignations disponibles pour un niveau
     */
    static async getAvailableAssignments(classLevel, academicYearId) {
        const where = {
            classLevel,
            status: "Active",
        };
        if (academicYearId) {
            where.academicYearId = academicYearId;
        }
        // Assignations existantes
        const existingAssignments = await prisma.classAssignment.findMany({
            where,
            select: {
                subjectId: true,
            },
        });
        const assignedSubjectIds = existingAssignments.map((a) => a.subjectId);
        // Toutes les matières
        const allSubjects = await prisma.subject.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                type: true,
                coefficient: true,
                description: true,
            },
            orderBy: { name: "asc" },
        });
        // Professeurs disponibles
        const professeurs = await prisma.professeur.findMany({
            where: {
                status: "Actif",
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                speciality: true,
            },
            orderBy: { lastName: "asc" },
        });
        return {
            success: true,
            message: "Données pour assignation récupérées",
            data: {
                subjects: allSubjects,
                professeurs,
                assignedSubjectIds,
                classLevel,
                academicYearId,
            },
        };
    }
    /**
     * Récupère les assignations d'une classe et d'un niveau spécifiques
     */
    static async getClassAssignmentsByClassAndLevel(classId, classLevel, academicYearId) {
        if (!classLevel) {
            throw {
                status: 400,
                response: {
                    success: false,
                    message: "Le niveau est requis",
                    code: "LEVEL_REQUIRED",
                },
            };
        }
        const where = {
            classLevel: classLevel,
        };
        if (academicYearId) {
            where.academicYearId = academicYearId;
        }
        const assignments = await prisma.classAssignment.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        type: true,
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
                academicYear: true,
                _count: {
                    select: {
                        schedules: true,
                    },
                },
            },
            orderBy: {
                subject: { name: "asc" },
            },
        });
        return {
            success: true,
            message: "Assignations filtrées récupérées",
            data: {
                assignments,
                total: assignments.length,
                classId,
                classLevel,
            },
        };
    }
}
exports.ClassAssignmentService = ClassAssignmentService;
//# sourceMappingURL=classAssignmentService.js.map