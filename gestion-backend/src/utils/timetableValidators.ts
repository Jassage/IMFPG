// Fichier: src/utils/timetableValidators.ts
import { body, param, query } from "express-validator";
import { ClassLevel } from "../../generated/prisma";
// import { ClassLevel } from "../types/timetableTypes";

export const validateCreateAssignment = [
  body("subjectId")
    .notEmpty()
    .withMessage("La matière est requise")
    .matches(/^c[a-z0-9]+$/)
    .withMessage("ID de matière invalide"),

  body("professeurId")
    .notEmpty()
    .withMessage("Le professeur est requis")
    .matches(/^c[a-z0-9]+$/)
    .withMessage("ID de professeur invalide"),

  body("classLevel")
    .notEmpty()
    .withMessage("Le niveau de classe est requis")
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  body("academicYearId")
    .notEmpty()
    .withMessage("L'année académique est requise")
    .matches(/^c[a-z0-9]+$/)
    .withMessage("ID d'année académique invalide"),

  body("schedules")
    .optional()
    .isArray()
    .withMessage("Les horaires doivent être un tableau"),

  body("schedules.*.classId")
    .if(body("schedules").exists())
    .notEmpty()
    .withMessage("L'ID de classe est requis")
    .isUUID()
    .withMessage("ID de classe invalide"),

  body("schedules.*.dayOfWeek")
    .if(body("schedules").exists())
    .notEmpty()
    .withMessage("Le jour de la semaine est requis")
    .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
    .withMessage("Jour de la semaine invalide"),

  body("schedules.*.startTime")
    .if(body("schedules").exists())
    .notEmpty()
    .withMessage("L'heure de début est requise")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("schedules.*.endTime")
    .if(body("schedules").exists())
    .notEmpty()
    .withMessage("L'heure de fin est requise")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)")
    .custom((value, { req, path }) => {
      const index = parseInt(path.match(/\[(\d+)\]/)?.[1] || "0");
      const startTime = req.body.schedules?.[index]?.startTime;

      if (startTime && value) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = value.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        if (endTotal <= startTotal) {
          throw new Error("L'heure de fin doit être après l'heure de début");
        }

        if (endTotal - startTotal < 30) {
          throw new Error("La durée minimale d'un cours est de 30 minutes");
        }

        if (endTotal - startTotal > 240) {
          throw new Error("La durée maximale d'un cours est de 4 heures");
        }
      }
      return true;
    }),

  body("schedules.*.classroom")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),
];

export const validateCreateSchedule = [
  param("assignmentId")
    .matches(/^c[a-z0-9]+$/)
    .withMessage("ID d'assignation invalide"),

  body("classId")
    .notEmpty()
    .withMessage("L'ID de classe est requis")
    .matches(/^c[a-z0-9]+$/) 
    .withMessage("ID de classe invalide"),

  body("dayOfWeek")
    .notEmpty()
    .withMessage("Le jour de la semaine est requis")
    .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
    .withMessage("Jour de la semaine invalide"),

  body("startTime")
    .notEmpty()
    .withMessage("L'heure de début est requise")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("endTime")
    .notEmpty()
    .withMessage("L'heure de fin est requise")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)")
    .custom((value, { req }) => {
      const startTime = req.body.startTime;

      if (startTime && value) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = value.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        if (endTotal <= startTotal) {
          throw new Error("L'heure de fin doit être après l'heure de début");
        }

        if (endTotal - startTotal < 30) {
          throw new Error("La durée minimale d'un cours est de 30 minutes");
        }

        if (endTotal - startTotal > 240) {
          throw new Error("La durée maximale d'un cours est de 4 heures");
        }
      }
      return true;
    }),

  body("classroom")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),

  body("recurrence")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La règle de récurrence ne doit pas dépasser 100 caractères"),

  body("untilDate")
    .optional()
    .isISO8601()
    .withMessage("Format de date invalide"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];

export const validateUpdateSchedule = [
  param("scheduleId").isUUID().withMessage("ID d'horaire invalide"),

  body("dayOfWeek")
    .optional()
    .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
    .withMessage("Jour de la semaine invalide"),

  body("startTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)"),

  body("endTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Format d'heure invalide (HH:MM)")
    .custom((value, { req }) => {
      const startTime = req.body.startTime;

      if (startTime && value) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = value.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        if (endTotal <= startTotal) {
          throw new Error("L'heure de fin doit être après l'heure de début");
        }
      }
      return true;
    }),

  body("classroom")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "CANCELLED"])
    .withMessage("Statut invalide"),

  body("recurrence")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La règle de récurrence ne doit pas dépasser 100 caractères"),

  body("untilDate")
    .optional()
    .isISO8601()
    .withMessage("Format de date invalide"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];

export const validateTimetableQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  query("academicYearId")
    .optional()
    .isUUID()
    .withMessage("ID d'année académique invalide"),

  query("classLevel")
    .optional()
    .isIn(Object.values(ClassLevel))
    .withMessage("Niveau de classe invalide"),

  query("professeurId")
    .optional()
    .isUUID()
    .withMessage("ID de professeur invalide"),

  query("subjectId").optional().isUUID().withMessage("ID de matière invalide"),

  query("status")
    .optional()
    .isIn(["Active", "Inactive", "all"])
    .withMessage("Statut invalide"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "classLevel"])
    .withMessage("Tri par champ invalide"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Ordre de tri doit être 'asc' ou 'desc'"),
];
