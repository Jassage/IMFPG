// store/professeurDashboardStore.ts - Version adaptée
import { create } from "zustand";
import api from "../services/api";

interface DashboardData {
  professeur: any;
  assignments: any;
  schedule: any;
  students: any;
  statistics: any;
  upcomingClasses: any[];
  todaysSchedule: any;
  lastUpdated: string;
}

interface ProfesseurDashboardStore {
  // État
  dashboardData: DashboardData | null;
  currentView: "overview" | "classes" | "schedule" | "students" | "grades";
  selectedClassId: string | null;
  selectedSubjectId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: (professeurId: string) => Promise<void>;
  setCurrentView: (view: ProfesseurDashboardStore["currentView"]) => void;
  setSelectedClass: (classId: string | null) => void;
  setSelectedSubject: (subjectId: string | null) => void;
  refreshData: (professeurId: string) => Promise<void>;
  clearDashboard: () => void;
  clearError: () => void;
}

export const useProfesseurDashboardStore = create<ProfesseurDashboardStore>(
  (set, get) => ({
    // État initial
    dashboardData: null,
    currentView: "overview",
    selectedClassId: null,
    selectedSubjectId: null,
    loading: false,
    error: null,

    // Actions
    fetchDashboardData: async (professeurId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await api.get(
          `/professeurs/${professeurId}/dashboard`
        );
        set({
          dashboardData: response.data.data,
          loading: false,
        });
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Erreur lors du chargement du dashboard",
          loading: false,
        });
        throw error;
      }
    },

    setCurrentView: (view) => {
      set({ currentView: view });

      // Réinitialiser les sélections quand on change de vue
      if (view !== "classes") set({ selectedClassId: null });
      if (view !== "grades") set({ selectedSubjectId: null });
    },

    setSelectedClass: (classId) => {
      set({ selectedClassId: classId });
    },

    setSelectedSubject: (subjectId) => {
      set({ selectedSubjectId: subjectId });
    },

    refreshData: async (professeurId: string) => {
      const { dashboardData } = get();
      if (dashboardData) {
        await get().fetchDashboardData(professeurId);
      }
    },

    clearDashboard: () =>
      set({
        dashboardData: null,
        selectedClassId: null,
        selectedSubjectId: null,
        error: null,
      }),

    clearError: () => set({ error: null }),
  })
);
