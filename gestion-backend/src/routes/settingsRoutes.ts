/**
 * @file settingsRoutes.ts
 * @description Routes pour la gestion des paramètres système
 * @version 1.0.0
 */

import { Router } from "express";
import {
  getSettings,
  updateSettings,
  backupSettings,
  resetSettings,
  getPublicSettings,
} from "../controllers/settingsController";
import { authenticateToken, requireAdmin } from "../middleware";

const router = Router();

/**
 * @route GET /api/settings/public
 * @description Récupère les paramètres publics (sans authentification)
 * @access Public
 */
router.get("/public", getPublicSettings);

/**
 * @route GET /api/settings
 * @description Récupère tous les paramètres
 * @access Private (Admin)
 */
router.get("/", requireAdmin, getSettings);

/**
 * @route PUT /api/settings
 * @description Met à jour les paramètres
 * @access Private (Admin)
 */
router.put("/", requireAdmin, updateSettings);

/**
 * @route POST /api/settings/backup
 * @description Crée une sauvegarde des paramètres
 * @access Private (Admin)
 */
router.post("/backup", requireAdmin, backupSettings);

/**
 * @route POST /api/settings/reset
 * @description Réinitialise les paramètres
 * @access Private (Admin)
 */
router.post("/reset", requireAdmin, resetSettings);

export default router;
