"use strict";
/**
 * @file security.ts
 * @description Utilitaires de sécurité et cryptographie
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetTokenExpiry = exports.generateResetToken = exports.verifyJwtToken = exports.generateJwtToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * @constant {string} JWT_SECRET - Clé secrète pour JWT
 */
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_super_securise_changez_moi";
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
const hashPassword = async (password) => {
    try {
        return await bcryptjs_1.default.hash(password, BCRYPT_SALT_ROUNDS);
    }
    catch (error) {
        throw new Error("Erreur lors du hachage du mot de passe");
    }
};
exports.hashPassword = hashPassword;
/**
 * @function verifyPassword
 * @description Vérifie un mot de passe contre son hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash à vérifier
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
const verifyPassword = async (password, hash) => {
    try {
        return await bcryptjs_1.default.compare(password, hash);
    }
    catch (error) {
        throw new Error("Erreur lors de la vérification du mot de passe");
    }
};
exports.verifyPassword = verifyPassword;
/**
 * @function generateJwtToken
 * @description Génère un token JWT
 * @param {object} payload - Données à inclure dans le token
 * @param {string} expiresIn - Durée de validité
 * @returns {string} Token JWT
 */
const generateJwtToken = (payload, expiresIn = "24h") => {
    const options = {
        expiresIn,
        issuer: "school-auth",
        audience: "school-app",
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateJwtToken = generateJwtToken;
/**
 * @function verifyJwtToken
 * @description Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {object} Données décodées
 * @throws {Error} Si le token est invalide
 */
const verifyJwtToken = (token) => {
    try {
        if (!token || token === "null" || token === "undefined") {
            throw new Error("Token manquant");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.id || !decoded.email) {
            throw new Error("Token invalide: données manquantes");
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("Token expiré");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error("Token invalide");
        }
        throw error;
    }
};
exports.verifyJwtToken = verifyJwtToken;
/**
 * @function generateResetToken
 * @description Génère un token de réinitialisation sécurisé
 * @returns {string} Token de réinitialisation
 */
const generateResetToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
exports.generateResetToken = generateResetToken;
/**
 * @function generateResetTokenExpiry
 * @description Génère une date d'expiration pour le token de réinitialisation
 * @param {number} hours - Nombre d'heures avant expiration
 * @returns {Date} Date d'expiration
 */
const generateResetTokenExpiry = (hours = 1) => {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
};
exports.generateResetTokenExpiry = generateResetTokenExpiry;
//# sourceMappingURL=security.js.map