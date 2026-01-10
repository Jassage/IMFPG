/**
 * @file professeurStore.ts
 * @description Store Zustand pour la gestion des professeurs
 */

import { create } from "zustand";

// Types
export interface ProfesseurSubject {
  id: string;
  professeurId: string;
  subjectId: string;
  isPrimary: boolean;
  yearsOfExperience: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  subject?: {
    id: string;
    name: string;
    code: string;
    coefficient: number;
    type: string;
    description?: string;
  };
}

export interface Professeur {
  subjects: any[];
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  status: "Actif" | "Inactif";
  matricule?: string;
  address?: string;
  qualifications?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: {
    [x: string]: any;
    id: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
    emailVerified?: boolean;
  };
  _count?: {
    assignments: number;
    schedules: number;
    classes?: number;
    subjectsTaught?: number;
  };
  subjectsTaught?: ProfesseurSubject[];
  assignments?: ProfesseurAssignment[];
  schedules?: ProfesseurSchedule[];
}

export interface ProfesseurSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom?: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  schoolClass?: {
    id: string;
    name: string;
    level: string;
  };
  classAssignment?: {
    classLevel: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
    academicYear: {
      id: string;
      year: string;
    };
  };
}

export interface ProfesseurAssignment {
  schoolClass: any;
  pendingGrades: number;
  id: string;
  classLevel: string;
  status: string;
  createdAt: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  academicYear: {
    id: string;
    year: string;
    isCurrent: boolean;
  };
  schedules: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classroom?: string;
    schoolClass?: {
      id: string;
      name: string;
      level: string;
    };
  }>;
  _count?: {
    schedules: number;
    grades: number;
  };
}

// Interfaces pour les filtres
interface ProfesseurFilters {
  search?: string;
  status?: string;
  speciality?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateProfesseurData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  matricule?: string;
  address?: string;
  qualifications?: string;
  subjects?: Array<{
    subjectId: string;
    isPrimary?: boolean;
    yearsOfExperience?: number;
    notes?: string;
  }>;
  userId?: string;
  status?: "Actif" | "Inactif";
  createUserAccount?: boolean;
  sendInvitation?: boolean;
}

interface UpdateProfesseurData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  hireDate?: string;
  status?: "Actif" | "Inactif";
  matricule?: string;
  address?: string;
  qualifications?: string;
  subjects?: Array<{
    subjectId: string;
    isPrimary?: boolean;
    yearsOfExperience?: number;
    notes?: string;
  }>;
  userId?: string | null;
}

// Interface pour l'état du store
interface ProfesseurStore {
  // État
  professeurs: Professeur[];
  currentProfesseur: Professeur | null;
  professeurSchedule: ProfesseurSchedule[];
  professeurAssignments: ProfesseurAssignment[];
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  filters: ProfesseurFilters;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<ProfesseurFilters>) => void;
  fetchProfesseurs: () => Promise<void>;
  fetchProfesseurById: (id: string) => Promise<Professeur>;
  fetchProfesseurFullDetails: (id: string) => Promise<Professeur>;
  fetchProfesseurSchedule: (id: string) => Promise<void>;
  fetchProfesseurAssignments: (id: string) => Promise<void>;
  fetchProfesseurByUserId: (userId: string) => Promise<Professeur>;
  attachUserToProfesseur: (
    professeurId: string,
    userData: { email: string; password?: string }
  ) => Promise<Professeur>;
  detachUserFromProfesseur: (professeurId: string) => Promise<Professeur>;
  sendInvitationEmail: (professeurId: string) => Promise<any>;
  createProfesseur: (
    professeurData: CreateProfesseurData
  ) => Promise<Professeur>;
  updateProfesseur: (
    id: string,
    professeurData: UpdateProfesseurData
  ) => Promise<Professeur>;
  deleteProfesseur: (id: string) => Promise<void>;
  activateProfesseur: (id: string) => Promise<Professeur>;
  deactivateProfesseur: (id: string) => Promise<Professeur>;

  // Nouvelles actions pour la gestion des matières
  addSubjectToProfesseur: (
    professeurId: string,
    subjectData: {
      subjectId: string;
      isPrimary?: boolean;
      yearsOfExperience?: number;
      notes?: string;
    }
  ) => Promise<ProfesseurSubject>;

  removeSubjectFromProfesseur: (
    professeurId: string,
    subjectId: string
  ) => Promise<void>;

  updateProfesseurSubject: (
    professeurId: string,
    subjectId: string,
    data: {
      isPrimary?: boolean;
      yearsOfExperience?: number;
      notes?: string;
    }
  ) => Promise<ProfesseurSubject>;

  setSubjectAsPrimary: (
    professeurId: string,
    subjectId: string
  ) => Promise<ProfesseurSubject>;

  clearCurrentProfesseur: () => void;
  clearError: () => void;
  clearProfesseurs: () => void;
}

