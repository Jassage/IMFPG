// src/hooks/useAuthUser.ts
import { useAuthStore } from "@/store/authStore";

export const useAuthUser = () => {
  const { user, isAuthenticated, loading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.role === "Admin",
    isDoyen: user?.role === "Parent",
    isProfesseur: user?.role === "Professeur",
    isSecretaire: user?.role === "Secretaire",
    isDirecteur: user?.role === "Directeur",
  };
};
