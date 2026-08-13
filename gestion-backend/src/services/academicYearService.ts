// src/services/academicYearService.ts
import prisma from "../prisma";

// Fonctions utilitaires
export const getAcademicYearFromDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Janvier = 1, Décembre = 12
  return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const getAcademicYearDates = (
  academicYear: string
): { start: Date; end: Date } => {
  const [startYear] = academicYear.split("-").map(Number);
  return {
    start: new Date(startYear, 8, 1), // 1er septembre
    end: new Date(startYear + 1, 7, 31), // 31 août
  };
};

// Générer la prochaine année académique
export const getNextAcademicYear = (currentAcademicYear: string): string => {
  const [startYear, endYear] = currentAcademicYear.split("-").map(Number);
  return `${startYear + 1}-${endYear + 1}`;
};

// Initialiser les années académiques de base (2020-2021 à 2025-2026)
export const initializeBaseAcademicYears = async (): Promise<void> => {
  try {
    const baseYears = [
      "2020-2021",
      "2021-2022",
      "2022-2023",
      "2023-2024",
      "2024-2025",
      "2025-2026",
    ];

    for (const year of baseYears) {
      const { start, end } = getAcademicYearDates(year);

      // Vérifier si l'année existe déjà
      const existingYear = await prisma.academicYear.findUnique({
        where: { year },
      });

      if (!existingYear) {
        await prisma.academicYear.create({
          data: {
            year,
            startDate: start,
            endDate: end,
            isCurrent: false,
          },
        });
      } else {
      }
    }
  } catch (error) {
    console.error(
      " Erreur lors de l'initialisation des années de base:",
      error
    );
  }
};

// Vérifier et créer les années académiques manquantes
export const ensureAcademicYearsExist = async (): Promise<void> => {
  try {
    console.log("🔍 Vérification des années académiques...");

    // D'abord initialiser les années de base
    await initializeBaseAcademicYears();

    const today = new Date();
    const currentAcademicYear = getAcademicYearFromDate(today);

    // Vérifier si l'année courante existe
    const currentYearExists = await prisma.academicYear.findUnique({
      where: { year: currentAcademicYear },
    });

    if (!currentYearExists) {
      const { start, end } = getAcademicYearDates(currentAcademicYear);

      await prisma.academicYear.create({
        data: {
          year: currentAcademicYear,
          startDate: start,
          endDate: end,
          isCurrent: true,
        },
      });
    }

    // Vérifier et créer les années futures si nécessaire
    await ensureFutureAcademicYears();

    // Mettre à jour l'année courante
    await updateCurrentAcademicYear();

    console.log(" Vérification des années académiques terminée");
  } catch (error) {
    console.error(
      " Erreur lors de la vérification des années académiques:",
      error
    );
  }
};

// S'assurer que les années futures existent
export const ensureFutureAcademicYears = async (
  yearsAhead: number = 2
): Promise<void> => {
  try {
    console.log(`🔮 Vérification des ${yearsAhead} prochaines années...`);

    const today = new Date();
    let currentYear = getAcademicYearFromDate(today);

    for (let i = 0; i < yearsAhead; i++) {
      const nextYear = getNextAcademicYear(currentYear);

      const yearExists = await prisma.academicYear.findUnique({
        where: { year: nextYear },
      });

      if (!yearExists) {
        const { start, end } = getAcademicYearDates(nextYear);

        await prisma.academicYear.create({
          data: {
            year: nextYear,
            startDate: start,
            endDate: end,
            isCurrent: false,
          },
        });
        console.log(` Année future créée: ${nextYear}`);
      }

      currentYear = nextYear;
    }
  } catch (error) {
    console.error(" Erreur lors de la création des années futures:", error);
  }
};

// Mettre à jour l'année académique courante
export const updateCurrentAcademicYear = async (): Promise<void> => {
  try {
    const today = new Date();
    const currentAcademicYear = getAcademicYearFromDate(today);

    // Désactiver toutes les années
    await prisma.academicYear.updateMany({
      data: { isCurrent: false },
    });

    // Activer l'année courante
    await prisma.academicYear.update({
      where: { year: currentAcademicYear },
      data: { isCurrent: true },
    });
  } catch (error) {
    console.error(" Erreur lors de la mise à jour de l'année courante:", error);
  }
};

// Fonction d'initialisation complète
export const initializeAcademicYear = async (): Promise<void> => {
  try {
    // 1. Initialiser les années de base
    await initializeBaseAcademicYears();

    // 2. S'assurer que toutes les années nécessaires existent
    await ensureAcademicYearsExist();

    // 3. Mettre à jour l'année courante
    await updateCurrentAcademicYear();

    // 4. Afficher le statut final
    const allYears = await getAllAcademicYears();
    const currentYear = await getCurrentAcademicYear();
  } catch (error) {
    console.error(" Erreur lors de l'initialisation complète:", error);
  }
};

// Vérifier si c'est le moment de créer une nouvelle année (1er septembre)
export const shouldCreateNewAcademicYear = (): boolean => {
  const today = new Date();
  return today.getDate() === 1 && today.getMonth() === 8; // 1er septembre
};

// Créer automatiquement la prochaine année académique si nécessaire
export const autoCreateNextAcademicYear = async (): Promise<void> => {
  try {
    if (shouldCreateNewAcademicYear()) {
      const today = new Date();
      const nextAcademicYear = getNextAcademicYear(
        getAcademicYearFromDate(today)
      );

      const yearExists = await prisma.academicYear.findUnique({
        where: { year: nextAcademicYear },
      });

      if (!yearExists) {
        const { start, end } = getAcademicYearDates(nextAcademicYear);

        await prisma.academicYear.create({
          data: {
            year: nextAcademicYear,
            startDate: start,
            endDate: end,
            isCurrent: false,
          },
        });
      }
    }
  } catch (error) {
    console.error(" Erreur lors de la création automatique:", error);
  }
};

// Obtenir l'année académique courante
export const getCurrentAcademicYear = async () => {
  return await prisma.academicYear.findFirst({
    where: { isCurrent: true },
  });
};

// Obtenir toutes les années académiques
export const getAllAcademicYears = async () => {
  return await prisma.academicYear.findMany({
    orderBy: { year: "desc" },
  });
};

// Obtenir les années académiques disponibles pour les inscriptions
export const getAvailableAcademicYears = async () => {
  const today = new Date();
  const currentYear = getAcademicYearFromDate(today);

  return await prisma.academicYear.findMany({
    where: {
      year: {
        gte: "2020-2021",
      },
    },
    orderBy: { year: "desc" },
  });
};

// Vérifier si une année académique existe
export const academicYearExists = async (year: string): Promise<boolean> => {
  const existingYear = await prisma.academicYear.findUnique({
    where: { year },
  });
  return !!existingYear;
};

export default prisma;
