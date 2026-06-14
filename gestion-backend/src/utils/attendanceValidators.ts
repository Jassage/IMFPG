/**
 * @file attendanceValidators.ts
 * @description Validators pour la gestion des présences
 */

import { body, param, query } from "express-validator";

// Validator pour création de présence
export const validateCreateAttendance = [
  body("studentId")
    .notEmpty()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID de l'étudiant doit être une chaîne de caractères"),

  body("classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID de la classe doit être une chaîne de caractères"),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage(
      "L'ID de l'année académique doit être une chaîne de caractères",
    ),

  body("date")
    .notEmpty()
    .withMessage("La date est requise")
    .isISO8601()
    .withMessage("Format de date invalide")
    .toDate(),

  body("session")
    .notEmpty()
    .withMessage("La session est requise")
    .isIn(["MORNING", "AFTERNOON", "FULL_DAY"])
    .withMessage("Session invalide"),

  body("status")
    .notEmpty()
    .withMessage("Le statut est requis")
    .isIn([
      "PRESENT",
      "ABSENT",
      "LATE",
      "EXCUSED",
      "HOLIDAY",
      "SICK",
      "SUSPENDED",
      "OTHER",
    ])
    .withMessage("Statut invalide"),

  body("checkInTime")
    .optional()
    .isISO8601()
    .withMessage("Format d'heure invalide")
    .toDate(),

  body("checkOutTime")
    .optional()
    .isISO8601()
    .withMessage("Format d'heure invalide")
    .toDate(),

  body("expectedCheckIn")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("expectedCheckOut")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne de caractères")
    .isLength({ max: 500 })
    .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];

// Validator pour mise à jour de présence
export const validateUpdateAttendance = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la présence est requis")
    .isString()
    .withMessage("ID invalide"),

  body("status")
    .optional()
    .isIn([
      "PRESENT",
      "ABSENT",
      "LATE",
      "EXCUSED",
      "HOLIDAY",
      "SICK",
      "SUSPENDED",
      "OTHER",
    ])
    .withMessage("Statut invalide"),

  body("checkInTime")
    .optional()
    .isISO8601()
    .withMessage("Format d'heure invalide")
    .toDate(),

  body("checkOutTime")
    .optional()
    .isISO8601()
    .withMessage("Format d'heure invalide")
    .toDate(),

  body("expectedCheckIn")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("expectedCheckOut")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne de caractères")
    .isLength({ max: 500 })
    .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];

// Validator pour validation de présence
export const validateAttendanceValidation = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la présence est requis")
    .isString()
    .withMessage("ID invalide"),

  body("validationStatus")
    .notEmpty()
    .withMessage("Le statut de validation est requis")
    .isIn(["PENDING", "VALIDATED", "REJECTED"])
    .withMessage("Statut de validation invalide"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Les notes doivent être une chaîne de caractères")
    .isLength({ max: 500 })
    .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];

// Validator pour justification de présence
export const validateAttendanceJustification = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la présence est requis")
    .isString()
    .withMessage("ID invalide"),

  body("justification")
    .notEmpty()
    .withMessage("La justification est requise")
    .isString()
    .withMessage("La justification doit être une chaîne de caractères")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La justification doit contenir entre 10 et 1000 caractères"),

  body("justificationType")
    .notEmpty()
    .withMessage("Le type de justification est requis")
    .isIn([
      "MEDICAL_CERTIFICATE",
      "FAMILY_REASON",
      "ADMINISTRATIVE",
      "TRANSPORT_ISSUE",
      "OTHER",
    ])
    .withMessage("Type de justification invalide"),

  body("justificationDoc")
    .optional()
    .isURL()
    .withMessage("Le document doit être une URL valide"),
];

