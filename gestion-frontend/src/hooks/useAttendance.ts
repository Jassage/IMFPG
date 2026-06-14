// src/hooks/useAttendance.ts

import { useState, useEffect, useCallback } from "react";

import { attendanceService } from "@/services/attendanceService";
import {
  Attendance,
  AttendanceSession,
  AttendanceFilters,
  AttendanceSessionFilters,
  ApiResponse,
  AttendanceSettings,
} from "@/types/attendance.types";
import { useToast } from "./use-toast";

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (error: any, defaultMessage: string) => {
    const message = error.response?.data?.message || defaultMessage;
    setError(message);
    toast({ description: message, variant: "destructive" });
    return { success: false, message };
  };

  // Récupérer les présences
  const fetchAttendances = useCallback(async (filters?: AttendanceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getAttendances(filters);
      return response;
    } catch (error) {
      return handleError(error, "Erreur lors du chargement des présences");
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer une présence par ID
  const fetchAttendanceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getAttendanceById(id);
      return response;
    } catch (error) {
      return handleError(error, "Erreur lors du chargement de la présence");
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une présence
  const createAttendance = useCallback(async (data: Partial<Attendance>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.createAttendance(data);
      if (response.success) {
        toast({ description: "Présence enregistrée avec succès" });
      }
      return response;
    } catch (error) {
      return handleError(
        error,
        "Erreur lors de l'enregistrement de la présence",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une présence
  const updateAttendance = useCallback(
    async (id: string, data: Partial<Attendance>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.updateAttendance(id, data);
        if (response.success) {
          toast({ description: "Présence mise à jour avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(
          error,
          "Erreur lors de la mise à jour de la présence",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Valider une présence
  const validateAttendance = useCallback(
    async (id: string, validationStatus: string, notes?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.validateAttendance(
          id,
          validationStatus,
          notes,
        );
        if (response.success) {
          toast({
            description: `Présence ${validationStatus === "VALIDATED" ? "validée" : "rejetée"} avec succès`,
          });
        }
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors de la validation");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Justifier une présence
  const justifyAttendance = useCallback(
    async (
      id: string,
      justification: string,
      justificationType: string,
      justificationDoc?: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.justifyAttendance(
          id,
          justification,
          justificationType,
          justificationDoc,
        );
        if (response.success) {
          toast({ description: "Présence justifiée avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors de la justification");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Enregistrer par scan
  const recordByScan = useCallback(
    async (
      studentCode: string,
      classId: string,
      session: string,
      date?: Date,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.recordByScan(
          studentCode,
          classId,
          session,
          date,
        );
        if (response.success) {
          toast({ description: "Présence enregistrée par scan" });
        }
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors de l'enregistrement par scan");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Récupérer les présences d'une classe
  const fetchClassAttendances = useCallback(
    async (classId: string, date: Date) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.getClassAttendances(
          classId,
          date,
        );
        return response;
      } catch (error) {
        return handleError(
          error,
          "Erreur lors du chargement des présences de la classe",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== SESSIONS ====================

  const fetchAttendanceSessions = useCallback(
    async (filters?: AttendanceSessionFilters) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.getAttendanceSessions(filters);
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors du chargement des sessions");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createAttendanceSession = useCallback(
    async (data: Partial<AttendanceSession>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.createAttendanceSession(data);
        if (response.success) {
          toast({ description: "Session créée avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors de la création de la session");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateAttendanceSession = useCallback(
    async (id: string, data: Partial<AttendanceSession>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.updateAttendanceSession(
          id,
          data,
        );
        if (response.success) {
          toast({ description: "Session mise à jour avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(
          error,
          "Erreur lors de la mise à jour de la session",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const completeAttendanceSession = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.completeAttendanceSession(id);
      if (response.success) {
        toast({ description: "Session terminée avec succès" });
      }
      return response;
    } catch (error) {
      return handleError(error, "Erreur lors de la complétion de la session");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAttendanceSession = useCallback(
    async (id: string, cancellationReason: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.cancelAttendanceSession(
          id,
          cancellationReason,
        );
        if (response.success) {
          toast({ description: "Session annulée avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(error, "Erreur lors de l'annulation de la session");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== STATISTICS ====================

  const fetchAttendanceStats = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getAttendanceStats(filters);
      return response;
    } catch (error) {
      return handleError(error, "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOverallStats = useCallback(async (academicYearId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await attendanceService.getOverallAttendanceStats(academicYearId);
      return response;
    } catch (error) {
      return handleError(
        error,
        "Erreur lors du chargement des statistiques générales",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== SETTINGS ====================

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getAttendanceSettings();
      return response;
    } catch (error) {
      return handleError(error, "Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (data: Partial<AttendanceSettings>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await attendanceService.updateAttendanceSettings(data);
        if (response.success) {
          toast({ description: "Paramètres mis à jour avec succès" });
        }
        return response;
      } catch (error) {
        return handleError(
          error,
          "Erreur lors de la mise à jour des paramètres",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    fetchAttendances,
    fetchAttendanceById,
    createAttendance,
    updateAttendance,
    validateAttendance,
    justifyAttendance,
    recordByScan,
    fetchClassAttendances,
    fetchAttendanceSessions,
    createAttendanceSession,
    updateAttendanceSession,
    completeAttendanceSession,
    cancelAttendanceSession,
    fetchAttendanceStats,
    fetchOverallStats,
    fetchSettings,
    updateSettings,
  };
};
