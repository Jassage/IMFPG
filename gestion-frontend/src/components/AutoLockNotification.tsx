// components/AutoLockNotification.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAutoLock } from "@/hooks/useAutoLock";

interface AutoLockNotificationProps {
  visible: boolean;
  secondsRemaining: number;
  onExtend: () => void;
}

export const AutoLockNotification: React.FC<AutoLockNotificationProps> = ({
  visible,
  secondsRemaining,
  onExtend,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right">
      <Alert variant="destructive" className="shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Session sur le point d'expirer</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            Votre session sera verrouillée dans{" "}
            <span className="font-bold">{secondsRemaining}</span> seconde
            {secondsRemaining !== 1 ? "s" : ""}.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExtend}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Rester connecté
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
