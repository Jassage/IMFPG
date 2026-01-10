// src/help-section/context/HelpContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { HelpContextType } from "@/types/help.types";
import { ActiveTab, UserRole } from "@/types/navigation";

const HelpContext = createContext<HelpContextType | undefined>(undefined);

interface HelpProviderProps {
  children: ReactNode;
  defaultRole?: UserRole;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({
  children,
  defaultRole = "Admin",
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(defaultRole);
  const [viewedTopics, setViewedTopics] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      title: string;
      section: string;
      viewedAt: Date;
      timeSpent: number;
    }>
  >([]);

  const openHelp = useCallback((section?: ActiveTab) => {
    setIsHelpOpen(true);
    if (section) {
      setActiveSection(section);
    }
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  // AJOUTER CES FONCTIONS :
  const addToHistory = useCallback(
    (item: {
      id: string;
      title: string;
      section: string;
      timeSpent: number;
    }) => {
      setHistory((prev) => {
        // Éviter les doublons
        const filtered = prev.filter((h) => h.id !== item.id);
        const newItem = {
          ...item,
          viewedAt: new Date(),
        };
        return [newItem, ...filtered].slice(0, 50); // Garder 50 max
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addBookmark = useCallback(
    (topicId: string) => {
      setBookmarks((prev) => [...prev, topicId]);
      localStorage.setItem(
        "help-bookmarks",
        JSON.stringify([...bookmarks, topicId])
      );
    },
    [bookmarks]
  );

  const removeBookmark = useCallback(
    (topicId: string) => {
      setBookmarks((prev) => prev.filter((id) => id !== topicId));
      localStorage.setItem(
        "help-bookmarks",
        JSON.stringify(bookmarks.filter((id) => id !== topicId))
      );
    },
    [bookmarks]
  );

  const logView = useCallback(
    (topicId: string) => {
      if (!viewedTopics.includes(topicId)) {
        setViewedTopics((prev) => [...prev, topicId]);
      }
    },
    [viewedTopics]
  );

  const getRoleSpecificHelp = useCallback(
    (section: ActiveTab) => {
      return [];
    },
    [userRole]
  );

  // Charger les signets au démarrage
  React.useEffect(() => {
    const savedBookmarks = localStorage.getItem("help-bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const value: HelpContextType = {
    isHelpOpen,
    activeSection,
    searchQuery,
    userRole,
    viewedTopics,
    bookmarks,
    history, // AJOUTER
    openHelp,
    closeHelp,
    setActiveSection,
    setSearchQuery,
    addBookmark,
    removeBookmark,
    logView,
    getRoleSpecificHelp,
    addToHistory, // AJOUTER
    clearHistory, // AJOUTER
  };

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error("useHelp must be used within a HelpProvider");
  }
  return context;
};
