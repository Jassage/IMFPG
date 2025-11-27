import {
  Home,
  Users,
  BookOpen,
  FileText,
  RotateCcw,
  GraduationCap,
  Building2,
  UserCog,
  DollarSign,
  CreditCard,
  ScrollText,
  UserPlus,
  Settings,
  Shield,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ActiveTab } from "@/types/navigation";

// // Définir le type ActiveTab localement (ou importer depuis un fichier commun)
// type ActiveTab =
//   | "dashboard"
//   | "students"
//   | "enrollments"
//   | "courses"
//   | "professeurs"
//   | "grades"
//   | "bulk-grades"
//   | "users"
//   | "retakes"
//   | "faculties"
//   | "guardians"
//   | "payments"
//   | "expenses"
//   | "analytics"
//   | "student-cards"
//   | "transcripts"
//   | "login"
//   | "settings"
//   | "audit-logs"
//   | "backup"
//   | "fees";

interface AppSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole?: "Admin" | "Professeur" | "Secrétaire" | "Directeur" | "Doyen";
  isDoyen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Accueil", icon: Home },
  { id: "students", label: "Étudiants", icon: Users },
  { id: "enrollments", label: "Immatriculations", icon: UserPlus },
  { id: "courses", label: "Les cours", icon: BookOpen },
  { id: "grades", label: "Notes", icon: FileText },
  { id: "retakes", label: "Catalogues", icon: RotateCcw },
  { id: "professeurs", label: "Professeurs", icon: Users },
  { id: "guardians", label: "Parent", icon: Users },
];

const academicItems = [
  { id: "payments", label: "Paiements", icon: DollarSign },
  { id: "expenses", label: "Dépenses", icon: DollarSign },
  { id: "fees", label: "Frais Scolarite", icon: DollarSign },
];

const documentItems = [
  { id: "student-cards", label: "Cartes Étudiants", icon: CreditCard },
  { id: "transcripts", label: "Bulletins", icon: ScrollText },
];

const adminItems = [
  { id: "users", label: "Utilisateurs", icon: UserCog },
  { id: "faculties", label: "Les Facultés", icon: Building2 },
  { id: "settings", label: "Paramètres", icon: Settings },
  { id: "audit-logs", label: "Journal d'Audit", icon: FileText },
  { id: "backup", label: "Sauvegardes", icon: Shield },
];

export function AppSidebar({
  activeTab,
  onTabChange,
  isMobile = false,
  onClose,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { currentAcademicYear } = useAcademicYearStore();

  const handleMenuClick = (tabId: string) => {
    // Utiliser l'assertion de type pour convertir string en ActiveTab
    onTabChange(tabId as ActiveTab);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Sidebar className={`border-r bg-sidebar ${isMobile ? "border-r-0" : ""}`}>
      <SidebarHeader
        className={`p-4 ujeph-header ${isMobile ? "border-b" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
              <img
                src="/logo.png"
                alt="UJEPH Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col text-white">
                <span className="text-lg font-bold">UJEPH</span>
                <span className="text-xs opacity-90">Université Jerusalem</span>
              </div>
            )}
          </div>

          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Navigation Principale
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={isActive}
                      tooltip={
                        isCollapsed && !isMobile ? item.label : undefined
                      }
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Gestion Académique
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {academicItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={isActive}
                      tooltip={
                        isCollapsed && !isMobile ? item.label : undefined
                      }
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Documents
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {documentItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={isActive}
                      tooltip={
                        isCollapsed && !isMobile ? item.label : undefined
                      }
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {(!isCollapsed || isMobile) && (
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              Administration
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      isActive={isActive}
                      tooltip={
                        isCollapsed && !isMobile ? item.label : undefined
                      }
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {(!isCollapsed || isMobile) && (
        <SidebarFooter className="p-4 bg-sidebar border-t border-sidebar-border">
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
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
