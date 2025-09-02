import express from "express";
import {
  createUE,
  getUEs,
  getUEById,
  updateUE,
  deleteUE,
  addPrerequisite,
  removePrerequisite,
  getUEStats,
  searchUEs,
} from "../controllers/uEController";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import { getUEsByFacultyAndLevel } from "../controllers/courseAssignmentControllers";

const router = express.Router();

// Routes publiques
router.get("/public/search", searchUEs);

// Routes protégées
router.get("/", getUEs);
router.get("/faculty/:facultyId/level/:level", getUEsByFacultyAndLevel);
router.get("/search", authenticateToken, searchUEs);
router.get("/:id", authenticateToken, getUEById);
router.get("/:id/stats", authenticateToken, getUEStats);
router.post(
  "/",
  authenticateToken,
  requireRole(["Admin", "Directeur", "Secrétaire"]),
  createUE
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["Admin", "Directeur", "Secrétaire"]),
  updateUE
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["Admin", "Directeur"]),
  deleteUE
);
router.post(
  "/:id/prerequisites",
  authenticateToken,
  requireRole(["Admin", "Directeur", "Secrétaire"]),
  addPrerequisite
);
router.delete(
  "/:id/prerequisites/:prerequisiteId",
  authenticateToken,
  requireRole(["Admin", "Directeur", "Secrétaire"]),
  removePrerequisite
);

export default router;
