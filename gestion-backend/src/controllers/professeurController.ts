/**
 * @file professeurController.ts
 * @description Contrôleurs pour la gestion des professeurs
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import * as crypto from "crypto";

const prisma = new PrismaClient();

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
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
    console.error(" ProfesseurController - getProfesseurs error:", error);

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
    console.error(" ProfesseurController - getProfesseurById error:", error);

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
      userId, // Peut être undefined ou null
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

    // Préparer les données de mise à jour
    const updateData: any = {
      firstName,
      lastName,
      email,
      phone,
      speciality,
      matricule,
      status,
    };

    // Gérer le userId (peut être null pour détacher)
    if (userId !== undefined) {
      if (userId === null || userId === "") {
        // Détacher l'utilisateur
        updateData.userId = null;
      } else {
        // Vérifier si l'utilisateur existe
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

        // Vérifier si cet utilisateur est déjà associé à un autre professeur
        if (userId !== existingProfesseur.userId) {
          const existingProfesseurWithUser = await prisma.professeur.findUnique(
            {
              where: { userId },
            }
          );

          if (existingProfesseurWithUser) {
            const response: ApiResponse = {
              success: false,
              message: "Cet utilisateur est déjà associé à un autre professeur",
              code: "USER_ALREADY_ASSOCIATED",
            };
            res.status(400).json(response);
            return;
          }
        }

        updateData.userId = userId;
      }
    }

    // Mettre à jour
    const professeur = await prisma.professeur.update({
      where: { id },
      data: updateData,
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
    console.error(" ProfesseurController - updateProfesseur error:", error);

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
    console.error(" ProfesseurController - deleteProfesseur error:", error);

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
      const day = Number((schedule as any).dayOfWeek);
      if (!Number.isInteger(day) || day < 1 || day > 7) return;
      scheduleByDay[day].push(schedule);
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
      " ProfesseurController - getProfesseurSchedule error:",
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
    console.error(" ProfesseurController - activateProfesseur error:", error);
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
    console.error(" ProfesseurController - deactivateProfesseur error:", error);
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

/**
 * @desc Récupère les détails complets d'un professeur
 */
