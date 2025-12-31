"use strict";
/**
 * @file enrollmentController.ts
 * @description Contrôleur pour la gestion des inscriptions
 * @version 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentController = void 0;
// import { EnrollmentService } from "../services/enrollmentService";
const authUtils_1 = require("./auth/authUtils");
const enrollmentServ_1 = require("../services/enrollmentServ");
// import { extractAuditData } from "../middleware/auth";
// const enrollmentService = new EnrollmentService();
class EnrollmentController {
    /**
     * Récupère la liste des inscriptions
     */
    async getEnrollments(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                academicYearId: req.query.academicYearId,
                classId: req.query.classId,
                studentId: req.query.studentId,
                status: req.query.status,
                search: req.query.search,
                sortBy: req.query.sortBy || "enrollmentDate",
                sortOrder: req.query.sortOrder || "desc",
            };
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getEnrollments(filters, auditData);
            res.status(result.success ? 200 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getEnrollments error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère une inscription par ID
     */
    async getEnrollmentById(req, res) {
        try {
            const { id } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getEnrollmentById(id, auditData);
            res.status(result.success ? 200 : 404).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getEnrollmentById error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Crée une nouvelle inscription
     */
    async createEnrollment(req, res) {
        try {
            const data = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            // Validation basique
            if (!data.studentId || !data.classId || !data.academicYearId) {
                return res.status(400).json({
                    success: false,
                    message: "Données d'inscription incomplètes",
                    code: "INVALID_DATA",
                });
            }
            const result = await enrollmentServ_1.enrollmentService.createEnrollment(data, auditData);
            res.status(result.success ? 201 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - createEnrollment error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Met à jour une inscription
     */
    async updateEnrollment(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.updateEnrollment(id, data, auditData);
            res.status(result.success ? 200 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - updateEnrollment error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Désinscrit un étudiant
     */
    async unenrollStudent(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            if (!reason) {
                return res.status(400).json({
                    success: false,
                    message: "La raison de la désinscription est requise",
                    code: "REASON_REQUIRED",
                });
            }
            const result = await enrollmentServ_1.enrollmentService.unenrollStudent(id, reason, auditData);
            res.status(result.success ? 200 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - unenrollStudent error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Réinscrit un étudiant
     */
    async reenrollStudent(req, res) {
        try {
            const data = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            // Validation
            if (!data.studentId || !data.classId || !data.academicYearId) {
                return res.status(400).json({
                    success: false,
                    message: "Données de réinscription incomplètes",
                    code: "INVALID_DATA",
                });
            }
            const result = await enrollmentServ_1.enrollmentService.reenrollStudent(data, auditData);
            res.status(result.success ? 201 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - reenrollStudent error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Vérifie l'éligibilité à la promotion
     */
    async checkPromotionEligibility(req, res) {
        try {
            const { studentId, targetClassId } = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            if (!studentId || !targetClassId) {
                return res.status(400).json({
                    success: false,
                    message: "Données de vérification incomplètes",
                    code: "INVALID_DATA",
                });
            }
            const result = await enrollmentServ_1.enrollmentService.checkPromotionEligibility(studentId, targetClassId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - checkPromotionEligibility error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère les inscriptions d'un étudiant
     */
    async getStudentEnrollments(req, res) {
        try {
            const { studentId } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getStudentEnrollments(studentId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getStudentEnrollments error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère les statistiques d'inscription
     */
    async getEnrollmentStats(req, res) {
        try {
            const { academicYearId } = req.query;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getEnrollmentStats(academicYearId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getEnrollmentStats error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Crée des inscriptions en masse
     */
    async createBulkEnrollments(req, res) {
        try {
            const { enrollments } = req.body;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            if (!Array.isArray(enrollments) || enrollments.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Aucune donnée d'inscription fournie",
                    code: "NO_DATA",
                });
            }
            const result = await enrollmentServ_1.enrollmentService.createBulkEnrollments(enrollments, auditData);
            res.status(result.success ? 201 : 400).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - createBulkEnrollments error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère l'historique des inscriptions d'un étudiant
     */
    async getEnrollmentHistory(req, res) {
        try {
            const { studentId } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getEnrollmentHistory(studentId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getEnrollmentHistory error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère le bulletin d'un étudiant
     */
    async getStudentReportCard(req, res) {
        try {
            const { studentId, academicYearId } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getStudentReportCard(studentId, academicYearId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getStudentReportCard error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère les statistiques de classe
     */
    async getClassStatistics(req, res) {
        try {
            const { classId, academicYearId } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.getClassStatistics(classId, academicYearId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - getClassStatistics error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Génère un rapport de fin d'année
     */
    async generateYearEndReport(req, res) {
        try {
            const { classId, academicYearId } = req.params;
            const auditData = (0, authUtils_1.extractAuditData)(req);
            const result = await enrollmentServ_1.enrollmentService.generateYearEndReport(classId, academicYearId, auditData);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ EnrollmentController - generateYearEndReport error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
    /**
     * Récupère les structures de frais disponibles
     */
    async getAvailableFeeStructures(req, res) {
        try {
            const auditData = (0, authUtils_1.extractAuditData)(req);
            // Cette méthode devrait être dans le EnrollmentService
            // Pour l'instant, retournons une réponse simple
            res.status(200).json({
                success: true,
                message: "Fonctionnalité à implémenter",
            });
        }
        catch (error) {
            console.error("❌ EnrollmentController - getAvailableFeeStructures error:", error);
            res.status(500).json({
                success: false,
                message: "Erreur serveur",
                error: error.message,
            });
        }
    }
}
exports.EnrollmentController = EnrollmentController;
//# sourceMappingURL=enrollmentCtl.js.map