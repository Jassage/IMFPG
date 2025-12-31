/**
 * @file transcriptService.ts
 * @description Service API pour la gestion des transcripts
 */

import api from "@/services/api";
import {
  Transcript,
  CreateTranscriptData,
  UpdateTranscriptData,
  TranscriptStatistics,
  DocumentType,
  ControlType,
  TranscriptStatus,
  DocumentLanguage,
  ClassLevel,
} from "@/types/transcript";

export interface TranscriptFilters {
  search?: string;
  studentId?: string;
  academicYearId?: string;
  controlType?: ControlType;
  documentType?: DocumentType;
  status?: TranscriptStatus;
  classLevel?: ClassLevel;
  language?: DocumentLanguage;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class TranscriptService {
  // Récupérer tous les transcripts avec filtres
  async getAll(filters: TranscriptFilters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.search && { search: filters.search }),
      ...(filters.studentId && { studentId: filters.studentId }),
      ...(filters.academicYearId && { academicYearId: filters.academicYearId }),
      ...(filters.controlType && { controlType: filters.controlType }),
      ...(filters.documentType && { documentType: filters.documentType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.classLevel && { classLevel: filters.classLevel }),
      ...(filters.language && { language: filters.language }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    };

    const response = await api.get("/transcripts", { params });
    return response.data;
  }

  // Récupérer un transcript par ID
  async getById(id: string): Promise<Transcript> {
    const response = await api.get(`/transcripts/${id}`);
    return response.data.data.transcript;
  }

  // Créer un nouveau transcript
  async create(data: CreateTranscriptData): Promise<Transcript> {
    const response = await api.post("/transcripts", data);
    return response.data.data.transcript;
  }

  // Mettre à jour un transcript
  async update(id: string, data: UpdateTranscriptData): Promise<Transcript> {
    const response = await api.put(`/transcripts/${id}`, data);
    return response.data.data.transcript;
  }

  // Supprimer un transcript
  async delete(id: string): Promise<void> {
    await api.delete(`/transcripts/${id}`);
  }

  // Télécharger un transcript
  async download(id: string): Promise<Blob> {
    const response = await api.get(`/transcripts/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  }

  // Calculer les statistiques
  async calculateStatistics(data: {
    studentId: string;
    academicYearId: string;
    controlType: ControlType;
    classLevel: ClassLevel;
  }): Promise<TranscriptStatistics> {
    const response = await api.post("/transcripts/calculate-statistics", data);
    return response.data.data.statistics;
  }

  // Générer un prévisualisation (PDF)
  async preview(data: CreateTranscriptData): Promise<Blob> {
    const response = await api.post("/transcripts/preview", data, {
      responseType: "blob",
    });
    return response.data;
  }

  // Actions groupées
  async bulkDownload(ids: string[]): Promise<Blob> {
    const response = await api.post(
      "/transcripts/bulk-download",
      { ids },
      { responseType: "blob" }
    );
    return response.data;
  }

  async bulkUpdate(ids: string[], data: Partial<UpdateTranscriptData>) {
    const response = await api.patch("/transcripts/bulk-update", {
      ids,
      data,
    });
    return response.data;
  }

  async bulkDelete(ids: string[]) {
    const response = await api.delete("/transcripts/bulk-delete", {
      data: { ids },
    });
    return response.data;
  }

  // Historique des actions
  async getHistory(transcriptId: string) {
    const response = await api.get(`/transcripts/${transcriptId}/history`);
    return response.data.data.history;
  }

  // Métadonnées et statistiques globales
  async getMetadata() {
    const response = await api.get("/transcripts/metadata");
    return response.data.data;
  }
}

export const transcriptService = new TranscriptService();
