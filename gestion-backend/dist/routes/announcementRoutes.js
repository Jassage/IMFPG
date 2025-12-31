"use strict";
/**
 * @file announcementRoutes.ts
 * @description Routes pour la gestion des annonces
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const announcementValidators_1 = require("../utils/announcementValidators");
const announcementController_1 = require("../controllers/announcementController");
const router = (0, express_1.Router)();
/**
 * @route GET /api/announcements
 * @description Récupère la liste des annonces avec filtres et pagination
 * @access Authentifié (avec restrictions selon rôle)
 */
router.get("/", middleware_1.requireAuth, announcementValidators_1.validateAnnouncementQuery, middleware_1.handleValidationErrors, announcementController_1.announcementController.getAnnouncements);
/**
 * @route GET /api/announcements/active
 * @description Récupère les annonces actives (pour affichage public)
 * @access Authentifié
 */
router.get("/active", middleware_1.requireAuth, announcementController_1.announcementController.getActiveAnnouncements);
/**
 * @route GET /api/announcements/stats
 * @description Récupère les statistiques des annonces
 * @access Admin/Directeur
 */
router.get("/stats", middleware_1.requireAuth, middleware_1.requireAdmin, announcementController_1.announcementController.getAnnouncementStats);
/**
 * @route GET /api/announcements/:id
 * @description Récupère une annonce par ID
 * @access Authentifié (avec restrictions selon audience)
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.sanitizeInput, announcementController_1.announcementController.getAnnouncementById);
/**
 * @route POST /api/announcements
 * @description Crée une nouvelle annonce
 * @access Admin/Directeur/Secretaire/Professeur
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, announcementValidators_1.validateCreateAnnouncement, middleware_1.handleValidationErrors, announcementController_1.announcementController.createAnnouncement);
/**
 * @route PUT /api/announcements/:id
 * @description Met à jour une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.put("/:id", middleware_1.requireAuth, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, announcementValidators_1.validateUpdateAnnouncement, middleware_1.handleValidationErrors, announcementController_1.announcementController.updateAnnouncement);
/**
 * @route DELETE /api/announcements/:id
 * @description Supprime une annonce
 * @access Admin/Directeur
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, announcementController_1.announcementController.deleteAnnouncement);
/**
 * @route POST /api/announcements/:id/deactivate
 * @description Désactive une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.post("/:id/deactivate", middleware_1.requireAuth, middleware_1.sanitizeInput, announcementController_1.announcementController.deactivateAnnouncement);
/**
 * @route POST /api/announcements/:id/activate
 * @description Active une annonce
 * @access Admin/Directeur/Secretaire/Professeur (pour leurs propres annonces)
 */
router.post("/:id/activate", middleware_1.requireAuth, middleware_1.sanitizeInput, announcementController_1.announcementController.activateAnnouncement);
exports.default = router;
//# sourceMappingURL=announcementRoutes.js.map