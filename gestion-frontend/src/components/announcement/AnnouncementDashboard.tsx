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
  BellIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrendingUpIcon,
  RefreshCwIcon,
  FileIcon,
} from "lucide-react";
import { useAnnouncementStore } from "@/store/announcementStore";

const AnnouncementDashboard: React.FC = () => {
  const {
    announcements,
    activeAnnouncements,
    loading,
    fetchAnnouncements,
    fetchActiveAnnouncements,
  } = useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
    fetchActiveAnnouncements();
  }, []);

  // Statistiques
  const getStats = () => {
    const now = new Date();

    const total = announcements.length;
    const active = announcements.filter((a) => a.isActive).length;
    const inactive = total - active;
    const critical = announcements.filter(
      (a) => a.priority === "Critical"
    ).length;
    const high = announcements.filter((a) => a.priority === "High").length;
    const medium = announcements.filter((a) => a.priority === "Medium").length;
    const low = announcements.filter((a) => a.priority === "Low").length;

    // Annonces expirées
    const expired = announcements.filter(
      (a) => a.expiryDate && new Date(a.expiryDate) < now
    ).length;

    // Annonces d'aujourd'hui
    const today = announcements.filter(
      (a) =>
        format(new Date(a.publishDate), "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd")
    ).length;

    // Répartition par public
    const audiences = announcements.reduce((acc, a) => {
      acc[a.targetAudience] = (acc[a.targetAudience] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      critical,
      high,
      medium,
      low,
      expired,
      today,
      audiences,
    };
  };

  const stats = getStats();

  // Annonces récentes (5 plus récentes)
  const recentAnnouncements = [...announcements]
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, 5);

  if (loading && announcements.length === 0) {
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
            Tableau de bord des Annonces
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble et statistiques des annonces
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchAnnouncements();
            fetchActiveAnnouncements();
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
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Annonces créées</p>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Annonces actives</p>
            <Progress
              value={stats.total ? (stats.active / stats.total) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Annonces critiques</p>
            <Progress
              value={stats.total ? (stats.critical / stats.total) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              Publiées aujourd'hui
            </p>
            <Progress
              value={stats.total ? (stats.today / stats.total) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Vue détaillée */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="recent">Récentes</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Annonces récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Annonces récentes
                </CardTitle>
                <CardDescription>5 annonces les plus récentes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAnnouncements.length === 0 ? (
                  <div className="text-center py-8">
                    <BellIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      Aucune annonce
                    </h3>
                    <p className="text-muted-foreground">
                      Créez votre première annonce
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {announcement.title}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(
                              new Date(announcement.publishDate),
                              "dd/MM/yyyy",
                              { locale: fr }
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                announcement.isActive ? "default" : "outline"
                              }
                            >
                              {announcement.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {announcement.targetAudience}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Annonces actives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Annonces actives
                </CardTitle>
                <CardDescription>
                  Annonces actuellement visibles
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
                      Activez des annonces pour les voir ici
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAnnouncements.slice(0, 5).map((announcement) => (
                      <div
                        key={announcement.id}
                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {announcement.title}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(
                              new Date(announcement.publishDate),
                              "dd/MM/yyyy",
                              { locale: fr }
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderPriorityBadge(announcement.priority)}
                            <Badge variant="outline">
                              {announcement.targetAudience}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Annonces récentes</CardTitle>
              <CardDescription>Toutes les annonces récentes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <BellIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">Aucune annonce</h3>
                  <p className="text-muted-foreground mt-2">
                    Créez votre première annonce pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            {renderPriorityBadge(announcement.priority)}
                            <Badge
                              variant={
                                announcement.isActive ? "default" : "outline"
                              }
                            >
                              {announcement.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Publiée le{" "}
                          {format(
                            new Date(announcement.publishDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: fr }
                          )}
                          {announcement.expiryDate && (
                            <>
                              <ClockIcon className="ml-2 mr-1 h-3 w-3" />
                              Expire le{" "}
                              {format(
                                new Date(announcement.expiryDate),
                                "dd/MM/yyyy HH:mm",
                                { locale: fr }
                              )}
                            </>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm">
                            {announcement.content.length > 200
                              ? `${announcement.content.substring(0, 200)}...`
                              : announcement.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {announcement.targetAudience}
                              </Badge>
                              {announcement.author && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <UserIcon className="mr-1 h-3 w-3" />
                                  {announcement.author.firstName}{" "}
                                  {announcement.author.lastName}
                                </div>
                              )}
                            </div>
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

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Annonces Actives</CardTitle>
              <CardDescription>
                Toutes les annonces actuellement actives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    Aucune annonce active
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Activez des annonces pour les voir ici.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {activeAnnouncements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {announcement.title}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {format(
                            new Date(announcement.publishDate),
                            "dd/MM/yyyy",
                            { locale: fr }
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          {renderPriorityBadge(announcement.priority)}
                          <Badge variant="outline">
                            {announcement.targetAudience}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          {announcement.content.length > 150
                            ? `${announcement.content.substring(0, 150)}...`
                            : announcement.content}
                        </p>
                        {announcement.author && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <UserIcon className="mr-1 h-3 w-3" />
                            {announcement.author.firstName}{" "}
                            {announcement.author.lastName}
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

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par priorité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Critique</span>
                    <span className="text-sm">{stats.critical}</span>
                  </div>
                  <Progress
                    value={
                      stats.total ? (stats.critical / stats.total) * 100 : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Haute</span>
                    <span className="text-sm">{stats.high}</span>
                  </div>
                  <Progress
                    value={stats.total ? (stats.high / stats.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Moyenne</span>
                    <span className="text-sm">{stats.medium}</span>
                  </div>
                  <Progress
                    value={stats.total ? (stats.medium / stats.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Basse</span>
                    <span className="text-sm">{stats.low}</span>
                  </div>
                  <Progress
                    value={stats.total ? (stats.low / stats.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut des annonces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Actives</span>
                    <span className="text-sm">{stats.active}</span>
                  </div>
                  <Progress
                    value={stats.total ? (stats.active / stats.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Inactives</span>
                    <span className="text-sm">{stats.inactive}</span>
                  </div>
                  <Progress
                    value={
                      stats.total ? (stats.inactive / stats.total) * 100 : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Expirées</span>
                    <span className="text-sm">{stats.expired}</span>
                  </div>
                  <Progress
                    value={
                      stats.total ? (stats.expired / stats.total) * 100 : 0
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par public */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par public cible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(stats.audiences).map(([audience, count]) => (
                  <div key={audience} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{audience}</span>
                      <span className="text-sm">{count}</span>
                    </div>
                    <Progress
                      value={stats.total ? (count / stats.total) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Détails des statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Détails statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.active}</div>
                  <div className="text-sm text-muted-foreground">Actives</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.critical}</div>
                  <div className="text-sm text-muted-foreground">Critiques</div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="text-3xl font-bold">{stats.today}</div>
                  <div className="text-sm text-muted-foreground">
                    Aujourd'hui
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper pour rendre les badges de priorité
const renderPriorityBadge = (priority: string) => {
  const priorityConfig: Record<
    string,
    { variant: "default" | "destructive" | "outline" | "secondary" }
  > = {
    Critical: { variant: "destructive" },
    High: { variant: "destructive" },
    Medium: { variant: "default" },
    Low: { variant: "secondary" },
  };

  const config = priorityConfig[priority] || { variant: "outline" as const };
  return <Badge variant={config.variant}>{priority}</Badge>;
};

export default AnnouncementDashboard;
