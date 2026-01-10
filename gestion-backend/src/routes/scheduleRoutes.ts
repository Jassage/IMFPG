/**
 * @file scheduleRoutes.ts
 * @description Routes pour la gestion des emplois du temps
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
} from "../middleware";

import {
  createSchedule,
  deleteSchedule,
  getScheduleById,
  getAllSchedules,
  getClassTimetable,
  generateTimetable,
  updateSchedule,
  getProfessorSchedule,
  checkConflicts,
  getAvailableTimeSlots,
} from "../controllers/scheduleController";
import {
  validateCreateSchedule,
  validateUpdateSchedule,
  validateGenerateTimetable,
} from "../utils/scheduleValidators";
import { debugRequests } from "../middleware/debugMiddleware";

const router = Router();

/**
 * @route GET /api/schedules
 * @description Récupère tous les horaires avec pagination et filtres
 * @access Staff/Admin
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [classId] - ID de la classe
 * @query {string} [professeurId] - ID du professeur
 * @query {string} [dayOfWeek] - Jour de la semaine
 * @query {string} [status] - Statut (ACTIVE/INACTIVE/CANCELLED)
 * @query {string} [academicYearId] - ID de l'année académique
 */
router.get("/", requireAuth, requireStaff, getAllSchedules);

/**
 * @route GET /api/schedules/:id
 * @description Récupère un horaire par ID avec ses relations
 * @access Staff/Admin
 * @param {string} id - ID de l'horaire
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getScheduleById);

/**
 * @route GET /api/schedules/class/:classId
 * @description Récupère l'emploi du temps d'une classe
 * @access Staff/Admin
 * @param {string} classId - ID de la classe
 * @query {string} academicYearId - ID de l'année académique
 * @query {string} [startDate] - Date de début (optionnel)
 * @query {string} [endDate] - Date de fin (optionnel)
 */
router.get("/class/:classId", requireAuth, sanitizeInput, getClassTimetable);

/**
 * @route GET /api/schedules/professor/:professeurId
 * @description Récupère l'emploi du temps d'un professeur
 * @access Staff/Admin/Professeur
 * @param {string} professeurId - ID du professeur
 * @query {string} [startDate] - Date de début (optionnel)
 * @query {string} [endDate] - Date de fin (optionnel)
 */
router.get(
  "/professor/:professeurId",
  requireAuth,
  sanitizeInput,
  getProfessorSchedule
);

/**
 * @route GET /api/schedules/available-slots
 * @description Récupère les créneaux disponibles
 * @access Staff/Admin
 * @query {string} classId - ID de la classe
 * @query {string} dayOfWeek - Jour de la semaine
 * @query {string} [professeurId] - ID du professeur (optionnel)
 * @query {string} [classroom] - Salle (optionnel)
 */
router.get(
  "/available-slots",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getAvailableTimeSlots
);

/**
 * @route GET /api/schedules/check-conflicts
 * @description Vérifie les conflits d'horaire
 * @access Staff/Admin
 * @query {string} professeurId - ID du professeur
 * @query {string} classId - ID de la classe
 * @query {string} dayOfWeek - Jour de la semaine
 * @query {string} startTime - Heure de début
 * @query {string} endTime - Heure de fin
 * @query {string} [classroom] - Salle (optionnel)
 * @query {string} [excludeScheduleId] - ID de l'horaire à exclure (optionnel)
 */
router.get(
  "/check-conflicts",
  debugRequests,
  requireAuth,
  requireStaff,
  sanitizeInput,
  checkConflicts
);

/**
 * @route POST /api/schedules
 * @description Crée un nouvel horaire
 * @access Admin/Staff
 * @body {string} assignmentId - ID de l'assignation
 * @body {string} classId - ID de la classe
 * @body {string} dayOfWeek - Jour de la semaine (MONDAY, TUESDAY, etc.)
 * @body {string} startTime - Heure de début (format: HH:mm)
 * @body {string} endTime - Heure de fin (format: HH:mm)
 * @body {string} [classroom] - Salle de classe
 * @body {string} [recurrence] - Récurrence (WEEKLY, BIWEEKLY, MONTHLY)
 * @body {string} [untilDate] - Date de fin de récurrence
 * @body {string} [notes] - Notes supplémentaires
 */
router.post(
  "/",
  debugRequests,
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateSchedule,
  handleValidationErrors,
  createSchedule
);

/**
 * @route POST /api/schedules/generate
 * @description Génère un emploi du temps automatiquement
 * @access Admin
 * @body {string} classId - ID de la classe
 * @body {string} academicYearId - ID de l'année académique
 * @body {Object} [constraints] - Contraintes de génération
 * @body {number} [constraints.maxHoursPerDay=6] - Heures max par jour
 * @body {Object} [constraints.breakTime] - Pause déjeuner
 * @body {string} [constraints.breakTime.start] - Début pause
 * @body {string} [constraints.breakTime.end] - Fin pause
 */
router.post(
  "/generate",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateGenerateTimetable,
  handleValidationErrors,
  generateTimetable
);

/**
 * @route PUT /api/schedules/:id
 * @description Met à jour un horaire
 * @access Admin/Staff
 * @param {string} id - ID de l'horaire
 * @body {string} [dayOfWeek] - Jour de la semaine
 * @body {string} [startTime] - Heure de début
 * @body {string} [endTime] - Heure de fin
 * @body {string} [classroom] - Salle de classe
 * @body {string} [recurrence] - Récurrence
 * @body {string} [untilDate] - Date de fin de récurrence
 * @body {string} [notes] - Notes
 * @body {string} [status] - Statut (ACTIVE/INACTIVE/CANCELLED)
 */
router.put(
  "/:id",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateSchedule,
  handleValidationErrors,
  updateSchedule
);

/**
 * @route DELETE /api/schedules/:id
 * @description Supprime un horaire
 * @access Admin
 * @param {string} id - ID de l'horaire
 */
router.delete("/:id", requireAuth, requireAdmin, sanitizeInput, deleteSchedule);

export default router;
