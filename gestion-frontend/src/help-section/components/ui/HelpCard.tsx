// src/components/help/ui/HelpCard.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { IMFP_HELP_THEME } from "@/types/theme";
// import { IMFP_HELP_THEME } from "@/styles/help/theme";

interface HelpCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "academic"
    | "success"
    | "warning"
    | "danger";
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const HelpCard: React.FC<HelpCardProps> = ({
  title,
  description,
  icon,
  variant = "default",
  action,
  children,
  className,
}) => {
  const variantStyles = {
    default: "border-gray-200 bg-white",
    primary: `border-${IMFP_HELP_THEME.colors.primary[500]} bg-${IMFP_HELP_THEME.colors.primary[50]}`,
    academic: `border-${IMFP_HELP_THEME.colors.academic[500]} bg-${IMFP_HELP_THEME.colors.academic[50]}`,
    success: `border-${IMFP_HELP_THEME.colors.success[500]} bg-${IMFP_HELP_THEME.colors.success[50]}`,
    warning: `border-${IMFP_HELP_THEME.colors.warning[500]} bg-${IMFP_HELP_THEME.colors.warning[50]}`,
    danger: `border-${IMFP_HELP_THEME.colors.danger[500]} bg-${IMFP_HELP_THEME.colors.danger[50]}`,
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-lg bg-white border">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children && <div className="mt-4 pt-4 border-t">{children}</div>}
    </div>
  );
};
