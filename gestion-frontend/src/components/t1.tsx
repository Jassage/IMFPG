import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  DialogFooter,
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
  ClipboardCheck,
  ArrowRightCircle,
  ShieldAlert,
  History,
  AlertTriangle,
  GraduationCap,
  School,
  UserCheck,
} from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import useClassStore from "@/store/classStore";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

// ... (tous les imports et interfaces existants restent les mêmes)

// Nouveau composant Modal de Confirmation Élégant
const ReenrollmentConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  previousEnrollment,
  targetAcademicYear,
  validationResult,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student: Student;
  previousEnrollment: Enrollment | null;
  targetAcademicYear: any;
  validationResult: ValidationResult | null;
  isLoading?: boolean;
}) => {
  const previousClass = previousEnrollment?.schoolClass;
  const { classes } = useClassStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
            Confirmation de réinscription
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails avant de confirmer la réinscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section Étudiant */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-700 text-lg">
                  {student.firstName.charAt(0)}
                  {student.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {student.email}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Section Transition */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <ArrowRightCircle className="h-5 w-5" />
                Transition académique
              </h4>
              <Badge className="bg-green-100 text-green-800">Promotion</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ancienne inscription */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <School className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-700">
                      Ancienne inscription
                    </h5>
                    <p className="text-sm text-gray-500">Année précédente</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Année académique</p>
                    <p className="font-semibold">
                      {previousEnrollment?.academicYear?.year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Classe</p>
                    <p className="font-semibold">
                      {previousClass?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <Badge variant="outline" className="mt-1">
                      {previousEnrollment?.status || "N/A"}
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Nouvelle inscription */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 rounded-lg border shadow-sm border-green-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-green-700">
                      Nouvelle inscription
                    </h5>
                    <p className="text-sm text-green-500">Année suivante</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Année académique</p>
                    <p className="font-semibold text-green-700">
                      {targetAcademicYear?.year || "Année cible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Classe</p>
                    <p className="font-semibold text-green-700">
                      {previousClass?.name || "Même classe"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nouveau statut</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      Actif
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Flèche animée */}
            <div className="flex justify-center mt-4">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-gray-400"
              >
                <ArrowRightCircle className="h-8 w-8" />
              </motion.div>
            </div>
          </div>

          {/* Section Validation */}
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                validationResult.canReenroll
                  ? "bg-green-50 border border-green-200"
                  : "bg-amber-50 border border-amber-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.canReenroll ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {validationResult.canReenroll
                      ? "✅ Éligibilité confirmée"
                      : "⚠️ Attention : Non éligible"}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {validationResult.canReenroll
                      ? "L'étudiant remplit tous les critères pour la réinscription."
                      : "L'étudiant ne remplit pas tous les critères de réinscription."}
                  </p>

                  {!validationResult.canReenroll && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Réussite académique</span>
                        <Badge
                          variant={
                            validationResult.details.eligibility
                              .academicEligible
                              ? "default"
                              : "destructive"
                          }
                        >
                          {validationResult.details.eligibility.academicEligible
                            ? "OK"
                            : "Non"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Situation financière</span>
                        <Badge
                          variant={
                            validationResult.details.eligibility
                              .financialEligible
                              ? "default"
                              : "destructive"
                          }
                        >
                          {validationResult.details.eligibility
                            .financialEligible
                            ? "OK"
                            : "Non"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Frais en retard</span>
                        <Badge
                          variant={
                            validationResult.details.eligibility.noOverdueFees
                              ? "default"
                              : "destructive"
                          }
                        >
                          {validationResult.details.eligibility.noOverdueFees
                            ? "Aucun"
                            : "Présents"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Avertissements et notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">
                  Conséquences de cette action
                </h4>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Une nouvelle inscription sera créée pour l'année{" "}
                      {targetAcademicYear?.year}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      L'inscription précédente sera marquée comme "Terminée"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Les frais de scolarité de la nouvelle année seront générés
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>L'historique académique sera préservé</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Résumé rapide */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Étudiant</p>
                <p className="font-semibold truncate">
                  {student.firstName} {student.lastName.charAt(0)}.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">De</p>
                <p className="font-semibold">
                  {previousEnrollment?.academicYear?.year}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">À</p>
                <p className="font-semibold text-green-700">
                  {targetAcademicYear?.year}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Classe</p>
                <p className="font-semibold">{previousClass?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>

          {validationResult && !validationResult.canReenroll ? (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="destructive"
              className="w-full sm:w-auto gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Réinscrire malgré tout
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  Confirmer la réinscription
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Modification dans le composant principal
export const EnrollmentManager = () => {
  // ... (tous les états existants restent)

  // Remplacer l'état de confirmation
  const [reenrollmentConfirmationOpen, setReenrollmentConfirmationOpen] =
    useState(false);
  const [reenrollmentData, setReenrollmentData] = useState<{
    student: Student;
    previousEnrollment: Enrollment;
    targetYear: any;
  } | null>(null);

  // Modifier handleStartReenrollment
  const handleStartReenrollment = (student: Student) => {
    const latestEnrollment = getLatestEnrollment(student.id);

    if (!latestEnrollment) {
      toast({
        title: "Erreur",
        description: "Aucune inscription précédente trouvée",
        variant: "destructive",
      });
      return;
    }

    const currentAcademicYear = academicYears?.find((ay: any) => ay.isCurrent);

    if (!currentAcademicYear) {
      toast({
        title: "Erreur",
        description: "Aucune année académique courante trouvée",
        variant: "destructive",
      });
      return;
    }

    // Stocker les données pour la confirmation
    setReenrollmentData({
      student,
      previousEnrollment: latestEnrollment,
      targetYear: currentAcademicYear,
    });

    // Ouvrir le modal de confirmation
    setReenrollmentConfirmationOpen(true);
  };

  // Nouvelle fonction handleConfirmReenrollment simplifiée
  const handleConfirmReenrollment = async () => {
    if (!reenrollmentData) return;

    try {
      setReenrollmentLoading(true);

      // Utiliser la méthode du store
      const result = await reenrollStudentApi({
        studentId: reenrollmentData.student.id,
        classId: reenrollmentData.previousEnrollment.classId,
        academicYearId: reenrollmentData.targetYear.id,
        previousAcademicYearId:
          reenrollmentData.previousEnrollment.academicYearId,
        enrollmentDate: new Date().toISOString().split("T")[0],
        notes: "Réinscription confirmée via interface",
      });

      console.log("✅ Réponse réinscription:", result);

      toast({
        title: "Succès",
        description: "L'étudiant a été réinscrit avec succès",
        variant: "default",
      });

      // Recharger les données
      await loadData();

      // Fermer tous les modals
      setReenrollmentConfirmationOpen(false);
      setValidationDialogOpen(false);
      setReenrollmentData(null);
    } catch (error: any) {
      console.error("❌ Erreur lors de la réinscription:", error);

      let errorMessage = "Erreur lors de la réinscription";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setReenrollmentLoading(false);
    }
  };

  // Remplacer le bouton "Confirmer la réinscription" dans la liste des étudiants
  // Modifier la partie du bouton dans la carte étudiant :
  <Button
    size="sm"
    onClick={() => handleStartReenrollment(student)}
    className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
  >
    <UserPlus className="h-3 w-3" />
    Réinscrire
  </Button>;

  // Remplacer l'ancien modal de confirmation par le nouveau
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ... (le reste du JSX reste inchangé) */}

      {/* Nouveau modal de confirmation */}
      {reenrollmentData && (
        <ReenrollmentConfirmationModal
          isOpen={reenrollmentConfirmationOpen}
          onClose={() => {
            setReenrollmentConfirmationOpen(false);
            setReenrollmentData(null);
          }}
          onConfirm={handleConfirmReenrollment}
          student={reenrollmentData.student}
          previousEnrollment={reenrollmentData.previousEnrollment}
          targetAcademicYear={reenrollmentData.targetYear}
          validationResult={validationResult}
          isLoading={reenrollmentLoading}
        />
      )}

      {/* Garder l'ancien modal de validation */}
      <Dialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
      >
        {/* ... (modal de validation inchangé) */}
      </Dialog>
    </div>
  );
};

// ... (le reste du code reste inchangé)
