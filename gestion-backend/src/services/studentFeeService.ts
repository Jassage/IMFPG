/**
 * @file studentFeeService.ts
 * @description Service pour la gestion des frais étudiants
 * @module Services/StudentFees
 *
 * Ce service gère :
 * - L'attribution de frais aux étudiants
 * - La consultation des frais étudiants
 * - La mise à jour du statut des frais
 * - La suppression des frais
 * - Le suivi des paiements
 */

import { z } from "zod";
import prisma from "../prisma";

/**
 * @constant AssignFeeSchema
 * @description Schéma Zod pour la validation de l'attribution de frais
 */
const AssignFeeSchema = z.object({
  studentId: z.string().min(1, "L'ID étudiant est requis"),
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
 * @class StudentFeeService
 * @description Service pour la gestion des frais étudiants
 */
export class StudentFeeService {
  /**
   * Récupère tous les frais étudiants avec filtres optionnels
   */
  static async getAllStudentFees(filters: {
    studentId?: string;
    academicYear?: string;
  }) {
    const { studentId, academicYear } = filters;

    console.log("📥 Consultation tous les frais étudiants - Filtres:", {
      studentId,
      academicYear,
    });

    const whereClause: any = {};
    if (studentId) whereClause.studentId = studentId;
    if (academicYear) {
      whereClause.feeStructure = {
        academicYear: academicYear,
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

    return {
      success: true,
      data: studentFees,
      metadata: {
        count: studentFees.length,
        studentFilter: studentId || "none",
        academicYearFilter: academicYear || "none",
        statusSummary: {
          pending: studentFees.filter(
            (f: { status: string }) => f.status === "pending"
          ).length,
          partial: studentFees.filter(
            (f: { status: string }) => f.status === "partial"
          ).length,
          paid: studentFees.filter(
            (f: { status: string }) => f.status === "paid"
          ).length,
          overdue: studentFees.filter(
            (f: { status: string }) => f.status === "overdue"
          ).length,
        },
      },
    };
  }

  /**
   * Récupère les frais d'un étudiant par son ID
   */
  static async getStudentFeeById(id: string) {
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
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    return {
      success: true,
      data: studentFee,
      metadata: {
        studentId: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        feeStructure: studentFee.feeStructure.name,
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        status: studentFee.status,
        paymentsCount: studentFee.payments.length,
      },
    };
  }

  /**
   * Met à jour les frais d'un étudiant
   */
  static async updateStudentFee(
    id: string,
    data: {
      dueDate?: string;
      status?: "pending" | "partial" | "paid" | "overdue";
    }
  ) {
    console.log("📥 Mise à jour frais étudiant - ID:", id, "Données:", data);

    // Valider les données avec Zod
    try {
      StudentFeeUpdateSchema.parse(data);
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
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    const updatedStudentFee = await prisma.studentFee.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
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
      },
    });

    console.log("✅ Frais étudiant mis à jour:", id);

    return {
      success: true,
      message: "Frais étudiant mis à jour avec succès",
      data: updatedStudentFee,
      metadata: {
        studentId: updatedStudentFee.studentId,
        studentName: `${updatedStudentFee.student.firstName} ${updatedStudentFee.student.lastName}`,
        updatedFields: Object.keys(data),
        oldStatus: existingStudentFee.status,
        newStatus: updatedStudentFee.status,
      },
    };
  }

  /**
   * Supprime les frais d'un étudiant (si aucun paiement associé)
   */
  static async deleteStudentFee(id: string) {
    console.log("🗑️ Suppression frais étudiant - ID:", id);

    // Vérifier s'il y a des paiements associés
    const payments = await prisma.feePayment.findMany({
      where: { studentFeeId: id },
    });

    if (payments.length > 0) {
      throw {
        status: 400,
        message:
          "Impossible de supprimer ces frais car des paiements y sont associés",
        details: `${payments.length} paiement(s) associé(s) trouvé(s)`,
        metadata: {
          paymentsCount: payments.length,
          totalPaymentsAmount: payments.reduce(
            (sum: any, payment: { amount: any }) => sum + payment.amount,
            0
          ),
        },
      };
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
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    await prisma.studentFee.delete({ where: { id } });

    console.log("✅ Frais étudiant supprimé:", id);

    return {
      success: true,
      message: "Frais étudiant supprimés",
      metadata: {
        studentId: studentFeeToDelete.studentId,
        studentName: `${studentFeeToDelete.student.firstName} ${studentFeeToDelete.student.lastName}`,
        feeStructure: studentFeeToDelete.feeStructure.name,
        totalAmount: studentFeeToDelete.totalAmount,
        status: studentFeeToDelete.status,
      },
    };
  }

  /**
   * Attribue une structure de frais à un étudiant pour une année académique
   */
  static async assignFeeToStudent(data: {
    studentId: string;
    feeStructureId: string;
    academicYearId: string;
  }) {
    const { studentId, feeStructureId, academicYearId } = data;

    console.log("📥 Attribution frais à étudiant - Données:", data);

    // Valider les données avec Zod
    try {
      AssignFeeSchema.parse(data);
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

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw {
        status: 404,
        message: "Étudiant non trouvé",
      };
    }

    // Vérifier si la structure de frais existe
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });
    if (!feeStructure) {
      throw {
        status: 404,
        message: "Structure de frais non trouvée",
      };
    }

    // Vérifier si l'année académique existe
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });
    if (!academicYear) {
      throw {
        status: 404,
        message: "Année académique non trouvée",
      };
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
      throw {
        status: 400,
        message: "Des frais existent déjà pour cette combinaison",
      };
    }

    // Créer les frais étudiants
    const studentFee = await prisma.studentFee.create({
      data: {
        student: { connect: { id: studentId } },
        feeStructure: { connect: { id: feeStructureId } },
        academicYear: { connect: { id: academicYearId } },
        originalAmount: feeStructure.amount,
        discountAmount: 0,
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

    return {
      success: true,
      message: "Frais attribués avec succès",
      data: studentFee,
      metadata: {
        studentId: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        feeStructure: studentFee.feeStructure.name,
        academicYear: studentFee.academicYear.year,
        totalAmount: studentFee.totalAmount,
        dueDate: studentFee.dueDate,
      },
    };
  }

  /**
   * Récupère les frais d'un étudiant pour une année académique spécifique
   */
  static async getStudentFeeByStudentAndYear(
    studentId: string,
    academicYearId: string
  ) {
    console.log(
      "📥 Consultation frais par étudiant et année - Student:",
      studentId,
      "Année:",
      academicYearId
    );

    const studentFee = await prisma.studentFee.findFirst({
      where: {
        studentId,
        academicYearId: academicYearId,
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
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    return {
      success: true,
      data: studentFee,
      metadata: {
        studentId: studentFee.studentId,
        studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
        academicYear: academicYearId,
        feeStructure: studentFee.feeStructure.name,
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        status: studentFee.status,
        paymentsCount: studentFee.payments.length,
      },
    };
  }

  /**
   * Génère l'état des paiements (rapport) pour une classe ou un niveau,
   * pour une année académique donnée : liste des élèves avec montant
   * attendu, versé et restant, plus les totaux agrégés.
   */
  static async getFeeReportByClass(filters: {
    classId?: string;
    classLevel?: string;
    academicYearId: string;
  }) {
    const { classId, classLevel, academicYearId } = filters;

    if (!academicYearId) {
      throw {
        status: 400,
        message: "L'ID de l'année académique est requis",
      };
    }

    const enrollmentWhere: any = {
      academicYearId,
      status: "Active",
    };
    if (classId) {
      enrollmentWhere.classId = classId;
    } else if (classLevel) {
      enrollmentWhere.schoolClass = { level: classLevel };
    }

    const enrollments = await prisma.enrollment.findMany({
      where: enrollmentWhere,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        schoolClass: { select: { id: true, name: true, level: true } },
      },
    });

    const emptySummary = {
      totalStudents: 0,
      totalExpected: 0,
      totalCollected: 0,
      totalRemaining: 0,
    };

    if (enrollments.length === 0) {
      return {
        success: true,
        data: { students: [], summary: emptySummary },
      };
    }

    const studentIds = enrollments.map((e) => e.studentId);

    const studentFees = await prisma.studentFee.findMany({
      where: { academicYearId, studentId: { in: studentIds } },
    });

    const feesByStudent = new Map<string, typeof studentFees>();
    for (const fee of studentFees) {
      const list = feesByStudent.get(fee.studentId) || [];
      list.push(fee);
      feesByStudent.set(fee.studentId, list);
    }

    const students = enrollments
      .map((e) => {
        const fees = feesByStudent.get(e.studentId) || [];
        const totalAmount = fees.reduce((sum, f) => sum + f.totalAmount, 0);
        const paidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
        const remaining = totalAmount - paidAmount;

        let status: string;
        if (fees.length === 0) status = "non_assigne";
        else if (remaining <= 0) status = "paid";
        else if (paidAmount > 0) status = "partial";
        else status = "pending";

        return {
          studentId: e.studentId,
          firstName: e.student.firstName,
          lastName: e.student.lastName,
          studentCode: e.student.studentCode,
          className: e.schoolClass.name,
          classLevel: e.schoolClass.level,
          totalAmount,
          paidAmount,
          remaining,
          status,
        };
      })
      .sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`,
          "fr"
        )
      );

    const summary = students.reduce(
      (acc, s) => {
        acc.totalExpected += s.totalAmount;
        acc.totalCollected += s.paidAmount;
        acc.totalRemaining += s.remaining;
        return acc;
      },
      { ...emptySummary, totalStudents: students.length }
    );

    return {
      success: true,
      data: { students, summary },
    };
  }

  /**
   * Récupère tous les frais d'un étudiant (toutes années confondues)
   */
  static async getStudentFeesByStudent(studentId: string) {
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

    return {
      success: true,
      data: studentFees,
      metadata: {
        studentId,
        count: studentFees.length,
        totalAmount: studentFees.reduce(
          (sum: any, fee: { totalAmount: any }) => sum + fee.totalAmount,
          0
        ),
        totalPaid: studentFees.reduce(
          (sum: any, fee: { paidAmount: any }) => sum + fee.paidAmount,
          0
        ),
        statusSummary: {
          pending: studentFees.filter(
            (f: { status: string }) => f.status === "pending"
          ).length,
          partial: studentFees.filter(
            (f: { status: string }) => f.status === "partial"
          ).length,
          paid: studentFees.filter(
            (f: { status: string }) => f.status === "paid"
          ).length,
          overdue: studentFees.filter(
            (f: { status: string }) => f.status === "overdue"
          ).length,
        },
      },
    };
  }

  /**
   * Attribue une structure de frais à tous les élèves activement inscrits
   * dans un niveau de classe, pour une année académique donnée.
   * Les élèves ayant déjà ces frais sont ignorés (pas de doublon).
   */
  static async assignFeeToClassLevel(data: {
    feeStructureId: string;
    classLevel: string;
    academicYearId: string;
  }) {
    const { feeStructureId, classLevel, academicYearId } = data;

    console.log("📥 Attribution frais à un niveau - Données:", data);

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });
    if (!feeStructure) {
      throw {
        status: 404,
        message: "Structure de frais non trouvée",
      };
    }

    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });
    if (!academicYear) {
      throw {
        status: 404,
        message: "Année académique non trouvée",
      };
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        academicYearId,
        status: "Active",
        schoolClass: { level: classLevel as any },
      },
      select: { studentId: true },
    });

    if (enrollments.length === 0) {
      return {
        success: true,
        message: "Aucun élève actif trouvé pour ce niveau et cette année",
        data: { assignedCount: 0, skippedCount: 0 },
      };
    }

    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];

    const existingFees = await prisma.studentFee.findMany({
      where: {
        feeStructureId,
        academicYearId,
        studentId: { in: studentIds },
      },
      select: { studentId: true },
    });
    const existingStudentIds = new Set(existingFees.map((f) => f.studentId));

    const toCreate = studentIds.filter((id) => !existingStudentIds.has(id));

    if (toCreate.length === 0) {
      return {
        success: true,
        message: "Tous les élèves de ce niveau ont déjà ces frais attribués",
        data: { assignedCount: 0, skippedCount: studentIds.length },
      };
    }

    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.studentFee.createMany({
      data: toCreate.map((studentId) => ({
        studentId,
        feeStructureId,
        academicYearId,
        originalAmount: feeStructure.amount,
        discountAmount: 0,
        totalAmount: feeStructure.amount,
        paidAmount: 0,
        status: "pending",
        dueDate,
      })),
    });

    console.log(
      `✅ Frais attribués à ${toCreate.length} élève(s) du niveau ${classLevel}`
    );

    return {
      success: true,
      message: `Frais attribués à ${toCreate.length} élève(s)`,
      data: {
        assignedCount: toCreate.length,
        skippedCount: studentIds.length - toCreate.length,
      },
    };
  }

  /**
   * Applique (ou retire, avec discountAmount = 0) une réduction sur les
   * frais d'un étudiant. Le montant dû (totalAmount) est recalculé à
   * partir du montant initial (originalAmount).
   */
  static async applyDiscount(
    id: string,
    data: { discountAmount: number; discountReason?: string }
  ) {
    const { discountAmount, discountReason } = data;

    console.log("📥 Application réduction frais étudiant - ID:", id, "Données:", data);

    const existingStudentFee = await prisma.studentFee.findUnique({
      where: { id },
    });

    if (!existingStudentFee) {
      throw {
        status: 404,
        message: "Frais étudiant non trouvé",
      };
    }

    if (discountAmount < 0) {
      throw {
        status: 400,
        message: "Le montant de la réduction doit être positif ou nul",
      };
    }

    const originalAmount =
      existingStudentFee.originalAmount || existingStudentFee.totalAmount;

    if (discountAmount > originalAmount) {
      throw {
        status: 400,
        message: "La réduction ne peut pas dépasser le montant initial des frais",
      };
    }

    const newTotalAmount = originalAmount - discountAmount;

    let status = existingStudentFee.status;
    if (newTotalAmount <= existingStudentFee.paidAmount) {
      status = "paid";
    } else if (existingStudentFee.paidAmount > 0) {
      status = "partial";
    } else if (status === "paid") {
      status = "pending";
    }

    const updatedStudentFee = await prisma.studentFee.update({
      where: { id },
      data: {
        originalAmount,
        discountAmount,
        discountReason: discountReason ?? null,
        totalAmount: newTotalAmount,
        status,
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
      },
    });

    console.log("✅ Réduction appliquée sur les frais:", id);

    return {
      success: true,
      message: "Réduction appliquée avec succès",
      data: updatedStudentFee,
      metadata: {
        studentId: updatedStudentFee.studentId,
        studentName: `${updatedStudentFee.student.firstName} ${updatedStudentFee.student.lastName}`,
        originalAmount: updatedStudentFee.originalAmount,
        discountAmount: updatedStudentFee.discountAmount,
        totalAmount: updatedStudentFee.totalAmount,
        status: updatedStudentFee.status,
      },
    };
  }
}
