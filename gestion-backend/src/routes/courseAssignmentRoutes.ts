import express from "express";
import {
  createCourseAssignment,
  getCourseAssignments,
  // getCourseAssignmentById,
  updateCourseAssignment,
  deleteCourseAssignment,
  getAssignmentsByFaculty,
  getUEsByFacultyAndLevel,
  // getAssignmentStats,
} from "../controllers/courseAssignmentControllers";

const router = express.Router();

router.post("/", createCourseAssignment);
router.get("/", getCourseAssignments);
// router.get("/stats", getAssignmentStats);
// router.get("/:id", getCourseAssignmentById);
router.put("/:id", updateCourseAssignment);
router.delete("/:id", deleteCourseAssignment);

router.get("/faculty/:facultyId", getAssignmentsByFaculty);

export default router;
