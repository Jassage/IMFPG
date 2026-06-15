import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import {
  Plus,
  CreditCard,
  Calendar,
  Receipt,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  History,
  Loader2,
  Eye,
  FileText,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentFeesSectionProps {
  student: any;
  currentEnrollment: any;
}

interface PaymentFormData {
  amount: number;
  paymentMethod: "cash" | "transfer" | "card" | "check";
  reference: string;
  paymentDate: string;
  description: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const StudentFeesSection: React.FC<StudentFeesSectionProps> = ({
  student,
  currentEnrollment,
}) => {
  const {
    studentFees,
    loading,
    getStudentFees, // Corrigé: utiliser getStudentFees au lieu de getStudentFeesByStudentId
    recordPayment,
    getPaymentHistory,
    applyDiscount,
    clearStudentFees,
  } = useFeeStructureStore();

  const { user } = useAuthStore();

  // États principaux
  const [selectedFee, setSelectedFee] = useState<string>("");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<string>("current");
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountFeeId, setDiscountFeeId] = useState<string>("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Données du formulaire
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    amount: 0,
    paymentMethod: "cash",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Données du formulaire de réduction
  const [discountData, setDiscountData] = useState<{
    discountAmount: number;
    discountReason: string;
  }>({
    discountAmount: 0,
    discountReason: "",
  });

  // Charger les frais de l'étudiant
  useEffect(() => {
    if (student?.id) {
      loadStudentFees();
    }
  }, [student?.id]);

  // Éviter de nettoyer les données globales
  useEffect(() => {
    return () => {
      // Ne pas nettoyer les données globales du store
      // Le store devrait gérer lui-même le cache
    };
  }, []);

  const loadStudentFees = async () => {
    try {
      await getStudentFees(student.id);
    } catch (error: any) {
      console.error("❌ Erreur loading student fees:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des frais";
      toast.error(errorMessage);
    }
  };

  // Obtenir les frais de l'étudiant courant
  const getCurrentStudentFees = useCallback(() => {
    if (!student?.id || !studentFees) return [];

    const fees = studentFees[student.id];
    return Array.isArray(fees) ? fees : [];
  }, [student?.id, studentFees]);

  // Validation du formulaire de paiement
  const validatePaymentForm = useCallback(
    (fee: any): boolean => {
      const newErrors: ValidationError[] = [];

      // Validation du montant
      if (paymentData.amount <= 0) {
        newErrors.push({
          field: "amount",
          message: "Le montant doit être supérieur à 0",
        });
      } else if (paymentData.amount > 10000000) {
        newErrors.push({
          field: "amount",
          message: "Le montant ne peut pas dépasser 10,000,000 HTG",
        });
      }

      // Validation du solde restant
      const paidAmount = fee?.paidAmount || 0;
      const totalAmount = fee?.totalAmount || 0;
      const remainingAmount = totalAmount - paidAmount;

      if (paymentData.amount > remainingAmount + 0.01) {
        // Tolérance de 0.01
        newErrors.push({
          field: "amount",
          message: `Le montant ne peut pas dépasser le solde restant (${remainingAmount.toLocaleString()} HTG)`,
        });
      }

      // Validation de la description
      if (!paymentData.description.trim()) {
        newErrors.push({
          field: "description",
          message: "La description est obligatoire",
        });
      } else if (paymentData.description.length > 500) {
        newErrors.push({
          field: "description",
          message: "La description ne peut pas dépasser 500 caractères",
        });
      }

      // Validation de la date
      if (!paymentData.paymentDate) {
        newErrors.push({
          field: "paymentDate",
          message: "La date de paiement est obligatoire",
        });
      } else {
        const paymentDate = new Date(paymentData.paymentDate);
        const today = new Date();

        if (paymentDate > today) {
          newErrors.push({
            field: "paymentDate",
            message: "La date de paiement ne peut pas être dans le futur",
          });
        }
      }

      // Validation de la référence
      if (paymentData.reference && paymentData.reference.length > 100) {
        newErrors.push({
          field: "reference",
          message: "La référence ne peut pas dépasser 100 caractères",
        });
      }

      setErrors(newErrors);
      return newErrors.length === 0;
    },
    [paymentData]
  );

  const handleRecordPayment = async () => {
    if (!selectedFee) {
      toast.error("Veuillez sélectionner des frais");
      return;
    }

    const fee = getCurrentStudentFees().find((f: any) => f.id === selectedFee);
    if (!fee) {
      toast.error("Frais non trouvé");
      return;
    }

    if (!validatePaymentForm(fee)) {
      const errorMessages = errors.map((err) => err.message).join(", ");
      toast.error("Veuillez corriger les erreurs: " + errorMessages);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const paymentPayload = {
        amount: Number(paymentData.amount.toFixed(2)),
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference.trim() || undefined,
        description: paymentData.description.trim(),
        paymentDate: paymentData.paymentDate,
      };

      await recordPayment(selectedFee, paymentPayload);

      toast.success("Paiement enregistré avec succès!", {
        description: `${paymentData.amount.toLocaleString()} HTG pour ${
          fee.feeStructure?.name
        }`,
      });

      // Réinitialiser le formulaire
      setPaymentData({
        amount: 0,
        paymentMethod: "cash",
        reference: "",
        paymentDate: new Date().toISOString().split("T")[0],
        description: "",
      });
      setShowPaymentForm(false);

      // Recharger les frais
      await loadStudentFees();
    } catch (error: any) {
      console.error("❌ Erreur recording payment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'enregistrement du paiement";

      if (errorMessage.includes("solde insuffisant")) {
        toast.error("Solde insuffisant", {
          description: "Le montant dépasse le solde restant",
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountFeeId) return;

    if (discountData.discountAmount < 0) {
      toast.error("Le montant de la réduction doit être positif ou nul");
      return;
    }

    setIsApplyingDiscount(true);

    try {
      await applyDiscount(discountFeeId, {
        discountAmount: Number(discountData.discountAmount.toFixed(2)),
        discountReason: discountData.discountReason.trim() || undefined,
      });

      toast.success("Réduction appliquée avec succès");
      setShowDiscountDialog(false);
      await loadStudentFees();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'application de la réduction";
      toast.error(errorMessage);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const loadPaymentHistory = async (feeId: string) => {
    setHistoryLoading(true);
    try {
      const history = await getPaymentHistory(feeId);
      setPaymentHistory(Array.isArray(history) ? history : []);
      setShowHistoryDialog(true);
    } catch (error: any) {
      console.error("Error loading payment history:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement de l'historique";
      toast.error(errorMessage);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fonction utilitaire pour obtenir le badge de statut
  const getStatusBadge = useCallback((fee: any) => {
    const paidAmount = fee.paidAmount || 0;
    const totalAmount = fee.totalAmount || 0;

    if (Math.abs(paidAmount - totalAmount) < 0.01) {
      // Tolérance pour les arrondis
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Payé
        </Badge>
      );
    } else if (paidAmount > 0) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Partiel ({Math.round((paidAmount / totalAmount) * 100)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          En attente
        </Badge>
      );
    }
  }, []);

  // Fonction utilitaire pour obtenir le badge de méthode de paiement
  const getPaymentMethodBadge = useCallback((method: string) => {
    const colors: Record<string, string> = {
      cash: "bg-blue-100 text-blue-800 border-blue-200",
      transfer: "bg-purple-100 text-purple-800 border-purple-200",
      card: "bg-orange-100 text-orange-800 border-orange-200",
      check: "bg-green-100 text-green-800 border-green-200",
    };

    const methodLabels: Record<string, string> = {
      cash: "Espèces",
      transfer: "Virement",
      card: "Carte",
      check: "Chèque",
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs ${
          colors[method] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {methodLabels[method] || method}
      </Badge>
    );
  }, []);

  // Obtenir l'année académique de l'inscription courante
  const getCurrentAcademicYear = useCallback(() => {
    if (!currentEnrollment) return null;

    if (
      currentEnrollment.academicYear &&
      typeof currentEnrollment.academicYear === "object"
    ) {
      return {
        id: currentEnrollment.academicYear.id,
        year: currentEnrollment.academicYear.year,
      };
    }

    return {
      id: currentEnrollment.academicYearId,
      year: currentEnrollment.academicYear,
    };
  }, [currentEnrollment]);

  // Obtenir les frais filtrés selon l'onglet actif
  const getFilteredFees = useCallback(() => {
    const allFees = getCurrentStudentFees();
    if (allFees.length === 0) return [];

    const currentAcademicYear = getCurrentAcademicYear();

    switch (activeTab) {
      case "current":
        if (!currentAcademicYear?.id) return allFees;

        // Filtrer par ID d'année académique (approche plus fiable)
        return allFees.filter((fee: any) => {
          const feeYearId =
            fee.academicYearId || fee.academicYear?.id || fee.academicYear;
          return feeYearId === currentAcademicYear.id;
        });

      case "past":
        if (!currentAcademicYear?.id) return [];

        return allFees.filter((fee: any) => {
          const feeYearId =
            fee.academicYearId || fee.academicYear?.id || fee.academicYear;
          return feeYearId !== currentAcademicYear.id;
        });

      case "pending":
        return allFees.filter((fee: any) => {
          const paidAmount = fee.paidAmount || 0;
          const totalAmount = fee.totalAmount || 0;
          return paidAmount < totalAmount - 0.01; // Tolérance de 0.01
        });

      case "paid":
        return allFees.filter((fee: any) => {
          const paidAmount = fee.paidAmount || 0;
          const totalAmount = fee.totalAmount || 0;
          return Math.abs(paidAmount - totalAmount) < 0.01; // Tolérance de 0.01
        });

      default:
        return allFees;
    }
  }, [getCurrentStudentFees, getCurrentAcademicYear, activeTab]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    const filteredFees = getFilteredFees();
    const allFees = getCurrentStudentFees();

    const totalDue = filteredFees.reduce(
      (sum: number, fee: any) => sum + (fee.totalAmount || 0),
      0
    );

    const totalPaid = filteredFees.reduce(
      (sum: number, fee: any) => sum + (fee.paidAmount || 0),
      0
    );

    const totalRemaining = totalDue - totalPaid;
    const paymentProgress = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

    // Statistiques globales
    const globalTotal = allFees.reduce(
      (sum: number, fee: any) => sum + (fee.totalAmount || 0),
      0
    );
    const globalPaid = allFees.reduce(
      (sum: number, fee: any) => sum + (fee.paidAmount || 0),
      0
    );
    const globalRemaining = globalTotal - globalPaid;

    // Compter les statuts
    const pendingCount = allFees.filter((fee: any) => {
      const paidAmount = fee.paidAmount || 0;
      const totalAmount = fee.totalAmount || 0;
      return paidAmount < totalAmount - 0.01;
    }).length;

    const paidCount = allFees.filter((fee: any) => {
      const paidAmount = fee.paidAmount || 0;
      const totalAmount = fee.totalAmount || 0;
      return Math.abs(paidAmount - totalAmount) < 0.01;
    }).length;

    return {
      filtered: {
        totalDue,
        totalPaid,
        totalRemaining,
        paymentProgress,
        count: filteredFees.length,
      },
      global: {
        total: globalTotal,
        paid: globalPaid,
        remaining: globalRemaining,
        count: allFees.length,
        pendingCount,
        paidCount,
      },
      academicYear: getCurrentAcademicYear(),
    };
  }, [getFilteredFees, getCurrentStudentFees, getCurrentAcademicYear]);

  // Formatage des montants
  const formatAmount = useCallback((amount: number): string => {
    return amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // Vérifier les permissions utilisateur
  const canManagePayments =
    user?.role === "Admin" || user?.role === "Secretaire";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-medium flex items-center gap-2">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            Frais de scolarité
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {student?.firstName} {student?.lastName} -{" "}
            {statistics.academicYear?.year || "Année non spécifiée"}
            <span className="text-amber-600 ml-2">
              ({statistics.global.count} frais au total)
            </span>
          </p>
        </div>

        {canManagePayments && (
          <Button
            onClick={() => setShowPaymentForm(true)}
            className="gap-2"
            disabled={getCurrentStudentFees().length === 0}
          >
            <Plus className="h-4 w-4" />
            Nouveau Paiement
          </Button>
        )}
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total dû ({statistics.filtered.count})
                </p>
                <p className="text-2xl font-bold mt-1">
                  {formatAmount(statistics.filtered.totalDue)} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <Progress
                value={statistics.filtered.paymentProgress}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payé
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatAmount(statistics.filtered.totalPaid)} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {statistics.global.paidCount} frais entièrement payés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reste à payer
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {formatAmount(statistics.filtered.totalRemaining)} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {statistics.global.pendingCount} frais en attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de filtrage */}
      <Card>
        <CardContent className="p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
              <TabsTrigger value="current" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Année courante</span>
                <span className="sm:hidden">Courant</span>
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Années passées</span>
                <span className="sm:hidden">Passé</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">En attente</span>
                <span className="sm:hidden">Attente</span>
              </TabsTrigger>
              <TabsTrigger value="paid" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Payés</span>
                <span className="sm:hidden">Payés</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Détails des frais */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Détail des frais
              </CardTitle>
              <CardDescription>
                {getFilteredFees().length} frais trouvés
                {activeTab === "current" && statistics.academicYear?.year && (
                  <span> pour l'année {statistics.academicYear.year}</span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadStudentFees}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Chargement des frais...</p>
            </div>
          ) : getFilteredFees().length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">
                {activeTab === "current"
                  ? "Aucun frais pour l'année courante"
                  : "Aucun frais trouvé"}
              </p>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {activeTab === "current"
                  ? "Les frais pour l'année académique courante n'ont pas encore été configurés."
                  : "Aucun frais ne correspond aux critères de filtrage."}
              </p>
              {canManagePayments && (
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des frais
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredFees().map((fee: any) => {
                const paidAmount = fee.paidAmount || 0;
                const totalAmount = fee.totalAmount || 0;
                const remainingAmount = totalAmount - paidAmount;
                const progress =
                  totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
                const isFullyPaid = Math.abs(paidAmount - totalAmount) < 0.01;

                return (
                  <Card
                    key={fee.id}
                    className={`overflow-hidden ${
                      isFullyPaid ? "border-green-200" : ""
                    }`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {fee.feeStructure?.name ||
                                  "Frais non spécifiés"}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {fee.academicYear?.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {fee.academicYear.year}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {fee.feeStructure?.type || "Scolarité"}
                                </Badge>
                              </div>
                              {fee.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {fee.description}
                                </p>
                              )}
                            </div>
                            {getStatusBadge(fee)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-semibold">
                            {formatAmount(totalAmount)} HTG
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payé</p>
                          <p className="font-semibold text-green-600">
                            {formatAmount(paidAmount)} HTG
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Reste</p>
                          <p className="font-semibold text-amber-600">
                            {formatAmount(remainingAmount)} HTG
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Progression
                          </p>
                          <p className="font-semibold">
                            {progress.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {(fee.discountAmount || 0) > 0 && (
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-700 flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              Réduction appliquée
                            </span>
                            <span className="font-semibold text-purple-700">
                              -{formatAmount(fee.discountAmount)} HTG
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>
                              Montant initial:{" "}
                              {formatAmount(
                                fee.originalAmount || totalAmount
                              )}{" "}
                              HTG
                            </span>
                            {fee.discountReason && (
                              <span className="italic">
                                {fee.discountReason}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progression du paiement
                          </span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFee(fee.id);
                            loadPaymentHistory(fee.id);
                          }}
                          className="gap-2"
                        >
                          <History className="h-4 w-4" />
                          Historique
                        </Button>

                        {canManagePayments && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDiscountFeeId(fee.id);
                              setDiscountData({
                                discountAmount: fee.discountAmount || 0,
                                discountReason: fee.discountReason || "",
                              });
                              setShowDiscountDialog(true);
                            }}
                            className="gap-2"
                          >
                            <Percent className="h-4 w-4" />
                            Réduction
                          </Button>
                        )}

                        {canManagePayments && remainingAmount > 0 && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedFee(fee.id);
                              setPaymentData({
                                amount: remainingAmount,
                                paymentMethod: "cash",
                                reference: "",
                                paymentDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                                description: `Paiement pour ${
                                  fee.feeStructure?.name || "frais"
                                }`,
                              });
                              setShowPaymentForm(true);
                            }}
                            className="gap-2"
                          >
                            <DollarSign className="h-4 w-4" />
                            Payer ({formatAmount(remainingAmount)} HTG)
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'enregistrement de paiement */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Enregistrer un paiement
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour enregistrer un nouveau paiement
            </DialogDescription>
          </DialogHeader>

          {selectedFee &&
            (() => {
              const fee = getCurrentStudentFees().find(
                (f: any) => f.id === selectedFee
              );
              if (!fee) return null;

              const paidAmount = fee.paidAmount || 0;
              const totalAmount = fee.totalAmount || 0;
              const remainingAmount = totalAmount - paidAmount;

              return (
                <>
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-700">
                      Information
                    </AlertTitle>
                    <AlertDescription className="text-blue-600">
                      Vous effectuez un paiement pour :{" "}
                      <strong>{fee.feeStructure?.name}</strong>
                      <br />
                      Solde restant :{" "}
                      <strong>{formatAmount(remainingAmount)} HTG</strong>
                    </AlertDescription>
                  </Alert>

                  {errors.length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Validation échouée</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="amount"
                          className="flex items-center gap-1"
                        >
                          Montant (HTG)
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={paymentData.amount || ""}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > remainingAmount) {
                              toast.warning(
                                `Le montant maximum est ${formatAmount(
                                  remainingAmount
                                )} HTG`
                              );
                              setPaymentData({
                                ...paymentData,
                                amount: remainingAmount,
                              });
                            } else {
                              setPaymentData({ ...paymentData, amount: value });
                            }
                          }}
                          min="0"
                          step="0.01"
                          max={remainingAmount}
                          placeholder="0.00"
                          className={
                            errors.some((e) => e.field === "amount")
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum : {formatAmount(remainingAmount)} HTG
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Date du paiement</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={paymentData.paymentDate}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              paymentDate: e.target.value,
                            })
                          }
                          max={new Date().toISOString().split("T")[0]}
                          className={
                            errors.some((e) => e.field === "paymentDate")
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">
                          Méthode de paiement
                        </Label>
                        <Select
                          value={paymentData.paymentMethod}
                          onValueChange={(value: any) =>
                            setPaymentData({
                              ...paymentData,
                              paymentMethod: value,
                            })
                          }
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Sélectionner une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Espèces</SelectItem>
                            <SelectItem value="transfer">Virement</SelectItem>
                            <SelectItem value="card">Carte bancaire</SelectItem>
                            <SelectItem value="check">Chèque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reference">Référence (optionnel)</Label>
                        <Input
                          id="reference"
                          value={paymentData.reference}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              reference: e.target.value,
                            })
                          }
                          placeholder="Numéro de référence"
                          maxLength={100}
                          className={
                            errors.some((e) => e.field === "reference")
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="flex items-center gap-1"
                      >
                        Description
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={paymentData.description}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description du paiement..."
                        rows={3}
                        maxLength={500}
                        className={
                          errors.some((e) => e.field === "description")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <div className="flex justify-between">
                        <p className="text-xs text-muted-foreground">
                          Décrivez le motif de ce paiement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {paymentData.description.length}/500
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentForm(false);
                setErrors([]);
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRecordPayment}
              disabled={!selectedFee || paymentData.amount <= 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer le paiement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'historique des paiements */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des paiements
            </DialogTitle>
            <DialogDescription>
              Historique complet des paiements pour les frais sélectionnés
            </DialogDescription>
          </DialogHeader>

          {historyLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span>Chargement de l'historique...</span>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">
                Aucun historique de paiement
              </p>
              <p className="text-muted-foreground mt-2">
                Aucun paiement n'a été enregistré pour ces frais
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Enregistré par</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString(
                                "fr-FR"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatAmount(payment.amount || 0)} HTG
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.reference || "-"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.description || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.recordedBy || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Total des paiements</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentHistory.length} paiement(s)
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formatAmount(
                      paymentHistory.reduce(
                        (sum, p) => sum + (p.amount || 0),
                        0
                      )
                    )}{" "}
                    HTG
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'application d'une réduction */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Appliquer une réduction
            </DialogTitle>
            <DialogDescription>
              Définissez le montant de la réduction pour ces frais
            </DialogDescription>
          </DialogHeader>

          {discountFeeId &&
            (() => {
              const fee = getCurrentStudentFees().find(
                (f: any) => f.id === discountFeeId
              );
              if (!fee) return null;

              const originalAmount = fee.originalAmount || fee.totalAmount;

              return (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-600">
                      Frais : <strong>{fee.feeStructure?.name}</strong>
                      <br />
                      Montant initial :{" "}
                      <strong>{formatAmount(originalAmount)} HTG</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="discountAmount">
                      Montant de la réduction (HTG)
                    </Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      value={discountData.discountAmount || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value > originalAmount) {
                          toast.warning(
                            `La réduction ne peut pas dépasser ${formatAmount(
                              originalAmount
                            )} HTG`
                          );
                          setDiscountData({
                            ...discountData,
                            discountAmount: originalAmount,
                          });
                        } else {
                          setDiscountData({
                            ...discountData,
                            discountAmount: value,
                          });
                        }
                      }}
                      min="0"
                      step="0.01"
                      max={originalAmount}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nouveau total :{" "}
                      {formatAmount(
                        Math.max(
                          originalAmount - (discountData.discountAmount || 0),
                          0
                        )
                      )}{" "}
                      HTG
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountReason">Raison (optionnel)</Label>
                    <Textarea
                      id="discountReason"
                      value={discountData.discountReason}
                      onChange={(e) =>
                        setDiscountData({
                          ...discountData,
                          discountReason: e.target.value,
                        })
                      }
                      placeholder="ex: Bourse, fratrie, situation sociale..."
                      rows={2}
                      maxLength={255}
                    />
                  </div>
                </div>
              );
            })()}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDiscountDialog(false)}
              disabled={isApplyingDiscount}
            >
              Annuler
            </Button>
            <Button
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount}
            >
              {isApplyingDiscount ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Application...
                </>
              ) : (
                "Appliquer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
