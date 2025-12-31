/**
 * @file transcriptStore.ts
 * @description Store Zustand pour la gestion des transcripts
 */

import { create } from "zustand";
// import { transcriptService, TranscriptFilters } from "@/services/transcriptService";
import {
  Transcript,
  CreateTranscriptData,
  UpdateTranscriptData,
  TranscriptStatistics,
  DocumentType,
  ControlType,
  TranscriptStatus,
  DocumentLanguage,
  ClassLevel,
} from "@/types/transcript";
import { TranscriptFilters, transcriptService } from "@/services/transcriptApi";

interface TranscriptStore {
  // État
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  loading: boolean;
  error: string | null;
  filters: TranscriptFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: TranscriptStatistics | null;
  selectedIds: string[];

  // Actions
  setFilters: (filters: Partial<TranscriptFilters>) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectedId: (id: string) => void;
  clearSelectedIds: () => void;

  fetchTranscripts: () => Promise<void>;
  fetchTranscriptById: (id: string) => Promise<Transcript>;
  createTranscript: (data: CreateTranscriptData) => Promise<Transcript>;
  updateTranscript: (
    id: string,
    data: UpdateTranscriptData
  ) => Promise<Transcript>;
  deleteTranscript: (id: string) => Promise<void>;

  calculateStatistics: (data: {
    studentId: string;
    academicYearId: string;
    controlType: ControlType;
    classLevel: ClassLevel;
  }) => Promise<TranscriptStatistics>;

  downloadTranscript: (id: string) => Promise<void>;
  bulkDownload: () => Promise<void>;
  bulkDelete: () => Promise<void>;
  bulkUpdateStatus: (status: TranscriptStatus) => Promise<void>;

  clearCurrentTranscript: () => void;
  clearError: () => void;
  clearTranscripts: () => void;
  resetFilters: () => void;
}

export const useTranscriptStore = create<TranscriptStore>((set, get) => ({
  // État initial
  transcripts: [],
  currentTranscript: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  statistics: null,
  selectedIds: [],

  // Actions

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page || 1 },
    }));
    // Recharger les transcripts avec les nouveaux filtres
    setTimeout(() => get().fetchTranscripts(), 0);
  },

  setSelectedIds: (ids) => {
    set({ selectedIds: ids });
  },

  toggleSelectedId: (id: string) => {
    set((state) => {
      const isSelected = state.selectedIds.includes(id);
      return {
        selectedIds: isSelected
          ? state.selectedIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedIds, id],
      };
    });
  },

  clearSelectedIds: () => {
    set({ selectedIds: [] });
  },

  fetchTranscripts: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const response = await transcriptService.getAll(filters);

      set({
        transcripts: response.data.transcripts,
        pagination: response.data.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des transcripts",
        loading: false,
      });
    }
  },

  fetchTranscriptById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const transcript = await transcriptService.getById(id);

      set({
        currentTranscript: transcript,
        loading: false,
      });

      return transcript;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de chargement";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  createTranscript: async (data: CreateTranscriptData) => {
    set({ loading: true, error: null });

    try {
      const transcript = await transcriptService.create(data);

      set((state) => ({
        transcripts: [transcript, ...state.transcripts],
        loading: false,
      }));

      return transcript;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de création";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  updateTranscript: async (id: string, data: UpdateTranscriptData) => {
    set({ loading: true, error: null });

    try {
      const transcript = await transcriptService.update(id, data);

      set((state) => ({
        transcripts: state.transcripts.map((t) =>
          t.id === id ? transcript : t
        ),
        currentTranscript: transcript,
        loading: false,
      }));

      return transcript;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de modification";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  deleteTranscript: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await transcriptService.delete(id);

      set((state) => ({
        transcripts: state.transcripts.filter((t) => t.id !== id),
        selectedIds: state.selectedIds.filter(
          (selectedId) => selectedId !== id
        ),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de suppression";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  calculateStatistics: async (data) => {
    set({ loading: true, error: null });

    try {
      const statistics = await transcriptService.calculateStatistics(data);

      set({
        statistics,
        loading: false,
      });

      return statistics;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erreur de calcul";
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  downloadTranscript: async (id: string) => {
    try {
      const blob = await transcriptService.download(id);
      const transcript = get().transcripts.find((t) => t.id === id);
      const fileName = transcript?.fileName || `transcript-${id}.pdf`;

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de téléchargement";
      set({ error: errorMsg });
    }
  },

  bulkDownload: async () => {
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;

    try {
      const blob = await transcriptService.bulkDownload(selectedIds);
      const fileName = `transcripts-bulk-${Date.now()}.zip`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de téléchargement groupé";
      set({ error: errorMsg });
    }
  },

  bulkDelete: async () => {
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;

    set({ loading: true, error: null });

    try {
      await transcriptService.bulkDelete(selectedIds);

      set((state) => ({
        transcripts: state.transcripts.filter(
          (t) => !selectedIds.includes(t.id)
        ),
        selectedIds: [],
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de suppression groupée";
      set({ error: errorMsg, loading: false });
    }
  },

  bulkUpdateStatus: async (status: TranscriptStatus) => {
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;

    set({ loading: true, error: null });

    try {
      await transcriptService.bulkUpdate(selectedIds, { status });

      // Mettre à jour localement
      set((state) => ({
        transcripts: state.transcripts.map((t) =>
          selectedIds.includes(t.id) ? { ...t, status } : t
        ),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Erreur de mise à jour groupée";
      set({ error: errorMsg, loading: false });
    }
  },

  clearCurrentTranscript: () => set({ currentTranscript: null }),

  clearError: () => set({ error: null }),

  clearTranscripts: () =>
    set({
      transcripts: [],
      currentTranscript: null,
      selectedIds: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      statistics: null,
    }),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
      },
    }),
}));
