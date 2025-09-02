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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "lucide-react";
import { useAcademicStore } from "../../store/studentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useFacultyStore } from "@/store/facultyStore";
import { useUEStore } from "@/store/courseStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { useCourseAssignmentStore } from "@/store/courseAssignmentStore";
import { useGradeStore } from "@/store/gradeStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface GradeEditModalProps {
  student: any;
  ue: any;
  existingGrade: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (grade: number, isRetake: boolean) => void;
}

const GradeEditModal = ({
  student,
  ue,
  existingGrade,
  isOpen,
  onClose,
  onSave,
}: GradeEditModalProps) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [isRetake, setIsRetake] = useState(
    existingGrade?.session === "Reprise"
  );

  useEffect(() => {
    setGrade(existingGrade?.grade?.toString() || "");
    setIsRetake(existingGrade?.session === "Reprise");
  }, [existingGrade, isOpen]);

  const handleSave = () => {
    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      toast.error("La note doit être un nombre entre 0 et 100");
      return;
    }

    onSave(numericGrade, isRetake);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingGrade ? "Modifier la note" : "Ajouter une note"}
          </DialogTitle>
          <DialogDescription>
            {student.firstName} {student.lastName} - {ue.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="grade">Note (/100)</Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Entrez la note"
            />
          </div>

          {existingGrade && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRetake"
                checked={isRetake}
                onChange={(e) => setIsRetake(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRetake" className="text-sm">
                Marquer comme note de reprise
              </Label>
            </div>
          )}

          {existingGrade && (
            <div className="text-sm text-muted-foreground">
              <p>Note actuelle: {existingGrade.grade}/100</p>
              <p>Session: {existingGrade.session}</p>
              <p>Statut: {existingGrade.status}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {existingGrade ? "Modifier" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Interface pour les contrôles en masse
interface BulkControlsProps {
  selectedCount: number;
  bulkGradeValue: string;
  onApplyGrade: (grade: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const BulkControls = ({
  selectedCount,
  bulkGradeValue,
  onApplyGrade,
  onSave,
  onCancel,
}: BulkControlsProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {selectedCount} étudiant(s) sélectionné(s)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="Note (/100)"
          value={bulkGradeValue}
          onChange={(e) => onApplyGrade(e.target.value)}
          className="w-32"
        />
        <Button
          onClick={() => onApplyGrade(bulkGradeValue)}
          disabled={!bulkGradeValue}
        >
          Appliquer
        </Button>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave}>Sauvegarder tout</Button>
      </div>
    </div>
  );
};

export const GradesBulkEditor = () => {
  const { students } = useAcademicStore();
  const { academicYears } = useAcademicYearStore();
  const { faculties } = useFacultyStore();
  const { ues: allUes } = useUEStore();
  const { enrollments } = useEnrollmentStore();
  const { fetchAssignmentsByFaculty } = useCourseAssignmentStore();
  const { addGrade, updateGrade, grades, recalculateStatus, bulkAddGrades } =
    useGradeStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    facultyId: "",
    level: "1",
    academicYearId: "",
    semester: "S1" as "S1" | "S2",
  });

  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [selectedUE, setSelectedUE] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [gradeInputs, setGradeInputs] = useState<{ [key: string]: string }>({});
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    ueId: string;
  } | null>(null);
  const [assignedUEs, setAssignedUEs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkGrades, setBulkGrades] = useState<{ [key: string]: string }>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const selectedAcademicYear = useMemo(() => {
    return academicYears.find((ay) => ay.id === filters.academicYearId);
  }, [filters.academicYearId, academicYears]);

  // Fonction utilitaire pour les logs de débogage
  const debugLog = (message: string, data: any) => {
    console.log(`[DEBUG] ${message}:`, JSON.stringify(data, null, 2));
  };

  // Fonction utilitaire pour les messages d'erreur
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Une erreur inconnue s'est produite";
  };

  // Initialisation des filtres
  useEffect(() => {
    if (faculties.length > 0 && academicYears.length > 0) {
      const currentAcademicYear =
        academicYears.find((ay) => ay.isCurrent) || academicYears[0];
      const defaultFaculty =
        faculties.find((f) => f.status === "Active") || faculties[0];

      if (defaultFaculty && currentAcademicYear) {
        setFilters((prev) => ({
          ...prev,
          facultyId: defaultFaculty.id,
          academicYearId: currentAcademicYear.id,
        }));
        setSelectedFaculty(defaultFaculty);
      }
    }
  }, [faculties, academicYears]);

  // Charger les UE assignées
  useEffect(() => {
    if (filters.facultyId && filters.academicYearId) {
      loadAssignedUEs();
    }
  }, [filters]);

  const loadAssignedUEs = async () => {
    setLoading(true);
    try {
      const assignments = await fetchAssignmentsByFaculty(
        filters.facultyId,
        filters.level,
        filters.academicYearId,
        filters.semester
      );

      const ues = assignments.map((assignment: any) => ({
        ...assignment.ue,
        professor: assignment.professeur,
      }));

      setAssignedUEs(ues);
    } catch (error) {
      console.error("Erreur lors du chargement des UE:", error);
      toast.error("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les étudiants
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.status === "Active" &&
        student.enrollments?.some(
          (enrollment) =>
            enrollment.facultyId === filters.facultyId &&
            enrollment.level === filters.level &&
            enrollment.academicYearId === filters.academicYearId &&
            enrollment.status === "Active"
        )
    );
  }, [students, filters]);

  // Obtenir une note existante
  const getExistingGrade = (studentId: string, ueId: string) => {
    const academicYearObj = academicYears.find(
      (ay) => ay.id === filters.academicYearId
    );
    if (!academicYearObj) return undefined;

    return grades.find(
      (grade) =>
        grade.studentId === studentId &&
        grade.ueId === ueId &&
        grade.academicYearId === academicYearObj.id &&
        grade.semester === filters.semester
    );
  };

  const handleFacultyChange = (facultyId: string) => {
    const faculty = faculties.find((f) => f.id === facultyId);
    setSelectedFaculty(faculty);
    setFilters((prev) => ({ ...prev, facultyId }));
    setSelectedUE(null);
  };

  const handleLevelChange = (level: string) => {
    setFilters((prev) => ({ ...prev, level }));
    setSelectedUE(null);
  };

  // Gérer la sélection/désélection des étudiants
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Sélectionner tous les étudiants
  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  // Appliquer une note à tous les étudiants sélectionnés
  const applyBulkGrade = (gradeValue: string) => {
    const newBulkGrades = { ...bulkGrades };

    selectedStudents.forEach((studentId) => {
      newBulkGrades[studentId] = gradeValue;
    });

    setBulkGrades(newBulkGrades);
  };

  // Sauvegarder toutes les notes en masse
  const saveBulkGrades = async () => {
    if (!selectedUE) {
      toast.error("Veuillez sélectionner une UE");
      return;
    }

    if (!selectedAcademicYear) {
      toast.error("Veuillez sélectionner une année académique");
      return;
    }

    const academicYearValue = selectedAcademicYear.id;
    const uePassingGrade = selectedUE.passingGrade || 10;
    let savedCount = 0;

    try {
      for (const [studentId, gradeValue] of Object.entries(bulkGrades)) {
        if (gradeValue.trim() === "") continue;

        const grade = parseFloat(gradeValue);
        if (isNaN(grade) || grade < 0 || grade > 100) {
          toast.error(`Note invalide pour l'étudiant ${studentId}`);
          continue;
        }

        const existingGrade = getExistingGrade(studentId, selectedUE.id);
        const status = recalculateStatus(grade, uePassingGrade);

        if (existingGrade) {
          await updateGrade(existingGrade.id, {
            grade,
            status,
          });
        } else {
          await addGrade({
            studentId,
            ueId: selectedUE.id,
            grade,
            status,
            session: "Normale",
            semester: filters.semester,
            academicYearId: academicYearValue,
            level: filters.level, // CHAMP AJOUTÉ
          } as any);
        }
        savedCount++;
      }

      if (savedCount > 0) {
        toast.success(`${savedCount} notes sauvegardées avec succès`);
      } else {
        toast.info("Aucune note à sauvegarder");
      }

      setBulkGrades({});
      setBulkEditMode(false);
      setSelectedStudents([]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Erreur lors de la sauvegarde: ${errorMessage}`);
    }
  };

  // Sauvegarder les notes en masse (ancienne méthode)
  const handleBulkSave = () => {
    if (!selectedUE) {
      toast.error("Veuillez sélectionner une UE");
      return;
    }

    if (!selectedAcademicYear) {
      toast.error("Veuillez sélectionner une année académique");
      return;
    }

    const academicYearValue = selectedAcademicYear.id;
    let savedCount = 0;
    const selectedUEData = allUes.find((ue) => ue.id === selectedUE.id);

    Object.entries(gradeInputs).forEach(([studentId, gradeValue]) => {
      if (gradeValue.trim() === "") return;

      const grade = parseFloat(gradeValue);
      if (isNaN(grade) || grade < 0 || grade > 100) {
        toast.error(`Note invalide pour l'étudiant ${studentId}`);
        return;
      }

      const existingGrade = getExistingGrade(studentId, selectedUE.id);
      const status = recalculateStatus(
        grade,
        selectedUEData?.passingGrade || 10
      );

      if (existingGrade) {
        updateGrade(existingGrade.id, {
          grade,
          status,
        });
      } else {
        addGrade({
          studentId,
          ueId: selectedUE.id,
          grade,
          status,
          session: "Normale",
          semester: filters.semester,
          academicYearId: academicYearValue,
          level: filters.level, // CHAMP AJOUTÉ
        } as any);
      }
      savedCount++;
    });

    if (savedCount > 0) {
      toast.success(`${savedCount} notes sauvegardées avec succès`);
    } else {
      toast.info("Aucune note à sauvegarder");
    }

    setGradeInputs({});
    setEditMode(false);
  };

  const getGradeStatus = (studentId: string, ueId: string) => {
    const existingGrade = getExistingGrade(studentId, ueId);
    if (!existingGrade) return null;

    const colors: { [key: string]: string } = {
      Valide: "bg-green-100 text-green-800",
      EnCours: "bg-yellow-100 text-yellow-800",
      AReprendre: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge
        className={colors[existingGrade.status] || "bg-gray-100 text-gray-800"}
      >
        {existingGrade.grade}/100 - {existingGrade.status}
      </Badge>
    );
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      1: "1ère année Licence",
      2: "2ème année Licence",
      3: "3ème année Licence",
      4: "4ème année Licence",
      5: "5ème année Licence",
    };
    return levels[level] || level;
  };

  const handleSaveGrade = async (
    studentId: string,
    ueId: string,
    newGrade: number,
    isRetake: boolean
  ) => {
    try {
      const academicYearId = academicYears.find(
        (ay) => ay.id === filters.academicYearId
      )?.id;
      if (!academicYearId) throw new Error("Année académique non trouvée");

      const existingGrade = getExistingGrade(studentId, ueId);
      const status = recalculateStatus(
        newGrade,
        selectedUE?.passingGrade || 10
      );

      const gradeData = {
        studentId,
        ueId,
        grade: newGrade,
        status,
        session: isRetake ? "Rattrapage" : "Normale",
        semester: filters.semester,
        academicYearId,
        level: filters.level, // CHAMP AJOUTÉ
      };

      debugLog("Données envoyées au backend", gradeData);

      if (existingGrade) {
        await updateGrade(
          existingGrade.id,
          {
            grade: newGrade,
            status,
            session: isRetake ? "Rattrapage" : existingGrade.session,
          },
          isRetake
        );
        toast.success("Note modifiée avec succès");
      } else {
        await addGrade(gradeData as any);
        toast.success("Note ajoutée avec succès");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Erreur détaillée:", error);
      toast.error(`Erreur lors de la sauvegarde: ${errorMessage}`);
    }
  };

  // Fonctions d'import/export
  const handleExportJSON = () => {
    try {
      const dataToExport = grades
        .filter(
          (grade) =>
            (!selectedUE?.id || grade.ueId === selectedUE.id) &&
            (!selectedAcademicYear?.year ||
              grade.academicYearId === selectedAcademicYear.id) &&
            (!filters.semester || grade.semester === filters.semester)
        )
        .map((grade) => {
          const student = students.find((s) => s.id === grade.studentId);
          const ue = allUes.find((u) => u.id === grade.ueId);

          return {
            "Matricule Étudiant": student?.studentId,
            "Nom Étudiant": `${student?.firstName} ${student?.lastName}`,
            "Code UE": ue?.code,
            "Nom UE": ue?.title,
            Note: grade.grade,
            Statut: grade.status,
            Session: grade.session,
            Semestre: grade.semester,
            "Année Académique": grade.academicYearId,
            "UE ID": grade.ueId,
            "Student ID": grade.studentId,
          };
        });

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `notes-${new Date().toISOString().split("T")[0]}.json`);
      toast.success("Export JSON réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export JSON");
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = grades
        .filter(
          (grade) =>
            (!selectedUE?.id || grade.ueId === selectedUE.id) &&
            (!selectedAcademicYear?.year ||
              grade.academicYearId === selectedAcademicYear.id) &&
            (!filters.semester || grade.semester === filters.semester)
        )
        .map((grade) => {
          const student = students.find((s) => s.id === grade.studentId);
          const ue = allUes.find((u) => u.id === grade.ueId);

          return {
            Matricule: student?.studentId,
            Nom: student?.firstName,
            Prénom: student?.lastName,
            "Code UE": ue?.code,
            UE: ue?.title,
            Note: grade.grade,
            Statut: grade.status,
            Session: grade.session,
            Semestre: grade.semester,
            Année: grade.academicYearId,
            level: grade.level,
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
      saveAs(blob, `notes-${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Export Excel réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export Excel");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result;

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content as string);
          await processImportedData(data);
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const workbook = XLSX.read(content, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          await processImportedData(data);
        }

        toast.success("Import réussi");
      } catch (error) {
        console.error("Erreur import:", error);
        toast.error("Erreur lors de l'import");
      }
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
    const gradesToAdd: any[] = [];
    const gradesToUpdate: any[] = [];

    for (const item of data) {
      try {
        const student = students.find(
          (s) =>
            s.studentId === item["Matricule Étudiant"] ||
            s.studentId === item["Matricule"] ||
            s.id === item["Student ID"]
        );

        const ue = allUes.find(
          (u) => u.code === item["Code UE"] || u.id === item["UE ID"]
        );

        if (!student || !ue) {
          console.warn("Étudiant ou UE non trouvé:", item);
          continue;
        }

        const gradeData = {
          studentId: student.id,
          ueId: ue.id,
          grade: Number(item["Note"]),
          status: item["Statut"] || "Non validé",
          session: item["Session"] || "Normale",
          semester: item["Semestre"] || filters.semester || "S1",
          academicYear:
            item["Année Académique"] ||
            item["Année"] ||
            selectedAcademicYear?.year ||
            new Date().getFullYear().toString(),
          level: filters.level, // CHAMP AJOUTÉ
        };

        const existingGrade = grades.find(
          (g) =>
            g.studentId === student.id &&
            g.ueId === ue.id &&
            g.academicYearId === gradeData.academicYear.id &&
            g.semester === gradeData.semester
        );

        if (existingGrade) {
          gradesToUpdate.push({
            id: existingGrade.id,
            ...gradeData,
          });
        } else {
          gradesToAdd.push(gradeData);
        }
      } catch (error) {
        console.error("Erreur traitement ligne:", item, error);
      }
    }

    if (gradesToAdd.length > 0) {
      await bulkAddGrades(gradesToAdd as any[]);
    }

    for (const grade of gradesToUpdate) {
      await updateGrade(grade.id, grade);
    }

    toast.success(
      `${gradesToAdd.length} notes ajoutées, ${gradesToUpdate.length} notes mises à jour`
    );
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const template = [
      {
        "Matricule Étudiant": "STU20250001",
        "Code UE": "MATH101",
        Note: 15.5,
        Session: "Normale",
        Semestre: "S1",
        "Année Académique": "2024-2025",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "template-import-notes.xlsx");

    toast.info("Template téléchargé");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header avec import/export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Édition en Masse des Notes</h1>
          <p className="text-muted-foreground">
            Gestion des notes par faculté, niveau et année académique
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json,.xlsx,.xls"
            className="hidden"
          />

          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>

          <Button variant="outline" onClick={handleExportJSON}>
            <FileText className="h-4 w-4 mr-2" />
            JSON
          </Button>

          <Button variant="outline" onClick={handleExportExcel}>
            <Table className="h-4 w-4 mr-2" />
            Excel
          </Button>

          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtres</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Faculté */}
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculté</Label>
              <Select
                value={filters.facultyId}
                onValueChange={handleFacultyChange}
              >
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Sélectionner une faculté" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau */}
            <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Select value={filters.level} onValueChange={handleLevelChange}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1ère année Licence</SelectItem>
                  <SelectItem value="2">2ème année Licence</SelectItem>
                  <SelectItem value="3">3ème année Licence</SelectItem>
                  <SelectItem value="4">4ème année Licence</SelectItem>
                  <SelectItem value="5">5ème année Licence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Année académique */}
            <div className="space-y-2">
              <Label htmlFor="academicYear">Année académique</Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, academicYearId: value }))
                }
              >
                <SelectTrigger id="academicYear">
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

            {/* Semestre */}
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Select
                value={filters.semester}
                onValueChange={(value: "S1" | "S2") =>
                  setFilters((prev) => ({ ...prev, semester: value }))
                }
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UE à évaluer */}
      <Card>
        <CardHeader>
          <CardTitle>UE à évaluer</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Chargement des cours...</p>
            </div>
          ) : assignedUEs.length > 0 ? (
            <Select
              value={selectedUE?.id || ""}
              onValueChange={(value) => {
                const ue = assignedUEs.find((u) => u.id === value);
                setSelectedUE(ue);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une UE" />
              </SelectTrigger>
              <SelectContent>
                {assignedUEs.map((ue) => (
                  <SelectItem key={ue.id} value={ue.id}>
                    {ue.code} - {ue.title} ({ue.professor?.firstName}{" "}
                    {ue.professor?.lastName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <BookOpen className="h-12 w-12 mx-auto mb-2" />
              <p>Aucun cours assigné pour ces critères</p>
              <p className="text-sm">
                Veuillez sélectionner une autre faculté, niveau ou semestre
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {selectedAcademicYear?.year || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Année académique
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredStudents.length}</p>
                <p className="text-sm text-muted-foreground">
                  Étudiants inscrits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{assignedUEs.length}</p>
                <p className="text-sm text-muted-foreground">Cours assignés</p>
                <p className="text-xs text-muted-foreground">
                  {filters.semester === "S1" ? "Semestre 1" : "Semestre 2"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {selectedUE
                    ? filteredStudents.filter((s) =>
                        getExistingGrade(s.id, selectedUE.id)
                      ).length
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Notes existantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Informations sur la sélection */}
      {selectedFaculty && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="self-start">
                {filters.level.startsWith("L") ? "LICENCE" : "MASTER"}
              </Badge>
              <h2 className="text-2xl font-bold text-primary">
                {selectedFaculty.name}
              </h2>
              <p className="text-muted-foreground">
                {selectedFaculty.description || "Faculté"}
              </p>
              <div className="flex items-center gap-8 mt-4 flex-wrap">
                <div>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="font-semibold">
                    {getLevelLabel(filters.level)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Semestre</p>
                  <p className="font-semibold">
                    {filters.semester === "S1" ? "Semestre 1" : "Semestre 2"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Année</p>
                  <p className="font-semibold">
                    {selectedAcademicYear?.year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                  <p className="font-semibold">{filteredStudents.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedUE && filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Notes - {selectedUE.title}
                <Badge className="ml-2" variant="secondary">
                  {filters.semester == "S1" ? "Session 1" : "Session 2"}
                </Badge>
              </CardTitle>

              {!bulkEditMode ? (
                <Button onClick={() => setBulkEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Édition en masse
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={selectAllStudents}>
                    {selectedStudents.length === filteredStudents.length
                      ? "Tout désélectionner"
                      : "Tout sélectionner"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBulkEditMode(false);
                      setSelectedStudents([]);
                      setBulkGrades({});
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Contrôles d'édition en masse */}
            {bulkEditMode && (
              <BulkControls
                selectedCount={selectedStudents.length}
                bulkGradeValue={Object.values(bulkGrades)[0] || ""}
                onApplyGrade={applyBulkGrade}
                onSave={saveBulkGrades}
                onCancel={() => {
                  setBulkEditMode(false);
                  setSelectedStudents([]);
                  setBulkGrades({});
                }}
              />
            )}

            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const existingGrade = getExistingGrade(
                  student.id,
                  selectedUE.id
                );
                const isSelected = selectedStudents.includes(student.id);
                const bulkGradeValue = bulkGrades[student.id] || "";

                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      isSelected ? "bg-blue-50 border-blue-300" : ""
                    }`}
                  >
                    {/* Checkbox pour la sélection en masse */}
                    {bulkEditMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}

                    <div className="flex-1 ml-3">
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {bulkEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Note (/100)"
                          value={bulkGradeValue}
                          onChange={(e) =>
                            setBulkGrades((prev) => ({
                              ...prev,
                              [student.id]: e.target.value,
                            }))
                          }
                          className="w-24"
                        />
                      ) : existingGrade ? (
                        <div className="text-right">
                          <Badge
                            className={
                              existingGrade.status === "Valide"
                                ? "bg-green-100 text-green-800"
                                : existingGrade.status === "AReprendre"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {existingGrade.grade}/100 - {existingGrade.status}
                            {existingGrade.session === "Rattrapage" &&
                              " (Reprise)"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Session: {existingGrade.session}
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline">Non évalué</Badge>
                      )}

                      {!bulkEditMode && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setEditingGrade({
                              studentId: student.id,
                              ueId: selectedUE.id,
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Tableau des notes amélioré */}
      {/* {selectedUE && filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Notes - {selectedUE.title}
              <Badge className="ml-2" variant="secondary">
                {filters.semester}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const existingGrade = getExistingGrade(
                  student.id,
                  selectedUE.id
                );

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {existingGrade ? (
                        <div className="text-right">
                          <Badge
                            className={
                              existingGrade.status === "Validé"
                                ? "bg-green-100 text-green-800"
                                : existingGrade.status === "À reprendre"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {existingGrade.grade}/100 - {existingGrade.status}
                            {existingGrade.session === "Reprise" &&
                              " (Reprise)"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Session: {existingGrade.session}
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline">Non évalué</Badge>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingGrade({
                            studentId: student.id,
                            ueId: selectedUE.id,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )} */}
      {/* Modal d'édition */}
      {editingGrade && selectedUE && (
        <GradeEditModal
          student={students.find((s) => s.id === editingGrade.studentId)}
          ue={selectedUE}
          existingGrade={getExistingGrade(
            editingGrade.studentId,
            editingGrade.ueId
          )}
          isOpen={!!editingGrade}
          onClose={() => setEditingGrade(null)}
          onSave={(grade, isRetake) =>
            handleSaveGrade(
              editingGrade.studentId,
              editingGrade.ueId,
              grade,
              isRetake
            )
          }
        />
      )}
    </div>
  );
};
