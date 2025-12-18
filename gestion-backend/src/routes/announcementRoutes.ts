/**
 * @file announcementRoutes.ts
 * @description Routes pour la gestion des annonces
 * @version 1.0.0
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  requireTeacherOrStaff,
  requireAnyAuth,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
} from "../middleware";

import {
  validateAnnouncementQuery,
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
} from "../utils/announcementValidators";
import { eventController } from "../controllers/eventController";
import { announcementController } from "../controllers/announcementController";

const router = Router();

/**
 * @route GET /api/announcements
 * @description Récupère la liste des annonces avec filtres et pagination
 * @access Authentifié (avec restrictions selon rôle)
 */
router.get(
  "/",
  requireAuth,
  validateAnnouncementQuery,
  handleValidationErrors,
  announcementController.getAnnouncements
);

/**
 * @route GET /api/announcements/active
 * @description Récupère les annonces actives (pour affichage public)
 * @access Authentifié
 */
router.get(
  "/active",
  requireAuth,
  announcementController.getActiveAnnouncements
);

/**
 * @route GET /api/announcements/stats
 * @description Récupère les statistiques des annonces
 * @access Admin/Directeur
 */
router.get(
  "/stats",
  requireAuth,
  requireAdmin,
  announcementController.getAnnouncementStats
);

/**
 * @route GET /api/announcements/:id
 * @description Récupère une annonce par ID
 * @access Authentifié (avec restrictions selon audience)
 */
router.get(
  "/:id",
  requireAuth,
  sanitizeInput,
  announcementController.getAnnouncementById
);

/**
 * @route POST /api/announcements
 * @description Crée une nouvelle annonce
 * @access Admin/Directeur/Secretaire/Professeur
 */
router.post(
  "/",
  requireAuth,
  requireTeacherOrStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateAnnouncement,
  handleValidationErrors,
  announcementController.createAnnouncement
);

/**
 * @route PUT /api/announcements/:id
 * @description Met à jour une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.put(
  "/:id",
  requireAuth,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateAnnouncement,
  handleValidationErrors,
  announcementController.updateAnnouncement
);

/**
 * @route DELETE /api/announcements/:id
 * @description Supprime une annonce
 * @access Admin/Directeur
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  announcementController.deleteAnnouncement
);

/**
 * @route POST /api/announcements/:id/deactivate
 * @description Désactive une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.post(
  "/:id/deactivate",
  requireAuth,
  sanitizeInput,
  announcementController.deactivateAnnouncement
);

/**
 * @route POST /api/announcements/:id/activate
 * @description Active une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.post(
  "/:id/activate",
  requireAuth,
  sanitizeInput,
  announcementController.activateAnnouncement
);

export default router;
