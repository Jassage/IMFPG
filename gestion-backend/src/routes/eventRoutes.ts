/**
 * @file eventRoutes.ts
 * @description Routes pour la gestion des événements
 * @version 1.0.0
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  requireTeacherOrStaff,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
  requireDirector,
} from "../middleware";

import {
  validateCreateEvent,
  validateUpdateEvent,
  validateEventQuery,
} from "../utils/eventValidators";
import { eventController } from "../controllers/eventController";

const router = Router();

/**
 * @route GET /api/events
 * @description Récupère la liste des événements avec filtres et pagination
 * @access Public (avec restrictions selon rôle)
 */
router.get(
  "/",
  requireAuth,
  validateEventQuery,
  handleValidationErrors,
  eventController.getEvents
);

/**
 * @route GET /api/events/upcoming
 * @description Récupère les événements à venir
 * @access Public (avec restrictions selon rôle)
 */
router.get("/upcoming", requireAuth, eventController.getUpcomingEvents);

/**
 * @route GET /api/events/stats
 * @description Récupère les statistiques des événements
 * @access Admin/Directeur
 */
router.get(
  "/stats",
  requireAuth,
  requireDirector,
  eventController.getEventStats
);

/**
 * @route GET /api/events/category/:category
 * @description Récupère les événements par catégorie
 * @access Public (avec restrictions selon rôle)
 */
router.get(
  "/category/:category",
  requireAuth,
  eventController.getEventsByCategory
);

/**
 * @route GET /api/events/:id
 * @description Récupère un événement par ID
 * @access Public (avec restrictions selon rôle)
 */
router.get("/:id", requireAuth, sanitizeInput, eventController.getEventById);

/**
 * @route POST /api/events
 * @description Crée un nouvel événement
 * @access Admin/Directeur/Secretaire
 */
router.post(
  "/",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateEvent,
  handleValidationErrors,
  eventController.createEvent
);

/**
 * @route PUT /api/events/:id
 * @description Met à jour un événement
 * @access Admin/Directeur/Secretaire
 */
router.put(
  "/:id",
  requireAuth,
  requireStaff,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateEvent,
  handleValidationErrors,
  eventController.updateEvent
);

/**
 * @route DELETE /api/events/:id
 * @description Supprime un événement
 * @access Admin/Directeur
 */
router.delete(
  "/:id",
  requireAuth,
  requireStaff,
  sanitizeInput,
  eventController.deleteEvent
);

export default router;
