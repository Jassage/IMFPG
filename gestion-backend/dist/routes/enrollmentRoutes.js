"use strict";
/**
 * @file enrollmentRoutes.ts
 * @description Routes pour la gestion des inscriptions et réinscriptions
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const enrollmentController_1 = require("../controllers/enrollmentController");
const enrollmentValidators_1 = require("../utils/enrollmentValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/enrollments
 * @description Récupère la liste des inscriptions avec filtres
 * @access Staff/Admin
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireStaff, enrollmentController_1.getEnrollments);
/**
 * @route GET /api/enrollments/stats
 * @description Récupère les statistiques d'inscription
 * @access Admin/Directeur
 */
router.get("/stats", middleware_1.requireAuth, middleware_1.requireAdmin, enrollmentController_1.getEnrollmentStats);
/**
 * @route GET /api/enrollments/:id
 * @description Récupère une inscription par ID
 * @access Staff/Admin
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, enrollmentController_1.getEnrollmentById);
/**
 * @route GET /api/enrollments/student/:studentId
 * @description Récupère les inscriptions d'un étudiant
 * @access Staff/Admin/Parent (si leur enfant)
 */
router.get("/student/:studentId", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, enrollmentController_1.getStudentEnrollments);
/**
 * @route GET /api/enrollments/history/:studentId
 * @description Récupère l'historique complet des inscriptions d'un étudiant
 * @access Staff/Admin
 */
router.get("/history/:studentId", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, enrollmentController_1.getEnrollmentHistory);
/**
 * @route GET /api/enrollments/validate/:studentId
 * @description Valide un étudiant pour la réinscription
 * @access Staff/Admin
 */
router.get("/validate/:studentId", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, enrollmentController_1.validateReenrollment);
/**
 * @route POST /api/enrollments
 * @description Crée une nouvelle inscription
 * @access Admin
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireStaff, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, enrollmentValidators_1.validateCreateEnrollment, middleware_1.handleValidationErrors, enrollmentController_1.createEnrollment);
/**
 * @route POST /api/enrollments/bulk
 * @description Crée des inscriptions en masse
 * @access Admin
 */
router.post("/bulk", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, enrollmentValidators_1.validateBulkEnrollments, middleware_1.handleValidationErrors, enrollmentController_1.createBulkEnrollments);
/**
 * @route POST /api/enrollments/reenroll
 * @description Réinscrit un étudiant
 * @access Admin
 */
router.post("/reenroll", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, enrollmentValidators_1.validateReenrollment, middleware_1.handleValidationErrors, enrollmentController_1.reenrollStudent);
/**
 * @route PUT /api/enrollments/:id
 * @description Met à jour une inscription
 * @access Admin
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, enrollmentValidators_1.validateUpdateEnrollment, middleware_1.handleValidationErrors, enrollmentController_1.updateEnrollment);
/**
 * @route POST /api/enrollments/:id/unenroll
 * @description Désinscrit un étudiant
 * @access Admin
 */
router.post("/:id/unenroll", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, enrollmentController_1.unenrollStudent);
// router.delete("/:id", requireAuth, requireAdmin, deleteEnrollment);
/**
 * @route GET /api/enrollments/fee-structures
 * @description Récupère les structures de frais disponibles pour l'inscription
 * @access Staff/Admin
 * @returns {Object} Liste des structures de frais
 */
router.get("/fee-structures", middleware_1.requireAuth, middleware_1.requireStaff, enrollmentController_1.getAvailableFeeStructures);
/**
 * @route GET /api/enrollments/:id/delete
 * @description Supprime une inscription par ID (à utiliser avec prudence)
 * @access Admin
 */
router.delete("/:id/delete", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, enrollmentController_1.deleteEnrollment);
exports.default = router;
//# sourceMappingURL=enrollmentRoutes.js.map