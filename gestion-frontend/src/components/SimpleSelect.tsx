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
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>("");

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
  } = useTimetableStore();

  const {
    assignments,
    fetchAssignments,
    fetchAssignmentsByClass,
    loading: assignmentsLoading,
  } = useAssignmentStore();

  const { subjects, fetchSubjects } = useSubjectStore();
  const { classes, fetchClasses } = useClassStore();
  const { professeurs, fetchProfesseurs } = useProfesseurStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  const formatTimeFromISO = (isoString: string): string => {
    if (!isoString) return "";

    // Si c'est déjà au format HH:MM
    if (isoString.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return isoString;
    }

    // Si c'est un timestamp ISO
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";

      // Utiliser UTC pour éviter les décalages horaires
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  // Chargement initial
  useEffect(() => {
    loadInitialData();
  }, [propClassId, propAcademicYearId]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchClasses(),
        fetchSubjects(),
        fetchProfesseurs(),
        fetchAcademicYears(),
      ]);

      if (propClassId) {
        const selectedClass = classes.find((c) => c.id === propClassId);
        if (selectedClass) {
          setSelectedClassId(propClassId);
          setSelectedClassLevel(selectedClass.level);
          await fetchClassTimetable(propClassId, {
            academicYearId: propAcademicYearId,
          });
          await fetchAssignmentsByClass(propClassId);
        }
      } else {
        await fetchAssignments();
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  // Charger les assignations
  useEffect(() => {
    if (selectedClassId && selectedClassId !== "all") {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        setSelectedClassLevel(selectedClass.level);
        loadAssignmentsForClass(selectedClassId);
        fetchClassTimetable(selectedClassId, {
          academicYearId: selectedAcademicYearId,
        });
      }
    } else {
      fetchAssignments();
    }
  }, [selectedClassId, selectedAcademicYearId]);

  const loadAssignmentsForClass = async (classId: string) => {
    try {
      await fetchAssignmentsByClass(classId);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Erreur lors du chargement des assignations");
    }
  };

  // Données filtrées
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
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
        const subjectName = getSubjectName(schedule)?.toLowerCase() || "";
        if (!subjectName.includes(filters.subject.toLowerCase())) return false;
      }

      if (filters.professor) {
        const professorName = getProfesseurName(schedule)?.toLowerCase() || "";
        if (!professorName.includes(filters.professor.toLowerCase()))
          return false;
      }

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
  }, [schedules, selectedClassId, filters, searchTerm]);

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

  // Fonctions utilitaires
  const getSubjectName = useCallback((schedule: any) => {
    return (
      schedule.classAssignment?.subject?.name ||
      schedule.subject?.name ||
      schedule.assignment?.subject?.name ||
      "Sans nom"
    );
  }, []);

  const getProfesseurName = useCallback((schedule: any) => {
    const professeur =
      schedule.classAssignment?.professeur ||
      schedule.professeur ||
      schedule.assignment?.professeur;
    return professeur
      ? `${professeur.firstName || ""} ${professeur.lastName || ""}`.trim()
      : "";
  }, []);

  const getClassroomColor = useCallback((classroom: string) => {
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

  // Gestion des actions - AVEC USECALLBACK
  const handleEdit = useCallback((schedule: any) => {
    console.log("📝 Edit clicked for:", schedule.id);
    console.log("Schedule data:", {
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
    });
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    console.log("➕ Add new clicked");
    setSelectedSchedule(null);
    setIsFormOpen(true);
  }, []);

  // Suppression
  const handleDeleteClick = useCallback((schedule: any) => {
    console.log("🗑️ Delete clicked for:", schedule.id);
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

  const handleFormSubmit = useCallback(
    async (data: any) => {
      try {
        const isEdit = !!selectedSchedule;

        if (isEdit && selectedSchedule) {
          const scheduleData = {
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            classId: data.classId,
            classroom: data.classroom || undefined,
            recurrence: data.recurrence || undefined,
            untilDate: data.untilDate || undefined,
            notes: data.notes || undefined,
            status: data.status || "ACTIVE",
          };

          await updateSchedule(selectedSchedule.id, scheduleData);
          toast.success("L'horaire a été mis à jour avec succès");
        } else {
          if (!data.assignmentId) {
            toast.error("Une assignation est requise pour créer un horaire");
            return;
          }

          const scheduleData = {
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            classId: data.classId,
            classroom: data.classroom || undefined,
            recurrence: data.recurrence || undefined,
            untilDate: data.untilDate || undefined,
            notes: data.notes || undefined,
          };

          await addSchedule(data.assignmentId, scheduleData);
          toast.success("L'horaire a été ajouté avec succès");
        }

        // Rafraîchir les données
        if (data.classId) {
          await fetchClassTimetable(data.classId, {
            academicYearId: selectedAcademicYearId,
          });
        } else if (selectedClassId && selectedClassId !== "all") {
          await fetchClassTimetable(selectedClassId, {
            academicYearId: selectedAcademicYearId,
          });
        }

        setIsFormOpen(false);
        setSelectedSchedule(null);
      } catch (error: any) {
        console.error("Error submitting schedule:", error);
        toast.error(error.message || "Erreur lors de l'opération");
        throw error;
      }
    },
    [
      selectedSchedule,
      selectedAcademicYearId,
      selectedClassId,
      updateSchedule,
      addSchedule,
      fetchClassTimetable,
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

  // Constantes
  const days = [
    { value: "MONDAY", label: "Lundi", short: "LUN" },
    { value: "TUESDAY", label: "Mardi", short: "MAR" },
    { value: "WEDNESDAY", label: "Mercredi", short: "MER" },
    { value: "THURSDAY", label: "Jeudi", short: "JEU" },
    { value: "FRIDAY", label: "Vendredi", short: "VEN" },
    { value: "SATURDAY", label: "Samedi", short: "SAM" },
  ];

  const dayLabels = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
  };

  // Composant ScheduleCard AVEC React.memo
  const ScheduleCard = React.memo(
    ({
      schedule,
      onEdit,
      onDelete,
    }: {
      schedule: any;
      onEdit: (schedule: any) => void;
      onDelete: (schedule: any) => void;
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

  const GridView = useCallback(
    () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => (
            <Card key={day.value} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{day.label}</CardTitle>
                  <Badge variant="secondary">
                    {schedulesByDay[day.value]?.length || 0} cours
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedulesByDay[day.value]?.length ? (
                    schedulesByDay[day.value]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((schedule) => (
                        <ScheduleCard
                          key={schedule.id}
                          schedule={schedule}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
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
          ))}
        </div>
      </div>
    ),
    [schedulesByDay, handleEdit, handleDeleteClick]
  );

  const ListView = useCallback(
    () => (
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
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {getSubjectName(schedule)}
                    </TableCell>
                    <TableCell>{getProfesseurName(schedule)}</TableCell>
                    <TableCell>{dayLabels[schedule.dayOfWeek]}</TableCell>
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
          {filteredSchedules.length === 0 && (
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
    ),
    [
      filteredSchedules,
      getSubjectName,
      getProfesseurName,
      getClassroomColor,
      handleEdit,
      handleDeleteClick,
    ]
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

  console.log("🎯 Main component render");

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
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          {selectedClassId && selectedClassId !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateTimetable}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Générer
            </Button>
          )}
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
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
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
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                    </SelectItem>
                  ))}
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
                  {days.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
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
                    {days.map((day) => (
                      <div
                        key={day.value}
                        className="p-4 text-center font-semibold"
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 14 }).map((_, i) => {
                    const hour = 8 + Math.floor(i / 2);
                    const minute = i % 2 === 0 ? "00" : "30";
                    const time = `${hour
                      .toString()
                      .padStart(2, "0")}:${minute}`;
                    return (
                      <div key={time} className="grid grid-cols-7 border-b">
                        <div className="p-3 border-r text-sm text-muted-foreground bg-muted/30">
                          {time}
                        </div>
                        {days.map((day) => (
                          <div
                            key={`${day.value}-${time}`}
                            className="p-2 border-r min-h-[60px]"
                          >
                            {schedulesByDay[day.value]
                              ?.filter(
                                (s) =>
                                  s.startTime <= time &&
                                  s.endTime >
                                    `${hour}:${
                                      minute === "00"
                                        ? "30"
                                        : (hour + 1).toString().padStart(2, "0")
                                    }:00`
                              )
                              .map((schedule) => (
                                <div
                                  key={schedule.id}
                                  className="text-xs p-1 bg-blue-100 rounded mb-1 truncate"
                                  title={getSubjectName(schedule)}
                                >
                                  {getSubjectName(schedule)}
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Formulaire de création/modification */}
      <ScheduleForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        assignments={assignments}
        classes={classes}
        loading={loading}
        onSubmit={handleFormSubmit}
        onSuccess={handleFormSuccess}
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
est ce correct s'il le faut ajouter les validation . que signifie valable jusqu'au ?
import React from "react";
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
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  schedule?: any;
  onSuccess: () => void;
  assignments: any[];
  classes: any[];
  loading?: boolean;
  onSubmit: (data: any, isEdit: boolean) => Promise<void>;
}

// Définition du schéma de validation avec Zod
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

    recurrence: z.string().optional(),

    untilDate: z.string().optional(),

    notes: z
      .string()
      .max(500, { message: "Les notes ne peuvent pas dépasser 500 caractères" })
      .optional()
      .transform((val) => val?.trim() || ""),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;

      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;

      return endTotal > startTotal;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;

      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      const duration = endTotal - startTotal;

      return duration >= 30; // Minimum 30 minutes
    },
    {
      message: "Durée minimale: 30 minutes",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;

      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      const duration = endTotal - startTotal;

      return duration <= 240; // Maximum 4 heures
    },
    {
      message: "Durée maximale: 4 heures",
      path: ["endTime"],
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
}) => {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const isEdit = !!schedule;

  // Initialiser le formulaire avec react-hook-form et Zod
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      assignmentId: "",
      classId: "",
      dayOfWeek: "",
      startTime: "08:00",
      endTime: "09:30",
      classroom: "",
      recurrence: "",
      untilDate: "",
      notes: "",
    },
    mode: "onChange",
  });
  // Fonction pour extraire HH:MM d'un timestamp ISO (en UTC)
  const extractTimeFromISO = (isoString: string): string => {
    if (!isoString) return "";

    // Si c'est déjà au format HH:MM, retourner tel quel
    if (isoString.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return isoString;
    }

    // Si c'est un timestamp ISO, extraire l'heure UTC
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";

      // Utiliser getUTCHours() et getUTCMinutes() pour éviter les décalages horaires
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error extracting time from ISO:", error);
      return "";
    }
  };
  // Initialiser les données si schedule existant
  React.useEffect(() => {
    if (schedule && open) {
      console.log("Initializing form with schedule:", {
        originalStartTime: schedule.startTime,
        originalEndTime: schedule.endTime,
        extractedStartTime: extractTimeFromISO(schedule.startTime),
        extractedEndTime: extractTimeFromISO(schedule.endTime),
      });
      const defaultValues: ScheduleFormValues = {
        assignmentId:
          schedule.assignmentId || schedule.classAssignment?.id || "",
        classId: schedule.classId || "",
        dayOfWeek: schedule.dayOfWeek || "",
        startTime: extractTimeFromISO(schedule.startTime) || "08:00",
        endTime: extractTimeFromISO(schedule.endTime) || "09:30",
        classroom: schedule.classroom || "",
        recurrence: schedule.recurrence || "",
        untilDate: schedule.untilDate
          ? new Date(schedule.untilDate).toISOString().split("T")[0]
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
        recurrence: "",
        untilDate: "",
        notes: "",
      });
      setServerError(null);
    }
  }, [schedule, open, form]);

  const handleFormSubmit = async (data: ScheduleFormValues) => {
    setServerError(null);
    try {
      await onSubmit(data, isEdit);
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement";
      setServerError(errorMessage);
    }
  };

  const days = [
    { value: "MONDAY", label: "Lundi", short: "LUN" },
    { value: "TUESDAY", label: "Mardi", short: "MAR" },
    { value: "WEDNESDAY", label: "Mercredi", short: "MER" },
    { value: "THURSDAY", label: "Jeudi", short: "JEU" },
    { value: "FRIDAY", label: "Vendredi", short: "VEN" },
    { value: "SATURDAY", label: "Samedi", short: "SAM" },
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
              {/* Assignation */}
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
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.assignmentId &&
                              "border-destructive",
                            !form.formState.errors.assignmentId &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Sélectionner une assignation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignments.length === 0 ? (
                          <SelectItem value="all" disabled>
                            Aucune assignation disponible
                          </SelectItem>
                        ) : (
                          assignments.map((assignment) => (
                            <SelectItem
                              key={assignment.id}
                              value={assignment.id}
                            >
                              {assignment.subject?.name ||
                                "Matière non spécifiée"}{" "}
                              - {assignment.professeur?.firstName || ""}{" "}
                              {assignment.professeur?.lastName || ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.classId &&
                              "border-destructive",
                            !form.formState.errors.classId &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} (Niveau: {cls.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                            form.formState.errors.dayOfWeek &&
                              "border-destructive",
                            !form.formState.errors.dayOfWeek &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="Jour de la semaine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
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
                            form.formState.errors.startTime &&
                              "border-destructive",
                            !form.formState.errors.startTime &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="HH:mm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {timeSlots.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
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
                            form.formState.errors.endTime &&
                              "border-destructive",
                            !form.formState.errors.endTime &&
                              field.value &&
                              "border-green-500"
                          )}
                        >
                          <SelectValue placeholder="HH:mm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {timeSlots.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

              {/* Jusqu'au */}
              <FormField
                control={form.control}
                name="untilDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valable jusqu'au</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
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

            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !form.formState.isValid}
                  className={cn(
                    (loading || !form.formState.isValid) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading ? (
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