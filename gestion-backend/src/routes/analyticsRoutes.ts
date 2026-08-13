import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware";
import {
  getAllAnalyticss,
  getAnalyticsById,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
} from "../controllers/analyticsController";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllAnalyticss);
router.get("/:id", requireAuth, requireAdmin, getAnalyticsById);
router.post("/", requireAuth, requireAdmin, createAnalytics);
router.put("/:id", requireAuth, requireAdmin, updateAnalytics);
router.delete("/:id", requireAuth, requireAdmin, deleteAnalytics);

export default router;