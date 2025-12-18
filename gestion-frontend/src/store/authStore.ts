// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";
import { User } from "../types/academic";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastActivity: number;
  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: string) => void;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
  updateActivity: () => void;
  initialize: () => Promise<void>;
  fetchPotentialDeans: () => Promise<any[]>;
  setLoading: (loading: boolean) => void;
}

// Timeout d'inactivité (30 minutes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Monitoring d'activité
let activityMonitor: NodeJS.Timeout;

const startActivityMonitoring = (logout: (reason: string) => void) => {
  stopActivityMonitoring();

  activityMonitor = setInterval(() => {
    const state = useAuthStore.getState();
    if (
      state.isAuthenticated &&
      Date.now() - state.lastActivity > INACTIVITY_TIMEOUT
    ) {
      logout("Inactivité prolongée");
    }
  }, 60000); // Vérifier toutes les minutes
};

const stopActivityMonitoring = () => {
  if (activityMonitor) {
    clearInterval(activityMonitor);
  }
};

// Gestionnaire d'événements pour l'activité utilisateur
let cleanupActivityListeners: (() => void) | null = null;

const setupActivityListeners = (updateActivity: () => void) => {
  // Nettoyer les écouteurs existants
  if (cleanupActivityListeners) {
    cleanupActivityListeners();
  }

  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

  events.forEach((event) => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  cleanupActivityListeners = () => {
    events.forEach((event) => {
      document.removeEventListener(event, updateActivity);
    });
    cleanupActivityListeners = null;
  };
};

// Variable globale pour suivre l'initialisation
let globalInitialized = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: false,
      lastActivity: Date.now(),

      setLoading: (loading: boolean) => set({ loading }),

      // MÉTHODE D'INITIALISATION CORRIGÉE
      initialize: async () => {
        const state = get();

        // Si déjà initialisé, ne rien faire
        if (state.initialized) {
          return;
        }

        set({ loading: true });

        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("userData");

        // Pas de token = pas authentifié
        if (!token) {
          console.log("ℹ️ Aucun token trouvé, utilisateur non authentifié");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            initialized: true,
            error: null,
          });
          return;
        }

        try {
          // Mettre le token dans les headers
          if (api?.defaults?.headers) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          // Vérifier le token avec le serveur - MAIS sans déclencher de redirection
          const response = await api
            .get("/auth/me", {
              // Ajouter un paramètre pour empêcher la redirection dans l'intercepteur
              _skipAuthRedirect: true,
            } as any)
            .catch((error) => {
              // Si erreur 401, c'est normal, le token est invalide
              if (error.response?.status === 401) {
                throw new Error("Token invalide ou expiré");
              }
              throw error;
            });

          if (response.data?.success === false) {
            throw new Error("Erreur de vérification d'authentification");
          }

          const user =
            response.data?.data?.user || response.data?.user || response.data;

          if (!user) {
            throw new Error("Données utilisateur non valides");
          }

          // Mettre à jour le store avec les nouvelles données
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
            initialized: true,
            lastActivity: Date.now(),
          });

          console.log("✅ Authentification initialisée avec succès");

          // Démarrer le monitoring d'activité
          setupActivityListeners(() => {
            get().updateActivity();
          });
        } catch (error: any) {
          console.error("❌ Erreur d'initialisation:", error.message);

          // Nettoyer les données invalides
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");

          if (api?.defaults?.headers) {
            delete api.defaults.headers.common["Authorization"];
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: "Session expirée. Veuillez vous reconnecter.",
            initialized: true,
          });

          // NE PAS rediriger ici - laisser l'application gérer
        }
      },

      // MÉTHODE DE CONNEXION
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          if (!email || !password) {
            throw new Error("Email et mot de passe requis");
          }

          const response = await api.post("/auth/login", {
            email: email.trim(),
            password,
          });

          // Gérer différents formats de réponse
          let token, user;

          if (response.data?.data) {
            // Format: { data: { token, user, expiresIn } }
            token = response.data.data.token;
            user = response.data.data.user;
          } else if (response.data?.token) {
            // Format: { token, user }
            token = response.data.token;
            user = response.data.user;
          } else {
            // Format: direct
            token = response.data.token;
            user = response.data;
          }

          if (!token || !user) {
            throw new Error("Réponse d'authentification invalide");
          }

          // Vérifier le statut du compte
          if (user.status && user.status !== "Actif") {
            throw new Error("Votre compte est désactivé");
          }

          // Mettre à jour le store
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
            initialized: true,
            lastActivity: Date.now(),
          });

          // Stocker dans localStorage
          localStorage.setItem("authToken", token);
          localStorage.setItem("userData", JSON.stringify(user));

          // Configurer les headers API
          if (api?.defaults?.headers) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          // Démarrer le monitoring
          startActivityMonitoring(get().logout);
          setupActivityListeners(() => {
            get().updateActivity();
          });

          toast.success(`Bienvenue ${user.firstName} ${user.lastName} !`);
          return;
        } catch (error: any) {
          console.error("❌ Erreur de connexion:", error);

          let errorMessage = "Erreur de connexion";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          // Nettoyer en cas d'erreur
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
            initialized: true,
          });

          toast.error(errorMessage);
          throw error;
        }
      },

      // MÉTHODE DE DÉCONNEXION
      logout: (reason = "Déconnexion utilisateur") => {
        console.log(`🔒 Déconnexion: ${reason}`);

        // Nettoyer
        if (api?.defaults?.headers) {
          delete api.defaults.headers.common["Authorization"];
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          initialized: true,
        });

        // Arrêter le monitoring
        stopActivityMonitoring();
        if (cleanupActivityListeners) {
          cleanupActivityListeners();
        }

        toast.info("Vous avez été déconnecté");
      },

      // VÉRIFICATION D'AUTHENTIFICATION
      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          return false;
        }

        try {
          const response = await api
            .get("/auth/me", { _skipAuthRedirect: true } as any)
            .catch(() => null);

          if (response?.data) {
            const user = response.data.data?.user || response.data;
            set({
              user,
              isAuthenticated: true,
              lastActivity: Date.now(),
            });
            return true;
          }
        } catch (error) {
          // Erreur silencieuse
        }

        // Si on arrive ici, l'authentification a échoué
        get().logout("Session expirée");
        return false;
      },

      // EFFACER LES ERREURS
      clearError: () => set({ error: null }),

      // RAFRAÎCHISSEMENT DU TOKEN
      refreshToken: async (): Promise<boolean> => {
        const { token } = get();

        if (!token) {
          return false;
        }

        try {
          const response = await api.post("/auth/refresh", { token });
          const newToken = response.data.token || response.data.newToken;

          if (newToken) {
            localStorage.setItem("authToken", newToken);

            if (api?.defaults?.headers) {
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newToken}`;
            }

            set({
              token: newToken,
              lastActivity: Date.now(),
            });

            return true;
          }
        } catch (error) {
          console.error("❌ Erreur rafraîchissement token:", error);
        }

        return false;
      },

      // MISE À JOUR DE L'ACTIVITÉ
      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      // RÉCUPÉRATION DES DOYENS POTENTIELS
      fetchPotentialDeans: async (): Promise<any[]> => {
        try {
          const response = await api.get("/users/potential-deans");
          return response.data;
        } catch (error) {
          console.error("❌ Erreur récupération doyens:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        lastActivity: state.lastActivity,
      }),
      // ✅ CORRECTION: Meilleure gestion de la réhydratation
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("❌ Erreur de réhydratation:", error);
        }

        if (state) {
          // Initialiser l'API avec le token stocké
          if (state.token && api?.defaults?.headers) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${state.token}`;
          }

          // Marquer comme non initialisé pour forcer une vérification propre
          state.initialized = false;
          state.loading = false;
        }
      },
    }
  )
);

// Fonction d'initialisation externe
export const initializeAuthStore = async () => {
  // Réinitialiser la variable globale
  globalInitialized = false;

  const state = useAuthStore.getState();

  // Si pas de token, on initialise directement
  if (!state.token) {
    useAuthStore.setState({
      initialized: true,
      isAuthenticated: false,
      loading: false,
    });
    globalInitialized = true;
    return;
  }

  // Si on a un token, on initialise l'API
  if (api?.defaults?.headers) {
    api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
  }

  // Lancer l'initialisation asynchrone
  setTimeout(() => {
    state.initialize();
  }, 100);
};

// Export pour utilisation dans les intercepteurs
export const getAuthState = () => useAuthStore.getState();

// Démarrer l'initialisation automatique au chargement
if (typeof window !== "undefined") {
  // Attendre que le DOM soit prêt
  window.addEventListener("load", () => {
    setTimeout(() => {
      initializeAuthStore();
    }, 0);
  });
}
