// Types de rôles utilisateur
export type UserRole =
  | "Admin"
  | "Secretaire"
  | "Comptable"
  | "Student"
  | "Professeur"
  | "Directeur";

// Onglets essentiels pour un système scolaire
export type ActiveTab =
  // Tableau de bord
  | "dashboard"

  // Gestion des élèves
  | "students"
  | "enrollments"
  | "guardians"

  // Académique
  | "subject"
  | "grades"
  | "class_assignment"
  | "attendance"
  | "schedule"

  // Corps professoral
  | "professeurs"

  // Financier
  | "payments"
  | "expenses"
  | "fees"

  // Documents
  | "student-cards"
  | "transcripts"
  | "reports"

  // Administration
  | "users"
  | "classes"
  | "settings"
  | "audit-logs"
  | "backup"

  // Analytics
  | "analytics"

  // Communication
  | "announcements"
  | "events"

  // Pages d'authentification
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"

  // Pages publiques
  | "home"

  // Pages d'erreur
  | "404"
  | "500"
  | "unauthorized"
  | "maintenance";

// Interface pour les items de navigation
export interface NavigationItem {
  id: ActiveTab;
  label: string;
  icon: string;
  description?: string;
  permission: string;
  children?: NavigationItem[];
  badge?: {
    count: number;
    variant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "success"
      | "warning";
  };
}

// Interface pour la configuration de navigation par rôle
export interface RoleNavigationConfig {
  mainItems: NavigationItem[];
  academicItems: NavigationItem[];
  documentItems: NavigationItem[];
  adminItems: NavigationItem[];
}

// Interface pour les breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Constantes pour les permissions
export const PERMISSIONS = {
  // Vue générale
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_ANALYTICS: "view_analytics",

  // Élèves
  VIEW_STUDENTS: "view_students",
  MANAGE_STUDENTS: "manage_students",
  VIEW_ENROLLMENTS: "view_enrollments",
  MANAGE_ENROLLMENTS: "manage_enrollments",
  VIEW_GUARDIANS: "view_guardians",
  MANAGE_GUARDIANS: "manage_guardians",

  // Académique
  VIEW_SUBJECTS: "view_subjects",
  MANAGE_SUBJECTS: "manage_subjects",
  VIEW_OWN_SUBJECTS: "view_own_subjects",
  VIEW_GRADES: "view_grades",
  MANAGE_GRADES: "manage_grades",
  VIEW_ATTENDANCE: "view_attendance",
  MANAGE_ATTENDANCE: "manage_attendance",
  VIEW_SCHEDULE: "view_schedule",

  // Professeurs
  VIEW_PROFESSEURS: "view_professeurs",
  MANAGE_PROFESSEURS: "manage_professeurs",

  // Financier
  VIEW_PAYMENTS: "view_payments",
  VIEW_EXPENSES: "view_expenses",
  VIEW_FEES: "view_fees",
  MANAGE_FEES: "manage_fees",

  // Documents
  GENERATE_CARDS: "generate_cards",
  GENERATE_TRANSCRIPTS: "generate_transcripts",
  GENERATE_REPORTS: "generate_reports",

  // Administration
  VIEW_USERS: "view_users",
  MANAGE_USERS: "manage_users",
  VIEW_SETTINGS: "view_settings",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_BACKUP: "manage_backup",

  // Communication
  SEND_ANNOUNCEMENTS: "send_announcements",

  // Permissions spécifiques par rôle
  // Admin
  FULL_ACCESS: "full_access",

  // Professeur
  MANAGE_OWN_GRADES: "manage_own_grades",
  VIEW_OWN_STUDENTS: "view_own_students",

  // Élève
  VIEW_OWN_GRADES: "view_own_grades",
  VIEW_OWN_ATTENDANCE: "view_own_attendance",
  VIEW_OWN_PAYMENTS: "view_own_payments",

  // Parent
  VIEW_CHILDREN_GRADES: "view_children_grades",
  VIEW_CHILDREN_ATTENDANCE: "view_children_attendance",

  // Secrétaire
  PROCESS_ENROLLMENTS: "process_enrollments",
  GENERATE_DOCUMENTS: "generate_documents",

  // Direction
  VIEW_FINANCIALS: "view_financials",
} as const;

