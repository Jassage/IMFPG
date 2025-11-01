// src/components/CoursesManager.tsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Download,
  Upload,
  Star,
  Shield,
  BarChart3,
  RotateCcw,
  MoreVertical,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Eye,
  Settings,
  Users,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UE, UEType } from "../types/academic";
import { useUEStore } from "@/store/courseStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/use-toast";
import ConfirmationModal from "./ui/ConfirmationModal";
import { SimpleSelect } from "./SimpleSelect";
import { cn } from "@/lib/utils";
import { UEImportExport } from "./course/UEImportExport";

// Types pour le formulaire
interface UEFormData {
  code: string;
  title: string;
  credits: number;
  passingGrade: number;
  type: UEType;
  prerequisites: string[];
  createdById: string;
  description?: string;
  objectives?: string;
}

// Composant de statistiques
const StatsCards = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium mb-1">
              Total Cours
            </p>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-xs text-blue-600 mt-1">Unités d'enseignement</p>
          </div>
          <div className="bg-blue-200 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-700" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium mb-1">
              Obligatoires
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {stats.obligatory}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {stats.total > 0
                ? Math.round((stats.obligatory / stats.total) * 100)
                : 0}
              % du total
            </p>
          </div>
          <div className="bg-purple-200 p-3 rounded-full">
            <Shield className="h-6 w-6 text-purple-700" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium mb-1">
              Optionnelles
            </p>
            <p className="text-3xl font-bold text-green-700">
              {stats.optional}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats.total > 0
                ? Math.round((stats.optional / stats.total) * 100)
                : 0}
              % du total
            </p>
          </div>
          <div className="bg-green-200 p-3 rounded-full">
            <Star className="h-6 w-6 text-green-700" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">
              Moy. Crédits
            </p>
            <p className="text-3xl font-bold text-amber-700">
              {stats.averageCredits}
            </p>
            <p className="text-xs text-amber-600 mt-1">Crédits par Cours</p>
          </div>
          <div className="bg-amber-200 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 text-amber-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Composant de filtres avancés
