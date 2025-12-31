// components/dashboards/ProfessorDashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  useProfesseurStore,
  ProfesseurAssignment,
  ProfesseurSchedule,
} from "@/store/professorStore";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const ProfessorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filteredAssignments, setFilteredAssignments] = useState<
    ProfesseurAssignment[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<string>("current");

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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        if (user?.id) {
          let professeurId = null;

          // Essayer de trouver le professeur par email
          professeurId = user.professeur.id;

          if (professeurId) {
            // Charger toutes les données dynamiques
            await Promise.all([
              fetchProfesseurFullDetails(professeurId),
              fetchProfesseurSchedule(professeurId),
              fetchProfesseurAssignments(professeurId),
            ]);
          } else {
            console.warn(
              "Professeur non trouvé, utiliser les données disponibles"
            );
          }
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.email, user?.firstName, user?.lastName]);

  // Filtrer les assignments par année académique
  useEffect(() => {
    if (professeurAssignments.length > 0) {
      if (selectedYear === "current") {
        const currentAssignments = professeurAssignments.filter(
          (assignment) => assignment.academicYear?.isCurrent
        );
        setFilteredAssignments(currentAssignments);
      } else {
        setFilteredAssignments(professeurAssignments);
      }
    }
  }, [professeurAssignments, selectedYear]);

  // Calculer les statistiques dynamiques
  const stats = useMemo(() => {
    const totalClasses = filteredAssignments.length;

    // Calculer le nombre total d'élèves (estimation)
    const totalStudents = filteredAssignments.reduce((acc, assignment) => {
      // Estimation basée sur le niveau de classe
      const classLevel = assignment.classLevel || "";
      let studentCount = 30; // Valeur par défaut

      if (classLevel.includes("Terminale")) studentCount = 35;
      else if (classLevel.includes("1ère") || classLevel.includes("Première"))
        studentCount = 32;
      else if (classLevel.includes("2nde") || classLevel.includes("Seconde"))
        studentCount = 30;
      else if (classLevel.includes("3ème") || classLevel.includes("Troisième"))
        studentCount = 28;

      return acc + studentCount;
    }, 0);

    // Compter les évaluations en attente (à remplacer par API réelle)
    const totalPendingGrades = filteredAssignments.reduce((acc, assignment) => {
      return acc + (assignment._count?.grades || 0);
    }, 0);

    // Trouver le prochain cours
    const now = new Date();
    const today = now.getDay() === 0 ? 7 : now.getDay(); // Lundi = 1, Dimanche = 7
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextClass = null;
    if (professeurSchedule.length > 0) {
      const sortedSchedule = [...professeurSchedule].sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
        return a.startTime.localeCompare(b.startTime);
      });

      nextClass = sortedSchedule.find((schedule) => {
        if (schedule.dayOfWeek > today) return true;
        if (schedule.dayOfWeek === today) {
          const [hours, minutes] = schedule.startTime.split(":").map(Number);
          const scheduleTime = hours * 60 + minutes;
          return scheduleTime > currentTime;
        }
        return false;
      });
    }

    return {
      totalClasses,
      totalStudents,
      totalPendingGrades,
      nextClass,
    };
  }, [filteredAssignments, professeurSchedule]);

  // Calculer les annonces dynamiques
  const announcements = useMemo(() => {
    const announcementsList = [];
    const today = new Date();

    // Annonce pour les prochaines réunions
    if (
      currentProfesseur?.schedules &&
      currentProfesseur.schedules.length > 0
    ) {
      const nextSchedule = currentProfesseur.schedules[0];
      announcementsList.push({
        id: "1",
        title: "Prochain cours",
        content: `${nextSchedule.subject?.name || "Cours"} avec ${
          nextSchedule.schoolClass?.name || "la classe"
        }`,
        date: format(new Date(), "dd/MM/yyyy", { locale: fr }),
        priority: "high" as const,
      });
    }

    // Annonce pour les notes en attente
    if (stats.totalPendingGrades > 0) {
      announcementsList.push({
        id: "2",
        title: "Notes en attente",
        content: `${stats.totalPendingGrades} évaluation(s) à corriger`,
        date: format(new Date(), "dd/MM/yyyy", { locale: fr }),
        priority: "medium" as const,
      });
    }

    // Annonce d'information générale

    return announcementsList;
  }, [currentProfesseur, stats.totalPendingGrades]);

  // Calculer les performances des élèves (données dynamiques)
  const studentPerformances = useMemo(() => {
    // Cette fonction devrait être remplacée par un appel API
    // Pour l'instant, nous utilisons des données simulées basées sur les assignments
    return filteredAssignments.flatMap((assignment, index) => {
      // Simuler quelques élèves par classe
      return [
        {
          id: `${assignment.id}-1`,
          studentName: `Élève ${index + 1}A`,
          course: assignment.subject?.name || "Cours",
          average: 14 + Math.random() * 6, // Entre 14 et 20
          lastEvaluation: format(
            new Date(Date.now() - Math.random() * 86400000 * 7),
            "dd/MM/yyyy",
            { locale: fr }
          ),
        },
        {
          id: `${assignment.id}-2`,
          studentName: `Élève ${index + 1}B`,
          course: assignment.subject?.name || "Cours",
          average: 10 + Math.random() * 10, // Entre 10 et 20
          lastEvaluation: format(
            new Date(Date.now() - Math.random() * 86400000 * 7),
            "dd/MM/yyyy",
            { locale: fr }
          ),
        },
      ];
    });
  }, [filteredAssignments]);

  // Obtenir le badge de statut basé sur la moyenne
  const getStatusBadge = (average: number) => {
    if (average >= 16) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-200">
          Excellent
        </Badge>
      );
    } else if (average >= 12) {
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
          Bon
        </Badge>
      );
    } else if (average >= 8) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
          Moyen
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-200">
          À améliorer
        </Badge>
      );
    }
  };

  // Obtenir l'icône de priorité
  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <BellRing className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <BellRing className="h-4 w-4" />;
    }
  };

  // Formater l'heure
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}h${minutes}`;
  };

  // Formater le jour de la semaine
  const formatDayOfWeek = (dayNumber: number) => {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return days[dayNumber] || "Jour inconnu";
  };

  // Rafraîchir les données

  // Squelette de chargement
  if (loading || storeLoading) {
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

        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Année académique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Année en cours</SelectItem>
              <SelectItem value="all">Toutes les années</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAssignments.length > 0
                    ? `${filteredAssignments.length} cours assignés cette année`
                    : "Aucun cours assigné"}
                </p>
                <Progress
                  value={Math.min((stats.totalClasses / 10) * 100, 100)}
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Élèves</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Répartis dans {filteredAssignments.length} classes
                </p>
                <Progress
                  value={Math.min((stats.totalStudents / 150) * 100, 100)}
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Notes en attente
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <FileText className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalPendingGrades}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPendingGrades > 0
                    ? "Évaluations à corriger"
                    : "Toutes les notes sont à jour"}
                </p>
                <Progress
                  value={Math.min((stats.totalPendingGrades / 20) * 100, 100)}
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Prochain cours
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Clock className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                {stats.nextClass ? (
                  <>
                    <div className="text-lg font-bold">
                      {formatDayOfWeek(stats.nextClass.dayOfWeek)},{" "}
                      {formatTime(stats.nextClass.startTime)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {stats.nextClass.subject?.name || "Cours"} •{" "}
                      {stats.nextClass.classroom || "Salle non définie"}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold">--:--</div>
                    <p className="text-xs text-muted-foreground">
                      Aucun cours programmé
                    </p>
                  </>
                )}
                <Progress
                  value={stats.nextClass ? 60 : 0}
                  className="h-2 mt-3"
                />
              </CardContent>
            </Card>
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
                  {professeurSchedule
                    .filter(
                      (schedule) => schedule.dayOfWeek === new Date().getDay()
                    )
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
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
                          <Badge variant="outline" className="mt-1">
                            {schedule.classroom || "Salle non définie"}
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {professeurSchedule.filter(
                    (s) => s.dayOfWeek === new Date().getDay()
                  ).length === 0 && (
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
                <CardDescription>Informations à ne pas manquer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-lg border p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {announcement.title}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {announcement.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {announcement.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé des performances */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance des élèves</CardTitle>
                  <CardDescription>Dernières évaluations</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Export",
                      description: "Export des données en cours...",
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière évaluation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPerformances.slice(0, 5).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {student.studentName}
                          </div>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {student.average.toFixed(1)}/20
                            </span>
                            {student.average >= 16 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : student.average >= 10 ? (
                              <TrendingUp className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.average)}</TableCell>
                        <TableCell>{student.lastEvaluation}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Ajouter une note",
                                description: `Pour ${student.studentName}`,
                              });
                            }}
                          >
                            Ajouter note
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Cours */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes Cours Assignés</CardTitle>
                  <CardDescription>Liste complète de vos cours</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Nouveau cours",
                      description: "Fonctionnalité en développement",
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau cours
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAssignments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignments.map((assignment) => (
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
                            {assignment._count?.schedules ||
                              assignment.schedules?.length ||
                              0}
                            h/sem
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>~30 élèves</span>
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

                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Voir détails
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              toast({
                                title: "Saisie des notes",
                                description: `Ouverture pour ${assignment.subject?.name}`,
                              });
                            }}
                          >
                            Saisir notes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucun cours assigné
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore de cours assigné pour cette année
                    académique.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Emploi du temps */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emploi du temps hebdomadaire</CardTitle>
              <CardDescription>
                Semaine du {format(new Date(), "dd/MM/yyyy", { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {professeurSchedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 border-b">
                      <div className="p-3 font-medium"></div>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div key={day} className="p-3 font-medium text-center">
                          {formatDayOfWeek(day)}
                        </div>
                      ))}
                    </div>

                    {["08:00", "10:00", "14:00", "16:00"].map((timeSlot) => (
                      <div
                        key={timeSlot}
                        className="grid grid-cols-8 border-b last:border-b-0"
                      >
                        <div className="p-3 text-sm text-muted-foreground text-center border-r">
                          {timeSlot}
                        </div>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                          const schedule = professeurSchedule.find(
                            (s) =>
                              s.dayOfWeek === day &&
                              s.startTime.startsWith(timeSlot.split(":")[0])
                          );

                          return (
                            <div
                              key={day}
                              className="p-2 min-h-[80px] border-r last:border-r-0"
                            >
                              {schedule && (
                                <div className="h-full rounded-lg bg-primary/5 p-2 border border-primary/20 hover:bg-primary/10 transition-colors">
                                  <p className="font-medium text-sm truncate">
                                    {schedule.subject?.name || "Cours"}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {schedule.schoolClass?.name ||
                                      schedule.classAssignment?.classLevel ||
                                      "Classe"}
                                  </p>
                                  <p className="text-xs mt-1">
                                    {schedule.classroom || "Salle"}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
