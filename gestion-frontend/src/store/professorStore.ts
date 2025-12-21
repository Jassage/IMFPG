/**
 * @file professeurStore.ts
 * @description Store Zustand pour la gestion des professeurs
 */

import { create } from "zustand";

// Types
export interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  status: "Actif" | "Inactif";
  matricule?: string;
  address?: string;
  qualifications?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: {
    [x: string]: any;
    id: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
    emailVerified?: boolean;
  };
  _count?: {
    assignments: number;
    schedules: number;
    classes?: number;
  };
  assignments?: ProfesseurAssignment[];
  schedules?: ProfesseurSchedule[];
}

export interface ProfesseurSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom?: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  schoolClass?: {
    id: string;
    name: string;
    level: string;
  };
  classAssignment?: {
    subject: {
      id: string;
      name: string;
      code: string;
    };
    academicYear: {
      id: string;
      year: string;
    };
  };
}

export interface ProfesseurAssignment {
  id: string;
  classLevel: string;
  status: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  academicYear: {
    id: string;
    year: string;
    isCurrent: boolean;
  };
  schedules: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classroom?: string;
    schoolClass?: {
      id: string;
      name: string;
      level: string;
    };
  }>;
  _count?: {
    schedules: number;
    grades: number;
  };
}

// Interfaces pour les filtres
interface ProfesseurFilters {
  search?: string;
  status?: string;
  speciality?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateProfesseurData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  matricule?: string;
  address?: string;
  qualifications?: string;
  userId?: string;
  status?: "Actif" | "Inactif";
}

interface UpdateProfesseurData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  status?: "Actif" | "Inactif";
  matricule?: string;
  address?: string;
  qualifications?: string;
  userId?: string | null;
}

// Interface pour l'état du store
interface ProfesseurStore {
  // État
  professeurs: Professeur[];
  currentProfesseur: Professeur | null;
  professeurSchedule: ProfesseurSchedule[];
  professeurAssignments: ProfesseurAssignment[];
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  filters: ProfesseurFilters;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<ProfesseurFilters>) => void;
  fetchProfesseurs: () => Promise<void>;
  fetchProfesseurById: (id: string) => Promise<Professeur>;
  fetchProfesseurFullDetails: (id: string) => Promise<Professeur>;
  fetchProfesseurSchedule: (id: string) => Promise<void>;
  fetchProfesseurAssignments: (id: string) => Promise<void>;
  createProfesseur: (
    professeurData: CreateProfesseurData
  ) => Promise<Professeur>;
  updateProfesseur: (
    id: string,
    professeurData: UpdateProfesseurData
  ) => Promise<Professeur>;
  deleteProfesseur: (id: string) => Promise<void>;
  activateProfesseur: (id: string) => Promise<Professeur>;
  deactivateProfesseur: (id: string) => Promise<Professeur>;
  clearCurrentProfesseur: () => void;
  clearError: () => void;
  clearProfesseurs: () => void;
}

// Import de l'API
import api from "../services/api";

