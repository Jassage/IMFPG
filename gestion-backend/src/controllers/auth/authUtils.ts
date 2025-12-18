/**
 * @file authUtils.ts
 * @description Utilitaires pour le contrôleur d'authentification
 * @version 1.0.0
 */

import { Request } from "express";
import { AuditData } from "../../types/auth";

/**
 * @function extractAuditData
 * @description Extrait les données d'audit depuis la requête
 * @param {Request} req - Requête Express
 * @returns {AuditData} Données d'audit
 */
export const extractAuditData = (req: Request): AuditData => {
  // S'assurer que userId est soit string soit null, jamais undefined
  const userId = (req as any).userId ? String((req as any).userId) : null;

  return {
    ipAddress: req.ip || req.connection.remoteAddress || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: userId, // Maintenant toujours string | null
  };
};

/**
 * @function createSafeAuditData
 * @description Crée des données d'audit sécurisées avec des valeurs par défaut
 * @param {Partial<AuditData>} data - Données d'audit partielles
 * @returns {AuditData} Données d'audit complètes
 */
export const createSafeAuditData = (
  data: Partial<AuditData> = {}
): AuditData => {
  return {
    ipAddress: data.ipAddress || "unknown",
    userAgent: data.userAgent || "unknown",
    userId: data.userId !== undefined ? data.userId : null, // Convertir undefined en null
  };
};

/**
 * @function getClientIp
 * @description Récupère l'adresse IP réelle du client
 * @param {Request} req - Requête Express
 * @returns {string} Adresse IP du client
 */
export const getClientIp = (req: Request): string => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.socket as any).remoteAddress ||
    "unknown"
  );
};

/**
 * @function generateResetLink
 * @description Génère le lien de réinitialisation de mot de passe
 * @param {string} token - Token de réinitialisation
 * @returns {string} Lien de réinitialisation complet
 */
export const generateResetLink = (token: string): string => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${baseUrl}/reset-password?token=${token}`;
};

/**
 * @function generateEmailTemplate
 * @description Génère le template HTML pour l'email de réinitialisation
 * @param {string} firstName - Prénom de l'utilisateur
 * @param {string} resetLink - Lien de réinitialisation
 * @returns {string} Template HTML de l'email
 */
export const generateEmailTemplate = (
  firstName: string,
  resetLink: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de votre mot de passe</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .header { 
                background: #3b82f6; 
                color: white; 
                padding: 20px; 
                text-align: center; 
            }
            .content { 
                background: #f9f9f9; 
                padding: 30px; 
                border-radius: 5px; 
                margin-top: 20px; 
            }
            .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background-color: #3b82f6; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                color: #666; 
                font-size: 14px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${firstName},</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                <p style="text-align: center;">
                    <a href="${resetLink}" class="button">
                        Réinitialiser mon mot de passe
                    </a>
                </p>
                <p>Si le bouton ne fonctionne pas, vous pouvez copier-coller le lien suivant dans votre navigateur :</p>
                <p style="word-break: break-all; color: #3b82f6;">${resetLink}</p>
                <p><strong>Ce lien expirera dans 1 heure.</strong></p>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Votre École. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * @function sanitizeUserForResponse
 * @description Nettoie les données utilisateur pour la réponse (supprime les champs sensibles)
 * @param {any} user - Données utilisateur complètes
 * @returns {any} Données utilisateur nettoyées
 */
export const sanitizeUserForResponse = (user: any): any => {
  if (!user) return null;

  const { password, resetToken, resetTokenExpiry, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * @function isAccountLocked
 * @description Vérifie si un compte est actuellement verrouillé
 * @param {Date | null} lockUntil - Date de fin de verrouillage
 * @returns {boolean} True si le compte est verrouillé
 */
export const isAccountLocked = (lockUntil: Date | null): boolean => {
  if (!lockUntil) return false;
  return new Date() < new Date(lockUntil);
};

/**
 * @function calculateRemainingLockTime
 * @description Calcule le temps restant avant déverrouillage
 * @param {Date} lockUntil - Date de fin de verrouillage
 * @returns {number} Temps restant en minutes
 */
export const calculateRemainingLockTime = (lockUntil: Date): number => {
  const now = new Date();
  const lockTime = new Date(lockUntil);
  const diffMs = lockTime.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60)); // Convertir en minutes
};
