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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Users,
  BookOpen,
  GraduationCap,
  Save,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Plus,
  Upload,
  Download,
  FileText,
  Table,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ShieldAlert,
  DownloadCloud,
  UploadCloud,
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
import { useTheme } from "next-themes";
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

// Types pour les props du modal
interface GradeEditModalProps {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    controlType: ControlType;
  }) => void;
  isLoading?: boolean;
}

// Types pour les contrôles en masse
interface BulkControlsProps {
  selectedCount: number;
  bulkGradeValue: string;
  maxGrade: number;
  onApplyGrade: (grade: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Composant de chargement réutilisable
const LoadingSpinner = ({
  message = "Chargement...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-3">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

// Composant d'état vide
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

// Composant de statistiques amélioré
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
    className={`border-0 shadow-md bg-gradient-to-br ${gradient} dark:${darkGradient} overflow-hidden transition-all hover:shadow-lg`}
  >
    <CardContent className="p-5 relative">
      <div className="absolute top-3 right-3 opacity-20 dark:opacity-10">
        <Icon className="h-8 w-8 text-foreground" />
      </div>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconBg} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Modal d'édition amélioré avec validation robuste
const GradeEditModal = ({
  student,
  subject,
  existingGrade,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: GradeEditModalProps) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [controlType, setControlType] = useState<ControlType>(
    existingGrade?.controlType || "CONTROLE_1"
  );
  const [errors, setErrors] = useState<{ grade?: string }>({});

  useEffect(() => {
    setGrade(existingGrade?.grade?.toString() || "");
    setControlType(existingGrade?.controlType || "CONTROLE_1");
    setErrors({});
  }, [existingGrade, isOpen]);

  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return "La note est requise";
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > subject.maxGrade)
      return `La note ne peut pas dépasser ${subject.maxGrade} (maximum: ${subject.maxGrade}/100)`;
    return null;
  };

  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (gradeValue >= subject.passingGrade) return "Valid_";
    if (gradeValue >= subject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  const handleGradeChange = (value: string) => {
    setGrade(value);
    const error = validateGrade(value);
    setErrors((prev) => ({ ...prev, grade: error || undefined }));
  };

  const handleSave = () => {
    const gradeError = validateGrade(grade);
    if (gradeError) {
      setErrors({ grade: gradeError });
      toast.error(gradeError);
      return;
    }

    const numericGrade = parseFloat(grade);
    const status = calculateStatus(numericGrade);

    onSave({
      grade: numericGrade,
      status,
      controlType,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {existingGrade ? "Modifier la note" : "Ajouter une note"}
          </DialogTitle>
          <DialogDescription>
            Pour{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>{" "}
            - {subject.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium">
              Note (/{subject.maxGrade}){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max={subject.maxGrade}
              step="0.1"
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              placeholder={`Entrez la note entre 0 et ${subject.maxGrade}`}
              className={
                errors.grade
                  ? "border-destructive focus:border-destructive"
                  : ""
              }
              disabled={isLoading}
            />
            {errors.grade && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {errors.grade}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Note maximale autorisée: {subject.maxGrade}/{subject.maxGrade}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlType" className="text-sm font-medium">
              Type de contrôle
            </Label>
            <Select
              value={controlType}
              onValueChange={(value: ControlType) => setControlType(value)}
            >
              <SelectTrigger id="controlType">
                <SelectValue placeholder="Sélectionner le type de contrôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {existingGrade && (
            <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground">Note actuelle:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>Note:</span>
                <span className="font-medium">
                  {existingGrade.grade}/{subject.maxGrade}
                </span>
                <span>Note sur {subject.maxGrade}:</span>
                <span className="font-medium">
                  {((existingGrade.grade / subject.maxGrade) * 20).toFixed(2)}
                  /20
                </span>
                <span>Type contrôle:</span>
                <span className="font-medium">{existingGrade.controlType}</span>
                <span>Statut:</span>
                <span className="font-medium">{existingGrade.status}</span>
              </div>
            </div>
          )}

          {/* Aperçu de la note sur 20 */}
          <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Note sur {subject.maxGrade}:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                {grade
                  ? ((parseFloat(grade) / subject.maxGrade) * 20).toFixed(2)
                  : "0.00"}
                /{subject.maxGrade}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <span>Note max:</span>
              <span className="font-medium">
                {subject.maxGrade}/{subject.maxGrade}
              </span>
              <span>Seuil validation:</span>
              <span className="font-medium">
                {(subject.maxGrade * subject.passingGrade) / 100}/
                {subject.maxGrade}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!errors.grade || isLoading}
            className="min-w-20"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingGrade ? (
              "Modifier"
            ) : (
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Contrôles en masse améliorés
const BulkControls = ({
  selectedCount,
  bulkGradeValue,
  maxGrade,
  onApplyGrade,
  onSave,
  onCancel,
  isLoading = false,
}: BulkControlsProps) => {
  const [localGrade, setLocalGrade] = useState(bulkGradeValue);
  const [error, setError] = useState<string>("");

  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return null;
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > maxGrade)
      return `La note ne peut pas dépasser ${maxGrade}`;
    return null;
  };

  const handleApply = () => {
    if (localGrade.trim()) {
      const error = validateGrade(localGrade);
      if (error) {
        toast.error(error);
        setError(error);
        return;
      }
      setError("");
      onApplyGrade(localGrade);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const handleGradeChange = (value: string) => {
    setLocalGrade(value);
    const error = validateGrade(value);
    setError(error || "");
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl mb-4 flex-wrap border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        >
          {selectedCount} étudiant(s) sélectionné(s)
        </Badge>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="relative">
          <Input
            type="number"
            min="0"
            max={maxGrade}
            step="0.1"
            placeholder={`Note max: ${maxGrade})`}
            value={localGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-28 h-9 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 ${
              error ? "border-destructive" : ""
            }`}
            disabled={isLoading}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
        <Button
          onClick={handleApply}
          disabled={!localGrade.trim() || !!error || isLoading}
          size="sm"
          className="h-9 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Max: {maxGrade}/100
        </span>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
          className="h-9 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={onSave}
          size="sm"
          className="h-9 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

// Composant principal GradeManager
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
  const [bulkGrades, setBulkGrades] = useState<{ [key: string]: string }>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statistics, setStatistics] = useState({
    totalGrades: 0,
    averageGrade: 0,
    successRate: 0,
    passedGrades: 0,
    failedGrades: 0,
    studentsWithoutGrade: 0,
  });
  const [availableAssignments, setAvailableAssignments] = useState<
    ClassAssignment[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    subjectId: string;
  } | null>(null);

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

  // Chargement des données filtrées
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
              assignment.academicYear.id === filters.academicYearId &&
              assignment.classLevel === filters.classLevel &&
              assignment.status === "Active"
          )
          .map((a) => ({
            ...a,
            classLevel: a.classLevel as ClassLevel,
          }));

        setAvailableAssignments(
          filteredAssignments as unknown as ClassAssignment[]
        );

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
    const studentsWithoutGrade = getStudentsWithoutGrade().length;

    if (total === 0) {
      setStatistics({
        totalGrades: 0,
        averageGrade: 0,
        successRate: 0,
        passedGrades: 0,
        failedGrades: 0,
        studentsWithoutGrade,
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
      averageGrade: parseFloat(average.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(1)),
      passedGrades: passed,
      failedGrades: total - passed,
      studentsWithoutGrade,
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

  // Obtenir les étudiants filtrés par terme de recherche
  const getFilteredStudents = () => {
    return availableStudents.filter((student) => {
      if (!searchTerm) return true;
      return (
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // Obtenir une note existante
  const getExistingGrade = (studentId: string, subjectId: string) => {
    const storeGrades = useGradeStore.getState().grades;

    if (!Array.isArray(storeGrades)) {
      console.warn("storeGrades n'est pas un tableau:", storeGrades);
      return undefined;
    }

    const academicYearId = filters.academicYearId;
    const classLevel = filters.classLevel;

    if (!studentId || !subjectId || !academicYearId || !classLevel) {
      return undefined;
    }

    const foundGrade = storeGrades.find(
      (grade) =>
        grade &&
        typeof grade === "object" &&
        grade.studentId === studentId &&
        grade.subjectId === subjectId &&
        grade.academicYearId === academicYearId &&
        grade.classLevel === classLevel &&
        (!filters.controlType || grade.controlType === filters.controlType)
    );

    return foundGrade;
  };

  // Fonction utilitaire pour les messages d'erreur
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Une erreur inconnue s'est produite";
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

      const existingGrade = getExistingGrade(studentId, subjectId);
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
        controlGrades: undefined,
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
        });
        toast.success("Note modifiée avec succès");
      } else {
        await addGrade(gradeToSend);
        toast.success("Note ajoutée avec succès");
      }

      await loadGrades();
      setEditingGrade(null);
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

  // Gestion de la sélection des étudiants
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    const filteredStudents = getFilteredStudents();
    const filteredStudentIds = filteredStudents.map((s) => s.id);

    if (selectedStudents.length === filteredStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudentIds);
    }
  };

  // Appliquer une note en masse avec validation
  const applyBulkGrade = (gradeValue: string) => {
    const numericGrade = parseFloat(gradeValue);
    const maxAllowedGrade = selectedSubject?.maxGrade || 100;

    if (
      isNaN(numericGrade) ||
      numericGrade < 0 ||
      numericGrade > maxAllowedGrade
    ) {
      toast.error(`La note doit être entre 0 et ${maxAllowedGrade}`);
      return;
    }

    const newBulkGrades = { ...bulkGrades };
    selectedStudents.forEach((studentId) => {
      newBulkGrades[studentId] = gradeValue;
    });
    setBulkGrades(newBulkGrades);
    toast.success("Note appliquée aux étudiants sélectionnés");
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
    const academicYearValue = selectedAcademicYear.id;
    const subjectPassingGrade = selectedSubject.passingGrade;
    const maxAllowedGrade = selectedSubject.maxGrade || 100;
    let savedCount = 0;
    let errorCount = 0;

    try {
      for (const [studentId, gradeValue] of Object.entries(bulkGrades)) {
        if (gradeValue.trim() === "" || !selectedStudents.includes(studentId))
          continue;

        const grade = parseFloat(gradeValue);
        if (isNaN(grade) || grade < 0 || grade > maxAllowedGrade) {
          console.error(`Note invalide pour l'étudiant ${studentId}`);
          errorCount++;
          continue;
        }

        try {
          const existingGrade = getExistingGrade(studentId, selectedSubject.id);
          const status =
            grade >= subjectPassingGrade
              ? "Valid_"
              : grade >= subjectPassingGrade * 0.7
              ? "Reprendre"
              : "Non_valid_";

          if (existingGrade) {
            await updateGrade(existingGrade.id, {
              grade: grade,
              status: status,
              controlType: "CONTROLE_1",
            });
          } else {
            await addGrade({
              studentId,
              subjectId: selectedSubject.id,
              assignmentId: assignment.id,
              grade,
              status,
              session: "Normale" as any,
              controlType: "CONTROLE_1",
              academicYearId: academicYearValue,
              classLevel: filters.classLevel as ClassLevel,
              isActive: true,
              controlGrades: undefined,
            });
          }
          savedCount++;
        } catch (error) {
          console.error(`Erreur sauvegarde étudiant ${studentId}:`, error);
          errorCount++;
        }
      }

      if (savedCount > 0) {
        toast.success(`${savedCount} notes sauvegardées avec succès`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} erreurs lors de la sauvegarde`);
      }
      if (savedCount === 0 && errorCount === 0) {
        toast.info("Aucune note à sauvegarder");
      }

      setBulkGrades({});
      setBulkEditMode(false);
      setSelectedStudents([]);
      await loadGrades();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Erreur lors de la sauvegarde: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Fonctions d'import/export
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
          Date: new Date(grade.createdAt).toLocaleDateString("fr-FR"),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");

      // Auto-size columns
      const colWidths = Object.keys(dataToExport[0] || {}).map((key) => ({
        wch: Math.max(
          key.length,
          ...dataToExport.map(
            (row) => String(row[key as keyof typeof row] || "").length
          )
        ),
      }));
      worksheet["!cols"] = colWidths;

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        if (!content) throw new Error("Impossible de lire le fichier");

        let data: any[] = [];

        if (file.name.endsWith(".json")) {
          data = JSON.parse(content as string);
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const workbook = XLSX.read(content, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(worksheet);
        } else {
          throw new Error("Format de fichier non supporté");
        }

        await processImportedData(data);
        toast.success("Import réussi");
      } catch (error) {
        console.error("Erreur import:", error);
        toast.error(`Erreur lors de l'import: ${getErrorMessage(error)}`);
      }
    };

    reader.onerror = () => {
      toast.error("Erreur de lecture du fichier");
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processImportedData = async (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Le fichier ne contient pas de données valides");
    }

    const gradesToAdd: any[] = [];
    const gradesToUpdate: any[] = [];
    let skippedCount = 0;

    for (const [index, item] of data.entries()) {
      try {
        const student = students.find(
          (s) =>
            s.studentCode === item["Matricule"] ||
            s.studentCode === item["Matricule Étudiant"]
        );

        const subject = subjects.find(
          (s) => s.code === item["Code"] || s.code === item["Code Matière"]
        );

        if (!student || !subject) {
          console.warn(`Ligne ${index + 1}: Étudiant ou matière non trouvé`);
          skippedCount++;
          continue;
        }

        const gradeValue = Number(item["Note"] || item["Note /100"]);
        if (
          isNaN(gradeValue) ||
          gradeValue < 0 ||
          gradeValue > subject.maxGrade
        ) {
          console.warn(`Ligne ${index + 1}: Note invalide`);
          toast.warning(
            ` Note invalide pour l'étudiant ${student.studentCode}`
          );
          skippedCount++;
          continue;
        }

        const gradeData = {
          studentId: student.id,
          subjectId: subject.id,
          grade: gradeValue,
          status:
            item["Statut"] ||
            (gradeValue >= (subject.passingGrade * subject.maxGrade) / 100
              ? "Valid_"
              : gradeValue >=
                ((subject.passingGrade * subject.maxGrade) / 100) * 0.7
              ? "Reprendre"
              : "Non_valid_"),
          session: item["Session"] || "Normale",
          controlType: item["Type contrôle"] || "CONTROLE_1",
          academicYearId: item["Année Académique"] || selectedAcademicYear?.id,
          classLevel: filters.classLevel,
          isActive: true,
          controlGrades: undefined,
        };

        const existingGrade = grades.find(
          (g) =>
            g.studentId === student.id &&
            g.subjectId === subject.id &&
            g.academicYearId === gradeData.academicYearId &&
            g.controlType === gradeData.controlType
        );

        if (existingGrade) {
          gradesToUpdate.push({
            id: existingGrade.id,
            ...gradeData,
          });
        } else {
          // Trouver l'affectation
          const assignments = getAssignmentsForSelectedSubject();
          const assignment = assignments.find(
            (a) => a.subjectId === subject.id
          );

          if (assignment) {
            gradesToAdd.push({
              ...gradeData,
              assignmentId: assignment.id,
            });
          } else {
            console.warn(`Ligne ${index + 1}: Aucune affectation trouvée`);
            skippedCount++;
          }
        }
      } catch (error) {
        console.error(`Erreur ligne ${index + 1}:`, error);
        skippedCount++;
      }
    }

    if (gradesToAdd.length > 0) {
      await bulkAddGrades(gradesToAdd);
    }

    for (const grade of gradesToUpdate) {
      await updateGrade(grade.id, grade);
    }

    toast.success(
      `${gradesToAdd.length} notes ajoutées, ${
        gradesToUpdate.length
      } notes mises à jour${
        skippedCount > 0 ? `, ${skippedCount} lignes ignorées` : ""
      }`
    );
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

  const getLevelLabel = (level: string): string => {
    const levels: Record<string, string> = {
      Sixieme: "Sixième",
      Cinquieme: "Cinquième",
      Quatrieme: "Quatrième",
      Troisieme: "Troisième",
      Seconde: "Seconde",
      Premiere: "Première",
      Terminale: "Terminale",
      NSI: "NS I",
      NSII: "NS II",
      NSIII: "NS III",
      NSIV: "NS IV",
    };
    return levels[level] || level;
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/30 min-h-screen">
      {/* Header avec import/export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Gestion des Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des notes par matière, niveau et année académique
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json,.xlsx,.xls"
            className="hidden"
          />

          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Button
            onClick={() => setBulkEditMode(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
            disabled={!selectedSubject}
          >
            <Plus className="h-4 w-4 mr-2" />
            Édition en masse
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
                Filtres
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
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
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, academicYearId: value }));
                  const year = academicYears.find((ay) => ay.id === value);
                  setSelectedAcademicYear(year || null);
                  setSelectedSubject(null);
                }}
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
                <SelectTrigger
                  id="classLevel"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sixieme">Sixième</SelectItem>
                  <SelectItem value="Cinquieme">Cinquième</SelectItem>
                  <SelectItem value="Quatrieme">Quatrième</SelectItem>
                  <SelectItem value="Troisieme">Troisième</SelectItem>
                  <SelectItem value="Seconde">Seconde</SelectItem>
                  <SelectItem value="Premiere">Première</SelectItem>
                  <SelectItem value="Terminale">Terminale</SelectItem>
                  <SelectItem value="NSI">NSI</SelectItem>
                  <SelectItem value="NSII">NSII</SelectItem>
                  <SelectItem value="NSIII">NSIII</SelectItem>
                  <SelectItem value="NSIV">NSIV</SelectItem>
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
                <SelectTrigger
                  id="subject"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      filters.classLevel
                        ? "Choisir une matière"
                        : "Sélectionnez d'abord un niveau"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSubjects().map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {subject.code} - {subject.name}
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
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    controlType: value as ControlType | "",
                  }));
                }}
              >
                <SelectTrigger
                  id="controlType"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Tous les contrôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les contrôles</SelectItem>
                  <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                  <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                  <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                  <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Rechercher un étudiant
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nom, prénom ou matricule..."
                    className="pl-9 h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      {selectedSubject && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            value={selectedAcademicYear?.year || "N/A"}
            label="Année académique"
            gradient="from-blue-100 to-blue-200"
            darkGradient="from-blue-900/50 to-blue-800/50"
          />
          <StatCard
            icon={Users}
            value={availableStudents.length}
            label="Étudiants inscrits"
            gradient="from-green-100 to-green-200"
            iconBg="bg-green-600"
            darkGradient="from-green-900/50 to-green-800/50"
          />
          <StatCard
            icon={BookOpen}
            value={getAvailableSubjects().length}
            label="Matières disponibles"
            gradient="from-purple-100 to-purple-200"
            iconBg="bg-purple-600"
            darkGradient="from-purple-900/50 to-purple-800/50"
          />
          <StatCard
            icon={GraduationCap}
            value={statistics.studentsWithoutGrade}
            label="Étudiants sans note"
            gradient="from-amber-100 to-amber-200"
            iconBg="bg-amber-600"
            darkGradient="from-amber-900/50 to-amber-800/50"
          />
        </div>
      )}

      {/* Informations sur la sélection */}
      {selectedSubject && filters.classLevel && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  {getLevelLabel(filters.classLevel)}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  {filters.controlType || "Tous les contrôles"}
                </Badge>
                <Badge className="text-xs bg-amber-500/20 text-amber-100 border-amber-400/30">
                  {selectedSubject.code}
                </Badge>
                <Badge className="text-xs bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                  Max: {selectedSubject.maxGrade}
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{selectedSubject.name}</h2>
              <div className="flex items-center gap-6 mt-2 flex-wrap text-sm">
                <div>
                  <p className="text-indigo-200">Année académique</p>
                  <p className="font-semibold">
                    {selectedAcademicYear?.year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Étudiants inscrits</p>
                  <p className="font-semibold">{availableStudents.length}</p>
                </div>
                <div>
                  <p className="text-indigo-200">Notes saisies</p>
                  <p className="font-semibold">
                    {statistics.totalGrades}/{availableStudents.length}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Moyenne générale</p>
                  <p className="font-semibold">
                    {statistics.averageGrade.toFixed(1)}/20
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des étudiants */}
      {selectedSubject && availableStudents.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedSubject.name} ({selectedSubject.code})
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {availableStudents.length} étudiant(s) - Seuil validation:{" "}
                  {(selectedSubject.passingGrade * selectedSubject.maxGrade) /
                    100}
                  /{selectedSubject.maxGrade} - Note max:{" "}
                  {selectedSubject.maxGrade}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 h-10 w-[200px] border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {!bulkEditMode ? (
                  <Button
                    onClick={() => setBulkEditMode(true)}
                    className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
                    disabled={!selectedSubject}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Édition en masse
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={selectAllStudents}
                    className="h-10 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    {selectedStudents.length === getFilteredStudents().length
                      ? "Tout désélectionner"
                      : "Tout sélectionner"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Contrôles d'édition en masse */}
            {bulkEditMode && (
              <BulkControls
                selectedCount={selectedStudents.length}
                bulkGradeValue={Object.values(bulkGrades)[0] || ""}
                maxGrade={selectedSubject?.maxGrade}
                onApplyGrade={applyBulkGrade}
                onSave={saveBulkGrades}
                onCancel={() => {
                  setBulkEditMode(false);
                  setSelectedStudents([]);
                  setBulkGrades({});
                }}
                isLoading={isSaving}
              />
            )}

            <div className="space-y-3">
              {getFilteredStudents().map((student) => {
                const existingGrade = getExistingGrade(
                  student.id,
                  selectedSubject.id
                );
                const isSelected = selectedStudents.includes(student.id);
                const bulkGradeValue = bulkGrades[student.id] || "";

                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    {/* Checkbox pour la sélection en masse */}
                    {bulkEditMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                      />
                    )}

                    <div className="flex-1 ml-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.studentCode}
                            {student.schoolClass &&
                              ` • ${student.schoolClass.name}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {bulkEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          max={selectedSubject?.maxGrade}
                          step="0.1"
                          placeholder={`Max: ${selectedSubject?.maxGrade}`}
                          value={bulkGradeValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Validation côté client
                            if (value.trim() === "") {
                              setBulkGrades((prev) => ({
                                ...prev,
                                [student.id]: value,
                              }));
                              return;
                            }

                            const numericValue = parseFloat(value);
                            const maxAllowed = selectedSubject?.maxGrade || 100;

                            if (numericValue > maxAllowed) {
                              toast.error(
                                `La note ne peut pas dépasser ${maxAllowed}`
                              );
                              return;
                            }

                            setBulkGrades((prev) => ({
                              ...prev,
                              [student.id]: value,
                            }));
                          }}
                          className="w-40 h-9 text-sm border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700"
                        />
                      ) : existingGrade ? (
                        <div className="text-right">
                          <Badge
                            className={
                              existingGrade.status === "Valid_"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                                : existingGrade.status === "Reprendre"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
                            }
                          >
                            {existingGrade.grade}/{selectedSubject.maxGrade}
                          </Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {existingGrade.status} ({existingGrade.controlType})
                          </p>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                        >
                          Non noté
                        </Badge>
                      )}

                      {!bulkEditMode && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingGrade({
                                studentId: student.id,
                                subjectId: selectedSubject.id,
                              })
                            }
                            className="h-9 w-9 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {existingGrade && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                if (confirm("Supprimer cette note ?")) {
                                  await handleDeleteGrade(existingGrade.id);
                                }
                              }}
                              className="h-9 w-9 p-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* État vide quand aucun étudiant */}
      {selectedSubject && availableStudents.length === 0 && (
        <EmptyState
          icon={Users}
          title="Aucun étudiant trouvé"
          description={
            searchTerm
              ? "Aucun étudiant ne correspond à votre recherche. Essayez d'autres termes."
              : "Aucun étudiant n'est inscrit pour les critères sélectionnés."
          }
        />
      )}

      {/* Modal d'édition */}
      {editingGrade && selectedSubject && (
        <GradeEditModal
          student={students.find((s) => s.id === editingGrade.studentId)!}
          subject={selectedSubject}
          existingGrade={getExistingGrade(
            editingGrade.studentId,
            editingGrade.subjectId
          )}
          isOpen={!!editingGrade}
          onClose={() => setEditingGrade(null)}
          onSave={(gradeData) =>
            handleSaveGrade(
              editingGrade.studentId,
              editingGrade.subjectId,
              gradeData
            )
          }
          isLoading={isSaving}
        />
      )}

      {/* Messages d'état */}
      {!loading && !filters.classLevel && (
        <EmptyState
          icon={Book}
          title="Sélectionnez un niveau"
          description="Veuillez sélectionner un niveau de classe pour commencer la gestion des notes."
        />
      )}

      {!loading && filters.classLevel && !selectedSubject && !bulkEditMode && (
        <EmptyState
          icon={BookOpen}
          title="Choisissez une matière"
          description="Sélectionnez une matière dans la liste pour afficher et gérer les notes."
        />
      )}
    </div>
  );
};

export default GradeManager;
