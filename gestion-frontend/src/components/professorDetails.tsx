import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// import { useProfesseurStore } from "@/store/profesorStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  BookOpen,
  Building,
  Users,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useProfesseurStore from "@/store/professorStore";

export const ProfesseurDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const {
    currentProfesseur,
    professeurSchedule,
    professeurAssignments,
    fetchProfesseurById,
    fetchProfesseurSchedule,
    fetchProfesseurAssignments,
    deleteProfesseur,
    activateProfesseur,
    deactivateProfesseur,
    loading,
  } = useProfesseurStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusAction, setStatusAction] = useState<"activate" | "deactivate">(
    "activate"
  );

  useEffect(() => {
    if (id) {
      fetchProfesseurById(id);
      fetchProfesseurSchedule(id);
      fetchProfesseurAssignments(id);
    }
  }, [
    id,
    fetchProfesseurById,
    fetchProfesseurSchedule,
    fetchProfesseurAssignments,
  ]);

  const handleDelete = async () => {
    if (!id || !currentProfesseur) return;

    try {
      await deleteProfesseur(id);
      toast({
        title: "Professeur supprimé",
        description: `${currentProfesseur.firstName} ${currentProfesseur.lastName} a été supprimé avec succès`,
      });
      navigate("/academic/professeurs");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async () => {
    if (!id || !currentProfesseur) return;

    try {
      if (statusAction === "activate") {
        await activateProfesseur(id);
        toast({
          title: "Professeur activé",
          description: `${currentProfesseur.firstName} ${currentProfesseur.lastName} a été activé avec succès`,
        });
      } else {
        await deactivateProfesseur(id);
        toast({
          title: "Professeur désactivé",
          description: `${currentProfesseur.firstName} ${currentProfesseur.lastName} a été désactivé avec succès`,
        });
      }
      setShowStatusDialog(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du changement de statut",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === "Actif"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const getDayName = (day: number) => {
    const days = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];
    return days[day - 1] || `Jour ${day}`;
  };

  if (loading && !currentProfesseur) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentProfesseur) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate("/academic/professeurs")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Professeur non trouvé</h3>
            <p className="text-gray-500 mb-6">
              Le professeur que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => navigate("/academic/professeurs")}>
              Voir tous les professeurs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "Admin";
  const canEdit = isAdmin || currentUser?.role === "Directeur";

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le professeur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le professeur{" "}
              {currentProfesseur.firstName} {currentProfesseur.lastName} ? Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de changement de statut */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusAction === "activate" ? "Activer" : "Désactiver"} le
              professeur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir{" "}
              {statusAction === "activate" ? "activer" : "désactiver"} le
              professeur {currentProfesseur.firstName}{" "}
              {currentProfesseur.lastName} ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {statusAction === "activate" ? "Activer" : "Désactiver"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* En-tête avec boutons d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/academic/professeurs")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentProfesseur.firstName} {currentProfesseur.lastName}
            </h1>
            <p className="text-muted-foreground">Détails du professeur</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/academic/professeurs/edit/${id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>

              {currentProfesseur.status === "Actif" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusAction("deactivate");
                    setShowStatusDialog(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Désactiver
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusAction("activate");
                    setShowStatusDialog(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activer
                </Button>
              )}

              {isAdmin && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Informations générales */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
              <TabsTrigger value="assignments">Cours assignés</TabsTrigger>
              <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Détails de contact et informations générales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-lg">
                        {getInitials(
                          currentProfesseur.firstName,
                          currentProfesseur.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {currentProfesseur.firstName}{" "}
                        {currentProfesseur.lastName}
                      </h3>
                      <Badge
                        className={getStatusColor(currentProfesseur.status)}
                      >
                        {currentProfesseur.status}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-muted-foreground">
                            {currentProfesseur.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Téléphone</p>
                          <p className="text-muted-foreground">
                            {currentProfesseur.phone || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Spécialité</p>
                          <p className="text-muted-foreground">
                            {currentProfesseur.speciality || "Non spécifié"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date d'embauche</p>
                          <p className="text-muted-foreground">
                            {currentProfesseur.hireDate
                              ? new Date(
                                  currentProfesseur.hireDate
                                ).toLocaleDateString("fr-FR")
                              : "Non renseignée"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compte utilisateur associé */}
              {currentProfesseur.user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Compte utilisateur</CardTitle>
                    <CardDescription>
                      Informations du compte système associé
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Rôle</span>
                        <Badge variant="outline">
                          {currentProfesseur.user.role}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Statut du compte
                        </span>
                        <Badge
                          variant={
                            currentProfesseur.user.status === "Actif"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {currentProfesseur.user.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Dernière connexion
                        </span>
                        <span className="text-muted-foreground">
                          {currentProfesseur.user.email
                            ? new Date(
                                currentProfesseur.user.email
                              ).toLocaleString("fr-FR")
                            : "Jamais"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Emploi du temps */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emploi du temps</CardTitle>
                  <CardDescription>
                    Horaires hebdomadaires du professeur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {professeurSchedule.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun cours planifié</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {[1, 2, 3, 4, 5].map((day) => {
                        const daySchedules = professeurSchedule.filter(
                          (s) => s.dayOfWeek === day
                        );
                        if (daySchedules.length === 0) return null;

                        return (
                          <div key={day} className="space-y-2">
                            <h4 className="font-semibold text-lg">
                              {getDayName(day)}
                            </h4>
                            <div className="space-y-2">
                              {daySchedules.map((schedule) => (
                                <Card
                                  key={schedule.id}
                                  className="hover:bg-gray-50"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">
                                          {schedule.subject?.name || "Cours"}
                                          {schedule.classroom &&
                                            ` (${schedule.classroom})`}
                                        </p>
                                        {schedule.class && (
                                          <p className="text-sm text-muted-foreground">
                                            {schedule.class.name} -{" "}
                                            {schedule.class.level}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">
                                          {formatTime(schedule.startTime)} -{" "}
                                          {formatTime(schedule.endTime)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {schedule.subject?.code}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cours assignés */}
            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cours assignés</CardTitle>
                  <CardDescription>
                    Matières et classes enseignées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {professeurAssignments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun cours assigné</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {professeurAssignments.map((assignment) => (
                        <Card key={assignment.id} className="hover:bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                  <h4 className="font-semibold">
                                    {assignment.subject.name} (
                                    {assignment.subject.code})
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Niveau: {assignment.classLevel}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Année: {assignment.academicYear.year}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {assignment.schedules.length} séance(s)
                              </Badge>
                            </div>

                            {assignment.schedules.length > 0 && (
                              <div className="mt-4 pt-4 border-t">
                                <h5 className="text-sm font-medium mb-2">
                                  Horaires :
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {assignment.schedules.map((schedule) => (
                                    <Badge
                                      key={schedule.id}
                                      variant="secondary"
                                    >
                                      {getDayName(schedule.dayOfWeek)}{" "}
                                      {formatTime(schedule.startTime)}-
                                      {formatTime(schedule.endTime)}
                                      {schedule.classroom &&
                                        ` (${schedule.classroom})`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistiques */}
            <TabsContent value="statistics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Cours total
                        </p>
                        <p className="text-2xl font-bold">
                          {currentProfesseur._count?.assignments || 0}
                        </p>
                      </div>
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Classes
                        </p>
                        <p className="text-2xl font-bold">
                          {currentProfesseur._count?.classes || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Séances hebdo
                        </p>
                        <p className="text-2xl font-bold">
                          {currentProfesseur._count?.schedules || 0}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                  <CardDescription>
                    Activités et informations temporelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Date de création
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(currentProfesseur.createdAt).toLocaleString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Dernière modification
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(currentProfesseur.updatedAt).toLocaleString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    {currentProfesseur.hireDate && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Ancienneté
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(currentProfesseur.hireDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365)
                          )}{" "}
                          ans
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Colonne de droite - Actions rapides et résumé */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canEdit && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/academic/professeurs/edit/${id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to={`mailto:${currentProfesseur.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Link>
              </Button>

              {currentProfesseur.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`tel:${currentProfesseur.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Link>
                </Button>
              )}

              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Générer rapport
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Statut</span>
                <Badge className={getStatusColor(currentProfesseur.status)}>
                  {currentProfesseur.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Cours actifs</span>
                <span>{currentProfesseur._count?.assignments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Classes</span>
                <span>{currentProfesseur._count?.classes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Séances/semaine</span>
                <span>{currentProfesseur._count?.schedules || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ajoutez des notes personnelles sur ce professeur...
              </p>
              <Button variant="ghost" size="sm" className="mt-2">
                Ajouter une note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfesseurDetails;
