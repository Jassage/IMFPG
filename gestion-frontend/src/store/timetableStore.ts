// timetableStore.ts - Version corrigée
import api from "@/services/api";
import { toast } from "sonner";
import { create } from "zustand";

export interface TimetableEvent {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacherName?: string;
  className: string;
  classId: string;
  subject: string;
  room?: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  color?: string;
  isRecurring: boolean;
  startDate?: string;
  endDate?: string;
}

interface TimetableStore {
  events: TimetableEvent[];
  schedules: any[];
  assignments: any[];
  loading: boolean;
  error: string | null;
  errorDetails: any;
  lastErrorTime: Date | null;
  currentTimetable: any;
  filters: {
    classId?: string;
    teacherId?: string;
    dayOfWeek?: number;
    room?: string;
  };

  // Actions
  fetchEvents: () => Promise<void>;
  fetchClassTimetable: (
    classId: string,
    options?: { academicYearId?: string }
  ) => Promise<any[]>;
  fetchTimetableSessions: (timetableId: string) => Promise<void>;
  getEventsForDay: (dayOfWeek: number) => TimetableEvent[];
  getEventsForClass: (classId: string) => TimetableEvent[];
  getEventsForTeacher: (teacherId: string) => TimetableEvent[];

  // CRUD Operations
  addSchedule: (assignmentId: string, scheduleData: any) => Promise<void>;
  updateSchedule: (scheduleId: string, scheduleData: any) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  generateClassTimetable: (
    classId: string,
    academicYearId: string,
    constraints?: any
  ) => Promise<void>;

  // Vérification de conflits
  checkScheduleConflicts: (data: {
    professeurId: string;
    classId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    classroom?: string;
    excludeScheduleId?: string;
  }) => Promise<{ hasConflict: boolean; conflicts: any[] }>;

  // Filters
  setFilters: (filters: Partial<TimetableStore["filters"]>) => void;
  clearFilters: () => void;
  clearError: () => void;

  // Getters
  getFilteredEvents: () => TimetableEvent[];
  getFilteredSchedules: () => any[];
}

