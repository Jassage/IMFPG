import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
} from "lucide-react";
import { ClassAssignmentForm } from "./classes/ClassAssignmentForm";
import { ClassAssignment } from "@/types/academic";

// Constante pour les niveaux de classe
const CLASS_LEVELS = [
  "Sixieme",
  "Cinquieme",
  "Quatrieme",
  "Troisieme",
  "Seconde",
  "Premiere",
  "Terminale",
  "NSI",
  "NSII",
  "NSIII",
  "NSIV",
] as const;

// Constantes de pagination
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
const DEFAULT_ITEMS_PER_PAGE = 25;

// Constantes pour les filtres
const FILTER_OPTIONS = {
  ALL: "all",
  ACTIVE: "active", // Notez: "active" et non "actives"
  INACTIVE: "inactive", // Notez: "inactive" et non "inactives"
} as const;

type ClassLevel = (typeof CLASS_LEVELS)[number];

const ClassAssignmentManager = () => {
  const {
    assignments,
    loading,
    error,
    filters,
    fetchAssignments,
    setFilters,
    deleteAssignment,
  } = useAssignmentStore();

  // État de pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    DEFAULT_ITEMS_PER_PAGE
  );

  // États existants
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_OPTIONS.ALL);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ClassAssignment | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState<boolean>(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, filters.classLevel]);

  // Réinitialiser le formulaire quand il est fermé
  useEffect(() => {
    if (!isFormOpen) {
      setSelectedAssignment(null);
      setFormInitialized(false);
    }
  }, [isFormOpen]);

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchAssignments();
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données",
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [fetchAssignments]);

  // Validation et nettoyage des données
  const safeAssignments = useMemo(() => {
    if (!Array.isArray(assignments)) {
      console.warn("⚠️ assignments n'est pas un tableau", assignments);
      return [];
    }

    // Filtrer les éléments valides
    const validAssignments = assignments.filter((assignment: any) => {
      try {
        return (
          assignment &&
          typeof assignment === "object" &&
          assignment.id &&
          typeof assignment.id === "string" &&
          assignment.status &&
          typeof assignment.status === "string" &&
          ["Active", "Inactive"].includes(assignment.status) &&
          assignment.classLevel &&
          typeof assignment.classLevel === "string"
        );
      } catch (error) {
        console.warn("⚠️ Élément invalide filtré:", assignment, error);
        return false;
      }
    });

    console.log(
      `✅ ${validAssignments.length} assignments valides sur ${assignments.length}`
    );
    return validAssignments as ClassAssignment[];
  }, [assignments]);

  // Debug: Afficher les statistiques par statut
  useEffect(() => {
    if (safeAssignments.length > 0) {
      const activeCount = safeAssignments.filter(
        (a) => a.status === "Active"
      ).length;
      const inactiveCount = safeAssignments.filter(
        (a) => a.status === "Inactive"
      ).length;
      console.log("📊 Statistiques des assignations:", {
        total: safeAssignments.length,
        active: activeCount,
        inactive: inactiveCount,
        activeFilter,
        assignments: safeAssignments.map((a) => ({
          id: a.id,
          status: a.status,
          subject: a.subject?.name,
        })),
      });
    }
  }, [safeAssignments, activeFilter]);

  // Filtrage sécurisé (sans pagination) - CORRIGÉ
  const filteredAssignments = useMemo(() => {
    try {
      const result = safeAssignments.filter((assignment: ClassAssignment) => {
        // Filtre par statut - CORRECTION ICI
        if (
          activeFilter === FILTER_OPTIONS.ACTIVE &&
          assignment.status !== "Active"
        ) {
          console.log(
            "❌ Filtre ACTIVE: exclusion",
            assignment.id,
            assignment.status
          );
          return false;
        }
        if (
          activeFilter === FILTER_OPTIONS.INACTIVE &&
          assignment.status !== "Inactive"
        ) {
          console.log(
            "❌ Filtre INACTIVE: exclusion",
            assignment.id,
            assignment.status
          );
          return false;
        }

        // Filtre par recherche
        if (debouncedSearchTerm) {
          const searchLower = debouncedSearchTerm.toLowerCase();
          const subjectName = assignment.subject?.name?.toLowerCase() || "";
          const professeurName = `${assignment.professeur?.firstName || ""} ${
            assignment.professeur?.lastName || ""
          }`.toLowerCase();
          const classLevel = assignment.classLevel?.toLowerCase() || "";
          const subjectCode = assignment.subject?.code?.toLowerCase() || "";

          const matches =
            subjectName.includes(searchLower) ||
            professeurName.includes(searchLower) ||
            classLevel.includes(searchLower) ||
            subjectCode.includes(searchLower);

          if (!matches) {
            console.log("❌ Recherche: exclusion", assignment.id);
          }
          return matches;
        }

        // Filtre par niveau de classe
        if (filters.classLevel && filters.classLevel !== "all") {
          const matches = assignment.classLevel === filters.classLevel;
          if (!matches) {
            console.log(
              "❌ Classe: exclusion",
              assignment.id,
              assignment.classLevel,
              filters.classLevel
            );
          }
          return matches;
        }

        console.log("✅ Inclusion", assignment.id, assignment.status);
        return true;
      });

      console.log("📋 Résultat du filtrage:", {
        total: safeAssignments.length,
        filtrés: result.length,
        filtre: activeFilter,
        résultat: result.map((a) => ({ id: a.id, status: a.status })),
      });

      return result;
    } catch (err) {
      console.error("❌ Erreur critique lors du filtrage:", err);
      return [];
    }
  }, [safeAssignments, activeFilter, debouncedSearchTerm, filters.classLevel]);

  // Pagination des données
  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssignments.slice(startIndex, endIndex);
  }, [filteredAssignments, currentPage, itemsPerPage]);

  // Calcul des informations de pagination
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAssignments.length / itemsPerPage));
  }, [filteredAssignments.length, itemsPerPage]);

  // Vérifier si la page actuelle est valide
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Navigation de pagination
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Gestion du changement d'éléments par page
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Retour à la première page
  };

  // Statistiques
  const stats = useMemo(() => {
    const activeCount = safeAssignments.filter(
      (a: ClassAssignment) => a.status === "Active"
    ).length;
    const inactiveCount = safeAssignments.filter(
      (a: ClassAssignment) => a.status === "Inactive"
    ).length;
    return { activeCount, inactiveCount, total: safeAssignments.length };
  }, [safeAssignments]);

  // Gestion des actions
  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) {
        toast({
          title: "❌ Erreur",
          description: "ID d'assignation manquant",
          variant: "destructive",
        });
        return;
      }

      if (
        window.confirm(
          "Êtes-vous sûr de vouloir supprimer cette assignation ? Cette action est irréversible."
        )
      ) {
        setIsDeleting(id);
        try {
          await deleteAssignment(id);
          toast({
            title: "✅ Supprimé",
            description: "L'assignation a été supprimée avec succès",
          });
        } catch (err: any) {
          toast({
            title: "❌ Erreur",
            description: err.message || "Impossible de supprimer l'assignation",
            variant: "destructive",
          });
        } finally {
          setIsDeleting(null);
        }
      }
    },
    [deleteAssignment]
  );

  const handleEdit = useCallback((assignment: ClassAssignment) => {
    setSelectedAssignment(assignment);
    setFormInitialized(true);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((assignment: ClassAssignment) => {
    setSelectedAssignment(assignment);
    toast({
      title: "Détails de l'assignation",
      description: `Matière: ${assignment.subject?.name || "Non spécifiée"}`,
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchAssignments();
      toast({
        title: "🔄 Actualisé",
        description: "Liste des assignations actualisée",
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive",
      });
    }
  }, [fetchAssignments]);

  const handleFilterChange = useCallback((filter: string) => {
    console.log("Changement de filtre:", filter);
    setActiveFilter(filter);
  }, []);

  // Fonction pour formater l'affichage du niveau de classe
  const formatClassLevel = useCallback((level: string) => {
    if (!level) return "N/A";

    const levelMap: Record<string, string> = {
      Sixieme: "Sixième",
      Cinquieme: "Cinquième",
      Quatrieme: "Quatrième",
      Troisieme: "Troisième",
      Seconde: "Seconde",
      Premiere: "Première",
      Terminale: "Terminale",
      NSI: "NS I",
      NSII: "NS II",
      NSIII: "NS III",
      NSIV: "NS IV",
    };

    return levelMap[level] || level;
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setActiveFilter(FILTER_OPTIONS.ALL);
    setFilters({});
    setCurrentPage(1);
  }, [setFilters]);

  // Fonction pour ouvrir le formulaire de création
  const handleOpenCreateForm = useCallback(() => {
    setSelectedAssignment(null);
    setFormInitialized(true);
    setIsFormOpen(true);
  }, []);

  // Debug: Vérifier ce qui est affiché
  useEffect(() => {
    console.log("🔍 État actuel:", {
      activeFilter,
      filteredCount: filteredAssignments.length,
      paginatedCount: paginatedAssignments.length,
      currentPage,
      totalPages,
    });
  }, [
    activeFilter,
    filteredAssignments,
    paginatedAssignments,
    currentPage,
    totalPages,
  ]);

  // Afficher un état de chargement initial
  if (loading && safeAssignments.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Chargement des assignations...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Afficher un état vide
  if (!loading && safeAssignments.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 text-muted-foreground/50 mb-4">
              <Plus className="h-full w-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune assignation</h3>
            <p className="text-muted-foreground mb-6">
              Commencez par créer votre première assignation
            </p>
            <Button
              onClick={handleOpenCreateForm}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer une assignation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Impossible de charger les assignations"}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header avec statistiques et actions */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Gestion des assignations
              </h2>
              <p className="text-muted-foreground">
                Assignez des matières aux professeurs par classe
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleOpenCreateForm}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle assignation</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>

              {!isMobile && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "grid" : "table")
                  }
                  className="flex items-center gap-2"
                >
                  {viewMode === "table" ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Vue grille</span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-0.5 h-3 w-3">
                          <div className="bg-current rounded-sm" />
                          <div className="bg-current rounded-sm" />
                          <div className="bg-current rounded-sm" />
                          <div className="bg-current rounded-sm" />
                        </div>
                      </div>
                      <span className="hidden sm:inline">Vue tableau</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Badge variant="outline">Toutes</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Actives
                    </p>
                    <p className="text-2xl font-bold">{stats.activeCount}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actives
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Inactives
                    </p>
                    <p className="text-2xl font-bold">{stats.inactiveCount}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactives
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par matière, professeur ou classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                  aria-label="Rechercher des assignations"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <Tabs
                value={activeFilter}
                onValueChange={handleFilterChange}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value={FILTER_OPTIONS.ALL}>Toutes</TabsTrigger>
                  <TabsTrigger value={FILTER_OPTIONS.ACTIVE}>
                    Actives
                  </TabsTrigger>
                  <TabsTrigger value={FILTER_OPTIONS.INACTIVE}>
                    Inactives
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    aria-label="Filtres avancés"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtres avancés</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">
                      Filtrer par classe
                    </p>
                    <Select
                      value={filters.classLevel || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          classLevel: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les classes</SelectItem>
                        {CLASS_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {formatClassLevel(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={resetFilters}>
                    Réinitialiser les filtres
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Indicateur de filtre actif */}
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilter !== FILTER_OPTIONS.ALL && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {activeFilter === FILTER_OPTIONS.ACTIVE
                  ? "Actives"
                  : "Inactives"}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setActiveFilter(FILTER_OPTIONS.ALL)}
                >
                  ×
                </Button>
              </Badge>
            )}
            {filters.classLevel && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Classe: {formatClassLevel(filters.classLevel)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({})}
                >
                  ×
                </Button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Recherche: "{searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des assignations */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <span>Liste des assignations</span>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Affichage {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAssignments.length
                )}{" "}
                sur {filteredAssignments.length} résultat
                {filteredAssignments.length !== 1 ? "s" : ""}
                {searchTerm && ` pour "${searchTerm}"`}
              </div>
            </div>

            {/* Sélecteur d'éléments par page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Éléments par page:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-muted-foreground/50 mb-4">
                <Filter className="h-full w-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === FILTER_OPTIONS.ACTIVE
                  ? "Aucune assignation active trouvée"
                  : activeFilter === FILTER_OPTIONS.INACTIVE
                  ? "Aucune assignation inactive trouvée"
                  : "Aucune assignation ne correspond à vos critères de recherche"}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={resetFilters} variant="outline">
                  Réinitialiser les filtres
                </Button>
                {activeFilter !== FILTER_OPTIONS.ALL && (
                  <Button
                    onClick={() => setActiveFilter(FILTER_OPTIONS.ALL)}
                    variant="default"
                  >
                    Voir toutes les assignations
                  </Button>
                )}
              </div>
            </div>
          ) : viewMode === "table" && !isMobile ? (
            // Vue Tableau (Desktop)
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Professeur</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Année Académique</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssignments.map((assignment: ClassAssignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.subject?.name || "Non spécifié"}
                        <div className="text-xs text-muted-foreground">
                          {assignment.subject?.code || "Code non disponible"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.professeur
                          ? `${assignment.professeur.firstName || ""} ${
                              assignment.professeur.lastName || ""
                            }`
                          : "Non assigné"}
                        <div className="text-xs text-muted-foreground">
                          {assignment.professeur?.matricule || ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {formatClassLevel(assignment.classLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.academicYear?.year || "Non spécifiée"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assignment.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            assignment.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }
                        >
                          {assignment.status === "Active" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Menu des actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(assignment)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(assignment)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(assignment.id)}
                              className="text-red-600"
                              disabled={isDeleting === assignment.id}
                            >
                              {isDeleting === assignment.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              {isDeleting === assignment.id
                                ? "Suppression..."
                                : "Supprimer"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Vue Grille (Mobile ou choix utilisateur)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAssignments.map((assignment: ClassAssignment) => (
                <Card
                  key={assignment.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">
                          {assignment.subject?.name || "Non spécifié"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {assignment.subject?.code || ""}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          assignment.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {assignment.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-24 shrink-0">
                          Professeur:
                        </span>
                        <span className="font-medium truncate">
                          {assignment.professeur
                            ? `${assignment.professeur.firstName || ""} ${
                                assignment.professeur.lastName || ""
                              }`
                            : "Non assigné"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-24 shrink-0">
                          Classe:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {formatClassLevel(assignment.classLevel)}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-24 shrink-0">
                          Année:
                        </span>
                        <span className="truncate">
                          {assignment.academicYear?.year || "Non spécifiée"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(assignment)}
                        aria-label="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(assignment)}
                        aria-label="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Supprimer"
                        disabled={isDeleting === assignment.id}
                      >
                        {isDeleting === assignment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Contrôles de pagination */}
          {filteredAssignments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} •{" "}
                {filteredAssignments.length} assignations
                {activeFilter === FILTER_OPTIONS.ACTIVE && " (actives)"}
                {activeFilter === FILTER_OPTIONS.INACTIVE && " (inactives)"}
              </div>

              <div className="flex items-center space-x-2">
                {/* Bouton première page */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  aria-label="Première page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Bouton page précédente */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Numéro de page */}
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm font-medium">
                    Page {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Bouton page suivante */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Page suivante"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Bouton dernière page */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  aria-label="Dernière page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Sélecteur de page (optionnel) */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Aller à:</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value, 10);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-20"
                  aria-label="Numéro de page"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue de formulaire */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignment
                ? "Modifier l'assignation"
                : "Nouvelle assignation"}
            </DialogTitle>
            <DialogDescription>
              {selectedAssignment
                ? "Modifiez les informations de l'assignation"
                : "Créez une nouvelle assignation matière-professeur-classe"}
            </DialogDescription>
          </DialogHeader>
          <ClassAssignmentForm
            assignment={selectedAssignment}
            isInitialized={formInitialized}
            onSuccess={() => {
              setIsFormOpen(false);
              setSelectedAssignment(null);
              setFormInitialized(false);
              fetchAssignments();
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedAssignment(null);
              setFormInitialized(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassAssignmentManager;
