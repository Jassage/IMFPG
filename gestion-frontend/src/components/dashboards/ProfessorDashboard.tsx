// components/dashboards/ProfessorDashboard.tsx
import React, { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  BellRing,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  name: string;
  className: string;
  schedule: string;
  totalStudents: number;
  assignmentsPending: number;
}

interface UpcomingClass {
  id: string;
  course: string;
  time: string;
  room: string;
  className: string;
}

interface StudentGradeSummary {
  id: string;
  name: string;
  average: number;
  status: "excellent" | "good" | "average" | "needs_improvement";
  lastEvaluation: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

export const ProfessorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGradeSummary[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessorData();
  }, []);

  const fetchProfessorData = async () => {
    try {
      // Simuler un appel API
      setLoading(true);

      // Données de démonstration
      setTimeout(() => {
        setCourses([
          {
            id: "1",
            name: "Mathématiques",
            className: "Terminale A",
            schedule: "Lun 08:00-10:00",
            totalStudents: 35,
            assignmentsPending: 2,
          },
          {
            id: "2",
            name: "Physique",
            className: "1ère C",
            schedule: "Mar 10:00-12:00",
            totalStudents: 28,
            assignmentsPending: 0,
          },
          {
            id: "3",
            name: "Informatique",
            className: "Terminale D",
            schedule: "Mer 14:00-16:00",
            totalStudents: 25,
            assignmentsPending: 5,
          },
        ]);

        setUpcomingClasses([
          {
            id: "1",
            course: "Mathématiques",
            time: "Aujourd'hui, 08:00",
            room: "Salle 201",
            className: "Terminale A",
          },
          {
            id: "2",
            course: "Physique",
            time: "Demain, 10:00",
            room: "Labo 3",
            className: "1ère C",
          },
          {
            id: "3",
            course: "Informatique",
            time: "Mercredi, 14:00",
            room: "Salle Info 2",
            className: "Terminale D",
          },
        ]);

        setStudentGrades([
          {
            id: "1",
            name: "Jean Dupont",
            average: 18.5,
            status: "excellent",
            lastEvaluation: "15/01/2024",
          },
          {
            id: "2",
            name: "Marie Martin",
            average: 16.2,
            status: "good",
            lastEvaluation: "14/01/2024",
          },
          {
            id: "3",
            name: "Pierre Dubois",
            average: 11.5,
            status: "needs_improvement",
            lastEvaluation: "10/01/2024",
          },
          {
            id: "4",
            name: "Sophie Bernard",
            average: 14.8,
            status: "average",
            lastEvaluation: "12/01/2024",
          },
        ]);

        setAnnouncements([
          {
            id: "1",
            title: "Réunion pédagogique",
            content: "Réunion le vendredi à 15h en salle des professeurs",
            date: "18/01/2024",
            priority: "high",
          },
          {
            id: "2",
            title: "Date limite des notes",
            content:
              "Les notes du 2ème trimestre doivent être saisies avant le 25/01",
            date: "16/01/2024",
            priority: "medium",
          },
          {
            id: "3",
            title: "Formation continue",
            content:
              "Formation sur les nouvelles méthodes pédagogiques disponible",
            date: "10/01/2024",
            priority: "low",
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>;
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>;
      case "needs_improvement":
        return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations personnelles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, Prof. {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de vos activités et responsabilités
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Semaine 3
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />5 cours cette semaine
          </Badge>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Cours assignés cette année
            </p>
            <Progress value={75} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((acc, course) => acc + course.totalStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Répartis dans {courses.length} classes
            </p>
            <Progress value={60} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Travaux en attente
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce(
                (acc, course) => acc + course.assignmentsPending,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Copies à corriger</p>
            <Progress value={30} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prochaine classe
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingClasses[0]?.time.split(",")[1]?.trim() || "--:--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingClasses[0]?.course || "Aucun cours"}
            </p>
            <Progress value={90} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Grille principale */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Prochains cours */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Prochains Cours</CardTitle>
            <CardDescription>Vos prochaines séances de cours</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Salle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">
                      {classItem.course}
                    </TableCell>
                    <TableCell>{classItem.className}</TableCell>
                    <TableCell>{classItem.time}</TableCell>
                    <TableCell>{classItem.room}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                          <DropdownMenuItem>
                            Préparer la séance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Marquer les présences
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Annonces importantes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Annonces & Rappels</CardTitle>
            <CardDescription>Informations importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start space-x-4 rounded-lg border p-3"
                >
                  <div className="flex-shrink-0">
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {announcement.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {announcement.content}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {announcement.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grille secondaire */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Résumé des notes */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Résumé des Notes</CardTitle>
            <CardDescription>
              Performance des élèves dans vos cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière évaluation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGrades.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{student.average}/20</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>{student.lastEvaluation}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navigation vers la page de saisie des notes
                          toast({
                            title: "Redirection",
                            description: "Vers la page de saisie des notes",
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
          </CardContent>
        </Card>

        {/* Vos cours */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vos Cours</CardTitle>
            <CardDescription>Liste de vos cours assignés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{course.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      {course.totalStudents} élèves
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Clock className="mr-1 h-3 w-3" />
                      {course.schedule}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {course.assignmentsPending > 0 ? (
                      <Badge variant="destructive">
                        {course.assignmentsPending}
                      </Badge>
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Navigation vers le détail du cours
                        toast({
                          title: "Détail du cours",
                          description: `Ouvrir ${course.name}`,
                        });
                      }}
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités fréquemment utilisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => {
                // Saisie des notes
                toast({
                  title: "Saisie des notes",
                  description: "Ouvrir l'interface de saisie",
                });
              }}
            >
              <FileText className="h-6 w-6" />
              <span>Saisir des notes</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => {
                // Marquer les présences
                toast({
                  title: "Présences",
                  description: "Marquer les présences",
                });
              }}
            >
              <Users className="h-6 w-6" />
              <span>Présences</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => {
                // Créer un devoir
                toast({
                  title: "Devoir",
                  description: "Créer un nouveau devoir",
                });
              }}
            >
              <BookOpen className="h-6 w-6" />
              <span>Créer devoir</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => {
                // Communiquer avec les parents
                toast({
                  title: "Communication",
                  description: "Envoyer un message aux parents",
                });
              }}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Contacter parents</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
