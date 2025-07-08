
import { create } from 'zustand';
import { Student, UE, Grade, Retake, Guardian } from '../types/academic';

interface AcademicStore {
  students: Student[];
  ues: UE[];
  grades: Grade[];
  retakes: Retake[];
  guardians: Guardian[];
  
  // Students
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  getStudent: (id: string) => Student | undefined;
  
  // UEs
  addUE: (ue: UE) => void;
  getUEsByLevel: (faculty: string, level: string, semester: string) => UE[];
  
  // Grades
  addGrade: (grade: Grade) => void;
  getStudentGrades: (studentId: string) => Grade[];
  updateGradeStatus: (gradeId: string, status: Grade['status']) => void;
  
  // Retakes
  addRetake: (retake: Retake) => void;
  getStudentRetakes: (studentId: string) => Retake[];
  updateRetakeStatus: (retakeId: string, status: Retake['status'], retakeGrade?: number) => void;
}

export const useAcademicStore = create<AcademicStore>((set, get) => ({
  students: [],
  ues: [],
  grades: [],
  retakes: [],
  guardians: [],
  
  addStudent: (student) => 
    set((state) => ({ students: [...state.students, student] })),
  
  updateStudent: (id, updates) =>
    set((state) => ({
      students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
    })),
  
  getStudent: (id) => get().students.find(s => s.id === id),
  
  addUE: (ue) =>
    set((state) => ({ ues: [...state.ues, ue] })),
  
  getUEsByLevel: (faculty, level, semester) =>
    get().ues.filter(ue => 
      ue.faculty === faculty && ue.level === level && ue.semester === semester
    ),
  
  addGrade: (grade) =>
    set((state) => ({ grades: [...state.grades, grade] })),
  
  getStudentGrades: (studentId) =>
    get().grades.filter(g => g.studentId === studentId),
  
  updateGradeStatus: (gradeId, status) =>
    set((state) => ({
      grades: state.grades.map(g => 
        g.id === gradeId ? { ...g, status } : g
      )
    })),
  
  addRetake: (retake) =>
    set((state) => ({ retakes: [...state.retakes, retake] })),
  
  getStudentRetakes: (studentId) =>
    get().retakes.filter(r => r.studentId === studentId),
    
  updateRetakeStatus: (retakeId, status, retakeGrade) =>
    set((state) => ({
      retakes: state.retakes.map(r => 
        r.id === retakeId ? { ...r, status, retakeGrade } : r
      )
    })),
}));
