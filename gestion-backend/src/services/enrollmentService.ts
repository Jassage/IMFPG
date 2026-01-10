/**
 * @file enrollmentService.ts
 * @description Service pour la gestion des inscriptions avec support complet du redoublement
 * @version 2.0.0
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
  previousAcademicYearId?: string;
  previousEnrollmentId?: string;
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
 * Types de niveaux de classe
 */
export enum ClassLevel {
  Sixieme = "Sixieme",
  Cinquieme = "Cinquieme",
  Quatrieme = "Quatrieme",
  Troisieme = "Troisieme",
  Seconde = "Seconde",
  Premiere = "Premiere",
  Terminale = "Terminale",
  NSI = "NSI",
  NSII = "NSII",
  NSIII = "NSIII",
  NSIV = "NSIV",
}

/**
 * Service pour la gestion des inscriptions
 */
export class EnrollmentService {
  /**
   * Définit l'ordre des niveaux pour chaque parcours
   */
  private getClassLevelOrder(): Map<string, number> {
    const levelOrder = new Map<string, number>();

    // Parcours classique
    levelOrder.set(ClassLevel.Sixieme, 1);
    levelOrder.set(ClassLevel.Cinquieme, 2);
    levelOrder.set(ClassLevel.Quatrieme, 3);
    levelOrder.set(ClassLevel.Troisieme, 4);
    levelOrder.set(ClassLevel.Seconde, 5);
    levelOrder.set(ClassLevel.Premiere, 6);
    levelOrder.set(ClassLevel.Terminale, 7);

    // Parcours Nouveau Secondaire (après Quatrième)
    levelOrder.set(ClassLevel.NSI, 8);
    levelOrder.set(ClassLevel.NSII, 9);
    levelOrder.set(ClassLevel.NSIII, 10);
    levelOrder.set(ClassLevel.NSIV, 11);

    return levelOrder;
  }

