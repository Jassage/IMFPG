/**
 * @file studentFeeValidators.ts
 * @description Validateurs pour les frais étudiants
 * @module Validators/StudentFees
 */

import { body, param } from "express-validator";

const CLASS_LEVELS = [
  "Sixieme",
  "Cinquieme",
  "Quatrieme",
  "Troisieme",
  "Seconde",
  "Premiere",
  "Terminale",
  "NSI",
  "NSII",
  "NSIII",
  "NSIV",
];

/**
 * Validateur pour l'attribution de frais à un étudiant
 */
export const validateAssignFeeToStudent = [
  body("studentId")
    .trim()
    .notEmpty()
    .withMessage("L'ID étudiant est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID étudiant invalide"),

  body("feeStructureId")
    .trim()
    .notEmpty()
    .withMessage("L'ID de structure de frais est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID structure de frais invalide"),

  body("academicYearId")
    .trim()
    .notEmpty()
    .withMessage("L'ID d'année académique est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID année académique invalide"),
];

/**
 * Validateur pour la mise à jour des frais étudiants
 */
export const validateUpdateStudentFee = [
  param("id")
    .notEmpty()
    .withMessage("L'ID des frais est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID frais invalide"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'échéance doit être au format ISO8601")
    .custom((value) => {
      const date = new Date(value);
      return date > new Date();
    })
    .withMessage("La date d'échéance doit être dans le futur"),

  body("status")
    .optional()
    .isIn(["pending", "partial", "paid", "overdue"])
    .withMessage(
      "Le statut doit être l'un des suivants: pending, partial, paid, overdue"
    ),
];

/**
 * Validateur pour l'attribution de frais à tout un niveau de classe
 */
export const validateAssignFeeToClassLevel = [
  body("feeStructureId")
    .trim()
    .notEmpty()
    .withMessage("L'ID de structure de frais est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID structure de frais invalide"),

  body("classLevel")
    .trim()
    .notEmpty()
    .withMessage("Le niveau de classe est requis")
    .isIn(CLASS_LEVELS)
    .withMessage("Niveau de classe invalide"),

  body("academicYearId")
    .trim()
    .notEmpty()
    .withMessage("L'ID d'année académique est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID année académique invalide"),
];

/**
 * Validateur pour l'application d'une réduction sur les frais d'un étudiant
 */
export const validateApplyDiscount = [
  param("id")
    .notEmpty()
    .withMessage("L'ID des frais est requis")
    .isLength({ min: 20, max: 30 })
    .withMessage("ID frais invalide"),

  body("discountAmount")
    .notEmpty()
    .withMessage("Le montant de la réduction est requis")
    .isFloat({ min: 0 })
    .withMessage("Le montant de la réduction doit être un nombre positif ou nul")
    .toFloat(),

  body("discountReason")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("La raison ne doit pas dépasser 255 caractères"),
];
