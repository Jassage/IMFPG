
import React, { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Bell, Search, Settings, User, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
import { EnrollmentManager } from "../components/students/EnrollmentManager";

type ActiveTab = 'dashboard' | 'students' | 'enrollments' | 'courses' | 'grades' | 'bulk-grades' | 'retakes' | 'scheduler' | 'users' | 'faculties' | 'guardians' | 'schedules' | 'attendance' | 'payments' | 'library' | 'messaging' | 'events' | 'announcements' | 'analytics' | 'scholarships' | 'rooms' | 'student-cards' | 'transcripts';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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
      case 'enrollments':
        return <EnrollmentManager />;
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
        <header className="fixed top-0 right-0 left-0 z-40 flex h-16 shrink-0 items-center gap-4 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          
          <div className="flex flex-col flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              Système de Gestion Universitaire
            </h1>
            <p className="text-sm text-muted-foreground">
              Université Saint Joseph de Pétionville
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des étudiants, cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 pt-20">
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
