import React, { useEffect, useState } from "react";
import { format, isAfter } from "date-fns";
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
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react";
import useEventStore from "@/store/eventStore";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  event?: any;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  event,
  onSuccess,
}) => {
  const { createEvent, updateEvent, eventCategories, eventStatuses } =
    useEventStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: "",
    organizer: "",
    category: "Meeting",
    isPublic: true,
    status: "Scheduled",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Initialiser le formulaire avec les données de l'événement
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        location: event.location || "",
        organizer: event.organizer || "",
        category: event.category,
        isPublic: event.isPublic,
        status: event.status,
      });
    } else {
      // Réinitialiser le formulaire
      const now = new Date();
      const endDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure

      setFormData({
        title: "",
        description: "",
        startDate: now,
        endDate: endDate,
        location: "",
        organizer: "",
        category: "Meeting",
        isPublic: true,
        status: "Scheduled",
      });
    }
    setErrors({});
  }, [event, open]);

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }
    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      !isAfter(formData.endDate, formData.startDate)
    ) {
      newErrors.endDate =
        "La date de fin doit être postérieure à la date de début";
    }
    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
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
      const eventData = {
        ...formData,
        startDate: format(formData.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(formData.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      if (event) {
        await updateEvent(event.id, eventData);
      } else {
        await createEvent(eventData);
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting event:", error);
      setErrors({
        submit: error.response?.data?.message || "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  // Formater l'heure
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const handleTimeChange = (
    field: "startDate" | "endDate",
    timeString: string
  ) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(formData[field]);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    handleChange(field, newDate);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {event ? "Modifier l'événement" : "Nouvel événement"}
          </DialogTitle>
          <DialogDescription>
            {event
              ? "Modifiez les détails de l'événement"
              : "Créez un nouvel événement"}
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
              placeholder="Titre de l'événement"
              className={errors.title ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description détaillée de l'événement..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startDate, "PPP", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        date && handleChange("startDate", date)
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
                    value={formatTime(formData.startDate)}
                    onChange={(e) =>
                      handleTimeChange("startDate", e.target.value)
                    }
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.endDate, "PPP", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && handleChange("endDate", date)}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={formatTime(formData.endDate)}
                    onChange={(e) =>
                      handleTimeChange("endDate", e.target.value)
                    }
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Salle de conférence, Amphithéâtre..."
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organisateur</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => handleChange("organizer", e.target.value)}
                  placeholder="Nom de l'organisateur"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            {event && (
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleChange("isPublic", checked)}
              disabled={loading}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Événement public
            </Label>
            <Badge
              variant={formData.isPublic ? "default" : "secondary"}
              className="ml-2"
            >
              {formData.isPublic
                ? "Visible par tous"
                : "Visible par les admins uniquement"}
            </Badge>
          </div>

          <Separator />

          {/* Résumé */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Résumé de l'événement</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Durée: </span>
                {(() => {
                  const start = formData.startDate;
                  const end = formData.endDate;
                  const diffHours =
                    Math.abs(end.getTime() - start.getTime()) /
                    (1000 * 60 * 60);

                  if (diffHours < 1) {
                    return `${Math.round(diffHours * 60)} minutes`;
                  } else if (diffHours < 24) {
                    return `${Math.round(diffHours)} heures`;
                  } else {
                    return `${Math.round(diffHours / 24)} jours`;
                  }
                })()}
              </div>
              <div>
                <span className="text-muted-foreground">Dates: </span>
                {format(formData.startDate, "dd/MM/yyyy HH:mm", {
                  locale: fr,
                })}{" "}
                -{format(formData.endDate, " HH:mm", { locale: fr })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
