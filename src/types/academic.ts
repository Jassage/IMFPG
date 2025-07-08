
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
