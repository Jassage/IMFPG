import { create } from "zustand";
import { SettingsUpdateData, SystemSettings } from "@/types/settings";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";

interface SettingsStore {
  settings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: SettingsUpdateData) => Promise<void>;
  backupSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

// Fonction utilitaire pour parser les JSON en toute sécurité
const safeJsonParse = (data: any): any => {
  if (!data) return data;

  // Si c'est déjà un objet, le retourner
  if (typeof data === "object") return data;

  // Si c'est une chaîne, essayer de parser
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn("⚠️ Erreur parsing JSON:", e);
      return data; // Retourner la chaîne originale
    }
  }

  return data;
};

// Fonction pour extraire les settings de la réponse
const extractSettingsFromResponse = (response: any): SystemSettings | null => {
  if (!response) return null;

  try {
    let settingsData = null;

    // Format 1: { data: { settings: {...} } }
    if (response.data?.settings) {
      settingsData = response.data.settings;
    }
    // Format 2: { settings: {...} }
    else if (response.settings) {
      settingsData = response.settings;
    }
    // Format 3: La réponse est directement l'objet settings
    else if (response.id || response.schoolName) {
      settingsData = response;
    }

    if (!settingsData) return null;

    // Parser les champs JSON
    return {
      ...settingsData,
      paymentMethods: safeJsonParse(settingsData.paymentMethods),
      passwordPolicy: safeJsonParse(settingsData.passwordPolicy),
      enabledModules: safeJsonParse(settingsData.enabledModules),
    };
  } catch (error) {
    console.error("❌ Erreur extraction settings:", error);
    return null;
  }
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    // Éviter les appels multiples
    if (get().isLoading) {
      console.log("⏳ Chargement déjà en cours...");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("📡 Fetching settings avec api.get...");

      // Utiliser api.get au lieu de fetch
      const response = await api.get("/settings");

      console.log("✅ Réponse API reçue:", response.data);

      const settingsData = extractSettingsFromResponse(response.data);

      if (!settingsData) {
        throw new Error("Format de réponse invalide");
      }

      console.log("✅ Settings chargés:", settingsData);
      set({ settings: settingsData, error: null });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur de chargement";
      console.error("❌ fetchSettings error:", error);
      set({ error: errorMessage });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (data: SettingsUpdateData) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      console.log("📤 Updating settings avec api.put...", data);

      // Utiliser api.put au lieu de fetch
      const response = await api.put("/settings", data);

      console.log("✅ Réponse API reçue:", response.data);

      const settingsData = extractSettingsFromResponse(response.data);

      if (!settingsData) {
        throw new Error("Format de réponse invalide");
      }

      set({ settings: settingsData, error: null });

      toast({
        title: "Succès",
        description: response.data?.message || "Paramètres mis à jour",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur de mise à jour";
      console.error("❌ updateSettings error:", error);
      set({ error: errorMessage });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  backupSettings: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      console.log("💾 Creating backup avec api.post...");

      // Utiliser api.post au lieu de fetch
      const response = await api.post("/settings/backup");

      console.log("✅ Réponse API reçue:", response.data);

      // Recharger les paramètres pour obtenir lastBackup
      await get().fetchSettings();

      toast({
        title: "Succès",
        description: response.data?.message || "Sauvegarde effectuée",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur de sauvegarde";
      console.error("❌ backupSettings error:", error);
      set({ error: errorMessage });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetSettings: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      console.log("🔄 Resetting settings avec api.post...");

      // Utiliser api.post au lieu de fetch
      const response = await api.post("/settings/reset");

      console.log("✅ Réponse API reçue:", response.data);

      const settingsData = extractSettingsFromResponse(response.data);

      if (!settingsData) {
        throw new Error("Format de réponse invalide");
      }

      set({ settings: settingsData, error: null });

      toast({
        title: "Succès",
        description: response.data?.message || "Paramètres réinitialisés",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur de réinitialisation";
      console.error("❌ resetSettings error:", error);
      set({ error: errorMessage });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
