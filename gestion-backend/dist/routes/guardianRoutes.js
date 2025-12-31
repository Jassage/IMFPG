"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/guardianRoutes.ts
const express_1 = __importDefault(require("express"));
const guardianController_1 = require("../controllers/guardianController");
const router = express_1.default.Router();
// Routes principales
router.get("/", guardianController_1.getAllGuardians);
router.get("/search", guardianController_1.searchGuardians);
router.get("/statistics", guardianController_1.getGuardianStatistics);
router.get("/:id", guardianController_1.getGuardianById);
router.post("/", guardianController_1.createGuardian);
router.put("/:id", guardianController_1.updateGuardian);
router.delete("/:id", guardianController_1.deleteGuardian);
// Routes spécialisées
router.put("/:id/set-primary", guardianController_1.setPrimaryGuardian);
exports.default = router;
//# sourceMappingURL=guardianRoutes.js.map