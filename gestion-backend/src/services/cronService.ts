// services/cronService.ts
import cron from "node-cron";
import {
  autoCreateNextAcademicYear,
  updateCurrentAcademicYear,
} from "./academicYearService";

export const initializeAcademicYearCron = () => {
  // Vérifier tous les jours à minuit
  cron.schedule("0 0 * * *", async () => {
    await autoCreateNextAcademicYear();
    await updateCurrentAcademicYear();
  });
};

// Dans app.ts
initializeAcademicYearCron();
