"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const auth_middleware_1 = require("../middleware/auth.middleware");
// import { authenticateToken, requireRole } from "../middleware/auth.middleware";
const router = express_1.default.Router();
// Public routes
router.get("/public/upcoming", eventController_1.getUpcomingEvents);
router.get("/public/:id", eventController_1.getEventById);
// Protected routes
router.get("/", auth_middleware_1.authenticateToken, eventController_1.getEvents);
router.get("/:id", auth_middleware_1.authenticateToken, eventController_1.getEventById);
router.post("/", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["Admin", "Directeur", "Secrétaire"]), eventController_1.createEvent);
router.put("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["Admin", "Directeur", "Secrétaire"]), eventController_1.updateEvent);
router.delete("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["Admin", "Directeur"]), eventController_1.deleteEvent);
router.post("/:id/register", eventController_1.registerForEvent);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map