/**
 * @file announcementService.ts
 * @description Service pour la gestion des annonces
 * @module Services/Announcements
 */

import prisma from "../prisma";

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
    case "Comptable":
      return "Comptable";
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

/**
 * @class AnnouncementService
 * @description Service pour la gestion des annonces
 */
export class AnnouncementService {
  /**
   * Crée une nouvelle annonce
   */
  static async createAnnouncement(data: {
    title: string;
    content: string;
    publishDate: string;
    expiryDate?: string;
    targetAudience?: string;
    priority?: string;
    attachments?: any[];
    userId: string;
    userRole: string;
    userEmail?: string;
  }) {
    const {
      title,
      content,
      publishDate,
      expiryDate,
      targetAudience = "All",
      priority = "Medium",
      attachments = [],
      userId,
      userRole,
      userEmail,
    } = data;

    // Vérification que l'utilisateur est authentifié
    if (!userId || !userRole) {
      throw {
        status: 401,
        message: "Authentification requise",
      };
    }

    // Vérification des permissions
    const allowedRoles = ["Admin", "Directeur", "Secretaire", "Professeur"];
    if (!allowedRoles.includes(userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Seuls les administrateurs, directeurs, secrétaires et professeurs peuvent créer des annonces.",
      };
    }

    // Validation des dates
    const publishDateObj = new Date(publishDate);
    const expiryDateObj = expiryDate ? new Date(expiryDate) : null;

    if (expiryDateObj && expiryDateObj < publishDateObj) {
      throw {
        status: 400,
        message:
          "La date d'expiration doit être postérieure à la date de publication",
      };
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
        description: `Annonce "${title}" créée par ${userEmail || userId}`,
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

    return {
      success: true,
      message: "Annonce créée avec succès",
      data: announcement,
      metadata: {
        announcementId: announcement.id,
        action: "CREATE",
        userEmail,
      },
    };
  }

  /**
   * Récupère les annonces avec filtres et pagination
   */
  static async getAnnouncements(filters: {
    targetAudience?: string;
    priority?: string;
    isActive?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    authorId?: string;
    userRole?: string;
  }) {
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
      userRole,
    } = filters;

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
        where.publishDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishDate.lte = new Date(endDate);
      }
    }

    // Filtre de recherche
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    // Configuration de la pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Définition du tri
    const orderBy: any = {};
    const validSortFields = ["title", "publishDate", "createdAt", "priority"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "publishDate";
    orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

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

    return {
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
    };
  }

  /**
   * Récupère les annonces actives
   */
  static async getActiveAnnouncements(filters: {
    limit?: string;
    userRole?: string;
  }) {
    const { limit = "5", userRole } = filters;

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
      take: parseInt(limit),
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

    return {
      success: true,
      message: "Annonces actives récupérées avec succès",
      data: announcements,
      meta: {
        count: announcements.length,
        limit: parseInt(limit),
        userAudience,
      },
    };
  }

  /**
   * Récupère une annonce par son ID
   */
  static async getAnnouncementById(id: string, userRole?: string) {
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
      throw {
        status: 404,
        message: "Annonce non trouvée",
      };
    }

    // Vérification des permissions d'accès
    if (!canViewAnnouncement(announcement, userRole)) {
      throw {
        status: 403,
        message:
          "Accès refusé. Vous n'avez pas les permissions nécessaires pour voir cette annonce.",
      };
    }

    return {
      success: true,
      message: "Annonce récupérée avec succès",
      data: announcement,
    };
  }

  /**
   * Met à jour une annonce
   */
  static async updateAnnouncement(
    id: string,
    updates: any,
    userData: {
      userId: string;
      userRole: string;
      userEmail?: string;
    }
  ) {
    const { userId, userRole, userEmail } = userData;

    // Vérification que l'utilisateur est authentifié
    if (!userId || !userRole) {
      throw {
        status: 401,
        message: "Authentification requise",
      };
    }

    // Vérification de l'existence de l'annonce
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw {
        status: 404,
        message: "Annonce non trouvée",
      };
    }

    // Vérification des permissions de modification
    if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Vous ne pouvez pas modifier cette annonce.",
      };
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
        throw {
          status: 400,
          message:
            "La date d'expiration doit être postérieure à la date de publication",
        };
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
        description: `Annonce "${existingAnnouncement.title}" modifiée par ${userEmail || userId}`,
        userId: userId,
        status: "SUCCESS",
        oldData: existingAnnouncement,
        newData: updatedAnnouncement,
        metadata: {
          changes: Object.keys(updates),
        },
      },
    });

    return {
      success: true,
      message: "Annonce mise à jour avec succès",
      data: updatedAnnouncement,
      metadata: {
        announcementId: id,
        action: "UPDATE",
        userEmail,
        changes: Object.keys(updates),
      },
    };
  }

  /**
   * Supprime une annonce
   */
  static async deleteAnnouncement(
    id: string,
    userData: {
      userId: string;
      userRole: string;
      userEmail?: string;
    }
  ) {
    const { userId, userRole, userEmail } = userData;

    // Vérification que l'utilisateur est authentifié
    if (!userId || !userRole) {
      throw {
        status: 401,
        message: "Authentification requise",
      };
    }

    // Vérification des permissions
    const allowedRoles = ["Admin", "Directeur"];
    if (!allowedRoles.includes(userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Seuls les administrateurs et directeurs peuvent supprimer des annonces.",
      };
    }

    // Vérification de l'existence de l'annonce
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw {
        status: 404,
        message: "Annonce non trouvée",
      };
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
        description: `Annonce "${existingAnnouncement.title}" supprimée par ${userEmail || userId}`,
        userId: userId,
        status: "SUCCESS",
        oldData: existingAnnouncement,
        metadata: {
          title: existingAnnouncement.title,
          targetAudience: existingAnnouncement.targetAudience,
        },
      },
    });

    return {
      success: true,
      message: "Annonce supprimée avec succès",
      metadata: {
        announcementId: id,
        title: existingAnnouncement.title,
        action: "DELETE",
        userEmail,
      },
    };
  }

  /**
   * Désactive une annonce
   */
  static async deactivateAnnouncement(
    id: string,
    userData: {
      userId: string;
      userRole: string;
      userEmail?: string;
    }
  ) {
    const { userId, userRole, userEmail } = userData;

    // Vérification que l'utilisateur est authentifié
    if (!userId || !userRole) {
      throw {
        status: 401,
        message: "Authentification requise",
      };
    }

    // Vérification de l'existence de l'annonce
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw {
        status: 404,
        message: "Annonce non trouvée",
      };
    }

    // Vérification des permissions
    if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Vous ne pouvez pas désactiver cette annonce.",
      };
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
        description: `Annonce "${existingAnnouncement.title}" désactivée par ${userEmail || userId}`,
        userId: userId,
        status: "SUCCESS",
        metadata: {
          previousStatus: existingAnnouncement.isActive,
          newStatus: false,
        },
      },
    });

    return {
      success: true,
      message: "Annonce désactivée avec succès",
      data: updatedAnnouncement,
      metadata: {
        announcementId: id,
        action: "DEACTIVATE",
        userEmail,
        previousStatus: existingAnnouncement.isActive,
        newStatus: false,
      },
    };
  }

  /**
   * Active une annonce
   */
  static async activateAnnouncement(
    id: string,
    userData: {
      userId: string;
      userRole: string;
      userEmail?: string;
    }
  ) {
    const { userId, userRole, userEmail } = userData;

    // Vérification que l'utilisateur est authentifié
    if (!userId || !userRole) {
      throw {
        status: 401,
        message: "Authentification requise",
      };
    }

    // Vérification de l'existence de l'annonce
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw {
        status: 404,
        message: "Annonce non trouvée",
      };
    }

    // Vérification des permissions
    if (!canEditAnnouncement(existingAnnouncement, userId, userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Vous ne pouvez pas activer cette annonce.",
      };
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
        description: `Annonce "${existingAnnouncement.title}" activée par ${userEmail || userId}`,
        userId: userId,
        status: "SUCCESS",
        metadata: {
          previousStatus: existingAnnouncement.isActive,
          newStatus: true,
        },
      },
    });

    return {
      success: true,
      message: "Annonce activée avec succès",
      data: updatedAnnouncement,
      metadata: {
        announcementId: id,
        action: "ACTIVATE",
        userEmail,
        previousStatus: existingAnnouncement.isActive,
        newStatus: true,
      },
    };
  }

  /**
   * Récupère les statistiques des annonces
   */
  static async getAnnouncementStats(userRole?: string) {
    // Vérification des permissions
    if (!userRole || !["Admin", "Directeur"].includes(userRole)) {
      throw {
        status: 403,
        message:
          "Permission refusée. Seuls les administrateurs et directeurs peuvent voir les statistiques.",
      };
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
      (acc: Record<string, number>, item) => {
        acc[item.targetAudience] = item._count;
        return acc;
      },
      {}
    );

    const statsByPriority = announcementsByPriority.reduce(
      (acc: Record<string, number>, item) => {
        acc[item.priority] = item._count;
        return acc;
      },
      {}
    );

    return {
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
    };
  }
}
