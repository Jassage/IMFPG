// components/GradeImportWizard.tsx
import React, { useState } from "react";
import { useGradeStore } from "../store/gradeStore";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { toast } from "./ui/use-toast";
import {
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  RotateCcw,
} from "lucide-react";

interface GradeImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeImportWizard: React.FC<GradeImportWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const { importGradesFromExcel, downloadGradeTemplate, loading } =
    useGradeStore();
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.name.endsWith(".xlsx") ||
        droppedFile.name.endsWith(".xls")
      ) {
        setFile(droppedFile);
      } else {
        toast({
          title: "❌ Format invalide",
          description: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importGradesFromExcel(file);
      setImportResult(result);

      if (result.success) {
        toast({
          title: "✅ Importation réussie",
          description: result.message,
        });
      } else {
        toast({
          title: "⚠️ Importation avec erreurs",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur d'importation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadGradeTemplate();
      toast({
        title: "✅ Template téléchargé",
        description: "Le modèle d'importation a été téléchargé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erreur de téléchargement",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetImport = () => {
    setFile(null);
    setImportResult(null);
  };

  const handleClose = () => {
    resetImport();
    onClose();
  };

  // Calcul des statistiques pour l'affichage
  const getStats = () => {
    if (!importResult) return null;

    return {
      total: importResult.summary?.total || 0,
      created: importResult.summary?.created || 0,
      failed: importResult.summary?.failed || 0,
      successRate: importResult.summary?.successRate || "0%",
    };
  };

  const stats = getStats();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importation des notes
          </DialogTitle>
          <DialogDescription>
            Importez les notes des étudiants depuis un fichier Excel
          </DialogDescription>
        </DialogHeader>

        {!importResult ? (
          <div className="space-y-6">
            {/* Téléchargement du template */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Template d'importation</h4>
                    <p className="text-sm text-muted-foreground">
                      Téléchargez le modèle Excel avec le format requis
                    </p>
                  </div>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="gap-2"
                    disabled={loading}
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Zone de dépôt */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={resetImport}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Changer de fichier
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      Glissez-déposez votre fichier Excel
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ou cliquez pour sélectionner
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <label className="cursor-pointer">
                      Sélectionner un fichier
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Format requis</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • <strong>matricule</strong>: Matricule de l'étudiant
                    (obligatoire)
                  </p>
                  <p>
                    • <strong>codeUE</strong>: Code de l'unité d'enseignement
                    (obligatoire)
                  </p>
                  <p>
                    • <strong>nomUE</strong>: Nom de l'unité d'enseignement
                    (optionnel)
                  </p>
                  <p>
                    • <strong>note</strong>: Note entre 0 et 100 (obligatoire)
                  </p>
                  <p>
                    • <strong>niveau</strong>: Niveau (1, 2, 3, 4, 5)
                    (obligatoire)
                  </p>
                  <p>
                    • <strong>anneeAcademique</strong>: Année académique (ex:
                    2024-2025) (obligatoire)
                  </p>
                  <p>
                    • <strong>semestre</strong>: S1 ou S2 (obligatoire)
                  </p>
                  <p>
                    • <strong>session</strong>: Normale ou Reprise (optionnel,
                    défaut: Normale)
                  </p>
                  <p className="text-xs italic mt-2">
                    Note: Les colonnes doivent respecter exactement ces noms
                  </p>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isImporting}
                className="gap-2"
              >
                {isImporting ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Importation...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importer
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Résultats */}
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  importResult.success && stats?.failed === 0
                    ? "bg-green-50 border border-green-200"
                    : stats?.created > 0
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {importResult.success && stats?.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : stats?.created > 0 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      importResult.success && stats?.failed === 0
                        ? "text-green-800"
                        : stats?.created > 0
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {importResult.message}
                  </span>
                </div>
              </div>

              {/* Statistiques */}
              {stats && (
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.created}
                      </div>
                      <div className="text-sm text-green-600">Succès</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.failed}
                      </div>
                      <div className="text-sm text-red-600">Échecs</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.successRate}
                      </div>
                      <div className="text-sm text-blue-600">
                        Taux de succès
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Barre de progression */}
              {stats && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression de l'importation</span>
                    <span>
                      {stats.created}/{stats.total} ({stats.successRate})
                    </span>
                  </div>
                  <Progress
                    value={(stats.created / stats.total) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Détails des erreurs */}
              {importResult.details?.erreurs &&
                importResult.details.erreurs.length > 0 && (
                  <Card className="border-red-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Erreurs détaillées (
                        {importResult.details.erreurs.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {importResult.details.erreurs.map(
                          (error: any, index: number) => (
                            <div
                              key={index}
                              className="text-sm p-3 bg-red-50 rounded border border-red-100"
                            >
                              <div className="font-medium text-red-800">
                                Ligne {error.ligne}:{" "}
                                {error.errors?.[0] || error.error}
                              </div>
                              {error.matricule && (
                                <div className="text-red-700 text-xs mt-1">
                                  Matricule: {error.matricule} | UE:{" "}
                                  {error.codeUE}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Détails des succès */}
              {importResult.details?.reussites &&
                importResult.details.reussites.length > 0 && (
                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Notes créées ({importResult.details.reussites.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {importResult.details.reussites.map(
                          (success: any, index: number) => (
                            <div
                              key={index}
                              className="text-sm p-3 bg-green-50 rounded border border-green-100"
                            >
                              <div className="font-medium text-green-800">
                                Ligne {success.ligne}: {success.details}
                              </div>
                              <div className="text-green-700 text-xs mt-1">
                                ID: {success.gradeId}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button onClick={resetImport} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Nouvel import
              </Button>
              <Button onClick={handleClose}>Terminer</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
