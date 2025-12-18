import { create } from "zustand";
// import { api } from '@/lib/api';
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";

interface Schedule {
  id: string;
  assignmentId: string;
  classId: string;
  professeurId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
  status: string;
  recurrence: string | null;
  untilDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  classAssignment?: {
    id: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    professeur: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  schoolClass?: {
    id: string;
    name: string;
    level: string;
  };
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface TimetableDay {
  day: string;
  label: string;
  slots: Schedule[];
}

interface ScheduleFilters {
  classId?: string;
  academicYearId?: string;
  professeurId?: string;
  dayOfWeek?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface Conflict {
  type: string;
  message: string;
  details: any[];
}

interface ScheduleState {
  // État
  schedules: Schedule[];
  timetable: Record<string, Schedule[]>;
  selectedSchedule: Schedule | null;
  filters: ScheduleFilters;
  loading: boolean;
  error: string | null;
  conflicts: Conflict[];

  // Données de référence
  classes: any[];
  classAssignments: any[];
  academicYears: any[];

  // Actions
  fetchSchedules: () => Promise<void>;
  fetchClassTimetable: (
    classId: string,
    academicYearId: string
  ) => Promise<void>;
  fetchProfessorSchedule: (professeurId: string) => Promise<void>;
  createSchedule: (data: any) => Promise<Schedule | null>;
  updateSchedule: (id: string, data: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  generateTimetable: (data: {
    classId: string;
    academicYearId: string;
    constraints?: any;
  }) => Promise<void>;
  checkConflicts: (data: any) => Promise<Conflict[]>;

  // Filtres
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  resetFilters: () => void;

  // Sélection
  setSelectedSchedule: (schedule: Schedule | null) => void;

  // Chargement des données
  loadReferenceData: () => Promise<void>;

  // Utilitaires
  getTimetableByDay: () => TimetableDay[];
  getAvailableTimeSlots: (day: string, duration: number) => string[];
}

const daysOfWeek = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
];

const initialFilters: ScheduleFilters = {
  status: "ACTIVE",
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // État initial
  schedules: [],
  timetable: {},
  selectedSchedule: null,
  filters: initialFilters,
  loading: false,
  error: null,
  conflicts: [],

  classes: [],
  classAssignments: [],
  academicYears: [],

  // Actions
  fetchSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/schedules?${params}`);
      set({ schedules: response.data.schedules || [], loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des horaires",
        loading: false,
      });
    }
  },

  fetchClassTimetable: async (classId: string, academicYearId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/schedules/class/${classId}`, {
        params: { academicYearId },
      });

      // Organiser les horaires par jour
      const timetableByDay: Record<string, Schedule[]> = {};
      daysOfWeek.forEach((day) => {
        timetableByDay[day.value] = [];
      });

      response.data.schedules?.forEach((schedule: Schedule) => {
        if (timetableByDay[schedule.dayOfWeek]) {
          timetableByDay[schedule.dayOfWeek].push(schedule);
        }
      });

      // Trier les créneaux par heure de début
      Object.keys(timetableByDay).forEach((day) => {
        timetableByDay[day].sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      });

      set({
        timetable: timetableByDay,
        schedules: response.data.schedules || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement de l'emploi du temps",
        loading: false,
      });
    }
  },

  fetchProfessorSchedule: async (professeurId: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/schedules/professor/${professeurId}`);
      set({ schedules: response.data.schedules || [], loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors du chargement",
        loading: false,
      });
    }
  },

  createSchedule: async (data) => {
    set({ loading: true, error: null, conflicts: [] });
    try {
      // Vérifier d'abord les conflits
      const conflicts = await get().checkConflicts(data);
      if (conflicts.length > 0) {
        set({ conflicts, loading: false });

        toast({
          title: "Conflit détecté",
          description: conflicts[0].message,
          variant: "destructive",
        });

        return null;
      }

      const response = await api.post("/schedules", data);

      // Ajouter à la liste
      set((state) => ({
        schedules: [response.data.schedule, ...state.schedules],
        loading: false,
      }));

      // Mettre à jour l'emploi du temps si une classe est sélectionnée
      const { filters } = get();
      if (filters.classId && filters.academicYearId) {
        get().fetchClassTimetable(filters.classId, filters.academicYearId);
      }

      toast({
        title: "✅ Cours planifié",
        description: "Le cours a été ajouté à l'emploi du temps",
      });

      return response.data.schedule;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la création";
      set({ error: errorMessage, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  updateSchedule: async (id: string, data: Partial<Schedule>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/schedules/${id}`, data);

