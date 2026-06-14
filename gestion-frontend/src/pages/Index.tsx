import React, { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  BookOpen,
  GraduationCap,
  Shield,
  Mail,
  Info,
  Menu,
  X,
  Home,
  Users,
  DollarSign,
  CreditCard,
  UserCog,
  ScrollText,
  Building2,
  FileText,
  UserPlus,
  RotateCcw,
  Calendar,
  Bookmark,
  ChartBar,
  Megaphone,
  ShieldAlert,
  Key,
  HelpCircle,
  Globe,
  Briefcase,
  FileCheck,
  Award,
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SettingsPage } from "./SettingsPage";
import { UsersManager } from "../components/UsersManager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { FeeStructureManager } from "@/components/FeeStructureManager";
import { AuditLogsManager } from "@/components/AuditLogsManager";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchResults } from "@/components/SearchResults";
import { ActiveTab } from "@/types/navigation";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { RoleBasedDashboard } from "@/components/RoleBasedDashboard";
import { ProfesseursManager } from "@/components/ProfesseurManager";
import { ClassesManager } from "@/components/ClassesManager";
import { SubjectsManager } from "@/components/SubjectsManager";
import roleConfigurations from "@/config/roleConfig";
import EnrollmentManager from "@/components/students/EnrollmentManager";
import { StudentsManager } from "@/components/StudentsManager";
import { SystemBackupManager } from "@/components/SystemBackupManager";
import { GuardiansManager } from "@/components/GuardiansManager";
import ClassAssignmentManager from "@/components/ClassAssignmentManager";
import EventManager from "@/components/EventManager";
import { ClassTimetable } from "@/components/ClassTimetable";
import { PaymentManager } from "@/components/PaymentManager";
import { ScheduleManager } from "@/components/ScheduleManager";
import { TimetableManager } from "@/components/TimetableManager";
import { GradeManager } from "@/components/GradesManager";
import { usePermissions } from "@/hooks/usePermissions";
import BulletinPage from "./BulletinPage";
import PalmaresReport from "@/components/reports/PalmaresReport";
import ProfessorGradeManager from "@/components/ProfessorGradesManager";
import AnnouncementManager from "@/components/AnnouncementManager";

import { NotificationBell } from "@/components/NotificationBell";
import { StudentCardGenerator } from "@/components/StudentCardGenerator";
import { AttendancePage } from "./AttendancePage";
import { ProfessorAttendance } from "@/components/attendance/ProfessorAttendance";

// Types pour les rôles
type UserRole =
  | "Admin"
  | "Secretaire"
  | "Comptable"
  | "Student"
  | "Professeur"
  | "Directeur";

