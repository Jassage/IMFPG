"use strict";
/**
 * @file authMiddleware.ts
 * @description Middlewares d'authentification et d'autorisation
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectUserToResponse = exports.isUserAuthenticated = exports.getUserRoleFromRequest = exports.getUserIdFromRequest = exports.requireAnyAuth = exports.requireStudentOrParent = exports.requireTeacherOrStaff = exports.requireStudent = exports.requireParent = exports.requireTeacher = exports.requireStaff = exports.requireAdmin = exports.requireRole = exports.optionalAuth = exports.requireAuth = exports.authenticateToken = void 0;
const security_1 = require("../utils/security");
const userService_1 = require("../services/userService");
/**
 * @middleware authenticateToken
 * @description Vérifie et valide le token JWT, récupère le profil utilisateur
 * @param {AuthMiddlewareOptions} options - Options du middleware
 */
// CORRECTION dans authMiddleware.ts
const authenticateToken = (options = {}) => {
    const { requireAuth = true, allowedRoles = [] } = options;
    return async (req, res, next) => {
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
                const decoded = (0, security_1.verifyJwtToken)(token);
                // Récupérer l'utilisateur
                const user = await userService_1.UserService.getUserProfile(decoded.id);
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
            }
            catch (tokenError) {
                // Token invalide ou expiré
                return res.status(401).json({
                    success: false,
                    message: "Token invalide ou expiré",
                    code: "INVALID_TOKEN",
                });
            }
        }
        catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(500).json({
                success: false,
                message: "Erreur d'authentification",
                code: "AUTH_ERROR",
            });
        }
    };
};
exports.authenticateToken = authenticateToken;
/**
 * @function extractTokenFromRequest
 * @description Extrait le token JWT de la requête depuis différents emplacements
 * @param {Request} req - Requête Express
 * @returns {string | null} Token JWT ou null
 */
const extractTokenFromRequest = (req) => {
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
exports.requireAuth = (0, exports.authenticateToken)({ requireAuth: true });
/**
 * @middleware optionalAuth
 * @description Middleware avec authentification optionnelle
 */
exports.optionalAuth = (0, exports.authenticateToken)({ requireAuth: false });
/**
 * @middleware requireRole
 * @description Middleware qui vérifie le rôle de l'utilisateur
 * @param {string[]} roles - Rôles autorisés
 */
const requireRole = (roles) => {
    return (0, exports.authenticateToken)({
        requireAuth: true,
        allowedRoles: roles,
    });
};
exports.requireRole = requireRole;
/**
 * @middleware requireAdmin
 * @description Middleware qui requiert le rôle Admin
 */
exports.requireAdmin = (0, exports.requireRole)(["Admin"]);
/**
 * @middleware requireStaff
 * @description Middleware qui requiert un rôle de staff (administration)
 */
exports.requireStaff = (0, exports.requireRole)(["Admin", "Directeur", "Secretaire"]);
/**
 * @middleware requireTeacher
 * @description Middleware qui requiert le rôle Professeur
 */
exports.requireTeacher = (0, exports.requireRole)(["Professeur", "Admin", "Directeur"]);
/**
 * @middleware requireParent
 * @description Middleware qui requiert le rôle Parent
 */
exports.requireParent = (0, exports.requireRole)(["Parent"]);
/**
 * @middleware requireStudent
 * @description Middleware qui requiert le rôle Student
 */
exports.requireStudent = (0, exports.requireRole)(["Student"]);
/**
 * @middleware requireTeacherOrStaff
 * @description Middleware qui requiert un rôle de professeur ou staff
 */
exports.requireTeacherOrStaff = (0, exports.requireRole)([
    "Admin",
    "Directeur",
    "Secretaire",
    "Professeur",
]);
/**
 * @middleware requireStudentOrParent
 * @description Middleware qui requiert un rôle d'élève ou parent
 */
exports.requireStudentOrParent = (0, exports.requireRole)(["Student", "Parent"]);
/**
 * @middleware requireAnyAuth
 * @description Middleware qui requiert n'importe quel rôle authentifié
 */
exports.requireAnyAuth = (0, exports.requireRole)([
    "Admin",
    "Directeur",
    "Secretaire",
    "Professeur",
    "Parent",
    "Student",
]);
/**
 * @function getUserIdFromRequest
 * @description Extrait l'ID utilisateur de la requête de manière sécurisée
 * @param {AuthRequest} req - Requête Express
 * @returns {string | null} ID utilisateur ou null
 */
const getUserIdFromRequest = (req) => {
    return req.userId || null;
};
exports.getUserIdFromRequest = getUserIdFromRequest;
/**
 * @function getUserRoleFromRequest
 * @description Extrait le rôle utilisateur de la requête
 * @param {AuthRequest} req - Requête Express
 * @returns {string | null} Rôle utilisateur ou null
 */
const getUserRoleFromRequest = (req) => {
    return req.user?.role || null;
};
exports.getUserRoleFromRequest = getUserRoleFromRequest;
/**
 * @function isUserAuthenticated
 * @description Vérifie si l'utilisateur est authentifié
 * @param {AuthRequest} req - Requête Express
 * @returns {boolean} True si l'utilisateur est authentifié
 */
const isUserAuthenticated = (req) => {
    return !!req.userId && !!req.user;
};
exports.isUserAuthenticated = isUserAuthenticated;
/**
 * @middleware injectUserToResponse
 * @description Injecte les informations utilisateur dans la réponse pour le frontend
 */
const injectUserToResponse = (req, res, next) => {
    // Sauvegarder la méthode json originale
    const originalJson = res.json;
    // Override de la méthode json
    res.json = function (data) {
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
exports.injectUserToResponse = injectUserToResponse;
/**
 * @function getUserPermissions
 * @description Détermine les permissions basées sur le rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string[]} Liste des permissions
 */
const getUserPermissions = (role) => {
    const permissions = {
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
//# sourceMappingURL=auth.middleware.js.map