/**
 * @file eventController.ts
 * @description Contrôleur pour la gestion des événements
 * @module Controllers/Events
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { EventService } from "../services/eventService";
import { AuthRequest } from "./auth/authTypes";

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

      const result = await EventService.createEvent({
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
    } catch (error: any) {
      console.error("❌ Erreur création événement:", error);

      // Journalisation de l'erreur (sans bloquer la réponse)
      try {
        // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Erreur interne du serveur",
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

      const result = await EventService.getEvents({
        status: status as string,
        category: category as string,
        isPublic: isPublic as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page as string,
        limit: limit as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as string,
        search: search as string,
        userRole: req.user?.role,
      });

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur récupération événements:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la récupération des événements",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getUpcomingEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = "5" } = req.query;

      const result = await EventService.getUpcomingEvents({
        limit: limit as string,
        userRole: req.user?.role,
      });

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur récupération événements à venir:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message ||
          "Erreur lors de la récupération des événements à venir",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getEventById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await EventService.getEventById(id, req.user?.role);

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur récupération événement:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la récupération de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const result = await EventService.updateEvent(id, updates, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur mise à jour événement:", error);

      // Journalisation de l'erreur
      try {
        // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la mise à jour de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deleteEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await EventService.deleteEvent(id, {
        userId: req.user?.id || "",
        userRole: req.user?.role || "",
        userEmail: req.user?.email,
      });

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur suppression événement:", error);

      // Journalisation de l'erreur
      try {
        // Vous pouvez ajouter ici la journalisation d'erreur si nécessaire
      } catch (logError) {
        console.error("❌ Erreur de journalisation:", logError);
      }

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la suppression de l'événement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getEventStats: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await EventService.getEventStats(req.user?.role);

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur récupération statistiques:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message || "Erreur lors de la récupération des statistiques",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getEventsByCategory: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { category } = req.params;
      const { page = "1", limit = "10" } = req.query;

      const result = await EventService.getEventsByCategory({
        category,
        page: page as string,
        limit: limit as string,
        userRole: req.user?.role,
      });

      res.json(result);
    } catch (error: any) {
      console.error("❌ Erreur récupération événements par catégorie:", error);

      res.status(error.status || 500).json({
        success: false,
        message:
          error.message ||
          "Erreur lors de la récupération des événements par catégorie",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
