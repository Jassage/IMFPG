// CORRECTION dans api.ts - Version corrigée
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Variable pour suivre les redirections en cours
let isRedirecting = false;

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    // Récupérer le token du localStorage uniquement
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug: seulement en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse CORRIGÉ
api.interceptors.response.use(
  (response) => {
    // Debug: seulement en développement
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { config, response } = error;

    // Pas de réponse = erreur réseau
    if (!response) {
      console.error("❌ Network error:", error.message);
      return Promise.reject(new Error("Erreur de connexion au serveur"));
    }

    const { status } = response;
    const url = config?.url;

    // Debug
    if (process.env.NODE_ENV === "development") {
      console.log(`❌ API Error: ${status} ${url}`);
    }

    // ✅ CORRECTION IMPORTANTE: NE PAS rediriger pour les requêtes d'authentification
    if (status === 401) {
      // Routes où une erreur 401 est normale et ne doit pas rediriger
      const authRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/verify-password",
        "/auth/verify",
        "/auth/me", // ✅ AJOUT CRITIQUE: ne pas rediriger pour /auth/me
      ];

      const isAuthRoute = authRoutes.some((route) => url?.includes(route));

      if (isAuthRoute) {
        // Pour les routes d'authentification, on rejette simplement l'erreur
        return Promise.reject(error);
      }

      // Pour les autres routes 401, on gère la déconnexion
      // Éviter les redirections multiples
      if (!isRedirecting) {
        isRedirecting = true;

        // Nettoyage sécurisé
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        // Supprimer le header Authorization
        if (api?.defaults?.headers) {
          delete api.defaults.headers.common["Authorization"];
        }

        // Attendre un peu avant la redirection pour éviter les boucles
        setTimeout(() => {
          // Rediriger uniquement si pas déjà sur la page de login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
          }
          isRedirecting = false;
        }, 100);
      }
    }

    // Pour toutes les autres erreurs, rejeter normalement
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(" API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(" API Error:", error.response?.status, error.config?.url);

    // AJOUTEZ CES LOGS :
    if (error.response) {
      console.error("📄 Error Data:", error.response.data);
      console.error("📋 Error Message:", error.response.data?.message);
      console.error("🔤 Error Code:", error.response.data?.code);
      console.error("🔍 Full Error Response:", error.response);
      const errorMessage = error.response.data?.message;
      toast.error(errorMessage);
    }

    if (error.request) {
      console.error("🌐 No Response:", error.request);
    }

    console.error("🔧 Error Config:", error.config);

    return Promise.reject(error);
  }
);

export default api;
