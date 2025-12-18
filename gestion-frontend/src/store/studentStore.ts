// store/studentStore.ts - VERSION CORRIGÉE ET COMPLÈTE
import { create } from "zustand";
import { Student } from "@/types/academic";
import api from "@/services/api";

interface StudentFilters {
  status?: string;
  classId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StudentManagementState {
  // État
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;

  // Filtres et pagination
  filters: StudentFilters;
  pagination: Pagination;

  // Actions
  setFilters: (filters: Partial<StudentFilters>) => void;
  fetchStudents: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchStudentById: (id: string) => Promise<Student>;
  createStudent: (studentData: CreateStudentData) => Promise<Student>;
  updateStudent: (
    id: string,
    studentData: Partial<Student>
  ) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudentStatus: (
    id: string,
    status: Student["status"],
    reason?: string
  ) => Promise<Student>;
  assignStudentToClass: (
    studentId: string,
    classId: string
  ) => Promise<Student>;
  getStatistics: () => Promise<any>;
  importStudents: (students: any[]) => Promise<any>;
  exportStudents: (filters?: any) => Promise<any>;
  clearError: () => void;
  clearStudents: () => void;
}

interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: Student["status"];
  sexe?: string;
  cin?: string;
  classId?: string;
  createUserAccount?: boolean;
  guardians?: any[];
}

export const useStudentStore = create<StudentManagementState>((set, get) => ({
  students: [],
  currentStudent: null,
  loading: false,
  error: null,

  filters: {
    status: "",
    classId: "",
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  fetchStudents: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const { search = "", page = 1, limit = 20 } = params;

      const response = await api.get("/students", {
        params: {
          search: search || undefined,
          status: filters.status || undefined,
          classId: filters.classId || undefined,
          page,
          limit,
        },
      });

      const { data } = response.data;
      const students = data.students || [];
      const pagination = data.pagination || {
        page,
        limit,
        total: students.length,
        totalPages: 1,
      };

      set({
        students,
        loading: false,
        pagination,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des étudiants",
        loading: false,
      });
      throw error;
    }
  },

  fetchStudentById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/students/${id}`);

      const { data } = response.data;
      const student = data.student;

      set({ loading: false, currentStudent: student });
      return student;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  createStudent: async (studentData: CreateStudentData) => {
    set({ loading: true, error: null });
    try {
      console.log("donnees du Store:", studentData);

      const response = await api.post("/students", studentData);
      const { data } = response.data;
      const newStudent = data.student;

      set((state) => ({
        students: [newStudent, ...state.students],
        loading: false,
      }));

      return newStudent;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/students/${id}`, studentData);
      const { data } = response.data;
      const updatedStudent = data.student;

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? updatedStudent : student
        ),
        currentStudent:
          state.currentStudent?.id === id
            ? updatedStudent
            : state.currentStudent,
        loading: false,
      }));

      return updatedStudent;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/students/${id}`);

      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de suppression",
        loading: false,
      });
      throw error;
    }
  },

  updateStudentStatus: async (
    id: string,
    status: Student["status"],
    reason?: string
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/students/${id}/status`, {
        status,
        reason,
      });
      const { data } = response.data;
      const updatedStudent = data.student;

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? updatedStudent : student
        ),
        loading: false,
      }));

      return updatedStudent;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du changement de statut",
        loading: false,
      });
      throw error;
    }
  },

  assignStudentToClass: async (studentId: string, classId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/students/${studentId}/assign-class`, {
        classId,
      });
      const { data } = response.data;
      const updatedStudent = data.student;

      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId ? updatedStudent : student
        ),
        loading: false,
      }));

      return updatedStudent;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de l'affectation à la classe",
        loading: false,
      });
      throw error;
    }
  },

  getStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/students/statistics");
      const { data } = response.data;
      set({ loading: false });
      return data.statistics;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la récupération des statistiques",
        loading: false,
      });
      throw error;
    }
  },

  importStudents: async (students: any[]) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/students/import", { students });
      const { data } = response.data;
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de l'import",
        loading: false,
      });
      throw error;
    }
  },

  exportStudents: async (filters?: any) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/students/export", {
        params: filters,
        responseType: "blob",
      });
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de l'export",
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearStudents: () => set({ students: [], currentStudent: null, error: null }),
}));

export default useStudentStore;