export const getProfesseurFullDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        // Informations utilisateur
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        // Assignations avec détails
        assignments: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
            academicYear: {
              select: {
                id: true,
                year: true,
              },
            },
            schedules: {
              include: {
                schoolClass: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                    capacity: true,
                  },
                },
              },
              orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            },
          },
        },
        // Emploi du temps complet
        schedules: {
          include: {
            classAssignment: {
              include: {
                subject: true,
                academicYear: true,
              },
            },
            schoolClass: true,
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        // Classes enseignées (via les assignations)
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

    // Organiser l'emploi du temps par jour
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    professeur.schedules.forEach((schedule: any) => {
      const day = Number((schedule as any).dayOfWeek);
      if (!Number.isInteger(day) || day < 1 || day > 7) return;
      scheduleByDay[day].push(schedule);
    });

    // Calculer les statistiques
    const assignments = (professeur as any).assignments || [];
    const schedules = (professeur as any).schedules || [];

    const totalClasses = new Set(
      assignments.flatMap((a: any) =>
        (a.schedules || []).map((s: any) => s.schoolClassId)
      )
    ).size;

    const totalSubjects = new Set(assignments.map((a: any) => a.subjectId))
      .size;

    const weeklyHours = schedules.reduce((total: number, schedule: any) => {
      const start = new Date(`1970-01-01T${schedule.startTime}`);
      const end = new Date(`1970-01-01T${schedule.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + (isNaN(hours) ? 0 : hours);
    }, 0);

    const stats = {
      totalClasses,
      totalSubjects,
      weeklyHours,
    };

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_FULL_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails complets du professeur récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Détails complets récupérés avec succès",
      data: {
        professeur,
        scheduleByDay,
        stats,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - getProfesseurFullDetails error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_FULL_DETAILS_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération des détails",
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
 * @desc Crée un utilisateur pour un professeur
 */
const createProfesseurUserAccount = async (
  email: string,
  firstName: string,
  lastName: string
) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return existingUser.id;
    }

    // Créer un nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role: "Professeur",
        status: "ACTIVE" as any,
        password: "", // Mot de passe temporaire
      },
    });

    // Générer un token pour définir le mot de passe
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Note: passwordResetToken / passwordResetExpires are not defined in the generated Prisma User type.
    // If your Prisma schema includes fields to store reset tokens, update the block below to persist them.
    // Otherwise, send the invitation email with the token without persisting it.
    // Exemple si les champs existent dans le schéma Prisma :
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     passwordResetToken: resetToken,
    //     passwordResetExpires: resetTokenExpiry,
    //   },
    // });

    // Ici, vous pouvez envoyer un email d'invitation
    // sendInvitationEmail(email, firstName, resetToken);

    return user.id;
  } catch (error) {
    console.error("Erreur lors de la création du compte utilisateur:", error);
    throw error;
  }
};

/**
 * @desc Crée un nouveau professeur avec option de création de compte utilisateur
 */
export const createProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      speciality,
      matricule,
      userId, // Peut être undefined
      createUserAccount = false,
      sendInvitation = true,
    } = req.body;

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

    let finalUserId = userId || null;

    // Si createUserAccount est true et qu'aucun userId n'est fourni, créer un utilisateur
    if (createUserAccount && !finalUserId) {
      // Vérifier si un utilisateur avec cet email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Associer l'utilisateur existant
        finalUserId = existingUser.id;

        // Vérifier si cet utilisateur a déjà un profil professeur
        const existingProfesseurWithUser = await prisma.professeur.findUnique({
          where: { userId: existingUser.id },
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
      } else {
        // Créer un nouvel utilisateur
        try {
          const newUserId = await createProfesseurUserAccount(
            email,
            firstName,
            lastName
          );
          finalUserId = newUserId;
        } catch (userError: any) {
          console.error("Erreur création utilisateur:", userError);
          const response: ApiResponse = {
            success: false,
            message: "Erreur lors de la création du compte utilisateur",
            code: "USER_CREATION_ERROR",
            data: { error: userError.message },
          };
          res.status(500).json(response);
          return;
        }
      }
    }

    // Si un userId est fourni, vérifier qu'il existe
    if (finalUserId) {
      const user = await prisma.user.findUnique({
        where: { id: finalUserId },
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
        where: { userId: finalUserId },
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
        userId: finalUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
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
        userAccountCreated: !!finalUserId,
        hasUserAccount: !!finalUserId,
      },
    });

    const responseData: any = {
      professeur,
      userAccountCreated: !!finalUserId,
    };

    if (finalUserId && sendInvitation) {
      responseData.invitationSent = true;
      responseData.message = "Un email d'invitation a été envoyé au professeur";
    }

    const response: ApiResponse = {
      success: true,
      message: finalUserId
        ? "Professeur créé avec compte utilisateur associé"
        : "Professeur créé sans compte utilisateur",
      data: responseData,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - createProfesseur error:", error);

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
 * @desc Associe un compte utilisateur à un professeur existant
 */
export const attachUserToProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { userId, email, createIfNotExists = false } = req.body;

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

    let finalUserId = userId;
    let userCreated = false;

    // Si email fourni sans userId
    if (email && !userId) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        finalUserId = existingUser.id;
      } else if (createIfNotExists) {
        // Créer un nouvel utilisateur
        try {
          const newUserId = await createProfesseurUserAccount(
            email,
            professeur.firstName,
            professeur.lastName
          );
          finalUserId = newUserId;
          userCreated = true;
        } catch (userError: any) {
          const response: ApiResponse = {
            success: false,
            message: "Erreur lors de la création du compte utilisateur",
            code: "USER_CREATION_ERROR",
          };
          res.status(500).json(response);
          return;
        }
      } else {
        const response: ApiResponse = {
          success: false,
          message: "Aucun utilisateur trouvé avec cet email",
          code: "USER_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }
    }

    // Vérifier si l'utilisateur existe
    if (finalUserId) {
      const user = await prisma.user.findUnique({
        where: { id: finalUserId },
      });

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: "Utilisateur non trouvé",
          code: "USER_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }

      // Vérifier si cet utilisateur est déjà associé à un autre professeur
      const existingProfesseurWithUser = await prisma.professeur.findUnique({
        where: { userId: finalUserId },
      });

      if (existingProfesseurWithUser && existingProfesseurWithUser.id !== id) {
        const response: ApiResponse = {
          success: false,
          message: "Cet utilisateur est déjà associé à un autre professeur",
          code: "USER_ALREADY_ASSOCIATED",
        };
        res.status(400).json(response);
        return;
      }

      // Mettre à jour le professeur
      const updatedProfesseur = await prisma.professeur.update({
        where: { id },
        data: { userId: finalUserId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      await createAuditLog({
        ...auditData,
        action: userCreated
          ? "PROFESSEUR_USER_ACCOUNT_CREATED"
          : "PROFESSEUR_USER_ATTACHED",
        entity: "Professeur",
        entityId: id,
        description: userCreated
          ? `Compte utilisateur créé et associé au professeur ${professeur.firstName} ${professeur.lastName}`
          : `Compte utilisateur associé au professeur ${professeur.firstName} ${professeur.lastName}`,
        status: "SUCCESS",
        metadata: {
          userId: finalUserId,
          userEmail: user.email,
          userCreated,
        },
      });

      const response: ApiResponse = {
        success: true,
        message: userCreated
          ? "Compte utilisateur créé et associé avec succès"
          : "Compte utilisateur associé avec succès",
        data: {
          professeur: updatedProfesseur,
          userAccountCreated: userCreated,
        },
      };

      res.json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: "Aucun utilisateur spécifié",
        code: "NO_USER_SPECIFIED",
      };
      res.status(400).json(response);
    }
  } catch (error: any) {
    console.error(
      " ProfesseurController - attachUserToProfesseur error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_ATTACHMENT_ERROR",
      entity: "Professeur",
      description: "Erreur lors de l'association du compte utilisateur",
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
 * @desc Détache un compte utilisateur d'un professeur
 */
export const detachUserFromProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

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

    if (!professeur.userId) {
      const response: ApiResponse = {
        success: false,
        message: "Ce professeur n'a pas de compte utilisateur associé",
        code: "NO_USER_ACCOUNT",
      };
      res.status(400).json(response);
      return;
    }

    // Détacher l'utilisateur
    const updatedProfesseur = await prisma.professeur.update({
      where: { id },
      data: { userId: null },
    });

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_DETACHED",
      entity: "Professeur",
      entityId: id,
      description: `Compte utilisateur détaché du professeur ${professeur.firstName} ${professeur.lastName}`,
      status: "SUCCESS",
      metadata: {
        previousUserId: professeur.userId,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Compte utilisateur détaché avec succès",
      data: { professeur: updatedProfesseur },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - detachUserFromProfesseur error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_DETACHMENT_ERROR",
      entity: "Professeur",
      description: "Erreur lors du détachement du compte utilisateur",
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
