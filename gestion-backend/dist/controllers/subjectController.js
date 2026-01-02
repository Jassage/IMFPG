"use strict";
/**
 * @file subjectController.ts
 * @description Contrôleurs pour la gestion des matières
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjectById = exports.getSubjects = void 0;
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const subjectService_1 = require("../services/subjectService");
const subjectService = new subjectService_1.SubjectService();
/**
 * @desc Récupère la liste des matières
 */
const getSubjects = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            search: req.query.search,
            type: typeof req.query.type === "string"
                ? req.query.type
                : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const result = await subjectService.getSubjects(filters, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECTS_LIST_REQUEST",
            entity: "Subject",
            description: "Liste des matières récupérée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECTS_LIST_ERROR",
            entity: "Subject",
            description: "Erreur lors de la récupération des matières",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getSubjects = getSubjects;
/**
 * @desc Récupère une matière par ID
 */
const getSubjectById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await subjectService.getSubjectById(id, auditData);
        if (!result.success && result.code === "SUBJECT_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_DETAILS_REQUEST",
            entity: "Subject",
            entityId: id,
            description: "Détails de la matière récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" SubjectController - getSubjectById error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_DETAILS_ERROR",
            entity: "Subject",
            description: "Erreur lors de la récupération de la matière",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getSubjectById = getSubjectById;
/**
 * @desc Crée une nouvelle matière
 */
const createSubject = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const data = req.body;
        const userId = auditData.userId || req.user?.id;
        console.log("body:", req.body);
        if (!userId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "SUBJECT_CREATION_UNAUTHORIZED",
                entity: "Subject",
                description: "Tentative de création de matière par un utilisateur non identifié",
                status: "ERROR",
            });
            const response = {
                success: false,
                message: "Utilisateur non identifié",
                code: "UNAUTHORIZED",
            };
            res.status(401).json(response);
            return;
        }
        const result = await subjectService.createSubject(data, userId, auditData);
        if (!result.success) {
            const statusCode = result.code === "UNAUTHORIZED" ? 401 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_CREATED",
            entity: "Subject",
            entityId: result.data?.subject?.id,
            description: `Matière "${data.name}" créée`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(" SubjectController - createSubject error:", error);
        const errorMessage = error.message;
        const truncatedErrorMessage = errorMessage.substring(0, 500);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_CREATION_ERROR",
            entity: "Subject",
            description: "Erreur lors de la création de la matière",
            status: "ERROR",
            errorMessage: truncatedErrorMessage,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.createSubject = createSubject;
/**
 * @desc Met à jour une matière
 */
const updateSubject = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const data = req.body;
        console.log("📝 Update Subject - Body:", req.body);
        console.log("🔍 ID à mettre à jour:", id);
        const result = await subjectService.updateSubject(id, data, auditData);
        if (!result.success) {
            const statusCode = result.code === "SUBJECT_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_UPDATED",
            entity: "Subject",
            entityId: id,
            description: `Matière "${data.name || "N/A"}" mise à jour`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        console.log("✅ Matière mise à jour:", id);
        res.json(result);
    }
    catch (error) {
        console.error(" SubjectController - updateSubject error:", error);
        console.error(" Error name:", error.name);
        console.error(" Error message:", error.message);
        console.error(" Error code:", error.code);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_UPDATE_ERROR",
            entity: "Subject",
            description: "Erreur lors de la mise à jour de la matière",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.updateSubject = updateSubject;
/**
 * @desc Supprime une matière
 */
const deleteSubject = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await subjectService.deleteSubject(id, auditData);
        if (!result.success) {
            const statusCode = result.code === "SUBJECT_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_DELETED",
            entity: "Subject",
            entityId: id,
            description: `Matière "${result.subjectName}" supprimée`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" SubjectController - deleteSubject error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SUBJECT_DELETION_ERROR",
            entity: "Subject",
            description: "Erreur lors de la suppression de la matière",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.deleteSubject = deleteSubject;
//# sourceMappingURL=subjectController.js.map