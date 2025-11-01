import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import {
  CourseAssignment,
  UE,
  Professeur,
  AcademicYear,
  FacultyWithLevels,
  ImportResult,
} from "../types/academic";
import { GroupedAssignments } from "@/components/professorDetails";
import {
  ExcelAssignmentRow,
  processAssignments,
  readExcelFile,
} from "@/utils/excelParser";
import * as XLSX from "xlsx";
import { useFacultyStore } from "./facultyStore";
import { useAcademicYearStore } from "./academicYearStore";
import { useProfessorStore } from "./professorStore";
import { useUEStore } from "./courseStore";

// ==================== TYPES ET INTERFACES ====================
interface CourseAssignmentState {
  assignments: CourseAssignment[];
  ues: UE[];
  professeurs: Professeur[];
  academicYears: AcademicYear[];
  faculties: FacultyWithLevels[];
  loading: boolean;
  error: string | null;

  // Méthodes principales
  fetchAssignments: (filters?: AssignmentFilters) => Promise<void>;
  fetchAssignmentsByFaculty: (
    facultyId: string,
    level: string,
    academicYearId: string,
    semester: string
  ) => Promise<CourseAssignment[]>;
  fetchUeByFacultyAndLevel: (facultyId: string, level: string) => Promise<UE[]>;
  fetchAssignmentsByProfessor: (professorId: string) => Promise<void>;

  // NOUVELLE MÉTHODE : Copie des affectations
  copyAssignments: (
    copyData: AssignmentCopyData
  ) => Promise<CopyAssignmentResult>;

  // Méthodes CRUD
  addAssignment: (
    assignment: Omit<CourseAssignment, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateAssignment: (
    id: string,
    assignment: Partial<CourseAssignment>
  ) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  // Getters
  getAssignmentById: (id: string) => CourseAssignment | undefined;
  getAssignmentsByUE: (ueId: string) => CourseAssignment[];
  getAssignmentsByProfessor: (professorId: string) => CourseAssignment[];
  groupAssignmentsByFacultyAndYear: () => GroupedAssignments;

  // Importation Excel
  importFromExcel: (file: File) => Promise<ImportResult>;
  downloadTemplate: () => Promise<void>;

  // Utilitaires
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

interface AssignmentFilters {
  facultyId?: string;
  level?: string;
  academicYearId?: string;
  semester?: string;
  professeurId?: string;
  ueId?: string;
}

// NOUVEAUX TYPES POUR LA COPIE
interface AssignmentCopyData {
  sourceFacultyId: string;
  sourceLevel: string;
  sourceAcademicYearId: string;
  sourceSemester: string;
  targetFacultyId: string;
  targetLevel: string;
  targetAcademicYearId: string;
  targetSemester: string;
  copyProfessors?: boolean;
  conflictResolution?: "skip" | "override" | "merge";
  customMappings?: Record<string, string>;
}

interface CopyAssignmentResult {
  success: boolean;
  message: string;
  summary: {
    source: {
      faculty: string;
      level: string;
      academicYear: string;
      semester: string;
      totalAssignments: number;
    };
    target: {
      faculty: string;
      level: string;
      academicYear: string;
      semester: string;
    };
    results: {
      created: number;
      updated: number;
      errors: number;
      skipped: number;
    };
  };
  details: {
    created: any[];
    errors: any[];
    skipped: any[];
  };
}

// ==================== GESTION D'ERREURS ====================
class CourseAssignmentError extends Error {
  constructor(message: string, public code: string, public context?: any) {
    super(message);
    this.name = "CourseAssignmentError";
  }
}

const handleStoreError = (error: unknown, context: string): never => {
  console.error(`Error in ${context}:`, error);

  if (error instanceof CourseAssignmentError) {
    throw error;
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Une erreur inconnue s'est produite";

  throw new CourseAssignmentError(errorMessage, "STORE_ERROR", {
    context,
    error,
  });
};

// ==================== STORE IMPLEMENTATION ====================
export const useCourseAssignmentStore = create<CourseAssignmentState>()(
  persist(
    (set, get) => ({
      assignments: [],
      ues: [],
      professeurs: [],
      academicYears: [],
      faculties: [],
      loading: false,
      error: null,

      // ==================== MÉTHODES DE RÉCUPÉRATION ====================
      fetchAssignments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
          });

          const response = await api.get(
            `/course-assignments?${queryParams.toString()}`
          );

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error ||
                "Erreur lors du chargement des affectations",
              "FETCH_ERROR",
              { response: response.data }
            );
          }

          set({
            assignments: response.data.data || [],
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur inconnue",
            loading: false,
          });
          handleStoreError(error, "fetchAssignments");
        }
      },

