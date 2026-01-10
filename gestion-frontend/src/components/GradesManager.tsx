// components/grades/GradeManager.tsx
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Users,
  BookOpen,
  GraduationCap,
  Save,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Plus,
  Upload,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ShieldAlert,
  DownloadCloud,
  UploadCloud,
  User,
  Book,
  Percent,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  RefreshCw,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
  FileDown,
  FileUp,
  Lock,
  Globe,
  TrendingUp,
  Info,
  EyeOff,
  Send,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  UserCheck,
  Bell,
  Shield,
  BookMarked,
  Archive,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useGradeStore } from "@/store/gradeStore";
import { useStudentStore } from "@/store/studentStore";
import { useClassStore } from "@/store/classStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAuthStore } from "@/store/authStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from "next-themes";
import {
  Grade as AcademicGrade,
  ClassLevel,
  Student,
  Subject,
  AcademicYear,
  ClassAssignment,
} from "@/types/academic";
import { GradeStatus, ControlType, Grade } from "@/types/bulletin";
import { UserRole } from "@/types/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Types pour les props du modal
interface GradeEditModalProps {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    controlType: ControlType;
    isDraft?: boolean;
    notes?: string;
  }) => void;
  isLoading?: boolean;
  currentControlType?: ControlType | "all" | "";
  userRole?: UserRole;
  isTeacher?: boolean;
  isAdmin?: boolean;
}

// Types pour les contrôles en masse
interface BulkControlsProps {
  selectedCount: number;
  bulkGradeValue: string;
  maxGrade: number;
  onApplyGrade: (grade: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  onSelectAll: () => void;
  allSelected: boolean;
  isTeacher?: boolean;
}

// Types pour le modal de confirmation
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
}

// Types pour les statistiques
interface Statistics {
  totalGrades: number;
  averageGrade: number;
  successRate: number;
  passedGrades: number;
  failedGrades: number;
  pendingApproval: number;
  draftGrades: number;
  publishedGrades: number;
  studentsWithoutGrade: number;
}

// Types pour les matières du professeur
interface TeacherSubject {
  id: string;
  name: string;
  code: string;
  maxGrade: number;
  passingGrade: number;
  coefficient?: number;
}

interface TeacherData {
  subjects: TeacherSubject[];
  assignments: TeacherAssignment[];
  classes: string[];
}

// Types pour les affectations du professeur
interface TeacherAssignment {
  id: string;
  subjectId: string;
  classId: string;
  classLevel: ClassLevel;
  className?: string;
  academicYearId: string;
}

