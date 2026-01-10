/**
 * @file auth.controller.ts
 * @description Contrôleur d'authentification principal
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient, UserRole } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../services/emailService";
import rateLimit from "express-rate-limit";
import { createAuditLog } from "./auditController";
import { createSafeAuditData, extractAuditData } from "./auth/authUtils";
import { UserService } from "../services/userService";

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "votre_secret_jwt_super_securise_changez_moi";

// Rate limiting pour le login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: {
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
    code: "RATE_LIMITED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation robuste des emails
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validation des rôles
const VALID_ROLES: UserRole[] = [
  "Admin",
  "Professeur",
  "Secretaire",
  "Directeur",
  "Student",
  "Comptable",
];

const validateUserRole = (role: string): UserRole => {
  if (VALID_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  throw new Error(
    `Rôle invalide: "${role}". Rôles valides: ${VALID_ROLES.join(", ")}`
  );
};

// Fonction de vérification de token améliorée
export const verifyToken = async (token: string) => {
  try {
    if (!token || token === "null" || token === "undefined") {
      throw new Error("Token manquant");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Vérifications supplémentaires
    if (!decoded.id || !decoded.email) {
      throw new Error("Token invalide: données manquantes");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expiré");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token invalide");
    }
    throw new Error("Erreur de vérification du token");
  }
};

/**
 * @controller login
 * @description Authentifie un utilisateur et retourne un token JWT
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { email, password } = req.body;

    // ==================== VALIDATION DES DONNÉES ====================
    if (!email || !password) {
      await createAuditLog({
        ...auditData,
        action: "LOGIN_ATTEMPT",
        entity: "Auth",
        description: "Tentative de connexion avec données manquantes",
        status: "ERROR",
        metadata: { missingFields: { email: !email, password: !password } },
      });

      res.status(400).json({
        message: "Email et mot de passe requis",
        code: "MISSING_CREDENTIALS",
      });
      return;
    }

    // ==================== NETTOYAGE DES DONNÉES ====================
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!validateEmail(cleanEmail)) {
      await createAuditLog({
        ...auditData,
        action: "LOGIN_ATTEMPT",
        entity: "Auth",
        description: "Tentative de connexion avec email invalide",
        status: "ERROR",
        metadata: { email: cleanEmail },
      });

      res.status(400).json({
        message: "Format d'email invalide",
        code: "INVALID_EMAIL_FORMAT",
      });
      return;
    }

    // ==================== RÉCUPÉRATION UTILISATEUR ====================
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
      await createAuditLog({
        ...auditData,
        action: "LOGIN_ATTEMPT",
        entity: "Auth",
        description: "Tentative de connexion avec utilisateur inexistant",
        status: "ERROR",
        metadata: { email: cleanEmail },
      });

      res.status(401).json({
        message: "Email ou mot de passe incorrect",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    // ==================== VÉRIFICATIONS DE SÉCURITÉ ====================
    if (user.status !== "Actif") {
      await createAuditLog({
        ...auditData,
        action: "LOGIN_ATTEMPT",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Tentative de connexion avec compte désactivé",
        status: "ERROR",
        metadata: { status: user.status },
      });

      res.status(403).json({
        message: "Votre compte est désactivé. Contactez l'administrateur.",
        code: "ACCOUNT_DISABLED",
      });
      return;
    }

    // Vérification du verrouillage du compte
    const latestAttempt = user.loginAttempts[0];
    const currentFailedAttempts = latestAttempt?.failedAttempts || 0;
    const maxAttempts = 5;
    const lockTime = 30 * 60 * 1000; // 30 minutes

    if (latestAttempt && currentFailedAttempts >= maxAttempts) {
      const timeSinceLock = Date.now() - latestAttempt.attemptTime.getTime();

      if (timeSinceLock < lockTime) {
        const remainingMinutes = Math.ceil((lockTime - timeSinceLock) / 60000);

        await createAuditLog({
          ...auditData,
          action: "LOGIN_ATTEMPT",
          entity: "User",
          entityId: user.id,
          userId: user.id,
          description: "Tentative de connexion avec compte verrouillé",
          status: "ERROR",
          metadata: {
            remainingMinutes,
            currentFailedAttempts,
          },
        });

        res.status(423).json({
          message: `Trop de tentatives échouées. Compte verrouillé pour ${remainingMinutes} minute(s).`,
          code: "ACCOUNT_LOCKED",
          remainingTime: remainingMinutes,
          lockUntil: new Date(Date.now() + (lockTime - timeSinceLock)),
        });
        return;
      } else {
        // Réinitialiser les tentatives si le verrouillage a expiré
        await prisma.loginAttempt.delete({
          where: { userId: user.id },
        });
      }
    }

    // Vérification du mot de passe
    if (!user.password) {
      await createAuditLog({
        ...auditData,
        action: "LOGIN_ATTEMPT",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Tentative de connexion - mot de passe non configuré",
        status: "ERROR",
      });

      res.status(401).json({
        message: "Email ou mot de passe incorrect",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

    if (!isPasswordValid) {
      const newFailedAttempts = currentFailedAttempts + 1;

      // Gérer les tentatives échouées
      if (newFailedAttempts >= maxAttempts) {
        if (latestAttempt) {
          await prisma.loginAttempt.update({
            where: { id: latestAttempt.id },
            data: {
              failedAttempts: newFailedAttempts,
              attemptTime: new Date(),
              ipAddress: req.ip || "unknown",
            },
          });
        } else {
          await prisma.loginAttempt.create({
            data: {
              userId: user.id,
              failedAttempts: newFailedAttempts,
              attemptTime: new Date(),
              ipAddress: req.ip || "unknown",
            },
          });
        }

        await createAuditLog({
          ...auditData,
          action: "ACCOUNT_LOCKED",
          entity: "User",
          entityId: user.id,
          userId: user.id,
          description: "Compte verrouillé après trop de tentatives échouées",
          status: "ERROR",
          metadata: {
            failedAttempts: newFailedAttempts,
            lockDuration: "30 minutes",
          },
        });

        res.status(423).json({
          message:
            "Trop de tentatives échouées. Compte verrouillé pendant 30 minutes.",
          code: "ACCOUNT_LOCKED",
          lockUntil: new Date(Date.now() + lockTime),
        });
        return;
      }

      // Mettre à jour les tentatives échouées
      if (latestAttempt) {
        await prisma.loginAttempt.update({
          where: { id: latestAttempt.id },
          data: {
            failedAttempts: newFailedAttempts,
            attemptTime: new Date(),
            ipAddress: req.ip || "unknown",
          },
        });
      } else {
        await prisma.loginAttempt.create({
          data: {
            userId: user.id,
            failedAttempts: newFailedAttempts,
            attemptTime: new Date(),
            ipAddress: req.ip || "unknown",
          },
        });
      }

      const remainingAttempts = maxAttempts - newFailedAttempts;

      await createAuditLog({
        ...auditData,
        action: "LOGIN_FAILED",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Tentative de connexion échouée - mot de passe incorrect",
        status: "ERROR",
        metadata: {
          failedAttempts: newFailedAttempts,
          remainingAttempts,
        },
      });

      res.status(401).json({
        message: "Email ou mot de passe incorrect",
        code: "INVALID_CREDENTIALS",
        remainingAttempts: remainingAttempts,
        ...(remainingAttempts <= 3 && {
          warning: `Il vous reste ${remainingAttempts} tentative(s)`,
        }),
      });
      return;
    }

    // ==================== CONNEXION RÉUSSIE ====================
    // Nettoyer les tentatives échouées
    if (latestAttempt) {
      await prisma.loginAttempt.delete({
        where: { id: latestAttempt.id },
      });
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Récupérer le profil complet
    const userProfile = await UserService.getUserProfileWithRoleData(user.id);

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
        issuer: "school-auth",
        audience: "school-app",
      }
    );

    // Log d'audit de succès
    await createAuditLog({
      ...auditData,
      action: "LOGIN_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Connexion réussie",
      status: "SUCCESS",
      metadata: {
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });

    // ==================== RÉPONSE DE SUCCÈS ====================
    res.json({
      message: "Connexion réussie",
      token,
      user: userProfile,
      expiresIn: "24h",
    });
  } catch (error: any) {
    console.error(" Erreur login:", error);

    // Message d'erreur court pour éviter les problèmes de longueur
    const shortError = error.message
      ? error.message.substring(0, 100)
      : "Erreur inconnue";

    await createAuditLog({
      ...auditData,
      action: "LOGIN_ERROR",
      entity: "Auth",
      description: "Erreur interne lors de la connexion",
      status: "ERROR",
      errorMessage: shortError,
    });

    res.status(500).json({
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    });
  }
};

/**
 * @controller verifyPassword
 * @description Vérifie le mot de passe actuel de l'utilisateur
 * @route POST /api/auth/verify-password
 * @access Private
 */
