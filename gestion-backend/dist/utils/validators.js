"use strict";
/**
 * @file validators.ts
 * @description Fonctions de validation des données
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validatePhone = exports.sanitizePhone = exports.sanitizeInput = exports.validatePasswordStrength = exports.validateUserRole = exports.validateEmail = void 0;
/**
 * @constant {RegExp} EMAIL_REGEX - Regex pour la validation d'email
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/**
 * @constant {UserRole[]} VALID_ROLES - Rôles utilisateur valides
 */
/**
 * @constant {UserRole[]} VALID_ROLES - Rôles utilisateur valides
 */
const VALID_ROLES = [
    "Admin",
    "Professeur",
    "Secretaire",
    "Directeur",
    "Parent",
    "Student",
];
/**
 * @function validateEmail
 * @description Valide le format d'un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si l'email est valide
 */
const validateEmail = (email) => {
    return EMAIL_REGEX.test(email) && email.length <= 254;
};
exports.validateEmail = validateEmail;
/**
 * @function validateUserRole
 * @description Valide et transforme un rôle utilisateur
 * @param {string} role - Rôle à valider
 * @returns {UserRole} Rôle validé
 * @throws {Error} Si le rôle est invalide
 */
const validateUserRole = (role) => {
    if (VALID_ROLES.includes(role)) {
        return role;
    }
    throw new Error(`Rôle invalide: "${role}". Rôles valides: ${VALID_ROLES.join(", ")}`);
};
exports.validateUserRole = validateUserRole;
/**
 * @function validatePasswordStrength
 * @description Valide la force d'un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} True si le mot de passe est assez fort
 */
const validatePasswordStrength = (password) => {
    return password.length >= 6;
};
exports.validatePasswordStrength = validatePasswordStrength;
/**
 * @function sanitizeInput
 * @description Nettoie et sécurise les entrées utilisateur
 * @param {string} input - Entrée à nettoyer
 * @returns {string} Entrée nettoyée
 */
const sanitizeInput = (input) => {
    return input.trim();
};
exports.sanitizeInput = sanitizeInput;
/**
 * @function sanitizePhone
 * @description Nettoie et formate un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à nettoyer
 * @returns {string} Numéro de téléphone nettoyé
 */
const sanitizePhone = (phone) => {
    return phone.replace(/[^\d+]/g, "").trim();
};
exports.sanitizePhone = sanitizePhone;
/**
 * @function validatePhone
 * @description Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
const validatePhone = (phone) => {
    const cleanPhone = (0, exports.sanitizePhone)(phone);
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};
exports.validatePhone = validatePhone;
/**
 * @desc Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
const validatePhoneNumber = (phone) => {
    // Format français : +33 ou 0 suivi de 9 chiffres
    const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    // Format international simplifié
    const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    return (frenchPhoneRegex.test(phone) || internationalPhoneRegex.test(cleanPhone));
};
exports.validatePhoneNumber = validatePhoneNumber;
//# sourceMappingURL=validators.js.map