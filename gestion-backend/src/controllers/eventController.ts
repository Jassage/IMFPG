import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "./auth/authTypes";

const prisma = new PrismaClient();

// Fonction utilitaire pour convertir string en UserRole
const toUserRole = (role: string | undefined): string => {
  if (!role) throw new Error("Rôle non défini");

  // Liste des rôles valides (doit correspondre à votre enum Prisma)
  const validRoles = [
    "Admin",
    "Directeur",
    "Secretaire",
    "Professeur",
    "Parent",
    "Student",
  ];

  if (!validRoles.includes(role)) {
    throw new Error(`Rôle invalide: ${role}`);
  }

  return role;
};

// Fonction pour vérifier les permissions
const hasRole = (
  userRole: string | undefined,
  allowedRoles: string[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const eventController = {
  createEvent: async (req: AuthRequest, res: Response): Promise<void> => {
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
        description,
        startDate,
        endDate,
        location,
        organizer,
        category = "General",
        isPublic = true,
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
      const allowedRoles = ["Admin", "Directeur", "Secretaire"];

      if (!hasRole(userRole, allowedRoles)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs, directeurs et secrétaires peuvent créer des événements.",
        });
        return;
      }

      // Création de l'événement
      const event = await prisma.event.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location,
          organizer: organizer || userId,
          category,
          isPublic,
          status: "Scheduled",
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Event",
          entityId: event.id,
          description: `Événement "${title}" créé par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          metadata: {
            eventId: event.id,
            title: event.title,
            category: event.category,
          },
        },
      });

      // Réponse de succès
      res.status(201).json({
        success: true,
        message: "Événement créé avec succès",
        data: event,
      });
    } catch (error: any) {
      console.error("❌ Erreur création événement:", error);

      // Journalisation de l'erreur (sans bloquer la réponse)
      try {
        await prisma.auditLog.create({
          data: {
            action: "CREATE",
            entity: "Event",
            description: `Échec création événement: ${error.message}`,
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

  getEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        status,
        category,
        isPublic,
        startDate,
        endDate,
        page = "1",
        limit = "10",
        sortBy = "startDate",
        sortOrder = "asc",
        search,
      } = req.query;

      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Construction des conditions de filtrage
      const where: any = {};

      // Filtre par statut
      if (status && status !== "all") {
        where.status = status;
      }

      // Filtre par catégorie
      if (category && category !== "all") {
        where.category = category;
      }

      // Filtre par visibilité (pour les utilisateurs non-admin)
      if (userRole && !["Admin", "Directeur"].includes(userRole)) {
        where.isPublic = true;
        where.status = "Scheduled"; // Seulement les événements planifiés pour les non-admins
      } else if (isPublic !== undefined && isPublic !== "all") {
        where.isPublic = isPublic === "true";
      }

      // Filtre par plage de dates
      if (startDate || endDate) {
        where.AND = [];
        if (startDate) {
          where.AND.push({ startDate: { gte: new Date(startDate as string) } });
        }
        if (endDate) {
          where.AND.push({ endDate: { lte: new Date(endDate as string) } });
        }
      }

      // Filtre de recherche
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ];
      }

      // Configuration de la pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Définition du tri
      const orderBy: any = {};
      const validSortFields = [
        "title",
        "startDate",
        "endDate",
        "createdAt",
        "category",
      ];
      const sortField = validSortFields.includes(sortBy as string)
        ? sortBy
        : "startDate";
      orderBy[sortField as string] = sortOrder === "desc" ? "desc" : "asc";

      // Récupération des données avec pagination
      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            organizer: true,
            category: true,
            isPublic: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.event.count({ where }),
      ]);

      // Calcul des métadonnées de pagination
      const totalPages = Math.ceil(total / limitNum);

      // Réponse avec pagination
      res.json({
        success: true,
        message: "Événements récupérés avec succès",
        data: events,
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
            status: status || "all",
            category: category || "all",
            isPublic: isPublic || "all",
            startDate,
            endDate,
            search,
          },
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération événements:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des événements",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getUpcomingEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = "5" } = req.query;
      const userRole = req.user?.role;

      // Conditions de filtrage pour les événements à venir
      const where: any = {
        startDate: { gte: new Date() }, // Événements futurs
        status: "Scheduled", // Seulement les événements planifiés
      };

      // Pour les non-admins, seulement les événements publics
      if (userRole && !["Admin", "Directeur"].includes(userRole)) {
        where.isPublic = true;
      }

      // Récupération des événements à venir
      const events = await prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        take: parseInt(limit as string),
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          location: true,
          organizer: true,
          category: true,
          isPublic: true,
          status: true,
        },
      });

      res.json({
        success: true,
        message: "Événements à venir récupérés avec succès",
        data: events,
        meta: {
          count: events.length,
          limit: parseInt(limit as string),
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération événements à venir:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des événements à venir",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getEventById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userRole = req.user?.role;

      // Récupération de l'événement
      const event = await prisma.event.findUnique({
        where: { id },
      });

      // Vérification si l'événement existe
      if (!event) {
        res.status(404).json({
          success: false,
          message: "Événement non trouvé",
        });
        return;
      }

      // Vérification des permissions pour les événements privés
      if (
        !event.isPublic &&
        userRole &&
        !["Admin", "Directeur"].includes(userRole)
      ) {
        res.status(403).json({
          success: false,
          message: "Accès refusé. Cet événement est privé.",
        });
        return;
      }

      res.json({
        success: true,
        message: "Événement récupéré avec succès",
        data: event,
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération événement:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateEvent: async (req: AuthRequest, res: Response): Promise<void> => {
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

      // Vérification des permissions
      const allowedRoles = ["Admin", "Directeur", "Secretaire"];
      if (!hasRole(userRole, allowedRoles)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs, directeurs et secrétaires peuvent modifier des événements.",
        });
        return;
      }

      // Vérification de l'existence de l'événement
      const existingEvent = await prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        res.status(404).json({
          success: false,
          message: "Événement non trouvé",
        });
        return;
      }

      // Mise à jour de l'événement
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          ...updates,
          // Conversion des dates si présentes
          ...(updates.startDate && { startDate: new Date(updates.startDate) }),
          ...(updates.endDate && { endDate: new Date(updates.endDate) }),
          updatedAt: new Date(),
        },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Event",
          entityId: id,
          description: `Événement "${existingEvent.title}" modifié par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          oldData: existingEvent,
          newData: updatedEvent,
          metadata: {
            changes: Object.keys(updates),
          },
        },
      });

      res.json({
        success: true,
        message: "Événement mis à jour avec succès",
        data: updatedEvent,
      });
    } catch (error: any) {
      console.error("❌ Erreur mise à jour événement:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "UPDATE",
            entity: "Event",
            entityId: req.params.id,
            description: `Échec mise à jour événement: ${error.message}`,
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
        message: "Erreur lors de la mise à jour de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deleteEvent: async (req: AuthRequest, res: Response): Promise<void> => {
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
      if (!hasRole(userRole, allowedRoles)) {
        res.status(403).json({
          success: false,
          message:
            "Permission refusée. Seuls les administrateurs et directeurs peuvent supprimer des événements.",
        });
        return;
      }

      // Vérification de l'existence de l'événement
      const existingEvent = await prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        res.status(404).json({
          success: false,
          message: "Événement non trouvé",
        });
        return;
      }

      // Suppression de l'événement
      await prisma.event.delete({
        where: { id },
      });

      // Journalisation dans l'audit log
      await prisma.auditLog.create({
        data: {
          action: "DELETE",
          entity: "Event",
          entityId: id,
          description: `Événement "${existingEvent.title}" supprimé par ${req.user?.email}`,
          userId: userId,
          status: "SUCCESS",
          oldData: existingEvent,
          metadata: {
            title: existingEvent.title,
            category: existingEvent.category,
          },
        },
      });

      res.json({
        success: true,
        message: "Événement supprimé avec succès",
      });
    } catch (error: any) {
      console.error("❌ Erreur suppression événement:", error);

      // Journalisation de l'erreur
      try {
        await prisma.auditLog.create({
          data: {
            action: "DELETE",
            entity: "Event",
            entityId: req.params.id,
            description: `Échec suppression événement: ${error.message}`,
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
        message: "Erreur lors de la suppression de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getEventStats: async (req: AuthRequest, res: Response): Promise<void> => {
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
        totalEvents,
        upcomingEvents,
        pastEvents,
        publicEvents,
        privateEvents,
        eventsByStatus,
        eventsByCategory,
      ] = await Promise.all([
        // Total des événements
        prisma.event.count(),

        // Événements à venir
        prisma.event.count({
          where: { startDate: { gte: new Date() } },
        }),

        // Événements passés
        prisma.event.count({
          where: { endDate: { lt: new Date() } },
        }),

        // Événements publics
        prisma.event.count({
          where: { isPublic: true },
        }),

        // Événements privés
        prisma.event.count({
          where: { isPublic: false },
        }),

        // Événements par statut
        prisma.event.groupBy({
          by: ["status"],
          _count: true,
        }),

        // Événements par catégorie
        prisma.event.groupBy({
          by: ["category"],
          _count: true,
          orderBy: {
            _count: {
              category: "desc",
            },
          },
          take: 10,
        }),
      ]);

      // Transformation des données
      const statsByStatus = eventsByStatus.reduce(
        (
          acc: { [x: string]: any },
          item: { status: string | number; _count: any }
        ) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      const statsByCategory = eventsByCategory.reduce(
        (
          acc: { [x: string]: any },
          item: { category: string | number; _count: any }
        ) => {
          acc[item.category] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      res.json({
        success: true,
        message: "Statistiques des événements récupérées avec succès",
        data: {
          summary: {
            total: totalEvents,
            upcoming: upcomingEvents,
            past: pastEvents,
            public: publicEvents,
            private: privateEvents,
          },
          byStatus: statsByStatus,
          byCategory: statsByCategory,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération statistiques:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  /**
   * Récupérer les événements par catégorie
   * @async
   * @function getEventsByCategory
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @returns {Promise<void>}
   * @description Récupère les événements filtrés par catégorie
   * @param {string} category - Catégorie des événements
   * @query {number} [page=1] - Numéro de page
   * @query {number} [limit=10] - Nombre d'éléments par page
   */
  getEventsByCategory: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { category } = req.params;
      const { page = "1", limit = "10" } = req.query;
      const userRole = req.user?.role;

      // Conditions de filtrage
      const where: any = { category };

      // Pour les non-admins, seulement les événements publics et planifiés
      if (userRole && !["Admin", "Directeur"].includes(userRole)) {
        where.isPublic = true;
        where.status = "Scheduled";
      }

      // Configuration de la pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Récupération des données
      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          orderBy: { startDate: "asc" },
          skip,
          take: limitNum,
        }),
        prisma.event.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        message: `Événements de la catégorie "${category}" récupérés avec succès`,
        data: events,
        meta: {
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
          },
          category,
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur récupération événements par catégorie:", error);

      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des événements par catégorie",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
