/**
 * @file security.ts
 * @description Utilitaires de sécurité et cryptographie
 * @version 1.0.0
 */

import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";

/**
 * @constant {string} JWT_SECRET - Clé secrète pour JWT
 * On refuse de démarrer sans secret explicite : pas de valeur par défaut
 * en dur, qui serait connue de tous et permettrait de forger des tokens.
 */
const rawJwtSecret = process.env.JWT_SECRET;

if (!rawJwtSecret || rawJwtSecret.length < 32) {
  throw new Error(
    "JWT_SECRET manquant ou trop court (>= 32 caractères requis). " +
      "Définissez-le dans le fichier .env."
  );
}

const JWT_SECRET: string = rawJwtSecret;

/**
 * @constant {number} BCRYPT_SALT_ROUNDS - Nombre de tours de hachage bcrypt
 */
const BCRYPT_SALT_ROUNDS = 12;

/**
 * @function hashPassword
 * @description Hash un mot de passe avec bcrypt
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} Mot de passe hashé
 * @throws {Error} Si le hachage échoue
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  } catch (error) {
    throw new Error("Erreur lors du hachage du mot de passe");
  }
};

/**
 * @function verifyPassword
 * @description Vérifie un mot de passe contre son hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash à vérifier
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Erreur lors de la vérification du mot de passe");
  }
};

/**
 * @function generateJwtToken
 * @description Génère un token JWT
 * @param {object} payload - Données à inclure dans le token
 * @param {string} expiresIn - Durée de validité
 * @returns {string} Token JWT
 */
export const generateJwtToken = (
  payload: object,
  expiresIn: string = "24h"
): string => {
  const options = {
    expiresIn,
    issuer: "school-auth",
    audience: "school-app",
  } as SignOptions;
  return jwt.sign(payload as any, JWT_SECRET as Secret, options);
};

/**
 * @function verifyJwtToken
 * @description Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {object} Données décodées
 * @throws {Error} Si le token est invalide
 */
export const verifyJwtToken = (token: string): any => {
  try {
    if (!token || token === "null" || token === "undefined") {
      throw new Error("Token manquant");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded.id || !decoded.email) {
      throw new Error("Token invalide: données manquantes");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expiré");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token invalide");
    }
    throw error;
  }
};

/**
 * @function generateResetToken
 * @description Génère un token de réinitialisation sécurisé
 * @returns {string} Token de réinitialisation
 */
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * @function generateResetTokenExpiry
 * @description Génère une date d'expiration pour le token de réinitialisation
 * @param {number} hours - Nombre d'heures avant expiration
 * @returns {Date} Date d'expiration
 */
export const generateResetTokenExpiry = (hours: number = 1): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};
