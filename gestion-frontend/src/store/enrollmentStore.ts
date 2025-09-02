// store/enrollmentStore.ts
import { create } from "zustand";
import api from "../services/api";
import {
  Enrollment,
  CreateEnrollmentData,
  UpdateEnrollmentData,
} from "../types/academic";

interface EnrollmentStore {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchEnrollments: () => Promise<void>;
  addEnrollment: (enrollment: CreateEnrollmentData) => Promise<void>;
  updateEnrollment: (
    id: string,
    enrollment: UpdateEnrollmentData
  ) => Promise<void>;
  updateEnrollmentStatus: (
    id: string,
    status: "Active" | "Suspended" | "Completed"
  ) => Promise<void>;
  deleteEnrollment: (id: string) => Promise<void>;

  // Méthodes utilitaires synchrones
  getEnrollmentsByStudent: (studentId: string) => Enrollment[];
  getEnrollmentsByFaculty: (faculty: string, level?: string) => Enrollment[];

  // Méthode pour charger les inscriptions par étudiant
  fetchEnrollmentsByStudent: (studentId: string) => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  enrollments: [],
  loading: false,
  error: null,

  // Récupère toutes les inscriptions
  fetchEnrollments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/enrollments");
      set({
        enrollments: response.data,
        loading: false,
      });
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      set({
        error:
          err.response?.data?.error ||
          "Erreur lors du chargement des inscriptions",
        loading: false,
      });
      throw err;
    }
  },

  // Ajoute une nouvelle inscription
  addEnrollment: async (enrollmentData: CreateEnrollmentData) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        studentId: enrollmentData.studentId,
        faculty: enrollmentData.faculty,
        level: enrollmentData.level,
        academicYear: enrollmentData.academicYearId,
        enrollmentDate:
          enrollmentData.enrollmentDate || new Date().toISOString(),
        status: enrollmentData.status || "Active",
      };

      const response = await api.post("/enrollments", payload);

      // Ajoute la nouvelle inscription à la liste actuelle
      set((state) => ({
        enrollments: [...state.enrollments, response.data],
        loading: false,
      }));

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Erreur lors de l'ajout de l'inscription";
      console.error("Failed to add enrollment:", err);
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Met à jour une inscription
  updateEnrollment: async (
    id: string,
    enrollmentData: UpdateEnrollmentData
  ) => {
    set({ loading: true, error: null });
    try {
      const cleanData: any = {};

      if (enrollmentData.faculty !== undefined)
        cleanData.faculty = enrollmentData.faculty;
      if (enrollmentData.level !== undefined)
        cleanData.level = enrollmentData.level;
      if (enrollmentData.academicYear !== undefined)
        cleanData.academicYear = enrollmentData.academicYear;
      if (enrollmentData.status !== undefined)
        cleanData.status = enrollmentData.status;

      const response = await api.put(`/enrollments/${id}`, cleanData);

      // Met à jour l'inscription dans la liste
      set((state) => ({
        enrollments: state.enrollments.map((e) =>
          e.id === id ? { ...e, ...response.data } : e
        ),
        loading: false,
      }));

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Erreur lors de la mise à jour de l'inscription";
      console.error("Failed to update enrollment:", err);
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Met à jour uniquement le statut
  updateEnrollmentStatus: async (
    id: string,
    status: "Active" | "Suspended" | "Completed"
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/enrollments/${id}/status`, { status });

      // Met à jour le statut dans la liste
      set((state) => ({
        enrollments: state.enrollments.map((e) =>
          e.id === id ? { ...e, status } : e
        ),
        loading: false,
      }));

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Erreur lors du changement de statut";
      console.error("Failed to update enrollment status:", err);
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Supprime une inscription
  deleteEnrollment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/enrollments/${id}`);

      // Supprime l'inscription de la liste
      set((state) => ({
        enrollments: state.enrollments.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        "Erreur lors de la suppression de l'inscription";
      console.error("Failed to delete enrollment:", err);
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Méthodes utilitaires (synchrone)
  getEnrollmentsByStudent: (studentId: string) => {
    return get().enrollments.filter((e) => e.studentId === studentId);
  },

  getEnrollmentsByFaculty: (faculty: string, level?: string) => {
    return get().enrollments.filter(
      (e) => e.faculty === faculty && (level ? e.level === level : true)
    );
  },

  // Charge les inscriptions par étudiant
  fetchEnrollmentsByStudent: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/enrollments?studentId=${studentId}`);
      set({
        enrollments: response.data,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        "Erreur lors du chargement des inscriptions";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },
}));
