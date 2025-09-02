import { Router } from "express";
import {
  getAllTranscripts,
  getTranscriptById,
  createTranscript,
  updateTranscript,
  deleteTranscript,
} from "../controllers/transcriptController";

const router = Router();

router.get("/", getAllTranscripts);
router.get("/:id", getTranscriptById);
router.post("/", createTranscript);
router.put("/:id", updateTranscript);
router.delete("/:id", deleteTranscript);

export default router;