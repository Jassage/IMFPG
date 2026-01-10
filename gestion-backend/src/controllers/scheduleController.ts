/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps avec support de formats multiples
 * @version 3.0.0
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

// Instance du service
const scheduleService = new ScheduleService();

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
    // Utiliser le service pour parser
    const parsed = scheduleService["parseTime"](time); // Accès à la méthode privée via bracket notation

    return {
      valid: true,
      time: parsed.time, // HH:MM:SS formaté
      isoTime: `2000-01-01T${parsed.time}Z`, // ISO pour l'API
      displayTime: scheduleService["formatTimeForDisplay"](time),
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
 * Gère les erreurs du contrôleur
 */
const handleControllerError = (
  error: any,
  res: Response,
  auditData?: any,
  auditContext?: {
    action: string;
    entity: string;
    description: string;
    entityId?: string;
    requestBody?: any;
  }
): void => {
  console.error("ScheduleController error:", error);

  // Créer log d'audit si nécessaire
  if (auditData && auditContext) {
    createAuditLog({
      ...auditData,
      action: auditContext.action,
      entity: auditContext.entity,
      entityId: auditContext.entityId,
      description: auditContext.description,
      status: "ERROR",
      errorMessage: error.message,
      metadata: {
        errorCode: error.code,
        userId: auditData.userId,
        requestBody: auditContext.requestBody,
      },
    }).catch(console.error);
  }

  const response: ApiResponse = {
    success: false,
    message: error.message || "Erreur interne du serveur",
    code: error.code || "INTERNAL_ERROR",
    data: error.data,
    metadata: error.metadata,
  };

  res.status(error.status || 500).json(response);
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

    const result = await scheduleService.createSchedule(scheduleData);

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
    handleControllerError(error, res, auditData, {
      action: "SCHEDULE_CREATION_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la création de l'horaire",
      requestBody: req.body,
    });
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

    const result = await scheduleService.getAllSchedules(filters);

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    handleControllerError(error, res);
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

    const result = await scheduleService.getScheduleById(id);

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      data: result.data,
      code: result.code,
      metadata: result.metadata,
    };

    res.json(response);
  } catch (error: any) {
    handleControllerError(error, res);
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

    const result = await scheduleService.getClassTimetable(
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
    handleControllerError(error, res);
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

    const result = await scheduleService.generateTimetable({
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
    handleControllerError(error, res, auditData, {
      action: "TIMETABLE_GENERATION_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la génération de l'emploi du temps",
      requestBody: req.body,
    });
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

    const result = await scheduleService.getAllSchedules({
      professeurId: professeurId,
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
    handleControllerError(error, res);
  }
};

/**
 * @desc Vérifie les conflits d'horaire
 */
// Dans scheduleController.ts - ligne ~250
// Dans scheduleController.ts - corriger checkConflicts
export const checkConflicts = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🔍 Check conflicts called with params:", req.query);

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

    // Validation des paramètres
    if (!professeurId || !classId || !dayOfWeek || !startTime || !endTime) {
      const response: ApiResponse = {
        success: true, // Toujours retourner success: true pour cette route
        message: "Paramètres insuffisants pour vérifier les conflits",
        data: { hasConflict: false, conflicts: [] },
        code: "CHECK_COMPLETED",
      };
      res.status(200).json(response);
      return;
    }

    // CORRECTION : Appeler la méthode avec les bonnes valeurs
    const result = await scheduleService.checkScheduleConflicts(
      professeurId as string,
      classId as string,
      dayOfWeek as string,
      startTime as string, // Le service doit gérer le format ISO
      endTime as string, // Le service doit gérer le format ISO
      classroom as string,
      excludeScheduleId as string
    );

    console.log("✅ Check conflicts result:", result);

    const response: ApiResponse = {
      success: true,
      message: "Vérification des conflits terminée",
      data: result, // Retourner directement le résultat du service
      code: "CHECK_COMPLETED",
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("❌ Check conflicts error:", error);

    // IMPORTANT: Toujours retourner 200 avec success: false
    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur lors de la vérification des conflits",
      data: {
        hasConflict: false,
        conflicts: [],
      },
      code: "CHECK_ERROR",
    };

    res.status(200).json(response); // Toujours 200, jamais 404
  }
};

/**
 * @desc Récupère les créneaux disponibles
 * @todo Implement getAvailableTimeSlots method in ScheduleService
 */
export const getAvailableTimeSlots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response: ApiResponse = {
      success: false,
      message: "Fonctionnalité non implémentée",
      code: "NOT_IMPLEMENTED",
      data: null,
    };

    res.status(501).json(response);
  } catch (error: any) {
    handleControllerError(error, res);
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

    const result = await scheduleService.updateSchedule(id, updateData);

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
    handleControllerError(error, res, auditData, {
      action: "SCHEDULE_UPDATE_ERROR",
      entity: "Schedule",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour de l'horaire",
      requestBody: req.body,
    });
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

    const result = await scheduleService.deleteSchedule(id);

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
    handleControllerError(error, res, auditData, {
      action: "SCHEDULE_DELETION_ERROR",
      entity: "Schedule",
      entityId: req.params.id,
      description: "Erreur lors de la suppression de l'horaire",
    });
  }
};
