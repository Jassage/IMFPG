export enum GradeStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PUBLISHED = "Published",
  ARCHIVED = "Archived",

  VALID = "Valid_",
  NON_VALID = "Non_valid_",
  REPRENDRE = "Reprendre",
}

// Enum pour les types de contrôle
export enum ControlType {
  CONTROLE_1 = "CONTROLE_1",
  CONTROLE_2 = "CONTROLE_2",
  CONTROLE_3 = "CONTROLE_3",
  CONTROLE_4 = "CONTROLE_4",
}

// Enum pour les sessions
export enum GradeSession {
  NORMALE = "Normale",
  REPRISE = "Reprise",
}

// Enum pour les niveaux de classe
export enum ClassLevel {
  SIXIEME = "7eme A.F",
  CINQUIEME = "8eme A.F",
  QUATRIEME = "9eme A.F",
  TROISIEME = "3e Secondaire",
  SECONDE = "Seconde",
  PREMIERE = "Rheto",
  TERMINALE = "Terminale",
  NSI = "NSI",
  NSII = "NSII",
  NSIII = "NSIII",
  NSIV = "NSIV",
}

export enum DocumentType {
  BULLETIN = "BULLETIN",
  RELEVE = "RELEVE",
  ATTESTATION_NIVEAU = "ATTESTATION_NIVEAU",
  ATTESTATION_FIN_ETUDES = "ATTESTATION_FIN_ETUDES",
  CERTIFICAT_SCOLARITE = "CERTIFICAT_SCOLARITE",
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
  schoolClass?: SchoolClass;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  coefficient: number;
  type: string;
  passingGrade: number;
  maxGrade: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Grade {
  validatedAt: any;
  submittedBy: string;
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  normalizedGrade?: number;
  status: GradeStatus;
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
  // Pour les contrôles multiples
  controlGrades?: Record<
    ControlType,
    {
      grade: number;
      normalizedGrade?: number;
      date?: Date;
      comments?: string;
    }
  >;
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

export interface Enrollment {
  id?: string;
  studentId?: string;
  schoolClass?: {
    id?: string;
    name: string;
    level: string;
    academicYear?: AcademicYear;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  showAllControls: boolean;
  statisticsByControl?: Record<string, BulletinStatistics>;
  student: Student;
  academicYear: AcademicYear;
  // Absent pour les documents "année entière" (RELEVE, CERTIFICAT_SCOLARITE)
  controlType?: ControlType;
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
  selectedControlTypes?: ControlType[];
  showSelectedControls?: boolean;
}

export interface BulletinStatistics {
  average: number;
  weightedAverage: number;
  totalCoefficient: number;
  successRate: number;
  minGrade?: number;
  maxGrade?: number;
  rankInClass?: number;
  totalStudents?: number;
  classAverage?: number;
  totalSubjects?: number;
  passingSubjects?: number;
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
  // Requis uniquement pour documentType === BULLETIN (les autres types couvrent l'année entière)
  controlType?: ControlType;
  documentType: DocumentType;
  language?: string;
  includeComments?: boolean;
}

export interface GradeWithDetails {
  id: string;
  grade: number;
  normalizedGrade: number; // Note sur 20
  subjectName: string;
  coefficient: number;
  passingGrade: number;
  maxGrade: number;
  professeurName: string;
  session?: string;
  controlType: ControlType;
  controlGrades?: {
    [key in ControlType]?: {
      grade: number;
      normalizedGrade?: number;
      date?: Date;
      comments?: string;
    };
  };
  subject?: Subject;
  classAssignment?: {
    professeur?: {
      firstName: string;
      lastName: string;
    };
  };
}

// Utilitaires pour normaliser les notes
export const normalizeGrade = (
  grade: number,
  maxGrade: number = 20
): number => {
  if (maxGrade === 20) return grade;
  if (maxGrade >= 30) return (grade * 20) / maxGrade;
  if (maxGrade === 10) return grade * 2;
  return grade;
};

export const denormalizeGrade = (
  normalizedGrade: number,
  maxGrade: number = 20
): number => {
  if (maxGrade === 20) return normalizedGrade;
  if (maxGrade === 30) return (normalizedGrade * 30) / 20;
  if (maxGrade === 10) return normalizedGrade / 2;
  return normalizedGrade;
};
