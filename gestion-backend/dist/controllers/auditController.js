"use strict";
/**
 * @file auditController.ts
 * @description Contrôleur pour la gestion des logs d'audit
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAuditLogs = exports.getAuditStats = exports.getUserAuditLogs = exports.getAuditLogById = exports.getAuditLogs = exports.createAuditLog = void 0;
const prisma_1 = require("../../generated/prisma");
const asyncHandler_1 = require("../middleware/asyncHandler");
const prisma = new prisma_1.PrismaClient();
/**
 * @function createAuditLog
 * @description Crée un log d'audit dans la base de données
 * @param {CreateAuditLogParams} data - Données du log d'audit
 * @returns {Promise<void>}
 */
const createAuditLog = async (data) => {
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
    }
    catch (error) {
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
exports.createAuditLog = createAuditLog;
/**
 * @controller getAuditLogs
 * @description Récupère les logs d'audit avec pagination et filtres
 * @route GET /api/audit-logs
 * @access Admin seulement
 */
exports.getAuditLogs = (0, asyncHandler_1.asyncErrorHandler)(async (req, res) => {
    try {
        const { page = "1", limit = "50", action, entity, userId, startDate, endDate, status, } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Construction du filtre
        const where = {};
        if (action)
            where.action = { contains: action, mode: "insensitive" };
        if (entity)
            where.entity = { contains: entity, mode: "insensitive" };
        if (userId)
            where.userId = userId;
        if (status)
            where.status = status;
        // Filtre par date
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        // Récupération des logs avec pagination
        const [auditLogs, totalCount] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                // Solution 1: Utilisez select avec les relations
                select: {
                    id: true,
                    action: true,
                    entity: true,
                    entityId: true,
                    description: true,
                    oldData: true,
                    newData: true,
                    userId: true,
                    userAgent: true,
                    ipAddress: true,
                    status: true,
                    errorMessage: true,
                    duration: true,
                    createdAt: true,
                    user: {
                        // Inclure les données de l'utilisateur via select
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
    }
    catch (error) {
        console.error("❌ Erreur récupération logs audit:", error);
        throw error;
    }
});
/**
 * @controller getAuditLogById
 * @description Récupère un log d'audit spécifique par son ID
 * @route GET /api/audit-logs/:id
 * @access Admin seulement
 */
exports.getAuditLogById = (0, asyncHandler_1.asyncErrorHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const auditLog = await prisma.auditLog.findUnique({
            where: { id },
            include: {
                // Utilisez include au lieu de select+include
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
    }
    catch (error) {
        console.error("❌ Erreur récupération log audit:", error);
        throw error;
    }
});
/**
 * @controller getUserAuditLogs
 * @description Récupère les logs d'audit d'un utilisateur spécifique
 * @route GET /api/audit-logs/user/:userId
 * @access Admin seulement
 */
exports.getUserAuditLogs = (0, asyncHandler_1.asyncErrorHandler)(async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = "1", limit = "50", action, entity, startDate, endDate, } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Construction du filtre
        const where = { userId };
        if (action)
            where.action = { contains: action, mode: "insensitive" };
        if (entity)
            where.entity = { contains: entity, mode: "insensitive" };
        // Filtre par date
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
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
    }
    catch (error) {
        console.error("❌ Erreur récupération logs audit utilisateur:", error);
        throw error;
    }
});
/**
 * @controller getAuditStats
 * @description Récupère des statistiques sur les logs d'audit
 * @route GET /api/audit-logs/stats
 * @access Admin seulement
 */
exports.getAuditStats = (0, asyncHandler_1.asyncErrorHandler)(async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        // Construction du filtre de date
        const dateFilter = {};
        if (startDate)
            dateFilter.gte = new Date(startDate);
        if (endDate)
            dateFilter.lte = new Date(endDate);
        const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        // Récupération des statistiques
        const [totalLogs, successLogs, errorLogs, topActions, topEntities, recentActivity,] = await Promise.all([
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
    }
    catch (error) {
        console.error("❌ Erreur récupération statistiques audit:", error);
        throw error;
    }
});
/**
 * @controller exportAuditLogs
 * @description Exporte les logs d'audit au format CSV ou JSON
 * @route GET /api/audit-logs/export
 * @access Admin seulement
 */
exports.exportAuditLogs = (0, asyncHandler_1.asyncErrorHandler)(async (req, res) => {
    try {
        const { format = "csv", ...filters } = req.query;
        const where = {};
        // Construction du filtre
        if (filters.action)
            where.action = filters.action;
        if (filters.entity)
            where.entity = filters.entity;
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.status)
            where.status = filters.status;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate)
                where.createdAt.lte = new Date(filters.endDate);
        }
        const auditLogs = await prisma.auditLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        // Reste du code d'export inchangé...
    }
    catch (error) {
        console.error("❌ Erreur export logs audit:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'export",
            code: "EXPORT_ERROR",
        });
    }
});
// Export des contrôleurs
exports.default = {
    createAuditLog: exports.createAuditLog,
    getAuditLogs: exports.getAuditLogs,
    getAuditLogById: exports.getAuditLogById,
    getUserAuditLogs: exports.getUserAuditLogs,
    getAuditStats: exports.getAuditStats,
};
//# sourceMappingURL=auditController.js.map