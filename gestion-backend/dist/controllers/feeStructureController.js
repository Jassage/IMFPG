"use strict";
/**
 * @file feeStructureController.ts
 * @description Contrôleur pour la gestion des structures de frais scolaires
 * @module Controllers/FeeStructures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeeStructureStats = exports.searchFeeStructures = exports.toggleFeeStructureStatus = exports.getAcademicYearsWithFees = exports.getFeeStructuresByAcademicYearId = exports.getFeeStructureByAcademicYear = exports.forceDeleteFeeStructure = exports.deleteFeeStructure = exports.updateFeeStructure = exports.createFeeStructure = exports.getFeeStructureById = exports.getAllFeeStructures = void 0;
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const feeStructureService_1 = require("../services/feeStructureService");
const feeStructureService = new feeStructureService_1.FeeStructureService();
/**
 * @function getAllFeeStructures
 * @description Récupère la liste paginée et filtrée des structures de frais
 */
const getAllFeeStructures = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            academicYear: req.query.academicYear,
            isActive: req.query.isActive === "true"
                ? true
                : req.query.isActive === "false"
                    ? false
                    : undefined,
            search: req.query.search,
        };
        const result = await feeStructureService.getAllFeeStructures(filters);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_LIST_REQUEST",
            entity: "FeeStructure",
            description: "Liste des structures de frais récupérée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération structures de frais:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_LIST_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération des structures de frais",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération des structures de frais",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getAllFeeStructures = getAllFeeStructures;
/**
 * @function getFeeStructureById
 * @description Récupère une structure de frais par son ID avec ses détails
 */
