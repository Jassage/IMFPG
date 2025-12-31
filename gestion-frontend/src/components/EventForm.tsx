import React, { useEffect, useState } from "react";
import { format, isAfter, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  AlertCircle,
  CheckCircle,
  InfoIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useEventStore from "@/store/eventStore";
import { toast } from "sonner";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  event?: any;
  onSuccess: () => void;
}

// Définition du schéma de validation avec Zod
const eventFormSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
      .max(100, { message: "Le titre ne peut pas dépasser 100 caractères" })
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: "Le titre est requis",
      }),

    description: z
      .string()
      .min(10, {
        message: "La description doit contenir au moins 10 caractères",
      })
      .max(500, {
        message: "La description ne peut pas dépasser 500 caractères",
      })
      .optional()
      .transform((val) => val?.trim() || ""),

    startDate: z
      .date({
        required_error: "La date de début est requise",
        invalid_type_error: "Date de début invalide",
      })
      .refine((date) => isValid(date), {
        message: "Date de début invalide",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "La date de début ne peut pas être dans le passé",
        }
      ),

    endDate: z
      .date({
        required_error: "La date de fin est requise",
        invalid_type_error: "Date de fin invalide",
      })
      .refine((date) => isValid(date), {
        message: "Date de fin invalide",
      }),

    location: z
      .string()
      .max(100, { message: "Le lieu ne peut pas dépasser 100 caractères" })
      .optional()
      .transform((val) => val?.trim() || ""),

    organizer: z
      .string()
      .max(50, { message: "L'organisateur ne peut pas dépasser 50 caractères" })
      .optional()
      .transform((val) => val?.trim() || ""),

    category: z.string().min(1, { message: "La catégorie est requise" }),

    isPublic: z.boolean().default(true),

    status: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!isValid(data.startDate) || !isValid(data.endDate)) return true;
      return isAfter(data.endDate, data.startDate);
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!isValid(data.startDate) || !isValid(data.endDate)) return true;
      const durationHours =
        Math.abs(data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60);
      return durationHours <= 24;
    },
    {
      message: "La durée ne peut pas dépasser 24 heures",
      path: ["endDate"],
    }
  );

