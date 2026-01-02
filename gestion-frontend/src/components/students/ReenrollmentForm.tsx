// ReenrollmentForm.tsx - Version avec débogage
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Clock,
  Info,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import useClassStore from "@/store/classStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { toast } from "sonner";
import {
  isValidLevelTransition,
  ClassLevelType,
  formatClassLevel,
} from "@/types/classLevels";

interface ReenrollmentFormProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentCode: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

// Définir la fonction utilitaire AVANT le composant
const getAllowedNextLevels = (
  currentLevel: string,
  academicStatus: string
): string[] => {
  const nextLevels: string[] = [];

  // Toujours permettre le même niveau (redoublement)
  nextLevels.push(currentLevel);

  // Ajouter les niveaux supérieurs si l'élève a réussi ou n'a pas de notes
  if (academicStatus === "Passed" || academicStatus === "NoGrades") {
    const normalTransitions: Record<string, string[]> = {
      Sixieme: ["Cinquieme"],
      Cinquieme: ["Quatrieme"],
      Quatrieme: ["Troisieme", "NSI"],
      Troisieme: ["Seconde"],
      Seconde: ["Premiere"],
      Premiere: ["Terminale"],
      Terminale: [],
      NSI: ["NSII"],
      NSII: ["NSIII"],
      NSIII: ["NSIV"],
      NSIV: [],
    };

    nextLevels.push(...(normalTransitions[currentLevel] || []));
  }

  return Array.from(new Set(nextLevels)); // Éliminer les doublons
};

