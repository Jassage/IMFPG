/**
 * @file validationMiddleware.ts
 * @description Middlewares de validation des données et sanitisation - Version améliorée
 * @version 2.0.0
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
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  type?: string;
  location?: "body" | "query" | "params" | "headers";
}

/**
 * @interface ValidationResult
 * @description Résultat de la validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * @middleware handleValidationErrors
 * @description Gère les erreurs de validation de express-validator avec améliorations
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const auditData = createSafeAuditData(extractAuditData(req));
      const formattedErrors: ValidationError[] = errors
        .array()
        .map((error) => ({
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
          endpoint: req.baseUrl + req.path,
        },
      }).catch((err) => {});

      return res.status(400).json({
        success: false,
        message: "Données de requête invalides",
        code: "VALIDATION_ERROR",
        errors: formattedErrors,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error: any) {
    next(error);
  }
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
  try {
    if (
      (req.method === "POST" ||
        req.method === "PUT" ||
        req.method === "PATCH") &&
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
          endpoint: req.baseUrl + req.path,
        },
      }).catch((err) => {});

      return res.status(400).json({
        success: false,
        message: "Le corps de la requête ne peut pas être vide",
        code: "EMPTY_BODY",
        timestamp: new Date().toISOString(),
      });
    }
    next();
  } catch (error: any) {
    next(error);
  }
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
    try {
      if (
        req.method === "POST" ||
        req.method === "PUT" ||
        req.method === "PATCH"
      ) {
        const contentType = req.get("Content-Type");

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
          }).catch((err) => {});

          return res.status(415).json({
            success: false,
            message: `Content-Type non supporté. Types autorisés: ${allowedTypes.join(", ")}`,
            code: "UNSUPPORTED_MEDIA_TYPE",
            timestamp: new Date().toISOString(),
          });
        }
      }
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * @middleware sanitizeInput
 * @description Nettoie et sécurise les entrées utilisateur contre XSS et injections
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitizer les paramètres de query
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (typeof req.query[key] === "string") {
          (req.query as any)[key] = sanitizeString(req.query[key] as string);
        } else if (Array.isArray(req.query[key])) {
          (req.query as any)[key] = (req.query[key] as string[]).map(
            sanitizeString
          );
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

    // Sanitizer les headers sensibles
    if (req.headers) {
      const sensitiveHeaders = ["authorization", "cookie"];
      sensitiveHeaders.forEach((header) => {
        if (req.headers[header]) {
          // Ne pas logger les headers sensibles
          delete req.headers[header];
        }
      });
    }

    next();
  } catch (error: any) {
    next();
  }
};

/**
 * @function sanitizeString
 * @description Nettoie une chaîne de caractères contre XSS et injections
 * @param {string} value - Chaîne à nettoyer
 * @returns {string} Chaîne nettoyée
 */
const sanitizeString = (value: string): string => {
  if (typeof value !== "string") return value;

  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Supprimer les scripts
    .replace(/<[^>]*>/g, "") // Supprimer toutes les balises HTML
    .replace(/javascript:/gi, "") // Supprimer les protocoles javascript
    .replace(/on\w+="[^"]*"/gi, "") // Supprimer les attributs d'événements
    .replace(/on\w+='[^']*'/gi, "") // Supprimer les attributs d'événements
    .replace(/on\w+=\w+\([^)]*\)/gi, "") // Supprimer les attributs d'événements
    .replace(/\s+/g, " ") // Remplacer les espaces multiples par un seul
    .substring(0, 10000); // Limiter la longueur pour prévenir les attaques DoS
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

  if (
    obj &&
    typeof obj === "object" &&
    !(obj instanceof Date) &&
    !(obj instanceof File)
  ) {
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
  try {
    const { page, limit, sort, order } = req.query;

    // Validation de la page
    if (page) {
      const pageNum = parseInt(page as string, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'page' doit être un nombre positif",
          code: "INVALID_PAGE",
          timestamp: new Date().toISOString(),
        });
      }
      req.query.page = pageNum.toString();
    }

    // Validation de la limite
    if (limit) {
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 200) {
        // Augmenté à 200 pour plus de flexibilité
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'limit' doit être un nombre entre 1 et 200",
          code: "INVALID_LIMIT",
          timestamp: new Date().toISOString(),
        });
      }
      req.query.limit = limitNum.toString();
    }

    // Validation du tri
    if (sort && typeof sort === "string") {
      // Liste des champs autorisés pour le tri (peut être étendue selon les besoins)
      const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "firstName",
        "lastName",
        "email",
        "name",
        "date",
        "title",
        "status",
        "classLevel",
        "year",
        "startDate",
        "endDate",
      ];
      if (!allowedSortFields.includes(sort)) {
        return res.status(400).json({
          success: false,
          message: `Champ de tri non autorisé. Champs autorisés: ${allowedSortFields.join(", ")}`,
          code: "INVALID_SORT_FIELD",
          timestamp: new Date().toISOString(),
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
          timestamp: new Date().toISOString(),
        });
      }
      req.query.order = normalizedOrder;
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

