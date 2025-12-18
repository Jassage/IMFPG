/**
 * @file enrollmentValidators.ts
 * @description Validators pour les inscriptions
 * @version 1.0.0
 */

import { body, param, query } from "express-validator";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Validateur pour la création d'inscription
export const validateCreateEnrollment = [
  body("studentId")
    .notEmpty()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne")
    .custom(async (value) => {
      const student = await prisma.student.findUnique({
        where: { id: value },
      });
      if (!student) {
        throw new Error("Étudiant non trouvé");
      }
      return true;
    }),

  body("classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne")
    .custom(async (value) => {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: value },
      });
      if (!schoolClass) {
        throw new Error("Classe non trouvée");
      }
      return true;
    }),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage("L'ID de l'année académique doit être une chaîne")
    .custom(async (value) => {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: value },
      });
      if (!academicYear) {
        throw new Error("Année académique non trouvée");
      }
      return true;
    }),

  body("enrollmentDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'inscription doit être une date valide"),

  body("status")
    .optional()
    .isIn(["Active", "Suspended", "Completed"])
    .withMessage("Le statut doit être Active, Suspended ou Completed"),
];

// Validateur pour la mise à jour d'inscription
export const validateUpdateEnrollment = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de l'inscription est requis")
    .isString()
    .withMessage("L'ID de l'inscription doit être une chaîne"),

  body("classId")
    .optional()
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne")
    .custom(async (value) => {
      if (value) {
        const schoolClass = await prisma.schoolClass.findUnique({
          where: { id: value },
        });
        if (!schoolClass) {
          throw new Error("Classe non trouvée");
        }
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["Active", "Suspended", "Completed"])
    .withMessage("Le statut doit être Active, Suspended ou Completed"),
];

// Validateur pour la réinscription
export const validateReenrollment = [
  body("studentId")
    .notEmpty()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne")
    .custom(async (value) => {
      const student = await prisma.student.findUnique({
        where: { id: value },
      });
      if (!student) {
        throw new Error("Étudiant non trouvé");
      }
      return true;
    }),

  body("classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne")
    .custom(async (value) => {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: value },
      });
      if (!schoolClass) {
        throw new Error("Classe non trouvée");
      }
      return true;
    }),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage("L'ID de l'année académique doit être une chaîne")
    .custom(async (value) => {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: value },
      });
      if (!academicYear) {
        throw new Error("Année académique non trouvée");
      }
      return true;
    }),

  body("enrollmentDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'inscription doit être une date valide"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne"),
];

// Validateur pour les inscriptions en masse
export const validateBulkEnrollments = [
  body("enrollments")
    .isArray({ min: 1 })
    .withMessage("Les inscriptions doivent être un tableau non vide"),

  body("enrollments.*.studentId")
    .notEmpty()
    .withMessage("L'ID de l'étudiant est requis pour chaque inscription")
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne"),

  body("enrollments.*.classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis pour chaque inscription")
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne"),

  body("enrollments.*.academicYearId")
    .notEmpty()
    .withMessage(
      "L'ID de l'année académique est requis pour chaque inscription"
    )
    .isString()
    .withMessage("L'ID de l'année académique doit être une chaîne"),

  body("enrollments.*.enrollmentDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'inscription doit être une date valide"),
];

// Validateur pour les paramètres de requête
export const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La page doit être un nombre positif"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),
  query("academicYearId")
    .optional()
    .isString()
    .withMessage("L'ID de l'année académique doit être une chaîne"),
  query("classId")
    .optional()
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne"),
  query("studentId")
    .optional()
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne"),
  query("status")
    .optional()
    .isIn(["Active", "Suspended", "Completed", "all"])
    .withMessage("Statut invalide"),
  query("search")
    .optional()
    .isString()
    .withMessage("La recherche doit être une chaîne"),
  query("sortBy")
    .optional()
    .isIn(["enrollmentDate", "createdAt", "status"])
    .withMessage("Tri invalide"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Ordre de tri invalide"),
];

// Validateur pour l'ID d'étudiant dans les paramètres
export const validateStudentIdParam = [
  param("studentId")
    .notEmpty()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne")
    .custom(async (value) => {
      const student = await prisma.student.findUnique({
        where: { id: value },
      });
      if (!student) {
        throw new Error("Étudiant non trouvé");
      }
      return true;
    }),
];

// Validateur pour la désinscription
export const validateUnenroll = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de l'inscription est requis")
    .isString()
    .withMessage("L'ID de l'inscription doit être une chaîne"),

  body("reason")
    .optional()
    .isString()
    .withMessage("La raison doit être une chaîne")
    .isLength({ max: 500 })
    .withMessage("La raison ne doit pas dépasser 500 caractères"),
];
