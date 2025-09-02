import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Building2,
  Edit,
  Trash2,
  Users,
  BookOpen,
  ChevronRight,
  School,
  Calendar,
  UserCog,
  Loader2,
  BarChart3,
  Target,
  Sparkles,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  RotateCcw,
  Eye,
  GraduationCap,
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initializeFacultyStore, useFacultyStore } from "../store/facultyStore";
import { FacultyWithLevels } from "../types/academic";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";

export const FacultiesManager = () => {
  const {
    faculties,
    loading,
    error,
    fetchFaculties,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyStats,
  } = useFacultyStore();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] =
    useState<FacultyWithLevels | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    dean: "",
    studyDuration: 3,
    status: "Active" as "Active" | "Inactive",
  });
  const [stats, setStats] = useState<any>(null);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chargement initial
  useEffect(() => {
    initializeFacultyStore();
    loadStats();
  }, []);

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const statsData = await getFacultyStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erreur stats:", error);
    }
  };

  // Recherche de facultés
  const handleSearch = (searchTerm: string) => {
    fetchFaculties({ search: searchTerm });
  };

  // Filtrage par statut
  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.dean.trim()
    ) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const facultyData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        dean: formData.dean.trim(),
        studyDuration: Number(formData.studyDuration),
        status: formData.status,
      };

      if (selectedFaculty) {
        await updateFaculty(selectedFaculty.id, facultyData);
        toast({
          title: "Faculté mise à jour",
          description: "La faculté a été modifiée avec succès",
        });
      } else {
        await addFaculty(facultyData);
        toast({
          title: "Faculté créée",
          description: "La nouvelle faculté a été créée avec succès",
        });
      }

      setIsFormOpen(false);
      resetForm();
      loadStats();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error.response?.data?.message ||
          error.message ||
          "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      dean: "",
      studyDuration: 3,
      status: "Active",
    });
    setSelectedFaculty(null);
  };

  const handleEdit = (faculty: FacultyWithLevels) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description || "",
      dean: faculty.dean || "",
      studyDuration: faculty.studyDuration,
      status: faculty.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFaculty) return;

    try {
      await deleteFaculty(selectedFaculty.id);
      setIsDeleteDialogOpen(false);
      setSelectedFaculty(null);
      toast({
        title: "Faculté supprimée",
        description: "La faculté a été supprimée avec succès",
      });
      loadStats();
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      toast({
        title: "Erreur",
        description:
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const toggleFacultyExpansion = (facultyId: string) => {
    setExpandedFaculty(expandedFaculty === facultyId ? null : facultyId);
  };

  const filteredFaculties =
    faculties?.filter((faculty) => {
      const matchesSearch =
        faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty?.code?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || faculty.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  if (loading && !faculties.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des facultés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4 flex items-center justify-center gap-2">
          <X className="h-5 w-5" />
          Erreur: {error}
        </div>
        <Button
          onClick={() => fetchFaculties()}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Gestion des Facultés
          </h1>
          <p className="text-muted-foreground">
            Administration des facultés et programmes d'études
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Faculté
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedFaculty
                  ? "Modifier la Faculté"
                  : "Créer une nouvelle Faculté"}
              </DialogTitle>
              <DialogDescription>
                {selectedFaculty
                  ? `Modifiez les informations de la faculté ${selectedFaculty.name}`
                  : "Ajoutez une nouvelle faculté à votre établissement"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <span>Nom de la faculté</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Faculté des Sciences"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <span>Code</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="FST"
                    className="uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Doyen</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.dean}
                  onChange={(e) =>
                    setFormData({ ...formData, dean: e.target.value })
                  }
                  placeholder="Pr. Jean Dupont"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Durée d'étude</span>
                  </Label>
                  <Select
                    value={formData.studyDuration.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        studyDuration: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la durée" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} an{year > 1 ? "s" : ""} (Niveaux:{" "}
                          {Array.from(
                            { length: year },
                            (_, i) => `L${i + 1}`
                          ).join(", ")}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <UserCog className="h-4 w-4" />
                    <span>Statut</span>
                  </Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        checked={formData.status === "Active"}
                        onChange={() =>
                          setFormData({ ...formData, status: "Active" })
                        }
                      />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        checked={formData.status === "Inactive"}
                        onChange={() =>
                          setFormData({ ...formData, status: "Inactive" })
                        }
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description de la faculté..."
                  rows={3}
                  className="min-h-[100px]"
                />
              </div>

              <Separator className="my-2" />

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="border-gray-300"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : selectedFaculty ? (
                    "Mettre à jour"
                  ) : (
                    "Créer la faculté"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Total Facultés
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats.totalFaculties}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-200">
                  <Building2 className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Facultés Actives
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats.activeFaculties}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-200">
                  <Target className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Total Étudiants
                  </p>
                  <p className="text-3xl font-bold text-amber-900">
                    {stats.totalStudents}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-200">
                  <Users className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Total Cours
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats.totalCourses}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-200">
                  <BookOpenCheck className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une faculté par nom ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={handleFilterByStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Active">Actives</SelectItem>
                <SelectItem value="Inactive">Inactives</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions groupées</DropdownMenuLabel>
                <DropdownMenuItem className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter les données
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importer des facultés
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onClick={loadStats}
                >
                  <RotateCcw className="h-4 w-4" />
                  Actualiser les données
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Liste des facultés */}
      {filteredFaculties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredFaculties.map((faculty) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={cn(
                  "overflow-hidden transition-all hover:shadow-md border",
                  expandedFaculty === faculty.id && "border-blue-300"
                )}
              >
                <CardHeader
                  className="pb-3 bg-gradient-to-r from-muted/10 to-muted/5 cursor-pointer"
                  onClick={() => toggleFacultyExpansion(faculty.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          <School className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-2">
                            {faculty.name}
                            <Badge
                              variant="secondary"
                              className="font-mono text-sm"
                            >
                              {faculty.code}
                            </Badge>
                            <Badge
                              variant={
                                faculty.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="ml-2"
                            >
                              {faculty.status === "Active"
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <span className="bg-primary/10 px-2 py-1 rounded text-xs">
                              {faculty.studyDuration} an
                              {faculty.studyDuration > 1 ? "s" : ""}
                            </span>
                            {faculty.dean && (
                              <span className="flex items-center gap-1">
                                <UserCog className="h-3 w-3" />
                                {faculty.dean}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {expandedFaculty === faculty.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedFaculty === faculty.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />

                        {faculty.description && (
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2">
                              Description
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {faculty.description}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold text-blue-700">
                              {faculty.studentsCount || 0}
                            </div>
                            <div className="text-xs text-blue-600">
                              Étudiants
                            </div>
                          </div>

                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold text-green-700">
                              {faculty.coursesCount || 0}
                            </div>
                            <div className="text-xs text-green-600">Cours</div>
                          </div>

                          <div className="text-center p-3 bg-amber-50 rounded-lg">
                            <GraduationCap className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                            <div className="text-2xl font-bold text-amber-700">
                              {faculty.levels?.length || 0}
                            </div>
                            <div className="text-xs text-amber-600">
                              Niveaux
                            </div>
                          </div>
                        </div>

                        {faculty.levels && faculty.levels.length > 0 && (
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2">
                              Niveaux offerts
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {faculty.levels.map((level) => (
                                <Badge
                                  key={
                                    typeof level === "string" ? level : level.id
                                  }
                                  variant="outline"
                                  className="px-3 py-1"
                                >
                                  {typeof level === "string"
                                    ? level
                                    : level.level}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(faculty)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFaculty(faculty);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                          <Button size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Voir détails
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-muted/5 to-muted/10 rounded-lg border-2 border-dashed">
          <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Aucune faculté trouvée
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            {searchTerm || statusFilter !== "all"
              ? `Aucun résultat pour votre recherche. Essayez d'autres termes ou modifiez les filtres.`
              : "Commencez par créer votre première faculté pour organiser vos programmes d'études."}
          </p>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Créer une faculté
          </Button>
        </div>
      )}

      {/* Dialogue de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Supprimer la faculté
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la faculté "
              {selectedFaculty?.name}" ? Cette action est irréversible et
              supprimera toutes les données associées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
