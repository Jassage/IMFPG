/**
 * @file subjectRoutes.ts
 * @description Routes pour la gestion des matières scolaires
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
  requireTeacher,
  requireTeacherOrStaff,
} from "../middleware";

import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController";
import {
  validateCreateSubject,
  validateUpdateSubject,
} from "../utils/subjectValidators";

const router = Router();

/**
 * @route GET /api/academic/subjects
 * @description Récupère la liste des matières avec pagination et filtres
 * @access Staff/Admin
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [search] - Recherche dans nom/code/description
 * @query {string} [type] - Type de matière (OBLIGATORY, OPTIONAL, etc.)
 * @query {string} [sortBy=name] - Champ de tri
 * @query {string} [sortOrder=asc] - Ordre de tri (asc/desc)
 */
router.get("/", requireAuth, requireTeacherOrStaff, getSubjects);

/**
 * @route GET /api/academic/subjects/:id
 * @description Récupère une matière par ID avec ses relations
 * @access Staff/Admin
 * @param {string} id - ID de la matière
 */
router.get(
  "/:id",
  requireAuth,
  requireStaff,
  requireTeacher,
  sanitizeInput,
  getSubjectById
);

/**
 * @route POST /api/academic/subjects
 * @description Crée une nouvelle matière
 * @access Admin
 * @body {string} code - Code unique de la matière
 * @body {string} name - Nom de la matière
 * @body {number} credits - Nombre de crédits
 * @body {string} type - Type de matière
 * @body {number} [passingGrade=60] - Note de passage
 * @body {string} [description] - Description
 * @body {string[]} [objectives] - Objectifs pédagogiques
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateSubject,
  handleValidationErrors,
  createSubject
);

/**
 * @route PUT /api/academic/subjects/:id
 * @description Met à jour une matière
 * @access Admin
 * @param {string} id - ID de la matière
 * @body {string} [code] - Code unique de la matière
 * @body {string} [name] - Nom de la matière
 * @body {number} [credits] - Nombre de crédits
 * @body {string} [type] - Type de matière
 * @body {number} [passingGrade] - Note de passage
 * @body {string} [description] - Description
 * @body {string[]} [objectives] - Objectifs pédagogiques
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateSubject,
  handleValidationErrors,
  updateSubject
);

/**
 * @route DELETE /api/academic/subjects/:id
 * @description Supprime une matière (si aucune dépendance)
 * @access Admin
 * @param {string} id - ID de la matière
 */
router.delete("/:id", requireAuth, requireAdmin, sanitizeInput, deleteSubject);

export default router;
