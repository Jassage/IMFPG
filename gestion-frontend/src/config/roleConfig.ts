// config/roleConfig.ts
import {
  UserRole,
  ActiveTab,
  RoleNavigationConfig,
  PERMISSIONS,
} from "@/types/navigation";

// Import des icônes Lucide React nécessaires
import {
  Home,
  Users,
  BookOpen,
  FileText,
  UserPlus,
  DollarSign,
  CreditCard,
  ScrollText,
  Settings,
  Building2,
  UserCog,
  RotateCcw,
  CalendarDays,
  ClipboardCheck,
  ChartBar,
  FileBarChart,
  Award,
  UsersRound,
  Briefcase,
  FileCheck,
  Megaphone,
  Bookmark,
  Receipt,
  Wallet,
  FileEdit,
  GraduationCap,
  Database,
  ShieldAlert,
  Building,
} from "lucide-react";

// Mappage des icônes par nom
export const ICONS: Record<string, any> = {
  Home,
  Users,
  BookOpen,
  FileText,
  UserPlus,
  DollarSign,
  CreditCard,
  ScrollText,
  Settings,
  Building2,
  UserCog,
  RotateCcw,
  CalendarDays,
  ClipboardCheck,
  ChartBar,
  FileBarChart,
  Award,
  UsersRound,
  Briefcase,
  FileCheck,
  Megaphone,
  Bookmark,
  Receipt,
  Wallet,
  FileEdit,
  GraduationCap,
  Database,
  ShieldAlert,
  Building,
};

const createNavItem = (
  id: ActiveTab,
  label: string,
  iconName: string,
  permission: string,
  description?: string,
) => ({
  id,
  label,
  icon: ICONS[iconName] || Home,
  permission,
  description,
});

// Configuration simplifiée par rôle pour un système scolaire
export const ROLE_NAVIGATION_CONFIG: Record<UserRole, RoleNavigationConfig> = {
  Admin: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Vue d'ensemble du système",
      ),
      createNavItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS,
        "Gestion des élèves",
      ),
      createNavItem(
        "enrollments",
        "Réinscriptions",
        "UserPlus",
        PERMISSIONS.MANAGE_ENROLLMENTS,
        "Inscriptions et réinscriptions",
      ),
      createNavItem(
        "professeurs",
        "Professeurs",
        "Award",
        PERMISSIONS.VIEW_PROFESSEURS,
        "Gestion du corps professoral",
      ),
    ],
    academicItems: [
      createNavItem(
        "subject",
        "Matières",
        "BookOpen",
        PERMISSIONS.VIEW_SUBJECTS,
        "Gestion des matières",
      ),
      createNavItem(
        "grades",
        "Notes",
        "FileText",
        PERMISSIONS.MANAGE_GRADES,
        "Saisie et gestion des notes",
      ),

      createNavItem(
        "schedule",
        "Emploi du temps",
        "CalendarDays",
        PERMISSIONS.VIEW_SCHEDULE,
        "Planning des cours",
      ),
      createNavItem(
        "class_assignment",
        "Catalogue des Cours",
        "RotateCcw",
        PERMISSIONS.MANAGE_SUBJECTS,
        "Catalogue de cours par classe",
      ),
    ],
    documentItems: [
      createNavItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.GENERATE_TRANSCRIPTS,
        "Édition des bulletins de notes",
      ),
      createNavItem(
        "student-cards",
        "Cartes d'Étudiants",
        "IdCard",
        PERMISSIONS.GENERATE_CARDS,
        "Génération des cartes d'étudiants",
      ),
    ],
    adminItems: [
      createNavItem(
        "users",
        "Utilisateurs",
        "UserCog",
        PERMISSIONS.VIEW_USERS,
        "Gestion des comptes utilisateurs",
      ),
      createNavItem(
        "classes",
        "Classes/Niveaux",
        "Building",
        PERMISSIONS.VIEW_SETTINGS,
        "Gestion des classes et niveaux",
      ),
      createNavItem(
        "fees",
        "Frais scolaires",
        "Wallet",
        PERMISSIONS.MANAGE_FEES,
        "Gestion des frais de scolarité",
      ),
      createNavItem(
        "payments",
        "Paiements",
        "DollarSign",
        PERMISSIONS.VIEW_PAYMENTS,
        "Gestion des paiements",
      ),

      createNavItem(
        "events",
        "Événements",
        "CalendarDays",
        PERMISSIONS.VIEW_EXPENSES,
        "Gestion des événements",
      ),
      createNavItem(
        "announcements",
        "Annonces",
        "Megaphone",
        PERMISSIONS.SEND_ANNOUNCEMENTS,
        "Gestion des annonces",
      ),

      createNavItem(
        "audit-logs",
        "Journal d'audit",
        "ShieldAlert",
        PERMISSIONS.VIEW_AUDIT_LOGS,
        "Traçabilité des actions",
      ),
      createNavItem(
        "settings",
        "Paramètres",
        "Settings",
        PERMISSIONS.MANAGE_SETTINGS,
        "Configuration du système",
      ),
    ],
  },

  Directeur: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Vue d'ensemble du système",
      ),
      createNavItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS,
        "Gestion des élèves",
      ),
      createNavItem(
        "enrollments",
        "Réinscriptions",
        "UserPlus",
        PERMISSIONS.MANAGE_ENROLLMENTS,
        "Inscriptions et réinscriptions",
      ),
      createNavItem(
        "professeurs",
        "Professeurs",
        "Award",
        PERMISSIONS.VIEW_PROFESSEURS,
        "Gestion du corps professoral",
      ),
    ],
    academicItems: [
      createNavItem(
        "subject",
        "Matières",
        "BookOpen",
        PERMISSIONS.MANAGE_SUBJECTS,
        "Gestion des matières",
      ),
      createNavItem(
        "schedule",
        "Emploi du temps",
        "CalendarDays",
        PERMISSIONS.VIEW_SCHEDULE,
        "Planning des cours",
      ),
      createNavItem(
        "class_assignment",
        "Catalogue des Cours",
        "RotateCcw",
        PERMISSIONS.MANAGE_SUBJECTS,
        "Catalogue de cours par classe",
      ),
    ],
    documentItems: [
      createNavItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.GENERATE_REPORTS,
        "Génération de rapports scolaires",
      ),
      createNavItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.GENERATE_TRANSCRIPTS,
        "Édition des bulletins de notes",
      ),
    ],
    adminItems: [
      createNavItem(
        "classes",
        "Classes/Niveaux",
        "Building",
        PERMISSIONS.VIEW_SETTINGS,
        "Gestion des classes et niveaux",
      ),

      createNavItem(
        "events",
        "Événements",
        "CalendarDays",
        PERMISSIONS.VIEW_EXPENSES,
        "Gestion des événements",
      ),
      createNavItem(
        "announcements",
        "Annonces",
        "Megaphone",
        PERMISSIONS.SEND_ANNOUNCEMENTS,
        "Gestion des annonces",
      ),
    ],
  },

  Secretaire: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Vue d'ensemble administrative",
      ),
      createNavItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS,
        "Consultation fiches élèves",
      ),
      createNavItem(
        "enrollments",
        "Inscriptions",
        "UserPlus",
        PERMISSIONS.PROCESS_ENROLLMENTS,
        "Traitement des inscriptions",
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Comptable: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Suivi de mes enfants",
      ),
      createNavItem(
        "grades",
        "Notes enfants",
        "FileText",
        PERMISSIONS.VIEW_CHILDREN_GRADES,
        "Résultats scolaires",
      ),
      createNavItem(
        "attendance",
        "Présences",
        "ClipboardCheck",
        PERMISSIONS.VIEW_CHILDREN_ATTENDANCE,
        "Absences et retards",
      ),
      createNavItem(
        "payments",
        "Paiements",
        "DollarSign",
        PERMISSIONS.VIEW_OWN_PAYMENTS,
        "Historique des frais",
      ),
      createNavItem(
        "schedule",
        "Emploi du temps",
        "CalendarDays",
        PERMISSIONS.VIEW_SCHEDULE,
        "Planning scolaire",
      ),
    ],
    academicItems: [],
    documentItems: [
      createNavItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.VIEW_OWN_GRADES,
        "Télécharger les bulletins",
      ),
    ],
    adminItems: [
      createNavItem(
        "settings",
        "Mon compte",
        "Settings",
        PERMISSIONS.VIEW_SETTINGS,
        "Informations personnelles",
      ),
    ],
  },

  Student: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Vue d'ensemble personnelle",
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Professeur: {
    mainItems: [
      createNavItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD,
        "Vue professeur",
      ),

      createNavItem(
        "grades",
        "Saisie des notes",
        "FileEdit",
        PERMISSIONS.MANAGE_OWN_GRADES,
        "Évaluation des élèves",
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },
};

