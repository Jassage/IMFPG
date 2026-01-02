// @/types/classLevels.ts
export const ClassLevel = {
  Sixieme: "Sixieme",
  Cinquieme: "Cinquieme",
  Quatrieme: "Quatrieme",
  Troisieme: "Troisieme",
  Seconde: "Seconde",
  Premiere: "Premiere",
  Terminale: "Terminale",
  NSI: "NSI",
  NSII: "NSII",
  NSIII: "NSIII",
  NSIV: "NSIV",
} as const;

export type ClassLevelType = (typeof ClassLevel)[keyof typeof ClassLevel];

/**
 * Vérifie si une transition entre deux niveaux est valide
 */
export const isValidLevelTransition = (
  fromLevel: ClassLevelType,
  toLevel: ClassLevelType
): { valid: boolean; reason?: string } => {
  // Toujours autoriser le même niveau (redoublement)
  if (fromLevel === toLevel) {
    return {
      valid: true,
      reason: "Redoublement autorisé",
    };
  }

  // Définir les transitions autorisées
  const allowedTransitions: Record<ClassLevelType, ClassLevelType[]> = {
    Sixieme: ["Cinquieme"],
    Cinquieme: ["Quatrieme"],
    Quatrieme: ["Troisieme", "NSI"],
    Troisieme: ["Seconde"],
    Seconde: ["Premiere"],
    Premiere: ["Terminale"],
    Terminale: [],
    NSI: ["NSII"],
    NSII: ["NSIII"],
    NSIII: ["NSIV"],
    NSIV: [],
  };

  const allowedLevels = allowedTransitions[fromLevel] || [];

  if (allowedLevels.length === 0) {
    return {
      valid: false,
      reason: `${fromLevel} est le dernier niveau du parcours`,
    };
  }

  if (!allowedLevels.includes(toLevel)) {
    return {
      valid: false,
      reason: `Après ${fromLevel}, les niveaux autorisés sont: ${allowedLevels.join(
        ", "
      )}`,
    };
  }

  return { valid: true };
};

/**
 * Formate un niveau pour l'affichage
 */
export const formatClassLevel = (level: ClassLevelType | string): string => {
  const translations: Record<string, string> = {
    Sixieme: "Sixième",
    Cinquieme: "Cinquième",
    Quatrieme: "Quatrième",
    Troisieme: "Troisième",
    Seconde: "Seconde",
    Premiere: "Première",
    Terminale: "Terminale",
    NSI: "NSI (Nouveau Secondaire I)",
    NSII: "NSII (Nouveau Secondaire II)",
    NSIII: "NSIII (Nouveau Secondaire III)",
    NSIV: "NSIV (Nouveau Secondaire IV)",
  };

  return translations[level] || level;
};
