"use strict";
/**
 * @file classRoutes.ts
 * @description Routes pour la gestion des classes scolaires
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const classController_1 = require("../controllers/classController");
const classValidators_1 = require("../utils/classValidators");
const router = (0, express_1.Router)();
/**
 * @route GET /api/academic/classes
 * @description Récupère la liste des classes
 * @access Staff/Admin
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireTeacherOrStaff, classController_1.getClasses);
/**
 * @route GET /api/academic/classes/:id
 * @description Récupère une classe par ID
 * @access Staff/Admin
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, classController_1.getClassById);
/**
 * @route GET /api/academic/classes/:id/stats
 * @description Récupère les statistiques d'une classe
 * @access Staff/Admin
 */
router.get("/:id/stats", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, classController_1.getClassStats);
/**
 * @route POST /api/academic/classes
 * @description Crée une nouvelle classe
 * @access Admin
 */
router.post("/", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, classValidators_1.validateCreateClass, middleware_1.handleValidationErrors, classController_1.createClass);
/**
 * @route PUT /api/academic/classes/:id
 * @description Met à jour une classe
 * @access Admin
 */
router.put("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, classValidators_1.validateUpdateClass, middleware_1.handleValidationErrors, classController_1.updateClass);
/**
 * @route DELETE /api/academic/classes/:id
 * @description Supprime une classe
 * @access Admin
 */
router.delete("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, classController_1.deleteClass);
exports.default = router;
//# sourceMappingURL=classRoutes.js.map