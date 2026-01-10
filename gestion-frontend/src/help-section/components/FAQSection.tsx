import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Bookmark,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { FAQItem } from "@/types/help.types";
import { getFAQsBySection, getAllFAQs } from "../data/helpData";
import { useHelp } from "../context/HelpContext";

interface FAQSectionProps {
  sectionId?: string;
  limit?: number;
  showFilters?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  sectionId,
  limit,
  showFilters = true,
}) => {
  const { userRole } = useHelp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [userFeedback, setUserFeedback] = useState<
    Record<string, "helpful" | "not-helpful">
  >({});

  // Récupérer les FAQs
  const allFAQs = useMemo(() => {
    if (sectionId) {
      return getFAQsBySection(sectionId as any);
    }
    return getAllFAQs();
  }, [sectionId]);

  // Filtrer et trier
  const filteredFAQs = useMemo(() => {
    let filtered = [...allFAQs];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Limiter si nécessaire
    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [allFAQs, searchTerm, selectedCategory, limit]);

  // Catégories disponibles
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allFAQs.map((faq) => faq.category)));
    return ["all", ...cats];
  }, [allFAQs]);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setUserFeedback((prev) => ({
      ...prev,
      [faqId]: isHelpful ? "helpful" : "not-helpful",
    }));

    // Ici, vous pourriez envoyer à une API
    console.log(
      `Feedback pour FAQ ${faqId}: ${isHelpful ? "utile" : "pas utile"}`
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionnel: Afficher un toast
  };

  const shareFAQ = (faq: FAQItem) => {
    if (navigator.share) {
      navigator.share({
        title: faq.question,
        text: faq.answer.substring(0, 100) + "...",
        url: window.location.href,
      });
    }
  };

  if (filteredFAQs.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune FAQ trouvée
        </h3>
        <p className="text-gray-600">
          {searchTerm
            ? `Aucun résultat pour "${searchTerm}"`
            : "Aucune question fréquente pour cette section."}
        </p>
      </div>
    );
  }

  return (
    <div className="faq-section">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Questions Fréquentes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredFAQs.length} question{filteredFAQs.length > 1 ? "s" : ""}{" "}
            trouvée{filteredFAQs.length > 1 ? "s" : ""}
            {sectionId && ` pour cette section`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            📚 Base de connaissances
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les FAQs..."
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Filter className="h-4 w-4" />
              <span>Filtrer par :</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "Toutes" : category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des FAQs */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          const feedback = userFeedback[faq.id];

          return (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          isExpanded
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="text-sm font-medium">?</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 pr-8">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {faq.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>Tags :</span>
                          {faq.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-gray-50 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {faq.tags.length > 2 && (
                            <span className="text-gray-400">
                              +{faq.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Réponse (expandable) */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-5">
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>

                    {/* Actions sur la FAQ */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Cette réponse était-elle utile ?
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            className={`p-1.5 rounded ${
                              feedback === "helpful"
                                ? "bg-green-100 text-green-600"
                                : "hover:bg-gray-100 text-gray-500"
                            }`}
                            title="Utile"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            className={`p-1.5 rounded ${
                              feedback === "not-helpful"
                                ? "bg-red-100 text-red-600"
                                : "hover:bg-gray-100 text-gray-500"
                            }`}
                            title="Pas utile"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(faq.answer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copier la réponse"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copier</span>
                        </button>

                        <button
                          onClick={() => shareFAQ(faq)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Partager"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Partager</span>
                        </button>

                        <button
                          onClick={() => {
                            /* Ajouter aux signets */
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ajouter aux signets"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Signet</span>
                        </button>
                      </div>
                    </div>

                    {/* FAQs liées */}
                    {sectionId && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Questions liées :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allFAQs
                            .filter((f) => f.id !== faq.id)
                            .slice(0, 3)
                            .map((relatedFaq) => (
                              <button
                                key={relatedFaq.id}
                                onClick={() => {
                                  setExpandedId(null);
                                  setTimeout(
                                    () => setExpandedId(relatedFaq.id),
                                    100
                                  );
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {relatedFaq.question}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pied de page */}
      {limit && allFAQs.length > limit && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => {
              /* Charger plus */
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voir plus de questions ({allFAQs.length - limit} restantes)
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Encart d'aide supplémentaire */}
      <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Vous ne trouvez pas votre réponse ?
            </h4>
            <p className="text-gray-700 mb-3">
              Notre équipe de support est disponible pour vous aider.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@ecole.fr"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                ✉️ Contacter le support
              </a>
              <button
                onClick={() => {
                  /* Ouvrir chat */
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg font-medium transition-colors"
              >
                💬 Chat en direct
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
