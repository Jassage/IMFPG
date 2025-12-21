// components/students/StudentsManager.tsx - VERSION CORRIGÉE
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  GraduationCap,
  Download,
  Upload,
  Filter,
  MoreVertical,
  User,
  ArrowLeft,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ChevronDown,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useStudentStore } from "@/store/studentStore";
import { Student } from "@/types/academic";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentForm } from "./students/StudentForm";
import { useClassStore } from "@/store/classStore";
import { StudentDetails } from "./students/StudentDetails";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Constantes pour les valeurs "vides"
const EMPTY_VALUES = {
  ALL: "all",
  NO_CLASS: "no-class",
  NONE: "none",
  NOT_ASSIGNED: "not-assigned",
  NOT_SPECIFIED: "not-specified",
} as const;

// Fonctions utilitaires
const getStatusLabel = (status: Student["status"]) => {
  const labels: Record<Student["status"], string> = {
    Active: "Actif",
    Inactive: "Inactif",
    Graduated: "Diplômé",
    Transferred: "Transféré",
    Suspended: "Suspendu",
  };
  return labels[status] || status;
};

const getStatusBadgeVariant = (status: Student["status"]) => {
  const variants: Record<
    Student["status"],
    "default" | "secondary" | "outline" | "destructive"
  > = {
    Active: "default",
    Inactive: "secondary",
    Graduated: "outline",
    Transferred: "secondary",
    Suspended: "destructive",
  };
  return variants[status] || "secondary";
};

// Composant Squelette de chargement
const StudentSkeleton = () => (
  <Card className="p-4 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </Card>
);

