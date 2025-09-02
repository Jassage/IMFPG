import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAcademicStore } from "../store/studentStore";
import { StudentForm } from "./students/StudentForm";
import { StudentDetails } from "./students/StudentDetails";
import { Student } from "../types/academic";
import { getStudentEnrollmentInfo } from "../utils/enrollmentUtils";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "./ui/ConfirmationModal";
import * as XLSX from "xlsx";
import { useAcademicYearStore } from "@/store/academicYearStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";

export const StudentsManager = () => {
  const {
    students,
    enrollments,
    deleteStudent,
    fetchStudents,
    loading,
    importStudents,
  } = useAcademicStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { currentAcademicYear } = useAcademicYearStore();

  const academicYear = currentAcademicYear ? currentAcademicYear.year : "";

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      toast({
        title: "Suppression réussie",
        description: "L'étudiant a été supprimé avec succès",
      });
      setIsModalOpen(false);
    }
  };

  const exportToExcel = () => {
    const data = filteredStudents.map((student) => {
      const enrollmentInfo = getStudentEnrollmentInfo(
        student,
        enrollments,
        academicYear
      );
      return {
        "ID Étudiant": student.studentId,
        Prénom: student.firstName,
        Nom: student.lastName,
        Email: student.email,
        Téléphone: student.phone || "",
        Statut: student.status,
        Faculté: enrollmentInfo.faculty,
        Niveau: enrollmentInfo.level,
        "Année Académique": enrollmentInfo.academicYear,
        "Date de Naissance": student.dateOfBirth
          ? new Date(student.dateOfBirth).toLocaleDateString()
          : "",
        "Lieu de Naissance": student.placeOfBirth || "",
        Adresse: student.address || "",
        "Date de Création": new Date(
          student.createdAt || ""
        ).toLocaleDateString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Étudiants");
    XLSX.writeFile(workbook, "etudiants.xlsx");

    toast({
      title: "Export réussi",
      description: `Les données de ${filteredStudents.length} étudiants ont été exportées`,
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("Fichier sélectionné:", file.name, file.type, file.size);

      // Vérifier le type de fichier
      if (
        !file.type.includes("excel") &&
        !file.type.includes("sheet") &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".json")
      ) {
        throw new Error("Format de fichier non supporté");
      }

      const result = await importStudents(file);

      toast({
        title: "Import réussi",
        description: result.message,
      });

      event.target.value = "";
    } catch (error: any) {
      console.error("Erreur import:", error);
      toast({
        title: "Erreur d'import",
        description: error.message || "Erreur lors de l'importation",
        variant: "destructive",
      });
    }
  };
  const getStatusBadge = (status: Student["status"]) => {
    const variants = {
      Active: "default",
      Inactive: "secondary",
      Graduated: "outline",
    } as const;

    const labels = {
      Active: "Actif",
      Inactive: "Inactif",
      Graduated: "Diplômé",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const StudentCard = ({ student }: { student: Student }) => {
    const enrollmentInfo = getStudentEnrollmentInfo(
      student,
      enrollments,
      academicYear
    );

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {student.firstName[0]}
                {student.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {student.firstName} {student.lastName}
                </div>
                <div className="text-sm text-muted-foreground font-mono truncate">
                  {student.studentId}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {student.email}
                </div>
                <div className="mt-2">{getStatusBadge(student.status)}</div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteStudent(student.id)}
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
              <div className="text-muted-foreground">Téléphone</div>
              <div>{student.phone || "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Programme</div>
              <div className="truncate">{enrollmentInfo.faculty}</div>
              <div className="text-muted-foreground text-xs">
                {enrollmentInfo.level} • {enrollmentInfo.academicYear}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Aucun étudiant trouvé
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || statusFilter !== "all"
              ? "Aucun étudiant ne correspond à vos critères de recherche"
              : "Aucun étudiant n'a été ajouté pour le moment"}
          </p>
        </div>
      );
    }

    if (isDesktop) {
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px]">ID Étudiant</TableHead>
                <TableHead className="w-[200px]">Nom Complet</TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="w-[150px]">Téléphone</TableHead>
                <TableHead className="w-[120px]">Statut</TableHead>
                <TableHead className="w-[200px]">Programme</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const enrollmentInfo = getStudentEnrollmentInfo(
                  student,
                  enrollments,
                  academicYear
                );

                return (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="font-mono text-sm font-medium">
                        {student.studentId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{student.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{student.phone || "-"}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {enrollmentInfo.faculty}
                        </div>
                        <div className="text-muted-foreground">
                          {enrollmentInfo.level} • {enrollmentInfo.academicYear}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(student)}
                          title="Voir détails"
                        >
                          <GraduationCap className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditStudent(student)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Étudiants
          </h2>
          <p className="text-muted-foreground mt-2">
            Gérez les informations des étudiants de votre établissement
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Bouton Import */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => document.getElementById("import-file")?.click()}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importer</span>
            <input
              id="import-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </Button>

          {/* Bouton Export */}
          <Button variant="outline" className="gap-2" onClick={exportToExcel}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>

          {/* Bouton Nouvel Étudiant */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setSelectedStudent(null)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouvel Étudiant</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedStudent ? "Modifier Étudiant" : "Nouvel Étudiant"}
                </DialogTitle>
              </DialogHeader>
              <StudentForm
                student={selectedStudent}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedStudent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ID étudiant ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="Inactive">Inactif</SelectItem>
                  <SelectItem value="Graduated">Diplômé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des étudiants */}
      <Card>
        <CardHeader className="bg-muted/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Liste des Étudiants
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredStudents.length} étudiant
              {filteredStudents.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">{renderContent()}</CardContent>
      </Card>

      {/* Modal de détails */}
      {isDesktop ? (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de l'Étudiant</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <StudentDetails
                student={selectedStudent}
                onClose={() => {
                  setIsDetailsOpen(false);
                  setSelectedStudent(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Détails de l'Étudiant</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto">
              {selectedStudent && (
                <StudentDetails
                  student={selectedStudent}
                  onClose={() => {
                    setIsDetailsOpen(false);
                    setSelectedStudent(null);
                  }}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible."
        confirmLabel="Confirmer la suppression"
        cancelLabel="Annuler"
      />
    </div>
  );
};
