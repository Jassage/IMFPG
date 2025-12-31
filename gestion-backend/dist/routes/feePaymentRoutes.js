"use strict";
/**
 * @file feePaymentRoutes.ts
 * @description Routes pour la gestion des paiements de frais scolaires
 * @module Routes/FeePayments
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const feePaymentController_1 = require("../controllers/feePaymentController");
const feePaymentValidators_1 = require("../utils/feePaymentValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/fee-payments
 * @description Récupère tous les paiements avec filtres optionnels
 * @query {string} [studentFeeId] - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Liste des paiements
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireStaff, feePaymentController_1.getAllFeePayments);
/**
 * @route GET /api/fee-payments/filtered
 * @description Récupère les paiements filtrés
 * @query {string} [studentFeeId] - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Paiements filtrés
 */
router.get("/filtered", middleware_1.requireAuth, middleware_1.requireStaff, feePaymentController_1.getFeePayments);
/**
 * @route GET /api/fee-payments/history/:studentFeeId
 * @description Récupère l'historique des paiements pour des frais étudiants spécifiques
 * @param {string} studentFeeId - ID des frais étudiants
 * @access Staff/Admin
 * @returns {Object[]} Historique des paiements
 */
router.get("/:studentFeeId/history", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, feePaymentController_1.getPaymentHistory);
/**
 * @route GET /api/fee-payments/:id
 * @description Récupère un paiement spécifique par son ID
 * @param {string} id - ID du paiement
 * @access Staff/Admin
 * @returns {Object} Détails du paiement
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, feePaymentController_1.getFeePaymentById);
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
router.post("/", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, feePaymentValidators_1.validateCreateFeePayment, middleware_1.handleValidationErrors, feePaymentController_1.createFeePayment);
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
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, feePaymentValidators_1.validateUpdateFeePayment, middleware_1.handleValidationErrors, feePaymentController_1.updateFeePayment);
/**
 * @route DELETE /api/fee-payments/:id
 * @description Supprime un paiement
 * @param {string} id - ID du paiement
 * @access Admin
 * @returns {Object} Message de confirmation
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, feePaymentController_1.deleteFeePayment);
exports.default = router;
//# sourceMappingURL=feePaymentRoutes.js.map