import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  Calendar,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Table as TableIcon,
  LayoutGrid,
  BarChart3,
  MoreHorizontal,
  X,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useExpenseStore } from "@/store/expenseStore";
import { Expense } from "@/types/academic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/authStore";
import { toast, useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface ExpenseFormData {
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface DateRange {
  from: string;
  to: string;
}

interface PDFReportProps {
  expenses: Expense[];
}

interface ReportPeriod {
  type: "all" | "custom";
  startDate?: string;
  endDate?: string;
}

// Composant Pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Composant DateRangeFilter
const DateRangeFilter: React.FC<{
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  onReset: () => void;
}> = ({ dateRange, onChange, onReset }) => {
  const hasDateFilter = dateRange.from || dateRange.to;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Période</Label>
        {hasDateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-xs">
            Du
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateRange.from}
            onChange={(e) => onChange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-xs">
            Au
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateRange.to}
            onChange={(e) => onChange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

// Composant ViewToggle
const ViewToggle: React.FC<{
  view: "table" | "grid" | "chart";
  onViewChange: (view: "table" | "grid" | "chart") => void;
}> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8 px-3"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "chart" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("chart")}
        className="h-8 px-3"
      >
        <BarChart3 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Composant Statistics
const Statistics: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const approved = expenses
      .filter((exp) => exp.status === "Approved")
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const pending = expenses
      .filter((exp) => exp.status === "Pending")
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const rejected = expenses
      .filter((exp) => exp.status === "Rejected")
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const byCategory = expenses.reduce((acc, exp) => {
      const category = exp.category || "Non catégorisé";
      acc[category] = (acc[category] || 0) + (exp.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    return { total, approved, pending, rejected, byCategory };
  }, [expenses]);

  const chartData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = [
    { name: "Approuvées", value: stats.approved, color: "#10b981" },
    { name: "En attente", value: stats.pending, color: "#f59e0b" },
    { name: "Rejetées", value: stats.rejected, color: "#ef4444" },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Aperçu des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved.toLocaleString()} HTG
              </div>
              <div className="text-xs text-muted-foreground">Approuvées</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending.toLocaleString()} HTG
              </div>
              <div className="text-xs text-muted-foreground">En attente</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected.toLocaleString()} HTG
              </div>
              <div className="text-xs text-muted-foreground">Rejetées</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {stats.total.toLocaleString()} HTG
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Répartition par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} HTG`, "Montant"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Statut des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} HTG`, "Montant"]} />
              <Bar dataKey="value" fill="#8884d8">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant FilterBadges