export const ReenrollmentForm: React.FC<ReenrollmentFormProps> = ({
  student,
  onClose,
  onSuccess,
}) => {
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { classes, fetchClasses } = useClassStore();
  const { reenrollStudent, validateReenrollment, getStudentEnrollmentHistory } =
    useEnrollmentStore();

  const [formData, setFormData] = useState({
    classId: "",
    academicYearId: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    notes: "",
    previousAcademicYearId: "",
    previousEnrollmentId: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [availablePreviousYears, setAvailablePreviousYears] = useState<any[]>(
    []
  );
  const [availableTargetYears, setAvailableTargetYears] = useState<any[]>([]);
  const [enrollmentToAcademicYearMap, setEnrollmentToAcademicYearMap] =
    useState<Record<string, string>>({});

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // 1. Charger toutes les années académiques d'abord
        await fetchAcademicYears();
        await fetchClasses();

        const currentAcademicYears = academicYears || [];
        console.log("Années académiques chargées:", currentAcademicYears);

        // 2. Valider la réinscription
        const validation = await validateReenrollment(student.id);

        if (!validation.success) {
          toast.error(validation.message || "Erreur lors de la validation");
          onClose();
          return;
        }

        setValidationResult(validation.data?.validation);

        // 3. Récupérer l'historique des inscriptions
        const enrollmentHistory = await getStudentEnrollmentHistory(student.id);

        console.log("Historique des inscriptions:", enrollmentHistory);

        if (enrollmentHistory.success && enrollmentHistory.data?.history) {
          const enrollments = enrollmentHistory.data.history;

          // Créer une carte pour mapper les noms d'années académiques aux IDs
          const academicYearMap: Record<string, any> = {};
          currentAcademicYears.forEach((ay: any) => {
            academicYearMap[ay.year] = ay.id;
            academicYearMap[ay.name] = ay.id;
            academicYearMap[ay.academicYear] = ay.id;
          });

          console.log("Carte des années académiques:", academicYearMap);

          // Mapper les inscriptions aux années académiques
          const previousYears = [];
          const enrollmentYearMap: Record<string, string> = {};

          for (const enrollment of enrollments) {
            if (
              enrollment.status === "Completed" ||
              enrollment.status === "Active"
            ) {
              // Trouver l'ID de l'année académique correspondante
              let academicYearId = "";

              // Essayer de trouver par academicYear (ex: "2024-2025")
              if (
                enrollment.academicYear &&
                academicYearMap[enrollment.academicYear]
              ) {
                academicYearId = academicYearMap[enrollment.academicYear];
              } else {
                // Si non trouvé, chercher l'année qui correspond
                const matchingYear = currentAcademicYears.find(
                  (ay: any) =>
                    ay.year === enrollment.academicYear ||
                    ay.name === enrollment.academicYear ||
                    ay.academicYear === enrollment.academicYear
                );
                if (matchingYear) {
                  academicYearId = matchingYear.id;
                }
              }

              if (academicYearId) {
                const yearData = {
                  id: academicYearId, // ID de l'année académique
                  academicYear: enrollment.academicYear || "Inconnu",
                  enrollmentId: enrollment.id, // ID de l'inscription
                  enrollmentDate: enrollment.enrollmentDate,
                  status: enrollment.status,
                  className: enrollment.className || "N/A",
                  classLevel: enrollment.classLevel,
                  classId: enrollment.classId,
                };

                previousYears.push(yearData);
                enrollmentYearMap[enrollment.id] = academicYearId;
              } else {
                console.warn(
                  "Année académique non trouvée pour:",
                  enrollment.academicYear
                );
              }
            }
          }

          console.log("Années précédentes mappées:", previousYears);
          console.log("Carte des inscriptions:", enrollmentYearMap);

          setAvailablePreviousYears(previousYears);
          setEnrollmentToAcademicYearMap(enrollmentYearMap);

          // Sélectionner la plus récente par défaut
          if (previousYears.length > 0) {
            const mostRecent = previousYears[0];
            console.log("Année sélectionnée par défaut:", mostRecent);

            setFormData((prev) => ({
              ...prev,
              previousAcademicYearId: mostRecent.id,
              previousEnrollmentId: mostRecent.enrollmentId,
            }));
          }
        }

        // 4. Préparer les années cibles
        const currentYear = currentAcademicYears.find(
          (ay: any) => ay.isCurrent
        );
        const futureYears = currentAcademicYears.filter(
          (ay: any) => !ay.isCurrent && new Date(ay.startDate) > new Date()
        );

        const targetYears = currentYear
          ? [currentYear, ...futureYears]
          : futureYears;

        const sortedTargetYears = [...targetYears].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

        setAvailableTargetYears(sortedTargetYears);

        console.log("Années cibles disponibles:", sortedTargetYears);

        // 5. Définir l'année cible par défaut
        if (currentYear) {
          setFormData((prev) => ({
            ...prev,
            academicYearId: currentYear.id,
          }));
        } else if (sortedTargetYears.length > 0) {
          setFormData((prev) => ({
            ...prev,
            academicYearId: sortedTargetYears[0].id,
          }));
        }
      } catch (error) {
        console.error("Erreur initialisation:", error);
        toast.error("Erreur lors de la validation de la réinscription");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [student.id]);

  // Gérer le changement de l'année précédente
  const handlePreviousYearChange = (value: string) => {
    console.log("Année précédente sélectionnée (ID):", value);

    // Trouver l'inscription correspondante à cette année académique
    const selectedYear = availablePreviousYears.find(
      (year) => year.id === value
    );

    if (selectedYear) {
      console.log("Inscription trouvée:", selectedYear);

      setFormData((prev) => ({
        ...prev,
        previousAcademicYearId: value,
        previousEnrollmentId: selectedYear.enrollmentId,
      }));
    } else {
      console.error("Aucune inscription trouvée pour l'année:", value);
    }
  };

  // Filtrer les classes disponibles en fonction du statut académique
  const getFilteredClasses = useMemo(() => {
    console.log("=== DÉBUT getFilteredClasses ===");
    console.log("Classes disponibles:", classes?.length);
    console.log("Année académique cible:", formData.academicYearId);
    console.log(
      "Année précédente sélectionnée:",
      formData.previousAcademicYearId
    );

    if (!classes || !formData.academicYearId) {
      console.log("Retour vide: pas de classes ou pas d'année cible");
      return [];
    }

    const selectedPreviousYear = availablePreviousYears.find(
      (year) => year.id === formData.previousAcademicYearId
    );

    console.log("Année précédente trouvée:", selectedPreviousYear);

    if (!selectedPreviousYear?.classLevel) {
      console.log("Retour toutes les classes: pas de niveau précédent");
      return classes.filter(
        (cls: any) =>
          !cls.academicYearId || cls.academicYearId === formData.academicYearId
      );
    }

    // Déterminer le statut académique
    const academicStatus =
      validationResult?.details?.academic?.passed === false
        ? "Failed"
        : validationResult?.details?.academic?.passed === true
        ? "Passed"
        : "NoGrades";

    console.log("Statut académique:", academicStatus);
    console.log("Niveau précédent:", selectedPreviousYear.classLevel);

    // Obtenir les niveaux autorisés
    const allowedLevels = getAllowedNextLevels(
      selectedPreviousYear.classLevel,
      academicStatus
    );

    console.log("Niveaux autorisés:", allowedLevels);

    const filtered = classes.filter((cls: any) => {
      // Vérifier d'abord si la classe est pour la bonne année académique
      const isForTargetYear =
        !cls.academicYearId || cls.academicYearId === formData.academicYearId;

      if (!isForTargetYear) {
        console.log(
          `Classe ${cls.name} ignorée: mauvaise année (${cls.academicYearId} vs ${formData.academicYearId})`
        );
        return false;
      }

      // Vérifier si le niveau est autorisé
      const isLevelAllowed = allowedLevels.includes(cls.level);

      if (!isLevelAllowed) {
        console.log(
          `Classe ${cls.name} ignorée: niveau ${cls.level} non autorisé`
        );
      }

      return isLevelAllowed;
    });

    console.log("Classes filtrées:", filtered.length);
    console.log("=== FIN getFilteredClasses ===");

    return filtered;
  }, [
    classes,
    formData.academicYearId,
    formData.previousAcademicYearId,
    validationResult,
    availablePreviousYears,
  ]);

  // Afficher également les classes disponibles sans filtre pour débogage
  const debugClasses = useMemo(() => {
    if (!classes || !formData.academicYearId) return [];
    return classes.filter(
      (cls: any) =>
        !cls.academicYearId || cls.academicYearId === formData.academicYearId
    );
  }, [classes, formData.academicYearId]);

  // Modifier le handler du changement de classe
  const handleClassChange = async (value: string) => {
    console.log("Classe sélectionnée:", value);
    setFormData({ ...formData, classId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Données du formulaire avant soumission:", formData);

    // Validation des données
    if (
      !formData.classId ||
      !formData.academicYearId ||
      !formData.previousAcademicYearId ||
      !formData.previousEnrollmentId
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation de la date de réinscription
    const enrollmentDate = new Date(formData.enrollmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (enrollmentDate > today) {
      toast.error("La date de réinscription ne peut pas être dans le futur");
      return;
    }

    // Vérifier que l'année académique précédente existe bien
    const previousYearExists = academicYears?.some(
      (ay: any) => ay.id === formData.previousAcademicYearId
    );
    if (!previousYearExists) {
      toast.error(
        "L'année académique précédente sélectionnée n'existe pas dans le système"
      );
      return;
    }

    // Vérifier que l'année cible est différente
    if (formData.academicYearId === formData.previousAcademicYearId) {
      toast.error("L'année cible doit être différente de l'année précédente");
      return;
    }

    try {
      setSubmitting(true);

      const payload: any = {
        studentId: student.id,
        classId: formData.classId,
        academicYearId: formData.academicYearId,
        previousAcademicYearId: formData.previousAcademicYearId,
        previousEnrollmentId: formData.previousEnrollmentId,
        enrollmentDate: formData.enrollmentDate,
        notes: formData.notes,
      };

      console.log("Envoi de la réinscription avec:", payload);

      const result = await reenrollStudent(payload);

      if (result.success) {
        toast.success("Réinscription effectuée avec succès");
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Erreur lors de la réinscription");
      }
    } catch (error: any) {
      console.error("Erreur réinscription:", error);

      // Afficher plus de détails sur l'erreur
      if (error.response?.data) {
        console.error("Détails de l'erreur:", error.response.data);
        toast.error(`Erreur: ${error.response.data.message || error.message}`);
      } else {
        toast.error(error.message || "Erreur lors de la réinscription");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé de validation */}
      {validationResult && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Validation de réinscription</h4>
                </div>
                <Badge
                  variant={
                    validationResult.canReenroll ? "default" : "destructive"
                  }
                  className="gap-1"
                >
                  {validationResult.canReenroll ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Éligible
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      Non éligible
                    </>
                  )}
                </Badge>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm font-medium text-blue-800">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-sm text-blue-600">
                  Code: {student.studentCode}
                </p>
              </div>

              {/* Affichage des résultats académiques */}
              {validationResult.details?.academic && (
                <div
                  className={`p-3 rounded ${
                    validationResult.details.academic.passed === false
                      ? "bg-amber-50 text-amber-800"
                      : validationResult.details.academic.passed === true
                      ? "bg-green-50 text-green-800"
                      : "bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {validationResult.details.academic.passed === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : validationResult.details.academic.passed === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {validationResult.details.academic.passed === false
                          ? `Échec - Moyenne: ${
                              validationResult.details.academic.averageGrade?.toFixed(
                                2
                              ) || "N/A"
                            }/100`
                          : validationResult.details.academic.passed === true
                          ? `Réussite - Moyenne: ${
                              validationResult.details.academic.averageGrade?.toFixed(
                                2
                              ) || "N/A"
                            }/100`
                          : "Aucune note disponible"}
                      </p>
                      {validationResult.details.academic.passed === false && (
                        <p className="text-xs mt-1">Redoublement recommandé</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      {validationResult && validationResult.details?.recommendations && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Recommandations
              </h4>
              {validationResult.details.recommendations.map(
                (rec: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded ${
                      rec.type === "error"
                        ? "bg-red-50 text-red-800"
                        : rec.type === "warning"
                        ? "bg-amber-50 text-amber-800"
                        : rec.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-blue-50 text-blue-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {rec.type === "error" && (
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                      )}
                      {rec.type === "warning" && (
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                      )}
                      {rec.type === "success" && (
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                      )}
                      {rec.type === "info" && (
                        <Info className="h-4 w-4 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{rec.message}</p>
                        {rec.action && (
                          <p className="text-xs mt-1 opacity-90">
                            {rec.action}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Année précédente */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Année académique précédente *
          </Label>

          <Select
            value={formData.previousAcademicYearId}
            onValueChange={handlePreviousYearChange}
            required
            disabled={submitting || availablePreviousYears.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  availablePreviousYears.length === 0
                    ? "Aucune année précédente disponible"
                    : formData.previousAcademicYearId
                    ? `Sélectionnée: ${
                        availablePreviousYears.find(
                          (y) => y.id === formData.previousAcademicYearId
                        )?.academicYear || "..."
                      }`
                    : "Sélectionner l'année précédente"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availablePreviousYears.length === 0 ? (
                <div className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Aucune inscription précédente trouvée
                  </p>
                </div>
              ) : (
                availablePreviousYears.map((year, index) => (
                  <SelectItem key={`prev-${year.id}-${index}`} value={year.id}>
                    <div className="flex items-center justify-between">
                      <span>{year.academicYear}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {year.className}
                        </Badge>
                        {year.status === "Active" && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Niveau: {formatClassLevel(year.classLevel)}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Année cible */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Nouvelle année académique *
          </Label>
          <Select
            value={formData.academicYearId}
            onValueChange={(value) => {
              console.log("Année cible sélectionnée:", value);
              setFormData({ ...formData, academicYearId: value, classId: "" });
            }}
            required
            disabled={submitting || availableTargetYears.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  availableTargetYears.length === 0
                    ? "Aucune année cible disponible"
                    : "Sélectionner la nouvelle année"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableTargetYears.length === 0 ? (
                <div className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Aucune année académique disponible
                  </p>
                </div>
              ) : (
                availableTargetYears
                  .filter(
                    (year: any) => year.id !== formData.previousAcademicYearId
                  )
                  .map((year: any) => (
                    <SelectItem key={year.id} value={year.id}>
                      <div className="flex items-center justify-between">
                        <span>
                          {year.year ||
                            year.name ||
                            year.academicYear ||
                            `Année ${year.id.substring(0, 8)}`}
                        </span>
                        {year.isCurrent && (
                          <Badge variant="default" className="ml-2 text-xs">
                            En cours
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Classe - Version simplifiée pour débogage */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Nouvelle classe *
          </Label>

          {/* Afficher d'abord toutes les classes disponibles pour débogage */}
          {debugClasses.length > 0 && getFilteredClasses.length === 0 && (
            <div className="text-sm text-amber-600 mb-2">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Aucune classe ne correspond aux critères. Voici toutes les classes
              disponibles pour {formData.academicYearId}:
              <div className="mt-1 text-xs">
                {debugClasses.map((cls: any) => (
                  <div key={cls.id}>
                    {cls.name} - Niveau: {cls.level} - ID: {cls.academicYearId}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Select
            value={formData.classId}
            onValueChange={handleClassChange}
            required
            disabled={submitting || getFilteredClasses.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  getFilteredClasses.length === 0
                    ? `Aucune classe disponible (${debugClasses.length} classes pour cette année)`
                    : "Sélectionner la nouvelle classe"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {getFilteredClasses.length === 0 ? (
                <div className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Aucune classe disponible pour la sélection actuelle
                  </p>
                  {debugClasses.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p>
                        Classes disponibles pour l'année{" "}
                        {formData.academicYearId}:
                      </p>
                      <div className="mt-1 space-y-1">
                        {debugClasses.slice(0, 5).map((cls: any) => (
                          <div key={cls.id} className="text-gray-600">
                            {cls.name} - {formatClassLevel(cls.level)}
                          </div>
                        ))}
                        {debugClasses.length > 5 && (
                          <div className="text-gray-500">
                            ... et {debugClasses.length - 5} autres
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                (() => {
                  const selectedPreviousYear = availablePreviousYears.find(
                    (year) => year.id === formData.previousAcademicYearId
                  );

                  const sameLevelClasses = getFilteredClasses.filter(
                    (cls: any) => cls.level === selectedPreviousYear?.classLevel
                  );

                  const nextLevelClasses = getFilteredClasses.filter(
                    (cls: any) => cls.level !== selectedPreviousYear?.classLevel
                  );

                  return (
                    <>
                      {/* Section redoublement (même niveau) */}
                      {sameLevelClasses.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs font-semibold text-amber-600 bg-amber-50">
                            Redoublement (même niveau)
                          </div>
                          {sameLevelClasses.map((cls: any) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              <div className="flex items-center justify-between">
                                <span>{cls.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-800"
                                  >
                                    {formatClassLevel(cls.level)}
                                  </Badge>
                                  {cls.id === selectedPreviousYear?.classId && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Ancienne classe
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-amber-600 mt-1">
                                Même niveau que l'année précédente
                              </div>
                            </SelectItem>
                          ))}
                        </>
                      )}

                      {/* Section passage (niveau supérieur) */}
                      {nextLevelClasses.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-50 mt-2">
                            Passage au niveau supérieur
                          </div>
                          {nextLevelClasses.map((cls: any) => {
                            const transitionValidation = isValidLevelTransition(
                              selectedPreviousYear?.classLevel as ClassLevelType,
                              cls.level as ClassLevelType
                            );

                            return (
                              <SelectItem key={cls.id} value={cls.id}>
                                <div className="flex items-center justify-between">
                                  <span>{cls.name}</span>
                                  <Badge variant="outline">
                                    {formatClassLevel(cls.level)}
                                  </Badge>
                                </div>
                                {!transitionValidation.valid && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {transitionValidation.reason}
                                  </div>
                                )}
                              </SelectItem>
                            );
                          })}
                        </>
                      )}
                    </>
                  );
                })()
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date de réinscription */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date de réinscription
          </Label>
          <Input
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour la comparaison

              // Vérifier si la date est dans le futur
              if (selectedDate > today) {
                toast.error(
                  "La date de réinscription ne peut pas être dans le futur"
                );
                // Garder la date actuelle
                setFormData({
                  ...formData,
                  enrollmentDate: new Date().toISOString().split("T")[0],
                });
              } else {
                setFormData({ ...formData, enrollmentDate: e.target.value });
              }
            }}
            max={new Date().toISOString().split("T")[0]} // Empêcher la sélection de dates futures dans le calendrier
            disabled={submitting}
          />
          <p className="text-xs text-gray-500">
            La date ne peut pas être dans le futur. Date maximum autorisée:{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (optionnel)</Label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-2 border rounded-md min-h-[80px]"
            placeholder="Ajoutez des notes sur la réinscription..."
            disabled={submitting}
          />
        </div>

        {/* Informations sur les parcours académiques */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            Informations sur les parcours académiques
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h5 className="font-medium text-blue-700 mb-1">
                Parcours Classique
              </h5>
              <p className="text-sm text-gray-600">
                Sixième → Cinquième → Quatrième → Troisième → Seconde → Première
                → Terminale
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-medium text-blue-700 mb-1">
                Nouveau Secondaire
              </h5>
              <p className="text-sm text-gray-600">
                Quatrième → NSI → NSII → NSIII → NSIV
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Orientation après la Quatrième basée sur les résultats
                académiques
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de soumission et annulation */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={
              submitting ||
              !validationResult?.canReenroll ||
              !formData.previousAcademicYearId ||
              !formData.academicYearId ||
              !formData.classId
            }
            className={`gap-2 ${
              validationResult?.details?.academic?.passed === false
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : validationResult?.details?.academic?.passed === false ? (
              <>
                <AlertCircle className="h-4 w-4" />
                Confirmer le redoublement
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Confirmer la réinscription
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