/**
 * @middleware rateLimitByUser
 * @description Rate limiting basé sur l'utilisateur avec améliorations
 * @param {object} options - Options du rate limiting
 */
export const rateLimitByUser = (options: {
  windowMs: number;
  max: number;
  skipSuccessfulRequests?: boolean;
  message?: string;
}) => {
  const {
    windowMs,
    max,
    skipSuccessfulRequests = false,
    message = "Trop de requêtes. Veuillez réessayer plus tard.",
  } = options;

  const requests = new Map<string, { timestamps: number[]; count: number }>();

  // Nettoyage périodique des vieilles entrées
  setInterval(() => {
    const now = Date.now();
    const windowStart = now - windowMs;

    for (const [key, data] of requests.entries()) {
      const validTimestamps = data.timestamps.filter(
        (timestamp: number) => timestamp > windowStart
      );
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, {
          timestamps: validTimestamps,
          count: validTimestamps.length,
        });
      }
    }
  }, windowMs / 2); // Nettoyage toutes les demi-fenêtres

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId || req.ip || "anonymous";
      const now = Date.now();
      const windowStart = now - windowMs;

      let userData = requests.get(userId);
      if (!userData) {
        userData = { timestamps: [], count: 0 };
        requests.set(userId, userData);
      }

      // Filtrer les timestamps dans la fenêtre actuelle
      const recentTimestamps = userData.timestamps.filter(
        (timestamp: number) => timestamp > windowStart
      );

      if (recentTimestamps.length >= max) {
        const auditData = createSafeAuditData(extractAuditData(req));

        createAuditLog({
          ...auditData,
          action: "RATE_LIMIT_EXCEEDED",
          entity: "Security",
          description: "Limite de requêtes dépassée",
          status: "ERROR",
          metadata: {
            userId,
            requests: recentTimestamps.length,
            max,
            windowMs,
            endpoint: req.baseUrl + req.path,
          },
        }).catch((err) => {});

        return res.status(429).json({
          success: false,
          message,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil(windowMs / 1000),
          timestamp: new Date().toISOString(),
        });
      }

      // Ajouter la requête actuelle
      recentTimestamps.push(now);
      requests.set(userId, {
        timestamps: recentTimestamps,
        count: recentTimestamps.length,
      });

      // Ajouter les headers de rate limiting
      res.set({
        "X-RateLimit-Limit": max.toString(),
        "X-RateLimit-Remaining": (max - recentTimestamps.length).toString(),
        "X-RateLimit-Reset": new Date(now + windowMs).toISOString(),
        "X-RateLimit-Policy": `${max};w=${windowMs / 1000}`,
      });

      // Si on saute les requêtes réussies, on ne compte pas cette requête si elle réussit
      if (skipSuccessfulRequests) {
        const originalSend = res.send;
        res.send = function (body: any) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Retirer cette requête du compte
            const currentData = requests.get(userId);
            if (currentData && currentData.timestamps.length > 0) {
              currentData.timestamps.pop();
              requests.set(userId, {
                timestamps: currentData.timestamps,
                count: currentData.timestamps.length,
              });
            }
          }
          return originalSend.call(this, body);
        };
      }

      next();
    } catch (error: any) {
      next();
    }
  };
};

