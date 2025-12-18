/**
 * @file eventStore.ts
 * @description Store Zustand pour la gestion des événements
 */

import { create } from "zustand";
import api from "../services/api";

// Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: string;
  category: string;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaces pour les filtres
interface EventFilters {
  search?: string;
  status?: string;
  category?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface pour l'état du store
interface EventStore {
  // État
  events: Event[];
  currentEvent: Event | null;
  upcomingEvents: Event[];
  loading: boolean;
  error: string | null;
  filters: EventFilters;

  // Données complémentaires
  eventCategories: string[];
  eventStatuses: string[];

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<EventFilters>) => void;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<Event>;
  fetchUpcomingEvents: (limit?: number) => Promise<void>;
  fetchEventsByCategory: (
    category: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  createEvent: (eventData: CreateEventData) => Promise<Event>;
  updateEvent: (id: string, eventData: UpdateEventData) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  clearCurrentEvent: () => void;
  clearError: () => void;
  clearEvents: () => void;
  resetFilters: () => void;
}

interface CreateEventData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: string;
  category: string;
  isPublic?: boolean;
}

interface UpdateEventData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  organizer?: string;
  category?: string;
  isPublic?: boolean;
  status?: string;
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
let searchTimeout: NodeJS.Timeout | null = null;
export const useEventStore = create<EventStore>((set, get) => ({
  // État initial
  events: [],
  currentEvent: null,
  upcomingEvents: [],
  loading: false,
  error: null,

  filters: {
    search: "",
    status: "",
    category: "",
    isPublic: undefined, // undefined au lieu de true/false
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
    sortBy: "startDate",
    sortOrder: "asc" as "asc",
  },

  eventCategories: [
    "General", // Assurez-vous que ça correspond à votre backend
    "Academic",
    "Cultural",
    "Sports",
    "Meeting",
    "Other",
  ],
  eventStatuses: ["Scheduled", "Cancelled", "Completed", "Postponed"],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions

  setFilters: (newFilters) => {
    // Annuler le timeout précédent si on change la recherche
    if (newFilters.search !== undefined && searchTimeout) {
      clearTimeout(searchTimeout);
    }

    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        page: 1, // Réinitialiser la page quand les filtres changent
      },
    }));

    // Pour la recherche, utiliser un debounce
    if (newFilters.search !== undefined) {
      searchTimeout = setTimeout(() => {
        get().fetchEvents();
      }, 500); // 500ms de délai
    } else {
      // Pour les autres filtres, appeler immédiatement
      get().fetchEvents();
    }
  },
  resetFilters: () => {
    set({
      filters: {
        search: "",
        status: "",
        category: "",
        isPublic: undefined,
        startDate: "",
        endDate: "",
        page: 1,
        limit: 20,
        sortBy: "startDate",
        sortOrder: "asc",
      },
    });

    setTimeout(() => {
      get().fetchEvents();
    }, 100);
  },

  fetchEvents: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = get();

      // Construire les params bruts
      const rawParams = {
        search: filters.search,
        status: filters.status,
        category: filters.category,
        isPublic: filters.isPublic,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: filters.page || 1,
        limit: filters.limit || 20,
        sortBy: filters.sortBy || "startDate",
        sortOrder: filters.sortOrder || "asc",
      };

      // Nettoyer les params
      const params = cleanParams(rawParams);

      console.log("📡 Fetching events...");
      console.log("Raw filters:", rawParams);
      console.log("Cleaned params:", params);
      console.log(
        "Full URL:",
        `/events?${new URLSearchParams(params as any).toString()}`
      );

      const response = await api.get("/events", { params });
      console.log("✅ Events response:", response.data);

      const { data: events, meta } = response.data;

      set({
        events: events || [],
        loading: false,
        pagination: {
          page: meta?.pagination?.page || 1,
          limit: meta?.pagination?.limit || 20,
          total: meta?.pagination?.total || 0,
          totalPages: meta?.pagination?.totalPages || 1,
        },
      });
    } catch (error: any) {
      console.error("❌ Error fetching events:", {
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
          "Erreur lors du chargement des événements",
        loading: false,
      });
    }
  },

  fetchEventById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Fetching event ${id}...`);
      const response = await api.get(`/events/${id}`);
      console.log(`✅ Event ${id} response:`, response.data);

      const { data: event } = response.data;

      set({
        currentEvent: event,
        loading: false,
      });

      return event;
    } catch (error: any) {
      console.error(`❌ Error fetching event ${id}:`, error.response?.data);
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchUpcomingEvents: async (limit: number = 5) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Fetching upcoming events (limit: ${limit})...`);
      const response = await api.get("/events/upcoming", {
        params: { limit },
      });
      console.log("✅ Upcoming events response:", response.data);

      const { data: events } = response.data;

      set({
        upcomingEvents: events || [],
        loading: false,
      });
    } catch (error: any) {
      console.error("❌ Error fetching upcoming events:", error.response?.data);
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
    }
  },

  fetchEventsByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 10
  ) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Fetching events by category ${category}...`);
      const response = await api.get(`/events/category/${category}`, {
        params: { page, limit },
      });
      console.log(`✅ Events by category ${category} response:`, response.data);

      const { data: events, meta } = response.data;

      set({
        events: events || [],
        loading: false,
        pagination: {
          page: meta?.pagination?.page || 1,
          limit: meta?.pagination?.limit || 10,
          total: meta?.pagination?.total || 0,
          totalPages: meta?.pagination?.totalPages || 1,
        },
      });
    } catch (error: any) {
      console.error(
        `❌ Error fetching events by category ${category}:`,
        error.response?.data
      );
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
    }
  },

  createEvent: async (eventData: CreateEventData) => {
    set({ loading: true, error: null });

    try {
      console.log("📡 Creating event...", eventData);
      const response = await api.post("/events", eventData);
      console.log("✅ Event created:", response.data);

      const { data: newEvent } = response.data;

      set((state) => ({
        events: [newEvent, ...state.events],
        upcomingEvents: [newEvent, ...state.upcomingEvents].slice(0, 5),
        loading: false,
      }));

      return newEvent;
    } catch (error: any) {
      console.error("❌ Error creating event:", error.response?.data);
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateEvent: async (id: string, eventData: UpdateEventData) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Updating event ${id}...`, eventData);
      const response = await api.put(`/events/${id}`, eventData);
      console.log(`✅ Event ${id} updated:`, response.data);

      const { data: updatedEvent } = response.data;

      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? updatedEvent : event
        ),
        upcomingEvents: state.upcomingEvents.map((event) =>
          event.id === id ? updatedEvent : event
        ),
        currentEvent: updatedEvent,
        loading: false,
      }));

      return updatedEvent;
    } catch (error: any) {
      console.error(`❌ Error updating event ${id}:`, error.response?.data);
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null });

    try {
      console.log(`📡 Deleting event ${id}...`);
      await api.delete(`/events/${id}`);
      console.log(`✅ Event ${id} deleted`);

      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        upcomingEvents: state.upcomingEvents.filter((event) => event.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error(`❌ Error deleting event ${id}:`, error.response?.data);
      set({
        error: error.response?.data?.message || "Erreur de suppression",
        loading: false,
      });
      throw error;
    }
  },

  clearCurrentEvent: () =>
    set({
      currentEvent: null,
    }),

  clearError: () => set({ error: null }),

  clearEvents: () =>
    set({
      events: [],
      currentEvent: null,
      upcomingEvents: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));

export default useEventStore;
