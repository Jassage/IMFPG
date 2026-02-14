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
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { useStudentStore } from "@/store/studentStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SecretaryDashboard = () => {
  const { toast } = useToast();
  const { students, fetchStudents } = useStudentStore();
  const { enrollments, fetchEnrollments } = useEnrollmentStore();

  const [loading, setLoading] = useState(false);
  const [todayDate] = useState(new Date());
  const [monthStart] = useState(
    new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );

  // Statistiques d'inscriptions
  const [enrollmentStats, setEnrollmentStats] = useState<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    activeStudents: number;
    byClass: Record<string, number>;
  }>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    activeStudents: 0,
    byClass: {} as Record<string, number>,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateEnrollmentStats();
  }, [students, enrollments]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStudents(), fetchEnrollments()]);

      toast({
        title: "Données chargées",
        description: "Les statistiques ont été mises à jour",
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

  const calculateEnrollmentStats = () => {
    // Helper function to check if date is today
    const isToday = (date) => {
      const checkDate = new Date(date);
      return (
        checkDate.getDate() === todayDate.getDate() &&
        checkDate.getMonth() === todayDate.getMonth() &&
        checkDate.getFullYear() === todayDate.getFullYear()
      );
    };

    // Helper function to check if date is this week
    const isThisWeek = (date) => {
      const checkDate = new Date(date);
      const startOfWeek = new Date(todayDate);
      startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return checkDate >= startOfWeek && checkDate <= endOfWeek;
    };

    // Helper function to check if date is this month
    const isThisMonth = (date) => {
      const checkDate = new Date(date);
      return (
        checkDate.getMonth() === todayDate.getMonth() &&
        checkDate.getFullYear() === todayDate.getFullYear()
      );
    };

    // Calcul des statistiques
    const todayCount = enrollments.filter((enrollment) =>
      isToday(enrollment.enrollmentDate)
    ).length;

    const thisWeekCount = enrollments.filter((enrollment) =>
      isThisWeek(enrollment.enrollmentDate)
    ).length;

    const thisMonthCount = enrollments.filter((enrollment) =>
      isThisMonth(enrollment.enrollmentDate)
    ).length;

    // Statistiques par statut
    const pendingCount = enrollments.filter(
      (enrollment) => enrollment.status === "Active"
    ).length;

    const approvedCount = enrollments.filter(
      (enrollment) => enrollment.status === "Completed"
    ).length;

    const rejectedCount = enrollments.filter(
      (enrollment) => enrollment.status === "Suspended"
    ).length;

    // Étudiants actifs
    const activeStudents = students.filter(
      (student) => student.status === "Active"
    ).length;

    // Répartition par classe
    const byClass: Record<string, number> = {};
    enrollments.forEach((enrollment) => {
      const className = enrollment.schoolClass?.name || "Non assigné";
      byClass[className] = (byClass[className] || 0) + 1;
    });

    setEnrollmentStats({
      today: todayCount,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      total: enrollments.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      activeStudents: activeStudents,
      byClass,
    });
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "primary",
    trend,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    trend?: "up" | "down" | "neutral";
    subtitle?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <Badge
                  variant="outline"
                  className={
                    trend === "up"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : trend === "down"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      trend === "up"
                        ? "text-green-600"
                        : trend === "down"
                        ? "text-red-600 rotate-180"
                        : "text-gray-600"
                    }`}
                  />
                  {trend === "up" ? "+12%" : trend === "down" ? "-5%" : "0%"}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
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
                : color === "destructive"
                ? "bg-red-100"
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
                  : color === "destructive"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatusCard = ({ status, count, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                color === "warning"
                  ? "bg-yellow-100"
                  : color === "success"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  color === "warning"
                    ? "text-yellow-600"
                    : color === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">{status}</p>
              <p className="text-sm text-muted-foreground">Inscriptions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">
              {((count / enrollmentStats.total) * 100 || 0).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Formatage de la date
  const formattedToday = format(todayDate, "EEEE dd MMMM yyyy", { locale: fr });
  const formattedMonth = format(todayDate, "MMMM yyyy", { locale: fr });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Statistiques d'Inscriptions
          </h1>
          <p className="text-muted-foreground">
            {formattedToday.charAt(0).toUpperCase() + formattedToday.slice(1)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aujourd'hui"
          value={enrollmentStats.today}
          icon={Calendar}
          color="primary"
          trend="up"
          subtitle={`${formattedToday}`}
        />
        <StatCard
          title="Cette semaine"
          value={enrollmentStats.thisWeek}
          icon={TrendingUp}
          color="success"
          trend="up"
          subtitle="Derniers 7 jours"
        />
        <StatCard
          title="Ce mois"
          value={enrollmentStats.thisMonth}
          icon={Users}
          color="blue"
          subtitle={`${formattedMonth}`}
        />
        <StatCard
          title="Total inscriptions"
          value={enrollmentStats.total}
          icon={UserPlus}
          color="warning"
          subtitle={`${enrollmentStats.activeStudents} étudiants actifs`}
        />
      </div>

      {/* Répartition par classe */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par classe</CardTitle>
          <CardDescription>Nombre d'inscriptions par niveau</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(enrollmentStats.byClass).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(enrollmentStats.byClass)
                .sort(([, a], [, b]) => Number(b) - Number(a))
                .map(([className, count]) => (
                  <div key={className} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="font-medium">{className}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {count} inscription{count > 1 ? "s" : ""}
                        </span>
                        <span className="text-sm font-medium">
                          {((count / enrollmentStats.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(count / enrollmentStats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune donnée de classe disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé mensuel */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Résumé du mois</CardTitle>
            <CardDescription>
              Chiffres clés pour {formattedMonth}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Nouvelles inscriptions</p>
                  <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {enrollmentStats.thisMonth}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Taux d'approbation</p>
                  <p className="text-sm text-muted-foreground">
                    Approuvées / Total
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {enrollmentStats.total > 0
                    ? (
                        (enrollmentStats.approved / enrollmentStats.total) *
                        100
                      ).toFixed(1) + "%"
                    : "0%"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Moyenne quotidienne</p>
                  <p className="text-sm text-muted-foreground">
                    Inscriptions par jour
                  </p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {(enrollmentStats.thisMonth / todayDate.getDate()).toFixed(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>Tendances et comparaisons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Taux de croissance</p>
                    <p className="text-sm text-muted-foreground">
                      Mois dernier
                    </p>
                  </div>
                </div>
                <span className="text-green-600 font-bold">+12.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Temps moyen de traitement</p>
                    <p className="text-sm text-muted-foreground">En attente</p>
                  </div>
                </div>
                <span className="font-bold">2.3 jours</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Conversion</p>
                    <p className="text-sm text-muted-foreground">
                      Inscriptions → Actifs
                    </p>
                  </div>
                </div>
                <span className="font-bold">
                  {students.length > 0
                    ? (
                        (enrollmentStats.activeStudents / students.length) *
                        100
                      ).toFixed(1) + "%"
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
