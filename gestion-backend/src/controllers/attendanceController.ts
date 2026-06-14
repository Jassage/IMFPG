/**
 * @file attendanceController.ts
 * @description Contrôleurs pour la gestion des présences
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  AttendanceService,
  AttendanceFilters,
  CreateAttendanceData,
  UpdateAttendanceData,
  CreateAttendanceSessionData,
  UpdateAttendanceSessionData,
  AttendanceStatsFilters,
} from "../services/attendanceService";

const attendanceService = new AttendanceService();

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des présences
 */
export const getAttendances = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: AttendanceFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      studentId: req.query.studentId as string,
      classId: req.query.classId as string,
      academicYearId: req.query.academicYearId as string,
      status: req.query.status as string,
      validationStatus: req.query.validationStatus as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      session: req.query.session as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await attendanceService.getAttendances(filters, auditData);

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_LIST_REQUEST",
      entity: "Attendance",
      description: "Liste des présences récupérée",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_LIST_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la récupération des présences",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère une présence par ID
 */
export const getAttendanceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await attendanceService.getAttendanceById(id, auditData);

    if (!result.success && result.code === "ATTENDANCE_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_DETAILS_REQUEST",
      entity: "Attendance",
      entityId: id,
      description: "Détails de la présence récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_DETAILS_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la récupération de la présence",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée une nouvelle présence
 */
export const createAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateAttendanceData = {
      ...req.body,
      createdById: auditData.userId,
    };
    const result = await attendanceService.createAttendance(data, auditData);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_CREATED",
      entity: "Attendance",
      entityId: result.data?.attendance?.id,
      description: `Présence enregistrée pour l'étudiant`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_CREATION_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la création de la présence",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour une présence
 */
export const updateAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateAttendanceData = req.body;
    const result = await attendanceService.updateAttendance(
      id,
      data,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "ATTENDANCE_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_UPDATED",
      entity: "Attendance",
      entityId: id,
      description: `Présence mise à jour`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_UPDATE_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la mise à jour de la présence",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Valide une présence
 */
export const validateAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { validationStatus, notes } = req.body;

    if (!auditData.userId) {
      const response: ApiResponse = {
        success: false,
        message: "User ID not found in audit data",
        code: "INVALID_USER",
      };
      res.status(400).json(response);
      return;
    }

    const result = await attendanceService.validateAttendance(
      id,
      validationStatus,
      auditData.userId,
      notes,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "ATTENDANCE_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_VALIDATED",
      entity: "Attendance",
      entityId: id,
      description: `Présence ${validationStatus.toLowerCase()}`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_VALIDATION_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la validation de la présence",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Justifie une absence/retard
 */
export const justifyAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { justification, justificationType, justificationDoc } = req.body;

    const result = await attendanceService.justifyAttendance(
      id,
      justification,
      justificationType,
      justificationDoc,
      auditData.userId || undefined,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "ATTENDANCE_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_JUSTIFIED",
      entity: "Attendance",
      entityId: id,
      description: `Présence justifiée`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_JUSTIFICATION_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la justification",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Enregistre une présence avec scan (QR code, etc.)
 */
export const recordAttendanceByScan = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentCode, classId, session, date } = req.body;

    if (!auditData.userId) {
      const response: ApiResponse = {
        success: false,
        message: "User ID not found in audit data",
        code: "INVALID_USER",
      };
      res.status(400).json(response);
      return;
    }

    const result = await attendanceService.recordAttendanceByScan(
      studentCode,
      classId,
      session,
      date ? new Date(date) : new Date(),
      auditData.userId,
      auditData,
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SCAN_RECORDED",
      entity: "Attendance",
      description: `Présence enregistrée par scan`,
      status: "SUCCESS",
    });

    res.status(201).json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SCAN_ERROR",
      entity: "Attendance",
      description: "Erreur lors de l'enregistrement par scan",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les statistiques de présence
 */
export const getAttendanceStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: AttendanceStatsFilters = {
      studentId: req.query.studentId as string,
      classId: req.query.classId as string,
      academicYearId: req.query.academicYearId as string,
      month: req.query.month ? parseInt(req.query.month as string) : undefined,
      year: req.query.year
        ? parseInt(req.query.year as string)
        : new Date().getFullYear(),
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    const result = await attendanceService.getAttendanceStats(
      filters,
      auditData,
    );

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_STATS_REQUEST",
      entity: "Attendance",
      description: "Statistiques de présence récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_STATS_ERROR",
      entity: "Attendance",
      description: "Erreur lors de la récupération des statistiques",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les présences par classe
 */
export const getClassAttendances = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classId } = req.params;
    const { date } = req.query;

    const result = await attendanceService.getClassAttendances(
      classId,
      date ? new Date(date as string) : new Date(),
      auditData,
    );

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

// ==================== SESSIONS ====================

/**
 * @desc Récupère la liste des sessions de présence
 */
export const getAttendanceSessions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      classId: req.query.classId as string,
      subjectId: req.query.subjectId as string,
      professeurId: req.query.professeurId as string,
      academicYearId: req.query.academicYearId as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      isCompleted: req.query.isCompleted === "true",
      isCancelled: req.query.isCancelled === "true",
    };

    const result = await attendanceService.getAttendanceSessions(
      filters,
      auditData,
    );

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée une nouvelle session de présence
 */
export const createAttendanceSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateAttendanceSessionData = {
      ...req.body,
      createdById: auditData.userId,
    };
    const result = await attendanceService.createAttendanceSession(
      data,
      auditData,
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_CREATED",
      entity: "AttendanceSession",
      entityId: result.data?.session?.id,
      description: `Session de présence créée`,
      status: "SUCCESS",
    });

    res.status(201).json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_CREATION_ERROR",
      entity: "AttendanceSession",
      description: "Erreur lors de la création de la session",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour une session de présence
 */
