"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./prisma"));
// Import de toutes les routes générées (adapte les chemins si besoin)
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const professeurRoutes_1 = __importDefault(require("./routes/professeurRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const academicYear_routes_1 = __importDefault(require("./routes/academicYear.routes"));
const classRoutes_1 = __importDefault(require("./routes/classRoutes"));
const guardianRoutes_1 = __importDefault(require("./routes/guardianRoutes"));
const gradeRoutes_1 = __importDefault(require("./routes/gradeRoutes"));
const scheduleRoutes_1 = __importDefault(require("./routes/scheduleRoutes"));
const feePaymentRoutes_1 = __importDefault(require("./routes/feePaymentRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const classAssignmentRoutes_1 = __importDefault(require("./routes/classAssignmentRoutes"));
const feeStructureRoutes_1 = __importDefault(require("./routes/feeStructureRoutes"));
const studentFeeRoutes_1 = __importDefault(require("./routes/studentFeeRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
const backupRoutes_1 = __importDefault(require("./routes/backupRoutes"));
const timetableRoutes_1 = __importDefault(require("./routes/timetableRoutes"));
const transcriptRoutes_1 = __importDefault(require("./routes/transcriptRoutes"));
const academicYearService_1 = require("./services/academicYearService");
const path_1 = __importDefault(require("path"));
const sessionTimeout_1 = require("./middleware/sessionTimeout");
const cronService_1 = require("./services/cronService");
const requirePasswordChange_1 = require("./middleware/requirePasswordChange");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware pour gérer les CORS et le JSON
app.use((0, cors_1.default)());
(0, sessionTimeout_1.cleanupExpiredSessions)();
app.use(sessionTimeout_1.trackUserActivity);
app.use(express_1.default.json());
app.use("/uploads/profiles", express_1.default.static(path_1.default.join(process.cwd(), "uploads", "profiles")));
app.use("/uploads/imports", express_1.default.static(path_1.default.join(process.cwd(), "uploads", "imports")));
const PORT = process.env.PORT || 5000;
// Appliquer le middleware de vérification de changement de mot de passe
app.use("/api", requirePasswordChange_1.requirePasswordChange);
// Monte chaque route avec un préfixe API clair
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", auth_routes_1.default);
app.use("/api/professeurs", professeurRoutes_1.default);
app.use("/api/subjects", subjectRoutes_1.default);
app.use("/api/students", studentRoutes_1.default);
app.use("/api/enrollments", enrollmentRoutes_1.default);
app.use("/api/academic-years", academicYear_routes_1.default);
app.use("/api/classes", classRoutes_1.default);
app.use("/api/class-assignments", classAssignmentRoutes_1.default);
app.use("/api/guardians", guardianRoutes_1.default);
app.use("/api/grades", gradeRoutes_1.default);
app.use("/api/schedules", scheduleRoutes_1.default);
app.use("/api/timetables", timetableRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/announcements", announcementRoutes_1.default);
app.use("/api/fee-structures", feeStructureRoutes_1.default);
app.use("/api/student-fees", studentFeeRoutes_1.default);
app.use("/api/fee-payments", feePaymentRoutes_1.default);
app.use("/api/audit", auditRoutes_1.default);
app.use("/api/backup", backupRoutes_1.default);
app.use("/api/transcripts", transcriptRoutes_1.default);
app.use((req, res, next) => {
    // Vérifie si aucune route n'a matché
    if (!req.route) {
        res.status(404).json({
            message: "Route non trouvée",
            path: req.originalUrl,
        });
    }
    else {
        next();
    }
});
// Fonction d'initialisation asynchrone
const initializeApp = async () => {
    try {
        console.log("🚀 Démarrage de l'application...");
        // Vérifier la connexion à la base de données
        await prisma_1.default.$connect();
        console.log("✅ Connecté à la base de données");
        // Initialiser les années académiques
        console.log("📅 Initialisation des années académiques...");
        await (0, academicYearService_1.ensureAcademicYearsExist)();
        await (0, academicYearService_1.updateCurrentAcademicYear)();
        // Démarrer les tâches cron pour la maintenance automatique
        console.log("🕒 Initialisation des tâches automatiques...");
        (0, cronService_1.initializeAcademicYearCron)();
        console.log("✅ Initialisation de l'application terminée");
    }
    catch (error) {
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
//# sourceMappingURL=server.js.map