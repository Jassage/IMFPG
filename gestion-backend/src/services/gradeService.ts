/**
 * @file gradeService.ts
 * @description Service pour la gestion des notes des étudiants avec workflow de validation
 */

import {
  PrismaClient,
  ClassLevel,
  GradeStatus,
  ControlType,
  GradeSession,
  UserRole,
} from "../../generated/prisma/client";
import { AuditData } from "../types/auth";

const prisma = new PrismaClient();

// Interfaces
export interface GradeFilters {
  page?: number;
  limit?: number;
  search?: string;
  studentId?: string;
  subjectId?: string;
  assignmentId?: string;
  academicYearId?: string;
  classLevel?: ClassLevel;
  controlType?: ControlType;
  status?: GradeStatus;
  minGrade?: number;
  maxGrade?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  createdBy?: string;
}

export interface CreateGradeData {
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status?: GradeStatus;
  controlType?: ControlType;
  academicYearId: string;
  classLevel?: ClassLevel;
  notes?: string;
  isDraft?: boolean;
}

export interface UpdateGradeData {
  grade?: number;
  status?: GradeStatus;
  controlType?: ControlType;
  notes?: string;
  isActive?: boolean;
  rejectionReason?: string;
}

export interface BulkGradeData {
  studentId: string;
  subjectId: string;
  assignmentId?: string;
  grade: number;
  status?: GradeStatus;
  controlType?: ControlType;
  classLevel?: ClassLevel;
  notes?: string;
}

export interface SubmitGradesData {
  gradeIds: string[];
  submitAll?: boolean;
  filters?: {
    assignmentId?: string;
    controlType?: ControlType;
    classLevel?: ClassLevel;
    subjectId?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  metadata?: any;
}

/**
 * Service pour la gestion des notes avec workflow de validation
 */
export class GradeService {
  /**
   * Récupère la liste des notes avec filtres et pagination
   */
  async getGrades(
    filters: GradeFilters,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        studentId,
        subjectId,
        assignmentId,
        academicYearId,
        classLevel,
        controlType,
        status,
        minGrade,
        maxGrade,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc",
        createdBy,
      } = filters;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      // Construction des filtres
      const where: any = { isActive: true };

      // Filtre par statut selon le rôle
      if (status) {
        where.status = status;
      } else {
        // Filtres par défaut selon le rôle
        switch (auditData.userRole) {
          case UserRole.Student:
            // Les étudiants ne voient que les notes publiées
            where.status = GradeStatus.Published;
            break;

          case UserRole.Professeur:
            // Les professeurs voient leurs propres brouillons + toutes les autres
            where.OR = [
              {
                AND: [
                  { status: GradeStatus.Draft },
                  { createdBy: auditData.userId },
                ],
              },
              { status: { not: GradeStatus.Draft } },
            ];
            break;

          case UserRole.Admin:
            // Les admins voient tout sauf les brouillons des autres
            if (createdBy && createdBy !== auditData.userId) {
              where.OR = [
                { status: { not: GradeStatus.Draft } },
                { createdBy: auditData.userId },
              ];
            }
            break;

          default:
            where.status = { not: GradeStatus.Draft };
        }
      }

      if (studentId) where.studentId = studentId;
      if (subjectId) where.subjectId = subjectId;
      if (assignmentId) where.assignmentId = assignmentId;
      if (academicYearId) where.academicYearId = academicYearId;
      if (classLevel) where.classLevel = classLevel;
      if (controlType) where.controlType = controlType;
      if (createdBy) where.createdBy = createdBy;

      // Filtre par note
      if (minGrade || maxGrade) {
        where.grade = {};
        if (minGrade) where.grade.gte = minGrade;
        if (maxGrade) where.grade.lte = maxGrade;
      }

      // Filtre par date
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      // Recherche par nom d'étudiant ou sujet
      if (search) {
        where.OR = [
          {
            student: {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { studentCode: { contains: search } },
              ],
            },
          },
          {
            subject: {
              OR: [
                { name: { contains: search } },
                { code: { contains: search } },
              ],
            },
          },
        ];
      }

