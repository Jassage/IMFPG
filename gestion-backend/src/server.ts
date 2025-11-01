import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";

// Import de toutes les routes générées (adapte les chemins si besoin)
import studentRoutes from "./routes/studentRoutes";
import professeurRoutes from "./routes/professeurRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import guardianRoutes from "./routes/guardianRoutes";
import ueRoutes from "./routes/uERoutes";
import prerequisiteRoutes from "./routes/prerequisiteRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import retakeRoutes from "./routes/retakeRoutes";
import userRoutes from "./routes/userRoutes";
import facultyRoutes from "./routes/facultyRoutes";
import facultyLevelRoutes from "./routes/facultyLevelRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import expensRoutes from "./routes/expenseRoutes";
import bookRoutes from "./routes/bookRoutes";
import bookLoanRoutes from "./routes/bookLoanRoutes";
import transcriptRoutes from "./routes/transcriptRoutes";
import messageRoutes from "./routes/messageRoutes";
import messageAttachmentRoutes from "./routes/messageAttachmentRoutes";
import eventRoutes from "./routes/eventRoutes";
import eventParticipantRoutes from "./routes/eventParticipantRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import announcementAttachmentRoutes from "./routes/announcementAttachmentRoutes";
import scholarshipRoutes from "./routes/scholarshipRoutes";
import scholarshipApplicationRoutes from "./routes/scholarshipApplicationRoutes";
import scholarshipDocumentRoutes from "./routes/scholarshipDocumentRoutes";
import roomRoutes from "./routes/roomRoutes";
import roomEquipmentRoutes from "./routes/roomEquipmentRoutes";
import roomReservationRoutes from "./routes/roomReservationRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import authRoutes from "./routes/auth.routes";
import academicYearRoutes from "./routes/academicYear.routes";
import courseAssignmentRoutes from "./routes/courseAssignmentRoutes";
import feeStructureRoutes from "./routes/feeStructureRoutes";
import studentFeeRoutes from "./routes/studentFeeRoutes";
import feePaymentRoutes from "./routes/feePaymentRoutes";
import auditRoutes from "./routes/auditRoutes";
import backupRoutes from "./routes/backupRoutes";
import documentRoutes from "./routes/documentRoutes";

import {
  ensureAcademicYearsExist,
  initializeAcademicYear,
  updateCurrentAcademicYear,
} from "./services/academicYearService";
import path from "path";
import { auditMiddleware } from "./middleware/auditMiddleware";
import {
  checkSessionTimeout,
  cleanupExpiredSessions,
  trackUserActivity,
} from "./middleware/sessionTimeout";
import { initializeAcademicYearCron } from "./services/cronService";

dotenv.config();

const app = express();
// Middleware pour gérer les CORS et le JSON

app.use(cors());
cleanupExpiredSessions();
app.use(trackUserActivity);

// app.use(auditMiddleware);
app.use(express.json());
// Servir les fichiers uploads
app.use(
  "/uploads/profiles",
  express.static(path.join(process.cwd(), "uploads", "profiles"))
);
app.use(
  "/uploads/imports",
  express.static(path.join(process.cwd(), "uploads", "imports"))
);

const PORT = process.env.PORT || 4000;

// Monte chaque route avec un préfixe API clair
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/professeurs", professeurRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/course-assignments", courseAssignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/guardians", guardianRoutes);
app.use("/api/ues", ueRoutes);
app.use("/api/prerequisites", prerequisiteRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/retakes", retakeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/faculty-levels", facultyLevelRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expensRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-loans", bookLoanRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/message-attachments", messageAttachmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-participants", eventParticipantRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/announcement-attachments", announcementAttachmentRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/scholarship-applications", scholarshipApplicationRoutes);
app.use("/api/scholarship-documents", scholarshipDocumentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/room-equipments", roomEquipmentRoutes);
app.use("/api/room-reservations", roomReservationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/fee-structures", feeStructureRoutes);
app.use("/api/student-fees", studentFeeRoutes);
app.use("/api/fee-payments", feePaymentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/document", documentRoutes);
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
