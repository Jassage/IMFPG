import { useState, useEffect } from "react";
import { useCourseAssignmentStore } from "../store/courseAssignmentStore";
import { useFacultyStore } from "../store/facultyStore";
import { useAcademicYearStore } from "../store/academicYearStore";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import {
  Copy,
  CheckCircle,
  AlertCircle,
  SkipForward,
  Users,
  BookOpen,
  School,
  Calendar,
  RotateCcw,
} from "lucide-react";

interface AssignmentCopyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: {
    facultyId: string;
    level: string;
    academicYearId: string;
    semester: string;
  };
}

export const AssignmentCopyWizard: React.FC<AssignmentCopyWizardProps> = ({
  isOpen,
  onClose,
  currentFilters,
}) => {
  const { copyAssignments, loading } = useCourseAssignmentStore();
  const { faculties } = useFacultyStore();
  const { academicYears } = useAcademicYearStore();

  const [step, setStep] = useState(1);
  const [copyData, setCopyData] = useState({
    // Source (basé sur les filtres actuels)
    sourceFacultyId: currentFilters.facultyId,
    sourceLevel: currentFilters.level,
    sourceAcademicYearId: currentFilters.academicYearId,
    sourceSemester: currentFilters.semester,

    // Cible
    targetFacultyId: "",
    targetLevel: "",
    targetAcademicYearId: "",
    targetSemester: "S1",

    // Options
    copyProfessors: true,
    conflictResolution: "skip" as "skip" | "override" | "merge",
    customMappings: {},
  });

  const [result, setResult] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);

  // Réinitialiser quand le dialogue s'ouvre
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCopyData({
        sourceFacultyId: currentFilters.facultyId,
        sourceLevel: currentFilters.level,
        sourceAcademicYearId: currentFilters.academicYearId,
        sourceSemester: currentFilters.semester,
        targetFacultyId: "",
        targetLevel: "",
        targetAcademicYearId: "",
        targetSemester: "S1",
        copyProfessors: true,
        conflictResolution: "skip",
        customMappings: {},
      });
      setResult(null);
    }
  }, [isOpen, currentFilters]);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const result = await copyAssignments(copyData);
      setResult(result);
      setStep(4); // Aller à l'étape des résultats

      if (result.success) {
        toast({
          title: "✅ Copie réussie",
          description: ` ${result.summary.results.created} affectations créées avec succès`,
        });
      } else {
        toast({
          title: "❌ Erreur lors de la copie",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la copie",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const getFacultyName = (id: string) => {
    return faculties.find((f) => f.id === id)?.name || id;
  };

  const getAcademicYearName = (id: string) => {
    return academicYears.find((ay) => ay.id === id)?.year || id;
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      "1": "1ère année",
      "2": "2ème année",
      "3": "3ème année",
      "4": "4ème année",
      "5": "5ème année",
    };
    return levels[level] || `${level}ème année`;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Source des affectations</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les affectations à copier
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div className="space-y-2">
          <Label>Faculté source</Label>
          <div className="p-2 bg-background rounded border">
            {getFacultyName(copyData.sourceFacultyId)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Niveau source</Label>
          <div className="p-2 bg-background rounded border">
            {getLevelLabel(copyData.sourceLevel)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Année académique source</Label>
          <div className="p-2 bg-background rounded border">
            {getAcademicYearName(copyData.sourceAcademicYearId)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Semestre source</Label>
          <div className="p-2 bg-background rounded border">
            {copyData.sourceSemester === "S1" ? "Semestre 1" : "Semestre 2"}
          </div>
        </div>
      </div>

      <Button onClick={() => setStep(2)} className="w-full">
        Continuer
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Destination</h3>
        <p className="text-sm text-muted-foreground">
          Où voulez-vous copier ces affectations ?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetFaculty">Faculté de destination</Label>
          <Select
            value={copyData.targetFacultyId}
            onValueChange={(value) =>
              setCopyData((prev) => ({ ...prev, targetFacultyId: value }))
            }
          >
            <SelectTrigger id="targetFaculty">
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

        <div className="space-y-2">
          <Label htmlFor="targetLevel">Niveau de destination</Label>
          <Select
            value={copyData.targetLevel}
            onValueChange={(value) =>
              setCopyData((prev) => ({ ...prev, targetLevel: value }))
            }
          >
            <SelectTrigger id="targetLevel">
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1ère année</SelectItem>
              <SelectItem value="2">2ème année</SelectItem>
              <SelectItem value="3">3ème année</SelectItem>
              <SelectItem value="4">4ème année</SelectItem>
              <SelectItem value="5">5ème année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAcademicYear">
            Année académique de destination
          </Label>
          <Select
            value={copyData.targetAcademicYearId}
            onValueChange={(value) =>
              setCopyData((prev) => ({ ...prev, targetAcademicYearId: value }))
            }
          >
            <SelectTrigger id="targetAcademicYear">
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

        <div className="space-y-2">
          <Label htmlFor="targetSemester">Semestre de destination</Label>
          <Select
            value={copyData.targetSemester}
            onValueChange={(value: "S1" | "S2") =>
              setCopyData((prev) => ({ ...prev, targetSemester: value }))
            }
          >
            <SelectTrigger id="targetSemester">
              <SelectValue placeholder="Sélectionner un semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">Semestre 1</SelectItem>
              <SelectItem value="S2">Semestre 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Retour
        </Button>
        <Button
          onClick={() => setStep(3)}
          className="flex-1"
          disabled={
            !copyData.targetFacultyId ||
            !copyData.targetLevel ||
            !copyData.targetAcademicYearId
          }
        >
          Continuer
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Options de copie</h3>
        <p className="text-sm text-muted-foreground">
          Configurez les paramètres de la copie
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="copyProfessors">Copier les professeurs</Label>
            <p className="text-sm text-muted-foreground">
              Garder les mêmes professeurs pour les affectations copiées
            </p>
          </div>
          <input
            type="checkbox"
            id="copyProfessors"
            checked={copyData.copyProfessors}
            onChange={(e) =>
              setCopyData((prev) => ({
                ...prev,
                copyProfessors: e.target.checked,
              }))
            }
            className="h-4 w-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conflictResolution">Gestion des conflits</Label>
          <Select
            value={copyData.conflictResolution}
            onValueChange={(value: "skip" | "override" | "merge") =>
              setCopyData((prev) => ({ ...prev, conflictResolution: value }))
            }
          >
            <SelectTrigger id="conflictResolution">
              <SelectValue placeholder="Choisir une action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skip">
                <div className="flex items-center gap-2">
                  <SkipForward className="h-4 w-4" />
                  Ignorer les doublons
                </div>
              </SelectItem>
              <SelectItem value="override">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Remplacer les doublons
                </div>
              </SelectItem>
              <SelectItem value="merge">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Fusionner (garder l'existant)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900">Résumé de la copie</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Source:</span>
                <span>
                  {getFacultyName(copyData.sourceFacultyId)} -{" "}
                  {getLevelLabel(copyData.sourceLevel)} -{" "}
                  {getAcademicYearName(copyData.sourceAcademicYearId)} -{" "}
                  {copyData.sourceSemester}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>
                  {getFacultyName(copyData.targetFacultyId)} -{" "}
                  {getLevelLabel(copyData.targetLevel)} -{" "}
                  {getAcademicYearName(copyData.targetAcademicYearId)} -{" "}
                  {copyData.targetSemester}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleCopy}
          className="flex-1 gap-2"
          disabled={isCopying}
        >
          {isCopying ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin" />
              Copie en cours...
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Lancer la copie
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Résultats de la copie</h3>
        <p className="text-sm text-muted-foreground">
          Résumé de l'opération de copie
        </p>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={
                result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={
                      result.success
                        ? "text-green-800 font-medium"
                        : "text-red-800 font-medium"
                    }
                  >
                    {result.success ? "Copie réussie" : "Échec de la copie"}
                  </span>
                </div>
                <p
                  className={
                    result.success
                      ? "text-green-600 text-sm mt-1"
                      : "text-red-600 text-sm mt-1"
                  }
                >
                  {result.message}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-center">
                  {result.summary?.results?.created || 0}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Affectations créées
                </p>
              </CardContent>
            </Card>
          </div>

          {result.details && (
            <div className="space-y-3">
              {result.details.errors && result.details.errors.length > 0 && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">
                        Erreurs ({result.details.errors.length})
                      </span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {result.details.errors.map(
                        (error: any, index: number) => (
                          <div key={index} className="text-sm text-red-700">
                            • {error.error}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.details.skipped && result.details.skipped.length > 0 && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SkipForward className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Ignorées ({result.details.skipped.length})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      <Button onClick={onClose} className="w-full">
        Terminer
      </Button>
    </div>
  );

  const steps = [
    { number: 1, title: "Source", component: renderStep1 },
    { number: 2, title: "Destination", component: renderStep2 },
    { number: 3, title: "Options", component: renderStep3 },
    { number: 4, title: "Résultats", component: renderStep4 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copie des affectations
          </DialogTitle>
          <DialogDescription>
            Copiez les affectations d'une configuration vers une autre
          </DialogDescription>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepItem.number
                    ? "bg-primary text-primary-foreground"
                    : step > stepItem.number
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > stepItem.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  stepItem.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 ${
                    step > stepItem.number ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Contenu de l'étape */}
        {steps.find((s) => s.number === step)?.component()}
      </DialogContent>
    </Dialog>
  );
};
