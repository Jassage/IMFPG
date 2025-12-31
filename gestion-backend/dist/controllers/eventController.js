"use strict";
/**
 * @file eventController.ts
 * @description Contrôleur pour la gestion des événements
 * @module Controllers/Events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const express_validator_1 = require("express-validator");
const eventService_1 = require("../services/eventService");
exports.eventController = {
    createEvent: async (req, res) => {
        try {
            // Validation des données d'entrée
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }
            const { title, description, startDate, endDate, location, organizer, category = "General", isPublic = true, } = req.body;
            const result = await eventService_1.EventService.createEvent({
                title,
                description,
                startDate,
                endDate,
                location,
                organizer,
                category,
                isPublic,
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.status(201).json(result);
        }
        catch (error) {
            console.error("❌ Erreur création événement:", error);
            // Journalisation de l'erreur (sans bloquer la réponse)
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur interne du serveur",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getEvents: async (req, res) => {
        try {
            const { status, category, isPublic, startDate, endDate, page = "1", limit = "10", sortBy = "startDate", sortOrder = "asc", search, } = req.query;
            const result = await eventService_1.EventService.getEvents({
                status: status,
                category: category,
                isPublic: isPublic,
                startDate: startDate,
                endDate: endDate,
                page: page,
                limit: limit,
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: search,
                userRole: req.user?.role,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération événements:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération des événements",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getUpcomingEvents: async (req, res) => {
        try {
            const { limit = "5" } = req.query;
            const result = await eventService_1.EventService.getUpcomingEvents({
                limit: limit,
                userRole: req.user?.role,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération événements à venir:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message ||
                    "Erreur lors de la récupération des événements à venir",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getEventById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await eventService_1.EventService.getEventById(id, req.user?.role);
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération événement:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération de l'événement",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const result = await eventService_1.EventService.updateEvent(id, updates, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur mise à jour événement:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la mise à jour de l'événement",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await eventService_1.EventService.deleteEvent(id, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur suppression événement:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la suppression de l'événement",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getEventStats: async (req, res) => {
        try {
            const result = await eventService_1.EventService.getEventStats(req.user?.role);
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération statistiques:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération des statistiques",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getEventsByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const { page = "1", limit = "10" } = req.query;
            const result = await eventService_1.EventService.getEventsByCategory({
                category,
                page: page,
                limit: limit,
                userRole: req.user?.role,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération événements par catégorie:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message ||
                    "Erreur lors de la récupération des événements par catégorie",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
};
//# sourceMappingURL=eventController.js.map