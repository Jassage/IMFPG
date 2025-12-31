/**
 * @file gradeRoutes.ts
 * @description Routes pour la gestion des notes des étudiants
 * @version 1.0.0
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  requireTeacher,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
  requireTeacherOrStaff,
} from "../middleware";

import {
  createGrade,
  deleteGrade,
  getGradeById,
  getGrades,
  updateGrade,
  getStudentGrades,
  bulkImportGrades,
  getGradeStatistics,
} from "../controllers/gradeController";
import {
  validateCreateGrade,
  validateUpdateGrade,
  validateBulkImportGrades,
  validateGradeFilters,
} from "../utils/gradeValidators";

const router = Router();

/**
 * @route GET /api/grades
 * @description Récupère la liste des notes avec pagination et filtres
 * @access Staff/Admin/Teacher
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [search] - Recherche dans nom étudiant/code matière
 * @query {string} [studentId] - ID de l'étudiant
 * @query {string} [subjectId] - ID de la matière
 * @query {string} [assignmentId] - ID de l'affectation
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle (CONTROLE_1 à CONTROLE_4)
 * @query {string} [status] - Statut (Valid_/Non_valid_/Reprendre)
 * @query {number} [minGrade] - Note minimale
 * @query {number} [maxGrade] - Note maximale
 * @query {string} [startDate] - Date de début (format ISO)
 * @query {string} [endDate] - Date de fin (format ISO)
 * @query {string} [sortBy=createdAt] - Champ de tri
 * @query {string} [sortOrder=desc] - Ordre de tri (asc/desc)
 */
router.get(
  "/",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  validateGradeFilters,
  handleValidationErrors,
  getGrades
);

/**
 * @route GET /api/academic/grades/statistics
 * @description Récupère les statistiques des notes
 * @access Admin/Teacher/Director
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle
 * @query {string} [subjectId] - ID de la matière
 * @query {string} [startDate] - Date de début (format ISO)
 * @query {string} [endDate] - Date de fin (format ISO)
 */
router.get(
  "/statistics",
  requireAuth,
  requireTeacher,
  sanitizeInput,
  getGradeStatistics
);

/**
 * @route GET /api/grades/student/:studentId
 * @description Récupère toutes les notes d'un étudiant spécifique
 * @access Staff/Admin/Teacher/Student (eux-mêmes)/Parent (leurs enfants)
 * @param {string} studentId - ID de l'étudiant
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle
 * @query {string} [session] - Session (Normale/Reprise)
 * @query {string} [subjectId] - ID de la matière
 */
router.get("/student/:studentId", requireAuth, sanitizeInput, getStudentGrades);

/**
 * @route GET /api/academic/grades/:id
 * @description Récupère une note spécifique par son ID
 * @access Staff/Admin/Teacher
 * @param {string} id - ID de la note
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getGradeById);

/**
 * @route POST /api/academic/grades
 * @description Crée une nouvelle note
 * @access Admin/Teacher/professor
 * @body {string} studentId - ID de l'étudiant (requis)
 * @body {string} subjectId - ID de la matière (requis)
 * @body {string} assignmentId - ID de l'affectation (requis)
 * @body {number} grade - Note (0-100, requis)
 * @body {string} academicYearId - ID de l'année académique (requis)
 * @body {string} [status=Valid_] - Statut (Valid_/Non_valid_/Reprendre)
 * @body {string} [session=Normale] - Session (Normale/Reprise)
 * @body {string} [controlType=CONTROLE_1] - Type de contrôle
 * @body {string} [classLevel] - Niveau de classe
 * @body {string} [notes] - Notes additionnelles
 */
router.post(
  "/",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateGrade,
  handleValidationErrors,
  createGrade
);

/**
 * @route POST /api/academic/grades/bulk-import
 * @description Importe des notes en masse
 * @access Admin/Teacher
 * @body {Array} grades - Tableau d'objets note
 * @body {string} grades[].studentId - ID de l'étudiant
 * @body {string} grades[].subjectId - ID de la matière
 * @body {number} grades[].grade - Note (0-100)
 * @body {string} academicYearId - ID de l'année académique
 * @body {string} [assignmentId] - ID de l'affectation (optionnel, par défaut)
 * @body {string} [grades[].status] - Statut
 * @body {string} [grades[].session] - Session
 * @body {string} [grades[].controlType] - Type de contrôle
 * @body {string} [grades[].classLevel] - Niveau de classe
 * @body {string} [grades[].notes] - Notes
 */
router.post(
  "/bulk-import",
  requireAuth,
  requireTeacher,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateBulkImportGrades,
  handleValidationErrors,
  bulkImportGrades
);

/**
 * @route PUT /api/academic/grades/:id
 * @description Met à jour une note existante
 * @access Admin/Teacher
 * @param {string} id - ID de la note
 * @body {number} [grade] - Note (0-100)
 * @body {string} [status] - Statut (Valid_/Non_valid_/Reprendre)
 * @body {string} [session] - Session (Normale/Reprise)
 * @body {string} [controlType] - Type de contrôle
 * @body {string} [notes] - Notes additionnelles
 * @body {boolean} [isActive] - Statut d'activité
 */
router.put(
  "/:id",
  requireAuth,
  requireTeacher,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateGrade,
  handleValidationErrors,
  updateGrade
);

/**
 * @route DELETE /api/academic/grades/:id
 * @description Supprime une note
 * @access Admin uniquement
 * @param {string} id - ID de la note
 */
router.delete("/:id", requireAuth, requireAdmin, sanitizeInput, deleteGrade);

export default router;
