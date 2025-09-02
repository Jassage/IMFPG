import { create } from "zustand";
import { Grade, GradeWithDetails, GradeSession } from "../types/academic";

interface GradeStore {
  grades: Grade[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchGrades: (filters?: GradeFilters) => Promise<void>;
  fetchGradesByStudent: (studentId: string) => Promise<GradeWithDetails[]>;
  fetchGradesByUE: (
    ueId: string,
    academicYear?: string
  ) => Promise<GradeWithDetails[]>;
  fetchStudentGrades: (
    studentId: string,
    academicYear?: string
  ) => Promise<GradeWithDetails[]>;
  addGrade: (
    grade: Omit<Grade, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateGrade: (
    id: string,
    grade: Partial<Grade>,
    isRetake?: boolean
  ) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  bulkAddGrades: (
    grades: Omit<Grade, "id" | "createdAt" | "updatedAt">[]
  ) => Promise<void>;
  recalculateStatus: (
    grade: number,
    passingGrade?: number
  ) => "Valide" | "EnCours" | "AReprendre";
  getStudentGradeForUE: (
    studentId: string,
    ueId: string,
    academicYear: string,
    semester: string
  ) => Grade | null;
}

interface GradeFilters {
  studentId?: string;
  ueId?: string;
  academicYear?: string;
  semester?: "S1" | "S2";
  status?: Grade["status"];
}

// Fonction utilitaire pour extraire le message d'erreur
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inconnue s'est produite";
};

export const useGradeStore = create<GradeStore>((set, get) => ({
  grades: [],
  loading: false,
  error: null,

  fetchGrades: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/grades?${params}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des notes");

      const grades: Grade[] = await response.json();
      set({ grades, loading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  fetchGradesByStudent: async (studentId: string) => {
    try {
      const response = await fetch(`/api/grades/student/${studentId}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des notes");

      const grades: GradeWithDetails[] = await response.json();
      return grades;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  fetchGradesByUE: async (ueId: string, academicYear?: string) => {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append("academicYear", academicYear);

      const response = await fetch(`/api/grades/ue/${ueId}?${params}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des notes");

      const grades: GradeWithDetails[] = await response.json();
      return grades;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  fetchStudentGrades: async (studentId: string, academicYear?: string) => {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append("academicYear", academicYear);

      const response = await fetch(
        `/api/students/${studentId}/grades?${params}`
      );
      if (!response.ok) throw new Error("Erreur lors du chargement des notes");

      const grades: GradeWithDetails[] = await response.json();
      return grades;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Dans votre store (gradeStore.ts)
  addGrade: async (gradeData) => {
    set({ loading: true, error: null });
    try {
      console.log("Envoi des données au backend:", gradeData);

      const response = await fetch("/api/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur backend:", errorData);
        throw new Error(errorData.error || "Erreur lors de l'ajout de la note");
      }

      const newGrade = await response.json();
      set((state) => ({
        grades: [...state.grades, newGrade],
        loading: false,
      }));
    } catch (error) {
      console.error("Erreur complète:", error);
      set({
        error: getErrorMessage(error),
        loading: false,
      });
      throw error;
    }
  },

  updateGrade: async (id, gradeData, isRetake = false) => {
    set({ loading: true, error: null });
    try {
      // Si c'est une reprise, on change la session
      const dataToSend = isRetake
        ? { ...gradeData, session: "Rattrapage" as GradeSession }
        : gradeData;

      const response = await fetch(`/api/grades/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Erreur lors de la modification de la note"
        );
      }

      const updatedGrade: Grade = await response.json();
      set((state) => ({
        grades: state.grades.map((grade) =>
          grade.id === id ? updatedGrade : grade
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  deleteGrade: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/grades/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Erreur lors de la suppression de la note"
        );
      }

      set((state) => ({
        grades: state.grades.filter((grade) => grade.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  bulkAddGrades: async (grades) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/grades/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grades }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de l'ajout des notes");
      }

      const newGrades: Grade[] = await response.json();
      set((state) => ({
        grades: [...state.grades, ...newGrades],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  recalculateStatus: (grade, passingGrade = 10) => {
    if (grade >= passingGrade) return "Valide";
    if (grade >= passingGrade * 0.7) return "AReprendre";
    return "EnCours";
  },

  getStudentGradeForUE: (studentId, ueId, academicYearId, semester) => {
    const { grades } = get();
    return (
      grades.find(
        (grade) =>
          grade.studentId === studentId &&
          grade.ueId === ueId &&
          grade.academicYearId === academicYearId &&
          grade.semester === semester
      ) || null
    );
  },
}));
