// Utiliser des unions de string literals au lieu d'enum
export type StudentStatus = "Active" | "Inactive" | "Graduated" | "Suspended";
export type StudentSexe = "Masculin" | "Feminin" | "Autre";
export type GradeStatus = "Valid_" | "Non_valid_" | "Reprendre";
export type GradeSession = "Normale" | "Reprise";
export type ControlType =
  | "CONTROLE_1"
  | "CONTROLE_2"
  | "CONTROLE_3"
  | "CONTROLE_4";

export type ClassLevel =
  | "Sixieme"
  | "Cinquieme"
  | "Quatrieme"
  | "Troisieme"
  | "Seconde"
  | "Premiere"
  | "Terminale"
  | "NSI"
  | "NSII"
  | "NSIII"
  | "NSIV";

export type ClassLevelFilter = ClassLevel | "";
export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export interface Student {
  academicYearId: any;
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

  schoolClass?: SchoolClass;
  user?: User;
  guardians?: Guardian[];
  enrollments?: Enrollment[];
  grades?: Grade[];
  payments?: Payment[];
}

export interface Payment {
  academicYear: string;
  id: string;
  studentCode: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  description?: string;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  studentId: string;
  parentId?: string; // AJOUTER CETTE LIGNE
  notes?: string; // AJOUTER CETTE LIGNE
  createdAt?: string;
  updatedAt?: string;

  // Relations optionnelles
  student?: Student;
  parent?: Parent; // NOUVEAU TYPE
}

export interface Parent {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations
  user?: User;
  guardians?: Guardian[];
  children?: Student[];
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  academicYear: string;
  capacity: number;
  currentStudents: number;
  teacherId?: string;
  createdAt: Date;
  updatedAt: Date;
  teacher?: User;
}

export interface Enrollment {
  class: any;
  id: string;
  studentCode: string;
  classId: string;
  academicYearId: string;
  enrollmentDate: Date | string;
  status: "Active" | "Suspended" | "Completed";
  isReenrollment?: boolean;
  previousEnrollmentId?: string;
  reenrollmentDate?: Date | string;
  reenrollmentNotes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Relations (optionnelles)
  student?: Student;
  schoolClass?: SchoolClass;
  academicYear?: AcademicYear;
  previousEnrollment?: Enrollment;
  nextEnrollments?: Enrollment[];
}

export type StudentFormData = {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  bloodGroup?: BloodGroup;
  allergies?: string;
  disabilities?: string;
  cin?: string;
  sexe?: StudentSexe;
  status: StudentStatus;
  guardians: GuardianFormData[];
};

export type GuardianFormData = {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
};

export type CreateStudentData = Omit<
  StudentFormData,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateStudentData = Partial<StudentFormData>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface StudentApiResponse extends ApiResponse<Student> {}
export interface StudentsApiResponse extends ApiResponse<Student[]> {}

export interface Subject {
  maxGrade: number;
  id: string;
  code: string;
  name: string;
  coefficient: number;
  type: "Obligatoire" | "Optionnelle";
  passingGrade: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    assignments: number;
    grades: number;
  };
}

