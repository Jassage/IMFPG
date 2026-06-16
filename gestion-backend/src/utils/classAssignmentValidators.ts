import { body } from "express-validator";
import { ClassLevel } from "../../generated/prisma";
// import { ClassLevel } from "@prisma/client";

export const validateCreateClassAssignment = [
  body("subjectId")
    .notEmpty()
    .withMessage("L'ID de la matière est requis")
    .isString()
    .withMessage("L'ID de la matière doit être une chaîne de caractères"),

  // Le professeur est optionnel : la matière peut être inscrite au programme
  // d'un niveau avant qu'un enseignant ne lui soit affecté ("À pourvoir")
  body("professeurId")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),

  body("classLevel")
    .notEmpty()
    .withMessage("Le niveau de classe est requis")
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  // Section précise (optionnelle) à laquelle s'applique cette assignation
  body("schoolClassId")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne de caractères"),

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

  // Accepte explicitement `null` pour désaffecter le professeur ("À pourvoir")
  body("professeurId")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),

  body("classLevel")
    .optional()
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  // Accepte explicitement `null` pour retirer la section ("tout le niveau")
  body("schoolClassId")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne de caractères"),

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

export const validateAssignSubjectToLevels = [
  body("subjectId")
    .notEmpty()
    .withMessage("L'ID de la matière est requis")
    .isString()
    .withMessage("L'ID de la matière doit être une chaîne de caractères"),

  body("classLevels")
    .isArray({ min: 1 })
    .withMessage("Au moins un niveau de classe est requis"),

  body("classLevels.*")
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage(
      "L'ID de l'année académique doit être une chaîne de caractères"
    ),

  body("professeurId")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),
];