// Import de l'API
import api from "../services/api";

export const useProfesseurStore = create<ProfesseurStore>((set, get) => ({
  // État initial
  professeurs: [],
  currentProfesseur: null,
  professeurSchedule: [],
  professeurAssignments: [],
  loading: false,
  loadingDetails: false,
  error: null,

  filters: {
    search: "",
    status: "",
    speciality: "",
    page: 1,
    limit: 20,
    sortBy: "lastName",
    sortOrder: "asc",
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  // Actions

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    }));
    get().fetchProfesseurs();
  },

  fetchProfesseurs: async (params?: any) => {
    set({ loading: true, error: null });
    try {
      console.log("📡 Fetching professeurs avec params:", params || "aucun");

      const response = await api.get("/professeurs", { params });
      console.log("📥 Réponse fetchProfesseurs:", {
        count: response.data.data?.length || 0,
        data: response.data.data,
      });

      // Assurez-vous de bien extraire les données
      const professeurs = response.data.data || response.data || [];

      set({
        professeurs,
        loading: false,
        // Réinitialiser les filtres si nécessaire
        ...(params && { filters: params }),
      });

      return professeurs;
    } catch (error: any) {
      console.error("❌ Erreur fetchProfesseurs:", error);
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  fetchProfesseurById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/professeurs/${id}`);
      const professeur = response.data.data.professeur;
      // console.log("📥 Réponse fetchProfesseurById:", professeur);

      set({
        currentProfesseur: professeur,
        loading: false,
      });

      return professeur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  fetchProfesseurFullDetails: async (id: string) => {
    set({ loadingDetails: true, error: null });

    try {
      console.log("📡 Chargement des détails complets pour professeur:", id);

      const response = await api.get(`/professeurs/${id}`);
      console.log("📥 Réponse API:", response.data);

      // Extraire les données de base
      const data = response.data.data || response.data;

      if (!data) {
        throw new Error("Réponse vide de l'API");
      }

      // Créer un objet professeur standardisé
      const professeur: Professeur = {
        id: data.id || data.professeur?.id,
        firstName: data.firstName || data.professeur?.firstName || "",
        lastName: data.lastName || data.professeur?.lastName || "",
        email: data.email || data.professeur?.email || "",
        phone: data.phone || data.professeur?.phone,
        speciality: data.speciality || data.professeur?.speciality,
        hireDate: data.hireDate || data.professeur?.hireDate,
        status: data.status || data.professeur?.status || "Actif",
        matricule: data.matricule || data.professeur?.matricule,
        address: data.address || data.professeur?.address,
        qualifications: data.qualifications || data.professeur?.qualifications,
        createdAt:
          data.createdAt ||
          data.professeur?.createdAt ||
          new Date().toISOString(),
        updatedAt:
          data.updatedAt ||
          data.professeur?.updatedAt ||
          new Date().toISOString(),
        userId: data.userId || data.professeur?.userId,
        user: data.user || data.professeur?.user,
        subjects: data.subjects || data.professeur?.subjects || [],
        subjectsTaught: ensureArray(
          data.subjectsTaught || data.professeur?.subjectsTaught
        ),
        assignments: ensureArray(
          data.assignments || data.professeur?.assignments
        ),
        schedules: ensureArray(data.schedules || data.professeur?.schedules),
        _count: {
          assignments:
            data._count?.assignments ||
            data.professeur?._count?.assignments ||
            (data.assignments || []).length ||
            0,
          schedules:
            data._count?.schedules ||
            data.professeur?._count?.schedules ||
            (data.schedules || []).length ||
            0,
          classes:
            data._count?.classes || data.professeur?._count?.classes || 0,
          subjectsTaught:
            data._count?.subjectsTaught ||
            data.professeur?._count?.subjectsTaught ||
            (data.subjectsTaught || []).length ||
            0,
        },
      };

      // Extraire les schedules pour le store
      const schedules: ProfesseurSchedule[] = [];

      // 1. Extraire des assignments
      professeur.assignments?.forEach((assignment: any) => {
        if (assignment.schedules && Array.isArray(assignment.schedules)) {
          assignment.schedules.forEach((schedule: any) => {
            schedules.push(createScheduleObject(schedule, assignment));
          });
        }
      });

      // 2. Extraire des schedules directs si pas encore trouvé
      if (schedules.length === 0 && professeur.schedules) {
        professeur.schedules.forEach((schedule: any) => {
          schedules.push(createScheduleObject(schedule));
        });
      }

      // Fonction helper pour créer un objet schedule standardisé
      function createScheduleObject(
        schedule: any,
        assignment?: any
      ): ProfesseurSchedule {
        return {
          id: schedule.id || `temp-${Date.now()}`,
          dayOfWeek: schedule.dayOfWeek || 1,
          startTime: schedule.startTime || "08:00",
          endTime: schedule.endTime || "09:00",
          classroom: schedule.classroom,
          subject: schedule.subject ||
            assignment?.subject || { id: "", name: "Cours", code: "" },
          schoolClass: schedule.schoolClass || {
            id: "",
            name: "Classe",
            level: assignment?.classLevel || "",
          },
          classAssignment: schedule.classAssignment || {
            classLevel: assignment?.classLevel || "",
            subject: assignment?.subject || {},
            academicYear: assignment?.academicYear || {},
          },
        };
      }

      // Fonction helper pour garantir les tableaux
      function ensureArray(value: any): any[] {
        if (Array.isArray(value)) return value;
        if (value === undefined || value === null) return [];
        return [value];
      }

      console.log("✅ Professeur normalisé:", {
        id: professeur.id,
        nom: `${professeur.firstName} ${professeur.lastName}`,
        matieres: professeur.subjectsTaught.length,
        assignments: professeur.assignments.length,
        schedules: schedules.length,
      });

      // Mettre à jour le store
      set({
        currentProfesseur: professeur,
        professeurSchedule: schedules,
        professeurAssignments: professeur.assignments,
        loadingDetails: false,
      });

      return professeur;
    } catch (error: any) {
      console.error("❌ Erreur fetchProfesseurFullDetails:", error);
      set({
        error: error.response?.data?.message || error.message,
        loadingDetails: false,
      });
      throw error;
    }
  },

  fetchProfesseurSchedule: async (id: string) => {
    set({ loading: true, error: null });

    try {
      // Récupérer d'abord les assignments qui contiennent les horaires
      const assignmentsResponse = await api.get(
        `/class-assignments/professor/${id}`
      );
      const assignments = assignmentsResponse.data.data.assignments || [];

      // Extraire tous les horaires de tous les assignments
      const scheduleArray: ProfesseurSchedule[] = [];

      assignments.forEach((assignment: ProfesseurAssignment) => {
        if (assignment.schedules && assignment.schedules.length > 0) {
          assignment.schedules.forEach((schedule: any) => {
            scheduleArray.push({
              id: schedule.id,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              classroom: schedule.classroom,
              schoolClass: schedule.schoolClass,
              subject: assignment.subject,
              classAssignment: {
                subject: assignment.subject,
                academicYear: assignment.academicYear,
                classLevel: "",
              },
            });
          });
        }
      });

      set({
        professeurSchedule: scheduleArray,
        loading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur de chargement de l'emploi du temps",
        loading: false,
      });
      throw error;
    }
  },

  fetchProfesseurAssignments: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/class-assignments/professor/${id}`);
      const assignments = response.data.data.assignments || [];

      set({
        professeurAssignments: assignments,
        loading: false,
      });

      return assignments;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur de chargement des assignations",
        loading: false,
      });
      throw error;
    }
  },

  createProfesseur: async (professeurData: CreateProfesseurData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/professeurs", professeurData);
      const newProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: [newProfesseur, ...state.professeurs],
        loading: false,
      }));

      return newProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateProfesseur: async (
    id: string,
    professeurData: UpdateProfesseurData
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/professeurs/${id}`, professeurData);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/professeurs/${id}`);

      set((state) => ({
        professeurs: state.professeurs.filter((prof) => prof.id !== id),
        currentProfesseur: null,
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

  activateProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/professeurs/${id}/activate`);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'activation",
        loading: false,
      });
      throw error;
    }
  },

  deactivateProfesseur: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put(`/professeurs/${id}/deactivate`);
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === id ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de désactivation",
        loading: false,
      });
      throw error;
    }
  },

  attachUserToProfesseur: async (professeurId, userData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/professeurs/${professeurId}/attach-user`,
        userData
      );
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === professeurId ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de l'association",
        loading: false,
      });
      throw error;
    }
  },

  detachUserFromProfesseur: async (professeurId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.delete(
        `/professeurs/${professeurId}/detach-user`
      );
      const updatedProfesseur = response.data.data.professeur;

      set((state) => ({
        professeurs: state.professeurs.map((prof) =>
          prof.id === professeurId ? updatedProfesseur : prof
        ),
        currentProfesseur: updatedProfesseur,
        loading: false,
      }));

      return updatedProfesseur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors du détachement",
        loading: false,
      });
      throw error;
    }
  },

  fetchProfesseurByUserId: async (userId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/professeurs/user/${userId}`);
      const professeur = response.data.data.professeur;

      // Stocker le professeur récupéré
      set({
        currentProfesseur: professeur,
        loading: false,
      });

      return professeur;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  sendInvitationEmail: async (professeurId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(`/auth/send-invitation/${professeurId}`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur d'envoi d'invitation",
        loading: false,
      });
      throw error;
    }
  },

  // Nouvelles actions pour la gestion des matières

  addSubjectToProfesseur: async (professeurId, subjectData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        `/professeurs/${professeurId}/subjects`,
        subjectData
      );
      const newSubject = response.data.data.subject;

      // Mettre à jour le professeur courant avec la nouvelle matière
      set((state) => {
        if (!state.currentProfesseur) return state;

        const updatedSubjects = [
          ...(state.currentProfesseur.subjectsTaught || []),
          newSubject,
        ];

        return {
          currentProfesseur: {
            ...state.currentProfesseur,
            subjectsTaught: updatedSubjects,
            _count: {
              ...state.currentProfesseur._count,
              subjectsTaught: updatedSubjects.length,
            },
          },
          loading: false,
        };
      });

      return newSubject;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de l'ajout de la matière",
        loading: false,
      });
      throw error;
    }
  },

  removeSubjectFromProfesseur: async (professeurId, subjectId) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/professeurs/${professeurId}/subjects/${subjectId}`);

      // Mettre à jour le professeur courant en retirant la matière
      set((state) => {
        if (!state.currentProfesseur) return state;

        const updatedSubjects = (
          state.currentProfesseur.subjectsTaught || []
        ).filter(
          (subject) =>
            subject.id !== subjectId && subject.subjectId !== subjectId
        );

        return {
          currentProfesseur: {
            ...state.currentProfesseur,
            subjectsTaught: updatedSubjects,
            _count: {
              ...state.currentProfesseur._count,
              subjectsTaught: updatedSubjects.length,
            },
          },
          loading: false,
        };
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la suppression de la matière",
        loading: false,
      });
      throw error;
    }
  },

  updateProfesseurSubject: async (professeurId, subjectId, data) => {
    set({ loading: true, error: null });

    try {
      const response = await api.patch(
        `/professeurs/${professeurId}/subjects/${subjectId}`,
        data
      );
      const updatedSubject = response.data.data.subject;

      // Mettre à jour le professeur courant avec la matière modifiée
      set((state) => {
        if (!state.currentProfesseur) return state;

        const updatedSubjects = (
          state.currentProfesseur.subjectsTaught || []
        ).map((subject) => {
          if (subject.id === subjectId || subject.subjectId === subjectId) {
            return { ...subject, ...updatedSubject };
          }
          return subject;
        });

        // Si on définit une matière comme principale, s'assurer qu'une seule matière est principale
        if (data.isPrimary === true) {
          updatedSubjects.forEach((subject) => {
            if (subject.id !== subjectId && subject.subjectId !== subjectId) {
              subject.isPrimary = false;
            }
          });
        }

        return {
          currentProfesseur: {
            ...state.currentProfesseur,
            subjectsTaught: updatedSubjects,
          },
          loading: false,
        };
      });

      return updatedSubject;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la mise à jour de la matière",
        loading: false,
      });
      throw error;
    }
  },

  setSubjectAsPrimary: async (professeurId, subjectId) => {
    return get().updateProfesseurSubject(professeurId, subjectId, {
      isPrimary: true,
    });
  },

  clearCurrentProfesseur: () =>
    set({
      currentProfesseur: null,
      professeurSchedule: [],
      professeurAssignments: [],
    }),

  clearError: () => set({ error: null }),

  clearProfesseurs: () =>
    set({
      professeurs: [],
      currentProfesseur: null,
      professeurSchedule: [],
      professeurAssignments: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    }),
}));

export default useProfesseurStore;
