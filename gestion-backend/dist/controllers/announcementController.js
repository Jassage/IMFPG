"use strict";
/**
 * @file announcementController.ts
 * @description Contrôleur pour la gestion des annonces
 * @module Controllers/Announcements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementController = void 0;
const express_validator_1 = require("express-validator");
const announcementService_1 = require("../services/announcementService");
exports.announcementController = {
    createAnnouncement: async (req, res) => {
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
            const { title, content, publishDate, expiryDate, targetAudience = "All", priority = "Medium", attachments = [], } = req.body;
            const result = await announcementService_1.AnnouncementService.createAnnouncement({
                title,
                content,
                publishDate,
                expiryDate,
                targetAudience,
                priority,
                attachments,
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.status(201).json(result);
        }
        catch (error) {
            console.error("❌ Erreur création annonce:", error);
            // Journalisation de l'erreur
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
    getAnnouncements: async (req, res) => {
        try {
            const { targetAudience, priority, isActive, startDate, endDate, page = "1", limit = "10", sortBy = "publishDate", sortOrder = "desc", search, authorId, } = req.query;
            const result = await announcementService_1.AnnouncementService.getAnnouncements({
                targetAudience: targetAudience,
                priority: priority,
                isActive: isActive,
                startDate: startDate,
                endDate: endDate,
                page: page,
                limit: limit,
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: search,
                authorId: authorId,
                userRole: req.user?.role,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération annonces:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération des annonces",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getActiveAnnouncements: async (req, res) => {
        try {
            const { limit = "5" } = req.query;
            const result = await announcementService_1.AnnouncementService.getActiveAnnouncements({
                limit: limit,
                userRole: req.user?.role,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération annonces actives:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message ||
                    "Erreur lors de la récupération des annonces actives",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getAnnouncementById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await announcementService_1.AnnouncementService.getAnnouncementById(id, req.user?.role);
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération annonce:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération de l'annonce",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    updateAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const result = await announcementService_1.AnnouncementService.updateAnnouncement(id, updates, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur mise à jour annonce:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la mise à jour de l'annonce",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    deleteAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await announcementService_1.AnnouncementService.deleteAnnouncement(id, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur suppression annonce:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la suppression de l'annonce",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    deactivateAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await announcementService_1.AnnouncementService.deactivateAnnouncement(id, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur désactivation annonce:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la désactivation de l'annonce",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    activateAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await announcementService_1.AnnouncementService.activateAnnouncement(id, {
                userId: req.user?.id || "",
                userRole: req.user?.role || "",
                userEmail: req.user?.email,
            });
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur activation annonce:", error);
            // Journalisation de l'erreur
            try {
                // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
            }
            catch (logError) {
                console.error("❌ Erreur de journalisation:", logError);
            }
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de l'activation de l'annonce",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
    getAnnouncementStats: async (req, res) => {
        try {
            const result = await announcementService_1.AnnouncementService.getAnnouncementStats(req.user?.role);
            res.json(result);
        }
        catch (error) {
            console.error("❌ Erreur récupération statistiques annonces:", error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Erreur lors de la récupération des statistiques",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    },
};
//# sourceMappingURL=announcementController.js.map