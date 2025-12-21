import React, { useEffect, useState, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingScreen } from "./components/LoadingScreen";
import { useDataContext } from "./contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppInitializer } from "./components/AppInitializer";
import { initializeAuthStore, useAuthStore } from "./store/authStore";
import { useEnrollmentStore } from "./store/enrollmentStore";
import { useAcademicYearStore } from "./store/academicYearStore";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { ForgotPassword } from "./components/ForgotPassword";
import { LoginPage } from "./components/login";
import { useBackupStore } from "./store/backupStore";
import { UnauthorizedPage } from "./components/UnauthorizedPage";
import { SettingsPage } from "./pages/SettingsPage";
import useStudentStore from "./store/studentStore";
import { ForcePasswordChange } from "./components/auth/ForcePasswordChange";

const queryClient = new QueryClient();

// Composant pour les routes protégées par rôle
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading } = useDataContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Composant pour rediriger vers le dashboard approprié
const RoleBasedRedirect = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "Admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "Secretaire":
      return <Navigate to="/secretary/dashboard" replace />;
    case "Parent":
      return <Navigate to="/parent/dashboard" replace />;
    case "Student":
      return <Navigate to="/student/dashboard" replace />;
    case "Professeur":
      return <Navigate to="/professor/dashboard" replace />;
    case "Directeur":
      return <Navigate to="/director/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppContent = () => {
  const { isLoading, error } = useDataContext();
  const { isAuthenticated, loading: authLoading, user } = useAuthStore();

  if (authLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider forceOpen={true}>
      <div className="min-h-screen flex w-full">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Route racine - redirection selon le rôle */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <RoleBasedRedirect />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Routes ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Routes SECRETAIRE */}
          <Route
            path="/secretary/*"
            element={
              <ProtectedRoute allowedRoles={["Secretaire"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Routes PARENT */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute allowedRoles={["Parent"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Routes STUDENT */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Routes PROFESSEUR */}
          <Route
            path="/professor/*"
            element={
              <ProtectedRoute allowedRoles={["Professeur"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Routes DIRECTION */}
          <Route
            path="/director/*"
            element={
              <ProtectedRoute allowedRoles={["Directeur"]}>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Dashboards spécifiques par rôle */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretary/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Secretaire"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Parent"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Professeur"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Directeur"]}>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professeurs/:id"
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Secretaire", "Directeur"]}
              >
                <Index />
              </ProtectedRoute>
            }
          />

          <Route
            path="/force-password-change"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Secretaire",
                  "Parent",
                  "Student",
                  "Professeur",
                  "Directeur",
                ]}
              >
                <ForcePasswordChange />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Secretaire",
                  "Parent",
                  "Student",
                  "Professeur",
                  "Directeur",
                ]}
              >
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

const cleanupAuth = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    localStorage.removeItem("userData");
  }
};

const App = () => {
  const [initializationState, setInitializationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  );
  const { user, requiresPasswordChange, checkPasswordChangeRequired } =
    useAuthStore();
  const [checkingPassword, setCheckingPassword] = useState(true);
  const initializationRef = useRef(false);

  // DÉPLACER useNavigate ICI, à l'intérieur du composant
  const navigate = useNavigate();

  // Initialisation des stores
  useEffect(() => {
    // Éviter les initialisations multiples
    if (initializationRef.current) return;
    initializationRef.current = true;

    cleanupAuth();

    const initializeStores = async () => {
      try {
        setInitializationState("loading");
        console.log("🚀 Initialisation de l'application...");

        // 1. Initialiser l'auth UNE SEULE FOIS
        await initializeAuthStore();

        // 2. Vérifier l'authentification
        const { isAuthenticated, token, user } = useAuthStore.getState();

        if (isAuthenticated && token && user) {
          // Charger les données de base pour tous les rôles
          const baseLoaders = [
            useAcademicYearStore
              .getState()
              .fetchAcademicYears()
              .catch((err) => console.warn("Erreur années académiques:", err)),
            useBackupStore
              .getState()
              .loadBackups()
              .catch((err) => console.warn("Erreur sauvegardes:", err)),
          ];

          // Chargement supplémentaire selon le rôle
          switch (user.role) {
            case "Admin":
              await Promise.all([
                ...baseLoaders,
                useEnrollmentStore
                  .getState()
                  .fetchEnrollments()
                  .catch((err) => console.warn("Erreur inscriptions:", err)),
                useStudentStore
                  .getState()
                  .fetchStudents()
                  .catch((err) => console.warn("Erreur étudiants:", err)),
              ]);
              break;

            case "Secretaire":
              await Promise.all([
                ...baseLoaders,
                useEnrollmentStore
                  .getState()
                  .fetchEnrollments()
                  .catch((err) => console.warn("Erreur inscriptions:", err)),
                useStudentStore
                  .getState()
                  .fetchStudents()
                  .catch((err) => console.warn("Erreur étudiants:", err)),
              ]);
              break;

            case "Directeur":
              await Promise.all([
                ...baseLoaders,
                useStudentStore
                  .getState()
                  .fetchStudents()
                  .catch((err) => console.warn("Erreur étudiants:", err)),
              ]);
              break;
          }
        } else {
          console.log(
            " Utilisateur non authentifié, chargement des données différé"
          );
        }

        console.log(" Initialisation terminée");
        setInitializationState("success");
      } catch (error: any) {
        console.error(" Erreur lors de l'initialisation:", error);
        setInitializationError(error.message);
        setInitializationState("error");
      }
    };

    initializeStores();
  }, []);

  useEffect(() => {
    if (user) {
      checkPasswordChangeRequired().finally(() => {
        setCheckingPassword(false);
      });
    } else {
      setCheckingPassword(false);
    }
  }, [user]);

  // Utiliser navigate pour rediriger si nécessaire
  useEffect(() => {
    if (!checkingPassword && user && requiresPasswordChange) {
      navigate("/force-password-change");
    }
  }, [checkingPassword, user, requiresPasswordChange, navigate]);

  if (checkingPassword) {
    return <div>Chargement...</div>;
  }

  // Afficher l'écran de chargement pendant l'initialisation
  if (initializationState === "loading" || initializationState === "idle") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoadingScreen />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Afficher une erreur si l'initialisation a échoué
  if (initializationState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="text-destructive text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Erreur de connexion
          </h1>
          <p className="text-muted-foreground mb-4">
            Impossible de se connecter au serveur. Vérifiez que le backend est
            démarré.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Erreur: {initializationError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster title={""} description={""} variant={""} />
        <Sonner />
        <AppInitializer>
          <AppContent />
        </AppInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Créer un composant wrapper avec BrowserRouter
const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
