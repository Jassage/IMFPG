// components/AssignFeesButton.tsx - VERSION CORRIGÉE AVEC SCROLL ET DÉSACTIVATION
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Loader2,
  AlertCircle,
  Info,
  Eye,
  Check,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AssignFeesButtonProps {
  studentId: string;
  studentCode: string;
  academicYearId: string;
  onSuccess?: () => void;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
}

interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  totalAmount?: number;
  status?: string;
  dueDate?: string;
  academicYearId?: string;
  isUniquePerStudent?: boolean;
  feeType?: string;
}

interface ExistingFee {
  id: string;
  feeStructureId: string;
  status: "pending" | "partial" | "paid" | "overdue";
  totalAmount: number;
  paidAmount: number;
  dueDate?: string;
  createdAt: string;
  feeStructure?: FeeStructure;
}

export const AssignFeesButton: React.FC<AssignFeesButtonProps> = ({
  studentId,
  studentCode,
  academicYearId,
  onSuccess,
  disabled = false,
  size = "default",
}) => {
  const {
    getFeeStructuresByAcademicYearId,
    assignFeeToStudent,
    checkExistingFees,
    loading,
    error,
  } = useFeeStructureStore();

  const [open, setOpen] = useState(false);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [existingFees, setExistingFees] = useState<ExistingFee[]>([]);
  const [activeTab, setActiveTab] = useState("assign");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Détection responsive
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Charger les données
  const loadData = useCallback(async () => {
    if (!academicYearId) {
      toast.error("ID d'année académique manquant");
      return;
    }

    try {
      const fees = await getFeeStructuresByAcademicYearId(academicYearId);
      setFeeStructures(fees);

      const { fees: existing } = await checkExistingFees(
        studentId,
        academicYearId
      );
      setExistingFees(existing);

      setSelectedFees([]);
      setValidationErrors([]);
    } catch (error) {
      console.error("❌ Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
    }
  }, [
    academicYearId,
    studentId,
    getFeeStructuresByAcademicYearId,
    checkExistingFees,
  ]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  // Vérifier si un frais peut être assigné
  const canAssignFee = useCallback(
    (
      feeId: string
    ): {
      canAssign: boolean;
      reason?: string;
    } => {
      const fee = feeStructures.find((f) => f.id === feeId);
      if (!fee) {
        return { canAssign: false, reason: "Frais non trouvé" };
      }

      // VÉRIFICATION PRINCIPALE : L'étudiant a-t-il déjà ce frais ?
      const existingFee = existingFees.find((f) => f.feeStructureId === feeId);
      if (existingFee) {
        return {
          canAssign: false,
          reason: `Ce frais est déjà assigné (Statut: ${existingFee.status})`,
        };
      }

      return { canAssign: true };
    },
    [feeStructures, existingFees]
  );

  // Vérifier si AU MOINS UN frais peut être assigné
  const hasAssignableFees = useMemo(() => {
    return feeStructures.some((fee) => {
      return canAssignFee(fee.id).canAssign;
    });
  }, [feeStructures, canAssignFee]);

  // Vérifier si l'étudiant a déjà DES frais assignés
  const hasExistingFees = useMemo(() => {
    return existingFees.length > 0;
  }, [existingFees]);

  // Valider la sélection actuelle
  const validateSelectedFees = useCallback(
    (feesToValidate: string[]): string[] => {
      const errors: string[] = [];

      feesToValidate.forEach((feeId) => {
        const validation = canAssignFee(feeId);
        if (!validation.canAssign && validation.reason) {
          errors.push(validation.reason);
        }
      });

      return errors;
    },
    [canAssignFee]
  );

  // Assigner les frais sélectionnés
  const handleAssignFees = async () => {
    const errors = validateSelectedFees(selectedFees);

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Certains frais ne peuvent pas être assignés");
      return;
    }

    if (selectedFees.length === 0) {
      toast.error("Veuillez sélectionner au moins un frais");
      return;
    }

    // DOUBLE VÉRIFICATION : S'assurer qu'aucun frais n'est déjà assigné
    const hasAlreadyAssignedFees = selectedFees.some((feeId) => {
      return existingFees.some((f) => f.feeStructureId === feeId);
    });

    if (hasAlreadyAssignedFees) {
      toast.error("Certains frais sont déjà assignés à cet étudiant");
      return;
    }

    setAssigning(true);
    setValidationErrors([]);

    try {
      let successCount = 0;

      for (const feeId of selectedFees) {
        const fee = feeStructures.find((f) => f.id === feeId);
        const feeName = fee?.name || feeId;

        try {
          // Vérification finale
          if (existingFees.some((f) => f.feeStructureId === feeId)) {
            toast.warning(`Frais "${feeName}" déjà assigné, ignoré`);
            continue;
          }

          await assignFeeToStudent(
            studentId,
            academicYearId,
            feeId,
            studentCode
          );

          successCount++;
          toast.success(`Frais "${feeName}" assigné`);

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: any) {
          console.error(`❌ Erreur assignation ${feeId}:`, error);

          if (
            error?.message?.includes("already exists") ||
            error?.message?.includes("déjà existant")
          ) {
            toast.warning(`Frais "${feeName}" déjà assigné`);
          } else {
            toast.error(`Erreur avec "${feeName}"`, {
              description: error?.message || "Erreur inconnue",
            });
          }
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} frais assignés avec succès`);
        await loadData();
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("❌ Erreur globale assignation:", error);
      toast.error("Erreur lors de l'assignation des frais");
    } finally {
      setAssigning(false);
    }
  };

  // Sélectionner/désélectionner un frais
  const toggleFeeSelection = (feeId: string) => {
    const validation = canAssignFee(feeId);

    if (!validation.canAssign) {
      toast.info("Ce frais ne peut pas être assigné", {
        description: validation.reason,
        duration: 3000,
      });
      return;
    }

    setSelectedFees((prev) => {
      const newSelection = prev.includes(feeId)
        ? prev.filter((id) => id !== feeId)
        : [...prev, feeId];

      const errors = validateSelectedFees(newSelection);
      setValidationErrors(errors);

      return newSelection;
    });
  };

  // Sélectionner tous les frais assignables
  const selectAllAvailableFees = () => {
    const availableFees = feeStructures
      .filter((fee) => canAssignFee(fee.id).canAssign)
      .map((fee) => fee.id);

    if (
      selectedFees.length === availableFees.length &&
      availableFees.length > 0
    ) {
      setSelectedFees([]);
      setValidationErrors([]);
    } else {
      setSelectedFees(availableFees);
      const errors = validateSelectedFees(availableFees);
      setValidationErrors(errors);
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const totalAmount = selectedFees.reduce((total, feeId) => {
      const fee = feeStructures.find((f) => f.id === feeId);
      return total + (fee?.amount || fee?.totalAmount || 0);
    }, 0);

    const availableFees = feeStructures.filter(
      (fee) => canAssignFee(fee.id).canAssign
    );

    const unavailableFees = feeStructures.filter(
      (fee) => !canAssignFee(fee.id).canAssign
    );

    return {
      totalAmount,
      availableFeesCount: availableFees.length,
      unavailableFeesCount: unavailableFees.length,
      selectedCount: selectedFees.length,
      assignedCount: existingFees.length,
    };
  }, [selectedFees, feeStructures, existingFees, canAssignFee]);

  // Frais déjà assignés
  const assignedFees = useMemo(() => {
    return existingFees.map((fee) => ({
      ...fee,
      feeStructure: feeStructures.find((f) => f.id === fee.feeStructureId),
    }));
  }, [existingFees, feeStructures]);

  // Désactiver le bouton principal si l'étudiant a déjà des frais
  const shouldDisableButton = useMemo(() => {
    // Désactiver si l'étudiant a déjà des frais OU si pas d'année académique
    return hasExistingFees || !academicYearId || disabled;
  }, [hasExistingFees, academicYearId, disabled]);

  return (
    <>
      {/* BOUTON PRINCIPAL - DÉSACTIVÉ SI FRAIS EXISTANTS */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={size}
            variant="outline"
            className="gap-1"
            disabled={shouldDisableButton}
          >
            <Plus className="h-4 w-4" />
            {!isMobile && "Assigner des frais"}
            {isMobile && "Frais"}
            {hasExistingFees && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {existingFees.length} déjà
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "flex flex-col p-0 sm:p-6",
            isMobile
              ? "max-w-[95vw] h-[95vh] m-2 rounded-lg"
              : "max-w-3xl max-h-[90vh]"
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <div>
                  <DialogTitle className="text-base sm:text-lg">
                    Gestion des frais
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Étudiant: {studentCode}
                  </DialogDescription>
                </div>
              </div>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Message d'alerte si frais existants */}
          {hasExistingFees && (
            <div className="px-4 sm:px-6 pt-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <span className="font-medium">⚠️ Attention:</span> Cet
                  étudiant a déjà {existingFees.length} frais assignés pour
                  cette année académique.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Contenu principal avec hauteur fixe pour le scroll */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Navigation des tabs */}
              <div className="px-4 sm:px-6 pt-4">
                <TabsList
                  className={cn(
                    "grid w-full",
                    isMobile ? "grid-cols-2" : "grid-cols-2"
                  )}
                >
                  <TabsTrigger value="assign" className="text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>Nouveaux</span>
                    {stats.availableFeesCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 text-[10px] sm:text-xs"
                      >
                        {stats.availableFeesCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="view" className="text-xs sm:text-sm">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>Assignés</span>
                    {stats.assignedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 text-[10px] sm:text-xs"
                      >
                        {stats.assignedCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab: Assigner nouveaux frais */}
              <TabsContent
                value="assign"
                className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden"
              >
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="text-muted-foreground text-sm">
                      Chargement...
                    </p>
                  </div>
                ) : !hasAssignableFees ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-center mb-6">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-base font-medium mb-2">
                        Tous les frais sont déjà assignés
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Cet étudiant a déjà tous les frais disponibles pour
                        cette année académique.
                      </p>
                    </div>

                    {/* Informations sur les frais existants */}
                    {hasExistingFees && (
                      <Card className="w-full max-w-md">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="font-medium mb-2">
                              Frais déjà assignés:
                            </p>
                            <div className="space-y-1">
                              {existingFees.slice(0, 3).map((fee, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-muted-foreground truncate">
                                    {feeStructures.find(
                                      (f) => f.id === fee.feeStructureId
                                    )?.name || "Frais"}
                                  </span>
                                  <Badge
                                    variant={
                                      fee.status === "paid"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="ml-2"
                                  >
                                    {fee.status === "paid"
                                      ? "Payé"
                                      : fee.status === "partial"
                                      ? "Partiel"
                                      : "En attente"}
                                  </Badge>
                                </div>
                              ))}
                              {existingFees.length > 3 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  ... et {existingFees.length - 3} autres frais
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* En-tête */}
                    <div className="px-4 sm:px-6 py-3 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all-available"
                            checked={
                              stats.selectedCount ===
                                stats.availableFeesCount &&
                              stats.availableFeesCount > 0
                            }
                            onCheckedChange={selectAllAvailableFees}
                            disabled={stats.availableFeesCount === 0}
                          />
                          <Label
                            htmlFor="select-all-available"
                            className="text-xs sm:text-sm"
                          >
                            {stats.availableFeesCount === 0
                              ? "Aucun disponible"
                              : "Tout sélectionner"}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {stats.selectedCount} sélectionné(s)
                        </Badge>
                      </div>
                    </div>

                    {validationErrors.length > 0 && (
                      <div className="px-4 sm:px-6 py-3">
                        <Alert variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3" />
                          <AlertDescription>
                            Certains frais ne peuvent pas être assignés
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Liste des frais - ScrollArea fonctionnel */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <ScrollArea className="h-full w-full">
                        <div
                          className={cn(
                            "space-y-3 p-4",
                            isMobile ? "space-y-2" : "space-y-3"
                          )}
                        >
                          {feeStructures.map((fee) => {
                            const validation = canAssignFee(fee.id);
                            const isSelected = selectedFees.includes(fee.id);
                            const amount = fee.amount || fee.totalAmount || 0;

                            return (
                              <div
                                key={fee.id}
                                className={cn(
                                  "border rounded-lg transition-all p-3",
                                  validation.canAssign
                                    ? isSelected
                                      ? "border-blue-500 bg-blue-50"
                                      : "hover:border-blue-300 cursor-pointer hover:bg-slate-50"
                                    : "border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed"
                                )}
                                onClick={() =>
                                  validation.canAssign &&
                                  toggleFeeSelection(fee.id)
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex items-center justify-center h-5 w-5 mt-0.5">
                                    {validation.canAssign ? (
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() =>
                                          toggleFeeSelection(fee.id)
                                        }
                                      />
                                    ) : (
                                      <X className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-1 mb-1">
                                          <p
                                            className={cn(
                                              "font-medium truncate text-sm",
                                              !validation.canAssign &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {fee.name}
                                          </p>
                                          {!validation.canAssign && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] px-1 py-0 bg-red-50"
                                            >
                                              Déjà assigné
                                            </Badge>
                                          )}
                                        </div>

                                        {fee.description && (
                                          <p className="text-xs text-muted-foreground line-clamp-2">
                                            {fee.description}
                                          </p>
                                        )}
                                      </div>

                                      <div className="text-right">
                                        <div className="font-semibold text-green-700 whitespace-nowrap text-sm sm:text-base">
                                          {amount.toLocaleString()} HTG
                                        </div>
                                      </div>
                                    </div>

                                    {!validation.canAssign &&
                                      validation.reason && (
                                        <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                          ⚠️ {validation.reason}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Barre d'actions fixe en bas */}
                    <div className="sticky bottom-0 bg-background border-t p-4">
                      {stats.selectedCount > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Total à assigner
                              </p>
                              <p className="text-xs text-green-600">
                                {stats.selectedCount} frais
                              </p>
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-green-700">
                              {stats.totalAmount.toLocaleString()} HTG
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {stats.selectedCount > 0 ? (
                            <span className="text-green-600 font-medium">
                              Prêt à assigner {stats.selectedCount} frais
                            </span>
                          ) : (
                            <span className="text-amber-600">
                              Sélectionnez au moins un frais
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {!isMobile && (
                            <Button
                              variant="outline"
                              onClick={() => setOpen(false)}
                              disabled={assigning}
                              size="sm"
                            >
                              Annuler
                            </Button>
                          )}
                          <Button
                            onClick={handleAssignFees}
                            disabled={assigning || stats.selectedCount === 0}
                            size="sm"
                          >
                            {assigning ? (
                              <>
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                <span>Assignation...</span>
                              </>
                            ) : (
                              <>Assigner ({stats.selectedCount})</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab: Voir les frais assignés */}
              <TabsContent
                value="view"
                className="flex-1 flex flex-col min-h-0 mt-0 overflow-hidden"
              >
                {stats.assignedCount === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-base font-medium mb-2">
                      Aucun frais assigné
                    </p>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Cet étudiant n'a pas encore de frais assignés
                    </p>
                    <Button onClick={() => setActiveTab("assign")} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Assigner des frais
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Liste des frais assignés avec ScrollArea */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <ScrollArea className="h-full w-full">
                        <div
                          className={cn(
                            "space-y-3 p-4",
                            isMobile ? "space-y-2" : "space-y-3"
                          )}
                        >
                          {assignedFees.map((fee) => {
                            const remainingAmount =
                              fee.totalAmount - fee.paidAmount;
                            const percentagePaid =
                              fee.totalAmount > 0
                                ? Math.round(
                                    (fee.paidAmount / fee.totalAmount) * 100
                                  )
                                : 0;

                            return (
                              <Card key={fee.id} className="border">
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0">
                                      <p className="font-medium truncate text-sm sm:text-base">
                                        {fee.feeStructure?.name ||
                                          "Frais inconnu"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Assigné le{" "}
                                        {new Date(
                                          fee.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm sm:text-base font-bold text-green-700">
                                        {fee.totalAmount.toLocaleString()} HTG
                                      </div>
                                      <Badge
                                        variant={
                                          fee.status === "paid"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs mt-1"
                                      >
                                        {fee.status === "paid"
                                          ? "Payé"
                                          : fee.status === "partial"
                                          ? "Partiel"
                                          : "En attente"}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-muted-foreground">
                                        Progression: {percentagePaid}%
                                      </span>
                                      <span className="font-medium">
                                        {fee.paidAmount.toLocaleString()}/
                                        {fee.totalAmount.toLocaleString()} HTG
                                      </span>
                                    </div>
                                    <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${percentagePaid}%` }}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Actions en bas */}
                    <div className="sticky bottom-0 bg-background border-t p-4">
                      <Button
                        onClick={() => setActiveTab("assign")}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter d'autres frais
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
