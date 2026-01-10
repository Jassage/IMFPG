import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Users,
  BookOpen,
  Save,
  Filter,
  Download,
  Search,
  BarChart3,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Percent,
  Award,
  FileText,
  Info,
  Calendar,
  School,
  Book,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  ShieldAlert,
  Target,
  Send,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Upload,
  Bell,
  Shield,
  BookMarked,
  TrendingUp,
  History,
  DownloadCloud,
  UploadCloud,
  Zap,
  Sparkles,
  ClipboardCheck,
  CalendarDays,
  GraduationCap,
  Calculator,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  FileCheck,
  FileX,
  Check,
  X,
  AlertTriangle,
  Clock4,
  FileClock,
  SendHorizonal,
  SaveAll,
  FileWarning,
  Archive,
  Globe,
} from "lucide-react";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useGradeStore } from "@/store/gradeStore";
import { useStudentStore } from "@/store/studentStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useAuthStore } from "@/store/authStore";
import { useClassStore } from "@/store/classStore";
import { useSubjectStore } from "@/store/subjectStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Grade,
  GradeStatus,
  ClassLevel,
  Student,
  Subject,
  AcademicYear,
  ClassAssignment,
  SchoolClass,
} from "@/types/academic";
import { ControlType } from "@/types/bulletin";
import type { Grade as BulletinGrade } from "@/types/bulletin";

// Types pour le professeur
interface ProfessorGradeManagerProps {
  professorId?: string;
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
  averageOn20: number;
  successRate: number;
  passedGrades: number;
  failedGrades: number;
  bestGrade: number;
  worstGrade: number;
  completionRate: number;
  draftCount: number;
  submittedCount: number;
  approvedCount: number;
}

