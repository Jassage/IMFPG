// components/auth/ForcePasswordChange.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const ForcePasswordChange = () => {
  const navigate = useNavigate();
  const { user, updatePassword } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const getDashboardPath = (role: string) => {
    switch (role) {
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
      case "Direction":
        return "/director/dashboard";
      default:
        return "/login";
    }
  };

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ newPassword: "", confirmPassword: "" });

    // Validation
    const passwordRequirements = validatePassword(formData.newPassword);

    if (!passwordRequirements.minLength) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Le mot de passe doit contenir au moins 8 caractères",
      }));
      setLoading(false);
      return;
    }

    if (
      !passwordRequirements.hasUpperCase ||
      !passwordRequirements.hasLowerCase
    ) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Le mot de passe doit contenir des majuscules et minuscules",
      }));
      setLoading(false);
      return;
    }

    if (!passwordRequirements.hasNumber) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Le mot de passe doit contenir au moins un chiffre",
      }));
      setLoading(false);
      return;
    }

    if (!passwordRequirements.hasSpecialChar) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Le mot de passe doit contenir au moins un caractère spécial",
      }));
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas",
      }));
      setLoading(false);
      return;
    }

    try {
      await updatePassword("", formData.newPassword, true); // Passer true pour forcer le changement

      toast({
        title: "Succès",
        description: "Votre mot de passe a été changé avec succès",
        variant: "default",
      });

      // Rediriger vers le tableau de bord approprié selon le rôle
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors du changement de mot de passe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = validatePassword(formData.newPassword);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Changer votre mot de passe
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Bonjour {user?.firstName} {user?.lastName},<br />
            Pour des raisons de sécurité, vous devez changer votre mot de passe
            initial.
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ceci est votre première connexion. Veuillez définir un nouveau mot
              de passe sécurisé.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Entrez votre nouveau mot de passe"
                required
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Indicateur de force du mot de passe */}
            {formData.newPassword && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Force du mot de passe
                </Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        passwordRequirements.minLength
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        passwordRequirements.minLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        passwordRequirements.hasUpperCase &&
                        passwordRequirements.hasLowerCase
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        passwordRequirements.hasUpperCase &&
                        passwordRequirements.hasLowerCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Majuscules et minuscules
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        passwordRequirements.hasNumber
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        passwordRequirements.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Au moins un chiffre
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`h-4 w-4 ${
                        passwordRequirements.hasSpecialChar
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        passwordRequirements.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Au moins un caractère spécial
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !passwordRequirements.minLength}
            >
              {loading ? "Changement en cours..." : "Changer le mot de passe"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Après le changement, vous serez redirigé vers votre tableau de
              bord.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
