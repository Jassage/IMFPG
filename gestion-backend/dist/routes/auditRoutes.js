"use strict";
/**
 * @file auditRoutes.ts
 * @description Routes pour la gestion des logs d'audit
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditController_1 = require("../controllers/auditController");
const middleware_1 = require("../middleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route GET /api/audit-logs
 * @description Récupère les logs d'audit avec pagination
 * @access Admin seulement
 */
router.get("/", middleware_1.requireAuth, middleware_1.requireAdmin, validationMiddleware_1.validatePagination, auditController_1.getAuditLogs);
/**
 * @route GET /api/audit-logs/export
 * @description Exporte les logs d'audit en CSV ou JSON
 * @access Admin seulement
 */
router.get("/export", middleware_1.requireAuth, middleware_1.requireAdmin, auditController_1.exportAuditLogs);
/**
 * @route GET /api/audit-logs/stats
 * @description Récupère les statistiques des logs d'audit
 * @access Admin seulement
 */
router.get("/stats", middleware_1.requireAuth, middleware_1.requireAdmin, auditController_1.getAuditStats);
/**
 * @route GET /api/audit-logs/:id
 * @description Récupère un log d'audit spécifique
 * @access Admin seulement
 */
router.get("/:id", middleware_1.requireAuth, middleware_1.requireAdmin, auditController_1.getAuditLogById);
/**
 * @route GET /api/audit-logs/user/:userId
 * @description Récupère les logs d'audit d'un utilisateur
 * @access Admin seulement
 */
router.get("/user/:userId", middleware_1.requireAuth, middleware_1.requireAdmin, validationMiddleware_1.validatePagination, auditController_1.getUserAuditLogs);
exports.default = router;
//# sourceMappingURL=auditRoutes.js.map