// routes/expenseRoutes.ts
import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from "../controllers/expenseController";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authenticateToken);
router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/stats", getExpenseStats);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
