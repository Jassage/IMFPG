/**
 * @file authValidators.ts
 * @description Validateurs pour les routes d'authentification
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  validateEmail,
  validatePasswordStrength,
  validateUserRole,
} from "../../utils/validators";

/**
 * @middleware validateLogin
 * @description Valide les données de connexion
 */
export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email invalide")
    .custom((value: string) => {
      if (!validateEmail(value)) {
        throw new Error("Format d'email invalide");
      }
      return true;
    })
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 1 })
    .withMessage("Le mot de passe ne peut pas être vide"),

  /**
   * @middleware handleValidationErrors
   * @description Gère les erreurs de validation
   */
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email invalide")
    .custom((value: string) => {
      if (!validateEmail(value)) {
        throw new Error("Format d'email invalide");
      }
      return true;
    })
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .custom((value: string) => {
      if (!validatePasswordStrength(value)) {
        throw new Error("Le mot de passe est trop faible");
      }
      return true;
    }),

  body("role")
    .notEmpty()
    .withMessage("Le rôle est requis")
    .custom((value: string) => {
      try {
        validateUserRole(value);
        return true;
      } catch (error) {
        throw new Error("Rôle utilisateur invalide");
      }
    }),

  body("firstName")
    .notEmpty()
    .withMessage("Le prénom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .trim()
    .escape(),

  body("lastName")
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .trim()
    .escape(),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "Le numéro de téléphone doit contenir entre 10 et 15 caractères"
    )
    .trim(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Le mot de passe actuel est requis")
    .isLength({ min: 1 })
    .withMessage("Le mot de passe actuel ne peut pas être vide"),

  body("newPassword")
    .notEmpty()
    .withMessage("Le nouveau mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le nouveau mot de passe doit contenir au moins 6 caractères")
    .custom((value: string) => {
      if (!validatePasswordStrength(value)) {
        throw new Error("Le nouveau mot de passe est trop faible");
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateForgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email invalide")
    .normalizeEmail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Le token de réinitialisation est requis"),

  body("password")
    .notEmpty()
    .withMessage("Le nouveau mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .custom((value: string) => {
      if (!validatePasswordStrength(value)) {
        throw new Error("Le mot de passe est trop faible");
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validateProfileUpdate = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .trim()
    .escape(),

  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .trim()
    .escape(),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "Le numéro de téléphone doit contenir entre 10 et 15 caractères"
    )
    .trim(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
