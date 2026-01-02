/**
 * @file enrollmentController.ts
 * @description Contrôleurs pour la gestion des inscriptions
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  EnrollmentService,
  EnrollmentFilters,
  CreateEnrollmentData,
  UpdateEnrollmentData,
  ReenrollmentData,
  BulkEnrollmentData,
} from "../services/enrollmentService";

const enrollmentService = new EnrollmentService();

// Interface pour les réponses
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des inscriptions
 */
export const getEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: EnrollmentFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      academicYearId: req.query.academicYearId as string,
      classId: req.query.classId as string,
      studentId: req.query.studentId as string,
      status: req.query.status as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const result = await enrollmentService.getEnrollments(filters, auditData);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENTS_LIST_REQUEST",
      entity: "Enrollment",
      description: "Liste des inscriptions récupérée",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - getEnrollments error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENTS_LIST_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération des inscriptions",
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
 * @desc Récupère une inscription par ID
 */
export const getEnrollmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await enrollmentService.getEnrollmentById(id, auditData);

    if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DETAILS_REQUEST",
      entity: "Enrollment",
      entityId: id,
      description: "Détails de l'inscription récupérés",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - getEnrollmentById error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DETAILS_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération de l'inscription",
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
 * @desc Crée une nouvelle inscription avec option d'attribution de frais
 */
export const createEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateEnrollmentData = req.body;
    const result = await enrollmentService.createEnrollment(data, auditData);

    if (!result.success) {
      const statusCode =
        result.code === "STUDENT_NOT_FOUND" ||
        result.code === "CLASS_NOT_FOUND" ||
        result.code === "ACADEMIC_YEAR_NOT_FOUND"
          ? 404
          : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_CREATED",
      entity: "Enrollment",
      entityId: (result as any).data?.enrollment?.id,
      description: `Inscription créée pour l'étudiant ${data.studentId}`,
      status: "SUCCESS",
      metadata: (result as any).metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("EnrollmentController - createEnrollment error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_CREATION_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la création de l'inscription",
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
 * @desc Met à jour une inscription
 */
/**
 * Met à jour une inscription
 */
export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const auditData = extractAuditData(req);

    console.log("📝 Mise à jour inscription - ID:", id);
    console.log("📝 Données reçues:", data);

    // Valider que l'ID existe
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'inscription requis",
        code: "ENROLLMENT_ID_REQUIRED",
      });
    }

    // Valider les données
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucune donnée fournie pour la mise à jour",
        code: "NO_DATA_PROVIDED",
      });
    }

    // Nettoyer les données - ne garder que les champs autorisés
    const allowedFields = ["classId", "status", "enrollmentDate"];
    const cleanedData: any = {};

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        cleanedData[field] = data[field];
      }
    });

    // Ajouter updatedAt
    cleanedData.updatedAt = new Date();

    console.log("📝 Données nettoyées pour mise à jour:", cleanedData);

    // Appeler le service
    const result = await enrollmentService.updateEnrollment(
      id,
      cleanedData,
      auditData
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Controller - updateEnrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour",
      error: error.message,
      code: "SERVER_ERROR",
    });
  }
};

/**
 * @desc Désinscrit un étudiant
 */
export const unenrollStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const reason = req.body?.reason || "Non spécifié";
    const result = await enrollmentService.unenrollStudent(
      id,
      reason,
      auditData
    );

    if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "STUDENT_UNENROLLED",
      entity: "Enrollment",
      entityId: id,
      description: "Étudiant désinscrit",
      status: "SUCCESS",
      metadata: (result as any).metadata,
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - unenrollStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_UNENROLL_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la désinscription de l'étudiant",
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
 * @desc Gère la réinscription d'un étudiant
 */
