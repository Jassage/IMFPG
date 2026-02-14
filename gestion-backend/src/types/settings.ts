export interface SystemSettings {
  id?: string;
  schoolName: string;
  schoolSlogan: string;
  schoolLogo: string;
  schoolFavicon: string;

  // Contact
  phone: string;
  secondaryPhone: string | null;
  email: string;
  secondaryEmail: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;

  // Réseaux sociaux
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;

  // Paramètres académiques
  currentAcademicYearId: string | null;
  gradingSystem: string;
  passingGrade: number;
  maxGrade: number;

  // Paramètres financiers
  currency: string;
  currencySymbol: string;
  taxRate: number;
  latePaymentFee: number;
  paymentMethods: string[];

  // Paramètres de notification
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;

  // Sécurité
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };

  // Apparence
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;

  // Modules activés
  enabledModules: {
    attendance: boolean;
    library: boolean;
    transport: boolean;
    hostel: boolean;
    payroll: boolean;
    inventory: boolean;
  };

  // Backup
  autoBackup: boolean;
  backupFrequency: string;
  backupRetention: number;
  lastBackup: Date | null;

  // Métadonnées
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: string | null;
}

export interface SettingsUpdateData {
  schoolName?: string;
  schoolSlogan?: string;
  schoolLogo?: string;
  schoolFavicon?: string;
  phone?: string;
  secondaryPhone?: string | null;
  email?: string;
  secondaryEmail?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  currentAcademicYearId?: string | null;
  gradingSystem?: string;
  passingGrade?: number;
  maxGrade?: number;
  currency?: string;
  currencySymbol?: string;
  taxRate?: number;
  latePaymentFee?: number;
  paymentMethods?: string[];
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  enablePushNotifications?: boolean;
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  twoFactorAuth?: boolean;
  passwordPolicy?: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  enabledModules?: {
    attendance: boolean;
    library: boolean;
    transport: boolean;
    hostel: boolean;
    payroll: boolean;
    inventory: boolean;
  };
  autoBackup?: boolean;
  backupFrequency?: string;
  backupRetention?: number;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  code?: string;
  data?: {
    settings?: SystemSettings;
  };
}

export enum SettingsActionTypes {
  // Actions générales
  SETTINGS_GET = "SETTINGS_GET",
  SETTINGS_GET_SUCCESS = "SETTINGS_GET_SUCCESS",
  SETTINGS_GET_ERROR = "SETTINGS_GET_ERROR",

  // Mise à jour
  SETTINGS_UPDATE = "SETTINGS_UPDATE",
  SETTINGS_UPDATE_SUCCESS = "SETTINGS_UPDATE_SUCCESS",
  SETTINGS_UPDATE_ERROR = "SETTINGS_UPDATE_ERROR",

  // Backup
  SETTINGS_BACKUP = "SETTINGS_BACKUP",
  SETTINGS_BACKUP_SUCCESS = "SETTINGS_BACKUP_SUCCESS",
  SETTINGS_BACKUP_ERROR = "SETTINGS_BACKUP_ERROR",

  // Reset
  SETTINGS_RESET = "SETTINGS_RESET",
  SETTINGS_RESET_SUCCESS = "SETTINGS_RESET_SUCCESS",
  SETTINGS_RESET_ERROR = "SETTINGS_RESET_ERROR",
}
