"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAcademicYearCron = void 0;
// services/cronService.ts
const node_cron_1 = __importDefault(require("node-cron"));
const academicYearService_1 = require("./academicYearService");
const initializeAcademicYearCron = () => {
    // Vérifier tous les jours à minuit
    node_cron_1.default.schedule("0 0 * * *", async () => {
        console.log("🕒 Vérification automatique des années académiques...");
        await (0, academicYearService_1.autoCreateNextAcademicYear)();
        await (0, academicYearService_1.updateCurrentAcademicYear)();
    });
    console.log("✅ Tâches cron années académiques initialisées");
};
exports.initializeAcademicYearCron = initializeAcademicYearCron;
// Dans app.ts
(0, exports.initializeAcademicYearCron)();
//# sourceMappingURL=cronService.js.map