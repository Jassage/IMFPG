/**
 * @file authMiddleware.ts
 * @description Middlewares d'authentification et d'autorisation
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/security";
import { AuthRequest } from "../controllers/auth/authTypes";
import { UserService } from "../services/userService";
import { createAuditLog } from "../controllers/auditController";
import {
  createSafeAuditData,
  extractAuditData,
} from "../controllers/auth/authUtils";

/**
 * @interface AuthMiddlewareOptions
 * @description Options pour le middleware d'authentification
 */
interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  requireProfile?: boolean;
}

/**
 * @interface AuthenticatedUser
 * @description Utilisateur authentifié avec données complètes
 */
interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  status: string;
  profile?: any;
}

/**
 * @middleware authenticateToken
 * @description Vérifie et valide le token JWT, récupère le profil utilisateur
 * @param {AuthMiddlewareOptions} options - Options du middleware
 */
// CORRECTION dans authMiddleware.ts
export const authenticateToken = (options: AuthMiddlewareOptions = {}) => {
  const { requireAuth = true, allowedRoles = [] } = options;

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Extraire le token
      const token = req.header("Authorization")?.replace("Bearer ", "");

      // Si authentification requise mais pas de token
      if (requireAuth && !token) {
        return res.status(401).json({
          success: false,
          message: "Authentification requise",
          code: "UNAUTHORIZED",
        });
      }

      // Si pas de token et auth non requise, continuer
      if (!token) {
        return next();
      }

      // Vérifier le token
      try {
        const decoded = verifyJwtToken(token);

        // Récupérer l'utilisateur
        const user = await UserService.getUserProfile(decoded.id);

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Utilisateur non trouvé",
            code: "USER_NOT_FOUND",
          });
        }

        // Vérifier le statut
        if (user.status !== "Actif") {
          return res.status(403).json({
            success: false,
            message: "Compte désactivé",
            code: "ACCOUNT_DISABLED",
          });
        }

        // Ajouter l'utilisateur à la requête
        req.userId = user.id;
        req.user = user;
        req.user.role = user.role;
        req.user.requiresPasswordChange = user.requiresPasswordChange || false;

        // Vérifier les rôles
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          return res.status(403).json({
            success: false,
            message: "Accès non autorisé",
            code: "FORBIDDEN",
          });
        }

        next();
      } catch (tokenError) {
        // Token invalide ou expiré
        return res.status(401).json({
          success: false,
          message: "Token invalide ou expiré",
          code: "INVALID_TOKEN",
        });
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur d'authentification",
        code: "AUTH_ERROR",
      });
    }
  };
};

/**
 * @function extractTokenFromRequest
 * @description Extrait le token JWT de la requête depuis différents emplacements
 * @param {Request} req - Requête Express
 * @returns {string | null} Token JWT ou null
 */
