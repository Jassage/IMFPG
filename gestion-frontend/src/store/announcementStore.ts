/**
 * @file announcementStore.ts
 * @description Store Zustand pour la gestion des annonces
 */

import { create } from "zustand";

// Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishDate: string;
  expiryDate?: string;
  targetAudience: string;
  priority: string;
  isActive: boolean;
  attachments?: any[];
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

// Interfaces pour les filtres
interface AnnouncementFilters {
  search?: string;
  targetAudience?: string;
  priority?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface pour l'état du store
interface AnnouncementStore {
  // État
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  activeAnnouncements: Announcement[];
  loading: boolean;
  error: string | null;
  filters: AnnouncementFilters;

  // Données complémentaires
  targetAudienceOptions: string[];
  priorityOptions: string[];

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<AnnouncementFilters>) => void;
  fetchAnnouncements: () => Promise<void>;
  fetchAnnouncementById: (id: string) => Promise<Announcement>;
  fetchActiveAnnouncements: (limit?: number) => Promise<void>;
  createAnnouncement: (
    announcementData: CreateAnnouncementData
  ) => Promise<Announcement>;
  updateAnnouncement: (
    id: string,
    announcementData: UpdateAnnouncementData
  ) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  deactivateAnnouncement: (id: string) => Promise<Announcement>;
  clearCurrentAnnouncement: () => void;
  clearError: () => void;
  clearAnnouncements: () => void;
  resetFilters: () => void;
}

interface CreateAnnouncementData {
  title: string;
  content: string;
  targetAudience: string;
  priority: string;
  publishDate: string;
  expiryDate?: string;
  attachments?: any[];
}

interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  targetAudience?: string;
  priority?: string;
  publishDate?: string;
  expiryDate?: string;
  isActive?: boolean;
  attachments?: any[];
}

// Import de l'API
/**
 * @file announcementStore.ts
 * @description Store Zustand pour la gestion des annonces
 */

import api from "../services/api";

// Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishDate: string;
  expiryDate?: string;
  targetAudience: string;
  priority: string;
  isActive: boolean;
  attachments?: any[];
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

// Interfaces pour les filtres
interface AnnouncementFilters {
  search?: string;
  targetAudience?: string;
  priority?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateAnnouncementData {
  title: string;
  content: string;
  targetAudience: string;
  priority: string;
  publishDate: string;
  expiryDate?: string;
  attachments?: any[];
}

interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  targetAudience?: string;
  priority?: string;
  publishDate?: string;
  expiryDate?: string;
  isActive?: boolean;
  attachments?: any[];
}

interface AnnouncementStore {
  // État
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  activeAnnouncements: Announcement[];
  loading: boolean;
  error: string | null;
  filters: AnnouncementFilters;

  // Données complémentaires
  targetAudienceOptions: string[];
  priorityOptions: string[];

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<AnnouncementFilters>) => void;
  fetchAnnouncements: () => Promise<void>;
  fetchAnnouncementById: (id: string) => Promise<Announcement>;
  fetchActiveAnnouncements: (limit?: number) => Promise<void>;
  createAnnouncement: (
    announcementData: CreateAnnouncementData
  ) => Promise<Announcement>;
  updateAnnouncement: (
    id: string,
    announcementData: UpdateAnnouncementData
  ) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  deactivateAnnouncement: (id: string) => Promise<Announcement>;
  clearCurrentAnnouncement: () => void;
  clearError: () => void;
  clearAnnouncements: () => void;
  resetFilters: () => void;
}

