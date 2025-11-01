import { create } from "zustand";
import api from "../services/api";
import { FeeStructure, StudentFee } from "../types/academic";

interface FeeStructureStore {
  // State
  feeStructures: FeeStructure[];
  studentFees: StudentFee[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;

  // Actions pour les structures de frais
  createFeeStructure: (
    feeData: Omit<FeeStructure, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  getFeeStructures: (academicYear?: string) => Promise<FeeStructure[]>;
  getFeeStructure: (id: string) => Promise<FeeStructure | null>;
  updateFeeStructure: (
    id: string,
    feeData: Partial<FeeStructure>
  ) => Promise<void>;
  deleteFeeStructure: (id: string) => Promise<void>;

  // Actions pour les frais étudiants
  assignFeeToStudent: (
    studentId: string,
    academicYear: string,
    feeStructureId: string
  ) => Promise<void>;
  getStudentFees: (studentId: string) => Promise<StudentFee[]>;
  getStudentFeeByYear: (
    studentId: string,
    academicYear: string
  ) => Promise<StudentFee | null>;
  updateStudentFee: (id: string, feeData: Partial<StudentFee>) => Promise<void>;
  recordPayment: (studentFeeId: string, paymentData: any) => Promise<void>;
  getPaymentHistory: (studentFeeId: string) => Promise<any[]>;
  deleteStudentFeePayment: (id: string) => Promise<void>;
  updateFeePayment: (id: string, paymentData: any) => Promise<void>;
  deleteFeePayment: (id: string) => Promise<void>;
  getFeeStructuresByAcademicYear: (
    academicYear: string
  ) => Promise<FeeStructure[]>;
  getAllStudentFees: () => Promise<void>;
  searchFeeStructures: (
    searchTerm: string,
    academicYear?: string
  ) => Promise<FeeStructure[]>;
  toggleFeeStructureStatus: (id: string) => Promise<void>;
  getFeeStructuresByAcademicYearId: (
    academicYearId: string
  ) => Promise<FeeStructure[]>;
}

export const useFeeStructureStore = create<FeeStructureStore>((set, get) => ({
  feeStructures: [],
  studentFees: [],
  loading: false,
  error: null,
  lastUpdated: Date.now(),

  // Créer une structure de frais
  createFeeStructure: async (feeData) => {
    set({ loading: true, error: null });
    try {
      console.log("📤 Création structure frais:", feeData);

      const response = await api.post("/fee-structures", feeData);

      if (response.data) {
        set((state) => ({
          feeStructures: [
            ...state.feeStructures,
            response.data.feeStructure || response.data,
          ],
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error(response.data?.error || "Erreur lors de la création");
      }
    } catch (err: any) {
      console.error("❌ Erreur createFeeStructure:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la création de la structure de frais";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Récupérer les structures de frais
  getFeeStructures: async (academicYear?: string) => {
    set({ loading: true, error: null });
    try {
      let url = "/fee-structures";
      const params = new URLSearchParams();

      if (academicYear) params.append("academicYear", academicYear);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      console.log("✅ Réponse API fee structures:", response.data);

      if (response.data) {
        set({
          feeStructures: Array.isArray(response.data)
            ? response.data
            : response.data.feeStructures || response.data.years || [],
          loading: false,
          lastUpdated: Date.now(),
        });
        return Array.isArray(response.data)
          ? response.data
          : response.data.feeStructures || response.data.years || [];
      } else {
        throw new Error("Aucune donnée reçue du serveur");
      }
    } catch (err: any) {
      console.error("❌ Erreur getFeeStructures:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la récupération des structures de frais";
      set({
        error: errorMessage,
        loading: false,
      });
      return [];
    }
  },

  // Récupérer une structure de frais spécifique
  getFeeStructure: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/fee-structures/${id}`);

      if (response.data) {
        set({ loading: false });
        return response.data;
      } else {
        throw new Error("Structure de frais non trouvée");
      }
    } catch (err: any) {
      console.error("❌ Erreur getFeeStructure:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la récupération de la structure de frais";
      set({
        error: errorMessage,
        loading: false,
      });
      return null;
    }
  },

  // Mettre à jour une structure de frais
  updateFeeStructure: async (id: string, feeData: Partial<FeeStructure>) => {
    set({ loading: true, error: null });
    try {
      console.log("📝 Mise à jour structure frais:", { id, feeData });

      const response = await api.put(`/fee-structures/${id}`, feeData);

      if (response.data) {
        set((state) => ({
          feeStructures: state.feeStructures.map((fee) =>
            fee.id === id ? response.data.feeStructure || response.data : fee
          ),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (err: any) {
      console.error("❌ Erreur updateFeeStructure:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la mise à jour de la structure de frais";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Supprimer une structure de frais
  deleteFeeStructure: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/fee-structures/${id}`);

      if (response.data) {
        set((state) => ({
          feeStructures: state.feeStructures.filter((fee) => fee.id !== id),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err: any) {
      console.error("❌ Erreur deleteFeeStructure:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression de la structure de frais";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Supprimer un paiement étudiant
  deleteStudentFeePayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/student-fees/${id}`);

      if (response.data) {
        set((state) => ({
          studentFees: state.studentFees.filter((fee) => fee.id !== id),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err: any) {
      console.error("❌ Erreur deleteStudentFeePayment:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression des frais étudiants";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Assigner des frais à un étudiant
  assignFeeToStudent: async (
    studentId: string,
    academicYear: string,
    feeStructureId: string
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/student-fees/assign", {
        studentId,
        academicYear,
        feeStructureId,
      });

      if (response.data) {
        set((state) => ({
          studentFees: [...state.studentFees, response.data],
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de l'assignation");
      }
    } catch (err: any) {
      console.error("❌ Erreur assignFeeToStudent:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'assignation des frais";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Récupérer tous les frais étudiants
  getAllStudentFees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/student-fees`);

      if (response.data) {
        set({
          studentFees: Array.isArray(response.data)
            ? response.data
            : response.data.studentFees || [],
          loading: false,
        });
        return Array.isArray(response.data)
          ? response.data
          : response.data.studentFees || [];
      } else {
        throw new Error("Erreur lors de la récupération");
      }
    } catch (err: any) {
      console.error("❌ Erreur getAllStudentFees:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la récupération des frais étudiants";
      set({
        error: errorMessage,
        loading: false,
      });
      return [];
    }
  },

  // Récupérer les frais d'un étudiant
  getStudentFees: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/student-fees?studentId=${studentId}`);

      if (response.data) {
        set({
          studentFees: Array.isArray(response.data)
            ? response.data
            : response.data.studentFees || [],
          loading: false,
        });
        return Array.isArray(response.data)
          ? response.data
          : response.data.studentFees || [];
      } else {
        throw new Error("Erreur lors de la récupération");
      }
    } catch (err: any) {
      console.error("❌ Erreur getStudentFees:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la récupération des frais étudiants";
      set({
        error: errorMessage,
        loading: false,
      });
      return [];
    }
  },

  // Récupérer les frais d'un étudiant pour une année spécifique
  getStudentFeeByYear: async (studentId: string, academicYear: string) => {
    try {
      const response = await api.get(
        `/student-fees?studentId=${studentId}&academicYear=${academicYear}`
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (err: any) {
      console.error("❌ Erreur getStudentFeeByYear:", err);
      return null;
    }
  },

  // Mettre à jour les frais d'un étudiant
  updateStudentFee: async (id: string, feeData: Partial<StudentFee>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/student-fees/${id}`, feeData);

      if (response.data) {
        set((state) => ({
          studentFees: state.studentFees.map((fee) =>
            fee.id === id ? response.data.data || response.data : fee
          ),
          loading: false,
        }));
        return response.data.data || response.data;
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (err: any) {
      console.error("❌ Erreur updateStudentFee:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la mise à jour des frais étudiants";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
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

      if (response.data) {
        set({ loading: false });
        return Array.isArray(response.data)
          ? response.data
          : response.data.feeStructures || [];
      } else {
        throw new Error("Erreur lors de la recherche");
      }
    } catch (err: any) {
      console.error("❌ Erreur searchFeeStructures:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la recherche des structures de frais";
      set({ error: errorMessage, loading: false });
      return [];
    }
  },

  // Obtenir les structures de frais par année académique
  getFeeStructuresByAcademicYear: async (academicYear: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/fee-structures/academic-years/${academicYear}`
      );

      if (response.data) {
        set({ loading: false });
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        throw new Error("Aucune structure trouvée pour cette année");
      }
    } catch (err: any) {
      console.error("❌ Erreur getFeeStructuresByAcademicYear:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la récupération des structures par année";
      set({ error: errorMessage, loading: false });
      return [];
    }
  },

  // Activer/Désactiver une structure de frais
  toggleFeeStructureStatus: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/fee-structures/${id}/toggle-status`);

      if (response.data) {
        set((state) => ({
          feeStructures: state.feeStructures.map((fee) =>
            fee.id === id ? response.data.feeStructure || response.data : fee
          ),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors du changement de statut");
      }
    } catch (err: any) {
      console.error("❌ Erreur toggleFeeStructureStatus:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors du changement de statut";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  getFeeStructuresByAcademicYearId: async (academicYearId: string) => {
    set({ loading: true, error: null });
    try {
      // Option 1: Utiliser directement l'ID de l'année académique comme filtre
      // Si vos structures de frais ont un champ academicYearId
      const response = await api.get(
        `/fee-structures?academicYearId=${academicYearId}`
      );

      // Option 2: Si vous voulez toujours récupérer d'abord l'année académique
      // const academicYearResponse = await api.get(`/academic-years/${academicYearId}`);
      // const academicYearName = academicYearResponse.data?.year;
      // const response = await api.get(`/fee-structures/academic-year/${academicYearName}`);

      if (response.data) {
        set({ loading: false });

        // Gérer différents formats de réponse
        const feeStructures = Array.isArray(response.data)
          ? response.data
          : response.data.feeStructures || response.data.years || [];

        return feeStructures.filter((fee: FeeStructure) => fee.isActive);
      } else {
        throw new Error("Aucune structure trouvée pour cette année académique");
      }
    } catch (err: any) {
      console.error("❌ Erreur getFeeStructuresByAcademicYearId:", err);

      // Si l'API des années académiques n'existe pas, utiliser une approche alternative
      if (err.response?.status === 404) {
        console.warn(
          "⚠️ API academic-years non disponible, utilisation de l'approche alternative"
        );

        try {
          // Récupérer toutes les structures et filtrer côté client
          const allStructures = await api.get("/fee-structures");
          const filteredStructures = Array.isArray(allStructures.data)
            ? allStructures.data.filter(
                (fee: FeeStructure) =>
                  fee.academicYear === academicYearId && fee.isActive
              )
            : [];

          set({ loading: false });
          return filteredStructures;
        } catch (fallbackError) {
          const errorMessage =
            "Erreur lors de la récupération des structures de frais";
          set({ error: errorMessage, loading: false });
          return [];
        }
      } else {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Erreur lors de la récupération des structures par année académique";
        set({ error: errorMessage, loading: false });
        return [];
      }
    }
  },
  // Enregistrer un paiement
  recordPayment: async (studentFeeId: string, paymentData: any) => {
    set({ loading: true, error: null });
    try {
      console.log("💰 Enregistrement paiement:", paymentData);

      const payload = {
        studentFeeId,
        paymentDate: new Date().toISOString(),
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        description: paymentData.description,
      };

      console.log("📦 Payload envoyé:", payload);

      const response = await api.post("/fee-payments", payload);

      if (response.data) {
        set((state) => ({
          studentFees: state.studentFees.map((fee) =>
            fee.id === studentFeeId ? response.data.studentFee || fee : fee
          ),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de l'enregistrement");
      }
    } catch (err: any) {
      console.error(
        "❌ Erreur recordPayment:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'enregistrement du paiement";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Obtenir l'historique des paiements
  getPaymentHistory: async (studentFeeId: string) => {
    try {
      const response = await api.get(`/fee-payments/${studentFeeId}/history`);

      if (response.data) {
        return Array.isArray(response.data)
          ? response.data
          : response.data.payments || [];
      }
      return [];
    } catch (err: any) {
      console.error(
        "❌ Erreur getPaymentHistory:",
        err.response?.data || err.message
      );
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

      if (response.data) {
        set((state) => ({
          studentFees: state.studentFees.map((fee) => {
            if (fee.payments) {
              return {
                ...fee,
                payments: fee.payments.map((payment) =>
                  payment.id === id ? response.data : payment
                ),
              };
            }
            return fee;
          }),
          loading: false,
        }));
        return response.data;
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (err: any) {
      console.error(
        "❌ Erreur updateFeePayment:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la mise à jour du paiement";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Supprimer un paiement
  deleteFeePayment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/fee-payments/${id}`);

      if (response.data) {
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
        return response.data;
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err: any) {
      console.error(
        "❌ Erreur deleteFeePayment:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression du paiement";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },
}));
