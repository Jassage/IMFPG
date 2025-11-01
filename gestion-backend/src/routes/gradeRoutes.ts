// routes/grades.ts
import express from "express";
import {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getStudentGrades,
  getUEGrades,
  bulkCreateGrades,
  getGradeHistory,
  downloadGradeTemplate,
  importGradesFromExcel, // Nouvelle route si nécessaire
} from "../controllers/gradeController";
import { authenticateToken } from "../middleware/auth.middleware";
import { deanPermissions } from "../middleware/deanPermissions";
import { uploadImport } from "../middleware/upload";

const router = express.Router();
router.use(authenticateToken, deanPermissions);

// Routes de base
router.get("/", getAllGrades);
router.get("/:id", getGradeById);
router.post("/", createGrade);
router.put("/:id", updateGrade); // ← Vérifiez que cette route existe
router.delete("/:id", deleteGrade);

// Routes spécifiques
router.get("/student/:studentId", getStudentGrades);
router.get("/ue/:ueId", getUEGrades);
router.post("/bulk", bulkCreateGrades);
router.get(
  "/history/:studentId/:ueId/:academicYearId/:semester",
  getGradeHistory
);

router.post(
  "/import/excel",
  uploadImport.single("file"),
  importGradesFromExcel
);

router.get("/import/template", downloadGradeTemplate);

export default router;
