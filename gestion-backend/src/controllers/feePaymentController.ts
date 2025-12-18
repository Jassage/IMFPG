/**
 * @file feePaymentController.ts
 * @description Contrôleur pour la gestion des paiements de frais scolaires
 * @module Controllers/FeePayments
 *
 * Ce contrôleur gère :
 * - L'enregistrement des paiements
 * - La consultation des historiques de paiement
 * - La mise à jour des paiements
 * - La suppression des paiements
 * - Le recalcul automatique des soldes étudiants
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
 * @constant FeePaymentCreateSchema
 * @description Schéma Zod pour la validation de la création de paiement
 */
const FeePaymentCreateSchema = z.object({
  studentFeeId: z.string().min(1, "L'ID des frais étudiant est requis"),
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  paymentMethod: z.string().min(1, "La méthode de paiement est requise"),
  reference: z.string().optional().nullable(),
  paymentDate: z.string().datetime("Date de paiement invalide").optional(),
});

/**
 * @constant FeePaymentUpdateSchema
 * @description Schéma Zod pour la validation de la mise à jour de paiement
 */
const FeePaymentUpdateSchema = FeePaymentCreateSchema.partial();

/**
 * @function getAllFeePayments
 * @description Récupère tous les paiements avec filtres optionnels
 * @route GET /api/fee-payments
 * @access Staff/Admin
 * @query {string} [studentFeeId] - ID des frais étudiants pour filtrer
 * @returns {Promise<void>}
 */
