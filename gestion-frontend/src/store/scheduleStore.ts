/**
 * @file timetableStore.ts
 * @description Store Zustand pour la gestion des emplois du temps - Version corrigée
 */

import { create } from "zustand";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import {
  ApiResponse,
  ConflictCheckResult,
  CreateScheduleData,
  DAYS_OF_WEEK,
  GenerateTimetableData,
  Schedule,
  ScheduleFilters,
  UpdateScheduleData,
} from "@/types/timesTableTypes";

// Fonction utilitaire pour formater les temps pour l'API
// Dans scheduleStore.ts
// Dans scheduleStore.ts - fonction formatTimeForAPI
// Dans scheduleStore.ts - modifier formatTimeForAPI
// Dans scheduleStore.ts - formatTimeForAPI
const formatTimeForAPI = (time: string): string => {
  if (!time) return "00:00";

  // Nettoyer
  const trimmedTime = time.trim();

  // Format HH:MM
  if (trimmedTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return trimmedTime;
  }

  // Format HH:MM:SS - extraire seulement HH:MM
  if (trimmedTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)) {
    return trimmedTime.substring(0, 5);
  }

  console.warn("Format de temps non reconnu:", time);
  return "00:00";
};

// Dans scheduleStore.ts - ajouter cette fonction
const parseTimeToISO = (time: string): string => {
  if (!time) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  }

  const trimmedTime = time.trim();

  // Format ISO déjà
  if (trimmedTime.includes("T")) {
    const date = new Date(trimmedTime);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // Format HH:MM ou HH:MM:SS
  if (trimmedTime.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
    const [hours, minutes, seconds = "00"] = trimmedTime.split(":");
    const today = new Date();
    today.setHours(
      parseInt(hours.padStart(2, "0")),
      parseInt(minutes.padStart(2, "0")),
      parseInt(seconds.padStart(2, "0")),
      0
    );
    return today.toISOString();
  }

  // Si c'est un nombre simple
  if (trimmedTime.match(/^\d{1,2}$/)) {
    const hours = parseInt(trimmedTime);
    const today = new Date();
    today.setHours(hours, 0, 0, 0);
    return today.toISOString();
  }

  // Par défaut
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
};
// Fonction pour créer l'URL avec les bonnes routes
const getApiUrl = (endpoint: string): string => {
  const baseUrl = "/schedules";
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};

interface TimetableState {
  // État
  schedules: Schedule[];
  timetable: Record<string, Schedule[]>;
  filters: ScheduleFilters;
  loading: boolean;
  error: string | null;

  // Actions
  fetchSchedules: (filters?: ScheduleFilters) => Promise<ApiResponse>;
  fetchClassTimetable: (
    classId: string,
    academicYearId?: string
  ) => Promise<ApiResponse>;

  fetchProfessorSchedule: (
    professeurId: string,
    filters?: { startDate?: string; endDate?: string; status?: string }
  ) => Promise<ApiResponse>;

  createSchedule: (data: CreateScheduleData) => Promise<ApiResponse>;
  updateSchedule: (
    id: string,
    data: UpdateScheduleData
  ) => Promise<ApiResponse>;
  deleteSchedule: (id: string) => Promise<ApiResponse>;

  generateTimetable: (data: GenerateTimetableData) => Promise<ApiResponse>;

  checkScheduleConflicts: (data: {
    professeurId: string;
    classId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    classroom?: string;
    excludeScheduleId?: string;
  }) => Promise<ConflictCheckResult>;

  getAvailableTimeSlots: (filters: {
    classId?: string;
    dayOfWeek?: string;
    professeurId?: string;
    classroom?: string;
  }) => Promise<ApiResponse>;

  // Filtres
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  resetFilters: () => void;

