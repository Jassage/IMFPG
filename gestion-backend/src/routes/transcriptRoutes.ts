import express from "express";
import {
  getAllTranscripts,
  getTranscriptById,
  createTranscript,
  updateTranscript,
  deleteTranscript,
  downloadTranscript,
  calculateStatistics,
} from "../controllers/transcriptController";

const router = express.Router();

router.get("/", getAllTranscripts);
router.get("/:id", getTranscriptById);
router.post("/", createTranscript);
router.put("/:id", updateTranscript);
router.delete("/:id", deleteTranscript);
router.get("/:id/download", downloadTranscript);
router.post("/calculate-statistics", calculateStatistics);

export default router;
