// components/announcement/AnnouncementManager.tsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  BellIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
  MoreVerticalIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  FileIcon,
} from "lucide-react";
import { useAnnouncementStore } from "@/store/announcementStore";
import AnnouncementForm from "./announcement/AnnouncementForm";

const AnnouncementManager: React.FC = () => {
  const {
    announcements,
    loading,
    error,
    filters,
    pagination,
    targetAudienceOptions,
    priorityOptions,
    activeAnnouncements,
    fetchAnnouncements,
    fetchAnnouncementById,
    fetchActiveAnnouncements,
    deleteAnnouncement,
    deactivateAnnouncement,
    setFilters,
    resetFilters,
    clearError,
  } = useAnnouncementStore();

  const { toast } = useToast();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  // Charger les annonces au montage
  useEffect(() => {
    fetchAnnouncements();
    fetchActiveAnnouncements();
  }, []);

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, clearError, toast]);

  // Gestion des filtres
  const handleFilterChange = (field: string, value: any) => {
    setFilters({ [field]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  // Actions
  const handleViewAnnouncement = async (id: string) => {
    try {
      const announcement = await fetchAnnouncementById(id);
      setSelectedAnnouncement(announcement);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error viewing announcement:", error);
    }
  };

  const handleEditAnnouncement = async (id: string) => {
    try {
      const announcement = await fetchAnnouncementById(id);
      setSelectedAnnouncement(announcement);
      setOpenFormDialog(true);
    } catch (error) {
      console.error("Error editing announcement:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeactivateClick = (id: string) => {
    setSelectedId(id);
    setOpenDeactivateDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAnnouncement(selectedId);
      toast({
        title: "Succès",
        description: "Annonce supprimée avec succès",
      });
      setOpenDeleteDialog(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDeactivate = async () => {
    try {
      await deactivateAnnouncement(selectedId);
      toast({
        title: "Succès",
        description: "Annonce désactivée avec succès",
      });
      setOpenDeactivateDialog(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la désactivation",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setOpenFormDialog(false);
    setSelectedAnnouncement(null);
    toast({
      title: "Succès",
      description: "Opération effectuée avec succès",
    });
  };

  // Rendu des badges
  const renderPriorityBadge = (priority: string) => {
    const priorityConfig: Record<
      string,
      {
        variant: "default" | "destructive" | "outline" | "secondary";
        icon?: React.ReactNode;
      }
    > = {
      Critical: {
        variant: "destructive",
        icon: <AlertCircleIcon className="mr-1 h-3 w-3" />,
      },
      High: {
        variant: "destructive",
        icon: <AlertCircleIcon className="mr-1 h-3 w-3" />,
      },
      Medium: {
        variant: "default",
        icon: <BellIcon className="mr-1 h-3 w-3" />,
      },
      Low: {
        variant: "secondary",
        icon: <BellIcon className="mr-1 h-3 w-3" />,
      },
    };

    const config = priorityConfig[priority] || { variant: "outline" as const };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.icon}
        {priority}
      </Badge>
    );
  };

  const renderAudienceBadge = (audience: string) => {
    const audienceConfig: Record<
      string,
      { variant: "default" | "destructive" | "outline" | "secondary" }
    > = {
      All: { variant: "default" },
      Students: { variant: "secondary" },
      Teachers: { variant: "secondary" },
      Parents: { variant: "secondary" },
      Staff: { variant: "secondary" },
      General: { variant: "outline" },
    };

    const config = audienceConfig[audience] || { variant: "outline" as const };
    return (
      <Badge variant={config.variant} className="text-xs">
        {audience}
      </Badge>
    );
  };

  const renderStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "outline"} className="text-xs">
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  // Formatage de date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Annonces
          </h1>
          <p className="text-muted-foreground text-sm">
            {announcements.length} annonce
            {announcements.length !== 1 ? "s" : ""} •{" "}
            {activeAnnouncements.length} active
            {activeAnnouncements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setOpenFormDialog(true)} size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvelle Annonce
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Rechercher
              </Label>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm">
                Public cible
              </Label>
              <Select
                value={filters.targetAudience}
                onValueChange={(value) =>
                  handleFilterChange("targetAudience", value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les publics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {targetAudienceOptions.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm">
                Priorité
              </Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">
                Statut
              </Label>
              <Select
                value={filters.isActive?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange("isActive", value === "true")
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="true">Actives</SelectItem>
                  <SelectItem value="false">Inactives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} size="sm">
              <XIcon className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des annonces */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les annonces</CardTitle>
          <CardDescription>
            Liste complète des annonces avec filtres et pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <BellIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucune annonce</h3>
              <p className="text-muted-foreground">
                Commencez par créer une nouvelle annonce.
              </p>
              <Button
                className="mt-4"
                onClick={() => setOpenFormDialog(true)}
                size="sm"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Créer une annonce
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Public</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Date publication</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {announcement.title}
                            </div>
                            {announcement.author && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <UserIcon className="mr-1 h-3 w-3" />
                                {announcement.author.firstName}{" "}
                                {announcement.author.lastName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderAudienceBadge(announcement.targetAudience)}
                        </TableCell>
                        <TableCell>
                          {renderPriorityBadge(announcement.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {formatDate(announcement.publishDate)}
                            </div>
                            {announcement.expiryDate && (
                              <div className="text-xs text-muted-foreground">
                                Expire: {formatDate(announcement.expiryDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(announcement.isActive)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewAnnouncement(announcement.id)
                                }
                              >
                                <EyeIcon className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditAnnouncement(announcement.id)
                                }
                              >
                                <EditIcon className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              {announcement.isActive && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeactivateClick(announcement.id)
                                  }
                                >
                                  <BellIcon className="mr-2 h-4 w-4" />
                                  Désactiver
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleDeleteClick(announcement.id)
                                }
                              >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.totalPages} •{" "}
                  {pagination.total} annonce
                  {pagination.total !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm">{pagination.page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de visualisation */}
      {openViewDialog && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedAnnouncement.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Détails complets de l'annonce
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenViewDialog(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm">Public cible</Label>
                  <div className="mt-1">
                    {renderAudienceBadge(selectedAnnouncement.targetAudience)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Priorité</Label>
                  <div className="mt-1">
                    {renderPriorityBadge(selectedAnnouncement.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Date publication</Label>
                  <div className="flex items-center mt-1 text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(selectedAnnouncement.publishDate)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Date expiration</Label>
                  <div className="flex items-center mt-1 text-sm">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {selectedAnnouncement.expiryDate
                      ? formatDate(selectedAnnouncement.expiryDate)
                      : "Pas d'expiration"}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-sm">Contenu</Label>
                <div className="mt-2 p-3 border rounded-md bg-gray-50">
                  <p className="whitespace-pre-wrap text-sm">
                    {selectedAnnouncement.content}
                  </p>
                </div>
              </div>

              {selectedAnnouncement.author && (
                <div className="mb-4">
                  <Label className="text-sm">Auteur</Label>
                  <div className="flex items-center p-3 border rounded-md mt-1">
                    <UserIcon className="mr-3 h-5 w-5" />
                    <div>
                      <div className="font-medium">
                        {selectedAnnouncement.author.firstName}{" "}
                        {selectedAnnouncement.author.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedAnnouncement.author.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Créé le: </span>
                  {formatDate(selectedAnnouncement.createdAt)}
                </div>
                <div>
                  <span className="text-muted-foreground">Modifié le: </span>
                  {formatDate(selectedAnnouncement.updatedAt)}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Statut: </span>
                  {renderStatusBadge(selectedAnnouncement.isActive)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setOpenViewDialog(false)}
                size="sm"
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleEditAnnouncement(selectedAnnouncement.id);
                }}
                size="sm"
              >
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation suppression */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation désactivation */}
      <AlertDialog
        open={openDeactivateDialog}
        onOpenChange={setOpenDeactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver l'annonce</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désactiver cette annonce ? Elle ne sera
              plus visible par les utilisateurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeactivate}>
              Désactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialog */}
      <AnnouncementForm
        open={openFormDialog}
        onClose={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
        }}
      />
    </div>
  );
};

export default AnnouncementManager;
