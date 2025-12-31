"use strict";
/**
 * Routes pour la gestion des bulletins
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BulletinController_1 = require("../controllers/BulletinController");
const middleware_1 = require("../middleware");
// import { authenticate, authorize } from '../middleware/auth';
const router = express_1.default.Router();
const bulletinController = new BulletinController_1.BulletinController();
// Middleware d'authentification pour toutes les routes
router.use(middleware_1.authenticateToken);
// Routes pour les bulletins
router.post("/generate", middleware_1.requireAuth, middleware_1.requireStaff, bulletinController.generateBulletin);
router.post("/preview", middleware_1.requireAuth, middleware_1.requireStaff, bulletinController.previewBulletin);
router.get("/student/:studentId", middleware_1.requireAuth, bulletinController.getStudentBulletins);
router.get("/download/:transcriptId", middleware_1.requireAuth, bulletinController.downloadBulletin);
exports.default = router;
//# sourceMappingURL=bulletinRoutes.js.map