const extractTokenFromRequest = (req: Request): string | null => {
  // 1. Depuis le header Authorization
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  // 2. Depuis le query parameter
  if (req.query && typeof req.query.token === "string") {
    return req.query.token;
  }

  // 3. Depuis les cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

/**
 * @middleware requireAuth
 * @description Middleware qui requiert une authentification
 */
export const requireAuth = authenticateToken({ requireAuth: true });

/**
 * @middleware optionalAuth
 * @description Middleware avec authentification optionnelle
 */
export const optionalAuth = authenticateToken({ requireAuth: false });

/**
 * @middleware requireRole
 * @description Middleware qui vérifie le rôle de l'utilisateur
 * @param {string[]} roles - Rôles autorisés
 */
export const requireRole = (roles: string[]) => {
  return authenticateToken({
    requireAuth: true,
    allowedRoles: roles,
  });
};

/**
 * @middleware requireAdmin
 * @description Middleware qui requiert le rôle Admin
 */
export const requireAdmin = requireRole(["Admin"]);

/**
 * @middleware requireStaff
 * @description Middleware qui requiert un rôle de staff (administration)
 */
export const requireStaff = requireRole([
  "Admin",
  "Directeur",
  "Secretaire",
  "Comptable",
]);

/**
 * @middleware requireDirector
 * @description Middleware qui requiert le rôle Directeur
 */
export const requireDirector = requireRole(["Directeur", "Admin"]);

/**
 * @middleware requireComptable
 * @description Middleware qui requiert le rôle Comptable
 */
export const requireComptable = requireRole(["Comptable", "Admin"]);

/**
 * @middleware requireTeacher
 * @description Middleware qui requiert le rôle Professeur
 */
export const requireTeacher = requireRole(["Professeur", "Admin"]);

/**
 * @middleware requireStudent
 * @description Middleware qui requiert le rôle Student
 */
export const requireStudent = requireRole(["Student"]);

/**
 * @middleware requireSecretary
 * @description Middleware qui requiert le role Student
 */
export const requireSecretary = requireRole(["Secretaire", "Admin"]);

/**
 * @middleware requireTeacherOrStaff
 * @description Middleware qui requiert un rôle de professeur ou staff
 */
export const requireTeacherOrStaff = requireRole([
  "Admin",
  "Directeur",
  "Secretaire",
  "Professeur",
  "Comptable",
]);

/**
 * @middleware requireStudentOrParent
 * @description Middleware qui requiert un rôle d'élève ou parent
 */
export const requireStudentOrParent = requireRole(["Student", "Parent"]);

/**
 * @middleware requireAnyAuth
 * @description Middleware qui requiert n'importe quel rôle authentifié
 */
export const requireAnyAuth = requireRole([
  "Admin",
  "Directeur",
  "Secretaire",
  "Professeur",
  "Comptable",
  "Student",
]);

/**
 * @function getUserIdFromRequest
 * @description Extrait l'ID utilisateur de la requête de manière sécurisée
 * @param {AuthRequest} req - Requête Express
 * @returns {string | null} ID utilisateur ou null
 */
export const getUserIdFromRequest = (req: AuthRequest): string | null => {
  return req.userId || null;
};

/**
 * @function getUserRoleFromRequest
 * @description Extrait le rôle utilisateur de la requête
 * @param {AuthRequest} req - Requête Express
 * @returns {string | null} Rôle utilisateur ou null
 */
export const getUserRoleFromRequest = (req: AuthRequest): string | null => {
  return req.user?.role || null;
};

/**
 * @function isUserAuthenticated
 * @description Vérifie si l'utilisateur est authentifié
 * @param {AuthRequest} req - Requête Express
 * @returns {boolean} True si l'utilisateur est authentifié
 */
export const isUserAuthenticated = (req: AuthRequest): boolean => {
  return !!req.userId && !!req.user;
};

/**
 * @middleware injectUserToResponse
 * @description Injecte les informations utilisateur dans la réponse pour le frontend
 */
export const injectUserToResponse = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Sauvegarder la méthode json originale
  const originalJson = res.json;

  // Override de la méthode json
  res.json = function (data: any) {
    // Si l'utilisateur est authentifié et que c'est une réponse JSON
    if (req.user && typeof data === "object" && data !== null) {
      // Ajouter les infos utilisateur aux réponses réussies
      if (data.success !== false) {
        data.userContext = {
          id: req.user.id,
          role: req.user.role,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          permissions: getUserPermissions(req.user.role),
        };
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * @function getUserPermissions
 * @description Détermine les permissions basées sur le rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string[]} Liste des permissions
 */
const getUserPermissions = (role: string): string[] => {
  const permissions: { [key: string]: string[] } = {
    Admin: [
      "read:users",
      "write:users",
      "delete:users",
      "read:students",
      "write:students",
      "delete:students",
      "read:teachers",
      "write:teachers",
      "delete:teachers",
      "read:grades",
      "write:grades",
      "delete:grades",
      "read:classes",
      "write:classes",
      "delete:classes",
      "read:financial",
      "write:financial",
      "delete:financial",
      "read:reports",
      "write:reports",
      "delete:reports",
      "read:system",
      "write:system",
      "delete:system",
    ],
    Directeur: [
      "read:users",
      "write:users",
      "read:students",
      "write:students",
      "read:teachers",
      "write:teachers",
      "read:grades",
      "write:grades",
      "read:classes",
      "write:classes",
      "read:financial",
      "write:financial",
      "read:reports",
      "write:reports",
    ],
    Secretaire: [
      "read:users",
      "read:students",
      "write:students",
      "read:teachers",
      "read:grades",
      "write:grades",
      "read:classes",
      "write:classes",
      "read:financial",
      "write:financial",
    ],
    Professeur: [
      "read:students",
      "read:grades",
      "write:grades",
      "read:classes",
    ],
    Parent: ["read:students", "read:grades", "read:financial"],
    Student: ["read:grades", "read:financial"],
  };

  return permissions[role] || [];
};