export const verifyPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { password } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (
      !token ||
      token === "Bearer" ||
      token === "null" ||
      token === "undefined"
    ) {
      await createAuditLog({
        ...auditData,
        action: "PASSWORD_VERIFICATION_ATTEMPT",
        entity: "Auth",
        description: "Tentative de vérification sans token",
        status: "ERROR",
      });

      res.status(401).json({
        message: "Token d'authentification manquant ou invalide",
        code: "MISSING_TOKEN",
      });
      return;
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      await createAuditLog({
        ...auditData,
        action: "PASSWORD_VERIFICATION_ATTEMPT",
        entity: "Auth",
        description: "Tentative de vérification sans mot de passe",
        status: "ERROR",
      });

      res.status(400).json({
        message: "Un mot de passe valide est requis",
        code: "PASSWORD_REQUIRED",
      });
      return;
    }

    const cleanPassword = password.trim();

    let decoded: any;
    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET non configuré");
      }
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      console.error(" Erreur JWT:", jwtError);

      const errorMessage =
        jwtError instanceof Error ? jwtError.message : "Erreur JWT inconnue";
      const errorName =
        jwtError instanceof Error ? jwtError.name : "UnknownError";

      await createAuditLog({
        ...auditData,
        action: "PASSWORD_VERIFICATION_ATTEMPT",
        entity: "Auth",
        description:
          "Token JWT invalide lors de la vérification de mot de passe",
        status: "ERROR",
        errorMessage: errorMessage,
        metadata: { errorType: errorName },
      });

      res.status(401).json({
        message: "Session expirée ou invalide",
        code: "INVALID_TOKEN",
        redirectTo: "/login",
      });
      return;
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.password) {
      await createAuditLog({
        ...auditData,
        action: "PASSWORD_VERIFICATION_ATTEMPT",
        entity: "User",
        description: "Utilisateur non trouvé lors de la vérification",
        status: "ERROR",
        metadata: { userId: decoded.id },
      });

      res.status(401).json({
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

    if (!isPasswordValid) {
      await createAuditLog({
        ...auditData,
        action: "PASSWORD_VERIFICATION_FAILED",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Échec de la vérification du mot de passe",
        status: "ERROR",
      });

      res.status(401).json({
        message: "Mot de passe incorrect",
        code: "INVALID_PASSWORD",
      });
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PASSWORD_VERIFICATION_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Mot de passe vérifié avec succès",
      status: "SUCCESS",
    });

    res.json({
      message: "Mot de passe vérifié avec succès",
      valid: true,
    });
  } catch (error: any) {
    console.error(" Erreur vérification mot de passe:", error);

    await createAuditLog({
      ...auditData,
      action: "PASSWORD_VERIFICATION_ERROR",
      entity: "Auth",
      description: "Erreur interne lors de la vérification de mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({
      message: "Erreur interne du serveur lors de la vérification",
      code: "INTERNAL_ERROR",
    });
  }
};

