"use strict";
/**
 * @file backupController.ts
 * @description Contrôleur pour la gestion des sauvegardes
 * @module Controllers/Backup
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBackup = exports.downloadBackup = exports.getBackupStats = exports.listBackups = exports.exportSQL = exports.createBackup = void 0;
const fs_1 = __importDefault(require("fs"));
const backupService_1 = require("../services/backupService");
const auditService_1 = require("../services/auditService");
/**
 * Crée une sauvegarde complète de la base de données
 */
const createBackup = async (req, res) => {
    try {
        const { name, modules } = req.body;
        const result = await backupService_1.BackupService.createBackup({
            name,
            modules,
            userId: req.user?.id,
        });
        await auditService_1.AuditService.log({
            action: "CREATE_BACKUP",
            entity: "Backup",
            description: `Sauvegarde créée: ${result.data.filename}`,
            userId: req.user?.id,
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur création sauvegarde:", error);
        await auditService_1.AuditService.log({
            action: "CREATE_BACKUP_ERROR",
            entity: "Backup",
            description: `Erreur création sauvegarde`,
            userId: req.user?.id,
            status: "ERROR",
        });
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors de la création de la sauvegarde",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.createBackup = createBackup;
/**
 * Génère un export SQL simplifié
 */
const exportSQL = async (req, res) => {
    try {
        const result = await backupService_1.BackupService.exportSQL(req.user?.id);
        await auditService_1.AuditService.log({
            action: "EXPORT_SQL",
            entity: "Database",
            description: `Export SQL réussi: ${result.data.filename}`,
            userId: req.user?.id,
        });
        // Télécharger le fichier
        res.download(result.data.path, result.data.filename, (err) => {
            if (err) {
                console.error("Erreur téléchargement:", err);
            }
            // Nettoyer le fichier après envoi
            try {
                fs_1.default.unlinkSync(result.data.path);
            }
            catch (unlinkError) {
                console.error("Erreur suppression fichier:", unlinkError);
            }
        });
    }
    catch (error) {
        console.error("❌ Erreur export SQL:", error);
        await auditService_1.AuditService.log({
            action: "EXPORT_SQL_ERROR",
            entity: "Database",
            description: `Erreur export SQL`,
            userId: req.user?.id,
            status: "ERROR",
        });
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors de l'export SQL",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.exportSQL = exportSQL;
/**
 * Liste toutes les sauvegardes disponibles
 */
const listBackups = async (req, res) => {
    try {
        const result = await backupService_1.BackupService.listBackups();
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur liste sauvegardes:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors de la récupération des sauvegardes",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.listBackups = listBackups;
/**
 * Récupère les statistiques de la base de données et des sauvegardes
 */
const getBackupStats = async (req, res) => {
    try {
        const result = await backupService_1.BackupService.getBackupStats();
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur statistiques sauvegardes:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors de la récupération des statistiques",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.getBackupStats = getBackupStats;
/**
 * Télécharge une sauvegarde spécifique
 */
const downloadBackup = async (req, res) => {
    try {
        const { filename } = req.params;
        const result = await backupService_1.BackupService.downloadBackup(filename);
        await auditService_1.AuditService.log({
            action: "DOWNLOAD_BACKUP",
            entity: "Backup",
            description: `Téléchargement sauvegarde: ${filename} (${result.data.size} bytes)`,
            userId: req.user?.id,
        });
        // Configurer les headers pour le téléchargement
        res.setHeader("Content-Type", "application/sql");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", result.data.size);
        res.setHeader("X-Backup-Metadata", result.data.metadata ? JSON.stringify(result.data.metadata) : "");
        // Stream le fichier SQL directement
        const fileStream = fs_1.default.createReadStream(result.data.filepath);
        fileStream.on("error", (error) => {
            console.error("❌ Erreur stream fichier:", error);
            res.status(500).json({ error: "Erreur lors du téléchargement" });
        });
        fileStream.pipe(res);
    }
    catch (error) {
        console.error("❌ Erreur téléchargement sauvegarde:", error);
        await auditService_1.AuditService.log({
            action: "DOWNLOAD_BACKUP_ERROR",
            entity: "Backup",
            description: `Erreur téléchargement sauvegarde: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors du téléchargement de la sauvegarde",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.downloadBackup = downloadBackup;
/**
 * Supprime une sauvegarde
 */
const deleteBackup = async (req, res) => {
    try {
        const { filename } = req.params;
        const result = await backupService_1.BackupService.deleteBackup(filename);
        await auditService_1.AuditService.log({
            action: "DELETE_BACKUP",
            entity: "Backup",
            description: `Sauvegarde supprimée: ${filename}`,
            userId: req.user?.id,
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur suppression sauvegarde:", error);
        await auditService_1.AuditService.log({
            action: "DELETE_BACKUP_ERROR",
            entity: "Backup",
            description: `Erreur suppression sauvegarde: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Erreur lors de la suppression de la sauvegarde",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
exports.deleteBackup = deleteBackup;
//# sourceMappingURL=backupController.js.map