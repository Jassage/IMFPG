/**
 * @file feeStructureController.ts
 * @description Contrôleur pour la gestion des structures de frais scolaires
 * @module Controllers/FeeStructures
 */

import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * @function getAllFeeStructures
 * @description Récupère la liste paginée et filtrée des structures de frais
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const getAllFeeStructures = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "50",
      academicYear,
      isActive,
      search,
    } = req.query;

    // Conversion et validation des paramètres de pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Construction du filtre WHERE
    const where: any = {};

    if (academicYear) {
      where.academicYear = academicYear as string;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { academicYear: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Exécution parallèle des requêtes pour optimiser les performances
    const [feeStructures, total] = await Promise.all([
      // Requête principale avec pagination et champs sélectionnés
      prisma.feeStructure.findMany({
        where,
        orderBy: { academicYear: "desc" },
        skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          academicYear: true,
          amount: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              studentFees: true, // Nombre d'étudiants associés seulement
            },
          },
        },
      }),
      // Compte total pour la pagination
      prisma.feeStructure.count({ where }),
    ]);

    // Calcul des informations de pagination
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      feeStructures,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération structures de frais:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des structures de frais",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function getFeeStructureById
 * @description Récupère une structure de frais par son ID avec ses détails
 * @param {Request} req - Requête Express avec paramètre id
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const getFeeStructureById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        studentFees: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                paymentDate: true,
                paymentMethod: true,
              },
              orderBy: { paymentDate: "desc" },
            },
          },
          take: 100, // Limite pour éviter les surcharges
        },
      },
    });

    if (!feeStructure) {
      return res.status(404).json({
        error: "Structure de frais non trouvée",
        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
      });
    }

    res.json(feeStructure);
  } catch (error) {
    console.error("❌ Erreur récupération structure de frais:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération de la structure",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function createFeeStructure
 * @description Crée une nouvelle structure de frais
 * @param {Request} req - Requête Express avec body contenant les données
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const createFeeStructure = async (req: Request, res: Response) => {
  try {
    const {
      name,
      academicYear,
      amount,
      description,
      isActive = true,
    } = req.body;

    console.log(
      "📥 Données reçues pour création structure de frais:",
      req.body
    );

    // Validation des champs requis
    if (!name || !academicYear || amount === undefined) {
      return res.status(400).json({
        error: "Champs requis manquants",
        details: {
          requiredFields: ["name", "academicYear", "amount"],
          missing: {
            name: !name,
            academicYear: !academicYear,
            amount: amount === undefined,
          },
        },
      });
    }

    // Vérification de l'unicité (nom + année académique)
    const existingStructure = await prisma.feeStructure.findFirst({
      where: {
        name,
        academicYear,
      },
    });

    if (existingStructure) {
      return res.status(409).json({
        error: "Structure de frais déjà existante",
        details: {
          message: `Une structure de frais avec le nom "${name}" existe déjà pour l'année ${academicYear}`,
          existingId: existingStructure.id,
        },
      });
    }

    // Validation du montant
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 0) {
      return res.status(400).json({
        error: "Montant invalide",
        message: "Le montant doit être un nombre positif",
      });
    }

    // Création de la structure
    const newFeeStructure = await prisma.feeStructure.create({
      data: {
        name,
        academicYear,
        amount: amountValue,
        description,
        isActive,
      },
    });

    console.log("✅ Structure de frais créée avec succès:", newFeeStructure.id);

    res.status(201).json({
      message: "Structure de frais créée avec succès",
      feeStructure: newFeeStructure,
    });
  } catch (error) {
    console.error("❌ Erreur création structure de frais:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la création",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function updateFeeStructure
 * @description Met à jour une structure de frais existante
 * @param {Request} req - Requête Express avec paramètre id et body
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const updateFeeStructure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, academicYear, amount, description, isActive } = req.body;

    console.log("📥 Mise à jour structure frais:", { id, data: req.body });

    // Vérification de l'existence
    const existingStructure = await prisma.feeStructure.findUnique({
      where: { id },
    });

    if (!existingStructure) {
      return res.status(404).json({
        error: "Structure de frais non trouvée",
        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
      });
    }

    // Vérification d'unicité si l'année académique est modifiée
    if (academicYear && academicYear !== existingStructure.academicYear) {
      const duplicateStructure = await prisma.feeStructure.findFirst({
        where: {
          name,
          academicYear,
          id: { not: id },
        },
      });

      if (duplicateStructure) {
        return res.status(409).json({
          error: "Conflit de données",
          message: `Une structure de frais avec le nom "${name}" existe déjà pour l'année ${academicYear}`,
        });
      }
    }

    // Validation du montant
    if (amount !== undefined) {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue < 0) {
        return res.status(400).json({
          error: "Montant invalide",
          message: "Le montant doit être un nombre positif",
        });
      }
    }

    // Préparation des données de mise à jour
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (academicYear !== undefined) updateData.academicYear = academicYear;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // Mise à jour
    const updatedFeeStructure = await prisma.feeStructure.update({
      where: { id },
      data: updateData,
    });

    console.log("✅ Structure de frais mise à jour:", id);

    res.json({
      message: "Structure de frais mise à jour avec succès",
      feeStructure: updatedFeeStructure,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour structure:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la mise à jour",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function deleteFeeStructure
 * @description Supprime une structure de frais (soft delete logique)
 * @param {Request} req - Requête Express avec paramètre id
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const deleteFeeStructure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Tentative suppression structure frais:", id);

    // Vérification de l'existence et des dépendances
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        studentFees: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!feeStructure) {
      return res.status(404).json({
        error: "Structure de frais non trouvée",
        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
      });
    }

    // Vérification des paiements associés
    const hasPayments = feeStructure.studentFees.some(
      (studentFee) => studentFee.payments.length > 0
    );

    if (hasPayments) {
      return res.status(400).json({
        error: "Suppression impossible",
        message: "Des paiements sont associés à cette structure",
        details: {
          totalStudents: feeStructure.studentFees.length,
          suggestion: "Désactivez la structure plutôt que de la supprimer",
        },
      });
    }

    // Vérification des étudiants associés (sans paiements)
    if (feeStructure.studentFees.length > 0) {
      return res.status(400).json({
        error: "Structure utilisée",
        message: "Cette structure est associée à des étudiants",
        details: {
          totalStudents: feeStructure.studentFees.length,
          suggestion:
            "Utilisez la suppression forcée pour supprimer également les associations étudiants",
        },
      });
    }

    // Suppression (soft delete via désactivation)
    const updatedFeeStructure = await prisma.feeStructure.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    console.log("✅ Structure de frais désactivée:", id);

    res.json({
      message: "Structure de frais désactivée avec succès",
      feeStructure: updatedFeeStructure,
    });
  } catch (error) {
    console.error("❌ Erreur suppression structure:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la suppression",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function forceDeleteFeeStructure
 * @description Suppression forcée avec cascade (pour les cas spéciaux)
 * @param {Request} req - Requête Express avec paramètre id
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const forceDeleteFeeStructure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("💥 Suppression forcée structure frais:", id);

    // Vérification de l'existence
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        studentFees: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!feeStructure) {
      return res.status(404).json({
        error: "Structure de frais non trouvée",
        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
      });
    }

    // Blocage si des paiements existent
    const hasPayments = feeStructure.studentFees.some(
      (studentFee) => studentFee.payments.length > 0
    );

    if (hasPayments) {
      return res.status(400).json({
        error: "Suppression impossible",
        message: "Des paiements sont associés à cette structure",
        details: {
          totalPayments: feeStructure.studentFees.reduce(
            (sum, sf) => sum + sf.payments.length,
            0
          ),
        },
      });
    }

    // Transaction pour la suppression en cascade
    await prisma.$transaction(async (tx) => {
      // Suppression des associations étudiants
      if (feeStructure.studentFees.length > 0) {
        await tx.studentFee.deleteMany({
          where: { feeStructureId: id },
        });
      }

      // Suppression de la structure
      await tx.feeStructure.delete({
        where: { id },
      });
    });

    console.log("✅ Structure de frais supprimée avec cascade:", id);

    res.json({
      message:
        "Structure de frais et associations étudiants supprimées avec succès",
      deletedData: {
        feeStructureId: id,
        deletedStudentsCount: feeStructure.studentFees.length,
      },
    });
  } catch (error) {
    console.error("❌ Erreur suppression forcée:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la suppression forcée",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function getFeeStructureByAcademicYear
 * @description Récupère la structure de frais active par année académique
 * @param {Request} req - Requête Express avec paramètre academicYear
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const getFeeStructureByAcademicYear = async (
  req: Request,
  res: Response
) => {
  try {
    const { academicYear } = req.params;

    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        academicYear,
        isActive: true,
      },
      include: {
        studentFees: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
              },
            },
          },
          take: 50, // Limite pour éviter les surcharges
        },
      },
    });

    if (!feeStructure) {
      return res.status(404).json({
        error: "Structure non trouvée",
        message: `Aucune structure de frais active trouvée pour l'année ${academicYear}`,
        suggestion:
          "Vérifiez que l'année académique existe et qu'une structure est active",
      });
    }

    res.json(feeStructure);
  } catch (error) {
    console.error("❌ Erreur récupération frais par année:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération par année",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function getFeeStructuresByAcademicYearId
 * @description Récupère les structures de frais par ID d'année académique
 * @param {Request} req - Requête Express avec paramètre academicYearId
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const getFeeStructuresByAcademicYearId = async (
  req: Request,
  res: Response
) => {
  try {
    const { academicYearId } = req.params;

    // Récupération de l'année académique
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return res.status(404).json({
        error: "Année académique non trouvée",
        message: `Aucune année académique trouvée avec l'ID: ${academicYearId}`,
      });
    }

    // Récupération des structures de frais
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        academicYear: academicYear.year,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        academicYear: true,
        amount: true,
        description: true,
        isActive: true,
        _count: {
          select: {
            studentFees: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      academicYear: academicYear.year,
      feeStructures,
      count: feeStructures.length,
    });
  } catch (error) {
    console.error("❌ Erreur récupération frais par ID année:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function getAcademicYearsWithFees
 * @description Récupère toutes les années académiques avec leurs structures de frais
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const getAcademicYearsWithFees = async (req: Request, res: Response) => {
  try {
    const feeStructures = await prisma.feeStructure.findMany({
      select: {
        id: true,
        academicYear: true,
        name: true,
        amount: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            studentFees: true,
          },
        },
      },
      orderBy: { academicYear: "desc" },
    });

    // Regroupement par année académique
    const yearsMap = new Map();
    feeStructures.forEach((structure) => {
      const year = structure.academicYear;
      if (!yearsMap.has(year)) {
        yearsMap.set(year, {
          academicYear: year,
          structures: [],
          totalStructures: 0,
          totalStudents: 0,
        });
      }

      const yearData = yearsMap.get(year);
      yearData.structures.push(structure);
      yearData.totalStructures++;
      yearData.totalStudents += structure._count.studentFees;
    });

    const years = Array.from(yearsMap.values());

    res.json({
      years,
      totalYears: years.length,
      totalStructures: feeStructures.length,
      summary: {
        active: feeStructures.filter((s) => s.isActive).length,
        inactive: feeStructures.filter((s) => !s.isActive).length,
        totalStudents: feeStructures.reduce(
          (sum, s) => sum + s._count.studentFees,
          0
        ),
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération années avec frais:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des années",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function toggleFeeStructureStatus
 * @description Active ou désactive une structure de frais
 * @param {Request} req - Requête Express avec paramètre id
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const toggleFeeStructureStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id },
    });

    if (!feeStructure) {
      return res.status(404).json({
        error: "Structure de frais non trouvée",
        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
      });
    }

    const updatedFeeStructure = await prisma.feeStructure.update({
      where: { id },
      data: {
        isActive: !feeStructure.isActive,
      },
    });

    res.json({
      message: `Structure de frais ${updatedFeeStructure.isActive ? "activée" : "désactivée"} avec succès`,
      feeStructure: updatedFeeStructure,
      previousStatus: feeStructure.isActive,
      newStatus: updatedFeeStructure.isActive,
    });
  } catch (error) {
    console.error("❌ Erreur changement statut structure:", error);
    res.status(500).json({
      error: "Erreur serveur lors du changement de statut",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @function searchFeeStructures
 * @description Recherche avancée dans les structures de frais
 * @param {Request} req - Requête Express avec query parameters
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>}
 */
export const searchFeeStructures = async (req: Request, res: Response) => {
  try {
    const { academicYear, isActive, search } = req.query;

    const where: any = {};

    if (academicYear) {
      where.academicYear = academicYear as string;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { academicYear: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const feeStructures = await prisma.feeStructure.findMany({
      where,
      orderBy: { academicYear: "desc" },
      select: {
        id: true,
        name: true,
        academicYear: true,
        amount: true,
        description: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            studentFees: true,
          },
        },
      },
    });

    res.json({
      feeStructures,
      total: feeStructures.length,
      filtersApplied: {
        academicYear: !!academicYear,
        isActive: isActive !== undefined,
        search: !!search,
      },
    });
  } catch (error) {
    console.error("❌ Erreur recherche structures:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la recherche",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
