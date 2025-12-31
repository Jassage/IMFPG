// src/controllers/academicYearController.ts
import { Request, Response } from "express";
import {
  initializeAcademicYear,
  getCurrentAcademicYear,
  getAllAcademicYears,
  shouldCreateNewAcademicYear,
  initializeBaseAcademicYears,
  ensureAcademicYearsExist,
  updateCurrentAcademicYear,
  autoCreateNextAcademicYear,
  getAvailableAcademicYears,
  academicYearExists,
  ensureFutureAcademicYears,
} from "../services/academicYearService";
import prisma from "../prisma";

// Récupérer toutes les années académiques
export const getAcademicYears = async (req: Request, res: Response) => {
  try {
    const academicYears = await getAllAcademicYears();
    res.json(academicYears);
  } catch (error: any) {
    console.error("Erreur getAcademicYears:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer l'année académique courante
export const getCurrentYear = async (req: Request, res: Response) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    res.json(currentYear);
  } catch (error: any) {
    console.error("Erreur getCurrentYear:", error);
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle année académique (via Postman)
export const createAcademicYear = async (req: Request, res: Response) => {
  try {
    const { year, startDate, endDate, isCurrent } = req.body;

    if (!year || !startDate || !endDate) {
      return res.status(400).json({
        message: "Les champs year, startDate et endDate sont obligatoires",
      });
    }

    // Vérifier si l'année existe déjà
    const existingYear = await academicYearExists(year);
    if (existingYear) {
      return res.status(400).json({
        message: `L'année académique ${year} existe déjà`,
      });
    }

    const newYear = await prisma.academicYear.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: isCurrent ?? false,
      },
    });

    // Si c'est l'année courante, mettre à jour les autres
    if (isCurrent) {
      await updateCurrentAcademicYear();
    }

    res.status(201).json(newYear);
  } catch (error: any) {
    console.error("Erreur createAcademicYear:", error);
    res.status(500).json({ message: error.message });
  }
};

// Vérifier si une nouvelle année académique doit être créée
export const checkAcademicYear = async (req: Request, res: Response) => {
  try {
    const needNewYear = shouldCreateNewAcademicYear();

    if (needNewYear) {
      await autoCreateNextAcademicYear();
      await updateCurrentAcademicYear();
    }

    const currentYear = await getCurrentAcademicYear();
    res.json({
      shouldCreate: needNewYear,
      currentYear,
      message: needNewYear
        ? "Nouvelle année créée automatiquement"
        : "Aucune action nécessaire",
    });
  } catch (error: any) {
    console.error("Erreur checkAcademicYear:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Initialiser les années de base (2020-2021 à 2025-2026)
export const initializeBaseYears = async (req: Request, res: Response) => {
  try {
    console.log("🔄 Initialisation des années de base demandée...");

    await initializeBaseAcademicYears();
    const years = await getAllAcademicYears();

    res.json({
      message: "Années académiques de base initialisées avec succès",
      years: years,
      total: years.length,
    });
  } catch (error: any) {
    console.error("Erreur initializeBaseYears:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Synchronisation complète des années académiques
export const syncAcademicYears = async (req: Request, res: Response) => {
  try {
    console.log("🔄 Synchronisation complète des années académiques...");

    await ensureAcademicYearsExist();
    await updateCurrentAcademicYear();

    const years = await getAllAcademicYears();
    const currentYear = await getCurrentAcademicYear();

    res.json({
      message: "Synchronisation des années académiques terminée",
      currentYear: currentYear?.year,
      totalYears: years.length,
      years: years,
    });
  } catch (error: any) {
    console.error("Erreur syncAcademicYears:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Forcer la création d'années futures
export const createFutureYears = async (req: Request, res: Response) => {
  try {
    const { yearsAhead = 2 } = req.body;

    console.log(`🔮 Création des ${yearsAhead} prochaines années...`);

    await ensureFutureAcademicYears(yearsAhead);
    const years = await getAllAcademicYears();

    res.json({
      message: `Création de ${yearsAhead} années futures terminée`,
      years: years,
      total: years.length,
    });
  } catch (error: any) {
    console.error("Erreur createFutureYears:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Obtenir les années disponibles pour les inscriptions
export const getAvailableYears = async (req: Request, res: Response) => {
  try {
    const availableYears = await getAvailableAcademicYears();

    res.json({
      years: availableYears,
      total: availableYears.length,
    });
  } catch (error: any) {
    console.error("Erreur getAvailableYears:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Vérifier si une année académique existe
export const checkYearExists = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({
        message: "Le paramètre year est requis",
      });
    }

    const exists = await academicYearExists(year);
    let yearDetails = null;

    if (exists) {
      yearDetails = await prisma.academicYear.findUnique({
        where: { year },
      });
    }

    res.json({
      year,
      exists,
      details: yearDetails,
    });
  } catch (error: any) {
    console.error("Erreur checkYearExists:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Mettre à jour l'année courante manuellement
export const setCurrentYear = async (req: Request, res: Response) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({
        message: "Le champ year est requis",
      });
    }

    // Vérifier si l'année existe
    const yearExists = await academicYearExists(year);
    if (!yearExists) {
      return res.status(404).json({
        message: `L'année académique ${year} n'existe pas`,
      });
    }

    // Désactiver toutes les années
    await prisma.academicYear.updateMany({
      data: { isCurrent: false },
    });

    // Activer l'année spécifiée
    const updatedYear = await prisma.academicYear.update({
      where: { year },
      data: { isCurrent: true },
    });

    res.json({
      message: `Année courante définie sur ${year}`,
      currentYear: updatedYear,
    });
  } catch (error: any) {
    console.error("Erreur setCurrentYear:", error);
    res.status(500).json({ message: error.message });
  }
};

// NOUVEAU : Statut du système d'années académiques
export const getAcademicYearStatus = async (req: Request, res: Response) => {
  try {
    const currentYear = await getCurrentAcademicYear();
    const allYears = await getAllAcademicYears();
    const availableYears = await getAvailableAcademicYears();
    const shouldCreate = shouldCreateNewAcademicYear();

    res.json({
      status: "ok",
      currentYear: currentYear,
      shouldCreateNewYear: shouldCreate,
      statistics: {
        totalYears: allYears.length,
        availableForEnrollment: availableYears.length,
        yearsRange:
          allYears.length > 0
            ? `${allYears[allYears.length - 1].year} - ${allYears[0].year}`
            : "Aucune année",
      },
      years: allYears,
    });
  } catch (error: any) {
    console.error("Erreur getAcademicYearStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAcademicYearById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const academicYear = await prisma.academicYear.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
          },
        },
      },
    });

    if (!academicYear) {
      return res.status(404).json({
        error: "Année académique non trouvée",
      });
    }

    res.json(academicYear);
  } catch (error) {
    console.error("❌ Erreur récupération année académique:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
