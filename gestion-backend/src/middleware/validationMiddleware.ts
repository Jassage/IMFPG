/**
 * @file validationMiddleware.ts
 * @description Middlewares de validation des données et sanitisation
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { createAuditLog } from "../controllers/auditController";
import {
  createSafeAuditData,
  extractAuditData,
} from "../controllers/auth/authUtils";

/**
 * @interface ValidationError
 * @description Structure d'une erreur de validation
 */
interface ValidationError {
  field: string;
  message: string;
  value?: any;
  type?: string;
}

/**
 * @interface ValidationResult
 * @description Résultat de la validation
 */
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * @middleware handleValidationErrors
 * @description Gère les erreurs de validation de express-validator
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const auditData = createSafeAuditData(extractAuditData(req));
    const formattedErrors: ValidationError[] = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "unknown",
      message: error.msg,
      value: error.type === "field" ? (error as any).value : undefined,
      type: error.type,
    }));

    // Log d'audit pour les erreurs de validation
    createAuditLog({
      ...auditData,
      action: "VALIDATION_ERROR",
      entity: "Validation",
      description: "Erreur de validation des données de requête",
      status: "ERROR",
      metadata: {
        errors: formattedErrors,
        url: req.url,
        method: req.method,
      },
    }).catch(console.error);

    return res.status(400).json({
      success: false,
      message: "Données de requête invalides",
      code: "VALIDATION_ERROR",
      errors: formattedErrors,
    });
  }

  next();
};

/**
 * @middleware validateRequestBody
 * @description Valide que le corps de la requête n'est pas vide pour les méthodes POST/PUT/PATCH
 */
export const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") &&
    Object.keys(req.body).length === 0
  ) {
    const auditData = createSafeAuditData(extractAuditData(req));

    createAuditLog({
      ...auditData,
      action: "EMPTY_BODY",
      entity: "Validation",
      description: "Tentative d'envoi de requête avec corps vide",
      status: "ERROR",
      metadata: {
        url: req.url,
        method: req.method,
      },
    }).catch(console.error);

    return res.status(400).json({
      success: false,
      message: "Le corps de la requête ne peut pas être vide",
      code: "EMPTY_BODY",
    });
  }
  next();
};

/**
 * @middleware validateContentType
 * @description Valide le Content-Type de la requête
 * @param {string[]} allowedTypes - Types de contenu autorisés
 */
export const validateContentType = (
  allowedTypes: string[] = ["application/json"]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.get("Content-Type");

    if (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "PATCH"
    ) {
      if (
        !contentType ||
        !allowedTypes.some((type) => contentType.includes(type))
      ) {
        const auditData = createSafeAuditData(extractAuditData(req));

        createAuditLog({
          ...auditData,
          action: "UNSUPPORTED_MEDIA_TYPE",
          entity: "Validation",
          description: "Content-Type non supporté",
          status: "ERROR",
          metadata: {
            contentType,
            allowedTypes,
            url: req.url,
            method: req.method,
          },
        }).catch(console.error);

        return res.status(415).json({
          success: false,
          message: `Content-Type non supporté. Types autorisés: ${allowedTypes.join(", ")}`,
          code: "UNSUPPORTED_MEDIA_TYPE",
        });
      }
    }

    next();
  };
};

/**
 * @middleware sanitizeInput
 * @description Nettoie et sécurise les entrées utilisateur
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Sanitizer les paramètres de query
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        (req.query as any)[key] = sanitizeString(req.query[key] as string);
      }
    });
  }

  // Sanitizer les paramètres de route
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (typeof req.params[key] === "string") {
        req.params[key] = sanitizeString(req.params[key]);
      }
    });
  }

  // Sanitizer le body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  next();
};

/**
 * @function sanitizeString
 * @description Nettoie une chaîne de caractères
 * @param {string} value - Chaîne à nettoyer
 * @returns {string} Chaîne nettoyée
 */
const sanitizeString = (value: string): string => {
  if (typeof value !== "string") return value;

  return value
    .trim()
    .replace(/[<>]/g, "") // Supprimer les balises HTML
    .replace(/\s+/g, " ") // Remplacer les espaces multiples par un seul
    .substring(0, 10000); // Limiter la longueur
};

