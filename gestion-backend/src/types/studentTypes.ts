/**
 * @file studentTypes.ts
 * @description Types pour la gestion des étudiants
 * @version 1.0.0
 */

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status: string;
  sexe?: string;
  cin?: string;
  classId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface StudentControllerResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
  errors?: any[];
}

export interface StudentFilters {
  search?: string;
  status?: string;
  classId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: string;
  sexe?: string;
  cin?: string;
  classId?: string;
  createUserAccount?: boolean;
  guardians?: GuardianData[];
}

export interface GuardianData {
  address: null;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  relationship?: string;
}

export interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: string;
  sexe?: string;
  cin?: string;
  classId?: string;
}

export enum StudentActionTypes {
  // Liste et recherche
  STUDENTS_LIST_REQUEST = "STUDENTS_LIST_REQUEST",
  STUDENTS_LIST_ERROR = "STUDENTS_LIST_ERROR",
  STUDENT_DETAILS_REQUEST = "STUDENT_DETAILS_REQUEST",
  STUDENT_DETAILS_ERROR = "STUDENT_DETAILS_ERROR",

  // Création et modification
  STUDENT_CREATED = "STUDENT_CREATED",
  STUDENT_CREATION_ERROR = "STUDENT_CREATION_ERROR",
  STUDENT_UPDATED = "STUDENT_UPDATED",
  STUDENT_UPDATE_ERROR = "STUDENT_UPDATE_ERROR",

  // Suppression
  STUDENT_DELETED = "STUDENT_DELETED",
  STUDENT_DELETION_ERROR = "STUDENT_DELETION_ERROR",

  // Statut
  STUDENT_STATUS_UPDATED = "STUDENT_STATUS_UPDATED",
  STUDENT_STATUS_UPDATE_ERROR = "STUDENT_STATUS_UPDATE_ERROR",

  // Classe
  STUDENT_CLASS_ASSIGNED = "STUDENT_CLASS_ASSIGNED",
  STUDENT_CLASS_ASSIGN_ERROR = "STUDENT_CLASS_ASSIGN_ERROR",

  // Statistiques
  STUDENT_STATISTICS_REQUEST = "STUDENT_STATISTICS_REQUEST",
  STUDENT_STATISTICS_ERROR = "STUDENT_STATISTICS_ERROR",

  // Import/Export
  STUDENTS_IMPORTED = "STUDENTS_IMPORTED",
  STUDENTS_IMPORT_ERROR = "STUDENTS_IMPORT_ERROR",
  STUDENTS_EXPORT_REQUEST = "STUDENTS_EXPORT_REQUEST",

  // Erreurs spécifiques
  STUDENT_NOT_FOUND = "STUDENT_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  CIN_ALREADY_EXISTS = "CIN_ALREADY_EXISTS",
  STUDENT_HAS_DEPENDENCIES = "STUDENT_HAS_DEPENDENCIES",
  MISSING_REQUIRED_FIELDS = "MISSING_REQUIRED_FIELDS",
  INVALID_STATUS = "INVALID_STATUS",
  MISSING_CLASS_ID = "MISSING_CLASS_ID",
  CLASS_NOT_FOUND = "CLASS_NOT_FOUND",
  NO_STUDENT_DATA = "NO_STUDENT_DATA",
}

/**
 * @file studentTypes.ts
 * @description Types pour la gestion des étudiants
 */

export interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status: string;
  sexe?: string;
  cin?: string;
  classId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCreateData {
  studentCode: any;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: string;
  sexe?: string;
  cin?: string;
  classId?: string;
  createUserAccount?: boolean;
  sendWelcomeEmail?: boolean;
  academicYearId?: string;
  guardians?: GuardianData[];
}

export interface StudentUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: string;
  sexe?: string;
  cin?: string;
  classId?: string;
}

export interface GuardianData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
}

export interface StudentFilterOptions {
  page?: number | string;
  limit?: number | string;
  status?: string;
  search?: string;
  classId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StudentStatistics {
  total: number;
  byStatus: Record<string, number>;
  byGender: Record<string, number>;
  byClass: any[];
  recentEnrollments: number;
}

export interface StudentImportResult {
  warnings: any;
  success: number;
  failed: number;
  errors: any[];
  created: any[];
}

export interface StudentControllerResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

// export enum StudentActionTypes {
//   STUDENTS_LIST_REQUEST = "STUDENTS_LIST_REQUEST",
//   STUDENTS_LIST_ERROR = "STUDENTS_LIST_ERROR",
//   STUDENT_DETAILS_REQUEST = "STUDENT_DETAILS_REQUEST",
//   STUDENT_DETAILS_ERROR = "STUDENT_DETAILS_ERROR",
//   STUDENT_CREATED = "STUDENT_CREATED",
//   STUDENT_CREATION_ERROR = "STUDENT_CREATION_ERROR",
//   STUDENT_UPDATED = "STUDENT_UPDATED",
//   STUDENT_UPDATE_ERROR = "STUDENT_UPDATE_ERROR",
//   STUDENT_DELETED = "STUDENT_DELETED",
//   STUDENT_DELETION_ERROR = "STUDENT_DELETION_ERROR",
//   STUDENT_STATUS_UPDATED = "STUDENT_STATUS_UPDATED",
//   STUDENT_STATUS_UPDATE_ERROR = "STUDENT_STATUS_UPDATE_ERROR",
//   STUDENT_CLASS_ASSIGNED = "STUDENT_CLASS_ASSIGNED",
//   STUDENT_CLASS_ASSIGN_ERROR = "STUDENT_CLASS_ASSIGN_ERROR",
//   STUDENT_STATISTICS_REQUEST = "STUDENT_STATISTICS_REQUEST",
//   STUDENT_STATISTICS_ERROR = "STUDENT_STATISTICS_ERROR",
//   STUDENTS_IMPORTED = "STUDENTS_IMPORTED",
//   STUDENTS_IMPORT_ERROR = "STUDENTS_IMPORT_ERROR",
// }
