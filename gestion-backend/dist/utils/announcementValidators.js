"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnnouncementQuery = exports.validateUpdateAnnouncement = exports.validateCreateAnnouncement = void 0;
const express_validator_1 = require("express-validator");
const isPrismaId = (value) => {
    const cuidRegex = /^c[a-z0-9]{24,}$/i;
    return cuidRegex.test(value);
};
exports.validateCreateAnnouncement = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Le titre est requis")
        .isLength({ min: 3, max: 200 })
        .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("content")
        .trim()
        .notEmpty()
        .withMessage("Le contenu est requis")
        .isLength({ min: 10, max: 5000 })
        .withMessage("Le contenu doit contenir entre 10 et 5000 caractères"),
    (0, express_validator_1.body)("publishDate")
        .notEmpty()
        .withMessage("La date de publication est requise")
        .isISO8601()
        .withMessage("La date de publication doit être une date valide"),
    (0, express_validator_1.body)("expiryDate")
        .optional()
        .isISO8601()
        .withMessage("La date d'expiration doit être une date valide")
        .custom((value, { req }) => {
        if (value && new Date(value) <= new Date(req.body.publishDate)) {
            throw new Error("La date d'expiration doit être postérieure à la date de publication");
        }
        return true;
    }),
    (0, express_validator_1.body)("targetAudience")
        .optional()
        .trim()
        .isIn(["All", "Students", "Teachers", "Parents", "Staff"])
        .withMessage("Public cible invalide"),
    (0, express_validator_1.body)("priority")
        .optional()
        .trim()
        .isIn(["Low", "Medium", "High", "Urgent"])
        .withMessage("Priorité invalide"),
    (0, express_validator_1.body)("attachments")
        .optional()
        .isArray()
        .withMessage("Les pièces jointes doivent être un tableau"),
];
exports.validateUpdateAnnouncement = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de l'annonce est requis")
        .custom((value) => {
        if (!isPrismaId(value)) {
            throw new Error("ID d'annonce invalide (format CUID attendu)");
        }
        return true;
    }),
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
    (0, express_validator_1.body)("content")
        .optional()
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage("Le contenu doit contenir entre 10 et 5000 caractères"),
    (0, express_validator_1.body)("publishDate")
        .optional()
        .isISO8601()
        .withMessage("La date de publication doit être une date valide"),
    (0, express_validator_1.body)("expiryDate")
        .optional()
        .isISO8601()
        .withMessage("La date d'expiration doit être une date valide"),
    (0, express_validator_1.body)("targetAudience")
        .optional()
        .trim()
        .isIn(["All", "Students", "Teachers", "Parents", "Staff"])
        .withMessage("Public cible invalide"),
    (0, express_validator_1.body)("priority")
        .optional()
        .trim()
        .isIn(["Low", "Medium", "High", "Urgent"])
        .withMessage("Priorité invalide"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("Le statut actif doit être un booléen"),
];
exports.validateAnnouncementQuery = [
    (0, express_validator_1.query)("targetAudience")
        .optional()
        .trim()
        .isIn(["All", "Students", "Teachers", "Parents", "Staff", "all"])
        .withMessage("Public cible invalide"),
    (0, express_validator_1.query)("priority")
        .optional()
        .trim()
        .isIn(["Low", "Medium", "High", "Urgent", "all"])
        .withMessage("Priorité invalide"),
    (0, express_validator_1.query)("isActive")
        .optional()
        .isIn(["true", "false", "all"])
        .withMessage("Le statut actif doit être 'true', 'false' ou 'all'"),
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
        .isIn(["title", "publishDate", "createdAt", "priority"])
        .withMessage("Champ de tri invalide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
//# sourceMappingURL=announcementValidators.js.map