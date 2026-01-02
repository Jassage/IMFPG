import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ClassAssignmentService } from "../services/classAssignmentService";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import { ApiResponse } from "../types/classTypes";

/**
 * @desc Récupère la liste des assignations
 */
export const getClassAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string,
      classLevel: req.query.classLevel as string,
      academicYearId: req.query.academicYearId as string,
      professeurId: req.query.professeurId as string,
      subjectId: req.query.subjectId as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    };

    const result = await ClassAssignmentService.getClassAssignments(filters);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_REQUEST",
      entity: "ClassAssignment",
      description: "Liste des assignations récupérée",
      status: "SUCCESS",
      metadata: { filters, count: result.data.assignments.length },
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la récupération des assignations",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500) || "Unknown error",
      metadata: { query: req.query },
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
 * @desc Récupère une assignation par ID
 */
export const getClassAssignmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "ID d'assignation requis",
        code: "MISSING_ID",
      };
      res.status(400).json(response);
      return;
    }

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
    // Vérifier les erreurs de validation express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: "Erreur de validation",
        code: "VALIDATION_ERROR",
        errors: errors.array().map((err) => ({
          path: err.type === "field" ? err.path : "unknown",
          message: err.msg,
        })),
      };
      res.status(400).json(response);
      return;
    }

    const data = req.body;

    const result = await ClassAssignmentService.createClassAssignment(data);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATED",
      entity: "ClassAssignment",
      entityId: result.data.assignment.id,
      description: `Assignation créée: ${result.data.assignment.subject.name} → ${result.data.assignment.classLevel}`,
      status: "SUCCESS",
      metadata: {
        subjectId: data.subjectId,
        professeurId: data.professeurId,
        classLevel: data.classLevel,
        academicYearId: data.academicYearId,
        status: data.status,
      },
    });

    res.status(201).json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la création de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
      metadata: { attemptedData: req.body },
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
    // Vérifier les erreurs de validation express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: "Erreur de validation",
        code: "VALIDATION_ERROR",
        errors: errors.array().map((err) => ({
          path: err.type === "field" ? err.path : "unknown",
          message: err.msg,
        })),
      };
      res.status(400).json(response);
      return;
    }

    const { id } = req.params;
    const data = req.body;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "ID d'assignation requis",
        code: "MISSING_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ClassAssignmentService.updateClassAssignment(id, data);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation mise à jour: ${result.data.assignment.subject.name}`,
      status: "SUCCESS",
      metadata: {
        changes: Object.keys(data),
      },
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATE_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la mise à jour de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
      metadata: { id: req.params.id, attemptedChanges: req.body },
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

    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "ID d'assignation requis",
        code: "MISSING_ID",
      };
      res.status(400).json(response);
    }

    const result = await ClassAssignmentService.deleteClassAssignment(id);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation supprimée: ${result.data?.subjectName || "Inconnu"} → ${result.data?.classLevel || "Inconnu"}`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la suppression de l'assignation",
      status: "ERROR",
      errorMessage: error.message,
      metadata: { id: req.params.id },
    });

    const response: ApiResponse = {
      success: false,
      message: error.response?.message || "Erreur interne du serveur",
      code: error.response?.code || "INTERNAL_ERROR",
      data: error.response?.data,
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
  const auditData = extractAuditData(req);

  try {
    const { classId } = req.params;

    if (!classId) {
      const response: ApiResponse = {
        success: false,
        message: "ID de classe requis",
        code: "MISSING_CLASS_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ClassAssignmentService.getClassAssignmentsByClass(
      classId,
      req.query.academicYearId as string,
      req.query.level as string
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_CLASS_REQUEST",
      entity: "ClassAssignment",
      entityId: classId,
      description: "Assignations de la classe récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_CLASS_ERROR",
      entity: "ClassAssignment",
      description:
        "Erreur lors de la récupération des assignations de la classe",
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
 * @desc Récupère les assignations d'un professeur
 */
export const getClassAssignmentsByProfessor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { professeurId } = req.params;

    if (!professeurId) {
      const response: ApiResponse = {
        success: false,
        message: "ID de professeur requis",
        code: "MISSING_PROFESSEUR_ID",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ClassAssignmentService.getClassAssignmentsByProfessor(
      professeurId,
      req.query.academicYearId as string
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_PROFESSOR_REQUEST",
      entity: "ClassAssignment",
      entityId: professeurId,
      description: "Assignations du professeur récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_PROFESSOR_ERROR",
      entity: "ClassAssignment",
      description:
        "Erreur lors de la récupération des assignations du professeur",
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
 * @desc Récupère les assignations disponibles pour un niveau
 */
export const getAvailableAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classLevel } = req.params;

    if (!classLevel) {
      const response: ApiResponse = {
        success: false,
        message: "Niveau de classe requis",
        code: "MISSING_CLASS_LEVEL",
      };
      res.status(400).json(response);
      return;
    }

    const result = await ClassAssignmentService.getAvailableAssignments(
      classLevel,
      req.query.academicYearId as string
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_AVAILABLE_REQUEST",
      entity: "ClassAssignment",
      description: `Assignations disponibles pour le niveau ${classLevel}`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_AVAILABLE_ERROR",
      entity: "ClassAssignment",
      description:
        "Erreur lors de la récupération des assignations disponibles",
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
 * @desc Récupère les assignations d'une classe et d'un niveau spécifiques
 */
export const getClassAssignmentsByClassAndLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classId, classLevel } = req.params;
    const academicYearId = req.query.academicYearId as string;

    if (!classId || !classLevel) {
      const response: ApiResponse = {
        success: false,
        message: "ID de classe et niveau sont requis",
        code: "MISSING_PARAMS",
      };
      res.status(400).json(response);
      return;
    }

    const result =
      await ClassAssignmentService.getClassAssignmentsByClassAndLevel(
        classId,
        classLevel,
        academicYearId
      );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_CLASS_LEVEL_REQUEST",
      entity: "ClassAssignment",
      description: `Assignations pour la classe ${classId} niveau ${classLevel}`,
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_CLASS_LEVEL_ERROR",
      entity: "ClassAssignment",
      description:
        "Erreur lors de la récupération des assignations par classe et niveau",
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
