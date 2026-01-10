/**
 * @file authController.ts
 * @description Contrôleur principal pour l'authentification
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { AuthService } from "../../services/authService";
import { UserService } from "../../services/userService";
import { sendEmail } from "../../services/emailService";
import { createAuditLog } from "../auditController";
import {
  generateResetToken,
  generateResetTokenExpiry,
  verifyJwtToken,
} from "../../utils/security";
import {
  extractAuditData,
  generateResetLink,
  generateEmailTemplate,
  createSafeAuditData,
} from "./authUtils";
import {
  AuthRequest,
  AuthActionTypes,
  AuthControllerResponse,
} from "./authTypes";
import prisma from "../../prisma";

/**
 * @controller login
 * @description Authentifie un utilisateur et retourne un token JWT
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  // NE PAS appeler extractAuditData ici, créer des données d'audit manuelles
  const auditData = {
    userId: null,
    userRole: null,
    userEmail: req.body?.email || "unknown",
    ipAddress: req.ip || "127.0.0.1",
    userAgent: req.headers["user-agent"] || "unknown",
  };

  try {
    const { email, password } = req.body;

    // Log de tentative de connexion
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.LOGIN_ATTEMPT,
      entity: "Auth",
      description: "Tentative de connexion",
      status: "INFO",
      metadata: { email },
    });

    // Appel du service d'authentification
    const authResult = await AuthService.authenticateUser(
      { email, password },
      auditData.ipAddress
    );

    // Gestion des réponses d'erreur
    if (authResult.code && authResult.code !== "USER_CREATED") {
      const statusCode = getStatusCodeFromErrorCode(authResult.code);

      await createAuditLog({
        ...auditData,
        action: getAuthActionFromErrorCode(authResult.code),
        entity: "User",
        description: authResult.message,
        status: "ERROR",
        metadata: {
          code: authResult.code,
          ...(authResult.remainingAttempts && {
            remainingAttempts: authResult.remainingAttempts,
          }),
          ...(authResult.lockUntil && { lockUntil: authResult.lockUntil }),
        },
      });

      res.status(statusCode).json({
        success: false,
        message: authResult.message,
        code: authResult.code,
        ...(authResult.remainingAttempts && {
          remainingAttempts: authResult.remainingAttempts,
        }),
        ...(authResult.lockUntil && { lockUntil: authResult.lockUntil }),
      });
      return;
    }

    // Récupération du profil utilisateur complet
    const userProfile = await UserService.getUserProfileWithRoleData(
      authResult.user.id
    );

    // Mettre à jour les données d'audit avec l'ID utilisateur
    const updatedAuditData = {
      ...auditData,
      userId: authResult.user.id,
      userRole: authResult.user.role,
    };

    // Log de connexion réussie
    await createAuditLog({
      ...updatedAuditData,
      action: AuthActionTypes.LOGIN_SUCCESS,
      entity: "User",
      entityId: authResult.user.id,
      userId: authResult.user.id,
      description: "Connexion réussie",
      status: "SUCCESS",
      metadata: {
        role: authResult.user.role,
        lastLogin: new Date(),
      },
    });

    // Réponse de succès
    const response: AuthControllerResponse = {
      success: true,
      message: authResult.message,
      data: {
        token: authResult.token,
        user: userProfile,
        expiresIn: authResult.expiresIn,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ AuthController - login error:", error);

    // Utiliser un message d'erreur court pour l'audit log
    const shortErrorMessage = error.message
      ? error.message.substring(0, 200)
      : "Erreur inconnue";

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.LOGIN_ERROR,
      entity: "Auth",
      description: "Erreur interne lors de la connexion",
      status: "ERROR",
      errorMessage: shortErrorMessage,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller register
 * @description Crée un nouvel utilisateur dans le système
 * @route POST /api/auth/register
 * @access Public (en production, restreindre aux administrateurs)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    // Log de tentative d'inscription
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.REGISTER_ATTEMPT,
      entity: "Auth",
      description: "Tentative d'inscription",
      status: "SUCCESS",
      metadata: { email, role },
    });

    // Appel du service d'inscription
    const registerResult = await AuthService.registerUser({
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
    });

    // Gestion des erreurs
    if (registerResult.code && registerResult.code !== "USER_CREATED") {
      await createAuditLog({
        ...auditData,
        userId: auditData.userId ?? null,
        action: AuthActionTypes.REGISTER_ERROR,
        entity: "Auth",
        description: registerResult.message,
        status: "ERROR",
        metadata: { code: registerResult.code },
      });

      const statusCode = getStatusCodeFromErrorCode(registerResult.code);

      res.status(statusCode).json({
        success: false,
        message: registerResult.message,
        code: registerResult.code,
      });
      return;
    }

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.REGISTER_SUCCESS,
      entity: "User",
      entityId: registerResult.user.id,
      userId: registerResult.user.id,
      description: "Inscription réussie",
      status: "SUCCESS",
      metadata: {
        role: registerResult.user.role,
        hasPhone: !!phone,
      },
    });

    // Réponse de succès
    const response: AuthControllerResponse = {
      success: true,
      message: registerResult.message,
      data: { user: registerResult.user },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error(" AuthController - register error:", error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.REGISTER_ERROR,
      entity: "Auth",
      description: "Erreur lors de l'inscription",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

export const verifyPasswordForUnlock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation simple
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
      return;
    }

    // Vérifier le mot de passe
    const isValid = await AuthService.verifyPassword(email, password);

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Mot de passe vérifié",
    });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * Vérification de mot de passe pour l'utilisateur courant (avec token)
 */
