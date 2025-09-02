import React, { useState, useEffect, useRef } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Shield,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchResults } from "../components/SearchResults";
import { NotificationPanel } from "../components/NotificationPanel";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { SettingsPage } from "./SettingsPage";

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
import { CourseAssignmentManager } from "@/components/CourseAssignmentManager";
import { ProfesseurManager } from "@/components/ProfesseurManager";
import { LoginPage } from "@/components/login";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

type ActiveTab =
  | "dashboard"
  | "students"
  | "enrollments"
  | "courses"
  | "professeurs"
  | "grades"
  | "bulk-grades"
  | "retakes"
  | "scheduler"
  | "users"
  | "faculties"
  | "guardians"
  | "schedules"
  | "attendance"
  | "payments"
  | "library"
  | "messaging"
  | "events"
  | "announcements"
  | "analytics"
  | "scholarships"
  | "rooms"
  | "student-cards"
  | "transcripts"
  | "login";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuthStore();
  // Les données sont maintenant chargées via useDataSync dans DataContext

  // Gestion des clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gestion du thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab("students");
    toast({
      title: "Étudiant sélectionné",
      description: "Redirection vers la page des étudiants",
    });
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleProfileClick = () => {
    toast({
      title: "Profil",
      description: "Page de profil en développement",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
      variant: "destructive",
    });
  };

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
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentsManager />;
      case "enrollments":
        return <EnrollmentManager />;
      case "courses":
        return <CoursesManager />;
      case "professeurs":
        return <ProfesseurManager />;
      case "grades":
        return <GradesBulkEditor />;
      case "retakes":
        return <CourseAssignmentManager />;
      case "guardians":
        return <GuardiansManager />;
      case "schedules":
        return <ScheduleManager />;
      case "attendance":
        return <AttendanceManager />;
      case "payments":
        return <PaymentManager />;
      case "library":
        return <LibraryManager />;
      case "messaging":
        return <MessagingSystem />;
      case "events":
        return <EventManager />;
      case "announcements":
        return <AnnouncementSystem />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "users":
        return <UsersManager />;
      case "faculties":
        return <FacultiesManager />;
      case "guardians":
        return <GuardiansManager />;
      case "scholarships":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Gestion des Bourses
            </h1>
            <p className="text-muted-foreground">
              Module de gestion des bourses en développement...
            </p>
          </div>
        );
      case "rooms":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Gestion des Salles
            </h1>
            <p className="text-muted-foreground">
              Module de gestion des salles en développement...
            </p>
          </div>
        );
      case "student-cards":
        return <StudentCardGenerator />;
      case "transcripts":
        return <TranscriptGenerator />;
      default:
        return <Dashboard />;
    }
  };

  // Fonction pour obtenir l'icône du rôle
  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="h-3 w-3 text-red-500" />;
      case "professor":
        return <GraduationCap className="h-3 w-3 text-blue-500" />;
      case "student":
        return <BookOpen className="h-3 w-3 text-green-500" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  // Fonction pour obtenir les initiales du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
      />

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header fixe en haut */}
        <header className="flex-shrink-0 z-40 flex h-16 items-center gap-2 md:gap-4 px-3 md:px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
          <SidebarTrigger className="-ml-1" />

          {/* Navigation back button for settings */}
          {location.pathname === "/settings" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          )}

          <div className="flex flex-col flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              {location.pathname === "/settings"
                ? "Paramètres"
                : "Système de Gestion Universitaire"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {location.pathname === "/settings"
                ? "Configuration et préférences"
                : "Université Saint Joseph de Pétionville"}
            </p>
          </div>

          {/* Search Bar - Hide on settings page */}
          {location.pathname !== "/settings" && (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des étudiants, cours..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() =>
                    searchQuery.trim() && setShowSearchResults(true)
                  }
                  className="pl-9"
                />
                {showSearchResults && (
                  <SearchResults
                    query={searchQuery}
                    onClose={() => setShowSearchResults(false)}
                    onSelectStudent={handleSelectStudent}
                  />
                )}
              </div>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
              <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Menu avec informations de l'utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? (
                        getInitials(user.firstName)
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {user && (
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* En-tête avec informations utilisateur */}
                {user && (
                  <>
                    <DropdownMenuLabel className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.firstName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Indicateur de statut de connexion */}
                <div className="px-2 py-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isAuthenticated ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    {isAuthenticated ? "Connecté" : "Non connecté"}
                  </div>
                </div>

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content avec défilement */}
        <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6 w-full">
          {location.pathname === "/settings" ? (
            <SettingsPage />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Modal components */}
      <RetakeScheduler
        isOpen={isSchedulerOpen}
        onClose={handleCloseScheduler}
        selectedStudentId={selectedStudentId}
      />
    </div>
  );
};

export default Index;
