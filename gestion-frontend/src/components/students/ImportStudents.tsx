// src/components/students/ImportStudents.tsx
import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import useStudentStore from "@/store/studentStore";
import { toast } from "@/hooks/use-toast";

interface ImportResult {
  index: number;
  studentId: string;
  status: "success" | "error";
  message: string;
  data?: any;
}

export const ImportStudents: React.FC = () => {
  const { importStudents, downloadImportTemplate, loading } =
    useStudentStore();
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      await downloadImportTemplate();
      toast({
        title: "Template téléchargé",
        description: "Le template d'importation a été téléchargé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors du téléchargement du template",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|json)$/i)
    ) {
      toast({
        title: "Format non supporté",
        description:
          "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou JSON",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    handleImport(file);
  };

  const handleImport = async (file: File) => {
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResults([]);

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await importStudents(file);

      clearInterval(progressInterval);
      setImportProgress(100);

      setImportResults(result.results || []);

      // Afficher le résumé
      const successCount =
        result.results?.filter((r: ImportResult) => r.status === "success")
          .length || 0;
      const errorCount =
        result.results?.filter((r: ImportResult) => r.status === "error")
          .length || 0;

      toast({
        title: "Importation terminée",
        description: `${successCount} étudiants importés avec succès, ${errorCount} erreurs`,
        variant: errorCount > 0 ? "destructive" : "default",
      });
    } catch (error: any) {
      setImportProgress(0);
      toast({
        title: "Erreur d'importation",
        description:
          error.message || "Une erreur s'est produite lors de l'importation",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      handleImport(file);
    }
  };

  const resetImport = () => {
    setFileName("");
    setImportResults([]);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const successCount = importResults.filter(
    (r) => r.status === "success"
  ).length;
  const errorCount = importResults.filter((r) => r.status === "error").length;
  const totalCount = importResults.length;

  return (
    <div className="space-y-6">
      {/* Section Téléchargement du Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template d'Importation
          </CardTitle>
          <CardDescription>
            Téléchargez le template Excel pour importer des étudiants en lot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <h4 className="font-medium">Instructions :</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Téléchargez le template Excel</li>
                <li>Remplissez les colonnes avec les données des étudiants</li>
                <li>Conservez la structure du fichier</li>
                <li>Formats acceptés : .xlsx, .xls, .json</li>
                <li>Groupes sanguins : A+, A-, B+, B-, AB+, AB-, O+, O-</li>
              </ul>
            </div>

            <Button
              onClick={handleDownloadTemplate}
              disabled={loading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger le Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Importation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importation des Étudiants
          </CardTitle>
          <CardDescription>
            Importez un fichier Excel ou JSON contenant les données des
            étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Zone de dépôt de fichier */}
            {!isImporting && importResults.length === 0 && (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Déposer votre fichier ici</h3>
                  <p className="text-sm text-muted-foreground">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats supportés: .xlsx, .xls, .json (Max 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Progression de l'importation */}
            {isImporting && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Importation en cours... {fileName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {importProgress}%
                  </span>
                </div>
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Veuillez patienter pendant l'importation des données...
                </p>
              </div>
            )}

            {/* Résultats de l'importation */}
            {importResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Résultats de l'importation</h4>
                  <Button variant="outline" size="sm" onClick={resetImport}>
                    <X className="h-4 w-4 mr-2" />
                    Nouvel import
                  </Button>
                </div>

                {/* Résumé */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {totalCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {successCount}
                    </div>
                    <div className="text-sm text-green-600">Succès</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {errorCount}
                    </div>
                    <div className="text-sm text-red-600">Erreurs</div>
                  </div>
                </div>

                {/* Liste détaillée des résultats */}
                {errorCount > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">
                      Détails des erreurs :
                    </h5>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {importResults
                        .filter((result) => result.status === "error")
                        .map((result, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Ligne {result.index}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {result.studentId || "ID non spécifié"}
                                </span>
                              </div>
                              <p className="text-sm text-red-700">
                                {result.message}
                              </p>
                              {result.data && (
                                <details className="mt-2">
                                  <summary className="text-xs text-red-600 cursor-pointer">
                                    Voir les données
                                  </summary>
                                  <pre className="text-xs bg-white p-2 mt-1 rounded border overflow-x-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Succès */}
                {successCount > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">
                      Importations réussies :
                    </h5>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {importResults
                        .filter((result) => result.status === "success")
                        .slice(0, 10) // Limiter l'affichage
                        .map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  Ligne {result.index}
                                </Badge>
                                <span className="text-sm font-medium truncate">
                                  {result.studentId}
                                </span>
                              </div>
                              <p className="text-sm text-green-700 truncate">
                                {result.message}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    {successCount > 10 && (
                      <p className="text-sm text-muted-foreground text-center">
                        ... et {successCount - 10} autres importations réussies
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions détaillées */}
      <Card>
        <CardHeader>
          <CardTitle>Guide d'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Colonnes obligatoires :</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>firstName</code> - Prénom de l'étudiant
                </li>
                <li>
                  <code>lastName</code> - Nom de l'étudiant
                </li>
                <li>
                  <code>studentId</code> - Matricule unique
                </li>
                <li>
                  <code>email</code> - Adresse email
                </li>
                <li>
                  <code>guardianFirstName</code> - Prénom du tuteur
                </li>
                <li>
                  <code>guardianLastName</code> - Nom du tuteur
                </li>
                <li>
                  <code>guardianRelationship</code> - Relation avec l'étudiant
                </li>
                <li>
                  <code>guardianPhone</code> - Téléphone du tuteur
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Colonnes optionnelles :</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>phone</code> - Téléphone de l'étudiant
                </li>
                <li>
                  <code>dateOfBirth</code> - Date de naissance (YYYY-MM-DD)
                </li>
                <li>
                  <code>placeOfBirth</code> - Lieu de naissance
                </li>
                <li>
                  <code>address</code> - Adresse
                </li>
                <li>
                  <code>bloodGroup</code> - Groupe sanguin (A+, A-, B+, B-, AB+,
                  AB-, O+, O-)
                </li>
                <li>
                  <code>allergies</code> - Allergies
                </li>
                <li>
                  <code>disabilities</code> - Handicaps
                </li>
                <li>
                  <code>cin</code> - Numéro CIN
                </li>
                <li>
                  <code>sexe</code> - Sexe (Masculin, Feminin, Autre)
                </li>
                <li>
                  <code>status</code> - Statut (Active, Inactive, Graduated,
                  Suspended)
                </li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 Conseil</h4>
              <p className="text-blue-700 text-sm">
                Téléchargez d'abord le template pour voir la structure exacte
                attendue. Les numéros de téléphone doivent contenir uniquement
                des chiffres (ex: 0612345678).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