const getFeeStructureById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await feeStructureService.getFeeStructureById(id);
        if (!result.success) {
            const statusCode = result.error === "NOT_FOUND" ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_DETAILS_REQUEST",
            entity: "FeeStructure",
            entityId: id,
            description: "Détails de la structure de frais récupérés",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération structure de frais:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_DETAILS_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération de la structure",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération de la structure",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getFeeStructureById = getFeeStructureById;
/**
 * @function createFeeStructure
 * @description Crée une nouvelle structure de frais
 */
const createFeeStructure = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const data = {
            name: req.body.name,
            academicYear: req.body.academicYear,
            amount: req.body.amount,
            description: req.body.description,
            isActive: req.body.isActive,
        };
        console.log("📥 Données reçues pour création:", req.body);
        const result = await feeStructureService.createFeeStructure(data);
        if (!result.success) {
            const statusCode = result.error === "VALIDATION_ERROR"
                ? 400
                : result.error === "DUPLICATE_ERROR"
                    ? 409
                    : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_CREATED",
            entity: "FeeStructure",
            entityId: result.data?.feeStructure?.id,
            description: `Structure de frais "${data.name}" créée`,
            status: "SUCCESS",
            metadata: {
                name: data.name,
                academicYear: data.academicYear,
                amount: data.amount,
            },
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ Erreur création structure de frais:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_CREATION_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la création de la structure",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la création",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.createFeeStructure = createFeeStructure;
/**
 * @function updateFeeStructure
 * @description Met à jour une structure de frais existante
 */
const updateFeeStructure = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const data = {
            name: req.body.name,
            academicYear: req.body.academicYear,
            amount: req.body.amount,
            description: req.body.description,
            isActive: req.body.isActive,
        };
        console.log("📥 Mise à jour structure:", { id, data: req.body });
        const result = await feeStructureService.updateFeeStructure(id, data);
        if (!result.success) {
            const statusCode = result.error === "NOT_FOUND"
                ? 404
                : result.error === "VALIDATION_ERROR"
                    ? 400
                    : result.error === "DUPLICATE_ERROR"
                        ? 409
                        : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_UPDATED",
            entity: "FeeStructure",
            entityId: id,
            description: "Structure de frais mise à jour",
            status: "SUCCESS",
            metadata: {
                updatedFields: Object.keys(data).filter((key) => data[key] !== undefined),
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur mise à jour structure:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_UPDATE_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la mise à jour de la structure",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la mise à jour",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.updateFeeStructure = updateFeeStructure;
/**
 * @function deleteFeeStructure
 * @description Supprime une structure de frais (soft delete logique)
 */
const deleteFeeStructure = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        console.log("🗑️ Tentative suppression structure frais:", id);
        const result = await feeStructureService.deleteFeeStructure(id);
        if (!result.success) {
            const statusCode = result.error === "NOT_FOUND"
                ? 404
                : result.error === "HAS_DEPENDENCIES"
                    ? 400
                    : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_DELETED",
            entity: "FeeStructure",
            entityId: id,
            description: "Structure de frais désactivée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur suppression structure:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_DELETION_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la suppression de la structure",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la suppression",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.deleteFeeStructure = deleteFeeStructure;
/**
 * @function forceDeleteFeeStructure
 * @description Suppression forcée avec cascade
 */
const forceDeleteFeeStructure = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        console.log("💥 Suppression forcée structure frais:", id);
        const result = await feeStructureService.forceDeleteFeeStructure(id);
        if (!result.success) {
            const statusCode = result.error === "NOT_FOUND"
                ? 404
                : result.error === "HAS_DEPENDENCIES"
                    ? 400
                    : 400;
            res.status(statusCode).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_FORCE_DELETED",
            entity: "FeeStructure",
            entityId: id,
            description: "Structure de frais supprimée avec cascade",
            status: "SUCCESS",
            metadata: {
                forceDelete: true,
                cascade: true,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur suppression forcée:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_FORCE_DELETION_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la suppression forcée",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la suppression forcée",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.forceDeleteFeeStructure = forceDeleteFeeStructure;
/**
 * @function getFeeStructureByAcademicYear
 * @description Récupère la structure de frais active par année académique
 */
const getFeeStructureByAcademicYear = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { academicYear } = req.params;
        const result = await feeStructureService.getFeeStructureByAcademicYear(academicYear);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_BY_YEAR_REQUEST",
            entity: "FeeStructure",
            description: `Structure de frais pour l'année ${academicYear} récupérée`,
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par année:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_BY_YEAR_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération par année",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération par année",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getFeeStructureByAcademicYear = getFeeStructureByAcademicYear;
/**
 * @function getFeeStructuresByAcademicYearId
 * @description Récupère les structures de frais par ID d'année académique
 */
const getFeeStructuresByAcademicYearId = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { academicYearId } = req.params;
        const result = await feeStructureService.getFeeStructuresByAcademicYearId(academicYearId);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_BY_YEAR_ID_REQUEST",
            entity: "FeeStructure",
            description: "Structures de frais par ID d'année récupérées",
            status: "SUCCESS",
            metadata: { academicYearId },
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par ID année:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_BY_YEAR_ID_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération par ID d'année",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getFeeStructuresByAcademicYearId = getFeeStructuresByAcademicYearId;
/**
 * @function getAcademicYearsWithFees
 * @description Récupère toutes les années académiques avec leurs structures de frais
 */
const getAcademicYearsWithFees = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await feeStructureService.getAcademicYearsWithFees();
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ACADEMIC_YEARS_WITH_FEES_REQUEST",
            entity: "FeeStructure",
            description: "Années académiques avec frais récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération années avec frais:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "ACADEMIC_YEARS_WITH_FEES_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération des années",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération des années",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getAcademicYearsWithFees = getAcademicYearsWithFees;
/**
 * @function toggleFeeStructureStatus
 * @description Active ou désactive une structure de frais
 */
const toggleFeeStructureStatus = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const result = await feeStructureService.toggleFeeStructureStatus(id);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_STATUS_TOGGLED",
            entity: "FeeStructure",
            entityId: id,
            description: `Statut de la structure de frais ${result.data?.newStatus ? "activé" : "désactivé"}`,
            status: "SUCCESS",
            metadata: {
                previousStatus: result.data?.previousStatus,
                newStatus: result.data?.newStatus,
            },
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur changement statut structure:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURE_STATUS_TOGGLE_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors du changement de statut",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors du changement de statut",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.toggleFeeStructureStatus = toggleFeeStructureStatus;
/**
 * @function searchFeeStructures
 * @description Recherche avancée dans les structures de frais
 */
const searchFeeStructures = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const filters = {
            academicYear: req.query.academicYear,
            isActive: req.query.isActive === "true"
                ? true
                : req.query.isActive === "false"
                    ? false
                    : undefined,
            search: req.query.search,
        };
        const result = await feeStructureService.searchFeeStructures(filters);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_SEARCH",
            entity: "FeeStructure",
            description: "Recherche dans les structures de frais effectuée",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur recherche structures:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_SEARCH_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la recherche",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la recherche",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.searchFeeStructures = searchFeeStructures;
/**
 * @function getFeeStructureStats
 * @description Récupère les statistiques des structures de frais
 */
const getFeeStructureStats = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await feeStructureService.getFeeStructureStats();
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_STATS_REQUEST",
            entity: "FeeStructure",
            description: "Statistiques des structures de frais récupérées",
            status: "SUCCESS",
        });
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur récupération statistiques:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FEE_STRUCTURES_STATS_ERROR",
            entity: "FeeStructure",
            description: "Erreur lors de la récupération des statistiques",
            status: "ERROR",
            errorMessage: error.message,
        });
        const response = {
            success: false,
            message: "Erreur serveur lors de la récupération des statistiques",
            error: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        };
        res.status(500).json(response);
    }
};
exports.getFeeStructureStats = getFeeStructureStats;
//# sourceMappingURL=feeStructureController.js.map