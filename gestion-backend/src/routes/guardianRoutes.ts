// routes/guardianRoutes.ts
import express from "express";
import {
  getAllGuardians,
  getGuardianById,
  createGuardian,
  updateGuardian,
  deleteGuardian,
  searchGuardians,
  setPrimaryGuardian,
  getGuardianStatistics,
} from "../controllers/guardianController";

const router = express.Router();

// Routes principales
router.get("/", getAllGuardians);
router.get("/search", searchGuardians);
router.get("/statistics", getGuardianStatistics);
router.get("/:id", getGuardianById);
router.post("/", createGuardian);
router.put("/:id", updateGuardian);
router.delete("/:id", deleteGuardian);

// Routes spécialisées
router.put("/:id/set-primary", setPrimaryGuardian);

export default router;