// Interfaces pour les filtres
export interface SubjectFilters {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interfaces pour les données du formulaire
export interface CreateSubjectData {
  code?: string;
  name?: string;
  coefficient?: number;
  type?: "Obligatoire" | "Optionnelle";
  passingGrade?: number;
  description?: string;
}

export interface UpdateSubjectData {
  code?: string;
  name?: string;
  coefficient?: number;
  type?: "Obligatoire" | "Optionnelle";
  passingGrade?: number;
  description?: string;
}

export interface User {
  professeurId: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Professeur" | "Secretaire" | "Directeur" | "Student";
  status: "Actif" | "Inactif";
  lastLogin?: string;
  avatar?: string;
  createdAt: string;
  professeur?: Professeur;
  studentRecord?: Student;
}

export interface Transcript {
  id: string;
  studentId: string;
  semester: string;
  academicYear: string;
  grades: Grade[];
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  generatedDate: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  category: "Académique" | "Culturel" | "Sportif" | "Administratif" | "Autre";
  participants: string[];
  isPublic: boolean;
  status: "Programmé" | "En cours" | "Terminé" | "Annulé";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishDate: string;
  expiryDate?: string;
  targetAudience: "Tous" | "Étudiants" | "Professeurs" | "Administration";
  priority: "Normal" | "Important" | "Urgent";
  attachments?: string[];
  isActive: boolean;
}

export interface Analytics {
  id: string;
  type: "Performance" | "Présence" | "Paiements" | "Général";
  data: Record<string, any>;
  generatedDate: string;
  parameters: Record<string, any>;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface FeeStructure {
  id: string;
  name: string;
  academicYear: string;
  amount: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FeeStructureCreate = Omit<
  FeeStructure,
  "id" | "createdAt" | "updatedAt"
>;

export interface StudentFee {
  payments: any;
  id: string;
  studentId: string;
  academicYearId: string;
  feeStructureId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "pending" | "partial" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
  };
  feeStructure?: FeeStructure;
  academicYearRef?: AcademicYear;
}

export interface CreateFeeStructureInput {
  academicYear: string;
  name: string;
  faculty: string;
  level: string;
  amount: number;
  isActive?: boolean;
}

export interface AssignFeeToStudentInput {
  studentId: string;
  academicYear: string;
  feeStructureId: string;
}

export interface UpdateFeePaymentInput {
  amount: number;
}

export interface CreatePaymentInput {
  studentCode: string;
  amount: number;
  type: "Inscription" | "Scolarité" | "Examen" | "Certificat" | "Autre";
  status?: "Payé" | "En attente" | "Retard" | "Annulé";
  moyen: string;
  paidDate?: string;
  description?: string;
  academicYear: string;
  academicYearId?: string;
  reference?: string;
}

export interface UpdatePaymentInput {
  studentCode?: string;
  amount?: number;
  type?: "Inscription" | "Scolarité" | "Examen" | "Certificat" | "Autre";
  status?: "Payé" | "En attente" | "Retard" | "Annulé";
  moyen?: string;
  paidDate?: string;
  description?: string;
  academicYear?: string;
  academicYearId?: string;
  reference?: string;
}

export interface FeePayment {
  id: string;
  studentCode: string;
  amount: number;
  type: "Inscription" | "Scolarité" | "Examen" | "Certificat" | "Autre";
  status: "En attente" | "Payé" | "Annulé";
  moyen: "Cash" | "Natcash" | "Moncash" | "Sogebank" | "Fonkoze";
  description?: string;
  academicYear: string; // Ex: "2024-2025"
  academicYearId: string; // ID de l'année académique
  paidDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Professeur {
  hireDate: any;
  address: any;
  user: any;
  userId: any;
  qualifications: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  phone?: string;
  speciality?: string;
  status: "Actif" | "Inactif";
  _count?: {
    schedules: number;
    assignments: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfessorAssignment {
  id: string;
  professorId: string;
  professor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ueId: string;
  ue?: {
    id: string;
    code: string;
    title: string;
    credits: number;
    faculty?: string;
    level?: string;
  };
  academicYearId: string;
  academicYear?: {
    id: string;
    year: string;
    isCurrent: boolean;
  };
  hours: number;
  type: "Cours" | "TD" | "TP";
  status: "Active" | "Completed" | "Cancelled";
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les données de formulaire des professeurs
export interface ProfessorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  status: "Actif" | "Inactif";
}

interface CreateProfesseurData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  userId?: string;
}

interface UpdateProfesseurData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  status?: "Actif" | "Inactif";
  userId?: string;
}

// Types pour les affectations
export interface CreateAssignmentData {
  professorId: string;
  ueId: string;
  academicYearId: string;
  hours: number;
  type: "Cours" | "TD" | "TP";
  startDate?: string;
  endDate?: string;
}

export interface UpdateAssignmentData {
  ueId?: string;
  academicYearId?: string;
  hours?: number;
  type?: "Cours" | "TD" | "TP";
  status?: "Active" | "Completed" | "Cancelled";
  startDate?: string;
  endDate?: string;
}

// Types pour les statistiques des professeurs
export interface ProfessorStats {
  total: number;
  active: number;
  inactive: number;
  totalAssignments: number;
  bySpeciality: Record<string, number>;
  byStatus: Record<string, number>;
}

// Types pour l'import des professeurs
export interface ProfessorImportResult {
  success: number;
  errors: Array<{
    row: number;
    errors: string[];
    data: any;
  }>;
}

// Types pour la réponse des opérations en masse
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  summary: {
    total: number;
    success: number;
    errors: number;
    skipped: number;
  };
  details: {
    success: any[];
    errors: {
      row: number;
      error: string;
      data: any;
    }[];
    skipped: any[];
  };
}

export interface Grade {
  controlGrades: {};
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status: GradeStatus;
  session: GradeSession;
  controlType: ControlType;
  academicYearId: string;
  classLevel: ClassLevel;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations optionnelles
  student?: Student;
  subject?: Subject;
  classAssignment?: {
    id: string;
    professeur: {
      firstName: string;
      lastName: string;
      email: string;
      matricule: string;
    };
  };
  academicYear?: {
    id: string;
    year: string;
    isCurrent: boolean;
  };
}
// src/types/academic.ts
export interface ClassAssignment {
  id: string;
  subjectId: string;
  professeurId: string; // Note: "professeurId" avec "e" (français)
  classLevel: ClassLevel;
  academicYearId: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  academicYear?: AcademicYear;
  professeur?: Professeur;
  subject?: Subject;
  schedules?: Schedule[];
  grades?: Grade[];
}

export interface Schedule {
  id: string;
  classAssignmentId: string;
  dayOfWeek: string; // Ex: "Lundi", "Mardi", etc.
  startTime: string; // Ex: "08:00"
  endTime: string; // Ex: "10:00"
  location?: string;
  createdAt: string;
  updatedAt: string;
}
export interface GradeFilters {
  academicYearId?: string;
  classLevel?: string;
  subjectId?: string;
  controlType?: ControlType;
  session?: GradeSession;
  status?: GradeStatus;
  studentId?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod: string;
  status: "Pending" | "Approved" | "Rejected";
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  approver?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateExpenseInput {
  category: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod: string;
  createdBy: string;
  status?: "Pending" | "Approved" | "Rejected";
}

export interface UpdateExpenseInput {
  category?: string;
  amount?: number;
  description?: string;
  date?: string;
  paymentMethod?: string;
  status?: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
}

export interface ExpenseFilters {
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  createdBy?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  oldData?: any;
  newData?: any;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  status?: "SUCCESS" | "ERROR";
  errorMessage?: string;
  duration?: number;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: {
    total: number;
    success: number;
    error: number;
    today: number;
  };
}
