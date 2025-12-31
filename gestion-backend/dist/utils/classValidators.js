"use strict";
/**
 * @file classValidators.ts
 * @description Validateurs pour les classes scolaires
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAvailableClasses = exports.validateClassStudents = exports.validateAssignTeacher = exports.validateClassStatusUpdate = exports.validateUpdateClass = exports.validateCreateClass = exports.validateClassSearch = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../generated/prisma");
/**
 * Validateur pour la recherche de classes
 */
exports.validateClassSearch = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.query)("level")
        .optional()
        .isIn(["all", ...Object.values(prisma_1.ClassLevel)])
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.query)("academicYear")
        .optional()
        .isString()
        .withMessage("L'année académique doit être une chaîne de caractères"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["all", "Active", "Inactive", "Archived"])
        .withMessage("Statut invalide"),
    (0, express_validator_1.query)("search")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("La recherche ne doit pas dépasser 100 caractères"),
    (0, express_validator_1.query)("sortBy")
        .optional()
        .isIn(["name", "level", "createdAt", "capacity"])
        .withMessage("Champ de tri invalide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
/**
 * Validateur pour la création d'une classe
 */
exports.validateCreateClass = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Le nom de la classe est requis")
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
    (0, express_validator_1.body)("level")
        .notEmpty()
        .withMessage("Le niveau de la classe est requis")
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.body)("capacity")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("La capacité doit être entre 1 et 50"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Inactive", "Archived"])
        .withMessage("Statut invalide"),
];
/**
 * Validateur pour la mise à jour d'une classe
 */
exports.validateUpdateClass = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères"),
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom doit contenir entre 2 et 50 caractères"),
    (0, express_validator_1.body)("level")
        .optional()
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.body)("capacity")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("La capacité doit être entre 1 et 50"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Inactive", "Archived"])
        .withMessage("Statut invalide"),
];
/**
 * Validateur pour la mise à jour du statut d'une classe
 */
exports.validateClassStatusUpdate = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères"),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Le statut est requis")
        .isIn(["Active", "Inactive", "Archived"])
        .withMessage("Statut invalide"),
];
/**
 * Validateur pour l'assignation d'un professeur principal
 */
exports.validateAssignTeacher = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères"),
    (0, express_validator_1.body)("teacherId")
        .notEmpty()
        .withMessage("L'ID du professeur est requis")
        .isString()
        .withMessage("L'ID du professeur doit être une chaîne de caractères"),
];
/**
 * Validateur pour la récupération d'étudiants d'une classe
 */
exports.validateClassStudents = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères"),
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["all", "Active", "Inactive", "Graduated", "Suspended"])
        .withMessage("Statut d'étudiant invalide"),
];
/**
 * Validateur pour la récupération des classes disponibles
 */
exports.validateAvailableClasses = [
    (0, express_validator_1.query)("academicYearId")
        .optional()
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne de caractères"),
    (0, express_validator_1.query)("level")
        .optional()
        .isIn(["all", ...Object.values(prisma_1.ClassLevel)])
        .withMessage("Niveau de classe invalide"),
];
//# sourceMappingURL=classValidators.js.map