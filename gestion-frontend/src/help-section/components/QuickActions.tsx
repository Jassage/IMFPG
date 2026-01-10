import React from "react";
import {
  Zap,
  ExternalLink,
  Clock,
  CheckCircle,
  ArrowRight,
  Keyboard,
} from "lucide-react";
import { QuickAction as QuickActionType } from "@/types/help.types";
import { useNavigate } from "react-router-dom";
import { useHelp } from "../context/HelpContext";

interface QuickActionsProps {
  actions: QuickActionType[];
  compact?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { closeHelp } = useHelp();

  const handleActionClick = (action: QuickActionType) => {
    // Naviguer vers le chemin
    if (action.path.startsWith("/")) {
      navigate(action.path);
      closeHelp(); // Fermer l'aide après navigation
    } else if (action.path.startsWith("#")) {
      // Action interne (rafraîchissement, etc.)
      if (action.id === "quick-refresh") {
        window.location.reload();
      }
    }

    // Tracking (optionnel)
    console.log(`Quick action clicked: ${action.id}`);
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            title={action.description}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Actions Rapides
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {actions.length} disponibles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="group relative p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
          >
            {/* Numéro d'ordre */}
            <div className="absolute -top-2 -left-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>

            {/* Icône et titre */}
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                {/* Icône dynamique - à adapter avec vos icônes */}
                <Zap className="h-5 w-5" />
              </div>
              <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {action.label}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {action.description}
            </p>

            {/* Footer avec raccourci */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>30s</span>
              </div>

              {action.shortcut && (
                <div className="flex items-center gap-1 text-xs">
                  <Keyboard className="h-3 w-3 text-gray-400" />
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    {action.shortcut}
                  </kbd>
                </div>
              )}

              <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Badge de confirmation au hover */}
            <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Légende */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>Simple à réaliser</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          <span>Action fréquente</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Recommandée</span>
        </div>
      </div>
    </div>
  );
};

// Composant pour une seule action (à utiliser dans les formulaires)
export const SingleQuickAction: React.FC<{ action: QuickActionType }> = ({
  action,
}) => {
  const navigate = useNavigate();

  return (
    <div className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
        <Zap className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-800">{action.label}</div>
        <div className="text-xs text-gray-600">{action.description}</div>
      </div>
      <button
        onClick={() => action.path.startsWith("/") && navigate(action.path)}
        className="text-blue-600 hover:text-blue-800"
      >
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
};