      // Mettre à jour dans la liste
      set((state) => ({
        schedules: state.schedules.map((schedule) =>
          schedule.id === id ? response.data.schedule : schedule
        ),
        loading: false,
      }));

      // Mettre à jour l'emploi du temps
      const { filters } = get();
      if (filters.classId && filters.academicYearId) {
        get().fetchClassTimetable(filters.classId, filters.academicYearId);
      }

      toast({
        title: "✅ Cours modifié",
        description: "Le cours a été modifié avec succès",
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la mise à jour",
        loading: false,
      });
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le cours",
        variant: "destructive",
      });
    }
  },

  deleteSchedule: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/schedules/${id}`);

      // Supprimer de la liste
      set((state) => ({
        schedules: state.schedules.filter((schedule) => schedule.id !== id),
        loading: false,
      }));

      // Mettre à jour l'emploi du temps
      const { filters } = get();
      if (filters.classId && filters.academicYearId) {
        get().fetchClassTimetable(filters.classId, filters.academicYearId);
      }

      toast({
        title: "✅ Cours supprimé",
        description: "Le cours a été supprimé de l'emploi du temps",
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la suppression",
        loading: false,
      });
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive",
      });
    }
  },

  generateTimetable: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/schedules/generate", data);

      toast({
        title: "✅ Emploi du temps généré",
        description: `${response.data.data.statistics.successfullyPlaced} cours planifiés sur ${response.data.data.statistics.totalAssignments}`,
      });

      // Recharger l'emploi du temps
      if (data.classId && data.academicYearId) {
        await get().fetchClassTimetable(data.classId, data.academicYearId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la génération",
        loading: false,
      });
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer l'emploi du temps",
        variant: "destructive",
      });
    }
  },

  checkConflicts: async (data: any): Promise<Conflict[]> => {
    try {
      const response = await api.get("/schedules/check-conflicts", {
        params: data,
      });
      return response.data.conflicts || [];
    } catch (error) {
      console.error("Error checking conflicts:", error);
      return [];
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setSelectedSchedule: (schedule) => {
    set({ selectedSchedule: schedule });
  },

  loadReferenceData: async () => {
    try {
      const [classesRes, assignmentsRes, yearsRes] = await Promise.all([
        api.get("/school-classes?status=Active"),
        api.get("/class-assignments?status=Active&limit=1000"),
        api.get("/academic-years"),
      ]);

      set({
        classes: classesRes.data || [],
        classAssignments: assignmentsRes.data.assignments || [],
        academicYears: yearsRes.data || [],
      });
    } catch (error) {
      console.error("Error loading reference data:", error);
    }
  },

  // Utilitaires
  getTimetableByDay: () => {
    const { timetable } = get();
    return daysOfWeek.map((day) => ({
      day: day.value,
      label: day.label,
      slots: timetable[day.value] || [],
    }));
  },

  getAvailableTimeSlots: (day: string, duration: number) => {
    const { timetable } = get();
    const daySchedules = timetable[day] || [];

    // Plages horaires de base
    const baseSlots = [
      { start: "08:00", end: "09:30" },
      { start: "09:45", end: "11:15" },
      { start: "11:30", end: "13:00" },
      { start: "14:00", end: "15:30" },
      { start: "15:45", end: "17:15" },
    ];

    // Filtrer les créneaux déjà occupés
    return baseSlots
      .filter((slot) => {
        const slotStart = new Date(`2000-01-01T${slot.start}`);
        const slotEnd = new Date(`2000-01-01T${slot.end}`);

        // Vérifier si le créneau chevauche un cours existant
        return !daySchedules.some((schedule) => {
          const scheduleStart = new Date(schedule.startTime);
          const scheduleEnd = new Date(schedule.endTime);

          return (
            (slotStart < scheduleEnd && slotEnd > scheduleStart) ||
            (scheduleStart < slotEnd && scheduleEnd > slotStart)
          );
        });
      })
      .map((slot) => `${slot.start}-${slot.end}`);
  },
}));
