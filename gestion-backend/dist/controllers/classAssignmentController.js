"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassAssignmentsByClassAndLevel = exports.getAvailableAssignments = exports.getClassAssignmentsByProfessor = exports.getClassAssignmentsByClass = exports.deleteClassAssignment = exports.updateClassAssignment = exports.createClassAssignment = exports.getClassAssignmentById = exports.getClassAssignments = void 0;
const express_validator_1 = require("express-validator");
const classAssignmentService_1 = require("../services/classAssignmentService");
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
/**
 * @desc Récupère la liste des assignations
 */
const getClassAssignments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 20,
            search: req.query.search,
            classLevel: req.query.classLevel,
            academicYearId: req.query.academicYearId,
            professeurId: req.query.professeurId,
            subjectId: req.query.subjectId,
            status: req.query.status,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignments(filters);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_LIST_REQUEST",
            entity: "ClassAssignment",
            description: "Liste des assignations récupérée",
            status: "SUCCESS",
            metadata: { filters, count: result.data.assignments.length },
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_LIST_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500) || "Unknown error",
            metadata: { query: req.query },
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
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
        if (!id) {
            const response = {
                success: false,
                message: "ID d'assignation requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
            return;
        }
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
        // Vérifier les erreurs de validation express-validator
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const response = {
                success: false,
                message: "Erreur de validation",
                code: "VALIDATION_ERROR",
                errors: errors.array().map((err) => ({
                    path: err.type === "field" ? err.path : "unknown",
                    message: err.msg,
                })),
            };
            res.status(400).json(response);
            return;
        }
        const data = req.body;
        const result = await classAssignmentService_1.ClassAssignmentService.createClassAssignment(data);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_CREATED",
            entity: "ClassAssignment",
            entityId: result.data.assignment.id,
            description: `Assignation créée: ${result.data.assignment.subject.name} → ${result.data.assignment.classLevel}`,
            status: "SUCCESS",
            metadata: {
                subjectId: data.subjectId,
                professeurId: data.professeurId,
                classLevel: data.classLevel,
                academicYearId: data.academicYearId,
                status: data.status,
            },
        });
        res.status(201).json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_CREATION_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la création de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
            metadata: { attemptedData: req.body },
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
        // Vérifier les erreurs de validation express-validator
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const response = {
                success: false,
                message: "Erreur de validation",
                code: "VALIDATION_ERROR",
                errors: errors.array().map((err) => ({
                    path: err.type === "field" ? err.path : "unknown",
                    message: err.msg,
                })),
            };
            res.status(400).json(response);
            return;
        }
        const { id } = req.params;
        const data = req.body;
        if (!id) {
            const response = {
                success: false,
                message: "ID d'assignation requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await classAssignmentService_1.ClassAssignmentService.updateClassAssignment(id, data);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_UPDATED",
            entity: "ClassAssignment",
            entityId: id,
            description: `Assignation mise à jour: ${result.data.assignment.subject.name}`,
            status: "SUCCESS",
            metadata: {
                changes: Object.keys(data),
            },
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_UPDATE_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la mise à jour de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
            metadata: { id: req.params.id, attemptedChanges: req.body },
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
        if (!id) {
            const response = {
                success: false,
                message: "ID d'assignation requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
        }
        const result = await classAssignmentService_1.ClassAssignmentService.deleteClassAssignment(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DELETED",
            entity: "ClassAssignment",
            entityId: id,
            description: `Assignation supprimée: ${result.data?.subjectName || "Inconnu"} → ${result.data?.classLevel || "Inconnu"}`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENT_DELETION_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la suppression de l'assignation",
            status: "ERROR",
            errorMessage: error.message,
            metadata: { id: req.params.id },
        });
        const response = {
            success: false,
            message: error.response?.message || "Erreur interne du serveur",
            code: error.response?.code || "INTERNAL_ERROR",
            data: error.response?.data,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.deleteClassAssignment = deleteClassAssignment;
/**
 * @desc Récupère les assignations d'une classe
 */
const getClassAssignmentsByClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId } = req.params;
        if (!classId) {
            const response = {
                success: false,
                message: "ID de classe requis",
                code: "MISSING_CLASS_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByClass(classId, req.query.academicYearId, req.query.level);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_CLASS_REQUEST",
            entity: "ClassAssignment",
            entityId: classId,
            description: "Assignations de la classe récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_CLASS_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations de la classe",
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
exports.getClassAssignmentsByClass = getClassAssignmentsByClass;
/**
 * @desc Récupère les assignations d'un professeur
 */
const getClassAssignmentsByProfessor = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { professeurId } = req.params;
        if (!professeurId) {
            const response = {
                success: false,
                message: "ID de professeur requis",
                code: "MISSING_PROFESSEUR_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByProfessor(professeurId, req.query.academicYearId);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_PROFESSOR_REQUEST",
            entity: "ClassAssignment",
            entityId: professeurId,
            description: "Assignations du professeur récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_PROFESSOR_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations du professeur",
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
exports.getClassAssignmentsByProfessor = getClassAssignmentsByProfessor;
/**
 * @desc Récupère les assignations disponibles pour un niveau
 */
const getAvailableAssignments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classLevel } = req.params;
        if (!classLevel) {
            const response = {
                success: false,
                message: "Niveau de classe requis",
                code: "MISSING_CLASS_LEVEL",
            };
            res.status(400).json(response);
            return;
        }
        const result = await classAssignmentService_1.ClassAssignmentService.getAvailableAssignments(classLevel, req.query.academicYearId);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_AVAILABLE_REQUEST",
            entity: "ClassAssignment",
            description: `Assignations disponibles pour le niveau ${classLevel}`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_AVAILABLE_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations disponibles",
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
exports.getAvailableAssignments = getAvailableAssignments;
/**
 * @desc Récupère les assignations d'une classe et d'un niveau spécifiques
 */
const getClassAssignmentsByClassAndLevel = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId, classLevel } = req.params;
        const academicYearId = req.query.academicYearId;
        if (!classId || !classLevel) {
            const response = {
                success: false,
                message: "ID de classe et niveau sont requis",
                code: "MISSING_PARAMS",
            };
            res.status(400).json(response);
            return;
        }
        const result = await classAssignmentService_1.ClassAssignmentService.getClassAssignmentsByClassAndLevel(classId, classLevel, academicYearId);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_CLASS_LEVEL_REQUEST",
            entity: "ClassAssignment",
            description: `Assignations pour la classe ${classId} niveau ${classLevel}`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CLASS_ASSIGNMENTS_CLASS_LEVEL_ERROR",
            entity: "ClassAssignment",
            description: "Erreur lors de la récupération des assignations par classe et niveau",
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
exports.getClassAssignmentsByClassAndLevel = getClassAssignmentsByClassAndLevel;
//# sourceMappingURL=classAssignmentController.js.map