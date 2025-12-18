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
  ChevronDown,
  ChevronUp,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ShieldAlert,
  User,
  Book,
  FileSpreadsheet,
  Target,
  Percent,
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
  GradeSession,
  ControlType,
  ClassLevel,
  Student,
  Subject,
  AcademicYear,
  SchoolClass,
  ClassAssignment,
} from "@/types/academic";

// Types pour ce composant
interface GradeEditModalProps {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    session: GradeSession;
    controlType: ControlType;
    notes?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

interface BulkControlsProps {
  selectedCount: number;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  bulkGrades: {
    [key: string]: {
      grade: string;
      status: GradeStatus;
      session: GradeSession;
      controlType: ControlType;
      notes?: string;
    };
  };
  setBulkGrades: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        grade: string;
        status: GradeStatus;
        session: GradeSession;
        controlType: ControlType;
        notes?: string;
      };
    }>
  >;
  subject: Subject | null;
}

interface Statistics {
  totalGrades: number;
  averageGrade: number;
  successRate: number;
  passedGrades: number;
  failedGrades: number;
  bySubject: Record<string, any>;
  byControlType: Record<string, any>;
}

// Composant de chargement
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

// Carte de statistiques
const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient = "from-blue-100 to-blue-200",
  iconBg = "bg-blue-600",
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
    <CardContent className="p-5 relative">
      <div className="absolute top-3 right-3 opacity-20">
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

