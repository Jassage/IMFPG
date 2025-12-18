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
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  Award,
  BarChart3,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  ExternalLink,
  Globe,
  Target,
  PieChart as PieChartIcon,
  Calendar,
  MessageSquare,
  Shield,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  AreaChart,
  Area,
} from "recharts";
import useStudentStore from "@/store/studentStore";

const DirectorDashboard = () => {
  const { toast } = useToast();
  const { students, fetchStudents } = useStudentStore();
  // const { payments, fetchPayments } = usePaymentStore();

  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    totalStudents: 0,
    // totalRevenue: 0,
    retentionRate: 95,
    satisfactionRate: 92,
    graduationRate: 88,
    enrollmentGrowth: 12,
  });

  const [financials, setFinancials] = useState({
    // revenue: 0,
    // expenses: 0,
    // profit: 0,
    budgetUtilization: 75,
    // pendingPayments: 0,
  });

  const [strategicInitiatives, setStrategicInitiatives] = useState([
    {
      id: 1,
      title: "Accréditation internationale",
      progress: 80,
      deadline: "2024-06-30",
      status: "on-track",
    },
    {
      id: 2,
      title: "Construction nouveau bâtiment",
      progress: 45,
      deadline: "2024-12-31",
      status: "delayed",
    },
    {
      id: 3,
      title: "Programme de bourses",
      progress: 95,
      deadline: "2024-04-30",
      status: "completed",
    },
    {
      id: 4,
      title: "Digitalisation campus",
      progress: 60,
      deadline: "2024-09-30",
      status: "on-track",
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "financial",
      title: "Dépassement budgétaire",
      description: "Faculté des Sciences",
      priority: "high",
    },
    {
      id: 2,
      type: "academic",
      title: "Taux d'échec élevé",
      description: "Licence 1 Informatique",
      priority: "medium",
    },
    {
      id: 3,
      type: "infrastructure",
      title: "Maintenance urgente",
      description: "Bâtiment A - Salle 201",
      priority: "high",
    },
    {
      id: 4,
      type: "personnel",
      title: "Recrutement nécessaire",
      description: "Poste professeur Mathématiques",
      priority: "low",
    },
  ]);

  // Données pour les graphiques
  const enrollmentTrendData = [
    { year: "2019", students: 1200 },
    { year: "2020", students: 1350 },
    { year: "2021", students: 1500 },
    { year: "2022", students: 1650 },
    { year: "2023", students: 1800 },
    { year: "2024", students: 2000 },
  ];

  const revenueExpenseData = [
    { month: "Jan", revenue: 5000000, expenses: 4500000 },
    { month: "Fév", revenue: 5200000, expenses: 4600000 },
    { month: "Mar", revenue: 5500000, expenses: 4700000 },
    { month: "Avr", revenue: 5800000, expenses: 4800000 },
    { month: "Mai", revenue: 6000000, expenses: 4900000 },
    { month: "Juin", revenue: 6200000, expenses: 5000000 },
  ];

  const facultyDistributionData = [
    { name: "Sciences", students: 800, color: "#0088FE" },
    { name: "Lettres", students: 450, color: "#00C49F" },
    { name: "Commerce", students: 400, color: "#FFBB28" },
    { name: "Droit", students: 250, color: "#FF8042" },
    { name: "Arts", students: 100, color: "#8884d8" },
  ];

  const performanceMetricsData = [
    { metric: "Taux de réussite", value: 88, target: 90 },
    { metric: "Satisfaction étudiants", value: 92, target: 95 },
    { metric: "Employabilité", value: 85, target: 90 },
    { metric: "Recherche", value: 78, target: 85 },
    { metric: "International", value: 65, target: 75 },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // await Promise.all([fetchStudents(), fetchPayments()]);

      // Calculer les KPI
      const totalStudents = students.length;
      // const totalRevenue = payments.reduce(
      //   (sum, p) => sum + (p.amount || 0),
      //   0
      // );
      // const revenue = totalRevenue;
      // const expenses = revenue * 0.7; // Estimation
      // const profit = revenue - expenses;
      // const pendingPayments = payments.filter(
      //   (p) => p.status === "Payé"
      // ).length;

      setKpis({
        totalStudents,
        // totalRevenue,
        retentionRate: 95,
        satisfactionRate: 92,
        graduationRate: 88,
        enrollmentGrowth: 12,
      });

      setFinancials({
        // revenue,
        // expenses,
        // profit,
        budgetUtilization: 75,
        // pendingPayments,
      });

      toast({
        title: "Données actualisées",
        description: "Les indicateurs ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const KpiCard = ({
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center text-sm mt-2">
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={trend >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {trend >= 0 ? "+" : ""}
                  {trend}%
                </span>
                <span className="text-muted-foreground ml-2">
                  vs l'an dernier
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-full ${
              color === "primary"
                ? "bg-primary/10"
                : color === "success"
                ? "bg-green-100"
                : color === "warning"
                ? "bg-yellow-100"
                : "bg-blue-100"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                color === "primary"
                  ? "text-primary"
                  : color === "success"
                  ? "text-green-600"
                  : color === "warning"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            />
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-3">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const InitiativeCard = ({ initiative }: { initiative: any }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "on-track":
          return "bg-blue-100 text-blue-800";
        case "delayed":
          return "bg-yellow-100 text-yellow-800";
        case "at-risk":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case "completed":
          return "Terminé";
        case "on-track":
          return "Dans les temps";
        case "delayed":
          return "Retardé";
        case "at-risk":
          return "À risque";
        default:
          return "En cours";
      }
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{initiative.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Échéance: {initiative.deadline}
              </p>
            </div>
            <Badge className={getStatusColor(initiative.status)}>
              {getStatusLabel(initiative.status)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Progression</span>
              <span className="text-sm font-medium">
                {initiative.progress}%
              </span>
            </div>
            <Progress value={initiative.progress} className="h-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AlertCard = ({ alert }: { alert: any }) => {
    const getPriorityIcon = (priority: string) => {
      switch (priority) {
        case "high":
          return <AlertCircle className="h-4 w-4 text-red-500" />;
        case "medium":
          return <Clock className="h-4 w-4 text-yellow-500" />;
        case "low":
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
          return <AlertCircle className="h-4 w-4" />;
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "border-red-200 bg-red-50";
        case "medium":
          return "border-yellow-200 bg-yellow-50";
        case "low":
          return "border-green-200 bg-green-50";
        default:
          return "border-gray-200 bg-gray-50";
      }
    };

    return (
      <div
        className={`p-4 border rounded-lg ${getPriorityColor(alert.priority)}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getPriorityIcon(alert.priority)}
            <div>
              <h4 className="font-medium">{alert.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {alert.description}
              </p>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord Direction
          </h1>
          <p className="text-muted-foreground">
            Vue stratégique et indicateurs institutionnels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            Actualiser les données
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
        </div>
      </div>

      {/* KPI Principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Étudiants inscrits"
          value={kpis.totalStudents.toLocaleString()}
          icon={Users}
          trend={kpis.enrollmentGrowth}
          description="Effectif total institution"
          color="primary"
        />
        <KpiCard
          title="Revenus annuels"
          value={`${(48 / 1000000).toFixed(1)}M HTG`}
          icon={DollarSign}
          trend={15}
          description="Chiffre d'affaires prévisionnel"
          color="success"
        />
        <KpiCard
          title="Taux de rétention"
          value={`${kpis.retentionRate}%`}
          icon={TrendingUp}
          trend={2}
          description="Étudiants réinscrits"
          color="warning"
        />
        <KpiCard
          title="Satisfaction"
          value={`${kpis.satisfactionRate}%`}
          icon={BarChart3}
          trend={3}
          description="Enquête étudiants 2024"
          color="info"
        />
        <KpiCard
          title="Taux de diplomation"
          value={`${kpis.graduationRate}%`}
          icon={Award}
          trend={1}
          description="Promotion 2023"
          color="primary"
        />
        <KpiCard
          title="Facultés"
          value={9}
          icon={Building2}
          trend={0}
          description="Départements actifs"
          color="success"
        />
      </div>

      {/* Graphiques stratégiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des effectifs</CardTitle>
            <CardDescription>Croissance sur 5 ans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} étudiants`, "Effectif"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Étudiants"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par faculté</CardTitle>
            <CardDescription>Distribution des effectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={facultyDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {facultyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} étudiants`, "Effectif"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finances */}
      <Card>
        <CardHeader>
          <CardTitle>Situation financière</CardTitle>
          <CardDescription>Revenus vs Dépenses 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${((value as number) / 1000000).toFixed(1)}M HTG`,
                      "Montant",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenus" fill="#4CAF50" />
                  <Bar dataKey="expenses" name="Dépenses" fill="#FF9800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(2000 / 1000000).toFixed(1)}M HTG
                      </div>
                      <p className="text-sm text-muted-foreground">Revenus</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {(897 / 1000000).toFixed(1)}M HTG
                      </div>
                      <p className="text-sm text-muted-foreground">Dépenses</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {(789 / 1000000).toFixed(1)}M HTG
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bénéfice net
                    </p>
                    <Progress value={75} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilisation du budget: 75%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div>
                    <h4 className="font-medium mb-2">Alertes financières</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Paiements en attente</span>
                        <Badge variant="destructive">{788}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Contrats à renouveler</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audits programmés</span>
                        <Badge variant="secondary">2</Badge>
                      </div>
                    </div>
                    <Button className="w-full mt-3" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir rapport financier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initiatives stratégiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Initiatives stratégiques</CardTitle>
              <CardDescription>
                Projets institutionnels en cours
              </CardDescription>
            </div>
            <Badge variant="outline">
              {
                strategicInitiatives.filter((i) => i.status === "completed")
                  .length
              }
              /{strategicInitiatives.length} terminés
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {strategicInitiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et indicateurs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alertes */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes et notifications</CardTitle>
            <CardDescription>
              Points nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Indicateurs de risque
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Risque académique</span>
                    <span className="text-sm font-medium">Moyen</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Risque financier</span>
                    <span className="text-sm font-medium">Faible</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Risque réputation</span>
                    <span className="text-sm font-medium">Faible</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicateurs de performance */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>Comparaison avec les objectifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetricsData.map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{metric.value}%</span>
                      <Badge
                        variant={
                          metric.value >= metric.target
                            ? "default"
                            : metric.value >= metric.target * 0.9
                            ? "outline"
                            : "destructive"
                        }
                      >
                        Objectif: {metric.target}%
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={(metric.value / metric.target) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-600" />
                Objectifs stratégiques 2024
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  Atteindre 2000 étudiants
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  90% de taux de réussite
                </li>
                <li className="flex items-center">
                  <Target className="h-3 w-3 text-blue-500 mr-2" />
                  Obtenir accréditation internationale
                </li>
                <li className="flex items-center">
                  <Target className="h-3 w-3 text-blue-500 mr-2" />
                  Lancer 2 nouveaux programmes
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides et communication */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Fonctions exécutives fréquentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <FileText className="h-5 w-5 mb-2" />
                <span className="text-sm">Rapport annuel</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="text-sm">Budget 2025</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-sm">Calendrier stratégique</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Users className="h-5 w-5 mb-2" />
                <span className="text-sm">Comité de direction</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Briefcase className="h-5 w-5 mb-2" />
                <span className="text-sm">Partenariats</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Globe className="h-5 w-5 mb-2" />
                <span className="text-sm">Relations internationales</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication institutionnelle</CardTitle>
            <CardDescription>Diffusion d'informations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Annonce importante</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Réunion du conseil d'administration le 25 Mars 2024
                </p>
                <Button size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Préparer l'annonce
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Prochain événement</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Journée portes ouvertes - 30 Mars 2024
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Détails
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Publier
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tableau de bord interactif
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Accédez aux indicateurs en temps réel
                </p>
                <Button size="sm" className="w-full">
                  Explorer les données
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectorDashboard;
