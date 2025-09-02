import express from "express";
import {
  createprofesseur,
  deleteprofesseur,
  getprofesseurAssignments,
  getprofesseurs,
  // getprofesseurStats,
  updateprofesseur,
} from "../controllers/professeurController";

const router = express.Router();

router.post("/", createprofesseur);
router.get("/", getprofesseurs);
// router.get("/:id", getProfesseurById);
router.put("/:id", updateprofesseur);
router.delete("/:id", deleteprofesseur);
router.get("/:id/assignments", getprofesseurAssignments);
// router.get("/:id/stats", getprofesseurStats);

export default router;