// Helper pour créer des items de navigation
export const createNavigationItem = (
  id: ActiveTab,
  label: string,
  icon: string,
  permission: string,
  options?: Partial<
    Omit<NavigationItem, "id" | "label" | "icon" | "permission">
  >
): NavigationItem => ({
  id,
  label,
  icon,
  permission,
  ...options,
});

// Helper pour obtenir le nom d'affichage d'un onglet
export const getTabDisplayName = (tab: ActiveTab): string => {
  const tabNames: Record<ActiveTab, string> = {
    dashboard: "Tableau de bord",
    students: "Élèves",
    enrollments: "Inscriptions",
    subject: "Matières",
    professeurs: "Professeurs",
    grades: "Notes",
    users: "Utilisateurs",
    guardians: "Parents/Tuteurs",
    payments: "Paiements",
    expenses: "Dépenses",
    analytics: "Statistiques",
    "student-cards": "Cartes Élèves",
    transcripts: "Bulletins",
    login: "Connexion",
    settings: "Paramètres",
    "audit-logs": "Journal d'Audit",
    backup: "Sauvegardes",
    fees: "Frais scolaires",
    attendance: "Présences",
    schedule: "Emploi du temps",
    announcements: "Annonces",
    classes: "Classes/Niveaux",
    reports: "Rapports",
    class_assignment: "Catalogue des Cours",
    register: "Inscription",
    "forgot-password": "Mot de passe oublié",
    "reset-password": "Réinitialisation mot de passe",
    home: "Accueil",
    "404": "Page non trouvée",
    "500": "Erreur serveur",
    unauthorized: "Non autorisé",
    maintenance: "Maintenance",
    events: "Evenements",
  };

  return tabNames[tab] || tab;
};

// Helper pour obtenir l'icône d'un onglet
export const getTabIcon = (tab: ActiveTab): string => {
  const iconMap: Record<ActiveTab, string> = {
    dashboard: "Home",
    students: "Users",
    enrollments: "UserPlus",
    subject: "BookOpen",
    grades: "FileText",
    professeurs: "Award",
    guardians: "UsersRound",
    payments: "DollarSign",
    expenses: "Receipt",
    analytics: "ChartBar",
    "student-cards": "CreditCard",
    transcripts: "ScrollText",
    settings: "Settings",
    "audit-logs": "ShieldAlert",
    backup: "Database",
    fees: "Wallet",
    attendance: "ClipboardCheck",
    schedule: "CalendarDays",
    announcements: "Megaphone",
    users: "UserCog",
    classes: "Building",
    reports: "FileBarChart",
    class_assignment: "RotateCcw",
    login: "LogIn",
    register: "UserPlus",
    "forgot-password": "Key",
    "reset-password": "KeyRound",
    home: "Home",
    "404": "FileX",
    "500": "Server",
    unauthorized: "ShieldOff",
    maintenance: "Wrench",
    events: "CalendarDays",
  };

  return iconMap[tab] || "Square";
};

