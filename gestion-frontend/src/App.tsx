import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingScreen } from "./components/LoadingScreen";
import { useDataContext } from "./contexts/DataContext";
import Index from "./pages/Index";
import { SettingsPage } from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/protectedRoute";
import { AppInitializer } from "./components/AppInitializer";
import { LoginPage } from "./components/login";
import { initializeAuth } from "./store/authStore";
import { ProfessorDetails } from "./components/professorDetails";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading, error } = useDataContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <LoadingScreen message={`Erreur: ${error}`} />;
  }

  return (
    <SidebarProvider forceOpen={true}>
      <div className="min-h-screen flex w-full">
        <Routes>
          {/* Route publique - Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professeurs/:id"
            element={
              <ProtectedRoute>
                <ProfessorDetails />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/" replace />} />

          {/* Route 404 - Doit être la dernière */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  initializeAuth(),
  (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppInitializer>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  )
);

export default App;
