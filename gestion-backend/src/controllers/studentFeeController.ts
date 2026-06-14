/**
 * @file studentFeeController.ts
 * @description Contrôleur pour la gestion des frais étudiants
 * @module Controllers/StudentFees
 *
 * Ce contrôleur gère :
 * - L'attribution de frais aux étudiants
 * - La consultation des frais étudiants
 * - La mise à jour du statut des frais
 * - La suppression des frais
 * - Le suivi des paiements
 */

import { Request, Response } from "express";
import { StudentFeeService } from "../services/studentFeeService";
import { createAuditLog } from "./auditController";

/**
 * @function getAllStudentFees
 * @description Récupère tous les frais étudiants avec filtres optionnels
 * @route GET /api/student-fees
 * @access Staff/Admin
 * @query {string} [studentId] - ID de l'étudiant pour filtrer
 * @query {string} [academicYear] - Année académique pour filtrer
 * @returns {Promise<void>}
 */
export const getAllStudentFees = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).user?.id || (req as any).userId || null,
  };

  try {
    const { studentId, academicYear } = req.query;

    const result = await StudentFeeService.getAllStudentFees({
      studentId: studentId as string,
      academicYear: academicYear as string,
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_STUDENT_FEES",
      entity: "StudentFee",
      description: "Consultation de tous les frais étudiants",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur récupération frais étudiants:", error);

    const errorMessage = error.message || "Erreur inconnue";

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_STUDENT_FEES_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de la récupération de tous les frais étudiants",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function getStudentFeeById
 * @description Récupère les frais d'un étudiant par son ID
 * @route GET /api/student-fees/:id
 * @access Staff/Admin
 * @param {string} id - ID des frais étudiants
 * @returns {Promise<void>}
 */
export const getStudentFeeById = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    const result = await StudentFeeService.getStudentFeeById(id);

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Consultation des détails des frais étudiant",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur récupération frais étudiant:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la récupération des frais étudiant",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
    });

    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function updateStudentFee
 * @description Met à jour les frais d'un étudiant
 * @route PUT /api/student-fees/:id
 * @access Admin
 * @param {string} id - ID des frais à mettre à jour
 * @body {Object} data - Données de mise à jour
 * @body {string} [data.dueDate] - Nouvelle date d'échéance
 * @body {string} [data.status] - Nouveau statut (pending/partial/paid/overdue)
 * @returns {Promise<void>}
 */
export const updateStudentFee = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;
    const data = req.body;

    console.log("📥 Mise à jour frais étudiant - ID:", id, "Données:", data);

    // Log de tentative de mise à jour
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_FEE_ATTEMPT",
      entity: "StudentFee",
      entityId: id,
      description: "Tentative de mise à jour des frais étudiant",
      status: "SUCCESS",
      metadata: {
        updateFields: Object.keys(data),
      },
    });

    const result = await StudentFeeService.updateStudentFee(id, data);

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Frais étudiant mis à jour avec succès",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur mise à jour frais étudiant:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour des frais étudiant",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
      metadata: error.metadata || {},
    });

    if (error.status === 400 || error.status === 404) {
      return res.status(error.status).json({
        error: error.message,
        details: error.details,
      });
    }

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function deleteStudentFee
 * @description Supprime les frais d'un étudiant (si aucun paiement associé)
 * @route DELETE /api/student-fees/:id
 * @access Admin
 * @param {string} id - ID des frais à supprimer
 * @returns {Promise<void>}
 */
export const deleteStudentFee = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    console.log("🗑️ Suppression frais étudiant - ID:", id);

    // Log de tentative de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_FEE_ATTEMPT",
      entity: "StudentFee",
      entityId: id,
      description: "Tentative de suppression de frais étudiant",
      status: "SUCCESS",
    });

    const result = await StudentFeeService.deleteStudentFee(id);

    // Log de suppression réussie
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Frais étudiant supprimé avec succès",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json({ message: result.message });
  } catch (error: any) {
    console.error("❌ Erreur suppression frais étudiant:", error);

    // Log d'erreur de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la suppression des frais étudiant",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
      metadata: error.metadata || {},
    });

    if (error.status === 400 || error.status === 404) {
      return res.status(error.status).json({
        error: error.message,
        details: error.details,
      });
    }

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function assignFeeToStudent
 * @description Attribue une structure de frais à un étudiant pour une année académique
 * @route POST /api/student-fees/assign
 * @access Admin
 * @body {Object} feeAssignment - Données d'attribution
 * @body {string} feeAssignment.studentId - ID de l'étudiant
 * @body {string} feeAssignment.feeStructureId - ID de la structure de frais
 * @body {string} feeAssignment.academicYearId - ID de l'année académique
 * @returns {Promise<void>}
 */