// Configuration de navigation par rôle
export const ROLE_NAVIGATION_CONFIG: Record<UserRole, RoleNavigationConfig> = {
  Admin: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Accueil",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),
      createNavigationItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS
      ),
      createNavigationItem(
        "enrollments",
        "Inscriptions",
        "UserPlus",
        PERMISSIONS.MANAGE_ENROLLMENTS
      ),
      createNavigationItem(
        "professeurs",
        "Professeurs",
        "Award",
        PERMISSIONS.VIEW_PROFESSEURS
      ),
    ],
    academicItems: [
      createNavigationItem(
        "subject",
        "Matières",
        "BookOpen",
        PERMISSIONS.VIEW_SUBJECTS
      ),
      createNavigationItem(
        "grades",
        "Notes",
        "FileText",
        PERMISSIONS.MANAGE_GRADES
      ),
      createNavigationItem(
        "attendance",
        "Présences",
        "ClipboardCheck",
        PERMISSIONS.VIEW_ATTENDANCE
      ),
      createNavigationItem(
        "schedule",
        "Emploi du temps",
        "CalendarDays",
        PERMISSIONS.VIEW_SCHEDULE
      ),
      createNavigationItem(
        "class_assignment",
        "Catalogue Cours",
        "RotateCcw",
        PERMISSIONS.MANAGE_SUBJECTS
      ),
    ],
    documentItems: [
      createNavigationItem(
        "student-cards",
        "Cartes Élèves",
        "CreditCard",
        PERMISSIONS.GENERATE_CARDS
      ),
      createNavigationItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.GENERATE_TRANSCRIPTS
      ),
      createNavigationItem(
        "reports",
        "Rapports",
        "FileBarChart",
        PERMISSIONS.GENERATE_REPORTS
      ),
    ],
    adminItems: [
      createNavigationItem(
        "users",
        "Utilisateurs",
        "UserCog",
        PERMISSIONS.VIEW_USERS
      ),
      createNavigationItem(
        "classes",
        "Classes",
        "Building",
        PERMISSIONS.VIEW_SETTINGS
      ),
      createNavigationItem(
        "fees",
        "Frais scolaires",
        "Wallet",
        PERMISSIONS.MANAGE_FEES
      ),
      createNavigationItem(
        "expenses",
        "Dépenses",
        "Receipt",
        PERMISSIONS.VIEW_EXPENSES
      ),

      createNavigationItem(
        "audit-logs",
        "Journal d'audit",
        "ShieldAlert",
        PERMISSIONS.VIEW_AUDIT_LOGS
      ),
    ],
  },

  Secretaire: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Accueil",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),
      createNavigationItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS
      ),
      createNavigationItem(
        "enrollments",
        "ReInscriptions",
        "UserPlus",
        PERMISSIONS.PROCESS_ENROLLMENTS
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Comptable: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),
      createNavigationItem(
        "fees",
        "Frais scolaires",
        "Wallet",
        PERMISSIONS.VIEW_FEES
      ),
      createNavigationItem(
        "payments",
        "Paiements",
        "DollarSign",
        PERMISSIONS.VIEW_OWN_PAYMENTS
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Student: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Mon tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Professeur: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Tableau de bord",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),

      createNavigationItem(
        "grades",
        "Saisie des notes",
        "FileEdit",
        PERMISSIONS.MANAGE_OWN_GRADES
      ),
    ],
    academicItems: [],
    documentItems: [],
    adminItems: [],
  },

  Directeur: {
    mainItems: [
      createNavigationItem(
        "dashboard",
        "Accueil",
        "Home",
        PERMISSIONS.VIEW_DASHBOARD
      ),
      createNavigationItem(
        "students",
        "Élèves",
        "Users",
        PERMISSIONS.VIEW_STUDENTS
      ),
      createNavigationItem(
        "enrollments",
        "Inscriptions",
        "UserPlus",
        PERMISSIONS.MANAGE_ENROLLMENTS
      ),
      createNavigationItem(
        "professeurs",
        "Professeurs",
        "Award",
        PERMISSIONS.VIEW_PROFESSEURS
      ),
    ],
    academicItems: [
      createNavigationItem(
        "subject",
        "Matières",
        "BookOpen",
        PERMISSIONS.VIEW_SUBJECTS
      ),

      createNavigationItem(
        "schedule",
        "Emploi du temps",
        "CalendarDays",
        PERMISSIONS.VIEW_SCHEDULE
      ),
      createNavigationItem(
        "class_assignment",
        "Catalogue Cours",
        "RotateCcw",
        PERMISSIONS.MANAGE_SUBJECTS
      ),
    ],
    documentItems: [
      createNavigationItem(
        "transcripts",
        "Bulletins",
        "ScrollText",
        PERMISSIONS.GENERATE_TRANSCRIPTS
      ),
    ],
    adminItems: [
      createNavigationItem(
        "classes",
        "Classes",
        "Building",
        PERMISSIONS.VIEW_SETTINGS
      ),
      createNavigationItem(
        "fees",
        "Frais scolaires",
        "Wallet",
        PERMISSIONS.MANAGE_FEES
      ),
    ],
  },
};

// Helper pour obtenir les onglets accessibles pour un rôle
export const getAccessibleTabsForRole = (role: UserRole): ActiveTab[] => {
  const config = ROLE_NAVIGATION_CONFIG[role];
  if (!config) return [];

  const allItems = [
    ...config.mainItems,
    ...config.academicItems,
    ...config.documentItems,
    ...config.adminItems,
  ];

  return allItems.map((item) => item.id);
};
