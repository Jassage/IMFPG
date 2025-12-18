import React, { useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrendingUpIcon,
  RefreshCwIcon,
} from "lucide-react";
import useEventStore from "@/store/eventStore";
// import { useEventStore } from "@/stores/eventStore";

const EventDashboard: React.FC = () => {
  const { events, upcomingEvents, loading, fetchEvents, fetchUpcomingEvents } =
    useEventStore();

  useEffect(() => {
    fetchEvents();
    fetchUpcomingEvents();
  }, []);

  // Statistiques
  const getStats = () => {
    const now = new Date();

    const totalEvents = events.length;
    const upcoming = events.filter(
      (e) => new Date(e.startDate) > now && e.status === "Scheduled"
    ).length;
    const completed = events.filter(
      (e) => new Date(e.endDate) < now && e.status !== "Cancelled"
    ).length;
    const cancelled = events.filter((e) => e.status === "Cancelled").length;
    const inProgress = events.filter(
      (e) =>
        new Date(e.startDate) <= now &&
        new Date(e.endDate) >= now &&
        e.status === "Scheduled"
    ).length;

    const publicEvents = events.filter((e) => e.isPublic).length;
    const privateEvents = totalEvents - publicEvents;

    return {
      totalEvents,
      upcoming,
      completed,
      cancelled,
      inProgress,
      publicEvents,
      privateEvents,
    };
  };

  const stats = getStats();

  // Événements du jour
  const getTodayEvents = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return events
      .filter(
        (event) =>
          format(new Date(event.startDate), "yyyy-MM-dd") === today &&
          event.status === "Scheduled"
      )
      .slice(0, 5);
  };

  const todayEvents = getTodayEvents();

  // Prochains événements (limit 5)
  const nextEvents = upcomingEvents.slice(0, 5);

  if (loading && events.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord des Événements
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble et statistiques des événements
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchEvents();
            fetchUpcomingEvents();
          }}
        >
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Événements créés</p>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À venir</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              Événements planifiés
            </p>
            <Progress
              value={
                stats.totalEvents
                  ? (stats.upcoming / stats.totalEvents) * 100
                  : 0
              }
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Événements terminés</p>
            <Progress
              value={
                stats.totalEvents
                  ? (stats.completed / stats.totalEvents) * 100
                  : 0
              }
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annulés</CardTitle>
            <XCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Événements annulés</p>
            <Progress
              value={
                stats.totalEvents
                  ? (stats.cancelled / stats.totalEvents) * 100
                  : 0
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Vue détaillée */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Événements du jour */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Événements du jour
                </CardTitle>
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
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            {format(new Date(event.startDate), "HH:mm", {
                              locale: fr,
                            })}{" "}
                            -
                            {format(new Date(event.endDate), " HH:mm", {
                              locale: fr,
                            })}
                          </div>
                        </div>
                        <Badge
                          variant={event.isPublic ? "default" : "secondary"}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Événements à venir */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Prochains événements
                </CardTitle>
                <CardDescription>
                  Événements à venir (prochaines 2 semaines)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      Aucun événement à venir
                    </h3>
                    <p className="text-muted-foreground">
                      Planifiez de nouveaux événements
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {nextEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(
                              new Date(event.startDate),
                              "dd/MM/yyyy HH:mm",
                              { locale: fr }
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline">{event.category}</Badge>
                          {event.location && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPinIcon className="mr-1 h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Événements du jour</CardTitle>
              <CardDescription>
                Tous les événements prévus pour aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    Aucun événement aujourd'hui
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Aucun événement n'est prévu pour aujourd'hui.
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
                          {format(new Date(event.startDate), "HH:mm", {
                            locale: fr,
                          })}{" "}
                          -
                          {format(new Date(event.endDate), " HH:mm", {
                            locale: fr,
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="mr-1 h-3 w-3" />
                          {event.location || "Lieu non spécifié"}
                        </div>
                        {event.organizer && (
                          <div className="flex items-center text-sm">
                            <UserIcon className="mr-1 h-3 w-3" />
                            {event.organizer}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={event.isPublic ? "default" : "secondary"}
                          >
                            {event.isPublic ? "Public" : "Privé"}
                          </Badge>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Tous les événements à venir</CardDescription>
            </CardHeader>
            <CardContent>
              {nextEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    Aucun événement à venir
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Planifiez de nouveaux événements pour les voir ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nextEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent"
                    >
                      <div className="space-y-2">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(
                              new Date(event.startDate),
                              "dd/MM/yyyy HH:mm",
                              { locale: fr }
                            )}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPinIcon className="mr-1 h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center">
                              <UserIcon className="mr-1 h-3 w-3" />
                              {event.organizer}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Badge
                          variant={event.isPublic ? "default" : "secondary"}
                        >
                          {event.isPublic ? "Public" : "Privé"}
                        </Badge>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Planifiés</span>
                    <span className="text-sm">{stats.upcoming}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.upcoming / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">En cours</span>
                    <span className="text-sm">{stats.inProgress}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.inProgress / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Terminés</span>
                    <span className="text-sm">{stats.completed}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.completed / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Annulés</span>
                    <span className="text-sm">{stats.cancelled}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.cancelled / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibilité des événements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Événements publics
                    </span>
                    <span className="text-sm">{stats.publicEvents}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.publicEvents / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Événements privés
                    </span>
                    <span className="text-sm">{stats.privateEvents}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalEvents
                        ? (stats.privateEvents / stats.totalEvents) * 100
                        : 0
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détails des statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Détails statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.totalEvents}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.upcoming}</div>
                  <div className="text-sm text-muted-foreground">À venir</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.inProgress}</div>
                  <div className="text-sm text-muted-foreground">En cours</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.completed}</div>
                  <div className="text-sm text-muted-foreground">Terminés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDashboard;
