export enum GradeStatus {
  Valid_ = "Valid_",
  Non_valid_ = "Non_valid_",
  Reprendre = "Reprendre",
}

export enum GradeSession {
  Normale = "Normale",
  Reprise = "Reprise",
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  status: string;
  userId?: string;
  cin?: string;
  sexe?: string;
  classId?: string;
  createdAt: Date;
  updatedAt: Date;
  enrollments?: Enrollment[];
  grades?: Grade[];
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status: GradeStatus;
  session: GradeSession;
  controlType: ControlType;
  createdAt: Date;
  academicYearId: string;
  classLevel: string;
  isActive: boolean;
  updatedAt: Date;
  notes?: string;
  subject?: Subject;
  student?: Student;
  classAssignment?: ClassAssignment;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  coefficient: number;
  type: string;
  passingGrade: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface ClassAssignment {
  id: string;
  subjectId: string;
  professeurId: string;
  classLevel: string;
  academicYearId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subject?: Subject;
  professeur?: Professeur;
  academicYear?: AcademicYear;
}

export interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  matricule: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  enrollmentDate: Date;
  status: string;
  academicYearId: string;
  isReenrollment: boolean;
  previousEnrollmentId?: string;
  reenrollmentDate?: Date;
  reenrollmentNotes?: string;
  academicYear?: AcademicYear;
  schoolClass?: SchoolClass;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BulletinData {
  student: Student;
  academicYear: AcademicYear;
  controlType: ControlType;
  classLevel: string;
  documentType: DocumentType;
  grades: GradeWithDetails[];
  statistics: BulletinStatistics;
  remarks?: {
    headTeacher?: string;
    director?: string;
    generalComment?: string;
  };
  metadata: {
    generatedAt: Date;
    generatedBy?: string;
    documentNumber: string;
    controlPeriod: string;
  };
}

export interface GradeWithDetails extends Grade {
  subjectName: string;
  coefficient: number;
  passingGrade: number;
  professeurName: string;
}

export interface BulletinStatistics {
  average: number;
  weightedAverage: number;
  totalCoefficient: number;
  successRate: number;
  minGrade?: number;
  maxGrade?: number;
  rankInClass?: number;
  classAverage?: number;
}

export interface DocumentConfig {
  type: DocumentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredFields: string[];
}

export interface FilterState {
  academicYearId: string;
  controlType: ControlType | "all";
  classLevel: string;
  studentId?: string;
}

export interface Bulletin {
  id: string;
  studentId: string;
  academicYearId: string;
  controlType: string;
  classLevel: string;
  documentType: string;
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  successRate: number;
  fileName: string;
  status: string;
  generatedBy?: string;
  generatedAt: string;
  language: string;
  metadata?: any;
  notes?: string;
  academicYear?: {
    year: string;
    startDate: string;
    endDate: string;
  };
  documentHistory?: Array<{
    action: string;
    performedBy?: string;
    performedAt: string;
  }>;
}

export interface BulletinGenerationRequest {
  studentId: string;
  academicYearId: string;
  controlType: ControlType;
  documentType: DocumentType;
  language?: string;
  includeComments?: boolean;
}

export enum ControlType {
  CONTROLE_1 = "CONTROLE_1",
  CONTROLE_2 = "CONTROLE_2",
  CONTROLE_3 = "CONTROLE_3",
  CONTROLE_4 = "CONTROLE_4",
}

export enum DocumentType {
  BULLETIN = "BULLETIN",
  RELEVE = "RELEVE",
  ATTESTATION_NIVEAU = "ATTESTATION_NIVEAU",
  ATTESTATION_FIN_ETUDES = "ATTESTATION_FIN_ETUDES",
  CERTIFICAT_SCOLARITE = "CERTIFICAT_SCOLARITE",
}
