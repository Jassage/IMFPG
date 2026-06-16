/**
 * @file attendanceService.ts
 * @description Service pour la gestion des présences
 */

import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { PrismaClient, AttendanceStatus } from "../../generated/prisma";
import { AuditData } from "../types/auth";

const prisma = new PrismaClient();

// Interfaces
export interface AttendanceFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  academicYearId?: string;
  status?: string;
  validationStatus?: string;
  startDate?: Date;
  endDate?: Date;
  session?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AttendanceStatsFilters {
  studentId?: string;
  classId?: string;
  academicYearId?: string;
  month?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateAttendanceData {
  studentId: string;
  classId: string;
  academicYearId: string;
  date: Date;
  session: string;
  status: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  notes?: string;
  createdById: string;
}

export interface UpdateAttendanceData {
  status?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  notes?: string;
}

export interface CreateAttendanceSessionData {
  classId: string;
  subjectId: string;
  professeurId: string;
  academicYearId: string;
  date: Date;
  startTime: string;
  endTime: string;
  topic?: string;
  description?: string;
  createdById: string;
}

export interface UpdateAttendanceSessionData {
  topic?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  metadata?: any;
}

/**
 * Service pour la gestion des présences
 */
export class AttendanceService {
  /**
   * Récupère la liste des présences
   */
  async getAttendances(
    filters: AttendanceFilters,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        studentId,
        classId,
        academicYearId,
        status,
        validationStatus,
        startDate,
        endDate,
        session,
        sortBy = "date",
        sortOrder = "desc",
      } = filters;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      // Construction des filtres
      const where: any = {};

      if (studentId) where.studentId = studentId;
      if (classId) where.classId = classId;
      if (academicYearId) where.academicYearId = academicYearId;
      if (status) where.status = status;
      if (validationStatus) where.validationStatus = validationStatus;
      if (session) where.session = session;

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
      }

      // Récupération avec pagination
      const [attendances, total] = await Promise.all([
        prisma.attendance.findMany({
          where,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                photo: true,
                schoolClass: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                  },
                },
              },
            },
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            validatedByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            justifiedByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: limitNum,
        }),
        prisma.attendance.count({ where }),
      ]);

      // Récupérer l'année académique courante
      const currentAcademicYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      return {
        success: true,
        message: "Présences récupérées avec succès",
        data: {
          attendances,
          currentAcademicYear,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getAttendances error:", error);
      throw error;
    }
  }

  /**
   * Récupère une présence par ID
   */
  async getAttendanceById(
    id: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              photo: true,
              schoolClass: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                },
              },
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
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          validatedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          justifiedByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          attendanceRecords: {
            include: {
              attendanceSession: {
                include: {
                  subject: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    },
                  },
                  professeur: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!attendance) {
        return {
          success: false,
          message: "Présence non trouvée",
          code: "ATTENDANCE_NOT_FOUND",
        };
      }

      return {
        success: true,
        message: "Présence récupérée avec succès",
        data: { attendance },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getAttendanceById error:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle présence
   */
  async createAttendance(
    data: CreateAttendanceData,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        studentId,
        classId,
        academicYearId,
        date,
        session,
        status,
        checkInTime,
        checkOutTime,
        expectedCheckIn,
        expectedCheckOut,
        notes,
        createdById,
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

      // Vérifier l'année académique
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

      // Vérifier si une présence existe déjà pour cette date et session
      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          studentId_classId_academicYearId_date_session: {
            studentId,
            classId,
            academicYearId,
            date,
            session: session as any,
          },
        },
      });

      if (existingAttendance) {
        return {
          success: false,
          message:
            "Une présence existe déjà pour cet étudiant à cette date et session",
          code: "ATTENDANCE_ALREADY_EXISTS",
        };
      }

      // Créer la présence
      const attendance = await prisma.attendance.create({
        data: {
          studentId,
          classId,
          academicYearId,
          date,
          session: session as any,
          status: status as any,
          checkInTime,
          checkOutTime,
          expectedCheckIn,
          expectedCheckOut,
          notes,
          createdById,
          validationStatus: "PENDING",
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
          schoolClass: {
            select: {
              name: true,
              level: true,
            },
          },
        },
      });

      // Mettre à jour les statistiques mensuelles
      await this.updateAttendanceStats(studentId, academicYearId, date);

      return {
        success: true,
        message: "Présence créée avec succès",
        data: { attendance },
        metadata: {
          studentName: `${attendance.student.firstName} ${attendance.student.lastName}`,
          className: attendance.schoolClass.name,
          date: date.toISOString().split("T")[0],
          status,
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - createAttendance error:", error);
      throw error;
    }
  }

  /**
   * Met à jour une présence
   */
  async updateAttendance(
    id: string,
    data: UpdateAttendanceData,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        status,
        checkInTime,
        checkOutTime,
        expectedCheckIn,
        expectedCheckOut,
        notes,
      } = data;

      // Vérifier si la présence existe
      const existingAttendance = await prisma.attendance.findUnique({
        where: { id },
        include: {
          student: true,
        },
      });

      if (!existingAttendance) {
        return {
          success: false,
          message: "Présence non trouvée",
          code: "ATTENDANCE_NOT_FOUND",
        };
      }

      // Mettre à jour
      const attendance = await prisma.attendance.update({
        where: { id },
        data: {
          status: status as any,
          checkInTime,
          checkOutTime,
          expectedCheckIn,
          expectedCheckOut,
          notes,
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentCode: true,
            },
          },
        },
      });

      // Mettre à jour les statistiques si le statut a changé
      if (status && status !== existingAttendance.status) {
        await this.updateAttendanceStats(
          existingAttendance.studentId,
          existingAttendance.academicYearId,
          existingAttendance.date,
        );
      }

      return {
        success: true,
        message: "Présence mise à jour avec succès",
        data: { attendance },
        metadata: {
          oldStatus: existingAttendance.status,
          newStatus: status,
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - updateAttendance error:", error);
      throw error;
    }
  }

  /**
   * Valide une présence
   */
  async validateAttendance(
    id: string,
    validationStatus: string,
    userId: string,
    notes?: string,
    auditData?: AuditData,
  ): Promise<ApiResponse> {
    try {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
      });

      if (!attendance) {
        return {
          success: false,
          message: "Présence non trouvée",
          code: "ATTENDANCE_NOT_FOUND",
        };
      }

      const updatedAttendance = await prisma.attendance.update({
        where: { id },
        data: {
          validationStatus: validationStatus as any,
          validatedBy: userId,
          validatedAt: new Date(),
          notes: notes
            ? `${attendance.notes || ""} ${notes}`.trim()
            : attendance.notes,
        },
      });

      return {
        success: true,
        message: `Présence ${validationStatus === "VALIDATED" ? "validée" : "rejetée"} avec succès`,
        data: { attendance: updatedAttendance },
      };
    } catch (error: any) {
      console.error(" AttendanceService - validateAttendance error:", error);
      throw error;
    }
  }

  /**
   * Justifie une absence/retard
   */
  async justifyAttendance(
    id: string,
    justification: string,
    justificationType: string,
    justificationDoc?: string,
    userId?: string,
    auditData?: AuditData,
  ): Promise<ApiResponse> {
    try {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
      });

      if (!attendance) {
        return {
          success: false,
          message: "Présence non trouvée",
          code: "ATTENDANCE_NOT_FOUND",
        };
      }

      const updatedAttendance = await prisma.attendance.update({
        where: { id },
        data: {
          justification,
          justificationType: justificationType as any,
          justificationDoc,
          justifiedBy: userId,
          justifiedAt: new Date(),
          status: "EXCUSED",
        },
      });

      return {
        success: true,
        message: "Présence justifiée avec succès",
        data: { attendance: updatedAttendance },
      };
    } catch (error: any) {
      console.error(" AttendanceService - justifyAttendance error:", error);
      throw error;
    }
  }

  /**
   * Enregistre une présence par scan
   */
  async recordAttendanceByScan(
    studentCode: string,
    classId: string,
    session: string,
    date: Date,
    userId: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      // Trouver l'étudiant par son code
      const student = await prisma.student.findUnique({
        where: { studentCode },
        include: {
          schoolClass: true,
        },
      });

      if (!student) {
        return {
          success: false,
          message: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        };
      }

      // Vérifier que l'étudiant est dans la bonne classe
      if (student.classId !== classId) {
        return {
          success: false,
          message: "L'étudiant n'est pas inscrit dans cette classe",
          code: "STUDENT_NOT_IN_CLASS",
        };
      }

      // Trouver l'année académique courante
      const academicYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      if (!academicYear) {
        return {
          success: false,
          message: "Aucune année académique courante trouvée",
          code: "NO_CURRENT_ACADEMIC_YEAR",
        };
      }

      // Vérifier si c'est un jour férié
      const isHoliday = await prisma.attendanceHoliday.findFirst({
        where: {
          date: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
          isActive: true,
        },
      });

      // Déterminer le statut
      let status = "PRESENT";
      if (isHoliday) {
        status = "HOLIDAY";
      }

      // Récupérer les paramètres pour vérifier les horaires
      const settings = await prisma.attendanceSettings.findFirst();

      // Vérifier le retard si checkInTime est fourni
      const now = new Date();
      if (settings && session === "MORNING") {
        const [hours, minutes] = settings.defaultMorningStart
          .split(":")
          .map(Number);
        const expectedTime = new Date(date);
        expectedTime.setHours(hours, minutes, 0);

        const lateThreshold = settings.lateThreshold * 60 * 1000; // Convertir en ms
        if (now.getTime() > expectedTime.getTime() + lateThreshold) {
          status = "LATE";
        }
      }

      // Créer ou mettre à jour la présence
      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_classId_academicYearId_date_session: {
            studentId: student.id,
            classId,
            academicYearId: academicYear.id,
            date,
            session: session as any,
          },
        },
        update: {
          checkInTime: now,
          status: status as any,
        },
        create: {
          studentId: student.id,
          classId,
          academicYearId: academicYear.id,
          date,
          session: session as any,
          status: status as any,
          checkInTime: now,
          expectedCheckIn:
            session === "MORNING"
              ? settings?.defaultMorningStart
              : settings?.defaultAfternoonStart,
          expectedCheckOut:
            session === "MORNING"
              ? settings?.defaultMorningEnd
              : settings?.defaultAfternoonEnd,
          createdById: userId,
        },
      });

      return {
        success: true,
        message: "Présence enregistrée par scan",
        data: {
          attendance,
          student: {
            name: `${student.firstName} ${student.lastName}`,
            code: student.studentCode,
          },
        },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - recordAttendanceByScan error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Récupère les statistiques de présence
   */
  async getAttendanceStats(
    filters: AttendanceStatsFilters,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        studentId,
        classId,
        academicYearId,
        month,
        year = new Date().getFullYear(),
        startDate,
        endDate,
      } = filters;

      let stats;

      if (studentId && month && year) {
        // Statistiques mensuelles pour un étudiant
        stats = await prisma.attendanceStats.findUnique({
          where: {
            studentId_academicYearId_month_year: {
              studentId,
              academicYearId: academicYearId || "",
              month,
              year,
            },
          },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
          },
        });

        if (!stats) {
          // Calculer les stats si elles n'existent pas
          stats = await this.calculateAndSaveStats(
            studentId,
            academicYearId || "",
            month,
            year,
          );
        }
      } else if (classId && startDate && endDate) {
        // Statistiques pour une classe sur une période
        const attendances = await prisma.attendance.groupBy({
          by: ["status"],
          where: {
            classId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            status: true,
          },
        });

        const total = attendances.reduce(
          (sum, item) => sum + item._count.status,
          0,
        );

        stats = {
          classId,
          period: { startDate, endDate },
          total,
          distribution: attendances.map((item) => ({
            status: item.status,
            count: item._count.status,
            percentage: total > 0 ? (item._count.status / total) * 100 : 0,
          })),
        };
      }

      return {
        success: true,
        message: "Statistiques récupérées avec succès",
        data: { stats },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getAttendanceStats error:", error);
      throw error;
    }
  }

  /**
   * Récupère les présences d'une classe pour une date
   */
  async getClassAttendances(
    classId: string,
    date: Date,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Récupérer tous les étudiants de la classe
      const students = await prisma.student.findMany({
        where: {
          classId,
          status: "Active",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
          photo: true,
        },
        orderBy: {
          lastName: "asc",
        },
      });

      // Récupérer les présences du jour
      const attendances = await prisma.attendance.findMany({
        where: {
          classId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          student: true,
        },
      });

      // Mapper les présences aux étudiants
      const attendanceMap = new Map(attendances.map((a) => [a.studentId, a]));

      const result = students.map((student) => ({
        ...student,
        attendance: attendanceMap.get(student.id) || null,
      }));

      return {
        success: true,
        message: "Présences de la classe récupérées",
        data: {
          date,
          totalStudents: students.length,
          presentCount: attendances.filter((a) => a.status === "PRESENT")
            .length,
          absentCount: attendances.filter((a) => a.status === "ABSENT").length,
          lateCount: attendances.filter((a) => a.status === "LATE").length,
          attendances: result,
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getClassAttendances error:", error);
      throw error;
    }
  }

  // ==================== SESSIONS ====================

  /**
   * Récupère la liste des sessions
   */
  async getAttendanceSessions(
    filters: any,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        classId,
        subjectId,
        professeurId,
        academicYearId,
        startDate,
        endDate,
        isCompleted,
        isCancelled,
      } = filters;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (classId) where.classId = classId;
      if (subjectId) where.subjectId = subjectId;
      if (professeurId) where.professeurId = professeurId;
      if (academicYearId) where.academicYearId = academicYearId;
      if (isCompleted !== undefined) where.isCompleted = isCompleted;
      if (isCancelled !== undefined) where.isCancelled = isCancelled;

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
      }

      const [sessions, total] = await Promise.all([
        prisma.attendanceSession.findMany({
          where,
          include: {
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            professeur: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                attendanceRecords: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          skip,
          take: limitNum,
        }),
        prisma.attendanceSession.count({ where }),
      ]);

      return {
        success: true,
        message: "Sessions récupérées avec succès",
        data: {
          sessions,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getAttendanceSessions error:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle session
   */
  async createAttendanceSession(
    data: CreateAttendanceSessionData,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const {
        classId,
        subjectId,
        professeurId,
        academicYearId,
        date,
        startTime,
        endTime,
        topic,
        description,
        createdById,
      } = data;

      // Vérifier les conflits d'horaire
      const conflictingSession = await prisma.attendanceSession.findFirst({
        where: {
          classId,
          date,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflictingSession) {
        return {
          success: false,
          message: "Conflit d'horaire avec une autre session",
          code: "SCHEDULE_CONFLICT",
        };
      }

      const session = await prisma.attendanceSession.create({
        data: {
          classId,
          subjectId,
          professeurId,
          academicYearId,
          date,
          startTime,
          endTime,
          topic,
          description,
          createdById,
        },
        include: {
          schoolClass: {
            select: {
              name: true,
              level: true,
            },
          },
          subject: {
            select: {
              name: true,
              code: true,
            },
          },
          professeur: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "Session créée avec succès",
        data: { session },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - createAttendanceSession error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Met à jour une session
   */
  async updateAttendanceSession(
    id: string,
    data: UpdateAttendanceSessionData,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const session = await prisma.attendanceSession.findUnique({
        where: { id },
      });

      if (!session) {
        return {
          success: false,
          message: "Session non trouvée",
          code: "SESSION_NOT_FOUND",
        };
      }

      const updatedSession = await prisma.attendanceSession.update({
        where: { id },
        data,
      });

      return {
        success: true,
        message: "Session mise à jour avec succès",
        data: { session: updatedSession },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - updateAttendanceSession error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Marque une session comme terminée
   */
  async completeAttendanceSession(
    id: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const session = await prisma.attendanceSession.findUnique({
        where: { id },
      });

      if (!session) {
        return {
          success: false,
          message: "Session non trouvée",
          code: "SESSION_NOT_FOUND",
        };
      }

      if (session.isCompleted) {
        return {
          success: false,
          message: "La session est déjà terminée",
          code: "SESSION_ALREADY_COMPLETED",
        };
      }

      const updatedSession = await prisma.attendanceSession.update({
        where: { id },
        data: {
          isCompleted: true,
        },
      });

      return {
        success: true,
        message: "Session marquée comme terminée",
        data: { session: updatedSession },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - completeAttendanceSession error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Annule une session
   */
  async cancelAttendanceSession(
    id: string,
    cancellationReason: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const session = await prisma.attendanceSession.findUnique({
        where: { id },
      });

      if (!session) {
        return {
          success: false,
          message: "Session non trouvée",
          code: "SESSION_NOT_FOUND",
        };
      }

      const updatedSession = await prisma.attendanceSession.update({
        where: { id },
        data: {
          isCancelled: true,
          cancellationReason,
        },
      });

      return {
        success: true,
        message: "Session annulée avec succès",
        data: { session: updatedSession },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - cancelAttendanceSession error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Récupère les présences d'une session
   */
  async getSessionAttendances(
    sessionId: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const records = await prisma.attendanceRecord.findMany({
        where: {
          attendanceSessionId: sessionId,
        },
        include: {
          attendance: {
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  studentCode: true,
                  photo: true,
                },
              },
            },
          },
        },
      });

      const session = await prisma.attendanceSession.findUnique({
        where: { id: sessionId },
        include: {
          schoolClass: true,
          subject: true,
          professeur: true,
        },
      });

      return {
        success: true,
        message: "Présences de la session récupérées",
        data: {
          session,
          attendances: records.map((r) => r.attendance),
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getSessionAttendances error:", error);
      throw error;
    }
  }

  // ==================== APPEL PAR SÉANCE (PROFESSEUR) ====================

  /**
   * Ouvre (ou récupère) la séance d'un cours pour faire l'appel.
   * Réutilise la séance existante si elle existe déjà pour
   * (classe, matière, professeur, date, heure de début).
   */
  async getOrCreateSession(
    data: CreateAttendanceSessionData,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const sessionInclude = {
        schoolClass: { select: { id: true, name: true, level: true } },
        subject: { select: { id: true, name: true, code: true } },
        professeur: { select: { id: true, firstName: true, lastName: true } },
      };

      const existing = await prisma.attendanceSession.findFirst({
        where: {
          classId: data.classId,
          subjectId: data.subjectId,
          professeurId: data.professeurId,
          date: data.date,
          startTime: data.startTime,
        },
        include: sessionInclude,
      });

      if (existing) {
        return {
          success: true,
          message: "Séance existante récupérée",
          data: { session: existing, created: false },
        };
      }

      const session = await prisma.attendanceSession.create({
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
          professeurId: data.professeurId,
          academicYearId: data.academicYearId,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          topic: data.topic,
          description: data.description,
          createdById: data.createdById,
        },
        include: sessionInclude,
      });

      return {
        success: true,
        message: "Séance créée avec succès",
        data: { session, created: true },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getOrCreateSession error:", error);
      throw error;
    }
  }

  /**
   * Récupère le roster d'une séance : tous les élèves actifs de la classe,
   * avec le statut déjà saisi (ou PRESENT par défaut).
   */
  async getSessionRoster(
    sessionId: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const session = await prisma.attendanceSession.findUnique({
        where: { id: sessionId },
        include: {
          schoolClass: { select: { id: true, name: true, level: true } },
          subject: { select: { id: true, name: true, code: true } },
          professeur: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      if (!session) {
        return {
          success: false,
          message: "Séance non trouvée",
          code: "SESSION_NOT_FOUND",
        };
      }

      const students = await prisma.student.findMany({
        where: { classId: session.classId, status: "Active" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
          photo: true,
        },
        orderBy: { lastName: "asc" },
      });

      const records = await prisma.attendanceRecord.findMany({
        where: { attendanceSessionId: sessionId },
      });
      const recordMap = new Map(records.map((r) => [r.studentId, r]));

      const roster = students.map((student) => {
        const record = recordMap.get(student.id);
        return {
          ...student,
          recordId: record?.id || null,
          status: record?.status || "PRESENT",
          notes: record?.notes || null,
          saved: !!record,
        };
      });

      return {
        success: true,
        message: "Roster de la séance récupéré",
        data: {
          session,
          totalStudents: roster.length,
          roster,
        },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getSessionRoster error:", error);
      throw error;
    }
  }

  /**
   * Enregistre l'appel d'une séance : upsert d'un AttendanceRecord par élève.
   * Le statut est définitif (pas d'étape de validation séparée).
   */
  async saveSessionAttendance(
    sessionId: string,
    entries: Array<{ studentId: string; status: string; notes?: string }>,
    recordedById: string | undefined,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      const session = await prisma.attendanceSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        return {
          success: false,
          message: "Séance non trouvée",
          code: "SESSION_NOT_FOUND",
        };
      }

      if (!Array.isArray(entries) || entries.length === 0) {
        return {
          success: false,
          message: "Aucune présence à enregistrer",
          code: "EMPTY_ATTENDANCE",
        };
      }

      const now = new Date();

      await prisma.$transaction(
        entries.map((entry) =>
          prisma.attendanceRecord.upsert({
            where: {
              attendanceSessionId_studentId: {
                attendanceSessionId: sessionId,
                studentId: entry.studentId,
              },
            },
            update: {
              status: entry.status as AttendanceStatus,
              notes: entry.notes ?? null,
              recordedById: recordedById ?? null,
              checkInTime:
                entry.status === "PRESENT" || entry.status === "LATE"
                  ? now
                  : null,
            },
            create: {
              attendanceSessionId: sessionId,
              studentId: entry.studentId,
              status: entry.status as AttendanceStatus,
              notes: entry.notes ?? null,
              recordedById: recordedById ?? null,
              checkInTime:
                entry.status === "PRESENT" || entry.status === "LATE"
                  ? now
                  : null,
            },
          }),
        ),
      );

      // L'appel est fait : on marque la séance comme terminée.
      await prisma.attendanceSession.update({
        where: { id: sessionId },
        data: { isCompleted: true },
      });

      return {
        success: true,
        message: "Appel enregistré avec succès",
        data: { count: entries.length },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - saveSessionAttendance error:",
        error,
      );
      throw error;
    }
  }

  // ==================== STATISTIQUES GÉNÉRALES ====================

  /**
   * Récupère les statistiques générales de présence
   */
  async getOverallAttendanceStats(
    academicYearId?: string,
    auditData?: AuditData,
  ): Promise<ApiResponse> {
    try {
      let yearId = academicYearId;

      if (!yearId) {
        const currentYear = await prisma.academicYear.findFirst({
          where: { isCurrent: true },
        });
        yearId = currentYear?.id;
      }

      if (!yearId) {
        return {
          success: false,
          message: "Aucune année académique spécifiée",
          code: "NO_ACADEMIC_YEAR",
        };
      }

      // Statistiques globales
      const totalStudents = await prisma.student.count({
        where: { status: "Active" },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAttendances = await prisma.attendance.count({
        where: {
          academicYearId: yearId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      const todayPresent = await prisma.attendance.count({
        where: {
          academicYearId: yearId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          status: "PRESENT",
        },
      });

      // Statistiques par statut
      const statusStats = await prisma.attendance.groupBy({
        by: ["status"],
        where: {
          academicYearId: yearId,
        },
        _count: {
          status: true,
        },
      });

      // Statistiques par classe
      const classStats = await prisma.schoolClass.findMany({
        where: { status: "Active" },
        select: {
          id: true,
          name: true,
          level: true,
          _count: {
            select: {
              students: true,
              attendances: {
                where: {
                  academicYearId: yearId,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: "Statistiques générales récupérées",
        data: {
          totalStudents,
          todayStats: {
            total: todayAttendances,
            present: todayPresent,
            absent: todayAttendances - todayPresent,
            rate: totalStudents > 0 ? (todayPresent / totalStudents) * 100 : 0,
          },
          statusDistribution: statusStats.map((s) => ({
            status: s.status,
            count: s._count.status,
          })),
          classStats: classStats.map((c) => ({
            classId: c.id,
            className: c.name,
            level: c.level,
            totalStudents: c._count.students,
            totalAttendances: c._count.attendances,
          })),
        },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - getOverallAttendanceStats error:",
        error,
      );
      throw error;
    }
  }

  /**
   * Récupère les paramètres de présence
   */
  async getAttendanceSettings(auditData: AuditData): Promise<ApiResponse> {
    try {
      let settings = await prisma.attendanceSettings.findFirst();

      if (!settings) {
        // Créer les paramètres par défaut
        settings = await prisma.attendanceSettings.create({
          data: {
            schoolId: "default",
          },
        });
      }

      return {
        success: true,
        message: "Paramètres récupérés avec succès",
        data: { settings },
      };
    } catch (error: any) {
      console.error(" AttendanceService - getAttendanceSettings error:", error);
      throw error;
    }
  }

  /**
   * Met à jour les paramètres de présence
   */
  async updateAttendanceSettings(
    data: any,
    userId: string,
    auditData: AuditData,
  ): Promise<ApiResponse> {
    try {
      let settings = await prisma.attendanceSettings.findFirst();

      if (settings) {
        settings = await prisma.attendanceSettings.update({
          where: { id: settings.id },
          data: {
            ...data,
            updatedBy: userId,
          },
        });
      } else {
        settings = await prisma.attendanceSettings.create({
          data: {
            ...data,
            schoolId: "default",
            updatedBy: userId,
          },
        });
      }

      return {
        success: true,
        message: "Paramètres mis à jour avec succès",
        data: { settings },
      };
    } catch (error: any) {
      console.error(
        " AttendanceService - updateAttendanceSettings error:",
        error,
      );
      throw error;
    }
  }

  // ==================== UTILITAIRES ====================

  /**
   * Calcule et sauvegarde les statistiques mensuelles
   */
  private async calculateAndSaveStats(
    studentId: string,
    academicYearId: string,
    month: number,
    year: number,
  ): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const attendances = await prisma.attendance.findMany({
      where: {
        studentId,
        academicYearId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalDays = attendances.length;
    const presentDays = attendances.filter(
      (a) => a.status === "PRESENT",
    ).length;
    const absentDays = attendances.filter((a) => a.status === "ABSENT").length;
    const lateDays = attendances.filter((a) => a.status === "LATE").length;
    const excusedDays = attendances.filter(
      (a) => a.status === "EXCUSED",
    ).length;
    const sickDays = attendances.filter((a) => a.status === "SICK").length;

    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const punctualityRate =
      presentDays + lateDays > 0
        ? (presentDays / (presentDays + lateDays)) * 100
        : 0;

    const stats = await prisma.attendanceStats.upsert({
      where: {
        studentId_academicYearId_month_year: {
          studentId,
          academicYearId,
          month,
          year,
        },
      },
      update: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        sickDays,
        attendanceRate,
        punctualityRate,
        lastCalculated: new Date(),
      },
      create: {
        studentId,
        academicYearId,
        month,
        year,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        sickDays,
        attendanceRate,
        punctualityRate,
      },
    });

    return stats;
  }

  /**
   * Met à jour les statistiques mensuelles
   */
  private async updateAttendanceStats(
    studentId: string,
    academicYearId: string,
    date: Date,
  ): Promise<void> {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    await this.calculateAndSaveStats(studentId, academicYearId, month, year);
  }

  // ==================== FEUILLE DE PRÉSENCE PDF ====================

  /**
   * Génère une feuille de présence PDF pour une classe sur une période donnée.
   * Format : A4 paysage, lignes = étudiants, colonnes = dates.
   */
  async generateAttendanceSheetPDF(params: {
    classId: string;
    startDate: Date;
    endDate: Date;
    academicYearId?: string;
  }): Promise<Buffer> {
    const { classId, startDate, endDate, academicYearId } = params;

    const settings = await prisma.systemSettings.findFirst();
    const schoolName = settings?.schoolName || "Institution Scolaire";
    const rawLogo   = settings?.schoolLogo  || null;

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
      select: { name: true, level: true },
    });
    if (!schoolClass) throw Object.assign(new Error("Classe non trouvée"), { status: 404 });

    const students = await prisma.student.findMany({
      where: { classId, status: "Active" },
      select: { id: true, firstName: true, lastName: true, studentCode: true },
      orderBy: { lastName: "asc" },
    });

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const attendances = await prisma.attendance.findMany({
      where: {
        classId,
        date: { gte: start, lte: end },
        ...(academicYearId ? { academicYearId } : {}),
      },
      select: { studentId: true, date: true, status: true },
    });

    // Priorité de fusion : ABSENT > LATE > SICK > EXCUSED > PRESENT > HOLIDAY
    const STATUS_PRIORITY = ["ABSENT", "LATE", "SICK", "EXCUSED", "PRESENT", "HOLIDAY"];
    const matrix = new Map<string, Map<string, string>>();
    for (const a of attendances) {
      const dk = a.date.toISOString().split("T")[0];
      if (!matrix.has(a.studentId)) matrix.set(a.studentId, new Map());
      const existing = matrix.get(a.studentId)!.get(dk);
      if (!existing || STATUS_PRIORITY.indexOf(a.status) < STATUS_PRIORITY.indexOf(existing)) {
        matrix.get(a.studentId)!.set(dk, a.status);
      }
    }

    const dates: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }

    // Résolution du logo (même logique que BulletinService)
    let logoPath: string | null = null;
    if (rawLogo && rawLogo.trim() && !rawLogo.startsWith("http")) {
      const rel = rawLogo.startsWith("/") ? rawLogo.slice(1) : rawLogo;
      const abs = path.join(process.cwd(), rel);
      if (fs.existsSync(abs)) logoPath = abs;
    }

    return this.buildAttendanceSheetPDF({
      schoolName,
      logoPath,
      className:  schoolClass.name,
      classLevel: schoolClass.level,
      students,
      dates,
      matrix,
      startDate: start,
      endDate:   end,
    });
  }

  private buildAttendanceSheetPDF(data: {
    schoolName:  string;
    logoPath:    string | null;
    className:   string;
    classLevel:  string;
    students:    Array<{ id: string; firstName: string; lastName: string; studentCode: string }>;
    dates:       Date[];
    matrix:      Map<string, Map<string, string>>;
    startDate:   Date;
    endDate:     Date;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const { schoolName, logoPath, className, classLevel, students, dates, matrix, startDate, endDate } = data;

        // Dimensions A4 paysage
        const PW = 841.89;
        const PH = 595.28;
        const ML = 30;
        const UW = PW - 2 * ML;

        const C = {
          navy:    "#1E3A5F",
          gold:    "#B8860B",
          text:    "#2D3748",
          muted:   "#718096",
          white:   "#FFFFFF",
          border:  "#CBD5E0",
          altRow:  "#F7FAFC",
          present: "#276749",
          absent:  "#C53030",
          late:    "#C05621",
          excused: "#2B6CB0",
          sick:    "#6B46C1",
        };

        // Colonnes fixes
        const COL_NO   = 22;
        const COL_NOM  = 155;
        const COL_CODE = 55;
        const FIXED_W  = COL_NO + COL_NOM + COL_CODE;

        // Hauteurs
        const HEADER_H      = 88;
        const TH_H          = 32;   // table header
        const ROW_H         = 16;
        const FOOTER_H      = 52;
        const TABLE_TOP     = ML + HEADER_H + 4;
        const CONTENT_TOP   = TABLE_TOP + TH_H;
        const AVAILABLE_H   = PH - CONTENT_TOP - FOOTER_H;
        const MAX_ROWS      = Math.floor(AVAILABLE_H / ROW_H);

        // Pagination dates (max 35 par page)
        const MAX_DATES = 35;
        const datePages: Date[][] = [];
        for (let i = 0; i < dates.length; i += MAX_DATES) datePages.push(dates.slice(i, i + MAX_DATES));
        if (datePages.length === 0) datePages.push([]);

        // Pagination étudiants
        const studentPages: typeof students[] = [];
        for (let i = 0; i < students.length; i += MAX_ROWS) studentPages.push(students.slice(i, i + MAX_ROWS));
        if (studentPages.length === 0) studentPages.push([]);

        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size:    [PW, PH],
          margins: { top: ML, left: ML, right: ML, bottom: 0 },
          autoFirstPage: true,
          info: { Title: "Feuille de Présence", Author: schoolName, Subject: `Présences ${className}` },
        });
        doc.on("data",  (c: Buffer) => chunks.push(c));
        doc.on("end",   () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        const fmtDate = (d: Date) =>
          d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
        const fmtDay  = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit" });
        const fmtMonth = (d: Date) => d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

        const statusCode = (s?: string) => {
          switch (s) {
            case "PRESENT": return "P";
            case "ABSENT":  return "A";
            case "LATE":    return "R";
            case "EXCUSED": return "E";
            case "SICK":    return "M";
            default:        return "";
          }
        };

        const statusColor = (s?: string) => {
          switch (s) {
            case "PRESENT": return C.present;
            case "ABSENT":  return C.absent;
            case "LATE":    return C.late;
            case "EXCUSED": return C.excused;
            case "SICK":    return C.sick;
            default:        return C.text;
          }
        };

        let firstPage = true;

        for (const dateGroup of datePages) {
          const dateColW = dateGroup.length > 0
            ? Math.max(16, Math.min(35, (UW - FIXED_W) / dateGroup.length))
            : 0;
          const tableW = FIXED_W + dateColW * dateGroup.length;

          for (const studentGroup of studentPages) {
            if (!firstPage) {
              doc.addPage({ size: [PW, PH], margins: { top: ML, left: ML, right: ML, bottom: 0 } });
            }
            firstPage = false;

            // ── EN-TÊTE ───────────────────────────────────────────────────
            const headerY = ML;
            const LOGO_SZ = 54;

            // Bandeau bleu
            doc.rect(ML, headerY, UW, HEADER_H).fill(C.navy);

            // Logo (si disponible)
            if (logoPath) {
              try {
                doc.image(logoPath, ML + 6, headerY + (HEADER_H - LOGO_SZ) / 2, { width: LOGO_SZ, height: LOGO_SZ });
              } catch { /* logo non affichable, on skip */ }
            }

            // Nom de l'école
            const textX = logoPath ? ML + LOGO_SZ + 14 : ML + 12;
            doc.fillColor(C.gold).font("Helvetica-Bold").fontSize(13)
              .text(schoolName.toUpperCase(), textX, headerY + 12, { width: UW - (textX - ML) - 10 });

            doc.fillColor(C.white).font("Helvetica-Bold").fontSize(16)
              .text("FEUILLE DE PRÉSENCE", textX, headerY + 30, { width: UW - (textX - ML) - 10 });

            doc.fillColor(C.white).font("Helvetica").fontSize(8.5)
              .text(`Classe : ${className}  |  Niveau : ${classLevel}`, textX, headerY + 54, { width: UW - (textX - ML) - 10 })
              .text(`Période : ${fmtDate(startDate)} — ${fmtDate(endDate)}`, textX, headerY + 66, { width: UW - (textX - ML) - 10 });

            // Barre or
            doc.rect(ML, headerY + HEADER_H, UW, 3).fill(C.gold);

            // ── EN-TÊTE DU TABLEAU ────────────────────────────────────────
            const thY = TABLE_TOP;
            doc.rect(ML, thY, tableW, TH_H).fill(C.border);

            // En-têtes colonnes fixes
            doc.fillColor(C.navy).font("Helvetica-Bold").fontSize(7.5);
            doc.rect(ML, thY, COL_NO, TH_H).stroke();
            doc.text("N°",   ML + 2, thY + (TH_H - 8) / 2, { width: COL_NO - 4, align: "center" });

            doc.rect(ML + COL_NO, thY, COL_NOM, TH_H).stroke();
            doc.text("Nom et Prénom", ML + COL_NO + 4, thY + (TH_H - 8) / 2, { width: COL_NOM - 8 });

            doc.rect(ML + COL_NO + COL_NOM, thY, COL_CODE, TH_H).stroke();
            doc.text("Code", ML + COL_NO + COL_NOM + 2, thY + (TH_H - 8) / 2, { width: COL_CODE - 4, align: "center" });

            // En-têtes dates (jour + mois abrégé sur 2 lignes)
            if (dateGroup.length > 0) {
              const firstMonth = fmtMonth(dateGroup[0]);
              let prevMonth    = firstMonth;
              let spanStart    = 0;
              let spanCount    = 0;

              const drawMonthSpan = (startIdx: number, count: number, monthLabel: string) => {
                const spanX = ML + FIXED_W + startIdx * dateColW;
                const spanW = count * dateColW;
                doc.rect(spanX, thY, spanW, 14).fillAndStroke(C.navy, C.border);
                doc.fillColor(C.white).font("Helvetica-Bold").fontSize(6.5)
                  .text(monthLabel, spanX + 1, thY + 3, { width: spanW - 2, align: "center" });
              };

              for (let di = 0; di < dateGroup.length; di++) {
                const m = fmtMonth(dateGroup[di]);
                if (m !== prevMonth) {
                  drawMonthSpan(spanStart, spanCount, prevMonth);
                  prevMonth = m;
                  spanStart = di;
                  spanCount = 1;
                } else {
                  spanCount++;
                }
              }
              drawMonthSpan(spanStart, spanCount, prevMonth);

              // Numéros de jours
              for (let di = 0; di < dateGroup.length; di++) {
                const dx = ML + FIXED_W + di * dateColW;
                doc.rect(dx, thY + 14, dateColW, TH_H - 14).stroke();
                doc.fillColor(C.navy).font("Helvetica-Bold").fontSize(6.5)
                  .text(fmtDay(dateGroup[di]), dx + 1, thY + 16, { width: dateColW - 2, align: "center" });
              }
            }

            // ── LIGNES ÉTUDIANTS ──────────────────────────────────────────
            for (let si = 0; si < studentGroup.length; si++) {
              const student = studentGroup[si];
              const ry = CONTENT_TOP + si * ROW_H;
              const bgColor = si % 2 === 0 ? C.white : C.altRow;

              doc.rect(ML, ry, tableW, ROW_H).fill(bgColor);

              // N°
              doc.rect(ML, ry, COL_NO, ROW_H).stroke();
              doc.fillColor(C.muted).font("Helvetica").fontSize(7)
                .text(String(si + 1), ML + 2, ry + (ROW_H - 7) / 2, { width: COL_NO - 4, align: "center" });

              // Nom
              const fullName = `${student.lastName.toUpperCase()} ${student.firstName}`;
              doc.rect(ML + COL_NO, ry, COL_NOM, ROW_H).stroke();
              doc.fillColor(C.text).font("Helvetica").fontSize(7)
                .text(fullName, ML + COL_NO + 4, ry + (ROW_H - 7) / 2, { width: COL_NOM - 8, ellipsis: true });

              // Code
              doc.rect(ML + COL_NO + COL_NOM, ry, COL_CODE, ROW_H).stroke();
              doc.fillColor(C.muted).font("Helvetica").fontSize(6.5)
                .text(student.studentCode, ML + COL_NO + COL_NOM + 2, ry + (ROW_H - 7) / 2, { width: COL_CODE - 4, align: "center" });

              // Cellules dates
              const studentMap = matrix.get(student.id);
              for (let di = 0; di < dateGroup.length; di++) {
                const dk   = dateGroup[di].toISOString().split("T")[0];
                const stat = studentMap?.get(dk);
                const dx   = ML + FIXED_W + di * dateColW;
                const code = statusCode(stat);
                const col  = statusColor(stat);

                doc.rect(dx, ry, dateColW, ROW_H).stroke();
                if (code) {
                  doc.fillColor(col).font("Helvetica-Bold").fontSize(6.5)
                    .text(code, dx + 1, ry + (ROW_H - 6.5) / 2, { width: dateColW - 2, align: "center" });
                }
              }
            }

            // ── PIED DE PAGE ──────────────────────────────────────────────
            const footerY = PH - FOOTER_H;
            doc.rect(ML, footerY, UW, 1).fill(C.border);

            // Légende
            const legendItems: Array<[string, string, string]> = [
              ["P", C.present, "Présent"],
              ["A", C.absent,  "Absent"],
              ["R", C.late,    "Retard"],
              ["E", C.excused, "Excusé"],
              ["M", C.sick,    "Malade"],
            ];
            let lx = ML;
            doc.fillColor(C.muted).font("Helvetica").fontSize(7).text("Légende :", ML, footerY + 6);
            lx += 48;
            for (const [code, color, label] of legendItems) {
              doc.fillColor(color).font("Helvetica-Bold").fontSize(7).text(code, lx, footerY + 6);
              doc.fillColor(C.muted).font("Helvetica").fontSize(7).text(`=${label}`, lx + 7, footerY + 6);
              lx += 62;
            }

            // Date de génération
            doc.fillColor(C.muted).font("Helvetica").fontSize(7)
              .text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, ML, footerY + 18);

            // Signatures
            const sigY = footerY + 18;
            const sigW = 130;
            const sigGap = 40;
            const sigStartX = PW - ML - sigW * 2 - sigGap;

            doc.fillColor(C.text).font("Helvetica").fontSize(7)
              .text("Directeur(rice) :", sigStartX, sigY)
              .text("Professeur(e) principal(e) :", sigStartX + sigW + sigGap, sigY);

            doc.moveTo(sigStartX, sigY + 22).lineTo(sigStartX + sigW, sigY + 22).stroke(C.border);
            doc.moveTo(sigStartX + sigW + sigGap, sigY + 22).lineTo(sigStartX + sigW * 2 + sigGap, sigY + 22).stroke(C.border);
          }
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
