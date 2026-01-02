import { create } from "zustand";
import api from "../services/api";
import { Enrollment } from "../types/academic";
import { FeeStructure } from "@/types/enrollementTypes";
import { toast } from "react-toastify";

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

      // Gérer différents formats de réponse
      return response.data.data || response.data;
    } catch (err) {
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

      // Gérer différents formats de réponse
      return response.data.data || response.data;
    } catch (err) {
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

      const response = await api.post("/enrollments", payload);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
      set({ error: "Erreur lors de l'ajout de l'inscription" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /**
   * @desc Met à jour une inscription existante - VERSION CORRIGÉE
   */
  /**
   * @desc Met à jour une inscription existante - VERSION CORRIGÉE
   */
  updateEnrollment: async (id, enrollmentData) => {
    set({ loading: true, error: null });
    try {
      console.log(
        "📤 Mise à jour inscription ID:",
        id,
        "Données:",
        enrollmentData
      );

      const payload: any = {};

      // N'envoyer que les champs qui ont changé et qui sont valides
      if (enrollmentData.classId !== undefined)
        payload.classId = enrollmentData.classId;

      // Le statut ne peut être que Active, Suspended ou Completed
      if (
        enrollmentData.status !== undefined &&
        ["Active", "Suspended", "Completed"].includes(enrollmentData.status)
      ) {
        payload.status = enrollmentData.status;
      }

      // Formater la date correctement
      if (enrollmentData.enrollmentDate !== undefined) {
        payload.enrollmentDate = new Date(
          enrollmentData.enrollmentDate
        ).toISOString();
      }

      const response = await api.put(`/enrollments/${id}`, payload);

      if (
        response &&
        (response.status === 200 || response.status === 204 || response.data)
      ) {
        // Mettre à jour le store localement
        set((state) => {
          const updatedEnrollments = (state.enrollments || []).map(
            (enrollment) =>
              enrollment.id === id
                ? {
                    ...enrollment,
                    ...payload,
                    // Si la classe est changée, mettre à jour la référence minimale de la classe
                    ...(payload.classId && {
                      schoolClass:
                        enrollment.schoolClass &&
                        enrollment.schoolClass.id === payload.classId
                          ? enrollment.schoolClass
                          : { id: payload.classId },
                    }),
                    updatedAt: new Date().toISOString(),
                  }
                : enrollment
          );

          return { enrollments: updatedEnrollments, loading: false };
        });

        toast.success(
          response.data?.message || "Inscription mise à jour avec succès"
        );

        // Recharger les données après un court délai pour synchronisation
        setTimeout(async () => {
          await get().fetchEnrollments();
        }, 1000);

        return response.data;
      } else {
        throw new Error(response.data?.message || "Échec de la mise à jour");
      }
    } catch (err: any) {
      console.error("❌ Erreur:", err);

      let errorMessage = "Erreur lors de la mise à jour";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw err;
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

      const response = await api.post("/enrollments/reenroll", payload);

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
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
      const response = await api.delete(`/enrollments/${id}/unenroll`, {
        data: { reason },
      });

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
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
      const response = await api.get(`/enrollments/validate/${studentId}`);

      return response.data;
    } catch (err) {
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
      const response = await api.post("/enrollments/bulk", { enrollments });

      await get().fetchEnrollments(); // Recharge les données
      return response.data;
    } catch (err) {
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
      const response = await api.get("/fee-structures?isActive=true");

      let feeStructures: FeeStructure[] = [];

      // EXTRACTION CORRECTE DES DONNÉES
      if (
        response.data?.data?.feeStructures &&
        Array.isArray(response.data.data.feeStructures)
      ) {
        feeStructures = response.data.data.feeStructures;
      } else if (
        response.data?.feeStructures &&
        Array.isArray(response.data.feeStructures)
      ) {
        feeStructures = response.data.feeStructures;
      } else if (Array.isArray(response.data)) {
        feeStructures = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        feeStructures = response.data.data;
      }

      return feeStructures;
    } catch (error) {
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

    if (!Array.isArray(enrollments)) {
      return [];
    }

    return enrollments.filter((e) => e.classId === classId);
  },

  /**
   * @desc Filtre les inscriptions par année académique
   */
  getEnrollmentsByAcademicYear: (academicYearId) => {
    const { enrollments } = get();

    if (!Array.isArray(enrollments)) {
      return [];
    }

    return enrollments.filter((e) => e.academicYearId === academicYearId);
  },

  /**
   * @desc Filtre les inscriptions par statut
   */
  getEnrollmentsByStatus: (status) => {
    const { enrollments } = get();

    if (!Array.isArray(enrollments)) {
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
      const response = await api.post(
        `/enrollments/${enrollmentId}/assign-fees`,
        {
          feeStructureId,
          academicYearId,
        }
      );

      return response.data;
    } catch (err) {
      set({ error: "Erreur lors de l'assignation des frais" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
