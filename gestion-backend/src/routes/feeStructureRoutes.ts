// routes/feeStructureRoutes.ts
import { Router } from "express";
import {
  getAllFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructuresByAcademicYearId,
} from "../controllers/feeStructureController";
import { authenticateToken } from "../middleware/auth.middleware";
import { deanPermissions } from "../middleware/deanPermissions";

const router = Router();
router.use(authenticateToken, deanPermissions);
router.get("/", getAllFeeStructures);
router.get("/:id", getFeeStructureById);
router.post("/", createFeeStructure);
router.put("/:id", updateFeeStructure);
router.delete("/:id", deleteFeeStructure);
router.get("/academic-years/:academicYearId", getFeeStructuresByAcademicYearId);

export default router;