export const verifyCurrentPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Récupérer l'ID utilisateur du token (middleware d'authentification)
    const userId = (req as any).user?.id;
    const { currentPassword } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Non authentifié",
      });
      return;
    }

    if (!currentPassword) {
      res.status(400).json({
        success: false,
        message: "Mot de passe actuel requis",
      });
      return;
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });

    if (!user || !user.password) {
      res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
      return;
    }

    // Vérifier le mot de passe
    const isValid = await AuthService.verifyPassword(
      user.email,
      currentPassword
    );

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Mot de passe vérifié",
    });
  } catch (error) {
    console.error("Current password verification error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * @controller getMe
 * @description Récupère le profil de l'utilisateur connecté
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = req.userId;

    if (!userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    // Récupération du profil
    const userProfile = await UserService.getUserProfile(userId);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.PROFILE_UPDATE_SUCCESS,
      entity: "User",
      entityId: userId,
      userId: userId,
      description: "Profil utilisateur récupéré avec succès",
      status: "SUCCESS",
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Profil récupéré avec succès",
      data: { user: userProfile },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" AuthController - getMe error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.PROFILE_UPDATE_ERROR,
      entity: "Auth",
      description: "Erreur lors de la récupération du profil",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller verifyToken
 * @description Vérifie la validité d'un token JWT
 * @route GET /api/auth/verify
 * @access Public
 */
export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.TOKEN_VERIFICATION_ATTEMPT,
        entity: "Auth",
        description: "Tentative de vérification sans token",
        status: "ERROR",
      });

      const response: AuthControllerResponse = {
        success: false,
        message: "Token manquant",
        code: "MISSING_TOKEN",
      };
      res.status(401).json(response);
      return;
    }

    // Vérification du token
    const decoded = await AuthService.verifyToken(token);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.TOKEN_VERIFICATION_SUCCESS,
      entity: "User",
      entityId: decoded.id,
      userId: decoded.id,
      description: "Token vérifié avec succès",
      status: "SUCCESS",
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Token valide",
      data: { user: decoded },
    };

    res.json(response);
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.TOKEN_VERIFICATION_FAILED,
      entity: "Auth",
      description: "Échec de la vérification du token",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: error.message,
      code: "INVALID_TOKEN",
    };

    res.status(401).json(response);
  }
};

/**
 * @controller forgotPassword
 * @description Envoie un email de réinitialisation de mot de passe
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { email } = req.body;

    if (!email) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Email requis",
        code: "MISSING_EMAIL",
      };
      res.status(400).json(response);
      return;
    }

    // Recherche de l'utilisateur
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      // Pour la sécurité, on ne révèle pas si l'email existe
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.FORGOT_PASSWORD_REQUEST,
        entity: "Auth",
        description: "Demande de réinitialisation pour email non trouvé",
        status: "SUCCESS",
        metadata: { email },
      });

      const response: AuthControllerResponse = {
        success: true,
        message: "Si l'email existe, un lien de réinitialisation a été envoyé",
      };
      res.json(response);
      return;
    }

    // Génération du token de réinitialisation
    const resetToken = generateResetToken();
    const resetTokenExpiry = generateResetTokenExpiry();

    // Sauvegarde du token
    await UserService.updateUserResetToken(
      user.id,
      resetToken,
      resetTokenExpiry
    );

    // Génération du lien et de l'email
    const resetLink = generateResetLink(resetToken);
    const emailTemplate = generateEmailTemplate(user.firstName, resetLink);

    // Envoi de l'email
    try {
      await sendEmail({
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: emailTemplate,
      });

      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.FORGOT_PASSWORD_REQUEST,
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Email de réinitialisation envoyé",
        status: "SUCCESS",
        metadata: { emailSent: true },
      });
    } catch (emailError) {
      console.error(" Erreur envoi email:", emailError);

      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.FORGOT_PASSWORD_REQUEST,
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Erreur lors de l'envoi de l'email de réinitialisation",
        status: "ERROR",
        errorMessage:
          emailError instanceof Error ? emailError.message : "Erreur inconnue",
      });
    }

    const response: AuthControllerResponse = {
      success: true,
      message: "Si l'email existe, un lien de réinitialisation a été envoyé",
    };

    res.json(response);
  } catch (error: any) {
    console.error(" AuthController - forgotPassword error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.RESET_PASSWORD_ERROR,
      entity: "Auth",
      description: "Erreur lors de la demande de réinitialisation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller forcePasswordChange
 * @description Force le changement de mot de passe (première connexion)
 * @route POST /api/auth/force-password-change
 * @access Private
 */
