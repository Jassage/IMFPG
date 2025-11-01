import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  Printer,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  User,
  Hash,
  Building,
  Layers,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAcademicStore } from "../store/studentStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useFacultyStore } from "@/store/facultyStore";
import { useGradeStore } from "@/store/gradeStore";
import { useUEStore } from "@/store/courseStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DocumentConfig, DocumentData, DocumentType } from "@/types/academic";
import { toast } from "sonner";

// Configuration des documents disponibles
const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
  transcript: {
    type: "transcript",
    title: "Bulletin de Notes",
    description: "Document détaillé avec toutes les notes par semestre",
    icon: <FileText className="h-5 w-5" />,
    requiredFields: ["grades", "academicYear", "faculty"],
  },
  "grade-report": {
    type: "grade-report",
    title: "Relevé de Notes",
    description: "Relevé officiel des notes obtenues",
    icon: <BarChart3 className="h-5 w-5" />,
    requiredFields: ["grades", "academicYear"],
  },
  "level-certificate": {
    type: "level-certificate",
    title: "Attestation de Niveau",
    description: "Certificat attestant du niveau académique atteint",
    icon: <Layers className="h-5 w-5" />,
    requiredFields: ["level", "academicYear"],
  },
  "completion-certificate": {
    type: "completion-certificate",
    title: "Attestation de Fin d'Études",
    description: "Atteste de la réussite complète du programme",
    icon: <GraduationCap className="h-5 w-5" />,
    requiredFields: ["grades", "level", "academicYear"],
  },
  "diploma-certificate": {
    type: "diploma-certificate",
    title: "Certificat de Diplôme",
    description: "Certificat officiel de délivrance du diplôme",
    icon: <Award className="h-5 w-5" />,
    requiredFields: ["grades", "level", "academicYear"],
  },
};

// Configuration des responsables par faculté
const FACULTY_SIGNATORIES: Record<string, { dean: string; secretary: string }> =
  {
    "Sciences Agronomiques": {
      dean: "Spenson NOEL, MBA",
      secretary: "Ducken ULYSSE",
    },
    "Sciences Administratives": {
      dean: "Dr. Jean DUPONT",
      secretary: "Marie LAURENT",
    },
    "Sciences Économiques": {
      dean: "Prof. Marc AUBERT",
      secretary: "Sophie MARTIN",
    },
    "Sciences Informatiques": {
      dean: "Dr. Pierre DURAND",
      secretary: "Lucie BERNARD",
    },
  };

// Fonction pour obtenir les signataires
const getSignatories = (facultyName: string) => {
  return (
    FACULTY_SIGNATORIES[facultyName] || {
      dean: "Spenson NOEL, MBA",
      secretary: "Ducken ULYSSE",
    }
  );
};

// Interface pour les données de résumé
interface SummaryData {
  totalCoefficients: number;
  totalNotes: number;
  moyenne: number;
  totalSubjects: number;
}

