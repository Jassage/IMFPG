"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Fichier: src/routes/timetableRoutes.ts
const express_1 = require("express");
const middleware_1 = require("../middleware");
const timetableController_1 = require("../controllers/timetableController");
const timetableValidators_1 = require("../utils/timetableValidators");
const router = (0, express_1.Router)();
// ============ ASSIGNATIONS ============
router.get("/assignments", middleware_1.requireAuth, middleware_1.requireStaff, middleware_1.sanitizeInput, timetableController_1.getAssignments);
router.post("/assignments", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, timetableValidators_1.validateCreateAssignment, middleware_1.handleValidationErrors, timetableController_1.createAssignment);
router.get("/class/:classId", middleware_1.requireAuth, middleware_1.sanitizeInput, timetableController_1.getClassTimetable);
router.get("/professeur/:professeurId", middleware_1.requireAuth, 
// requireProfesseur,
middleware_1.sanitizeInput, timetableController_1.getProfesseurTimetable);
router.post("/assignments/:assignmentId/schedules", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, timetableValidators_1.validateCreateSchedule, middleware_1.handleValidationErrors, timetableController_1.addScheduleToAssignment);
router.put("/schedules/:scheduleId", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, timetableValidators_1.validateUpdateSchedule, middleware_1.handleValidationErrors, timetableController_1.updateSchedule);
router.delete("/schedules/:scheduleId", middleware_1.requireAuth, middleware_1.requireAdmin, middleware_1.sanitizeInput, timetableController_1.deleteSchedule);
router.post("/generate/class/:classId", middleware_1.requireAuth, middleware_1.requireAdmin, (0, middleware_1.validateContentType)(), middleware_1.validateRequestBody, middleware_1.sanitizeInput, middleware_1.handleValidationErrors, timetableController_1.generateClassTimetable);
exports.default = router;
//# sourceMappingURL=timetableRoutes.js.map