const AdvancedFilters = ({
  filters,
  onFiltersChange,
  onClear,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClear: () => void;
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== "all"
  );

  return (
    <div className="bg-muted/30 p-6 rounded-lg border mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Filtres avancés</Label>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8">
            <X className="h-3 w-3 mr-1" />
            Effacer tout
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type-filter" className="text-xs font-medium">
            Type d'UE
          </Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                type: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Obligatoire">Obligatoire</SelectItem>
              <SelectItem value="Optionnelle">Optionnelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="catalog-filter" className="text-xs font-medium">
            Statut catalogue
          </Label>
          <Select
            value={filters.inCatalog?.toString() || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                inCatalog: value === "all" ? undefined : value === "true",
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="true">Au catalogue</SelectItem>
              <SelectItem value="false">Brouillon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits-filter" className="text-xs font-medium">
            Crédits
          </Label>
          <Select
            value={filters.credits || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                credits: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les crédits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les crédits</SelectItem>
              <SelectItem value="1-3">1-3 crédits</SelectItem>
              <SelectItem value="4-6">4-6 crédits</SelectItem>
              <SelectItem value="7+">7+ crédits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Composant de carte UE
const UECard = ({
  ue,
  onEdit,
  onDelete,
  onView,
}: {
  ue: UE;
  onEdit: (ue: UE) => void;
  onDelete: (id: string) => void;
  onView: (ue: UE) => void;
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-3 rounded-xl shadow-sm",
                ue.type === "Obligatoire"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-green-500 to-teal-600"
              )}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <Badge
                variant={ue.type === "Obligatoire" ? "default" : "secondary"}
                className="mb-2"
              >
                {ue.type}
              </Badge>
              <h3 className="font-bold text-lg text-foreground">{ue.code}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {ue.title}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(ue)}>
                <Eye className="h-4 w-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(ue)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(ue.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
          {ue.description || "Aucune description disponible"}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1 rounded">
              <BookOpen className="h-3 w-3 text-blue-600" />
            </div>
            <span className="font-medium">{ue.credits} crédits</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-1 rounded">
              <Shield className="h-3 w-3 text-purple-600" />
            </div>
            <span>{ue.prerequisites?.length || 0} prérequis</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1 rounded">
            <BarChart3 className="h-3 w-3 text-amber-600" />
          </div>
          <span>Note de passage: {ue.passingGrade}%</span>
        </div>

        {ue.prerequisites && ue.prerequisites.length > 0 && (
          <div className="mb-4">
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">
              Prérequis
            </Label>
            <div className="flex flex-wrap gap-1">
              {ue.prerequisites.slice(0, 3).map((prereq) => (
                <Badge key={prereq.id} variant="outline" className="text-xs">
                  {prereq.prerequisite.code}
                </Badge>
              ))}
              {ue.prerequisites.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{ue.prerequisites.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(ue)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(ue)}>
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de tableau UE
const UETable = ({
  ues,
  onEdit,
  onDelete,
  onView,
}: {
  ues: UE[];
  onEdit: (ue: UE) => void;
  onDelete: (id: string) => void;
  onView: (ue: UE) => void;
}) => (
  <div className="border rounded-lg shadow-sm">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Code</TableHead>
          <TableHead>Intitulé</TableHead>
          <TableHead className="text-center">Type</TableHead>
          <TableHead className="text-center">Crédits</TableHead>
          <TableHead className="text-center">Note de passage</TableHead>
          <TableHead className="text-center">Prérequis</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ues.map((ue) => (
          <TableRow key={ue.id} className="hover:bg-muted/50 group">
            <TableCell className="font-mono font-semibold">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    ue.type === "Obligatoire" ? "bg-blue-500" : "bg-green-500"
                  )}
                />
                {ue.code}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{ue.title}</div>
                {ue.description && (
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {ue.description}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant={ue.type === "Obligatoire" ? "default" : "secondary"}
              >
                {ue.type}
              </Badge>
            </TableCell>
            <TableCell className="text-center font-medium">
              <Badge variant="outline" className="bg-blue-50">
                {ue.credits}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="bg-amber-50">
                {ue.passingGrade}%
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                {ue.prerequisites && ue.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {ue.prerequisites.slice(0, 2).map((prereq) => (
                      <Badge
                        key={prereq.id}
                        variant="outline"
                        className="text-xs bg-purple-50"
                        title={prereq.prerequisite.title}
                      >
                        {prereq.prerequisite.code}
                      </Badge>
                    ))}
                    {ue.prerequisites.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{ue.prerequisites.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
            </TableCell>

            <TableCell className="text-center">
              <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(ue)}
                  title="Voir détails"
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(ue)}
                  title="Modifier"
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(ue.id)}
                  title="Supprimer"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Composant de pagination
const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  const getPageNumbers = useCallback(() => {
    if (totalPages <= 1) return [];
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-muted/20">
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Éléments par page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="h-8 rounded border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <span className="font-medium">
          {startIndex}-{endIndex} sur {totalItems} éléments
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0 text-xs font-medium"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Composant de formulaire UE
const UEFormDialog = ({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  selectedUE,
  allUEs,
  onReset,
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UEFormData;
  onFormDataChange: (data: UEFormData) => void;
  onSubmit: () => void;
  selectedUE: UE | null;
  allUEs: UE[];
  onReset: () => void;
  loading?: boolean;
}) => {
  const handleFieldChange = useCallback(
    (field: keyof UEFormData, value: any) => {
      onFormDataChange({ ...formData, [field]: value });
    },
    [formData, onFormDataChange]
  );

  const availablePrerequisites = allUEs.filter(
    (ue) => ue.id !== selectedUE?.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            {selectedUE ? "Modifier l'UE" : "Créer une nouvelle UE"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {selectedUE
              ? "Modifiez les détails de l'unité d'enseignement"
              : "Remplissez les informations pour créer une nouvelle unité d'enseignement"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Code UE *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  handleFieldChange("code", e.target.value.toUpperCase())
                }
                placeholder="EX: INFO101"
                className="font-mono h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits" className="text-sm font-medium">
                Crédits ECTS *
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="30"
                value={formData.credits}
                onChange={(e) =>
                  handleFieldChange("credits", parseInt(e.target.value) || 0)
                }
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Intitulé du cours *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Ex: Algorithmique et programmation"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Description détaillée du cours..."
              className="min-h-[100px] resize-vertical"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="passingGrade" className="text-sm font-medium">
                Note de passage (%) *
              </Label>
              <Input
                id="passingGrade"
                type="number"
                min="0"
                max="100"
                value={formData.passingGrade}
                onChange={(e) =>
                  handleFieldChange(
                    "passingGrade",
                    parseInt(e.target.value) || 0
                  )
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Type d'UE *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={
                    formData.type === "Obligatoire" ? "default" : "outline"
                  }
                  onClick={() => handleFieldChange("type", "Obligatoire")}
                  className="flex-1 h-11"
                >
                  Obligatoire
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.type === "Optionnelle" ? "default" : "outline"
                  }
                  onClick={() => handleFieldChange("type", "Optionnelle")}
                  className="flex-1 h-11"
                >
                  Optionnelle
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Prérequis</Label>
            <SimpleSelect
              options={availablePrerequisites}
              selectedValues={formData.prerequisites}
              onSelect={(value) => {
                handleFieldChange("prerequisites", [
                  ...formData.prerequisites,
                  value,
                ]);
              }}
              onRemove={(value) => {
                handleFieldChange(
                  "prerequisites",
                  formData.prerequisites.filter((id) => id !== value)
                );
              }}
              placeholder="Sélectionner des prérequis..."
            />
            <p className="text-xs text-muted-foreground">
              {formData.prerequisites.length} prérequis sélectionnés
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives" className="text-sm font-medium">
              Objectifs d'apprentissage
            </Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => handleFieldChange("objectives", e.target.value)}
              placeholder="Objectifs pédagogiques et compétences visées..."
              className="min-h-[80px] resize-vertical"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              loading ||
              !formData.code ||
              !formData.title ||
              formData.credits <= 0
            }
            className="flex-1 gap-2"
          >
            {loading ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : selectedUE ? (
              <>
                <Edit className="h-4 w-4" />
                Modifier
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Créer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant principal
export const CoursesManager = () => {
  const {
    ues,
    loading,
    error,
    createUE,
    updateUE,
    deleteUE,
    fetchUEs,
    pagination,
    setPage,
    setItemsPerPage,
    setFilters,
    clearFilters,
    applySearch,
    refreshUEs,
  } = useUEStore();

  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUE, setSelectedUE] = useState<UE | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [ueToDelete, setUeToDelete] = useState<string | null>(null);
  const [ueToView, setUeToView] = useState<UE | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [formLoading, setFormLoading] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Données du formulaire
  const [formData, setFormData] = useState<UEFormData>({
    code: "",
    title: "",
    credits: 3,
    passingGrade: 70,
    type: "Obligatoire",
    prerequisites: [],
    createdById: user?.id || "",
    description: "",
    objectives: "",
  });

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = pagination.total;
    const obligatory = ues.filter((ue) => ue.type === "Obligatoire").length;
    const optional = ues.filter((ue) => ue.type === "Optionnelle").length;
    const inCatalog = ues.filter((ue) => ue.inCatalog).length;
    const averageCredits =
      ues.length > 0
        ? Math.round(
            (ues.reduce((sum, ue) => sum + ue.credits, 0) / ues.length) * 10
          ) / 10
        : 0;

    return {
      total,
      obligatory,
      optional,
      inCatalog,
      averageCredits,
    };
  }, [ues, pagination.total]);

  // Recherche avec debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        applySearch(value);
      }, 300);
    },
    [applySearch]
  );

  // Gestion des filtres avancés
  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      const mergedFilters = { ...activeFilters, ...newFilters };
      setActiveFilters(mergedFilters);
      setFilters(mergedFilters);
    },
    [activeFilters, setFilters]
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm("");
    clearFilters();
    setShowAdvancedFilters(false);
  }, [clearFilters]);

  // Gestion des UEs
  const handleCreateUE = useCallback(() => {
    setSelectedUE(null);
    setFormData({
      code: "",
      title: "",
      credits: 3,
      passingGrade: 70,
      type: "Obligatoire",
      prerequisites: [],
      createdById: user?.id || "",
      description: "",
      objectives: "",
    });
    setIsFormOpen(true);
  }, [user?.id]);

  const handleEditUE = useCallback((ue: UE) => {
    setSelectedUE(ue);
    setFormData({
      code: ue.code,
      title: ue.title,
      credits: ue.credits,
      passingGrade: ue.passingGrade || 70,
      type: ue.type,
      prerequisites: ue.prerequisites?.map((p) => p.prerequisiteId) || [],
      createdById: ue.createdById,
      description: ue.description || "",
      objectives: ue.objectives || "",
    });
    setIsFormOpen(true);
  }, []);

  const handleViewUE = useCallback((ue: UE) => {
    setUeToView(ue);
    setIsViewModalOpen(true);
  }, []);

  const handleDeleteUE = useCallback((ueId: string) => {
    setUeToDelete(ueId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (ueToDelete) {
      try {
        await deleteUE(ueToDelete);
        toast({
          title: "✅ UE supprimée",
          description: "L'unité d'enseignement a été supprimée avec succès",
        });
      } catch (error: any) {
        toast({
          title: "❌ Erreur",
          description: error.message || "Erreur lors de la suppression",
          variant: "destructive",
        });
      } finally {
        setIsDeleteModalOpen(false);
        setUeToDelete(null);
      }
    }
  }, [ueToDelete, deleteUE]);

  const handleSubmitForm = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer une UE",
        variant: "destructive",
      });
      return;
    }

    if (!formData.code || !formData.title || formData.credits <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        credits: formData.credits,
        passingGrade: formData.passingGrade,
        type: formData.type,
        description: formData.description || null,
        objectives: formData.objectives || null,
        createdById: user.id,
        prerequisites: formData.prerequisites,
      };

      if (selectedUE) {
        await updateUE(selectedUE.id, payload);
        toast({
          title: "✅ UE mise à jour",
          description: `L'unité d'enseignement ${formData.code} a été modifiée avec succès`,
        });
      } else {
        await createUE(payload);
        toast({
          title: "🎉 UE créée",
          description: `L'unité d'enseignement ${formData.code} a été ajoutée avec succès`,
        });
      }

      setIsFormOpen(false);
      setFormData({
        code: "",
        title: "",
        credits: 3,
        passingGrade: 70,
        type: "Obligatoire",
        prerequisites: [],
        createdById: user.id,
        description: "",
        objectives: "",
      });
      setSelectedUE(null);
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  }, [formData, selectedUE, user, updateUE, createUE]);

  const resetForm = useCallback(() => {
    setIsFormOpen(false);
    setFormData({
      code: "",
      title: "",
      credits: 3,
      passingGrade: 70,
      type: "Obligatoire",
      prerequisites: [],
      createdById: user?.id || "",
      description: "",
      objectives: "",
    });
    setSelectedUE(null);
    setFormLoading(false);
  }, [user?.id]);

  // Chargement initial
  useEffect(() => {
    fetchUEs();
  }, [fetchUEs]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (loading && ues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RotateCcw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  if (error && ues.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-destructive font-medium text-lg mb-2">
            Erreur de chargement
          </p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <StatsCards stats={stats} />

      {/* Carte principale */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3 text-3xl font-bold text-primary">
                <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                Gestion des Unités d'Enseignement
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Créez et gérez le catalogue des cours de l'établissement
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCreateUE}
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Nouveau Cours
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShowImportExport(true)}>
                      <Download className="h-4 w-4 mr-2" />
                      Import/Export
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={refreshUEs}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Actualiser
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Barre de recherche et contrôles */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par code, titre ou description..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-10 h-12 text-lg border-2 focus:border-primary transition-colors"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <Grid className="h-4 w-4" />
                Grille
              </Button>

              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Tableau
              </Button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <AdvancedFilters
              filters={activeFilters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          )}

          {/* Indicateurs de filtres actifs */}
          {(searchTerm || Object.keys(activeFilters).length > 0) && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="gap-2">
                    <Filter className="h-3 w-3" />
                    Filtres actifs
                  </Badge>
                  {searchTerm && (
                    <Badge variant="outline" className="gap-2">
                      <Search className="h-3 w-3" />
                      Recherche: "{searchTerm}"
                    </Badge>
                  )}
                  {activeFilters.type && (
                    <Badge variant="outline">Type: {activeFilters.type}</Badge>
                  )}
                  {activeFilters.inCatalog !== undefined && (
                    <Badge variant="outline">
                      {activeFilters.inCatalog ? "Au catalogue" : "Brouillon"}
                    </Badge>
                  )}
                  {activeFilters.credits && (
                    <Badge variant="outline">
                      Crédits: {activeFilters.credits}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-primary hover:text-primary/80"
                >
                  <X className="h-4 w-4 mr-1" />
                  Tout effacer
                </Button>
              </div>
            </div>
          )}

          {/* En-tête des résultats */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Unités d'Enseignement
              </h3>
              <p className="text-sm text-muted-foreground">
                {pagination.total} UE{pagination.total !== 1 ? "s" : ""} trouvée
                {pagination.total !== 1 ? "s" : ""}
                {searchTerm && ` pour "${searchTerm}"`}
              </p>
            </div>
            {pagination.pages > 1 && (
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.pages}
              </div>
            )}
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RotateCcw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Chargement des cours...</p>
              </div>
            </div>
          ) : ues.length > 0 ? (
            <>
              {/* Vue grille ou tableau */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                  {ues.map((ue) => (
                    <UECard
                      key={ue.id}
                      ue={ue}
                      onEdit={handleEditUE}
                      onDelete={handleDeleteUE}
                      onView={handleViewUE}
                    />
                  ))}
                </div>
              ) : (
                <UETable
                  ues={ues}
                  onEdit={handleEditUE}
                  onDelete={handleDeleteUE}
                  onView={handleViewUE}
                />
              )}

              {/* Pagination */}
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.pages}
                itemsPerPage={pagination.limit}
                totalItems={pagination.total}
                onPageChange={setPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
              <h3 className="text-2xl font-medium text-muted-foreground mb-2">
                {searchTerm || Object.keys(activeFilters).length > 0
                  ? "Aucun résultat trouvé"
                  : "Aucune UE trouvée"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || Object.keys(activeFilters).length > 0
                  ? "Essayez de modifier vos critères de recherche ou vos filtres."
                  : "Commencez par créer votre première unité d'enseignement pour construire votre catalogue de cours."}
              </p>
              {!searchTerm && Object.keys(activeFilters).length === 0 && (
                <Button onClick={handleCreateUE} size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Créer votre première UE
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulaire */}
      <UEFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmitForm}
        selectedUE={selectedUE}
        allUEs={ues}
        onReset={resetForm}
        loading={formLoading}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette UE ? Cette action est irréversible et affectera tous les étudiants inscrits à ce cours."
        confirmLabel="Supprimer définitivement"
        cancelLabel="Annuler"
      />

      {/* Modal de visualisation (à implémenter) */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de l'UE</DialogTitle>
          </DialogHeader>
          {ueToView && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Code</Label>
                  <p className="font-mono font-semibold">{ueToView.code}</p>
                </div>
                <div>
                  <Label>Crédits</Label>
                  <p>{ueToView.credits} ECTS</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge
                    variant={
                      ueToView.type === "Obligatoire" ? "default" : "secondary"
                    }
                  >
                    {ueToView.type}
                  </Badge>
                </div>
                <div>
                  <Label>Note de passage</Label>
                  <p>{ueToView.passingGrade}%</p>
                </div>
              </div>
              {ueToView.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-muted-foreground">
                    {ueToView.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showImportExport} onOpenChange={setShowImportExport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Import/Export des Unités d'Enseignement
            </DialogTitle>
            <DialogDescription>
              Importez ou exportez des UEs en lot via des fichiers Excel
            </DialogDescription>
          </DialogHeader>
          <UEImportExport onClose={() => setShowImportExport(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
