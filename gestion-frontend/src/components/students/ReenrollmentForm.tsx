// ReenrollmentForm.tsx - Version complète corrigée
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ChevronRight,
  Sparkles,
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
  const [recommendedYear, setRecommendedYear] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fonction pour préparer les années cibles
  const prepareTargetYears = useCallback(() => {
    console.log("=== PRÉPARATION DES ANNÉES CIBLES ===");
    const currentAcademicYears = academicYears || [];

    console.log("Année recommandée disponible:", recommendedYear?.year);
    console.log(
      "Année précédente sélectionnée:",
      formData.previousAcademicYearId
    );

    let targetYears = [];

    // 1. AJOUTER L'ANNÉE RECOMMANDÉE EN PREMIER
    if (recommendedYear) {
      const recommendedInList = currentAcademicYears.find(
        (ay: any) => ay.id === recommendedYear.id
      );

      if (recommendedInList) {
        console.log(
          "✅ Année recommandée trouvée dans la liste:",
          recommendedInList.year
        );
        targetYears.push({
          ...recommendedInList,
          isRecommended: true,
        });
      } else {
        console.log(
          "⚠️ Année recommandée ajoutée manuellement:",
          recommendedYear.year
        );
        targetYears.push({
          ...recommendedYear,
          isRecommended: true,
        });
      }
    }

    // 2. Ajouter l'année en cours
    const currentYear = currentAcademicYears.find((ay: any) => ay.isCurrent);
    if (currentYear && !targetYears.some((y) => y.id === currentYear.id)) {
      targetYears.push({
        ...currentYear,
        isCurrent: true,
      });
      console.log("📅 Année en cours ajoutée:", currentYear.year);
    }

    // 3. Ajouter les autres années futures (après l'année recommandée ou en cours)
    const otherYears = currentAcademicYears
      .filter((ay: any) => {
        const isNotPrevious = ay.id !== formData.previousAcademicYearId;
        const isNotRecommended = recommendedYear
          ? ay.id !== recommendedYear.id
          : true;
        const isNotCurrent = currentYear ? ay.id !== currentYear.id : true;
        const notAlreadyAdded = !targetYears.some((y) => y.id === ay.id);

        return (
          isNotPrevious && isNotRecommended && isNotCurrent && notAlreadyAdded
        );
      })
      .map((ay) => ({
        ...ay,
        isOther: true,
      }));

    targetYears = [...targetYears, ...otherYears];

    // Trier par date de début
    const sortedTargetYears = targetYears.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    console.log(
      "📋 Années cibles finales:",
      sortedTargetYears.map((y) => ({
        id: y.id.substring(0, 8) + "...",
        year: y.year,
        isRecommended: y.isRecommended || false,
        isCurrent: y.isCurrent || false,
      }))
    );

    setAvailableTargetYears(sortedTargetYears);

    return sortedTargetYears;
  }, [academicYears, recommendedYear, formData.previousAcademicYearId]);

  // Fonction pour définir l'année par défaut
  const setDefaultAcademicYear = useCallback(
    (sortedTargetYears: any[]) => {
      console.log("=== DÉFINITION ANNÉE PAR DÉFAUT ===");

      // Ne pas changer si déjà sélectionné
      if (formData.academicYearId) {
        console.log("Année déjà sélectionnée:", formData.academicYearId);
        return;
      }

      let defaultYearId = "";

      // PRIORITÉ ABSOLUE: Année recommandée
      if (recommendedYear) {
        defaultYearId = recommendedYear.id;
        console.log("🎯 Sélection année recommandée:", recommendedYear.year);
      }
      // Fallback: Première année dans la liste
      else if (sortedTargetYears.length > 0) {
        defaultYearId = sortedTargetYears[0].id;
        console.log("📅 Sélection première année:", sortedTargetYears[0].year);
      }

      if (defaultYearId && defaultYearId !== formData.academicYearId) {
        console.log("🔄 Mise à jour année académique:", defaultYearId);
        setFormData((prev) => ({
          ...prev,
          academicYearId: defaultYearId,
        }));
      }
    },
    [formData.academicYearId, recommendedYear]
  );

  useEffect(() => {
    console.log("=== INITIALISATION REENROLLMENT FORM ===");
    console.log("Étudiant:", student.id, student.studentCode);

    const initializeData = async () => {
      try {
        setLoading(true);

        // Si déjà initialisé, ne pas recharger
        if (isInitialized) {
          console.log("⚠️ Déjà initialisé, skip");
          return;
        }

        // 1. Charger toutes les années académiques d'abord
        await fetchAcademicYears();
        await fetchClasses();

        const currentAcademicYears = academicYears || [];
        console.log(
          "📅 Années académiques chargées:",
          currentAcademicYears.length
        );

        // 2. Valider la réinscription
        const validation = await validateReenrollment(student.id);

        if (!validation.success) {
          toast.error(validation.message || "Erreur lors de la validation");
          onClose();
          return;
        }

        const validationData = validation.data?.validation;
        setValidationResult(validationData);

        console.log("✅ Validation reçue");
        console.log(
          "Année recommandée:",
          validationData?.nextAcademicYear?.year
        );
        console.log("Statut canReenroll:", validationData?.canReenroll);

        // 3. Stocker l'année recommandée
        if (validationData?.nextAcademicYear) {
          setRecommendedYear(validationData.nextAcademicYear);
          console.log(
            "🎯 Année recommandée détectée:",
            validationData.nextAcademicYear.year
          );
        }

        // 4. Récupérer l'historique des inscriptions
        const enrollmentHistory = await getStudentEnrollmentHistory(student.id);

        if (enrollmentHistory.success && enrollmentHistory.data?.history) {
          const enrollments = enrollmentHistory.data.history;

          // Créer une carte pour mapper les noms d'années académiques aux IDs
          const academicYearMap: Record<string, any> = {};
          currentAcademicYears.forEach((ay: any) => {
            academicYearMap[ay.year] = ay.id;
            academicYearMap[ay.name] = ay.id;
            academicYearMap[ay.academicYear] = ay.id;
          });

          // Mapper les inscriptions aux années académiques
          const previousYears = [];
          const enrollmentYearMap: Record<string, string> = {};

          for (const enrollment of enrollments) {
            if (
              enrollment.status === "Completed" ||
              enrollment.status === "Active"
            ) {
              let academicYearId = "";

              if (
                enrollment.academicYear &&
                academicYearMap[enrollment.academicYear]
              ) {
                academicYearId = academicYearMap[enrollment.academicYear];
              } else {
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
                  id: academicYearId,
                  academicYear: enrollment.academicYear || "Inconnu",
                  enrollmentId: enrollment.id,
                  enrollmentDate: enrollment.enrollmentDate,
                  status: enrollment.status,
                  className: enrollment.className || "N/A",
                  classLevel: enrollment.classLevel,
                  classId: enrollment.classId,
                };

                previousYears.push(yearData);
                enrollmentYearMap[enrollment.id] = academicYearId;
              }
            }
          }

          setAvailablePreviousYears(previousYears);
          setEnrollmentToAcademicYearMap(enrollmentYearMap);

          // Sélectionner la plus récente par défaut
          if (previousYears.length > 0) {
            const mostRecent = previousYears[0];
            console.log(
              "📝 Année précédente par défaut:",
              mostRecent.academicYear
            );

            setFormData((prev) => ({
              ...prev,
              previousAcademicYearId: mostRecent.id,
              previousEnrollmentId: mostRecent.enrollmentId,
            }));
          }
        }

        // 5. Préparer et définir les années cibles
        const sortedTargetYears = prepareTargetYears();
        setDefaultAcademicYear(sortedTargetYears);

        // 6. Marquer comme initialisé
        setIsInitialized(true);

        console.log("✅ Initialisation terminée");
      } catch (error) {
        console.error("❌ Erreur initialisation:", error);
        toast.error("Erreur lors de la validation de la réinscription");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [student.id, isInitialized, prepareTargetYears, setDefaultAcademicYear]);

  // Re-préparer les années cibles quand l'année précédente change
  useEffect(() => {
    if (isInitialized && formData.previousAcademicYearId) {
      console.log(
        "🔄 Re-préparation années cibles (changement année précédente)"
      );
      const sortedTargetYears = prepareTargetYears();
      setDefaultAcademicYear(sortedTargetYears);
    }
  }, [
    formData.previousAcademicYearId,
    isInitialized,
    prepareTargetYears,
    setDefaultAcademicYear,
  ]);

  // Gérer le changement de l'année précédente
  const handlePreviousYearChange = (value: string) => {
    console.log("📝 Année précédente sélectionnée:", value);

    const selectedYear = availablePreviousYears.find(
      (year) => year.id === value
    );

    if (selectedYear) {
      setFormData((prev) => ({
        ...prev,
        previousAcademicYearId: value,
        previousEnrollmentId: selectedYear.enrollmentId,
      }));
    }
  };

  // Gérer le changement de l'année cible
  const handleAcademicYearChange = (value: string) => {
    if (!value || value.trim() === "") {
      console.error("❌ Valeur d'année vide reçue!");
      return;
    }

    console.log("🎯 Année cible sélectionnée:", value);

    const selectedYear = availableTargetYears.find((y) => y.id === value);
    console.log("📅 Année sélectionnée:", selectedYear?.year || "Inconnue");

    setFormData((prev) => {
      if (prev.academicYearId === value) {
        return prev;
      }
      return {
        ...prev,
        academicYearId: value,
        classId: "", // Réinitialiser la classe
      };
    });
  };

  // Filtrer les classes disponibles
  const getFilteredClasses = useMemo(() => {
    console.log("=== FILTRAGE CLASSES ===");
    console.log("Année cible:", formData.academicYearId);
    console.log("Année précédente:", formData.previousAcademicYearId);

    if (!classes || !formData.academicYearId) {
      console.log("❌ Pas de classes ou pas d'année cible");
      return [];
    }

    const selectedPreviousYear = availablePreviousYears.find(
      (year) => year.id === formData.previousAcademicYearId
    );

    if (!selectedPreviousYear?.classLevel) {
      console.log("⚠️ Pas de niveau précédent, retour toutes les classes");
      return classes.filter(
        (cls: any) =>
          !cls.academicYearId || cls.academicYearId === formData.academicYearId
      );
    }

    const academicStatus =
      validationResult?.details?.academic?.passed === false
        ? "Failed"
        : validationResult?.details?.academic?.passed === true
        ? "Passed"
        : "NoGrades";

    console.log("📊 Statut académique:", academicStatus);
    console.log("🎓 Niveau précédent:", selectedPreviousYear.classLevel);

    const allowedLevels = getAllowedNextLevels(
      selectedPreviousYear.classLevel,
      academicStatus
    );

    console.log("✅ Niveaux autorisés:", allowedLevels);

    const filtered = classes.filter((cls: any) => {
      const isForTargetYear =
        !cls.academicYearId || cls.academicYearId === formData.academicYearId;

      if (!isForTargetYear) return false;

      const isLevelAllowed = allowedLevels.includes(cls.level);
      return isLevelAllowed;
    });

    console.log("📋 Classes filtrées:", filtered.length);
    return filtered;
  }, [
    classes,
    formData.academicYearId,
    formData.previousAcademicYearId,
    validationResult,
    availablePreviousYears,
  ]);

  // Classes pour débogage
  const debugClasses = useMemo(() => {
    if (!classes || !formData.academicYearId) return [];
    return classes.filter(
      (cls: any) =>
        !cls.academicYearId || cls.academicYearId === formData.academicYearId
    );
  }, [classes, formData.academicYearId]);

  // Handler pour utiliser l'année recommandée
  const handleUseRecommendedYear = () => {
    if (recommendedYear) {
      setFormData((prev) => ({
        ...prev,
        academicYearId: recommendedYear.id,
        classId: "",
      }));
      toast.success(`Année ${recommendedYear.year} sélectionnée`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== SOUMISSION FORMULAIRE ===");
    console.log("Données:", formData);

    if (
      !formData.classId ||
      !formData.academicYearId ||
      !formData.previousAcademicYearId ||
      !formData.previousEnrollmentId
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
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

      const result = await reenrollStudent(payload);

      if (result.success) {
        toast.success("Réinscription effectuée avec succès");
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Erreur lors de la réinscription");
      }
    } catch (error: any) {
      console.error("❌ Erreur réinscription:", error);
      toast.error(error.message || "Erreur lors de la réinscription");
    } finally {
      setSubmitting(false);
    }
  };

  // Logs d'état
  useEffect(() => {
    console.log("=== ÉTAT ACTUEL ===");
    console.log("Année précédente:", formData.previousAcademicYearId);
    console.log("Année cible:", formData.academicYearId);
    console.log("Classe:", formData.classId);
    console.log("Année recommandée:", recommendedYear?.year);
  }, [formData, recommendedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Validation de la réinscription...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Réinscription d'étudiant</h3>
            <p className="text-sm text-gray-600">
              {student.firstName} {student.lastName} - {student.studentCode}
            </p>
          </div>
          {validationResult?.canReenroll ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Éligible
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Non éligible
            </Badge>
          )}
        </div>
      </div>

      {/* Résumé de la progression */}
      {validationResult && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-full shadow">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">
                    Progression académique
                  </p>
                  <div className="flex items-center text-sm text-blue-600">
                    <span className="font-semibold">
                      {validationResult.previousEnrollment.academicYear}
                    </span>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span
                      className={`font-semibold ${
                        recommendedYear ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {recommendedYear?.year || "Sélectionnez une année"}
                    </span>
                  </div>
                </div>
              </div>
              {recommendedYear &&
                formData.academicYearId === recommendedYear.id && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recommandée
                  </Badge>
                )}
            </div>

            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Année précédente</span>
                <span>Année suivante</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
                  style={{ width: formData.academicYearId ? "100%" : "50%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats académiques */}
      {validationResult?.academicEvaluation && (
        <Card
          className={`border-l-4 ${
            validationResult.academicEvaluation.status === "Failed"
              ? "border-l-amber-500"
              : validationResult.academicEvaluation.status === "Passed"
              ? "border-l-green-500"
              : "border-l-gray-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Résultats académiques
                </h4>
                <Badge
                  variant={
                    validationResult.academicEvaluation.status === "Failed"
                      ? "destructive"
                      : validationResult.academicEvaluation.status === "Passed"
                      ? "default"
                      : "outline"
                  }
                >
                  {validationResult.academicEvaluation.status === "Failed"
                    ? "Échec"
                    : validationResult.academicEvaluation.status === "Passed"
                    ? "Réussite"
                    : "Pas de notes"}
                </Badge>
              </div>

              <div
                className={`p-3 rounded-lg ${
                  validationResult.academicEvaluation.status === "Failed"
                    ? "bg-amber-50 text-amber-800"
                    : validationResult.academicEvaluation.status === "Passed"
                    ? "bg-green-50 text-green-800"
                    : "bg-gray-50 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {validationResult.academicEvaluation.status === "Failed" ? (
                    <AlertCircle className="h-8 w-8" />
                  ) : validationResult.academicEvaluation.status ===
                    "Passed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <Info className="h-8 w-8" />
                  )}
                  <div>
                    <p className="font-medium">
                      {validationResult.academicEvaluation.status === "Failed"
                        ? `Moyenne: ${
                            validationResult.academicEvaluation.averageGrade?.toFixed(
                              2
                            ) || "0.00"
                          }/100`
                        : validationResult.academicEvaluation.status ===
                          "Passed"
                        ? `Moyenne: ${
                            validationResult.academicEvaluation.averageGrade?.toFixed(
                              2
                            ) || "0.00"
                          }/100`
                        : "Aucune note disponible"}
                    </p>
                    <p className="text-sm mt-1 opacity-90">
                      {validationResult.academicEvaluation.status === "Failed"
                        ? "Redoublement recommandé"
                        : validationResult.academicEvaluation.status ===
                          "Passed"
                        ? "Passage au niveau supérieur recommandé"
                        : "Redoublement recommandé par sécurité"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Année recommandée (affichage spécial) */}
      {recommendedYear && (
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Année académique suivante détectée
                  </h4>
                  <p className="text-green-600">
                    Après {validationResult?.previousEnrollment?.academicYear},
                    l'année suivante est{" "}
                    <span className="font-bold">{recommendedYear.year}</span>
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Du{" "}
                    {new Date(recommendedYear.startDate).toLocaleDateString()}
                    au {new Date(recommendedYear.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {formData.academicYearId === recommendedYear.id ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sélectionnée
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={handleUseRecommendedYear}
                >
                  Utiliser cette année
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
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
                      <SelectItem
                        key={`prev-${year.id}-${index}`}
                        value={year.id}
                      >
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
                onValueChange={handleAcademicYearChange}
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
                        (year: any) =>
                          year.id !== formData.previousAcademicYearId
                      )
                      .map((year: any) => {
                        const isRecommended =
                          year.isRecommended || year.id === recommendedYear?.id;
                        const isCurrent = year.isCurrent;
                        const isFuture = year.isFuture;

                        return (
                          <SelectItem key={year.id} value={year.id}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isRecommended && (
                                  <Sparkles className="h-4 w-4 text-yellow-500" />
                                )}
                                {isCurrent && (
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                )}
                                {isFuture && !isCurrent && (
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                )}
                                <span
                                  className={
                                    isRecommended ? "font-semibold" : ""
                                  }
                                >
                                  {year.year ||
                                    year.name ||
                                    year.academicYear ||
                                    `Année ${year.id.substring(0, 8)}`}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {isRecommended && (
                                  <Badge
                                    variant="default"
                                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-xs"
                                  >
                                    Recommandée
                                  </Badge>
                                )}
                                {isCurrent && (
                                  <Badge variant="default" className="text-xs">
                                    En cours
                                  </Badge>
                                )}
                                {isFuture && !isCurrent && (
                                  <Badge variant="outline" className="text-xs">
                                    Future
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {isRecommended && (
                              <div className="text-xs text-amber-600 mt-1">
                                Année suivante après{" "}
                                {
                                  validationResult?.previousEnrollment
                                    ?.academicYear
                                }
                              </div>
                            )}

                            <div className="text-xs text-gray-500 mt-1">
                              {year.startDate && year.endDate
                                ? `${new Date(
                                    year.startDate
                                  ).toLocaleDateString()} - ${new Date(
                                    year.endDate
                                  ).toLocaleDateString()}`
                                : "Dates non disponibles"}
                            </div>
                          </SelectItem>
                        );
                      })
                  )}
                </SelectContent>
              </Select>

              {recommendedYear &&
                formData.academicYearId !== recommendedYear.id && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 w-full"
                      onClick={handleUseRecommendedYear}
                    >
                      <Sparkles className="h-3 w-3" />
                      Utiliser l'année recommandée ({recommendedYear.year})
                    </Button>
                  </div>
                )}
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
                  today.setHours(0, 0, 0, 0);

                  if (selectedDate > today) {
                    toast.error(
                      "La date de réinscription ne peut pas être dans le futur"
                    );
                    setFormData({
                      ...formData,
                      enrollmentDate: new Date().toISOString().split("T")[0],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      enrollmentDate: e.target.value,
                    });
                  }
                }}
                max={new Date().toISOString().split("T")[0]}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500">
                La date ne peut pas être dans le futur
              </p>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Nouvelle classe */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Nouvelle classe *
              </Label>

              {/* Avertissement si pas de classes filtrées */}
              {debugClasses.length > 0 && getFilteredClasses.length === 0 && (
                <div className="text-sm text-amber-600 mb-2 p-3 bg-amber-50 rounded">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Aucune classe ne correspond aux critères pour cette année
                </div>
              )}

              <Select
                value={formData.classId}
                onValueChange={(value) =>
                  setFormData({ ...formData, classId: value })
                }
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
                        (cls: any) =>
                          cls.level === selectedPreviousYear?.classLevel
                      );

                      const nextLevelClasses = getFilteredClasses.filter(
                        (cls: any) =>
                          cls.level !== selectedPreviousYear?.classLevel
                      );

                      return (
                        <>
                          {/* Section redoublement (même niveau) */}
                          {sameLevelClasses.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-xs font-semibold text-amber-600 bg-amber-50">
                                <AlertCircle className="h-3 w-3 inline mr-1" />
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
                                      {cls.id ===
                                        selectedPreviousYear?.classId && (
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
                                <CheckCircle className="h-3 w-3 inline mr-1" />
                                Passage au niveau supérieur
                              </div>
                              {nextLevelClasses.map((cls: any) => {
                                const transitionValidation =
                                  isValidLevelTransition(
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

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (optionnel)</Label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full p-2 border rounded-md min-h-[120px]"
                placeholder="Ajoutez des notes sur la réinscription (motif, conditions spéciales, etc.)..."
                disabled={submitting}
              />
            </div>

            {/* Informations sur la transition */}
            {validationResult?.levelRecommendation && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">
                  Transition recommandée
                </h5>
                <p className="text-sm text-blue-600">
                  {validationResult.levelRecommendation.reason}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {formatClassLevel(
                      validationResult.previousEnrollment.classLevel
                    )}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                  <Badge
                    variant={
                      validationResult.levelRecommendation.isRedoublement
                        ? "outline"
                        : "default"
                    }
                    className={`text-xs ${
                      validationResult.levelRecommendation.isRedoublement
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {formatClassLevel(
                      validationResult.levelRecommendation.recommendedLevel
                    )}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations sur les parcours académiques */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <h4 className="font-semibold text-blue-800 mb-3">
            Parcours académiques disponibles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <h5 className="font-medium text-blue-700">
                  Parcours Classique
                </h5>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Sixième</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Cinquième</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Quatrième</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Troisième</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Seconde</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-600 font-medium">Première</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="text-blue-600 font-medium">Terminale</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <h5 className="font-medium text-purple-700">
                  Nouveau Secondaire
                </h5>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="text-gray-400 text-xs mb-1">
                    Après la Quatrième
                  </div>
                  <div className="flex items-center">
                    <div className="text-purple-600 font-medium">NSI</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-purple-600 font-medium">NSII</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <div className="text-purple-600 font-medium">NSIII</div>
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                  </div>
                  <div className="text-purple-600 font-medium">NSIV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {validationResult?.canReenroll === false && (
              <div className="text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Réinscription non autorisée
              </div>
            )}
          </div>

          <div className="flex gap-3">
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
                validationResult?.academicEvaluation?.status === "Failed"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : validationResult?.academicEvaluation?.status === "Failed" ? (
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
        </div>
      </form>
    </div>
  );
};
