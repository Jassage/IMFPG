"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transcriptController_1 = require("../controllers/transcriptController");
const router = express_1.default.Router();
router.get("/", transcriptController_1.getAllTranscripts);
router.get("/:id", transcriptController_1.getTranscriptById);
router.post("/", transcriptController_1.createTranscript);
router.put("/:id", transcriptController_1.updateTranscript);
router.delete("/:id", transcriptController_1.deleteTranscript);
router.get("/:id/download", transcriptController_1.downloadTranscript);
router.post("/calculate-statistics", transcriptController_1.calculateStatistics);
exports.default = router;
//# sourceMappingURL=transcriptRoutes.js.map