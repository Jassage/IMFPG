/**
 * @file authTypes.ts
 * @description Types spécifiques au contrôleur d'authentification
 * @version 1.0.0
 */

import { Request } from "express";

/**
 * @interface AuthRequest
 * @description Requête Express étendue avec les données d'authentification
 */
export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

/**
 * @interface LoginRequest
 * @description Requête pour la connexion
 */
export interface LoginRequest extends AuthRequest {
  body: {
    email: string;
    password: string;
  };
}

/**
 * @interface RegisterRequest
 * @description Requête pour l'inscription
 */
export interface RegisterRequest extends AuthRequest {
  body: {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

/**
 * @interface PasswordChangeRequest
 * @description Requête pour le changement de mot de passe
 */
export interface PasswordChangeRequest extends AuthRequest {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

/**
 * @interface ResetPasswordRequest
 * @description Requête pour la réinitialisation de mot de passe
 */
export interface ResetPasswordRequest extends AuthRequest {
  body: {
    token: string;
    password: string;
  };
}

/**
 * @interface ForgotPasswordRequest
 * @description Requête pour le mot de passe oublié
 */
export interface ForgotPasswordRequest extends AuthRequest {
  body: {
    email: string;
  };
}

/**
 * @interface ProfileUpdateRequest
 * @description Requête pour la mise à jour du profil
 */
export interface ProfileUpdateRequest extends AuthRequest {
  body: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

/**
 * @interface TokenVerificationRequest
 * @description Requête pour la vérification de token
 */
export interface TokenVerificationRequest extends AuthRequest {
  headers: {
    authorization?: string;
  };
}

/**
 * @enum AuthActionTypes
 * @description Types d'actions d'authentification pour les logs
 */
export enum AuthActionTypes {
  LOGIN_ATTEMPT = "LOGIN_ATTEMPT",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGIN_ERROR = "LOGIN_ERROR",
  REGISTER_ATTEMPT = "REGISTER_ATTEMPT",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_ERROR = "REGISTER_ERROR",
  PASSWORD_CHANGE_ATTEMPT = "PASSWORD_CHANGE_ATTEMPT",
  PASSWORD_CHANGE_SUCCESS = "PASSWORD_CHANGE_SUCCESS",
  PASSWORD_CHANGE_ERROR = "PASSWORD_CHANGE_ERROR",
  FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST",
  RESET_PASSWORD_ATTEMPT = "RESET_PASSWORD_ATTEMPT",
  RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR",
  TOKEN_VERIFICATION_ATTEMPT = "TOKEN_VERIFICATION_ATTEMPT",
  TOKEN_VERIFICATION_SUCCESS = "TOKEN_VERIFICATION_SUCCESS",
  TOKEN_VERIFICATION_FAILED = "TOKEN_VERIFICATION_FAILED",
  PROFILE_UPDATE_ATTEMPT = "PROFILE_UPDATE_ATTEMPT",
  PROFILE_UPDATE_SUCCESS = "PROFILE_UPDATE_SUCCESS",
  PROFILE_UPDATE_ERROR = "PROFILE_UPDATE_ERROR",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",

  //users
  USERS_LIST_REQUEST = "USERS_LIST_REQUEST",
  USERS_LIST_ERROR = "USERS_LIST_ERROR",
  USER_DETAILS_REQUEST = "USER_DETAILS_REQUEST",
  USER_DETAILS_ERROR = "USER_DETAILS_ERROR",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS",
  USER_UPDATE_ERROR = "USER_UPDATE_ERROR",
  USER_DEACTIVATION_SUCCESS = "USER_DEACTIVATION_SUCCESS",
  USER_DEACTIVATION_ERROR = "USER_DEACTIVATION_ERROR",
  USER_STATUS_UPDATE_SUCCESS = "USER_STATUS_UPDATE_SUCCESS",
  USER_STATUS_UPDATE_ERROR = "USER_STATUS_UPDATE_ERROR",
  USER_ROLE_UPDATE_SUCCESS = "USER_ROLE_UPDATE_SUCCESS",
  USER_ROLE_UPDATE_ERROR = "USER_ROLE_UPDATE_ERROR",
  USER_ACTIVATION_SUCCESS = "USER_ACTIVATION_SUCCESS",
  USER_ACTIVATION_ERROR = "USER_ACTIVATION_ERROR",
  ADMIN_PASSWORD_RESET_REQUEST = "ADMIN_PASSWORD_RESET_REQUEST",
  ADMIN_PASSWORD_RESET_ERROR = "ADMIN_PASSWORD_RESET_ERROR",
  USER_ALREADY_DEACTIVATED = "USER_ALREADY_DEACTIVATED",
  USER_ALREADY_ACTIVE = "USER_ALREADY_ACTIVE",
  SELF_DEACTIVATION_NOT_ALLOWED = "SELF_DEACTIVATION_NOT_ALLOWED",
  SELF_ROLE_MODIFICATION_NOT_ALLOWED = "SELF_ROLE_MODIFICATION_NOT_ALLOWED",
  USER_CREATED_BY_ADMIN = "USER_CREATED_BY_ADMIN",
  USER_CREATION_ERROR = "USER_CREATION_ERROR",
  USERS_SEARCH_REQUEST = "USERS_SEARCH_REQUEST",
  USERS_SEARCH_ERROR = "USERS_SEARCH_ERROR",
  USER_HARD_DELETION_SUCCESS = "USER_HARD_DELETION_SUCCESS",
  USER_HARD_DELETION_ERROR = "USER_HARD_DELETION_ERROR",
  USER_DEPENDENCIES_CHECK = "USER_DEPENDENCIES_CHECK",
  USER_DEPENDENCIES_CHECK_ERROR = "USER_DEPENDENCIES_CHECK_ERROR",
  USER_HAS_DEPENDENCIES = "USER_HAS_DEPENDENCIES",
  SELF_DELETION_NOT_ALLOWED = "SELF_DELETION_NOT_ALLOWED",
  FORCE_PASSWORD_CHANGE_REQUIRED = "FORCE_PASSWORD_CHANGE_REQUIRED",
  PASSWORD_CHANGE_FORCED = "PASSWORD_CHANGE_FORCED",
  PASSWORD_FORCE_CHANGED_ERROR = "PASSWORD_FORCE_CHANGED_ERROR",
  PASSWORD_FORCE_CHANGED = "PASSWORD_FORCE_CHANGED",
  CHECK_PASSWORD_STATUS_ERROR = "CHECK_PASSWORD_STATUS_ERROR",
}

/**
 * @interface AuthControllerResponse
 * @description Réponse standard du contrôleur d'authentification
 */
export interface AuthControllerResponse {
  success: boolean;
  message: string;
  data?: any;
  user?: any;
  code?: string;
  errors?: any[];
}
