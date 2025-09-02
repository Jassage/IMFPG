import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  User,
  BookOpen,
  Calendar,
  School,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  BarChart3,
  Target,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GraduationCap,
  BookOpenCheck,
  UserCheck,
  UserX,
  MapPin,
  Briefcase,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { useProfessorStore } from "@/store/professorStore";
import { useCourseAssignmentStore } from "@/store/courseAssignmentStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";

export const ProfessorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { professors, fetchProfessors, updateProfessor, deleteProfessor } =
    useProfessorStore();
  const { assignments, fetchAssignmentsByProfessor, deleteAssignment } =
    useCourseAssignmentStore();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("courses");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    status: "Actif" as "Actif" | "Inactif",
    // office: "",
    // officeHours: "",
  });

  const professor = professors.find((p) => p.id === id);

  useEffect(() => {
    if (!professors.length) {
      fetchProfessors();
    }
  }, [professors.length, fetchProfessors]);

  useEffect(() => {
    if (id) {
      fetchAssignmentsByProfessor(id);
    }
  }, [id, fetchAssignmentsByProfessor]);

  useEffect(() => {
    if (professor) {
      setFormData({
        firstName: professor.firstName,
        lastName: professor.lastName,
        email: professor.email,
        phone: professor.phone || "",
        specialty: professor.speciality || "",
        status: professor.status,
        // office: professor.office || "",
        // officeHours: professor.officeHours || "",
      });
    }
  }, [professor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professor) return;

    try {
      await updateProfessor(professor.id, formData);
      setIsEditDialogOpen(false);
      toast({
        title: "Succès",
        description: "Professeur mis à jour avec succès",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!professor) return;

    try {
      await deleteProfessor(professor.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Professeur supprimé avec succès",
        variant: "default",
      });
      // Rediriger vers la liste des professeurs
      window.location.href = "/professeurs";
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette affectation ?")) {
      try {
        await deleteAssignment(assignmentId);
        toast({
          title: "Succès",
          description: "Affectation supprimée avec succès",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    }
  };

  const toggleAssignmentExpansion = (assignmentId: string) => {
    setExpandedAssignment(
      expandedAssignment === assignmentId ? null : assignmentId
    );
  };

  // Calculer quelques statistiques
  const totalCourses = assignments.length;
  const activeCourses = assignments.filter((a) => a.status === "Active").length;
  const completedCourses = assignments.filter(
    (a) => a.status === "Completed"
  ).length;

  if (!professor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Professeur non trouvé
          </h2>
          <p className="text-muted-foreground mb-6">
            Le professeur que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild className="gap-2">
            <Link to="/professeurs">
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header avec navigation et actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Détails du Professeur
            </h1>
            <p className="text-muted-foreground">
              Informations détaillées et cours affectés
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Modifier le professeur
                </DialogTitle>
                <DialogDescription>
                  Mettez à jour les informations du professeur{" "}
                  {professor.firstName} {professor.lastName}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Spécialité</Label>
                    <Input
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialty: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="space-y-2">
                    <Label>Bureau</Label>
                    <Input
                      value={formData.office}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          office: e.target.value,
                        })
                      }
                      placeholder="Ex: Bâtiment A, Bureau 203"
                    />
                  </div> */}
                  {/* <div className="space-y-2">
                    <Label>Heures de bureau</Label>
                    <Input
                      value={formData.officeHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          officeHours: e.target.value,
                        })
                      }
                      placeholder="Ex: Lundi 14h-16h, Mercredi 10h-12h"
                    />
                  </div> */}
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "Actif" | "Inactif",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer les modifications</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Supprimer le professeur
                </DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer le professeur{" "}
                  {professor.firstName} {professor.lastName} ? Cette action est
                  irréversible et supprimera également toutes ses affectations
                  de cours.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer définitivement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations du professeur */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {professor.firstName} {professor.lastName}
                    <Badge
                      variant={
                        professor.status === "Actif" ? "default" : "secondary"
                      }
                      className="ml-2"
                    >
                      {professor.status === "Actif" ? (
                        <UserCheck className="h-3 w-3 mr-1" />
                      ) : (
                        <UserX className="h-3 w-3 mr-1" />
                      )}
                      {professor.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Award className="h-4 w-4" />
                    {professor.speciality || "Spécialité non spécifiée"}
                  </CardDescription>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm">{professor.email}</span>
              </div>

              {professor.phone && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="text-sm">{professor.phone}</span>
                </div>
              )}

              {/* {professor.office && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span className="text-sm">{professor.office}</span>
                </div>
              )}

              {professor.officeHours && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">{professor.officeHours}</span>
                </div>
              )} */}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {totalCourses}
                  </div>
                  <div className="text-xs text-blue-600">Cours total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {activeCourses}
                  </div>
                  <div className="text-xs text-green-600">Cours actifs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cours actifs</span>
                  <span>
                    {activeCourses}/{totalCourses}
                  </span>
                </div>
                <Progress
                  value={
                    totalCourses > 0 ? (activeCourses / totalCourses) * 100 : 0
                  }
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cours terminés</span>
                  <span>
                    {completedCourses}/{totalCourses}
                  </span>
                </div>
                <Progress
                  value={
                    totalCourses > 0
                      ? (completedCourses / totalCourses) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cours affectés et détails */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Cours Affectés
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpenCheck className="h-5 w-5" />
                      Cours Affectés ({assignments.length})
                    </CardTitle>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nouvelle affectation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {assignments.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.map((assignment) => (
                        <motion.div
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card
                            className={cn(
                              "overflow-hidden transition-all hover:shadow-md",
                              expandedAssignment === assignment.id &&
                                "border-blue-300"
                            )}
                          >
                            <CardHeader
                              className="pb-3 cursor-pointer"
                              onClick={() =>
                                toggleAssignmentExpansion(assignment.id)
                              }
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <CardTitle className="text-lg">
                                    {assignment.ue?.title || "Cours inconnu"}
                                  </CardTitle>
                                  <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1"
                                    >
                                      <School className="h-3 w-3" />
                                      {assignment.ue?.code || "N/A"}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {assignment.level}
                                    </Badge>
                                    <Badge variant="outline">
                                      {assignment.semester}
                                    </Badge>
                                  </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm">
                                  {expandedAssignment === assignment.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>

                            <AnimatePresence>
                              {expandedAssignment === assignment.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CardContent className="pt-0">
                                    <Separator className="mb-4" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <School className="h-4 w-4 text-muted-foreground" />
                                          <span>
                                            <strong>Faculté:</strong>{" "}
                                            {assignment.faculty?.name || "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Award className="h-4 w-4 text-muted-foreground" />
                                          <span>
                                            <strong>Crédits:</strong>{" "}
                                            {assignment.ue?.credits || "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <span>
                                            <strong>Année:</strong>{" "}
                                            {assignment.academicYear?.year ||
                                              assignment.academicYearId}
                                          </span>
                                        </div>
                                        {assignment.createdAt && (
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                              <strong>Affecté le:</strong>{" "}
                                              {new Date(
                                                assignment.createdAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                        Modifier
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="gap-1"
                                        onClick={() =>
                                          handleDeleteAssignment(assignment.id)
                                        }
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Supprimer
                                      </Button>
                                    </div>
                                  </CardContent>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        Aucun cours affecté
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ce professeur n'a encore aucun cours assigné.
                      </p>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Assigner un cours
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations détaillées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Informations professionnelles
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Statut:</span>
                          <Badge
                            variant={
                              professor.status === "Actif"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {professor.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Spécialité:
                          </span>
                          <span className="font-medium">
                            {professor.speciality || "Non spécifiée"}
                          </span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span className="text-muted-foreground">Bureau:</span>
                          <span className="font-medium">
                            {professor.office || "Non spécifié"}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Disponibilités
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <span className="font-medium">
                              {professor.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Téléphone:
                            </span>
                            <span className="font-medium">
                              {professor.phone || "Non spécifié"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Performance et évaluations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border">
                          <div className="text-2xl font-bold text-blue-700">
                            4.8
                          </div>
                          <div className="text-sm text-blue-600">
                            Note moyenne
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg border">
                          <div className="text-2xl font-bold text-green-700">
                            92%
                          </div>
                          <div className="text-sm text-green-600">
                            Taux de satisfaction
                          </div>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg border">
                          <div className="text-2xl font-bold text-amber-700">
                            3
                          </div>
                          <div className="text-sm text-amber-600">
                            Années d'expérience
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
