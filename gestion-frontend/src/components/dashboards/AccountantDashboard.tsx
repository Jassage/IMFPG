// components/dashboards/AccountantDashboard.tsx
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Eye,
  Plus,
  Search,
  Mail,
  X,
} from "lucide-react";

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
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import useStudentStore from "@/store/studentStore";
import { useClassStore } from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";

// Types pour les données financières
interface FinancialTransaction {
  id: string;
  studentName: string;
  amount: number;
  type: "payment" | "refund" | "adjustment";
  status: "completed" | "pending" | "partial" | "overdue";
  date: string;
  paymentMethod: string;
  description?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  refundAmount: number;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  overdueStudents: number;
}

interface Invoice {
  id: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  createdAt: string;
}

// Fonction utilitaire pour formater les montants
const formatAmount = (amount: any): number => {
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") {
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Fonction utilitaire pour obtenir le statut d'un paiement
const getPaymentStatus = (
  status: string
): "completed" | "pending" | "partial" | "overdue" => {
  const statusLower = (status || "").toLowerCase();
  if (statusLower === "paid" || statusLower === "completed") return "completed";
  if (statusLower === "pending") return "pending";
  if (statusLower === "overdue") return "overdue";
  if (statusLower === "partial") return "partial";
  return "pending";
};

// Fonction utilitaire pour extraire le nom de l'étudiant
const getStudentName = (fee: any): string => {
  if (!fee) return "Étudiant inconnu";

  if (fee.student) {
    if (fee.student.firstName && fee.student.lastName) {
      return `${fee.student.firstName} ${fee.student.lastName}`;
    }
    if (fee.student.fullName) {
      return fee.student.fullName;
    }
  }

  return `Étudiant #${fee.studentId?.substring(0, 8) || "N/A"}`;
};

// Fonction utilitaire pour extraire la méthode de paiement
const getPaymentMethod = (fee: any): string => {
  if (fee.paymentMethod) return fee.paymentMethod;
  if (fee.payments) {
    if (Array.isArray(fee.payments) && fee.payments.length > 0) {
      return fee.payments[0].paymentMethod || "Non spécifié";
    }
    if (typeof fee.payments === "string") {
      return fee.payments;
    }
  }
  return "Non spécifié";
};

// Fonction utilitaire pour extraire les paiements
const extractPayments = (fee: any): any[] => {
  if (!fee) return [];

  if (Array.isArray(fee.payments)) {
    return fee.payments.map((payment) => ({
      ...payment,
      amount: formatAmount(payment.amount),
      paymentMethod: payment.paymentMethod || "Non spécifié",
      date:
        payment.paymentDate || payment.createdAt || new Date().toISOString(),
    }));
  }

  return [];
};

// Fonction utilitaire pour calculer les statistiques des paiements
const calculatePaymentStats = (payments: any[]) => {
  return payments.reduce(
    (stats, payment) => {
      const amount = formatAmount(payment.amount);
      if (amount > 0) {
        stats.total += amount;
      }
      return stats;
    },
    { total: 0 }
  );
};

// Composant pour afficher les valeurs en toute sécurité
const SafeDisplay = ({
  value,
  type = "text",
  className = "",
}: {
  value: any;
  type?: "text" | "currency" | "date";
  className?: string;
}) => {
  if (value === null || value === undefined || value === "") {
    return <span className={className}>-</span>;
  }

  // Si c'est un objet, ne pas l'afficher directement
  if (typeof value === "object" && !Array.isArray(value)) {
    console.warn("Tentative d'afficher un objet comme texte:", value);
    return (
      <span className={`${className} text-red-500`}>[Donnée invalide]</span>
    );
  }

  try {
    if (type === "currency") {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      const formatted =
        typeof numValue === "number" && !isNaN(numValue)
          ? numValue.toLocaleString("fr-FR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : "0";
      return <span className={className}>{formatted} HTG</span>;
    }

    if (type === "date") {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return <span className={className}>Date invalide</span>;
        }
        return (
          <span className={className}>
            {format(date, "dd/MM/yyyy", { locale: fr })}
          </span>
        );
      } catch {
        return <span className={className}>Date invalide</span>;
      }
    }

    return <span className={className}>{String(value)}</span>;
  } catch (error) {
    console.error("Erreur SafeDisplay:", error);
    return (
      <span className={`${className} text-red-500`}>Erreur affichage</span>
    );
  }
};