type EventFormValues = z.infer<typeof eventFormSchema>;

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  event,
  onSuccess,
}) => {
  const { createEvent, updateEvent, eventCategories, eventStatuses } =
    useEventStore();

  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialiser le formulaire avec react-hook-form et Zod
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
      location: "",
      organizer: "",
      category: "",
      isPublic: true,
      status: "Scheduled",
    },
    mode: "onChange", // Validation en temps réel
  });

  // Initialiser les données si événement existant
  useEffect(() => {
    if (event && open) {
      const defaultValues: EventFormValues = {
        title: event.title || "",
        description: event.description || "",
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate
          ? new Date(event.endDate)
          : new Date(new Date().setHours(new Date().getHours() + 1)),
        location: event.location || "",
        organizer: event.organizer || "",
        category: event.category || "",
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
        status: event.status || "Scheduled",
      };

      form.reset(defaultValues);
      setServerError(null);
    } else if (open) {
      // Réinitialiser pour un nouvel événement
      const now = new Date();
      const endDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure

      form.reset({
        title: "",
        description: "",
        startDate: now,
        endDate,
        location: "",
        organizer: "",
        category: "",
        isPublic: true,
        status: "Scheduled",
      });
      setServerError(null);
    }
  }, [event, open, form]);

  // Gestion de la soumission
  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    setServerError(null);

    try {
      const eventData = {
        ...data,
        startDate: format(data.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(data.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      // Ensure payload satisfies the store signature (cast to any to avoid TS mismatch)
      const payload = {
        ...eventData,
        title: data.title as string,
      } as any;

      if (event) {
        await updateEvent(event.id, payload);
        toast.success("Événement mis à jour avec succès", {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } else {
        await createEvent(payload);
        toast.success("Événement créé avec succès", {
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error submitting event:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement";
      setServerError(errorMessage);

      toast.error(errorMessage, {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  // Formater l'heure
  const formatTime = (date: Date): string => {
    return format(date, "HH:mm");
  };

  // Gestion du changement de temps
  const handleTimeChange = (
    field: "startDate" | "endDate",
    timeString: string
  ) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const currentDate = form.getValues()[field];
    const newDate = new Date(currentDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    form.setValue(field, newDate, {
      shouldValidate: true, // Déclencher la validation
      shouldDirty: true, // Marquer comme modifié
    });
  };

  // Calculer la durée
  const calculateDuration = () => {
    const { startDate, endDate } = form.getValues();
    if (!isValid(startDate) || !isValid(endDate)) return "";

    const diffHours =
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} minutes`;
    } else if (diffHours < 24) {
      return `${Math.round(diffHours)} heures`;
    } else {
      return `${Math.round(diffHours / 24)} jours`;
    }
  };

  // Rendu du badge de statut de champ
  const renderFieldStatus = (fieldName: keyof EventFormValues) => {
    const error = form.formState.errors[fieldName];
    const isTouched = form.formState.touchedFields[fieldName];
    const value = form.getValues()[fieldName];

    if (!isTouched) return null;

    if (error) {
      return (
        <Badge variant="destructive" className="ml-2 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Erreur
        </Badge>
      );
    }

    if (value && (typeof value === "string" ? value.trim().length > 0 : true)) {
      return (
        <Badge
          variant="outline"
          className="ml-2 text-xs border-green-200 bg-green-50 text-green-700"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Valide
        </Badge>
      );
    }

    return null;
  };

  // Vérifier si le formulaire est valide
  const isFormValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {event ? "Modifier l'événement" : "Nouvel événement"}
          </DialogTitle>
          <DialogDescription>
            {event
              ? "Modifiez les détails de l'événement"
              : "Créez un nouvel événement. Tous les champs marqués d'un * sont obligatoires."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-1">
                      Titre <span className="text-destructive">*</span>
                    </FormLabel>
                    {renderFieldStatus("title")}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Titre de l'événement"
                      {...field}
                      className={cn(
                        form.formState.errors.title && "border-destructive",
                        !form.formState.errors.title &&
                          field.value?.trim().length >= 3 &&
                          "border-green-500"
                      )}
                      disabled={loading}
                      maxLength={100}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <div className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/100
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    {renderFieldStatus("description")}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée de l'événement..."
                      {...field}
                      rows={4}
                      className={cn(
                        form.formState.errors.description &&
                          "border-destructive",
                        !form.formState.errors.description &&
                          field.value?.trim().length > 0 &&
                          "border-green-500"
                      )}
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

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Dates et heures
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date de début */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1">
                          Date de début{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        {renderFieldStatus("startDate")}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                form.formState.errors.startDate &&
                                  "border-destructive",
                                !form.formState.errors.startDate &&
                                  "border-green-500"
                              )}
                              disabled={loading}
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              locale={fr}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={field.value ? formatTime(field.value) : ""}
                            onChange={(e) => {
                              const timeString = e.target.value;
                              const [hours, minutes] = timeString
                                .split(":")
                                .map(Number);
                              if (!isNaN(hours) && !isNaN(minutes)) {
                                const newDate = new Date(field.value);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                field.onChange(newDate);
                              }
                            }}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date de fin */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1">
                          Date de fin{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        {renderFieldStatus("endDate")}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                form.formState.errors.endDate &&
                                  "border-destructive",
                                !form.formState.errors.endDate &&
                                  "border-green-500"
                              )}
                              disabled={loading}
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              locale={fr}
                              disabled={(date) =>
                                date < form.getValues().startDate
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={field.value ? formatTime(field.value) : ""}
                            onChange={(e) => {
                              const timeString = e.target.value;
                              const [hours, minutes] = timeString
                                .split(":")
                                .map(Number);
                              if (!isNaN(hours) && !isNaN(minutes)) {
                                const newDate = new Date(field.value);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                field.onChange(newDate);
                              }
                            }}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Lieu et organisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lieu */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Lieu</FormLabel>
                      {renderFieldStatus("location")}
                    </div>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Salle de conférence, Amphithéâtre..."
                          {...field}
                          className="pl-10"
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

              {/* Organisateur */}
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Organisateur</FormLabel>
                      {renderFieldStatus("organizer")}
                    </div>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Nom de l'organisateur"
                          {...field}
                          className="pl-10"
                          disabled={loading}
                          maxLength={50}
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-between">
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/50
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Catégorie et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Catégorie */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-1">
                        Catégorie <span className="text-destructive">*</span>
                      </FormLabel>
                      {renderFieldStatus("category")}
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.category &&
                              "border-destructive",
                            !form.formState.errors.category &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Statut */}
              {event && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Visibilité */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer font-medium">
                          Événement public
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Rendre l'événement visible à tous les utilisateurs
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={field.value ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {field.value
                        ? "Visible par tous"
                        : "Visible par les admins uniquement"}
                    </Badge>
                  </div>
                </FormItem>
              )}
            />

            {/* Bouton pour afficher/masquer le résumé */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowSummary(!showSummary)}
              disabled={loading}
            >
              {showSummary ? "Masquer le résumé" : "Afficher le résumé"}
              {showSummary ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>

            {/* Résumé */}
            {showSummary && (
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Résumé de l'événement
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Titre: </span>
                    <span className="font-medium">
                      {form.watch("title") || "Non défini"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Catégorie: </span>
                    <Badge variant="outline">
                      {form.watch("category") || "Non définie"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Début: </span>
                    <span className="font-medium">
                      {form.watch("startDate")
                        ? format(form.watch("startDate"), "dd/MM/yyyy HH:mm", {
                            locale: fr,
                          })
                        : "Non défini"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fin: </span>
                    <span className="font-medium">
                      {form.watch("endDate")
                        ? format(form.watch("endDate"), "dd/MM/yyyy HH:mm", {
                            locale: fr,
                          })
                        : "Non défini"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durée: </span>
                    <span className="font-medium">{calculateDuration()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lieu: </span>
                    <span className="font-medium">
                      {form.watch("location") || "Non défini"}
                    </span>
                  </div>
                  {form.watch("organizer") && (
                    <div>
                      <span className="text-muted-foreground">
                        Organisateur:{" "}
                      </span>
                      <span className="font-medium">
                        {form.watch("organizer")}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Visibilité: </span>
                    <Badge
                      variant={form.watch("isPublic") ? "default" : "secondary"}
                    >
                      {form.watch("isPublic") ? "Public" : "Privé"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Aperçu des erreurs */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">Erreurs à corriger:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {Object.entries(form.formState.errors).map(
                      ([key, error]) => (
                        <li key={key}>
                          {typeof error === "object" && "message" in error
                            ? (error.message as string)
                            : `Erreur dans le champ ${key}`}
                        </li>
                      )
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <div className="text-sm text-muted-foreground flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isFormValid ? "bg-green-500" : "bg-destructive"
                    }`}
                  />
                  <span>
                    {isFormValid ? "Formulaire valide" : "Formulaire invalide"}
                  </span>
                </div>
                <p className="text-xs mt-1">
                  {Object.keys(form.formState.errors).length === 0
                    ? "Tous les champs sont valides"
                    : `${
                        Object.keys(form.formState.errors).length
                      } erreur(s) à corriger`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  type="button"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || loading || (!isDirty && event)}
                  className={cn(
                    (!isFormValid || loading || (!isDirty && event)) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      En cours...
                    </>
                  ) : event ? (
                    "Mettre à jour"
                  ) : (
                    "Créer l'événement"
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

export default EventForm;
