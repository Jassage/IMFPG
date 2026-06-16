import express from "express";
import cors from "cors";
import helmet from "helmet";
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
import parentRoutes from "./routes/parentRoutes";
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
import bulletinRoutes from "./routes/bulletinRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";

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

// Origines autorisées : valeurs par défaut pour le dev local,
// surchargeables en prod via la variable CORS_ORIGINS (liste séparée par des virgules).
const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Requêtes sans origine (curl, Postman, apps mobiles) : autorisées.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  maxAge: 86400,
};

// En-têtes de sécurité HTTP
app.use(helmet());

// Appliquer CORS
app.use(cors(corsOptions));

cleanupExpiredSessions();
app.use(trackUserActivity);
app.use(
  "/uploads/profiles",
  express.static(path.join(process.cwd(), "uploads", "profiles")),
);
app.use(
  "/uploads/imports",
  express.static(path.join(process.cwd(), "uploads", "imports")),
);
app.use(express.json());

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
app.use("/api/parents", parentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/fee-structures", feeStructureRoutes);
app.use("/api/student-fees", studentFeeRoutes);
app.use("/api/fee-payments", feePaymentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use((req, res, next) => {
  // Vérifie si aucune route n'a matché
  if (!req.route) {
    res.status(404).json({
      message: "Route non trouvée",
      path: req.originalUrl,
    });
  } else {
    next();
  }
});

// Fonction d'initialisation asynchrone
const initializeApp = async () => {
  try {
    console.log("Démarrage de l'application...");

    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log("Connecté à la base de données");

    // Initialiser les années académiques
    console.log("Initialisation des années académiques...");
    await ensureAcademicYearsExist();
    await updateCurrentAcademicYear();

    // Démarrer les tâches cron pour la maintenance automatique
    console.log(" Initialisation des tâches automatiques...");
    initializeAcademicYearCron();

    console.log("Initialisation de l'application terminée");
  } catch (error) {
    console.error(" Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
};

// Lancer le serveur
app.listen(PORT, async () => {
  // Initialiser l'application de manière asynchrone
  await initializeApp();

  console.log(` API prête à recevoir des requêtes sur le port ${PORT}`);
});
