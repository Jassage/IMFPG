
import { create } from 'zustand';
import { Student, UE, Grade, Retake, Guardian, User, Faculty } from '../types/academic';

interface AcademicStore {
  students: Student[];
  ues: UE[];
  grades: Grade[];
  retakes: Retake[];
  guardians: Guardian[];
  users: User[];
  faculties: Faculty[];
  
  // Students
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;
  
  // UEs
  addUE: (ue: UE) => void;
  updateUE: (id: string, ue: Partial<UE>) => void;
  deleteUE: (id: string) => void;
  getUEsByLevel: (faculty: string, level: string, semester: string) => UE[];
  
  // Grades
  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  getStudentGrades: (studentId: string) => Grade[];
  updateGradeStatus: (gradeId: string, status: Grade['status']) => void;
  
  // Retakes
  addRetake: (retake: Retake) => void;
  getStudentRetakes: (studentId: string) => Retake[];
  updateRetakeStatus: (retakeId: string, status: Retake['status'], retakeGrade?: number) => void;
  
  // Guardians
  addGuardian: (guardian: Guardian) => void;
  updateGuardian: (id: string, guardian: Partial<Guardian>) => void;
  deleteGuardian: (id: string) => void;
  getStudentGuardians: (studentId: string) => Guardian[];
  
  // Users
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsers: () => User[];
  
  // Faculties
  addFaculty: (faculty: Faculty) => void;
  updateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;
  getFaculties: () => Faculty[];
}

export const useAcademicStore = create<AcademicStore>((set, get) => ({
  students: [],
  ues: [],
  grades: [],
  retakes: [],
  guardians: [],
  users: [],
  faculties: [],
  
  addStudent: (student) => 
    set((state) => ({ students: [...state.students, student] })),
  
  updateStudent: (id, updates) =>
    set((state) => ({
      students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
    })),
    
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter(s => s.id !== id),
      grades: state.grades.filter(g => g.studentId !== id),
      retakes: state.retakes.filter(r => r.studentId !== id),
      guardians: state.guardians.filter(g => g.studentId !== id),
    })),
  
  getStudent: (id) => get().students.find(s => s.id === id),
  
  addUE: (ue) =>
    set((state) => ({ ues: [...state.ues, ue] })),
    
  updateUE: (id, updates) =>
    set((state) => ({
      ues: state.ues.map(ue => ue.id === id ? { ...ue, ...updates } : ue)
    })),
    
  deleteUE: (id) =>
    set((state) => ({
      ues: state.ues.filter(ue => ue.id !== id),
      grades: state.grades.filter(g => g.ueId !== id),
      retakes: state.retakes.filter(r => r.ueId !== id),
    })),
  
  getUEsByLevel: (faculty, level, semester) =>
    get().ues.filter(ue => 
      ue.faculty === faculty && ue.level === level && ue.semester === semester
    ),
  
  addGrade: (grade) =>
    set((state) => ({ grades: [...state.grades, grade] })),
    
  updateGrade: (id, updates) =>
    set((state) => ({
      grades: state.grades.map(g => g.id === id ? { ...g, ...updates } : g)
    })),
  
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
    
  addGuardian: (guardian) =>
    set((state) => ({ guardians: [...state.guardians, guardian] })),
    
  updateGuardian: (id, updates) =>
    set((state) => ({
      guardians: state.guardians.map(g => g.id === id ? { ...g, ...updates } : g)
    })),
    
  deleteGuardian: (id) =>
    set((state) => ({
      guardians: state.guardians.filter(g => g.id !== id)
    })),
    
  getStudentGuardians: (studentId) =>
    get().guardians.filter(g => g.studentId === studentId),
    
  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),
    
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
    })),
    
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter(u => u.id !== id)
    })),
    
  getUsers: () => get().users,
    
  addFaculty: (faculty) =>
    set((state) => ({ faculties: [...state.faculties, faculty] })),
    
  updateFaculty: (id, updates) =>
    set((state) => ({
      faculties: state.faculties.map(f => f.id === id ? { ...f, ...updates } : f)
    })),
    
  deleteFaculty: (id) =>
    set((state) => ({
      faculties: state.faculties.filter(f => f.id !== id)
    })),
    
  getFaculties: () => get().faculties,
}));
