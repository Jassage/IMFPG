import {
  activateProfesseur,
  attachUserToProfesseur,
  createProfesseur,
  deactivateProfesseur,
  deleteProfesseur,
  detachUserFromProfesseur,
  getProfesseurById,
  getProfesseurByUserId,
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
  requireTeacherOrStaff,
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
 * @route GET /api/professeurs/user/:userId
 * @description Récupère le professeur associé à un compte utilisateur (espace professeur connecté)
 * @access Staff/Admin/Teacher
 */
router.get(
  "/user/:userId",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getProfesseurByUserId
);

/**
 * @route GET /api/professeurs/:id
 * @description Récupère un professeur par ID
 * @access Staff/Admin
 */
router.get(
  "/:id",
  requireAuth,
  requireTeacherOrStaff,
  sanitizeInput,
  getProfesseurById
);

/**
 * @route GET /api/:id/schedule
 * @description Récupère l'emploi du temps d'un professeur
 * @access Staff/Admin
 */
router.get(
  "/:id/schedule",
  requireAuth,
  requireTeacherOrStaff,
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
  requireStaff,
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
  requireStaff,
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
  requireStaff,
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
  requireStaff,
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
  requireStaff,
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
  requireTeacherOrStaff,
  getProfesseurFullDetails
);

/**
 * @route POST /api/professeurs/:id/attach-user
 * @description Attache un compte utilisateur existant à un professeur
 * @access Admin
 */
router.post(
  "/:id/attach-user",
  requireStaff,
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
  requireStaff,
  requireAuth,
  detachUserFromProfesseur
);

export default router;
