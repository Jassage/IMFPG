"use strict";
/**
 * @file studentFeeRoutes.ts
 * @description Routes pour la gestion des frais étudiants
 * @module Routes/StudentFees
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const studentFeeController_1 = require("../controllers/studentFeeController");
const studentFeeValidators_1 = require("../utils/studentFeeValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/student-fees
 * @description Récupère tous les frais étudiants avec filtres optionnels
 * @query {string} [studentId] - ID de l'étudiant
 * @query {string} [academicYear] - Année académique
 * @access Staff/Admin
 * @returns {Object[]} Liste des frais étudiants
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireStaff, studentFeeController_1.getAllStudentFees);
/**
 * @route GET /api/student-fees/student/:studentId
 * @description Récupère tous les frais d'un étudiant spécifique
 * @param {string} studentId - ID de l'étudiant
 * @access Staff/Admin
 * @returns {Object[]} Frais de l'étudiant
 */
router.get("/student/:studentId", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, studentFeeController_1.getStudentFeesByStudent);
/**
 * @route GET /api/student-fees/student/:studentId/year/:academicYear
 * @description Récupère les frais d'un étudiant pour une année académique spécifique
 * @param {string} studentId - ID de l'étudiant
 * @param {string} academicYear - ID de l'année académique
 * @access Staff/Admin
 * @returns {Object} Frais de l'étudiant pour l'année
 */
router.get("/student/:studentId/year/:academicYear", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, studentFeeController_1.getStudentFeeByStudentAndYear);
/**
 * @route GET /api/student-fees/:id
 * @description Récupère des frais étudiants spécifiques par ID
 * @param {string} id - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object} Détails des frais
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, studentFeeController_1.getStudentFeeById);
/**
 * @route POST /api/student-fees/assign
 * @description Attribue une structure de frais à un étudiant
 * @body {Object} feeAssignment - Données d'attribution
 * @body {string} feeAssignment.studentId - ID de l'étudiant
 * @body {string} feeAssignment.feeStructureId - ID de la structure de frais
 * @body {string} feeAssignment.academicYearId - ID de l'année académique
 * @access Admin
 * @returns {Object} Frais attribués
 */
router.post("/assign", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, studentFeeValidators_1.validateAssignFeeToStudent, middleware_1.handleValidationErrors, studentFeeController_1.assignFeeToStudent);
/**
 * @route PUT /api/student-fees/:id
 * @description Met à jour les frais d'un étudiant
 * @param {string} id - ID des frais à mettre à jour
 * @body {Object} data - Données de mise à jour
 * @body {string} [data.dueDate] - Nouvelle date d'échéance
 * @body {string} [data.status] - Nouveau statut
 * @access Admin
 * @returns {Object} Frais mis à jour
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, studentFeeValidators_1.validateUpdateStudentFee, middleware_1.handleValidationErrors, studentFeeController_1.updateStudentFee);
/**
 * @route DELETE /api/student-fees/:id
 * @description Supprime les frais d'un étudiant (si aucun paiement associé)
 * @param {string} id - ID des frais à supprimer
 * @access Admin
 * @returns {Object} Message de confirmation
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, studentFeeController_1.deleteStudentFee);
exports.default = router;
//# sourceMappingURL=studentFeeRoutes.js.map