// Fichier: src/components/timetable/ClassTimetable.tsx
import React, { useEffect, useState } from "react";
import { useTimetableStore } from "@/store/timetableStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Users, BookOpen, MapPin, Filter } from "lucide-react";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ClassTimetableProps {
  classId: string;
  academicYearId?: string;
}

const DAYS = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
];

const TIME_SLOTS = [
  "08:00-09:30",
  "09:45-11:15",
  "11:30-13:00",
  "14:00-15:30",
  "15:45-17:15",
  "17:30-19:00",
];

export const ClassTimetable: React.FC<ClassTimetableProps> = ({
  classId,
  academicYearId,
}) => {
  const { schedules, fetchClassTimetable, loading } = useTimetableStore();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    academicYearId,
    dayOfWeek: "",
  });

  useEffect(() => {
    fetchClassTimetable(classId, filters);
  }, [classId, filters, fetchClassTimetable]);

  // Grouper les horaires par jour et créneau
  const groupedSchedules = React.useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};

    // Initialiser la structure
    DAYS.forEach((day) => {
      groups[day.value] = {};
      TIME_SLOTS.forEach((slot) => {
        groups[day.value][slot] = [];
      });
    });

    // Remplir avec les horaires
    schedules.forEach((schedule) => {
      const slot = `${schedule.startTime}-${schedule.endTime}`;
      if (groups[schedule.dayOfWeek] && groups[schedule.dayOfWeek][slot]) {
        groups[schedule.dayOfWeek][slot].push(schedule);
      }
    });

    return groups;
  }, [schedules]);

  if (loading) {
    // return <LoadingSpinner />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du temps de la classe
            </CardTitle>
            <CardDescription>
              Visualisez l'emploi du temps complet
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={filters.dayOfWeek}
              onValueChange={(value) =>
                setFilters({ ...filters, dayOfWeek: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrer par jour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les jours</SelectItem>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 p-3 border text-left font-medium bg-muted/50">
                  Créneaux
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.value}
                    className={`p-3 border text-center font-medium cursor-pointer ${
                      selectedDay === day.value
                        ? "bg-primary/10"
                        : "bg-muted/50"
                    }`}
                    onClick={() =>
                      setSelectedDay(
                        selectedDay === day.value ? null : day.value
                      )
                    }
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{day.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="p-3 border text-center font-medium bg-muted/30">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {timeSlot.split("-")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">à</span>
                      <span className="font-medium">
                        {timeSlot.split("-")[1]}
                      </span>
                    </div>
                  </td>
                  {DAYS.map((day) => (
                    <td
                      key={`${day.value}-${timeSlot}`}
                      className="p-2 border min-w-[200px]"
                    >
                      <div className="min-h-[100px]">
                        {groupedSchedules[day.value][timeSlot].map(
                          (schedule) => (
                            <div
                              key={schedule.id}
                              className="mb-2 p-3 bg-card border rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="font-medium text-sm">
                                {schedule.classAssignment?.subject?.name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {schedule.classAssignment?.professeur && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {
                                      schedule.classAssignment.professeur
                                        .firstName
                                    }{" "}
                                    {
                                      schedule.classAssignment.professeur
                                        .lastName
                                    }
                                  </span>
                                )}
                              </div>
                              {schedule.classroom && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {schedule.classroom}
                                </div>
                              )}
                              <Badge variant="outline" className="mt-2 text-xs">
                                {schedule.classAssignment?.subject?.type}
                              </Badge>
                            </div>
                          )
                        )}
                        {groupedSchedules[day.value][timeSlot].length === 0 && (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground italic py-4">
                            Libre
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDay && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Détails du {DAYS.find((d) => d.value === selectedDay)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedules
                  .filter((schedule) => schedule.dayOfWeek === selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {schedule.classAssignment?.subject?.name}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.classAssignment?.professeur && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {
                                schedule.classAssignment.professeur.firstName
                              }{" "}
                              {schedule.classAssignment.professeur.lastName}
                            </div>
                          )}
                          {schedule.classroom && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {schedule.classroom}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {schedule.classAssignment?.subject?.type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
