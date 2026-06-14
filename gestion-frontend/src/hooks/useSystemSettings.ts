import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";

export const useSettings = () => {
  const {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    backupSettings,
    resetSettings,
  } = useSettingsStore();

  const { user } = useAuthStore();

  useEffect(() => {
    // Charger les paramètres si l'utilisateur est admin
    if (user?.role === "Admin") {
      fetchSettings();
    }
  }, [user]);

  const formatCurrency = (amount: number): string => {
    if (!settings) return `${amount} G`;
    return `${amount.toLocaleString()} ${settings.currencySymbol || "G"}`;
  };

  const formatGrade = (grade: number): string => {
    if (!settings) return `${grade}%`;

    switch (settings.gradingSystem) {
      case "percentage":
        return `${grade}%`;
      case "letter":
        if (grade >= 90) return "A";
        if (grade >= 80) return "B";
        if (grade >= 70) return "C";
        if (grade >= 60) return "D";
        return "F";
      case "gpa":
        return (grade / 25).toFixed(1);
      default:
        return grade.toString();
    }
  };

  const getSchoolInfo = () => ({
    name: settings?.schoolName || "Institution Mixte Faustin 1er",
    slogan: settings?.schoolSlogan || "L'excellence pour tous",
    phone: settings?.phone || "",
    email: settings?.email || "",
    website: settings?.website || "",
    address: settings?.address || "",
    city: settings?.city || "",
    country: settings?.country || "",
    logo: settings?.schoolLogo || "/logo.png",
  });

  const isModuleEnabled = (moduleName: string): boolean => {
    if (!settings?.enabledModules) return false;
    return (
      settings.enabledModules[
        moduleName as keyof typeof settings.enabledModules
      ] || false
    );
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    backupSettings,
    resetSettings,
    refetch: fetchSettings,
    formatCurrency,
    formatGrade,
    getSchoolInfo,
    isModuleEnabled,
  };
};
