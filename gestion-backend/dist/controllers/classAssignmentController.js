"use strict";
/**
 * @file classAssignmentController.ts
 * @description Contrôleurs pour la gestion des assignations de cours aux classes
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassAssignmentsByClassAndLevel = exports.getAvailableAssignments = exports.getClassAssignmentsByProfessor = exports.getClassAssignmentsByClass = exports.deleteClassAssignment = exports.updateClassAssignment = exports.createClassAssignment = exports.getClassAssignmentById = exports.getClassAssignments = void 0;
const classAssignmentService_1 = require("../services/classAssignmentService");
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
/**
 * @desc Récupère la liste des assignations
 */
const getClassAssignments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignments({
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            search: req.query.search,
            classLevel: req.query.classLevel,
            academicYearId: req.query.academicYearId,
            professeurId: req.query.professeurId,
            subjectId: req.query.subjectId,
            status: req.query.status,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_LIST_REQUEST",
            entity: "ClassAssignment",
            description: "Liste des assignations récupérée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getClassAssignments error:", error);
        // Utiliser createAuditLogSafe avec message d'erreur tronqué
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_LIST_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations",
            status: "ERROR",
            errorMessage: error.message
                ? error.message.substring(0, 500)
                : "Unknown error",
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
            data: process.env.NODE_ENV === "development" && error.response?.data
                ? { error: error.message?.substring(0, 200) }
                : undefined,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassAssignments = getClassAssignments;
/**
 * @desc Récupère une assignation par ID
 */
const getClassAssignmentById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentById(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DETAILS_REQUEST",
            entity: "ClassAssignment",
            entityId: id,
            description: "Détails de l'assignation récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getClassAssignmentById error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DETAILS_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassAssignmentById = getClassAssignmentById;
/**
 * @desc Crée une nouvelle assignation
 */
const createClassAssignment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await classAssignmentService_1.ClassAssignmentService.createClassAssignment(req.body);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_CREATED",
            entity: "ClassAssignment",
            entityId: result.data.assignment.id,
            description: `Assignation créée: ${result.data.assignment.subject.name} → ${result.data.assignment.classLevel} (Prof: ${result.data.assignment.professeur.firstName} ${result.data.assignment.professeur.lastName})`,
            status: "SUCCESS",
            metadata: {
                subjectId: req.body.subjectId,
                professeurId: req.body.professeurId,
                classLevel: req.body.classLevel,
                academicYearId: req.body.academicYearId,
                status: req.body.status,
            },
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - createClassAssignment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_CREATION_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la création de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.createClassAssignment = createClassAssignment;
/**
 * @desc Met à jour une assignation
 */
const updateClassAssignment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.updateClassAssignment(id, req.body);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_UPDATED",
            entity: "ClassAssignment",
            entityId: id,
            description: `Assignation mise à jour: ${result.data.assignment.subject.name}`,
            status: "SUCCESS",
            metadata: {
                changes: Object.keys(req.body),
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - updateClassAssignment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_UPDATE_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la mise à jour de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.updateClassAssignment = updateClassAssignment;
/**
 * @desc Supprime une assignation
 */
const deleteClassAssignment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.deleteClassAssignment(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DELETED",
            entity: "ClassAssignment",
            entityId: id,
            description: `Assignation supprimée: ${result.data?.assignment?.subject?.name || "Unknown"} → ${result.data?.assignment?.classLevel || "Unknown"}`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - deleteClassAssignment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DELETION_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la suppression de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.deleteClassAssignment = deleteClassAssignment;
/**
 * @desc Récupère les assignations d'une classe
 */
const getClassAssignmentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByClass(classId, {
            academicYearId: req.query.academicYearId,
            level: req.query.level,
        });
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getClassAssignmentsByClass error:", error);
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassAssignmentsByClass = getClassAssignmentsByClass;
/**
 * @desc Récupère les assignations d'un professeur
 */
const getClassAssignmentsByProfessor = async (req, res) => {
    try {
        const { professeurId } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByProfessor(professeurId, req.query.academicYearId);
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getClassAssignmentsByProfessor error:", error);
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassAssignmentsByProfessor = getClassAssignmentsByProfessor;
/**
 * @desc Récupère les assignations disponibles pour un niveau
 */
const getAvailableAssignments = async (req, res) => {
    try {
        const { classLevel } = req.params;
        const result = await classAssignmentService_1.ClassAssignmentService.getAvailableAssignments(classLevel, req.query.academicYearId);
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getAvailableAssignments error:", error);
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getAvailableAssignments = getAvailableAssignments;
/**
 * @desc Récupère les assignations d'une classe et d'un niveau spécifiques
 */
const getClassAssignmentsByClassAndLevel = async (req, res) => {
    try {
        // extraire classLevel au lieu de level
        const { classId, classLevel } = req.params;
        const academicYearId = req.query.academicYearId;
        console.log("DEBUG - Controller received:", {
            classId,
            classLevel,
            academicYearId,
            params: req.params,
            query: req.query,
        });
        //  passer classLevel au service
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByClassAndLevel(classId, classLevel, academicYearId);
        res.json(result);
    }
    catch (error) {
        console.error(" ClassAssignmentController - getClassAssignmentsByClassAndLevel error:", error);
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassAssignmentsByClassAndLevel = getClassAssignmentsByClassAndLevel;
//# sourceMappingURL=classAssignmentController.js.map