"use strict";
/**
 * @file authValidators.ts
 * @description Validateurs pour les routes d'authentification
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileUpdate = exports.validateResetPassword = exports.validateForgotPassword = exports.validatePasswordChange = exports.validateRegister = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
const validators_1 = require("../../utils/validators");
/**
 * @middleware validateLogin
 * @description Valide les données de connexion
 */
exports.validateLogin = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("L'email est requis")
        .isEmail()
        .withMessage("Format d'email invalide")
        .custom((value) => {
        if (!(0, validators_1.validateEmail)(value)) {
            throw new Error("Format d'email invalide");
        }
        return true;
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Le mot de passe est requis")
        .isLength({ min: 1 })
        .withMessage("Le mot de passe ne peut pas être vide"),
    /**
     * @middleware handleValidationErrors
     * @description Gère les erreurs de validation
     */
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données de connexion invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
/**
 * @middleware validateRegister
 * @description Valide les données d'inscription
 */
exports.validateRegister = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("L'email est requis")
        .isEmail()
        .withMessage("Format d'email invalide")
        .custom((value) => {
        if (!(0, validators_1.validateEmail)(value)) {
            throw new Error("Format d'email invalide");
        }
        return true;
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Le mot de passe est requis")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères")
        .custom((value) => {
        if (!(0, validators_1.validatePasswordStrength)(value)) {
            throw new Error("Le mot de passe est trop faible");
        }
        return true;
    }),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .withMessage("Le rôle est requis")
        .custom((value) => {
        try {
            (0, validators_1.validateUserRole)(value);
            return true;
        }
        catch (error) {
            throw new Error("Rôle utilisateur invalide");
        }
    }),
    (0, express_validator_1.body)("firstName")
        .notEmpty()
        .withMessage("Le prénom est requis")
        .isLength({ min: 2, max: 50 })
        .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
        .trim()
        .escape(),
    (0, express_validator_1.body)("lastName")
        .notEmpty()
        .withMessage("Le nom est requis")
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom doit contenir entre 2 et 50 caractères")
        .trim()
        .escape(),
    (0, express_validator_1.body)("phone")
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage("Le numéro de téléphone doit contenir entre 10 et 15 caractères")
        .trim(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données d'inscription invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
/**
 * @middleware validatePasswordChange
 * @description Valide les données de changement de mot de passe
 */
exports.validatePasswordChange = [
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("Le mot de passe actuel est requis")
        .isLength({ min: 1 })
        .withMessage("Le mot de passe actuel ne peut pas être vide"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("Le nouveau mot de passe est requis")
        .isLength({ min: 6 })
        .withMessage("Le nouveau mot de passe doit contenir au moins 6 caractères")
        .custom((value) => {
        if (!(0, validators_1.validatePasswordStrength)(value)) {
            throw new Error("Le nouveau mot de passe est trop faible");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données de changement de mot de passe invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
/**
 * @middleware validateForgotPassword
 * @description Valide les données de mot de passe oublié
 */
exports.validateForgotPassword = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("L'email est requis")
        .isEmail()
        .withMessage("Format d'email invalide")
        .normalizeEmail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données de réinitialisation invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
/**
 * @middleware validateResetPassword
 * @description Valide les données de réinitialisation de mot de passe
 */
exports.validateResetPassword = [
    (0, express_validator_1.body)("token")
        .notEmpty()
        .withMessage("Le token de réinitialisation est requis"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Le nouveau mot de passe est requis")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères")
        .custom((value) => {
        if (!(0, validators_1.validatePasswordStrength)(value)) {
            throw new Error("Le mot de passe est trop faible");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données de réinitialisation invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
/**
 * @middleware validateProfileUpdate
 * @description Valide les données de mise à jour de profil
 */
exports.validateProfileUpdate = [
    (0, express_validator_1.body)("firstName")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
        .trim()
        .escape(),
    (0, express_validator_1.body)("lastName")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom doit contenir entre 2 et 50 caractères")
        .trim()
        .escape(),
    (0, express_validator_1.body)("phone")
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage("Le numéro de téléphone doit contenir entre 10 et 15 caractères")
        .trim(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Données de profil invalides",
                errors: errors.array(),
                code: "VALIDATION_ERROR",
            });
        }
        next();
    },
];
//# sourceMappingURL=authValidators.js.map