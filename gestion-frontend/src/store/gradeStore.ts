// store/gradeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { Grade, GradeStatus, ControlType, GradeSession } from "@/types/grade";
import { ClassLevel } from "@/types/academic";
import { UserRole } from "@/types/navigation";
import api from "@/services/api";

import {
  ControlType,
  Grade,
  GradeSession,
  GradeStatus,
} from "@/types/bulletin";
import { toast } from "react-toastify";

// Fonction helper pour afficher les toasts (ajoutez-la en dehors du store)
const showNotificationToast = (notification: Notification) => {
  const toastConfig: any = {
    description: notification.message,
    duration: 8000,
  };

  switch (notification.type) {
    case "GRADE_APPROVED":
      toast.success(notification.title, {
        ...toastConfig,
        action: {
          label: "Voir",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_SUBMITTED":
      toast.info(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_REJECTED":
      toast.error(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Corriger",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "BULK_GRADES_SUBMITTED":
      toast.warning(notification.title, {
        ...toastConfig,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;
  }
};

const handleNotificationClick = (notification: Notification) => {
  switch (notification.type) {
    case "GRADE_SUBMITTED":
    case "BULK_GRADES_SUBMITTED":
      // Rediriger vers les notes en attente
      if (typeof window !== "undefined") {
        window.open("/admin/grades?filter=submitted", "_blank");
      }
      break;

    case "GRADE_REJECTED":
      // Rediriger vers les notes rejetées
      if (typeof window !== "undefined") {
        window.open("/professor/grades?filter=rejected", "_blank");
      }
      break;

    case "GRADE_APPROVED":
      // Rediriger vers les notes approuvées
      if (typeof window !== "undefined") {
        window.open("/professor/grades?filter=approved", "_blank");
      }
      break;
  }
};

interface Notification {
  id: string;
  type:
    | "GRADE_SUBMITTED"
    | "GRADE_APPROVED"
    | "GRADE_REJECTED"
    | "BULK_GRADES_SUBMITTED";
  title: string;
  message: string;
  userId: string;
  data?: any;
  read: boolean;
  createdAt: string;
  priority?: "low" | "medium" | "high";
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCountByUser: (userId: string) => number;
  clearNotifications: (userId?: string) => void;
}

// Interfaces pour les filtres
interface GradeFilters {
  academicYearId?: string;
  classLevel?: ClassLevel | "";
  subjectId?: string;
  controlType?: ControlType | "all" | "";
  session?: GradeSession | "";
  status?: GradeStatus | "";
  studentId?: string;
  page?: number;
  limit?: number;
  search?: string;
  minGrade?: number;
  maxGrade?: number;
  includeDraft?: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface GradeStatistics {
  totalGrades: number;
  averageGrade: number;
  successRate: number;
  passedGrades: number;
  failedGrades: number;
  pendingApproval: number;
  draftGrades: number;
  publishedGrades: number;
}

// Interface pour la création de notes
interface CreateGradeData {
  studentId: string;
  subjectId: string;
  assignmentId: string;
  grade: number;
  status?: GradeStatus;
  session?: GradeSession;
  controlType?: ControlType;
  academicYearId: string;
  classLevel: ClassLevel;
  notes?: string;
  isDraft?: boolean;
}

// Interface pour l'édition de notes
interface UpdateGradeData {
  grade?: number;
  status?: GradeStatus;
  session?: GradeSession;
  controlType?: ControlType;
  notes?: string;
  isActive?: boolean;
  rejectionReason?: string;
}

// Interface pour les opérations en masse
interface BulkGradeData {
  studentId: string;
  subjectId: string;
  assignmentId?: string;
  grade: number;
  status?: GradeStatus;
  session?: GradeSession;
  controlType?: ControlType;
  classLevel?: ClassLevel;
  notes?: string;
}

// Interface pour la soumission de notes
interface SubmitGradesData {
  gradeIds: string[];
  submitAll?: boolean;
  filters?: {
    assignmentId?: string;
    controlType?: ControlType;
    classLevel?: ClassLevel;
    subjectId?: string;
  };
}

// Interface principale du store
interface GradeStore {
  // État
  grades: Grade[];
  studentGrades: Grade[];
  pendingApprovalGrades: Grade[];
  gradeStatistics: GradeStatistics | null;
  pagination: PaginationInfo | null;
  loading: boolean;
  isSaving: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Filtres persistants
  currentFilters: GradeFilters;

  // Actions
  // Gestion des filtres
  setFilters: (filters: Partial<GradeFilters>) => void;
  resetFilters: () => void;

  // Récupération de données
  fetchGrades: (
    filters?: GradeFilters,
    forceRefresh?: boolean
  ) => Promise<void>;
  fetchGradeById: (id: string) => Promise<Grade>;

  // Notes étudiant
  fetchStudentGrades: (
    studentId: string,
    filters?: Partial<GradeFilters>
  ) => Promise<Grade[]>;
  fetchPublishedStudentGrades: (
    studentId: string,
    filters?: Partial<GradeFilters>
  ) => Promise<Grade[]>;
  fetchStudentDashboardGrades: (studentId: string) => Promise<Grade[]>;

  // Notes en attente (admin)
  fetchPendingApproval: (filters?: {
    page?: number;
    limit?: number;
    submittedBy?: string;
    assignmentId?: string;
    classLevel?: ClassLevel;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<void>;

  // Statistiques
  fetchGradeStatistics: (filters?: {
    academicYearId?: string;
    classLevel?: ClassLevel;
    controlType?: ControlType;
    subjectId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<GradeStatistics>;
  fetchAdminStatistics: (filters?: {
    academicYearId?: string;
    classLevel?: ClassLevel;
    controlType?: ControlType;
    professorId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<any>;

  // CRUD des notes
  createGrade: (gradeData: CreateGradeData) => Promise<Grade>;
  createAndPublishGrade: (gradeData: CreateGradeData) => Promise<Grade>;
  updateGrade: (id: string, gradeData: UpdateGradeData) => Promise<Grade>;
  updateAndPublishGrade: (
    id: string,
    gradeData: UpdateGradeData
  ) => Promise<Grade>;
  deleteGrade: (id: string) => Promise<void>;

  // Workflow de validation
  submitGradesForApproval: (
    data: SubmitGradesData
  ) => Promise<{ count: number }>;
  approveGrades: (
    gradeIds: string[],
    publishToStudents?: boolean
  ) => Promise<{ count: number }>;
  approveAndPublishGrades: (gradeIds: string[]) => Promise<{ count: number }>;
  rejectGrades: (
    gradeIds: string[],
    reason: string
  ) => Promise<{ count: number }>;
  publishGradesToStudents: (gradeIds: string[]) => Promise<{ count: number }>;

  // Opérations en masse
  bulkImportGrades: (
    gradesData: BulkGradeData[],
    academicYearId: string,
    assignmentId?: string
  ) => Promise<{
    importedCount: number;
    errors: any[];
    totalAttempted: number;
  }>;

  // Utilitaires
  getStudentGradeForSubject: (
    studentId: string,
    subjectId: string,
    academicYearId: string,
    controlType: ControlType,
    session: GradeSession
  ) => Grade | null;

  getGradesByStudentAndSubject: (
    studentId: string,
    subjectId: string
  ) => Grade[];
  getGradesBySubject: (subjectId: string) => Grade[];
  getGradesByClass: (classId: string, academicYearId: string) => Grade[];
  getFilteredGradesByRole: (role: UserRole, userId?: string) => Grade[];
  getPendingApprovalGrades: () => Grade[];

  // Import/Export
  exportGradesToExcel: (filters?: GradeFilters) => Promise<Blob>;
  downloadGradeTemplate: () => Promise<void>;

  // Gestion de l'état
  clearError: () => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  clearStudentGrades: () => void;

  //notification
  notifications: Notification[];
  unreadCount: number;

  // Actions de notification
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCountByUser: (userId: string) => number;
  clearNotifications: (userId?: string) => void;

  // Fonctions de notification spécifiques
  notifyAdminAboutSubmittedGrade: (gradeData: {
    studentName: string;
    subjectName: string;
    gradeValue: number;
    controlType: ControlType;
    teacherId: string;
    teacherName: string;
    studentId: string;
    subjectId: string;
  }) => void;

  notifyTeacherAboutApprovedGrade: (gradeData: {
    studentName: string;
    subjectName: string;
    gradeValue: number;
    controlType: ControlType;
    gradeId: string;
    teacherId: string;
  }) => void;

  notifyTeacherAboutRejectedGrade: (gradeData: {
    studentName: string;
    subjectName: string;
    gradeValue: number;
    controlType: ControlType;
    reason: string;
    gradeId: string;
    teacherId: string;
  }) => void;

  notifyAdminAboutBulkSubmission: (data: {
    gradeCount: number;
    subjectName: string;
    teacherId: string;
    teacherName: string;
    subjectId?: string;
  }) => void;
}

// Constantes
const DEFAULT_FILTERS: GradeFilters = {
  page: 1,
  limit: 20,
  academicYearId: "",
  classLevel: "",
  subjectId: "",
  controlType: "",
  session: "",
  status: "",
  search: "",
  includeDraft: false,
};

const DEFAULT_STATISTICS: GradeStatistics = {
  totalGrades: 0,
  averageGrade: 0,
  successRate: 0,
  passedGrades: 0,
  failedGrades: 0,
  pendingApproval: 0,
  draftGrades: 0,
  publishedGrades: 0,
};

// Fonctions utilitaires
const calculateGradeStatistics = (grades: Grade[]): GradeStatistics => {
  if (grades.length === 0) return DEFAULT_STATISTICS;

  const totalGrades = grades.length;
  const totalPoints = grades.reduce((sum, grade) => sum + grade.grade, 0);
  const averageGrade = totalPoints / totalGrades;

  const passedGrades = grades.filter((g) => {
    const passingGrade = g.subject?.passingGrade || 10;
    return g.grade >= passingGrade;
  }).length;

  const successRate = (passedGrades / totalGrades) * 100;

  const pendingApproval = grades.filter(
    (g) => g.status === GradeStatus.SUBMITTED
  ).length;
  const draftGrades = grades.filter(
    (g) => g.status === GradeStatus.DRAFT
  ).length;
  const publishedGrades = grades.filter(
    (g) => g.status === GradeStatus.PUBLISHED
  ).length;

  return {
    totalGrades,
    averageGrade: parseFloat(averageGrade.toFixed(2)),
    successRate: parseFloat(successRate.toFixed(2)),
    passedGrades,
    failedGrades: totalGrades - passedGrades,
    pendingApproval,
    draftGrades,
    publishedGrades,
  };
};

// Création du store avec persistance
export const useGradeStore = create<GradeStore>()(
  persist(
    (set, get) => ({
      grades: [],
      studentGrades: [],
      pendingApprovalGrades: [],
      gradeStatistics: null,
      pagination: null,
      loading: false,
      isSaving: false,
      error: null,
      lastUpdated: null,
      currentFilters: DEFAULT_FILTERS,

      // Actions
      setFilters: (filters) => {
        set((state) => ({
          currentFilters: { ...state.currentFilters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ currentFilters: DEFAULT_FILTERS });
      },

      // Récupération des notes avec filtres
      fetchGrades: async (filters = {}, forceRefresh = false) => {
        const state = get();

        // Si déjà en cours de chargement et pas de force refresh, ne rien faire
        if (state.loading && !forceRefresh) {
          console.log("⏭️ Already loading grades, skipping");
          return;
        }

        set({ loading: true, error: null });

        try {
          // Fusionner les filtres avec les filtres actuels
          const mergedFilters = { ...state.currentFilters, ...filters };
          const params = new URLSearchParams();

          // Ajouter les paramètres aux requêtes
          Object.entries(mergedFilters).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value !== "all"
            ) {
              params.append(key, value.toString());
            }
          });

          console.log("📡 Fetching grades with filters:", mergedFilters);
          const response = await api.get(`/grades?${params}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la récupération des notes"
            );
          }

          // Extraction robuste des données
          let gradesData: Grade[] = [];
          let paginationData: PaginationInfo | null = null;
          let statisticsData: GradeStatistics | null = null;

          if (response.data.data) {
            // Cas 1: data.grades existe
            if (
              response.data.data.grades &&
              Array.isArray(response.data.data.grades)
            ) {
              gradesData = response.data.data.grades;
            }
            // Cas 2: data est directement le tableau
            else if (Array.isArray(response.data.data)) {
              gradesData = response.data.data;
            }
            // Cas 3: Extraction depuis n'importe quelle propriété tableau
            else if (typeof response.data.data === "object") {
              const arrayProperties = Object.values(response.data.data).filter(
                (val) => Array.isArray(val)
              );
              if (arrayProperties.length > 0) {
                gradesData = arrayProperties[0] as Grade[];
              }
            }

            // Extraction pagination
            if (response.data.data.pagination) {
              paginationData = response.data.data.pagination;
            } else if (response.data.pagination) {
              paginationData = response.data.pagination;
            }

            // Extraction statistiques
            if (response.data.data.statistics) {
              statisticsData = response.data.data.statistics;
            } else if (response.data.statistics) {
              statisticsData = response.data.statistics;
            } else {
              // Calculer les statistiques localement si non fournies
              statisticsData = calculateGradeStatistics(gradesData);
            }
          }

          // Mise à jour de l'état
          set({
            grades: gradesData,
            pagination: paginationData,
            gradeStatistics: statisticsData,
            loading: false,
            lastUpdated: new Date(),
            currentFilters: mergedFilters,
          });

          console.log(`✅ Loaded ${gradesData.length} grades`);
        } catch (error: any) {
          console.error("Error fetching grades:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";

          set({
            error: errorMessage,
            loading: false,
          });

          toast.error(`Erreur: ${errorMessage}`);
          throw error;
        }
      },

      // Fonction pour récupérer les notes en attente de validation (admin seulement)
      getPendingApprovalGrades: () => {
        const state = get();
        return state.grades.filter(
          (grade) => grade.status === GradeStatus.SUBMITTED
        );
      },

      fetchGradeById: async (id: string) => {
        set({ loading: true, error: null });

        try {
          const response = await api.get(`/grades/${id}`);

          if (!response.data?.success) {
            throw new Error(response.data?.message || "Note non trouvée");
          }

          const grade = response.data.data?.grade || response.data.data;

          // Mettre à jour la note dans la liste
          set((state) => ({
            grades: state.grades.map((g) =>
              g.id === id ? { ...g, ...grade } : g
            ),
            loading: false,
          }));

          return grade;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Fonction pour récupérer les notes PUBLIÉES d'un étudiant
      fetchPublishedStudentGrades: async (studentId: string, filters = {}) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();
          params.append("studentId", studentId);

          // Ajouter le statut Published par défaut
          params.append("status", GradeStatus.APPROVED);

          Object.entries(filters).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value !== "all"
            ) {
              params.append(key, value.toString());
            }
          });

          console.log(
            `📡 Fetching published grades for student ${studentId}...`
          );
          const response = await api.get(`/grades?${params}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la récupération des notes publiées"
            );
          }

          let gradesData: Grade[] = [];

          if (
            response.data.data?.grades &&
            Array.isArray(response.data.data.grades)
          ) {
            gradesData = response.data.data.grades;
          } else if (Array.isArray(response.data.data)) {
            gradesData = response.data.data;
          }

          console.log(
            `✅ Loaded ${gradesData.length} published grades for student`
          );

          set({
            studentGrades: gradesData,
            loading: false,
          });

          return gradesData;
        } catch (error: any) {
          console.error("Error fetching published student grades:", error);
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";

          // Essayer l'ancienne méthode en fallback
          try {
            console.log("🔄 Trying fallback method...");
            const fallbackResponse = await api.get(
              `/grades/student/${studentId}`
            );

            if (fallbackResponse.data?.success) {
              let fallbackGrades: Grade[] = [];

              if (
                fallbackResponse.data.data?.grades &&
                Array.isArray(fallbackResponse.data.data.grades)
              ) {
                fallbackGrades = fallbackResponse.data.data.grades;
              }

              // Filtrer pour ne garder que les notes PUBLIÉES
              const publishedGrades = fallbackGrades.filter(
                (g: any) =>
                  g.status === GradeStatus.APPROVED ||
                  g.status === GradeStatus.PUBLISHED
              );

              set({
                studentGrades: publishedGrades,
                loading: false,
              });

              return publishedGrades;
            }
          } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
          }

          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Fonction spécifique pour le dashboard étudiant
      fetchStudentDashboardGrades: async (studentId: string) => {
        set({ loading: true, error: null });

        try {
          console.log(
            `🎯 [fetchStudentDashboardGrades] Fetching for student ${studentId}`
          );

          // UTILISER L'ENDPOINT QUI FONCTIONNE (pas /grades/student/{id})
          const response = await api.get(`/grades`, {
            params: {
              studentId: studentId,
              status: "Approved", // Le statut qui fonctionne
              limit: 100,
            },
          });

          console.log(" [fetchStudentDashboardGrades] API Response:", {
            success: response.data?.success,
            hasData: !!response.data?.data,
            gradesCount: response.data?.data?.grades?.length || 0,
          });

          if (response.data?.success) {
            let gradesData: any[] = [];

            // Extraction des données - structure: { data: { grades: [...] } }
            if (
              response.data.data?.grades &&
              Array.isArray(response.data.data.grades)
            ) {
              gradesData = response.data.data.grades;
            } else if (Array.isArray(response.data.data)) {
              gradesData = response.data.data;
            }

            console.log(
              ` [fetchStudentDashboardGrades] Extracted ${gradesData.length} grades`
            );

            // Filtrer pour Approved/Published (sécurité supplémentaire)
            const visibleGrades = gradesData.filter((g: any) => {
              const status = String(g.status || "").toLowerCase();
              return status === "approved" || status === "published";
            });

            console.log(
              ` [fetchStudentDashboardGrades] ${visibleGrades.length} visible grades after filtering`
            );

            set({
              studentGrades: visibleGrades,
              loading: false,
            });

            return visibleGrades;
          }

          // Si l'API ne retourne pas success: true
          console.warn(
            "⚠️ [fetchStudentDashboardGrades] API did not return success:true"
          );
          set({
            studentGrades: [],
            loading: false,
          });

          return [];
        } catch (error: any) {
          console.error("[fetchStudentDashboardGrades] Error:", error);

          // Fallback: Essayer sans le paramètre status
          try {
            console.log(
              "🔄 [fetchStudentDashboardGrades] Trying without status filter..."
            );
            const fallbackResponse = await api.get(`/grades`, {
              params: {
                studentId: studentId,
                limit: 100,
              },
            });

            if (fallbackResponse.data?.success) {
              let fallbackGrades: any[] = [];

              if (
                fallbackResponse.data.data?.grades &&
                Array.isArray(fallbackResponse.data.data.grades)
              ) {
                fallbackGrades = fallbackResponse.data.data.grades;
              }

              // Filtrer manuellement pour Approved/Published
              const filteredGrades = fallbackGrades.filter((g: any) => {
                const status = String(g.status || "").toLowerCase();
                return status === "approved" || status === "published";
              });

              console.log(
                ` [fetchStudentDashboardGrades] Fallback loaded ${filteredGrades.length} grades`
              );

              set({
                studentGrades: filteredGrades,
                loading: false,
              });

              return filteredGrades;
            }
          } catch (fallbackError) {
            console.error(
              "[fetchStudentDashboardGrades] Fallback also failed:",
              fallbackError
            );
          }

          set({
            studentGrades: [],
            loading: false,
            error: error.message,
          });

          return [];
        }
      },

      fetchStudentGrades: async (studentId: string, filters = {}) => {
        // Utiliser la nouvelle fonction par défaut
        return get().fetchPublishedStudentGrades(studentId, filters);
      },

      fetchPendingApproval: async (filters = {}) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();

          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (value instanceof Date) {
                params.append(key, value.toISOString());
              } else {
                params.append(key, value.toString());
              }
            }
          });

          const response = await api.get(`/grades/admin/pending?${params}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la récupération des notes en attente"
            );
          }

          let pendingGrades: Grade[] = [];

          if (
            response.data.data?.grades &&
            Array.isArray(response.data.data.grades)
          ) {
            pendingGrades = response.data.data.grades;
          }

          set({
            pendingApprovalGrades: pendingGrades,
            loading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchGradeStatistics: async (filters = {}) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();

          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (value instanceof Date) {
                params.append(key, value.toISOString());
              } else {
                params.append(key, value.toString());
              }
            }
          });

          const response = await api.get(`/grades/statistics?${params}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la récupération des statistiques"
            );
          }

          const statistics =
            response.data.data?.statistics ||
            response.data.data ||
            DEFAULT_STATISTICS;

          set({
            gradeStatistics: statistics,
            loading: false,
          });

          return statistics;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          return DEFAULT_STATISTICS;
        }
      },

      fetchAdminStatistics: async (filters = {}) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();

          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (value instanceof Date) {
                params.append(key, value.toISOString());
              } else {
                params.append(key, value.toString());
              }
            }
          });

          const response = await api.get(`/grades/admin/statistics?${params}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la récupération des statistiques admin"
            );
          }

          set({ loading: false });
          return response.data.data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // CRUD Operations
      createGrade: async (gradeData: CreateGradeData) => {
        set({ isSaving: true, error: null });

        try {
          // Préparer les données pour l'API
          const dataToSend = {
            ...gradeData,
            controlType: gradeData.controlType ?? undefined,
            status: gradeData.status || GradeStatus.DRAFT,
            isDraft: gradeData.isDraft || false,
          };

          const response = await api.post("/grades", dataToSend);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de la création de la note"
            );
          }

          const newGrade = response.data.data?.grade || response.data.data;

          // Mettre à jour le store
          set((state) => ({
            grades: [newGrade, ...state.grades],
            isSaving: false,
          }));

          toast.success(response.data.message || "Note créée avec succès");
          return newGrade;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      createAndPublishGrade: async (gradeData: CreateGradeData) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.post("/grades/admin/create-publish", {
            ...gradeData,
            isDraft: false,
          });

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la création et publication"
            );
          }

          const newGrade = response.data.data?.grade || response.data.data;

          set((state) => ({
            grades: [newGrade, ...state.grades],
            isSaving: false,
          }));

          toast.success(
            response.data.message || "Note créée et publiée avec succès"
          );
          return newGrade;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      getFilteredGradesByRole: (role: UserRole, userId?: string) => {
        const state = get();
        let filteredGrades = state.grades;

        if (role === "Professeur") {
          // Pour le professeur : uniquement ses notes
          filteredGrades = filteredGrades.filter(
            (grade) => grade.submittedBy === userId
          );
        }

        return filteredGrades;
      },

      updateGrade: async (id: string, gradeData: UpdateGradeData) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.put(`/grades/${id}`, gradeData);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de la mise à jour"
            );
          }

          const updatedGrade = response.data.data?.grade || response.data.data;

          // Mettre à jour dans toutes les listes
          set((state) => ({
            grades: state.grades.map((g) =>
              g.id === id ? { ...g, ...updatedGrade } : g
            ),
            studentGrades: state.studentGrades.map((g) =>
              g.id === id ? { ...g, ...updatedGrade } : g
            ),
            pendingApprovalGrades: state.pendingApprovalGrades.map((g) =>
              g.id === id ? { ...g, ...updatedGrade } : g
            ),
            isSaving: false,
          }));

          toast.success(
            response.data.message || "Note mise à jour avec succès"
          );
          return updatedGrade;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateAndPublishGrade: async (id: string, gradeData: UpdateGradeData) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.put(
            `/grades/admin/${id}/publish`,
            gradeData
          );

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                "Erreur lors de la mise à jour et publication"
            );
          }

          const updatedGrade = response.data.data?.grade || response.data.data;

          set((state) => ({
            grades: state.grades.map((g) =>
              g.id === id ? { ...g, ...updatedGrade } : g
            ),
            studentGrades: state.studentGrades.map((g) =>
              g.id === id ? { ...g, ...updatedGrade } : g
            ),
            isSaving: false,
          }));

          toast.success(
            response.data.message || "Note mise à jour et publiée avec succès"
          );
          return updatedGrade;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteGrade: async (id: string) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.delete(`/grades/${id}`);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de la suppression"
            );
          }

          // Retirer des listes
          set((state) => ({
            grades: state.grades.filter((g) => g.id !== id),
            studentGrades: state.studentGrades.filter((g) => g.id !== id),
            pendingApprovalGrades: state.pendingApprovalGrades.filter(
              (g) => g.id !== id
            ),
            isSaving: false,
          }));

          toast.success(response.data.message || "Note supprimée avec succès");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Workflow de validation
      submitGradesForApproval: async (data: SubmitGradesData) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.post("/grades/submit", data);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de la soumission"
            );
          }

          // Mettre à jour le statut des notes soumises
          const submittedCount = response.data.data?.count || 0;
          const gradeIds = data.gradeIds || [];

          if (submittedCount > 0 && gradeIds.length > 0) {
            set((state) => ({
              grades: state.grades.map((g) =>
                gradeIds.includes(g.id)
                  ? {
                      ...g,
                      status: GradeStatus.SUBMITTED,
                      submittedAt: new Date(),
                    }
                  : g
              ),
              isSaving: false,
            }));
          }

          toast.success(
            response.data.message ||
              `${submittedCount} notes soumises pour validation`
          );
          return { count: submittedCount };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      approveGrades: async (gradeIds: string[], publishToStudents = false) => {
        set({ isSaving: true, error: null });

        try {
          const endpoint = publishToStudents
            ? "/grades/admin/approve-publish"
            : "/grades/admin/approve";

          const response = await api.post(endpoint, { gradeIds });

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de l'approbation"
            );
          }

          const approvedCount = response.data.data?.count || 0;
          const newStatus = publishToStudents
            ? GradeStatus.PUBLISHED
            : GradeStatus.APPROVED;

          const state = get();
          const approvedGrades = state.grades.filter((g) =>
            gradeIds.includes(g.id)
          );

          approvedGrades.forEach((grade) => {
            if (grade.submittedBy) {
              get().notifyTeacherAboutApprovedGrade({
                studentName:
                  `${grade.student?.firstName} ${grade.student?.lastName}` ||
                  "Étudiant",
                subjectName: grade.subject?.name || "Matière",
                gradeValue: grade.grade,
                controlType: grade.controlType as ControlType,
                gradeId: grade.id,
                teacherId: grade.submittedBy,
              });
            }
          });

          // Mettre à jour le statut des notes
          if (approvedCount > 0) {
            set((state) => ({
              grades: state.grades.map((g) =>
                gradeIds.includes(g.id)
                  ? {
                      ...g,
                      status: newStatus,
                      approvedAt: new Date(),
                      ...(publishToStudents && { publishedAt: new Date() }),
                    }
                  : g
              ),
              pendingApprovalGrades: state.pendingApprovalGrades.filter(
                (g) => !gradeIds.includes(g.id)
              ),
              isSaving: false,
            }));
          }

          toast.success(
            response.data.message || `${approvedCount} notes approuvées`
          );
          return { count: approvedCount };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      rejectGrades: async (gradeIds: string[], reason: string) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.post("/grades/admin/reject", {
            gradeIds,
            reason,
          });

          if (!response.data?.success) {
            throw new Error(response.data?.message || "Erreur lors du rejet");
          }

          const rejectedCount = response.data.data?.count || 0;
          const state = get();
          const rejectedGrades = state.grades.filter((g) =>
            gradeIds.includes(g.id)
          );

          rejectedGrades.forEach((grade) => {
            if (grade.submittedBy) {
              get().notifyTeacherAboutRejectedGrade({
                studentName:
                  `${grade.student?.firstName} ${grade.student?.lastName}` ||
                  "Étudiant",
                subjectName: grade.subject?.name || "Matière",
                gradeValue: grade.grade,
                controlType: grade.controlType as ControlType,
                reason: reason,
                gradeId: grade.id,
                teacherId: grade.submittedBy,
              });
            }
          });

          // Mettre à jour le statut des notes
          if (rejectedCount > 0) {
            set((state) => ({
              grades: state.grades.map((g) =>
                gradeIds.includes(g.id)
                  ? {
                      ...g,
                      status: GradeStatus.REJECTED,
                      rejectedAt: new Date(),
                      rejectionReason: reason,
                    }
                  : g
              ),
              pendingApprovalGrades: state.pendingApprovalGrades.filter(
                (g) => !gradeIds.includes(g.id)
              ),
              isSaving: false,
            }));
          }

          toast.success(
            response.data.message || `${rejectedCount} notes rejetées`
          );
          return { count: rejectedCount };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      approveAndPublishGrades: async (gradeIds: string[]) => {
        return get().approveGrades(gradeIds, true);
      },

      publishGradesToStudents: async (gradeIds: string[]) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.post("/grades/admin/publish", {
            gradeIds,
          });

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de la publication"
            );
          }

          const publishedCount = response.data.data?.count || 0;

          // Mettre à jour le statut des notes
          if (publishedCount > 0) {
            set((state) => ({
              grades: state.grades.map((g) =>
                gradeIds.includes(g.id)
                  ? {
                      ...g,
                      status: GradeStatus.PUBLISHED,
                      publishedAt: new Date(),
                    }
                  : g
              ),
              isSaving: false,
            }));
          }

          toast.success(
            response.data.message || `${publishedCount} notes publiées`
          );
          return { count: publishedCount };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Import en masse
      bulkImportGrades: async (
        gradesData: BulkGradeData[],
        academicYearId: string,
        assignmentId?: string
      ) => {
        set({ isSaving: true, error: null });

        try {
          const response = await api.post("/grades/bulk-import", {
            grades: gradesData,
            academicYearId,
            assignmentId,
          });

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || "Erreur lors de l'importation"
            );
          }

          const importedCount = response.data.data?.importedCount || 0;
          const errors = response.data.data?.errors || [];
          const totalAttempted = response.data.data?.totalAttempted || 0;

          if (importedCount > 0) {
            // Rafraîchir les données
            await get().fetchGrades(get().currentFilters, true);
          }

          if (errors.length > 0) {
            toast.warning(
              `${importedCount} notes importées, ${errors.length} erreurs`
            );
          } else {
            toast.success(`${importedCount} notes importées avec succès`);
          }

          set({ isSaving: false });
          return { importedCount, errors, totalAttempted };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, isSaving: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Utilitaires
      getStudentGradeForSubject: (
        studentId,
        subjectId,
        academicYearId,
        controlType,
        session
      ) => {
        const { grades } = get();
        return (
          grades.find(
            (g) =>
              g.studentId === studentId &&
              g.subjectId === subjectId &&
              g.academicYearId === academicYearId &&
              g.controlType === controlType
          ) || null
        );
      },

      getGradesByStudentAndSubject: (studentId: string, subjectId: string) => {
        const { grades } = get();
        return grades.filter(
          (g) => g.studentId === studentId && g.subjectId === subjectId
        );
      },

      getGradesBySubject: (subjectId: string) => {
        const { grades } = get();
        return grades.filter((g) => g.subjectId === subjectId);
      },

      getGradesByClass: (classId: string, academicYearId: string) => {
        const { grades } = get();
        // Note: Cette fonction nécessite que les étudiants aient une propriété classId
        return grades.filter((g) => g.academicYearId === academicYearId);
      },

      // Export/Import
      exportGradesToExcel: async (filters = {}) => {
        set({ loading: true, error: null });

        try {
          const mergedFilters = { ...get().currentFilters, ...filters };
          const params = new URLSearchParams();

          Object.entries(mergedFilters).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value !== "all"
            ) {
              params.append(key, value.toString());
            }
          });

          const response = await api.get(`/grades/export/excel?${params}`, {
            responseType: "blob",
          });

          set({ loading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      downloadGradeTemplate: async () => {
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
          toast.success("Modèle téléchargé avec succès");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Erreur réseau";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Gestion de l'état
      clearError: () => set({ error: null }),
      clearAll: () =>
        set({
          grades: [],
          studentGrades: [],
          pendingApprovalGrades: [],
          gradeStatistics: null,
          pagination: null,
          error: null,
        }),
      clearStudentGrades: () => set({ studentGrades: [] }),
      setLoading: (loading: boolean) => set({ loading }),

      // Dans la création du store, ajoutez ces propriétés initiales :
      notifications: [],
      unreadCount: 0,

      // Et ces actions :

      // Fonction utilitaire pour ajouter une notification
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        // Afficher une notification toast si l'utilisateur courant est le destinataire
        if (typeof window !== "undefined") {
          const currentUserId = localStorage.getItem("currentUserId");
          if (currentUserId === newNotification.userId) {
            showNotificationToast(newNotification);
          }
        }

        return newNotification;
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      getNotificationsByUser: (userId) => {
        return get()
          .notifications.filter((notif) => notif.userId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getUnreadCountByUser: (userId) => {
        return get().notifications.filter(
          (notif) => notif.userId === userId && !notif.read
        ).length;
      },

      clearNotifications: (userId) => {
        if (userId) {
          set((state) => ({
            notifications: state.notifications.filter(
              (notif) => notif.userId !== userId
            ),
          }));
        } else {
          set({ notifications: [], unreadCount: 0 });
        }
      },

      // Fonctions de notification spécifiques
      notifyAdminAboutSubmittedGrade: (gradeData) => {
        // ID de l'admin - à adapter selon votre système
        const adminUserId = "admin-user-id";

        get().addNotification({
          type: "GRADE_SUBMITTED",
          title: "Nouvelle note soumise",
          message: `${gradeData.teacherName} a soumis une note pour ${gradeData.studentName} en ${gradeData.subjectName}`,
          userId: adminUserId,
          data: {
            ...gradeData,
            timestamp: new Date().toISOString(),
          },
          priority: "medium",
        });
      },

      notifyTeacherAboutApprovedGrade: (gradeData) => {
        get().addNotification({
          type: "GRADE_APPROVED",
          title: "Note approuvée",
          message: `Votre note pour ${gradeData.studentName} en ${gradeData.subjectName} a été approuvée`,
          userId: gradeData.teacherId,
          data: {
            ...gradeData,
            timestamp: new Date().toISOString(),
          },
          priority: "medium",
        });
      },

      notifyTeacherAboutRejectedGrade: (gradeData) => {
        get().addNotification({
          type: "GRADE_REJECTED",
          title: "Note rejetée",
          message: `Votre note pour ${gradeData.studentName} en ${gradeData.subjectName} a été rejetée. Raison: ${gradeData.reason}`,
          userId: gradeData.teacherId,
          data: {
            ...gradeData,
            timestamp: new Date().toISOString(),
          },
          priority: "high",
        });
      },

      notifyAdminAboutBulkSubmission: (data) => {
        const adminUserId = "admin-user-id";

        get().addNotification({
          type: "BULK_GRADES_SUBMITTED",
          title: `${data.gradeCount} notes soumises`,
          message: `${data.teacherName} a soumis ${data.gradeCount} notes en ${data.subjectName} pour validation`,
          userId: adminUserId,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
          },
          priority: "high",
        });
      },
    }),
    {
      name: "grade-store",
      partialize: (state) => ({
        currentFilters: state.currentFilters,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// Hook personnalisé pour les notes étudiant
export const useStudentGrades = () => {
  const {
    studentGrades,
    loading,
    error,
    fetchStudentDashboardGrades,
    fetchPublishedStudentGrades,
    clearStudentGrades,
  } = useGradeStore();

  return {
    studentGrades,
    loading,
    error,
    fetchStudentDashboardGrades,
    fetchPublishedStudentGrades,
    clearStudentGrades,
  };
};

// Hook personnalisé pour les notes admin
export const useAdminGrades = () => {
  const {
    grades,
    pendingApprovalGrades,
    loading,
    error,
    fetchGrades,
    fetchPendingApproval,
    approveGrades,
    rejectGrades,
    publishGradesToStudents,
  } = useGradeStore();

  return {
    grades,
    pendingApprovalGrades,
    loading,
    error,
    fetchGrades,
    fetchPendingApproval,
    approveGrades,
    rejectGrades,
    publishGradesToStudents,
  };
};
