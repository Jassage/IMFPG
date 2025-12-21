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
  Filter,
  Plus,
  Download,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Percent,
  Calendar,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useGradeStore } from "@/store/gradeStore";
import { useStudentStore } from "@/store/studentStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAuthStore } from "@/store/authStore";
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

// Types pour le professeur
interface ProfessorGradeManagerProps {
  professorId?: string;
}

// Composant pour le professeur
export const ProfessorGradeManager = ({
  professorId,
}: ProfessorGradeManagerProps) => {
  const { user } = useAuthStore();
  const { students } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { grades, fetchGrades, addGrade, updateGrade, deleteGrade } =
    useGradeStore();
  const { assignments, fetchAssignments } = useAssignmentStore();

  // ID du professeur (soit depuis props, soit depuis l'auth)
  const currentProfessorId = professorId || user?.id;

  // État local
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filters, setFilters] = useState({
    academicYearId: "",
    classLevel: "" as ClassLevel | "",
    subjectId: "",
    controlType: "" as ControlType | "",
  });
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignments, setSelectedAssignments] = useState<
    ClassAssignment[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  // Chargement initial
  useEffect(() => {
    const loadProfessorData = async () => {
      if (!currentProfessorId) return;

      setLoading(true);
      try {
        // Charger les années académiques
        await fetchAcademicYears();

        // Charger les affectations du professeur
        await fetchAssignments();

        // Filtrer les affectations pour ce professeur
        const professorAssignments = assignments
          .filter(
            (assignment) => assignment.professeurId === currentProfessorId
          )
          .map((a) => ({
            ...a,
            classLevel: a.classLevel as ClassLevel,
          })) as unknown as ClassAssignment[];

        setSelectedAssignments(professorAssignments);

        // Si le professeur a des affectations, pré-remplir les filtres
        if (professorAssignments.length > 0) {
          const firstAssignment = professorAssignments[0];
          const currentYear =
            academicYears.find((ay) => ay.isCurrent) || academicYears[0];

          if (currentYear) {
            setFilters((prev) => ({
              ...prev,
              academicYearId: currentYear.id,
              classLevel: firstAssignment.classLevel as ClassLevel,
              subjectId: firstAssignment.subjectId,
            }));
            setSelectedAcademicYear(currentYear);
            setSelectedSubject(firstAssignment.subject as Subject);
          }
        }
      } catch (error) {
        console.error("Erreur chargement données professeur:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadProfessorData();
  }, [currentProfessorId]);

  // Charger les notes en fonction des filtres
  useEffect(() => {
    const loadFilteredGrades = async () => {
      if (!filters.academicYearId || !filters.classLevel || !filters.subjectId)
        return;

      try {
        await fetchGrades({
          academicYearId: filters.academicYearId,
          classLevel: filters.classLevel,
          subjectId: filters.subjectId,
          controlType: filters.controlType || undefined,
        });

        // Filtrer les étudiants pour ce niveau
        const classStudents = students.filter(
          (student) =>
            student.status === "Active" &&
            student.schoolClass?.level === filters.classLevel
        );
        setAvailableStudents(classStudents);
      } catch (error) {
        console.error("Erreur chargement notes:", error);
      }
    };

    loadFilteredGrades();
  }, [filters]);

  // Obtenir les matières disponibles pour le professeur
  const getProfessorSubjects = () => {
    if (!filters.academicYearId || !filters.classLevel) return [];

    return selectedAssignments
      .filter(
        (assignment) =>
          assignment.academicYearId === filters.academicYearId &&
          assignment.classLevel === filters.classLevel
      )
      .map((assignment) => assignment.subject)
      .filter(
        (subject, index, self) =>
          subject && self.findIndex((s) => s?.id === subject.id) === index
      )
      .filter(Boolean) as Subject[];
  };

  // Obtenir les niveaux disponibles pour le professeur
  const getProfessorLevels = () => {
    if (!filters.academicYearId) return [];

    return selectedAssignments
      .filter(
        (assignment) => assignment.academicYearId === filters.academicYearId
      )
      .map((assignment) => assignment.classLevel)
      .filter((level, index, self) => self.indexOf(level) === index);
  };

  // Obtenir les notes existantes
  const getExistingGrades = () => {
    return grades.filter(
      (grade) =>
        grade.subjectId === filters.subjectId &&
        grade.academicYearId === filters.academicYearId &&
        grade.classLevel === filters.classLevel &&
        (!filters.controlType || grade.controlType === filters.controlType)
    );
  };

  // Obtenir les étudiants sans note
  const getStudentsWithoutGrade = () => {
    const existingGrades = getExistingGrades();
    const studentsWithGrade = new Set(existingGrades.map((g) => g.studentId));

    return availableStudents.filter(
      (student) => !studentsWithGrade.has(student.id)
    );
  };

  // Calculer les statistiques
  const getStatistics = () => {
    const existingGrades = getExistingGrades();
    const total = existingGrades.length;

    if (total === 0) return null;

    const average = existingGrades.reduce((sum, g) => sum + g.grade, 0) / total;
    const passed = existingGrades.filter((g) => {
      const subject = selectedSubject;
      return subject ? g.grade >= subject.passingGrade : false;
    }).length;
    const successRate = (passed / total) * 100;

    return {
      totalGrades: total,
      averageGrade: parseFloat(average.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      passedGrades: passed,
      failedGrades: total - passed,
    };
  };

  // Sauvegarder une note
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
      // Trouver l'affectation correspondante
      const assignment = selectedAssignments.find(
        (a) =>
          a.subjectId === subjectId &&
          a.classLevel === filters.classLevel &&
          a.academicYearId === filters.academicYearId
      );

      if (!assignment) {
        toast.error("Affectation non trouvée");
        return;
      }

      // Vérifier si une note existe déjà
      const existingGrade = grades.find(
        (g) =>
          g.studentId === studentId &&
          g.subjectId === subjectId &&
          g.controlType === gradeData.controlType &&
          g.academicYearId === filters.academicYearId
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
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
        });
        toast.success("Note mise à jour");
      } else {
        await addGrade(gradeToSend);
        toast.success("Note enregistrée");
      }

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        classLevel: filters.classLevel,
        subjectId: filters.subjectId,
      });
    } catch (error: any) {
      console.error("Erreur sauvegarde note:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de l'enregistrement"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Exporter les notes en Excel
  const handleExportExcel = () => {
    try {
      const existingGrades = getExistingGrades();

      const dataToExport = existingGrades.map((grade) => {
        const student = students.find((s) => s.id === grade.studentId);

        return {
          Matricule: student?.studentCode,
          Nom: student?.lastName,
          Prénom: student?.firstName,
          "Note /100": grade.grade,
          "Note /20": ((grade.grade / 100) * 20).toFixed(2),
          Statut:
            grade.status === "Valid_"
              ? "Validé"
              : grade.status === "Reprendre"
              ? "À reprendre"
              : "Non validé",
          "Type contrôle": grade.controlType,
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

      const fileName = `notes-${selectedSubject?.name}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      saveAs(blob, fileName);

      toast.success("Export réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  // Calculer le statut basé sur la note
  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (!selectedSubject) return "Valid_";
    if (gradeValue >= selectedSubject.passingGrade) return "Valid_";
    if (gradeValue >= selectedSubject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  const statistics = getStatistics();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Saisie des notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.firstName} {user?.lastName} • Professeur
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            disabled={!selectedSubject || getExistingGrades().length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Année académique */}
            <div className="space-y-2">
              <Label>Année académique</Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, academicYearId: value }));
                  const year = academicYears.find((ay) => ay.id === value);
                  setSelectedAcademicYear(year || null);
                }}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
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

            {/* Niveau */}
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select
                value={filters.classLevel}
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    classLevel: value as ClassLevel | "",
                  }));
                  setSelectedSubject(null);
                }}
                disabled={!filters.academicYearId || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {getProfessorLevels().map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, subjectId: value }));
                  const subject = getProfessorSubjects().find(
                    (s) => s.id === value
                  );
                  setSelectedSubject(subject || null);
                }}
                disabled={!filters.classLevel || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {getProfessorSubjects().map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de contrôle */}
            <div className="space-y-2">
              <Label>Type de contrôle</Label>
              <Select
                value={filters.controlType}
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    controlType: value as ControlType | "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
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
          </div>
        </CardContent>
      </Card>

      {/* Chargement */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des données...</span>
        </div>
      )}

      {/* Statistiques */}
      {!loading && selectedSubject && statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Notes totales
                  </p>
                  <p className="text-2xl font-bold">{statistics.totalGrades}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moyenne</p>
                  <p className="text-2xl font-bold">
                    {statistics.averageGrade}/100
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validés</p>
                  <p className="text-2xl font-bold">
                    {statistics.passedGrades}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Taux réussite
                  </p>
                  <p className="text-2xl font-bold">
                    {statistics.successRate}%
                  </p>
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saisie des notes */}
      {!loading && selectedSubject && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">
                  {selectedSubject.name} - Saisie des notes
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Coefficient: {selectedSubject.coefficient} | Seuil:{" "}
                  {selectedSubject.passingGrade}/100
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher étudiant..."
                    className="pl-9 w-full md:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Notes existantes */}
            <div className="space-y-4 mb-8">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Notes existantes
              </h3>

              {getExistingGrades()
                .filter((grade) => {
                  const student = students.find(
                    (s) => s.id === grade.studentId
                  );
                  if (!student) return false;
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
                .map((grade) => {
                  const student = students.find(
                    (s) => s.id === grade.studentId
                  );
                  if (!student) return null;

                  return (
                    <GradeInputRow
                      key={grade.id}
                      student={student}
                      subject={selectedSubject}
                      existingGrade={grade}
                      onSave={handleSaveGrade}
                      onDelete={deleteGrade}
                      disabled={isSaving}
                    />
                  );
                })}

              {getExistingGrades().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune note enregistrée pour cette matière</p>
                </div>
              )}
            </div>

            {/* Étudiants sans note */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Étudiants sans note ({getStudentsWithoutGrade().length})
              </h3>

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
                  <GradeInputRow
                    key={student.id}
                    student={student}
                    subject={selectedSubject}
                    onSave={handleSaveGrade}
                    disabled={isSaving}
                  />
                ))}

              {getStudentsWithoutGrade().length === 0 && (
                <div className="text-center py-4 text-green-600 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Tous les étudiants ont une note</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si pas de matière sélectionnée */}
      {!loading && !selectedSubject && (
        <Card className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Sélectionnez une matière</h3>
          <p className="text-gray-600 mt-2">
            Veuillez sélectionner une matière dans les filtres pour commencer la
            saisie des notes.
          </p>
        </Card>
      )}
    </div>
  );
};

// Composant de ligne de saisie
const GradeInputRow = ({
  student,
  subject,
  existingGrade,
  onSave,
  onDelete,
  disabled = false,
}: {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  onSave: (
    studentId: string,
    subjectId: string,
    gradeData: any
  ) => Promise<void>;
  onDelete?: (gradeId: string) => Promise<void>;
  disabled?: boolean;
}) => {
  const [grade, setGrade] = useState(existingGrade?.grade.toString() || "");
  const [controlType, setControlType] = useState<ControlType>(
    existingGrade?.controlType || "CONTROLE_1"
  );
  const [saving, setSaving] = useState(false);

  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (gradeValue >= subject.passingGrade) return "Valid_";
    if (gradeValue >= subject.passingGrade * 0.7) return "Reprendre";
    return "Non_valid_";
  };

  const handleSave = async () => {
    if (!grade.trim()) {
      toast.error("Veuillez saisir une note");
      return;
    }

    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      toast.error("Note invalide (0-100)");
      return;
    }

    setSaving(true);
    try {
      await onSave(student.id, subject.id, {
        grade: numericGrade,
        status: calculateStatus(numericGrade),
        controlType,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex-1 flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-sm text-gray-600">{student.studentCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:flex md:items-center gap-3 w-full md:w-auto">
        <div className="space-y-1">
          <Label className="text-xs">Note /100</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="0.0"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full"
            disabled={disabled || saving}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Note /20</Label>
          <div className="h-10 flex items-center justify-center border rounded px-3 bg-gray-50">
            <span className="font-medium">
              {grade ? ((parseFloat(grade) / 100) * 20).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Contrôle</Label>
          <Select
            value={controlType}
            onValueChange={(value: ControlType) => setControlType(value)}
          >
            <SelectTrigger className="w-full">
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

        <div className="space-y-1">
          <Label className="text-xs">Statut</Label>
          <div className="h-10 flex items-center">
            {grade ? (
              <Badge
                className={
                  calculateStatus(parseFloat(grade)) === "Valid_"
                    ? "bg-green-100 text-green-800"
                    : calculateStatus(parseFloat(grade)) === "Reprendre"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {calculateStatus(parseFloat(grade)) === "Valid_"
                  ? "Validé"
                  : calculateStatus(parseFloat(grade)) === "Reprendre"
                  ? "À reprendre"
                  : "Non validé"}
              </Badge>
            ) : (
              <Badge variant="outline">Non noté</Badge>
            )}
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 flex items-center gap-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="flex-1"
            disabled={!grade.trim() || disabled || saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingGrade ? (
              "Mettre à jour"
            ) : (
              "Enregistrer"
            )}
          </Button>

          {existingGrade && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={async () => {
                if (confirm("Supprimer cette note ?")) {
                  await onDelete(existingGrade.id);
                }
              }}
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorGradeManager;
