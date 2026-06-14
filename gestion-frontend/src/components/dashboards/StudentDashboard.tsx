// components/dashboard/StudentDashboard.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  TrendingUp,
  Clock,
  Clock4,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  GraduationCap,
  Megaphone,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  XCircle,
  CheckCircle,
  CheckCheck,
  Award,
  Sparkles,
  MapPin,
  HelpCircle,
  ArrowRight,
  School,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useStudentStore } from "@/store/studentStore";
import { useGradeStore } from "@/store/gradeStore";
import { useAnnouncementStore } from "@/store/announcementStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useEventStore, { Event } from "@/store/eventStore";

// Composants modaux
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/services/api";
import { GradeStatus } from "@/types/bulletin";

// Types pour le dashboard
interface Course {
  id: string;
  subject?: {
    id: string;
    name: string;
    code: string;
    coefficient: number;
    maxGrade?: number;
  };
  professeur?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  classLevel: string;
  academicYear?: {
    id: string;
    year: string;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  priority: string;
  publishDate: string;
  isActive: boolean;
  category?: string;
}

interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
  classId?: string;
  classAssignment?: {
    subject: {
      name: string;
      code: string;
    };
    professeur: {
      firstName: string;
      lastName: string;
    };
  };
  schoolClass?: {
    id?: string;
    name: string;
    level: string;
  };
}

interface GradeWithDetails {
  id: string;
  studentId: string;
  subjectId: string;
  grade?: number; // Note obtenue
  maxGrade?: number; // Note maximale possible (ex: 20, 100, 40)
  passingGrade?: number; // Note de passage (50% de maxGrade)
  status?: GradeStatus | null;
  session?: string | null;
  controlType?: string | null;
  subject?: {
    id: string;
    name: string;
    code: string;
    coefficient?: number;
    maxGrade?: number;
    passingGrade?: number;
  } | null;
  academicYearId?: string;
  classLevel?: string;
  createdAt?: Date;
  publishedAt?: Date;
  ApproveAt?: Date;
  [key: string]: any;
}

