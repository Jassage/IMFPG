/**
 * @file gradeController.ts
 * @description Contrôleurs pour la gestion des notes des étudiants avec workflow de validation
 */

import { Request, Response } from "express";
import { PrismaClient, UserRole } from "../../generated/prisma/client";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  GradeService,
  GradeFilters,
  CreateGradeData,
  UpdateGradeData,
  BulkGradeData,
  SubmitGradesData,
  ApiResponse,
} from "../services/gradeService";

const prisma = new PrismaClient();
const gradeService = new GradeService();

// Interface pour les réponses API étendue
interface ExtendedApiResponse extends ApiResponse {
  statusCode?: number;
}

// Fonction utilitaire pour formater la réponse
const formatResponse = (
  res: Response,
  result: ApiResponse,
  defaultStatusCode?: number
): void => {
  const statusCode = result.success
    ? defaultStatusCode || 200
    : result.code === "NOT_FOUND" || result.code === "GRADE_NOT_FOUND"
      ? 404
      : result.code === "UNAUTHORIZED" ||
          result.code === "UNAUTHORIZED_CREATE" ||
          result.code === "UNAUTHORIZED_VIEW" ||
          result.code === "UNAUTHORIZED_UPDATE" ||
          result.code === "UNAUTHORIZED_DELETE" ||
          result.code === "UNAUTHORIZED_APPROVAL" ||
          result.code === "UNAUTHORIZED_REJECTION" ||
          result.code === "UNAUTHORIZED_PUBLICATION"
        ? 403
        : result.code === "MISSING_REQUIRED_FIELDS" ||
            result.code === "INVALID_GRADE_RANGE" ||
            result.code === "GRADE_ALREADY_EXISTS" ||
            result.code === "GRADE_HAS_DEPENDENCIES" ||
            result.code === "NO_GRADES_DATA" ||
            result.code === "ACADEMIC_YEAR_REQUIRED" ||
            result.code === "NO_VALID_GRADES" ||
            result.code === "NO_GRADES_SPECIFIED" ||
            result.code === "UNAUTHORIZED_STATUS_TRANSITION"
          ? 400
          : 500;

  res.status(statusCode).json(result);
};

/**
 * @desc Récupère la liste des notes avec filtres et pagination
 */
