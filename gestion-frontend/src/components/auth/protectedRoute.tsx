// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, checkAuth, initialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      // Si déjà initialisé ET authentifié, on peut passer directement
      if (initialized && isAuthenticated) {
        setIsChecking(false);
        return;
      }

      // Si déjà initialisé MAIS non authentifié, on peut aussi passer
      if (initialized && !isAuthenticated) {
        setIsChecking(false);
        return;
      }

      // Sinon, on vérifie l'authentification
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth, initialized, isAuthenticated]);

  // Afficher un loader pendant la vérification
  if (isChecking || (!initialized && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié ET initialisé, rediriger vers le login
  if (!isAuthenticated && initialized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rendre les enfants si authentifié
  return <>{children}</>;
};
