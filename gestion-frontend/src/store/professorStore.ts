import { create } from "zustand";
import api from "../services/api";
import { Professeur, CourseAssignment } from "../types/academic";

interface ProfessorStore {
  professors: Professeur[];
  assignments: CourseAssignment[];
  loading: boolean;
  error: string | null;
  fetchProfessors: () => Promise<void>;
  fetchProfessorAssignments: (professorId: string) => Promise<void>;
  addProfessor: (
    professor: Omit<Professeur, "id" | "createdAt">
  ) => Promise<void>;
  updateProfessor: (
    id: string,
    professor: Partial<Professeur>
  ) => Promise<void>;
  deleteProfessor: (id: string) => Promise<void>;
  assignCourse: (
    assignment: Omit<CourseAssignment, "id" | "createdAt">
  ) => Promise<void>;
  removeAssignment: (assignmentId: string) => Promise<void>;
  bulkUpdateStatus: (
    professorIds: string[],
    status: "Actif" | "Inactif"
  ) => Promise<void>;
}

export const useProfessorStore = create<ProfessorStore>((set, get) => ({
  professors: [],
  assignments: [],
  loading: false,
  error: null,

  fetchProfessors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/professeurs");
      set({ professors: response.data, loading: false });
    } catch (error) {
      set({ error: "Erreur lors du chargement", loading: false });
    }
  },

  fetchProfessorAssignments: async (professorId: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/professeurs/${professorId}/assignments`);
      set({ assignments: response.data, loading: false });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des affectations",
        loading: false,
      });
    }
  },

  bulkUpdateStatus: async (
    professorIds: string[],
    status: "Actif" | "Inactif"
  ) => {
    set({ loading: true, error: null });
    try {
      // Simulation d'une API call - remplacez par votre appel API réel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mise à jour localement dans le store
      set((state) => ({
        professors: state.professors.map((professor) =>
          professorIds.includes(professor.id)
            ? { ...professor, status }
            : professor
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la mise à jour",
        loading: false,
      });
      throw error;
    }
  },

  addProfessor: async (professor) => {
    set({ loading: true });
    try {
      const response = await api.post("/professeurs", professor);
      set((state) => ({
        professors: [...state.professors, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de l'ajout", loading: false });
      throw error;
    }
  },

  updateProfessor: async (id, professor) => {
    set({ loading: true });
    try {
      const response = await api.put(`/professeurs/${id}`, professor);
      set((state) => ({
        professors: state.professors.map((p) =>
          p.id === id ? response.data : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de la modification", loading: false });
      throw error;
    }
  },

  deleteProfessor: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/professeurs/${id}`);
      set((state) => ({
        professors: state.professors.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de la suppression", loading: false });
      throw error;
    }
  },

  assignCourse: async (assignment) => {
    set({ loading: true });
    try {
      const response = await api.post("/course-assignments", assignment);
      set((state) => ({
        assignments: [...state.assignments, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de l'affectation", loading: false });
      throw error;
    }
  },

  removeAssignment: async (assignmentId) => {
    set({ loading: true });
    try {
      await api.delete(`/course-assignments/${assignmentId}`);
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== assignmentId),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de la suppression", loading: false });
      throw error;
    }
  },
}));
