"use strict";
/**
 * @file enrollmentController.ts
 * @description Contrôleurs pour la gestion des inscriptions
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnrollment = exports.getAvailableFeeStructures = exports.getEnrollmentHistory = exports.createBulkEnrollments = exports.getEnrollmentStats = exports.getStudentEnrollments = exports.validateReenrollment = exports.reenrollStudent = exports.unenrollStudent = exports.updateEnrollment = exports.createEnrollment = exports.getEnrollmentById = exports.getEnrollments = void 0;
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const enrollmentService_1 = require("../services/enrollmentService");
const enrollmentService = new enrollmentService_1.EnrollmentService();
/**
 * @desc Récupère la liste des inscriptions
 */
const getEnrollments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            academicYearId: req.query.academicYearId,
            classId: req.query.classId,
            studentId: req.query.studentId,
            status: req.query.status,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const result = await enrollmentService.getEnrollments(filters, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENTS_LIST_REQUEST",
            entity: "Enrollment",
            description: "Liste des inscriptions récupérée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - getEnrollments error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENTS_LIST_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la récupération des inscriptions",
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
exports.getEnrollments = getEnrollments;
/**
 * @desc Récupère une inscription par ID
 */
const getEnrollmentById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await enrollmentService.getEnrollmentById(id, auditData);
        if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_DETAILS_REQUEST",
            entity: "Enrollment",
            entityId: id,
            description: "Détails de l'inscription récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - getEnrollmentById error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_DETAILS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la récupération de l'inscription",
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
exports.getEnrollmentById = getEnrollmentById;
/**
 * @desc Crée une nouvelle inscription avec option d'attribution de frais
 */
const createEnrollment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const data = req.body;
        const result = await enrollmentService.createEnrollment(data, auditData);
        if (!result.success) {
            const statusCode = result.code === "STUDENT_NOT_FOUND" ||
                result.code === "CLASS_NOT_FOUND" ||
                result.code === "ACADEMIC_YEAR_NOT_FOUND"
                ? 404
                : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_CREATED",
            entity: "Enrollment",
            entityId: result.data?.enrollment?.id,
            description: `Inscription créée pour l'étudiant ${data.studentId}`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("EnrollmentController - createEnrollment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_CREATION_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la création de l'inscription",
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
exports.createEnrollment = createEnrollment;
/**
 * @desc Met à jour une inscription
 */
const updateEnrollment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await enrollmentService.updateEnrollment(id, data, auditData);
        if (!result.success) {
            const statusCode = result.code === "ENROLLMENT_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_UPDATED",
            entity: "Enrollment",
            entityId: id,
            description: `Inscription mise à jour`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - updateEnrollment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_UPDATE_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la mise à jour de l'inscription",
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
exports.updateEnrollment = updateEnrollment;
/**
 * @desc Désinscrit un étudiant
 */
const unenrollStudent = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const reason = req.body?.reason || "Non spécifié";
        const result = await enrollmentService.unenrollStudent(id, reason, auditData);
        if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_UNENROLLED",
            entity: "Enrollment",
            entityId: id,
            description: "Étudiant désinscrit",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - unenrollStudent error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_UNENROLL_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la désinscription de l'étudiant",
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
exports.unenrollStudent = unenrollStudent;
/**
 * @desc Gère la réinscription d'un étudiant
 */
const reenrollStudent = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const data = req.body;
        const result = await enrollmentService.reenrollStudent(data, auditData);
        if (!result.success) {
            const statusCode = result.code === "STUDENT_NOT_FOUND" ||
                result.code === "CLASS_NOT_FOUND" ||
                result.code === "TARGET_YEAR_NOT_FOUND"
                ? 404
                : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_REENROLLED",
            entity: "Enrollment",
            entityId: result.data?.enrollment?.id,
            description: "Étudiant réinscrit",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - reenrollStudent error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_REENROLL_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la réinscription de l'étudiant",
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
exports.reenrollStudent = reenrollStudent;
/**
 * @desc Valide un étudiant pour la réinscription
 */
const validateReenrollment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { studentId } = req.params;
        const result = await enrollmentService.validateReenrollment(studentId, auditData);
        if (!result.success) {
            const statusCode = result.code === "STUDENT_NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REENROLLMENT_VALIDATION",
            entity: "Enrollment",
            description: "Validation de réinscription effectuée",
            status: "SUCCESS",
            metadata: { studentId },
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - validateReenrollment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REENROLLMENT_VALIDATION_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la validation de réinscription",
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
exports.validateReenrollment = validateReenrollment;
/**
 * @desc Récupère les inscriptions d'un étudiant
 */
const getStudentEnrollments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { studentId } = req.params;
        const result = await enrollmentService.getStudentEnrollments(studentId, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_ENROLLMENTS_REQUEST",
            entity: "Enrollment",
            description: "Historique des inscriptions récupéré",
            status: "SUCCESS",
            metadata: { studentId },
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - getStudentEnrollments error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "STUDENT_ENROLLMENTS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la récupération de l'historique des inscriptions",
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
exports.getStudentEnrollments = getStudentEnrollments;
/**
 * @desc Récupère les statistiques d'inscription
 */
const getEnrollmentStats = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { academicYearId } = req.query;
        const result = await enrollmentService.getEnrollmentStats(academicYearId, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_STATS_REQUEST",
            entity: "Enrollment",
            description: "Statistiques d'inscription récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - getEnrollmentStats error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_STATS_ERROR",
            entity: "Enrollment",
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
exports.getEnrollmentStats = getEnrollmentStats;
/**
 * @desc Crée des inscriptions en masse
 */
const createBulkEnrollments = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { enrollments } = req.body;
        const result = await enrollmentService.createBulkEnrollments(enrollments, auditData);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "BULK_ENROLLMENTS_CREATED",
            entity: "Enrollment",
            description: `Inscriptions en masse créées`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - createBulkEnrollments error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "BULK_ENROLLMENTS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors des inscriptions en masse",
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
exports.createBulkEnrollments = createBulkEnrollments;
/**
 * @desc Récupère l'historique complet des inscriptions d'un étudiant
 */
const getEnrollmentHistory = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { studentId } = req.params;
        const result = await enrollmentService.getEnrollmentHistory(studentId, auditData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_HISTORY_REQUEST",
            entity: "Enrollment",
            description: "Historique des inscriptions récupéré",
            status: "SUCCESS",
            metadata: { studentId },
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - getEnrollmentHistory error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_HISTORY_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la récupération de l'historique",
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
exports.getEnrollmentHistory = getEnrollmentHistory;
/**
 * @desc Récupère les structures de frais disponibles
 */
const getAvailableFeeStructures = async (req, res) => {
    try {
        const result = await enrollmentService.getAvailableFeeStructures();
        res.json(result);
    }
    catch (error) {
        console.error(" Erreur récupération structures de frais:", error);
        const response = {
            success: false,
            message: "Erreur lors de la récupération des structures de frais",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getAvailableFeeStructures = getAvailableFeeStructures;
/** * @desc Supprime une inscription par ID (à utiliser avec prudence)
 */
const deleteEnrollment = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await enrollmentService.deleteEnrollment(id, auditData);
        if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_DELETED",
            entity: "Enrollment",
            entityId: id,
            description: "Inscription supprimée",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result);
    }
    catch (error) {
        console.error(" EnrollmentController - deleteEnrollment error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ENROLLMENT_DELETION_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la suppression de l'inscription",
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
exports.deleteEnrollment = deleteEnrollment;
//# sourceMappingURL=enrollmentController.js.map