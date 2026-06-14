// studentRoutes.ts - VERSION CORRIGÉE AVEC UPLOAD PHOTO
import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
  requireTeacher,
  requireTeacherOrStaff,
  requireDirector,
  validateContentTypeFlexible,
} from "../middleware";

import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
  updateStudentStatus,
  assignStudentToClass,
  getStudentStatistics,
  importStudents,
  searchStudents,
  checkEmailAvailability,
  getStudentsByClass,
  exportStudents,
} from "../controllers/studentController";
import {
  validateCreateStudent,
  validateUpdateStudent,
  validateAssignClass,
} from "../utils/studentValidators";
import {
  uploadProfile,
  logUpload,
  uploadStudentPhoto,
  parseStudentForm,
} from "../middleware/upload";

const router = Router();

/**
 * @route GET /api/students/check-email
 * @description Vérifie la disponibilité d'un email
 * @access Public (pour les formulaires d'inscription)
 */
router.get("/check-email", checkEmailAvailability);

// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================

/**
 * @route GET /api/students
 * @description Récupère la liste des étudiants avec pagination et filtres
 * @access Staff/Admin/Teacher
 */
router.get("/", requireAuth, sanitizeInput, getStudents);

/**
 * @route GET /api/students/search
 * @description Recherche des étudiants par terme
 * @access Staff/Admin/Teacher
 */
router.get("/search", requireAuth, requireStaff, sanitizeInput, searchStudents);

/**
 * @route GET /api/students/statistics
 * @description Récupère les statistiques des étudiants
 * @access Admin
 */
router.get(
  "/statistics",
  requireAuth,
  requireDirector,
  sanitizeInput,
  getStudentStatistics,
);

/**
 * @route GET /api/students/export
 * @description Exporte la liste des étudiants en CSV/Excel
 * @access Admin
 */
router.get("/export", requireAuth, requireAdmin, sanitizeInput, exportStudents);

/**
 * @route GET /api/students/:id
 * @description Récupère un étudiant par ID
 * @access Staff/Admin/Teacher
 */
router.get("/:id", requireAuth, sanitizeInput, getStudentById);

/**
 * @route POST /api/students
 * @description Crée un nouvel étudiant avec photo
 * @access Admin/Staff
 */
router.post(
  "/",
  requireAuth,
  requireStaff,
  uploadProfile.single("photo"), // ← UN SEUL middleware multer
  logUpload,
  parseStudentForm, // ← Parse les champs JSON après multer
  sanitizeInput,
  validateCreateStudent,
  handleValidationErrors,
  createStudent,
);

/**
 * @route POST /api/students/import
 * @description Importe des étudiants depuis un fichier CSV/Excel
 * @access Admin
 */
router.post(
  "/import",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  importStudents,
);

/**
 * @route PUT /api/students/:id
 * @description Met à jour un étudiant avec photo
 * @access Admin/Staff
 */
router.put(
  "/:id",
  requireAuth,
  requireStaff,
  uploadProfile.single("photo"), // ← UN SEUL middleware multer
  logUpload,
  parseStudentForm, // ← Parse les champs JSON après multer
  sanitizeInput,
  validateUpdateStudent,
  handleValidationErrors,
  updateStudent,
);

/**
 * @route PUT /api/students/:id/status
 * @description Change le statut d'un étudiant
 * @access Admin
 */
router.put(
  "/:id/status",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  updateStudentStatus,
);

/**
 * @route PUT /api/students/:id/assign-class
 * @description Affecte un étudiant à une classe
 * @access Admin
 */
router.put(
  "/:id/assign-class",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateAssignClass,
  handleValidationErrors,
  assignStudentToClass,
);

/**
 * @route DELETE /api/students/:id
 * @description Supprime un étudiant
 * @access Admin
 */
router.delete(
  "/:id",
  requireAuth,
  requireDirector,
  sanitizeInput,
  deleteStudent,
);

/**
 * @route GET /api/classes/:classId/students
 * @description Récupère les étudiants d'une classe spécifique
 * @access Staff/Admin/Teacher
 */
router.get(
  "/classes/:classId/students",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getStudentsByClass,
);

export default router;
