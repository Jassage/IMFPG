"use strict";
/**
 * @file authRoutes.ts
 * @description Routes pour l'authentification et la gestion des utilisateurs
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/auth/authController");
const authValidators_1 = require("../controllers/auth/authValidators");
const middleware_1 = require("../middleware");
const auth_Controllers_1 = require("../controllers/auth.Controllers");
const userController_1 = require("../controllers/userController");
const userValidators_1 = require("../utils/userValidators");
const router = (0, express_1.Router)();
/**
 * @route POST /api/auth/login
 * @description Authentifie un utilisateur et retourne un token JWT
 * @access Public
 */
router.post("/login", auth_Controllers_1.loginLimiter, // Rate limiting
(0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validateLogin, middleware_1.handleValidationErrors, authController_1.login);
/**
 * @route POST /api/auth/register
 * @description Crée un nouvel utilisateur dans le système
 * @access Public (en production, restreindre aux administrateurs)
 */
router.post("/register", (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validateRegister, middleware_1.handleValidationErrors, authController_1.register);
/**
 * @route GET /api/auth/me
 * @description Récupère le profil de l'utilisateur connecté
 * @access Private
 */
router.get("/me", middleware_1.requireAuth, authController_1.getMe);
/**
 * @route GET /api/auth/verify
 * @description Vérifie la validité d'un token JWT
 * @access Public
 */
router.get("/verify", middleware_1.optionalAuth, authController_1.verifyToken);
router.get("/check-password-change", middleware_1.requireAuth, authController_1.checkPasswordChangeRequired);
router.post("/force-password-change", middleware_1.requireAuth, authController_1.forcePasswordChange);
/**
 * @route POST /api/auth/verify-password
 * @description Vérifie le mot de passe actuel de l'utilisateur
 * @access Private
 */
router.post("/verify-password", middleware_1.requireAuth, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, middleware_1.handleValidationErrors, auth_Controllers_1.verifyPassword);
/**
 * @route POST /api/auth/forgot-password
 * @description Envoie un email de réinitialisation de mot de passe
 * @access Public
 */
router.post("/forgot-password", (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validateForgotPassword, middleware_1.handleValidationErrors, authController_1.forgotPassword);
/**
 * @route POST /api/auth/reset-password
 * @description Réinitialise le mot de passe avec un token valide
 * @access Public
 */
router.post("/reset-password", (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validateResetPassword, middleware_1.handleValidationErrors, auth_Controllers_1.resetPassword);
/**
 * @route GET /api/auth/verify-reset-token/:token
 * @description Vérifie la validité d'un token de réinitialisation
 * @access Public
 */
router.get("/verify-reset-token/:token", middleware_1.sanitizeInput, auth_Controllers_1.verifyResetToken);
/**
 * @route GET /api/auth/reset-password/:token
 * @description Récupère les informations pour la page de réinitialisation
 * @access Public
 */
router.get("/reset-password/:token", middleware_1.sanitizeInput, auth_Controllers_1.getResetPasswordPage);
/**
 * @route PUT /api/auth/profile
 * @description Met à jour le profil de l'utilisateur connecté
 * @access Private
 */
router.put("/profile", middleware_1.requireAuth, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validateProfileUpdate, middleware_1.handleValidationErrors, auth_Controllers_1.updateProfile);
/**
 * @route PUT /api/auth/change-password
 * @description Change le mot de passe de l'utilisateur connecté
 * @access Private
 */
router.put("/change-password", middleware_1.requireAuth, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, authValidators_1.validatePasswordChange, middleware_1.handleValidationErrors, auth_Controllers_1.changePassword);
// =============================================================================
// ROUTES ADMINISTRATIVES (Accès restreint)
// =============================================================================
/**
 * @route GET /api/auth/users
 * @description Récupère la liste des utilisateurs (Admin seulement)
 * @access Admin
 */
router.get("/users", middleware_1.requireAuth, middleware_1.requireAdmin
// userController.getUsers // À implémenter
);
/**
 * @route GET /api/auth/users/:id
 * @description Récupère un utilisateur spécifique (Admin seulement)
 * @access Admin
 */
router.get("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput
// userController.getUserById // À implémenter
);
/**
 * @route PUT /api/auth/users/:id
 * @description Met à jour un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, 
// validateUserUpdate, // À implémenter
middleware_1.handleValidationErrors
// userController.updateUser // À implémenter
);
/**
 * @route DELETE /api/auth/users/:id
 * @description Désactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput
// userController.deactivateUser // À implémenter
);
/**
 * @route PUT /api/auth/users/:id/status
 * @description Change le statut d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id/status", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, 
// validateUserStatusUpdate, // À implémenter
middleware_1.handleValidationErrors
// userController.updateUserStatus // À implémenter
);
/**
 * @route PUT /api/auth/users/:id/role
 * @description Change le rôle d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id/role", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, 
// validateUserRoleUpdate, // À implémenter
middleware_1.handleValidationErrors
// userController.updateUserRole // À implémenter
);
/**
 * @route GET /api/auth/users
 * @description Récupère la liste des utilisateurs (Admin seulement)
 * @access Admin
 */
router.get("/users", middleware_1.requireAuth, middleware_1.requireAdmin, userController_1.getUsers);
/**
 * @route GET /api/auth/users/:id
 * @description Récupère un utilisateur spécifique (Admin seulement)
 * @access Admin
 */
router.get("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.getUserById);
/**
 * @route PUT /api/auth/users/:id
 * @description Met à jour un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserUpdate, middleware_1.handleValidationErrors, userController_1.updateUser);
/**
 * @route DELETE /api/auth/users/:id
 * @description Désactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.deactivateUser);
/**
 * @route PUT /api/auth/users/:id/status
 * @description Change le statut d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id/status", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserStatusUpdate, middleware_1.handleValidationErrors, userController_1.updateUserStatus);
/**
 * @route PUT /api/auth/users/:id/role
 * @description Change le rôle d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id/role", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserRoleUpdate, middleware_1.handleValidationErrors, userController_1.updateUserRole);
// Ajouter ces nouvelles routes :
/**
 * @route PUT /api/auth/users/:id/activate
 * @description Réactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.put("/users/:id/activate", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.activateUser);
/**
 * @route POST /api/auth/users/:id/reset-password
 * @description Réinitialise le mot de passe d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.post("/users/:id/reset-password", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.adminResetPassword);
// Ajouter la route de création d'utilisateur par admin
router.post("/users", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserCreateByAdmin, middleware_1.handleValidationErrors, userController_1.createUserByAdmin // À implémenter dans userController
);
// Mettre à jour la route de désactivation avec validateur
router.delete("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserDeactivation, middleware_1.handleValidationErrors, userController_1.deactivateUser);
// Mettre à jour la route de réactivation avec validateur
router.put("/users/:id/activate", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserActivation, middleware_1.handleValidationErrors, userController_1.activateUser);
// Mettre à jour la route de réinitialisation de mot de passe avec validateur
router.post("/users/:id/reset-password", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateAdminPasswordReset, middleware_1.handleValidationErrors, userController_1.adminResetPassword);
// Ajouter la route de recherche d'utilisateurs
router.post("/users/search", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserSearch, middleware_1.handleValidationErrors, userController_1.searchUsers // Importer les nouveaux validateurs
);
// Ajouter la route de création d'utilisateur par admin
router.post("/users", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserCreateByAdmin, middleware_1.handleValidationErrors, userController_1.createUserByAdmin // À implémenter dans userController
);
// Mettre à jour la route de désactivation avec validateur
router.delete("/users/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserDeactivation, middleware_1.handleValidationErrors, userController_1.deactivateUser);
// Mettre à jour la route de réactivation avec validateur
router.put("/users/:id/activate", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserActivation, middleware_1.handleValidationErrors, userController_1.activateUser);
// Mettre à jour la route de réinitialisation de mot de passe avec validateur
router.post("/users/:id/reset-password", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateAdminPasswordReset, middleware_1.handleValidationErrors, userController_1.adminResetPassword);
// Ajouter la route de recherche d'utilisateurs
router.post("/users/search", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, userValidators_1.validateUserSearch, middleware_1.handleValidationErrors, userController_1.searchUsers // À implémenter dans userController
); // À implémenter dans userController
/**
 * @route DELETE /api/auth/users/:id/hard-delete
 * @description Supprime définitivement un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete("/users/:id/hard-delete", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.hardDeleteUser);
/**
 * @route GET /api/auth/users/:id/dependencies
 * @description Récupère les dépendances d'un utilisateur avant suppression
 * @access Admin
 */
router.get("/users/:id/dependencies", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, userController_1.getUserDependencies);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map