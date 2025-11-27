"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadUEImportTemplate = exports.exportUEs = exports.importUEs = exports.searchUEs = exports.getUEStats = exports.removePrerequisite = exports.addPrerequisite = exports.deleteUE = exports.updateUE = exports.getUEById = exports.createUE = exports.getUEs = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const auditController_1 = require("./auditController");
const fs = __importStar(require("fs"));
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
// src/controllers/uEController.ts
const getUEs = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || "unknown",
    };
    try {
        const { type, search, inCatalog } = req.query;
        console.log("🔍 Récupération UEs avec params:", {
            type,
            search,
            inCatalog,
        });
        const where = {};
        // Filtre par type
        if (type && type !== "all") {
            where.type = type;
        }
        // Filtre par catalogue
        if (inCatalog !== undefined) {
            where.inCatalog = inCatalog === "true";
        }
        // Filtre de recherche - CORRECTION : Enlever le mode
        if (search && search !== "") {
            where.OR = [
                { code: { contains: search } },
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        console.log("📋 Filtre WHERE:", JSON.stringify(where, null, 2));
        const ues = await prisma_1.default.ue.findMany({
            where,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                prerequisites: {
                    include: {
                        prerequisite: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                            },
                        },
                    },
                },
                requiredFor: {
                    include: {
                        ue: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                            },
                        },
                    },
                },
                assignments: {
                    include: {
                        professeur: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                code: "asc",
            },
        });
        console.log(`✅ ${ues.length} cours récupérées`);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_UES_LIST",
            entity: "UE",
            description: `Consultation de la liste des cours - ${ues.length} cours trouvées`,
            status: "SUCCESS",
        });
        res.json(ues);
    }
    catch (error) {
        console.error("❌ Erreur récupération UEs:", error);
        // CORRECTION : Limiter la longueur du message d'erreur
        const errorMessage = getErrorMessage(error);
        const truncatedErrorMessage = errorMessage.length > 500
            ? errorMessage.substring(0, 497) + "..."
            : errorMessage;
        // Log d'erreur avec message tronqué
        try {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_UES_LIST_ERROR",
                entity: "UE",
                description: "Erreur lors de la récupération de la liste des cours",
                status: "ERROR",
                errorMessage: truncatedErrorMessage,
            });
        }
        catch (auditError) {
            console.error("❌ Erreur création audit log:", auditError);
        }
        res.status(500).json({
            message: "Erreur lors de la récupération des cours",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getUEs = getUEs;
const createUE = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { code, title, credits, type, passingGrade, description, objectives, createdById, prerequisites = [], // ← AJOUT: Récupérer les prérequis
         } = req.body;
        console.log("📨 Données reçues:", req.body);
        // Validation des champs obligatoires
        if (!code || !title || !credits || !type || !createdById) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_UE_ATTEMPT",
                entity: "UE",
                description: "Tentative de création du cours - champs obligatoires manquants",
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Les champs code, title, credits, type et createdById sont obligatoires",
            });
        }
        // Vérifier si le code UE existe déjà
        const existingUE = await prisma_1.default.ue.findUnique({
            where: { code },
        });
        if (existingUE) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_UE_ATTEMPT",
                entity: "UE",
                description: `Tentative de création du cours - code ${code} déjà existant`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Une UE avec ce code existe déjà",
            });
        }
        // Vérifier si l'utilisateur existe
        const user = await prisma_1.default.user.findUnique({
            where: { id: createdById },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_UE_ATTEMPT",
                entity: "COURS",
                description: `Tentative de création du cours - utilisateur ${createdById} non trouvé`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "L'utilisateur spécifié n'existe pas",
            });
        }
        // VÉRIFICATION DES PRÉREQUIS
        if (prerequisites && prerequisites.length > 0) {
            // Vérifier que tous les prérequis existent
            const existingPrerequisites = await prisma_1.default.ue.findMany({
                where: {
                    id: { in: prerequisites },
                },
                select: { id: true, code: true },
            });
            if (existingPrerequisites.length !== prerequisites.length) {
                const foundIds = existingPrerequisites.map((p) => p.id);
                const missingIds = prerequisites.filter((id) => !foundIds.includes(id));
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "CREATE_UE_ATTEMPT",
                    entity: "UE",
                    description: `Tentative de création du cours - prérequis non trouvés: ${missingIds.join(", ")}`,
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "Certains prérequis spécifiés n'existent pas",
                    missingPrerequisites: missingIds,
                });
            }
            // Vérifier les références circulaires
            if (prerequisites.includes(code)) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "CREATE_UE_ATTEMPT",
                    entity: "UE",
                    description: "Tentative de création du cours - référence circulaire détectée",
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "Une UE ne peut pas être son propre prérequis",
                });
            }
        }
        // CRÉATION DE L'UE AVEC PRÉREQUIS (transaction)
        const result = await prisma_1.default.$transaction(async (tx) => {
            // 1. Créer l'UE
            const ue = await tx.ue.create({
                data: {
                    code,
                    title,
                    credits: parseInt(credits),
                    type,
                    passingGrade: passingGrade ? parseInt(passingGrade) : 60,
                    description: description || null,
                    objectives: objectives || null,
                    createdById,
                },
            });
            // 2. Ajouter les prérequis si présents
            if (prerequisites && prerequisites.length > 0) {
                const prerequisiteRelations = prerequisites.map((prerequisiteId) => ({
                    ueId: ue.id,
                    prerequisiteId,
                }));
                await tx.uePrerequisite.createMany({
                    data: prerequisiteRelations,
                    skipDuplicates: true,
                });
            }
            // 3. Récupérer l'UE complète avec ses relations
            const completeUE = await tx.ue.findUnique({
                where: { id: ue.id },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    prerequisites: {
                        include: {
                            prerequisite: {
                                select: {
                                    id: true,
                                    code: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            });
            return completeUE;
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_UE_SUCCESS",
            entity: "UE",
            entityId: result?.id,
            description: `Cours ${code} (${title}) créée avec succès avec ${prerequisites.length} prérequis`,
            status: "SUCCESS",
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ Erreur création UE:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_UE_ERROR",
            entity: "UE",
            description: "Erreur lors de la création du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.createUE = createUE;
const getUEById = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const ue = await prisma_1.default.ue.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                prerequisites: {
                    include: {
                        prerequisite: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                                credits: true,
                                type: true,
                            },
                        },
                    },
                },
                requiredFor: {
                    include: {
                        ue: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                                credits: true,
                                type: true,
                            },
                        },
                    },
                },
                assignments: {
                    include: {
                        professeur: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        faculty: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        ue: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                            },
                        },
                    },
                },
                grades: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentId: true,
                            },
                        },
                    },
                },
                retakes: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentId: true,
                            },
                        },
                    },
                },
            },
        });
        if (!ue) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_UE_DETAILS_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative de consultation du cours - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "UE non trouvée",
            });
        }
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_UE_DETAILS_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Consultation des détails du cours ${ue.code} (${ue.title})`,
            status: "SUCCESS",
        });
        res.json(ue);
    }
    catch (error) {
        console.error("Erreur récupération UE:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_UE_DETAILS_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de la récupération des détails du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getUEById = getUEById;
const updateUE = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const { code, title, credits, type, passingGrade, description, objectives, } = req.body;
        // Vérifier si l'UE existe
        const existingUE = await prisma_1.default.ue.findUnique({
            where: { id },
        });
        if (!existingUE) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "UPDATE_UE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative de mise à jour du Cours - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Cours non trouvée",
            });
        }
        // Vérifier les conflits de code
        if (code && code !== existingUE.code) {
            const existingCode = await prisma_1.default.ue.findUnique({
                where: { code },
            });
            if (existingCode) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "UPDATE_UE_ATTEMPT",
                    entity: "UE",
                    entityId: id,
                    description: `Tentative de mise à jour du cours - code ${code} déjà existant`,
                    status: "ERROR",
                });
                return res.status(400).json({
                    message: "Une UE avec ce code existe déjà",
                });
            }
        }
        // Mettre à jour l'UE
        const ue = await prisma_1.default.ue.update({
            where: { id },
            data: {
                code: code ?? undefined,
                title: title ?? undefined,
                credits: credits ? parseInt(credits) : undefined,
                type: type ?? undefined,
                passingGrade: passingGrade ? parseInt(passingGrade) : undefined,
                description: description ?? undefined,
                objectives: objectives ?? undefined,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_UE_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Cours ${ue.code} (${ue.title}) mise à jour avec succès`,
            status: "SUCCESS",
        });
        res.json(ue);
    }
    catch (error) {
        console.error("Erreur modification UE:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_UE_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de la mise à jour du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.updateUE = updateUE;
const deleteUE = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        // Vérifier si l'UE existe
        const ue = await prisma_1.default.ue.findUnique({
            where: { id },
            include: {
                assignments: true,
                grades: true,
                retakes: true,
                prerequisites: true,
                requiredFor: true,
            },
        });
        if (!ue) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_UE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative de suppression du cours - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "UE non trouvée",
            });
        }
        // Vérifier les dépendances
        if (ue.assignments.length > 0 ||
            ue.grades.length > 0 ||
            ue.retakes.length > 0) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_UE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: `Tentative de suppression du cours avec dépendances - ${ue.assignments.length} affectations, ${ue.grades.length} notes, ${ue.retakes.length} rattrapages`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Impossible de supprimer une UE avec des affectations, notes ou rattrapages",
            });
        }
        // Supprimer les prérequis d'abord
        await prisma_1.default.uePrerequisite.deleteMany({
            where: {
                OR: [{ ueId: id }, { prerequisiteId: id }],
            },
        });
        // Supprimer l'UE
        await prisma_1.default.ue.delete({
            where: { id },
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_UE_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Cours ${ue.code} (${ue.title}) supprimée avec succès`,
            status: "SUCCESS",
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Erreur suppression UE:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_UE_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de la suppression du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.deleteUE = deleteUE;
const addPrerequisite = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const { prerequisiteId } = req.body;
        // Vérifier si l'UE existe
        const ue = await prisma_1.default.ue.findUnique({
            where: { id },
        });
        if (!ue) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "ADD_PREREQUISITE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative d'ajout de prérequis - Cours non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "UE non trouvée",
            });
        }
        // Vérifier si le prérequis existe
        const prerequisite = await prisma_1.default.ue.findUnique({
            where: { id: prerequisiteId },
        });
        if (!prerequisite) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "ADD_PREREQUISITE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: `Tentative d'ajout de prérequis - Cours prérequis ${prerequisiteId} non trouvée`,
                status: "ERROR",
            });
            return res.status(404).json({
                message: "cours prérequis non trouvée",
            });
        }
        // Éviter les références circulaires
        if (id === prerequisiteId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "ADD_PREREQUISITE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative d'ajout de prérequis - référence circulaire",
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Une UE ne peut pas être son propre prérequis",
            });
        }
        // Vérifier si le prérequis existe déjà
        const existingPrerequisite = await prisma_1.default.uePrerequisite.findUnique({
            where: {
                ueId_prerequisiteId: {
                    ueId: id,
                    prerequisiteId,
                },
            },
        });
        if (existingPrerequisite) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "ADD_PREREQUISITE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: `Tentative d'ajout de prérequis - relation déjà existante`,
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Ce prérequis existe déjà",
            });
        }
        // Ajouter le prérequis
        const prerequisiteRelation = await prisma_1.default.uePrerequisite.create({
            data: {
                ueId: id,
                prerequisiteId,
            },
            include: {
                ue: {
                    select: {
                        id: true,
                        code: true,
                        title: true,
                    },
                },
                prerequisite: {
                    select: {
                        id: true,
                        code: true,
                        title: true,
                    },
                },
            },
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ADD_PREREQUISITE_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Prérequis ajouté : ${prerequisite.code} pour ${ue.code}`,
            status: "SUCCESS",
        });
        res.status(201).json(prerequisiteRelation);
    }
    catch (error) {
        console.error("Erreur ajout prérequis:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ADD_PREREQUISITE_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de l'ajout du prérequis",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.addPrerequisite = addPrerequisite;
const removePrerequisite = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id, prerequisiteId } = req.params;
        // Vérifier si la relation existe
        const prerequisite = await prisma_1.default.uePrerequisite.findUnique({
            where: {
                ueId_prerequisiteId: {
                    ueId: id,
                    prerequisiteId,
                },
            },
        });
        if (!prerequisite) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "REMOVE_PREREQUISITE_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: `Tentative de suppression de prérequis - relation non trouvée`,
                status: "ERROR",
            });
            return res.status(404).json({
                message: "Relation de prérequis non trouvée",
            });
        }
        // Supprimer le prérequis
        await prisma_1.default.uePrerequisite.delete({
            where: {
                ueId_prerequisiteId: {
                    ueId: id,
                    prerequisiteId,
                },
            },
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REMOVE_PREREQUISITE_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Prérequis ${prerequisiteId} supprimé du cours ${id}`,
            status: "SUCCESS",
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Erreur suppression prérequis:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REMOVE_PREREQUISITE_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de la suppression du prérequis",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.removePrerequisite = removePrerequisite;
const getUEStats = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        // Vérifier si l'UE existe
        const ueExists = await prisma_1.default.ue.findUnique({
            where: { id },
            select: { id: true, code: true, title: true },
        });
        if (!ueExists) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_UE_STATS_ATTEMPT",
                entity: "UE",
                entityId: id,
                description: "Tentative de consultation des statistiques - Cours non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({
                message: "UE non trouvée",
            });
        }
        // Récupérer toutes les statistiques en parallèle
        const [gradeStats, averageValidGrade, retakeStats, gradeDistribution] = await Promise.all([
            // Statistiques par statut
            prisma_1.default.grade.groupBy({
                by: ["status"],
                where: { ueId: id },
                _count: { id: true },
            }),
            // Note moyenne des notes valides
            prisma_1.default.grade.aggregate({
                where: {
                    ueId: id,
                    status: "Valid_", // ← CORRECTION ICI
                },
                _avg: { grade: true },
                _count: { id: true },
            }),
            // Statistiques des rattrapages
            prisma_1.default.retake.groupBy({
                by: ["status"],
                where: { ueId: id },
                _count: { id: true },
            }),
            // Distribution des notes (pour histogramme)
            prisma_1.default.grade.findMany({
                where: { ueId: id },
                select: { grade: true, status: true },
                orderBy: { grade: "asc" },
            }),
        ]);
        // Calculer les totaux
        const totalGrades = gradeStats.reduce((sum, item) => sum + item._count.id, 0);
        const validGradesCount = gradeStats.find((stat) => stat.status === "Valid_")?._count.id || 0;
        const nonValidGradesCount = gradeStats.find((stat) => stat.status === "Non_valid_")?._count.id || 0;
        const reprendreGradesCount = gradeStats.find((stat) => stat.status === "reprendre")?._count.id || 0;
        // Calculer les pourcentages
        const validPercentage = totalGrades > 0 ? (validGradesCount / totalGrades) * 100 : 0;
        const nonValidPercentage = totalGrades > 0 ? (nonValidGradesCount / totalGrades) * 100 : 0;
        const reprendrePercentage = totalGrades > 0 ? (reprendreGradesCount / totalGrades) * 100 : 0;
        const response = {
            // Statistiques de base
            gradeStats,
            averageGrade: averageValidGrade._avg?.grade ?? 0,
            retakeStats,
            // Métriques calculées
            totals: {
                grades: totalGrades,
                valid: validGradesCount,
                nonValid: nonValidGradesCount,
                reprendre: reprendreGradesCount,
            },
            percentages: {
                valid: Math.round(validPercentage * 100) / 100,
                nonValid: Math.round(nonValidPercentage * 100) / 100,
                reprendre: Math.round(reprendrePercentage * 100) / 100,
            },
            // Distribution des notes
            gradeDistribution: gradeDistribution.map((g) => ({
                grade: g.grade,
                status: g.status,
            })),
            hasData: totalGrades > 0,
        };
        // Log de consultation des statistiques
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_UE_STATS_SUCCESS",
            entity: "UE",
            entityId: id,
            description: `Consultation des statistiques du cours ${ueExists.code} - ${totalGrades} notes analysées`,
            status: "SUCCESS",
        });
        res.json(response);
    }
    catch (error) {
        console.error("Erreur récupération statistiques UE:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_UE_STATS_ERROR",
            entity: "UE",
            entityId: req.params.id,
            description: "Erreur lors de la récupération des statistiques du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur lors de la récupération des statistiques",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getUEStats = getUEStats;
const searchUEs = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { q } = req.query;
        if (!q) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "SEARCH_UES_ATTEMPT",
                entity: "UE",
                description: "Tentative de recherche des Cours - paramètre de recherche manquant",
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Le paramètre de recherche est requis",
            });
        }
        const ues = await prisma_1.default.ue.findMany({
            where: {
                OR: [
                    { code: { contains: q } },
                    { title: { contains: q } },
                    { description: { contains: q } },
                ],
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            take: 20,
        });
        // Log de recherche réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SEARCH_UES_SUCCESS",
            entity: "UE",
            description: `Recherche des Cours avec terme "${q}" - ${ues.length} résultats trouvés`,
            status: "SUCCESS",
        });
        res.json(ues);
    }
    catch (error) {
        console.error("Erreur recherche Cours:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SEARCH_COURSES_ERROR",
            entity: "UE",
            description: "Erreur lors de la recherche du cours",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.searchUEs = searchUEs;
// src/controllers/uEController.ts
const XLSX = __importStar(require("xlsx"));
// ==================== IMPORTATION DES UEs ====================
const importUEs = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || "unknown",
    };
    console.log("🔄 Début importation UEs - Fichier reçu:", req.file?.originalname);
    if (!req.file) {
        console.log("❌ Aucun fichier fourni");
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_UES_ATTEMPT",
            entity: "UE",
            description: "Tentative d'importation des UEs - aucun fichier fourni",
            status: "ERROR",
        });
        return res.status(400).json({
            message: "Aucun fichier fourni",
        });
    }
    let filePath = req.file.path;
    try {
        const { createdById } = req.body;
        if (!createdById) {
            return res.status(400).json({
                message: "L'ID de l'utilisateur créateur est requis",
            });
        }
        // Vérifier que l'utilisateur existe
        const user = await prisma_1.default.user.findUnique({
            where: { id: createdById },
        });
        if (!user) {
            return res.status(400).json({
                message: "Utilisateur non trouvé",
            });
        }
        let uesData = [];
        console.log("📊 Lecture du fichier UEs...", {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
        });
        // Log de début d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_UES_START",
            entity: "UE",
            description: "Début de l'importation des UEs",
            status: "SUCCESS",
            metadata: {
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
            },
        });
        // Lire le fichier
        if (req.file.mimetype.includes("excel") ||
            req.file.mimetype.includes("spreadsheet") ||
            req.file.originalname.match(/\.(xlsx|xls)$/i)) {
            console.log("📗 Fichier Excel détecté");
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            console.log("📋 Feuille trouvée:", sheetName);
            const worksheet = workbook.Sheets[sheetName];
            uesData = XLSX.utils.sheet_to_json(worksheet);
            console.log("📊 Données brutes extraites:", uesData.length, "lignes");
            // Afficher les premières lignes pour debug
            if (uesData.length > 0) {
                console.log("📝 Première ligne:", uesData[0]);
                console.log("📝 En-têtes:", Object.keys(uesData[0]));
            }
        }
        else if (req.file.mimetype.includes("json") ||
            req.file.originalname.match(/\.json$/i)) {
            console.log("📘 Fichier JSON détecté");
            const fileContent = await fs.promises.readFile(filePath, "utf-8");
            uesData = JSON.parse(fileContent);
        }
        else {
            await safeDeleteFile(filePath);
            console.log("❌ Format non supporté:", req.file.mimetype);
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "IMPORT_UES_ERROR",
                entity: "UE",
                description: "Format de fichier non supporté pour l'importation",
                status: "ERROR",
                metadata: { mimeType: req.file.mimetype },
            });
            return res.status(400).json({
                message: "Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou JSON",
            });
        }
        // VÉRIFICATION CRITIQUE : Structure des données
        console.log("🔍 Vérification structure données UEs...");
        if (uesData.length === 0) {
            throw new Error("Aucune donnée trouvée dans le fichier");
        }
        const firstRow = uesData[0];
        const availableColumns = Object.keys(firstRow);
        console.log("📝 Colonnes disponibles:", availableColumns);
        // Vérifier la présence des colonnes requises
        const requiredFields = [
            "code",
            "intitule",
            "credits",
            "type",
            "notePassage",
        ];
        const missingFields = requiredFields.filter((field) => !firstRow[field]);
        if (missingFields.length > 0) {
            console.log("❌ Champs manquants:", missingFields);
            throw new Error(`Champs obligatoires manquants: ${missingFields.join(", ")}. Colonnes disponibles: ${availableColumns.join(", ")}`);
        }
        console.log("✅ Structure des données validée");
        const results = {
            success: 0,
            errors: 0,
            details: [],
        };
        // Vérifier les codes existants
        const existingCodes = await prisma_1.default.ue.findMany({
            where: {
                code: {
                    in: uesData.map((ue) => ue.code).filter(Boolean),
                },
            },
            select: {
                id: true,
                code: true,
                title: true,
            },
        });
        const existingCodesMap = new Map(existingCodes.map((ue) => [ue.code, ue]));
        console.log("📊 Codes existants trouvés:", Array.from(existingCodesMap.keys()));
        // Traiter chaque UE
        for (const [index, ueData] of uesData.entries()) {
            try {
                console.log(`\n--- Traitement UE ligne ${index + 1} ---`);
                // Nettoyer et valider les données
                const processedData = {
                    code: String(ueData.code).trim().toUpperCase(),
                    intitule: String(ueData.intitule).trim(),
                    credits: Number(ueData.credits),
                    type: String(ueData.type).trim(),
                    notePassage: ueData.notePassage ? Number(ueData.notePassage) : 60,
                    description: ueData.description
                        ? String(ueData.description).trim()
                        : null,
                };
                // Validation des données
                const errors = [];
                if (!processedData.code || processedData.code.length < 2) {
                    errors.push("Code UE invalide (min 2 caractères)");
                }
                if (!processedData.intitule || processedData.intitule.length < 5) {
                    errors.push("Intitulé invalide (min 5 caractères)");
                }
                if (!processedData.credits ||
                    processedData.credits < 1 ||
                    processedData.credits > 30) {
                    errors.push("Crédits invalides (1-30)");
                }
                if (!["Obligatoire", "Optionnelle"].includes(processedData.type)) {
                    errors.push("Type invalide (Obligatoire ou Optionnelle)");
                }
                if (processedData.notePassage < 0 || processedData.notePassage > 100) {
                    errors.push("Note de passage invalide (0-100)");
                }
                if (errors.length > 0) {
                    throw new Error(errors.join(", "));
                }
                // Vérifier si l'UE existe déjà
                const existingUE = existingCodesMap.get(processedData.code);
                if (existingUE) {
                    throw new Error(`UE avec le code "${processedData.code}" existe déjà`);
                }
                console.log(`➕ Création UE: ${processedData.code} - ${processedData.intitule}`);
                // Créer l'UE
                const newUE = await prisma_1.default.ue.create({
                    data: {
                        code: processedData.code,
                        title: processedData.intitule,
                        credits: processedData.credits,
                        type: processedData.type,
                        passingGrade: processedData.notePassage,
                        description: processedData.description,
                        createdById: createdById,
                    },
                });
                console.log("✅ UE créée avec ID:", newUE.id);
                results.success++;
                results.details.push({
                    index: index + 1,
                    code: processedData.code,
                    intitule: processedData.intitule,
                    status: "success",
                    message: "UE créée avec succès",
                    ueId: newUE.id,
                });
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                console.error(`❌ Erreur ligne ${index + 1}:`, errorMessage);
                results.errors++;
                results.details.push({
                    index: index + 1,
                    code: ueData.code || "N/A",
                    intitule: ueData.intitule || "N/A",
                    status: "error",
                    message: errorMessage,
                    data: ueData,
                });
            }
        }
        // Supprimer le fichier après traitement
        if (filePath) {
            await safeDeleteFile(filePath);
            filePath = null;
        }
        console.log("🎉 Import UEs terminé:", results.success, "succès,", results.errors, "erreurs");
        // Log de fin d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_UES_COMPLETE",
            entity: "UE",
            description: "Importation des UEs terminée",
            status: "SUCCESS",
            metadata: {
                total: uesData.length,
                success: results.success,
                errors: results.errors,
                successRate: `${((results.success / uesData.length) * 100).toFixed(2)}%`,
            },
        });
        res.json({
            message: `Import terminé: ${results.success} succès, ${results.errors} erreurs`,
            summary: {
                total: uesData.length,
                success: results.success,
                errors: results.errors,
                successRate: `${((results.success / uesData.length) * 100).toFixed(2)}%`,
            },
            results: results.details,
        });
    }
    catch (error) {
        console.error("❌ ERREUR DÉTAILLÉE importation UEs:", error);
        // Nettoyer le fichier en cas d'erreur
        if (filePath) {
            await safeDeleteFile(filePath);
        }
        const errorMessage = getErrorMessage(error);
        // Log d'erreur d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_UES_ERROR",
            entity: "UE",
            description: "Erreur lors de l'importation des UEs",
            status: "ERROR",
            errorMessage: errorMessage,
            metadata: {
                fileName: req.file?.originalname,
                fileSize: req.file?.size,
            },
        });
        res.status(400).json({
            message: "Erreur lors de l'importation",
            error: errorMessage,
            details: process.env.NODE_ENV === "development"
                ? {
                    stack: error instanceof Error ? error.stack : undefined,
                    file: req.file
                        ? {
                            name: req.file.originalname,
                            size: req.file.size,
                            type: req.file.mimetype,
                        }
                        : undefined,
                }
                : undefined,
        });
    }
};
exports.importUEs = importUEs;
// ==================== EXPORTATION DES UEs ====================
const exportUEs = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || "unknown",
    };
    try {
        // Récupérer toutes les UEs
        const ues = await prisma_1.default.ue.findMany({
            include: {
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                code: "asc",
            },
        });
        // Préparer les données pour l'exportation
        const exportData = ues.map((ue) => ({
            code: ue.code,
            intitule: ue.title,
            credits: ue.credits,
            type: ue.type,
            notePassage: ue.passingGrade,
            description: ue.description || "",
        }));
        // Log de début d'exportation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_UES_START",
            entity: "UE",
            description: "Début de l'exportation des UEs",
            status: "SUCCESS",
            metadata: {
                uesCount: ues.length,
            },
        });
        // Créer le fichier Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "UEs");
        // Ajouter une feuille d'instructions
        const instructions = [
            {
                Champ: "code",
                Description: "Code unique de l'UE (obligatoire)",
                Exemple: "INFO101",
            },
            {
                Champ: "intitule",
                Description: "Intitulé complet de l'UE (obligatoire)",
                Exemple: "Introduction à la Programmation",
            },
            {
                Champ: "credits",
                Description: "Nombre de crédits ECTS (obligatoire)",
                Exemple: "6",
            },
            {
                Champ: "type",
                Description: "Type: Obligatoire ou Optionnelle (obligatoire)",
                Exemple: "Obligatoire",
            },
            {
                Champ: "notePassage",
                Description: "Note de passage (0-100, défaut: 60)",
                Exemple: "60",
            },
            {
                Champ: "description",
                Description: "Description de l'UE (optionnel)",
                Exemple: "Cours d'introduction aux concepts de base",
            },
        ];
        const instructionSheet = XLSX.utils.json_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        // Log d'exportation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_UES_SUCCESS",
            entity: "UE",
            description: "Exportation des UEs terminée avec succès",
            status: "SUCCESS",
            metadata: {
                uesExported: ues.length,
                fileFormat: "Excel",
            },
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=ues-export-${new Date().toISOString().split("T")[0]}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error("❌ Erreur export UEs:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur d'exportation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_UES_ERROR",
            entity: "UE",
            description: "Erreur lors de l'exportation des UEs",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            message: "Erreur lors de l'exportation: " + errorMessage,
        });
    }
};
exports.exportUEs = exportUEs;
// ==================== TEMPLATE D'IMPORTATION ====================
const downloadUEImportTemplate = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || "unknown",
    };
    try {
        const templateData = [
            {
                code: "INFO101",
                intitule: "Introduction à la Programmation",
                credits: 6,
                type: "Obligatoire",
                notePassage: 60,
                description: "Cours d'introduction aux concepts de base de la programmation",
            },
            {
                code: "MATH202",
                intitule: "Mathématiques Avancées",
                credits: 4,
                type: "Optionnelle",
                notePassage: 70,
                description: "Cours de mathématiques pour l'informatique",
            },
        ];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "UEs");
        // Ajouter une feuille d'instructions
        const instructions = [
            {
                Champ: "code",
                Description: "Code unique de l'UE",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "intitule",
                Description: "Intitulé complet de l'UE",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "credits",
                Description: "Nombre de crédits ECTS",
                Format: "Nombre",
                Obligatoire: "Oui",
            },
            {
                Champ: "type",
                Description: "Type de l'UE",
                Format: "Obligatoire/Optionnelle",
                Obligatoire: "Oui",
            },
            {
                Champ: "notePassage",
                Description: "Note minimale pour valider",
                Format: "Nombre (0-100)",
                Obligatoire: "Non",
            },
            {
                Champ: "description",
                Description: "Description de l'UE",
                Format: "Texte",
                Obligatoire: "Non",
            },
        ];
        const instructionSheet = XLSX.utils.json_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        // Log de téléchargement du template
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DOWNLOAD_UE_TEMPLATE",
            entity: "UE",
            description: "Téléchargement du template d'importation des UEs",
            status: "SUCCESS",
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=template-import-ues.xlsx");
        res.send(buffer);
    }
    catch (error) {
        console.error("Erreur génération template UEs:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DOWNLOAD_UE_TEMPLATE_ERROR",
            entity: "UE",
            description: "Erreur lors de la génération du template d'importation des UEs",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            message: "Erreur lors de la génération du template",
            error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        });
    }
};
exports.downloadUEImportTemplate = downloadUEImportTemplate;
// ==================== FONCTIONS UTILITAIRES ====================
const safeDeleteFile = async (filePath) => {
    if (!filePath)
        return;
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log("🗑️ Fichier temporaire supprimé:", filePath);
        }
    }
    catch (error) {
        console.error("❌ Erreur suppression fichier temporaire:", error);
    }
};
//# sourceMappingURL=uEController.js.map