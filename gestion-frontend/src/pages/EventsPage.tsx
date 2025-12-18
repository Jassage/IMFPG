import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, CalendarIcon, BarChartIcon } from "lucide-react";
import EventManager from "@/components/EventManager";
// import EventDashboard from "@/components/event/EventDashboard";
import EventCalendar from "@/components/event/EventCalendar";
import EventDashboard from "@/components/event/EventDashboard";

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Événements</h1>
          <p className="text-muted-foreground">
            Gérez et visualisez tous les événements de l'établissement
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvel événement
        </Button>
      </div>

      <Separator />

      {/* Onglets */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Gestion
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <EventDashboard />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <EventManager />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <EventCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsPage;
