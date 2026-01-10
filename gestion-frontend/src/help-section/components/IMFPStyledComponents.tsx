// src/components/help/IMFPStyledComponents.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useIMFPStyle } from "@/types/theme";
// import { IMFP_THEME_CLASSES, useIMFPStyle } from '@/styles/help/imfp-theme';

// Badge pour les rôles
interface IMFPRoleBadgeProps {
  role:
    | "admin"
    | "secretaire"
    | "professeur"
    | "directeur"
    | "eleve"
    | "parent";
  label?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const IMFPRoleBadge: React.FC<IMFPRoleBadgeProps> = ({
  role,
  label,
  size = "md",
  showIcon = true,
  className,
}) => {
  const { getRoleColor } = useIMFPStyle();

  const roleIcons = {
    admin: "👑",
    secretaire: "📋",
    professeur: "👨‍🏫",
    directeur: "🎓",
    eleve: "👨‍🎓",
    parent: "👨‍👩‍👧‍👦",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const displayLabel = label || role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        getRoleColor(role, "bg"),
        getRoleColor(role, "text"),
        getRoleColor(role, "border"),
        "border",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span>{roleIcons[role]}</span>}
      {displayLabel}
    </span>
  );
};

// Carte de workflow
interface IMFPWorkflowCardProps {
  title: string;
  description: string;
  steps: number;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  roles: ("admin" | "secretaire" | "professeur" | "directeur")[];
  onClick?: () => void;
}

export const IMFPWorkflowCard: React.FC<IMFPWorkflowCardProps> = ({
  title,
  description,
  steps,
  estimatedTime,
  difficulty,
  roles,
  onClick,
}) => {
  const difficultyConfig = {
    easy: { color: "text-green-600", bg: "bg-green-100", label: "Facile" },
    medium: { color: "text-amber-600", bg: "bg-amber-100", label: "Moyen" },
    hard: { color: "text-red-600", bg: "bg-red-100", label: "Difficile" },
  };

  const diff = difficultyConfig[difficulty];

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            diff.bg,
            diff.color
          )}
        >
          {diff.label}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>{steps} étapes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>{estimatedTime}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {roles.map((role, idx) => (
            <IMFPRoleBadge key={idx} role={role} size="sm" showIcon={false} />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Cliquez pour voir le guide
        </span>
        <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </div>
      </div>
    </div>
  );
};

// Indicateur de progression
interface IMFPProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ title: string; description?: string }>;
}

export const IMFPProgressIndicator: React.FC<IMFPProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Barre de progression */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Points d'étape */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-white border-blue-500 text-blue-500 shadow-lg"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span className="mt-2 text-xs font-medium text-gray-700 text-center max-w-[80px]">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description de l'étape courante */}
      {steps[currentStep - 1]?.description && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong className="font-semibold">Étape {currentStep}: </strong>
            {steps[currentStep - 1].description}
          </p>
        </div>
      )}
    </div>
  );
};
