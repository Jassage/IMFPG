// types/classTypes.ts
export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
  status: "Active" | "Inactive" | "Archived";
  createdAt: Date;
  updatedAt: Date;
  academicYearId: string;
  mainTeacherId?: string;

  // Relations (optionnelles selon le besoin)
  academicYear?: {
    id: string;
    year: string;
    isCurrent: boolean;
  };

  mainTeacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    speciality?: string;
  };

  _count?: {
    students: number;
    schedules: number;
    enrollments: number;
  };
}

export interface ClassFilters {
  page: number;
  limit: number;
  level: string;
  academicYear: string;
  status: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ClassStatistics {
  total: number;
  byLevel: Record<string, number>;
  byAcademicYear: Array<{
    academicYearId: string;
    academicYear: string;
    isCurrent: boolean;
    _count: { id: number };
  }>;
  byStatus: Record<string, number>;
  topClassesByStudents: Array<{
    id: string;
    name: string;
    level: string;
    _count: { students: number };
  }>;
  averageStudentsPerClass: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
}

export interface ClassControllerResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: {
    classes?: SchoolClass[];
    class?: SchoolClass;
    students?: any[];
    schedules?: any;
    statistics?: ClassStatistics;
    pagination?: PaginationData;
    [key: string]: any;
  };
}

export enum ClassActionTypes {
  CLASSES_LIST_REQUEST = "CLASSES_LIST_REQUEST",
  CLASSES_LIST_ERROR = "CLASSES_LIST_ERROR",
  CLASS_DETAILS_REQUEST = "CLASS_DETAILS_REQUEST",
  CLASS_DETAILS_ERROR = "CLASS_DETAILS_ERROR",
  CLASS_CREATED = "CLASS_CREATED",
  CLASS_CREATION_ERROR = "CLASS_CREATION_ERROR",
  CLASS_UPDATED = "CLASS_UPDATED",
  CLASS_UPDATE_ERROR = "CLASS_UPDATE_ERROR",
  CLASS_DELETED = "CLASS_DELETED",
  CLASS_DELETION_ERROR = "CLASS_DELETION_ERROR",
  CLASS_STATUS_UPDATED = "CLASS_STATUS_UPDATED",
  CLASS_STATUS_UPDATE_ERROR = "CLASS_STATUS_UPDATE_ERROR",
  CLASS_TEACHER_ASSIGNED = "CLASS_TEACHER_ASSIGNED",
  CLASS_TEACHER_ASSIGN_ERROR = "CLASS_TEACHER_ASSIGN_ERROR",
  CLASS_STUDENTS_REQUEST = "CLASS_STUDENTS_REQUEST",
  CLASS_STUDENTS_ERROR = "CLASS_STUDENTS_ERROR",
  CLASS_STATISTICS_REQUEST = "CLASS_STATISTICS_REQUEST",
  CLASS_STATISTICS_ERROR = "CLASS_STATISTICS_ERROR",
  CLASS_SCHEDULES_REQUEST = "CLASS_SCHEDULES_REQUEST",
  CLASS_SCHEDULES_ERROR = "CLASS_SCHEDULES_ERROR",
  AVAILABLE_CLASSES_REQUEST = "AVAILABLE_CLASSES_REQUEST",
  AVAILABLE_CLASSES_ERROR = "AVAILABLE_CLASSES_ERROR",
}
