// store/guardianStore.ts
import { create } from "zustand";
import { Guardian, Parent } from "@/types/academic";

import { toast } from "@/hooks/use-toast";
import api from "@/services/api";

interface GuardianStoreState {
  guardians: Guardian[];
  parents: Parent[];
  loading: boolean;
  error: string | null;
  selectedGuardian: Guardian | null;
  selectedParent: Parent | null;
}

interface GuardianStoreActions {
  // Actions pour les guardians
  fetchGuardians: () => Promise<void>;
  fetchGuardianById: (id: string) => Promise<Guardian | null>;
  addGuardian: (data: Partial<Guardian>) => Promise<Guardian | null>;
  updateGuardian: (
    id: string,
    data: Partial<Guardian>
  ) => Promise<Guardian | null>;
  deleteGuardian: (id: string) => Promise<boolean>;
  setPrimaryGuardian: (studentId: string, guardianId: string) => Promise<void>;

  // Actions pour les parents
  fetchParents: () => Promise<void>;
  fetchParentById: (id: string) => Promise<Parent | null>;
  createParentAccount: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    children: string[];
    address?: string;
    sendWelcomeEmail?: boolean;
  }) => Promise<{ success: boolean; parentId?: string; error?: string }>;

  linkGuardianToParent: (
    guardianId: string,
    parentId: string
  ) => Promise<boolean>;
  unlinkGuardianFromParent: (guardianId: string) => Promise<boolean>;
  addChildToParent: (
    parentId: string,
    studentId: string,
    relationship?: string
  ) => Promise<boolean>;
  removeChildFromParent: (
    parentId: string,
    studentId: string
  ) => Promise<boolean>;

  // Recherche et utilitaires
  searchExistingParent: (
    email?: string,
    phone?: string
  ) => Promise<{
    success: boolean;
    data?: {
      action: "existingParent" | "createFromGuardian" | "newParent";
      parent?: Parent;
      guardian?: Guardian;
      message: string;
    };
    error?: string;
  }>;

  // Gestion d'état
  setSelectedGuardian: (guardian: Guardian | null) => void;
  setSelectedParent: (parent: Parent | null) => void;
  clearError: () => void;
  clearAll: () => void;
}

type GuardianStore = GuardianStoreState & GuardianStoreActions;

