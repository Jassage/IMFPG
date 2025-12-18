import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ClassAssignmentManager } from "./ClassAssignmentManager";
import { TimetableManager } from "./TimetableManager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useScheduleStore } from "@/store/scheduleStore";
import { Calendar, BookOpen, Users, Clock, AlertCircle } from "lucide-react";
import ClassAssignmentManager from "./ClassAssignmentManager";

export const TeachingScheduleManager = () => {
  const [activeTab, setActiveTab] = useState("assignments");

  const { assignments, fetchAssignments } = useAssignmentStore();
  const { schedules, fetchSchedules, loadReferenceData } = useScheduleStore();

  // Charger les données au montage
  useEffect(() => {
    fetchAssignments();
    fetchSchedules();
    loadReferenceData();
  }, []);

  const stats = {
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter((a) => a.status === "Active").length,
    totalSchedules: schedules.length,
    todaySchedules: schedules.filter((s) => {
      const today = new Date()
        .toLocaleString("en-US", { weekday: "long" })
        .toUpperCase();
      return s.dayOfWeek === today;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Planification Scolaire</h1>
        <p className="text-muted-foreground">
          Gestion complète des assignations de cours et des emplois du temps
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Assignations actives
                </p>
                <p className="text-2xl font-bold">{stats.activeAssignments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cours planifiés</p>
                <p className="text-2xl font-bold">{stats.totalSchedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Cours aujourd'hui
                </p>
                <p className="text-2xl font-bold">{stats.todaySchedules}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Taux d'occupation
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalAssignments > 0
                    ? `${Math.round(
                        (stats.totalSchedules / (stats.totalAssignments * 5)) *
                          100
                      )}%`
                    : "0%"}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Assignations
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Emploi du temps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <ClassAssignmentManager />
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
          <TimetableManager />
        </TabsContent>
      </Tabs>

      {/* Conseils et alertes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">
                Conseils de planification
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Assignez d'abord les matières aux classes avant de créer
                  l'emploi du temps
                </li>
                <li>
                  • Utilisez la génération automatique pour un premier draft
                  d'emploi du temps
                </li>
                <li>
                  • Vérifiez les conflits avant d'enregistrer un nouveau cours
                </li>
                <li>
                  • Prévoyez des salles disponibles pour chaque créneau horaire
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
