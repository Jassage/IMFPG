// src/services/attendanceService.ts

import axios from "axios";
import {
  Attendance,
  AttendanceSession,
  AttendanceStats,
  AttendanceFilters,
  AttendanceSessionFilters,
  AttendanceSettings,
  ApiResponse,
  PaginatedResponse,
} from "../types/attendance.types";
import { Student } from "@/types/student";
import api from "./api";

class AttendanceService {
  private baseUrl = "/attendance";

  // ==================== ATTENDANCES ====================

  async getAttendances(
    filters?: AttendanceFilters,
  ): Promise<ApiResponse<PaginatedResponse<Attendance>>> {
    const response = await api.get(`${this.baseUrl}`, { params: filters });
    return response.data;
  }

  async getAttendanceById(
    id: string,
  ): Promise<ApiResponse<{ attendance: Attendance }>> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createAttendance(
    data: Partial<Attendance>,
  ): Promise<ApiResponse<{ attendance: Attendance }>> {
    const response = await api.post(`${this.baseUrl}`, data);
    return response.data;
  }

  async updateAttendance(
    id: string,
    data: Partial<Attendance>,
  ): Promise<ApiResponse<{ attendance: Attendance }>> {
    const response = await api.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async validateAttendance(
    id: string,
    validationStatus: string,
    notes?: string,
  ): Promise<ApiResponse<{ attendance: Attendance }>> {
    const response = await api.put(`${this.baseUrl}/${id}/validate`, {
      validationStatus,
      notes,
    });
    return response.data;
  }

  async justifyAttendance(
    id: string,
    justification: string,
    justificationType: string,
    justificationDoc?: string,
  ): Promise<ApiResponse<{ attendance: Attendance }>> {
    const response = await api.patch(`${this.baseUrl}/${id}/justify`, {
      justification,
      justificationType,
      justificationDoc,
    });
    return response.data;
  }

  async recordByScan(
    studentCode: string,
    classId: string,
    session: string,
    date?: Date,
  ): Promise<
    ApiResponse<{
      attendance: Attendance;
      student: { name: string; code: string };
    }>
  > {
    const response = await api.post(`${this.baseUrl}/scan`, {
      studentCode,
      classId,
      session,
      date,
    });
    return response.data;
  }

  async getClassAttendances(
    classId: string,
    date: Date,
  ): Promise<
    ApiResponse<{
      date: Date;
      totalStudents: number;
      presentCount: number;
      absentCount: number;
      lateCount: number;
      attendances: Array<Student & { attendance: Attendance | null }>;
    }>
  > {
    const response = await api.get(`${this.baseUrl}/class/${classId}`, {
      params: { date: date.toISOString() },
    });
    return response.data;
  }

  // ==================== SESSIONS ====================

  async getAttendanceSessions(
    filters?: AttendanceSessionFilters,
  ): Promise<ApiResponse<PaginatedResponse<AttendanceSession>>> {
    const response = await api.get(`${this.baseUrl}/sessions`, {
      params: filters,
    });
    return response.data;
  }

  async createAttendanceSession(
    data: Partial<AttendanceSession>,
  ): Promise<ApiResponse<{ session: AttendanceSession }>> {
    const response = await api.post(`${this.baseUrl}/sessions`, data);
    return response.data;
  }

  async updateAttendanceSession(
    id: string,
    data: Partial<AttendanceSession>,
  ): Promise<ApiResponse<{ session: AttendanceSession }>> {
    const response = await api.put(`${this.baseUrl}/sessions/${id}`, data);
    return response.data;
  }

  async completeAttendanceSession(
    id: string,
  ): Promise<ApiResponse<{ session: AttendanceSession }>> {
    const response = await api.patch(`${this.baseUrl}/sessions/${id}/complete`);
    return response.data;
  }

  async cancelAttendanceSession(
    id: string,
    cancellationReason: string,
  ): Promise<ApiResponse<{ session: AttendanceSession }>> {
    const response = await api.patch(`${this.baseUrl}/sessions/${id}/cancel`, {
      cancellationReason,
    });
    return response.data;
  }

  async getSessionAttendances(
    sessionId: string,
  ): Promise<
    ApiResponse<{ session: AttendanceSession; attendances: Attendance[] }>
  > {
    const response = await api.get(
      `${this.baseUrl}/sessions/${sessionId}/attendances`,
    );
    return response.data;
  }

  // ==================== APPEL PAR SÉANCE (PROFESSEUR) ====================

  // Ouvre (ou récupère) la séance d'un cours pour faire l'appel
  async openSession(data: {
    classId: string;
    subjectId: string;
    professeurId: string;
    academicYearId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic?: string;
  }): Promise<ApiResponse<{ session: any; created: boolean }>> {
    const response = await api.post(`${this.baseUrl}/sessions/open`, data);
    return response.data;
  }

  // Récupère la liste d'élèves d'une séance avec leur statut
  async getSessionRoster(
    sessionId: string,
  ): Promise<
    ApiResponse<{ session: any; totalStudents: number; roster: any[] }>
  > {
    const response = await api.get(
      `${this.baseUrl}/sessions/${sessionId}/roster`,
    );
    return response.data;
  }

  // Enregistre l'appel d'une séance (statut définitif)
  async saveSessionAttendance(
    sessionId: string,
    entries: Array<{ studentId: string; status: string; notes?: string }>,
  ): Promise<ApiResponse<{ count: number }>> {
    const response = await api.post(
      `${this.baseUrl}/sessions/${sessionId}/records`,
      { entries },
    );
    return response.data;
  }

  // ==================== STATISTICS ====================

  async getAttendanceStats(filters?: {
    studentId?: string;
    classId?: string;
    academicYearId?: string;
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ stats: any }>> {
    const response = await api.get(`${this.baseUrl}/stats`, {
      params: filters,
    });
    return response.data;
  }

  async getOverallAttendanceStats(
    academicYearId?: string,
  ): Promise<ApiResponse<any>> {
    const response = await api.get(`${this.baseUrl}/overall-stats`, {
      params: { academicYearId },
    });
    return response.data;
  }

  // ==================== SETTINGS ====================

  async getAttendanceSettings(): Promise<
    ApiResponse<{ settings: AttendanceSettings }>
  > {
    const response = await api.get(`${this.baseUrl}/settings`);
    return response.data;
  }

  async updateAttendanceSettings(
    data: Partial<AttendanceSettings>,
  ): Promise<ApiResponse<{ settings: AttendanceSettings }>> {
    const response = await api.put(`${this.baseUrl}/settings`, data);
    return response.data;
  }
}

export const attendanceService = new AttendanceService();