export const useTimetableStore = create<TimetableStore>((set, get) => ({
  events: [],
  schedules: [],
  assignments: [],
  loading: false,
  currentTimetable: null,
  error: null,
  errorDetails: null,
  lastErrorTime: null,
  filters: {},

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/events");
      set({ events: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching events:", error);
      set({ loading: false });
    }
  },

  // Fonction pour récupérer l'emploi du temps d'une classe
  fetchClassTimetable: async (
    classId: string,
    options?: { academicYearId?: string }
  ) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
      console.log("📋 Fetching timetable for class:", classId, options);

      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.get(`/schedules/class/${classId}`, {
        params: {
          academicYearId: options?.academicYearId,
        },
      });

      // Vérifier si la réponse contient une erreur
      if (!response.data?.success) {
        const errorMessage =
          response.data?.message || "Erreur inconnue lors du chargement";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        return [];
      }

      const schedules = response.data?.data?.schedules || [];

      console.log("Schedules loaded:", {
        count: schedules.length,
        schedules: schedules.map((s: any) => ({
          id: s.id,
          day: s.dayOfWeek,
          time: `${s.startTime}-${s.endTime}`,
          subject: s.classAssignment?.subject?.name || "No subject",
          professeurId: s.professeurId || s.classAssignment?.professeur?.id,
          classId: s.classId,
        })),
      });

      set({
        schedules: schedules,
        loading: false,
        error: null,
        errorDetails: null,
      });
      return schedules;
    } catch (error: any) {
      console.error("Error fetching class timetable:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur réseau lors du chargement";

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: error.response?.status,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage);
      return [];
    }
  },

  fetchTimetableSessions: async (timetableId: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/${timetableId}/sessions`);
      set({
        schedules: response.data?.data || [],
        currentTimetable: response.data?.data?.timetable,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching timetable sessions:", error);
      set({ loading: false });
    }
  },

  // Vérification des conflits d'horaire
  checkScheduleConflicts: async (data: {
    professeurId: string;
    classId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    classroom?: string;
    excludeScheduleId?: string;
  }): Promise<{ hasConflict: boolean; conflicts: any[] }> => {
    const {
      professeurId,
      classId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      excludeScheduleId,
    } = data;

    try {
      console.log("🔍 Checking schedule conflicts:", data);

      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.get("/schedules/check-conflicts", {
        params: {
          professeurId,
          classId,
          dayOfWeek,
          startTime,
          endTime,
          classroom,
          excludeScheduleId,
        },
      });

      const resData = response.data || {};
      const payload = resData.data || resData;
      const hasConflict =
        payload?.hasConflict ??
        (Array.isArray(payload?.conflicts) && payload.conflicts.length > 0) ??
        false;
      const conflicts = payload?.conflicts || [];

      console.log("✅ Check conflicts response:", payload);
      return { hasConflict, conflicts };
    } catch (error: any) {
      console.error("❌ Error checking conflicts:", {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });

      // Fallback sécurisé : pas de conflit détecté
      return { hasConflict: false, conflicts: [] };
    }
  },

  getEventsForDay: (dayOfWeek: number) => {
    const { events } = get();
    return events
      .filter((event) => event.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  getEventsForClass: (classId: string) => {
    const { events } = get();
    return events
      .filter((event) => event.classId === classId)
      .sort(
        (a, b) =>
          a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
      );
  },

  getEventsForTeacher: (teacherId: string) => {
    const { events } = get();
    return events
      .filter((event) => event.teacherId === teacherId)
      .sort(
        (a, b) =>
          a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
      );
  },

  addSchedule: async (assignmentId: string, scheduleData: any) => {
    set({ loading: true, error: null, errorDetails: null });

    try {
      // Validation des données
      if (
        !scheduleData.dayOfWeek ||
        !scheduleData.startTime ||
        !scheduleData.endTime
      ) {
        throw new Error("Jour, heure de début et heure de fin sont requis");
      }

      // Formater les données pour l'API
      const scheduleToSend = {
        assignmentId,
        classId: scheduleData.classId,
        dayOfWeek: scheduleData.dayOfWeek,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        classroom: scheduleData.classroom || null,
        recurrence: scheduleData.recurrence || null,
        untilDate: scheduleData.untilDate || null,
        notes: scheduleData.notes || null,
      };

      console.log("Sending schedule data:", scheduleToSend);

      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.post(`/schedules`, scheduleToSend);

      // Vérifier la réponse du serveur
      if (!response.data?.success) {
        const errorMessage =
          response.data?.message || "Erreur lors de la création";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const newSchedule = response.data?.data?.schedule || response.data?.data;

      if (!newSchedule) {
        const errorMessage = "Aucune donnée d'horaire reçue du serveur";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log("New schedule created:", newSchedule);

      // Ajouter à la liste actuelle
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        loading: false,
        error: null,
        errorDetails: null,
      }));

      toast.success("Horaire créé avec succès");
      return newSchedule;
    } catch (error: any) {
      console.error("Error adding schedule:", error);

      let errorMessage = "Erreur lors de l'ajout de l'horaire";
      let errorCode = "UNKNOWN_ERROR";

      if (error.response?.data?.code === "VALIDATION_ERROR") {
        errorMessage =
          error.response.data.errors
            ?.map((err: any) => `${err.field}: ${err.message}`)
            .join("\n") || "Erreur de validation";
        errorCode = "VALIDATION_ERROR";
      } else if (error.response?.data?.code === "PROFESSEUR_CONFLICT") {
        errorMessage = "Le professeur a déjà un cours à ce créneau horaire.";
        errorCode = "PROFESSEUR_CONFLICT";
      } else if (error.response?.data?.code === "CLASS_CONFLICT") {
        errorMessage = "La classe a déjà un cours à ce créneau horaire.";
        errorCode = "CLASS_CONFLICT";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        errorCode = error.response.data.code || "API_ERROR";
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: errorCode,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage, { duration: 5000 });
      throw error;
    }
  },

  updateSchedule: async (scheduleId: string, scheduleData: any) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.put(`/schedules/${scheduleId}`, scheduleData);

      if (!response.data?.success) {
        const errorMessage =
          response.data?.message || "Erreur lors de la mise à jour";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const updatedSchedule =
        response.data?.data?.schedule || response.data?.data;

      if (updatedSchedule) {
        set((state) => ({
          schedules: state.schedules.map((schedule) =>
            schedule.id === scheduleId
              ? { ...schedule, ...updatedSchedule }
              : schedule
          ),
          loading: false,
          error: null,
          errorDetails: null,
        }));

        toast.success("Horaire mis à jour avec succès");
      }

      return updatedSchedule;
    } catch (error: any) {
      console.error("Error updating schedule:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la mise à jour";

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: error.response?.status,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage);
      throw error;
    }
  },

  deleteSchedule: async (scheduleId: string) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.delete(`/schedules/${scheduleId}`);

      if (!response.data?.success) {
        const errorMessage =
          response.data?.message || "Erreur lors de la suppression";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Supprimer l'horaire de la liste
      set((state) => ({
        schedules: state.schedules.filter(
          (schedule) => schedule.id !== scheduleId
        ),
        loading: false,
        error: null,
        errorDetails: null,
      }));

      toast.success("Horaire supprimé avec succès");
    } catch (error: any) {
      console.error("Error deleting schedule:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la suppression";

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: error.response?.status,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage);
      throw error;
    }
  },

  generateClassTimetable: async (
    classId: string,
    academicYearId: string,
    constraints?: any
  ) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
      // CORRECTION : Utiliser le bon endpoint académique
      const response = await api.post(`/schedules/generate`, {
        classId,
        academicYearId,
        constraints,
      });

      if (!response.data?.success) {
        const errorMessage =
          response.data?.message || "Erreur lors de la génération";
        set({
          loading: false,
          error: errorMessage,
          errorDetails: response.data,
          lastErrorTime: new Date(),
        });

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const newSchedules = response.data?.data?.generatedSchedules || [];
      if (newSchedules.length > 0) {
        set((state) => ({
          schedules: [...state.schedules, ...newSchedules],
          loading: false,
          error: null,
          errorDetails: null,
        }));
      }

      toast.success("Emploi du temps généré avec succès");
      return response.data;
    } catch (error: any) {
      console.error("Error generating timetable:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la génération";

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: error.response?.status,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage);
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
  clearError: () => {
    set({
      error: null,
      errorDetails: null,
      lastErrorTime: null,
    });
  },
  clearFilters: () => {
    set({ filters: {} });
  },

  getFilteredEvents: () => {
    const { events, filters } = get();
    return events.filter((event) => {
      if (filters.classId && event.classId !== filters.classId) return false;
      if (filters.teacherId && event.teacherId !== filters.teacherId)
        return false;
      if (
        filters.dayOfWeek !== undefined &&
        event.dayOfWeek !== filters.dayOfWeek
      )
        return false;
      if (filters.room && event.room !== filters.room) return false;
      return true;
    });
  },

  getFilteredSchedules: () => {
    const { schedules, filters } = get();
    return schedules.filter((schedule) => {
      if (filters.classId && schedule.classId !== filters.classId) return false;
      if (filters.teacherId && schedule.professeurId !== filters.teacherId)
        return false;
      if (
        filters.dayOfWeek !== undefined &&
        schedule.dayOfWeek !== filters.dayOfWeek
      )
        return false;
      if (filters.room && schedule.classroom !== filters.room) return false;
      return true;
    });
  },
}));