      fetchAssignmentsByFaculty: async (
        facultyId: string,
        level: string,
        academicYearId: string,
        semester: string
      ) => {
        set({ loading: true, error: null });
        try {
          if (!facultyId || !level || !academicYearId || !semester) {
            throw new CourseAssignmentError(
              "Paramètres manquants pour la récupération des affectations",
              "VALIDATION_ERROR",
              { facultyId, level, academicYearId, semester }
            );
          }

          console.log("🔍 Fetch assignments avec params:", {
            facultyId,
            level,
            academicYearId,
            semester,
          });

          const queryParams = new URLSearchParams({
            level,
            academicYearId,
            semester,
          }).toString();

          const response = await api.get(
            `/course-assignments/faculty/${facultyId}?${queryParams}`
          );

          console.log("✅ Réponse assignments:", response.data);

          let assignmentsData = [];

          if (response.data && Array.isArray(response.data)) {
            assignmentsData = response.data;
          } else if (
            response.data &&
            response.data.success &&
            Array.isArray(response.data.data)
          ) {
            assignmentsData = response.data.data;
          } else if (
            response.data &&
            Array.isArray(response.data.assignments)
          ) {
            assignmentsData = response.data.assignments;
          } else {
            console.warn("⚠️ Structure de réponse inattendue:", response.data);
            assignmentsData = [];
          }

          set((state) => ({
            assignments: [
              ...state.assignments.filter(
                (a) =>
                  !(
                    a.facultyId === facultyId &&
                    a.level === level &&
                    a.academicYearId === academicYearId &&
                    a.semester === semester
                  )
              ),
              ...assignmentsData,
            ],
            loading: false,
          }));

          return assignmentsData;
        } catch (error: any) {
          console.error("❌ Erreur fetchAssignmentsByFaculty:", error);

          let errorMessage = "Erreur lors du chargement des affectations";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.status === 400) {
            errorMessage = "Requête invalide - vérifiez les paramètres";
          } else if (error.response?.status === 404) {
            errorMessage = "Aucune affectation trouvée pour ces critères";
          }

          set({
            error: errorMessage,
            loading: false,
          });

          return [];
        }
      },

      // NOUVELLE MÉTHODE : COPIE DES AFFECTATIONS
      copyAssignments: async (
        copyData: AssignmentCopyData
      ): Promise<CopyAssignmentResult> => {
        set({ loading: true, error: null });
        try {
          console.log("🚀 Début de la copie des affectations:", copyData);

          // Validation des données requises
          const requiredFields = [
            "sourceFacultyId",
            "sourceLevel",
            "sourceAcademicYearId",
            "sourceSemester",
            "targetFacultyId",
            "targetLevel",
            "targetAcademicYearId",
            "targetSemester",
          ];

          const missingFields = requiredFields.filter(
            (field) => !copyData[field as keyof AssignmentCopyData]
          );
          if (missingFields.length > 0) {
            throw new CourseAssignmentError(
              `Champs manquants: ${missingFields.join(", ")}`,
              "VALIDATION_ERROR",
              { copyData, missingFields }
            );
          }

          // Validation des semestres
          if (
            !["S1", "S2"].includes(copyData.sourceSemester) ||
            !["S1", "S2"].includes(copyData.targetSemester)
          ) {
            throw new CourseAssignmentError(
              "Les semestres doivent être 'S1' ou 'S2'",
              "VALIDATION_ERROR",
              {
                sourceSemester: copyData.sourceSemester,
                targetSemester: copyData.targetSemester,
              }
            );
          }

          // Appel API pour la copie
          const response = await api.post("/course-assignments/copy", copyData);

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error || "Erreur lors de la copie des affectations",
              "COPY_ERROR",
              { response: response.data }
            );
          }

          console.log("✅ Copie réussie:", response.data);

          // Recharger les données pour refléter les changements
          await get().fetchAssignments();

          set({ loading: false });

          return response.data;
        } catch (error) {
          console.error("❌ Erreur lors de la copie:", error);

          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erreur inconnue lors de la copie des affectations";

          set({
            error: errorMessage,
            loading: false,
          });

          // Retourner un résultat d'erreur structuré
          return {
            success: false,
            message: errorMessage,
            summary: {
              source: {
                faculty: "",
                level: copyData.sourceLevel,
                academicYear: "",
                semester: copyData.sourceSemester,
                totalAssignments: 0,
              },
              target: {
                faculty: "",
                level: copyData.targetLevel,
                academicYear: "",
                semester: copyData.targetSemester,
              },
              results: {
                created: 0,
                updated: 0,
                errors: 1,
                skipped: 0,
              },
            },
            details: {
              created: [],
              errors: [{ error: errorMessage }],
              skipped: [],
            },
          };
        }
      },

      fetchUeByFacultyAndLevel: async (facultyId: string, level: string) => {
        try {
          if (!facultyId || !level) {
            throw new CourseAssignmentError(
              "facultyId et level sont requis",
              "VALIDATION_ERROR",
              { facultyId, level }
            );
          }

          const response = await api.get(
            `/ues/faculty/${facultyId}/level/${level}`
          );

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error || "Erreur lors du chargement des UEs",
              "FETCH_ERROR",
              { response: response.data }
            );
          }

          return response.data.data || [];
        } catch (error) {
          console.error("Erreur récupération UEs:", error);

          if (error instanceof CourseAssignmentError) {
            throw error;
          }

          return [];
        }
      },

      fetchAssignmentsByProfessor: async (professorId: string) => {
        set({ loading: true, error: null });
        try {
          if (!professorId) {
            throw new CourseAssignmentError(
              "ID du professeur requis",
              "VALIDATION_ERROR"
            );
          }

          const response = await api.get(
            `/professeurs/${professorId}/assignments`
          );

          console.log("📡 Réponse assignments professeur:", response);

          let assignmentsData = [];

          if (response.data && Array.isArray(response.data)) {
            assignmentsData = response.data;
          } else if (
            response.data &&
            response.data.success &&
            Array.isArray(response.data.data)
          ) {
            assignmentsData = response.data.data;
          } else if (
            response.data &&
            Array.isArray(response.data.assignments)
          ) {
            assignmentsData = response.data.assignments;
          } else {
            assignmentsData = [];
          }

          set({
            assignments: assignmentsData,
            loading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erreur lors du chargement des affectations du professeur";

          set({
            error: errorMessage,
            loading: false,
            assignments: [],
          });
        }
      },

      // ==================== MÉTHODES CRUD ====================
      addAssignment: async (assignmentData) => {
        set({ loading: true, error: null });
        try {
          if (
            !assignmentData.ueId ||
            !assignmentData.professeurId ||
            !assignmentData.facultyId ||
            !assignmentData.level ||
            !assignmentData.academicYearId ||
            !assignmentData.semester
          ) {
            throw new CourseAssignmentError(
              "Tous les champs obligatoires doivent être remplis",
              "VALIDATION_ERROR",
              { assignmentData }
            );
          }

          const response = await api.post(
            "/course-assignments",
            assignmentData
          );

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error || "Erreur lors de la création",
              "CREATE_ERROR",
              { response: response.data }
            );
          }

          set((state) => ({
            assignments: [...state.assignments, response.data.data],
            loading: false,
          }));

          await get().fetchAssignments();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur inconnue",
            loading: false,
          });
          handleStoreError(error, "addAssignment");
        }
      },

      updateAssignment: async (id, assignmentData) => {
        set({ loading: true, error: null });
        try {
          if (!id) {
            throw new CourseAssignmentError(
              "ID de l'affectation requis",
              "VALIDATION_ERROR"
            );
          }

          const response = await api.put(
            `/course-assignments/${id}`,
            assignmentData
          );

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error || "Erreur lors de la mise à jour",
              "UPDATE_ERROR",
              { response: response.data }
            );
          }

          set((state) => ({
            assignments: state.assignments.map((a) =>
              a.id === id ? { ...a, ...response.data.data } : a
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur inconnue",
            loading: false,
          });
          handleStoreError(error, "updateAssignment");
        }
      },

      groupAssignmentsByFacultyAndYear: () => {
        const { assignments } = get();

        const grouped: GroupedAssignments = {};

        assignments.forEach((assignment) => {
          const facultyName = assignment.faculty?.name || "Faculté inconnue";
          const academicYear = assignment.academicYearId || "Année inconnue";
          const semester = assignment.semester || "Semestre inconnu";

          if (!grouped[facultyName]) {
            grouped[facultyName] = {};
          }

          if (!grouped[facultyName][academicYear]) {
            grouped[facultyName][academicYear] = {};
          }

          if (!grouped[facultyName][academicYear][semester]) {
            grouped[facultyName][academicYear][semester] = [];
          }

          grouped[facultyName][academicYear][semester].push(assignment);
        });

        return grouped;
      },

      deleteAssignment: async (id) => {
        set({ loading: true, error: null });
        try {
          if (!id) {
            throw new CourseAssignmentError(
              "ID de l'affectation requis",
              "VALIDATION_ERROR"
            );
          }

          const response = await api.delete(`/course-assignments/${id}`);

          if (!response.data.success) {
            throw new CourseAssignmentError(
              response.data.error || "Erreur lors de la suppression",
              "DELETE_ERROR",
              { response: response.data }
            );
          }

          set((state) => ({
            assignments: state.assignments.filter(
              (assignment) => assignment.id !== id
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erreur inconnue",
            loading: false,
          });
          handleStoreError(error, "deleteAssignment");
        }
      },

      // ==================== IMPORTATION EXCEL ====================
      importFromExcel: async (file: File) => {
        set({ loading: true, error: null });

        try {
          const formData = new FormData();
          formData.append("file", file);

          // Utilisation de api (axios) au lieu de apiRequest
          const response = await api.post(
            "/course-assignments/import-excel",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const result = response.data;

          // Recharger les assignments si l'import a réussi
          if (result.success && result.summary?.created > 0) {
            await get().fetchAssignments();
          }

          set({ loading: false });
          return result;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Erreur lors de l'importation";

          set({
            loading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      downloadTemplate: async () => {
        set({ loading: true, error: null });

        try {
          // Utilisation de api (axios) avec responseType: 'blob'
          const response = await api.get(
            "/course-assignments/download-template",
            {
              responseType: "blob",
            }
          );

          // Créer un blob et télécharger le fichier
          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "template_affectations.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          set({ loading: false });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Erreur lors du téléchargement du template";

          set({
            loading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      // ==================== GETTERS ====================
      getAssignmentById: (id) => {
        const { assignments } = get();
        return assignments.find((a) => a.id === id);
      },

      getAssignmentsByUE: (ueId) => {
        const { assignments } = get();
        return assignments.filter((a) => a.ueId === ueId);
      },

      getAssignmentsByProfessor: (professorId) => {
        const { assignments } = get();
        return assignments.filter((a) => a.professeurId === professorId);
      },

      // ==================== UTILITAIRES ====================
      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "course-assignment-storage",
      partialize: (state) => ({
        assignments: state.assignments,
        ues: state.ues,
        professeurs: state.professeurs,
        academicYears: state.academicYears,
        faculties: state.faculties,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            faculties: [],
          };
        }
        return persistedState;
      },
    }
  )
);

// ==================== INITIALISATION ====================
export const initializeCourseAssignmentStore = async () => {
  try {
    const store = useCourseAssignmentStore.getState();
    store.setLoading(true);

    await Promise.allSettled([
      store
        .fetchAssignments()
        .catch((error) =>
          console.error("Erreur chargement affectations:", error)
        ),
    ]);

    store.setLoading(false);
  } catch (error) {
    console.error("Erreur initialisation store:", error);
    useCourseAssignmentStore.getState().setLoading(false);
  }
};
