"use strict";
/**
 * @file studentFeeController.ts
 * @description Contrôleur pour la gestion des frais étudiants
 * @module Controllers/StudentFees
 *
 * Ce contrôleur gère :
 * - L'attribution de frais aux étudiants
 * - La consultation des frais étudiants
 * - La mise à jour du statut des frais
 * - La suppression des frais
 * - Le suivi des paiements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentFeesByStudent = exports.getStudentFeeByStudentAndYear = exports.assignFeeToStudent = exports.deleteStudentFee = exports.updateStudentFee = exports.getStudentFeeById = exports.getAllStudentFees = void 0;
const studentFeeService_1 = require("../services/studentFeeService");
const auditController_1 = require("./auditController");
/**
 * @function getAllStudentFees
 * @description Récupère tous les frais étudiants avec filtres optionnels
 * @route GET /api/student-fees
 * @access Staff/Admin
 * @query {string} [studentId] - ID de l'étudiant pour filtrer
 * @query {string} [academicYear] - Année académique pour filtrer
 * @returns {Promise<void>}
 */
const getAllStudentFees = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { studentId, academicYear } = req.query;
        const result = await studentFeeService_1.StudentFeeService.getAllStudentFees({
            studentId: studentId,
            academicYear: academicYear,
        });
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_STUDENT_FEES",
            entity: "StudentFee",
            description: "Consultation de tous les frais étudiants",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais étudiants:", error);
        const errorMessage = error.message || "Erreur inconnue";
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_STUDENT_FEES_ERROR",
            entity: "StudentFee",
            description: "Erreur lors de la récupération de tous les frais étudiants",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getAllStudentFees = getAllStudentFees;
/**
 * @function getStudentFeeById
 * @description Récupère les frais d'un étudiant par son ID
 * @route GET /api/student-fees/:id
 * @access Staff/Admin
 * @param {string} id - ID des frais étudiants
 * @returns {Promise<void>}
 */
const getStudentFeeById = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const result = await studentFeeService_1.StudentFeeService.getStudentFeeById(id);
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEE_SUCCESS",
            entity: "StudentFee",
            entityId: id,
            description: "Consultation des détails des frais étudiant",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais étudiant:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEE_ERROR",
            entity: "StudentFee",
            entityId: req.params.id,
            description: "Erreur lors de la récupération des frais étudiant",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
        });
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getStudentFeeById = getStudentFeeById;
/**
 * @function updateStudentFee
 * @description Met à jour les frais d'un étudiant
 * @route PUT /api/student-fees/:id
 * @access Admin
 * @param {string} id - ID des frais à mettre à jour
 * @body {Object} data - Données de mise à jour
 * @body {string} [data.dueDate] - Nouvelle date d'échéance
 * @body {string} [data.status] - Nouveau statut (pending/partial/paid/overdue)
 * @returns {Promise<void>}
 */
