"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventQuery = exports.validateUpdateEvent = exports.validateCreateEvent = void 0;
const express_validator_1 = require("express-validator");
const isPrismaId = (value) => {
    const cuidRegex = /^c[a-z0-9]{24,}$/i;
    return cuidRegex.test(value);
};
exports.validateCreateEvent = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Le titre est requis")
        .isLength({ min: 3, max: 200 })
        .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("La description est requise")
        .isLength({ min: 10, max: 2000 })
        .withMessage("La description doit contenir entre 10 et 2000 caractères"),
    (0, express_validator_1.body)("startDate")
        .notEmpty()
        .withMessage("La date de début est requise")
        .isISO8601()
        .withMessage("La date de début doit être une date valide"),
    (0, express_validator_1.body)("endDate")
        .notEmpty()
        .withMessage("La date de fin est requise")
        .isISO8601()
        .withMessage("La date de fin doit être une date valide")
        .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error("La date de fin doit être postérieure à la date de début");
        }
        return true;
    }),
    (0, express_validator_1.body)("location")
        .trim()
        .notEmpty()
        .withMessage("Le lieu est requis")
        .isLength({ min: 3, max: 200 })
        .withMessage("Le lieu doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("category")
        .optional()
        .trim()
        .isIn(["General", "Academic", "Cultural", "Sports", "Meeting", "Other"])
        .withMessage("Catégorie invalide"),
    (0, express_validator_1.body)("isPublic")
        .optional()
        .isBoolean()
        .withMessage("La visibilité doit être un booléen"),
];
exports.validateUpdateEvent = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de l'événement est requis")
        .custom((value) => {
        if (!isPrismaId(value)) {
            throw new Error("ID d'événement invalide (format CUID attendu)");
        }
        return true;
    }),
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("La description doit contenir entre 10 et 2000 caractères"),
    (0, express_validator_1.body)("startDate")
        .optional()
        .isISO8601()
        .withMessage("La date de début doit être une date valide"),
    (0, express_validator_1.body)("endDate")
        .optional()
        .isISO8601()
        .withMessage("La date de fin doit être une date valide"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Le lieu doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("category")
        .optional()
        .trim()
        .isIn(["General", "Academic", "Cultural", "Sports", "Meeting", "Other"])
        .withMessage("Catégorie invalide"),
    (0, express_validator_1.body)("isPublic")
        .optional()
        .isBoolean()
        .withMessage("La visibilité doit être un booléen"),
];
exports.validateEventQuery = [
    (0, express_validator_1.query)("status")
        .optional()
        .trim()
        .isIn(["Scheduled", "Cancelled", "Completed", "Postponed", "all"])
        .withMessage("Statut invalide"),
    (0, express_validator_1.query)("category").optional().trim(),
    (0, express_validator_1.query)("isPublic")
        .optional()
        .isIn(["true", "false", "all"])
        .withMessage("La visibilité doit être 'true', 'false' ou 'all'"),
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("La date de début doit être une date valide"),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("La date de fin doit être une date valide"),
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.query)("sortBy")
        .optional()
        .isIn(["title", "startDate", "endDate", "createdAt", "category"])
        .withMessage("Champ de tri invalide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
//# sourceMappingURL=eventValidators.js.map