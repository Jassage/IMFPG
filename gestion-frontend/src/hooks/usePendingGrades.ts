// hooks/usePendingGrades.ts
import { useEffect, useState, useCallback } from "react";
import { useGradeStore } from "@/store/gradeStore";
import { Grade } from "@/types/bulletin";
import { useAuthStore } from "@/store/authStore";

export const usePendingGrades = () => {
  const [pendingGrades, setPendingGrades] = useState<Grade[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const {
    fetchPendingApproval,
    pendingApprovalGrades,
    approveGrades,
    rejectGrades,
    fetchGrades,
  } = useGradeStore();

  const isAdmin = user?.role === "Admin";
  const isProfessor = user?.role === "Professeur";

  const refetch = useCallback(async () => {
    if (!isAdmin && !isProfessor) return;

    setLoading(true);
    try {
      await fetchPendingApproval({
        limit: 50, // Limite pour les notifications
        submittedBy: isProfessor ? user.id : undefined,
      });
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isProfessor, user?.id, fetchPendingApproval]);

  useEffect(() => {
    if (isAdmin || isProfessor) {
      refetch();
    }
  }, [refetch, isAdmin, isProfessor]);

  // Observer les changements dans le store
  useEffect(() => {
    setPendingGrades(pendingApprovalGrades);
    setPendingCount(pendingApprovalGrades.length);
  }, [pendingApprovalGrades]);

  // Fonctions d'approbation directe
  const approveGradeDirectly = async (gradeId: string) => {
    try {
      await approveGrades([gradeId], false); // false = ne pas publier directement
      return true;
    } catch (err) {
      console.error("Erreur d'approbation:", err);
      throw err;
    }
  };

  const approveMultipleGrades = async (gradeIds: string[]) => {
    try {
      const result = await approveGrades(gradeIds, false);
      return result.count;
    } catch (err) {
      console.error("Erreur d'approbation multiple:", err);
      throw err;
    }
  };

  const rejectGradeDirectly = async (gradeId: string, reason: string) => {
    try {
      await rejectGrades([gradeId], reason);
      return true;
    } catch (err) {
      console.error("Erreur de rejet:", err);
      throw err;
    }
  };

  const rejectMultipleGrades = async (gradeIds: string[], reason: string) => {
    try {
      const result = await rejectGrades(gradeIds, reason);
      return result.count;
    } catch (err) {
      console.error("Erreur de rejet multiple:", err);
      throw err;
    }
  };

  return {
    pendingGrades,
    pendingCount,
    loading,
    error,
    refetch,
    approveGradeDirectly,
    approveMultipleGrades,
    rejectGradeDirectly,
    rejectMultipleGrades,
    isAdmin,
    isProfessor,
  };
};
