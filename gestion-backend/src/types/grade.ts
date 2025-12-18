/**
 * Types pour la gestion des notes académiques
 */

// Enums correspondant à Prisma
export enum ControlType {
  CONTROLE_1 = "CONTROLE_1",
  CONTROLE_2 = "CONTROLE_2",
  CONTROLE_3 = "CONTROLE_3",
  CONTROLE_4 = "CONTROLE_4",
}

export enum GradeSession {
  NORMALE = "Normale",
  REPRISE = "Reprise",
}

export enum GradeStatus {
  VALID = "Valid_",
  NON_VALID = "Non_valid_",
  REPRENDRE = "Reprendre",
}

export enum UserRole {
  ADMIN = "Admin",
  PROFESSEUR = "Professeur",
  SECRETAIRE = "Secretaire",
  DIRECTEUR = "Directeur",
  PARENT = "Parent",
  STUDENT = "Student",
}

// Interfaces principales
export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status: GradeStatus;
  session: GradeSession;
  controlType: ControlType;
  academicYearId: string;
  classLevel: string;
  isActive: boolean;
  coefficient: number;
  examDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  student?: Student;
  subject?: Subject;
  classAssignment?: ClassAssignment;
  academicYear?: AcademicYear;
}

export interface GradeCreateInput {
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status: GradeStatus;
  session: GradeSession;
  controlType: ControlType;
  academicYearId: string;
  classLevel: string;
  coefficient?: number;
  examDate?: Date;
  notes?: string;
}

export interface GradeUpdateInput {
  grade?: number;
  status?: GradeStatus;
  session?: GradeSession;
  coefficient?: number;
  examDate?: Date;
  notes?: string;
}

export interface GradeFilter {
  studentId?: string;
  subjectId?: string;
  academicYearId?: string;
  controlType?: ControlType;
  session?: GradeSession;
  status?: GradeStatus;
  classLevel?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Interfaces pour les relations
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email: string;
  status: string;
  schoolClass?: SchoolClass;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  type: string;
  passingGrade: number;
}

export interface ClassAssignment {
  id: string;
  classLevel: string;
  professeur?: Professeur;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
}

export interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
}

// Interfaces pour les réponses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: Pagination;
  statistics?: any;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GradeStatistics {
  generalAverage: number;
  subjectCount: number;
  totalControls: number;
  subjectAverages: SubjectAverage[];
  controlsByType: ControlTypeStats[];
}

export interface SubjectAverage {
  subjectId: string;
  subjectName: string;
  average: number | null;
  isComplete: boolean;
  missingControls: ControlType[];
  totalCoefficient: number;
  totalPoints: number;
}

export interface ControlTypeStats {
  controlType: ControlType;
  controlName: string;
  count: number;
  average: number | null;
}

export interface StudentReport {
  student: Student;
  academicYear: AcademicYear;
  subjects: SubjectReport[];
  summary: ReportSummary;
  recommendations: Recommendation[];
}

export interface SubjectReport {
  subject: Subject;
  controls: ControlDetail[];
  average: number | null;
  isComplete: boolean;
  isPassing: boolean;
  statistics: SubjectStatistics;
  teacher?: Professeur;
}

export interface ControlDetail {
  controlType: ControlType;
  controlName: string;
  grade?: {
    value: number;
    coefficient: number;
    status: GradeStatus;
    examDate?: Date;
    notes?: string;
  };
  coefficient: number;
}

export interface SubjectStatistics {
  average: number | null;
  totalCoefficient: number;
  totalPoints: number;
  missingControls: ControlType[];
  isComplete: boolean;
  controlCount: number;
  details: Record<ControlType, Grade>;
}

export interface ReportSummary {
  totalSubjects: number;
  completedSubjects: number;
  passedSubjects: number;
  generalAverage: number;
  completionRate: number;
  passRate: number;
  ranking?: number;
}

export interface Recommendation {
  type: "WARNING" | "INFO" | "SUCCESS";
  subject: string;
  message: string;
  suggestion: string;
}

// Interfaces pour la validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Interface pour les coefficients
export interface ControlCoefficients {
  CONTROLE_1: number;
  CONTROLE_2: number;
  CONTROLE_3: number;
  CONTROLE_4: number;
}

// Interface pour l'export
export interface ExportOptions {
  format: "json" | "csv" | "excel";
  academicYearId?: string;
  controlType?: ControlType;
  classLevel?: string;
}
