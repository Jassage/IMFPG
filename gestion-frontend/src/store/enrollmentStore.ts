import { create } from "zustand";
import api from "../services/api";
import { Enrollment } from "../types/academic";
import { FeeStructure } from "@/types/enrollementTypes";

type EnrollmentStore = {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;

  // Méthodes de base
  fetchEnrollments: () => Promise<void>;
  fetchEnrollmentById: (id: string) => Promise<Enrollment>;
  fetchStudentEnrollments: (studentId: string) => Promise<void>;
  fetchEnrollmentStats: (academicYearId?: string) => Promise<any>;
  fetchEnrollmentHistory: (studentId: string) => Promise<any>;

  // Méthodes CRUD
  addEnrollment: (enrollment: {
    studentId: string;
    classId: string;
    academicYearId: string;
    enrollmentDate?: string;
    status?: "Active" | "Suspended" | "Completed";
    assignFees?: boolean;
    selectedFeeStructures?: string[];
  }) => Promise<void>;

  updateEnrollment: (
    id: string,
    enrollment: Partial<Enrollment>
  ) => Promise<void>;
  deleteEnrollment: (id: string) => Promise<void>;

  // Méthodes spéciales
  reenrollStudent: (data: {
    studentId: string;
    classId: string;
    academicYearId: string;
    enrollmentDate?: string;
    notes?: string;
  }) => Promise<void>;

  unenrollStudent: (id: string, reason?: string) => Promise<void>;
  validateReenrollment: (studentId: string) => Promise<any>;
  createBulkEnrollments: (enrollments: any[]) => Promise<any>;

  // Méthodes utilitaires
  getEnrollmentsByStudent: (studentId: string) => Enrollment[];
  getEnrollmentsByClass: (classId: string) => Enrollment[];
  getEnrollmentsByAcademicYear: (academicYearId: string) => Enrollment[];
  getEnrollmentsByStatus: (status: Enrollment["status"]) => Enrollment[];
  assignFeesToEnrollment: (
    enrollmentId: string,
    feeStructureIds: string[]
  ) => Promise<any>;

  // Méthode pour les frais
  getAvailableFeeStructures: () => Promise<any[]>;
};

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  enrollments: [],
  loading: false,
  error: null,

  /**
   * @desc Récupère toutes les inscriptions
   */
  fetchEnrollments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/enrollments");

      // Extraire le tableau d'inscriptions de la réponse
      let enrollmentsArray = [];

      if (
        response.data.enrollments &&
        Array.isArray(response.data.enrollments)
      ) {
        enrollmentsArray = response.data.enrollments;
      } else if (Array.isArray(response.data)) {
        enrollmentsArray = response.data;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data.enrollments)
      ) {
        enrollmentsArray = response.data.data.enrollments;
      } else {
        enrollmentsArray = [];
      }

      // Convertir les dates string en Date
      const formattedEnrollments = enrollmentsArray.map((enrollment: any) => ({
        ...enrollment,
        enrollmentDate: enrollment.enrollmentDate
          ? new Date(enrollment.enrollmentDate)
          : new Date(),
        createdAt: enrollment.createdAt
          ? new Date(enrollment.createdAt)
          : undefined,
        updatedAt: enrollment.updatedAt
          ? new Date(enrollment.updatedAt)
          : undefined,
        reenrollmentDate: enrollment.reenrollmentDate
          ? new Date(enrollment.reenrollmentDate)
          : undefined,
      }));

      set({
        enrollments: formattedEnrollments,
        loading: false,
      });
    } catch (err) {
      set({
        error: "Erreur lors du chargement des inscriptions",
        loading: false,
      });
    }
  },

  /**
   * @desc Récupère une inscription par son ID
   */
  fetchEnrollmentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/enrollments/${id}`);

      // Gérer différents formats de réponse
      let enrollmentData = response.data;
      if (response.data.data) {
        enrollmentData = response.data.data;
      }

      // Convertir les dates
      const enrollment = {
        ...enrollmentData,
        enrollmentDate: enrollmentData.enrollmentDate
          ? new Date(enrollmentData.enrollmentDate)
          : new Date(),
        createdAt: enrollmentData.createdAt
          ? new Date(enrollmentData.createdAt)
          : undefined,
        updatedAt: enrollmentData.updatedAt
          ? new Date(enrollmentData.updatedAt)
          : undefined,
      };

      return enrollment;
    } catch (err) {
      console.error(" Failed to fetch enrollment:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({
        error: "Erreur lors du chargement de l'inscription",
        loading: false,
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Récupère les inscriptions d'un étudiant
   */
  fetchStudentEnrollments: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/enrollments/student/${studentId}`);

      // Extraire le tableau d'inscriptions
      let enrollmentsArray = [];

      if (
        response.data.enrollments &&
        Array.isArray(response.data.enrollments)
      ) {
        enrollmentsArray = response.data.enrollments;
      } else if (Array.isArray(response.data)) {
        enrollmentsArray = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        enrollmentsArray = response.data.data;
      }

      const formattedEnrollments = enrollmentsArray.map((enrollment: any) => ({
        ...enrollment,
        enrollmentDate: enrollment.enrollmentDate
          ? new Date(enrollment.enrollmentDate)
          : new Date(),
      }));

      set({
        enrollments: formattedEnrollments,
        loading: false,
      });
    } catch (err) {
      console.error(" Failed to fetch student enrollments:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({
        error: "Erreur lors du chargement des inscriptions",
        loading: false,
      });
    }
  },

  /**
   * @desc Récupère les statistiques d'inscription
   */
  fetchEnrollmentStats: async (academicYearId?: string) => {
    set({ loading: true, error: null });
    try {
      const url = academicYearId
        ? `/enrollments/stats?academicYearId=${academicYearId}`
        : "/enrollments/stats";

      const response = await api.get(url);
      console.log("📥 Statistiques d'inscription:", response.data);

      // Gérer différents formats de réponse
      return response.data.data || response.data;
    } catch (err) {
      console.error(" Failed to fetch enrollment stats:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({
        error: "Erreur lors du chargement des statistiques",
        loading: false,
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Récupère l'historique complet des inscriptions d'un étudiant
   */
  fetchEnrollmentHistory: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/enrollments/history/${studentId}`);
      console.log("📥 Historique d'inscription:", response.data);

      // Gérer différents formats de réponse
      return response.data.data || response.data;
    } catch (err) {
      console.error(" Failed to fetch enrollment history:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({
        error: "Erreur lors du chargement de l'historique",
        loading: false,
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Ajoute une nouvelle inscription
   */
  addEnrollment: async (enrollmentData) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        studentId: enrollmentData.studentId,
        classId: enrollmentData.classId,
        academicYearId: enrollmentData.academicYearId,
        enrollmentDate:
          enrollmentData.enrollmentDate ||
          new Date().toISOString().split("T")[0],
        status: enrollmentData.status || "Active",
        assignFees: enrollmentData.assignFees || false,
        selectedFeeStructures: enrollmentData.selectedFeeStructures || [],
      };

      console.log("📤 Envoi création inscription:", payload);
      const response = await api.post("/enrollments", payload);
      console.log(" Réponse création inscription:", response.data);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      console.error(" Failed to add enrollment:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de l'ajout de l'inscription" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Met à jour une inscription existante
   */
  updateEnrollment: async (id, enrollmentData) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        classId: enrollmentData.classId,
        status: enrollmentData.status,
        enrollmentDate: enrollmentData.enrollmentDate,
      };

      console.log("📤 Envoi mise à jour inscription:", { id, payload });
      const response = await api.put(`/enrollments/${id}`, payload);
      console.log(" Réponse mise à jour inscription:", response.data);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      console.error(" Failed to update enrollment:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de la mise à jour de l'inscription" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Supprime une inscription
   */
  deleteEnrollment: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/enrollments/${id}/delete`);

      await get().fetchEnrollments(); // Recharge les données
    } catch (err) {
      set({ error: "Erreur lors de la suppression de l'inscription" });
      const errMsg = err.response?.data || err.message || "Unknown error";
      console.error(" Failed to delete enrollment:", errMsg);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Réinscrit un étudiant
   */
  reenrollStudent: async (data) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        studentId: data.studentId,
        classId: data.classId,
        academicYearId: data.academicYearId,
        enrollmentDate:
          data.enrollmentDate || new Date().toISOString().split("T")[0],
        notes: data.notes,
      };

      console.log("📤 Réinscription étudiant:", payload);
      const response = await api.post("/enrollments/reenroll", payload);
      console.log(" Réponse réinscription:", response.data);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      console.error(" Failed to reenroll student:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de la réinscription" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Désinscrit un étudiant
   */
  unenrollStudent: async (id, reason) => {
    set({ loading: true, error: null });
    try {
      console.log("🚫 Désinscription étudiant:", { id, reason });
      const response = await api.delete(`/enrollments/${id}/unenroll`, {
        data: { reason },
      });
      console.log(" Réponse désinscription:", response.data);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      console.error(" Failed to unenroll student:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de la désinscription" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Valide la réinscription d'un étudiant
   */
  validateReenrollment: async (studentId) => {
    set({ loading: true, error: null });
    try {
      console.log("🔍 Validation réinscription étudiant:", studentId);
      const response = await api.get(`/enrollments/validate/${studentId}`);
      console.log(" Réponse validation:", response.data);

      return response.data;
    } catch (err) {
      console.error(" Failed to validate reenrollment:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de la validation" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Crée des inscriptions en masse
   */
  createBulkEnrollments: async (enrollments) => {
    set({ loading: true, error: null });
    try {
      console.log("📦 Création inscriptions en masse:", enrollments.length);
      const response = await api.post("/enrollments/bulk", { enrollments });
      console.log(" Réponse inscriptions en masse:", response.data);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      console.error(" Failed to create bulk enrollments:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors des inscriptions en masse" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Récupère les structures de frais disponibles
   */
  getAvailableFeeStructures: async (): Promise<FeeStructure[]> => {
    try {
      console.log("🔍 Récupération des structures de frais disponibles...");

      const response = await api.get("/fee-structures?isActive=true");
      console.log("📥 Réponse structures de frais:", response.data);

      let feeStructures: FeeStructure[] = [];

      // EXTRACTION CORRECTE DES DONNÉES
      if (
        response.data?.data?.feeStructures &&
        Array.isArray(response.data.data.feeStructures)
      ) {
        feeStructures = response.data.data.feeStructures;
        console.log(
          "✅ Frais extraits de data.feeStructures:",
          feeStructures.length
        );
      } else if (
        response.data?.feeStructures &&
        Array.isArray(response.data.feeStructures)
      ) {
        feeStructures = response.data.feeStructures;
        console.log(
          "✅ Frais extraits de feeStructures:",
          feeStructures.length
        );
      } else if (Array.isArray(response.data)) {
        feeStructures = response.data;
        console.log("✅ Frais extraits directement:", feeStructures.length);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        feeStructures = response.data.data;
        console.log("✅ Frais extraits de data:", feeStructures.length);
      }

      console.log(`📊 ${feeStructures.length} structures de frais trouvées`);

      // Log détaillé pour déboguer
      feeStructures.forEach((fee, index) => {
        console.log(`📋 Frais ${index + 1}:`, {
          id: fee.id,
          name: fee.name,
          amount: fee.amount,
          academicYear: fee.academicYear,
          isActive: fee.isActive,
          academicYearId: fee.academicYearId,
        });
      });

      return feeStructures;
    } catch (error) {
      console.error("❌ Erreur récupération frais:", error);
      return [];
    }
  },

  /**
   * @desc Filtre les inscriptions par étudiant
   */
  getEnrollmentsByStudent: (studentId) => {
    const { enrollments } = get();

    if (!Array.isArray(enrollments)) {
      return [];
    }

    const result = enrollments.filter((e) => e.student.id === studentId);

    return result;
  },

  /**
   * @desc Filtre les inscriptions par classe
   */
  getEnrollmentsByClass: (classId) => {
    const { enrollments } = get();
    console.log(`🔍 Recherche inscriptions pour classId: ${classId}`);

    if (!Array.isArray(enrollments)) {
      console.warn(" enrollments n'est pas un tableau:", enrollments);
      return [];
    }

    return enrollments.filter((e) => e.classId === classId);
  },

  /**
   * @desc Filtre les inscriptions par année académique
   */
  getEnrollmentsByAcademicYear: (academicYearId) => {
    const { enrollments } = get();
    console.log(
      `🔍 Recherche inscriptions pour academicYearId: ${academicYearId}`
    );

    if (!Array.isArray(enrollments)) {
      console.warn(" enrollments n'est pas un tableau:", enrollments);
      return [];
    }

    return enrollments.filter((e) => e.academicYearId === academicYearId);
  },

  /**
   * @desc Filtre les inscriptions par statut
   */
  getEnrollmentsByStatus: (status) => {
    const { enrollments } = get();
    console.log(`🔍 Recherche inscriptions avec statut: ${status}`);

    if (!Array.isArray(enrollments)) {
      console.warn(" enrollments n'est pas un tableau:", enrollments);
      return [];
    }

    return enrollments.filter((e) => e.status === status);
  },

  /**
   * @desc Assigner des frais à une inscription
   */
  assignFeesToEnrollment: async (
    enrollmentId: string,
    feeStructureId: string[],
    academicYearId?: string[]
  ) => {
    set({ loading: true, error: null });
    try {
      console.log("💰 Assignation frais à l'inscription:", {
        enrollmentId,
        feeStructureId,
        academicYearId,
      });

      const response = await api.post(
        `/enrollments/${enrollmentId}/assign-fees`,
        {
          feeStructureId,
          academicYearId,
        }
      );

      console.log(" Réponse assignation frais:", response.data);

      return response.data;
    } catch (err) {
      console.error(" Failed to assign fees to enrollment:", err);
      console.error(" Réponse d'erreur:", err.response?.data);
      set({ error: "Erreur lors de l'assignation des frais" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
