
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Award
} from 'lucide-react';
import { useAcademicStore } from '../store/academicStore';

export const Dashboard = () => {
  const { students, ues, grades, retakes } = useAcademicStore();

  // Calculs des statistiques
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const graduatedStudents = students.filter(s => s.status === 'Graduated').length;
  const studentsWithRetakes = students.filter(s => {
    const studentGrades = grades.filter(g => g.studentId === s.id);
    return studentGrades.some(g => g.status === 'À reprendre');
  }).length;

  const totalUEs = ues.length;
  const totalGrades = grades.length;
  const passedGrades = grades.filter(g => g.status === 'Validé').length;
  const failedGrades = grades.filter(g => g.status === 'À reprendre').length;

  const successRate = totalGrades > 0 ? Math.round((passedGrades / totalGrades) * 100) : 0;
  const retakeRate = totalStudents > 0 ? Math.round((studentsWithRetakes / totalStudents) * 100) : 0;

  const quickStats = [
    {
      title: 'Étudiants Actifs',
      value: activeStudents,
      total: totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%'
    },
    {
      title: 'Unités d\'Enseignement',
      value: totalUEs,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+3%'
    },
    {
      title: 'Diplômés',
      value: graduatedStudents,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%'
    },
    {
      title: 'Reprises',
      value: studentsWithRetakes,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground">
            Tableau de bord de votre système de gestion universitaire
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Calendar className="h-3 w-3 mr-1" />
          2024-2025
        </Badge>
      </div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-xl font-bold">{stat.value}</p>
                      {stat.total && (
                        <span className="text-xs text-muted-foreground">
                          / {stat.total}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500 font-medium">
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cartes de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Taux de Réussite</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{successRate}%</span>
              <Badge variant="secondary" className="text-xs">{passedGrades} / {totalGrades}</Badge>
            </div>
            <Progress value={successRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {passedGrades} étudiants ont réussi sur {totalGrades} évaluations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Taux de Reprises</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-600">{retakeRate}%</span>
              <Badge variant="destructive" className="text-xs">{studentsWithRetakes} étudiants</Badge>
            </div>
            <Progress value={retakeRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {studentsWithRetakes} étudiants ont des UE à reprendre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <FileText className="h-4 w-4" />
            <span>Activités Récentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-3 w-3 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Nouveaux étudiants inscrits</p>
              <p className="text-xs text-muted-foreground">
                {activeStudents} étudiants actifs cette année
              </p>
            </div>
            <Badge variant="outline" className="text-xs">Aujourd'hui</Badge>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <BookOpen className="h-3 w-3 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Unités d'enseignement</p>
              <p className="text-xs text-muted-foreground">
                {totalUEs} UE disponibles
              </p>
            </div>
            <Badge variant="outline" className="text-xs">Cette semaine</Badge>
          </div>

          {studentsWithRetakes > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-3 w-3 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Reprises programmées</p>
                <p className="text-xs text-muted-foreground">
                  {studentsWithRetakes} étudiants concernés
                </p>
              </div>
              <Badge variant="outline" className="text-xs">À traiter</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
