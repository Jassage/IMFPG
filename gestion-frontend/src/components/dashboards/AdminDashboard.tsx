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
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Shield,
  Building2,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAcademicYearStore } from "@/store/academicYearStore";
// import { useAcademicStore } from "@/store/studentStore";
// import { usePaymentStore } from "@/store/paymentStore";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAcademicStore } from "@/store/academicStore";
import useStudentStore from "@/store/studentStore";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { currentAcademicYear } = useAcademicYearStore();
  const { students } = useAcademicStore();
  // const { payments, fetchPayments } = ();

  const { fetchStudents } = useStudentStore();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    // totalPayments: 0,
    // revenue: 0,
    // pendingPayments: 0,
    enrollmentRate: 0,
    attendanceRate: 95,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "enrollment",
      description: "Nouvelle inscription - Jean Dupont",
      time: "10 min",
      user: "Secrétaire 1",
    },
    {
      id: 2,
      type: "payment",
      description: "Paiement reçu - Marie Curie",
      amount: 500,
      time: "30 min",
    },
    {
      id: 3,
      type: "grade",
      description: "Notes saisies - Mathématiques",
      professor: "Prof. Einstein",
      time: "1h",
    },
    {
      id: 4,
      type: "user",
      description: "Nouvel utilisateur créé",
      role: "Professeur",
      time: "2h",
    },
    {
      id: 5,
      type: "backup",
      description: "Sauvegarde automatique",
      status: "success",
      time: "4h",
    },
  ]);

  // Données pour les graphiques
  const enrollmentData = [
    { month: "Jan", count: 120 },
    { month: "Fév", count: 150 },
    { month: "Mar", count: 180 },
    { month: "Avr", count: 200 },
    { month: "Mai", count: 220 },
    { month: "Juin", count: 250 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 50000, expenses: 30000 },
    { month: "Fév", revenue: 55000, expenses: 32000 },
    { month: "Mar", revenue: 60000, expenses: 35000 },
    { month: "Avr", revenue: 65000, expenses: 38000 },
    { month: "Mai", revenue: 70000, expenses: 40000 },
    { month: "Juin", revenue: 75000, expenses: 42000 },
  ];

  const courseDistributionData = [
    { name: "Sciences", value: 35, color: "#0088FE" },
    { name: "Lettres", value: 25, color: "#00C49F" },
    { name: "Commerce", value: 20, color: "#FFBB28" },
    { name: "Droit", value: 15, color: "#FF8042" },
    { name: "Arts", value: 5, color: "#8884d8" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // await Promise.all([fetchStudents(), fetchPayments()]);

      // Calculer les statistiques
      const totalStudents = students.length;
      const activeStudents = 9;
      const totalCourses = 10;
      // const totalPayments = payments.length;
      // const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      // const pendingPayments = payments.filter(
      //   (p) => p.status === "Payé"
      // ).length;
      const enrollmentRate = Math.round(
        (activeStudents / Math.max(totalStudents, 1)) * 100
      );

      setStats({
        totalStudents,
        activeStudents,
        totalCourses,

        enrollmentRate,
        attendanceRate: 95,
      });
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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = "primary",
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: number;
    description?: string;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={`h-4 w-4 ${
            color === "primary"
              ? "text-primary"
              : color === "success"
              ? "text-green-600"
              : color === "warning"
              ? "text-yellow-600"
              : "text-blue-600"
          }`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center text-xs">
            <TrendingUp
              className={`h-3 w-3 mr-1 ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
            <span className={trend >= 0 ? "text-green-600" : "text-red-600"}>
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground ml-2">
              depuis le mois dernier
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord Administrateur
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du système - Année académique{" "}
            {currentAcademicYear?.year || "Non définie"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Alertes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Paiements en attente</p>
                <p className="text-2xl font-bold">{0}</p>
                <p className="text-xs text-muted-foreground">Action requise</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Notes à valider</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Sécurité système</p>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">
                  Tout est sécurisé
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Système opérationnel</p>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-muted-foreground">
                  Aucun problème détecté
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Étudiants actifs"
          value={stats.activeStudents}
          icon={Users}
          trend={12}
          description={`Sur ${stats.totalStudents} étudiants total`}
          color="primary"
        />
        <StatCard
          title="Cours disponibles"
          value={stats.totalCourses}
          icon={BookOpen}
          trend={8}
          description="Unités d'enseignement"
          color="success"
        />
        <StatCard
          title="Revenus totaux"
          value={`${0} HTG`}
          icon={DollarSign}
          trend={15}
          description={`${0} paiements enregistrés`}
          color="warning"
        />
        <StatCard
          title="Taux de présence"
          value={`${stats.attendanceRate}%`}
          icon={TrendingUp}
          trend={2}
          description="Moyenne institutionnelle"
          color="info"
        />
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>
              Nombre d'étudiants inscrits par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Inscriptions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par faculté</CardTitle>
            <CardDescription>Distribution des étudiants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Pourcentage"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenus vs Dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus vs Dépenses</CardTitle>
          <CardDescription>Évolution mensuelle des finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} HTG`, "Montant"]} />
                <Legend />
                <Bar dataKey="revenue" name="Revenus" fill="#4CAF50" />
                <Bar dataKey="expenses" name="Dépenses" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activités récentes et indicateurs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "enrollment"
                          ? "bg-blue-100"
                          : activity.type === "payment"
                          ? "bg-green-100"
                          : activity.type === "grade"
                          ? "bg-purple-100"
                          : activity.type === "user"
                          ? "bg-orange-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {activity.type === "enrollment" && (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === "payment" && (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "grade" && (
                        <FileText className="h-4 w-4 text-purple-600" />
                      )}
                      {activity.type === "user" && (
                        <GraduationCap className="h-4 w-4 text-orange-600" />
                      )}
                      {activity.type === "backup" && (
                        <Shield className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user && `Par ${activity.user} • `}
                        {activity.professor && `Par ${activity.professor} • `}
                        {activity.amount && `${activity.amount} HTG • `}
                        Il y a {activity.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>Statistiques clés du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Utilisation du stockage
                </span>
                <span className="text-sm">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                1.3 Go / 2 Go utilisés
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Taux de satisfaction
                </span>
                <span className="text-sm">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Basé sur 150 retours
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Temps de réponse API
                </span>
                <span className="text-sm">120ms</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne sur 24h
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Utilisateurs actifs</span>
                <span className="text-sm">48</span>
              </div>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Sur 60 utilisateurs totaux
              </p>
            </div>

            <Button className="w-full" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Voir plus de statistiques
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctions principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Gérer les étudiants</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Voir les finances</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span>Sécurité système</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>Générer rapports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
