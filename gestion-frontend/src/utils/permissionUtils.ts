// utils/permissionUtils.ts
import { UserRole, PERMISSIONS } from "@/types/navigation";
import { rolePermissions } from "@/config/roleConfig";

/**
 * Vérifie si un rôle a une permission spécifique
 */
export const roleHasPermission = (
  role: UserRole,
  permission: string
): boolean => {
  // L'admin a toutes les permissions
  if (role === "Admin") {
    return true;
  }

  const permissions = rolePermissions[role] || [];

  // Vérifier si le rôle a l'accès complet
  if (permissions.includes(PERMISSIONS.FULL_ACCESS)) {
    return true;
  }

  return permissions.includes(permission);
};

/**
 * Obtient toutes les permissions d'un rôle
 */
export const getPermissionsForRole = (role: UserRole): string[] => {
  return rolePermissions[role] || [];
};

/**
 * Obtient les permissions de l'utilisateur actuel
 */
export const getUserPermissions = (
  userRole: UserRole,
  customPermissions?: string[]
): string[] => {
  const rolePerms = getPermissionsForRole(userRole);

  // Si l'utilisateur a des permissions personnalisées, les combiner
  if (customPermissions && customPermissions.length > 0) {
    return [...new Set([...rolePerms, ...customPermissions])];
  }

  return rolePerms;
};

/**
 * Vérifie si l'utilisateur a toutes les permissions requises
 */
export const hasAllPermissions = (
  userRole: UserRole,
  requiredPermissions: string[],
  customPermissions?: string[]
): boolean => {
  const userPerms = getUserPermissions(userRole, customPermissions);

  return requiredPermissions.every(
    (perm) =>
      userPerms.includes(perm) || userPerms.includes(PERMISSIONS.FULL_ACCESS)
  );
};

/**
 * Vérifie si l'utilisateur a au moins une des permissions requises
 */
export const hasAnyPermission = (
  userRole: UserRole,
  requiredPermissions: string[],
  customPermissions?: string[]
): boolean => {
  const userPerms = getUserPermissions(userRole, customPermissions);

  return requiredPermissions.some(
    (perm) =>
      userPerms.includes(perm) || userPerms.includes(PERMISSIONS.FULL_ACCESS)
  );
};

/**
 * Filtre les items basés sur les permissions
 */
export const filterByPermissions = <T extends { permission: string }>(
  items: T[],
  userRole: UserRole,
  customPermissions?: string[]
): T[] => {
  return items.filter((item) => roleHasPermission(userRole, item.permission));
};
