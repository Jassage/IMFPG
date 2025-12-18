import { create } from "zustand";
// import { api } from '@/lib/api';
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";

interface Subject {
  id: string;
  code: string;
  name: string;
  type: string;
  coefficient: number;
}

interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  status: string;
}

interface AcademicYear {
  id: string;
  year: string;
  isCurrent: boolean;
}

interface ClassAssignment {
  schoolClass: any;
  id: string;
  subjectId: string;
  professeurId: string;
  classLevel: string;
  classId: string;
  academicYearId: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Relations incluses
  subject?: Subject;
  professeur?: Professeur;
  academicYear?: AcademicYear;
  _count?: {
    schedules: number;
    grades: number;
  };
}

interface AssignmentFilters {
  classLevel?: string;
  academicYearId?: string;
  professeurId?: string;
  subjectId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface AssignmentState {
  // État
  assignments: ClassAssignment[];
  selectedAssignment: ClassAssignment | null;
  filters: AssignmentFilters;
  loading: boolean;
  error: string | null;

  // Données pour les formulaires
  subjects: Subject[];
  professeurs: Professeur[];
  academicYears: AcademicYear[];
  classLevels: string[];

  // Actions
  fetchAssignments: () => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<void>;
  createAssignment: (data: {
    subjectId: string;
    professeurId: string;
    classLevel: string;
    academicYearId: string;
  }) => Promise<ClassAssignment | null>;
  updateAssignment: (
    id: string,
    data: Partial<ClassAssignment>
  ) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AssignmentFilters>) => void;
  resetFilters: () => void;
  setSelectedAssignment: (assignment: ClassAssignment | null) => void;
  fetchAssignmentsByClassAndLevel: (
    classId: string,
    level: string
  ) => Promise<void>;
  fetchAssignmentsByClass: (classId: string) => Promise<void>;
  fetchAssignmentsByLevel: (level: string) => Promise<void>;
  // Chargement des données de référence
  loadFormData: () => Promise<void>;
}

