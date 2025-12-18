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
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Bell,
  Download,
  Upload,
  Eye,
  Edit,
  BarChart3,
  Award,
  Target,
  PieChart as PieChartIcon,
  Sparkles,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ProfessorDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Mathématiques Avancées",
      level: "Terminale S",
      students: 35,
      progress: 75,
    },
    {
      id: 2,
      name: "Physique Quantique",
      level: "Licence 3",
      students: 28,
      progress: 60,
    },
    {
      id: 3,
      name: "Algèbre Linéaire",
      level: "Licence 2",
      students: 42,
      progress: 90,
    },
  ]);

  const [pendingGrades, setPendingGrades] = useState([
    {
      id: 1,
      course: "Mathématiques",
      assignment: "Devoir 3",
      count: 35,
      dueDate: "2024-03-18",
    },
    {
      id: 2,
      course: "Physique",
      assignment: "TP Mécanique",
      count: 28,
      dueDate: "2024-03-20",
    },
    {
      id: 3,
      course: "Algèbre",
      assignment: "Contrôle 2",
      count: 42,
      dueDate: "2024-03-15",
    },
  ]);

  const [todaySchedule, setTodaySchedule] = useState([
    {
      id: 1,
      time: "8h-10h",
      course: "Mathématiques",
      room: "A201",
      type: "Cours",
    },
    { id: 2, time: "10h-12h", course: "Physique", room: "B105", type: "TP" },
    { id: 3, time: "14h-16h", course: "Algèbre", room: "C302", type: "TD" },
  ]);

  const [studentMessages, setStudentMessages] = useState([
    {
      id: 1,
      student: "Jean Dupont",
      course: "Mathématiques",
      message: "Question sur le chapitre 4",
      time: "10 min",
    },
    {
      id: 2,
      student: "Marie Curie",
      course: "Physique",
      message: "Besoin d'aide pour le TP",
      time: "30 min",
    },
    {
      id: 3,
      student: "Albert Einstein",
      course: "Algèbre",
      message: "Rendez-vous demandé",
      time: "1h",
    },
  ]);

  // Données pour les graphiques
  const gradeDistributionData = [
    { grade: "0-5", count: 2 },
    { grade: "6-10", count: 5 },
    { grade: "11-15", count: 15 },
    { grade: "16-20", count: 13 },
  ];

  const courseProgressData = [
    { month: "Sept", math: 65, physics: 60, algebra: 70 },
    { month: "Oct", math: 70, physics: 65, algebra: 75 },
    { month: "Nov", math: 75, physics: 70, algebra: 80 },
    { month: "Déc", math: 80, physics: 75, algebra: 85 },
    { month: "Jan", math: 85, physics: 80, algebra: 90 },
    { month: "Fév", math: 90, physics: 85, algebra: 92 },
  ];

  const attendanceData = [
    { name: "Présent", value: 85, color: "#4CAF50" },
    { name: "Absent", value: 10, color: "#F44336" },
    { name: "Retard", value: 5, color: "#FF9800" },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const CourseCard = ({ course }: { course: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.level}</Badge>
              <Badge variant="secondary">{course.students} étudiants</Badge>
            </div>
            <h3 className="text-lg font-semibold">{course.name}</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  Progression
                </span>
                <span className="text-sm font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Étudiants
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PendingGradeCard = ({ grade }: { grade: any }) => (
    <Card className="border-l-4 border-l-yellow-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{grade.course}</span>
              <Badge variant="outline">{grade.assignment}</Badge>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                {grade.count} copies à corriger
              </p>
              <p className="text-sm text-muted-foreground">
                Date limite: {grade.dueDate}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Corriger
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ScheduleCard = ({ schedule }: { schedule: any }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            schedule.type === "Cours"
              ? "bg-blue-100"
              : schedule.type === "TP"
              ? "bg-green-100"
              : "bg-purple-100"
          }`}
        >
          <BookOpen
            className={`h-5 w-5 ${
              schedule.type === "Cours"
                ? "text-blue-600"
                : schedule.type === "TP"
                ? "text-green-600"
                : "text-purple-600"
            }`}
          />
        </div>
        <div>
          <h4 className="font-medium">{schedule.course}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{schedule.time}</span>
            <span>•</span>
            <span>{schedule.room}</span>
            <Badge variant="outline">{schedule.type}</Badge>
          </div>
        </div>
      </div>
      <Button size="sm" variant="ghost">
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, Pr. {user?.lastName} !
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord professeur - Suivi des cours et étudiants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer notes
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Nouveau devoir
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cours enseignés
                </p>
                <p className="text-2xl font-bold">{courses.length}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  {courses.reduce((sum, c) => sum + c.students, 0)} étudiants
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Notes à corriger
                </p>
                <p className="text-2xl font-bold">
                  {pendingGrades.reduce((sum, g) => sum + g.count, 0)}
                </p>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {pendingGrades.length} devoirs
                </div>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de présence
                </p>
                <p className="text-2xl font-bold">85%</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% ce mois
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Messages non lus
                </p>
                <p className="text-2xl font-bold">{studentMessages.length}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Des étudiants
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mes cours */}
      <Card>
        <CardHeader>
          <CardTitle>Mes cours</CardTitle>
          <CardDescription>Cours assignés cette année</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphiques statistiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des notes</CardTitle>
            <CardDescription>Dernier devoir de Mathématiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Nombre d'étudiants"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression des cours</CardTitle>
            <CardDescription>Avancement sur l'année</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="math"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Mathématiques"
                  />
                  <Line
                    type="monotone"
                    dataKey="physics"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Physique"
                  />
                  <Line
                    type="monotone"
                    dataKey="algebra"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Algèbre"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travaux en attente et emploi du temps */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notes à corriger */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notes à corriger</CardTitle>
                <CardDescription>
                  Devoirs en attente de correction
                </CardDescription>
              </div>
              <Badge variant="destructive">
                {pendingGrades.reduce((sum, g) => sum + g.count, 0)} copies
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingGrades.map((grade) => (
                <PendingGradeCard key={grade.id} grade={grade} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                Prochaine échéance
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contrôle d'Algèbre à rendre le 15 Mars
              </p>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Commencer la correction
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emploi du temps du jour */}
        <Card>
          <CardHeader>
            <CardTitle>Emploi du temps d'aujourd'hui</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Statistiques de présence</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Pourcentage"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages étudiants et actions rapides */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages des étudiants */}
        <Card>
          <CardHeader>
            <CardTitle>Messages des étudiants</CardTitle>
            <CardDescription>Questions et demandes récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.student}</span>
                        <Badge variant="outline">{message.course}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Il y a {message.time}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              <MessageSquare className="h-4 w-4 mr-2" />
              Voir tous les messages
            </Button>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctions fréquentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <FileText className="h-5 w-5 mb-2" />
                <span className="text-sm">Saisir notes</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Users className="h-5 w-5 mb-2" />
                <span className="text-sm">Présences</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Upload className="h-5 w-5 mb-2" />
                <span className="text-sm">Ressources</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-sm">Planning</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span className="text-sm">Statistiques</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="text-sm">Messages</span>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-600" />
                Objectif pédagogique
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Atteindre 90% de réussite au prochain examen
              </p>
              <div className="flex items-center justify-between">
                <Progress value={75} className="h-2 flex-1 mr-4" />
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance et indicateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Indicateurs de performance</CardTitle>
          <CardDescription>Suivi de votre activité pédagogique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
              <div className="flex justify-center mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold">92%</div>
              <div className="text-sm text-muted-foreground">
                Satisfaction étudiants
              </div>
              <Progress value={92} className="h-2 mt-2" />
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold">45</div>
              <div className="text-sm text-muted-foreground">
                Heures enseignées
              </div>
              <div className="flex items-center justify-center text-sm text-green-600 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% ce mois
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">
                Taux de réussite
              </div>
              <div className="flex items-center justify-center text-sm text-green-600 mt-2">
                <Award className="h-3 w-3 mr-1" />
                Meilleur que la moyenne
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Reconnaissance pédagogique
                </h4>
                <p className="text-sm text-muted-foreground">
                  Votre engagement exceptionnel a été remarqué
                </p>
              </div>
              <Button variant="outline">Voir les détails</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
