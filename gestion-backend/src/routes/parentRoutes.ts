// routes/parentRoutes.ts
import express from "express";
import { createParentAccount } from "../controllers/parentController";

const router = express.Router();

// Création d'un compte parent rattaché à un ou plusieurs élèves
router.post("/create", createParentAccount);

export default router;
