/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps avec support de formats multiples
 * @version 2.0.0
 */

import { Request, Response } from "express";
import { ScheduleService } from "../services/scheduleService";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  ApiResponse,
  CreateScheduleData,
  UpdateScheduleData,
  GenerateTimetableData,
  ScheduleFilters,
} from "../types/timetableTypes";

/**
 * Valide et parse un temps (support HH:MM, HH:MM:SS, ISO)
 */
const validateAndParseTime = (
  time: string
): {
  valid: boolean;
  time?: string;
  isoTime?: string;
  message?: string;
  displayTime?: string;
} => {
  if (!time || typeof time !== "string") {
    return {
      valid: false,
      message: "Le temps est requis et doit être une chaîne",
    };
  }

  try {
    // Essayer de parser avec le service
    const parsed = ScheduleService.parseTime(time);

    return {
      valid: true,
      time: parsed.time, // HH:MM:SS formaté
      isoTime: `2000-01-01T${parsed.time}Z`, // ISO pour l'API
      displayTime: ScheduleService.formatTimeForDisplay(time),
    };
  } catch (error: any) {
    return {
      valid: false,
      message: error.message || "Format de temps invalide",
    };
  }
};

/**
 * Valide la durée d'un créneau
 */
const validateDuration = (
  startTime: string,
  endTime: string
): { valid: boolean; message?: string; duration?: number } => {
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
  } catch {
    return { valid: false, message: "Erreur de calcul de durée" };
  }
};

/**
 * @desc Crée un nouvel horaire
 */