export const useGuardianStore = create<GuardianStore>((set, get) => ({
  // État initial
  guardians: [],
  parents: [],
  loading: false,
  error: null,
  selectedGuardian: null,
  selectedParent: null,

  // ============================================
  // ACTIONS POUR LES GUARDIANS
  // ============================================

  fetchGuardians: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/guardians", {
        timeout: 10000,
      });

      if (response.data.success) {
        set({
          guardians: response.data.data,
          loading: false,
          error: null,
        });

        toast({
          title: "Succès",
          description: "Liste des tuteurs chargée avec succès",
        });
      } else {
        set({
          loading: false,
          error: response.data.error || "Erreur lors du chargement",
        });

        toast({
          title: "Erreur",
          description: response.data.error || "Erreur lors du chargement",
          variant: "destructive",
        });
      }
    } catch (error: any) {

      let errorMessage = "Erreur de connexion au serveur";
      if (error.code === "ECONNABORTED") {
        errorMessage = "La requête a pris trop de temps";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      set({
        loading: false,
        error: errorMessage,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  fetchGuardianById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/guardians/${id}`, {
        timeout: 8000,
      });

      if (response.data.success) {
        set({
          loading: false,
          error: null,
          selectedGuardian: response.data.data,
        });
        return response.data.data;
      } else {
        set({
          loading: false,
          error: response.data.error,
        });
        return null;
      }
    } catch (error: any) {

      set({
        loading: false,
        error: "Erreur lors du chargement des détails",
      });
      return null;
    }
  },

  addGuardian: async (data: Partial<Guardian>) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/guardians", data, {
        timeout: 15000,
      });

      if (response.data.success) {
        const newGuardian = response.data.data;

        set((state) => ({
          guardians: [newGuardian, ...state.guardians],
          loading: false,
          error: null,
          selectedGuardian: newGuardian,
        }));

        toast({
          title: "Succès",
          description: "Tuteur créé avec succès",
        });

        return newGuardian;
      } else {
        set({
          loading: false,
          error: response.data.error,
        });

        toast({
          title: "Erreur",
          description: response.data.error,
          variant: "destructive",
        });

        return null;
      }
    } catch (error: any) {

      let errorMessage = "Erreur lors de la création";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "La requête a pris trop de temps";
      }

      set({
        loading: false,
        error: errorMessage,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  updateGuardian: async (id: string, data: Partial<Guardian>) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/guardians/${id}`, data, {
        timeout: 15000,
      });

      if (response.data.success) {
        const updatedGuardian = response.data.data;

        set((state) => ({
          guardians: state.guardians.map((guardian) =>
            guardian.id === id ? updatedGuardian : guardian
          ),
          loading: false,
          error: null,
          selectedGuardian: updatedGuardian,
        }));

        toast({
          title: "Succès",
          description: "Tuteur mis à jour avec succès",
        });

        return updatedGuardian;
      } else {
        set({
          loading: false,
          error: response.data.error,
        });

        toast({
          title: "Erreur",
          description: response.data.error,
          variant: "destructive",
        });

        return null;
      }
    } catch (error: any) {

      let errorMessage = "Erreur lors de la mise à jour";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      set({
        loading: false,
        error: errorMessage,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  deleteGuardian: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.delete(`/guardians/${id}`, {
        timeout: 10000,
      });

      if (response.data.success) {
        set((state) => ({
          guardians: state.guardians.filter((guardian) => guardian.id !== id),
          loading: false,
          error: null,
          selectedGuardian:
            state.selectedGuardian?.id === id ? null : state.selectedGuardian,
        }));

        toast({
          title: "Succès",
          description: "Tuteur supprimé avec succès",
        });

        return true;
      } else {
        set({
          loading: false,
          error: response.data.error,
        });

        toast({
          title: "Erreur",
          description: response.data.error,
          variant: "destructive",
        });

        return false;
      }
    } catch (error: any) {

      set({
        loading: false,
        error: "Erreur lors de la suppression",
      });

      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });

      return false;
    }
  },

  setPrimaryGuardian: async (studentId: string, guardianId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(
        `/guardians/${guardianId}/set-primary`,
        {
          studentId,
        },
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Mettre à jour les guardians pour cet étudiant
        set((state) => ({
          guardians: state.guardians.map((guardian) => {
            if (guardian.studentId === studentId) {
              return {
                ...guardian,
                isPrimary: guardian.id === guardianId,
              };
            }
            return guardian;
          }),
          loading: false,
          error: null,
        }));

        toast({
          title: "Succès",
          description: "Responsable principal défini avec succès",
        });
      } else {
        set({
          loading: false,
          error: response.data.error,
        });

        toast({
          title: "Erreur",
          description: response.data.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {

      set({
        loading: false,
        error: "Erreur lors de la définition du responsable principal",
      });

      toast({
        title: "Erreur",
        description: "Erreur lors de la définition du responsable principal",
        variant: "destructive",
      });
    }
  },

  // ============================================
  // ACTIONS POUR LES PARENTS
  // ============================================

  fetchParents: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/parents", {
        timeout: 10000,
      });

      if (response.data.success) {
        set({
          parents: response.data.data,
          loading: false,
          error: null,
        });

        toast({
          title: "Succès",
          description: "Liste des parents chargée avec succès",
        });
      } else {
        set({
          loading: false,
          error: response.data.error,
        });
      }
    } catch (error: any) {

      set({
        loading: false,
        error: "Erreur lors du chargement des parents",
      });
    }
  },

  fetchParentById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/parents/${id}`, {
        timeout: 8000,
      });

      if (response.data.success) {
        set({
          loading: false,
          error: null,
          selectedParent: response.data.data,
        });
        return response.data.data;
      } else {
        set({
          loading: false,
          error: response.data.error,
        });
        return null;
      }
    } catch (error: any) {

      set({
        loading: false,
        error: "Erreur lors du chargement du parent",
      });
      return null;
    }
  },

  createParentAccount: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/parents/create", data, {
        timeout: 20000,
      });

      if (response.data.success) {
        // Recharger les guardians et parents
        await Promise.all([get().fetchGuardians(), get().fetchParents()]);

        set({ loading: false, error: null });

        toast({
          title: "Succès",
          description: "Compte parent créé avec succès",
        });

        return {
          success: true,
          parentId: response.data.data.parentId,
        };
      } else {
        set({ loading: false, error: response.data.error });

        toast({
          title: "Erreur",
          description: response.data.error,
          variant: "destructive",
        });

        return { success: false, error: response.data.error };
      }
    } catch (error: any) {

      const errorMessage =
        error.response?.data?.error || "Erreur lors de la création";
      set({ loading: false, error: errorMessage });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    }
  },

  linkGuardianToParent: async (guardianId: string, parentId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/guardians/${guardianId}/link-parent`,
        {
          parentId,
        },
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Mettre à jour le guardian localement
        set((state) => ({
          guardians: state.guardians.map((guardian) =>
            guardian.id === guardianId ? { ...guardian, parentId } : guardian
          ),
          loading: false,
          error: null,
        }));

        toast({
          title: "Succès",
          description: "Tuteur lié au compte parent avec succès",
        });

        return true;
      } else {
        set({ loading: false, error: response.data.error });
        return false;
      }
    } catch (error: any) {

      set({ loading: false, error: "Erreur lors de la liaison" });
      return false;
    }
  },

  unlinkGuardianFromParent: async (guardianId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/guardians/${guardianId}/unlink-parent`,
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Mettre à jour le guardian localement
        set((state) => ({
          guardians: state.guardians.map((guardian) =>
            guardian.id === guardianId
              ? { ...guardian, parentId: undefined }
              : guardian
          ),
          loading: false,
          error: null,
        }));

        toast({
          title: "Succès",
          description: "Lien avec le compte parent supprimé",
        });

        return true;
      } else {
        set({ loading: false, error: response.data.error });
        return false;
      }
    } catch (error: any) {

      set({ loading: false, error: "Erreur lors de la suppression du lien" });
      return false;
    }
  },

  addChildToParent: async (
    parentId: string,
    studentId: string,
    relationship = "Parent"
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/parents/${parentId}/add-child`,
        {
          studentId,
          relationship,
        },
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Recharger les guardians
        await get().fetchGuardians();

        set({ loading: false, error: null });

        toast({
          title: "Succès",
          description: "Enfant ajouté au parent avec succès",
        });

        return true;
      } else {
        set({ loading: false, error: response.data.error });
        return false;
      }
    } catch (error: any) {

      set({ loading: false, error: "Erreur lors de l'ajout de l'enfant" });
      return false;
    }
  },

  removeChildFromParent: async (parentId: string, studentId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.delete(
        `/parents/${parentId}/children/${studentId}`,
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        // Recharger les guardians
        await get().fetchGuardians();

        set({ loading: false, error: null });

        toast({
          title: "Succès",
          description: "Enfant retiré du parent avec succès",
        });

        return true;
      } else {
        set({ loading: false, error: response.data.error });
        return false;
      }
    } catch (error: any) {

      set({ loading: false, error: "Erreur lors du retrait de l'enfant" });
      return false;
    }
  },



  searchExistingParent: async (email?: string, phone?: string) => {
    if (!email && !phone) {
      return {
        success: false,
        error: "Email ou téléphone requis pour la recherche",
      };
    }

    try {
      const response = await api.post(
        "/guardians/find-parent",
        {
          email,
          phone,
        },
        {
          timeout: 8000,
        }
      );

      return response.data;
    } catch (error: any) {

      return {
        success: false,
        error: error.response?.data?.error || "Erreur lors de la recherche",
      };
    }
  },

  // ============================================
  // GESTION D'ÉTAT
  // ============================================

  setSelectedGuardian: (guardian: Guardian | null) => {
    set({ selectedGuardian: guardian });
  },

  setSelectedParent: (parent: Parent | null) => {
    set({ selectedParent: parent });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAll: () => {
    set({
      guardians: [],
      parents: [],
      selectedGuardian: null,
      selectedParent: null,
      error: null,
    });
  },
}));

// Hook utilitaire pour les guardians d'un étudiant spécifique
export const useStudentGuardians = (studentId?: string) => {
  const { guardians, loading } = useGuardianStore();

  if (!studentId) {
    return { guardians: [], loading, primaryGuardian: null };
  }

  const studentGuardians = guardians.filter((g) => g.studentId === studentId);
  const primaryGuardian = studentGuardians.find((g) => g.isPrimary) || null;

  return { guardians: studentGuardians, loading, primaryGuardian };
};

// Hook utilitaire pour les enfants d'un parent
export const useParentChildren = (parentId?: string) => {
  const { guardians } = useGuardianStore();

  if (!parentId) {
    return { children: [], guardians: [] };
  }

  const parentGuardians = guardians.filter((g) => g.parentId === parentId);
  // Note: Vous devrez avoir accès aux étudiants depuis un autre store
  // const children = parentGuardians.map(g =>
  //   students.find(s => s.id === g.studentId)
  // ).filter(Boolean);

  return {
    guardians: parentGuardians,
    // children
  };
};
