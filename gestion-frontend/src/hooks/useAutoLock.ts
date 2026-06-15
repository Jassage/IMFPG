// hooks/useAutoLock.ts
import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLockStore } from "@/store/lockStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_TIMEOUT = 14 * 60 * 1000; // Avertir après 14 minutes

export const useAutoLock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { isLocked, lock, unlock, updateActivity, lockedByInactivity } =
    useLockStore();

  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  // Routes qui ne devraient pas déclencher le verrouillage
  const EXCLUDED_ROUTES = [
    "/login",
    "/lock",
    "/forgot-password",
    "/reset-password",
  ];

  const shouldTrackActivity = useCallback(() => {
    return isAuthenticated && !EXCLUDED_ROUTES.includes(location.pathname);
  }, [isAuthenticated, location.pathname]);

  // Réinitialiser les timers
  const resetTimeouts = useCallback(() => {
    if (!shouldTrackActivity()) return;

    // Nettoyer les timers existants
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Cacher l'avertissement
    setShowWarning(false);

    // Mettre à jour le timestamp d'activité
    updateActivity();

    // Timer d'avertissement (14 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsRemaining(60);

      // Compte à rebours
      const countdown = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Nettoyer après 60 secondes
      setTimeout(() => {
        clearInterval(countdown);
        if (showWarning) {
          setShowWarning(false);
        }
      }, 60000);
    }, WARNING_TIMEOUT);

    // Timer de verrouillage (15 minutes)
    logoutTimeoutRef.current = setTimeout(() => {
      if (shouldTrackActivity() && !isLocked) {
        lock(true); // Verrouiller par inactivité
        toast.info(
          "L'application a été verrouillée après 15 minutes d'inactivité."
        );
        navigate("/lock", { replace: true, state: { from: location } });
      }
    }, INACTIVITY_TIMEOUT);
  }, [shouldTrackActivity, updateActivity, lock, isLocked, navigate]);

  // Gestionnaire d'activité utilisateur
  const handleUserActivity = useCallback(() => {
    if (shouldTrackActivity()) {
      resetTimeouts();
    }
  }, [shouldTrackActivity, resetTimeouts]);

  // Vérifier si on doit rediriger vers la page de verrouillage
  useEffect(() => {
    if (isLocked && location.pathname !== "/lock" && shouldTrackActivity()) {
      navigate("/lock", { replace: true, state: { from: location } });
    }
  }, [isLocked, location.pathname, navigate, shouldTrackActivity]);

  // Initialiser les écouteurs d'événements
  useEffect(() => {
    if (!shouldTrackActivity() || isLocked) return;

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    resetTimeouts();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });

      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [handleUserActivity, resetTimeouts, shouldTrackActivity, isLocked]);

  // Nettoyer en quittant la page
  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  // Déverrouiller manuellement
  const unlockApp = useCallback(() => {
    unlock();
    resetTimeouts();
  }, [unlock, resetTimeouts]);

  return {
    isLocked,
    lock: () => lock(false), // Verrouillage manuel
    unlock: unlockApp,
    resetTimeouts,
    showWarning,
    secondsRemaining,
    lockedByInactivity,
  };
};