export const updateAttendanceSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateAttendanceSessionData = req.body;
    const result = await attendanceService.updateAttendanceSession(
      id,
      data,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "SESSION_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_UPDATED",
      entity: "AttendanceSession",
      entityId: id,
      description: `Session de présence mise à jour`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_UPDATE_ERROR",
      entity: "AttendanceSession",
      description: "Erreur lors de la mise à jour de la session",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Marque une session comme terminée
 */
export const completeAttendanceSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await attendanceService.completeAttendanceSession(
      id,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "SESSION_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_COMPLETED",
      entity: "AttendanceSession",
      entityId: id,
      description: `Session de présence terminée`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_COMPLETE_ERROR",
      entity: "AttendanceSession",
      description: "Erreur lors de la completion de la session",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Annule une session de présence
 */
export const cancelAttendanceSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const result = await attendanceService.cancelAttendanceSession(
      id,
      cancellationReason,
      auditData,
    );

    if (!result.success) {
      const statusCode = result.code === "SESSION_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_CANCELLED",
      entity: "AttendanceSession",
      entityId: id,
      description: `Session de présence annulée`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SESSION_CANCEL_ERROR",
      entity: "AttendanceSession",
      description: "Erreur lors de l'annulation de la session",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les présences d'une session
 */
export const getSessionAttendances = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { sessionId } = req.params;
    const result = await attendanceService.getSessionAttendances(
      sessionId,
      auditData,
    );

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

// ==================== APPEL PAR SÉANCE (PROFESSEUR) ====================

/**
 * @desc Ouvre (ou récupère) la séance d'un cours pour faire l'appel
 */
export const openAttendanceSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateAttendanceSessionData = {
      ...req.body,
      createdById: auditData.userId,
    };
    const result = await attendanceService.getOrCreateSession(data, auditData);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(result.data?.created ? 201 : 200).json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère le roster (liste d'élèves + statut) d'une séance
 */
export const getSessionRoster = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { sessionId } = req.params;
    const result = await attendanceService.getSessionRoster(
      sessionId,
      auditData,
    );

    if (!result.success) {
      res.status(result.code === "SESSION_NOT_FOUND" ? 404 : 400).json(result);
      return;
    }

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Enregistre l'appel d'une séance (statut définitif)
 */
export const saveSessionAttendance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { sessionId } = req.params;
    const { entries } = req.body;
    const result = await attendanceService.saveSessionAttendance(
      sessionId,
      entries,
      auditData.userId ?? undefined,
      auditData,
    );

    if (!result.success) {
      res.status(result.code === "SESSION_NOT_FOUND" ? 404 : 400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_ROLLCALL_SAVED",
      entity: "AttendanceSession",
      entityId: sessionId,
      description: `Appel enregistré (${result.data?.count} élèves)`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_ROLLCALL_ERROR",
      entity: "AttendanceSession",
      description: "Erreur lors de l'enregistrement de l'appel",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

// ==================== STATISTIQUES GÉNÉRALES ====================

/**
 * @desc Récupère les statistiques générales de présence
 */
export const getOverallAttendanceStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { academicYearId } = req.query;

    const result = await attendanceService.getOverallAttendanceStats(
      academicYearId as string,
      auditData,
    );

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les paramètres de présence
 */
export const getAttendanceSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await attendanceService.getAttendanceSettings(auditData);

    res.json(result);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour les paramètres de présence
 */
export const updateAttendanceSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    if (!auditData.userId) {
      const response: ApiResponse = {
        success: false,
        message: "User ID not found in audit data",
        code: "INVALID_USER",
      };
      res.status(400).json(response);
      return;
    }

    const data = req.body;
    const result = await attendanceService.updateAttendanceSettings(
      data,
      auditData.userId,
      auditData,
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SETTINGS_UPDATED",
      entity: "AttendanceSettings",
      description: `Paramètres de présence mis à jour`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ATTENDANCE_SETTINGS_UPDATE_ERROR",
      entity: "AttendanceSettings",
      description: "Erreur lors de la mise à jour des paramètres",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
