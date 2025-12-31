import { useState, useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  AlertTriangle,
  Edit,
  Trash2,
  BookOpen,
  Award,
  Users,
  CreditCard,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
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
  ScrollText,
  User2,
} from "lucide-react";
import { Student, Enrollment } from "../../types/academic";
import { useEnrollmentStore } from "../../store/enrollmentStore";
import { Checkbox } from "../ui/checkbox";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { useGradeStore } from "@/store/gradeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuthStore } from "@/store/authStore";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StudentFeesSection } from "../StudentFeesSection";
import { AssignFeesButton } from "./AssignFeesButton";
import { useClassStore } from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";

interface GradeWithDetails {
  id: string;
  studentId: string;
  subjectId: string;
  grade?: number;
  maxGrade?: number;
  status?: string | null;
  session?: string | null;
  controlType?: string | null;
  subject?: {
    id: string;
    name: string;
    code: string;
    coefficient?: number;
    maxGrade?: number;
  } | null;
  academicYearId?: string;
  classLevel?: string;
  [key: string]: any;
}

interface AcademicYearGrades {
  academicYear: string;
  academicYearId: string;
  enrollment: Enrollment;
  grades: GradeWithDetails[];
  weightedAverage: number;
  successRate: number;
  validatedCount: number;
  failedCount: number;
  retakeCount: number;
  totalCredits: number;
  obtainedCredits: number;
}

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export const StudentDetails = ({
  student,
  onClose,
  onEdit,
  onDelete,
}: StudentDetailsProps) => {
  const { enrollments, getEnrollmentsByStudent } = useEnrollmentStore();
  const {
    grades: allGrades,
    fetchGrades: fetchAllGrades,
    fetchStudentGrades,
    studentGrades: storeStudentGrades,
    loading: gradesLoading,
  } = useGradeStore();
  const { classes, fetchClasses } = useClassStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  const [activeTab, setActiveTab] = useState("info");
  const [grades, setGrades] = useState<GradeWithDetails[]>([]);
  const [groupedGrades, setGroupedGrades] = useState<AcademicYearGrades[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<string>("all");
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [showOnlyRetakes, setShowOnlyRetakes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedEnrollmentForGrades, setSelectedEnrollmentForGrades] =
    useState<Enrollment | null>(null);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [selectedControlType, setSelectedControlType] = useState<string>("all");

  const hasFetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false);

  const studentEnrollments = useMemo(
    () => getEnrollmentsByStudent(student.id),
    [student.id, getEnrollmentsByStudent, enrollments]
  );

  const { studentFees } = useFeeStructureStore();
  const { user } = useAuthStore();

  const currentEnrollment = useMemo(
    () =>
      studentEnrollments.find((e) => e.status === "Active") ||
      studentEnrollments[studentEnrollments.length - 1],
    [studentEnrollments]
  );

  // ============ FONCTIONS UTILITAIRES ============

  // Fonction pour extraire le nom de la classe
  const getClassName = (classId: string): string => {
    if (!classId) return "N/A";

    const classInfo = classes.find((c) => c.id === classId);
    if (classInfo) {
      return classInfo.name || `Classe ${classId}`;
    }

    const enrollment = studentEnrollments.find((e) => e.classId === classId);
    const enrollmentClassId = enrollment?.classId;
    if (
      enrollmentClassId &&
      typeof enrollmentClassId === "object" &&
      enrollmentClassId !== null &&
      "name" in (enrollmentClassId as any)
    ) {
      return (enrollmentClassId as any).name || `Classe ${classId}`;
    }

    return `Classe ${classId}`;
  };

  // Fonction pour extraire le niveau de la classe
  const getClassLevel = (classId: string): string => {
    if (!classId) return "N/A";

    const classInfo = classes.find((c) => c.id === classId);
    if (classInfo) {
      return classInfo.level || "N/A";
    }

    const enrollment = studentEnrollments.find((e) => e.classId === classId);
    if (
      enrollment &&
      typeof enrollment.classId === "object" &&
      enrollment.classId !== null &&
      "level" in (enrollment.classId as any)
    ) {
      return (enrollment.classId as any).level || "N/A";
    }

    return "N/A";
  };

  // Fonction pour extraire l'année académique
  const getAcademicYear = (academicYearId: string): string => {
    if (!academicYearId) return "N/A";

    const academicYear = academicYears.find((ay) => ay.id === academicYearId);
    if (academicYear) {
      return academicYear.year;
    }

    const enrollment = studentEnrollments.find(
      (e) => e.academicYearId === academicYearId
    );
    if (
      enrollment?.academicYear &&
      typeof enrollment.academicYear === "object" &&
      "year" in enrollment.academicYear
    ) {
      return enrollment.academicYear.year;
    }

    return academicYearId;
  };

  // Obtenir le nom de la matière
  const getSubjectName = (grade: GradeWithDetails): string => {
    if (grade.subject?.name) return grade.subject.name;
    if (grade.subject?.code) return grade.subject.code;
    return "Matière inconnue";
  };

  // Obtenir le coefficient
  const getSubjectCoefficient = (grade: GradeWithDetails): number => {
    return grade.subject?.coefficient || 1;
  };

  // Obtenir la note maximale
  const getSubjectMaxGrade = (grade: GradeWithDetails): number => {
    return grade.subject?.maxGrade || grade.maxGrade || 20;
  };

  // Obtenir la note normalisée sur 20
  const getNormalizedGrade = (grade: GradeWithDetails): number => {
    const gradeValue = grade.grade || 0;
    const maxGrade = getSubjectMaxGrade(grade);

    if (maxGrade === 20) return gradeValue;
    return (gradeValue / maxGrade) * 20;
  };

  // Calculer la moyenne pondérée avec coefficient et note maximale
  const calculateWeightedAverage = (grades: GradeWithDetails[]): number => {
    if (grades.length === 0) return 0;

    let totalWeightedGrade = 0;
    let totalWeight = 0;

    grades.forEach((grade) => {
      const coefficient = getSubjectCoefficient(grade);
      const maxGrade = getSubjectMaxGrade(grade);
      const gradeValue = grade.grade || 0;

      // Normaliser la note sur 20 si nécessaire
      const normalizedGrade =
        maxGrade && maxGrade !== 20 ? (gradeValue / maxGrade) * 20 : gradeValue;

      totalWeightedGrade += normalizedGrade * coefficient;
      totalWeight += coefficient;
    });

    return totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;
  };

  const getLevelText = (level: string) => {
    const levelNum = parseInt(level);
    if (isNaN(levelNum)) return level;
    if (levelNum === 1) return "1ère année";
    return `${levelNum}ème année`;
  };

  const formatDate = (date: string | Date) => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      if (!(d instanceof Date) || isNaN(d.getTime())) return "Date invalide";
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const getGradeStatusBadge = (grade: GradeWithDetails) => {
    const isRetake = grade.session === "Reprise" || grade.status === "Reprise";
    const isValid = grade.status === "Valid_" || (grade.grade || 0) >= 10;
    const isFailed = grade.status === "Non_valid_" || (grade.grade || 0) < 10;

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

  // Fonction pour gérer l'ouverture de la modal des notes
  const handleViewGrades = (enrollment: Enrollment) => {
    setSelectedEnrollmentForGrades(enrollment);
    setSelectedControlType("all");
    setShowGradesModal(true);
  };

  // Fonction pour obtenir les notes d'une inscription spécifique
  const getGradesForEnrollment = (
    enrollment: Enrollment
  ): GradeWithDetails[] => {
    if (!enrollment) return [];
    return grades.filter(
      (grade) => grade.academicYearId === enrollment.academicYearId
    );
  };

  // Obtenir les types de contrôle disponibles
  const getControlTypes = (enrollmentGrades: GradeWithDetails[]): string[] => {
    const types = new Set<string>();
    enrollmentGrades.forEach((grade) => {
      if (grade.controlType) {
        types.add(grade.controlType);
      }
    });
    return Array.from(types);
  };

  // Filtrer les notes par type de contrôle
  const filterGradesByControlType = (
    grades: GradeWithDetails[],
    controlType: string
  ): GradeWithDetails[] => {
    if (controlType === "all") return grades;
    return grades.filter((grade) => grade.controlType === controlType);
  };

  // Fonction pour obtenir les statistiques des notes d'une inscription
  const getEnrollmentStats = (enrollmentGrades: GradeWithDetails[]) => {
    if (enrollmentGrades.length === 0) {
      return {
        weightedAverage: 0,
        validatedCount: 0,
        failedCount: 0,
        totalCredits: 0,
        obtainedCredits: 0,
      };
    }

    const validatedGrades = enrollmentGrades.filter(
      (g) => g.status === "Valid_" || (g.grade || 0) >= 10
    );

    const weightedAverage = calculateWeightedAverage(enrollmentGrades);

    const totalCredits = enrollmentGrades.reduce(
      (sum, grade) => sum + getSubjectCoefficient(grade),
      0
    );
    const obtainedCredits = validatedGrades.reduce(
      (sum, grade) => sum + getSubjectCoefficient(grade),
      0
    );

    return {
      weightedAverage: Math.round(weightedAverage * 100) / 100,
      validatedCount: validatedGrades.length,
      failedCount: enrollmentGrades.length - validatedGrades.length,
      totalCredits,
      obtainedCredits,
    };
  };

  // ============ EFFETS ET LOGIQUE CORRIGÉS ============

  // Charger les classes et années académiques au montage
  useEffect(() => {
    const loadData = async () => {
      setLoadingClasses(true);
      try {
        await Promise.all([fetchClasses(), fetchAcademicYears()]);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoadingClasses(false);
      }
    };
    loadData();
  }, [fetchClasses, fetchAcademicYears]);

  // 🔴 CORRECTION CRITIQUE: Charger les notes de l'étudiant avec protection
  useEffect(() => {
    // Fonction pour charger les notes
    const loadStudentGrades = async () => {
      // Vérifier si déjà en cours ou déjà chargé
      if (fetchInProgressRef.current || !student.id) {
        console.log("⏭️ Fetch déjà en cours ou pas de studentId");
        return;
      }

      // Vérifier si on est sur un onglet qui nécessite les notes
      if (!(activeTab === "academic" || activeTab === "enrollments")) {
        return;
      }

      // Vérifier si déjà chargé
      if (hasFetchedRef.current) {
        console.log("⏭️ Notes déjà chargées pour cet étudiant");

        // Utiliser les notes déjà dans le store si disponibles
        if (storeStudentGrades && storeStudentGrades.length > 0) {
          setGrades(storeStudentGrades as GradeWithDetails[]);
        }
        return;
      }

      fetchInProgressRef.current = true;
      setLoadingGrades(true);

      try {
        console.log(`🚀 Début du chargement des notes pour ${student.id}`);

        // 1. Essayer fetchStudentGrades (fonction dédiée)
        try {
          const studentGrades = await fetchStudentGrades(student.id);
          console.log(
            `✅ fetchStudentGrades réussi: ${studentGrades?.length || 0} notes`
          );

          if (studentGrades && Array.isArray(studentGrades)) {
            setGrades(studentGrades as GradeWithDetails[]);
            hasFetchedRef.current = true;
            fetchInProgressRef.current = false;
            return;
          }
        } catch (error) {
          console.log(
            "⚠️ fetchStudentGrades échoué, tentative alternative:",
            error
          );
        }

        // 2. Si échec, utiliser les notes existantes du store global
        const filteredGrades = allGrades.filter(
          (grade) => grade.studentId === student.id
        ) as GradeWithDetails[];

        if (filteredGrades.length > 0) {
          console.log(
            `✅ Utilisation des notes existantes: ${filteredGrades.length} notes`
          );
          setGrades(filteredGrades);
          hasFetchedRef.current = true;
        } else {
          // 3. Si aucune note, tenter fetchAllGrades
          console.log("🔄 Aucune note trouvée, tentative fetchAllGrades");
          try {
            await fetchAllGrades({ studentId: student.id });
            // Après fetchAllGrades, refiltrer
            const newFilteredGrades = allGrades.filter(
              (grade) => grade.studentId === student.id
            ) as GradeWithDetails[];

            if (newFilteredGrades.length > 0) {
              setGrades(newFilteredGrades);
            } else {
              console.log("ℹ️ Aucune note disponible pour cet étudiant");
              setGrades([]);
            }
            hasFetchedRef.current = true;
          } catch (fetchError) {
            console.log("ℹ️ Aucune note disponible pour cet étudiant");
            setGrades([]);
            hasFetchedRef.current = true; // Même si vide, marquer comme chargé
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des notes:", error);
        setGrades([]);
        hasFetchedRef.current = true; // Même en cas d'erreur, marquer comme chargé
      } finally {
        setLoadingGrades(false);
        fetchInProgressRef.current = false;
        console.log("🏁 Fin du chargement des notes");
      }
    };

    loadStudentGrades();

    // 🔴 Nettoyage: réinitialiser hasFetched quand le composant est démonté ou quand student.id change
    return () => {
      hasFetchedRef.current = false;
      fetchInProgressRef.current = false;
    };
  }, [
    student.id,
    activeTab,
    allGrades,
    fetchAllGrades,
    fetchStudentGrades,
    storeStudentGrades,
  ]);

  // 🔴 NOUVEAU: Réinitialiser hasFetched quand l'onglet change (optionnel)
  useEffect(() => {
    if (activeTab === "academic" || activeTab === "enrollments") {
      // Permettre un rechargement si nécessaire
      if (
        grades.length === 0 &&
        !loadingGrades &&
        !fetchInProgressRef.current
      ) {
        hasFetchedRef.current = false;
      }
    }
  }, [activeTab, grades.length, loadingGrades]);

  // Grouper les notes par année académique
  useEffect(() => {
    const groupGradesByAcademicYear = () => {
      console.log(`📊 Groupement des notes: ${grades.length} notes à traiter`);

      const grouped: AcademicYearGrades[] = [];

      studentEnrollments.forEach((enrollment) => {
        const enrollmentGrades = grades.filter(
          (grade) => grade.academicYearId === enrollment.academicYearId
        );

        if (enrollmentGrades.length > 0) {
          const validatedGrades = enrollmentGrades.filter(
            (g) => g.status === "Valid_" || (g.grade || 0) >= 10
          );
          const failedGrades = enrollmentGrades.filter((g) => {
            const status = String(g.status);
            return (
              status === "Non_valid_" ||
              status === "Echec" ||
              (g.grade || 0) < 10
            );
          });
          const retakeGrades = enrollmentGrades.filter(
            (g) => g.session === "Reprise" || g.status === "Reprise"
          );

          const weightedAverage = calculateWeightedAverage(enrollmentGrades);

          const successRate =
            enrollmentGrades.length > 0
              ? (validatedGrades.length / enrollmentGrades.length) * 100
              : 0;

          const totalCredits = enrollmentGrades.reduce(
            (sum, grade) => sum + getSubjectCoefficient(grade),
            0
          );
          const obtainedCredits = validatedGrades.reduce(
            (sum, grade) => sum + getSubjectCoefficient(grade),
            0
          );

          const academicYear = getAcademicYear(enrollment.academicYearId);
          const academicYearId = enrollment.academicYearId;

          grouped.push({
            academicYear,
            academicYearId,
            enrollment,
            grades: enrollmentGrades,
            weightedAverage: Math.round(weightedAverage * 100) / 100,
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

      console.log(
        `✅ Groupement terminé: ${grouped.length} années académiques`
      );
    };

    if (grades.length > 0 || studentEnrollments.length > 0) {
      groupGradesByAcademicYear();
    }
  }, [grades, studentEnrollments, expandedYears]);

  const filteredGroupedGrades = useMemo(() => {
    return groupedGrades.filter(
      (group) =>
        selectedAcademicYear === "all" ||
        group.academicYearId === selectedAcademicYear
    );
  }, [groupedGrades, selectedAcademicYear]);

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

  // Calculer les statistiques globales
  const globalStats = useMemo(() => {
    const allGradesList = filteredGroupedGrades.flatMap(
      (group) => group.grades
    );

    if (allGradesList.length === 0) {
      return {
        totalGrades: 0,
        validatedCount: 0,
        failedCount: 0,
        retakeCount: 0,
        weightedAverage: 0,
        successRate: 0,
        totalCredits: 0,
        obtainedCredits: 0,
        creditProgress: 0,
      };
    }

    const validatedGrades = allGradesList.filter(
      (g) => g.status === "Valid_" || (g.grade || 0) >= 10
    );
    const failedGrades = allGradesList.filter((g) => {
      const status = String(g.status);
      return (
        status === "Non_valid_" || status === "Echec" || (g.grade || 0) < 10
      );
    });
    const retakeGrades = allGradesList.filter(
      (g) => g.session === "Reprise" || g.status === "Reprise"
    );

    const weightedAverage = calculateWeightedAverage(allGradesList);

    const totalCredits = allGradesList.reduce(
      (sum, grade) => sum + getSubjectCoefficient(grade),
      0
    );

    const obtainedCredits = validatedGrades.reduce(
      (sum, grade) => sum + getSubjectCoefficient(grade),
      0
    );

    return {
      totalGrades: allGradesList.length,
      validatedCount: validatedGrades.length,
      failedCount: failedGrades.length,
      retakeCount: retakeGrades.length,
      weightedAverage: Math.round(weightedAverage * 100) / 100,
      successRate: Math.round(
        (validatedGrades.length / allGradesList.length) * 100
      ),
      totalCredits,
      obtainedCredits,
      creditProgress:
        totalCredits > 0 ? (obtainedCredits / totalCredits) * 100 : 0,
    };
  }, [filteredGroupedGrades]);

  // Calculer GPA pondéré et taux de réussite
  const { gpa, successRate } = useMemo(() => {
    if (grades.length === 0) return { gpa: 0, successRate: 0 };

    const weightedAverage = calculateWeightedAverage(grades);
    const validatedGrades = grades.filter(
      (g) => g.status === "Valid_" || (g.grade || 0) >= 10
    ).length;

    return {
      gpa: Math.round(weightedAverage * 100) / 100,
      successRate: Math.round((validatedGrades / grades.length) * 100),
    };
  }, [grades]);

  // ============ RENDER ============

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[90vh] overflow-auto p-2 sm:p-0">
      {/* Header */}
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

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">
                          {gpa.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Moyenne pondérée
                        </div>
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
                          {successRate}%
                        </div>
                        <div className="text-xs text-slate-500">Réussite</div>
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
                          {grades.length}
                        </div>
                        <div className="text-xs text-slate-500">Notes</div>
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

      {/* Navigation */}
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
                        getSubjectName(grade)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      const matchesRetakeFilter =
                        !showOnlyRetakes ||
                        grade.session === "Reprise" ||
                        grade.status === "Reprise";
                      return matchesSearch && matchesRetakeFilter;
                    });

                    const isExpanded = expandedYears.has(group.academicYearId);
                    const className = getClassName(group.enrollment.classId);
                    const level = getClassLevel(group.enrollment.classId);

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
                                    {className}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getLevelText(level)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {group.weightedAverage.toFixed(2)}/20
                              </div>
                              <div className="text-xs text-slate-500">
                                Moyenne pondérée
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="pt-4">
                            {filteredGrades.length > 0 ? (
                              <div className="space-y-3">
                                {filteredGrades.map((grade) => {
                                  const normalizedGrade =
                                    getNormalizedGrade(grade);
                                  const coefficient =
                                    getSubjectCoefficient(grade);
                                  const maxGrade = getSubjectMaxGrade(grade);

                                  return (
                                    <div
                                      key={grade.id}
                                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-medium text-slate-900">
                                            {getSubjectName(grade)}
                                            <span className="text-xs text-slate-500 ml-2">
                                              (Coef: {coefficient})
                                            </span>
                                          </h4>
                                          {getGradeStatusBadge(grade)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {grade.controlType ||
                                            "Contrôle non spécifié"}
                                          {maxGrade !== 20 && (
                                            <span className="ml-2">
                                              (Sur {maxGrade})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div
                                          className={`text-lg font-bold ${getGradeColor(
                                            normalizedGrade
                                          )}`}
                                        >
                                          {grade.grade?.toFixed(2) || "0.00"}/
                                          {maxGrade}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          ({normalizedGrade.toFixed(2)}/20 ×{" "}
                                          {coefficient})
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
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
                      {getAcademicYear(currentEnrollment.academicYearId)}
                    </p>
                  </div>

                  <AssignFeesButton
                    studentId={student.id}
                    studentCode={student.studentCode}
                    academicYearId={currentEnrollment.academicYearId}
                    onSuccess={() => {}}
                  />
                </div>

                <StudentFeesSection
                  student={student}
                  currentEnrollment={{
                    ...currentEnrollment,
                    academicYear: getAcademicYear(
                      currentEnrollment.academicYearId
                    ),
                    academicYearId: currentEnrollment.academicYearId,
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
                      const enrollmentYear = getAcademicYear(
                        enrollment.academicYearId
                      );
                      const className = getClassName(enrollment.classId);
                      const level = getClassLevel(enrollment.classId);
                      const enrollmentGrades =
                        getGradesForEnrollment(enrollment);
                      const stats = getEnrollmentStats(enrollmentGrades);

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
                                    {className}
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
                                      {getLevelText(level)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(enrollment.enrollmentDate)}
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
                              {enrollmentGrades.length > 0 && (
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                  <span className="text-slate-700">
                                    Moyenne pondérée:{" "}
                                    <span className="font-bold">
                                      {stats.weightedAverage.toFixed(2)}/20
                                    </span>
                                  </span>
                                  <span className="text-slate-700">
                                    Validés:{" "}
                                    <span className="font-bold">
                                      {stats.validatedCount}/
                                      {enrollmentGrades.length}
                                    </span>
                                  </span>
                                  <span className="text-slate-700">
                                    Crédits:{" "}
                                    <span className="font-bold">
                                      {stats.obtainedCredits}/
                                      {stats.totalCredits}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {enrollment.status === "Active" && (
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                  En cours
                                </Badge>
                              )}

                              {/* Bouton pour voir les notes */}
                              <Dialog
                                open={
                                  showGradesModal &&
                                  selectedEnrollmentForGrades?.id ===
                                    enrollment.id
                                }
                                onOpenChange={setShowGradesModal}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewGrades(enrollment)}
                                    className="gap-1"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Voir les notes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Notes - {className} ({enrollmentYear})
                                    </DialogTitle>
                                  </DialogHeader>
                                  {enrollmentGrades.length > 0 ? (
                                    <div className="space-y-4">
                                      {/* Filtre par type de contrôle */}
                                      <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                          <div>
                                            <Label className="text-sm text-slate-700">
                                              Filtrer par contrôle
                                            </Label>
                                            <Select
                                              value={selectedControlType}
                                              onValueChange={
                                                setSelectedControlType
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Tous les contrôles" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="all">
                                                  Tous les contrôles
                                                </SelectItem>
                                                {getControlTypes(
                                                  enrollmentGrades
                                                ).map((type) => (
                                                  <SelectItem
                                                    key={type}
                                                    value={type}
                                                  >
                                                    {type}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-500">
                                              Année académique
                                            </p>
                                            <p className="font-semibold">
                                              {enrollmentYear}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-500">
                                              Classe
                                            </p>
                                            <p className="font-semibold">
                                              {className}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-500">
                                              Niveau
                                            </p>
                                            <p className="font-semibold">
                                              {getLevelText(level)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Notes filtrées */}
                                      {(() => {
                                        const filteredGrades =
                                          filterGradesByControlType(
                                            enrollmentGrades,
                                            selectedControlType
                                          );
                                        const filteredStats =
                                          getEnrollmentStats(filteredGrades);

                                        return (
                                          <>
                                            {/* Tableau des notes */}
                                            <div className="border rounded-lg overflow-hidden">
                                              <table className="w-full">
                                                <thead className="bg-slate-100">
                                                  <tr>
                                                    <th className="text-left p-3 font-medium">
                                                      Matière
                                                    </th>
                                                    <th className="text-left p-3 font-medium">
                                                      Note / Max
                                                    </th>
                                                    <th className="text-left p-3 font-medium">
                                                      Coefficient
                                                    </th>
                                                    <th className="text-left p-3 font-medium">
                                                      Contrôle
                                                    </th>
                                                    <th className="text-left p-3 font-medium">
                                                      Session
                                                    </th>
                                                    <th className="text-left p-3 font-medium">
                                                      Statut
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {filteredGrades.length > 0 ? (
                                                    filteredGrades.map(
                                                      (grade) => {
                                                        const normalizedGrade =
                                                          getNormalizedGrade(
                                                            grade
                                                          );
                                                        const coefficient =
                                                          getSubjectCoefficient(
                                                            grade
                                                          );
                                                        const maxGrade =
                                                          getSubjectMaxGrade(
                                                            grade
                                                          );

                                                        return (
                                                          <tr
                                                            key={grade.id}
                                                            className="border-t hover:bg-slate-50"
                                                          >
                                                            <td className="p-3">
                                                              <div>
                                                                <p className="font-medium">
                                                                  {getSubjectName(
                                                                    grade
                                                                  )}
                                                                </p>
                                                              </div>
                                                            </td>
                                                            <td className="p-3">
                                                              <div>
                                                                <span
                                                                  className={`font-bold ${getGradeColor(
                                                                    normalizedGrade
                                                                  )}`}
                                                                >
                                                                  {grade.grade?.toFixed(
                                                                    2
                                                                  ) || "0.00"}
                                                                  /{maxGrade}
                                                                </span>
                                                                <p className="text-xs text-slate-500">
                                                                  {normalizedGrade.toFixed(
                                                                    2
                                                                  )}
                                                                  /20
                                                                </p>
                                                              </div>
                                                            </td>
                                                            <td className="p-3">
                                                              <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                              >
                                                                {coefficient}
                                                              </Badge>
                                                            </td>
                                                            <td className="p-3">
                                                              <span className="text-sm">
                                                                {grade.controlType ||
                                                                  "Contrôle"}
                                                              </span>
                                                            </td>
                                                            <td className="p-3">
                                                              <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                              >
                                                                {grade.session ||
                                                                  "Session I"}
                                                              </Badge>
                                                            </td>
                                                            <td className="p-3">
                                                              {getGradeStatusBadge(
                                                                grade
                                                              )}
                                                            </td>
                                                          </tr>
                                                        );
                                                      }
                                                    )
                                                  ) : (
                                                    <tr>
                                                      <td
                                                        colSpan={6}
                                                        className="text-center p-8 text-slate-500"
                                                      >
                                                        Aucune note pour ce type
                                                        de contrôle
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>

                                            {/* Résumé */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-emerald-700">
                                                  Moyenne pondérée
                                                </p>
                                                <p className="text-2xl font-bold text-emerald-900">
                                                  {filteredStats.weightedAverage.toFixed(
                                                    2
                                                  )}
                                                  /20
                                                </p>
                                                <p className="text-xs text-emerald-600">
                                                  {selectedControlType !==
                                                    "all" &&
                                                    `Pour: ${selectedControlType}`}
                                                </p>
                                              </div>
                                              <div className="bg-blue-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-blue-700">
                                                  Validés
                                                </p>
                                                <p className="text-2xl font-bold text-blue-900">
                                                  {filteredStats.validatedCount}
                                                  /{filteredGrades.length}
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                  {selectedControlType !==
                                                    "all" &&
                                                    `Pour: ${selectedControlType}`}
                                                </p>
                                              </div>
                                              <div className="bg-amber-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-amber-700">
                                                  Crédits obtenus
                                                </p>
                                                <p className="text-2xl font-bold text-amber-900">
                                                  {
                                                    filteredStats.obtainedCredits
                                                  }
                                                  /{filteredStats.totalCredits}
                                                </p>
                                                <p className="text-xs text-amber-600">
                                                  {selectedControlType !==
                                                    "all" &&
                                                    `Pour: ${selectedControlType}`}
                                                </p>
                                              </div>
                                              <div className="bg-slate-50 p-3 rounded-lg text-center">
                                                <p className="text-sm text-slate-700">
                                                  Taux de réussite
                                                </p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                  {filteredGrades.length > 0
                                                    ? Math.round(
                                                        (filteredStats.validatedCount /
                                                          filteredGrades.length) *
                                                          100
                                                      )
                                                    : 0}
                                                  %
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                  {selectedControlType !==
                                                    "all" &&
                                                    `Pour: ${selectedControlType}`}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Note sur la pondération */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                              <p className="font-medium mb-1">
                                                Calcul de la moyenne pondérée :
                                              </p>
                                              <p className="text-xs">
                                                Moyenne = Σ(Note normalisée sur
                                                20 × Coefficient) /
                                                Σ(Coefficient)
                                              </p>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    <div className="text-center py-12">
                                      <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                      <p className="text-slate-500">
                                        Aucune note enregistrée pour cette
                                        inscription
                                      </p>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
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
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">
                  {loadingClasses ? "Chargement..." : "Aucun tuteur enregistré"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
