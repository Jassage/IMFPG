/**
 * @file gradeRoutes.ts
 * @description Routes pour la gestion des notes des étudiants avec workflow de validation
 * @version 2.0.0
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireTeacher,
  requireDirector,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
  requireTeacherOrStaff,
} from "../middleware";
import {
  createGrade,
  createAndPublishGrade,
  deleteGrade,
  getGradeById,
  getGrades,
  updateGrade,
  updateAndPublishGrade,
  getStudentGrades,
  bulkImportGrades,
  getGradeStatistics,
  getAdminGradeStatistics,
  getPendingApproval,
  submitGradesForApproval,
  approveGrades,
  approveAndPublishGrades,
  rejectGrades,
  publishGradesToStudents,
  getGradesByClass,
  getGradesBySubject,
  getPalmares,
  getPalmaresCumulatif,
} from "../controllers/gradeController";
import {
  validateCreateGrade,
  validateUpdateGrade,
  validateBulkImportGrades,
  validateGradeFilters,
} from "../utils/gradeValidators";

const router = Router();

/**
 * Routes publiques (avec authentification)
 */

/**
 * @route GET /api/grades/student/:studentId
 * @description Récupère toutes les notes d'un étudiant spécifique
 * @access Student (eux-mêmes), Professeur, Admin
 * @param {string} studentId - ID de l'étudiant
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle
 * @query {string} [subjectId] - ID de la matière
 * @query {boolean} [includeDraft=false] - Inclure les brouillons (admin/professeur seulement)
 */
router.get("/student/:studentId", requireAuth, sanitizeInput, getStudentGrades);

/**
 * @route GET /api/grades/palmares
 * @description Génère le palmarès (classement) d'un niveau pour un contrôle
 * @access Staff / Admin / Directeur
 * @query {string} classLevel, controlType, academicYearId, [status]
 */
router.get("/palmares", requireAuth, requireDirector, sanitizeInput, getPalmares);

/**
 * @route GET /api/grades/palmares-cumulatif
 * @description Génère le palmarès cumulatif (notes totales) d'un niveau pour une année
 * @access Staff / Admin / Directeur
 * @query {string} classLevel, academicYearId, [status], [controlTypes] (liste séparée par des virgules)
 */
router.get(
  "/palmares-cumulatif",
  requireAuth,
  requireDirector,
  sanitizeInput,
  getPalmaresCumulatif
);

/**
 * @route GET /api/grades/:id
 * @description Récupère une note spécifique par son ID
 * @access Student (leurs notes), Professeur, Admin
 * @param {string} id - ID de la note
 */
router.get("/:id", requireAuth, sanitizeInput, getGradeById);

/**
 * Routes pour les professeurs
 */

/**
 * @route GET /api/grades
 * @description Récupère la liste des notes avec pagination et filtres
 * @access Professeur, Admin
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [search] - Recherche dans nom étudiant/code matière
 * @query {string} [studentId] - ID de l'étudiant
 * @query {string} [subjectId] - ID de la matière
 * @query {string} [assignmentId] - ID de l'affectation
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle (CONTROLE_1 à CONTROLE_4)
 * @query {string} [status] - Statut (Draft, Submitted, Approved, Published, Rejected)
 * @query {number} [minGrade] - Note minimale
 * @query {number} [maxGrade] - Note maximale
 * @query {string} [startDate] - Date de début (format ISO)
 * @query {string} [endDate] - Date de fin (format ISO)
 * @query {string} [sortBy=createdAt] - Champ de tri
 * @query {string} [sortOrder=desc] - Ordre de tri (asc/desc)
 * @query {string} [createdBy] - ID de l'utilisateur qui a créé la note
 */
router.get("/", requireAuth, sanitizeInput, handleValidationErrors, getGrades);

/**
 * @route GET /api/grades/class/:classId
 * @description Récupère les notes par classe
 * @access Professeur, Admin
 * @param {string} classId - ID de la classe
 * @query {string} academicYearId - ID de l'année académique (requis)
 * @query {string} [controlType] - Type de contrôle
 * @query {string} [subjectId] - ID de la matière
 * @query {boolean} [includeDraft=false] - Inclure les brouillons
 */
router.get(
  "/class/:classId",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getGradesByClass
);

/**
 * @route GET /api/grades/subject/:subjectId
 * @description Récupère les notes par matière
 * @access Professeur, Admin
 * @param {string} subjectId - ID de la matière
 * @query {string} academicYearId - ID de l'année académique (requis)
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle
 * @query {boolean} [includeDraft=false] - Inclure les brouillons
 */
router.get(
  "/subject/:subjectId",
  requireAuth,
  requireTeacher,
  sanitizeInput,
  getGradesBySubject
);

/**
 * @route POST /api/grades
 * @description Crée une nouvelle note (brouillon ou soumise selon rôle)
 * @access Professeur, Admin
 * @body {string} studentId - ID de l'étudiant (requis)
 * @body {string} subjectId - ID de la matière (requis)
 * @body {string} assignmentId - ID de l'affectation (requis)
 * @body {number} grade - Note (0-100, requis)
 * @body {string} academicYearId - ID de l'année académique (requis)
 * @body {string} [status] - Statut (Draft, Submitted)
 * @body {string} [controlType=CONTROLE_1] - Type de contrôle
 * @body {string} [classLevel] - Niveau de classe
 * @body {string} [notes] - Notes additionnelles
 * @body {boolean} [isDraft=false] - Enregistrer en brouillon
 */
router.post(
  "/",
  requireAuth,
  requireTeacher,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateGrade,
  handleValidationErrors,
  createGrade
);

