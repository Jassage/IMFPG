"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/academicYearRoutes.ts
const express_1 = __importDefault(require("express"));
const academicYearController_1 = require("../controllers/academicYearController");
const router = express_1.default.Router();
// Routes existantes
router.get("/", academicYearController_1.getAcademicYears);
router.get("/current", academicYearController_1.getCurrentYear);
router.post("/", academicYearController_1.createAcademicYear);
router.get("/check", academicYearController_1.checkAcademicYear);
// Nouvelles routes
router.post("/initialize-base", academicYearController_1.initializeBaseYears); // POST /api/academic-years/initialize-base
router.post("/sync", academicYearController_1.syncAcademicYears); // POST /api/academic-years/sync
router.post("/create-future", academicYearController_1.createFutureYears); // POST /api/academic-years/create-future
router.get("/available", academicYearController_1.getAvailableYears); // GET /api/academic-years/available
router.get("/exists/:year", academicYearController_1.checkYearExists); // GET /api/academic-years/exists/2024-2025
router.put("/set-current", academicYearController_1.setCurrentYear); // PUT /api/academic-years/set-current
router.get("/status", academicYearController_1.getAcademicYearStatus); // GET /api/academic-years/status
router.get("/:id", academicYearController_1.getAcademicYearById);
exports.default = router;
//# sourceMappingURL=academicYear.routes.js.map