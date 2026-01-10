import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Configuration de base
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configuration Axios
const apiConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000, // Augmenter le timeout à 15 secondes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Ajouter ces configurations pour améliorer la stabilité
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024, // 50MB
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Accepter les réponses < 500
  },
};

// Créer l'instance Axios
const api: AxiosInstance = axios.create(apiConfig);

export const unlockApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    console.log("📤 API Request:", {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Afficher le log détaillé
    console.log(
      `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);

    // Afficher la réponse détaillée en développement
    if (import.meta.env.DEV) {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    console.log(`❌ API Error: ${error.code} ${error.message}`);

    const errorInfo = {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message,
      code: error.code,
      config: error.config,
    };

    console.log("🔧 Error Config:", error.config);
    console.log("🔧 Error Info:", errorInfo);

    // Gestion spécifique des erreurs
    if (error.code === "ECONNABORTED") {
      console.error("❌ Network error: timeout exceeded");
      return Promise.reject(
        new Error("La requête a expiré. Vérifiez votre connexion internet.")
      );
    }

    if (!error.response) {
      console.error("❌ Network error: no response from server");
      return Promise.reject(
        new Error(
          "Erreur de connexion au serveur. Vérifiez votre connexion internet."
        )
      );
    }

    // Gestion des erreurs HTTP
    switch (error.response.status) {
      case 401:
        // Rediriger vers la page de login
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        break;
      case 403:
        return Promise.reject(
          new Error(
            "Accès interdit. Vous n'avez pas les permissions nécessaires."
          )
        );
      case 404:
        return Promise.reject(new Error("Ressource non trouvée."));
      case 500:
        return Promise.reject(
          new Error("Erreur interne du serveur. Veuillez réessayer plus tard.")
        );
      default:
        const errorMessage = error.message || "Une erreur est survenue";
        return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(error);
  }
);

// Méthode utilitaire pour tester la connexion
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get("/users", { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error("❌ API connection test failed:", error);
    return false;
  }
};

// Méthode pour réessayer une requête
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      console.log(`🔄 Tentative ${i + 1}/${maxRetries} échouée`);

      // Attendre avant de réessayer (avec backoff exponentiel)
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
};

export const verifyPasswordForUnlock = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await unlockApi.post("/auth/verify-unlock", {
      email,
      password,
    });
    return response.data.success === true;
  } catch (error: any) {
    console.error("Password verification error:", error);

    // Si c'est une erreur d'authentification, essayer sans token
    if (error.response?.status === 401) {
      // Essayer une requête fetch directe sans headers d'authentification
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-unlock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          return data.success === true;
        }
      } catch (fetchError) {
        console.error("Fetch verification error:", fetchError);
      }
    }

    return false;
  }
};

export default api;
