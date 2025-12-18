/**
 * @file classTypes.ts
 * @description Types pour la gestion des classes
 * @version 1.0.0
 */

import { ClassLevel } from "../../generated/prisma";

// Types d'actions pour l'audit
export enum ClassActionTypes {
  // Lectures
  CLASSES_LIST_REQUEST = "CLASSES_LIST_REQUEST",
  CLASS_DETAILS_REQUEST = "CLASS_DETAILS_REQUEST",
  CLASS_STUDENTS_REQUEST = "CLASS_STUDENTS_REQUEST",
  CLASS_SCHEDULES_REQUEST = "CLASS_SCHEDULES_REQUEST",
  CLASS_STATISTICS_REQUEST = "CLASS_STATISTICS_REQUEST",
  AVAILABLE_CLASSES_REQUEST = "AVAILABLE_CLASSES_REQUEST",

  // Création
  CLASS_CREATED = "CLASS_CREATED",
  CLASS_CREATION_ERROR = "CLASS_CREATION_ERROR",

  // Mise à jour
  CLASS_UPDATED = "CLASS_UPDATED",
  CLASS_UPDATE_ERROR = "CLASS_UPDATE_ERROR",
  CLASS_STATUS_UPDATED = "CLASS_STATUS_UPDATED",
  CLASS_STATUS_UPDATE_ERROR = "CLASS_STATUS_UPDATE_ERROR",
  CLASS_TEACHER_ASSIGNED = "CLASS_TEACHER_ASSIGNED",
  CLASS_TEACHER_ASSIGN_ERROR = "CLASS_TEACHER_ASSIGN_ERROR",

  // Suppression
  CLASS_DELETED = "CLASS_DELETED",
  CLASS_DELETION_ERROR = "CLASS_DELETION_ERROR",

  // Erreurs de lecture
  CLASSES_LIST_ERROR = "CLASSES_LIST_ERROR",
  CLASS_DETAILS_ERROR = "CLASS_DETAILS_ERROR",
  CLASS_STUDENTS_ERROR = "CLASS_STUDENTS_ERROR",
  CLASS_SCHEDULES_ERROR = "CLASS_SCHEDULES_ERROR",
  CLASS_STATISTICS_ERROR = "CLASS_STATISTICS_ERROR",
  AVAILABLE_CLASSES_ERROR = "AVAILABLE_CLASSES_ERROR",
}

// Interface pour une classe
export interface SchoolClass {
  id: string;
  name: string;
  level: ClassLevel;
  capacity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  academicYearId: string;
  mainTeacherId?: string | null;
}

// Interface pour une classe avec relations
export interface ClassWithRelations extends SchoolClass {
  academicYear?: {
    id: string;
    year: string;
    isCurrent?: boolean;
    startDate?: Date;
    endDate?: Date;
  };
  mainTeacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    speciality?: string | null;
  };
  students?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    studentCode: string;
    email: string;
    status: string;
    sexe?: string | null;
    dateOfBirth?: Date | null;
  }>;
  schedules?: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classroom?: string | null;
    professeur: {
      id: string;
      firstName: string;
      lastName: string;
    };
    classAssignment: {
      id: string;
      subject: {
        id: string;
        name: string;
        code: string;
      };
    };
  }>;
  _count?: {
    students: number;
    schedules: number;
    enrollments: number;
  };
}

// Interface pour les statistiques
export interface ClassStatistics {
  total: number;
  byLevel: Record<string, number>;
  byAcademicYear: Array<{
    academicYearId: string;
    academicYear: string;
    isCurrent: boolean;
    _count: {
      id: number;
    };
  }>;
  byStatus: Record<string, number>;
  topClassesByStudents: Array<{
    id: string;
    name: string;
    level: ClassLevel;
    _count: {
      students: number;
    };
  }>;
  averageStudentsPerClass: number;
}

// Interface pour la pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface pour la réponse des contrôleurs
export interface ClassControllerResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: {
    classes?: ClassWithRelations[];
    class?: ClassWithRelations;
    statistics?: ClassStatistics;
    students?: any[];
    schedules?: Record<number, any[]>;
    pagination?: Pagination;
  };
}
