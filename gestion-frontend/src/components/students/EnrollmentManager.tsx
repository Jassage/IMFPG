import React, { useState, useEffect, useCallback } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserPlus,
  Trash2,
  Edit,
  Mail,
  IdCard,
  Calendar,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Clock,
  CreditCard,
  CheckSquare,
  DollarSign,
} from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import useClassStore from "@/store/classStore";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

// Interfaces
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  email: string;
}

interface Enrollment {
  id: string;
  studentCode: string;
  classId: string;
  academicYearId: string;
  status: "Active" | "Suspended" | "Completed";
  enrollmentDate: string;
}

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  description?: string;
  academicYear: string;
  isActive: boolean;
  _count?: {
    studentFees: number;
  };
}

// Composant Dialogue de Sélection des Frais
const FeeSelectionDialog = ({
  feeStructures,
  selectedFeeStructures,
  onSelectionChange,
  onClose,
  onConfirm,
}: {
  feeStructures: FeeStructure[];
  selectedFeeStructures: string[];
  onSelectionChange: (ids: string[]) => void;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleFee = (feeId: string) => {
    if (selectedFeeStructures.includes(feeId)) {
      onSelectionChange(selectedFeeStructures.filter((id) => id !== feeId));
    } else {
      onSelectionChange([...selectedFeeStructures, feeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(feeStructures.map((fee) => fee.id));
    }
    setSelectAll(!selectAll);
  };

  const totalAmount = feeStructures
    .filter((fee) => selectedFeeStructures.includes(fee.id))
    .reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Attribution des Frais
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les frais à attribuer à l'étudiant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Option Tout sélectionner */}
          <div className="flex items-center space-x-2 p-2 border rounded-lg">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="selectAll" className="text-sm font-medium">
              Tout sélectionner
            </label>
          </div>

          {/* Liste des frais */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            {feeStructures.length === 0 ? (
              <div className="p-8 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-muted-foreground">
                  Aucune structure de frais disponible
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {feeStructures.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-start p-4 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`fee-${fee.id}`}
                      checked={selectedFeeStructures.includes(fee.id)}
                      onChange={() => handleToggleFee(fee.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <label
                          htmlFor={`fee-${fee.id}`}
                          className="font-medium cursor-pointer hover:text-blue-600 truncate"
                        >
                          {fee.name}
                        </label>
                        <span className="font-bold text-blue-600 whitespace-nowrap ml-2">
                          {fee.amount.toLocaleString()} HTG
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {fee.description || "Aucune description"}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {fee.academicYear}
                        </Badge>
                        <Badge
                          variant={fee.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {fee.isActive ? "Actif" : "Inactif"}
                        </Badge>
                        {fee._count?.studentFees !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {fee._count.studentFees} étudiant(s)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Résumé */}
          {selectedFeeStructures.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {selectedFeeStructures.length} frais sélectionné(s)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700 text-lg">
                    {totalAmount.toLocaleString()} HTG
                  </div>
                  <div className="text-sm text-blue-600">Total à payer</div>
                </div>
              </div>
              <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                Ces frais seront automatiquement attribués à l'étudiant après
                l'inscription
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Confirmer la sélection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useFeeStructureStore } from "@/store/feeStructureStore";
import { toast } from "sonner";

// import { FeeSelectionDialog } from "./FeeSelectionDialog";

interface EnrollmentFormProps {
  student: Student;
  enrollment?: Enrollment | null;
  onClose: () => void;
  onSuccess?: () => void;
  feeStructures?: FeeStructure[];
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  student,
  enrollment,
  onClose,
  onSuccess,
  feeStructures = [],
}) => {
  const { addEnrollment, updateEnrollment, assignFeesToEnrollment } =
    useEnrollmentStore();
  const { classes } = useClassStore();
  const { academicYears } = useAcademicYearStore();
  const { assignFeeToStudent } = useFeeStructureStore();

  const [formData, setFormData] = useState({
    classId: enrollment?.classId || "",
    academicYearId: enrollment?.academicYearId || "",
    status: enrollment?.status || "Active",
    enrollmentDate: enrollment?.enrollmentDate
      ? new Date(enrollment.enrollmentDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    assignFees: false,
    selectedFeeStructures: [] as string[],
  });

  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Définir l'année académique par défaut
  useEffect(() => {
    if (!formData.academicYearId && academicYears && academicYears.length > 0) {
      const currentYear =
        academicYears.find((ay: any) => ay.isCurrent) || academicYears[0];
      if (currentYear) {
        setFormData((prev) => ({ ...prev, academicYearId: currentYear.id }));
      }
    }
  }, [academicYears, formData.academicYearId]);

  // Récupérer le nom de l'année académique
  const getAcademicYearName = (academicYearId: string): string => {
    const year = academicYears?.find((ay: any) => ay.id === academicYearId);
    return year?.year || academicYearId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.classId || !formData.academicYearId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Préparer les données de l'inscription
      const enrollmentData = {
        studentId: student.id,
        classId: formData.classId,
        academicYearId: formData.academicYearId,
        status: formData.status,
        enrollmentDate: formData.enrollmentDate,
        assignFees: formData.assignFees,
        selectedFeeStructures: formData.selectedFeeStructures,
      };

      // 2. Créer ou mettre à jour l'inscription
      let enrollmentResult;
      if (enrollment) {
        enrollmentResult = await updateEnrollment(
          enrollment.id,
          enrollmentData
        );
      } else {
        enrollmentResult = await addEnrollment(enrollmentData);
      }

      // 3. Si des frais sont sélectionnés, les assigner à l'étudiant
      if (formData.assignFees && formData.selectedFeeStructures.length > 0) {
        try {
          const academicYearId = formData.academicYearId;

          // Assigner chaque structure de frais sélectionnée
          for (const feeStructureId of formData.selectedFeeStructures) {
            await assignFeeToStudent(
              student.id,
              academicYearId,
              feeStructureId,
              student.studentCode
            );
          }

          toast.success(
            `${formData.selectedFeeStructures.length} frais assignés avec succès`
          );
        } catch (feeError: any) {
          console.error("Erreur lors de l'assignation des frais:", feeError);

          // Si l'API assign ne fonctionne pas, essayer une méthode alternative
          try {
            // Méthode alternative : utiliser assignFeesToEnrollment
            const enrollmentId =
              enrollmentResult.id || enrollmentResult.data?.id;
            if (enrollmentId) {
              await assignFeesToEnrollment(
                enrollmentId,
                formData.selectedFeeStructures
              );
              toast.success("Frais assignés via méthode alternative");
            }
          } catch (altError) {
            toast.warning(
              "Inscription créée mais erreur lors de l'assignation des frais. " +
                "Vous pouvez assigner manuellement les frais depuis la section Frais de l'étudiant."
            );
          }
        }
      }

      toast.success(
        enrollment
          ? "Inscription mise à jour avec succès"
          : "Inscription créée avec succès"
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          (enrollment
            ? "Erreur lors de la mise à jour de l'inscription"
            : "Erreur lors de la création de l'inscription")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeeSelection = () => {
    setShowFeeDialog(true);
  };

  const handleFeeSelectionConfirm = () => {
    setShowFeeDialog(false);
  };

  const totalSelectedFees = formData.selectedFeeStructures.length;
  const totalAmount = feeStructures
    .filter((fee) => formData.selectedFeeStructures.includes(fee.id))
    .reduce((sum, fee) => sum + (fee.amount || fee.amount || 0), 0);

  const activeFeeStructures = feeStructures.filter((fee) => fee.isActive);

  // Si pas de frais disponibles, désactiver la case à cocher
  const hasAvailableFees = activeFeeStructures.length > 0;

  return (
    <div className="space-y-6">
      {/* En-tête étudiant */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 text-lg">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <IdCard className="h-3 w-3" />
                {student.studentCode}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Classe */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <BookOpen className="h-4 w-4" />
              Classe *
            </Label>
            <Select
              value={formData.classId}
              onValueChange={(value) =>
                setFormData({ ...formData, classId: value })
              }
              required
              disabled={submitting}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    <div className="flex items-center">
                      <span>{cls.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {cls.capacity} places
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Année académique */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Année académique *
            </Label>
            <Select
              value={formData.academicYearId}
              onValueChange={(value) =>
                setFormData({ ...formData, academicYearId: value })
              }
              required
              disabled={submitting}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {academicYears?.map((year: any) => (
                  <SelectItem key={year.id} value={year.id}>
                    <div className="flex items-center justify-between">
                      <span>{year.year}</span>
                      {year.isCurrent && (
                        <Badge variant="default" className="ml-2 text-xs">
                          En cours
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4" />
              Statut *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Active" | "Suspended" | "Completed") =>
                setFormData({ ...formData, status: value })
              }
              required
              disabled={submitting}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    Actif
                  </div>
                </SelectItem>
                <SelectItem value="Suspended">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                    Suspendu
                  </div>
                </SelectItem>
                <SelectItem value="Completed">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                    Terminé
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date d'inscription */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Date d'inscription
            </Label>
            <Input
              type="date"
              value={formData.enrollmentDate}
              onChange={(e) =>
                setFormData({ ...formData, enrollmentDate: e.target.value })
              }
              className="h-10"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Section Attribution des frais */}
        <div className="border rounded-lg p-5 space-y-4 bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="assignFees"
                checked={formData.assignFees}
                onChange={(e) =>
                  setFormData({ ...formData, assignFees: e.target.checked })
                }
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={submitting || !hasAvailableFees}
              />
              <div>
                <label
                  htmlFor="assignFees"
                  className={`font-medium ${
                    hasAvailableFees
                      ? "text-gray-900 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Attribuer des frais à l'étudiant
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasAvailableFees
                    ? "Sélectionnez les frais scolaires à attribuer automatiquement"
                    : "Aucun frais disponible pour cette année académique"}
                </p>
              </div>
            </div>

            {formData.assignFees && hasAvailableFees && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFeeSelection}
                className="gap-2"
                disabled={submitting}
              >
                <CreditCard className="h-4 w-4" />
                Sélectionner les frais
              </Button>
            )}
          </div>

          {formData.assignFees && hasAvailableFees && (
            <>
              {totalSelectedFees > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-green-800">
                          {totalSelectedFees} frais sélectionné(s)
                        </span>
                        <p className="text-sm text-green-600">
                          Ces frais seront automatiquement attribués après la
                          création de l'inscription
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700 text-xl">
                        {totalAmount.toLocaleString()} HTG
                      </div>
                      <div className="text-sm text-green-600">
                        Montant total
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {feeStructures
                      .filter((fee) =>
                        formData.selectedFeeStructures.includes(fee.id)
                      )
                      .map((fee) => (
                        <div
                          key={fee.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 hover:border-green-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="font-medium truncate">
                                {fee.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {fee.description || "Sans description"}
                            </p>
                          </div>
                          <div className="font-semibold text-green-700 whitespace-nowrap ml-2">
                            {(fee.amount || fee.amount || 0).toLocaleString()}{" "}
                            HTG
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Aucun frais sélectionné
                      </p>
                      <p className="text-sm text-amber-600 mt-1">
                        Cliquez sur "Sélectionner les frais" pour choisir les
                        frais à attribuer
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="gap-2"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : enrollment ? (
              <>
                <Edit className="h-4 w-4" />
                Modifier l'inscription
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Créer l'inscription
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Dialogue de sélection des frais */}
      {showFeeDialog && (
        <FeeSelectionDialog
          feeStructures={activeFeeStructures}
          selectedFeeStructures={formData.selectedFeeStructures}
          onSelectionChange={(ids) =>
            setFormData({ ...formData, selectedFeeStructures: ids })
          }
          onClose={() => setShowFeeDialog(false)}
          onConfirm={handleFeeSelectionConfirm}
        />
      )}
    </div>
  );
};

// Composant principal
export const EnrollmentManager = () => {
  const { students, fetchStudents } = useStudentStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const { classes, fetchClasses } = useClassStore();
  const { enrollments, fetchEnrollments, deleteEnrollment } =
    useEnrollmentStore();
  const { getAvailableFeeStructures } = useEnrollmentStore();

  const { toast } = useToast();

  // États
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [studentsData, yearsData, classesData, enrollmentsData, feesData] =
        await Promise.all([
          fetchStudents(),
          fetchAcademicYears(),
          fetchClasses(),
          fetchEnrollments(),
          getAvailableFeeStructures().catch(() => []),
        ]);

      if (Array.isArray(feesData)) {
        setFeeStructures(feesData);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    fetchStudents,
    fetchAcademicYears,
    fetchClasses,
    fetchEnrollments,
    getAvailableFeeStructures,
    toast,
  ]);

  useEffect(() => {
    loadData();
  }, []);

  // Obtenir les inscriptions d'un étudiant
  const getStudentEnrollments = (studentCode: string) => {
    if (!Array.isArray(enrollments)) return [];
    return enrollments.filter((e) => e.student.id === studentCode);
  };

  // Obtenir le nom d'une classe
  const getClassName = (classId: string) => {
    const schoolClass = classes?.find((c) => c.id === classId);
    return schoolClass ? schoolClass.name : "N/A";
  };

  // Obtenir l'année académique
  const getAcademicYear = (academicYearId: string) => {
    const year = academicYears?.find((ay) => ay.id === academicYearId);
    return year ? year.year : "N/A";
  };

  // Badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            Actif
          </Badge>
        );
      case "Suspended":
        return (
          <Badge variant="destructive" className="hover:bg-red-100">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            Suspendu
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filtrer les étudiants
  const filteredStudents = Array.isArray(students)
    ? students.filter((student) => {
        if (!student) return false;

        // Recherche
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          student.firstName?.toLowerCase().includes(searchLower) ||
          student.lastName?.toLowerCase().includes(searchLower) ||
          student.studentCode?.toLowerCase().includes(searchLower) ||
          student.email?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // Filtre par onglet
        const studentEnrollments = getStudentEnrollments(student.id);

        if (activeTab === "enrolled" && studentEnrollments.length === 0)
          return false;
        if (activeTab === "notEnrolled" && studentEnrollments.length > 0)
          return false;

        return true;
      })
    : [];

  // Handlers
  const handleEnrollStudent = (student: Student) => {
    console.log("Enrollment pour:", student);
    setSelectedStudent(student);
    setSelectedEnrollment(null);
    setIsDialogOpen(true);
  };

  const handleEditEnrollment = (student: Student, enrollment: Enrollment) => {
    console.log("Modifier:", enrollment);
    setSelectedStudent(student);
    setSelectedEnrollment(enrollment);
    setIsDialogOpen(true);
  };

  const handleDeleteEnrollment = async (
    enrollmentId: string,
    studentName: string
  ) => {
    if (confirm(`Supprimer l'inscription de ${studentName} ?`)) {
      try {
        await deleteEnrollment(enrollmentId);
        await loadData();
        toast({
          title: "Succès",
          description: "Inscription supprimée",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer",
          variant: "destructive",
        });
      }
    }
  };

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleFormSuccess = () => {
    loadData();
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setSelectedEnrollment(null);
  };

  const getEnrollmentStats = () => {
    if (!Array.isArray(enrollments)) {
      return {
        active: 0,
        suspended: 0,
        completed: 0,
        total: 0,
      };
    }

    return {
      active: enrollments.filter((e) => e.status === "Active").length,
      suspended: enrollments.filter((e) => e.status === "Suspended").length,
      completed: enrollments.filter((e) => e.status === "Completed").length,
      total: enrollments.length,
    };
  };

  const stats = getEnrollmentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
          <p className="text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Inscriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            {students?.length || 0} étudiant(s) • {stats.total} inscription(s)
          </p>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants</p>
                <p className="text-2xl font-bold">{students?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-50">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspendues</p>
                <p className="text-2xl font-bold">{stats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de contrôle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="enrolled">Inscrits</TabsTrigger>
                <TabsTrigger value="notEnrolled">Non-inscrits</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des étudiants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Étudiants ({filteredStudents.length})</span>
            <Badge variant="outline" className="ml-2">
              {filteredStudents.length} trouvé(s)
            </Badge>
          </CardTitle>
          <CardDescription>
            Gérer les inscriptions des étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun étudiant trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Aucun résultat pour votre recherche"
                    : "Aucun étudiant disponible"}
                </p>
              </div>
            ) : (
              filteredStudents.map((student: Student) => {
                const studentEnrollments = getStudentEnrollments(student.id);
                const isExpanded = expandedStudents[student.id];

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-700">
                              {student.firstName.charAt(0)}
                              {student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {student.firstName} {student.lastName}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <IdCard className="h-3 w-3" />
                                {student.studentCode}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                {student.email}
                              </Badge>
                              {studentEnrollments.length > 0 && (
                                <Badge variant="default" className="gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {studentEnrollments.length} inscription(s)
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEnrollStudent(student)}
                          className="gap-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <UserPlus className="h-3 w-3" />
                          Inscrire
                        </Button>
                        {studentEnrollments.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStudentExpansion(student.id)}
                            className="gap-1"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Réduire
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Voir les inscriptions
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && studentEnrollments.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Inscriptions de l'étudiant
                            </h4>
                            {studentEnrollments.map(
                              (enrollment: Enrollment) => (
                                <motion.div
                                  key={enrollment.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="font-medium">
                                        {getClassName(enrollment.classId)}
                                      </span>
                                      {getStatusBadge(enrollment.status)}
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>
                                        Année académique:{" "}
                                        {getAcademicYear(
                                          enrollment.academicYearId
                                        )}
                                      </p>
                                      <p>
                                        Date d'inscription:{" "}
                                        {new Date(
                                          enrollment.enrollmentDate
                                        ).toLocaleDateString("fr-FR", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-3 md:mt-0">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleEditEnrollment(
                                          student,
                                          enrollment
                                        )
                                      }
                                      className="gap-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Modifier
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive hover:text-destructive hover:bg-red-50 gap-1"
                                      onClick={() =>
                                        handleDeleteEnrollment(
                                          enrollment.id,
                                          `${student.firstName} ${student.lastName}`
                                        )
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Supprimer
                                    </Button>
                                  </div>
                                </motion.div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogue pour les inscriptions */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedEnrollment
                ? "Modifier l'inscription"
                : "Nouvelle inscription"}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EnrollmentForm
              student={selectedStudent}
              enrollment={selectedEnrollment}
              onClose={() => setIsDialogOpen(false)}
              onSuccess={handleFormSuccess}
              feeStructures={feeStructures}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnrollmentManager;