const MobileSidebar = ({
  activeTab,
  onTabChange,
  hasPermission,
  user,
  currentAcademicYear,
}: {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasPermission: (permission: string) => boolean;
  user: any;
  currentAcademicYear: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userRole = user.role as UserRole;
  const config = roleConfigurations[userRole] || roleConfigurations.Admin;

  const renderMenuSection = (
    items: {
      id: ActiveTab | string;
      label: string;
      icon: any;
      permission: string;
    }[],
    title: string,
  ) => {
    const filteredItems = items.filter((item) =>
      hasPermission(item.permission),
    );
    if (filteredItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === (item.id as ActiveTab);

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => {
                  onTabChange(item.id as ActiveTab);
                  setIsOpen(false);
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-sidebar">
          <div className="flex flex-col h-full">
            <div className="p-4 ujeph-header border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
                    <img
                      src="/logo.png"
                      alt="IMFP Logo"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-white">
                    <h3 className="text-lg font-bold">SYSG-IMFP</h3>
                    <span className="text-xs opacity-90">
                      Institution Mixte Faustin 1er
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-sidebar">
              {renderMenuSection(config.mainItems, "Navigation Principale")}
              {renderMenuSection(config.academicItems, "Gestion Académique")}
              {renderMenuSection(config.documentItems, "Documents")}
              {renderMenuSection(config.adminItems, "Administration")}
            </div>

            <div className="p-4 border-t border-sidebar-border bg-sidebar">
              <div className="text-xs text-sidebar-foreground/70">
                <div className="font-medium mb-1">Année Académique</div>
                <div>
                  {currentAcademicYear ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      {currentAcademicYear.year}
                    </Badge>
                  ) : (
                    <span className="text-sidebar-foreground/50 text-xs">
                      Non définie
                    </span>
                  )}
                </div>
                {user && (
                  <div className="mt-2 text-xs text-sidebar-foreground/70">
                    Connecté en tant que:{" "}
                    <span className="capitalize">{user.role}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { hasPermission, canAccessTab } = usePermissions();
  const { currentAcademicYear } = useAcademicYearStore();

  // Gestion du thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Gestion des clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer la recherche
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }

      // Fermer le menu utilisateur mobile
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSelectStudent = (studentId: string) => {
    if (!hasPermission("view_students")) {
      toast({
        title: "Accès non autorisé",
        description: "Vous n'avez pas les permissions pour accéder aux Eleves",
        variant: "destructive",
      });
      return;
    }

    setActiveTab("students");
    toast({
      title: "Redirection",
      description: "Navigation vers la section Eleves",
    });
  };

  const handleSettingsClick = () => {
    setActiveTab("settings");
    setShowMobileUserMenu(false);
  };

  const handleProfileClick = () => {
    toast({
      title: "Profil",
      description: "Page de profil en développement",
    });
    setShowMobileUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/login");
    setShowMobileUserMenu(false);
  };

  const isTabAccessible = (tab: ActiveTab): boolean => {
    if (user?.role === "Admin") {
      return true;
    }
    return canAccessTab(tab);
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (!isTabAccessible(tab)) {
      toast({
        title: "Accès non autorisé",
        description:
          "Vous n'avez pas les permissions pour accéder à cette section",
        variant: "destructive",
      });
      return;
    }

    setActiveTab(tab);
  };

  const renderContent = () => {
    if (!isTabAccessible(activeTab)) {
      return <UnauthorizedView />;
    }

    if (!user) {
      return <UnauthorizedView />;
    }
    const tabComponents: Partial<Record<ActiveTab, React.ReactNode>> = {
      dashboard: <RoleBasedDashboard role={user.role as UserRole} />,
      students: <StudentsManager />,
      subject: <SubjectsManager />,
      grades:
        user?.role === "Professeur" ? (
          <ProfessorGradeManager />
        ) : (
          <GradeManager />
        ),
      professeurs: <ProfesseursManager />,
      guardians: <GuardiansManager />,
      enrollments: <EnrollmentManager />,
      users: <UsersManager />,
      classes: <ClassesManager />,
      fees: <FeeStructureManager />,
      payments: <PaymentManager />,
      settings: <SettingsPage />,
      "audit-logs": <AuditLogsManager />,
      announcements: <AnnouncementManager />,
      events: <EventManager />,
      schedule: <ScheduleManager />,
      transcripts: <BulletinPage />,
      reports: <PalmaresReport />,
      class_assignment: <ClassAssignmentManager />,
      "student-cards": <StudentCardGenerator />,
      attendance:
        user?.role === "Professeur" ? (
          <ProfessorAttendance />
        ) : (
          <AttendancePage />
        ),
    };

    const component = tabComponents[activeTab];
    if (component) {
      return component;
    }

    return <RoleBasedDashboard role={user.role as UserRole} />;
  };

  const UnauthorizedView = () => (
    <div className="p-4 md:p-6">
      <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold text-destructive mb-2">
            Accès non autorisé
          </h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            section.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "directeur":
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case "professeur":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "secretaire":
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case "parent":
        return <Users className="h-4 w-4 text-orange-500" />;
      case "student":
        return <GraduationCap className="h-4 w-4 text-indigo-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  // Menu utilisateur mobile SIMPLE - Version manuelle sans Sheet/Dropdown
  const MobileUserMenu = () => (
    <div className="relative" ref={mobileMenuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
      >
        <User className="h-5 w-5" />
      </Button>

      {showMobileUserMenu && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-background border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? (
                    getInitials(user.firstName)
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                  {getRoleIcon(user?.role)}
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-1">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4" />
              Mon Profil
            </button>

            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </button>

            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setShowMobileUserMenu(false);
              }}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {isDarkMode ? "Mode clair" : "Mode sombre"}
            </button>
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  isAuthenticated ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              {isAuthenticated ? "Connecté" : "Non connecté"}
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const getCurrentConfig = () => {
    if (!user) return roleConfigurations.Admin;
    return (
      roleConfigurations[user.role as UserRole] || roleConfigurations.Admin
    );
  };

  const config = getCurrentConfig();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground w-full">
      {/* Sidebar pour desktop */}
      <div className="hidden md:block">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          config={config}
          hasPermission={hasPermission}
          user={user}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        {/* Header responsive */}
        <header className="flex-shrink-0 z-40 flex h-16 items-center gap-2 md:gap-4 px-3 md:px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 hidden md:flex" />
            <MobileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              hasPermission={hasPermission}
              user={user}
              currentAcademicYear={currentAcademicYear}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {activeTab === "settings"
                ? "Paramètres"
                : `${user?.role} Dashboard - ${user?.firstName} ${user?.lastName}`}
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              {activeTab === "settings"
                ? "Configuration et préférences"
                : "Institution Mixte Faustin 1er - Année Académique"}
            </p>
          </div>

          {user.role === "Admin" && <NotificationBell />}
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
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
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
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

                <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span>{isDarkMode ? "Mode clair" : "Mode sombre"}</span>
                </DropdownMenuItem>

                {/* Paramètres */}

                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="h-4 w-4" />
                  <span className="ml-2">Paramètres</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

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

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-1">
            <MobileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              hasPermission={hasPermission}
              user={user}
              currentAcademicYear={currentAcademicYear}
            />
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

            {/* Menu utilisateur mobile simplifié */}
            <MobileUserMenu />
          </div>
        </header>

        {activeTab !== "settings" && hasPermission("use_search") && (
          <div className="sm:hidden p-2 border-b bg-background/80">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                className="pl-9 bg-background border-input"
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

        <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6 w-full bg-background">
          {renderContent()}
          {/* <PendingGradesAlert /> */}
        </main>
      </div>
    </div>
  );
};

export default Index;