const FilterBadges: React.FC<{
  filters: {
    search: string;
    category: string;
    status: string;
    dateRange: DateRange;
  };
  onRemoveFilter: (filterType: string) => void;
  onResetAll: () => void;
}> = ({ filters, onRemoveFilter, onResetAll }) => {
  const activeFilters = [
    filters.search && {
      type: "search",
      label: `Recherche: "${filters.search}"`,
    },
    filters.category !== "all" && {
      type: "category",
      label: `Catégorie: ${filters.category}`,
    },
    filters.status !== "all" && {
      type: "status",
      label: `Statut: ${filters.status}`,
    },
    (filters.dateRange.from || filters.dateRange.to) && {
      type: "dateRange",
      label: `Période: ${filters.dateRange.from || "∞"} → ${
        filters.dateRange.to || "∞"
      }`,
    },
  ].filter(Boolean);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border rounded-lg bg-muted/50">
      <span className="text-sm text-muted-foreground">Filtres actifs:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1 py-1"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.type)}
            className="h-3 w-3 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3 mr-1" />
        Tout effacer
      </Button>
    </div>
  );
};
export const PDFReportGenerator: React.FC<PDFReportProps> = ({ expenses }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [period, setPeriod] = useState<ReportPeriod>({ type: "all" });

  const { toast } = useToast();

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Filtrer les dépenses selon la période
      const filteredExpenses = expenses.filter((expense) => {
        if (period.type === "all") return true;

        if (period.startDate && period.endDate) {
          const expenseDate = new Date(expense.date);
          const startDate = new Date(period.startDate);
          const endDate = new Date(period.endDate);
          endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin

          return expenseDate >= startDate && expenseDate <= endDate;
        }

        return true;
      });

      // Calculer les statistiques
      const stats = {
        total: filteredExpenses.reduce(
          (sum, exp) => sum + (exp.amount || 0),
          0
        ),
        approved: filteredExpenses
          .filter((exp) => exp.status === "Approved")
          .reduce((sum, exp) => sum + (exp.amount || 0), 0),
        pending: filteredExpenses
          .filter((exp) => exp.status === "Pending")
          .reduce((sum, exp) => sum + (exp.amount || 0), 0),
        rejected: filteredExpenses
          .filter((exp) => exp.status === "Rejected")
          .reduce((sum, exp) => sum + (exp.amount || 0), 0),
        count: filteredExpenses.length,
      };

      // Créer le contenu HTML pour le PDF
      const content = createPDFContent(filteredExpenses, stats, period);

      // Ouvrir une nouvelle fenêtre avec le contenu HTML
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();

        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          // Ne pas fermer immédiatement pour permettre à l'utilisateur de voir le PDF
        };
      }

      toast({
        title: "Rapport généré",
        description: "Le rapport PDF a été généré avec succès",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createPDFContent = (
    filteredExpenses: Expense[],
    stats: any,
    period: ReportPeriod
  ) => {
    const periodText =
      period.type === "all"
        ? "Toute période"
        : `Du ${format(new Date(period.startDate!), "dd/MM/yyyy", {
            locale: fr,
          })} au ${format(new Date(period.endDate!), "dd/MM/yyyy", {
            locale: fr,
          })}`;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rapport des Dépenses - Université Innovante</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Inter', sans-serif;
                  line-height: 1.6;
                  color: #1f2937;
                  background: #ffffff;
                  padding: 20px;
              }
              
              .container {
                  max-width: 1000px;
                  margin: 0 auto;
              }
              
              .header {
                  text-align: center;
                  margin-bottom: 40px;
                  padding-bottom: 20px;
                  border-bottom: 3px solid #3b82f6;
              }
              
              .university-name {
                  font-size: 24px;
                  font-weight: 700;
                  color: #1e40af;
                  margin-bottom: 5px;
              }
              
              .university-subtitle {
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 10px;
              }
              
              .report-title {
                  font-size: 28px;
                  font-weight: 700;
                  color: #1f2937;
                  margin: 20px 0;
              }
              
              .report-meta {
                  display: flex;
                  justify-content: space-between;
                  background: #f8fafc;
                  padding: 15px;
                  border-radius: 8px;
                  margin-bottom: 30px;
              }
              
              .meta-item {
                  text-align: center;
              }
              
              .meta-label {
                  font-size: 12px;
                  color: #6b7280;
                  text-transform: uppercase;
                  font-weight: 600;
              }
              
              .meta-value {
                  font-size: 16px;
                  font-weight: 700;
                  color: #1f2937;
              }
              
              .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 15px;
                  margin-bottom: 30px;
              }
              
              .stat-card {
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              
              .stat-value {
                  font-size: 24px;
                  font-weight: 700;
                  margin-bottom: 5px;
              }
              
              .stat-label {
                  font-size: 12px;
                  color: #6b7280;
                  text-transform: uppercase;
                  font-weight: 600;
              }
              
              .total { color: #1f2937; }
              .approved { color: #10b981; }
              .pending { color: #f59e0b; }
              .rejected { color: #ef4444; }
              
              .expenses-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 30px;
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              
              .expenses-table th {
                  background: #3b82f6;
                  color: white;
                  padding: 12px 15px;
                  text-align: left;
                  font-weight: 600;
                  font-size: 12px;
                  text-transform: uppercase;
              }
              
              .expenses-table td {
                  padding: 12px 15px;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 13px;
              }
              
              .expenses-table tr:last-child td {
                  border-bottom: none;
              }
              
              .expenses-table tr:nth-child(even) {
                  background: #f8fafc;
              }
              
              .status-badge {
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
              }
              
              .status-approved { background: #d1fae5; color: #065f46; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .status-rejected { background: #fee2e2; color: #991b1b; }
              
              .amount {
                  font-weight: 600;
                  text-align: right;
              }
              
              .summary {
                  background: #f8fafc;
                  padding: 20px;
                  border-radius: 8px;
                  margin-top: 30px;
              }
              
              .summary-title {
                  font-size: 16px;
                  font-weight: 700;
                  margin-bottom: 15px;
                  color: #1f2937;
              }
              
              .summary-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
              }
              
              .summary-item {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  border-bottom: 1px solid #e5e7eb;
              }
              
              .summary-item:last-child {
                  border-bottom: none;
                  font-weight: 700;
                  font-size: 16px;
              }
              
              .footer {
                  text-align: center;
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 12px;
              }
              
              .watermark {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 80px;
                  color: rgba(59, 130, 246, 0.1);
                  font-weight: 700;
                  pointer-events: none;
                  z-index: -1;
              }
              
              @media print {
                  body {
                      padding: 0;
                  }
                  
                  .container {
                      max-width: none;
                  }
                  
                  .no-print {
                      display: none;
                  }
              }
          </style>
      </head>
      <body>
          <div class="watermark">UNIVERSITÉ INNOVANTE</div>
          
          <div class="container">
              <!-- En-tête -->
              <div class="header">
                  <div class="university-name">UNIVERSITÉ INNOVANTE HAÏTI</div>
                  <div class="university-subtitle">Excellence • Innovation • Leadership</div>
                  <div class="report-title">RAPPORT DES DÉPENSES</div>
                  
                  <div class="report-meta">
                      <div class="meta-item">
                          <div class="meta-label">Période</div>
                          <div class="meta-value">${periodText}</div>
                      </div>
                      <div class="meta-item">
                          <div class="meta-label">Date de génération</div>
                          <div class="meta-value">${format(
                            new Date(),
                            "dd/MM/yyyy à HH:mm",
                            { locale: fr }
                          )}</div>
                      </div>
                      <div class="meta-item">
                          <div class="meta-label">Total des dépenses</div>
                          <div class="meta-value">${stats.count}</div>
                      </div>
                  </div>
              </div>
              
              <!-- Statistiques principales -->
              <div class="stats-grid">
                  <div class="stat-card">
                      <div class="stat-value total">${stats.total.toLocaleString()} HTG</div>
                      <div class="stat-label">Montant Total</div>
                  </div>
                  <div class="stat-card">
                      <div class="stat-value approved">${stats.approved.toLocaleString()} HTG</div>
                      <div class="stat-label">Approuvées</div>
                  </div>
                  <div class="stat-card">
                      <div class="stat-value pending">${stats.pending.toLocaleString()} HTG</div>
                      <div class="stat-label">En Attente</div>
                  </div>
                  <div class="stat-card">
                      <div class="stat-value rejected">${stats.rejected.toLocaleString()} HTG</div>
                      <div class="stat-label">Rejetées</div>
                  </div>
              </div>
              
              <!-- Tableau des dépenses -->
              <table class="expenses-table">
                  <thead>
                      <tr>
                          <th>Date</th>
                          <th>Catégorie</th>
                          <th>Description</th>
                          <th>Moyen de Paiement</th>
                          <th>Statut</th>
                          <th style="text-align: right;">Montant</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${filteredExpenses
                        .map(
                          (expense) => `
                          <tr>
                              <td>${format(
                                new Date(expense.date),
                                "dd/MM/yyyy",
                                { locale: fr }
                              )}</td>
                              <td>${expense.category}</td>
                              <td>${expense.description}</td>
                              <td>${expense.paymentMethod}</td>
                              <td>
                                  <span class="status-badge status-${expense.status.toLowerCase()}">
                                      ${
                                        expense.status === "Approved"
                                          ? "Approuvé"
                                          : expense.status === "Pending"
                                          ? "En Attente"
                                          : "Rejeté"
                                      }
                                  </span>
                              </td>
                              <td class="amount">${expense.amount.toLocaleString()} HTG</td>
                          </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>
              
              <!-- Résumé détaillé -->
              <div class="summary">
                  <div class="summary-title">RÉSUMÉ DÉTAILLÉ</div>
                  <div class="summary-grid">
                      <div>
                          <div class="summary-item">
                              <span>Total des dépenses approuvées:</span>
                              <span>${stats.approved.toLocaleString()} HTG</span>
                          </div>
                          <div class="summary-item">
                              <span>Total des dépenses en attente:</span>
                              <span>${stats.pending.toLocaleString()} HTG</span>
                          </div>
                          <div class="summary-item">
                              <span>Total des dépenses rejetées:</span>
                              <span>${stats.rejected.toLocaleString()} HTG</span>
                          </div>
                      </div>
                      <div>
                          <div class="summary-item">
                              <span>Nombre total de dépenses:</span>
                              <span>${stats.count}</span>
                          </div>
                          <div class="summary-item">
                              <span>Dépenses approuvées:</span>
                              <span>${
                                filteredExpenses.filter(
                                  (e) => e.status === "Approved"
                                ).length
                              }</span>
                          </div>
                          <div class="summary-item">
                              <span>Dépenses en attente:</span>
                              <span>${
                                filteredExpenses.filter(
                                  (e) => e.status === "Pending"
                                ).length
                              }</span>
                          </div>
                          <div class="summary-item">
                              <span>Dépenses rejetées:</span>
                              <span>${
                                filteredExpenses.filter(
                                  (e) => e.status === "Rejected"
                                ).length
                              }</span>
                          </div>
                      </div>
                  </div>
                  <div class="summary-item" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #3b82f6;">
                      <span>SOLDE FINAL:</span>
                      <span style="color: #1e40af; font-size: 18px;">${stats.total.toLocaleString()} HTG</span>
                  </div>
              </div>
              
              <!-- Pied de page -->
              <div class="footer">
                  <p>Rapport généré automatiquement par le Système de Gestion Universitaire</p>
                  <p>Université Innovante Haïti • Delmas 33, Port-au-Prince • Tel: (+509) 28 11 1111</p>
                  <p>www.universite-innovante.edu.ht • info@universite-innovante.edu.ht</p>
                  <p style="margin-top: 10px; font-style: italic;">
                      "Former les leaders de demain avec excellence et innovation"
                  </p>
              </div>
          </div>
          
          <script>
              // Auto-print after loading
              window.onload = function() {
                  setTimeout(() => {
                      window.print();
                  }, 500);
              };
          </script>
      </body>
      </html>
    `;
  };

  const isValidPeriod = () => {
    if (period.type === "all") return true;
    if (period.type === "custom" && period.startDate && period.endDate) {
      return new Date(period.startDate) <= new Date(period.endDate);
    }
    return false;
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Générer PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générer un Rapport PDF
          </DialogTitle>
          <DialogDescription>
            Choisissez la période pour votre rapport des dépenses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup
            value={period.type}
            onValueChange={(value: "all" | "custom") =>
              setPeriod({ type: value, startDate: "", endDate: "" })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal">
                Toutes les dépenses
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="font-normal">
                Période spécifique
              </Label>
            </div>
          </RadioGroup>

          {period.type === "custom" && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={period.startDate || ""}
                  onChange={(e) =>
                    setPeriod({ ...period, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={period.endDate || ""}
                  onChange={(e) =>
                    setPeriod({ ...period, endDate: e.target.value })
                  }
                />
              </div>
              {period.startDate &&
                period.endDate &&
                new Date(period.startDate) > new Date(period.endDate) && (
                  <div className="col-span-2 text-sm text-red-600">
                    La date de début doit être antérieure à la date de fin
                  </div>
                )}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Informations du rapport
                </p>
                <p className="text-sm text-blue-700">
                  {period.type === "all"
                    ? "Le rapport inclura toutes les dépenses sans filtre de date."
                    : `Période du ${
                        period.startDate
                          ? format(new Date(period.startDate), "dd/MM/yyyy", {
                              locale: fr,
                            })
                          : "..."
                      } au ${
                        period.endDate
                          ? format(new Date(period.endDate), "dd/MM/yyyy", {
                              locale: fr,
                            })
                          : "..."
                      }`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isGenerating}
          >
            Annuler
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating || !isValidPeriod()}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGenerating ? "Génération..." : "Générer le PDF"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export const ExpenseManager: React.FC = () => {
  // États modaux
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // États filtres et vue
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState<"table" | "grid" | "chart">("table");

  // États de chargement et erreurs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Store
  const {
    expenses,
    loading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseStore();
  const { user } = useAuthStore();

  // Form data
  const [formData, setFormData] = useState<ExpenseFormData>({
    category: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Espèces",
    status: "Pending",
  });

  // Données statiques
  const categories = [
    "Salaires",
    "Équipement",
    "Maintenance",
    "Fournitures",
    "Services",
    "Loyer",
    "Utilities",
    "Autre",
  ];
  const paymentMethods = ["Espèces", "Virement", "Carte", "Chèque"];

  // Chargement initial
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filtrage des données
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchSearch =
        !search ||
        expense.category?.toLowerCase().includes(search.toLowerCase()) ||
        expense.description?.toLowerCase().includes(search.toLowerCase()) ||
        expense.paymentMethod?.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "all" || expense.category === category;
      const matchStatus = status === "all" || expense.status === status;

      const matchDate =
        (!dateRange.from || expense.date >= dateRange.from) &&
        (!dateRange.to || expense.date <= dateRange.to);

      return matchSearch && matchCategory && matchStatus && matchDate;
    });
  }, [expenses, search, category, status, dateRange]);

  // Pagination
  const paginatedExpenses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredExpenses.slice(start, start + pageSize);
  }, [filteredExpenses, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / pageSize));

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [search, category, status, dateRange, pageSize]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.category.trim()) errors.push("La catégorie est obligatoire");

    if (!formData.amount || formData.amount <= 0)
      errors.push("Le montant doit être positif");

    if (formData.amount > 10000000) errors.push("Le montant semble trop élevé");

    if (!formData.date) errors.push("La date est obligatoire");

    if (!formData.paymentMethod)
      errors.push("Le moyen de paiement est obligatoire");

    setFormErrors(errors);
    return errors.length === 0;
  };

  // Handlers pour les filtres
  const handleResetAllFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setDateRange({ from: "", to: "" });
    setPage(1);
  };

  const handleRemoveFilter = (filterType: string) => {
    switch (filterType) {
      case "search":
        setSearch("");
        break;
      case "category":
        setCategory("all");
        break;
      case "status":
        setStatus("all");
        break;
      case "dateRange":
        setDateRange({ from: "", to: "" });
        break;
    }
    setPage(1);
  };

  const handleResetDateRange = () => {
    setDateRange({ from: "", to: "" });
  };

  const hasActiveFilters =
    search ||
    category !== "all" ||
    status !== "all" ||
    dateRange.from ||
    dateRange.to;

  // Handlers pour les dépenses
  const handleAddClick = () => {
    setFormData({
      category: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Espèces",
      status: "Pending",
    });
    setEditingExpense(null);
    setFormErrors([]);
    setIsFormOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setFormData({
      category: expense.category || "",
      amount: expense.amount || 0,
      description: expense.description || "",
      date: expense.date
        ? expense.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      paymentMethod: expense.paymentMethod || "Espèces",
      status: (expense.status ?? "Pending") as
        | "Pending"
        | "Approved"
        | "Rejected",
    });
    setEditingExpense(expense);
    setFormErrors([]);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setDeletingExpense(expense);
    setIsDeleteOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const expenseData = {
        ...formData,
        createdBy: user.id,
        amount: Number(formData.amount),
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast({
          title: "Succès",
          description: "Dépense modifiée avec succès",
        });
      } else {
        await addExpense(expenseData);
        toast({
          title: "Succès",
          description: "Dépense ajoutée avec succès",
        });
      }

      setIsFormOpen(false);
      setEditingExpense(null);
      setFormData({
        category: "",
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Espèces",
        status: "Pending",
      });
    } catch (error: any) {
      console.error("Error submitting expense:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur s'est produite lors de l'opération";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;

    setIsSubmitting(true);
    try {
      await deleteExpense(deletingExpense.id);
      toast({
        title: "Succès",
        description: "Dépense supprimée avec succès",
      });
      setIsDeleteOpen(false);
      setDeletingExpense(null);
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      const errorMessage =
        error.response?.data?.message || "Impossible de supprimer la dépense";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    // Simulation d'export
    toast({
      title: "Export en cours...",
      description: "Vos données sont en cours de préparation",
    });
  };

  // État de chargement
  if (loading && expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Rendu du contenu selon la vue
  const renderContent = () => {
    if (filteredExpenses.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-16 w-16 mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              Aucune dépense trouvée
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "Aucune dépense ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre première dépense."}
            </p>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleResetAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              )}
              <Button onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une dépense
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (view) {
      case "chart":
        return <Statistics expenses={filteredExpenses} />;

      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedExpenses.map((expense) => (
              <Card
                key={expense.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {expense.category}
                        </h4>
                        <Badge
                          className={
                            expense.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : expense.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3">
                    {expense.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span>{expense.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-red-600">
                      {expense.amount.toLocaleString()} HTG
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditClick(expense)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(expense)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "table":
      default:
        return (
          <Card>
            <CardContent className="p-0">
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Moyen de Paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.category}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            expense.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : expense.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        {expense.amount.toLocaleString()} HTG
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(expense)}
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(expense)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Dépenses
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes les dépenses de l'établissement
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetAllFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
          <PDFReportGenerator expenses={expenses} />
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Dépense
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <Statistics expenses={expenses} />

      {/* Filtres et contrôles */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
            <div className="flex items-center gap-4">
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearch("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Approved">Approuvé</SelectItem>
                  <SelectItem value="Rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items par page</Label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vue</Label>
              <Select
                value={view}
                onValueChange={(value: "table" | "grid" | "chart") =>
                  setView(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Tableau</SelectItem>
                  <SelectItem value="grid">Grille</SelectItem>
                  <SelectItem value="chart">Graphique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtre par date */}
          <DateRangeFilter
            dateRange={dateRange}
            onChange={setDateRange}
            onReset={handleResetDateRange}
          />

          {/* Badges des filtres actifs */}
          <FilterBadges
            filters={{ search, category, status, dateRange }}
            onRemoveFilter={handleRemoveFilter}
            onResetAll={handleResetAllFilters}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>{filteredExpenses.length} dépenses trouvées</div>
            {view === "table" && (
              <div>
                Affichage de {(page - 1) * pageSize + 1} à{" "}
                {Math.min(page * pageSize, filteredExpenses.length)} sur{" "}
                {filteredExpenses.length} éléments
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <div className="space-y-4">
        {renderContent()}

        {/* Pagination */}
        {view !== "chart" && totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de formulaire */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Modifier la Dépense" : "Nouvelle Dépense"}
            </DialogTitle>
            <DialogDescription>
              {editingExpense
                ? "Modifiez les informations de la dépense"
                : "Remplissez les informations pour ajouter une nouvelle dépense"}
            </DialogDescription>
          </DialogHeader>

          {formErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant (HTG) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Moyen de Paiement *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                  required
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Sélectionner un moyen" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "Pending" | "Approved" | "Rejected",
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Approved">Approuvé</SelectItem>
                  <SelectItem value="Rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description de la dépense..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingExpense ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la dépense "
              {deletingExpense?.category}" d'un montant de{" "}
              {deletingExpense?.amount?.toLocaleString()} HTG ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
