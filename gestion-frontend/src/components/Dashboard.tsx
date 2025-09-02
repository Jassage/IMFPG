import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  BarChart3,
  Eye,
  Download,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart,
  Target,
  ChevronDown,
} from "lucide-react";
import { useAcademicStore } from "../store/academicStore";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types pour les données académiques
interface AcademicYearData {
  year: string;
  students: any[];
  ues: any[];
  grades: any[];
  retakes: any[];
}

// Fonction pour déterminer l'année académique basée sur une date
const getAcademicYear = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Janvier = 1, Décembre = 12

  // Si le mois est entre septembre (9) et décembre (12), l'année académique est année-année+1
  // Si le mois est entre janvier (1) et août (8), l'année académique est année-1-année
  if (month >= 9) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

// Fonction pour obtenir les dates de début et fin d'une année académique
const getAcademicYearDates = (
  academicYear: string
): { start: Date; end: Date } => {
  const [startYear] = academicYear.split("-").map(Number);
  return {
    start: new Date(startYear, 8, 1), // 1er septembre
    end: new Date(startYear + 1, 7, 31), // 31 août
  };
};

// Fonction pour vérifier si une date est dans l'année académique
const isInAcademicYear = (date: Date, academicYear: string): boolean => {
  const { start, end } = getAcademicYearDates(academicYear);
  return date >= start && date <= end;
};

