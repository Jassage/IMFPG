"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getResetPasswordPage = exports.verifyResetToken = exports.resetPassword = exports.forgotPassword = exports.verify = exports.getMe = exports.register = exports.verifyPassword = exports.login = exports.verifyToken = exports.loginLimiter = void 0;
const prisma_1 = require("../../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../services/emailService");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auditController_1 = require("./auditController");
const prisma = new prisma_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_super_securise_changez_moi";
// Rate limiting pour le login
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: {
        message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
        code: "RATE_LIMITED",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Validation robuste des emails
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
};
// Validation des rôles
const VALID_ROLES = [
    "Admin",
    "Professeur",
    "Secretaire",
    "Directeur",
    "Doyen",
];
const validateUserRole = (role) => {
    if (VALID_ROLES.includes(role)) {
        return role;
    }
    throw new Error(`Rôle invalide: "${role}". Rôles valides: ${VALID_ROLES.join(", ")}`);
};
// Fonction de vérification de token améliorée
const verifyToken = async (token) => {
    try {
        if (!token || token === "null" || token === "undefined") {
            throw new Error("Token manquant");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Vérifications supplémentaires
        if (!decoded.id || !decoded.email) {
            throw new Error("Token invalide: données manquantes");
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("Token expiré");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error("Token invalide");
        }
        throw new Error("Erreur de vérification du token");
    }
};
exports.verifyToken = verifyToken;
const login = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_ATTEMPT",
                entity: "Auth",
                description: "Tentative de connexion avec données manquantes",
                status: "ERROR",
                metadata: { missingFields: { email: !email, password: !password } },
            });
            return res.status(400).json({
                message: "Email et mot de passe requis",
                code: "MISSING_CREDENTIALS",
            });
        }
        // Nettoyer les données
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        if (!validateEmail(cleanEmail)) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_ATTEMPT",
                entity: "Auth",
                description: "Tentative de connexion avec email invalide",
                status: "ERROR",
                metadata: { email: cleanEmail },
            });
            return res.status(400).json({
                message: "Format d'email invalide",
                code: "INVALID_EMAIL_FORMAT",
            });
        }
        // Récupérer l'utilisateur AVEC ses LoginAttempts
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: {
                loginattempt: {
                    orderBy: {
                        attemptTime: "desc",
                    },
                    take: 1,
                },
            },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_ATTEMPT",
                entity: "Auth",
                description: "Tentative de connexion avec utilisateur inexistant",
                status: "ERROR",
                metadata: { email: cleanEmail },
            });
            return res.status(401).json({
                message: "Email ou mot de passe incorrect",
                code: "INVALID_CREDENTIALS",
            });
        }
        // VÉRIFICATION 1: Statut du compte
        if (user.status !== "Actif") {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_ATTEMPT",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Tentative de connexion avec compte désactivé",
                status: "ERROR",
                metadata: { status: user.status },
            });
            return res.status(403).json({
                message: "Votre compte est désactivé. Contactez l'administrateur.",
                code: "ACCOUNT_DISABLED",
            });
        }
        // VÉRIFICATION 2: Verrouillage du compte
        const latestAttempt = user.loginattempt[0];
        const currentFailedAttempts = latestAttempt?.failedAttempts || 0;
        const maxAttempts = 5;
        const lockTime = 30 * 60 * 1000; // 30 minutes
        if (latestAttempt && currentFailedAttempts >= maxAttempts) {
            const timeSinceLock = Date.now() - latestAttempt.attemptTime.getTime();
            if (timeSinceLock < lockTime) {
                const remainingMinutes = Math.ceil((lockTime - timeSinceLock) / 60000);
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "LOGIN_ATTEMPT",
                    entity: "User",
                    entityId: user.id,
                    userId: user.id,
                    description: "Tentative de connexion avec compte verrouillé",
                    status: "ERROR",
                    metadata: {
                        remainingMinutes,
                        currentFailedAttempts,
                    },
                });
                return res.status(423).json({
                    message: `Trop de tentatives échouées. Compte verrouillé pour ${remainingMinutes} minute(s).`,
                    code: "ACCOUNT_LOCKED",
                    remainingTime: remainingMinutes,
                    lockUntil: new Date(Date.now() + (lockTime - timeSinceLock)),
                });
            }
            else {
                // Réinitialiser les tentatives si le verrouillage a expiré
                await prisma.loginAttempt.delete({
                    where: { id: latestAttempt.id },
                });
            }
        }
        // Vérification du mot de passe
        if (!user.password) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_ATTEMPT",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Tentative de connexion - mot de passe non configuré",
                status: "ERROR",
            });
            return res.status(401).json({
                message: "Email ou mot de passe incorrect",
                code: "INVALID_CREDENTIALS",
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(cleanPassword, user.password);
        if (!isPasswordValid) {
            const newFailedAttempts = currentFailedAttempts + 1;
            // Gérer les tentatives échouées
            if (newFailedAttempts >= maxAttempts) {
                if (latestAttempt) {
                    await prisma.loginAttempt.update({
                        where: { id: latestAttempt.id },
                        data: {
                            failedAttempts: newFailedAttempts,
                            attemptTime: new Date(),
                            ipAddress: req.ip || "unknown",
                        },
                    });
                }
                else {
                    await prisma.loginAttempt.create({
                        data: {
                            userId: user.id,
                            failedAttempts: newFailedAttempts,
                            attemptTime: new Date(),
                            ipAddress: req.ip || "unknown",
                        },
                    });
                }
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "ACCOUNT_LOCKED",
                    entity: "User",
                    entityId: user.id,
                    userId: user.id,
                    description: "Compte verrouillé après trop de tentatives échouées",
                    status: "ERROR",
                    metadata: {
                        failedAttempts: newFailedAttempts,
                        lockDuration: "30 minutes",
                    },
                });
                return res.status(423).json({
                    message: "Trop de tentatives échouées. Compte verrouillé pendant 30 minutes.",
                    code: "ACCOUNT_LOCKED",
                    lockUntil: new Date(Date.now() + lockTime),
                });
            }
            // Mettre à jour les tentatives échouées
            if (latestAttempt) {
                await prisma.loginAttempt.update({
                    where: { id: latestAttempt.id },
                    data: {
                        failedAttempts: newFailedAttempts,
                        attemptTime: new Date(),
                        ipAddress: req.ip || "unknown",
                    },
                });
            }
            else {
                await prisma.loginAttempt.create({
                    data: {
                        userId: user.id,
                        failedAttempts: newFailedAttempts,
                        attemptTime: new Date(),
                        ipAddress: req.ip || "unknown",
                    },
                });
            }
            const remainingAttempts = maxAttempts - newFailedAttempts;
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "LOGIN_FAILED",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Tentative de connexion échouée - mot de passe incorrect",
                status: "ERROR",
                metadata: {
                    failedAttempts: newFailedAttempts,
                    remainingAttempts,
                },
            });
            return res.status(401).json({
                message: "Email ou mot de passe incorrect",
                code: "INVALID_CREDENTIALS",
                remainingAttempts: remainingAttempts,
                ...(remainingAttempts <= 3 && {
                    warning: `Il vous reste ${remainingAttempts} tentative(s)`,
                }),
            });
        }
        // CONNEXION RÉUSSIE - Nettoyer les tentatives
        if (latestAttempt) {
            await prisma.loginAttempt.delete({
                where: { id: latestAttempt.id },
            });
        }
        // Mettre à jour la dernière connexion
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
            },
        });
        // Générer le token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, JWT_SECRET, {
            expiresIn: "24h",
            issuer: "ujeph-auth",
            audience: "ujeph-app",
        });
        // Log d'audit pour connexion réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "LOGIN_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Connexion réussie",
            status: "SUCCESS",
            metadata: {
                role: user.role,
                lastLogin: user.lastLogin,
            },
        });
        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin,
            },
            expiresIn: "24h",
        });
    }
    catch (error) {
        console.error("❌ Erreur login:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "LOGIN_ERROR",
            entity: "Auth",
            description: "Erreur interne lors de la connexion",
            status: "ERROR",
            errorMessage: error.message,
        });
        res.status(500).json({
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
};
exports.login = login;
const verifyPassword = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { password } = req.body;
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token ||
            token === "Bearer" ||
            token === "null" ||
            token === "undefined") {
            return res.status(401).json({
                message: "Token d'authentification manquant ou invalide",
                code: "MISSING_TOKEN",
            });
        }
        if (!password ||
            typeof password !== "string" ||
            password.trim().length === 0) {
            return res.status(400).json({
                message: "Un mot de passe valide est requis",
                code: "PASSWORD_REQUIRED",
            });
        }
        const cleanPassword = password.trim();
        let decoded;
        try {
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET non configuré");
            }
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (jwtError) {
            console.error("❌ Erreur JWT:", jwtError);
            // ✅ CORRECTION: Gestion propre de l'erreur unknown
            const errorMessage = jwtError instanceof Error ? jwtError.message : "Erreur JWT inconnue";
            const errorName = jwtError instanceof Error ? jwtError.name : "UnknownError";
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "PASSWORD_VERIFICATION_ATTEMPT",
                entity: "Auth",
                description: "Token JWT invalide lors de la vérification de mot de passe",
                status: "ERROR",
                errorMessage: errorMessage,
                metadata: { errorType: errorName },
                userId: null,
            });
            return res.status(401).json({
                message: "Session expirée ou invalide",
                code: "INVALID_TOKEN",
                redirectTo: "/login",
            });
        }
        // ... reste du code inchangé ...
    }
    catch (error) {
        console.error("❌ Erreur vérification mot de passe:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PASSWORD_VERIFICATION_ERROR",
            entity: "Auth",
            description: "Erreur interne lors de la vérification de mot de passe",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({
            message: "Erreur interne du serveur lors de la vérification",
            code: "INTERNAL_ERROR",
        });
    }
};
exports.verifyPassword = verifyPassword;
const register = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { email, password, role, firstName, lastName, phone } = req.body;
        console.log("📨 Données reçues:", { email, role, firstName, lastName });
        // Validation des données requises
        if (!email || !password || !role || !firstName || !lastName) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "REGISTER_ATTEMPT",
                entity: "Auth",
                description: "Tentative d'inscription avec données manquantes",
                status: "ERROR",
                metadata: {
                    missingFields: {
                        email: !email,
                        password: !password,
                        role: !role,
                        firstName: !firstName,
                        lastName: !lastName,
                    },
                },
                userId: null,
            });
            return res.status(400).json({
                message: "Tous les champs obligatoires doivent être remplis",
                required: ["email", "password", "role", "firstName", "lastName"],
                received: {
                    email: !!email,
                    password: !!password,
                    role: !!role,
                    firstName: !!firstName,
                    lastName: !!lastName,
                },
            });
        }
        // Valider que le rôle est acceptable
        const validatedRole = validateUserRole(role);
        console.log("✅ Rôle validé:", validatedRole);
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "REGISTER_ATTEMPT",
                entity: "Auth",
                description: "Tentative d'inscription avec email déjà existant",
                status: "ERROR",
                metadata: { email },
                userId: null,
            });
            return res.status(400).json({
                message: "Un utilisateur avec cet email existe déjà",
            });
        }
        // Hasher le mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone: phone || null,
                role: validatedRole,
                password: hashedPassword,
                status: "Actif",
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
        console.log("✅ Utilisateur créé:", user.id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REGISTER_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Nouvel utilisateur créé avec succès",
            status: "SUCCESS",
            metadata: {
                role: validatedRole,
                hasPhone: !!phone,
            },
        });
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user,
        });
    }
    catch (error) {
        console.error("❌ Registration error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "REGISTER_ERROR",
            entity: "Auth",
            description: "Erreur lors de l'inscription",
            status: "ERROR",
            errorMessage: error.message,
            metadata: {
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            userId: null,
        });
        res.status(400).json({
            message: error.message,
            error: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
};
exports.register = register;
const getMe = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const userId = req.userId;
        if (!userId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_PROFILE_ATTEMPT",
                entity: "Auth",
                description: "Tentative d'accès au profil sans userId",
                status: "ERROR",
                userId: null,
            });
            return res.status(401).json({ message: "Non autorisé" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
                avatar: true,
            },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_PROFILE_ATTEMPT",
                entity: "User",
                description: "Utilisateur non trouvé lors de la récupération du profil",
                status: "ERROR",
                metadata: { userId },
                userId: null,
            });
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_PROFILE_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Profil utilisateur récupéré avec succès",
            status: "SUCCESS",
        });
        res.json(user);
    }
    catch (error) {
        console.error("Get me error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_PROFILE_ERROR",
            entity: "Auth",
            description: "Erreur lors de la récupération du profil",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.getMe = getMe;
const verify = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "TOKEN_VERIFICATION_ATTEMPT",
                entity: "Auth",
                description: "Tentative de vérification de token sans token",
                status: "ERROR",
                userId: null,
            });
            return res.status(401).json({ message: "Token manquant" });
        }
        const user = await (0, exports.verifyToken)(token);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "TOKEN_VERIFICATION_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Token vérifié avec succès",
            status: "SUCCESS",
        });
        res.json({ valid: true, user });
    }
    catch (error) {
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "TOKEN_VERIFICATION_FAILED",
            entity: "Auth",
            description: "Échec de la vérification du token",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(401).json({ valid: false, message: error.message });
    }
};
exports.verify = verify;
const forgotPassword = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { email } = req.body;
        if (!email) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FORGOT_PASSWORD_ATTEMPT",
                entity: "Auth",
                description: "Demande de réinitialisation de mot de passe sans email",
                status: "ERROR",
                userId: null,
            });
            return res.status(400).json({
                message: "Email requis",
            });
        }
        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FORGOT_PASSWORD_REQUEST",
                entity: "Auth",
                description: "Demande de réinitialisation de mot de passe pour email non trouvé",
                status: "SUCCESS",
                metadata: { email },
                userId: null,
            });
            return res.json({
                message: "Si l'email existe, un lien de réinitialisation a été envoyé",
            });
        }
        // Générer un token de réinitialisation
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure
        // Sauvegarder le token dans la base
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        // Générer le lien de réinitialisation
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // Envoyer l'email
        try {
            await (0, emailService_1.sendEmail)({
                to: email,
                subject: "Réinitialisation de votre mot de passe",
                html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour créer un nouveau mot de passe :</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
        `,
            });
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FORGOT_PASSWORD_REQUEST",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Demande de réinitialisation de mot de passe envoyée",
                status: "SUCCESS",
                metadata: { emailSent: true },
            });
        }
        catch (emailError) {
            console.error("Erreur envoi email:", emailError);
            const errorMessage = emailError instanceof Error
                ? emailError.message
                : "Erreur d'envoi d'email inconnue";
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FORGOT_PASSWORD_REQUEST",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Demande de réinitialisation - erreur envoi email",
                status: "ERROR",
                errorMessage: errorMessage,
                metadata: { emailSent: false },
            });
        }
        res.json({
            message: "Si l'email existe, un lien de réinitialisation a été envoyé",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FORGOT_PASSWORD_ERROR",
            entity: "Auth",
            description: "Erreur lors de la demande de réinitialisation de mot de passe",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "RESET_PASSWORD_ATTEMPT",
                entity: "Auth",
                description: "Tentative de réinitialisation de mot de passe avec données manquantes",
                status: "ERROR",
                metadata: { missing: { token: !token, password: !password } },
                userId: null,
            });
            return res.status(400).json({
                message: "Token et nouveau mot de passe requis",
            });
        }
        if (password.length < 6) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "RESET_PASSWORD_ATTEMPT",
                entity: "Auth",
                description: "Tentative de réinitialisation avec mot de passe trop court",
                status: "ERROR",
                metadata: { passwordLength: password.length },
                userId: null,
            });
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 6 caractères",
            });
        }
        // Trouver l'utilisateur avec un token valide
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Vérifier que le token n'a pas expiré
                },
            },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "RESET_PASSWORD_ATTEMPT",
                entity: "Auth",
                description: "Tentative de réinitialisation avec token invalide ou expiré",
                status: "ERROR",
                metadata: { token },
                userId: null,
            });
            return res.status(400).json({
                message: "Token invalide ou expiré",
            });
        }
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Mettre à jour le mot de passe et effacer le token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "RESET_PASSWORD_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Mot de passe réinitialisé avec succès",
            status: "SUCCESS",
        });
        res.json({
            message: "Mot de passe réinitialisé avec succès",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "RESET_PASSWORD_ERROR",
            entity: "Auth",
            description: "Erreur lors de la réinitialisation du mot de passe",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.resetPassword = resetPassword;
const verifyResetToken = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { token } = req.params;
        if (!token) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "VERIFY_RESET_TOKEN_ATTEMPT",
                entity: "Auth",
                description: "Tentative de vérification de token sans token",
                status: "ERROR",
                userId: null,
            });
            return res.status(400).json({
                message: "Token requis",
            });
        }
        // Vérifier la validité du token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "VERIFY_RESET_TOKEN_ATTEMPT",
                entity: "Auth",
                description: "Token de réinitialisation invalide ou expiré",
                status: "ERROR",
                metadata: { token },
                userId: null,
            });
            return res.status(400).json({
                valid: false,
                message: "Token invalide ou expiré",
            });
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "VERIFY_RESET_TOKEN_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Token de réinitialisation vérifié avec succès",
            status: "SUCCESS",
        });
        res.json({
            valid: true,
            message: "Token valide",
        });
    }
    catch (error) {
        console.error("Verify reset token error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "VERIFY_RESET_TOKEN_ERROR",
            entity: "Auth",
            description: "Erreur lors de la vérification du token de réinitialisation",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.verifyResetToken = verifyResetToken;
const getResetPasswordPage = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const { token } = req.params;
        if (!token) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_RESET_PAGE_ATTEMPT",
                entity: "Auth",
                description: "Tentative d'accès à la page de réinitialisation sans token",
                status: "ERROR",
                userId: null,
            });
            return res.status(400).json({
                message: "Token requis",
            });
        }
        // Vérifier la validité du token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                email: true,
                firstName: true,
            },
        });
        if (!user) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "GET_RESET_PAGE_ATTEMPT",
                entity: "Auth",
                description: "Token invalide pour accès à la page de réinitialisation",
                status: "ERROR",
                metadata: { token },
                userId: null,
            });
            return res.status(400).json({
                valid: false,
                message: "Token invalide ou expiré",
            });
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_RESET_PAGE_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Accès à la page de réinitialisation autorisé",
            status: "SUCCESS",
        });
        // Renvoyer les informations nécessaires pour la page frontend
        res.json({
            valid: true,
            message: "Token valide",
            email: user.email,
            firstName: user.firstName,
            token: token,
        });
    }
    catch (error) {
        console.error("Get reset password page error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_RESET_PAGE_ERROR",
            entity: "Auth",
            description: "Erreur lors de l'accès à la page de réinitialisation",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.getResetPasswordPage = getResetPasswordPage;
const updateProfile = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const userId = req.userId;
        const { firstName, lastName, phone } = req.body;
        if (!userId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "UPDATE_PROFILE_ATTEMPT",
                entity: "Auth",
                description: "Tentative de mise à jour de profil sans userId",
                status: "ERROR",
                userId: null,
            });
            return res.status(401).json({ message: "Non autorisé" });
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone !== undefined && { phone }),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
                avatar: true,
            },
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_PROFILE_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Profil utilisateur mis à jour avec succès",
            status: "SUCCESS",
            metadata: {
                updatedFields: {
                    firstName: !!firstName,
                    lastName: !!lastName,
                    phone: phone !== undefined,
                },
            },
        });
        res.json({
            message: "Profil mis à jour avec succès",
            user,
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_PROFILE_ERROR",
            entity: "Auth",
            description: "Erreur lors de la mise à jour du profil",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
    };
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        if (!userId) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CHANGE_PASSWORD_ATTEMPT",
                entity: "Auth",
                description: "Tentative de changement de mot de passe sans userId",
                status: "ERROR",
                userId: null,
            });
            return res.status(401).json({ message: "Non autorisé" });
        }
        if (!currentPassword || !newPassword) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CHANGE_PASSWORD_ATTEMPT",
                entity: "User",
                entityId: userId,
                userId: userId,
                description: "Tentative de changement de mot de passe avec données manquantes",
                status: "ERROR",
                metadata: {
                    missing: {
                        currentPassword: !currentPassword,
                        newPassword: !newPassword,
                    },
                },
            });
            return res.status(400).json({
                message: "Mot de passe actuel et nouveau mot de passe requis",
            });
        }
        if (newPassword.length < 6) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CHANGE_PASSWORD_ATTEMPT",
                entity: "User",
                entityId: userId,
                userId: userId,
                description: "Tentative de changement avec mot de passe trop court",
                status: "ERROR",
                metadata: { newPasswordLength: newPassword.length },
            });
            return res.status(400).json({
                message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
            });
        }
        // Récupérer l'utilisateur avec le mot de passe
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.password) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CHANGE_PASSWORD_ATTEMPT",
                entity: "User",
                description: "Utilisateur non trouvé lors du changement de mot de passe",
                status: "ERROR",
                metadata: { userId },
                userId: null,
            });
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        // Vérifier le mot de passe actuel
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CHANGE_PASSWORD_FAILED",
                entity: "User",
                entityId: user.id,
                userId: user.id,
                description: "Échec du changement de mot de passe - mot de passe actuel incorrect",
                status: "ERROR",
            });
            return res.status(400).json({
                message: "Mot de passe actuel incorrect",
            });
        }
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        // Mettre à jour le mot de passe
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CHANGE_PASSWORD_SUCCESS",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            description: "Mot de passe changé avec succès",
            status: "SUCCESS",
        });
        res.json({
            message: "Mot de passe modifié avec succès",
        });
    }
    catch (error) {
        console.error("Change password error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CHANGE_PASSWORD_ERROR",
            entity: "Auth",
            description: "Erreur lors du changement de mot de passe",
            status: "ERROR",
            errorMessage: error.message,
            userId: null,
        });
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.Controllers.js.map