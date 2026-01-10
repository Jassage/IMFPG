// src/components/help/HelpDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  Bookmark,
  History,
  Download,
  Printer,
  HelpCircle,
  BookOpen,
  CheckCircle,
  Image as ImageIcon,
  Grid,
  List,
  Filter,
  ChevronRight,
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Award,
  UserPlus,
  ClipboardCheck,
  ScrollText,
  Building,
  Wallet,
  Receipt,
  ShieldAlert,
  Database,
  Megaphone,
  UserCog,
  FileBarChart,
  RotateCcw,
  ChartBar,
  CreditCard,
  LogIn,
  FileX,
  Server,
  ShieldOff,
  Wrench,
  Plus,
  Star,
  ExternalLink,
  Video,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Clock,
  TrendingUp,
  Bookmark as BookmarkIcon,
  Zap,
  ArrowRight,
  Keyboard,
  Loader2,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import { useHelp } from "../context/HelpContext";
import { HelpSidebar } from "./HelpSidebar";
import { SearchHelp } from "./SearchHelp";
import { HelpContentRenderer } from "./HelpContentRenderer";
import { FAQSection } from "./FAQSection";
import { QuickActions } from "./QuickActions";
import { getHelpSectionsByRole, getSectionById } from "../data/helpData";
// import { WorkflowsIndex } from "./WorkflowsIndex";
// import { WorkflowGuide } from "./WorkflowGuide";
// import { ImageGallery } from "./ImageGallery";
// import { IMFPRoleBadge } from "./IMFPStyledComponents";
import { HelpImage } from "./HelpImage";
import { cn } from "@/lib/utils";
// import { IMFP_WORKFLOWS } from "./imfp-workflows";

// Images de galerie par section - DÉFINITION SÉCURISÉE
const SECTION_IMAGES: Record<
  string,
  Array<{
    src: string;
    alt: string;
    title: string;
    description: string;
    role: "admin" | "secretaire" | "professeur" | "directeur";
    category: string;
  }>
> = {
  dashboard: [
    {
      src: "admin/dashboard-annotated.png",
      alt: "Tableau de bord principal",
      title: "Tableau de bord",
      description: "Vue d'ensemble avec KPI et statistiques",
      role: "admin",
      category: "Tableau de bord",
    },
    {
      src: "admin/dashboard-widgets.png",
      alt: "Widgets personnalisables",
      title: "Widgets",
      description: "Personnalisation des widgets",
      role: "admin",
      category: "Tableau de bord",
    },
  ],
  students: [
    {
      src: "admin/students-list-annotated.png",
      alt: "Liste des élèves",
      title: "Liste des élèves",
      description: "Gestion complète de la liste",
      role: "admin",
      category: "Élèves",
    },
    {
      src: "admin/students-add-annotated.png",
      alt: "Ajout d'un élève",
      title: "Formulaire d'ajout",
      description: "Formulaire d'inscription",
      role: "admin",
      category: "Élèves",
    },
    {
      src: "admin/add-guardian-annotated.png",
      alt: "Ajout d'un parent",
      title: "Parents/Responsables",
      description: "Gestion des responsables",
      role: "admin",
      category: "Élèves",
    },
  ],
  grades: [
    {
      src: "professeur/grade-entry-annotated.png",
      alt: "Saisie des notes",
      title: "Grille de saisie",
      description: "Interface de saisie des notes",
      role: "professeur",
      category: "Notes",
    },
    {
      src: "professeur/grade-averages-annotated.png",
      alt: "Calcul des moyennes",
      title: "Calcul automatique",
      description: "Moyennes et statistiques",
      role: "professeur",
      category: "Notes",
    },
  ],
  announcements: [
    {
      src: "admin/announcements-create-annotated.png",
      alt: "Création d'annonce",
      title: "Nouvelle annonce",
      description: "Formulaire de création",
      role: "admin",
      category: "Communication",
    },
    {
      src: "admin/announcements-list-annotated.png",
      alt: "Liste des annonces",
      title: "Gestion des annonces",
      description: "Publication et archivage",
      role: "admin",
      category: "Communication",
    },
  ],
  // Sections par défaut pour éviter les erreurs
  default: [
    {
      src: "admin/dashboard-annotated.png",
      alt: "Capture d'écran exemple",
      title: "Exemple",
      description: "Capture d'écran annotée",
      role: "admin",
      category: "Général",
    },
  ],
};

