"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const professeurController_1 = require("../controllers/professeurController");
const middleware_1 = require("../middleware");
const express_1 = require("express");
const profesorValidator_1 = require("../utils/profesorValidator");
const router = (0, express_1.Router)();
/**
 * @route GET /api/professeurs
 * @description Récupère la liste des professeurs
 * @access Staff/Admin
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireStaff, professeurController_1.getProfesseurs);
/**
 * @route GET /api/professeurs/:id
 * @description Récupère un professeur par ID
 * @access Staff/Admin
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, professeurController_1.getProfesseurById);
/**
 * @route GET /api/:id/schedule
 * @description Récupère l'emploi du temps d'un professeur
 * @access Staff/Admin
 */
router.get("/:id/schedule", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, professeurController_1.getProfesseurSchedule);
/**
 * @route POST /api/professeurs
 * @description Crée un nouveau professeur
 * @access Admin
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, profesorValidator_1.validateProfesseurCreate, middleware_1.handleValidationErrors, professeurController_1.createProfesseur);
/**
 * @route PUT /api/professeurs/:id
 * @description Met à jour un professeur
 * @access Admin
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, profesorValidator_1.validateProfesseurUpdate, middleware_1.handleValidationErrors, professeurController_1.updateProfesseur);
/**
 * @route DELETE /api/academic/professeurs/:id
 * @description Supprime un professeur
 * @access Admin
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, professeurController_1.deleteProfesseur);
/**
 * @route PUT /api/professeurs/:id/activate
 * @description Active un professeur
 * @access Admin
 */
router.put("/:id/activate", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, professeurController_1.activateProfesseur);
/**
 * @route PUT /api/professeurs/:id/deactivate
 * @description Désactive un professeur
 * @access Admin
 */
router.put("/:id/deactivate", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, professeurController_1.deactivateProfesseur);
/*
 * @route GET /api/professeurs/:id/full-details
 * @description Récupère les détails complets d'un professeur, y compris les cours et les utilisateurs associés
 * @access Admin
 */
router.get("/:id/full-details", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, professeurController_1.getProfesseurFullDetails);
/**
 * @route POST /api/professeurs/:id/attach-user
 * @description Attache un compte utilisateur existant à un professeur
 * @access Admin
 */
router.post("/:id/attach-user", middleware_1.requireAdmin, middleware_1.requireAuth, professeurController_1.attachUserToProfesseur);
/**
 * @route DELETE /api/professeurs/:id/detach-user
 * @description Détache le compte utilisateur associé à un professeur
 * @access Admin
 */
router.delete("/:id/detach-user", middleware_1.requireAdmin, middleware_1.requireAuth, professeurController_1.detachUserFromProfesseur);
exports.default = router;
//# sourceMappingURL=professeurRoutes.js.map