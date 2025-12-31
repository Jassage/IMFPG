"use strict";
/**
 * @file feePaymentController.ts
 * @description Contrôleur pour la gestion des paiements de frais scolaires
 * @module Controllers/FeePayments
 *
 * Ce contrôleur gère :
 * - L'enregistrement des paiements
 * - La consultation des historiques de paiement
 * - La mise à jour des paiements
 * - La suppression des paiements
 * - Le recalcul automatique des soldes étudiants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.deleteFeePayment = exports.updateFeePayment = exports.getFeePayments = exports.createFeePayment = exports.getFeePaymentById = exports.getAllFeePayments = void 0;
const feePaymentService_1 = require("../services/feePaymentService");
const auditController_1 = require("./auditController");
/**
 * @function getAllFeePayments
 * @description Récupère tous les paiements avec filtres optionnels
 * @route GET /api/fee-payments
 * @access Staff/Admin
 * @query {string} [studentFeeId] - ID des frais étudiants pour filtrer
 * @returns {Promise<void>}
 */
const getAllFeePayments = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentFeeId } = req.query;
        const result = await feePaymentService_1.FeePaymentService.getAllFeePayments({
            studentFeeId: studentFeeId,
        });
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_FEE_PAYMENTS",
            entity: "FeePayment",
            description: "Consultation de tous les paiements de frais",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération paiements:", error);
        const errorMessage = error.message || "Erreur inconnue";
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_FEE_PAYMENTS_ERROR",
            entity: "FeePayment",
            description: "Erreur lors de la récupération de tous les paiements",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getAllFeePayments = getAllFeePayments;
/**
 * @function getFeePaymentById
 * @description Récupère un paiement spécifique par son ID
 * @route GET /api/fee-payments/:id
 * @access Staff/Admin
 * @param {string} id - ID du paiement
 * @returns {Promise<void>}
 */
const getFeePaymentById = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const result = await feePaymentService_1.FeePaymentService.getFeePaymentById(id);
        // Log de consultation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FEE_PAYMENT_SUCCESS",
            entity: "FeePayment",
            entityId: id,
            description: "Consultation des détails du paiement",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération paiement:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FEE_PAYMENT_ERROR",
            entity: "FeePayment",
            entityId: req.params.id,
            description: "Erreur lors de la récupération du paiement",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
        });
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getFeePaymentById = getFeePaymentById;
/**
 * @function createFeePayment
 * @description Crée un nouveau paiement et met à jour automatiquement le solde de l'étudiant
 * @route POST /api/fee-payments
 * @access Admin
 * @body {Object} paymentData - Données du paiement
 * @body {string} paymentData.studentFeeId - ID des frais étudiants
 * @body {number} paymentData.amount - Montant du paiement
 * @body {string} paymentData.paymentMethod - Méthode de paiement
 * @body {string} [paymentData.reference] - Référence du paiement
 * @body {string} [paymentData.paymentDate] - Date du paiement
 * @returns {Promise<void>}
 */
const createFeePayment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentFeeId, amount, paymentMethod, reference, paymentDate } = req.body;
        console.log("📥 Création paiement - Données:", req.body);
        // Log de tentative de création
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_FEE_PAYMENT_ATTEMPT",
            entity: "FeePayment",
            description: "Tentative de création d'un nouveau paiement",
            status: "SUCCESS",
            metadata: {
                studentFeeId,
                amount,
                paymentMethod,
                reference,
            },
        });
        const result = await feePaymentService_1.FeePaymentService.createFeePayment({
            studentFeeId,
            amount,
            paymentMethod,
            reference,
            paymentDate,
            userId: req.userId,
        });
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_FEE_PAYMENT_SUCCESS",
            entity: "FeePayment",
            entityId: result.data.payment.id,
            description: "Paiement créé avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.status(201).json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur création paiement:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_FEE_PAYMENT_ERROR",
            entity: "FeePayment",
            description: "Erreur lors de la création du paiement",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: error.metadata || {},
        });
        if (error.status === 400 || error.status === 404) {
            return res.status(error.status).json({
                error: error.message,
                details: error.details,
            });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.createFeePayment = createFeePayment;
/**
 * @function getFeePayments
 * @description Récupère les paiements avec filtres
 * @route GET /api/fee-payments/filtered
 * @access Staff/Admin
 * @query {string} [studentFeeId] - ID des frais étudiants pour filtrer
 * @returns {Promise<void>}
 */
const getFeePayments = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentFeeId } = req.query;
        const result = await feePaymentService_1.FeePaymentService.getFeePayments({
            studentFeeId: studentFeeId,
        });
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FEE_PAYMENTS",
            entity: "FeePayment",
            description: "Consultation des paiements de frais",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération paiements:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_FEE_PAYMENTS_ERROR",
            entity: "FeePayment",
            description: "Erreur lors de la récupération des paiements",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
        });
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getFeePayments = getFeePayments;
/**
 * @function updateFeePayment
 * @description Met à jour un paiement existant et recalcule automatiquement le solde
 * @route PUT /api/fee-payments/:id
 * @access Admin
 * @param {string} id - ID du paiement à mettre à jour
 * @body {Object} data - Données de mise à jour
 * @body {number} [data.amount] - Nouveau montant
 * @body {string} [data.paymentMethod] - Nouvelle méthode de paiement
 * @body {string} [data.reference] - Nouvelle référence
 * @body {string} [data.paymentDate] - Nouvelle date de paiement
 * @returns {Promise<void>}
 */
