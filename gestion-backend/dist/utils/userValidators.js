"use strict";
/**
 * @file userValidators.ts
 * @description Validateurs pour la gestion des utilisateurs (partie admin)
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSearch = exports.validateAdminPasswordReset = exports.validateUserCreateByAdmin = exports.validateUserActivation = exports.validateUserDeactivation = exports.validateUserRoleUpdate = exports.validateUserStatusUpdate = exports.validateUserUpdate = void 0;
const express_validator_1 = require("express-validator");
// import { validateEmail, validatePhoneNumber } from "../../utils/validators";
// import { validateUserRole } from "./authValidators";
const userService_1 = require("../services/userService");
const validators_1 = require("./validators");
/**
 * @desc Validateur pour la mise à jour d'un utilisateur (admin)
 */
exports.validateUserUpdate = [
    (0, express_validator_1.body)("email")
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("L'email doit être valide")
        .custom(async (value, { req }) => {
        if (value) {
            const { UserService } = await Promise.resolve().then(() => __importStar(require("../services/userService")));
            const id = req?.params?.id;
            const user = await UserService.getUserByEmail(value);
            // Vérifier si l'email existe déjà pour un autre utilisateur
            if (user && user.id !== id) {
                throw new Error("Cet email est déjà utilisé");
            }
        }
        return true;
    }),
    (0, express_validator_1.body)("firstName")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Le prénom doit contenir entre 1 et 50 caractères")
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage("Le prénom ne doit contenir que des lettres, espaces et tirets"),
    (0, express_validator_1.body)("lastName")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Le nom doit contenir entre 1 et 50 caractères")
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),
    (0, express_validator_1.body)("phone")
        .optional()
        .trim()
        .custom((value) => {
        if (!value)
            return true; // Phone est optionnel
        if (!(0, validators_1.validatePhoneNumber)(value)) {
            throw new Error("Le numéro de téléphone doit être valide");
        }
        return true;
    }),
    (0, express_validator_1.body)("dateOfBirth")
        .optional()
        .isISO8601()
        .withMessage("La date de naissance doit être au format valide (YYYY-MM-DD)")
        .custom((value) => {
        if (!value)
            return true;
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 13;
        }
        return age >= 13;
    })
        .withMessage("L'utilisateur doit avoir au moins 13 ans"),
    (0, express_validator_1.body)("address")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("L'adresse ne doit pas dépasser 200 caractères"),
    (0, express_validator_1.body)("preferences")
        .optional()
        .isObject()
        .withMessage("Les préférences doivent être un objet"),
    (0, express_validator_1.body)("preferences.language")
        .optional()
        .isIn(["fr", "en", "es"])
        .withMessage("La langue doit être 'fr', 'en' ou 'es'"),
    (0, express_validator_1.body)("preferences.notifications")
        .optional()
        .isBoolean()
        .withMessage("Les notifications doivent être un booléen"),
    (0, express_validator_1.body)("role")
        .optional()
        .custom((value) => {
        if (!value)
            return true;
        return (0, validators_1.validateUserRole)(value);
    }),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
        .withMessage("Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"),
];
/**
 * @desc Validateur pour la mise à jour du statut d'un utilisateur
 */
exports.validateUserStatusUpdate = [
    (0, express_validator_1.body)("status")
        .exists()
        .withMessage("Le statut est requis")
        .trim()
        .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
        .withMessage("Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"),
    (0, express_validator_1.body)("reason")
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage("La raison doit contenir entre 1 et 500 caractères")
        .escape()
        .withMessage("La raison contient des caractères non autorisés"),
];
/**
 * @desc Validateur pour la mise à jour du rôle d'un utilisateur
 */
exports.validateUserRoleUpdate = [
    (0, express_validator_1.body)("role")
        .exists()
        .withMessage("Le rôle est requis")
        .trim()
        .isIn([
        "Parent",
        "Student",
        "Professeur",
        "Secretaire",
        "Directeur",
        "Admin",
    ])
        .withMessage("Le rôle doit être l'un des suivants: Parent, Student, Professeur, Secretaire, Directeur, Admin"),
];
/**
 * @desc Validateur pour la désactivation d'un utilisateur
 */
exports.validateUserDeactivation = [
    (0, express_validator_1.body)("reason")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La raison ne doit pas dépasser 500 caractères")
        .escape(),
];
/**
 * @desc Validateur pour la réactivation d'un utilisateur
 */
exports.validateUserActivation = [
    (0, express_validator_1.body)("reason")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La raison ne doit pas dépasser 500 caractères")
        .escape(),
];
/**
 * @desc Validateur pour la création d'un utilisateur par admin
 */
exports.validateUserCreateByAdmin = [
    (0, express_validator_1.body)("email")
        .exists()
        .withMessage("L'email est requis")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("L'email doit être valide")
        .custom(async (value) => {
        //   const { UserService } = await import("../../services/userService");
        const user = await userService_1.UserService.getUserByEmail(value);
        if (user) {
            throw new Error("Cet email est déjà utilisé");
        }
        return true;
    }),
    (0, express_validator_1.body)("firstName")
        .exists()
        .withMessage("Le prénom est requis")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Le prénom doit contenir entre 1 et 50 caractères")
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage("Le prénom ne doit contenir que des lettres, espaces et tirets"),
    (0, express_validator_1.body)("lastName")
        .exists()
        .withMessage("Le nom est requis")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Le nom doit contenir entre 1 et 50 caractères")
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),
    (0, express_validator_1.body)("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
    (0, express_validator_1.body)("role")
        .exists()
        .withMessage("Le rôle est requis")
        .trim()
        .isIn([
        "Parent",
        "Student",
        "Professeur",
        "Secretaire",
        "Directeur",
        "Admin",
    ])
        .withMessage("Le rôle doit être l'un des suivants: Parent, Student, Professeur, Secretaire, Directeur, Admin"),
    (0, express_validator_1.body)("phone")
        .optional()
        .trim()
        .custom((value) => {
        if (!value)
            return true;
        if (!(0, validators_1.validatePhoneNumber)(value)) {
            throw new Error("Le numéro de téléphone doit être valide");
        }
        return true;
    }),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
        .withMessage("Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"),
];
/**
 * @desc Validateur pour la réinitialisation de mot de passe par admin
 */
exports.validateAdminPasswordReset = [
    (0, express_validator_1.body)("sendEmail")
        .optional()
        .isBoolean()
        .withMessage("sendEmail doit être un booléen"),
    (0, express_validator_1.body)("temporaryPassword")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Le mot de passe temporaire doit contenir au moins 6 caractères")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Le mot de passe temporaire doit contenir au moins une minuscule, une majuscule et un chiffre"),
];
/**
 * @desc Validateur pour la recherche d'utilisateurs
 */
exports.validateUserSearch = [
    (0, express_validator_1.body)("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Le terme de recherche ne doit pas dépasser 100 caractères"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["Parent", "Staff", "Admin"])
        .withMessage("Le rôle doit être l'un des suivants: Parent, Staff, Admin"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
        .withMessage("Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"),
    (0, express_validator_1.body)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif"),
    (0, express_validator_1.body)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.body)("sortBy")
        .optional()
        .isIn(["firstName", "lastName", "email", "createdAt", "lastLogin"])
        .withMessage("Le tri doit être sur l'un des champs suivants: firstName, lastName, email, createdAt, lastLogin"),
    (0, express_validator_1.body)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
//# sourceMappingURL=userValidators.js.map