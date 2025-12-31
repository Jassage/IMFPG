"use strict";
/**
 * @file classController.ts
 * @description Contrôleurs pour la gestion des classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverallClassStats = exports.getClassLevels = exports.getAllClasses = exports.getClassSchedule = exports.getClassStudents = exports.getClassStats = exports.deleteClass = exports.updateClass = exports.createClass = exports.getClassById = exports.getClasses = void 0;
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const classService_1 = require("../services/classService");
const classService = new classService_1.ClassService();
/**
 * @desc Récupère la liste des classes
 */
const getClasses = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            search: req.query.search,
            level: req.query.level,
            academicYearId: req.query.academicYearId,
            status: req.query.status || "Active",
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const result = await classService.getClasses(filters, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASSES_LIST_REQUEST",
            entity: "SchoolClass",
            description: "Liste des classes récupérée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClasses error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASSES_LIST_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération des classes",
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
exports.getClasses = getClasses;
/**
 * @desc Récupère une classe par ID
 */
const getClassById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classService.getClassById(id, auditData);
        if (!result.success && result.code === "CLASS_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_DETAILS_REQUEST",
            entity: "SchoolClass",
            entityId: id,
            description: "Détails de la classe récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClassById error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_DETAILS_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération de la classe",
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
exports.getClassById = getClassById;
/**
 * @desc Crée une nouvelle classe
 */
const createClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const data = req.body;
        const result = await classService.createClass(data, auditData);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_CREATED",
            entity: "SchoolClass",
            entityId: result.data?.class?.id,
            description: `Classe "${data.name}" créée`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ ClassController - createClass error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_CREATION_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la création de la classe",
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
exports.createClass = createClass;
/**
 * @desc Met à jour une classe
 */
const updateClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await classService.updateClass(id, data, auditData);
        if (!result.success) {
            const statusCode = result.code === "CLASS_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_UPDATED",
            entity: "SchoolClass",
            entityId: id,
            description: `Classe mise à jour`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - updateClass error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_UPDATE_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la mise à jour de la classe",
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
exports.updateClass = updateClass;
/**
 * @desc Supprime (désactive) une classe
 */
const deleteClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classService.deleteClass(id, auditData);
        if (!result.success) {
            const statusCode = result.code === "CLASS_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_DELETED",
            entity: "SchoolClass",
            entityId: id,
            description: `Classe désactivée`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - deleteClass error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_DELETION_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la suppression de la classe",
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
exports.deleteClass = deleteClass;
/**
 * @desc Récupère les statistiques d'une classe
 */
const getClassStats = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classService.getClassStats(id, auditData);
        if (!result.success && result.code === "CLASS_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_STATS_REQUEST",
            entity: "SchoolClass",
            entityId: id,
            description: "Statistiques de la classe récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClassStats error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_STATS_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération des statistiques",
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
exports.getClassStats = getClassStats;
/**
 * @desc Récupère les étudiants d'une classe
 */
const getClassStudents = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classService.getClassStudents(id, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_STUDENTS_REQUEST",
            entity: "SchoolClass",
            entityId: id,
            description: "Étudiants de la classe récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClassStudents error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_STUDENTS_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération des étudiants",
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
exports.getClassStudents = getClassStudents;
/**
 * @desc Récupère l'emploi du temps d'une classe
 */
const getClassSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classService.getClassSchedule(id, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_SCHEDULE_REQUEST",
            entity: "SchoolClass",
            entityId: id,
            description: "Emploi du temps de la classe récupéré",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClassSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_SCHEDULE_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération de l'emploi du temps",
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
exports.getClassSchedule = getClassSchedule;
/**
 * @desc Récupère toutes les classes disponibles
 */
const getAllClasses = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await classService.getAllClasses(auditData);
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getAllClasses error:", error);
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getAllClasses = getAllClasses;
/**
 * @desc Récupère les niveaux de classe disponibles
 */
const getClassLevels = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await classService.getClassLevels(auditData);
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getClassLevels error:", error);
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getClassLevels = getClassLevels;
/**
 * @desc Récupère les statistiques générales des classes
 */
const getOverallClassStats = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await classService.getOverallClassStats(auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "OVERALL_CLASS_STATS_REQUEST",
            entity: "SchoolClass",
            description: "Statistiques générales des classes récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ ClassController - getOverallClassStats error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "OVERALL_CLASS_STATS_ERROR",
            entity: "SchoolClass",
            description: "Erreur lors de la récupération des statistiques générales",
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
exports.getOverallClassStats = getOverallClassStats;
//# sourceMappingURL=classController.js.map