"use strict";
/**
 * @file subjectValidators.ts
 * @description Validateurs pour les matières
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubjectId = exports.validateUpdateSubject = exports.validateCreateSubject = void 0;
const express_validator_1 = require("express-validator");
// import { SubjectType } from "@prisma/client";
exports.validateCreateSubject = [
    (0, express_validator_1.body)("code")
        .trim()
        .notEmpty()
        .withMessage("Le code est requis")
        .isLength({ min: 2, max: 20 })
        .withMessage("Le code doit contenir entre 2 et 20 caractères")
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage("Le code ne peut contenir que des lettres majuscules, chiffres, tirets et underscores"),
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Le nom est requis")
        .isLength({ min: 3, max: 100 })
        .withMessage("Le nom doit contenir entre 3 et 100 caractères"),
    (0, express_validator_1.body)("coefficient")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Le coefficient doit être entre 1 et 10")
        .default(1),
    (0, express_validator_1.body)("passingGrade")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("La note de passage doit être entre 0 et 100"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La description ne peut dépasser 500 caractères"),
];
exports.validateUpdateSubject = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("ID requis")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID invalide"),
    (0, express_validator_1.body)("code")
        .optional()
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Le code doit contenir entre 2 et 20 caractères")
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage("Le code ne peut contenir que des lettres majuscules, chiffres, tirets et underscores"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Le nom doit contenir entre 3 et 100 caractères"),
    (0, express_validator_1.body)("credits")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Les crédits doivent être entre 1 et 10"),
    (0, express_validator_1.body)("coefficient") // ← AJOUTEZ CE CHAMP
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Le coefficient doit être entre 1 et 10"),
    (0, express_validator_1.body)("type")
        .optional()
        .trim()
        .isIn(["Obligatoire", "Optionnelle"])
        .withMessage("Type invalide. Valeurs autorisées: Obligatoire, Optionnelle"),
    (0, express_validator_1.body)("passingGrade")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("La note de passage doit être entre 0 et 100"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La description ne peut dépasser 500 caractères"),
];
exports.validateSubjectId = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("ID requis")
        .isLength({ min: 25, max: 30 })
        .withMessage("ID invalide")
        .matches(/^c[a-z0-9]{24,29}$/)
        .withMessage("Format d'ID invalide"),
];
//# sourceMappingURL=subjectValidators.js.map