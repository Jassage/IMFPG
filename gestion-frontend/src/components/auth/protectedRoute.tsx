// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, getCurrentUser } = useAuthStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Éviter les vérifications inutiles
      if (isAuthenticated || loading) return;

      const token = localStorage.getItem("token");
      if (token && !isAuthenticated) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("Erreur de vérification auth:", error);
        }
      }

      if (isMounted) {
        setHasCheckedAuth(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loading, getCurrentUser]); // Dépendances correctes

  // Afficher un loader pendant la vérification initiale
  if (
    loading ||
    (!isAuthenticated && localStorage.getItem("token") && !hasCheckedAuth)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rendre les enfants si authentifié
  return <>{children}</>;
};
