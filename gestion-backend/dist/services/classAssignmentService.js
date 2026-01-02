"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassAssignmentService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Fonction utilitaire pour les niveaux de classe valides
const VALID_CLASS_LEVELS = [
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
const isValidClassLevel = (level) => {
    return VALID_CLASS_LEVELS.includes(level);
};
/**
 * Service pour les opérations CRUD des assignations de classes
 */
class ClassAssignmentService {
    /**
     * Récupère la liste des assignations avec filtres et pagination
     */
    static async getClassAssignments(filters) {
        try {
            const { page = 1, limit = 20, search, classLevel, academicYearId, professeurId, subjectId, status, sortBy = "createdAt", sortOrder = "desc", } = filters;
            const skip = (page - 1) * limit;
            // Construction des filtres
            const where = {};
            // Filtrer par statut si fourni
            if (status && (status === "Active" || status === "Inactive")) {
                where.status = status;
            }
            // Filtrer par niveau de classe
            if (classLevel && classLevel !== "all" && isValidClassLevel(classLevel)) {
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
                                {
                                    firstName: { contains: search, mode: "insensitive" },
                                },
                                {
                                    lastName: { contains: search, mode: "insensitive" },
                                },
                                { email: { contains: search, mode: "insensitive" } },
                                {
                                    matricule: { contains: search, mode: "insensitive" },
                                },
                            ],
                        },
                    },
                    {
                        academicYear: {
                            year: { contains: search, mode: "insensitive" },
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
            else if (sortBy === "academicYear") {
                orderBy.academicYear = { year: sortOrder };
            }
            else {
                orderBy[sortBy] = sortOrder;
            }
            // Récupération avec pagination
            const [assignments, total] = await Promise.all([
                prisma_1.default.classAssignment.findMany({
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
                    take: limit,
                }),
                prisma_1.default.classAssignment.count({ where }),
            ]);
            return {
                success: true,
                message: "Assignations récupérées avec succès",
                data: {
                    assignments,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                    filters: {
                        classLevel: classLevel || null,
                        status: status || null,
                        search: search || null,
                    },
                },
            };
        }
        catch (error) {
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
    /**
     * Récupère une assignation par ID
     */
    static async getClassAssignmentById(id) {
        try {
            const assignment = await prisma_1.default.classAssignment.findUnique({
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
        catch (error) {
            if (error.status === 404)
                throw error;
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
    /**
     * Crée une nouvelle assignation avec transaction
     */
    static async createClassAssignment(data) {
        return await prisma_1.default.$transaction(async (tx) => {
            try {
                const { subjectId, professeurId, classLevel, academicYearId, status = "Active", } = data;
                // Validation de l'unicité
                const existingAssignment = await tx.classAssignment.findFirst({
                    where: {
                        subjectId,
                        classLevel,
                        academicYearId,
                        professeurId,
                    },
                });
                if (existingAssignment) {
                    throw {
                        status: 409,
                        response: {
                            success: false,
                            message: "Cette assignation existe déjà",
                            code: "ASSIGNMENT_EXISTS",
                        },
                    };
                }
                // Vérifier les relations simultanément
                const [subject, professeur, academicYear] = await Promise.all([
                    tx.subject.findUnique({ where: { id: subjectId } }),
                    tx.professeur.findUnique({ where: { id: professeurId } }),
                    tx.academicYear.findUnique({ where: { id: academicYearId } }),
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
                // Vérifier si le professeur est actif
                if (professeur.status !== "Actif") {
                    throw {
                        status: 400,
                        response: {
                            success: false,
                            message: "Le professeur n'est pas actif",
                            code: "PROFESSEUR_INACTIVE",
                        },
                    };
                }
                // Créer l'assignation
                const assignment = await tx.classAssignment.create({
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
            catch (error) {
                if (error.status === 404 ||
                    error.status === 409 ||
                    error.status === 400) {
                    throw error;
                }
                throw {
                    status: 500,
                    response: {
                        success: false,
                        message: "Erreur interne du serveur",
                        code: "INTERNAL_SERVER_ERROR",
                    },
                };
            }
        });
    }
    /**
     * Met à jour une assignation avec transaction
     */
    static async updateClassAssignment(id, data) {
        return await prisma_1.default.$transaction(async (tx) => {
            try {
                // Vérifier si l'assignation existe
                const existingAssignment = await tx.classAssignment.findUnique({
                    where: { id },
                    include: {
                        subject: true,
                        professeur: true,
                    },
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
                // Préparer les données de mise à jour
                const updateData = {};
                // Appliquer les mises à jour seulement si fournies
                if (data.subjectId !== undefined)
                    updateData.subjectId = data.subjectId;
                if (data.professeurId !== undefined)
                    updateData.professeurId = data.professeurId;
                if (data.classLevel !== undefined)
                    updateData.classLevel = data.classLevel;
                if (data.academicYearId !== undefined)
                    updateData.academicYearId = data.academicYearId;
                if (data.status !== undefined)
                    updateData.status = data.status;
                // Vérifier l'unicité si les champs changent
                const whereConditions = {
                    id: { not: id },
                };
                if (data.subjectId ||
                    updateData.subjectId === existingAssignment.subjectId) {
                    whereConditions.subjectId =
                        data.subjectId || existingAssignment.subjectId;
                }
                if (data.classLevel ||
                    updateData.classLevel === existingAssignment.classLevel) {
                    whereConditions.classLevel =
                        data.classLevel || existingAssignment.classLevel;
                }
                if (data.academicYearId ||
                    updateData.academicYearId === existingAssignment.academicYearId) {
                    whereConditions.academicYearId =
                        data.academicYearId || existingAssignment.academicYearId;
                }
                if (data.professeurId ||
                    updateData.professeurId === existingAssignment.professeurId) {
                    whereConditions.professeurId =
                        data.professeurId || existingAssignment.professeurId;
                }
                if (Object.keys(whereConditions).length > 1) {
                    const duplicateAssignment = await tx.classAssignment.findFirst({
                        where: whereConditions,
                    });
                    if (duplicateAssignment) {
                        throw {
                            status: 409,
                            response: {
                                success: false,
                                message: "Cette assignation existe déjà",
                                code: "ASSIGNMENT_EXISTS",
                            },
                        };
                    }
                }
                // Vérifier les nouvelles relations si fournies
                if (data.subjectId) {
                    const subject = await tx.subject.findUnique({
                        where: { id: data.subjectId },
                    });
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
                }
                if (data.professeurId) {
                    const professeur = await tx.professeur.findUnique({
                        where: { id: data.professeurId },
                    });
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
                    if (data.professeurId !== existingAssignment.professeurId &&
                        professeur.status !== "Actif") {
                        throw {
                            status: 400,
                            response: {
                                success: false,
                                message: "Le professeur n'est pas actif",
                                code: "PROFESSEUR_INACTIVE",
                            },
                        };
                    }
                }
                if (data.academicYearId) {
                    const academicYear = await tx.academicYear.findUnique({
                        where: { id: data.academicYearId },
                    });
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
                }
                // Mettre à jour l'assignation
                const assignment = await tx.classAssignment.update({
                    where: { id },
                    data: updateData,
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
            catch (error) {
                if (error.status === 404 ||
                    error.status === 409 ||
                    error.status === 400) {
                    throw error;
                }
                throw {
                    status: 500,
                    response: {
                        success: false,
                        message: "Erreur interne du serveur",
                        code: "INTERNAL_SERVER_ERROR",
                    },
                };
            }
        });
    }
    /**
     * Supprime une assignation avec vérification des dépendances
     */
    static async deleteClassAssignment(id) {
        return await prisma_1.default.$transaction(async (tx) => {
            try {
                // Vérifier si l'assignation existe avec les dépendances
                const assignment = await tx.classAssignment.findUnique({
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
                // Vérifier les dépendances avec des messages détaillés
                if (assignment._count.schedules > 0) {
                    throw {
                        status: 400,
                        response: {
                            success: false,
                            message: "Impossible de supprimer: des cours sont planifiés",
                            code: "HAS_SCHEDULES",
                            data: {
                                schedulesCount: assignment._count.schedules,
                                suggestion: "Supprimez d'abord les cours planifiés avant de supprimer cette assignation.",
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
                                suggestion: "Archivez les notes ou transférez-les à une autre assignation avant de supprimer.",
                            },
                        },
                    };
                }
                // Supprimer l'assignation
                await tx.classAssignment.delete({
                    where: { id },
                });
                return {
                    success: true,
                    message: "Assignation supprimée avec succès",
                    data: {
                        deletedId: id,
                        subjectName: assignment.subject?.name,
                        classLevel: assignment.classLevel,
                    },
                };
            }
            catch (error) {
                if (error.status === 404 || error.status === 400) {
                    throw error;
                }
                throw {
                    status: 500,
                    response: {
                        success: false,
                        message: "Erreur interne du serveur",
                        code: "INTERNAL_SERVER_ERROR",
                    },
                };
            }
        });
    }
    /**
     * Récupère les assignations d'un professeur
     */
    static async getClassAssignmentsByProfessor(professeurId, academicYearId) {
        try {
            const where = {
                professeurId,
            };
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            // Vérifier d'abord si le professeur existe
            const professeur = await prisma_1.default.professeur.findUnique({
                where: { id: professeurId },
            });
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
            const assignments = await prisma_1.default.classAssignment.findMany({
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
                orderBy: [
                    { academicYear: { startDate: "desc" } },
                    { classLevel: "asc" },
                ],
            });
            return {
                success: true,
                message: "Assignations du professeur récupérées",
                data: {
                    professeur: {
                        id: professeur.id,
                        firstName: professeur.firstName,
                        lastName: professeur.lastName,
                        email: professeur.email,
                        status: professeur.status,
                    },
                    assignments,
                    total: assignments.length,
                },
            };
        }
        catch (error) {
            if (error.status === 404)
                throw error;
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
    /**
     * Récupère les assignations disponibles pour un niveau
     */
    static async getAvailableAssignments(classLevel, academicYearId) {
        try {
            if (!isValidClassLevel(classLevel)) {
                throw {
                    status: 400,
                    response: {
                        success: false,
                        message: "Niveau de classe invalide",
                        code: "INVALID_CLASS_LEVEL",
                        data: {
                            received: classLevel,
                            validLevels: VALID_CLASS_LEVELS,
                        },
                    },
                };
            }
            const where = {
                classLevel,
                status: "Active",
            };
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            // Assignations existantes
            const existingAssignments = await prisma_1.default.classAssignment.findMany({
                where,
                select: {
                    subjectId: true,
                    professeurId: true,
                },
            });
            const assignedSubjectIds = existingAssignments.map((a) => a.subjectId);
            const assignedProfesseurIds = existingAssignments.map((a) => a.professeurId);
            // Toutes les matières
            const allSubjects = await prisma_1.default.subject.findMany({
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
            // Professeurs disponibles (actifs et non assignés à ce niveau dans cette année)
            const professeurs = await prisma_1.default.professeur.findMany({
                where: {
                    status: "Actif",
                    id: {
                        notIn: academicYearId ? assignedProfesseurIds : [],
                    },
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    speciality: true,
                    matricule: true,
                },
                orderBy: { lastName: "asc" },
            });
            // Années académiques actives
            const academicYears = await prisma_1.default.academicYear.findMany({
                where: {
                    isCurrent: true,
                },
                select: {
                    id: true,
                    year: true,
                    startDate: true,
                    endDate: true,
                },
                orderBy: { year: "desc" },
            });
            return {
                success: true,
                message: "Données pour assignation récupérées",
                data: {
                    subjects: allSubjects,
                    professeurs,
                    academicYears,
                    assignedSubjectIds,
                    classLevel,
                    academicYearId: academicYearId || academicYears[0]?.id,
                },
            };
        }
        catch (error) {
            if (error.status === 400)
                throw error;
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
    /**
     * Récupère les assignations d'une classe
     */
    static async getClassAssignmentsByClass(classId, academicYearId, level) {
        try {
            // Trouver le niveau de la classe
            const schoolClass = await prisma_1.default.schoolClass.findUnique({
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
                classLevel: level || schoolClass.level,
            };
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            const assignments = await prisma_1.default.classAssignment.findMany({
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
        catch (error) {
            if (error.status === 404)
                throw error;
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
    /**
     * Récupère les assignations d'une classe et d'un niveau spécifiques
     */
    static async getClassAssignmentsByClassAndLevel(classId, classLevel, academicYearId) {
        try {
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
            if (!isValidClassLevel(classLevel)) {
                throw {
                    status: 400,
                    response: {
                        success: false,
                        message: "Niveau de classe invalide",
                        code: "INVALID_CLASS_LEVEL",
                        data: {
                            received: classLevel,
                            validLevels: VALID_CLASS_LEVELS,
                        },
                    },
                };
            }
            const where = {
                classLevel: classLevel,
            };
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            const assignments = await prisma_1.default.classAssignment.findMany({
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
        catch (error) {
            if (error.status === 400)
                throw error;
            throw {
                status: 500,
                response: {
                    success: false,
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            };
        }
    }
}
exports.ClassAssignmentService = ClassAssignmentService;
//# sourceMappingURL=classAssignmentService.js.map