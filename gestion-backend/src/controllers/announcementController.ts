import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "./auth/authTypes";
// import { AuthRequest } from "../auth/authTypes";

const prisma = new PrismaClient();

// Fonctions utilitaires
const getUserAudience = (userRole: string | undefined): string => {
  if (!userRole) return "General";

  switch (userRole) {
    case "Admin":
    case "Directeur":
      return "All";
    case "Professeur":
      return "Teachers";
    case "Student":
      return "Students";
    case "Parent":
      return "Parents";
    case "Secretaire":
      return "Staff";
    default:
      return "General";
  }
};

const canViewAnnouncement = (
  announcement: any,
  userRole: string | undefined
): boolean => {
  if (!userRole) return false;

  // Les administrateurs et directeurs peuvent tout voir
  if (["Admin", "Directeur"].includes(userRole)) {
    return true;
  }

  // Vérifier si l'annonce est active et non expirée
  if (!announcement.isActive) {
    return false;
  }

  if (
    announcement.expiryDate &&
    new Date(announcement.expiryDate) < new Date()
  ) {
    return false;
  }

  // Vérifier l'audience
  const userAudience = getUserAudience(userRole);
  return (
    announcement.targetAudience === "All" ||
    announcement.targetAudience === userAudience
  );
};

const canEditAnnouncement = (
  announcement: any,
  userId: string | undefined,
  userRole: string | undefined
): boolean => {
  if (!userId || !userRole) return false;

  // Les administrateurs et directeurs peuvent tout modifier
  if (["Admin", "Directeur"].includes(userRole)) {
    return true;
  }

  // Les secrétaires et professeurs peuvent modifier leurs propres annonces
  if (
    ["Secretaire", "Professeur"].includes(userRole) &&
    announcement.authorId === userId
  ) {
    return true;
  }

  return false;
};

