
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
import { ScheduleManager } from "../components/ScheduleManager";
import { AttendanceManager } from "../components/AttendanceManager";
import { PaymentManager } from "../components/PaymentManager";
import { LibraryManager } from "../components/LibraryManager";
import { MessagingSystem } from "../components/MessagingSystem";
import { EventManager } from "../components/EventManager";
import { AnnouncementSystem } from "../components/AnnouncementSystem";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { StudentCardGenerator } from "../components/StudentCardGenerator";
import { TranscriptGenerator } from "../components/TranscriptGenerator";

type ActiveTab = 'dashboard' | 'students' | 'courses' | 'grades' | 'bulk-grades' | 'retakes' | 'scheduler' | 'users' | 'faculties' | 'guardians' | 'schedules' | 'attendance' | 'payments' | 'library' | 'messaging' | 'events' | 'announcements' | 'analytics' | 'scholarships' | 'rooms' | 'student-cards' | 'transcripts';

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
      case 'schedules':
        return <ScheduleManager />;
      case 'attendance':
        return <AttendanceManager />;
      case 'payments':
        return <PaymentManager />;
      case 'library':
        return <LibraryManager />;
      case 'messaging':
        return <MessagingSystem />;
      case 'events':
        return <EventManager />;
      case 'announcements':
        return <AnnouncementSystem />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UsersManager />;
      case 'faculties':
        return <FacultiesManager />;
      case 'guardians':
        return <GuardiansManager />;
      case 'scholarships':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Gestion des Bourses</h1>
            <p className="text-muted-foreground">Module de gestion des bourses en développement...</p>
          </div>
        );
      case 'rooms':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Gestion des Salles</h1>
            <p className="text-muted-foreground">Module de gestion des salles en développement...</p>
          </div>
        );
      case 'student-cards':
        return <StudentCardGenerator />;
      case 'transcripts':
        return <TranscriptGenerator />;
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