const initialFilters: AssignmentFilters = {
  page: 1,
  limit: 20,
  search: "",
  status: "Active",
};

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  // État initial
  assignments: [],
  selectedAssignment: null,
  filters: initialFilters,
  loading: false,
  error: null,

  subjects: [],
  professeurs: [],
  academicYears: [],
  classLevels: [
    "CP1",
    "CP2",
    "CE1",
    "CE2",
    "CM1",
    "CM2",
    "Sixieme",
    "Cinquieme",
    "Quatrieme",
    "Troisieme",
    "Seconde",
    "Premiere",
    "Terminale",
  ],

  // Actions
  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/class-assignments?${params}`);

      // Extraction sécurisée
      const assignmentsData =
        response.data?.assignments ||
        response.data?.data?.assignments ||
        response.data?.data ||
        [];

      // Filtrage des données invalides
      const validAssignments = assignmentsData.filter(
        (assignment: any) =>
          assignment &&
          typeof assignment === "object" &&
          assignment.id &&
          assignment.status
      );

      if (assignmentsData.length !== validAssignments.length) {
        console.warn(
          `Filtered ${
            assignmentsData.length - validAssignments.length
          } invalid assignments`
        );
      }

      set({
        assignments: validAssignments,
        loading: false,
      });
    } catch (error: any) {
      console.error(" fetchAssignments error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des assignations",
        loading: false,
      });
    }
  },

  fetchAssignmentById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/class-assignments/${id}`);
      set({ selectedAssignment: response.data.assignment, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement de l'assignation",
        loading: false,
      });
    }
  },

  createAssignment: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/class-assignments", data);

      // VÉRIFIEZ que response.data.assignment existe
      const newAssignment = response.data?.assignment || response.data?.data;

      if (!newAssignment) {
        console.error("❌ No assignment data in response:", response.data);
        throw new Error("No assignment data received from server");
      }

      // Ajouter la nouvelle assignation à la liste
      set((state) => ({
        assignments: [newAssignment, ...state.assignments],
        loading: false,
      }));

      toast({
        title: "✅ Assignation créée",
        description: `L'assignation a été créée avec succès`,
      });

      return newAssignment;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la création";
      set({ error: errorMessage, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  updateAssignment: async (id: string, data: Partial<ClassAssignment>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/class-assignments/${id}`, data);

      // Mettre à jour l'assignation dans la liste
      set((state) => ({
        assignments: state.assignments.map((assignment) =>
          assignment.id === id ? response.data.assignment : assignment
        ),
        loading: false,
      }));

      toast({
        title: "✅ Assignation mise à jour",
        description: `L'assignation a été modifiée avec succès`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      set({ error: errorMessage, loading: false });

      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  deleteAssignment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/class-assignments/${id}`);

      // Supprimer l'assignation de la liste
      set((state) => ({
        assignments: state.assignments.filter(
          (assignment) => assignment.id !== id
        ),
        loading: false,
      }));

      // Si l'assignation sélectionnée est celle supprimée, la désélectionner
      const { selectedAssignment } = get();
      if (selectedAssignment?.id === id) {
        set({ selectedAssignment: null });
      }

      toast({
        title: "✅ Assignation supprimée",
        description: `L'assignation a été supprimée avec succès`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la suppression";
      set({ error: errorMessage, loading: false });

      // Vérifier si c'est une erreur de dépendance
      if (error.response?.data?.code === "HAS_DEPENDENCIES") {
        toast({
          title: "⚠️ Impossible de supprimer",
          description:
            "Cette assignation est utilisée dans des emplois du temps ou des notes",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 }, // Reset page to 1 on filter change
    }));

    // Recharger les données avec les nouveaux filtres
    setTimeout(() => {
      get().fetchAssignments();
    }, 100);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchAssignments();
  },

  setSelectedAssignment: (assignment) => {
    set({ selectedAssignment: assignment });
  },
  loadFormData: async () => {
    try {
      const [subjectsRes, professeursRes, yearsRes] = await Promise.all([
        api.get("/subjects?limit=1000"),
        api.get("/professeurs?status=Actif"),
        api.get("/academic-years"),
      ]);

      console.log("🔍 Structure des réponses:");
      console.log("1. Subjects:", {
        hasSuccess: subjectsRes.data?.success,
        hasData: !!subjectsRes.data?.data,
        dataKeys: subjectsRes.data?.data
          ? Object.keys(subjectsRes.data.data)
          : [],
        hasSubjects: !!subjectsRes.data?.data?.subjects,
        subjectsCount: subjectsRes.data?.data?.subjects?.length,
      });

      console.log("2. Professeurs:", {
        hasSuccess: professeursRes.data?.success,
        hasData: !!professeursRes.data?.data,
        dataKeys: professeursRes.data?.data
          ? Object.keys(professeursRes.data.data)
          : [],
        hasProfesseurs: !!professeursRes.data?.data?.professeurs,
        professeursCount: professeursRes.data?.data?.professeurs?.length,
      });

      console.log("3. Academic Years:", {
        isArray: Array.isArray(yearsRes.data),
        count: Array.isArray(yearsRes.data) ? yearsRes.data.length : 0,
        firstItem: Array.isArray(yearsRes.data) ? yearsRes.data[0] : null,
      });

      // Extraction correcte des données
      const subjectsData = subjectsRes.data?.data?.subjects || [];
      const professeursData = professeursRes.data?.data?.professeurs || [];
      const academicYearsData = Array.isArray(yearsRes.data)
        ? yearsRes.data
        : yearsRes.data?.data || [];

      console.log("✅ Données extraites CORRECTEMENT:", {
        subjects: subjectsData.length,
        professeurs: professeursData.length,
        academicYears: academicYearsData.length,
        sampleSubjects: subjectsData.slice(0, 2),
        sampleProfesseurs: professeursData.slice(0, 2),
      });

      set({
        subjects: subjectsData,
        professeurs: professeursData,
        academicYears: academicYearsData,
      });
    } catch (error) {
      console.error("❌ Error loading form data:", error);

      // Définir des tableaux vides par défaut
      set({
        subjects: [],
        professeurs: [],
        academicYears: [],
      });

      toast({
        title: "Erreur",
        description: "Impossible de charger les données du formulaire",
        variant: "destructive",
      });
    }
  },
  fetchAssignmentsByClassAndLevel: async (classId: string, level: string) => {
    set({ loading: true, error: null });
    try {
      // Appeler l'endpoint qui filtre par classe et niveau
      const response = await api.get(
        `/class-assignments/class/${classId}?level=${level}`
      );

      // Extraction des données selon votre structure d'API
      const assignmentsData =
        response.data?.data?.assignments || response.data?.assignments || [];

      // Filtrage des données invalides
      const validAssignments = assignmentsData.filter(
        (assignment: any) =>
          assignment &&
          typeof assignment === "object" &&
          assignment.id &&
          assignment.status
      );

      set({
        assignments: validAssignments,
        loading: false,
      });
    } catch (error: any) {
      console.error("❌ fetchAssignmentsByClassAndLevel error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des assignations filtrées",
        loading: false,
      });
    }
  },

  fetchAssignmentsByClass: async (classId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/class-assignments/class/${classId}`);

      const assignmentsData =
        response.data?.data?.assignments || response.data?.assignments || [];

      const validAssignments = assignmentsData.filter(
        (assignment: any) =>
          assignment &&
          typeof assignment === "object" &&
          assignment.id &&
          assignment.status
      );

      set({
        assignments: validAssignments,
        loading: false,
      });
    } catch (error: any) {
      console.error("❌ fetchAssignmentsByClass error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des assignations par classe",
        loading: false,
      });
    }
  },

  fetchAssignmentsByLevel: async (level: string) => {
    set({ loading: true, error: null });
    try {
      // Utiliser le filtre existant avec le paramètre classLevel
      const response = await api.get(`/class-assignments?classLevel=${level}`);

      const assignmentsData =
        response.data?.data?.assignments || response.data?.assignments || [];

      const validAssignments = assignmentsData.filter(
        (assignment: any) =>
          assignment &&
          typeof assignment === "object" &&
          assignment.id &&
          assignment.status
      );

      set({
        assignments: validAssignments,
        loading: false,
      });
    } catch (error: any) {
      console.error("❌ fetchAssignmentsByLevel error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des assignations par niveau",
        loading: false,
      });
    }
  },
}));