export const reenrollStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: ReenrollmentData = req.body;
    const result = await enrollmentService.reenrollStudent(data, auditData);

    if (!result.success) {
      const statusCode =
        result.code === "STUDENT_NOT_FOUND" ||
        result.code === "CLASS_NOT_FOUND" ||
        result.code === "TARGET_YEAR_NOT_FOUND"
          ? 404
          : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "STUDENT_REENROLLED",
      entity: "Enrollment",
      entityId: result.data?.enrollment?.id,
      description: "Étudiant réinscrit",
      status: "SUCCESS",
      metadata: (result as any).metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - reenrollStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_REENROLL_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la réinscription de l'étudiant",
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
 * @desc Valide un étudiant pour la réinscription
 */
export const validateReenrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;
    const result = await enrollmentService.validateReenrollment(
      studentId,
      auditData
    );

    if (!result.success) {
      const statusCode = result.code === "STUDENT_NOT_FOUND" ? 404 : 400;
      res.status(statusCode).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "REENROLLMENT_VALIDATION",
      entity: "Enrollment",
      description: "Validation de réinscription effectuée",
      status: "SUCCESS",
      metadata: { studentId },
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - validateReenrollment error:", error);

    await createAuditLog({
      ...auditData,
      action: "REENROLLMENT_VALIDATION_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la validation de réinscription",
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
 * @desc Récupère les inscriptions d'un étudiant
 */
export const getStudentEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;
    const result = await enrollmentService.getStudentEnrollments(
      studentId,
      auditData
    );

    await createAuditLog({
      ...auditData,
      action: "STUDENT_ENROLLMENTS_REQUEST",
      entity: "Enrollment",
      description: "Historique des inscriptions récupéré",
      status: "SUCCESS",
      metadata: { studentId },
    });

    res.json(result);
  } catch (error: any) {
    console.error(
      " EnrollmentController - getStudentEnrollments error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "STUDENT_ENROLLMENTS_ERROR",
      entity: "Enrollment",
      description:
        "Erreur lors de la récupération de l'historique des inscriptions",
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
 * @desc Récupère les statistiques d'inscription
 */
export const getEnrollmentStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { academicYearId } = req.query;
    const result = await enrollmentService.getEnrollmentStats(
      academicYearId as string,
      auditData
    );

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_STATS_REQUEST",
      entity: "Enrollment",
      description: "Statistiques d'inscription récupérées",
      status: "SUCCESS",
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - getEnrollmentStats error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_STATS_ERROR",
      entity: "Enrollment",
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
 * @desc Crée des inscriptions en masse
 */
export const createBulkEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { enrollments } = req.body;
    const result = await enrollmentService.createBulkEnrollments(
      enrollments,
      auditData
    );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "BULK_ENROLLMENTS_CREATED",
      entity: "Enrollment",
      description: `Inscriptions en masse créées`,
      status: "SUCCESS",
      metadata: (result as any).metadata,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error(
      " EnrollmentController - createBulkEnrollments error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "BULK_ENROLLMENTS_ERROR",
      entity: "Enrollment",
      description: "Erreur lors des inscriptions en masse",
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
 * @desc Récupère l'historique complet des inscriptions d'un étudiant
 */
export const getEnrollmentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;
    const result = await enrollmentService.getEnrollmentHistory(
      studentId,
      auditData
    );

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_HISTORY_REQUEST",
      entity: "Enrollment",
      description: "Historique des inscriptions récupéré",
      status: "SUCCESS",
      metadata: { studentId },
    });

    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - getEnrollmentHistory error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_HISTORY_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération de l'historique",
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
 * @desc Récupère les structures de frais disponibles
 */
export const getAvailableFeeStructures = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await enrollmentService.getAvailableFeeStructures();
    res.json(result);
  } catch (error: any) {
    console.error(" Erreur récupération structures de frais:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur lors de la récupération des structures de frais",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/** * @desc Supprime une inscription par ID (à utiliser avec prudence)
 */
export const deleteEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  try {
    const { id } = req.params;
    const result = await enrollmentService.deleteEnrollment(id, auditData);
    if (!result.success && result.code === "ENROLLMENT_NOT_FOUND") {
      res.status(404).json(result);
      return;
    }
    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DELETED",
      entity: "Enrollment",
      entityId: id,
      description: "Inscription supprimée",
      status: "SUCCESS",
      metadata: (result as any).metadata,
    });
    res.json(result);
  } catch (error: any) {
    console.error(" EnrollmentController - deleteEnrollment error:", error);
    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DELETION_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la suppression de l'inscription",
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
