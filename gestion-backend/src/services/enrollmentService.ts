/**
 * @file enrollmentService.ts
 * @description Service pour la gestion des inscriptions
 * @version 1.0.0
 */

import { PrismaClient, Prisma } from "../../generated/prisma";
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
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { studentCode: { contains: search, mode: "insensitive" } },
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
          enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
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
  async updateEnrollment(id: string, data: UpdateEnrollmentData, auditData: AuditData) {
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
  async reenrollStudent(data: ReenrollmentData, auditData: AuditData) {
    try {
      const { studentId, classId, academicYearId, enrollmentDate, notes } = data;

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

      // Récupérer l'année précédente
      const previousYear = await prisma.academicYear.findFirst({
        where: {
          isCurrent: false,
        },
        orderBy: {
          startDate: "desc",
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

      // Vérifier l'inscription précédente
      const previousEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId: previousYear.id,
          },
        },
      });

      if (!previousEnrollment) {
        return {
          success: false,
          message: "L'étudiant n'était pas inscrit l'année précédente",
          code: "NO_PREVIOUS_ENROLLMENT",
        };
      }

      // Vérifier l'année académique cible
      const targetYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });

      if (!targetYear) {
        return {
          success: false,
          message: "Année académique cible non trouvée",
          code: "TARGET_YEAR_NOT_FOUND",
        };
      }

      // Vérifier si l'étudiant est déjà inscrit pour cette année
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId: targetYear.id,
          },
        },
      });

      if (existingEnrollment) {
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année",
          code: "ALREADY_ENROLLED",
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

      // Vérifier la capacité de la classe
      const currentEnrollments = await prisma.enrollment.count({
        where: {
          classId,
          academicYearId: targetYear.id,
          status: "Active",
        },
      });

      if (currentEnrollments >= (schoolClass.capacity || 30)) {
        return {
          success: false,
          message: "La classe a atteint sa capacité maximale",
          code: "CLASS_FULL",
        };
      }

      // Calculer les frais de réinscription
      const reenrollmentFee = await this.calculateReenrollmentFee(
        studentId,
        previousYear.id,
        targetYear.id
      );

      // Créer la réinscription
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          classId,
          academicYearId: targetYear.id,
          enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
          status: "Active",
          isReenrollment: true,
          previousEnrollmentId: previousEnrollment.id,
          reenrollmentDate: new Date(),
          reenrollmentNotes: notes,
        },
        include: {
          student: true,
          schoolClass: true,
          academicYear: true,
          previousEnrollment: true,
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

      // Créer un paiement pour les frais de réinscription
      await prisma.payment.create({
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

      // Mettre à jour l'inscription précédente pour référencer la nouvelle
      await prisma.enrollment.update({
        where: { id: previousEnrollment.id },
        data: {
          nextEnrollments: {
            connect: { id: enrollment.id },
          },
        },
      });

      // Créer les frais de scolarité pour la nouvelle année
      await this.createStudentFees(studentId, targetYear.id);

      return {
        success: true,
        message: "Étudiant réinscrit avec succès",
        data: {
          enrollment,
          reenrollmentFee,
        },
        metadata: {
          studentId,
          classId,
          academicYearId: targetYear.id,
          reenrollmentFee: reenrollmentFee.amount,
          notes,
        },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - reenrollStudent error:", error);
      throw error;
    }
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

      // Récupérer l'année précédente
      const previousYear = await prisma.academicYear.findFirst({
        where: {
          isCurrent: false,
        },
        orderBy: {
          startDate: "desc",
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

      // Vérifier les résultats académiques
      const grades = await prisma.grade.findMany({
        where: {
          studentId,
          academicYearId: previousYear.id,
        },
        include: {
          subject: true,
        },
      });

      // Vérifier si l'étudiant a validé son année
      const passed = this.validateAcademicResults(grades);

      // Vérifier les paiements
      const payments = await prisma.payment.findMany({
        where: {
          studentId,
          academicYearId: previousYear.id,
        },
      });

      const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalPaid = payments
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0);
      const balance = totalDue - totalPaid;

      const attendanceRate = 1.0; // Temporaire

      const validation = {
        canReenroll: passed && balance <= 0 && attendanceRate >= 0.75,
        academicStatus: passed ? "Passed" : "Failed",
        financialStatus: balance <= 0 ? "Clear" : "BalanceDue",
        attendanceStatus:
          attendanceRate >= 0.75 ? "Satisfactory" : "Unsatisfactory",
        details: {
          grades,
          payments,
          balance,
          attendanceRate,
          previousClass: previousEnrollment.schoolClass.name,
        },
      };

      return {
        success: true,
        message: "Validation de réinscription terminée",
        data: { validation },
      };
    } catch (error: any) {
      console.error("❌ EnrollmentService - validateReenrollment error:", error);
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
      console.error("❌ EnrollmentService - getStudentEnrollments error:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'inscription
   */
  async getEnrollmentStats(academicYearId: string | undefined, auditData: AuditData) {
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
  async createBulkEnrollments(enrollments: BulkEnrollmentData[], auditData: AuditData) {
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
      console.error("❌ EnrollmentService - createBulkEnrollments error:", error);
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
      console.error("❌ EnrollmentService - getEnrollmentHistory error:", error);
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
      console.error("❌ EnrollmentService - getAvailableFeeStructures error:", error);
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
      // Récupérer les paiements de l'année précédente
      const previousPayments = await prisma.payment.findMany({
        where: {
          studentId,
          academicYearId: previousYearId,
        },
      });

      // Calculer le solde de l'année précédente
      const totalPaid = previousPayments
        .filter((p) => p.status === "Paid")
        .reduce((sum, payment) => sum + payment.amount, 0);

      const totalDue = previousPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      const previousBalance = totalDue - totalPaid;

      // Récupérer les frais de réinscription standard
      const reenrollmentFeeStructure = await prisma.feeStructure.findFirst({
        where: {
          name: { contains: "réinscription" },
          isActive: true,
        },
      });

      const baseFee = reenrollmentFeeStructure?.amount || 10000; // Frais par défaut

      // Calculer le total (solde précédent + frais de réinscription)
      const totalFee = baseFee + previousBalance;

      return {
        amount: totalFee,
        details: {
          baseFee,
          previousBalance,
          totalFee,
        },
      };
    } catch (error) {
      console.error("Error calculating reenrollment fee:", error);
      return {
        amount: 10000,
        details: { baseFee: 10000, previousBalance: 0, totalFee: 10000 },
      };
    }
  }

  /**
   * Crée les frais de scolarité pour un étudiant
   * @private
   */
  private async createStudentFees(
    studentId: string,
    academicYearId: string
  ): Promise<void> {
    try {
      // Récupérer les structures de frais actives
      const feeStructures = await prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },
      });

      // Créer les frais pour l'étudiant
      for (const feeStructure of feeStructures) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 3); // 3 mois après l'inscription

        await prisma.studentFee.create({
          data: {
            studentId,
            feeStructureId: feeStructure.id,
            academicYearId,
            totalAmount: feeStructure.amount,
            paidAmount: 0,
            status: "pending",
            dueDate,
          },
        });
      }
    } catch (error) {
      console.error("Error creating student fees:", error);
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
}