export const createSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const userId = auditData.userId || "system";

  try {
    const {
      assignmentId,
      classId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      recurrence,
      untilDate,
      notes,
    } = req.body as CreateScheduleData;

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
      const response: ApiResponse = {
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
      const response: ApiResponse = {
        success: false,
        message: `Format de startTime invalide: ${startTimeValidation.message}`,
        code: "INVALID_START_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    const endTimeValidation = validateAndParseTime(endTime);
    if (!endTimeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: `Format de endTime invalide: ${endTimeValidation.message}`,
        code: "INVALID_END_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    // Validation de la durée
    const durationValidation = validateDuration(
      startTimeValidation.time!,
      endTimeValidation.time!
    );

    if (!durationValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: durationValidation.message || "Durée invalide",
        code: "INVALID_DURATION",
      };
      res.status(400).json(response);
      return;
    }

    // Préparer les données pour le service
    const scheduleData: CreateScheduleData = {
      assignmentId,
      classId,
      dayOfWeek: dayOfWeek.toUpperCase(),
      startTime: startTimeValidation.isoTime!,
      endTime: endTimeValidation.isoTime!,
      classroom: classroom?.trim(),
      recurrence: recurrence?.trim(),
      untilDate: untilDate?.trim(),
      notes: notes?.trim(),
    };

    const result = await ScheduleService.createSchedule(scheduleData);

    // Créer le log d'audit
    await createAuditLog({
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

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("ScheduleController - createSchedule error:", error);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      data: error.data,
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère tous les horaires
 */
export const getAllSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "20",
      classId,
      professeurId,
      dayOfWeek,
      status,
      academicYearId,
      classroom,
      subject,
      startDate,
      endDate,
    } = req.query;

    const filters: ScheduleFilters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      classId: classId as string,
      professeurId: professeurId as string,
      dayOfWeek: dayOfWeek as string,
      status: status as string,
      academicYearId: academicYearId as string,
      classroom: classroom as string,
      subject: subject as string,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const result = await ScheduleService.getAllSchedules(filters);

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - getAllSchedules error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère un horaire par ID
 */
export const getScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "ID de l'horaire requis",
        code: "MISSING_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.getScheduleById(id);

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - getScheduleById error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère l'emploi du temps d'une classe
 */
export const getClassTimetable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { academicYearId } = req.query;

    if (!classId) {
      const response: ApiResponse = {
        success: false,
        message: "classId est requis",
        code: "MISSING_CLASS_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.getClassTimetable(
      classId,
      academicYearId as string
    );

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - getClassTimetable error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Génère un emploi du temps automatiquement
 */
export const generateTimetable = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const userId = auditData.userId || "system";

  try {
    const { classId, academicYearId, constraints } =
      req.body as GenerateTimetableData;

    if (!classId || !academicYearId) {
      const response: ApiResponse = {
        success: false,
        message: "classId et academicYearId sont requis",
        code: "MISSING_REQUIRED_FIELDS",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.generateTimetable({
      classId,
      academicYearId,
      constraints,
    });

    await createAuditLog({
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

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("ScheduleController - generateTimetable error:", error);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
export const getProfessorSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { professeurId } = req.params;
    const { startDate, endDate, status } = req.query;

    if (!professeurId) {
      const response: ApiResponse = {
        success: false,
        message: "professeurId est requis",
        code: "MISSING_PROFESSEUR_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.getProfessorSchedule(professeurId, {
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
    });

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - getProfessorSchedule error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Vérifie les conflits d'horaire
 */
export const checkConflicts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      professeurId,
      classId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      excludeScheduleId,
    } = req.query;

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
      const response: ApiResponse = {
        success: false,
        message: `Paramètres manquants: ${missingParams.join(", ")}`,
        code: "MISSING_REQUIRED_PARAMS",
      };
      res.status(400).json(response);
      return;
    }

    // Validation des formats de temps
    const startTimeValidation = validateAndParseTime(startTime as string);
    if (!startTimeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: `Format de startTime invalide: ${startTimeValidation.message}`,
        code: "INVALID_START_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    const endTimeValidation = validateAndParseTime(endTime as string);
    if (!endTimeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: `Format de endTime invalide: ${endTimeValidation.message}`,
        code: "INVALID_END_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.checkConflicts({
      professeurId: professeurId as string,
      classId: classId as string,
      dayOfWeek: dayOfWeek as string,
      startTime: startTimeValidation.isoTime!,
      endTime: endTimeValidation.isoTime!,
      classroom: classroom as string,
      excludeScheduleId: excludeScheduleId as string,
    });

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - checkConflicts error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère les créneaux disponibles
 */
export const getAvailableTimeSlots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId, dayOfWeek, professeurId, classroom } = req.query;

    const result = await ScheduleService.getAvailableTimeSlots({
      classId: classId as string,
      dayOfWeek: dayOfWeek as string,
      professeurId: professeurId as string,
      classroom: classroom as string,
    });

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - getAvailableTimeSlots error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Met à jour un horaire
 */
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const userId = auditData.userId || "system";

  try {
    const { id } = req.params;
    const {
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      recurrence,
      untilDate,
      notes,
      status,
    } = req.body as UpdateScheduleData;

    if (!id) {
      const response: ApiResponse = {
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
        const response: ApiResponse = {
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
        const response: ApiResponse = {
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
        const durationValidation = validateDuration(
          startTimeValidation.time!,
          endTimeValidation.time!
        );

        if (!durationValidation.valid) {
          const response: ApiResponse = {
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
    const updateData: UpdateScheduleData = {};

    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek.toUpperCase();
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (classroom !== undefined) updateData.classroom = classroom?.trim();
    if (recurrence !== undefined) updateData.recurrence = recurrence?.trim();
    if (untilDate !== undefined) updateData.untilDate = untilDate?.trim();
    if (notes !== undefined) updateData.notes = notes?.trim();
    if (status !== undefined) updateData.status = status;

    const result = await ScheduleService.updateSchedule(id, updateData);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - updateSchedule error:", error);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      data: error.data,
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Supprime un horaire
 */
export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const userId = auditData.userId || "system";

  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "ID de l'horaire requis",
        code: "MISSING_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.deleteSchedule(id);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    console.error("ScheduleController - deleteSchedule error:", error);

    await createAuditLog({
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

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      metadata: error.metadata,
    };

    res.status(error.status || 500).json(response);
  }
};
