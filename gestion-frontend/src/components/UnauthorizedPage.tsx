import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export const UnauthorizedPage = () => {
  const { user } = useAuthStore();

  const getRoleDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "Admin":
        return "/admin/dashboard";
      case "Secretaire":
        return "/secretary/dashboard";
      case "Parent":
        return "/parent/dashboard";
      case "Student":
        return "/student/dashboard";
      case "Professeur":
        return "/professor/dashboard";
      case "Directeur":
        return "/director/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Accès non autorisé
        </h1>

        <p className="text-muted-foreground mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Connecté en tant que:{" "}
              <span className="font-semibold capitalize">{user.role}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {user.firstName} {user.lastName}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1"
          >
            Retour
          </Button>

          <Button
            onClick={() => (window.location.href = getRoleDashboardPath())}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};