export const getAllFeePayments = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentFeeId } = req.query;

    console.log("📥 Consultation de tous les paiements - Filtre:", {
      studentFeeId,
    });

    const whereClause: any = {};
    if (studentFeeId) whereClause.studentFeeId = studentFeeId as string;

    const feePayments = await prisma.feePayment.findMany({
      where: whereClause,
      include: {
        studentFee: {
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
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_FEE_PAYMENTS",
      entity: "FeePayment",
      description: "Consultation de tous les paiements de frais",
      status: "SUCCESS",
      metadata: {
        count: feePayments.length,
        studentFeeFilter: studentFeeId || "none",
      },
    });

    res.json(feePayments);
  } catch (error) {
    console.error("❌ Erreur récupération paiements:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_ALL_FEE_PAYMENTS_ERROR",
      entity: "FeePayment",
      description: "Erreur lors de la récupération de tous les paiements",
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
 * @function getFeePaymentById
 * @description Récupère un paiement spécifique par son ID
 * @route GET /api/fee-payments/:id
 * @access Staff/Admin
 * @param {string} id - ID du paiement
 * @returns {Promise<void>}
 */
export const getFeePaymentById = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    console.log("📥 Consultation paiement par ID:", id);

    const feePayment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        studentFee: {
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
        },
      },
    });

    if (!feePayment) {
      await createAuditLog({
        ...auditData,
        action: "GET_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        entityId: id,
        description: "Tentative de consultation de paiement - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_FEE_PAYMENT_SUCCESS",
      entity: "FeePayment",
      entityId: id,
      description: "Consultation des détails du paiement",
      status: "SUCCESS",
      metadata: {
        studentFeeId: feePayment.studentFeeId,
        amount: feePayment.amount,
        paymentMethod: feePayment.paymentMethod,
      },
    });

    res.json(feePayment);
  } catch (error) {
    console.error("❌ Erreur récupération paiement:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_FEE_PAYMENT_ERROR",
      entity: "FeePayment",
      entityId: req.params.id,
      description: "Erreur lors de la récupération du paiement",
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
 * @function createFeePayment
 * @description Crée un nouveau paiement et met à jour automatiquement le solde de l'étudiant
 * @route POST /api/fee-payments
 * @access Admin
 * @body {Object} paymentData - Données du paiement
 * @body {string} paymentData.studentFeeId - ID des frais étudiants
 * @body {number} paymentData.amount - Montant du paiement
 * @body {string} paymentData.paymentMethod - Méthode de paiement
 * @body {string} [paymentData.reference] - Référence du paiement
 * @body {string} [paymentData.paymentDate] - Date du paiement
 * @returns {Promise<void>}
 */
export const createFeePayment = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentFeeId, amount, paymentMethod, reference, paymentDate } =
      req.body;

    console.log("📥 Création paiement - Données:", req.body);

    // Log de tentative de création
    await createAuditLog({
      ...auditData,
      action: "CREATE_FEE_PAYMENT_ATTEMPT",
      entity: "FeePayment",
      description: "Tentative de création d'un nouveau paiement",
      status: "SUCCESS",
      metadata: {
        studentFeeId,
        amount,
        paymentMethod,
        reference,
      },
    });

    // Valider les données avec Zod
    try {
      FeePaymentCreateSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        await createAuditLog({
          ...auditData,
          action: "CREATE_FEE_PAYMENT_ATTEMPT",
          entity: "FeePayment",
          description:
            "Tentative de création de paiement - validation des données échouée",
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

    // Validation des données
    if (!studentFeeId || !amount || !paymentMethod) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        description: "Tentative de création de paiement - données manquantes",
        status: "ERROR",
        errorMessage: "Données manquantes",
      });

      return res.status(400).json({ error: "Données manquantes" });
    }

    // Vérifier si les frais étudiants existent
    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
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

    if (!studentFee) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        description: `Tentative de création de paiement - frais étudiant ${studentFeeId} non trouvé`,
        status: "ERROR",
        metadata: { studentFeeId },
      });

      return res.status(404).json({ error: "Frais étudiant non trouvé" });
    }

    // Vérifier que le montant ne dépasse pas le reste à payer
    const remainingAmount = studentFee.totalAmount - studentFee.paidAmount;
    if (amount > remainingAmount) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        description:
          "Tentative de création de paiement - montant dépasse le reste à payer",
        status: "ERROR",
        errorMessage: "Montant dépasse le reste à payer",
        metadata: {
          studentFeeId,
          amount,
          remainingAmount,
          totalAmount: studentFee.totalAmount,
          paidAmount: studentFee.paidAmount,
        },
      });

      return res.status(400).json({
        error: `Le montant dépasse le reste à payer (${remainingAmount} HTG)`,
      });
    }

    // Créer le paiement en transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer le paiement
      const payment = await tx.feePayment.create({
        data: {
          studentFeeId,
          amount,
          paymentMethod,
          reference: reference || null,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          recordedBy: (req as any).userId || "admin",
        },
      });

      console.log("✅ Paiement créé:", payment.id);

      // Mettre à jour le montant payé dans StudentFee
      const newPaidAmount = studentFee.paidAmount + amount;
      const newStatus =
        newPaidAmount >= studentFee.totalAmount ? "paid" : "partial";

      const updatedStudentFee = await tx.studentFee.update({
        where: { id: studentFeeId },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
        },
        include: {
          feeStructure: true,
          student: {
            select: {
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

      console.log("✅ Frais étudiant mis à jour:", updatedStudentFee.id);

      return { payment, studentFee: updatedStudentFee };
    });

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "CREATE_FEE_PAYMENT_SUCCESS",
      entity: "FeePayment",
      entityId: result.payment.id,
      description: "Paiement créé avec succès",
      status: "SUCCESS",
      metadata: {
        studentFeeId,
        amount,
        paymentMethod,
        reference,
        studentName: `${result.studentFee.student.firstName} ${result.studentFee.student.lastName}`,
        studentId: result.studentFee.student.studentCode,
        newStatus: result.studentFee.status,
        newPaidAmount: result.studentFee.paidAmount,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Erreur création paiement:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "CREATE_FEE_PAYMENT_ERROR",
      entity: "FeePayment",
      description: "Erreur lors de la création du paiement",
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
 * @function getFeePayments
 * @description Récupère les paiements avec filtres
 * @route GET /api/fee-payments/filtered
 * @access Staff/Admin
 * @query {string} [studentFeeId] - ID des frais étudiants pour filtrer
 * @returns {Promise<void>}
 */
export const getFeePayments = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { studentFeeId } = req.query;

    console.log("📥 Consultation paiements - Filtre:", { studentFeeId });

    const whereClause: any = {};
    if (studentFeeId) whereClause.studentFeeId = studentFeeId as string;

    const payments = await prisma.feePayment.findMany({
      where: whereClause,
      include: {
        studentFee: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
            feeStructure: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_FEE_PAYMENTS",
      entity: "FeePayment",
      description: "Consultation des paiements de frais",
      status: "SUCCESS",
      metadata: {
        count: payments.length,
        studentFeeFilter: studentFeeId || "none",
      },
    });

    res.json(payments);
  } catch (error) {
    console.error("❌ Erreur récupération paiements:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_FEE_PAYMENTS_ERROR",
      entity: "FeePayment",
      description: "Erreur lors de la récupération des paiements",
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
 * @function updateFeePayment
 * @description Met à jour un paiement existant et recalcule automatiquement le solde
 * @route PUT /api/fee-payments/:id
 * @access Admin
 * @param {string} id - ID du paiement à mettre à jour
 * @body {Object} data - Données de mise à jour
 * @body {number} [data.amount] - Nouveau montant
 * @body {string} [data.paymentMethod] - Nouvelle méthode de paiement
 * @body {string} [data.reference] - Nouvelle référence
 * @body {string} [data.paymentDate] - Nouvelle date de paiement
 * @returns {Promise<void>}
 */
export const updateFeePayment = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;
    const data = req.body;

    console.log("📥 Mise à jour paiement - ID:", id, "Données:", data);

    // Valider les données
    try {
      FeePaymentUpdateSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        await createAuditLog({
          ...auditData,
          action: "UPDATE_FEE_PAYMENT_ATTEMPT",
          entity: "FeePayment",
          entityId: id,
          description:
            "Tentative de mise à jour de paiement - validation des données échouée",
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

    // Récupérer l'ancien paiement AVANT modification
    const oldPayment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        studentFee: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!oldPayment) {
      await createAuditLog({
        ...auditData,
        action: "UPDATE_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        entityId: id,
        description: "Tentative de mise à jour de paiement - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Mise à jour en transaction pour garantir la cohérence
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le paiement
      const updatedPayment = await tx.feePayment.update({
        where: { id },
        data: {
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          reference: data.reference || null,
          paymentDate: data.paymentDate
            ? new Date(data.paymentDate)
            : undefined,
          description: data.description,
        },
      });

      // 2. Recalculer le paidAmount total pour les frais étudiants
      if (data.amount !== undefined && data.amount !== oldPayment.amount) {
        const allPayments = await tx.feePayment.findMany({
          where: { studentFeeId: oldPayment.studentFeeId },
        });

        const newPaidAmount = allPayments.reduce((sum, payment) => {
          // Utiliser le nouveau montant pour le paiement modifié
          if (payment.id === id) {
            return sum + data.amount;
          }
          return sum + payment.amount;
        }, 0);

        // Déterminer le nouveau statut
        let newStatus = "pending";
        if (newPaidAmount >= oldPayment.studentFee.totalAmount) {
          newStatus = "paid";
        } else if (newPaidAmount > 0) {
          newStatus = "partial";
        }

        // 3. Mettre à jour les frais étudiants
        await tx.studentFee.update({
          where: { id: oldPayment.studentFeeId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });

        console.log("✅ Frais étudiants mis à jour:", {
          studentFeeId: oldPayment.studentFeeId,
          oldPaidAmount: oldPayment.studentFee.paidAmount,
          newPaidAmount,
          newStatus,
        });
      }

      return updatedPayment;
    });

    // Récupérer les données fraîches pour la réponse
    const freshPayment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        studentFee: {
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
        },
      },
    });

    console.log("✅ Paiement et frais mis à jour avec succès");

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "UPDATE_FEE_PAYMENT_SUCCESS",
      entity: "FeePayment",
      entityId: id,
      description: "Paiement mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        oldAmount: oldPayment.amount,
        newAmount: data.amount,
        studentFeeId: oldPayment.studentFeeId,
      },
    });

    res.json(freshPayment);
  } catch (error) {
    console.error("❌ Erreur mise à jour paiement:", error);
    const errorMessage = getErrorMessage(error);

    await createAuditLog({
      ...auditData,
      action: "UPDATE_FEE_PAYMENT_ERROR",
      entity: "FeePayment",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour du paiement",
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
 * @function deleteFeePayment
 * @description Supprime un paiement et met à jour le solde de l'étudiant
 * @route DELETE /api/fee-payments/:id
 * @access Admin
 * @param {string} id - ID du paiement à supprimer
 * @returns {Promise<void>}
 */
export const deleteFeePayment = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    console.log("🗑️ Suppression paiement - ID:", id);

    // Log de tentative de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_FEE_PAYMENT_ATTEMPT",
      entity: "FeePayment",
      entityId: id,
      description: "Tentative de suppression de paiement",
      status: "SUCCESS",
    });

    // Récupérer le paiement avant suppression
    const feePayment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        studentFee: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
          },
        },
      },
    });

    if (!feePayment) {
      await createAuditLog({
        ...auditData,
        action: "DELETE_FEE_PAYMENT_ATTEMPT",
        entity: "FeePayment",
        entityId: id,
        description: "Tentative de suppression de paiement - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Suppression en transaction
    await prisma.$transaction(async (tx) => {
      // Supprimer le paiement
      await tx.feePayment.delete({ where: { id } });

      // Mettre à jour les frais étudiants
      const studentFee = await tx.studentFee.findUnique({
        where: { id: feePayment.studentFeeId },
      });

      if (studentFee) {
        const newPaidAmount = studentFee.paidAmount - feePayment.amount;
        let newStatus = studentFee.status;

        if (newPaidAmount >= studentFee.totalAmount) {
          newStatus = "paid";
        } else if (newPaidAmount > 0) {
          newStatus = "partial";
        } else {
          newStatus = "pending";
        }

        await tx.studentFee.update({
          where: { id: feePayment.studentFeeId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });

        console.log(
          "✅ Frais étudiant mis à jour après suppression du paiement"
        );
      }
    });

    console.log("✅ Paiement supprimé:", id);

    // Log de suppression réussie
    await createAuditLog({
      ...auditData,
      action: "DELETE_FEE_PAYMENT_SUCCESS",
      entity: "FeePayment",
      entityId: id,
      description: "Paiement supprimé avec succès",
      status: "SUCCESS",
      metadata: {
        studentFeeId: feePayment.studentFeeId,
        amount: feePayment.amount,
        paymentMethod: feePayment.paymentMethod,
        studentName: `${feePayment.studentFee.student.firstName} ${feePayment.studentFee.student.lastName}`,
        studentCode: feePayment.studentFee.student.studentCode,
      },
    });

    res.json({ message: "Paiement supprimé" });
  } catch (error) {
    console.error("❌ Erreur suppression paiement:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_FEE_PAYMENT_ERROR",
      entity: "FeePayment",
      entityId: req.params.id,
      description: "Erreur lors de la suppression du paiement",
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
 * @function getPaymentHistory
 * @description Récupère l'historique complet des paiements pour des frais étudiants spécifiques
 * @route GET /api/fee-payments/history/:studentFeeId
 * @access Staff/Admin
 * @param {string} studentFeeId - ID des frais étudiants
 * @returns {Promise<void>}
 */
export const getPaymentHistory = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).user?.id || (req as any).userId || null,
  };

  try {
    const { studentFeeId } = req.params;

    console.log("📥 Historique paiements - StudentFee ID:", studentFeeId);

    const payments = await prisma.feePayment.findMany({
      where: { studentFeeId },
      orderBy: { paymentDate: "desc" },
      include: {
        studentFee: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
          },
        },
      },
    });

    // Log de consultation d'historique
    await createAuditLog({
      ...auditData,
      action: "GET_PAYMENT_HISTORY",
      entity: "FeePayment",
      description: "Consultation de l'historique des paiements",
      status: "SUCCESS",
      metadata: {
        studentFeeId,
        count: payments.length,
        totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      },
    });

    res.json(payments);
  } catch (error) {
    console.error("❌ Erreur récupération historique paiements:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_PAYMENT_HISTORY_ERROR",
      entity: "FeePayment",
      description:
        "Erreur lors de la récupération de l'historique des paiements",
      status: "ERROR",
      errorMessage: errorMessage,
      metadata: {
        studentFeeId: req.params.studentFeeId,
      },
    });

    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
