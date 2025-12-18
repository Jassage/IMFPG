/**
 * @file validationHelpers.ts
 * @description Fonctions d'aide pour la validation
 * @module Utils/Validation
 */

/**
 * Vérifie le format d'une année académique (ex: 2024-2025)
 * @param {string} value - La valeur à valider
 * @returns {boolean} True si le format est valide
 */
export const isValidYearFormat = (value: string): boolean => {
  const pattern = /^\d{4}-\d{4}$/;
  if (!pattern.test(value)) return false;

  const [start, end] = value.split("-").map(Number);
  return end === start + 1 && start >= 2000 && start <= 2100;
};

/**
 * Vérifie qu'une date est dans le futur
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si la date est dans le futur
 */
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Vérifie qu'une date est dans le passé
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si la date est dans le passé
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Valide un montant monétaire
 * @param {number} amount - Le montant à valider
 * @param {number} min - Montant minimum
 * @param {number} max - Montant maximum
 * @returns {boolean} True si le montant est valide
 */
export const isValidAmount = (
  amount: number,
  min = 0,
  max = 1000000
): boolean => {
  return !isNaN(amount) && amount >= min && amount <= max;
};