export const useProfesseurStore = create<ProfesseurStore>((set, get) => ({
  // État initial
  professeurs: [],
  currentProfesseur: null,
  professeurSchedule: [],
  professeurAssignments: [],
  loading: false,
  loadingDetails: false,
  error: null,

  filters: {
    search: "",
    status: "",
    speciality: "",
    page: 1,
    limit: 20,
    sortBy: "lastName",
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
      filters: { ...state.filters, ...filters, page: 1 },
    }));
    get().fetchProfesseurs();
  },

  fetchProfesseurs: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = get();

      const response = await api.get("/professeurs", {
        params: {
          search: filters.search || undefined,
          status: filters.status || undefined,
          speciality: filters.speciality || undefined,
          page: filters.page || 1,
          limit: filters.limit || 20,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
      });

      const { professeurs, pagination } = response.data.data;

      set({
        professeurs,
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
          "Erreur lors du chargement des professeurs",
        loading: false,
      });
    }
  },

  fetchProfesseurById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/professeurs/${id}`);
      const professeur = response.data.data.professeur;

      set({
        currentProfesseur: professeur,
        loading: false,
      });

      return professeur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchProfesseurFullDetails: async (id: string) => {
    set({ loadingDetails: true, error: null });

    try {
      const response = await api.get(`/professeurs/${id}/full-details`);
      const { professeur, scheduleByDay, stats } = response.data.data;

      // Convertir l'objet scheduleByDay en tableau plat
      const scheduleArray: ProfesseurSchedule[] = [];
      if (scheduleByDay) {
        Object.entries(scheduleByDay).forEach(
          ([day, schedules]: [string, any]) => {
            schedules.forEach((schedule: any) => {
              scheduleArray.push({
                ...schedule,
                dayOfWeek: parseInt(day),
              });
            });
          }
        );
      }

      set({
        currentProfesseur: professeur,
        professeurSchedule: scheduleArray,
        professeurAssignments: professeur.assignments || [],
        loadingDetails: false,
      });

      return professeur;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des détails",
        loadingDetails: false,
      });
      throw error;
    }
  },

  fetchProfesseurSchedule: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/professeurs/${id}/schedule`);
      const { scheduleByDay, totalSessions } = response.data.data;

      // Convertir l'objet en tableau plat
      const scheduleArray: ProfesseurSchedule[] = [];
      if (scheduleByDay) {
        Object.entries(scheduleByDay).forEach(
          ([day, schedules]: [string, any]) => {
            schedules.forEach((schedule: any) => {
              scheduleArray.push({
                ...schedule,
                dayOfWeek: parseInt(day),
              });
            });
          }
        );
      }

      set({
        professeurSchedule: scheduleArray,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur de chargement de l'emploi du temps",
        loading: false,
      });
      throw error;
    }
  },

  fetchProfesseurAssignments: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/class-assignments/professor/${id}`);
      const assignments = response.data.data.assignments || [];

      set({
        professeurAssignments: assignments,
        loading: false,
      });

      return assignments;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur de chargement des assignations",
        loading: false,
      });
      throw error;
    }
  },

  createProfesseur: async (professeurData: CreateProfesseurData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/professeurs", professeurData);
      const newProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: [newProfesseur, ...state.professeurs],
        loading: false,
      }));

      return newProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateProfesseur: async (
    id: string,
    professeurData: UpdateProfesseurData
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/professeurs/${id}`, professeurData);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/professeurs/${id}`);

      set((state) => ({
        professeurs: state.professeurs.filter((prof) => prof.id !== id),
        currentProfesseur: null,
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

  activateProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.patch(`/professeurs/${id}/activate`);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'activation",
        loading: false,
      });
      throw error;
    }
  },

  deactivateProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.patch(`/professeurs/${id}/deactivate`);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de désactivation",
        loading: false,
      });
      throw error;
    }
  },

  attachUserToProfesseur: async (professeurId, userData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/professeurs/${professeurId}/attach-user`,
        userData
      );
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === professeurId ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de l'association",
        loading: false,
      });
      throw error;
    }
  },

  detachUserFromProfesseur: async (professeurId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.delete(
        `/professeurs/${professeurId}/detach-user`
      );
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === professeurId ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors du détachement",
        loading: false,
      });
      throw error;
    }
  },

  sendInvitationEmail: async (professeurId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(`/auth/send-invitation/${professeurId}`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'envoi d'invitation",
        loading: false,
      });
      throw error;
    }
  },

  clearCurrentProfesseur: () =>
    set({
      currentProfesseur: null,
      professeurSchedule: [],
      professeurAssignments: [],
    }),

  clearError: () => set({ error: null }),

  clearProfesseurs: () =>
    set({
      professeurs: [],
      currentProfesseur: null,
      professeurSchedule: [],
      professeurAssignments: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));

export default useProfesseurStore;
