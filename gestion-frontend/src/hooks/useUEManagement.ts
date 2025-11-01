import { useAuthStore } from "@/store/authStore";
import { useUEStore } from "@/store/courseStore";
import { useEffect } from "react";

// Hook personnalisé pour la gestion des UEs
const useUEManagement = () => {
  const {
    ues,
    pagination,
    loading,
    error,
    filters,
    fetchUEs,
    setPage,
    setItemsPerPage,
    setFilters,
    clearFilters,
    createUE,
    updateUE,
    deleteUE,
    addPrerequisite,
    removePrerequisite,
    fetchUEById,
    searchUEs,
    getUEStats,
  } = useUEStore();

  const { user, isAuthenticated } = useAuthStore();

  // Chargement initial
  useEffect(() => {
    fetchUEs();
  }, [fetchUEs]);

  // Statistiques calculées côté client (pour l'UI)
  //   const stats = useStats(ues);

  return {
    // Données
    ues,
    pagination,
    loading,
    error,
    filters,
    // stats,

    // Actions de pagination
    fetchUEs,
    setPage,
    setItemsPerPage,
    setFilters,
    clearFilters,

    // Actions CRUD
    createUE,
    updateUE,
    deleteUE,
    addPrerequisite,
    removePrerequisite,
    fetchUEById,
    searchUEs,
    getUEStats,

    // Auth
    user,
    isAuthenticated,
  };
};
