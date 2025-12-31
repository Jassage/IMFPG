/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps
 * @version 1.1.0 - Support ISO
 */

import { Request, Response } from "express";
import { ScheduleService } from "../services/scheduleService";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import { ApiResponse } from "../types/timetableTypes";

/**
 * Valide un timestamp ISO
 */
const validateISOTime = (
  time: string
): { valid: boolean; message?: string } => {
  if (!time) {
    return { valid: false, message: "Le temps est requis" };
  }

  try {
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return { valid: false, message: "Format ISO invalide" };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, message: "Format de temps invalide" };
  }
};

/**
 * @desc Crée un nouvel horaire - VERSION ISO
 */
export const createSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

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
    } = req.body;

    // Validation des champs requis
    if (!assignmentId || !classId || !dayOfWeek || !startTime || !endTime) {
      const response: ApiResponse = {
        success: false,
        message:
          "Données manquantes: assignmentId, classId, dayOfWeek, startTime, endTime sont requis",
        code: "MISSING_REQUIRED_FIELDS",
      };
      res.status(400).json(response);
      return;
    }

    // Validation des formats ISO
    const startTimeValidation = validateISOTime(startTime);
    if (!startTimeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: `Format de startTime invalide: ${startTimeValidation.message}`,
        code: "INVALID_START_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    const endTimeValidation = validateISOTime(endTime);
    if (!endTimeValidation.valid) {
      const response: ApiResponse = {
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
      const response: ApiResponse = {
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
      const response: ApiResponse = {
        success: false,
        message: "Durée minimale: 30 minutes",
        code: "MIN_DURATION_NOT_MET",
      };
      res.status(400).json(response);
      return;
    }

    if (duration > 240) {
      const response: ApiResponse = {
        success: false,
        message: "Durée maximale: 4 heures",
        code: "MAX_DURATION_EXCEEDED",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ScheduleService.createSchedule({
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
    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_CREATED",
      entity: "Schedule",
      entityId: result.data?.schedule?.id || "",
      description: `Horaire créé: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"} - ${result.data?.schedule?.schoolClass?.name || "Inconnu"}`,
      status: "SUCCESS",
      metadata: result.metadata || {},
    });

    // Retourner la réponse avec métadonnées
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
      metadata: { errorCode: error.code },
    });

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      data: error.data,
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
    } = req.query;

    const result = await ScheduleService.getAllSchedules({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      classId: classId as string,
      professeurId: professeurId as string,
      dayOfWeek: dayOfWeek as string,
      status: status as string,
      academicYearId: academicYearId as string,
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
    console.error("ScheduleController - getAllSchedules error:", error);

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
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

  try {
    const { classId, academicYearId, constraints } = req.body;

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
      metadata: result.metadata || {},
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
    });

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
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
    const { startDate, endDate } = req.query;

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
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Vérifie les conflits d'horaire - VERSION ISO
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
    if (!professeurId || !classId || !dayOfWeek || !startTime || !endTime) {
      const response: ApiResponse = {
        success: false,
        message:
          "professeurId, classId, dayOfWeek, startTime, endTime sont requis",
        code: "MISSING_REQUIRED_FIELDS",
      };
      res.status(400).json(response);
      return;
    }

    // Validation des formats ISO
    const startTimeValidation = validateISOTime(startTime as string);
    if (!startTimeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        message: `Format de startTime invalide: ${startTimeValidation.message}`,
        code: "INVALID_START_TIME_FORMAT",
      };
      res.status(400).json(response);
      return;
    }

    const endTimeValidation = validateISOTime(endTime as string);
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
      startTime: startTime as string,
      endTime: endTime as string,
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
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Met à jour un horaire - VERSION ISO
 */
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

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
    } = req.body;

    // Validation si startTime est fourni
    if (startTime) {
      const startTimeValidation = validateISOTime(startTime);
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
      const endTimeValidation = validateISOTime(endTime);
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

    // Vérifier l'ordre des temps si les deux sont fournis
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      if (endDate <= startDate) {
        const response: ApiResponse = {
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
        const response: ApiResponse = {
          success: false,
          message: "Durée minimale: 30 minutes",
          code: "MIN_DURATION_NOT_MET",
        };
        res.status(400).json(response);
        return;
      }

      if (duration > 240) {
        const response: ApiResponse = {
          success: false,
          message: "Durée maximale: 4 heures",
          code: "MAX_DURATION_EXCEEDED",
        };
        res.status(400).json(response);
        return;
      }
    }

    const result = await ScheduleService.updateSchedule(id, {
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      recurrence,
      untilDate,
      notes,
      status,
    });

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_UPDATED",
      entity: "Schedule",
      entityId: id,
      description: `Horaire modifié: ${result.data?.schedule?.classAssignment?.subject?.name || "Inconnu"}`,
      status: "SUCCESS",
      metadata: result.metadata || {},
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
    });

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
      data: error.data,
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

  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "id est requis",
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
      description: `Horaire supprimé: ${(result.metadata as any)?.subject || "Inconnu"} - ${(result.metadata as any)?.class || "Inconnu"}`,
      status: "SUCCESS",
      metadata: result.metadata || {},
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
    });

    const response: ApiResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};