      // Récupération avec pagination et relations
      const [grades, total] = await Promise.all([
        prisma.grade.findMany({
          where,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                classId: true,
                schoolClass: {
                  select: {
                    name: true,
                    level: true,
                  },
                },
              },
            },
            subject: {
              select: {
                id: true,
                code: true,
                name: true,
                coefficient: true,
                type: true,
                maxGrade: true,
                passingGrade: true,
              },
            },
            classAssignment: {
              include: {
                professeur: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    matricule: true,
                  },
                },
                subject: {
                  select: {
                    code: true,
                    name: true,
                  },
                },
              },
            },
            academicYear: {
              select: {
                id: true,
                year: true,
                isCurrent: true,
              },
            },
            createdByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder === "desc" ? "desc" : "asc",
          },
          skip,
          take: limitNum,
        }),
        prisma.grade.count({ where }),
      ]);

      // Calcul des statistiques
      const statistics = {
        totalGrades: total,
        averageGrade:
          grades.length > 0
            ? grades.reduce((sum, grade) => sum + grade.grade, 0) /
              grades.length
            : 0,
        passedGrades: grades.filter((g) => g.grade >= g.subject.passingGrade)
          .length,
        failedGrades: grades.filter((g) => g.grade < g.subject.passingGrade)
          .length,
      };

      return {
        success: true,
        message: "Notes récupérées avec succès",
        data: {
          grades,
          statistics,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      };
    } catch (error: any) {
      console.error("GradeService - getGrades error:", error);
      throw error;
    }
  }

  /**
   * Récupère une note par ID
   */
  async getGradeById(id: string, auditData: AuditData): Promise<ApiResponse> {
    try {
      const grade = await prisma.grade.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
              schoolClass: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              coefficient: true,
              type: true,
              maxGrade: true,
              passingGrade: true,
              description: true,
            },
          },
          classAssignment: {
            include: {
              professeur: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  matricule: true,
                },
              },
              subject: {
                select: {
                  code: true,
                  name: true,
                },
              },
              academicYear: {
                select: {
                  year: true,
                  isCurrent: true,
                },
              },
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
              startDate: true,
              endDate: true,
              isCurrent: true,
            },
          },
          transcriptGrades: {
            include: {
              transcript: {
                select: {
                  id: true,
                  documentType: true,
                  status: true,
                  generatedAt: true,
                },
              },
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          submittedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          approvedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          rejectedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          publishedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!grade) {
        return {
          success: false,
          message: "Note non trouvée",
          code: "GRADE_NOT_FOUND",
        };
      }

      // Vérifier les permissions selon le rôle
      if (!this.canViewGrade(grade, auditData)) {
        return {
          success: false,
          message: "Vous n'avez pas la permission de voir cette note",
          code: "UNAUTHORIZED_VIEW",
        };
      }

      // Calculer si la note est validée
      const isPassing = grade.grade >= grade.subject.passingGrade;

      return {
        success: true,
        message: "Note récupérée avec succès",
        data: {
          grade,
          evaluation: {
            isPassing,
            passingGrade: grade.subject.passingGrade,
            difference: grade.grade - grade.subject.passingGrade,
          },
        },
      };
    } catch (error: any) {
      console.error("GradeService - getGradeById error:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle note
   */
  async createGrade(
    data: CreateGradeData,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      console.log("🔍 DEBUG - Début createGrade");
      console.log("🔍 DEBUG - Role utilisateur:", auditData.userRole);
      console.log("🔍 DEBUG - User ID:", auditData.userId);
      console.log("🔍 DEBUG - Data reçue:", data);

      const {
        studentId,
        subjectId,
        assignmentId,
        grade: gradeValue,
        status,
        controlType,
        academicYearId,
        classLevel,
        notes,
        isDraft = false,
      } = data;

      // Validation des données requises
      if (
        !studentId ||
        !subjectId ||
        !assignmentId ||
        gradeValue === undefined ||
        !academicYearId
      ) {
        return {
          success: false,
          message: "Données requises manquantes",
          code: "MISSING_REQUIRED_FIELDS",
        };
      }

      // Vérifier les permissions de création
      // const canCreate = this.canCreateGrade(auditData);

      // if (!canCreate) {
      //   return {
      //     success: false,
      //     message: "Vous n'êtes pas autorisé à créer des notes",
      //     code: "UNAUTHORIZED_CREATE",
      //   };
      // }

      // Vérifier l'existence des entités liées
      console.log("🔍 DEBUG - Vérification des entités liées");
      const [student, subject, assignment, academicYear] = await Promise.all([
        prisma.student.findUnique({ where: { id: studentId } }),
        prisma.subject.findUnique({ where: { id: subjectId } }),
        prisma.classAssignment.findUnique({
          where: { id: assignmentId },
          include: {
            professeur: true,
          },
        }),
        prisma.academicYear.findUnique({ where: { id: academicYearId } }),
      ]);

      console.log("🔍 DEBUG - Student:", !!student);
      console.log("🔍 DEBUG - Subject:", !!subject);
      console.log("🔍 DEBUG - Assignment:", !!assignment);
      console.log("🔍 DEBUG - AcademicYear:", !!academicYear);

      if (!student) {
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      if (!subject) {
        return {
          success: false,
          message: "Matière non trouvée",
          code: "SUBJECT_NOT_FOUND",
        };
      }

      if (!assignment) {
        return {
          success: false,
          message: "Affectation de classe non trouvée",
          code: "ASSIGNMENT_NOT_FOUND",
        };
      }

      if (!academicYear) {
        return {
          success: false,
          message: "Année académique non trouvée",
          code: "ACADEMIC_YEAR_NOT_FOUND",
        };
      }

      // CORRECTION IMPORTANTE : Vérification d'assignment seulement pour les professeurs
      console.log("🔍 DEBUG - Vérification assignment");
      console.log("🔍 DEBUG - Assignment prof ID:", assignment.professeurId);
      console.log("🔍 DEBUG - User ID:", auditData.userId);

      if (auditData.userRole === UserRole.Professeur) {
        if (assignment.professeur.userId !== auditData.userId) {
          console.log("❌ DEBUG - Professeur non assigné à cette classe");
          return {
            success: false,
            message:
              "Vous n'êtes pas autorisé à saisir des notes pour cette matière/classe",
            code: "UNAUTHORIZED_ASSIGNMENT",
          };
        }
      }
      // Les admins passent cette vérification

      console.log("✅ DEBUG - Toutes les vérifications passées");

      // Vérifier si une note existe déjà pour cette combinaison
      const existingGrade = await prisma.grade.findUnique({
        where: {
          studentId_subjectId_academicYearId_controlType_assignmentId: {
            studentId,
            subjectId,
            academicYearId,
            controlType: controlType || ControlType.CONTROLE_1,
            assignmentId,
          },
        },
      });

      if (existingGrade) {
        return {
          success: false,
          message: "Une note existe déjà pour cette combinaison",
          code: "GRADE_ALREADY_EXISTS",
          data: { existingGradeId: existingGrade.id },
        };
      }

      // Vérifier que la note est dans les limites (0-100)
      const gradeNum = parseFloat(gradeValue.toString());
      if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
        return {
          success: false,
          message: "La note doit être comprise entre 0 et 100",
          code: "INVALID_GRADE_RANGE",
        };
      }

      // Déterminer le statut selon le rôle et les options
      let initialStatus: GradeStatus;
      let message: string;
      let additionalData: any = {};

      if (auditData.userRole === UserRole.Admin) {
        // L'admin peut créer directement en Approved ou Draft
        if (status) {
          initialStatus = status;
          message = `Note créée avec statut: ${status}`;
        } else if (isDraft) {
          initialStatus = GradeStatus.Draft;
          message = "Note enregistrée en brouillon par l'admin";
        } else {
          initialStatus = GradeStatus.Approved;
          message = "Note créée et approuvée par l'admin";
          additionalData = {
            approvedAt: new Date(),
            approvedBy: auditData.userId,
          };
        }
      } else if (auditData.userRole === UserRole.Professeur) {
        // Le professeur crée en Draft ou Submitted
        if (status) {
          initialStatus = status;
          message = `Note créée avec statut: ${status}`;
        } else if (isDraft) {
          initialStatus = GradeStatus.Draft;
          message = "Note enregistrée en brouillon";
        } else {
          initialStatus = GradeStatus.Submitted;
          message = "Note soumise pour validation";
          additionalData = {
            submittedAt: new Date(),
            submittedBy: auditData.userId,
          };
        }
      } else {
        // Autres rôles ne peuvent pas créer de notes
        return {
          success: false,
          message: "Vous n'êtes pas autorisé à créer des notes",
          code: "UNAUTHORIZED_CREATE",
        };
      }

      // Créer la note
      const newGrade = await prisma.grade.create({
        data: {
          studentId,
          subjectId,
          assignmentId,
          grade: gradeNum,
          status: initialStatus,
          controlType: controlType || ControlType.CONTROLE_1,
          academicYearId,
          classLevel: classLevel || assignment.classLevel,
          notes,
          isActive: true,
          createdBy: auditData.userId,
          ...additionalData,
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          subject: {
            select: {
              name: true,
              passingGrade: true,
            },
          },
          classAssignment: {
            select: {
              professeur: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message,
        data: { grade: newGrade },
      };
    } catch (error: any) {
      console.error("GradeService - createGrade error:", error);

      // Gestion des erreurs spécifiques Prisma
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Une note existe déjà pour cette combinaison",
          code: "GRADE_ALREADY_EXISTS",
        };
      }

      throw error;
    }
  }

  /**
   * Crée et publie directement une note (admin seulement)
   */
  async createAndPublishGrade(
    data: CreateGradeData,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que c'est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut créer et publier des notes",
          code: "UNAUTHORIZED_CREATE_PUBLISH",
        };
      }

      // Créer la note directement en Published
      const result = await this.createGrade(
        {
          ...data,
          isDraft: false,
          status: GradeStatus.Published,
        },
        auditData
      );

      if (!result.success) return result;

      // Mettre à jour avec les timestamps de publication
      const publishedGrade = await prisma.grade.update({
        where: { id: result.data.grade.id },
        data: {
          publishedAt: new Date(),
          publishedBy: auditData.userId,
          approvedAt: new Date(),
          approvedBy: auditData.userId,
        },
      });

      // Notifier l'étudiant
      await this.notifyStudentOfPublishedGrade(publishedGrade.id);

      return {
        success: true,
        message: "Note créée et publiée avec succès",
        data: { grade: publishedGrade },
      };
    } catch (error: any) {
      console.error("GradeService - createAndPublishGrade error:", error);
      throw error;
    }
  }

  /**
   * Met à jour une note existante
   */
  async updateGrade(
    id: string,
    data: UpdateGradeData,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const {
        grade: gradeValue,
        status,
        controlType,
        notes,
        isActive,
        rejectionReason,
      } = data;

      // Vérifier si la note existe
      const existingGrade = await prisma.grade.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!existingGrade) {
        return {
          success: false,
          message: "Note non trouvée",
          code: "GRADE_NOT_FOUND",
        };
      }

      // Préparer les données de mise à jour
      const updateData: any = {};
      const changes: string[] = [];

      if (gradeValue !== undefined) {
        const gradeNum = parseFloat(gradeValue.toString());
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
          return {
            success: false,
            message: "La note doit être comprise entre 0 et 100",
            code: "INVALID_GRADE_RANGE",
          };
        }
        updateData.grade = gradeNum;
        changes.push("grade");
      }

      if (controlType !== undefined) {
        updateData.controlType = controlType;
        changes.push("controlType");
      }

      if (notes !== undefined) {
        updateData.notes = notes;
        changes.push("notes");
      }

      if (isActive !== undefined) {
        updateData.isActive = isActive;
        changes.push("isActive");
      }

      // Gestion du statut
      if (status !== undefined) {
        // Vérifier les transitions de statut autorisées
        if (
          !this.isStatusTransitionAllowed(
            existingGrade.status,
            status,
            auditData.userRole
          )
        ) {
          return {
            success: false,
            message: "Transition de statut non autorisée",
            code: "UNAUTHORIZED_STATUS_TRANSITION",
          };
        }

        updateData.status = status;
        changes.push("status");

        // Mettre à jour les timestamps selon le nouveau statut
        if (status === GradeStatus.Approved) {
          updateData.approvedAt = new Date();
          updateData.approvedBy = auditData.userId;
          updateData.rejectedAt = null;
          updateData.rejectedBy = null;
          updateData.rejectionReason = null;
        } else if (status === GradeStatus.Published) {
          updateData.publishedAt = new Date();
          updateData.publishedBy = auditData.userId;
          updateData.approvedAt = new Date();
          updateData.approvedBy = auditData.userId;
        } else if (status === GradeStatus.Rejected) {
          updateData.rejectedAt = new Date();
          updateData.rejectedBy = auditData.userId;
          updateData.rejectionReason = rejectionReason;
          updateData.approvedAt = null;
          updateData.approvedBy = null;
        } else if (status === GradeStatus.Submitted) {
          updateData.submittedAt = new Date();
          updateData.submittedBy = auditData.userId;
        } else if (status === GradeStatus.Draft) {
          updateData.submittedAt = null;
          updateData.submittedBy = null;
        }
      }

      // Mettre à jour la note
      const updatedGrade = await prisma.grade.update({
        where: { id },
        data: updateData,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          subject: {
            select: {
              name: true,
              passingGrade: true,
            },
          },
          classAssignment: {
            include: {
              professeur: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      // Notifier si nécessaire
      if (status === GradeStatus.Published) {
        await this.notifyStudentOfPublishedGrade(id);
      } else if (status === GradeStatus.Rejected && rejectionReason) {
        await this.notifyProfessorOfRejectedGrade(id, rejectionReason);
      }

      return {
        success: true,
        message: "Note mise à jour avec succès",
        data: { grade: updatedGrade },
      };
    } catch (error: any) {
      console.error("GradeService - updateGrade error:", error);

      if (error.code === "P2025") {
        return {
          success: false,
          message: "Note non trouvée",
          code: "GRADE_NOT_FOUND",
        };
      }

      throw error;
    }
  }

  /**
   * Met à jour et publie directement une note (admin seulement)
   */
  async updateAndPublishGrade(
    id: string,
    data: UpdateGradeData,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que c'est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message:
            "Seul un administrateur peut mettre à jour et publier des notes",
          code: "UNAUTHORIZED_UPDATE_PUBLISH",
        };
      }

      // Mettre à jour la note avec publication
      const updateResult = await this.updateGrade(
        id,
        { ...data, status: GradeStatus.Published },
        auditData
      );

      return updateResult;
    } catch (error: any) {
      console.error("GradeService - updateAndPublishGrade error:", error);
      throw error;
    }
  }

  /**
   * Supprime une note
   */
  async deleteGrade(id: string, auditData: AuditData): Promise<ApiResponse> {
    try {
      // Vérifier si la note existe
      const grade = await prisma.grade.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          transcriptGrades: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!grade) {
        return {
          success: false,
          message: "Note non trouvée",
          code: "GRADE_NOT_FOUND",
        };
      }

      // Vérifier les permissions de suppression
      if (!this.canDeleteGrade(grade, auditData)) {
        return {
          success: false,
          message: "Vous n'avez pas la permission de supprimer cette note",
          code: "UNAUTHORIZED_DELETE",
        };
      }

      // Vérifier si la note est utilisée dans des transcripts
      if (grade.transcriptGrades.length > 0) {
        return {
          success: false,
          message:
            "Cette note ne peut pas être supprimée car elle est utilisée dans des transcripts",
          code: "GRADE_HAS_DEPENDENCIES",
          data: {
            transcriptCount: grade.transcriptGrades.length,
          },
        };
      }

      // Supprimer la note
      await prisma.grade.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Note supprimée avec succès",
        metadata: {
          studentName: `${grade.student.firstName} ${grade.student.lastName}`,
          subjectName: grade.subject.name,
        },
      };
    } catch (error: any) {
      console.error("GradeService - deleteGrade error:", error);
      throw error;
    }
  }

  /**
   * Récupère les notes d'un étudiant spécifique
   */
  async getStudentGrades(
    studentId: string,
    filters: {
      academicYearId?: string;
      classLevel?: ClassLevel;
      controlType?: ControlType;
      subjectId?: string;
      includeDraft?: boolean;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier si l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
          email: true,
          schoolClass: {
            select: {
              name: true,
              level: true,
            },
          },
        },
      });

      if (!student) {
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // Construction des filtres
      const where: any = { studentId, isActive: true };

      if (filters.academicYearId) where.academicYearId = filters.academicYearId;
      if (filters.classLevel) where.classLevel = filters.classLevel;
      if (filters.controlType) where.controlType = filters.controlType;
      if (filters.subjectId) where.subjectId = filters.subjectId;

      // Gestion des statuts selon le rôle
      if (auditData.userRole === UserRole.Student) {
        where.status = GradeStatus.Published;
      } else if (auditData.userRole === UserRole.Professeur) {
        if (!filters.includeDraft) {
          where.status = { not: GradeStatus.Draft };
        }
      }
      // Les admins voient tout

      // Récupérer les notes de l'étudiant
      const grades = await prisma.grade.findMany({
        where,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              coefficient: true,
              type: true,
              passingGrade: true,
              maxGrade: true,
            },
          },
          classAssignment: {
            include: {
              professeur: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
              isCurrent: true,
            },
          },
        },
        orderBy: [
          { academicYearId: "desc" },
          { controlType: "asc" },
          { subject: { name: "asc" } },
        ],
      });

      // Calcul des statistiques
      const statistics = this.calculateStudentGradeStatistics(grades);

      return {
        success: true,
        message: "Notes de l'étudiant récupérées avec succès",
        data: {
          student,
          grades,
          statistics,
        },
      };
    } catch (error: any) {
      console.error("GradeService - getStudentGrades error:", error);
      throw error;
    }
  }

  /**
   * Soumet des notes pour validation par l'admin
   */
  async submitGradesForApproval(
    data: SubmitGradesData,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const { gradeIds, submitAll, filters } = data;

      let whereClause: any = {
        isActive: true,
      };

      if (submitAll && filters) {
        // Soumettre toutes les notes correspondant aux filtres
        whereClause.createdBy = auditData.userId; // Seulement ses propres notes
        whereClause.status = GradeStatus.Draft;

        if (filters.assignmentId)
          whereClause.assignmentId = filters.assignmentId;
        if (filters.controlType) whereClause.controlType = filters.controlType;
        if (filters.classLevel) whereClause.classLevel = filters.classLevel;
        if (filters.subjectId) whereClause.subjectId = filters.subjectId;
      } else if (gradeIds && gradeIds.length > 0) {
        // Soumettre des notes spécifiques
        whereClause.id = { in: gradeIds };
        whereClause.createdBy = auditData.userId; // Seulement ses propres notes
        whereClause.status = GradeStatus.Draft;
      } else {
        return {
          success: false,
          message: "Aucune note spécifiée pour soumission",
          code: "NO_GRADES_SPECIFIED",
        };
      }

      // Mettre à jour le statut des notes
      const updatedGrades = await prisma.grade.updateMany({
        where: whereClause,
        data: {
          status: GradeStatus.Submitted,
          submittedAt: new Date(),
          submittedBy: auditData.userId,
        },
      });

      // Notifier les admins
      await this.notifyAdminsForApproval(updatedGrades.count, auditData);

      return {
        success: true,
        message: `${updatedGrades.count} notes soumises pour validation`,
        data: { count: updatedGrades.count },
      };
    } catch (error: any) {
      console.error("GradeService - submitGradesForApproval error:", error);
      throw error;
    }
  }

  /**
   * Récupère les notes en attente de validation
   */
  async getPendingApproval(
    filters: {
      page?: number;
      limit?: number;
      submittedBy?: string;
      assignmentId?: string;
      classLevel?: ClassLevel;
      subjectId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que c'est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut voir les notes en attente",
          code: "UNAUTHORIZED_VIEW",
        };
      }

      const {
        page = 1,
        limit = 20,
        submittedBy,
        assignmentId,
        classLevel,
        subjectId,
        startDate,
        endDate,
      } = filters;

      const skip = (page - 1) * limit;

      const where: any = {
        status: GradeStatus.Submitted,
        isActive: true,
      };

      if (submittedBy) where.submittedBy = submittedBy;
      if (assignmentId) where.assignmentId = assignmentId;
      if (classLevel) where.classLevel = classLevel;
      if (subjectId) where.subjectId = subjectId;

      if (startDate || endDate) {
        where.submittedAt = {};
        if (startDate) where.submittedAt.gte = startDate;
        if (endDate) where.submittedAt.lte = endDate;
      }

      const [grades, total] = await Promise.all([
        prisma.grade.findMany({
          where,
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentCode: true,
                schoolClass: {
                  select: {
                    name: true,
                    level: true,
                  },
                },
              },
            },
            subject: {
              select: {
                name: true,
                coefficient: true,
                passingGrade: true,
              },
            },
            classAssignment: {
              include: {
                professeur: {
                  select: {
                    firstName: true,
                    lastName: true,
                    matricule: true,
                  },
                },
              },
            },
            submittedByUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { submittedAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.grade.count({ where }),
      ]);

      return {
        success: true,
        message: "Notes en attente de validation récupérées",
        data: {
          grades,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error: any) {
      console.error("GradeService - getPendingApproval error:", error);
      throw error;
    }
  }

  /**
   * Approuve une ou plusieurs notes
   */
  async approveGrades(
    gradeIds: string[],
    auditData: AuditData,
    options?: { publishToStudents?: boolean }
  ): Promise<ApiResponse> {
    try {
      // Vérifier que l'utilisateur est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut approuver des notes",
          code: "UNAUTHORIZED_APPROVAL",
        };
      }

      const status = options?.publishToStudents
        ? GradeStatus.Published
        : GradeStatus.Approved;

      const updateData: any = {
        status,
        approvedAt: new Date(),
        approvedBy: auditData.userId,
      };

      if (status === GradeStatus.Published) {
        updateData.publishedAt = new Date();
        updateData.publishedBy = auditData.userId;
      }

      const updatedGrades = await prisma.grade.updateMany({
        where: {
          id: { in: gradeIds },
          status: GradeStatus.Submitted, // Seules les notes soumises peuvent être approuvées
        },
        data: updateData,
      });

      // Notifier les professeurs et étudiants si publié
      if (status === GradeStatus.Published) {
        await this.notifyStudentsAndProfessors(gradeIds);
      } else {
        // Notifier seulement le professeur que sa note est approuvée
        await this.notifyProfessorsOfApproval(gradeIds);
      }

      return {
        success: true,
        message: `${updatedGrades.count} notes ${status === GradeStatus.Published ? "publiées" : "approuvées"}`,
        data: { count: updatedGrades.count },
      };
    } catch (error: any) {
      console.error("GradeService - approveGrades error:", error);
      throw error;
    }
  }

  /**
   * Approuve et publie en une seule opération (admin seulement)
   */
  async approveAndPublishGrades(
    gradeIds: string[],
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que c'est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut approuver et publier des notes",
          code: "UNAUTHORIZED_APPROVE_PUBLISH",
        };
      }

      // Mettre à jour directement en Published
      const updatedGrades = await prisma.grade.updateMany({
        where: {
          id: { in: gradeIds },
          status: {
            in: [
              GradeStatus.Draft,
              GradeStatus.Submitted,
              GradeStatus.Approved,
            ],
          },
        },
        data: {
          status: GradeStatus.Published,
          approvedAt: new Date(),
          approvedBy: auditData.userId,
          publishedAt: new Date(),
          publishedBy: auditData.userId,
          submittedAt: new Date(),
          submittedBy: auditData.userId,
        },
      });

      // Notifier les étudiants
      await this.notifyStudentsOfPublishedGrades(gradeIds);

      return {
        success: true,
        message: `${updatedGrades.count} notes approuvées et publiées`,
        data: { count: updatedGrades.count },
      };
    } catch (error: any) {
      console.error("GradeService - approveAndPublishGrades error:", error);
      throw error;
    }
  }

  /**
   * Rejette une ou plusieurs notes
   */
  async rejectGrades(
    gradeIds: string[],
    reason: string,
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que l'utilisateur est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut rejeter des notes",
          code: "UNAUTHORIZED_REJECTION",
        };
      }

      const updatedGrades = await prisma.grade.updateMany({
        where: {
          id: { in: gradeIds },
          status: GradeStatus.Submitted, // Seules les notes soumises peuvent être rejetées
        },
        data: {
          status: GradeStatus.Rejected,
          rejectedAt: new Date(),
          rejectedBy: auditData.userId,
          rejectionReason: reason,
        },
      });

      // Notifier le professeur
      await this.notifyProfessorOfRejection(gradeIds, reason);

      return {
        success: true,
        message: `${updatedGrades.count} notes rejetées`,
        data: { count: updatedGrades.count },
      };
    } catch (error: any) {
      console.error("GradeService - rejectGrades error:", error);
      throw error;
    }
  }

  /**
   * Publie des notes approuvées aux étudiants
   */
  async publishGradesToStudents(
    gradeIds: string[],
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que l'utilisateur est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Seul un administrateur peut publier des notes",
          code: "UNAUTHORIZED_PUBLICATION",
        };
      }

      const updatedGrades = await prisma.grade.updateMany({
        where: {
          id: { in: gradeIds },
          status: GradeStatus.Approved, // Seules les notes approuvées peuvent être publiées
        },
        data: {
          status: GradeStatus.Published,
          publishedAt: new Date(),
          publishedBy: auditData.userId,
        },
      });

      // Notifier les étudiants
      await this.notifyStudentsOfPublishedGrades(gradeIds);

      return {
        success: true,
        message: `${updatedGrades.count} notes publiées aux étudiants`,
        data: { count: updatedGrades.count },
      };
    } catch (error: any) {
      console.error("GradeService - publishGradesToStudents error:", error);
      throw error;
    }
  }

  /**
   * Importe des notes en masse
   */
  async bulkImportGrades(
    gradesData: BulkGradeData[],
    academicYearId: string,
    assignmentId?: string,
    auditData?: AuditData
  ): Promise<ApiResponse> {
    try {
      if (!Array.isArray(gradesData) || gradesData.length === 0) {
        return {
          success: false,
          message: "Aucune donnée de note fournie",
          code: "NO_GRADES_DATA",
        };
      }

      if (!academicYearId) {
        return {
          success: false,
          message: "Année académique requise",
          code: "ACADEMIC_YEAR_REQUIRED",
        };
      }

      const isAdmin = auditData?.userRole === UserRole.Admin;
      const isProfessor = auditData?.userRole === UserRole.Professeur;

      // Valider chaque note
      const validatedGrades: any[] = [];
      const errors: any[] = [];

      for (const [index, gradeData] of gradesData.entries()) {
        try {
          // Validation des données requises
          if (
            !gradeData.studentId ||
            !gradeData.subjectId ||
            gradeData.grade === undefined
          ) {
            errors.push({
              index,
              error: "Données requises manquantes",
              data: gradeData,
            });
            continue;
          }

          // Vérifier l'existence de l'étudiant et de la matière
          const [student, subject] = await Promise.all([
            prisma.student.findUnique({ where: { id: gradeData.studentId } }),
            prisma.subject.findUnique({ where: { id: gradeData.subjectId } }),
          ]);

          if (!student) {
            errors.push({
              index,
              error: "Étudiant non trouvé",
              data: gradeData,
            });
            continue;
          }

          if (!subject) {
            errors.push({
              index,
              error: "Matière non trouvée",
              data: gradeData,
            });
            continue;
          }

          // Vérifier la plage de la note
          const gradeNum = parseFloat(gradeData.grade.toString());
          if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
            errors.push({
              index,
              error: "Note invalide (doit être entre 0 et 100)",
              data: gradeData,
            });
            continue;
          }

          // Déterminer le statut
          let status = gradeData.status || GradeStatus.Draft;
          let additionalData: any = {};

          if (isAdmin && !gradeData.status) {
            // L'admin importe directement en Approved
            status = GradeStatus.Approved;
            additionalData = {
              approvedAt: new Date(),
              approvedBy: auditData?.userId,
            };
          } else if (isProfessor && !gradeData.status) {
            // Le professeur importe en Draft
            status = GradeStatus.Draft;
          }

          // Vérifier si une note existe déjà
          const existingGrade = await prisma.grade.findFirst({
            where: {
              studentId: gradeData.studentId,
              subjectId: gradeData.subjectId,
              academicYearId: academicYearId,
              controlType:
                (gradeData.controlType as ControlType) ||
                ControlType.CONTROLE_1,
              assignmentId: assignmentId || gradeData.assignmentId,
            },
          });

          if (existingGrade) {
            errors.push({
              index,
              error: "Note déjà existante pour cette combinaison",
              data: gradeData,
              existingGradeId: existingGrade.id,
            });
            continue;
          }

          validatedGrades.push({
            studentId: gradeData.studentId,
            subjectId: gradeData.subjectId,
            assignmentId: assignmentId || gradeData.assignmentId,
            grade: gradeNum,
            status,
            controlType:
              (gradeData.controlType as ControlType) || ControlType.CONTROLE_1,
            academicYearId,
            classLevel: gradeData.classLevel || "Sixieme",
            notes: gradeData.notes,
            isActive: true,
            createdBy: auditData?.userId,
            ...additionalData,
          });
        } catch (error: any) {
          errors.push({
            index,
            error: error.message,
            data: gradeData,
          });
        }
      }

      if (validatedGrades.length === 0) {
        return {
          success: false,
          message: "Aucune note valide à importer",
          code: "NO_VALID_GRADES",
          data: { errors },
        };
      }

      // Importer les notes en utilisant createMany
      const result = await prisma.grade.createMany({
        data: validatedGrades,
        skipDuplicates: true,
      });

      // // Journaliser l'action d'import
      // if (auditData) {
      //   await this.logBulkGradeAction(
      //     [], // Note: les IDs ne sont pas retournés par createMany
      //     "BULK_IMPORT",
      //     auditData,
      //     {
      //       importedCount: result.count,
      //       isAdmin,
      //       academicYearId,
      //       assignmentId,
      //     }
      //   );
      // }

      return {
        success: true,
        message: isAdmin
          ? `${result.count} notes importées et approuvées avec succès`
          : `${result.count} notes importées avec succès`,
        data: {
          importedCount: result.count,
          errors,
          totalAttempted: gradesData.length,
        },
      };
    } catch (error: any) {
      console.error("GradeService - bulkImportGrades error:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des notes
   */
  async getGradeStatistics(
    filters: {
      academicYearId?: string;
      classLevel?: ClassLevel;
      controlType?: ControlType;
      subjectId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Construction des filtres
      const where: any = { isActive: true };

      // Appliquer les filtres selon le rôle
      if (auditData.userRole === UserRole.Student) {
        where.status = GradeStatus.Published;
      } else if (auditData.userRole === UserRole.Professeur) {
        where.OR = [
          { status: { not: GradeStatus.Draft } },
          { createdBy: auditData.userId },
        ];
      }

      if (filters.academicYearId) where.academicYearId = filters.academicYearId;
      if (filters.classLevel) where.classLevel = filters.classLevel;
      if (filters.controlType) where.controlType = filters.controlType;
      if (filters.subjectId) where.subjectId = filters.subjectId;

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      // Récupérer toutes les notes avec les données nécessaires
      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              schoolClass: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
          subject: {
            select: {
              name: true,
              passingGrade: true,
              coefficient: true,
            },
          },
          academicYear: {
            select: {
              year: true,
            },
          },
        },
      });

      if (grades.length === 0) {
        return {
          success: true,
          message: "Aucune note trouvée pour les filtres spécifiés",
          data: {
            totalGrades: 0,
            statistics: {},
          },
        };
      }

      const statistics = this.calculateGradeStatistics(grades, filters);

      return {
        success: true,
        message: "Statistiques récupérées avec succès",
        data: { statistics },
      };
    } catch (error: any) {
      console.error("GradeService - getGradeStatistics error:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques détaillées pour l'admin
   */
  async getAdminGradeStatistics(
    filters: {
      academicYearId?: string;
      classLevel?: ClassLevel;
      controlType?: ControlType;
      professorId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      // Vérifier que c'est un admin
      if (auditData.userRole !== UserRole.Admin) {
        return {
          success: false,
          message: "Accès non autorisé",
          code: "UNAUTHORIZED",
        };
      }

      const where: any = { isActive: true };

      // Appliquer les filtres
      if (filters.academicYearId) where.academicYearId = filters.academicYearId;
      if (filters.classLevel) where.classLevel = filters.classLevel;
      if (filters.controlType) where.controlType = filters.controlType;
      if (filters.professorId) where.createdBy = filters.professorId;

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              schoolClass: true,
            },
          },
          subject: true,
          classAssignment: {
            include: {
              professeur: true,
            },
          },
          createdByUser: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      // Statistiques par statut
      const statusStats = {
        total: grades.length,
        draft: grades.filter((g) => g.status === GradeStatus.Draft).length,
        submitted: grades.filter((g) => g.status === GradeStatus.Submitted)
          .length,
        approved: grades.filter((g) => g.status === GradeStatus.Approved)
          .length,
        published: grades.filter((g) => g.status === GradeStatus.Published)
          .length,
        rejected: grades.filter((g) => g.status === GradeStatus.Rejected)
          .length,
      };

      // Statistiques par créateur
      const creatorStats: Record<string, any> = {};
      grades.forEach((grade) => {
        const creatorId = grade.createdBy || "unknown";
        if (!creatorStats[creatorId]) {
          creatorStats[creatorId] = {
            user: grade.createdByUser,
            total: 0,
            byStatus: {},
          };
        }
        creatorStats[creatorId].total++;
        creatorStats[creatorId].byStatus[grade.status] =
          (creatorStats[creatorId].byStatus[grade.status] || 0) + 1;
      });

      // Statistiques générales
      const totalPoints = grades.reduce((sum, grade) => sum + grade.grade, 0);
      const averageGrade = grades.length > 0 ? totalPoints / grades.length : 0;
      const passedGrades = grades.filter(
        (g) => g.grade >= g.subject.passingGrade
      ).length;
      const successRate =
        grades.length > 0 ? (passedGrades / grades.length) * 100 : 0;

      return {
        success: true,
        message: "Statistiques admin récupérées",
        data: {
          statusStats,
          creatorStats: Object.values(creatorStats),
          summary: {
            totalGrades: statusStats.total,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            successRate: parseFloat(successRate.toFixed(2)),
            pendingApproval: statusStats.draft + statusStats.submitted,
            approvedNotPublished: statusStats.approved,
            published: statusStats.published,
            rejectionRate:
              grades.length > 0
                ? parseFloat(
                    ((statusStats.rejected / grades.length) * 100).toFixed(2)
                  )
                : 0,
          },
        },
      };
    } catch (error: any) {
      console.error("GradeService - getAdminGradeStatistics error:", error);
      throw error;
    }
  }

  /**
   * Récupère les notes par classe
   */
  async getGradesByClass(
    classId: string,
    academicYearId: string,
    filters: {
      controlType?: ControlType;
      subjectId?: string;
      includeDraft?: boolean;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const students = await prisma.student.findMany({
        where: { classId, status: "Active" },
        select: { id: true },
      });

      const studentIds = students.map((student) => student.id);

      const where: any = {
        studentId: { in: studentIds },
        academicYearId,
        isActive: true,
      };

      if (filters.controlType) where.controlType = filters.controlType;
      if (filters.subjectId) where.subjectId = filters.subjectId;

      // Gestion des statuts selon le rôle
      if (auditData.userRole === UserRole.Student) {
        where.status = GradeStatus.Published;
      } else if (auditData.userRole === UserRole.Professeur) {
        if (!filters.includeDraft) {
          where.status = { not: GradeStatus.Draft };
        }
      }

      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              coefficient: true,
            },
          },
        },
        orderBy: [
          { student: { lastName: "asc" } },
          { subject: { name: "asc" } },
        ],
      });

      // Organiser les notes par étudiant
      const gradesByStudent: Record<string, any> = {};
      grades.forEach((grade) => {
        const studentId = grade.studentId;
        if (!gradesByStudent[studentId]) {
          gradesByStudent[studentId] = {
            student: grade.student,
            grades: [],
          };
        }
        gradesByStudent[studentId].grades.push(grade);
      });

      // Calculer les moyennes par étudiant
      Object.values(gradesByStudent).forEach((studentData: any) => {
        const total = studentData.grades.reduce((sum: number, g: any) => {
          return sum + g.grade * g.subject.coefficient;
        }, 0);
        const totalCoefficient = studentData.grades.reduce(
          (sum: number, g: any) => {
            return sum + g.subject.coefficient;
          },
          0
        );

        studentData.average =
          totalCoefficient > 0 ? total / totalCoefficient : 0;
      });

      return {
        success: true,
        message: "Notes par classe récupérées avec succès",
        data: {
          gradesByStudent: Object.values(gradesByStudent),
          totalStudents: students.length,
          totalGrades: grades.length,
        },
      };
    } catch (error: any) {
      console.error("GradeService - getGradesByClass error:", error);
      throw error;
    }
  }

  /**
   * Récupère les notes par matière
   */
  async getGradesBySubject(
    subjectId: string,
    academicYearId: string,
    filters: {
      classLevel?: ClassLevel;
      controlType?: ControlType;
      includeDraft?: boolean;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const where: any = {
        subjectId,
        academicYearId,
        isActive: true,
      };

      if (filters.classLevel) where.classLevel = filters.classLevel;
      if (filters.controlType) where.controlType = filters.controlType;

      // Gestion des statuts selon le rôle
      if (auditData.userRole === UserRole.Student) {
        where.status = GradeStatus.Published;
      } else if (auditData.userRole === UserRole.Professeur) {
        if (!filters.includeDraft) {
          where.status = { not: GradeStatus.Draft };
        }
      }

      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              schoolClass: {
                select: {
                  name: true,
                },
              },
            },
          },
          classAssignment: {
            include: {
              professeur: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: [{ grade: "desc" }, { student: { lastName: "asc" } }],
      });

      if (grades.length === 0) {
        return {
          success: true,
          message: "Aucune note trouvée pour cette matière",
          data: { grades: [] },
        };
      }

      // Calculer les statistiques de la matière
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          name: true,
          passingGrade: true,
          coefficient: true,
        },
      });

      const averageGrade =
        grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
      const passedCount = grades.filter(
        (g) => g.grade >= subject!.passingGrade
      ).length;
      const successRate = (passedCount / grades.length) * 100;

      return {
        success: true,
        message: "Notes par matière récupérées avec succès",
        data: {
          subject,
          grades,
          statistics: {
            total: grades.length,
            average: parseFloat(averageGrade.toFixed(2)),
            passedCount,
            failedCount: grades.length - passedCount,
            successRate: parseFloat(successRate.toFixed(2)),
            highestGrade: Math.max(...grades.map((g) => g.grade)),
            lowestGrade: Math.min(...grades.map((g) => g.grade)),
          },
        },
      };
    } catch (error: any) {
      console.error("GradeService - getGradesBySubject error:", error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur peut créer des notes
   */
  private canCreateGrade(auditData: AuditData): boolean {
    console.log("🔍 DEBUG canCreateGrade - Role:", auditData.userRole);
    console.log("🔍 DEBUG canCreateGrade - Rôles autorisés:", [
      UserRole.Professeur,
      UserRole.Admin,
    ]);

    const canCreate =
      auditData.userRole === UserRole.Professeur ||
      auditData.userRole === UserRole.Admin;

    console.log("🔍 DEBUG canCreateGrade - Résultat:", canCreate);
    return canCreate;
  }

  /**
   * Vérifie si l'utilisateur peut voir une note
   */
  private canViewGrade(grade: any, auditData: AuditData): boolean {
    if (auditData.userRole === UserRole.Admin) {
      return true;
    }

    if (auditData.userRole === UserRole.Admin) {
      return true;
    }

    if (auditData.userRole === UserRole.Professeur) {
      // Un professeur peut voir ses propres brouillons ou les notes non-brouillons
      if (grade.status === GradeStatus.Draft) {
        return grade.createdBy === auditData.userId;
      }
      return true;
    }

    if (auditData.userRole === UserRole.Student) {
      // Un étudiant ne peut voir que les notes publiées qui lui appartiennent
      return (
        grade.status === GradeStatus.Published &&
        grade.studentId === auditData.userId
      );
    }

    return false;
  }

  /**
   * Vérifie si l'utilisateur peut modifier une note
   */
  private canUpdateGrade(grade: any, auditData: AuditData): boolean {
    if (auditData.userRole === UserRole.Admin) {
      return true;
    }

    if (auditData.userRole === UserRole.Professeur) {
      // Un professeur peut modifier ses propres brouillons ou notes soumises
      if (grade.createdBy !== auditData.userId) {
        return false;
      }
      return [
        GradeStatus.Draft,
        GradeStatus.Submitted,
        GradeStatus.Rejected,
      ].includes(grade.status);
    }

    return false;
  }

  /**
   * Vérifie si l'utilisateur peut supprimer une note
   */
  private canDeleteGrade(grade: any, auditData: AuditData): boolean {
    if (auditData.userRole === UserRole.Admin) {
      return true;
    }

    if (auditData.userRole === UserRole.Professeur) {
      // Un professeur peut supprimer ses propres brouillons seulement
      return (
        grade.createdBy === auditData.userId &&
        grade.status === GradeStatus.Draft
      );
    }

    return false;
  }

  /**
   * Vérifie si une transition de statut est autorisée
   */
  private isStatusTransitionAllowed(
    currentStatus: GradeStatus,
    newStatus: GradeStatus,
    userRole: string
  ): boolean {
    // Les super admins peuvent tout faire
    if (userRole === UserRole.Admin) {
      return true;
    }

    // Les professeurs ont des restrictions
    if (userRole === UserRole.Professeur) {
      const allowedTransitions: Record<GradeStatus, GradeStatus[]> = {
        [GradeStatus.Draft]: [GradeStatus.Submitted],
        [GradeStatus.Submitted]: [GradeStatus.Draft],
        [GradeStatus.Rejected]: [GradeStatus.Draft, GradeStatus.Submitted],
        [GradeStatus.Approved]: [],
        [GradeStatus.Published]: [],
        Archived: [],
      };

      return allowedTransitions[currentStatus]?.includes(newStatus) || false;
    }

    return false;
  }

  /**
   * Calcule les statistiques pour un étudiant
   */
  private calculateStudentGradeStatistics(grades: any[]) {
    const statistics = {
      totalGrades: grades.length,
      averageGrade:
        grades.length > 0
          ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length
          : 0,
      subjectsSummary: {} as Record<string, any>,
      controlTypeSummary: {} as Record<string, any>,
    };

    // Organiser par matière
    grades.forEach((grade) => {
      const subjectName = grade.subject.name;
      const controlType = grade.controlType;

      // Statistiques par matière
      if (!statistics.subjectsSummary[subjectName]) {
        statistics.subjectsSummary[subjectName] = {
          subject: grade.subject,
          grades: [],
          average: 0,
          passed: 0,
          failed: 0,
          total: 0,
        };
      }

      statistics.subjectsSummary[subjectName].grades.push(grade);
      statistics.subjectsSummary[subjectName].total++;

      if (grade.grade >= grade.subject.passingGrade) {
        statistics.subjectsSummary[subjectName].passed++;
      } else {
        statistics.subjectsSummary[subjectName].failed++;
      }

      // Statistiques par type de contrôle
      if (!statistics.controlTypeSummary[controlType]) {
        statistics.controlTypeSummary[controlType] = {
          grades: [],
          average: 0,
          total: 0,
        };
      }

      statistics.controlTypeSummary[controlType].grades.push(grade);
      statistics.controlTypeSummary[controlType].total++;
    });

    // Calculer les moyennes
    Object.keys(statistics.subjectsSummary).forEach((subjectName) => {
      const subjectData = statistics.subjectsSummary[subjectName];
      subjectData.average =
        subjectData.grades.length > 0
          ? subjectData.grades.reduce(
              (sum: number, g: any) => sum + g.grade,
              0
            ) / subjectData.grades.length
          : 0;
    });

    Object.keys(statistics.controlTypeSummary).forEach((controlType) => {
      const controlData = statistics.controlTypeSummary[controlType];
      controlData.average =
        controlData.grades.length > 0
          ? controlData.grades.reduce(
              (sum: number, g: any) => sum + g.grade,
              0
            ) / controlData.grades.length
          : 0;
    });

    return statistics;
  }

  /**
   * Calcule les statistiques générales des notes
   */
  private calculateGradeStatistics(grades: any[], filters: any) {
    const totalGrades = grades.length;
    const totalPoints = grades.reduce((sum, grade) => sum + grade.grade, 0);
    const averageGrade = totalPoints / totalGrades;

    // Statistiques par statut
    const statusStats = {
      draft: grades.filter((g) => g.status === GradeStatus.Draft).length,
      submitted: grades.filter((g) => g.status === GradeStatus.Submitted)
        .length,
      approved: grades.filter((g) => g.status === GradeStatus.Approved).length,
      published: grades.filter((g) => g.status === GradeStatus.Published)
        .length,
      rejected: grades.filter((g) => g.status === GradeStatus.Rejected).length,
    };

    // Statistiques par type de contrôle
    const controlTypeStats = {
      CONTROLE_1: grades.filter((g) => g.controlType === "CONTROLE_1").length,
      CONTROLE_2: grades.filter((g) => g.controlType === "CONTROLE_2").length,
      CONTROLE_3: grades.filter((g) => g.controlType === "CONTROLE_3").length,
      CONTROLE_4: grades.filter((g) => g.controlType === "CONTROLE_4").length,
    };

    // Statistiques par niveau de classe
    const classLevelStats: Record<string, number> = {};
    grades.forEach((grade) => {
      const level = grade.classLevel;
      classLevelStats[level] = (classLevelStats[level] || 0) + 1;
    });

    // Taux de réussite global
    const passedGrades = grades.filter(
      (g) => g.grade >= g.subject.passingGrade
    ).length;
    const successRate = (passedGrades / totalGrades) * 100;

    // Distribution des notes
    const gradeDistribution = {
      "0-39": grades.filter((g) => g.grade >= 0 && g.grade < 40).length,
      "40-59": grades.filter((g) => g.grade >= 40 && g.grade < 60).length,
      "60-69": grades.filter((g) => g.grade >= 60 && g.grade < 70).length,
      "70-79": grades.filter((g) => g.grade >= 70 && g.grade < 80).length,
      "80-89": grades.filter((g) => g.grade >= 80 && g.grade < 90).length,
      "90-100": grades.filter((g) => g.grade >= 90 && g.grade <= 100).length,
    };

    const statistics = {
      totalGrades,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      passedGrades,
      failedGrades: totalGrades - passedGrades,
      statusStats,
      controlTypeStats,
      classLevelStats,
      gradeDistribution,
      byMonth: {} as Record<string, number>,
    };

    // Calculer par mois
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const monthDiff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth();

      if (monthDiff > 0) {
        grades.forEach((grade) => {
          const month = grade.createdAt.toISOString().slice(0, 7);
          statistics.byMonth[month] = (statistics.byMonth[month] || 0) + 1;
        });
      }
    }

    return statistics;
  }

  /**
   * Notifie les admins pour validation
   */
  private async notifyAdminsForApproval(
    count: number,
    auditData: AuditData
  ): Promise<void> {
    try {
      // Implémentation de la notification
      // Pourrait être un email, une notification push, etc.
      console.log(
        `Notification: ${count} notes soumises pour validation par ${auditData.userId}`
      );

      // Exemple d'implémentation avec emails aux admins
      const admins = await prisma.user.findMany({
        where: {
          role: { in: [UserRole.Admin, UserRole.Admin] },
          // emailNotifications: true
        },
        select: { email: true, firstName: true },
      });

      // Ici, vous pourriez envoyer des emails
      // await emailService.sendBulkEmail(admins, 'grades_pending_approval', { count });
    } catch (error) {
      console.error("Erreur de notification:", error);
    }
  }

  /**
   * Notifie les étudiants des notes publiées
   */
  private async notifyStudentsOfPublishedGrades(
    gradeIds: string[]
  ): Promise<void> {
    try {
      // Récupérer les étudiants concernés
      const grades = await prisma.grade.findMany({
        where: { id: { in: gradeIds } },
        include: {
          student: {
            select: {
              id: true,
              email: true,
              firstName: true,
              // notificationsEnabled: true
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
        },
      });

      // Grouper par étudiant
      const studentsMap = new Map();
      grades.forEach((grade) => {
        if (!studentsMap.has(grade.studentId)) {
          studentsMap.set(grade.studentId, {
            student: grade.student,
            grades: [],
          });
        }
        studentsMap.get(grade.studentId).grades.push(grade);
      });

      // Notifier chaque étudiant
      for (const [_, data] of studentsMap) {
        if (data.student.notificationsEnabled) {
          console.log(
            `Notification à ${data.student.email}: ${data.grades.length} nouvelles notes publiées`
          );

          // Ici, vous pourriez envoyer un email ou une notification
          // await emailService.sendEmail(data.student.email, 'grades_published', { grades: data.grades });
        }
      }
    } catch (error) {
      console.error("Erreur de notification aux étudiants:", error);
    }
  }

  /**
   * Notifie un étudiant d'une note publiée
   */
  private async notifyStudentOfPublishedGrade(gradeId: string): Promise<void> {
    try {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
        include: {
          student: {
            select: {
              email: true,
              firstName: true,
              // notificationsEnabled: true
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Erreur de notification à l'étudiant:", error);
    }
  }

  /**
   * Notifie les professeurs de l'approbation de leurs notes
   */
  private async notifyProfessorsOfApproval(gradeIds: string[]): Promise<void> {
    try {
      // Implémentation similaire à notifyStudentsOfPublishedGrades
      // Mais pour les professeurs
    } catch (error) {
      console.error("Erreur de notification aux professeurs:", error);
    }
  }

  /**
   * Notifie un professeur du rejet de sa note
   */
  private async notifyProfessorOfRejectedGrade(
    gradeId: string,
    reason: string
  ): Promise<void> {
    try {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
        include: {
          createdByUser: {
            select: {
              email: true,
              firstName: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (grade && grade.createdByUser) {
        console.log(
          `Notification à ${grade.createdByUser.email}: Note rejetée pour ${grade.subject.name}`
        );
        // await emailService.sendEmail(grade.createdByUser.email, 'grade_rejected', { grade, reason });
      }
    } catch (error) {
      console.error("Erreur de notification au professeur:", error);
    }
  }

  /**
   * Notifie les professeurs et étudiants
   */
  private async notifyStudentsAndProfessors(gradeIds: string[]): Promise<void> {
    try {
      await this.notifyStudentsOfPublishedGrades(gradeIds);
      await this.notifyProfessorsOfApproval(gradeIds);
    } catch (error) {
      console.error("Erreur de notification combinée:", error);
    }
  }

  /**
   * Notifie les professeurs du rejet
   */
  private async notifyProfessorOfRejection(
    gradeIds: string[],
    reason: string
  ): Promise<void> {
    try {
      // Récupérer les notes et les grouper par professeur
      const grades = await prisma.grade.findMany({
        where: { id: { in: gradeIds } },
        include: {
          createdByUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
            },
          },
          subject: true,
          student: true,
        },
      });

      const professorsMap = new Map();
      grades.forEach((grade) => {
        if (grade.createdByUser) {
          if (!professorsMap.has(grade.createdByUser.id)) {
            professorsMap.set(grade.createdByUser.id, {
              professor: grade.createdByUser,
              grades: [],
            });
          }
          professorsMap.get(grade.createdByUser.id).grades.push(grade);
        }
      });

      // Notifier chaque professeur
      for (const [_, data] of professorsMap) {
        console.log(
          `Notification à ${data.professor.email}: ${data.grades.length} notes rejetées`
        );
        // await emailService.sendEmail(data.professor.email, 'grades_rejected', { grades: data.grades, reason });
      }
    } catch (error) {
      console.error("Erreur de notification de rejet:", error);
    }
  }

  /**
   * Génère le palmarès (classement) d'un niveau pour un contrôle donné.
   * Pour chaque élève : note par matière, Total, Moyenne (Total / somme des
   * barèmes × 100), puis classement par moyenne décroissante.
   */
  async getPalmares(
    filters: {
      classLevel?: ClassLevel;
      controlType?: ControlType;
      academicYearId?: string;
      status?: string;
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const { classLevel, controlType, academicYearId, status } = filters;

      if (!classLevel || !controlType || !academicYearId) {
        return {
          success: false,
          message: "classLevel, controlType et academicYearId sont requis",
          code: "MISSING_PARAMS",
        };
      }

      const where: any = {
        isActive: true,
        classLevel,
        controlType,
        academicYearId,
      };
      if (status && status !== "all") {
        where.status = status;
      } else if (!status) {
        where.status = GradeStatus.Published;
      }

      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
              maxGrade: true,
              coefficient: true,
            },
          },
        },
      });

      // Matières présentes, ordonnées par nom
      const subjectMap = new Map<string, any>();
      grades.forEach((g) => {
        if (g.subject) subjectMap.set(g.subject.id, g.subject);
      });
      const subjects = Array.from(subjectMap.values()).sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "fr")
      );
      const maxTotal = subjects.reduce(
        (sum, s) => sum + (s.maxGrade || 0),
        0
      );

      // Agrégation par élève
      const studentMap = new Map<string, any>();
      grades.forEach((g) => {
        if (!g.student) return;
        const sid = g.student.id;
        if (!studentMap.has(sid)) {
          studentMap.set(sid, {
            studentId: sid,
            firstName: g.student.firstName,
            lastName: g.student.lastName,
            studentCode: g.student.studentCode,
            grades: {} as Record<string, number>,
            total: 0,
          });
        }
        const entry = studentMap.get(sid);
        entry.grades[g.subjectId] = g.grade;
        entry.total += g.grade || 0;
      });

      const students = Array.from(studentMap.values()).map((s) => ({
        ...s,
        moyenne: maxTotal > 0 ? (s.total / maxTotal) * 100 : 0,
      }));

      // Tri par moyenne décroissante + rang
      students.sort((a, b) => b.moyenne - a.moyenne);
      students.forEach((s, i) => {
        s.rank = i + 1;
      });

      return {
        success: true,
        message: "Palmarès généré avec succès",
        data: {
          classLevel,
          controlType,
          academicYearId,
          maxTotal,
          subjects,
          students,
          generatedAt: new Date(),
        },
      };
    } catch (error: any) {
      console.error("GradeService - getPalmares error:", error);
      throw error;
    }
  }

  /**
   * Génère le palmarès cumulatif (notes totales) d'un niveau pour une année
   * académique : pour chaque élève et chaque matière, on calcule la moyenne
   * des contrôles disponibles, puis Total = somme des moyennes par matière
   * et Moyenne générale = Total / somme des barèmes × 100.
   */
  async getPalmaresCumulatif(
    filters: {
      classLevel?: ClassLevel;
      academicYearId?: string;
      status?: string;
      controlTypes?: ControlType[];
    },
    auditData: AuditData
  ): Promise<ApiResponse> {
    try {
      const { classLevel, academicYearId, status, controlTypes } = filters;

      if (!classLevel || !academicYearId) {
        return {
          success: false,
          message: "classLevel et academicYearId sont requis",
          code: "MISSING_PARAMS",
        };
      }

      const where: any = {
        isActive: true,
        classLevel,
        academicYearId,
      };
      if (controlTypes && controlTypes.length > 0) {
        where.controlType = { in: controlTypes };
      }
      if (status && status !== "all") {
        where.status = status;
      } else if (!status) {
        where.status = GradeStatus.Published;
      }

      const grades = await prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
              maxGrade: true,
              coefficient: true,
            },
          },
        },
      });

      // Matières présentes, ordonnées par nom
      const subjectMap = new Map<string, any>();
      grades.forEach((g) => {
        if (g.subject) subjectMap.set(g.subject.id, g.subject);
      });
      const subjects = Array.from(subjectMap.values()).sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "fr")
      );
      const maxTotal = subjects.reduce(
        (sum, s) => sum + (s.maxGrade || 0),
        0
      );

      // Regrouper les notes par élève puis par matière (liste des notes par contrôle)
      const studentMap = new Map<string, any>();
      grades.forEach((g) => {
        if (!g.student) return;
        const sid = g.student.id;
        if (!studentMap.has(sid)) {
          studentMap.set(sid, {
            studentId: sid,
            firstName: g.student.firstName,
            lastName: g.student.lastName,
            studentCode: g.student.studentCode,
            subjectGrades: new Map<string, number[]>(),
          });
        }
        const entry = studentMap.get(sid);
        if (!entry.subjectGrades.has(g.subjectId)) {
          entry.subjectGrades.set(g.subjectId, []);
        }
        entry.subjectGrades.get(g.subjectId).push(g.grade || 0);
      });

      // Calcul de la moyenne par matière puis du total et de la moyenne générale
      const students = Array.from(studentMap.values()).map((s) => {
        const grades: Record<string, number> = {};
        let total = 0;
        subjects.forEach((subj) => {
          const values: number[] = s.subjectGrades.get(subj.id) || [];
          const avg =
            values.length > 0
              ? values.reduce((sum, v) => sum + v, 0) / values.length
              : 0;
          grades[subj.id] = avg;
          total += avg;
        });
        return {
          studentId: s.studentId,
          firstName: s.firstName,
          lastName: s.lastName,
          studentCode: s.studentCode,
          grades,
          total,
          moyenne: maxTotal > 0 ? (total / maxTotal) * 100 : 0,
        };
      });

      // Tri par moyenne décroissante + rang
      students.sort((a, b) => b.moyenne - a.moyenne);
      students.forEach((s, i) => {
        (s as any).rank = i + 1;
      });

      return {
        success: true,
        message: "Palmarès cumulatif généré avec succès",
        data: {
          classLevel,
          academicYearId,
          controlTypes: controlTypes && controlTypes.length > 0
            ? controlTypes
            : "all",
          maxTotal,
          subjects,
          students,
          generatedAt: new Date(),
        },
      };
    } catch (error: any) {
      console.error("GradeService - getPalmaresCumulatif error:", error);
      throw error;
    }
  }
}
