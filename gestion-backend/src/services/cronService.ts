// services/cronService.ts
import cron from "node-cron";
import {
  autoCreateNextAcademicYear,
  updateCurrentAcademicYear,
} from "./academicYearService";

export const initializeAcademicYearCron = () => {
  // Vérifier tous les jours à minuit
  cron.schedule("0 0 * * *", async () => {
    console.log("🕒 Vérification automatique des années académiques...");
    await autoCreateNextAcademicYear();
    await updateCurrentAcademicYear();
  });

  console.log("✅ Tâches cron années académiques initialisées");
};

// Dans app.ts
initializeAcademicYearCron();