// Composants modaux
const AnnouncementModal = ({
  announcement,
  isOpen,
  onClose,
}: {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {announcement.title}
          </DialogTitle>
          <DialogDescription>
            Publié le{" "}
            {new Date(announcement.publishDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge
                variant={
                  announcement.priority === "High"
                    ? "destructive"
                    : announcement.priority === "Medium"
                      ? "secondary"
                      : "outline"
                }
              >
                {announcement.priority === "High"
                  ? "Important"
                  : announcement.priority === "Medium"
                    ? "Moyenne"
                    : "Normale"}
              </Badge>
              <Badge variant="outline">
                {announcement.category || "Général"}
              </Badge>
              <Badge variant="outline">
                {announcement.targetAudience || "Tous"}
              </Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {announcement.content}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const EventModal = ({
  event,
  isOpen,
  onClose,
}: {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!event) return null;

  const evtStatus = String(event?.status || "").toLowerCase();
  const statusVariant =
    evtStatus.includes("scheduled") || evtStatus.includes("program")
      ? "default"
      : evtStatus.includes("cancel") || evtStatus.includes("annul")
        ? "destructive"
        : evtStatus.includes("complete") ||
            evtStatus.includes("term") ||
            evtStatus.includes("en cours")
          ? "secondary"
          : "outline";

  const statusLabel =
    evtStatus.includes("scheduled") || evtStatus.includes("program")
      ? "Programmé"
      : evtStatus.includes("cancel") || evtStatus.includes("annul")
        ? "Annulé"
        : evtStatus.includes("complete") ||
            evtStatus.includes("term") ||
            evtStatus.includes("en cours")
          ? "Terminé"
          : event?.status;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            {`${new Date(event.startDate).toLocaleDateString("fr-FR")} - 
             ${new Date(event.endDate).toLocaleDateString("fr-FR")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Date de début
              </p>
              <p className="text-sm">
                {new Date(event.startDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Date de fin
              </p>
              <p className="text-sm">
                {new Date(event.endDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Lieu</p>
              <p className="text-sm">{event.location}</p>
            </div>
          )}

          {event.organizer && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Organisateur
              </p>
              <p className="text-sm">{event.organizer}</p>
            </div>
          )}

          {event.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {event.description}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Badge variant="outline">{event.category}</Badge>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Jauge circulaire pour afficher la moyenne générale sur 20
const CircularGauge = ({
  value,
  max = 20,
  size = 96,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  label?: string;
}) => {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - ratio);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-xl font-bold leading-none">
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] text-white/70">/{max}</span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs text-white/80">{label}</span>}
    </div>
  );
};

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    currentStudent,
    fetchStudentById,
    loading: studentLoading,
  } = useStudentStore();

  const { fetchStudentDashboardGrades } = useGradeStore();
  const { announcements, fetchAnnouncements } = useAnnouncementStore();
  const { fetchAssignmentsByClass } = useAssignmentStore();
  const { upcomingEvents, fetchUpcomingEvents } = useEventStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [gradeStatusFilter, setGradeStatusFilter] = useState<string>("all");

  // États pour les données
  const [studentGrades, setStudentGrades] = useState<GradeWithDetails[]>([]);
  const [publishedGrades, setPublishedGrades] = useState<GradeWithDetails[]>(
    [],
  );
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);
  const [studentSchedule, setStudentSchedule] = useState<Schedule[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<
    Announcement[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);

  // États pour les modaux
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Références pour éviter les rechargements multiples
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  // Mapper les jours de la semaine
  const dayMap: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };

  const reverseDayMap: Record<number, string> = {
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
    0: "SUNDAY",
  };

  // ==================== FONCTIONS UTILITAIRES POUR LES NOTES ====================

  // Fonction pour obtenir la note maximale
  const getMaxGrade = useCallback((grade: GradeWithDetails): number => {
    return grade.subject?.maxGrade || 20; // Par défaut 20
  }, []);

  // Fonction pour obtenir la note de passage
  const getPassingGrade = useCallback(
    (grade: GradeWithDetails): number => {
      if (grade.subject?.passingGrade !== undefined)
        return grade.subject.passingGrade / 100;
      return getMaxGrade(grade) * 0.5; // 50% par défaut
    },
    [getMaxGrade],
  );

  // Fonction pour calculer le pourcentage
  const getGradePercentage = useCallback(
    (grade: GradeWithDetails): number => {
      const gradeValue = grade.grade || 0;
      const maxGrade = getMaxGrade(grade);
      return maxGrade > 0 ? (gradeValue / maxGrade) * 100 : 0;
    },
    [getMaxGrade],
  );

  // Fonction pour convertir la note en note sur 20 (pour la moyenne)
  const getGradeOn20 = useCallback(
    (grade: GradeWithDetails): number => {
      const gradeValue = grade.grade || 0;
      const maxGrade = getMaxGrade(grade);
      return maxGrade > 0 ? (gradeValue / maxGrade) * 20 : 0;
    },
    [getMaxGrade],
  );

  // Fonction pour vérifier si la note est validée
  const isGradeValidated = useCallback(
    (grade: GradeWithDetails): boolean => {
      const gradeValue = grade.grade || 0;
      const passingGrade = getPassingGrade(grade);
      return gradeValue >= passingGrade;
    },
    [getPassingGrade],
  );

  // Fonction pour filtrer les notes selon le statut
  const filterGradesByStatus = useCallback(
    (grades: GradeWithDetails[], statusFilter: string) => {
      const visibleGrades = grades.filter((grade) => {
        const status = grade.status?.toLowerCase();
        return status === "approved" || status === "published";
      });

      if (statusFilter === "all") {
        return visibleGrades;
      }

      return visibleGrades.filter((grade) => {
        const status = grade.status?.toLowerCase();

        if (statusFilter === "approved") {
          return status === "approved";
        }
        if (statusFilter === "published") {
          // Notes publiées ET validées (note >= passingGrade)
          return status === "published" && isGradeValidated(grade);
        }
        if (statusFilter === "validated") {
          // Notes (approved ou published) ET validées
          return (
            (status === "approved" || status === "published") &&
            isGradeValidated(grade)
          );
        }
        if (statusFilter === "failed") {
          // Notes (approved ou published) mais non validées
          return (
            (status === "approved" || status === "published") &&
            !isGradeValidated(grade)
          );
        }
        return false;
      });
    },
    [isGradeValidated],
  );

  // Fonction pour obtenir le nom de la matière
  const getSubjectName = (grade: GradeWithDetails): string => {
    if (grade.subject?.name) return grade.subject.name;
    if (grade.subject?.code) return grade.subject.code;
    return "Matière inconnue";
  };

  // Fonction pour obtenir le coefficient
  const getSubjectCoefficient = (grade: GradeWithDetails): number => {
    return grade.subject?.coefficient || 1;
  };

  // Fonction pour la couleur de la note (basée sur le pourcentage)
  const getGradeColor = useCallback(
    (grade: GradeWithDetails) => {
      const percentage = getGradePercentage(grade);
      if (percentage >= 80) return "text-emerald-600 font-bold";
      if (percentage >= 70) return "text-blue-600 font-semibold";
      if (percentage >= 60) return "text-indigo-600";
      if (percentage >= 50) return "text-amber-600";
      return "text-red-600 font-semibold";
    },
    [getGradePercentage],
  );

  // Fonction pour le badge de statut
  const getGradeStatusBadge = (grade: GradeWithDetails) => {
    const isValid = isGradeValidated(grade);
    const status = grade.status?.toLowerCase();

    // Badge de statut de publication
    if (status === "published") {
      if (isValid) {
        return (
          <Badge
            variant="default"
            className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs"
          >
            <CheckCheck className="h-3 w-3" />
            Publié & Validé
          </Badge>
        );
      } else {
        return (
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
            Publié (Échec)
          </Badge>
        );
      }
    } else if (status === "approved") {
      if (isValid) {
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs"
          >
            <CheckCircle className="h-3 w-3" />
            Approuvé & Validé
          </Badge>
        );
      } else {
        return (
          <Badge
            variant="outline"
            className="gap-1 text-xs border-amber-300 text-amber-700"
          >
            <AlertTriangle className="h-3 w-3" />
            Approuvé (Échec)
          </Badge>
        );
      }
    } else if (status === "submitted") {
      return (
        <Badge variant="outline" className="gap-1 text-xs">
          <FileText className="h-3 w-3" />
          En validation
        </Badge>
      );
    } else if (status === "draft") {
      return (
        <Badge variant="outline" className="gap-1 text-xs">
          <EyeOff className="h-3 w-3" />
          Brouillon
        </Badge>
      );
    } else if (status === "rejected") {
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          Rejeté
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <EyeOff className="h-3 w-3" />
        Non publié
      </Badge>
    );
  };
  // Fonction pour obtenir la date de publication
  const getPublicationDate = (grade: GradeWithDetails): string => {
    if (grade.publishedAt) {
      return new Date(grade.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });
    }
    return "Non publié";
  };

  // Fonction pour charger toutes les données
  const loadAllData = useCallback(async () => {
    if (!user?.id || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);

    try {
      let studentId: string | null = null;
      let classId: string | null = null;

      // Identifier l'étudiant
      if (user?.studentRecord?.id) {
        studentId = user.studentRecord.id;
        classId = user.studentRecord.classId || null;
      } else {
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      if (!studentId) {
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      // Charger les notes (approuvées/publiées) de l'étudiant
      try {
        const gradesData = await fetchStudentDashboardGrades(studentId);

        if (gradesData && Array.isArray(gradesData) && gradesData.length > 0) {
          // Formater les notes
          const formattedGrades = gradesData.map((g: any) => ({
            id: g.id,
            studentId: g.studentId,
            subjectId: g.subjectId,
            grade: g.grade || 0,
            maxGrade: g.subject?.maxGrade || g.maxGrade || 20,
            passingGrade: g.subject?.passingGrade || g.passingGrade || 50,
            status: g.status || GradeStatus.APPROVED,
            session: g.session || null,
            controlType: g.controlType || null,
            subject: g.subject || {
              id: g.subjectId,
              name: "Matière",
              code: "N/A",
              coefficient: g.subject?.coefficient || 1,
              maxGrade: g.subject?.maxGrade || 50,
              passingGrade: g.subject?.passingGrade || 25,
            },
            academicYearId: g.academicYearId,
            classLevel: g.classLevel,
            publishedAt: g.publishedAt ? new Date(g.publishedAt) : null,
            createdAt: new Date(g.createdAt || new Date()),
          })) as GradeWithDetails[];

          setStudentGrades(formattedGrades);
          setPublishedGrades(formattedGrades);
        } else {
          setStudentGrades([]);
          setPublishedGrades([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des notes:", error);
        setStudentGrades([]);
        setPublishedGrades([]);
      }

      // Étape 4: Charger les annonces
      try {
        await fetchAnnouncements();
      } catch (error) {
        console.error("Erreur lors du chargement des annonces:", error);
      }

      // Étape 5: Charger les événements
      try {
        await fetchUpcomingEvents();
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      }

      // Étape 6: Charger les cours si classId existe
      if (classId) {
        try {
          const assignmentsData = await fetchAssignmentsByClass(classId);

          if (
            assignmentsData &&
            Array.isArray(assignmentsData) &&
            assignmentsData.length > 0
          ) {
            const coursesList = assignmentsData.map((assignment: any) => ({
              id: assignment.id,
              subject: assignment.subject || {
                name: assignment.subject?.name || "Matière",
                coefficient: assignment.subject?.coefficient || 1,
                maxGrade: assignment.subject?.maxGrade || 20,
              },
              professeur: assignment.professeur || {
                firstName: "Professeur",
                lastName: "",
              },
              classLevel: assignment.classLevel || "N/A",
              academicYear: assignment.academicYear,
            }));
            setStudentCourses(coursesList);
          } else {
            setStudentCourses([]);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des cours:", error);
          setStudentCourses([]);
        }
      } else {
        setStudentCourses([]);
      }

      // Étape 7: Charger l'emploi du temps
      if (classId) {
        try {
          const response = await api.get(`/schedules/class/${classId}`);

          if (response.data?.success && response.data.data?.timetable) {
            const timetable = response.data.data.timetable;
            const schedules: Schedule[] = [];

            Object.entries(timetable).forEach(
              ([dayOfWeek, daySchedules]: [string, any]) => {
                if (Array.isArray(daySchedules)) {
                  daySchedules.forEach((scheduleData: any) => {
                    if (scheduleData && scheduleData.startTime) {
                      schedules.push({
                        id:
                          scheduleData.id ||
                          `schedule-${dayOfWeek}-${schedules.length}`,
                        dayOfWeek: dayOfWeek.toUpperCase(),
                        startTime: scheduleData.startTime,
                        endTime: scheduleData.endTime || "12:00",
                        classroom:
                          scheduleData.classroom || "Salle non définie",
                        classAssignment: {
                          subject: scheduleData.classAssignment?.subject || {
                            name: "Matière",
                            code: "MAT",
                          },
                          professeur: scheduleData.classAssignment
                            ?.professeur || {
                            firstName: "Professeur",
                            lastName: "",
                          },
                        },
                        schoolClass: scheduleData.schoolClass ||
                          currentStudent?.schoolClass || {
                            name: currentStudent?.schoolClass?.name || "",
                            level: currentStudent?.schoolClass?.level || "N/A",
                          },
                      });
                    }
                  });
                }
              },
            );

            setStudentSchedule(schedules);
          } else {
            setStudentSchedule([]);
          }
        } catch (error) {
          console.error(
            "Erreur lors du chargement de l'emploi du temps:",
            error,
          );
          setStudentSchedule([]);
        }
      }

      hasLoadedRef.current = true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        isLoadingRef.current = false;
        setLoading(false);
      }, 500);
    }
  }, [
    user,
    fetchStudentById,
    fetchAnnouncements,
    fetchUpcomingEvents,
    fetchAssignmentsByClass,
    currentStudent,
    toast,
  ]);

  // Effet principal de chargement
  useEffect(() => {
    const init = async () => {
      if (!user?.id || hasLoadedRef.current || isLoadingRef.current) {
        return;
      }

      await loadAllData();
    };

    init();
  }, [user?.id, loadAllData]);

  // Effet pour filtrer les annonces
  useEffect(() => {
    if (!announcements || announcements.length === 0) {
      setFilteredAnnouncements([]);
      return;
    }

    const studentAnnouncements = announcements.filter((ann: any) => {
      if (ann.isActive === false) return false;
      const target = (ann.targetAudience || "").toLowerCase();
      return (
        target.includes("students") ||
        target.includes("étudiants") ||
        target.includes("all") ||
        target.includes("tous") ||
        target === ""
      );
    });

    let filtered = studentAnnouncements;
    if (filterType !== "all") {
      filtered = studentAnnouncements.filter((ann: any) => {
        switch (filterType) {
          case "academic":
            return ann.category === "academic" || !ann.category;
          case "event":
            return ann.category === "event";
          case "important":
            return ann.priority === "High";
          default:
            return true;
        }
      });
    }

    filtered.sort(
      (a: any, b: any) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );

    setFilteredAnnouncements(filtered);
  }, [announcements, filterType]);

  // Effet pour mettre à jour les événements
  useEffect(() => {
    if (upcomingEvents && upcomingEvents.length > 0) {
      setEvents(upcomingEvents);
    } else {
      setEvents([]);
    }
  }, [upcomingEvents]);

  // Filtrer les notes selon le statut sélectionné
  const displayedGrades = useMemo(() => {
    return filterGradesByStatus(studentGrades, gradeStatusFilter);
  }, [studentGrades, gradeStatusFilter, filterGradesByStatus]);

  // ==================== CALCULS DES STATISTIQUES ====================

  // Calculer la moyenne générale (sur 20) basée sur les notes PUBLIÉES
  const calculateAverage = useMemo(() => {
    const publishedGrades = studentGrades.filter(
      (grade) => grade.status === GradeStatus.PUBLISHED,
    );

    if (!publishedGrades || publishedGrades.length === 0) {
      return {
        average: "0.00",
        averageOn20: "0.00",
        hasData: false,
        message: "Aucune note publiée disponible",
      };
    }

    let totalWeighted = 0;
    let totalCoefficient = 0;

    publishedGrades.forEach((grade: GradeWithDetails) => {
      const coefficient = grade.subject?.coefficient || 1;
      const gradeOn20 = getGradeOn20(grade); // Convertir en note sur 20

      totalWeighted += gradeOn20 * coefficient;
      totalCoefficient += coefficient;
    });

    const averageOn20 =
      totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;

    return {
      average: averageOn20.toFixed(2),
      averageOn20: averageOn20.toFixed(2),
      hasData: true,
      totalCoefficient,
      totalGrades: publishedGrades.length,
    };
  }, [studentGrades, getGradeOn20]);

  // Calculer les statistiques des notes PUBLIÉES
  const calculateGradeStats = useMemo(() => {
    return (grades: GradeWithDetails[]) => {
      // Inclure APPROVED et PUBLISHED
      const visibleGrades = grades.filter((grade) => {
        const status = grade.status?.toLowerCase();
        return status === "approved" || status === "published";
      });

      if (!visibleGrades || visibleGrades.length === 0) {
        return {
          total: 0,
          average: 0,
          averageOn20: 0,
          validatedCount: 0,
          failedCount: 0,
          successRate: 0,
          publishedCount: 0,
          credits: {
            total: 0,
            obtained: 0,
            progress: 0,
          },
        };
      }

      const validatedGrades = visibleGrades.filter(isGradeValidated);
      const failedGrades = visibleGrades.filter((g) => !isGradeValidated(g));

      // Calcul de la moyenne sur 20
      let totalWeighted = 0;
      let totalCoefficient = 0;

      visibleGrades.forEach((grade) => {
        const coefficient = grade.subject?.coefficient || 1;
        const gradeOn20 = getGradeOn20(grade);
        totalWeighted += gradeOn20 * coefficient;
        totalCoefficient += coefficient;
      });

      const averageOn20 =
        totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;
      const successRate =
        visibleGrades.length > 0
          ? (validatedGrades.length / visibleGrades.length) * 100
          : 0;

      const totalCredits = visibleGrades.reduce(
        (sum, grade) => sum + (grade.subject?.coefficient || 0),
        0,
      );
      const obtainedCredits = validatedGrades.reduce(
        (sum, grade) => sum + (grade.subject?.coefficient || 0),
        0,
      );

      return {
        total: visibleGrades.length,
        average: Math.round(averageOn20 * 100) / 100,
        averageOn20: Math.round(averageOn20 * 100) / 100,
        validatedCount: validatedGrades.length,
        failedCount: failedGrades.length,
        successRate: Math.round(successRate * 100) / 100,
        publishedCount: visibleGrades.length,
        credits: {
          total: totalCredits,
          obtained: obtainedCredits,
          progress:
            totalCredits > 0 ? (obtainedCredits / totalCredits) * 100 : 0,
        },
      };
    };
  }, [isGradeValidated, getGradeOn20]);
  // Obtenir le prochain cours
  const getNextClass = useMemo(() => {
    if (!studentSchedule || studentSchedule.length === 0) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDayApi = reverseDayMap[currentDay];

    if (!currentDayApi) return null;

    const todaySchedule = studentSchedule.filter((schedule: Schedule) => {
      return schedule.dayOfWeek === currentDayApi;
    });

    if (todaySchedule.length === 0) return null;

    for (const schedule of todaySchedule) {
      const [hours, minutes] = schedule.startTime.split(":").map(Number);
      const scheduleTime = hours * 60 + minutes;

      if (scheduleTime > currentTime) {
        return schedule;
      }
    }

    return null;
  }, [studentSchedule]);

  // Données pour le graphique de progression (basé sur les notes publiées)
  const getProgressData = useMemo(() => {
    const publishedGrades = studentGrades.filter(
      (grade) => grade.status === GradeStatus.PUBLISHED,
    );

    if (publishedGrades.length > 0) {
      const monthlyGrades: Record<string, { total: number; count: number }> =
        {};

      publishedGrades.forEach((grade) => {
        const date = new Date(
          grade.publishedAt || grade.createdAt || new Date(),
        );
        const month = date.toLocaleString("fr-FR", { month: "short" });

        if (!monthlyGrades[month]) {
          monthlyGrades[month] = { total: 0, count: 0 };
        }

        monthlyGrades[month].total += getGradeOn20(grade); // Utiliser la note sur 20
        monthlyGrades[month].count += 1;
      });

      return Object.entries(monthlyGrades).map(([month, data]) => ({
        month,
        average: data.count > 0 ? data.total / data.count : 0,
      }));
    }

    return [];
  }, [studentGrades, getGradeOn20]);

  // Fonction pour grouper les notes PUBLIÉES par type de contrôle
  const groupGradesByControlType = useMemo(() => {
    const visibleGrades = studentGrades.filter((grade) => {
      const status = grade.status?.toLowerCase();
      return status === "approved" || status === "published";
    });

    if (!visibleGrades.length) return {};

    const grouped: Record<string, GradeWithDetails[]> = {};

    visibleGrades.forEach((grade) => {
      const controlType = grade.controlType || "Autre";

      if (!grouped[controlType]) {
        grouped[controlType] = [];
      }

      grouped[controlType].push(grade);
    });

    return grouped;
  }, [studentGrades]);

  // Fonction pour obtenir les statistiques par contrôle (notes publiées seulement)
  const getControlTypeStats = useMemo(() => {
    const grouped = groupGradesByControlType;
    const stats: Record<string, any> = {};

    Object.entries(grouped).forEach(([controlType, grades]) => {
      const total = grades.length;

      // Calcul de la moyenne sur 20
      let totalWeighted = 0;
      grades.forEach((grade) => {
        totalWeighted += getGradeOn20(grade);
      });
      const averageOn20 = total > 0 ? totalWeighted / total : 0;

      const validated = grades.filter(isGradeValidated).length;

      stats[controlType] = {
        total,
        average: Math.round(averageOn20 * 100) / 100,
        validated,
        successRate: Math.round((validated / total) * 100),
        grades,
      };
    });

    return stats;
  }, [groupGradesByControlType, getGradeOn20, isGradeValidated]);

  // Fonction pour formater le nom du contrôle
  const formatControlType = (controlType: string) => {
    const map: Record<string, string> = {
      CONTROLE_1: "Contrôle 1",
      CONTROLE_2: "Contrôle 2",
      CONTROLE_3: "Contrôle 3",
      CONTROLE_4: "Contrôle 4",
    };

    return map[controlType] || controlType.replace("CONTROLE_", "Contrôle ");
  };

  // Données pour le radar des compétences (basé sur le pourcentage des notes publiées)
  const getSkillData = useMemo(() => {
    const publishedGrades = studentGrades.filter(
      (grade) => grade.status === GradeStatus.PUBLISHED,
    );

    if (publishedGrades.length > 0) {
      const subjectMap = new Map<
        string,
        { totalPercentage: number; count: number; coefficient: number }
      >();

      publishedGrades.forEach((grade: GradeWithDetails) => {
        const subjectName = getSubjectName(grade);
        const coefficient = getSubjectCoefficient(grade);
        const percentage = getGradePercentage(grade);

        if (!subjectMap.has(subjectName)) {
          subjectMap.set(subjectName, {
            totalPercentage: 0,
            count: 0,
            coefficient,
          });
        }

        const data = subjectMap.get(subjectName)!;
        data.totalPercentage += percentage;
        data.count += 1;
        data.coefficient = Math.max(data.coefficient, coefficient);
      });

      return Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject: subject.length > 8 ? subject.substring(0, 8) + "..." : subject,
        score: data.count > 0 ? data.totalPercentage / data.count : 0,
        fullMark: 100,
        coefficient: data.coefficient,
        average:
          data.count > 0
            ? (data.totalPercentage / data.count).toFixed(1)
            : "0.0",
      }));
    }

    // Données par défaut
    return [];
  }, [studentGrades, getGradePercentage]);

  // Obtenir l'emploi du temps d'aujourd'hui
  const getTodaySchedule = useMemo(() => {
    if (studentSchedule.length > 0) {
      const now = new Date();
      const currentDay = now.getDay();

      const jsToApiDayMap = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
      };

      const currentDayApi =
        jsToApiDayMap[currentDay as keyof typeof jsToApiDayMap];

      if (!currentDayApi) {
        return [];
      }

      const todaySchedules = studentSchedule
        .filter((schedule) => schedule.dayOfWeek === currentDayApi)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      return todaySchedules;
    }

    return [];
  }, [studentSchedule, studentCourses]);

  // Créneaux horaires distincts de l'emploi du temps (pour la grille hebdomadaire)
  const scheduleTimeSlots = useMemo(() => {
    const slots = new Set(studentSchedule.map((s) => s.startTime));
    return Array.from(slots).sort();
  }, [studentSchedule]);

  // Fonction pour forcer le rechargement
  const handleRefresh = useCallback(() => {
    hasLoadedRef.current = false;
    isLoadingRef.current = false;
    setLoading(true);

    setStudentGrades([]);
    setPublishedGrades([]);
    setStudentCourses([]);
    setStudentSchedule([]);
    setFilteredAnnouncements([]);

    setTimeout(() => {
      loadAllData();
    }, 300);
  }, [loadAllData]);

  // Composant de carte de matière avec affichage correct
  const SubjectCard = ({ grade }: { grade: GradeWithDetails }) => {
    const gradeValue = grade.grade || 0;
    const maxGrade = getMaxGrade(grade);
    const percentage = getGradePercentage(grade);
    const coefficient = getSubjectCoefficient(grade);
    const isValidated = isGradeValidated(grade);
    const isApprove = grade.status === GradeStatus.APPROVED;

    return (
      <Card
        className={`hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 ${
          isApprove
            ? isValidated
              ? "border-l-green-500"
              : "border-l-red-500"
            : "border-l-gray-300 opacity-75"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isApprove
                    ? isValidated
                      ? "bg-green-100"
                      : "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                <BookOpen
                  className={`h-5 w-5 ${
                    isApprove
                      ? isValidated
                        ? "text-green-600"
                        : "text-red-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base">
                  {getSubjectName(grade)}
                </h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    Coeff {coefficient}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Max: {maxGrade}
                  </Badge>
                  {getGradeStatusBadge(grade)}
                  {grade.controlType && (
                    <Badge variant="secondary" className="text-xs">
                      {grade.controlType.replace("CONTROLE_", "C")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              {isApprove ? (
                <>
                  <div
                    className={`text-xl sm:text-2xl font-bold ${getGradeColor(
                      grade,
                    )}`}
                  >
                    {gradeValue.toFixed(0)}/{maxGrade}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(0)}% • {coefficient} crédits
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-gray-400">
                    Non Approuve
                  </div>
                </>
              )}
            </div>
          </div>
          {isApprove && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progression</span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              <Progress
                value={percentage}
                className={`h-2 ${
                  isApprove
                    ? isValidated
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Composant de carte d'annonce
  const AnnouncementCard = ({
    announcement,
  }: {
    announcement: Announcement;
  }) => {
    const handleCardClick = useCallback(() => {
      setSelectedAnnouncement(announcement);
      setIsAnnouncementModalOpen(true);
    }, [announcement]);

    return (
      <Card
        className="hover:shadow-sm transition-all cursor-pointer hover:border-primary/50 active:scale-[0.98]"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                announcement.priority === "High"
                  ? "bg-red-100"
                  : announcement.priority === "Medium"
                    ? "bg-yellow-100"
                    : "bg-blue-100"
              }`}
            >
              <Megaphone
                className={`h-4 w-4 ${
                  announcement.priority === "High"
                    ? "text-red-600"
                    : announcement.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={
                    announcement.priority === "High"
                      ? "destructive"
                      : announcement.priority === "Medium"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {announcement.category === "event" ? "Événement" : "Annonce"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(announcement.publishDate).toLocaleDateString(
                    "fr-FR",
                  )}
                </span>
              </div>
              <h4 className="font-medium mb-2">{announcement.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {announcement.content}
              </p>
              <div className="mt-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Lire
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Composant de carte de cours
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
              <School className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">
                {course.subject?.name || "Matière"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {course.professeur?.firstName}{" "}
                {course.professeur?.lastName || "Professeur"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline">{course.classLevel}</Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Coeff {course.subject?.coefficient || 1}
              {course.subject?.maxGrade && (
                <span className="ml-2">Max: {course.subject.maxGrade}</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Composant de statistiques de notes
  const GradeStatsSummary = () => {
    const stats = calculateGradeStats(studentGrades);
    const visibleGrades = studentGrades.filter((grade) => {
      const status = grade.status?.toLowerCase();
      return status === "approved" || status === "published";
    });
    const visibleCount = visibleGrades.length;

    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">
                {stats.averageOn20}/20
              </div>
              <div className="text-sm text-muted-foreground">
                Moyenne générale
              </div>
              <div className="text-xs text-primary mt-1">
                {visibleCount} note{visibleCount > 1 ? "s" : ""} visible
                {visibleCount > 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {stats.validatedCount}
              </div>
              <div className="text-sm text-muted-foreground">Validés</div>
              <div className="text-xs text-green-600 mt-1">
                {visibleCount > 0
                  ? Math.round((stats.validatedCount / visibleCount) * 100)
                  : 0}
                % de réussite
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {visibleCount}
              </div>
              <div className="text-sm text-muted-foreground">Visibles</div>
              <div className="text-xs text-blue-600 mt-1">
                {studentGrades.length - visibleCount} en attente
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <div className="text-2xl font-bold text-amber-600">
                {studentGrades.length}
              </div>
              <div className="text-sm text-muted-foreground">Total notes</div>
              <div className="text-xs text-amber-600 mt-1">
                {stats.credits.obtained}/{stats.credits.total} crédits
              </div>
            </div>
          </div>

          {visibleCount === 0 && studentGrades.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">
                  Vous avez {studentGrades.length} note
                  {studentGrades.length > 1 ? "s" : ""} en attente de
                  publication par l'administration.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Composant de filtre de statut pour les notes
  const GradeStatusFilter = () => {
    const visibleGrades = studentGrades.filter((grade) => {
      const status = grade.status?.toLowerCase();
      return status === "approved" || status === "published";
    });

    const publishedCount = visibleGrades.length;
    const validatedCount = visibleGrades.filter(isGradeValidated).length;
    const failedCount = visibleGrades.filter(
      (g) => !isGradeValidated(g),
    ).length;

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={gradeStatusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setGradeStatusFilter("all")}
        >
          Toutes ({publishedCount})
        </Button>
        <Button
          variant={gradeStatusFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setGradeStatusFilter("approved")}
        >
          Approuvées ({publishedCount})
        </Button>
        <Button
          variant={gradeStatusFilter === "validated" ? "default" : "outline"}
          size="sm"
          onClick={() => setGradeStatusFilter("validated")}
        >
          Validées ({validatedCount})
        </Button>
        <Button
          variant={gradeStatusFilter === "failed" ? "default" : "outline"}
          size="sm"
          onClick={() => setGradeStatusFilter("failed")}
        >
          Échecs ({failedCount})
        </Button>
      </div>
    );
  };

  // Composant d'état de chargement
  const LoadingSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Composant pour données étudiantes manquantes
  const NoStudentData = () => {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">
            Bonjour, {user?.firstName} {user?.lastName} !
          </h2>
          <p className="text-muted-foreground mb-4">
            Votre profil étudiant n'est pas encore complètement configuré
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <Card>
              <CardContent className="p-4">
                <p className="font-medium">Informations disponibles :</p>
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                  <p>Email : {user?.email}</p>
                  <p>Rôle : {user?.role}</p>
                  {user?.studentRecord?.id && (
                    <p>
                      ID étudiant : {user.studentRecord.id.substring(0, 8)}...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <Button variant="outline" className="flex-1">
                <HelpCircle className="h-4 w-4 mr-2" />
                Contacter le support
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Message quand aucune note n'est disponible
  const NoGradesMessage = () => {
    const totalGrades = studentGrades.length;
    const publishedCount = publishedGrades.length;

    if (totalGrades === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Aucune note disponible</h3>
          <p className="text-muted-foreground mb-4">
            Aucune note n'a été saisie pour le moment.
          </p>
          <div className="mt-4 space-y-2 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              Les notes apparaîtront ici une fois que vos professeurs les auront
              saisies et que l'administration les aura publiées.
            </p>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Vérifier les nouvelles notes
            </Button>
          </div>
        </div>
      );
    }

    if (publishedCount === 0 && totalGrades > 0) {
      return (
        <div className="text-center py-12">
          <EyeOff className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h3 className="text-lg font-medium">
            Notes en attente de publication
          </h3>
          <p className="text-muted-foreground mb-4">
            Vous avez {totalGrades} note{totalGrades > 1 ? "s" : ""} qui doivent
            être publiées par l'administration.
          </p>
          <div className="mt-4 space-y-2 max-w-md mx-auto">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  <strong>Processus de publication :</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>1. Le professeur saisit les notes</li>
                  <li>2. L'administration vérifie et approuve</li>
                  <li>3. Les notes sont publiées aux étudiants</li>
                </ul>
              </CardContent>
            </Card>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Vérifier la publication
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  // Gestion des états de chargement
  if (loading || studentLoading) {
    return <LoadingSkeleton />;
  }

  // Vérifier si l'utilisateur a un studentRecord
  if (!user?.studentRecord?.id) {
    return <NoStudentData />;
  }

  const displayStudent = currentStudent || user.studentRecord;
  const average = calculateAverage.average;
  const hasData = calculateAverage.hasData;
  const nextClass = getNextClass;
  const progressData = getProgressData;
  const skillData = getSkillData;
  const todaySchedule = getTodaySchedule;
  const gradeStats = calculateGradeStats(studentGrades);
  const publishedCount = publishedGrades.length;

  return (
    <div className="space-y-6 p-6">
      {/* Modals */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

      {/* Header */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/30 bg-white/10">
                <AvatarFallback className="bg-transparent text-xl font-bold text-white">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Sparkles className="h-4 w-4" />
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mt-1">
                  Bonjour, {user?.firstName} {user?.lastName} !
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {displayStudent?.schoolClass?.name || "Étudiant"}
                  </Badge>
                  {hasData ? (
                    <span className="text-xs text-white/80">
                      {publishedCount} note{publishedCount > 1 ? "s" : ""}{" "}
                      publiée{publishedCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-white/60">
                      Aucune note publiée pour le moment
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col gap-1.5 text-sm text-white/85">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {gradeStats.validatedCount}/{publishedCount} matières validées
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {studentCourses.length} matière
                  {studentCourses.length > 1 ? "s" : ""} suivie
                  {studentCourses.length > 1 ? "s" : ""}
                </div>
                {nextClass ? (
                  <div className="flex items-center gap-2">
                    <Clock4 className="h-4 w-4" />
                    Prochain cours : {nextClass.startTime?.slice(0, 5)} -{" "}
                    {nextClass.classAssignment?.subject?.name || "Cours"}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock4 className="h-4 w-4" />
                    Aucun cours à venir
                  </div>
                )}
              </div>
              <CircularGauge value={Number(average) || 0} label="Moyenne /20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="courses">Mes Cours</TabsTrigger>
          <TabsTrigger value="grades">Mes Notes</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
        </TabsList>

        {/* Tab: Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Moyenne générale
                    </p>
                    <p className="text-2xl font-bold">{average}/20</p>
                    <div className="flex items-center text-sm mt-1 text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {gradeStats.validatedCount}/{publishedCount} validés
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Matières suivies
                    </p>
                    <p className="text-2xl font-bold">
                      {studentCourses.length}
                    </p>
                    <div className="text-sm text-muted-foreground mt-1">
                      {publishedCount} notes publiées
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prochain cours
                    </p>
                    <p className="text-2xl font-bold">
                      {nextClass?.startTime?.split(":")[0] || "--"}h
                    </p>
                    <div className="text-sm text-muted-foreground mt-1">
                      {nextClass?.classAssignment?.subject?.name ||
                        "Aucun cours"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-50">
                    <Clock4 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Notes publiées
                    </p>
                    <p className="text-2xl font-bold">
                      {publishedCount}/{studentGrades.length}
                    </p>
                    <div className="text-sm text-muted-foreground mt-1">
                      {studentGrades.length - publishedCount} en attente
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50">
                    <CheckCheck className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progression des notes + Prochain cours */}
          <div className="grid gap-6 lg:grid-cols-3">
            {publishedCount > 0 ? (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Progression des notes</CardTitle>
                  <CardDescription>
                    Évolution sur l'année (sur 20)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 20]} />
                        <Tooltip
                          formatter={(value) => [`${value}/20`, "Moyenne"]}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="average"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Moyenne générale"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="lg:col-span-2 flex flex-col">
                <CardContent className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">
                      Aucune note publiée
                    </h3>
                    <p className="text-muted-foreground">
                      Les graphiques s'afficheront ici une fois que des notes
                      auront été publiées.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prochain cours */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock4 className="h-5 w-5 text-green-600" />
                  Prochain cours
                </CardTitle>
                <CardDescription>Aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                {nextClass ? (
                  <div className="space-y-3 w-full">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {nextClass.classAssignment?.subject?.name || "Cours"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {nextClass.startTime?.slice(0, 5)} -{" "}
                        {nextClass.endTime?.slice(0, 5)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {nextClass.classroom || "Salle non définie"}
                    </div>
                    <Badge variant="outline">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {nextClass.classAssignment?.professeur?.firstName?.charAt(
                        0,
                      )}
                      .{" "}
                      {nextClass.classAssignment?.professeur?.lastName ||
                        "Prof"}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center w-full text-muted-foreground">
                    <Clock4 className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Aucun cours à venir aujourd'hui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Compétences par matière */}
          {skillData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compétences par matière</CardTitle>
                <CardDescription>Profil académique (en %)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={skillData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score (%)"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cours d'aujourd'hui */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>Cours d'aujourd'hui</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("schedule")}
                >
                  Emploi du temps
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {schedule.classAssignment?.subject?.name ||
                              "Cours"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {schedule.startTime} - {schedule.endTime} •{" "}
                            {schedule.classroom || "Salle non définie"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {schedule.classAssignment?.professeur?.firstName?.charAt(
                          0,
                        )}
                        .{" "}
                        {schedule.classAssignment?.professeur?.lastName ||
                          "Prof"}
                      </Badge>
                    </div>
                  ))
                ) : studentCourses.length > 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                    <h3 className="text-lg font-medium mb-2">
                      Pas de cours programmé aujourd'hui
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Mais vous avez {studentCourses.length} matière
                      {studentCourses.length > 1 ? "s" : ""} cette année
                    </p>
                    <div className="space-y-2 max-w-md mx-auto">
                      {studentCourses.slice(0, 3).map((course, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">
                              {course.subject?.name}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {course.professeur?.firstName?.charAt(0)}.{" "}
                            {course.professeur?.lastName}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun cours aujourd'hui</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dernières annonces + Événements à venir */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      Dernières annonces
                    </CardTitle>
                    <CardDescription>
                      Informations importantes
                    </CardDescription>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="academic">Académique</SelectItem>
                      <SelectItem value="event">Événements</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements
                    .slice(0, 3)
                    .map((announcement, index) => (
                      <AnnouncementCard
                        key={index}
                        announcement={announcement}
                      />
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Aucune annonce pour ce filtre</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Événements à venir
                </CardTitle>
                <CardDescription>
                  Prochains événements scolaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 3).map((event, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEventModalOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.startDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  ))}

                  {events.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Aucun événement à venir</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Mes Cours */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Cours</CardTitle>
              <CardDescription>Toutes vos matières cette année</CardDescription>
            </CardHeader>
            <CardContent>
              {studentCourses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {studentCourses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Aucun cours assigné</h3>
                  <p className="text-muted-foreground">
                    Vous n'êtes pas encore inscrit à des cours pour cette année.
                  </p>
                  <Button className="mt-4" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recharger les cours
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Mes Notes */}
        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes Notes</CardTitle>
                  <CardDescription>
                    Notes publiées et approuvées
                    {publishedCount > 0 && (
                      <span className="ml-2 text-green-600">
                        ({publishedCount} publiée{publishedCount > 1 ? "s" : ""}
                        )
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {publishedCount > 0 ? (
                <>
                  {/* Résumé statistique */}
                  <GradeStatsSummary />

                  {/* Filtres de statut */}
                  <GradeStatusFilter />

                  {/* Tabs pour les types de contrôle */}
                  <Tabs defaultValue="tous" className="mb-6">
                    <TabsList className="flex-wrap h-auto">
                      <TabsTrigger value="tous" className="text-xs">
                        Toutes les notes ({publishedCount})
                      </TabsTrigger>

                      {Object.keys(groupGradesByControlType).map(
                        (controlType) => (
                          <TabsTrigger
                            key={controlType}
                            value={controlType}
                            className="text-xs"
                          >
                            {formatControlType(controlType)} (
                            {groupGradesByControlType[controlType].length})
                          </TabsTrigger>
                        ),
                      )}
                    </TabsList>

                    {/* Onglet "Toutes les notes" */}
                    <TabsContent value="tous" className="mt-4">
                      {/* Statistiques par contrôle */}
                      {Object.keys(getControlTypeStats).length > 0 && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle>Résumé par contrôle</CardTitle>
                            <CardDescription>
                              Performance par type d'évaluation (sur 20)
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(getControlTypeStats).map(
                                ([controlType, stats]) => (
                                  <Card
                                    key={controlType}
                                    className="hover:shadow-md transition-shadow"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">
                                          {formatControlType(controlType)}
                                        </h4>
                                        <Badge variant="outline">
                                          {stats.total} notes
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm text-muted-foreground">
                                            Moyenne
                                          </span>
                                          <span className="font-semibold">
                                            {stats.average}/20
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-muted-foreground">
                                            Taux réussite
                                          </span>
                                          <span className="font-semibold">
                                            {stats.successRate}%
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-muted-foreground">
                                            Validés
                                          </span>
                                          <span className="font-semibold text-green-600">
                                            {stats.validated}/{stats.total}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Liste de toutes les notes PUBLIÉES (filtrées) */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {displayedGrades.length > 0 ? (
                          displayedGrades.map((grade, index) => (
                            <SubjectCard key={index} grade={grade} />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium">
                              Aucune note à afficher
                            </h3>
                            <p className="text-muted-foreground">
                              Ajustez les filtres ou attendez que des notes
                              soient publiées.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Onglets pour chaque type de contrôle */}
                    {Object.entries(groupGradesByControlType).map(
                      ([controlType, grades]) => (
                        <TabsContent
                          key={controlType}
                          value={controlType}
                          className="mt-4"
                        >
                          <Card className="mb-6">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-bold">
                                    {formatControlType(controlType)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {grades.length} note
                                    {grades.length > 1 ? "s" : ""} • Moyenne:{" "}
                                    {getControlTypeStats[controlType]
                                      ?.average || 0}
                                    /20
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    (getControlTypeStats[controlType]
                                      ?.successRate || 0) >= 70
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {getControlTypeStats[controlType]
                                    ?.successRate || 0}
                                  % réussite
                                </Badge>
                              </div>

                              {/* Statistiques pour ce contrôle */}
                              <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-3 rounded-lg bg-blue-50">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {grades.length}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Notes
                                  </div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-green-50">
                                  <div className="text-2xl font-bold text-green-600">
                                    {getControlTypeStats[controlType]
                                      ?.average || 0}
                                    /20
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Moyenne
                                  </div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-amber-50">
                                  <div className="text-2xl font-bold text-amber-600">
                                    {getControlTypeStats[controlType]
                                      ?.validated || 0}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Validés
                                  </div>
                                </div>
                              </div>

                              {/* Notes de ce contrôle */}
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {grades.map((grade, index) => (
                                  <SubjectCard key={index} grade={grade} />
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ),
                    )}
                  </Tabs>
                </>
              ) : (
                <NoGradesMessage />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Emploi du temps */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mon emploi du temps</CardTitle>
              <CardDescription>
                Semaine du {new Date().toLocaleDateString("fr-FR")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentSchedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Heure</th>
                        {[
                          "Lundi",
                          "Mardi",
                          "Mercredi",
                          "Jeudi",
                          "Vendredi",
                          "Samedi",
                        ].map((day) => (
                          <th key={day} className="text-center p-3 font-medium">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleTimeSlots.map((timeSlot) => (
                        <tr key={timeSlot} className="border-b last:border-b-0">
                          <td className="p-3 text-sm text-muted-foreground text-center border-r whitespace-nowrap">
                            {timeSlot.slice(0, 5)}
                          </td>
                          {[1, 2, 3, 4, 5, 6].map((dayIndex) => {
                            const dayKey = Object.keys(dayMap).find(
                              (key) => dayMap[key] === dayIndex,
                            );

                            if (!dayKey)
                              return (
                                <td
                                  key={dayIndex}
                                  className="p-2 min-h-[80px] border-r last:border-r-0"
                                />
                              );

                            const schedule = studentSchedule.find(
                              (s) =>
                                s.dayOfWeek === dayKey &&
                                s.startTime === timeSlot,
                            );

                            return (
                              <td
                                key={dayIndex}
                                className="p-2 min-h-[80px] border-r last:border-r-0"
                              >
                                {schedule && (
                                  <div className="h-full rounded-lg bg-blue-50 p-2 border border-blue-200 hover:border-blue-400 transition-colors">
                                    <p className="font-medium text-sm truncate">
                                      {schedule.classAssignment?.subject
                                        ?.name || "Cours"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {schedule.classroom || "Salle"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {schedule.startTime?.slice(0, 5)} -{" "}
                                      {schedule.endTime?.slice(0, 5)}
                                    </p>
                                    <div className="mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {schedule.classAssignment?.professeur?.firstName?.charAt(
                                          0,
                                        )}
                                        .{" "}
                                        {schedule.classAssignment?.professeur
                                          ?.lastName || "Prof"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : studentCourses.length > 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-medium">
                    Emploi du temps en préparation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Votre emploi du temps n'est pas encore disponible.
                  </p>

                  <Card className="max-w-md mx-auto">
                    <CardHeader>
                      <CardTitle>Vos cours cette année</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {studentCourses.map((course, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {course.subject?.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {course.professeur?.firstName}{" "}
                                  {course.professeur?.lastName}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{course.classLevel}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      L'emploi du temps sera disponible une fois que
                      l'administration l'aura programmé.
                    </p>
                    <Button variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vérifier l'emploi du temps
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Emploi du temps non disponible
                  </h3>
                  <p className="text-muted-foreground">
                    Aucun horaire n'a été programmé pour le moment.
                  </p>
                  <Button className="mt-4" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recharger l'emploi du temps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
