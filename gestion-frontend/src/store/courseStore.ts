// src/store/courseStore.ts
import { create } from "zustand";
import api from "../services/api";
import { CreateUEData, UE, UpdateUEData } from "../types/academic";
import { toast } from "@/hooks/use-toast";

interface UEFilters {
  type?: string;
  search?: string;
  facultyId?: string;
  level?: string;
  inCatalog?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UEState {
  ues: UE[];
  allUEs: UE[];
  currentUE: UE | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: UEFilters;

  // Actions
  fetchUEs: (filters?: UEFilters) => Promise<void>;
  fetchUEById: (id: string) => Promise<void>;
  createUE: (ueData: CreateUEData) => Promise<UE>;
  updateUE: (id: string, ueData: UpdateUEData) => Promise<void>;
  deleteUE: (id: string) => Promise<void>;

  // Gestion des prérequis
  addPrerequisite: (ueId: string, prerequisiteId: string) => Promise<void>;
  removePrerequisite: (ueId: string, prerequisiteId: string) => Promise<void>;

  // Recherche et statistiques
  searchUEs: (query: string) => Promise<UE[]>;
  getUEStats: (ueId: string) => Promise<any>;
  getAllUEs: (filters?: UEFilters) => Promise<void>;
  exportUEs: () => Promise<void>;
  importUEs: (file: File, createdById: string) => Promise<any>;
  downloadTemplate: () => Promise<void>;
  // Pagination frontend
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setFilters: (filters: UEFilters) => void;
  clearFilters: () => void;
  applySearch: (searchTerm: string) => void;
  refreshUEs: () => Promise<void>;
}

export const useUEStore = create<UEState>((set, get) => ({
  ues: [],
  allUEs: [],
  currentUE: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},

  fetchUEs: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.append(key, value.toString());
        }
      });

      // console.log(`🔄 Fetching all UEs: /ues?${params.toString()}`);

      const response = await api.get(`/ues?${params}`);
      const allUEs = response.data || [];

      const state = get();
      const { page, limit } = state.pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUEs = allUEs.slice(startIndex, endIndex);

      set({
        allUEs,
        ues: paginatedUEs,
        pagination: {
          ...state.pagination,
          total: allUEs.length,
          pages: Math.ceil(allUEs.length / limit),
        },
        filters,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("❌ Erreur fetchUEs:", error);
      set({
        error: error.response?.data?.message || "Erreur de chargement des UEs",
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
        error: error.response?.data?.message || "Erreur de chargement de l'UE",
        loading: false,
      });
      throw error;
    }
  },

  getAllUEs: async (filters = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      const response = await api.get("/ues?limit=1000");
      const allUEs = response.data || [];
      set({
        ues: allUEs,
        filters,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement de l'UE",
        loading: false,
      });
      throw error;
    }
  },

  createUE: async (ueData: CreateUEData) => {
    set({ loading: true });
    try {
      const payload = {
        code: ueData.code,
        title: ueData.title,
        credits: ueData.credits,
        type: ueData.type,
        passingGrade: ueData.passingGrade || 60,
        description: ueData.description || "",
        objectives: ueData.objectives || "",
        createdById: ueData.createdById,
        prerequisites: ueData.prerequisites || [],
      };

      console.log("📤 Payload création UE:", payload);

      const response = await api.post("/ues", payload);

      // Recharger les données
      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur de création de l'UE";
      console.error("❌ Erreur création UE:", error.response?.data);
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  updateUE: async (id: string, ueData: UpdateUEData) => {
    set({ loading: true });
    try {
      const response = await api.put(`/ues/${id}`, ueData);

      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur de modification de l'UE",
        loading: false,
      });
      throw error;
    }
  },

  deleteUE: async (id: string) => {
    set({ loading: true });
    try {
      await api.delete(`/ues/${id}`);

      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de suppression de l'UE",
        loading: false,
      });
      throw error;
    }
  },

  addPrerequisite: async (ueId: string, prerequisiteId: string) => {
    set({ loading: true });
    try {
      await api.post(`/ues/${ueId}/prerequisites`, {
        prerequisiteId,
      });

      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'ajout de prérequis",
        loading: false,
      });
      throw error;
    }
  },

  removePrerequisite: async (ueId: string, prerequisiteId: string) => {
    set({ loading: true });
    try {
      await api.delete(`/ues/${ueId}/prerequisites/${prerequisiteId}`);

      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });
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
  exportUEs: async () => {
    set({ loading: true, error: null });
    try {
      console.log("📤 Export UEs...");

      const response = await api.get("/ues/export", {
        responseType: "blob",
      });

      // Créer et télécharger le fichier
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `export_ues_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ loading: false });

      toast({
        title: "✅ Export réussi",
        description: "Le fichier Excel a été téléchargé",
      });
    } catch (error: any) {
      console.error("❌ Erreur export UEs:", error);
      set({
        error: error.response?.data?.message || "Erreur lors de l'export",
        loading: false,
      });
      throw error;
    }
  },

  importUEs: async (file: File, createdById: string) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("createdById", createdById);

      console.log("📤 Import UEs depuis fichier:", file.name);

      const response = await api.post("/ues/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Recharger les données après import
      const state = get();
      await state.fetchUEs(state.filters);

      set({ loading: false });

      toast({
        title: "✅ Import réussi",
        description: `${response.data.summary.success} UEs importées avec succès`,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Erreur import UEs:", error);
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'import";
      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "❌ Erreur d'import",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  downloadTemplate: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/ues/template", {
        responseType: "blob",
      });

      // Créer et télécharger le template
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-import-ues.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ loading: false });

      toast({
        title: "📥 Template téléchargé",
        description: "Le template d'import a été téléchargé",
      });
    } catch (error: any) {
      console.error("❌ Erreur téléchargement template:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du téléchargement du template",
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

  setPage: (page: number) => {
    const state = get();
    const { allUEs, pagination } = state;
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedUEs = allUEs.slice(startIndex, endIndex);

    set({
      ues: paginatedUEs,
      pagination: {
        ...pagination,
        page,
      },
    });
  },

  setItemsPerPage: (limit: number) => {
    const state = get();
    const { allUEs } = state;
    const startIndex = 0;
    const endIndex = startIndex + limit;
    const paginatedUEs = allUEs.slice(startIndex, endIndex);

    set({
      ues: paginatedUEs,
      pagination: {
        page: 1,
        limit,
        total: allUEs.length,
        pages: Math.ceil(allUEs.length / limit),
      },
    });
  },

  setFilters: (filters: UEFilters) => {
    const state = get();
    state.fetchUEs({ ...state.filters, ...filters });
  },

  clearFilters: () => {
    const state = get();
    state.fetchUEs({});
  },

  applySearch: (searchTerm: string) => {
    const state = get();
    const filters = { ...state.filters, search: searchTerm };
    state.fetchUEs(filters);
  },

  refreshUEs: async () => {
    const state = get();
    await state.fetchUEs(state.filters);
  },
}));
