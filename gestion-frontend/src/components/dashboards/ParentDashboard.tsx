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
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Eye,
  ChevronRight,
  Star,
  Award,
  Bookmark,
  Bell,
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
} from "recharts";

const ParentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Jean Dupont",
      grade: "Terminale",
      status: "active",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Marie Dupont",
      grade: "Première",
      status: "active",
      avatar: "MD",
    },
  ]);

  const [grades, setGrades] = useState([
    {
      id: 1,
      child: "Jean Dupont",
      subject: "Mathématiques",
      grade: 18,
      average: 15,
      date: "2024-03-15",
    },
    {
      id: 2,
      child: "Jean Dupont",
      subject: "Physique",
      grade: 16,
      average: 14,
      date: "2024-03-14",
    },
    {
      id: 3,
      child: "Marie Dupont",
      subject: "Français",
      grade: 15,
      average: 13,
      date: "2024-03-13",
    },
    {
      id: 4,
      child: "Marie Dupont",
      subject: "Histoire",
      grade: 17,
      average: 16,
      date: "2024-03-12",
    },
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, child: "Jean Dupont", date: "2024-03-15", status: "present" },
    { id: 2, child: "Jean Dupont", date: "2024-03-14", status: "absent" },
    { id: 3, child: "Marie Dupont", date: "2024-03-15", status: "present" },
    { id: 4, child: "Marie Dupont", date: "2024-03-14", status: "late" },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      child: "Jean Dupont",
      amount: 50000,
      dueDate: "2024-03-20",
      status: "paid",
    },
    {
      id: 2,
      child: "Jean Dupont",
      amount: 25000,
      dueDate: "2024-04-20",
      status: "pending",
    },
    {
      id: 3,
      child: "Marie Dupont",
      amount: 50000,
      dueDate: "2024-03-20",
      status: "paid",
    },
    {
      id: 4,
      child: "Marie Dupont",
      amount: 25000,
      dueDate: "2024-04-20",
      status: "pending",
    },
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Réunion parents-professeurs",
      date: "2024-03-20",
      priority: "high",
    },
    {
      id: 2,
      title: "Vacances de printemps",
      date: "2024-04-01",
      priority: "medium",
    },
    {
      id: 3,
      title: "Journée portes ouvertes",
      date: "2024-03-25",
      priority: "low",
    },
  ]);

  // Données pour le graphique de progression
  const progressData = [
    { month: "Sept", math: 14, french: 12, physics: 13 },
    { month: "Oct", math: 15, french: 13, physics: 14 },
    { month: "Nov", math: 16, french: 14, physics: 15 },
    { month: "Déc", math: 15, french: 15, physics: 16 },
    { month: "Jan", math: 17, french: 14, physics: 15 },
    { month: "Fév", math: 18, french: 15, physics: 16 },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const ChildCard = ({ child }: { child: any }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">{child.avatar}</span>
            </div>
            <div>
              <h3 className="font-semibold">{child.name}</h3>
              <p className="text-sm text-muted-foreground">{child.grade}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={child.status === "active" ? "default" : "secondary"}
                >
                  {child.status === "active" ? "Actif" : "Inactif"}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  Moyenne: 16.5/20
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const GradeCard = ({ grade }: { grade: any }) => (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{grade.subject}</span>
              <Badge variant="outline">{grade.child}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <span className="text-2xl font-bold">{grade.grade}/20</span>
                <p className="text-xs text-muted-foreground">Note de l'élève</p>
              </div>
              <div>
                <span className="text-lg">{grade.average}/20</span>
                <p className="text-xs text-muted-foreground">Moyenne classe</p>
              </div>
              <div>
                <span className="text-lg">
                  {grade.grade > grade.average ? "+" : ""}
                  {(grade.grade - grade.average).toFixed(1)}
                </span>
                <p className="text-xs text-muted-foreground">Différence</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{grade.date}</p>
            <Badge
              variant={
                grade.grade >= 16
                  ? "default"
                  : grade.grade >= 12
                  ? "outline"
                  : "destructive"
              }
            >
              {grade.grade >= 16
                ? "Excellent"
                : grade.grade >= 12
                ? "Satisfaisant"
                : "À améliorer"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AttendanceBadge = ({ status }: { status: string }) => {
    const config = {
      present: {
        label: "Présent",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      absent: {
        label: "Absent",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      late: {
        label: "Retard",
        variant: "outline" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
    };

    const { label, variant, color } =
      config[status as keyof typeof config] || config.present;

    return (
      <Badge variant={variant} className={color}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec salutation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {user?.firstName} !
          </h1>
          <p className="text-muted-foreground">
            Suivez la scolarité de vos enfants en temps réel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contacter l'école
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            Voir tous les bulletins
          </Button>
        </div>
      </div>

      {/* Mes enfants */}
      <Card>
        <CardHeader>
          <CardTitle>Mes enfants</CardTitle>
          <CardDescription>Suivi individuel de chaque enfant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Moyenne générale
                </p>
                <p className="text-2xl font-bold">16.5/20</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.2 depuis le trimestre dernier
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
                  Taux de présence
                </p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />3 absences ce mois
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
                  Paiements en attente
                </p>
                <p className="text-2xl font-bold">2</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Total: 50,000 HTG
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
                  Annonces non lues
                </p>
                <p className="text-2xl font-bold">{announcements.length}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Dont 1 importante
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de progression */}
      <Card>
        <CardHeader>
          <CardTitle>Progression académique</CardTitle>
          <CardDescription>Évolution des moyennes par matière</CardDescription>
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
                  dataKey="french"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Français"
                />
                <Line
                  type="monotone"
                  dataKey="physics"
                  stroke="#ffc658"
                  strokeWidth={2}
                  name="Physique"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dernières notes et présences */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dernières notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dernières notes</CardTitle>
                <CardDescription>Évaluations récentes</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map((grade) => (
                <GradeCard key={grade.id} grade={grade} />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toutes les notes
            </Button>
          </CardContent>
        </Card>

        {/* Présences récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Présences récentes</CardTitle>
            <CardDescription>Suivi de l'assiduité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{record.child}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.date}
                      </p>
                    </div>
                  </div>
                  <AttendanceBadge status={record.status} />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Statistiques de présence</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Taux de présence global</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Retards ce mois</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Absences justifiées</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paiements et annonces */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Paiements */}
        <Card>
          <CardHeader>
            <CardTitle>Paiements et frais</CardTitle>
            <CardDescription>Suivi des paiements de scolarité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.child}</p>
                    <p className="text-sm text-muted-foreground">
                      Échéance: {payment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {payment.amount.toLocaleString()} HTG
                    </p>
                    <Badge
                      variant={
                        payment.status === "paid" ? "default" : "destructive"
                      }
                    >
                      {payment.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Award className="h-4 w-4 mr-2 text-blue-600" />
                Paiement en ligne disponible
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Payez les frais de scolarité en ligne de manière sécurisée
              </p>
              <Button className="w-full">Payer maintenant</Button>
            </div>
          </CardContent>
        </Card>

        {/* Annonces */}
        <Card>
          <CardHeader>
            <CardTitle>Annonces de l'école</CardTitle>
            <CardDescription>Informations importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 border rounded-lg ${
                    announcement.priority === "high"
                      ? "border-l-4 border-l-red-500 bg-red-50"
                      : announcement.priority === "medium"
                      ? "border-l-4 border-l-yellow-500 bg-yellow-50"
                      : "border-l-4 border-l-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Date: {announcement.date}
                      </p>
                    </div>
                    {announcement.priority === "high" && (
                      <Badge variant="destructive">Important</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir détails
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Ajouter au calendrier
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Communication avec l'école
              </h4>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctions fréquentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <FileText className="h-5 w-5 mb-2" />
              <span className="text-sm">Voir bulletins</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <Calendar className="h-5 w-5 mb-2" />
              <span className="text-sm">Calendrier scolaire</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <Download className="h-5 w-5 mb-2" />
              <span className="text-sm">Télécharger documents</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <MessageSquare className="h-5 w-5 mb-2" />
              <span className="text-sm">Contacter professeur</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;
