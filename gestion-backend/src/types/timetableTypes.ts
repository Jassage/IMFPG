/**
 * @file timetableTypes.ts
 * @description Types partagés pour la gestion des emplois du temps
 */

export interface Schedule {
  id: string;
  assignmentId: string;
  classId: string;
  professeurId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom?: string | null;
  status: string;
  recurrence?: string | null;
  untilDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations optionnelles
  classAssignment?: {
    id: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    professeur?: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
    };
    academicYear?: {
      id: string;
      year: string;
    };
  };

  schoolClass?: {
    id: string;
    name: string;
    level: string;
  };

  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface ScheduleConflict {
  type: string;
  message: string;
  details: any[];
}

export interface ConflictCheckResult {
  success: any;
  data: any;
  message: string;
  code: string;
  hasConflict: boolean;
  conflicts: ScheduleConflict[];
}

export interface ApiResponse<T = any> {
  metadata?: Record<string, any>;
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface ScheduleFilters {
  page?: number;
  limit?: number;
  classId?: string;
  academicYearId?: string;
  professeurId?: string;
  dayOfWeek?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  classroom?: string;
  subject?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TimetableDay {
  day: string;
  label: string;
  slots: Schedule[];
}

export interface WeekSummary {
  [day: string]: {
    count: number;
    hours: number;
  };
}

export type ScheduleStatus = "ACTIVE" | "INACTIVE" | "CANCELLED";

export interface ScheduleConfig {
  maxSchedulesPerProfessorPerDay: number;
  maxSchedulesPerClassPerDay: number;
  minScheduleDurationMinutes: number;
  maxScheduleDurationMinutes: number;
  maxClassroomLength: number;
  maxNotesLength: number;
  maxRecurrenceLength: number;
  maxPaginationLimit: number;
}

export interface ScheduleError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

export class ValidationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends Error {
  constructor(
    public conflicts: ScheduleConflict[],
    message: string = "Schedule conflict detected"
  ) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} with ID ${id} not found`);
    this.name = "NotFoundError";
  }
}
export const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lundi", short: "LUN" },
  { value: "TUESDAY", label: "Mardi", short: "MAR" },
  { value: "WEDNESDAY", label: "Mercredi", short: "MER" },
  { value: "THURSDAY", label: "Jeudi", short: "JEU" },
  { value: "FRIDAY", label: "Vendredi", short: "VEN" },
  { value: "SATURDAY", label: "Samedi", short: "SAM" },
  { value: "SUNDAY", label: "Dimanche", short: "DIM" },
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]["value"];

export interface CreateScheduleData {
  assignmentId: string;
  classId: string;
  dayOfWeek: string;
  startTime: string; // Format HH:MM ou HH:MM:SS ou ISO
  endTime: string; // Format HH:MM ou HH:MM:SS ou ISO
  classroom?: string;
  recurrence?: string;
  untilDate?: string;
  notes?: string;
}

export interface UpdateScheduleData {
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  classroom?: string;
  recurrence?: string;
  untilDate?: string;
  notes?: string;
  status?: string;
}

export interface GenerateTimetableData {
  classId: string;
  academicYearId: string;
  constraints?: {
    maxHoursPerDay?: number;
    breakTime?: { start: string; end: string };
  };
}
