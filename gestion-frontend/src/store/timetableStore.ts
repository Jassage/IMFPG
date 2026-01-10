/**
 * @file timetableStore.ts
 * @description Store Zustand pour la gestion des emplois du temps - Version compatible avec le nouveau ScheduleService
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

// Fonction utilitaire pour formater les temps pour l'API (version simplifiée)
const formatTimeForAPI = (time: string): string => {
  if (!time) return "";

  // Supprimer les espaces
  const trimmedTime = time.trim();

  // Si c'est déjà au format HH:MM:SS, utiliser tel quel
  if (trimmedTime.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
    return trimmedTime;
  }

  // Si c'est au format HH:MM, ajouter :00
  if (trimmedTime.match(/^\d{1,2}:\d{2}$/)) {
    return `${trimmedTime}:00`;
  }

  // Si c'est un timestamp ISO, convertir en format temps simple
  if (trimmedTime.includes("T")) {
    try {
      const date = new Date(trimmedTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      }
    } catch {
      // En cas d'erreur, utiliser le format par défaut
    }
  }

  // Par défaut, essayer de formater
  try {
    // Extraire les heures et minutes
    const timeParts = trimmedTime.split(/[:\s]/).filter(Boolean);
    if (timeParts.length >= 2) {
      const hours = parseInt(timeParts[0]).toString().padStart(2, "0");
      const minutes = parseInt(timeParts[1]).toString().padStart(2, "0");
      const seconds = timeParts[2] || "00";
      return `${hours}:${minutes}:${seconds}`;
    }
  } catch {
    // En cas d'erreur, retourner un format par défaut
  }

  return "00:00:00";
};

// Fonction pour analyser le temps côté client
const parseTimeForClient = (time: string): string => {
  if (!time) return "00:00";

  try {
    // Si c'est au format HH:MM:SS, extraire HH:MM
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

  // Nouvelle méthode pour créer un horaire avec assignation ID
  addSchedule: (
    assignmentId: string,
    data: Partial<CreateScheduleData>
  ) => Promise<ApiResponse>;

  // Nouvelle méthode pour générer l'emploi du temps d'une classe
  generateClassTimetable: (
    classId: string,
    academicYearId: string,
    options?: { clearExisting?: boolean }
  ) => Promise<ApiResponse>;
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

      const response = await api.get(`/api/academic/schedules?${params}`);

      if (response.data.success) {
        const schedules = response.data.data?.schedules || [];

        // Formater les temps pour le client
        const formattedSchedules = schedules.map((schedule: Schedule) => ({
          ...schedule,
          displayStartTime: get().formatTimeForDisplay(schedule.startTime),
          displayEndTime: get().formatTimeForDisplay(schedule.endTime),
        }));

        set({
          schedules: formattedSchedules,
          loading: false,
        });

        // Mettre à jour aussi le timetable si une classe est spécifiée
        if (allFilters.classId) {
          const timetableByDay: Record<string, Schedule[]> = {};
          DAYS_OF_WEEK.forEach((day) => {
            timetableByDay[day.value] = [];
          });

          formattedSchedules.forEach((schedule: Schedule) => {
            if (timetableByDay[schedule.dayOfWeek]) {
              timetableByDay[schedule.dayOfWeek].push(schedule);
            }
          });

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

      const response = await api.get(
        `/api/academic/schedules/class/${classId}?${params}`
      );

      if (response.data.success) {
        const schedules = response.data.data?.schedules || [];

        // Formater les temps pour le client
        const formattedSchedules = schedules.map((schedule: Schedule) => ({
          ...schedule,
          displayStartTime: get().formatTimeForDisplay(schedule.startTime),
          displayEndTime: get().formatTimeForDisplay(schedule.endTime),
        }));

        const timetableByDay: Record<string, Schedule[]> = {};
        DAYS_OF_WEEK.forEach((day) => {
          timetableByDay[day.value] = [];
        });

        formattedSchedules.forEach((schedule: Schedule) => {
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
          schedules: formattedSchedules,
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
        `/api/academic/schedules/professor/${professeurId}?${params}`
      );

      if (response.data.success) {
        const schedules = response.data.data?.schedules || [];

        // Formater les temps pour le client
        const formattedSchedules = schedules.map((schedule: Schedule) => ({
          ...schedule,
          displayStartTime: get().formatTimeForDisplay(schedule.startTime),
          displayEndTime: get().formatTimeForDisplay(schedule.endTime),
        }));

        const scheduleByDay: Record<string, Schedule[]> = {};
        DAYS_OF_WEEK.forEach((day) => {
          scheduleByDay[day.value] = [];
        });

        formattedSchedules.forEach((schedule: Schedule) => {
          if (scheduleByDay[schedule.dayOfWeek]) {
            scheduleByDay[schedule.dayOfWeek].push(schedule);
          }
        });

        set({
          schedules: formattedSchedules,
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

  createSchedule: async (data: CreateScheduleData) => {
    set({ loading: true, error: null });

    try {
      // Formater les données pour l'API
      const formattedData = {
        ...data,
        dayOfWeek: data.dayOfWeek?.toUpperCase(),
        startTime: formatTimeForAPI(data.startTime),
        endTime: formatTimeForAPI(data.endTime),
        classroom: data.classroom?.trim() || null,
        recurrence: data.recurrence?.trim() || null,
        untilDate: data.untilDate?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      console.log("📤 Création horaire - Données envoyées:", formattedData);

      const response = await api.post("/api/academic/schedules", formattedData);

      if (response.data.success) {
        const newSchedule = response.data.data?.schedule;

        if (newSchedule) {
          // Formater le nouveau schedule pour le client
          const formattedSchedule = {
            ...newSchedule,
            displayStartTime: get().formatTimeForDisplay(newSchedule.startTime),
            displayEndTime: get().formatTimeForDisplay(newSchedule.endTime),
          };

          set((state) => ({
            schedules: [formattedSchedule, ...state.schedules],
            loading: false,
          }));

          // Mettre à jour le timetable si la classe correspond
          if (
            formattedSchedule &&
            get().timetable[formattedSchedule.dayOfWeek]
          ) {
            set((state) => ({
              timetable: {
                ...state.timetable,
                [formattedSchedule.dayOfWeek]: [
                  formattedSchedule,
                  ...state.timetable[formattedSchedule.dayOfWeek],
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
              },
            }));
          }
        }

        toast({
          title: "✅ Cours planifié",
          description: "Le cours a été ajouté à l'emploi du temps",
        });
      }

      return response.data;
    } catch (error: any) {
      let errorMsg =
        error.response?.data?.message || "Erreur lors de la création du cours";

      // Afficher les détails de l'erreur de validation
      if (error.response?.data?.errors) {
        console.error("Erreurs de validation:", error.response.data.errors);
        errorMsg = `${errorMsg}: ${error.response.data.errors
          .map((e: any) => e.message)
          .join(", ")}`;
      } else if (error.response?.data?.code === "SCHEDULE_CONFLICT") {
        // Formater les conflits pour l'affichage
        const conflicts = error.response.data?.data?.conflicts || [];
        if (conflicts.length > 0) {
          errorMsg = `Conflits détectés:\n${conflicts
            .map((c: any) => `• ${c.message}`)
            .join("\n")}`;
        }
      }

      set({ error: errorMsg, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMsg,
        variant: "destructive",
      });

      throw error;
    }
  },

  // Nouvelle méthode pour créer un horaire avec assignmentId
  addSchedule: async (
    assignmentId: string,
    data: Partial<CreateScheduleData>
  ) => {
    set({ loading: true, error: null });

    try {
      // Construire l'objet complet CreateScheduleData
      const createData: CreateScheduleData = {
        assignmentId,
        classId: data.classId || "",
        dayOfWeek: data.dayOfWeek || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        classroom: data.classroom,
        recurrence: data.recurrence,
        untilDate: data.untilDate,
        notes: data.notes,
      };

      // Utiliser la méthode createSchedule existante
      return await get().createSchedule(createData);
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  updateSchedule: async (id: string, data: UpdateScheduleData) => {
    set({ loading: true, error: null });

    try {
      // Formater les données pour l'API
      const formattedData = { ...data };

      if (data.startTime !== undefined) {
        formattedData.startTime = formatTimeForAPI(data.startTime);
      }

      if (data.endTime !== undefined) {
        formattedData.endTime = formatTimeForAPI(data.endTime);
      }

      if (data.dayOfWeek !== undefined) {
        formattedData.dayOfWeek = data.dayOfWeek.toUpperCase();
      }

      if (data.classroom !== undefined) {
        formattedData.classroom = data.classroom.trim() || null;
      }

      if (data.recurrence !== undefined) {
        formattedData.recurrence = data.recurrence.trim() || null;
      }

      if (data.untilDate !== undefined) {
        formattedData.untilDate = data.untilDate.trim() || null;
      }

      if (data.notes !== undefined) {
        formattedData.notes = data.notes.trim() || null;
      }

      console.log("📤 Mise à jour horaire - Données envoyées:", formattedData);

      const response = await api.put(
        `/api/academic/schedules/${id}`,
        formattedData
      );

      if (response.data.success) {
        const updatedSchedule = response.data.data?.schedule;

        if (updatedSchedule) {
          // Formater le schedule mis à jour pour le client
          const formattedSchedule = {
            ...updatedSchedule,
            displayStartTime: get().formatTimeForDisplay(
              updatedSchedule.startTime
            ),
            displayEndTime: get().formatTimeForDisplay(updatedSchedule.endTime),
          };

          set((state) => ({
            schedules: state.schedules.map((schedule) =>
              schedule.id === id ? formattedSchedule : schedule
            ),
            loading: false,
          }));

          // Mettre à jour le timetable
          const oldSchedule = get().schedules.find((s) => s.id === id);

          if (
            oldSchedule &&
            oldSchedule.dayOfWeek !== formattedSchedule.dayOfWeek
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
          if (get().timetable[formattedSchedule.dayOfWeek]) {
            set((state) => ({
              timetable: {
                ...state.timetable,
                [formattedSchedule.dayOfWeek]: [
                  ...(state.timetable[formattedSchedule.dayOfWeek]?.filter(
                    (s) => s.id !== id
                  ) || []),
                  formattedSchedule,
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
      const response = await api.delete(`/api/academic/schedules/${id}`);

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
      const response = await api.post("/api/academic/schedules/generate", data);

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

  // Nouvelle méthode pour générer l'emploi du temps d'une classe (simplifiée)
  generateClassTimetable: async (
    classId: string,
    academicYearId: string,
    options?: { clearExisting?: boolean }
  ) => {
    return get().generateTimetable({
      classId,
      academicYearId,
      constraints: {
        // Contraintes par défaut pour la génération automatique
        maxHoursPerDay: 6,
      },
    });
  },

  checkScheduleConflicts: async (data) => {
    console.log("🔍 Vérification des conflits avec données:", data);

    try {
      const params = new URLSearchParams();

      // Formater les temps pour l'API
      const formattedData = {
        ...data,
        startTime: formatTimeForAPI(data.startTime),
        endTime: formatTimeForAPI(data.endTime),
      };

      Object.entries(formattedData).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.append(key, String(value));
        }
      });

      console.log(
        "🔗 URL de vérification:",
        `/api/academic/schedules/check-conflicts?${params}`
      );

      const response = await api.get(
        `/api/academic/schedules/check-conflicts?${params}`
      );

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

      // Retourner un résultat par défaut en cas d'erreur
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

      const response = await api.get(
        `/api/academic/schedules/available-slots?${params}`
      );
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
    return parseTimeForClient(time);
  },

  calculateDuration: (startTime: string, endTime: string) => {
    try {
      const start = parseTimeForClient(startTime);
      const end = parseTimeForClient(endTime);

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
