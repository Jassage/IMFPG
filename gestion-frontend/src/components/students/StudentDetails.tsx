import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  AlertTriangle,
  Edit,
  Trash2,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Clock,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Student, Enrollment } from "../../types/academic";
import { useAcademicStore } from "../../store/academicStore";
import { useEnrollmentStore } from "../../store/enrollmentStore";
import { usePaymentStore } from "../../store/paymentStore";
import { useInitialData } from "@/hooks/useInitialData";

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export const StudentDetails = ({
  student,
  onClose,
  onEdit,
  onDelete,
}: StudentDetailsProps) => {
  useInitialData();
  const { getStudentGrades, getStudentGuardians, getStudentRetakes } =
    useAcademicStore();
  const { enrollments, getEnrollmentsByStudent } = useEnrollmentStore();
  const { payments, getPaymentsByStudent, getTotalAmount, getPaidAmount } =
    usePaymentStore();

  const [activeTab, setActiveTab] = useState("info");
  const grades = getStudentGrades(student.id);
  const guardians = getStudentGuardians(student.id);
  const retakes = getStudentRetakes(student.id);
  const studentEnrollments = getEnrollmentsByStudent(student.id);
  const studentPayments = getPaymentsByStudent(student.id);

  useEffect(() => {
    // Charger les données supplémentaires si nécessaire
    if (activeTab === "payments" && studentPayments.length === 0) {
      // Potentiellement charger les paiements ici
    }
    if (activeTab === "enrollments" && studentEnrollments.length === 0) {
      // Potentiellement charger les inscriptions ici
    }
  }, [activeTab]);

  // Trouver l'inscription active
  const currentEnrollment =
    studentEnrollments.find((e) => e.status === "Active") ||
    studentEnrollments[studentEnrollments.length - 1];

  const getStatusBadge = (status: Student["status"]) => {
    const config = {
      Active: { variant: "default" as const, label: "Actif" },
      Inactive: { variant: "secondary" as const, label: "Inactif" },
      Graduated: { variant: "outline" as const, label: "Diplômé" },
    };

    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return Math.round((total / grades.length) * 100) / 100;
  };

  const getSuccessRate = () => {
    if (grades.length === 0) return 0;
    const validatedGrades = grades.filter((g) => g.status === "Validé").length;
    return Math.round((validatedGrades / grades.length) * 100);
  };

  return (
    <div className="space-y-6 max-h-[90vh] overflow-auto animate-fade-in">
      {/* En-tête avec photo et infos principales */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border hover:shadow-xl transition-all duration-500">
        <div className="absolute inset-0 bg-grid-small-white/10 animate-pulse" />
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-8">
              <Avatar className="w-28 h-28 border-4 border-background shadow-xl hover-scale transition-all duration-300">
                <AvatarImage src={student.photo} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 animate-scale-in">
                    <h1 className="text-3xl font-bold tracking-tight story-link">
                      {student.firstName} {student.lastName}
                    </h1>
                    {getStatusBadge(student.status)}
                  </div>
                  {currentEnrollment && (
                    <p className="text-muted-foreground">
                      {currentEnrollment.faculty} • {currentEnrollment.level} •{" "}
                      {currentEnrollment.academicYear}
                    </p>
                  )}
                </div>

                {/* Statistiques rapides */}
                <div
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="text-center p-3 rounded-lg bg-background/50 border cursor-pointer hover:bg-background/80 hover-scale transition-all duration-300 hover:shadow-lg">
                        <div className="text-2xl font-bold text-primary animate-scale-in">
                          {calculateGPA()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Moyenne
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Moyenne Générale</h4>
                        <p className="text-sm text-muted-foreground">
                          Calculée sur {grades.length} notes enregistrées
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="text-center p-3 rounded-lg bg-background/50 border cursor-pointer hover:bg-background/80 hover-scale transition-all duration-300 hover:shadow-lg">
                        <div className="text-2xl font-bold text-success animate-scale-in">
                          {getSuccessRate()}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Réussite
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Taux de Réussite</h4>
                        <p className="text-sm text-muted-foreground">
                          {grades.filter((g) => g.status === "Validé").length}{" "}
                          UE validées sur {grades.length}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="text-center p-3 rounded-lg bg-background/50 border cursor-pointer hover:bg-background/80 hover-scale transition-all duration-300 hover:shadow-lg">
                        <div className="text-2xl font-bold text-warning animate-scale-in">
                          {retakes.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rattrapages
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Rattrapages</h4>
                        <p className="text-sm text-muted-foreground">
                          {
                            retakes.filter((r) => r.status === "Programmé")
                              .length
                          }{" "}
                          programmés,{" "}
                          {retakes.filter((r) => r.status === "Terminé").length}{" "}
                          terminés
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="text-center p-3 rounded-lg bg-background/50 border cursor-pointer hover:bg-background/80 hover-scale transition-all duration-300 hover:shadow-lg">
                        <div className="text-2xl font-bold text-primary animate-scale-in">
                          {getPaidAmount({
                            studentId: student.id,
                          }).toLocaleString()}{" "}
                          HTG
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Payés
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Paiements</h4>
                        <p className="text-sm text-muted-foreground">
                          {getPaidAmount({
                            studentId: student.id,
                          }).toLocaleString()}{" "}
                          HTG sur{" "}
                          {getTotalAmount({
                            studentId: student.id,
                          }).toLocaleString()}{" "}
                          HTG
                        </p>
                        <Progress
                          value={
                            (getPaidAmount({ studentId: student.id }) /
                              Math.max(
                                getTotalAmount({ studentId: student.id }),
                                1
                              )) *
                            100
                          }
                          className="w-full"
                        />
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 animate-slide-in-right">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(student)}
                  className="backdrop-blur-sm hover-scale transition-all duration-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="backdrop-blur-sm hover-scale transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirmer la suppression
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'étudiant{" "}
                        <strong>
                          {student.firstName} {student.lastName}
                        </strong>{" "}
                        ? Cette action est irréversible et supprimera toutes les
                        données associées (notes, paiements, etc.).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(student.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs
        defaultValue="info"
        className="w-full animate-fade-in"
        style={{ animationDelay: "0.3s" }}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5 h-12 p-1 bg-muted/50 hover:shadow-md transition-shadow duration-300">
          <TabsTrigger
            value="info"
            className="flex items-center gap-2 data-[state=active]:bg-background hover-scale transition-all duration-200"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Informations</span>
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="flex items-center gap-2 data-[state=active]:bg-background hover-scale transition-all duration-200"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Académique</span>
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="flex items-center gap-2 data-[state=active]:bg-background hover-scale transition-all duration-200"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Paiements</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {studentPayments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="enrollments"
            className="flex items-center gap-2 data-[state=active]:bg-background hover-scale transition-all duration-200"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Inscriptions</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {studentEnrollments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="guardians"
            className="flex items-center gap-2 data-[state=active]:bg-background hover-scale transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Tuteurs</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {guardians.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        <TabsContent value="info" className="mt-6 animate-fade-in">
          {/* ... (contenu des informations personnelles inchangé) ... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Informations académiques */}
            {/* <Card className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  Informations Académiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Faculté</label>
                    <Badge variant="outline" className="ml-2">{enrollmentInfo.faculty}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Niveau</label>
                    <Badge variant="outline" className="ml-2">{enrollmentInfo.level}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Année Académique</label>
                    <Badge variant="outline" className="ml-2">{enrollmentInfo.academicYear}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Moyenne Générale</label>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{calculateGPA()}<span className="text-sm text-muted-foreground">/20</span></div>
                      <Progress value={(calculateGPA() / 20) * 100} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Informations personnelles */}
            <Card
              className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <User className="h-5 w-5" />
                  </div>
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Téléphone
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{student.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date de Naissance
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {new Date(student.dateOfBirth).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lieu de Naissance
                    </label>
                    <p className="font-medium mt-1">{student.placeOfBirth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact et adresse */}
            <Card
              className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-scale-in lg:col-span-2 xl:col-span-1"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Contact & Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Adresse Complète
                  </label>
                  <p className="font-medium mt-1 leading-relaxed">
                    {student.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Étudiant
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <code className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      {student.studentId}
                    </code>
                  </div>
                </div>
                {student.bloodGroup && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Groupe Sanguin
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Badge variant="destructive" className="font-mono">
                        {student.bloodGroup}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations médicales */}
            {(student.allergies || student.disabilities) && (
              <Card className="lg:col-span-2 xl:col-span-3 group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    Informations Médicales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.allergies && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <label className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Allergies
                      </label>
                      <p className="font-medium mt-2 text-red-900 dark:text-red-300">
                        {student.allergies}
                      </p>
                    </div>
                  )}
                  {student.disabilities && (
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                      <label className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Handicaps / Besoins Spéciaux
                      </label>
                      <p className="font-medium mt-2 text-orange-900 dark:text-orange-300">
                        {student.disabilities}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <div className="space-y-6">
            {/* Statistiques académiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-success mb-1">
                  {grades.filter((g) => g.status === "Validé").length}
                </div>
                <div className="text-sm text-muted-foreground">UE Validées</div>
                <Progress
                  value={
                    (grades.filter((g) => g.status === "Validé").length /
                      Math.max(grades.length, 1)) *
                    100
                  }
                  className="mt-2"
                />
              </Card>
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-warning mb-1">
                  {retakes.length}
                </div>
                <div className="text-sm text-muted-foreground">Rattrapages</div>
              </Card>
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-primary mb-1">
                  {calculateGPA()}
                </div>
                <div className="text-sm text-muted-foreground">Moyenne</div>
                <Progress
                  value={(calculateGPA() / 20) * 100}
                  className="mt-2"
                />
              </Card>
            </div>

            {/* Détails des notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Notes et Résultats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length > 0 ? (
                  <div className="space-y-4">
                    {grades.map((grade) => (
                      <div
                        key={grade.id}
                        className="group p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/50"
                      >
                        {/* ... (affichage des détails de chaque note) ... */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune note enregistrée
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="space-y-6">
            {/* Résumé financier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-primary mb-1">
                  {getTotalAmount({ studentId: student.id }).toLocaleString()}{" "}
                  HTG
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Facturé
                </div>
              </Card>
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-success mb-1">
                  {getPaidAmount({ studentId: student.id }).toLocaleString()}{" "}
                  HTG
                </div>
                <div className="text-sm text-muted-foreground">Payé</div>
              </Card>
              <Card className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-destructive mb-1">
                  {getTotalAmount({ studentId: student.id }) -
                    getPaidAmount({ studentId: student.id })}{" "}
                  HTG
                </div>
                <div className="text-sm text-muted-foreground">Solde</div>
              </Card>
            </div>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Historique des Paiements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentPayments.length > 0 ? (
                  <div className="space-y-3">
                    {studentPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="group p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{payment.type}</h4>
                              <Badge
                                variant={
                                  payment.status === "Payé"
                                    ? "default"
                                    : payment.status === "En attente"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {payment.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Échéance:{" "}
                                {new Date(payment.dueDate).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                              {payment.paidDate && (
                                <span>
                                  Payé le:{" "}
                                  {new Date(
                                    payment.paidDate
                                  ).toLocaleDateString("fr-FR")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                              {payment.amount.toLocaleString()} HTG
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payment.academicYear}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucun paiement enregistré
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Historique des Inscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {studentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="group p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">
                            {enrollment.faculty} - {enrollment.level}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Année: {enrollment.academicYear}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Inscrit le:{" "}
                            {new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <Badge
                          variant={
                            enrollment.status === "Active"
                              ? "default"
                              : enrollment.status === "Completed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucune inscription enregistrée
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tuteurs et Responsables
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guardians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guardians.map((guardian) => (
                    <Card
                      key={guardian.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">
                            {guardian.firstName} {guardian.lastName}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {guardian.relationship}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{guardian.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{guardian.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">
                              {guardian.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucun tuteur enregistré
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
