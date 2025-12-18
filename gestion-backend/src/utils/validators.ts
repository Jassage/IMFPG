/**
 * @file validators.ts
 * @description Fonctions de validation des données
 * @version 1.0.0
 */

import { UserRole } from "../../generated/prisma";

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
const VALID_ROLES: UserRole[] = [
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
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

/**
 * @function validateUserRole
 * @description Valide et transforme un rôle utilisateur
 * @param {string} role - Rôle à valider
 * @returns {UserRole} Rôle validé
 * @throws {Error} Si le rôle est invalide
 */
export const validateUserRole = (role: string): UserRole => {
  if (VALID_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  throw new Error(
    `Rôle invalide: "${role}". Rôles valides: ${VALID_ROLES.join(", ")}`
  );
};

/**
 * @function validatePasswordStrength
 * @description Valide la force d'un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} True si le mot de passe est assez fort
 */
export const validatePasswordStrength = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * @function sanitizeInput
 * @description Nettoie et sécurise les entrées utilisateur
 * @param {string} input - Entrée à nettoyer
 * @returns {string} Entrée nettoyée
 */
export const sanitizeInput = (input: string): string => {
  return input.trim();
};

/**
 * @function sanitizePhone
 * @description Nettoie et formate un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à nettoyer
 * @returns {string} Numéro de téléphone nettoyé
 */
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+]/g, "").trim();
};

/**
 * @function validatePhone
 * @description Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = sanitizePhone(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * @desc Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} True si le numéro est valide
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Format français : +33 ou 0 suivi de 9 chiffres
  const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  // Format international simplifié
  const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;

  const cleanPhone = phone.replace(/\s+/g, "");

  return (
    frenchPhoneRegex.test(phone) || internationalPhoneRegex.test(cleanPhone)
  );
};
