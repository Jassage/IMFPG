"use strict";
/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps avec support de formats multiples
 * @version 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateSchedule = exports.getAvailableTimeSlots = exports.checkConflicts = exports.getProfessorSchedule = exports.generateTimetable = exports.getClassTimetable = exports.getScheduleById = exports.getAllSchedules = exports.createSchedule = void 0;
const scheduleService_1 = require("../services/scheduleService");
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
/**
 * Valide et parse un temps (support HH:MM, HH:MM:SS, ISO)
 */
const validateAndParseTime = (time) => {
    if (!time || typeof time !== "string") {
        return {
            valid: false,
            message: "Le temps est requis et doit être une chaîne",
        };
    }
    try {
        // Essayer de parser avec le service
        const parsed = scheduleService_1.ScheduleService.parseTime(time);
        return {
            valid: true,
            time: parsed.time, // HH:MM:SS formaté
            isoTime: `2000-01-01T${parsed.time}Z`, // ISO pour l'API
            displayTime: scheduleService_1.ScheduleService.formatTimeForDisplay(time),
        };
    }
    catch (error) {
        return {
            valid: false,
            message: error.message || "Format de temps invalide",
        };
    }
};
/**
 * Valide la durée d'un créneau
 */
const validateDuration = (startTime, endTime) => {
    try {
        const start = new Date(`2000-01-01T${startTime}Z`);
        const end = new Date(`2000-01-01T${endTime}Z`);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { valid: false, message: "Temps invalide" };
        }
        const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
        if (duration <= 0) {
            return {
                valid: false,
                message: "L'heure de fin doit être après l'heure de début",
            };
        }
        if (duration < 30) {
            return { valid: false, message: "Durée minimale: 30 minutes" };
        }
        if (duration > 240) {
            return { valid: false, message: "Durée maximale: 4 heures" };
        }
        return { valid: true, duration };
    }
    catch {
        return { valid: false, message: "Erreur de calcul de durée" };
    }
};
/**
 * @desc Crée un nouvel horaire
 */
const createSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    const userId = auditData.userId || "system";
    try {
        const { assignmentId, classId, dayOfWeek, startTime, endTime, classroom, recurrence, untilDate, notes, } = req.body;
        // Validation des champs requis
        const requiredFields = {
            assignmentId,
            classId,
            dayOfWeek,
            startTime,
            endTime,
        };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);
        if (missingFields.length > 0) {
            const response = {
                success: false,
                message: `Champs manquants: ${missingFields.join(", ")}`,
                code: "MISSING_REQUIRED_FIELDS",
                metadata: { missingFields },
            };
            res.status(400).json(response);
            return;
        }
        // Validation des formats de temps
        const startTimeValidation = validateAndParseTime(startTime);
        if (!startTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de startTime invalide: ${startTimeValidation.message}`,
                code: "INVALID_START_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        const endTimeValidation = validateAndParseTime(endTime);
        if (!endTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de endTime invalide: ${endTimeValidation.message}`,
                code: "INVALID_END_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        // Validation de la durée
        const durationValidation = validateDuration(startTimeValidation.time, endTimeValidation.time);
        if (!durationValidation.valid) {
            const response = {
                success: false,
                message: durationValidation.message || "Durée invalide",
                code: "INVALID_DURATION",
            };
            res.status(400).json(response);
            return;
        }
        // Préparer les données pour le service
        const scheduleData = {
            assignmentId,
            classId,
            dayOfWeek: dayOfWeek.toUpperCase(),
            startTime: startTimeValidation.isoTime,
            endTime: endTimeValidation.isoTime,
            classroom: classroom?.trim(),
            recurrence: recurrence?.trim(),
            untilDate: untilDate?.trim(),
            notes: notes?.trim(),
        };
        const result = await scheduleService_1.ScheduleService.createSchedule(scheduleData);
        // Créer le log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_CREATED",
            entity: "Schedule",
            entityId: result.data?.schedule?.id || "",
            description: `Horaire créé: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"} - ${result.data?.schedule?.schoolClass?.name || "Inconnu"}`,
            status: "SUCCESS",
            metadata: {
                ...result.metadata,
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            },
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
        console.error("ScheduleController - createSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_CREATION_ERROR",
            entity: "Schedule",
            description: "Erreur lors de la création de l'horaire",
            status: "ERROR",
            errorMessage: error.message,
            metadata: {
                errorCode: error.code,
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
                requestBody: req.body,
            },
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            data: error.data,
            metadata: error.metadata,
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
        const { page = "1", limit = "20", classId, professeurId, dayOfWeek, status, academicYearId, classroom, subject, startDate, endDate, } = req.query;
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit),
            classId: classId,
            professeurId: professeurId,
            dayOfWeek: dayOfWeek,
            status: status,
            academicYearId: academicYearId,
            classroom: classroom,
            subject: subject,
            startDate: startDate,
            endDate: endDate,
        };
        const result = await scheduleService_1.ScheduleService.getAllSchedules(filters);
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
            metadata: error.metadata,
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
        if (!id) {
            const response = {
                success: false,
                message: "ID de l'horaire requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
            return;
        }
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
            metadata: error.metadata,
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
            metadata: error.metadata,
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
    const userId = auditData.userId || "system";
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
            metadata: {
                ...result.metadata,
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            },
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
            metadata: {
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
                requestBody: req.body,
            },
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            metadata: error.metadata,
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
        const { startDate, endDate, status } = req.query;
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
            status: status,
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
            metadata: error.metadata,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getProfessorSchedule = getProfessorSchedule;
/**
 * @desc Vérifie les conflits d'horaire
 */
const checkConflicts = async (req, res) => {
    try {
        const { professeurId, classId, dayOfWeek, startTime, endTime, classroom, excludeScheduleId, } = req.query;
        // Validation des champs requis
        const requiredParams = {
            professeurId,
            classId,
            dayOfWeek,
            startTime,
            endTime,
        };
        const missingParams = Object.entries(requiredParams)
            .filter(([_, value]) => !value)
            .map(([key]) => key);
        if (missingParams.length > 0) {
            const response = {
                success: false,
                message: `Paramètres manquants: ${missingParams.join(", ")}`,
                code: "MISSING_REQUIRED_PARAMS",
            };
            res.status(400).json(response);
            return;
        }
        // Validation des formats de temps
        const startTimeValidation = validateAndParseTime(startTime);
        if (!startTimeValidation.valid) {
            const response = {
                success: false,
                message: `Format de startTime invalide: ${startTimeValidation.message}`,
                code: "INVALID_START_TIME_FORMAT",
            };
            res.status(400).json(response);
            return;
        }
        const endTimeValidation = validateAndParseTime(endTime);
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
            startTime: startTimeValidation.isoTime,
            endTime: endTimeValidation.isoTime,
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
            metadata: error.metadata,
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
            metadata: error.metadata,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.getAvailableTimeSlots = getAvailableTimeSlots;
/**
 * @desc Met à jour un horaire
 */
const updateSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    const userId = auditData.userId || "system";
    try {
        const { id } = req.params;
        const { dayOfWeek, startTime, endTime, classroom, recurrence, untilDate, notes, status, } = req.body;
        if (!id) {
            const response = {
                success: false,
                message: "ID de l'horaire requis",
                code: "MISSING_ID",
            };
            res.status(400).json(response);
            return;
        }
        // Validation si startTime est fourni
        if (startTime) {
            const startTimeValidation = validateAndParseTime(startTime);
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
            const endTimeValidation = validateAndParseTime(endTime);
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
        // Si les deux temps sont fournis, vérifier la durée
        if (startTime && endTime) {
            const startTimeValidation = validateAndParseTime(startTime);
            const endTimeValidation = validateAndParseTime(endTime);
            if (startTimeValidation.valid && endTimeValidation.valid) {
                const durationValidation = validateDuration(startTimeValidation.time, endTimeValidation.time);
                if (!durationValidation.valid) {
                    const response = {
                        success: false,
                        message: durationValidation.message || "Durée invalide",
                        code: "INVALID_DURATION",
                    };
                    res.status(400).json(response);
                    return;
                }
            }
        }
        // Préparer les données pour le service
        const updateData = {};
        if (dayOfWeek !== undefined)
            updateData.dayOfWeek = dayOfWeek.toUpperCase();
        if (startTime !== undefined)
            updateData.startTime = startTime;
        if (endTime !== undefined)
            updateData.endTime = endTime;
        if (classroom !== undefined)
            updateData.classroom = classroom?.trim();
        if (recurrence !== undefined)
            updateData.recurrence = recurrence?.trim();
        if (untilDate !== undefined)
            updateData.untilDate = untilDate?.trim();
        if (notes !== undefined)
            updateData.notes = notes?.trim();
        if (status !== undefined)
            updateData.status = status;
        const result = await scheduleService_1.ScheduleService.updateSchedule(id, updateData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "SCHEDULE_UPDATED",
            entity: "Schedule",
            entityId: id,
            description: `Horaire modifié: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"}`,
            status: "SUCCESS",
            metadata: {
                ...result.metadata,
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
                updatedFields: Object.keys(updateData),
            },
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
            metadata: {
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
                requestBody: req.body,
            },
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            data: error.data,
            metadata: error.metadata,
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
    const userId = auditData.userId || "system";
    try {
        const { id } = req.params;
        if (!id) {
            const response = {
                success: false,
                message: "ID de l'horaire requis",
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
            metadata: {
                ...result.metadata,
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            },
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
            metadata: {
                userId,
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
                scheduleId: req.params.id,
            },
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
            metadata: error.metadata,
        };
        res.status(error.status || 500).json(response);
    }
};
exports.deleteSchedule = deleteSchedule;
//# sourceMappingURL=scheduleController.js.map