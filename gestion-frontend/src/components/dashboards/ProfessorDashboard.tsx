// components/dashboards/ProfessorDashboard.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  useProfesseurStore,
  ProfesseurAssignment,
  ProfesseurSchedule,
} from "@/store/professorStore";
import { useEventStore, Event } from "@/store/eventStore";
import { useAnnouncementStore, Announcement } from "@/store/announcementStore";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  BellRing,
  MessageSquare,
  AlertCircle,
  User,
  Download,
  Plus,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ExternalLink,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  format,
  getDay,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Composant mémoïsé pour les cartes de statistiques
const StatsCard = React.memo(
  ({
    title,
    value,
    icon,
    description,
    color = "primary",
    progressValue = 0,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    color?: string;
    progressValue?: number;
  }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`h-8 w-8 rounded-lg bg-${color}/10 flex items-center justify-center group-hover:bg-${color}/20 transition-colors`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Progress
          value={Math.min(progressValue, 100)}
          className={`h-2 mt-3 bg-${color}/10`}
        />
      </CardContent>
    </Card>
  )
);

StatsCard.displayName = "StatsCard";

// Composant Modal pour les annonces
const AnnouncementModal = ({
  announcement,
  open,
  onOpenChange,
}: {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {announcement.title}
              </DialogTitle>
              <DialogDescription>
                Publié le{" "}
                {format(parseISO(announcement.publishDate), "dd/MM/yyyy", {
                  locale: fr,
                })}
                {announcement.expiryDate && (
                  <>
                    {" "}
                    • Expire le{" "}
                    {format(parseISO(announcement.expiryDate), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </>
                )}
              </DialogDescription>
            </div>
            <Badge
              className={`
                ${
                  announcement.priority === "Critical"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                ${
                  announcement.priority === "High"
                    ? "bg-orange-100 text-orange-800"
                    : ""
                }
                ${
                  announcement.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  announcement.priority === "Low"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }
              `}
            >
              {announcement.priority}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Informations sur l'auteur */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">
                  Par {announcement.author?.firstName}{" "}
                  {announcement.author?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {announcement.author?.role || "Auteur"} •{" "}
                  {announcement.author?.email}
                </p>
              </div>
            </div>

            {/* Audience cible */}
            <div>
              <h4 className="text-sm font-medium mb-2">Public cible</h4>
              <Badge variant="outline" className="bg-primary/10">
                {announcement.targetAudience}
              </Badge>
            </div>

            {/* Contenu */}
            <div>
              <h4 className="text-sm font-medium mb-2">Contenu</h4>
              <div className="prose max-w-none whitespace-pre-line text-gray-700">
                {announcement.content}
              </div>
            </div>

            {/* Pièces jointes */}
            {announcement.attachments &&
              announcement.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Pièces jointes ({announcement.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {announcement.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Statut :{" "}
            <span
              className={
                announcement.isActive
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {announcement.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir dans une nouvelle fenêtre
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant Modal pour les événements
const EventModal = ({
  event,
  open,
  onOpenChange,
}: {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!event) return null;
  // Fonction de formatage sécurisée
  const formatDateSafe = (
    dateString?: string,
    formatStr: string = "dd/MM/yyyy HH:mm"
  ) => {
    if (!dateString) return "Date non définie";
    try {
      return format(parseISO(dateString), formatStr, { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date invalide";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription>
                {formatDateSafe(event.startDate)} -{" "}
                {formatDateSafe(event.endDate)}
              </DialogDescription>
            </div>
            <Badge
              className={`
                ${
                  event.category === "Academic"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }
                ${
                  event.category === "Cultural"
                    ? "bg-purple-100 text-purple-800"
                    : ""
                }
                ${
                  event.category === "Sports"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                ${
                  event.category === "Meeting"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  event.category === "General"
                    ? "bg-gray-100 text-gray-800"
                    : ""
                }
              `}
            >
              {event.category}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Localisation */}
            {event.location && (
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lieu</p>
                  <p className="text-sm text-gray-700">{event.location}</p>
                </div>
              </div>
            )}

            {/* Organisateur */}
            {event.organizer && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Organisateur</p>
                  <p className="text-sm text-gray-700">{event.organizer}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <div className="prose max-w-none whitespace-pre-line text-gray-700">
                  {event.description}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Statut</h4>
                <Badge
                  className={`
                    ${
                      event.status === "Scheduled"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      event.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${
                      event.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                    ${
                      event.status === "Postponed"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                  `}
                >
                  {event.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Visibilité</h4>
                <Badge
                  variant="outline"
                  className={event.isPublic ? "bg-green-50" : "bg-yellow-50"}
                >
                  {event.isPublic ? "Public" : "Privé"}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Créé le {formatDateSafe(event.createdAt, "dd/MM/yyyy")}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            {event.isPublic && (
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Ajouter à mon calendrier
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ProfessorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filteredAssignments, setFilteredAssignments] = useState<
    ProfesseurAssignment[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<string>("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(true);

  // États pour les modales
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const itemsPerPage = 5;

  const { user } = useAuthStore();
  const { toast } = useToast();
  const {
    currentProfesseur,
    professeurSchedule,
    professeurAssignments,
    loading: storeLoading,
    fetchProfesseurFullDetails,
    fetchProfesseurSchedule,
    fetchProfesseurAssignments,
  } = useProfesseurStore();

  // Ajoutez ces constantes au début de votre composant
  const dayApiToFrench: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
    SUNDAY: "Dimanche",
  };

  const jsToApiDayMap: Record<number, string> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };

  const apiDayToJs: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  // Récupérer les stores d'événements et d'annonces
  const {
    events,
    upcomingEvents,
    loading: eventsLoading,
    fetchUpcomingEvents,
  } = useEventStore();

  const {
    announcements,
    activeAnnouncements,
    loading: announcementsLoading,
    fetchActiveAnnouncements,
  } = useAnnouncementStore();

  const formatTime = useCallback((timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}h${minutes}`;
  }, []);

  // Chargement des données
  useEffect(() => {
    setIsMounted(true);

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        if (user?.id) {
          const professeurId = user.professeur?.id;

          if (professeurId) {
            await Promise.all([
              fetchProfesseurFullDetails(professeurId),
              fetchProfesseurSchedule(professeurId),
              fetchProfesseurAssignments(professeurId),
              fetchUpcomingEvents(3), // Récupérer 3 événements à venir
              fetchActiveAnnouncements(5), // Récupérer 5 annonces actives
            ]);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du dashboard",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      setIsMounted(false);
    };
  }, [user?.id]);

  // Filtrer les assignments par année académique
  useEffect(() => {
    if (professeurAssignments.length > 0) {
      let filtered = professeurAssignments;

      if (selectedYear === "current") {
        filtered = filtered.filter(
          (assignment) => assignment.academicYear?.isCurrent
        );
      }

      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]);
    }
  }, [professeurAssignments, selectedYear]);

  // Filtrage avancé avec recherche
  const filteredAssignmentsBySearch = useMemo(() => {
    if (!searchTerm && selectedClass === "all") return filteredAssignments;

    return filteredAssignments.filter((assignment) => {
      const matchesSearch = searchTerm
        ? assignment.subject?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assignment.classLevel
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      const matchesClass =
        selectedClass !== "all"
          ? assignment.classLevel === selectedClass
          : true;

      return matchesSearch && matchesClass;
    });
  }, [filteredAssignments, searchTerm, selectedClass]);

  const formatDayOfWeek = useCallback((dayNumberOrString: number | string) => {
    // Si c'est un string (format API comme "MONDAY")
    if (typeof dayNumberOrString === "string") {
      return dayApiToFrench[dayNumberOrString] || dayNumberOrString;
    }

    // Si c'est un number (format JavaScript 0-6)
    const jsDay = dayNumberOrString;
    const apiDay = jsToApiDayMap[jsDay];
    if (apiDay) {
      return dayApiToFrench[apiDay] || `Jour ${jsDay}`;
    }

    return "Jour inconnu";
  }, []);
  // Calculer les statistiques dynamiques BASÉES SUR LES DONNÉES RÉELLES
  const stats = useMemo(() => {
    const totalClasses = filteredAssignmentsBySearch.length;

    const totalStudents = filteredAssignmentsBySearch.reduce(
      (acc, assignment) => {
        if (assignment.schoolClass?.students?.length) {
          return acc + assignment.schoolClass.students.length;
        }
        return acc;
      },
      0
    );

    const now = new Date();
    const today = getDay(now);
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextClass: ProfesseurSchedule | null = null;

    if (professeurSchedule.length > 0) {
      const sortedSchedule = [...professeurSchedule].sort((a, b) => {
        const dayA = a.dayOfWeek === 7 ? 0 : a.dayOfWeek;
        const dayB = b.dayOfWeek === 7 ? 0 : b.dayOfWeek;

        const dayDiff = (dayA - today + 7) % 7;
        const dayDiffB = (dayB - today + 7) % 7;

        if (dayDiff !== dayDiffB) return dayDiff - dayDiffB;

        const [hoursA, minutesA] = a.startTime.split(":").map(Number);
        const [hoursB, minutesB] = b.startTime.split(":").map(Number);
        const timeA = hoursA * 60 + minutesA;
        const timeB = hoursB * 60 + minutesB;
        return timeA - timeB;
      });

      nextClass =
        sortedSchedule.find((schedule) => {
          const scheduleDay = schedule.dayOfWeek === 7 ? 0 : schedule.dayOfWeek;
          const [hours, minutes] = schedule.startTime.split(":").map(Number);
          const scheduleTime = hours * 60 + minutes;

          if (scheduleDay > today) return true;
          if (scheduleDay === today) {
            return scheduleTime > currentTime;
          }
          return false;
        }) || null;
    }

    return {
      totalClasses,
      totalStudents,
      nextClass,
    };
  }, [filteredAssignmentsBySearch, professeurSchedule]);

  // Obtenir les annonces pour les professeurs
  const professorAnnouncements = useMemo(() => {
    return activeAnnouncements
      .filter((announcement) => {
        // Filtrer les annonces qui concernent les professeurs
        return (
          announcement.targetAudience === "Teachers" ||
          announcement.targetAudience === "All" ||
          announcement.targetAudience === "Staff"
        );
      })
      .slice(0, 5); // Limiter à 5 annonces
  }, [activeAnnouncements]);

  // Obtenir les événements à venir pour le dashboard
  const dashboardEvents = useMemo(() => {
    const now = new Date();
    return upcomingEvents
      .filter((event) => {
        // Filtrer les événements publics ou académiques
        return (
          event.isPublic ||
          event.category === "Academic" ||
          event.category === "Meeting"
        );
      })
      .filter((event) => isAfter(parseISO(event.startDate), now))
      .sort(
        (a, b) =>
          parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
      )
      .slice(0, 3); // Limiter à 3 événements
  }, [upcomingEvents]);

  // Obtenir les cours d'aujourd'hui
  const todaySchedule = useMemo(() => {
    const today = new Date();
    const currentDayJs = today.getDay(); // JavaScript: 0-6
    const currentDayApi = jsToApiDayMap[currentDayJs]; // Convertir en "MONDAY", etc.

    if (!currentDayApi) {
      return [];
    }

    // Votre schedule doit avoir dayOfWeek en format string ("MONDAY")
    return professeurSchedule
      .filter((schedule) => {
        // Assurez-vous que schedule.dayOfWeek est un string
        return schedule.dayOfWeek.toString() === currentDayApi;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [professeurSchedule]);

  // Obtenir les classes uniques pour le filtre
  const uniqueClasses = useMemo(() => {
    const classes = filteredAssignments
      .map((assignment) => assignment.classLevel)
      .filter(Boolean) as string[];
    return Array.from(new Set(classes));
  }, [filteredAssignments]);

  const formatDateSafe = (
    dateString?: string,
    formatStr: string = "dd/MM/yyyy HH:mm"
  ) => {
    if (!dateString) return "Date non définie";
    try {
      return format(parseISO(dateString), formatStr, { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date invalide";
    }
  };

  // Fonction pour obtenir la couleur du cours
  const getCourseColor = useCallback((id: string) => {
    const colors = [
      "bg-blue-100 border-blue-200 text-blue-800",
      "bg-green-100 border-green-200 text-green-800",
      "bg-purple-100 border-purple-200 text-purple-800",
      "bg-amber-100 border-amber-200 text-amber-800",
      "bg-pink-100 border-pink-200 text-pink-800",
    ];
    const index = parseInt(id, 36) % colors.length;
    return colors[index];
  }, []);

  // Fonctions pour gérer les modales
  const handleAnnouncementClick = useCallback((announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  }, []);

  // Squelette de chargement
  if (loading || storeLoading || eventsLoading || announcementsLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bonjour, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentProfesseur?.speciality || "Professeur"} • Semaine{" "}
            {Math.floor(new Date().getDate() / 7) + 1}
          </p>
        </div>
      </div>

      {/* Notification si données manquantes */}
      {!currentProfesseur && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              Certaines données de profil ne sont pas disponibles. Veuillez
              contacter l'administration.
            </p>
          </div>
        </div>
      )}

      {/* Tabs de navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="courses">Cours</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
        </TabsList>

        {/* Tab: Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Mes Cours"
              value={stats.totalClasses}
              icon={<BookOpen className="h-4 w-4 text-primary" />}
              description={`${filteredAssignments.length} cours assignés`}
              color="primary"
              progressValue={Math.min((stats.totalClasses / 10) * 100, 100)}
            />

            <StatsCard
              title="Prochain cours"
              value={
                stats.nextClass
                  ? `${formatDayOfWeek(
                      stats.nextClass.dayOfWeek
                    )}, ${formatTime(stats.nextClass.startTime)}`
                  : "Aucun"
              }
              icon={<Clock className="h-4 w-4 text-green-500" />}
              description={
                stats.nextClass
                  ? `${stats.nextClass.subject?.name || "Cours"} • ${
                      stats.nextClass.classroom || "Salle non définie"
                    }`
                  : "Aucun cours programmé"
              }
              color="green"
              progressValue={stats.nextClass ? 60 : 0}
            />
          </div>

          {/* Grille principale */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Emploi du temps du jour */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Emploi du temps du jour</CardTitle>
                <CardDescription>
                  {formatDayOfWeek(new Date().getDay())}{" "}
                  {format(new Date(), "dd/MM/yyyy", { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-all ${getCourseColor(
                          schedule.id
                        )}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-white/50 flex items-center justify-center">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {schedule.subject?.name || "Cours"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {schedule.schoolClass?.name ||
                                schedule.classAssignment?.classLevel ||
                                "Classe"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </p>
                          <Badge variant="outline" className="mt-1 bg-white">
                            {schedule.classroom || "Salle non définie"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun cours programmé aujourd'hui</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Annonces importantes */}
            <Card>
              <CardHeader>
                <CardTitle>Annonces importantes</CardTitle>
                <CardDescription>Dernières annonces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {professorAnnouncements.length > 0 ? (
                    professorAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-lg border p-3 hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => handleAnnouncementClick(announcement)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <BellRing className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">
                                {announcement.title}
                              </p>
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                {format(
                                  parseISO(announcement.publishDate),
                                  "dd/MM",
                                  { locale: fr }
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {announcement.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {announcement.targetAudience}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAnnouncementClick(announcement);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Lire
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <BellRing className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune annonce pour le moment</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Événements à venir */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Événements à venir</CardTitle>
                  <CardDescription>
                    Prochains événements et réunions
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Calendrier complet",
                      description: "Ouverture du calendrier complet",
                    });
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboardEvents.length > 0 ? (
                  dashboardEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {event.title}
                            </CardTitle>
                            <CardDescription>
                              <span>
                                {formatDateSafe(event.startDate, "HH:mm")} -{" "}
                                {formatDateSafe(event.endDate, "HH:mm")}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`
                              ${
                                event.category === "Academic"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                              }
                              ${
                                event.category === "Cultural"
                                  ? "bg-purple-100 text-purple-800"
                                  : ""
                              }
                              ${
                                event.category === "Sports"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                event.category === "Meeting"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                            `}
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(parseISO(event.startDate), "HH:mm", {
                              locale: fr,
                            })}{" "}
                            -{" "}
                            {format(parseISO(event.endDate), "HH:mm", {
                              locale: fr,
                            })}
                          </span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}

                        {event.description && (
                          <p className="text-sm line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                event.status === "Scheduled"
                                  ? "border-green-200 text-green-700"
                                  : ""
                              }
                              ${
                                event.status === "Cancelled"
                                  ? "border-red-200 text-red-700"
                                  : ""
                              }
                            `}
                          >
                            {event.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Aucun événement à venir
                    </h3>
                    <p className="text-muted-foreground">
                      Aucun événement n'est programmé pour les prochains jours.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Cours */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes Cours Assignés</CardTitle>
                  <CardDescription>Liste complète de vos cours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Barre de recherche et filtres */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un cours..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {uniqueClasses.length > 0 && (
                    <Select
                      value={selectedClass}
                      onValueChange={setSelectedClass}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les classes</SelectItem>
                        {uniqueClasses.map((classLevel) => (
                          <SelectItem key={classLevel} value={classLevel}>
                            {classLevel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {filteredAssignmentsBySearch.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignmentsBySearch.map((assignment) => (
                    <Card
                      key={assignment.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {assignment.subject?.name || "Cours"}
                            </CardTitle>
                            <CardDescription>
                              {assignment.classLevel || "Niveau non spécifié"}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            {assignment.schedules?.length || 0}h/sem
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {assignment.schoolClass?.students?.length ||
                                "N/A"}{" "}
                              élèves
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {assignment.academicYear?.year ||
                                "Année non spécifiée"}
                            </span>
                          </div>
                        </div>

                        {assignment.schedules &&
                          assignment.schedules.length > 0 && (
                            <div className="pt-2">
                              <p className="text-sm font-medium mb-2">
                                Horaires :
                              </p>
                              <div className="space-y-2">
                                {assignment.schedules
                                  .slice(0, 2)
                                  .map((schedule, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {formatDayOfWeek(schedule.dayOfWeek)}
                                      </span>
                                      <span>
                                        {formatTime(schedule.startTime)}-
                                        {formatTime(schedule.endTime)}
                                      </span>
                                    </div>
                                  ))}
                                {assignment.schedules.length > 2 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{assignment.schedules.length - 2} autres
                                    créneaux
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm || selectedClass !== "all"
                      ? "Aucun cours ne correspond aux critères"
                      : "Aucun cours assigné"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || selectedClass !== "all"
                      ? "Essayez de modifier vos critères de recherche."
                      : "Vous n'avez pas encore de cours assigné pour cette année académique."}
                  </p>
                  {(searchTerm || selectedClass !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedClass("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Emploi du temps */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Emploi du temps hebdomadaire</CardTitle>
                  <CardDescription>
                    Semaine du{" "}
                    {format(new Date(), "dd/MM/yyyy", { locale: fr })}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Emploi du temps - ${user?.firstName} ${
                        user?.lastName
                      }</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              h2 { color: #333; }
                              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                              th { background-color: #f5f5f5; }
                            </style>
                          </head>
                          <body>
                            <h2>Emploi du temps - ${user?.firstName} ${
                        user?.lastName
                      }</h2>
                            <p>${format(new Date(), "dd/MM/yyyy", {
                              locale: fr,
                            })}</p>
                            <table border="1">
                              <thead>
                                <tr>
                                  <th>Jour</th>
                                  <th>Heure</th>
                                  <th>Cours</th>
                                  <th>Classe</th>
                                  <th>Salle</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${professeurSchedule
                                  .sort(
                                    (a, b) =>
                                      a.dayOfWeek - b.dayOfWeek ||
                                      a.startTime.localeCompare(b.startTime)
                                  )
                                  .map(
                                    (schedule) => `
                                    <tr>
                                      <td>${formatDayOfWeek(
                                        schedule.dayOfWeek
                                      )}</td>
                                      <td>${formatTime(
                                        schedule.startTime
                                      )} - ${formatTime(schedule.endTime)}</td>
                                      <td>${
                                        schedule.subject?.name || "Non spécifié"
                                      }</td>
                                      <td>${
                                        schedule.schoolClass?.name ||
                                        schedule.classAssignment?.classLevel ||
                                        "Non spécifié"
                                      }</td>
                                      <td>${
                                        schedule.classroom || "Non spécifié"
                                      }</td>
                                    </tr>
                                  `
                                  )
                                  .join("")}
                              </tbody>
                            </table>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => {
                        printWindow.print();
                      }, 250);
                    }
                  }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                {professeurSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left font-medium">Jour</th>
                          <th className="p-3 text-left font-medium">Heure</th>
                          <th className="p-3 text-left font-medium">Cours</th>
                          <th className="p-3 text-left font-medium">Classe</th>
                          <th className="p-3 text-left font-medium">Salle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {professeurSchedule
                          .sort((a, b) => {
                            // Trier par jour (selon l'ordre de la semaine)
                            const dayOrder = {
                              MONDAY: 1,
                              TUESDAY: 2,
                              WEDNESDAY: 3,
                              THURSDAY: 4,
                              FRIDAY: 5,
                              SATURDAY: 6,
                              SUNDAY: 7,
                            };

                            const dayA = a.dayOfWeek?.toString();
                            const dayB = b.dayOfWeek?.toString();

                            if (dayA && dayB && dayA !== dayB) {
                              return (
                                (dayOrder[dayA] || 99) - (dayOrder[dayB] || 99)
                              );
                            }

                            // Si même jour, trier par heure
                            return a.startTime.localeCompare(b.startTime);
                          })
                          .map((schedule) => (
                            <tr
                              key={schedule.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                {formatDayOfWeek(schedule.dayOfWeek)}
                              </td>
                              <td className="p-3">
                                {formatTime(schedule.startTime)} -{" "}
                                {formatTime(schedule.endTime)}
                              </td>
                              <td className="p-3 font-medium">
                                {schedule.subject?.name || "Non spécifié"}
                              </td>
                              <td className="p-3">
                                {schedule.schoolClass?.name ||
                                  schedule.classAssignment?.classLevel ||
                                  "Non spécifié"}
                              </td>
                              <td className="p-3">
                                {schedule.classroom || "Non spécifié"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      Emploi du temps vide
                    </h3>
                    <p className="text-muted-foreground">
                      Aucun horaire n'a été programmé pour le moment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        open={announcementModalOpen}
        onOpenChange={setAnnouncementModalOpen}
      />

      <EventModal
        event={selectedEvent}
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
      />
    </div>
  );
};

// Composant de chargement
const LoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header skeleton */}
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Stats cards skeleton */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main content skeleton */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-3" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ProfessorDashboard;
