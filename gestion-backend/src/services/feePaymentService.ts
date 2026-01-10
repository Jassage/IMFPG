/**
 * @file feePaymentService.ts
 * @description Service pour la gestion des paiements de frais scolaires
 * @module Services/FeePayments
 *
 * Ce service gère :
 * - L'enregistrement des paiements
 * - La consultation des historiques de paiement
 * - La mise à jour des paiements
 * - La suppression des paiements
 * - Le recalcul automatique des soldes étudiants
 */

import { PrismaClient } from "../../generated/prisma";

// import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

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
  description: z.string().optional().nullable(),
});

/**
 * @constant FeePaymentUpdateSchema
 * @description Schéma Zod pour la validation de la mise à jour de paiement
 */
const FeePaymentUpdateSchema = FeePaymentCreateSchema.partial();

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
 * @class FeePaymentService
 * @description Service pour la gestion des paiements de frais scolaires
 */
export class FeePaymentService {
  /**
   * Récupère tous les paiements avec filtres optionnels
   */
  static async getAllFeePayments(filters: { studentFeeId?: string }) {
    const { studentFeeId } = filters;

    console.log("📥 Consultation de tous les paiements - Filtre:", {
      studentFeeId,
    });

    const whereClause: any = {};
    if (studentFeeId) whereClause.studentFeeId = studentFeeId;

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

    return {
      success: true,
      data: feePayments,
      metadata: {
        count: feePayments.length,
        studentFeeFilter: studentFeeId || "none",
      },
    };
  }

  /**
   * Récupère un paiement spécifique par son ID
   */
  static async getFeePaymentById(id: string) {
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
      throw {
        status: 404,
        message: "Paiement non trouvé",
      };
    }

    return {
      success: true,
      data: feePayment,
      metadata: {
        studentFeeId: feePayment.studentFeeId,
        amount: feePayment.amount,
        paymentMethod: feePayment.paymentMethod,
      },
    };
  }

  /**
   * Crée un nouveau paiement et met à jour automatiquement le solde de l'étudiant
   */
  static async createFeePayment(data: {
    studentFeeId: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    paymentDate?: string;
    description?: string;
    userId?: string;
  }) {
    const {
      studentFeeId,
      amount,
      paymentMethod,
      reference,
      paymentDate,
      description,
      userId,
    } = data;

    console.log("📥 Création paiement - Données:", data);

    // Valider les données avec Zod
    try {
      FeePaymentCreateSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        throw {
          status: 400,
          message: "Données de validation invalides",
          details: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        };
      }
      throw validationError;
    }

    // Validation des données
    if (!studentFeeId || !amount || !paymentMethod) {
      throw {
        status: 400,
        message: "Données manquantes",
      };
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
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    // Vérifier que le montant ne dépasse pas le reste à payer
    const remainingAmount = studentFee.totalAmount - studentFee.paidAmount;
    if (amount > remainingAmount) {
      throw {
        status: 400,
        message: `Le montant dépasse le reste à payer (${remainingAmount} HTG)`,
        metadata: {
          studentFeeId,
          amount,
          remainingAmount,
          totalAmount: studentFee.totalAmount,
          paidAmount: studentFee.paidAmount,
        },
      };
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
          description: description || null,
          recordedBy: userId || "admin",
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

    return {
      success: true,
      message: "Paiement créé avec succès",
      data: result,
      metadata: {
        studentFeeId,
        amount,
        paymentMethod,
        reference,
        description,
        studentName: `${result.studentFee.student.firstName} ${result.studentFee.student.lastName}`,
        studentId: result.studentFee.student.studentCode,
        newStatus: result.studentFee.status,
        newPaidAmount: result.studentFee.paidAmount,
      },
    };
  }

  /**
   * Récupère les paiements avec filtres
   */
  static async getFeePayments(filters: { studentFeeId?: string }) {
    const { studentFeeId } = filters;

    console.log("📥 Consultation paiements - Filtre:", { studentFeeId });

    const whereClause: any = {};
    if (studentFeeId) whereClause.studentFeeId = studentFeeId;

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

    return {
      success: true,
      data: payments,
      metadata: {
        count: payments.length,
        studentFeeFilter: studentFeeId || "none",
      },
    };
  }

  /**
   * Met à jour un paiement existant et recalcule automatiquement le solde
   */
  static async updateFeePayment(
    id: string,
    data: {
      amount?: number;
      paymentMethod?: string;
      reference?: string;
      paymentDate?: string;
      description?: string;
    }
  ) {
    console.log("📥 Mise à jour paiement - ID:", id, "Données:", data);

    // Valider les données
    try {
      FeePaymentUpdateSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);

        throw {
          status: 400,
          message: "Données de validation invalides",
          details: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        };
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
      throw {
        status: 404,
        message: "Paiement non trouvé",
      };
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

        const newPaidAmount = allPayments.reduce(
          (sum: number, payment: { id: string; amount: any }) => {
            // Utiliser le nouveau montant pour le paiement modifié
            if (payment.id === id) {
              return sum + (data.amount || 0);
            }
            return sum + payment.amount;
          },
          0
        );

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

    return {
      success: true,
      message: "Paiement mis à jour avec succès",
      data: freshPayment,
      metadata: {
        oldAmount: oldPayment.amount,
        newAmount: data.amount,
        studentFeeId: oldPayment.studentFeeId,
      },
    };
  }

  /**
   * Supprime un paiement et met à jour le solde de l'étudiant
   */
  static async deleteFeePayment(id: string) {
    console.log("🗑️ Suppression paiement - ID:", id);

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
      throw {
        status: 404,
        message: "Paiement non trouvé",
      };
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

    return {
      success: true,
      message: "Paiement supprimé",
      metadata: {
        studentFeeId: feePayment.studentFeeId,
        amount: feePayment.amount,
        paymentMethod: feePayment.paymentMethod,
        studentName: `${feePayment.studentFee.student.firstName} ${feePayment.studentFee.student.lastName}`,
        studentCode: feePayment.studentFee.student.studentCode,
      },
    };
  }

  /**
   * Récupère l'historique complet des paiements pour des frais étudiants spécifiques
   */
  static async getPaymentHistory(studentFeeId: string) {
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

    return {
      success: true,
      data: payments,
      metadata: {
        studentFeeId,
        count: payments.length,
        totalAmount: payments.reduce(
          (sum: any, payment: { amount: any }) => sum + payment.amount,
          0
        ),
      },
    };
  }
}
