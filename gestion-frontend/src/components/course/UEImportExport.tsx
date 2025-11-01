// src/components/courses/UEImportExport.tsx
import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Loader2,
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
import { toast } from "@/hooks/use-toast";
import { useUEStore } from "@/store/courseStore";
import { useAuthStore } from "@/store/authStore";

interface ImportResult {
  index: number;
  code: string;
  intitule: string;
  status: "success" | "error";
  message: string;
  data?: any;
}

interface ImportResponse {
  message: string;
  summary: {
    total: number;
    success: number;
    errors: number;
    successRate: string;
  };
  results: ImportResult[];
}

interface UEImportExportProps {
  onClose?: () => void;
}

export const UEImportExport: React.FC<UEImportExportProps> = ({ onClose }) => {
  const { exportUEs, importUEs, downloadTemplate } = useUEStore();
  const { user } = useAuthStore();

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    success: number;
    errors: number;
    successRate: string;
  } | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors du téléchargement du template",
        variant: "destructive",
      });
    }
  };

  const handleExportUEs = async () => {
    try {
      await exportUEs();
    } catch (error: any) {
      toast({
        title: "Erreur d'exportation",
        description:
          error.message || "Une erreur s'est produite lors de l'exportation",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    if (!user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour importer des UEs",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportResults([]);
    setImportSummary(null);

    try {
      console.log("📤 Envoi du fichier UEs:", file.name);

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

      const response = await importUEs(file, user.id);

      clearInterval(progressInterval);
      setImportProgress(100);

      console.log("✅ Réponse serveur UEs:", response);

      // Mettre à jour les résultats
      setImportResults(response.results || []);
      setImportSummary(response.summary);

      // Afficher un toast de résumé
      if (response.summary.errors === 0) {
        toast({
          title: "Importation réussie !",
          description: `Toutes les ${response.summary.success} UEs ont été importées avec succès`,
          variant: "default",
        });
      } else {
        toast({
          title: "Importation partielle",
          description: `${response.summary.success} succès, ${response.summary.errors} erreurs`,
          variant: response.summary.success > 0 ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur import UEs:", error);
      setImportProgress(0);

      let errorMessage = "Erreur lors de l'importation";

      if (error.response) {
        console.error("📋 Réponse erreur:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;

        // Si le serveur renvoie des erreurs détaillées
        if (error.response.data.results) {
          setImportResults(error.response.data.results);
        }
        if (error.response.data.summary) {
          setImportSummary(error.response.data.summary);
        }
      } else if (error.request) {
        errorMessage = "Impossible de contacter le serveur";
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur d'importation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
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
    setImportSummary(null);
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
      {/* Navigation par onglets */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("import")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "import"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Importation
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "export"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Exportation
          </button>
        </nav>
      </div>

      {/* Contenu Importation */}
      {activeTab === "import" && (
        <>
          {/* Section Téléchargement du Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template d'Importation
              </CardTitle>
              <CardDescription>
                Téléchargez le template Excel pour importer des UEs en lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h4 className="font-medium">Instructions :</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Téléchargez le template Excel</li>
                    <li>Remplissez les colonnes avec les données des UEs</li>
                    <li>Les codes UE doivent être uniques</li>
                    <li>Formats acceptés : .xlsx, .xls, .json</li>
                  </ul>
                </div>

                <Button onClick={handleDownloadTemplate} className="gap-2">
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
                Importation des UEs
              </CardTitle>
              <CardDescription>
                Importez un fichier Excel ou JSON contenant les données des
                Unités d'Enseignement
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
                      <h3 className="font-semibold">
                        Déposer votre fichier ici
                      </h3>
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
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement des données...
                    </div>
                  </div>
                )}

                {/* Résultats de l'importation */}
                {importResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        Résultats de l'importation
                      </h4>
                      <Button variant="outline" size="sm" onClick={resetImport}>
                        <X className="h-4 w-4 mr-2" />
                        Nouvel import
                      </Button>
                    </div>

                    {/* Bannière de résumé */}
                    {importSummary && (
                      <div
                        className={`p-4 rounded-lg border ${
                          importSummary.errors === 0
                            ? "bg-green-50 border-green-200"
                            : importSummary.success === 0
                            ? "bg-red-50 border-red-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {importSummary.errors === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : importSummary.success === 0 ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                          <div>
                            <h5
                              className={`font-semibold ${
                                importSummary.errors === 0
                                  ? "text-green-800"
                                  : importSummary.success === 0
                                  ? "text-red-800"
                                  : "text-yellow-800"
                              }`}
                            >
                              {importSummary.errors === 0
                                ? "Importation réussie !"
                                : importSummary.success === 0
                                ? "Importation échouée"
                                : "Importation partielle"}
                            </h5>
                            <p
                              className={`text-sm ${
                                importSummary.errors === 0
                                  ? "text-green-700"
                                  : importSummary.success === 0
                                  ? "text-red-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {importSummary.success} succès,{" "}
                              {importSummary.errors} erreurs
                              {importSummary.successRate &&
                                ` (${importSummary.successRate} de réussite)`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Résumé détaillé */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">
                          {totalCount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total
                        </div>
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

                    {/* Détails des succès */}
                    {successCount > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-green-700">
                          UEs importées avec succès :
                        </h5>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {importResults
                            .filter((result) => result.status === "success")
                            .map((result, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-100 text-green-700"
                                    >
                                      Ligne {result.index}
                                    </Badge>
                                    <span className="text-sm font-medium text-green-800">
                                      {result.code}
                                    </span>
                                  </div>
                                  <p className="text-sm text-green-600 mb-1">
                                    {result.intitule}
                                  </p>
                                  <p className="text-sm text-green-700">
                                    {result.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Détails des erreurs */}
                    {errorCount > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-red-700">
                          Erreurs d'importation :
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
                                    <span className="text-sm font-medium text-red-800">
                                      {result.code || "Code non spécifié"}
                                    </span>
                                  </div>
                                  {result.intitule && (
                                    <p className="text-sm text-red-600 mb-1">
                                      {result.intitule}
                                    </p>
                                  )}
                                  <p className="text-sm text-red-700">
                                    {result.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Contenu Exportation */}
      {activeTab === "export" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportation des UEs
            </CardTitle>
            <CardDescription>
              Exportez toutes les Unités d'Enseignement dans un fichier Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Format d'exportation
                  </h4>
                  <p className="text-sm text-blue-700">
                    Les données seront exportées dans le même format que le
                    template d'importation, permettant une réimportation facile
                    si nécessaire.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <h4 className="font-medium">Colonnes incluses :</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• code</div>
                  <div>• intitule</div>
                  <div>• credits</div>
                  <div>• type</div>
                  <div>• notePassage</div>
                  <div>• description</div>
                </div>
              </div>

              <Button
                onClick={handleExportUEs}
                className="gap-2 w-full"
                size="lg"
              >
                <Download className="h-4 w-4" />
                Exporter toutes les UEs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <code>code</code> - Code unique de l'UE (ex: INFO101)
                </li>
                <li>
                  <code>intitule</code> - Intitulé complet de l'UE
                </li>
                <li>
                  <code>credits</code> - Nombre de crédits ECTS (1-30)
                </li>
                <li>
                  <code>type</code> - Type: "Obligatoire" ou "Optionnelle"
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Colonnes optionnelles :</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code>notePassage</code> - Note de passage (0-100, défaut: 60)
                </li>
                <li>
                  <code>description</code> - Description de l'UE
                </li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 Important</h4>
              <p className="text-blue-700 text-sm">
                Les codes UE doivent être uniques. Les crédits doivent être
                entre 1 et 30. Le type doit être exactement "Obligatoire" ou
                "Optionnelle".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
