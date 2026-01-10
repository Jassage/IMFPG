import React, { useEffect } from "react";
import { HelpCircle, MessageSquare, Keyboard, Bookmark } from "lucide-react";
import { useHelp } from "./context/HelpContext";

export const HelpLauncher: React.FC = () => {
  const { openHelp, bookmarks } = useHelp();

  // Raccourci clavier F1
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        openHelp();
      }
      // Ctrl + H
      if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        openHelp();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [openHelp]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Bouton signets si existants */}
      {bookmarks.length > 0 && (
        <button
          onClick={() => openHelp("dashboard")}
          className="p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors group relative"
          title="Mes signets"
        >
          <Bookmark className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {bookmarks.length}
          </span>
        </button>
      )}

      {/* Bouton d'aide principal */}
      <button
        onClick={() => openHelp()}
        className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 group"
        title="Aide (F1 ou Ctrl+H)"
      >
        <HelpCircle className="h-6 w-6" />
        <span className="text-sm font-medium hidden sm:inline">Aide</span>

        {/* Badge de raccourci */}
        <div className="hidden sm:flex items-center gap-1 text-xs bg-blue-800 px-2 py-1 rounded-full">
          <Keyboard className="h-3 w-3" />
          <span>F1</span>
        </div>
      </button>

      {/* Indicateur de raccourci au hover */}
      <div className="absolute right-20 bottom-4 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        Appuyez sur F1 pour l'aide
      </div>
    </div>
  );
};
