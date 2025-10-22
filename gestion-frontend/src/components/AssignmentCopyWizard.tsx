// Nouveau composant: AssignmentCopyWizard.tsx
import { useState } from "react";
// import { useAssignmentTemplateStore } from "../stores/assignmentTemplateStore";
// import { useFacultyStore } from "../stores/facultyStore";
// import { useAcademicYearStore } from "../stores/academicYearStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Copy,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useFacultyStore } from "@/store/facultyStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useAssignmentTemplateStore } from "@/store/assignmentTemplateStore";

export const AssignmentCopyWizard = ({
  isOpen,
  onClose,
  currentFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: any;
}) => {
  const { copyAssignments, loading } = useAssignmentTemplateStore();
  const { faculties } = useFacultyStore();
  const { academicYears } = useAcademicYearStore();

  const [step, setStep] = useState(1);
  const [copyData, setCopyData] = useState({
    sourceFacultyId: currentFilters.facultyId,
    sourceLevel: currentFilters.level,
    targetFacultyId: "",
    targetLevel: "",
    academicYearId: currentFilters.academicYearId,
    modifications: {
      professeurId: {}, // Mapping des modifications de professeurs
      semester: {}, // Mapping des semestres
    },
  });

  const [results, setResults] = useState<any>(null);

  const handleCopy = async () => {
    try {
      const result = await copyAssignments(copyData);
      setResults(result);
      setStep(3);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setCopyData({
      sourceFacultyId: currentFilters.facultyId,
      sourceLevel: currentFilters.level,
      targetFacultyId: "",
      targetLevel: "",
      academicYearId: currentFilters.academicYearId,
      modifications: { professeurId: {}, semester: {} },
    });
    setResults(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copier les affectations
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Source */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Source</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Faculté</Label>
                    <Select
                      value={copyData.sourceFacultyId}
                      onValueChange={(value) =>
                        setCopyData((prev) => ({
                          ...prev,
                          sourceFacultyId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <div>
                    <Label>Niveau</Label>
                    <Select
                      value={copyData.sourceLevel}
                      onValueChange={(value) =>
                        setCopyData((prev) => ({ ...prev, sourceLevel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}ère année
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Cible */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Destination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Faculté</Label>
                    <Select
                      value={copyData.targetFacultyId}
                      onValueChange={(value) =>
                        setCopyData((prev) => ({
                          ...prev,
                          targetFacultyId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                  <div>
                    <Label>Niveau</Label>
                    <Select
                      value={copyData.targetLevel}
                      onValueChange={(value) =>
                        setCopyData((prev) => ({ ...prev, targetLevel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}ère année
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Label>Année académique</Label>
              <Select
                value={copyData.academicYearId}
                onValueChange={(value) =>
                  setCopyData((prev) => ({ ...prev, academicYearId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                Annuler
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!copyData.targetFacultyId || !copyData.targetLevel}
              >
                Continuer
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Aperçu de la copie</h4>
              <p>
                Les affectations seront copiées avec possibilité de modification
                individuelle.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button onClick={handleCopy}>Exécuter la copie</Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && results && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Copie terminée</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Créées</div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.summary.created}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Erreurs</div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.summary.errors}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Ignorées</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.summary.skipped}
                  </div>
                </div>
              </div>
            </div>

            {results.details.errors.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Erreurs rencontrées</span>
                </div>
                <div className="text-sm space-y-1">
                  {results.details.errors
                    .slice(0, 3)
                    .map((error: any, index: number) => (
                      <div key={index}>• {error.error}</div>
                    ))}
                  {results.details.errors.length > 3 && (
                    <div>
                      ... et {results.details.errors.length - 3} autres erreurs
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={resetAndClose}>Terminer</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