const updateStudentFee = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const data = req.body;
        console.log("📥 Mise à jour frais étudiant - ID:", id, "Données:", data);
        // Log de tentative de mise à jour
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_STUDENT_FEE_ATTEMPT",
            entity: "StudentFee",
            entityId: id,
            description: "Tentative de mise à jour des frais étudiant",
            status: "SUCCESS",
            metadata: {
                updateFields: Object.keys(data),
            },
        });
        const result = await studentFeeService_1.StudentFeeService.updateStudentFee(id, data);
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_STUDENT_FEE_SUCCESS",
            entity: "StudentFee",
            entityId: id,
            description: "Frais étudiant mis à jour avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur mise à jour frais étudiant:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_STUDENT_FEE_ERROR",
            entity: "StudentFee",
            entityId: req.params.id,
            description: "Erreur lors de la mise à jour des frais étudiant",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: error.metadata || {},
        });
        if (error.status === 400 || error.status === 404) {
            return res.status(error.status).json({
                error: error.message,
                details: error.details,
            });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.updateStudentFee = updateStudentFee;
/**
 * @function deleteStudentFee
 * @description Supprime les frais d'un étudiant (si aucun paiement associé)
 * @route DELETE /api/student-fees/:id
 * @access Admin
 * @param {string} id - ID des frais à supprimer
 * @returns {Promise<void>}
 */
const deleteStudentFee = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        console.log("🗑️ Suppression frais étudiant - ID:", id);
        // Log de tentative de suppression
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_STUDENT_FEE_ATTEMPT",
            entity: "StudentFee",
            entityId: id,
            description: "Tentative de suppression de frais étudiant",
            status: "SUCCESS",
        });
        const result = await studentFeeService_1.StudentFeeService.deleteStudentFee(id);
        // Log de suppression réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_STUDENT_FEE_SUCCESS",
            entity: "StudentFee",
            entityId: id,
            description: "Frais étudiant supprimé avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json({ message: result.message });
    }
    catch (error) {
        console.error("❌ Erreur suppression frais étudiant:", error);
        // Log d'erreur de suppression
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_STUDENT_FEE_ERROR",
            entity: "StudentFee",
            entityId: req.params.id,
            description: "Erreur lors de la suppression des frais étudiant",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: error.metadata || {},
        });
        if (error.status === 400 || error.status === 404) {
            return res.status(error.status).json({
                error: error.message,
                details: error.details,
            });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.deleteStudentFee = deleteStudentFee;
/**
 * @function assignFeeToStudent
 * @description Attribue une structure de frais à un étudiant pour une année académique
 * @route POST /api/student-fees/assign
 * @access Admin
 * @body {Object} feeAssignment - Données d'attribution
 * @body {string} feeAssignment.studentId - ID de l'étudiant
 * @body {string} feeAssignment.feeStructureId - ID de la structure de frais
 * @body {string} feeAssignment.academicYearId - ID de l'année académique
 * @returns {Promise<void>}
 */
const assignFeeToStudent = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentId, feeStructureId, academicYearId } = req.body;
        console.log("📥 Attribution frais à étudiant - Données:", req.body);
        // Log de tentative d'attribution
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
            entity: "StudentFee",
            description: "Tentative d'attribution de frais à un étudiant",
            status: "SUCCESS",
            metadata: {
                studentId,
                feeStructureId,
                academicYearId,
            },
        });
        const result = await studentFeeService_1.StudentFeeService.assignFeeToStudent({
            studentId,
            feeStructureId,
            academicYearId,
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ASSIGN_FEE_TO_STUDENT_SUCCESS",
            entity: "StudentFee",
            entityId: result.data.id,
            description: "Frais attribués à l'étudiant avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur attribution frais:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ASSIGN_FEE_TO_STUDENT_ERROR",
            entity: "StudentFee",
            description: "Erreur lors de l'attribution des frais à l'étudiant",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: error.metadata || {},
        });
        if (error.status === 400 || error.status === 404) {
            return res.status(error.status).json({
                error: error.message,
                details: error.details,
            });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.assignFeeToStudent = assignFeeToStudent;
/**
 * @function getStudentFeeByStudentAndYear
 * @description Récupère les frais d'un étudiant pour une année académique spécifique
 * @route GET /api/student-fees/student/:studentId/year/:academicYear
 * @access Staff/Admin
 * @param {string} studentId - ID de l'étudiant
 * @param {string} academicYear - ID de l'année académique
 * @returns {Promise<void>}
 */
const getStudentFeeByStudentAndYear = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentId, academicYear } = req.params;
        const result = await studentFeeService_1.StudentFeeService.getStudentFeeByStudentAndYear(studentId, academicYear);
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_SUCCESS",
            entity: "StudentFee",
            entityId: result.data.id,
            description: "Consultation des frais par étudiant et année",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par étudiant et année:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_ERROR",
            entity: "StudentFee",
            description: "Erreur lors de la récupération des frais par étudiant et année",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: {
                studentId: req.params.studentId,
                academicYear: req.params.academicYear,
            },
        });
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getStudentFeeByStudentAndYear = getStudentFeeByStudentAndYear;
/**
 * @function getStudentFeesByStudent
 * @description Récupère tous les frais d'un étudiant (toutes années confondues)
 * @route GET /api/student-fees/student/:studentId
 * @access Staff/Admin
 * @param {string} studentId - ID de l'étudiant
 * @returns {Promise<void>}
 */
const getStudentFeesByStudent = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentId } = req.params;
        const result = await studentFeeService_1.StudentFeeService.getStudentFeesByStudent(studentId);
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEES_BY_STUDENT",
            entity: "StudentFee",
            description: "Consultation des frais d'un étudiant",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par étudiant:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_STUDENT_FEES_BY_STUDENT_ERROR",
            entity: "StudentFee",
            description: "Erreur lors de la récupération des frais par étudiant",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: {
                studentId: req.params.studentId,
            },
        });
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getStudentFeesByStudent = getStudentFeesByStudent;
//# sourceMappingURL=studentFeeController.js.map