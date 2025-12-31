"use strict";
/**
 * @file validationHelpers.ts
 * @description Fonctions d'aide pour la validation
 * @module Utils/Validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAmount = exports.isPastDate = exports.isFutureDate = exports.isValidYearFormat = void 0;
/**
 * Vérifie le format d'une année académique (ex: 2024-2025)
 * @param {string} value - La valeur à valider
 * @returns {boolean} True si le format est valide
 */
const isValidYearFormat = (value) => {
    const pattern = /^\d{4}-\d{4}$/;
    if (!pattern.test(value))
        return false;
    const [start, end] = value.split("-").map(Number);
    return end === start + 1 && start >= 2000 && start <= 2100;
};
exports.isValidYearFormat = isValidYearFormat;
/**
 * Vérifie qu'une date est dans le futur
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si la date est dans le futur
 */
const isFutureDate = (date) => {
    return date > new Date();
};
exports.isFutureDate = isFutureDate;
/**
 * Vérifie qu'une date est dans le passé
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si la date est dans le passé
 */
const isPastDate = (date) => {
    return date < new Date();
};
exports.isPastDate = isPastDate;
/**
 * Valide un montant monétaire
 * @param {number} amount - Le montant à valider
 * @param {number} min - Montant minimum
 * @param {number} max - Montant maximum
 * @returns {boolean} True si le montant est valide
 */
const isValidAmount = (amount, min = 0, max = 1000000) => {
    return !isNaN(amount) && amount >= min && amount <= max;
};
exports.isValidAmount = isValidAmount;
//# sourceMappingURL=validationHelpers.js.map