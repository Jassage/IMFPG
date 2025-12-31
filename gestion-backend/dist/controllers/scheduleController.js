"use strict";
/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps
 * @version 1.1.0 - Support ISO
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateSchedule = exports.getAvailableTimeSlots = exports.checkConflicts = exports.getProfessorSchedule = exports.generateTimetable = exports.getClassTimetable = exports.getScheduleById = exports.getAllSchedules = exports.createSchedule = void 0;
const scheduleService_1 = require("../services/scheduleService");
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
/**
 * Valide un timestamp ISO
 */
const validateISOTime = (time) => {
    if (!time) {
        return { valid: false, message: "Le temps est requis" };
    }
    try {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            return { valid: false, message: "Format ISO invalide" };
        }
        return { valid: true };
    }
    catch (error) {
        return { valid: false, message: "Format de temps invalide" };
    }
};
/**
 * @desc Crée un nouvel horaire - VERSION ISO
 */
const createSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { assignmentId, classId, dayOfWeek, startTime, endTime, classroom, recurrence, untilDate, notes, } = req.body;
        // Validation des champs requis
        if (!assignmentId || !classId || !dayOfWeek || !startTime || !endTime) {
            const response = {
                success: false,
                message: "Données manquantes: assignmentId, classId, dayOfWeek, startTime, endTime sont requis",
                code: "MISSING_REQUIRED_FIELDS",
            };
            res.status(400).json(response);
            return;
        }
        // Validation des formats ISO
        const startTimeValidation = validateISOTime(startTime);
        if (!startTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de startTime invalide: ${startTimeValidation.message}`,
                code: "INVALID_START_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        const endTimeValidation = validateISOTime(endTime);
        if (!endTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de endTime invalide: ${endTimeValidation.message}`,
                code: "INVALID_END_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        // Vérifier l'ordre des temps
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        if (endDate <= startDate) {
            const response = {
                success: false,
                message: "L'heure de fin doit être après l'heure de début",
                code: "INVALID_TIME_RANGE",
            };
            res.status(400).json(response);
            return;
        }
        // Vérifier la durée
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // minutes
        if (duration < 30) {
            const response = {
                success: false,
                message: "Durée minimale: 30 minutes",
                code: "MIN_DURATION_NOT_MET",
            };
            res.status(400).json(response);
            return;
        }
        if (duration > 240) {
            const response = {
                success: false,
                message: "Durée maximale: 4 heures",
                code: "MAX_DURATION_EXCEEDED",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.createSchedule({
            assignmentId,
            classId,
            dayOfWeek,
            startTime,
            endTime,
            classroom,
            recurrence,
            untilDate,
            notes,
        });
        // Créer le log d'audit avec les métadonnées disponibles
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_CREATED",
            entity: "Schedule",
            entityId: result.data?.schedule?.id || "",
            description: `Horaire créé: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"} - ${result.data?.schedule?.schoolClass?.name || "Inconnu"}`,
            status: "SUCCESS",
            metadata: result.metadata || {},
        });
        // Retourner la réponse avec métadonnées
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("ScheduleController - createSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_CREATION_ERROR",
            entity: "Schedule",
            description: "Erreur lors de la création de l'horaire",
            status: "ERROR",
            errorMessage: error.message,
            metadata: { errorCode: error.code },
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            data: error.data,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.createSchedule = createSchedule;
/**
 * @desc Récupère tous les horaires
 */
const getAllSchedules = async (req, res) => {
    try {
        const { page = "1", limit = "20", classId, professeurId, dayOfWeek, status, academicYearId, } = req.query;
        const result = await scheduleService_1.ScheduleService.getAllSchedules({
            page: parseInt(page),
            limit: parseInt(limit),
            classId: classId,
            professeurId: professeurId,
            dayOfWeek: dayOfWeek,
            status: status,
            academicYearId: academicYearId,
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - getAllSchedules error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getAllSchedules = getAllSchedules;
/**
 * @desc Récupère un horaire par ID
 */
const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await scheduleService_1.ScheduleService.getScheduleById(id);
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - getScheduleById error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getScheduleById = getScheduleById;
/**
 * @desc Récupère l'emploi du temps d'une classe
 */
const getClassTimetable = async (req, res) => {
    try {
        const { classId } = req.params;
        const { academicYearId } = req.query;
        if (!classId) {
            const response = {
                success: false,
                message: "classId est requis",
                code: "MISSING_CLASS_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.getClassTimetable(classId, academicYearId);
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - getClassTimetable error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getClassTimetable = getClassTimetable;
/**
 * @desc Génère un emploi du temps automatiquement
 */
const generateTimetable = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId, academicYearId, constraints } = req.body;
        if (!classId || !academicYearId) {
            const response = {
                success: false,
                message: "classId et academicYearId sont requis",
                code: "MISSING_REQUIRED_FIELDS",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.generateTimetable({
            classId,
            academicYearId,
            constraints,
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "TIMETABLE_GENERATED",
            entity: "Schedule",
            description: `Emploi du temps généré pour la classe ${classId}`,
            status: "SUCCESS",
            metadata: result.metadata || {},
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("ScheduleController - generateTimetable error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "TIMETABLE_GENERATION_ERROR",
            entity: "Schedule",
            description: "Erreur lors de la génération de l'emploi du temps",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.generateTimetable = generateTimetable;
/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
const getProfessorSchedule = async (req, res) => {
    try {
        const { professeurId } = req.params;
        const { startDate, endDate } = req.query;
        if (!professeurId) {
            const response = {
                success: false,
                message: "professeurId est requis",
                code: "MISSING_PROFESSEUR_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.getProfessorSchedule(professeurId, {
            startDate: startDate,
            endDate: endDate,
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - getProfessorSchedule error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getProfessorSchedule = getProfessorSchedule;
/**
 * @desc Vérifie les conflits d'horaire - VERSION ISO
 */
const checkConflicts = async (req, res) => {
    try {
        const { professeurId, classId, dayOfWeek, startTime, endTime, classroom, excludeScheduleId, } = req.query;
        // Validation des champs requis
        if (!professeurId || !classId || !dayOfWeek || !startTime || !endTime) {
            const response = {
                success: false,
                message: "professeurId, classId, dayOfWeek, startTime, endTime sont requis",
                code: "MISSING_REQUIRED_FIELDS",
            };
            res.status(400).json(response);
            return;
        }
        // Validation des formats ISO
        const startTimeValidation = validateISOTime(startTime);
        if (!startTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de startTime invalide: ${startTimeValidation.message}`,
                code: "INVALID_START_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        const endTimeValidation = validateISOTime(endTime);
        if (!endTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de endTime invalide: ${endTimeValidation.message}`,
                code: "INVALID_END_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.checkConflicts({
            professeurId: professeurId,
            classId: classId,
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
            classroom: classroom,
            excludeScheduleId: excludeScheduleId,
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - checkConflicts error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.checkConflicts = checkConflicts;
/**
 * @desc Récupère les créneaux disponibles
 */
const getAvailableTimeSlots = async (req, res) => {
    try {
        const { classId, dayOfWeek, professeurId, classroom } = req.query;
        const result = await scheduleService_1.ScheduleService.getAvailableTimeSlots({
            classId: classId,
            dayOfWeek: dayOfWeek,
            professeurId: professeurId,
            classroom: classroom,
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - getAvailableTimeSlots error:", error);
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getAvailableTimeSlots = getAvailableTimeSlots;
/**
 * @desc Met à jour un horaire - VERSION ISO
 */
const updateSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const { dayOfWeek, startTime, endTime, classroom, recurrence, untilDate, notes, status, } = req.body;
        // Validation si startTime est fourni
        if (startTime) {
            const startTimeValidation = validateISOTime(startTime);
            if (!startTimeValidation.valid) {
                const response = {
                    success: false,
                    message: `Format de startTime invalide: ${startTimeValidation.message}`,
                    code: "INVALID_START_TIME_FORMAT",
                };
                res.status(400).json(response);
                return;
            }
        }
        // Validation si endTime est fourni
        if (endTime) {
            const endTimeValidation = validateISOTime(endTime);
            if (!endTimeValidation.valid) {
                const response = {
                    success: false,
                    message: `Format de endTime invalide: ${endTimeValidation.message}`,
                    code: "INVALID_END_TIME_FORMAT",
                };
                res.status(400).json(response);
                return;
            }
        }
        // Vérifier l'ordre des temps si les deux sont fournis
        if (startTime && endTime) {
            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            if (endDate <= startDate) {
                const response = {
                    success: false,
                    message: "L'heure de fin doit être après l'heure de début",
                    code: "INVALID_TIME_RANGE",
                };
                res.status(400).json(response);
                return;
            }
            // Vérifier la durée
            const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
            if (duration < 30) {
                const response = {
                    success: false,
                    message: "Durée minimale: 30 minutes",
                    code: "MIN_DURATION_NOT_MET",
                };
                res.status(400).json(response);
                return;
            }
            if (duration > 240) {
                const response = {
                    success: false,
                    message: "Durée maximale: 4 heures",
                    code: "MAX_DURATION_EXCEEDED",
                };
                res.status(400).json(response);
                return;
            }
        }
        const result = await scheduleService_1.ScheduleService.updateSchedule(id, {
            dayOfWeek,
            startTime,
            endTime,
            classroom,
            recurrence,
            untilDate,
            notes,
            status,
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_UPDATED",
            entity: "Schedule",
            entityId: id,
            description: `Horaire modifié: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"}`,
            status: "SUCCESS",
            metadata: result.metadata || {},
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - updateSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_UPDATE_ERROR",
            entity: "Schedule",
            description: "Erreur lors de la mise à jour de l'horaire",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            data: error.data,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.updateSchedule = updateSchedule;
/**
 * @desc Supprime un horaire
 */
const deleteSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        if (!id) {
            const response = {
                success: false,
                message: "id est requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
            return;
        }
        const result = await scheduleService_1.ScheduleService.deleteSchedule(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_DELETED",
            entity: "Schedule",
            entityId: id,
            description: `Horaire supprimé: ${result.metadata?.subject || "Inconnu"} - ${result.metadata?.class || "Inconnu"}`,
            status: "SUCCESS",
            metadata: result.metadata || {},
        });
        const response = {
            success: result.success,
            message: result.message,
            data: result.data,
            code: result.code,
            metadata: result.metadata,
        };
        res.json(response);
    }
    catch (error) {
        console.error("ScheduleController - deleteSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_DELETION_ERROR",
            entity: "Schedule",
            description: "Erreur lors de la suppression de l'horaire",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(error.status || 500).json(response);
    }
};
exports.deleteSchedule = deleteSchedule;
//# sourceMappingURL=scheduleController.js.map