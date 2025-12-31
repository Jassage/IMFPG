"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateClassAssignment = exports.validateCreateClassAssignment = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../generated/prisma");
// import { ClassLevel } from "@prisma/client";
exports.validateCreateClassAssignment = [
    (0, express_validator_1.body)("subjectId")
        .notEmpty()
        .withMessage("L'ID de la matière est requis")
        .isString()
        .withMessage("L'ID de la matière doit être une chaîne de caractères"),
    (0, express_validator_1.body)("professeurId")
        .notEmpty()
        .withMessage("L'ID du professeur est requis")
        .isString()
        .withMessage("L'ID du professeur doit être une chaîne de caractères"),
    (0, express_validator_1.body)("classLevel")
        .notEmpty()
        .withMessage("Le niveau de classe est requis")
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID de l'année académique est requis")
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne de caractères"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Inactive"])
        .withMessage("Statut invalide. Valeurs acceptées: Active, Inactive"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .isLength({ max: 500 })
        .withMessage("Les notes ne peuvent pas dépasser 500 caractères"),
];
exports.validateUpdateClassAssignment = [
    (0, express_validator_1.body)("subjectId")
        .optional()
        .isString()
        .withMessage("L'ID de la matière doit être une chaîne de caractères"),
    (0, express_validator_1.body)("professeurId")
        .optional()
        .isString()
        .withMessage("L'ID du professeur doit être une chaîne de caractères"),
    (0, express_validator_1.body)("classLevel")
        .optional()
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.body)("academicYearId")
        .optional()
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne de caractères"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Inactive"])
        .withMessage("Statut invalide. Valeurs acceptées: Active, Inactive"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .isLength({ max: 500 })
        .withMessage("Les notes ne peuvent pas dépasser 500 caractères"),
];
//# sourceMappingURL=classAssignmentValidators.js.map