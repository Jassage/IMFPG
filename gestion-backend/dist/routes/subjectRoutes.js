"use strict";
/**
 * @file subjectRoutes.ts
 * @description Routes pour la gestion des matières scolaires
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const subjectController_1 = require("../controllers/subjectController");
const subjectValidators_1 = require("../utils/subjectValidators");
const router = (0, express_1.Router)();
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
router.get("/", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, subjectController_1.getSubjects);
/**
 * @route GET /api/academic/subjects/:id
 * @description Récupère une matière par ID avec ses relations
 * @access Staff/Admin
 * @param {string} id - ID de la matière
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.requireTeacher, middleware_1.sanitizeInput, subjectController_1.getSubjectById);
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
router.post("/", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, subjectValidators_1.validateCreateSubject, middleware_1.handleValidationErrors, subjectController_1.createSubject);
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
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, subjectValidators_1.validateUpdateSubject, middleware_1.handleValidationErrors, subjectController_1.updateSubject);
/**
 * @route DELETE /api/academic/subjects/:id
 * @description Supprime une matière (si aucune dépendance)
 * @access Admin
 * @param {string} id - ID de la matière
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, subjectController_1.deleteSubject);
exports.default = router;
//# sourceMappingURL=subjectRoutes.js.map