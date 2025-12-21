/**
 * Routes pour la gestion des bulletins
 */

import express from "express";
import { BulletinController } from "../controllers/BulletinController";
import { authenticateToken, requireAuth, requireStaff } from "../middleware";
// import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const bulletinController = new BulletinController();

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken);

// Routes pour les bulletins
router.post(
  "/generate",
  requireAuth,
  requireStaff,
  bulletinController.generateBulletin
);

router.post(
  "/preview",
  requireAuth,
  requireStaff,
  bulletinController.previewBulletin
);

router.get(
  "/student/:studentId",
  requireAuth,
  bulletinController.getStudentBulletins
);

router.get(
  "/download/:transcriptId",
  requireAuth,
  bulletinController.downloadBulletin
);

export default router;
