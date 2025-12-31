/**
 * @file subjectController.ts
 * @description Contrôleurs pour la gestion des matières
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  SubjectService,
  SubjectFilters,
  CreateSubjectData,
  UpdateSubjectData,
} from "../services/subjectService";
import { SubjectType } from "../../generated/prisma";

const subjectService = new SubjectService();

// Interface pour les réponses
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des matières
 */
export const getSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: SubjectFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      type:
        typeof req.query.type === "string"
          ? (req.query.type as SubjectType)
          : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await subjectService.getSubjects(filters, auditData);

    await createAuditLog({
      ...auditData,
      action: "SUBJECTS_LIST_REQUEST",
      entity: "Subject",
      description: "Liste des matières récupérée",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error("❌ SubjectController - getSubjects error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECTS_LIST_ERROR",
      entity: "Subject",
      description: "Erreur lors de la récupération des matières",
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
 * @desc Récupère une matière par ID
 */
export const getSubjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await subjectService.getSubjectById(id, auditData);

    if (!result.success && result.code === "SUBJECT_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DETAILS_REQUEST",
      entity: "Subject",
      entityId: id,
      description: "Détails de la matière récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error("❌ SubjectController - getSubjectById error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DETAILS_ERROR",
      entity: "Subject",
      description: "Erreur lors de la récupération de la matière",
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
 * @desc Crée une nouvelle matière
 */
export const createSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateSubjectData = req.body;
    const userId = auditData.userId || req.user?.id;

    console.log("body:", req.body);

    if (!userId) {
      await createAuditLog({
        ...auditData,
        action: "SUBJECT_CREATION_UNAUTHORIZED",
        entity: "Subject",
        description:
          "Tentative de création de matière par un utilisateur non identifié",
        status: "ERROR",
      });
      const response: ApiResponse = {
        success: false,
        message: "Utilisateur non identifié",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    const result = await subjectService.createSubject(data, userId, auditData);

    if (!result.success) {
      const statusCode = result.code === "UNAUTHORIZED" ? 401 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_CREATED",
      entity: "Subject",
      entityId: result.data?.subject?.id,
      description: `Matière "${data.name}" créée`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("❌ SubjectController - createSubject error:", error);
    const errorMessage = error.message;
    const truncatedErrorMessage = errorMessage.substring(0, 500);
    await createAuditLog({
      ...auditData,
      action: "SUBJECT_CREATION_ERROR",
      entity: "Subject",
      description: "Erreur lors de la création de la matière",
      status: "ERROR",
      errorMessage: truncatedErrorMessage,
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
 * @desc Met à jour une matière
 */
export const updateSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateSubjectData = req.body;

    console.log("📝 Update Subject - Body:", req.body);
    console.log("🔍 ID à mettre à jour:", id);

    const result = await subjectService.updateSubject(id, data, auditData);

    if (!result.success) {
      const statusCode = result.code === "SUBJECT_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_UPDATED",
      entity: "Subject",
      entityId: id,
      description: `Matière "${data.name || "N/A"}" mise à jour`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    console.log("✅ Matière mise à jour:", id);
    res.json(result);
  } catch (error: any) {
    console.error("❌ SubjectController - updateSubject error:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_UPDATE_ERROR",
      entity: "Subject",
      description: "Erreur lors de la mise à jour de la matière",
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
 * @desc Supprime une matière
 */
export const deleteSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await subjectService.deleteSubject(id, auditData);

    if (!result.success) {
      const statusCode = result.code === "SUBJECT_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DELETED",
      entity: "Subject",
      entityId: id,
      description: `Matière "${result.subjectName}" supprimée`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error("❌ SubjectController - deleteSubject error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DELETION_ERROR",
      entity: "Subject",
      description: "Erreur lors de la suppression de la matière",
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