export const TranscriptGenerator = () => {
  const { students, fetchStudents } = useAcademicStore();
  const { grades, fetchGrades } = useGradeStore();
  const { ues, fetchUEs } = useUEStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { faculties, fetchFaculties } = useFacultyStore();

  // États principaux
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSessions, setExpandedSessions] = useState<
    Record<string, boolean>
  >({
    S1: true,
    S2: true,
  });
  const [filters, setFilters] = useState({
    facultyId: "all",
    level: "all",
    academicYearId: "all",
    semester: "all" as "S1" | "S2" | "all",
  });
  const [status, setStatus] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentType>("transcript");
  const [documentHistory, setDocumentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchGrades(),
          fetchUEs(),
          fetchAcademicYears(),
          fetchFaculties(),
        ]);
        toast.success("Données chargées avec succès");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrage des étudiants
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    let result = students.filter(
      (student) =>
        student.status === "Active" &&
        student.enrollments?.some(
          (enrollment) =>
            (filters.facultyId === "all" ||
              enrollment.facultyId === filters.facultyId) &&
            (filters.level === "all" || enrollment.level === filters.level) &&
            (filters.academicYearId === "all" ||
              enrollment.academicYearId === filters.academicYearId)
        )
    );

    // Appliquer le filtre de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (student) =>
          student.firstName?.toLowerCase().includes(term) ||
          student.lastName?.toLowerCase().includes(term) ||
          student.studentId?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [students, filters, searchTerm]);

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  // Gestion des changements de filtres
  const handleFacultyChange = useCallback((facultyId: string) => {
    setFilters((prev) => ({ ...prev, facultyId }));
  }, []);

  const handleLevelChange = useCallback((level: string) => {
    setFilters((prev) => ({ ...prev, level }));
  }, []);

  // Obtenir toutes les notes de l'étudiant pour l'année sélectionnée
  const getStudentGrades = useCallback(() => {
    if (!selectedStudent || !grades || grades.length === 0) return [];

    let filteredGrades = grades.filter(
      (grade) =>
        grade.studentId === selectedStudent &&
        grade.isActive === true &&
        (filters.academicYearId === "all" ||
          grade.academicYearId === filters.academicYearId)
    );

    // Filtrer par semestre si spécifié
    if (filters.semester !== "all") {
      filteredGrades = filteredGrades.filter(
        (grade) => grade.semester === filters.semester
      );
    }

    return filteredGrades;
  }, [selectedStudent, grades, filters.academicYearId, filters.semester]);

  const getUEDetails = useCallback(
    (ueId: string) => {
      return ues.find((ue) => ue.id === ueId);
    },
    [ues]
  );

  // Calculs académiques
  const calculateSessionGPA = useCallback(
    (gradesList: any[], semester: string) => {
      const sessionGrades = gradesList.filter(
        (grade) => grade.semester === semester && grade.isActive === true
      );
      if (sessionGrades.length === 0) return 0;

      let totalPoints = 0;
      let totalCredits = 0;

      sessionGrades.forEach((grade) => {
        const ue = getUEDetails(grade.ueId);
        if (ue) {
          totalPoints += grade.grade * ue.credits;
          totalCredits += ue.credits;
        }
      });

      return totalCredits > 0 ? totalPoints / totalCredits : 0;
    },
    [getUEDetails]
  );

  const calculateAnnualGPA = useCallback(
    (gradesList: any[]) => {
      if (!gradesList || gradesList.length === 0) return 0;

      let totalPoints = 0;
      let totalCredits = 0;

      gradesList.forEach((grade) => {
        const ue = getUEDetails(grade.ueId);
        if (ue) {
          totalPoints += grade.grade * ue.credits;
          totalCredits += ue.credits;
        }
      });

      return totalCredits > 0 ? totalPoints / totalCredits : 0;
    },
    [getUEDetails]
  );

  const calculateSessionCredits = useCallback(
    (gradesList: any[], semester: string) => {
      const sessionGrades = gradesList.filter(
        (grade) => grade.semester === semester && grade.isActive === true
      );
      let totalCredits = 0;

      sessionGrades.forEach((grade) => {
        if (grade.status === "Valid_") {
          const ue = getUEDetails(grade.ueId);
          if (ue) totalCredits += ue.credits;
        }
      });

      return totalCredits;
    },
    [getUEDetails]
  );

  const calculateSessionTotalCredits = useCallback(
    (gradesList: any[], semester: string) => {
      const sessionGrades = gradesList.filter(
        (grade) => grade.semester === semester && grade.isActive === true
      );
      return sessionGrades.reduce((total, grade) => {
        const ue = getUEDetails(grade.ueId);
        return total + (ue?.credits || 0);
      }, 0);
    },
    [getUEDetails]
  );

  const calculateAnnualCredits = useCallback(
    (gradesList: any[]) => {
      if (!gradesList) return 0;
      let totalCredits = 0;
      gradesList.forEach((grade) => {
        if (grade.status === "Valid_" && grade.isActive === true) {
          const ue = getUEDetails(grade.ueId);
          if (ue) totalCredits += ue.credits;
        }
      });
      return totalCredits;
    },
    [getUEDetails]
  );

  const calculateTotalGrades = useCallback((gradesList: any[]) => {
    if (!gradesList || gradesList.length === 0) return 0;
    return gradesList.reduce((total, grade) => {
      if (grade.isActive === true) {
        return total + grade.grade;
      }
      return total;
    }, 0);
  }, []);

  const calculateTotalSubjects = useCallback((gradesList: any[]) => {
    if (!gradesList) return 0;
    return gradesList.filter((grade) => grade.isActive === true).length;
  }, []);

  const getMention = useCallback((gpa: number) => {
    if (gpa >= 16) return "Très Bien";
    if (gpa >= 14) return "Bien";
    if (gpa >= 12) return "Assez Bien";
    if (gpa >= 10) return "Passable";
    return "Insuffisant";
  }, []);

  // Données calculées
  const studentGrades = getStudentGrades();
  const annualGPA = calculateAnnualGPA(studentGrades);
  const annualCredits = calculateAnnualCredits(studentGrades);
  const totalAnnualCredits = studentGrades.reduce((total, grade) => {
    const ue = getUEDetails(grade.ueId);
    return total + (ue?.credits || 0);
  }, 0);
  const totalGrades = calculateTotalGrades(studentGrades);
  const totalSubjects = calculateTotalSubjects(studentGrades);

  // Calculs pour chaque session
  const session1GPA = calculateSessionGPA(studentGrades, "S1");
  const session2GPA = calculateSessionGPA(studentGrades, "S2");
  const session1Credits = calculateSessionCredits(studentGrades, "S1");
  const session2Credits = calculateSessionCredits(studentGrades, "S2");
  const session1TotalCredits = calculateSessionTotalCredits(
    studentGrades,
    "S1"
  );
  const session2TotalCredits = calculateSessionTotalCredits(
    studentGrades,
    "S2"
  );

  // Filtrer les notes par session
  const session1Grades = studentGrades.filter(
    (grade) => grade.semester === "S1"
  );
  const session2Grades = studentGrades.filter(
    (grade) => grade.semester === "S2"
  );

  const showStatus = (message: string, type: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  // Configuration PDF
  const PDF_CONFIG = {
    colors: {
      primary: [52, 152, 219] as [number, number, number],
      text: [0, 0, 0] as [number, number, number],
      red: [255, 0, 0] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      lightGray: [240, 240, 240] as [number, number, number],
      watermark: [100, 100, 100] as [number, number, number],
    },
    margins: {
      left: 10,
      right: 10,
      top: 15,
      bottom: 20,
    },
    font: {
      family: "Times New Roman",
      sizes: {
        xlarge: 16,
        large: 14,
        medium: 12,
        small: 10,
        xsmall: 8,
        watermark: 40,
      },
    },
    page: {
      width: 215,
      height: 279.4,
      footerStart: 260,
    },
  };

  // Fonction pour calculer les dates d'inscription
  const calculateEnrollmentDates = async (studentId: string) => {
    try {
      // En attendant l'implémentation réelle, retourner des valeurs par défaut
      return {
        startDate: "janvier 2021",
        endDate: "octobre 2025",
      };
    } catch (error) {
      console.error("Erreur calcul dates inscription:", error);
      return {
        startDate: "janvier 2021",
        endDate: "octobre 2025",
      };
    }
  };

  // Fonctions utilitaires
  const toggleSession = useCallback((session: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [session]: !prev[session],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setSelectedStudent("");
    setFilters({
      facultyId: "all",
      level: "all",
      academicYearId: "all",
      semester: "all",
    });
    setSearchTerm("");
    setSelectedDocument("transcript");
    toast.success("Formulaire réinitialisé");
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchGrades(),
        fetchUEs(),
        fetchAcademicYears(),
        fetchFaculties(),
      ]);
      toast.success("Données actualisées");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation des données");
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchStudents,
    fetchGrades,
    fetchUEs,
    fetchAcademicYears,
    fetchFaculties,
  ]);

  // Validation des données pour l'export
  const validateExportData = useCallback((): boolean => {
    const errors: string[] = [];

    if (!selectedStudentData) errors.push("Aucun étudiant sélectionné");
    if (!studentGrades || studentGrades.length === 0)
      errors.push("Aucune note disponible");
    if (!filters.academicYearId || filters.academicYearId === "all")
      errors.push("Année académique non spécifiée");
    if (!filters.facultyId || filters.facultyId === "all")
      errors.push("Faculté non spécifiée");

    if (errors.length > 0) {
      toast.error(`Données manquantes: ${errors.join(", ")}`);
      return false;
    }

    return true;
  }, [
    selectedStudentData,
    studentGrades,
    filters.academicYearId,
    filters.facultyId,
  ]);

  // Fonctions PDF améliorées
  const createHeaderSection = (doc: jsPDF): number => {
    const { colors, font } = PDF_CONFIG;

    // Rectangle d'en-tête
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 35, "F");

    // Logo
    try {
      const logoImg = new Image();
      logoImg.src = "/logo.png";
      doc.addImage(logoImg, "PNG", 15, 8, 20, 22);
      doc.addImage(logoImg, "PNG", 175, 8, 20, 22);
    } catch (error) {
      console.warn("Logo non trouvé, continuation sans logo");
    }

    // Titre de l'université
    doc.setFontSize(font.sizes.xlarge);
    doc.setTextColor(...colors.white);
    doc.setFont(font.family, "bold");
    doc.text("UNIVERSITÉ JÉRUSALEM DE PIGNON D'HAÏTI", 105, 15, {
      align: "center",
    });

    // Sigle
    doc.setFontSize(font.sizes.large);
    doc.text("UJEPH", 105, 22, { align: "center" });

    // Coordonnées
    doc.setFontSize(font.sizes.medium);
    doc.text("83, Rue de l'Université Jérusalem, Pignon, Haïti", 105, 28, {
      align: "center",
    });
    doc.text(
      "E-mail : info@ujeph.edu.ht | Téls : +509 4289-9225 / 3620-3021",
      105,
      32,
      { align: "center" }
    );

    // Barre de séparation
    doc.setDrawColor(...colors.text);
    doc.setLineWidth(0.5);
    doc.line(10, 36, 200, 36);

    // IMPORTANT : Remettre la couleur du texte à noir pour le contenu suivant
    doc.setTextColor(...colors.text);

    return 45;
  };

  const createStudentInfoSection = (doc: jsPDF, startY: number): number => {
    const { colors, font } = PDF_CONFIG;
    const academicYear =
      academicYears.find((y) => y.id === filters.academicYearId)?.year ||
      "2024-2025";
    const facultyName =
      faculties.find((f) => f.id === filters.facultyId)?.name || "Non spécifié";

    // Titre du bulletin
    doc.setFontSize(font.sizes.large);
    doc.setTextColor(...colors.text);
    doc.setFont(font.family, "bold");
    doc.text(`BULLETIN DE NOTES OFFICIEL - ${academicYear}`, 105, startY, {
      align: "center",
    });

    // Encadré informations étudiant
    doc.setFillColor(...colors.lightGray);
    doc.rect(15, startY + 7, 180, 21, "F");
    doc.setDrawColor(...colors.text);
    doc.rect(15, startY + 7, 180, 21, "S");

    doc.setFontSize(font.sizes.medium);
    doc.setFont(font.family, "bold");

    // Informations gauche
    doc.text(
      `Étudiant: ${selectedStudentData?.firstName} ${selectedStudentData?.lastName}`,
      20,
      startY + 12
    );
    doc.text(`Matricule: ${selectedStudentData?.studentId}`, 20, startY + 17);
    doc.text(`Faculté: ${facultyName}`, 20, startY + 23);

    // Informations droite
    doc.text(`Niveau: ${filters.level}`, 110, startY + 12);
    doc.text(`Année: ${academicYear}`, 110, startY + 17);
    doc.text(
      `Semestre: ${
        filters.semester === "S1"
          ? "1"
          : filters.semester === "S2"
          ? "2"
          : "1 et 2"
      }`,
      110,
      startY + 23
    );

    return startY + 30;
  };

  const getOldGrade = useCallback(
    (studentId: string, ueId: string, semester: string) => {
      const oldGrade = grades.find(
        (grade) =>
          grade.studentId === studentId &&
          grade.ueId === ueId &&
          grade.semester === semester &&
          grade.session === "Normale" &&
          grade.isActive === false
      );
      return oldGrade?.grade || null;
    },
    [grades]
  );

  const prepareTableData = (grades: any[], fontSize: number = 8): any[] => {
    const { colors } = PDF_CONFIG;

    return grades.map((grade, index) => {
      const ue = getUEDetails(grade.ueId);

      // Formater la note sans zéros inutiles après la virgule
      const formatGrade = (gradeValue: number): string => {
        if (gradeValue % 1 === 0) {
          return gradeValue.toFixed(0);
        } else {
          return gradeValue.toFixed(2).replace(/\.?0+$/, "");
        }
      };

      let noteDisplay = formatGrade(grade.grade);
      if (grade.session === "Reprise") {
        noteDisplay = `${formatGrade(grade.grade)} R`; // Juste "R" pour reprise
      }

      // Tronquer les noms de matières si nécessaire
      let subjectName = ue?.title || "Matière inconnue";
      const maxLength = fontSize <= 7 ? 45 : 50;
      if (subjectName.length > maxLength) {
        subjectName = subjectName.substring(0, maxLength - 3) + "...";
      }

      return [(index + 1).toString(), subjectName, noteDisplay];
    });
  };

  const checkPageBreak = (
    doc: jsPDF,
    currentY: number,
    spaceNeeded: number = 50
  ): number => {
    if (currentY + spaceNeeded > PDF_CONFIG.page.footerStart) {
      doc.addPage();
      return PDF_CONFIG.margins.top;
    }
    return currentY;
  };

  const createGradesTables = (doc: jsPDF, startY: number): number => {
    const { colors, font } = PDF_CONFIG;
    let currentY = startY;

    // Calculer le nombre total de matières
    let totalSubjects = 0;
    if (filters.semester === "all") {
      totalSubjects = session1Grades.length + session2Grades.length;
    } else {
      totalSubjects = studentGrades.filter(
        (grade) => grade.semester === filters.semester
      ).length;
    }

    // Ajuster la configuration de police selon le nombre de matières
    const getFontSizeConfig = (subjectCount: number) => {
      if (subjectCount <= 12) {
        return {
          head: 11,
          body: 10,
          minCellHeight: 7,
          cellPadding: 2,
          lineWidth: 0.5,
        };
      } else if (subjectCount <= 20) {
        return {
          head: 9,
          body: 9,
          minCellHeight: 6,
          cellPadding: 1.5,
          lineWidth: 0.5,
        };
      } else {
        return {
          head: 8,
          body: 8,
          minCellHeight: 5,
          cellPadding: 1.5,
          lineWidth: 0.5,
        };
      }
    };

    const fontSizeConfig = getFontSizeConfig(totalSubjects);
    currentY = checkPageBreak(doc, currentY, 120);

    // Fonction pour formater les moyennes sans zéros inutiles
    const formatAverage = (average: number): string => {
      if (average % 1 === 0) {
        return average.toFixed(0);
      } else {
        return average.toFixed(2).replace(/\.?0+$/, "");
      }
    };

    if (filters.semester === "all") {
      const session1Data = prepareTableData(
        session1Grades,
        fontSizeConfig.body
      );
      const session2Data = prepareTableData(
        session2Grades,
        fontSizeConfig.body
      );

      // === SEMESTRE 1 - Tableau plus compact ===
      doc.setFontSize(font.sizes.small);
      doc.setFont(font.family, "bold");
      doc.text("1er SEMESTRE", 55, currentY + 2, { align: "center" });

      autoTable(doc, {
        startY: currentY + 4,
        head: [["No", "Matières", "Notes"]],
        body: session1Data,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: fontSizeConfig.head,
        },
        bodyStyles: {
          fontSize: fontSizeConfig.body,
          minCellHeight: fontSizeConfig.minCellHeight,
        },
        styles: {
          fontSize: fontSizeConfig.body,
          cellPadding: fontSizeConfig.cellPadding,
          overflow: "linebreak",
          lineWidth: fontSizeConfig.lineWidth,
        },
        margin: { left: 15 },
        tableWidth: 85,
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 52 },
          2: {
            cellWidth: 15,
            fontStyle: "bold",
          },
        },
        willDrawCell: (data: any) => {
          if (data.section === "body" && data.column.index === 2) {
            const rowIndex = data.row.index;
            const grade = session1Grades[rowIndex];
            const ue = getUEDetails(grade.ueId);

            if (grade.grade < (ue?.passingGrade || 70)) {
              doc.setTextColor(colors.red[0], colors.red[1], colors.red[2]);
            } else {
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            }
          }
        },
        didDrawCell: (data: any) => {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        },
      });

      let sem1FinalY = (doc as any).lastAutoTable.finalY;

      // === SEMESTRE 2 - Tableau plus compact ===
      doc.setFontSize(font.sizes.small);
      doc.setFont(font.family, "bold");
      doc.text("2e SEMESTRE", 155, currentY + 2, { align: "center" });

      autoTable(doc, {
        startY: currentY + 3,
        head: [["No", "Matières", "Notes"]],
        body: session2Data,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: fontSizeConfig.head,
        },
        bodyStyles: {
          fontSize: fontSizeConfig.body,
          minCellHeight: fontSizeConfig.minCellHeight,
        },
        styles: {
          fontSize: fontSizeConfig.body,
          cellPadding: fontSizeConfig.cellPadding,
          overflow: "linebreak",
          lineWidth: fontSizeConfig.lineWidth,
        },
        margin: { left: 110 },
        tableWidth: 85,
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 52 },
          2: {
            cellWidth: 15,
            fontStyle: "bold",
          },
        },
        willDrawCell: (data: any) => {
          if (data.section === "body" && data.column.index === 2) {
            const rowIndex = data.row.index;
            const grade = session2Grades[rowIndex];
            const ue = getUEDetails(grade.ueId);

            if (grade.grade < (ue?.passingGrade || 70)) {
              doc.setTextColor(colors.red[0], colors.red[1], colors.red[2]);
            } else {
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            }
          }
        },
        didDrawCell: (data: any) => {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        },
      });

      let sem2FinalY = (doc as any).lastAutoTable.finalY;

      // === TOTAUX COMPACTS ===
      const totalsStartY = Math.max(sem1FinalY, sem2FinalY) + 8;

      // Calculs des statistiques
      const session1Stats = calculateSummaryData(session1Grades);
      const session2Stats = calculateSummaryData(session2Grades);
      const totalStats = calculateSummaryData(studentGrades);

      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(15, totalsStartY, 195, totalsStartY);

      // Totaux sur une seule ligne pour économiser l'espace
      const totalY = totalsStartY + 8;

      const legendsY = totalsStartY + 3;
      doc.setFont(font.family, "bold");
      doc.setFontSize(font.sizes.xsmall - 1);
      // Légende pour "R" à gauche
      doc.text("R: Repris", 20, legendsY);

      // Légende pour la note de passage au centre
      doc.text("Moyenne Acceptable: 70%", 60, legendsY, { align: "center" });
      doc.text("S1 :1er Semestre", 105, legendsY, { align: "center" });
      doc.text("S2: 2e Semestre", 170, legendsY, { align: "center" });

      doc.setFontSize(font.sizes.small);

      // Semestre 1 - Format compact
      doc.setFont(font.family, "bold");
      doc.text("S1:", 20, totalY);
      doc.setFont(font.family, "normal");

      doc.text(`Pts:${formatAverage(session1Stats.totalNotes)}`, 35, totalY);
      doc.text(`Moy:${formatAverage(session1Stats.moyenne)}%`, 50, totalY);

      // Semestre 2 - Format compact
      doc.setFont(font.family, "bold");
      doc.text("S2:", 90, totalY);
      doc.setFont(font.family, "normal");
      doc.text(`Pts:${formatAverage(session2Stats.totalNotes)}`, 105, totalY);
      doc.text(`Moy:${formatAverage(session2Stats.moyenne)}%`, 120, totalY);

      // Total Annuel - Format compact
      doc.setFont(font.family, "bold");
      doc.text("TOTAL:", 150, totalY);
      doc.setFont(font.family, "normal");
      doc.text(`Pts:${formatAverage(totalStats.totalNotes)}`, 165, totalY);
      doc.text(`Moy:${formatAverage(annualGPA)}%`, 185, totalY);

      currentY = totalY + 12;
    } else {
      // Un seul semestre - Optimisé pour l'espace
      const semesterGrades = studentGrades.filter(
        (grade) => grade.semester === filters.semester
      );
      const tableData = prepareTableData(semesterGrades, fontSizeConfig.body);

      const semesterTitle =
        filters.semester === "S1" ? "SEMESTRE 1" : "SEMESTRE 2";
      doc.setFontSize(font.sizes.small);
      doc.setFont(font.family, "bold");
      doc.text(semesterTitle, 105, currentY + 2, { align: "center" });

      // Ajuster la largeur des colonnes pour optimiser l'espace
      const columnWidths =
        totalSubjects > 20
          ? { no: 12, matieres: 148, notes: 20 }
          : { no: 15, matieres: 145, notes: 20 };

      autoTable(doc, {
        startY: currentY + 4,
        head: [["No", "Matières", "Notes"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: fontSizeConfig.head,
        },
        bodyStyles: {
          fontSize: fontSizeConfig.body,
          minCellHeight: fontSizeConfig.minCellHeight,
        },
        styles: {
          fontSize: fontSizeConfig.body,
          cellPadding: fontSizeConfig.cellPadding,
          lineWidth: fontSizeConfig.lineWidth,
        },
        margin: { left: 15, right: 10 },
        tableWidth: 190,
        columnStyles: {
          0: { cellWidth: columnWidths.no },
          1: { cellWidth: columnWidths.matieres },
          2: {
            cellWidth: columnWidths.notes,
            fontStyle: "bold",
          },
        },
        willDrawCell: (data: any) => {
          if (data.section === "body" && data.column.index === 2) {
            const rowIndex = data.row.index;
            const grade = semesterGrades[rowIndex];
            const ue = getUEDetails(grade.ueId);

            if (grade.grade < (ue?.passingGrade || 70)) {
              doc.setTextColor(colors.red[0], colors.red[1], colors.red[2]);
            } else {
              doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            }
          }
        },
        didDrawCell: (data: any) => {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        },
      });

      let semesterFinalY = (doc as any).lastAutoTable.finalY;

      // === TOTAUX COMPACTS POUR UN SEUL SEMESTRE ===
      const totalsStartY = semesterFinalY + 6;
      const semesterStats = calculateSummaryData(semesterGrades);

      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(15, totalsStartY, 195, totalsStartY);

      // Totaux sur une ligne
      const totalY = totalsStartY + 6;

      doc.setFontSize(font.sizes.medium);
      doc.setFont(font.family, "bold");
      doc.text(`${filters.semester} - TOTAL:`, 80, totalY);

      doc.setFont(font.family, "normal");
      doc.text(
        `Points: ${formatAverage(semesterStats.totalNotes)}`,
        110,
        totalY
      );
      doc.text(
        `Moyenne: ${formatAverage(semesterStats.moyenne)}%`,
        150,
        totalY
      );

      currentY = totalY + 10;
    }

    return currentY;
  };
  const calculateSummaryData = (grades: any[]): SummaryData => {
    const totalSubjects = grades.length;
    const totalCoefficients = totalSubjects * 100;
    const totalNotes = grades.reduce((sum, grade) => sum + grade.grade, 0);
    const moyenne = totalSubjects > 0 ? totalNotes / totalSubjects : 0;

    return { totalCoefficients, totalNotes, moyenne, totalSubjects };
  };

  const addWatermark = (doc: jsPDF) => {
    const { colors, font } = PDF_CONFIG;

    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Essayer d'utiliser le logo en premier
      try {
        const logoImg = new Image();
        logoImg.src = "/logo.png";

        // Sauvegarder l'état actuel
        doc.saveGraphicsState();

        // Appliquer la transparence
        doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

        // Ajouter le logo en filigrane (centré, plus grand)
        doc.addImage(logoImg, "PNG", 18, 50, 172, 200);

        // Restaurer l'état
        doc.restoreGraphicsState();
      } catch (error) {
        // Si le logo n'est pas trouvé, utiliser du texte transparent
        console.warn("Logo non trouvé, utilisation du texte en filigrane");

        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

        doc.setFontSize(font.sizes.watermark);
        doc.setTextColor(...colors.watermark);
        doc.setFont(PDF_CONFIG.font.family, "bold");

        doc.text("OFFICIEL", 105, 150, {
          align: "center",
          angle: 45,
        });

        doc.restoreGraphicsState();
      }
    }
  };

  // Fonctions utilitaires pour le formatage
  const formatLevel = (level: string): string => {
    switch (level) {
      case "1":
        return "1ère";
      case "2":
        return "2e";
      case "3":
        return "3e";
      case "4":
        return "4e";
      case "5":
        return "5e";
      default:
        return level;
    }
  };

  const formatBirthDate = (dateString?: string): string => {
    if (!dateString) return "3 Décembre 1994";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "3 Décembre 1994";
    }
  };

  const createFooterSection = (doc: jsPDF, startY: number): number => {
    const { colors, font } = PDF_CONFIG;
    let currentY = startY - 10;

    currentY = checkPageBreak(doc, currentY, 25);

    // Légendes compactes en bas de page
    const legendsY = currentY - 4;

    // Signature compacte
    const signatureY = legendsY;

    doc.text("___________________________________", 105, signatureY, {
      align: "center",
    });

    doc.text("Vice recteur aux affaires academiques", 105, signatureY + 4, {
      align: "center",
    });

    return signatureY + 5;
  };

  const generateFileName = (): string => {
    const timestamp = new Date().toISOString().split("T")[0];
    const cleanLastName =
      selectedStudentData?.lastName?.replace(/\s+/g, "_") || "etudiant";
    const cleanFirstName =
      selectedStudentData?.firstName?.replace(/\s+/g, "_") || "inconnu";
    return `bulletin_${cleanLastName}_${cleanFirstName}_${timestamp}.pdf`;
  };

  // Fonctions de génération de documents
  const exportToPDF = async (): Promise<void> => {
    if (!validateExportData()) return;

    setIsGenerating(true);
    try {
      toast.info("Génération du PDF en cours...");

      const doc = new jsPDF();
      let currentY = PDF_CONFIG.margins.top;

      currentY = createHeaderSection(doc);
      currentY = createStudentInfoSection(doc, currentY);
      currentY = createGradesTables(doc, currentY);
      currentY = createFooterSection(doc, currentY);
      addWatermark(doc);

      const fileName = generateFileName();
      doc.save(fileName);

      setDocumentHistory((prev) => [
        ...prev,
        {
          type: "transcript",
          fileName,
          date: new Date(),
          student: selectedStudentData,
        },
      ]);

      toast.success("Bulletin exporté en PDF avec succès");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const previewPDF = async (): Promise<void> => {
    if (!validateExportData()) return;

    setIsGenerating(true);
    try {
      toast.info("Préparation de l'aperçu...");

      const doc = new jsPDF();
      let currentY = PDF_CONFIG.margins.top;

      currentY = createHeaderSection(doc);
      currentY = createStudentInfoSection(doc, currentY);
      currentY = createGradesTables(doc, currentY);
      createFooterSection(doc, currentY);
      addWatermark(doc);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const newTab = window.open(pdfUrl, "_blank");

      if (!newTab) {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.target = "_blank";
        link.click();
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      } else {
        newTab.onload = () => URL.revokeObjectURL(pdfUrl);
      }

      toast.success("PDF affiché dans un nouvel onglet");
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
      toast.error("Erreur lors de la prévisualisation");
    } finally {
      setIsGenerating(false);
    }
  };

  // Fonction pour générer le relevé de notes
  const generateGradeReport = (
    doc: jsPDF,
    documentData: DocumentData
  ): number => {
    const { colors, font } = PDF_CONFIG;

    // Utiliser createHeaderSection pour l'en-tête
    let currentY = createHeaderSection(doc);

    // Espace après l'en-tête
    currentY += 10;

    // Titre du relevé de notes
    doc.setFontSize(font.sizes.xlarge);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont(font.family, "bold");
    doc.text("RELEVÉ DE NOTES OFFICIEL", 105, currentY, { align: "center" });

    currentY += 15;

    // Informations étudiant dans un encadré
    doc.setFillColor(
      colors.lightGray[0],
      colors.lightGray[1],
      colors.lightGray[2]
    );
    doc.rect(15, currentY, 180, 30, "F");
    doc.setDrawColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.rect(15, currentY, 180, 30, "S");

    doc.setFontSize(font.sizes.small);
    doc.setFont(font.family, "normal");

    // Informations gauche
    doc.text(
      `Étudiant: ${documentData.student.firstName} ${documentData.student.lastName}`,
      20,
      currentY + 8
    );
    doc.text(`Matricule: ${documentData.student.studentId}`, 20, currentY + 16);
    doc.text(
      `Niveau: ${formatLevel(documentData.academicInfo.level)}`,
      20,
      currentY + 24
    );

    // Informations droite
    doc.text(
      `Faculté: ${documentData.academicInfo.faculty}`,
      110,
      currentY + 8
    );
    doc.text(
      `Année: ${documentData.academicInfo.academicYear}`,
      110,
      currentY + 16
    );
    doc.text(
      `Semestre: ${
        filters.semester === "S1"
          ? "1"
          : filters.semester === "S2"
          ? "2"
          : "1 et 2"
      }`,
      110,
      currentY + 24
    );

    currentY += 40;

    // Tableau des notes avec pagination
    if (documentData.grades && documentData.grades.length > 0) {
      const gradesPerPage = 25; // Maximum 25 matières par page
      const totalPages = Math.ceil(documentData.grades.length / gradesPerPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          doc.addPage();
          currentY = PDF_CONFIG.margins.top;

          // Ajouter l'en-tête sur les pages suivantes
          currentY = createHeaderSection(doc);
          currentY += 10;

          // Titre continu
          doc.setFontSize(font.sizes.large);
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.setFont(font.family, "bold");
          doc.text("RELEVÉ DE NOTES OFFICIEL (suite)", 105, currentY, {
            align: "center",
          });
          currentY += 15;
        }

        const startIndex = page * gradesPerPage;
        const endIndex = Math.min(
          startIndex + gradesPerPage,
          documentData.grades.length
        );
        const pageGrades = documentData.grades.slice(startIndex, endIndex);

        // Préparer les données du tableau sans styles complexes
        const tableData = pageGrades.map((grade, index) => {
          const ue = getUEDetails(grade.ueId);
          const globalIndex = startIndex + index + 1;

          return [
            globalIndex.toString(),
            ue?.title || "UE inconnue",
            ue?.code || "-",
            ue?.credits?.toString() || "0",
            grade.grade.toFixed(2),
            grade.status === "Valid_" ? "Validé" : "Non validé",
          ];
        });

        // Vérifier s'il y a assez d'espace pour le tableau
        currentY = checkPageBreak(doc, currentY, 100);

        autoTable(doc, {
          startY: currentY,
          head: [["No", "Matière", "Code UE", "Crédits", "Note/100", "Statut"]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: [
              colors.primary[0],
              colors.primary[1],
              colors.primary[2],
            ],
            textColor: [colors.white[0], colors.white[1], colors.white[2]],
            fontStyle: "bold",
            fontSize: 9,
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [colors.text[0], colors.text[1], colors.text[2]],
          },
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
          },
          margin: { left: 10, right: 10 },
          columnStyles: {
            0: { cellWidth: 10 }, // No
            1: { cellWidth: 70 }, // Matière
            2: { cellWidth: 25 }, // Code UE
            3: { cellWidth: 15 }, // Crédits
            4: {
              cellWidth: 20, // Note/100
              fontStyle: "bold",
            },
            5: { cellWidth: 25 }, // Statut
          },
          // Appliquer les couleurs aux notes avec willDrawCell
          willDrawCell: (data: any) => {
            if (data.section === "body" && data.column.index === 4) {
              const rowIndex = data.row.index;
              const grade = pageGrades[rowIndex];
              const ue = getUEDetails(grade.ueId);

              if (grade.grade < (ue?.passingGrade || 70)) {
                doc.setTextColor(colors.red[0], colors.red[1], colors.red[2]);
              } else {
                doc.setTextColor(
                  colors.text[0],
                  colors.text[1],
                  colors.text[2]
                );
              }
            }
          },
          didDrawCell: (data: any) => {
            // Réinitialiser la couleur après chaque cellule
            doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          },
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;

        // Calculer les statistiques pour la page courante
        const pageStats = calculateSummaryData(pageGrades);

        // Afficher les points et moyenne à droite sous le tableau
        doc.setFontSize(font.sizes.small);
        doc.setFont(font.family, "bold");

        // Positionner à droite avec une marge
        const rightMargin = 180;

        doc.text(
          `Total Points: ${pageStats.totalNotes.toFixed(2)}`,
          rightMargin,
          currentY,
          { align: "right" }
        );
        currentY += 6;
        doc.text(
          `Moyenne: ${pageStats.moyenne.toFixed(2)}/100`,
          rightMargin,
          currentY,
          { align: "right" }
        );
        currentY += 6;
        // doc.text(
        //   `Matières: ${pageStats.totalSubjects}`,
        //   rightMargin,
        //   currentY,
        //   { align: "right" }
        // );

        currentY += 15;

        // Ajouter le numéro de page
        // doc.setFontSize(font.sizes.xsmall);
        // doc.setFont(font.family, "normal");
        // doc.text(`Page ${page + 1}/${totalPages}`, 105, currentY, {
        //   align: "center",
        // });

        currentY += 10;

        // Ajouter les signatures uniquement sur la dernière page
        if (page === totalPages - 1) {
          currentY = checkPageBreak(doc, currentY, 40);

          // Signature
          const signatories = getSignatories(documentData.academicInfo.faculty);
          const signatureY = currentY;

          doc.text(signatories.dean, 60, signatureY, { align: "center" });
          doc.text("Doyen", 60, signatureY + 6, { align: "center" });

          doc.text(signatories.secretary, 150, signatureY, { align: "center" });
          doc.text("Secrétaire général", 150, signatureY + 6, {
            align: "center",
          });

          currentY += 30;
        }
      }
    } else {
      // Aucune note disponible
      doc.setFontSize(font.sizes.medium);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text("Aucune note disponible pour ce relevé", 105, currentY, {
        align: "center",
      });
      currentY += 20;
    }

    return currentY;
  };
  // Fonction pour générer l'attestation de niveau
  const generateLevelCertificate = (
    doc: jsPDF,
    documentData: DocumentData
  ): number => {
    const { colors, font } = PDF_CONFIG;

    let currentY = createHeaderSection(doc);
    currentY += 10;

    // Titre du document
    doc.setFontSize(font.sizes.xlarge);
    doc.setTextColor(...colors.text);
    doc.setFont(font.family, "bold");
    doc.text("ATTESTATION DE NIVEAU", 105, currentY, { align: "center" });

    currentY += 20;

    // Décanat
    doc.setFontSize(font.sizes.medium);
    doc.setFont(font.family, "normal");

    const decanatText = `Le Décanat de la faculté des ${documentData.academicInfo.faculty} de l'Université Jérusalem de Pignon, Haïti (UJEPH), atteste par la présente, que`;
    const decanatLines = doc.splitTextToSize(decanatText, 170);
    doc.text(decanatLines, 20, currentY);
    currentY += decanatLines.length * 6 + 10;

    // Nom étudiant
    doc.setFontSize(font.sizes.medium);
    doc.text(
      `${documentData.student.lastName?.toUpperCase()} ${
        documentData.student.firstName
      }`,
      105,
      currentY,
      { align: "center" }
    );

    currentY += 10;

    // Informations étudiant
    doc.setFont(font.family, "normal");
    const studentInfoText = `Identifié au NIN : ${
      documentData.student.cin
    }, Né le ${formatBirthDate(documentData.student.dateOfBirth)}, à ${
      documentData.student.placeOfBirth || "Petite Rivière de Nippes"
    }, est régulièrement inscrit(e) en ${formatLevel(
      documentData.academicInfo.level
    )} année du programme de licence en ${
      documentData.academicInfo.faculty
    } pour l'année académique ${documentData.academicInfo.academicYear}.`;

    const studentInfoLines = doc.splitTextToSize(studentInfoText, 170);
    doc.text(studentInfoLines, 20, currentY);
    currentY += studentInfoLines.length * 6 + 15;

    // Texte final
    const finalText =
      "En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.";
    const finalLines = doc.splitTextToSize(finalText, 170);
    doc.text(finalLines, 20, currentY);
    currentY += finalLines.length * 6 + 20;

    // Date
    doc.text(
      `Fait à Pignon, le ${documentData.issueDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}.`,
      20,
      currentY,
      { align: "left" }
    );

    currentY += 40;

    // Signatures variables
    const signatories = getSignatories(documentData.academicInfo.faculty);
    const signatureY = currentY;

    doc.text(signatories.dean, 60, signatureY, { align: "center" });
    doc.text("Doyen", 60, signatureY + 6, { align: "center" });

    doc.text(signatories.secretary, 150, signatureY, { align: "center" });
    doc.text("Secrétaire général", 150, signatureY + 6, { align: "center" });

    return currentY + 30;
  };

  // Fonction pour générer l'attestation de fin d'études
  const generateCompletionCertificate = (
    doc: jsPDF,
    documentData: DocumentData
  ): number => {
    const { colors, font } = PDF_CONFIG;

    let currentY = createHeaderSection(doc);
    currentY += 10;

    // Titre du document
    doc.setFontSize(font.sizes.xlarge);
    doc.setTextColor(...colors.text);
    doc.setFont(font.family, "bold");
    doc.text("ATTESTATION DE FIN D'ÉTUDES", 105, currentY, { align: "center" });

    currentY += 20;

    // Décanat
    doc.setFontSize(font.sizes.medium);
    doc.setFont(font.family, "normal");

    const decanatText = `Le Décanat de la faculté des ${documentData.academicInfo.faculty} de l'Université Jérusalem de Pignon, Haïti (UJEPH), atteste par la présente, que`;
    const decanatLines = doc.splitTextToSize(decanatText, 170);
    doc.text(decanatLines, 20, currentY);
    currentY += decanatLines.length * 6 + 10;

    // Nom étudiant
    doc.setFontSize(font.sizes.medium);
    doc.setFont(font.family, "bold");
    doc.text(
      `${documentData.student.lastName?.toUpperCase()} ${
        documentData.student.firstName
      }`,
      105,
      currentY,
      { align: "center" }
    );

    currentY += 10;

    // Informations étudiant avec dates calculées
    doc.setFont(font.family, "normal");

    const studentInfoText = `Identifié au NIN : ${
      documentData.student.cin
    }, Né le ${formatBirthDate(documentData.student.dateOfBirth)}, à ${
      documentData.student.placeOfBirth || "Petite Rivière de Nippes"
    }, a parcouru avec succès les cinq années de cours du programme de licence en ${
      documentData.academicInfo.faculty
    }, de ${documentData.academicInfo.startDate} à ${
      documentData.academicInfo.endDate
    }. Il se réserve de présenter et soutenir son mémoire de sortie en vue de l'obtention de sa licence.`;
    const studentInfoLines = doc.splitTextToSize(studentInfoText, 170);
    doc.text(studentInfoLines, 20, currentY);
    currentY += studentInfoLines.length * 6 + 15;

    // Texte final
    const finalText =
      "En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.";
    const finalLines = doc.splitTextToSize(finalText, 170);
    doc.text(finalLines, 20, currentY);
    currentY += finalLines.length * 6 + 20;

    // Date
    doc.text(
      `Fait à Pignon, le ${documentData.issueDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}.`,
      20,
      currentY,
      { align: "left" }
    );

    currentY += 40;

    // Signatures variables
    const signatories = getSignatories(documentData.academicInfo.faculty);
    const signatureY = currentY;

    doc.text(signatories.dean, 60, signatureY, { align: "center" });
    doc.text("Doyen", 60, signatureY + 6, { align: "center" });

    doc.text(signatories.secretary, 150, signatureY, { align: "center" });
    doc.text("Secrétaire général", 150, signatureY + 6, { align: "center" });

    return currentY + 30;
  };

  // Fonction pour générer le certificat de diplôme
  const generateDiplomaCertificate = (
    doc: jsPDF,
    documentData: DocumentData
  ): number => {
    const { colors, font } = PDF_CONFIG;
    let currentY = PDF_CONFIG.margins.top;

    // En-tête très officiel avec bordure
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(3);
    doc.rect(10, 10, 190, 277);

    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 60, "F");

    doc.setFontSize(18);
    doc.setTextColor(...colors.white);
    doc.text("DIPLÔME D'ÉTUDES SUPÉRIEURES", 105, 30, { align: "center" });

    doc.setFontSize(14);
    doc.text("UNIVERSITÉ JÉRUSALEM DE PIGNON D'HAÏTI", 105, 45, {
      align: "center",
    });

    currentY = 80;

    // Contenu du diplôme
    doc.setFontSize(16);
    doc.setTextColor(...colors.text);
    doc.text("DÉLIVRE À", 105, currentY, { align: "center" });

    currentY += 20;

    doc.setFontSize(20);
    doc.setFont(font.family, "bold");
    doc.text(
      `${documentData.student.firstName} ${documentData.student.lastName}`,
      105,
      currentY,
      { align: "center" }
    );

    currentY += 15;
    doc.setFontSize(12);
    doc.setFont(font.family, "normal");
    doc.text(`Matricule : ${documentData.student.studentId}`, 105, currentY, {
      align: "center",
    });

    currentY += 20;
    doc.setFontSize(14);

    const text = [
      `le présent Diplôme de Fin d'Études`,
      `en reconnaissance de l'achèvement satisfaisant du programme de`,
      `${documentData.academicInfo.level} année.`,
      ``,
      `Moyenne générale : ${documentData.summary?.gpa.toFixed(2)}/100`,
      `Mention : ${documentData.summary?.mention}`,
      `Crédits obtenus : ${documentData.summary?.creditsEarned}/${documentData.summary?.totalCredits}`,
      ``,
      `Fait à Pignon, le ${documentData.issueDate.toLocaleDateString("fr-FR")}`,
    ];

    text.forEach((line) => {
      if (line) {
        doc.text(line, 105, currentY, { align: "center" });
      }
      currentY += 8;
    });

    // Cachet et signatures
    currentY += 20;
    doc.setLineWidth(1);
    doc.setDrawColor(200, 0, 0);
    doc.circle(105, currentY, 20);
    doc.text("CACHET", 105, currentY, { align: "center" });
    doc.text("OFFICIEL", 105, currentY + 6, { align: "center" });

    return currentY + 40;
  };

  // Fonction principale pour générer n'importe quel document
  const generateDocument = async (
    documentType: DocumentType,
    action: "preview" | "download"
  ): Promise<void> => {
    try {
      if (!selectedStudentData) {
        showStatus("Veuillez sélectionner un étudiant", "error");
        return;
      }

      // Vérifier les prérequis selon le type de document
      const config = DOCUMENT_CONFIGS[documentType];
      if (
        config.requiredFields.includes("grades") &&
        studentGrades.length === 0
      ) {
        showStatus("Aucune note disponible pour générer ce document", "error");
        return;
      }

      showStatus(`Génération du ${config.title.toLowerCase()}...`, "info");

      // CALCULER LES DATES BASÉES SUR LES INSCRIPTIONS
      const enrollmentDates = await calculateEnrollmentDates(
        selectedStudentData.id
      );

      // Préparer les données du document
      const documentData: DocumentData = {
        student: selectedStudentData,
        academicInfo: {
          faculty:
            faculties.find((f) => f.id === filters.facultyId)?.name ||
            "Sciences Agronomiques",
          level: filters.level,
          academicYear:
            academicYears.find((y) => y.id === filters.academicYearId)?.year ||
            "Non spécifié",
          program: "Programme académique",
          startDate: enrollmentDates.startDate,
          endDate: enrollmentDates.endDate,
        },
        grades: studentGrades,
        summary: {
          gpa: annualGPA,
          creditsEarned: annualCredits,
          totalCredits: totalAnnualCredits,
          mention: getMention(annualGPA),
        },
        issueDate: new Date(),
        documentId: `DOC-${documentType.toUpperCase()}-${Date.now()}`,
      };

      // Créer le PDF
      const doc = new jsPDF();

      // Sélectionner la fonction de génération appropriée
      switch (documentType) {
        case "grade-report":
          generateGradeReport(doc, documentData);
          break;
        case "level-certificate":
          generateLevelCertificate(doc, documentData);
          break;
        case "completion-certificate":
          generateCompletionCertificate(doc, documentData);
          break;
        case "diploma-certificate":
          generateDiplomaCertificate(doc, documentData);
          break;
        default:
          let currentY = createHeaderSection(doc);
          currentY = createStudentInfoSection(doc, currentY);
          currentY = createGradesTables(doc, currentY);
          createFooterSection(doc, currentY);
          break;
      }

      // Ajouter le filigrane pour tous les documents
      addWatermark(doc);

      // Générer le nom de fichier
      const fileName = `${config.title.replace(/\s+/g, "_")}_${
        selectedStudentData.lastName
      }_${selectedStudentData.firstName}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Exécuter l'action demandée
      if (action === "preview") {
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 3000);
      } else {
        doc.save(fileName);
      }

      // Ajouter à l'historique
      setDocumentHistory((prev) => [
        ...prev,
        {
          type: documentType,
          fileName,
          date: new Date(),
          student: selectedStudentData,
        },
      ]);

      showStatus(`${config.title} généré avec succès`, "success");
    } catch (error) {
      console.error("Erreur lors de la génération du document:", error);
      showStatus("Erreur lors de la génération du document", "error");
    }
  };

  // Fonctions raccourcies
  const previewDocument = () => generateDocument(selectedDocument, "preview");
  const downloadDocument = () => generateDocument(selectedDocument, "download");

  // Composant pour les données vides
  const EmptyState = useCallback(
    () => (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-8 text-center text-muted-foreground dark:text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium dark:text-gray-300 mb-2">
            {selectedStudentData
              ? "Aucune note trouvée pour les critères sélectionnés"
              : "Sélectionnez un étudiant pour générer un document"}
          </p>
          <p className="text-sm">
            {selectedStudentData
              ? "Vérifiez les filtres ou contactez l'administration"
              : "Utilisez les filtres pour trouver un étudiant"}
          </p>
          {!selectedStudentData && (
            <Button onClick={resetForm} className="mt-4">
              Réinitialiser les filtres
            </Button>
          )}
        </CardContent>
      </Card>
    ),
    [selectedStudentData, resetForm]
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words">
            <GraduationCap className="inline-block h-8 w-8 mr-2" />
            Génération de Documents Académiques
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base dark:text-gray-400">
            Créez et imprimez les bulletins et certificats des étudiants
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
        </div>
      </div>

      {/* Sélection du type de document */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <FileText className="h-5 w-5" />
            Type de Document à Générer
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Choisissez le type de document académique que vous souhaitez générer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(DOCUMENT_CONFIGS).map(([key, config]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 dark:bg-gray-800 ${
                    selectedDocument === key
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400 shadow-md"
                      : "hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                  onClick={() => setSelectedDocument(key as DocumentType)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          selectedDocument === key
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm dark:text-gray-200">
                          {config.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres de sélection */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Filter className="h-5 w-5" />
            Filtres de Sélection
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Sélectionnez les critères pour générer le document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Faculté */}
            <div className="space-y-2">
              <Label
                htmlFor="faculty"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <Building className="h-4 w-4" />
                Faculté
              </Label>
              <Select
                value={filters.facultyId}
                onValueChange={handleFacultyChange}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Toutes les facultés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les facultés</SelectItem>
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
              <Label
                htmlFor="level"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <Layers className="h-4 w-4" />
                Niveau
              </Label>
              <Select value={filters.level} onValueChange={handleLevelChange}>
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="1">1ère Année</SelectItem>
                  <SelectItem value="2">2e Année</SelectItem>
                  <SelectItem value="3">3e Année</SelectItem>
                  <SelectItem value="4">4e Année</SelectItem>
                  <SelectItem value="5">5e Année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Année académique */}
            <div className="space-y-2">
              <Label
                htmlFor="academicYear"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <Calendar className="h-4 w-4" />
                Année académique
              </Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, academicYearId: value }))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
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
              <Label
                htmlFor="semester"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <BookOpen className="h-4 w-4" />
                Semestre
              </Label>
              <Select
                value={filters.semester}
                onValueChange={(value: "S1" | "S2" | "all") =>
                  setFilters((prev) => ({ ...prev, semester: value }))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label
                htmlFor="search"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <Search className="h-4 w-4" />
                Rechercher un étudiant
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, prénom ou matricule..."
                  className="pl-10 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Sélection étudiant */}
            <div className="space-y-2">
              <Label
                htmlFor="student"
                className="flex items-center gap-1 dark:text-gray-300"
              >
                <User className="h-4 w-4" />
                Étudiant
              </Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
                disabled={filteredStudents.length === 0}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue
                    placeholder={
                      filteredStudents.length === 0
                        ? "Aucun étudiant trouvé"
                        : "Sélectionner un étudiant"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} -{" "}
                      {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Button
              variant="outline"
              onClick={resetForm}
              className="w-full sm:w-auto"
              disabled={isGenerating}
            >
              Réinitialiser
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                disabled={
                  !selectedStudentData ||
                  studentGrades.length === 0 ||
                  isGenerating
                }
                onClick={() =>
                  transcriptRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir le {DOCUMENT_CONFIGS[selectedDocument].title}
              </Button>

              <Button
                onClick={previewDocument}
                disabled={
                  !selectedStudentData ||
                  studentGrades.length === 0 ||
                  isGenerating
                }
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? "Génération..." : "Prévisualiser"}
              </Button>

              <Button
                onClick={downloadDocument}
                variant="outline"
                disabled={
                  !selectedStudentData ||
                  studentGrades.length === 0 ||
                  isGenerating
                }
                className="bg-green-600 text-white hover:bg-green-700 border-green-600 w-full sm:w-auto"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? "Génération..." : "Télécharger"}
              </Button>
            </div>
          </div>

          {/* Indicateur de chargement */}
          {(isLoading || isGenerating) && (
            <div className="mt-4 flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {isGenerating
                  ? "Génération du document..."
                  : "Chargement des données..."}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé statistique */}
      {selectedStudentData && studentGrades.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">
              Résumé Académique
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Performance de {selectedStudentData.firstName}{" "}
              {selectedStudentData.lastName} pour{" "}
              {filters.academicYearId !== "all"
                ? academicYears.find((y) => y.id === filters.academicYearId)
                    ?.year || filters.academicYearId
                : "toutes les années"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="overview" className="dark:text-gray-300">
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="session1" className="dark:text-gray-300">
                  Session 1
                </TabsTrigger>
                <TabsTrigger value="session2" className="dark:text-gray-300">
                  Session 2
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Moyenne{" "}
                            {filters.semester === "all"
                              ? "Annuelle"
                              : "du Semestre"}
                          </p>
                          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                            {annualGPA.toFixed(2)}/100
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            {getMention(annualGPA)}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-700">
                          <BarChart3 className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                        </div>
                      </div>
                      <Progress
                        value={(annualGPA / 100) * 100}
                        className="h-2 mt-4 bg-blue-200 dark:bg-blue-700"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">
                            Crédits Obtenus
                          </p>
                          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                            {annualCredits}/{totalAnnualCredits}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {(
                              (annualCredits / totalAnnualCredits) *
                              100
                            ).toFixed(0)}
                            % de réussite
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-200 dark:bg-green-700">
                          <Target className="h-6 w-6 text-green-700 dark:text-green-300" />
                        </div>
                      </div>
                      <Progress
                        value={(annualCredits / totalAnnualCredits) * 100}
                        className="h-2 mt-4 bg-green-200 dark:bg-green-700"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Cours
                          </p>
                          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                            {studentGrades.length}
                          </p>
                          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                            Sur {ues.length} au total
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-700">
                          <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {filters.semester === "all" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg dark:text-gray-200">
                          Session 1
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Moyenne:
                            </span>
                            <Badge
                              variant={
                                session1GPA >= 70 ? "default" : "destructive"
                              }
                              className="text-lg"
                            >
                              {session1GPA.toFixed(2)}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Crédits:
                            </span>
                            <span className="dark:text-gray-300">
                              {session1Credits}/{session1TotalCredits}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Mention:
                            </span>
                            <span className="dark:text-gray-300">
                              {getMention(session1GPA)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg dark:text-gray-200">
                          Session 2
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Moyenne:
                            </span>
                            <Badge
                              variant={
                                session2GPA >= 70 ? "default" : "destructive"
                              }
                              className="text-lg"
                            >
                              {session2GPA.toFixed(2)}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Crédits:
                            </span>
                            <span className="dark:text-gray-300">
                              {session2Credits}/{session2TotalCredits}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium dark:text-gray-300">
                              Mention:
                            </span>
                            <span className="dark:text-gray-300">
                              {getMention(session2GPA)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="session1">
                <SessionDetails
                  grades={session1Grades}
                  getUEDetails={getUEDetails}
                  session="S1"
                  gpa={session1GPA}
                  creditsEarned={session1Credits}
                  totalCredits={session1TotalCredits}
                />
              </TabsContent>

              <TabsContent value="session2">
                <SessionDetails
                  grades={session2Grades}
                  getUEDetails={getUEDetails}
                  session="S2"
                  gpa={session2GPA}
                  creditsEarned={session2Credits}
                  totalCredits={session2TotalCredits}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Aperçu du document */}
      {selectedStudentData && studentGrades.length > 0 ? (
        <Card
          className="mt-6 dark:bg-gray-800 dark:border-gray-700"
          ref={transcriptRef}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="dark:text-gray-200">
                {DOCUMENT_CONFIGS[selectedDocument].title} - Aperçu
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={previewPDF}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? "Génération..." : "Prévisualiser"}
                </Button>

                <Button
                  onClick={exportToPDF}
                  variant="outline"
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? "Génération..." : "Télécharger"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-8 border rounded-lg dark:border-gray-700">
              {/* Contenu de l'aperçu du document */}
              <div className="text-center border-b pb-6 mb-6 dark:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      LOGO
                    </span>
                  </div>
                  <div className="text-center flex-1 mx-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                      UNIVERSITÉ JÉRUSALEM DE PIGNON D'HAÏTI (UJEPH)
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
                      83, Rue de l'Université Jérusalem, Pignon, Haïti
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                      E-mail : info@ujeph.edu.ht | Tels : +509 4289-9225 /
                      3620-3021
                    </p>
                  </div>
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      LOGO
                    </span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold mt-4 text-blue-700 dark:text-blue-400">
                  {DOCUMENT_CONFIGS[selectedDocument].title.toUpperCase()} -{" "}
                  {filters.academicYearId !== "all"
                    ? academicYears.find((y) => y.id === filters.academicYearId)
                        ?.year || filters.academicYearId
                    : "Toutes années"}
                </h2>
              </div>

              {/* Informations étudiant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    INFORMATIONS ÉTUDIANT
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <span className="font-medium">Nom:</span>{" "}
                      {selectedStudentData.lastName}
                    </p>
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <span className="font-medium">Prénom:</span>{" "}
                      {selectedStudentData.firstName}
                    </p>
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <Hash className="h-4 w-4" />
                      <span className="font-medium">ID Étudiant:</span>{" "}
                      {selectedStudentData.studentId}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    INFORMATIONS ACADÉMIQUES
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Faculté:</span>{" "}
                      {faculties.find((f) => f.id === filters.facultyId)
                        ?.name || filters.facultyId}
                    </p>
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <Layers className="h-4 w-4" />
                      <span className="font-medium">Niveau:</span>{" "}
                      {filters.level}
                    </p>
                    <p className="flex items-center gap-2 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        Année Académique:
                      </span>{" "}
                      {academicYears.find(
                        (y) => y.id === filters.academicYearId
                      )?.year ||
                        filters.academicYearId ||
                        "Toutes années"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Résumé académique */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-semibold text-sm dark:text-gray-200">
                      Moyenne Générale
                    </span>
                  </div>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {annualGPA.toFixed(2)}/100
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {getMention(annualGPA)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-semibold text-sm dark:text-gray-200">
                      Total des Notes
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {totalGrades.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Sur {totalSubjects} matière(s)
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-semibold text-sm dark:text-gray-200">
                      Crédits Validés
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {annualCredits}/{totalAnnualCredits}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {((annualCredits / totalAnnualCredits) * 100).toFixed(0)}%
                    de réussite
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                    <span className="font-semibold text-sm dark:text-gray-200">
                      {filters.semester !== "all"
                        ? "Statut du Semestre"
                        : "Statut Annuel"}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {annualGPA >= 70 ? "Validé" : "Non Validé"}
                  </p>
                </div>
              </div>

              {/* Détails des sessions */}
              <div className="space-y-6">
                {(filters.semester === "all" || filters.semester === "S1") &&
                  session1Grades.length > 0 && (
                    <div className="border rounded-lg overflow-hidden dark:border-gray-600">
                      <div
                        className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSession("S1")}
                      >
                        <h3 className="font-semibold text-lg dark:text-gray-200">
                          Session 1 - Résultats
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium dark:text-gray-300">
                              Moyenne:{" "}
                              <span
                                className={
                                  session1GPA >= 70
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {session1GPA.toFixed(2)}/100
                              </span>
                            </p>
                            <p className="text-sm dark:text-gray-400">
                              Crédits: {session1Credits}/{session1TotalCredits}
                            </p>
                          </div>
                          {expandedSessions["S1"] ? (
                            <ChevronUp className="h-5 w-5 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedSessions["S1"] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                                    <TableHead className="font-semibold dark:text-gray-300">
                                      Code UE
                                    </TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">
                                      Intitulé
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Crédits
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Note/100
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Statut
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {session1Grades.map((grade) => {
                                    const ue = getUEDetails(grade.ueId);
                                    return (
                                      <TableRow
                                        key={grade.id}
                                        className="dark:border-gray-600"
                                      >
                                        <TableCell className="font-medium dark:text-gray-300">
                                          {ue?.code}
                                        </TableCell>
                                        <TableCell className="dark:text-gray-300">
                                          {ue?.title}
                                        </TableCell>
                                        <TableCell className="text-center dark:text-gray-300">
                                          {ue?.credits}
                                        </TableCell>

                                        <TableCell className="text-center font-semibold">
                                          <span
                                            className={
                                              grade.grade >=
                                              (ue?.passingGrade || 70)
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                            }
                                          >
                                            {grade.grade.toFixed(2)}
                                            {grade.session === "Reprise" && (
                                              <>
                                                {" R"}
                                                {getOldGrade(
                                                  grade.studentId,
                                                  grade.ueId,
                                                  grade.semester
                                                ) &&
                                                  ` (${getOldGrade(
                                                    grade.studentId,
                                                    grade.ueId,
                                                    grade.semester
                                                  )?.toFixed(2)})`}
                                              </>
                                            )}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge
                                            variant={
                                              grade.status === "Valid_"
                                                ? "default"
                                                : "destructive"
                                            }
                                            className="text-xs"
                                          >
                                            {grade.status}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                {(filters.semester === "all" || filters.semester === "S2") &&
                  session2Grades.length > 0 && (
                    <div className="border rounded-lg overflow-hidden dark:border-gray-600">
                      <div
                        className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSession("S2")}
                      >
                        <h3 className="font-semibold text-lg dark:text-gray-200">
                          Session 2 - Résultats
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium dark:text-gray-300">
                              Moyenne:{" "}
                              <span
                                className={
                                  session2GPA >= 70
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {session2GPA.toFixed(2)}/100
                              </span>
                            </p>
                            <p className="text-sm dark:text-gray-400">
                              Crédits: {session2Credits}/{session2TotalCredits}
                            </p>
                          </div>
                          {expandedSessions["S2"] ? (
                            <ChevronUp className="h-5 w-5 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedSessions["S2"] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                                    <TableHead className="font-semibold dark:text-gray-300">
                                      Code UE
                                    </TableHead>
                                    <TableHead className="font-semibold dark:text-gray-300">
                                      Intitulé
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Crédits
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Note/100
                                    </TableHead>
                                    <TableHead className="font-semibold text-center dark:text-gray-300">
                                      Statut
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {session2Grades.map((grade) => {
                                    const ue = getUEDetails(grade.ueId);
                                    return (
                                      <TableRow
                                        key={grade.id}
                                        className="dark:border-gray-600"
                                      >
                                        <TableCell className="font-medium dark:text-gray-300">
                                          {ue?.code}
                                        </TableCell>
                                        <TableCell className="dark:text-gray-300">
                                          {ue?.title}
                                        </TableCell>
                                        <TableCell className="text-center dark:text-gray-300">
                                          {ue?.credits}
                                        </TableCell>
                                        <TableCell className="text-center font-semibold">
                                          <span
                                            className={
                                              grade.grade >=
                                              (ue?.passingGrade || 70)
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                            }
                                          >
                                            {grade.grade.toFixed(2)}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge
                                            variant={
                                              grade.status === "Valid_"
                                                ? "default"
                                                : "destructive"
                                            }
                                            className="text-xs"
                                          >
                                            {grade.status}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t dark:border-gray-600">
                <div className="text-center">
                  <div className="border-t border-gray-400 dark:border-gray-500 pt-2 mt-12">
                    <p className="font-semibold dark:text-gray-300">
                      Le Directeur Académique
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-400 dark:border-gray-500 pt-2 mt-12">
                    <p className="font-semibold dark:text-gray-300">
                      Le Registraire
                    </p>
                  </div>
                </div>
              </div>

              {/* Cachet officiel */}
              <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  Document officiel généré le{" "}
                  {new Date().toLocaleDateString("fr-FR")} à{" "}
                  {new Date().toLocaleTimeString("fr-FR")}
                </p>
                <p>Université Jérusalem de Pignon d'Haïti - Pignon, Haïti</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// Composant pour afficher les détails d'une session
const SessionDetails = ({
  grades,
  getUEDetails,
  session,
  gpa,
  creditsEarned,
  totalCredits,
}: any) => {
  const getOldGrade = useCallback(
    (studentId: string, ueId: string, semester: string) => {
      const oldGrade = grades.find(
        (grade) =>
          grade.studentId === studentId &&
          grade.ueId === ueId &&
          grade.semester === semester &&
          grade.session === "normale" &&
          grade.isActive === false
      );
      console.log(oldGrade.grade);

      return oldGrade?.grade || null;
    },
    [grades]
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Moyenne {session}
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {gpa.toFixed(2)}/100
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-700 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Crédits Obtenus
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {creditsEarned}/{totalCredits}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-700 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Unités d'Enseignement
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {grades.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-700 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="font-semibold dark:text-gray-300">
                Code UE
              </TableHead>
              <TableHead className="font-semibold dark:text-gray-300">
                Intitulé
              </TableHead>
              <TableHead className="font-semibold text-center dark:text-gray-300">
                Crédits
              </TableHead>
              <TableHead className="font-semibold text-center dark:text-gray-300">
                Note/100
              </TableHead>
              <TableHead className="font-semibold text-center dark:text-gray-300">
                Note de passage
              </TableHead>
              <TableHead className="font-semibold text-center dark:text-gray-300">
                Statut
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade: any) => {
              const ue = getUEDetails(grade.ueId);
              return (
                <TableRow key={grade.id} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-gray-300">
                    {ue?.code}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {ue?.title}
                  </TableCell>
                  <TableCell className="text-center dark:text-gray-300">
                    {ue?.credits}
                  </TableCell>

                  <TableCell className="text-center font-semibold">
                    <span
                      className={
                        grade.grade >= (ue?.passingGrade || 70)
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {grade.grade.toFixed(2)}
                      {grade.session === "Reprise" && (
                        <>
                          {" R"}
                          {getOldGrade(
                            grade.studentId,
                            grade.ueId,
                            grade.semester
                          ) &&
                            ` (${getOldGrade(
                              grade.studentId,
                              grade.ueId,
                              grade.semester
                            )?.toFixed(2)})`}
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-center dark:text-gray-300">
                    {ue?.passingGrade || 70}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        grade.status === "Valid_" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {grade.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