/**
 * @route POST /api/grades/submit
 * @description Soumet des notes pour validation
 * @access Professeur
 * @body {string[]} [gradeIds] - IDs des notes à soumettre
 * @body {boolean} [submitAll=false] - Soumettre toutes les notes
 * @body {object} [filters] - Filtres si submitAll=true
 * @body {string} [filters.assignmentId] - ID de l'affectation
 * @body {string} [filters.controlType] - Type de contrôle
 * @body {string} [filters.classLevel] - Niveau de classe
 * @body {string} [filters.subjectId] - ID de la matière
 */
router.post(
  "/submit",
  requireAuth,
  requireTeacher,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  submitGradesForApproval
);

/**
 * @route PUT /api/grades/:id
 * @description Met à jour une note existante
 * @access Professeur (ses notes), Admin
 * @param {string} id - ID de la note
 * @body {number} [grade] - Note (0-100)
 * @body {string} [status] - Nouveau statut
 * @body {string} [controlType] - Type de contrôle
 * @body {string} [notes] - Notes additionnelles
 * @body {boolean} [isActive] - Statut d'activité
 * @body {string} [rejectionReason] - Raison du rejet (admin seulement)
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
 * Routes pour les administrateurs
 */

/**
 * @route GET /api/grades/admin/pending
 * @description Récupère les notes en attente de validation
 * @access Admin uniquement
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [submittedBy] - ID du professeur qui a soumis
 * @query {string} [assignmentId] - ID de l'affectation
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [subjectId] - ID de la matière
 * @query {string} [startDate] - Date de début (format ISO)
 * @query {string} [endDate] - Date de fin (format ISO)
 */
router.get(
  "/admin/pending",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  getPendingApproval
);

/**
 * @route GET /api/grades/admin/statistics
 * @description Récupère les statistiques détaillées des notes (admin seulement)
 * @access Admin uniquement
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [classLevel] - Niveau de classe
 * @query {string} [controlType] - Type de contrôle
 * @query {string} [professorId] - ID du professeur
 * @query {string} [startDate] - Date de début (format ISO)
 * @query {string} [endDate] - Date de fin (format ISO)
 */
router.get(
  "/admin/statistics",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  getAdminGradeStatistics
);

/**
 * @route GET /api/grades/statistics
 * @description Récupère les statistiques des notes
 * @access Professeur, Admin
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
 * @route POST /api/grades/admin/create-publish
 * @description Crée et publie directement une note (admin seulement)
 * @access Admin uniquement
 * @body {string} studentId - ID de l'étudiant (requis)
 * @body {string} subjectId - ID de la matière (requis)
 * @body {string} assignmentId - ID de l'affectation (requis)
 * @body {number} grade - Note (0-100, requis)
 * @body {string} academicYearId - ID de l'année académique (requis)
 * @body {string} [controlType=CONTROLE_1] - Type de contrôle
 * @body {string} [classLevel] - Niveau de classe
 * @body {string} [notes] - Notes additionnelles
 */
router.post(
  "/admin/create-publish",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateGrade,
  handleValidationErrors,
  createAndPublishGrade
);

/**
 * @route PUT /api/grades/admin/:id/publish
 * @description Met à jour et publie directement une note (admin seulement)
 * @access Admin uniquement
 * @param {string} id - ID de la note
 * @body {number} [grade] - Note (0-100)
 * @body {string} [controlType] - Type de contrôle
 * @body {string} [notes] - Notes additionnelles
 * @body {boolean} [isActive] - Statut d'activité
 */
router.put(
  "/admin/:id/publish",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateGrade,
  handleValidationErrors,
  updateAndPublishGrade
);

/**
 * @route POST /api/grades/admin/approve
 * @description Approuve une ou plusieurs notes
 * @access Admin uniquement
 * @body {string[]} gradeIds - IDs des notes à approuver
 * @body {boolean} [publishToStudents=false] - Publier directement aux étudiants
 */
router.post(
  "/admin/approve",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  approveGrades
);

/**
 * @route POST /api/grades/admin/approve-publish
 * @description Approuve et publie des notes en une seule opération
 * @access Admin uniquement
 * @body {string[]} gradeIds - IDs des notes à approuver et publier
 */
router.post(
  "/admin/approve-publish",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  approveAndPublishGrades
);

/**
 * @route POST /api/grades/admin/reject
 * @description Rejette une ou plusieurs notes
 * @access Admin uniquement
 * @body {string[]} gradeIds - IDs des notes à rejeter
 * @body {string} reason - Raison du rejet (requis)
 */
router.post(
  "/admin/reject",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  rejectGrades
);

/**
 * @route POST /api/grades/admin/publish
 * @description Publie des notes approuvées aux étudiants
 * @access Admin uniquement
 * @body {string[]} gradeIds - IDs des notes à publier
 */
router.post(
  "/admin/publish",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  publishGradesToStudents
);

/**
 * @route POST /api/grades/bulk-import
 * @description Importe des notes en masse
 * @access Professeur, Admin
 * @body {Array} grades - Tableau d'objets note
 * @body {string} grades[].studentId - ID de l'étudiant
 * @body {string} grades[].subjectId - ID de la matière
 * @body {number} grades[].grade - Note (0-100)
 * @body {string} academicYearId - ID de l'année académique (requis)
 * @body {string} [assignmentId] - ID de l'affectation
 * @body {string} [grades[].status] - Statut
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
 * @route DELETE /api/grades/:id
 * @description Supprime une note
 * @access Admin uniquement (les professeurs ne peuvent pas supprimer)
 * @param {string} id - ID de la note
 */
router.delete("/:id", requireAuth, requireAdmin, sanitizeInput, deleteGrade);

export default router;