  /**
   * Récupère le parcours d'un niveau
   */
  private getLevelParcours(level: string): string {
    if (
      [
        ClassLevel.NSI,
        ClassLevel.NSII,
        ClassLevel.NSIII,
        ClassLevel.NSIV,
      ].includes(level as ClassLevel)
    ) {
      return "Nouveau Secondaire";
    }
    return "Parcours Classique";
  }

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
      console.error("EnrollmentService - getEnrollments error:", error);
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
      console.error("EnrollmentService - getEnrollmentById error:", error);
      throw error;
    }
  }

  /**
   * Récupère l'année académique courante ou la plus récente
   */
  private async getCurrentOrMostRecentAcademicYear(): Promise<any> {
    try {
      // D'abord essayer de trouver l'année courante
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      if (currentYear) {
        return currentYear;
      }

      // Sinon, prendre l'année la plus récente
      const mostRecentYear = await prisma.academicYear.findFirst({
        orderBy: {
          startDate: "desc",
        },
      });

      return mostRecentYear;
    } catch (error) {
      console.error("Erreur récupération année courante:", error);
      return null;
    }
  }

  /**
   * Crée une nouvelle inscription avec option d'attribution de frais
   */
  // async createEnrollment(data: CreateEnrollmentData, auditData: AuditData) {
  //   try {
  //     const {
  //       studentId,
  //       classId,
  //       academicYearId,
  //       enrollmentDate,
  //       assignFees = false,
  //       selectedFeeStructures = [],
  //     } = data;

  //     console.log("Debut creation inscription", {
  //       studentId,
  //       classId,
  //       academicYearId,
  //     });

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

  //     // Vérifier si l'année académique existe
  //     const academicYear = await prisma.academicYear.findUnique({
  //       where: { id: academicYearId },
  //     });

  //     if (!academicYear) {
  //       return {
  //         success: false,
  //         message: "Année académique non trouvée",
  //         code: "ACADEMIC_YEAR_NOT_FOUND",
  //       };
  //     }

  //     // Valider la date d'inscription
  //     const enrollmentDateObj = enrollmentDate
  //       ? new Date(enrollmentDate)
  //       : new Date();
  //     const dateValidation = await this.validateEnrollmentDate(
  //       enrollmentDateObj,
  //       academicYearId
  //     );

  //     if (!dateValidation.valid) {
  //       return {
  //         success: false,
  //         message: dateValidation.reason,
  //         code: "INVALID_ENROLLMENT_DATE",
  //         data: {
  //           enrollmentDate: enrollmentDateObj,
  //           academicYearStart: academicYear.startDate,
  //           academicYearEnd: academicYear.endDate,
  //         },
  //       };
  //     }

  //     // Vérifier si l'étudiant est déjà inscrit pour cette année
  //     const existingEnrollment = await prisma.enrollment.findUnique({
  //       where: {
  //         studentId_academicYearId: {
  //           studentId,
  //           academicYearId,
  //         },
  //       },
  //     });

  //     if (existingEnrollment) {
  //       return {
  //         success: false,
  //         message: "Cet étudiant est déjà inscrit pour cette année académique",
  //         code: "ENROLLMENT_EXISTS",
  //       };
  //     }

  //     // Vérifier la capacité de la classe
  //     const currentEnrollments = await prisma.enrollment.count({
  //       where: {
  //         classId,
  //         academicYearId,
  //         status: "Active",
  //       },
  //     });

  //     if (currentEnrollments >= (schoolClass.capacity || 30)) {
  //       return {
  //         success: false,
  //         message: "La classe a atteint sa capacité maximale",
  //         code: "CLASS_FULL",
  //         data: {
  //           capacity: schoolClass.capacity,
  //           current: currentEnrollments,
  //         },
  //       };
  //     }

  //     // Créer l'inscription
  //     const enrollment = await prisma.enrollment.create({
  //       data: {
  //         studentId,
  //         classId,
  //         academicYearId,
  //         enrollmentDate: enrollmentDateObj,
  //         status: "Active",
  //         isReenrollment: false,
  //       },
  //       include: {
  //         student: true,
  //         schoolClass: true,
  //         academicYear: true,
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

  //     // Gérer l'attribution des frais
  //     let feeAssignmentResult = null;
  //     if (assignFees) {
  //       feeAssignmentResult = await this.assignFeesOnEnrollment(
  //         studentId,
  //         academicYearId,
  //         selectedFeeStructures
  //       );
  //     }

  //     console.log("Inscription creee avec succes", enrollment.id);

  //     return {
  //       success: true,
  //       message: "Inscription créée avec succès",
  //       data: {
  //         enrollment,
  //         ...(feeAssignmentResult && { feeAssignment: feeAssignmentResult }),
  //       },
  //       metadata: {
  //         studentId,
  //         classId,
  //         academicYearId,
  //         studentCode: student.studentCode,
  //         className: schoolClass.name,
  //         feesAssigned: assignFees,
  //         feeStructures: selectedFeeStructures.length,
  //       },
  //     };
  //   } catch (error: any) {
  //     console.error("EnrollmentService - createEnrollment error:", error);
  //     throw error;
  //   }
  // }

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

      console.log("Debut creation inscription", {
        studentId,
        classId,
        academicYearId,
      });

      // ==================== VALIDATION DES PARAMÈTRES ====================

      // Vérification des champs obligatoires
      if (!studentId || !classId || !academicYearId) {
        return {
          success: false,
          message:
            "Données manquantes: studentId, classId et academicYearId sont requis",
          code: "MISSING_REQUIRED_FIELDS",
        };
      }

      // Validation du format des IDs (si UUID)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (
        !uuidRegex.test(studentId) ||
        !uuidRegex.test(classId) ||
        !uuidRegex.test(academicYearId)
      ) {
        console.warn("Format d'ID potentiellement invalide", {
          studentId,
          classId,
          academicYearId,
        });
        // On continue mais on log un avertissement
      }

      // ==================== VÉRIFICATION DES RÉFÉRENCES ====================

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

      // Vérifier le statut de l'étudiant
      if (student.status !== "Active") {
        return {
          success: false,
          message: `L'étudiant n'est pas actif (statut: ${student.status})`,
          code: "STUDENT_NOT_ACTIVE",
          data: {
            studentId,
            currentStatus: student.status,
            requiredStatus: "Active",
          },
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

      // Vérifier si la classe est active
      if (schoolClass.status !== "Active") {
        return {
          success: false,
          message: "La classe n'est pas active",
          code: "CLASS_NOT_ACTIVE",
          data: {
            classId,
            className: schoolClass.name,
            currentStatus: schoolClass.status,
          },
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

      // ==================== CONTRAINTE : EMPÊCHER L'ANNÉE FUTURE ====================

      // Vérifier si l'année cible est future par rapport à l'année courante
      const currentAcademicYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      if (currentAcademicYear) {
        // Comparer par date de début
        if (academicYear.startDate > currentAcademicYear.startDate) {
          return {
            success: false,
            message:
              "Impossible de s'inscrire dans une année académique future",
            code: "FUTURE_ACADEMIC_YEAR",
            data: {
              targetYear: academicYear.year,
              targetStartDate: academicYear.startDate,
              currentYear: currentAcademicYear.year,
              currentStartDate: currentAcademicYear.startDate,
              reason:
                "L'année académique cible commence après l'année courante",
            },
          };
        }
      }

      // Vérifier aussi que l'année n'a pas commencé dans le futur
      const today = new Date();
      if (academicYear.startDate > today) {
        return {
          success: false,
          message: "L'année académique n'a pas encore commencé",
          code: "ACADEMIC_YEAR_NOT_STARTED",
          data: {
            targetYear: academicYear.year,
            startDate: academicYear.startDate,
            daysUntilStart: Math.ceil(
              (academicYear.startDate.getTime() - today.getTime()) /
                (1000 * 3600 * 24)
            ),
          },
        };
      }

      // ==================== VALIDATION DE LA DATE ====================

      // Valider la date d'inscription
      const enrollmentDateObj = enrollmentDate
        ? new Date(enrollmentDate)
        : new Date();

      const dateValidation = await this.validateEnrollmentDate(
        enrollmentDateObj,
        academicYearId
      );

      if (!dateValidation.valid) {
        return {
          success: false,
          message: dateValidation.reason,
          code: "INVALID_ENROLLMENT_DATE",
          data: {
            enrollmentDate: enrollmentDateObj,
            academicYearStart: academicYear.startDate,
            academicYearEnd: academicYear.endDate,
          },
        };
      }

      // ==================== CONTRAINTES D'UNICITÉ ====================

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
          data: {
            existingEnrollmentId: existingEnrollment.id,
            status: existingEnrollment.status,
            classId: existingEnrollment.classId,
          },
        };
      }

      // ==================== CONTRAINTE DE CAPACITÉ ====================

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
            available: (schoolClass.capacity || 30) - currentEnrollments,
            classId,
            className: schoolClass.name,
          },
        };
      }

      // ==================== VALIDATION DE L'ÂGE/NIVEAU ====================

      // Vérifier l'adéquation âge/niveau (optionnel)
      if (student.dateOfBirth && schoolClass.level) {
        const age = this.calculateAge(student.dateOfBirth);
        const ageValidation = this.validateAgeForClassLevel(
          age,
          schoolClass.level
        );

        if (!ageValidation.valid) {
          console.warn("Avertissement âge/niveau:", ageValidation.message);
          // Vous pouvez choisir de retourner une erreur ou juste un avertissement
          // Pour l'instant, on loggue seulement
        }
      }

      // ==================== VALIDATION DE L'HISTORIQUE ====================

      // Vérifier si l'étudiant a des inscriptions en cours ailleurs
      const currentYearEnrollments = await prisma.enrollment.findMany({
        where: {
          studentId,
          academicYear: {
            isCurrent: true,
          },
          status: "Active",
          NOT: {
            academicYearId: academicYearId, // Exclure l'année cible si c'est l'année courante
          },
        },
        include: {
          schoolClass: {
            select: {
              name: true,
              level: true,
            },
          },
          academicYear: {
            select: {
              year: true,
            },
          },
        },
      });

      if (currentYearEnrollments.length > 0) {
        return {
          success: false,
          message:
            "L'étudiant est déjà inscrit pour l'année en cours dans une autre classe",
          code: "ALREADY_ENROLLED_CURRENT_YEAR",
          data: {
            currentEnrollments: currentYearEnrollments.map((e) => ({
              classId: e.classId,
              className: e.schoolClass?.name,
              classLevel: e.schoolClass?.level,
              academicYear: e.academicYear?.year,
              status: e.status,
            })),
          },
        };
      }

      // ==================== CRÉATION AVEC TRANSACTION ====================

      // Utiliser une transaction pour garantir l'intégrité
      const result = await prisma.$transaction(async (tx) => {
        // Créer l'inscription
        const enrollment = await tx.enrollment.create({
          data: {
            studentId,
            classId,
            academicYearId,
            enrollmentDate: enrollmentDateObj,
            status: "Active",
            isReenrollment: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
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
            academicYear: {
              select: {
                id: true,
                year: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        });

        console.log("Inscription creee avec succes", enrollment.id);

        // Mettre à jour la classe de l'étudiant
        await tx.student.update({
          where: { id: studentId },
          data: {
            classId,
            status: "Active",
            updatedAt: new Date(),
          },
        });

        console.log("Classe de l'etudiant mise a jour", studentId);

        // Gérer l'attribution des frais si demandé
        let feeAssignmentResult = null;
        if (assignFees) {
          feeAssignmentResult = await this.assignFeesOnEnrollment(
            studentId,
            academicYearId,
            selectedFeeStructures,
            tx // Passer la transaction
          );

          console.log(
            "Frais attribues:",
            feeAssignmentResult.assignedFees?.length || 0
          );
        }

        return {
          enrollment,
          feeAssignment: feeAssignmentResult,
        };
      });

      // Journalisation d'audit
      console.log(`[AUDIT] Creation inscription - 
      User: ${auditData.userId}
      Student: ${student.firstName} ${student.lastName} (${student.studentCode})
      Class: ${schoolClass.name} (${schoolClass.level})
      Year: ${academicYear.year}
      Date: ${enrollmentDateObj.toISOString()}
      Fees: ${assignFees ? "Yes" : "No"}
    `);

      return {
        success: true,
        message: "Inscription créée avec succès",
        data: {
          enrollment: result.enrollment,
          ...(result.feeAssignment && { feeAssignment: result.feeAssignment }),
        },
        metadata: {
          studentId,
          studentCode: student.studentCode,
          studentName: `${student.firstName} ${student.lastName}`,
          classId,
          className: schoolClass.name,
          classLevel: schoolClass.level,
          academicYearId,
          academicYear: academicYear.year,
          enrollmentDate: enrollmentDateObj,
          feesAssigned: assignFees,
          feeStructuresCount: selectedFeeStructures.length,
          audit: {
            userId: auditData.userId,
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error: any) {
      console.error("EnrollmentService - createEnrollment error:", error);

      // Gestion des erreurs spécifiques
      if (error.code === "P2002") {
        return {
          success: false,
          message:
            "Violation de contrainte unique - L'étudiant est peut-être déjà inscrit",
          code: "UNIQUE_CONSTRAINT_VIOLATION",
          details: error.meta,
        };
      }

      if (error.code === "P2003") {
        return {
          success: false,
          message: "Référence de clé étrangère invalide",
          code: "FOREIGN_KEY_ERROR",
          details: error.meta,
        };
      }

      if (error.code === "P2025") {
        return {
          success: false,
          message: "Un enregistrement nécessaire n'a pas été trouvé",
          code: "RECORD_NOT_FOUND",
          details: error.meta,
        };
      }

      // Erreur générique
      throw error;
    }
  }

  // ==================== MÉTHODES UTILITAIRES À AJOUTER ====================

  /**
   * Calcule l'âge à partir de la date de naissance
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Valide l'âge pour un niveau de classe
   */
  private validateAgeForClassLevel(
    age: number,
    classLevel: string
  ): { valid: boolean; message?: string; recommendedAge?: number } {
    // Tableau des âges recommandés par niveau
    const ageRanges: Record<
      string,
      { min: number; max: number; recommended: number }
    > = {
      [ClassLevel.Sixieme]: { min: 10, max: 13, recommended: 11 },
      [ClassLevel.Cinquieme]: { min: 11, max: 14, recommended: 12 },
      [ClassLevel.Quatrieme]: { min: 12, max: 15, recommended: 13 },
      [ClassLevel.Troisieme]: { min: 13, max: 16, recommended: 14 },
      [ClassLevel.Seconde]: { min: 14, max: 17, recommended: 15 },
      [ClassLevel.Premiere]: { min: 15, max: 18, recommended: 16 },
      [ClassLevel.Terminale]: { min: 16, max: 19, recommended: 17 },
      [ClassLevel.NSI]: { min: 13, max: 16, recommended: 14 },
      [ClassLevel.NSII]: { min: 14, max: 17, recommended: 15 },
      [ClassLevel.NSIII]: { min: 15, max: 18, recommended: 16 },
      [ClassLevel.NSIV]: { min: 16, max: 19, recommended: 17 },
    };

    const range = ageRanges[classLevel];

    if (!range) {
      return { valid: true }; // Niveau non reconnu, on ne valide pas
    }

    if (age < range.min) {
      return {
        valid: false,
        message: `L'étudiant a ${age} ans mais le niveau ${classLevel} nécessite au moins ${range.min} ans`,
        recommendedAge: range.recommended,
      };
    }

    if (age > range.max) {
      return {
        valid: false,
        message: `L'étudiant a ${age} ans mais le niveau ${classLevel} est généralement jusqu'à ${range.max} ans`,
        recommendedAge: range.recommended,
      };
    }

    return { valid: true };
  }
  async updateEnrollment(
    id: string,
    data: UpdateEnrollmentData,
    auditData: AuditData
  ) {
    try {
      const { classId, status } = data;

      console.log("Service - updateEnrollment:", { id, data });

      // VALIDATION INITIALE DES PARAMÈTRES
      // Vérifier que classId n'est pas une chaîne vide si fourni
      if (classId !== undefined && classId.trim() === "") {
        return {
          success: false,
          message: "L'ID de classe ne peut pas être vide",
          code: "EMPTY_CLASS_ID",
        };
      }

      // Vérifier que status n'est pas une chaîne vide si fourni
      if (status !== undefined && status.trim() === "") {
        return {
          success: false,
          message: "Le statut ne peut pas être vide",
          code: "EMPTY_STATUS",
        };
      }

      // Vérifier si l'inscription existe
      const enrollment = await prisma.enrollment.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              classId: true,
            },
          },
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
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

      console.log("Inscription trouvee:", enrollment.id);

      // Vérifier si l'inscription est modifiable
      const modifiableValidation =
        await this.validateEnrollmentIsModifiable(enrollment);

      if (!modifiableValidation.valid) {
        return {
          success: false,
          message: modifiableValidation.reason,
          code: "ENROLLMENT_NOT_MODIFIABLE",
        };
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        updatedAt: new Date(),
      };

      let willChangeClass = false;
      let newClassId = enrollment.classId;

      // GESTION DU CHANGEMENT DE CLASSE
      if (classId !== undefined && classId !== enrollment.classId) {
        // Valider que classId est valide (pas null/undefined/empty)
        if (!classId) {
          return {
            success: false,
            message: "ID de classe invalide",
            code: "INVALID_CLASS_ID",
          };
        }

        // Vérifier si la nouvelle classe existe
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

        console.log("Nouvelle classe trouvee:", schoolClass.name);

        // Vérifier la capacité de la nouvelle classe
        const currentEnrollments = await prisma.enrollment.count({
          where: {
            classId,
            academicYearId: enrollment.academicYearId,
            status: "Active",
          },
        });

        if (currentEnrollments >= (schoolClass.capacity || 30)) {
          return {
            success: false,
            message: "La nouvelle classe a atteint sa capacité maximale",
            code: "NEW_CLASS_FULL",
            data: {
              capacity: schoolClass.capacity,
              current: currentEnrollments,
            },
          };
        }

        // Vérifier la transition de niveau (si changement de classe)
        const levelValidation = await this.validateClassLevelTransition(
          enrollment.studentId,
          classId,
          enrollment.classId,
          await this.getAcademicStatus(
            enrollment.studentId,
            enrollment.academicYearId
          )
        );

        if (!levelValidation.valid) {
          return {
            success: false,
            message: levelValidation.reason,
            code: "INVALID_CLASS_TRANSITION",
            data: levelValidation.details,
          };
        }

        updateData.classId = classId;
        newClassId = classId;
        willChangeClass = true;
      }

      // GESTION DU CHANGEMENT DE STATUT
      if (status !== undefined && status !== enrollment.status) {
        // Valider le statut
        const validStatuses = ["Active", "Suspended", "Completed", "Archived"];
        if (!validStatuses.includes(status)) {
          return {
            success: false,
            message:
              "Statut invalide. Valeurs acceptées: Active, Suspended, Completed, Archived",
            code: "INVALID_STATUS",
          };
        }

        // Valider la transition de statut
        const statusValidation = await this.validateStatusTransition(
          enrollment.status,
          status,
          enrollment.id
        );

        if (!statusValidation.valid) {
          return {
            success: false,
            message: statusValidation.reason,
            code: "INVALID_STATUS_TRANSITION",
          };
        }

        // Vérifications supplémentaires pour certains statuts
        if (status === "Completed") {
          const canCompleteValidation =
            await this.validateCanCompleteEnrollment(enrollment.id);

          if (!canCompleteValidation.valid) {
            return {
              success: false,
              message: canCompleteValidation.reason,
              code: "CANNOT_COMPLETE_ENROLLMENT",
              data: canCompleteValidation.details,
            };
          }
        }

        updateData.status = status;
      }

      console.log("Donnees a mettre a jour:", updateData);

      // Vérifier s'il y a des changements réels
      if (Object.keys(updateData).length <= 1) {
        // Seulement updatedAt
        return {
          success: false,
          message: "Aucune modification à appliquer",
          code: "NO_CHANGES",
        };
      }

      // Mettre à jour l'inscription
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id },
        data: updateData,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
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
          academicYear: {
            select: {
              id: true,
              year: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      console.log("Inscription mise a jour:", updatedEnrollment.id);

      // Mettre à jour la classe de l'étudiant si nécessaire
      if (willChangeClass) {
        await prisma.student.update({
          where: { id: enrollment.studentId },
          data: {
            classId: newClassId,
            updatedAt: new Date(),
          },
        });

        console.log("Classe de l'etudiant mise a jour");
      }

      // Journaliser l'action
      console.log(`Mise a jour inscription - 
      ID: ${id}
      Etudiant: ${enrollment.student.firstName} ${enrollment.student.lastName}
      Ancienne classe: ${enrollment.schoolClass?.name || "N/A"}
      Nouvelle classe: ${updatedEnrollment.schoolClass?.name || "N/A"}
      Ancien statut: ${enrollment.status}
      Nouveau statut: ${updatedEnrollment.status}
    `);

      return {
        success: true,
        message: "Inscription mise à jour avec succès",
        data: { enrollment: updatedEnrollment },
        metadata: {
          studentId: enrollment.studentId,
          studentCode: enrollment.student.studentCode,
          oldClassId: enrollment.classId,
          newClassId: updatedEnrollment.classId,
          oldStatus: enrollment.status,
          newStatus: updatedEnrollment.status,
        },
      };
    } catch (error: any) {
      console.error("EnrollmentService - updateEnrollment error:", error);

      // Gérer les erreurs Prisma spécifiques
      if (error.code === "P2025") {
        return {
          success: false,
          message: "Inscription non trouvée pour la mise à jour",
          code: "ENROLLMENT_NOT_FOUND_FOR_UPDATE",
        };
      }

      if (error.code === "P2003") {
        return {
          success: false,
          message: "Référence de clé étrangère invalide",
          code: "FOREIGN_KEY_ERROR",
          details: error.meta,
        };
      }

      if (error.code === "P2002") {
        return {
          success: false,
          message: "Violation de contrainte unique",
          code: "UNIQUE_CONSTRAINT_VIOLATION",
          details: error.meta,
        };
      }

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

      // Vérifier si l'inscription peut être désinscrite
      if (enrollment.status === "Completed") {
        return {
          success: false,
          message: `Une inscription avec le statut ${enrollment.status} ne peut pas être désinscrite`,
          code: "CANNOT_UNENROLL",
        };
      }

      // Désinscrire
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id },
        data: {
          status: "Suspended",
          updatedAt: new Date(),
        },
      });

      // Mettre à jour le statut de l'étudiant
      await prisma.student.update({
        where: { id: enrollment.studentId },
        data: {
          status: "Inactive",
          updatedAt: new Date(),
        },
      });

      console.log("Etudiant desinscrit avec succes", enrollment.studentId);

      return {
        success: true,
        message: "Étudiant désinscrit avec succès",
        data: { enrollment: updatedEnrollment },
        metadata: {
          studentCode: enrollment.student.studentCode,
          reason: unenrollReason,
        },
      };
    } catch (error: any) {
      console.error("EnrollmentService - unenrollStudent error:", error);
      throw error;
    }
  }

  /**
   * Trouve l'année académique suivante après une année donnée
   */
  private async findNextAcademicYear(currentYearId: string): Promise<any> {
    try {
      // 1. Récupérer l'année actuelle
      const currentYear = await prisma.academicYear.findUnique({
        where: { id: currentYearId },
      });

      if (!currentYear) {
        console.error("Annee academique actuelle non trouvee:", currentYearId);
        return null;
      }

      console.log("Recherche annee suivant:", currentYear.year);

      // 2. DEBUG: Lister toutes les années pour voir ce qui existe
      const allYears = await prisma.academicYear.findMany({
        orderBy: {
          startDate: "asc",
        },
      });

      console.log("=== DEBUG: Liste de toutes les années ===");
      allYears.forEach((year, index) => {
        console.log(
          `${index + 1}. ${year.year} (ID: ${year.id}) - ${year.startDate.toISOString().split("T")[0]} à ${year.endDate.toISOString().split("T")[0]}`
        );
      });
      console.log("=== FIN DEBUG ===");

      // 3. Nettoyer le nom de l'année courante
      const cleanCurrentYear = currentYear.year.trim().replace(/\s+/g, " ");
      console.log("Annee courante nettoyee:", cleanCurrentYear);

      // 4. Essayer plusieurs méthodes pour trouver l'année suivante

      // Méthode 1: Recherche par date (la plus fiable)
      const nextYearByDate = await prisma.academicYear.findFirst({
        where: {
          startDate: {
            gt: currentYear.endDate,
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });

      if (nextYearByDate) {
        console.log("Annee suivante trouvee par DATE:", nextYearByDate.year);
        return nextYearByDate;
      }

      // Méthode 2: Recherche par calcul d'année
      // Extraire les années du format "2022-2023"
      const yearMatches = cleanCurrentYear.match(/(\d{4})\D*(\d{4})?/);

      if (yearMatches) {
        const startYear = parseInt(yearMatches[1]);
        let endYear = yearMatches[2] ? parseInt(yearMatches[2]) : startYear + 1;

        console.log("Annees extraites:", { startYear, endYear });

        // Rechercher l'année qui commence par la fin de l'année courante
        const searchPatterns = [
          `${endYear}-${endYear + 1}`, // 2023-2024
          `${endYear} - ${endYear + 1}`, // 2023 - 2024
          `${endYear}–${endYear + 1}`, // 2023–2024 (tiret différent)
          `${endYear}/${endYear + 1}`, // 2023/2024
          ` ${endYear} `, // contient 2023
        ];

        console.log("Patterns de recherche:", searchPatterns);

        for (const pattern of searchPatterns) {
          const foundYear = await prisma.academicYear.findFirst({
            where: {
              year: {
                contains: pattern.replace(/\s+/g, " "), // Normaliser les espaces
              },
              NOT: {
                id: currentYear.id, // Exclure l'année courante
              },
            },
          });

          if (foundYear) {
            console.log(`Trouve avec pattern "${pattern}":`, foundYear.year);
            return foundYear;
          }
        }
      }

      // Méthode 3: Prendre l'année la plus récente après la courante
      const nextByMostRecent = await prisma.academicYear.findFirst({
        where: {
          startDate: {
            gt: currentYear.startDate,
          },
          NOT: {
            id: currentYear.id,
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });

      if (nextByMostRecent) {
        console.log(
          "Annee suivante (plus recente apres):",
          nextByMostRecent.year
        );
        return nextByMostRecent;
      }

      console.warn("AUCUNE annee suivante trouvee apres", currentYear.year);
      return null;
    } catch (error) {
      console.error("Erreur recherche année suivante:", error);
      return null;
    }
  }

  /**
   * Détermine le niveau recommandé basé sur les résultats
   * @private
   */
  private async determineRecommendedLevel(
    currentLevel: string,
    academicStatus: "Passed" | "Failed" | "NoGrades",
    studentId: string
  ): Promise<{
    recommendedLevel: string;
    reason: string;
    isRedoublement: boolean;
    allowedTransitions: string[];
  }> {
    const levelOrder = this.getClassLevelOrder();

    // Si échec → redoublement obligatoire
    if (academicStatus === "Failed") {
      return {
        recommendedLevel: currentLevel,
        reason: "L'élève a échoué, redoublement obligatoire",
        isRedoublement: true,
        allowedTransitions: [currentLevel], // Seulement redoublement
      };
    }

    // Si pas de notes → redoublement par sécurité
    if (academicStatus === "NoGrades") {
      return {
        recommendedLevel: currentLevel,
        reason: "Aucune note disponible, redoublement recommandé",
        isRedoublement: true,
        allowedTransitions: [currentLevel], // Seulement redoublement
      };
    }

    // Si réussite → passage normal
    // Trouver le prochain niveau dans l'ordre
    const currentOrder = levelOrder.get(currentLevel);

    if (currentOrder !== undefined) {
      // Trouver le prochain niveau dans l'ordre
      const nextLevels = Array.from(levelOrder.entries())
        .filter(([_, order]) => order === currentOrder + 1)
        .map(([level, _]) => level);

      if (nextLevels.length > 0) {
        // Cas spécial: après la Quatrième, on peut choisir entre Troisième et NSI
        if (currentLevel === ClassLevel.Quatrieme) {
          return {
            recommendedLevel: ClassLevel.Troisieme, // Par défaut Troisième
            reason: "Passage normal après la Quatrième",
            isRedoublement: false,
            allowedTransitions: [ClassLevel.Troisieme, ClassLevel.NSI],
          };
        }

        // Pour les autres niveaux, prendre le premier suivant
        return {
          recommendedLevel: nextLevels[0],
          reason: "Passage normal - élève a réussi",
          isRedoublement: false,
          allowedTransitions: nextLevels,
        };
      }
    }

    // Si pas de niveau suivant (ex: Terminale, NSIV) → terminé
    return {
      recommendedLevel: currentLevel,
      reason: "Dernier niveau atteint - cycle terminé",
      isRedoublement: false,
      allowedTransitions: [],
    };
  }

  /**
   * Trouve les classes disponibles pour un niveau donné
   * @private
   */
  private async findAvailableClassesForLevel(
    level: string,
    academicYearId: string
  ) {
    try {
      const classes = await prisma.schoolClass.findMany({
        where: {
          level: level as ClassLevel,
          status: "Active",
        },
        select: {
          id: true,
          name: true,
          level: true,
          capacity: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
          enrollments: {
            where: {
              academicYearId: academicYearId,
              status: "Active",
            },
            select: {
              id: true,
            },
          },
        },
      });

      // Filtrer les classes qui ont encore de la place
      return classes.filter((cls) => {
        const currentEnrollments = cls._count?.enrollments || 0;
        const capacity = cls.capacity || 30;
        return currentEnrollments < capacity;
      });
    } catch (error) {
      console.error("Erreur recherche classes:", error);
      return [];
    }
  }

  /**
   * Génère des recommandations adaptées
   * @private
   */
  private generateReenrollmentRecommendations(
    academicStatus: "Passed" | "Failed" | "NoGrades",
    averageGrade: number,
    previousLevel: string,
    financialValidation: any,
    isRedoublement: boolean
  ) {
    const recommendations: Array<{
      type: "warning" | "info" | "success" | "error";
      message: string;
      action?: string;
    }> = [];

    // Recommandations académiques
    if (academicStatus === "Failed") {
      recommendations.push({
        type: "warning",
        message: `Échec académique (${averageGrade.toFixed(1)}/100) - Redoublement obligatoire`,
        action: "Inscrire dans le même niveau",
      });
    } else if (academicStatus === "NoGrades") {
      recommendations.push({
        type: "info",
        message: "Aucune note disponible - Redoublement recommandé",
        action: "Inscrire dans le même niveau pour consolidation",
      });
    } else {
      recommendations.push({
        type: "success",
        message: `Réussite académique (${averageGrade.toFixed(1)}/100)`,
        action: isRedoublement
          ? "Redoublement recommandé"
          : "Passage au niveau supérieur",
      });

      if (averageGrade >= 80) {
        recommendations.push({
          type: "success",
          message: "Excellents résultats",
          action: "Peut être considéré pour les classes d'excellence",
        });
      } else if (averageGrade < 60) {
        recommendations.push({
          type: "warning",
          message: "Résultats juste suffisants",
          action: "Surveiller la progression",
        });
      }
    }

    // Recommandations de niveau
    if (isRedoublement) {
      recommendations.push({
        type: "info",
        message: "Redoublement du niveau actuel",
        action: "Planifier un suivi pédagogique renforcé",
      });
    } else {
      recommendations.push({
        type: "success",
        message: "Passage au niveau supérieur",
        action: "Continuer le parcours normal",
      });
    }

    // Recommandations financières
    if (!financialValidation.eligible) {
      recommendations.push({
        type: "error",
        message: `Solde impayé: ${financialValidation.balance} HTG (max: 5000 HTG)`,
        action: "Régulariser avant réinscription",
      });
    } else if (financialValidation.balance > 0) {
      recommendations.push({
        type: "warning",
        message: `Frais en attente: ${financialValidation.balance} HTG`,
        action: "Encaisser les paiements restants",
      });
    }

    // Recommandations spécifiques par niveau
    if (previousLevel === ClassLevel.Quatrieme && !isRedoublement) {
      recommendations.push({
        type: "info",
        message: "Choix de parcours après la Quatrième",
        action:
          "Orienter vers Troisième (classique) ou NSI (Nouveau Secondaire)",
      });
    }

    return recommendations;
  }
  /**
   * Valide un étudiant pour la réinscription avec détection automatique du niveau
   * Retourne les options possibles: passage normal ou redoublement
   */
  async validateReenrollment(studentId: string, auditData: AuditData) {
    try {
      console.log("Debut validation reinscription pour etudiant:", studentId);

      // 1. Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
          status: true,
        },
      });

      if (!student) {
        console.error("Etudiant non trouve:", studentId);
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // Vérifier que l'étudiant est actif
      if (student.status !== "Active") {
        return {
          success: false,
          message: "L'étudiant n'est pas actif",
          code: "STUDENT_NOT_ACTIVE",
        };
      }

      // 2. Récupérer l'inscription active la plus récente
      const previousEnrollment = await prisma.enrollment.findFirst({
        where: {
          studentId,
          status: { in: ["Active", "Completed"] },
        },
        include: {
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        orderBy: {
          enrollmentDate: "desc",
        },
      });

      if (!previousEnrollment) {
        console.error("Aucune inscription precedente trouvee");
        return {
          success: false,
          message: "L'étudiant n'a pas d'inscription précédente",
          code: "NO_PREVIOUS_ENROLLMENT",
        };
      }

      console.log("Inscription precedente trouvee:", {
        year: previousEnrollment.academicYear.year,
        class: previousEnrollment.schoolClass.name,
        level: previousEnrollment.schoolClass.level,
      });

      // 3. DÉTECTION DE L'ANNÉE SUIVANTE
      const nextAcademicYear = await this.findNextAcademicYear(
        previousEnrollment.academicYearId
      );

      if (!nextAcademicYear) {
        console.error(
          "Pas d'annee suivante trouvee apres:",
          previousEnrollment.academicYear.year
        );
        return {
          success: false,
          message: "Aucune année académique suivante disponible",
          code: "NO_NEXT_ACADEMIC_YEAR",
          data: {
            previousYear: previousEnrollment.academicYear.year,
          },
        };
      }

      console.log("Annee suivante detectee:", nextAcademicYear.year);

      // 4. Vérifier si l'étudiant est déjà inscrit pour l'année suivante
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          studentId,
          academicYearId: nextAcademicYear.id,
          status: "Active", // Seulement vérifier les inscriptions actives
        },
        include: {
          schoolClass: {
            select: {
              name: true,
              level: true,
            },
          },
        },
      });

      if (existingEnrollment) {
        console.error("Etudiant deja inscrit pour l'annee suivante");
        return {
          success: false,
          message: `L'étudiant est déjà inscrit pour l'année ${nextAcademicYear.year}`,
          code: "ALREADY_ENROLLED",
          data: {
            existingEnrollmentId: existingEnrollment.id,
            currentClass: existingEnrollment.schoolClass?.name || "Inconnu",
            nextYear: nextAcademicYear.year,
          },
        };
      }

      // 5. ÉVALUER LES RÉSULTATS ACADÉMIQUES
      const grades = await prisma.grade.findMany({
        where: {
          studentId,
          academicYearId: previousEnrollment.academicYearId,
        },
      });

      const academicEvaluation = {
        status: this.determineAcademicStatus(grades),
        averageGrade:
          grades.length > 0
            ? grades.reduce((sum, grade) => sum + grade.grade, 0) /
              grades.length
            : 0,
        hasGrades: grades.length > 0,
        grades: grades,
      };

      console.log("Evaluation academique:", {
        status: academicEvaluation.status,
        average: academicEvaluation.averageGrade,
        hasGrades: academicEvaluation.hasGrades,
      });

      // 6. DÉTERMINER LE NIVEAU RECOMMANDÉ
      const levelRecommendation = await this.determineRecommendedLevel(
        previousEnrollment.schoolClass.level,
        academicEvaluation.status,
        studentId
      );

      console.log("Recommandation de niveau:", levelRecommendation);

      // 7. TROUVER LES CLASSES DISPONIBLES pour le niveau recommandé
      const availableClasses = await this.findAvailableClassesForLevel(
        levelRecommendation.recommendedLevel,
        nextAcademicYear.id
      );

      console.log("Classes disponibles:", availableClasses.length);

      // 8. Vérifier la situation financière
      const financialValidation = await this.checkFinancialEligibility(
        studentId,
        previousEnrollment.academicYearId
      );

      console.log("Validation financiere:", {
        eligible: financialValidation.eligible,
        balance: financialValidation.balance,
      });

      // 9. Calculer les frais de réinscription
      const reenrollmentFee = await this.calculateReenrollmentFee(
        studentId,
        previousEnrollment.academicYearId,
        nextAcademicYear.id
      );

      // 10. Construire la réponse avec toutes les options
      const validationResult = {
        canReenroll: financialValidation.eligible && !existingEnrollment,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentCode: student.studentCode,
        },
        previousEnrollment: {
          id: previousEnrollment.id,
          academicYear: previousEnrollment.academicYear.year,
          academicYearId: previousEnrollment.academicYear.id,
          className: previousEnrollment.schoolClass.name,
          classLevel: previousEnrollment.schoolClass.level,
          classId: previousEnrollment.classId,
          status: previousEnrollment.status,
        },
        nextAcademicYear: {
          id: nextAcademicYear.id,
          year: nextAcademicYear.year,
          startDate: nextAcademicYear.startDate,
          endDate: nextAcademicYear.endDate,
        },
        academicEvaluation: {
          status: academicEvaluation.status,
          averageGrade: academicEvaluation.averageGrade,
          hasGrades: academicEvaluation.hasGrades,
          passed: academicEvaluation.status === "Passed",
          failed: academicEvaluation.status === "Failed",
          grades: academicEvaluation.grades,
        },
        levelRecommendation: {
          recommendedLevel: levelRecommendation.recommendedLevel,
          reason: levelRecommendation.reason,
          isRedoublement: levelRecommendation.isRedoublement,
          allowedTransitions: levelRecommendation.allowedTransitions,
        },
        availableClasses: availableClasses.map((cls) => ({
          id: cls.id,
          name: cls.name,
          level: cls.level,
          capacity: cls.capacity,
          currentEnrollments: cls._count?.enrollments || 0,
          availableSpots: cls.capacity - (cls._count?.enrollments || 0),
        })),
        financialStatus: {
          eligible: financialValidation.eligible,
          balance: financialValidation.balance,
          overdueAmount: financialValidation.overdueAmount,
          hasOverdueFees: financialValidation.overdueAmount > 0,
          maxAllowedBalance: 5000,
        },
        reenrollmentFee: {
          amount: reenrollmentFee.amount,
          details: reenrollmentFee.details,
        },
        recommendations: this.generateReenrollmentRecommendations(
          academicEvaluation.status,
          academicEvaluation.averageGrade,
          previousEnrollment.schoolClass.level,
          financialValidation,
          levelRecommendation.isRedoublement
        ),
        // Options de réinscription
        reenrollmentOptions: [
          {
            type: "recommended",
            description: levelRecommendation.isRedoublement
              ? "Redoublement recommandé"
              : "Passage normal recommandé",
            classLevel: levelRecommendation.recommendedLevel,
            reason: levelRecommendation.reason,
          },
          // Ajouter d'autres options si disponibles
          ...(academicEvaluation.status === "Passed"
            ? [
                {
                  type: "alternative",
                  description: "Redoublement (optionnel)",
                  classLevel: previousEnrollment.schoolClass.level,
                  reason: "Pour consolider les acquis malgré la réussite",
                },
              ]
            : []),
        ],
      };

      // 11. Journalisation
      console.log("Validation terminee:", {
        student: student.studentCode,
        previousLevel: previousEnrollment.schoolClass.level,
        recommendedLevel: levelRecommendation.recommendedLevel,
        canReenroll: validationResult.canReenroll,
        financialEligible: financialValidation.eligible,
      });

      return {
        success: true,
        message: "Validation de réinscription terminée",
        data: { validation: validationResult },
      };
    } catch (error: any) {
      console.error("EnrollmentService - validateReenrollment error:", error);
      throw error;
    }
  }

  /**
   * Gère la réinscription d'un étudiant avec support complet du redoublement
   */
  async reenrollStudent(data: ReenrollmentData, auditData: AuditData) {
    try {
      const {
        studentId,
        classId,
        academicYearId, // Peut être undefined pour la détection automatique
        previousAcademicYearId,
        previousEnrollmentId,
        enrollmentDate,
        notes,
      } = data;

      console.log("Debut reinscription - Donnees recues:", {
        studentId,
        classId,
        academicYearId: academicYearId || "AUTO-DETECT",
        previousYearId: previousAcademicYearId,
        previousEnrollmentId,
      });

      // 1. Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        console.error("Etudiant non trouve:", studentId);
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // 2. Déterminer l'inscription précédente
      let previousEnrollment = null;
      let previousYear = null;

      if (previousEnrollmentId) {
        // Cas 1: L'utilisateur a spécifié l'inscription précédente
        previousEnrollment = await prisma.enrollment.findUnique({
          where: { id: previousEnrollmentId },
          include: {
            academicYear: true,
            schoolClass: true,
          },
        });

        if (!previousEnrollment) {
          return {
            success: false,
            message: "L'inscription précédente spécifiée n'existe pas",
            code: "PREVIOUS_ENROLLMENT_NOT_FOUND",
          };
        }
        previousYear = previousEnrollment.academicYear;
      } else if (previousAcademicYearId) {
        // Cas 2: Recherche par année académique précédente
        previousYear = await prisma.academicYear.findUnique({
          where: { id: previousAcademicYearId },
        });

        if (!previousYear) {
          return {
            success: false,
            message: "L'année académique précédente spécifiée n'existe pas",
            code: "PREVIOUS_YEAR_NOT_FOUND",
          };
        }

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
          return {
            success: false,
            message: `L'étudiant n'était pas inscrit pour l'année ${previousYear.year}`,
            code: "NO_ENROLLMENT_FOR_YEAR",
          };
        }
      } else {
        // Cas 3: Recherche automatique de la dernière inscription
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
        }
      }

      if (!previousEnrollment || !previousYear) {
        return {
          success: false,
          message: "Aucune inscription précédente trouvée",
          code: "NO_PREVIOUS_ENROLLMENT",
        };
      }

      // 3. DÉTERMINER L'ANNÉE CIBLE
      let targetYear = null;

      if (academicYearId) {
        // Cas A: L'utilisateur a spécifié l'année cible
        targetYear = await prisma.academicYear.findUnique({
          where: { id: academicYearId },
        });

        if (!targetYear) {
          return {
            success: false,
            message: "Année académique cible non trouvée",
            code: "TARGET_YEAR_NOT_FOUND",
          };
        }
      } else {
        // Cas B: Détection automatique de l'année suivante
        targetYear = await this.findNextAcademicYear(previousYear.id);

        if (!targetYear) {
          return {
            success: false,
            message: `Impossible de déterminer l'année académique suivante après ${previousYear.year}`,
            code: "CANNOT_DETERMINE_NEXT_YEAR",
            data: {
              previousYear: previousYear.year,
            },
          };
        }
      }

      console.log("Annee cible determinee:", {
        method: academicYearId ? "MANUEL" : "AUTO-DETECT",
        targetYear: targetYear.year,
        previousYear: previousYear.year,
      });

      console.log("Annee cible trouvee:", targetYear.year);

      // 3. Valider la date d'inscription
      const enrollmentDateObj = enrollmentDate
        ? new Date(enrollmentDate)
        : new Date();
      const dateValidation = await this.validateEnrollmentDate(
        enrollmentDateObj,
        targetYear.id
      );

      if (!dateValidation.valid) {
        return {
          success: false,
          message: dateValidation.reason,
          code: "INVALID_ENROLLMENT_DATE",
        };
      }

      if (previousEnrollmentId) {
        // Cas 1: L'utilisateur a spécifié l'inscription précédente
        console.log(
          "Recherche de l'inscription precedente specifiee:",
          previousEnrollmentId
        );

        previousEnrollment = await prisma.enrollment.findUnique({
          where: { id: previousEnrollmentId },
          include: {
            academicYear: true,
            schoolClass: true,
          },
        });

        if (!previousEnrollment) {
          console.error(
            "Inscription precedente non trouvee:",
            previousEnrollmentId
          );
          return {
            success: false,
            message: "L'inscription précédente spécifiée n'existe pas",
            code: "PREVIOUS_ENROLLMENT_NOT_FOUND",
          };
        }

        previousYear = previousEnrollment.academicYear;
        console.log("Inscription precedente trouvee:", previousYear.year);
      } else if (previousAcademicYearId) {
        // Cas 2: Recherche par année académique précédente
        previousYear = await prisma.academicYear.findUnique({
          where: { id: previousAcademicYearId },
        });

        if (!previousYear) {
          return {
            success: false,
            message: "L'année académique précédente spécifiée n'existe pas",
            code: "PREVIOUS_YEAR_NOT_FOUND",
          };
        }

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
          return {
            success: false,
            message: `L'étudiant n'était pas inscrit pour l'année ${previousYear.year}`,
            code: "NO_ENROLLMENT_FOR_YEAR",
          };
        }
      } else {
        // Cas 3: Recherche automatique
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
        }
      }

      // 5. Vérifier si une inscription précédente a été trouvée
      if (!previousEnrollment || !previousYear) {
        return {
          success: false,
          message: "Aucune inscription précédente trouvée",
          code: "NO_PREVIOUS_ENROLLMENT",
        };
      }

      console.log("Inscription precedente confirmee:", {
        previousYear: previousYear.year,
        previousClass: previousEnrollment.schoolClass?.name,
        previousLevel: previousEnrollment.schoolClass?.level,
        previousStatus: previousEnrollment.status,
      });

      // 6. Vérifier que l'année précédente n'est pas la même que l'année cible
      if (previousYear.id === targetYear.id) {
        console.error("L'annee precedente est la meme que l'annee cible");
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année académique",
          code: "ALREADY_ENROLLED_CURRENT_YEAR",
        };
      }

      // 7. Vérifier la chronologie des années
      if (previousYear.endDate >= targetYear.startDate) {
        return {
          success: false,
          message:
            "L'année précédente doit se terminer avant la nouvelle année",
          code: "INVALID_YEAR_SEQUENCE",
          data: {
            previousYearEnd: previousYear.endDate,
            targetYearStart: targetYear.startDate,
          },
        };
      }

      // 8. Vérifier si l'étudiant est déjà inscrit pour l'année cible
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
        console.error("Etudiant deja inscrit pour l'annee cible");
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

      // 9. Vérifier si la classe existe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        console.error("Classe non trouvee:", classId);
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      console.log(
        "Classe trouvee:",
        schoolClass.name,
        "- Niveau:",
        schoolClass.level
      );

      // 10. Déterminer le statut académique pour validation des niveaux
      const academicStatus = await this.getAcademicStatus(
        studentId,
        previousYear.id
      );

      // 11. Valider la transition de niveau (avec support du redoublement)
      const levelValidation = await this.validateClassLevelTransition(
        studentId,
        classId,
        previousEnrollment.classId,
        academicStatus
      );

      if (!levelValidation.valid) {
        return {
          success: false,
          message: levelValidation.reason,
          code: "INVALID_CLASS_LEVEL",
          data: {
            previousClass: previousEnrollment.schoolClass,
            newClass: schoolClass,
            academicStatus,
          },
        };
      }

      // 12. Vérifier la capacité de la classe
      const currentEnrollments = await prisma.enrollment.count({
        where: {
          classId,
          academicYearId: targetYear.id,
          status: "Active",
        },
      });

      if (currentEnrollments >= (schoolClass.capacity || 30)) {
        console.error("Classe pleine:", {
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

      console.log("Capacite disponible:", {
        capacity: schoolClass.capacity,
        current: currentEnrollments,
        available: (schoolClass.capacity || 30) - currentEnrollments,
      });

      // 13. Valider l'éligibilité financière
      const financialValidation = await this.checkFinancialEligibility(
        studentId,
        previousYear.id
      );

      if (!financialValidation.eligible) {
        return {
          success: false,
          message: "Solde impayé trop élevé pour l'année précédente",
          code: "FINANCIAL_BLOCK",
          data: {
            balance: financialValidation.balance,
            overdueAmount: financialValidation.overdueAmount,
            maxAllowed: 5000,
          },
        };
      }

      // 14. Calculer les frais de réinscription
      const reenrollmentFee = await this.calculateReenrollmentFee(
        studentId,
        previousYear.id,
        targetYear.id
      );

      console.log("Frais de reinscription calcules:", reenrollmentFee.amount);

      // 15. Valider l'intégrité de la chaîne historique
      const chainValidation = await this.validateEnrollmentChain(
        "new-enrollment",
        previousEnrollment.id
      );

      if (!chainValidation.valid) {
        return {
          success: false,
          message: chainValidation.errors.join(", "),
          code: "INVALID_ENROLLMENT_CHAIN",
        };
      }

      // 16. Démarrer une transaction pour garantir l'intégrité des données
      const result = await prisma.$transaction(async (tx) => {
        // Créer la nouvelle inscription
        const enrollment = await tx.enrollment.create({
          data: {
            studentId,
            classId,
            academicYearId: targetYear.id,
            enrollmentDate: enrollmentDateObj,
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

        console.log("Nouvelle inscription creee:", enrollment.id);

        // Mettre à jour la classe de l'étudiant
        await tx.student.update({
          where: { id: studentId },
          data: {
            classId,
            status: "Active",
          },
        });

        console.log("Classe de l'etudiant mise a jour");

        // Mettre à jour l'inscription précédente pour marquer comme terminée
        await tx.enrollment.update({
          where: { id: previousEnrollment.id },
          data: {
            status: "Completed",
          },
        });

        console.log("Inscription precedente mise a jour comme terminee");

        // Créer un paiement pour les frais de réinscription si nécessaire
        // if (reenrollmentFee.amount > 0) {
        //   // CORRECTION: Utiliser tx.payment directement, pas (tx as any).payment
        //   await tx.payment.create({
        //     data: {
        //       studentId,
        //       amount: reenrollmentFee.amount,
        //       paidDate: new Date(),
        //       paymentMethod: "Bank",
        //       status: "Pending",
        //       description: `Frais de réinscription - ${targetYear.year}`,
        //       type: "Tuition",
        //       academicYearId: targetYear.id,
        //     },
        //   });

        //   console.log("Paiement de reinscription cree");
        // }

        // Créer les frais de scolarité pour la nouvelle année
        await this.createStudentFees(studentId, targetYear.id, tx);

        console.log("Frais de scolarite crees pour la nouvelle annee");

        return enrollment;
      });

      console.log("Reinscription terminee avec succes!");

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
          isRepeat: previousEnrollment.classId === classId,
        },
        metadata: {
          studentId,
          studentCode: student.studentCode,
          classId,
          className: schoolClass.name,
          classLevel: schoolClass.level,
          previousClassId: previousEnrollment.classId,
          previousClassName: previousEnrollment.schoolClass?.name,
          previousClassLevel: previousEnrollment.schoolClass?.level,
          previousYearId: previousYear.id,
          targetYearId: targetYear.id,
          reenrollmentFeeAmount: reenrollmentFee.amount,
          isRedoublement: previousEnrollment.classId === classId,
          notes,
        },
      };
    } catch (error: any) {
      console.error("EnrollmentService - reenrollStudent error:", error);

      // Gérer les erreurs spécifiques
      if (error.code === "P2002") {
        return {
          success: false,
          message: "L'étudiant est déjà inscrit pour cette année académique",
          code: "ALREADY_ENROLLED",
        };
      }

      if (error.code === "P2003") {
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
      console.error("EnrollmentService - getStudentEnrollments error:", error);
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
      console.error("EnrollmentService - getEnrollmentStats error:", error);
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
      console.error("EnrollmentService - createBulkEnrollments error:", error);
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
      console.error("EnrollmentService - getEnrollmentHistory error:", error);
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
        "EnrollmentService - getAvailableFeeStructures error:",
        error
      );
      throw error;
    }
  }

  /**
   * Supprime une inscription
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

      // Vérifier si l'inscription peut être supprimée
      if (enrollment.status === "Completed") {
        return {
          success: false,
          message:
            "Une inscription terminée ou archivée ne peut pas être supprimée",
          code: "CANNOT_DELETE_COMPLETED_ENROLLMENT",
        };
      }

      // Vérifier si l'inscription a des inscriptions suivantes
      const nextEnrollments = await prisma.enrollment.findMany({
        where: {
          previousEnrollmentId: id,
        },
      });

      if (nextEnrollments.length > 0) {
        return {
          success: false,
          message:
            "Cette inscription a des inscriptions suivantes et ne peut pas être supprimée",
          code: "HAS_NEXT_ENROLLMENTS",
          data: {
            nextEnrollmentsCount: nextEnrollments.length,
          },
        };
      }

      // Supprimer l'inscription
      await prisma.enrollment.delete({
        where: { id },
      });

      console.log("Inscription supprimee avec succes", id);

      return {
        success: true,
        message: "Inscription supprimée avec succès",
      };
    } catch (error: any) {
      console.error("EnrollmentService - deleteEnrollment error:", error);
      throw error;
    }
  }

  /**
   * Récupère les inscriptions d'un étudiant avec les détails complets
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
        "EnrollmentService - getStudentEnrollmentHistory error:",
        error
      );
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
    feeStructureIds: string[] = [],
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
    >
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
          console.warn(`Structure de frais ${feeStructureId} non trouvee`);
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
          console.log(`L'etudiant a deja ces frais: ${feeStructure.name}`);
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

        console.log(`Frais attribues: ${feeStructure.name}`);
      }

      return {
        success: true,
        message:
          assignedFees.length > 0
            ? `${assignedFees.length} frais attribues`
            : "Aucun nouveau frais attribue",
        assignedFees,
      };
    } catch (error) {
      console.error("Erreur attribution frais:", error);
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
      console.log("Calcul des frais de reinscription:", {
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

      console.log("Solde precedent calcule:", {
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
      console.log("Frais de base:", baseFee);

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
          `Frais estimes pour ${currentAcademicYear.year}:`,
          estimatedYearFees
        );
      } else {
        console.warn("Annee academique courante non trouvee:", currentYearId);
      }

      // 6. Calculer le total
      const totalFee = baseFee + previousBalance;

      console.log("Total calcule:", {
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
      console.error("Erreur calcul frais reinscription:", error);
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
      console.log("Creation des frais de scolarite:", {
        studentId,
        academicYearId,
      });

      // 1. Récupérer le nom de l'année académique
      const academicYear = await prismaClient.academicYear.findUnique({
        where: { id: academicYearId },
        select: { year: true },
      });

      if (!academicYear) {
        console.error("Annee academique non trouvee:", academicYearId);
        return;
      }

      const academicYearName = academicYear.year;
      console.log("Nom de l'annee academique:", academicYearName);

      // 2. Récupérer les structures de frais actives pour cette année
      const feeStructures = await prismaClient.feeStructure.findMany({
        where: {
          academicYear: academicYearName, // Recherche par nom d'année (String)
          isActive: true,
        },
      });

      if (feeStructures.length === 0) {
        console.log(
          `Aucune structure de frais active trouvee pour ${academicYearName}`
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

          console.log(`Frais par defaut cree: ${feeStructure.name}`);
        }

        console.log("Frais par defaut crees pour l'etudiant");
        return;
      }

      console.log(`${feeStructures.length} structures de frais trouvees`);

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
            console.log(`Frais deja existants: ${feeStructure.name}`);
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
            `Frais crees: ${feeStructure.name} - ${feeStructure.amount} HTG`
          );
          return studentFee;
        }
      );

      const results = await Promise.all(createPromises);
      const createdFees = results.filter((r) => r !== null);

      console.log(`${createdFees.length} frais crees avec succes`);
    } catch (error) {
      console.error("Erreur creation frais scolarite:", error);
      throw error;
    }
  }

  /**
   * Valide les résultats académiques
   * @private
   */
  private validateAcademicResults(
    studentId: string,
    academicYearId: string,
    grades: any[]
  ): boolean {
    if (grades.length === 0) return false;

    const average =
      grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
    return average >= 50; // Note moyenne minimale de 50
  }

  /**
   * Détermine le statut académique à partir des notes
   * @private
   */
  private determineAcademicStatus(
    grades: any[]
  ): "Passed" | "Failed" | "NoGrades" {
    if (grades.length === 0) return "NoGrades";

    const average =
      grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
    return average >= 50 ? "Passed" : "Failed";
  }

  /**
   * Détermine le statut académique d'un étudiant
   * @private
   */
  private async getAcademicStatus(
    studentId: string,
    academicYearId: string
  ): Promise<"Passed" | "Failed" | "NoGrades"> {
    try {
      const grades = await prisma.grade.findMany({
        where: {
          studentId,
          academicYearId,
        },
      });

      if (grades.length === 0) return "NoGrades";

      const average =
        grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
      return average >= 50 ? "Passed" : "Failed";
    } catch (error) {
      console.error("Erreur récupération statut académique:", error);
      return "NoGrades";
    }
  }

  /**
   * Valide la date d'inscription par rapport à l'année académique
   * @private
   */
  private async validateEnrollmentDate(
    enrollmentDate: Date,
    academicYearId: string
  ): Promise<{ valid: boolean; reason?: string }> {
    try {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });

      if (!academicYear) {
        return {
          valid: false,
          reason: "Année académique non trouvée",
        };
      }

      // Vérifier que la date d'inscription est dans l'année académique
      if (enrollmentDate < academicYear.startDate) {
        return {
          valid: false,
          reason:
            "La date d'inscription ne peut pas être antérieure au début de l'année académique",
        };
      }

      if (enrollmentDate > academicYear.endDate) {
        return {
          valid: false,
          reason:
            "La date d'inscription ne peut pas être postérieure à la fin de l'année académique",
        };
      }

      return { valid: true };
    } catch (error) {
      console.error("Erreur validation date inscription:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation de la date",
      };
    }
  }

  /**
   * Valide la transition de statut
   * @private
   */
  private async validateStatusTransition(
    oldStatus: string,
    newStatus: string,
    enrollmentId: string
  ): Promise<{ valid: boolean; reason?: string }> {
    // Définir les transitions autorisées
    const allowedTransitions: Record<string, string[]> = {
      Active: ["Suspended", "Completed", "Archived"],
      Suspended: ["Active", "Completed", "Archived"],
      Completed: ["Archived"], // Une fois terminé, seulement archivage possible
      Archived: [], // Archivé, plus aucun changement possible
    };

    // Vérifier si la transition est autorisée
    if (!allowedTransitions[oldStatus]?.includes(newStatus)) {
      return {
        valid: false,
        reason: `Transition de ${oldStatus} vers ${newStatus} non autorisée`,
      };
    }

    // Règles spécifiques
    if (newStatus === "Completed") {
      // Vérifier que l'année académique est terminée ou proche de la fin
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: { academicYear: true },
      });

      if (enrollment && enrollment.academicYear) {
        const today = new Date();
        const daysUntilEnd = Math.ceil(
          (enrollment.academicYear.endDate.getTime() - today.getTime()) /
            (1000 * 3600 * 24)
        );

        if (daysUntilEnd > 30) {
          return {
            valid: false,
            reason: "L'année académique n'est pas encore terminée",
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Valide si une inscription peut être complétée
   * @private
   */
  private async validateCanCompleteEnrollment(
    enrollmentId: string
  ): Promise<{ valid: boolean; reason?: string; details?: any }> {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          student: true,
          academicYear: true,
        },
      });

      if (!enrollment) {
        return {
          valid: false,
          reason: "Inscription non trouvée",
        };
      }

      // 1. Vérifier la situation financière
      const financialValidation = await this.checkFinancialEligibility(
        enrollment.studentId,
        enrollment.academicYearId
      );

      if (!financialValidation.eligible) {
        return {
          valid: false,
          reason: "L'étudiant a des frais impayés",
          details: {
            balance: financialValidation.balance,
            overdueAmount: financialValidation.overdueAmount,
          },
        };
      }

      // 2. Vérifier les résultats académiques (si disponibles)
      const grades = await prisma.grade.findMany({
        where: {
          studentId: enrollment.studentId,
          academicYearId: enrollment.academicYearId,
        },
      });

      if (grades.length > 0) {
        const passed = this.validateAcademicResults(
          enrollment.studentId,
          enrollment.academicYearId,
          grades
        );
        if (!passed) {
          return {
            valid: false,
            reason: "L'étudiant n'a pas validé son année académique",
            details: {
              gradesCount: grades.length,
              averageGrade:
                grades.reduce((sum, grade) => sum + grade.grade, 0) /
                grades.length,
            },
          };
        }
      }

      return { valid: true };
    } catch (error) {
      console.error("Erreur validation completion inscription:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation",
      };
    }
  }

  /**
   * Vérifie l'éligibilité financière
   * @private
   */
  private async checkFinancialEligibility(
    studentId: string,
    academicYearId: string
  ): Promise<{ eligible: boolean; balance: number; overdueAmount: number }> {
    try {
      const studentFees = await prisma.studentFee.findMany({
        where: {
          studentId,
          academicYearId,
          OR: [
            { status: "pending" },
            { status: "overdue" },
            {
              AND: [{ status: "partial" }, { dueDate: { lt: new Date() } }],
            },
          ],
        },
        include: {
          payments: true,
        },
      });

      let totalBalance = 0;
      let overdueAmount = 0;
      const today = new Date();

      studentFees.forEach((fee) => {
        const totalPaid = fee.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const balance = fee.totalAmount - totalPaid;

        if (balance > 0) {
          totalBalance += balance;

          if (fee.dueDate < today) {
            overdueAmount += balance;
          }
        }
      });

      // Politique: maximum 5000 HTG d'impayés tolérés
      const eligible = totalBalance <= 5000;

      return {
        eligible,
        balance: totalBalance,
        overdueAmount,
      };
    } catch (error) {
      console.error("Erreur vérification éligibilité financière:", error);
      return {
        eligible: false,
        balance: 0,
        overdueAmount: 0,
      };
    }
  }

  /**
   * Retourne les niveaux autorisés après un niveau donné
   * @private
   */
  private getAllowedNextLevels(
    currentLevel: string,
    academicStatus: "Passed" | "Failed" | "NoGrades" = "Passed"
  ): string[] {
    const nextLevels: string[] = [];

    // Toujours permettre le même niveau (redoublement)
    nextLevels.push(currentLevel);

    // Ajouter les niveaux supérieurs si l'élève a réussi ou n'a pas de notes
    if (academicStatus === "Passed" || academicStatus === "NoGrades") {
      const normalTransitions: Record<string, string[]> = {
        [ClassLevel.Sixieme]: [ClassLevel.Cinquieme],
        [ClassLevel.Cinquieme]: [ClassLevel.Quatrieme],
        [ClassLevel.Quatrieme]: [ClassLevel.Troisieme, ClassLevel.NSI],
        [ClassLevel.Troisieme]: [ClassLevel.Seconde],
        [ClassLevel.Seconde]: [ClassLevel.Premiere],
        [ClassLevel.Premiere]: [ClassLevel.Terminale],
        [ClassLevel.Terminale]: [],
        [ClassLevel.NSI]: [ClassLevel.NSII],
        [ClassLevel.NSII]: [ClassLevel.NSIII],
        [ClassLevel.NSIII]: [ClassLevel.NSIV],
        [ClassLevel.NSIV]: [],
      };

      nextLevels.push(...(normalTransitions[currentLevel] || []));
    }

    return Array.from(new Set(nextLevels)); // Éliminer les doublons
  }

  /**
   * Valide la transition entre niveaux avec support complet du redoublement
   * @private
   */
  private async validateClassLevelTransition(
    studentId: string,
    newClassId: string,
    previousClassId?: string,
    academicStatus: "Passed" | "Failed" | "NoGrades" = "Passed"
  ): Promise<{ valid: boolean; reason?: string; details?: any }> {
    if (!previousClassId) {
      return { valid: true }; // Première inscription
    }

    try {
      const [previousClass, newClass] = await Promise.all([
        prisma.schoolClass.findUnique({
          where: { id: previousClassId },
          select: { id: true, name: true, level: true },
        }),
        prisma.schoolClass.findUnique({
          where: { id: newClassId },
          select: { id: true, name: true, level: true },
        }),
      ]);

      if (!previousClass || !newClass) {
        return { valid: false, reason: "Classe non trouvée" };
      }

      const levelOrder = this.getClassLevelOrder();
      const previousLevel = previousClass.level;
      const newLevel = newClass.level;

      // Vérifier que les niveaux existent dans l'ordre défini
      if (!levelOrder.has(previousLevel) || !levelOrder.has(newLevel)) {
        return {
          valid: false,
          reason: `Niveau de classe non reconnu: ${!levelOrder.has(previousLevel) ? previousLevel : newLevel}`,
        };
      }

      // PERMETTRE LE MÊME NIVEAU (REDOUBLEMENT)
      if (newLevel === previousLevel) {
        const canRepeat = await this.validateLevelRepetition(
          studentId,
          previousClassId
        );
        if (!canRepeat.valid) {
          return {
            valid: false,
            reason: canRepeat.reason || "Le redoublement n'est pas autorisé",
            details: canRepeat.details,
          };
        }
        return { valid: true };
      }

      const previousOrder = levelOrder.get(previousLevel)!;
      const newOrder = levelOrder.get(newLevel)!;

      // Règles de transition
      const rules = {
        // Transition normale: doit suivre l'ordre
        normalTransition: newOrder === previousOrder + 1,

        // Transition spéciale Quatrième -> Troisieme ou NSI
        fromQuatrieme:
          previousLevel === ClassLevel.Quatrieme &&
          (newLevel === ClassLevel.Troisieme || newLevel === ClassLevel.NSI),

        // Descendre de niveau (non autorisé)
        goDownLevel: newOrder < previousOrder,

        // Sauter un niveau (non autorisé sauf si l'élève a très bien réussi)
        skipLevel: newOrder > previousOrder + 1,
      };

      // Si l'élève a échoué, ne permet que le redoublement
      if (academicStatus === "Failed") {
        return {
          valid: false,
          reason: "L'élève ayant échoué, seul le redoublement est autorisé",
          details: {
            requiredLevel: previousLevel,
            currentLevel: newLevel,
            academicStatus,
          },
        };
      }

      // Vérifications normales pour les élèves qui ont réussi ou n'ont pas de notes
      if (rules.goDownLevel) {
        return {
          valid: false,
          reason: "La descente de niveau n'est pas autorisée",
          details: {
            from: previousLevel,
            to: newLevel,
            allowedNext: this.getAllowedNextLevels(
              previousLevel,
              academicStatus
            ),
          },
        };
      }

      if (rules.skipLevel) {
        // Pour les très bons élèves (moyenne > 80), on peut autoriser le saut
        if (academicStatus === "Passed") {
          const grades = await prisma.grade.findMany({
            where: {
              studentId,
              academicYear: {
                id: (
                  await prisma.enrollment.findFirst({
                    where: {
                      studentId,
                      classId: previousClassId,
                      status: { in: ["Active", "Completed"] },
                    },
                    select: { academicYearId: true },
                  })
                )?.academicYearId,
              },
            },
          });

          const average =
            grades.length > 0
              ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
              : 0;

          if (average < 80) {
            return {
              valid: false,
              reason:
                "Le saut de niveau n'est autorisé que pour les élèves avec une moyenne supérieure à 80",
              details: {
                average,
                requiredAverage: 80,
              },
            };
          }
        } else {
          return {
            valid: false,
            reason: "Il n'est pas permis de sauter un niveau",
            details: {
              from: previousLevel,
              to: newLevel,
              allowedNext: this.getAllowedNextLevels(
                previousLevel,
                academicStatus
              ),
            },
          };
        }
      }

      // Transition depuis Quatrième
      if (previousLevel === ClassLevel.Quatrieme) {
        if (!rules.fromQuatrieme) {
          return {
            valid: false,
            reason:
              "Après la Quatrième, l'étudiant doit aller en Troisième (parcours classique) ou en NSI (Nouveau Secondaire)",
            details: {
              allowed: [ClassLevel.Troisieme, ClassLevel.NSI],
              received: newLevel,
            },
          };
        }

        // Si transition vers NSI, vérifier l'orientation
        if (newLevel === ClassLevel.NSI) {
          const orientationValid =
            await this.validateNouveauSecondaireOrientation(studentId);
          if (!orientationValid.valid) {
            return {
              valid: false,
              reason:
                orientationValid.reason ||
                "L'orientation vers le Nouveau Secondaire n'est pas valide",
              details: orientationValid.details,
            };
          }
        }
      }

      // Vérifier les transitions spécifiques
      const validTransition = rules.normalTransition || rules.fromQuatrieme;

      if (!validTransition) {
        return {
          valid: false,
          reason: "Transition de niveau non autorisée",
          details: {
            from: previousLevel,
            to: newLevel,
            allowedTransitions: this.getAllowedTransitions(
              previousLevel,
              academicStatus
            ),
          },
        };
      }

      return { valid: true };
    } catch (error) {
      console.error("Erreur validation transition niveau:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation de la transition de niveau",
      };
    }
  }

  /**
   * Valide l'orientation vers le Nouveau Secondaire
   * @private
   */
  private async validateNouveauSecondaireOrientation(
    studentId: string
  ): Promise<{ valid: boolean; reason?: string; details?: any }> {
    try {
      // Vérifier si l'étudiant a des notes en Quatrième
      // (Prisma GradeWhereInput n'a pas de relation 'schoolClass', on récupère donc
      // d'abord les academicYearId des inscriptions en Quatrième, puis on cherche les grades)
      const quatriemeEnrollments = await prisma.enrollment.findMany({
        where: {
          studentId,
          schoolClass: {
            level: ClassLevel.Quatrieme,
          },
        },
        select: {
          academicYearId: true,
        },
      });

      const academicYearIds = quatriemeEnrollments.map((e) => e.academicYearId);

      const grades = await prisma.grade.findMany({
        where: {
          studentId,
          academicYearId:
            academicYearIds.length > 0 ? { in: academicYearIds } : undefined,
        },
        include: {
          subject: true,
        },
      });

      if (grades.length === 0) {
        return {
          valid: true, // Pas de notes, orientation par défaut autorisée
          details: { hasGrades: false },
        };
      }

      // Critères pour le Nouveau Secondaire
      const average =
        grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
      const mathGrade =
        (grades as any).find((g: any) =>
          (g.subject?.name ?? "").toLowerCase().includes("math")
        )?.grade || 0;
      const scienceGrade =
        (grades as any).find(
          (g: any) =>
            (g.subject?.name ?? "").toLowerCase().includes("science") ||
            (g.subject?.name ?? "").toLowerCase().includes("physique") ||
            (g.subject?.name ?? "").toLowerCase().includes("chimie")
        )?.grade || 0;

      // Règles d'orientation
      const meetsCriteria =
        average >= 60 && mathGrade >= 50 && scienceGrade >= 50;

      if (!meetsCriteria) {
        return {
          valid: false,
          reason:
            "L'étudiant ne remplit pas les critères pour le Nouveau Secondaire",
          details: {
            average,
            mathGrade,
            scienceGrade,
            required: { average: 60, math: 50, science: 50 },
          },
        };
      }

      return {
        valid: true,
        details: {
          average,
          mathGrade,
          scienceGrade,
          meetsCriteria: true,
        },
      };
    } catch (error) {
      console.error("Erreur validation orientation:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation de l'orientation",
      };
    }
  }

  /**
   * Valide si un redoublement est autorisé
   * @private
   */
  private async validateLevelRepetition(
    studentId: string,
    classId: string
  ): Promise<{ valid: boolean; reason?: string; details?: any }> {
    try {
      // Vérifier si l'étudiant a déjà redoublé ce niveau
      const classData = await prisma.schoolClass.findUnique({
        where: { id: classId },
        select: { level: true },
      });

      if (!classData) {
        return { valid: false, reason: "Classe non trouvée" };
      }

      const enrollments = await prisma.enrollment.findMany({
        where: {
          studentId,
          schoolClass: {
            level: classData.level,
          },
          status: { in: ["Completed", "Active"] },
        },
        orderBy: {
          enrollmentDate: "desc",
        },
      });

      // Si déjà 2 inscriptions à ce niveau (déjà redoublé une fois)
      if (enrollments.length >= 2) {
        return {
          valid: false,
          reason: `L'étudiant a déjà redoublé le niveau ${classData.level}`,
          details: {
            level: classData.level,
            enrollmentCount: enrollments.length,
            maxAllowed: 1,
          },
        };
      }

      // Vérifier les résultats si disponible
      if (enrollments.length > 0) {
        const lastEnrollment = enrollments[0];
        const grades = await prisma.grade.findMany({
          where: {
            studentId,
            academicYearId: lastEnrollment.academicYearId,
          },
        });

        if (grades.length > 0) {
          const average =
            grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
          const passed = average >= 50;

          if (passed) {
            return {
              valid: false,
              reason:
                "L'étudiant a déjà réussi ce niveau, le redoublement n'est pas nécessaire",
              details: {
                average,
                passed: true,
              },
            };
          }
        }
      }

      return { valid: true };
    } catch (error) {
      console.error("Erreur validation redoublement:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation du redoublement",
      };
    }
  }

  /**
   * Retourne les transitions autorisées depuis un niveau
   * @private
   */
  private getAllowedTransitions(
    currentLevel: string,
    academicStatus: "Passed" | "Failed" | "NoGrades" = "Passed"
  ): Array<{
    to: string;
    description: string;
    parcours: string;
    allowed: boolean;
  }> {
    const transitions: Array<{
      to: string;
      description: string;
      parcours: string;
      allowed: boolean;
    }> = [];

    // Toujours permettre le même niveau (redoublement)
    transitions.push({
      to: currentLevel,
      description:
        academicStatus === "Failed"
          ? "Redoublement (recommandé)"
          : "Redoublement",
      parcours: this.getLevelParcours(currentLevel),
      allowed: true,
    });

    // Ajouter les transitions normales si l'élève a réussi ou n'a pas de notes
    if (academicStatus === "Passed" || academicStatus === "NoGrades") {
      const normalTransitions: Record<
        string,
        Array<{
          to: string;
          description: string;
          parcours: string;
        }>
      > = {
        [ClassLevel.Sixieme]: [
          {
            to: ClassLevel.Cinquieme,
            description: "Passage normal",
            parcours: "Classique",
          },
        ],
        [ClassLevel.Cinquieme]: [
          {
            to: ClassLevel.Quatrieme,
            description: "Passage normal",
            parcours: "Classique",
          },
        ],
        [ClassLevel.Quatrieme]: [
          {
            to: ClassLevel.Troisieme,
            description: "Poursuite parcours classique",
            parcours: "Classique",
          },
          {
            to: ClassLevel.NSI,
            description: "Orientation Nouveau Secondaire",
            parcours: "Nouveau Secondaire",
          },
        ],
        [ClassLevel.Troisieme]: [
          {
            to: ClassLevel.Seconde,
            description: "Passage normal",
            parcours: "Classique",
          },
        ],
        [ClassLevel.Seconde]: [
          {
            to: ClassLevel.Premiere,
            description: "Passage normal",
            parcours: "Classique",
          },
        ],
        [ClassLevel.Premiere]: [
          {
            to: ClassLevel.Terminale,
            description: "Passage normal",
            parcours: "Classique",
          },
        ],
        [ClassLevel.Terminale]: [],
        [ClassLevel.NSI]: [
          {
            to: ClassLevel.NSII,
            description: "Passage normal",
            parcours: "Nouveau Secondaire",
          },
        ],
        [ClassLevel.NSII]: [
          {
            to: ClassLevel.NSIII,
            description: "Passage normal",
            parcours: "Nouveau Secondaire",
          },
        ],
        [ClassLevel.NSIII]: [
          {
            to: ClassLevel.NSIV,
            description: "Passage normal",
            parcours: "Nouveau Secondaire",
          },
        ],
        [ClassLevel.NSIV]: [],
      };

      const normalTrans = normalTransitions[currentLevel] || [];
      normalTrans.forEach((trans) => {
        transitions.push({
          ...trans,
          allowed: true,
        });
      });
    }

    return transitions;
  }

  /**
   * Génère des recommandations pour la réinscription
   * @private
   */
  // private generateReenrollmentRecommendations(
  //   academicStatus: "Passed" | "Failed" | "NoGrades",
  //   averageGrade: number,
  //   previousLevel: string,
  //   financialValidation: any
  // ): Array<{
  //   type: "warning" | "info" | "success" | "error";
  //   message: string;
  //   action?: string;
  // }> {
  //   const recommendations: Array<{
  //     type: "warning" | "info" | "success" | "error";
  //     message: string;
  //     action?: string;
  //   }> = [];

  //   // Recommandations académiques
  //   if (academicStatus === "Failed") {
  //     recommendations.push({
  //       type: "warning",
  //       message: `L'étudiant a échoué avec une moyenne de ${averageGrade.toFixed(2)}/100`,
  //       action: "Redoublement recommandé",
  //     });

  //     if (averageGrade < 30) {
  //       recommendations.push({
  //         type: "error",
  //         message:
  //           "Résultats très faibles - Recommander une évaluation pédagogique",
  //         action: "Consulter le conseiller pédagogique",
  //       });
  //     }
  //   } else if (academicStatus === "Passed") {
  //     recommendations.push({
  //       type: "success",
  //       message: `L'étudiant a réussi avec une moyenne de ${averageGrade.toFixed(2)}/100`,
  //     });

  //     if (averageGrade >= 80) {
  //       recommendations.push({
  //         type: "info",
  //         message: "Excellents résultats - Possibilité de saut de niveau",
  //         action: "Considérer le passage anticipé",
  //       });
  //     }
  //   } else {
  //     recommendations.push({
  //       type: "info",
  //       message: "Aucune note disponible pour l'année précédente",
  //     });
  //   }

  //   // Recommandations financières
  //   if (!financialValidation.eligible) {
  //     recommendations.push({
  //       type: "error",
  //       message: `Solde impayé de ${financialValidation.balance} HTG`,
  //       action: "Régulariser la situation financière avant réinscription",
  //     });
  //   } else if (financialValidation.balance > 0) {
  //     recommendations.push({
  //       type: "warning",
  //       message: `Solde restant: ${financialValidation.balance} HTG`,
  //       action: "Encaisser les frais restants",
  //     });
  //   }

  //   // Recommandations de niveau
  //   const levelRecommendations = this.getLevelRecommendations(
  //     previousLevel,
  //     academicStatus
  //   );
  //   recommendations.push(...levelRecommendations);

  //   return recommendations;
  // }

  /**
   * Génère des recommandations spécifiques au niveau
   * @private
   */
  private getLevelRecommendations(
    previousLevel: string,
    academicStatus: "Passed" | "Failed" | "NoGrades"
  ): Array<{
    type: "warning" | "info" | "success" | "error";
    message: string;
    action?: string;
  }> {
    const recommendations: Array<{
      type: "warning" | "info" | "success" | "error";
      message: string;
      action?: string;
    }> = [];

    if (academicStatus === "Failed") {
      if (
        [ClassLevel.Terminale, ClassLevel.NSIV].includes(
          previousLevel as ClassLevel
        )
      ) {
        recommendations.push({
          type: "error",
          message: "Échec en année de fin de cycle",
          action: "Considérer une année supplémentaire ou une réorientation",
        });
      } else if (previousLevel === ClassLevel.Quatrieme) {
        recommendations.push({
          type: "warning",
          message: "Échec en Quatrième - Choix du parcours à reconsidérer",
          action: "Évaluer l'orientation vers le parcours classique",
        });
      } else {
        recommendations.push({
          type: "info",
          message: "Redoublement recommandé pour consolider les acquis",
        });
      }
    }

    if (previousLevel === ClassLevel.Quatrieme && academicStatus === "Passed") {
      recommendations.push({
        type: "info",
        message: "Choix du parcours à faire après la Quatrième",
        action:
          "Évaluer les options: Troisième (classique) ou NSI (Nouveau Secondaire)",
      });
    }

    return recommendations;
  }

  /**
   * Valide l'intégrité de la chaîne historique
   * @private
   */
  private async validateEnrollmentChain(
    enrollmentId: string,
    previousEnrollmentId?: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (previousEnrollmentId) {
      // Vérifier que previousEnrollment existe
      const previous = await prisma.enrollment.findUnique({
        where: { id: previousEnrollmentId },
        include: { academicYear: true },
      });

      if (!previous) {
        errors.push(
          `L'inscription précédente ${previousEnrollmentId} n'existe pas`
        );
      } else {
        // Vérifier que la nouvelle inscription est pour une année ultérieure
        const currentEnrollment = await prisma.enrollment.findUnique({
          where: { id: enrollmentId },
          include: { academicYear: true },
        });

        if (currentEnrollment && currentEnrollment.academicYear) {
          if (
            previous.academicYear.endDate >=
            currentEnrollment.academicYear.startDate
          ) {
            errors.push(
              "L'année précédente doit se terminer avant la nouvelle année"
            );
          }
        }

        // Empêcher les cycles en vérifiant les ancêtres
        if (await this.hasCycle(previousEnrollmentId, enrollmentId)) {
          errors.push("Détection d'un cycle dans la chaîne d'inscriptions");
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Vérifie s'il y a un cycle dans la chaîne d'inscriptions
   * @private
   */
  private async hasCycle(startId: string, targetId: string): Promise<boolean> {
    let currentId: string | null = startId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        return true; // Cycle détecté
      }

      if (currentId === targetId) {
        return true; // Le target est un ancêtre du start
      }

      visited.add(currentId);

      const enrollment: any = await prisma.enrollment.findUnique({
        where: { id: currentId },
        select: { previousEnrollmentId: true },
      });

      currentId = enrollment?.previousEnrollmentId || null;
    }

    return false;
  }

  /**
   * Vérifie si une inscription est modifiable
   * @private
   */
  private async validateEnrollmentIsModifiable(
    enrollment: any
  ): Promise<{ valid: boolean; reason?: string }> {
    // Les inscriptions archivées ne sont pas modifiables
    if (enrollment.status === "Archived") {
      return {
        valid: false,
        reason: "Une inscription archivée n'est pas modifiable",
      };
    }

    // Vérifier si l'année académique est terminée
    if (enrollment.academicYear) {
      const today = new Date();
      if (today > enrollment.academicYear.endDate) {
        return {
          valid: false,
          reason:
            "L'année académique est terminée, l'inscription n'est plus modifiable",
        };
      }
    }

    return { valid: true };
  }

  /**
   * Réinscription manuelle avec spécification exacte des années
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
      console.log("Debut reinscription manuelle historique");

      // Vérifier que les deux années sont différentes
      if (data.targetAcademicYearId === data.previousAcademicYearId) {
        return {
          success: false,
          message:
            "L'année cible et l'année précédente doivent être différentes",
          code: "SAME_YEARS",
        };
      }

      // Valider la séquence chronologique des années
      const [targetYear, previousYear] = await Promise.all([
        prisma.academicYear.findUnique({
          where: { id: data.targetAcademicYearId },
        }),
        prisma.academicYear.findUnique({
          where: { id: data.previousAcademicYearId },
        }),
      ]);

      if (!targetYear || !previousYear) {
        return {
          success: false,
          message: "Une des années académiques spécifiées n'existe pas",
          code: "YEAR_NOT_FOUND",
        };
      }

      if (previousYear.endDate >= targetYear.startDate) {
        return {
          success: false,
          message:
            "L'année précédente doit se terminer avant la nouvelle année",
          code: "INVALID_YEAR_SEQUENCE",
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
        "EnrollmentService - manualHistoricalReenrollment error:",
        error
      );
      throw error;
    }
  }
}