// Fonction utilitaire pour nettoyer les params
const cleanParams = (params: any): any => {
  const cleaned: any = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    // Supprimer les valeurs undefined, null, ou chaînes vides
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  // État initial
  announcements: [],
  currentAnnouncement: null,
  activeAnnouncements: [],
  loading: false,
  error: null,

  filters: {
    search: "",
    targetAudience: "",
    priority: "",
    isActive: undefined, // undefined au lieu de true
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
    sortBy: "publishDate",
    sortOrder: "desc" as "desc",
  },

  targetAudienceOptions: [
    "All",
    "Students",
    "Teachers",
    "Parents",
    "Staff",
    "General",
  ],
  priorityOptions: ["Low", "Medium", "High", "Critical"],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        page: 1, // Réinitialiser la page quand les filtres changent
      },
    }));

    // Attendre un peu avant de fetch pour éviter les appais multiples
    setTimeout(() => {
      get().fetchAnnouncements();
    }, 100);
  },

  resetFilters: () => {
    set({
      filters: {
        search: "",
        targetAudience: "",
        priority: "",
        isActive: undefined,
        startDate: "",
        endDate: "",
        page: 1,
        limit: 20,
        sortBy: "publishDate",
        sortOrder: "desc",
      },
    });

    setTimeout(() => {
      get().fetchAnnouncements();
    }, 100);
  },

  fetchAnnouncements: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = get();

      // Construire les params bruts
      const rawParams = {
        search: filters.search,
        targetAudience: filters.targetAudience,
        priority: filters.priority,
        isActive: filters.isActive,
        startDate: filters.startDate,
        endDate: filters.endDate,
        authorId: filters.authorId,
        page: filters.page || 1,
        limit: filters.limit || 20,
        sortBy: filters.sortBy || "publishDate",
        sortOrder: filters.sortOrder || "desc",
      };

      // Nettoyer les params
      const params = cleanParams(rawParams);

      console.log("📡 Fetching announcements...");
      console.log("Raw filters:", rawParams);
      console.log("Cleaned params:", params);
      console.log(
        "Full URL:",
        `/announcements?${new URLSearchParams(params as any).toString()}`
      );

      const response = await api.get("/announcements", { params });
      console.log("✅ Announcements response:", response.data);

      const { data: announcements, meta } = response.data;

      set({
        announcements: announcements || [],
        loading: false,
        pagination: {
          page: meta?.pagination?.page || 1,
          limit: meta?.pagination?.limit || 20,
          total: meta?.pagination?.total || 0,
          totalPages: meta?.pagination?.totalPages || 1,
        },
      });
    } catch (error: any) {
      console.error("❌ Error fetching announcements:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          params: error.config?.params,
        },
      });

      set({
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors du chargement des annonces",
        loading: false,
      });
    }
  },

  fetchAnnouncementById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Fetching announcement ${id}...`);
      const response = await api.get(`/announcements/${id}`);
      console.log(`✅ Announcement ${id} response:`, response.data);

      const { data: announcement } = response.data;

      set({
        currentAnnouncement: announcement,
        loading: false,
      });

      return announcement;
    } catch (error: any) {
      console.error(
        `❌ Error fetching announcement ${id}:`,
        error.response?.data
      );
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchActiveAnnouncements: async (limit: number = 5) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/announcements/active", {
        params: { limit },
      });

      const { data: announcements } = response.data;

      set({
        activeAnnouncements: announcements,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
    }
  },

  createAnnouncement: async (announcementData: CreateAnnouncementData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/announcements", announcementData);
      const { data: newAnnouncement } = response.data;

      set((state) => ({
        announcements: [newAnnouncement, ...state.announcements],
        loading: false,
      }));

      return newAnnouncement;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateAnnouncement: async (
    id: string,
    announcementData: UpdateAnnouncementData
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/announcements/${id}`, announcementData);
      const { data: updatedAnnouncement } = response.data;

      set((state) => ({
        announcements: state.announcements.map((ann) =>
          ann.id === id ? updatedAnnouncement : ann
        ),
        currentAnnouncement: updatedAnnouncement,
        loading: false,
      }));

      return updatedAnnouncement;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteAnnouncement: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/announcements/${id}`);

      set((state) => ({
        announcements: state.announcements.filter((ann) => ann.id !== id),
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

  deactivateAnnouncement: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.patch(`/announcements/${id}/deactivate`);
      const { data: updatedAnnouncement } = response.data;

      set((state) => ({
        announcements: state.announcements.map((ann) =>
          ann.id === id ? updatedAnnouncement : ann
        ),
        currentAnnouncement: updatedAnnouncement,
        activeAnnouncements: state.activeAnnouncements.filter(
          (ann) => ann.id !== id
        ),
        loading: false,
      }));

      return updatedAnnouncement;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de désactivation",
        loading: false,
      });
      throw error;
    }
  },

  clearCurrentAnnouncement: () =>
    set({
      currentAnnouncement: null,
    }),

  clearError: () => set({ error: null }),

  clearAnnouncements: () =>
    set({
      announcements: [],
      currentAnnouncement: null,
      activeAnnouncements: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));

export default useAnnouncementStore;
