"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeanFaculty = exports.getFacultyStats = exports.deleteFaculty = exports.getFacultyById = exports.getFaculties = exports.updateFaculty = exports.createFaculty = void 0;
const prisma_1 = require("../../generated/prisma");
const zod_1 = require("zod");
const auditController_1 = require("./auditController");
const prisma = new prisma_1.PrismaClient();
// Fonction utilitaire pour gérer les erreurs unknown
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    else if (typeof error === "string") {
        return error;
    }
    else if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    else {
        return "Erreur inconnue";
    }
};
// Schéma de validation Zod
const facultySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    code: zod_1.z.string().min(2, "Le code doit contenir au moins 2 caractères"),
    description: zod_1.z.string().optional(),
    dean: zod_1.z.string().optional(),
    deanId: zod_1.z.string().nullable().optional(),
    studyDuration: zod_1.z
        .number()
        .int()
        .min(1)
        .max(5, "La durée doit être entre 1 et 5 ans"),
    status: zod_1.z.enum(["Active", "Inactive"]).default("Active"),
});
// Créer une nouvelle faculté
const createFaculty = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { name, code, description, studyDuration, status = "Active", deanId, // Recevoir deanId depuis le body
         } = req.body;
        console.log("📨 Données reçues:", req.body);
        // Validation des champs obligatoires
        if (!name || !code) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_FACULTY_ATTEMPT",
                entity: "Faculty",
                description: "Tentative de création de faculté - champs obligatoires manquants",
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Le nom et le code sont obligatoires",
            });
        }
        // Vérifier si le code existe déjà
        const existingFaculty = await prisma.faculty.findUnique({
            where: { code },
        });
        if (existingFaculty) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_FACULTY_ATTEMPT",
                entity: "Faculty",
                description: `Tentative de création de faculté - code ${code} déjà existant`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Une faculté avec ce code existe déjà",
            });
        }
        // Vérifier si le doyen existe (si deanId est fourni)
        if (deanId) {
            const deanExists = await prisma.user.findUnique({
                where: { id: deanId },
            });
            if (!deanExists) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "CREATE_FACULTY_ATTEMPT",
                    entity: "Faculty",
                    description: `Tentative de création de faculté - doyen ${deanId} non trouvé`,
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "L'utilisateur spécifié comme doyen n'existe pas",
                });
            }
            // Vérifier si l'utilisateur a le rôle Doyen
            if (deanExists.role !== "Doyen") {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "CREATE_FACULTY_ATTEMPT",
                    entity: "Faculty",
                    description: `Tentative de création de faculté - utilisateur ${deanId} n'a pas le rôle Doyen`,
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "L'utilisateur doit avoir le rôle 'Doyen'",
                });
            }
        }
        // Préparer les données pour la création
        const facultyData = {
            name,
            code,
            description: description || null,
            studyDuration: parseInt(studyDuration) || 4,
            status,
        };
        // Ajouter la relation avec le doyen si deanId est fourni
        if (deanId) {
            facultyData.dean = {
                connect: { id: deanId },
            };
        }
        // Ajouter les niveaux basés sur la durée d'étude
        const levels = Array.from({ length: facultyData.studyDuration }, (_, i) => ({
            level: `L${i + 1}`,
        }));
        facultyData.levels = {
            create: levels,
        };
        // Créer la faculté
        const faculty = await prisma.faculty.create({
            data: facultyData,
            include: {
                levels: true,
                dean: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        console.log("✅ Faculté créée:", faculty.id);
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_FACULTY_SUCCESS",
            entity: "Faculty",
            entityId: faculty.id,
            description: `Faculté ${code} (${name}) créée avec succès avec ${facultyData.studyDuration} niveaux`,
            status: "SUCCESS",
        });
        res.status(201).json({
            message: "Faculté créée avec succès",
            faculty,
        });
    }
    catch (error) {
        console.error("❌ Erreur création faculté:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_FACULTY_ERROR",
            entity: "Faculty",
            description: "Erreur lors de la création de la faculté",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur lors de la création de la faculté",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.createFaculty = createFaculty;
const updateFaculty = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const { name, code, description, studyDuration, status, deanId } = req.body;
        // Vérifier si la faculté existe
        const existingFaculty = await prisma.faculty.findUnique({
            where: { id },
            include: { levels: true },
        });
        if (!existingFaculty) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "UPDATE_FACULTY_ATTEMPT",
                entity: "Faculty",
                entityId: id,
                description: "Tentative de mise à jour de faculté - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Faculté non trouvée",
            });
        }
        // Vérifier les conflits de code
        if (code && code !== existingFaculty.code) {
            const existingCode = await prisma.faculty.findUnique({
                where: { code },
            });
            if (existingCode) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "UPDATE_FACULTY_ATTEMPT",
                    entity: "Faculty",
                    entityId: id,
                    description: `Tentative de mise à jour de faculté - code ${code} déjà existant`,
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "Une faculté avec ce code existe déjà",
                });
            }
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (code !== undefined)
            updateData.code = code;
        if (description !== undefined)
            updateData.description = description;
        if (studyDuration !== undefined)
            updateData.studyDuration = parseInt(studyDuration);
        if (status !== undefined)
            updateData.status = status;
        // Gérer la relation avec le doyen
        if (deanId !== undefined) {
            if (deanId === "" || deanId === null) {
                // Supprimer la relation avec le doyen
                updateData.dean = { disconnect: true };
            }
            else {
                // Vérifier si le nouvel utilisateur existe et est un doyen
                const newDean = await prisma.user.findUnique({
                    where: { id: deanId },
                });
                if (!newDean) {
                    await (0, auditController_1.createAuditLog)({
                        ...auditData,
                        action: "UPDATE_FACULTY_ATTEMPT",
                        entity: "Faculty",
                        entityId: id,
                        description: `Tentative de mise à jour de faculté - nouveau doyen ${deanId} non trouvé`,
                        status: "ERROR",
                    });
                    return res.status(400).json({
                        message: "L'utilisateur spécifié comme doyen n'existe pas",
                    });
                }
                if (newDean.role !== "Doyen") {
                    await (0, auditController_1.createAuditLog)({
                        ...auditData,
                        action: "UPDATE_FACULTY_ATTEMPT",
                        entity: "Faculty",
                        entityId: id,
                        description: `Tentative de mise à jour de faculté - utilisateur ${deanId} n'a pas le rôle Doyen`,
                        status: "ERROR",
                    });
                    return res.status(400).json({
                        message: "L'utilisateur doit avoir le rôle 'Doyen'",
                    });
                }
                // Mettre à jour la relation
                updateData.dean = { connect: { id: deanId } };
            }
        }
        // Mettre à jour la faculté
        const faculty = await prisma.faculty.update({
            where: { id },
            data: updateData,
            include: {
                levels: true,
                dean: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_FACULTY_SUCCESS",
            entity: "Faculty",
            entityId: id,
            description: `Faculté ${faculty.code} (${faculty.name}) mise à jour avec succès`,
            status: "SUCCESS",
        });
        res.json({
            message: "Faculté mise à jour avec succès",
            faculty,
        });
    }
    catch (error) {
        console.error("Erreur modification faculté:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_FACULTY_ERROR",
            entity: "Faculty",
            entityId: req.params.id,
            description: "Erreur lors de la modification de la faculté",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur lors de la modification de la faculté",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.updateFaculty = updateFaculty;
// Récupérer toutes les facultés
const getFaculties = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { includeLevels, search, status } = req.query;
        const user = req.user;
        const facultyId = req.facultyId;
        const where = {};
        // Si c'est un doyen, limiter à sa faculté seulement
        if (user?.role === "Doyen" && facultyId) {
            where.id = facultyId;
        }
        else {
            // Pour les autres rôles, appliquer les filtres normaux
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                ];
            }
            if (status) {
                where.status = status;
            }
        }
        const faculties = await prisma.faculty.findMany({
            where,
            include: {
                levels: includeLevels === "true",
                dean: {
                    // ⬅️ AJOUT IMPORTANT : Inclure les infos du doyen
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        assignments: true,
                        enrollments: {
                            where: { status: "Active" },
                        },
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTIES_LIST",
            entity: "Faculty",
            description: `Consultation de la liste des facultés - ${faculties.length} faculté(s) trouvée(s)`,
            status: "SUCCESS",
        });
        res.json(faculties);
    }
    catch (error) {
        console.error("Erreur récupération facultés:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTIES_LIST_ERROR",
            entity: "Faculty",
            description: "Erreur lors de la récupération de la liste des facultés",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getFaculties = getFaculties;
// Récupérer une faculté par son ID
const getFacultyById = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const { includeLevels } = req.query;
        const user = req.user;
        const facultyId = req.facultyId;
        // Vérifier l'accès pour les doyens
        if (user?.role === "Doyen" && id !== facultyId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_FACULTY_DETAILS_ATTEMPT",
                entity: "Faculty",
                entityId: id,
                description: "Tentative d'accès non autorisé aux détails d'une faculté",
                status: "ERROR",
            });
            return res.status(403).json({
                message: "Accès non autorisé à cette faculté",
            });
        }
        const faculty = await prisma.faculty.findUnique({
            where: { id },
            include: {
                levels: includeLevels === "true",
                assignments: {
                    include: {
                        ue: true,
                        professeur: true,
                    },
                },
                _count: {
                    select: {
                        assignments: true,
                    },
                },
            },
        });
        if (!faculty) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_FACULTY_DETAILS_ATTEMPT",
                entity: "Faculty",
                entityId: id,
                description: "Tentative de consultation de faculté - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Faculté non trouvée",
            });
        }
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTY_DETAILS_SUCCESS",
            entity: "Faculty",
            entityId: id,
            description: `Consultation des détails de la faculté ${faculty.code} (${faculty.name})`,
            status: "SUCCESS",
        });
        res.json(faculty);
    }
    catch (error) {
        console.error("Erreur récupération faculté:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTY_DETAILS_ERROR",
            entity: "Faculty",
            entityId: req.params.id,
            description: "Erreur lors de la récupération des détails de la faculté",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getFacultyById = getFacultyById;
// Supprimer une faculté
const deleteFaculty = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const user = req.user;
        // Les doyens ne peuvent pas supprimer des facultés
        if (user?.role === "Doyen") {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_FACULTY_ATTEMPT",
                entity: "Faculty",
                description: "Tentative de suppression de faculté - permission refusée pour le rôle Doyen",
                status: "ERROR",
            });
            return res.status(403).json({
                message: "Vous n'avez pas la permission de supprimer des facultés",
            });
        }
        const { id } = req.params;
        // Vérifier si la faculté existe
        const faculty = await prisma.faculty.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        assignments: true,
                    },
                },
            },
        });
        if (!faculty) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_FACULTY_ATTEMPT",
                entity: "Faculty",
                entityId: id,
                description: "Tentative de suppression de faculté - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Faculté non trouvée",
            });
        }
        // Vérifier si la faculté a des affectations
        if (faculty._count.assignments > 0) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_FACULTY_ATTEMPT",
                entity: "Faculty",
                entityId: id,
                description: `Tentative de suppression de faculté - ${faculty._count.assignments} affectations en cours`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Impossible de supprimer cette faculté car elle a des affectations de cours",
            });
        }
        await prisma.faculty.delete({
            where: { id },
        });
        // Log de suppression réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_FACULTY_SUCCESS",
            entity: "Faculty",
            entityId: id,
            description: `Faculté ${faculty.code} (${faculty.name}) supprimée avec succès`,
            status: "SUCCESS",
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Erreur suppression faculté:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_FACULTY_ERROR",
            entity: "Faculty",
            entityId: req.params.id,
            description: "Erreur lors de la suppression de la faculté",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.deleteFaculty = deleteFaculty;
