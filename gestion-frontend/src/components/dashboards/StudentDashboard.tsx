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
  Calendar,
  FileText,
  Download,
  Eye,
  Star,
  Bell,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  School,
  Clock3,
  Notebook,
  CalendarDays,
  Megaphone,
  CalendarClock,
  RefreshCw,
  AlertCircle,
  XCircle,
  CheckCircle,
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
import { Label } from "@/components/ui/label";
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
import { useTimetableStore } from "@/store/timetableStore";

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
  status?: string | null;
  session?: string | null;
  controlType?: string | null;
  subject?: {
    id: string;
    name: string;
    code: string;
    coefficient?: number;
    maxGrade?: number;
  } | null;
  academicYearId?: string;
  classLevel?: string;
  createdAt?: Date;
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

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    currentStudent,
    fetchStudentById,
    loading: studentLoading,
  } = useStudentStore();

  const { fetchStudentGrades } = useGradeStore();
  const { announcements, fetchAnnouncements } = useAnnouncementStore();
  const { assignments, fetchAssignmentsByClass } = useAssignmentStore();
  const { schedules, fetchClassTimetable } = useTimetableStore();
  const { upcomingEvents, fetchUpcomingEvents } = useEventStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState("all");
  const [currentSemester] = useState("Semestre 2");

  // États pour les données
  const [studentGrades, setStudentGrades] = useState<GradeWithDetails[]>([]);
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
    return grade.subject?.maxGrade;
  }, []);

  // Fonction pour obtenir la note de passage (50% de maxGrade)
  const getPassingGrade = useCallback(
    (grade: GradeWithDetails): number => {
      if (grade.passingGrade !== undefined) return grade.passingGrade;
      return getMaxGrade(grade) * 0.5;
    },
    [getMaxGrade]
  );

  // Fonction pour calculer le pourcentage
  const getGradePercentage = useCallback(
    (grade: GradeWithDetails): number => {
      const gradeValue = grade.grade || 0;
      const maxGrade = getMaxGrade(grade);
      return maxGrade > 0 ? (gradeValue / maxGrade) * 100 : 0;
    },
    [getMaxGrade]
  );

  // Fonction pour convertir la note en note sur 20 (pour la moyenne)
  const getGradeOn20 = useCallback(
    (grade: GradeWithDetails): number => {
      const gradeValue = grade.grade || 0;
      const maxGrade = getMaxGrade(grade);
      return maxGrade > 0 ? (gradeValue / maxGrade) * 20 : 0;
    },
    [getMaxGrade]
  );

  // Fonction pour vérifier si la note est validée
  const isGradeValidated = useCallback(
    (grade: GradeWithDetails): boolean => {
      const gradeValue = grade.grade || 0;
      const passingGrade = getPassingGrade(grade);
      return gradeValue >= passingGrade;
    },
    [getPassingGrade]
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
    [getGradePercentage]
  );

  // Fonction pour le badge de statut
  const getGradeStatusBadge = (grade: GradeWithDetails) => {
    const isValid = isGradeValidated(grade);

    if (isValid) {
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs"
        >
          <CheckCircle className="h-3 w-3" />
          Validé
        </Badge>
      );
    }

    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <XCircle className="h-3 w-3" />
        Échec
      </Badge>
    );
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

      // Étape 1: Identifier l'étudiant
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

      // Étape 2: Charger les données de l'étudiant
      try {
        await fetchStudentById(studentId);
      } catch (error) {
        console.error(
          " Erreur lors du chargement des données de l'étudiant:",
          error
        );
      }

      // Étape 3: Charger les notes
      try {
        const gradesData = await fetchStudentGrades(studentId);

        if (gradesData && Array.isArray(gradesData) && gradesData.length > 0) {
          // Formater les notes avec les détails complets
          const formattedGrades = gradesData.map((g: any) => ({
            id: g.id,
            studentId: g.studentId,
            subjectId: g.subjectId,
            grade: g.grade || 0,
            maxGrade: g.maxGrade || g.subject?.defaultMaxGrade || 20,
            passingGrade: g.passingGrade || (g.maxGrade || 20) * 0.5,
            status: g.status || null,
            session: g.session || null,
            controlType: g.controlType || null,
            subject: g.subject || {
              id: g.subjectId,
              name: "Matière",
              code: "N/A",
              coefficient: g.subject?.coefficient || 1,
              defaultMaxGrade: g.subject?.defaultMaxGrade || 20,
            },
            academicYearId: g.academicYearId,
            classLevel: g.classLevel,
            createdAt: new Date(g.createdAt || new Date()),
          })) as GradeWithDetails[];

          setStudentGrades(formattedGrades);
        } else {
          setStudentGrades([]);
        }
      } catch (error) {
        // Fallback: Essayer d'autres méthodes si fetchStudentGrades échoue
        try {
          const response = await api.get(`/grades/student/${studentId}`);

          if (response.data?.success && response.data.data?.grades) {
            const gradesData = response.data.data.grades;

            const formattedGrades = gradesData.map((g: any) => ({
              id: g.id,
              studentId: g.studentId,
              subjectId: g.subjectId,
              grade: g.grade || 0,
              maxGrade: g.maxGrade || g.subject?.defaultMaxGrade || 20,
              passingGrade: g.passingGrade || (g.maxGrade || 20) * 0.5,
              status: g.status || null,
              session: g.session || null,
              controlType: g.controlType || null,
              subject: g.subject || {
                id: g.subjectId,
                name: "Matière",
                code: "N/A",
                coefficient: g.subject?.coefficient || 1,
                defaultMaxGrade: g.subject?.defaultMaxGrade || 20,
              },
              academicYearId: g.academicYearId,
              classLevel: g.classLevel,
              createdAt: new Date(g.createdAt || new Date()),
            })) as GradeWithDetails[];

            setStudentGrades(formattedGrades);
          } else {
            setStudentGrades([]);
          }
        } catch (fallbackError) {
          setStudentGrades([]);
        }
      }

      // Étape 4: Charger les annonces
      try {
        await fetchAnnouncements();
      } catch (error) {}

      // Étape 5: Charger les événements
      try {
        await fetchUpcomingEvents();
      } catch (error) {}

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
                defaultMaxGrade: assignment.subject?.defaultMaxGrade || 20,
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
          console.error(" Erreur lors du chargement des cours:", error);
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
                          subject: scheduleData.subject || {
                            name: scheduleData.subject?.name || "Matière",
                            code: scheduleData.subject?.code || "MAT",
                          },
                          professeur: scheduleData.professeur || {
                            firstName:
                              scheduleData.professeur?.firstName ||
                              "Professeur",
                            lastName: scheduleData.professeur?.lastName || "",
                          },
                        },
                        schoolClass: currentStudent?.schoolClass || {
                          name: currentStudent?.schoolClass?.name || "",
                          level: currentStudent?.schoolClass?.level || "N/A",
                        },
                      });
                    }
                  });
                }
              }
            );

            setStudentSchedule(schedules);
          } else {
            setStudentSchedule([]);
          }
        } catch (error) {
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
    fetchStudentGrades,
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
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
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

  // ==================== CALCULS DES STATISTIQUES ====================

  // Calculer la moyenne générale (sur 20)
  const calculateAverage = useMemo(() => {
    if (!studentGrades || studentGrades.length === 0) {
      return {
        average: "0.00",
        averageOn20: "0.00",
        hasData: false,
        message: "Aucune note disponible",
      };
    }

    let totalWeighted = 0;
    let totalCoefficient = 0;

    studentGrades.forEach((grade: GradeWithDetails) => {
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
      totalGrades: studentGrades.length,
    };
  }, [studentGrades, getGradeOn20]);

  // Calculer les statistiques des notes
  const calculateGradeStats = useMemo(() => {
    return (grades: GradeWithDetails[]) => {
      if (!grades || grades.length === 0) {
        return {
          total: 0,
          average: 0,
          averageOn20: 0,
          validatedCount: 0,
          failedCount: 0,
          retakeCount: 0,
          successRate: 0,
          credits: {
            total: 0,
            obtained: 0,
            progress: 0,
          },
        };
      }

      const validatedGrades = grades.filter(isGradeValidated);
      const failedGrades = grades.filter((g) => !isGradeValidated(g));

      // Calcul de la moyenne sur 20
      let totalWeighted = 0;
      let totalCoefficient = 0;

      grades.forEach((grade) => {
        const coefficient = grade.subject?.coefficient || 1;
        const gradeOn20 = getGradeOn20(grade);
        totalWeighted += gradeOn20 * coefficient;
        totalCoefficient += coefficient;
      });

      const averageOn20 =
        totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;
      const successRate =
        grades.length > 0 ? (validatedGrades.length / grades.length) * 100 : 0;

      const totalCredits = grades.reduce(
        (sum, grade) => sum + (grade.subject?.coefficient || 0),
        0
      );
      const obtainedCredits = validatedGrades.reduce(
        (sum, grade) => sum + (grade.subject?.coefficient || 0),
        0
      );

      return {
        total: grades.length,
        average: Math.round(averageOn20 * 100) / 100,
        averageOn20: Math.round(averageOn20 * 100) / 100,
        validatedCount: validatedGrades.length,
        failedCount: failedGrades.length,
        successRate: Math.round(successRate * 100) / 100,
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

  // Données pour le graphique de progression
  const getProgressData = useMemo(() => {
    if (studentGrades.length > 0) {
      const monthlyGrades: Record<string, { total: number; count: number }> =
        {};

      studentGrades.forEach((grade) => {
        const date = new Date(grade.createdAt || new Date());
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

    return [
      { month: "Sept", average: 13.5 },
      { month: "Oct", average: 14.5 },
      { month: "Nov", average: 15.5 },
      { month: "Déc", average: 15.5 },
      { month: "Jan", average: 16 },
      { month: "Fév", average: 17 },
    ];
  }, [studentGrades, getGradeOn20]);

  // Fonction pour grouper les notes par type de contrôle
  const groupGradesByControlType = useMemo(() => {
    if (!studentGrades.length) return {};

    const grouped: Record<string, GradeWithDetails[]> = {};

    studentGrades.forEach((grade) => {
      const controlType = grade.controlType || "Autre";

      if (!grouped[controlType]) {
        grouped[controlType] = [];
      }

      grouped[controlType].push(grade);
    });

    return grouped;
  }, [studentGrades]);

  // Fonction pour obtenir les statistiques par contrôle
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

  // Données pour le radar des compétences (basé sur le pourcentage)
  const getSkillData = useMemo(() => {
    if (studentGrades.length > 0) {
      const subjectMap = new Map<
        string,
        { totalPercentage: number; count: number; coefficient: number }
      >();

      studentGrades.forEach((grade: GradeWithDetails) => {
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

    return [
      {
        subject: "Maths",
        score: 75,
        fullMark: 100,
        coefficient: 4,
        average: "75.0",
      },
      {
        subject: "Physique",
        score: 85,
        fullMark: 100,
        coefficient: 3,
        average: "85.0",
      },
      {
        subject: "SVT",
        score: 65,
        fullMark: 100,
        coefficient: 2,
        average: "65.0",
      },
      {
        subject: "Français",
        score: 90,
        fullMark: 100,
        coefficient: 2,
        average: "90.0",
      },
      {
        subject: "Anglais",
        score: 80,
        fullMark: 100,
        coefficient: 2,
        average: "80.0",
      },
      {
        subject: "Hist-Géo",
        score: 70,
        fullMark: 100,
        coefficient: 1,
        average: "70.0",
      },
    ];
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

  // Fonction pour forcer le rechargement
  const handleRefresh = useCallback(() => {
    hasLoadedRef.current = false;
    isLoadingRef.current = false;
    setLoading(true);

    setStudentGrades([]);
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

    return (
      <Card className="hover:shadow-md transition-shadow hover:border-primary/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isValidated ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <BookOpen
                  className={`h-5 w-5 ${
                    isValidated ? "text-green-600" : "text-red-600"
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
              <div
                className={`text-xl sm:text-2xl font-bold ${getGradeColor(
                  grade
                )}`}
              >
                {gradeValue.toFixed(0)}/{maxGrade}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {percentage.toFixed(0)}% • {coefficient} crédits
              </div>
              {grade.passingGrade !== undefined && (
                <div className="text-xs text-amber-600 mt-1">
                  Passage: {grade.passingGrade}/{maxGrade}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progression</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${isValidated ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>
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
                    "fr-FR"
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
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
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

  // Composant d'état de chargement
  const LoadingSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {user?.firstName} {user?.lastName} !
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
              <GraduationCap className="h-3 w-3 mr-1" />
              {displayStudent?.schoolClass?.name || "Étudiant"}
            </Badge>
            <Badge variant="outline">{currentSemester}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              Moyenne: {average}/20
              {!hasData && (
                <span className="text-xs text-muted-foreground ml-2">
                  (pas de notes)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Statistiques et données */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cartes de statistiques */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Moyenne générale
                        </p>
                        <p className="text-2xl font-bold">{average}/20</p>
                        <div className="flex items-center text-sm mt-1 text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {gradeStats.validatedCount}/{studentGrades.length}{" "}
                          validés
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
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
                          {studentGrades.length} notes saisies
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
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
                      <div className="p-3 rounded-full bg-green-100">
                        <Clock3 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Annonces récentes
                        </p>
                        <p className="text-2xl font-bold">
                          {filteredAnnouncements.length}
                        </p>
                        <div className="text-sm text-muted-foreground mt-1">
                          {
                            filteredAnnouncements.filter(
                              (a) => a.priority === "High"
                            ).length
                          }{" "}
                          importantes
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-100">
                        <Bell className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
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
              </div>

              {/* Cours d'aujourd'hui */}
              <Card>
                <CardHeader>
                  <CardTitle>Cours d'aujourd'hui</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
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
                              0
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
            </div>

            {/* Colonne droite - Événements et annonces */}
            <div className="space-y-6">
              {/* Calendrier et filtres */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Calendrier</span>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez une date pour filtrer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg text-center bg-accent/50">
                      <div className="text-2xl font-bold">
                        {selectedDate.getDate()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDate.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          month: "long",
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterType">Filtrer par type</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
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

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Aujourd'hui
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Événements à venir */}
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
                              "fr-FR"
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

              {/* Dernières annonces */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Dernières annonces
                  </CardTitle>
                  <CardDescription>Informations importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredAnnouncements
                    .slice(0, 3)
                    .map((announcement, index) => (
                      <AnnouncementCard
                        key={index}
                        announcement={announcement}
                      />
                    ))}
                </CardContent>
              </Card>
            </div>
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
              <CardTitle>Mes Notes</CardTitle>
              <CardDescription>
                Résultats académiques par contrôle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentGrades.length > 0 ? (
                <>
                  {/* Tabs pour les types de contrôle */}
                  <Tabs defaultValue="tous" className="mb-6">
                    <TabsList className="flex-wrap h-auto">
                      <TabsTrigger value="tous" className="text-xs">
                        Toutes les notes ({studentGrades.length})
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
                        )
                      )}
                    </TabsList>

                    {/* Onglet "Toutes les notes" */}
                    <TabsContent value="tous" className="mt-4">
                      {/* Statistiques générales */}
                      <Card className="mb-6">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 rounded-lg bg-primary/5">
                              <div className="text-2xl font-bold text-primary">
                                {gradeStats.averageOn20}/20
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Moyenne générale
                              </div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-green-50">
                              <div className="text-2xl font-bold text-green-600">
                                {gradeStats.validatedCount}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Validés
                              </div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-blue-50">
                              <div className="text-2xl font-bold text-blue-600">
                                {gradeStats.successRate}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Taux réussite
                              </div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-amber-50">
                              <div className="text-2xl font-bold text-amber-600">
                                {studentGrades.length}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total notes
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Statistiques par contrôle */}
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
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Liste de toutes les notes */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {studentGrades.map((grade, index) => (
                          <SubjectCard key={index} grade={grade} />
                        ))}
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
                      )
                    )}
                  </Tabs>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Aucune note disponible
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Aucune note n'a été saisie pour le moment.
                  </p>
                  <div className="mt-4 space-y-2 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                      Les notes apparaîtront ici une fois que vos professeurs
                      les auront saisies.
                    </p>
                    <Button variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vérifier les nouvelles notes
                    </Button>
                  </div>
                </div>
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
                      <tr className="border-b">
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
                      {["08:00", "10:00", "14:00", "16:00"].map((timeSlot) => (
                        <tr key={timeSlot} className="border-b last:border-b-0">
                          <td className="p-3 text-sm text-muted-foreground text-center border-r">
                            {timeSlot}
                          </td>
                          {[1, 2, 3, 4, 5, 6].map((dayIndex) => {
                            const dayKey = Object.keys(dayMap).find(
                              (key) => dayMap[key] === dayIndex
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
                                s.startTime?.startsWith(timeSlot.split(":")[0])
                            );

                            return (
                              <td
                                key={dayIndex}
                                className="p-2 min-h-[80px] border-r last:border-r-0"
                              >
                                {schedule && (
                                  <div className="h-full rounded-lg bg-blue-50 p-2 border border-blue-200">
                                    <p className="font-medium text-sm truncate">
                                      {schedule.classAssignment?.subject
                                        ?.name || "Cours"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {schedule.classroom || "Salle"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {schedule.startTime} - {schedule.endTime}
                                    </p>
                                    <div className="mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {schedule.classAssignment?.professeur?.firstName?.charAt(
                                          0
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
