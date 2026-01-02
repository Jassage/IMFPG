/**
 * @file scheduleService.ts
 * @description Service pour la gestion des emplois du temps avec support multiple de formats de temps
 * @version 2.0.0
 */

import { PrismaClient } from "../../generated/prisma";
import {
  Schedule,
  ApiResponse,
  ScheduleConflict,
  ConflictCheckResult,
  CreateScheduleData,
  UpdateScheduleData,
  GenerateTimetableData,
  ScheduleFilters,
  PaginationData,
} from "../types/timetableTypes";

const prisma = new PrismaClient();

/**
 * @class ScheduleService
 * @description Service pour la gestion des emplois du temps avec support de formats multiples
 */
export class ScheduleService {
  /**
   * Parse et convertit un temps en format HH:MM:SS
   * Supporte: HH:MM, HH:MM:SS, timestamp ISO
   */
  static parseTime(timeInput: string): { time: string; date: Date } {
    try {
      let date: Date;

      // Format HH:MM ou HH:MM:SS
      if (timeInput.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const [hours, minutes, seconds = "00"] = timeInput.split(":");
        date = new Date();
        date.setUTCHours(
          parseInt(hours.padStart(2, "0")),
          parseInt(minutes.padStart(2, "0")),
          parseInt(seconds.padStart(2, "0")),
          0
        );
      }
      // Format ISO
      else if (timeInput.includes("T")) {
        date = new Date(timeInput);
        if (isNaN(date.getTime())) {
          throw new Error("Timestamp ISO invalide");
        }
      }
      // Format inconnu
      else {
        throw new Error(`Format de temps non supporté: ${timeInput}`);
      }

      // Formater en HH:MM:SS
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");

      return {
        time: `${hours}:${minutes}:${seconds}`,
        date,
      };
    } catch (error: any) {
      throw {
        status: 400,
        message: error.message || "Format de temps invalide",
        code: "INVALID_TIME_FORMAT",
      };
    }
  }

