// src/styles/help/theme.ts
export const IMFP_HELP_THEME = {
  // Couleurs institutionnelles IMFP
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Bleu IMFP principal
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9", // Bleu clair
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    academic: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6", // Rose académique
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Vert validation
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Orange attention
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444", // Rouge erreur
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
  },

  // Typographie
  typography: {
    fonts: {
      heading:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
    },
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
  },

  // Espacements
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },

  // Ombres
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  // Bordures
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
};
// src/styles/help/imfp-theme.ts
export const IMFP_THEME = {
  // Palette de couleurs institutionnelle
  colors: {
    // Couleurs primaires IMFP
    imfp: {
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6", // Bleu principal IMFP
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      gold: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b", // Or IMFP
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
      },
      red: {
        500: "#dc2626", // Rouge institutionnel
      },
    },

    // Sémantique par rôle
    roles: {
      admin: {
        primary: "#10b981", // Vert
        light: "#d1fae5",
        dark: "#065f46",
      },
      secretaire: {
        primary: "#f59e0b", // Orange
        light: "#fef3c7",
        dark: "#92400e",
      },
      professeur: {
        primary: "#3b82f6", // Bleu
        light: "#dbeafe",
        dark: "#1e40af",
      },
      directeur: {
        primary: "#8b5cf6", // Violet
        light: "#ede9fe",
        dark: "#5b21b6",
      },
      eleve: {
        primary: "#ec4899", // Rose
        light: "#fce7f3",
        dark: "#9d174d",
      },
      parent: {
        primary: "#06b6d4", // Cyan
        light: "#cffafe",
        dark: "#0e7490",
      },
    },

    // Sémantique fonctionnelle
    functional: {
      success: {
        DEFAULT: "#10b981",
        light: "#d1fae5",
        dark: "#065f46",
      },
      warning: {
        DEFAULT: "#f59e0b",
        light: "#fef3c7",
        dark: "#92400e",
      },
      error: {
        DEFAULT: "#ef4444",
        light: "#fee2e2",
        dark: "#b91c1c",
      },
      info: {
        DEFAULT: "#3b82f6",
        light: "#dbeafe",
        dark: "#1e40af",
      },
    },
  },

  // Typographie
  typography: {
    fonts: {
      heading:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    },
    sizes: {
      xs: { size: "0.75rem", height: "1rem" }, // 12px
      sm: { size: "0.875rem", height: "1.25rem" }, // 14px
      base: { size: "1rem", height: "1.5rem" }, // 16px
      lg: { size: "1.125rem", height: "1.75rem" }, // 18px
      xl: { size: "1.25rem", height: "1.75rem" }, // 20px
      "2xl": { size: "1.5rem", height: "2rem" }, // 24px
      "3xl": { size: "1.875rem", height: "2.25rem" }, // 30px
      "4xl": { size: "2.25rem", height: "2.5rem" }, // 36px
    },
  },

  // Espacements (basé sur 4px grid)
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
  },

  // Bordures
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    DEFAULT: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    full: "9999px",
  },

  // Ombres
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // Animations
  animations: {
    durations: {
      fast: "150ms",
      DEFAULT: "300ms",
      slow: "500ms",
    },
    easings: {
      DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

// Classes utilitaires Tailwind basées sur le thème
export const IMFP_THEME_CLASSES = {
  // Couleurs de texte par rôle
  textRole: {
    admin: "text-green-600",
    secretaire: "text-amber-600",
    professeur: "text-blue-600",
    directeur: "text-purple-600",
    eleve: "text-pink-600",
    parent: "text-cyan-600",
  },

  // Backgrounds par rôle
  bgRole: {
    admin: "bg-green-50",
    secretaire: "bg-amber-50",
    professeur: "bg-blue-50",
    directeur: "bg-purple-50",
    eleve: "bg-pink-50",
    parent: "bg-cyan-50",
  },

  // Bordures par rôle
  borderRole: {
    admin: "border-green-200",
    secretaire: "border-amber-200",
    professeur: "border-blue-200",
    directeur: "border-purple-200",
    eleve: "border-pink-200",
    parent: "border-cyan-200",
  },

  // Gradients institutionnels
  gradients: {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600",
    secondary: "bg-gradient-to-r from-amber-500 to-orange-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    warning: "bg-gradient-to-r from-amber-400 to-orange-400",
    error: "bg-gradient-to-r from-red-500 to-rose-500",
  },
};

// Hook pour utiliser le thème
export const useIMFPStyle = () => {
  const getRoleColor = (
    role: string,
    type: "text" | "bg" | "border" = "text"
  ) => {
    const roleKey =
      role.toLowerCase() as keyof typeof IMFP_THEME_CLASSES.textRole;
    const roleClass =
      IMFP_THEME_CLASSES[`${type}Role` as keyof typeof IMFP_THEME_CLASSES];

    if (roleClass && roleClass[roleKey]) {
      return roleClass[roleKey];
    }

    // Fallback
    switch (type) {
      case "text":
        return "text-gray-700";
      case "bg":
        return "bg-gray-100";
      case "border":
        return "border-gray-200";
    }
  };

  const getStepStyle = (step: number, total: number) => {
    const percentage = (step / total) * 100;

    if (percentage < 33) return { color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage < 66) return { color: "text-amber-600", bg: "bg-amber-100" };
    return { color: "text-green-600", bg: "bg-green-100" };
  };

  return {
    getRoleColor,
    getStepStyle,
    theme: IMFP_THEME,
    classes: IMFP_THEME_CLASSES,
  };
};
