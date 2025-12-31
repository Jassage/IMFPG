"use strict";
/**
 * @file authController.ts
 * @description Contrôleur principal pour l'authentification
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordChangeRequired = exports.forcePasswordChange = exports.forgotPassword = exports.verifyToken = exports.getMe = exports.register = exports.login = void 0;
const authService_1 = require("../../services/authService");
const userService_1 = require("../../services/userService");
const emailService_1 = require("../../services/emailService");
const auditController_1 = require("../auditController");
const security_1 = require("../../utils/security");
const authUtils_1 = require("./authUtils");
const authTypes_1 = require("./authTypes");
/**
 * @controller login
 * @description Authentifie un utilisateur et retourne un token JWT
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
    const auditData = (0, authUtils_1.createSafeAuditData)((0, authUtils_1.extractAuditData)(req));
    try {
        const { email, password } = req.body;
        // Log de tentative de connexion
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.LOGIN_ATTEMPT,
            entity: "Auth",
            description: "Tentative de connexion",
            status: "INFO",
            metadata: { email },
        });
        // Appel du service d'authentification
        const authResult = await authService_1.AuthService.authenticateUser({ email, password }, auditData.ipAddress);
        // Gestion des réponses d'erreur
        if (authResult.code && authResult.code !== "USER_CREATED") {
            const statusCode = getStatusCodeFromErrorCode(authResult.code);
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: getAuthActionFromErrorCode(authResult.code),
                entity: "User",
                description: authResult.message,
                status: "ERROR",
                metadata: {
                    code: authResult.code,
                    ...(authResult.remainingAttempts && {
                        remainingAttempts: authResult.remainingAttempts,
                    }),
                    ...(authResult.lockUntil && { lockUntil: authResult.lockUntil }),
                },
            });
            res.status(statusCode).json({
                success: false,
                message: authResult.message,
                code: authResult.code,
                ...(authResult.remainingAttempts && {
                    remainingAttempts: authResult.remainingAttempts,
                }),
                ...(authResult.lockUntil && { lockUntil: authResult.lockUntil }),
            });
            return;
        }
        // Récupération du profil utilisateur complet
        const userProfile = await userService_1.UserService.getUserProfileWithRoleData(authResult.user.id);
        // Log de connexion réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.LOGIN_SUCCESS,
            entity: "User",
            entityId: authResult.user.id,
            userId: authResult.user.id,
            description: "Connexion réussie",
            status: "SUCCESS",
            metadata: {
                role: authResult.user.role,
                lastLogin: new Date(),
            },
        });
        // Réponse de succès
        const response = {
            success: true,
            message: authResult.message,
            data: {
                token: authResult.token,
                user: userProfile,
                expiresIn: authResult.expiresIn,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" AuthController - login error:", error);
        // Utiliser un message d'erreur court pour l'audit log
        const shortErrorMessage = error.message
            ? error.message.substring(0, 200)
            : "Erreur inconnue";
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.LOGIN_ERROR,
            entity: "Auth",
            description: "Erreur interne lors de la connexion",
            status: "ERROR",
            errorMessage: shortErrorMessage,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.login = login;
/**
 * @controller register
 * @description Crée un nouvel utilisateur dans le système
 * @route POST /api/auth/register
 * @access Public (en production, restreindre aux administrateurs)
 */
