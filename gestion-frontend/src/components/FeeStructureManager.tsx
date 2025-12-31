import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { AcademicYear, FeeStructure } from "@/types/academic";
import {
  Plus,
  Save,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  MoreVertical,
  Calendar,
  RefreshCw,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Table,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeeFormData {
  academicYear: string;
  name: string;
  amount: number;
  description?: string;
  isActive: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

export const FeeStructureManager: React.FC = () => {
  const {
    feeStructures,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    getFeeStructures,
    loading,
  } = useFeeStructureStore();

  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  // États principaux
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [feeToDelete, setFeeToDelete] = useState<FeeStructure | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Données du formulaire
  const [formData, setFormData] = useState<FeeFormData>({
    academicYear: "",
    name: "",
    amount: 0,
    description: "",
    isActive: true,
  });

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([fetchAcademicYears(), getFeeStructures()]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [fetchAcademicYears, getFeeStructures]);

  // Mise à jour du formulaire lors de l'édition
  useEffect(() => {
    if (editingFee) {
      setFormData({
        academicYear: editingFee.academicYear,
        name: editingFee.name,
        amount: editingFee.amount,
        description: editingFee.description || "",
        isActive: editingFee.isActive,
      });
      setErrors([]);
    }
  }, [editingFee]);

  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationError[] = [];

    // Validation du nom
    if (!formData.name?.trim()) {
      newErrors.push({
        field: "name",
        message: "Le nom est obligatoire",
      });
    } else if (formData.name.length > 200) {
      newErrors.push({
        field: "name",
        message: "Le nom ne doit pas dépasser 200 caractères",
      });
    }

    // Validation de l'année académique
    if (!formData.academicYear) {
      newErrors.push({
        field: "academicYear",
        message: "L'année académique est obligatoire",
      });
    }

    // Validation du montant
    if (formData.amount <= 0) {
      newErrors.push({
        field: "amount",
        message: "Le montant doit être supérieur à 0",
      });
    } else if (formData.amount > 10000000) {
      newErrors.push({
        field: "amount",
        message: "Le montant ne peut pas dépasser 10,000,000 HTG",
      });
    } else if (!Number.isFinite(formData.amount)) {
      newErrors.push({
        field: "amount",
        message: "Le montant doit être un nombre valide",
      });
    } else if (Math.round(formData.amount * 100) / 100 !== formData.amount) {
      newErrors.push({
        field: "amount",
        message: "Le montant doit avoir au maximum 2 décimales",
      });
    }

    // Validation de la description
    if (formData.description && formData.description.length > 1000) {
      newErrors.push({
        field: "description",
        message: "La description ne doit pas dépasser 1000 caractères",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData]);

  // Vérification si le formulaire est valide
  const isFormValid = useMemo(() => {
    return (
      formData.name?.trim() &&
      formData.academicYear &&
      formData.amount > 0 &&
      formData.amount <= 10000000
    );
  }, [formData]);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = errors.map((err) => err.message).join(", ");
      toast.error("Veuillez corriger les erreurs: " + errorMessages);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const feeData = {
        name: formData.name.trim(),
        academicYear: formData.academicYear,
        amount: Number(formData.amount.toFixed(2)),
        description: formData.description?.trim() || undefined,
        isActive: formData.isActive,
      };

      if (editingFee) {
        await updateFeeStructure(editingFee.id, feeData);
        toast.success("Structure de frais modifiée avec succès!", {
          description: `"${feeData.name}" pour ${feeData.academicYear}`,
        });
      } else {
        await createFeeStructure(feeData);
        toast.success("Structure de frais créée avec succès!", {
          description: `"${feeData.name}" pour ${feeData.academicYear}`,
        });
      }

      setIsFormOpen(false);
      resetForm();
      await getFeeStructures();
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'opération";

      toast.error(errorMessage, {
        duration: 5000,
      });

      setErrors([
        {
          field: "general",
          message: errorMessage,
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Édition d'une structure
  const handleEdit = (fee: FeeStructure): void => {
    setEditingFee(fee);
    setIsFormOpen(true);
  };

  // Demande de suppression
  const handleDeleteClick = (fee: FeeStructure): void => {
    setFeeToDelete(fee);
    setIsDeleteDialogOpen(true);
  };

  // Vérification si une structure peut être supprimée
  const canDeleteFee = useCallback((fee: FeeStructure): boolean => {
    // Ajoutez ici vos règles de suppression
    // Par exemple: ne pas supprimer si des étudiants y sont associés
    return fee.isActive === false; // Exemple: ne supprimer que les inactives
  }, []);

  // Confirmation de suppression
  const confirmDelete = async (): Promise<void> => {
    if (!feeToDelete) return;

    // Vérifier les contraintes de suppression
    if (feeToDelete.isActive) {
      toast.error("Impossible de supprimer une structure de frais active", {
        description: "Désactivez d'abord la structure avant de la supprimer",
      });
      setIsDeleteDialogOpen(false);
      setFeeToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFeeStructure(feeToDelete.id);
      toast.success("Structure de frais supprimée avec succès!", {
        description: `"${feeToDelete.name}" a été supprimé`,
      });
      setIsDeleteDialogOpen(false);
      setFeeToDelete(null);
      await getFeeStructures();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression", {
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Réinitialisation du formulaire
  const resetForm = (): void => {
    setFormData({
      academicYear: "",
      name: "",
      amount: 0,
      description: "",
      isActive: true,
    });
    setEditingFee(null);
    setErrors([]);
  };

  // Gestion des changements de champs
  const handleInputChange = (
    field: keyof FeeFormData,
    value: string | number | boolean
  ): void => {
    // Validation en temps réel pour le montant
    if (field === "amount") {
      if (typeof value === "string") {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) return;

        // Limiter à 2 décimales
        const roundedValue = Math.round(numValue * 100) / 100;
        value = roundedValue;

        // Limiter le montant maximum
        if (roundedValue > 10000000) {
          toast.warning("Le montant maximum est de 10,000,000 HTG");
          value = 10000000;
        }
      }
    }

    // Validation pour le nom
    if (field === "name" && typeof value === "string" && value.length > 200) {
      toast.warning("Le nom ne doit pas dépasser 200 caractères");
      value = value.substring(0, 200);
    }

    // Validation pour la description
    if (
      field === "description" &&
      typeof value === "string" &&
      value.length > 1000
    ) {
      toast.warning("La description ne doit pas dépasser 1000 caractères");
      value = value.substring(0, 1000);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour obtenir l'affichage de l'année académique
  const getAcademicYearDisplay = useCallback(
    (academicYearValue: string): string => {
      const year = academicYears.find((y) => y.year === academicYearValue);
      return year ? year.year : academicYearValue;
    },
    [academicYears]
  );

  // Filtrage des structures
  const filteredFeeStructures = useMemo(() => {
    let filtered = [...feeStructures];

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter((fee) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          fee.name.toLowerCase().includes(searchLower) ||
          getAcademicYearDisplay(fee.academicYear)
            .toLowerCase()
            .includes(searchLower) ||
          (fee.description &&
            fee.description.toLowerCase().includes(searchLower))
        );
      });
    }

    // Filtrer par année
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (fee) => getAcademicYearDisplay(fee.academicYear) === selectedYear
      );
    }

    // Filtrer par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter((fee) => {
        if (selectedStatus === "active") return fee.isActive;
        if (selectedStatus === "inactive") return !fee.isActive;
        return true;
      });
    }

    // Filtrer par onglet
    if (activeTab !== "all") {
      filtered = filtered.filter((fee) => {
        if (activeTab === "active") return fee.isActive;
        if (activeTab === "inactive") return !fee.isActive;
        return true;
      });
    }

    return filtered;
  }, [
    feeStructures,
    searchTerm,
    selectedYear,
    selectedStatus,
    activeTab,
    getAcademicYearDisplay,
  ]);

  // Statistiques
  const statistics = useMemo(() => {
    const total = feeStructures.length;
    const active = feeStructures.filter((f) => f.isActive).length;
    const inactive = total - active;
    const years = new Set(feeStructures.map((f) => f.academicYear)).size;
    const totalAmount = feeStructures.reduce((sum, f) => sum + f.amount, 0);
    const average = total > 0 ? totalAmount / total : 0;
    const highest =
      total > 0 ? Math.max(...feeStructures.map((f) => f.amount)) : 0;
    const lowest =
      total > 0 ? Math.min(...feeStructures.map((f) => f.amount)) : 0;

    // Distribution par année
    const distributionByYear = feeStructures.reduce((acc, fee) => {
      const year = getAcademicYearDisplay(fee.academicYear);
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      years,
      totalAmount,
      average,
      highest,
      lowest,
      distributionByYear,
    };
  }, [feeStructures, getAcademicYearDisplay]);

  // Rechargement des données
  const handleRefresh = async (): Promise<void> => {
    try {
      await Promise.all([fetchAcademicYears(), getFeeStructures()]);
      toast.success("Données actualisées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation des données");
    }
  };

  // Réinitialisation des filtres
  const resetFilters = useCallback((): void => {
    setSearchTerm("");
    setSelectedYear("all");
    setSelectedStatus("all");
    setActiveTab("all");
  }, []);

  // Formatage des montants
  const formatAmount = useCallback((amount: number): string => {
    return amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // Téléchargement des données
  const handleExport = useCallback(() => {
    if (filteredFeeStructures.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const csvContent = [
      [
        "Nom",
        "Année Académique",
        "Montant (HTG)",
        "Statut",
        "Description",
        "Date de création",
      ].join(","),
      ...filteredFeeStructures.map((fee) =>
        [
          `"${fee.name}"`,
          `"${getAcademicYearDisplay(fee.academicYear)}"`,
          fee.amount.toFixed(2),
          fee.isActive ? "Actif" : "Inactif",
          `"${fee.description || ""}"`,
          fee.createdAt
            ? new Date(fee.createdAt).toLocaleDateString("fr-FR")
            : "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `structures-frais-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export terminé", {
      description: `${filteredFeeStructures.length} structures exportées`,
    });
  }, [filteredFeeStructures, getAcademicYearDisplay]);

  // Composant pour les données vides
  const NoDataMessage = useCallback(() => {
    const hasFilters =
      searchTerm || selectedYear !== "all" || selectedStatus !== "all";

    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {hasFilters ? "Aucun résultat trouvé" : "Aucune structure de frais"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {hasFilters
            ? "Aucune structure de frais ne correspond à vos critères de recherche."
            : "Commencez par créer votre première structure de frais pour organiser les frais académiques."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasFilters && (
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          )}
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Créer une Structure
          </Button>
        </div>
      </div>
    );
  }, [searchTerm, selectedYear, selectedStatus, resetFilters]);

  // Affichage du chargement initial
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-lg font-medium">Chargement des données</p>
          <p className="text-sm text-muted-foreground mt-1">
            Préparation de la gestion des frais académiques...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Gestion des Structures de Frais
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Configurez et gérez les structures de frais par année académique
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Structure</span>
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Structures
                </p>
                <p className="text-3xl font-bold mt-1">{statistics.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actives</span>
                <span className="font-medium text-green-600">
                  {statistics.active} (
                  {statistics.total > 0
                    ? Math.round((statistics.active / statistics.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <Progress
                value={
                  statistics.total > 0
                    ? (statistics.active / statistics.total) * 100
                    : 0
                }
                className="mt-2 h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Montant Total
                </p>
                <p className="text-3xl font-bold mt-1">
                  {formatAmount(statistics.totalAmount)} HTG
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moyenne</span>
                <span className="font-medium">
                  {formatAmount(statistics.average)} HTG
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Années Académiques
                </p>
                <p className="text-3xl font-bold mt-1">{statistics.years}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distribution</span>
                <span className="font-medium">Voir détails</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plage de Montants
                </p>
                <p className="text-lg font-bold mt-1">
                  {formatAmount(statistics.lowest)} -{" "}
                  {formatAmount(statistics.highest)} HTG
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Écart</span>
                <span className="font-medium">
                  {formatAmount(statistics.highest - statistics.lowest)} HTG
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et contrôles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredFeeStructures.length} structure(s) trouvée(s)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredFeeStructures.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, année ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  maxLength={100}
                />
              </div>
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Année académique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.year}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="inactive">Inactives</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="gap-2">
                <Eye className="h-4 w-4" />
                Toutes ({statistics.total})
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Actives ({statistics.active})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="gap-2">
                <XCircle className="h-4 w-4" />
                Inactives ({statistics.inactive})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Chargement des structures...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Structures de Frais</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Nom</TableHead>
                    <TableHead>Année Académique</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeeStructures.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{fee.name}</div>
                          {fee.description && (
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {fee.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {getAcademicYearDisplay(fee.academicYear)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatAmount(fee.amount)} HTG
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={fee.isActive ? "default" : "secondary"}
                          className={
                            fee.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                          }
                        >
                          {fee.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(fee)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(fee)}
                              className="text-red-600 focus:text-red-600"
                              disabled={!canDeleteFee(fee)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                              {!canDeleteFee(fee) && " (Non autorisé)"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredFeeStructures.length === 0 && (
              <div className="p-8">
                <NoDataMessage />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeStructures.map((fee) => (
            <Card
              key={fee.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate" title={fee.name}>
                      {fee.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getAcademicYearDisplay(fee.academicYear)}
                    </p>
                  </div>
                  <Badge
                    variant={fee.isActive ? "default" : "secondary"}
                    className="ml-2 flex-shrink-0"
                  >
                    {fee.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                {fee.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {fee.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {formatAmount(fee.amount)} HTG
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Montant total
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(fee)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(fee)}
                      disabled={!canDeleteFee(fee)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredFeeStructures.length === 0 && (
            <div className="col-span-full">
              <NoDataMessage />
            </div>
          )}
        </div>
      )}

      {/* Modal de formulaire */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsFormOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingFee ? (
                <>
                  <Edit className="h-5 w-5" />
                  Modifier la Structure de Frais
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Nouvelle Structure de Frais
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingFee
                ? "Modifiez les informations de la structure de frais"
                : "Créez une nouvelle structure de frais pour une année académique"}
            </DialogDescription>
          </DialogHeader>

          {errors.some((err) => err.field === "general") && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <strong className="font-medium">Erreur: </strong>
              {errors.find((err) => err.field === "general")?.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Nom de la Structure
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="ex: Frais de scolarité 2024-2025"
                  required
                  className={
                    errors.some((err) => err.field === "name")
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.some((err) => err.field === "name") && (
                  <p className="text-sm text-red-500">
                    {errors.find((err) => err.field === "name")?.message}
                  </p>
                )}
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Nom clair et descriptif de la structure
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.name.length}/200
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="academicYear"
                    className="flex items-center gap-1"
                  >
                    Année Académique
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.academicYear}
                    onValueChange={(value) =>
                      handleInputChange("academicYear", value)
                    }
                    required
                  >
                    <SelectTrigger
                      className={
                        errors.some((err) => err.field === "academicYear")
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.year}>
                          {year.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.some((err) => err.field === "academicYear") && (
                    <p className="text-sm text-red-500">
                      {
                        errors.find((err) => err.field === "academicYear")
                          ?.message
                      }
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-1">
                    Montant Total (HTG)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    required
                    min="0"
                    step="0.01"
                    max="10000000"
                    placeholder="0.00"
                    className={
                      errors.some((err) => err.field === "amount")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.some((err) => err.field === "amount") && (
                    <p className="text-sm text-red-500">
                      {errors.find((err) => err.field === "amount")?.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Montant entre 0.01 HTG et 10,000,000 HTG
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Description optionnelle de la structure de frais..."
                  rows={3}
                  className={
                    errors.some((err) => err.field === "description")
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.some((err) => err.field === "description") && (
                  <p className="text-sm text-red-500">
                    {errors.find((err) => err.field === "description")?.message}
                  </p>
                )}
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Détails supplémentaires sur la structure de frais
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.description?.length || 0}/1000
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                  <Switch
                    id="status"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.isActive ? "Activée" : "Désactivée"}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Une structure désactivée ne sera pas disponible pour les
                  nouvelles affectations
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-semibold">Résumé de la Structure</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.academicYear
                      ? `Pour l'année ${formData.academicYear}`
                      : "Sélectionnez une année académique"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatAmount(formData.amount)} HTG
                  </p>
                  <p className="text-sm text-muted-foreground">Montant total</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : editingFee ? (
                  "Modifier"
                ) : (
                  "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la structure de frais "
              <strong>{feeToDelete?.name}</strong>" pour l'année{" "}
              <strong>
                {feeToDelete &&
                  getAcademicYearDisplay(feeToDelete.academicYear)}
              </strong>{" "}
              ?
              {feeToDelete?.isActive && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ Attention : Cette structure est actuellement active.
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Il est recommandé de la désactiver avant de la supprimer.
                  </p>
                </div>
              )}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  Cette action est irréversible et pourrait affecter les
                  étudiants associés à cette structure de frais.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
