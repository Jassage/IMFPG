// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLockStore } from "@/store/lockStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, checkAuth, initialized } = useAuthStore();
  const { isLocked, isSessionExpired, clear, lockedByInactivity } =
    useLockStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  // Routes qui ne devraient pas être affectées par le verrouillage
  const UNLOCKABLE_ROUTES = [
    "/login",
    "/lock",
    "/forgot-password",
    "/reset-password",
    "/register",
  ];

  useEffect(() => {
    const verifyAuth = async () => {
      // Si l'utilisateur est sur une route de déverrouillage, on ne vérifie pas l'auth
      if (UNLOCKABLE_ROUTES.includes(location.pathname)) {
        setIsChecking(false);
        return;
      }

      // Vérifier si la session verrouillée a expiré (trop longue)
      if (isSessionExpired()) {
        clear(); // Nettoyer l'état de verrouillage
        setIsChecking(false);
        return;
      }

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
  }, [
    checkAuth,
    initialized,
    isAuthenticated,
    location.pathname,
    isSessionExpired,
    clear,
  ]);

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

  // --- Logique de routage ---

  // 1. Si sur la page de déverrouillage mais pas verrouillé ET authentifié
  if (location.pathname === "/lock" && !isLocked && isAuthenticated) {
    const from = location.state?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  // 2. Si sur la page de déverrouillage mais non authentifié
  if (location.pathname === "/lock" && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si l'application est verrouillée ET on n'est pas sur la page de déverrouillage
  if (isLocked && location.pathname !== "/lock" && isAuthenticated) {
    return (
      <Navigate
        to="/lock"
        state={{
          from: location,
          reason: lockedByInactivity ? "inactivity" : "manual",
        }}
        replace
      />
    );
  }

  // 4. Si non authentifié ET sur une route protégée (sauf routes de déverrouillage)
  if (
    !isAuthenticated &&
    requireAuth &&
    !UNLOCKABLE_ROUTES.includes(location.pathname)
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 5. Si authentifié ET sur la page de login, rediriger vers le dashboard
  if (location.pathname === "/login" && isAuthenticated && !isLocked) {
    const from = location.state?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  // Rendre les enfants dans tous les autres cas
  return <>{children}</>;
};

// Composant pour protéger les routes d'admin spécifiquement
export const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Vérifier si l'utilisateur a le rôle admin
  const isAdmin = user?.role === "Admin";

  if (!isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          message:
            "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        }}
        replace
      />
    );
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

// Composant pour les routes publiques
export const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Si l'utilisateur est déjà authentifié, rediriger vers le dashboard
  // Sauf pour certaines routes comme /lock
  if (
    isAuthenticated &&
    !["/lock", "/unauthorized"].includes(location.pathname)
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