const register = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { email, password, role, firstName, lastName, phone } = req.body;
        // Log de tentative d'inscription
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.REGISTER_ATTEMPT,
            entity: "Auth",
            description: "Tentative d'inscription",
            status: "SUCCESS",
            metadata: { email, role },
        });
        // Appel du service d'inscription
        const registerResult = await authService_1.AuthService.registerUser({
            email,
            password,
            role,
            firstName,
            lastName,
            phone,
        });
        // Gestion des erreurs
        if (registerResult.code && registerResult.code !== "USER_CREATED") {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                userId: auditData.userId ?? null,
                action: authTypes_1.AuthActionTypes.REGISTER_ERROR,
                entity: "Auth",
                description: registerResult.message,
                status: "ERROR",
                metadata: { code: registerResult.code },
            });
            const statusCode = getStatusCodeFromErrorCode(registerResult.code);
            res.status(statusCode).json({
                success: false,
                message: registerResult.message,
                code: registerResult.code,
            });
            return;
        }
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.REGISTER_SUCCESS,
            entity: "User",
            entityId: registerResult.user.id,
            userId: registerResult.user.id,
            description: "Inscription réussie",
            status: "SUCCESS",
            metadata: {
                role: registerResult.user.role,
                hasPhone: !!phone,
            },
        });
        // Réponse de succès
        const response = {
            success: true,
            message: registerResult.message,
            data: { user: registerResult.user },
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error(" AuthController - register error:", error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.REGISTER_ERROR,
            entity: "Auth",
            description: "Erreur lors de l'inscription",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.register = register;
/**
 * @controller getMe
 * @description Récupère le profil de l'utilisateur connecté
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const userId = req.userId;
        if (!userId) {
            const response = {
                success: false,
                message: "Non autorisé",
                code: "UNAUTHORIZED",
            };
            res.status(401).json(response);
            return;
        }
        // Récupération du profil
        const userProfile = await userService_1.UserService.getUserProfile(userId);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.PROFILE_UPDATE_SUCCESS,
            entity: "User",
            entityId: userId,
            userId: userId,
            description: "Profil utilisateur récupéré avec succès",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Profil récupéré avec succès",
            data: { user: userProfile },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" AuthController - getMe error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.PROFILE_UPDATE_ERROR,
            entity: "Auth",
            description: "Erreur lors de la récupération du profil",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getMe = getMe;
/**
 * @controller verifyToken
 * @description Vérifie la validité d'un token JWT
 * @route GET /api/auth/verify
 * @access Public
 */
const verifyToken = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.TOKEN_VERIFICATION_ATTEMPT,
                entity: "Auth",
                description: "Tentative de vérification sans token",
                status: "ERROR",
            });
            const response = {
                success: false,
                message: "Token manquant",
                code: "MISSING_TOKEN",
            };
            res.status(401).json(response);
            return;
        }
        // Vérification du token
        const decoded = await authService_1.AuthService.verifyToken(token);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.TOKEN_VERIFICATION_SUCCESS,
            entity: "User",
            entityId: decoded.id,
            userId: decoded.id,
            description: "Token vérifié avec succès",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Token valide",
            data: { user: decoded },
        };
        res.json(response);
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.TOKEN_VERIFICATION_FAILED,
            entity: "Auth",
            description: "Échec de la vérification du token",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: error.message,
            code: "INVALID_TOKEN",
        };
        res.status(401).json(response);
    }
};
exports.verifyToken = verifyToken;
/**
 * @controller forgotPassword
 * @description Envoie un email de réinitialisation de mot de passe
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { email } = req.body;
        if (!email) {
            const response = {
                success: false,
                message: "Email requis",
                code: "MISSING_EMAIL",
            };
            res.status(400).json(response);
            return;
        }
        // Recherche de l'utilisateur
        const user = await userService_1.UserService.getUserByEmail(email);
        if (!user) {
            // Pour la sécurité, on ne révèle pas si l'email existe
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.FORGOT_PASSWORD_REQUEST,
                entity: "Auth",
                description: "Demande de réinitialisation pour email non trouvé",
                status: "SUCCESS",
                metadata: { email },
            });
            const response = {
                success: true,
                message: "Si l'email existe, un lien de réinitialisation a été envoyé",
            };
            res.json(response);
            return;
        }
        // Génération du token de réinitialisation
        const resetToken = (0, security_1.generateResetToken)();
        const resetTokenExpiry = (0, security_1.generateResetTokenExpiry)();
        // Sauvegarde du token
        await userService_1.UserService.updateUserResetToken(user.id, resetToken, resetTokenExpiry);
        // Génération du lien et de l'email
        const resetLink = (0, authUtils_1.generateResetLink)(resetToken);
        const emailTemplate = (0, authUtils_1.generateEmailTemplate)(user.firstName, resetLink);
        // Envoi de l'email
        try {
            await (0, emailService_1.sendEmail)({
                to: email,
                subject: "Réinitialisation de votre mot de passe",
                html: emailTemplate,
            });
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.FORGOT_PASSWORD_REQUEST,
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Email de réinitialisation envoyé",
                status: "SUCCESS",
                metadata: { emailSent: true },
            });
        }
        catch (emailError) {
            console.error(" Erreur envoi email:", emailError);
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.FORGOT_PASSWORD_REQUEST,
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Erreur lors de l'envoi de l'email de réinitialisation",
                status: "ERROR",
                errorMessage: emailError instanceof Error ? emailError.message : "Erreur inconnue",
            });
        }
        const response = {
            success: true,
            message: "Si l'email existe, un lien de réinitialisation a été envoyé",
        };
        res.json(response);
    }
    catch (error) {
        console.error(" AuthController - forgotPassword error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.RESET_PASSWORD_ERROR,
            entity: "Auth",
            description: "Erreur lors de la demande de réinitialisation",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.forgotPassword = forgotPassword;
/**
 * @controller forcePasswordChange
 * @description Force le changement de mot de passe (première connexion)
 * @route POST /api/auth/force-password-change
 * @access Private
 */
