/**
 * @file feeStructureRoutes.ts
 * @description Routes pour la gestion des structures de frais scolaires
 * @module Routes/FeeStructures
 */

import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
} from "../middleware";
import {
  createFeeStructure,
  deleteFeeStructure,
  forceDeleteFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  getFeeStructureByAcademicYear,
  getFeeStructuresByAcademicYearId,
  getAcademicYearsWithFees,
  toggleFeeStructureStatus,
  updateFeeStructure,
  searchFeeStructures,
} from "../controllers/feeStructureController";
import {
  validateCreateFeeStructure,
  validateUpdateFeeStructure,
} from "../utils/feeStructureValidators";

const router = Router();

/**
 * @route GET /api/fee-structures
 * @description Récupère la liste paginée des structures de frais
 * @query {number} [page=1] - Numéro de page
 * @query {number} [limit=50] - Nombre d'éléments par page
 * @query {string} [academicYear] - Filtre par année académique
 * @query {boolean} [isActive] - Filtre par statut actif/inactif
 * @query {string} [search] - Recherche dans nom, année ou description
 * @access Staff/Admin
 * @returns {Object} Liste paginée des structures de frais
 */
router.get("/", requireAuth, requireStaff, getAllFeeStructures);

/**
 * @route GET /api/fee-structures/search
 * @description Recherche avancée des structures de frais
 * @query {string} [academicYear] - Année académique
 * @query {boolean} [isActive] - Statut actif
 * @query {string} [search] - Terme de recherche
 * @access Staff/Admin
 * @returns {Object} Résultats de recherche
 */
router.get("/search", requireAuth, requireStaff, searchFeeStructures);

/**
 * @route GET /api/fee-structures/academic-years
 * @description Récupère toutes les années académiques avec leurs structures de frais
 * @access Staff/Admin
 * @returns {Object} Liste des années avec structures de frais
 */
router.get(
  "/academic-years",
  requireAuth,
  requireStaff,
  getAcademicYearsWithFees
);

/**
 * @route GET /api/fee-structures/year/:academicYear
 * @description Récupère la structure de frais par année académique
 * @param {string} academicYear - Année académique (format: "2024-2025")
 * @access Staff/Admin
 * @returns {Object} Structure de frais pour l'année spécifiée
 */
router.get(
  "/year/:academicYear",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getFeeStructureByAcademicYear
);

/**
 * @route GET /api/fee-structures/academic-year/:academicYearId
 * @description Récupère les structures de frais par ID d'année académique
 * @param {string} academicYearId - ID de l'année académique
 * @access Staff/Admin
 * @returns {Object[]} Structures de frais pour l'année spécifiée
 */
router.get(
  "/academic-year/:academicYearId",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getFeeStructuresByAcademicYearId
);

/**
 * @route GET /api/fee-structures/:id
 * @description Récupère une structure de frais par ID
 * @param {string} id - ID de la structure de frais
 * @access Staff/Admin
 * @returns {Object} Détails complets de la structure de frais
 */
router.get(
  "/:id",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getFeeStructureById
);

/**
 * @route POST /api/fee-structures
 * @description Crée une nouvelle structure de frais
 * @body {Object} feeStructure - Données de la structure de frais
 * @body {string} feeStructure.name - Nom de la structure
 * @body {string} feeStructure.academicYear - Année académique
 * @body {number} feeStructure.amount - Montant des frais
 * @body {string} [feeStructure.description] - Description optionnelle
 * @body {boolean} [feeStructure.isActive=true] - Statut actif
 * @access Admin
 * @returns {Object} Structure de frais créée
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateFeeStructure,
  handleValidationErrors,
  createFeeStructure
);

/**
 * @route PUT /api/fee-structures/:id
 * @description Met à jour une structure de frais existante
 * @param {string} id - ID de la structure à mettre à jour
 * @body {Object} feeStructure - Données à mettre à jour
 * @body {string} [feeStructure.name] - Nouveau nom
 * @body {string} [feeStructure.academicYear] - Nouvelle année académique
 * @body {number} [feeStructure.amount] - Nouveau montant
 * @body {string} [feeStructure.description] - Nouvelle description
 * @body {boolean} [feeStructure.isActive] - Nouveau statut
 * @access Admin
 * @returns {Object} Structure de frais mise à jour
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateFeeStructure,
  handleValidationErrors,
  updateFeeStructure
);

/**
 * @route PATCH /api/fee-structures/:id/toggle-status
 * @description Active ou désactive une structure de frais
 * @param {string} id - ID de la structure à modifier
 * @access Admin
 * @returns {Object} Structure de frais avec statut mis à jour
 */
router.patch(
  "/:id/toggle-status",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  toggleFeeStructureStatus
);

/**
 * @route DELETE /api/fee-structures/:id
 * @description Supprime une structure de frais (si non utilisée)
 * @param {string} id - ID de la structure à supprimer
 * @access Admin
 * @returns {Object} Message de confirmation
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deleteFeeStructure
);

/**
 * @route DELETE /api/fee-structures/:id/force
 * @description Supprime une structure de frais avec cascade (suppression forcée)
 * @param {string} id - ID de la structure à supprimer
 * @access Admin
 * @returns {Object} Message de confirmation avec détails
 */
router.delete(
  "/:id/force",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  forceDeleteFeeStructure
);

export default router;