export const forcePasswordChange = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = req.userId;
    const { newPassword } = req.body;

    if (!userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    if (!newPassword) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Le nouveau mot de passe est requis",
        code: "MISSING_PASSWORD",
      };
      res.status(400).json(response);
      return;
    }

    // Appel du service avec forceChange = true
    const result = await AuthService.changePassword(
      userId,
      "", // Pas de mot de passe actuel nécessaire pour le changement forcé
      newPassword,
      true // Force change
    );

    if (
      result.code === "PASSWORD_CHANGED" ||
      result.code === "INITIAL_PASSWORD_SET"
    ) {
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.PASSWORD_FORCE_CHANGED,
        entity: "User",
        entityId: userId,
        userId: userId,
        description: "Mot de passe initial changé avec succès",
        status: "SUCCESS",
        metadata: {
          isInitialPassword: false,
          passwordChangedAt: new Date(),
        },
      });

      const response: AuthControllerResponse = {
        success: true,
        message: result.message,
      };
      res.json(response);
    } else {
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.PASSWORD_CHANGE_ERROR,
        entity: "User",
        entityId: userId,
        userId: userId,
        description: result.message,
        status: "ERROR",
        errorMessage: result.code,
      });

      const response: AuthControllerResponse = {
        success: false,
        message: result.message,
        code: result.code,
      };
      res.status(400).json(response);
    }
  } catch (error: any) {
    console.error(" AuthController - forcePasswordChange error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.PASSWORD_CHANGE_ERROR,
      entity: "Auth",
      description: "Erreur lors du changement forcé de mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller checkPasswordChangeRequired
 * @description Vérifie si l'utilisateur doit changer son mot de passe
 * @route GET /api/auth/check-password-change
 * @access Private
 */
export const checkPasswordChangeRequired = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = req.userId;

    if (!userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    const requiresChange =
      await AuthService.checkPasswordChangeRequired(userId);

    const response: AuthControllerResponse = {
      success: true,
      message: requiresChange
        ? "Changement de mot de passe requis"
        : "Mot de passe à jour",
      data: { requiresPasswordChange: requiresChange },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " AuthController - checkPasswordChangeRequired error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.CHECK_PASSWORD_STATUS_ERROR,
      entity: "Auth",
      description: "Erreur lors de la vérification du statut du mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @function getStatusCodeFromErrorCode
 * @description Map les codes d'erreur vers les status HTTP appropriés
 * @param {string} errorCode - Code d'erreur
 * @returns {number} Status HTTP
 */
const getStatusCodeFromErrorCode = (errorCode: string): number => {
  const statusMap: { [key: string]: number } = {
    MISSING_CREDENTIALS: 400,
    INVALID_EMAIL_FORMAT: 400,
    INVALID_CREDENTIALS: 401,
    ACCOUNT_DISABLED: 403,
    ACCOUNT_LOCKED: 423,
    EMAIL_ALREADY_EXISTS: 400,
    INVALID_TOKEN: 401,
    TOKEN_EXPIRED: 401,
    PASSWORD_TOO_SHORT: 400,
    USER_NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    MISSING_EMAIL: 400,
    INTERNAL_ERROR: 500,
  };

  return statusMap[errorCode] || 400;
};

/**
 * @function getAuthActionFromErrorCode
 * @description Map les codes d'erreur vers les actions d'audit
 * @param {string} errorCode - Code d'erreur
 * @returns {AuthActionTypes} Action d'audit
 */
const getAuthActionFromErrorCode = (errorCode: string): AuthActionTypes => {
  const actionMap: { [key: string]: AuthActionTypes } = {
    ACCOUNT_LOCKED: AuthActionTypes.ACCOUNT_LOCKED,
    INVALID_CREDENTIALS: AuthActionTypes.LOGIN_FAILED,
    ACCOUNT_DISABLED: AuthActionTypes.LOGIN_FAILED,
  };

  return actionMap[errorCode] || AuthActionTypes.LOGIN_ERROR;
};