/**
 * @middleware validateFileUpload
 * @description Valide les uploads de fichiers avec améliorations
 * @param {object} options - Options de validation
 */
export const validateFileUpload = (
  options: {
    maxSize?: number;
    allowedMimeTypes?: string[];
    maxFiles?: number;
    required?: boolean;
  } = {}
) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/zip",
    ],
    maxFiles = 10,
    required = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        if (required) {
          return res.status(400).json({
            success: false,
            message: "Au moins un fichier est requis",
            code: "FILES_REQUIRED",
            timestamp: new Date().toISOString(),
          });
        }
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
          timestamp: new Date().toISOString(),
        });
      }

      // Valider chaque fichier
      const validationErrors: Array<{ filename: string; error: string }> = [];

      for (const file of files) {
        // Vérifier la taille
        if (file.size > maxSize) {
          validationErrors.push({
            filename: file.originalname,
            error: `Fichier trop volumineux. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}MB`,
          });
        }

        // Vérifier le type MIME
        if (!allowedMimeTypes.includes(file.mimetype)) {
          validationErrors.push({
            filename: file.originalname,
            error: `Type de fichier non autorisé. Types autorisés: ${allowedMimeTypes.join(", ")}`,
          });
        }

        // Vérifier l'extension pour sécurité supplémentaire
        const allowedExtensions = allowedMimeTypes.map((mime) => {
          const ext = mime.split("/")[1];
          return ext === "jpeg" ? "jpg" : ext;
        });

        const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
          validationErrors.push({
            filename: file.originalname,
            error: `Extension de fichier non autorisée. Extensions autorisées: ${allowedExtensions.join(", ")}`,
          });
        }

        // Vérifier le nom du fichier pour sécurité
        const sanitizedFilename = sanitizeString(file.originalname);
        if (sanitizedFilename !== file.originalname) {
          validationErrors.push({
            filename: file.originalname,
            error: "Nom de fichier contenant des caractères non autorisés",
          });
        }
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Erreurs de validation de fichiers",
          code: "FILE_VALIDATION_ERROR",
          errors: validationErrors,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * @middleware validateUUID
 * @description Valide que les IDs sont des UUID valides
 */
export const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Vérifier les params
    Object.keys(req.params).forEach((key) => {
      if (key.toLowerCase().includes("id") && req.params[key]) {
        if (!uuidRegex.test(req.params[key])) {
          return res.status(400).json({
            success: false,
            message: `Le paramètre ${key} doit être un UUID valide`,
            code: "INVALID_UUID",
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    // Vérifier les IDs dans le body si nécessaire
    if (req.body && typeof req.body === "object") {
      const bodyIds = Object.keys(req.body).filter(
        (key) => key.toLowerCase().includes("id") && req.body[key]
      );

      for (const key of bodyIds) {
        if (
          typeof req.body[key] === "string" &&
          !uuidRegex.test(req.body[key])
        ) {
          return res.status(400).json({
            success: false,
            message: `Le champ ${key} doit être un UUID valide`,
            code: "INVALID_UUID",
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

/**
 * @middleware validateEmail
 * @description Valide le format des emails
 */
export const validateEmail = (field: string = "email") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body[field];

      if (email && typeof email === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: "Format d'email invalide",
            code: "INVALID_EMAIL",
            timestamp: new Date().toISOString(),
          });
        }

        // Vérifier la longueur
        if (email.length > 254) {
          return res.status(400).json({
            success: false,
            message: "L'email ne peut pas dépasser 254 caractères",
            code: "EMAIL_TOO_LONG",
            timestamp: new Date().toISOString(),
          });
        }
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * @middleware logValidationSuccess
 * @description Log les validations réussies (optionnel, pour debugging)
 */
export const logValidationSuccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (process.env.NODE_ENV === "development") {
    }
    next();
  } catch (error: any) {
    next();
  }
};
