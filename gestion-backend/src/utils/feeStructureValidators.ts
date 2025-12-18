/**
 * @file feeStructureValidators.ts
 * @description Validateurs pour les structures de frais
 * @module Validators/FeeStructures
 */

import { body, param } from "express-validator";
import { isValidYearFormat } from "../utils/validationHelpers";

/**
 * Validateur pour la création d'une structure de frais
 */
export const validateCreateFeeStructure = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),

  body("academicYear")
    .trim()
    .notEmpty()
    .withMessage("L'année académique est requise")
    .custom(isValidYearFormat)
    .withMessage("Format d'année académique invalide (ex: 2024-2025)"),

  body("amount")
    .notEmpty()
    .withMessage("Le montant est requis")
    .isFloat({ min: 0 })
    .withMessage("Le montant doit être un nombre positif")
    .toFloat(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut pas dépasser 500 caractères"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Le statut actif doit être un booléen")
    .toBoolean(),
];

/**
 * Validateur pour la mise à jour d'une structure de frais
 */
export const validateUpdateFeeStructure = [
  param("id")
    .notEmpty()
    .withMessage("L'ID est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID invalide"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),

  body("academicYear")
    .optional()
    .trim()
    .custom(isValidYearFormat)
    .withMessage("Format d'année académique invalide (ex: 2024-2025)"),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Le montant doit être un nombre positif")
    .toFloat(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut pas dépasser 500 caractères"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Le statut actif doit être un booléen")
    .toBoolean(),
];
