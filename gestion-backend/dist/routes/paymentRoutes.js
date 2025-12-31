"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken);
router.get("/", paymentController_1.getAllPayments);
router.get("/:id", paymentController_1.getPaymentById);
router.post("/", paymentController_1.createPayment);
router.put("/:id", paymentController_1.updatePayment);
router.delete("/:id", paymentController_1.deletePayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map