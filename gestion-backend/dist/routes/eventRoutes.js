"use strict";
/**
 * @file eventRoutes.ts
 * @description Routes pour la gestion des événements
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const eventValidators_1 = require("../utils/eventValidators");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
/**
 * @route GET /api/events
 * @description Récupère la liste des événements avec filtres et pagination
 * @access Public (avec restrictions selon rôle)
 */
router.get("/", middleware_1.requireAuth, eventValidators_1.validateEventQuery, middleware_1.handleValidationErrors, eventController_1.eventController.getEvents);
/**
 * @route GET /api/events/upcoming
 * @description Récupère les événements à venir
 * @access Public (avec restrictions selon rôle)
 */
router.get("/upcoming", middleware_1.requireAuth, eventController_1.eventController.getUpcomingEvents);
/**
 * @route GET /api/events/stats
 * @description Récupère les statistiques des événements
 * @access Admin/Directeur
 */
router.get("/stats", middleware_1.requireAuth, middleware_1.requireAdmin, eventController_1.eventController.getEventStats);
/**
 * @route GET /api/events/category/:category
 * @description Récupère les événements par catégorie
 * @access Public (avec restrictions selon rôle)
 */
router.get("/category/:category", middleware_1.requireAuth, eventController_1.eventController.getEventsByCategory);
/**
 * @route GET /api/events/:id
 * @description Récupère un événement par ID
 * @access Public (avec restrictions selon rôle)
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.sanitizeInput, eventController_1.eventController.getEventById);
/**
 * @route POST /api/events
 * @description Crée un nouvel événement
 * @access Admin/Directeur/Secretaire
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, eventValidators_1.validateCreateEvent, middleware_1.handleValidationErrors, eventController_1.eventController.createEvent);
/**
 * @route PUT /api/events/:id
 * @description Met à jour un événement
 * @access Admin/Directeur/Secretaire
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, eventValidators_1.validateUpdateEvent, middleware_1.handleValidationErrors, eventController_1.eventController.updateEvent);
/**
 * @route DELETE /api/events/:id
 * @description Supprime un événement
 * @access Admin/Directeur
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, eventController_1.eventController.deleteEvent);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map