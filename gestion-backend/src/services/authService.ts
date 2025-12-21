/**
 * @file authService.ts
 * @description Service de gestion de l'authentification
 * @version 1.0.0
 */

import { PrismaClient, UserRole } from "../../generated/prisma";
import {
  hashPassword,
  verifyPassword,
  generateJwtToken,
  verifyJwtToken,
} from "../utils/security";
import {
  validateEmail,
  validateUserRole,
  sanitizeInput,
  validatePasswordStrength,
} from "../utils/validators";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  LoginAttemptData,
} from "../types/auth";

const prisma = new PrismaClient();

/**
 * @constant {number} MAX_LOGIN_ATTEMPTS - Tentatives de connexion max avant verrouillage
 */
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * @constant {number} LOCK_TIME_MS - Durée de verrouillage en millisecondes
 */
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 minutes

/**
 * @class AuthService
 * @description Service regroupant la logique métier de l'authentification
 */
export class AuthService {
  /**
   * @method authenticateUser
   * @description Authentifie un utilisateur avec email et mot de passe
   * @param {LoginCredentials} credentials - Identifiants de connexion
   * @param {string} ipAddress - Adresse IP de la tentative
   * @returns {Promise<AuthResponse>} Réponse d'authentification
   */
  static async authenticateUser(
    credentials: LoginCredentials,
    ipAddress: string = "unknown"
  ): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Validation des données d'entrée
      if (!email || !password) {
        return {
          message: "Email et mot de passe requis",
          code: "MISSING_CREDENTIALS",
        };
      }

      const cleanEmail = sanitizeInput(email).toLowerCase();
      const cleanPassword = sanitizeInput(password);

      if (!validateEmail(cleanEmail)) {
        return {
          message: "Format d'email invalide",
          code: "INVALID_EMAIL_FORMAT",
        };
      }

