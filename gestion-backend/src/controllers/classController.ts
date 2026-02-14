/**
 * @file classController.ts
 * @description Contrôleurs pour la gestion des classes
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  ClassService,
  ClassFilters,
  CreateClassData,
  UpdateClassData,
} from "../services/classService";

const classService = new ClassService();

// Interface pour les réponses
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des classes
 */
export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: ClassFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      level: req.query.level as string,
      academicYearId: req.query.academicYearId as string,
      status: (req.query.status as string) || "Active",
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await classService.getClasses(filters, auditData);

    await createAuditLog({
      ...auditData,
      action: "CLASSES_LIST_REQUEST",
      entity: "SchoolClass",
      description: "Liste des classes récupérée",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASSES_LIST_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération des classes",
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
 * @desc Récupère une classe par ID
 */
export const getClassById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await classService.getClassById(id, auditData);

    if (!result.success && result.code === "CLASS_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_DETAILS_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Détails de la classe récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_DETAILS_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération de la classe",
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
 * @desc Crée une nouvelle classe
 */
export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateClassData = req.body;
    const result = await classService.createClass(data, auditData);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_CREATED",
      entity: "SchoolClass",
      entityId: result.data?.class?.id,
      description: `Classe "${data.name}" créée`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_CREATION_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la création de la classe",
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
 * @desc Met à jour une classe
 */
export const updateClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateClassData = req.body;
    const result = await classService.updateClass(id, data, auditData);

    if (!result.success) {
      const statusCode = result.code === "CLASS_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_UPDATED",
      entity: "SchoolClass",
      entityId: id,
      description: `Classe mise à jour`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_UPDATE_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la mise à jour de la classe",
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
 * @desc Supprime (désactive) une classe
 */
export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await classService.deleteClass(id, auditData);

    if (!result.success) {
      const statusCode = result.code === "CLASS_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_DELETED",
      entity: "SchoolClass",
      entityId: id,
      description: `Classe désactivée`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_DELETION_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la suppression de la classe",
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
 * @desc Récupère les statistiques d'une classe
 */
export const getClassStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await classService.getClassStats(id, auditData);

    if (!result.success && result.code === "CLASS_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_STATS_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Statistiques de la classe récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_STATS_ERROR",
      entity: "SchoolClass",
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
 * @desc Récupère les étudiants d'une classe
 */
export const getClassStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await classService.getClassStudents(id, auditData);

    await createAuditLog({
      ...auditData,
      action: "CLASS_STUDENTS_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Étudiants de la classe récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_STUDENTS_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération des étudiants",
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
 * @desc Récupère l'emploi du temps d'une classe
 */
export const getClassSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await classService.getClassSchedule(id, auditData);

    await createAuditLog({
      ...auditData,
      action: "CLASS_SCHEDULE_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Emploi du temps de la classe récupéré",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_SCHEDULE_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération de l'emploi du temps",
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
 * @desc Récupère toutes les classes disponibles
 */
export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await classService.getAllClasses(auditData);

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
 * @desc Récupère les niveaux de classe disponibles
 */
export const getClassLevels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await classService.getClassLevels(auditData);

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
 * @desc Récupère les statistiques générales des classes
 */
export const getOverallClassStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await classService.getOverallClassStats(auditData);

    await createAuditLog({
      ...auditData,
      action: "OVERALL_CLASS_STATS_REQUEST",
      entity: "SchoolClass",
      description: "Statistiques générales des classes récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "OVERALL_CLASS_STATS_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération des statistiques générales",
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
