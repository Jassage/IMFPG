/**
 * @file professeurController.ts
 * @description Contrôleurs pour la gestion des professeurs
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

const prisma = new PrismaClient();

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des professeurs
 *
 */
export const getProfesseurs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      speciality,
      sortBy = "lastName",
      sortOrder = "asc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (speciality) {
      where.speciality = {
        contains: speciality as string,
        mode: "insensitive",
      };
    }

    // Récupération avec pagination
    const [professeurs, total] = await Promise.all([
      prisma.professeur.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
          assignments: {
            include: {
              subject: true,
              academicYear: true,
            },
          },
          _count: {
            select: {
              assignments: true,
              schedules: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.professeur.count({ where }),
    ]);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEURS_LIST_REQUEST",
      entity: "Professeur",
      description: "Liste des professeurs récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeurs récupérés avec succès",
      data: {
        professeurs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - getProfesseurs error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEURS_LIST_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération des professeurs",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère un professeur par ID
 */
export const getProfesseurById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            lastLogin: true,
            createdAt: true,
          },
        },
        assignments: {
          include: {
            subject: true,
            academicYear: true,
            schedules: {
              include: {
                schoolClass: true,
              },
            },
          },
        },
        schedules: {
          include: {
            classAssignment: {
              include: {
                subject: true,
              },
            },
            schoolClass: true,
          },
        },
      },
    });

    if (!professeur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails du professeur récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur récupéré avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - getProfesseurById error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DETAILS_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée un nouveau professeur
 */
export const createProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { firstName, lastName, email, phone, speciality, matricule, userId } =
      req.body;

    // Vérifier si l'email existe déjà
    const existingProfesseur = await prisma.professeur.findUnique({
      where: { email },
    });

    if (existingProfesseur) {
      const response: ApiResponse = {
        success: false,
        message: "Un professeur avec cet email existe déjà",
        code: "PROFESSEUR_EMAIL_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Si un userId est fourni, vérifier qu'il existe
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: "L'utilisateur associé n'existe pas",
          code: "USER_NOT_FOUND",
        };
        res.status(400).json(response);
        return;
      }

      // Vérifier si l'utilisateur a déjà un profil professeur
      const existingProfesseurWithUser = await prisma.professeur.findUnique({
        where: { userId },
      });

      if (existingProfesseurWithUser) {
        const response: ApiResponse = {
          success: false,
          message: "Cet utilisateur est déjà associé à un professeur",
          code: "USER_ALREADY_PROFESSEUR",
        };
        res.status(400).json(response);
        return;
      }
    }

    // Créer le professeur
    const professeur = await prisma.professeur.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        speciality,
        matricule,
        status: "Actif",
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_CREATED",
      entity: "Professeur",
      entityId: professeur.id,
      description: `Professeur "${firstName} ${lastName}" créé`,
      status: "SUCCESS",
      metadata: {
        email,
        speciality,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur créé avec succès",
      data: { professeur },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - createProfesseur error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_CREATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la création du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour un professeur
 */
export const updateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      speciality,
      matricule,
      status,
      userId,
    } = req.body;

    // Vérifier si le professeur existe
    const existingProfesseur = await prisma.professeur.findUnique({
      where: { id },
    });

    if (!existingProfesseur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si le nouvel email existe déjà
    if (email && email !== existingProfesseur.email) {
      const professeurWithEmail = await prisma.professeur.findUnique({
        where: { email },
      });

      if (professeurWithEmail) {
        const response: ApiResponse = {
          success: false,
          message: "Un autre professeur utilise déjà cet email",
          code: "PROFESSEUR_EMAIL_EXISTS",
        };
        res.status(400).json(response);
        return;
      }
    }

    // Mettre à jour
    const professeur = await prisma.professeur.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        speciality,
        matricule,
        status,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_UPDATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${firstName} ${lastName}" mis à jour`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur mis à jour avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - updateProfesseur error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_UPDATE_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la mise à jour du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Supprime un professeur
 */
export const deleteProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });

    if (!professeur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier les dépendances
    if (professeur._count.assignments > 0) {
      const response: ApiResponse = {
        success: false,
        message:
          "Ce professeur ne peut pas être supprimé car il est assigné à des classes ou matières",
        code: "PROFESSEUR_HAS_DEPENDENCIES",
        data: {
          assignments: professeur._count.assignments,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Désactiver plutôt que supprimer
    await prisma.professeur.update({
      where: { id },
      data: { status: "Inactif" },
    });

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DELETED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" désactivé`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur désactivé avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - deleteProfesseur error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DELETION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la suppression du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
export const getProfesseurSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { weekStart } = req.query;

    // Récupérer tous les horaires du professeur
    const schedules = await prisma.schedule.findMany({
      where: {
        professeurId: id,
      },
      include: {
        classAssignment: {
          include: {
            subject: true,
            academicYear: true,
          },
        },
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Organiser par jour
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    schedules.forEach((schedule) => {
      scheduleByDay[schedule.dayOfWeek].push(schedule);
    });

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_SCHEDULE_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Emploi du temps du professeur récupéré",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Emploi du temps récupéré avec succès",
      data: {
        scheduleByDay,
        totalSessions: schedules.length,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ProfesseurController - getProfesseurSchedule error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_SCHEDULE_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération de l'emploi du temps",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Active un professeur
 */
export const activateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  try {
    const { id } = req.params;
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
      where: { id },
    });
    if (!professeur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }
    // Activer le professeur
    const updatedProfesseur = await prisma.professeur.update({
      where: { id },

      data: { status: "Actif" },
    });
    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_ACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" activé`,
      status: "SUCCESS",
    });
    const response: ApiResponse = {
      success: true,
      message: "Professeur activé avec succès",
      data: { professeur: updatedProfesseur },
    };
    res.json(response);
  } catch (error: any) {
    console.error("❌ ProfesseurController - activateProfesseur error:", error);
    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_ACTIVATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de l'activation du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
};

/**
 * @desc Désactive un professeur
 */
export const deactivateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  try {
    const { id } = req.params;
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
      where: { id },
    });
    if (!professeur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }
    // Désactiver le professeur
    const updatedProfesseur = await prisma.professeur.update({
      where: { id },
      data: { status: "Inactif" },
    });
    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DEACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" désactivé`,
      status: "SUCCESS",
    });
    const response: ApiResponse = {
      success: true,
      message: "Professeur désactivé avec succès",
      data: { professeur: updatedProfesseur },
    };
    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ProfesseurController - deactivateProfesseur error:",
      error
    );
    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DEACTIVATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la désactivation du professeur",
      status: "ERROR",
      errorMessage: error.message,
    });
    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
};
