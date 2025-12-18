import { Student } from "./student";

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string; // CORRECT: classId au lieu de faculty
  academicYearId: string;
  enrollmentDate: string; // Chaîne ISO
  status: "Active" | "Suspended" | "Completed";
  isReenrollment?: boolean;
  previousEnrollmentId?: string;
  reenrollmentDate?: string;
  reenrollmentNotes?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations optionnelles (si incluses dans l'API)
  student?: Student;
  schoolClass?: SchoolClass;
  academicYear?: AcademicYear;
  previousEnrollment?: Enrollment;
  nextEnrollments?: Enrollment[];
}

export interface CreateEnrollmentData {
  studentId: string;
  classId: string; // CORRECT: classId au lieu de faculty
  academicYearId: string;
  status?: "Active" | "Suspended" | "Completed";
  enrollmentDate?: string;
}

export interface UpdateEnrollmentData {
  classId?: string; // CORRECT: classId au lieu de faculty
  academicYearId?: string;
  status?: "Active" | "Suspended" | "Completed";
  enrollmentDate?: string;
}

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  academicYear: string;
  academicYearId?: string;
  faculty?: string;
  level?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFee {
  id: string;
  studentId: string;
  feeStructureId: string;
  feeStructure?: FeeStructure;
  academicYearId: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: "Pending" | "Partially Paid" | "Paid" | "Overdue";
  createdAt?: string;
  updatedAt?: string;
}

export interface Faculty {
  id: string;
  name: string;
  code?: string;
  description?: string;
  dean?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  academicYearId?: string;
  academicYear?: AcademicYear;
  capacity?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Types pour les actions d'audit
export enum StudentActionTypes {
  STUDENTS_LIST_REQUEST = "STUDENTS_LIST_REQUEST",
  STUDENTS_LIST_ERROR = "STUDENTS_LIST_ERROR",
  STUDENT_DETAILS_REQUEST = "STUDENT_DETAILS_REQUEST",
  STUDENT_DETAILS_ERROR = "STUDENT_DETAILS_ERROR",
  STUDENT_CREATED = "STUDENT_CREATED",
  STUDENT_CREATION_ERROR = "STUDENT_CREATION_ERROR",
  STUDENT_UPDATED = "STUDENT_UPDATED",
  STUDENT_UPDATE_ERROR = "STUDENT_UPDATE_ERROR",
  STUDENT_DELETED = "STUDENT_DELETED",
  STUDENT_DELETION_ERROR = "STUDENT_DELETION_ERROR",
  STUDENT_STATUS_UPDATED = "STUDENT_STATUS_UPDATED",
  STUDENT_STATUS_UPDATE_ERROR = "STUDENT_STATUS_UPDATE_ERROR",
  STUDENT_CLASS_ASSIGNED = "STUDENT_CLASS_ASSIGNED",
  STUDENT_CLASS_ASSIGN_ERROR = "STUDENT_CLASS_ASSIGN_ERROR",
  STUDENT_STATISTICS_REQUEST = "STUDENT_STATISTICS_REQUEST",
  STUDENT_STATISTICS_ERROR = "STUDENT_STATISTICS_ERROR",
  STUDENTS_IMPORTED = "STUDENTS_IMPORTED",
  STUDENTS_IMPORT_ERROR = "STUDENTS_IMPORT_ERROR",
}

export interface StudentControllerResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}
