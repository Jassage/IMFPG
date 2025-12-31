import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testApiConnection } from "@/services/apiService";
// import { testApiConnection } from "@/services/api";

interface SmartLoaderProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

export const SmartLoader: React.FC<SmartLoaderProps> = ({
  children,
  loadingMessage = "Chargement en cours...",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const connected = await testApiConnection();
      setIsConnected(connected);

      if (!connected) {
        setHasError(true);
      }
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);
      setIsConnected(false);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setHasError(false);
    setIsLoading(true);
    await checkConnection();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
    );
  }

  if (hasError && !isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Problème de connexion
          </h3>
          <p className="text-gray-600 text-center">
            Impossible de se connecter au serveur. Vérifiez votre connexion
            internet.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRetry} className="gap-2">
            <Wifi className="h-4 w-4" />
            Réessayer la connexion
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Si le problème persiste :</p>
          <ul className="list-disc list-inside mt-2">
            <li>Vérifiez votre connexion internet</li>
            <li>Assurez-vous que le serveur est en ligne</li>
            <li>Contactez l'administrateur système</li>
          </ul>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
