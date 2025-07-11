
export interface Student {
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
  faculty: string;
  level: string;
  academicYear: string;
  status: 'Active' | 'Inactive' | 'Graduated';
}

export interface Guardian {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  signature?: string;
}

export interface UE {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: 'Obligatoire' | 'Optionnelle';
  passingGrade: number;
  faculty: string;
  level: string;
  semester: 'S1' | 'S2';
  prerequisites: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  ueId: string;
  grade: number;
  status: 'Validé' | 'À reprendre' | 'En cours';
  session: 'Normale' | 'Rattrapage';
  semester: string;
  academicYear: string;
}

export interface Retake {
  id: string;
  studentId: string;
  ueId: string;
  originalGrade: number;
  retakeGrade?: number;
  scheduledSemester: string;
  status: 'Programmé' | 'En cours' | 'Terminé';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Professeur' | 'Secrétaire' | 'Directeur';
  status: 'Actif' | 'Inactif';
  lastLogin: string;
  avatar?: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description: string;
  dean: string;
  studentsCount: number;
  coursesCount: number;
  levels: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
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
  semester: 'S1' | 'S2';
  academicYear: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  scheduleId: string;
  date: string;
  status: 'Présent' | 'Absent' | 'Retard' | 'Excusé';
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'Inscription' | 'Scolarité' | 'Examen' | 'Certificat' | 'Autre';
  status: 'Payé' | 'En attente' | 'Retard' | 'Annulé';
  dueDate: string;
  paidDate?: string;
  description: string;
  academicYear: string;
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
  status: 'Disponible' | 'Épuisé' | 'En commande';
}

export interface BookLoan {
  id: string;
  bookId: string;
  studentId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'En cours' | 'Retourné' | 'En retard' | 'Perdu';
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