// Composant Carte Étudiant
const StudentCard = ({
  student,
  onViewDetails,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
  isSelecting,
}: {
  student: Student;
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  isSelected: boolean;
  onSelect: (studentId: string) => void;
  isSelecting: boolean;
}) => {
  const { classes } = useClassStore();

  const studentClass = student.classId
    ? classes.find((c) => c.id === student.classId)
    : null;

  return (
    <Card className="mb-4 relative hover:shadow-md transition-shadow duration-200">
      {isSelecting && (
        <div className="absolute top-4 left-4 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(student.id)}
            aria-label={`Sélectionner ${student.firstName} ${student.lastName}`}
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={student.photo} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {student.firstName?.[0] || ""}
                {student.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate flex items-center gap-2">
                {student.firstName} {student.lastName}
                {student.status === "Active" && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-mono truncate">
                {student.studentCode}
              </div>
              <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant={getStatusBadgeVariant(student.status)}>
                  {getStatusLabel(student.status)}
                </Badge>
                {studentClass && (
                  <Badge variant="outline">{studentClass.name}</Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(student)}>
                <GraduationCap className="h-4 w-4 mr-2" />
                Détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(student)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(student.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Téléphone
            </div>
            <div className="truncate">{student.phone || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" />
              Classe
            </div>
            <div className="truncate">
              {studentClass?.name || "Non assigné"}
            </div>
          </div>
          {student.dateOfBirth && (
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date de naissance
              </div>
              <div className="truncate">
                {new Date(student.dateOfBirth).toLocaleDateString("fr-FR")}
              </div>
            </div>
          )}
          {student.address && (
            <div>
              <div className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Adresse
              </div>
              <div className="truncate">{student.address}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Composant Pagination
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>
            Affichage de {startIndex} à {endIndex} sur {totalItems} étudiant(s)
          </>
        ) : (
          <>Aucun étudiant</>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden md:block">
            Éléments par page
          </p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => {
              onItemsPerPageChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center text-sm font-medium w-8">
              {currentPage}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Barre d'actions groupées
const BulkActionsBar = ({
  selectedCount,
  onDeselectAll,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
  onBulkAssignClass,
}: {
  selectedCount: number;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: Student["status"]) => void;
  onBulkExport: () => void;
  onBulkAssignClass: () => void;
}) => {
  return (
    <Card className="bg-blue-50 border-blue-200 mb-4">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">
              {selectedCount} étudiant(s) sélectionné(s)
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Modifier le statut
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onBulkStatusChange("Active")}>
                  Marquer comme actif
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBulkStatusChange("Inactive")}
                >
                  Marquer comme inactif
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBulkStatusChange("Graduated")}
                >
                  Marquer comme diplômé
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBulkStatusChange("Suspended")}
                >
                  Marquer comme suspendu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onBulkAssignClass}
            >
              <Building className="h-3 w-3 mr-1" />
              Affecter classe
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onBulkExport}
            >
              <Download className="h-3 w-3 mr-1" />
              Exporter
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={onBulkDelete}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Supprimer
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onDeselectAll}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interface pour l'état du formulaire
interface FormState {
  isOpen: boolean;
  mode: "create" | "edit";
  student: Student | null;
  isLoading: boolean;
  error: string | null;
}

export const StudentsManager = () => {
  const {
    students,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    updateStudentStatus,
    assignStudentToClass,
    loading,
    error: globalError,
    clearError,
    filters,
    setFilters,
    pagination,
  } = useStudentStore();

  const { classes, fetchClasses } = useClassStore();
  const { user } = useAuthStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // État local
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "details">("list");
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showAssignClassModal, setShowAssignClassModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");

  // État du formulaire avec gestion d'erreur
  const [formState, setFormState] = useState<FormState>({
    isOpen: false,
    mode: "create",
    student: null,
    isLoading: false,
    error: null,
  });

  // État de l'étudiant sélectionné pour les détails
  const [selectedStudentDetails, setSelectedStudentDetails] =
    useState<Student | null>(null);

  // Initialisation des données
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("🔄 Initializing data...");
        await Promise.all([fetchStudents(), fetchClasses()]);
        console.log("✅ Data initialized successfully");
      } catch (err) {
        console.error("❌ Erreur lors de l'initialisation:", err);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible de charger les données initiales",
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [fetchStudents, fetchClasses]);

  // Gestion des erreurs globales
  useEffect(() => {
    if (globalError) {
      console.error("❌ Global error:", globalError);
      toast({
        title: "Erreur",
        description: globalError,
        variant: "destructive",
      });
      clearError();
    }
  }, [globalError, clearError]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Charger les Éleves avec recherche
  useEffect(() => {
    const loadStudents = async () => {
      console.log("🔄 Loading students with:", {
        search: debouncedSearchTerm,
        page: currentPage,
        limit: itemsPerPage,
        filters,
      });
      try {
        await fetchStudents({
          search: debouncedSearchTerm,
          page: currentPage,
          limit: itemsPerPage,
          status: filters.status,
          classId: filters.classId,
        });
        console.log("✅ Students loaded:", students.length);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des Éleves:", err);
      }
    };

    loadStudents();
  }, [debouncedSearchTerm, currentPage, itemsPerPage, fetchStudents, filters]);

  // Filtrage des Éleves
  const filteredStudents = useMemo(() => {
    console.log("🔍 Filtering students:", {
      total: students.length,
      filters,
    });

    return students.filter((student) => {
      if (!student || !student.id) return false;

      const matchesStatus =
        !filters.status ||
        filters.status === EMPTY_VALUES.ALL ||
        student.status === filters.status;

      const matchesClass =
        !filters.classId ||
        filters.classId === EMPTY_VALUES.ALL ||
        student.classId === filters.classId;

      return matchesStatus && matchesClass;
    });
  }, [students, filters]);

  // Pagination
  const totalPages = Math.ceil(pagination.total / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const result = filteredStudents.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    console.log("📄 Paginated students:", {
      currentPage,
      itemsPerPage,
      startIndex,
      endIndex: startIndex + itemsPerPage,
      total: filteredStudents.length,
      resultCount: result.length,
    });
    return result;
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Gestion de l'édition d'un étudiant
  const handleEditStudent = useCallback(
    async (student: Student) => {
      try {
        console.log("✏️ Editing student:", student.id);
        setFormState({
          isOpen: true,
          mode: "edit",
          student: { ...student },
          isLoading: false,
          error: null,
        });

        if (viewMode === "details") {
          setViewMode("list");
        }
      } catch (err) {
        console.error("❌ Erreur lors de la préparation de l'édition:", err);
        setFormState((prev) => ({
          ...prev,
          error: "Impossible de charger les données de l'étudiant",
        }));
      }
    },
    [viewMode]
  );

  const handleViewDetails = useCallback((student: Student) => {
    console.log("👁️ Viewing details for student:", student.id);
    setSelectedStudentDetails(student);
    setViewMode("details");
  }, []);

  const handleDeleteStudent = useCallback((studentId: string) => {
    console.log("🗑️ Requesting delete for student:", studentId);
    setStudentToDelete(studentId);
  }, []);

  const handleBackToList = useCallback(() => {
    console.log("↩️ Back to list");
    setViewMode("list");
    setSelectedStudentDetails(null);
    setSelectedStudents([]);
    setIsSelecting(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!studentToDelete) return;

    console.log("✅ Confirming delete:", studentToDelete);

    try {
      if (studentToDelete.includes(",")) {
        const ids = studentToDelete.split(",");
        const deletePromises = ids.map((id) => deleteStudent(id));
        await Promise.all(deletePromises);

        toast({
          title: "Suppression réussie",
          description: `${ids.length} Éleves ont été supprimés avec succès`,
        });
      } else {
        await deleteStudent(studentToDelete);
        toast({
          title: "Suppression réussie",
          description: "L'étudiant a été supprimé avec succès",
        });
      }

      setStudentToDelete(null);
      setSelectedStudents([]);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression",
        variant: "destructive",
      });
    }
  }, [studentToDelete, deleteStudent]);

  // Sélection des Éleves
  const toggleStudentSelection = useCallback((studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedStudents.map((s) => s.id));
    }
  }, [selectedStudents, paginatedStudents]);

  const handleBulkDelete = useCallback(() => {
    if (selectedStudents.length === 0) return;
    console.log("🗑️ Bulk delete for:", selectedStudents);
    setStudentToDelete(selectedStudents.join(","));
  }, [selectedStudents]);

  const handleBulkStatusChange = useCallback(
    async (newStatus: Student["status"]) => {
      if (selectedStudents.length === 0) return;

      console.log("🔄 Bulk status change to:", newStatus, selectedStudents);

      try {
        const updatePromises = selectedStudents.map((studentId) => {
          return updateStudentStatus(
            studentId,
            newStatus,
            "Modification groupée"
          );
        });

        await Promise.all(updatePromises);

        toast({
          title: "Statut mis à jour",
          description: `Le statut de ${selectedStudents.length} Éleves a été modifié`,
        });

        setSelectedStudents([]);
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour groupée:", error);
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de la mise à jour des statuts",
          variant: "destructive",
        });
      }
    },
    [selectedStudents, updateStudentStatus]
  );

  const handleBulkAssignClass = useCallback(() => {
    if (selectedStudents.length === 0) return;
    console.log("🏫 Bulk assign class for:", selectedStudents);
    setShowAssignClassModal(true);
  }, [selectedStudents]);

  const handleConfirmAssignClass = useCallback(async () => {
    if (selectedStudents.length === 0 || !selectedClassId) return;

    console.log("✅ Confirming bulk assign:", {
      students: selectedStudents,
      classId: selectedClassId,
    });

    try {
      const updatePromises = selectedStudents.map((studentId) => {
        return assignStudentToClass(studentId, selectedClassId);
      });

      await Promise.all(updatePromises);

      toast({
        title: "Classe assignée",
        description: `${selectedStudents.length} Éleves ont été affectés à la classe`,
      });

      setSelectedStudents([]);
      setShowAssignClassModal(false);
      setSelectedClassId("");
    } catch (error) {
      console.error("❌ Erreur lors de l'affectation groupée:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'affectation à la classe",
        variant: "destructive",
      });
    }
  }, [selectedStudents, selectedClassId, assignStudentToClass]);

  const handleBulkExport = useCallback(() => {
    if (selectedStudents.length === 0) return;

    console.log("📤 Bulk export for:", selectedStudents.length, "students");

    try {
      const selectedStudentsData = students.filter((student) =>
        selectedStudents.includes(student.id)
      );

      const data = selectedStudentsData.map((student) => {
        const studentClass = student.classId
          ? classes.find((c) => c.id === student.classId)
          : null;

        return {
          "Code Étudiant": student.studentCode || "",
          Prénom: student.firstName || "",
          Nom: student.lastName || "",
          Email: student.email || "",
          Téléphone: student.phone || "",
          Statut: getStatusLabel(student.status),
          Classe: studentClass?.name || "Non assigné",
          "Date de Naissance": student.dateOfBirth
            ? new Date(student.dateOfBirth).toLocaleDateString("fr-FR")
            : "",
          "Lieu de Naissance": student.placeOfBirth || "",
          Adresse: student.address || "",
          "Groupe Sanguin": student.bloodGroup || "",
          Allergies: student.allergies || "",
          Handicaps: student.disabilities || "",
          Sexe: student.sexe || "",
          "Date de Création": student.createdAt
            ? new Date(student.createdAt).toLocaleDateString("fr-FR")
            : "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Éleves");
      XLSX.writeFile(workbook, "etudiants-selection.xlsx");

      toast({
        title: "Export réussi",
        description: `Les données de ${selectedStudents.length} Éleves ont été exportées`,
      });
    } catch (error) {
      console.error("❌ Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'exportation",
        variant: "destructive",
      });
    }
  }, [selectedStudents, students, classes]);

  const exportAllToExcel = useCallback(() => {
    console.log("📤 Export all students:", filteredStudents.length);

    try {
      const data = filteredStudents.map((student) => {
        const studentClass = student.classId
          ? classes.find((c) => c.id === student.classId)
          : null;

        return {
          "Code Étudiant": student.studentCode || "",
          Prénom: student.firstName || "",
          Nom: student.lastName || "",
          Email: student.email || "",
          Téléphone: student.phone || "",
          Statut: getStatusLabel(student.status),
          Classe: studentClass?.name || "Non assigné",
          "Date de Naissance": student.dateOfBirth
            ? new Date(student.dateOfBirth).toLocaleDateString("fr-FR")
            : "",
          "Lieu de Naissance": student.placeOfBirth || "",
          Adresse: student.address || "",
          "Groupe Sanguin": student.bloodGroup || "",
          Allergies: student.allergies || "",
          Handicaps: student.disabilities || "",
          Sexe: student.sexe || "",
          "Date de Création": student.createdAt
            ? new Date(student.createdAt).toLocaleDateString("fr-FR")
            : "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Éleves");
      XLSX.writeFile(workbook, "etudiants.xlsx");

      toast({
        title: "Export réussi",
        description: `Les données de ${filteredStudents.length} Éleves ont été exportées`,
      });
    } catch (error) {
      console.error("❌ Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'exportation",
        variant: "destructive",
      });
    }
  }, [filteredStudents, classes]);

  // Gestion de la soumission du formulaire
  const handleFormSubmit = useCallback(
    async (studentData: any) => {
      console.log("📤 Form submit:", {
        mode: formState.mode,
        data: studentData,
      });

      setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const dataToSend = {
          ...studentData,
          status: formState.mode === "create" ? "Active" : studentData.status,
        };

        if (formState.mode === "create") {
          await createStudent(dataToSend);
          toast({
            title: "Étudiant créé",
            description: "L'étudiant a été créé avec succès",
          });
        } else {
          if (!formState.student?.id) {
            throw new Error("ID de l'étudiant manquant");
          }

          await updateStudent(formState.student.id, dataToSend);
          toast({
            title: "Étudiant mis à jour",
            description: "L'étudiant a été modifié avec succès",
          });
        }

        setFormState({
          isOpen: false,
          mode: "create",
          student: null,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("❌ Erreur lors de la soumission:", error);

        let errorMessage = "Une erreur s'est produite lors de l'opération";
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [formState.mode, formState.student?.id, createStudent, updateStudent]
  );

  const handleOpenCreateForm = useCallback(() => {
    console.log("➕ Opening create form");
    setFormState({
      isOpen: true,
      mode: "create",
      student: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const handleCloseForm = useCallback(() => {
    console.log("❌ Closing form");
    setFormState({
      isOpen: false,
      mode: "create",
      student: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Affichage des détails de l'étudiant
  if (viewMode === "details" && selectedStudentDetails) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="hover-scale transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Détails de l'étudiant</h2>
            <p className="text-muted-foreground">
              {selectedStudentDetails.firstName}{" "}
              {selectedStudentDetails.lastName}
            </p>
          </div>
        </div>

        <StudentDetails
          student={selectedStudentDetails}
          onClose={handleBackToList}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      </div>
    );
  }

  const renderContent = () => {
    console.log("🎨 Rendering content:", {
      loading,
      studentsCount: students.length,
      filteredCount: filteredStudents.length,
      paginatedCount: paginatedStudents.length,
    });

    if (loading && students.length === 0) {
      return (
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <StudentSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      );
    }

    if (students.length === 0 && !loading) {
      return (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Aucun étudiant trouvé
          </h3>
          <p className="text-muted-foreground mt-1">
            {debouncedSearchTerm || filters.status || filters.classId
              ? "Aucun étudiant ne correspond à vos critères de recherche"
              : "Aucun étudiant n'a été ajouté pour le moment"}
          </p>
          {!debouncedSearchTerm && !filters.status && !filters.classId && (
            <Button onClick={handleOpenCreateForm} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier étudiant
            </Button>
          )}
        </div>
      );
    }

    if (filteredStudents.length === 0 && !loading) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Aucun résultat
          </h3>
          <p className="text-muted-foreground mt-1">
            Aucun étudiant ne correspond à vos filtres
          </p>
          <Button
            variant="outline"
            onClick={() => setFilters({ status: "", classId: "" })}
            className="mt-4"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      );
    }

    if (isDesktop) {
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead key="select-header" className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedStudents.length === paginatedStudents.length &&
                      paginatedStudents.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Sélectionner tous les Éleves"
                  />
                </TableHead>
                <TableHead key="code-header" className="w-[150px]">
                  Code Étudiant
                </TableHead>
                <TableHead key="name-header" className="w-[200px]">
                  Nom Complet
                </TableHead>
                <TableHead key="email-header" className="w-[200px]">
                  Email
                </TableHead>
                <TableHead key="phone-header" className="w-[150px]">
                  Téléphone
                </TableHead>
                <TableHead key="status-header" className="w-[120px]">
                  Statut
                </TableHead>
                <TableHead key="class-header" className="w-[150px]">
                  Classe
                </TableHead>
                <TableHead
                  key="actions-header"
                  className="w-[120px] text-center"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => {
                const studentClass = student.classId
                  ? classes.find((c) => c.id === student.classId)
                  : null;

                return (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell key={`${student.id}-select`}>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() =>
                          toggleStudentSelection(student.id)
                        }
                        aria-label={`Sélectionner ${student.firstName} ${student.lastName}`}
                      />
                    </TableCell>
                    <TableCell key={`${student.id}-code`}>
                      <div className="font-mono text-sm font-medium">
                        {student.studentCode}
                      </div>
                    </TableCell>
                    <TableCell key={`${student.id}-name`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={student.photo} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {student.firstName?.[0] || ""}
                            {student.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell key={`${student.id}-email`}>
                      <div className="text-sm">{student.email}</div>
                    </TableCell>
                    <TableCell key={`${student.id}-phone`}>
                      <div className="text-sm">{student.phone || "-"}</div>
                    </TableCell>
                    <TableCell key={`${student.id}-status`}>
                      <Badge variant={getStatusBadgeVariant(student.status)}>
                        {getStatusLabel(student.status)}
                      </Badge>
                    </TableCell>
                    <TableCell key={`${student.id}-class`}>
                      <div className="text-sm">
                        {studentClass?.name || "Non assigné"}
                      </div>
                    </TableCell>
                    <TableCell key={`${student.id}-actions`}>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(student)}
                          title="Voir détails"
                          aria-label="Voir détails"
                        >
                          <GraduationCap className="h-4 w-4" />
                        </Button>
                        {(user?.role === "Admin" ||
                          user?.role === "Directeur") && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditStudent(student)}
                              title="Modifier"
                              aria-label="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteStudent(student.id)}
                              title="Supprimer"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    }

    // Vue mobile/tablette
    return (
      <div className="space-y-4 p-4">
        {paginatedStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onViewDetails={handleViewDetails}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            isSelected={selectedStudents.includes(student.id)}
            onSelect={toggleStudentSelection}
            isSelecting={isSelecting}
          />
        ))}
      </div>
    );
  };

  console.log("📊 State summary:", {
    totalStudents: students.length,
    filteredStudents: filteredStudents.length,
    paginatedStudents: paginatedStudents.length,
    loading,
    currentPage,
    totalPages,
    filters,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Éleves
          </h2>
          <p className="text-muted-foreground mt-2">
            Gérez les informations des Éleves de votre établissement
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Bouton Export */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={exportAllToExcel}
            disabled={students.length === 0 || loading}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>

          {/* Bouton Sélection */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsSelecting(!isSelecting)}
            disabled={students.length === 0 || loading}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Sélection</span>
          </Button>

          {/* Bouton Nouvel Étudiant */}
          <Button
            onClick={handleOpenCreateForm}
            className="gap-2"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvel éleve</span>
          </Button>
        </div>
      </div>

      {/* Barre d'actions groupées */}
      {selectedStudents.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedStudents.length}
          onDeselectAll={() => setSelectedStudents([])}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkExport={handleBulkExport}
          onBulkAssignClass={handleBulkAssignClass}
        />
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, code étudiant ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 w-full"
                aria-label="Rechercher des Éleves"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.status || EMPTY_VALUES.ALL}
                onValueChange={(value) =>
                  setFilters({
                    status: value === EMPTY_VALUES.ALL ? "" : value,
                  })
                }
              >
                <SelectTrigger
                  className="w-full lg:w-32"
                  aria-label="Filtrer par statut"
                >
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY_VALUES.ALL}>Tous statuts</SelectItem>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="Inactive">Inactif</SelectItem>
                  <SelectItem value="Graduated">Diplômé</SelectItem>
                  <SelectItem value="Transferred">Transféré</SelectItem>
                  <SelectItem value="Suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.classId || EMPTY_VALUES.ALL}
                onValueChange={(value) =>
                  setFilters({
                    classId: value === EMPTY_VALUES.ALL ? "" : value,
                  })
                }
              >
                <SelectTrigger
                  className="w-full lg:w-40"
                  aria-label="Filtrer par classe"
                >
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY_VALUES.ALL}>
                    Toutes les classes
                  </SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des Éleves */}
      <Card>
        <CardHeader className="bg-muted/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Liste des Éleves
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {pagination.total} éleve{pagination.total !== 1 ? "s" : ""}
              </Badge>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">{renderContent()}</CardContent>

        {/* Pagination */}
        {students.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={pagination.total || filteredStudents.length}
          />
        )}
      </Card>

      {/* Modal du formulaire d'étudiant */}
      <Dialog open={formState.isOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formState.mode === "create"
                ? "Nouvel Étudiant"
                : "Modifier Étudiant"}
            </DialogTitle>
            <DialogDescription>
              {formState.mode === "create"
                ? "Ajouter un nouvel étudiant dans le système"
                : `Modification de ${formState.student?.firstName} ${formState.student?.lastName}`}
            </DialogDescription>
          </DialogHeader>

          {/* Affichage des erreurs du formulaire */}
          {formState.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {/* Contenu du formulaire */}
          {formState.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StudentForm
              student={formState.student || undefined}
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
              isLoading={formState.isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'affectation à une classe */}
      <Dialog
        open={showAssignClassModal}
        onOpenChange={setShowAssignClassModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affecter à une classe</DialogTitle>
            <DialogDescription>
              Sélectionnez une classe pour affecter les Éleves sélectionnés
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {selectedStudents.length} étudiant(s) seront affectés à cette
              classe
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAssignClassModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmAssignClass}
              disabled={!selectedClassId}
            >
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={
          studentToDelete && studentToDelete.includes(",")
            ? "Confirmer la suppression multiple"
            : "Confirmer la suppression"
        }
        message={
          studentToDelete && studentToDelete.includes(",")
            ? `Êtes-vous sûr de vouloir supprimer ${
                studentToDelete.split(",").length
              } Éleves ? Cette action est irréversible.`
            : "Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible."
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
};
