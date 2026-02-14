import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Download,
  RefreshCw,
  Eye,
  CreditCard,
  School,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Award,
  Calendar,
  Book,
  UserCheck,
  Percent,
  Bell,
  TrendingDown,
  UserPlus,
  BookCheck,
  Home,
  Building,
  Bookmark,
  ChevronRight,
  Filter,
  X,
  School2,
} from "lucide-react";

import { useAcademicYearStore } from "@/store/academicYearStore";
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
  Area,
  AreaChart,
} from "recharts";
import useStudentStore from "@/store/studentStore";
import { useClassStore } from "@/store/classStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { useGradeStore } from "@/store/gradeStore";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminDashboard = () => {
  const { currentAcademicYear } = useAcademicYearStore();
  const { students, fetchStudents } = useStudentStore();
  const { studentFees, getAllStudentFees } = useFeeStructureStore();
  const { classes, fetchClasses } = useClassStore();
  const { enrollments, fetchEnrollments } = useEnrollmentStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { grades, fetchGrades } = useGradeStore();

  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Convertir studentFees (Record) en tableau
  const allFeesArray = useMemo(() => {
    try {
      if (!studentFees || typeof studentFees !== "object") return [];

      // Convertir en tableau plat
      return Object.values(studentFees).flat();
    } catch (error) {
      console.error("Erreur conversion studentFees:", error);
      return [];
    }
  }, [studentFees]);

  // Calculer les niveaux depuis les ENROLLMENTS
  const calculateStudentLevelDistribution = useMemo(() => {
    try {
      const levelDistribution: Record<string, number> = {};

      // Utiliser les inscriptions (enrollments)
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        // Pour chaque inscription, récupérer le niveau de la classe
        enrollments.forEach((enrollment) => {
          if (enrollment.status === "Active") {
            if (enrollment.schoolClass?.level) {
              const level = enrollment.schoolClass.level;
              levelDistribution[level] = (levelDistribution[level] || 0) + 1;
            }
          }
        });
      }

      // Si pas de données dans les inscriptions, utiliser les étudiants
      if (
        Object.keys(levelDistribution).length === 0 &&
        Array.isArray(students)
      ) {
        students.forEach((student) => {
          if (
            student.status?.toLowerCase() === "active" &&
            student.schoolClass?.level
          ) {
            levelDistribution[student.schoolClass.level] =
              (levelDistribution[student.schoolClass.level] || 0) + 1;
          }
        });
      }

      //  Si toujours pas, utiliser les classes
      if (
        Object.keys(levelDistribution).length === 0 &&
        Array.isArray(classes)
      ) {
        classes.forEach((cls) => {
          if (cls.status === "Active" && cls.level) {
            const studentCount = cls._count?.students || 0;
            if (studentCount > 0) {
              levelDistribution[cls.level] =
                (levelDistribution[cls.level] || 0) + studentCount;
            }
          }
        });
      }
      const colors = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ff6b6b",
      ];
      const distribution = Object.entries(levelDistribution)
        .map(([level, count], index) => ({
          level,
          count,
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.count - a.count);

      console.log("📊 Distribution par niveau calculée:", distribution);
      return distribution;
    } catch (error) {
      console.error("Erreur calcul distribution niveaux:", error);
      return [];
    }
  }, [enrollments, students, classes]);

  // Calcul des statistiques
  const calculateStats = useMemo(() => {
    try {
      // Étudiants
      const totalStudents = Array.isArray(students) ? students.length : 0;
      const activeStudents = Array.isArray(students)
        ? students.filter(
            (s) => s?.status && String(s.status).toLowerCase() === "active"
          ).length
        : 0;

      // Cours (assignations)
      const totalCourses = Array.isArray(assignments) ? assignments.length : 0;

      // Frais et paiements - Utiliser allFeesArray
      const totalRevenue = allFeesArray.reduce(
        (sum, fee) => sum + (Number(fee.paidAmount) || 0),
        0
      );

      const pendingPayments = allFeesArray.filter(
        (fee) => fee?.status && String(fee.status).toLowerCase() === "pending"
      ).length;

      // Inscriptions
      const activeEnrollments = Array.isArray(enrollments)
        ? enrollments.filter(
            (e) => e?.status && String(e.status).toLowerCase() === "active"
          ).length
        : 0;

      const enrollmentRate = Math.round(
        (activeEnrollments / Math.max(totalStudents, 1)) * 100
      );

      // Statistiques académiques
      const totalGrades = Array.isArray(grades) ? grades.length : 0;
      const validGrades = Array.isArray(grades)
        ? grades.filter(
            (g) =>
              g.grade >= g.subject.maxGrade * (g.subject.passingGrade / 100)
          ).length
        : 0;

      const passRate =
        totalGrades > 0 ? Math.round((validGrades / totalGrades) * 100) : 0;

      // Calcul de la moyenne générale
      const averageGrade =
        Array.isArray(grades) && grades.length > 0
          ? grades.reduce((sum, g) => sum + (Number(g.grade) || 0), 0) /
            grades.length
          : 0;

      return {
        totalStudents,
        activeStudents,
        totalCourses,
        totalPayments: allFeesArray.filter(
          (fee) =>
            fee?.status &&
            (String(fee.status).toLowerCase() === "partial" ||
              String(fee.status).toLowerCase() === "paid")
        ).length,
        totalRevenue,
        pendingPayments,
        enrollmentRate,
        totalGrades,
        passRate,
        averageGrade: averageGrade.toFixed(1),
      };
    } catch (error) {
      console.error("Erreur dans calculateStats:", error);
      return {
        totalStudents: 0,
        activeStudents: 0,
        totalCourses: 0,
        totalPayments: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        enrollmentRate: 0,
        totalGrades: 0,
        passRate: 0,
        averageGrade: "0.0",
      };
    }
  }, [students, assignments, allFeesArray, enrollments, grades]);

  // Générer les données pour les graphiques -
  const generateChartData = useMemo(() => {
    try {
      const enrollmentTrend = [];
      const now = new Date();

      // Données d'inscriptions
      if (!Array.isArray(enrollments) || enrollments.length === 0) {
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const month = date.toLocaleDateString("fr-FR", { month: "short" });
          enrollmentTrend.push({
            month,
            count: Math.floor(Math.random() * 20) + 10,
          });
        }
      } else {
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const month = date.toLocaleDateString("fr-FR", { month: "short" });

          const enrollmentsThisMonth = enrollments.filter((e) => {
            try {
              if (!e.enrollmentDate) return false;
              const enrollmentDate = new Date(e.enrollmentDate);
              return (
                enrollmentDate.getMonth() === date.getMonth() &&
                enrollmentDate.getFullYear() === date.getFullYear()
              );
            } catch {
              return false;
            }
          }).length;

          enrollmentTrend.push({
            month,
            count: enrollmentsThisMonth,
          });
        }
      }

      // Tendance des revenus -
      const revenueTrend = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.toLocaleDateString("fr-FR", { month: "short" });

        const revenue = allFeesArray.reduce((sum, fee) => {
          try {
            if (!fee.updatedAt && !fee.createdAt) return sum;
            const paymentDate = new Date(fee.updatedAt || fee.createdAt);
            if (
              paymentDate.getMonth() === date.getMonth() &&
              paymentDate.getFullYear() === date.getFullYear()
            ) {
              return sum + (Number(fee.paidAmount) || 0);
            }
          } catch {
            // Ignorer les erreurs de date
          }
          return sum;
        }, 0);

        revenueTrend.push({
          month,
          revenue: revenue || Math.floor(Math.random() * 50000) + 10000,
          expenses: revenue * 0.6,
        });
      }

      // Performance par matière
      const performanceBySubject = [];
      if (Array.isArray(grades) && grades.length > 0) {
        const subjectPerformance: Record<
          string,
          { total: number; count: number }
        > = {};

        grades.forEach((grade) => {
          if (grade.subject) {
            const subjectName = grade.subject.name || "Inconnu";
            if (!subjectPerformance[subjectName]) {
              subjectPerformance[subjectName] = { total: 0, count: 0 };
            }
            subjectPerformance[subjectName].total += Number(grade.grade) || 0;
            subjectPerformance[subjectName].count += 1;
          }
        });

        const colors = [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#8884d8",
          "#82ca9d",
        ];
        Object.entries(subjectPerformance).forEach(([subject, data], index) => {
          if (data.count > 0 && data.total > 0) {
            performanceBySubject.push({
              subject:
                subject.length > 15
                  ? subject.substring(0, 15) + "..."
                  : subject,
              average: parseFloat((data.total / data.count).toFixed(1)),
              color: colors[index % colors.length],
            });
          }
        });

        performanceBySubject.sort((a, b) => b.average - a.average);
      }

      // Statut des paiements -
      const paymentStatus = [];
      if (allFeesArray.length > 0) {
        const statusCounts: Record<string, number> = {};

        allFeesArray.forEach((fee) => {
          const status = fee.status?.toLowerCase() || "inconnu";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusColors: Record<string, string> = {
          paid: "#00C49F",
          pending: "#FFBB28",
          overdue: "#FF8042",
          cancelled: "#8884d8",
          inconnu: "#cccccc",
        };

        Object.entries(statusCounts).forEach(([status, count]) => {
          paymentStatus.push({
            status:
              status === "paid"
                ? "Payé"
                : status === "pending"
                ? "En attente"
                : status === "overdue"
                ? "En retard"
                : status === "cancelled"
                ? "Annulé"
                : "Inconnu",
            count,
            color: statusColors[status] || "#cccccc",
          });
        });
      }

      return {
        enrollmentTrend,
        revenueTrend,
        studentLevelDistribution: calculateStudentLevelDistribution,
        performanceBySubject: performanceBySubject.slice(0, 6),
        paymentStatus,
      };
    } catch (error) {
      console.error("Erreur dans generateChartData:", error);
      return {
        enrollmentTrend: [],
        revenueTrend: [],
        studentLevelDistribution: [],
        performanceBySubject: [],
        paymentStatus: [],
      };
    }
  }, [enrollments, allFeesArray, grades, calculateStudentLevelDistribution]);

  const [dashboardData, setDashboardData] = useState({
    enrollmentTrend: [] as { month: string; count: number }[],
    revenueTrend: [] as { month: string; revenue: number; expenses: number }[],
    studentLevelDistribution: [] as {
      level: string;
      count: number;
      color: string;
    }[],
    performanceBySubject: [] as {
      subject: string;
      average: number;
      color: string;
    }[],
    paymentStatus: [] as { status: string; count: number; color: string }[],
  });

  useEffect(() => {
    const updatedData = generateChartData;
    setDashboardData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  }, [generateChartData]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const promises = [
        fetchStudents().catch((err) =>
          console.warn("Erreur fetchStudents:", err)
        ),
        fetchClasses().catch((err) =>
          console.warn("Erreur fetchClasses:", err)
        ),
        fetchEnrollments().catch((err) =>
          console.warn("Erreur fetchEnrollments:", err)
        ),
        fetchAssignments().catch((err) =>
          console.warn("Erreur fetchAssignments:", err)
        ),
        getAllStudentFees().catch((err) =>
          console.warn("Erreur getAllStudentFees:", err)
        ),
        fetchGrades().catch((err) => console.warn("Erreur fetchGrades:", err)),
      ];

      await Promise.all(promises);

      toast.success("Dashboard mis à jour avec succès");
    } catch (error) {
      console.error("Erreur générale lors du chargement des données:", error);
      toast.error("Certaines données n'ont pas pu être chargées");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le clic sur une carte -  AVEC useCallback
  const handleCardClick = useCallback(
    (statType: string, event?: React.MouseEvent) => {
      // Empêcher la propagation si un événement est fourni
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      console.log(`Clic sur la carte: ${statType}`);

      // Prévenir les doublons en fermant d'abord la modal
      if (modalOpen) {
        setModalOpen(false);
        // Petit délai pour éviter les conflits
        setTimeout(() => {
          openModalWithData(statType);
        }, 100);
      } else {
        openModalWithData(statType);
      }
    },
    [modalOpen]
  );

  const openModalWithData = (statType: string) => {
    setModalLoading(true);
    setSelectedStat(statType);

    let title = "";
    let data: any[] = [];

    try {
      switch (statType) {
        case "activeStudents":
          title = "Étudiants Actifs";
          data = students
            .filter(
              (s) => s?.status && String(s.status).toLowerCase() === "active"
            )
            .map((student) => ({
              id: student.id,
              name: `${student.firstName} ${student.lastName}`,
              email: student.email || "Non spécifié",
              class: student.schoolClass?.name || "Non assigné",
              status: student.status,
            }));
          break;

        case "activeClasses":
          title = "Classes Actives";
          data = classes
            .filter((c) => c.status === "Active")
            .map((cls) => ({
              id: cls.id,
              name: cls.name,
              level: cls.level || "Non spécifié",
              capacity: cls.capacity,
              currentStudents: cls._count?.students || 0,
            }));
          break;

        case "pendingPayments":
          title = "Paiements en Attente";
          data = allFeesArray
            .filter(
              (fee) =>
                fee?.status && String(fee.status).toLowerCase() === "pending"
            )
            .map((fee) => ({
              id: fee.id,
              student: fee.student?.firstName
                ? `${fee.student.firstName} ${fee.student.lastName}`
                : `Étudiant #${fee.studentId?.substring(0, 8)}`,
              amount: fee.paidAmount || 0,
              totalAmount: fee.totalAmount || 0,
              dueDate: fee.dueDate
                ? new Date(fee.dueDate).toLocaleDateString("fr-FR")
                : "Non spécifié",
            }));
          break;

        case "totalCourses":
          title = "Cours Assignés";
          data = assignments.map((assignment) => ({
            id: assignment.id,
            subject: assignment.subject?.name || "Non spécifié",
            class:
              assignment.schoolClass?.name ||
              assignment.classLevel ||
              "Non spécifié",
            professor: assignment.professeur?.firstName
              ? `${assignment.professeur.firstName} ${assignment.professeur.lastName}`
              : "Non assigné",
          }));
          break;

        case "totalRevenue":
          title = "Détails des Revenus";
          data = allFeesArray
            .filter(
              (fee) =>
                fee?.status && String(fee.status).toLowerCase() === "paid"
            )
            .map((fee) => ({
              id: fee.id,
              student: fee.student?.firstName
                ? `${fee.student.firstName} ${fee.student.lastName}`
                : `Étudiant #${fee.studentId?.substring(0, 8)}`,
              amount: fee.paidAmount || 0,
              date: fee.updatedAt
                ? new Date(fee.updatedAt).toLocaleDateString("fr-FR")
                : fee.createdAt
                ? new Date(fee.createdAt).toLocaleDateString("fr-FR")
                : "Date inconnue",
            }));
          break;

        case "enrollmentRate":
          title = "Inscriptions Actives";
          data = enrollments
            .filter(
              (e) => e?.status && String(e.status).toLowerCase() === "active"
            )
            .map((enrollment) => ({
              id: enrollment.id,
              student: enrollment.student?.firstName
                ? `${enrollment.student.firstName} ${enrollment.student.lastName}`
                : `Étudiant #${enrollment.studentCode?.substring(0, 8)}`,
              class: enrollment.schoolClass?.name || "Non spécifié",
              enrollmentDate: enrollment.enrollmentDate
                ? new Date(enrollment.enrollmentDate).toLocaleDateString(
                    "fr-FR"
                  )
                : "Date inconnue",
            }));
          break;

        case "totalPayments":
          title = "Tous les Paiements";
          data = allFeesArray
            .filter(
              (fee) =>
                fee?.status && String(fee.status).toLowerCase() === "partial"
            )
            .map((fee) => ({
              id: fee.id,
              student: fee.student?.firstName
                ? `${fee.student.firstName} ${fee.student.lastName}`
                : `Étudiant #${fee.studentId?.substring(0, 8)}`,
              amount: fee.paidAmount || 0,
              status: fee.status || "inconnu",
              date: fee.updatedAt
                ? new Date(fee.updatedAt).toLocaleDateString("fr-FR")
                : fee.createdAt
                ? new Date(fee.createdAt).toLocaleDateString("fr-FR")
                : "Date inconnue",
            }));
          break;

        case "passRate":
          title = "Statistiques des Notes";
          const validGrades = grades.filter(
            (g) =>
              g.grade >= (g.subject.passingGrade / 100) * g.subject.maxGrade
          ).length;
          const totalGrades = grades.length;
          data = [
            {
              id: "stats",
              totalGrades,
              validGrades,
              passRate:
                totalGrades > 0
                  ? Math.round((validGrades / totalGrades) * 100)
                  : 0,
              average:
                totalGrades > 0
                  ? (
                      grades.reduce(
                        (sum, g) => sum + (Number(g.grade) || 0),
                        0
                      ) / totalGrades
                    ).toFixed(1)
                  : "0.0",
            },
          ];
          break;

        case "averageGrade":
          title = "Moyenne Générale";
          const average =
            Array.isArray(grades) && grades.length > 0
              ? grades.reduce((sum, g) => sum + (Number(g.grade) || 0), 0) /
                grades.length
              : 0;
          data = [
            {
              id: "average",
              value: average.toFixed(1),
              totalStudents: calculateStats.activeStudents,
              noteMax: 20,
              noteMin: 0,
            },
          ];
          break;

        default:
          title = "Détails";
          data = [];
          break;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la préparation des données modales:",
        error
      );
      title = "Erreur";
      data = [{ error: "Impossible de charger les données" }];
    }

    setModalTitle(title);
    setModalData(data);
    setModalLoading(false);
    setModalOpen(true);
  };

  const StatCard = React.memo(
    ({
      title,
      value,
      icon: Icon,
      trend,
      description,
      color = "primary",
      loading = false,
      clickable = true,
      statKey = "",
    }: {
      title: string;
      value: string | number;
      icon: any;
      trend?: number;
      description?: string;
      color?: string;
      loading?: boolean;
      clickable?: boolean;
      statKey?: string;
    }) => {
      const handleClick = (e: React.MouseEvent) => {
        if (clickable && statKey) {
          e.preventDefault();
          e.stopPropagation();
          handleCardClick(statKey, e);
        }
      };

      return (
        <Card
          className={`hover:shadow-lg transition-all duration-300 ${
            clickable
              ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] select-none"
              : ""
          }`}
          onClick={handleClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Icon
                className={`h-5 w-5 ${
                  color === "primary"
                    ? "text-primary"
                    : color === "success"
                    ? "text-green-600"
                    : color === "warning"
                    ? "text-yellow-600"
                    : color === "danger"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              />
              {clickable && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
            {trend !== undefined && !loading && (
              <div className="flex items-center text-xs mt-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span
                  className={trend >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {trend >= 0 ? "+" : ""}
                  {trend}%
                </span>
                <span className="text-muted-foreground ml-2">
                  vs mois dernier
                </span>
              </div>
            )}
            {description && !loading && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{description}</p>
                {clickable && (
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    Voir détails <Eye className="h-3 w-3" />
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
  );

  StatCard.displayName = "StatCard";

  // Composant Modal pour afficher les détails
  const StatModal = useCallback(() => {
    const handleClose = () => {
      setModalOpen(false);
      setModalLoading(false);
      setModalData([]);
      setModalTitle("");
      setSelectedStat(null);
    };

    const renderTableData = () => {
      if (modalLoading) {
        return (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        );
      }

      if (modalData.length === 0) {
        return (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune donnée disponible</p>
          </div>
        );
      }

      // Rendu selon le type de données
      switch (selectedStat) {
        case "activeStudents":
          return (
            <div className="space-y-3">
              {modalData.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {student.class}
                  </Badge>
                </div>
              ))}
            </div>
          );

        case "activeClasses":
          return (
            <div className="space-y-4">
              {modalData.map((cls: any) => (
                <div
                  key={cls.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">{cls.name}</h4>
                    </div>
                    <Badge variant="outline">{cls.level}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Capacité</p>
                      <p className="font-medium">
                        {cls.currentStudents} / {cls.capacity}
                      </p>
                      <Progress
                        value={(cls.currentStudents / cls.capacity) * 100}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Professeur</p>
                      <p className="font-medium truncate">{cls.teacher}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

        case "pendingPayments":
        case "totalPayments":
          return (
            <div className="space-y-3">
              {modalData.map((payment: any) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{payment.student}</p>
                      {payment.dueDate && (
                        <p className="text-sm text-muted-foreground">
                          Échéance: {payment.dueDate}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        payment.status === "paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : payment.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {payment.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p
                        className={`text-lg font-bold ${
                          payment.status === "paid"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {payment.amount.toLocaleString()} HTG
                      </p>
                    </div>
                    {payment.totalAmount > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Total dû
                        </p>
                        <p className="text-sm">
                          {payment.totalAmount.toLocaleString()} HTG
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );

        case "totalCourses":
          return (
            <div className="space-y-4">
              {modalData.map((course: any) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{course.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.class}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {course.schedules} créneau(s)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Professeur</p>
                      <p className="font-medium truncate">{course.professor}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir horaires
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );

        case "totalRevenue":
          return (
            <div className="space-y-3">
              {modalData.map((revenue: any) => (
                <div
                  key={revenue.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{revenue.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {revenue.date}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {revenue.method}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p className="text-lg font-bold text-green-600">
                        {revenue.amount.toLocaleString()} HTG
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          );

        case "enrollmentRate":
          return (
            <div className="space-y-4">
              {modalData.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{enrollment.student}</h4>
                        <p className="text-sm text-muted-foreground">
                          Inscrit le {enrollment.enrollmentDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{enrollment.class}</Badge>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Statut:{" "}
                      <span className="font-medium text-green-600">Actif</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );

        case "passRate":
          return modalData.length > 0 && modalData[0] ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Notes totales</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {modalData[0].totalGrades}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Notes validées</p>
                  <p className="text-2xl font-bold text-green-800">
                    {modalData[0].validGrades}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Taux de réussite
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <Progress value={modalData[0].passRate} className="h-3" />
                  </div>
                  <span className="text-2xl font-bold">
                    {modalData[0].passRate}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">Moyenne générale</p>
                <p className="text-2xl font-bold text-purple-800">
                  {modalData[0].average}/20
                </p>
              </div>
            </div>
          ) : null;

        case "averageGrade":
          return modalData.length > 0 && modalData[0] ? (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Moyenne sur</p>
                <p className="text-3xl font-bold text-primary mb-2">
                  {modalData[0].value}/20
                </p>
                <p className="text-muted-foreground">
                  {modalData[0].totalStudents} étudiants
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Note minimale</p>
                  <p className="text-lg font-bold">{modalData[0].noteMin}/20</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Note maximale</p>
                  <p className="text-lg font-bold">{modalData[0].noteMax}/20</p>
                </div>
              </div>
            </div>
          ) : null;

        default:
          if (modalData.length > 0 && modalData[0]?.message) {
            return (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  {modalData[0].message}
                </h3>
                <p className="text-muted-foreground">
                  {modalData[0].suggestion}
                </p>
              </div>
            );
          } else {
            return (
              <div className="space-y-4">
                {modalData.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    {item.error ? (
                      <>
                        <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
                        <p className="font-medium text-red-600">{item.error}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.details}
                        </p>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-xs text-muted-foreground">
                              {key}:
                            </span>
                            <span className="ml-2 font-medium">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
      }
    };

    return (
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] sm:max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <span>{modalTitle}</span>
                <Badge variant="secondary">{modalData.length} élément(s)</Badge>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Détails complets pour {modalTitle.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">{renderTableData()}</ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
            {modalData.length > 0 && modalData[0] && !modalData[0].error && (
              <Button
                onClick={() => {
                  try {
                    const dataStr = JSON.stringify(modalData, null, 2);
                    const dataUri =
                      "data:application/json;charset=utf-8," +
                      encodeURIComponent(dataStr);
                    const exportFileDefaultName = `${modalTitle
                      .toLowerCase()
                      .replace(/\s+/g, "_")}_${
                      new Date().toISOString().split("T")[0]
                    }.json`;

                    const linkElement = document.createElement("a");
                    linkElement.setAttribute("href", dataUri);
                    linkElement.setAttribute("download", exportFileDefaultName);
                    document.body.appendChild(linkElement);
                    linkElement.click();
                    document.body.removeChild(linkElement);

                    toast.success("Données exportées avec succès");
                  } catch (error) {
                    console.error("Erreur lors de l'export:", error);
                    toast.error("Erreur lors de l'export");
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [modalOpen, modalTitle, modalData, modalLoading, selectedStat]);

  // Calcul des métriques sécurisé
  const totalClassCapacity = classes.reduce(
    (sum, c) => sum + (Number(c.capacity) || 0),
    0
  );
  const classUsage =
    totalClassCapacity > 0
      ? Math.round((calculateStats.activeStudents / totalClassCapacity) * 100)
      : 0;

  const uniqueProfessors = new Set(
    assignments.map((a) => a.professeur?.id).filter(Boolean)
  ).size;
  const professorAssignmentRate =
    assignments.length > 0
      ? Math.round((uniqueProfessors / assignments.length) * 100)
      : 0;

  const currentYearEnrollments = enrollments.filter((e) => {
    try {
      return (
        new Date(e.enrollmentDate).getFullYear() === new Date().getFullYear()
      );
    } catch {
      return false;
    }
  }).length;

  // Derniers paiements effectués
  const recentPayments = useMemo(() => {
    if (allFeesArray.length === 0) return [];

    return [...allFeesArray]
      .filter((fee) => fee.status === "partial" || fee.status === "paid")
      .filter((fee) => fee.updatedAt || fee.createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((fee) => ({
        id: fee.id,
        studentName:
          fee.student?.firstName ||
          `Étudiant #${fee.studentId?.substring(0, 8) || "Inconnu"}`,
        amount: fee.paidAmount || 0,
        status: fee.status || "inconnu",
        date: fee.updatedAt || fee.createdAt,
        totalAmount: fee.totalAmount || 0,
      }));
  }, [allFeesArray]);

  // Dernières inscriptions
  const recentEnrollments = useMemo(() => {
    if (!Array.isArray(enrollments) || enrollments.length === 0) return [];

    return [...enrollments]
      .sort((a, b) => {
        const dateA = new Date(a.enrollmentDate || a.createdAt || 0);
        const dateB = new Date(b.enrollmentDate || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((enrollment) => ({
        id: enrollment.id,
        studentName:
          enrollment.student?.firstName ||
          `Étudiant #${enrollment.studentCode?.substring(0, 8) || "Inconnu"}`,
        className: enrollment.schoolClass?.name || "Classe inconnue",
        date: enrollment.createdAt || enrollment.createdAt,
        status: enrollment.status || "Active",
      }));
  }, [enrollments]);

  // Dernières activités
  const recentActivities = useMemo(() => {
    const activities = [];

    // Ajouter les dernières inscriptions
    if (recentEnrollments.length > 0) {
      recentEnrollments.slice(0, 2).forEach((e) => {
        activities.push({
          type: "enrollment",
          title: "Nouvelle inscription",
          description: `${e.studentName} - ${e.className}`,
          time: e.date
            ? `Il y a ${Math.floor(
                (Date.now() - new Date(e.date).getTime()) / (1000 * 60 * 60)
              )}h`
            : "Récemment",
          icon: UserPlus,
          color: "text-blue-600",
        });
      });
    }

    // Ajouter les derniers paiements
    if (recentPayments.length > 0) {
      recentPayments.slice(0, 2).forEach((p) => {
        activities.push({
          type: "payment",
          title: "Paiement reçu",
          description: `${p.studentName} - ${p.amount} HTG`,
          time: p.date
            ? `Il y a ${Math.floor(
                (Date.now() - new Date(p.date).getTime()) / (1000 * 60 * 60)
              )}h`
            : "Récemment",
          icon: CreditCard,
          color: "text-green-600",
        });
      });
    }

    // Ajouter les nouvelles notes
    if (Array.isArray(grades) && grades.length > 0) {
      const recentGrades = [...grades]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 1);

      if (recentGrades.length > 0) {
        const grade = recentGrades[0];
        activities.push({
          type: "grade",
          title: "Note ajoutée",
          description: `${grade.subject?.name || "Matière"} - ${
            grade.grade
          }/20`,
          time: grade.createdAt
            ? `Il y a ${Math.floor(
                (Date.now() - new Date(grade.createdAt).getTime()) /
                  (1000 * 60 * 60)
              )}h`
            : "Récemment",
          icon: BookCheck,
          color: "text-purple-600",
        });
      }
    }

    return activities;
  }, [recentEnrollments, recentPayments, grades]);

  return (
    <div className="space-y-6">
      <StatModal />

      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            TABLEAU DE BORD ADMINISTRATEUR
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble complète - Année académique{" "}
            {currentAcademicYear?.year || "Non définie"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>
      </div>

      {/* Alertes rapides - AUSSI CLIQUABLES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50 hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCardClick("totalPayments", e);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Paiements effectués</p>
                <p className="text-2xl font-bold">
                  {calculateStats.totalPayments}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-white to-yellow-50 hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const pendingGrades = grades.filter(
              (a) => a.status === "Submitted"
            );
            setModalTitle("Total Notes");
            setModalData(
              pendingGrades.map((grade) => ({
                Matieres: grade.subject?.name || "Non spécifié",
                Étudiant: grade.student
                  ? `${grade.student.firstName} ${grade.student.lastName}`
                  : "Inconnu",
                Note: grade.grade || "N/A",
                Statut: grade.status,
              }))
            );
            setModalOpen(true);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Notes a valider</p>
                <p className="text-2xl font-bold">
                  {grades.filter((a) => a.status === "Submitted").length}
                </p>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50 hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCardClick("activeClasses", e);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Classes actives</p>
                <p className="text-2xl font-bold">
                  {classes.filter((c) => c.status === "Active").length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sur {classes.length} classes
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50 hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCardClick("enrollmentRate", e);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Taux de rétention</p>
                <p className="text-2xl font-bold">
                  {calculateStats.enrollmentRate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Étudiants actifs
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b">
        <nav className="flex space-x-4">
          {["overview", "academic", "financial"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" && "Vue d'ensemble"}
              {tab === "academic" && "Académique"}
              {tab === "financial" && "Financier"}
            </button>
          ))}
        </nav>
      </div>

      {/* Statistiques principales - CLIQUABLES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Étudiants actifs"
          value={calculateStats.activeStudents}
          icon={Users}
          description={`Total: ${calculateStats.totalStudents}`}
          color="primary"
          loading={loading}
          clickable={true}
          statKey="activeStudents"
        />
        <StatCard
          title="Taux de réussite"
          value={`${calculateStats.passRate}%`}
          icon={Award}
          description={`${calculateStats.totalGrades} notes`}
          color="success"
          loading={loading}
          clickable={true}
          statKey="passRate"
        />
        <StatCard
          title="Revenus totaux"
          value={`${calculateStats.totalRevenue.toLocaleString()} HTG`}
          icon={DollarSign}
          description={`${calculateStats.totalPayments} paiements`}
          color="warning"
          loading={loading}
          clickable={true}
          statKey="totalRevenue"
        />
        <StatCard
          title="Moyenne générale"
          value={calculateStats.averageGrade}
          icon={Percent}
          description="Score moyen des étudiants"
          color="info"
          loading={loading}
          clickable={true}
          statKey="averageGrade"
        />
      </div>

      {/* Graphiques principaux - Vue d'ensemble */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Évolution des inscriptions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des inscriptions</CardTitle>
              <CardDescription>
                Nombre d'étudiants inscrits par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dashboardData.enrollmentTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        stroke="#666"
                        tick={{ fill: "#666" }}
                      />
                      <YAxis stroke="#666" tick={{ fill: "#666" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Inscriptions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p>Aucune donnée d'inscription disponible</p>
                      <Button
                        variant="link"
                        onClick={loadData}
                        className="mt-2"
                      >
                        Charger les données
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RÉPARTITION PAR NIVEAU */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par niveau</CardTitle>
              <CardDescription>
                {calculateStudentLevelDistribution.length > 0
                  ? "Distribution des étudiants par niveau"
                  : "Données de niveau"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dashboardData.studentLevelDistribution.length > 0 ? (
                  <>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.studentLevelDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ level, percent }) =>
                              `${level}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={70}
                            innerRadius={30}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {dashboardData.studentLevelDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => {
                              const total =
                                dashboardData.studentLevelDistribution.reduce(
                                  (sum, item) => sum + item.count,
                                  0
                                );
                              const percentage = (
                                (Number(value) / total) *
                                100
                              ).toFixed(1);
                              return [
                                `${value} étudiants (${percentage}%)`,
                                "Nombre",
                              ];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4 max-h-32 overflow-y-auto">
                      {dashboardData.studentLevelDistribution.map(
                        (entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const levelStudents = students.filter(
                                (s) =>
                                  s.schoolClass?.level === entry.level &&
                                  s.status?.toLowerCase() === "active"
                              );
                              setModalTitle(`Étudiants - ${entry.level}`);
                              setModalData(
                                levelStudents.map((student) => ({
                                  id: student.id,
                                  name: `${student.firstName} ${student.lastName}`,
                                  email: student.email || "Non spécifié",
                                  class:
                                    student.schoolClass?.name || "Non assigné",
                                  status: student.status,
                                }))
                              );
                              setModalOpen(true);
                            }}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm">{entry.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.count}</span>
                              <span className="text-xs text-muted-foreground">
                                {(
                                  (entry.count /
                                    calculateStats.activeStudents) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <School className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="mb-2">Aucune donnée de niveau disponible</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance par matière */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance par matière</CardTitle>
              <CardDescription>Moyenne des notes par matière</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dashboardData.performanceBySubject.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.performanceBySubject}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="subject"
                        stroke="#666"
                        tick={{ fill: "#666" }}
                      />
                      <YAxis
                        stroke="#666"
                        tick={{ fill: "#666" }}
                        domain={[0, 20]}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(1)}/20`,
                          "Moyenne",
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="average"
                        name="Moyenne"
                        radius={[4, 4, 0, 0]}
                      >
                        {dashboardData.performanceBySubject.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Aucune donnée de notes disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* STATUT DES PAIEMENTS */}
          <Card>
            <CardHeader>
              <CardTitle>Statut des paiements</CardTitle>
              <CardDescription>
                {allFeesArray.length > 0
                  ? `${allFeesArray.length} paiements enregistrés`
                  : "Statut des frais"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.paymentStatus.length > 0 ? (
                  <>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.paymentStatus}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ status, percent }) =>
                              `${status}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={60}
                            innerRadius={20}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {dashboardData.paymentStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => {
                              const total = dashboardData.paymentStatus.reduce(
                                (sum, item) => sum + item.count,
                                0
                              );
                              const percentage = (
                                (Number(value) / total) *
                                100
                              ).toFixed(1);
                              return [
                                `${value} paiements (${percentage}%)`,
                                "Nombre",
                              ];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {dashboardData.paymentStatus.map((status, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const filteredFees = allFeesArray.filter(
                              (fee) =>
                                (fee.status?.toLowerCase() === "paid" &&
                                  status.status === "Payé") ||
                                (fee.status?.toLowerCase() === "pending" &&
                                  status.status === "En attente") ||
                                (fee.status?.toLowerCase() === "overdue" &&
                                  status.status === "En retard")
                            );
                            setModalTitle(`Paiements - ${status.status}`);
                            setModalData(
                              filteredFees.map((fee) => ({
                                id: fee.id,
                                student: fee.student?.firstName
                                  ? `${fee.student.firstName} ${fee.student.lastName}`
                                  : `Étudiant #${fee.studentId?.substring(
                                      0,
                                      8
                                    )}`,
                                amount: fee.paidAmount || 0,
                                date: fee.updatedAt
                                  ? new Date(fee.updatedAt).toLocaleDateString(
                                      "fr-FR"
                                    )
                                  : fee.createdAt
                                  ? new Date(fee.createdAt).toLocaleDateString(
                                      "fr-FR"
                                    )
                                  : "Date inconnue",
                                status: fee.status,
                              }))
                            );
                            setModalOpen(true);
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: status.color }}
                            />
                            <span className="text-sm">{status.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{status.count}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                    <CreditCard className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center mb-2">
                      Aucun paiement enregistré
                    </p>
                    <p className="text-xs text-center">
                      Total des frais: {allFeesArray.length}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vue financière */}
      {activeTab === "financial" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Tendance des revenus */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Analyse financière</CardTitle>
              <CardDescription>Revenus et dépenses par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dashboardData.revenueTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Revenus"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Dépenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Aucune donnée financière disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* DERNIERS PAIEMENTS */}
          <Card>
            <CardHeader>
              <CardTitle>Derniers paiements</CardTitle>
              <CardDescription>
                {recentPayments.length > 0
                  ? `${recentPayments.length} transactions récentes`
                  : "Historique des paiements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPayments.length > 0 ? (
                  <>
                    {recentPayments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setModalTitle("Détails du Paiement");
                          setModalData([payment]);
                          setModalOpen(true);
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate max-w-[120px]">
                              {payment.studentName}
                            </p>
                            <Badge
                              variant={
                                payment.status === "paid"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-xs ${
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {payment.status === "paid"
                                ? "Payé"
                                : payment.status === "pending"
                                ? "En attente"
                                : "Inconnu"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {payment.date
                                ? new Date(payment.date).toLocaleDateString(
                                    "fr-FR"
                                  )
                                : "Date inconnue"}
                            </p>
                            <div className="text-right">
                              <p className="font-bold text-sm">
                                {payment.amount.toLocaleString()} HTG
                              </p>
                              {payment.totalAmount &&
                                payment.totalAmount > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    Sur {payment.totalAmount.toLocaleString()}{" "}
                                    HTG
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun paiement récent</p>
                    <p className="text-xs mt-1">
                      {allFeesArray.length === 0
                        ? "Aucun frais enregistré"
                        : `${allFeesArray.length} frais enregistrés`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Indicateurs de performance et dernières activités */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Indicateurs de performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>Statistiques clés du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Utilisation des classes
                </span>
                <span className="text-sm font-bold">{classUsage}%</span>
              </div>
              <Progress value={classUsage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {calculateStats.activeStudents} étudiants / {totalClassCapacity}{" "}
                places
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Professeurs assignés
                </span>
                <span className="text-sm font-bold">{uniqueProfessors}</span>
              </div>
              <Progress value={professorAssignmentRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Sur {assignments.length} cours total
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Inscriptions cette année
                </span>
                <span className="text-sm font-bold">
                  {currentYearEnrollments}
                </span>
              </div>
              <Progress
                value={Math.round(
                  (currentYearEnrollments /
                    Math.max(calculateStats.totalStudents, 1)) *
                    100
                )}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nouveaux étudiants cette année académique
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dernières activités */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Événements récents du système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalTitle(activity.title);
                      setModalData([
                        {
                          description: activity.description,
                          time: activity.time,
                          type: activity.type,
                        },
                      ]);
                      setModalOpen(true);
                    }}
                  >
                    <div
                      className={`p-2 rounded-full ${activity.color.replace(
                        "text-",
                        "bg-"
                      )} bg-opacity-10`}
                    >
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune activité récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
