import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  DocumentType,
  ControlType,
  BulletinGenerationRequest,
  normalizeGrade,
} from "@/types/bulletin";
import { toast } from "sonner";
import bulletinService from "@/services/bulletinService";
import { DocumentSelector } from "./bulletin/DocumentSelector"; // <-- Ajouté
import { FilterPanel } from "./bulletin/FilterPanel";
import { useBulletinData } from "@/hooks/useBulletinData";
import { StudentSelector } from "./bulletin/StudentSelector";
import { StatisticsPanel } from "./bulletin/StatisticsPanel";
import { GradesTable } from "./bulletin/GradesTable";
import { MultiControlTable } from "./bulletin/MultiControlTable";
import { DocumentHistory } from "./bulletin/DocumentHistory";

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
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

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

  // Calculer la moyenne générale
  const calculateOverallAverage = useCallback(() => {
    if (studentGrades.length === 0) return 0;

    const totalCoefficient = studentGrades.reduce(
      (sum, grade) => sum + (grade.coefficient || 1),
      0
    );

    const weightedSum = studentGrades.reduce((sum, grade) => {
      const coefficient = grade.coefficient || 1;
      const normalizedGrade =
        grade.normalizedGrade ||
        normalizeGrade(grade.grade, grade.maxGrade || 20);
      return sum + normalizedGrade * coefficient;
    }, 0);

    return totalCoefficient > 0 ? weightedSum / totalCoefficient : 0;
  }, [studentGrades]);

  const overallAverage = calculateOverallAverage();

  const getOverallDecision = (
    average: number
  ): {
    label: string;
    color: string;
    icon: React.ReactNode;
    description: string;
  } => {
    if (average >= 10) {
      return {
        label: "ADMIS",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle className="h-5 w-5 mr-2" />,
        description: "L'élève est admis en classe supérieure",
      };
    } else if (average >= 8) {
      return {
        label: "À REFAIRE",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <AlertCircle className="h-5 w-5 mr-2" />,
        description: "L'élève doit refaire l'année dans la même école",
      };
    } else {
      return {
        label: "À REFAIRE AILLEURS",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: <XCircle className="h-5 w-5 mr-2" />,
        description: "L'élève est exclu et doit refaire ailleurs",
      };
    }
  };

  const overallDecision = getOverallDecision(overallAverage);

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

  // Dans BulletinGenerator.tsx, modifiez la fonction getControlTypesToShow
  const getControlTypesToShow = (
    controlType: ControlType | "all"
  ): ControlType[] => {
    if (controlType === "all") {
      // Retourner les contrôles qui ont des données dans gradesByControlType
      return Object.keys(gradesByControlType)
        .filter(
          (key) =>
            gradesByControlType[key] && gradesByControlType[key].length > 0
        )
        .map((key) => key as ControlType);
    }
    return [controlType as ControlType];
  };

  // Préparation des données pour MultiControlTable
  const prepareGradesForMultiControl = useCallback(() => {
    if (filters.controlType !== "all" || !selectedStudentId) {
      return [];
    }

    // Récupérer toutes les notes groupées par contrôle
    const allGrades: any[] = [];

    Object.entries(gradesByControlType).forEach(([controlType, grades]) => {
      grades.forEach((grade) => {
        allGrades.push({
          ...grade,
          controlType: controlType as ControlType,
          subjectName:
            grade.subject?.name || grade.subjectName || "Matière inconnue",
          coefficient: grade.coefficient || grade.subject?.coefficient || 1,
          maxGrade: grade.maxGrade || grade.subject?.maxGrade || 20,
          normalizedGrade:
            grade.normalizedGrade ||
            normalizeGrade(grade.grade, grade.maxGrade || 20),
          // Créer controlGrades pour chaque contrôle
          controlGrades: {
            [controlType]: {
              grade: grade.grade,
              normalizedGrade:
                grade.normalizedGrade ||
                normalizeGrade(grade.grade, grade.maxGrade || 20),
            },
          },
        });
      });
    });

    return allGrades;
  }, [filters.controlType, gradesByControlType, selectedStudentId]);

  // Construit la requête envoyée au backend pour générer/prévisualiser le document
  const buildRequest = useCallback((): BulletinGenerationRequest | null => {
    if (!selectedStudentId || !selectedAcademicYear) {
      return null;
    }

    const request: BulletinGenerationRequest = {
      studentId: selectedStudentId,
      academicYearId: selectedAcademicYear.id,
      documentType: selectedDocument,
    };

    // controlType requis uniquement pour un BULLETIN sur une période précise
    if (
      selectedDocument === DocumentType.BULLETIN &&
      filters.controlType !== "all"
    ) {
      request.controlType = filters.controlType as ControlType;
    }

    return request;
  }, [
    selectedStudentId,
    selectedAcademicYear,
    selectedDocument,
    filters.controlType,
  ]);

  // Gestion des actions
  const handlePreview = useCallback(async () => {
    const request = buildRequest();
    if (!request) {
      toast.error("Sélectionnez un élève et une année scolaire");
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await bulletinService.previewBulletin(request);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la génération de l'aperçu");
    } finally {
      setIsGenerating(false);
    }
  }, [buildRequest]);

  const handleDownload = useCallback(async () => {
    const request = buildRequest();
    if (!request) {
      toast.error("Sélectionnez un élève et une année scolaire");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await bulletinService.generateBulletin(request);
      const blob = await bulletinService.downloadBulletin(
        result.data.transcriptId
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Document généré avec succès");
      setHistoryRefreshKey((key) => key + 1);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsGenerating(false);
    }
  }, [buildRequest]);

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
            documentType={selectedDocument}
            onFilterChange={handleFilterChange}
          />

          <StudentSelector
            students={students as any}
            selectedStudentId={selectedStudentId}
            searchTerm={searchTerm}
            onSelectStudent={handleSelectStudent}
            onSearchChange={setSearchTerm}
            classLevel={filters.classLevel}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedStudent &&
          (selectedDocument === DocumentType.CERTIFICAT_SCOLARITE ||
            studentGrades.length > 0) ? (
            <>
              {/* En-tête élève */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Code: {selectedStudent.studentCode}</span>
                        <span>
                          Classe: {studentClass?.name || "Non assigné"}
                        </span>
                        <span>Année: {selectedAcademicYear?.year}</span>
                        {selectedDocument === DocumentType.BULLETIN && (
                          <span className="font-medium">
                            Période:{" "}
                            {filters.controlType === "all"
                              ? "Année Complète"
                              : getControlPeriodLabel(
                                  filters.controlType as ControlType
                                )}
                          </span>
                        )}
                        <span className="text-blue-600 font-medium">
                          Document: {selectedDocument.replace("_", " ")}
                        </span>
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

              {selectedDocument === DocumentType.CERTIFICAT_SCOLARITE ? (
                // Certificat de scolarité : justificatif d'inscription, pas de notes
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">
                      Informations d'inscription
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500">Statut</dt>
                        <dd className="font-medium">
                          {selectedStudent.status || "Active"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Classe</dt>
                        <dd className="font-medium">
                          {studentClass?.name || "Non assigné"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Niveau</dt>
                        <dd className="font-medium">
                          {studentClass?.level || "Non assigné"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Année académique</dt>
                        <dd className="font-medium">
                          {selectedAcademicYear?.year}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Statistiques */}
                  <StatisticsPanel
                    statistics={{ ...statistics, average: overallAverage }}
                    controlType={
                      filters.controlType === "all"
                        ? undefined
                        : filters.controlType
                    }
                  />

                  {/* Décision globale (pour "tous les contrôles") */}
                  {filters.controlType === "all" && (
                    <Card className="border-2">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-full ${overallDecision.color
                                .replace("bg-", "bg-")
                                .replace(" text-", " bg-opacity-20")}`}
                            >
                              {overallDecision.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">
                                DÉCISION FINALE
                              </h3>
                              <p className="text-gray-600">
                                {overallDecision.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-center md:text-right">
                            <div className="text-2xl font-bold">
                              {overallAverage.toFixed(2)}/20
                            </div>
                            <div
                              className={`text-lg font-bold mt-2 px-4 py-2 rounded-lg ${overallDecision.color} border`}
                            >
                              {overallDecision.label}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tableau des notes */}
                  {filters.controlType === "all" ? (
                    // Tous les contrôles dans un seul tableau
                    <MultiControlTable
                      grades={prepareGradesForMultiControl()}
                      controlTypes={getControlTypesToShow(filters.controlType)}
                      title="RÉSULTATS ANNÉE SCOLAIRE COMPLÈTE"
                    />
                  ) : (
                    // Un contrôle spécifique
                    <GradesTable
                      grades={
                        studentGrades.map((grade) => ({
                          ...grade,
                          subjectName:
                            grade.subject?.name ||
                            grade.subjectName ||
                            "Matière inconnue",
                          coefficient:
                            grade.coefficient ||
                            grade.subject?.coefficient ||
                            1,
                          maxGrade:
                            grade.maxGrade || grade.subject?.maxGrade || 20,
                          normalizedGrade:
                            grade.normalizedGrade ||
                            normalizeGrade(grade.grade, grade.maxGrade || 20),
                        })) as any
                      }
                      title={getControlPeriodLabel(
                        filters.controlType as ControlType
                      )}
                    />
                  )}
                </>
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
                {selectedStudentId && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedStudentId("");
                        setSearchTerm("");
                      }}
                    >
                      Réinitialiser la sélection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Historique des documents générés */}
          {selectedStudentId && (
            <DocumentHistory
              key={historyRefreshKey}
              studentId={selectedStudentId}
              academicYearId={
                filters.academicYearId === "all"
                  ? undefined
                  : selectedAcademicYear?.id
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
