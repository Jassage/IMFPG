import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
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
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import useEventStore from "@/store/eventStore";

const EventCalendar: React.FC = () => {
  const { events, fetchEvents } = useEventStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Grouper les événements par date
  const eventsByDate: Record<string, any[]> = {};
  events.forEach((event) => {
    const dateKey = format(new Date(event.startDate), "yyyy-MM-dd");
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  // Jours de la semaine
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendrier des Événements</CardTitle>
            <CardDescription>Vue mensuelle des événements</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </div>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Aujourd'hui
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* En-tête des jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate[dateKey] || [];

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[100px] border rounded-md p-2 
                  ${!isSameMonth(day, currentMonth) ? "bg-muted/30" : ""}
                  ${isToday(day) ? "border-primary border-2" : ""}
                  hover:bg-accent cursor-pointer
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`
                    text-sm font-medium
                    ${isToday(day) ? "text-primary" : ""}
                    ${
                      !isSameMonth(day, currentMonth)
                        ? "text-muted-foreground"
                        : ""
                    }
                  `}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>

                {/* Événements du jour */}
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-primary/10 border border-primary/20 truncate"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEvents.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary/10 border border-primary/20" />
            <span>Événement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted/30" />
            <span>Hors mois</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
