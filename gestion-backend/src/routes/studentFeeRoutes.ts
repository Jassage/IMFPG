/**
 * @file studentFeeRoutes.ts
 * @description Routes pour la gestion des frais étudiants
 * @module Routes/StudentFees
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
  assignFeeToStudent,
  deleteStudentFee,
  getAllStudentFees,
  getFeeReportByClass,
  getStudentFeeById,
  getStudentFeeByStudentAndYear,
  getStudentFeesByStudent,
  updateStudentFee,
} from "../controllers/studentFeeController";
import {
  validateAssignFeeToStudent,
  validateUpdateStudentFee,
} from "../utils/studentFeeValidators";

const router = Router();

/**
 * @route GET /api/student-fees
 * @description Récupère tous les frais étudiants avec filtres optionnels
 * @query {string} [studentId] - ID de l'étudiant
 * @query {string} [academicYear] - Année académique
 * @access Staff/Admin
 * @returns {Object[]} Liste des frais étudiants
 */
router.get("/", requireAuth, requireStaff, getAllStudentFees);

/**
 * @route GET /api/student-fees/student/:studentId
 * @description Récupère tous les frais d'un étudiant spécifique
 * @param {string} studentId - ID de l'étudiant
 * @access Staff/Admin
 * @returns {Object[]} Frais de l'étudiant
 */
router.get(
  "/student/:studentId",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getStudentFeesByStudent
);

/**
 * @route GET /api/student-fees/student/:studentId/year/:academicYear
 * @description Récupère les frais d'un étudiant pour une année académique spécifique
 * @param {string} studentId - ID de l'étudiant
 * @param {string} academicYear - ID de l'année académique
 * @access Staff/Admin
 * @returns {Object} Frais de l'étudiant pour l'année
 */
router.get(
  "/student/:studentId/year/:academicYear",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getStudentFeeByStudentAndYear
);

/**
 * @route GET /api/student-fees/reports/by-class
 * @description État des paiements (rapport) pour une classe ou un niveau et
 * une année académique : liste des élèves avec montants attendu/versé/restant
 * @query {string} [classId] - ID de la classe
 * @query {string} [classLevel] - Niveau de classe (si classId non fourni)
 * @query {string} academicYearId - ID de l'année académique (requis)
 * @access Staff/Admin
 * @returns {Object} Liste des élèves et totaux agrégés
 */
router.get(
  "/reports/by-class",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getFeeReportByClass
);

/**
 * @route GET /api/student-fees/:id
 * @description Récupère des frais étudiants spécifiques par ID
 * @param {string} id - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object} Détails des frais
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getStudentFeeById);

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
router.post(
  "/assign",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateAssignFeeToStudent,
  handleValidationErrors,
  assignFeeToStudent
);

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
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateStudentFee,
  handleValidationErrors,
  updateStudentFee
);

/**
 * @route DELETE /api/student-fees/:id
 * @description Supprime les frais d'un étudiant (si aucun paiement associé)
 * @param {string} id - ID des frais à supprimer
 * @access Admin
 * @returns {Object} Message de confirmation
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deleteStudentFee
);

export default router;
