import React, { useState, useEffect } from "react";
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

interface StudentFeesSectionProps {
  student: any;
  currentEnrollment: any;
}

export const StudentFeesSection: React.FC<StudentFeesSectionProps> = ({
  student,
  currentEnrollment,
}) => {
  const {
    studentFees, // Maintenant un objet Record<string, StudentFee[]>
    loading,
    getStudentFees,
    recordPayment,
    getPaymentHistory,
    clearStudentFees,
  } = useFeeStructureStore();

  const [selectedFee, setSelectedFee] = useState<string>("");
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: "cash",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  // Nettoyer les frais quand le composant est démonté
  useEffect(() => {
    return () => {
      clearStudentFees();
    };
  }, [clearStudentFees]);

  // Charger les frais de l'étudiant courant
  useEffect(() => {
    if (student?.id) {
      loadStudentFees();
    }
  }, [student?.id]);

  const loadStudentFees = async () => {
    try {
      await getStudentFees(student.id);
    } catch (error) {
      console.error("❌ Erreur loading student fees:", error);
      toast.error("Erreur lors du chargement des frais");
    }
  };

  // Obtenir les frais de l'étudiant courant
  const getCurrentStudentFees = () => {
    if (!student?.id) return [];
    const fees = studentFees[student.id];
    return Array.isArray(fees) ? fees : [];
  };

  const handleRecordPayment = async () => {
    if (!selectedFee || paymentData.amount <= 0) {
      toast.error(
        "Veuillez sélectionner des frais et entrer un montant valide"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await recordPayment(selectedFee, paymentData);
      toast.success("Paiement enregistré avec succès!");
      setPaymentData({
        amount: 0,
        paymentMethod: "cash",
        reference: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });
      setShowPaymentForm(false);
      
      if (selectedFee) {
        loadPaymentHistory(selectedFee);
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du paiement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadPaymentHistory = async (feeId: string) => {
    try {
      const history = await getPaymentHistory(feeId);
      setPaymentHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error("Error loading payment history:", error);
      toast.error("Erreur lors du chargement de l'historique");
    }
  };

  const getStatusBadge = (fee: any) => {
    const paidAmount = fee.paidAmount || 0;
    const totalAmount = fee.totalAmount || 0;

    if (paidAmount >= totalAmount) {
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
          Partiel
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
  };

  const getPaymentMethodBadge = (method: string) => {
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
        className={
          colors[method] || "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        {methodLabels[method] || method}
      </Badge>
    );
  };

  // Récupère l'année académique d'un frais
  const getFeeAcademicYearInfo = (fee: any): { year?: string; id?: string } => {
    if (
      fee.academicYear &&
      typeof fee.academicYear === "object" &&
      fee.academicYear.year
    ) {
      return { year: fee.academicYear.year, id: fee.academicYear.id };
    }

    if (typeof fee.academicYear === "string") {
      return { year: fee.academicYear };
    }

    return { id: fee.academicYearId };
  };

  // Récupère l'année académique de l'enrollment
  const getEnrollmentAcademicYearInfo = (): { year?: string; id?: string } => {
    if (!currentEnrollment) return {};

    if (
      currentEnrollment.academicYear &&
      typeof currentEnrollment.academicYear === "object"
    ) {
      return {
        year: currentEnrollment.academicYear.year,
        id: currentEnrollment.academicYear.id,
      };
    }

    if (typeof currentEnrollment.academicYear === "string") {
      return { year: currentEnrollment.academicYear };
    }

    return { id: currentEnrollment.academicYearId };
  };

  const enrollmentInfo = getEnrollmentAcademicYearInfo();
  const currentStudentFees = getCurrentStudentFees();

  // Filtrer les frais par année académique courante
  const currentYearFees = currentStudentFees.filter((fee: any) => {
    const feeInfo = getFeeAcademicYearInfo(fee);

    if (enrollmentInfo.id && feeInfo.id) {
      return feeInfo.id === enrollmentInfo.id;
    }

    if (enrollmentInfo.year && feeInfo.year) {
      return feeInfo.year === enrollmentInfo.year;
    }

    return false;
  });

  // Utiliser les frais filtrés ou tous les frais de l'étudiant
  const displayFees =
    currentYearFees.length > 0 ? currentYearFees : currentStudentFees;
  const isFiltered = currentYearFees.length > 0;

  const totalDue = displayFees.reduce(
    (sum: number, fee: any) => sum + (fee.totalAmount || 0),
    0
  );
  const totalPaid = displayFees.reduce(
    (sum: number, fee: any) => sum + (fee.paidAmount || 0),
    0
  );
  const totalRemaining = totalDue - totalPaid;
  const paymentProgress = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec résumé */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Frais de scolarité
        </h3>
        <p className="text-muted-foreground">
          Gestion des frais pour {student.firstName} {student.lastName} -{" "}
          {enrollmentInfo.year || enrollmentInfo.id || "Année non spécifiée"}
          {!isFiltered && currentStudentFees.length > 0 && (
            <span className="text-amber-600 ml-2">
              (Affichage de tous les frais)
            </span>
          )}
        </p>
      </div>

      {/* Cartes de résumé des frais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total dû</p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalDue.toLocaleString()} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-200">
                <CreditCard className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Payé</p>
                <p className="text-2xl font-bold text-green-900">
                  {totalPaid.toLocaleString()} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-200">
                <CheckCircle className="h-4 w-4 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Reste à payer
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {totalRemaining.toLocaleString()} HTG
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression globale */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Progression globale des paiements
            </span>
            <span className="text-sm text-muted-foreground">
              {paymentProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={paymentProgress} className="h-2" />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{totalPaid.toLocaleString()} HTG payés</span>
            <span>{totalDue.toLocaleString()} HTG total</span>
          </div>
        </CardContent>
      </Card>

      {/* Détails des frais */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Détail des frais{" "}
              {displayFees.length > 0 && `(${displayFees.length})`}
              {!isFiltered && Array.isArray(currentStudentFees) && currentStudentFees.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-100 text-yellow-800"
                >
                  Tous les frais
                </Badge>
              )}
            </CardTitle>
            {user?.role === "Admin" && (
              <Button
                size="sm"
                onClick={() => setShowPaymentForm(true)}
                disabled={displayFees.length === 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nouveau paiement
              </Button>
            )}
          </div>
          <CardDescription>
            {isFiltered ? (
              <>
                Frais de scolarité pour l'année académique{" "}
                <span className="font-semibold">
                  {enrollmentInfo.year || enrollmentInfo.id}
                </span>
              </>
            ) : (
              <>Tous les frais de l'élève</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span>Chargement des frais...</span>
            </div>
          ) : displayFees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun frais trouvé pour cet étudiant</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayFees.map((fee: any) => {
                const paidAmount = fee.paidAmount || 0;
                const totalAmount = fee.totalAmount || 0;
                const remainingAmount = totalAmount - paidAmount;
                const progress =
                  totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
                const feeInfo = getFeeAcademicYearInfo(fee);

                return (
                  <Card key={fee.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {fee.feeStructure?.name || "Frais non spécifiés"}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {feeInfo.year && (
                              <Badge variant="outline" className="text-xs">
                                Année: {feeInfo.year}
                              </Badge>
                            )}
                            {feeInfo.id && (
                              <Badge variant="outline" className="text-xs">
                                ID: {feeInfo.id.substring(0, 8)}...
                              </Badge>
                            )}
                          </div>
                          {fee.dueDate && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              Échéance:{" "}
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(fee)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Total:{" "}
                          </span>
                          <span className="font-semibold">
                            {totalAmount.toLocaleString()} HTG
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Payé:{" "}
                          </span>
                          <span className="font-semibold text-green-600">
                            {paidAmount.toLocaleString()} HTG
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Reste:{" "}
                          </span>
                          <span className="font-semibold text-amber-600">
                            {remainingAmount.toLocaleString()} HTG
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Progression:{" "}
                          </span>
                          <span className="font-semibold">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex gap-2">
                        {user?.role === "Admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedFee(fee.id);
                                loadPaymentHistory(fee.id);
                              }}
                              className="flex items-center gap-1"
                            >
                              <History className="h-3 w-3" />
                              Historique
                            </Button>
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
                                });
                                setShowPaymentForm(true);
                              }}
                              disabled={remainingAmount <= 0}
                              className="flex items-center gap-1"
                            >
                              <DollarSign className="h-3 w-3" />
                              Payer
                            </Button>
                          </>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Enregistrer un paiement
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour enregistrer un nouveau paiement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sélectionner les frais</Label>
              <Select value={selectedFee} onValueChange={setSelectedFee}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner des frais" />
                </SelectTrigger>
                <SelectContent>
                  {displayFees.map((fee: any) => {
                    const paidAmount = fee.paidAmount || 0;
                    const totalAmount = fee.totalAmount || 0;
                    const remainingAmount = totalAmount - paidAmount;

                    return (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.feeStructure?.name || "Frais"} - Restant:{" "}
                        {remainingAmount.toLocaleString()} HTG
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedFee && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant (HTG) *</Label>
                    <Input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          amount: Number(e.target.value),
                        })
                      }
                      min="0"
                      placeholder="Montant du paiement"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date du paiement</Label>
                    <Input
                      type="date"
                      value={paymentData.paymentDate}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paymentDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Méthode de paiement</Label>
                    <Select
                      value={paymentData.paymentMethod}
                      onValueChange={(value) =>
                        setPaymentData({ ...paymentData, paymentMethod: value })
                      }
                    >
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label>Référence (optionnel)</Label>
                    <Input
                      value={paymentData.reference}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          reference: e.target.value,
                        })
                      }
                      placeholder="Numéro de référence"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentForm(false);
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

      {/* Historique des paiements */}
      {selectedFee && paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des paiements
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
            <CardDescription>
              Historique des paiements pour les frais sélectionnés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.paymentDate
                          ? new Date(payment.paymentDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(payment.amount || 0).toLocaleString()} HTG
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.reference || "-"}
                      </TableCell>
                      <TableCell>{payment.description || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};