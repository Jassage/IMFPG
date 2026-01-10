/**
 * @file classRoutes.ts
 * @description Routes pour la gestion des classes scolaires
 * @version 1.0.0
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
  requireTeacherOrStaff,
  requireDirector,
} from "../middleware";

import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  getClassStats,
  updateClass,
} from "../controllers/classController";
import {
  validateCreateClass,
  validateUpdateClass,
} from "../utils/classValidators";

const router = Router();

/**
 * @route GET /api/academic/classes
 * @description Récupère la liste des classes
 * @access Staff/Admin
 */
router.get("/", requireAuth, requireTeacherOrStaff, getClasses);

/**
 * @route GET /api/academic/classes/:id
 * @description Récupère une classe par ID
 * @access Staff/Admin
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getClassById);

/**
 * @route GET /api/academic/classes/:id/stats
 * @description Récupère les statistiques d'une classe
 * @access Staff/Admin
 */
router.get(
  "/:id/stats",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getClassStats
);

/**
 * @route POST /api/academic/classes
 * @description Crée une nouvelle classe
 * @access Admin
 */
router.post(
  "/",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateClass,
  handleValidationErrors,
  createClass
);

/**
 * @route PUT /api/academic/classes/:id
 * @description Met à jour une classe
 * @access Admin
 */
router.put(
  "/:id",
  requireAuth,
  requireDirector,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateClass,
  handleValidationErrors,
  updateClass
);

/**
 * @route DELETE /api/academic/classes/:id
 * @description Supprime une classe
 * @access Admin
 */
router.delete("/:id", requireAuth, requireDirector, sanitizeInput, deleteClass);

export default router;
