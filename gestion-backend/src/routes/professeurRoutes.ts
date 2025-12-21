import {
  activateProfesseur,
  attachUserToProfesseur,
  createProfesseur,
  deactivateProfesseur,
  deleteProfesseur,
  detachUserFromProfesseur,
  getProfesseurById,
  getProfesseurFullDetails,
  getProfesseurs,
  getProfesseurSchedule,
  updateProfesseur,
} from "../controllers/professeurController";
import {
  handleValidationErrors,
  requireAdmin,
  requireAuth,
  requireStaff,
  sanitizeInput,
  validateContentType,
  validateRequestBody,
} from "../middleware";

import { Router } from "express";
import {
  validateProfesseurCreate,
  validateProfesseurUpdate,
} from "../utils/profesorValidator";

const router = Router();
/**
 * @route GET /api/professeurs
 * @description Récupère la liste des professeurs
 * @access Staff/Admin
 */
router.get("/", requireAuth, requireStaff, getProfesseurs);

/**
 * @route GET /api/professeurs/:id
 * @description Récupère un professeur par ID
 * @access Staff/Admin
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getProfesseurById);

/**
 * @route GET /api/:id/schedule
 * @description Récupère l'emploi du temps d'un professeur
 * @access Staff/Admin
 */
router.get(
  "/:id/schedule",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getProfesseurSchedule
);

/**
 * @route POST /api/professeurs
 * @description Crée un nouveau professeur
 * @access Admin
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateProfesseurCreate,
  handleValidationErrors,
  createProfesseur
);

/**
 * @route PUT /api/professeurs/:id
 * @description Met à jour un professeur
 * @access Admin
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateProfesseurUpdate,
  handleValidationErrors,
  updateProfesseur
);

/**
 * @route DELETE /api/academic/professeurs/:id
 * @description Supprime un professeur
 * @access Admin
 */
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deleteProfesseur
);

/**
 * @route PUT /api/professeurs/:id/activate
 * @description Active un professeur
 * @access Admin
 */
router.put(
  "/:id/activate",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  activateProfesseur
);

/**
 * @route PUT /api/professeurs/:id/deactivate
 * @description Désactive un professeur
 * @access Admin
 */
router.put(
  "/:id/deactivate",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deactivateProfesseur
);

/*
 * @route GET /api/professeurs/:id/full-details
 * @description Récupère les détails complets d'un professeur, y compris les cours et les utilisateurs associés
 * @access Admin
 */
router.get(
  "/:id/full-details",
  requireAuth,
  requireAdmin,
  getProfesseurFullDetails
);

/**
 * @route POST /api/professeurs/:id/attach-user
 * @description Attache un compte utilisateur existant à un professeur
 * @access Admin
 */
router.post(
  "/:id/attach-user",
  requireAdmin,
  requireAuth,
  attachUserToProfesseur
);

/**
 * @route DELETE /api/professeurs/:id/detach-user
 * @description Détache le compte utilisateur associé à un professeur
 * @access Admin
 */
router.delete(
  "/:id/detach-user",
  requireAdmin,
  requireAuth,
  detachUserFromProfesseur
);
export default router;
