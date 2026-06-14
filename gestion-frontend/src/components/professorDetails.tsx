// components/professeur/ProfesseurDetails.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Award,
  MapPin,
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  CalendarDays,
  Clock4,
  Hash,
  Briefcase,
  Plus,
  Eye,
  ShieldAlert,
  Users2,
  MailCheck,
  MoreVertical,
  Trash2,
  AlertTriangle,
  Star,
  Layers,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMediaQuery } from "@/hooks/use-media-query";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Professeur as StoreProfesseur } from "@/store/professorStore";
import useProfesseurStore from "@/store/professorStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ProfesseurDetailsProps {
  professeur: StoreProfesseur;
  onClose: () => void;
  onEdit: (professeur: StoreProfesseur) => void;
  onDelete: (professeurId: string) => void;
}

export const ProfesseurDetails = ({
  professeur,
  onClose,
  onEdit,
  onDelete,
}: ProfesseurDetailsProps) => {
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState("overview");
  const [scheduleView, setScheduleView] = useState<"weekly" | "list">("weekly");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subjectId: "",
    isPrimary: false,
    yearsOfExperience: 0,
    notes: "",
  });

  const {
    currentProfesseur,
    professeurSchedule,
    professeurAssignments,
    loadingDetails,
    fetchProfesseurFullDetails,
    clearCurrentProfesseur,
    addSubjectToProfesseur,
    removeSubjectFromProfesseur,
  } = useProfesseurStore();

  const { subjects: availableSubjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    if (professeur.id) {
      loadProfesseurFullDetails();
    }

    return () => {
      clearCurrentProfesseur();
    };
  }, [professeur.id]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const loadProfesseurFullDetails = async () => {
    try {
      await fetchProfesseurFullDetails(professeur.id);
    } catch (error) {
      console.error("❌ Erreur chargement détails:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du professeur",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDay = (dayNumber: number) => {
    const days = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];
    return days[dayNumber - 1] || `Jour ${dayNumber}`;
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDayColor = (dayNumber: number) => {
    const colors = [
      "bg-blue-50 border-blue-200",
      "bg-green-50 border-green-200",
      "bg-purple-50 border-purple-200",
      "bg-orange-50 border-orange-200",
      "bg-red-50 border-red-200",
      "bg-indigo-50 border-indigo-200",
      "bg-gray-50 border-gray-200",
    ];
    return colors[dayNumber - 1] || "bg-gray-50 border-gray-200";
  };

  const calculateSessionDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours;
  };

  const handleConfirmDelete = () => {
    onDelete(professeur.id);
    setShowDeleteDialog(false);
  };

  const handleAddSubject = async () => {
    if (!newSubject.subjectId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une matière",
        variant: "destructive",
      });
      return;
    }

    try {
      await addSubjectToProfesseur(professeur.id, newSubject);
      toast({
        title: "Succès",
        description: "Matière ajoutée avec succès",
      });
      setShowAddSubjectDialog(false);
      setNewSubject({
        subjectId: "",
        isPrimary: false,
        yearsOfExperience: 0,
        notes: "",
      });
      loadProfesseurFullDetails();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la matière",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    try {
      await removeSubjectFromProfesseur(professeur.id, subjectId);
      toast({
        title: "Succès",
        description: "Matière retirée avec succès",
      });
      loadProfesseurFullDetails();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retirer la matière",
        variant: "destructive",
      });
    }
  };

  const getExperienceStars = (years: number) => {
    if (years < 1) return "Débutant";
    if (years < 3) return "Junior";
    if (years < 5) return "Intermédiaire";
    if (years < 10) return "Expérimenté";
    return "Expert";
  };

  // Organiser l'emploi du temps par jour pour l'affichage
  const getScheduleByDay = () => {
    const scheduleByDay: Record<number, typeof professeurSchedule> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    professeurSchedule.forEach((schedule) => {
      const day = schedule.dayOfWeek;
      if (day >= 1 && day <= 7) {
        scheduleByDay[day].push(schedule);
      }
    });

    return scheduleByDay;
  };

  if (loadingDetails && !currentProfesseur) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentProfesseur) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Professeur non trouvé</h2>
        <p className="text-muted-foreground mb-6">
          Le professeur demandé n'existe pas ou a été supprimé.
        </p>
        <Button onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const scheduleByDay = getScheduleByDay();
  const assignments = currentProfesseur.assignments || professeurAssignments;
  const subjectsTaught = currentProfesseur.subjectsTaught || [];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* En-tête avec navigation et actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xl font-bold">
                  {getInitials(
                    currentProfesseur.firstName,
                    currentProfesseur.lastName
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {currentProfesseur.firstName} {currentProfesseur.lastName}
                  </h1>
                  <Badge
                    variant={
                      currentProfesseur.status === "Actif"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      currentProfesseur.status === "Actif"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0"
                    }
                  >
                    {currentProfesseur.status === "Actif" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {currentProfesseur.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {currentProfesseur.matricule && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      <span className="font-mono font-semibold">
                        {currentProfesseur.matricule}
                      </span>
                    </div>
                  )}
                  {currentProfesseur.speciality && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-3 w-3" />
                      <span>{currentProfesseur.speciality}</span>
                    </div>
                  )}
                  {currentProfesseur.hireDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Depuis{" "}
                        {new Date(currentProfesseur.hireDate).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {currentUser?.role === "Admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(currentProfesseur)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Classes</p>
                  <p className="text-2xl font-bold mt-1">
                    {currentProfesseur._count?.assignments || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Actives</p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Matières</p>
                  <p className="text-2xl font-bold mt-1">
                    {subjectsTaught.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enseignées
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Séances/semaine
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {professeurSchedule.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Années service
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {currentProfesseur.hireDate
                      ? new Date().getFullYear() -
                        new Date(currentProfesseur.hireDate).getFullYear()
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expérience
                  </p>
                </div>
                <div className="p-2 rounded-full bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="border-b">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger
                value="overview"
                className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Matières ({subjectsTaught.length})
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Layers className="h-4 w-4 mr-2" />
                Cours
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Emploi du temps
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Shield className="h-4 w-4 mr-2" />
                Compte
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{currentProfesseur.email}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>
                    {currentProfesseur.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {currentProfesseur.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Téléphone
                          </p>
                        </div>
                      </div>
                    )}
                    {currentProfesseur.address && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {currentProfesseur.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Adresse
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Matières principales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Matières enseignées
                  </CardTitle>
                  <CardDescription>
                    {subjectsTaught.length} matière
                    {subjectsTaught.length > 1 ? "s" : ""} au total
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjectsTaught.length > 0 ? (
                    <div className="space-y-3">
                      {subjectsTaught
                        .filter((subject) => subject.isPrimary)
                        .map((subjectItem) => (
                          <div
                            key={subjectItem.id}
                            className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <h4 className="font-semibold">
                                    {subjectItem.subject?.name}
                                  </h4>
                                  <Badge variant="default" className="text-xs">
                                    Principal
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {subjectItem.subject?.code}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">
                          Autres matières
                        </h4>
                        <div className="space-y-2">
                          {subjectsTaught
                            .filter((subject) => !subject.isPrimary)
                            .slice(0, 3)
                            .map((subjectItem) => (
                              <div
                                key={subjectItem.id}
                                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                              >
                                <span className="text-sm">
                                  {subjectItem.subject?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {subjectItem.yearsOfExperience || 0} an
                                  {subjectItem.yearsOfExperience > 1 ? "s" : ""}
                                </span>
                              </div>
                            ))}
                          {subjectsTaught.filter((s) => !s.isPrimary).length >
                            3 && (
                            <div className="text-center text-sm text-muted-foreground pt-1">
                              +{" "}
                              {subjectsTaught.filter((s) => !s.isPrimary)
                                .length - 3}{" "}
                              autres
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        Aucune matière enseignée
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setActiveTab("subjects")}
                      >
                        Ajouter des matières
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informations professionnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informations professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {currentProfesseur.speciality || "Non spécifié"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Spécialité
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Clock4 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {currentProfesseur._count?.schedules || 0} séances
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Charge horaire
                        </p>
                      </div>
                    </div>

                    {currentProfesseur.qualifications && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Qualifications
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {currentProfesseur.qualifications}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Matières */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Matières enseignées</h2>
                <p className="text-sm text-muted-foreground">
                  Gestion des matières que ce professeur peut enseigner
                </p>
              </div>
              {subjectsTaught.length > 0 && (
                <Button onClick={() => setShowAddSubjectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une matière
                </Button>
              )}
            </div>

            {subjectsTaught.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectsTaught.map((subjectItem) => (
                  <Card key={subjectItem.id} className="overflow-hidden">
                    <CardHeader
                      className={`pb-3 ${
                        subjectItem.isPrimary
                          ? "bg-gradient-to-r from-primary/10 to-primary/5"
                          : "bg-muted/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {subjectItem.subject?.name}
                            {subjectItem.isPrimary && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Code: {subjectItem.subject?.code}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-600"
                          onClick={() =>
                            handleRemoveSubject(subjectItem.subjectId)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Expérience
                        </span>
                        <Badge variant="outline">
                          {getExperienceStars(
                            subjectItem.yearsOfExperience || 0
                          )}{" "}
                          ({subjectItem.yearsOfExperience || 0} an
                          {(subjectItem.yearsOfExperience || 0) > 1
                            ? "s"
                            : ""}
                          )
                        </Badge>
                      </div>
                      {subjectItem.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {subjectItem.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune matière enseignée
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ce professeur n'est pas encore associé à des matières.
                    Ajoutez des matières pour définir ses compétences
                    d'enseignement.
                  </p>
                  <Button onClick={() => setShowAddSubjectDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une première matière
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Dialogue pour ajouter une matière */}
            <AlertDialog
              open={showAddSubjectDialog}
              onOpenChange={setShowAddSubjectDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ajouter une matière</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sélectionnez une matière que ce professeur peut enseigner.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-select">
                      Sélectionner une matière
                    </Label>
                    <Select
                      value={newSubject.subjectId}
                      onValueChange={(value) =>
                        setNewSubject({ ...newSubject, subjectId: value })
                      }
                    >
                      <SelectTrigger id="subject-select">
                        <SelectValue placeholder="Choisir une matière..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.filter(
                          (subject) =>
                            !subjectsTaught.some(
                              (s) => s.subjectId === subject.id
                            )
                        ).length === 0 ? (
                          <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                            Toutes les matières sont déjà attribuées
                          </div>
                        ) : (
                          availableSubjects
                            .filter(
                              (subject) =>
                                !subjectsTaught.some(
                                  (s) => s.subjectId === subject.id
                                )
                            )
                            .map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={newSubject.isPrimary}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isPrimary" className="cursor-pointer">
                      Définir comme matière principale
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Années d'expérience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={newSubject.yearsOfExperience}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          yearsOfExperience: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <textarea
                      id="notes"
                      value={newSubject.notes}
                      onChange={(e) =>
                        setNewSubject({ ...newSubject, notes: e.target.value })
                      }
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Compétences spécifiques, certifications, commentaires..."
                    />
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddSubject}>
                    Ajouter
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* Onglet Cours  */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cours assignés</h2>
            </div>

            {assignments && assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assignment.subject.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <code className="text-xs px-2 py-1 bg-muted rounded">
                              {assignment.subject.code}
                            </code>
                            <Badge variant="outline">
                              {assignment.academicYear.year}
                            </Badge>
                            {assignment.academicYear.isCurrent && (
                              <Badge variant="default">Année en cours</Badge>
                            )}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{assignment.classLevel}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {assignment.schedules &&
                      assignment.schedules.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Horaires ({assignment.schedules.length} séances)
                          </h4>
                          <div className="space-y-2">
                            {assignment.schedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {formatDay(schedule.dayOfWeek)} •{" "}
                                    {formatTime(schedule.startTime)} -{" "}
                                    {formatTime(schedule.endTime)}
                                    {schedule.classroom &&
                                      ` • Salle ${schedule.classroom}`}
                                    {schedule.schoolClass &&
                                      ` • Classe ${schedule.schoolClass.name}`}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Aucun horaire défini pour ce cours
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucun cours assigné
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ce professeur n'est pas encore assigné à des cours.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Emploi du temps (inchangé) */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Emploi du temps</h2>
              <div className="flex gap-2">
                <Button
                  variant={scheduleView === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScheduleView("weekly")}
                >
                  Vue par jour
                </Button>
                <Button
                  variant={scheduleView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScheduleView("list")}
                >
                  Liste complète
                </Button>
              </div>
            </div>

            {professeurSchedule.length > 0 ? (
              scheduleView === "weekly" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5].map((day) => {
                    const daySchedules = scheduleByDay[day] || [];
                    if (daySchedules.length === 0) return null;

                    return (
                      <Card key={day} className={`border ${getDayColor(day)}`}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{formatDay(day)}</span>
                            <Badge variant="outline" className="text-xs">
                              {daySchedules.length} séance
                              {daySchedules.length > 1 ? "s" : ""}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {daySchedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="p-3 bg-white border rounded-lg shadow-sm"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">
                                      {schedule.classAssignment?.subject
                                        ?.name ||
                                        schedule.subject?.name ||
                                        "Cours"}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      {schedule.schoolClass && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {schedule.schoolClass.name}
                                        </Badge>
                                      )}
                                      {schedule.classroom && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Salle {schedule.classroom}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span className="font-medium">
                                      {formatTime(schedule.startTime)} -{" "}
                                      {formatTime(schedule.endTime)}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    {calculateSessionDuration(
                                      schedule.startTime,
                                      schedule.endTime
                                    ).toFixed(1)}
                                    h
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-4 font-medium">Jour</th>
                            <th className="text-left p-4 font-medium">
                              Horaire
                            </th>
                            <th className="text-left p-4 font-medium">Cours</th>
                            <th className="text-left p-4 font-medium">
                              Classe
                            </th>
                            <th className="text-left p-4 font-medium">Salle</th>
                            <th className="text-left p-4 font-medium">Durée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {professeurSchedule.map((schedule) => (
                            <tr
                              key={schedule.id}
                              className="border-b hover:bg-muted/30"
                            >
                              <td className="p-4">
                                <div className="font-medium">
                                  {formatDay(schedule.dayOfWeek)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-mono">
                                  {formatTime(schedule.startTime)} -{" "}
                                  {formatTime(schedule.endTime)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-medium">
                                  {schedule.classAssignment?.subject?.name ||
                                    schedule.subject?.name ||
                                    "Cours"}
                                </div>
                                {schedule.subject?.code && (
                                  <div className="text-sm text-muted-foreground">
                                    {schedule.subject.code}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <div>{schedule.schoolClass?.name || "-"}</div>
                                <div className="text-sm text-muted-foreground">
                                  {schedule.schoolClass?.level || ""}
                                </div>
                              </td>
                              <td className="p-4">
                                {schedule.classroom || "-"}
                              </td>
                              <td className="p-4">
                                <div className="font-medium">
                                  {calculateSessionDuration(
                                    schedule.startTime,
                                    schedule.endTime
                                  ).toFixed(1)}
                                  h
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="border-dashed">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucun horaire défini
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    L'emploi du temps n'est pas encore configuré pour ce
                    professeur.
                  </p>
                  <Button
                    onClick={() =>
                      navigate(
                        `/schedules/new?professeurId=${currentProfesseur.id}`
                      )
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un emploi du temps
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Compte  */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestion du compte utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentProfesseur.user ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">
                            Informations du compte
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <MailCheck className="h-4 w-4" />
                              <div>
                                <p className="font-medium">
                                  {currentProfesseur.user.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Adresse email
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <ShieldAlert className="h-4 w-4" />
                              <div>
                                <p className="font-medium">
                                  {currentProfesseur.user.role}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Rôle dans le système
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">
                            Activité et sécurité
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <Clock className="h-4 w-4" />
                              <div>
                                <p className="font-medium">
                                  {currentProfesseur.user.lastLogin
                                    ? formatDateTime(
                                        currentProfesseur.user.lastLogin
                                      )
                                    : "Jamais"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Dernière connexion
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                      <Shield className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Aucun compte associé
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Ce professeur n'a pas encore de compte utilisateur dans le
                      système. Créez-en un pour lui donner accès à la
                      plateforme.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() =>
                          navigate(
                            `/users/new?professeurId=${currentProfesseur.id}`
                          )
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un nouveau compte
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/professeurs/${currentProfesseur.id}/associate-user`
                          )
                        }
                      >
                        <Users2 className="h-4 w-4 mr-2" />
                        Associer un compte existant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le professeur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le professeur{" "}
              <span className="font-semibold">
                {currentProfesseur.firstName} {currentProfesseur.lastName}
              </span>
              ?
              <p className="mt-2 text-amber-600 text-sm">
                <AlertTriangle /> Cette action est irréversible. Tous les cours
                assignés à ce professeur devront être réassignés.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
