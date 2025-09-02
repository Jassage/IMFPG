// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";
import { User } from "../types/academic";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { token, user } = response.data;

          // Stocker le token dans les headers API par défaut
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Erreur de connexion";
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
          });
          // Nettoyer le token en cas d'erreur
          api.defaults.headers.common["Authorization"] = "";
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        // Nettoyer les headers API
        api.defaults.headers.common["Authorization"] = "";

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      },

      getCurrentUser: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, loading: false });
          return;
        }

        set({ loading: true });
        try {
          // Définir le token dans les headers avant la requête
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const response = await api.get("/auth/me");
          set({
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          console.error("Erreur vérification utilisateur:", error);

          // Nettoyer en cas d'erreur
          api.defaults.headers.common["Authorization"] = "";

          set({
            error: error.response?.data?.message || "Session expirée",
            isAuthenticated: false,
            loading: false,
            user: null,
            token: null,
          });
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => set({ user }),

      setToken: (token: string | null) => {
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          api.defaults.headers.common["Authorization"] = "";
        }
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Réhydrater le token dans les headers API
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;

          // Vérifier l'utilisateur actuel après réhydratation
          if (state.token && !state.user) {
            setTimeout(() => {
              state.getCurrentUser?.();
            }, 1000);
          }
        }
      },
    }
  )
);

// Initialisation au démarrage
export const initializeAuth = () => {
  const { token, getCurrentUser } = useAuthStore.getState();

  if (token) {
    // Définir le token dans les headers API
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Récupérer les infos utilisateur si token mais pas d'user
    if (token && !useAuthStore.getState().user) {
      setTimeout(() => {
        getCurrentUser();
      }, 1000);
    }
  }
};

// Appeler l'initialisation au chargement du store
initializeAuth();
