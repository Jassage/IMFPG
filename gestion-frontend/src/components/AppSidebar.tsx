import {
  X,
  Award,
  Briefcase,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  CreditCard as CreditCardIcon,
  UsersRound,
  UserCircle,
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
import { ActiveTab, UserRole } from "@/types/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import roleConfigurations from "@/config/roleConfig";

// Configuration des menus par rôle

interface AppSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  config?: any;
  hasPermission?: (permission: string) => boolean;
  user?: any;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  config,
  hasPermission: externalHasPermission,
  user,
  isMobile = false,
  onClose,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { currentAcademicYear } = useAcademicYearStore();
  const { user: authUser } = useAuthStore();
  const { hasPermission: internalHasPermission } = usePermissions();

  const currentUser = user || authUser;
  const hasPermission = externalHasPermission || internalHasPermission;

  // Déterminer la configuration basée sur le rôle
  const getConfig = () => {
    if (config) return config;

    if (!currentUser) return roleConfigurations.Admin;

    const role = currentUser.role as UserRole;
    return roleConfigurations[role] || roleConfigurations.Admin;
  };

  const currentConfig = getConfig();
  const userRole = (currentUser?.role as UserRole) || "Admin";

  const handleMenuClick = (tabId: string) => {
    onTabChange(tabId as ActiveTab);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Rendu d'une section de menu
  const renderMenuSection = (
    items: {
      id: ActiveTab;
      label: string;
      icon: any;
      permission: string;
      description?: string;
    }[],
    title: string
  ) => {
    const filteredItems = items.filter((item) => {
      // Pour admin, toujours montrer les items (a toutes les permissions)
      if (userRole === "Admin") {
        return true;
      }
      return hasPermission(item.permission);
    });
    if (filteredItems.length === 0) return null;

    return (
      <SidebarGroup>
        {(!isCollapsed || isMobile) && (
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {title}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const hasAccess = hasPermission(item.permission);

              if (!hasAccess) return null;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    data-testid={item.id}
                    data-tab={item.id}
                    isActive={isActive}
                    tooltip={
                      isCollapsed && !isMobile
                        ? `${item.label}${
                            item.description ? ` - ${item.description}` : ""
                          }`
                        : undefined
                    }
                    className={cn(
                      "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      !hasAccess && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!hasAccess}
                  >
                    <Icon className="h-4 w-4" />
                    {(!isCollapsed || isMobile) && (
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium">{item.label}</span>
                        {/* {item.description && !isCollapsed && (
                          <span className="text-xs text-sidebar-foreground/60 truncate">
                            {item.description}
                          </span>
                        )} */}
                      </div>
                    )}
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
    );
  };

  // Rendu des actions rapides
  // const renderQuickActions = () => {
  //   if (!currentConfig.quickActions || currentConfig.quickActions.length === 0)
  //     return null;
  //   if (isCollapsed && !isMobile) return null;

  //   return (
  //     <SidebarGroup>
  //       <SidebarGroupContent>
  //         <div className="p-2">
  //           <div className="text-xs font-medium text-sidebar-foreground/70 mb-2">
  //             Actions Rapides
  //           </div>
  //           <div className="flex flex-wrap gap-1">
  //             {currentConfig.quickActions.map((action: any) => (
  //               <Button
  //                 key={action.id}
  //                 size="sm"
  //                 variant="outline"
  //                 className="h-auto py-1 px-2 text-xs"
  //                 onClick={action.action}
  //               >
  //                 <action.icon className="h-3 w-3 mr-1" />
  //                 {action.label}
  //               </Button>
  //             ))}
  //           </div>
  //         </div>
  //       </SidebarGroupContent>
  //     </SidebarGroup>
  //   );
  // };

  // Obtenir l'icône de rôle
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return <ShieldCheck className="h-3 w-3 text-red-500" />;
      case "Directeur":
        return <GraduationCap className="h-3 w-3 text-purple-500" />;
      case "Professeur":
        return <Award className="h-3 w-3 text-blue-500" />;
      case "Secretaire":
        return <Briefcase className="h-3 w-3 text-green-500" />;
      case "Parent":
        return <UsersRound className="h-3 w-3 text-orange-500" />;
      case "Student":
        return <GraduationCap className="h-3 w-3 text-indigo-500" />;
      default:
        return <UserCircle className="h-3 w-3" />;
    }
  };

  // Rendu de l'indicateur de rôle
  const renderRoleIndicator = () => {
    if (isCollapsed && !isMobile) return null;

    return (
      <div className="flex items-center gap-2 px-2 py-1 mb-2 text-xs text-sidebar-foreground/70">
        {getRoleIcon(userRole)}
        <span className="font-medium capitalize">{userRole}</span>
        {currentUser?.facultyName && (
          <Badge variant="outline" className="ml-auto text-xs">
            {currentUser.facultyName}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Sidebar
      className={cn(
        "border-r bg-sidebar",
        isMobile && "border-r-0",
        "transition-all duration-300"
      )}
    >
      <SidebarHeader className={cn("p-4 ujeph-header", isMobile && "border-b")}>
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
                <span className="text-lg font-bold">IMFP</span>
                <span className="text-xs opacity-90">
                  Institution Mixte Faustin 1er
                </span>
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

        {/* {(!isCollapsed || isMobile) && renderRoleIndicator()} */}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar overflow-y-auto">
        {/* Actions rapides (uniquement sur desktop développé) */}
        {/* {(!isCollapsed || isMobile) && renderQuickActions()} */}

        {/* Navigation Principale */}
        {renderMenuSection(currentConfig.mainItems, "Navigation Principale")}

        {/* Gestion Académique */}
        {renderMenuSection(currentConfig.academicItems, "Gestion Académique")}

        {/* Documents */}
        {renderMenuSection(currentConfig.documentItems, "Documents")}

        {/* Administration */}
        {renderMenuSection(currentConfig.adminItems, "Administration")}

        {/* Section d'aide pour les petits écrans */}
        {isMobile && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sidebar-foreground/70"
                  onClick={() => {}}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Aide & Support
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {(!isCollapsed || isMobile) && (
        <SidebarFooter className="p-3 bg-sidebar border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70">
            <div className="font-medium mb-1 flex items-center justify-between">
              <span>Année Académique</span>
              <Badge
                variant="secondary"
                className={cn(
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs",
                  !currentAcademicYear &&
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                )}
              >
                {currentAcademicYear ? currentAcademicYear.year : "Non définie"}
              </Badge>
            </div>
            {currentAcademicYear && (
              <div className="mt-1 text-xs text-sidebar-foreground/50">
                {currentAcademicYear.isCurrent ? "En cours" : "Clôturée"}
              </div>
            )}

            {/* Indicateur de statut */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sidebar-foreground/60">
                Système en ligne
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
