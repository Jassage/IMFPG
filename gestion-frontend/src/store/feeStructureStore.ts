import { create } from "zustand";
import api from "../services/api";
import { FeeReport, FeeStructure, StudentFee } from "../types/academic";
import { AxiosResponse } from "axios";

interface FeeStructureStore {
  extractDataFromResponse(response: AxiosResponse<any, any>): any;
  handleError(err: any, arg1: string): any;

  feeStructures: FeeStructure[];
  studentFees: Record<string, StudentFee[]>;
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
  getStudentFeesByStudentId: (studentId: string) => Promise<StudentFee[]>;
  updateExistingFee: (
    studentFeeId: string,
    data: Partial<StudentFee>
  ) => Promise<StudentFee>;
  checkExistingFees: (
    studentId: string,
    academicYearId: string,
    feeStructureId?: string
  ) => Promise<{
    exists: boolean;
    fees: StudentFee[];
    specificFee?: StudentFee | null;
  }>;

  getFeeReportByClass: (filters: {
    academicYearId: string;
    classId?: string;
    classLevel?: string;
  }) => Promise<FeeReport>;

  // Supprimer les doublons
  removeDuplicatesFromFees: (fees: StudentFee[]) => StudentFee[];
}

export const useFeeStructureStore = create<FeeStructureStore>((set, get) => ({
  feeStructures: [],
  studentFees: {}, // CHANGÉ: [] -> {}
  loading: false,
  error: null,
  lastUpdated: Date.now(),
  pagination: null,

  // Fonction utilitaire pour supprimer les doublons
  removeDuplicatesFromFees: (fees: StudentFee[]): StudentFee[] => {
    const seen = new Set<string>();
    const uniqueFees: StudentFee[] = [];

    for (const fee of fees) {
      if (!seen.has(fee.id)) {
        seen.add(fee.id);
        uniqueFees.push(fee);
      } else {
        console.warn(` Frais en double détecté: ${fee.id}`);
      }
    }

    console.log(
      `${uniqueFees.length} frais uniques après nettoyage (sur ${fees.length} total)`
    );
    return uniqueFees;
  },

  // Fonction utilitaire pour extraire les données du format de réponse du service
  extractDataFromResponse: (response: any): any => {
    if (response.data?.success !== undefined) {
      return response.data.data || response.data;
    }
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
      console.log(" Création structure frais:", feeData);
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

      if (filters.academicYear)
        params.append("academicYear", filters.academicYear);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.isActive !== undefined)
        params.append("isActive", filters.isActive.toString());
      if (filters.search) params.append("search", filters.search);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      console.log("Réponse API fee structures:", response.data);

      const result = get().extractDataFromResponse(response);

      if (result) {
        let feeStructuresData: FeeStructure[] = [];
        let paginationData = null;

        if (result.feeStructures) {
          feeStructuresData = result.feeStructures;
          paginationData = result.pagination;
        } else if (Array.isArray(result)) {
          feeStructuresData = result;
        } else if (result.data?.feeStructures) {
          feeStructuresData = result.data.feeStructures;
          paginationData = result.data.pagination;
        } else if (result.data?.feeStructures) {
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
      console.log(" Mise à jour structure frais:", { id, feeData });
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
        const updatedStudentFees: Record<string, StudentFee[]> = {};

        Object.entries(get().studentFees).forEach(([studentId, fees]) => {
          updatedStudentFees[studentId] = fees.filter((fee) => fee.id !== id);
        });

        set({
          studentFees: updatedStudentFees,
          loading: false,
        });
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

  // Assigner une structure de frais à un étudiant
  checkExistingFees: async (
    studentId: string,
    academicYearId: string,
    feeStructureId?: string
  ) => {
    try {
      console.log("🔍 Vérification frais existants:", {
        studentId,
        academicYearId,
        feeStructureId,
      });

      // Récupérer tous les frais de l'étudiant
      const response = await api.get(`/student-fees/student/${studentId}`);
      const data = response.data;

      let fees: StudentFee[] = [];

      if (Array.isArray(data)) {
        fees = data;
      } else if (data?.data && Array.isArray(data.data)) {
        fees = data.data;
      } else if (data?.studentFees && Array.isArray(data.studentFees)) {
        fees = data.studentFees;
      }

      // Filtrer par année académique
      const feesForYear = fees.filter(
        (fee) => fee.academicYearId === academicYearId
      );

      // Filtrer par structure de frais si spécifiée
      const existingFee = feeStructureId
        ? feesForYear.find((fee) => fee.feeStructureId === feeStructureId)
        : null;

      return {
        exists: !!existingFee || feesForYear.length > 0,
        fees: feesForYear,
        specificFee: existingFee,
      };
    } catch (error) {
      console.error(" Erreur vérification frais existants:", error);
      return { exists: false, fees: [] };
    }
  },

  // Version améliorée de assignFeeToStudent
  assignFeeToStudent: async (
    studentId: string,
    academicYearId: string,
    feeStructureId: string,
    studentCode: string,
    options?: { force?: boolean; updateIfExists?: boolean }
  ) => {
    const { force = false, updateIfExists = false } = options || {};

    set({ loading: true, error: null });

    try {
      console.log(" Assignation frais (version améliorée):", {
        studentId,
        academicYearId,
        feeStructureId,
        studentCode,
        options,
      });

      if (!force) {
        const { exists, fees, specificFee } = await get().checkExistingFees(
          studentId,
          academicYearId,
          feeStructureId
        );

        if (exists) {
          if (specificFee) {
            if (updateIfExists) {
              console.log(
                "🔄 Frais existant trouvé, mise à jour:",
                specificFee.id
              );
              const updatedFee = await get().updateExistingFee(specificFee.id, {
                totalAmount: specificFee.totalAmount,
              });
              return updatedFee;
            } else {
              throw {
                type: "FEE_ALREADY_EXISTS",
                message: "Des frais existent déjà pour cette combinaison",
                existingFee: specificFee,
                allFees: fees,
              };
            }
          } else {
            console.log(
              " L'étudiant a déjà des frais pour cette année:",
              fees.length
            );
          }
        }
      }

      const response = await api.post("/student-fees/assign", {
        studentId,
        academicYearId,
        feeStructureId,
        studentCode,
      });

      console.log("Réponse API assign:", response.data);

      const result = response.data?.data || response.data;

      if (result) {
        const newStudentFee = result.studentFee || result;

        // CORRECTION: Mise à jour pour le nouveau format
        set((state) => {
          const currentFees = state.studentFees[studentId] || [];
          const updatedFees = [...currentFees, newStudentFee];

          return {
            studentFees: {
              ...state.studentFees,
              [studentId]: updatedFees,
            },
            loading: false,
            lastUpdated: Date.now(),
          };
        });

        return newStudentFee;
      }

      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      console.error(" Erreur assignFeeToStudent:", err);

      if (err.type === "FEE_ALREADY_EXISTS") {
        set({
          error: err.message,
          loading: false,
        });
        throw err;
      }

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de l'assignation des frais";

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Mettre à jour un frais existant
  updateExistingFee: async (
    studentFeeId: string,
    data: Partial<StudentFee>
  ) => {
    set({ loading: true, error: null });

    try {
      console.log(" Mise à jour frais existant:", studentFeeId, data);

      const response = await api.put(`/student-fees/${studentFeeId}`, data);

      const result = response.data?.data || response.data;

      if (result) {
        const updatedFee = result.studentFee || result;

        set((state) => {
          const updatedStudentFees: Record<string, StudentFee[]> = {};

          Object.entries(state.studentFees).forEach(([studentId, fees]) => {
            updatedStudentFees[studentId] = fees.map((fee) =>
              fee.id === studentFeeId ? updatedFee : fee
            );
          });

          return {
            studentFees: updatedStudentFees,
            loading: false,
            lastUpdated: Date.now(),
          };
        });

        return updatedFee;
      }

      throw new Error("Aucune donnée reçue du serveur");
    } catch (err: any) {
      console.error(" Erreur updateExistingFee:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la mise à jour des frais";

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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

        // Organiser par étudiant
        const feesByStudent: Record<string, StudentFee[]> = {};

        allFees.forEach((fee: StudentFee) => {
          if (!feesByStudent[fee.studentId]) {
            feesByStudent[fee.studentId] = [];
          }
          feesByStudent[fee.studentId].push(fee);
        });

        set({
          studentFees: feesByStudent,
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

  // État des paiements (rapport) pour une classe/niveau et une année académique
  getFeeReportByClass: async (filters: {
    academicYearId: string;
    classId?: string;
    classLevel?: string;
  }): Promise<FeeReport> => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("academicYearId", filters.academicYearId);
      if (filters.classId) params.append("classId", filters.classId);
      if (filters.classLevel) params.append("classLevel", filters.classLevel);

      const response = await api.get(
        `/student-fees/reports/by-class?${params.toString()}`
      );
      const result = get().extractDataFromResponse(response);

      set({ loading: false });
      return (result as FeeReport) || { students: [], summary: {
        totalStudents: 0,
        totalExpected: 0,
        totalCollected: 0,
        totalRemaining: 0,
      } };
    } catch (err: any) {
      return get().handleError(
        err,
        "Erreur lors de la génération de l'état des paiements"
      );
    }
  },

  // Récupérer les frais d'un étudiant
  getStudentFees: async (studentId: string): Promise<StudentFee[]> => {
    // Retourner du cache si disponible
    const cachedFees = get().studentFees[studentId];
    if (cachedFees && cachedFees.length > 0) {
      return cachedFees;
    }

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/student-fees/student/${studentId}`);

      let feesData = response.data;

      if (
        feesData &&
        typeof feesData === "object" &&
        feesData.data &&
        Array.isArray(feesData.data)
      ) {
        feesData = feesData.data;
      } else if (Array.isArray(feesData)) {
        console.log("📊 Format: Array[...]");
      } else if (feesData && typeof feesData === "object") {
        if (feesData.studentFees && Array.isArray(feesData.studentFees)) {
          feesData = feesData.studentFees;
        } else if (feesData.fees && Array.isArray(feesData.fees)) {
          feesData = feesData.fees;
        } else if (Array.isArray(feesData)) {
        } else {
          feesData = [feesData];
        }
      }

      const fees: StudentFee[] = Array.isArray(feesData) ? feesData : [];

      // SUPPRIMER LES DOUBLONS
      const uniqueFees = get().removeDuplicatesFromFees(fees);

      console.log("Frais extraits:", uniqueFees.length, "éléments");

      set((state) => ({
        studentFees: {
          ...state.studentFees,
          [studentId]: uniqueFees,
        },
        loading: false,
        lastUpdated: Date.now(),
      }));

      return uniqueFees;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la récupération des frais";

      set({ error: errorMessage, loading: false });

      return [];
    }
  },

  // Version alternative plus simple
  getStudentFeesByStudentId: async (
    studentId: string
  ): Promise<StudentFee[]> => {
    set({ loading: true, error: null });

    try {
      const endpoint = `/student-fees/student/${studentId}`;

      const response = await api.get(endpoint);

      console.groupEnd();

      let feesArray: any[] = [];

      if (Array.isArray(response.data)) {
        feesArray = response.data;
      } else if (response.data && typeof response.data === "object") {
        const possibleArrayKeys = [
          "data",
          "studentFees",
          "fees",
          "items",
          "results",
        ];

        for (const key of possibleArrayKeys) {
          if (response.data[key] && Array.isArray(response.data[key])) {
            feesArray = response.data[key];
            break;
          }
        }

        if (feesArray.length === 0 && response.data.id) {
          feesArray = [response.data];
        }
      }

      const studentFees: StudentFee[] = feesArray.map((fee: any) => ({
        id: fee.id,
        studentId: fee.studentId,
        feeStructureId: fee.feeStructureId,
        totalAmount: fee.totalAmount,
        paidAmount: fee.paidAmount,
        remainingAmount:
          fee.remainingAmount ??
          (fee.totalAmount !== undefined
            ? fee.totalAmount - (fee.paidAmount ?? 0)
            : undefined),
        status: fee.status,
        dueDate: fee.dueDate,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
        academicYearId: fee.academicYearId,
        feeStructure: fee.feeStructure,
        student: fee.student,
        payments: fee.payments || [],
      }));

      // SUPPRIMER LES DOUBLONS
      const uniqueFees = get().removeDuplicatesFromFees(studentFees);

      set((state) => ({
        studentFees: {
          ...state.studentFees,
          [studentId]: uniqueFees,
        },
        loading: false,
      }));

      return uniqueFees;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });

      return [];
    }
  },

  // Récupérer les frais d'un étudiant pour une année spécifique
  getStudentFeeByYear: async (studentId: string, academicYearId: string) => {
    try {
      const response = await api.get(
        `/student-fees?studentId=${studentId}&academicYear=${academicYearId}`
      );
      const result = get().extractDataFromResponse(response);

      if (result && result.length > 0) {
        return result[0];
      }
      return null;
    } catch (err: any) {
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

        // CORRECTION: Mise à jour pour le nouveau format
        set((state) => {
          const updatedStudentFees: Record<string, StudentFee[]> = {};

          Object.entries(state.studentFees).forEach(([studentId, fees]) => {
            updatedStudentFees[studentId] = fees.map((fee) =>
              fee.id === id ? updatedFee : fee
            );
          });

          return {
            studentFees: updatedStudentFees,
            loading: false,
          };
        });
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
        set((state) => {
          const updatedStudentFees: Record<string, StudentFee[]> = {};

          Object.entries(state.studentFees).forEach(([studentId, fees]) => {
            updatedStudentFees[studentId] = fees.map((fee) =>
              fee.id === studentFeeId ? updatedFee : fee
            );
          });

          return {
            studentFees: updatedStudentFees,
            loading: false,
          };
        });

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
        set((state) => {
          const updatedStudentFees: Record<string, StudentFee[]> = {};

          Object.entries(state.studentFees).forEach(([studentId, fees]) => {
            updatedStudentFees[studentId] = fees.map((fee) => {
              if (fee.payments) {
                return {
                  ...fee,
                  payments: fee.payments.map((payment) =>
                    payment.id === id ? result : payment
                  ),
                };
              }
              return fee;
            });
          });

          return {
            studentFees: updatedStudentFees,
            loading: false,
          };
        });
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
        set((state) => {
          const updatedStudentFees: Record<string, StudentFee[]> = {};

          Object.entries(state.studentFees).forEach(([studentId, fees]) => {
            updatedStudentFees[studentId] = fees.map((fee) => {
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
            });
          });

          return {
            studentFees: updatedStudentFees,
            loading: false,
          };
        });
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
    set({ studentFees: {} }); // CHANGÉ: [] -> {}
  },

  // Nettoyer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
