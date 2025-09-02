// store/courseAssignmentStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import {
  CourseAssignment,
  UE,
  Professeur,
  AcademicYear,
} from "../types/academic";

interface CourseAssignmentState {
  assignments: CourseAssignment[];
  ues: UE[];
  professeurs: Professeur[];
  academicYears: AcademicYear[];
  loading: boolean;
  error: string | null;
  fetchAssignmentsByProfessor: (professorId: string) => Promise<void>;

  // Methods
  fetchAssignments: (filters?: AssignmentFilters) => Promise<void>;
  fetchUEs: () => Promise<void>;
  fetchProfesseurs: () => Promise<void>;
  fetchAcademicYears: () => Promise<void>;
  addAssignment: (
    assignment: Omit<CourseAssignment, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateAssignment: (
    id: string,
    assignment: Partial<CourseAssignment>
  ) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  getAssignmentById: (id: string) => CourseAssignment | undefined;
  fetchAssignmentsByFaculty: (
    facultyId: string,
    level: string,
    academicYearId: string,
    semester: string
  ) => Promise<any[]>;
  fetchUeByFacultyAndLevel: (facultyId: string, level: string) => Promise<UE[]>;
}

interface AssignmentFilters {
  facultyId?: string;
  level?: string;
  academicYearId?: string;
  semester?: string;
  professeurId?: string;
}

export const useCourseAssignmentStore = create<CourseAssignmentState>()(
  persist(
    (set, get) => ({
      assignments: [],
      ues: [],
      professeurs: [],
      academicYears: [],
      loading: false,
      error: null,

      fetchAssignments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
          });

          const response = await api.get(
            `/course-assignments?${queryParams.toString()}`
          );
          set({ assignments: response.data, loading: false });
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Erreur lors du chargement des affectations",
            loading: false,
          });
        }
      },

      fetchUEs: async () => {
        try {
          const response = await api.get("/ues");
          set({ ues: response.data });
        } catch (error) {
          console.error("Erreur récupération UEs:", error);
        }
      },

      fetchProfesseurs: async () => {
        try {
          const response = await api.get("/professeurs");
          set({ professeurs: response.data });
        } catch (error) {
          console.error("Erreur récupération professeurs:", error);
        }
      },

      fetchAcademicYears: async () => {
        try {
          const response = await api.get("/academic-years");
          set({ academicYears: response.data });
        } catch (error) {
          console.error("Erreur récupération années académiques:", error);
        }
      },

      addAssignment: async (assignmentData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(
            "/course-assignments",
            assignmentData
          );

          set((state) => ({
            assignments: [...state.assignments, response.data],
            loading: false,
          }));
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Erreur lors de la création";
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      updateAssignment: async (id, assignment) => {
        set({ loading: true });
        try {
          const response = await api.put(
            `/course-assignments/${id}`,
            assignment
          );

          set((state) => ({
            assignments: state.assignments.map((a) =>
              a.id === id ? { ...a, ...response.data } : a
            ),
            loading: false,
          }));
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Erreur lors de la mise à jour";
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      deleteAssignment: async (id) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`/course-assignments/${id}`);
          set((state) => ({
            assignments: state.assignments.filter(
              (assignment) => assignment.id !== id
            ),
            loading: false,
          }));
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Erreur lors de la suppression",
            loading: false,
          });
          throw error;
        }
      },

      fetchAssignmentsByFaculty: async (
        facultyId,
        level,
        academicYearId,
        semester
      ) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams();
          params.append("facultyId", facultyId);
          params.append("level", level);
          params.append("academicYearId", academicYearId);
          params.append("semester", semester);

          const response = await api.get(`/course-assignments?${params}`);
          set({ loading: false });
          return response.data; // Retourner les données pour les utiliser dans le composant
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Erreur de chargement",
            loading: false,
          });
          throw error;
        }
      },

      fetchUeByFacultyAndLevel: async (facultyId: string, level: string) => {
        try {
          const response = await api.get(
            `/ues/faculty/${facultyId}/level/${level}`
          );
          return response.data;
        } catch (error: any) {
          console.error("Erreur:", error);
          return [];
        }
      },

      fetchAssignmentsByProfessor: async (professorId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(
            `/professeurs/${professorId}/assignments`
          );
          set({ assignments: response.data, loading: false });
        } catch (error) {
          set({
            error: "Erreur lors du chargement des affectations",
            loading: false,
          });
        }
      },

      getAssignmentById: (id) => {
        return get().assignments.find((a) => a.id === id);
      },
    }),
    {
      name: "course-assignment-storage",
      partialize: (state) => ({
        assignments: state.assignments,
        ues: state.ues,
        professeurs: state.professeurs,
        academicYears: state.academicYears,
      }),
    }
  )
);

export const initializeCourseAssignmentStore = async () => {
  const { fetchAssignments, fetchUEs, fetchProfesseurs, fetchAcademicYears } =
    useCourseAssignmentStore.getState();
  await Promise.all([
    fetchAssignments(),
    fetchUEs(),
    fetchProfesseurs(),
    fetchAcademicYears(),
  ]);
};
