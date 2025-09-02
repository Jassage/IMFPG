import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getCurrentUser,
} from "../controllers/userController";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
// router.post("/login", loginUser);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);
router.get("/", getUsers);
router.get(
  "/:id",
  authenticateToken,
  requireRole(["Admin", "Directeur"]),
  getUserById
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["Admin", "Directeur"]),
  updateUser
);
router.delete("/:id", authenticateToken, requireRole(["Admin"]), deleteUser);
router.patch("/:id/password", authenticateToken, changePassword);

export default router;