const forcePasswordChange = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const userId = req.userId;
        const { newPassword } = req.body;
        if (!userId) {
            const response = {
                success: false,
                message: "Non autorisé",
                code: "UNAUTHORIZED",
            };
            res.status(401).json(response);
            return;
        }
        if (!newPassword) {
            const response = {
                success: false,
                message: "Le nouveau mot de passe est requis",
                code: "MISSING_PASSWORD",
            };
            res.status(400).json(response);
            return;
        }
        // Appel du service avec forceChange = true
        const result = await authService_1.AuthService.changePassword(userId, "", // Pas de mot de passe actuel nécessaire pour le changement forcé
        newPassword, true // Force change
        );
        if (result.code === "PASSWORD_CHANGED" ||
            result.code === "INITIAL_PASSWORD_SET") {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.PASSWORD_FORCE_CHANGED,
                entity: "User",
                entityId: userId,
                userId: userId,
                description: "Mot de passe initial changé avec succès",
                status: "SUCCESS",
                metadata: {
                    isInitialPassword: false,
                    passwordChangedAt: new Date(),
                },
            });
            const response = {
                success: true,
                message: result.message,
            };
            res.json(response);
        }
        else {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: authTypes_1.AuthActionTypes.PASSWORD_CHANGE_ERROR,
                entity: "User",
                entityId: userId,
                userId: userId,
                description: result.message,
                status: "ERROR",
                errorMessage: result.code,
            });
            const response = {
                success: false,
                message: result.message,
                code: result.code,
            };
            res.status(400).json(response);
        }
    }
    catch (error) {
        console.error(" AuthController - forcePasswordChange error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.PASSWORD_CHANGE_ERROR,
            entity: "Auth",
            description: "Erreur lors du changement forcé de mot de passe",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.forcePasswordChange = forcePasswordChange;
/**
 * @controller checkPasswordChangeRequired
 * @description Vérifie si l'utilisateur doit changer son mot de passe
 * @route GET /api/auth/check-password-change
 * @access Private
 */
const checkPasswordChangeRequired = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const userId = req.userId;
        if (!userId) {
            const response = {
                success: false,
                message: "Non autorisé",
                code: "UNAUTHORIZED",
            };
            res.status(401).json(response);
            return;
        }
        const requiresChange = await authService_1.AuthService.checkPasswordChangeRequired(userId);
        const response = {
            success: true,
            message: requiresChange
                ? "Changement de mot de passe requis"
                : "Mot de passe à jour",
            data: { requiresPasswordChange: requiresChange },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" AuthController - checkPasswordChangeRequired error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: authTypes_1.AuthActionTypes.CHECK_PASSWORD_STATUS_ERROR,
            entity: "Auth",
            description: "Erreur lors de la vérification du statut du mot de passe",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.checkPasswordChangeRequired = checkPasswordChangeRequired;
/**
 * @function getStatusCodeFromErrorCode
 * @description Map les codes d'erreur vers les status HTTP appropriés
 * @param {string} errorCode - Code d'erreur
 * @returns {number} Status HTTP
 */
const getStatusCodeFromErrorCode = (errorCode) => {
    const statusMap = {
        MISSING_CREDENTIALS: 400,
        INVALID_EMAIL_FORMAT: 400,
        INVALID_CREDENTIALS: 401,
        ACCOUNT_DISABLED: 403,
        ACCOUNT_LOCKED: 423,
        EMAIL_ALREADY_EXISTS: 400,
        INVALID_TOKEN: 401,
        TOKEN_EXPIRED: 401,
        PASSWORD_TOO_SHORT: 400,
        USER_NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        MISSING_EMAIL: 400,
        INTERNAL_ERROR: 500,
    };
    return statusMap[errorCode] || 400;
};
/**
 * @function getAuthActionFromErrorCode
 * @description Map les codes d'erreur vers les actions d'audit
 * @param {string} errorCode - Code d'erreur
 * @returns {AuthActionTypes} Action d'audit
 */
const getAuthActionFromErrorCode = (errorCode) => {
    const actionMap = {
        ACCOUNT_LOCKED: authTypes_1.AuthActionTypes.ACCOUNT_LOCKED,
        INVALID_CREDENTIALS: authTypes_1.AuthActionTypes.LOGIN_FAILED,
        ACCOUNT_DISABLED: authTypes_1.AuthActionTypes.LOGIN_FAILED,
    };
    return actionMap[errorCode] || authTypes_1.AuthActionTypes.LOGIN_ERROR;
};
//# sourceMappingURL=authController.js.map