export const getGrades = async (req: Request, res: Response): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: GradeFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      search: req.query.search as string,
      studentId: req.query.studentId as string,
      subjectId: req.query.subjectId as string,
      assignmentId: req.query.assignmentId as string,
      academicYearId: req.query.academicYearId as string,
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      status: req.query.status as any,
      minGrade: req.query.minGrade
        ? parseFloat(req.query.minGrade as string)
        : undefined,
      maxGrade: req.query.maxGrade
        ? parseFloat(req.query.maxGrade as string)
        : undefined,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      createdBy: req.query.createdBy as string,
    };

    const result = await gradeService.getGrades(filters, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_LIST_REQUEST",
        entity: "Grade",
        description: "Liste des notes récupérée",
        status: "SUCCESS",
        metadata: {
          total: result.data?.pagination?.total || 0,
          filters,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_LIST_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère une note par ID
 */
export const getGradeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await gradeService.getGradeById(id, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_DETAILS_REQUEST",
        entity: "Grade",
        entityId: id,
        description: "Détails de la note récupérés",
        status: "SUCCESS",
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_DETAILS_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Crée une nouvelle note
 */
export const createGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateGradeData = {
      studentId: req.body.studentId,
      subjectId: req.body.subjectId,
      assignmentId: req.body.assignmentId,
      grade: req.body.grade,
      status: req.body.status,
      controlType: req.body.controlType,
      academicYearId: req.body.academicYearId,
      classLevel: req.body.classLevel,
      notes: req.body.notes,
      isDraft: req.body.isDraft,
    };

    const result = await gradeService.createGrade(data, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_CREATED",
        entity: "Grade",
        entityId: result.data?.grade?.id,
        description: `Note créée avec statut: ${result.data?.grade?.status}`,
        status: "SUCCESS",
        metadata: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          grade: data.grade,
          status: result.data?.grade?.status,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result, 201);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_CREATION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la création de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Crée et publie directement une note (admin seulement)
 */
export const createAndPublishGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: CreateGradeData = {
      studentId: req.body.studentId,
      subjectId: req.body.subjectId,
      assignmentId: req.body.assignmentId,
      grade: req.body.grade,
      status: req.body.status,
      controlType: req.body.controlType,
      academicYearId: req.body.academicYearId,
      classLevel: req.body.classLevel,
      notes: req.body.notes,
      isDraft: false, // Forcer non-brouillon pour publication directe
    };

    const result = await gradeService.createAndPublishGrade(data, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_CREATED_AND_PUBLISHED",
        entity: "Grade",
        entityId: result.data?.grade?.id,
        description: "Note créée et publiée directement",
        status: "SUCCESS",
        metadata: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          grade: data.grade,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result, 201);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_CREATE_PUBLISH_ERROR",
      entity: "Grade",
      description: "Erreur lors de la création et publication de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Met à jour une note existante
 */
export const updateGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateGradeData = {
      grade: req.body.grade,
      status: req.body.status,
      controlType: req.body.controlType,
      notes: req.body.notes,
      isActive: req.body.isActive,
      rejectionReason: req.body.rejectionReason,
    };

    const result = await gradeService.updateGrade(id, data, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_UPDATED",
        entity: "Grade",
        entityId: id,
        description: "Note mise à jour",
        status: "SUCCESS",
        metadata: {
          changes: result.metadata?.changes || [],
          oldStatus: result.metadata?.oldStatus,
          newStatus: result.metadata?.newStatus,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_UPDATE_ERROR",
      entity: "Grade",
      description: "Erreur lors de la mise à jour de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Met à jour et publie directement une note (admin seulement)
 */
export const updateAndPublishGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const data: UpdateGradeData = {
      grade: req.body.grade,
      status: req.body.status,
      controlType: req.body.controlType,
      notes: req.body.notes,
      isActive: req.body.isActive,
      rejectionReason: req.body.rejectionReason,
    };

    const result = await gradeService.updateAndPublishGrade(
      id,
      data,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_UPDATED_AND_PUBLISHED",
        entity: "Grade",
        entityId: id,
        description: "Note mise à jour et publiée",
        status: "SUCCESS",
        metadata: {
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_UPDATE_PUBLISH_ERROR",
      entity: "Grade",
      description: "Erreur lors de la mise à jour et publication de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Supprime une note
 */
export const deleteGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const result = await gradeService.deleteGrade(id, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_DELETED",
        entity: "Grade",
        entityId: id,
        description: "Note supprimée",
        status: "SUCCESS",
        metadata: {
          studentName: result.metadata?.studentName,
          subjectName: result.metadata?.subjectName,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_DELETION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la suppression de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les notes d'un étudiant spécifique
 */
export const getStudentGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;
    const filters = {
      academicYearId: req.query.academicYearId as string,
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      session: req.query.session as any,
      subjectId: req.query.subjectId as string,
      includeDraft: req.query.includeDraft === "true",
    };

    const result = await gradeService.getStudentGrades(
      studentId,
      filters,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "STUDENT_GRADES_REQUEST",
        entity: "Grade",
        entityId: studentId,
        description: `Notes de l'étudiant récupérées`,
        status: "SUCCESS",
        metadata: {
          studentId,
          filters,
          totalGrades: result.data?.grades?.length || 0,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "STUDENT_GRADES_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes de l'étudiant",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Soumet des notes pour validation par l'admin
 */
export const submitGradesForApproval = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const data: SubmitGradesData = {
      gradeIds: req.body.gradeIds,
      submitAll: req.body.submitAll,
      filters: req.body.filters,
    };

    const result = await gradeService.submitGradesForApproval(data, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_SUBMITTED_FOR_APPROVAL",
        entity: "Grade",
        description: `Notes soumises pour validation`,
        status: "SUCCESS",
        metadata: {
          count: result.data?.count,
          submitAll: data.submitAll,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_SUBMISSION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la soumission des notes pour validation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les notes en attente de validation
 */
export const getPendingApproval = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      submittedBy: req.query.submittedBy as string,
      assignmentId: req.query.assignmentId as string,
      classLevel: req.query.classLevel as any,
      subjectId: req.query.subjectId as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    const result = await gradeService.getPendingApproval(filters, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "PENDING_APPROVAL_REQUEST",
        entity: "Grade",
        description: "Notes en attente de validation récupérées",
        status: "SUCCESS",
        metadata: {
          total: result.data?.pagination?.total || 0,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "PENDING_APPROVAL_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes en attente",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Approuve une ou plusieurs notes
 */
export const approveGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { gradeIds } = req.body;
    const { publishToStudents } = req.query;

    if (!Array.isArray(gradeIds) || gradeIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune note spécifiée pour approbation",
        code: "NO_GRADES_SPECIFIED",
      };
      formatResponse(res, response);
      return;
    }

    const options = {
      publishToStudents: publishToStudents === "true",
    };

    const result = await gradeService.approveGrades(
      gradeIds,
      auditData,
      options
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: options.publishToStudents
          ? "GRADES_PUBLISHED"
          : "GRADES_APPROVED",
        entity: "Grade",
        description: options.publishToStudents
          ? "Notes approuvées et publiées"
          : "Notes approuvées",
        status: "SUCCESS",
        metadata: {
          count: result.data?.count,
          gradeIds: gradeIds.slice(0, 10), // Garder seulement les premiers pour le log
          publishToStudents: options.publishToStudents,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_APPROVAL_ERROR",
      entity: "Grade",
      description: "Erreur lors de l'approbation des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Approuve et publie en une seule opération (admin seulement)
 */
export const approveAndPublishGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { gradeIds } = req.body;

    if (!Array.isArray(gradeIds) || gradeIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune note spécifiée pour approbation et publication",
        code: "NO_GRADES_SPECIFIED",
      };
      formatResponse(res, response);
      return;
    }

    const result = await gradeService.approveAndPublishGrades(
      gradeIds,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_APPROVED_AND_PUBLISHED",
        entity: "Grade",
        description: "Notes approuvées et publiées en une seule opération",
        status: "SUCCESS",
        metadata: {
          count: result.data?.count,
          gradeIds: gradeIds.slice(0, 10),
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_APPROVE_PUBLISH_ERROR",
      entity: "Grade",
      description: "Erreur lors de l'approbation et publication des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Rejette une ou plusieurs notes
 */
export const rejectGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { gradeIds, reason } = req.body;

    if (!Array.isArray(gradeIds) || gradeIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune note spécifiée pour rejet",
        code: "NO_GRADES_SPECIFIED",
      };
      formatResponse(res, response);
      return;
    }

    if (!reason || reason.trim() === "") {
      const response: ApiResponse = {
        success: false,
        message: "Une raison est requise pour rejeter une note",
        code: "REJECTION_REASON_REQUIRED",
      };
      formatResponse(res, response);
      return;
    }

    const result = await gradeService.rejectGrades(gradeIds, reason, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_REJECTED",
        entity: "Grade",
        description: "Notes rejetées",
        status: "SUCCESS",
        metadata: {
          count: result.data?.count,
          reason: reason.substring(0, 100), // Limiter la longueur dans les logs
          gradeIds: gradeIds.slice(0, 10),
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_REJECTION_ERROR",
      entity: "Grade",
      description: "Erreur lors du rejet des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Publie des notes approuvées aux étudiants
 */
export const publishGradesToStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { gradeIds } = req.body;

    if (!Array.isArray(gradeIds) || gradeIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune note spécifiée pour publication",
        code: "NO_GRADES_SPECIFIED",
      };
      formatResponse(res, response);
      return;
    }

    const result = await gradeService.publishGradesToStudents(
      gradeIds,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_PUBLISHED_TO_STUDENTS",
        entity: "Grade",
        description: "Notes publiées aux étudiants",
        status: "SUCCESS",
        metadata: {
          count: result.data?.count,
          gradeIds: gradeIds.slice(0, 10),
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_PUBLICATION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la publication des notes aux étudiants",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Importe des notes en masse
 */
export const bulkImportGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { grades, academicYearId, assignmentId } = req.body;

    if (!Array.isArray(grades) || grades.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune donnée de note fournie",
        code: "NO_GRADES_DATA",
      };
      formatResponse(res, response);
      return;
    }

    if (!academicYearId) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique requise",
        code: "ACADEMIC_YEAR_REQUIRED",
      };
      formatResponse(res, response);
      return;
    }

    const gradesData: BulkGradeData[] = grades.map((grade: any) => ({
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      assignmentId: grade.assignmentId,
      grade: grade.grade,
      status: grade.status,
      session: grade.session,
      controlType: grade.controlType,
      classLevel: grade.classLevel,
      notes: grade.notes,
    }));

    const result = await gradeService.bulkImportGrades(
      gradesData,
      academicYearId,
      assignmentId,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_BULK_IMPORT",
        entity: "Grade",
        description: `Importation en masse de ${result.data?.importedCount} notes`,
        status: "SUCCESS",
        metadata: {
          importedCount: result.data?.importedCount,
          totalAttempted: result.data?.totalAttempted,
          errorCount: result.data?.errors?.length || 0,
          academicYearId,
          assignmentId,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result, 201);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_BULK_IMPORT_ERROR",
      entity: "Grade",
      description: "Erreur lors de l'importation en masse des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur lors de l'importation des notes",
      code: "BULK_IMPORT_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les statistiques des notes
 */
export const getGradeStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      academicYearId: req.query.academicYearId as string,
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      subjectId: req.query.subjectId as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    const result = await gradeService.getGradeStatistics(filters, auditData);

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADE_STATISTICS_REQUEST",
        entity: "Grade",
        description: "Statistiques des notes récupérées",
        status: "SUCCESS",
        metadata: {
          filters,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADE_STATISTICS_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des statistiques",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les statistiques détaillées pour l'admin
 */
export const getAdminGradeStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      academicYearId: req.query.academicYearId as string,
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      professorId: req.query.professorId as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    const result = await gradeService.getAdminGradeStatistics(
      filters,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "ADMIN_GRADE_STATISTICS_REQUEST",
        entity: "Grade",
        description: "Statistiques admin des notes récupérées",
        status: "SUCCESS",
        metadata: {
          filters,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "ADMIN_GRADE_STATISTICS_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des statistiques admin",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les notes par classe
 */
export const getGradesByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classId } = req.params;
    const { academicYearId } = req.query;
    const filters = {
      controlType: req.query.controlType as any,
      subjectId: req.query.subjectId as string,
      includeDraft: req.query.includeDraft === "true",
    };

    if (!academicYearId) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique requise",
        code: "ACADEMIC_YEAR_REQUIRED",
      };
      formatResponse(res, response);
      return;
    }

    const result = await gradeService.getGradesByClass(
      classId,
      academicYearId as string,
      filters,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_BY_CLASS_REQUEST",
        entity: "Grade",
        description: `Notes de la classe récupérées`,
        status: "SUCCESS",
        metadata: {
          classId,
          academicYearId,
          totalStudents: result.data?.totalStudents,
          totalGrades: result.data?.totalGrades,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_BY_CLASS_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes par classe",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Récupère les notes par matière
 */
export const getGradesBySubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { subjectId } = req.params;
    const { academicYearId } = req.query;
    const filters = {
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      includeDraft: req.query.includeDraft === "true",
    };

    if (!academicYearId) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique requise",
        code: "ACADEMIC_YEAR_REQUIRED",
      };
      formatResponse(res, response);
      return;
    }

    const result = await gradeService.getGradesBySubject(
      subjectId,
      academicYearId as string,
      filters,
      auditData
    );

    // Journaliser
    if (result.success) {
      await createAuditLog({
        ...auditData,
        action: "GRADES_BY_SUBJECT_REQUEST",
        entity: "Grade",
        description: `Notes par matière récupérées`,
        status: "SUCCESS",
        metadata: {
          subjectId,
          academicYearId,
          total: result.data?.statistics?.total,
          role: auditData.userRole,
        },
      });
    }

    formatResponse(res, result);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_BY_SUBJECT_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes par matière",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Exporte les notes au format Excel
 */
export const exportGradesToExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters: GradeFilters = {
      studentId: req.query.studentId as string,
      subjectId: req.query.subjectId as string,
      academicYearId: req.query.academicYearId as string,
      classLevel: req.query.classLevel as any,
      controlType: req.query.controlType as any,
      status: req.query.status as any,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };

    // Récupérer les notes avec filtres
    const result = await gradeService.getGrades(filters, auditData);

    if (!result.success || !result.data?.grades) {
      formatResponse(res, result);
      return;
    }

    const grades = result.data.grades;

    // Créer le contenu Excel
    const header = [
      "ID Étudiant",
      "Nom",
      "Prénom",
      "Code Étudiant",
      "Matière",
      "Note",
      "Note de Passage",
      "Statut",
      "Type de Contrôle",
      "Session",
      "Année Académique",
      "Date de Création",
    ];

    const rows = grades.map((grade: any) => [
      grade.student.id,
      grade.student.lastName,
      grade.student.firstName,
      grade.student.studentCode,
      grade.subject.name,
      grade.grade,
      grade.subject.passingGrade,
      grade.status,
      grade.controlType,
      grade.session,
      grade.academicYear.year,
      new Date(grade.createdAt).toLocaleDateString("fr-FR"),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell: any) => `"${cell}"`).join(","))
      .join("\n");

    // Définir les headers pour le téléchargement
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="notes_${new Date().toISOString().split("T")[0]}.csv"`
    );

    // Journaliser
    await createAuditLog({
      ...auditData,
      action: "GRADES_EXPORT_EXCEL",
      entity: "Grade",
      description: "Export des notes au format Excel",
      status: "SUCCESS",
      metadata: {
        count: grades.length,
        filters,
        role: auditData.userRole,
      },
    });

    // Envoyer le fichier
    res.send(csvContent);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "GRADES_EXPORT_ERROR",
      entity: "Grade",
      description: "Erreur lors de l'export des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur lors de l'export des notes",
      code: "EXPORT_ERROR",
    };

    formatResponse(res, response);
  }
};

/**
 * @desc Vérifie les permissions d'accès
 */
const checkPermission = (
  auditData: any,
  requiredRole: UserRole | UserRole[]
): boolean => {
  const userRole = auditData.userRole as UserRole;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  return userRole === requiredRole;
};

/**
 * @desc Middleware pour vérifier les permissions
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: Function) => {
    const auditData = extractAuditData(req);

    if (!checkPermission(auditData, roles)) {
      const response: ApiResponse = {
        success: false,
        message: "Accès non autorisé",
        code: "UNAUTHORIZED",
      };

      res.status(403).json(response);
      return;
    }

    next();
  };
};
