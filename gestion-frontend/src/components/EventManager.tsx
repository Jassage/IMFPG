import React, { useEffect, useState } from "react";
import { format, isAfter, isBefore, startOfToday } from "date-fns";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
} from "lucide-react";
import useEventStore from "@/store/eventStore";
import EventForm from "./EventForm";

const EventManager: React.FC = () => {
  const {
    events,
    loading,
    error,
    filters,
    pagination,
    eventCategories,
    eventStatuses,
    upcomingEvents,
    fetchEvents,
    fetchEventById,
    fetchUpcomingEvents,
    deleteEvent,
    setFilters,
    resetFilters,
    clearError,
  } = useEventStore();

  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  // Charger les événements au montage
  useEffect(() => {
    fetchEvents();
    fetchUpcomingEvents();
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
  const handleViewEvent = async (id: string) => {
    try {
      const event = await fetchEventById(id);
      setSelectedEvent(event);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error viewing event:", error);
    }
  };

  const handleEditEvent = async (id: string) => {
    console.log(id);

    try {
      const event = await fetchEventById(id);
      setSelectedEvent(event);
      setOpenFormDialog(true);
    } catch (error) {
      console.error("Error editing event:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent(selectedId);
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
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

  const handleFormSuccess = () => {
    setOpenFormDialog(false);
    setSelectedEvent(null);
    toast({
      title: "Succès",
      description: "Opération effectuée avec succès",
    });
  };

  // Rendu des badges
  const renderStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "destructive" | "outline" | "secondary";
        label: string;
      }
    > = {
      Scheduled: { variant: "default", label: "Planifié" },
      Cancelled: { variant: "destructive", label: "Annulé" },
      Completed: { variant: "secondary", label: "Terminé" },
      Postponed: { variant: "outline", label: "Reporté" },
    };

    const config = statusConfig[status] || {
      variant: "outline" as const,
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderCategoryBadge = (category: string) => {
    return <Badge variant="outline">{category}</Badge>;
  };

  const renderPublicBadge = (isPublic: boolean) => (
    <Badge variant={isPublic ? "default" : "secondary"}>
      {isPublic ? "Public" : "Privé"}
    </Badge>
  );

  // Vérifier si un événement est à venir
  const isUpcoming = (eventDate: string) => {
    return isAfter(new Date(eventDate), new Date());
  };

  // Formatage de date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Formater la durée
  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours =
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMinutes = diffHours * 60;
      return `${Math.round(diffMinutes)} min`;
    } else if (diffHours < 24) {
      return `${Math.round(diffHours)} h`;
    } else {
      return `${Math.round(diffHours / 24)} jours`;
    }
  };

  // Événements du jour
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const today = startOfToday();
    return (
      eventDate >= today &&
      eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );
  });

  if (loading && events.length === 0) {
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
            Gestion des Événements
          </h1>
          <p className="text-muted-foreground">
            {events.length} événement{events.length !== 1 ? "s" : ""} •{" "}
            {upcomingEvents.length} à venir
          </p>
        </div>
        <Button onClick={() => setOpenFormDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvel Événement
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Événements créés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À venir</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Événements planifiés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">Événements du jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publics</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.isPublic).length}
            </div>
            <p className="text-xs text-muted-foreground">Événements publics</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
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
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "category",
                        value === "all" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {eventCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "category",
                        value === "all" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {eventStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibilité</Label>
                  <Select
                    value={filters.isPublic?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange("isPublic", value === "true")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="true">Publics</SelectItem>
                      <SelectItem value="false">Privés</SelectItem>
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

          {/* Table des événements */}
          <Card>
            <CardHeader>
              <CardTitle>Tous les événements</CardTitle>
              <CardDescription>
                Liste complète des événements avec filtres et pagination
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucun événement
                  </h3>
                  <p className="text-muted-foreground">
                    Commencez par créer un nouvel événement.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setOpenFormDialog(true)}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Créer un événement
                  </Button>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <div className="space-y-1">
                              <div>{event.title}</div>
                              {event.organizer && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <UserIcon className="mr-1 h-3 w-3" />
                                  {event.organizer}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{formatDate(event.startDate)}</div>
                              <div className="text-sm text-muted-foreground">
                                Durée:{" "}
                                {formatDuration(event.startDate, event.endDate)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderCategoryBadge(event.category)}
                          </TableCell>
                          <TableCell>
                            {event.location ? (
                              <div className="flex items-center">
                                <MapPinIcon className="mr-1 h-3 w-3" />
                                {event.location}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {renderStatusBadge(event.status)}
                              {renderPublicBadge(event.isPublic)}
                            </div>
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
                                  onClick={() => handleViewEvent(event.id)}
                                >
                                  <EyeIcon className="mr-2 h-4 w-4" />
                                  Voir
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditEvent(event.id)}
                                >
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteClick(event.id)}
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
                      {pagination.total} événement
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

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements du jour</CardTitle>
              <CardDescription>
                Événements prévus pour aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucun événement aujourd'hui
                  </h3>
                  <p className="text-muted-foreground">
                    Profitez de votre journée !
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {todayEvents.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {formatDate(event.startDate)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="mr-1 h-3 w-3" />
                            {event.location || "Lieu non spécifié"}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {renderCategoryBadge(event.category)}
                            {renderPublicBadge(event.isPublic)}
                          </div>
                          <div className="flex justify-between pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEvent(event.id)}
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

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Prochains événements planifiés</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Aucun événement à venir
                  </h3>
                  <p className="text-muted-foreground">
                    Planifiez de nouveaux événements pour les voir ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {formatDate(event.startDate)}
                          {event.location && (
                            <>
                              <MapPinIcon className="ml-2 mr-1 h-3 w-3" />
                              {event.location}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col gap-1">
                          {renderStatusBadge(event.status)}
                          {renderPublicBadge(event.isPublic)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
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
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Détails complets de l'événement
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(selectedEvent.startDate)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(selectedEvent.endDate)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <div>{renderCategoryBadge(selectedEvent.category)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Durée</Label>
                  <div>
                    {formatDuration(
                      selectedEvent.startDate,
                      selectedEvent.endDate
                    )}
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="space-y-2 col-span-2">
                    <Label>Lieu</Label>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      {selectedEvent.location}
                    </div>
                  </div>
                )}
                {selectedEvent.organizer && (
                  <div className="space-y-2 col-span-2">
                    <Label>Organisateur</Label>
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {selectedEvent.organizer}
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="p-3 border rounded-md bg-muted/50">
                    {selectedEvent.description}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Informations système</Label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Créé le: </span>
                    {formatDate(selectedEvent.createdAt)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modifié le: </span>
                    {formatDate(selectedEvent.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>
              Fermer
            </Button>
            {selectedEvent && (
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleEditEvent(selectedEvent.id);
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
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action
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

      {/* Form Dialog */}
      {openFormDialog && (
        <EventForm
          open={openFormDialog}
          onClose={() => {
            setOpenFormDialog(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default EventManager;
