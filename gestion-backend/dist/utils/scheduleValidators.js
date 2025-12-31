"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckConflictsQuery = exports.validateGenerateTimetable = exports.validateUpdateSchedule = exports.validateCreateSchedule = void 0;
const express_validator_1 = require("express-validator");
const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];
const scheduleStatus = ["ACTIVE", "INACTIVE", "CANCELLED"];
const recurrenceTypes = ["WEEKLY", "BIWEEKLY", "MONTHLY"];
exports.validateCreateSchedule = [
    (0, express_validator_1.body)("assignmentId")
        .notEmpty()
        .withMessage("L'ID de l'assignation est requis")
        .isString()
        .withMessage("L'ID de l'assignation doit être une chaîne de caractères"),
    (0, express_validator_1.body)("classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne de caractères"),
    (0, express_validator_1.body)("dayOfWeek")
        .notEmpty()
        .withMessage("Le jour de la semaine est requis")
        .isIn(daysOfWeek)
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.body)("startTime")
        .notEmpty()
        .withMessage("L'heure de début est requise")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)"),
    (0, express_validator_1.body)("endTime")
        .notEmpty()
        .withMessage("L'heure de fin est requise")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)")
        .custom((endTime, { req }) => {
        const startTime = req.body.startTime;
        if (startTime && endTime <= startTime) {
            throw new Error("L'heure de fin doit être après l'heure de début");
        }
        return true;
    }),
    (0, express_validator_1.body)("classroom")
        .optional()
        .isString()
        .withMessage("La salle doit être une chaîne de caractères")
        .isLength({ max: 50 })
        .withMessage("La salle ne peut pas dépasser 50 caractères"),
    (0, express_validator_1.body)("recurrence")
        .optional()
        .isIn(recurrenceTypes)
        .withMessage("Type de récurrence invalide"),
    (0, express_validator_1.body)("untilDate")
        .optional()
        .isISO8601()
        .withMessage("Format de date invalide (ISO8601)")
        .custom((untilDate, { req }) => {
        if (req.body.recurrence && !untilDate) {
            throw new Error("La date de fin est requise pour une récurrence");
        }
        return true;
    }),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .isLength({ max: 1000 })
        .withMessage("Les notes ne peuvent pas dépasser 1000 caractères"),
    (0, express_validator_1.body)("status").optional().isIn(scheduleStatus).withMessage("Statut invalide"),
];
exports.validateUpdateSchedule = [
    (0, express_validator_1.body)("dayOfWeek")
        .optional()
        .isIn(daysOfWeek)
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.body)("startTime")
        .optional()
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)"),
    (0, express_validator_1.body)("endTime")
        .optional()
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)")
        .custom((endTime, { req }) => {
        const startTime = req.body.startTime;
        if (startTime && endTime && endTime <= startTime) {
            throw new Error("L'heure de fin doit être après l'heure de début");
        }
        return true;
    }),
    (0, express_validator_1.body)("classroom")
        .optional()
        .isString()
        .withMessage("La salle doit être une chaîne de caractères")
        .isLength({ max: 50 })
        .withMessage("La salle ne peut pas dépasser 50 caractères"),
    (0, express_validator_1.body)("recurrence")
        .optional()
        .isIn(recurrenceTypes)
        .withMessage("Type de récurrence invalide"),
    (0, express_validator_1.body)("untilDate")
        .optional()
        .isISO8601()
        .withMessage("Format de date invalide (ISO8601)"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne de caractères")
        .isLength({ max: 1000 })
        .withMessage("Les notes ne peuvent pas dépasser 1000 caractères"),
    (0, express_validator_1.body)("status").optional().isIn(scheduleStatus).withMessage("Statut invalide"),
];
exports.validateGenerateTimetable = [
    (0, express_validator_1.body)("classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne de caractères"),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID de l'année académique est requis")
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne de caractères"),
    (0, express_validator_1.body)("constraints.maxHoursPerDay")
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage("Le nombre maximum d'heures par jour doit être entre 1 et 12"),
    (0, express_validator_1.body)("constraints.breakTime.start")
        .optional()
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure de début de pause invalide"),
    (0, express_validator_1.body)("constraints.breakTime.end")
        .optional()
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure de fin de pause invalide")
        .custom((end, { req }) => {
        const start = req.body.constraints?.breakTime?.start;
        if (start && end && end <= start) {
            throw new Error("L'heure de fin de pause doit être après l'heure de début");
        }
        return true;
    }),
];
exports.validateCheckConflictsQuery = [
    (0, express_validator_1.query)("professeurId")
        .notEmpty()
        .withMessage("L'ID du professeur est requis")
        .isString()
        .withMessage("L'ID du professeur doit être une chaîne de caractères"),
    (0, express_validator_1.query)("classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne de caractères"),
    (0, express_validator_1.query)("dayOfWeek")
        .notEmpty()
        .withMessage("Le jour de la semaine est requis")
        .isIn(daysOfWeek)
        .withMessage("Jour de la semaine invalide"),
    (0, express_validator_1.query)("startTime")
        .notEmpty()
        .withMessage("L'heure de début est requise")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)"),
    (0, express_validator_1.query)("endTime")
        .notEmpty()
        .withMessage("L'heure de fin est requise")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Format d'heure invalide (HH:mm)")
        .custom((endTime, { req }) => {
        const startTime = req.query?.startTime;
        if (startTime && endTime <= startTime) {
            throw new Error("L'heure de fin doit être après l'heure de début");
        }
        return true;
    }),
    (0, express_validator_1.query)("classroom")
        .optional()
        .isString()
        .withMessage("La salle doit être une chaîne de caractères"),
    (0, express_validator_1.query)("excludeScheduleId")
        .optional()
        .isString()
        .withMessage("L'ID de l'horaire à exclure doit être une chaîne de caractères"),
];
//# sourceMappingURL=scheduleValidators.js.map