/**
 * @file schedule.service.ts
 * @description Service amélioré pour la gestion des emplois du temps
 * @version 4.0.0
 */

import { PrismaClient, Prisma } from "../../generated/prisma";
import {
  Schedule,
  ApiResponse,
  ScheduleConflict,
  CreateScheduleData,
  UpdateScheduleData,
  GenerateTimetableData,
  ScheduleFilters,
  PaginationData,
  ScheduleError,
} from "../types/timetableTypes";

import prisma from "../prisma";

// Interfaces locales
interface TimeParseResult {
  time: string;
  date: Date;
}

interface DurationResult {
  minutes: number;
  hours: number;
  display: string;
}

interface GenerationConstraints {
  maxHoursPerDay?: number;
  breakTime?: { start: string; end: string };
  preferMorningSlots?: boolean;
  avoidConsecutiveSameSubject?: boolean;
}

interface AssignmentTracking {
  professorCounts: Map<string, number>; // professorId -> count per day
  classCounts: Map<string, number>; // classId -> count per day
  subjectCounts: Map<string, number>; // subjectId -> count per day
  roomAssignments: Map<string, string[]>; // day-slot -> rooms
}

/**
 * @class ScheduleService
 * @description Service amélioré pour la gestion des emplois du temps
 */
export class ScheduleService {
  // Constantes configurables
  private readonly config = {
    VALID_DAYS_OF_WEEK: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ] as const,
    VALID_STATUSES: ["ACTIVE", "INACTIVE", "CANCELLED"] as const,
    MAX_SCHEDULES_PER_PROFESSOR_PER_DAY: 6,
    MAX_SCHEDULES_PER_CLASS_PER_DAY: 8,
    MIN_SCHEDULE_DURATION_MINUTES: 30,
    MAX_SCHEDULE_DURATION_MINUTES: 240,
    MAX_CLASSROOM_LENGTH: 50,
    MAX_NOTES_LENGTH: 500,
    MAX_RECURRENCE_LENGTH: 100,
    MAX_PAGINATION_LIMIT: 100,
    DEFAULT_TIME_SLOTS: [
      { start: "08:00:00", end: "09:30:00" },
      { start: "09:45:00", end: "11:15:00" },
      { start: "11:30:00", end: "13:00:00" },
      { start: "14:00:00", end: "15:30:00" },
      { start: "15:45:00", end: "17:15:00" },
      { start: "17:30:00", end: "19:00:00" },
    ] as const,
  };

  constructor(private prismaClient: PrismaClient = prisma) {}

  // ==================== VALIDATION METHODS ====================

  private isValidDayOfWeek(
    day: string
  ): day is (typeof this.config.VALID_DAYS_OF_WEEK)[number] {
    return this.config.VALID_DAYS_OF_WEEK.includes(day as any);
  }

  private isValidStatus(
    status: string
  ): status is (typeof this.config.VALID_STATUSES)[number] {
    return this.config.VALID_STATUSES.includes(status as any);
  }

  private isValidId(id: string): boolean {
    return typeof id === "string" && id.trim().length > 0 && id.length <= 50;
  }

  private validateStringLength(
    value: string | null | undefined,
    maxLength: number,
    fieldName: string
  ): string | null {
    if (value === null || value === undefined) return null;

    const trimmed = typeof value === "string" ? value.trim() : String(value);

    if (trimmed.length > maxLength) {
      throw this.createError(
        400,
        `${fieldName}_TOO_LONG`,
        `${fieldName} ne peut pas dépasser ${maxLength} caractères`
      );
    }

    return trimmed || null;
  }

  private validateClassroom(
    classroom: string | null | undefined
  ): string | null {
    return this.validateStringLength(
      classroom,
      this.config.MAX_CLASSROOM_LENGTH,
      "Salle"
    );
  }

  private validateNotes(notes: string | null | undefined): string | null {
    return this.validateStringLength(
      notes,
      this.config.MAX_NOTES_LENGTH,
      "Notes"
    );
  }

  private validateRecurrence(
    recurrence: string | null | undefined
  ): string | null {
    return this.validateStringLength(
      recurrence,
      this.config.MAX_RECURRENCE_LENGTH,
      "Récurrence"
    );
  }

  // ==================== TIME PARSING METHODS ====================

  private parseTime(timeInput: string): TimeParseResult {
    try {
      const trimmedInput = timeInput.trim();
      let date: Date;

      // Format HH:MM ou HH:MM:SS
      if (trimmedInput.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const [hours, minutes, seconds = "00"] = trimmedInput.split(":");

        this.validateTimeComponents(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
        );

        date = new Date();
        date.setUTCHours(
          parseInt(hours.padStart(2, "0")),
          parseInt(minutes.padStart(2, "0")),
          parseInt(seconds.padStart(2, "0")),
          0
        );
      }
      // Format ISO
      else if (trimmedInput.includes("T")) {
        date = new Date(trimmedInput);
        if (isNaN(date.getTime())) {
          throw new Error("Format de timestamp ISO invalide");
        }
      }
      // Format inconnu
      else {
        throw new Error(`Format de temps non supporté: ${trimmedInput}`);
      }

      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");

      return {
        time: `${hours}:${minutes}:${seconds}`,
        date,
      };
    } catch (error: any) {
      throw this.createError(
        400,
        "INVALID_TIME_FORMAT",
        error.message || "Format de temps invalide",
        { timeInput }
      );
    }
  }

  private validateTimeComponents(
    hours: number,
    minutes: number,
    seconds: number
  ): void {
    const errors: string[] = [];

    if (hours < 0 || hours > 23)
      errors.push("Les heures doivent être entre 00 et 23");
    if (minutes < 0 || minutes > 59)
      errors.push("Les minutes doivent être entre 00 et 59");
    if (seconds < 0 || seconds > 59)
      errors.push("Les secondes doivent être entre 00 et 59");

    if (errors.length > 0) {
      throw this.createError(400, "INVALID_TIME_COMPONENTS", errors.join("; "));
    }
  }

  private formatTimeForDisplay(time: string): string {
    try {
      const { time: formattedTime } = this.parseTime(time);
      return formattedTime.substring(0, 5); // HH:MM
    } catch {
      return time.includes(":") ? time.substring(0, 5) : "00:00";
    }
  }

  // ==================== DURATION CALCULATION METHODS ====================

  private calculateDuration(
    startTime: string,
    endTime: string
  ): DurationResult {
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

  private validateDuration(startTime: string, endTime: string): number {
    const duration = this.calculateDuration(startTime, endTime);

    if (duration.minutes < this.config.MIN_SCHEDULE_DURATION_MINUTES) {
      throw this.createError(
        400,
        "MIN_DURATION_NOT_MET",
        `Durée minimale: ${this.config.MIN_SCHEDULE_DURATION_MINUTES} minutes`,
        { duration: duration.minutes }
      );
    }

    if (duration.minutes > this.config.MAX_SCHEDULE_DURATION_MINUTES) {
      throw this.createError(
        400,
        "MAX_DURATION_EXCEEDED",
        `Durée maximale: ${this.config.MAX_SCHEDULE_DURATION_MINUTES} minutes`,
        { duration: duration.minutes }
      );
    }

    return duration.minutes;
  }

  private calculateTotalHours(schedules: any[]): number {
    return schedules.reduce((total, schedule) => {
      const duration = this.calculateDuration(
        schedule.startTime,
        schedule.endTime
      );
      return total + duration.hours;
    }, 0);
  }

  private calculateAverageDuration(schedules: any[]): number {
    if (schedules.length === 0) return 0;
    const totalMinutes = schedules.reduce((total, schedule) => {
      const duration = this.calculateDuration(
        schedule.startTime,
        schedule.endTime
      );
      return total + duration.minutes;
    }, 0);
    return parseFloat((totalMinutes / schedules.length).toFixed(1));
  }

  // ==================== ERROR HANDLING ====================

  private createError(
    status: number,
    code: string,
    message: string,
    details?: any
  ): ScheduleError {
    return {
      status,
      code,
      message,
      details,
    };
  }

  private handleError(method: string, error: any): never {
    if (error?.code && error?.message) {
      // C'est déjà une erreur structurée
      throw error;
    }

    console.error(`Error in ${method}:`, error);

    // Gestion des erreurs spécifiques Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw this.createError(
            409,
            "DUPLICATE_ENTRY",
            "Une entrée similaire existe déjà",
            { field: error.meta?.target }
          );
        case "P2003":
          throw this.createError(
            400,
            "FOREIGN_KEY_VIOLATION",
            "Violation de contrainte de clé étrangère",
            { field: error.meta?.field_name }
          );
        case "P2025":
          throw this.createError(
            404,
            "RECORD_NOT_FOUND",
            "Enregistrement non trouvé"
          );
        default:
          throw this.createError(
            500,
            "DATABASE_ERROR",
            "Erreur de base de données",
            { code: error.code, message: error.message }
          );
      }
    }

    throw this.createError(
      error?.status || 500,
      error?.code || "INTERNAL_ERROR",
      error?.message || `Une erreur est survenue dans ${method}`,
      error?.details || error
    );
  }

  // ==================== CONFLICT CHECKING ====================

  async checkScheduleConflicts(
    professeurId: string,
    classId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    classroom?: string | null,
    excludeScheduleId?: string
  ): Promise<{ hasConflict: boolean; conflicts: ScheduleConflict[] }> {
    const conflicts: ScheduleConflict[] = [];

    try {
      // Validation des paramètres
      if (!this.isValidId(professeurId)) {
        throw this.createError(
          400,
          "INVALID_PROFESSEUR_ID",
          "ID professeur invalide"
        );
      }

      if (!this.isValidId(classId)) {
        throw this.createError(400, "INVALID_CLASS_ID", "ID classe invalide");
      }

      if (!this.isValidDayOfWeek(dayOfWeek)) {
        throw this.createError(
          400,
          "INVALID_DAY_OF_WEEK",
          "Jour de la semaine invalide"
        );
      }

      // Convertir les temps
      const { time: startTimeStr, date: startDate } = this.parseTime(startTime);
      const { time: endTimeStr, date: endDate } = this.parseTime(endTime);

      // Vérifier l'ordre des temps
      if (endDate <= startDate) {
        throw this.createError(
          400,
          "INVALID_TIME_RANGE",
          "L'heure de fin doit être après l'heure de début"
        );
      }

      // Vérifier la durée
      this.validateDuration(startTimeStr, endTimeStr);

      // Construire la condition WHERE pour les conflits
      const baseWhere: Prisma.ScheduleWhereInput = {
        dayOfWeek,
        status: "ACTIVE",
        AND: [
          { startTime: { lt: endTimeStr } },
          { endTime: { gt: startTimeStr } },
        ],
      };

      if (excludeScheduleId && this.isValidId(excludeScheduleId)) {
        baseWhere.id = { not: excludeScheduleId };
      }

      // Exécuter toutes les vérifications en parallèle
      const [
        professorConflicts,
        classConflicts,
        roomConflicts,
        professorInfo,
        classInfo,
      ] = await Promise.all([
        this.checkProfessorConflicts(professeurId, baseWhere),
        this.checkClassConflicts(classId, baseWhere),
        classroom && classroom.trim()
          ? this.checkRoomConflicts(classroom.trim(), baseWhere)
          : Promise.resolve([]),
        this.prismaClient.professeur.findUnique({
          where: { id: professeurId },
          select: { status: true, firstName: true, lastName: true },
        }),
        this.prismaClient.schoolClass.findUnique({
          where: { id: classId },
          select: { status: true, name: true, level: true },
        }),
      ]);

      // Ajouter les conflits
      if (professorConflicts.length > 0) {
        conflicts.push({
          type: "PROFESSEUR_CONFLICT",
          message: "Le professeur a déjà un cours à cet horaire",
          details: professorConflicts,
        });
      }

      if (classConflicts.length > 0) {
        conflicts.push({
          type: "CLASS_CONFLICT",
          message: "La classe a déjà un cours à cet horaire",
          details: classConflicts,
        });
      }

      if (roomConflicts.length > 0) {
        conflicts.push({
          type: "ROOM_CONFLICT",
          message: `La salle ${classroom} est déjà occupée`,
          details: roomConflicts,
        });
      }

      // Vérifier les statuts
      if (!professorInfo) {
        conflicts.push({
          type: "PROFESSEUR_NOT_FOUND",
          message: "Professeur non trouvé",
          details: [],
        });
      } else if (professorInfo.status !== "Actif") {
        conflicts.push({
          type: "PROFESSEUR_INACTIVE",
          message: "Le professeur n'est pas actif",
          details: [{ status: professorInfo.status }],
        });
      }

      if (!classInfo) {
        conflicts.push({
          type: "CLASS_NOT_FOUND",
          message: "Classe non trouvée",
          details: [],
        });
      } else if (classInfo.status !== "Active") {
        conflicts.push({
          type: "CLASS_INACTIVE",
          message: "La classe n'est pas active",
          details: [{ status: classInfo.status }],
        });
      }

      return {
        hasConflict: conflicts.length > 0,
        conflicts,
      };
    } catch (error: any) {
      // Si c'est une erreur de validation, la transformer en conflit
      if (error.code && error.code.includes("INVALID")) {
        conflicts.push({
          type: "VALIDATION_ERROR",
          message: error.message,
          details: [error],
        });
        return { hasConflict: true, conflicts };
      }

      // Pour les autres erreurs, les propager
      throw error;
    }
  }

  private async checkProfessorConflicts(
    professeurId: string,
    whereClause: Prisma.ScheduleWhereInput
  ): Promise<any[]> {
    const conflicts = await this.prismaClient.schedule.findMany({
      where: { ...whereClause, professeurId },
      include: {
        schoolClass: true,
        classAssignment: { include: { subject: true } },
      },
    });

    return conflicts.map((c) => ({
      id: c.id,
      subject: c.classAssignment?.subject?.name || "Inconnu",
      class: c.schoolClass?.name || "Inconnu",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
      classroom: c.classroom,
      dayOfWeek: c.dayOfWeek,
    }));
  }

  private async checkClassConflicts(
    classId: string,
    whereClause: Prisma.ScheduleWhereInput
  ): Promise<any[]> {
    const conflicts = await this.prismaClient.schedule.findMany({
      where: { ...whereClause, classId },
      include: {
        professeur: true,
        classAssignment: { include: { subject: true } },
      },
    });

    return conflicts.map((c) => ({
      id: c.id,
      subject: c.classAssignment?.subject?.name || "Inconnu",
      professor: c.professeur
        ? `${c.professeur.firstName} ${c.professeur.lastName}`
        : "Inconnu",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
      classroom: c.classroom,
      dayOfWeek: c.dayOfWeek,
    }));
  }

  private async checkRoomConflicts(
    classroom: string,
    whereClause: Prisma.ScheduleWhereInput
  ): Promise<any[]> {
    const conflicts = await this.prismaClient.schedule.findMany({
      where: { ...whereClause, classroom },
      include: {
        schoolClass: true,
        professeur: true,
      },
    });

    return conflicts.map((c) => ({
      id: c.id,
      class: c.schoolClass?.name || "Inconnu",
      professor: c.professeur
        ? `${c.professeur.firstName} ${c.professeur.lastName}`
        : "Inconnu",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
      dayOfWeek: c.dayOfWeek,
    }));
  }

  // ==================== CRUD OPERATIONS ====================

  async createSchedule(data: CreateScheduleData): Promise<ApiResponse> {
    return await this.prismaClient.$transaction(async (tx) => {
      try {
        // Validation des données
        const validatedData = this.validateCreateData(data);

        // Convertir les temps
        const { time: startTimeStr } = this.parseTime(validatedData.startTime);
        const { time: endTimeStr } = this.parseTime(validatedData.endTime);

        // Vérifier la durée
        this.validateDuration(startTimeStr, endTimeStr);

        // Vérifier l'assignation et la classe
        const [assignment, schoolClass] = await Promise.all([
          tx.classAssignment.findUnique({
            where: { id: validatedData.assignmentId },
            include: { professeur: true, subject: true, academicYear: true },
          }),
          tx.schoolClass.findUnique({
            where: { id: validatedData.classId },
          }),
        ]);

        if (!assignment) {
          throw this.createError(
            404,
            "ASSIGNMENT_NOT_FOUND",
            "Assignation non trouvée"
          );
        }

        if (!schoolClass) {
          throw this.createError(404, "CLASS_NOT_FOUND", "Classe non trouvée");
        }

        if (!assignment.professeurId || !assignment.professeur) {
          throw this.createError(
            400,
            "NO_PROFESSEUR_ASSIGNED",
            "Cette assignation n'a pas encore de professeur affecté"
          );
        }

        // Vérifier la correspondance des niveaux
        if (schoolClass.level !== assignment.classLevel) {
          throw this.createError(
            400,
            "CLASS_LEVEL_MISMATCH",
            "Le niveau de la classe ne correspond pas à l'assignation"
          );
        }

        // Vérifier la correspondance de la section (si l'assignation est limitée à une section)
        if (
          assignment.schoolClassId &&
          assignment.schoolClassId !== validatedData.classId
        ) {
          throw this.createError(
            400,
            "SCHOOL_CLASS_MISMATCH",
            "Cette assignation est réservée à une autre section"
          );
        }

        // Vérifier les conflits AVANT de créer
        const conflictCheck = await this.checkScheduleConflicts(
          assignment.professeurId,
          validatedData.classId,
          validatedData.dayOfWeek,
          validatedData.startTime,
          validatedData.endTime,
          validatedData.classroom
        );

        if (conflictCheck.hasConflict) {
          throw this.createError(
            409,
            "SCHEDULE_CONFLICT",
            "Conflit d'horaire détecté",
            {
              conflicts: conflictCheck.conflicts,
              message: this.formatConflictMessage(conflictCheck.conflicts),
            }
          );
        }

        // Gérer la date de fin de récurrence
        let untilDateValue = null;
        if (validatedData.untilDate) {
          const untilDate = new Date(validatedData.untilDate);
          if (untilDate < new Date()) {
            throw this.createError(
              400,
              "INVALID_UNTIL_DATE",
              "La date de fin de récurrence est dans le passé"
            );
          }
          untilDateValue = untilDate;
        }

        // Créer l'horaire
        const schedule = await tx.schedule.create({
          data: {
            assignmentId: validatedData.assignmentId,
            classId: validatedData.classId,
            professeurId: assignment.professeurId,
            dayOfWeek: validatedData.dayOfWeek,
            startTime: startTimeStr,
            endTime: endTimeStr,
            classroom: validatedData.classroom,
            recurrence: validatedData.recurrence,
            untilDate: untilDateValue,
            notes: validatedData.notes,
            status: "ACTIVE",
          },
          include: this.getScheduleIncludes(),
        });

        // Calculer la durée
        const duration = this.calculateDuration(startTimeStr, endTimeStr);

        return {
          success: true,
          message: "Horaire créé avec succès",
          data: { schedule },
          metadata: {
            duration: duration.display,
            professor: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
            subject: assignment.subject.name,
            class: schoolClass.name,
            dayOfWeek: validatedData.dayOfWeek,
            timeRange: `${this.formatTimeForDisplay(startTimeStr)} - ${this.formatTimeForDisplay(endTimeStr)}`,
            createdAt: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        throw this.handleError("createSchedule", error);
      }
    });
  }

  private formatConflictMessage(conflicts: ScheduleConflict[]): string {
    const messages: string[] = [];

    conflicts.forEach((conflict) => {
      if (conflict.type === "PROFESSEUR_CONFLICT") {
        messages.push("Le professeur a déjà un cours à cet horaire");
      } else if (conflict.type === "CLASS_CONFLICT") {
        messages.push("La classe a déjà un cours à cet horaire");
      } else if (conflict.type === "ROOM_CONFLICT") {
        messages.push("La salle est déjà occupée");
      } else if (conflict.type === "PROFESSEUR_INACTIVE") {
        messages.push("Le professeur n'est pas actif");
      } else if (conflict.type === "CLASS_INACTIVE") {
        messages.push("La classe n'est pas active");
      } else {
        messages.push(conflict.message);
      }
    });

    return messages.join("; ");
  }

  private validateCreateData(data: CreateScheduleData): CreateScheduleData {
    const requiredFields = [
      "assignmentId",
      "classId",
      "dayOfWeek",
      "startTime",
      "endTime",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof CreateScheduleData]) {
        throw this.createError(
          400,
          "MISSING_DATA",
          `Champ requis manquant: ${field}`
        );
      }
    }

    if (!this.isValidDayOfWeek(data.dayOfWeek)) {
      throw this.createError(
        400,
        "INVALID_DAY_OF_WEEK",
        "Jour de la semaine invalide"
      );
    }

    return {
      ...data,
      classroom: this.validateClassroom(data.classroom) ?? undefined,
      notes: this.validateNotes(data.notes) ?? undefined,
      recurrence: this.validateRecurrence(data.recurrence) ?? undefined,
    };
  }

  async updateSchedule(
    id: string,
    data: UpdateScheduleData
  ): Promise<ApiResponse> {
    return await this.prismaClient.$transaction(async (tx) => {
      try {
        if (!this.isValidId(id)) {
          throw this.createError(
            400,
            "INVALID_ID_FORMAT",
            "Format d'ID invalide"
          );
        }

        // Récupérer l'horaire existant
        const existingSchedule = await tx.schedule.findUnique({
          where: { id },
          include: {
            classAssignment: { include: { professeur: true, subject: true } },
            schoolClass: true,
          },
        });

        if (!existingSchedule) {
          throw this.createError(
            404,
            "SCHEDULE_NOT_FOUND",
            "Horaire non trouvé"
          );
        }

        // Valider les données de mise à jour
        const validatedData = this.validateUpdateData(data);

        // Préparer les temps
        let startTimeStr = existingSchedule.startTime;
        let endTimeStr = existingSchedule.endTime;
        let dayOfWeek = existingSchedule.dayOfWeek;

        if (validatedData.startTime) {
          startTimeStr = this.parseTime(validatedData.startTime).time;
        }

        if (validatedData.endTime) {
          endTimeStr = this.parseTime(validatedData.endTime).time;
        }

        if (validatedData.dayOfWeek) {
          dayOfWeek = validatedData.dayOfWeek;
        }

        // Vérifier la durée
        this.validateDuration(startTimeStr, endTimeStr);

        // Vérifier les conflits (sauf avec lui-même)
        const classroom =
          validatedData.classroom !== undefined
            ? validatedData.classroom
            : existingSchedule.classroom;

        const conflictCheck = await this.checkScheduleConflicts(
          existingSchedule.professeurId,
          existingSchedule.classId,
          dayOfWeek,
          startTimeStr,
          endTimeStr,
          classroom,
          id
        );

        if (conflictCheck.hasConflict) {
          throw this.createError(
            409,
            "SCHEDULE_CONFLICT",
            "Conflit d'horaire détecté lors de la mise à jour",
            {
              conflicts: conflictCheck.conflicts,
              message: this.formatConflictMessage(conflictCheck.conflicts),
            }
          );
        }

        // Vérifier la date de fin de récurrence
        let untilDateValue = existingSchedule.untilDate;
        if (validatedData.untilDate) {
          const untilDate = new Date(validatedData.untilDate);
          if (untilDate < new Date()) {
            throw this.createError(
              400,
              "INVALID_UNTIL_DATE",
              "La date de fin de récurrence est dans le passé"
            );
          }
          untilDateValue = untilDate;
        }

        // Préparer les données de mise à jour
        const updateData: Prisma.ScheduleUpdateInput = {
          dayOfWeek: dayOfWeek,
          startTime: startTimeStr,
          endTime: endTimeStr,
          classroom: classroom ? this.validateClassroom(classroom) : null,
          recurrence:
            validatedData.recurrence !== undefined
              ? this.validateRecurrence(validatedData.recurrence)
              : existingSchedule.recurrence,
          untilDate: untilDateValue,
          notes:
            validatedData.notes !== undefined
              ? this.validateNotes(validatedData.notes)
              : existingSchedule.notes,
          status: validatedData.status || existingSchedule.status,
          updatedAt: new Date(),
        };

        // Identifier les champs modifiés
        const changes = Object.keys(validatedData).filter(
          (key) => validatedData[key as keyof UpdateScheduleData] !== undefined
        );

        // Mettre à jour l'horaire
        const schedule = await tx.schedule.update({
          where: { id },
          data: updateData,
          include: this.getScheduleIncludes(),
        });

        const duration = this.calculateDuration(startTimeStr, endTimeStr);

        return {
          success: true,
          message:
            changes.length > 0
              ? "Horaire mis à jour avec succès"
              : "Aucun changement effectué",
          data: { schedule },
          metadata: {
            changes,
            duration: duration.display,
            previousStatus: existingSchedule.status,
            newStatus: schedule.status,
            updatedAt: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        throw this.handleError("updateSchedule", error);
      }
    });
  }

  private validateUpdateData(data: UpdateScheduleData): UpdateScheduleData {
    const validated: any = {};

    if (data.dayOfWeek !== undefined) {
      if (!this.isValidDayOfWeek(data.dayOfWeek)) {
        throw this.createError(
          400,
          "INVALID_DAY_OF_WEEK",
          "Jour de la semaine invalide"
        );
      }
      validated.dayOfWeek = data.dayOfWeek;
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        throw this.createError(400, "INVALID_STATUS", "Statut invalide");
      }
      validated.status = data.status;
    }

    validated.classroom = this.validateClassroom(data.classroom);
    validated.notes = this.validateNotes(data.notes);
    validated.recurrence = this.validateRecurrence(data.recurrence);

    if (data.startTime !== undefined) validated.startTime = data.startTime;
    if (data.endTime !== undefined) validated.endTime = data.endTime;
    if (data.untilDate !== undefined) validated.untilDate = data.untilDate;

    return validated;
  }

  private getScheduleIncludes() {
    return {
      classAssignment: {
        include: {
          subject: true,
          professeur: true,
          academicYear: true,
        },
      },
      schoolClass: true,
      professeur: true,
    };
  }

  // ==================== QUERY METHODS ====================

  async getAllSchedules(filters: ScheduleFilters): Promise<ApiResponse> {
    try {
      const { page = 1, limit = 20, ...filterParams } = filters;

      // Validation de la pagination
      const pageNum = Math.max(1, parseInt(page.toString()));
      let limitNum = Math.max(1, parseInt(limit.toString()));

      if (limitNum > this.config.MAX_PAGINATION_LIMIT) {
        limitNum = this.config.MAX_PAGINATION_LIMIT;
      }

      const skip = (pageNum - 1) * limitNum;

      // Construire la clause WHERE
      const where = this.buildWhereClause(filterParams);

      // Exécuter les requêtes en parallèle
      const [schedules, total] = await Promise.all([
        this.prismaClient.schedule.findMany({
          where,
          include: this.getScheduleIncludes(),
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          skip,
          take: limitNum,
        }),
        this.prismaClient.schedule.count({ where }),
      ]);

      // Formater les résultats
      const formattedSchedules = schedules.map((schedule) => ({
        ...schedule,
        displayStartTime: this.formatTimeForDisplay(schedule.startTime),
        displayEndTime: this.formatTimeForDisplay(schedule.endTime),
        duration: this.calculateDuration(schedule.startTime, schedule.endTime),
      }));

      // Calculer les statistiques
      const statusCounts = this.calculateStatusCounts(schedules);

      return {
        success: true,
        message: "Horaires récupérés avec succès",
        data: {
          schedules: formattedSchedules,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
        metadata: {
          filters: filterParams,
          counts: statusCounts,
          totalHours: this.calculateTotalHours(formattedSchedules),
          averageDuration: this.calculateAverageDuration(formattedSchedules),
        },
      };
    } catch (error: any) {
      throw this.handleError("getAllSchedules", error);
    }
  }

  private buildWhereClause(filters: any): Prisma.ScheduleWhereInput {
    const where: Prisma.ScheduleWhereInput = {};

    if (filters.status && this.isValidStatus(filters.status)) {
      where.status = filters.status;
    } else if (filters.status) {
      throw this.createError(
        400,
        "INVALID_STATUS",
        "Valeur de statut invalide"
      );
    }

    if (filters.classId && this.isValidId(filters.classId)) {
      where.classId = filters.classId;
    }

    if (filters.professeurId && this.isValidId(filters.professeurId)) {
      where.professeurId = filters.professeurId;
    }

    if (filters.dayOfWeek && this.isValidDayOfWeek(filters.dayOfWeek)) {
      where.dayOfWeek = filters.dayOfWeek;
    } else if (filters.dayOfWeek) {
      throw this.createError(
        400,
        "INVALID_DAY_OF_WEEK",
        "Jour de la semaine invalide"
      );
    }

    if (filters.classroom) {
      where.classroom = { contains: filters.classroom };
    }

    // Recherche textuelle
    if (filters.search) {
      where.OR = [
        {
          classAssignment: {
            subject: {
              OR: [
                { name: { contains: filters.search } },
                { code: { contains: filters.search } },
              ],
            },
          },
        },
        {
          professeur: {
            OR: [
              { firstName: { contains: filters.search } },
              { lastName: { contains: filters.search } },
            ],
          },
        },
        { schoolClass: { name: { contains: filters.search } } },
        { classroom: { contains: filters.search } },
      ];
    }

    // Filtre par année académique
    if (filters.academicYearId && this.isValidId(filters.academicYearId)) {
      where.classAssignment = { academicYearId: filters.academicYearId };
    }

    return where;
  }

  private calculateStatusCounts(schedules: any[]) {
    const counts = { ACTIVE: 0, INACTIVE: 0, CANCELLED: 0 };

    schedules.forEach((schedule) => {
      if (this.isValidStatus(schedule.status)) {
        counts[schedule.status as keyof typeof counts]++;
      }
    });

    return counts;
  }

  async getScheduleById(id: string): Promise<ApiResponse> {
    try {
      if (!this.isValidId(id)) {
        throw this.createError(
          400,
          "INVALID_ID_FORMAT",
          "Format d'ID invalide"
        );
      }

      const schedule = await this.prismaClient.schedule.findUnique({
        where: { id },
        include: this.getScheduleIncludes(),
      });

      if (!schedule) {
        throw this.createError(404, "SCHEDULE_NOT_FOUND", "Horaire non trouvé");
      }

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
          duration: formattedSchedule.duration.display,
          subject: schedule.classAssignment?.subject?.name || "Inconnu",
          professor: schedule.professeur
            ? `${schedule.professeur.firstName} ${schedule.professeur.lastName}`
            : "Inconnu",
          class: schedule.schoolClass?.name || "Inconnu",
        },
      };
    } catch (error: any) {
      throw this.handleError("getScheduleById", error);
    }
  }

  // ==================== DELETE METHOD ====================

  async deleteSchedule(id: string): Promise<ApiResponse> {
    return await this.prismaClient.$transaction(async (tx) => {
      try {
        if (!this.isValidId(id)) {
          throw this.createError(
            400,
            "INVALID_ID_FORMAT",
            "Format d'ID invalide"
          );
        }

        const schedule = await tx.schedule.findUnique({
          where: { id },
          include: {
            classAssignment: { include: { subject: true } },
            schoolClass: true,
          },
        });

        if (!schedule) {
          throw this.createError(
            404,
            "SCHEDULE_NOT_FOUND",
            "Horaire non trouvé"
          );
        }

        await tx.schedule.delete({ where: { id } });

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
        throw this.handleError("deleteSchedule", error);
      }
    });
  }

  // ==================== OTHER METHODS (abrégées pour la clarté) ====================

  async getClassTimetable(
    classId: string,
    academicYearId?: string
  ): Promise<ApiResponse> {
    try {
      if (!this.isValidId(classId)) {
        throw this.createError(400, "INVALID_CLASS_ID", "ID classe invalide");
      }

      // Construire la clause WHERE
      const where: Prisma.ScheduleWhereInput = {
        classId,
        status: "ACTIVE",
      };

      if (academicYearId && this.isValidId(academicYearId)) {
        where.classAssignment = { academicYearId };
      }

      // Récupérer les horaires
      const schedules = await this.prismaClient.schedule.findMany({
        where,
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          schoolClass: {
            select: { id: true, name: true, level: true, capacity: true },
          },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      // Organiser par jour
      const timetableByDay = this.organizeSchedulesByDay(schedules);

      // Calculer les statistiques
      const statistics = this.calculateTimetableStatistics(timetableByDay);

      return {
        success: true,
        message: "Emploi du temps récupéré avec succès",
        data: {
          classId,
          timetable: timetableByDay,
          schedules,
          ...statistics,
        },
        metadata: {
          classId,
          academicYearId,
          generationDate: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      throw this.handleError("getClassTimetable", error);
    }
  }

  private organizeSchedulesByDay(schedules: any[]): Record<string, any[]> {
    const timetableByDay: Record<string, any[]> = {};

    // Initialiser tous les jours
    this.config.VALID_DAYS_OF_WEEK.forEach((day) => {
      timetableByDay[day] = [];
    });

    // Organiser les horaires par jour
    schedules.forEach((schedule) => {
      const day = schedule.dayOfWeek;
      if (timetableByDay[day]) {
        timetableByDay[day].push({
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

    // Trier chaque jour par heure de début
    Object.values(timetableByDay).forEach((daySchedules) => {
      daySchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return timetableByDay;
  }

  private calculateTimetableStatistics(timetableByDay: Record<string, any[]>) {
    const weekSummary: Record<string, { count: number; hours: number }> = {};
    let totalHours = 0;

    Object.entries(timetableByDay).forEach(([day, schedules]) => {
      const dayHours = schedules.reduce((total, schedule) => {
        return total + (schedule.duration?.hours || 0);
      }, 0);

      weekSummary[day] = {
        count: schedules.length,
        hours: parseFloat(dayHours.toFixed(1)),
      };

      totalHours += dayHours;
    });

    const daysWithSchedules = Object.values(timetableByDay).filter(
      (schedules) => schedules.length > 0
    ).length;

    return {
      weekSummary,
      totalHours: parseFloat(totalHours.toFixed(1)),
      averageDailyHours:
        daysWithSchedules > 0
          ? parseFloat((totalHours / daysWithSchedules).toFixed(1))
          : 0,
      daysWithSchedules,
      totalSchedules: Object.values(timetableByDay).reduce(
        (total, schedules) => total + schedules.length,
        0
      ),
    };
  }
}