/**
 * @controller register
 * @description Crée un nouvel utilisateur dans le système
 * @route POST /api/auth/register
 * @access Public (en production, restreindre aux administrateurs)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    console.log("📨 Données reçues:", { email, role, firstName, lastName });

    // Validation des données requises
    if (!email || !password || !role || !firstName || !lastName) {
      await createAuditLog({
        ...auditData,
        action: "REGISTER_ATTEMPT",
        entity: "Auth",
        description: "Tentative d'inscription avec données manquantes",
        status: "ERROR",
        metadata: {
          missingFields: {
            email: !email,
            password: !password,
            role: !role,
            firstName: !firstName,
            lastName: !lastName,
          },
        },
      });

      res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis",
        required: ["email", "password", "role", "firstName", "lastName"],
        received: {
          email: !!email,
          password: !!password,
          role: !!role,
          firstName: !!firstName,
          lastName: !!lastName,
        },
      });
      return;
    }

    // Valider que le rôle est acceptable
    const validatedRole = validateUserRole(role);
    console.log("✅ Rôle validé:", validatedRole);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await createAuditLog({
        ...auditData,
        action: "REGISTER_ATTEMPT",
        entity: "Auth",
        description: "Tentative d'inscription avec email déjà existant",
        status: "ERROR",
        metadata: { email },
      });

      res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role: validatedRole,
        password: hashedPassword,
        status: "Actif",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    console.log("✅ Utilisateur créé:", user.id);

    await createAuditLog({
      ...auditData,
      action: "REGISTER_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Nouvel utilisateur créé avec succès",
      status: "SUCCESS",
      metadata: {
        role: validatedRole,
        hasPhone: !!phone,
      },
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
    });
  } catch (error: any) {
    console.error(" Registration error:", error);

    await createAuditLog({
      ...auditData,
      action: "REGISTER_ERROR",
      entity: "Auth",
      description: "Erreur lors de l'inscription",
      status: "ERROR",
      errorMessage: error.message,
      metadata: {
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });

    res.status(400).json({
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * @controller getMe
 * @description Récupère le profil de l'utilisateur connecté
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const userId = (req as any).userId;

    if (!userId) {
      await createAuditLog({
        ...auditData,
        action: "GET_PROFILE_ATTEMPT",
        entity: "Auth",
        description: "Tentative d'accès au profil sans userId",
        status: "ERROR",
      });

      res.status(401).json({ message: "Non autorisé" });
      return;
    }

    const userProfile = await UserService.getUserProfileWithRoleData(userId);

    await createAuditLog({
      ...auditData,
      action: "GET_PROFILE_SUCCESS",
      entity: "User",
      entityId: userId,
      userId: userId,
      description: "Profil utilisateur récupéré avec succès",
      status: "SUCCESS",
    });

    res.json(userProfile);
  } catch (error: any) {
    console.error("Get me error:", error);

    await createAuditLog({
      ...auditData,
      action: "GET_PROFILE_ERROR",
      entity: "Auth",
      description: "Erreur lors de la récupération du profil",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller verify
 * @description Vérifie la validité d'un token JWT
 * @route GET /api/auth/verify
 * @access Public
 */
