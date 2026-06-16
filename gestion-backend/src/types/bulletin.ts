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
  // Requis uniquement pour documentType === BULLETIN (les autres types couvrent l'année entière)
  controlType?: ControlType;
  documentType: DocumentType;
  language?: string;
  includeComments?: boolean;
}

export interface BulletinData {
  documentType: DocumentType;
  // Absent pour les documents "année entière" (RELEVE, CERTIFICAT_SCOLARITE)
  controlType?: ControlType;
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
  // Statut d'inscription, utilisé par CERTIFICAT_SCOLARITE
  enrollmentStatus?: string;
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
  // Notes regroupées par matière avec une colonne par contrôle, utilisé par RELEVE
  multiControlGrades?: Array<{
    subjectName: string;
    coefficient: number;
    maxGrade: number;
    passingGrade: number;
    controlGrades: Partial<Record<ControlType, { grade: number; gradeOn20: number }>>;
  }>;
  // Totaux/moyennes par contrôle, utilisé par RELEVE
  yearlyTotals?: {
    totalCoefficient: number;
    totalsByControl: Partial<Record<ControlType, number>>;
    averagesByControl: Partial<Record<ControlType, number>>;
  };
  // Décision globale (ADMIS / À REFAIRE / À REFAIRE AILLEURS), utilisé par RELEVE
  decision?: {
    label: string;
    description: string;
  };
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
  schoolInfo: {
    name: string;
    slogan?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    logo?: string;
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