// Helper function sécurisée
const getSectionImages = (sectionId?: string) => {
  if (!sectionId) return SECTION_IMAGES.default;

  const images = SECTION_IMAGES[sectionId];
  return images || SECTION_IMAGES.default;
};

export const HelpDashboard: React.FC = () => {
  const {
    isHelpOpen,
    closeHelp,
    activeSection,
    userRole,
    searchQuery,
    setActiveSection,
    history,
    addToHistory,
    clearHistory,
  } = useHelp();

  const [filteredSections, setFilteredSections] = useState(
    getHelpSectionsByRole(userRole)
  );
  const [activeView, setActiveView] = useState<
    "guide" | "workflows" | "gallery"
  >("guide");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showQuickTour, setShowQuickTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  // Filtrer les sections selon la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSections(getHelpSectionsByRole(userRole));
      return;
    }

    const query = searchQuery.toLowerCase();
    const sections = getHelpSectionsByRole(userRole);

    const filtered = sections.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query) ||
        section.content.some((content) =>
          content.title.toLowerCase().includes(query)
        )
    );

    setFilteredSections(filtered);
  }, [searchQuery, userRole]);

  const currentSection = getSectionById(activeSection, userRole);

  // Enregistrer la consultation dans l'historique
  useEffect(() => {
    if (currentSection && isHelpOpen) {
      addToHistory({
        id: currentSection.id,
        title: currentSection.title,
        section: currentSection.id,
        timeSpent: 0,
      });
    }
  }, [currentSection, isHelpOpen, addToHistory]);

  // Gérer les signets
  const toggleBookmark = (sectionId: string) => {
    setBookmarks((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Télécharger PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // En-tête
      doc.setFontSize(20);
      doc.text("Centre d'Aide SYSG-IMFP", 20, 20);
      doc.setFontSize(12);
      doc.text(`Section: ${currentSection?.title || "Général"}`, 20, 30);
      doc.text(`Rôle: ${userRole}`, 20, 37);
      doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 20, 44);

      // Contenu
      if (currentSection) {
        let yPosition = 60;

        currentSection.content.forEach((content, index) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(16);
          doc.text(`${index + 1}. ${content.title}`, 20, yPosition);
          yPosition += 10;

          doc.setFontSize(12);
          if (content.type === "text" && typeof content.content === "string") {
            const lines = doc.splitTextToSize(content.content, 170);
            lines.forEach((line: string) => {
              if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, 25, yPosition);
              yPosition += 7;
            });
          }
          yPosition += 10;
        });
      }

      doc.save(
        `aide-imfp-${currentSection?.id || "general"}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      alert("Erreur lors de la génération du PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Quick tour
  const tourSteps = [
    {
      title: "Bienvenue dans l'aide",
      description: "Découvrez comment utiliser le centre d'aide",
      target: "header",
    },
    {
      title: "Navigation",
      description: "Utilisez la sidebar pour naviguer entre les sections",
      target: "sidebar",
    },
    {
      title: "Recherche",
      description: "Tapez pour trouver rapidement ce que vous cherchez",
      target: "search",
    },
    {
      title: "Contenu",
      description: "Consultez les guides, workflows et captures",
      target: "content",
    },
  ];

  const handleNextTour = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowQuickTour(false);
    }
  };

  const handlePrevTour = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay avec flou */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={closeHelp}
      />

      {/* Quick Tour Modal */}
      {showQuickTour && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setShowQuickTour(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {tourSteps[tourStep].title}
              </h3>
              <button
                onClick={() => setShowQuickTour(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              {tourSteps[tourStep].description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full ${
                      idx === tourStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTour}
                  disabled={tourStep === 0}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={handleNextTour}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  {tourStep === tourSteps.length - 1 ? "Terminer" : "Suivant"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel principal */}
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="relative w-screen max-w-6xl">
          <div className="flex h-full flex-col bg-white shadow-2xl">
            {/* Header */}
            <div
              id="header"
              className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Centre d'Aide SYSG-IMFP
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bouton nouveau */}
                  <button
                    onClick={() => {
                      /* Ouvrir formulaire de feedback */
                    }}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors group relative"
                    title="Nouveau feedback"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-blue-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Nouveau feedback
                    </span>
                  </button>

                  {/* Bouton signets */}
                  {bookmarks.length > 0 && (
                    <button
                      onClick={() => {
                        /* Naviguer vers les signets */
                      }}
                      className="p-2 hover:bg-blue-700 rounded-lg transition-colors group relative"
                      title="Mes signets"
                    >
                      <BookmarkIcon className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {bookmarks.length}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Imprimer cette page"
                  >
                    <Printer className="h-5 w-5" />
                  </button>

                  <button
                    onClick={closeHelp}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Barre de recherche */}
              {/* <div id="search" className="mt-4">
                <SearchHelp />
              </div> */}

              {/* Breadcrumb */}
              {currentSection && (
                <div className="mt-3 flex items-center text-sm text-blue-100">
                  <button
                    onClick={() => setActiveSection("dashboard")}
                    className="hover:text-white flex items-center gap-1"
                  >
                    <Home className="h-3 w-3" />
                    Accueil
                  </button>
                  <ChevronRight className="h-3 w-3 mx-2" />
                  <span className="font-medium">{currentSection.title}</span>

                  {activeView !== "guide" && (
                    <>
                      <ChevronRight className="h-3 w-3 mx-2" />
                      <span className="capitalize">{activeView}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Contenu principal */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div
                id="sidebar"
                className="w-64 border-r bg-gradient-to-b from-gray-50 to-white overflow-y-auto"
              >
                <HelpSidebar sections={filteredSections} />

                {/* Section signets */}
                {bookmarks.length > 0 && (
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BookmarkIcon className="h-4 w-4 text-amber-500" />
                      <h4 className="font-semibold text-sm">Mes signets</h4>
                      <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                        {bookmarks.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {bookmarks.map((bookmarkId) => {
                        const section = getHelpSectionsByRole(userRole).find(
                          (s) => s.id === bookmarkId
                        );
                        if (!section) return null;

                        return (
                          <button
                            key={bookmarkId}
                            onClick={() => {
                              setActiveSection(section.id);
                              setActiveView("guide");
                              setSelectedWorkflow(null);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left hover:bg-gray-100 rounded"
                          >
                            <BookmarkIcon className="h-3 w-3 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{section.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Zone de contenu */}
              <div
                ref={contentRef}
                id="content"
                className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white/50"
              >
                {searchQuery ? (
                  // Résultats de recherche
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Résultats pour "{searchQuery}"
                        </h3>
                        <p className="text-gray-600">
                          {filteredSections.length} résultat
                          {filteredSections.length > 1 ? "s" : ""} trouvé
                          {filteredSections.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          /* Clear search */
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Effacer la recherche
                      </button>
                    </div>

                    {filteredSections.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">
                          Aucun résultat trouvé pour "{searchQuery}"
                        </p>
                        <p className="text-sm text-gray-400">
                          Essayez avec d'autres mots-clés ou consultez les
                          catégories
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSections.map((section) => (
                          <div
                            key={section.id}
                            onClick={() => {
                              setActiveSection(section.id);
                              setActiveView("guide");
                            }}
                            className="cursor-pointer bg-white border rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2.5 rounded-lg ${section.color} group-hover:scale-110 transition-transform`}
                              >
                                {/* Icône dynamique */}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                    {section.title}
                                  </h4>
                                  {bookmarks.includes(section.id) && (
                                    <BookmarkIcon className="h-3 w-3 text-amber-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {section.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                      {section.content.length} guide
                                      {section.content.length > 1 ? "s" : ""}
                                    </span>
                                    {section.quickActions && (
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                        {section.quickActions.length} action
                                        {section.quickActions.length > 1
                                          ? "s"
                                          : ""}
                                      </span>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : currentSection ? (
                  // Contenu de la section sélectionnée
                  <div className="p-6">
                    {/* En-tête de section avec onglets */}
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl ${currentSection.color} shadow-sm`}
                          >
                            {/* Icône dynamique */}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h1 className="text-2xl font-bold text-gray-900">
                                {currentSection.title}
                              </h1>
                              <button
                                onClick={() =>
                                  toggleBookmark(currentSection.id)
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                                title={
                                  bookmarks.includes(currentSection.id)
                                    ? "Retirer des signets"
                                    : "Ajouter aux signets"
                                }
                              >
                                <BookmarkIcon
                                  className={`h-4 w-4 ${
                                    bookmarks.includes(currentSection.id)
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {currentSection.description}
                            </p>
                          </div>
                        </div>

                        {/* Onglets de navigation */}
                        <div className="flex border rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              setActiveView("guide");
                              setSelectedWorkflow(null);
                            }}
                            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                              activeView === "guide"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <BookOpen className="h-4 w-4" />
                            Guide
                          </button>
                          <button
                            onClick={() => {
                              setActiveView("workflows");
                              setSelectedWorkflow(null);
                            }}
                            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                              activeView === "workflows"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Workflows
                          </button>
                          <button
                            onClick={() => setActiveView("gallery")}
                            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                              activeView === "gallery"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <ImageIcon className="h-4 w-4" />
                            Galerie
                          </button>
                        </div>
                      </div>

                      {/* Barre d'outils */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Dernière mise à jour:{" "}
                          {new Date().toLocaleDateString("fr-FR")}
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPDF}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                          >
                            {isGeneratingPDF ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            PDF
                          </button>
                          <button
                            onClick={() => {
                              if (contentRef.current) {
                                contentRef.current.requestFullscreen();
                              }
                            }}
                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                          >
                            Plein écran
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contenu selon la vue active */}
                    {activeView === "guide" && (
                      <>
                        {/* Actions rapides */}
                        {currentSection.quickActions &&
                          currentSection.quickActions.length > 0 && (
                            <div className="mb-8">
                              <QuickActions
                                actions={currentSection.quickActions}
                              />
                            </div>
                          )}

                        {/* Contenu principal */}
                        <div className="space-y-8">
                          {currentSection.content.map((content) => (
                            <HelpContentRenderer
                              key={content.id}
                              content={content}
                            />
                          ))}
                        </div>

                        {/* Problèmes courants */}
                        {currentSection.commonIssues &&
                          currentSection.commonIssues.length > 0 && (
                            <div className="mt-8">
                              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                  <ShieldAlert className="h-5 w-5" />
                                  Problèmes courants et solutions
                                </h3>
                                <div className="space-y-4">
                                  {currentSection.commonIssues.map((issue) => (
                                    <div
                                      key={issue.id}
                                      className="bg-white rounded-lg border p-4"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                          !
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-medium text-gray-900 mb-1">
                                            {issue.problem}
                                          </h4>
                                          <p className="text-sm text-gray-600 mb-2">
                                            {issue.solution}
                                          </p>
                                          {issue.fixSteps && (
                                            <div className="mt-2">
                                              <p className="text-xs font-medium text-gray-700 mb-1">
                                                Étapes de résolution:
                                              </p>
                                              <ol className="space-y-1 pl-4">
                                                {issue.fixSteps.map(
                                                  (step, idx) => (
                                                    <li
                                                      key={idx}
                                                      className="text-xs text-gray-600"
                                                    >
                                                      {idx + 1}. {step}
                                                    </li>
                                                  )
                                                )}
                                              </ol>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                        {/* FAQ liées */}
                        <div className="mt-8">
                          <FAQSection sectionId={currentSection.id} />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  // Page d'accueil de l'aide
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      {/* En-tête */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6">
                          <HelpCircle className="h-16 w-16 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                          Bienvenue dans le Centre d'Aide SYSG-IMFP
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                          Manuel d'utilisation complet avec guides étape par
                          étape, captures annotées et workflows pour tous les
                          rôles de votre établissement scolaire.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={() => setShowQuickTour(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Star className="h-4 w-4" />
                            Visite guidée
                          </button>
                          <button
                            onClick={() => {
                              /* Ouvrir vidéo tutoriel */
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Video className="h-4 w-4" />
                            Tutoriel vidéo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-3 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} SYSG-IMFP v2.0 • Centre d'Aide
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
