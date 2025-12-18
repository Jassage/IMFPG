/**
 * @file subjectStore.ts
 * @description Store Zustand pour la gestion des matières
 */

import api from "@/services/api";
import { CreateSubjectData, UpdateSubjectData } from "@/types/academic";
import { SubjectFilters } from "@/types/academic";
import { Subject } from "@/types/academic";
import { create } from "zustand";

interface SubjectStore {
  subjects: Subject[];
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
  filters: SubjectFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<SubjectFilters>) => void;
  fetchSubjects: () => Promise<void>;
  fetchSubjectById: (id: string) => Promise<Subject>;
  createSubject: (subjectData: CreateSubjectData) => Promise<Subject>;
  updateSubject: (
    id: string,
    subjectData: UpdateSubjectData
  ) => Promise<Subject>;
  deleteSubject: (id: string) => Promise<void>;
  clearCurrentSubject: () => void;
  clearError: () => void;
  clearSubjects: () => void;
}

export const useSubjectStore = create<SubjectStore>((set, get) => ({
  // État initial
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    type: "",
    page: 1,
    limit: 20,
    sortBy: "name",
    sortOrder: "asc",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page || 1 },
    }));
  },

  fetchSubjects: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const response = await api.get("/subjects", {
        params: {
          search: filters.search || undefined,
          type: filters.type || undefined,
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
      });

      const { subjects, pagination } = response.data.data;

      set({
        subjects,
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
          "Erreur lors du chargement des matières",
        loading: false,
      });
    }
  },

  fetchSubjectById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/subjects/${id}`);
      const subject = response.data.data.subject;

      set({
        currentSubject: subject,
        loading: false,
      });

      return subject;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de chargement";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  createSubject: async (subjectData: CreateSubjectData) => {
    set({ loading: true, error: null });

    console.log(subjectData);
    try {
      const response = await api.post("/subjects", subjectData);

      const newSubject = response.data.data.subject;

      set((state) => ({
        subjects: [newSubject, ...state.subjects],
        loading: false,
      }));

      return newSubject;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de création";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  updateSubject: async (id: string, subjectData: UpdateSubjectData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/subjects/${id}`, subjectData);
      const updatedSubject = response.data.data.subject;

      set((state) => ({
        subjects: state.subjects.map((subject) =>
          subject.id === id ? updatedSubject : subject
        ),
        currentSubject: updatedSubject,
        loading: false,
      }));

      return updatedSubject;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de modification";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  deleteSubject: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/subjects/${id}`);

      set((state) => ({
        subjects: state.subjects.filter((subject) => subject.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de suppression";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  clearCurrentSubject: () => set({ currentSubject: null }),
  clearError: () => set({ error: null }),
  clearSubjects: () =>
    set({
      subjects: [],
      currentSubject: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));
