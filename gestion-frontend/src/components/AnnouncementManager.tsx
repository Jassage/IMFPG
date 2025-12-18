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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
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
// import AnnouncementForm from "./AnnouncementForm";

interface AnnouncementManagerProps {
  openFormDialog?: boolean;
  onOpenFormDialogChange?: (open: boolean) => void;
  selectedAnnouncement?: any;
  onSelectedAnnouncementChange?: (announcement: any) => void;
}
const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  openFormDialog: externalOpenFormDialog,
  onOpenFormDialogChange,
  selectedAnnouncement: externalSelectedAnnouncement,
  onSelectedAnnouncementChange,
}) => {
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

  const handleRowsPerPageChange = (value: string) => {
    setFilters({ limit: parseInt(value, 10) });
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la désactivation",
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
      <Badge variant={config.variant}>
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
    return <Badge variant={config.variant}>{audience}</Badge>;
  };

  const renderStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "outline"}>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Annonces
          </h1>
          <p className="text-muted-foreground">
            {announcements.length} annonce
            {announcements.length !== 1 ? "s" : ""} •{" "}
            {activeAnnouncements.length} active
            {activeAnnouncements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setOpenFormDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvelle Annonce
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Annonces créées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Annonces actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.priority === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Annonces critiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiques</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter((a) => a.targetAudience === "All").length}
            </div>
            <p className="text-xs text-muted-foreground">Pour tous</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="high">Prioritaires</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Rechercher..."
                      value={filters.search}
                      onChange={handleSearchChange}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Public cible</Label>
                  <Select
                    value={filters.targetAudience}
                    onValueChange={(value) =>
                      handleFilterChange("targetAudience", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      handleFilterChange("priority", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={filters.isActive?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("isActive", value === "true")
                    }
                  >
                    <SelectTrigger>
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
                <Button variant="outline" onClick={resetFilters}>
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
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Créer une annonce
                  </Button>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Public cible</TableHead>
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
                              <div>{announcement.title}</div>
                              {announcement.author && (
                                <div className="flex items-center text-sm text-muted-foreground">
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
                              <div>{formatDate(announcement.publishDate)}</div>
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
                                <Button variant="ghost" size="sm">
                                  <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} sur {pagination.totalPages} •
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
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annonces Actives</CardTitle>
              <CardDescription>
                Annonces actuellement visibles par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAnnouncements.length === 0 ? (
                <div className="text-center py-8">
                  <BellIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucune annonce active
                  </h3>
                  <p className="text-muted-foreground">
                    Créez ou activez des annonces pour les voir ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAnnouncements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            {renderPriorityBadge(announcement.priority)}
                            {renderAudienceBadge(announcement.targetAudience)}
                          </div>
                        </div>
                        <CardDescription className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Publiée le {formatDate(announcement.publishDate)}
                          {announcement.expiryDate && (
                            <>
                              <ClockIcon className="ml-2 mr-1 h-3 w-3" />
                              Expire le {formatDate(announcement.expiryDate)}
                            </>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm">
                            {announcement.content.length > 150
                              ? `${announcement.content.substring(0, 150)}...`
                              : announcement.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <UserIcon className="mr-1 h-3 w-3" />
                              {announcement.author?.firstName}{" "}
                              {announcement.author?.lastName}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAnnouncement(announcement.id)
                              }
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annonces Prioritaires</CardTitle>
              <CardDescription>
                Annonces avec priorité haute ou critique
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.filter((a) =>
                ["High", "Critical"].includes(a.priority)
              ).length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircleIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucune annonce prioritaire
                  </h3>
                  <p className="text-muted-foreground">
                    Toutes les annonces ont une priorité normale ou basse.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements
                    .filter((a) => ["High", "Critical"].includes(a.priority))
                    .map((announcement) => (
                      <Card
                        key={announcement.id}
                        className={
                          announcement.priority === "Critical"
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              {announcement.title}
                            </CardTitle>
                            <div className="flex gap-2">
                              {renderPriorityBadge(announcement.priority)}
                              {renderAudienceBadge(announcement.targetAudience)}
                            </div>
                          </div>
                          <CardDescription className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {formatDate(announcement.publishDate)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm">{announcement.content}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(announcement.isActive)}
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <UserIcon className="mr-1 h-3 w-3" />
                                  {announcement.author?.firstName}{" "}
                                  {announcement.author?.lastName}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewAnnouncement(announcement.id)
                                }
                              >
                                Détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annonces d'Aujourd'hui</CardTitle>
              <CardDescription>Annonces publiées aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.filter(
                (a) =>
                  format(new Date(a.publishDate), "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd")
              ).length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucune annonce aujourd'hui
                  </h3>
                  <p className="text-muted-foreground">
                    Aucune annonce n'a été publiée aujourd'hui.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements
                    .filter(
                      (a) =>
                        format(new Date(a.publishDate), "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd")
                    )
                    .map((announcement) => (
                      <Card key={announcement.id}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {announcement.title}
                          </CardTitle>
                          <CardDescription className="flex items-center">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            Publiée à{" "}
                            {format(
                              new Date(announcement.publishDate),
                              "HH:mm",
                              { locale: fr }
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              {renderPriorityBadge(announcement.priority)}
                              {renderAudienceBadge(announcement.targetAudience)}
                            </div>
                            <p className="text-sm">
                              {announcement.content.length > 200
                                ? `${announcement.content.substring(0, 200)}...`
                                : announcement.content}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(announcement.isActive)}
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <UserIcon className="mr-1 h-3 w-3" />
                                  {announcement.author?.firstName}{" "}
                                  {announcement.author?.lastName}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewAnnouncement(announcement.id)
                                }
                              >
                                Lire plus
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>Détails complets de l'annonce</DialogDescription>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Public cible</Label>
                  <div>
                    {renderAudienceBadge(selectedAnnouncement.targetAudience)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <div>
                    {renderPriorityBadge(selectedAnnouncement.priority)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date publication</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(selectedAnnouncement.publishDate)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date expiration</Label>
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {selectedAnnouncement.expiryDate
                      ? formatDate(selectedAnnouncement.expiryDate)
                      : "Pas d'expiration"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenu</Label>
                <ScrollArea className="h-[200px] p-3 border rounded-md">
                  <p className="whitespace-pre-wrap">
                    {selectedAnnouncement.content}
                  </p>
                </ScrollArea>
              </div>

              {selectedAnnouncement.author && (
                <div className="space-y-2">
                  <Label>Auteur</Label>
                  <div className="flex items-center p-2 border rounded-md">
                    <UserIcon className="mr-2 h-4 w-4" />
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

              <Separator />

              <div className="space-y-2">
                <Label>Informations système</Label>
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

              {selectedAnnouncement.attachments &&
                selectedAnnouncement.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Pièces jointes</Label>
                    <div className="space-y-2">
                      {selectedAnnouncement.attachments.map(
                        (attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 border rounded-md"
                          >
                            <FileIcon className="mr-2 h-4 w-4" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>
              Fermer
            </Button>
            {selectedAnnouncement && (
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleEditAnnouncement(selectedAnnouncement.id);
                }}
              >
                Modifier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      {/* Announcement Form */}
      <AnnouncementForm
        open={openFormDialog}
        onClose={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
        onSuccess={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
          handleFormSuccess();
        }}
        onCancel={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
        }}
      />
    </div>
  );
};

export default AnnouncementManager;