// MODIFICATION 1: Modal d'édition adapté pour gérer les différentes échelles
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
  const [status, setStatus] = useState<GradeStatus>(
    existingGrade?.status || "Valid_"
  );
  const [session, setSession] = useState<GradeSession>(
    existingGrade?.session || "Normale"
  );
  const [controlType, setControlType] = useState<ControlType>(
    existingGrade?.controlType || "CONTROLE_1"
  );
  const [notes, setNotes] = useState(existingGrade?.notes || "");
  const [errors, setErrors] = useState<{ grade?: string }>({});

  useEffect(() => {
    if (existingGrade) {
      setGrade(existingGrade.grade.toString());
      setStatus(existingGrade.status);
      setSession(existingGrade.session);
      setControlType(existingGrade.controlType);
      setNotes(existingGrade.notes || "");
    } else {
      setGrade("");
      setStatus("Valid_");
      setSession("Normale");
      setControlType("CONTROLE_1");
      setNotes("");
    }
    setErrors({});
  }, [existingGrade, isOpen]);

  // MODIFICATION 2: Validation basée sur coefficient de la matière
  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return "La note est requise";
    if (isNaN(numericValue)) return "La note doit être un nombre valide";

    // Utiliser coefficient de la matière au lieu de 100
    const coefficient = subject.coefficient || 100;
    if (numericValue < 0 || numericValue > coefficient)
      return `La note doit être entre 0 et ${coefficient}`;

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
    await onSave({
      grade: numericGrade,
      status,
      session,
      controlType,
      notes: notes || undefined,
    });
  };

  // Calculer le pourcentage pour affichage
  const calculatePercentage = (gradeValue: string) => {
    const numericValue = parseFloat(gradeValue);
    if (isNaN(numericValue) || !subject.coefficient) return "N/A";
    return ((numericValue / subject.coefficient) * 100).toFixed(1);
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
            <Label
              htmlFor="grade"
              className="text-sm font-medium flex items-center gap-2"
            >
              Note (/{subject.coefficient}){" "}
              <span className="text-destructive">*</span>
              <Badge variant="outline" className="text-xs">
                <Percent className="h-3 w-3 mr-1" />
                Sur {subject.coefficient}
              </Badge>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="grade"
                type="number"
                min="0"
                max={subject.coefficient}
                step="0.1"
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                placeholder={`Entrez la note entre 0 et ${subject.coefficient}`}
                className={
                  errors.grade
                    ? "border-destructive focus:border-destructive"
                    : ""
                }
                disabled={isLoading}
              />
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                = {calculatePercentage(grade)}%
              </div>
            </div>
            {errors.grade && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {errors.grade}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              Seuil de passage: {subject.passingGrade}/{subject.coefficient} (
              {((subject.passingGrade / subject.coefficient) * 100).toFixed(1)}
              %)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Statut
              </Label>
              <Select
                value={status}
                onValueChange={(value: GradeStatus) => setStatus(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Valid_">Validé</SelectItem>
                  <SelectItem value="Non_valid_">Non validé</SelectItem>
                  <SelectItem value="Reprendre">À reprendre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session" className="text-sm font-medium">
                Session
              </Label>
              <Select
                value={session}
                onValueChange={(value: GradeSession) => setSession(value)}
              >
                <SelectTrigger id="session">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normale">Session normale</SelectItem>
                  <SelectItem value="Reprise">Session de reprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes additionnelles
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Remarques, commentaires..."
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              disabled={isLoading}
            />
          </div>

          {existingGrade && (
            <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground">Informations:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>Note actuelle:</span>
                <span className="font-medium">
                  {existingGrade.grade}/{subject.coefficient} (
                  {((existingGrade.grade / subject.coefficient) * 100).toFixed(
                    1
                  )}
                  %)
                </span>
                <span>Seuil de passage:</span>
                <span className="font-medium">
                  {subject.passingGrade}/{subject.coefficient}
                </span>
                <span>Statut actuel:</span>
                <span className="font-medium">{existingGrade.status}</span>
                <span>Dernière modification:</span>
                <span className="font-medium">
                  {new Date(existingGrade.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
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

// MODIFICATION 3: Contrôles en masse adaptés
const BulkControls = ({
  selectedCount,
  onSave,
  onCancel,
  isLoading = false,
  bulkGrades,
  setBulkGrades,
  subject,
}: BulkControlsProps) => {
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState<GradeStatus>("Valid_");
  const [session, setSession] = useState<GradeSession>("Normale");
  const [controlType, setControlType] = useState<ControlType>("CONTROLE_1");
  const [notes, setNotes] = useState("");

  // Calculer le pourcentage pour la prévisualisation
  const calculatePercentage = (gradeValue: string) => {
    if (!subject || !gradeValue.trim()) return null;
    const numericValue = parseFloat(gradeValue);
    if (isNaN(numericValue)) return null;
    return ((numericValue / subject.coefficient) * 100).toFixed(1);
  };

  const handleApply = () => {
    if (grade.trim()) {
      const newBulkGrades = { ...bulkGrades };

      // Appliquer à tous les étudiants dans bulkGrades
      Object.keys(newBulkGrades).forEach((studentId) => {
        newBulkGrades[studentId] = {
          grade,
          status,
          session,
          controlType,
          notes: notes || undefined,
        };
      });

      setBulkGrades(newBulkGrades);
      toast.success("Notes appliquées aux étudiants sélectionnés");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4 border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ✅ {selectedCount} étudiant(s) sélectionné(s)
          </Badge>
          {subject && (
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Sur {subject.coefficient}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-medium flex items-center gap-1">
            Note (/{subject?.coefficient || 100})
            {grade.trim() && subject && (
              <span className="text-green-600 font-medium">
                = {calculatePercentage(grade)}%
              </span>
            )}
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              max={subject?.coefficient || 100}
              step="0.1"
              placeholder={`Note sur ${subject?.coefficient || 100}`}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-9 border-blue-300 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          {subject && (
            <div className="text-xs text-muted-foreground">
              Seuil: {subject.passingGrade}/{subject.coefficient}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Statut</Label>
          <Select
            value={status}
            onValueChange={(value: GradeStatus) => setStatus(value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Valid_">Validé</SelectItem>
              <SelectItem value="Non_valid_">Non validé</SelectItem>
              <SelectItem value="Reprendre">À reprendre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Session</Label>
          <Select
            value={session}
            onValueChange={(value: GradeSession) => setSession(value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normale">Normale</SelectItem>
              <SelectItem value="Reprise">Reprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Contrôle</Label>
          <Select
            value={controlType}
            onValueChange={(value: ControlType) => setControlType(value)}
          >
            <SelectTrigger className="h-9">
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

        <div className="space-y-2">
          <Label className="text-xs font-medium">Remarques</Label>
          <Input
            placeholder="Remarques"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-9 border-blue-300 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleApply}
          size="sm"
          className="h-9 bg-blue-600 hover:bg-blue-700"
          disabled={!grade.trim() || isLoading}
        >
          Appliquer aux sélectionnés
        </Button>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={onCancel}
            size="sm"
            className="h-9 border-blue-300 text-blue-700 hover:bg-blue-50"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            className="h-9 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtres
  const [filters, setFilters] = useState({
    academicYearId: "",
    classLevel: "" as ClassLevel | "",
    subjectId: "",
    controlType: "" as ControlType | "",
    session: "" as GradeSession | "",
    status: "" as GradeStatus | "",
  });

  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    subjectId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkGrades, setBulkGrades] = useState<{
    [key: string]: {
      grade: string;
      status: GradeStatus;
      session: GradeSession;
      controlType: ControlType;
      notes?: string;
    };
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

  // MODIFICATION 4: Fonction pour afficher la note avec son échelle
  const displayGrade = (grade: number, subject: Subject) => {
    return `${grade.toFixed(1)}/${subject.coefficient}`;
  };

  // MODIFICATION 5: Fonction pour calculer le pourcentage
  const calculateGradePercentage = (grade: number, subject: Subject) => {
    return ((grade / subject.coefficient) * 100).toFixed(1);
  };

  // MODIFICATION 6: Fonction pour déterminer le statut basé sur le coefficient
  const determineGradeStatus = (
    grade: number,
    subject: Subject
  ): GradeStatus => {
    const percentage = (grade / subject.coefficient) * 100;
    const passingPercentage =
      (subject.passingGrade / subject.coefficient) * 100;
    return percentage >= passingPercentage ? "Valid_" : "Non_valid_";
  };

  // Chargement initial des données
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Charger toutes les données en parallèle
        await Promise.all([
          fetchAcademicYears(),
          fetchSubjects(),
          fetchStudents(),
          fetchClasses(),
        ]);

        // Définir l'année académique par défaut
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

  // Charger les affectations de classe et les notes quand les filtres changent
  useEffect(() => {
    const loadFilteredData = async () => {
      if (!filters.academicYearId || !filters.classLevel) return;

      setLoading(true);
      try {
        // 1. Charger les affectations de classe
        const assignments = await fetchAssignments();
        // setAvailableAssignments(assignments);

        // 2. Charger les notes avec les filtres
        const filtersToSend = {
          academicYearId: filters.academicYearId,
          classLevel: filters.classLevel || undefined,
          subjectId: filters.subjectId || undefined,
          controlType: filters.controlType || undefined,
          session: filters.session || undefined,
          status: filters.status || undefined,
        };

        await fetchGrades(filtersToSend);

        // 3. Charger les étudiants de la classe sélectionnée
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

        // 4. Calculer les statistiques
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

  // MODIFICATION 7: Calculer les statistiques adaptées aux différentes échelles
  const calculateStatistics = () => {
    const filtered = getFilteredGrades();

    // Vérifier que filtered est un tableau
    if (!Array.isArray(filtered)) {
      setStatistics({
        totalGrades: 0,
        averageGrade: 0,
        successRate: 0,
        passedGrades: 0,
        failedGrades: 0,
        bySubject: {},
        byControlType: {},
      });
      return;
    }

    const total = filtered.length;

    if (total === 0) {
      setStatistics({
        totalGrades: 0,
        averageGrade: 0,
        successRate: 0,
        passedGrades: 0,
        failedGrades: 0,
        bySubject: {},
        byControlType: {},
      });
      return;
    }

    // Calcul des statistiques générales en pourcentage
    const totalPercentage = filtered.reduce((sum, g) => {
      const subject = subjects.find((s) => s.id === g.subjectId);
      if (!subject) return sum;
      return sum + (g.grade / subject.coefficient) * 100;
    }, 0);

    const averagePercentage = totalPercentage / total;
    const averageGrade =
      (averagePercentage / 100) * (selectedSubject?.coefficient || 100);

    const passed = filtered.filter((g) => {
      const subject = subjects.find((s) => s.id === g.subjectId);
      return subject ? g.grade >= subject.passingGrade : false;
    }).length;
    const successRate = (passed / total) * 100;

    // Statistiques par matière
    const bySubject: Record<string, any> = {};
    filtered.forEach((grade) => {
      const subject = subjects.find((s) => s.id === grade.subjectId);
      if (!subject) return;

      if (!bySubject[subject.id]) {
        bySubject[subject.id] = {
          name: subject.name,
          coefficient: subject.coefficient,
          passingGrade: subject.passingGrade,

          average: 0,
          passed: 0,
          failed: 0,
          total: 0,
          grades: [],
          percentages: [],
        };
      }

      bySubject[subject.id].total++;
      bySubject[subject.id].grades.push(grade.grade);
      bySubject[subject.id].percentages.push(
        (grade.grade / subject.coefficient) * 100
      );

      if (grade.grade >= subject.passingGrade) {
        bySubject[subject.id].passed++;
      } else {
        bySubject[subject.id].failed++;
      }
    });

    // Calcul des moyennes par matière en pourcentage
    Object.values(bySubject).forEach((subjectData: any) => {
      const totalPercentage = subjectData.percentages.reduce(
        (sum: number, percentage: number) => sum + percentage,
        0
      );
      subjectData.averagePercentage =
        totalPercentage / subjectData.percentages.length;
      subjectData.average =
        (subjectData.averagePercentage / 100) * subjectData.coefficient;
    });

    // Statistiques par type de contrôle
    const byControlType: Record<string, any> = {};
    filtered.forEach((grade) => {
      if (!byControlType[grade.controlType]) {
        byControlType[grade.controlType] = {
          average: 0,
          total: 0,
          grades: [],
          percentages: [],
        };
      }
      byControlType[grade.controlType].total++;
      byControlType[grade.controlType].grades.push(grade.grade);
    });

    // Calcul des moyennes par type de contrôle
    Object.values(byControlType).forEach((controlData: any) => {
      controlData.average =
        controlData.grades.reduce(
          (sum: number, grade: number) => sum + grade,
          0
        ) / controlData.grades.length;
    });

    setStatistics({
      totalGrades: total,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      passedGrades: passed,
      failedGrades: total - passed,
      bySubject,
      byControlType,
    });
  };

  // Obtenir les notes filtrées
  const getFilteredGrades = () => {
    // Vérifier que grades existe et est un tableau
    if (!Array.isArray(grades) || grades.length === 0) {
      return [];
    }

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
      const matchesSession =
        !filters.session || grade.session === filters.session;
      const matchesStatus = !filters.status || grade.status === filters.status;

      return (
        matchesAcademicYear &&
        matchesClassLevel &&
        matchesSubject &&
        matchesControlType &&
        matchesSession &&
        matchesStatus
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

  // Gestion des changements de filtres
  const handleClassLevelChange = (value: string) => {
    setFilters((prev) => ({ ...prev, classLevel: value as ClassLevel | "" }));
    setSelectedSubject(null);
    setSelectedStudents([]);
    setBulkGrades({});
  };

  const handleControlTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, controlType: value as ControlType | "" }));
  };

  const handleSessionChange = (value: string) => {
    setFilters((prev) => ({ ...prev, session: value as GradeSession | "" }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value as GradeStatus | "" }));
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
    const studentsToGrade = getStudentsWithoutGrade();
    if (selectedStudents.length === studentsToGrade.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsToGrade.map((s) => s.id));
    }
  };

  // MODIFICATION 8: Sauvegarder une note individuelle adaptée
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      session: GradeSession;
      controlType: ControlType;
      notes?: string;
    }
  ) => {
    setIsSaving(true);
    try {
      // Trouver une affectation pour cette matière et étudiant
      const assignments = getAssignmentsForSelectedSubject();
      const assignment = assignments[0]; // Prendre la première affectation disponible

      if (!assignment) {
        toast.error("Aucune affectation trouvée pour cette matière");
        return;
      }

      const subject = subjects.find((s) => s.id === subjectId);
      if (!subject) {
        toast.error("Matière non trouvée");
        return;
      }

      // MODIFICATION: Déterminer le statut basé sur le coefficient de la matière
      const finalStatus =
        gradeData.status === "Valid_"
          ? determineGradeStatus(gradeData.grade, subject)
          : gradeData.status;

      const existingGrade = grades.find(
        (g) =>
          g.studentId === studentId &&
          g.subjectId === subjectId &&
          g.academicYearId === filters.academicYearId &&
          g.controlType === gradeData.controlType &&
          g.session === gradeData.session
      );

      const gradeToSend = {
        studentId,
        subjectId,
        assignmentId: assignment.id,
        grade: gradeData.grade,
        status: finalStatus, // Utiliser le statut déterminé
        session: gradeData.session,
        controlType: gradeData.controlType,
        academicYearId: filters.academicYearId,
        classLevel: filters.classLevel as ClassLevel,
        notes: gradeData.notes,
        isActive: true,
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: finalStatus,
          session: gradeData.session,
          controlType: gradeData.controlType,
          notes: gradeData.notes,
        });
        toast.success("Note modifiée avec succès");
      } else {
        await addGrade(gradeToSend);
        toast.success("Note ajoutée avec succès");
      }

      // Recharger les notes
      await loadGrades();
    } catch (error) {
      console.error("Erreur sauvegarde note:", error);
      toast.error("Erreur lors de la sauvegarde de la note");
    } finally {
      setIsSaving(false);
      setEditingGrade(null);
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
        session: filters.session || undefined,
        status: filters.status || undefined,
      };

      await fetchGrades(filtersToSend);
      calculateStatistics();
    } catch (error) {
      console.error("Erreur chargement notes:", error);
      toast.error("Erreur lors du chargement des notes");
    }
  };

  // MODIFICATION 9: Sauvegarder les notes en masse adaptées
  // GradesManager.tsx - Modifiez saveBulkGrades

  const saveBulkGrades = async () => {
    if (!selectedSubject || !selectedAcademicYear || !filters.classLevel) {
      toast.error(
        "Veuillez sélectionner une matière, une année académique et un niveau"
      );
      return;
    }

    // Trouver une affectation pour cette matière
    const assignments = getAssignmentsForSelectedSubject();
    const assignment = assignments[0];

    if (!assignment) {
      toast.error("Aucune affectation trouvée pour cette matière");
      return;
    }

    setIsSaving(true);
    try {
      // Préparer les données des notes
      const gradesToAdd = Object.entries(bulkGrades)
        .filter(
          ([studentId, data]) =>
            data.grade.trim() !== "" && selectedStudents.includes(studentId)
        )
        .map(([studentId, data]) => {
          const gradeValue = parseFloat(data.grade);

          // Validation de la note par rapport au coefficient
          if (gradeValue > selectedSubject.coefficient) {
            toast.error(
              `Note ${gradeValue} dépasse le maximum ${selectedSubject.coefficient} pour ${selectedStudents}`
            );
            return null;
          }

          const finalStatus =
            data.status === "Valid_"
              ? determineGradeStatus(gradeValue, selectedSubject)
              : data.status;

          return {
            studentId,
            subjectId: selectedSubject.id,
            assignmentId: assignment.id,
            grade: gradeValue,
            status: finalStatus,
            session: data.session,
            controlType: data.controlType,
            academicYearId: selectedAcademicYear.id,
            classLevel: filters.classLevel as ClassLevel,
            notes: data.notes,
            isActive: true,
          };
        })
        .filter(Boolean);

      if (gradesToAdd.length === 0) {
        toast.info("Aucune note valide à sauvegarder");
        setIsSaving(false);
        return;
      }

      console.log("📤 Saving", gradesToAdd.length, "grades...");

      // Utiliser bulkAddGrades du store
      const result = await bulkAddGrades(gradesToAdd);

      if (result.length > 0) {
        toast.success(`${result.length} notes sauvegardées avec succès`);
      }

      if (result.length > 0) {
        toast.error(`${result.length} erreurs lors de la sauvegarde`);
      }

      setBulkGrades({});
      setBulkEditMode(false);
      setSelectedStudents([]);

      // Recharger les données
      await loadGrades();
    } catch (error) {
      console.error("Erreur sauvegarde en masse:", error);
      toast.error("Erreur lors de la sauvegarde des notes");
    } finally {
      setIsSaving(false);
    }
  };

  // Export Excel adapté
  const handleExportExcel = () => {
    try {
      const dataToExport = getFilteredGrades()
        .map((grade) => {
          const student = students.find((s) => s.id === grade.studentId);
          const subject = subjects.find((s) => s.id === grade.subjectId);

          if (!subject) return null;

          return {
            Matricule: student?.studentCode,
            Nom: student?.lastName,
            Prénom: student?.firstName,
            Matière: subject?.name,
            Code: subject?.code,
            Échelle: subject.coefficient,
            Note: grade.grade,
            Pourcentage:
              ((grade.grade / subject.coefficient) * 100).toFixed(1) + "%",
            Statut: grade.status,
            Session: grade.session,
            "Type contrôle": grade.controlType,
            Niveau: grade.classLevel,
            "Année académique": selectedAcademicYear?.year,
            Date: new Date(grade.createdAt).toLocaleDateString(),
            Remarques: grade.notes || "",
          };
        })
        .filter(Boolean);

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

  // Import Excel adapté
  const handleImportExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transformer les données Excel en format attendu par l'API
        const gradesToImport = jsonData
          .map((row: any) => {
            const student = students.find(
              (s) => s.studentCode === row.Matricule || s.email === row.Email
            );
            const subject = subjects.find(
              (s) => s.code === row["Code Matière"]
            );

            if (!student || !subject) return null;

            const assignments = getAssignmentsForSelectedSubject();
            const assignment = assignments.find(
              (a) => a.subjectId === subject.id
            );

            if (!assignment) return null;

            // MODIFICATION: Valider la note par rapport au coefficient de la matière
            const gradeValue = parseFloat(row.Note);
            if (gradeValue > subject.coefficient) {
              toast.error(
                `Note ${gradeValue} dépasse le maximum ${subject.coefficient} pour ${subject.name}`
              );
              return null;
            }

            // MODIFICATION: Déterminer le statut
            const status =
              row.Statut || determineGradeStatus(gradeValue, subject);

            return {
              studentId: student.id,
              subjectId: subject.id,
              assignmentId: assignment.id,
              grade: gradeValue,
              status: status,
              session: row.Session || "Normale",
              controlType: row["Type contrôle"] || "CONTROLE_1",
              academicYearId: filters.academicYearId,
              classLevel: filters.classLevel as ClassLevel,
              notes: row.Remarques,
              isActive: true,
            };
          })
          .filter(Boolean);

        if (gradesToImport.length > 0) {
          await bulkAddGrades(gradesToImport);
          toast.success(`${gradesToImport.length} notes importées avec succès`);
          await loadGrades();
        }
      } catch (error) {
        console.error("Erreur import Excel:", error);
        toast.error("Erreur lors de l'import Excel");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Fonctions utilitaires
  const getStatusBadge = (status: GradeStatus) => {
    switch (status) {
      case "Valid_":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Validé
          </Badge>
        );
      case "Non_valid_":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Non validé
          </Badge>
        );
      case "Reprendre":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />À reprendre
          </Badge>
        );
    }
  };

  const getControlTypeLabel = (type: ControlType) => {
    switch (type) {
      case "CONTROLE_1":
        return "Contrôle 1";
      case "CONTROLE_2":
        return "Contrôle 2";
      case "CONTROLE_3":
        return "Contrôle 3";
      case "CONTROLE_4":
        return "Contrôle 4";
    }
  };

  // Obtenir le niveau de classe affiché
  const getClassLevelDisplay = (level: ClassLevel | "") => {
    if (!level) return "Tous les niveaux";
    const levels: Record<ClassLevel, string> = {
      Sixieme: "Sixième",
      Cinquieme: "Cinquième",
      Quatrieme: "Quatrième",
      Troisieme: "Troisième",
      Seconde: "Seconde",
      Premiere: "Première",
      Terminale: "Terminale",
      NSI: "NSI",
      NSII: "NSII",
      NSIII: "NSIII",
      NSIV: "NSIV",
    };
    return levels[level] || level;
  };

  // Obtenir les matières disponibles pour le niveau sélectionné
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

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
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
            onChange={handleImportExcel}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer Excel
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
          <Button
            onClick={() => setBulkEditMode(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!selectedSubject}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter des notes
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-blue-800">
                Filtres
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-2 text-blue-600 hover:bg-blue-100"
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
                <SelectTrigger
                  id="academicYear"
                  className="h-10 border-blue-300 focus:border-blue-500"
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
                onValueChange={handleClassLevelChange}
                disabled={loading}
              >
                <SelectTrigger
                  id="classLevel"
                  className="h-10 border-blue-300 focus:border-blue-500"
                >
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  <SelectItem value="CP1">CP1</SelectItem>
                  <SelectItem value="CP2">CP2</SelectItem>
                  <SelectItem value="CE1">CE1</SelectItem>
                  <SelectItem value="CE2">CE2</SelectItem>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                  <SelectItem value="Sixieme">Sixième</SelectItem>
                  <SelectItem value="Cinquieme">Cinquième</SelectItem>
                  <SelectItem value="Quatrieme">Quatrième</SelectItem>
                  <SelectItem value="Troisieme">Troisième</SelectItem>
                  <SelectItem value="Seconde">Seconde</SelectItem>
                  <SelectItem value="Premiere">Première</SelectItem>
                  <SelectItem value="Terminale">Terminale</SelectItem>
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
                  className="h-10 border-blue-300 focus:border-blue-500"
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
                  <SelectItem value="">Toutes les matières</SelectItem>
                  {getAvailableSubjects().map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {subject.code} - {subject.name}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          /{subject.coefficient}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Type de contrôle */}
              <div className="space-y-2">
                <Label htmlFor="controlType" className="text-sm font-medium">
                  Type de contrôle
                </Label>
                <Select
                  value={filters.controlType}
                  onValueChange={handleControlTypeChange}
                >
                  <SelectTrigger
                    id="controlType"
                    className="h-10 border-blue-300 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Tous les contrôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                    <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                    <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                    <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Session */}
              <div className="space-y-2">
                <Label htmlFor="session" className="text-sm font-medium">
                  Session
                </Label>
                <Select
                  value={filters.session}
                  onValueChange={handleSessionChange}
                >
                  <SelectTrigger
                    id="session"
                    className="h-10 border-blue-300 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Toutes les sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes</SelectItem>
                    <SelectItem value="Normale">Session normale</SelectItem>
                    <SelectItem value="Reprise">Session de reprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Statut
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    id="status"
                    className="h-10 border-blue-300 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="Valid_">Validé</SelectItem>
                    <SelectItem value="Non_valid_">Non validé</SelectItem>
                    <SelectItem value="Reprendre">À reprendre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Recherche */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un étudiant..."
                className="pl-9 h-10 border-blue-300 focus:border-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chargement */}
      {loading && <LoadingSpinner message="Chargement des données..." />}

      {/* Statistiques */}
      {!loading && statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={FileText}
            value={statistics.totalGrades}
            label="Notes totales"
            gradient="from-blue-100 to-blue-200"
            iconBg="bg-blue-600"
          />
          <StatCard
            icon={BarChart3}
            value={statistics.averageGrade.toFixed(1)}
            label="Moyenne générale"
            gradient="from-green-100 to-green-200"
            iconBg="bg-green-600"
          />
          <StatCard
            icon={CheckCircle}
            value={`${statistics.successRate.toFixed(1)}%`}
            label="Taux de réussite"
            gradient="from-purple-100 to-purple-200"
            iconBg="bg-purple-600"
          />
          <StatCard
            icon={Users}
            value={availableStudents.length}
            label="Étudiants actifs"
            gradient="from-amber-100 to-amber-200"
            iconBg="bg-amber-600"
          />
        </div>
      )}

      {/* Informations sur la sélection */}
      {!loading && selectedAcademicYear && filters.classLevel && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  {getClassLevelDisplay(filters.classLevel)}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  {filters.session === "Reprise"
                    ? "Session reprise"
                    : "Session normale"}
                </Badge>
                {selectedSubject && (
                  <Badge className="text-xs bg-amber-500/20 text-amber-100 border-amber-400/30">
                    {selectedSubject.code} (/{selectedSubject.coefficient})
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold">{selectedAcademicYear.year}</h2>
              <div className="flex items-center gap-6 mt-2 flex-wrap text-sm">
                <div>
                  <p className="text-indigo-200">Étudiants dans le niveau</p>
                  <p className="font-semibold">{availableStudents.length}</p>
                </div>
                <div>
                  <p className="text-indigo-200">Matières disponibles</p>
                  <p className="font-semibold">
                    {getAvailableSubjects().length}
                  </p>
                </div>
                {selectedSubject && (
                  <>
                    <div>
                      <p className="text-indigo-200">Notes saisies</p>
                      <p className="font-semibold">
                        {
                          getFilteredGrades().filter(
                            (g) => g.subjectId === selectedSubject.id
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-200">Seuil de passage</p>
                      <p className="font-semibold">
                        {selectedSubject.passingGrade}/
                        {selectedSubject.coefficient}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-200">Coefficient</p>
                      <p className="font-semibold">
                        {selectedSubject.coefficient}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes existantes */}
      {!loading && selectedSubject && !bulkEditMode && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Notes existantes - {selectedSubject.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {
                    getFilteredGrades().filter(
                      (g) => g.subjectId === selectedSubject.id
                    ).length
                  }{" "}
                  note(s) - Échelle: /{selectedSubject.coefficient} - Seuil:{" "}
                  {selectedSubject.passingGrade} - Coefficient:{" "}
                  {selectedSubject.coefficient}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {getFilteredGrades().filter(
              (g) => g.subjectId === selectedSubject.id
            ).length === 0 ? (
              <EmptyState
                icon={Book}
                title="Aucune note trouvée"
                description="Aucune note n'existe pour cette matière avec les filtres actuels."
              />
            ) : (
              <div className="space-y-3">
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

                    const percentage = calculateGradePercentage(
                      grade.grade,
                      selectedSubject
                    );
                    const isPassing =
                      grade.grade >= selectedSubject.passingGrade;

                    return (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-4 border rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.studentCode}
                                {student.schoolClass &&
                                  ` • ${student.schoolClass.name}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-2xl font-bold ${
                                  isPassing ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {displayGrade(grade.grade, selectedSubject)}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isPassing
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {percentage}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(grade.status)}
                              <Badge variant="outline" className="text-xs">
                                {getControlTypeLabel(grade.controlType)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {grade.session}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(grade.updatedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingGrade({
                                  studentId: grade.studentId,
                                  subjectId: grade.subjectId,
                                })
                              }
                              className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Êtes-vous sûr de vouloir supprimer cette note ?"
                                  )
                                ) {
                                  try {
                                    await deleteGrade(grade.id);
                                    toast.success("Note supprimée avec succès");
                                    await loadGrades();
                                  } catch (error) {
                                    toast.error(
                                      "Erreur lors de la suppression"
                                    );
                                  }
                                }
                              }}
                              className="h-9 w-9 p-0 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Édition en masse */}
      {!loading && bulkEditMode && selectedSubject && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Ajouter des notes - {selectedSubject.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Sélectionnez les étudiants à noter (Échelle: /
                  {selectedSubject.coefficient})
                </p>
              </div>
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
              subject={selectedSubject}
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
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-400 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          toggleStudentSelection(student.id);
                          // Initialiser la note pour cet étudiant
                          if (!bulkGrades[student.id]) {
                            setBulkGrades((prev) => ({
                              ...prev,
                              [student.id]: {
                                grade: "",
                                status: "Valid_",
                                session: "Normale",
                                controlType: "CONTROLE_1",
                              },
                            }));
                          }
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                      />

                      <div className="flex-1 ml-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.studentCode}
                              {student.schoolClass &&
                                ` • ${student.schoolClass.name}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {bulkGrade && bulkGrade.grade ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {bulkGrade.grade}/{selectedSubject.coefficient}
                            </span>
                            <Badge className="text-xs">
                              {calculateGradePercentage(
                                parseFloat(bulkGrade.grade),
                                selectedSubject
                              )}
                              %
                            </Badge>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300"
                          >
                            À noter
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={selectAllStudents}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                {selectedStudents.length === getStudentsWithoutGrade().length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </Button>
              <div className="text-sm text-gray-600">
                {selectedStudents.length} étudiant(s) sélectionné(s) sur{" "}
                {getStudentsWithoutGrade().length}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun niveau sélectionné */}
      {!loading && !filters.classLevel && (
        <EmptyState
          icon={BookOpen}
          title="Sélectionnez un niveau"
          description="Veuillez sélectionner un niveau de classe pour afficher les notes."
        />
      )}

      {/* Message si aucune matière sélectionnée */}
      {!loading && filters.classLevel && !selectedSubject && !bulkEditMode && (
        <EmptyState
          icon={Book}
          title="Sélectionnez une matière"
          description="Veuillez sélectionner une matière pour afficher les notes."
        />
      )}

      {/* Modal d'édition */}
      {editingGrade && selectedSubject && (
        <GradeEditModal
          student={students.find((s) => s.id === editingGrade.studentId)!}
          subject={selectedSubject}
          existingGrade={grades.find(
            (g) =>
              g.studentId === editingGrade.studentId &&
              g.subjectId === editingGrade.subjectId
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
    </div>
  );
};
export default GradeManager;
