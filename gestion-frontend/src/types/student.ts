import { Grade, Payment, User } from "./academic";

export interface Student {
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

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  academicYear: string;
  capacity?: number;
  currentStudents?: number;
  teacherId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  teacher?: User;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  studentId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  academicYearId?: string;
  enrollmentDate: string | Date;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: Student;
  schoolClass?: SchoolClass;
}

export interface GradeWithDetails {
  id: string;
  studentId: string;
  ueId: string;
  ue?: {
    id: string;
    title: string;
    credits?: number;
  };
  grade: number;
  coefficient?: number;
  evaluationType?: string;
  evaluationDate?: string | Date;
  semester?: string;
  session?: string;
  status?: string;
  academicYearId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
