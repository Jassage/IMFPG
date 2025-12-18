import React, { useEffect, useState, useMemo } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import { ClassAssignmentForm } from "./classes/ClassAssignmentForm";

const ClassAssignmentManager = () => {
  const {
    assignments,
    loading,
    error,
    filters,
    fetchAssignments,
    setFilters,
    deleteAssignment,
    subjects,
    professeurs,
    academicYears,
    classLevels,
    loadFormData,
  } = useAssignmentStore();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchAssignments(), loadFormData()]);
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
  }, []);

  // Validation et nettoyage des données
  const safeAssignments = useMemo(() => {
    if (!Array.isArray(assignments)) {
      console.warn("⚠️ assignments n'est pas un tableau");
      return [];
    }

    // Filtrer les éléments valides
    const validAssignments = assignments.filter((assignment) => {
      const isValid =
        assignment &&
        typeof assignment === "object" &&
        assignment.id &&
        assignment.status;

      if (!isValid) {
        console.warn("⚠️ Élément invalide filtré:", assignment);
      }

      return isValid;
    });

    console.log(
      `✅ ${validAssignments.length} assignments valides sur ${assignments.length}`
    );
    return validAssignments;
  }, [assignments]);

  // Filtrage sécurisé
  const filteredAssignments = useMemo(() => {
    return safeAssignments.filter((assignment) => {
      try {
        // Validation de base
        if (!assignment || !assignment.status) return false;

        // Filtre par statut
        if (activeFilter === "active" && assignment.status !== "Active")
          return false;
        if (activeFilter === "inactive" && assignment.status !== "Inactive")
          return false;

        // Filtre par recherche
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const subjectName = assignment.subject?.name?.toLowerCase() || "";
          const professeurName = `${assignment.professeur?.firstName || ""} ${
            assignment.professeur?.lastName || ""
          }`.toLowerCase();
          const classLevel = assignment.classLevel?.toLowerCase() || "";

          return (
            subjectName.includes(searchLower) ||
            professeurName.includes(searchLower) ||
            classLevel.includes(searchLower)
          );
        }

        return true;
      } catch (err) {
        console.error("❌ Erreur lors du filtrage:", err, assignment);
        return false;
      }
    });
  }, [safeAssignments, activeFilter, searchTerm]);

  // Statistiques
  const stats = useMemo(() => {
    const activeCount = safeAssignments.filter(
      (a) => a.status === "Active"
    ).length;
    const inactiveCount = safeAssignments.filter(
      (a) => a.status === "Inactive"
    ).length;
    return { activeCount, inactiveCount, total: safeAssignments.length };
  }, [safeAssignments]);

  // Gestion des actions
  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette assignation ?")
    ) {
      try {
        await deleteAssignment(id);
        toast({
          title: "✅ Supprimé",
          description: "L'assignation a été supprimée avec succès",
        });
      } catch (err) {
        toast({
          title: "❌ Erreur",
          description: "Impossible de supprimer l'assignation",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleView = (assignment: any) => {
    setSelectedAssignment(assignment);
    toast({
      title: "Détails de l'assignation",
      description: `Matière: ${assignment.subject?.name || "N/A"}`,
    });
  };

  const handleRefresh = () => {
    fetchAssignments();
    toast({
      title: "🔄 Actualisé",
      description: "Liste des assignations actualisée",
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Afficher un état de chargement
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

  // Afficher une erreur
  if (error && safeAssignments.length === 0) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertDescription className="flex flex-col gap-2">
          <span>{error}</span>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="self-start w-fit"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
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
                onClick={() => {
                  setSelectedAssignment(null);
                  setIsFormOpen(true);
                }}
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
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>

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
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="active">Actives</TabsTrigger>
                  <TabsTrigger value="inactive">Inactives</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
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
                      value={filters.classLevel || ""}
                      onValueChange={(value) =>
                        setFilters({ classLevel: value || undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-classe">
                          Toutes les classes
                        </SelectItem>
                        {classLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilters({})}>
                    Réinitialiser les filtres
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des assignations */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des assignations</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredAssignments.length} résultat
              {filteredAssignments.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-muted-foreground/50 mb-4">
                <Filter className="h-full w-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
              <p className="text-muted-foreground mb-4">
                Aucune assignation ne correspond à vos critères de recherche
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                  setFilters({});
                }}
                variant="outline"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : viewMode === "table" || !isMobile ? (
            // Vue Tableau (Desktop ou mobile large)
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
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.subject?.name || "N/A"}
                        <div className="text-xs text-muted-foreground">
                          {assignment.subject?.code || "Code non disponible"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.professeur
                          ? `${assignment.professeur.firstName} ${assignment.professeur.lastName}`
                          : "N/A"}
                        <div className="text-xs text-muted-foreground">
                          {assignment.professeur?.matricule || ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {assignment.classLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.academicYear?.year || "N/A"}
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
                            <Button variant="ghost" size="icon">
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
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
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
            // Vue Grille (Mobile)
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">
                          {assignment.subject?.name || "N/A"}
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
                        <span className="text-muted-foreground w-24">
                          Professeur:
                        </span>
                        <span className="font-medium truncate">
                          {assignment.professeur
                            ? `${assignment.professeur.firstName} ${assignment.professeur.lastName}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-24">
                          Classe:
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {assignment.classLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-24">
                          Année:
                        </span>
                        <span className="truncate">
                          {assignment.academicYear?.year || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(assignment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            onSuccess={() => {
              setIsFormOpen(false);
              setSelectedAssignment(null);
              fetchAssignments();
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedAssignment(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassAssignmentManager;
