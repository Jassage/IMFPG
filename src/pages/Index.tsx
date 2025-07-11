
import React, { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
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

type ActiveTab = 'dashboard' | 'students' | 'courses' | 'grades' | 'bulk-grades' | 'retakes' | 'scheduler' | 'users' | 'faculties' | 'guardians';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Charger les données de démonstration
  useDemoData();

  const handleOpenScheduler = (studentId?: string) => {
    setSelectedStudentId(studentId || null);
    setIsSchedulerOpen(true);
  };

  const handleCloseScheduler = () => {
    setIsSchedulerOpen(false);
    setSelectedStudentId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsManager />;
      case 'courses':
        return <CoursesManager />;
      case 'grades':
        return <GradesBulkEditor />;
      case 'retakes':
        return <RetakesManager />;
      case 'users':
        return <UsersManager />;
      case 'faculties':
        return <FacultiesManager />;
      case 'guardians':
        return <GuardiansManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <AppSidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as ActiveTab)} />
      
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              Système de Gestion Universitaire
            </h1>
            <p className="text-sm text-muted-foreground">
              Université Saint Joseph de Pétionville
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">
          {renderContent()}
        </main>
      </SidebarInset>

      {/* Modal components */}
      <RetakeScheduler 
        isOpen={isSchedulerOpen}
        onClose={handleCloseScheduler}
        selectedStudentId={selectedStudentId}
      />
    </>
  );
};

export default Index;
