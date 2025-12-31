// Fichier: src/types/timetableTypes.ts
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface ClassAssignment {
  id: string;
  subjectId: string;
  professeurId: string;
  classLevel: ClassLevel;
  academicYearId: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  subject?: {
    id: string;
    code: string;
    name: string;
    coefficient: number;
    type: SubjectType;
  };
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    matricule: string;
  };
  academicYear?: {
    id: string;
    year: string;
  };
  schedules?: Schedule[];
}

export interface Schedule {
  id: string;
  assignmentId: string;
  classId: string;
  professeurId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  classroom?: string;
  status: string;
  recurrence?: string;
  untilDate?: Date | string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  classAssignment?: ClassAssignment;
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  schoolClass?: {
    id: string;
    name: string;
    level: ClassLevel;
  };
}

// Enums pour correspondre à votre schéma
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

export enum SubjectType {
  Obligatoire = "Obligatoire",
  Optionnelle = "Optionnelle",
}

// Types pour les requêtes
export interface CreateScheduleData {
  assignmentId: string;
  classId: string;
  professeurId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  classroom?: string;
  recurrence?: string;
  untilDate?: string;
  notes?: string;
}

export interface UpdateScheduleData {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  classroom?: string;
  status?: string;
  recurrence?: string;
  untilDate?: string;
  notes?: string;
}

export interface CreateAssignmentData {
  subjectId: string;
  professeurId: string;
  classLevel: ClassLevel;
  academicYearId: string;
  schedules?: CreateScheduleData[];
}

// types/api.ts
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  metadata?: {
    subject?: string;
    class?: string;
    dayOfWeek?: string;
    time?: string;
    changes?: string[];
    duration?: string;
    generated?: number;
    errors?: number;
    successRate?: string;
    [key: string]: any;
  };
}

export interface ScheduleMetadata {
  subject?: string;
  class?: string;
  dayOfWeek?: string;
  time?: string;
  changes?: string[];
  duration?: string;
  generated?: number;
  errors?: number;
  successRate?: string;
  [key: string]: any;
}
// Types pour les réponses
export interface TimetableControllerResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

// Enums pour les actions d'audit
export enum TimetableActionTypes {
  // Assignations
  ASSIGNMENT_CREATED = "ASSIGNMENT_CREATED",
  ASSIGNMENT_UPDATED = "ASSIGNMENT_UPDATED",
  ASSIGNMENT_DELETED = "ASSIGNMENT_DELETED",

  // Emplois du temps
  SCHEDULE_CREATED = "SCHEDULE_CREATED",
  SCHEDULE_UPDATED = "SCHEDULE_UPDATED",
  SCHEDULE_DELETED = "SCHEDULE_DELETED",
  TIMETABLE_GENERATED = "TIMETABLE_GENERATED",

  // Erreurs
  ASSIGNMENT_CREATION_ERROR = "ASSIGNMENT_CREATION_ERROR",
  ASSIGNMENT_UPDATE_ERROR = "ASSIGNMENT_UPDATE_ERROR",
  ASSIGNMENT_DELETION_ERROR = "ASSIGNMENT_DELETION_ERROR",
  SCHEDULE_CREATION_ERROR = "SCHEDULE_CREATION_ERROR",
  SCHEDULE_UPDATE_ERROR = "SCHEDULE_UPDATE_ERROR",
  SCHEDULE_DELETION_ERROR = "SCHEDULE_DELETION_ERROR",
}
