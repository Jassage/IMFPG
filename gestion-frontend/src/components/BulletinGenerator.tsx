import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Eye, RefreshCw, FileText } from "lucide-react";
import { DocumentType, ControlType, BulletinData, GradeWithDetails } from "@/types/bulletin";
import { toast } from "sonner";
import { DocumentSelector } from "./bulletin/DocumentSelector";
import { FilterPanel } from "./bulletin/FilterPanel";
import { useBulletinData } from "@/hooks/useBulletinData";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { StudentSelector } from "./bulletin/StudentSelector";
import { StatisticsPanel } from "./bulletin/StatisticsPanel";
import { GradesTable } from "./bulletin/GradesTable";

// Composants

// Hooks

export const BulletinGenerator: React.FC = () => {
  // États
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>(
    DocumentType.BULLETIN
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    academicYearId: "",
    controlType: "all" as ControlType | "all",
    classLevel: "all",
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Hooks personnalisés
  const {
    students,
    studentGrades,
    gradesByControlType,
    academicYears,
    selectedStudent,
    selectedAcademicYear,
    studentClass,
    statistics,
    isLoading,
    error,
    refetch,
  } = useBulletinData({
    studentId: selectedStudentId,
    academicYearId:
      filters.academicYearId === "all" ? undefined : filters.academicYearId,
    controlType:
      filters.controlType === "all" ? undefined : filters.controlType,
    classLevel: filters.classLevel === "all" ? undefined : filters.classLevel,
  });

  const { downloadPDF, previewPDF } = usePDFGenerator();

  // Gestion des filtres
  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  // Gestion de la sélection d'étudiant
  const handleSelectStudent = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

  // Préparer les données pour le PDF
  const prepareBulletinData = useCallback((): BulletinData | null => {
    if (
      !selectedStudent ||
      !selectedAcademicYear ||
      studentGrades.length === 0
    ) {
      return null;
    }

    const controlType: ControlType =
      filters.controlType === "all"
        ? (studentGrades[0].controlType as ControlType)
        : (filters.controlType as ControlType);

    const gradesWithDetails = studentGrades.map((grade) => ({
      ...grade,
      subjectName: grade.subject?.name || "Matière inconnue",
      coefficient: grade.subject?.coefficient || 1,
      passingGrade: grade.subject?.passingGrade || 10,
      professeurName: grade.classAssignment?.professeur
        ? `${grade.classAssignment.professeur.firstName} ${grade.classAssignment.professeur.lastName}`
        : "Professeur non assigné",
    }));

    const mappedStudent = {
      ...selectedStudent,
      enrollments: (selectedStudent.enrollments || []).map((e: any) => ({
        ...e,
        studentId: (selectedStudent as any).id || (selectedStudent as any).studentId,
      })),
    };

    return {
      student: mappedStudent as any,
      academicYear: {
        ...selectedAcademicYear,
        startDate: new Date(selectedAcademicYear.startDate),
        endDate: new Date(selectedAcademicYear.endDate),
        createdAt: selectedAcademicYear.createdAt
          ? new Date(selectedAcademicYear.createdAt)
          : undefined,
        updatedAt: selectedAcademicYear.updatedAt
          ? new Date(selectedAcademicYear.updatedAt)
          : undefined,
      },
      controlType,
      classLevel: studentClass?.level || filters.classLevel,
      documentType: selectedDocument,
      grades: gradesWithDetails as unknown as GradeWithDetails[],
      statistics,
      remarks: {
        headTeacher: "",
        director: "",
        generalComment: "",
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: "Système",
        documentNumber: `BUL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        controlPeriod: getControlPeriodLabel(controlType),
      },
    };
  }, [
    selectedStudent,
    selectedAcademicYear,
    studentGrades,
    filters,
    studentClass,
    selectedDocument,
    statistics,
  ]);

  const getControlPeriodLabel = (controlType: ControlType): string => {
    switch (controlType) {
      case ControlType.CONTROLE_1:
        return "1er Trimestre";
      case ControlType.CONTROLE_2:
        return "2ème Trimestre";
      case ControlType.CONTROLE_3:
        return "3ème Trimestre";
      case ControlType.CONTROLE_4:
        return "Examen Final";
      default:
        return "Période";
    }
  };

  // Gestion des actions
  const handlePreview = useCallback(async () => {
    const data = prepareBulletinData();
    if (!data) {
      toast.error("Données insuffisantes pour générer le document");
      return;
    }

    setIsGenerating(true);
    try {
      await previewPDF(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  }, [prepareBulletinData, previewPDF]);

  const handleDownload = useCallback(async () => {
    const data = prepareBulletinData();
    if (!data) {
      toast.error("Données insuffisantes pour générer le document");
      return;
    }

    setIsGenerating(true);
    try {
      const fileName = `bulletin_${data.student.lastName}_${
        data.student.firstName
      }_${data.metadata.generatedAt.toISOString().split("T")[0]}.pdf`;
      await downloadPDF(data, fileName);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsGenerating(false);
    }
  }, [prepareBulletinData, downloadPDF]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success("Données actualisées");
  }, [refetch]);

  // Rendu
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Génération de Bulletins</h1>
          <p className="text-gray-600">
            Générez les bulletins scolaires des élèves
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isGenerating}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Sélection du document */}
      <DocumentSelector
        selected={selectedDocument}
        onSelect={setSelectedDocument}
      />

      {/* Filtres et sélection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <FilterPanel
            filters={filters}
            academicYears={academicYears}
            onFilterChange={handleFilterChange}
          />

          <StudentSelector
            students={students as any}
            selectedStudentId={selectedStudentId}
            searchTerm={searchTerm}
            onSelectStudent={handleSelectStudent}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedStudent && studentGrades.length > 0 ? (
            <>
              {/* En-tête élève */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Code: {selectedStudent.studentCode}</span>
                        <span>
                          Classe: {studentClass?.name || "Non assigné"}
                        </span>
                        <span>Année: {selectedAcademicYear?.year}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handlePreview} disabled={isGenerating}>
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        Prévisualiser
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <StatisticsPanel
                statistics={statistics}
                controlType={
                  filters.controlType === "all"
                    ? undefined
                    : filters.controlType
                }
              />

              {/* Tableau des notes */}
              {filters.controlType === "all" ? (
                // Tous les contrôles
                <div className="space-y-6">
                  {Object.entries(gradesByControlType).map(
                    ([controlType, grades]) => (
                      <GradesTable
                        key={controlType}
                        grades={grades.map((grade) => ({
                          ...grade,
                          subjectName:
                            grade.subject?.name || "Matière inconnue",
                          coefficient: grade.subject?.coefficient || 1,
                          passingGrade: grade.subject?.passingGrade || 10,
                          professeurName: grade.classAssignment?.professeur
                            ? `${grade.classAssignment.professeur.firstName} ${grade.classAssignment.professeur.lastName}`
                            : "Professeur non assigné",
                        })) as any}
                        title={getControlPeriodLabel(
                          controlType as ControlType
                        )}
                      />
                    )
                  )}
                </div>
              ) : (
                // Un contrôle spécifique
                <GradesTable
                  grades={studentGrades.map((grade) => ({
                    ...grade,
                    subjectName: grade.subject?.name || "Matière inconnue",
                    coefficient: grade.subject?.coefficient || 1,
                    passingGrade: grade.subject?.passingGrade || 10,
                    professeurName: grade.classAssignment?.professeur
                      ? `${grade.classAssignment.professeur.firstName} ${grade.classAssignment.professeur.lastName}`
                      : "Professeur non assigné",
                  })) as any}
                  title={getControlPeriodLabel(filters.controlType)}
                />
              )}
            </>
          ) : (
            // Aucun élève sélectionné
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStudentId
                    ? "Aucune note trouvée"
                    : "Sélectionnez un élève"}
                </h3>
                <p className="text-gray-600">
                  {selectedStudentId
                    ? "Aucune note disponible pour les critères sélectionnés"
                    : "Utilisez les filtres pour sélectionner un élève et générer son bulletin"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
