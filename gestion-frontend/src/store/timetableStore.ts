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

  // Filters
  setFilters: (filters: Partial<TimetableStore["filters"]>) => void;
  clearFilters: () => void;

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

  fetchClassTimetable: async (
    classId: string,
    options?: { academicYearId?: string }
  ) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
      const params = new URLSearchParams();
      if (options?.academicYearId) {
        params.append("academicYearId", options.academicYearId);
      }

      const response = await api.get(
        `/timetables/class/${classId}?${params.toString()}`
      );

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

        // Afficher une notification
        toast.error(errorMessage);
        return [];
      }

      const schedules = response.data?.data?.schedules || [];

      console.log(" Schedules loaded:", {
        count: schedules.length,
        schedules: schedules.map((s) => ({
          id: s.id,
          day: s.dayOfWeek,
          time: `${s.startTime}-${s.endTime}`,
          subject: s.classAssignment?.subject?.name || "No subject",
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
      console.error(" Error fetching class timetable:", error);

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
      console.log(" Creating schedule with data:", {
        assignmentId,
        scheduleData,
      });

      const response = await api.post(
        `/timetables/assignments/${assignmentId}/schedules`,
        scheduleData
      );

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

      const newSchedule =
        response.data?.data?.schedule || response.data?.schedule;

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

      console.log(" New schedule created:", {
        id: newSchedule.id,
        day: newSchedule.dayOfWeek,
        time: `${newSchedule.startTime}-${newSchedule.endTime}`,
      });

      // Ajouter à la liste actuelle
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        loading: false,
        error: null,
        errorDetails: null,
      }));

      return newSchedule;
    } catch (error: any) {
      console.error(" Error adding schedule:", error);

      // Déterminer le message d'erreur
      let errorMessage = "Erreur lors de l'ajout de l'horaire";
      let errorCode = "UNKNOWN_ERROR";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        errorCode = error.response.data.code || "API_ERROR";
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.response?.data?.code === "PROFESSEUR_CONFLICT") {
        errorMessage = "Le professeur a déjà un cours à ce créneau horaire";
      } else if (error.response?.data?.code === "CLASS_CONFLICT") {
        errorMessage = "La classe a déjà un cours à ce créneau horaire";
      } else if (error.response?.data?.code === "INVALID_TIME_RANGE") {
        errorMessage = "Les horaires spécifiés sont invalides";
      }

      set({
        loading: false,
        error: errorMessage,
        errorDetails: {
          code: errorCode,
          status: error.response?.status,
          data: error.response?.data,
          originalError: error.message,
        },
        lastErrorTime: new Date(),
      });

      toast.error(errorMessage);
      throw error;
    }
  },
  updateSchedule: async (scheduleId: string, scheduleData: any) => {
    set({ loading: true, error: null, errorDetails: null });
    try {
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

      const updatedSchedule = response.data?.data?.schedule;

      if (updatedSchedule) {
        set((state) => ({
          schedules: state.schedules.map((schedule) =>
            schedule.id === scheduleId ? updatedSchedule : schedule
          ),
          loading: false,
          error: null,
          errorDetails: null,
        }));
      }

      return updatedSchedule;
    } catch (error: any) {
      console.error(" Error updating schedule:", error);

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
    } catch (error: any) {
      console.error(" Error deleting schedule:", error);

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
    try {
      const response = await api.post(`/generate/class/${classId}`, {
        academicYearId,
        constraints,
      });

      const newSchedules = response.data?.data?.generatedSchedules || [];
      if (newSchedules.length > 0) {
        set((state) => ({
          schedules: [...state.schedules, ...newSchedules],
        }));
      }

      return response.data;
    } catch (error) {
      console.error("Error generating timetable:", error);
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
