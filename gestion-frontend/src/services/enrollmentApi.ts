// src/api/enrollmentApi.ts
// import { api } from "./config";
import {
  Enrollment,
  CreateEnrollmentData,
  ReenrollmentData,
  PromotionValidationResult,
  StudentReportCard,
  ApiResponse,
  EnrollmentFilters,
} from "@/types/enroll";
import api from "./api";

export const enrollmentApi = {
  // Récupérer les inscriptions
  getEnrollments: async (filters: EnrollmentFilters): Promise<ApiResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/enrollment?${params}`);
    return response.data;
  },

  // Récupérer une inscription par ID
  getEnrollmentById: async (
    id: string
  ): Promise<ApiResponse<{ enrollment: Enrollment }>> => {
    const response = await api.get(`/enrollment/${id}`);
    return response.data;
  },

  // Créer une inscription
  createEnrollment: async (
    data: CreateEnrollmentData
  ): Promise<ApiResponse> => {
    const response = await api.post("/enrollment", data);
    return response.data;
  },

  // Mettre à jour une inscription
  updateEnrollment: async (
    id: string,
    data: Partial<CreateEnrollmentData>
  ): Promise<ApiResponse> => {
    const response = await api.put(`/enrollment/${id}`, data);
    return response.data;
  },

  // Désinscrire un étudiant
  unenrollStudent: async (id: string, reason: string): Promise<ApiResponse> => {
    const response = await api.put(`/enrollment/${id}/unenroll`, { reason });
    return response.data;
  },

  // Réinscrire un étudiant
  reenrollStudent: async (data: ReenrollmentData): Promise<ApiResponse> => {
    const response = await api.post("/enrollment/reenroll", data);
    return response.data;
  },

  // Vérifier l'éligibilité à la promotion
  checkPromotionEligibility: async (
    studentId: string,
    targetClassId: string
  ): Promise<ApiResponse<PromotionValidationResult>> => {
    const response = await api.post("/enrollment/check-promotion", {
      studentId,
      targetClassId,
    });
    return response.data;
  },

  // Récupérer les inscriptions d'un étudiant
  getStudentEnrollments: async (studentId: string): Promise<ApiResponse> => {
    const response = await api.get(`/enrollment/student/${studentId}`);
    return response.data;
  },

  // Récupérer l'historique des inscriptions
  getEnrollmentHistory: async (studentId: string): Promise<ApiResponse> => {
    const response = await api.get(`/enrollment/history/${studentId}`);
    return response.data;
  },

  // Récupérer les statistiques
  getEnrollmentStats: async (academicYearId?: string): Promise<ApiResponse> => {
    const url = academicYearId
      ? `/enrollment/stats?academicYearId=${academicYearId}`
      : "/enrollment/stats";
    const response = await api.get(url);
    return response.data;
  },

  // Récupérer le bulletin d'un étudiant
  getStudentReportCard: async (
    studentId: string,
    academicYearId: string
  ): Promise<ApiResponse<StudentReportCard>> => {
    const response = await api.get(
      `/enrollment/report-card/${studentId}/${academicYearId}`
    );
    return response.data;
  },

  // Récupérer les statistiques de classe
  getClassStatistics: async (
    classId: string,
    academicYearId: string
  ): Promise<ApiResponse> => {
    const response = await api.get(
      `/enrollment/class-stats/${classId}/${academicYearId}`
    );
    return response.data;
  },

  // Générer un rapport de fin d'année
  generateYearEndReport: async (
    classId: string,
    academicYearId: string
  ): Promise<ApiResponse> => {
    const response = await api.get(
      `/enrollment/year-end-report/${classId}/${academicYearId}`
    );
    return response.data;
  },

  // Inscriptions en masse
  createBulkEnrollments: async (enrollments: any[]): Promise<ApiResponse> => {
    const response = await api.post("/enrollment/bulk", { enrollments });
    return response.data;
  },
};
