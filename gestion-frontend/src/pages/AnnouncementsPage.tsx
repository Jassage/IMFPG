import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, BellIcon, BarChartIcon, ListIcon } from "lucide-react";
import AnnouncementDashboard from "@/components/announcement/AnnouncementDashboard";
import AnnouncementManager from "@/components/AnnouncementManager";
import AnnouncementBoard from "@/components/announcement/AnnouncementBoard";
import AnnouncementForm from "@/components/announcement/AnnouncementForm";

const AnnouncementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annonces</h1>
          <p className="text-muted-foreground">
            Gérez et diffusez les annonces de l'établissement
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenFormDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle Annonce
          </Button>
        </div>
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
            <ListIcon className="h-4 w-4" />
            Gestion
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            Tableau d'affichage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <AnnouncementDashboard />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <AnnouncementManager
            // Passez les props au gestionnaire
            openFormDialog={openFormDialog}
            onOpenFormDialogChange={setOpenFormDialog}
            selectedAnnouncement={selectedAnnouncement}
            onSelectedAnnouncementChange={setSelectedAnnouncement}
          />
        </TabsContent>

        <TabsContent value="board" className="space-y-4">
          <AnnouncementBoard />
        </TabsContent>
      </Tabs>

      {/* Form Dialog - À la racine */}
      <AnnouncementForm
        open={openFormDialog}
        onClose={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
        onSuccess={() => {
          setOpenFormDialog(false);
          setSelectedAnnouncement(null);
          // Rafraîchir les données si nécessaire
        }}
      />
    </div>
  );
};

export default AnnouncementsPage;
