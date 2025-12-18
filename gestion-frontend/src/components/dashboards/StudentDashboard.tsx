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
  TrendingUp,
  Clock,
  Calendar,
  FileText,
  Download,
  Eye,
  ChevronRight,
  Star,
  Award,
  Bookmark,
  Bell,
  Users,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
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

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [currentGrade, setCurrentGrade] = useState("Terminale S");
  const [currentSemester, setCurrentSemester] = useState("Semestre 2");

  const [grades, setGrades] = useState([
    {
      id: 1,
      subject: "Mathématiques",
      grade: 18,
      average: 15,
      coefficient: 4,
      rank: 1,
    },
    {
      id: 2,
      subject: "Physique",
      grade: 16,
      average: 14,
      coefficient: 3,
      rank: 2,
    },
    {
      id: 3,
      subject: "Français",
      grade: 15,
      average: 13,
      coefficient: 3,
      rank: 3,
    },
    {
      id: 4,
      subject: "Histoire",
      grade: 17,
      average: 16,
      coefficient: 2,
      rank: 1,
    },
    {
      id: 5,
      subject: "Anglais",
      grade: 14,
      average: 12,
      coefficient: 2,
      rank: 4,
    },
    {
      id: 6,
      subject: "Philosophie",
      grade: 13,
      average: 11,
      coefficient: 2,
      rank: 5,
    },
  ]);

  const [schedule, setSchedule] = useState([
    {
      id: 1,
      day: "Lundi",
      time: "8h-10h",
      subject: "Mathématiques",
      room: "A201",
      teacher: "M. Einstein",
    },
    {
      id: 2,
      day: "Lundi",
      time: "10h-12h",
      subject: "Physique",
      room: "B105",
      teacher: "Mme Curie",
    },
    {
      id: 3,
      day: "Mardi",
      time: "8h-10h",
      subject: "Français",
      room: "A201",
      teacher: "M. Hugo",
    },
    {
      id: 4,
      day: "Mardi",
      time: "14h-16h",
      subject: "Histoire",
      room: "C302",
      teacher: "M. Napoléon",
    },
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: "Mathématiques",
      title: "Devoir sur les dérivées",
      dueDate: "2024-03-20",
      status: "pending",
    },
    {
      id: 2,
      subject: "Physique",
      title: "TP Mécanique",
      dueDate: "2024-03-18",
      status: "submitted",
    },
    {
      id: 3,
      subject: "Français",
      title: "Commentaire de texte",
      dueDate: "2024-03-22",
      status: "pending",
    },
    {
      id: 4,
      subject: "Histoire",
      title: "Exposé Guerre Froide",
      dueDate: "2024-03-25",
      status: "overdue",
    },
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Meilleure note Maths",
      description: "18/20 au dernier DS",
      icon: "Trophy",
      unlocked: true,
    },
    {
      id: 2,
      title: "Assiduité parfaite",
      description: "1 mois sans absence",
      icon: "CheckCircle",
      unlocked: true,
    },
    {
      id: 3,
      title: "Participant actif",
      description: "10 interventions en classe",
      icon: "Users",
      unlocked: true,
    },
    {
      id: 4,
      title: "Prochain objectif",
      description: "Moyenne générale 16",
      icon: "Target",
      unlocked: false,
    },
  ]);

  // Données pour le graphique de progression
  const progressData = [
    { month: "Sept", math: 14, physics: 13, average: 13.5 },
    { month: "Oct", math: 15, physics: 14, average: 14.5 },
    { month: "Nov", math: 16, physics: 15, average: 15.5 },
    { month: "Déc", math: 15, physics: 16, average: 15.5 },
    { month: "Jan", math: 17, physics: 15, average: 16 },
    { month: "Fév", math: 18, physics: 16, average: 17 },
  ];

  // Données pour le radar des compétences
  const skillData = [
    { subject: "Mathématiques", score: 90, fullMark: 100 },
    { subject: "Physique", score: 85, fullMark: 100 },
    { subject: "Français", score: 75, fullMark: 100 },
    { subject: "Histoire", score: 80, fullMark: 100 },
    { subject: "Anglais", score: 70, fullMark: 100 },
    { subject: "Philosophie", score: 65, fullMark: 100 },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const calculateAverage = () => {
    const total = grades.reduce((sum, g) => sum + g.grade * g.coefficient, 0);
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0);
    return (total / totalCoefficient).toFixed(2);
  };

  const SubjectCard = ({ subject }: { subject: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{subject.subject}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">Coeff {subject.coefficient}</Badge>
                <Badge
                  variant={
                    subject.rank === 1
                      ? "default"
                      : subject.rank <= 3
                      ? "secondary"
                      : "outline"
                  }
                >
                  {subject.rank === 1 ? "1er" : `${subject.rank}ème`}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{subject.grade}/20</div>
            <div className="text-sm text-muted-foreground">
              Moyenne: {subject.average}/20
            </div>
          </div>
        </div>
        <Progress value={(subject.grade / 20) * 100} className="h-2 mt-3" />
      </CardContent>
    </Card>
  );

  const AssignmentCard = ({ assignment }: { assignment: any }) => (
    <div
      className={`p-4 border rounded-lg ${
        assignment.status === "overdue"
          ? "border-red-200 bg-red-50"
          : assignment.status === "submitted"
          ? "border-green-200 bg-green-50"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                assignment.status === "overdue"
                  ? "destructive"
                  : assignment.status === "submitted"
                  ? "default"
                  : "outline"
              }
            >
              {assignment.subject}
            </Badge>
            {assignment.status === "overdue" && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <h4 className="font-medium mt-1">{assignment.title}</h4>
          <p className="text-sm text-muted-foreground">
            À rendre le {assignment.dueDate}
          </p>
        </div>
        <Button
          size="sm"
          variant={
            assignment.status === "overdue"
              ? "destructive"
              : assignment.status === "submitted"
              ? "outline"
              : "default"
          }
        >
          {assignment.status === "overdue"
            ? "En retard"
            : assignment.status === "submitted"
            ? "Soumis"
            : "À faire"}
        </Button>
      </div>
    </div>
  );

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <div
      className={`p-4 border rounded-lg flex items-center gap-3 ${
        achievement.unlocked
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div
        className={`p-2 rounded-full ${
          achievement.unlocked ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        {achievement.icon === "Trophy" && (
          <Trophy
            className={`h-5 w-5 ${
              achievement.unlocked ? "text-green-600" : "text-gray-400"
            }`}
          />
        )}
        {achievement.icon === "CheckCircle" && (
          <CheckCircle
            className={`h-5 w-5 ${
              achievement.unlocked ? "text-green-600" : "text-gray-400"
            }`}
          />
        )}
        {achievement.icon === "Users" && (
          <Users
            className={`h-5 w-5 ${
              achievement.unlocked ? "text-green-600" : "text-gray-400"
            }`}
          />
        )}
        {achievement.icon === "Target" && (
          <Target
            className={`h-5 w-5 ${
              achievement.unlocked ? "text-green-600" : "text-gray-400"
            }`}
          />
        )}
      </div>
      <div>
        <h4 className="font-medium">{achievement.title}</h4>
        <p className="text-sm text-muted-foreground">
          {achievement.description}
        </p>
      </div>
      {achievement.unlocked && (
        <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec informations étudiant */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {user?.firstName} !
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{currentGrade}</Badge>
            <Badge variant="secondary">{currentSemester}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              Moyenne générale: {calculateAverage()}/20
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Mes documents
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            Mon bulletin
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
                  Moyenne générale
                </p>
                <p className="text-2xl font-bold">{calculateAverage()}/20</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.5 depuis le dernier DS
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Classement
                </p>
                <p className="text-2xl font-bold">3ème/35</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Top 9% de la classe
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Devoirs à faire
                </p>
                <p className="text-2xl font-bold">
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
                <div className="text-sm text-muted-foreground mt-1">
                  Dont 1 en retard
                </div>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prochain cours
                </p>
                <p className="text-2xl font-bold">8h00</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Mathématiques - A201
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de progression */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression des notes</CardTitle>
            <CardDescription>Évolution sur l'année scolaire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
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
                    dataKey="average"
                    stroke="#ffc658"
                    strokeWidth={3}
                    name="Moyenne générale"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil des compétences</CardTitle>
            <CardDescription>Niveau par matière</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                    name="Compétences"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matières et notes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes matières et notes</CardTitle>
          <CardDescription>Résultats du {currentSemester}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grades.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Objectif du trimestre
                </h4>
                <p className="text-sm text-muted-foreground">
                  Atteindre une moyenne générale de 16/20
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {calculateAverage()}/20
                </div>
                <Progress
                  value={(parseFloat(calculateAverage()) / 16) * 100}
                  className="h-2 w-32 mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emploi du temps et travaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emploi du temps */}
        <Card>
          <CardHeader>
            <CardTitle>Mon emploi du temps</CardTitle>
            <CardDescription>Cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{course.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.day} • {course.time} • {course.room}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.teacher}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              Voir l'emploi du temps complet
            </Button>
          </CardContent>
        </Card>

        {/* Travaux et devoirs */}
        <Card>
          <CardHeader>
            <CardTitle>Travaux et devoirs</CardTitle>
            <CardDescription>À rendre prochainement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium flex items-center mb-2">
                <HelpCircle className="h-4 w-4 mr-2 text-yellow-600" />
                Besoin d'aide ?
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Consultez les ressources ou contactez un professeur
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Ressources
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Demander aide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Réussites et objectifs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mes réussites */}
        <Card>
          <CardHeader>
            <CardTitle>Mes réussites</CardTitle>
            <CardDescription>Objectifs atteints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">Progression globale</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Objectifs atteints</span>
                    <span className="text-sm font-medium">3/4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Taux de réussite</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>
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
                <span className="text-sm">Mon bulletin</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-sm">Emploi du temps</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Download className="h-5 w-5 mb-2" />
                <span className="text-sm">Documents cours</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="text-sm">Messagerie</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Bell className="h-5 w-5 mb-2" />
                <span className="text-sm">Annonces</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <HelpCircle className="h-5 w-5 mb-2" />
                <span className="text-sm">Aide</span>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Prochain examen</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Mathématiques - Bac Blanc</p>
                  <p className="text-sm text-muted-foreground">
                    25 Mars 2024 • 8h-12h
                  </p>
                </div>
                <Badge variant="destructive">Dans 10 jours</Badge>
              </div>
              <Button className="w-full mt-3">Réviser maintenant</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