const AccountantDashboard = () => {
  const { user } = useAuthStore();
  const {
    studentFees,
    getAllStudentFees,
    loading: feesLoading,
  } = useFeeStructureStore();
  const { students, fetchStudents } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const { currentAcademicYear } = useAcademicYearStore();
  const { enrollments, fetchEnrollments } = useEnrollmentStore();

  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // États pour les modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<
    "transactions" | "invoices" | "students" | "details"
  >("transactions");

  // Récupérer toutes les données des frais avec transformation sécurisée
  const allFeesArray = useMemo(() => {
    try {
      console.log("studentFees dans allFeesArray:", studentFees);

      if (!studentFees || typeof studentFees !== "object") {
        console.log("studentFees est vide ou non object");
        return [];
      }

      // Si studentFees est un objet avec des clés d'étudiants
      if (!Array.isArray(studentFees)) {
        const fees = Object.values(studentFees).flat();
        return fees.map((fee) => {
          // Transformation sécurisée
          const payments = extractPayments(fee);
          const paymentStats = calculatePaymentStats(payments);

          const totalAmount = formatAmount(fee.totalAmount);
          const paidAmount = formatAmount(fee.paidAmount) || paymentStats.total;
          const balance = totalAmount - paidAmount;

          return {
            ...fee,
            id: fee.id || `fee-${Date.now()}`,
            studentName: getStudentName(fee),
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            balance: balance,
            status: fee.status || "pending",
            payments: payments,
            paymentMethod: getPaymentMethod(fee),
            updatedAt:
              fee.updatedAt || fee.createdAt || new Date().toISOString(),
            createdAt: fee.createdAt || new Date().toISOString(),
            dueDate:
              fee.dueDate || new Date(Date.now() + 86400000 * 30).toISOString(),
          };
        });
      }

      // Si c'est déjà un tableau
      return studentFees.map((fee) => {
        const payments = extractPayments(fee);
        const paymentStats = calculatePaymentStats(payments);
        const totalAmount = formatAmount(fee.totalAmount);
        const paidAmount = formatAmount(fee.paidAmount) || paymentStats.total;
        const balance = totalAmount - paidAmount;

        return {
          ...fee,
          id: fee.id || `fee-${Date.now()}`,
          studentName: getStudentName(fee),
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          balance: balance,
          status: fee.status || "pending",
          payments: payments,
          paymentMethod: getPaymentMethod(fee),
          updatedAt: fee.updatedAt || fee.createdAt || new Date().toISOString(),
          createdAt: fee.createdAt || new Date().toISOString(),
          dueDate:
            fee.dueDate || new Date(Date.now() + 86400000 * 30).toISOString(),
        };
      });
    } catch (error) {
      console.error("Erreur conversion studentFees:", error);
      return [];
    }
  }, [studentFees]);

  // Calculer le résumé financier
  const financialSummary: FinancialSummary = useMemo(() => {
    try {
      const totalRevenue = allFeesArray.reduce(
        (sum, fee) => sum + fee.totalAmount,
        0
      );

      // Calculer le montant collecté à partir des paiements
      const collectedAmount = allFeesArray.reduce((sum, fee) => {
        return sum + fee.paidAmount;
      }, 0);

      // Calculer le montant en attente (balance)
      const pendingAmount = allFeesArray.reduce((sum, fee) => {
        return sum + fee.balance;
      }, 0);

      // Calculer le montant en retard
      const overdueAmount = allFeesArray
        .filter((fee) => {
          const status = fee.status?.toLowerCase();
          return status === "overdue" && fee.balance > 0;
        })
        .reduce((sum, fee) => sum + fee.balance, 0);

      // Calculer le montant remboursé
      const refundAmount = allFeesArray
        .filter((fee) => {
          const status = fee.status?.toLowerCase();
          return status === "refunded" || status === "cancelled";
        })
        .reduce((sum, fee) => sum + fee.paidAmount, 0);

      // Statistiques par étudiant
      const studentFeeMap = new Map();
      allFeesArray.forEach((fee) => {
        if (fee.studentId) {
          if (!studentFeeMap.has(fee.studentId)) {
            studentFeeMap.set(fee.studentId, {
              paid: false,
              pending: false,
              overdue: false,
              student: fee.studentName,
            });
          }
          const studentData = studentFeeMap.get(fee.studentId);
          const status = fee.status?.toLowerCase();

          if (status === "paid" || fee.paidAmount >= fee.totalAmount) {
            studentData.paid = true;
          } else if (status === "pending" || fee.balance > 0) {
            studentData.pending = true;
          } else if (status === "overdue") {
            studentData.overdue = true;
          }
          studentFeeMap.set(fee.studentId, studentData);
        }
      });

      const paidStudents = Array.from(studentFeeMap.values()).filter(
        (s) => s.paid
      ).length;
      const pendingStudents = Array.from(studentFeeMap.values()).filter(
        (s) => s.pending && !s.paid
      ).length;
      const overdueStudents = Array.from(studentFeeMap.values()).filter(
        (s) => s.overdue
      ).length;

      return {
        totalRevenue,
        collectedAmount,
        pendingAmount,
        overdueAmount,
        refundAmount,
        totalStudents: studentFeeMap.size,
        paidStudents,
        pendingStudents,
        overdueStudents,
      };
    } catch (error) {
      console.error("Erreur calcul résumé financier:", error);
      return {
        totalRevenue: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        refundAmount: 0,
        totalStudents: 0,
        paidStudents: 0,
        pendingStudents: 0,
        overdueStudents: 0,
      };
    }
  }, [allFeesArray]);

  // Transactions récentes
  const recentTransactions = useMemo(() => {
    const transactions: FinancialTransaction[] = [];

    allFeesArray.forEach((fee) => {
      // Ajouter la transaction principale
      transactions.push({
        id: fee.id,
        studentName: fee.studentName,
        amount: fee.paidAmount,
        type: "payment" as const,
        status: getPaymentStatus(fee.status),
        date: fee.updatedAt,
        paymentMethod: fee.paymentMethod,
        description: "Frais académiques",
      });

      // Ajouter les paiements individuels
      if (Array.isArray(fee.payments)) {
        fee.payments.forEach((payment) => {
          transactions.push({
            id: payment.id || `payment-${Date.now()}`,
            studentName: fee.studentName,
            amount: formatAmount(payment.amount),
            type: "payment" as const,
            status: "completed" as const,
            date: payment.date,
            paymentMethod: payment.paymentMethod,
            description: payment.description || "Paiement partiel",
          });
        });
      }
    });

    // Trier par date décroissante et prendre les 8 premiers
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [allFeesArray]);

  // Factures en attente
  const pendingInvoices = useMemo(() => {
    return allFeesArray
      .filter((fee) => {
        const status = fee.status?.toLowerCase();
        return (
          (status === "pending" || status === "overdue" || fee.balance > 0) &&
          fee.balance > 0
        );
      })
      .slice(0, 6)
      .map((fee) => ({
        id: fee.id,
        studentName: fee.studentName,
        amount: fee.balance,
        dueDate: fee.dueDate,
        status: (fee.status?.toLowerCase() === "overdue"
          ? "overdue"
          : "pending") as "pending" | "overdue",
        createdAt: fee.createdAt,
      }));
  }, [allFeesArray]);

  // Étudiants avec retards de paiement
  const overdueStudents = useMemo(() => {
    const overdueFees = allFeesArray.filter(
      (fee) => fee.status?.toLowerCase() === "overdue" && fee.balance > 0
    );

    const studentMap = new Map();
    overdueFees.forEach((fee) => {
      if (fee.studentId) {
        if (!studentMap.has(fee.studentId)) {
          studentMap.set(fee.studentId, {
            student: { name: fee.studentName },
            totalDue: 0,
            fees: [],
            overdueDays: 0,
          });
        }
        const studentData = studentMap.get(fee.studentId);
        studentData.totalDue += fee.balance;
        studentData.fees.push(fee);

        // Calculer les jours de retard
        if (fee.dueDate) {
          try {
            const dueDate = new Date(fee.dueDate);
            const today = new Date();
            const daysOverdue = Math.max(
              0,
              Math.floor(
                (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
              )
            );
            studentData.overdueDays = Math.max(
              studentData.overdueDays,
              daysOverdue
            );
          } catch {
            studentData.overdueDays = Math.max(studentData.overdueDays, 1);
          }
        }
      }
    });

    return Array.from(studentMap.values()).slice(0, 5);
  }, [allFeesArray]);

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchClasses(),
        fetchEnrollments(),
        getAllStudentFees(),
      ]);
      toast.success("Données financières mises à jour");
    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gestion des clics sur les cartes
  const handleCardClick = useCallback(
    (type: string) => {
      let title = "";
      let modalData: any[] = [];
      let modalType: "transactions" | "invoices" | "students" | "details" =
        "transactions";

      switch (type) {
        case "collectedAmount":
          title = "Détails des Paiements Collectés";
          modalData = allFeesArray
            .filter((fee) => fee.paidAmount > 0)
            .map((fee) => ({
              id: fee.id,
              student: fee.studentName,
              amount: fee.paidAmount,
              date: fee.updatedAt,
              method: fee.paymentMethod,
            }));
          modalType = "transactions";
          break;

        case "pendingAmount":
          title = "Paiements en Attente";
          modalData = allFeesArray
            .filter((fee) => fee.balance > 0)
            .map((fee) => ({
              id: fee.id,
              student: fee.studentName,
              amount: fee.balance,
              dueDate: fee.dueDate,
              createdAt: fee.createdAt,
            }));
          modalType = "invoices";
          break;

        case "overdueAmount":
          title = "Paiements en Retard";
          modalData = overdueStudents;
          modalType = "students";
          break;

        case "totalRevenue":
          title = "Analyse des Revenus";
          modalData = [financialSummary];
          modalType = "details";
          break;

        default:
          return;
      }

      setModalTitle(title);
      setModalData(modalData);
      setModalType(modalType);
      setModalOpen(true);
    },
    [allFeesArray, financialSummary, overdueStudents]
  );

  // Composant de carte de statistique
  const StatCard = React.memo(
    ({
      title,
      value,
      icon: Icon,
      description,
      trend,
      color = "primary",
      loading = false,
      clickable = true,
      statKey = "",
    }: {
      title: string;
      value: string | number;
      icon: any;
      description?: string;
      trend?: number;
      color?: string;
      loading?: boolean;
      clickable?: boolean;
      statKey?: string;
    }) => {
      const handleClick = (e: React.MouseEvent) => {
        if (clickable && statKey) {
          e.preventDefault();
          e.stopPropagation();
          handleCardClick(statKey);
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
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">
                <SafeDisplay value={value} type="currency" />
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

  // Composant Modal
  const FinancialModal = () => {
    const handleClose = () => {
      setModalOpen(false);
      setModalData([]);
      setModalTitle("");
    };

    const renderContent = () => {
      if (modalData.length === 0) {
        return (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune donnée disponible</p>
          </div>
        );
      }

      switch (modalType) {
        case "transactions":
          return (
            <div className="space-y-3">
              {modalData.map((transaction: any, index: number) => (
                <div
                  key={transaction.id || index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.student}</p>
                      <p className="text-sm text-muted-foreground">
                        <SafeDisplay value={transaction.date} type="date" />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <SafeDisplay value={transaction.amount} type="currency" />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.method || "Non spécifié"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );

        case "invoices":
          return (
            <div className="space-y-3">
              {modalData.map((invoice: any, index: number) => (
                <div
                  key={invoice.id || index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{invoice.student}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {invoice.id?.substring(0, 8) || "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        invoice.status === "overdue"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {invoice.status === "overdue"
                        ? "En retard"
                        : "En attente"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Échéance</p>
                      <p className="text-sm">
                        <SafeDisplay value={invoice.dueDate} type="date" />
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">
                        <SafeDisplay value={invoice.amount} type="currency" />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

        case "students":
          return (
            <div className="space-y-3">
              {modalData.map((student: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {student.student?.name || "Étudiant inconnu"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.overdueDays > 0
                            ? `${student.overdueDays} jours de retard`
                            : "En retard"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Montant dû:
                      </span>
                      <span className="font-bold text-red-600">
                        <SafeDisplay value={student.totalDue} type="currency" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Nombre de factures:
                      </span>
                      <span className="font-medium">
                        {student.fees?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

        case "details":
          return (
            modalData[0] && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Revenus totaux</p>
                    <p className="text-2xl font-bold text-green-800">
                      <SafeDisplay
                        value={modalData[0].totalRevenue}
                        type="currency"
                      />
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Montant collecté</p>
                    <p className="text-2xl font-bold text-blue-800">
                      <SafeDisplay
                        value={modalData[0].collectedAmount}
                        type="currency"
                      />
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-700">En attente</p>
                    <p className="text-lg font-bold text-amber-800">
                      <SafeDisplay
                        value={modalData[0].pendingAmount}
                        type="currency"
                      />
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-700">Remboursés</p>
                    <p className="text-lg font-bold text-purple-800">
                      <SafeDisplay
                        value={modalData[0].refundAmount}
                        type="currency"
                      />
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Statistiques par étudiant</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {modalData[0].paidStudents || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Payés</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {modalData[0].pendingStudents || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        En attente
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {modalData[0].overdueStudents || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">En retard</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          );

        default:
          return null;
      }
    };

    return (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalTitle}
              <Badge variant="secondary">{modalData.length} élément(s)</Badge>
            </DialogTitle>
            <DialogDescription>
              {modalType === "transactions" &&
                "Détails des transactions financières"}
              {modalType === "invoices" && "Gestion des factures et échéances"}
              {modalType === "students" && "Informations sur les étudiants"}
              {modalType === "details" && "Analyse détaillée des données"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">{renderContent()}</ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                try {
                  // Filtrer uniquement les données simples pour l'export
                  const exportData = modalData.map((item) => {
                    const simpleItem: any = {};
                    for (const key in item) {
                      if (typeof item[key] !== "object" || item[key] === null) {
                        simpleItem[key] = item[key];
                      }
                    }
                    return simpleItem;
                  });

                  const dataStr = JSON.stringify(exportData, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const exportFileDefaultName = `${modalTitle
                    .toLowerCase()
                    .replace(/\s+/g, "_")}_${format(
                    new Date(),
                    "yyyy-MM-dd"
                  )}.json`;

                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  document.body.appendChild(linkElement);
                  linkElement.click();
                  document.body.removeChild(linkElement);

                  toast.success("Données exportées avec succès");
                } catch (error) {
                  console.error("Erreur export:", error);
                  toast.error("Erreur lors de l'export");
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Fonction pour envoyer des rappels
  const sendReminders = () => {
    toast.info("Envoi des rappels de paiement...");
  };

  // Fonction pour générer un rapport
  const generateReport = () => {
    toast.success("Génération du rapport financier...");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <FinancialModal />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Tableau de Bord Comptable
          </h1>
          <p className="text-muted-foreground mt-1">
            Bonjour, {user?.firstName} {user?.lastName} • Gestion financière
            complète
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading || feesLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenus Totaux"
          value={financialSummary.totalRevenue}
          icon={DollarSign}
          description={`Année ${currentAcademicYear?.year || "en cours"}`}
          color="primary"
          loading={loading || feesLoading}
          clickable={true}
          statKey="totalRevenue"
        />

        <StatCard
          title="Montant Collecté"
          value={financialSummary.collectedAmount}
          icon={CreditCard}
          description={`${financialSummary.paidStudents}/${financialSummary.totalStudents} étudiants`}
          color="success"
          loading={loading || feesLoading}
          clickable={true}
          statKey="collectedAmount"
        />

        <StatCard
          title="En Attente"
          value={financialSummary.pendingAmount}
          icon={Clock}
          description={`${financialSummary.pendingStudents} étudiants`}
          color="warning"
          loading={loading || feesLoading}
          clickable={true}
          statKey="pendingAmount"
        />
      </div>

      {/* Navigation par onglets */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-1 md:grid-cols-1">
            {/* Transactions récentes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transactions Récentes</CardTitle>
                    <CardDescription>
                      Derniers paiements enregistrés
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setModalTitle("Toutes les Transactions");
                      setModalData(recentTransactions);
                      setModalType("transactions");
                      setModalOpen(true);
                    }}
                  >
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id || index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              transaction.type === "payment"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "payment" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <SafeDisplay
                                value={transaction.date}
                                type="date"
                              />
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "payment"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            <SafeDisplay
                              value={transaction.amount}
                              type="currency"
                            />
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {transaction.status === "completed"
                                ? "Complété"
                                : transaction.status === "pending"
                                ? "En attente"
                                : transaction.status === "overdue"
                                ? "En retard"
                                : "Annulé"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {transaction.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune transaction récente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Toutes les Transactions</CardTitle>
                  <CardDescription>
                    Historique complet des transactions financières
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-9 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="completed">Complété</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Méthode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions
                      .filter((transaction) => {
                        if (
                          selectedStatus !== "all" &&
                          transaction.status !== selectedStatus
                        ) {
                          return false;
                        }
                        if (
                          searchTerm &&
                          !transaction.studentName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((transaction, index) => (
                        <TableRow key={transaction.id || index}>
                          <TableCell className="font-medium">
                            {transaction.studentName}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${
                                transaction.type === "payment"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <SafeDisplay
                                value={transaction.amount}
                                type="currency"
                              />
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.type === "payment"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {transaction.type === "payment"
                                ? "Paiement"
                                : "Remboursement"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {transaction.status === "completed"
                                ? "Complété"
                                : transaction.status === "pending"
                                ? "En attente"
                                : transaction.status === "partial"
                                ? "partiel"
                                : transaction.status === "overdue"
                                ? "En retard"
                                : "Annulé"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <SafeDisplay value={transaction.date} type="date" />
                          </TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setModalTitle("Détails de la Transaction");
                                setModalData([transaction]);
                                setModalType("transactions");
                                setModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {recentTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Aucune transaction
                    </h3>
                    <p className="text-muted-foreground">
                      Aucune transaction financière n'a été enregistrée.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytique */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-1 md:grid-cols-1">
            {/* Indicateurs de performance */}
            <Card>
              <CardHeader>
                <CardTitle>Indicateurs de Performance</CardTitle>
                <CardDescription>Métriques financières clés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Taux de collecte
                    </span>
                    <span className="text-sm font-bold">
                      {financialSummary.totalRevenue > 0
                        ? Math.round(
                            (financialSummary.collectedAmount /
                              financialSummary.totalRevenue) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      financialSummary.totalRevenue > 0
                        ? Math.round(
                            (financialSummary.collectedAmount /
                              financialSummary.totalRevenue) *
                              100
                          )
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Retards de paiement
                    </span>
                    <span className="text-sm font-bold">
                      {financialSummary.totalStudents > 0
                        ? Math.round(
                            (financialSummary.overdueStudents /
                              financialSummary.totalStudents) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      financialSummary.totalStudents > 0
                        ? Math.round(
                            (financialSummary.overdueStudents /
                              financialSummary.totalStudents) *
                              100
                          )
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Remboursements</span>
                    <span className="text-sm font-bold">
                      {financialSummary.collectedAmount > 0
                        ? Math.round(
                            (financialSummary.refundAmount /
                              financialSummary.collectedAmount) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      financialSummary.collectedAmount > 0
                        ? Math.round(
                            (financialSummary.refundAmount /
                              financialSummary.collectedAmount) *
                              100
                          )
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-800">
                        {financialSummary.totalStudents}
                      </p>
                      <p className="text-xs text-blue-600">Étudiants</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-800">
                        {financialSummary.paidStudents}
                      </p>
                      <p className="text-xs text-green-600">À jour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountantDashboard;
