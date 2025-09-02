import { create } from "zustand";
import api from "../services/api";
import { UE, UEPrerequisite } from "../types/academic";

interface UEState {
  ues: UE[];
  currentUE: UE | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  fetchUEs: (
    filters?: UEFilters,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchUEById: (id: string) => Promise<void>;
  createUE: (
    ueData: Omit<UE, "id" | "createdAt" | "updatedAt" | "createdBy"> & {
      createdById: string;
    }
  ) => Promise<void>;
  updateUE: (id: string, ueData: Partial<UE>) => Promise<void>;
  deleteUE: (id: string) => Promise<void>;
  addPrerequisite: (ueId: string, prerequisiteId: string) => Promise<void>;
  removePrerequisite: (ueId: string, prerequisiteId: string) => Promise<void>;
  searchUEs: (query: string) => Promise<UE[]>;
  getUEStats: (ueId: string) => Promise<any>;
}

interface UEFilters {
  type?: string;
  search?: string;
}

export const useUEStore = create<UEState>((set, get) => ({
  ues: [],
  currentUE: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  fetchUEs: async (filters = {}, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/ues?${params}`);
      set({
        ues: response.data.ues,
        pagination: response.data.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchUEById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/ues/${id}`);
      set({ currentUE: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  createUE: async (ueData) => {
    set({ loading: true });
    try {
      const payload = {
        code: ueData.code,
        title: ueData.title,
        credits: ueData.credits,
        type: ueData.type,
        passingGrade: ueData.passingGrade,
        description: ueData.description,
        createdBy: ueData.createdById,
        prerequisites: ueData.prerequisites?.map((prerequis) => {
          ueId: prerequis.ueId;
        }),
      };
      const response = await api.post("/ues", payload);
      set((state) => ({
        ues: [...state.ues, response.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateUE: async (id, ueData) => {
    set({ loading: true });
    try {
      const response = await api.put(`/ues/${id}`, ueData);
      set((state) => ({
        ues: state.ues.map((ue) => (ue.id === id ? response.data : ue)),
        currentUE: state.currentUE?.id === id ? response.data : state.currentUE,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteUE: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/ues/${id}`);
      set((state) => ({
        ues: state.ues.filter((ue) => ue.id !== id),
        currentUE: state.currentUE?.id === id ? null : state.currentUE,
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

  addPrerequisite: async (ueId, prerequisiteId) => {
    set({ loading: true });
    try {
      const response = await api.post(`/ues/${ueId}/prerequisites`, {
        prerequisiteId,
      });
      set((state) => ({
        currentUE:
          state.currentUE?.id === ueId
            ? {
                ...state.currentUE,
                prerequisites: [
                  ...state.currentUE.prerequisites,
                  response.data,
                ],
              }
            : state.currentUE,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'ajout de prérequis",
        loading: false,
      });
      throw error;
    }
  },

  removePrerequisite: async (ueId, prerequisiteId) => {
    set({ loading: true });
    try {
      await api.delete(`/ues/${ueId}/prerequisites/${prerequisiteId}`);
      set((state) => ({
        currentUE:
          state.currentUE?.id === ueId
            ? {
                ...state.currentUE,
                prerequisites: state.currentUE.prerequisites.filter(
                  (p) => p.prerequisiteId !== prerequisiteId
                ),
              }
            : state.currentUE,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur de suppression de prérequis",
        loading: false,
      });
      throw error;
    }
  },

  searchUEs: async (query: string) => {
    set({ loading: true });
    try {
      const response = await api.get(
        `/ues/search?q=${encodeURIComponent(query)}`
      );
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de recherche",
        loading: false,
      });
      throw error;
    }
  },

  getUEStats: async (ueId: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/ues/${ueId}/stats`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur de chargement des statistiques",
        loading: false,
      });
      throw error;
    }
  },
}));
