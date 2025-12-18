/**
 * @file classValidators.ts
 * @description Validateurs pour les classes scolaires
 * @version 1.0.0
 */

import { body, query, param, ValidationChain } from "express-validator";
import { ClassLevel } from "../../generated/prisma";

/**
 * Validateur pour la recherche de classes
 */
export const validateClassSearch: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  query("level")
    .optional()
    .isIn(["all", ...Object.values(ClassLevel)])
    .withMessage("Niveau de classe invalide"),

  query("academicYear")
    .optional()
    .isString()
    .withMessage("L'année académique doit être une chaîne de caractères"),

  query("status")
    .optional()
    .isIn(["all", "Active", "Inactive", "Archived"])
    .withMessage("Statut invalide"),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La recherche ne doit pas dépasser 100 caractères"),

  query("sortBy")
    .optional()
    .isIn(["name", "level", "createdAt", "capacity"])
    .withMessage("Champ de tri invalide"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];

/**
 * Validateur pour la création d'une classe
 */
export const validateCreateClass: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Le nom de la classe est requis")
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),

  body("level")
    .notEmpty()
    .withMessage("Le niveau de la classe est requis")
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("La capacité doit être entre 1 et 50"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Archived"])
    .withMessage("Statut invalide"),
];

/**
 * Validateur pour la mise à jour d'une classe
 */
export const validateUpdateClass: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),

  body("level")
    .optional()
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("La capacité doit être entre 1 et 50"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Archived"])
    .withMessage("Statut invalide"),
];

/**
 * Validateur pour la mise à jour du statut d'une classe
 */
export const validateClassStatusUpdate: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("status")
    .notEmpty()
    .withMessage("Le statut est requis")
    .isIn(["Active", "Inactive", "Archived"])
    .withMessage("Statut invalide"),
];

/**
 * Validateur pour l'assignation d'un professeur principal
 */
export const validateAssignTeacher: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("teacherId")
    .notEmpty()
    .withMessage("L'ID du professeur est requis")
    .isString()
    .withMessage("L'ID du professeur doit être une chaîne de caractères"),
];

/**
 * Validateur pour la récupération d'étudiants d'une classe
 */
export const validateClassStudents: ValidationChain[] = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  query("status")
    .optional()
    .isIn(["all", "Active", "Inactive", "Graduated", "Suspended"])
    .withMessage("Statut d'étudiant invalide"),
];

/**
 * Validateur pour la récupération des classes disponibles
 */
export const validateAvailableClasses: ValidationChain[] = [
  query("academicYearId")
    .optional()
    .isString()
    .withMessage(
      "L'ID de l'année académique doit être une chaîne de caractères"
    ),

  query("level")
    .optional()
    .isIn(["all", ...Object.values(ClassLevel)])
    .withMessage("Niveau de classe invalide"),
];