export const assignFeeToStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentId, feeStructureId, academicYearId } = req.body;

    console.log("📥 Attribution frais à étudiant - Données:", req.body);

    // Log de tentative d'attribution
    await createAuditLog({
      ...auditData,
      action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
      entity: "StudentFee",
      description: "Tentative d'attribution de frais à un étudiant",
      status: "SUCCESS",
      metadata: {
        studentId,
        feeStructureId,
        academicYearId,
      },
    });

    const result = await StudentFeeService.assignFeeToStudent({
      studentId,
      feeStructureId,
      academicYearId,
    });

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "ASSIGN_FEE_TO_STUDENT_SUCCESS",
      entity: "StudentFee",
      entityId: result.data.id,
      description: "Frais attribués à l'étudiant avec succès",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur attribution frais:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "ASSIGN_FEE_TO_STUDENT_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de l'attribution des frais à l'étudiant",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
      metadata: error.metadata || {},
    });

    if (error.status === 400 || error.status === 404) {
      return res.status(error.status).json({
        error: error.message,
        details: error.details,
      });
    }

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function getStudentFeeByStudentAndYear
 * @description Récupère les frais d'un étudiant pour une année académique spécifique
 * @route GET /api/student-fees/student/:studentId/year/:academicYear
 * @access Staff/Admin
 * @param {string} studentId - ID de l'étudiant
 * @param {string} academicYear - ID de l'année académique
 * @returns {Promise<void>}
 */
export const getStudentFeeByStudentAndYear = async (
  req: Request,
  res: Response
) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentId, academicYear } = req.params;

    const result = await StudentFeeService.getStudentFeeByStudentAndYear(
      studentId,
      academicYear
    );

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_SUCCESS",
      entity: "StudentFee",
      entityId: result.data.id,
      description: "Consultation des frais par étudiant et année",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur récupération frais par étudiant et année:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_ERROR",
      entity: "StudentFee",
      description:
        "Erreur lors de la récupération des frais par étudiant et année",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
      metadata: {
        studentId: req.params.studentId,
        academicYear: req.params.academicYear,
      },
    });

    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function getFeeReportByClass
 * @description État des paiements (rapport) pour une classe ou un niveau,
 * pour une année académique : liste des élèves avec montants attendu, versé
 * et restant, plus les totaux agrégés
 * @route GET /api/student-fees/reports/by-class
 * @access Staff/Admin
 * @query {string} [classId] - ID de la classe
 * @query {string} [classLevel] - Niveau (si classId non fourni)
 * @query {string} academicYearId - ID de l'année académique (requis)
 * @returns {Promise<void>}
 */
export const getFeeReportByClass = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { classId, classLevel, academicYearId } = req.query;

    const result = await StudentFeeService.getFeeReportByClass({
      classId: classId as string,
      classLevel: classLevel as string,
      academicYearId: academicYearId as string,
    });

    await createAuditLog({
      ...auditData,
      action: "GET_FEE_REPORT_BY_CLASS",
      entity: "StudentFee",
      description: "Consultation de l'état des paiements par classe",
      status: "SUCCESS",
      metadata: {
        classId: classId as string,
        classLevel: classLevel as string,
        academicYearId: academicYearId as string,
        studentsCount: result.data.students.length,
      },
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur génération état des paiements:", error);

    await createAuditLog({
      ...auditData,
      action: "GET_FEE_REPORT_BY_CLASS_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de la génération de l'état des paiements",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
    });

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};

/**
 * @function getStudentFeesByStudent
 * @description Récupère tous les frais d'un étudiant (toutes années confondues)
 * @route GET /api/student-fees/student/:studentId
 * @access Staff/Admin
 * @param {string} studentId - ID de l'étudiant
 * @returns {Promise<void>}
 */
export const getStudentFeesByStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentId } = req.params;

    const result = await StudentFeeService.getStudentFeesByStudent(studentId);

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEES_BY_STUDENT",
      entity: "StudentFee",
      description: "Consultation des frais d'un étudiant",
      status: "SUCCESS",
      metadata: result.metadata,
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("❌ Erreur récupération frais par étudiant:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEES_BY_STUDENT_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de la récupération des frais par étudiant",
      status: "ERROR",
      errorMessage: error.message || "Erreur inconnue",
      metadata: {
        studentId: req.params.studentId,
      },
    });

    res.status(error.status || 500).json({
      error: error.message || "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" && error.details
          ? error.details
          : undefined,
    });
  }
};
