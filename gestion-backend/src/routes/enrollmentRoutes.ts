/**
 * @file enrollmentRoutes.ts
 * @description Routes pour la gestion des inscriptions et réinscriptions
 * @version 1.0.0
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
  requireSecretary,
  requireDirector,
} from "../middleware";

import {
  createEnrollment,
  getEnrollmentById,
  getEnrollments,
  updateEnrollment,
  unenrollStudent,
  getStudentEnrollments,
  reenrollStudent,
  validateReenrollment,
  getEnrollmentStats,
  createBulkEnrollments,
  getEnrollmentHistory,
  getAvailableFeeStructures,
  deleteEnrollment,
} from "../controllers/enrollmentController";
import {
  validateCreateEnrollment,
  validateUpdateEnrollment,
  validateReenrollment as validateReenrollmentSchema,
  validateBulkEnrollments,
  validateUnenroll,
} from "../utils/enrollmentValidators";

const router = Router();

/**
 * @route GET /api/enrollments
 * @description Récupère la liste des inscriptions avec filtres
 * @access Staff/Admin
 */
router.get("/", requireAuth, requireStaff, getEnrollments);

/**
 * @route GET /api/enrollments/stats
 * @description Récupère les statistiques d'inscription
 * @access Admin/Directeur
 */
router.get("/stats", requireAuth, requireAdmin, getEnrollmentStats);

/**
 * @route GET /api/enrollments/:id
 * @description Récupère une inscription par ID
 * @access Staff/Admin
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getEnrollmentById);

/**
 * @route GET /api/enrollments/student/:studentId
 * @description Récupère les inscriptions d'un étudiant
 * @access Staff/Admin/Parent (si leur enfant)
 */
router.get(
  "/student/:studentId",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getStudentEnrollments
);

/**
 * @route GET /api/enrollments/history/:studentId
 * @description Récupère l'historique complet des inscriptions d'un étudiant
 * @access Staff/Admin
 */
router.get(
  "/history/:studentId",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getEnrollmentHistory
);

/**
 * @route GET /api/enrollments/validate/:studentId
 * @description Valide un étudiant pour la réinscription
 * @access Staff/Admin
 */
router.get(
  "/validate/:studentId",
  requireAuth,
  requireStaff,
  sanitizeInput,
  validateReenrollment
);

/**
 * @route POST /api/enrollments
 * @description Crée une nouvelle inscription
 * @access Admin
 */
router.post(
  "/",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateEnrollment,
  handleValidationErrors,
  createEnrollment
);

/**
 * @route POST /api/enrollments/bulk
 * @description Crée des inscriptions en masse
 * @access Admin
 */
router.post(
  "/bulk",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateBulkEnrollments,
  handleValidationErrors,
  createBulkEnrollments
);

/**
 * @route POST /api/enrollments/reenroll
 * @description Réinscrit un étudiant
 * @access Admin
 */
router.post(
  "/reenroll",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateReenrollmentSchema,
  handleValidationErrors,
  reenrollStudent
);

/**
 * @route PUT /api/enrollments/:id
 * @description Met à jour une inscription
 * @access Admin
 */
router.put(
  "/:id",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateEnrollment,
  handleValidationErrors,
  updateEnrollment
);

/**
 * @route POST /api/enrollments/:id/unenroll
 * @description Désinscrit un étudiant
 * @access Admin
 */
router.post(
  "/:id/unenroll",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUnenroll,
  handleValidationErrors,
  unenrollStudent
);

// router.delete("/:id", requireAuth, requireAdmin, deleteEnrollment);

/**
 * @route GET /api/enrollments/fee-structures
 * @description Récupère les structures de frais disponibles pour l'inscription
 * @access Staff/Admin
 * @returns {Object} Liste des structures de frais
 */
router.get(
  "/fee-structures",
  requireAuth,
  requireStaff,
  getAvailableFeeStructures
);

/**
 * @route DELETE /api/enrollments/:id/delete
 * @description Supprime une inscription par ID (à utiliser avec prudence)
 * @access Admin
 */
router.delete(
  "/:id/delete",
  requireAuth,
  requireDirector,
  sanitizeInput,
  deleteEnrollment
);

export default router;
