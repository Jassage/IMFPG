import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useHelp } from "../context/HelpContext";
import { getHelpSectionsByRole, getAllFAQs } from "../data/helpData";
import { SearchResult } from "@/types/help.types";
import { ICONS } from "@/config/roleConfig";

export const SearchHelp: React.FC = () => {
  const { setSearchQuery, userRole } = useHelp();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    "ajouter élève",
    "saisir notes",
    "générer bulletin",
    "importer données",
  ]);

  // Recherche intelligente avec debounce
  const debouncedSearch = useCallback(
    (value: string) => {
      const handler = setTimeout(() => {
        if (value.trim().length > 1) {
          performSearch(value);
        }
        setSearchQuery(value);
      }, 300);

      return () => clearTimeout(handler);
    },
    [setSearchQuery]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const performSearch = (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    // Recherche dans les sections et FAQs
    const sections = getHelpSectionsByRole(userRole);
    const faqs = getAllFAQs();

    const term = searchTerm.toLowerCase();

    // Suggestions basées sur le contenu
    const allTitles = [
      ...sections.map((s) => s.title),
      ...sections.flatMap((s) => s.content.map((c) => c.title)),
      ...faqs.map((f) => f.question),
      ...sections.flatMap((s) => s.quickActions?.map((a) => a.label) || []),
    ];

    const uniqueSuggestions = Array.from(new Set(allTitles))
      .filter((title) => title.toLowerCase().includes(term))
      .slice(0, 5);

    setSuggestions(uniqueSuggestions);
    setIsSearching(false);
  };

  const handleSearch = (value: string) => {
    setQuery(value);

    // Sauvegarder la recherche récente
    if (value.trim() && !recentSearches.includes(value)) {
      const updated = [value, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem("help-recent-searches", JSON.stringify(updated));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchQuery("");
    setSuggestions([]);
  };

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem("help-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher dans l'aide (ex: 'ajouter élève', 'notes'...)"
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          autoComplete="off"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {/* Panel de suggestions */}
      {(suggestions.length > 0 || query.length === 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
          {query.length === 0 ? (
            // Recherches populaires et récentes quand vide
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Recherches récentes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Recherches populaires</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Suggestions de recherche
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suggestions ({suggestions.length})
              </div>

              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {suggestion}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Cliquez pour rechercher
                    </div>
                  </div>
                </button>
              ))}

              <div className="border-t px-4 py-2">
                <div className="text-xs text-gray-500">
                  Appuyez sur{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">
                    Entrée
                  </kbd>{" "}
                  pour lancer la recherche complète
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conseils de recherche */}
      {query.length === 1 && (
        <div className="absolute z-40 w-full mt-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Astuce :</strong> Tapez au moins 2 caractères pour voir
                les suggestions
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Exemples : "élève", "notes", "paiement", "bulletin"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
