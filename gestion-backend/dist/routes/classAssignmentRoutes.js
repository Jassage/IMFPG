"use strict";
/**
 * @file classAssignmentRoutes.ts
 * @description Routes pour la gestion des assignations de cours aux classes
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const classAssignmentController_1 = require("../controllers/classAssignmentController");
const classAssignmentValidators_1 = require("../utils/classAssignmentValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/academic/class-assignments
 * @description Récupère la liste des assignations avec pagination et filtres
 * @access Staff/Admin
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=20] - Nombre d'éléments par page
 * @query {string} [search] - Recherche dans matière/professeur
 * @query {string} [classLevel] - Niveau de classe (CP1, CP2, etc.)
 * @query {string} [academicYearId] - ID de l'année académique
 * @query {string} [professeurId] - ID du professeur
 * @query {string} [subjectId] - ID de la matière
 * @query {string} [status] - Statut (Active/Inactive)
 * @query {string} [sortBy=createdAt] - Champ de tri
 * @query {string} [sortOrder=desc] - Ordre de tri (asc/desc)
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, classAssignmentController_1.getClassAssignments);
/**
 * @route GET /api/academic/class-assignments/:id
 * @description Récupère une assignation par ID avec ses relations
 * @access Staff/Admin
 * @param {string} id - ID de l'assignation
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, classAssignmentController_1.getClassAssignmentById);
/**
 * @route POST /api/academic/class-assignments
 * @description Crée une nouvelle assignation
 * @access Admin
 * @body {string} subjectId - ID de la matière
 * @body {string} professeurId - ID du professeur
 * @body {string} classLevel - Niveau de classe (CP1, CP2, etc.)
 * @body {string} academicYearId - ID de l'année académique
 * @body {string} [status=Active] - Statut de l'assignation
 * @body {string} [notes] - Notes supplémentaires
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, classAssignmentValidators_1.validateCreateClassAssignment, middleware_1.handleValidationErrors, classAssignmentController_1.createClassAssignment);
/**
 * @route PUT /api/academic/class-assignments/:id
 * @description Met à jour une assignation
 * @access Admin
 * @param {string} id - ID de l'assignation
 * @body {string} [subjectId] - ID de la matière
 * @body {string} [professeurId] - ID du professeur
 * @body {string} [classLevel] - Niveau de classe
 * @body {string} [academicYearId] - ID de l'année académique
 * @body {string} [status] - Statut de l'assignation
 * @body {string} [notes] - Notes supplémentaires
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, classAssignmentValidators_1.validateUpdateClassAssignment, middleware_1.handleValidationErrors, classAssignmentController_1.updateClassAssignment);
/**
 * @route DELETE /api/academic/class-assignments/:id
 * @description Supprime une assignation (si aucun emploi du temps associé)
 * @access Admin
 * @param {string} id - ID de l'assignation
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, classAssignmentController_1.deleteClassAssignment);
/**
 * @route GET /api/academic/class-assignments/class/:classId
 * @description Récupère les assignations d'une classe spécifique
 * @access Staff/Admin
 * @param {string} classId - ID de la classe
 * @query {string} academicYearId - ID de l'année académique
 */
router.get("/class/:classId", middleware_1.requireAuth, middleware_1.sanitizeInput, classAssignmentController_1.getClassAssignmentsByClass);
/**
 * @route GET /api/academic/class-assignments/class/:classId/level/:classLevel
 * @description Récupère les assignations d'une classe et niveau spécifiques
 * @access Staff/Admin
 * @param {string} classId - ID de la classe
 * @param {string} classLevel - Niveau de classe
 * @query {string} academicYearId - ID de l'année académique
 */
router.get("/class/:classId/level/:classLevel", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, classAssignmentController_1.getClassAssignmentsByClassAndLevel);
/**
 * @route GET /api/academic/class-assignments/professor/:professeurId
 * @description Récupère les assignations d'un professeur
 * @access Staff/Admin/Professeur
 * @param {string} professeurId - ID du professeur
 * @query {string} academicYearId - ID de l'année académique
 */
router.get("/professor/:professeurId", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, middleware_1.sanitizeInput, classAssignmentController_1.getClassAssignmentsByProfessor);
/**
 * @route GET /api/academic/class-assignments/available/:classLevel
 * @description Récupère les assignations disponibles pour un niveau
 * @access Staff/Admin
 * @param {string} classLevel - Niveau de classe
 * @query {string} academicYearId - ID de l'année académique
 */
router.get("/available/:classLevel", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, classAssignmentController_1.getAvailableAssignments);
exports.default = router;
//# sourceMappingURL=classAssignmentRoutes.js.map