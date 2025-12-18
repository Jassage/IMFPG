/**
 * @file subjectValidators.ts
 * @description Validateurs pour les matières
 */

import { body, param } from "express-validator";
import { SubjectType } from "../../generated/prisma";
// import { SubjectType } from "@prisma/client";

export const validateCreateSubject = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Le code est requis")
    .isLength({ min: 2, max: 20 })
    .withMessage("Le code doit contenir entre 2 et 20 caractères")
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage(
      "Le code ne peut contenir que des lettres majuscules, chiffres, tirets et underscores"
    ),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom doit contenir entre 3 et 100 caractères"),

  body("coefficient")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Le coefficient doit être entre 1 et 10")
    .default(1),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Le type est requis")
    .isIn(Object.values(SubjectType))
    .withMessage(
      `Type invalide. Valeurs autorisées: ${Object.values(SubjectType).join(", ")}`
    ),

  body("passingGrade")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("La note de passage doit être entre 0 et 100"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut dépasser 500 caractères"),
];

export const validateUpdateSubject = [
  param("id")
    .notEmpty()
    .withMessage("ID requis")
    .matches(/^c[a-z0-9]+$/)
    .withMessage("ID invalide"),

  body("code")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Le code doit contenir entre 2 et 20 caractères")
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage(
      "Le code ne peut contenir que des lettres majuscules, chiffres, tirets et underscores"
    ),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom doit contenir entre 3 et 100 caractères"),

  body("credits")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Les crédits doivent être entre 1 et 10"),

  body("coefficient") // ← AJOUTEZ CE CHAMP
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Le coefficient doit être entre 1 et 10"),

  body("type")
    .optional()
    .trim()
    .isIn(["Obligatoire", "Optionnelle"])
    .withMessage("Type invalide. Valeurs autorisées: Obligatoire, Optionnelle"),

  body("passingGrade")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("La note de passage doit être entre 0 et 100"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut dépasser 500 caractères"),
];

export const validateSubjectId = [
  param("id")
    .notEmpty()
    .withMessage("ID requis")
    .isLength({ min: 25, max: 30 })
    .withMessage("ID invalide")
    .matches(/^c[a-z0-9]{24,29}$/)
    .withMessage("Format d'ID invalide"),
];
