// store/gradeStore.ts
import { create } from "zustand";
import {
  Grade,
  GradeStatus,
  GradeSession,
  ControlType,
  ClassLevel,
  ClassLevelFilter,
} from "../types/academic";
import api from "@/services/api";
import { toast } from "sonner";

interface GradeFilters {
  academicYearId?: string;
  classLevel?: ClassLevelFilter;
  subjectId?: string;
  controlType?: ControlType | "";
  session?: GradeSession | "";
  status?: GradeStatus | "";
  studentId?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  summary: {
    total: number;
    created: number;
    failed: number;
    successRate: string;
  };
  details: {
    reussites: any[];
    erreurs: any[];
  };
}

// Interface corrigée
export interface GradeStore {
  grades: Grade[];
  loading: boolean;
  isSaving: boolean;
  error: string | null;
  studentGrades: Grade[];
  gradeStatistics: any;

  fetchGrades: (filters?: GradeFilters) => Promise<void>;
  fetchGradeById: (id: string) => Promise<Grade>;
  fetchStudentGrades: (studentId: string) => Promise<Grade[]>;
  fetchSubjectGrades: (subjectId: string) => Promise<Grade[]>;

  addGrade: (
    gradeData: Omit<
      Grade,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "student"
      | "subject"
      | "classAssignment"
      | "academicYear"
    >
  ) => Promise<Grade>;

  updateGrade: (
    id: string,
    gradeData: {
      grade?: number;
      status?: GradeStatus;
      session?: GradeSession;
      controlType?: ControlType;
      notes?: string;
      isActive?: boolean;
    }
  ) => Promise<Grade>;

  deleteGrade: (id: string) => Promise<void>;

  bulkAddGrades: (
    gradesData: Omit<
      Grade,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "student"
      | "subject"
      | "classAssignment"
      | "academicYear"
    >[]
  ) => Promise<Grade[]>;

  recalculateStatus: (grade: number, passingGrade: number) => GradeStatus;

  getStudentGradeForSubject: (
    studentId: string,
    subjectId: string,
    academicYearId: string,
    controlType: ControlType,
    session: GradeSession
  ) => Grade | null;

  importGradesFromExcel: (file: File) => Promise<ImportResult>;
  downloadGradeTemplate: () => Promise<void>;
  clearError: () => void;
}

