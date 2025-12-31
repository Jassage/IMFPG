"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimetableQuery = exports.validateUpdateSchedule = exports.validateCreateSchedule = exports.validateCreateAssignment = void 0;
// Fichier: src/utils/timetableValidators.ts
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../generated/prisma");
// import { ClassLevel } from "../types/timetableTypes";
exports.validateCreateAssignment = [
    (0, express_validator_1.body)("subjectId")
        .notEmpty()
        .withMessage("La matière est requise")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID de matière invalide"),
    (0, express_validator_1.body)("professeurId")
        .notEmpty()
        .withMessage("Le professeur est requis")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID de professeur invalide"),
    (0, express_validator_1.body)("classLevel")
        .notEmpty()
        .withMessage("Le niveau de classe est requis")
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'année académique est requise")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID d'année académique invalide"),
    (0, express_validator_1.body)("schedules")
        .optional()
        .isArray()
        .withMessage("Les horaires doivent être un tableau"),
    (0, express_validator_1.body)("schedules.*.classId")
        .if((0, express_validator_1.body)("schedules").exists())
        .notEmpty()
        .withMessage("L'ID de classe est requis")
        .isUUID()
        .withMessage("ID de classe invalide"),
    (0, express_validator_1.body)("schedules.*.dayOfWeek")
        .if((0, express_validator_1.body)("schedules").exists())
        .notEmpty()
        .withMessage("Le jour de la semaine est requis")
        .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.body)("schedules.*.startTime")
        .if((0, express_validator_1.body)("schedules").exists())
        .notEmpty()
        .withMessage("L'heure de début est requise")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Format d'heure invalide (HH:MM)"),
    (0, express_validator_1.body)("schedules.*.endTime")
        .if((0, express_validator_1.body)("schedules").exists())
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
    (0, express_validator_1.body)("schedules.*.classroom")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),
];
exports.validateCreateSchedule = [
    (0, express_validator_1.param)("assignmentId")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID d'assignation invalide"),
    (0, express_validator_1.body)("classId")
        .notEmpty()
        .withMessage("L'ID de classe est requis")
        .matches(/^c[a-z0-9]+$/)
        .withMessage("ID de classe invalide"),
    (0, express_validator_1.body)("dayOfWeek")
        .notEmpty()
        .withMessage("Le jour de la semaine est requis")
        .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.body)("startTime")
        .notEmpty()
        .withMessage("L'heure de début est requise")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Format d'heure invalide (HH:MM)"),
    (0, express_validator_1.body)("endTime")
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
    (0, express_validator_1.body)("classroom")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),
    (0, express_validator_1.body)("recurrence")
        .optional()
        .isLength({ max: 100 })
        .withMessage("La règle de récurrence ne doit pas dépasser 100 caractères"),
    (0, express_validator_1.body)("untilDate")
        .optional()
        .isISO8601()
        .withMessage("Format de date invalide"),
    (0, express_validator_1.body)("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];
exports.validateUpdateSchedule = [
    (0, express_validator_1.param)("scheduleId").isUUID().withMessage("ID d'horaire invalide"),
    (0, express_validator_1.body)("dayOfWeek")
        .optional()
        .isIn(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"])
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.body)("startTime")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Format d'heure invalide (HH:MM)"),
    (0, express_validator_1.body)("endTime")
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
    (0, express_validator_1.body)("classroom")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Le nom de la salle ne doit pas dépasser 50 caractères"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE", "CANCELLED"])
        .withMessage("Statut invalide"),
    (0, express_validator_1.body)("recurrence")
        .optional()
        .isLength({ max: 100 })
        .withMessage("La règle de récurrence ne doit pas dépasser 100 caractères"),
    (0, express_validator_1.body)("untilDate")
        .optional()
        .isISO8601()
        .withMessage("Format de date invalide"),
    (0, express_validator_1.body)("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Les notes ne doivent pas dépasser 500 caractères"),
];
exports.validateTimetableQuery = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Le numéro de page doit être un entier positif"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.query)("academicYearId")
        .optional()
        .isUUID()
        .withMessage("ID d'année académique invalide"),
    (0, express_validator_1.query)("classLevel")
        .optional()
        .isIn(Object.values(prisma_1.ClassLevel))
        .withMessage("Niveau de classe invalide"),
    (0, express_validator_1.query)("professeurId")
        .optional()
        .isUUID()
        .withMessage("ID de professeur invalide"),
    (0, express_validator_1.query)("subjectId").optional().isUUID().withMessage("ID de matière invalide"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["Active", "Inactive", "all"])
        .withMessage("Statut invalide"),
    (0, express_validator_1.query)("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "classLevel"])
        .withMessage("Tri par champ invalide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Ordre de tri doit être 'asc' ou 'desc'"),
];
//# sourceMappingURL=timetableValidators.js.map