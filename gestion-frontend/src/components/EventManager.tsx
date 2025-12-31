import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  format,
  isAfter,
  isBefore,
  startOfToday,
  isToday,
  isValid,
} from "date-fns";
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
  XIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  AlertCircleIcon,
  UsersIcon,
  BuildingIcon,
} from "lucide-react";
import useEventStore from "@/store/eventStore";
import EventForm from "./EventForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les événements au montage
  useEffect(() => {
    const initializeEvents = async () => {
      try {
        await fetchEvents();
        await fetchUpcomingEvents();
        setIsInitialized(true);
      } catch (error) {
        console.error("Erreur initialisation événements:", error);
      }
    };

    initializeEvents();
  }, [fetchEvents, fetchUpcomingEvents]);

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

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  // Gestion des filtres
  const handleFilterChange = useCallback(
    (field: string, value: any) => {
      setFilters({ [field]: value });
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters({ page: newPage });
    },
    [setFilters]
  );

  // Actions
  const handleViewEvent = useCallback(
    async (id: string) => {
      try {
        const event = await fetchEventById(id);
        if (event) {
          setSelectedEvent(event);
          setOpenViewDialog(true);
        } else {
          toast({
            title: "Erreur",
            description: "Événement non trouvé",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Erreur visualisation événement:", error);
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la visualisation",
          variant: "destructive",
        });
      }
    },
    [fetchEventById, toast]
  );

  const handleEditEvent = useCallback(
    async (id: string) => {
      try {
        const event = await fetchEventById(id);
        if (event) {
          setSelectedEvent(event);
          setOpenFormDialog(true);
        } else {
          toast({
            title: "Erreur",
            description: "Événement non trouvé",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Erreur modification événement:", error);
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la modification",
          variant: "destructive",
        });
      }
    },
    [fetchEventById, toast]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      await deleteEvent(selectedId);
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });
      setOpenDeleteDialog(false);
      setSelectedId("");
    } catch (error: any) {
      console.error("Erreur suppression événement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  }, [selectedId, deleteEvent, toast]);

  const handleFormSuccess = useCallback(() => {
    setOpenFormDialog(false);
    setSelectedEvent(null);
    toast({
      title: "Succès",
      description: "Opération effectuée avec succès",
    });
  }, [toast]);

  const closeViewDialog = useCallback(() => {
    setOpenViewDialog(false);
    setSelectedEvent(null);
  }, []);

  // Rendu des badges
  const renderStatusBadge = useCallback((status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "destructive" | "outline" | "secondary";
        label: string;
        icon?: React.ReactNode;
      }
    > = {
      Scheduled: {
        variant: "default",
        label: "Planifié",
        icon: <CalendarIcon className="h-3 w-3 mr-1" />,
      },
      Cancelled: {
        variant: "destructive",
        label: "Annulé",
        icon: <XIcon className="h-3 w-3 mr-1" />,
      },
      Completed: {
        variant: "secondary",
        label: "Terminé",
        icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
      },
      Postponed: {
        variant: "outline",
        label: "Reporté",
        icon: <ClockIcon className="h-3 w-3 mr-1" />,
      },
    };

    const config = statusConfig[status] || {
      variant: "outline" as const,
      label: status,
    };

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.icon}
        {config.label}
      </Badge>
    );
  }, []);

  const renderCategoryBadge = useCallback((category: string) => {
    const categoryColors: Record<string, string> = {
      General: "bg-blue-100 text-blue-800 border-blue-200",
      Academic: "bg-green-100 text-green-800 border-green-200",
      Cultural: "bg-purple-100 text-purple-800 border-purple-200",
      Sports: "bg-orange-100 text-orange-800 border-orange-200",
      Meeting: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const colorClass =
      categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <Badge variant="outline" className={`text-xs ${colorClass}`}>
        {category}
      </Badge>
    );
  }, []);

  const renderPublicBadge = useCallback(
    (isPublic: boolean) => (
      <Badge variant={isPublic ? "default" : "outline"} className="text-xs">
        {isPublic ? (
          <>
            <UsersIcon className="h-3 w-3 mr-1" />
            Public
          </>
        ) : (
          <>
            <BuildingIcon className="h-3 w-3 mr-1" />
            Privé
          </>
        )}
      </Badge>
    ),
    []
  );

  // Événements filtrés
  const filteredEvents = useMemo(() => {
    if (!isInitialized) return [];

    return events.filter((event) => {
      // Recherche
      const matchesSearch = searchTerm
        ? event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filtre catégorie
      const matchesCategory =
        filters.category && filters.category !== "all"
          ? event.category === filters.category
          : true;

      // Filtre statut
      const matchesStatus =
        filters.status && filters.status !== "all"
          ? event.status === filters.status
          : true;

      // Filtre visibilité
      const matchesVisibility =
        filters.isPublic !== undefined
          ? event.isPublic === filters.isPublic
          : true;

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesVisibility
      );
    });
  }, [events, searchTerm, filters, isInitialized]);

  // Événements du jour
  const todayEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event.startDate) return false;
      try {
        const eventDate = new Date(event.startDate);
        return isValid(eventDate) && isToday(eventDate);
      } catch {
        return false;
      }
    });
  }, [events]);

  // Événements à venir
  const upcomingEventsList = useMemo(() => {
    return events
      .filter((event) => {
        if (!event.startDate || !event.status) return false;
        try {
          const eventDate = new Date(event.startDate);
          return (
            isValid(eventDate) &&
            isAfter(eventDate, new Date()) &&
            event.status === "Scheduled"
          );
        } catch {
          return false;
        }
      })
      .slice(0, 10);
  }, [events]);

  // Formatage de date sécurisé
  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return "Date non définie";
    try {
      const date = new Date(dateString);
      return isValid(date)
        ? format(date, "dd/MM/yyyy HH:mm", { locale: fr })
        : "Date invalide";
    } catch {
      return "Date invalide";
    }
  }, []);

  // Formater la durée
  const formatDuration = useCallback(
    (startDate: string | undefined, endDate: string | undefined) => {
      if (!startDate || !endDate) return "-";

      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!isValid(start) || !isValid(end)) return "-";

        const diffHours =
          Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

        if (diffHours < 1) {
          const diffMinutes = diffHours * 60;
          return `${Math.round(diffMinutes)} min`;
        } else if (diffHours < 24) {
          return `${Math.round(diffHours)} h`;
        } else {
          const days = Math.round(diffHours / 24);
          return `${days} jour${days > 1 ? "s" : ""}`;
        }
      } catch {
        return "-";
      }
    },
    []
  );

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = upcomingEventsList.length;
    const today = todayEvents.length;
    const publicEvents = events.filter((e) => e.isPublic).length;
    const scheduled = events.filter((e) => e.status === "Scheduled").length;
    const completed = events.filter((e) => e.status === "Completed").length;
    const cancelled = events.filter((e) => e.status === "Cancelled").length;

    return {
      total,
      upcoming,
      today,
      publicEvents,
      scheduled,
      completed,
      cancelled,
    };
  }, [events, upcomingEventsList, todayEvents]);

  // Squelette de chargement
  if (!isInitialized && loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Événements
          </h1>
          <p className="text-sm text-muted-foreground">
            Organisez et gérez les événements de l'établissement
          </p>
        </div>
        <Button
          onClick={() => setOpenFormDialog(true)}
          size="sm"
          disabled={loading}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvel Événement
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  À venir
                </p>
                <p className="text-2xl font-bold mt-1">{stats.upcoming}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <ClockIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aujourd'hui
                </p>
                <p className="text-2xl font-bold mt-1">{stats.today}</p>
              </div>
              <div className="p-2 rounded-full bg-orange-100">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Publics
                </p>
                <p className="text-2xl font-bold mt-1">{stats.publicEvents}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <UsersIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Titre, description, lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">
                Catégorie
              </Label>
              <Select
                value={filters.category || ""}
                onValueChange={(value) =>
                  handleFilterChange("category", value || undefined)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                value={filters.status || ""}
                onValueChange={(value) =>
                  handleFilterChange("status", value || undefined)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility" className="text-sm">
                Visibilité
              </Label>
              <Select
                value={filters.isPublic?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "isPublic",
                    value === "true"
                      ? true
                      : value === "false"
                      ? false
                      : undefined
                  )
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="true">Publics</SelectItem>
                  <SelectItem value="false">Privés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={resetFilters}
              size="sm"
              disabled={loading}
            >
              <XIcon className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Événements</CardTitle>
              <CardDescription>
                {filteredEvents.length} événement
                {filteredEvents.length !== 1 ? "s" : ""} trouvé
                {filteredEvents.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
              <span className="text-sm text-muted-foreground">
                Page {pagination.page || 1} sur{" "}
                {Math.max(pagination.totalPages || 1, 1)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredEvents.length === 0 && !loading ? (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ||
                filters.category ||
                filters.status ||
                filters.isPublic !== undefined
                  ? "Aucun résultat ne correspond à vos filtres"
                  : "Commencez par créer votre premier événement"}
              </p>
              <Button
                onClick={() => setOpenFormDialog(true)}
                disabled={loading}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Créer un événement
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Événement</TableHead>
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead className="w-[100px]">Catégorie</TableHead>
                      <TableHead className="w-[120px]">Lieu</TableHead>
                      <TableHead className="w-[140px]">Statut</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {event.title || "Sans titre"}
                            </div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {event.description}
                              </div>
                            )}
                            {event.organizer && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <UserIcon className="h-3 w-3 mr-1" />
                                {event.organizer}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {formatDate(event.startDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Durée:{" "}
                              {formatDuration(event.startDate, event.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderCategoryBadge(
                            event.category || "Non catégorisé"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {event.location || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {renderStatusBadge(event.status || "Scheduled")}
                            {renderPublicBadge(event.isPublic || false)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={loading}
                              >
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewEvent(event.id)}
                                disabled={loading}
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditEvent(event.id)}
                                disabled={loading}
                              >
                                <EditIcon className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(event.id)}
                                disabled={loading}
                              >
                                <TrashIcon className="h-4 w-4 mr-2" />
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
              {filteredEvents.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {filteredEvents.length} sur {events.length} événement
                    {filteredEvents.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange((pagination.page || 1) - 1)
                      }
                      disabled={(pagination.page || 1) <= 1 || loading}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm font-medium px-2">
                      {pagination.page || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange((pagination.page || 1) + 1)
                      }
                      disabled={
                        (pagination.page || 1) >=
                          (pagination.totalPages || 1) || loading
                      }
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Événements du jour */}
      {todayEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Événements d'aujourd'hui ({todayEvents.length})
            </CardTitle>
            <CardDescription>
              Événements prévus pour aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {todayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base leading-tight">
                        {event.title || "Sans titre"}
                      </CardTitle>
                      <div className="flex gap-1">
                        {renderStatusBadge(event.status || "Scheduled")}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <ClockIcon className="h-3 w-3" />
                      {formatDate(event.startDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {event.location && (
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-1">
                          {renderCategoryBadge(
                            event.category || "Non catégorisé"
                          )}
                          {renderPublicBadge(event.isPublic || false)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                          disabled={loading}
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={closeViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>
                      {selectedEvent.title || "Sans titre"}
                    </DialogTitle>
                    <DialogDescription>
                      Détails complets de l'événement
                    </DialogDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeViewDialog}>
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date de début</Label>
                    <div className="flex items-center mt-1 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDate(selectedEvent.startDate)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date de fin</Label>
                    <div className="flex items-center mt-1 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDate(selectedEvent.endDate)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Durée</Label>
                    <div className="mt-1 text-sm">
                      {formatDuration(
                        selectedEvent.startDate,
                        selectedEvent.endDate
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Statut</Label>
                    <div className="mt-1">
                      {renderStatusBadge(selectedEvent.status || "Scheduled")}
                    </div>
                  </div>
                  {selectedEvent.location && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">Lieu</Label>
                      <div className="flex items-center mt-1 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEvent.location}
                      </div>
                    </div>
                  )}
                  {selectedEvent.organizer && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">
                        Organisateur
                      </Label>
                      <div className="flex items-center mt-1 text-sm">
                        <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEvent.organizer}
                      </div>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <div className="mt-2 p-3 border rounded-md bg-muted/30 text-sm">
                      {selectedEvent.description}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Catégorie: </span>
                    {renderCategoryBadge(
                      selectedEvent.category || "Non catégorisé"
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Visibilité: </span>
                    {renderPublicBadge(selectedEvent.isPublic || false)}
                  </div>
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

              <DialogFooter>
                <Button variant="outline" onClick={closeViewDialog}>
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    closeViewDialog();
                    handleEditEvent(selectedEvent.id);
                  }}
                >
                  Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation suppression */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action
              est irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? "Suppression..." : "Supprimer définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialog */}
      <EventForm
        open={openFormDialog}
        onClose={() => {
          setOpenFormDialog(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default EventManager;
