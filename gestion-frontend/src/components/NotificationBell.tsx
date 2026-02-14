// components/NotificationBell.tsx
import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  X,
  Eye,
  RefreshCw,
  ChevronDown,
  Search,
  MessageSquare,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { usePendingGrades } from "@/hooks/usePendingGrades";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Composant pour le rejet avec commentaire
const RejectDialog = ({
  grade,
  open,
  onOpenChange,
  onReject,
  isSubmitting = false,
}: {
  grade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (gradeId: string, reason: string) => Promise<void>;
  isSubmitting?: boolean;
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    await onReject(grade.id, reason);
    setReason("");
    onOpenChange(false);
  };

  if (!grade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Rejeter la note
          </DialogTitle>
          <DialogDescription>
            Indiquez la raison du rejet de la note de {grade.student?.firstName}{" "}
            {grade.student?.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du rejet *</Label>
            <Textarea
              id="reason"
              placeholder="Note incorrecte, justification manquante, format invalide..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <p className="text-sm font-medium">Détails de la note:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Étudiant:</span>
              <span className="font-medium">
                {grade.student?.firstName} {grade.student?.lastName}
              </span>
              <span className="text-muted-foreground">Matière:</span>
              <span className="font-medium">{grade.subject?.name}</span>
              <span className="text-muted-foreground">Note:</span>
              <span className="font-medium">
                {grade.grade}/{grade.subject?.maxGrade || 20}
              </span>
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{grade.controlType}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              onOpenChange(false);
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour l'approbation en masse
const BulkApproveDialog = ({
  grades,
  open,
  onOpenChange,
  onApproveAll,
  isSubmitting = false,
}: {
  grades: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproveAll: (gradeIds: string[]) => Promise<number>;
  isSubmitting?: boolean;
}) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const gradeIds = grades.map((g) => g.id);
    await onApproveAll(gradeIds);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCheck className="h-5 w-5" />
            Approuver en masse ({grades.length} notes)
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d'approuver {grades.length} note
            {grades.length > 1 ? "s" : ""} en attente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Commentaire global pour ces validations..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Liste des notes à approuver:</Label>
            <ScrollArea className="h-48 border rounded-md">
              <div className="divide-y">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {grade.student?.firstName} {grade.student?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {grade.subject?.name} • {grade.controlType}
                        </p>
                      </div>
                      <Badge className="ml-2">
                        {grade.grade}/{grade.subject?.maxGrade || 20}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setComment("");
              onOpenChange(false);
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-2" />
            )}
            Approuver tout ({grades.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Boutons de validation rapide pour une note
const QuickValidationButtons = ({
  grade,
  onApprove,
  onReject,
  onViewDetails,
  isProcessing = false,
}: {
  grade: any;
  onApprove: (gradeId: string) => void;
  onReject: (gradeId: string, reason: string) => Promise<void>;
  onViewDetails: (grade: any) => void;
  isProcessing?: boolean;
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <>
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/50"
          onClick={() => onApprove(grade.id)}
          disabled={isProcessing}
          title="Approuver"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50"
          onClick={() => setShowRejectDialog(true)}
          disabled={isProcessing}
          title="Rejeter"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50"
          onClick={() => onViewDetails(grade)}
          title="Détails"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>

      <RejectDialog
        grade={grade}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onReject={onReject}
        isSubmitting={isProcessing}
      />
    </>
  );
};

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingGrades, setProcessingGrades] = useState<string[]>([]);
  const [showBulkApprove, setShowBulkApprove] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  const { toast } = useToast();
  const { user } = useAuthStore();

  const {
    pendingGrades,
    pendingCount,
    loading,
    refetch,
    approveGradeDirectly,
    approveMultipleGrades,
    rejectGradeDirectly,
    rejectMultipleGrades,
    isAdmin,
  } = usePendingGrades();

  // Filtrer les notes selon la recherche
  const filteredGrades = pendingGrades.filter((grade) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      grade.student?.firstName?.toLowerCase().includes(searchLower) ||
      grade.student?.lastName?.toLowerCase().includes(searchLower) ||
      grade.subject?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Vérifier si une note est en cours de traitement
  const isGradeProcessing = (gradeId: string) => {
    return processingGrades.includes(gradeId);
  };

  // Gérer l'approbation d'une note
  const handleApproveGrade = async (gradeId: string) => {
    setProcessingGrades((prev) => [...prev, gradeId]);

    try {
      await approveGradeDirectly(gradeId);
      toast({
        title: "✅ Note approuvée",
        description: "La note a été validée avec succès",
      });

      // Rafraîchir la liste
      await refetch();
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible d'approuver la note",
        variant: "destructive",
      });
    } finally {
      setProcessingGrades((prev) => prev.filter((id) => id !== gradeId));
    }
  };

  // Gérer le rejet d'une note
  const handleRejectGrade = async (gradeId: string, reason: string) => {
    setProcessingGrades((prev) => [...prev, gradeId]);

    try {
      await rejectGradeDirectly(gradeId, reason);
      toast({
        title: "❌ Note rejetée",
        description: "La note a été rejetée avec succès",
      });

      await refetch();
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de rejeter la note",
        variant: "destructive",
      });
    } finally {
      setProcessingGrades((prev) => prev.filter((id) => id !== gradeId));
    }
  };

  // Gérer l'approbation en masse
  const handleApproveAll = async (gradeIds: string[]): Promise<number> => {
    setProcessingGrades(gradeIds);

    try {
      const count = await approveMultipleGrades(gradeIds);
      toast({
        title: "✅ Notes approuvées",
        description: `${count} notes ont été approuvées avec succès`,
      });

      await refetch();
      setSelectedGrades([]);
      setShowBulkApprove(false);
      return count;
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible d'approuver les notes",
        variant: "destructive",
      });
      throw error;
    } finally {
      setProcessingGrades([]);
    }
  };

  // Voir les détails d'une note
  const handleViewDetails = (grade: any) => {
    toast({
      title: "Détails de la note",
      description: `${grade.subject?.name} - ${grade.student?.firstName} ${grade.student?.lastName}`,
      action: (
        <ToastAction
          altText="Ouvrir"
          onClick={() => {
            // Ouvrir dans un nouvel onglet
            window.open(`/admin/grades?gradeId=${grade.id}`, "_blank");
          }}
        >
          Ouvrir
        </ToastAction>
      ),
    });
    setOpen(false);
  };

  // Toggle la sélection d'une note
  const toggleGradeSelection = (gradeId: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId)
        ? prev.filter((id) => id !== gradeId)
        : [...prev, gradeId]
    );
  };

  // Sélectionner/déselectionner toutes les notes filtrées
  const toggleSelectAll = () => {
    const allFilteredIds = filteredGrades.map((g) => g.id);
    if (selectedGrades.length === allFilteredIds.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades(allFilteredIds);
    }
  };

  // Ne pas afficher si pas admin
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Notes à valider"
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <Badge
                  className={`absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs bg-red-600 text-white animate-pulse`}
                >
                  {pendingCount > 9 ? "9+" : pendingCount}
                </Badge>
              )}
            </div>
            {isAdmin && (
              <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[500px] p-0" align="end" sideOffset={5}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <div>
                  <h3 className="font-bold">Validation des notes</h3>
                  <p className="text-sm text-blue-100">
                    {pendingCount} note{pendingCount !== 1 ? "s" : ""} en
                    attente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-white hover:bg-white/20"
                  onClick={refetch}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-white hover:bg-white/20"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowBulkApprove(true)}>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Approuver en masse
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        window.open("/admin/grades?filter=submitted", "_blank")
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ouvrir l'onglet Notes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Recherche */}
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-300" />
                <Input
                  placeholder="Rechercher un étudiant ou une matière..."
                  className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-blue-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Chargement...
                </p>
              </div>
            ) : filteredGrades.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCheck className="mx-auto h-12 w-12 text-green-300 mb-3" />
                <p className="font-medium text-gray-500">
                  {searchTerm ? "Aucun résultat" : "Aucune note à valider"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm
                    ? "Aucune note ne correspond à votre recherche"
                    : "Toutes les notes sont validées ✓"}
                </p>
              </div>
            ) : (
              <>
                {/* Statistiques */}
                <div className="p-3 border-b">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-700">
                        {filteredGrades.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-700">
                        {
                          filteredGrades.filter((g) => g.status === "Submitted")
                            .length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Soumises
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-700">
                        {selectedGrades.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sélection
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-700">
                        {processingGrades.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Traitement
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions de masse */}
                {filteredGrades.length > 1 && (
                  <div className="p-3 border-b bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedGrades.length === filteredGrades.length &&
                          filteredGrades.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-sm text-muted-foreground">
                        {selectedGrades.length > 0
                          ? `${selectedGrades.length} sélectionnée${
                              selectedGrades.length > 1 ? "s" : ""
                            }`
                          : "Tout sélectionner"}
                      </span>
                    </div>
                    {selectedGrades.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => setShowBulkApprove(true)}
                        className="h-7 text-xs bg-green-600 hover:bg-green-700"
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Valider ({selectedGrades.length})
                      </Button>
                    )}
                  </div>
                )}

                {/* Liste des notes */}
                <div className="divide-y">
                  {filteredGrades.map((grade) => {
                    const isProcessing = isGradeProcessing(grade.id);
                    const isSelected = selectedGrades.includes(grade.id);

                    return (
                      <div
                        key={grade.id}
                        className={cn(
                          "p-3 hover:bg-muted/50 transition-colors",
                          isSelected && "bg-blue-50 dark:bg-blue-900/20",
                          isProcessing && "opacity-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox de sélection */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleGradeSelection(grade.id)}
                            className="mt-1 h-4 w-4 rounded"
                            disabled={isProcessing}
                          />

                          {/* Icône */}
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm">
                                    {grade.student?.firstName}{" "}
                                    {grade.student?.lastName}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-blue-300 text-blue-700"
                                  >
                                    {grade.controlType}
                                  </Badge>
                                  <Badge className="text-xs bg-blue-100 text-blue-800">
                                    {grade.status === "Submitted"
                                      ? "Soumis"
                                      : "Brouillon"}
                                  </Badge>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <BookOpen className="inline h-3 w-3 mr-1" />
                                  {grade.subject?.name}
                                  <span className="mx-2">•</span>
                                  <span className="font-bold">
                                    {grade.grade}/
                                    {grade.subject?.maxGrade || 20}
                                  </span>
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDistanceToNow(
                                        new Date(grade.createdAt),
                                        {
                                          addSuffix: true,
                                          locale: fr,
                                        }
                                      )}
                                    </span>

                                    <span>
                                      Prof:{" "}
                                      {
                                        grade.classAssignment.professeur
                                          .firstName
                                      }{" "}
                                      {grade.classAssignment.professeur
                                        .lastName || "Inconnu"}
                                    </span>
                                  </div>
                                  <QuickValidationButtons
                                    grade={grade}
                                    onApprove={handleApproveGrade}
                                    onReject={handleRejectGrade}
                                    onViewDetails={handleViewDetails}
                                    isProcessing={isProcessing}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Commentaire si présent */}
                            {grade.notes && (
                              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-medium text-gray-500 dark:text-gray-300 mb-1">
                                  Commentaire:
                                </div>
                                {grade.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </ScrollArea>

          {/* Footer avec actions */}
          <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {filteredGrades.length} note
                {filteredGrades.length !== 1 ? "s" : ""} affichée
                {filteredGrades.length !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() =>
                    window.open("/admin/grades?filter=submitted", "_blank")
                  }
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Ouvrir
                </Button>
                {filteredGrades.length > 0 && (
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => setShowBulkApprove(true)}
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Tout valider
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal d'approbation en masse */}
      {showBulkApprove && (
        <BulkApproveDialog
          grades={
            selectedGrades.length > 0
              ? filteredGrades.filter((g) => selectedGrades.includes(g.id))
              : filteredGrades
          }
          open={showBulkApprove}
          onOpenChange={setShowBulkApprove}
          onApproveAll={handleApproveAll}
          isSubmitting={processingGrades.length > 0}
        />
      )}
    </>
  );
};