// Permissions par rôle simplifiées
export const rolePermissions: Record<UserRole, string[]> = {
  Admin: [
    PERMISSIONS.FULL_ACCESS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_ENROLLMENTS,
    PERMISSIONS.MANAGE_ENROLLMENTS,
    PERMISSIONS.VIEW_GUARDIANS,
    PERMISSIONS.MANAGE_GUARDIANS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.VIEW_GRADES,
    PERMISSIONS.MANAGE_GRADES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_PROFESSEURS,
    PERMISSIONS.MANAGE_PROFESSEURS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.GENERATE_CARDS,
    PERMISSIONS.GENERATE_TRANSCRIPTS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_BACKUP,
  ],
  Secretaire: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.PROCESS_ENROLLMENTS,
    PERMISSIONS.VIEW_ENROLLMENTS,
    PERMISSIONS.VIEW_GUARDIANS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.GENERATE_DOCUMENTS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  Comptable: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.VIEW_OWN_PAYMENTS,
  ],
  Student: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_SUBJECTS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.VIEW_OWN_PAYMENTS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  Professeur: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_OWN_SUBJECTS,
    PERMISSIONS.MANAGE_OWN_GRADES,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_STUDENTS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.SEND_ANNOUNCEMENTS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  Directeur: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_PROFESSEURS,
    PERMISSIONS.VIEW_GRADES,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.SEND_ANNOUNCEMENTS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.MANAGE_ENROLLMENTS,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
};

// Helper pour obtenir la configuration d'un rôle
export const getRoleConfig = (role: UserRole): RoleNavigationConfig => {
  return ROLE_NAVIGATION_CONFIG[role] || ROLE_NAVIGATION_CONFIG.Admin;
};

// Helper pour obtenir les permissions d'un rôle
export const getRolePermissions = (role: UserRole): string[] => {
  return rolePermissions[role] || [];
};

// Helper pour vérifier si un rôle a une permission spécifique
export const roleHasPermission = (
  role: UserRole,
  permission: string,
): boolean => {
  const permissions = getRolePermissions(role);
  return (
    permissions.includes(permission) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS)
  );
};

export default ROLE_NAVIGATION_CONFIG;
