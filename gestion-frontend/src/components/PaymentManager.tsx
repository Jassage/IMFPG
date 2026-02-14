import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  DollarSign,
  Plus,
  Edit2,
  Check,
  X,
  CreditCard,
  Loader2,
  Wallet,
  BookOpen,
  FileText,
  RefreshCw,
  MoreHorizontal,
  ChevronsUpDown,
  Table as TableIcon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  FileDown,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  BarChart3,
  History,
  Download,
  Eye,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import {
  addDays,
  format,
  differenceInDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import useStudentStore from "@/store/studentStore";
import { StudentFee } from "@/types/enrollementTypes";

interface FeePayment {
  description: string;
  id: string;
  studentFeeId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  recordedBy: string;
  createdAt: string;
}

interface FormData {
  studentFeeId: string;
  amount: number;
  paymentMethod: "cash" | "transfer" | "card" | "check";
  reference: string;
  paymentDate: string;
  description: string;
}

export const PaymentManager = () => {
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const {
    studentFees,
    getStudentFees,
    recordPayment,
    updateFeePayment,
    deleteFeePayment,
    getPaymentHistory,
    getAllStudentFees,
    loading,
  } = useFeeStructureStore();

  const { toast } = useToast();

  // États principaux
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("ALL_STUDENTS");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("ALL_YEARS");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<FeePayment[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editingPayment, setEditingPayment] = useState<FeePayment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<FeePayment | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // États pour les filtres
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Données du formulaire
  const [formData, setFormData] = useState<FormData>({
    studentFeeId: "",
    amount: 0,
    paymentMethod: "cash",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Chargement initial des données
  useEffect(() => {
    const initData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchAcademicYears(),
          getAllStudentFees(),
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données initiales",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    initData();
  }, []);

  // Conversion des frais étudiants en tableau normalisé
  const getStudentFeesAsArray = useMemo(() => {
    if (!studentFees) return [];

    // Si c'est déjà un tableau
    if (Array.isArray(studentFees)) {
      return studentFees;
    }

    // Si c'est un objet, extraire tous les tableaux
    if (typeof studentFees === "object") {
      const arrays: StudentFee[] = [];

      const normalizeStatus = (status: any): StudentFee["status"] => {
        const statusMap: Record<string, StudentFee["status"]> = {
          pending: "Pending",
          partial: "Partially Paid",
          paid: "Paid",
          overdue: "Overdue",
          Pending: "Pending",
          "Partially Paid": "Partially Paid",
          Paid: "Paid",
          Overdue: "Overdue",
        };
        return statusMap[status] || (status as StudentFee["status"]);
      };

      const convertToLocal = (item: any): StudentFee => {
        if (!item || typeof item !== "object") {
          return {
            id: "",
            studentId: "",
            academicYearId: "",
            feeStructure: { id: "", name: "Inconnu" },
            totalAmount: 0,
            paidAmount: 0,
            status: "Pending",
          } as StudentFee;
        }

        return {
          ...item,
          status: normalizeStatus(item.status),
          paidAmount: Number(item.paidAmount) || 0,
          totalAmount: Number(item.totalAmount) || 0,
        } as StudentFee;
      };

      Object.values(studentFees).forEach((value) => {
        if (Array.isArray(value)) {
          arrays.push(...value.map(convertToLocal));
        } else if (value && typeof value === "object") {
          arrays.push(convertToLocal(value));
        }
      });

      return arrays;
    }

    return [];
  }, [studentFees]);

  const feesArray = getStudentFeesAsArray;

  // Chargement des frais par étudiant
  const loadStudentFees = useCallback(
    async (studentId: string) => {
      setDataLoading(true);
      try {
        await getStudentFees(studentId);
      } catch (error) {
        console.error("Erreur lors du chargement des frais:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les frais de l'étudiant",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    },
    [getStudentFees, toast]
  );

  // Chargement de l'historique des paiements
  const loadPaymentHistory = useCallback(
    async (feeId: string) => {
      setHistoryLoading(true);
      try {
        const history = await getPaymentHistory(feeId);
        setPaymentHistory(Array.isArray(history) ? history : []);
        setShowHistory(true);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des paiements",
          variant: "destructive",
        });
        setPaymentHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [getPaymentHistory, toast]
  );

  // Filtrer les étudiants
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    if (!searchTerm) return students;

    return students.filter((student) =>
      `${student.firstName || ""} ${student.lastName || ""} ${
        student.studentCode || ""
      }`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];

    // Validation du frais sélectionné
    if (!formData.studentFeeId) {
      errors.push("Les frais doivent être sélectionnés");
    }

    // Validation du montant
    if (!formData.amount || formData.amount <= 0) {
      errors.push("Le montant doit être positif");
    } else if (formData.amount > 10000000) {
      errors.push("Le montant ne peut pas dépasser 10,000,000 HTG");
    } else if (Math.round(formData.amount * 100) / 100 !== formData.amount) {
      errors.push("Le montant doit avoir au maximum 2 décimales");
    }

    // Validation pour éviter les paiements trop petits
    if (formData.amount < 10) {
      errors.push("Le montant minimum est de 10 HTG");
    }

    // Validation de la description
    if (!formData.description.trim()) {
      errors.push("La description est obligatoire");
    } else if (formData.description.length > 500) {
      errors.push("La description ne peut pas dépasser 500 caractères");
    }

    // Validation de la date
    if (!formData.paymentDate) {
      errors.push("La date de paiement est obligatoire");
    } else {
      const paymentDate = new Date(formData.paymentDate);
      const today = new Date();

      // Ne pas permettre les dates futures
      if (paymentDate > today) {
        errors.push("La date de paiement ne peut pas être dans le futur");
      }

      // Limiter à 2 ans en arrière
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      if (paymentDate < twoYearsAgo) {
        errors.push("La date de paiement ne peut pas être antérieure à 2 ans");
      }
    }

    // Validation du solde disponible
    if (formData.studentFeeId && !editingPayment) {
      const fee = feesArray.find((f) => f.id === formData.studentFeeId);
      if (fee) {
        const remainingBalance = fee.totalAmount - fee.paidAmount;
        if (formData.amount > remainingBalance + 0.01) {
          // Tolérance de 0.01
          errors.push(
            `Le montant ne peut pas dépasser le solde restant (${remainingBalance.toLocaleString()} HTG)`
          );
        }

        // Vérifier si les frais sont déjà entièrement payés
        if (remainingBalance <= 0) {
          errors.push("Ces frais sont déjà entièrement payés");
        }
      }
    }

    // Validation de la référence
    if (formData.reference && formData.reference.length > 100) {
      errors.push("La référence ne peut pas dépasser 100 caractères");
    }

    setFormErrors(errors);
    return errors.length === 0;
  }, [formData, feesArray, editingPayment]);

  // Filtrer les paiements
  const filteredPayments = useMemo(() => {
    if (!feesArray || !Array.isArray(feesArray)) return [];

    let filtered = [...feesArray];

    // Filtrer par étudiant
    if (selectedStudent && selectedStudent !== "ALL_STUDENTS") {
      filtered = filtered.filter(
        (fee) => fee && fee.studentId === selectedStudent
      );
    }

    // Filtrer par année académique
    if (selectedAcademicYear && selectedAcademicYear !== "ALL_YEARS") {
      filtered = filtered.filter(
        (fee) => fee.academicYearId === selectedAcademicYear
      );
    }

    // Filtrer par statut
    if (activeTab && activeTab !== "all") {
      filtered = filtered.filter((fee) => {
        if (
          !fee ||
          typeof fee.paidAmount === "undefined" ||
          typeof fee.totalAmount === "undefined"
        ) {
          return false;
        }

        switch (activeTab) {
          case "paid":
            return Math.abs(fee.paidAmount - fee.totalAmount) < 0.01; // Tolérance de 0.01
          case "partial":
            return (
              fee.paidAmount > 0 && fee.paidAmount < fee.totalAmount - 0.01
            );
          case "pending":
            return fee.paidAmount === 0;
          default:
            return true;
        }
      });
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter((fee) => {
        if (!fee || !fee.studentId) return false;

        const student = students.find((s) => s.id === fee.studentId);
        if (!student) return false;

        const searchText = `${student.firstName || ""} ${
          student.lastName || ""
        } ${student.studentCode || ""}`.toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      });
    }

    // Filtrer par période
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((fee) => {
        // Ici, vous devriez filtrer par date de création ou de paiement
        // Adaptez cette logique selon vos besoins
        return true;
      });
    }

    return filtered;
  }, [
    feesArray,
    selectedStudent,
    selectedAcademicYear,
    activeTab,
    searchTerm,
    students,
    dateRange,
  ]);

  // Gestion des dates
  const formatDateForAPI = useCallback((inputDate: string): string => {
    if (!inputDate) return "";
    // S'assurer que la date est en UTC pour éviter les problèmes de fuseau horaire
    const date = new Date(inputDate);
    date.setHours(12, 0, 0, 0); // Définir à midi pour éviter les problèmes de fuseau horaire
    return date.toISOString();
  }, []);

  // Édition d'un paiement
  const handleEditPayment = useCallback(
    (payment: FeePayment) => {
      console.log("🔄 Ouverture modal d'édition pour:", payment);

      const fee = feesArray.find((f) => f.id === payment.studentFeeId);

      if (!fee) {
        console.error("❌ Frais étudiant non trouvé");
        toast({
          title: "Erreur",
          description: "Impossible de trouver les frais associés",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si l'utilisateur peut modifier ce paiement
      const paymentDate = new Date(payment.paymentDate);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 30) {
        toast({
          title: "Modification limitée",
          description:
            "Vous ne pouvez modifier que les paiements des 30 derniers jours",
          variant: "destructive",
        });
        return;
      }

      setFormData({
        studentFeeId: payment.studentFeeId,
        amount: Number(payment.amount.toFixed(2)),
        paymentMethod: payment.paymentMethod as
          | "cash"
          | "transfer"
          | "card"
          | "check",
        reference: payment.reference || "",
        paymentDate: new Date(payment.paymentDate).toISOString().split("T")[0],
        description: payment.description || "",
      });

      setEditingPayment(payment);
      setShowForm(true);
    },
    [feesArray, toast]
  );

  // Suppression d'un paiement
  const handleDeletePayment = useCallback(async () => {
    if (!deletingPayment) return;

    // Vérifier les contraintes de suppression
    const paymentDate = new Date(deletingPayment.paymentDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 7) {
      toast({
        title: "Suppression impossible",
        description:
          "Vous ne pouvez supprimer que les paiements des 7 derniers jours",
        variant: "destructive",
      });
      setDeletingPayment(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteFeePayment(deletingPayment.id);

      toast({
        title: "Succès",
        description: "Paiement supprimé avec succès",
      });

      // Recharger les données
      if (selectedStudent && selectedStudent !== "ALL_STUDENTS") {
        await loadStudentFees(selectedStudent);
      } else {
        await getAllStudentFees();
      }

      // Recharger l'historique si ouvert
      if (showHistory && deletingPayment) {
        const history = await getPaymentHistory(deletingPayment.studentFeeId);
        setPaymentHistory(history);
      }

      setDeletingPayment(null);
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Impossible de supprimer le paiement";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    deletingPayment,
    deleteFeePayment,
    toast,
    selectedStudent,
    loadStudentFees,
    getAllStudentFees,
    showHistory,
    getPaymentHistory,
  ]);

  // Soumission du formulaire
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast({
          title: "Validation échouée",
          description: "Veuillez corriger les erreurs dans le formulaire",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const apiPayload: any = {
          amount: Number(formData.amount.toFixed(2)),
          paymentMethod: formData.paymentMethod,
          description: formData.description.trim(),
          reference: formData.reference.trim() || null,
        };

        // Ajouter la date formatée pour l'API
        if (formData.paymentDate) {
          apiPayload.paymentDate = formatDateForAPI(formData.paymentDate);
        }

        console.log("📤 Payload API:", apiPayload);

        if (editingPayment) {
          // Vérifier les contraintes de modification
          const originalAmount = editingPayment.amount;
          const fee = feesArray.find(
            (f) => f.id === editingPayment.studentFeeId
          );

          if (fee) {
            const currentBalance =
              fee.totalAmount - fee.paidAmount + originalAmount;
            if (apiPayload.amount > currentBalance) {
              throw new Error(
                `Le montant modifié ne peut pas dépasser ${currentBalance.toLocaleString()} HTG`
              );
            }
          }

          await updateFeePayment(editingPayment.id, apiPayload);
          toast({
            title: "Succès",
            description: "Paiement mis à jour avec succès",
          });
        } else {
          // Pour un nouveau paiement
          apiPayload.studentFeeId = formData.studentFeeId;
          await recordPayment(formData.studentFeeId, apiPayload);
          toast({
            title: "Succès",
            description: "Paiement enregistré avec succès",
          });
        }

        resetForm();
        setShowForm(false);
        setEditingPayment(null);

        // Recharger les données
        if (selectedStudent && selectedStudent !== "ALL_STUDENTS") {
          await loadStudentFees(selectedStudent);
        } else {
          await getAllStudentFees();
        }
      } catch (error: any) {
        console.error("Erreur lors du traitement du paiement:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Une erreur s'est produite lors de l'opération";

        if (
          errorMessage.includes("solde insuffisant") ||
          errorMessage.includes("dépasser")
        ) {
          toast({
            title: "Erreur de montant",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      formData,
      editingPayment,
      feesArray,
      formatDateForAPI,
      updateFeePayment,
      recordPayment,
      selectedStudent,
      loadStudentFees,
      getAllStudentFees,
      toast,
    ]
  );

  // Réinitialisation du formulaire
  const resetForm = useCallback(() => {
    setFormData({
      studentFeeId: "",
      amount: 0,
      paymentMethod: "cash",
      reference: "",
      paymentDate: new Date().toISOString().split("T")[0],
      description: "",
    });
    setFormErrors([]);
    setEditingPayment(null);
    setSelectedStudent("ALL_STUDENTS");
  }, []);

  // Réinitialisation des filtres
  const resetFilters = useCallback(() => {
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setSelectedStudent("ALL_STUDENTS");
    setSelectedAcademicYear("ALL_YEARS");
    setSearchTerm("");
    setCurrentPage(1);
    setActiveTab("all");
  }, []);

  // Obtenir le nom d'un étudiant
  const getStudentName = useCallback(
    (studentId: string) => {
      const student = students.find((s) => s.id === studentId);
      return student
        ? `${student.firstName || ""} ${student.lastName || ""}`
        : "Étudiant inconnu";
    },
    [students]
  );

  // Badge de statut
  const getStatusBadge = useCallback(
    (paidAmount: number, totalAmount: number) => {
      const tolerance = 0.01; // Tolérance pour les arrondis

      if (Math.abs(paidAmount - totalAmount) < tolerance) {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Payé
          </Badge>
        );
      } else if (paidAmount > tolerance) {
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Partiel
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            En attente
          </Badge>
        );
      }
    },
    []
  );

  // Badge de méthode de paiement
  const getPaymentMethodBadge = useCallback((method: string) => {
    const colors = {
      cash: "bg-blue-100 text-blue-800 border-blue-200",
      transfer: "bg-purple-100 text-purple-800 border-purple-200",
      card: "bg-orange-100 text-orange-800 border-orange-200",
      check: "bg-green-100 text-green-800 border-green-200",
    };

    const methodLabels = {
      cash: "Espèces",
      transfer: "Virement",
      card: "Carte",
      check: "Chèque",
    };

    return (
      <Badge
        variant="outline"
        className={cn(
          "text-xs",
          colors[method as keyof typeof colors] || "bg-gray-100"
        )}
      >
        {methodLabels[method as keyof typeof methodLabels] || method}
      </Badge>
    );
  }, []);

  // Pagination
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage)
  );

  // Statistiques
  const getPaymentStats = useCallback(() => {
    const total = filteredPayments.length;
    const paid = filteredPayments.filter(
      (f) => Math.abs(f.paidAmount - f.totalAmount) < 0.01
    ).length;
    const partial = filteredPayments.filter(
      (f) => f.paidAmount > 0 && f.paidAmount < f.totalAmount - 0.01
    ).length;
    const pending = filteredPayments.filter((f) => f.paidAmount === 0).length;
    const totalAmount = filteredPayments.reduce(
      (sum, f) => sum + (f.totalAmount || 0),
      0
    );
    const paidAmount = filteredPayments.reduce(
      (sum, f) => sum + (f.paidAmount || 0),
      0
    );

    return { total, paid, partial, pending, totalAmount, paidAmount };
  }, [filteredPayments]);

  // Affichage de l'année académique
  const getAcademicYearDisplay = useCallback(
    (yearId: string): string => {
      const year = academicYears.find((y) => y.id === yearId);
      return year ? year.year : yearId;
    },
    [academicYears]
  );

  const stats = getPaymentStats();

  // Gestionnaire de changement de page
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  // Gestionnaire de changement d'éléments par page
  const handleItemsPerPageChange = useCallback((value: string) => {
    const newItemsPerPage = Number(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // Chargement des données quand l'étudiant change
  useEffect(() => {
    if (selectedStudent && selectedStudent !== "ALL_STUDENTS") {
      loadStudentFees(selectedStudent);
    }
  }, [selectedStudent, loadStudentFees]);

  // Composant pour formater les montants de manière optimisée
  const AmountDisplay: React.FC<{
    amount: number;
    className?: string;
    showFullOnHover?: boolean;
    compact?: boolean;
  }> = ({
    amount,
    className = "",
    showFullOnHover = true,
    compact = false,
  }) => {
    const formatCompact = useCallback((value: number): string => {
      if (value === 0) return "0 HTG";

      const absValue = Math.abs(value);

      if (absValue >= 1_000_000_000) {
        // Milliard
        const formatted = (value / 1_000_000_000).toFixed(2);
        return `${formatted.replace(/\.?0+$/, "")}Md HTG`;
      }
      if (absValue >= 1_000_000) {
        // Million
        const formatted = (value / 1_000_000).toFixed(2);
        return `${formatted.replace(/\.?0+$/, "")}M HTG`;
      }
      if (absValue >= 100_000) {
        // Cent mille et plus
        const formatted = (value / 1_000).toFixed(1);
        return `${formatted.replace(/\.?0+$/, "")}K HTG`;
      }
      if (absValue >= 10_000) {
        // Dix mille et plus
        const formatted = (value / 1_000).toFixed(1);
        return `${formatted.replace(/\.?0+$/, "")}K HTG`;
      }
      // Pour les petits montants, garder 2 décimales
      return (
        value.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " HTG"
      );
    }, []);

    const formatFull = useCallback((value: number): string => {
      return (
        value.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " HTG"
      );
    }, []);

    const displayAmount = compact ? formatCompact(amount) : formatFull(amount);
    const fullAmount = formatFull(amount);

    if (!showFullOnHover || displayAmount === fullAmount) {
      return <span className={className}>{displayAmount}</span>;
    }

    return (
      <div className="relative inline-block group">
        <span className={`${className} cursor-help`}>{displayAmount}</span>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {fullAmount}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  // Afficher un loader pendant le chargement initial
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Chargement des données...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Veuillez patienter pendant le chargement
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton d'action */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-primary" />
            Gestion des Paiements
          </h2>
          <p className="text-muted-foreground">
            Gérez les paiements des frais académiques des étudiants
          </p>
        </div>

        <Button
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          disabled={dataLoading}
        >
          <Plus className="h-4 w-4" />
          Nouveau Paiement
        </Button>
      </div>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total des frais
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-200">
                <CreditCard className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Montant total
                </p>
                <p className="text-2xl font-bold text-green-900">
                  <AmountDisplay
                    amount={stats.totalAmount}
                    compact
                    showFullOnHover={stats.totalAmount >= 10000}
                  />
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-200">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Moyenne par frais</span>
                <span>
                  <AmountDisplay
                    amount={
                      stats.total > 0 ? stats.totalAmount / stats.total : 0
                    }
                    compact
                    showFullOnHover={stats.totalAmount >= 10000}
                  />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Montant payé
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  <AmountDisplay
                    amount={stats.paidAmount}
                    compact
                    showFullOnHover={stats.paidAmount >= 10000}
                  />
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-200">
                <Check className="h-5 w-5 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Taux de paiement</span>
                <span className="font-medium">
                  {stats.totalAmount > 0
                    ? Math.round((stats.paidAmount / stats.totalAmount) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Solde restant
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  <AmountDisplay
                    amount={stats.totalAmount - stats.paidAmount}
                    compact
                    showFullOnHover={
                      stats.totalAmount - stats.paidAmount >= 10000
                    }
                  />
                </p>
              </div>
              <div className="p-2 rounded-full bg-purple-200">
                <Wallet className="h-5 w-5 text-purple-700" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Pourcentage restant</span>
                <span className="font-medium">
                  {stats.totalAmount > 0
                    ? Math.round(
                        ((stats.totalAmount - stats.paidAmount) /
                          stats.totalAmount) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de filtres et recherche */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Étudiant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_STUDENTS">Tous les étudiants</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedAcademicYear}
              onValueChange={setSelectedAcademicYear}
            >
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Année académique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_YEARS">Toutes les années</SelectItem>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 w-full"
                onClick={resetFilters}
                disabled={dataLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Tous ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="paid" className="flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Payés ({stats.paid})
                </TabsTrigger>
                <TabsTrigger
                  value="partial"
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Partiels ({stats.partial})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  En attente ({stats.pending})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Liste des frais */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Frais des étudiants</CardTitle>
              <CardDescription>
                {filteredPayments.length} résultat(s) trouvé(s)
                {dataLoading && " - Chargement en cours..."}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={filteredPayments.length === 0 || dataLoading}
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-9 w-9 p-0"
                disabled={dataLoading}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-9 w-9 p-0"
                disabled={dataLoading}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des données...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun frais trouvé</p>
              <p className="text-sm mt-2">
                Ajustez vos filtres ou ajoutez de nouveaux frais
              </p>
            </div>
          ) : viewMode === "table" ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Frais</TableHead>
                      <TableHead>Année</TableHead>
                      <TableHead className="text-right">
                        Montant total
                      </TableHead>
                      <TableHead className="text-right">Montant payé</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{getStudentName(fee.studentId)}</div>
                            <div className="text-xs text-muted-foreground">
                              {
                                students.find((s) => s.id === fee.studentId)
                                  ?.studentCode
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {fee.feeStructure?.name || "Inconnu"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getAcademicYearDisplay(fee.academicYearId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {fee.totalAmount.toLocaleString()} HTG
                        </TableCell>
                        <TableCell className="text-right">
                          {fee.paidAmount.toLocaleString()} HTG
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(fee.paidAmount, fee.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(fee.studentId);
                                setFormData({
                                  studentFeeId: fee.id,
                                  amount: Math.max(
                                    0,
                                    fee.totalAmount - fee.paidAmount
                                  ),
                                  paymentMethod: "cash",
                                  reference: "",
                                  paymentDate: new Date()
                                    .toISOString()
                                    .split("T")[0],
                                  description: `Paiement pour ${
                                    fee.feeStructure?.name || "frais"
                                  }`,
                                });
                                setShowForm(true);
                              }}
                              disabled={
                                fee.paidAmount >= fee.totalAmount - 0.01 ||
                                dataLoading
                              }
                            >
                              Payer
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadPaymentHistory(fee.id)}
                              disabled={historyLoading}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredPayments.length
                    )}{" "}
                    sur {filteredPayments.length} entrées
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={currentPage === pageNum}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            // Vue cartes
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPayments.map((fee) => (
                <Card key={fee.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {fee.feeStructure?.name || "Inconnu"}
                        </CardTitle>
                        <CardDescription>
                          {getStudentName(fee.studentId)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(fee.paidAmount, fee.totalAmount)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="font-bold">
                          {fee.totalAmount.toLocaleString()} HTG
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Payé:</span>
                        <span className="text-green-600">
                          {fee.paidAmount.toLocaleString()} HTG
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Restant:</span>
                        <span className="text-amber-600">
                          {(fee.totalAmount - fee.paidAmount).toLocaleString()}{" "}
                          HTG
                        </span>
                      </div>

                      <Progress
                        value={(fee.paidAmount / fee.totalAmount) * 100}
                        className="h-2"
                      />

                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="outline">
                          {getAcademicYearDisplay(fee.academicYearId)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(fee.studentId);
                              setFormData({
                                studentFeeId: fee.id,
                                amount: Math.max(
                                  0,
                                  fee.totalAmount - fee.paidAmount
                                ),
                                paymentMethod: "cash",
                                reference: "",
                                paymentDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                                description: `Paiement pour ${
                                  fee.feeStructure?.name || "frais"
                                }`,
                              });
                              setShowForm(true);
                            }}
                            disabled={
                              fee.paidAmount >= fee.totalAmount - 0.01 ||
                              dataLoading
                            }
                          >
                            Payer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadPaymentHistory(fee.id)}
                            disabled={historyLoading}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de paiement */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
          setShowForm(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {editingPayment
                ? "Modifier le Paiement"
                : "Enregistrer un Paiement"}
            </DialogTitle>
            <DialogDescription>
              {editingPayment
                ? "Modifiez les informations du paiement existant"
                : "Remplissez les informations pour enregistrer un nouveau paiement"}
            </DialogDescription>
          </DialogHeader>

          {formErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation échouée</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Étudiant *</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={!!editingPayment}
                    >
                      {selectedStudent && selectedStudent !== "ALL_STUDENTS"
                        ? getStudentName(selectedStudent)
                        : "Sélectionner un étudiant..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Rechercher un étudiant..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>Aucun étudiant trouvé</CommandEmpty>
                        <CommandGroup>
                          {filteredStudents.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={student.id}
                              onSelect={() => {
                                setSelectedStudent(student.id);
                                setOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedStudent === student.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {student.firstName} {student.lastName} (
                              {student.studentCode})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedStudent && selectedStudent !== "ALL_STUDENTS" && (
                <div className="space-y-2">
                  <Label htmlFor="fee">Frais à payer *</Label>
                  <Select
                    value={formData.studentFeeId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, studentFeeId: value })
                    }
                    disabled={!!editingPayment}
                  >
                    <SelectTrigger id="fee">
                      <SelectValue placeholder="Sélectionner les frais" />
                    </SelectTrigger>
                    <SelectContent>
                      {feesArray.filter(
                        (fee) => fee.studentId === selectedStudent
                      ).length === 0 ? (
                        <SelectItem value="no-fees" disabled>
                          Aucun frais trouvé pour cet étudiant
                        </SelectItem>
                      ) : (
                        feesArray
                          .filter((fee) => fee.studentId === selectedStudent)
                          .map((fee) => (
                            <SelectItem
                              key={fee.id}
                              value={fee.id}
                              disabled={
                                fee.paidAmount >= fee.totalAmount - 0.01
                              }
                            >
                              {fee.feeStructure?.name || "Inconnu"} - Restant:{" "}
                              {(
                                fee.totalAmount - fee.paidAmount
                              ).toLocaleString()}{" "}
                              HTG
                              {fee.paidAmount >= fee.totalAmount - 0.01 &&
                                " (Payé)"}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {formData.studentFeeId && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700">Information</AlertTitle>
                <AlertDescription className="text-blue-600">
                  {(() => {
                    const fee = feesArray.find(
                      (f) => f.id === formData.studentFeeId
                    );
                    if (!fee) return "Frais non trouvé";
                    const remaining = fee.totalAmount - fee.paidAmount;
                    return `Solde restant: ${remaining.toLocaleString()} HTG - Maximum autorisé: ${remaining.toLocaleString()} HTG`;
                  })()}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (HTG) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: Math.max(0, Number(e.target.value)),
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="10"
                  max="10000000"
                />
                <p className="text-xs text-muted-foreground">
                  Montant entre 10 HTG et 10,000,000 HTG
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Méthode de paiement *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value as any })
                  }
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="transfer">Virement</SelectItem>
                    <SelectItem value="card">Carte</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date du paiement *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Ne peut pas être dans le futur
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence (optionnel)</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  placeholder="Numéro de référence"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 100 caractères
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du paiement..."
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Décrivez le motif de ce paiement
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.studentFeeId}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingPayment
                  ? "Modifier le paiement"
                  : "Enregistrer le paiement"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal d'historique des paiements */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des Paiements
            </DialogTitle>
            <DialogDescription>
              Détails des paiements effectués pour ces frais
            </DialogDescription>
          </DialogHeader>

          {historyLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Chargement de l'historique...</span>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun historique de paiement trouvé</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const today = new Date();
                    const diffDays = Math.floor(
                      (today.getTime() - paymentDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const canEdit = diffDays <= 30;
                    const canDelete = diffDays <= 7;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {paymentDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {payment.amount.toLocaleString()} HTG
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.reference || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditPayment(payment)}
                                disabled={!canEdit}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Modifier
                                {!canEdit && " (30 jours max)"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeletingPayment(payment)}
                                disabled={!canDelete}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                                {!canDelete && " (7 jours max)"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog
        open={!!deletingPayment}
        onOpenChange={(open) => !open && setDeletingPayment(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Supprimer le paiement
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>

          {deletingPayment && (
            <div className="grid gap-4 py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vous ne pouvez supprimer que les paiements des 7 derniers
                  jours.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Montant:</Label>
                <div className="col-span-3 font-medium">
                  {deletingPayment.amount.toLocaleString()} HTG
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date:</Label>
                <div className="col-span-3">
                  {new Date(deletingPayment.paymentDate).toLocaleDateString()}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Méthode:</Label>
                <div className="col-span-3">
                  {getPaymentMethodBadge(deletingPayment.paymentMethod)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description:</Label>
                <div className="col-span-3 text-sm">
                  {deletingPayment.description}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingPayment(null)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePayment}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
