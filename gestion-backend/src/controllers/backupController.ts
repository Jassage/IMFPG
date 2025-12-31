/**
 * @file backupController.ts
 * @description Contrôleur pour la gestion des sauvegardes
 * @module Controllers/Backup
 */

import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { BackupService } from "../services/backupService";
import { AuditService } from "../services/auditService";

/**
 * Crée une sauvegarde complète de la base de données
 */
export const createBackup = async (req: Request, res: Response) => {
  try {
    const { name, modules } = req.body;

    const result = await BackupService.createBackup({
      name,
      modules,
      userId: (req as any).user?.id,
    });

    await AuditService.log({
      action: "CREATE_BACKUP",
      entity: "Backup",
      description: `Sauvegarde créée: ${result.data.filename}`,
      userId: (req as any).user?.id,
    });

    res.json(result);
  } catch (error: any) {
    console.error("❌ Erreur création sauvegarde:", error);

    await AuditService.log({
      action: "CREATE_BACKUP_ERROR",
      entity: "Backup",
      description: `Erreur création sauvegarde`,
      userId: (req as any).user?.id,
      status: "ERROR",
    });

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la création de la sauvegarde",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Génère un export SQL simplifié
 */
export const exportSQL = async (req: Request, res: Response) => {
  try {
    const result = await BackupService.exportSQL((req as any).user?.id);

    await AuditService.log({
      action: "EXPORT_SQL",
      entity: "Database",
      description: `Export SQL réussi: ${result.data.filename}`,
      userId: (req as any).user?.id,
    });

    // Télécharger le fichier
    res.download(result.data.path, result.data.filename, (err) => {
      if (err) {
        console.error("Erreur téléchargement:", err);
      }
      // Nettoyer le fichier après envoi
      try {
        fs.unlinkSync(result.data.path);
      } catch (unlinkError) {
        console.error("Erreur suppression fichier:", unlinkError);
      }
    });
  } catch (error: any) {
    console.error("❌ Erreur export SQL:", error);

    await AuditService.log({
      action: "EXPORT_SQL_ERROR",
      entity: "Database",
      description: `Erreur export SQL`,
      userId: (req as any).user?.id,
      status: "ERROR",
    });

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de l'export SQL",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Liste toutes les sauvegardes disponibles
 */
export const listBackups = async (req: Request, res: Response) => {
  try {
    const result = await BackupService.listBackups();

    res.json(result);
  } catch (error: any) {
    console.error("❌ Erreur liste sauvegardes:", error);

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des sauvegardes",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Récupère les statistiques de la base de données et des sauvegardes
 */
export const getBackupStats = async (req: Request, res: Response) => {
  try {
    const result = await BackupService.getBackupStats();

    res.json(result);
  } catch (error: any) {
    console.error("❌ Erreur statistiques sauvegardes:", error);

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des statistiques",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Télécharge une sauvegarde spécifique
 */
export const downloadBackup = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    const result = await BackupService.downloadBackup(filename);

    await AuditService.log({
      action: "DOWNLOAD_BACKUP",
      entity: "Backup",
      description: `Téléchargement sauvegarde: ${filename} (${result.data.size} bytes)`,
      userId: (req as any).user?.id,
    });

    // Configurer les headers pour le téléchargement
    res.setHeader("Content-Type", "application/sql");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", result.data.size);
    res.setHeader(
      "X-Backup-Metadata",
      result.data.metadata ? JSON.stringify(result.data.metadata) : ""
    );

    // Stream le fichier SQL directement
    const fileStream = fs.createReadStream(result.data.filepath);

    fileStream.on("error", (error) => {
      console.error("❌ Erreur stream fichier:", error);
      res.status(500).json({ error: "Erreur lors du téléchargement" });
    });

    fileStream.pipe(res);
  } catch (error: any) {
    console.error("❌ Erreur téléchargement sauvegarde:", error);

    await AuditService.log({
      action: "DOWNLOAD_BACKUP_ERROR",
      entity: "Backup",
      description: `Erreur téléchargement sauvegarde: ${error.message}`,
      userId: (req as any).user?.id,
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors du téléchargement de la sauvegarde",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Supprime une sauvegarde
 */
export const deleteBackup = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    const result = await BackupService.deleteBackup(filename);

    await AuditService.log({
      action: "DELETE_BACKUP",
      entity: "Backup",
      description: `Sauvegarde supprimée: ${filename}`,
      userId: (req as any).user?.id,
    });

    res.json(result);
  } catch (error: any) {
    console.error("❌ Erreur suppression sauvegarde:", error);

    await AuditService.log({
      action: "DELETE_BACKUP_ERROR",
      entity: "Backup",
      description: `Erreur suppression sauvegarde: ${error.message}`,
      userId: (req as any).user?.id,
      status: "ERROR",
      errorMessage: error.message,
    });

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la suppression de la sauvegarde",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