export const announcementController = {
  createAnnouncement: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      // Validation des données d'entrée
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array(),
        });
        return;
      }

      const {
        title,
        content,
        publishDate,
        expiryDate,
        targetAudience = "All",
        priority = "Medium",
        attachments = [],
      } = req.body;

      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Vérification que l'utilisateur est authentifié
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
        return;
      }

      // Vérification des permissions
      const allowedRoles = ["Admin", "Directeur", "Secretaire", "Professeur"];

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs, directeurs, secrétaires et professeurs peuvent créer des annonces.",
        });
        return;
      }

      // Validation des dates
      const publishDateObj = new Date(publishDate);
      const expiryDateObj = expiryDate ? new Date(expiryDate) : null;

      if (expiryDateObj && expiryDateObj < publishDateObj) {
        res.status(400).json({
          success: false,
          message:
            "La date d'expiration doit être postérieure à la date de publication",
        });
        return;
      }

      // Création de l'annonce
      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          authorId: userId,
          publishDate: publishDateObj,
          expiryDate: expiryDateObj,
          targetAudience,
          priority,
          isActive: true,
          attachments: attachments || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Announcement",
          entityId: announcement.id,
          description: `Annonce "${title}" créée par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          metadata: {
            announcementId: announcement.id,
            title: announcement.title,
            targetAudience: announcement.targetAudience,
            priority: announcement.priority,
          },
        },
      });

      // Réponse de succès
      res.status(201).json({
        success: true,
        message: "Annonce créée avec succès",
        data: announcement,
      });
    } catch (error: any) {
      console.error("❌ Erreur création annonce:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "CREATE",
            entity: "Announcement",
            description: `Échec création annonce: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
          },
        });
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getAnnouncements: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        targetAudience,
        priority,
        isActive,
        startDate,
        endDate,
        page = "1",
        limit = "10",
        sortBy = "publishDate",
        sortOrder = "desc",
        search,
        authorId,
      } = req.query;

      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Construction des conditions de filtrage
      const where: any = {};

      // Filtre par public cible (pour les utilisateurs non-admin)
      if (userRole && !["Admin", "Directeur"].includes(userRole)) {
        const userAudience = getUserAudience(userRole);
        where.targetAudience = {
          in: ["All", userAudience],
        };
        where.isActive = true;

        // Exclure les annonces expirées pour les non-admins
        where.OR = [{ expiryDate: null }, { expiryDate: { gt: new Date() } }];
      } else {
        // Pour les admins, appliquer les filtres normaux
        if (targetAudience && targetAudience !== "all") {
          where.targetAudience = targetAudience;
        }

        if (isActive !== undefined && isActive !== "all") {
          where.isActive = isActive === "true";
        }
      }

      // Filtre par priorité
      if (priority && priority !== "all") {
        where.priority = priority;
      }

      // Filtre par auteur
      if (authorId) {
        where.authorId = authorId;
      }

      // Filtre par plage de dates de publication
      if (startDate || endDate) {
        where.publishDate = {};
        if (startDate) {
          where.publishDate.gte = new Date(startDate as string);
        }
        if (endDate) {
          where.publishDate.lte = new Date(endDate as string);
        }
      }

      // Filtre de recherche
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { content: { contains: search as string, mode: "insensitive" } },
        ];
      }

      // Configuration de la pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Définition du tri
      const orderBy: any = {};
      const validSortFields = ["title", "publishDate", "createdAt", "priority"];
      const sortField = validSortFields.includes(sortBy as string)
        ? sortBy
        : "publishDate";
      orderBy[sortField as string] = sortOrder === "asc" ? "asc" : "desc";

      // Récupération des données avec pagination
      const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.announcement.count({ where }),
      ]);

      // Calcul des métadonnées de pagination
      const totalPages = Math.ceil(total / limitNum);

      // Réponse avec pagination
      res.json({
        success: true,
        message: "Annonces récupérées avec succès",
        data: announcements,
        meta: {
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
          },
          filters: {
            targetAudience: targetAudience || "all",
            priority: priority || "all",
            isActive: isActive || "all",
            startDate,
            endDate,
            search,
          },
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération annonces:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des annonces",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getActiveAnnouncements: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { limit = "5" } = req.query;
      const userRole = req.user?.role;

      // Déterminer l'audience de l'utilisateur
      const userAudience = getUserAudience(userRole);

      // Conditions de filtrage pour les annonces actives
      const where: any = {
        isActive: true,
        targetAudience: {
          in: ["All", userAudience],
        },
        publishDate: { lte: new Date() }, // Publiées
        OR: [
          { expiryDate: null }, // Sans expiration
          { expiryDate: { gt: new Date() } }, // Non expirées
        ],
      };

      // Récupération des annonces actives
      const announcements = await prisma.announcement.findMany({
        where,
        orderBy: [
          { priority: "desc" }, // Priorité d'abord
          { publishDate: "desc" }, // Plus récentes ensuite
        ],
        take: parseInt(limit as string),
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: "Annonces actives récupérées avec succès",
        data: announcements,
        meta: {
          count: announcements.length,
          limit: parseInt(limit as string),
          userAudience,
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération annonces actives:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des annonces actives",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getAnnouncementById: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userRole = req.user?.role;

      // Récupération de l'annonce
      const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Vérification si l'annonce existe
      if (!announcement) {
        res.status(404).json({
          success: false,
          message: "Annonce non trouvée",
        });
        return;
      }

      // Vérification des permissions d'accès
      if (!canViewAnnouncement(announcement, userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Accès refusé. Vous n'avez pas les permissions nécessaires pour voir cette annonce.",
        });
        return;
      }

      res.json({
        success: true,
        message: "Annonce récupérée avec succès",
        data: announcement,
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération annonce:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'annonce",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateAnnouncement: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Vérification que l'utilisateur est authentifié
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
        return;
      }

      // Vérification de l'existence de l'annonce
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        res.status(404).json({
          success: false,
          message: "Annonce non trouvée",
        });
        return;
      }

      // Vérification des permissions de modification
      if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Vous ne pouvez pas modifier cette annonce.",
        });
        return;
      }

      // Validation des dates si présentes
      if (updates.publishDate || updates.expiryDate) {
        const publishDate = updates.publishDate
          ? new Date(updates.publishDate)
          : existingAnnouncement.publishDate;
        const expiryDate = updates.expiryDate
          ? new Date(updates.expiryDate)
          : existingAnnouncement.expiryDate;

        if (expiryDate && expiryDate < publishDate) {
          res.status(400).json({
            success: false,
            message:
              "La date d'expiration doit être postérieure à la date de publication",
          });
          return;
        }
      }

      // Mise à jour de l'annonce
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          ...updates,
          // Conversion des dates si présentes
          ...(updates.publishDate && {
            publishDate: new Date(updates.publishDate),
          }),
          ...(updates.expiryDate && {
            expiryDate: new Date(updates.expiryDate),
          }),
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Announcement",
          entityId: id,
          description: `Annonce "${existingAnnouncement.title}" modifiée par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          oldData: existingAnnouncement,
          newData: updatedAnnouncement,
          metadata: {
            changes: Object.keys(updates),
          },
        },
      });

      res.json({
        success: true,
        message: "Annonce mise à jour avec succès",
        data: updatedAnnouncement,
      });
    } catch (error: any) {
      console.error("❌ Erreur mise à jour annonce:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "UPDATE",
            entity: "Announcement",
            entityId: req.params.id,
            description: `Échec mise à jour annonce: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
          },
        });
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de l'annonce",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deleteAnnouncement: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Vérification que l'utilisateur est authentifié
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
        return;
      }

      // Vérification des permissions
      const allowedRoles = ["Admin", "Directeur"];
      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs et directeurs peuvent supprimer des annonces.",
        });
        return;
      }

      // Vérification de l'existence de l'annonce
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        res.status(404).json({
          success: false,
          message: "Annonce non trouvée",
        });
        return;
      }

      // Suppression de l'annonce
      await prisma.announcement.delete({
        where: { id },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "DELETE",
          entity: "Announcement",
          entityId: id,
          description: `Annonce "${existingAnnouncement.title}" supprimée par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          oldData: existingAnnouncement,
          metadata: {
            title: existingAnnouncement.title,
            targetAudience: existingAnnouncement.targetAudience,
          },
        },
      });

      res.json({
        success: true,
        message: "Annonce supprimée avec succès",
      });
    } catch (error: any) {
      console.error("❌ Erreur suppression annonce:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "DELETE",
            entity: "Announcement",
            entityId: req.params.id,
            description: `Échec suppression annonce: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
          },
        });
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'annonce",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deactivateAnnouncement: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Vérification que l'utilisateur est authentifié
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
        return;
      }

      // Vérification de l'existence de l'annonce
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        res.status(404).json({
          success: false,
          message: "Annonce non trouvée",
        });
        return;
      }

      // Vérification des permissions
      if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Vous ne pouvez pas désactiver cette annonce.",
        });
        return;
      }

      // Désactivation de l'annonce
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "DEACTIVATE",
          entity: "Announcement",
          entityId: id,
          description: `Annonce "${existingAnnouncement.title}" désactivée par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          metadata: {
            previousStatus: existingAnnouncement.isActive,
            newStatus: false,
          },
        },
      });

      res.json({
        success: true,
        message: "Annonce désactivée avec succès",
        data: updatedAnnouncement,
      });
    } catch (error: any) {
      console.error("❌ Erreur désactivation annonce:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "DEACTIVATE",
            entity: "Announcement",
            entityId: req.params.id,
            description: `Échec désactivation annonce: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
          },
        });
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(500).json({
        success: false,
        message: "Erreur lors de la désactivation de l'annonce",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  activateAnnouncement: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Vérification que l'utilisateur est authentifié
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
        return;
      }

      // Vérification de l'existence de l'annonce
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        res.status(404).json({
          success: false,
          message: "Annonce non trouvée",
        });
        return;
      }

      // Vérification des permissions
      if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Vous ne pouvez pas activer cette annonce.",
        });
        return;
      }

      // Activation de l'annonce
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          isActive: true,
          updatedAt: new Date(),
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "ACTIVATE",
          entity: "Announcement",
          entityId: id,
          description: `Annonce "${existingAnnouncement.title}" activée par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          metadata: {
            previousStatus: existingAnnouncement.isActive,
            newStatus: true,
          },
        },
      });

      res.json({
        success: true,
        message: "Annonce activée avec succès",
        data: updatedAnnouncement,
      });
    } catch (error: any) {
      console.error("❌ Erreur activation annonce:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "ACTIVATE",
            entity: "Announcement",
            entityId: req.params.id,
            description: `Échec activation annonce: ${error.message}`,
            userId: req.user?.id,
            status: "ERROR",
            errorMessage: error.message,
          },
        });
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(500).json({
        success: false,
        message: "Erreur lors de l'activation de l'annonce",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getAnnouncementStats: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userRole = req.user?.role;

      // Vérification des permissions
      if (!userRole || !["Admin", "Directeur"].includes(userRole)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs et directeurs peuvent voir les statistiques.",
        });
        return;
      }

      // Récupération des statistiques en parallèle
      const [
        totalAnnouncements,
        activeAnnouncements,
        expiredAnnouncements,
        announcementsByAudience,
        announcementsByPriority,
        announcementsByAuthor,
        recentAnnouncements,
      ] = await Promise.all([
        // Total des annonces
        prisma.announcement.count(),

        // Annonces actives
        prisma.announcement.count({
          where: { isActive: true },
        }),

        // Annonces expirées
        prisma.announcement.count({
          where: {
            expiryDate: { lt: new Date() },
            isActive: true,
          },
        }),

        // Annonces par public cible
        prisma.announcement.groupBy({
          by: ["targetAudience"],
          _count: true,
        }),

        // Annonces par priorité
        prisma.announcement.groupBy({
          by: ["priority"],
          _count: true,
        }),

        // Annonces par auteur
        prisma.announcement.groupBy({
          by: ["authorId"],
          _count: true,
          orderBy: {
            _count: {
              authorId: "desc",
            },
          },
          take: 10,
        }),

        // Annonces récentes (7 derniers jours)
        prisma.announcement.count({
          where: {
            publishDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      // Transformation des données
      const statsByAudience = announcementsByAudience.reduce(
        (
          acc: { [x: string]: any },
          item: { targetAudience: string | number; _count: any }
        ) => {
          acc[item.targetAudience] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      const statsByPriority = announcementsByPriority.reduce(
        (
          acc: { [x: string]: any },
          item: { priority: string | number; _count: any }
        ) => {
          acc[item.priority] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      res.json({
        success: true,
        message: "Statistiques des annonces récupérées avec succès",
        data: {
          summary: {
            total: totalAnnouncements,
            active: activeAnnouncements,
            inactive: totalAnnouncements - activeAnnouncements,
            expired: expiredAnnouncements,
            recent: recentAnnouncements,
          },
          byAudience: statsByAudience,
          byPriority: statsByPriority,
          topAuthors: announcementsByAuthor,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération statistiques annonces:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
