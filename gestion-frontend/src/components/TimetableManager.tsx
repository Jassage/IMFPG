// components/timetable/TimetableManager.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  Filter,
  Plus,
  Download,
  Printer,
  BookOpen,
  Loader2,
} from "lucide-react";
// import { ScheduleManager } from "./ScheduleManager";
// import { TimetableGrid } from "./TimetableGrid";
import { useTimetableStore } from "@/store/timetableStore";
import { useClassStore } from "@/store/classStore";
// import { useTeacherStore } from "@/store/teacherStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProfesseurStore from "@/store/professorStore";
import { TimetableGrid } from "./TimetableGrid";
import { ScheduleManager } from "./ScheduleManager";
import { useAssignmentStore } from "@/store/assignmentStore";

export const TimetableManager: React.FC = () => {
  const { schedules, loading } = useTimetableStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { classes, fetchClasses } = useClassStore();
  const { professeurs, fetchProfesseurs } = useProfesseurStore();

  const [view, setView] = useState<"schedule" | "grid" | "list">("schedule");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [academicYears] = useState([
    { id: "1", year: "2024-2025" },
    { id: "2", year: "2025-2026" },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchAssignments(),
        fetchClasses(),
        fetchProfesseurs(),
      ]);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    }
  };

  const handleExport = () => {
    // Logique d'export PDF/Excel
    toast.success("Emploi du temps exporté");
  };

  const handlePrint = () => {
    window.print();
  };

  const stats = {
    totalSchedules: schedules.length,
    activeClasses: classes.length,
    teachersCount: professeurs.length,
    thisWeek: schedules.filter((s) => s.status === "ACTIVE").length,
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Emplois du Temps
          </h1>
          <p className="text-muted-foreground">
            Gestion des emplois du temps des classes et enseignants
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {/* <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Année académique
              </label>
              <Select value={academicYearId} onValueChange={setAcademicYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Recherche
              </label>
              <Input placeholder="Rechercher un cours..." />
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Cours cette semaine
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.thisWeek}
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-200">
                <Calendar className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Classes</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.activeClasses}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-200">
                <Users className="h-4 w-4 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Enseignants
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.teachersCount}
                </p>
              </div>
              <div className="p-2 rounded-full bg-purple-200">
                <BookOpen className="h-4 w-4 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">
                  Total horaires
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {stats.totalSchedules}
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-200">
                <Clock className="h-4 w-4 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Gestion des horaires
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Calendar className="h-4 w-4 mr-2" />
            Vue grille
          </TabsTrigger>
          <TabsTrigger value="list">
            <Users className="h-4 w-4 mr-2" />
            Par classe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <ScheduleManager
            classId={selectedClass || undefined}
            academicYearId={academicYearId || undefined}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <TimetableGrid />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des classes</CardTitle>
              <CardDescription>
                Sélectionnez une classe pour voir son emploi du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((cls) => (
                    <Card
                      key={cls.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{cls.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Niveau: {cls.level}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {cls.name || "2024-2025"}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedClass(cls.id);
                            setView("schedule");
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Voir l'emploi du temps
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
