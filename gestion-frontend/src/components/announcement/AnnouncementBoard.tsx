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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BellIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  AlertCircleIcon,
  FileIcon,
} from "lucide-react";
import { useAnnouncementStore } from "@/store/announcementStore";

const AnnouncementBoard: React.FC = () => {
  const { activeAnnouncements, loading, fetchActiveAnnouncements } =
    useAnnouncementStore();

  useEffect(() => {
    fetchActiveAnnouncements();
  }, []);

  if (loading && activeAnnouncements.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Grouper par priorité
  const criticalAnnouncements = activeAnnouncements.filter(
    (a) => a.priority === "Critical"
  );
  const highAnnouncements = activeAnnouncements.filter(
    (a) => a.priority === "High"
  );
  const mediumAnnouncements = activeAnnouncements.filter(
    (a) => a.priority === "Medium"
  );
  const lowAnnouncements = activeAnnouncements.filter(
    (a) => a.priority === "Low"
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau d'Affichage
        </h1>
        <p className="text-muted-foreground">
          Toutes les annonces actives visibles par les utilisateurs
        </p>
      </div>

      {/* Annonces critiques */}
      {criticalAnnouncements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-bold text-destructive">
              Annonces Critiques
            </h2>
            <Badge variant="destructive" className="ml-2">
              {criticalAnnouncements.length}
            </Badge>
          </div>
          <div className="grid gap-4">
            {criticalAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-destructive">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {announcement.title}
                    </CardTitle>
                    <Badge variant="destructive">Critique</Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    Publiée le{" "}
                    {format(
                      new Date(announcement.publishDate),
                      "dd/MM/yyyy HH:mm",
                      { locale: fr }
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {announcement.targetAudience}
                        </Badge>
                        {announcement.author && (
                          <div className="flex items-center text-muted-foreground">
                            <UserIcon className="mr-1 h-3 w-3" />
                            {announcement.author.firstName}{" "}
                            {announcement.author.lastName}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <ClockIcon className="mr-1 h-3 w-3" />
                        Dernière mise à jour:{" "}
                        {format(
                          new Date(announcement.updatedAt),
                          "dd/MM/yyyy",
                          { locale: fr }
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Annonces haute priorité */}
      {highAnnouncements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold">Annonces Importantes</h2>
            <Badge variant="outline" className="ml-2 bg-orange-500 text-white">
              {highAnnouncements.length}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {highAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(new Date(announcement.publishDate), "dd/MM/yyyy", {
                      locale: fr,
                    })}
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
                      <Badge variant="outline">
                        {announcement.targetAudience}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Annonces normales */}
      {(mediumAnnouncements.length > 0 || lowAnnouncements.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            <h2 className="text-xl font-bold">Annonces Générales</h2>
            <Badge variant="outline" className="ml-2">
              {mediumAnnouncements.length + lowAnnouncements.length}
            </Badge>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {[...mediumAnnouncements, ...lowAnnouncements].map(
                (announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium">
                          {announcement.title}
                        </CardTitle>
                        <Badge variant="secondary">
                          {announcement.priority}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {format(
                          new Date(announcement.publishDate),
                          "dd/MM/yyyy",
                          { locale: fr }
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm">
                        {announcement.content.length > 100
                          ? `${announcement.content.substring(0, 100)}...`
                          : announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Message si pas d'annonces */}
      {activeAnnouncements.length === 0 && (
        <Card className="text-center py-12">
          <BellIcon className="mx-auto h-16 w-16 text-muted-foreground" />
          <CardHeader>
            <CardTitle>Aucune annonce active</CardTitle>
            <CardDescription>
              Toutes les annonces sont actuellement inactives ou expirées.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default AnnouncementBoard;
