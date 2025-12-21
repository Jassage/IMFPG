/**
 * Types pour la génération de bulletins scolaires
 */

export enum BulletinStatus {
  DRAFT = "DRAFT",
  GENERATED = "GENERATED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
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

export interface BulletinRequest {
  studentId: string;
  academicYearId: string;
  controlType: ControlType;
  documentType: DocumentType;
  language?: string;
  includeComments?: boolean;
}

export interface BulletinData {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentCode: string;
    dateOfBirth: Date;
    placeOfBirth?: string;
    photo?: string;
    bloodGroup?: string;
  };
  classInfo: {
    id: string;
    name: string;
    level: string;
    professeurPrincipal?: string;
  };
  academicYear: {
    id: string;
    year: string;
    startDate: Date;
    endDate: Date;
  };
  grades: Array<{
    subject: string;
    coefficient: number;
    grade: number;
    status: string;
    controlType: ControlType;
    passingGrade: number;
    professeur: string;
    comments?: string;
  }>;
  statistics: {
    average: number;
    weightedAverage: number;
    totalCoefficient: number;
    successRate: number;
    rankInClass?: number;
    classAverage?: number;
    minGrade?: number;
    maxGrade?: number;
  };
  remarks: {
    headTeacher: string;
    director: string;
    generalComment: string;
  };
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    documentNumber: string;
    controlPeriod: string;
  };
}

export interface BulletinPDFOptions {
  includeHeader: boolean;
  includeFooter: boolean;
  includeSchoolLogo: boolean;
  watermark?: string;
  language: string;
}
