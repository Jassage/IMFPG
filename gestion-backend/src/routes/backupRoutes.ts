// routes/backupRoutes.ts
import express from "express";
import {
  exportSQL,
  createBackup,
  listBackups,
  downloadBackup,
  getBackupStats,
  deleteBackup,
} from "../controllers/backupController";
import { authenticateToken, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticateToken);

/**
 * @route GET /api/backups/export
 * @desc Exporter la base de données au format SQL
 * @access Admin Uniquement
 */
router.get("/export", requireAdmin, exportSQL);

/**
 * @route POST /api/backups/create
 * @desc Créer une nouvelle sauvegarde de la base de données
 * @access Admin Uniquement
 */
router.post("/create", requireAdmin, createBackup);

/** * @route GET /api/backups/list
 * @desc Lister toutes les sauvegardes disponibles
 * @access Admin Uniquement
 */
router.get("/list", requireAdmin, listBackups);

/** * @route GET /api/backups/download/:filename
 * @desc Télécharger une sauvegarde spécifique
 * @access Admin Uniquement
 */
router.get("/download/:filename", requireAdmin, downloadBackup);

/** * @route GET /api/backups/statistics
 * @desc Obtenir des statistiques sur les sauvegardes
 * @access Admin Uniquement
 */
router.get("/statistics", requireAdmin, getBackupStats);

/** * @route DELETE /api/backups/:filename
 * @desc Supprimer une sauvegarde spécifique
 * @access Admin Uniquement
 */
router.delete("/:filename", requireAdmin, deleteBackup);

export default router;