export const Dashboard = () => {
  const { students, ues, grades, retakes } = useAcademicStore();
  const [selectedYear, setSelectedYear] = useState(getAcademicYear(new Date()));
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );

  // Générer les années académiques disponibles (5 dernières années)
  const academicYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - i;
      return `${year - 1}-${year}`;
    }).reverse();
  }, []);

  // Filtrer les données par année académique
  const filterByAcademicYear = (data: any[], academicYear: string): any[] => {
    return data.filter((item) => {
      // Supposons que vos données ont un champ createdAt ou academicYear
      const itemDate = item.createdAt ? new Date(item.createdAt) : new Date();
      return isInAcademicYear(itemDate, academicYear);
    });
  };

  // Données filtrées par année académique
  const yearData: AcademicYearData = useMemo(
    () => ({
      year: selectedYear,
      students: filterByAcademicYear(students, selectedYear),
      ues: filterByAcademicYear(ues, selectedYear),
      grades: filterByAcademicYear(grades, selectedYear),
      retakes: filterByAcademicYear(retakes, selectedYear),
    }),
    [students, ues, grades, retakes, selectedYear]
  );

  // Calculs des statistiques pour l'année sélectionnée
  const totalStudents = yearData.students.length;
  const activeStudents = yearData.students.filter(
    (s) => s.status === "Active"
  ).length;
  const graduatedStudents = yearData.students.filter(
    (s) => s.status === "Graduated"
  ).length;
  const studentsWithRetakes = yearData.students.filter((s) => {
    const studentGrades = yearData.grades.filter((g) => g.studentId === s.id);
    return studentGrades.some((g) => g.status === "À reprendre");
  }).length;

  const totalUEs = yearData.ues.length;
  const totalGrades = yearData.grades.length;
  const passedGrades = yearData.grades.filter(
    (g) => g.status === "Validé"
  ).length;
  const failedGrades = yearData.grades.filter(
    (g) => g.status === "À reprendre"
  ).length;

  const successRate =
    totalGrades > 0 ? Math.round((passedGrades / totalGrades) * 100) : 0;
  const retakeRate =
    totalStudents > 0
      ? Math.round((studentsWithRetakes / totalStudents) * 100)
      : 0;

  // Nouvelles statistiques
  const averageGrade =
    totalGrades > 0
      ? (
          yearData.grades.reduce(
            (sum: number, grade: any) => sum + (grade.score || 0),
            0
          ) / totalGrades
        ).toFixed(1)
      : "0.0";

  // Répartition des UE par type
  const ueByType: Record<string, number> = yearData.ues.reduce(
    (acc: Record<string, number>, ue: any) => {
      const currentType = ue.type || "Inconnu";
      acc[currentType] = (acc[currentType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Dates de l'année académique
  const academicYearDates = getAcademicYearDates(selectedYear);
  const formattedStartDate = academicYearDates.start.toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
  const formattedEndDate = academicYearDates.end.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const quickStats = [
    {
      title: "Étudiants Actifs",
      value: activeStudents,
      total: totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12%",
      change: "positive",
    },
    {
      title: "Unités d'Enseignement",
      value: totalUEs,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+3%",
      change: "positive",
    },
    {
      title: "Diplômés",
      value: graduatedStudents,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+8%",
      change: "positive",
    },
    {
      title: "Reprises",
      value: studentsWithRetakes,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "-5%",
      change: "negative",
    },
  ];

  const recentActivities = [
    {
      type: "inscription",
      title: "Nouveaux étudiants inscrits",
      description: `${activeStudents} étudiants actifs cette année`,
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      time: "Aujourd'hui",
    },
    {
      type: "ue",
      title: "Unités d'enseignement mises à jour",
      description: `${totalUEs} UE disponibles`,
      icon: BookOpen,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      time: "Cette semaine",
    },
    {
      type: "grades",
      title: "Notes enregistrées",
      description: `${totalGrades} évaluations complétées`,
      icon: Award,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      time: "Hier",
    },
  ];

  if (studentsWithRetakes > 0) {
    recentActivities.push({
      type: "retakes",
      title: "Reprises programmées",
      description: `${studentsWithRetakes} étudiants concernés`,
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      time: "À traiter",
    });
  }

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard avec sélecteur d'année */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble pour l'année académique {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélecteur d'année académique */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {selectedYear}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {academicYears.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={selectedYear === year ? "bg-accent" : ""}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex bg-muted rounded-lg p-1">
            {["week", "month", "year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className="text-xs"
              >
                {range === "week"
                  ? "Semaine"
                  : range === "month"
                  ? "Mois"
                  : "Année"}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Indicateur d'année académique avec dates */}
      <div className="bg-muted/50 rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Année Académique {selectedYear}</h3>
              <p className="text-sm text-muted-foreground">
                Du {formattedStartDate} au {formattedEndDate}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {timeRange === "week"
              ? "Vue semaine"
              : timeRange === "month"
              ? "Vue mois"
              : "Vue année"}
          </Badge>
        </div>
      </div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline space-x-2 mb-2">
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      {stat.total && (
                        <span className="text-sm text-muted-foreground">
                          / {stat.total}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp
                        className={`h-3 w-3 ${
                          stat.change === "positive"
                            ? "text-green-500"
                            : "text-red-500"
                        } mr-1`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          stat.change === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cartes de performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Taux de Réussite
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Moyenne: {averageGrade}/20
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    {successRate}%
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {passedGrades} validés
                    </div>
                    <div className="text-xs text-muted-foreground">
                      sur {totalGrades}
                    </div>
                  </div>
                </div>
                <Progress value={successRate} className="h-3 bg-muted" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Taux de Reprises
                </CardTitle>
                <Badge variant="destructive" className="text-xs">
                  {studentsWithRetakes}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-600">
                    {retakeRate}%
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {studentsWithRetakes} étudiants
                    </div>
                    <div className="text-xs text-muted-foreground">
                      concernés
                    </div>
                  </div>
                </div>
                <Progress value={retakeRate} className="h-3 bg-muted" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique de répartition */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieChart className="h-4 w-4 text-blue-600" />
                Répartition des UE {selectedYear}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Filter className="h-3 w-3" />
                Filtre
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {Object.entries(ueByType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            type === "Obligatoire"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <Badge variant="secondary">{String(count)}</Badge>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalUEs}</div>
                        <div className="text-xs text-muted-foreground">
                          Total UE
                        </div>
                      </div>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {Object.entries(ueByType).map(([type, count], index) => {
                        const percentage = ((count as number) / totalUEs) * 100;
                        const offset = index === 0 ? 0 : 25;
                        return (
                          <circle
                            key={type}
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke={
                              type === "Obligatoire" ? "#3b82f6" : "#10b981"
                            }
                            strokeWidth="10"
                            strokeDasharray={`${percentage} ${
                              100 - percentage
                            }`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 50 50)"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Activités */}
        <div className="space-y-6">
          {/* Activités récentes */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Activités {selectedYear}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${activity.bgColor} mt-1`}>
                      <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-nowrap"
                    >
                      {activity.time}
                    </Badge>
                  </div>
                );
              })}

              <Button variant="ghost" className="w-full justify-between mt-2">
                Voir toutes les activités
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Période académique */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Période Académique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Début:</span>
                  <span className="font-medium">{formattedStartDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fin:</span>
                  <span className="font-medium">{formattedEndDate}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Jours restants:
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.ceil(
                        (academicYearDates.end.getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      jours
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Résumé de l'année */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Bilan {selectedYear}
              </h3>
              <p className="text-muted-foreground">
                {graduatedStudents > 0
                  ? `${graduatedStudents} étudiants diplômés cette année académique`
                  : "Aucun diplôme délivré cette année académique"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Période: {formattedStartDate} - {formattedEndDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" className="gap-2">
                <Download className="h-4 w-4" />
                Rapport Annuel
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Comparer les années
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
