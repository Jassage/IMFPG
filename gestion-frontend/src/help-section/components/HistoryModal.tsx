// Créer un nouveau fichier HistoryModal.tsx
import React from "react";
import { X, Clock, Trash2, ExternalLink } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: Array<{
    id: string;
    title: string;
    section: string;
    viewedAt: Date;
    timeSpent: number; // en secondes
  }>;
  onClearHistory: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6" />
                <div>
                  <h3 className="text-lg font-bold">
                    Historique de consultation
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {historyItems.length} consultation(s)
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-y-auto p-4">
            {historyItems.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun historique pour le moment</p>
                <p className="text-sm text-gray-400 mt-2">
                  Votre historique de consultation apparaîtra ici
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {item.section}
                          </span>
                          <span>•</span>
                          <span>{formatTime(item.timeSpent)}</span>
                          <span>•</span>
                          <span>{formatDate(item.viewedAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate(item.id)}
                        className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Revoir cette section"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={onClearHistory}
                disabled={historyItems.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  historyItems.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Vider l'historique
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