// Récupérer les statistiques des facultés
const getFacultyStats = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const stats = await prisma.faculty.groupBy({
            by: ["status"],
            _count: {
                id: true,
            },
        });
        const total = await prisma.faculty.count();
        const active = await prisma.faculty.count({
            where: { status: "Active" },
        });
        // Log de consultation des statistiques
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTY_STATS",
            entity: "Faculty",
            description: `Consultation des statistiques des facultés - ${total} faculté(s) total, ${active} active(s)`,
            status: "SUCCESS",
        });
        res.json({
            total,
            active,
            inactive: total - active,
            byStatus: stats,
        });
    }
    catch (error) {
        console.error("Erreur récupération statistiques:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FACULTY_STATS_ERROR",
            entity: "Faculty",
            description: "Erreur lors de la récupération des statistiques des facultés",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getFacultyStats = getFacultyStats;
const getDeanFaculty = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { userId } = req.params;
        const faculty = await prisma.faculty.findFirst({
            where: {
                deanId: userId,
            },
            include: {
                levels: true,
                _count: {
                    select: {
                        enrollments: {
                            where: { status: "Active" },
                        },
                        assignments: true,
                    },
                },
            },
        });
        if (!faculty) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_DEAN_FACULTY_ATTEMPT",
                entity: "Faculty",
                description: `Tentative de récupération de faculté pour doyen ${userId} - non trouvée`,
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Aucune faculté trouvée pour cet utilisateur",
            });
        }
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_DEAN_FACULTY_SUCCESS",
            entity: "Faculty",
            entityId: faculty.id,
            description: `Récupération de la faculté ${faculty.code} pour le doyen ${userId}`,
            status: "SUCCESS",
        });
        res.json(faculty);
    }
    catch (error) {
        console.error("Erreur récupération faculté doyen:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_DEAN_FACULTY_ERROR",
            entity: "Faculty",
            description: "Erreur lors de la récupération de la faculté du doyen",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getDeanFaculty = getDeanFaculty;
//# sourceMappingURL=facultyController.js.map