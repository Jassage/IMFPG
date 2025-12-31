// components/announcement/AnnouncementForm.tsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
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
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FileIcon,
  XIcon,
  AlertCircleIcon,
} from "lucide-react";
import useAnnouncementStore from "@/store/announcementStore";

// Schéma de validation avec Zod
const announcementSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Le titre doit contenir au moins 2 caractères" })
      .max(100, { message: "Le titre ne peut pas dépasser 100 caractères" }),
    content: z
      .string()
      .min(10, { message: "Le contenu doit contenir au moins 10 caractères" })
      .max(5000, {
        message: "Le contenu ne peut pas dépasser 5000 caractères",
      }),
    targetAudience: z.enum(
      ["All", "Students", "Teachers", "Parents", "Staff", "General"],
      {
        required_error: "Le public cible est requis",
      }
    ),
    priority: z.enum(["Critical", "High", "Medium", "Low"], {
      required_error: "La priorité est requise",
    }),
    publishDate: z.date({
      required_error: "La date de publication est requise",
    }),
    expiryDate: z.date().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Vérifier que la date d'expiration est après la date de publication si elle existe
      if (data.expiryDate && data.expiryDate < data.publishDate) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date d'expiration doit être postérieure à la date de publication",
      path: ["expiryDate"],
    }
  );

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  open?: boolean;
  onClose?: () => void;
  announcement?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  open,
  onClose,
  announcement,
  onSuccess,
  onCancel,
}) => {
  const {
    createAnnouncement,
    updateAnnouncement,
    targetAudienceOptions,
    priorityOptions,
  } = useAnnouncementStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
    clearErrors,
    trigger,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      targetAudience: "All",
      priority: "Medium",
      publishDate: new Date(),
      expiryDate: null,
      isActive: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Initialiser le formulaire
  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title,
        content: announcement.content,
        targetAudience: announcement.targetAudience,
        priority: announcement.priority,
        publishDate: new Date(announcement.publishDate),
        expiryDate: announcement.expiryDate
          ? new Date(announcement.expiryDate)
          : null,
        isActive: announcement.isActive,
      });
    } else {
      reset({
        title: "",
        content: "",
        targetAudience: "All",
        priority: "Medium",
        publishDate: new Date(),
        expiryDate: null,
        isActive: true,
      });
    }
    setFiles([]);
  }, [announcement, open, reset]);

  // Observer les valeurs pour validation en temps réel
  const watchAllFields = watch();

  // Validation en temps réel
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        trigger();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [watchAllFields, open, trigger]);

  // Soumission du formulaire
  const onSubmit = async (data: AnnouncementFormData) => {
    setLoading(true);
    try {
      const announcementData = {
        title: data.title!,
        content: data.content!,
        targetAudience: data.targetAudience!,
        priority: data.priority!,
        publishDate: format(data.publishDate, "yyyy-MM-dd'T'HH:mm:ss"),
        expiryDate: data.expiryDate
          ? format(data.expiryDate, "yyyy-MM-dd'T'HH:mm:ss")
          : undefined,
        isActive: data.isActive,
        attachments: files,
      };

      if (announcement) {
        await updateAnnouncement(announcement.id, announcementData);
      } else {
        await createAnnouncement(announcementData);
      }

      onSuccess();
      reset();
    } catch (error: any) {
      console.error("Error submitting announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);

      // Validation des fichiers (max 5MB par fichier)
      const validFiles = newFiles.filter(
        (file) => file.size <= 5 * 1024 * 1024
      );

      if (validFiles.length < newFiles.length) {
        alert("Certains fichiers dépassent la limite de 5MB");
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Formater l'heure
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const handleTimeChange = (
    field: "publishDate" | "expiryDate",
    timeString: string
  ) => {
    const currentDate = watch(field);
    if (!currentDate) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setValue(field, newDate, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-background">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl">
              {announcement ? "Modifier l'annonce" : "Nouvelle annonce"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {announcement
                ? "Modifiez les détails de l'annonce"
                : "Créez une nouvelle annonce"}
            </p>
          </DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Titre de l'annonce"
              className={errors.title ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircleIcon className="h-3 w-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Contenu détaillé de l'annonce..."
              rows={6}
              className={errors.content ? "border-destructive" : ""}
              disabled={loading}
            />
            <div className="flex justify-between items-center">
              {errors.content ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  {errors.content.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 10 caractères, maximum 5000
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch("content")?.length || 0}/5000
              </p>
            </div>
          </div>

          {/* Public cible et Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Public cible *</Label>
              <Select
                value={watch("targetAudience")}
                onValueChange={(value: any) => {
                  setValue("targetAudience", value, { shouldValidate: true });
                  clearErrors("targetAudience");
                }}
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.targetAudience ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Sélectionner un public" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudienceOptions.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.targetAudience && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  {errors.targetAudience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité *</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value: any) => {
                  setValue("priority", value, { shouldValidate: true });
                  clearErrors("priority");
                }}
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.priority ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de publication */}
            <div className="space-y-2">
              <Label htmlFor="publishDate">Date de publication *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watch("publishDate") && "text-muted-foreground",
                        errors.publishDate && "border-destructive"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("publishDate")
                        ? format(watch("publishDate"), "PPP", { locale: fr })
                        : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("publishDate")}
                      onSelect={(date) => {
                        if (date) {
                          setValue("publishDate", date, {
                            shouldValidate: true,
                          });
                          clearErrors("publishDate");
                        }
                      }}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={
                      watch("publishDate")
                        ? formatTime(watch("publishDate"))
                        : ""
                    }
                    onChange={(e) =>
                      handleTimeChange("publishDate", e.target.value)
                    }
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              {errors.publishDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  {errors.publishDate.message}
                </p>
              )}
            </div>

            {/* Date d'expiration */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d'expiration (optionnel)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watch("expiryDate") && "text-muted-foreground",
                        errors.expiryDate && "border-destructive"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("expiryDate")
                        ? format(watch("expiryDate"), "PPP", { locale: fr })
                        : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("expiryDate") || undefined}
                      onSelect={(date) => {
                        if (date) {
                          setValue("expiryDate", date, {
                            shouldValidate: true,
                          });
                          clearErrors("expiryDate");
                        }
                      }}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                {watch("expiryDate") && (
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={formatTime(watch("expiryDate")!)}
                      onChange={(e) =>
                        handleTimeChange("expiryDate", e.target.value)
                      }
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
              {errors.expiryDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => {
                setValue("isActive", checked, { shouldValidate: true });
              }}
              disabled={loading}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Annonce active
            </Label>
            <Badge
              variant={watch("isActive") ? "default" : "outline"}
              className="ml-2"
            >
              {watch("isActive")
                ? "Visible par les utilisateurs"
                : "Non visible"}
            </Badge>
          </div>

          <Separator />

          {/* Pièces jointes */}
          <div className="space-y-2">
            <Label>Pièces jointes (optionnel)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground text-center">
                  Glissez-déposez des fichiers ou cliquez pour sélectionner
                  <br />
                  <span className="text-xs">Max 5MB par fichier</span>
                </div>
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  size="sm"
                >
                  Sélectionner des fichiers
                </Button>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Fichiers sélectionnés:</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center">
                        <FileIcon className="mr-2 h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium truncate max-w-[200px]">
                            {file.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        disabled={loading}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Résumé */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Résumé de l'annonce</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Public: </span>
                <Badge variant="outline" className="ml-1">
                  {watch("targetAudience")}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Priorité: </span>
                {watch("priority") === "Critical" ||
                watch("priority") === "High" ? (
                  <Badge variant="destructive" className="ml-1">
                    {watch("priority")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-1">
                    {watch("priority")}
                  </Badge>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Publication: </span>
                {watch("publishDate") &&
                  format(watch("publishDate"), "dd/MM/yyyy HH:mm", {
                    locale: fr,
                  })}
              </div>
              <div>
                <span className="text-muted-foreground">Expiration: </span>
                {watch("expiryDate")
                  ? format(watch("expiryDate"), "dd/MM/yyyy HH:mm", {
                      locale: fr,
                    })
                  : "Pas d'expiration"}
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Statut: </span>
                <Badge
                  variant={watch("isActive") ? "default" : "outline"}
                  className="ml-1"
                >
                  {watch("isActive") ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || onClose}
              disabled={loading}
              size="sm"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              size="sm"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  En cours...
                </>
              ) : announcement ? (
                "Mettre à jour"
              ) : (
                "Créer l'annonce"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementForm;
