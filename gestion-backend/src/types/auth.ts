/**
 * @file auth.ts
 * @description Types et interfaces pour l'authentification
 * @version 1.0.0
 */

import { UserRole, UserStatus } from "../../generated/prisma";

/**
 * @interface LoginCredentials
 * @description Données de connexion utilisateur
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @interface RegisterData
 * @description Données d'inscription utilisateur
 */
export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * @interface PasswordChangeData
 * @description Données pour le changement de mot de passe
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * @interface ResetPasswordData
 * @description Données pour la réinitialisation de mot de passe
 */
export interface ResetPasswordData {
  token: string;
  password: string;
}

/**
 * @interface AuthResponse
 * @description Réponse standard pour l'authentification
 */
export interface AuthResponse {
  message: string;
  token?: string;
  user?: any;
  expiresIn?: string;
  code?: string;
  remainingAttempts?: number;
  lockUntil?: Date;
}

/**
 * @interface JwtPayload
 * @description Payload du token JWT
 */
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * @interface LoginAttemptData
 * @description Données de tentative de connexion
 */
export interface LoginAttemptData {
  userId: string;
  failedAttempts: number;
  attemptTime: Date;
  ipAddress?: string;
}

/**
 * @enum AuthErrorCodes
 * @description Codes d'erreur standardisés pour l'authentification
 */
export enum AuthErrorCodes {
  MISSING_CREDENTIALS = "MISSING_CREDENTIALS",
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

/**
 * @interface AuditData
 * @description Données pour les logs d'audit
 */
export interface AuditData {
  userRole: string;
  ipAddress: string;
  userAgent: string;
  userId: string | null; // Changement: ne peut plus être undefined
}

/**
 * @interface CreateAuditLogParams
 * @description Paramètres pour la création d'un log d'audit
 */
export interface CreateAuditLogParams {
  ipAddress: string;
  userAgent: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  status: "SUCCESS" | "ERROR" | "INFO";
  errorMessage?: string;
}
