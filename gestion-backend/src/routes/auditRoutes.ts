/**
 * @file auditRoutes.ts
 * @description Routes pour la gestion des logs d'audit
 * @version 1.0.0
 */

import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogById,
  getUserAuditLogs,
  getAuditStats,
} from "../controllers/auditController";
import { requireAuth, requireAdmin } from "../middleware";
import { validatePagination } from "../middleware/validationMiddleware";

const router = Router();

/**
 * @route GET /api/audit-logs
 * @description Récupère les logs d'audit avec pagination
 * @access Admin seulement
 */
router.get(
  "/",
  requireAuth,
  requireAdmin,
  validatePagination,
  getAuditLogs // CORRIGÉ : fonction directe, pas d'appel
);

/**
 * @route GET /api/audit-logs/stats
 * @description Récupère les statistiques des logs d'audit
 * @access Admin seulement
 */
router.get(
  "/stats",
  requireAuth,
  requireAdmin,
  getAuditStats // CORRIGÉ : fonction directe
);

/**
 * @route GET /api/audit-logs/:id
 * @description Récupère un log d'audit spécifique
 * @access Admin seulement
 */
router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  getAuditLogById // CORRIGÉ : fonction directe
);

/**
 * @route GET /api/audit-logs/user/:userId
 * @description Récupère les logs d'audit d'un utilisateur
 * @access Admin seulement
 */
router.get(
  "/user/:userId",
  requireAuth,
  requireAdmin,
  validatePagination,
  getUserAuditLogs // CORRIGÉ : fonction directe
);

export default router;
