import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  AlertTriangle,
  Edit,
  Trash2,
  BookOpen,
  Award,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  Download,
  Filter,
  ScrollText,
  User2,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Shield,
  Activity,
  Star,
  Target,
  Banknote,
  Building,
} from "lucide-react";
import { Student, Enrollment, GradeWithDetails } from "../../types/academic";
import { useEnrollmentStore } from "../../store/enrollmentStore";
// import { usePaymentStore } from "../../store/paymentStore";
import { Checkbox } from "../ui/checkbox";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { GradesModal } from "./GradesModal";
import { useGradeStore } from "@/store/gradeStore";
import { DocumentTypeI } from "@/types/academic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuthStore } from "@/store/authStore";
import { Input } from "../ui/input";
import { useAcademicStore } from "@/store/academicStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StudentFeesSection } from "../StudentFeesSection";
import { AssignFeesButton } from "./AssignFeesButton";

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

interface AcademicYearGrades {
  academicYear: string;
  academicYearId: string;
  enrollment: Enrollment;
  grades: GradeWithDetails[];
  average: number;
  successRate: number;
  validatedCount: number;
  failedCount: number;
  retakeCount: number;
  totalCredits: number;
  obtainedCredits: number;
}

export const StudentDetails = ({
  student,
  onClose,
  onEdit,
  onDelete,
}: StudentDetailsProps) => {
  const { getStudentGrades, getStudentGuardians, getStudentRetakes } =
    useAcademicStore();
  const { grades: allGrades, fetchGrades: fetchAllGrades } = useGradeStore();
  const { enrollments, getEnrollmentsByStudent } = useEnrollmentStore();
  // const { payments, getPaymentsByStudent, getTotalAmount, getPaidAmount } =
  //   usePaymentStore();

  const [activeTab, setActiveTab] = useState("info");
  const [grades, setGrades] = useState<GradeWithDetails[]>([]);
  const [groupedGrades, setGroupedGrades] = useState<AcademicYearGrades[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<string>("all");
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [showOnlyRetakes, setShowOnlyRetakes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const guardians = getStudentGuardians(student.id);
  const retakes = getStudentRetakes(student.id);
  const studentEnrollments = getEnrollmentsByStudent(student.id);
  // const studentPayments = getPaymentsByStudent(student.id);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const { studentFees } = useFeeStructureStore();
  const { user } = useAuthStore();

  const currentEnrollment =
    studentEnrollments.find((e) => e.status === "Active") ||
    studentEnrollments[studentEnrollments.length - 1];

  // Fonctions helper pour extraire les données
  const getEnrollmentYear = (enrollment: Enrollment): string => {
    if (!enrollment) return "N/A";

    if (typeof enrollment.academicYear === "string") {
      return enrollment.academicYear;
    } else if (
      enrollment.academicYear &&
      typeof enrollment.academicYear === "object" &&
      "year" in enrollment.academicYear
    ) {
      return enrollment.academicYear.year;
    } else if (enrollment.academicYearId) {
      return enrollment.academicYearId;
    }

    return "N/A";
  };

  const getEnrollmentFaculty = (enrollment: Enrollment): string => {
    if (!enrollment) return "N/A";

    if (typeof enrollment.classId === "string") {
      return enrollment.classId;
    } else if (
      enrollment.classId &&
      typeof enrollment.classId === "object" &&
      "faculty" in enrollment.classId
    ) {
      return enrollment.classId;
    } else if (enrollment.classId) {
      return enrollment.classId;
    }

    return "N/A";
  };

  const getEnrollmentLevel = (enrollment: Enrollment): string => {
    if (!enrollment) return "N/A";

    if (typeof enrollment.classId === "string") {
      return enrollment.classId;
    } else if (
      enrollment.classId &&
      typeof enrollment.classId === "object" &&
      "level" in enrollment.classId
    ) {
      return enrollment.classId;
    } else if (enrollment.classId) {
      return enrollment.classId;
    }

    return "N/A";
  };

  // Charger les notes de l'étudiant
  useEffect(() => {
    const loadStudentGrades = async () => {
      if (
        student.id &&
        (activeTab === "academic" || activeTab === "enrollments")
      ) {
        setLoadingGrades(true);
        try {
          const studentGrades = getStudentGrades(student.id);
          if (studentGrades && studentGrades.length > 0) {
            setGrades(studentGrades);
          } else {
            const filteredGrades = allGrades.filter(
              (grade) => grade.studentId === student.id
            ) as GradeWithDetails[];
            setGrades(filteredGrades);
            if (filteredGrades.length === 0) {
              try {
                await fetchAllGrades({ studentId: student.id });
              } catch (error) {
                console.log(
                  "API grades non disponible, utilisation des données locales"
                );
              }
            }
          }
        } catch (error) {
          console.log("Erreur lors du chargement des notes:", error);
        } finally {
          setLoadingGrades(false);
        }
      }
    };

    loadStudentGrades();
  }, [student.id, activeTab, allGrades, getStudentGrades, fetchAllGrades]);

  // Grouper les notes par année académique
  useEffect(() => {
    const groupGradesByAcademicYear = () => {
      const grouped: AcademicYearGrades[] = [];

      studentEnrollments.forEach((enrollment) => {
        const enrollmentGrades = grades.filter(
          (grade) => grade.studentId === enrollment.student.id
        );

        if (enrollmentGrades.length > 0) {
          const validatedGrades = enrollmentGrades.filter(
            (g) => g.status === "Valid_"
          );
          const failedGrades = enrollmentGrades.filter(
            (g) =>
              g.status === "Non_valid_" || g.status === "Echec" || g.grade < 10
          );
          const retakeGrades = enrollmentGrades.filter(
            (g) => g.session === "Reprise" || g.status === "Reprise"
          );

          const totalGrade = enrollmentGrades.reduce(
            (sum, grade) => sum + (grade.grade || 0),
            0
          );
          const average =
            enrollmentGrades.length > 0
              ? totalGrade / enrollmentGrades.length
              : 0;
          const successRate =
            enrollmentGrades.length > 0
              ? (validatedGrades.length / enrollmentGrades.length) * 100
              : 0;

          const totalCredits = enrollmentGrades.reduce(
            (sum, grade) => sum + (grade.ue?.credits || 0),
            0
          );
          const obtainedCredits = validatedGrades.reduce(
            (sum, grade) => sum + (grade.ue?.credits || 0),
            0
          );

          const academicYear = getEnrollmentYear(enrollment);
          const academicYearId = enrollment.academicYearId || academicYear;

          grouped.push({
            academicYear,
            academicYearId,
            enrollment,
            grades: enrollmentGrades,
            average: Math.round(average * 100) / 100,
            successRate: Math.round(successRate * 100) / 100,
            validatedCount: validatedGrades.length,
            failedCount: failedGrades.length,
            retakeCount: retakeGrades.length,
            totalCredits,
            obtainedCredits,
          });
        }
      });

      grouped.sort((a, b) => b.academicYear.localeCompare(a.academicYear));
      setGroupedGrades(grouped);

      if (grouped.length > 0 && expandedYears.size === 0) {
        setExpandedYears(new Set([grouped[0].academicYearId]));
      }
    };

    if (grades.length > 0) {
      groupGradesByAcademicYear();
    }
  }, [grades, studentEnrollments, expandedYears]);

  const filteredGroupedGrades = groupedGrades.filter(
    (group) =>
      selectedAcademicYear === "all" ||
      group.academicYearId === selectedAcademicYear
  );

  const toggleYearExpansion = (academicYearId: string) => {
    setExpandedYears((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(academicYearId)) {
        newSet.delete(academicYearId);
      } else {
        newSet.add(academicYearId);
      }
      return newSet;
    });
  };

  const getGlobalStats = () => {
    const allGradesList = filteredGroupedGrades.flatMap(
      (group) => group.grades
    );
    const validatedGrades = allGradesList.filter((g) => g.status === "Valid_");
    const failedGrades = allGradesList.filter(
      (g) => g.status === "Non_valid_" || g.status === "Echec" || g.grade < 10
    );
    const retakeGrades = allGradesList.filter(
      (g) => g.session === "Reprise" || g.status === "Reprise"
    );

    const totalAverage =
      allGradesList.length > 0
        ? allGradesList.reduce((sum, grade) => sum + (grade.grade || 0), 0) /
          allGradesList.length
        : 0;

    const totalCredits = allGradesList.reduce(
      (sum, grade) => sum + (grade.ue?.credits || 0),
      0
    );
    const obtainedCredits = validatedGrades.reduce(
      (sum, grade) => sum + (grade.ue?.credits || 0),
      0
    );

    return {
      totalGrades: allGradesList.length,
      validatedCount: validatedGrades.length,
      failedCount: failedGrades.length,
      retakeCount: retakeGrades.length,
      average: Math.round(totalAverage * 100) / 100,
      successRate:
        allGradesList.length > 0
          ? Math.round((validatedGrades.length / allGradesList.length) * 100)
          : 0,
      totalCredits,
      obtainedCredits,
      creditProgress:
        totalCredits > 0 ? (obtainedCredits / totalCredits) * 100 : 0,
    };
  };

  const globalStats = getGlobalStats();

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return Math.round((total / grades.length) * 100) / 100;
  };

  const getSuccessRate = () => {
    if (grades.length === 0) return 0;
    const validatedGrades = grades.filter((g) => g.status === "Valid_").length;
    return Math.round((validatedGrades / grades.length) * 100);
  };

  const getGradeStatusBadge = (grade: GradeWithDetails) => {
    const isRetake = grade.session === "Reprise" || grade.status === "Reprise";
    const isValid = grade.status === "Valid_" || grade.grade >= 10;
    const isFailed =
      grade.status === "Non_valid_" ||
      grade.status === "Echec" ||
      grade.grade < 10;

    if (isRetake) {
      return (
        <Badge
          variant="secondary"
          className="gap-1 text-xs bg-amber-100 text-amber-800 hover:bg-amber-100"
        >
          <RefreshCw className="h-3 w-3" />
          Rattrapage
        </Badge>
      );
    }

    if (isValid) {
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs"
        >
          <CheckCircle className="h-3 w-3" />
          Validé
        </Badge>
      );
    }

    if (isFailed) {
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          Échec
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        {grade.status || "Inconnu"}
      </Badge>
    );
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-emerald-600 font-bold";
    if (grade >= 14) return "text-blue-600 font-semibold";
    if (grade >= 12) return "text-indigo-600";
    if (grade >= 10) return "text-amber-600";
    return "text-red-600 font-semibold";
  };

  const getStatusBadge = (status: Student["status"]) => {
    const config = {
      Active: {
        variant: "default" as const,
        label: "Actif",
        className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
      },
      Inactive: {
        variant: "secondary" as const,
        label: "Inactif",
        className: "bg-slate-100 text-slate-800 hover:bg-slate-100",
      },
      Graduated: {
        variant: "outline" as const,
        label: "Diplômé",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      Suspended: {
        variant: "destructive" as const,
        label: "Suspendu",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const { variant, label, className } = config[status] || config.Inactive;
    return (
      <Badge variant={variant} className={`${className} font-medium`}>
        {label}
      </Badge>
    );
  };

  const getLevelText = (level: string) => {
    const levelNum = parseInt(level);
    if (isNaN(levelNum)) return level;
    if (levelNum === 1) return "1ère année";
    return `${levelNum}ème année`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const totalPaid = 0; //getPaidAmount({ studentCode: student.studentCode }) || 0;

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[90vh] overflow-auto p-2 sm:p-0">
      {/* Header élégant */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Photo et infos principales */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={student.photo}
                    alt={`${student.firstName} ${student.lastName}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    {student.firstName?.[0] || ""}
                    {student.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                {student.status === "Active" && (
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {student.firstName} {student.lastName}
                      </h1>
                      <p className="text-sm text-slate-600 mt-1">
                        {student.studentCode} • {student.email}
                      </p>
                    </div>
                    <div className="flex justify-center sm:justify-start">
                      {getStatusBadge(student.status)}
                    </div>
                  </div>
                </div>

                {/* Stats en icônes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">
                          {calculateGPA()}
                        </div>
                        <div className="text-xs text-slate-500">Moyenne</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">
                          {getSuccessRate()}%
                        </div>
                        <div className="text-xs text-slate-500">Réussite</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <Banknote className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">
                          {totalPaid} HTG
                        </div>
                        <div className="text-xs text-slate-500">Payés</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">
                          {globalStats.obtainedCredits}
                        </div>
                        <div className="text-xs text-slate-500">Crédits</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row sm:flex-col gap-2 justify-center">
              {user?.role === "Admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(student)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmer la suppression
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer l'étudiant{" "}
                              <strong>
                                {student.firstName} {student.lastName}
                              </strong>
                              ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(student.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets élégante */}
      <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-11 p-1 bg-slate-100 rounded-xl">
          <TabsTrigger
            value="info"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden xs:inline">Info</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden xs:inline">Notes</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Frais</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="enrollments"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden xs:inline">Inscriptions</span>
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                {studentEnrollments.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="guardians"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden xs:inline">Tuteurs</span>
              {guardians.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                  {guardians.length}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Info */}
        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">
                        {student.email || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Téléphone</p>
                      <p className="font-medium">
                        {student.phone || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User2 className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Sexe</p>
                      <Badge variant="outline" className="capitalize">
                        {student.sexe || "Non spécifié"}
                      </Badge>
                    </div>
                  </div>
                  {student.cin && (
                    <div className="flex items-start gap-3">
                      <ScrollText className="h-4 w-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-sm text-slate-500">CIN</p>
                        <p className="font-medium">{student.cin}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Adresse */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Adresse complète
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {student.address || "Non renseignée"}
                    </p>
                  </div>
                  {student.placeOfBirth && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">
                        Lieu de naissance
                      </p>
                      <p className="font-medium">{student.placeOfBirth}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations médicales */}
            {(student.allergies || student.disabilities) && (
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    Informations Médicales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.allergies && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-sm font-medium text-amber-800 mb-1">
                        Allergies
                      </p>
                      <p className="text-amber-900">{student.allergies}</p>
                    </div>
                  )}
                  {student.disabilities && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Besoins spéciaux
                      </p>
                      <p className="text-blue-900">{student.disabilities}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Onglet Notes */}
        <TabsContent value="academic" className="mt-6 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" />
                Performance Académique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filtres */}
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Année académique
                    </label>
                    <Select
                      value={selectedAcademicYear}
                      onValueChange={setSelectedAcademicYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {groupedGrades.map((group) => (
                          <SelectItem
                            key={group.academicYearId}
                            value={group.academicYearId}
                          >
                            {group.academicYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Recherche
                    </label>
                    <Input
                      placeholder="Nom de la matière..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="show-retakes"
                      checked={showOnlyRetakes}
                      onCheckedChange={(checked) =>
                        setShowOnlyRetakes(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="show-retakes"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Rattrapages seulement
                    </label>
                  </div>
                </div>
              </div>

              {/* Liste des années académiques */}
              {loadingGrades ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-slate-500">Chargement des notes...</p>
                </div>
              ) : filteredGroupedGrades.length > 0 ? (
                <div className="space-y-4">
                  {filteredGroupedGrades.map((group) => {
                    const filteredGrades = group.grades.filter((grade) => {
                      const matchesSearch =
                        searchTerm === "" ||
                        (grade.ue?.title?.toLowerCase() || "").includes(
                          searchTerm.toLowerCase()
                        );
                      const matchesRetakeFilter =
                        !showOnlyRetakes ||
                        grade.session === "Reprise" ||
                        grade.status === "Reprise";
                      return matchesSearch && matchesRetakeFilter;
                    });

                    const isExpanded = expandedYears.has(group.academicYearId);

                    return (
                      <Card
                        key={group.academicYearId}
                        className="overflow-hidden border-slate-200"
                      >
                        <CardHeader className="pb-3 bg-slate-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleYearExpansion(group.academicYearId)
                                }
                                className="p-1 h-8 w-8"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {group.academicYear}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getEnrollmentFaculty(group.enrollment)}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getLevelText(
                                      getEnrollmentLevel(group.enrollment)
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {group.average}/20
                              </div>
                              <div className="text-xs text-slate-500">
                                {group.successRate}% de réussite
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="pt-4">
                            {filteredGrades.length > 0 ? (
                              <div className="space-y-3">
                                {filteredGrades.map((grade) => (
                                  <div
                                    key={grade.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-slate-900">
                                          {grade.ue?.title ||
                                            "Matière inconnue"}
                                        </h4>
                                        {getGradeStatusBadge(grade)}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        Semestre {grade.semester} • Session:{" "}
                                        {grade.session || "Normale"}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div
                                        className={`text-lg font-bold ${getGradeColor(
                                          grade.grade
                                        )}`}
                                      >
                                        {grade.grade?.toFixed(2) || "0"}/20
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {grade.ue?.credits || 0} crédits
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-slate-500">
                                Aucune note trouvée
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Aucune note enregistrée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Frais */}

        <TabsContent value="fees" className="mt-6">
          <div className="space-y-6">
            {currentEnrollment ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Frais de scolarité</h3>
                    <p className="text-muted-foreground">
                      {student.firstName} {student.lastName} -{" "}
                      {getEnrollmentYear(currentEnrollment)}
                    </p>
                  </div>

                  {/* Bouton pour assigner des frais manuellement */}
                  <AssignFeesButton
                    studentId={student.id}
                    studentCode={student.studentCode}
                    academicYearId={getEnrollmentYear(currentEnrollment)}
                    onSuccess={() => {}}
                  />
                </div>

                <StudentFeesSection
                  student={student}
                  currentEnrollment={{
                    ...currentEnrollment,
                    academicYear: getEnrollmentYear(currentEnrollment),
                    academicYearId:
                      currentEnrollment.academicYearId ||
                      getEnrollmentYear(currentEnrollment),
                  }}
                />
              </>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    Aucune inscription active
                  </h3>
                  <p className="text-slate-500">
                    L'étudiant doit avoir une inscription active pour gérer les
                    frais.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Onglet Inscriptions */}
        <TabsContent value="enrollments" className="mt-6">
          <Card className="border-slate-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Historique des Inscriptions
                  </CardTitle>
                  <p className="text-slate-300 text-sm mt-1">
                    Parcours académique complet
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {studentEnrollments.length} inscription(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {studentEnrollments.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {studentEnrollments
                    .sort(
                      (a, b) =>
                        new Date(b.enrollmentDate).getTime() -
                        new Date(a.enrollmentDate).getTime()
                    )
                    .map((enrollment, index) => {
                      const enrollmentYear = getEnrollmentYear(enrollment);
                      const enrollmentFaculty =
                        getEnrollmentFaculty(enrollment);
                      const enrollmentLevel = getEnrollmentLevel(enrollment);

                      return (
                        <div
                          key={enrollment.id}
                          className={`p-4 hover:bg-slate-50 transition-colors ${
                            index === 0 ? "bg-emerald-50" : ""
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                  <Building className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900">
                                    {enrollmentFaculty}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {enrollmentYear}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {getLevelText(enrollmentLevel)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {/* {formatDate(enrollment.enrollmentDate)} */}
                                </span>
                                <span
                                  className={`flex items-center gap-1 ${
                                    enrollment.status === "Active"
                                      ? "text-emerald-600"
                                      : "text-slate-500"
                                  }`}
                                >
                                  <Activity className="h-3 w-3" />
                                  {enrollment.status === "Active"
                                    ? "Actif"
                                    : "Terminé"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {enrollment.status === "Active" && (
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                  En cours
                                </Badge>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {}}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Détails
                              </Button>
                            </div>
                          </div>

                          {index === 0 && (
                            <div className="mt-3 pt-3 border-t border-emerald-200">
                              <div className="flex items-center gap-2 text-sm text-emerald-700">
                                <Star className="h-4 w-4" />
                                Inscription actuelle
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    Aucune inscription
                  </h3>
                  <p className="text-slate-500">
                    Cet étudiant n'a pas encore d'inscription enregistrée.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tuteurs */}
        <TabsContent value="guardians" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Tuteurs et Responsables
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guardians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guardians.map((guardian) => (
                    <Card
                      key={guardian.id}
                      className="border-slate-200 hover:border-primary/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {guardian.firstName} {guardian.lastName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {guardian.relationship || "Non spécifié"}
                              </Badge>
                              {guardian.isPrimary && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                                  Principal
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Shield className="h-5 w-5 text-slate-400" />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{guardian.phone || "Non renseigné"}</span>
                          </div>
                          {guardian.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-700">
                                {guardian.email}
                              </span>
                            </div>
                          )}
                          {guardian.address && (
                            <div className="flex items-start gap-2 pt-1">
                              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                              <span className="text-slate-600 text-xs leading-relaxed">
                                {guardian.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Aucun tuteur enregistré</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showGradesModal && selectedEnrollment && (
        <GradesModal
          enrollment={selectedEnrollment}
          student={student}
          grades={grades.filter(
            (grade) => grade.studentId === selectedEnrollment.student.id
          )}
          onClose={() => setShowGradesModal(false)}
          onGenerateReport={() => {}}
        />
      )}
    </div>
  );
};
