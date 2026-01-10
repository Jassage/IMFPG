import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Building,
  UserCog,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useClassStore, SchoolClass } from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import { toast } from "react-toastify";

// Schéma de validation avec Zod
const classSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
  level: z.enum([
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
  ]),

  capacity: z
    .number()
    .min(5, { message: "La capacité minimale est de 5 élèves" })
    .max(50, { message: "La capacité maximale est de 50 élèves" })
    .optional()
    .default(30),
});

type ClassFormData = z.infer<typeof classSchema>;

export const ClassesManager = () => {
  const {
    classes,
    fetchClasses,
    fetchClassById,
    createClass,
    updateClass,
    deleteClass,
    loading,
    error,
    filters,
    setFilters,
    academicYears,
    fetchAcademicYears,
    availableTeachers,
  } = useClassStore();

  const { fetchAcademicYears: fetchYears } = useAcademicYearStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SchoolClass;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  // Ajoute cet état pour les statistiques
  const [classStats, setClassStats] = useState<Record<string, number>>({});
  const [loadingStats, setLoadingStats] = useState(false);

  // Fonction pour récupérer le nombre d'élèves par classe
  const fetchStudentsCount = async () => {
    setLoadingStats(true);
    try {
      const counts: Record<string, number> = {};

      // Pour chaque classe, récupérer les statistiques
      const promises = classes.map(async (cls) => {
        try {
          const response = await api.get(`/classes/${cls.id}/stats`);
          if (response.data.success) {
            counts[cls.id] = response.data.data.totalStudents || 0;
          }
        } catch (error) {
          console.error(`Erreur pour la classe ${cls.id}:`, error);
          counts[cls.id] = 0;
        }
      });

      await Promise.all(promises);
      setClassStats(counts);
    } catch (error) {
      console.error("Erreur récupération des statistiques:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Charger les statistiques quand les classes changent
  useEffect(() => {
    if (classes.length > 0) {
      fetchStudentsCount();
    }
  }, [classes]);
  // Initialisation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      level: "Sixieme",
      capacity: 30,
    },
  });

  useEffect(() => {
    fetchClasses();
    fetchAcademicYears();
    // fetchYears();
  }, [fetchClasses, fetchAcademicYears, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEdit = async (classItem: SchoolClass) => {
    try {
      const classDetails = await fetchClassById(classItem.id);
      setEditingClass(classDetails);

      setValue("name", classDetails.name);
      setValue(
        "level",
        classDetails.level as
          | "Sixieme"
          | "Cinquieme"
          | "Quatrieme"
          | "Troisieme"
          | "Seconde"
          | "Premiere"
          | "Terminale"
          | "NSI"
          | "NSII"
          | "NSIII"
          | "NSIV"
      );
      setValue("capacity", classDetails.capacity);

      setIsFormOpen(true);
    } catch (error) {
      toast.error("Impossible de charger les détails de la classe");
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEditingClass(null);
    reset({
      name: "",
      level: "Sixieme",
      capacity: 30,
    });
  };

  // Soumission du formulaire
  const onSubmit = async (data: ClassFormData) => {
    try {
      if (editingClass) {
        await updateClass(editingClass.id, data);
        toast.success(`La classe ${data.name} a été modifiée avec succès`);
      } else {
        await createClass(data);
        toast.success(`La classe ${data.name} a été ajoutée avec succès`);
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error: any) {}
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;

    try {
      await deleteClass(selectedClass.id);
      toast.success("La classe a été supprimée avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setShowDeleteDialog(false);
      setSelectedClass(null);
    }
  };

  const handleSort = (key: keyof SchoolClass) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel = filters.level
      ? classItem.level === filters.level
      : true;
    const matchesStatus = filters.status
      ? classItem.status === filters.status
      : true;

    // Filtre par onglet
    if (activeTab === "active") {
      return matchesSearch && matchesLevel && classItem.status === "Active";
    } else if (activeTab === "inactive") {
      return matchesSearch && matchesLevel && classItem.status !== "Active";
    }

    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Trier les classes
  const sortedClasses = [...filteredClasses];
  if (sortConfig !== null) {
    sortedClasses.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      Sixieme: "6ème",
      Cinquieme: "5ème",
      Quatrieme: "4ème",
      Troisieme: "3ème",
      Seconde: "2nde",
      Premiere: "1ère",
      Terminale: "Terminale",
      NSI: "NSI",
      NSII: "NSII",
      NSIII: "NSIII",
      NSIV: "NSIV",
    };
    return levels[level] || level;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Archived":
        return "outline";
      default:
        return "outline";
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof SchoolClass }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getCurrentAcademicYear = () => {
    const currentYear = academicYears.find((year) => year.isCurrent);
    return currentYear?.id || "";
  };

  if (loading && classes.length === 0) {
    <Loader2 className="h-6 w-6 animate-spin mx-auto mt-8" />;
  }

  return (
    <div className="space-y-6">
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la classe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la classe {selectedClass?.name}{" "}
              ? Cette action est irréversible et affectera les élèves assignés à
              cette classe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* En-tête */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Classes
          </h1>
          <p className="text-muted-foreground">
            Gérez les classes de l'établissement
          </p>
        </div>

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Classe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Modifier Classe" : "Ajouter une classe"}
              </DialogTitle>
              <DialogDescription>
                {editingClass
                  ? "Modifier les informations de la classe"
                  : "Ajouter une nouvelle classe à l'établissement"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input id="name" {...register("name")} placeholder="6ème A" />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    min="5"
                    max="50"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau *</Label>
                <Select
                  value={watch("level")}
                  onValueChange={(value) => setValue("level", value as any)}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sixieme">6ème</SelectItem>
                    <SelectItem value="Cinquieme">5ème</SelectItem>
                    <SelectItem value="Quatrieme">4ème</SelectItem>
                    <SelectItem value="Troisieme">3ème</SelectItem>
                    <SelectItem value="Seconde">2nde</SelectItem>
                    <SelectItem value="Premiere">1ère</SelectItem>
                    <SelectItem value="Terminale">Terminale</SelectItem>
                    <SelectItem value="NSI">NSI</SelectItem>
                    <SelectItem value="NSII">NSII</SelectItem>
                    <SelectItem value="NSIII">NSIII</SelectItem>
                    <SelectItem value="NSIV">NSIV</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Traitement..."
                    : editingClass
                    ? "Modifier"
                    : "Ajouter"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Annuler
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres et onglets */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Actives
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              Inactives
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select
              value={filters.level}
              onValueChange={(value) =>
                setFilters({ level: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>

                <SelectItem value="Sixieme">6ème</SelectItem>
                <SelectItem value="Cinquieme">5ème</SelectItem>
                <SelectItem value="Quatrieme">4ème</SelectItem>
                <SelectItem value="Troisieme">3ème</SelectItem>
                <SelectItem value="Seconde">2nde</SelectItem>
                <SelectItem value="Premiere">1ère</SelectItem>
                <SelectItem value="Terminale">Terminale</SelectItem>
                <SelectItem value="NSI">NSI</SelectItem>
                <SelectItem value="NSII">NSII</SelectItem>
                <SelectItem value="NSIII">NSIII</SelectItem>
                <SelectItem value="NSIV">NSIV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Classes totales
                </p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Classes actives
                </p>
                <p className="text-2xl font-bold">
                  {classes.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Élèves total
                </p>
                <p className="text-2xl font-bold">
                  {classes.reduce(
                    (total, cls) => total + (cls._count?.students || 0),
                    0
                  )}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des classes */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      <span>Classe</span>
                      <SortIcon columnKey="name" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("level")}
                  >
                    <div className="flex items-center">
                      <span>Niveau</span>
                      <SortIcon columnKey="level" />
                    </div>
                  </TableHead>
                  <TableHead>Élèves</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div className="font-medium">{classItem.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Capacité: {classItem.capacity} élèves
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getLevelLabel(classItem.level)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-[100px]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {classStats[classItem.id] ||
                                classItem._count?.students ||
                                0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              / {classItem.capacity}
                            </span>
                          </div>
                          {/* Barre de progression */}
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((classStats[classItem.id] ||
                                    classItem._count?.students ||
                                    0) /
                                    classItem.capacity) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                          {/* Pourcentage */}
                          <div className="text-xs text-muted-foreground mt-1 text-right">
                            {Math.round(
                              ((classStats[classItem.id] ||
                                classItem._count?.students ||
                                0) /
                                classItem.capacity) *
                                100
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(classItem.status)}>
                        {classItem.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(classItem)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedClass(classItem);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {sortedClasses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune classe trouvée</p>
                {filters.academicYearId && (
                  <Button
                    variant="link"
                    onClick={() => setFilters({ academicYearId: "" })}
                    className="mt-2"
                  >
                    Voir toutes les années
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {classes.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Affichage de {sortedClasses.length} sur {classes.length} classes
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: (filters.page || 1) - 1 })}
              disabled={filters.page === 1}
            >
              Précédent
            </Button>
            <span className="text-sm">Page {filters.page || 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: (filters.page || 1) + 1 })}
              disabled={
                (filters.page || 1) * sortedClasses.length >= classes.length
              }
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
