import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserPlus,
  Eye,
  Trash2,
  Edit,
  Filter,
  GraduationCap,
  Mail,
  IdCard,
  Calendar,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Upload,
  MoreVertical,
  BarChart3,
  Target,
  BookOpenCheck,
  Sparkles,
  RotateCcw,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEnrollmentStore } from "../../store/enrollmentStore";
import { useAcademicStore } from "../../store/studentStore";
import { Student, Enrollment } from "../../types/academic";
import { useFacultyStore } from "@/store/facultyStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useInitialData } from "@/hooks/useInitialData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface EnrollmentFormProps {
  student: Student;
  enrollment?: Enrollment | null;
  onClose: () => void;
}

const EnrollmentForm = ({
  student,
  enrollment,
  onClose,
}: EnrollmentFormProps) => {
  useInitialData();
  const { addEnrollment, updateEnrollment, fetchEnrollments } =
    useEnrollmentStore();
  const { faculties } = useFacultyStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    faculty: "",
    level: "",
    academicYear: "",
    status: "Active" as "Active" | "Suspended" | "Completed",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (academicYears.length === 0) {
      fetchAcademicYears();
    }
  }, [academicYears.length, fetchAcademicYears]);

  useEffect(() => {
    if (enrollment) {
      setFormData({
        faculty: enrollment.faculty || "",
        level: enrollment.level || "",
        academicYear: enrollment.academicYear || "",
        status: enrollment.status || "Active",
      });
    } else if (academicYears.length > 0) {
      const currentYear =
        academicYears.find((ay) => ay.isCurrent) || academicYears[0];
      setFormData((prev) => ({
        ...prev,
        academicYear: currentYear?.year || "",
      }));
    }
  }, [enrollment, academicYears]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.faculty && formData.level && formData.academicYear) {
      const enrollmentData = {
        studentId: student.id,
        faculty: formData.faculty,
        level: formData.level,
        academicYearId: formData.academicYear,
        status: formData.status,
        enrollmentDate: enrollment?.enrollmentDate || new Date().toISOString(),
      };

      try {
        if (enrollment) {
          await updateEnrollment(enrollment.id, enrollmentData);
          toast({
            title: "Immatriculation modifiée",
            description: "L'immatriculation a été modifiée avec succès.",
          });
        } else {
          await addEnrollment(enrollmentData);
          toast({
            title: "Immatriculation créée",
            description: "L'étudiant a été immatriculé avec succès.",
          });
        }
        await fetchEnrollments();
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'opération:", error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'opération.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validFaculties = faculties.filter(
    (faculty) =>
      faculty.name &&
      typeof faculty.name === "string" &&
      faculty.name.trim().length > 0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-blue-100 text-blue-700"
              >
                <IdCard className="h-3 w-3" />
                {student.studentId}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="faculty"
            className="flex items-center gap-1 text-sm font-medium"
          >
            <BookOpen className="h-4 w-4" />
            Faculté *
          </Label>
          <Select
            value={formData.faculty}
            onValueChange={(value) =>
              setFormData({ ...formData, faculty: value })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionner une faculté" />
            </SelectTrigger>
            <SelectContent>
              {validFaculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.name}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="level"
            className="flex items-center gap-1 text-sm font-medium"
          >
            <GraduationCap className="h-4 w-4" />
            Niveau *
          </Label>
          <Select
            value={formData.level}
            onValueChange={(value) =>
              setFormData({ ...formData, level: value })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Licence 1 (L1)</SelectItem>
              <SelectItem value="2">Licence 2 (L2)</SelectItem>
              <SelectItem value="3">Licence 3 (L3)</SelectItem>
              <SelectItem value="4">Licence 4 (L4)</SelectItem>
              <SelectItem value="5">Licence 5 (L5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="academicYear"
            className="flex items-center gap-1 text-sm font-medium"
          >
            <Calendar className="h-4 w-4" />
            Année Académique *
          </Label>
          <Select
            value={formData.academicYear}
            onValueChange={(value) =>
              setFormData({ ...formData, academicYear: value })
            }
            required
          >
            <SelectTrigger id="academicYear">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.year}>
                  {year.year} {year.isCurrent && "(En cours)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Statut
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "Active" | "Suspended" | "Completed",
              })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="Suspended">Suspendu</SelectItem>
              <SelectItem value="Completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="order-2 sm:order-1"
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="order-1 sm:order-2 gap-2"
          disabled={
            !formData.faculty ||
            !formData.level ||
            !formData.academicYear ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : enrollment ? (
            "Modifier l'immatriculation"
          ) : (
            "Créer l'immatriculation"
          )}
        </Button>
      </div>
    </form>
  );
};

export const EnrollmentManager = () => {
  const { students, fetchStudents } = useAcademicStore();
  const { fetchAcademicYears } = useAcademicYearStore();
  const {
    enrollments,
    fetchEnrollments,
    deleteEnrollment,
    getEnrollmentsByStudent,
  } = useEnrollmentStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedStudents, setExpandedStudents] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchEnrollments(),
          fetchAcademicYears(),
          fetchStudents(),
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchEnrollments, fetchAcademicYears, fetchStudents]);

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const studentEnrollments = getEnrollmentsByStudent(student.id);

    const matchesStatus =
      statusFilter === "all" ||
      studentEnrollments.some((e) => e.status === statusFilter);

    const matchesFaculty =
      facultyFilter === "all" ||
      studentEnrollments.some((e) => e.faculty === facultyFilter);

    let matchesTab = true;
    if (activeTab === "enrolled") {
      matchesTab = studentEnrollments.length > 0;
    } else if (activeTab === "notEnrolled") {
      matchesTab = studentEnrollments.length === 0;
    }

    return matchesSearch && matchesStatus && matchesFaculty && matchesTab;
  });

  const handleEnrollStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedEnrollment(null);
    setIsEnrollmentFormOpen(true);
  };

  const handleEditEnrollment = (student: Student, enrollment: Enrollment) => {
    setSelectedStudent(student);
    setSelectedEnrollment(enrollment);
    setIsEnrollmentFormOpen(true);
  };

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette immatriculation ?")) {
      try {
        await deleteEnrollment(enrollmentId);
        await fetchEnrollments();
        toast({
          title: "Immatriculation supprimée",
          description: "L'immatriculation a été supprimée avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'immatriculation.",
          variant: "destructive",
        });
      }
    }
  };

  const getEnrollmentStatusBadge = (status: Enrollment["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Actif
          </Badge>
        );
      case "Suspended":
        return (
          <Badge variant="destructive" className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspendu
          </Badge>
        );
      case "Completed":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get unique faculties for filter
  const uniqueFaculties = Array.from(
    new Set(enrollments.map((e) => e.faculty).filter(Boolean))
  );

  // Calculate statistics
  const totalStudents = students.length;
  const enrolledStudents = students.filter(
    (student) => getEnrollmentsByStudent(student.id).length > 0
  ).length;
  const enrollmentRate =
    totalStudents > 0 ? (enrolledStudents / totalStudents) * 100 : 0;

  const statusStats = {
    Active: enrollments.filter((e) => e.status === "Active").length,
    Suspended: enrollments.filter((e) => e.status === "Suspended").length,
    Completed: enrollments.filter((e) => e.status === "Completed").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RotateCcw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Gestion des Immatriculations
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez les inscriptions des étudiants aux programmes académiques
          </p>
        </div>

        <Dialog
          open={isEnrollmentFormOpen}
          onOpenChange={setIsEnrollmentFormOpen}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <UserPlus className="h-4 w-4" />
              Nouvelle Immatriculation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {selectedEnrollment
                  ? "Modifier l'immatriculation"
                  : "Nouvelle immatriculation"}
              </DialogTitle>
              <DialogDescription>
                {selectedEnrollment
                  ? "Modifiez les détails de l'immatriculation de l'étudiant."
                  : "Inscrivez un étudiant à un programme académique."}
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <EnrollmentForm
                student={selectedStudent}
                enrollment={selectedEnrollment}
                onClose={() => setIsEnrollmentFormOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total Étudiants
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {totalStudents}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-200">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Inscrits</p>
                <p className="text-3xl font-bold text-green-900">
                  {enrolledStudents}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-200">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Taux d'Inscription
                </p>
                <p className="text-3xl font-bold text-amber-900">
                  {enrollmentRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-200">
                <BarChart3 className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <Progress value={enrollmentRate} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Immatriculations
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {enrollments.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-200">
                <BookOpenCheck className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-3 w-full md:w-auto bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background"
            >
              Tous
            </TabsTrigger>
            <TabsTrigger
              value="enrolled"
              className="data-[state=active]:bg-background"
            >
              Inscrits
            </TabsTrigger>
            <TabsTrigger
              value="notEnrolled"
              className="data-[state=active]:bg-background"
            >
              Non-inscrits
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Suspended">Suspendu</SelectItem>
                <SelectItem value="Completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="h-10 w-full sm:w-[160px]">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <SelectValue placeholder="Faculté" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes facultés</SelectItem>
                {uniqueFaculties.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <StudentList
            students={filteredStudents}
            getEnrollmentsByStudent={getEnrollmentsByStudent}
            onEnroll={handleEnrollStudent}
            onEdit={handleEditEnrollment}
            onDelete={handleDeleteEnrollment}
            getStatusBadge={getEnrollmentStatusBadge}
            expandedStudents={expandedStudents}
            onToggleExpansion={toggleStudentExpansion}
          />
        </TabsContent>

        <TabsContent value="enrolled" className="mt-6">
          <StudentList
            students={filteredStudents}
            getEnrollmentsByStudent={getEnrollmentsByStudent}
            onEnroll={handleEnrollStudent}
            onEdit={handleEditEnrollment}
            onDelete={handleDeleteEnrollment}
            getStatusBadge={getEnrollmentStatusBadge}
            expandedStudents={expandedStudents}
            onToggleExpansion={toggleStudentExpansion}
          />
        </TabsContent>

        <TabsContent value="notEnrolled" className="mt-6">
          <StudentList
            students={filteredStudents}
            getEnrollmentsByStudent={getEnrollmentsByStudent}
            onEnroll={handleEnrollStudent}
            onEdit={handleEditEnrollment}
            onDelete={handleDeleteEnrollment}
            getStatusBadge={getEnrollmentStatusBadge}
            expandedStudents={expandedStudents}
            onToggleExpansion={toggleStudentExpansion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StudentListProps {
  students: Student[];
  getEnrollmentsByStudent: (studentId: string) => Enrollment[];
  onEnroll: (student: Student) => void;
  onEdit: (student: Student, enrollment: Enrollment) => void;
  onDelete: (enrollmentId: string) => void;
  getStatusBadge: (status: Enrollment["status"]) => React.ReactNode;
  expandedStudents: Record<string, boolean>;
  onToggleExpansion: (studentId: string) => void;
}

const StudentList = ({
  students,
  getEnrollmentsByStudent,
  onEnroll,
  onEdit,
  onDelete,
  getStatusBadge,
  expandedStudents,
  onToggleExpansion,
}: StudentListProps) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          Aucun étudiant trouvé
        </h3>
        <p className="text-muted-foreground mt-1">
          Aucun étudiant ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {students.map((student) => {
        const studentEnrollments = getEnrollmentsByStudent(student.id);
        const isExpanded = expandedStudents[student.id] || false;

        return (
          <Card
            key={student.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-3 bg-gradient-to-r from-muted/10 to-muted/5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {student.firstName} {student.lastName}
                        {studentEnrollments.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {studentEnrollments.length} immatriculation(s)
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 mt-2">
                        <span className="flex items-center gap-1">
                          <IdCard className="h-3 w-3" />
                          {student.studentId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    onClick={() => onEnroll(student)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Immatriculer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleExpansion(student.id)}
                    className="gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Réduire
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Détails
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-4">
                    {studentEnrollments.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                          <BookOpenCheck className="h-4 w-4" />
                          IMMATRICULATIONS
                        </h4>
                        {studentEnrollments.map((enrollment) => (
                          <div
                            key={enrollment.id}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-muted/5 to-muted/10"
                          >
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold">
                                  {enrollment.faculty} - {enrollment.level}
                                </h4>
                                {getStatusBadge(enrollment.status)}
                              </div>

                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Année: {enrollment.academicYear}
                                </span>
                                <span>
                                  Inscrit le:{" "}
                                  {new Date(
                                    enrollment.enrollmentDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 self-end sm:self-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(student, enrollment)}
                                className="h-9 gap-1"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(enrollment.id)}
                                className="h-9 text-destructive gap-1 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                        <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune immatriculation pour cet étudiant</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEnroll(student)}
                          className="mt-2 gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Ajouter une immatriculation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
};

export default EnrollmentManager;