      // Récupération de l'utilisateur avec ses tentatives de connexion
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          loginAttempts: {
            orderBy: {
              attemptTime: "desc",
            },
            take: 1,
          },
        },
      });

      if (!user) {
        return {
          message: "Email ou mot de passe incorrect",
          code: "INVALID_CREDENTIALS",
        };
      }

      // Vérification du statut du compte
      if (user.status !== "Actif") {
        return {
          message: "Votre compte est désactivé. Contactez l'administrateur.",
          code: "ACCOUNT_DISABLED",
        };
      }

      // Vérification du verrouillage du compte
      const lockCheck = await this.checkAccountLock(
        user.id,
        user.loginAttempts[0]
      );
      if (lockCheck.isLocked) {
        return {
          message: `Trop de tentatives échouées. Compte verrouillé pour ${lockCheck.remainingMinutes} minute(s).`,
          code: "ACCOUNT_LOCKED",
          remainingAttempts: 0,
          lockUntil: lockCheck.lockUntil,
        };
      }

      // Vérification du mot de passe
      if (!user.password) {
        return {
          message: "Email ou mot de passe incorrect",
          code: "INVALID_CREDENTIALS",
        };
      }

      const isPasswordValid = await verifyPassword(
        cleanPassword,
        user.password
      );

      if (!isPasswordValid) {
        const attemptResult = await this.handleFailedLoginAttempt(
          user.id,
          user.loginAttempts[0]?.failedAttempts || 0,
          ipAddress
        );

        if (attemptResult.isLocked) {
          return {
            message:
              "Trop de tentatives échouées. Compte verrouillé pendant 30 minutes.",
            code: "ACCOUNT_LOCKED",
            lockUntil: attemptResult.lockUntil,
          };
        }

        return {
          message: "Email ou mot de passe incorrect",
          code: "INVALID_CREDENTIALS",
          remainingAttempts: attemptResult.remainingAttempts,
        };
      }

      // Connexion réussie
      await this.handleSuccessfulLogin(user.id);
      const requiresPasswordChange = user.isInitialPassword;

      // Génération du token
      const token = generateJwtToken({
        id: user.id,
        email: user.email,
        role: user.role,
        requiresPasswordChange,
      });

      // Récupérer les données utilisateur sans le mot de passe
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        requiresPasswordChange: user.isInitialPassword,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      };

      return {
        message: "Connexion réussie",
        token,
        expiresIn: "24h",
        user: userData,
      };
    } catch (error) {
      console.error("AuthService - authenticateUser error:", error);
      throw new Error("Erreur lors de l'authentification");
    }
  }

  /**
   * @method registerUser
   * @description Enregistre un nouvel utilisateur
   * @param {RegisterData} userData - Données de l'utilisateur
   * @returns {Promise<AuthResponse>} Réponse d'inscription
   */
  static async registerUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password, role, firstName, lastName, phone } = userData;

      // Validation des données requises
      const requiredFields = { email, password, role, firstName, lastName };
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return {
          message: "Tous les champs obligatoires doivent être remplis",
          code: "MISSING_CREDENTIALS",
        };
      }

      // Validation avancée
      const validatedRole = validateUserRole(role);

      if (!validateEmail(email)) {
        return {
          message: "Format d'email invalide",
          code: "INVALID_EMAIL_FORMAT",
        };
      }

      if (!validatePasswordStrength(password)) {
        return {
          message: "Le mot de passe doit contenir au moins 6 caractères",
          code: "PASSWORD_TOO_SHORT",
        };
      }

      // Vérification des doublons
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizeInput(email).toLowerCase() },
      });

      if (existingUser) {
        return {
          message: "Un utilisateur avec cet email existe déjà",
          code: "EMAIL_ALREADY_EXISTS",
        };
      }

      // Création de l'utilisateur
      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          firstName: sanitizeInput(firstName),
          lastName: sanitizeInput(lastName),
          email: sanitizeInput(email).toLowerCase(),
          phone: phone ? sanitizeInput(phone) : null,
          role: validatedRole,
          password: hashedPassword,
          isInitialPassword: true,
          status: "Actif",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isInitialPassword: true,
          status: true,
          createdAt: true,
        },
      });

      await this.createRoleSpecificProfile(user.id, user.role);

      return {
        message: "Utilisateur créé avec succès",
        user,
        code: "USER_CREATED",
      };
    } catch (error) {
      console.error("AuthService - registerUser error:", error);
      throw new Error("Erreur lors de l'inscription");
    }
  }

  /**
   * @method createRoleSpecificProfile
   * @description Crée le profil spécifique selon le rôle
   * @param {string} userId - ID de l'utilisateur
   * @param {UserRole} role - Rôle de l'utilisateur
   */
  private static async createRoleSpecificProfile(
    userId: string,
    role: UserRole
  ): Promise<void> {
    try {
      switch (role) {
        case "Professeur":
          await prisma.professeur.create({
            data: {
              userId: userId,
              firstName: "",
              lastName: "",
              email: "",
              matricule: "",
            },
          });
          break;

        case "Student":
          await prisma.student.create({
            data: {
              userId: userId,
              firstName: "",
              lastName: "",
              email: "",
              studentCode: "",
            },
          });
          break;

        case "Parent":
          await prisma.parent.create({
            data: { userId: userId },
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("UserService - createRoleSpecificProfile error:", error);
      throw new Error(
        "Erreur lors de la création du profil spécifique au rôle"
      );
    }
  }

  /**
   * @method checkAccountLock
   * @description Vérifie si un compte est verrouillé
   * @param {string} userId - ID de l'utilisateur
   * @param {any} latestAttempt - Dernière tentative de connexion
   * @returns {Promise<{isLocked: boolean, remainingMinutes?: number, lockUntil?: Date}>} État du verrouillage
   */
  private static async checkAccountLock(
    userId: string,
    latestAttempt: any
  ): Promise<{
    isLocked: boolean;
    remainingMinutes?: number;
    lockUntil?: Date;
  }> {
    const currentFailedAttempts = latestAttempt?.failedAttempts || 0;

    if (latestAttempt && currentFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLock = Date.now() - latestAttempt.attemptTime.getTime();

      if (timeSinceLock < LOCK_TIME_MS) {
        const remainingMinutes = Math.ceil(
          (LOCK_TIME_MS - timeSinceLock) / 60000
        );
        return {
          isLocked: true,
          remainingMinutes,
          lockUntil: new Date(Date.now() + (LOCK_TIME_MS - timeSinceLock)),
        };
      } else {
        // Verrouillage expiré, nettoyer
        await this.clearLoginAttempts(userId);
      }
    }

    return { isLocked: false };
  }

  /**
   * @method handleFailedLoginAttempt
   * @description Gère une tentative de connexion échouée
   * @param {string} userId - ID de l'utilisateur
   * @param {number} currentAttempts - Nombre actuel de tentatives
   * @param {string} ipAddress - Adresse IP
   * @returns {Promise<{isLocked: boolean, remainingAttempts?: number, lockUntil?: Date}>} Résultat de la tentative
   */
  private static async handleFailedLoginAttempt(
    userId: string,
    currentAttempts: number,
    ipAddress: string
  ): Promise<{
    isLocked: boolean;
    remainingAttempts?: number;
    lockUntil?: Date;
  }> {
    const newFailedAttempts = currentAttempts + 1;

    if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_TIME_MS);

      await prisma.loginAttempt.upsert({
        where: { userId },
        update: {
          failedAttempts: newFailedAttempts,
          attemptTime: new Date(),
          ipAddress,
        },
        create: {
          userId,
          failedAttempts: newFailedAttempts,
          attemptTime: new Date(),
          ipAddress,
        },
      });

      return {
        isLocked: true,
        lockUntil,
      };
    }

    // Mettre à jour le compteur
    await prisma.loginAttempt.upsert({
      where: { userId },
      update: {
        failedAttempts: newFailedAttempts,
        attemptTime: new Date(),
        ipAddress,
      },
      create: {
        userId,
        failedAttempts: newFailedAttempts,
        attemptTime: new Date(),
        ipAddress,
      },
    });

    return {
      isLocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS - newFailedAttempts,
    };
  }

  /**
   * @method handleSuccessfulLogin
   * @description Gère une connexion réussie
   * @param {string} userId - ID de l'utilisateur
   */
  private static async handleSuccessfulLogin(userId: string): Promise<void> {
    // Nettoyer les tentatives échouées
    await this.clearLoginAttempts(userId);

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  /**
   * @method clearLoginAttempts
   * @description Réinitialise les tentatives de connexion
   * @param {string} userId - ID de l'utilisateur
   */
  private static async clearLoginAttempts(userId: string): Promise<void> {
    try {
      await prisma.loginAttempt.delete({
        where: { userId },
      });
    } catch (error) {
      // Ignorer si aucune tentative n'existe
    }
  }

  /**
   * @method verifyToken
   * @description Vérifie la validité d'un token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<any>} Données décodées du token
   */
  static async verifyToken(token: string): Promise<any> {
    return verifyJwtToken(token);
  }

  /**
   * @method changePassword
   * @description Change le mot de passe d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} currentPassword - Mot de passe actuel
   * @param {string} newPassword - Nouveau mot de passe
   * @param {boolean} forceChange - Force le changement (première connexion)
   * @returns {Promise<AuthResponse>} Résultat du changement
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    forceChange: boolean = false
  ): Promise<AuthResponse> {
    try {
      if (!newPassword) {
        return {
          message: "Le nouveau mot de passe est requis",
          code: "MISSING_CREDENTIALS",
        };
      }

      // Si ce n'est pas un changement forcé, vérifier le mot de passe actuel
      if (!forceChange) {
        if (!currentPassword) {
          return {
            message: "Le mot de passe actuel est requis",
            code: "MISSING_CURRENT_PASSWORD",
          };
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.password) {
          return {
            message: "Utilisateur non trouvé",
            code: "USER_NOT_FOUND",
          };
        }

        const isCurrentPasswordValid = await verifyPassword(
          currentPassword,
          user.password
        );

        if (!isCurrentPasswordValid) {
          return {
            message: "Mot de passe actuel incorrect",
            code: "INVALID_CREDENTIALS",
          };
        }
      }

      // Validation du nouveau mot de passe
      if (!validatePasswordStrength(newPassword)) {
        return {
          message:
            "Le nouveau mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules, chiffres et caractères spéciaux",
          code: "PASSWORD_WEAK",
        };
      }

      const hashedNewPassword = await hashPassword(newPassword);

      // Mettre à jour le mot de passe et marquer comme changé
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          isInitialPassword: false, // Marquer que le mot de passe a été changé
          passwordChangedAt: new Date(), // Enregistrer la date du changement
        },
      });

      return {
        message: forceChange
          ? "Mot de passe initial défini avec succès"
          : "Mot de passe modifié avec succès",
        code: forceChange ? "INITIAL_PASSWORD_SET" : "PASSWORD_CHANGED",
      };
    } catch (error) {
      console.error("AuthService - changePassword error:", error);
      throw new Error("Erreur lors du changement de mot de passe");
    }
  }

  /**
   * @method checkPasswordChangeRequired
   * @description Vérifie si l'utilisateur doit changer son mot de passe
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} True si le changement est requis
   */
  static async checkPasswordChangeRequired(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isInitialPassword: true,
          passwordChangedAt: true,
          createdAt: true,
        },
      });

      if (!user) return false;

      // Si c'est le mot de passe initial
      if (user.isInitialPassword) {
        return true;
      }

      // Vérifier si le mot de passe est trop ancien (optionnel)
      if (user.passwordChangedAt) {
        const daysSinceChange = Math.floor(
          (Date.now() - user.passwordChangedAt.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        // Forcer le changement tous les 90 jours par exemple
        if (daysSinceChange > 90) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("AuthService - checkPasswordChangeRequired error:", error);
      return false;
    }
  }
}
