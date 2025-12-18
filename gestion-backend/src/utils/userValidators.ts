/**
 * @file userValidators.ts
 * @description Validateurs pour la gestion des utilisateurs (partie admin)
 * @version 1.0.0
 */

import { body } from "express-validator";
// import { validateEmail, validatePhoneNumber } from "../../utils/validators";
// import { validateUserRole } from "./authValidators";
import { UserService } from "../services/userService";
import { validatePhoneNumber, validateUserRole } from "./validators";

/**
 * @desc Validateur pour la mise à jour d'un utilisateur (admin)
 */
export const validateUserUpdate = [
  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("L'email doit être valide")
    .custom(async (value, { req }) => {
      if (value) {
        const { UserService } = await import("../services/userService");
        const id = req?.params?.id as string | undefined;
        const user = await UserService.getUserByEmail(value);
        // Vérifier si l'email existe déjà pour un autre utilisateur
        if (user && user.id !== id) {
          throw new Error("Cet email est déjà utilisé");
        }
      }
      return true;
    }),

  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Le prénom doit contenir entre 1 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom ne doit contenir que des lettres, espaces et tirets"
    ),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Le nom doit contenir entre 1 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),

  body("phone")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true; // Phone est optionnel
      if (!validatePhoneNumber(value)) {
        throw new Error("Le numéro de téléphone doit être valide");
      }
      return true;
    }),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("La date de naissance doit être au format valide (YYYY-MM-DD)")
    .custom((value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    })
    .withMessage("L'utilisateur doit avoir au moins 13 ans"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("L'adresse ne doit pas dépasser 200 caractères"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Les préférences doivent être un objet"),

  body("preferences.language")
    .optional()
    .isIn(["fr", "en", "es"])
    .withMessage("La langue doit être 'fr', 'en' ou 'es'"),

  body("preferences.notifications")
    .optional()
    .isBoolean()
    .withMessage("Les notifications doivent être un booléen"),

  body("role")
    .optional()
    .custom((value) => {
      if (!value) return true;
      return validateUserRole(value);
    }),

  body("status")
    .optional()
    .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
    .withMessage(
      "Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"
    ),
];

/**
 * @desc Validateur pour la mise à jour du statut d'un utilisateur
 */
export const validateUserStatusUpdate = [
  body("status")
    .exists()
    .withMessage("Le statut est requis")
    .trim()
    .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
    .withMessage(
      "Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"
    ),

  body("reason")
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
export const validateUserRoleUpdate = [
  body("role")
    .exists()
    .withMessage("Le rôle est requis")
    .trim()
    .isIn(["Parent", "Staff", "Admin"])
    .withMessage("Le rôle doit être l'un des suivants: Parent, Staff, Admin"),
];

/**
 * @desc Validateur pour la désactivation d'un utilisateur
 */
export const validateUserDeactivation = [
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La raison ne doit pas dépasser 500 caractères")
    .escape(),
];

/**
 * @desc Validateur pour la réactivation d'un utilisateur
 */
export const validateUserActivation = [
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La raison ne doit pas dépasser 500 caractères")
    .escape(),
];

/**
 * @desc Validateur pour la création d'un utilisateur par admin
 */
export const validateUserCreateByAdmin = [
  body("email")
    .exists()
    .withMessage("L'email est requis")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("L'email doit être valide")
    .custom(async (value) => {
      //   const { UserService } = await import("../../services/userService");
      const user = await UserService.getUserByEmail(value);
      if (user) {
        throw new Error("Cet email est déjà utilisé");
      }
      return true;
    }),

  body("firstName")
    .exists()
    .withMessage("Le prénom est requis")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Le prénom doit contenir entre 1 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom ne doit contenir que des lettres, espaces et tirets"
    ),

  body("lastName")
    .exists()
    .withMessage("Le nom est requis")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Le nom doit contenir entre 1 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    ),

  body("role")
    .exists()
    .withMessage("Le rôle est requis")
    .trim()
    .isIn(["Parent", "Staff", "Admin"])
    .withMessage("Le rôle doit être l'un des suivants: Parent, Staff, Admin"),

  body("phone")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!validatePhoneNumber(value)) {
        throw new Error("Le numéro de téléphone doit être valide");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
    .withMessage(
      "Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"
    ),
];

/**
 * @desc Validateur pour la réinitialisation de mot de passe par admin
 */
export const validateAdminPasswordReset = [
  body("sendEmail")
    .optional()
    .isBoolean()
    .withMessage("sendEmail doit être un booléen"),

  body("temporaryPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage(
      "Le mot de passe temporaire doit contenir au moins 6 caractères"
    )
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe temporaire doit contenir au moins une minuscule, une majuscule et un chiffre"
    ),
];

/**
 * @desc Validateur pour la recherche d'utilisateurs
 */
export const validateUserSearch = [
  body("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Le terme de recherche ne doit pas dépasser 100 caractères"),

  body("role")
    .optional()
    .isIn(["Parent", "Staff", "Admin"])
    .withMessage("Le rôle doit être l'un des suivants: Parent, Staff, Admin"),

  body("status")
    .optional()
    .isIn(["Actif", "Inactif", "Suspendu", "En attente"])
    .withMessage(
      "Le statut doit être l'un des suivants: Actif, Inactif, Suspendu, En attente"
    ),

  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif"),

  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  body("sortBy")
    .optional()
    .isIn(["firstName", "lastName", "email", "createdAt", "lastLogin"])
    .withMessage(
      "Le tri doit être sur l'un des champs suivants: firstName, lastName, email, createdAt, lastLogin"
    ),

  body("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
