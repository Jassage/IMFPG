"use strict";
/**
 * @file eventService.ts
 * @description Service pour la gestion des événements
 * @module Services/Events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Fonction utilitaire pour vérifier les permissions
const hasRole = (userRole, allowedRoles) => {
    if (!userRole)
        return false;
    return allowedRoles.includes(userRole);
};
/**
 * @class EventService
 * @description Service pour la gestion des événements
 */
class EventService {
    /**
     * Crée un nouvel événement
     */
    static async createEvent(data) {
        const { title, description, startDate, endDate, location, organizer, category = "General", isPublic = true, userId, userRole, userEmail, } = data;
        // Vérification que l'utilisateur est authentifié
        if (!userId || !userRole) {
            throw {
                status: 401,
                message: "Authentification requise",
            };
        }
        // Vérification des permissions
        const allowedRoles = ["Admin", "Directeur", "Secretaire"];
        if (!hasRole(userRole, allowedRoles)) {
            throw {
                status: 403,
                message: "Permission refusée. Seuls les administrateurs, directeurs et secrétaires peuvent créer des événements.",
            };
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
                description: `Événement "${title}" créé par ${userEmail || userId}`,
                userId: userId,
                status: "SUCCESS",
                metadata: {
                    eventId: event.id,
                    title: event.title,
                    category: event.category,
                },
            },
        });
        return {
            success: true,
            message: "Événement créé avec succès",
            data: event,
            metadata: {
                eventId: event.id,
                action: "CREATE",
                userEmail,
            },
        };
    }
    /**
     * Récupère les événements avec filtres et pagination
     */
    static async getEvents(filters) {
        const { status, category, isPublic, startDate, endDate, page = "1", limit = "10", sortBy = "startDate", sortOrder = "asc", search, userRole, } = filters;
        // Construction des conditions de filtrage
        const where = {};
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
            where.status = "Scheduled";
        }
        else if (isPublic !== undefined && isPublic !== "all") {
            where.isPublic = isPublic === "true";
        }
        // Filtre par plage de dates
        if (startDate || endDate) {
            where.AND = [];
            if (startDate) {
                where.AND.push({ startDate: { gte: new Date(startDate) } });
            }
            if (endDate) {
                where.AND.push({ endDate: { lte: new Date(endDate) } });
            }
        }
        // Filtre de recherche
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        // Configuration de la pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Définition du tri
        const orderBy = {};
        const validSortFields = [
            "title",
            "startDate",
            "endDate",
            "createdAt",
            "category",
        ];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "startDate";
        orderBy[sortField] = sortOrder === "desc" ? "desc" : "asc";
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
        return {
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
        };
    }
    /**
     * Récupère les événements à venir
     */
    static async getUpcomingEvents(filters) {
        const { limit = "5", userRole } = filters;
        // Conditions de filtrage pour les événements à venir
        const where = {
            startDate: { gte: new Date() },
            status: "Scheduled",
        };
        // Pour les non-admins, seulement les événements publics
        if (userRole && !["Admin", "Directeur"].includes(userRole)) {
            where.isPublic = true;
        }
        // Récupération des événements à venir
        const events = await prisma.event.findMany({
            where,
            orderBy: { startDate: "asc" },
            take: parseInt(limit),
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
        return {
            success: true,
            message: "Événements à venir récupérés avec succès",
            data: events,
            meta: {
                count: events.length,
                limit: parseInt(limit),
            },
        };
    }
    /**
     * Récupère un événement par son ID
     */
    static async getEventById(id, userRole) {
        // Récupération de l'événement
        const event = await prisma.event.findUnique({
            where: { id },
        });
        // Vérification si l'événement existe
        if (!event) {
            throw {
                status: 404,
                message: "Événement non trouvé",
            };
        }
        // Vérification des permissions pour les événements privés
        if (!event.isPublic &&
            userRole &&
            !["Admin", "Directeur"].includes(userRole)) {
            throw {
                status: 403,
                message: "Accès refusé. Cet événement est privé.",
            };
        }
        return {
            success: true,
            message: "Événement récupéré avec succès",
            data: event,
        };
    }
    /**
     * Met à jour un événement
     */
    static async updateEvent(id, updates, userData) {
        const { userId, userRole, userEmail } = userData;
        // Vérification que l'utilisateur est authentifié
        if (!userId || !userRole) {
            throw {
                status: 401,
                message: "Authentification requise",
            };
        }
        // Vérification des permissions
        const allowedRoles = ["Admin", "Directeur", "Secretaire"];
        if (!hasRole(userRole, allowedRoles)) {
            throw {
                status: 403,
                message: "Permission refusée. Seuls les administrateurs, directeurs et secrétaires peuvent modifier des événements.",
            };
        }
        // Vérification de l'existence de l'événement
        const existingEvent = await prisma.event.findUnique({
            where: { id },
        });
        if (!existingEvent) {
            throw {
                status: 404,
                message: "Événement non trouvé",
            };
        }
        // Préparation des données de mise à jour
        const updateData = { ...updates };
        // Conversion des dates si présentes
        if (updates.startDate) {
            updateData.startDate = new Date(updates.startDate);
        }
        if (updates.endDate) {
            updateData.endDate = new Date(updates.endDate);
        }
        updateData.updatedAt = new Date();
        // Mise à jour de l'événement
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: updateData,
        });
        // Journalisation dans l'audit log
        await prisma.auditLog.create({
            data: {
                action: "UPDATE",
                entity: "Event",
                entityId: id,
                description: `Événement "${existingEvent.title}" modifié par ${userEmail || userId}`,
                userId: userId,
                status: "SUCCESS",
                oldData: existingEvent,
                newData: updatedEvent,
                metadata: {
                    changes: Object.keys(updates),
                },
            },
        });
        return {
            success: true,
            message: "Événement mis à jour avec succès",
            data: updatedEvent,
            metadata: {
                eventId: id,
                action: "UPDATE",
                userEmail,
                changes: Object.keys(updates),
            },
        };
    }
    /**
     * Supprime un événement
     */
    static async deleteEvent(id, userData) {
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
        if (!hasRole(userRole, allowedRoles)) {
            throw {
                status: 403,
                message: "Permission refusée. Seuls les administrateurs et directeurs peuvent supprimer des événements.",
            };
        }
        // Vérification de l'existence de l'événement
        const existingEvent = await prisma.event.findUnique({
            where: { id },
        });
        if (!existingEvent) {
            throw {
                status: 404,
                message: "Événement non trouvé",
            };
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
                description: `Événement "${existingEvent.title}" supprimé par ${userEmail || userId}`,
                userId: userId,
                status: "SUCCESS",
                oldData: existingEvent,
                metadata: {
                    title: existingEvent.title,
                    category: existingEvent.category,
                },
            },
        });
        return {
            success: true,
            message: "Événement supprimé avec succès",
            metadata: {
                eventId: id,
                title: existingEvent.title,
                action: "DELETE",
                userEmail,
            },
        };
    }
    /**
     * Récupère les statistiques des événements
     */
    static async getEventStats(userRole) {
        // Vérification des permissions
        if (!userRole || !["Admin", "Directeur"].includes(userRole)) {
            throw {
                status: 403,
                message: "Permission refusée. Seuls les administrateurs et directeurs peuvent voir les statistiques.",
            };
        }
        // Récupération des statistiques en parallèle
        const [totalEvents, upcomingEvents, pastEvents, publicEvents, privateEvents, eventsByStatus, eventsByCategory,] = await Promise.all([
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
        const statsByStatus = eventsByStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
        }, {});
        const statsByCategory = eventsByCategory.reduce((acc, item) => {
            acc[item.category] = item._count;
            return acc;
        }, {});
        return {
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
        };
    }
    /**
     * Récupère les événements par catégorie
     */
    static async getEventsByCategory(filters) {
        const { category, page = "1", limit = "10", userRole } = filters;
        // Conditions de filtrage
        const where = { category };
        // Pour les non-admins, seulement les événements publics et planifiés
        if (userRole && !["Admin", "Directeur"].includes(userRole)) {
            where.isPublic = true;
            where.status = "Scheduled";
        }
        // Configuration de la pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
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
        return {
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
        };
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map