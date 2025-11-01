// routes/academicYearRoutes.ts
import express from "express";
import {
  getAcademicYears,
  getCurrentYear,
  createAcademicYear,
  checkAcademicYear,
  initializeBaseYears,
  syncAcademicYears,
  createFutureYears,
  getAvailableYears,
  checkYearExists,
  setCurrentYear,
  getAcademicYearStatus,
  getAcademicYearById,
} from "../controllers/academicYearController";

const router = express.Router();

// Routes existantes
router.get("/", getAcademicYears);
router.get("/current", getCurrentYear);
router.post("/", createAcademicYear);
router.get("/check", checkAcademicYear);

// Nouvelles routes
router.post("/initialize-base", initializeBaseYears); // POST /api/academic-years/initialize-base
router.post("/sync", syncAcademicYears); // POST /api/academic-years/sync
router.post("/create-future", createFutureYears); // POST /api/academic-years/create-future
router.get("/available", getAvailableYears); // GET /api/academic-years/available
router.get("/exists/:year", checkYearExists); // GET /api/academic-years/exists/2024-2025
router.put("/set-current", setCurrentYear); // PUT /api/academic-years/set-current
router.get("/status", getAcademicYearStatus); // GET /api/academic-years/status
router.get("/:id", getAcademicYearById);

export default router;
