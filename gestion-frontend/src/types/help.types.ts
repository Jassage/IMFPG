import { LucideIcon } from "lucide-react";
import { ActiveTab, UserRole } from "@/types/navigation";

// Types de contenu d'aide
export type HelpContentType =
  | "text"
  | "steps"
  | "video"
  | "warning"
  | "tip"
  | "form"
  | "table"
  | "permissions";

// Étape de tutoriel
export interface TutorialStep {
  step: number;
  title: string;
  description: string;
  image?: string;
  codeSnippet?: string;
  action?: string; // Action à effectuer
}

// Ressource vidéo
export interface VideoResource {
  id: string;
  title: string;
  description: string;
  duration: string;
  url?: string; // URL YouTube ou local
  thumbnail: string;
  category: string;
}

// FAQ
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relatedTo: ActiveTab[]; // Lié à quels onglets
}

// Section d'aide
export interface HelpSection {
  id: ActiveTab; // Correspond aux onglets de navigation
  title: string;
  description: string;
  icon: string; // Nom de l'icône Lucide
  color: string; // Classes Tailwind
  permissions: string[]; // Permissions requises
  content: HelpContent[];
  quickActions?: QuickAction[];
  commonIssues?: CommonIssue[];
}

// Contenu détaillé
export interface HelpContent {
  id: string;
  title: string;
  type: HelpContentType;
  content: string | TutorialStep[] | VideoResource[] | FormFieldHelp[];
  targetRole: UserRole[]; // Rôles concernés
  importance: "low" | "medium" | "high";
}

// Aide pour les champs de formulaire
export interface FormFieldHelp {
  fieldName: string;
  label: string;
  description: string;
  validationRules?: string;
  examples?: string[];
  required: boolean;
}

// Actions rapides
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  path: string; // Route à naviguer
  shortcut?: string; // Raccourci clavier
}

// Problèmes courants
export interface CommonIssue {
  id: string;
  problem: string;
  solution: string;
  fixSteps: string[];
  preventTips: string[];
}

// Résultat de recherche
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  section: ActiveTab;
  category: string;
  score: number;
  icon: string;
}
export interface HistoryItem {
  id: string;
  title: string;
  section: string;
  viewedAt: Date;
  timeSpent: number;
}

// État du contexte d'aide
export interface HelpContextType {
  isHelpOpen: boolean;
  activeSection: ActiveTab;
  searchQuery: string;
  userRole: UserRole;
  viewedTopics: string[];
  bookmarks: string[];
  openHelp: (section?: ActiveTab) => void;
  closeHelp: () => void;
  setActiveSection: (section: ActiveTab) => void;
  setSearchQuery: (query: string) => void;
  addBookmark: (topicId: string) => void;
  removeBookmark: (topicId: string) => void;
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, "viewedAt">) => void;
  clearHistory: () => void;
  logView: (topicId: string) => void;
  getRoleSpecificHelp: (section: ActiveTab) => HelpContent[];
}
