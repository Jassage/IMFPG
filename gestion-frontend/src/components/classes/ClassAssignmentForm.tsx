import { useSubjectStore } from "@/store/subjectStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import useProfesseurStore from "@/store/professorStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import { ClassAssignment } from "@/types/academic";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useClassStore } from "@/store/classStore";
import { Badge } from "../ui/badge";

// Valeurs sentinelles pour les sélections optionnelles (Radix Select n'accepte pas "")
const NO_PROFESSEUR = "none";
const NO_SECTION = "none";

// Interface pour les données du formulaire
interface AssignmentFormData {
  subjectId: string;
  professeurId: string;
  classLevel: string;
  academicYearId: string;
  status: "Active" | "Inactive";
}

// Niveaux de classe
const classLevels = [
  "Sixieme",
  "Cinquieme",
  "Quatrieme",
  "Troisieme",
  "Seconde",
  "Premiere",
  "Terminale",
  "NSI",
  "NSII",
  "NSIII",
  "NSIV",
] as const;

// Schéma Zod avec validation complète
const formSchema = z.object({
  subjectId: z.string().min(1, { message: "La matière est requise" }),
  // Optionnel : la matière peut être inscrite au programme avant qu'un
  // professeur ne lui soit affecté ("À pourvoir")
  professeurId: z.string().optional(),
  classLevel: z.string().min(1, { message: "La classe est requise" }),
  // Optionnel : limite l'assignation à une section précise du niveau
  schoolClassId: z.string().optional(),
  academicYearId: z
    .string()
    .min(1, { message: "L'année académique est requise" }),
  status: z.enum(["Active", "Inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

interface ClassAssignmentFormProps {
  assignment?: ClassAssignment | null;
  isInitialized?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClassAssignmentForm({
  assignment,
  isInitialized = false,
  onSuccess,
  onCancel,
}: ClassAssignmentFormProps) {
  const { createAssignment, updateAssignment } = useAssignmentStore();
  const {
    subjects,
    loading: subjectsLoading,
    fetchSubjects,
  } = useSubjectStore();
  const {
    academicYears,
    loading: yearsLoading,
    fetchAcademicYears,
  } = useAcademicYearStore();
  const {
    professeurs,
    loading: profsLoading,
    fetchProfesseurs,
  } = useProfesseurStore();
  const { classes, fetchClasses } = useClassStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Charger les données nécessaires
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSubjects(),
          fetchAcademicYears(),
          fetchProfesseurs(),
          fetchClasses(),
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setFormError("Impossible de charger les données nécessaires");
      }
    };

    loadData();
  }, [fetchSubjects, fetchAcademicYears, fetchProfesseurs, fetchClasses]);

  // Vérifier si toutes les données sont disponibles
  // (le professeur est optionnel, donc son absence ne bloque pas le formulaire)
  const isDataLoaded =
    !subjectsLoading &&
    !yearsLoading &&
    !profsLoading &&
    subjects.length > 0 &&
    academicYears.length > 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      professeurId: NO_PROFESSEUR,
      classLevel: "",
      schoolClassId: NO_SECTION,
      academicYearId: "",
      status: "Active",
    },
    mode: "onChange",
  });

  // Initialiser le formulaire avec les données de l'assignation
  useEffect(() => {
    if (assignment && isInitialized && isDataLoaded) {
      form.reset({
        subjectId: assignment.subject?.id || "",
        professeurId: assignment.professeur?.id || NO_PROFESSEUR,
        classLevel: assignment.classLevel || "",
        schoolClassId:
          assignment.schoolClass?.id || assignment.schoolClassId || NO_SECTION,
        academicYearId: assignment.academicYear?.id || "",
        status: assignment.status === "Inactive" ? "Inactive" : "Active",
      });
    } else if (!assignment && isInitialized && isDataLoaded) {
      // Réinitialiser pour une nouvelle assignation
      form.reset({
        subjectId: "",
        professeurId: NO_PROFESSEUR,
        classLevel: "",
        schoolClassId: NO_SECTION,
        academicYearId: academicYears.find((y) => y.isCurrent)?.id || "",
        status: "Active",
      });
    }
  }, [assignment, isInitialized, isDataLoaded, form, academicYears]);

  // Sections disponibles pour le niveau sélectionné
  const selectedClassLevel = form.watch("classLevel");
  const availableSections = classes.filter(
    (cls) => cls.level === selectedClassLevel
  );

  // Fonction pour vérifier si une assignation existe déjà
  const checkExistingAssignment = useCallback(
    (
      subjectId: string,
      professeurId: string,
      classLevel: string,
      academicYearId: string
    ) => {
      // Cette logique dépend de votre store, à adapter selon vos besoins
      return false;
    },
    []
  );

  const onSubmit = async (values: FormValues) => {
    if (!isDataLoaded || isSubmitting) {
      toast.info("Veuillez patienter pendant le chargement des données");
      return;
    }

    // Vérifier si l'assignation existe déjà (sauf en mode édition)
    if (
      !assignment &&
      checkExistingAssignment(
        values.subjectId,
        values.professeurId,
        values.classLevel,
        values.academicYearId
      )
    ) {
      toast("Cette assignation existe déjà pour cette année académique");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const assignmentData = {
        subjectId: values.subjectId,
        professeurId:
          !values.professeurId || values.professeurId === NO_PROFESSEUR
            ? null
            : values.professeurId,
        classLevel: values.classLevel,
        schoolClassId:
          !values.schoolClassId || values.schoolClassId === NO_SECTION
            ? null
            : values.schoolClassId,
        academicYearId: values.academicYearId,
        status: values.status,
      };

      if (assignment) {
        await updateAssignment(assignment.id, assignmentData);
        toast.success("L'assignation a été modifiée avec succès");
      } else {
        await createAssignment(assignmentData);
        toast.success("La nouvelle assignation a été créée avec succès");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      setFormError(
        error.message || "Une erreur est survenue lors de la soumission"
      );
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatage des options
  const formatProfesseurName = (prof: any) => {
    return `${prof.firstName || ""} ${prof.lastName || ""}`.trim();
  };

  const formatAcademicYear = (year: any) => {
    return `${year.year} ${year.isCurrent ? "(En cours)" : ""}`;
  };

  // Afficher un état de chargement
  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des données...</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                subjects.length > 0 ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span>Matières: {subjects.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                professeurs.length > 0 ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span>Professeurs: {professeurs.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                academicYears.length > 0 ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span>Années académiques: {academicYears.length}</span>
          </div>
        </div>
      </div>
    );
  }

  // Afficher une erreur de chargement
  if (formError) {
    return (
      <div className="p-6 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">{formError}</p>
        <div className="space-y-2 mb-6">
          <div className="text-sm text-left">
            <p className="font-medium">Données disponibles:</p>
            <p>• Matières: {subjects.length}</p>
            <p>• Professeurs: {professeurs.length}</p>
            <p>• Années académiques: {academicYears.length}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={onCancel} variant="outline">
            Retour
          </Button>
          <Button onClick={() => window.location.reload()} variant="default">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{formError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matière */}
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>
                    Matière <span className="text-red-500">*</span>
                  </span>
                  {subjects.length === 0 && (
                    <span className="text-xs text-amber-600">
                      Aucune matière disponible
                    </span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || subjects.length === 0}
                >
                  <FormControl>
                    <SelectTrigger
                      className={!field.value ? "text-muted-foreground" : ""}
                    >
                      <SelectValue
                        placeholder={
                          subjects.length === 0
                            ? "Aucune matière disponible"
                            : "Sélectionnez une matière"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex flex-col">
                          <span>{subject.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {subject.code}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Professeur */}
          <FormField
            control={form.control}
            name="professeurId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>Professeur</span>
                  {professeurs.length === 0 && (
                    <span className="text-xs text-amber-600">
                      Aucun professeur disponible
                    </span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || NO_PROFESSEUR}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un professeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NO_PROFESSEUR}>
                      <span className="text-muted-foreground">
                        À pourvoir (aucun professeur)
                      </span>
                    </SelectItem>
                    {professeurs.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        <div className="flex flex-col">
                          <span>{formatProfesseurName(prof)}</span>
                          {prof.matricule && (
                            <span className="text-xs text-muted-foreground">
                              Matricule: {prof.matricule}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Classe */}
          <FormField
            control={form.control}
            name="classLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Classe/Niveau <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // La section sélectionnée ne s'applique probablement plus
                    // au nouveau niveau : on la réinitialise
                    form.setValue("schoolClassId", NO_SECTION);
                  }}
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger
                      className={!field.value ? "text-muted-foreground" : ""}
                    >
                      <SelectValue placeholder="Sélectionnez une classe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classLevels.map((level) => {
                      const displayName =
                        level === "Sixieme"
                          ? "Sixième"
                          : level === "Cinquieme"
                          ? "Cinquième"
                          : level === "Quatrieme"
                          ? "Quatrième"
                          : level === "Troisieme"
                          ? "Troisième"
                          : level === "Premiere"
                          ? "Première"
                          : level === "NSI"
                          ? "NS I"
                          : level === "NSII"
                          ? "NS II"
                          : level === "NSIII"
                          ? "NS III"
                          : level === "NSIV"
                          ? "NS IV"
                          : level;
                      return (
                        <SelectItem key={level} value={level}>
                          {displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section (optionnelle) */}
          <FormField
            control={form.control}
            name="schoolClassId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || NO_SECTION}
                  disabled={isSubmitting || !selectedClassLevel}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedClassLevel
                            ? "Sélectionnez d'abord un niveau"
                            : "Tout le niveau"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NO_SECTION}>
                      <span className="text-muted-foreground">
                        Tout le niveau (toutes les sections)
                      </span>
                    </SelectItem>
                    {availableSections.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Année académique */}
          <FormField
            control={form.control}
            name="academicYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>
                    Année académique <span className="text-red-500">*</span>
                  </span>
                  {academicYears.length === 0 && (
                    <span className="text-xs text-amber-600">
                      Aucune année disponible
                    </span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || academicYears.length === 0}
                >
                  <FormControl>
                    <SelectTrigger
                      className={!field.value ? "text-muted-foreground" : ""}
                    >
                      <SelectValue
                        placeholder={
                          academicYears.length === 0
                            ? "Aucune année disponible"
                            : "Sélectionnez une année"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        <div className="flex items-center justify-between">
                          <span>{formatAcademicYear(year)}</span>
                          {year.isCurrent && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              En cours
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Statut */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Statut</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {field.value === "Active"
                    ? "L'assignation est active et utilisable"
                    : "L'assignation est inactive et non utilisable"}
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "Active"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "Active" : "Inactive")
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Résumé des sélections */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Récapitulatif</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Matière:</span>
              <p className="font-medium">
                {form.watch("subjectId")
                  ? subjects.find((s) => s.id === form.watch("subjectId"))?.name
                  : "Non sélectionnée"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Professeur:</span>
              <p className="font-medium">
                {form.watch("professeurId") &&
                form.watch("professeurId") !== NO_PROFESSEUR
                  ? formatProfesseurName(
                      professeurs.find(
                        (p) => p.id === form.watch("professeurId")
                      ) || {}
                    )
                  : "À pourvoir"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Classe:</span>
              <p className="font-medium">
                {form.watch("classLevel") || "Non sélectionnée"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Section:</span>
              <p className="font-medium">
                {form.watch("schoolClassId") &&
                form.watch("schoolClassId") !== NO_SECTION
                  ? availableSections.find(
                      (cls) => cls.id === form.watch("schoolClassId")
                    )?.name
                  : "Tout le niveau"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Année:</span>
              <p className="font-medium">
                {form.watch("academicYearId")
                  ? academicYears.find(
                      (y) => y.id === form.watch("academicYearId")
                    )?.year
                  : "Non sélectionnée"}
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-24"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid || !isDataLoaded}
            className="min-w-24"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {assignment ? "Modification..." : "Création..."}
              </>
            ) : assignment ? (
              "Modifier l'assignation"
            ) : (
              "Créer l'assignation"
            )}
          </Button>
        </div>

        {/* Validation du formulaire */}
        {!form.formState.isValid && form.formState.isDirty && (
          <div className="text-sm text-amber-600">
            <p>
              Veuillez corriger les erreurs dans le formulaire avant de
              soumettre.
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