export const verify = async (req: Request, res: Response): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      await createAuditLog({
        ...auditData,
        action: "TOKEN_VERIFICATION_ATTEMPT",
        entity: "Auth",
        description: "Tentative de vérification sans token",
        status: "ERROR",
      });

      res.status(401).json({ message: "Token manquant" });
      return;
    }

    const user = await verifyToken(token);

    await createAuditLog({
      ...auditData,
      action: "TOKEN_VERIFICATION_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Token vérifié avec succès",
      status: "SUCCESS",
    });

    res.json({ valid: true, user });
  } catch (error: any) {
    await createAuditLog({
      ...auditData,
      action: "TOKEN_VERIFICATION_FAILED",
      entity: "Auth",
      description: "Échec de la vérification du token",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(401).json({ valid: false, message: error.message });
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
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { email } = req.body;

    if (!email) {
      await createAuditLog({
        ...auditData,
        action: "FORGOT_PASSWORD_ATTEMPT",
        entity: "Auth",
        description: "Demande de réinitialisation de mot de passe sans email",
        status: "ERROR",
      });

      res.status(400).json({
        message: "Email requis",
      });
      return;
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      await createAuditLog({
        ...auditData,
        action: "FORGOT_PASSWORD_REQUEST",
        entity: "Auth",
        description:
          "Demande de réinitialisation de mot de passe pour email non trouvé",
        status: "SUCCESS",
        metadata: { email },
      });

      res.json({
        message: "Si l'email existe, un lien de réinitialisation a été envoyé",
      });
      return;
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Générer le lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Envoyer l'email
    try {
      await sendEmail({
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour créer un nouveau mot de passe :</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
        `,
      });

      await createAuditLog({
        ...auditData,
        action: "FORGOT_PASSWORD_REQUEST",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Demande de réinitialisation de mot de passe envoyée",
        status: "SUCCESS",
        metadata: { emailSent: true },
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);

      const errorMessage =
        emailError instanceof Error
          ? emailError.message
          : "Erreur d'envoi d'email inconnue";

      await createAuditLog({
        ...auditData,
        action: "FORGOT_PASSWORD_REQUEST",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description: "Demande de réinitialisation - erreur envoi email",
        status: "ERROR",
        errorMessage: errorMessage,
        metadata: { emailSent: false },
      });
    }

    res.json({
      message: "Si l'email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);

    await createAuditLog({
      ...auditData,
      action: "FORGOT_PASSWORD_ERROR",
      entity: "Auth",
      description:
        "Erreur lors de la demande de réinitialisation de mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller resetPassword
 * @description Réinitialise le mot de passe avec un token valide
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      await createAuditLog({
        ...auditData,
        action: "RESET_PASSWORD_ATTEMPT",
        entity: "Auth",
        description:
          "Tentative de réinitialisation de mot de passe avec données manquantes",
        status: "ERROR",
        metadata: { missing: { token: !token, password: !password } },
      });

      res.status(400).json({
        message: "Token et nouveau mot de passe requis",
      });
      return;
    }

    if (password.length < 6) {
      await createAuditLog({
        ...auditData,
        action: "RESET_PASSWORD_ATTEMPT",
        entity: "Auth",
        description:
          "Tentative de réinitialisation avec mot de passe trop court",
        status: "ERROR",
        metadata: { passwordLength: password.length },
      });

      res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    // Trouver l'utilisateur avec un token valide
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Vérifier que le token n'a pas expiré
        },
      },
    });

    if (!user) {
      await createAuditLog({
        ...auditData,
        action: "RESET_PASSWORD_ATTEMPT",
        entity: "Auth",
        description:
          "Tentative de réinitialisation avec token invalide ou expiré",
        status: "ERROR",
        metadata: { token },
      });

      res.status(400).json({
        message: "Token invalide ou expiré",
      });
      return;
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe et effacer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "RESET_PASSWORD_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Mot de passe réinitialisé avec succès",
      status: "SUCCESS",
    });

    res.json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);

    await createAuditLog({
      ...auditData,
      action: "RESET_PASSWORD_ERROR",
      entity: "Auth",
      description: "Erreur lors de la réinitialisation du mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller verifyResetToken
 * @description Vérifie la validité d'un token de réinitialisation
 * @route GET /api/auth/verify-reset-token/:token
 * @access Public
 */
export const verifyResetToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { token } = req.params;

    if (!token) {
      await createAuditLog({
        ...auditData,
        action: "VERIFY_RESET_TOKEN_ATTEMPT",
        entity: "Auth",
        description: "Tentative de vérification de token sans token",
        status: "ERROR",
      });

      res.status(400).json({
        message: "Token requis",
      });
      return;
    }

    // Vérifier la validité du token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      await createAuditLog({
        ...auditData,
        action: "VERIFY_RESET_TOKEN_ATTEMPT",
        entity: "Auth",
        description: "Token de réinitialisation invalide ou expiré",
        status: "ERROR",
        metadata: { token },
      });

      res.status(400).json({
        valid: false,
        message: "Token invalide ou expiré",
      });
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "VERIFY_RESET_TOKEN_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Token de réinitialisation vérifié avec succès",
      status: "SUCCESS",
    });

    res.json({
      valid: true,
      message: "Token valide",
    });
  } catch (error: any) {
    console.error("Verify reset token error:", error);

    await createAuditLog({
      ...auditData,
      action: "VERIFY_RESET_TOKEN_ERROR",
      entity: "Auth",
      description:
        "Erreur lors de la vérification du token de réinitialisation",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller getResetPasswordPage
 * @description Récupère les informations pour la page de réinitialisation
 * @route GET /api/auth/reset-password/:token
 * @access Public
 */
export const getResetPasswordPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const { token } = req.params;

    if (!token) {
      await createAuditLog({
        ...auditData,
        action: "GET_RESET_PAGE_ATTEMPT",
        entity: "Auth",
        description:
          "Tentative d'accès à la page de réinitialisation sans token",
        status: "ERROR",
      });

      res.status(400).json({
        message: "Token requis",
      });
      return;
    }

    // Vérifier la validité du token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    });

    if (!user) {
      await createAuditLog({
        ...auditData,
        action: "GET_RESET_PAGE_ATTEMPT",
        entity: "Auth",
        description: "Token invalide pour accès à la page de réinitialisation",
        status: "ERROR",
        metadata: { token },
      });

      res.status(400).json({
        valid: false,
        message: "Token invalide ou expiré",
      });
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "GET_RESET_PAGE_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Accès à la page de réinitialisation autorisé",
      status: "SUCCESS",
    });

    // Renvoyer les informations nécessaires pour la page frontend
    res.json({
      valid: true,
      message: "Token valide",
      email: user.email,
      firstName: user.firstName,
      token: token,
    });
  } catch (error: any) {
    console.error("Get reset password page error:", error);

    await createAuditLog({
      ...auditData,
      action: "GET_RESET_PAGE_ERROR",
      entity: "Auth",
      description: "Erreur lors de l'accès à la page de réinitialisation",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller updateProfile
 * @description Met à jour le profil de l'utilisateur connecté
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const userId = (req as any).userId;
    const { firstName, lastName, phone } = req.body;

    if (!userId) {
      await createAuditLog({
        ...auditData,
        action: "UPDATE_PROFILE_ATTEMPT",
        entity: "Auth",
        description: "Tentative de mise à jour de profil sans userId",
        status: "ERROR",
      });

      res.status(401).json({ message: "Non autorisé" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        avatar: true,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "UPDATE_PROFILE_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Profil utilisateur mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        updatedFields: {
          firstName: !!firstName,
          lastName: !!lastName,
          phone: phone !== undefined,
        },
      },
    });

    res.json({
      message: "Profil mis à jour avec succès",
      user,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    await createAuditLog({
      ...auditData,
      action: "UPDATE_PROFILE_ERROR",
      entity: "Auth",
      description: "Erreur lors de la mise à jour du profil",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * @controller changePassword
 * @description Change le mot de passe de l'utilisateur connecté
 * @route PUT /api/auth/change-password
 * @access Private
 */
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = createSafeAuditData(extractAuditData(req));

  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      await createAuditLog({
        ...auditData,
        action: "CHANGE_PASSWORD_ATTEMPT",
        entity: "Auth",
        description: "Tentative de changement de mot de passe sans userId",
        status: "ERROR",
      });

      res.status(401).json({ message: "Non autorisé" });
      return;
    }

    if (!currentPassword || !newPassword) {
      await createAuditLog({
        ...auditData,
        action: "CHANGE_PASSWORD_ATTEMPT",
        entity: "User",
        entityId: userId,
        userId: userId,
        description:
          "Tentative de changement de mot de passe avec données manquantes",
        status: "ERROR",
        metadata: {
          missing: {
            currentPassword: !currentPassword,
            newPassword: !newPassword,
          },
        },
      });

      res.status(400).json({
        message: "Mot de passe actuel et nouveau mot de passe requis",
      });
      return;
    }

    if (newPassword.length < 6) {
      await createAuditLog({
        ...auditData,
        action: "CHANGE_PASSWORD_ATTEMPT",
        entity: "User",
        entityId: userId,
        userId: userId,
        description: "Tentative de changement avec mot de passe trop court",
        status: "ERROR",
        metadata: { newPasswordLength: newPassword.length },
      });

      res.status(400).json({
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      await createAuditLog({
        ...auditData,
        action: "CHANGE_PASSWORD_ATTEMPT",
        entity: "User",
        description:
          "Utilisateur non trouvé lors du changement de mot de passe",
        status: "ERROR",
        metadata: { userId },
      });

      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      await createAuditLog({
        ...auditData,
        action: "CHANGE_PASSWORD_FAILED",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        description:
          "Échec du changement de mot de passe - mot de passe actuel incorrect",
        status: "ERROR",
      });

      res.status(400).json({
        message: "Mot de passe actuel incorrect",
      });
      return;
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CHANGE_PASSWORD_SUCCESS",
      entity: "User",
      entityId: user.id,
      userId: user.id,
      description: "Mot de passe changé avec succès",
      status: "SUCCESS",
    });

    res.json({
      message: "Mot de passe modifié avec succès",
    });
  } catch (error: any) {
    console.error("Change password error:", error);

    await createAuditLog({
      ...auditData,
      action: "CHANGE_PASSWORD_ERROR",
      entity: "Auth",
      description: "Erreur lors du changement de mot de passe",
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
