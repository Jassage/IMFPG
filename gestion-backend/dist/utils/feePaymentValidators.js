"use strict";
/**
 * @file feePaymentValidators.ts
 * @description Validateurs pour les paiements de frais
 * @module Validators/FeePayments
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateFeePayment = exports.validateCreateFeePayment = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validateur pour la création d'un paiement
 */
exports.validateCreateFeePayment = [
    (0, express_validator_1.body)("studentFeeId")
        .trim()
        .notEmpty()
        .withMessage("L'ID des frais étudiants est requis")
        .isLength({ min: 20, max: 30 })
        .withMessage("ID frais étudiants invalide"),
    (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Le montant est requis")
        .isFloat({ min: 0.01 })
        .withMessage("Le montant doit être supérieur à 0")
        .toFloat(),
    (0, express_validator_1.body)("paymentMethod")
        .trim()
        .notEmpty()
        .withMessage("La méthode de paiement est requise")
        .isIn(["cash", "transfer", "card", "check"])
        .withMessage("Méthode de paiement non valide"),
    (0, express_validator_1.body)("reference")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("La référence ne peut pas dépasser 100 caractères"),
    (0, express_validator_1.body)("paymentDate")
        .optional()
        .isISO8601()
        .withMessage("La date de paiement doit être au format ISO8601"),
];
/**
 * Validateur pour la mise à jour d'un paiement
 */
exports.validateUpdateFeePayment = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID du paiement est requis")
        .isLength({ min: 20, max: 30 })
        .withMessage("ID paiement invalide"),
    (0, express_validator_1.body)("studentFeeId")
        .optional()
        .trim()
        .isLength({ min: 20, max: 30 })
        .withMessage("ID frais étudiants invalide"),
    (0, express_validator_1.body)("amount")
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage("Le montant doit être supérieur à 0")
        .toFloat(),
    (0, express_validator_1.body)("paymentMethod")
        .optional()
        .trim()
        .isIn(["cash", "transfer", "card", "check"])
        .withMessage("Méthode de paiement non valide"),
    (0, express_validator_1.body)("reference")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("La référence ne peut pas dépasser 100 caractères"),
    (0, express_validator_1.body)("paymentDate")
        .optional()
        .isISO8601()
        .withMessage("La date de paiement doit être au format ISO8601"),
];
//# sourceMappingURL=feePaymentValidators.js.map