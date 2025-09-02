// routes/studentRoutes.ts
import express from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  importStudents,
  updateStudentPhoto,
  downloadImportTemplate,
} from "../controllers/studentController";
import { uploadProfile, uploadImport } from "../middleware/upload";

const router = express.Router();

router.post("/", uploadProfile.single("photo"), createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

// Nouvelles routes pour l'importation et les photos
router.post("/import", uploadImport.single("file"), importStudents);
router.patch("/:id/photo", uploadProfile.single("photo"), updateStudentPhoto);
router.get("/import/template", downloadImportTemplate);

export default router;
