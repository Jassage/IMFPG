export interface Student {
  retakes: any[];
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status: "Active" | "Inactive" | "Graduated";
  guardians: Guardian[];
  enrollments?: Enrollment[];
  grades?: Grade[];
  createdAt: string;
}

// types/academic.ts
export interface Enrollment {
  id: string;
  studentId: string;
  faculty: string; // Nom de la faculté (pour l'affichage)
  facultyId?: string; // ID de la faculté (pour l'API)
  level: string;
  academicYear: string; // Année académique (pour l'affichage)
  academicYearId?: string; // ID de l'année académique (pour l'API)
  status: "Active" | "Suspended" | "Completed";
  enrollmentDate: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations optionnelles pour l'affichage
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
}

export interface CreateEnrollmentData {
  studentId: string;
  faculty: string;
  level: string;
  academicYearId: string;
  // academicYear: string; // ✅ requis
  status: "Active" | "Suspended" | "Completed";
  enrollmentDate: string;
}

export interface UpdateEnrollmentData {
  faculty?: string;
  level?: string;
  academicYear?: string;
  status?: "Active" | "Suspended" | "Completed";
}

export interface Guardian {
  id?: string;
  firstName: string;
  lastName: string;
  studentId: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  passingGrade: number;
  type: "Obligatoire" | "Optionnelle";
  prerequisites: string[];
  inCatalog?: boolean;
}

// export interface Grade {
//   id: string;
//   studentId: string;
//   ueId: string;
//   grade: number;
//   status: "Validé" | "À reprendre" | "En cours";
//   session: "Normale" | "Rattrapage";
//   semester: string;
//   academicYear: string;
// }

export interface Retake {
  id: string;
  studentId: string;
  ueId: string;
  originalGrade: number;
  retakeGrade?: number;
  scheduledSemester: string;
  status: "Programmé" | "En cours" | "Terminé";
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Professeur" | "Secrétaire" | "Directeur";
  status: "Actif" | "Inactif";
  lastLogin?: string;
  avatar?: string;
  createdAt: string;
}

export interface FacultyLevel {
  id: string;
  level: string;
  facultyId: string;
  assignments?: any[]; // Ajouté pour la relation
}

export interface FacultyWithLevels {
  id: string;
  name: string;
  code: string;
  description?: string;
  dean?: string;
  studentsCount?: number; // Rendre optionnel
  coursesCount?: number; // Rendre optionnel
  studyDuration: number;
  levels: FacultyLevel[];
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
  assignments?: any[];
  _count?: {
    assignments: number;
  };
}
// Nouvelles interfaces pour les fonctionnalités ajoutées
export interface Schedule {
  id: string;
  ueId: string;
  professorId: string;
  classroom: string;
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.
  startTime: string;
  endTime: string;
  faculty: string;
  level: string;
  semester: "S1" | "S2";
  academicYear: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  scheduleId: string;
  date: string;
  status: "Présent" | "Absent" | "Retard" | "Excusé";
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
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

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  faculty: string;
  quantity: number;
  available: number;
  location: string;
  status: "Disponible" | "Épuisé" | "En commande";
}

export interface BookLoan {
  id: string;
  bookId: string;
  studentId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: "En cours" | "Retourné" | "En retard" | "Perdu";
  renewalCount: number;
  fine?: number;
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

// Nouvelles interfaces pour les fonctionnalités avancées
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
  priority: "Normal" | "Urgent" | "Important";
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

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  criteria: string;
  applicationDeadline: string;
  academicYear: string;
  maxRecipients: number;
  currentRecipients: number;
  status: "Ouvert" | "Fermé" | "En évaluation" | "Attribué";
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  applicationDate: string;
  documents: string[];
  motivation: string;
  status: "Soumise" | "En cours" | "Acceptée" | "Refusée";
  reviewNotes?: string;
}

export interface Room {
  id: string;
  name: string;
  type:
    | "Amphithéâtre"
    | "Salle de cours"
    | "Laboratoire"
    | "Bibliothèque"
    | "Bureau";
  capacity: number;
  equipment: string[];
  location: string;
  status: "Disponible" | "Occupée" | "Maintenance" | "Réservée";
}

export interface RoomReservation {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Confirmée" | "En attente" | "Annulée";
  recurring?: {
    frequency: "Quotidien" | "Hebdomadaire" | "Mensuel";
    endDate: string;
  };
}

export interface Certificate {
  id: string;
  studentId: string;
  type: "Diplôme" | "Certificat" | "Attestation" | "Relevé de notes";
  title: string;
  issueDate: string;
  validUntil?: string;
  signedBy: string;
  verificationCode: string;
  status: "Émis" | "En préparation" | "Annulé";
}

export interface Analytics {
  id: string;
  type: "Performance" | "Présence" | "Paiements" | "Général";
  data: Record<string, any>;
  generatedDate: string;
  parameters: Record<string, any>;
}

// types/academic.ts
export interface CourseAssignment {
  id: string;
  ueId: string;
  facultyId: string;
  professeurId: string;
  academicYearId: string;
  semester: "S1" | "S2";
  level: string;
  facultyLevelId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Relations (optionnelles, pour l'UI)
  ue?: UE;
  faculty?: FacultyWithLevels;
  professeur?: Professeur;
  academicYear?: AcademicYear;
}

export interface UE {
  semester: string;
  facultyId: string;
  level: string;
  id: string;
  code: string;
  title: string;
  credits: number;
  type: UEType;
  passingGrade: number;
  description?: string;
  objectives?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  createdById: string;
  prerequisites: UEPrerequisite[];
  requiredFor: UEPrerequisite[];
  assignments: CourseAssignment[];
  grades: Grade[];
  retakes: Retake[];
  inCatalog: boolean;
}

export interface UEPrerequisite {
  id: string;
  ueId: string;
  prerequisiteId: string;
  ue: UE;
  prerequisite: UE;
  createdAt: string;
}

export type UEType = "Obligatoire" | "Optionnelle";

export interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  status: "Actif" | "Inactif";
  createdAt: string;
  updatedAt?: string;
}

// types/academic.ts
export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
export type GradeSession = "Normale" | "Rattrapage";
export type GradeStatus = "Valide" | "AReprendre" | "EnCours";

// types/academic.ts
export interface Grade {
  id: string;
  studentId: string;
  ueId: string;
  grade: number;
  status: GradeStatus;
  session: GradeSession;
  semester: "S1" | "S2";
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  level: string;
}

export interface GradeWithDetails extends Grade {
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
  ue: {
    code: string;
    title: string;
    credits: number;
  };
}
