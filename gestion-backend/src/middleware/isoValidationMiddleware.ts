/**
 * @file isoValidationMiddleware.ts
 * @description Middleware pour valider les formats ISO
 */

import { Request, Response, NextFunction } from "express";

/**
 * Valide que les champs de temps sont au format ISO
 */
export const validateISOTimeFields = (
  fields: string[] = ["startTime", "endTime"]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    fields.forEach((field) => {
      const value = req.body[field] || req.query[field];

      if (value) {
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`Le champ ${field} doit être un timestamp ISO valide`);
          }
        } catch {
          errors.push(`Le champ ${field} doit être un timestamp ISO valide`);
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors,
        code: "INVALID_ISO_FORMAT",
      });
    }

    next();
  };
};

/**
 * Valide l'ordre des temps (startTime < endTime)
 */
export const validateTimeOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { startTime, endTime } = req.body;

  if (startTime && endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "L'heure de fin doit être après l'heure de début",
        code: "INVALID_TIME_ORDER",
      });
    }
  }

  next();
};

/**
 * Valide la durée minimale et maximale
 */
export const validateDuration = (
  minMinutes: number = 30,
  maxMinutes: number = 240
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { startTime, endTime } = req.body;

    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

      if (duration < minMinutes) {
        return res.status(400).json({
          success: false,
          message: `Durée minimale: ${minMinutes} minutes`,
          code: "MIN_DURATION_NOT_MET",
        });
      }

      if (duration > maxMinutes) {
        return res.status(400).json({
          success: false,
          message: `Durée maximale: ${maxMinutes} minutes`,
          code: "MAX_DURATION_EXCEEDED",
        });
      }
    }

    next();
  };
};
