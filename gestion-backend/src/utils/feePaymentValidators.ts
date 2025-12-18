/**
 * @file feePaymentValidators.ts
 * @description Validateurs pour les paiements de frais
 * @module Validators/FeePayments
 */

import { body, param } from "express-validator";

/**
 * Validateur pour la création d'un paiement
 */
export const validateCreateFeePayment = [
  body("studentFeeId")
    .trim()
    .notEmpty()
    .withMessage("L'ID des frais étudiants est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID frais étudiants invalide"),

  body("amount")
    .notEmpty()
    .withMessage("Le montant est requis")
    .isFloat({ min: 0.01 })
    .withMessage("Le montant doit être supérieur à 0")
    .toFloat(),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("La méthode de paiement est requise")
    .isIn(["cash", "transfer", "card", "check"])
    .withMessage("Méthode de paiement non valide"),

  body("reference")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La référence ne peut pas dépasser 100 caractères"),

  body("paymentDate")
    .optional()
    .isISO8601()
    .withMessage("La date de paiement doit être au format ISO8601"),
];

/**
 * Validateur pour la mise à jour d'un paiement
 */
export const validateUpdateFeePayment = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du paiement est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID paiement invalide"),

  body("studentFeeId")
    .optional()
    .trim()
    .isLength({ min: 20, max: 30 })
    .withMessage("ID frais étudiants invalide"),

  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Le montant doit être supérieur à 0")
    .toFloat(),

  body("paymentMethod")
    .optional()
    .trim()
    .isIn(["cash", "transfer", "card", "check"])
    .withMessage("Méthode de paiement non valide"),

  body("reference")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La référence ne peut pas dépasser 100 caractères"),

  body("paymentDate")
    .optional()
    .isISO8601()
    .withMessage("La date de paiement doit être au format ISO8601"),
];
