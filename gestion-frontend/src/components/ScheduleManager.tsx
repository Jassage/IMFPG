// components/timetable/ScheduleManager.tsx
import React, { useState, useEffect } from "react";
import { useTimetableStore } from "@/store/timetableStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useClassStore } from "@/store/classStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  BookOpen,
  MapPin,
  Filter,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import useProfesseurStore from "@/store/professorStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";

interface ScheduleManagerProps {
  classId?: string;
  assignmentId?: string;
  academicYearId?: string;
}

// Composant List pour remplacer l'icône manquante
const List = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  classId: propClassId,
  assignmentId,
  academicYearId: propAcademicYearId,
}) => {
  const [activeTab, setActiveTab] = useState("view");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dayOfWeek: "",
    status: "ACTIVE",
    classroom: "",
  });

  // États locaux pour les filtres
  const [selectedClassId, setSelectedClassId] = useState<string>(
    propClassId || ""
  );
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>(
    propAcademicYearId || ""
  );
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>("");

  const {
    schedules,
    error,
    loading,
    fetchClassTimetable,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    generateClassTimetable,
  } = useTimetableStore();

  const {
    assignments,
    fetchAssignments,
    fetchAssignmentsByClassAndLevel,
    loading: assignmentsLoading,
  } = useAssignmentStore();

  const { subjects, fetchSubjects } = useSubjectStore();
  const { classes, fetchClasses } = useClassStore();
  const { professeurs, fetchProfesseurs } = useProfesseurStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  useEffect(() => {
    loadInitialData();
  }, [propClassId, propAcademicYearId]);

  const loadInitialData = async () => {
    try {
      // Charger les données de base
      await Promise.all([fetchClasses(), fetchSubjects(), fetchProfesseurs()]);

      // Si une classe est spécifiée dans les props, la charger
      if (propClassId) {
        const selectedClass = classes.find((c) => c.id === propClassId);
        if (selectedClass) {
          setSelectedClassId(propClassId);
          setSelectedClassLevel(selectedClass.level);

          // Charger les horaires de la classe
          await fetchClassTimetable(propClassId, {
            academicYearId: propAcademicYearId,
          });

          // Charger les assignations filtrées par classe et niveau
          await fetchAssignmentsByClassAndLevel(
            propClassId,
            selectedClass.level
          );
        }
      } else {
        // Charger toutes les assignations
        await fetchAssignments();
      }
    } catch (error) {
      console.error(" Error loading initial data:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  // Charger les assignations lorsqu'une classe est sélectionnée
  useEffect(() => {
    if (selectedClassId) {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        setSelectedClassLevel(selectedClass.level);
        loadAssignmentsForClass(selectedClassId, selectedClass.level);

        // Charger les horaires pour cette classe
        fetchClassTimetable(selectedClassId, {
          academicYearId: selectedAcademicYearId,
        });
      }
    } else {
      fetchAssignments(); // Charger toutes les assignations
    }
  }, [selectedClassId, selectedAcademicYearId]);

  const loadAssignmentsForClass = async (classId: string, level: string) => {
    try {
      await fetchAssignmentsByClassAndLevel(classId, level);
    } catch (error) {
      console.error(" Error loading assignments:", error);
      toast.error("Erreur lors du chargement des assignations");
    }
  };

  // Filtrer les horaires
  const filteredSchedules = schedules.filter((schedule) => {
    // Filtrer par classe si une classe est sélectionnée
    if (selectedClassId && schedule.classId !== selectedClassId) return false;

    if (filters.dayOfWeek && schedule.dayOfWeek !== filters.dayOfWeek)
      return false;
    if (filters.status && schedule.status !== filters.status) return false;
    if (filters.classroom && !schedule.classroom?.includes(filters.classroom))
      return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const subjectName = getSubjectName(schedule)?.toLowerCase() || "";
      const professeurName = getProfesseurName(schedule)?.toLowerCase() || "";

      return (
        subjectName.includes(searchLower) ||
        professeurName.includes(searchLower) ||
        schedule.classroom?.toLowerCase().includes(searchLower) ||
        schedule.notes?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Fonction pour obtenir le nom de la matière
  const getSubjectName = (schedule: any) => {
    return (
      schedule.classAssignment?.subject?.name ||
      schedule.subject?.name ||
      schedule.assignment?.subject?.name ||
      "Sans nom"
    );
  };

  // Fonction pour obtenir le nom du professeur
  const getProfesseurName = (schedule: any) => {
    const professeur =
      schedule.classAssignment?.professeur ||
      schedule.professeur ||
      schedule.assignment?.professeur;
    if (professeur) {
      return `${professeur.firstName || ""} ${
        professeur.lastName || ""
      }`.trim();
    }
    return "";
  };

  // Grouper par jour
  const schedulesByDay = filteredSchedules.reduce((acc, schedule) => {
    const day = schedule.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as Record<string, typeof schedules>);

  // Statistiques
  const stats = {
    total: filteredSchedules.length,
    byDay: Object.keys(schedulesByDay).length,
    active: filteredSchedules.filter((s) => s.status === "ACTIVE").length,
    conflicts: 0,
  };

  // Gestion des formulaires
  const [formData, setFormData] = useState({
    assignmentId: assignmentId || "",
    classId: selectedClassId || "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    classroom: "",
    recurrence: "",
    untilDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assignmentId) newErrors.assignmentId = "Assignation requise";
    if (!formData.classId) newErrors.classId = "Classe requise";
    if (!formData.dayOfWeek) newErrors.dayOfWeek = "Jour requis";
    if (!formData.startTime) newErrors.startTime = "Heure de début requise";
    if (!formData.endTime) newErrors.endTime = "Heure de fin requise";

    if (formData.startTime && formData.endTime) {
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;

      if (endTotal <= startTotal) {
        newErrors.endTime = "L'heure de fin doit être après l'heure de début";
      }
      if (endTotal - startTotal < 30) {
        newErrors.endTime = "Durée minimale: 30 minutes";
      }
      if (endTotal - startTotal > 240) {
        newErrors.endTime = "Durée maximale: 4 heures";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      const scheduleData = {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        classId: formData.classId,
        classroom: formData.classroom || undefined,
        recurrence: formData.recurrence || undefined,
        untilDate: formData.untilDate || undefined,
        notes: formData.notes || undefined,
      };

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData);
        toast.success("L'horaire a été mis à jour avec succès");
      } else {
        await addSchedule(formData.assignmentId, scheduleData);
        toast.success("L'horaire a été ajouté avec succès");
      }

      // Réinitialiser
      resetForm();
      if (formData.classId) {
        fetchClassTimetable(formData.classId, {
          academicYearId: selectedAcademicYearId,
        });
      }
    } catch (error: any) {
      toast.error(error.data.message || "Erreur lors de l'opération");
    }
  };

  // CORRECTION de handleEdit
  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);

    // DEBUG: Vérifiez la structure du schedule
    console.log("📝 Editing schedule:", {
      id: schedule.id,
      assignmentId: schedule.assignmentId,
      classAssignmentId: schedule.classAssignment?.id,
      classId: schedule.classId,
      keys: Object.keys(schedule),
    });

    setFormData({
      assignmentId: schedule.assignmentId || schedule.classAssignment?.id || "",
      classId: schedule.classId || selectedClassId || "",
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      classroom: schedule.classroom || "",
      recurrence: schedule.recurrence || "",
      untilDate: schedule.untilDate
        ? format(new Date(schedule.untilDate), "yyyy-MM-dd")
        : "",
      notes: schedule.notes || "",
    });

    setIsDialogOpen(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet horaire ?")) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);
      toast.success("L'horaire a été supprimé avec succès");

      // Recharger les horaires si une classe est sélectionnée
      if (selectedClassId) {
        fetchClassTimetable(selectedClassId, {
          academicYearId: selectedAcademicYearId,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      assignmentId: assignmentId || "",
      classId: selectedClassId || "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      classroom: "",
      recurrence: "",
      untilDate: "",
      notes: "",
    });
    setEditingSchedule(null);
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleGenerateTimetable = async () => {
    if (!selectedClassId || !selectedAcademicYearId) {
      toast.error("Classe et année académique sont requises");
      return;
    }

    try {
      await generateClassTimetable(selectedClassId, selectedAcademicYearId, {
        clearExisting: true,
      });
      toast.success("L'emploi du temps a été généré automatiquement");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la génération");
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);

    // Mettre à jour le formData si on est en mode édition
    if (!editingSchedule) {
      setFormData((prev) => ({ ...prev, classId }));
    }

    // Trouver la classe sélectionnée
    const selectedClass = classes.find((c) => c.id === classId);
    if (selectedClass) {
      setSelectedClassLevel(selectedClass.level);

      // Charger les assignations pour cette classe et ce niveau
      loadAssignmentsForClass(classId, selectedClass.level);
    }
  };

  const handleAcademicYearChange = (yearId: string) => {
    setSelectedAcademicYearId(yearId);

    // Recharger les assignations et horaires si une classe est sélectionnée
    if (selectedClassId) {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        loadAssignmentsForClass(selectedClassId, selectedClass.level);
        fetchClassTimetable(selectedClassId, { academicYearId: yearId });
      }
    }
  };

  const days = [
    { value: "MONDAY", label: "Lundi" },
    { value: "TUESDAY", label: "Mardi" },
    { value: "WEDNESDAY", label: "Mercredi" },
    { value: "THURSDAY", label: "Jeudi" },
    { value: "FRIDAY", label: "Vendredi" },
    { value: "SATURDAY", label: "Samedi" },
  ];

  const timeSlots = [
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
  ];

  const dayLabels: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  // Composant ScheduleCard à l'intérieur pour accéder aux fonctions utilitaires
  interface ScheduleCardProps {
    schedule: any;
    onEdit: (schedule: any) => void;
    onDelete: (scheduleId: string) => void;
    variant?: "default" | "compact" | "list";
  }

  const ScheduleCard: React.FC<ScheduleCardProps> = ({
    schedule,
    onEdit,
    onDelete,
    variant = "default",
  }) => {
    const [showActions, setShowActions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDeleting) return;

      setIsDeleting(true);
      try {
        await onDelete(schedule.id);
      } finally {
        setIsDeleting(false);
      }
    };

    const subjectName = getSubjectName(schedule);
    const professeurName = getProfesseurName(schedule);

    if (variant === "compact") {
      return (
        <div
          className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
          onClick={() => onEdit(schedule)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-sm">{subjectName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-2">
                  <span>
                    {formatTime(schedule.startTime)}-
                    {formatTime(schedule.endTime)}
                  </span>
                  {schedule.classroom && (
                    <>
                      <span>•</span>
                      <span>{schedule.classroom}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {showActions && (
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(schedule);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (variant === "list") {
      return (
        <div
          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="font-medium">{subjectName}</div>
                <Badge variant="outline">
                  {dayLabels[schedule.dayOfWeek] || schedule.dayOfWeek}
                </Badge>
                <Badge
                  variant={
                    schedule.status === "ACTIVE"
                      ? "default"
                      : schedule.status === "CANCELLED"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {schedule.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(schedule.startTime)} -{" "}
                  {formatTime(schedule.endTime)}
                </div>

                {professeurName && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {professeurName}
                  </div>
                )}

                {schedule.classroom && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {schedule.classroom}
                  </div>
                )}
              </div>

              {schedule.notes && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Notes:</span> {schedule.notes}
                </div>
              )}
            </div>

            <div
              className={`flex gap-2 ${
                showActions ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(schedule)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="p-3 bg-card border rounded-lg hover:shadow-md transition-all cursor-pointer group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => onEdit(schedule)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium text-sm">{subjectName}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-2">
                {professeurName && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {professeurName.length > 15
                      ? professeurName.substring(0, 15) + "..."
                      : professeurName}
                  </span>
                )}
                {schedule.classroom && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {schedule.classroom}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex gap-1 ${
              showActions ? "opacity-100" : "opacity-0"
            } transition-opacity`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(schedule);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Horaires</h1>
          <p className="text-muted-foreground">
            Gérez les horaires de cours pour les classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedClassId && (
            <Button variant="outline" onClick={handleGenerateTimetable}>
              <Calendar className="h-4 w-4 mr-2" />
              Générer automatiquement
            </Button>
          )}
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel horaire
          </Button>
        </div>
      </div>

      {/* Filtres de classe et année académique */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres de classe</CardTitle>
          <CardDescription>
            Sélectionnez une classe pour filtrer les assignations et horaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterClass">Classe</Label>
              <Select
                value={selectedClassId}
                onValueChange={handleClassChange}
                disabled={!!propClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} (Niveau: {cls.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClassId && selectedClassLevel && (
                <p className="text-xs text-muted-foreground">
                  Niveau: {selectedClassLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterAcademicYear">Année académique</Label>
              <Select
                value={selectedAcademicYearId}
                onValueChange={handleAcademicYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                      {year.isCurrent ? " (Actuelle)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Horaires totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.byDay}</div>
            <div className="text-sm text-muted-foreground">
              Jours avec cours
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Horaires actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.conflicts}</div>
            <div className="text-sm text-muted-foreground">
              Conflits détectés
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Jour</Label>
              <Select
                value={filters.dayOfWeek}
                onValueChange={(value) =>
                  setFilters({ ...filters, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les jours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les jours</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Salle</Label>
              <Input
                id="classroom"
                placeholder="Filtrer par salle"
                value={filters.classroom}
                onChange={(e) =>
                  setFilters({ ...filters, classroom: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">
            <Calendar className="h-4 w-4 mr-2" />
            Vue calendrier
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            Vue liste
          </TabsTrigger>
          <TabsTrigger value="byDay">
            <Calendar className="h-4 w-4 mr-2" />
            Par jour
          </TabsTrigger>
        </TabsList>

        {/* Vue calendrier */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des horaires</CardTitle>
              {selectedClassId && (
                <CardDescription>
                  Classe: {classes.find((c) => c.id === selectedClassId).name} |
                  Assignations disponibles: {assignments.length}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-32 p-3 border text-left font-medium bg-muted/50">
                        Créneaux
                      </th>
                      {days.map((day) => (
                        <th
                          key={day.value}
                          className="p-3 border text-center font-medium bg-muted/50"
                        >
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots
                      .filter((_, index) => index % 2 === 0) // Afficher seulement les heures pleines
                      .map((timeSlot) => {
                        const nextIndex = timeSlots.indexOf(timeSlot) + 1;
                        const endSlot =
                          nextIndex < timeSlots.length
                            ? timeSlots[nextIndex]
                            : "19:30";
                        return (
                          <tr key={timeSlot}>
                            <td className="p-3 border text-center font-medium bg-muted/30">
                              <div className="flex flex-col">
                                <span>{timeSlot}</span>
                                <span className="text-xs text-muted-foreground">
                                  à
                                </span>
                                <span>{endSlot}</span>
                              </div>
                            </td>
                            {days.map((day) => {
                              const cellSchedules = filteredSchedules.filter(
                                (schedule) =>
                                  schedule.dayOfWeek === day.value &&
                                  schedule.startTime >= timeSlot &&
                                  schedule.startTime < endSlot
                              );
                              return (
                                <td
                                  key={`${day.value}-${timeSlot}`}
                                  className="p-2 border min-w-[180px]"
                                >
                                  {cellSchedules.map((schedule) => (
                                    <ScheduleCard
                                      key={schedule.id}
                                      schedule={schedule}
                                      onEdit={handleEdit}
                                      onDelete={handleDelete}
                                    />
                                  ))}
                                  {cellSchedules.length === 0 && (
                                    <div className="text-sm text-muted-foreground italic py-4 text-center">
                                      Libre
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue liste */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Liste des horaires</CardTitle>
              <CardDescription>
                {filteredSchedules.length} horaire(s) trouvé(s)
                {selectedClassId && ` pour la classe sélectionnée`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredSchedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      variant="list"
                    />
                  ))}
                  {filteredSchedules.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Aucun horaire
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedClassId
                          ? "Aucun horaire pour cette classe. Ajoutez un nouvel horaire."
                          : "Aucun horaire ne correspond aux filtres actuels"}
                      </p>
                      {selectedClassId && (
                        <Button
                          className="mt-4"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un horaire
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue par jour */}
        <TabsContent value="byDay">
          <Card>
            <CardHeader>
              <CardTitle>Horaires par jour</CardTitle>
              {selectedClassId && (
                <CardDescription>
                  Horaires pour la classe:{" "}
                  {classes.find((c) => c.id === selectedClassId)?.name}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => {
                  const daySchedules = schedulesByDay[day.value] || [];
                  return (
                    <Card key={day.value}>
                      <CardHeader>
                        <CardTitle className="text-lg">{day.label}</CardTitle>
                        <CardDescription>
                          {daySchedules.length} cours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {daySchedules
                            .sort((a, b) =>
                              a.startTime.localeCompare(b.startTime)
                            )
                            .map((schedule) => (
                              <ScheduleCard
                                key={schedule.id}
                                schedule={schedule}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                variant="compact"
                              />
                            ))}
                          {daySchedules.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground italic">
                              Aucun cours ce jour
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue de formulaire */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Modifier l'horaire" : "Nouvel horaire"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Assignation */}
            <div className="space-y-2">
              <Label htmlFor="assignmentId">Assignation *</Label>
              <Select
                value={formData.assignmentId}
                onValueChange={(value) =>
                  handleFormChange("assignmentId", value)
                }
                disabled={!!assignmentId || assignmentsLoading}
              >
                <SelectTrigger
                  className={errors.assignmentId ? "border-destructive" : ""}
                >
                  <SelectValue
                    placeholder={
                      assignmentsLoading
                        ? "Chargement des assignations..."
                        : "Sélectionner une assignation"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {assignments.length === 0 && !assignmentsLoading ? (
                    <SelectItem value="none" disabled>
                      Aucune assignation disponible pour cette classe/niveau
                    </SelectItem>
                  ) : (
                    assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.subject?.name || "Matière non spécifiée"} -{" "}
                        {assignment.professeur?.firstName}{" "}
                        {assignment.professeur?.lastName}
                        {assignment.academicYear &&
                          ` (${assignment.academicYear.year})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.assignmentId && (
                <p className="text-sm text-destructive">
                  {errors.assignmentId}
                </p>
              )}
              {selectedClassId && (
                <p className="text-xs text-muted-foreground">
                  Assignations filtrées pour la classe sélectionnée (Niveau:{" "}
                  {selectedClassLevel})
                </p>
              )}
            </div>

            {/* Classe */}
            <div className="space-y-2">
              <Label htmlFor="classId">Classe *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => {
                  handleFormChange("classId", value);
                  handleClassChange(value);
                }}
                disabled={!!propClassId}
              >
                <SelectTrigger
                  className={errors.classId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} (Niveau: {cls.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && (
                <p className="text-sm text-destructive">{errors.classId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Jour */}
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Jour *</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value) =>
                    handleFormChange("dayOfWeek", value)
                  }
                >
                  <SelectTrigger
                    className={errors.dayOfWeek ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dayOfWeek && (
                  <p className="text-sm text-destructive">{errors.dayOfWeek}</p>
                )}
              </div>

              {/* Salle */}
              <div className="space-y-2">
                <Label htmlFor="classroom">Salle</Label>
                <Input
                  id="classroom"
                  value={formData.classroom}
                  onChange={(e) =>
                    handleFormChange("classroom", e.target.value)
                  }
                  placeholder="Ex: Salle 101"
                />
              </div>
            </div>

            {/* Horaires */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début *</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) =>
                    handleFormChange("startTime", value)
                  }
                >
                  <SelectTrigger
                    className={errors.startTime ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="HH:mm" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Heure de fin *</Label>
                <Select
                  value={formData.endTime}
                  onValueChange={(value) => handleFormChange("endTime", value)}
                >
                  <SelectTrigger
                    className={errors.endTime ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="HH:mm" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime}</p>
                )}
              </div>
            </div>

            {/* Récurrence */}
            <div className="space-y-2">
              <Label htmlFor="recurrence">Règle de récurrence</Label>
              <Input
                id="recurrence"
                value={formData.recurrence}
                onChange={(e) => handleFormChange("recurrence", e.target.value)}
                placeholder="Ex: WEEKLY, BIWEEKLY"
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label htmlFor="untilDate">Valable jusqu'au</Label>
              <Input
                id="untilDate"
                type="date"
                value={formData.untilDate}
                onChange={(e) => handleFormChange("untilDate", e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                placeholder="Notes supplémentaires..."
                rows={3}
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingSchedule ? "Modifier" : "Créer"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
