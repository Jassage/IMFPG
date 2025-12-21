import { useState, useMemo, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  Save,
  Trash2,
  Filter,
  Plus,
  Upload,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  User,
  Book,
  Percent,
  Menu,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useGradeStore } from "@/store/gradeStore";
import { useStudentStore } from "@/store/studentStore";
import { useClassStore } from "@/store/classStore";
import { useAssignmentStore } from "@/store/assignmentStore";
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
} from "@/types/academic";
import { useTheme } from "next-themes";

// Types simplifiés
interface GradeInput {
  grade: string;
  status: GradeStatus;
  controlType: ControlType;
}

interface Statistics {
  totalGrades: number;
  averageGrade: number;
  successRate: number;
  passedGrades: number;
  failedGrades: number;
}

// Composant de chargement avec dark mode
const LoadingSpinner = ({
  message = "Chargement...",
}: {
  message?: string;
}) => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

// Composant d'état vide avec dark mode
const EmptyState = ({
  icon: Icon = BookOpen,
  title,
  description,
}: {
  icon?: any;
  title: string;
  description: string;
}) => (
  <div className="text-center py-12">
    <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
    <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
      {description}
    </p>
  </div>
);

// Carte de statistiques responsive
const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient = "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
  iconBg = "bg-blue-600 dark:bg-blue-700",
}: {
  icon: any;
  value: string | number;
  label: string;
  gradient?: string;
  iconBg?: string;
}) => (
  <Card
    className={`border-0 shadow-md bg-gradient-to-br ${gradient} overflow-hidden`}
  >
    <CardContent className="p-4 sm:p-5 relative">
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-20">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 rounded-full ${iconBg} shadow-sm`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {value}
          </p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour l'input de note inline responsive
const GradeInputInline = ({
  student,
  subject,
  existingGrade,
  onSave,
  onDelete,
  isLoading = false,
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
}) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [controlType, setControlType] = useState<ControlType>(
    existingGrade?.controlType || "CONTROLE_1"
  );
  const [errors, setErrors] = useState<{ grade?: string }>({});

  // Calculer automatiquement le statut basé sur la note
  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (gradeValue >= subject.passingGrade) return "Valid_";
    if (gradeValue >= subject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  useEffect(() => {
    if (existingGrade) {
      setGrade(existingGrade.grade.toString());
      setControlType(existingGrade.controlType);
    } else {
      setGrade("");
      setControlType("CONTROLE_1");
    }
    setErrors({});
  }, [existingGrade]);

  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return "La note est requise";
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0 || numericValue > 100)
      return "La note doit être entre 0 et 100";
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

    const numericGrade = parseFloat(grade);
    const status = calculateStatus(numericGrade);

    await onSave({
      grade: numericGrade,
      status,
      controlType,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-900 transition-colors">
      {/* Étudiant - Mobile first */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {student.studentCode}
              {student.schoolClass && ` • ${student.schoolClass.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Contrôles - Responsive grid */}
      <div className="w-full sm:w-auto">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4">
          {/* Coefficient */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Coef
            </div>
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
              {subject.coefficient}
            </Badge>
          </div>

          {/* Note sur 100 */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Note /100
            </Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="0.0"
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className={`h-9 sm:h-10 ${
                errors.grade ? "border-destructive" : ""
              }`}
              disabled={isLoading}
            />
            {errors.grade && (
              <p className="text-xs text-destructive">{errors.grade}</p>
            )}
          </div>

          {/* Note sur 20 (calculée automatiquement) */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Note /20
            </Label>
            <div className="h-9 sm:h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 px-3">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {grade ? ((parseFloat(grade) / 100) * 20).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          {/* Type de contrôle - Masqué sur mobile, affiché sur tablette et desktop */}
          <div className="hidden md:block space-y-1 min-w-[120px]">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Contrôle
            </Label>
            <Select
              value={controlType}
              onValueChange={(value: ControlType) => setControlType(value)}
            >
              <SelectTrigger className="h-9 sm:h-10">
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
            <div className="h-9 sm:h-10 flex items-center">
              {grade ? (
                <Badge
                  className={`
                    ${
                      calculateStatus(parseFloat(grade)) === "Valid_"
                        ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        : calculateStatus(parseFloat(grade)) === "Reprendre"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                        : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                    }
                  `}
                >
                  {calculateStatus(parseFloat(grade)) === "Valid_"
                    ? "Validé"
                    : calculateStatus(parseFloat(grade)) === "Reprendre"
                    ? "À reprendre"
                    : "Non validé"}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-gray-500 dark:text-gray-400"
                >
                  Non noté
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 justify-end sm:justify-start">
            <Button
              onClick={handleSave}
              size="sm"
              className="h-9 sm:h-10 px-3 sm:px-4 flex-1 sm:flex-none"
              disabled={!!errors.grade || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : existingGrade ? (
                "Mettre à jour"
              ) : (
                "Enregistrer"
              )}
            </Button>

            {existingGrade && onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="h-9 sm:h-10 w-9 sm:w-10 p-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={async () => {
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

        {/* Type de contrôle pour mobile seulement */}
        <div className="mt-3 md:hidden">
          <Select
            value={controlType}
            onValueChange={(value: ControlType) => setControlType(value)}
          >
            <SelectTrigger className="h-9 w-full">
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
    </div>
  );
};

// Contrôles en masse responsive
const BulkControls = ({
  selectedCount,
  onSave,
  onCancel,
  isLoading = false,
  bulkGrades,
  setBulkGrades,
  selectedSubject,
}: {
  selectedCount: number;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  bulkGrades: { [key: string]: GradeInput };
  setBulkGrades: React.Dispatch<
    React.SetStateAction<{ [key: string]: GradeInput }>
  >;
  selectedSubject: Subject | null;
}) => {
  const [grade, setGrade] = useState("");
  const [controlType, setControlType] = useState<ControlType>("CONTROLE_1");

  const calculateBulkStatus = (gradeValue: number): GradeStatus => {
    if (!selectedSubject) return "Valid_";
    if (gradeValue >= selectedSubject.passingGrade) return "Valid_";
    if (gradeValue >= selectedSubject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  const handleApply = () => {
    if (grade.trim()) {
      const numericGrade = parseFloat(grade);
      const status = calculateBulkStatus(numericGrade);

      const newBulkGrades = { ...bulkGrades };

      Object.keys(newBulkGrades).forEach((studentId) => {
        newBulkGrades[studentId] = {
          grade,
          status,
          controlType,
        };
      });

      setBulkGrades(newBulkGrades);
      toast.success("Notes appliquées aux étudiants sélectionnés");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-4 border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            ✅ {selectedCount} étudiant(s) sélectionné(s)
          </Badge>
          {selectedSubject && (
            <Badge
              variant="outline"
              className="border-blue-300 dark:border-blue-700"
            >
              Seuil: {selectedSubject.passingGrade}/100
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Note (/100)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="0.0"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Contrôle</Label>
          <Select
            value={controlType}
            onValueChange={(value: ControlType) => setControlType(value)}
          >
            <SelectTrigger className="h-10">
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

        <div className="space-y-2 flex items-end">
          <Button
            onClick={handleApply}
            className="h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 w-full"
            disabled={!grade.trim() || isLoading}
          >
            Appliquer aux sélectionnés
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          className="h-10 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={onSave}
          className="h-10 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700 dark:hover:from-green-600 dark:hover:to-teal-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          <span className="hidden sm:inline">Sauvegarder tout</span>
          <span className="sm:hidden">Sauvegarder</span>
        </Button>
      </div>
    </div>
  );
};

// Composant principal
export const GradeManager = () => {
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const {
    grades,
    fetchGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    bulkAddGrades,
  } = useGradeStore();
  const { classes, fetchClasses } = useClassStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    academicYearId: "",
    classLevel: "" as ClassLevel | "",
    subjectId: "",
    controlType: "" as ControlType | "",
  });

  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkGrades, setBulkGrades] = useState<{
    [key: string]: GradeInput;
  }>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [availableAssignments, setAvailableAssignments] = useState<
    ClassAssignment[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  // Éviter l'hydratation mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAcademicYears(),
          fetchSubjects(),
          fetchStudents(),
          fetchClasses(),
        ]);

        if (academicYears.length > 0) {
          const currentAcademicYear =
            academicYears.find((ay) => ay.isCurrent) || academicYears[0];
          if (currentAcademicYear) {
            setFilters((prev) => ({
              ...prev,
              academicYearId: currentAcademicYear.id,
            }));
            setSelectedAcademicYear(currentAcademicYear);
          }
        }
      } catch (error) {
        console.error("Erreur chargement données initiales:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Fonction pour valider et convertir un ClassAssignment
  const validateClassAssignment = (data: any): ClassAssignment | null => {
    try {
      if (!data.id || !data.classLevel || !data.academicYearId) {
        return null;
      }

      const validClassLevels: ClassLevel[] = [
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
      ];

      if (!validClassLevels.includes(data.classLevel as ClassLevel)) {
        return null;
      }

      return {
        id: data.id,
        subjectId: data.subjectId,
        professeurId: data.professeurId || data.professorId,
        classLevel: data.classLevel as ClassLevel,
        academicYearId: data.academicYearId,
        status: data.status || "Active",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        academicYear: data.academicYear,
        professeur: data.professeur,
        subject: data.subject,
        schedules: data.schedules,
        grades: data.grades,
      };
    } catch (error) {
      return null;
    }
  };

  // Charger les données filtrées
  useEffect(() => {
    const loadFilteredData = async () => {
      if (!filters.academicYearId || !filters.classLevel) return;

      setLoading(true);
      try {
        await fetchAssignments();
        const allAssignments = useAssignmentStore.getState().assignments;

        const filteredAssignments = allAssignments
          .filter(
            (assignment) =>
              assignment.academicYearId === filters.academicYearId &&
              assignment.classLevel === filters.classLevel &&
              assignment.status === "Active"
          )
          .map(validateClassAssignment)
          .filter(Boolean) as ClassAssignment[];

        setAvailableAssignments(filteredAssignments);

        const filtersToSend = {
          academicYearId: filters.academicYearId,
          classLevel: filters.classLevel || undefined,
          subjectId: filters.subjectId || undefined,
          controlType: filters.controlType || undefined,
        };

        await fetchGrades(filtersToSend);

        if (filters.classLevel) {
          const classStudents = students.filter(
            (student) =>
              student.status === "Active" &&
              student.schoolClass?.level === filters.classLevel
          );
          setAvailableStudents(classStudents);
        } else {
          setAvailableStudents(students.filter((s) => s.status === "Active"));
        }

        calculateStatistics();
      } catch (error) {
        console.error("Erreur chargement données filtrées:", error);
        toast.error("Erreur lors du chargement des données filtrées");
      } finally {
        setLoading(false);
      }
    };

    loadFilteredData();
  }, [filters]);

  // Calculer les statistiques
  const calculateStatistics = () => {
    const filtered = getFilteredGrades();
    const total = filtered.length;

    if (total === 0) {
      setStatistics({
        totalGrades: 0,
        averageGrade: 0,
        successRate: 0,
        passedGrades: 0,
        failedGrades: 0,
      });
      return;
    }

    const average = filtered.reduce((sum, g) => sum + g.grade, 0) / total;
    const passed = filtered.filter((g) => {
      const subject = subjects.find((s) => s.id === g.subjectId);
      return subject ? g.grade >= subject.passingGrade : false;
    }).length;
    const successRate = (passed / total) * 100;

    setStatistics({
      totalGrades: total,
      averageGrade: parseFloat(average.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      passedGrades: passed,
      failedGrades: total - passed,
    });
  };

  // Obtenir les notes filtrées
  const getFilteredGrades = () => {
    return grades.filter((grade) => {
      const matchesAcademicYear =
        !filters.academicYearId ||
        grade.academicYearId === filters.academicYearId;
      const matchesClassLevel =
        !filters.classLevel || grade.classLevel === filters.classLevel;
      const matchesSubject =
        !filters.subjectId || grade.subjectId === filters.subjectId;
      const matchesControlType =
        !filters.controlType || grade.controlType === filters.controlType;

      return (
        matchesAcademicYear &&
        matchesClassLevel &&
        matchesSubject &&
        matchesControlType
      );
    });
  };

  // Obtenir les affectations pour la matière sélectionnée
  const getAssignmentsForSelectedSubject = () => {
    if (!selectedSubject || !filters.academicYearId || !filters.classLevel)
      return [];

    return availableAssignments.filter(
      (assignment) =>
        assignment.subjectId === selectedSubject.id &&
        assignment.classLevel === filters.classLevel &&
        assignment.academicYearId === filters.academicYearId
    );
  };

  // Obtenir les étudiants sans note pour la matière sélectionnée
  const getStudentsWithoutGrade = () => {
    if (!selectedSubject) return availableStudents;

    const studentsWithGrade = new Set(
      getFilteredGrades()
        .filter((g) => g.subjectId === selectedSubject.id)
        .map((g) => g.studentId)
    );

    return availableStudents.filter(
      (student) => !studentsWithGrade.has(student.id)
    );
  };

  // Sauvegarder une note individuelle
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      controlType: ControlType;
    }
  ) => {
    setIsSaving(true);
    try {
      const assignments = getAssignmentsForSelectedSubject();
      const assignment = assignments[0];

      if (!assignment) {
        toast.error("Aucune affectation trouvée pour cette matière");
        return;
      }

      // Vérifier d'abord si une note existe déjà
      const existingGrade = getFilteredGrades().find(
        (g) =>
          g.studentId === studentId &&
          g.subjectId === subjectId &&
          g.academicYearId === filters.academicYearId &&
          g.controlType === gradeData.controlType
      );

      const gradeToSend = {
        studentId,
        subjectId,
        assignmentId: assignment.id,
        grade: gradeData.grade,
        status: gradeData.status,
        session: "Normale" as any,
        controlType: gradeData.controlType,
        academicYearId: filters.academicYearId,
        classLevel: filters.classLevel as ClassLevel,
        isActive: true,
      };

      if (existingGrade) {
        // Si la note existe, utiliser updateGrade
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
        });
        toast.success("Note modifiée avec succès");
      } else {
        // Si la note n'existe pas, utiliser addGrade
        await addGrade(gradeToSend);
        toast.success("Note ajoutée avec succès");
      }

      // Recharger les notes après sauvegarde
      await loadGrades();
    } catch (error: any) {
      console.error("❌ Erreur sauvegarde note:", error);

      // Afficher un message d'erreur plus spécifique
      if (error.response?.data?.code === "GRADE_ALREADY_EXISTS") {
        toast.error(
          "Une note existe déjà pour cet étudiant avec ce type de contrôle. Utilisez 'Mettre à jour' pour modifier la note existante."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la sauvegarde de la note"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer une note
  const handleDeleteGrade = async (gradeId: string) => {
    try {
      await deleteGrade(gradeId);
      toast.success("Note supprimée avec succès");
      await loadGrades();
    } catch (error) {
      console.error("Erreur suppression note:", error);
      toast.error("Erreur lors de la suppression de la note");
    }
  };

  // Charger les notes
  const loadGrades = async () => {
    try {
      const filtersToSend = {
        academicYearId: filters.academicYearId,
        classLevel: filters.classLevel || undefined,
        subjectId: filters.subjectId || undefined,
        controlType: filters.controlType || undefined,
      };

      await fetchGrades(filtersToSend);
      calculateStatistics();
    } catch (error) {
      console.error("Erreur chargement notes:", error);
      toast.error("Erreur lors du chargement des notes");
    }
  };

  // Sauvegarder les notes en masse
  const saveBulkGrades = async () => {
    if (!selectedSubject || !selectedAcademicYear || !filters.classLevel) {
      toast.error(
        "Veuillez sélectionner une matière, une année académique et un niveau"
      );
      return;
    }

    const assignments = getAssignmentsForSelectedSubject();
    const assignment = assignments[0];

    if (!assignment) {
      toast.error("Aucune affectation trouvée pour cette matière");
      return;
    }

    setIsSaving(true);
    try {
      const gradesToAdd = Object.entries(bulkGrades)
        .filter(
          ([studentId, data]) =>
            data.grade.trim() !== "" && selectedStudents.includes(studentId)
        )
        .map(([studentId, data]) => {
          const gradeValue = parseFloat(data.grade);
          return {
            studentId,
            subjectId: selectedSubject.id,
            assignmentId: assignment.id,
            grade: gradeValue,
            status: data.status,
            session: "Normale" as any,
            controlType: data.controlType,
            academicYearId: selectedAcademicYear.id,
            classLevel: filters.classLevel as ClassLevel,
            isActive: true,
          };
        });

      if (gradesToAdd.length > 0) {
        await bulkAddGrades(gradesToAdd);
        toast.success(`${gradesToAdd.length} notes ajoutées avec succès`);
      } else {
        toast.info("Aucune note à sauvegarder");
      }

      setBulkGrades({});
      setBulkEditMode(false);
      setSelectedStudents([]);
      await loadGrades();
    } catch (error) {
      console.error("Erreur sauvegarde en masse:", error);
      toast.error("Erreur lors de la sauvegarde des notes");
    } finally {
      setIsSaving(false);
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      const dataToExport = getFilteredGrades().map((grade) => {
        const student = students.find((s) => s.id === grade.studentId);
        const subject = subjects.find((s) => s.id === grade.subjectId);

        return {
          Matricule: student?.studentCode,
          Nom: student?.lastName,
          Prénom: student?.firstName,
          Matière: subject?.name,
          Code: subject?.code,
          Coefficient: subject?.coefficient,
          "Note /100": grade.grade,
          "Note /20": ((grade.grade / 100) * 20).toFixed(2),
          Statut: grade.status,
          "Type contrôle": grade.controlType,
          Niveau: grade.classLevel,
          "Année académique": selectedAcademicYear?.year,
          Date: new Date(grade.createdAt).toLocaleDateString(),
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
      saveAs(
        blob,
        `notes-export-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Export Excel réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export Excel");
    }
  };

  // Toggle sélection étudiant
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    const studentsToGrade = getStudentsWithoutGrade();
    if (selectedStudents.length === studentsToGrade.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsToGrade.map((s) => s.id));
    }
  };

  const getAvailableSubjects = () => {
    if (!filters.classLevel || !filters.academicYearId) return subjects;

    const assignmentsForLevel = availableAssignments.filter(
      (assignment) =>
        assignment.classLevel === filters.classLevel &&
        assignment.academicYearId === filters.academicYearId
    );

    const subjectIds = assignmentsForLevel.map(
      (assignment) => assignment.subjectId
    );
    return subjects.filter((subject) => subjectIds.includes(subject.id));
  };

  // Obtenir la largeur d'écran pour des adaptations spécifiques
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors">
      {/* Header responsive */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Gestion des Notes
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  Gestion simplifiée des notes par matière et niveau
                </p>
              </div>

              {/* Bouton menu mobile */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Contrôles desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Indicateur de taille d'écran */}
              <div className="hidden xl:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mr-2">
                {screenSize === "mobile" && <Smartphone className="h-3 w-3" />}
                {screenSize === "tablet" && <Tablet className="h-3 w-3" />}
                {screenSize === "desktop" && <Monitor className="h-3 w-3" />}
              </div>

              {/* Bouton dark mode */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 p-0"
                title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Importer</span>
              </Button>
              <Button
                onClick={handleExportExcel}
                variant="outline"
                size="sm"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Exporter</span>
              </Button>
              <Button
                onClick={() => setBulkEditMode(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600"
                disabled={!selectedSubject}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Notes en masse</span>
                <span className="md:hidden">Masse</span>
              </Button>
            </div>
          </div>

          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thème:
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="h-8"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Mode clair
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Mode sombre
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                  <Button
                    onClick={handleExportExcel}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setBulkEditMode(true);
                    setMobileMenuOpen(false);
                  }}
                  size="sm"
                  className="w-full"
                  disabled={!selectedSubject}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter en masse
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filtres responsive */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  Filtres
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="ml-1 hidden sm:inline">
                  {showFilters ? "Réduire" : "Étendre"}
                </span>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Année académique */}
              <div className="space-y-2">
                <Label htmlFor="academicYear" className="text-sm font-medium">
                  Année académique
                </Label>
                <Select
                  value={filters.academicYearId}
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, academicYearId: value }));
                    const year = academicYears.find((ay) => ay.id === value);
                    setSelectedAcademicYear(year || null);
                    setSelectedSubject(null);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="academicYear" className="h-10">
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

              {/* Niveau de classe */}
              <div className="space-y-2">
                <Label htmlFor="classLevel" className="text-sm font-medium">
                  Niveau
                </Label>
                <Select
                  value={filters.classLevel}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      classLevel: value as ClassLevel | "",
                    }));
                    setSelectedSubject(null);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="classLevel" className="h-10">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="Sixieme">Sixième</SelectItem>
                    <SelectItem value="Cinquieme">Cinquième</SelectItem>
                    <SelectItem value="Quatrieme">Quatrième</SelectItem>
                    <SelectItem value="Troisieme">Troisième</SelectItem>
                    <SelectItem value="Seconde">Seconde</SelectItem>
                    <SelectItem value="Premiere">Première</SelectItem>
                    <SelectItem value="Terminale">Terminale</SelectItem>
                    <SelectItem value="NSI">NSI</SelectItem>
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
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, subjectId: value }));
                    const subject = subjects.find((s) => s.id === value);
                    setSelectedSubject(subject || null);
                  }}
                  disabled={!filters.classLevel || loading}
                >
                  <SelectTrigger id="subject" className="h-10">
                    <SelectValue
                      placeholder={
                        filters.classLevel
                          ? "Choisir une matière"
                          : "Sélectionnez d'abord un niveau"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {getAvailableSubjects().map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <span className="truncate block">
                          {subject.code} - {subject.name} (Coef.{" "}
                          {subject.coefficient})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Type de contrôle */}
                <div className="space-y-2">
                  <Label htmlFor="controlType" className="text-sm font-medium">
                    Type de contrôle
                  </Label>
                  <Select
                    value={filters.controlType}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        controlType: value as ControlType | "",
                      }));
                    }}
                  >
                    <SelectTrigger id="controlType" className="h-10">
                      <SelectValue placeholder="Tous les contrôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                      <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                      <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                      <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recherche */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">
                    Rechercher un étudiant
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nom, prénom ou matricule..."
                      className="pl-9 h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chargement */}
        {loading && <LoadingSpinner message="Chargement des données..." />}

        {/* Statistiques responsive */}
        {!loading && statistics && selectedSubject && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <StatCard
              icon={FileText}
              value={statistics.totalGrades}
              label="Notes totales"
              gradient="from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
              iconBg="bg-blue-600 dark:bg-blue-700"
            />
            <StatCard
              icon={BarChart3}
              value={statistics.averageGrade.toFixed(1)}
              label="Moyenne /100"
              gradient="from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30"
              iconBg="bg-green-600 dark:bg-green-700"
            />
            <StatCard
              icon={Percent}
              value={((statistics.averageGrade / 100) * 20).toFixed(1)}
              label="Moyenne /20"
              gradient="from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
              iconBg="bg-purple-600 dark:bg-purple-700"
            />
            <StatCard
              icon={CheckCircle}
              value={`${statistics.successRate.toFixed(1)}%`}
              label="Taux de réussite"
              gradient="from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30"
              iconBg="bg-amber-600 dark:bg-amber-700"
            />
            <StatCard
              icon={Users}
              value={availableStudents.length}
              label="Étudiants actifs"
              gradient="from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30"
              iconBg="bg-pink-600 dark:bg-pink-700"
            />
          </div>
        )}

        {/* Interface principale - Notes existantes */}
        {!loading && selectedSubject && !bulkEditMode && (
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                    {selectedSubject.name} - Notes existantes
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    Coefficient: {selectedSubject.coefficient} | Seuil de
                    validation: {selectedSubject.passingGrade}/100
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const element = document.getElementById(
                        "students-without-grades"
                      );
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <span className="hidden sm:inline">Voir sans note</span>
                    <span className="sm:hidden">Sans note</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* En-tête des colonnes - Masqué sur mobile */}
              <div className="hidden md:grid grid-cols-12 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300">
                <div className="col-span-3">Étudiant</div>
                <div className="col-span-2 text-center">Coefficient</div>
                <div className="col-span-2 text-center">Note /100</div>
                <div className="col-span-2 text-center">Note /20</div>
                <div className="col-span-2 text-center">Contrôle</div>
                <div className="col-span-1 text-center">Statut</div>
              </div>

              {/* Liste des notes existantes */}
              {getFilteredGrades()
                .filter((g) => g.subjectId === selectedSubject.id)
                .filter((grade) => {
                  if (!searchTerm) return true;
                  const student = students.find(
                    (s) => s.id === grade.studentId
                  );
                  return (
                    student?.firstName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    student?.lastName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    student?.studentCode
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                })
                .map((grade) => {
                  const student = students.find(
                    (s) => s.id === grade.studentId
                  );
                  if (!student) return null;

                  return (
                    <GradeInputInline
                      key={grade.id}
                      student={student}
                      subject={selectedSubject}
                      existingGrade={grade}
                      onSave={(gradeData) =>
                        handleSaveGrade(
                          student.id,
                          selectedSubject.id,
                          gradeData
                        )
                      }
                      onDelete={handleDeleteGrade}
                      isLoading={isSaving}
                    />
                  );
                })}

              {getFilteredGrades().filter(
                (g) => g.subjectId === selectedSubject.id
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                  <p className="font-medium">
                    Aucune note existante pour cette matière
                  </p>
                  <p className="text-sm">
                    Commencez par ajouter des notes ci-dessous
                  </p>
                </div>
              )}

              {/* Étudiants sans note - Section séparée */}
              <div
                id="students-without-grades"
                className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      Étudiants sans note
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getStudentsWithoutGrade().length} étudiant(s) n'ont pas
                      encore de note
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkEditMode(true)}
                    className="border-green-600 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 self-start sm:self-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter en masse
                  </Button>
                </div>

                {getStudentsWithoutGrade()
                  .filter((student) => {
                    if (!searchTerm) return true;
                    return (
                      student.firstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      student.lastName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      student.studentCode
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    );
                  })
                  .map((student) => (
                    <GradeInputInline
                      key={student.id}
                      student={student}
                      subject={selectedSubject}
                      onSave={(gradeData) =>
                        handleSaveGrade(
                          student.id,
                          selectedSubject.id,
                          gradeData
                        )
                      }
                      isLoading={isSaving}
                    />
                  ))}

                {getStudentsWithoutGrade().length === 0 && (
                  <div className="text-center py-6 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2" />
                    <p className="font-medium">
                      Tous les étudiants ont une note
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mode édition en masse */}
        {!loading && bulkEditMode && selectedSubject && (
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                    Ajout en masse - {selectedSubject.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sélectionnez les étudiants et appliquez des notes en masse
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkEditMode(false);
                    setSelectedStudents([]);
                  }}
                  className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex-shrink-0"
                >
                  Retour
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <BulkControls
                selectedCount={selectedStudents.length}
                onSave={saveBulkGrades}
                onCancel={() => {
                  setBulkEditMode(false);
                  setSelectedStudents([]);
                  setBulkGrades({});
                }}
                isLoading={isSaving}
                bulkGrades={bulkGrades}
                setBulkGrades={setBulkGrades}
                selectedSubject={selectedSubject}
              />

              <div className="space-y-3">
                {getStudentsWithoutGrade()
                  .filter((student) => {
                    if (!searchTerm) return true;
                    return (
                      student.firstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      student.lastName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      student.studentCode
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    );
                  })
                  .map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    const bulkGrade = bulkGrades[student.id];

                    return (
                      <div
                        key={student.id}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-700 shadow-sm"
                            : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                        }`}
                      >
                        <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              toggleStudentSelection(student.id);
                              if (!bulkGrades[student.id]) {
                                setBulkGrades((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    grade: "",
                                    status: "Valid_",
                                    controlType: "CONTROLE_1",
                                  },
                                }));
                              }
                            }}
                            className="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800"
                          />
                          <div className="flex-1 ml-4 sm:ml-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {student.studentCode}
                                  {student.schoolClass &&
                                    ` • ${student.schoolClass.name}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto">
                          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6">
                            {/* Coefficient */}
                            <div className="text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Coef
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-gray-50 dark:bg-gray-800"
                              >
                                {selectedSubject.coefficient}
                              </Badge>
                            </div>

                            {/* Note /100 */}
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                Note /100
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="0.0"
                                value={bulkGrade?.grade || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setBulkGrades((prev) => ({
                                    ...prev,
                                    [student.id]: {
                                      grade: value,
                                      status: value
                                        ? parseFloat(value) >=
                                          selectedSubject.passingGrade
                                          ? "Valid_"
                                          : parseFloat(value) >=
                                            selectedSubject.passingGrade * 0.7
                                          ? "Reprendre"
                                          : "Non_valid_"
                                        : "Valid_",
                                      controlType:
                                        bulkGrade?.controlType || "CONTROLE_1",
                                    },
                                  }));
                                }}
                                className="h-9 sm:h-10"
                              />
                            </div>

                            {/* Contrôle - Masqué sur mobile */}
                            <div className="hidden sm:block space-y-1 min-w-[120px]">
                              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                Contrôle
                              </Label>
                              <Select
                                value={bulkGrade?.controlType || "CONTROLE_1"}
                                onValueChange={(value: ControlType) => {
                                  setBulkGrades((prev) => ({
                                    ...prev,
                                    [student.id]: {
                                      grade: bulkGrade?.grade || "",
                                      status: bulkGrade?.status || "Valid_",
                                      controlType: value,
                                    },
                                  }));
                                }}
                              >
                                <SelectTrigger className="h-9 sm:h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CONTROLE_1">
                                    Contrôle 1
                                  </SelectItem>
                                  <SelectItem value="CONTROLE_2">
                                    Contrôle 2
                                  </SelectItem>
                                  <SelectItem value="CONTROLE_3">
                                    Contrôle 3
                                  </SelectItem>
                                  <SelectItem value="CONTROLE_4">
                                    Contrôle 4
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Statut */}
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                Statut
                              </Label>
                              <div className="h-9 sm:h-10 flex items-center">
                                {bulkGrade?.grade ? (
                                  <Badge
                                    className={`
                                      ${
                                        bulkGrade.status === "Valid_"
                                          ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                          : bulkGrade.status === "Reprendre"
                                          ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                                          : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                      }
                                    `}
                                  >
                                    {bulkGrade.status === "Valid_"
                                      ? "Validé"
                                      : bulkGrade.status === "Reprendre"
                                      ? "À reprendre"
                                      : "Non validé"}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    À noter
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Contrôle pour mobile seulement */}
                          <div className="mt-3 sm:hidden">
                            <Select
                              value={bulkGrade?.controlType || "CONTROLE_1"}
                              onValueChange={(value: ControlType) => {
                                setBulkGrades((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    grade: bulkGrade?.grade || "",
                                    status: bulkGrade?.status || "Valid_",
                                    controlType: value,
                                  },
                                }));
                              }}
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Type de contrôle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CONTROLE_1">
                                  Contrôle 1
                                </SelectItem>
                                <SelectItem value="CONTROLE_2">
                                  Contrôle 2
                                </SelectItem>
                                <SelectItem value="CONTROLE_3">
                                  Contrôle 3
                                </SelectItem>
                                <SelectItem value="CONTROLE_4">
                                  Contrôle 4
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  onClick={selectAllStudents}
                  className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 w-full sm:w-auto"
                >
                  {selectedStudents.length === getStudentsWithoutGrade().length
                    ? "Tout désélectionner"
                    : "Tout sélectionner"}
                </Button>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
                  {selectedStudents.length} étudiant(s) sélectionné(s) sur{" "}
                  {getStudentsWithoutGrade().length}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages d'état */}
        {!loading && !filters.classLevel && (
          <EmptyState
            icon={BookOpen}
            title="Sélectionnez un niveau"
            description="Veuillez sélectionner un niveau de classe pour afficher les notes."
          />
        )}

        {!loading &&
          filters.classLevel &&
          !selectedSubject &&
          !bulkEditMode && (
            <EmptyState
              icon={Book}
              title="Sélectionnez une matière"
              description="Veuillez sélectionner une matière pour afficher les notes."
            />
          )}
      </div>
    </div>
  );
};

export default GradeManager;
