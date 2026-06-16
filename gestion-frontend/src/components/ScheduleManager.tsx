/**
 * @file ScheduleManager.tsx
 * @description Gestionnaire complet d'emploi du temps avec vue semaine améliorée
 * @version 3.0.0
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Users,
  BookOpen,
  Building,
  MoreVertical,
  Eye,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays, addWeeks, startOfWeek, differenceInCalendarWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import useProfesseurStore from "@/store/professorStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { ScheduleForm } from "./timetable/ScheduleForm";
import { DeleteScheduleDialog } from "./timetable/DeleteScheduleDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTimetableStore } from "@/store/scheduleStore";

interface ScheduleManagerProps {
  classId?: string;
  assignmentId?: string;
  academicYearId?: string;
  viewOnly?: boolean;
}

// Configuration des jours
const DAYS = [
  { value: "MONDAY", label: "Lundi", short: "LUN", color: "bg-blue-50" },
  { value: "TUESDAY", label: "Mardi", short: "MAR", color: "bg-green-50" },
  {
    value: "WEDNESDAY",
    label: "Mercredi",
    short: "MER",
    color: "bg-purple-50",
  },
  { value: "THURSDAY", label: "Jeudi", short: "JEU", color: "bg-amber-50" },
  { value: "FRIDAY", label: "Vendredi", short: "VEN", color: "bg-pink-50" },
  { value: "SATURDAY", label: "Samedi", short: "SAM", color: "bg-indigo-50" },
] as const;

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
};

// Créneaux horaires pour la vue semaine
const TIME_SLOTS = [
  { time: "08:00", label: "8h", index: 0 },
  { time: "08:30", label: "8h30", index: 1 },
  { time: "09:00", label: "9h", index: 2 },
  { time: "09:30", label: "9h30", index: 3 },
  { time: "10:00", label: "10h", index: 4 },
  { time: "10:30", label: "10h30", index: 5 },
  { time: "11:00", label: "11h", index: 6 },
  { time: "11:30", label: "11h30", index: 7 },
  { time: "12:00", label: "12h", index: 8 },
  { time: "12:30", label: "12h30", index: 9 },
  { time: "13:00", label: "13h", index: 10 },
  { time: "13:30", label: "13h30", index: 11 },
  { time: "14:00", label: "14h", index: 12 },
  { time: "14:30", label: "14h30", index: 13 },
  { time: "15:00", label: "15h", index: 14 },
  { time: "15:30", label: "15h30", index: 15 },
  { time: "16:00", label: "16h", index: 16 },
  { time: "16:30", label: "16h30", index: 17 },
  { time: "17:00", label: "17h", index: 18 },
  { time: "17:30", label: "17h30", index: 19 },
  { time: "18:00", label: "18h", index: 20 },
  { time: "18:30", label: "18h30", index: 21 },
];

// Composant ScheduleCard optimisé
const ScheduleCard = React.memo(
  ({
    schedule,
    onEdit,
    onDelete,
    getSubjectName,
    getProfesseurName,
    getClassroomColor,
    formatTimeFromISO,
    viewOnly = false,
  }: {
    schedule: any;
    onEdit: (schedule: any) => void;
    onDelete: (schedule: any) => void;
    getSubjectName: (schedule: any) => string;
    getProfesseurName: (schedule: any) => string;
    getClassroomColor: (classroom: string) => string;
    formatTimeFromISO: (time: string) => string;
    viewOnly?: boolean;
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
        className="p-3 rounded-lg border bg-white hover:shadow-md transition-all duration-200 relative group"
        onMouseEnter={() => !viewOnly && setShowActions(true)}
        onMouseLeave={() => !viewOnly && setShowActions(false)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={
                  schedule.status === "ACTIVE"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : schedule.status === "INACTIVE"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
              >
                {schedule.status === "ACTIVE"
                  ? "Actif"
                  : schedule.status === "INACTIVE"
                  ? "Inactif"
                  : "Annulé"}
              </Badge>
              {schedule.classroom && (
                <Badge
                  variant="outline"
                  className={getClassroomColor(schedule.classroom)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {schedule.classroom}
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-sm truncate">
                {getSubjectName(schedule)}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {getProfesseurName(schedule) || "Professeur non assigné"}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">
                  {formatTimeFromISO(schedule.startTime)} -{" "}
                  {formatTimeFromISO(schedule.endTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          {!viewOnly && (
            <div
              className={cn(
                "flex flex-col gap-1 transition-opacity duration-200",
                showActions
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-primary/10"
                      onClick={handleEditClick}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Modifier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Supprimer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ScheduleCard.displayName = "ScheduleCard";

// Composant pour les cellules de la vue semaine
interface WeekViewCellProps {
  day: string;
  timeSlot: string;
  schedules: any[];
  getSubjectName: (schedule: any) => string;
  getProfesseurName: (schedule: any) => string;
  getClassroomColor: (classroom: string) => string;
  formatTimeFromISO: (time: string) => string;
  onEdit?: (schedule: any) => void;
  onDelete?: (schedule: any) => void;
  timeToMinutes: (time: string) => number;
}

const WeekViewCell = React.memo(
  ({
    day,
    timeSlot,
    schedules,
    getSubjectName,
    getProfesseurName,
    getClassroomColor,
    formatTimeFromISO,
    onEdit,
    onDelete,
    timeToMinutes,
  }: WeekViewCellProps) => {
    const timeSlotMinutes = timeToMinutes(timeSlot);

    // Trouver le cours qui commence à ce créneau
    const startingSchedule = schedules.find((schedule) => {
      try {
        const scheduleStart = formatTimeFromISO(schedule.startTime);
        return timeToMinutes(scheduleStart) === timeSlotMinutes;
      } catch {
        return false;
      }
    });

    // Si un cours commence à ce créneau, calculer sa durée
    if (startingSchedule) {
      const scheduleStart = formatTimeFromISO(startingSchedule.startTime);
      const scheduleEnd = formatTimeFromISO(startingSchedule.endTime);
      const startMinutes = timeToMinutes(scheduleStart);
      const endMinutes = timeToMinutes(scheduleEnd);
      const durationMinutes = endMinutes - startMinutes;

      // Nombre de créneaux de 30 minutes à occuper
      const slotsToOccupy = Math.max(1, Math.ceil(durationMinutes / 30));

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "absolute left-1 right-1 rounded border p-2 cursor-pointer hover:shadow-md transition-shadow",
                  startingSchedule.status === "ACTIVE"
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                    : startingSchedule.status === "INACTIVE"
                    ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                    : "bg-red-50 border-red-200 hover:bg-red-100"
                )}
                style={{
                  top: "2px",
                  height: `${slotsToOccupy * 40 - 4}px`, // 40px par créneau
                  zIndex: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(startingSchedule);
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-semibold text-xs truncate">
                      {getSubjectName(startingSchedule)}
                    </h4>
                    {startingSchedule.status !== "ACTIVE" && (
                      <Badge variant="outline" className="h-4 text-[10px] px-1">
                        {startingSchedule.status === "INACTIVE" ? "I" : "A"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {getProfesseurName(startingSchedule)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-medium">
                      {formatTimeFromISO(startingSchedule.startTime)} -{" "}
                      {formatTimeFromISO(startingSchedule.endTime)}
                    </div>
                    {startingSchedule.classroom && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-4 text-[10px] px-1",
                          getClassroomColor(startingSchedule.classroom)
                        )}
                      >
                        {startingSchedule.classroom}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold">
                  {getSubjectName(startingSchedule)}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{getProfesseurName(startingSchedule)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatTimeFromISO(startingSchedule.startTime)} -{" "}
                      {formatTimeFromISO(startingSchedule.endTime)}
                    </span>
                  </div>
                  {startingSchedule.classroom && (
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-3 w-3" />
                      <span>{startingSchedule.classroom}</span>
                    </div>
                  )}
                  {startingSchedule.notes && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {startingSchedule.notes}
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return null;
  }
);

WeekViewCell.displayName = "WeekViewCell";

// Fonction utilitaire pour vérifier le chevauchement
const timeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
};

const timeToMinutes = (time: string) => {
  if (!time) return 0;
  try {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  } catch {
    return 0;
  }
};

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  classId: propClassId,
  assignmentId,
  academicYearId: propAcademicYearId,
  viewOnly = false,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "week">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dayOfWeek: "",
    status: "",
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

  // État pour la vue semaine
  const [weekViewExpanded, setWeekViewExpanded] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Stores
  const {
    schedules,
    error,
    loading,
    fetchClassTimetable,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    checkScheduleConflicts,
  } = useTimetableStore();

  const {
    assignments,
    fetchAssignments,
    fetchAssignmentsByClass,
    fetchAssignmentsByClassAndLevel,
    loading: assignmentsLoading,
  } = useAssignmentStore();

  const { subjects, fetchSubjects } = useSubjectStore();
  const { classes, fetchClasses } = useClassStore();
  const { professeurs, fetchProfesseurs } = useProfesseurStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  // Fonction pour formater le temps avant envoi à l'API
  const formatTimeForAPI = useCallback((time: string): string => {
    if (!time) return "00:00";

    // Si c'est déjà au format HH:MM, l'envoyer tel quel
    if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time;
    }

    // Sinon, essayer de parser
    try {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${(minutes || "00").padStart(2, "0")}`;
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
      let date: Date;

      if (time.includes("T")) {
        // Format ISO
        date = new Date(time);
      } else if (time.includes(":")) {
        // Format HH:MM:SS ou HH:MM
        const [hours, minutes] = time.split(":");
        date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes || "0"), 0, 0);
      } else {
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
          fetchSubjects(),
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
            await fetchClassTimetable(propClassId, currentYear.id);
          }
        }
      } catch (error: any) {
        console.error("Error loading initial data:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    loadInitialData();
  }, [propClassId]);

  // Sélectionner automatiquement l'année académique en cours si aucune n'est choisie
  useEffect(() => {
    if (!propAcademicYearId && !selectedAcademicYearId && academicYears.length > 0) {
      const currentYear = academicYears.find((year) => year.isCurrent);
      if (currentYear) {
        setSelectedAcademicYearId(currentYear.id);
      }
    }
  }, [academicYears, propAcademicYearId, selectedAcademicYearId]);

  // Charger les assignations par niveau
  useEffect(() => {
    if (selectedClassId && selectedClassId !== "all") {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        loadAssignmentsForClassLevel(selectedClass.level);
        fetchClassTimetable(selectedClassId, selectedAcademicYearId);
      }
    } else {
      fetchAssignments();
      fetchSchedules(
        selectedAcademicYearId ? { academicYearId: selectedAcademicYearId } : {}
      );
    }
  }, [selectedClassId, selectedAcademicYearId, classes]);

  // Fonction pour charger les assignations par niveau
  const loadAssignmentsForClassLevel = useCallback(
    async (classLevel: string) => {
      try {
        if (fetchAssignmentsByClassAndLevel) {
          await fetchAssignmentsByClassAndLevel(selectedClassId, classLevel);
        } else {
          await fetchAssignments();
        }
      } catch (error: any) {
        console.error("Error loading assignments for level:", error);
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
      if (!item || !item[key]) return false;
      if (seen.has(item[key])) {
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

  // Fonctions utilitaires
  const getSubjectName = useCallback((schedule: any): string => {
    return (
      schedule.classAssignment?.subject?.name ||
      schedule.subject?.name ||
      schedule.assignment?.subject?.name ||
      schedule.name ||
      "Sans nom"
    );
  }, []);

  const getProfesseurName = useCallback((schedule: any): string => {
    const professeur =
      schedule.classAssignment?.professeur ||
      schedule.professeur ||
      schedule.assignment?.professeur;

    if (!professeur) return "";

    if (typeof professeur === "string") return professeur;

    return `${professeur.firstName || ""} ${professeur.lastName || ""}`.trim();
  }, []);

  const getProfesseurId = useCallback((schedule: any): string => {
    const professeur =
      schedule.classAssignment?.professeur ||
      schedule.professeur ||
      schedule.assignment?.professeur;

    if (!professeur) return "";

    if (typeof professeur === "string") return professeur;

    return professeur.id || "";
  }, []);

  const getClassroomColor = useCallback((classroom: string): string => {
    if (!classroom) return "border-gray-200";

    const colors = [
      "border-blue-200 text-blue-800",
      "border-green-200 text-green-800",
      "border-purple-200 text-purple-800",
      "border-amber-200 text-amber-800",
      "border-pink-200 text-pink-800",
      "border-indigo-200 text-indigo-800",
      "border-teal-200 text-teal-800",
      "border-orange-200 text-orange-800",
    ];
    const index =
      classroom.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index] || "border-gray-200";
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
    const grouped: Record<string, typeof schedules> = {};

    // Initialiser tous les jours
    DAYS.forEach((day) => {
      grouped[day.value] = [];
    });

    // Grouper les schedules
    filteredSchedules.forEach((schedule) => {
      const day = schedule.dayOfWeek;
      if (grouped[day]) {
        grouped[day].push(schedule);
      }
    });

    // Trier chaque jour par heure de début
    Object.values(grouped).forEach((daySchedules) => {
      daySchedules.sort((a, b) => {
        const timeA = formatTimeFromISO(a.startTime);
        const timeB = formatTimeFromISO(b.startTime);
        return timeA.localeCompare(timeB);
      });
    });

    return grouped;
  }, [filteredSchedules, formatTimeFromISO]);

  // Dates de la semaine affichée (lundi -> samedi) selon currentWeekOffset
  const currentWeekStart = useMemo(() => {
    return addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), currentWeekOffset);
  }, [currentWeekOffset]);

  const currentWeekDates = useMemo(() => {
    return DAYS.map((_, index) => addDays(currentWeekStart, index));
  }, [currentWeekStart]);

  // Détermine si un horaire récurrent s'applique à une date donnée
  const isScheduleActiveOnDate = useCallback(
    (schedule: any, date: Date): boolean => {
      if (schedule.untilDate) {
        const until = new Date(schedule.untilDate);
        if (date > until) return false;
      }

      if (schedule.recurrence === "BIWEEKLY" || schedule.recurrence === "MONTHLY") {
        const created = new Date(schedule.createdAt);
        const weeksDiff = Math.abs(
          differenceInCalendarWeeks(date, created, { weekStartsOn: 1 })
        );
        if (schedule.recurrence === "BIWEEKLY" && weeksDiff % 2 !== 0) return false;
        if (schedule.recurrence === "MONTHLY" && weeksDiff % 4 !== 0) return false;
      }

      return true;
    },
    []
  );

  // Horaires de la vue semaine, filtrés selon la récurrence pour la semaine affichée
  const weekSchedulesByDay = useMemo(() => {
    const result: Record<string, typeof schedules> = {};
    DAYS.forEach((day, index) => {
      const daySchedules = schedulesByDay[day.value] || [];
      result[day.value] = daySchedules.filter((schedule) =>
        isScheduleActiveOnDate(schedule, currentWeekDates[index])
      );
    });
    return result;
  }, [schedulesByDay, currentWeekDates, isScheduleActiveOnDate]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: filteredSchedules.length,
      byDay: Object.keys(schedulesByDay).filter(
        (day) => schedulesByDay[day]?.length > 0
      ).length,
      active: filteredSchedules.filter((s) => s.status === "ACTIVE").length,
      inactive: filteredSchedules.filter((s) => s.status === "INACTIVE").length,
      cancelled: filteredSchedules.filter((s) => s.status === "CANCELLED")
        .length,
      totalHours: filteredSchedules.reduce((total, schedule) => {
        const start = timeToMinutes(formatTimeFromISO(schedule.startTime));
        const end = timeToMinutes(formatTimeFromISO(schedule.endTime));
        return total + (end - start) / 60;
      }, 0),
    };
  }, [filteredSchedules, schedulesByDay, formatTimeFromISO]);

  // Gestion des actions
  const handleEdit = useCallback(
    (schedule: any) => {
      if (viewOnly) return;
      setSelectedSchedule(schedule);
      setIsFormOpen(true);
    },
    [viewOnly]
  );

  const handleAddNew = useCallback(() => {
    if (viewOnly) return;
    setSelectedSchedule(null);
    setIsFormOpen(true);
  }, [viewOnly]);

  const handleDeleteClick = useCallback(
    (schedule: any) => {
      if (viewOnly) return;
      setScheduleToDelete(schedule);
      setIsDeleteDialogOpen(true);
    },
    [viewOnly]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!scheduleToDelete || viewOnly) return;

    try {
      await deleteSchedule(scheduleToDelete.id);
      toast.success("L'horaire a été supprimé avec succès", {
        icon: <CheckCircle className="h-4 w-4" />,
      });

      if (selectedClassId && selectedClassId !== "all") {
        fetchClassTimetable(selectedClassId, selectedAcademicYearId);
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
    viewOnly,
  ]);

  // fonction handleFormSubmit
  const handleFormSubmit = useCallback(
    async (formData: any) => {
      try {
        console.log("Form data received:", formData);

        // Validation des données
        if (!formData.assignmentId && !selectedSchedule) {
          toast.error("Une assignation est requise pour créer un horaire");
          return;
        }

        if (!formData.dayOfWeek || !formData.startTime || !formData.endTime) {
          toast.error("Jour, heure de début et heure de fin sont requis");
          return;
        }

        const assignment = filteredAssignments.find(
          (a) => a.id === formData.assignmentId
        );

        if (!assignment && !selectedSchedule) {
          toast.error("Assignation non trouvée");
          return;
        }

        // FORMAT CORRECT POUR L'API
        const formattedData = {
          assignmentId: formData.assignmentId,
          classId: formData.classId || assignment?.classId || selectedClassId,
          dayOfWeek: formData.dayOfWeek.toUpperCase(),
          startTime: formData.startTime, // Format HH:MM
          endTime: formData.endTime, // Format HH:MM
          // Les champs optionnels
          classroom: formData.classroom?.trim() || null,
          recurrence: formData.recurrence?.trim() || "NONE",
          untilDate: formData.untilDate?.trim() || null,
          notes: formData.notes?.trim() || null,
        };

        console.log("📤 Données formatées pour API:", formattedData);

        // Pour une création
        if (!selectedSchedule) {
          console.log("🔄 Création d'un nouvel horaire...");

          // SAUTER TEMPORAIREMENT LA VÉRIFICATION DES CONFLITS
          console.log(" Vérification des conflits désactivée pour le test");

          await createSchedule(formattedData);
        }
        // Pour une édition
        else {
          // Préparer les données pour l'update
          console.log(" Mise à jour de l'horaire existant...");

          // Préparer les données pour l'update
          const updateData: any = {};

          // Seulement inclure les champs qui ont changé
          if (formData.dayOfWeek !== selectedSchedule.dayOfWeek) {
            updateData.dayOfWeek = formattedData.dayOfWeek;
          }

          if (formData.startTime !== selectedSchedule.startTime) {
            updateData.startTime = formattedData.startTime;
          }

          if (formData.endTime !== selectedSchedule.endTime) {
            updateData.endTime = formattedData.endTime;
          }

          if (formData.classroom !== selectedSchedule.classroom) {
            updateData.classroom = formattedData.classroom;
          }

          updateData.recurrence = formattedData.recurrence || "NONE";

          if (formData.notes !== selectedSchedule.notes) {
            updateData.notes = formattedData.notes;
          }

          const changesWithoutRecurrence = { ...updateData };
          delete changesWithoutRecurrence.recurrence;

          if (Object.keys(changesWithoutRecurrence).length === 0) {
            toast.info("Aucun changement détecté");
            setIsFormOpen(false);
            setSelectedSchedule(null);
            return;
          }

          await updateSchedule(selectedSchedule.id, updateData);
        }

        // Rafraîchir les données
        if (selectedClassId && selectedClassId !== "all") {
          await fetchClassTimetable(selectedClassId, selectedAcademicYearId);
        }
      } catch (error: any) {
        console.error(" Erreur dans handleFormSubmit:", error);

        // AFFICHER LES ERREURS DÉTAILLÉES
        let errorMessage = "Erreur lors de l'opération";

        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors
            .map((e: any) => `• ${e.field || e.path}: ${e.message}`)
            .join("\n");
          errorMessage = `Erreurs de validation:\n${validationErrors}`;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage, {
          duration: 8000,
          style: {
            whiteSpace: "pre-line",
            maxWidth: "500px",
          },
        });

        throw error;
      }
    },
    [
      selectedSchedule,
      filteredAssignments,
      selectedClassId,
      selectedAcademicYearId,
      createSchedule,
      updateSchedule,
      fetchClassTimetable,
    ]
  );
  const handleFormSuccess = useCallback(() => {
    setIsFormOpen(false);
    setSelectedSchedule(null);
  }, []);

  const handleGenerateTimetable = useCallback(async () => {
    if (viewOnly) return;

    if (
      !selectedClassId ||
      selectedClassId === "all" ||
      !selectedAcademicYearId
    ) {
      toast.error("Classe et année académique sont requises");
      return;
    }

    try {
      toast.info(
        "Fonctionnalité de génération automatique en cours de développement"
      );
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la génération");
    }
  }, [selectedClassId, selectedAcademicYearId, viewOnly]);

  // Fonctions pour la vue semaine
  const handleWeekViewPrevious = useCallback(() => {
    setCurrentWeekOffset((prev) => prev - 1);
  }, []);

  const handleWeekViewNext = useCallback(() => {
    setCurrentWeekOffset((prev) => prev + 1);
  }, []);

  const handleWeekViewReset = useCallback(() => {
    setCurrentWeekOffset(0);
  }, []);

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
                <CardHeader className={`pb-3 ${day.color}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {day.label}
                    </CardTitle>
                    <Badge variant="secondary">
                      {uniqueDaySchedules.length} cours
                    </Badge>
                  </div>
                  {uniqueDaySchedules.length > 0 && (
                    <CardDescription className="text-xs">
                      {uniqueDaySchedules.length === 1
                        ? "1 cours programmé"
                        : `${uniqueDaySchedules.length} cours programmés`}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {uniqueDaySchedules.length ? (
                      uniqueDaySchedules.map((schedule, index) => (
                        <ScheduleCard
                          key={`schedule-${day.value}-${schedule.id}-${index}`}
                          schedule={schedule}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                          getSubjectName={getSubjectName}
                          getProfesseurName={getProfesseurName}
                          getClassroomColor={getClassroomColor}
                          formatTimeFromISO={formatTimeFromISO}
                          viewOnly={viewOnly}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun cours programmé</p>
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
    viewOnly,
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
                    {!viewOnly && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueFilteredSchedules.map((schedule, index) => (
                    <TableRow key={`list-${schedule.id}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {getSubjectName(schedule)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {getProfesseurName(schedule)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {DAY_LABELS[schedule.dayOfWeek]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeFromISO(schedule.startTime)} -{" "}
                          {formatTimeFromISO(schedule.endTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.classroom ? (
                          <Badge
                            variant="outline"
                            className={getClassroomColor(schedule.classroom)}
                          >
                            <Building className="h-3 w-3 mr-1" />
                            {schedule.classroom}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Non spécifié
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "ACTIVE"
                              ? "default"
                              : schedule.status === "INACTIVE"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {schedule.status === "ACTIVE"
                            ? "Actif"
                            : schedule.status === "INACTIVE"
                            ? "Inactif"
                            : "Annulé"}
                        </Badge>
                      </TableCell>
                      {!viewOnly && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-primary/10"
                                    onClick={() => handleEdit(schedule)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Modifier</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(schedule)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Supprimer</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      )}
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
      viewOnly,
    ]
  );

  // Vue semaine
  const WeekView = useMemo(() => {
    return () => {
      const timeSlotsToShow = weekViewExpanded
        ? TIME_SLOTS
        : TIME_SLOTS.filter((slot, index) => index % 2 === 0);

      return (
        <Card className={weekViewExpanded ? "col-span-full" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vue Hebdomadaire</CardTitle>
                <CardDescription>
                  Semaine du{" "}
                  {format(currentWeekDates[0], "dd MMM", { locale: fr })} au{" "}
                  {format(currentWeekDates[5], "dd MMM yyyy", { locale: fr })}
                  {currentWeekOffset !== 0 && " (différente de la semaine en cours)"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWeekViewPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentWeekOffset === 0 ? "default" : "outline"}
                  size="sm"
                  onClick={handleWeekViewReset}
                >
                  Cette semaine
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWeekViewNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeekViewExpanded(!weekViewExpanded)}
                >
                  {weekViewExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* En-tête des jours */}
                <div className="grid grid-cols-7 border rounded-t-lg bg-muted/30">
                  <div className="p-4 text-center font-semibold border-r bg-background">
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Heures</span>
                    </div>
                  </div>
                  {DAYS.map((day, dayIndex) => {
                    const daySchedules = weekSchedulesByDay[day.value] || [];
                    const dayHours = daySchedules.reduce((total, schedule) => {
                      const start = timeToMinutes(
                        formatTimeFromISO(schedule.startTime)
                      );
                      const end = timeToMinutes(
                        formatTimeFromISO(schedule.endTime)
                      );
                      return total + (end - start) / 60;
                    }, 0);

                    return (
                      <div
                        key={`week-header-${day.value}`}
                        className={`p-4 text-center font-semibold ${day.color} border-r last:border-r-0`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="font-bold">{day.short}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(currentWeekDates[dayIndex], "dd/MM", { locale: fr })}
                          </div>
                          <div className="text-xs font-medium">
                            {daySchedules.length} cours
                          </div>
                          {dayHours > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {dayHours.toFixed(1)}h
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lignes horaires */}
                <div className="border-b">
                  {timeSlotsToShow.map((timeSlot, rowIndex) => (
                    <div
                      key={`time-row-${timeSlot.time}`}
                      className="grid grid-cols-7 border-b last:border-b-0"
                    >
                      {/* Cellule heure */}
                      <div
                        className={cn(
                          "p-3 border-r text-sm font-medium bg-background flex items-center justify-center",
                          rowIndex % 2 === 0 ? "bg-muted/10" : ""
                        )}
                      >
                        {timeSlot.label}
                      </div>

                      {/* Cellules des jours */}
                      {DAYS.map((day) => {
                        const daySchedules = weekSchedulesByDay[day.value] || [];
                        const cellSchedules = daySchedules.filter(
                          (schedule) => {
                            try {
                              const scheduleStart = formatTimeFromISO(
                                schedule.startTime
                              );
                              const scheduleEnd = formatTimeFromISO(
                                schedule.endTime
                              );
                              const slotTime = timeToMinutes(timeSlot.time);
                              const scheduleStartTime =
                                timeToMinutes(scheduleStart);
                              const scheduleEndTime =
                                timeToMinutes(scheduleEnd);

                              // Si le créneau commence à cette heure
                              if (slotTime === scheduleStartTime) {
                                return true;
                              }

                              // Si le créneau est en cours à cette heure (pour les créneaux non affichés)
                              if (!weekViewExpanded && rowIndex % 2 === 0) {
                                // Pour les heures pleines seulement, vérifier si un cours est en cours
                                return (
                                  slotTime > scheduleStartTime &&
                                  slotTime < scheduleEndTime
                                );
                              }

                              return false;
                            } catch {
                              return false;
                            }
                          }
                        );

                        return (
                          <div
                            key={`${day.value}-${timeSlot.time}`}
                            className={cn(
                              "p-2 border-r relative min-h-[60px]",
                              rowIndex % 2 === 0 ? "bg-muted/5" : "",
                              day.color
                            )}
                          >
                            {/* Affichage des cours */}
                            {cellSchedules.map((schedule, scheduleIndex) => {
                              const scheduleStart = formatTimeFromISO(
                                schedule.startTime
                              );
                              const scheduleEnd = formatTimeFromISO(
                                schedule.endTime
                              );
                              const startMinutes = timeToMinutes(scheduleStart);
                              const endMinutes = timeToMinutes(scheduleEnd);
                              const durationMinutes = endMinutes - startMinutes;

                              // Nombre de créneaux à occuper
                              const slotsToOccupy = weekViewExpanded
                                ? Math.ceil(durationMinutes / 30)
                                : Math.ceil(durationMinutes / 60);

                              return (
                                <WeekViewCell
                                  key={`week-cell-${schedule.id}-${scheduleIndex}`}
                                  day={day.value}
                                  timeSlot={timeSlot.time}
                                  schedules={cellSchedules}
                                  getSubjectName={getSubjectName}
                                  getProfesseurName={getProfesseurName}
                                  getClassroomColor={getClassroomColor}
                                  formatTimeFromISO={formatTimeFromISO}
                                  onEdit={!viewOnly ? handleEdit : undefined}
                                  onDelete={
                                    !viewOnly ? handleDeleteClick : undefined
                                  }
                                  timeToMinutes={timeToMinutes}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };
  }, [
    weekSchedulesByDay,
    currentWeekDates,
    currentWeekOffset,
    weekViewExpanded,
    formatTimeFromISO,
    getSubjectName,
    getProfesseurName,
    getClassroomColor,
    handleEdit,
    handleDeleteClick,
    handleWeekViewPrevious,
    handleWeekViewNext,
    handleWeekViewReset,
    viewOnly,
  ]);

  // Rendu des options pour les selects
  const renderClassOptions = useMemo(() => {
    const uniqueClasses = getUniqueData(classes);
    return uniqueClasses.map((cls) => (
      <SelectItem key={`class-select-${cls.id}`} value={cls.id}>
        {cls.name} - {cls.level}
      </SelectItem>
    ));
  }, [classes, getUniqueData]);

  const renderYearOptions = useMemo(() => {
    const uniqueYears = getUniqueData(academicYears);
    return uniqueYears.map((year) => (
      <SelectItem key={`year-select-${year.id}`} value={year.id}>
        {year.year} {year.isCurrent ? "(En cours)" : ""}
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
          {!viewOnly && (
            <>
              <Button onClick={handleAddNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </>
          )}

       
        </div>
      </div>

      {/* Filtres rapides */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-class">Classe</Label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
                disabled={viewOnly}
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
                disabled={viewOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Année académique" />
                </SelectTrigger>
                <SelectContent>{renderYearOptions}</SelectContent>
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
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
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
                  placeholder="Matière, professeur, salle..."
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
                    status: "",
                    classroom: "",
                    subject: "",
                    professor: "",
                  });
                  setSearchTerm("");
                  if (!propClassId) {
                    setSelectedClassId("all");
                  }
                  if (!propAcademicYearId) {
                    setSelectedAcademicYearId("");
                  }
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700">Total cours</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">
                  Cours actifs
                </p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-700">
                  Jours occupés
                </p>
                <p className="text-2xl font-bold text-amber-900 mt-1">
                  {stats.byDay}/6
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-500/10">
                <CalendarDays className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-700">
                  Total heures
                </p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {stats.totalHours.toFixed(1)}h
                </p>
              </div>
              <div className="p-2 rounded-full bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression d'occupation */}
      {selectedClassId && selectedClassId !== "all" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Taux d'occupation</Label>
                <span className="text-sm text-muted-foreground">
                  {((stats.total / (6 * 8)) * 100).toFixed(1)}% (max 8
                  cours/jour)
                </span>
              </div>
              <Progress value={(stats.total / (6 * 8)) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          <WeekView />
        </TabsContent>
      </Tabs>

      {/* Formulaire */}
      {!viewOnly && (
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
      )}

      {/* Dialogue de suppression */}
      {!viewOnly && (
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
      )}
    </div>
  );
};
