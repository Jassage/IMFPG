import { useState, useCallback, useEffect } from "react";
// import { getHelpSectionsByRole, getAllFAQs } from '../data/helpData';
import { SearchResult } from "../types/help.types";
import {
  getAllFAQs,
  getHelpSectionsByRole,
} from "@/help-section/data/helpData";

export const useHelpSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Recherche avancée avec scoring
  const search = useCallback(async (query: string, role: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const sections = getHelpSectionsByRole(role as any);
    const faqs = getAllFAQs();
    const term = query.toLowerCase();

    const results: SearchResult[] = [];

    // Recherche dans les sections
    sections.forEach((section) => {
      let score = 0;

      // Titre de section (pondération forte)
      if (section.title.toLowerCase().includes(term)) score += 10;
      if (section.description.toLowerCase().includes(term)) score += 5;

      // Contenu de section
      section.content.forEach((content) => {
        let contentScore = 0;
        if (content.title.toLowerCase().includes(term)) contentScore += 8;

        if (contentScore > 0) {
          results.push({
            id: content.id,
            title: content.title,
            content:
              typeof content.content === "string"
                ? content.content.substring(0, 150) + "..."
                : "Voir les instructions détaillées",
            section: section.id,
            category: section.title,
            score: score + contentScore,
            icon: section.icon,
          });
        }
      });

      if (score > 0 && !results.some((r) => r.section === section.id)) {
        results.push({
          id: section.id,
          title: section.title,
          content: section.description,
          section: section.id,
          category: section.title,
          score,
          icon: section.icon,
        });
      }
    });

    // Recherche dans les FAQs
    faqs.forEach((faq) => {
      let score = 0;
      if (score > 0) {
        results.push({
          id: faq.id,
          title: faq.question,
          content: faq.answer.substring(0, 150) + "...",
          section: (faq.relatedTo[0] || "general") as any,
          category: "FAQ",
          score,
          icon: "HelpCircle",
        });
      }

      if (faq.question.toLowerCase().includes(term)) score += 10;
      if (faq.answer.toLowerCase().includes(term)) score += 5;
    });

    // Trier par score et limiter
    results.sort((a, b) => b.score - a.score);
    setSearchResults(results.slice(0, 20));

    // Générer des suggestions pour l'autocomplétion
    const allTexts = [
      ...sections.map((s) => s.title),
      ...sections.flatMap((s) => s.content.map((c) => c.title)),
      ...faqs.map((f) => f.question),
      ...sections.flatMap((s) => s.quickActions?.map((a) => a.label) || []),
    ];

    const uniqueSuggestions = Array.from(new Set(allTexts))
      .filter((text) => text.toLowerCase().includes(term))
      .slice(0, 8);

    setSuggestions(uniqueSuggestions);
    setIsSearching(false);
  }, []);

  // Recherche rapide (pour la barre de recherche)
  const quickSearch = useCallback((query: string, role: string) => {
    const sections = getHelpSectionsByRole(role as any);
    const term = query.toLowerCase();

    return sections
      .filter(
        (section) =>
          section.title.toLowerCase().includes(term) ||
          section.description.toLowerCase().includes(term) ||
          section.content.some((c) => c.title.toLowerCase().includes(term))
      )
      .slice(0, 5);
  }, []);

  return {
    searchResults,
    suggestions,
    isSearching,
    search,
    quickSearch,
  };
};