// Validator pour scan de présence
export const validateAttendanceScan = [
  body("studentCode")
    .notEmpty()
    .withMessage("Le code étudiant est requis")
    .isString()
    .withMessage("Code étudiant invalide"),

  body("classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("ID de classe invalide"),

  body("session")
    .notEmpty()
    .withMessage("La session est requise")
    .isIn(["MORNING", "AFTERNOON", "FULL_DAY"])
    .withMessage("Session invalide"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Format de date invalide")
    .toDate(),
];

// Validator pour création de session
export const validateCreateAttendanceSession = [
  body("classId")
    .notEmpty()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("ID de classe invalide"),

  body("subjectId")
    .notEmpty()
    .withMessage("L'ID de la matière est requis")
    .isString()
    .withMessage("ID de matière invalide"),

  body("professeurId")
    .notEmpty()
    .withMessage("L'ID du professeur est requis")
    .isString()
    .withMessage("ID de professeur invalide"),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'ID de l'année académique est requis")
    .isString()
    .withMessage("ID d'année académique invalide"),

  body("date")
    .notEmpty()
    .withMessage("La date est requise")
    .isISO8601()
    .withMessage("Format de date invalide")
    .toDate(),

  body("startTime")
    .notEmpty()
    .withMessage("L'heure de début est requise")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("endTime")
    .notEmpty()
    .withMessage("L'heure de fin est requise")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)")
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime <= req.body.startTime) {
        throw new Error(
          "L'heure de fin doit être postérieure à l'heure de début",
        );
      }
      return true;
    }),

  body("topic")
    .optional()
    .isString()
    .withMessage("Le sujet doit être une chaîne de caractères")
    .isLength({ max: 200 })
    .withMessage("Le sujet ne doit pas dépasser 200 caractères"),

  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères")
    .isLength({ max: 1000 })
    .withMessage("La description ne doit pas dépasser 1000 caractères"),
];

// Validator pour mise à jour de session
export const validateUpdateAttendanceSession = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la session est requis")
    .isString()
    .withMessage("ID invalide"),

  body("startTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("endTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("topic")
    .optional()
    .isString()
    .withMessage("Le sujet doit être une chaîne de caractères")
    .isLength({ max: 200 })
    .withMessage("Le sujet ne doit pas dépasser 200 caractères"),

  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères")
    .isLength({ max: 1000 })
    .withMessage("La description ne doit pas dépasser 1000 caractères"),
];

// Validator pour annulation de session
export const validateCancelAttendanceSession = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de la session est requis")
    .isString()
    .withMessage("ID invalide"),

  body("cancellationReason")
    .notEmpty()
    .withMessage("La raison d'annulation est requise")
    .isString()
    .withMessage("La raison doit être une chaîne de caractères")
    .isLength({ min: 5, max: 500 })
    .withMessage("La raison doit contenir entre 5 et 500 caractères"),
];

// Validator pour filtres de présence
export const validateAttendanceFilters = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La page doit être un nombre entier positif")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être un nombre entre 1 et 100")
    .toInt(),

  query("status")
    .optional()
    .isIn([
      "PRESENT",
      "ABSENT",
      "LATE",
      "EXCUSED",
      "HOLIDAY",
      "SICK",
      "SUSPENDED",
      "OTHER",
    ])
    .withMessage("Statut invalide"),

  query("validationStatus")
    .optional()
    .isIn(["PENDING", "VALIDATED", "REJECTED"])
    .withMessage("Statut de validation invalide"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Format de date de début invalide")
    .toDate(),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Format de date de fin invalide")
    .toDate(),

  query("session")
    .optional()
    .isIn(["MORNING", "AFTERNOON", "FULL_DAY"])
    .withMessage("Session invalide"),
];

// Validator pour mise à jour des paramètres
export const validateAttendanceSettings = [
  body("defaultMorningStart")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("defaultMorningEnd")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("defaultAfternoonStart")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("defaultAfternoonEnd")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("lateThreshold")
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage(
      "Le seuil de retard doit être un nombre entre 0 et 120 minutes",
    )
    .toInt(),

  body("notifyOnAbsence")
    .optional()
    .isBoolean()
    .withMessage("Doit être un booléen")
    .toBoolean(),

  body("notifyParentsOnAbsence")
    .optional()
    .isBoolean()
    .withMessage("Doit être un booléen")
    .toBoolean(),

  body("requireJustification")
    .optional()
    .isBoolean()
    .withMessage("Doit être un booléen")
    .toBoolean(),

  body("maxConsecutiveAbsences")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage(
      "Le nombre maximum d'absences consécutives doit être entre 1 et 30",
    )
    .toInt(),

  body("alertThreshold")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Le seuil d'alerte doit être un pourcentage entre 0 et 100")
    .toInt(),
];
