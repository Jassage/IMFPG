/**
 * @file authRoutes.ts
 * @description Routes pour l'authentification et la gestion des utilisateurs
 * @version 1.0.0
 */

import { Router } from "express";
import {
  login,
  register,
  getMe,
  verifyToken,
  forgotPassword,
  checkPasswordChangeRequired,
  forcePasswordChange,
} from "../controllers/auth/authController";
import {
  validateLogin,
  validateRegister,
  validatePasswordChange,
  validateForgotPassword,
  validateResetPassword,
  validateProfileUpdate,
} from "../controllers/auth/authValidators";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  optionalAuth,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
} from "../middleware";
import {
  changePassword,
  getResetPasswordPage,
  loginLimiter,
  resetPassword,
  updateProfile,
  verifyPassword,
  verifyResetToken,
} from "../controllers/auth.Controllers";
import {
  activateUser,
  adminResetPassword,
  createUserByAdmin,
  deactivateUser,
  getUserById,
  getUserDependencies,
  getUsers,
  hardDeleteUser,
  searchUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController";
import {
  validateAdminPasswordReset,
  validateUserActivation,
  validateUserCreateByAdmin,
  validateUserDeactivation,
  validateUserRoleUpdate,
  validateUserSearch,
  validateUserStatusUpdate,
  validateUserUpdate,
} from "../utils/userValidators";

const router = Router();

/**
 * @route POST /api/auth/login
 * @description Authentifie un utilisateur et retourne un token JWT
 * @access Public
 */
router.post(
  "/login",
  loginLimiter, // Rate limiting
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateLogin,
  handleValidationErrors,
  login
);

/**
 * @route POST /api/auth/register
 * @description Crée un nouvel utilisateur dans le système
 * @access Public (en production, restreindre aux administrateurs)
 */
router.post(
  "/register",
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateRegister,
  handleValidationErrors,
  register
);

/**
 * @route GET /api/auth/me
 * @description Récupère le profil de l'utilisateur connecté
 * @access Private
 */
router.get("/me", requireAuth, getMe);

/**
 * @route GET /api/auth/verify
 * @description Vérifie la validité d'un token JWT
 * @access Public
 */
router.get("/verify", optionalAuth, verifyToken);
router.get("/check-password-change", requireAuth, checkPasswordChangeRequired);
router.post("/force-password-change", requireAuth, forcePasswordChange);

/**
 * @route POST /api/auth/verify-password
 * @description Vérifie le mot de passe actuel de l'utilisateur
 * @access Private
 */
router.post(
  "/verify-password",
  requireAuth,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  verifyPassword
);

/**
 * @route POST /api/auth/forgot-password
 * @description Envoie un email de réinitialisation de mot de passe
 * @access Public
 */
router.post(
  "/forgot-password",
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

/**
 * @route POST /api/auth/reset-password
 * @description Réinitialise le mot de passe avec un token valide
 * @access Public
 */
router.post(
  "/reset-password",
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateResetPassword,
  handleValidationErrors,
  resetPassword
);

/**
 * @route GET /api/auth/verify-reset-token/:token
 * @description Vérifie la validité d'un token de réinitialisation
 * @access Public
 */
router.get("/verify-reset-token/:token", sanitizeInput, verifyResetToken);

/**
 * @route GET /api/auth/reset-password/:token
 * @description Récupère les informations pour la page de réinitialisation
 * @access Public
 */
router.get("/reset-password/:token", sanitizeInput, getResetPasswordPage);

/**
 * @route PUT /api/auth/profile
 * @description Met à jour le profil de l'utilisateur connecté
 * @access Private
 */
router.put(
  "/profile",
  requireAuth,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);

/**
 * @route PUT /api/auth/change-password
 * @description Change le mot de passe de l'utilisateur connecté
 * @access Private
 */
router.put(
  "/change-password",
  requireAuth,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);

// =============================================================================
// ROUTES ADMINISTRATIVES (Accès restreint)
// =============================================================================

/**
 * @route GET /api/auth/users
 * @description Récupère la liste des utilisateurs (Admin seulement)
 * @access Admin
 */
router.get(
  "/users",
  requireAuth,
  requireAdmin
  // userController.getUsers // À implémenter
);

/**
 * @route GET /api/auth/users/:id
 * @description Récupère un utilisateur spécifique (Admin seulement)
 * @access Admin
 */
router.get(
  "/users/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput
  // userController.getUserById // À implémenter
);

/**
 * @route PUT /api/auth/users/:id
 * @description Met à jour un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  // validateUserUpdate, // À implémenter
  handleValidationErrors
  // userController.updateUser // À implémenter
);

/**
 * @route DELETE /api/auth/users/:id
 * @description Désactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput
  // userController.deactivateUser // À implémenter
);

/**
 * @route PUT /api/auth/users/:id/status
 * @description Change le statut d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id/status",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  // validateUserStatusUpdate, // À implémenter
  handleValidationErrors
  // userController.updateUserStatus // À implémenter
);

/**
 * @route PUT /api/auth/users/:id/role
 * @description Change le rôle d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id/role",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  // validateUserRoleUpdate, // À implémenter
  handleValidationErrors
  // userController.updateUserRole // À implémenter
);

/**
 * @route GET /api/auth/users
 * @description Récupère la liste des utilisateurs (Admin seulement)
 * @access Admin
 */

router.get("/users", requireAuth, requireAdmin, getUsers);

/**
 * @route GET /api/auth/users/:id
 * @description Récupère un utilisateur spécifique (Admin seulement)
 * @access Admin
 */
router.get("/users/:id", requireAuth, requireAdmin, sanitizeInput, getUserById);

/**
 * @route PUT /api/auth/users/:id
 * @description Met à jour un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserUpdate,
  handleValidationErrors,
  updateUser
);

/**
 * @route DELETE /api/auth/users/:id
 * @description Désactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deactivateUser
);

/**
 * @route PUT /api/auth/users/:id/status
 * @description Change le statut d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id/status",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserStatusUpdate,
  handleValidationErrors,
  updateUserStatus
);

/**
 * @route PUT /api/auth/users/:id/role
 * @description Change le rôle d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id/role",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserRoleUpdate,
  handleValidationErrors,
  updateUserRole
);

// Ajouter ces nouvelles routes :

/**
 * @route PUT /api/auth/users/:id/activate
 * @description Réactive un utilisateur (Admin seulement)
 * @access Admin
 */
router.put(
  "/users/:id/activate",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  activateUser
);

/**
 * @route POST /api/auth/users/:id/reset-password
 * @description Réinitialise le mot de passe d'un utilisateur (Admin seulement)
 * @access Admin
 */
router.post(
  "/users/:id/reset-password",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  adminResetPassword
);

// Ajouter la route de création d'utilisateur par admin
router.post(
  "/users",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserCreateByAdmin,
  handleValidationErrors,
  createUserByAdmin // À implémenter dans userController
);

// Mettre à jour la route de désactivation avec validateur
router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserDeactivation,
  handleValidationErrors,
  deactivateUser
);

// Mettre à jour la route de réactivation avec validateur
router.put(
  "/users/:id/activate",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserActivation,
  handleValidationErrors,
  activateUser
);

// Mettre à jour la route de réinitialisation de mot de passe avec validateur
router.post(
  "/users/:id/reset-password",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateAdminPasswordReset,
  handleValidationErrors,
  adminResetPassword
);

// Ajouter la route de recherche d'utilisateurs
router.post(
  "/users/search",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserSearch,
  handleValidationErrors,
  searchUsers // Importer les nouveaux validateurs
);

// Ajouter la route de création d'utilisateur par admin
router.post(
  "/users",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserCreateByAdmin,
  handleValidationErrors,
  createUserByAdmin // À implémenter dans userController
);

// Mettre à jour la route de désactivation avec validateur
router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserDeactivation,
  handleValidationErrors,
  deactivateUser
);

// Mettre à jour la route de réactivation avec validateur
router.put(
  "/users/:id/activate",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserActivation,
  handleValidationErrors,
  activateUser
);

// Mettre à jour la route de réinitialisation de mot de passe avec validateur
router.post(
  "/users/:id/reset-password",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateAdminPasswordReset,
  handleValidationErrors,
  adminResetPassword
);

// Ajouter la route de recherche d'utilisateurs
router.post(
  "/users/search",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUserSearch,
  handleValidationErrors,
  searchUsers // À implémenter dans userController
); // À implémenter dans userController

/**
 * @route DELETE /api/auth/users/:id/hard-delete
 * @description Supprime définitivement un utilisateur (Admin seulement)
 * @access Admin
 */
router.delete(
  "/users/:id/hard-delete",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  hardDeleteUser
);

/**
 * @route GET /api/auth/users/:id/dependencies
 * @description Récupère les dépendances d'un utilisateur avant suppression
 * @access Admin
 */
router.get(
  "/users/:id/dependencies",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  getUserDependencies
);
export default router;
