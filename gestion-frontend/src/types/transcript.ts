/**
 * @file transcript.ts
 * @description Types pour la gestion des transcripts
 */

export enum DocumentType {
  BULLETIN = "BULLETIN",
  RELEVE = "RELEVE",
  ATTESTATION_NIVEAU = "ATTESTATION_NIVEAU",
  ATTESTATION_FIN_ETUDES = "ATTESTATION_FIN_ETUDES",
  CERTIFICAT_SCOLARITE = "CERTIFICAT_SCOLARITE",
}

export enum ControlType {
  CONTROLE_1 = "CONTROLE_1",
  CONTROLE_2 = "CONTROLE_2",
  CONTROLE_3 = "CONTROLE_3",
  CONTROLE_4 = "CONTROLE_4",
}

export enum TranscriptStatus {
  DRAFT = "DRAFT",
  GENERATED = "GENERATED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

export enum DocumentLanguage {
  FR = "FR",
  EN = "EN",
}

export enum ClassLevel {
  SIXIEME = "Sixieme",
  CINQUIEME = "Cinquieme",
  QUATRIEME = "Quatrieme",
  TROISIEME = "Troisieme",
  SECONDE = "Seconde",
  PREMIERE = "Premiere",
  TERMINALE = "Terminale",
  NSI = "NSI",
  NSII = "NSII",
  NSIII = "NSIII",
  NSIV = "NSIV",
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  cin?: string;
  sexe?: string;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  maxGrade: number;
  passingGrade: number;
  type: string;
}

export interface Grade {
  id: string;
  grade: number;
  status: string;
  controlType: ControlType;
  subject: Subject;
  studentId: string;
  academicYearId: string;
  classLevel: ClassLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transcript {
  id: string;
  studentId: string;
  academicYearId: string;
  controlType: ControlType;
  classLevel: ClassLevel;
  documentType: DocumentType;
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  successRate: number;
  fileName: string;
  pdfData?: any;
  status: TranscriptStatus;
  language: DocumentLanguage;
  metadata: {
    withSignature?: boolean;
    withStamp?: boolean;
    includeAllGrades?: boolean;
    generatedBy?: string;
    generatedAt?: string;
    rank?: number;
    totalStudents?: number;
    promotionAverage?: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  student: Student;
  academicYear: AcademicYear;
  transcriptGrades: Array<{
    grade: Grade;
    order: number;
  }>;
}

export interface CreateTranscriptData {
  studentId: string;
  academicYearId: string;
  controlType: ControlType;
  classLevel: ClassLevel;
  documentType: DocumentType;
  grades: string[];
  statistics?: {
    gpa?: number;
    totalCredits?: number;
    creditsEarned?: number;
    successRate?: number;
    average?: number;
    rank?: number;
    totalStudents?: number;
  };
  language?: DocumentLanguage;
  withSignature?: boolean;
  withStamp?: boolean;
  notes?: string;
}

export interface UpdateTranscriptData {
  controlType?: ControlType;
  classLevel?: ClassLevel;
  documentType?: DocumentType;
  language?: DocumentLanguage;
  withSignature?: boolean;
  withStamp?: boolean;
  grades?: string[];
  statistics?: {
    gpa?: number;
    totalCredits?: number;
    creditsEarned?: number;
    successRate?: number;
  };
  notes?: string;
  status?: TranscriptStatus;
}

export interface TranscriptStatistics {
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  successRate: number;
  average: number;
  rank?: number;
  totalStudents?: number;
  passedCount: number;
  failedCount: number;
  totalSubjects: number;
  totalCoefficients: number;
}

export interface TranscriptFilters {
  search?: string;
  studentId?: string;
  academicYearId?: string;
  controlType?: ControlType;
  documentType?: DocumentType;
  status?: TranscriptStatus;
  classLevel?: ClassLevel;
  language?: DocumentLanguage;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TranscriptResponse {
  transcripts: Transcript[];
  pagination: PaginationData;
}

export interface DocumentHistory {
  id: string;
  transcriptId: string;
  action: string;
  performedBy?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  performedAt: string;
}
