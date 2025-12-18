// components/timetable/TimetableGrid.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { useTimetableStore } from "@/store/timetableStore";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

export const TimetableGrid: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { schedules, loading, getFilteredSchedules } = useTimetableStore();

  const DAYS = [
    { index: 1, name: "Lundi", label: "LUN" },
    { index: 2, name: "Mardi", label: "MAR" },
    { index: 3, name: "Mercredi", label: "MER" },
    { index: 4, name: "Jeudi", label: "JEU" },
    { index: 5, name: "Vendredi", label: "VEN" },
    { index: 6, name: "Samedi", label: "SAM" },
  ];

  const TIME_SLOTS = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });

  const weekDates = DAYS.map((_, index) => {
    const date = addDays(startDate, index);
    return {
      date,
      formatted: format(date, "dd MMM", { locale: fr }),
    };
  });

  const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
  const prevWeek = () => setCurrentWeek(subDays(currentWeek, 7));
  const thisWeek = () => setCurrentWeek(new Date());

  const getSchedulesForDay = (dayIndex: number) => {
    const dayNames = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const dayName = dayNames[dayIndex];
    return getFilteredSchedules().filter(
      (schedule) => schedule.dayOfWeek === dayName
    );
  };

  const getSchedulePosition = (startTime: string, endTime: string) => {
    const startSlot = TIME_SLOTS.indexOf(startTime);
    const endSlot = TIME_SLOTS.indexOf(endTime);

    if (startSlot === -1 || endSlot === -1) return { top: 0, height: 0 };

    const duration = endSlot - startSlot;
    return {
      top: `${startSlot * 40 + 40}px`,
      height: `${duration * 40}px`,
    };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Semaine du {format(startDate, "dd MMMM yyyy", { locale: fr })}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={thisWeek}>
              Cette semaine
            </Button>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">
              Chargement des horaires...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* En-tête */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 border-r font-medium bg-muted/50">
                  Heures
                </div>
                {DAYS.map((day, index) => (
                  <div
                    key={day.index}
                    className={`p-4 text-center border-r cursor-pointer transition-colors ${
                      selectedDay === index ? "bg-primary/10" : "bg-muted/30"
                    }`}
                    onClick={() =>
                      setSelectedDay(selectedDay === index ? null : index)
                    }
                  >
                    <div className="font-semibold">{day.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {weekDates[index]?.formatted}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grille */}
              <div className="relative border-b">
                {/* Créneaux horaires */}
                {TIME_SLOTS.map((time, index) => (
                  <div key={time} className="grid grid-cols-8 border-b h-10">
                    <div className="p-2 border-r text-sm text-muted-foreground bg-muted/30">
                      {time}
                    </div>
                    {DAYS.map((_, dayIndex) => (
                      <div
                        key={`${dayIndex}-${time}`}
                        className={`border-r ${
                          selectedDay === dayIndex ? "bg-primary/5" : ""
                        }`}
                      />
                    ))}
                  </div>
                ))}

                {/* Événements */}
                {DAYS.map((day, dayIndex) => {
                  const daySchedules = getSchedulesForDay(dayIndex);
                  return daySchedules.map((schedule, scheduleIndex) => {
                    const position = getSchedulePosition(
                      schedule.startTime,
                      schedule.endTime
                    );

                    return (
                      <div
                        key={`${dayIndex}-${scheduleIndex}`}
                        className="absolute"
                        style={{
                          left: `${(dayIndex + 1) * (100 / 8)}%`,
                          width: `${100 / 8}%`,
                          ...position,
                        }}
                      >
                        <div className="m-1 h-full">
                          <div className="bg-blue-100 border border-blue-300 rounded p-2 h-full overflow-hidden hover:bg-blue-200 transition-colors">
                            <div className="font-medium text-sm truncate">
                              {schedule.classAssignment?.subject?.name ||
                                "Cours"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            {schedule.classroom && (
                              <div className="text-xs mt-1 truncate">
                                {schedule.classroom}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
