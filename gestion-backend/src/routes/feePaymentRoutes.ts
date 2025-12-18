/**
 * @file feePaymentRoutes.ts
 * @description Routes pour la gestion des paiements de frais scolaires
 * @module Routes/FeePayments
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
  createFeePayment,
  deleteFeePayment,
  getAllFeePayments,
  getFeePaymentById,
  getFeePayments,
  getPaymentHistory,
  updateFeePayment,
} from "../controllers/feePaymentController";
import {
  validateCreateFeePayment,
  validateUpdateFeePayment,
} from "../utils/feePaymentValidators";

const router = Router();

/**
 * @route GET /api/fee-payments
 * @description Récupère tous les paiements avec filtres optionnels
 * @query {string} [studentFeeId] - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Liste des paiements
 */
router.get("/", requireAuth, requireStaff, getAllFeePayments);

/**
 * @route GET /api/fee-payments/filtered
 * @description Récupère les paiements filtrés
 * @query {string} [studentFeeId] - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Paiements filtrés
 */
router.get("/filtered", requireAuth, requireStaff, getFeePayments);

/**
 * @route GET /api/fee-payments/history/:studentFeeId
 * @description Récupère l'historique des paiements pour des frais étudiants spécifiques
 * @param {string} studentFeeId - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Historique des paiements
 */
router.get(
  "/:studentFeeId/history",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getPaymentHistory
);

/**
 * @route GET /api/fee-payments/:id
 * @description Récupère un paiement spécifique par son ID
 * @param {string} id - ID du paiement
 * @access Staff/Admin
 * @returns {Object} Détails du paiement
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getFeePaymentById);

/**
 * @route POST /api/fee-payments
 * @description Crée un nouveau paiement
 * @body {Object} paymentData - Données du paiement
 * @body {string} paymentData.studentFeeId - ID des frais étudiants
 * @body {number} paymentData.amount - Montant du paiement
 * @body {string} paymentData.paymentMethod - Méthode de paiement
 * @body {string} [paymentData.reference] - Référence du paiement
 * @body {string} [paymentData.paymentDate] - Date du paiement
 * @access Admin
 * @returns {Object} Paiement créé
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateFeePayment,
  handleValidationErrors,
  createFeePayment
);

/**
 * @route PUT /api/fee-payments/:id
 * @description Met à jour un paiement existant
 * @param {string} id - ID du paiement
 * @body {Object} data - Données de mise à jour
 * @body {number} [data.amount] - Nouveau montant
 * @body {string} [data.paymentMethod] - Nouvelle méthode
 * @body {string} [data.reference] - Nouvelle référence
 * @body {string} [data.paymentDate] - Nouvelle date
 * @access Admin
 * @returns {Object} Paiement mis à jour
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateFeePayment,
  handleValidationErrors,
  updateFeePayment
);

/**
 * @route DELETE /api/fee-payments/:id
 * @description Supprime un paiement
 * @param {string} id - ID du paiement
 * @access Admin
 * @returns {Object} Message de confirmation
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deleteFeePayment
);

export default router;