// Composant de chargement réutilisable
const LoadingSpinner = ({
  message = "Chargement...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-3">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

// Composant d'état vide
const EmptyState = ({
  icon: Icon = BookOpen,
  title,
  description,
  action,
}: {
  icon?: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="text-center py-12">
    <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
    <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
      {description}
    </p>
    {action}
  </div>
);

// Composant de statistiques amélioré
const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient = "from-blue-100 to-blue-200",
  iconBg = "bg-blue-600",
  darkGradient = "from-blue-900/50 to-blue-800/50",
  trend,
}: {
  icon: any;
  value: string | number;
  label: string;
  gradient?: string;
  iconBg?: string;
  darkGradient?: string;
  trend?: "up" | "down" | "neutral";
}) => (
  <Card
    className={`border-0 shadow-md bg-gradient-to-br ${gradient} dark:${darkGradient} overflow-hidden transition-all hover:shadow-lg`}
  >
    <CardContent className="p-5 relative">
      <div className="absolute top-3 right-3 opacity-20 dark:opacity-10">
        <Icon className="h-8 w-8 text-foreground" />
      </div>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${iconBg} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
        {trend && (
          <div
            className={`p-1 rounded-full ${
              trend === "up"
                ? "bg-green-100 dark:bg-green-900/50"
                : "bg-red-100 dark:bg-red-900/50"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Badge de statut amélioré
const StatusBadge = ({ status }: { status: GradeStatus }) => {
  const statusConfig = {
    [GradeStatus.DRAFT]: {
      label: "Brouillon",
      className:
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
      icon: FileText,
    },
    [GradeStatus.SUBMITTED]: {
      label: "Soumis",
      className:
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
      icon: Send,
    },
    [GradeStatus.APPROVED]: {
      label: "Approuvé",
      className:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
      icon: CheckCircle,
    },
    [GradeStatus.PUBLISHED]: {
      label: "Publié",
      className:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
      icon: Globe,
    },
    [GradeStatus.REJECTED]: {
      label: "Rejeté",
      className:
        "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
      icon: XCircle,
    },
    [GradeStatus.ARCHIVED]: {
      label: "Archivé",
      className:
        "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700",
      icon: Archive,
    },
  };

  const config = statusConfig[status] || statusConfig[GradeStatus.DRAFT];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Modal de confirmation robuste
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  isLoading = false,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {variant === "destructive" ? (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            ) : (
              <Target className="h-5 w-5 text-blue-600" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {variant === "destructive"
              ? "Cette action ne peut pas être annulée."
              : "Veuillez confirmer cette action."}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={variant === "destructive" ? "destructive" : "default"}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Modal de rejet avec raison
const RejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  gradeInfo,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  gradeInfo: {
    studentName: string;
    subjectName: string;
    gradeValue: string;
    teacherName: string;
  };
  isLoading?: boolean;
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Veuillez saisir une raison");
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Rejeter la note
          </DialogTitle>
          <DialogDescription>
            Veuillez indiquer la raison du rejet de cette note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du rejet *</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Note incorrecte, manque de justification, format invalide, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="font-medium text-foreground mb-2">
              Détails de la note:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <span>Étudiant:</span>
              <span className="font-medium">{gradeInfo.studentName}</span>
              <span>Matière:</span>
              <span className="font-medium">{gradeInfo.subjectName}</span>
              <span>Note:</span>
              <span className="font-medium">{gradeInfo.gradeValue}</span>
              <span>Professeur:</span>
              <span className="font-medium">{gradeInfo.teacherName}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setReason("");
            }}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ThumbsDown className="h-4 w-4 mr-2" />
            )}
            Rejeter la note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Modal d'édition amélioré avec workflow de validation
const GradeEditModal = ({
  student,
  subject,
  existingGrade,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  currentControlType,
  userRole,
  isTeacher = false,
  isAdmin = false,
}: GradeEditModalProps) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [notes, setNotes] = useState(existingGrade?.notes || "");
  const lockedControlType =
    currentControlType && currentControlType !== "all"
      ? (currentControlType as ControlType)
      : undefined;
  const [controlType, setControlType] = useState<ControlType>(
    () =>
      existingGrade?.controlType || lockedControlType || ControlType.CONTROLE_1
  );
  const [isDraft, setIsDraft] = useState(
    existingGrade?.status === GradeStatus.DRAFT || isTeacher
  );
  const [errors, setErrors] = useState<{ grade?: string }>({});

  useEffect(() => {
    setGrade(existingGrade?.grade?.toString() || "");
    setNotes(existingGrade?.notes || "");
    setControlType(
      existingGrade?.controlType || lockedControlType || ControlType.CONTROLE_1
    );
    // Pour les professeurs, par défaut en brouillon s'il n'y a pas de note existante
    setIsDraft(
      existingGrade?.status === GradeStatus.DRAFT ||
        (!existingGrade && isTeacher)
    );
    setErrors({});
  }, [existingGrade, isOpen, currentControlType, isTeacher]);

  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return "La note est requise";
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > subject.maxGrade)
      return `La note ne peut pas dépasser ${subject.maxGrade}`;
    return null;
  };

  const calculateStatus = (gradeValue: number): GradeStatus => {
    const passingThreshold = (subject.passingGrade * subject.maxGrade) / 100;

    if (gradeValue >= passingThreshold) return GradeStatus.APPROVED;
    if (gradeValue >= passingThreshold * 0.7) return GradeStatus.SUBMITTED;
    return GradeStatus.REJECTED;
  };

  const handleGradeChange = (value: string) => {
    setGrade(value);
    const error = validateGrade(value);
    setErrors((prev) => ({ ...prev, grade: error || undefined }));
  };

  const handleSave = () => {
    const gradeError = validateGrade(grade);
    if (gradeError) {
      setErrors({ grade: gradeError });
      toast.error(gradeError);
      return;
    }

    const numericGrade = parseFloat(grade);

    // Déterminer le statut final selon le rôle
    let finalStatus: GradeStatus;

    if (isAdmin) {
      // L'admin peut directement approuver
      finalStatus = GradeStatus.APPROVED;
    } else if (isTeacher) {
      // Le professeur peut soit sauvegarder en brouillon, soit soumettre
      finalStatus = isDraft ? GradeStatus.DRAFT : GradeStatus.SUBMITTED;
    } else {
      // Par défaut, calculer le statut
      finalStatus = calculateStatus(numericGrade);
    }

    // Forcer le controlType si un filtre réel (non "all") est actif
    const finalControlType = lockedControlType || controlType;

    onSave({
      grade: numericGrade,
      status: finalStatus,
      controlType: finalControlType,
      isDraft: isDraft && isTeacher,
      notes: notes.trim(),
    });
  };

  const isControlTypeLocked = !!lockedControlType;
  const canEditStatus =
    isAdmin && existingGrade?.status === GradeStatus.SUBMITTED;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {existingGrade ? "Modifier la note" : "Ajouter une note"}
          </DialogTitle>
          <DialogDescription>
            Pour{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>{" "}
            - {subject.name}
            {isControlTypeLocked && (
              <span className="block text-xs text-amber-600 dark:text-amber-400 mt-1">
                Type de contrôle fixé par le filtre actif
              </span>
            )}
            {isTeacher && (
              <span className="block text-xs text-blue-600 dark:text-blue-400 mt-1">
                Mode professeur - Notes soumises à validation
              </span>
            )}
            {isAdmin && (
              <span className="block text-xs text-purple-600 dark:text-purple-400 mt-1">
                Mode administrateur - Validation directe
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium">
              Note (/{subject.maxGrade}){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max={subject.maxGrade}
              step="0.1"
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              placeholder={`Entrez la note entre 0 et ${subject.maxGrade}`}
              className={
                errors.grade
                  ? "border-destructive focus:border-destructive"
                  : ""
              }
              disabled={isLoading}
            />
            {errors.grade && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {errors.grade}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Note maximale: {subject.maxGrade}</span>
              <span>
                Seuil validation:{" "}
                {(subject.passingGrade * subject.maxGrade) / 100}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlType" className="text-sm font-medium">
              Type de contrôle
              {isControlTypeLocked && (
                <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                  (verrouillé)
                </span>
              )}
            </Label>
            <Select
              value={controlType}
              onValueChange={(value) => setControlType(value as ControlType)}
              disabled={isControlTypeLocked || isLoading}
            >
              <SelectTrigger
                id="controlType"
                className={
                  isControlTypeLocked ? "bg-muted/50 cursor-not-allowed" : ""
                }
              >
                <SelectValue placeholder="Sélectionner le type de contrôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                <SelectItem value="EXAMEN">Examen</SelectItem>
                <SelectItem value="DEVOIR">Devoir</SelectItem>
              </SelectContent>
            </Select>
            {isControlTypeLocked && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Le type de contrôle est verrouillé sur "{currentControlType}"
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Remarques (optionnel)
            </Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des remarques ou commentaires sur cette note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Option brouillon/soumission pour les professeurs */}
          {isTeacher && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mode de saisie</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isDraft ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDraft(true)}
                  className="flex-1"
                  disabled={existingGrade?.status === GradeStatus.SUBMITTED}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Brouillon
                </Button>
                <Button
                  type="button"
                  variant={!isDraft ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDraft(false)}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Soumettre
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isDraft
                  ? "La note sera enregistrée en brouillon et pourra être soumise plus tard."
                  : "La note sera soumise à l'administrateur pour validation."}
              </p>
            </div>
          )}

          {/* Statut pour l'admin */}
          {isAdmin && existingGrade && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Statut de validation
              </Label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <StatusBadge status={existingGrade.status} />
                {existingGrade.status === GradeStatus.SUBMITTED && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    En attente de validation
                  </span>
                )}
              </div>
            </div>
          )}

          {existingGrade && (
            <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground">Note actuelle:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>Note:</span>
                <span className="font-medium">
                  {existingGrade.grade}/{subject.maxGrade}
                </span>
                <span>Sur 20:</span>
                <span className="font-medium">
                  {((existingGrade.grade / subject.maxGrade) * 20).toFixed(2)}
                  /20
                </span>
                <span>Type contrôle:</span>
                <span className="font-medium">{existingGrade.controlType}</span>
                <span>Statut:</span>
                <div>
                  <StatusBadge status={existingGrade.status} />
                </div>
                {existingGrade.submittedBy && (
                  <>
                    <span>Soumis le:</span>
                    <span className="font-medium">
                      {new Date(existingGrade.submittedBy).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Aperçu de la note */}
          <div className="text-sm text-muted-foreground p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Aperçu de la note:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                {grade
                  ? ((parseFloat(grade) / subject.maxGrade) * 20).toFixed(2)
                  : "0.00"}
                /20
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span>Note sur {subject.maxGrade}:</span>
              <span className="font-medium">
                {grade || "0"}/{subject.maxGrade}
              </span>
              <span>Seuil validation:</span>
              <span className="font-medium">
                {(subject.maxGrade * subject.passingGrade) / 100}/
                {subject.maxGrade}
              </span>
              <span>Résultat:</span>
              <span
                className={`font-medium ${
                  grade &&
                  parseFloat(grade) >=
                    (subject.passingGrade * subject.maxGrade) / 100
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {grade &&
                parseFloat(grade) >=
                  (subject.passingGrade * subject.maxGrade) / 100
                  ? "✅ Validé"
                  : " Non validé"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!errors.grade || isLoading}
            className="min-w-24"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingGrade ? (
              "Mettre à jour"
            ) : isTeacher && isDraft ? (
              "Enregistrer brouillon"
            ) : isTeacher ? (
              "Soumettre"
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Contrôles en masse améliorés
const BulkControls = ({
  selectedCount,
  bulkGradeValue,
  maxGrade,
  onApplyGrade,
  onSave,
  onCancel,
  isLoading = false,
  onSelectAll,
  allSelected,
  isTeacher = false,
}: BulkControlsProps) => {
  const [localGrade, setLocalGrade] = useState(bulkGradeValue);
  const [error, setError] = useState<string>("");

  const validateGrade = (value: string): string | null => {
    const numericValue = parseFloat(value);
    if (value.trim() === "") return null;
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > maxGrade)
      return `La note ne peut pas dépasser ${maxGrade}`;
    return null;
  };

  const handleApply = () => {
    if (localGrade.trim()) {
      const error = validateGrade(localGrade);
      if (error) {
        toast.error(error);
        setError(error);
        return;
      }
      setError("");
      onApplyGrade(localGrade);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const handleGradeChange = (value: string) => {
    setLocalGrade(value);
    const error = validateGrade(value);
    setError(error || "");
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl mb-4 flex-wrap border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="h-8 w-8 p-0"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        >
          {selectedCount} étudiant(s) sélectionné(s)
        </Badge>
        {isTeacher && (
          <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
            <Send className="h-3 w-3 mr-1" />
            Soumis à validation
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="relative">
          <Input
            type="number"
            min="0"
            max={maxGrade}
            step="0.1"
            placeholder={`Note (max: ${maxGrade})`}
            value={localGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-32 h-9 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 ${
              error ? "border-destructive" : ""
            }`}
            disabled={isLoading}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
        <Button
          onClick={handleApply}
          disabled={!localGrade.trim() || !!error || isLoading}
          size="sm"
          className="h-9 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Max: {maxGrade}
        </span>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          onClick={onCancel}
          size="sm"
          className="h-9 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={onSave}
          size="sm"
          className="h-9 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          {isTeacher ? "Soumettre" : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
};

// Composant pour les actions admin sur les notes
const AdminGradeActions = ({
  grade,
  onApprove,
  onReject,
  onViewDetails,
}: {
  grade: Grade;
  onApprove: (gradeId: string) => void;
  onReject: (
    gradeId: string,
    studentName: string,
    subjectName: string,
    gradeValue: string,
    teacherName: string
  ) => void;
  onViewDetails: (grade: Grade) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onViewDetails(grade)}
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {grade.status === GradeStatus.SUBMITTED && (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onApprove(grade.id)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
            title="Approuver"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const studentName = `${grade.student?.firstName || ""} ${
                grade.student?.lastName || ""
              }`;
              const subjectName = grade.subject?.name || "";
              const gradeValue = `${grade.grade}/${
                grade.subject?.maxGrade || 100
              }`;
              const teacherName = grade.submittedBy || "Professeur inconnu";

              onReject(
                grade.id,
                studentName,
                subjectName,
                gradeValue,
                teacherName
              );
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
            title="Rejeter"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

// Composant principal GradeManager
export const GradeManager = () => {
  const { user } = useAuthStore();
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const {
    grades,
    studentGrades,
    pendingApprovalGrades,
    gradeStatistics,
    loading,
    isSaving,
    error,
    currentFilters,
    setFilters,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    bulkImportGrades,
    submitGradesForApproval,
    approveGrades,
    rejectGrades,
    publishGradesToStudents,
    exportGradesToExcel,
    clearError,
  } = useGradeStore();
  const { classes, fetchClasses } = useClassStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Filtres locaux pour l'UI
  const [localFilters, setLocalFilters] = useState({
    academicYearId: currentFilters.academicYearId || "",
    classLevel: currentFilters.classLevel || ("" as ClassLevel | ""),
    subjectId: currentFilters.subjectId || "",
    controlType:
      currentFilters.controlType || ("all" as ControlType | "all" | ""),
  });

  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkGrades, setBulkGrades] = useState<{ [key: string]: string }>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState<
    ClassAssignment[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [editingGrade, setEditingGrade] = useState<{
    studentId: string;
    subjectId: string;
  } | null>(null);

  // États pour les professeurs
  const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<
    TeacherAssignment[]
  >([]);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);

  // États pour les modals
  const [deletionConfirmation, setDeletionConfirmation] = useState<{
    isOpen: boolean;
    gradeId: string | null;
    studentName: string;
    gradeValue: string;
    subjectName: string;
  }>({
    isOpen: false,
    gradeId: null,
    studentName: "",
    gradeValue: "",
    subjectName: "",
  });

  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    gradeId: string | null;
    studentName: string;
    subjectName: string;
    gradeValue: string;
    teacherName: string;
  }>({
    isOpen: false,
    gradeId: null,
    studentName: "",
    subjectName: "",
    gradeValue: "",
    teacherName: "",
  });

  const [viewGradeDetails, setViewGradeDetails] = useState<Grade | null>(null);

  // Variables de rôle
  const isTeacher = user?.role === "Professeur";
  const isAdmin = user?.role === "Admin";
  const userId = user?.id;

  // Éviter l'hydratation mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchroniser les filtres locaux avec le store
  useEffect(() => {
    setLocalFilters({
      academicYearId: currentFilters.academicYearId || "",
      classLevel: currentFilters.classLevel || "",
      subjectId: currentFilters.subjectId || "",
      controlType: currentFilters.controlType || "all",
    });
  }, [currentFilters]);

  // Charger les années académiques au démarrage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchAcademicYears();

        if (academicYears.length > 0) {
          const currentAcademicYear =
            academicYears.find((ay) => ay.isCurrent) || academicYears[0];
          if (currentAcademicYear) {
            setSelectedAcademicYear(currentAcademicYear);
            setFilters({ academicYearId: currentAcademicYear.id });
            setLocalFilters((prev) => ({
              ...prev,
              academicYearId: currentAcademicYear.id,
            }));
          }
        }

        // Charger les données selon le rôle
        if (isTeacher && userId) {
          await loadTeacherData();
        } else {
          await loadGeneralData();
        }
      } catch (error) {
        console.error("Erreur chargement initial:", error);
        toast.error("Erreur lors du chargement des données initiales");
      }
    };

    loadInitialData();
  }, [isTeacher, userId]);

  // Fonction pour charger les données du professeur
  const loadTeacherData = async () => {
    try {
      // Récupérer l'ID du professeur connecté
      const teacherId = user?.id;
      if (!teacherId) {
        toast.error("Impossible d'identifier le professeur");
        return;
      }

      // 1. Récupérer les données du professeur depuis l'API
      const response = await fetch(`/api/teachers/${teacherId}/assignments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const teacherData: TeacherData = await response.json();

      // Mettre à jour les états
      setTeacherSubjects(teacherData.subjects);
      setTeacherAssignments(teacherData.assignments);
      setTeacherClasses(teacherData.classes);

      console.log("Données professeur chargées:", {
        subjects: teacherData.subjects.length,
        assignments: teacherData.assignments.length,
        classes: teacherData.classes.length,
      });

      // 2. Charger les étudiants pour les classes du professeur
      await fetchStudents();

      // Filtrer les étudiants des classes du professeur
      if (teacherData.assignments.length > 0) {
        const teacherClassIds = teacherData.assignments.map(
          (assign) => assign.classId
        );
        const teacherClassStudents = students.filter(
          (student) =>
            student.status === "Active" &&
            student.schoolClass?.id &&
            teacherClassIds.includes(student.schoolClass.id)
        );
        setAvailableStudents(teacherClassStudents);
      }

      // 3. Charger toutes les matières pour référence
      await fetchSubjects();

      // 4. Charger les affectations générales
      await fetchAssignments();

      toast.success("Données professeur chargées avec succès");
    } catch (error) {
      console.error(" Erreur chargement données professeur:", error);

      // Fallback: données mockées pour le développement
      if (process.env.NODE_ENV === "development") {
        console.log("Utilisation des données mockées pour le développement");

        const mockTeacherSubjects: TeacherSubject[] = [
          {
            id: "math-1",
            name: "Mathématiques",
            code: "MATH",
            maxGrade: 20,
            passingGrade: 10,
            coefficient: 4,
          },
          {
            id: "physique-1",
            name: "Physique",
            code: "PHYS",
            maxGrade: 20,
            passingGrade: 10,
            coefficient: 3,
          },
          {
            id: "chimie-1",
            name: "Chimie",
            code: "CHIM",
            maxGrade: 20,
            passingGrade: 10,
            coefficient: 2,
          },
        ];

        const mockTeacherAssignments: TeacherAssignment[] = [
          {
            id: "assign-1",
            subjectId: "math-1",
            classId: "class-1",
            classLevel: "Seconde" as ClassLevel,
            className: "Seconde A",
            academicYearId:
              localFilters.academicYearId || academicYears[0]?.id || "",
          },
          {
            id: "assign-2",
            subjectId: "physique-1",
            classId: "class-1",
            classLevel: "Seconde" as ClassLevel,
            className: "Seconde A",
            academicYearId:
              localFilters.academicYearId || academicYears[0]?.id || "",
          },
          {
            id: "assign-3",
            subjectId: "chimie-1",
            classId: "class-2",
            classLevel: "Premiere" as ClassLevel,
            className: "Première S",
            academicYearId:
              localFilters.academicYearId || academicYears[0]?.id || "",
          },
        ];

        setTeacherSubjects(mockTeacherSubjects);
        setTeacherAssignments(mockTeacherAssignments);
        setTeacherClasses(["class-1", "class-2"]);

        // Filtrer les étudiants pour les classes mockées
        await fetchStudents();
        const teacherClassStudents = students.filter(
          (student) =>
            student.status === "Active" &&
            student.schoolClass &&
            ["class-1", "class-2"].includes(student.schoolClass.id)
        );
        setAvailableStudents(teacherClassStudents);

        toast.warning("Mode développement: données mockées chargées");
      } else {
        toast.error("Impossible de charger vos données. Veuillez réessayer.");
      }
    }
  };

  // Fonction pour charger les données générales (admin)
  const loadGeneralData = async () => {
    try {
      await fetchSubjects();
      await fetchStudents();
      await fetchAssignments();
      await fetchClasses();

      setAvailableStudents(
        students.filter((student) => student.status === "Active")
      );
    } catch (error) {
      console.error("Erreur chargement données générales:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  // Ajoutez cet effet après les autres useEffect
  useEffect(() => {
    // Mettre à jour les matières disponibles quand les données changent
    const availableSubjects = getAvailableSubjects();

    if (
      isTeacher &&
      availableSubjects.length === 0 &&
      localFilters.classLevel
    ) {
      // Si le professeur n'a pas de matières pour ce niveau
      console.log("Aucune matière disponible pour ce niveau:", {
        level: localFilters.classLevel,
        year: localFilters.academicYearId,
        teacherSubjects: teacherSubjects.length,
        teacherAssignments: teacherAssignments.length,
        allSubjects: subjects.length,
      });
    }

    // Réinitialiser la matière sélectionnée si elle n'est plus disponible
    if (localFilters.subjectId && selectedSubject) {
      const isSubjectStillAvailable = availableSubjects.some(
        (s) => s.id === localFilters.subjectId
      );

      if (!isSubjectStillAvailable) {
        setLocalFilters((prev) => ({ ...prev, subjectId: "" }));
        setSelectedSubject(null);
      }
    }
  }, [
    isTeacher,
    localFilters.classLevel,
    localFilters.academicYearId,
    teacherSubjects,
    teacherAssignments,
    subjects,
    assignments,
  ]);

  // Charger les données quand les filtres changent
  useEffect(() => {
    const loadFilteredData = async () => {
      if (!localFilters.academicYearId || !localFilters.classLevel) return;

      try {
        // Mettre à jour les filtres dans le store
        setFilters({
          academicYearId: localFilters.academicYearId,
          classLevel: localFilters.classLevel,
          subjectId: localFilters.subjectId,
          controlType:
            localFilters.controlType === "all" ? "" : localFilters.controlType,
        });

        // Charger les notes
        await fetchGrades({
          academicYearId: localFilters.academicYearId,
          classLevel: localFilters.classLevel,
          subjectId: localFilters.subjectId,
          controlType:
            localFilters.controlType === "all" ? "" : localFilters.controlType,
        });

        // Filtrer les étudiants selon le rôle
        if (localFilters.classLevel) {
          let filteredStudents: Student[] = [];

          if (isTeacher) {
            // Pour le professeur : étudiants de ses classes seulement
            const assignmentsForLevel = teacherAssignments.filter(
              (assignment) =>
                assignment.classLevel === localFilters.classLevel &&
                assignment.academicYearId === localFilters.academicYearId
            );

            const classIds = assignmentsForLevel.map((a) => a.classId);
            filteredStudents = students.filter(
              (student) =>
                student.status === "Active" &&
                student.schoolClass?.level === localFilters.classLevel &&
                classIds.includes(student.schoolClass?.id || "")
            );
          } else {
            // Pour l'admin : tous les étudiants du niveau
            filteredStudents = students.filter(
              (student) =>
                student.status === "Active" &&
                student.schoolClass?.level === localFilters.classLevel
            );
          }

          setAvailableStudents(filteredStudents);
        }

        // Charger les matières disponibles selon le rôle
        if (localFilters.academicYearId && localFilters.classLevel) {
          let assignmentsForLevel: any[] = [];

          if (isTeacher) {
            // Pour le professeur : uniquement ses matières
            assignmentsForLevel = teacherAssignments.filter(
              (assignment) =>
                assignment.classLevel === localFilters.classLevel &&
                assignment.academicYearId === localFilters.academicYearId
            );
            console.log("Teacher: ", assignmentsForLevel);
          } else {
            // Pour l'admin : toutes les affectations
            assignmentsForLevel = assignments.filter(
              (assignment) =>
                assignment.classLevel === localFilters.classLevel &&
                assignment.academicYearId === localFilters.academicYearId
            );
            console.log("Admin: ", assignmentsForLevel);
          }

          setAvailableAssignments(assignmentsForLevel);
        }

        // Mettre à jour la matière sélectionnée
        if (localFilters.subjectId) {
          let subject: Subject | null = null;

          if (isTeacher) {
            const teacherSubject = teacherSubjects.find(
              (s) => s.id === localFilters.subjectId
            );
            if (teacherSubject) {
              // Convert TeacherSubject to Subject type
              subject = {
                ...teacherSubject,
                coefficient: teacherSubject.coefficient || 1,
                isActive: true,
                type: "Regular" as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }
          } else {
            subject =
              subjects.find((s) => s.id === localFilters.subjectId) || null;
          }

          setSelectedSubject(subject);
        } else {
          setSelectedSubject(null);
        }
      } catch (error) {
        console.error("Erreur chargement données filtrées:", error);
        toast.error("Erreur lors du chargement des données filtrées");
      }
    };

    loadFilteredData();
  }, [
    localFilters.academicYearId,
    localFilters.classLevel,
    localFilters.subjectId,
    localFilters.controlType,
    isTeacher,
    teacherAssignments,
    teacherSubjects,
  ]);

  // Fonction utilitaire pour les messages d'erreur
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Une erreur inconnue s'est produite";
  };

  // Obtenir les notes filtrées
  const getFilteredGrades = useCallback(() => {
    if (!selectedSubject) return [];

    return grades.filter((grade) => {
      if (grade.subjectId !== selectedSubject.id) return false;

      if (isTeacher && grade.submittedBy !== userId) {
        return false; // Le professeur ne voit que ses propres notes
      }

      if (localFilters.controlType && localFilters.controlType !== "all") {
        return grade.controlType === localFilters.controlType;
      }

      return true;
    });
  }, [grades, selectedSubject, localFilters.controlType, isTeacher, userId]);

  // Obtenir les étudiants filtrés par terme de recherche
  const getFilteredStudents = useCallback(() => {
    return availableStudents
      .filter((student) => {
        if (!searchTerm) return true;
        return (
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [availableStudents, searchTerm]);

  // Obtenir une note existante
  const getExistingGrade = useCallback(
    (studentId: string, subjectId: string) => {
      const filteredGrades = getFilteredGrades();
      return filteredGrades.find(
        (grade) =>
          grade.studentId === studentId && grade.subjectId === subjectId
      );
    },
    [getFilteredGrades]
  );

  // Calculer les statistiques
  const calculateStatistics = useCallback((): Statistics => {
    const filteredGrades = getFilteredGrades();
    const total = filteredGrades.length;
    const studentsWithoutGrade = getStudentsWithoutGrade().length;

    if (total === 0) {
      return {
        totalGrades: 0,
        averageGrade: 0,
        successRate: 0,
        passedGrades: 0,
        failedGrades: 0,
        pendingApproval: 0,
        draftGrades: 0,
        publishedGrades: 0,
        studentsWithoutGrade,
      };
    }

    const average = filteredGrades.reduce((sum, g) => sum + g.grade, 0) / total;
    const passed = filteredGrades.filter((g) => {
      const subject = isTeacher
        ? teacherSubjects.find((s) => s.id === g.subjectId)
        : subjects.find((s) => s.id === g.subjectId);
      return subject
        ? g.grade >= (subject.passingGrade * subject.maxGrade) / 100
        : false;
    }).length;
    const successRate = (passed / total) * 100;

    const pendingApproval = filteredGrades.filter(
      (g) => g.status === GradeStatus.SUBMITTED
    ).length;
    const draftGrades = filteredGrades.filter(
      (g) => g.status === GradeStatus.DRAFT
    ).length;
    const publishedGrades = filteredGrades.filter(
      (g) => g.status === GradeStatus.PUBLISHED
    ).length;

    return {
      totalGrades: total,
      averageGrade: parseFloat(average.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(1)),
      passedGrades: passed,
      failedGrades: total - passed,
      pendingApproval,
      draftGrades,
      publishedGrades,
      studentsWithoutGrade,
    };
  }, [getFilteredGrades, subjects, teacherSubjects, isTeacher]);

  // Obtenir les étudiants sans note
  const getStudentsWithoutGrade = useCallback(() => {
    if (!selectedSubject) return availableStudents;

    const studentsWithGrade = new Set(
      getFilteredGrades().map((g) => g.studentId)
    );

    return availableStudents.filter(
      (student) => !studentsWithGrade.has(student.id)
    );
  }, [selectedSubject, availableStudents, getFilteredGrades]);

  // Gestion de la sauvegarde d'une note
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      controlType: ControlType;
      isDraft?: boolean;
      notes?: string;
    }
  ) => {
    if (!localFilters.academicYearId || !localFilters.classLevel) {
      toast.error("Veuillez sélectionner une année académique et un niveau");
      return;
    }

    try {
      // Trouver l'affectation pour cette matière
      const assignment = availableAssignments.find(
        (a) => a.subjectId === subjectId
      );

      if (!assignment) {
        toast.error("Aucune affectation trouvée pour cette matière");
        return;
      }

      // Préparer les données de la note
      const gradePayload = {
        studentId,
        subjectId,
        assignmentId: assignment.id,
        grade: gradeData.grade,
        status: gradeData.status,
        controlType: gradeData.controlType,
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel as ClassLevel,
        session: "Normale" as any,
        notes: gradeData.notes || "",
        submittedBy: isTeacher ? userId : undefined,
        submittedAt:
          isTeacher && !gradeData.isDraft
            ? new Date().toISOString()
            : undefined,
      };

      const existingGrade = getExistingGrade(studentId, subjectId);

      if (existingGrade) {
        // Mettre à jour la note existante
        await updateGrade(existingGrade.id, gradePayload);

        let message = "Note mise à jour";
        if (isTeacher) {
          message = gradeData.isDraft
            ? "Note enregistrée en brouillon"
            : "Note soumise pour validation";

          // Notification à l'admin si soumission
          if (!gradeData.isDraft) {
            try {
              await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "GRADE_SUBMITTED",
                  title: "Nouvelle note soumise",
                  message: `${user?.firstName} ${user?.lastName} a soumis une note pour validation`,
                  userId: "admin",
                  data: {
                    studentId,
                    subjectId,
                    gradeId: existingGrade.id,
                    teacherId: userId,
                  },
                }),
              });
            } catch (notifError) {
              console.error("Erreur notification:", notifError);
            }
          }
        } else if (isAdmin) {
          message = "Note validée avec succès";
        }

        toast.success(message);
      } else {
        // Créer une nouvelle note
        await createGrade(gradePayload);

        let message = "Note créée avec succès";
        if (isTeacher) {
          message = gradeData.isDraft
            ? "Note enregistrée en brouillon"
            : "Note soumise pour validation";
        }

        toast.success(message);
      }

      setEditingGrade(null);
      await fetchGrades({
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel,
        subjectId: localFilters.subjectId,
        controlType:
          localFilters.controlType === "all" ? "" : localFilters.controlType,
      });
    } catch (error: any) {
      console.error(" Erreur sauvegarde note:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

  // Gestion de la suppression avec confirmation
  const handleDeleteGradeWithConfirmation = (
    gradeId: string,
    student: Student,
    grade: Grade
  ) => {
    setDeletionConfirmation({
      isOpen: true,
      gradeId,
      studentName: `${student.firstName} ${student.lastName}`,
      gradeValue: `${grade.grade}/${selectedSubject?.maxGrade || 100}`,
      subjectName: selectedSubject?.name || "Matière inconnue",
    });
  };

  // Confirmation de suppression
  const confirmDelete = async () => {
    if (!deletionConfirmation.gradeId) return;

    try {
      await deleteGrade(deletionConfirmation.gradeId);
      toast.success("Note supprimée avec succès");

      await fetchGrades({
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel,
        subjectId: localFilters.subjectId,
        controlType:
          localFilters.controlType === "all" ? "" : localFilters.controlType,
      });
    } catch (error) {
      console.error("Erreur suppression note:", error);
      toast.error("Erreur lors de la suppression de la note");
    } finally {
      setDeletionConfirmation({
        isOpen: false,
        gradeId: null,
        studentName: "",
        gradeValue: "",
        subjectName: "",
      });
    }
  };

  // Gestion de l'approbation d'une note par l'admin
  const handleApproveGrade = async (gradeId: string) => {
    try {
      await approveGrades([gradeId]);
      toast.success("Note approuvée avec succès");

      await fetchGrades({
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel,
        subjectId: localFilters.subjectId,
        controlType:
          localFilters.controlType === "all" ? "" : localFilters.controlType,
      });
    } catch (error) {
      console.error("Erreur approbation note:", error);
      toast.error("Erreur lors de l'approbation de la note");
    }
  };

  // Gestion du rejet d'une note par l'admin
  const handleRejectGrade = async (gradeId: string, reason: string) => {
    try {
      await rejectGrades([gradeId], reason);
      toast.success("Note rejetée avec succès");

      setRejectModal({
        isOpen: false,
        gradeId: null,
        studentName: "",
        subjectName: "",
        gradeValue: "",
        teacherName: "",
      });

      await fetchGrades({
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel,
        subjectId: localFilters.subjectId,
        controlType:
          localFilters.controlType === "all" ? "" : localFilters.controlType,
      });
    } catch (error) {
      console.error("Erreur rejet note:", error);
      toast.error("Erreur lors du rejet de la note");
    }
  };

  // Gestion de la sélection des étudiants
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    const filteredStudents = getFilteredStudents();
    const filteredStudentIds = filteredStudents.map((s) => s.id);

    if (selectedStudents.length === filteredStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudentIds);
    }
  };

  // Appliquer une note en masse
  const applyBulkGrade = (gradeValue: string) => {
    const numericGrade = parseFloat(gradeValue);
    const maxAllowedGrade = selectedSubject?.maxGrade || 100;

    if (
      isNaN(numericGrade) ||
      numericGrade < 0 ||
      numericGrade > maxAllowedGrade
    ) {
      toast.error(`La note doit être entre 0 et ${maxAllowedGrade}`);
      return;
    }

    const newBulkGrades = { ...bulkGrades };
    selectedStudents.forEach((studentId) => {
      newBulkGrades[studentId] = gradeValue;
    });
    setBulkGrades(newBulkGrades);
    toast.success("Note appliquée aux étudiants sélectionnés");
  };

  // Sauvegarder les notes en masse
  const saveBulkGrades = async () => {
    if (
      !selectedSubject ||
      !localFilters.academicYearId ||
      !localFilters.classLevel
    ) {
      toast.error(
        "Veuillez sélectionner une matière, une année académique et un niveau"
      );
      return;
    }

    const assignment = availableAssignments.find(
      (a) => a.subjectId === selectedSubject.id
    );

    if (!assignment) {
      toast.error("Aucune affectation trouvée pour cette matière");
      return;
    }

    const gradesData = selectedStudents
      .filter((studentId) => bulkGrades[studentId])
      .map((studentId) => {
        const gradeValue = parseFloat(bulkGrades[studentId]);

        // Déterminer le statut selon le rôle
        let status: GradeStatus;
        if (isTeacher) {
          status = GradeStatus.SUBMITTED; // Professeur => soumis pour validation
        } else if (isAdmin) {
          status = GradeStatus.APPROVED; // Admin => directement approuvé
        } else {
          status = GradeStatus.DRAFT;
        }

        return {
          studentId,
          subjectId: selectedSubject.id,
          assignmentId: assignment.id,
          grade: gradeValue,
          status,
          controlType: (localFilters.controlType === "all"
            ? "CONTROLE_1"
            : localFilters.controlType || "CONTROLE_1") as ControlType,
          academicYearId: localFilters.academicYearId,
          classLevel: localFilters.classLevel as ClassLevel,
          notes: "Import en masse",
          submittedBy: isTeacher ? userId : undefined,
          submittedAt: isTeacher ? new Date().toISOString() : undefined,
        };
      });

    if (gradesData.length === 0) {
      toast.error("Aucune note à sauvegarder");
      return;
    }

    try {
      await bulkImportGrades(
        gradesData,
        localFilters.academicYearId,
        assignment.id
      );

      // Notification pour l'admin si le professeur a soumis
      if (isTeacher && gradesData.length > 0) {
        try {
          await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "BULK_GRADES_SUBMITTED",
              title: "Notes en masse soumises",
              message: `${user?.firstName} ${user?.lastName} a soumis ${gradesData.length} notes pour validation`,
              userId: "admin",
              data: {
                subjectId: selectedSubject.id,
                gradeCount: gradesData.length,
                teacherId: userId,
              },
            }),
          });
        } catch (notifError) {
          console.error("Erreur notification:", notifError);
        }
      }

      setBulkGrades({});
      setBulkEditMode(false);
      setSelectedStudents([]);

      toast.success(
        isTeacher
          ? `${gradesData.length} notes soumises pour validation`
          : `${gradesData.length} notes importées avec succès`
      );
    } catch (error) {
      console.error("Erreur sauvegarde en masse:", error);
      toast.error("Erreur lors de la sauvegarde en masse");
    }
  };

  // Soumettre des notes pour validation
  const handleSubmitForApproval = async () => {
    if (!selectedSubject || selectedStudents.length === 0) {
      toast.error("Veuillez sélectionner des étudiants");
      return;
    }

    const gradeIds = getFilteredGrades()
      .filter(
        (grade) =>
          selectedStudents.includes(grade.studentId) &&
          grade.status === GradeStatus.DRAFT &&
          grade.submittedBy === userId
      )
      .map((grade) => grade.id);

    if (gradeIds.length === 0) {
      toast.error("Aucune note en brouillon à soumettre pour ces étudiants");
      return;
    }

    try {
      await submitGradesForApproval({
        gradeIds,
        submitAll: false,
      });

      // Notification à l'admin
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "GRADES_SUBMITTED",
            title: "Notes soumises pour validation",
            message: `${user?.firstName} ${user?.lastName} a soumis ${gradeIds.length} notes pour validation`,
            userId: "admin",
            data: {
              subjectId: selectedSubject.id,
              gradeCount: gradeIds.length,
              teacherId: userId,
            },
          }),
        });
      } catch (notifError) {
        console.error("Erreur notification:", notifError);
      }

      toast.success(`${gradeIds.length} notes soumises pour validation`);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Erreur soumission pour validation:", error);
      toast.error("Erreur lors de la soumission");
    }
  };

  // Fonctions d'import/export
  const handleExportExcel = async () => {
    try {
      const blob = await exportGradesToExcel({
        academicYearId: localFilters.academicYearId,
        classLevel: localFilters.classLevel,
        subjectId: localFilters.subjectId,
        controlType:
          localFilters.controlType === "all" ? "" : localFilters.controlType,
      });

      const filename = `notes-${selectedSubject?.code || "export"}-${
        localFilters.classLevel
      }-${new Date().toISOString().split("T")[0]}.xlsx`;

      saveAs(blob, filename);
      toast.success("Export Excel réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export Excel");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        if (!content) throw new Error("Impossible de lire le fichier");

        const workbook = XLSX.read(content, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const gradesData: any[] = data.map((item: any) => {
          const student = students.find(
            (s) => s.studentCode === item["Matricule"]
          );
          const subject = isTeacher
            ? teacherSubjects.find((s) => s.code === item["Code Matière"])
            : subjects.find((s) => s.code === item["Code Matière"]);

          if (!student || !subject) {
            throw new Error("Étudiant ou matière non trouvé");
          }

          const assignment = availableAssignments.find(
            (a) => a.subjectId === subject.id
          );

          if (!assignment) {
            throw new Error("Affectation non trouvée pour cette matière");
          }

          return {
            studentId: student.id,
            subjectId: subject.id,
            assignmentId: assignment.id,
            grade: parseFloat(item["Note"]),
            status: isTeacher ? GradeStatus.SUBMITTED : GradeStatus.APPROVED,
            controlType:
              localFilters.controlType === "all"
                ? "CONTROLE_1"
                : (localFilters.controlType as ControlType) || "CONTROLE_1",
            academicYearId: localFilters.academicYearId,
            classLevel: localFilters.classLevel as ClassLevel,
            notes: item["Remarques"] || "",
            submittedBy: isTeacher ? userId : undefined,
            submittedAt: isTeacher ? new Date().toISOString() : undefined,
          };
        });

        await bulkImportGrades(gradesData, localFilters.academicYearId);
        toast.success("Import réussi");
      } catch (error) {
        console.error("Erreur import:", error);
        toast.error(`Erreur lors de l'import: ${getErrorMessage(error)}`);
      }
    };

    reader.onerror = () => {
      toast.error("Erreur de lecture du fichier");
    };

    reader.readAsBinaryString(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Obtenir les matières disponibles selon le rôle
  // Modifiez la fonction getAvailableSubjects
  const getAvailableSubjects = () => {
    if (!localFilters.classLevel || !localFilters.academicYearId) {
      return isTeacher ? teacherSubjects : subjects;
    }

    // Pour l'admin: toutes les matières
    if (!isTeacher) {
      const assignmentsForLevel = assignments.filter(
        (assignment) =>
          assignment.classLevel === localFilters.classLevel &&
          assignment.academicYearId === localFilters.academicYearId
      );

      const subjectIds = assignmentsForLevel.map(
        (assignment) => assignment.subject.id
      );

      return subjects.filter((subject) => subjectIds.includes(subject.id));
    }

    // Pour le professeur: matières selon ses affectations
    const assignmentsForLevel = teacherAssignments.filter(
      (assignment) =>
        assignment.classLevel === localFilters.classLevel &&
        assignment.academicYearId === localFilters.academicYearId
    );

    if (assignmentsForLevel.length === 0) {
      return [];
    }

    const subjectIds = assignmentsForLevel.map(
      (assignment) => assignment.subjectId
    );

    // Récupérer les détails complets des matières
    const availableSubjects = teacherSubjects.filter((subject) =>
      subjectIds.includes(subject.id)
    );

    // Si on a des IDs mais pas les détails, essayer de les récupérer depuis le store
    if (availableSubjects.length === 0 && subjectIds.length > 0) {
      return subjects.filter((subject) => subjectIds.includes(subject.id));
    }

    return availableSubjects;
  };

  // Obtenir le label du niveau
  const getLevelLabel = (level: string): string => {
    const levels: Record<string, string> = {
      Sixieme: "7ème A.F",
      Cinquieme: "8ème A.F",
      Quatrieme: "9ème A.F",
      Troisieme: "3ème Secondaire",
      Seconde: "Seconde",
      Premiere: "Rhéto",
      Terminale: "Terminale",
      NSI: "NSI",
      NSII: "NSII",
      NSIII: "NSIII",
      NSIV: "NSIV",
    };
    return levels[level] || level;
  };

  // Vérifier les permissions
  const canEditGrade = (grade: Grade | undefined): boolean => {
    if (!grade) return true; // Nouvelle note

    if (isAdmin) return true; // Admin peut tout modifier

    if (isTeacher) {
      // Le professeur peut modifier ses propres notes non validées
      return (
        grade.submittedBy === userId &&
        (grade.status === GradeStatus.DRAFT ||
          grade.status === GradeStatus.SUBMITTED)
      );
    }

    return false;
  };

  const canDeleteGrade = (grade: Grade): boolean => {
    if (isAdmin) return true;

    if (isTeacher) {
      return grade.submittedBy === userId && grade.status === GradeStatus.DRAFT;
    }

    return false;
  };

  // Statistiques calculées
  const statistics = calculateStatistics();

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/30 min-h-screen">
      {/* Header avec import/export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 Gestion des Notes
            </h1>
            {isTeacher && (
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                <User className="h-3 w-3 mr-1" />
                Mode Professeur
              </Badge>
            )}
            {isAdmin && (
              <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700">
                <Shield className="h-3 w-3 mr-1" />
                Mode Administrateur
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {isTeacher
              ? "Saisissez et soumettez vos notes pour validation par l'administrateur"
              : "Gérez et validez toutes les notes du système"}
          </p>
          {isTeacher && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              ⓘ Vos notes seront soumises à l'administrateur pour validation
              avant publication
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".xlsx,.xls"
            className="hidden"
          />

          {isAdmin && (
            <>
              <Button
                onClick={handleExportExcel}
                variant="outline"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>

              <Button
                onClick={handleImportClick}
                variant="outline"
                className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                disabled={loading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </>
          )}

          {isTeacher && selectedStudents.length > 0 && !bulkEditMode && (
            <Button
              onClick={handleSubmitForApproval}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:from-amber-700 dark:to-orange-700"
              disabled={loading}
            >
              <Send className="h-4 w-4 mr-2" />
              Soumettre ({selectedStudents.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Filtres
              </CardTitle>
              {isTeacher && (
                <Badge variant="outline" className="text-xs">
                  Vos matières seulement
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Année académique */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-sm font-medium">
                Année académique
              </Label>
              <Select
                value={localFilters.academicYearId}
                onValueChange={(value) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    academicYearId: value,
                  }));
                  const year = academicYears.find((ay) => ay.id === value);
                  setSelectedAcademicYear(year || null);
                  setSelectedSubject(null);
                }}
                disabled={loading}
              >
                <SelectTrigger
                  id="academicYear"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                      {year.isCurrent && " (En cours)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau de classe */}
            <div className="space-y-2">
              <Label htmlFor="classLevel" className="text-sm font-medium">
                Niveau
              </Label>
              <Select
                value={localFilters.classLevel}
                onValueChange={(value) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    classLevel: value as ClassLevel | "",
                    subjectId: "", // Réinitialiser la matière
                  }));
                  setSelectedSubject(null);
                }}
                disabled={loading}
              >
                <SelectTrigger
                  id="classLevel"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sixieme">7ème A.F</SelectItem>
                  <SelectItem value="Cinquieme">8ème A.F</SelectItem>
                  <SelectItem value="Quatrieme">9ème A.F</SelectItem>
                  <SelectItem value="Troisieme">3ème Secondaire</SelectItem>
                  <SelectItem value="Seconde">Seconde</SelectItem>
                  <SelectItem value="Premiere">Rhéto</SelectItem>
                  <SelectItem value="Terminale">Terminale</SelectItem>
                  <SelectItem value="NSI">NSI</SelectItem>
                  <SelectItem value="NSII">NSII</SelectItem>
                  <SelectItem value="NSIII">NSIII</SelectItem>
                  <SelectItem value="NSIV">NSIV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Matière {isTeacher && "(Vos matières)"}
              </Label>
              <Select
                value={localFilters.subjectId}
                onValueChange={(value) => {
                  setLocalFilters((prev) => ({ ...prev, subjectId: value }));
                  const foundSubject = getAvailableSubjects().find(
                    (s) => s.id === value
                  );

                  // Convert TeacherSubject to Subject if necessary
                  let subject: Subject | null = null;
                  if (foundSubject) {
                    if ("isActive" in foundSubject) {
                      // It's already a Subject
                      subject = foundSubject as Subject;
                    } else {
                      // It's a TeacherSubject, convert to Subject
                      subject = {
                        ...foundSubject,
                        coefficient: foundSubject.coefficient || 1,
                        isActive: true,
                        type: "Regular" as any,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                    }
                  }

                  setSelectedSubject(subject);
                }}
                disabled={!localFilters.classLevel || loading}
              >
                <SelectTrigger
                  id="subject"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      !localFilters.classLevel
                        ? "Sélectionnez d'abord un niveau"
                        : !localFilters.academicYearId
                        ? "Sélectionnez une année académique"
                        : getAvailableSubjects().length === 0
                        ? isTeacher
                          ? "Aucune matière assignée pour ce niveau"
                          : "Aucune matière disponible"
                        : "Choisir une matière"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSubjects().map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {subject.code} - {subject.name}
                        </span>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Max: {subject.maxGrade}/20</span>
                          <span>Coeff: {subject.coefficient || 1}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Message d'aide pour les professeurs */}
              {isTeacher &&
                localFilters.classLevel &&
                getAvailableSubjects().length === 0 && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          Aucune matière assignée
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                          Vous n'avez pas de matière assignée pour le niveau{" "}
                          <strong>
                            {getLevelLabel(localFilters.classLevel)}
                          </strong>{" "}
                          cette année. Contactez l'administrateur pour vous
                          assigner des matières.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Type de contrôle */}
            <div className="space-y-2">
              <Label htmlFor="controlType" className="text-sm font-medium">
                Type de contrôle
              </Label>
              <Select
                value={localFilters.controlType}
                onValueChange={(value) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    controlType: value as ControlType | "all" | "",
                  }));
                }}
                disabled={loading}
              >
                <SelectTrigger
                  id="controlType"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue placeholder="Tous les contrôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les contrôles</SelectItem>
                  <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                  <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                  <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                  <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                  <SelectItem value="EXAMEN">Examen</SelectItem>
                  <SelectItem value="DEVOIR">Devoir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Rechercher un étudiant
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nom, prénom ou matricule..."
                    className="pl-9 h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avertissement sur le filtre de contrôle */}
      {localFilters.controlType && localFilters.controlType !== "all" && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Filtre actif : Type de contrôle "{localFilters.controlType}"
            </p>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 ml-7">
            Toutes les notes saisies seront automatiquement associées à ce type
            de contrôle. Le sélecteur de type de contrôle est désactivé dans le
            modal d'édition.
          </p>
        </div>
      )}

      {/* Instructions pour le professeur */}
      {isTeacher && selectedSubject && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Instructions pour la saisie des notes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 ml-7">
            <div className="flex items-start gap-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Mode Brouillon
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Enregistrez temporairement sans soumission
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 bg-amber-100 dark:bg-amber-800 rounded">
                <Send className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Mode Soumission
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Envoyez à l'admin pour validation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 bg-green-100 dark:bg-green-800 rounded">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-700 dark:text-green-300">
                  Après validation
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  L'admin valide et publie aux étudiants
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {selectedSubject && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              value={selectedAcademicYear?.year || "N/A"}
              label="Année académique"
              gradient="from-blue-100 to-blue-200"
              darkGradient="from-blue-900/50 to-blue-800/50"
            />
            <StatCard
              icon={Users}
              value={availableStudents.length}
              label="Étudiants inscrits"
              gradient="from-green-100 to-green-200"
              iconBg="bg-green-600"
              darkGradient="from-green-900/50 to-green-800/50"
            />
            <StatCard
              icon={BookOpen}
              value={getAvailableSubjects().length}
              label={isTeacher ? "Mes matières" : "Matières disponibles"}
              gradient="from-purple-100 to-purple-200"
              iconBg="bg-purple-600"
              darkGradient="from-purple-900/50 to-purple-800/50"
            />
            <StatCard
              icon={GraduationCap}
              value={statistics.studentsWithoutGrade}
              label="Étudiants sans note"
              gradient="from-amber-100 to-amber-200"
              iconBg="bg-amber-600"
              darkGradient="from-amber-900/50 to-amber-800/50"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={BarChart3}
              value={`${statistics.averageGrade.toFixed(1)}/20`}
              label="Moyenne générale"
              gradient="from-indigo-100 to-indigo-200"
              iconBg="bg-indigo-600"
              darkGradient="from-indigo-900/50 to-indigo-800/50"
            />
            <StatCard
              icon={Percent}
              value={`${statistics.successRate.toFixed(1)}%`}
              label="Taux de réussite"
              gradient="from-emerald-100 to-emerald-200"
              iconBg="bg-emerald-600"
              darkGradient="from-emerald-900/50 to-emerald-800/50"
            />
            <StatCard
              icon={CheckCircle}
              value={statistics.passedGrades}
              label="Notes validées"
              gradient="from-teal-100 to-teal-200"
              iconBg="bg-teal-600"
              darkGradient="from-teal-900/50 to-teal-800/50"
            />
            <StatCard
              icon={Clock}
              value={statistics.pendingApproval}
              label={isTeacher ? "Mes notes en attente" : "Notes en attente"}
              gradient="from-orange-100 to-orange-200"
              iconBg="bg-orange-600"
              darkGradient="from-orange-900/50 to-orange-800/50"
            />
          </div>
        </>
      )}

      {/* Informations sur la sélection */}
      {selectedSubject && localFilters.classLevel && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  {getLevelLabel(localFilters.classLevel)}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  {localFilters.controlType === "all"
                    ? "Tous les contrôles"
                    : localFilters.controlType}
                </Badge>
                <Badge className="text-xs bg-amber-500/20 text-amber-100 border-amber-400/30">
                  {selectedSubject.code}
                </Badge>
                <Badge className="text-xs bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                  Max: {selectedSubject.maxGrade}/20
                </Badge>
                <Badge className="text-xs bg-blue-500/20 text-blue-100 border-blue-400/30">
                  Seuil:{" "}
                  {(selectedSubject.passingGrade * selectedSubject.maxGrade) /
                    100}
                  /20
                </Badge>
                {isTeacher && (
                  <Badge className="text-xs bg-purple-500/20 text-purple-100 border-purple-400/30">
                    <User className="h-3 w-3 mr-1" />
                    Vos notes
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold">{selectedSubject.name}</h2>
              <div className="flex items-center gap-6 mt-2 flex-wrap text-sm">
                <div>
                  <p className="text-indigo-200">Année académique</p>
                  <p className="font-semibold">
                    {selectedAcademicYear?.year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Étudiants inscrits</p>
                  <p className="font-semibold">{availableStudents.length}</p>
                </div>
                <div>
                  <p className="text-indigo-200">Notes saisies</p>
                  <p className="font-semibold">
                    {statistics.totalGrades}/{availableStudents.length}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200">Moyenne générale</p>
                  <p className="font-semibold">
                    {statistics.averageGrade.toFixed(1)}/20
                  </p>
                </div>
                {isTeacher && (
                  <div>
                    <p className="text-indigo-200">Mes brouillons</p>
                    <p className="font-semibold">{statistics.draftGrades}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* État de chargement */}
      {loading && <LoadingSpinner message="Chargement des données..." />}

      {/* Liste des étudiants */}
      {!loading && selectedSubject && availableStudents.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  {selectedSubject.name} ({selectedSubject.code})
                  {isTeacher && (
                    <Badge variant="outline" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Vos notes
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Validation
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {availableStudents.length} étudiant(s) - Seuil validation:{" "}
                  {(selectedSubject.passingGrade * selectedSubject.maxGrade) /
                    100}
                  /20 - Note max: {selectedSubject.maxGrade}/20
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 h-10 w-[200px] border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {!bulkEditMode ? (
                  <>
                    <Button
                      onClick={() => setBulkEditMode(true)}
                      className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
                      disabled={!selectedSubject}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Édition en masse
                    </Button>

                    {isTeacher && selectedStudents.length > 0 && (
                      <Button
                        onClick={handleSubmitForApproval}
                        className="h-10 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:from-amber-700 dark:to-orange-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Soumettre ({selectedStudents.length})
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={selectAllStudents}
                    className="h-10 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    {selectedStudents.length === getFilteredStudents().length
                      ? "Tout désélectionner"
                      : "Tout sélectionner"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Contrôles d'édition en masse */}
            {bulkEditMode && (
              <BulkControls
                selectedCount={selectedStudents.length}
                bulkGradeValue={Object.values(bulkGrades)[0] || ""}
                maxGrade={selectedSubject?.maxGrade}
                onApplyGrade={applyBulkGrade}
                onSave={saveBulkGrades}
                onCancel={() => {
                  setBulkEditMode(false);
                  setSelectedStudents([]);
                  setBulkGrades({});
                }}
                isLoading={isSaving}
                onSelectAll={selectAllStudents}
                allSelected={
                  selectedStudents.length === getFilteredStudents().length
                }
                isTeacher={isTeacher}
              />
            )}

            <div className="space-y-3">
              {getFilteredStudents().map((student) => {
                const existingGrade = getExistingGrade(
                  student.id,
                  selectedSubject.id
                );
                const isSelected = selectedStudents.includes(student.id);
                const bulkGradeValue = bulkGrades[student.id] || "";
                const canEdit = canEditGrade(existingGrade);
                const canDelete = existingGrade
                  ? canDeleteGrade(existingGrade)
                  : false;

                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                    } ${
                      existingGrade?.status === GradeStatus.DRAFT
                        ? "bg-amber-50/50 dark:bg-amber-900/20"
                        : existingGrade?.status === GradeStatus.SUBMITTED
                        ? "bg-blue-50/50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    {/* Checkbox pour la sélection en masse */}
                    {bulkEditMode ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                      />
                    ) : (
                      <div className="w-5" /> // Espacement pour alignement
                    )}

                    <div className="flex-1 ml-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.studentCode}
                            {student.schoolClass &&
                              ` • ${student.schoolClass.name}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {bulkEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          max={selectedSubject?.maxGrade}
                          step="0.1"
                          placeholder={`Max: ${selectedSubject?.maxGrade}`}
                          value={bulkGradeValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Validation côté client
                            if (value.trim() === "") {
                              setBulkGrades((prev) => ({
                                ...prev,
                                [student.id]: value,
                              }));
                              return;
                            }

                            const numericValue = parseFloat(value);
                            const maxAllowed = selectedSubject?.maxGrade || 20;

                            if (numericValue > maxAllowed) {
                              toast.error(
                                `La note ne peut pas dépasser ${maxAllowed}`
                              );
                              return;
                            }

                            setBulkGrades((prev) => ({
                              ...prev,
                              [student.id]: value,
                            }));
                          }}
                          className="w-40 h-9 text-sm border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700"
                        />
                      ) : existingGrade ? (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge className="text-lg font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700">
                              {existingGrade.grade}/{selectedSubject.maxGrade}
                            </Badge>
                            {renderGradeStatus(existingGrade)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {existingGrade.controlType} •{" "}
                            {new Date(
                              existingGrade.createdAt
                            ).toLocaleDateString("fr-FR")}
                            {existingGrade.submittedBy === userId && (
                              <span className="ml-2 text-blue-600 dark:text-blue-400">
                                (Votre note)
                              </span>
                            )}
                          </p>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                        >
                          Non noté
                        </Badge>
                      )}

                      {!bulkEditMode && (
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingGrade({
                                  studentId: student.id,
                                  subjectId: selectedSubject.id,
                                })
                              }
                              className="h-9 w-9 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                              title="Modifier la note"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          {isAdmin && existingGrade && (
                            <AdminGradeActions
                              grade={existingGrade}
                              onApprove={handleApproveGrade}
                              onReject={(
                                gradeId,
                                studentName,
                                subjectName,
                                gradeValue,
                                teacherName
                              ) => {
                                setRejectModal({
                                  isOpen: true,
                                  gradeId,
                                  studentName,
                                  subjectName,
                                  gradeValue,
                                  teacherName,
                                });
                              }}
                              onViewDetails={(grade) =>
                                setViewGradeDetails(grade)
                              }
                            />
                          )}

                          {canDelete && existingGrade && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                handleDeleteGradeWithConfirmation(
                                  existingGrade.id,
                                  student,
                                  existingGrade
                                );
                              }}
                              className="h-9 w-9 p-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                              title="Supprimer la note"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {getFilteredStudents().length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun étudiant ne correspond à votre recherche
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* État vide quand aucun étudiant */}
      {!loading && selectedSubject && availableStudents.length === 0 && (
        <EmptyState
          icon={Users}
          title="Aucun étudiant trouvé"
          description={
            searchTerm
              ? "Aucun étudiant ne correspond à votre recherche. Essayez d'autres termes."
              : isTeacher
              ? "Aucun étudiant n'est inscrit dans vos classes pour les critères sélectionnés."
              : "Aucun étudiant n'est inscrit pour les critères sélectionnés."
          }
        />
      )}

      {/* État vide quand aucune matière sélectionnée */}
      {!loading && localFilters.classLevel && !selectedSubject && (
        <EmptyState
          icon={BookOpen}
          title="Choisissez une matière"
          description={
            isTeacher
              ? "Sélectionnez une matière que vous enseignez pour afficher et gérer les notes."
              : "Sélectionnez une matière dans la liste pour afficher et gérer les notes."
          }
          action={
            getAvailableSubjects().length > 0 ? (
              <Button
                onClick={() => {
                  const firstSubject = getAvailableSubjects()[0];
                  if (firstSubject) {
                    setLocalFilters((prev) => ({
                      ...prev,
                      subjectId: firstSubject.id,
                    }));

                    // Convert TeacherSubject to Subject if necessary
                    let subject: Subject;
                    if (
                      isTeacher &&
                      "coefficient" in firstSubject &&
                      !("isActive" in firstSubject)
                    ) {
                      // It's a TeacherSubject, convert to Subject
                      subject = {
                        ...firstSubject,
                        coefficient: firstSubject.coefficient || 1,
                        isActive: true,
                        type: "Regular" as any,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                    } else {
                      // It's already a Subject
                      subject = firstSubject as Subject;
                    }

                    setSelectedSubject(subject);
                  }
                }}
              >
                Sélectionner la première matière disponible
              </Button>
            ) : isTeacher ? (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Aucune matière assignée pour ce niveau
              </p>
            ) : null
          }
        />
      )}

      {/* État vide quand aucun niveau sélectionné */}
      {!loading && !localFilters.classLevel && (
        <EmptyState
          icon={GraduationCap}
          title="Sélectionnez un niveau"
          description="Veuillez sélectionner un niveau de classe pour commencer la gestion des notes."
        />
      )}

      {/* Modal d'édition */}
      {editingGrade && selectedSubject && (
        <GradeEditModal
          student={students.find((s) => s.id === editingGrade.studentId)!}
          subject={selectedSubject}
          existingGrade={getExistingGrade(
            editingGrade.studentId,
            editingGrade.subjectId
          )}
          isOpen={!!editingGrade}
          onClose={() => setEditingGrade(null)}
          onSave={(gradeData) =>
            handleSaveGrade(
              editingGrade.studentId,
              editingGrade.subjectId,
              gradeData
            )
          }
          isLoading={isSaving}
          currentControlType={localFilters.controlType}
          userRole={user?.role}
          isTeacher={isTeacher}
          isAdmin={isAdmin}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={deletionConfirmation.isOpen}
        onClose={() =>
          setDeletionConfirmation({
            isOpen: false,
            gradeId: null,
            studentName: "",
            gradeValue: "",
            subjectName: "",
          })
        }
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer la note ${deletionConfirmation.gradeValue} de ${deletionConfirmation.studentName} pour la matière ${deletionConfirmation.subjectName} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        isLoading={isSaving}
      />

      {/* Modal de rejet */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() =>
          setRejectModal({
            isOpen: false,
            gradeId: null,
            studentName: "",
            subjectName: "",
            gradeValue: "",
            teacherName: "",
          })
        }
        onConfirm={(reason) => {
          if (rejectModal.gradeId) {
            handleRejectGrade(rejectModal.gradeId, reason);
          }
        }}
        gradeInfo={{
          studentName: rejectModal.studentName,
          subjectName: rejectModal.subjectName,
          gradeValue: rejectModal.gradeValue,
          teacherName: rejectModal.teacherName,
        }}
        isLoading={isSaving}
      />

      {/* Modal de détails de note */}
      {viewGradeDetails && (
        <Dialog
          open={!!viewGradeDetails}
          onOpenChange={() => setViewGradeDetails(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Détails de la note
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Étudiant</p>
                  <p className="font-medium">
                    {viewGradeDetails.student?.firstName}{" "}
                    {viewGradeDetails.student?.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Matricule</p>
                  <p className="font-medium">
                    {viewGradeDetails.student?.studentCode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Matière</p>
                  <p className="font-medium">
                    {viewGradeDetails.subject?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Note</p>
                  <p className="font-medium">
                    {viewGradeDetails.grade}/
                    {viewGradeDetails.subject?.maxGrade || 20}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <div>
                    <StatusBadge status={viewGradeDetails.status} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Type contrôle</p>
                  <p className="font-medium">{viewGradeDetails.controlType}</p>
                </div>
                {viewGradeDetails.submittedBy && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Soumis le</p>
                    <p className="font-medium">
                      {new Date(viewGradeDetails.submittedBy).toLocaleString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                )}
                {viewGradeDetails.validatedAt && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Validé le</p>
                    <p className="font-medium">
                      {new Date(viewGradeDetails.validatedAt).toLocaleString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                )}
                {viewGradeDetails.notes && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Remarques</p>
                    <p className="font-medium bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {viewGradeDetails.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Fonction utilitaire pour afficher le statut
const renderGradeStatus = (grade: Grade) => {
  const getStatusInfo = (status: GradeStatus) => {
    switch (status) {
      case GradeStatus.DRAFT:
        return {
          text: "Brouillon",
          className:
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
          icon: FileText,
        };
      case GradeStatus.SUBMITTED:
        return {
          text: "Soumis",
          className:
            "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
          icon: Send,
        };
      case GradeStatus.APPROVED:
        return {
          text: "Approuvé",
          className:
            "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
          icon: CheckCircle,
        };
      case GradeStatus.PUBLISHED:
        return {
          text: "Publié",
          className:
            "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
          icon: Globe,
        };
      case GradeStatus.REJECTED:
        return {
          text: "Rejeté",
          className:
            "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
          icon: XCircle,
        };
      default:
        return {
          text: "Inconnu",
          className:
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const statusInfo = getStatusInfo(grade.status);
  const Icon = statusInfo.icon;

  return (
    <Badge className={`flex items-center gap-1 ${statusInfo.className}`}>
      <Icon className="h-3 w-3" />
      {statusInfo.text}
    </Badge>
  );
};

export default GradeManager;
