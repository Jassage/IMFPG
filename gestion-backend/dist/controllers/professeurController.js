"use strict";
/**
 * @file professeurController.ts
 * @description Contrôleurs pour la gestion des professeurs
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachUserFromProfesseur = exports.attachUserToProfesseur = exports.createProfesseur = exports.getProfesseurFullDetails = exports.deactivateProfesseur = exports.activateProfesseur = exports.getProfesseurSchedule = exports.deleteProfesseur = exports.updateProfesseur = exports.getProfesseurById = exports.getProfesseurs = void 0;
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const professeurService = __importStar(require("../services/professeurService"));
/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
 */
const getProfesseurs = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 20,
            search: req.query.search,
            status: req.query.status,
            speciality: req.query.speciality,
            sortBy: req.query.sortBy || "lastName",
            sortOrder: req.query.sortOrder || "asc",
        };
        const result = await professeurService.getProfesseursService(filters);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEURS_LIST_REQUEST",
            entity: "Professeur",
            description: "Liste des professeurs récupérée",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Professeurs récupérés avec succès",
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - getProfesseurs error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEURS_LIST_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la récupération des professeurs",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getProfesseurs = getProfesseurs;
/**
 * @desc Récupère un professeur par ID
 */
const getProfesseurById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const professeur = await professeurService.getProfesseurByIdService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DETAILS_REQUEST",
            entity: "Professeur",
            entityId: id,
            description: "Détails du professeur récupérés",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Professeur récupéré avec succès",
            data: { professeur },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - getProfesseurById error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DETAILS_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la récupération du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getProfesseurById = getProfesseurById;
/**
 * @desc Met à jour un professeur
 */
const updateProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const updateData = req.body;
        const professeur = await professeurService.updateProfesseurService(id, updateData);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_UPDATED",
            entity: "Professeur",
            entityId: id,
            description: `Professeur "${professeur.firstName} ${professeur.lastName}" mis à jour`,
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Professeur mis à jour avec succès",
            data: { professeur },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - updateProfesseur error:", error);
        // Gérer les erreurs spécifiques
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        if (error.message === "PROFESSEUR_EMAIL_EXISTS") {
            const response = {
                success: false,
                message: "Un autre professeur utilise déjà cet email",
                code: "PROFESSEUR_EMAIL_EXISTS",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "USER_NOT_FOUND") {
            const response = {
                success: false,
                message: "L'utilisateur associé n'existe pas",
                code: "USER_NOT_FOUND",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "USER_ALREADY_ASSOCIATED") {
            const response = {
                success: false,
                message: "Cet utilisateur est déjà associé à un autre professeur",
                code: "USER_ALREADY_ASSOCIATED",
            };
            res.status(400).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_UPDATE_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la mise à jour du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.updateProfesseur = updateProfesseur;
/**
 * @desc Supprime un professeur
 */
const deleteProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await professeurService.deleteProfesseurService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DELETED",
            entity: "Professeur",
            entityId: id,
            description: `Professeur désactivé`,
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: result.message,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - deleteProfesseur error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        if (error.message === "PROFESSEUR_HAS_DEPENDENCIES") {
            const response = {
                success: false,
                message: "Ce professeur ne peut pas être supprimé car il est assigné à des classes ou matières",
                code: "PROFESSEUR_HAS_DEPENDENCIES",
            };
            res.status(400).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DELETION_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la suppression du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.deleteProfesseur = deleteProfesseur;
/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
const getProfesseurSchedule = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const { weekStart } = req.query;
        const result = await professeurService.getProfesseurScheduleService(id, weekStart);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_SCHEDULE_REQUEST",
            entity: "Professeur",
            entityId: id,
            description: "Emploi du temps du professeur récupéré",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Emploi du temps récupéré avec succès",
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - getProfesseurSchedule error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_SCHEDULE_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la récupération de l'emploi du temps",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getProfesseurSchedule = getProfesseurSchedule;
/**
 * @desc Active un professeur
 */
const activateProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const professeur = await professeurService.activateProfesseurService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_ACTIVATED",
            entity: "Professeur",
            entityId: id,
            description: `Professeur "${professeur.firstName} ${professeur.lastName}" activé`,
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Professeur activé avec succès",
            data: { professeur },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - activateProfesseur error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_ACTIVATION_ERROR",
            entity: "Professeur",
            description: "Erreur lors de l'activation du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.activateProfesseur = activateProfesseur;
/**
 * @desc Désactive un professeur
 */
const deactivateProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const professeur = await professeurService.deactivateProfesseurService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DEACTIVATED",
            entity: "Professeur",
            entityId: id,
            description: `Professeur "${professeur.firstName} ${professeur.lastName}" désactivé`,
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Professeur désactivé avec succès",
            data: { professeur },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - deactivateProfesseur error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_DEACTIVATION_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la désactivation du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.deactivateProfesseur = deactivateProfesseur;
/**
 * @desc Récupère les détails complets d'un professeur
 */
const getProfesseurFullDetails = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await professeurService.getProfesseurFullDetailsService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_FULL_DETAILS_REQUEST",
            entity: "Professeur",
            entityId: id,
            description: "Détails complets du professeur récupérés",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Détails complets récupérés avec succès",
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - getProfesseurFullDetails error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_FULL_DETAILS_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la récupération des détails",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getProfesseurFullDetails = getProfesseurFullDetails;
/**
 * @desc Crée un nouveau professeur avec option de création de compte utilisateur et envoi d'identifiants
 */
const createProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    const requestId = `req-${Date.now()}`;
    try {
        const data = req.body;
        console.log(`[${requestId}] 📥 Requête création professeur:`, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            createUserAccount: data.createUserAccount,
            sendInvitation: data.sendInvitation,
        });
        // Appeler le service - IMPORTANT: Le service retourne directement l'objet
        const result = await professeurService.createProfesseurService({
            ...data,
            createUserAccount: data.createUserAccount !== false, // true par défaut
            sendInvitation: data.sendInvitation !== false, // true par défaut
        });
        console.log(`[${requestId}] ✅ Service retourné:`, {
            professeurId: result.professeur?.id,
            userAccountCreated: result.userAccountCreated,
            emailSent: result.emailSent,
        });
        // Extraire les données du résultat
        const professeur = result.professeur;
        const userAccountCreated = result.userAccountCreated || false;
        const emailSent = result.emailSent || false;
        const temporaryPassword = result.temporaryPassword;
        // Construire le message en fonction du résultat
        let message = "Professeur créé avec succès";
        if (userAccountCreated) {
            if (emailSent) {
                message =
                    "Professeur créé avec succès. Les identifiants ont été envoyés par email.";
            }
            else {
                message =
                    "Professeur créé avec succès. IMPORTANT : Les identifiants n'ont pas pu être envoyés par email.";
            }
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_CREATED",
            entity: "Professeur",
            entityId: professeur?.id,
            description: `Professeur "${professeur?.firstName} ${professeur?.lastName}" créé`,
            status: "SUCCESS",
            metadata: {
                email: professeur?.email,
                speciality: professeur?.speciality,
                userAccountCreated,
                emailSent,
                hasUserAccount: !!professeur?.userId,
            },
        });
        // Construire la réponse
        const responseData = {
            professeur,
            userAccountCreated,
            emailSent,
        };
        // Ajouter le mot de passe temporaire seulement si nécessaire
        if (temporaryPassword && !emailSent) {
            responseData.temporaryPassword = temporaryPassword;
            responseData.warning =
                "Veuillez communiquer manuellement ce mot de passe au professeur";
        }
        const response = {
            success: true,
            message,
            data: responseData,
        };
        console.log(`[${requestId}] 📤 Réponse envoyée:`, {
            status: 201,
            professeurId: professeur?.id,
        });
        res.status(201).json(response);
    }
    catch (error) {
        console.error(`[${requestId}] ❌ Erreur contrôleur:`, error);
        // Gérer les erreurs spécifiques
        if (error.message === "PROFESSEUR_EMAIL_EXISTS") {
            const response = {
                success: false,
                message: "Un professeur avec cet email existe déjà",
                code: "PROFESSEUR_EMAIL_EXISTS",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "USER_NOT_FOUND") {
            const response = {
                success: false,
                message: "L'utilisateur associé n'existe pas",
                code: "USER_NOT_FOUND",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "USER_ALREADY_PROFESSEUR") {
            const response = {
                success: false,
                message: "Cet utilisateur est déjà associé à un professeur",
                code: "USER_ALREADY_PROFESSEUR",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "EMAIL_SEND_FAILED") {
            // Échec d'envoi d'email mais création réussie
            const response = {
                success: true, // Succès partiel
                message: "Professeur créé mais l'envoi d'email a échoué",
                code: "EMAIL_SEND_FAILED",
                warning: "Veuillez communiquer manuellement les identifiants au professeur",
            };
            res.status(201).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_CREATION_ERROR",
            entity: "Professeur",
            description: "Erreur lors de la création du professeur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.createProfesseur = createProfesseur;
/**
 * @desc Associe un compte utilisateur à un professeur existant avec envoi d'identifiants
 */
const attachUserToProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const options = req.body;
        const result = await professeurService.attachUserToProfesseurService(id, {
            ...options,
            sendCredentialsEmail: options.sendCredentialsEmail !== false,
        });
        // Construire le message en fonction du résultat
        let message = "Compte utilisateur associé avec succès";
        if (result.userAccountCreated) {
            if (result.emailSent) {
                message = "Compte utilisateur créé et identifiants envoyés par email";
            }
            else {
                message = "Compte utilisateur créé mais l'envoi d'email a échoué";
            }
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: result.userAccountCreated
                ? "PROFESSEUR_USER_ACCOUNT_CREATED"
                : "PROFESSEUR_USER_ATTACHED",
            entity: "Professeur",
            entityId: id,
            description: result.userAccountCreated
                ? `Compte utilisateur créé et associé au professeur ${result.professeur.firstName} ${result.professeur.lastName}`
                : `Compte utilisateur associé au professeur ${result.professeur.firstName} ${result.professeur.lastName}`,
            status: "SUCCESS",
            metadata: {
                userId: result.professeur.userId,
                userEmail: result.professeur.user?.email,
                userCreated: result.userAccountCreated,
                emailSent: result.emailSent,
            },
        });
        const response = {
            success: true,
            message,
            data: {
                professeur: result.professeur,
                userAccountCreated: result.userAccountCreated,
                emailSent: result.emailSent,
                // Ne pas envoyer le mot de passe dans la réponse sauf en cas d'erreur d'email
                ...(result.temporaryPassword &&
                    !result.emailSent && {
                    temporaryPassword: result.temporaryPassword,
                    warning: "Veuillez communiquer manuellement ce mot de passe au professeur",
                }),
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - attachUserToProfesseur error:", error);
        // Gérer les erreurs spécifiques
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        if (error.message === "USER_NOT_FOUND") {
            const response = {
                success: false,
                message: "Aucun utilisateur trouvé avec cet email",
                code: "USER_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        if (error.message === "USER_ALREADY_ASSOCIATED") {
            const response = {
                success: false,
                message: "Cet utilisateur est déjà associé à un autre professeur",
                code: "USER_ALREADY_ASSOCIATED",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "NO_USER_SPECIFIED") {
            const response = {
                success: false,
                message: "Aucun utilisateur spécifié",
                code: "NO_USER_SPECIFIED",
            };
            res.status(400).json(response);
            return;
        }
        if (error.message === "EMAIL_SEND_FAILED") {
            // Compte créé mais email échoué
            const response = {
                success: true, // Succès partiel
                message: "Compte utilisateur créé mais l'envoi d'email a échoué",
                code: "EMAIL_SEND_FAILED",
                data: {
                    warning: "Veuillez communiquer manuellement les identifiants au professeur",
                    manualCredentials: true,
                },
            };
            res.json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_USER_ATTACHMENT_ERROR",
            entity: "Professeur",
            description: "Erreur lors de l'association du compte utilisateur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.attachUserToProfesseur = attachUserToProfesseur;
/**
 * @desc Détache un compte utilisateur d'un professeur
 */
const detachUserFromProfesseur = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await professeurService.detachUserFromProfesseurService(id);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_USER_DETACHED",
            entity: "Professeur",
            entityId: id,
            description: `Compte utilisateur détaché du professeur ${result.professeur.firstName} ${result.professeur.lastName}`,
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Compte utilisateur détaché avec succès",
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" ProfesseurController - detachUserFromProfesseur error:", error);
        if (error.message === "PROFESSEUR_NOT_FOUND") {
            const response = {
                success: false,
                message: "Professeur non trouvé",
                code: "PROFESSEUR_NOT_FOUND",
            };
            res.status(404).json(response);
            return;
        }
        if (error.message === "NO_USER_ACCOUNT") {
            const response = {
                success: false,
                message: "Ce professeur n'a pas de compte utilisateur associé",
                code: "NO_USER_ACCOUNT",
            };
            res.status(400).json(response);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "PROFESSEUR_USER_DETACHMENT_ERROR",
            entity: "Professeur",
            description: "Erreur lors du détachement du compte utilisateur",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 200),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.detachUserFromProfesseur = detachUserFromProfesseur;
//# sourceMappingURL=professeurController.js.map