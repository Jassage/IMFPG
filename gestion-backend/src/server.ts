import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";

// Import de toutes les routes générées (adapte les chemins si besoin)
import studentRoutes from "./routes/studentRoutes";
import professeurRoutes from "./routes/professeurRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import authRoutes from "./routes/auth.routes";
import academicYearRoutes from "./routes/academicYear.routes";
import classesRoutes from "./routes/classRoutes";
import guardianRoutes from "./routes/guardianRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import feePaymentRoutes from "./routes/feePaymentRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import eventRoutes from "./routes/eventRoutes";

import classeAssignmentRoutes from "./routes/classAssignmentRoutes";
import feeStructureRoutes from "./routes/feeStructureRoutes";
import studentFeeRoutes from "./routes/studentFeeRoutes";
import auditRoutes from "./routes/auditRoutes";
import backupRoutes from "./routes/backupRoutes";
import timetableRoutes from "./routes/timetableRoutes";
import transcriptRoutes from "./routes/transcriptRoutes";

import {
  ensureAcademicYearsExist,
  initializeAcademicYear,
  updateCurrentAcademicYear,
} from "./services/academicYearService";
import path from "path";

import {
  cleanupExpiredSessions,
  trackUserActivity,
} from "./middleware/sessionTimeout";
import { initializeAcademicYearCron } from "./services/cronService";
import { requirePasswordChange } from "./middleware/requirePasswordChange";

dotenv.config();

const app = express();
// Middleware pour gérer les CORS et le JSON

app.use(cors());
cleanupExpiredSessions();
app.use(trackUserActivity);
app.use(express.json());

app.use(
  "/uploads/profiles",
  express.static(path.join(process.cwd(), "uploads", "profiles"))
);
app.use(
  "/uploads/imports",
  express.static(path.join(process.cwd(), "uploads", "imports"))
);

const PORT = process.env.PORT || 5000;

// Appliquer le middleware de vérification de changement de mot de passe
app.use("/api", requirePasswordChange);

// Monte chaque route avec un préfixe API clair
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);
app.use("/api/professeurs", professeurRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/class-assignments", classeAssignmentRoutes);
app.use("/api/guardians", guardianRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/schedules", scheduleRoutes);
// app.use("/api/timetables", timetableRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/fee-structures", feeStructureRoutes);
app.use("/api/student-fees", studentFeeRoutes);
app.use("/api/fee-payments", feePaymentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use((req, res, next) => {
  // Vérifie si aucune route n'a matché
  if (!req.route) {
    res.status(404).json({
      message: "Route non trouvée",
      path: req.originalUrl,
    });
  } else {
    next();
  } //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
});

// Fonction d'initialisation asynchrone
const initializeApp = async () => {
  try {
    console.log("🚀 Démarrage de l'application...");

    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log("✅ Connecté à la base de données");

    // Initialiser les années académiques
    console.log("📅 Initialisation des années académiques...");
    await ensureAcademicYearsExist();
    await updateCurrentAcademicYear();

    // Démarrer les tâches cron pour la maintenance automatique
    console.log("🕒 Initialisation des tâches automatiques...");
    initializeAcademicYearCron();

    console.log("✅ Initialisation de l'application terminée");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
};

// Lancer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

  // Initialiser l'application de manière asynchrone
  await initializeApp();

  console.log(`🎯 API prête à recevoir des requêtes sur le port ${PORT}`);
});