  /**
   * Vérifie si deux créneaux se chevauchent
   */
  private static checkTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    // Convertir en minutes pour comparaison
    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    return s1 < e2 && e1 > s2;
  }

  /**
   * Formate un temps pour l'affichage (HH:MM)
   */
  static formatTimeForDisplay(time: string): string {
    try {
      const { time: formattedTime } = this.parseTime(time);
      return formattedTime.substring(0, 5); // HH:MM
    } catch {
      // Fallback simple
      return time.includes(":") ? time.substring(0, 5) : "00:00";
    }
  }

  /**
   * Vérifier les conflits d'horaire
   */
  static async checkScheduleConflicts(
    professeurId: string,
    classId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    classroom?: string | null,
    excludeScheduleId?: string
  ): Promise<ConflictCheckResult> {
    const conflicts: ScheduleConflict[] = [];

    try {
      // Convertir les temps
      const { time: startTimeStr, date: startDate } = this.parseTime(startTime);
      const { time: endTimeStr, date: endDate } = this.parseTime(endTime);

      // Vérifier l'ordre des temps
      if (endDate <= startDate) {
        conflicts.push({
          type: "INVALID_TIME_RANGE",
          message: "L'heure de fin doit être après l'heure de début",
          details: [],
        });
        return { hasConflict: true, conflicts };
      }

      // Construire la condition WHERE
      const baseWhere: any = {
        dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lt: endTimeStr } },
              { endTime: { gt: startTimeStr } },
            ],
          },
          {
            AND: [
              { startTime: { lte: startTimeStr } },
              { endTime: { gte: endTimeStr } },
            ],
          },
        ],
      };

      if (excludeScheduleId) {
        baseWhere.id = { not: excludeScheduleId };
      }

      // 1. Vérifier conflits pour le professeur
      const professeurConflicts = await prisma.schedule.findMany({
        where: {
          ...baseWhere,
          professeurId,
          status: "ACTIVE",
        },
        include: {
          schoolClass: true,
          classAssignment: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (professeurConflicts.length > 0) {
        conflicts.push({
          type: "PROFESSEUR_CONFLICT",
          message: `Le professeur a déjà un cours programmé`,
          details: professeurConflicts.map((c) => ({
            id: c.id,
            subject: c.classAssignment?.subject?.name || "Inconnu",
            class: c.schoolClass?.name || "Inconnu",
            startTime: this.formatTimeForDisplay(c.startTime),
            endTime: this.formatTimeForDisplay(c.endTime),
            classroom: c.classroom,
            dayOfWeek: c.dayOfWeek,
          })),
        });
      }

      // 2. Vérifier conflits pour la classe
      const classConflicts = await prisma.schedule.findMany({
        where: {
          ...baseWhere,
          classId,
          status: "ACTIVE",
        },
        include: {
          professeur: true,
          classAssignment: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (classConflicts.length > 0) {
        conflicts.push({
          type: "CLASS_CONFLICT",
          message: `La classe a déjà un cours programmé`,
          details: classConflicts.map((c) => ({
            id: c.id,
            subject: c.classAssignment?.subject?.name || "Inconnu",
            professeur: c.professeur
              ? `${c.professeur.firstName} ${c.professeur.lastName}`
              : "Inconnu",
            startTime: this.formatTimeForDisplay(c.startTime),
            endTime: this.formatTimeForDisplay(c.endTime),
            classroom: c.classroom,
            dayOfWeek: c.dayOfWeek,
          })),
        });
      }

      // 3. Vérifier conflits de salle (si spécifiée)
      if (classroom && classroom.trim()) {
        const roomConflicts = await prisma.schedule.findMany({
          where: {
            ...baseWhere,
            classroom: classroom.trim(),
            status: "ACTIVE",
          },
          include: {
            schoolClass: true,
            professeur: true,
          },
        });

        if (roomConflicts.length > 0) {
          conflicts.push({
            type: "ROOM_CONFLICT",
            message: `La salle ${classroom} est déjà occupée`,
            details: roomConflicts.map((c) => ({
              id: c.id,
              class: c.schoolClass?.name || "Inconnu",
              professeur: c.professeur
                ? `${c.professeur.firstName} ${c.professeur.lastName}`
                : "Inconnu",
              startTime: this.formatTimeForDisplay(c.startTime),
              endTime: this.formatTimeForDisplay(c.endTime),
              dayOfWeek: c.dayOfWeek,
            })),
          });
        }
      }

      return {
        hasConflict: conflicts.length > 0,
        conflicts,
      };
    } catch (error: any) {
      console.error("Erreur checkScheduleConflicts:", error);
      conflicts.push({
        type: "VALIDATION_ERROR",
        message: error.message || "Erreur lors de la vérification des conflits",
        details: [error],
      });
      return { hasConflict: true, conflicts };
    }
  }

  /**
   * Crée un nouvel horaire
   */
  static async createSchedule(data: CreateScheduleData): Promise<ApiResponse> {
    try {
      const {
        assignmentId,
        classId,
        dayOfWeek,
        startTime,
        endTime,
        classroom,
        recurrence,
        untilDate,
        notes,
      } = data;

      // Validation des données de base
      if (!assignmentId || !classId || !dayOfWeek || !startTime || !endTime) {
        throw {
          status: 400,
          message: "Données manquantes",
          code: "MISSING_DATA",
          details: { assignmentId, classId, dayOfWeek, startTime, endTime },
        };
      }

      // Convertir et valider les temps
      const { time: startTimeStr, date: startDate } = this.parseTime(startTime);
      const { time: endTimeStr, date: endDate } = this.parseTime(endTime);

      // Vérifier que l'heure de fin est après l'heure de début
      if (endDate <= startDate) {
        throw {
          status: 400,
          message: "L'heure de fin doit être après l'heure de début",
          code: "INVALID_TIME_RANGE",
          details: {
            startTime: startTimeStr,
            endTime: endTimeStr,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };
      }

      // Vérifier l'assignation
      const assignment = await prisma.classAssignment.findUnique({
        where: { id: assignmentId },
        include: {
          professeur: true,
          subject: true,
          academicYear: true,
        },
      });

      if (!assignment) {
        throw {
          status: 404,
          message: "Assignation non trouvée",
          code: "ASSIGNMENT_NOT_FOUND",
          details: { assignmentId },
        };
      }

      // Vérifier que la classe existe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        throw {
          status: 404,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
          details: { classId },
        };
      }

      // Vérifier que le niveau de classe correspond
      if (schoolClass.level !== assignment.classLevel) {
        throw {
          status: 400,
          message: "Le niveau de la classe ne correspond pas à l'assignation",
          code: "CLASS_LEVEL_MISMATCH",
          details: {
            classLevel: schoolClass.level,
            assignmentLevel: assignment.classLevel,
            className: schoolClass.name,
          },
        };
      }

      // Vérifier les conflits
      const conflictCheck = await this.checkScheduleConflicts(
        assignment.professeurId,
        classId,
        dayOfWeek,
        startTime,
        endTime,
        classroom
      );

      if (conflictCheck.hasConflict) {
        throw {
          status: 409,
          message: "Conflit d'horaire détecté",
          code: "SCHEDULE_CONFLICT",
          data: conflictCheck,
        };
      }

      // Créer l'horaire
      const schedule = await prisma.schedule.create({
        data: {
          assignmentId,
          classId,
          professeurId: assignment.professeurId,
          dayOfWeek,
          startTime: startTimeStr,
          endTime: endTimeStr,
          classroom: classroom?.trim() || null,
          recurrence: recurrence?.trim() || null,
          untilDate: untilDate ? new Date(untilDate) : null,
          notes: notes?.trim() || null,
          status: "ACTIVE",
        },
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: true,
              academicYear: true,
            },
          },
          schoolClass: true,
          professeur: true,
        },
      });

      // Calculer la durée
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));

      return {
        success: true,
        message: "Horaire créé avec succès",
        data: { schedule },
        metadata: {
          dayOfWeek,
          startTime: startTimeStr,
          endTime: endTimeStr,
          startTimeDisplay: this.formatTimeForDisplay(startTimeStr),
          endTimeDisplay: this.formatTimeForDisplay(endTimeStr),
          classroom: classroom || "Non spécifié",
          professeur: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
          subject: assignment.subject.name,
          class: schoolClass.name,
          level: schoolClass.level,
          duration: `${durationMinutes} minutes`,
          durationHours: (durationMinutes / 60).toFixed(1),
          academicYear: assignment.academicYear?.year || "N/A",
        },
      };
    } catch (error: any) {
      console.error("Erreur création horaire:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Erreur lors de la création de l'horaire",
        code: error.code || "CREATE_ERROR",
        data: error.data,
        details: error.details,
      };
    }
  }

  /**
   * Met à jour un horaire
   */
  static async updateSchedule(
    id: string,
    data: UpdateScheduleData
  ): Promise<ApiResponse> {
    try {
      // Vérifier si l'horaire existe
      const existingSchedule = await prisma.schedule.findUnique({
        where: { id },
        include: {
          classAssignment: {
            include: {
              professeur: true,
              subject: true,
            },
          },
          schoolClass: true,
        },
      });

      if (!existingSchedule) {
        throw {
          status: 404,
          message: "Horaire non trouvé",
          code: "SCHEDULE_NOT_FOUND",
          details: { id },
        };
      }

      // Variables pour les temps convertis
      let startTimeStr = existingSchedule.startTime;
      let endTimeStr = existingSchedule.endTime;
      let startDate = new Date(`2000-01-01T${startTimeStr}Z`);
      let endDate = new Date(`2000-01-01T${endTimeStr}Z`);

      // Convertir startTime si fourni
      if (data.startTime) {
        const { time: convertedStartTime, date: convertedStartDate } =
          this.parseTime(data.startTime);
        startTimeStr = convertedStartTime;
        startDate = convertedStartDate;
      }

      // Convertir endTime si fourni
      if (data.endTime) {
        const { time: convertedEndTime, date: convertedEndDate } =
          this.parseTime(data.endTime);
        endTimeStr = convertedEndTime;
        endDate = convertedEndDate;
      }

      // Vérifier la validité des heures
      const startMinutes =
        startDate.getUTCHours() * 60 + startDate.getUTCMinutes();
      const endMinutes = endDate.getUTCHours() * 60 + endDate.getUTCMinutes();

      if (endMinutes <= startMinutes) {
        throw {
          status: 400,
          message: "L'heure de fin doit être après l'heure de début",
          code: "INVALID_TIME_RANGE",
          details: {
            startTime: startTimeStr,
            endTime: endTimeStr,
            startMinutes,
            endMinutes,
          },
        };
      }

      const duration = endMinutes - startMinutes;
      if (duration < 30) {
        throw {
          status: 400,
          message: "Durée minimale: 30 minutes",
          code: "MIN_DURATION_NOT_MET",
          details: { duration },
        };
      }

      if (duration > 240) {
        throw {
          status: 400,
          message: "Durée maximale: 4 heures",
          code: "MAX_DURATION_EXCEEDED",
          details: { duration },
        };
      }

      // Vérifier les conflits (sauf avec lui-même)
      const conflictCheck = await this.checkScheduleConflicts(
        existingSchedule.professeurId,
        existingSchedule.classId,
        data.dayOfWeek || existingSchedule.dayOfWeek,
        data.startTime || `2000-01-01T${existingSchedule.startTime}Z`,
        data.endTime || `2000-01-01T${existingSchedule.endTime}Z`,
        data.classroom !== undefined
          ? data.classroom
          : existingSchedule.classroom,
        id
      );

      if (conflictCheck.hasConflict) {
        throw {
          status: 409,
          message: "Conflit d'horaire détecté",
          code: "SCHEDULE_CONFLICT",
          data: {
            conflicts: conflictCheck.conflicts,
          },
        };
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        dayOfWeek: data.dayOfWeek || existingSchedule.dayOfWeek,
        startTime: startTimeStr,
        endTime: endTimeStr,
        classroom:
          data.classroom !== undefined
            ? data.classroom?.trim() || null
            : existingSchedule.classroom,
        recurrence:
          data.recurrence !== undefined
            ? data.recurrence?.trim() || null
            : existingSchedule.recurrence,
        untilDate: data.untilDate
          ? new Date(data.untilDate)
          : existingSchedule.untilDate,
        notes:
          data.notes !== undefined
            ? data.notes?.trim() || null
            : existingSchedule.notes,
        status: data.status || existingSchedule.status,
      };

      // Mettre à jour l'horaire
      const schedule = await prisma.schedule.update({
        where: { id },
        data: updateData,
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: true,
            },
          },
          schoolClass: true,
          professeur: true,
        },
      });

      // Identifier les champs modifiés
      const changes: string[] = [];
      Object.keys(data).forEach((key) => {
        if (data[key as keyof UpdateScheduleData] !== undefined) {
          changes.push(key);
        }
      });

      return {
        success: true,
        message: "Horaire mis à jour avec succès",
        data: { schedule },
        metadata: {
          changes,
          duration: `${duration} minutes`,
          durationDisplay: `${Math.floor(duration / 60)}h${duration % 60}`,
          previousStatus: existingSchedule.status,
          newStatus: schedule.status,
        },
      };
    } catch (error: any) {
      console.error("Erreur mise à jour horaire:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Erreur lors de la mise à jour de l'horaire",
        code: error.code || "UPDATE_ERROR",
        data: error.data,
        details: error.details,
      };
    }
  }

  /**
   * Récupère tous les horaires avec pagination
   */
  static async getAllSchedules(filters: ScheduleFilters): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        classId,
        professeurId,
        dayOfWeek,
        status,
        academicYearId,
        classroom,
      } = filters;

      const pageNum = Math.max(1, parseInt(page.toString()));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit.toString())));
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      if (status) where.status = status;
      if (classId) where.classId = classId;
      if (professeurId) where.professeurId = professeurId;
      if (dayOfWeek) where.dayOfWeek = dayOfWeek;
      if (classroom)
        where.classroom = { contains: classroom, mode: "insensitive" };

      // Filtrer par année académique via l'assignation
      if (academicYearId) {
        const assignments = await prisma.classAssignment.findMany({
          where: { academicYearId },
          select: { id: true },
        });
        const assignmentIds = assignments.map((a) => a.id);
        where.assignmentId = { in: assignmentIds };
      }

      const [schedules, total] = await Promise.all([
        prisma.schedule.findMany({
          where,
          include: {
            classAssignment: {
              include: {
                subject: true,
                professeur: true,
                academicYear: true,
              },
            },
            schoolClass: true,
            professeur: true,
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          skip,
          take: limitNum,
        }),
        prisma.schedule.count({ where }),
      ]);

      // Formater les heures pour l'affichage
      const formattedSchedules = schedules.map((schedule) => ({
        ...schedule,
        displayStartTime: this.formatTimeForDisplay(schedule.startTime),
        displayEndTime: this.formatTimeForDisplay(schedule.endTime),
        duration: this.calculateDuration(schedule.startTime, schedule.endTime),
      }));

      const pagination: PaginationData = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      };

      return {
        success: true,
        message: "Horaires récupérés avec succès",
        data: {
          schedules: formattedSchedules,
          pagination,
        },
        metadata: {
          filters: {
            classId,
            professeurId,
            dayOfWeek,
            status,
            academicYearId,
            classroom,
          },
          counts: {
            active: schedules.filter((s) => s.status === "ACTIVE").length,
            inactive: schedules.filter((s) => s.status === "INACTIVE").length,
            cancelled: schedules.filter((s) => s.status === "CANCELLED").length,
          },
        },
      };
    } catch (error: any) {
      console.error("Erreur récupération horaires:", error);
      throw {
        status: 500,
        message: "Erreur lors de la récupération des horaires",
        code: "FETCH_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Récupère un horaire par ID
   */
  static async getScheduleById(id: string): Promise<ApiResponse> {
    try {
      const schedule = await prisma.schedule.findUnique({
        where: { id },
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: true,
              academicYear: true,
            },
          },
          schoolClass: true,
          professeur: true,
        },
      });

      if (!schedule) {
        throw {
          status: 404,
          message: "Horaire non trouvé",
          code: "SCHEDULE_NOT_FOUND",
          details: { id },
        };
      }

      // Formater les heures
      const formattedSchedule = {
        ...schedule,
        displayStartTime: this.formatTimeForDisplay(schedule.startTime),
        displayEndTime: this.formatTimeForDisplay(schedule.endTime),
        duration: this.calculateDuration(schedule.startTime, schedule.endTime),
      };

      return {
        success: true,
        message: "Horaire récupéré avec succès",
        data: { schedule: formattedSchedule },
        metadata: {
          dayOfWeek: schedule.dayOfWeek,
          duration: formattedSchedule.duration,
          status: schedule.status,
          classroom: schedule.classroom,
        },
      };
    } catch (error: any) {
      console.error("Erreur récupération horaire:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Erreur lors de la récupération de l'horaire",
        code: error.code || "FETCH_ERROR",
        details: error.details,
      };
    }
  }

  /**
   * Récupère l'emploi du temps d'une classe
   */
  static async getClassTimetable(
    classId: string,
    academicYearId?: string
  ): Promise<ApiResponse> {
    try {
      if (!classId) {
        throw {
          status: 400,
          message: "classId est requis",
          code: "MISSING_CLASS_ID",
        };
      }

      const where: any = {
        classId,
        status: "ACTIVE",
      };

      // Filtrer par année académique via l'assignation
      if (academicYearId) {
        const assignments = await prisma.classAssignment.findMany({
          where: { academicYearId },
          select: { id: true },
        });
        const assignmentIds = assignments.map((a) => a.id);
        where.assignmentId = { in: assignmentIds };
      }

      const schedules = await prisma.schedule.findMany({
        where,
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: true,
            },
          },
          schoolClass: true,
          professeur: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      // Organiser par jour de la semaine
      const timetableByDay: Record<string, any[]> = {};
      const DAYS = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];

      DAYS.forEach((day) => {
        timetableByDay[day] = [];
      });

      // Formater chaque horaire
      schedules.forEach((schedule) => {
        if (timetableByDay[schedule.dayOfWeek]) {
          timetableByDay[schedule.dayOfWeek].push({
            id: schedule.id,
            subject: schedule.classAssignment?.subject || { name: "Inconnu" },
            professeur:
              schedule.professeur || schedule.classAssignment?.professeur,
            classroom: schedule.classroom,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            displayStartTime: this.formatTimeForDisplay(schedule.startTime),
            displayEndTime: this.formatTimeForDisplay(schedule.endTime),
            status: schedule.status,
            notes: schedule.notes,
            duration: this.calculateDuration(
              schedule.startTime,
              schedule.endTime
            ),
          });
        }
      });

      // Trier chaque jour par heure de début
      Object.keys(timetableByDay).forEach((day) => {
        timetableByDay[day].sort((a: any, b: any) => {
          return a.startTime.localeCompare(b.startTime);
        });
      });

      // Calculer les statistiques
      const weekSummary: Record<string, { count: number; hours: number }> = {};
      let totalHours = 0;

      Object.keys(timetableByDay).forEach((day) => {
        const daySchedules = timetableByDay[day];
        const dayHours = daySchedules.reduce((total: number, schedule: any) => {
          return total + (schedule.duration?.hours || 0);
        }, 0);

        weekSummary[day] = {
          count: daySchedules.length,
          hours: parseFloat(dayHours.toFixed(1)),
        };

        totalHours += dayHours;
      });

      return {
        success: true,
        message: "Emploi du temps récupéré",
        data: {
          classId,
          timetable: timetableByDay,
          schedules,
          totalSchedules: schedules.length,
          weekSummary,
          totalHours: parseFloat(totalHours.toFixed(1)),
          averageDailyHours: parseFloat(
            (totalHours / Object.keys(timetableByDay).length).toFixed(1)
          ),
        },
        metadata: {
          classId,
          academicYearId,
          totalDays: Object.keys(timetableByDay).filter(
            (day) => timetableByDay[day].length > 0
          ).length,
        },
      };
    } catch (error: any) {
      console.error("Erreur récupération emploi du temps:", error);
      throw {
        status: 500,
        message: "Erreur lors de la récupération de l'emploi du temps",
        code: "FETCH_TIMETABLE_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Génère un emploi du temps automatiquement
   */
  static async generateTimetable(
    data: GenerateTimetableData
  ): Promise<ApiResponse> {
    try {
      const { classId, academicYearId, constraints } = data;

      // Récupérer la classe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        throw {
          status: 404,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
          details: { classId },
        };
      }

      // Récupérer toutes les assignations pour cette classe et année
      const assignments = await prisma.classAssignment.findMany({
        where: {
          classLevel: schoolClass.level,
          academicYearId,
          status: "Active",
        },
        include: {
          subject: true,
          professeur: true,
        },
      });

      if (assignments.length === 0) {
        throw {
          status: 404,
          message: "Aucune assignation trouvée pour cette classe",
          code: "NO_ASSIGNMENTS",
          details: { classId, academicYearId, level: schoolClass.level },
        };
      }

      // Configuration des créneaux
      const daysOfWeek = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
      ];
      const timeSlots = [
        { start: "08:00:00", end: "09:30:00" },
        { start: "09:45:00", end: "11:15:00" },
        { start: "11:30:00", end: "13:00:00" },
        { start: "14:00:00", end: "15:30:00" },
        { start: "15:45:00", end: "17:15:00" },
      ];

      // Contraintes par défaut
      const defaultConstraints = {
        maxHoursPerDay: constraints?.maxHoursPerDay || 6,
        breakTime: constraints?.breakTime || {
          start: "12:00:00",
          end: "14:00:00",
        },
      };

      const generatedSchedules = [];
      const errors: any[] = [];
      const professeurAssignments = new Map();
      const classroomAssignments = new Map();

      // Tenter de placer chaque assignation
      for (const assignment of assignments) {
        let placed = false;

        for (const day of daysOfWeek) {
          if (placed) break;

          for (const slot of timeSlots) {
            if (placed) break;

            // Vérifier les contraintes de pause
            if (defaultConstraints.breakTime) {
              const breakStart = defaultConstraints.breakTime.start;
              const breakEnd = defaultConstraints.breakTime.end;
              const slotStartHour = parseInt(slot.start.split(":")[0]);
              const breakStartHour = parseInt(breakStart.split(":")[0]);
              const breakEndHour = parseInt(breakEnd.split(":")[0]);

              if (
                slotStartHour >= breakStartHour &&
                slotStartHour < breakEndHour
              ) {
                continue; // Skip les créneaux pendant la pause
              }
            }

            // Vérifier les conflits
            const isoStartTime = `2000-01-01T${slot.start}Z`;
            const isoEndTime = `2000-01-01T${slot.end}Z`;

            const conflictCheck = await this.checkScheduleConflicts(
              assignment.professeurId,
              classId,
              day,
              isoStartTime,
              isoEndTime
            );

            if (!conflictCheck.hasConflict) {
              try {
                // Assigner une salle disponible
                const availableClassrooms = [
                  "A101",
                  "A102",
                  "A103",
                  "B201",
                  "B202",
                  "C301",
                  "C302",
                  "D401",
                  "D402",
                  "E501",
                ];

                const assignedClassroom =
                  availableClassrooms.find(
                    (room) =>
                      !classroomAssignments
                        .get(`${day}-${slot.start}`)
                        ?.includes(room)
                  ) || "A101";

                const schedule = await prisma.schedule.create({
                  data: {
                    assignmentId: assignment.id,
                    classId,
                    professeurId: assignment.professeurId,
                    dayOfWeek: day,
                    startTime: slot.start,
                    endTime: slot.end,
                    classroom: assignedClassroom,
                    status: "ACTIVE",
                    notes: "Généré automatiquement",
                    recurrence: null,
                    untilDate: null,
                  },
                  include: {
                    classAssignment: {
                      include: {
                        subject: true,
                        professeur: true,
                      },
                    },
                  },
                });

                generatedSchedules.push(schedule);
                placed = true;

                // Mettre à jour les compteurs
                const professeurKey = `${assignment.professeurId}-${day}`;
                professeurAssignments.set(
                  professeurKey,
                  (professeurAssignments.get(professeurKey) || 0) + 1
                );

                const classroomKey = `${day}-${slot.start}`;
                classroomAssignments.set(classroomKey, [
                  ...(classroomAssignments.get(classroomKey) || []),
                  assignedClassroom,
                ]);
              } catch (error: any) {
                errors.push({
                  assignmentId: assignment.id,
                  subject: assignment.subject.name,
                  professeur: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
                  error: error.message,
                  day,
                  slot: `${slot.start}-${slot.end}`,
                });
              }
            }
          }
        }

        if (!placed) {
          errors.push({
            assignmentId: assignment.id,
            subject: assignment.subject.name,
            professeur: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
            message:
              "Impossible de placer ce cours - tous les créneaux sont occupés",
            level: schoolClass.level,
          });
        }
      }

      const totalAssignments = assignments.length;
      const successfullyPlaced = generatedSchedules.length;
      const successRate = (successfullyPlaced / totalAssignments) * 100;

      return {
        success: true,
        message: `Emploi du temps généré avec ${successfullyPlaced} créneaux sur ${totalAssignments} assignations`,
        data: {
          schedules: generatedSchedules,
          errors,
          statistics: {
            totalAssignments,
            successfullyPlaced,
            failed: errors.length,
            successRate: Math.round(successRate * 100) / 100,
            totalHours: this.calculateTotalHours(generatedSchedules),
            averageHoursPerDay:
              this.calculateAverageHoursPerDay(generatedSchedules),
          },
        },
        metadata: {
          classId,
          className: schoolClass.name,
          level: schoolClass.level,
          academicYearId,
          generated: successfullyPlaced,
          errors: errors.length,
          successRate: `${Math.round(successRate)}%`,
          constraints: defaultConstraints,
          generationDate: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("Erreur génération emploi du temps:", error);
      throw {
        status: error.status || 500,
        message:
          error.message || "Erreur lors de la génération de l'emploi du temps",
        code: error.code || "GENERATION_ERROR",
        data: error.data,
        details: error.details,
      };
    }
  }

  /**
   * Récupère l'emploi du temps d'un professeur
   */
  static async getProfessorSchedule(
    professeurId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ): Promise<ApiResponse> {
    try {
      const { startDate, endDate, status = "ACTIVE" } = filters || {};

      if (!professeurId) {
        throw {
          status: 400,
          message: "professeurId est requis",
          code: "MISSING_PROFESSEUR_ID",
        };
      }

      const where: any = {
        professeurId,
        status,
      };

      if (startDate && endDate) {
        where.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const schedules = await prisma.schedule.findMany({
        where,
        include: {
          classAssignment: {
            include: {
              subject: true,
              academicYear: true,
            },
          },
          schoolClass: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      // Organiser par jour
      const scheduleByDay: Record<string, any[]> = {};
      const DAYS = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];

      DAYS.forEach((day) => {
        scheduleByDay[day] = [];
      });

      schedules.forEach((schedule) => {
        if (scheduleByDay[schedule.dayOfWeek]) {
          scheduleByDay[schedule.dayOfWeek].push({
            ...schedule,
            displayStartTime: this.formatTimeForDisplay(schedule.startTime),
            displayEndTime: this.formatTimeForDisplay(schedule.endTime),
            duration: this.calculateDuration(
              schedule.startTime,
              schedule.endTime
            ),
          });
        }
      });

      // Calculer les heures totales
      const weeklyHours = schedules.reduce((total, s) => {
        const duration = this.calculateDuration(s.startTime, s.endTime);
        return total + (duration.hours || 0);
      }, 0);

      const daysWithSchedules = Object.keys(scheduleByDay).filter(
        (day) => scheduleByDay[day].length > 0
      ).length;

      return {
        success: true,
        message: "Emploi du temps du professeur récupéré",
        data: {
          schedules,
          scheduleByDay,
          totalSchedules: schedules.length,
          weeklyHours: parseFloat(weeklyHours.toFixed(1)),
          dailyAverage:
            daysWithSchedules > 0
              ? parseFloat((weeklyHours / daysWithSchedules).toFixed(1))
              : 0,
          daysWithSchedules,
          professeurId,
        },
        metadata: {
          startDate,
          endDate,
          status,
          totalHours: weeklyHours,
        },
      };
    } catch (error: any) {
      console.error("Erreur récupération emploi du temps professeur:", error);
      throw {
        status: 500,
        message:
          "Erreur lors de la récupération de l'emploi du temps du professeur",
        code: "FETCH_PROFESSOR_SCHEDULE_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Vérifie les conflits d'horaire (wrapper pour API)
   */
  static async checkConflicts(filters: {
    professeurId: string;
    classId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    classroom?: string;
    excludeScheduleId?: string;
  }): Promise<ApiResponse> {
    try {
      const {
        professeurId,
        classId,
        dayOfWeek,
        startTime,
        endTime,
        classroom,
        excludeScheduleId,
      } = filters;

      if (!professeurId || !classId || !dayOfWeek || !startTime || !endTime) {
        throw {
          status: 400,
          message: "Paramètres manquants",
          code: "MISSING_PARAMETERS",
        };
      }

      const conflictCheck = await this.checkScheduleConflicts(
        professeurId,
        classId,
        dayOfWeek,
        startTime,
        endTime,
        classroom,
        excludeScheduleId
      );

      return {
        success: true,
        message: conflictCheck.hasConflict
          ? "Conflits détectés"
          : "Aucun conflit",
        data: conflictCheck,
        metadata: {
          hasConflict: conflictCheck.hasConflict,
          conflictCount: conflictCheck.conflicts.length,
          checkedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("Erreur vérification conflits:", error);
      throw {
        status: 500,
        message: "Erreur lors de la vérification des conflits",
        code: "CHECK_CONFLICTS_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Récupère les créneaux disponibles
   */
  static async getAvailableTimeSlots(filters: {
    classId?: string;
    dayOfWeek?: string;
    professeurId?: string;
    classroom?: string;
  }): Promise<ApiResponse> {
    try {
      const { classId, dayOfWeek, professeurId, classroom } = filters;

      // Créneaux de base
      const baseTimeSlots = [
        { start: "08:00:00", end: "09:30:00" },
        { start: "09:45:00", end: "11:15:00" },
        { start: "11:30:00", end: "13:00:00" },
        { start: "14:00:00", end: "15:30:00" },
        { start: "15:45:00", end: "17:15:00" },
        { start: "17:30:00", end: "19:00:00" },
      ];

      // Récupérer les créneaux occupés
      const where: any = { status: "ACTIVE" };

      if (dayOfWeek) where.dayOfWeek = dayOfWeek;
      if (classId) where.classId = classId;
      if (professeurId) where.professeurId = professeurId;
      if (classroom) where.classroom = classroom;

      const occupiedSchedules = await prisma.schedule.findMany({
        where,
        select: {
          startTime: true,
          endTime: true,
          dayOfWeek: true,
          classroom: true,
          professeurId: true,
          classId: true,
        },
      });

      // Filtrer les créneaux disponibles
      const availableSlots = baseTimeSlots.filter((slot) => {
        return !occupiedSchedules.some((occupied) => {
          // Vérifier si le jour correspond
          if (dayOfWeek && occupied.dayOfWeek !== dayOfWeek) {
            return false;
          }

          // Vérifier le chevauchement
          return this.checkTimeOverlap(
            occupied.startTime,
            occupied.endTime,
            slot.start,
            slot.end
          );
        });
      });

      // Formater les créneaux pour l'affichage
      const formattedSlots = availableSlots.map((slot) => {
        const duration = this.calculateDuration(slot.start, slot.end);
        return {
          ...slot,
          displayStartTime: this.formatTimeForDisplay(slot.start),
          displayEndTime: this.formatTimeForDisplay(slot.end),
          duration: duration.display,
          durationMinutes: duration.minutes,
          slotId: `${slot.start}-${slot.end}`,
        };
      });

      return {
        success: true,
        message: "Créneaux disponibles récupérés",
        data: {
          dayOfWeek,
          availableSlots: formattedSlots,
          totalAvailable: formattedSlots.length,
          totalBase: baseTimeSlots.length,
          occupancyRate: parseFloat(
            (
              ((baseTimeSlots.length - formattedSlots.length) /
                baseTimeSlots.length) *
              100
            ).toFixed(1)
          ),
          occupiedSlots: baseTimeSlots.length - formattedSlots.length,
          filters: {
            classId,
            dayOfWeek,
            professeurId,
            classroom,
          },
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          filtersApplied: Object.keys(filters).filter(
            (key) => filters[key as keyof typeof filters]
          ).length,
        },
      };
    } catch (error: any) {
      console.error("Erreur récupération créneaux disponibles:", error);
      throw {
        status: 500,
        message: "Erreur lors de la récupération des créneaux disponibles",
        code: "FETCH_AVAILABLE_SLOTS_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Supprime un horaire
   */
  static async deleteSchedule(id: string): Promise<ApiResponse> {
    try {
      // Vérifier si l'horaire existe
      const schedule = await prisma.schedule.findUnique({
        where: { id },
        include: {
          classAssignment: {
            include: {
              subject: true,
            },
          },
          schoolClass: true,
        },
      });

      if (!schedule) {
        throw {
          status: 404,
          message: "Horaire non trouvé",
          code: "SCHEDULE_NOT_FOUND",
          details: { id },
        };
      }

      // Supprimer l'horaire
      await prisma.schedule.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Horaire supprimé avec succès",
        metadata: {
          subject: schedule.classAssignment?.subject?.name || "Inconnu",
          class: schedule.schoolClass?.name || "Inconnu",
          dayOfWeek: schedule.dayOfWeek,
          time: `${this.formatTimeForDisplay(schedule.startTime)} - ${this.formatTimeForDisplay(schedule.endTime)}`,
          deletedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("Erreur suppression horaire:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Erreur lors de la suppression de l'horaire",
        code: error.code || "DELETE_ERROR",
        details: error.message,
      };
    }
  }

  /**
   * Méthodes utilitaires privées
   */
  private static calculateDuration(
    startTime: string,
    endTime: string
  ): {
    minutes: number;
    hours: number;
    display: string;
  } {
    try {
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);

      const durationMs = end.date.getTime() - start.date.getTime();
      const minutes = Math.round(durationMs / (1000 * 60));
      const hours = minutes / 60;

      const hoursPart = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;

      return {
        minutes,
        hours: parseFloat(hours.toFixed(1)),
        display:
          `${hoursPart > 0 ? `${hoursPart}h` : ""}${minutesPart > 0 ? `${minutesPart}min` : ""}`.trim() ||
          "0min",
      };
    } catch {
      return { minutes: 0, hours: 0, display: "0min" };
    }
  }

  private static calculateTotalHours(schedules: any[]): number {
    return schedules.reduce((total, schedule) => {
      const duration = this.calculateDuration(
        schedule.startTime,
        schedule.endTime
      );
      return total + duration.hours;
    }, 0);
  }

  private static calculateAverageHoursPerDay(schedules: any[]): number {
    const days = new Set(schedules.map((s) => s.dayOfWeek)).size;
    const totalHours = this.calculateTotalHours(schedules);
    return days > 0 ? parseFloat((totalHours / days).toFixed(1)) : 0;
  }
}
