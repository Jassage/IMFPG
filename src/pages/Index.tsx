
import React, { useState } from "react";
import { useAcademicStore } from "../store/academicStore";
import { useDemoData } from "../hooks/useDemoData";
import { StudentsManager } from "../components/StudentsManager";
import { CoursesManager } from "../components/CoursesManager";
import { GradesManager } from "../components/GradesManager";
import { GradesBulkEditor } from "../components/grades/GradesBulkEditor";
import { RetakesManager } from "../components/RetakesManager";
import { RetakeScheduler } from "../components/RetakeScheduler";
import { UsersManager } from "../components/UsersManager";
import { FacultiesManager } from "../components/FacultiesManager";
import { GuardiansManager } from "../components/GuardiansManager";
import { Dashboard } from "../components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveTab = 'dashboard' | 'students' | 'courses' | 'grades' | 'bulk-grades' | 'retakes' | 'scheduler' | 'users' | 'faculties' | 'guardians';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Charger les données de démonstration
  useDemoData();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Système de Gestion Universitaire
          </h1>
          <p className="text-muted-foreground mt-2">
            Université Saint Joseph de Pétionville
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)}>
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="courses">UE</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="bulk-grades">Notes en Masse</TabsTrigger>
            <TabsTrigger value="retakes">Rattrapages</TabsTrigger>
            <TabsTrigger value="scheduler">Planification</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="faculties">Facultés</TabsTrigger>
            <TabsTrigger value="guardians">Tuteurs</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="students">
              <StudentsManager />
            </TabsContent>
            
            <TabsContent value="courses">
              <CoursesManager />
            </TabsContent>
            
            <TabsContent value="grades">
              <GradesManager />
            </TabsContent>

            <TabsContent value="bulk-grades">
              <GradesBulkEditor />
            </TabsContent>
            
            <TabsContent value="retakes">
              <RetakesManager />
            </TabsContent>
            
            <TabsContent value="scheduler">
              <RetakeScheduler />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersManager />
            </TabsContent>
            
            <TabsContent value="faculties">
              <FacultiesManager />
            </TabsContent>
            
            <TabsContent value="guardians">
              <GuardiansManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
