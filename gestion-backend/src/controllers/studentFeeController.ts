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
import prisma from "../prisma";
import { z } from "zod";
import { createAuditLog } from "./auditController";

/**
 * @function getErrorMessage
 * @description Fonction utilitaire pour extraire le message d'erreur d'un type unknown
 * @param {unknown} error - L'erreur à traiter
 * @returns {string} Le message d'erreur formaté
 * @private
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  } else {
    return "Erreur inconnue";
  }
};

/**
 * @constant AssignFeeSchema
 * @description Schéma Zod pour la validation de l'attribution de frais
 */
const AssignFeeSchema = z.object({
  studentCode: z.string().min(1, "L'ID étudiant est requis"),
  feeStructureId: z.string().min(1, "L'ID de structure de frais est requis"),
  academicYearId: z.string().min(1, "L'ID d'année académique est requis"),
});

/**
 * @constant StudentFeeUpdateSchema
 * @description Schéma Zod pour la validation de la mise à jour des frais étudiants
 */
const StudentFeeUpdateSchema = z
  .object({
    dueDate: z.string().datetime("Date d'échéance invalide").optional(),
    status: z.enum(["pending", "partial", "paid", "overdue"]).optional(),
  })
  .partial();

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

    console.log("📥 Consultation tous les frais étudiants - Filtres:", {
      studentId,
      academicYear,
    });

    const whereClause: any = {};
    if (studentId) whereClause.studentId = studentId as string;
    if (academicYear) {
      whereClause.feeStructure = {
        academicYear: academicYear as string,
      };
    }

    const studentFees = await prisma.studentFee.findMany({
      where: whereClause,
      include: {
        feeStructure: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_STUDENT_FEES",
      entity: "StudentFee",
      description: "Consultation de tous les frais étudiants",
      status: "SUCCESS",
      metadata: {
        count: studentFees.length,
        studentFilter: studentId || "none",
        academicYearFilter: academicYear || "none",
        statusSummary: {
          pending: studentFees.filter((f) => f.status === "pending").length,
          partial: studentFees.filter((f) => f.status === "partial").length,
          paid: studentFees.filter((f) => f.status === "paid").length,
          overdue: studentFees.filter((f) => f.status === "overdue").length,
        },
      },
    });

    res.json(studentFees);
  } catch (error) {
    console.error("❌ Erreur récupération frais étudiants:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_STUDENT_FEES_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de la récupération de tous les frais étudiants",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    console.log("📥 Consultation frais étudiant par ID:", id);

    const studentFee = await prisma.studentFee.findUnique({
      where: { id },
      include: {
        feeStructure: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
      },
    });

    if (!studentFee) {
      await createAuditLog({
        ...auditData,
        action: "GET_STUDENT_FEE_ATTEMPT",
        entity: "StudentFee",
        entityId: id,
        description: "Tentative de consultation de frais étudiant - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Frais étudiant non trouvé" });
    }

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Consultation des détails des frais étudiant",
      status: "SUCCESS",
      metadata: {
        studentId: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        feeStructure: studentFee.feeStructure.name,
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        status: studentFee.status,
        paymentsCount: studentFee.payments.length,
      },
    });

    res.json(studentFee);
  } catch (error) {
    console.error("❌ Erreur récupération frais étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la récupération des frais étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    // Valider les données avec Zod
    try {
      StudentFeeUpdateSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_FEE_ATTEMPT",
          entity: "StudentFee",
          entityId: id,
          description:
            "Tentative de mise à jour de frais étudiant - validation des données échouée",
          status: "ERROR",
          errorMessage: "Données de validation invalides",
          metadata: {
            errors: validationError.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        });

        return res.status(400).json({
          error: "Données de validation invalides",
          details: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      throw validationError;
    }

    // Vérifier si les frais existent
    const existingStudentFee = await prisma.studentFee.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!existingStudentFee) {
      await createAuditLog({
        ...auditData,
        action: "UPDATE_STUDENT_FEE_ATTEMPT",
        entity: "StudentFee",
        entityId: id,
        description: "Tentative de mise à jour de frais étudiant - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Frais étudiant non trouvé" });
    }

    const updatedStudentFee = await prisma.studentFee.update({
      where: { id },
      data,
      include: {
        feeStructure: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
      },
    });

    console.log("✅ Frais étudiant mis à jour:", id);

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Frais étudiant mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: updatedStudentFee.studentId,
        studentName: `${updatedStudentFee.student.firstName} ${updatedStudentFee.student.lastName}`,
        updatedFields: Object.keys(data),
        oldStatus: existingStudentFee.status,
        newStatus: updatedStudentFee.status,
      },
    });

    res.json(updatedStudentFee);
  } catch (error) {
    console.error("❌ Erreur mise à jour frais étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour des frais étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(400).json({
      error: "Erreur lors de la mise à jour",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    // Vérifier s'il y a des paiements associés
    const payments = await prisma.feePayment.findMany({
      where: { studentFeeId: id },
    });

    if (payments.length > 0) {
      await createAuditLog({
        ...auditData,
        action: "DELETE_STUDENT_FEE_ATTEMPT",
        entity: "StudentFee",
        entityId: id,
        description:
          "Tentative de suppression de frais étudiant - paiements associés existent",
        status: "ERROR",
        errorMessage: "Paiements associés existent",
        metadata: {
          paymentsCount: payments.length,
          totalPaymentsAmount: payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          ),
        },
      });

      return res.status(400).json({
        error:
          "Impossible de supprimer ces frais car des paiements y sont associés",
        details: `${payments.length} paiement(s) associé(s) trouvé(s)`,
      });
    }

    // Récupérer les informations avant suppression
    const studentFeeToDelete = await prisma.studentFee.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        feeStructure: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!studentFeeToDelete) {
      await createAuditLog({
        ...auditData,
        action: "DELETE_STUDENT_FEE_ATTEMPT",
        entity: "StudentFee",
        entityId: id,
        description: "Tentative de suppression de frais étudiant - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Frais étudiant non trouvé" });
    }

    await prisma.studentFee.delete({ where: { id } });

    console.log("✅ Frais étudiant supprimé:", id);

    // Log de suppression réussie
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_FEE_SUCCESS",
      entity: "StudentFee",
      entityId: id,
      description: "Frais étudiant supprimé avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: studentFeeToDelete.studentId,
        studentName: `${studentFeeToDelete.student.firstName} ${studentFeeToDelete.student.lastName}`,
        feeStructure: studentFeeToDelete.feeStructure.name,
        totalAmount: studentFeeToDelete.totalAmount,
        status: studentFeeToDelete.status,
      },
    });

    res.json({ message: "Frais étudiant supprimés" });
  } catch (error) {
    console.error("❌ Erreur suppression frais étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_FEE_ERROR",
      entity: "StudentFee",
      entityId: req.params.id,
      description: "Erreur lors de la suppression des frais étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(400).json({
      error: "Erreur lors de la suppression",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    // Valider les données avec Zod
    try {
      AssignFeeSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        await createAuditLog({
          ...auditData,
          action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
          entity: "StudentFee",
          description:
            "Tentative d'attribution de frais - validation des données échouée",
          status: "ERROR",
          errorMessage: "Données de validation invalides",
          metadata: {
            errors: validationError.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        });

        return res.status(400).json({
          error: "Données de validation invalides",
          details: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      throw validationError;
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      await createAuditLog({
        ...auditData,
        action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
        entity: "StudentFee",
        description: `Tentative d'attribution de frais - étudiant ${studentId} non trouvé`,
        status: "ERROR",
        metadata: { studentId },
      });

      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Vérifier si la structure de frais existe
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });
    if (!feeStructure) {
      await createAuditLog({
        ...auditData,
        action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
        entity: "StudentFee",
        description: `Tentative d'attribution de frais - structure de frais ${feeStructureId} non trouvée`,
        status: "ERROR",
        metadata: { feeStructureId },
      });

      return res.status(404).json({ error: "Structure de frais non trouvée" });
    }

    // Vérifier si l'année académique existe
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });
    if (!academicYear) {
      await createAuditLog({
        ...auditData,
        action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
        entity: "StudentFee",
        description: `Tentative d'attribution de frais - année académique ${academicYearId} non trouvée`,
        status: "ERROR",
        metadata: { academicYearId },
      });

      return res.status(404).json({ error: "Année académique non trouvée" });
    }

    // Vérifier les doublons
    const existingFee = await prisma.studentFee.findFirst({
      where: {
        studentId,
        feeStructureId,
        academicYearId,
      },
    });
    if (existingFee) {
      await createAuditLog({
        ...auditData,
        action: "ASSIGN_FEE_TO_STUDENT_ATTEMPT",
        entity: "StudentFee",
        description: "Tentative d'attribution de frais - doublon détecté",
        status: "ERROR",
        errorMessage: "Des frais existent déjà pour cette combinaison",
        metadata: {
          studentId,
          feeStructureId,
          academicYearId,
        },
      });

      return res
        .status(400)
        .json({ error: "Des frais existent déjà pour cette combinaison" });
    }

    // Créer les frais étudiants
    const studentFee = await prisma.studentFee.create({
      data: {
        student: { connect: { id: studentId } },
        feeStructure: { connect: { id: feeStructureId } },
        academicYear: { connect: { id: academicYearId } },
        totalAmount: feeStructure.amount,
        paidAmount: 0,
        status: "pending",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        feeStructure: { select: { id: true, name: true, amount: true } },
        academicYear: { select: { id: true, year: true } },
      },
    });

    console.log("✅ Frais attribués à l'étudiant:", studentFee.id);

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "ASSIGN_FEE_TO_STUDENT_SUCCESS",
      entity: "StudentFee",
      entityId: studentFee.id,
      description: "Frais attribués à l'étudiant avec succès",
      status: "SUCCESS",
      metadata: {
        studentCode: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        feeStructure: studentFee.feeStructure.name,
        academicYear: studentFee.academicYear.year,
        totalAmount: studentFee.totalAmount,
        dueDate: studentFee.dueDate,
      },
    });

    res.json(studentFee);
  } catch (error) {
    console.error("❌ Erreur attribution frais:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "ASSIGN_FEE_TO_STUDENT_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de l'attribution des frais à l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    console.log(
      "📥 Consultation frais par étudiant et année - Student:",
      studentId,
      "Année:",
      academicYear
    );

    const studentFee = await prisma.studentFee.findFirst({
      where: {
        studentId,
        academicYearId: academicYear,
      },
      include: {
        feeStructure: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
      },
    });

    if (!studentFee) {
      await createAuditLog({
        ...auditData,
        action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_ATTEMPT",
        entity: "StudentFee",
        description: `Tentative de consultation de frais - étudiant ${studentId}, année ${academicYear} non trouvé`,
        status: "ERROR",
        metadata: { studentId, academicYear },
      });

      return res.status(404).json({ error: "Frais étudiant non trouvé" });
    }

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_SUCCESS",
      entity: "StudentFee",
      entityId: studentFee.id,
      description: "Consultation des frais par étudiant et année",
      status: "SUCCESS",
      metadata: {
        studentId: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        academicYear: academicYear,
        feeStructure: studentFee.feeStructure.name,
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        status: studentFee.status,
        paymentsCount: studentFee.payments.length,
      },
    });

    res.json(studentFee);
  } catch (error) {
    console.error("❌ Erreur récupération frais par étudiant et année:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEE_BY_STUDENT_YEAR_ERROR",
      entity: "StudentFee",
      description:
        "Erreur lors de la récupération des frais par étudiant et année",
      status: "ERROR",
      errorMessage: errorMessage,
      metadata: {
        studentId: req.params.studentId,
        academicYear: req.params.academicYear,
      },
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
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

    console.log("📥 Consultation frais par étudiant - Student ID:", studentId);

    const studentFees = await prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feeStructure: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
      },
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEES_BY_STUDENT",
      entity: "StudentFee",
      description: "Consultation des frais d'un étudiant",
      status: "SUCCESS",
      metadata: {
        studentId,
        count: studentFees.length,
        totalAmount: studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0),
        totalPaid: studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0),
        statusSummary: {
          pending: studentFees.filter((f) => f.status === "pending").length,
          partial: studentFees.filter((f) => f.status === "partial").length,
          paid: studentFees.filter((f) => f.status === "paid").length,
          overdue: studentFees.filter((f) => f.status === "overdue").length,
        },
      },
    });

    res.json(studentFees);
  } catch (error) {
    console.error("❌ Erreur récupération frais par étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_FEES_BY_STUDENT_ERROR",
      entity: "StudentFee",
      description: "Erreur lors de la récupération des frais par étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
      metadata: {
        studentId: req.params.studentId,
      },
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
