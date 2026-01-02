// Assurez-vous que store/enrollmentStore.ts a ces méthodes :
import { create } from "zustand";
// import { api } from "@/lib/axios";
import { toast } from "sonner";
import api from "@/services/api";

interface EnrollmentStore {
  enrollments: any[];
  loading: boolean;
  error: string | null;

  // Méthodes existantes
  fetchEnrollments: (params?: any) => Promise<void>;
  addEnrollment: (data: any) => Promise<any>;
  updateEnrollment: (id: string, data: any) => Promise<any>;
  deleteEnrollment: (id: string) => Promise<any>;
  getStudentEnrollmentHistory: (studentId: string) => Promise<any>;

  // Méthodes manquantes à ajouter
  reenrollStudent: (data: {
    studentId: string;
    classId: string;
    academicYearId: string;
    previousAcademicYearId?: string;
    enrollmentDate?: string;
    notes?: string;
  }) => Promise<any>;

  validateReenrollment: (studentId: string) => Promise<any>;

  getAvailableFeeStructures: () => Promise<any[]>;

  assignFeesToEnrollment: (
    enrollmentId: string,
    feeStructureIds: string[]
  ) => Promise<any>;
}

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  enrollments: [],
  loading: false,
  error: null,

  fetchEnrollments: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get("/enrollments", { params });
      set({
        enrollments: response.data.data?.enrollments || [],
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("Erreur lors du chargement des inscriptions");
    }
  },

  addEnrollment: async (data) => {
    try {
      const response = await api.post("/enrollments", data);
      toast.success("Inscription créée avec succès");
      return response.data;
    } catch (error: any) {
      console.error("Erreur création inscription:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la création de l'inscription"
      );
      throw error;
    }
  },

  updateEnrollment: async (id, data) => {
    try {
      const response = await api.put(`/enrollments/${id}`, data);
      toast.success("Inscription mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      console.error("Erreur mise à jour inscription:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour de l'inscription"
      );
      throw error;
    }
  },

  deleteEnrollment: async (id) => {
    try {
      const response = await api.delete(`/enrollments/${id}/delete`);
      toast.success("Inscription supprimée avec succès");
      return response.data;
    } catch (error: any) {
      console.error("Erreur suppression inscription:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de l'inscription"
      );
      throw error;
    }
  },

  // Méthodes manquantes à implémenter
  reenrollStudent: async (data) => {
    try {
      const response = await api.post("/enrollments/reenroll", data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur réinscription:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la réinscription"
      );
      throw error;
    }
  },

  validateReenrollment: async (studentId) => {
    try {
      const response = await api.get(`/enrollments/validate/${studentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erreur validation réinscription:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la validation de la réinscription"
      );
      throw error;
    }
  },

  getAvailableFeeStructures: async () => {
    try {
      const response = await api.get("/fee-structures");
      return response.data.data?.feeStructures || [];
    } catch (error: any) {
      console.error("Erreur récupération frais:", error);
      return [];
    }
  },

  // Dans enrollmentStore.ts, ajoutez cette méthode
  getStudentEnrollmentHistory: async (studentId: string) => {
    try {
      const response = await api.get(`/enrollments/history/${studentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération historique:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la récupération de l'historique"
      );
      throw error;
    }
  },

  assignFeesToEnrollment: async (enrollmentId, feeStructureIds) => {
    try {
      const response = await api.post(
        `/enrollments/${enrollmentId}/assign-fees`,
        {
          feeStructureIds,
        }
      );
      toast.success("Frais attribués avec succès");
      return response.data;
    } catch (error: any) {
      console.error("Erreur attribution frais:", error);
      toast.error("Erreur lors de l'attribution des frais");
      throw error;
    }
  },
}));