// Composants réutilisables
const LoadingSpinner = ({
  message = "Chargement...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <div className="relative">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <div className="absolute inset-0 animate-ping bg-blue-600/20 rounded-full"></div>
    </div>
    <p className="text-sm text-gray-600 animate-pulse">{message}</p>
  </div>
);

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
    className={`border-0 shadow-lg bg-gradient-to-br ${gradient} dark:${darkGradient} overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] duration-200`}
  >
    <CardContent className="p-6 relative">
      <div className="absolute top-4 right-4 opacity-20 dark:opacity-10">
        <Icon className="h-12 w-12" />
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {label}
            </p>
          </div>
        </div>
        {trend && (
          <div
            className={`p-1 rounded-full ${
              trend === "up"
                ? "bg-green-100 dark:bg-green-900/50"
                : trend === "down"
                ? "bg-red-100 dark:bg-red-900/50"
                : "bg-gray-100 dark:bg-gray-900/50"
            }`}
          >
            <TrendingUp
              className={`h-4 w-4 ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400 rotate-0"
                  : trend === "down"
                  ? "text-red-600 dark:text-red-400 rotate-180"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Badge de statut amélioré
const StatusBadge = ({
  status,
  showIcon = true,
}: {
  status: GradeStatus;
  showIcon?: boolean;
}) => {
  const statusConfig = {
    [GradeStatus.DRAFT]: {
      label: "Brouillon",
      className:
        "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700",
      icon: FileClock,
      iconColor: "text-gray-600 dark:text-gray-400",
    },
    [GradeStatus.SUBMITTED]: {
      label: "Soumis",
      className:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      icon: SendHorizonal,
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    [GradeStatus.APPROVED]: {
      label: "Approuvé",
      className:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700",
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
    },
    [GradeStatus.PUBLISHED]: {
      label: "Publié",
      className:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
      icon: Globe,
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    [GradeStatus.REJECTED]: {
      label: "Rejeté",
      className:
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
      icon: XCircle,
      iconColor: "text-red-600 dark:text-red-400",
    },
    [GradeStatus.ARCHIVED]: {
      label: "Archivé",
      className:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
      icon: Archive,
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  };

  const config = statusConfig[status] || statusConfig[GradeStatus.DRAFT];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1.5 ${config.className}`}>
      {showIcon && <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />}
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

// Composant de saisie de note inline avec workflow DRAFT/SUBMITTED
const GradeInputInline = ({
  student,
  subject,
  existingGrade,
  onSave,
  onDelete,
  onStatusChange,
  isLoading = false,
  controlType,
  isSubmitting = false,
}: {
  student: Student;
  subject: Subject;
  existingGrade?: Grade;
  onSave: (gradeData: {
    grade: number;
    status: GradeStatus;
    controlType: ControlType;
    notes?: string;
  }) => Promise<void>;
  onDelete?: (gradeId: string) => Promise<void>;
  onStatusChange?: (gradeId: string, newStatus: GradeStatus) => Promise<void>;
  isLoading?: boolean;
  controlType: ControlType;
  isSubmitting?: boolean;
}) => {
  const [grade, setGrade] = useState(existingGrade?.grade?.toString() || "");
  const [notes, setNotes] = useState(existingGrade?.notes || "");
  const [currentControlType, setCurrentControlType] = useState<ControlType>(
    (existingGrade?.controlType as ControlType) || controlType
  );
  const [currentStatus, setCurrentStatus] = useState<GradeStatus>(
    existingGrade?.status || GradeStatus.DRAFT
  );
  const [errors, setErrors] = useState<{ grade?: string }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { user } = useAuthStore();
  const { notifyAdminAboutSubmittedGrade } = useGradeStore();

  const isRejected = currentStatus === GradeStatus.REJECTED;

  // Calcul du statut basé sur le pourcentage de la note max
  const calculateStatus = (gradeValue: number): GradeStatus => {
    if (isRejected) {
      return GradeStatus.DRAFT;
    }
    const percentage = (gradeValue / subject.maxGrade) * 100;
    const passingPercentage = subject.passingGrade;

    if (percentage >= passingPercentage) return GradeStatus.APPROVED;
    if (percentage >= passingPercentage * 0.7) return GradeStatus.SUBMITTED;
    return GradeStatus.DRAFT;
  };

  useEffect(() => {
    if (existingGrade) {
      setGrade(existingGrade.grade.toString());
      setNotes(existingGrade.notes || "");
      setCurrentControlType(existingGrade.controlType as ControlType);
      setCurrentStatus(existingGrade.status);
    } else {
      setGrade("");
      setNotes("");
      setCurrentControlType(controlType);
      setCurrentStatus(GradeStatus.DRAFT);
    }
    setErrors({});
  }, [existingGrade, controlType]);

  const validateGrade = (value: string): string | null => {
    if (value.trim() === "") return null;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "La note doit être un nombre valide";
    if (numericValue < 0) return "La note ne peut pas être négative";
    if (numericValue > subject.maxGrade)
      return `La note ne peut pas dépasser ${subject.maxGrade}`;
    return null;
  };

  const handleGradeChange = (value: string) => {
    setGrade(value);
    const error = validateGrade(value);
    setErrors((prev) => ({ ...prev, grade: error || undefined }));

    // Si c'est une nouvelle note ou draft, calculer le statut automatiquement
    if (!existingGrade || currentStatus === GradeStatus.DRAFT) {
      if (value.trim() !== "" && !error) {
        const numericGrade = parseFloat(value);
        const newStatus = calculateStatus(numericGrade);
        setCurrentStatus(newStatus);
      }
    }
  };

  const handleSave = async (statusOverride?: GradeStatus) => {
    const gradeError = validateGrade(grade);
    if (gradeError) {
      setErrors({ grade: gradeError });
      toast.error(gradeError);
      return;
    }

    if (grade.trim() === "") {
      toast.error("Veuillez entrer une note");
      return;
    }

    const numericGrade = parseFloat(grade);
    const finalStatus = statusOverride || currentStatus;

    setLocalLoading(true);
    try {
      await onSave({
        grade: numericGrade,
        status: finalStatus,
        controlType: currentControlType,
        notes: notes.trim(),
      });
      notifyAdminAboutSubmittedGrade({
        studentName: `${student.firstName} ${student.lastName}`,
        subjectName: subject.name,
        gradeValue: numericGrade,
        controlType: controlType,
        teacherId: user?.id || "",
        teacherName: `${user?.firstName} ${user?.lastName}`,
        studentId: student.id,
        subjectId: subject.id,
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (currentStatus === GradeStatus.DRAFT) {
      setCurrentStatus(GradeStatus.SUBMITTED);
      await handleSave(GradeStatus.SUBMITTED);
    }
  };

  const handleSaveAsDraft = async () => {
    await handleSave(GradeStatus.DRAFT);
  };

  const getGradeOn20 = (gradeValue: string): string => {
    if (!gradeValue.trim() || isNaN(parseFloat(gradeValue))) return "0.0";
    const numericGrade = parseFloat(gradeValue);
    return ((numericGrade / subject.maxGrade) * 20).toFixed(1);
  };

  const getStatusColor = (status: GradeStatus) => {
    switch (status) {
      case GradeStatus.DRAFT:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900";
      case GradeStatus.SUBMITTED:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case GradeStatus.APPROVED:
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case GradeStatus.PUBLISHED:
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/30";
      case GradeStatus.REJECTED:
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const isReadOnly =
    existingGrade &&
    (existingGrade.status === GradeStatus.APPROVED ||
      existingGrade.status === GradeStatus.PUBLISHED);

  return (
    <div
      className={`p-4 md:p-6 border rounded-xl transition-all duration-200 ${
        isReadOnly
          ? "bg-gray-50/50 dark:bg-gray-900/30"
          : "bg-white dark:bg-gray-800"
      } ${
        currentStatus === GradeStatus.DRAFT
          ? "border-gray-300 dark:border-gray-700"
          : currentStatus === GradeStatus.SUBMITTED
          ? "border-blue-300 dark:border-blue-700"
          : currentStatus === GradeStatus.APPROVED
          ? "border-green-300 dark:border-green-700"
          : "border-gray-300 dark:border-gray-700"
      }`}
    >
      {/* Header - Informations étudiant et état de la note */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* Informations étudiant */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                currentStatus === GradeStatus.DRAFT
                  ? "bg-gray-100 dark:bg-gray-800"
                  : currentStatus === GradeStatus.SUBMITTED
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : currentStatus === GradeStatus.APPROVED
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <User
                className={`h-5 w-5 ${
                  currentStatus === GradeStatus.DRAFT
                    ? "text-gray-600 dark:text-gray-400"
                    : currentStatus === GradeStatus.SUBMITTED
                    ? "text-blue-600 dark:text-blue-400"
                    : currentStatus === GradeStatus.APPROVED
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {student.firstName} {student.lastName}
                </p>
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {student.studentCode}
                </Badge>
                {student.schoolClass && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                  >
                    {student.schoolClass.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={currentStatus} />
                {existingGrade?.createdAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(existingGrade.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* motif du rejet */}
          {isRejected && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Cette note a été rejetée par l'administrateur
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Vous pouvez modifier la note et la soumettre à nouveau pour
                    validation.
                  </p>
                  {existingGrade?.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-100/50 dark:bg-red-900/10 rounded">
                      <p className="text-xs font-medium text-red-700 dark:text-red-300">
                        Motif du rejet :
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {existingGrade.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={localLoading || isLoading || grade.trim() === ""}
                className="h-9 border-gray-300 dark:border-gray-600"
              >
                {localLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Brouillon
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={handleSubmitForApproval}
                disabled={localLoading || isLoading || grade.trim() === ""}
                className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {localLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Soumettre
                  </>
                )}
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 w-9 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Zone de saisie détaillée (expandable) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Grille de saisie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Informations matière */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Détails matière
              </Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Coefficient
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {subject.coefficient}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Note maximale
                  </span>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    {subject.maxGrade}/100
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Seuil validation
                  </span>
                  <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                    {subject.passingGrade}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Saisie de note */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Saisie de la note
              </Label>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max={subject.maxGrade}
                    step="0.1"
                    placeholder={`Note entre 0 et ${subject.maxGrade}`}
                    value={grade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className={`h-11 ${
                      errors.grade
                        ? "border-destructive"
                        : "border-gray-300 dark:border-gray-600"
                    } ${
                      isReadOnly
                        ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isReadOnly || localLoading || isLoading}
                  />
                  {errors.grade && (
                    <p className="absolute -bottom-5 left-0 text-xs text-destructive">
                      {errors.grade}
                    </p>
                  )}
                </div>

                {/* Note sur 20 calculée */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Note sur 20</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {getGradeOn20(grade)}
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        /20
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Type de contrôle et statut */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Configuration
              </Label>
              <div className="space-y-3">
                <Select
                  value={currentControlType}
                  onValueChange={(value: ControlType) =>
                    setCurrentControlType(value)
                  }
                  disabled={isReadOnly || localLoading || isLoading}
                >
                  <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600">
                    <SelectValue />
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

                {/* Indicateur de statut */}
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut actuel</span>
                    <StatusBadge status={currentStatus} showIcon={true} />
                  </div>

                  {!isReadOnly && currentStatus !== GradeStatus.DRAFT && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-8 text-xs"
                        onClick={() => setCurrentStatus(GradeStatus.DRAFT)}
                      >
                        <FileClock className="h-3 w-3 mr-1" />
                        Revenir en brouillon
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes/remarques */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Remarques (optionnel)
            </Label>
            <Textarea
              placeholder="Ajoutez des commentaires ou des remarques sur cette note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none border-gray-300 dark:border-gray-600"
              disabled={isReadOnly || localLoading || isLoading}
            />
          </div>

          {/* Actions détaillées */}
          {!isReadOnly && (
            <div className="flex items-center gap-2 pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex-1">
                {currentStatus === GradeStatus.DRAFT && (
                  <span className="flex items-center gap-1">
                    <FileClock className="h-3 w-3" />
                    La note est enregistrée localement en brouillon
                  </span>
                )}
                {currentStatus === GradeStatus.SUBMITTED && (
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <SendHorizonal className="h-3 w-3" />
                    La note sera soumise à l'administrateur pour validation
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {existingGrade && onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={async () => {
                      if (
                        existingGrade &&
                        window.confirm("Supprimer cette note ?")
                      ) {
                        await onDelete(existingGrade.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => handleSave()}
                  disabled={localLoading || isLoading || grade.trim() === ""}
                  className="h-9 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {localLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <SaveAll className="h-4 w-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour les contrôles en masse
const BulkActions = ({
  selectedStudents,
  selectedSubject,
  onApplyGrade,
  onSubmitForApproval,
  onSaveAsDraft,
}: {
  selectedStudents: Student[];
  selectedSubject: Subject | null;
  onApplyGrade: (grade: string) => void;
  onSubmitForApproval: () => void;
  onSaveAsDraft: () => void;
}) => {
  const [bulkGrade, setBulkGrade] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyGrade = async () => {
    if (!bulkGrade.trim() || !selectedSubject) return;

    setIsApplying(true);
    try {
      onApplyGrade(bulkGrade);
      setBulkGrade("");
    } finally {
      setIsApplying(false);
    }
  };

  if (selectedStudents.length === 0) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">
              Actions en masse
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {selectedStudents.length} étudiant(s) sélectionné(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max={selectedSubject?.maxGrade || 100}
              step="0.1"
              placeholder={`Note (max: ${selectedSubject?.maxGrade || 100})`}
              value={bulkGrade}
              onChange={(e) => setBulkGrade(e.target.value)}
              className="w-32 h-9 border-blue-300 dark:border-blue-700"
              disabled={isApplying}
            />
            <Button
              onClick={handleApplyGrade}
              disabled={!bulkGrade.trim() || isApplying}
              size="sm"
              className="h-9 bg-blue-600 hover:bg-blue-700"
            >
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Appliquer"
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onSaveAsDraft}
              variant="outline"
              size="sm"
              className="h-9 border-gray-300 dark:border-gray-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Tous en brouillon
            </Button>
            <Button
              onClick={onSubmitForApproval}
              size="sm"
              className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <SendHorizonal className="h-4 w-4 mr-2" />
              Tout soumettre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
export const ProfessorGradeManager = ({
  professorId,
}: ProfessorGradeManagerProps) => {
  const { user } = useAuthStore();
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const {
    grades,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    submitGradesForApproval,
  } = useGradeStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { classes, fetchClasses } = useClassStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  // ID du professeur (soit depuis props, soit depuis l'auth)
  const currentProfessorId = user?.professeur?.id;

  // États
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filtres
  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    subjectId: "",
    controlType: "CONTROLE_1" as ControlType,
    statusFilter: "all" as "all" | GradeStatus,
  });

  // États pour la confirmation de suppression
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

  // Données sélectionnées
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Chargement initial des données

  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentProfessorId) return;

      setLoading(true);
      setError(null);

      try {
        // Charger toutes les données de manière séquentielle
        await fetchAcademicYears();
        await fetchAssignments();
        await fetchClasses();
        await fetchSubjects();
        await fetchStudents();

        // Trouver l'année académique en cours
        const currentYear = academicYears.find((ay) => ay.isCurrent);
        if (currentYear) {
          setFilters((prev) => ({ ...prev, academicYearId: currentYear.id }));
          setSelectedAcademicYear(currentYear);
        }

        toast.success("Données chargées avec succès");
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setError("Impossible de charger les données");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    currentProfessorId,
    fetchAcademicYears,
    fetchAssignments,
    fetchClasses,
    fetchSubjects,
    fetchStudents,
    academicYears,
  ]);

  // Obtenir les affectations du professeur pour l'année sélectionnée
  const professorAssignments = useMemo(() => {
    if (!currentProfessorId || !filters.academicYearId) return [];

    return assignments.filter((assignment) => {
      return (
        assignment.professeur?.id === currentProfessorId &&
        assignment.academicYear?.id === filters.academicYearId
      );
    });
  }, [assignments, currentProfessorId, filters.academicYearId]);

  // Obtenir les classes où le professeur enseigne
  const professorClasses = useMemo(() => {
    if (!filters.academicYearId || professorAssignments.length === 0) {
      return [];
    }

    // Récupérer tous les classLevel uniques des assignments
    const assignedClassLevels = professorAssignments
      .map((assignment) => assignment.classLevel)
      .filter((level, index, self) => level && self.indexOf(level) === index);

    // Récupérer les classes qui correspondent à ces classLevels
    return classes.filter((cls) => assignedClassLevels.includes(cls.level));
  }, [professorAssignments, classes, filters.academicYearId]);

  // Fonction utilitaire pour obtenir le niveau d'une classe
  const getClassLevelFromClass = useCallback(
    (classId: string): string | null => {
      const cls = classes.find((c) => c.id === classId);
      return cls?.level || null;
    },
    [classes]
  );

  // Matières du professeur pour la classe sélectionnée
  const professorSubjects = useMemo(() => {
    if (!filters.academicYearId || !filters.classId) return [];

    const classLevel = getClassLevelFromClass(filters.classId);
    if (!classLevel) return [];

    const assignmentsForClass = professorAssignments.filter(
      (assignment) => assignment.classLevel === classLevel
    );

    // Récupérer les matières de ces assignments
    const subjectIds = assignmentsForClass
      .map((assignment) => assignment.subject.id)
      .filter((id, index, self) => id && self.indexOf(id) === index);

    return subjects
      .filter((subject) => subjectIds.includes(subject.id))
      .map((subject) => {
        const assignment = assignmentsForClass.find(
          (a) => a.subject.id === subject.id
        );
        return {
          ...subject,
          assignmentId: assignment?.id,
          assignmentData: assignment,
        };
      });
  }, [
    professorAssignments,
    subjects,
    filters.academicYearId,
    filters.classId,
    getClassLevelFromClass,
  ]);

  // Obtenir les étudiants de la classe sélectionnée
  const classStudents = useMemo(() => {
    if (!filters.classId) return [];

    return students.filter(
      (student) =>
        student.status === "Active" &&
        student.schoolClass?.id === filters.classId
    );
  }, [students, filters.classId]);

  // Charger les notes quand les filtres changent
  useEffect(() => {
    const loadGrades = async () => {
      if (!filters.academicYearId || !filters.classId || !filters.subjectId)
        return;

      try {
        await fetchGrades({
          academicYearId: filters.academicYearId,
          subjectId: filters.subjectId,
          controlType: filters.controlType || undefined,
        });
      } catch (error) {
        console.error("Erreur chargement notes:", error);
        toast.error("Erreur lors du chargement des notes");
      }
    };

    loadGrades();
  }, [filters, fetchGrades]);

  // Gérer le changement de filtre
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };

        // Réinitialiser les dépendances
        if (key === "academicYearId") {
          newFilters.classId = "";
          newFilters.subjectId = "";
          setSelectedClass(null);
          setSelectedSubject(null);
          setSelectedStudents([]);

          const year = academicYears.find((ay) => ay.id === value);
          setSelectedAcademicYear(year || null);
        }

        if (key === "classId") {
          newFilters.subjectId = "";
          setSelectedSubject(null);
          setSelectedStudents([]);

          const cls = classes.find((c) => c.id === value);
          setSelectedClass((cls as unknown as SchoolClass) || null);
        }

        if (key === "subjectId") {
          setSelectedStudents([]);
          const subject = subjects.find((s) => s.id === value);
          setSelectedSubject(subject || null);
        }

        return newFilters;
      });
    },
    [academicYears, classes, subjects]
  );

  // Obtenir les notes existantes filtrées
  const existingGrades = useMemo(() => {
    if (!filters.academicYearId || !filters.classId || !filters.subjectId)
      return [];

    let filteredGrades = (grades as unknown as Grade[]).filter(
      (grade) =>
        grade.subjectId === filters.subjectId &&
        grade.academicYearId === filters.academicYearId &&
        (!filters.controlType || grade.controlType === filters.controlType)
    );

    // Filtrer par statut si nécessaire
    if (filters.statusFilter !== "all") {
      filteredGrades = filteredGrades.filter(
        (grade) => grade.status === filters.statusFilter
      );
    }

    return filteredGrades;
  }, [grades, filters]);

  // Obtenir les étudiants sans note pour la matière sélectionnée
  const studentsWithoutGrade = useMemo(() => {
    const studentsWithGrade = new Set(existingGrades.map((g) => g.studentId));
    return classStudents.filter(
      (student) => !studentsWithGrade.has(student.id)
    );
  }, [classStudents, existingGrades]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    if (existingGrades.length === 0 || !selectedSubject) return null;

    const total = existingGrades.length;
    const average = existingGrades.reduce((sum, g) => sum + g.grade, 0) / total;

    // Utiliser le passingGrade comme pourcentage
    const passed = existingGrades.filter((g) => {
      const percentage = (g.grade / selectedSubject.maxGrade) * 100;
      return percentage >= selectedSubject.passingGrade;
    }).length;

    const successRate = total > 0 ? (passed / total) * 100 : 0;

    // Compter par statut
    const draftCount = existingGrades.filter(
      (g) => g.status === GradeStatus.DRAFT
    ).length;
    const submittedCount = existingGrades.filter(
      (g) => g.status === GradeStatus.SUBMITTED
    ).length;
    const approvedCount = existingGrades.filter(
      (g) => g.status === GradeStatus.APPROVED
    ).length;

    // Trouver les meilleures et pires notes
    const sortedGrades = [...existingGrades].sort((a, b) => b.grade - a.grade);
    const bestGrade = sortedGrades[0];
    const worstGrade = sortedGrades[sortedGrades.length - 1];

    return {
      totalGrades: total,
      averageGrade: parseFloat(average.toFixed(1)),
      averageOn20: parseFloat(
        ((average / selectedSubject.maxGrade) * 20).toFixed(1)
      ),
      successRate: parseFloat(successRate.toFixed(1)),
      passedGrades: passed,
      failedGrades: total - passed,
      bestGrade: bestGrade?.grade || 0,
      worstGrade: worstGrade?.grade || 0,
      completionRate:
        classStudents.length > 0
          ? parseFloat(((total / classStudents.length) * 100).toFixed(1))
          : 0,
      draftCount,
      submittedCount,
      approvedCount,
    };
  }, [existingGrades, selectedSubject, classStudents]);

  // Obtenir l'assignation pour la matière sélectionnée
  const getAssignmentForSelectedSubject = useCallback(() => {
    if (!filters.classId || !filters.subjectId || !professorAssignments)
      return null;

    const classLevel = getClassLevelFromClass(filters.classId);
    if (!classLevel) return null;

    return professorAssignments.find(
      (assignment) =>
        assignment.subject.id === filters.subjectId &&
        assignment.classLevel === classLevel
    );
  }, [
    filters.classId,
    filters.subjectId,
    professorAssignments,
    getClassLevelFromClass,
  ]);

  // Sauvegarder une note
  const handleSaveGrade = async (
    studentId: string,
    subjectId: string,
    gradeData: {
      grade: number;
      status: GradeStatus;
      controlType: ControlType;
      notes?: string;
    }
  ) => {
    if (!selectedSubject || !selectedAcademicYear || !selectedClass) {
      toast.error("Données manquantes");
      return;
    }

    // Validation de la note
    if (gradeData.grade < 0 || gradeData.grade > selectedSubject.maxGrade) {
      toast.error(`La note doit être entre 0 et ${selectedSubject.maxGrade}`);
      return;
    }

    setIsSaving(true);
    try {
      // Trouver l'assignation
      const assignment = getAssignmentForSelectedSubject();

      if (!assignment) {
        toast.error(
          "Affectation non trouvée pour cette matière et cette classe"
        );
        return;
      }

      // Vérifier si une note existe déjà
      const existingGrade = existingGrades.find(
        (g) =>
          g.studentId === studentId && g.controlType === gradeData.controlType
      );

      const gradeToSend = {
        studentId,
        subjectId,
        assignmentId: assignment.id,
        grade: gradeData.grade,
        status: gradeData.status,
        session: "Normale" as any,
        controlType: gradeData.controlType,
        academicYearId: selectedAcademicYear.id,
        classLevel: selectedClass.level as ClassLevel,
        isActive: true,
        notes: gradeData.notes || "",
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, {
          grade: gradeData.grade,
          status: gradeData.status,
          controlType: gradeData.controlType,
          notes: gradeData.notes,
        });

        const statusMessages = {
          [GradeStatus.DRAFT]: "Note enregistrée en brouillon",
          [GradeStatus.SUBMITTED]: "Note soumise pour validation",
          [GradeStatus.APPROVED]: "Note approuvée",
          [GradeStatus.PUBLISHED]: "Note publiée",
        };

        toast.success(statusMessages[gradeData.status] || "Note mise à jour");
      } else {
        await createGrade(gradeToSend as any);

        const statusMessages = {
          [GradeStatus.DRAFT]: "Note ajoutée en brouillon",
          [GradeStatus.SUBMITTED]: "Note ajoutée et soumise pour validation",
        };

        toast.success(statusMessages[gradeData.status] || "Note ajoutée");
      }

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType as ControlType | undefined,
      });
    } catch (error: any) {
      console.error(" Erreur sauvegarde note:", error);

      // Messages d'erreur plus précis
      if (error.response?.status === 400) {
        toast.error("Données invalides. Vérifiez les valeurs saisies.");
      } else if (error.response?.status === 404) {
        toast.error("Ressource non trouvée. Actualisez la page.");
      } else if (error.response?.status === 409) {
        toast.error("Une note existe déjà pour cet étudiant et ce contrôle.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la sauvegarde de la note"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour ouvrir la confirmation de suppression
  const handleDeleteGradeWithConfirmation = (
    gradeId: string,
    student: Student,
    grade: Grade
  ) => {
    setDeletionConfirmation({
      isOpen: true,
      gradeId,
      studentName: `${student.firstName} ${student.lastName}`,
      gradeValue: `${grade.grade}/${
        grade.subject?.maxGrade || selectedSubject?.maxGrade || 100
      }`,
      subjectName: selectedSubject?.name || "Matière inconnue",
    });
  };

  // Fonction de confirmation de suppression
  const confirmDelete = async () => {
    if (!deletionConfirmation.gradeId) return;

    setIsSaving(true);
    try {
      await deleteGrade(deletionConfirmation.gradeId);
      toast.success("Note supprimée avec succès");

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType as ControlType | undefined,
      });
    } catch (error) {
      console.error("Erreur suppression note:", error);
      toast.error("Erreur lors de la suppression de la note");
    } finally {
      setIsSaving(false);
      setDeletionConfirmation({
        isOpen: false,
        gradeId: null,
        studentName: "",
        gradeValue: "",
        subjectName: "",
      });
    }
  };

  // Exporter les notes en Excel
  const handleExportExcel = () => {
    try {
      if (!selectedSubject || existingGrades.length === 0) {
        toast.error("Aucune note à exporter");
        return;
      }

      const dataToExport = existingGrades.map((grade) => {
        const student = students.find((s) => s.id === grade.studentId);

        // Calculer la note sur 20
        const gradeOn20 = (
          (grade.grade / selectedSubject.maxGrade) *
          20
        ).toFixed(2);
        const weightedPoints = (
          (grade.grade / 100) *
          20 *
          selectedSubject.coefficient
        ).toFixed(2);

        return {
          Matricule: student?.studentCode || "N/A",
          "Nom et Prénom": `${student?.lastName} ${student?.firstName}`,
          Classe: selectedClass?.name || "N/A",
          Matière: selectedSubject.name,
          "Note /100": grade.grade,
          "Note /20": gradeOn20,
          Coefficient: selectedSubject.coefficient,
          "Points pondérés": weightedPoints,
          Statut: grade.status,
          "Type contrôle": grade.controlType,
          "Date saisie": new Date(grade.createdAt).toLocaleDateString(),
          Remarques: grade.notes || "",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `notes-${selectedSubject.code}-${selectedClass?.name}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      saveAs(blob, fileName);

      toast.success("Export Excel réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export Excel");
    }
  };

  // Filtrer les étudiants par terme de recherche
  const filteredStudents = useMemo(() => {
    // Combiner étudiants avec et sans notes
    const allStudents = [...classStudents];

    if (!searchTerm) return allStudents;

    return allStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  // Gestion de la sélection en masse
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === classStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(classStudents.map((s) => s.id));
    }
  };

  // Appliquer une note en masse
  const handleApplyBulkGrade = async (gradeValue: string) => {
    if (!selectedSubject || selectedStudents.length === 0) {
      toast.error("Veuillez sélectionner des étudiants");
      return;
    }

    const numericGrade = parseFloat(gradeValue);
    if (
      isNaN(numericGrade) ||
      numericGrade < 0 ||
      numericGrade > selectedSubject.maxGrade
    ) {
      toast.error(`La note doit être entre 0 et ${selectedSubject.maxGrade}`);
      return;
    }

    setIsSaving(true);
    try {
      // Pour chaque étudiant sélectionné, créer/sauvegarder la note
      const assignment = getAssignmentForSelectedSubject();
      if (!assignment) {
        toast.error("Affectation non trouvée");
        return;
      }

      // Calculer le statut basé sur la note
      const percentage = (numericGrade / selectedSubject.maxGrade) * 100;
      const status =
        percentage >= selectedSubject.passingGrade
          ? GradeStatus.SUBMITTED
          : GradeStatus.DRAFT;

      for (const studentId of selectedStudents) {
        const existingGrade = existingGrades.find(
          (g) =>
            g.studentId === studentId && g.controlType === filters.controlType
        );

        const gradeData = {
          studentId,
          subjectId: selectedSubject.id,
          assignmentId: assignment.id,
          grade: numericGrade,
          status,
          session: "Normale" as any,
          controlType: filters.controlType,
          academicYearId: selectedAcademicYear?.id || "",
          classLevel:
            (selectedClass?.level as ClassLevel) || ("Seconde" as ClassLevel),
          isActive: true,
        };

        if (existingGrade) {
          await updateGrade(existingGrade.id, {
            grade: numericGrade,
            status,
            controlType: filters.controlType,
          });
        } else {
          await createGrade(gradeData as any);
        }
      }

      toast.success(`${selectedStudents.length} notes appliquées`);

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType || undefined,
      });

      // Réinitialiser la sélection
      setSelectedStudents([]);
    } catch (error) {
      console.error("Erreur application en masse:", error);
      toast.error("Erreur lors de l'application des notes en masse");
    } finally {
      setIsSaving(false);
    }
  };

  // Soumettre des notes en masse pour validation
  const handleSubmitBulkForApproval = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Veuillez sélectionner des étudiants");
      return;
    }

    const gradeIds = existingGrades
      .filter(
        (grade) =>
          selectedStudents.includes(grade.studentId) &&
          grade.status === GradeStatus.DRAFT
      )
      .map((grade) => grade.id);

    if (gradeIds.length === 0) {
      toast.error("Aucune note en brouillon à soumettre");
      return;
    }

    setIsSaving(true);
    try {
      await submitGradesForApproval({
        gradeIds,
        submitAll: false,
      });

      toast.success(`${gradeIds.length} notes soumises pour validation`);
      setSelectedStudents([]);

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType as ControlType | undefined,
      });
    } catch (error) {
      console.error("Erreur soumission en masse:", error);
      toast.error("Erreur lors de la soumission des notes");
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder en masse en tant que brouillon
  const handleSaveBulkAsDraft = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Veuillez sélectionner des étudiants");
      return;
    }

    // Pour cet exemple, on va juste changer le statut des notes existantes
    const gradeIds = existingGrades
      .filter((grade) => selectedStudents.includes(grade.studentId))
      .map((grade) => grade.id);

    if (gradeIds.length === 0) {
      toast.error("Aucune note à mettre en brouillon");
      return;
    }

    setIsSaving(true);
    try {
      // Ici, vous devriez appeler une API pour mettre à jour le statut
      // Pour l'exemple, on utilise updateGrade
      for (const gradeId of gradeIds) {
        const grade = existingGrades.find((g) => g.id === gradeId);
        if (grade && grade.status !== GradeStatus.DRAFT) {
          await updateGrade(gradeId, {
            grade: grade.grade,
            status: GradeStatus.DRAFT,
            controlType: grade.controlType as ControlType,
            notes: grade.notes,
          });
        }
      }

      toast.success(`${gradeIds.length} notes mises en brouillon`);

      // Recharger les notes
      await fetchGrades({
        academicYearId: filters.academicYearId,
        subjectId: filters.subjectId,
        controlType: filters.controlType as ControlType | undefined,
      });
    } catch (error) {
      console.error("Erreur sauvegarde brouillon en masse:", error);
      toast.error("Erreur lors de la mise en brouillon");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de vos données..." />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Saisie des Notes
              </h1>
              <p className="text-muted-foreground">
                {user?.firstName} {user?.lastName} • Professeur
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              <User className="h-3 w-3 mr-1" />
              Mode Professeur
            </Badge>
            <Badge variant="outline" className="text-xs">
              <SendHorizonal className="h-3 w-3 mr-1" />
              Workflow de validation
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setBulkEditMode(!bulkEditMode)}
            variant="outline"
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
          >
            {bulkEditMode ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Quitter édition en masse
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Édition en masse
              </>
            )}
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
            disabled={!selectedSubject || existingGrades.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Filtres de saisie
              </CardTitle>
            </div>
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
                value={filters.academicYearId}
                onValueChange={(value) =>
                  handleFilterChange("academicYearId", value)
                }
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

            {/* Classe */}
            <div className="space-y-2">
              <Label htmlFor="class" className="text-sm font-medium">
                Classe
              </Label>
              <Select
                value={filters.classId}
                onValueChange={(value) => handleFilterChange("classId", value)}
                disabled={
                  !filters.academicYearId || professorClasses.length === 0
                }
              >
                <SelectTrigger
                  id="class"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      !filters.academicYearId
                        ? "Sélectionnez d'abord une année"
                        : professorClasses.length === 0
                        ? "Aucune classe assignée"
                        : "Sélectionner une classe"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {professorClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Matière
              </Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) =>
                  handleFilterChange("subjectId", value)
                }
                disabled={!filters.classId || professorSubjects.length === 0}
              >
                <SelectTrigger
                  id="subject"
                  className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <SelectValue
                    placeholder={
                      !filters.classId
                        ? "Sélectionnez d'abord une classe"
                        : professorSubjects.length === 0
                        ? "Aucune matière assignée"
                        : "Sélectionner une matière"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {professorSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de contrôle et Filtre statut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="controlType" className="text-sm font-medium">
                  Type contrôle
                </Label>
                <Select
                  value={filters.controlType}
                  onValueChange={(value) =>
                    handleFilterChange("controlType", value)
                  }
                  disabled={!filters.subjectId}
                >
                  <SelectTrigger
                    id="controlType"
                    className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <SelectValue placeholder="Type contrôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTROLE_1">Contrôle 1</SelectItem>
                    <SelectItem value="CONTROLE_2">Contrôle 2</SelectItem>
                    <SelectItem value="CONTROLE_3">Contrôle 3</SelectItem>
                    <SelectItem value="CONTROLE_4">Contrôle 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusFilter" className="text-sm font-medium">
                  Filtre statut
                </Label>
                <Select
                  value={filters.statusFilter}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      statusFilter: value as any,
                    }))
                  }
                >
                  <SelectTrigger
                    id="statusFilter"
                    className="h-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value={GradeStatus.DRAFT}>Brouillon</SelectItem>
                    <SelectItem value={GradeStatus.SUBMITTED}>
                      Soumis
                    </SelectItem>
                    <SelectItem value={GradeStatus.APPROVED}>
                      Approuvé
                    </SelectItem>
                    <SelectItem value={GradeStatus.REJECTED}>Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          {filters.subjectId && (
            <div className="mt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un étudiant..."
                    className="pl-9 h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  {bulkEditMode && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllStudents}
                        className="h-9"
                      >
                        {selectedStudents.length === classStudents.length ? (
                          <>
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Tout désélectionner
                          </>
                        ) : (
                          <>
                            <Square className="h-4 w-4 mr-2" />
                            Tout sélectionner
                          </>
                        )}
                      </Button>
                      <Badge variant="secondary">
                        {selectedStudents.length} sélectionné(s)
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions en masse */}
      {bulkEditMode && selectedSubject && (
        <BulkActions
          selectedStudents={classStudents.filter((s) =>
            selectedStudents.includes(s.id)
          )}
          selectedSubject={selectedSubject}
          onApplyGrade={handleApplyBulkGrade}
          onSubmitForApproval={handleSubmitBulkForApproval}
          onSaveAsDraft={handleSaveBulkAsDraft}
        />
      )}

      {/* Workflow d'information */}
      {selectedSubject && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <SendHorizonal className="h-5 w-5" />
              Workflow de validation des notes
            </h3>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              3 étapes
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-gray-400">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <FileClock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="font-semibold">1. Brouillon</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enregistrez localement sans soumission. Vous pouvez modifier à
                tout moment.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <SendHorizonal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">2. Soumission</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Soumettez à l'administrateur pour validation. Vous ne pouvez
                plus modifier.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold">3. Validation</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                L'administrateur valide et publie les notes aux étudiants.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {selectedSubject && statistics && (
        <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
          <StatCard
            icon={Calendar}
            value={selectedAcademicYear?.year || "N/A"}
            label="Année académique"
            gradient="from-blue-100 to-blue-200"
            darkGradient="from-blue-900/50 to-blue-800/50"
          />
          <StatCard
            icon={Users}
            value={classStudents.length}
            label="Étudiants"
            gradient="from-green-100 to-green-200"
            iconBg="bg-green-600"
            darkGradient="from-green-900/50 to-green-800/50"
          />
          <StatCard
            icon={FileText}
            value={`${statistics.totalGrades}/${classStudents.length}`}
            label="Notes saisies"
            gradient="from-purple-100 to-purple-200"
            iconBg="bg-purple-600"
            darkGradient="from-purple-900/50 to-purple-800/50"
            trend={statistics.completionRate > 50 ? "up" : "down"}
          />
          <StatCard
            icon={BarChart3}
            value={statistics.averageOn20}
            label="Moyenne /20"
            gradient="from-amber-100 to-amber-200"
            iconBg="bg-amber-600"
            darkGradient="from-amber-900/50 to-amber-800/50"
          />
          <StatCard
            icon={FileClock}
            value={statistics.draftCount}
            label="Brouillons"
            gradient="from-gray-100 to-gray-200"
            iconBg="bg-gray-600"
            darkGradient="from-gray-900/50 to-gray-800/50"
          />
          <StatCard
            icon={SendHorizonal}
            value={statistics.submittedCount}
            label="Soumis"
            gradient="from-blue-100 to-cyan-200"
            iconBg="bg-cyan-600"
            darkGradient="from-cyan-900/50 to-cyan-800/50"
          />
          <StatCard
            icon={CheckCircle}
            value={statistics.approvedCount}
            label="Approuvés"
            gradient="from-green-100 to-emerald-200"
            iconBg="bg-emerald-600"
            darkGradient="from-emerald-900/50 to-emerald-800/50"
          />
          <StatCard
            icon={Percent}
            value={`${statistics.successRate}%`}
            label="Taux réussite"
            gradient="from-indigo-100 to-indigo-200"
            iconBg="bg-indigo-600"
            darkGradient="from-indigo-900/50 to-indigo-800/50"
            trend={statistics.successRate > 50 ? "up" : "down"}
          />
        </div>
      )}

      {/* Informations sur la sélection */}
      {selectedClass && selectedSubject && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <Badge className="text-sm bg-white/20 text-white border-white/30">
                    {selectedClass.level}
                  </Badge>
                  <Badge className="text-sm bg-white/20 text-white border-white/30">
                    {filters.controlType}
                  </Badge>
                  <Badge className="text-sm bg-amber-500/20 text-amber-100 border-amber-400/30">
                    {selectedSubject.code}
                  </Badge>
                  <Badge className="text-sm bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                    Max: {selectedSubject.maxGrade}/100
                  </Badge>
                  <Badge className="text-sm bg-blue-500/20 text-blue-100 border-blue-400/30">
                    Seuil: {selectedSubject.passingGrade}%
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedClass.name}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-200">Année académique</p>
                    <p className="font-semibold">
                      {selectedAcademicYear?.year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Matière</p>
                    <p className="font-semibold">{selectedSubject.name}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Coefficient</p>
                    <p className="font-semibold">
                      {selectedSubject.coefficient}
                    </p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Progression</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={statistics?.completionRate || 0}
                        className="flex-1 h-2 bg-white/20"
                      />
                      <span className="font-semibold">
                        {statistics?.completionRate || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des étudiants */}
      {selectedSubject && classStudents.length > 0 ? (
        <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  {selectedSubject.name} ({selectedSubject.code})
                </CardTitle>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                    Classe: {selectedClass?.name}
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    Coef. {selectedSubject.coefficient}
                  </Badge>
                  <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                    Seuil: {selectedSubject.passingGrade}%
                  </Badge>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                    Max: {selectedSubject.maxGrade}/100
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tabs defaultValue="saisie" className="w-full">
                  <TabsList className="grid w-full md:w-auto grid-cols-2">
                    <TabsTrigger
                      value="saisie"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Saisie des notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Notes existantes ({existingGrades.length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="saisie">
              <TabsContent value="saisie" className="space-y-4 mt-0">
                {bulkEditMode && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Mode édition en masse activé
                        </p>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Sélectionnez les étudiants et utilisez les actions en
                        masse
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {filteredStudents.map((student) => {
                    const existingGrade = existingGrades.find(
                      (g) =>
                        g.studentId === student.id &&
                        g.controlType === filters.controlType
                    );

                    const handleDeleteGrade = async (gradeId: string) => {
                      if (!existingGrade) return;
                      handleDeleteGradeWithConfirmation(
                        gradeId,
                        student,
                        existingGrade
                      );
                    };

                    return (
                      <div key={student.id} className="relative">
                        {bulkEditMode && (
                          <div className="absolute left-4 top-4 z-10">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() =>
                                toggleStudentSelection(student.id)
                              }
                              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
                            />
                          </div>
                        )}

                        <div className={bulkEditMode ? "ml-10" : ""}>
                          <GradeInputInline
                            student={student}
                            subject={selectedSubject}
                            existingGrade={existingGrade}
                            onSave={(gradeData) =>
                              handleSaveGrade(
                                student.id,
                                selectedSubject.id,
                                gradeData
                              )
                            }
                            onDelete={handleDeleteGrade}
                            isLoading={isSaving}
                            controlType={filters.controlType}
                            isSubmitting={false}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-3">
                  {existingGrades.map((grade) => {
                    const student = students.find(
                      (s) => s.id === grade.studentId
                    );
                    if (!student) return null;

                    return (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                {student.studentCode}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={grade.status} />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {grade.controlType} •{" "}
                                {new Date(grade.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge className="text-lg font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200">
                              {grade.grade}/100
                            </Badge>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {(
                                (grade.grade / selectedSubject.maxGrade) *
                                20
                              ).toFixed(1)}
                              /20
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Pour éditer, on pourrait ouvrir un modal
                                    toast.info(
                                      "Édition directe depuis la liste à venir"
                                    );
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    handleDeleteGradeWithConfirmation(
                                      grade.id,
                                      student,
                                      grade
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {existingGrades.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Aucune note enregistrée
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Commencez par saisir des notes dans l'onglet "Saisie des
                        notes"
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">Sélectionnez une matière</h3>
          <p className="text-gray-600 mt-2">
            Veuillez sélectionner une année, une classe et une matière pour
            commencer la saisie des notes.
          </p>
        </Card>
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

      {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Avertissement si pas de classes assignées */}
      {filters.academicYearId && professorClasses.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Vous n'êtes assigné à aucune classe pour cette année académique.
            Contactez l'administration pour être assigné à une classe.
          </AlertDescription>
        </Alert>
      )}

      {/* Avertissement si pas de matières pour la classe */}
      {filters.classId && professorSubjects.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Vous n'enseignez aucune matière dans cette classe.
          </AlertDescription>
        </Alert>
      )}

      {/* Aide sur le workflow */}
      {selectedSubject && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                Comment utiliser le workflow de validation
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>
                  • <strong>Brouillon</strong> : Enregistrez sans soumission
                  pour continuer plus tard
                </li>
                <li>
                  • <strong>Soumettre</strong> : Envoyez à l'administrateur pour
                  validation définitive
                </li>
                <li>
                  • <strong>Édition en masse</strong> : Appliquez une note à
                  plusieurs étudiants d'un coup
                </li>
                <li>
                  • Les notes <strong>approuvées</strong> ne peuvent plus être
                  modifiées
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorGradeManager;
