"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollmentController_1 = require("../controllers/enrollmentController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const deanPermissions_1 = require("../middleware/deanPermissions");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken, deanPermissions_1.deanPermissions);
router.get("/", enrollmentController_1.getAllEnrollments);
// router.get("/:id", getEnrollmentById);
router.post("/", enrollmentController_1.createEnrollment);
router.put("/:id", enrollmentController_1.updateEnrollment);
router.delete("/:id", enrollmentController_1.deleteEnrollment);
// Nouvelles routes pour corriger les statuts
router.post("/fix-statuses/all", enrollmentController_1.fixEnrollmentStatuses); // Pour tous les étudiants
router.post("/fix-statuses/student/:studentId", enrollmentController_1.fixStudentEnrollmentStatus); // Pour un étudiant spécifique
router.post("/import", upload_1.logUpload, upload_1.uploadImport.single("file"), enrollmentController_1.importEnrollments);
router.post("/export", enrollmentController_1.exportEnrollments);
router.get("/download-template", enrollmentController_1.downloadEnrollmentImportTemplate);
router.get("/:studentId/enrollment-dates", enrollmentController_1.getEnrollmentDates);
exports.default = router;
//# sourceMappingURL=enrollmentRoutes.js.map