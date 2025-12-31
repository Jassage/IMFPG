import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  Save,
  Filter,
  Download,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Percent,
  Award,
  FileText,
  Info,
  Calendar,
  School,
  Book,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useGradeStore } from "@/store/gradeStore";
import { useStudentStore } from "@/store/studentStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAuthStore } from "@/store/authStore";
import { useClassStore } from "@/store/classStore";
import { useSubjectStore } from "@/store/subjectStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Grade,
  GradeStatus,
  ControlType,
  ClassLevel,
  Student,
  Subject,
  AcademicYear,
  ClassAssignment,
  SchoolClass,
} from "@/types/academic";

// Types pour le professeur
interface ProfessorGradeManagerProps {
  professorId?: string;
}

// Composants réutilisables
const LoadingSpinner = ({
  message = "Chargement...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    <p className="text-sm text-gray-600">{message}</p>
  </div>
);

const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient = "from-blue-100 to-blue-200",
  iconBg = "bg-blue-600",
  darkGradient = "from-blue-900/50 to-blue-800/50",
}: {
  icon: any;
  value: string | number;
  label: string;
  gradient?: string;
  iconBg?: string;
  darkGradient?: string;
}) => (
  <Card
    className={`border-0 shadow-lg bg-gradient-to-br ${gradient} dark:${darkGradient} overflow-hidden transition-all hover:shadow-xl`}
  >
    <CardContent className="p-6 relative">
      <div className="absolute top-4 right-4 opacity-20 dark:opacity-10">
        <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {label}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant de saisie de note inline avec validation maxGrade
const GradeInputInline = ({
  student,
  subject,
  existingGrade,
  onSave,
  onDelete,
  isLoading = false,
  controlType,
}: {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    controlType: ControlType;
  }) => Promise<void>;
  onDelete?: (gradeId: string) => Promise<void>;
  isLoading?: boolean;
  controlType: ControlType;
}) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [currentControlType, setCurrentControlType] = useState<ControlType>(
    existingGrade?.controlType || controlType
  );
  const [errors, setErrors] = useState<{ grade?: string }>({});

  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (gradeValue >= subject.passingGrade) return "Valid_";
    if (gradeValue >= subject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  useEffect(() => {
    if (existingGrade) {
      setGrade(existingGrade.grade.toString());
      setCurrentControlType(existingGrade.controlType);
    } else {
      setGrade("");
      setCurrentControlType(controlType);
    }
    setErrors({});
  }, [existingGrade, controlType]);

  const validateGrade = (value: string): string | null => {
    if (value.trim() === "") return null;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > subject.maxGrade)
      return `La note ne peut pas dépasser ${subject.maxGrade} (max: ${subject.maxGrade}/100)`;
    return null;
  };

  const handleGradeChange = (value: string) => {
    setGrade(value);
    const error = validateGrade(value);
    setErrors((prev) => ({ ...prev, grade: error || undefined }));
  };

  const handleSave = async () => {
    const gradeError = validateGrade(grade);
    if (gradeError) {
      setErrors({ grade: gradeError });
      toast.error(gradeError);
      return;
    }

    if (grade.trim() === "") {
      toast.error("Veuillez entrer une note");
      return;
    }

    const numericGrade = parseFloat(grade);
    const status = calculateStatus(numericGrade);

    await onSave({
      grade: numericGrade,
      status,
      controlType: currentControlType,
    });
  };

  const getStatusBadge = (gradeValue: string) => {
    if (!gradeValue.trim()) {
      return (
        <Badge
          variant="outline"
          className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
        >
          À noter
        </Badge>
      );
    }

    const numericGrade = parseFloat(gradeValue);
    const status = calculateStatus(numericGrade);

    return (
      <Badge
        className={
          status === "Valid_"
            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
            : status === "Reprendre"
            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700"
        }
      >
        {status === "Valid_"
          ? "Validé"
          : status === "Reprendre"
          ? "À reprendre"
          : "Non validé"}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border rounded-xl transition-all hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
      {/* Informations étudiant */}
      <div className="flex-1 mb-4 md:mb-0 md:mr-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {student.firstName} {student.lastName}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {student.studentCode}
              </Badge>
              {student.schoolClass && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                >
                  {student.schoolClass.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles de saisie */}
      <div className="w-full md:w-auto">
        <div className="grid grid-cols-2 md:flex md:items-center gap-4">
          {/* Coefficient et Note max */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
              Coef / Max
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    {subject.coefficient} / {subject.maxGrade}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coefficient: {subject.coefficient}</p>
                  <p>Note maximale: {subject.maxGrade}/100</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Note /100 */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Note /100
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max={subject.maxGrade}
                step="0.1"
                placeholder={`0-${subject.maxGrade}`}
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className={`h-10 ${
                  errors.grade
                    ? "border-destructive"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                disabled={isLoading}
              />
              {errors.grade && (
                <p className="absolute -bottom-5 left-0 text-xs text-destructive">
                  {errors.grade}
                </p>
              )}
            </div>
          </div>

          {/* Note /20 (calculée) */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Note /20
            </Label>
            <div className="h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 px-3">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {grade ? ((parseFloat(grade) / 100) * 20).toFixed(1) : "0.0"}
              </span>
            </div>
          </div>

          {/* Type de contrôle */}
          <div className="space-y-1 min-w-[140px]">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Contrôle
            </Label>
            <Select
              value={currentControlType}
              onValueChange={(value: ControlType) =>
                setCurrentControlType(value)
              }
            >
              <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Statut
            </Label>
            <div className="h-10 flex items-center">
              {getStatusBadge(grade)}
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-2 md:col-span-1 flex items-center gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="h-10 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!!errors.grade || isLoading || grade.trim() === ""}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : existingGrade ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>

            {existingGrade && onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="h-10 w-10 p-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Supprimer cette note ?")) {
                    await onDelete(existingGrade.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
export const ProfessorGradeManager = ({
  professorId,
}: ProfessorGradeManagerProps) => {
  const { user } = useAuthStore();
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { grades, fetchGrades, addGrade, updateGrade, deleteGrade } =
    useGradeStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { classes, fetchClasses } = useClassStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  // ID du professeur (soit depuis props, soit depuis l'auth)
  const currentProfessorId = user?.professeur?.id;

  // États
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtres
  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    subjectId: "",
    controlType: "CONTROLE_1" as ControlType,
  });

  // Données sélectionnées
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentProfessorId) return;

      setLoading(true);
      setError(null);

      try {
        // Charger toutes les données nécessaires
        await Promise.all([
          fetchAcademicYears(),
          fetchAssignments(),
          fetchClasses(),
          fetchSubjects(),
          fetchStudents(),
        ]);

        // Trouver l'année académique en cours
        const currentYear = academicYears.find((ay) => ay.isCurrent);
        if (currentYear) {
          setFilters((prev) => ({ ...prev, academicYearId: currentYear.id }));
          setSelectedAcademicYear(currentYear);
        }

        toast.success("Données chargées avec succès");
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setError("Impossible de charger les données");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [currentProfessorId]);

  // Obtenir les affectations du professeur pour l'année sélectionnée
  const professorAssignments = useMemo(() => {
    if (!currentProfessorId || !filters.academicYearId) return [];

    console.log("Tous les assignments:", assignments);
    console.log("Professeur ID:", currentProfessorId);
    console.log("Année ID:", filters.academicYearId);

    const filtered = assignments.filter((assignment) => {
      const matches =
        assignment.professeur.id === currentProfessorId &&
        assignment.academicYear.id === filters.academicYearId;

      if (matches) {
        console.log("Assignment trouvé:", assignment);
      }
      return matches;
    });

    console.log("Assignments filtrés:", filtered);
    return filtered;
  }, [assignments, currentProfessorId, filters.academicYearId]);

  useEffect(() => {
    if (filters.subjectId && selectedSubject) {
      const assignment = professorAssignments.find(
        (a) =>
          a.subject.id === filters.subjectId &&
          selectedClass &&
          a.classLevel === selectedClass.level
      );
      setSelectedAssignment(assignment);
      console.log("Assignment pour la matière:", assignment);
    }
  }, [filters.subjectId, selectedSubject, selectedClass, professorAssignments]);

  // Obtenir les classes où le professeur enseigne (unique)
  const professorClasses = useMemo(() => {
    if (!filters.academicYearId || professorAssignments.length === 0) {
      console.log("Pas d'assignments pour cette année");
      return [];
    }

    console.log("Assignments du prof:", professorAssignments);

    // Récupérer tous les classLevel uniques des assignments
    const assignedClassLevels = professorAssignments
      .map((assignment) => {
        console.log("Assignment classLevel:", assignment.classLevel);
        return assignment.classLevel;
      })
      .filter((level, index, self) => {
        const isUnique = level && self.indexOf(level) === index;
        console.log(`ClassLevel ${level}: unique=${isUnique}`);
        return isUnique;
      });

    console.log("ClassLevels uniques:", assignedClassLevels);

    // Récupérer les classes qui correspondent à ces classLevels
    const professorClassesList = classes.filter((cls) => {
      const found = assignedClassLevels.includes(cls.level);
      console.log(`Classe ${cls.name} (${cls.level}) trouvée: ${found}`);
      return found;
    });

    console.log("Classes du professeur:", professorClassesList);
    return professorClassesList;
  }, [professorAssignments, classes, filters.academicYearId]);

  // Obtenir les matières que le professeur enseigne pour la classe sélectionnée
  const getClassLevelFromClass = (classId: string): string | null => {
    const cls = classes.find((c) => c.id === classId);
    return cls?.level || null;
  };

  // Matières du professeur pour la classe sélectionnée
  const professorSubjects = useMemo(() => {
    if (!filters.academicYearId || !filters.classId) return [];

    const classLevel = getClassLevelFromClass(filters.classId);
    if (!classLevel) return [];

    const assignmentsForClass = professorAssignments.filter(
      (assignment) => assignment.classLevel === classLevel
    );

    console.log("Assignments pour la classe:", assignmentsForClass);
    console.log("Classe sélectionnée level:", classLevel);

    // Récupérer les matières de ces assignments
    const subjectIds = assignmentsForClass
      .map((assignment) => assignment.subject.id)
      .filter((id, index, self) => id && self.indexOf(id) === index);

    console.log("Subject IDs:", subjectIds);

    return subjects
      .filter((subject) => subjectIds.includes(subject.id))
      .map((subject) => {
        const assignment = assignmentsForClass.find(
          (a) => a.subject.id === subject.id
        );
        return {
          ...subject,
          assignmentId: assignment?.id,
          assignmentData: assignment,
        };
      });
  }, [
    professorAssignments,
    subjects,
    filters.academicYearId,
    filters.classId,
    classes,
  ]);

  // Obtenir les étudiants de la classe sélectionnée
  const classStudents = useMemo(() => {
    if (!filters.classId) return [];

    return students.filter(
      (student) =>
        student.status === "Active" &&
        student.schoolClass?.id === filters.classId
    );
  }, [students, filters.classId]);

  // Charger les notes quand les filtres changent
  useEffect(() => {
    const loadGrades = async () => {
      if (!filters.academicYearId || !filters.classId || !filters.subjectId)
        return;

      try {
        await fetchGrades({
          academicYearId: filters.academicYearId,
          subjectId: filters.subjectId,
          controlType: filters.controlType || undefined,
        });
      } catch (error) {
        console.error("Erreur chargement notes:", error);
        toast.error("Erreur lors du chargement des notes");
      }
    };

    loadGrades();
  }, [filters]);

  // Gérer le changement de filtre
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };

        // Réinitialiser les dépendances
        if (key === "academicYearId") {
          newFilters.classId = "";
          newFilters.subjectId = "";
          setSelectedClass(null);
          setSelectedSubject(null);

          const year = academicYears.find((ay) => ay.id === value);
          setSelectedAcademicYear(year || null);
        }

        if (key === "classId") {
          newFilters.subjectId = "";
          setSelectedSubject(null);

          const cls = classes.find((c) => c.id === value);
          setSelectedClass((cls as unknown as SchoolClass) || null);
        }

        if (key === "subjectId") {
          const subject = subjects.find((s) => s.id === value);
          setSelectedSubject(subject || null);
        }

        return newFilters;
      });
    },
    [academicYears, classes, subjects]
  );

  // Obtenir les notes existantes filtrées
  const existingGrades = useMemo(() => {
    if (!filters.academicYearId || !filters.classId || !filters.subjectId)
      return [];

    return grades.filter(
      (grade) =>
        grade.subjectId === filters.subjectId &&
        grade.academicYearId === filters.academicYearId &&
        (!filters.controlType || grade.controlType === filters.controlType)
    );
  }, [grades, filters]);

  // Obtenir les étudiants sans note pour la matière sélectionnée
  const studentsWithoutGrade = useMemo(() => {
    const studentsWithGrade = new Set(existingGrades.map((g) => g.studentId));
    return classStudents.filter(
      (student) => !studentsWithGrade.has(student.id)
    );
  }, [classStudents, existingGrades]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    if (existingGrades.length === 0 || !selectedSubject) return null;

    const total = existingGrades.length;
    const average = existingGrades.reduce((sum, g) => sum + g.grade, 0) / total;
    const passed = existingGrades.filter(
      (g) => g.grade >= selectedSubject.passingGrade
    ).length;
    const successRate = (passed / total) * 100;

    // Trouver les meilleures et pires notes
    const sortedGrades = [...existingGrades].sort((a, b) => b.grade - a.grade);
    const bestGrade = sortedGrades[0];
    const worstGrade = sortedGrades[sortedGrades.length - 1];

    return {
      totalGrades: total,
      averageGrade: parseFloat(average.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(1)),
      passedGrades: passed,
      failedGrades: total - passed,
      bestGrade: bestGrade?.grade || 0,
      worstGrade: worstGrade?.grade || 0,
      completionRate: ((total / classStudents.length) * 100).toFixed(1),
    };
  }, [existingGrades, selectedSubject, classStudents]);

  // Sauvegarder une note avec validation maxGrade
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      controlType: ControlType;
    }
  ) => {
    if (
      !selectedSubject ||
      !selectedAcademicYear ||
      !selectedClass ||
      !selectedAssignment
    ) {
      toast.error("Données manquantes");
      return;
    }

    // Validation de la note
    if (gradeData.grade < 0 || gradeData.grade > selectedSubject.maxGrade) {
      toast.error(`La note doit être entre 0 et ${selectedSubject.maxGrade}`);
      return;
    }

    setIsSaving(true);
    try {
      // Utiliser l'assignation déjà trouvée
      if (!selectedAssignment) {
        toast.error("Affectation non trouvée");
        return;
      }

      console.log("Utilisation de l'assignation:", selectedAssignment);

      // Vérifier si une note existe déjà
      const existingGrade = existingGrades.find(
        (g) =>
          g.studentId === studentId && g.controlType === gradeData.controlType
      );

      const gradeToSend = {
        studentId,
        subjectId,
        assignmentId: selectedAssignment.id,
        grade: gradeData.grade,
        status: gradeData.status,
        session: "Normale" as any,
        controlType: gradeData.controlType,
        academicYearId: selectedAcademicYear.id,
        classLevel: selectedClass.level as ClassLevel,
        isActive: true,
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
        });
        toast.success("Note modifiée avec succès");
      } else {
        await addGrade(gradeToSend as any);
        toast.success("Note ajoutée avec succès");
      }

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType || undefined,
      });
    } catch (error: any) {
      console.error("❌ Erreur sauvegarde note:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la sauvegarde de la note"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer une note
  const handleDeleteGrade = async (gradeId: string) => {
    try {
      await deleteGrade(gradeId);
      toast.success("Note supprimée avec succès");

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType || undefined,
      });
    } catch (error) {
      console.error("Erreur suppression note:", error);
      toast.error("Erreur lors de la suppression de la note");
    }
  };

  // Exporter les notes en Excel
  const handleExportExcel = () => {
    try {
      if (!selectedSubject || existingGrades.length === 0) {
        toast.error("Aucune note à exporter");
        return;
      }

      const dataToExport = existingGrades.map((grade) => {
        const student = students.find((s) => s.id === grade.studentId);

        return {
          Matricule: student?.studentCode || "N/A",
          "Nom et Prénom": `${student?.lastName} ${student?.firstName}`,
          Classe: selectedClass?.name || "N/A",
          Matière: selectedSubject.name,
          "Note /100": grade.grade,
          "Note /20": ((grade.grade / 100) * 20).toFixed(2),
          Coefficient: selectedSubject.coefficient,
          "Points pondérés": (
            (grade.grade / 100) *
            20 *
            selectedSubject.coefficient
          ).toFixed(2),
          Statut:
            grade.status === "Valid_"
              ? "Validé"
              : grade.status === "Reprendre"
              ? "À reprendre"
              : "Non validé",
          "Type contrôle": grade.controlType,
          "Date saisie": new Date(grade.createdAt).toLocaleDateString(),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `notes-${selectedSubject.code}-${selectedClass?.name}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      saveAs(blob, fileName);

      toast.success("Export Excel réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export Excel");
    }
  };

  // Filtrer les étudiants par terme de recherche
  const filteredStudents = useMemo(() => {
    // Combiner étudiants avec et sans notes
    const allStudents = [...classStudents];

    if (!searchTerm) return allStudents;

    return allStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  if (loading) {
    return <LoadingSpinner message="Chargement de vos données..." />;
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Saisie des Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.firstName} {user?.lastName} • Professeur
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
            disabled={!selectedSubject || existingGrades.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Filtres de saisie
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Année académique */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-sm font-medium">
                Année académique
              </Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) =>
                  handleFilterChange("academicYearId", value)
                }
                disabled={loading}
              >
                <SelectTrigger
                  id="academicYear"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                      {year.isCurrent && " (En cours)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Classe */}
            <div className="space-y-2">
              <Label htmlFor="class" className="text-sm font-medium">
                Classe
              </Label>
              <Select
                value={filters.classId}
                onValueChange={(value) => handleFilterChange("classId", value)}
                disabled={
                  !filters.academicYearId || professorClasses.length === 0
                }
              >
                <SelectTrigger
                  id="class"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      !filters.academicYearId
                        ? "Sélectionnez d'abord une année"
                        : professorClasses.length === 0
                        ? "Aucune classe assignée"
                        : "Sélectionner une classe"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {professorClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Matière
              </Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) =>
                  handleFilterChange("subjectId", value)
                }
                disabled={!filters.classId || professorSubjects.length === 0}
              >
                <SelectTrigger
                  id="subject"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      !filters.classId
                        ? "Sélectionnez d'abord une classe"
                        : professorSubjects.length === 0
                        ? "Aucune matière assignée"
                        : "Sélectionner une matière"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {professorSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {subject.code} - {subject.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Coef: {subject.coefficient} | Max: {subject.maxGrade}
                          /100
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de contrôle */}
            <div className="space-y-2">
              <Label htmlFor="controlType" className="text-sm font-medium">
                Type de contrôle
              </Label>
              <Select
                value={filters.controlType}
                onValueChange={(value) =>
                  handleFilterChange("controlType", value)
                }
                disabled={!filters.subjectId}
              >
                <SelectTrigger
                  id="controlType"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Type de contrôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                  <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                  <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                  <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Barre de recherche */}
          {filters.subjectId && (
            <div className="mt-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  className="pl-9 h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations sur la sélection */}
      {selectedClass && selectedSubject && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  {selectedClass.level}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  {filters.controlType}
                </Badge>
                <Badge className="text-xs bg-amber-500/20 text-amber-100 border-amber-400/30">
                  {selectedSubject.code}
                </Badge>
                <Badge className="text-xs bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                  Max: {selectedSubject.maxGrade}/100
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{selectedClass.name}</h2>
              <div className="flex items-center gap-6 mt-2 flex-wrap text-sm">
                <div>
                  <p className="text-indigo-200">Année académique</p>
                  <p className="font-semibold">
                    {selectedAcademicYear?.year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Matière</p>
                  <p className="font-semibold">{selectedSubject.name}</p>
                </div>
                <div>
                  <p className="text-indigo-200">Étudiants dans la classe</p>
                  <p className="font-semibold">{classStudents.length}</p>
                </div>
                <div>
                  <p className="text-indigo-200">Notes saisies</p>
                  <p className="font-semibold">
                    {existingGrades.length}/{classStudents.length}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Seuil de validation</p>
                  <p className="font-semibold">
                    {selectedSubject.passingGrade}/100
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Note maximale</p>
                  <p className="font-semibold">
                    {selectedSubject.maxGrade}/100
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      {selectedSubject && statistics && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Calendar}
            value={selectedAcademicYear?.year || "N/A"}
            label="Année académique"
            gradient="from-blue-100 to-blue-200"
            darkGradient="from-blue-900/50 to-blue-800/50"
          />
          <StatCard
            icon={Users}
            value={classStudents.length}
            label="Étudiants"
            gradient="from-green-100 to-green-200"
            iconBg="bg-green-600"
            darkGradient="from-green-900/50 to-green-800/50"
          />
          <StatCard
            icon={FileText}
            value={statistics.totalGrades}
            label="Notes saisies"
            gradient="from-purple-100 to-purple-200"
            iconBg="bg-purple-600"
            darkGradient="from-purple-900/50 to-purple-800/50"
          />
          <StatCard
            icon={BarChart3}
            value={statistics.averageGrade.toFixed(1)}
            label="Moyenne /100"
            gradient="from-amber-100 to-amber-200"
            iconBg="bg-amber-600"
            darkGradient="from-amber-900/50 to-amber-800/50"
          />
          <StatCard
            icon={Percent}
            value={((statistics.averageGrade / 100) * 20).toFixed(1)}
            label="Moyenne /20"
            gradient="from-pink-100 to-pink-200"
            iconBg="bg-pink-600"
            darkGradient="from-pink-900/50 to-pink-800/50"
          />
          <StatCard
            icon={CheckCircle}
            value={`${statistics.successRate.toFixed(1)}%`}
            label="Taux de réussite"
            gradient="from-indigo-100 to-indigo-200"
            iconBg="bg-indigo-600"
            darkGradient="from-indigo-900/50 to-indigo-800/50"
          />
        </div>
      )}

      {/* Liste des étudiants */}
      {selectedSubject && classStudents.length > 0 ? (
        <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedSubject.name} ({selectedSubject.code})
                </CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                    Classe: {selectedClass?.name}
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    Coef. {selectedSubject.coefficient}
                  </Badge>
                  <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                    Seuil: {selectedSubject.passingGrade}/100
                  </Badge>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                    Max: {selectedSubject.maxGrade}/100
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {classStudents.length} étudiant(s) dans la classe
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="saisie" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="saisie" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Saisie des notes
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Notes existantes ({existingGrades.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saisie" className="space-y-4">
                <div className="space-y-3">
                  {filteredStudents.map((student) => {
                    const existingGrade = existingGrades.find(
                      (g) =>
                        g.studentId === student.id &&
                        g.controlType === filters.controlType
                    );

                    return (
                      <GradeInputInline
                        key={student.id}
                        student={student}
                        subject={selectedSubject}
                        existingGrade={existingGrade}
                        onSave={(gradeData) =>
                          handleSaveGrade(
                            student.id,
                            selectedSubject.id,
                            gradeData
                          )
                        }
                        onDelete={handleDeleteGrade}
                        isLoading={isSaving}
                        controlType={filters.controlType}
                      />
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-3">
                  {existingGrades.map((grade) => {
                    const student = students.find(
                      (s) => s.id === grade.studentId
                    );
                    if (!student) return null;

                    return (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.studentCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge
                              className={
                                grade.status === "Valid_"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                  : grade.status === "Reprendre"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                              }
                            >
                              {grade.grade}/100
                            </Badge>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {grade.controlType}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Pour éditer, on peut utiliser le même GradeInputInline
                                // On pourrait aussi ouvrir un modal
                              }}
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                if (confirm("Supprimer cette note ?")) {
                                  await handleDeleteGrade(grade.id);
                                }
                              }}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {existingGrades.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">Aucune note enregistrée</p>
                      <p className="text-sm">Commencez par saisir des notes</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Sélectionnez une matière</h3>
          <p className="text-gray-600 mt-2">
            Veuillez sélectionner une année, une classe et une matière pour
            commencer la saisie des notes.
          </p>
        </Card>
      )}

      {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Avertissement si pas de classes assignées */}
      {filters.academicYearId && professorClasses.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Vous n'êtes assigné à aucune classe pour cette année académique.
            Contactez l'administration pour être assigné à une classe.
          </AlertDescription>
        </Alert>
      )}

      {/* Avertissement si pas de matières pour la classe */}
      {filters.classId && professorSubjects.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Vous n'enseignez aucune matière dans cette classe.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProfessorGradeManager;
