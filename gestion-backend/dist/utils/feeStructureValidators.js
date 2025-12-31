"use strict";
/**
 * @file feeStructureValidators.ts
 * @description Validateurs pour les structures de frais
 * @module Validators/FeeStructures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateFeeStructure = exports.validateCreateFeeStructure = void 0;
const express_validator_1 = require("express-validator");
const validationHelpers_1 = require("../utils/validationHelpers");
/**
 * Validateur pour la création d'une structure de frais
 */
exports.validateCreateFeeStructure = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Le nom est requis")
        .isLength({ min: 2, max: 100 })
        .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
    (0, express_validator_1.body)("academicYear")
        .trim()
        .notEmpty()
        .withMessage("L'année académique est requise")
        .custom(validationHelpers_1.isValidYearFormat)
        .withMessage("Format d'année académique invalide (ex: 2024-2025)"),
    (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Le montant est requis")
        .isFloat({ min: 0 })
        .withMessage("Le montant doit être un nombre positif")
        .toFloat(),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La description ne peut pas dépasser 500 caractères"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Le statut actif doit être un booléen")
        .toBoolean(),
];
/**
 * Validateur pour la mise à jour d'une structure de frais
 */
exports.validateUpdateFeeStructure = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID est requis")
        .isLength({ min: 20, max: 30 })
        .withMessage("ID invalide"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
    (0, express_validator_1.body)("academicYear")
        .optional()
        .trim()
        .custom(validationHelpers_1.isValidYearFormat)
        .withMessage("Format d'année académique invalide (ex: 2024-2025)"),
    (0, express_validator_1.body)("amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Le montant doit être un nombre positif")
        .toFloat(),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La description ne peut pas dépasser 500 caractères"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Le statut actif doit être un booléen")
        .toBoolean(),
];
//# sourceMappingURL=feeStructureValidators.js.map