"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/grades.ts
const express_1 = __importDefault(require("express"));
const gradeController_1 = require("../controllers/gradeController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const deanPermissions_1 = require("../middleware/deanPermissions");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateToken, deanPermissions_1.deanPermissions);
// Routes de base
router.get("/", gradeController_1.getAllGrades);
router.get("/:id", gradeController_1.getGradeById);
router.post("/", gradeController_1.createGrade);
router.put("/:id", gradeController_1.updateGrade); // ← Vérifiez que cette route existe
router.delete("/:id", gradeController_1.deleteGrade);
// Routes spécifiques
router.get("/student/:studentId", gradeController_1.getStudentGrades);
router.get("/ue/:ueId", gradeController_1.getUEGrades);
router.post("/bulk", gradeController_1.bulkCreateGrades);
router.get("/history/:studentId/:ueId/:academicYearId/:semester", gradeController_1.getGradeHistory);
router.post("/import/excel", upload_1.uploadImport.single("file"), gradeController_1.importGradesFromExcel);
router.get("/import/template", gradeController_1.downloadGradeTemplate);
exports.default = router;
//# sourceMappingURL=gradeRoutes.js.map