/**
 * @file studentRoutes.ts
 * @description Routes pour la gestion des étudiants
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
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/studentController";
import {
  validateCreateStudent,
  validateUpdateStudent,
} from "../utils/studentValidators";

const router = Router();

/**
 * @route GET /api/students
 * @description Récupère la liste des étudiants
 * @access Staff/Admin
 */
router.get("/", requireAuth, requireStaff, getStudents);

/**
 * @route GET /api/students/:id
 * @description Récupère un étudiant par ID
 * @access Staff/Admin
 */
router.get("/:id", requireAuth, requireStaff, sanitizeInput, getStudentById);

/**
 * @route POST /api/students
 * @description Crée un nouvel étudiant
 * @access Admin
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateStudent,
  handleValidationErrors,
  createStudent
);

/**
 * @route PUT /api/students/:id
 * @description Met à jour un étudiant
 * @access Admin
 */
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateStudent,
  handleValidationErrors,
  updateStudent
);

/**
 * @route DELETE /api/students/:id
 * @description Supprime un étudiant
 * @access Admin
 */
router.delete("/:id", requireAuth, requireAdmin, sanitizeInput, deleteStudent);

export default router;
