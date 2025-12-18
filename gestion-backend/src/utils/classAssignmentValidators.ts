import { body } from "express-validator";
import { ClassLevel } from "../../generated/prisma";
// import { ClassLevel } from "@prisma/client";

export const validateCreateClassAssignment = [
  body("subjectId")
    .notEmpty()
    .withMessage("L'ID de la matière est requis")
    .isString()
    .withMessage("L'ID de la matière doit être une chaîne de caractères"),

  body("professeurId")
    .notEmpty()
    .withMessage("L'ID du professeur est requis")
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),

  body("classLevel")
    .notEmpty()
    .withMessage("Le niveau de classe est requis")
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage(
      "L'ID de l'année académique doit être une chaîne de caractères"
    ),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Statut invalide. Valeurs acceptées: Active, Inactive"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne de caractères")
    .isLength({ max: 500 })
    .withMessage("Les notes ne peuvent pas dépasser 500 caractères"),
];

export const validateUpdateClassAssignment = [
  body("subjectId")
    .optional()
    .isString()
    .withMessage("L'ID de la matière doit être une chaîne de caractères"),

  body("professeurId")
    .optional()
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),

  body("classLevel")
    .optional()
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("academicYearId")
    .optional()
    .isString()
    .withMessage(
      "L'ID de l'année académique doit être une chaîne de caractères"
    ),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Statut invalide. Valeurs acceptées: Active, Inactive"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne de caractères")
    .isLength({ max: 500 })
    .withMessage("Les notes ne peuvent pas dépasser 500 caractères"),
];