export const useGradeStore = create<GradeStore>((set, get) => ({
  // ÉTAT INITIAL
  grades: [],
  studentGrades: [],
  gradeStatistics: null,
  loading: false,
  isSaving: false,
  error: null,

  // fetchGrades reste inchangé
  fetchGrades: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/grades?${params}`);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      let gradesData = [];

      if (response.data?.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          gradesData = response.data.data;
        } else if (
          response.data.data.grades &&
          Array.isArray(response.data.data.grades)
        ) {
          gradesData = response.data.data.grades;
        } else if (
          response.data.data.results &&
          Array.isArray(response.data.data.results)
        ) {
          gradesData = response.data.data.results;
        } else if (
          typeof response.data.data === "object" &&
          response.data.data !== null
        ) {
          const allValues = Object.values(response.data.data);
          gradesData = allValues.filter(
            (item) => item && typeof item === "object" && "id" in item
          );
        }
      } else if (Array.isArray(response.data)) {
        gradesData = response.data;
      } else if (response.data?.grades && Array.isArray(response.data.grades)) {
        gradesData = response.data.grades;
      } else if (
        response.data?.results &&
        Array.isArray(response.data.results)
      ) {
        gradesData = response.data.results;
      }

      set({
        grades: gradesData,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchGradeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/grades/${id}`);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      set({ loading: false });
      return response.data?.grade || response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchStudentGrades: async (studentId: string) => {
    const state = get();
    if (state.loading) {
      console.log("⏭️ Already loading, skipping:", studentId);
      return [];
    }

    console.log(`📊 [START] Fetching grades for student ${studentId}`);
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/grades/student/${studentId}`);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      console.log("📋 Student grades API response structure:", {
        data: response.data,
        hasSuccess: !!response.data?.success,
        hasData: !!response.data?.data,
        dataKeys: response.data?.data ? Object.keys(response.data.data) : [],
      });

      let gradesData = [];
      let statistics = null;

      // ⚠️ CORRECTION 2: Extraction plus robuste
      if (response.data?.success) {
        // Cas 1: data.grades existe
        if (
          response.data.data?.grades &&
          Array.isArray(response.data.data.grades)
        ) {
          gradesData = response.data.data.grades;
          statistics = response.data.data.statistics || null;
        }
        // Cas 2: data est directement le tableau
        else if (Array.isArray(response.data.data)) {
          gradesData = response.data.data;
        }
        // Cas 3: data contient un autre nom
        else if (
          response.data.data?.results &&
          Array.isArray(response.data.data.results)
        ) {
          gradesData = response.data.data.results;
        }
        // Cas 4: data est un objet avec propriétés qui sont des tableaux
        else if (response.data.data && typeof response.data.data === "object") {
          const arrays = Object.values(response.data.data).filter((val) =>
            Array.isArray(val)
          );
          if (arrays.length > 0) {
            gradesData = arrays[0];
          }
        }
      }
      // Si pas de structure success/data
      else if (Array.isArray(response.data)) {
        gradesData = response.data;
      } else if (response.data?.grades && Array.isArray(response.data.grades)) {
        gradesData = response.data.grades;
        statistics = response.data.statistics || null;
      }

      const currentState = get();

      set({
        loading: false,
        studentGrades: gradesData,
        gradeStatistics: statistics,
        // Mettre à jour les notes générales uniquement si nouvelles
        grades: [
          ...currentState.grades,
          ...gradesData.filter(
            (g) => !currentState.grades.some((existing) => existing.id === g.id)
          ),
        ],
      });

      console.log(
        `📊 [END] Stored ${gradesData.length} student grades in store`
      );

      // ⚠️ IMPORTANT: Toujours retourner les données
      return gradesData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("❌ Error fetching student grades:", errorMessage);

      // ⚠️ CORRECTION 4: Toujours arrêter le loading en cas d'erreur
      set({
        error: errorMessage,
        loading: false,
        studentGrades: [], // Réinitialiser pour éviter les boucles
      });

      throw error;
    }
  },

  fetchSubjectGrades: async (subjectId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/grades/subject/${subjectId}`);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      set({ loading: false });
      return response.data?.grades || response.data || [];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Ajouter cette fonction pour récupérer les notes du store
  getStudentGradesFromStore: () => {
    return get().studentGrades;
  },

  addGrade: async (gradeData) => {
    set({ loading: true, isSaving: true, error: null });
    try {
      const validatedData = {
        ...gradeData,
        status: gradeData.status as GradeStatus,
        session: gradeData.session as GradeSession,
        controlType: gradeData.controlType as ControlType,
        classLevel: gradeData.classLevel as ClassLevel,
      };

      const response = await api.post("/grades", validatedData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const newGrade = response.data?.grade || response.data;

      set((state) => ({
        grades: [...state.grades, newGrade],
        loading: false,
        isSaving: false,
      }));

      return newGrade;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(errorMessage);
      set({ error: errorMessage, loading: false, isSaving: false });
      throw error;
    }
  },

  updateGrade: async (id, gradeData) => {
    set({ loading: true, isSaving: true, error: null });
    try {
      const response = await api.put(`/grades/${id}`, gradeData);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const updatedGrade = response.data?.grade || response.data;

      set((state) => ({
        grades: state.grades.map((grade) =>
          grade.id === id ? { ...grade, ...updatedGrade } : grade
        ),
        studentGrades: state.studentGrades.map((grade) =>
          grade.id === id ? { ...grade, ...updatedGrade } : grade
        ),
        loading: false,
        isSaving: false,
      }));

      return updatedGrade;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage, loading: false, isSaving: false });
      throw error;
    }
  },

  deleteGrade: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/grades/${id}`);

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      set((state) => ({
        grades: state.grades.filter((grade) => grade.id !== id),
        studentGrades: state.studentGrades.filter((grade) => grade.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  bulkAddGrades: async (
    gradesData: Omit<
      Grade,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "student"
      | "subject"
      | "classAssignment"
      | "academicYear"
    >[]
  ) => {
    try {
      set({ loading: true, isSaving: true, error: null });

      const createdGrades: Grade[] = [];

      try {
        const response = await api.post("/grades/bulk", gradesData);

        let gradesArray: Grade[] = [];

        if (Array.isArray(response.data)) {
          gradesArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          gradesArray = response.data.data;
        } else if (
          response.data?.grades &&
          Array.isArray(response.data.grades)
        ) {
          gradesArray = response.data.grades;
        }

        createdGrades.push(...gradesArray);
      } catch (bulkError) {
        for (const gradeData of gradesData) {
          try {
            const response = await api.post("/grades", gradeData);
            createdGrades.push(response.data);

            await new Promise((resolve) => setTimeout(resolve, 50));
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Erreur inconnue";
            toast.error(errorMessage);
            throw error;
          }
        }
      }

      set((state) => ({
        grades: [...state.grades, ...createdGrades],
        loading: false,
        isSaving: false,
      }));

      await get().fetchGrades();

      return createdGrades;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(errorMessage);
      set({ loading: false, isSaving: false, error: error.message });
      throw error;
    }
  },

  recalculateStatus: (grade, passingGrade) => {
    if (grade >= passingGrade) return "Valid_";
    if (grade >= passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  },

  getStudentGradeForSubject: (
    studentId,
    subjectId,
    academicYearId,
    controlType,
    session
  ) => {
    const { studentGrades } = get(); // Utiliser studentGrades plutôt que grades

    return (
      studentGrades.find(
        (grade) =>
          grade.studentId === studentId &&
          grade.subjectId === subjectId &&
          grade.academicYearId === academicYearId &&
          grade.controlType === controlType &&
          grade.session === session
      ) || null
    );
  },

  importGradesFromExcel: async (file: File): Promise<ImportResult> => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/grades/import/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success && response.data.summary?.created > 0) {
        await get().fetchGrades();
      }

      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'importation";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  downloadGradeTemplate: async (): Promise<void> => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/grades/import/template", {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template_notes.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ loading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors du téléchargement";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
