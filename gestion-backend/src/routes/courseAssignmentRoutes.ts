import express from "express";
import {
  createCourseAssignment,
  getCourseAssignments,
  // getCourseAssignmentById,
  updateCourseAssignment,
  deleteCourseAssignment,
  getAssignmentsByFaculty,
  getUEsByFacultyAndLevel,
  copyAssignments,
  importAssignmentsFromExcel,
  downloadAssignmentTemplate,
} from "../controllers/courseAssignmentControllers";
import { authenticateToken } from "../middleware/auth.middleware";
import { deanPermissions } from "../middleware/deanPermissions";
import { uploadImport } from "../middleware/upload";

const router = express.Router();
router.use(authenticateToken, deanPermissions);

router.post("/", createCourseAssignment);
router.get("/", getCourseAssignments);
// router.get("/stats", getAssignmentStats);
// router.get("/:id", getCourseAssignmentById);
router.put("/:id", updateCourseAssignment);
router.delete("/:id", deleteCourseAssignment);

router.get("/faculty/:facultyId", getAssignmentsByFaculty);
router.post("/copy", copyAssignments);
router.post(
  "/import-excel",
  uploadImport.single("file"),
  importAssignmentsFromExcel
);

// Route pour télécharger le template
router.get("/download-template", downloadAssignmentTemplate);
// router.post('/assignments/copy-to-level', copyAssignmentsToLevel);

export default router;
