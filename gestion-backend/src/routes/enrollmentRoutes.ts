import { Router } from "express";
import {
  getAllEnrollments,
  createEnrollment,
  updateEnrollment,
} from "../controllers/enrollmentController";

const router = Router();

router.get("/", getAllEnrollments);
// router.get("/:id", getEnrollmentById);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);
// router.delete("/:id", deleteEnrollment);

export default router;
