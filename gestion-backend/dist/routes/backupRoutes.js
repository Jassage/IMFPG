"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/backupRoutes.ts
const express_1 = __importDefault(require("express"));
const backupController_1 = require("../controllers/backupController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateToken);
/**
 * @route GET /api/backups/export
 * @desc Exporter la base de données au format SQL
 * @access Admin Uniquement
 */
router.get("/export", auth_middleware_1.requireAdmin, backupController_1.exportSQL);
/**
 * @route POST /api/backups/create
 * @desc Créer une nouvelle sauvegarde de la base de données
 * @access Admin Uniquement
 */
router.post("/create", auth_middleware_1.requireAdmin, backupController_1.createBackup);
/** * @route GET /api/backups/list
 * @desc Lister toutes les sauvegardes disponibles
 * @access Admin Uniquement
 */
router.get("/list", auth_middleware_1.requireAdmin, backupController_1.listBackups);
/** * @route GET /api/backups/download/:filename
 * @desc Télécharger une sauvegarde spécifique
 * @access Admin Uniquement
 */
router.get("/download/:filename", auth_middleware_1.requireAdmin, backupController_1.downloadBackup);
/** * @route GET /api/backups/statistics
 * @desc Obtenir des statistiques sur les sauvegardes
 * @access Admin Uniquement
 */
router.get("/statistics", auth_middleware_1.requireAdmin, backupController_1.getBackupStats);
/** * @route DELETE /api/backups/:filename
 * @desc Supprimer une sauvegarde spécifique
 * @access Admin Uniquement
 */
router.delete("/:filename", auth_middleware_1.requireAdmin, backupController_1.deleteBackup);
exports.default = router;
//# sourceMappingURL=backupRoutes.js.map