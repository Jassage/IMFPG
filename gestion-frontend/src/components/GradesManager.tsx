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
  SchoolClass,
  ClassAssignment,
} from "@/types/academic";

// Types simplifiés
interface GradeInput {
  grade: string;
  status: GradeStatus;
  controlType: ControlType;
  notes?: string;
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

// Composant pour l'input de note inline
const GradeInputInline = ({
  student,
  subject,
  existingGrade,
  onSave,
  isLoading = false,
}: {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    controlType: ControlType;
    notes?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [status, setStatus] = useState<GradeStatus>(
    existingGrade?.status || "Valid_"
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
      setControlType(existingGrade.controlType);
      setNotes(existingGrade.notes || "");
    } else {
      setGrade("");
      setStatus("Valid_");
      setControlType("CONTROLE_1");
      setNotes("");
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
    await onSave({
      grade: numericGrade,
      status,
      controlType,
      notes: notes || undefined,
    });
  };

  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
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
              {student.schoolClass && ` • ${student.schoolClass.name}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="space-y-1 w-24">
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="Note"
            value={grade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className={`h-9 ${errors.grade ? "border-destructive" : ""}`}
            disabled={isLoading}
          />
          {errors.grade && (
            <p className="text-xs text-destructive">{errors.grade}</p>
          )}
        </div>

        <div className="w-32">
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

        <div className="w-28">
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

        <div className="w-48">
          <Input
            placeholder="Remarques"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-9"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleSave}
          size="sm"
          className="h-9"
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

        {existingGrade && (
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-red-600 hover:bg-red-100"
            onClick={async () => {
              if (confirm("Supprimer cette note ?")) {
                // Vous aurez besoin d'une fonction de suppression
                // await onDelete(existingGrade.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Contrôles en masse simplifiés
const BulkControls = ({
  selectedCount,
  onSave,
  onCancel,
  isLoading = false,
  bulkGrades,
  setBulkGrades,
}: {
  selectedCount: number;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  bulkGrades: { [key: string]: GradeInput };
  setBulkGrades: React.Dispatch<
    React.SetStateAction<{ [key: string]: GradeInput }>
  >;
}) => {
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState<GradeStatus>("Valid_");
  const [controlType, setControlType] = useState<ControlType>("CONTROLE_1");

  const handleApply = () => {
    if (grade.trim()) {
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
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4 border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ✅ {selectedCount} étudiant(s) sélectionné(s)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Note (/100)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="Note"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="h-9 border-blue-300 focus:border-blue-500"
            disabled={isLoading}
          />
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

        <div className="space-y-2 flex items-end">
          <Button
            onClick={handleApply}
            className="h-9 bg-blue-600 hover:bg-blue-700 w-full"
            disabled={!grade.trim() || isLoading}
          >
            Appliquer aux sélectionnés
          </Button>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          className="h-9 border-blue-300 text-blue-700 hover:bg-blue-50"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={onSave}
          className="h-9 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Sauvegarder tout
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtres simplifiés (sans session)
  const [filters, setFilters] = useState({
    academicYearId: "",
    classLevel: "" as ClassLevel | "",
    subjectId: "",
    controlType: "" as ControlType | "",
    status: "" as GradeStatus | "",
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
        "CP1",
        "CP2",
        "CE1",
        "CE2",
        "CM1",
        "CM2",
        "Sixieme",
        "Cinquieme",
        "Quatrieme",
        "Troisieme",
        "Seconde",
        "Premiere",
        "Terminale",
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
          status: filters.status || undefined,
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
        bySubject: {},
        byControlType: {},
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
      bySubject: {},
      byControlType: {},
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
      const matchesStatus = !filters.status || grade.status === filters.status;

      return (
        matchesAcademicYear &&
        matchesClassLevel &&
        matchesSubject &&
        matchesControlType &&
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

  // Sauvegarder une note individuelle
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      controlType: ControlType;
      notes?: string;
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

      const existingGrade = grades.find(
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
        session: "Normale" as any, // Toujours normale maintenant
        controlType: gradeData.controlType,
        academicYearId: filters.academicYearId,
        classLevel: filters.classLevel as ClassLevel,
        notes: gradeData.notes,
        isActive: true,
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
          notes: gradeData.notes,
        });
        toast.success("Note modifiée avec succès");
      } else {
        await addGrade(gradeToSend);
        toast.success("Note ajoutée avec succès");
      }

      await loadGrades();
    } catch (error) {
      console.error("Erreur sauvegarde note:", error);
      toast.error("Erreur lors de la sauvegarde de la note");
    } finally {
      setIsSaving(false);
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
        status: filters.status || undefined,
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
            notes: data.notes,
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
          Note: grade.grade,
          Statut: grade.status,
          "Type contrôle": grade.controlType,
          Niveau: grade.classLevel,
          "Année académique": selectedAcademicYear?.year,
          Date: new Date(grade.createdAt).toLocaleDateString(),
          Remarques: grade.notes || "",
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

  const getClassLevelDisplay = (level: ClassLevel | "") => {
    if (!level) return "Tous les niveaux";
    const levels: Record<ClassLevel, string> = {
      CP1: "CP1",
      CP2: "CP2",
      CE1: "CE1",
      CE2: "CE2",
      CM1: "CM1",
      CM2: "CM2",
      Sixieme: "Sixième",
      Cinquieme: "Cinquième",
      Quatrieme: "Quatrième",
      Troisieme: "Troisième",
      Seconde: "Seconde",
      Premiere: "Première",
      Terminale: "Terminale",
    };
    return levels[level] || level;
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

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Gestion des Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion simplifiée des notes par matière et niveau
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
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
            Ajouter des notes en masse
          </Button>
        </div>
      </div>

      {/* Filtres simplifiés */}
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
                  className="h-10 border-blue-300 focus:border-blue-500"
                >
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
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
                  <SelectItem value="all">Toutes les matières</SelectItem>
                  {getAvailableSubjects().map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name} (Coef.{" "}
                      {subject.coefficient})
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
                  <SelectTrigger
                    id="controlType"
                    className="h-10 border-blue-300 focus:border-blue-500"
                  >
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

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Statut
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      status: value as GradeStatus | "",
                    }));
                  }}
                >
                  <SelectTrigger
                    id="status"
                    className="h-10 border-blue-300 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
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

      {/* Interface principale */}
      {!loading && selectedSubject && !bulkEditMode && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Saisie des notes - {selectedSubject.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Saisissez les notes directement pour chaque étudiant
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Seuil de validation: {selectedSubject.passingGrade}/100
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* En-tête des colonnes */}
            <div className="grid grid-cols-12 gap-3 mb-4 p-3 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
              <div className="col-span-4">Étudiant</div>
              <div className="col-span-2">Note (/100)</div>
              <div className="col-span-2">Type de contrôle</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Liste des étudiants avec notes existantes */}
            {getFilteredGrades()
              .filter((g) => g.subjectId === selectedSubject.id)
              .filter((grade) => {
                if (!searchTerm) return true;
                const student = students.find((s) => s.id === grade.studentId);
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
                const student = students.find((s) => s.id === grade.studentId);
                if (!student) return null;

                return (
                  <GradeInputInline
                    key={grade.id}
                    student={student}
                    subject={selectedSubject}
                    existingGrade={grade}
                    onSave={(gradeData) =>
                      handleSaveGrade(student.id, selectedSubject.id, gradeData)
                    }
                    isLoading={isSaving}
                  />
                );
              })}

            {/* Séparateur */}
            <div className="my-6 border-t border-gray-200 relative">
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                Étudiants sans note
              </span>
            </div>

            {/* Étudiants sans note */}
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
                    handleSaveGrade(student.id, selectedSubject.id, gradeData)
                  }
                  isLoading={isSaving}
                />
              ))}

            {getStudentsWithoutGrade().length === 0 &&
              getFilteredGrades().filter(
                (g) => g.subjectId === selectedSubject.id
              ).length === 0 && (
                <EmptyState
                  icon={Book}
                  title="Aucun étudiant trouvé"
                  description="Aucun étudiant correspond aux critères de recherche."
                />
              )}
          </CardContent>
        </Card>
      )}

      {/* Mode édition en masse */}
      {!loading && bulkEditMode && selectedSubject && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Ajout en masse - {selectedSubject.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Sélectionnez les étudiants et appliquez des notes en masse
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
                        {bulkGrade ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {bulkGrade.grade || "0"}
                            </span>
                            <Badge className="text-xs">
                              {bulkGrade.status === "Valid_"
                                ? "Validé"
                                : bulkGrade.status === "Non_valid_"
                                ? "Non validé"
                                : "À reprendre"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getControlTypeLabel(bulkGrade.controlType)}
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

      {/* Messages d'état */}
      {!loading && !filters.classLevel && (
        <EmptyState
          icon={BookOpen}
          title="Sélectionnez un niveau"
          description="Veuillez sélectionner un niveau de classe pour afficher les notes."
        />
      )}

      {!loading && filters.classLevel && !selectedSubject && !bulkEditMode && (
        <EmptyState
          icon={Book}
          title="Sélectionnez une matière"
          description="Veuillez sélectionner une matière pour afficher les notes."
        />
      )}
    </div>
  );
};

export default GradeManager;
