// store/assignmentStore.ts
import { create } from "zustand";
import api from "@/services/api";

interface ClassAssignment {
  academicYearId: string;
  _count: any;
  id: string;
  subject: {
    id: string;
    name: string;
    code: string;
    coefficient: number;
  };
  professeurId?: string | null;
  professeur?: {
    matricule: string;
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  classLevel: string;
  schoolClassId?: string | null;
  academicYear?: {
    id: string;
    year: string;
  };
  schoolClass?: {
    id: string;
    name: string;
    level: string;
  } | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AssignmentStore {
  // État
  assignments: ClassAssignment[];
  currentAssignment: ClassAssignment | null;
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Filtres
  filters: {
    classLevel: string;
    search?: string;
    classId?: string;
    professeurId?: string;
    status?: string;
    academicYearId?: string;
  };

  // Actions
  fetchAssignments: () => Promise<void>;
  fetchAssignmentsByClass: (classId: string) => Promise<ClassAssignment[]>;
  fetchAssignmentsByClassAndLevel: (
    classId: string,
    classLevel: string
  ) => Promise<ClassAssignment[]>;
  fetchAssignmentById: (id: string) => Promise<ClassAssignment>;
  createAssignment: (data: any) => Promise<ClassAssignment>;
  updateAssignment: (id: string, data: any) => Promise<ClassAssignment>;
  deleteAssignment: (id: string) => Promise<void>;
  assignSubjectToLevels: (data: {
    subjectId: string;
    classLevels: string[];
    academicYearId: string;
    professeurId?: string | null;
  }) => Promise<{
    assignedCount: number;
    skippedCount: number;
    skippedLevels?: string[];
    message?: string;
  }>;
  setFilters: (filters: Partial<AssignmentStore["filters"]>) => void;
  clearError: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  // État initial
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  filters: {
    classLevel: "",
  },

  // Actions
  fetchAssignments: async () => {
    set({ loading: true, error: null });

    try {
      const { filters } = get();
      const params: any = {};

      // Nettoyer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params[key] = value;
        }
      });

      // Ajouter la pagination
      params.page = params.page || 1;
      params.limit = params.limit || 20;

      const response = await api.get("/class-assignments", { params });

      // CORRECTION: Extraire correctement les données
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        set({
          assignments: Array.isArray(responseData.data.assignments)
            ? responseData.data.assignments
            : [],
          loading: false,
          pagination: responseData.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        });
      } else {
        // Fallback: essayer d'autres structures de données
        const assignmentsData =
          responseData.data || responseData.assignments || responseData;

        set({
          assignments: Array.isArray(assignmentsData) ? assignmentsData : [],
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      console.error("Error fetching assignments:", error);
      return;
    }
  },

  fetchAssignmentsByClass: async (
    classId: string
  ): Promise<ClassAssignment[]> => {
    set({ loading: true, error: null });

    try {
      console.log(`Fetching assignments for class: ${classId}`);

      // CORRECTION: Utiliser directement l'URL avec paramètres
      const response = await api.get(`/class-assignments/class/${classId}`, {
        params: {
          status: "Active",
        },
      });

      const responseData = response.data;
      console.log("Assignments response:", responseData);

      let assignments: ClassAssignment[] = [];

      // Différentes structures de réponse possibles
      if (responseData.success && responseData.data) {
        if (Array.isArray(responseData.data)) {
          assignments = responseData.data;
        } else if (Array.isArray(responseData.data.assignments)) {
          assignments = responseData.data.assignments;
        } else if (responseData.data.assignments) {
          assignments = [responseData.data.assignments];
        }
      } else if (Array.isArray(responseData)) {
        assignments = responseData;
      } else if (responseData.assignments) {
        assignments = Array.isArray(responseData.assignments)
          ? responseData.assignments
          : [responseData.assignments];
      }

      console.log(
        `Found ${assignments.length} assignments for class ${classId}`
      );

      // Mettre à jour le store
      set((state) => ({
        assignments: [...state.assignments, ...assignments],
        loading: false,
      }));

      return assignments;
    } catch (error: any) {
      console.error(`Error fetching assignments for class ${classId}:`, error);
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });

      // Retourner un tableau vide au lieu de lancer une erreur
      return [];
    }
  },

  fetchAssignmentsByClassAndLevel: async (
    classId: string,
    classLevel: string
  ): Promise<ClassAssignment[]> => {
    set({ loading: true, error: null });
    try {
      console.log("📡 Fetching assignments for:", {
        classId,
        classLevel,
        url: `/class-assignments/class/${classId}/level/${classLevel}`,
      });
      const response = await api.get(
        `/class-assignments/class/${classId}/level/${classLevel}`
      );
      const responseData = response.data;
      let assignments: ClassAssignment[] = [];

      if (responseData.success && responseData.data) {
        if (Array.isArray(responseData.data)) {
          assignments = responseData.data;
        } else if (Array.isArray(responseData.data.assignments)) {
          assignments = responseData.data.assignments;
        } else if (responseData.data.assignments) {
          assignments = [responseData.data.assignments];
        } else {
          assignments = [];
        }
      } else if (Array.isArray(responseData)) {
        assignments = responseData;
      } else if (responseData.assignments) {
        assignments = Array.isArray(responseData.assignments)
          ? responseData.assignments
          : [responseData.assignments];
      }
      set((state) => ({
        assignments: [...state.assignments, ...assignments],
        loading: false,
      }));
      return assignments;
    } catch (error: any) {
      console.error(
        `Error fetching assignments for class ${classId} and level ${classLevel}:`,
        error
      );
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      return [];
    }
  },

  fetchAssignmentById: async (id: string): Promise<ClassAssignment> => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/class-assignments/${id}`);
      const assignment = response.data.data?.assignment || response.data.data;

      set({
        currentAssignment: assignment,
        loading: false,
      });

      return assignment;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  createAssignment: async (data: any): Promise<ClassAssignment> => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/class-assignments", data);
      const newAssignment =
        response.data.data?.assignment || response.data.data;

      set((state) => ({
        assignments: [newAssignment, ...state.assignments],
        loading: false,
      }));

      return newAssignment;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateAssignment: async (id: string, data: any): Promise<ClassAssignment> => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/class-assignments/${id}`, data);
      const updatedAssignment =
        response.data.data?.assignment || response.data.data;

      set((state) => ({
        assignments: state.assignments.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment
        ),
        currentAssignment: updatedAssignment,
        loading: false,
      }));

      return updatedAssignment;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteAssignment: async (id: string): Promise<void> => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/class-assignments/${id}`);

      set((state) => ({
        assignments: state.assignments.filter(
          (assignment) => assignment.id !== id
        ),
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

  assignSubjectToLevels: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        "/class-assignments/assign-to-levels",
        data
      );
      const result = response.data?.data;

      set({ loading: false });

      return {
        assignedCount: result?.assignedCount ?? 0,
        skippedCount: result?.skippedCount ?? 0,
        skippedLevels: result?.skippedLevels,
        message: response.data?.message,
      };
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de l'inscription au programme",
        loading: false,
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    get().fetchAssignments();
  },

  clearError: () => set({ error: null }),
}));
