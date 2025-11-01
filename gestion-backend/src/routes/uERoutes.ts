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
  downloadUEImportTemplate,
  exportUEs,
  importUEs,
} from "../controllers/uEController";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import { getUEsByFacultyAndLevel } from "../controllers/courseAssignmentControllers";
import { deanPermissions } from "../middleware/deanPermissions";
import { uploadImport } from "../middleware/upload";

const router = express.Router();
router.use(authenticateToken, deanPermissions);

// Routes publiques
router.get("/public/search", searchUEs);

// Routes protégées
router.get("/", getUEs);
router.get("/faculty/:facultyId/level/:level", getUEsByFacultyAndLevel);
router.get("/search", searchUEs);
router.get("/template", downloadUEImportTemplate);
router.get("/export", exportUEs);
router.post("/import", uploadImport.single("file"), importUEs);
router.get("/:id", getUEById);
router.get("/:id/stats", getUEStats);
router.post("/", requireRole(["Admin", "Directeur", "Secrétaire"]), createUE);
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
