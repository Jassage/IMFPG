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
        `${fieldName} cannot exceed ${maxLength} characters`
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
      "Classroom"
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
      "Recurrence"
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
          throw new Error("Invalid ISO timestamp");
        }
      }
      // Format inconnu
      else {
        throw new Error(`Unsupported time format: ${trimmedInput}`);
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
        error.message || "Invalid time format",
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

    if (hours < 0 || hours > 23) errors.push("Hours must be between 00 and 23");
    if (minutes < 0 || minutes > 59)
      errors.push("Minutes must be between 00 and 59");
    if (seconds < 0 || seconds > 59)
      errors.push("Seconds must be between 00 and 59");

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

  private checkTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const toMinutes = (time: string): number => {
      const [hours = 0, minutes = 0, seconds = 0] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    return s1 < e2 && e1 > s2;
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
        `Minimum duration: ${this.config.MIN_SCHEDULE_DURATION_MINUTES} minutes`,
        { duration: duration.minutes }
      );
    }

    if (duration.minutes > this.config.MAX_SCHEDULE_DURATION_MINUTES) {
      throw this.createError(
        400,
        "MAX_DURATION_EXCEEDED",
        `Maximum duration: ${this.config.MAX_SCHEDULE_DURATION_MINUTES} minutes`,
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

    throw this.createError(
      error?.status || 500,
      error?.code || "INTERNAL_ERROR",
      error?.message || `An error occurred in ${method}`,
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
          "Invalid professor ID"
        );
      }

      if (!this.isValidId(classId)) {
        throw this.createError(400, "INVALID_CLASS_ID", "Invalid class ID");
      }

      if (!this.isValidDayOfWeek(dayOfWeek)) {
        throw this.createError(
          400,
          "INVALID_DAY_OF_WEEK",
          "Invalid day of week"
        );
      }

      // Convertir les temps
      const { time: startTimeStr, date: startDate } = this.parseTime(startTime);
      const { time: endTimeStr, date: endDate } = this.parseTime(endTime);

      // Vérifier l'ordre des temps
      if (endDate <= startDate) {
        conflicts.push({
          type: "INVALID_TIME_RANGE",
          message: "End time must be after start time",
          details: [],
        });
        return { hasConflict: true, conflicts };
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
        classroom
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
          message: "Professor already has a class scheduled at this time",
          details: professorConflicts,
        });
      }

      if (classConflicts.length > 0) {
        conflicts.push({
          type: "CLASS_CONFLICT",
          message: "Class already has a class scheduled at this time",
          details: classConflicts,
        });
      }

      if (roomConflicts.length > 0) {
        conflicts.push({
          type: "ROOM_CONFLICT",
          message: `Classroom ${classroom} is already occupied`,
          details: roomConflicts,
        });
      }

      // Vérifier les statuts
      if (!professorInfo) {
        conflicts.push({
          type: "PROFESSEUR_NOT_FOUND",
          message: "Professor not found",
          details: [],
        });
      } else if (professorInfo.status !== "Actif") {
        conflicts.push({
          type: "PROFESSEUR_INACTIVE",
          message: "Professor is not active",
          details: [{ status: professorInfo.status }],
        });
      }

      if (!classInfo) {
        conflicts.push({
          type: "CLASS_NOT_FOUND",
          message: "Class not found",
          details: [],
        });
      } else if (classInfo.status !== "Active") {
        conflicts.push({
          type: "CLASS_INACTIVE",
          message: "Class is not active",
          details: [{ status: classInfo.status }],
        });
      }

      return {
        hasConflict: conflicts.length > 0,
        conflicts,
      };
    } catch (error: any) {
      conflicts.push({
        type: "VALIDATION_ERROR",
        message: error.message || "Error checking for conflicts",
        details: [error],
      });
      return { hasConflict: true, conflicts };
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
      subject: c.classAssignment?.subject?.name || "Unknown",
      class: c.schoolClass?.name || "Unknown",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
      classroom: c.classroom,
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
      subject: c.classAssignment?.subject?.name || "Unknown",
      professor: c.professeur
        ? `${c.professeur.firstName} ${c.professeur.lastName}`
        : "Unknown",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
      classroom: c.classroom,
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
      class: c.schoolClass?.name || "Unknown",
      professor: c.professeur
        ? `${c.professeur.firstName} ${c.professeur.lastName}`
        : "Unknown",
      startTime: this.formatTimeForDisplay(c.startTime),
      endTime: this.formatTimeForDisplay(c.endTime),
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
            "Assignment not found"
          );
        }

        if (!schoolClass) {
          throw this.createError(404, "CLASS_NOT_FOUND", "Class not found");
        }

        // Vérifier la correspondance des niveaux
        if (schoolClass.level !== assignment.classLevel) {
          throw this.createError(
            400,
            "CLASS_LEVEL_MISMATCH",
            "Class level does not match assignment level"
          );
        }

        // Vérifier les conflits
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
            "Schedule conflict detected",
            conflictCheck
          );
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
            untilDate: validatedData.untilDate
              ? new Date(validatedData.untilDate)
              : null,
            notes: validatedData.notes,
            status: "ACTIVE",
          },
          include: this.getScheduleIncludes(),
        });

        // Calculer la durée
        const duration = this.calculateDuration(startTimeStr, endTimeStr);

        return {
          success: true,
          message: "Schedule created successfully",
          data: { schedule },
          metadata: {
            duration: duration.display,
            professor: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
            subject: assignment.subject.name,
            class: schoolClass.name,
            createdAt: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        return this.handleError("createSchedule", error);
      }
    });
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
          `Missing required field: ${field}`
        );
      }
    }

    if (!this.isValidDayOfWeek(data.dayOfWeek)) {
      throw this.createError(400, "INVALID_DAY_OF_WEEK", "Invalid day of week");
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
          throw this.createError(400, "INVALID_ID_FORMAT", "Invalid ID format");
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
            "Schedule not found"
          );
        }

        // Valider les données de mise à jour
        const validatedData = this.validateUpdateData(data);

        // Préparer les temps
        let startTimeStr = existingSchedule.startTime;
        let endTimeStr = existingSchedule.endTime;

        if (validatedData.startTime) {
          startTimeStr = this.parseTime(validatedData.startTime).time;
        }

        if (validatedData.endTime) {
          endTimeStr = this.parseTime(validatedData.endTime).time;
        }

        // Vérifier la durée
        this.validateDuration(startTimeStr, endTimeStr);

        // Vérifier les conflits (sauf avec lui-même)
        if (
          validatedData.dayOfWeek ||
          validatedData.startTime ||
          validatedData.endTime
        ) {
          const conflictCheck = await this.checkScheduleConflicts(
            existingSchedule.professeurId,
            existingSchedule.classId,
            validatedData.dayOfWeek || existingSchedule.dayOfWeek,
            validatedData.startTime ||
              `2000-01-01T${existingSchedule.startTime}Z`,
            validatedData.endTime || `2000-01-01T${existingSchedule.endTime}Z`,
            validatedData.classroom !== undefined
              ? validatedData.classroom
              : existingSchedule.classroom,
            id
          );

          if (conflictCheck.hasConflict) {
            throw this.createError(
              409,
              "SCHEDULE_CONFLICT",
              "Schedule conflict detected",
              { conflicts: conflictCheck.conflicts }
            );
          }
        }

        // Vérifier la date de fin de récurrence
        if (
          validatedData.untilDate &&
          new Date(validatedData.untilDate) < new Date()
        ) {
          throw this.createError(
            400,
            "INVALID_UNTIL_DATE",
            "Recurrence end date is in the past"
          );
        }

        // Préparer les données de mise à jour
        const updateData: Prisma.ScheduleUpdateInput = {
          dayOfWeek: validatedData.dayOfWeek || existingSchedule.dayOfWeek,
          startTime: startTimeStr,
          endTime: endTimeStr,
          classroom:
            validatedData.classroom !== undefined
              ? this.validateClassroom(validatedData.classroom)
              : existingSchedule.classroom,
          recurrence:
            validatedData.recurrence !== undefined
              ? this.validateRecurrence(validatedData.recurrence)
              : existingSchedule.recurrence,
          untilDate: validatedData.untilDate
            ? new Date(validatedData.untilDate)
            : existingSchedule.untilDate,
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
              ? "Schedule updated successfully"
              : "No changes made",
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
        return this.handleError("updateSchedule", error);
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
          "Invalid day of week"
        );
      }
      validated.dayOfWeek = data.dayOfWeek;
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        throw this.createError(400, "INVALID_STATUS", "Invalid status");
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
        message: "Schedules retrieved successfully",
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
      return this.handleError("getAllSchedules", error);
    }
  }

  private buildWhereClause(filters: any): Prisma.ScheduleWhereInput {
    const where: Prisma.ScheduleWhereInput = {};

    if (filters.status && this.isValidStatus(filters.status)) {
      where.status = filters.status;
    } else if (filters.status) {
      throw this.createError(400, "INVALID_STATUS", "Invalid status value");
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
      throw this.createError(400, "INVALID_DAY_OF_WEEK", "Invalid day of week");
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
        throw this.createError(400, "INVALID_ID_FORMAT", "Invalid ID format");
      }

      const schedule = await this.prismaClient.schedule.findUnique({
        where: { id },
        include: this.getScheduleIncludes(),
      });

      if (!schedule) {
        throw this.createError(404, "SCHEDULE_NOT_FOUND", "Schedule not found");
      }

      const formattedSchedule = {
        ...schedule,
        displayStartTime: this.formatTimeForDisplay(schedule.startTime),
        displayEndTime: this.formatTimeForDisplay(schedule.endTime),
        duration: this.calculateDuration(schedule.startTime, schedule.endTime),
      };

      return {
        success: true,
        message: "Schedule retrieved successfully",
        data: { schedule: formattedSchedule },
        metadata: {
          duration: formattedSchedule.duration.display,
          subject: schedule.classAssignment?.subject?.name || "Unknown",
          professor: schedule.professeur
            ? `${schedule.professeur.firstName} ${schedule.professeur.lastName}`
            : "Unknown",
          class: schedule.schoolClass?.name || "Unknown",
        },
      };
    } catch (error: any) {
      return this.handleError("getScheduleById", error);
    }
  }

  // ==================== TIMETABLE METHODS ====================

  async getClassTimetable(
    classId: string,
    academicYearId?: string
  ): Promise<ApiResponse> {
    try {
      if (!this.isValidId(classId)) {
        throw this.createError(400, "INVALID_CLASS_ID", "Invalid class ID");
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
        message: "Timetable retrieved successfully",
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
      return this.handleError("getClassTimetable", error);
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

  // ==================== GENERATION METHODS ====================

  async generateTimetable(data: GenerateTimetableData): Promise<ApiResponse> {
    return await this.prismaClient.$transaction(async (tx) => {
      try {
        const { classId, academicYearId, constraints } = data;

        // Validation des paramètres
        if (!this.isValidId(classId)) {
          throw this.createError(400, "INVALID_CLASS_ID", "Invalid class ID");
        }

        if (!this.isValidId(academicYearId)) {
          throw this.createError(
            400,
            "INVALID_ACADEMIC_YEAR_ID",
            "Invalid academic year ID"
          );
        }

        // Récupérer la classe et les assignations
        const [schoolClass, assignments] = await Promise.all([
          tx.schoolClass.findUnique({ where: { id: classId } }),
          this.getAssignmentsForGeneration(tx, classId, academicYearId),
        ]);

        if (!schoolClass) {
          throw this.createError(404, "CLASS_NOT_FOUND", "Class not found");
        }

        if (schoolClass.status !== "Active") {
          throw this.createError(400, "CLASS_INACTIVE", "Class is not active");
        }

        if (assignments.length === 0) {
          throw this.createError(
            404,
            "NO_ASSIGNMENTS",
            "No assignments found for this class"
          );
        }

        // Générer l'emploi du temps
        const { schedules, errors } =
          await this.generateTimetableForAssignments(
            tx,
            assignments,
            classId,
            schoolClass.level,
            constraints || {}
          );

        // Calculer les statistiques
        const statistics = this.calculateGenerationStatistics(
          schedules,
          assignments.length,
          errors.length
        );

        return {
          success: true,
          message: `Timetable generated with ${schedules.length} schedules out of ${assignments.length} assignments`,
          data: {
            schedules,
            errors,
            statistics,
          },
          metadata: {
            classId,
            className: schoolClass.name,
            level: schoolClass.level,
            academicYearId,
            generationDate: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        return this.handleError("generateTimetable", error);
      }
    });
  }

  private async getAssignmentsForGeneration(
    tx: Prisma.TransactionClient,
    classId: string,
    academicYearId: string
  ) {
    const schoolClass = await tx.schoolClass.findUnique({
      where: { id: classId },
    });

    if (!schoolClass) {
      throw this.createError(404, "CLASS_NOT_FOUND", "Class not found");
    }

    return tx.classAssignment.findMany({
      where: {
        classLevel: schoolClass.level,
        academicYearId,
        status: "Active",
        professeur: { status: "Actif" },
      },
      include: {
        subject: true,
        professeur: true,
      },
    });
  }

  private async generateTimetableForAssignments(
    tx: Prisma.TransactionClient,
    assignments: any[],
    classId: string,
    classLevel: string,
    constraints: GenerationConstraints
  ) {
    const schedules = [];
    const errors = [];
    const tracking: AssignmentTracking = {
      professorCounts: new Map(),
      classCounts: new Map(),
      subjectCounts: new Map(),
      roomAssignments: new Map(),
    };

    // Trier par importance (coefficient)
    const sortedAssignments = [...assignments].sort(
      (a, b) => (b.subject?.coefficient || 0) - (a.subject?.coefficient || 0)
    );

    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    for (const assignment of sortedAssignments) {
      let placed = false;

      for (const day of daysOfWeek) {
        if (placed) break;

        for (const slot of this.config.DEFAULT_TIME_SLOTS) {
          if (placed) break;

          // Vérifier les contraintes
          if (
            !this.isSlotAvailableForAssignment(
              slot,
              day,
              constraints,
              tracking,
              assignment
            )
          ) {
            continue;
          }

          try {
            // Vérifier les conflits
            const conflictCheck = await this.checkScheduleConflicts(
              assignment.professeurId,
              classId,
              day,
              `2000-01-01T${slot.start}Z`,
              `2000-01-01T${slot.end}Z`
            );

            if (!conflictCheck.hasConflict) {
              // Créer le schedule
              const schedule = await tx.schedule.create({
                data: {
                  assignmentId: assignment.id,
                  classId,
                  professeurId: assignment.professeurId,
                  dayOfWeek: day,
                  startTime: slot.start,
                  endTime: slot.end,
                  classroom: this.getAvailableClassroom(
                    day,
                    slot.start,
                    tracking
                  ),
                  status: "ACTIVE",
                  notes: "Automatically generated",
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

              schedules.push(schedule);
              placed = true;

              // Mettre à jour le tracking
              this.updateTracking(
                tracking,
                assignment,
                day,
                slot,
                schedule.classroom || "Unassigned"
              );
            }
          } catch (error) {
            // Continuer avec le prochain slot
            continue;
          }
        }
      }

      if (!placed) {
        errors.push({
          assignmentId: assignment.id,
          subject: assignment.subject.name,
          professor: `${assignment.professeur.firstName} ${assignment.professeur.lastName}`,
          message:
            "Could not place this assignment - all slots are occupied or constrained",
        });
      }
    }

    return { schedules, errors };
  }

  private isSlotAvailableForAssignment(
    slot: { start: string; end: string },
    day: string,
    constraints: GenerationConstraints,
    tracking: AssignmentTracking,
    assignment: any
  ): boolean {
    // Vérifier la pause
    if (constraints.breakTime) {
      const slotStartHour = parseInt(slot.start.split(":")[0]);
      const breakStartHour = parseInt(
        constraints.breakTime.start.split(":")[0]
      );
      const breakEndHour = parseInt(constraints.breakTime.end.split(":")[0]);

      if (slotStartHour >= breakStartHour && slotStartHour < breakEndHour) {
        return false;
      }
    }

    // Préférence pour les créneaux du matin
    if (
      constraints.preferMorningSlots !== false &&
      parseInt(slot.start.split(":")[0]) >= 14
    ) {
      return false;
    }

    // Vérifier les limites du professeur
    const professorKey = `${assignment.professeurId}-${day}`;
    const professorCount = tracking.professorCounts.get(professorKey) || 0;

    if (professorCount >= this.config.MAX_SCHEDULES_PER_PROFESSOR_PER_DAY) {
      return false;
    }

    // Vérifier les matières consécutives
    if (constraints.avoidConsecutiveSameSubject !== false) {
      const subjectKey = `${assignment.subjectId}-${day}`;
      const subjectCount = tracking.subjectCounts.get(subjectKey) || 0;

      if (subjectCount > 0) {
        return false;
      }
    }

    return true;
  }

  private getAvailableClassroom(
    day: string,
    startTime: string,
    tracking: AssignmentTracking
  ): string {
    const availableClassrooms = [
      "A101",
      "A102",
      "A103",
      "A104",
      "B201",
      "B202",
      "B203",
      "B204",
      "C301",
      "C302",
      "C303",
      "C304",
      "D401",
      "D402",
      "D403",
      "D404",
      "E501",
      "E502",
      "E503",
      "E504",
    ];

    const key = `${day}-${startTime}`;
    const occupiedRooms = tracking.roomAssignments.get(key) || [];

    const availableRoom = availableClassrooms.find(
      (room) => !occupiedRooms.includes(room)
    );
    return availableRoom || availableClassrooms[0];
  }

  private updateTracking(
    tracking: AssignmentTracking,
    assignment: any,
    day: string,
    slot: { start: string; end: string },
    classroom: string
  ) {
    // Mettre à jour le compteur du professeur
    const professorKey = `${assignment.professeurId}-${day}`;
    tracking.professorCounts.set(
      professorKey,
      (tracking.professorCounts.get(professorKey) || 0) + 1
    );

    // Mettre à jour le compteur de la matière
    const subjectKey = `${assignment.subjectId}-${day}`;
    tracking.subjectCounts.set(subjectKey, 1);

    // Mettre à jour les salles assignées
    const roomKey = `${day}-${slot.start}`;
    const rooms = tracking.roomAssignments.get(roomKey) || [];
    rooms.push(classroom);
    tracking.roomAssignments.set(roomKey, rooms);
  }

  private calculateGenerationStatistics(
    schedules: any[],
    totalAssignments: number,
    errorCount: number
  ) {
    const successfullyPlaced = schedules.length;
    const successRate =
      totalAssignments > 0 ? (successfullyPlaced / totalAssignments) * 100 : 0;

    return {
      totalAssignments,
      successfullyPlaced,
      failed: errorCount,
      successRate: Math.round(successRate * 100) / 100,
      totalHours: this.calculateTotalHours(schedules),
      averageHoursPerDay: this.calculateAverageHoursPerDay(schedules),
    };
  }

  private calculateAverageHoursPerDay(schedules: any[]): number {
    const days = new Set(schedules.map((s) => s.dayOfWeek)).size;
    const totalHours = this.calculateTotalHours(schedules);
    return days > 0 ? parseFloat((totalHours / days).toFixed(1)) : 0;
  }

  // ==================== UTILITY METHODS ====================

  async deleteSchedule(id: string): Promise<ApiResponse> {
    return await this.prismaClient.$transaction(async (tx) => {
      try {
        if (!this.isValidId(id)) {
          throw this.createError(400, "INVALID_ID_FORMAT", "Invalid ID format");
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
            "Schedule not found"
          );
        }

        await tx.schedule.delete({ where: { id } });

        return {
          success: true,
          message: "Schedule deleted successfully",
          metadata: {
            subject: schedule.classAssignment?.subject?.name || "Unknown",
            class: schedule.schoolClass?.name || "Unknown",
            dayOfWeek: schedule.dayOfWeek,
            time: `${this.formatTimeForDisplay(schedule.startTime)} - ${this.formatTimeForDisplay(schedule.endTime)}`,
            deletedAt: new Date().toISOString(),
          },
        };
      } catch (error: any) {
        return this.handleError("deleteSchedule", error);
      }
    });
  }

  async validateTimetable(classId: string): Promise<ApiResponse> {
    try {
      if (!this.isValidId(classId)) {
        throw this.createError(400, "INVALID_CLASS_ID", "Invalid class ID");
      }

      const timetableResponse = await this.getClassTimetable(classId);

      if (!timetableResponse.success) {
        throw this.createError(
          400,
          "TIMETABLE_FETCH_FAILED",
          "Failed to fetch timetable"
        );
      }

      const schedules = timetableResponse.data.schedules || [];
      const validationResults = {
        isValid: true,
        issues: [] as any[],
        statistics: {} as any,
      };

      // Vérifier chaque horaire
      for (const schedule of schedules) {
        if (schedule.status === "ACTIVE") {
          const conflictCheck = await this.checkScheduleConflicts(
            schedule.professeurId,
            schedule.classId,
            schedule.dayOfWeek,
            schedule.startTime,
            schedule.endTime,
            schedule.classroom,
            schedule.id
          );

          if (conflictCheck.hasConflict) {
            validationResults.isValid = false;
            validationResults.issues.push({
              scheduleId: schedule.id,
              type: "CONFLICT",
              conflicts: conflictCheck.conflicts,
            });
          }
        }
      }

      // Statistiques
      validationResults.statistics = {
        totalSchedules: schedules.length,
        activeSchedules: schedules.filter(
          (s: { status: string }) => s.status === "ACTIVE"
        ).length,
        totalHours: this.calculateTotalHours(schedules),
        averageDuration: this.calculateAverageDuration(schedules),
        daysWithSchedules: new Set(
          schedules.map((s: { dayOfWeek: any }) => s.dayOfWeek)
        ).size,
      };

      return {
        success: true,
        message: validationResults.isValid
          ? "Timetable is valid"
          : "Issues detected in timetable",
        data: validationResults,
        metadata: {
          classId,
          validatedAt: new Date().toISOString(),
          issuesCount: validationResults.issues.length,
        },
      };
    } catch (error: any) {
      return this.handleError("validateTimetable", error);
    }
  }
}
