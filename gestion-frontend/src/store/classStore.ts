/**
 * @file classStore.ts
 * @description Store Zustand pour la gestion des classes
 */

import { create } from "zustand";

// Types
export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    students: number;
    schedules: number;
    enrollments: number;
  };
}

export interface ClassSchedule {
  id: string;
  classroom?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Interfaces pour les filtres
interface ClassFilters {
  search?: string;
  level?: string;
  academicYearId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface pour l'état du store
interface ClassStore {
  // État
  classes: SchoolClass[];
  currentClass: SchoolClass | null;
  classSchedules: ClassSchedule[];
  loading: boolean;
  error: string | null;
  filters: ClassFilters;

  // Données complémentaires
  academicYears: any[];
  availableTeachers: any[];

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<ClassFilters>) => void;
  fetchClasses: () => Promise<void>;
  fetchClassById: (id: string) => Promise<SchoolClass>;
  fetchClassSchedules: (classId: string) => Promise<void>;
  createClass: (classData: CreateClassData) => Promise<SchoolClass>;
  updateClass: (id: string, classData: UpdateClassData) => Promise<SchoolClass>;
  deleteClass: (id: string) => Promise<void>;
  fetchAcademicYears: () => Promise<void>;
  fetchAvailableTeachers: () => Promise<void>;
  clearCurrentClass: () => void;
  clearError: () => void;
  clearClasses: () => void;
}

interface CreateClassData {
  name?: string;
  level?: string;
  capacity?: number;
}

interface UpdateClassData {
  name?: string;
  level?: string;
  capacity?: number;
  status?: string;
}

// Import de l'API
import api from "../services/api";

export const useClassStore = create<ClassStore>((set, get) => ({
  // État initial
  classes: [],
  currentClass: null,
  classSchedules: [],
  loading: false,
  error: null,

  filters: {
    search: "",
    level: "",
    status: "Active",
    page: 1,
    limit: 20,
    sortBy: "name",
    sortOrder: "asc",
  },

  academicYears: [],
  availableTeachers: [],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    }));
    get().fetchClasses();
  },

  fetchClasses: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = get();

      const response = await api.get("/classes", {
        params: {
          search: filters.search || undefined,
          level: filters.level || undefined,
          academicYearId: filters.academicYearId || undefined,
          status: filters.status || undefined,
          page: filters.page || 1,
          limit: filters.limit || 20,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
      });

      const { classes, academicYears, pagination } = response.data.data;

      set({
        classes,
        academicYears,
        loading: false,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        },
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des classes",
        loading: false,
      });
    }
  },

  fetchClassById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/classes/${id}`);
      const { class: schoolClass, availableTeachers } = response.data.data;

      set({
        currentClass: schoolClass,
        availableTeachers,
        loading: false,
      });

      return schoolClass;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchClassSchedules: async (classId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/classes/${classId}/schedules`);
      const schedules = response.data.data.schedules;

      set({
        classSchedules: schedules,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur de chargement des horaires",
        loading: false,
      });
      throw error;
    }
  },

  createClass: async (classData: CreateClassData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/classes", classData);
      const newClass = response.data.data.class;

      set((state) => ({
        classes: [newClass, ...state.classes],
        loading: false,
      }));

      return newClass;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateClass: async (id: string, classData: UpdateClassData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/classes/${id}`, classData);
      const updatedClass = response.data.data.class;

      set((state) => ({
        classes: state.classes.map((cls) =>
          cls.id === id ? updatedClass : cls
        ),
        currentClass: updatedClass,
        loading: false,
      }));

      return updatedClass;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteClass: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/classes/${id}`);

      set((state) => ({
        classes: state.classes.filter((cls) => cls.id !== id),
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

  fetchAcademicYears: async () => {
    try {
      const response = await api.get("/academic-years");
      const years = response.data.data;

      set({ academicYears: years });
    } catch (error: any) {
      console.error("Erreur lors du chargement des années académiques:", error);
    }
  },

  fetchAvailableTeachers: async () => {
    try {
      const response = await api.get("/professeurs/available");
      const teachers = response.data.data.professeurs;

      set({ availableTeachers: teachers });
    } catch (error: any) {
      console.error("Erreur lors du chargement des professeurs:", error);
    }
  },

  clearCurrentClass: () =>
    set({
      currentClass: null,
      classSchedules: [],
    }),

  clearError: () => set({ error: null }),

  clearClasses: () =>
    set({
      classes: [],
      currentClass: null,
      classSchedules: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));

export default useClassStore;