  // Utilitaires
  getSchedulesByDay: (day: string) => Schedule[];
  getTimetableForWeek: () => Record<string, Schedule[]>;
  getScheduleById: (id: string) => Schedule | undefined;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Formattage
  formatTimeForDisplay: (time: string) => string;
  calculateDuration: (
    startTime: string,
    endTime: string
  ) => {
    minutes: number;
    hours: number;
    display: string;
  };
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  // État initial
  schedules: [],
  timetable: {},
  filters: { status: "ACTIVE" },
  loading: false,
  error: null,

  // Actions principales
  fetchSchedules: async (filters = {}) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();

      // Appliquer les filtres
      const allFilters = { ...get().filters, ...filters };
      Object.entries(allFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/schedules?${params}`);

      if (response.data.success) {
        set({
          schedules: response.data.data?.schedules || [],
          loading: false,
        });

        // Mettre à jour aussi le timetable si une classe est spécifiée
        if (allFilters.classId) {
          const timetableByDay: Record<string, Schedule[]> = {};
          DAYS_OF_WEEK.forEach((day) => {
            timetableByDay[day.value] = [];
          });

          (response.data.data?.schedules || []).forEach(
            (schedule: Schedule) => {
              if (timetableByDay[schedule.dayOfWeek]) {
                timetableByDay[schedule.dayOfWeek].push(schedule);
              }
            }
          );

          set({ timetable: timetableByDay });
        }
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des horaires";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  fetchClassTimetable: async (classId: string, academicYearId?: string) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (academicYearId) {
        params.append("academicYearId", academicYearId);
      }

      const response = await api.get(`/schedules/class/${classId}?${params}`);

      if (response.data.success) {
        const timetableByDay: Record<string, Schedule[]> = {};
        DAYS_OF_WEEK.forEach((day) => {
          timetableByDay[day.value] = [];
        });

        (response.data.data?.schedules || []).forEach((schedule: Schedule) => {
          if (timetableByDay[schedule.dayOfWeek]) {
            timetableByDay[schedule.dayOfWeek].push(schedule);
          }
        });

        // Trier chaque jour par heure
        Object.keys(timetableByDay).forEach((day) => {
          timetableByDay[day].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          );
        });

        set({
          schedules: response.data.data?.schedules || [],
          timetable: timetableByDay,
          loading: false,
          filters: { ...get().filters, classId },
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors du chargement de l'emploi du temps";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  fetchProfessorSchedule: async (professeurId: string, filters = {}) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get(
        `/schedules/professor/${professeurId}?${params}`
      );

      if (response.data.success) {
        const scheduleByDay: Record<string, Schedule[]> = {};
        DAYS_OF_WEEK.forEach((day) => {
          scheduleByDay[day.value] = [];
        });

        (response.data.data?.schedules || []).forEach((schedule: Schedule) => {
          if (scheduleByDay[schedule.dayOfWeek]) {
            scheduleByDay[schedule.dayOfWeek].push(schedule);
          }
        });

        set({
          schedules: response.data.data?.schedules || [],
          timetable: scheduleByDay,
          loading: false,
          filters: { ...get().filters, professeurId },
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors du chargement de l'emploi du temps du professeur";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  // Dans scheduleStore.ts - modifier createSchedule
  createSchedule: async (data: CreateScheduleData) => {
    set({ loading: true, error: null });

    try {
      // FORMAT SIMPLE POUR TEST - HH:MM seulement
      const formattedData = {
        assignmentId: data.assignmentId,
        classId: data.classId,
        dayOfWeek: data.dayOfWeek?.toUpperCase(),
        startTime: formatTimeForAPI(data.startTime), // HH:MM
        endTime: formatTimeForAPI(data.endTime), // HH:MM
        classroom: data.classroom?.trim() || "",
        recurrence: data.recurrence?.trim() || "NONE",
        untilDate: data.untilDate?.trim() || null,
        notes: data.notes?.trim() || "",
      };

      console.log("📤 Création horaire - Données simplifiées:", formattedData);

      const response = await api.post("/schedules", formattedData);

      if (response.data.success) {
        const newSchedule = response.data.data?.schedule;

        set((state) => ({
          schedules: [newSchedule, ...state.schedules],
          loading: false,
        }));

        toast({
          title: "✅ Cours ajouté",
          description: "Le cours a été ajouté à l'emploi du temps",
        });
      }

      return response.data;
    } catch (error: any) {
      let errorMsg =
        error.response?.data?.message || "Erreur lors de la création du cours";

      if (error.response?.data?.errors) {
        console.error(
          "❌ Erreurs de validation détaillées:",
          error.response.data.errors
        );
        errorMsg = `Erreurs de validation:\n${error.response.data.errors
          .map((e: any) => `• ${e.field}: ${e.message}`)
          .join("\n")}`;
      }

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
        duration: 10000,
      });

      throw error;
    }
  },
  // Dans scheduleStore.ts - fonction updateSchedule
  updateSchedule: async (id: string, data: UpdateScheduleData) => {
    set({ loading: true, error: null });

    try {
      // Formater les données pour l'API
      const formattedData: any = {};

      // Copier seulement les champs qui existent
      if (data.dayOfWeek !== undefined) {
        formattedData.dayOfWeek = data.dayOfWeek.toUpperCase();
      }

      if (data.startTime !== undefined) {
        formattedData.startTime = formatTimeForAPI(data.startTime);
      }

      if (data.endTime !== undefined) {
        formattedData.endTime = formatTimeForAPI(data.endTime);
      }

      // CORRECTION : Vérifier si la valeur existe avant d'utiliser .trim()
      if (data.classroom !== undefined) {
        formattedData.classroom = data.classroom ? data.classroom.trim() : "";
      }

      if (data.recurrence !== undefined) {
        formattedData.recurrence = data.recurrence
          ? data.recurrence.trim()
          : "NONE";
      }

      if (data.untilDate !== undefined) {
        formattedData.untilDate = data.untilDate ? data.untilDate.trim() : "";
      }

      if (data.notes !== undefined) {
        formattedData.notes = data.notes ? data.notes.trim() : "";
      }

      if (data.status !== undefined) {
        formattedData.status = data.status;
      }

      console.log("📤 Données de mise à jour formatées:", formattedData);

      const response = await api.put(`/schedules/${id}`, formattedData);

      if (response.data.success) {
        const updatedSchedule = response.data.data?.schedule;

        set((state) => ({
          schedules: state.schedules.map((schedule) =>
            schedule.id === id ? updatedSchedule : schedule
          ),
          loading: false,
        }));

        // Mettre à jour le timetable
        if (updatedSchedule) {
          const oldSchedule = get().schedules.find((s) => s.id === id);

          if (
            oldSchedule &&
            oldSchedule.dayOfWeek !== updatedSchedule.dayOfWeek
          ) {
            // Retirer de l'ancien jour
            set((state) => ({
              timetable: {
                ...state.timetable,
                [oldSchedule.dayOfWeek]:
                  state.timetable[oldSchedule.dayOfWeek]?.filter(
                    (s) => s.id !== id
                  ) || [],
              },
            }));
          }

          // Ajouter au nouveau jour
          if (get().timetable[updatedSchedule.dayOfWeek]) {
            set((state) => ({
              timetable: {
                ...state.timetable,
                [updatedSchedule.dayOfWeek]: [
                  ...(state.timetable[updatedSchedule.dayOfWeek]?.filter(
                    (s) => s.id !== id
                  ) || []),
                  updatedSchedule,
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
              },
            }));
          }
        }

        toast({
          title: "✅ Cours modifié",
          description: "Le cours a été modifié avec succès",
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du cours";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  deleteSchedule: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.delete(`/schedules/${id}`);

      if (response.data.success) {
        const deletedSchedule = get().schedules.find((s) => s.id === id);

        set((state) => ({
          schedules: state.schedules.filter((schedule) => schedule.id !== id),
          loading: false,
        }));

        // Retirer du timetable
        if (deletedSchedule && get().timetable[deletedSchedule.dayOfWeek]) {
          set((state) => ({
            timetable: {
              ...state.timetable,
              [deletedSchedule.dayOfWeek]:
                state.timetable[deletedSchedule.dayOfWeek]?.filter(
                  (s) => s.id !== id
                ) || [],
            },
          }));
        }

        toast({
          title: "✅ Cours supprimé",
          description: "Le cours a été supprimé de l'emploi du temps",
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors de la suppression du cours";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  generateTimetable: async (data: GenerateTimetableData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/schedules/generate", data);

      if (response.data.success) {
        // Recharger l'emploi du temps de la classe
        await get().fetchClassTimetable(data.classId, data.academicYearId);

        toast({
          title: "✅ Emploi du temps généré",
          description: `${
            response.data.data?.statistics?.successfullyPlaced || 0
          } cours planifiés`,
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors de la génération de l'emploi du temps";

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  // Dans scheduleStore.ts
  // Dans scheduleStore.ts - modifier checkScheduleConflicts
  checkScheduleConflicts: async (data) => {
    console.log("🔍 Vérification des conflits avec données:", data);

    try {
      const params = new URLSearchParams();

      // Formater les temps pour l'API (format ISO)
      const formattedData = {
        ...data,
        startTime: parseTimeToISO(data.startTime),
        endTime: parseTimeToISO(data.endTime),
      };

      Object.entries(formattedData).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.append(key, String(value));
        }
      });

      const url = `/schedules/check-conflicts?${params}`;
      console.log("🔗 URL de vérification:", url);

      const response = await api.get(url);

      console.log("✅ Réponse vérification conflits:", response.data);

      if (response.data.success) {
        return response.data.data;
      }

      return { hasConflict: false, conflicts: [] };
    } catch (error: any) {
      console.error("❌ Erreur vérification conflits:", {
        message: error.message,
        response: error.response?.data,
        url: error.config?.url,
      });

      return { hasConflict: false, conflicts: [] };
    }
  },

  getAvailableTimeSlots: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/schedules/available-slots?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération créneaux:", error);
      throw error;
    }
  },

  // Gestion des filtres
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: { status: "ACTIVE" },
      schedules: [],
      timetable: {},
    });
  },

  // Utilitaires
  getSchedulesByDay: (day) => {
    return get().timetable[day] || [];
  },

  getTimetableForWeek: () => {
    return get().timetable;
  },

  getScheduleById: (id) => {
    return get().schedules.find((schedule) => schedule.id === id);
  },

  // États de chargement
  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  // Formattage
  formatTimeForDisplay: (time: string): string => {
    if (!time) return "00:00";

    try {
      // Si c'est déjà au format HH:MM:SS
      if (time.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
        return time.substring(0, 5);
      }

      // Si c'est au format HH:MM
      if (time.match(/^\d{1,2}:\d{2}$/)) {
        return time;
      }

      // Si c'est un timestamp ISO
      if (time.includes("T")) {
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        }
      }

      return "00:00";
    } catch {
      return "00:00";
    }
  },

  calculateDuration: (startTime: string, endTime: string) => {
    try {
      const start = get().formatTimeForDisplay(startTime);
      const end = get().formatTimeForDisplay(endTime);

      const [startHours, startMinutes] = start.split(":").map(Number);
      const [endHours, endMinutes] = end.split(":").map(Number);

      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      const minutes = endTotal - startTotal;
      const hours = minutes / 60;

      const hoursPart = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;

      return {
        minutes,
        hours: parseFloat(hours.toFixed(1)),
        display:
          `${hoursPart > 0 ? `${hoursPart}h` : ""}${
            minutesPart > 0 ? `${minutesPart}min` : ""
          }`.trim() || "0min",
      };
    } catch {
      return { minutes: 0, hours: 0, display: "0min" };
    }
  },
}));