/**
 * @function sanitizeObject
 * @description Nettoie récursivement un objet
 * @param {any} obj - Objet à nettoyer
 * @returns {any} Objet nettoyé
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeObject(value)])
    );
  }

  return obj;
};

/**
 * @middleware validatePagination
 * @description Valide et normalise les paramètres de pagination
 */
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit, sort, order } = req.query;

  // Validation de la page
  if (page) {
    const pageNum = parseInt(page as string, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Le paramètre 'page' doit être un nombre positif",
        code: "INVALID_PAGE",
      });
    }
    req.query.page = pageNum.toString();
  }

  // Validation de la limite
  if (limit) {
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Le paramètre 'limit' doit être un nombre entre 1 et 100",
        code: "INVALID_LIMIT",
      });
    }
    req.query.limit = limitNum.toString();
  }

  // Validation du tri
  if (sort && typeof sort === "string") {
    // Liste des champs autorisés pour le tri
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "firstName",
      "lastName",
      "email",
      "name",
    ];
    if (!allowedSortFields.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: `Champ de tri non autorisé. Champs autorisés: ${allowedSortFields.join(", ")}`,
        code: "INVALID_SORT_FIELD",
      });
    }
  }

  // Validation de l'ordre
  if (order && typeof order === "string") {
    const normalizedOrder = order.toLowerCase();
    if (normalizedOrder !== "asc" && normalizedOrder !== "desc") {
      return res.status(400).json({
        success: false,
        message: "L'ordre de tri doit être 'asc' ou 'desc'",
        code: "INVALID_ORDER",
      });
    }
    req.query.order = normalizedOrder;
  }

  next();
};

/**
 * @middleware rateLimitByUser
 * @description Rate limiting basé sur l'utilisateur
 * @param {object} options - Options du rate limiting
 */
export const rateLimitByUser = (options: { windowMs: number; max: number }) => {
  const { windowMs, max } = options;
  const requests = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId || req.ip || "anonymous";
    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyer les vieilles entrées
    for (const [key, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(
        (timestamp: number) => timestamp > windowStart
      );
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    }

    // Vérifier les requêtes de l'utilisateur
    const userRequests = requests.get(userId) || [];
    const recentRequests = userRequests.filter(
      (timestamp: number) => timestamp > windowStart
    );

    if (recentRequests.length >= max) {
      const auditData = createSafeAuditData(extractAuditData(req));

      createAuditLog({
        ...auditData,
        action: "RATE_LIMIT_EXCEEDED",
        entity: "Security",
        description: "Limite de requêtes dépassée",
        status: "ERROR",
        metadata: {
          userId,
          requests: recentRequests.length,
          max,
          windowMs,
        },
      }).catch(console.error);

      return res.status(429).json({
        success: false,
        message: "Trop de requêtes. Veuillez réessayer plus tard.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Ajouter la requête actuelle
    recentRequests.push(now);
    requests.set(userId, recentRequests);

    // Ajouter les headers de rate limiting
    res.set({
      "X-RateLimit-Limit": max.toString(),
      "X-RateLimit-Remaining": (max - recentRequests.length).toString(),
      "X-RateLimit-Reset": new Date(now + windowMs).toISOString(),
    });

    next();
  };
};

/**
 * @middleware validateFileUpload
 * @description Valide les uploads de fichiers
 * @param {object} options - Options de validation
 */
export const validateFileUpload = (
  options: {
    maxSize?: number;
    allowedMimeTypes?: string[];
    maxFiles?: number;
  } = {}
) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ],
    maxFiles = 5,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return next();
    }

    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    // Vérifier le nombre de fichiers
    if (files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        message: `Trop de fichiers. Maximum autorisé: ${maxFiles}`,
        code: "TOO_MANY_FILES",
      });
    }

    // Valider chaque fichier
    for (const file of files) {
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Fichier trop volumineux: ${file.filename}. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}MB`,
          code: "FILE_TOO_LARGE",
        });
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Type de fichier non autorisé: ${file.filename}. Types autorisés: ${allowedMimeTypes.join(", ")}`,
          code: "INVALID_FILE_TYPE",
        });
      }
    }

    next();
  };
};
