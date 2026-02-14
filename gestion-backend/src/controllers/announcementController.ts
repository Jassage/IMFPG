/**
 * @file announcementController.ts
 * @description Contrôleur pour la gestion des annonces
 * @module Controllers/Announcements
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AnnouncementService } from "../services/announcementService";
import { AuthRequest } from "./auth/authTypes";

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

      const result = await AnnouncementService.createAnnouncement({
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
    } catch (error: any) {
      console.error(" Erreur création annonce:", error);

      try {
      } catch (logError) {
        console.error(" Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur interne du serveur",
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

      const result = await AnnouncementService.getAnnouncements({
        targetAudience: targetAudience as string,
        priority: priority as string,
        isActive: isActive as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page as string,
        limit: limit as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as string,
        search: search as string,
        authorId: authorId as string,
        userRole: req.user?.role,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur récupération annonces:", error);

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de la récupération des annonces",
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

      const result = await AnnouncementService.getActiveAnnouncements({
        limit: limit as string,
        userRole: req.user?.role,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur récupération annonces actives:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message ||
          "Erreur lors de la récupération des annonces actives",
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

      const result = await AnnouncementService.getAnnouncementById(
        id,
        req.user?.role
      );

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur récupération annonce:", error);

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de la récupération de l'annonce",
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

      const result = await AnnouncementService.updateAnnouncement(id, updates, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur mise à jour annonce:", error);

      try {
      } catch (logError) {
        console.error(" Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de la mise à jour de l'annonce",
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

      const result = await AnnouncementService.deleteAnnouncement(id, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur suppression annonce:", error);

      try {
      } catch (logError) {
        console.error(" Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de la suppression de l'annonce",
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

      const result = await AnnouncementService.deactivateAnnouncement(id, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur désactivation annonce:", error);

      try {
      } catch (logError) {
        console.error(" Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la désactivation de l'annonce",
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

      const result = await AnnouncementService.activateAnnouncement(id, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur activation annonce:", error);

      try {
      } catch (logError) {
        console.error(" Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur lors de l'activation de l'annonce",
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
      const result = await AnnouncementService.getAnnouncementStats(
        req.user?.role
      );

      res.json(result);
    } catch (error: any) {
      console.error(" Erreur récupération statistiques annonces:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la récupération des statistiques",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
