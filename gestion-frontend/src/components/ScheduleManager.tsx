import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  Plus,
  Grid,
  List,
  CalendarDays,
  CheckCircle,
  RefreshCw,
  Printer,
  Share2,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import useProfesseurStore from "@/store/professorStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { ScheduleForm } from "./timetable/ScheduleForm";
import { DeleteScheduleDialog } from "./timetable/DeleteScheduleDialog";

interface ScheduleManagerProps {
  classId?: string;
  assignmentId?: string;
  academicYearId?: string;
}

const DAYS = [
  { value: "MONDAY", label: "Lundi", short: "LUN" },
  { value: "TUESDAY", label: "Mardi", short: "MAR" },
  { value: "WEDNESDAY", label: "Mercredi", short: "MER" },
  { value: "THURSDAY", label: "Jeudi", short: "JEU" },
  { value: "FRIDAY", label: "Vendredi", short: "VEN" },
  { value: "SATURDAY", label: "Samedi", short: "SAM" },
] as const;

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
};

// Composant ScheduleCard optimisé avec React.memo
const ScheduleCard = React.memo(
  ({
    schedule,
    onEdit,
    onDelete,
    getSubjectName,
    getProfesseurName,
    getClassroomColor,
    dayLabels,
    formatTimeFromISO,
  }: {
    schedule: any;
    onEdit: (schedule: any) => void;
    onDelete: (schedule: any) => void;
    getSubjectName: (schedule: any) => string;
    getProfesseurName: (schedule: any) => string;
    getClassroomColor: (classroom: string) => string;
    dayLabels: Record<string, string>;
    formatTimeFromISO: (time: string) => string;
  }) => {
    const [showActions, setShowActions] = useState(false);

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(schedule);
      },
      [schedule, onEdit]
    );

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(schedule);
      },
      [schedule, onDelete]
    );

    return (
      <div
        className="p-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200 relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  schedule.status === "ACTIVE"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
              >
                {schedule.status === "ACTIVE" ? "Actif" : "Annulé"}
              </Badge>
              <Badge
                variant="outline"
                className={getClassroomColor(schedule.classroom)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {schedule.classroom || "Salle non définie"}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold text-base">
                {getSubjectName(schedule)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {getProfesseurName(schedule) || "Professeur non assigné"}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatTimeFromISO(schedule.startTime)} -{" "}
                  {formatTimeFromISO(schedule.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{dayLabels[schedule.dayOfWeek]}</span>
              </div>
            </div>
          </div>

          {/* Boutons d'action - VISIBLES AU HOVER */}
          <div
            className={`flex flex-col gap-1 transition-opacity duration-200 ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={handleEditClick}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

ScheduleCard.displayName = "ScheduleCard";

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  classId: propClassId,
  assignmentId,
  academicYearId: propAcademicYearId,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "week">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dayOfWeek: "",
    status: "ACTIVE",
    classroom: "",
    subject: "",
    professor: "",
  });

  // États pour les modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<any>(null);

  // États locaux
  const [selectedClassId, setSelectedClassId] = useState<string>(
    propClassId || ""
  );
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>(
    propAcademicYearId || ""
  );

  // Stores
  const {
    schedules,
    error,
    loading,
    fetchClassTimetable,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    generateClassTimetable,
    checkScheduleConflicts,
  } = useTimetableStore();

  const {
    assignments,
    fetchAssignments,
    fetchAssignmentsByClass,
    fetchAssignmentsByClassAndLevel,
    loading: assignmentsLoading,
  } = useAssignmentStore();

  const { subjects } = useSubjectStore();
  const { classes, fetchClasses } = useClassStore();
  const { professeurs, fetchProfesseurs } = useProfesseurStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  // Fonction pour formater le temps avant envoi à l'API
  const formatTimeForAPI = useCallback((time: string): string => {
    if (!time) return "";

    // Si c'est déjà au format HH:MM, l'envoyer tel quel
    if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time;
    }

    // Sinon, essayer de parser
    try {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    } catch {
      return "00:00";
    }
  }, []);

  // Fonction pour formater le temps depuis ISO ou autres formats
  const formatTimeFromISO = useCallback((time: string): string => {
    if (!time) return "00:00";

    // Si c'est déjà au format HH:MM
    if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time;
    }

    // Si c'est un objet Date ou timestamp
    try {
      // Essayer de parser comme date
      let date: Date;

      if (time.includes("T")) {
        // Format ISO
        date = new Date(time);
      } else if (time.includes(":")) {
        // Format HH:MM:SS ou HH:MM
        const [hours, minutes] = time.split(":");
        date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // Autre format inconnu
        return "00:00";
      }

      if (isNaN(date.getTime())) {
        return "00:00";
      }

      // Formater en HH:MM
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error, time);
      return "00:00";
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Charger les données de base
        await Promise.all([
          fetchClasses(),
          fetchProfesseurs(),
          fetchAcademicYears(),
        ]);

        // Si une classe est spécifiée, charger son horaire
        if (propClassId && propClassId !== "all") {
          setSelectedClassId(propClassId);

          // Trouver l'année académique courante
          const currentYear = academicYears.find((year) => year.isCurrent);
          if (currentYear) {
            setSelectedAcademicYearId(currentYear.id);

            // Charger les assignations pour cette classe
            await loadAssignmentsForClassLevel(propClassId);

            // Charger l'horaire de la classe
            await fetchClassTimetable(propClassId, {
              academicYearId: currentYear.id,
            });
          }
        }
      } catch (error: any) {
        console.error("Error loading initial data:", error);

        // Message d'erreur spécifique
        let errorMessage = "Erreur lors du chargement des données";
        if (error.message?.includes("SCHEDULE_NOT_FOUND")) {
          errorMessage = "Aucun horaire trouvé pour cette classe";
        }

        toast.error(errorMessage);
      }
    };

    loadInitialData();
  }, [propClassId]);

  // Charger les assignations par niveau
  useEffect(() => {
    if (selectedClassId && selectedClassId !== "all") {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        loadAssignmentsForClassLevel(selectedClass.level);
        fetchClassTimetable(selectedClassId, {
          academicYearId: selectedAcademicYearId,
        });
      }
    } else {
      fetchAssignments();
    }
  }, [selectedClassId, selectedAcademicYearId, classes]);

  // Fonction pour charger les assignations par niveau
  const loadAssignmentsForClassLevel = useCallback(
    async (classLevel: string) => {
      try {
        // Vérifiez si la fonction existe dans votre store
        if (fetchAssignmentsByClassAndLevel) {
          console.log("Fetching assignments for class:", {
            classId: selectedClassId,
            level: classLevel,
          });

          // Appelez la fonction du store avec les bons paramètres
          await fetchAssignmentsByClassAndLevel(selectedClassId, classLevel);
        } else {
          console.warn(
            "fetchAssignmentsByClassAndLevel n'est pas disponible, fallback à fetchAssignments"
          );
          await fetchAssignments();
        }
      } catch (error: any) {
        console.error("Error loading assignments for level:", error);

        // Fallback: charger toutes les assignations
        await fetchAssignments();

        toast.error("Erreur lors du chargement des assignations par niveau");
      }
    },
    [selectedClassId, fetchAssignmentsByClassAndLevel, fetchAssignments]
  );

  // Fonction utilitaire pour obtenir des données uniques
  const getUniqueData = useCallback((data: any[], key: string = "id") => {
    const seen = new Set();
    return data.filter((item) => {
      if (seen.has(item[key])) {
        console.warn(`Doublon détecté pour la clé ${key}:`, item[key]);
        return false;
      }
      seen.add(item[key]);
      return true;
    });
  }, []);

  // Assignations filtrées par niveau et sans doublons
  const filteredAssignments = useMemo(() => {
    if (selectedClassId && selectedClassId !== "all") {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (!selectedClass) return getUniqueData(assignments);

      // Filtrer les assignations par niveau
      const filtered = assignments.filter(
        (assignment) => assignment.classLevel === selectedClass.level
      );
      return getUniqueData(filtered);
    }
    return getUniqueData(assignments);
  }, [assignments, selectedClassId, classes, getUniqueData]);

  // Schedules uniques
  const uniqueSchedules = useMemo(
    () => getUniqueData(schedules),
    [schedules, getUniqueData]
  );

  // Fonctions utilitaires avec useMemo pour l'optimisation
  const getSubjectName = useCallback((schedule: any): string => {
    return (
      schedule.classAssignment?.subject?.name ||
      schedule.subject?.name ||
      schedule.assignment?.subject?.name ||
      "Sans nom"
    );
  }, []);

  const getProfesseurName = useCallback((schedule: any): string => {
    const professeur =
      schedule.classAssignment?.professeur ||
      schedule.professeur ||
      schedule.assignment?.professeur;
    return professeur
      ? `${professeur.firstName || ""} ${professeur.lastName || ""}`.trim()
      : "";
  }, []);

  const getClassroomColor = useCallback((classroom: string): string => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-amber-100 text-amber-800 border-amber-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    ];
    const index =
      classroom?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index] || "bg-gray-100 text-gray-800 border-gray-200";
  }, []);

  // Données filtrées sans doublons
  const filteredSchedules = useMemo(() => {
    return uniqueSchedules.filter((schedule) => {
      if (
        selectedClassId &&
        selectedClassId !== "all" &&
        schedule.classId !== selectedClassId
      )
        return false;

      if (filters.dayOfWeek && schedule.dayOfWeek !== filters.dayOfWeek)
        return false;

      if (filters.status && schedule.status !== filters.status) return false;

      if (filters.classroom && !schedule.classroom?.includes(filters.classroom))
        return false;

      if (filters.subject) {
        const subjectName = getSubjectName(schedule).toLowerCase();
        if (!subjectName.includes(filters.subject.toLowerCase())) return false;
      }

      if (filters.professor) {
        const professorName = getProfesseurName(schedule).toLowerCase();
        if (!professorName.includes(filters.professor.toLowerCase()))
          return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const subjectName = getSubjectName(schedule).toLowerCase();
        const professorName = getProfesseurName(schedule).toLowerCase();

        return (
          subjectName.includes(searchLower) ||
          professorName.includes(searchLower) ||
          schedule.classroom?.toLowerCase().includes(searchLower) ||
          schedule.notes?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [
    uniqueSchedules,
    selectedClassId,
    filters,
    searchTerm,
    getSubjectName,
    getProfesseurName,
  ]);

  // Grouper par jour
  const schedulesByDay = useMemo(() => {
    return filteredSchedules.reduce((acc, schedule) => {
      const day = schedule.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(schedule);
      return acc;
    }, {} as Record<string, typeof schedules>);
  }, [filteredSchedules]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: filteredSchedules.length,
      byDay: Object.keys(schedulesByDay).length,
      active: filteredSchedules.filter((s) => s.status === "ACTIVE").length,
      cancelled: filteredSchedules.filter((s) => s.status === "CANCELLED")
        .length,
    };
  }, [filteredSchedules, schedulesByDay]);

  // Gestion des actions
  const handleEdit = useCallback((schedule: any) => {
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedSchedule(null);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((schedule: any) => {
    setScheduleToDelete(schedule);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!scheduleToDelete) return;

    try {
      await deleteSchedule(scheduleToDelete.id);
      toast.success("L'horaire a été supprimé avec succès", {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      if (selectedClassId && selectedClassId !== "all") {
        fetchClassTimetable(selectedClassId, {
          academicYearId: selectedAcademicYearId,
        });
      }

      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression", {
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
  }, [
    scheduleToDelete,
    selectedClassId,
    selectedAcademicYearId,
    deleteSchedule,
    fetchClassTimetable,
  ]);

  // Fonction améliorée avec vérification des conflits
  const handleFormSubmit = useCallback(
    async (formData: any) => {
      try {
        console.log("Form data received:", formData);

        // Validation des données requises
        if (!formData.assignmentId && !selectedSchedule) {
          toast.error("Une assignation est requise pour créer un horaire");
          return;
        }

        if (!formData.dayOfWeek || !formData.startTime || !formData.endTime) {
          toast.error("Jour, heure de début et heure de fin sont requis");
          return;
        }

        // Formater les heures pour l'API
        const formattedData = {
          ...formData,
          startTime: formatTimeForAPI(formData.startTime),
          endTime: formatTimeForAPI(formData.endTime),
        };

        // Pour une création (pas d'édition)
        if (!selectedSchedule) {
          const assignment = filteredAssignments.find(
            (a) => a.id === formattedData.assignmentId
          );

          if (!assignment) {
            toast.error("Assignation non trouvée");
            return;
          }

          // Vérifier les conflits AVANT d'ajouter
          try {
            const professeurId =
              assignment.professeur?.id || assignment.professeur?.id;

            if (!professeurId) {
              toast.error("Professeur non assigné à cette matière");
              return;
            }

            const conflictCheck = await checkScheduleConflicts({
              professeurId: professeurId,
              classId: formattedData.classId || assignment.schoolClass?.id,
              dayOfWeek: formattedData.dayOfWeek,
              startTime: formattedData.startTime,
              endTime: formattedData.endTime,
              classroom: formattedData.classroom,
            });

            if (conflictCheck.hasConflict) {
              const conflictMessages = conflictCheck.conflicts
                .map((conflict: any) => {
                  if (conflict.type === "PROFESSEUR_CONFLICT") {
                    return `• Le professeur ${assignment.professeur?.firstName} ${assignment.professeur?.lastName} a déjà un cours à ce créneau`;
                  } else if (conflict.type === "CLASS_CONFLICT") {
                    return `• La classe a déjà un cours à ce créneau`;
                  }
                  return `• ${conflict.message}`;
                })
                .join("\n");

              toast.error(`Conflits détectés:\n${conflictMessages}`, {
                duration: 8000,
              });
              return;
            }
          } catch (conflictError: any) {
            console.warn("Could not check conflicts:", conflictError);
            // Continuer même si la vérification échoue
          }

          // Ajouter l'horaire
          await addSchedule(formattedData.assignmentId, formattedData);
          toast.success("L'horaire a été ajouté avec succès");
        } else {
          // Pour une édition
          const conflictCheck = await checkScheduleConflicts({
            professeurId: selectedSchedule.professeurId,
            classId: formattedData.classId || selectedSchedule.classId,
            dayOfWeek: formattedData.dayOfWeek,
            startTime: formattedData.startTime,
            endTime: formattedData.endTime,
            classroom: formattedData.classroom,
            excludeScheduleId: selectedSchedule.id,
          });

          if (conflictCheck.hasConflict) {
            const conflictMessages = conflictCheck.conflicts
              .map((conflict: any) => `• ${conflict.message}`)
              .join("\n");

            toast.error(`Conflits détectés:\n${conflictMessages}`, {
              duration: 8000,
            });
            return;
          }

          // Mettre à jour l'horaire
          await updateSchedule(selectedSchedule.id, formattedData);
          toast.success("L'horaire a été mis à jour avec succès");
        }

        // Rafraîchir les données
        if (selectedClassId && selectedClassId !== "all") {
          await fetchClassTimetable(selectedClassId, {
            academicYearId: selectedAcademicYearId,
          });
        }

        setIsFormOpen(false);
        setSelectedSchedule(null);
      } catch (error: any) {
        console.error("Error in handleFormSubmit:", error);

        // Messages d'erreur spécifiques
        let errorMessage = "Erreur lors de l'opération";

        if (error.response?.data?.code === "PROFESSEUR_CONFLICT") {
          errorMessage = "Le professeur a déjà un cours à ce créneau horaire";
        } else if (error.response?.data?.code === "CLASS_CONFLICT") {
          errorMessage = "La classe a déjà un cours à ce créneau horaire";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        toast.error(errorMessage);
      }
    },
    [
      selectedSchedule,
      selectedAcademicYearId,
      selectedClassId,
      updateSchedule,
      addSchedule,
      checkScheduleConflicts,
      filteredAssignments,
      fetchClassTimetable,
      formatTimeForAPI,
    ]
  );

  const handleFormSuccess = useCallback(() => {
    setIsFormOpen(false);
    setSelectedSchedule(null);
  }, []);

  const handleGenerateTimetable = useCallback(async () => {
    if (
      !selectedClassId ||
      selectedClassId === "all" ||
      !selectedAcademicYearId
    ) {
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
  }, [selectedClassId, selectedAcademicYearId, generateClassTimetable]);

  // Composants de vue
  const GridView = useMemo(() => {
    return () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => {
            const daySchedules = schedulesByDay[day.value] || [];
            const uniqueDaySchedules = getUniqueData(daySchedules);

            return (
              <Card key={`day-card-${day.value}`} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{day.label}</CardTitle>
                    <Badge variant="secondary">
                      {uniqueDaySchedules.length} cours
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uniqueDaySchedules.length ? (
                      uniqueDaySchedules
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((schedule, index) => (
                          <ScheduleCard
                            key={`schedule-${day.value}-${schedule.id}-${index}`}
                            schedule={schedule}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            getSubjectName={getSubjectName}
                            getProfesseurName={getProfesseurName}
                            getClassroomColor={getClassroomColor}
                            dayLabels={DAY_LABELS}
                            formatTimeFromISO={formatTimeFromISO}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucun cours programmé</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }, [
    schedulesByDay,
    handleEdit,
    handleDeleteClick,
    getSubjectName,
    getProfesseurName,
    getClassroomColor,
    formatTimeFromISO,
    getUniqueData,
  ]);

  const ListView = useMemo(
    () => () => {
      const uniqueFilteredSchedules = getUniqueData(filteredSchedules);

      return (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Professeur</TableHead>
                    <TableHead>Jour</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueFilteredSchedules.map((schedule, index) => (
                    <TableRow key={`list-${schedule.id}-${index}`}>
                      <TableCell className="font-medium">
                        {getSubjectName(schedule)}
                      </TableCell>
                      <TableCell>{getProfesseurName(schedule)}</TableCell>
                      <TableCell>{DAY_LABELS[schedule.dayOfWeek]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeFromISO(schedule.startTime)} -{" "}
                          {formatTimeFromISO(schedule.endTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getClassroomColor(schedule.classroom)}
                        >
                          {schedule.classroom}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "ACTIVE"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {schedule.status === "ACTIVE" ? "Actif" : "Annulé"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(schedule)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {uniqueFilteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun horaire trouvé
                </h3>
                <p className="text-muted-foreground">
                  Aucun horaire ne correspond à vos critères de recherche
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    },
    [
      filteredSchedules,
      getSubjectName,
      getProfesseurName,
      getClassroomColor,
      formatTimeFromISO,
      handleEdit,
      handleDeleteClick,
      getUniqueData,
    ]
  );

  // Rendu des options pour les selects
  const renderClassOptions = useMemo(() => {
    const uniqueClasses = getUniqueData(classes);
    return uniqueClasses.map((cls) => (
      <SelectItem key={`class-select-${cls.id}`} value={cls.id}>
        {cls.name}
      </SelectItem>
    ));
  }, [classes, getUniqueData]);

  const renderYearOptions = useMemo(() => {
    const uniqueYears = getUniqueData(academicYears);
    return uniqueYears.map((year) => (
      <SelectItem key={`year-select-${year.id}`} value={year.id}>
        {year.year}
      </SelectItem>
    ));
  }, [academicYears, getUniqueData]);

  const renderDayOptions = useMemo(
    () =>
      DAYS.map((day) => (
        <SelectItem key={`day-select-${day.value}`} value={day.value}>
          {day.label}
        </SelectItem>
      )),
    []
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Chargement des horaires</h3>
          <p className="text-muted-foreground">Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emploi du Temps</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et visualisez les horaires de cours
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleAddNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Filtres rapides */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-class">Classe</Label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {renderClassOptions}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-year">Année</Label>
              <Select
                value={selectedAcademicYearId}
                onValueChange={setSelectedAcademicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Année académique" />
                </SelectTrigger>
                <SelectContent>
                  {renderYearOptions}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-day">Jour</Label>
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
                  {renderDayOptions}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-status">Statut</Label>
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
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Matière, professeur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilters({
                    dayOfWeek: "",
                    status: "ACTIVE",
                    classroom: "",
                    subject: "",
                    professor: "",
                  });
                  setSearchTerm("");
                  setSelectedClassId("all");
                  setSelectedAcademicYearId("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total cours</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Cours actifs
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Jours occupés
                </p>
                <p className="text-3xl font-bold text-amber-900 mt-2">
                  {stats.byDay}
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <CalendarDays className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">
                  Cours annulés
                </p>
                <p className="text-3xl font-bold text-red-900 mt-2">
                  {stats.cancelled}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de vue */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="grid">
              <Grid className="h-4 w-4 mr-2" />
              Grille
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="week">
              <Calendar className="h-4 w-4 mr-2" />
              Semaine
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarCheck className="h-4 w-4" />
            <span>
              Dernière mise à jour: {format(new Date(), "dd/MM/yyyy HH:mm")}
            </span>
          </div>
        </div>
        <TabsContent value="grid" className="mt-0">
          <GridView />
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <ListView />
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Vue hebdomadaire</CardTitle>
              <CardDescription>
                Vue d'ensemble des cours de la semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-7 border rounded-t-lg bg-muted/50">
                    <div className="p-4 text-center font-semibold border-r">
                      Heures
                    </div>
                    {DAYS.map((day) => (
                      <div
                        key={`week-header-${day.value}`}
                        className="p-4 text-center font-semibold"
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>

                  {/* Créneaux horaires fixes */}
                  {[
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
                  ].map((time) => (
                    <div key={`time-row-${time}`} className="grid grid-cols-7 border-b">
                      <div className="p-3 border-r text-sm text-muted-foreground bg-muted/30">
                        {time}
                      </div>

                      {DAYS.map((day) => {
                        // Convertir l'heure en minutes pour la comparaison
                        const [hour, minute] = time.split(":").map(Number);
                        const timeInMinutes = hour * 60 + minute;

                        // Trouver les cours qui débutent à cette heure exacte
                        const schedulesStartingNow =
                          schedulesByDay[day.value]?.filter((schedule) => {
                            try {
                              const scheduleStart = formatTimeFromISO(
                                schedule.startTime
                              );
                              const [scheduleHour, scheduleMinute] =
                                scheduleStart.split(":").map(Number);
                              const scheduleStartMinutes =
                                scheduleHour * 60 + scheduleMinute;

                              return scheduleStartMinutes === timeInMinutes;
                            } catch (error) {
                              return false;
                            }
                          }) || [];

                        return (
                          <div
                            key={`${day.value}-${time}`}
                            className="p-2 border-r min-h-[60px]"
                          >
                            {schedulesStartingNow.map((schedule, index) => {
                              const duration = (() => {
                                const start = formatTimeFromISO(
                                  schedule.startTime
                                );
                                const end = formatTimeFromISO(schedule.endTime);

                                const [startHour, startMinute] = start
                                  .split(":")
                                  .map(Number);
                                const [endHour, endMinute] = end
                                  .split(":")
                                  .map(Number);

                                return (
                                  endHour * 60 +
                                  endMinute -
                                  (startHour * 60 + startMinute)
                                );
                              })();

                              // Nombre de créneaux à occuper (chaque créneau = 30min)
                              const slotsToOccupy = Math.ceil(duration / 30);

                              return (
                                <div
                                  key={`week-schedule-${schedule.id}-${index}`}
                                  className="text-xs p-1 mb-1 rounded bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300"
                                  style={{
                                    height: `${slotsToOccupy * 30}px`,
                                    minHeight: "30px",
                                  }}
                                  title={`${getSubjectName(
                                    schedule
                                  )} (${formatTimeFromISO(
                                    schedule.startTime
                                  )} - ${formatTimeFromISO(schedule.endTime)})`}
                                >
                                  <div className="font-medium truncate">
                                    {getSubjectName(schedule)}
                                  </div>
                                  <div className="truncate text-[10px] opacity-75">
                                    {getProfesseurName(schedule)}
                                  </div>
                                  {schedule.classroom && (
                                    <div className="text-[10px] opacity-60">
                                      {schedule.classroom}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Formulaire avec assignations filtrées */}
      <ScheduleForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        assignments={filteredAssignments}
        classes={classes}
        loading={loading}
        onSubmit={handleFormSubmit}
        onSuccess={handleFormSuccess}
        checkScheduleConflicts={checkScheduleConflicts}
      />

      {/* Dialogue de suppression */}
      <DeleteScheduleDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setScheduleToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        scheduleName={
          scheduleToDelete ? getSubjectName(scheduleToDelete) : undefined
        }
      />
    </div>
  );
};