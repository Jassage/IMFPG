import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FileIcon,
  XIcon,
} from "lucide-react";
import useAnnouncementStore from "@/store/announcementStore";
// import { useAnnouncementStore } from "@/stores/announcement.store";

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

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "All",
    priority: "Medium",
    publishDate: new Date(),
    expiryDate: undefined as Date | undefined,
    isActive: true,
    attachments: [] as File[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Initialiser le formulaire avec les données de l'annonce
  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        targetAudience: announcement.targetAudience,
        priority: announcement.priority,
        publishDate: new Date(announcement.publishDate),
        expiryDate: announcement.expiryDate
          ? new Date(announcement.expiryDate)
          : undefined,
        isActive: announcement.isActive,
        attachments: [],
      });
    } else {
      // Réinitialiser le formulaire
      setFormData({
        title: "",
        content: "",
        targetAudience: "All",
        priority: "Medium",
        publishDate: new Date(),
        expiryDate: undefined,
        isActive: true,
        attachments: [],
      });
    }
    setErrors({});
  }, [announcement, open]);

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Le contenu est requis";
    }
    if (!formData.publishDate) {
      newErrors.publishDate = "La date de publication est requise";
    }
    if (formData.expiryDate && formData.expiryDate < formData.publishDate) {
      newErrors.expiryDate =
        "La date d'expiration doit être postérieure à la date de publication";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const announcementData = {
        ...formData,
        publishDate: format(formData.publishDate, "yyyy-MM-dd'T'HH:mm:ss"),
        expiryDate: formData.expiryDate
          ? format(formData.expiryDate, "yyyy-MM-dd'T'HH:mm:ss")
          : undefined,
      };

      if (announcement) {
        await updateAnnouncement(announcement.id, announcementData);
      } else {
        await createAnnouncement(announcementData);
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting announcement:", error);
      setErrors({
        submit: error.response?.data?.message || "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion des fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Formater l'heure
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const handleTimeChange = (
    field: "publishDate" | "expiryDate",
    timeString: string
  ) => {
    if (!formData[field]) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(formData[field]!);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    handleChange(field, newDate);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Modifier l'annonce" : "Nouvelle annonce"}
          </DialogTitle>
          <DialogDescription>
            {announcement
              ? "Modifiez les détails de l'annonce"
              : "Créez une nouvelle annonce"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors.submit && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Titre de l'annonce"
              className={errors.title ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Contenu détaillé de l'annonce..."
              rows={6}
              className={errors.content ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Public cible *</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleChange("targetAudience", value)}
                disabled={loading}
              >
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
                disabled={loading}
              >
                <SelectTrigger>
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
            </div>
          </div>

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
                        !formData.publishDate && "text-muted-foreground",
                        errors.publishDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.publishDate, "PPP", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.publishDate}
                      onSelect={(date) =>
                        date && handleChange("publishDate", date)
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formatTime(formData.publishDate)}
                    onChange={(e) =>
                      handleTimeChange("publishDate", e.target.value)
                    }
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              {errors.publishDate && (
                <p className="text-sm text-destructive">{errors.publishDate}</p>
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
                        !formData.expiryDate && "text-muted-foreground",
                        errors.expiryDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate
                        ? format(formData.expiryDate, "PPP", { locale: fr })
                        : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => handleChange("expiryDate", date)}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                {formData.expiryDate && (
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={formatTime(formData.expiryDate)}
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
                <p className="text-sm text-destructive">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
              disabled={loading}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Annonce active
            </Label>
            <Badge
              variant={formData.isActive ? "default" : "outline"}
              className="ml-2"
            >
              {formData.isActive
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
                <div className="text-sm text-muted-foreground">
                  Glissez-déposez des fichiers ou cliquez pour sélectionner
                </div>
                <Button variant="outline" type="button" disabled={loading}>
                  Sélectionner des fichiers
                </Button>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Fichiers sélectionnés:</Label>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center">
                        <FileIcon className="mr-2 h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
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
                <Badge variant="outline">{formData.targetAudience}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Priorité: </span>
                {renderPriorityBadge(formData.priority)}
              </div>
              <div>
                <span className="text-muted-foreground">Publication: </span>
                {format(formData.publishDate, "dd/MM/yyyy HH:mm", {
                  locale: fr,
                })}
              </div>
              <div>
                <span className="text-muted-foreground">Expiration: </span>
                {formData.expiryDate
                  ? format(formData.expiryDate, "dd/MM/yyyy HH:mm", {
                      locale: fr,
                    })
                  : "Pas d'expiration"}
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Statut: </span>
                <Badge variant={formData.isActive ? "default" : "outline"}>
                  {formData.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel || onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper pour rendre les badges de priorité
const renderPriorityBadge = (priority: string) => {
  const priorityConfig: Record<
    string,
    { variant: "default" | "destructive" | "outline" | "secondary" }
  > = {
    Critical: { variant: "destructive" },
    High: { variant: "destructive" },
    Medium: { variant: "default" },
    Low: { variant: "secondary" },
  };

  const config = priorityConfig[priority] || { variant: "outline" as const };
  return <Badge variant={config.variant}>{priority}</Badge>;
};

export default AnnouncementForm;
