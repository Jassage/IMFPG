"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAuditLogs = exports.getAuditStatistics = exports.getAuditLogs = exports.getUserIdFromRequest = exports.createAuditLog = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// import { AuthenticatedRequest } from "../middleware/auth.middleware";
// FONCTION CORRIGÉE : Fonction utilitaire pour créer des logs d'audit
// src/controllers/auditController.ts
const createAuditLog = async (data) => {
    try {
        // Tronquer les champs si nécessaire
        const truncatedData = {
            ipAddress: data.ipAddress.substring(0, 45),
            userAgent: data.userAgent.substring(0, 500),
            action: data.action.substring(0, 100),
            entity: data.entity.substring(0, 50),
            entityId: data.entityId ? data.entityId.substring(0, 50) : undefined,
            description: data.description.substring(0, 1000),
            errorMessage: data.errorMessage
                ? data.errorMessage.substring(0, 500)
                : undefined,
            metadata: data.metadata ? data.metadata : undefined,
            userId: data.userId ? data.userId : undefined,
            status: data.status,
        };
        await prisma_1.default.auditLog.create({
            data: truncatedData,
        });
    }
    catch (error) {
        console.error("❌ Erreur création audit log:", error);
        // Ne pas throw l'erreur pour ne pas interrompre le flux principal
    }
};
exports.createAuditLog = createAuditLog;
// Dans auditController.ts
const getUserIdFromRequest = (req) => {
    return req.user?.id || req.userId || null;
};
exports.getUserIdFromRequest = getUserIdFromRequest;
const getAuditLogs = async (req, res) => {
    try {
        const { page = "1", limit = "50", action, entity, userId, startDate, endDate, search, } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (action)
            where.action = action;
        if (entity)
            where.entity = entity;
        if (userId)
            where.userId = userId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { entityId: { contains: search } },
            ];
        }
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNum,
            }),
            prisma_1.default.auditLog.count({ where }),
        ]);
        res.json({
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des logs" });
    }
};
exports.getAuditLogs = getAuditLogs;
const getAuditStatistics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const stats = await prisma_1.default.auditLog.groupBy({
            by: ["action", "entity"],
            where: {
                createdAt: { gte: thirtyDaysAgo },
            },
            _count: { id: true },
        });
        const dailyActivity = await prisma_1.default.auditLog.groupBy({
            by: ["createdAt"],
            where: {
                createdAt: { gte: thirtyDaysAgo },
            },
            _count: { id: true },
            orderBy: { createdAt: "asc" },
        });
        res.json({ stats, dailyActivity });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur statistiques" });
    }
};
exports.getAuditStatistics = getAuditStatistics;
// controllers/auditController.ts - Ajoutez cette fonction
const exportAuditLogs = async (req, res) => {
    try {
        const { format = "json", action, entity, status, search } = req.query;
        const where = {};
        if (action && action !== "all")
            where.action = action;
        if (entity && entity !== "all")
            where.entity = entity;
        if (status && status !== "all")
            where.status = status;
        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { entityId: { contains: search } },
            ];
        }
        const logs = await prisma_1.default.auditLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        if (format === "csv") {
            // Conversion en CSV
            const csvHeaders = [
                "Date",
                "Action",
                "Entité",
                "Utilisateur",
                "Description",
                "Statut",
                "IP",
            ];
            const csvRows = logs.map((log) => [
                new Date(log.createdAt).toISOString(),
                log.action,
                log.entity,
                log.user ? `${log.user.firstName} ${log.user.lastName}` : "Système",
                `"${log.description.replace(/"/g, '""')}"`, // Échapper les guillemets
                log.status || "SUCCESS",
                log.ipAddress,
            ]);
            const csvContent = [
                csvHeaders.join(","),
                ...csvRows.map((row) => row.join(",")),
            ].join("\n");
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=audit-logs-${new Date().toISOString().split("T")[0]}.csv`);
            res.send(csvContent);
        }
        else {
            // JSON par défaut
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", `attachment; filename=audit-logs-${new Date().toISOString().split("T")[0]}.json`);
            res.json(logs);
        }
    }
    catch (error) {
        console.error("Erreur export logs:", error);
        res.status(500).json({ error: "Erreur lors de l'export des logs" });
    }
};
exports.exportAuditLogs = exportAuditLogs;
//# sourceMappingURL=auditController.js.map