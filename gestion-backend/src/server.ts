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

import { validate } from "../src/middleware/zodMiddleware";
import path from "path";

dotenv.config();

const app = express();
// Middleware pour gérer les CORS et le JSON

app.use(cors());
app.use(express.json());
// Servir les fichiers uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
