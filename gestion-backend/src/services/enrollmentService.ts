/**
 * @file enrollmentService.ts
 * @description Service pour la gestion des inscriptions
 * @version 1.0.0
 */

import { PrismaClient, Prisma } from "../../generated/prisma";
import { DefaultArgs } from "../../generated/prisma/runtime/library";
import { AuditData } from "../types/auth";

const prisma = new PrismaClient();

// Interfaces
export interface EnrollmentFilters {
  page?: number;
  limit?: number;
  academicYearId?: string;
  classId?: string;
  studentId?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateEnrollmentData {
  studentId: string;
  classId: string;
  academicYearId: string;
  enrollmentDate?: string;
  assignFees?: boolean;
  selectedFeeStructures?: string[];
}

export interface UpdateEnrollmentData {
  classId?: string;
  status?: string;
}

export interface ReenrollmentData {
  studentId: string;
  classId: string;
  academicYearId: string;
  enrollmentDate?: string;
  notes?: string;
}

export interface BulkEnrollmentData {
  studentId: string;
  classId: string;
  academicYearId: string;
  enrollmentDate?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * Service pour la gestion des inscriptions
 */
export class EnrollmentService {
  /**
   * Récupère la liste des inscriptions
   */
  async getEnrollments(filters: EnrollmentFilters, auditData: AuditData) {
    try {
      const {
        page = 1,
        limit = 20,
        academicYearId,
        classId,
        studentId,
        status,
        search,
        sortBy = "enrollmentDate",
        sortOrder = "desc",
      } = filters;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      // Filtres
      const where: any = {};

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      if (classId) {
        where.classId = classId;
      }

      if (studentId) {
        where.studentId = studentId;
      }

      if (status && status !== "all") {
        where.status = status;
      }

      // Recherche par nom d'étudiant
      if (search) {
        where.student = {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { studentCode: { contains: search } },
          ],
        };
      }

      // Récupération avec pagination
      const [enrollments, total] = await Promise.all([
        prisma.enrollment.findMany({
          where,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                photo: true,
              },
            },
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
                capacity: true,
              },
            },
            academicYear: true,
          },
          orderBy: {
            [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
          },
          skip,
          take: limitNum,
        }),
        prisma.enrollment.count({ where }),
      ]);

      return {
        success: true,
        message: "Inscriptions récupérées avec succès",
        data: {
          enrollments,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - getEnrollments error:", error);
      throw error;
    }
  }

  /**
   * Récupère une inscription par ID
   */
  async getEnrollmentById(id: string, auditData: AuditData) {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
              phone: true,
              dateOfBirth: true,
              photo: true,
            },
          },
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
              capacity: true,
            },
          },
          academicYear: true,
          previousEnrollment: {
            include: {
              schoolClass: true,
              academicYear: true,
            },
          },
          nextEnrollments: {
            include: {
              schoolClass: true,
              academicYear: true,
            },
            orderBy: {
              enrollmentDate: "desc",
            },
          },
        },
      });

      if (!enrollment) {
        return {
          success: false,
          message: "Inscription non trouvée",
          code: "ENROLLMENT_NOT_FOUND",
        };
      }

      return {
        success: true,
        message: "Inscription récupérée avec succès",
        data: { enrollment },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - getEnrollmentById error:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle inscription avec option d'attribution de frais
   */
  async createEnrollment(data: CreateEnrollmentData, auditData: AuditData) {
    try {
      const {
        studentId,
        classId,
        academicYearId,
        enrollmentDate,
        assignFees = false,
        selectedFeeStructures = [],
      } = data;

      // Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // Vérifier si la classe existe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      // Vérifier si l'année académique existe
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });

      if (!academicYear) {
        return {
          success: false,
          message: "Année académique non trouvée",
          code: "ACADEMIC_YEAR_NOT_FOUND",
        };
      }

      // Vérifier si l'étudiant est déjà inscrit pour cette année
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId,
          },
        },
      });

      if (existingEnrollment) {
        return {
          success: false,
          message: "Cet étudiant est déjà inscrit pour cette année académique",
          code: "ENROLLMENT_EXISTS",
        };
      }

      // Vérifier la capacité de la classe
      const currentEnrollments = await prisma.enrollment.count({
        where: {
          classId,
          academicYearId,
          status: "Active",
        },
      });

      if (currentEnrollments >= (schoolClass.capacity || 30)) {
        return {
          success: false,
          message: "La classe a atteint sa capacité maximale",
          code: "CLASS_FULL",
          data: {
            capacity: schoolClass.capacity,
            current: currentEnrollments,
          },
        };
      }

      // Créer l'inscription
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          classId,
          academicYearId,
          enrollmentDate: enrollmentDate
            ? new Date(enrollmentDate)
            : new Date(),
          status: "Active",
          isReenrollment: false,
        },
        include: {
          student: true,
          schoolClass: true,
          academicYear: true,
        },
      });

      // Mettre à jour la classe de l'étudiant
      await prisma.student.update({
        where: { id: studentId },
        data: {
          classId,
          status: "Active",
        },
      });

      // Gérer l'attribution des frais
      let feeAssignmentResult = null;
      if (assignFees) {
        feeAssignmentResult = await this.assignFeesOnEnrollment(
          studentId,
          academicYearId,
          selectedFeeStructures
        );
      }

      return {
        success: true,
        message: "Inscription créée avec succès",
        data: {
          enrollment,
          ...(feeAssignmentResult && { feeAssignment: feeAssignmentResult }),
        },
        metadata: {
          studentId,
          classId,
          academicYearId,
          studentCode: student.studentCode,
          className: schoolClass.name,
          feesAssigned: assignFees,
          feeStructures: selectedFeeStructures.length,
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - createEnrollment error:", error);
      throw error;
    }
  }

  /**
   * Met à jour une inscription
   */
  async updateEnrollment(
    id: string,
    data: UpdateEnrollmentData,
    auditData: AuditData
  ) {
    try {
      const { classId, status } = data;

      // Vérifier si l'inscription existe
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: {
          student: true,
        },
      });

      if (!enrollment) {
        return {
          success: false,
          message: "Inscription non trouvée",
          code: "ENROLLMENT_NOT_FOUND",
        };
      }

      // Vérifier si la nouvelle classe existe (si changement)
      if (classId && classId !== enrollment.classId) {
        const schoolClass = await prisma.schoolClass.findUnique({
          where: { id: classId },
        });

        if (!schoolClass) {
          return {
            success: false,
            message: "Nouvelle classe non trouvée",
            code: "CLASS_NOT_FOUND",
          };
        }
      }

      // Mettre à jour
      const updateData: any = {};
      if (typeof classId !== "undefined") {
        updateData.classId = classId;
      }
      if (typeof status !== "undefined") {
        updateData.status = status;
      }

      const updatedEnrollment = await prisma.enrollment.update({
        where: { id },
        data: updateData,
        include: {
          student: true,
          schoolClass: true,
          academicYear: true,
        },
      });

      // Mettre à jour la classe de l'étudiant si nécessaire
      if (classId && classId !== enrollment.classId) {
        await prisma.student.update({
          where: { id: enrollment.studentId },
          data: {
            classId,
          },
        });
      }

      return {
        success: true,
        message: "Inscription mise à jour avec succès",
        data: { enrollment: updatedEnrollment },
        metadata: {
          oldStatus: enrollment.status,
          newStatus: status,
          oldClassId: enrollment.classId,
          newClassId: classId,
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - updateEnrollment error:", error);
      throw error;
    }
  }

  /**
   * Désinscrit un étudiant
   */
  async unenrollStudent(id: string, reason: string, auditData: AuditData) {
    try {
      const unenrollReason = reason || "Non spécifié par l'utilisateur";
      // Vérifier si l'inscription existe
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: {
          student: true,
        },
      });

      if (!enrollment) {
        return {
          success: false,
          message: "Inscription non trouvée",
          code: "ENROLLMENT_NOT_FOUND",
        };
      }

      // Désinscrire
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id },
        data: {
          status: "Suspended",
        },
      });

      // Mettre à jour le statut de l'étudiant
      await prisma.student.update({
        where: { id: enrollment.studentId },
        data: {
          status: "Inactive",
        },
      });

      return {
        success: true,
        message: "Étudiant désinscrit avec succès",
        data: { enrollment: updatedEnrollment },
        metadata: {
          studentCode: enrollment.student.studentCode,
          reason,
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - unenrollStudent error:", error);
      throw error;
    }
  }

  /**
   * Gère la réinscription d'un étudiant
   */
  // async reenrollStudent(data: ReenrollmentData, auditData: AuditData) {
  //   try {
  //     const { studentId, classId, academicYearId, enrollmentDate, notes } =
  //       data;

  //     // Vérifier si l'étudiant existe
  //     const student = await prisma.student.findUnique({
  //       where: { id: studentId },
  //     });

  //     if (!student) {
  //       return {
  //         success: false,
  //         message: "Étudiant non trouvé",
  //         code: "STUDENT_NOT_FOUND",
  //       };
  //     }

  //     // Récupérer l'année précédente
  //     const previousYear = await prisma.academicYear.findFirst({
  //       where: {
  //         isCurrent: false,
  //       },
  //       orderBy: {
  //         endDate: "desc",
  //       },
  //       take: 1,
  //     });

  //     console.log("Previews Year:", previousYear);

  //     if (!previousYear) {
  //       return {
  //         success: false,
  //         message: "Aucune année académique précédente trouvée",
  //         code: "NO_PREVIOUS_YEAR",
  //       };
  //     }

  //     // Vérifier l'inscription précédente
  //     const previousEnrollment = await prisma.enrollment.findUnique({
  //       where: {
  //         studentId_academicYearId: {
  //           studentId,
  //           academicYearId: previousYear.id,
  //         },
  //       },
  //     });
  //     console.log("previousEnrollment:", previousEnrollment);

  //     if (!previousEnrollment) {
  //       return {
  //         success: false,
  //         message: "L'étudiant n'était pas inscrit l'année précédente",
  //         code: "NO_PREVIOUS_ENROLLMENT",
  //       };
  //     }

  //     // Vérifier l'année académique cible
  //     const targetYear = await prisma.academicYear.findUnique({
  //       where: { id: academicYearId },
  //     });

  //     if (!targetYear) {
  //       return {
  //         success: false,
  //         message: "Année académique cible non trouvée",
  //         code: "TARGET_YEAR_NOT_FOUND",
  //       };
  //     }

  //     // Vérifier si l'étudiant est déjà inscrit pour cette année
  //     const existingEnrollment = await prisma.enrollment.findUnique({
  //       where: {
  //         studentId_academicYearId: {
  //           studentId,
  //           academicYearId: targetYear.id,
  //         },
  //       },
  //     });

  //     if (existingEnrollment) {
  //       return {
  //         success: false,
  //         message: "L'étudiant est déjà inscrit pour cette année",
  //         code: "ALREADY_ENROLLED",
  //       };
  //     }

  //     // Vérifier si la classe existe
  //     const schoolClass = await prisma.schoolClass.findUnique({
  //       where: { id: classId },
  //     });

  //     if (!schoolClass) {
  //       return {
  //         success: false,
  //         message: "Classe non trouvée",
  //         code: "CLASS_NOT_FOUND",
  //       };
  //     }

  //     // Vérifier la capacité de la classe
  //     const currentEnrollments = await prisma.enrollment.count({
  //       where: {
  //         classId,
  //         academicYearId: targetYear.id,
  //         status: "Active",
  //       },
  //     });

  //     if (currentEnrollments >= (schoolClass.capacity || 30)) {
  //       return {
  //         success: false,
  //         message: "La classe a atteint sa capacité maximale",
  //         code: "CLASS_FULL",
  //       };
  //     }

  //     // Calculer les frais de réinscription
  //     const reenrollmentFee = await this.calculateReenrollmentFee(
  //       studentId,
  //       previousYear.id,
  //       targetYear.id
  //     );

  //     // Créer la réinscription
  //     const enrollment = await prisma.enrollment.create({
  //       data: {
  //         studentId,
  //         classId,
  //         academicYearId: targetYear.id,
  //         enrollmentDate: enrollmentDate
  //           ? new Date(enrollmentDate)
  //           : new Date(),
  //         status: "Active",
  //         isReenrollment: true,
  //         previousEnrollmentId: previousEnrollment.id,
  //         reenrollmentDate: new Date(),
  //         reenrollmentNotes: notes,
  //       },
  //       include: {
  //         student: true,
  //         schoolClass: true,
  //         academicYear: true,
  //         previousEnrollment: true,
  //       },
  //     });

  //     // Mettre à jour la classe de l'étudiant
  //     await prisma.student.update({
  //       where: { id: studentId },
  //       data: {
  //         classId,
  //         status: "Active",
  //       },
  //     });

  //     // Créer un paiement pour les frais de réinscription
  //     await prisma.payment.create({
  //       data: {
  //         studentId,
  //         amount: reenrollmentFee.amount,
  //         paidDate: new Date(),
  //         paymentMethod: "Bank",
  //         status: "Pending",
  //         description: `Frais de réinscription - ${targetYear.year}`,
  //         type: "Tuition",
  //         academicYearId: targetYear.id,
  //       },
  //     });

  //     // Mettre à jour l'inscription précédente pour référencer la nouvelle
  //     await prisma.enrollment.update({
  //       where: { id: previousEnrollment.id },
  //       data: {
  //         nextEnrollments: {
  //           connect: { id: enrollment.id },
  //         },
  //       },
  //     });

  //     // Créer les frais de scolarité pour la nouvelle année
  //     await this.createStudentFees(studentId, targetYear.id);

  //     return {
  //       success: true,
  //       message: "Étudiant réinscrit avec succès",
  //       data: {
  //         enrollment,
  //         reenrollmentFee,
  //       },
  //       metadata: {
  //         studentId,
  //         classId,
  //         academicYearId: targetYear.id,
  //         reenrollmentFee: reenrollmentFee.amount,
  //         notes,
  //       },
  //     };
  //   } catch (error: any) {
  //     console.error("❌ EnrollmentService - reenrollStudent error:", error);
  //     throw error;
  //   }
  // }

  /**
   * Récupère toutes les années où l'étudiant a été inscrit
   */
  private async getStudentEnrollmentYears(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        academicYear: true,
      },
      orderBy: {
        academicYear: {
          startDate: "desc",
        },
      },
    });

    return enrollments.map((e) => ({
      id: e.academicYearId,
      year: e.academicYear.year,
      enrollmentId: e.id,
      enrollmentDate: e.enrollmentDate,
      status: e.status,
    }));
  }

  /**
   * Valide un étudiant pour la réinscription
   */
  async validateReenrollment(studentId: string, auditData: AuditData) {
    try {
      // Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // Récupérer l'année académique actuelle
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      if (!currentYear) {
        return {
          success: false,
          message: "Aucune année académique courante trouvée",
          code: "NO_CURRENT_YEAR",
        };
      }

      // Récupérer l'année précédente
      const previousYear = await prisma.academicYear.findFirst({
        where: {
          id: { not: currentYear.id },
          endDate: { lt: currentYear.startDate },
        },
        orderBy: {
          endDate: "desc",
        },
        take: 1,
      });

      if (!previousYear) {
        return {
          success: false,
          message: "Aucune année académique précédente trouvée",
          code: "NO_PREVIOUS_YEAR",
        };
      }

      // Vérifier si l'étudiant n'est pas déjà inscrit pour l'année courante
      const currentEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId: currentYear.id,
          },
        },
      });

      if (currentEnrollment) {
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour l'année courante",
          code: "ALREADY_ENROLLED",
          data: {
            currentClass: currentEnrollment.classId,
          },
        };
      }

      // Vérifier l'inscription précédente
      const previousEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId: previousYear.id,
          },
        },
        include: {
          schoolClass: true,
        },
      });

      if (!previousEnrollment) {
        return {
          success: false,
          message: "L'étudiant n'était pas inscrit l'année précédente",
          code: "NO_PREVIOUS_ENROLLMENT",
        };
      }

      // Vérifier les résultats académiques (si disponibles)
      const grades = await prisma.grade.findMany({
        where: {
          studentId,
          academicYearId: previousYear.id,
        },
        include: {
          subject: true,
        },
      });

      // Vérifier si l'étudiant a validé son année (si des notes existent)
      let passed = true; // Par défaut, on considère qu'il a réussi
      if (grades.length > 0) {
        passed = this.validateAcademicResults(grades);
      }

      // Vérifier la situation financière
      const studentFees = await prisma.studentFee.findMany({
        where: {
          studentId,
          academicYearId: previousYear.id,
        },
        select: {
          id: true,
          totalAmount: true,
          paidAmount: true,
          status: true,
          dueDate: true,
        },
      });

      // Calculer le total dû et payé
      const totalDue = studentFees.reduce(
        (sum, fee) => sum + fee.totalAmount,
        0
      );
      const totalPaid = studentFees.reduce(
        (sum, fee) => sum + fee.paidAmount,
        0
      );
      const balance = totalDue - totalPaid;

      // Récupérer tous les paiements pour les détails
      const allPayments = await prisma.feePayment.findMany({
        where: {
          studentFeeId: {
            in: studentFees.map((sf) => sf.id),
          },
        },
        orderBy: {
          paymentDate: "desc",
        },
      });

      // Vérifier les frais impayés en retard
      const today = new Date();
      const overdueFees = studentFees.filter((fee) => {
        const isUnpaid = fee.totalAmount > fee.paidAmount;
        const isOverdue = fee.dueDate < today;
        return isUnpaid && isOverdue;
      });

      // Déterminer l'éligibilité
      const canReenroll = passed && balance <= 0;
      const hasOverdueFees = overdueFees.length > 0;

      const validation = {
        canReenroll: canReenroll && !hasOverdueFees,
        academicStatus: passed ? "Passed" : "Failed",
        financialStatus:
          balance <= 0
            ? hasOverdueFees
              ? "ClearButOverdue"
              : "Clear"
            : "BalanceDue",
        details: {
          studentInfo: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            studentCode: student.studentCode,
          },
          previousClass: {
            id: previousEnrollment.schoolClass.id,
            name: previousEnrollment.schoolClass.name,
            level: previousEnrollment.schoolClass.level,
          },
          academic: {
            hasGrades: grades.length > 0,
            grades: grades.length > 0 ? grades : [],
            passed,
            averageGrade:
              grades.length > 0
                ? grades.reduce((sum, grade) => sum + grade.grade, 0) /
                  grades.length
                : null,
          },
          financial: {
            totalDue,
            totalPaid,
            balance,
            hasOverdueFees,
            overdueFeesCount: overdueFees.length,
            overdueAmount: overdueFees.reduce(
              (sum, fee) => sum + (fee.totalAmount - fee.paidAmount),
              0
            ),
            outstandingFees: studentFees
              .filter((fee) => fee.totalAmount > fee.paidAmount)
              .map((fee) => ({
                id: fee.id,
                totalAmount: fee.totalAmount,
                paidAmount: fee.paidAmount,
                balance: fee.totalAmount - fee.paidAmount,
                status: fee.status,
                dueDate: fee.dueDate,
                isOverdue: fee.dueDate < today,
              })),
            recentPayments: allPayments.slice(0, 5), // 5 derniers paiements
          },
          eligibility: {
            academicEligible: passed,
            financialEligible: balance <= 0,
            noOverdueFees: !hasOverdueFees,
            notCurrentlyEnrolled: !currentEnrollment,
          },
        },
      };

      // Ajouter un log d'audit

      return {
        success: true,
        message: "Validation de réinscription terminée",
        data: { validation },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - validateReenrollment error:",
        error
      );

      // Journaliser l'erreur pour l'audit

      throw error;
    }
  }

  /**
   * Récupère les inscriptions d'un étudiant
   */
  async getStudentEnrollments(studentId: string, auditData: AuditData) {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          academicYear: true,
        },
        orderBy: {
          enrollmentDate: "desc",
        },
      });

      return {
        success: true,
        message: "Historique des inscriptions récupéré",
        data: { enrollments },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - getStudentEnrollments error:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'inscription
   */
  async getEnrollmentStats(
    academicYearId: string | undefined,
    auditData: AuditData
  ) {
    try {
      const where: any = {};
      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      // Statistiques par classe
      const classStats = await prisma.enrollment.groupBy({
        by: ["classId"],
        where,
        _count: {
          id: true,
        },
      });

      // Statistiques par statut
      const statusStats = await prisma.enrollment.groupBy({
        by: ["status"],
        where,
        _count: {
          id: true,
        },
      });

      // Total d'inscriptions
      const total = await prisma.enrollment.count({ where });

      // Inscriptions ce mois-ci
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const thisMonth = await prisma.enrollment.count({
        where: {
          ...where,
          enrollmentDate: {
            gte: startOfMonth,
          },
        },
      });

      // Tendances (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const trendQuery = academicYearId
        ? Prisma.sql`
            SELECT 
              DATE(enrollmentDate) as date,
              COUNT(*) as count
            FROM enrollments
            WHERE enrollmentDate >= ${thirtyDaysAgo}
            AND academicYearId = ${academicYearId}
            GROUP BY DATE(enrollmentDate)
            ORDER BY date
          `
        : Prisma.sql`
            SELECT 
              DATE(enrollmentDate) as date,
              COUNT(*) as count
            FROM enrollments
            WHERE enrollmentDate >= ${thirtyDaysAgo}
            GROUP BY DATE(enrollmentDate)
            ORDER BY date
          `;

      const trendData = await prisma.$queryRaw(trendQuery);

      const stats = {
        total,
        thisMonth,
        byClass: classStats.map((stat) => ({
          classId: stat.classId,
          count: stat._count.id,
        })),
        byStatus: statusStats.reduce((acc: Record<string, number>, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {}),
        trends: trendData,
      };

      return {
        success: true,
        message: "Statistiques récupérées",
        data: { stats },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - getEnrollmentStats error:", error);
      throw error;
    }
  }

  /**
   * Crée des inscriptions en masse
   */
  async createBulkEnrollments(
    enrollments: BulkEnrollmentData[],
    auditData: AuditData
  ) {
    try {
      if (!Array.isArray(enrollments) || enrollments.length === 0) {
        return {
          success: false,
          message: "Aucune donnée d'inscription fournie",
          code: "NO_DATA",
        };
      }

      const results = {
        success: [] as any[],
        failed: [] as any[],
      };

      // Traiter chaque inscription
      for (const enrollmentData of enrollments) {
        try {
          const { studentId, classId, academicYearId, enrollmentDate } =
            enrollmentData;

          // Vérifications
          const student = await prisma.student.findUnique({
            where: { id: studentId },
          });

          if (!student) {
            results.failed.push({
              studentId,
              error: "Étudiant non trouvé",
            });
            continue;
          }

          const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: classId },
          });

          if (!schoolClass) {
            results.failed.push({
              studentId,
              error: "Classe non trouvée",
            });
            continue;
          }

          // Vérifier si déjà inscrit
          const existing = await prisma.enrollment.findUnique({
            where: {
              studentId_academicYearId: {
                studentId,
                academicYearId,
              },
            },
          });

          if (existing) {
            results.failed.push({
              studentId,
              error: "Déjà inscrit",
            });
            continue;
          }

          // Créer l'inscription
          const enrollment = await prisma.enrollment.create({
            data: {
              studentId,
              classId,
              academicYearId,
              enrollmentDate: enrollmentDate
                ? new Date(enrollmentDate)
                : new Date(),
              status: "Active",
              isReenrollment: false,
            },
            include: {
              student: true,
              schoolClass: true,
            },
          });

          // Mettre à jour la classe de l'étudiant
          await prisma.student.update({
            where: { id: studentId },
            data: { classId },
          });

          // Créer les frais de scolarité
          await this.createStudentFees(studentId, academicYearId);

          results.success.push(enrollment);
        } catch (error: any) {
          results.failed.push({
            studentId: enrollmentData.studentId,
            error: error.message,
          });
        }
      }

      return {
        success: true,
        message: "Inscriptions en masse terminées",
        data: { results },
        metadata: {
          total: enrollments.length,
          successCount: results.success.length,
          failedCount: results.failed.length,
        },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - createBulkEnrollments error:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère l'historique complet des inscriptions d'un étudiant
   */
  async getEnrollmentHistory(studentId: string, auditData: AuditData) {
    try {
      // Récupérer toutes les inscriptions de l'étudiant triées par date
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          academicYear: true,
          previousEnrollment: {
            select: {
              id: true,
              enrollmentDate: true,
              schoolClass: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
        },
        orderBy: {
          enrollmentDate: "asc",
        },
      });

      // Construire une chaîne d'inscriptions
      const history = [];
      const enrollmentMap = new Map();

      // Créer un mapping par ID
      enrollments.forEach((enrollment) => {
        enrollmentMap.set(enrollment.id, { ...enrollment, next: null });
      });

      // Construire la chaîne
      enrollments.forEach((enrollment) => {
        if (enrollment.previousEnrollmentId) {
          const previous = enrollmentMap.get(enrollment.previousEnrollmentId);
          if (previous) {
            previous.next = enrollment;
          }
        }
      });

      // Trouver la première inscription (celle sans prédécesseur)
      const firstEnrollment = enrollments.find((e) => !e.previousEnrollmentId);

      // Parcourir la chaîne
      let current = firstEnrollment;
      while (current) {
        history.push({
          id: current.id,
          enrollmentDate: current.enrollmentDate,
          academicYear: current.academicYear.year,
          className: current.schoolClass.name,
          classLevel: current.schoolClass.level,
          status: current.status,
          isReenrollment: current.isReenrollment,
        });

        // Trouver la prochaine inscription dans la chaîne
        const next = enrollments.find(
          (e) => e.previousEnrollmentId === current?.id
        );
        current = next;
      }

      return {
        success: true,
        message: "Historique des inscriptions récupéré",
        data: {
          history,
          total: history.length,
        },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - getEnrollmentHistory error:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les structures de frais disponibles
   */
  async getAvailableFeeStructures() {
    try {
      const feeStructures = await prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          amount: true,
          description: true,
          academicYear: true,
          _count: {
            select: {
              studentFees: true,
            },
          },
        },
        orderBy: {
          academicYear: "desc",
        },
      });

      return {
        success: true,
        message: "Structures de frais disponibles",
        data: { feeStructures },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - getAvailableFeeStructures error:",
        error
      );
      throw error;
    }
  }

  /**
   * delete enrollment
   */
  async deleteEnrollment(id: string, auditData: AuditData) {
    try {
      // Vérifier si l'inscription existe
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
      });
      if (!enrollment) {
        return {
          success: false,
          message: "Inscription non trouvée",
          code: "ENROLLMENT_NOT_FOUND",
        };
      }
      // Supprimer l'inscription
      await prisma.enrollment.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Inscription supprimée avec succès",
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - deleteEnrollment error:", error);
      throw error;
    }
  }

  // ==================== FONCTIONS UTILITAIRES INTERNES ====================

  /**
   * Attribue des frais à un étudiant lors de l'inscription
   * @private
   */
  private async assignFeesOnEnrollment(
    studentId: string,
    academicYearId: string,
    feeStructureIds: string[] = []
  ): Promise<{ success: boolean; message: string; assignedFees: any[] }> {
    try {
      const assignedFees = [];

      // Si aucun frais spécifié, on attribue les frais actifs par défaut
      if (feeStructureIds.length === 0) {
        const feeStructures = await prisma.feeStructure.findMany({
          where: {
            isActive: true,
          },
        });

        feeStructureIds = feeStructures.map((fee) => fee.id);
      }

      // Pour chaque structure de frais, créer une entrée StudentFee
      for (const feeStructureId of feeStructureIds) {
        const feeStructure = await prisma.feeStructure.findUnique({
          where: { id: feeStructureId },
        });

        if (!feeStructure) {
          console.warn(`Structure de frais ${feeStructureId} non trouvée`);
          continue;
        }

        // Vérifier si l'étudiant a déjà ces frais pour cette année
        const existingFee = await prisma.studentFee.findFirst({
          where: {
            studentId,
            feeStructureId,
            academicYearId,
          },
        });

        if (existingFee) {
          console.log(`L'étudiant a déjà ces frais: ${feeStructure.name}`);
          continue;
        }

        // Créer les frais avec une date d'échéance à 3 mois
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 3);

        const studentFee = await prisma.studentFee.create({
          data: {
            studentId,
            feeStructureId,
            academicYearId,
            totalAmount: feeStructure.amount,
            paidAmount: 0,
            status: "pending",
            dueDate,
          },
          include: {
            feeStructure: {
              select: {
                name: true,
                amount: true,
                description: true,
              },
            },
          },
        });

        assignedFees.push({
          id: studentFee.id,
          name: studentFee.feeStructure.name,
          amount: studentFee.totalAmount,
          dueDate: studentFee.dueDate,
          status: studentFee.status,
        });

        console.log(` Frais attribués: ${feeStructure.name}`);
      }

      return {
        success: true,
        message:
          assignedFees.length > 0
            ? `${assignedFees.length} frais attribués`
            : "Aucun nouveau frais attribué",
        assignedFees,
      };
    } catch (error) {
      console.error(" Erreur attribution frais:", error);
      return {
        success: false,
        message: "Erreur lors de l'attribution des frais",
        assignedFees: [],
      };
    }
  }

  /**
   * Calcule les frais de réinscription
   * @private
   */
  private async calculateReenrollmentFee(
    studentId: string,
    previousYearId: string,
    currentYearId: string
  ): Promise<{ amount: number; details: any }> {
    try {
      console.log("🧮 Calcul des frais de réinscription:", {
        studentId,
        previousYearId,
        currentYearId,
      });

      // 1. Récupérer les frais impayés de l'année précédente
      const previousYearFees = await prisma.studentFee.findMany({
        where: {
          studentId,
          academicYearId: previousYearId,
          status: { in: ["pending", "partial"] },
        },
        include: {
          feeStructure: true,
          payments: {
            select: {
              amount: true,
              paymentDate: true,
              paymentMethod: true,
            },
          },
        },
      });

      // 2. Calculer le solde impayé
      let previousBalance = 0;
      const unpaidFees = previousYearFees.filter((fee) => {
        // Calculer le total payé pour ce fee
        const totalPaid = (fee.payments || []).reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const balance = fee.totalAmount - totalPaid;

        if (balance > 0) {
          previousBalance += balance;
          return true;
        }
        return false;
      });

      console.log("📊 Solde précédent calculé:", {
        totalFees: previousYearFees.length,
        unpaidFees: unpaidFees.length,
        previousBalance,
      });

      // 3. Récupérer les frais de réinscription standard
      const reenrollmentFeeStructure = await prisma.feeStructure.findFirst({
        where: {
          OR: [
            { name: { contains: "réinscription" } },
            { name: { contains: "reenrollment" } },
            { name: { contains: "frais" } },
            { name: { contains: "inscription" } },
          ],
          isActive: true,
        },
      });

      const baseFee = reenrollmentFeeStructure?.amount || 5000; // Frais par défaut
      console.log("💰 Frais de base:", baseFee);

      // 4. Récupérer le nom de l'année actuelle pour chercher les frais
      const currentAcademicYear = await prisma.academicYear.findUnique({
        where: { id: currentYearId },
        select: { year: true },
      });

      let estimatedYearFees = 0;

      if (currentAcademicYear) {
        // 5. Rechercher les structures de frais par NOM d'année
        const currentYearFeeStructures = await prisma.feeStructure.findMany({
          where: {
            academicYear: currentAcademicYear.year, // Champ String, pas academicYearId
            isActive: true,
          },
        });

        estimatedYearFees = currentYearFeeStructures.reduce(
          (sum, fee) => sum + fee.amount,
          0
        );

        console.log(
          `📊 Frais estimés pour ${currentAcademicYear.year}:`,
          estimatedYearFees
        );
      } else {
        console.warn(
          "⚠️ Année académique courante non trouvée:",
          currentYearId
        );
      }

      // 6. Calculer le total
      const totalFee = baseFee + previousBalance;

      console.log("🧾 Total calculé:", {
        baseFee,
        previousBalance,
        totalFee,
        estimatedYearFees,
      });

      return {
        amount: totalFee,
        details: {
          baseFee,
          previousBalance,
          totalFee,
          estimatedYearFees,
          unpaidPreviousFees: unpaidFees.map((fee) => {
            const totalPaid = (fee.payments || []).reduce(
              (sum, p) => sum + p.amount,
              0
            );
            return {
              id: fee.id,
              name: fee.feeStructure.name,
              totalAmount: fee.totalAmount,
              paidAmount: totalPaid,
              balance: fee.totalAmount - totalPaid,
              status: fee.status,
              dueDate: fee.dueDate,
              paymentCount: (fee.payments || []).length,
            };
          }),
        },
      };
    } catch (error) {
      console.error("❌ Erreur calcul frais réinscription:", error);
      return {
        amount: 5000, // Frais par défaut en cas d'erreur
        details: {
          baseFee: 5000,
          previousBalance: 0,
          totalFee: 5000,
          estimatedYearFees: 0,
          unpaidPreviousFees: [],
        },
      };
    }
  }

  /**
   * Crée les frais de scolarité pour un étudiant
   * @private
   */
  /**
   * Crée les frais de scolarité pour un étudiant (version transactionnelle)
   * @private
   */
  private async createStudentFees(
    studentId: string,
    academicYearId: string,
    tx?: any
  ): Promise<void> {
    const prismaClient = tx || prisma;

    try {
      console.log("📝 Création des frais de scolarité:", {
        studentId,
        academicYearId,
      });

      // 1. Récupérer le nom de l'année académique
      const academicYear = await prismaClient.academicYear.findUnique({
        where: { id: academicYearId },
        select: { year: true },
      });

      if (!academicYear) {
        console.error("❌ Année académique non trouvée:", academicYearId);
        return;
      }

      const academicYearName = academicYear.year;
      console.log("📅 Nom de l'année académique:", academicYearName);

      // 2. Récupérer les structures de frais actives pour cette année
      // IMPORTANT: FeeStructure.academicYear est un String, pas une relation
      const feeStructures = await prismaClient.feeStructure.findMany({
        where: {
          academicYear: academicYearName, // Recherche par nom d'année (String)
          isActive: true,
        },
      });

      if (feeStructures.length === 0) {
        console.log(
          `⚠️ Aucune structure de frais active trouvée pour ${academicYearName}`
        );

        // Créer des frais par défaut si aucun n'existe
        const defaultFees = [
          {
            name: `Frais de scolarité ${academicYearName}`,
            amount: 15000,
            description: "Frais de scolarité annuels",
          },
          {
            name: `Frais d'inscription ${academicYearName}`,
            amount: 5000,
            description: "Frais d'inscription",
          },
          {
            name: `Frais administratifs ${academicYearName}`,
            amount: 3000,
            description: "Frais administratifs divers",
          },
        ];

        for (const feeData of defaultFees) {
          // Créer la structure de frais
          const feeStructure = await prismaClient.feeStructure.create({
            data: {
              ...feeData,
              academicYear: academicYearName, // Champ String
              isActive: true,
            },
          });

          // Créer les frais étudiants
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 3);

          await prismaClient.studentFee.create({
            data: {
              studentId,
              feeStructureId: feeStructure.id,
              academicYearId: academicYearId, // Champ académicYearId (relation)
              totalAmount: feeStructure.amount,
              paidAmount: 0,
              status: "pending",
              dueDate,
            },
          });

          console.log(`✅ Frais par défaut créé: ${feeStructure.name}`);
        }

        console.log("✅ Frais par défaut créés pour l'étudiant");
        return;
      }

      console.log(`✅ ${feeStructures.length} structures de frais trouvées`);

      // 3. Pour chaque structure de frais, créer une entrée StudentFee
      const createPromises = feeStructures.map(
        async (feeStructure: { id: any; name: any; amount: any }) => {
          // Vérifier si l'étudiant a déjà ces frais pour cette année
          const existingFee = await prismaClient.studentFee.findFirst({
            where: {
              studentId,
              feeStructureId: feeStructure.id,
              academicYearId: academicYearId, // Champ académicYearId (relation)
            },
          });

          if (existingFee) {
            console.log(`⚠️ Frais déjà existants: ${feeStructure.name}`);
            return null;
          }

          // Calculer la date d'échéance (3 mois après la date courante)
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 3);

          const studentFee = await prismaClient.studentFee.create({
            data: {
              studentId,
              feeStructureId: feeStructure.id,
              academicYearId: academicYearId, // Champ académicYearId (relation)
              totalAmount: feeStructure.amount,
              paidAmount: 0,
              status: "pending",
              dueDate,
            },
          });

          console.log(
            `✅ Frais créés: ${feeStructure.name} - ${feeStructure.amount} HTG`
          );
          return studentFee;
        }
      );

      const results = await Promise.all(createPromises);
      const createdFees = results.filter((r) => r !== null);

      console.log(`🎯 ${createdFees.length} frais créés avec succès`);
    } catch (error) {
      console.error("❌ Erreur création frais scolarité:", error);
      throw error;
    }
  }

  /**
   * Valide les résultats académiques
   * @private
   */
  private validateAcademicResults(grades: any[]): boolean {
    if (grades.length === 0) return false;

    const average =
      grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
    return average >= 50; // Note moyenne minimale de 50
  }

  /**
   * Calcule le taux d'assiduité
   * @private
   */
  private calculateAttendanceRate(attendance: any[]): number {
    if (attendance.length === 0) return 0;

    const present = attendance.filter((a) => a.status === "Present").length;
    return present / attendance.length;
  }

  //------------------------------------------------------
  /**
   * Gère la réinscription d'un étudiant avec support pour les données historiques
   */
  /**
   * Gère la réinscription d'un étudiant avec support pour les données historiques
   */
  async reenrollStudent(
    data: ReenrollmentData & { previousAcademicYearId?: string },
    auditData: AuditData
  ) {
    try {
      const {
        studentId,
        classId,
        academicYearId, // C'est l'année TARGET (nouvelle année)
        previousAcademicYearId, // Année précédente (optionnelle)
        enrollmentDate,
        notes,
      } = data;

      console.log("🎯 Début réinscription - Données reçues:", {
        studentId,
        classId,
        targetYearId: academicYearId,
        previousYearId: previousAcademicYearId,
        notes,
      });

      // 1. Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        console.error("❌ Étudiant non trouvé:", studentId);
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      console.log("✅ Étudiant trouvé:", student.studentCode);

      // 2. Vérifier l'année académique cible
      const targetYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });

      if (!targetYear) {
        console.error("❌ Année cible non trouvée:", academicYearId);
        return {
          success: false,
          message: "Année académique cible non trouvée",
          code: "TARGET_YEAR_NOT_FOUND",
        };
      }

      console.log("✅ Année cible trouvée:", targetYear.year);

      // 3. Déterminer l'année précédente
      let previousYear = null;
      let previousEnrollment = null;

      if (previousAcademicYearId) {
        // Cas 1: L'utilisateur a spécifié l'année précédente
        console.log(
          "📌 Recherche de l'année précédente spécifiée:",
          previousAcademicYearId
        );

        previousYear = await prisma.academicYear.findUnique({
          where: { id: previousAcademicYearId },
        });

        if (!previousYear) {
          console.error(
            "❌ Année précédente spécifiée non trouvée:",
            previousAcademicYearId
          );
          return {
            success: false,
            message: "L'année académique précédente spécifiée n'existe pas",
            code: "SPECIFIED_PREVIOUS_YEAR_NOT_FOUND",
          };
        }

        // Chercher l'inscription pour cette année spécifique
        previousEnrollment = await prisma.enrollment.findUnique({
          where: {
            studentId_academicYearId: {
              studentId,
              academicYearId: previousAcademicYearId,
            },
          },
          include: {
            academicYear: true,
            schoolClass: true,
          },
        });

        if (!previousEnrollment) {
          console.error("❌ Aucune inscription trouvée pour l'année spécifiée");
          return {
            success: false,
            message: `L'étudiant n'était pas inscrit pour l'année ${previousYear.year}`,
            code: "NO_ENROLLMENT_FOR_SPECIFIED_YEAR",
            data: {
              specifiedYear: previousYear.year,
            },
          };
        }

        console.log(
          "✅ Inscription précédente trouvée (spécifiée):",
          previousEnrollment.id
        );
      } else {
        // Cas 2: Recherche automatique de l'année précédente
        console.log("🔍 Recherche automatique de l'année précédente...");

        // Stratégie 1: Chercher l'année qui se termine juste avant l'année cible
        previousYear = await prisma.academicYear.findFirst({
          where: {
            endDate: { lt: targetYear.startDate },
          },
          orderBy: {
            endDate: "desc", // La plus récente qui se termine avant la cible
          },
        });

        if (previousYear) {
          console.log(
            "📅 Année précédente trouvée par date:",
            previousYear.year
          );

          previousEnrollment = await prisma.enrollment.findUnique({
            where: {
              studentId_academicYearId: {
                studentId,
                academicYearId: previousYear.id,
              },
            },
            include: {
              academicYear: true,
              schoolClass: true,
            },
          });

          if (!previousEnrollment) {
            console.log(
              "⚠️ Pas d'inscription pour l'année trouvée par date, tentative alternative..."
            );
          }
        }

        // Stratégie 2: Si pas trouvé, chercher la dernière inscription de l'étudiant
        if (!previousEnrollment) {
          console.log(
            "🔍 Recherche de la dernière inscription de l'étudiant..."
          );

          previousEnrollment = await prisma.enrollment.findFirst({
            where: {
              studentId,
              status: { in: ["Active", "Completed"] },
            },
            include: {
              academicYear: true,
              schoolClass: true,
            },
            orderBy: {
              enrollmentDate: "desc",
            },
          });

          if (previousEnrollment) {
            previousYear = previousEnrollment.academicYear;
            console.log("✅ Dernière inscription trouvée:", previousYear.year);
          }
        }

        // Stratégie 3: Si toujours pas trouvé, chercher n'importe quelle inscription précédente
        if (!previousEnrollment) {
          console.log(
            "🔍 Recherche de n'importe quelle inscription précédente..."
          );

          const allPreviousEnrollments = await prisma.enrollment.findMany({
            where: {
              studentId,
            },
            include: {
              academicYear: true,
              schoolClass: true,
            },
            orderBy: {
              academicYear: {
                startDate: "desc",
              },
            },
          });

          if (allPreviousEnrollments.length > 0) {
            // Prendre la plus récente
            previousEnrollment = allPreviousEnrollments[0];
            previousYear = previousEnrollment.academicYear;
            console.log(
              "✅ Inscription historique trouvée:",
              previousYear.year
            );
          }
        }
      }

      // 4. Vérifier si une inscription précédente a été trouvée
      if (!previousEnrollment || !previousYear) {
        console.error("❌ Impossible de trouver une inscription précédente");

        // Récupérer toutes les années disponibles pour l'étudiant
        const studentEnrollments = await prisma.enrollment.findMany({
          where: { studentId },
          include: {
            academicYear: true,
          },
          orderBy: {
            academicYear: {
              startDate: "desc",
            },
          },
        });

        return {
          success: false,
          message:
            "Aucune inscription précédente trouvée. Veuillez spécifier l'année précédente.",
          code: "NO_PREVIOUS_ENROLLMENT",
          data: {
            availableYears: studentEnrollments.map((e) => ({
              id: e.academicYearId,
              year: e.academicYear.year,
              enrollmentId: e.id,
              status: e.status,
            })),
          },
        };
      }

      console.log("✅ Inscription précédente confirmée:", {
        previousYear: previousYear.year,
        previousClass: previousEnrollment.schoolClass?.name,
        previousStatus: previousEnrollment.status,
      });

      // 5. Vérifier que l'année précédente n'est pas la même que l'année cible
      if (previousYear.id === targetYear.id) {
        console.error("❌ L'année précédente est la même que l'année cible");
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année académique",
          code: "ALREADY_ENROLLED_CURRENT_YEAR",
        };
      }

      // 6. Vérifier si l'étudiant est déjà inscrit pour l'année cible
      const existingEnrollmentForTargetYear =
        await prisma.enrollment.findUnique({
          where: {
            studentId_academicYearId: {
              studentId,
              academicYearId: targetYear.id,
            },
          },
        });

      if (existingEnrollmentForTargetYear) {
        console.error("❌ Étudiant déjà inscrit pour l'année cible");
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année académique",
          code: "ALREADY_ENROLLED",
          data: {
            existingEnrollmentId: existingEnrollmentForTargetYear.id,
            status: existingEnrollmentForTargetYear.status,
          },
        };
      }

      // 7. Vérifier si la classe existe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        console.error("❌ Classe non trouvée:", classId);
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      console.log("✅ Classe trouvée:", schoolClass.name);

      // 8. Vérifier la capacité de la classe
      const currentEnrollments = await prisma.enrollment.count({
        where: {
          classId,
          academicYearId: targetYear.id,
          status: "Active",
        },
      });

      if (currentEnrollments >= (schoolClass.capacity || 30)) {
        console.error("❌ Classe pleine:", {
          capacity: schoolClass.capacity,
          current: currentEnrollments,
        });
        return {
          success: false,
          message: "La classe a atteint sa capacité maximale",
          code: "CLASS_FULL",
          data: {
            capacity: schoolClass.capacity,
            current: currentEnrollments,
          },
        };
      }

      console.log("✅ Capacité disponible:", {
        capacity: schoolClass.capacity,
        current: currentEnrollments,
        available: (schoolClass.capacity || 30) - currentEnrollments,
      });

      // 9. Calculer les frais de réinscription
      const reenrollmentFee = await this.calculateReenrollmentFee(
        studentId,
        previousYear.id,
        targetYear.id
      );

      console.log("💰 Frais de réinscription calculés:", reenrollmentFee);

      // 10. Démarrer une transaction pour garantir l'intégrité des données
      const result = await prisma.$transaction(async (tx) => {
        // Créer la nouvelle inscription
        const enrollment = await tx.enrollment.create({
          data: {
            studentId,
            classId,
            academicYearId: targetYear.id,
            enrollmentDate: enrollmentDate
              ? new Date(enrollmentDate)
              : new Date(),
            status: "Active",
            isReenrollment: true,
            previousEnrollmentId: previousEnrollment.id,
            reenrollmentDate: new Date(),
            reenrollmentNotes: notes,
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
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
            academicYear: true,
            previousEnrollment: {
              include: {
                academicYear: true,
                schoolClass: true,
              },
            },
          },
        });

        console.log("✅ Nouvelle inscription créée:", enrollment.id);

        // Mettre à jour la classe de l'étudiant
        await tx.student.update({
          where: { id: studentId },
          data: {
            classId,
            status: "Active",
          },
        });

        console.log("✅ Classe de l'étudiant mise à jour");

        // Mettre à jour l'inscription précédente pour marquer comme terminée
        // CORRECTION: On ne met pas nextEnrollmentId car il n'existe pas
        // On met simplement le statut à "Completed"
        await tx.enrollment.update({
          where: { id: previousEnrollment.id },
          data: {
            status: "Completed", // Juste changer le statut
            // Pas de nextEnrollmentId car pas dans le modèle
          },
        });

        console.log("✅ Inscription précédente mise à jour comme terminée");

        // Créer un paiement pour les frais de réinscription si nécessaire
        if (reenrollmentFee.amount > 0) {
          await (tx as any).payment.create({
            data: {
              studentId,
              amount: reenrollmentFee.amount,
              paidDate: new Date(),
              paymentMethod: "Bank",
              status: "Pending",
              description: `Frais de réinscription - ${targetYear.year}`,
              type: "Tuition",
              academicYearId: targetYear.id,
            },
          });

          console.log("✅ Paiement de réinscription créé");
        }

        // Créer les frais de scolarité pour la nouvelle année
        await this.createStudentFees(studentId, targetYear.id, tx);

        console.log("✅ Frais de scolarité créés pour la nouvelle année");

        return enrollment;
      });

      // 11. Retourner le résultat
      console.log("🎉 Réinscription terminée avec succès!");

      return {
        success: true,
        message: "Étudiant réinscrit avec succès",
        data: {
          enrollment: result,
          reenrollmentFee,
          previousYear: {
            id: previousYear.id,
            year: previousYear.year,
          },
          targetYear: {
            id: targetYear.id,
            year: targetYear.year,
          },
        },
        metadata: {
          studentId,
          studentCode: student.studentCode,
          classId,
          className: schoolClass.name,
          previousYearId: previousYear.id,
          targetYearId: targetYear.id,
          reenrollmentFeeAmount: reenrollmentFee.amount,
          notes,
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - reenrollStudent error:", error);

      // Gérer les erreurs spécifiques
      if (error.code === "P2002") {
        // Violation de contrainte unique (déjà inscrit)
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année académique",
          code: "ALREADY_ENROLLED",
        };
      }

      if (error.code === "P2003") {
        // Violation de clé étrangère
        return {
          success: false,
          message: "Une des références (classe, année académique) est invalide",
          code: "FOREIGN_KEY_VIOLATION",
        };
      }

      throw error;
    }
  }

  /**
   * Calcule les frais de réinscription
   * @private
   */
  // private async calculateReenrollmentFee(
  //   studentId: string,
  //   previousYearId: string,
  //   currentYearId: string
  // ): Promise<{ amount: number; details: any }> {
  //   try {
  //     console.log("🧮 Calcul des frais de réinscription:", {
  //       studentId,
  //       previousYearId,
  //       currentYearId,
  //     });

  //     // 1. Récupérer les frais impayés de l'année précédente
  //     const previousYearFees = await prisma.studentFee.findMany({
  //       where: {
  //         studentId,
  //         academicYearId: previousYearId,
  //         status: { in: ["pending", "overdue"] },
  //       },
  //       include: {
  //         feeStructure: true,
  //       },
  //     });

  //     // 2. Calculer le solde impayé
  //     let previousBalance = 0;
  //     const unpaidFees = previousYearFees.filter(fee => {
  //       const balance = fee.totalAmount - fee.paidAmount;
  //       if (balance > 0) {
  //         previousBalance += balance;
  //         return true;
  //       }
  //       return false;
  //     });

  //     console.log("📊 Solde précédent calculé:", {
  //       totalFees: previousYearFees.length,
  //       unpaidFees: unpaidFees.length,
  //       previousBalance,
  //     });

  //     // 3. Récupérer les frais de réinscription standard
  //     const reenrollmentFeeStructure = await prisma.feeStructure.findFirst({
  //       where: {
  //         OR: [
  //           { name: { contains: "réinscription", mode: "insensitive" } },
  //           { name: { contains: "reenrollment", mode: "insensitive" } },
  //           { name: { contains: "frais", mode: "insensitive" } },
  //         ],
  //         isActive: true,
  //       },
  //     });

  //     const baseFee = reenrollmentFeeStructure?.amount || 5000; // Frais par défaut
  //     console.log("💰 Frais de base:", baseFee);

  //     // 4. Récupérer les frais de la nouvelle année pour estimation
  //     const currentYearFeeStructures = await prisma.feeStructure.findMany({
  //       where: {
  //         academicYearId: currentYearId,
  //         isActive: true,
  //       },
  //     });

  //     const estimatedYearFees = currentYearFeeStructures.reduce(
  //       (sum, fee) => sum + fee.amount,
  //       0
  //     );

  //     // 5. Calculer le total
  //     const totalFee = baseFee + previousBalance;

  //     console.log("🧾 Total calculé:", {
  //       baseFee,
  //       previousBalance,
  //       totalFee,
  //       estimatedYearFees,
  //     });

  //     return {
  //       amount: totalFee,
  //       details: {
  //         baseFee,
  //         previousBalance,
  //         totalFee,
  //         estimatedYearFees,
  //         unpaidPreviousFees: unpaidFees.map(fee => ({
  //           id: fee.id,
  //           name: fee.feeStructure.name,
  //           amount: fee.totalAmount,
  //           paid: fee.paidAmount,
  //           balance: fee.totalAmount - fee.paidAmount,
  //         })),
  //       },
  //     };
  //   } catch (error) {
  //     console.error("❌ Erreur calcul frais réinscription:", error);
  //     return {
  //       amount: 5000, // Frais par défaut en cas d'erreur
  //       details: {
  //         baseFee: 5000,
  //         previousBalance: 0,
  //         totalFee: 5000,
  //         estimatedYearFees: 0,
  //         unpaidPreviousFees: [],
  //       },
  //     };
  //   }
  // }

  /**
   * Crée les frais de scolarité pour un étudiant (version transactionnelle)
   * @private
   */
  // private async createStudentFees(
  //   studentId: string,
  //   academicYearId: string,
  //   tx?: any
  // ): Promise<void> {
  //   const prismaClient = tx || prisma;

  //   try {
  //     console.log("📝 Création des frais de scolarité:", { studentId, academicYearId });

  //     // Récupérer les structures de frais actives pour cette année
  //     const feeStructures = await prismaClient.feeStructure.findMany({
  //       where: {
  //         academicYearId,
  //         isActive: true,
  //       },
  //     });

  //     if (feeStructures.length === 0) {
  //       console.log("⚠️ Aucune structure de frais active trouvée");
  //       return;
  //     }

  //     console.log(`✅ ${feeStructures.length} structures de frais trouvées`);

  //     // Pour chaque structure de frais, créer une entrée StudentFee
  //     const createPromises = feeStructures.map(async (feeStructure) => {
  //       // Vérifier si l'étudiant a déjà ces frais pour cette année
  //       const existingFee = await prismaClient.studentFee.findFirst({
  //         where: {
  //           studentId,
  //           feeStructureId: feeStructure.id,
  //           academicYearId,
  //         },
  //       });

  //       if (existingFee) {
  //         console.log(`⚠️ Frais déjà existants: ${feeStructure.name}`);
  //         return null;
  //       }

  //       // Calculer la date d'échéance (3 mois après la date courante)
  //       const dueDate = new Date();
  //       dueDate.setMonth(dueDate.getMonth() + 3);

  //       const studentFee = await prismaClient.studentFee.create({
  //         data: {
  //           studentId,
  //           feeStructureId: feeStructure.id,
  //           academicYearId,
  //           totalAmount: feeStructure.amount,
  //           paidAmount: 0,
  //           status: "pending",
  //           dueDate,
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //         },
  //       });

  //       console.log(`✅ Frais créés: ${feeStructure.name} - ${feeStructure.amount} HTG`);
  //       return studentFee;
  //     });

  //     const results = await Promise.all(createPromises);
  //     const createdFees = results.filter(r => r !== null);

  //     console.log(`🎯 ${createdFees.length} frais créés avec succès`);
  //   } catch (error) {
  //     console.error("❌ Erreur création frais scolarité:", error);
  //     throw error;
  //   }
  // }

  /**
   * Log d'audit
   * @private
   */
  // private async logAudit(action: string, details: string, auditData: AuditData) {
  //   try {
  //     await prisma.auditLog.create({
  //       data: {
  //         userId: auditData.userId,
  //         action,
  //         entityType: 'Enrollment',
  //         entityId: '',
  //         details,
  //         ipAddress: auditData.ipAddress,
  //         userAgent: auditData.userAgent,
  //         timestamp: new Date(),
  //       },
  //     });
  //   } catch (error) {
  //     console.error("❌ Erreur journalisation audit:", error);
  //   }
  // }

  /**
   * Récupère les inscriptions d'un étudiant avec les détails complets
   * Utile pour l'interface de sélection manuelle
   */
  async getStudentEnrollmentHistory(studentId: string, auditData: AuditData) {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          academicYear: true,
          previousEnrollment: {
            select: {
              id: true,
              academicYear: {
                select: {
                  year: true,
                },
              },
            },
          },
          nextEnrollments: {
            select: {
              id: true,
              academicYear: {
                select: {
                  year: true,
                },
              },
            },
          },
        },
        orderBy: {
          academicYear: {
            startDate: "desc",
          },
        },
      });

      return {
        success: true,
        message: "Historique des inscriptions récupéré",
        data: {
          enrollments,
          total: enrollments.length,
        },
      };
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - getStudentEnrollmentHistory error:",
        error
      );
      throw error;
    }
  }

  /**
   * Réinscription manuelle avec spécification exacte des années
   * Pour les cas complexes avec données historiques
   */
  async manualHistoricalReenrollment(
    data: {
      studentId: string;
      classId: string;
      targetAcademicYearId: string;
      previousAcademicYearId: string;
      enrollmentDate?: string;
      notes?: string;
      assignFees?: boolean;
      selectedFeeStructures?: string[];
    },
    auditData: AuditData
  ) {
    try {
      console.log("📚 Début réinscription manuelle historique");

      // Vérifier que les deux années sont différentes
      if (data.targetAcademicYearId === data.previousAcademicYearId) {
        return {
          success: false,
          message:
            "L'année cible et l'année précédente doivent être différentes",
          code: "SAME_YEARS",
        };
      }

      // Appeler la méthode principale avec les paramètres
      const result = await this.reenrollStudent(
        {
          studentId: data.studentId,
          classId: data.classId,
          academicYearId: data.targetAcademicYearId,
          previousAcademicYearId: data.previousAcademicYearId,
          enrollmentDate: data.enrollmentDate,
          notes: data.notes || "Réinscription manuelle historique",
        },
        auditData
      );

      // Si succès et assignation de frais demandée
      if (
        result.success &&
        data.assignFees &&
        data.selectedFeeStructures?.length
      ) {
        const enrollmentId = result.data?.enrollment?.id;
        if (enrollmentId) {
          await this.assignFeesOnEnrollment(
            data.studentId,
            data.targetAcademicYearId,
            data.selectedFeeStructures
          );

          return {
            ...result,
            message: `${result.message} avec attribution des frais`,
            metadata: {
              ...result.metadata,
              feesAssigned: true,
              feeStructuresCount: data.selectedFeeStructures.length,
            },
          };
        }
      }

      return result;
    } catch (error: any) {
      console.error(
        "❌ EnrollmentService - manualHistoricalReenrollment error:",
        error
      );
      throw error;
    }
  }
}
