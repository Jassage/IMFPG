/**
 * @file classAssignmentController.ts
 * @description Contrôleurs pour la gestion des assignations de cours aux classes
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { ClassAssignmentService } from "../services/classAssignmentService";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des assignations
 */
export const getClassAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await ClassAssignmentService.getClassAssignments({
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      classLevel: req.query.classLevel as string,
      academicYearId: req.query.academicYearId as string,
      professeurId: req.query.professeurId as string,
      subjectId: req.query.subjectId as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_REQUEST",
      entity: "ClassAssignment",
      description: "Liste des assignations récupérée",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getClassAssignments error:",
      error
    );

    // Utiliser createAuditLogSafe avec message d'erreur tronqué
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la récupération des assignations",
      status: "ERROR",
      errorMessage: error.message
        ? error.message.substring(0, 500)
        : "Unknown error",
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
      data:
        process.env.NODE_ENV === "development" && error.response?.data
          ? { error: error.message?.substring(0, 200) }
          : undefined,
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère une assignation par ID
 */
export const getClassAssignmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await ClassAssignmentService.getClassAssignmentById(id);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DETAILS_REQUEST",
      entity: "ClassAssignment",
      entityId: id,
      description: "Détails de l'assignation récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getClassAssignmentById error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DETAILS_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la récupération de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Crée une nouvelle assignation
 */
export const createClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const result = await ClassAssignmentService.createClassAssignment(req.body);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATED",
      entity: "ClassAssignment",
      entityId: result.data.assignment.id,
      description: `Assignation créée: ${result.data.assignment.subject.name} → ${result.data.assignment.classLevel} (Prof: ${result.data.assignment.professeur.firstName} ${result.data.assignment.professeur.lastName})`,
      status: "SUCCESS",
      metadata: {
        subjectId: req.body.subjectId,
        professeurId: req.body.professeurId,
        classLevel: req.body.classLevel,
        academicYearId: req.body.academicYearId,
        status: req.body.status,
      },
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - createClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la création de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Met à jour une assignation
 */
export const updateClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await ClassAssignmentService.updateClassAssignment(
      id,
      req.body
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation mise à jour: ${result.data.assignment.subject.name}`,
      status: "SUCCESS",
      metadata: {
        changes: Object.keys(req.body),
      },
    });

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - updateClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATE_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la mise à jour de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Supprime une assignation
 */
export const deleteClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await ClassAssignmentService.deleteClassAssignment(id);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation supprimée: ${(result as any).data?.assignment?.subject?.name || "Unknown"} → ${(result as any).data?.assignment?.classLevel || "Unknown"}`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - deleteClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la suppression de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère les assignations d'une classe
 */
export const getClassAssignmentsByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const result = await ClassAssignmentService.getClassAssignmentsByClass(
      classId,
      {
        academicYearId: req.query.academicYearId as string,
        level: req.query.level as string,
      }
    );

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getClassAssignmentsByClass error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère les assignations d'un professeur
 */
export const getClassAssignmentsByProfessor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { professeurId } = req.params;
    const result = await ClassAssignmentService.getClassAssignmentsByProfessor(
      professeurId,
      req.query.academicYearId as string
    );

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getClassAssignmentsByProfessor error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};

/**
 * @desc Récupère les assignations disponibles pour un niveau
 */
export const getAvailableAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classLevel } = req.params;
    const result = await ClassAssignmentService.getAvailableAssignments(
      classLevel,
      req.query.academicYearId as string
    );

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getAvailableAssignments error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};
/**
 * @desc Récupère les assignations d'une classe et d'un niveau spécifiques
 */
export const getClassAssignmentsByClassAndLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // extraire classLevel au lieu de level
    const { classId, classLevel } = req.params;
    const academicYearId = req.query.academicYearId as string;

    console.log("DEBUG - Controller received:", {
      classId,
      classLevel,
      academicYearId,
      params: req.params,
      query: req.query,
    });

    //  passer classLevel au service
    const result =
      await ClassAssignmentService.getClassAssignmentsByClassAndLevel(
        classId,
        classLevel,
        academicYearId
      );

    res.json(result);
  } catch (error: any) {
    console.error(
      " ClassAssignmentController - getClassAssignmentsByClassAndLevel error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
    };

    res.status(error.status || 500).json(response);
  }
};
