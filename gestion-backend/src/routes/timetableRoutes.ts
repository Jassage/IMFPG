// Fichier: src/routes/timetableRoutes.ts
import { Router } from "express";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  // requireProfesseur,
  validateRequestBody,
  validateContentType,
  sanitizeInput,
  handleValidationErrors,
} from "../middleware";

import {
  // Assignations
  getAssignments,
  createAssignment,

  // Emplois du temps
  getClassTimetable,
  getProfesseurTimetable,
  addScheduleToAssignment,
  updateSchedule,
  deleteSchedule,
  generateClassTimetable,
} from "../controllers/timetableController";

import {
  validateCreateAssignment,
  validateCreateSchedule,
  validateUpdateSchedule,
} from "../utils/timetableValidators";

const router = Router();

// ============ ASSIGNATIONS ============
router.get(
  "/assignments",
  requireAuth,
  requireStaff,
  sanitizeInput,
  getAssignments
);

router.post(
  "/assignments",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateAssignment,
  handleValidationErrors,
  createAssignment
);

router.get("/class/:classId", requireAuth, sanitizeInput, getClassTimetable);

router.get(
  "/professeur/:professeurId",
  requireAuth,
  // requireProfesseur,
  sanitizeInput,
  getProfesseurTimetable
);

router.post(
  "/assignments/:assignmentId/schedules",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateCreateSchedule,
  handleValidationErrors,
  addScheduleToAssignment
);

router.put(
  "/schedules/:scheduleId",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  validateUpdateSchedule,
  handleValidationErrors,
  updateSchedule
);

router.delete(
  "/schedules/:scheduleId",
  requireAuth,
  requireAdmin,
  sanitizeInput,
  deleteSchedule
);

router.post(
  "/generate/class/:classId",
  requireAuth,
  requireAdmin,
  validateContentType(),
  validateRequestBody,
  sanitizeInput,
  handleValidationErrors,
  generateClassTimetable
);

export default router;
