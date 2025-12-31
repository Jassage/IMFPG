"use strict";
/**
 * @file studentRoutes.ts
 * @description Routes pour la gestion des étudiants
 * @version 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const studentController_1 = require("../controllers/studentController");
const studentValidators_1 = require("../utils/studentValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/students/check-email
 * @description Vérifie la disponibilité d'un email
 * @access Public (pour les formulaires d'inscription)
 */
router.get("/check-email", studentController_1.checkEmailAvailability);
/**
 * @route GET /api/students/check-cin
 * @description Vérifie la disponibilité d'un CIN
 * @access Public (pour les formulaires d'inscription)
 */
router.get("/check-cin", studentController_1.checkCINAvailability);
// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================
/**
 * @route GET /api/students
 * @description Récupère la liste des étudiants avec pagination et filtres
 * @access Staff/Admin/Teacher
 */
router.get("/", middleware_1.requireAuth, middleware_1.sanitizeInput, studentController_1.getStudents);
/**
 * @route GET /api/students/search
 * @description Recherche des étudiants par terme
 * @access Staff/Admin/Teacher
 */
router.get("/search", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, studentController_1.searchStudents);
/**
 * @route GET /api/students/statistics
 * @description Récupère les statistiques des étudiants
 * @access Admin
 */
router.get("/statistics", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, studentController_1.getStudentStatistics);
/**
 * @route GET /api/students/export
 * @description Exporte la liste des étudiants en CSV/Excel
 * @access Admin
 */
router.get("/export", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, studentController_1.exportStudents);
/**
 * @route GET /api/students/:id
 * @description Récupère un étudiant par ID
 * @access Staff/Admin/Teacher
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.sanitizeInput, studentController_1.getStudentById);
/**
 * @route POST /api/students
 * @description Crée un nouvel étudiant
 * @access Admin
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireStaff, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, studentValidators_1.validateCreateStudent, middleware_1.handleValidationErrors, studentController_1.createStudent);
/**
 * @route POST /api/students/import
 * @description Importe des étudiants depuis un fichier CSV/Excel
 * @access Admin
 */
router.post("/import", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, middleware_1.handleValidationErrors, studentController_1.importStudents);
/**
 * @route PUT /api/students/:id
 * @description Met à jour un étudiant
 * @access Admin
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, studentValidators_1.validateUpdateStudent, middleware_1.handleValidationErrors, studentController_1.updateStudent);
/**
 * @route PUT /api/students/:id/status
 * @description Change le statut d'un étudiant
 * @access Admin
 */
router.put("/:id/status", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, middleware_1.handleValidationErrors, studentController_1.updateStudentStatus);
/**
 * @route PUT /api/students/:id/assign-class
 * @description Affecte un étudiant à une classe
 * @access Admin
 */
router.put("/:id/assign-class", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, studentValidators_1.validateAssignClass, middleware_1.handleValidationErrors, studentController_1.assignStudentToClass);
/**
 * @route DELETE /api/students/:id
 * @description Supprime un étudiant
 * @access Admin
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, studentController_1.deleteStudent);
/**
 * @route GET /api/classes/:classId/students
 * @description Récupère les étudiants d'une classe spécifique
 * @access Staff/Admin/Teacher
 */
router.get("/classes/:classId/students", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, studentController_1.getStudentsByClass);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map