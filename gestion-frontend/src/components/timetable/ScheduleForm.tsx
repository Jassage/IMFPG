import React, { useCallback, useMemo, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Loader2,
  X,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Types pour les props
interface ClassItem {
  id: string;
  name: string;
  level: string;
}

interface AssignmentItem {
  id: string;
  subject?: {
    name: string;
  };
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  classLevel: string;
  professeurId?: string;
  classId?: string;
}

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  schedule?: any;
  onSuccess: () => void;
  assignments: AssignmentItem[];
  classes: ClassItem[];
  loading?: boolean;
  onSubmit: (data: any, isEdit: boolean) => Promise<void>;
  checkScheduleConflicts?: (data: any) => Promise<any>;
}

// Schéma de validation corrigé
const scheduleFormSchema = z
  .object({
    assignmentId: z.string().min(1, { message: "L'assignation est requise" }),
    classId: z.string().min(1, { message: "La classe est requise" }),
    dayOfWeek: z.string().min(1, { message: "Le jour est requis" }),
    startTime: z
      .string()
      .min(1, { message: "L'heure de début est requise" })
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide (HH:MM)",
      }),
    endTime: z
      .string()
      .min(1, { message: "L'heure de fin est requise" })
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide (HH:MM)",
      }),
    classroom: z
      .string()
      .max(100, {
        message: "Le nom de la salle ne peut pas dépasser 100 caractères",
      })
      .optional()
      .transform((val) => val?.trim() || ""),
    recurrence: z
      .enum(["NONE", "WEEKLY", "BIWEEKLY", "MONTHLY"])
      .default("NONE"),
    untilDate: z.string().optional(), // Rendre optionnel car conditionnel
    notes: z
      .string()
      .max(500, { message: "Les notes ne peuvent pas dépasser 500 caractères" })
      .optional()
      .transform((val) => val?.trim() || ""),
  })
  .refine(
    (data) => {
      // Validation des heures
      if (data.startTime && data.endTime) {
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        const [endHour, endMinute] = data.endTime.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        return endTotal > startTotal;
      }
      return true;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // Validation de la durée minimale (30 minutes)
      if (data.startTime && data.endTime) {
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        const [endHour, endMinute] = data.endTime.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;
        const duration = endTotal - startTotal;

        return duration >= 30;
      }
      return true;
    },
    {
      message: "Durée minimale: 30 minutes",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // Validation de la durée maximale (4 heures)
      if (data.startTime && data.endTime) {
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        const [endHour, endMinute] = data.endTime.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;
        const duration = endTotal - startTotal;

        return duration <= 240;
      }
      return true;
    },
    {
      message: "Durée maximale: 4 heures",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      // Si recurrence n'est pas NONE, untilDate est requis
      if (data.recurrence !== "NONE" && !data.untilDate) {
        return false;
      }
      return true;
    },
    {
      message: "La date de fin est requise pour une récurrence",
      path: ["untilDate"],
    }
  )
  .refine(
    (data) => {
      // Si untilDate est fourni, doit être une date valide au format YYYY-MM-DD
      if (data.untilDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.untilDate)) {
        return false;
      }
      return true;
    },
    {
      message: "Format de date invalide (YYYY-MM-DD)",
      path: ["untilDate"],
    }
  );

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  open,
  onClose,
  schedule,
  onSuccess,
  assignments,
  classes,
  loading = false,
  onSubmit,
  checkScheduleConflicts,
}) => {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const isEdit = !!schedule;

  // Initialiser le formulaire avec validation en temps réel
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      assignmentId: "",
      classId: "",
      dayOfWeek: "",
      startTime: "08:00",
      endTime: "09:30",
      classroom: "",
      recurrence: "NONE",
      untilDate: "",
      notes: "",
    },
    mode: "onChange", // Validation en temps réel
    reValidateMode: "onChange", // Re-valider à chaque changement
  });

  // Observer tous les champs pour validation en temps réel
  const formValues = form.watch();
  const formErrors = form.formState.errors;

  // Fonction utilitaire pour formater l'heure pour l'API
  const formatTimeForAPI = (time: string): string => {
    if (!time) return "00:00";

    // Si c'est déjà au format HH:MM
    if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time + ":00"; // Ajouter les secondes
    }

    try {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
    } catch {
      return "00:00:00";
    }
  };

  // Fonction pour formater la date pour l'API
  const formatDateForAPI = (dateString: string): string | null => {
    if (!dateString || dateString.trim() === "") return null;

    // Vérifier si c'est déjà au format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split("T")[0];
    } catch {
      return null;
    }
  };

  // Fonction pour vérifier la correspondance des niveaux
  const checkLevelMatch = useCallback(
    (classId: string, assignmentId: string): boolean => {
      if (!classId || !assignmentId) return true;

      const selectedClass = classes.find((c) => c.id === classId);
      const selectedAssignment = assignments.find((a) => a.id === assignmentId);

      if (!selectedClass || !selectedAssignment) return true;

      return selectedAssignment.classLevel === selectedClass.level;
    },
    [classes, assignments]
  );

  // Validation personnalisée en temps réel pour la correspondance des niveaux
  React.useEffect(() => {
    const validateLevelMatch = async () => {
      const { classId, assignmentId } = form.getValues();

      if (classId && assignmentId && !checkLevelMatch(classId, assignmentId)) {
        form.setError("assignmentId", {
          type: "manual",
          message:
            "Cette assignation ne correspond pas au niveau de la classe sélectionnée",
        });
      } else if (formErrors.assignmentId?.type === "manual") {
        // Effacer l'erreur manuelle si elle existe et que la correspondance est bonne
        form.clearErrors("assignmentId");
      }
    };

    validateLevelMatch();
  }, [formValues.classId, formValues.assignmentId, form, checkLevelMatch]);

  // Validation supplémentaire en temps réel pour les champs requis
  React.useEffect(() => {
    const validateRequiredFields = () => {
      const values = form.getValues();
      const errors: Partial<Record<keyof ScheduleFormValues, string>> = {};

      // Validation de base des champs requis
      if (!values.assignmentId) {
        errors.assignmentId = "L'assignation est requise";
      }
      if (!values.classId) {
        errors.classId = "La classe est requise";
      }
      if (!values.dayOfWeek) {
        errors.dayOfWeek = "Le jour est requis";
      }

      // Appliquer les erreurs uniquement si elles ne sont pas déjà présentes
      Object.entries(errors).forEach(([field, message]) => {
        if (!formErrors[field as keyof typeof formErrors]) {
          form.setError(field as any, {
            type: "manual",
            message,
          });
        }
      });
    };

    // Valider uniquement si certains champs ont des valeurs
    if (formValues.assignmentId || formValues.classId || formValues.dayOfWeek) {
      validateRequiredFields();
    }
  }, [
    formValues.assignmentId,
    formValues.classId,
    formValues.dayOfWeek,
    form,
    formErrors,
  ]);

  // Observer le champ recurrence
  const recurrenceValue = form.watch("recurrence");

  // Fonction pour extraire HH:MM d'un timestamp ISO
  const extractTimeFromISO = useCallback((isoString: string): string => {
    if (!isoString) return "";

    // Si c'est déjà au format HH:MM, retourner tel quel
    if (isoString.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return isoString;
    }

    // Si c'est un timestamp ISO avec secondes
    if (isoString.includes(":")) {
      try {
        const [hours, minutes] = isoString.split(":");
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      } catch {
        return "08:00";
      }
    }

    // Si c'est un timestamp ISO complet
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "08:00";
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error extracting time from ISO:", error);
      return "08:00";
    }
  }, []);

  // Fonction pour extraire YYYY-MM-DD d'une date ISO
  const extractDateFromISO = useCallback((isoString: string): string => {
    if (!isoString) return "";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, []);

  // Initialiser les données si schedule existant
  React.useEffect(() => {
    if (schedule && open) {
      const defaultValues: ScheduleFormValues = {
        assignmentId:
          schedule.assignmentId || schedule.classAssignment?.id || "",
        classId: schedule.classId || "",
        dayOfWeek: schedule.dayOfWeek || "",
        startTime: extractTimeFromISO(schedule.startTime) || "08:00",
        endTime: extractTimeFromISO(schedule.endTime) || "09:30",
        classroom: schedule.classroom || "",
        recurrence: schedule.recurrence || "NONE",
        untilDate: schedule.untilDate
          ? extractDateFromISO(schedule.untilDate)
          : "",
        notes: schedule.notes || "",
      };

      form.reset(defaultValues);
      setServerError(null);
    } else if (open) {
      form.reset({
        assignmentId: "",
        classId: "",
        dayOfWeek: "",
        startTime: "08:00",
        endTime: "09:30",
        classroom: "",
        recurrence: "NONE",
        untilDate: "",
        notes: "",
      });
      setServerError(null);
    }
  }, [schedule, open, form, extractTimeFromISO, extractDateFromISO]);

  // Fonction de soumission du formulaire
  const handleFormSubmit = useCallback(
    async (formData: ScheduleFormValues) => {
      try {
        setIsValidating(true);
        setServerError(null);

        // Vérifier si le formulaire est valide
        const isValid = await form.trigger();
        if (!isValid) {
          toast.error("Veuillez corriger les erreurs dans le formulaire");
          setIsValidating(false);
          return;
        }

        // Formater les données pour l'API
        const formattedData: any = {
          ...formData,
          startTime: formatTimeForAPI(formData.startTime),
          endTime: formatTimeForAPI(formData.endTime),
          classroom: formData.classroom?.trim() || null,
          notes: formData.notes?.trim() || null,
        };

        // Gérer untilDate en fonction de recurrence
        if (formData.recurrence !== "NONE" && formData.untilDate) {
          formattedData.untilDate = formatDateForAPI(formData.untilDate);
          if (!formattedData.untilDate) {
            toast.error("Date de fin invalide");
            setIsValidating(false);
            return;
          }
        } else {
          delete formattedData.untilDate;
        }

        // Nettoyer les champs vides
        if (!formattedData.classroom) delete formattedData.classroom;
        if (!formattedData.notes) delete formattedData.notes;

        console.log("📤 Données formatées pour API:", formattedData);

        // Appeler la fonction de soumission fournie par le parent
        await onSubmit(formattedData, isEdit);

        // Succès
        toast.success(
          isEdit
            ? "L'horaire a été mis à jour avec succès"
            : "L'horaire a été ajouté avec succès"
        );

        setIsValidating(false);
        onSuccess();
      } catch (error: any) {
        console.error("Error submitting schedule form:", error);
        setIsValidating(false);

        let errorMessage = "Erreur lors de l'opération";

        if (error.response?.data?.code === "PROFESSEUR_CONFLICT") {
          errorMessage = "Le professeur a déjà un cours à ce créneau horaire";
        } else if (error.response?.data?.code === "CLASS_CONFLICT") {
          errorMessage = "La classe a déjà un cours à ce créneau horaire";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors;
          if (Array.isArray(apiErrors)) {
            errorMessage = apiErrors.map((err) => err.message).join(", ");
          }
        }

        setServerError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [form, isEdit, onSubmit, onSuccess]
  );

  const days = useMemo(
    () => [
      { value: "MONDAY", label: "Lundi", short: "LUN" },
      { value: "TUESDAY", label: "Mardi", short: "MAR" },
      { value: "WEDNESDAY", label: "Mercredi", short: "MER" },
      { value: "THURSDAY", label: "Jeudi", short: "JEU" },
      { value: "FRIDAY", label: "Vendredi", short: "VEN" },
      { value: "SATURDAY", label: "Samedi", short: "SAM" },
    ],
    []
  );

  const timeSlots = useMemo(
    () => [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
    ],
    []
  );

  // Fonction pour obtenir les assignations filtrées en fonction de la classe sélectionnée
  const getFilteredAssignments = useCallback(
    (selectedClassId: string) => {
      if (!selectedClassId) return assignments;

      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (!selectedClass) return assignments;

      return assignments.filter(
        (assignment) => assignment.classLevel === selectedClass.level
      );
    },
    [assignments, classes]
  );

  // Observer les changements de classe pour filtrer les assignations
  const selectedClassId = form.watch("classId");
  const filteredAssignments = useMemo(
    () => getFilteredAssignments(selectedClassId),
    [selectedClassId, getFilteredAssignments]
  );

  // Vérifier si le formulaire est valide pour désactiver le bouton
  const isFormValid = React.useMemo(() => {
    return form.formState.isValid && !isValidating;
  }, [form.formState.isValid, isValidating]);

  // Rendu des options pour les assignations
  const renderAssignmentOptions = useMemo(() => {
    if (filteredAssignments.length === 0) {
      return (
        <SelectItem value="none" disabled>
          {selectedClassId
            ? "Aucune assignation disponible pour ce niveau"
            : "Sélectionnez d'abord une classe"}
        </SelectItem>
      );
    }

    // Utiliser une Map pour éliminer les doublons basés sur l'ID
    const uniqueAssignments = Array.from(
      new Map(filteredAssignments.map((a) => [a.id, a])).values()
    );

    return uniqueAssignments.map((assignment) => (
      <SelectItem key={`assign-${assignment.id}`} value={assignment.id}>
        {assignment.subject?.name || "Matière non spécifiée"} -{" "}
        {assignment.professeur?.firstName || ""}{" "}
        {assignment.professeur?.lastName || ""}
      </SelectItem>
    ));
  }, [filteredAssignments, selectedClassId]);

  // Rendu des options pour les classes
  const renderClassOptions = useMemo(() => {
    // Éliminer les doublons basés sur l'ID
    const uniqueClasses = Array.from(
      new Map(classes.map((c) => [c.id, c])).values()
    );

    return uniqueClasses.map((cls) => (
      <SelectItem key={`class-${cls.id}`} value={cls.id}>
        {cls.name} (Niveau: {cls.level})
      </SelectItem>
    ));
  }, [classes]);

  // Rendu des options pour les jours
  const renderDayOptions = useMemo(
    () =>
      days.map((day) => (
        <SelectItem key={`day-${day.value}`} value={day.value}>
          {day.label}
        </SelectItem>
      )),
    [days]
  );

  // Rendu des options pour les heures de début
  const renderStartTimeOptions = useMemo(
    () =>
      timeSlots.map((time) => (
        <SelectItem key={`start-${time}`} value={time}>
          {time}
        </SelectItem>
      )),
    [timeSlots]
  );

  // Rendu des options pour les heures de fin
  const renderEndTimeOptions = useMemo(
    () =>
      timeSlots.map((time) => (
        <SelectItem key={`end-${time}`} value={time}>
          {time}
        </SelectItem>
      )),
    [timeSlots]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Modifier le cours" : "Nouveau cours"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les détails du cours"
              : "Créez un nouveau cours. Tous les champs marqués d'un * sont obligatoires."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Classe */}
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Classe <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Réinitialiser l'assignation quand la classe change
                        form.setValue("assignmentId", "");
                      }}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            formErrors.classId && "border-destructive",
                            !formErrors.classId &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{renderClassOptions}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignation - FILTRÉE PAR NIVEAU */}
              <FormField
                control={form.control}
                name="assignmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Assignation <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || !selectedClassId}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            formErrors.assignmentId && "border-destructive",
                            !formErrors.assignmentId &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue
                            placeholder={
                              !selectedClassId
                                ? "Sélectionnez d'abord une classe"
                                : filteredAssignments.length === 0
                                ? "Aucune assignation pour ce niveau"
                                : "Sélectionner une assignation"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{renderAssignmentOptions}</SelectContent>
                    </Select>
                    <FormMessage />
                    {selectedClassId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {filteredAssignments.length} assignation(s)
                        disponible(s) pour ce niveau
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jour */}
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Jour <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            formErrors.dayOfWeek && "border-destructive",
                            !formErrors.dayOfWeek &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Jour de la semaine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{renderDayOptions}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heure de début */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Début <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            formErrors.startTime && "border-destructive",
                            !formErrors.startTime &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="HH:mm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {renderStartTimeOptions}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heure de fin */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Fin <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            formErrors.endTime && "border-destructive",
                            !formErrors.endTime &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="HH:mm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {renderEndTimeOptions}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Récurrence */}
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Récurrence</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Si récurrence est NONE, réinitialiser untilDate
                      if (value === "NONE") {
                        form.setValue("untilDate", "");
                      }
                    }}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une récurrence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">
                        Aucune (cours unique)
                      </SelectItem>
                      <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                      <SelectItem value="BIWEEKLY">Bi-hebdomadaire</SelectItem>
                      <SelectItem value="MONTHLY">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value === "NONE"
                      ? "Le cours n'aura lieu qu'une seule fois"
                      : "Sélectionnez une date limite pour la récurrence ci-dessus"}
                  </p>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salle */}
              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salle</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Ex: Salle 101"
                          {...field}
                          className={cn(
                            "pl-10",
                            formErrors.classroom && "border-destructive"
                          )}
                          disabled={loading}
                          maxLength={100}
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-between">
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/100
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Valable jusqu'au */}
              <FormField
                control={form.control}
                name="untilDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valable jusqu'au</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className={cn(
                          formErrors.untilDate && "border-destructive"
                        )}
                        disabled={loading || recurrenceValue === "NONE"}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      {recurrenceValue === "NONE"
                        ? "Désactivé pour les cours non récurrents"
                        : "Date limite pour les cours récurrents"}
                    </p>
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes supplémentaires..."
                      {...field}
                      className={cn(formErrors.notes && "border-destructive")}
                      rows={3}
                      disabled={loading}
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <div className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/500
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            {/* Résumé de validation */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Il y a {Object.keys(formErrors).length} erreur(s) dans le
                  formulaire. Veuillez les corriger avant de soumettre.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading || isValidating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isFormValid || isValidating}
                  className={cn(
                    (loading || !isFormValid || isValidating) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading || isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {isEdit ? "Mettre à jour" : "Créer le cours"}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
