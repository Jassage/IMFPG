"use strict";
/**
 * @file gradeValidators.ts
 * @description Validateurs pour les routes des notes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatisticsFilters = exports.validateGradeParams = exports.validateBulkImportGrades = exports.validateUpdateGrade = exports.validateCreateGrade = exports.validateGradeFilters = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validateur pour les filtres de recherche des notes
 */
exports.validateGradeFilters = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif")
        .toInt(),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100")
        .toInt(),
    (0, express_validator_1.query)("search")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("La recherche doit contenir entre 2 et 100 caractères"),
    (0, express_validator_1.query)("studentId")
        .optional()
        .isString()
        .withMessage("L'ID étudiant doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("subjectId")
        .optional()
        .isString()
        .withMessage("L'ID matière doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("assignmentId")
        .optional()
        .isString()
        .withMessage("L'ID affectation doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("academicYearId")
        .optional()
        .isString()
        .withMessage("L'ID année académique doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("classLevel")
        .optional()
        .isString()
        .withMessage("Le niveau de classe doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("controlType")
        .optional()
        .isIn(["CONTROLE_1", "CONTROLE_2", "CONTROLE_3", "CONTROLE_4"])
        .withMessage("Le type de contrôle doit être CONTROLE_1, CONTROLE_2, CONTROLE_3 ou CONTROLE_4"),
    (0, express_validator_1.query)("session")
        .optional()
        .isIn(["Normale", "Reprise"])
        .withMessage("La session doit être 'Normale' ou 'Reprise'"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["Valid_", "Non_valid_", "Reprendre"])
        .withMessage("Le statut doit être 'Valid_', 'Non_valid_' ou 'Reprendre'"),
    (0, express_validator_1.query)("minGrade")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("La note minimale doit être entre 0 et 100")
        .toFloat(),
    (0, express_validator_1.query)("maxGrade")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("La note maximale doit être entre 0 et 100")
        .toFloat(),
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("La date de début doit être au format ISO8601")
        .toDate(),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("La date de fin doit être au format ISO8601")
        .toDate(),
    (0, express_validator_1.query)("sortBy")
        .optional()
        .isIn([
        "createdAt",
        "grade",
        "updatedAt",
        "student.lastName",
        "subject.name",
    ])
        .withMessage("Le champ de tri n'est pas valide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
/**
 * Validateur pour la création d'une note
 */
exports.validateCreateGrade = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("L'ID étudiant est requis")
        .isString()
        .withMessage("L'ID étudiant doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("subjectId")
        .notEmpty()
        .withMessage("L'ID matière est requis")
        .isString()
        .withMessage("L'ID matière doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("assignmentId")
        .notEmpty()
        .withMessage("L'ID affectation est requis")
        .isString()
        .withMessage("L'ID affectation doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grade")
        .notEmpty()
        .withMessage("La note est requise")
        .isFloat({ min: 0, max: 100 })
        .withMessage("La note doit être comprise entre 0 et 100")
        .toFloat(),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID année académique est requis")
        .isString()
        .withMessage("L'ID année académique doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Valid_", "Non_valid_", "Reprendre"])
        .withMessage("Le statut doit être 'Valid_', 'Non_valid_' ou 'Reprendre'"),
    (0, express_validator_1.body)("session")
        .optional()
        .isIn(["Normale", "Reprise"])
        .withMessage("La session doit être 'Normale' ou 'Reprise'"),
    (0, express_validator_1.body)("controlType")
        .optional()
        .isIn(["CONTROLE_1", "CONTROLE_2", "CONTROLE_3", "CONTROLE_4"])
        .withMessage("Le type de contrôle doit être CONTROLE_1, CONTROLE_2, CONTROLE_3 ou CONTROLE_4"),
    (0, express_validator_1.body)("classLevel")
        .optional()
        .isString()
        .withMessage("Le niveau de classe doit être une chaîne de caractères")
        .trim()
        .isIn([
        "Sixieme",
        "Cinquieme",
        "Quatrieme",
        "Troisieme",
        "Seconde",
        "Premiere",
        "Terminale",
        "NSI",
        "NSII",
        "NSIII",
        "NSIV",
    ])
        .withMessage("Niveau de classe non valide"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Les notes ne doivent pas dépasser 1000 caractères"),
];
/**
 * Validateur pour la mise à jour d'une note
 */
exports.validateUpdateGrade = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la note est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grade")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("La note doit être comprise entre 0 et 100")
        .toFloat(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Valid_", "Non_valid_", "Reprendre"])
        .withMessage("Le statut doit être 'Valid_', 'Non_valid_' ou 'Reprendre'"),
    (0, express_validator_1.body)("session")
        .optional()
        .isIn(["Normale", "Reprise"])
        .withMessage("La session doit être 'Normale' ou 'Reprise'"),
    (0, express_validator_1.body)("controlType")
        .optional()
        .isIn(["CONTROLE_1", "CONTROLE_2", "CONTROLE_3", "CONTROLE_4"])
        .withMessage("Le type de contrôle doit être CONTROLE_1, CONTROLE_2, CONTROLE_3 ou CONTROLE_4"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Les notes ne doivent pas dépasser 1000 caractères"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Le statut d'activité doit être un booléen")
        .toBoolean(),
];
/**
 * Validateur pour l'importation en masse des notes
 */
exports.validateBulkImportGrades = [
    (0, express_validator_1.body)("grades")
        .notEmpty()
        .withMessage("Le tableau des notes est requis")
        .isArray()
        .withMessage("Les notes doivent être un tableau")
        .isLength({ min: 1, max: 1000 })
        .withMessage("Le tableau doit contenir entre 1 et 1000 notes"),
    (0, express_validator_1.body)("grades.*.studentId")
        .notEmpty()
        .withMessage("L'ID étudiant est requis pour chaque note")
        .isString()
        .withMessage("L'ID étudiant doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grades.*.subjectId")
        .notEmpty()
        .withMessage("L'ID matière est requis pour chaque note")
        .isString()
        .withMessage("L'ID matière doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grades.*.grade")
        .notEmpty()
        .withMessage("La note est requise pour chaque entrée")
        .isFloat({ min: 0, max: 100 })
        .withMessage("La note doit être comprise entre 0 et 100")
        .toFloat(),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID année académique est requis")
        .isString()
        .withMessage("L'ID année académique doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("assignmentId")
        .optional()
        .isString()
        .withMessage("L'ID affectation doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grades.*.status")
        .optional()
        .isIn(["Valid_", "Non_valid_", "Reprendre"])
        .withMessage("Le statut doit être 'Valid_', 'Non_valid_' ou 'Reprendre'"),
    (0, express_validator_1.body)("grades.*.session")
        .optional()
        .isIn(["Normale", "Reprise"])
        .withMessage("La session doit être 'Normale' ou 'Reprise'"),
    (0, express_validator_1.body)("grades.*.controlType")
        .optional()
        .isIn(["CONTROLE_1", "CONTROLE_2", "CONTROLE_3", "CONTROLE_4"])
        .withMessage("Le type de contrôle doit être CONTROLE_1, CONTROLE_2, CONTROLE_3 ou CONTROLE_4"),
    (0, express_validator_1.body)("grades.*.classLevel")
        .optional()
        .isString()
        .withMessage("Le niveau de classe doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.body)("grades.*.notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .trim()
        .isLength({ max: 500 })
        .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];
/**
 * Validateur pour les paramètres de route
 */
exports.validateGradeParams = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de la note est requis")
        .isString()
        .withMessage("L'ID doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.param)("studentId")
        .notEmpty()
        .withMessage("L'ID étudiant est requis")
        .isString()
        .withMessage("L'ID étudiant doit être une chaîne de caractères")
        .trim(),
];
/**
 * Validateur pour les statistiques
 */
exports.validateStatisticsFilters = [
    (0, express_validator_1.query)("academicYearId")
        .optional()
        .isString()
        .withMessage("L'ID année académique doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("classLevel")
        .optional()
        .isString()
        .withMessage("Le niveau de classe doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("controlType")
        .optional()
        .isIn(["CONTROLE_1", "CONTROLE_2", "CONTROLE_3", "CONTROLE_4"])
        .withMessage("Le type de contrôle doit être CONTROLE_1, CONTROLE_2, CONTROLE_3 ou CONTROLE_4"),
    (0, express_validator_1.query)("subjectId")
        .optional()
        .isString()
        .withMessage("L'ID matière doit être une chaîne de caractères")
        .trim(),
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("La date de début doit être au format ISO8601")
        .toDate(),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("La date de fin doit être au format ISO8601")
        .toDate(),
];
//# sourceMappingURL=gradeValidators.js.map