/**
 * @file auditController.ts
 * @description Contrôleur pour la gestion des logs d'audit
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { CreateAuditLogParams } from "../types/auth";
import { asyncErrorHandler } from "../middleware/asyncHandler";

const prisma = new PrismaClient();

/**
 * @function createAuditLog
 * @description Crée un log d'audit dans la base de données
 * @param {CreateAuditLogParams} data - Données du log d'audit
 * @returns {Promise<void>}
 */
export const createAuditLog = async (
  data: CreateAuditLogParams
): Promise<void> => {
  try {
    // Tronquer les champs texte trop longs pour la base de données
    const truncatedErrorMessage = data.errorMessage
      ? data.errorMessage.substring(0, 1000)
      : undefined;

    const truncatedDescription = data.description
      ? data.description.substring(0, 500)
      : data.description;

    const truncatedUserAgent = data.userAgent
      ? data.userAgent.substring(0, 500)
      : data.userAgent;

    await prisma.auditLog.create({
      data: {
        ipAddress: data.ipAddress,
        userAgent: truncatedUserAgent,
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        description: truncatedDescription,
        metadata: data.metadata,
        status: data.status,
        errorMessage: truncatedErrorMessage,
      },
    });
  } catch (error) {
    console.error("❌ Erreur création audit log:", error);

    // Fallback: logger dans la console si la DB échoue
    console.error("📋 Audit Log (Fallback):", {
      action: data.action,
      entity: data.entity,
      description: data.description,
      userId: data.userId,
      ipAddress: data.ipAddress,
      status: data.status,
      error: data.errorMessage,
    });
  }
};

/**
 * @controller getAuditLogs
 * @description Récupère les logs d'audit avec pagination et filtres
 * @route GET /api/audit-logs
 * @access Admin seulement
 */
export const getAuditLogs = asyncErrorHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "50",
        action,
        entity,
        userId,
        startDate,
        endDate,
        status,
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Construction du filtre
      const where: any = {};

      if (action)
        where.action = { contains: action as string, mode: "insensitive" };
      if (entity)
        where.entity = { contains: entity as string, mode: "insensitive" };
      if (userId) where.userId = userId as string;
      if (status) where.status = status as string;

      // Filtre par date
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      // Récupération des logs avec pagination
      const [auditLogs, totalCount] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limitNum,
        }),
        prisma.auditLog.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      res.json({
        success: true,
        data: auditLogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error("❌ Erreur récupération logs audit:", error);
      throw error;
    }
  }
);

/**
 * @controller getAuditLogById
 * @description Récupère un log d'audit spécifique par son ID
 * @route GET /api/audit-logs/:id
 * @access Admin seulement
 */
export const getAuditLogById = asyncErrorHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const auditLog = await prisma.auditLog.findUnique({
        where: { id },
        include: {
          user: {
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

      if (!auditLog) {
        return res.status(404).json({
          success: false,
          message: "Log d'audit non trouvé",
          code: "AUDIT_LOG_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        data: auditLog,
      });
    } catch (error) {
      console.error("❌ Erreur récupération log audit:", error);
      throw error;
    }
  }
);

/**
 * @controller getUserAuditLogs
 * @description Récupère les logs d'audit d'un utilisateur spécifique
 * @route GET /api/audit-logs/user/:userId
 * @access Admin seulement
 */
export const getUserAuditLogs = asyncErrorHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const {
        page = "1",
        limit = "50",
        action,
        entity,
        startDate,
        endDate,
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Construction du filtre
      const where: any = { userId };

      if (action)
        where.action = { contains: action as string, mode: "insensitive" };
      if (entity)
        where.entity = { contains: entity as string, mode: "insensitive" };

      // Filtre par date
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      // Récupération des logs avec pagination
      const [auditLogs, totalCount] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limitNum,
        }),
        prisma.auditLog.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      res.json({
        success: true,
        data: auditLogs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error("❌ Erreur récupération logs audit utilisateur:", error);
      throw error;
    }
  }
);

/**
 * @controller getAuditStats
 * @description Récupère des statistiques sur les logs d'audit
 * @route GET /api/audit-logs/stats
 * @access Admin seulement
 */
export const getAuditStats = asyncErrorHandler(
  async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      // Construction du filtre de date
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = new Date(startDate as string);
      if (endDate) dateFilter.lte = new Date(endDate as string);

      const where =
        Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

      // Récupération des statistiques
      const [
        totalLogs,
        successLogs,
        errorLogs,
        topActions,
        topEntities,
        recentActivity,
      ] = await Promise.all([
        // Total des logs
        prisma.auditLog.count({ where }),

        // Logs de succès
        prisma.auditLog.count({
          where: { ...where, status: "SUCCESS" },
        }),

        // Logs d'erreur
        prisma.auditLog.count({
          where: { ...where, status: "ERROR" },
        }),

        // Actions les plus fréquentes
        prisma.auditLog.groupBy({
          by: ["action"],
          where,
          _count: {
            action: true,
          },
          orderBy: {
            _count: {
              action: "desc",
            },
          },
          take: 10,
        }),

        // Entités les plus actives
        prisma.auditLog.groupBy({
          by: ["entity"],
          where,
          _count: {
            entity: true,
          },
          orderBy: {
            _count: {
              entity: "desc",
            },
          },
          take: 10,
        }),

        // Activité récente (7 derniers jours)
        prisma.auditLog.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
            },
          },
          _count: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          totalLogs,
          successLogs,
          errorLogs,
          successRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
          topActions,
          topEntities,
          recentActivity,
        },
      });
    } catch (error) {
      console.error("❌ Erreur récupération statistiques audit:", error);
      throw error;
    }
  }
);

// Export des contrôleurs
export default {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getUserAuditLogs,
  getAuditStats,
};
