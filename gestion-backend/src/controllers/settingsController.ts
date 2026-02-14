/**
 * @file settingsController.ts
 * @description Contrôleur pour la gestion des paramètres système
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { SettingsService } from "../services/settingsService";
import { createAuditLog } from "./auditController";

import { extractAuditData } from "./auth/authUtils";
import { SettingsActionTypes, SettingsResponse } from "../types/settings";

/**
 * @controller getSettings
 * @description Récupère les paramètres système
 * @route GET /api/settings
 * @access Private (Admin)
 */
export const getSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    // Récupération des paramètres
    const settings = await SettingsService.getSettings();

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_GET_SUCCESS,
      entity: "SystemSettings",
      entityId: settings.id,
      userId: auditData.userId,
      description: "Paramètres système récupérés",
      status: "SUCCESS",
    });

    const response: SettingsResponse = {
      success: true,
      message: "Paramètres récupérés avec succès",
      data: { settings },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SettingsController - getSettings error:", error);

    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_GET_ERROR,
      entity: "SystemSettings",
      description: "Erreur lors de la récupération des paramètres",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: SettingsResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller updateSettings
 * @description Met à jour les paramètres système
 * @route PUT /api/settings
 * @access Private (Admin)
 */
export const updateSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = auditData.userId;
    const updateData = req.body;

    if (!userId) {
      const response: SettingsResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    // Validation des données
    const validationErrors = SettingsService.validateSettings(updateData);
    if (validationErrors.length > 0) {
      await createAuditLog({
        ...auditData,
        action: SettingsActionTypes.SETTINGS_UPDATE_ERROR,
        entity: "SystemSettings",
        description: "Données de paramètres invalides",
        status: "ERROR",
        metadata: { errors: validationErrors },
      });

      const response: SettingsResponse = {
        success: false,
        message: "Données invalides",
        code: "VALIDATION_ERROR",
        data: { errors: validationErrors } as any,
      };
      res.status(400).json(response);
      return;
    }

    // Récupérer l'ancienne configuration pour l'audit
    const oldSettings = await SettingsService.getSettings();

    // Mise à jour des paramètres
    const updatedSettings = await SettingsService.updateSettings(
      updateData,
      userId,
    );

    // Log d'audit avec les changements
    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_UPDATE_SUCCESS,
      entity: "SystemSettings",
      entityId: updatedSettings.id,
      userId: userId,
      description: "Paramètres système mis à jour",
      status: "SUCCESS",
      metadata: { oldData: oldSettings, newData: updateData },
    });

    const response: SettingsResponse = {
      success: true,
      message: "Paramètres mis à jour avec succès",
      data: { settings: updatedSettings },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SettingsController - updateSettings error:", error);

    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_UPDATE_ERROR,
      entity: "SystemSettings",
      description: "Erreur lors de la mise à jour des paramètres",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: SettingsResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code:
        error.message === "Année académique invalide"
          ? "INVALID_ACADEMIC_YEAR"
          : "INTERNAL_ERROR",
    };

    res
      .status(error.message === "Année académique invalide" ? 400 : 500)
      .json(response);
  }
};

/**
 * @controller backupSettings
 * @description Crée une sauvegarde des paramètres
 * @route POST /api/settings/backup
 * @access Private (Admin)
 */
export const backupSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = auditData.userId;

    if (!userId) {
      const response: SettingsResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    // Création de la sauvegarde
    const settings = await SettingsService.backupSettings(userId);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_BACKUP_SUCCESS,
      entity: "SystemSettings",
      entityId: settings.id,
      userId: userId,
      description: "Sauvegarde des paramètres effectuée",
      status: "SUCCESS",
      metadata: { backupDate: new Date() },
    });

    const response: SettingsResponse = {
      success: true,
      message: "Sauvegarde effectuée avec succès",
      data: { settings },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SettingsController - backupSettings error:", error);

    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_BACKUP_ERROR,
      entity: "SystemSettings",
      description: "Erreur lors de la sauvegarde",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: SettingsResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller resetSettings
 * @description Réinitialise les paramètres aux valeurs par défaut
 * @route POST /api/settings/reset
 * @access Private (Admin)
 */
export const resetSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const userId = auditData.userId;

    if (!userId) {
      const response: SettingsResponse = {
        success: false,
        message: "Non autorisé",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    // Récupérer l'ancienne configuration pour l'audit
    const oldSettings = await SettingsService.getSettings();

    // Réinitialisation
    const resetSettings = await SettingsService.resetSettings(userId);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_RESET_SUCCESS,
      entity: "SystemSettings",
      entityId: resetSettings.id,
      userId: userId,
      description: "Paramètres système réinitialisés",
      status: "SUCCESS",
      metadata: { oldData: oldSettings, newData: resetSettings },
    });

    const response: SettingsResponse = {
      success: true,
      message: "Paramètres réinitialisés avec succès",
      data: { settings: resetSettings },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SettingsController - resetSettings error:", error);

    await createAuditLog({
      ...auditData,
      action: SettingsActionTypes.SETTINGS_RESET_ERROR,
      entity: "SystemSettings",
      description: "Erreur lors de la réinitialisation",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: SettingsResponse = {
      success: false,
      message: error.message || "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @controller getPublicSettings
 * @description Récupère les paramètres publics (pour le frontend non authentifié)
 * @route GET /api/settings/public
 * @access Public
 */
export const getPublicSettings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const settings = await SettingsService.getPublicSettings();

    const response: SettingsResponse = {
      success: true,
      message: "Paramètres publics récupérés",
      data: { settings: settings as any },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SettingsController - getPublicSettings error:", error);

    const response: SettingsResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
