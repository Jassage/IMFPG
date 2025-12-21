import { create } from "zustand";
import api from "../services/api";
import { FeeStructure, StudentFee } from "../types/academic";
import { AxiosResponse } from "axios";

interface FeeStructureStore {
  extractDataFromResponse(response: AxiosResponse<any, any>): any;
  handleError(err: any, arg1: string): any;
  // State
  feeStructures: FeeStructure[];
  studentFees: StudentFee[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;

  // Actions pour les structures de frais
  createFeeStructure: (
    feeData: Omit<FeeStructure, "id" | "createdAt" | "updatedAt">
  ) => Promise<any>;
  getFeeStructures: (filters?: {
    academicYear?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }) => Promise<FeeStructure[]>;
  getFeeStructure: (id: string) => Promise<FeeStructure | null>;
  updateFeeStructure: (
    id: string,
    feeData: Partial<FeeStructure>
  ) => Promise<any>;
  deleteFeeStructure: (id: string) => Promise<any>;

  assignFeeToStudent: (
    studentId: string,
    academicYear: string,
    feeStructureId: string,
    studentCode: string
  ) => Promise<any>;
  getStudentFees: (studentId: string) => Promise<StudentFee[]>;
  getStudentFeeByYear: (
    studentId: string,
    academicYear: string
  ) => Promise<StudentFee | null>;
  updateStudentFee: (id: string, feeData: Partial<StudentFee>) => Promise<any>;
  recordPayment: (studentFeeId: string, paymentData: any) => Promise<any>;
  getPaymentHistory: (studentFeeId: string) => Promise<any[]>;
  deleteStudentFeePayment: (id: string) => Promise<any>;
  updateFeePayment: (id: string, paymentData: any) => Promise<any>;
  deleteFeePayment: (id: string) => Promise<any>;
  getFeeStructuresByAcademicYear: (
    academicYear: string
  ) => Promise<FeeStructure[]>;
  getAllStudentFees: () => Promise<StudentFee[]>;
  searchFeeStructures: (
    searchTerm: string,
    academicYear?: string
  ) => Promise<FeeStructure[]>;
  toggleFeeStructureStatus: (id: string) => Promise<any>;
  getFeeStructuresByAcademicYearId: (
    academicYearId: string
  ) => Promise<FeeStructure[]>;
  clearStudentFees: () => void;
  clearError: () => void;
}

export const useFeeStructureStore = create<FeeStructureStore>((set, get) => ({
  feeStructures: [],
  studentFees: [],
  loading: false,
  error: null,
  lastUpdated: Date.now(),
  pagination: null,

  // Fonction utilitaire pour extraire les données du format de réponse du service
  extractDataFromResponse: (response: any): any => {
    // Nouveau format du service : { success, message, data }
    if (response.data?.success !== undefined) {
      return response.data.data || response.data;
    }
    // Format ancien ou direct
    return response.data;
  },

  // Fonction utilitaire pour gérer les erreurs
  handleError: (err: any, defaultMessage: string) => {
    console.error("Erreur store:", err);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      defaultMessage;
    set({ error: errorMessage, loading: false });
    throw new Error(errorMessage);
  },

  // Créer une structure de frais
  createFeeStructure: async (feeData) => {
    set({ loading: true, error: null });
    try {
      console.log("📤 Création structure frais:", feeData);
      const response = await api.post("/fee-structures", feeData);

      const result = get().extractDataFromResponse(response);

      if (result) {
        const newFeeStructure = (result as any).feeStructure || result;
        set((state) => ({
          feeStructures: [...state.feeStructures, newFeeStructure],
          loading: false,
          lastUpdated: Date.now(),
        }));
        return newFeeStructure;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la création de la structure de frais"
      );
    }
  },

  // Récupérer les structures de frais avec filtres
  getFeeStructures: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      let url = "/fee-structures";
      const params = new URLSearchParams();

      // Ajouter les filtres aux paramètres
      if (filters.academicYear)
        params.append("academicYear", filters.academicYear);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.isActive !== undefined)
        params.append("isActive", filters.isActive.toString());
      if (filters.search) params.append("search", filters.search);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      console.log("✅ Réponse API fee structures:", response.data);

      const result = get().extractDataFromResponse(response);

      if (result) {
        // Extraire les données selon le format
        let feeStructuresData: FeeStructure[] = [];
        let paginationData = null;

        // Format nouveau service
        if (result.feeStructures) {
          feeStructuresData = result.feeStructures;
          paginationData = result.pagination;
        }
        // Format ancien contrôleur
        else if (Array.isArray(result)) {
          feeStructuresData = result;
        }
        // Format direct
        else if (result.data?.feeStructures) {
          feeStructuresData = result.data.feeStructures;
          paginationData = result.data.pagination;
        }
        // Format de recherche
        else if (result.data?.feeStructures) {
          feeStructuresData = result.data.feeStructures;
        }

        set({
          feeStructures: feeStructuresData,
          pagination: paginationData,
          loading: false,
          lastUpdated: Date.now(),
        });

        return feeStructuresData;
      }

      set({ loading: false });
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération des structures de frais"
      );
    }
  },

  // Récupérer une structure de frais spécifique
  getFeeStructure: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/fee-structures/${id}`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const feeStructure = result.feeStructure || result;
        set({ loading: false });
        return feeStructure;
      }
      return null;
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération de la structure de frais"
      );
    }
  },

  // Mettre à jour une structure de frais
  updateFeeStructure: async (id: string, feeData: Partial<FeeStructure>) => {
    set({ loading: true, error: null });
    try {
      console.log("📝 Mise à jour structure frais:", { id, feeData });
      const response = await api.put(`/fee-structures/${id}`, feeData);

      const result = get().extractDataFromResponse(response);

      if (result) {
        const updatedFee = result.feeStructure || result;
        set((state) => ({
          feeStructures: state.feeStructures.map((fee) =>
            fee.id === id ? updatedFee : fee
          ),
          loading: false,
          lastUpdated: Date.now(),
        }));
        return updatedFee;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la mise à jour de la structure de frais"
      );
    }
  },

  // Supprimer une structure de frais
  deleteFeeStructure: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/fee-structures/${id}`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        set((state) => ({
          feeStructures: state.feeStructures.filter((fee) => fee.id !== id),
          loading: false,
          lastUpdated: Date.now(),
        }));
        return result;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la suppression de la structure de frais"
      );
    }
  },

  // Supprimer un paiement étudiant
  deleteStudentFeePayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/student-fees/${id}`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        set((state) => ({
          studentFees: state.studentFees.filter((fee) => fee.id !== id),
          loading: false,
        }));
        return result;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la suppression des frais étudiants"
      );
    }
  },

  // Assigner des frais à un étudiant
  assignFeeToStudent: async (
    studentId: string,
    academicYearId: string,
    feeStructureId: string,
    studentCode: string
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/student-fees/assign", {
        studentId,
        academicYearId,
        feeStructureId,
        studentCode,
      });

      const result = get().extractDataFromResponse(response);

      if (result) {
        const newStudentFee = result.studentFee || result;
        set((state) => ({
          studentFees: [...state.studentFees, newStudentFee],
          loading: false,
        }));
        return newStudentFee;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(err, "Erreur lors de l'assignation des frais");
    }
  },

  // Récupérer tous les frais étudiants
  getAllStudentFees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/student-fees`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const allFees = Array.isArray(result)
          ? result
          : result.studentFees || result.data?.studentFees || [];

        set({
          studentFees: allFees,
          loading: false,
        });
        return allFees;
      }
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération des frais étudiants"
      );
    }
  },

  // Récupérer les frais d'un étudiant
  getStudentFees: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/student-fees?studentId=${studentId}`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const fees = Array.isArray(result)
          ? result
          : result.studentFees || result.data?.studentFees || [];

        // Mettre à jour le store
        const existingStudentFees = get().studentFees.filter(
          (f) => f.studentId !== studentId
        );
        set({
          studentFees: [...existingStudentFees, ...fees],
          loading: false,
        });
        return fees;
      }
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération des frais étudiants"
      );
    }
  },

  // Récupérer les frais d'un étudiant pour une année spécifique
  getStudentFeeByYear: async (studentId: string, academicYear: string) => {
    try {
      const response = await api.get(
        `/student-fees?studentId=${studentId}&academicYear=${academicYear}`
      );
      const result = get().extractDataFromResponse(response);

      if (result && result.length > 0) {
        return result[0];
      }
      return null;
    } catch (err: any) {
      console.error("Erreur getStudentFeeByYear:", err);
      return null;
    }
  },

  // Mettre à jour les frais d'un étudiant
  updateStudentFee: async (id: string, feeData: Partial<StudentFee>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/student-fees/${id}`, feeData);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const updatedFee = result.data || result;
        set((state) => ({
          studentFees: state.studentFees.map((fee) =>
            fee.id === id ? updatedFee : fee
          ),
          loading: false,
        }));
        return updatedFee;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la mise à jour des frais étudiants"
      );
    }
  },

  // Rechercher les structures de frais
  searchFeeStructures: async (searchTerm: string, academicYear?: string) => {
    set({ loading: true, error: null });
    try {
      let url = "/fee-structures/search";
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (academicYear) params.append("academicYear", academicYear);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const feeStructures = Array.isArray(result)
          ? result
          : result.feeStructures || result.data?.feeStructures || [];

        set({ loading: false });
        return feeStructures;
      }
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la recherche des structures de frais"
      );
    }
  },

  // Obtenir les structures de frais par année académique
  getFeeStructuresByAcademicYear: async (academicYear: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/fee-structures/academic-years/${academicYear}`
      );
      const result = get().extractDataFromResponse(response);

      if (result) {
        const feeStructures = Array.isArray(result)
          ? result
          : result.feeStructures || [result];

        set({ loading: false });
        return feeStructures;
      }
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération des structures par année"
      );
    }
  },

  // Activer/Désactiver une structure de frais
  toggleFeeStructureStatus: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/fee-structures/${id}/toggle-status`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const updatedFee = result.feeStructure || result;
        set((state) => ({
          feeStructures: state.feeStructures.map((fee) =>
            fee.id === id ? updatedFee : fee
          ),
          loading: false,
          lastUpdated: Date.now(),
        }));
        return updatedFee;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(err, "Erreur lors du changement de statut");
    }
  },

  // Récupérer les structures de frais par ID d'année académique
  getFeeStructuresByAcademicYearId: async (academicYearId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/fee-structures?academicYearId=${academicYearId}`
      );
      const result = get().extractDataFromResponse(response);

      if (result) {
        let feeStructures: FeeStructure[] = [];

        // Gérer différents formats de réponse
        if (Array.isArray(result)) {
          feeStructures = result.filter((fee: FeeStructure) => fee.isActive);
        } else if (result.feeStructures) {
          feeStructures = result.feeStructures.filter(
            (fee: FeeStructure) => fee.isActive
          );
        } else if (result.data?.feeStructures) {
          feeStructures = result.data.feeStructures.filter(
            (fee: FeeStructure) => fee.isActive
          );
        }

        set({ loading: false });
        return feeStructures;
      }
      return [];
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la récupération des structures par année académique"
      );
    }
  },

  // Enregistrer un paiement
  recordPayment: async (studentFeeId: string, paymentData: any) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        studentFeeId,
        paymentDate: new Date().toISOString(),
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        description: paymentData.description,
      };

      const response = await api.post("/fee-payments", payload);
      const result = get().extractDataFromResponse(response);

      if (result) {
        const updatedFee = result.studentFee || result;

        set((state) => ({
          studentFees: state.studentFees.map((fee) =>
            fee.id === studentFeeId ? updatedFee : fee
          ),
          loading: false,
        }));

        return result;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de l'enregistrement du paiement"
      );
    }
  },

  // Obtenir l'historique des paiements
  getPaymentHistory: async (studentFeeId: string) => {
    try {
      const response = await api.get(`/fee-payments/${studentFeeId}/history`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        return Array.isArray(result)
          ? result
          : result.payments || result.data?.payments || [];
      }
      return [];
    } catch (err: any) {
      console.error("Erreur getPaymentHistory:", err);
      throw new Error(
        err.response?.data?.error ||
          err.message ||
          "Erreur lors de la récupération de l'historique"
      );
    }
  },

  // Mettre à jour un paiement
  updateFeePayment: async (id: string, paymentData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/fee-payments/${id}`, paymentData);
      const result = get().extractDataFromResponse(response);

      if (result) {
        set((state) => ({
          studentFees: state.studentFees.map((fee) => {
            if (fee.payments) {
              return {
                ...fee,
                payments: fee.payments.map((payment) =>
                  payment.id === id ? result : payment
                ),
              };
            }
            return fee;
          }),
          loading: false,
        }));
        return result;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la mise à jour du paiement"
      );
    }
  },

  // Supprimer un paiement
  deleteFeePayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/fee-payments/${id}`);
      const result = get().extractDataFromResponse(response);

      if (result) {
        set((state) => ({
          studentFees: state.studentFees.map((fee) => {
            if (fee.payments) {
              const deletedPayment = fee.payments.find((p) => p.id === id);
              return {
                ...fee,
                payments: fee.payments.filter((payment) => payment.id !== id),
                paidAmount: deletedPayment
                  ? fee.paidAmount - deletedPayment.amount
                  : fee.paidAmount,
              };
            }
            return fee;
          }),
          loading: false,
        }));
        return result;
      }
      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la suppression du paiement"
      );
    }
  },

  // Nettoyer les frais étudiants
  clearStudentFees: () => {
    set({ studentFees: [] });
  },

  // Nettoyer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
