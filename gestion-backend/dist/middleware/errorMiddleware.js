"use strict";
/**
 * @file errorMiddleware.ts
 * @description Middlewares de gestion centralisée des erreurs
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.securityHeaders = exports.createError = exports.asyncErrorHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const auditController_1 = require("../controllers/auditController");
const authUtils_1 = require("../controllers/auth/authUtils");
/**
 * @class AppError
 * @description Erreur personnalisée de l'application
 */
class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        // Maintenir le stack trace propre
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * @middleware errorHandler
 * @description Gestionnaire d'erreurs global
 */
const errorHandler = (error, req, res, next) => {
    const auditData = (0, authUtils_1.createSafeAuditData)((0, authUtils_1.extractAuditData)(req));
    // Déterminer le statut et le message d'erreur
    let statusCode = 500;
    let message = "Erreur interne du serveur";
    let code = "INTERNAL_ERROR";
    let details = undefined;
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code;
        details = error.details;
    }
    else if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Erreur de validation des données";
        code = "VALIDATION_ERROR";
    }
    else if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Token JWT invalide";
        code = "INVALID_TOKEN";
    }
    else if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token JWT expiré";
        code = "TOKEN_EXPIRED";
    }
    else if (error.name === "PrismaClientKnownRequestError") {
        statusCode = 400;
        message = "Erreur de base de données";
        code = "DATABASE_ERROR";
    }
    else if (error.name === "PrismaClientUnknownRequestError") {
        statusCode = 500;
        message = "Erreur inconnue de base de données";
        code = "DATABASE_ERROR";
    }
    else if (error.name === "PrismaClientValidationError") {
        statusCode = 400;
        message = "Erreur de validation des données";
        code = "VALIDATION_ERROR";
    }
    // Log de l'erreur
    console.error("❌ ErrorMiddleware:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: req.url,
        method: req.method,
        statusCode,
        userId: auditData.userId,
    });
    // Log d'audit pour les erreurs
    (0, auditController_1.createAuditLog)({
        ...auditData,
        action: "ERROR",
        entity: "System",
        description: `Erreur ${statusCode}: ${message}`,
        status: "ERROR",
        errorMessage: error.message,
        metadata: {
            url: req.url,
            method: req.method,
            statusCode,
            errorCode: code,
            errorName: error.name,
            ...(details && { details }),
        },
    }).catch((auditError) => {
        console.error("❌ Erreur lors du log d'audit:", auditError);
    });
    // Réponse d'erreur
    const errorResponse = {
        success: false,
        message,
        code,
    };
    // Ajouter les détails en développement
    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = error.stack;
        errorResponse.details = details || error.message;
    }
    // Ajouter les détails de validation si disponibles
    if (code === "VALIDATION_ERROR" && details) {
        errorResponse.errors = details;
    }
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
/**
 * @middleware notFoundHandler
 * @description Gestionnaire de routes non trouvées
 */
const notFoundHandler = (req, res, next) => {
    const auditData = (0, authUtils_1.createSafeAuditData)((0, authUtils_1.extractAuditData)(req));
    (0, auditController_1.createAuditLog)({
        ...auditData,
        action: "ROUTE_NOT_FOUND",
        entity: "System",
        description: `Route non trouvée: ${req.method} ${req.url}`,
        status: "ERROR",
        metadata: {
            url: req.url,
            method: req.method,
        },
    }).catch(console.error);
    const error = new AppError(`Route non trouvée: ${req.method} ${req.url}`, 404, "ROUTE_NOT_FOUND");
    next(error);
};
exports.notFoundHandler = notFoundHandler;
/**
 * @middleware asyncErrorHandler
 * @description Wrapper pour gérer les erreurs dans les fonctions async
 * @param {Function} fn - Fonction async à wrapper
 */
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
/**
 * @function createError
 * @description Factory function pour créer des erreurs personnalisées
 * @param {string} message - Message d'erreur
 * @param {number} statusCode - Code de statut HTTP
 * @param {string} code - Code d'erreur personnalisé
 * @param {any} details - Détails supplémentaires
 * @returns {AppError} Erreur personnalisée
 */
const createError = (message, statusCode = 500, code = "INTERNAL_ERROR", details) => {
    return new AppError(message, statusCode, code, true, details);
};
exports.createError = createError;
/**
 * @middleware securityHeaders
 * @description Ajoute des en-têtes de sécurité HTTP
 */
const securityHeaders = (req, res, next) => {
    // Headers de sécurité
    res.set({
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    });
    // Header CSP (Content Security Policy)
    if (process.env.NODE_ENV === "production") {
        res.set({
            "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
        });
    }
    next();
};
exports.securityHeaders = securityHeaders;
/**
 * @middleware requestLogger
 * @description Log les requêtes entrantes
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log quand la réponse est terminée
    res.on("finish", () => {
        const duration = Date.now() - start;
        const auditData = (0, authUtils_1.createSafeAuditData)((0, authUtils_1.extractAuditData)(req));
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: auditData.ipAddress,
            userAgent: auditData.userAgent,
            userId: auditData.userId,
        };
        // Log conditionnel basé sur le status code
        if (res.statusCode >= 400) {
            console.warn("⚠️ HTTP Request Error:", logData);
        }
        else {
            console.log("✅ HTTP Request:", logData);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=errorMiddleware.js.map