const updateFeePayment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        const data = req.body;
        console.log("📥 Mise à jour paiement - ID:", id, "Données:", data);
        const result = await feePaymentService_1.FeePaymentService.updateFeePayment(id, data);
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_FEE_PAYMENT_SUCCESS",
            entity: "FeePayment",
            entityId: id,
            description: "Paiement mis à jour avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur mise à jour paiement:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_FEE_PAYMENT_ERROR",
            entity: "FeePayment",
            entityId: req.params.id,
            description: "Erreur lors de la mise à jour du paiement",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
        });
        if (error.status === 400 || error.status === 404) {
            return res.status(error.status).json({
                error: error.message,
                details: error.details,
            });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.updateFeePayment = updateFeePayment;
/**
 * @function deleteFeePayment
 * @description Supprime un paiement et met à jour le solde de l'étudiant
 * @route DELETE /api/fee-payments/:id
 * @access Admin
 * @param {string} id - ID du paiement à supprimer
 * @returns {Promise<void>}
 */
const deleteFeePayment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        console.log("🗑️ Suppression paiement - ID:", id);
        // Log de tentative de suppression
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_FEE_PAYMENT_ATTEMPT",
            entity: "FeePayment",
            entityId: id,
            description: "Tentative de suppression de paiement",
            status: "SUCCESS",
        });
        const result = await feePaymentService_1.FeePaymentService.deleteFeePayment(id);
        // Log de suppression réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_FEE_PAYMENT_SUCCESS",
            entity: "FeePayment",
            entityId: id,
            description: "Paiement supprimé avec succès",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json({ message: result.message });
    }
    catch (error) {
        console.error("❌ Erreur suppression paiement:", error);
        // Log d'erreur de suppression
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_FEE_PAYMENT_ERROR",
            entity: "FeePayment",
            entityId: req.params.id,
            description: "Erreur lors de la suppression du paiement",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
        });
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.deleteFeePayment = deleteFeePayment;
/**
 * @function getPaymentHistory
 * @description Récupère l'historique complet des paiements pour des frais étudiants spécifiques
 * @route GET /api/fee-payments/history/:studentFeeId
 * @access Staff/Admin
 * @param {string} studentFeeId - ID des frais étudiants
 * @returns {Promise<void>}
 */
const getPaymentHistory = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { studentFeeId } = req.params;
        const result = await feePaymentService_1.FeePaymentService.getPaymentHistory(studentFeeId);
        // Log de consultation d'historique
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_PAYMENT_HISTORY",
            entity: "FeePayment",
            description: "Consultation de l'historique des paiements",
            status: "SUCCESS",
            metadata: result.metadata,
        });
        res.json(result.data);
    }
    catch (error) {
        console.error("❌ Erreur récupération historique paiements:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_PAYMENT_HISTORY_ERROR",
            entity: "FeePayment",
            description: "Erreur lors de la récupération de l'historique des paiements",
            status: "ERROR",
            errorMessage: error.message || "Erreur inconnue",
            metadata: {
                studentFeeId: req.params.studentFeeId,
            },
        });
        res.status(error.status || 500).json({
            error: error.message || "Erreur serveur",
            details: process.env.NODE_ENV === "development" && error.details
                ? error.details
                : undefined,
        });
    }
};
exports.getPaymentHistory = getPaymentHistory;
//# sourceMappingURL=feePaymentController.js.map