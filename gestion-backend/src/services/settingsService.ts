/**
 * @file settingsService.ts
 * @description Service de gestion des paramètres système
 * @version 1.0.0
 */

import { PrismaClient } from "../../generated/prisma";
import { SettingsUpdateData, SystemSettings } from "../types/settings";
import { sanitizeInput } from "../utils/validators";

const prisma = new PrismaClient();

/**
 * @class SettingsService
 * @description Service regroupant la logique métier des paramètres système
 */
export class SettingsService {
  /**
   * @method parseJsonField
   * @description Parse un champ JSON en objet avec gestion d'erreur
   */
  private static parseJsonField(field: any, defaultValue: any): any {
    if (!field) return defaultValue;

    // Si c'est déjà un objet, le retourner directement
    if (typeof field === "object" && !Array.isArray(field)) {
      return field;
    }

    // Si c'est un tableau, le retourner directement
    if (Array.isArray(field)) {
      return field;
    }

    // Si c'est une chaîne, essayer de la parser
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (error) {
        console.error("Erreur parsing JSON:", error);
        return defaultValue;
      }
    }

    return defaultValue;
  }

  /**
   * @method getSettings
   * @description Récupère les paramètres système
   * @returns {Promise<SystemSettings>} Paramètres système
   */
  static async getSettings(): Promise<SystemSettings> {
    try {
      let settings = await prisma.systemSettings.findFirst();

      // Si aucun paramètre n'existe, créer avec les valeurs par défaut
      if (!settings) {
        const currentYear = await prisma.academicYear.findFirst({
          where: { isCurrent: true },
        });

        // Créer avec des chaînes JSON (ce que Prisma attend)
        settings = await prisma.systemSettings.create({
          data: {
            currentAcademicYearId: currentYear?.id,
            paymentMethods: JSON.stringify([
              "Espèces",
              "Carte bancaire",
              "Mobile Money",
              "Virement",
            ]),
            passwordPolicy: JSON.stringify({
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: false,
            }),
            enabledModules: JSON.stringify({
              attendance: true,
              library: false,
              transport: false,
              hostel: false,
              payroll: true,
              inventory: false,
            }),
          },
        });
      }

      // Convertir les JSON en objets
      return {
        ...settings,
        paymentMethods: this.parseJsonField(settings.paymentMethods, [
          "Espèces",
          "Carte bancaire",
          "Mobile Money",
          "Virement",
        ]),
        passwordPolicy: this.parseJsonField(settings.passwordPolicy, {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }),
        enabledModules: this.parseJsonField(settings.enabledModules, {
          attendance: true,
          library: false,
          transport: false,
          hostel: false,
          payroll: true,
          inventory: false,
        }),
      } as SystemSettings;
    } catch (error) {
      console.error("SettingsService - getSettings error:", error);
      throw new Error("Erreur lors de la récupération des paramètres");
    }
  }

  /**
   * @method updateSettings
   * @description Met à jour les paramètres système
   * @param {SettingsUpdateData} data - Données à mettre à jour
   * @param {string} userId - ID de l'utilisateur effectuant la mise à jour
   * @returns {Promise<SystemSettings>} Paramètres mis à jour
   */
  static async updateSettings(
    data: SettingsUpdateData,
    userId?: string,
  ): Promise<SystemSettings> {
    try {
      const existing = await prisma.systemSettings.findFirst();

      // Sanitize les données textuelles
      const sanitizedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) continue;

        if (typeof value === "string") {
          sanitizedData[key] = sanitizeInput(value);
        } else if (key === "paymentMethods" && Array.isArray(value)) {
          sanitizedData[key] = JSON.stringify(
            value.map((v) => sanitizeInput(v)),
          );
        } else if (key === "passwordPolicy" && typeof value === "object") {
          sanitizedData[key] = JSON.stringify(value);
        } else if (key === "enabledModules" && typeof value === "object") {
          sanitizedData[key] = JSON.stringify(value);
        } else {
          sanitizedData[key] = value;
        }
      }

      // Validation des années académiques
      if (data.currentAcademicYearId) {
        const yearExists = await prisma.academicYear.findUnique({
          where: { id: data.currentAcademicYearId },
        });
        if (!yearExists) {
          throw new Error("Année académique invalide");
        }
      }

      let settings;
      if (existing) {
        settings = await prisma.systemSettings.update({
          where: { id: existing.id },
          data: {
            ...sanitizedData,
            updatedBy: userId,
          },
        });
      } else {
        settings = await prisma.systemSettings.create({
          data: {
            ...sanitizedData,
            updatedBy: userId,
            // Valeurs par défaut si non fournies
            paymentMethods:
              sanitizedData.paymentMethods ||
              JSON.stringify([
                "Espèces",
                "Carte bancaire",
                "Mobile Money",
                "Virement",
              ]),
            passwordPolicy:
              sanitizedData.passwordPolicy ||
              JSON.stringify({
                minLength: 8,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: false,
              }),
            enabledModules:
              sanitizedData.enabledModules ||
              JSON.stringify({
                attendance: true,
                library: false,
                transport: false,
                hostel: false,
                payroll: true,
                inventory: false,
              }),
          },
        });
      }

      // Convertir les JSON en objets pour la réponse
      return {
        ...settings,
        paymentMethods: this.parseJsonField(settings.paymentMethods, [
          "Espèces",
          "Carte bancaire",
          "Mobile Money",
          "Virement",
        ]),
        passwordPolicy: this.parseJsonField(settings.passwordPolicy, {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }),
        enabledModules: this.parseJsonField(settings.enabledModules, {
          attendance: true,
          library: false,
          transport: false,
          hostel: false,
          payroll: true,
          inventory: false,
        }),
      } as SystemSettings;
    } catch (error) {
      console.error("SettingsService - updateSettings error:", error);
      throw new Error("Erreur lors de la mise à jour des paramètres");
    }
  }

  /**
   * @method backupSettings
   * @description Crée une sauvegarde des paramètres
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<SystemSettings>} Paramètres avec lastBackup mis à jour
   */
  static async backupSettings(userId?: string): Promise<SystemSettings> {
    try {
      const existing = await prisma.systemSettings.findFirst();

      if (!existing) {
        throw new Error("Aucun paramètre à sauvegarder");
      }

      const settings = await prisma.systemSettings.update({
        where: { id: existing.id },
        data: {
          lastBackup: new Date(),
          updatedBy: userId,
        },
      });

      // TODO: Implémenter la sauvegarde réelle (fichier, stockage cloud, etc.)

      return {
        ...settings,
        paymentMethods: this.parseJsonField(settings.paymentMethods, [
          "Espèces",
          "Carte bancaire",
          "Mobile Money",
          "Virement",
        ]),
        passwordPolicy: this.parseJsonField(settings.passwordPolicy, {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }),
        enabledModules: this.parseJsonField(settings.enabledModules, {
          attendance: true,
          library: false,
          transport: false,
          hostel: false,
          payroll: true,
          inventory: false,
        }),
      } as SystemSettings;
    } catch (error) {
      console.error("SettingsService - backupSettings error:", error);
      throw new Error("Erreur lors de la sauvegarde");
    }
  }

  /**
   * @method resetSettings
   * @description Réinitialise les paramètres aux valeurs par défaut
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<SystemSettings>} Paramètres réinitialisés
   */
  static async resetSettings(userId?: string): Promise<SystemSettings> {
    try {
      const existing = await prisma.systemSettings.findFirst();
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      const defaultSettings = {
        schoolName: "Institution Mixte Faustin 1er",
        schoolSlogan: "L'excellence pour tous",
        schoolLogo: "/logo.png",
        schoolFavicon: "/favicon.ico",
        phone: "+229 01 23 45 67",
        secondaryPhone: null,
        email: "contact@imfp.bj",
        secondaryEmail: null,
        website: "https://www.imfp.bj",
        address: "123 Rue de l'École",
        city: "Cotonou",
        country: "Bénin",
        postalCode: null,
        facebook: null,
        twitter: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        currentAcademicYearId: currentYear?.id || null,
        gradingSystem: "percentage",
        passingGrade: 50,
        maxGrade: 100,
        currency: "XOF",
        currencySymbol: "FCFA",
        taxRate: 18,
        latePaymentFee: 5000,
        paymentMethods: JSON.stringify([
          "Espèces",
          "Carte bancaire",
          "Mobile Money",
          "Virement",
        ]),
        enableEmailNotifications: true,
        enableSmsNotifications: true,
        enablePushNotifications: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        twoFactorAuth: false,
        passwordPolicy: JSON.stringify({
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }),
        primaryColor: "#2563eb",
        secondaryColor: "#4f46e5",
        accentColor: "#f59e0b",
        fontFamily: "Inter",
        enabledModules: JSON.stringify({
          attendance: true,
          library: false,
          transport: false,
          hostel: false,
          payroll: true,
          inventory: false,
        }),
        autoBackup: true,
        backupFrequency: "daily",
        backupRetention: 30,
        lastBackup: null,
        updatedBy: userId,
      };

      let settings;
      if (existing) {
        settings = await prisma.systemSettings.update({
          where: { id: existing.id },
          data: defaultSettings,
        });
      } else {
        settings = await prisma.systemSettings.create({
          data: defaultSettings,
        });
      }

      return {
        ...settings,
        paymentMethods: this.parseJsonField(settings.paymentMethods, [
          "Espèces",
          "Carte bancaire",
          "Mobile Money",
          "Virement",
        ]),
        passwordPolicy: this.parseJsonField(settings.passwordPolicy, {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }),
        enabledModules: this.parseJsonField(settings.enabledModules, {
          attendance: true,
          library: false,
          transport: false,
          hostel: false,
          payroll: true,
          inventory: false,
        }),
      } as SystemSettings;
    } catch (error) {
      console.error("SettingsService - resetSettings error:", error);
      throw new Error("Erreur lors de la réinitialisation");
    }
  }

  /**
   * @method validateSettings
   * @description Valide les données de paramètres
   * @param {SettingsUpdateData} data - Données à valider
   * @returns {string[]} Liste des erreurs de validation
   */
  static validateSettings(data: SettingsUpdateData): string[] {
    const errors: string[] = [];

    // Validation des emails
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push("Format d'email principal invalide");
    }
    if (data.secondaryEmail && !this.isValidEmail(data.secondaryEmail)) {
      errors.push("Format d'email secondaire invalide");
    }

    // Validation des URLs
    if (data.website && !this.isValidUrl(data.website)) {
      errors.push("Format d'URL du site web invalide");
    }
    if (data.facebook && !this.isValidUrl(data.facebook)) {
      errors.push("Format d'URL Facebook invalide");
    }
    if (data.twitter && !this.isValidUrl(data.twitter)) {
      errors.push("Format d'URL Twitter invalide");
    }
    if (data.linkedin && !this.isValidUrl(data.linkedin)) {
      errors.push("Format d'URL LinkedIn invalide");
    }
    if (data.instagram && !this.isValidUrl(data.instagram)) {
      errors.push("Format d'URL Instagram invalide");
    }
    if (data.youtube && !this.isValidUrl(data.youtube)) {
      errors.push("Format d'URL YouTube invalide");
    }

    // Validation des nombres
    if (
      data.passingGrade !== undefined &&
      (data.passingGrade < 0 || data.passingGrade > 100)
    ) {
      errors.push("La note de passage doit être entre 0 et 100");
    }
    if (data.maxGrade !== undefined && data.maxGrade <= 0) {
      errors.push("La note maximale doit être positive");
    }
    if (
      data.taxRate !== undefined &&
      (data.taxRate < 0 || data.taxRate > 100)
    ) {
      errors.push("Le taux de TVA doit être entre 0 et 100");
    }
    if (data.latePaymentFee !== undefined && data.latePaymentFee < 0) {
      errors.push("La pénalité de retard ne peut pas être négative");
    }
    if (data.sessionTimeout !== undefined && data.sessionTimeout < 1) {
      errors.push("Le délai d'expiration doit être d'au moins 1 minute");
    }
    if (data.maxLoginAttempts !== undefined && data.maxLoginAttempts < 1) {
      errors.push("Le nombre de tentatives doit être d'au moins 1");
    }

    // Validation des couleurs (format hexadécimal)
    if (data.primaryColor && !/^#[0-9A-F]{6}$/i.test(data.primaryColor)) {
      errors.push("Format de couleur primaire invalide (doit être #RRGGBB)");
    }
    if (data.secondaryColor && !/^#[0-9A-F]{6}$/i.test(data.secondaryColor)) {
      errors.push("Format de couleur secondaire invalide (doit être #RRGGBB)");
    }
    if (data.accentColor && !/^#[0-9A-F]{6}$/i.test(data.accentColor)) {
      errors.push("Format de couleur d'accent invalide (doit être #RRGGBB)");
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @method getPublicSettings
   * @description Récupère les paramètres publics (sans données sensibles)
   * @returns {Promise<Partial<SystemSettings>>} Paramètres publics
   */
  static async getPublicSettings(): Promise<Partial<SystemSettings>> {
    try {
      const settings = await this.getSettings();

      // Ne retourner que les informations publiques
      return {
        schoolName: settings.schoolName,
        schoolSlogan: settings.schoolSlogan,
        schoolLogo: settings.schoolLogo,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        address: settings.address,
        city: settings.city,
        country: settings.country,
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        gradingSystem: settings.gradingSystem,
        passingGrade: settings.passingGrade,
        maxGrade: settings.maxGrade,
        currentAcademicYearId: settings.currentAcademicYearId,
        primaryColor: settings.primaryColor,
        fontFamily: settings.fontFamily,
      };
    } catch (error) {
      console.error("SettingsService - getPublicSettings error:", error);
      throw new Error("Erreur lors de la récupération des paramètres publics");
    }
  }
}
