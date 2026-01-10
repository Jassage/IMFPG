// pages/LockPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLockStore } from "@/store/lockStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { verifyPasswordForUnlock } from "@/services/apiService";
import { Badge } from "@/components/ui/badge";
// ... autres imports

const LockPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyCurrentPassword } = useAuthStore(); // Utilisez la méthode avec token
  const { unlock, lockedByInactivity } = useLockStore();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Vérifier si l'utilisateur est verrouillé temporairement
  useEffect(() => {
    const lockoutEnd = localStorage.getItem("lockoutEnd");
    if (lockoutEnd) {
      const endTime = parseInt(lockoutEnd);
      if (Date.now() < endTime) {
        setIsLockedOut(true);
        setLockoutTime(Math.ceil((endTime - Date.now()) / 1000));

        // Mettre à jour le compte à rebours
        const interval = setInterval(() => {
          const remaining = Math.ceil((endTime - Date.now()) / 1000);
          if (remaining <= 0) {
            setIsLockedOut(false);
            localStorage.removeItem("lockoutEnd");
            localStorage.removeItem("failedAttempts");
            clearInterval(interval);
          } else {
            setLockoutTime(remaining);
          }
        }, 1000);

        return () => clearInterval(interval);
      } else {
        localStorage.removeItem("lockoutEnd");
        localStorage.removeItem("failedAttempts");
      }
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user?.email) {
        throw new Error("Session invalide");
      }

      // Utilisez la méthode spécifique pour le déverrouillage
      const isValid = await verifyPasswordForUnlock(user.email, password);

      if (!isValid) {
        throw new Error("Mot de passe incorrect");
      }

      // Déverrouiller l'application
      unlock();

      toast.success("Vous pouvez continuer à utiliser l'application.");

      // Retourner à la page précédente
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Échec du déverrouillage");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {lockedByInactivity
              ? "Session verrouillée"
              : "Application verrouillée"}
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            {user ? (
              <>
                Connecté en tant que <br />
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>
              </>
            ) : (
              "Session expirée"
            )}
          </p>
        </CardHeader>

        <CardContent>
          {isLockedOut ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">
                    Accès temporairement bloqué
                  </h3>
                </div>
                <p className="text-sm text-red-700">
                  Trop de tentatives de connexion. Veuillez réessayer dans{" "}
                  <span className="font-bold">{formatTime(lockoutTime)}</span>.
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Pour des raisons de sécurité, votre compte est temporairement
                  verrouillé.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-300">
                      {lockedByInactivity ? "Inactivité détectée" : "Sécurité"}
                    </p>
                    <p className="text-amber-700 dark:text-amber-400">
                      {lockedByInactivity
                        ? "Pour des raisons de sécurité, l'application a été verrouillée après 15 minutes d'inactivité."
                        : "L'application est actuellement verrouillée. Veuillez entrer votre mot de passe pour continuer."}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                    autoFocus
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  {attempts > 0 && (
                    <p className="text-xs text-amber-600">
                      Tentatives échouées : {attempts}/5
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !password || isLockedOut}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Déverrouiller"
                  )}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                navigate("/login", { replace: true });
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Se connecter avec un autre compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockPage;
