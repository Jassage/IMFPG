// utils/dateUtils.ts

/**
 * Formate une date au format YYYY-MM-DD pour les inputs de type date
 */
export const formatDateForInput = (date?: string | Date | null): string => {
  if (!date) {
    return new Date().toISOString().split("T")[0];
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return dateObj.toISOString().split("T")[0];
};

/**
 * Formate une date pour l'affichage en français
 */
export const formatDateForDisplay = (date?: string | Date | null): string => {
  if (!date) {
    return "N/A";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Date invalide";
  }

  return dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Convertit une date en objet Date
 */
export const parseDate = (date?: string | Date | null): Date | null => {
  if (!date) return null;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return null;
  }

  return dateObj;
};
