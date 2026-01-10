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
import { useEnrollmentStore } from "./store/enrollmentStore";
import { useAcademicYearStore } from "./store/academicYearStore";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { ForgotPassword } from "./components/ForgotPassword";
import { useBackupStore } from "./store/backupStore";
import { UnauthorizedPage } from "./components/UnauthorizedPage";
import { SettingsPage } from "./pages/SettingsPage";
import useStudentStore from "./store/studentStore";
import { ForcePasswordChange } from "./components/auth/ForcePasswordChange";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "./store/authStore";
import { LoginPage } from "./components/login";

// IMPORT DES COMPOSANTS D'AIDE
import { HelpProvider } from "./help-section/context/HelpContext";
import { HelpDashboard } from "./help-section/components/HelpDashboard";
import { HelpLauncher } from "./help-section/HelpLauncher";
import LockPage from "./pages/LockPage";
import { useAutoLock } from "./hooks/useAutoLock";
import { DataInitializer } from "./components/DataInitializer";

const queryClient = new QueryClient();
// Ajoutez ceci à votre App.tsx pour le mode capture
// Cela masque les données sensibles pendant les captures
const isScreenshotMode = window.location.search.includes("screenshot-mode");
// Dans ton App.tsx ou un composant utilitaire
export const enableScreenshotMode = () => {
  // Mode pour faciliter les captures
  if (typeof window !== "undefined") {
    // Ajouter des data-testid aux éléments importants
    document
      .querySelectorAll("nav button, aside button")
      .forEach((btn, index) => {
        const text = btn.textContent?.toLowerCase() || "";
        if (text.includes("dashboard"))
          btn.setAttribute("data-testid", "dashboard");
        if (text.includes("élève") || text.includes("student"))
          btn.setAttribute("data-testid", "students");
        if (text.includes("professeur"))
          btn.setAttribute("data-testid", "professeurs");
        if (text.includes("note") || text.includes("grade"))
          btn.setAttribute("data-testid", "grades");
        if (text.includes("classe")) btn.setAttribute("data-testid", "classes");
        // etc...
      });

    // Désactiver les animations
    document.body.style.setProperty("--animate-duration", "0s");

    // Charger des données de démo si nécessaire
    if (window.location.search.includes("demo")) {
      // Charger des données fictives
    }
  }
};

// Appeler cette fonction au chargement en mode capture
if (window.location.search.includes("screenshot")) {
  enableScreenshotMode();
}
if (isScreenshotMode) {
  // Masquer les données personnelles
  document.querySelectorAll("[data-sensitive]").forEach((el) => {
    el.textContent = "***";
  });

  // Charger des données de démo
  localStorage.setItem("demo-mode", "true");
}
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
    case "Student":
      return <Navigate to="/student/dashboard" replace />;
    case "Professeur":
      return <Navigate to="/professor/dashboard" replace />;
    case "Directeur":
      return <Navigate to="/director/dashboard" replace />;
    case "Comptable":
      return <Navigate to="/comptable/dashboard" replace />;
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
    // AJOUT DU HELPPROVIDER ICI
    <HelpProvider defaultRole={user?.role || "Admin"}>
      <SidebarProvider forceOpen={true}>
        <div className="min-h-screen flex w-full">
          {/* AJOUT DU HELP LAUNCHER ICI - accessible partout */}
          <HelpLauncher />
          <HelpDashboard />

          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/lock" element={<LockPage />} />

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

            {/* Routes COMPTABLE */}
            <Route
              path="/comptable/*"
              element={
                <ProtectedRoute allowedRoles={["Comptable"]}>
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
              path="/comptable/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Comptable"]}>
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
                  allowedRoles={[
                    "Admin",
                    "Secretaire",
                    "Directeur",
                    "Professeur",
                  ]}
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
                    "Comptable",
                    "Student",
                    "Professeur",
                    "Directeur",
                  ]}
                >
                  <ForcePasswordChange />
                </ProtectedRoute>
              }
            />

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </SidebarProvider>
    </HelpProvider>
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

  const navigate = useNavigate();

  useAutoLock();
  <DataInitializer />;
  // Initialisation des stores
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    cleanupAuth();

    const initializeStores = async () => {
      try {
        setInitializationState("loading");
        console.log("🚀 Initialisation de l'application...");

        const { isAuthenticated, token, user } = useAuthStore.getState();

        if (isAuthenticated && token && user) {
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
            "Utilisateur non authentifié, chargement des données différé"
          );
        }

        console.log("Initialisation terminée");
        setInitializationState("success");
      } catch (error: any) {
        console.error("Erreur lors de l'initialisation:", error);
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

  useEffect(() => {
    if (!checkingPassword && user && requiresPasswordChange) {
      navigate("/force-password-change");
    }
  }, [checkingPassword, user, requiresPasswordChange, navigate]);

  if (checkingPassword) {
    return <div>Chargement...</div>;
  }

  if (initializationState === "loading" || initializationState === "idle") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoadingScreen />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default AppWrapper;
