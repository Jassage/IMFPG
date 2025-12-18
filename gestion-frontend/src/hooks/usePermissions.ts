// hooks/usePermissions.ts
import { useAuthStore } from "@/store/authStore";
import { roleConfigurations } from "@/config/roleConfig";
import { ActiveTab, UserRole, PERMISSIONS } from "@/types/navigation";
import { rolePermissions } from "@/config/roleConfig"; // Importez également rolePermissions

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const userRole = user.role as UserRole;

    // 1. L'admin a TOUTES les permissions
    if (userRole === "Admin") {
      return true;
    }

    // 2. Vérifier les permissions spécifiques au rôle depuis roleConfig
    const rolePerms = rolePermissions[userRole] || [];

    // 3. Si le rôle a "full_access", il a toutes les permissions
    if (rolePerms.includes(PERMISSIONS.FULL_ACCESS)) {
      return true;
    }

    // 4. Vérifier si la permission spécifique existe
    return rolePerms.includes(permission);
  };

  const getAccessibleModules = (): ActiveTab[] => {
    if (!user) return ["dashboard"];

    const userRole = user.role as UserRole;
    const config = roleConfigurations[userRole] || roleConfigurations.Admin;

    const allItems = [
      ...config.mainItems,
      ...config.academicItems,
      ...config.documentItems,
      ...config.adminItems,
    ];

    // Filtrer les items pour lesquels l'utilisateur a la permission
    return allItems
      .filter((item) => hasPermission(item.permission))
      .map((item) => item.id as ActiveTab);
  };

  const getRoleConfig = () => {
    if (!user) return roleConfigurations.Admin;
    return (
      roleConfigurations[user.role as UserRole] || roleConfigurations.Admin
    );
  };

  // Nouvelle fonction pour vérifier l'accès à un onglet spécifique
  const canAccessTab = (tabId: ActiveTab): boolean => {
    if (!user) return false;

    const userRole = user.role as UserRole;
    const config = roleConfigurations[userRole] || roleConfigurations.Admin;

    const allItems = [
      ...config.mainItems,
      ...config.academicItems,
      ...config.documentItems,
      ...config.adminItems,
    ];

    const item = allItems.find((item) => item.id === tabId);
    if (!item) return false;

    return hasPermission(item.permission);
  };

  return {
    hasPermission,
    getAccessibleModules,
    getRoleConfig,
    canAccessTab,
  };
};
