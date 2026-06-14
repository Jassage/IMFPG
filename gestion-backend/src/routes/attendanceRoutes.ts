/**
 * @file attendanceRoutes.ts
 * @description Routes pour la gestion des présences
 */

import { Router } from "express";
import {
  requireAuth,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  requireTeacherOrStaff,
  requireDirector,
} from "../middleware";

import {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  validateAttendance,
  justifyAttendance,
  recordAttendanceByScan,
  getAttendanceStats,
  getClassAttendances,
  getAttendanceSessions,
  createAttendanceSession,
  updateAttendanceSession,
  completeAttendanceSession,
  cancelAttendanceSession,
  getSessionAttendances,
  getOverallAttendanceStats,
  getAttendanceSettings,
  updateAttendanceSettings,
  openAttendanceSession,
  getSessionRoster,
  saveSessionAttendance,
} from "../controllers/attendanceController";

const router = Router();

// ==================== ROUTES PRÉSENCES ====================

/**
 * @route GET /api/attendance
 * @description Récupère la liste des présences
 * @access Staff/Admin/Teacher
 */
router.get("/", requireAuth, requireTeacherOrStaff, getAttendances);

/**
 * @route GET /api/attendance/stats
 * @description Récupère les statistiques de présence
 * @access Staff/Admin/Teacher
 */
router.get("/stats", requireAuth, requireTeacherOrStaff, getAttendanceStats);

/**
 * @route GET /api/attendance/settings
 * @description Récupère les paramètres de présence
 * @access Admin/Director
 */
router.get("/settings", requireAuth, requireDirector, getAttendanceSettings);

/**
 * @route PUT /api/attendance/settings
 * @description Met à jour les paramètres de présence
 * @access Admin/Director
 */
router.put(
  "/settings",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  updateAttendanceSettings,
);

/**
 * @route GET /api/attendance/overall-stats
 * @description Récupère les statistiques générales
 * @access Staff/Admin/Teacher
 */
router.get(
  "/overall-stats",
  requireAuth,
  requireTeacherOrStaff,
  getOverallAttendanceStats,
);

/**
 * @route POST /api/attendance/scan
 * @description Enregistre une présence par scan
 * @access Staff/Admin/Teacher
 */
router.post(
  "/scan",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  recordAttendanceByScan,
);

/**
 * @route GET /api/attendance/class/:classId
 * @description Récupère les présences d'une classe pour une date
 * @access Staff/Admin/Teacher
 */
router.get(
  "/class/:classId",
  requireAuth,
  requireTeacherOrStaff,
  getClassAttendances,
);

/**
 * @route GET /api/attendance/sessions
 * @description Récupère la liste des sessions
 * @access Staff/Admin/Teacher
 *
 * NOTE: doit être déclarée avant GET /:id, sinon "/:id" (segment unique)
 * intercepte "/sessions" et renvoie "Présence non trouvée" (ATTENDANCE_NOT_FOUND)
 */
router.get(
  "/sessions",
  requireAuth,
  requireTeacherOrStaff,
  getAttendanceSessions,
);

/**
 * @route GET /api/attendance/:id
 * @description Récupère une présence par ID
 * @access Staff/Admin/Teacher
 */
router.get(
  "/:id",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getAttendanceById,
);

/**
 * @route POST /api/attendance
 * @description Crée une nouvelle présence
 * @access Staff/Admin/Teacher
 */
router.post(
  "/",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  createAttendance,
);

/**
 * @route PUT /api/attendance/:id
 * @description Met à jour une présence
 * @access Staff/Admin/Teacher
 */
router.put(
  "/:id",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  updateAttendance,
);

/**
 * @route PUT /api/attendance/:id/validate
 * @description Valide une présence
 * @access Admin/Director
 */
router.put(
  "/:id/validate",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateAttendance,
);

/**
 * @route PATCH /api/attendance/:id/justify
 * @description Justifie une absence/retard
 * @access Staff/Admin/Teacher
 */
router.patch(
  "/:id/justify",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  justifyAttendance,
);

// ==================== ROUTES SESSIONS ====================

/**
 * @route POST /api/attendance/sessions
 * @description Crée une nouvelle session
 * @access Staff/Admin/Teacher
 */
router.post(
  "/sessions",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  createAttendanceSession,
);

/**
 * @route GET /api/attendance/sessions/:sessionId/attendances
 * @description Récupère les présences d'une session
 * @access Staff/Admin/Teacher
 */
router.get(
  "/sessions/:sessionId/attendances",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getSessionAttendances,
);

/**
 * @route PUT /api/attendance/sessions/:id
 * @description Met à jour une session
 * @access Staff/Admin/Teacher
 */
router.put(
  "/sessions/:id",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  updateAttendanceSession,
);

/**
 * @route PATCH /api/attendance/sessions/:id/complete
 * @description Marque une session comme terminée
 * @access Staff/Admin/Teacher
 */
router.patch(
  "/sessions/:id/complete",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  completeAttendanceSession,
);

/**
 * @route PATCH /api/attendance/sessions/:id/cancel
 * @description Annule une session
 * @access Admin/Director
 */
router.patch(
  "/sessions/:id/cancel",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  cancelAttendanceSession,
);

// ==================== APPEL PAR SÉANCE (PROFESSEUR) ====================

/**
 * @route POST /api/attendance/sessions/open
 * @description Ouvre ou récupère la séance d'un cours pour faire l'appel
 * @access Staff/Admin/Teacher
 */
router.post(
  "/sessions/open",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  openAttendanceSession,
);

/**
 * @route GET /api/attendance/sessions/:sessionId/roster
 * @description Récupère la liste des élèves d'une séance avec leur statut
 * @access Staff/Admin/Teacher
 */
router.get(
  "/sessions/:sessionId/roster",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getSessionRoster,
);

/**
 * @route POST /api/attendance/sessions/:sessionId/records
 * @description Enregistre l'appel d'une séance (statut définitif)
 * @access Staff/Admin/Teacher
 */
router.post(
  "/sessions/:sessionId/records",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  saveSessionAttendance,
);

export default router;
