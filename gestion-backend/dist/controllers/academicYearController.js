"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcademicYearById = exports.getAcademicYearStatus = exports.setCurrentYear = exports.checkYearExists = exports.getAvailableYears = exports.createFutureYears = exports.syncAcademicYears = exports.initializeBaseYears = exports.checkAcademicYear = exports.createAcademicYear = exports.getCurrentYear = exports.getAcademicYears = void 0;
const academicYearService_1 = require("../services/academicYearService");
const prisma_1 = __importDefault(require("../prisma"));
// Récupérer toutes les années académiques
const getAcademicYears = async (req, res) => {
    try {
        const academicYears = await (0, academicYearService_1.getAllAcademicYears)();
        res.json(academicYears);
    }
    catch (error) {
        console.error("Erreur getAcademicYears:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.getAcademicYears = getAcademicYears;
// Récupérer l'année académique courante
const getCurrentYear = async (req, res) => {
    try {
        const currentYear = await (0, academicYearService_1.getCurrentAcademicYear)();
        res.json(currentYear);
    }
    catch (error) {
        console.error("Erreur getCurrentYear:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.getCurrentYear = getCurrentYear;
// Créer une nouvelle année académique (via Postman)
const createAcademicYear = async (req, res) => {
    try {
        const { year, startDate, endDate, isCurrent } = req.body;
        if (!year || !startDate || !endDate) {
            return res.status(400).json({
                message: "Les champs year, startDate et endDate sont obligatoires",
            });
        }
        // Vérifier si l'année existe déjà
        const existingYear = await (0, academicYearService_1.academicYearExists)(year);
        if (existingYear) {
            return res.status(400).json({
                message: `L'année académique ${year} existe déjà`,
            });
        }
        const newYear = await prisma_1.default.academicYear.create({
            data: {
                year,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isCurrent: isCurrent ?? false,
            },
        });
        // Si c'est l'année courante, mettre à jour les autres
        if (isCurrent) {
            await (0, academicYearService_1.updateCurrentAcademicYear)();
        }
        res.status(201).json(newYear);
    }
    catch (error) {
        console.error("Erreur createAcademicYear:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.createAcademicYear = createAcademicYear;
// Vérifier si une nouvelle année académique doit être créée
const checkAcademicYear = async (req, res) => {
    try {
        const needNewYear = (0, academicYearService_1.shouldCreateNewAcademicYear)();
        if (needNewYear) {
            await (0, academicYearService_1.autoCreateNextAcademicYear)();
            await (0, academicYearService_1.updateCurrentAcademicYear)();
        }
        const currentYear = await (0, academicYearService_1.getCurrentAcademicYear)();
        res.json({
            shouldCreate: needNewYear,
            currentYear,
            message: needNewYear
                ? "Nouvelle année créée automatiquement"
                : "Aucune action nécessaire",
        });
    }
    catch (error) {
        console.error("Erreur checkAcademicYear:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.checkAcademicYear = checkAcademicYear;
// NOUVEAU : Initialiser les années de base (2020-2021 à 2025-2026)
const initializeBaseYears = async (req, res) => {
    try {
        console.log("🔄 Initialisation des années de base demandée...");
        await (0, academicYearService_1.initializeBaseAcademicYears)();
        const years = await (0, academicYearService_1.getAllAcademicYears)();
        res.json({
            message: "Années académiques de base initialisées avec succès",
            years: years,
            total: years.length,
        });
    }
    catch (error) {
        console.error("Erreur initializeBaseYears:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.initializeBaseYears = initializeBaseYears;
// NOUVEAU : Synchronisation complète des années académiques
const syncAcademicYears = async (req, res) => {
    try {
        console.log("🔄 Synchronisation complète des années académiques...");
        await (0, academicYearService_1.ensureAcademicYearsExist)();
        await (0, academicYearService_1.updateCurrentAcademicYear)();
        const years = await (0, academicYearService_1.getAllAcademicYears)();
        const currentYear = await (0, academicYearService_1.getCurrentAcademicYear)();
        res.json({
            message: "Synchronisation des années académiques terminée",
            currentYear: currentYear?.year,
            totalYears: years.length,
            years: years,
        });
    }
    catch (error) {
        console.error("Erreur syncAcademicYears:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.syncAcademicYears = syncAcademicYears;
// NOUVEAU : Forcer la création d'années futures
const createFutureYears = async (req, res) => {
    try {
        const { yearsAhead = 2 } = req.body;
        console.log(`🔮 Création des ${yearsAhead} prochaines années...`);
        await (0, academicYearService_1.ensureFutureAcademicYears)(yearsAhead);
        const years = await (0, academicYearService_1.getAllAcademicYears)();
        res.json({
            message: `Création de ${yearsAhead} années futures terminée`,
            years: years,
            total: years.length,
        });
    }
    catch (error) {
        console.error("Erreur createFutureYears:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.createFutureYears = createFutureYears;
// NOUVEAU : Obtenir les années disponibles pour les inscriptions
const getAvailableYears = async (req, res) => {
    try {
        const availableYears = await (0, academicYearService_1.getAvailableAcademicYears)();
        res.json({
            years: availableYears,
            total: availableYears.length,
        });
    }
    catch (error) {
        console.error("Erreur getAvailableYears:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.getAvailableYears = getAvailableYears;
// NOUVEAU : Vérifier si une année académique existe
const checkYearExists = async (req, res) => {
    try {
        const { year } = req.params;
        if (!year) {
            return res.status(400).json({
                message: "Le paramètre year est requis",
            });
        }
        const exists = await (0, academicYearService_1.academicYearExists)(year);
        let yearDetails = null;
        if (exists) {
            yearDetails = await prisma_1.default.academicYear.findUnique({
                where: { year },
            });
        }
        res.json({
            year,
            exists,
            details: yearDetails,
        });
    }
    catch (error) {
        console.error("Erreur checkYearExists:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.checkYearExists = checkYearExists;
// NOUVEAU : Mettre à jour l'année courante manuellement
const setCurrentYear = async (req, res) => {
    try {
        const { year } = req.body;
        if (!year) {
            return res.status(400).json({
                message: "Le champ year est requis",
            });
        }
        // Vérifier si l'année existe
        const yearExists = await (0, academicYearService_1.academicYearExists)(year);
        if (!yearExists) {
            return res.status(404).json({
                message: `L'année académique ${year} n'existe pas`,
            });
        }
        // Désactiver toutes les années
        await prisma_1.default.academicYear.updateMany({
            data: { isCurrent: false },
        });
        // Activer l'année spécifiée
        const updatedYear = await prisma_1.default.academicYear.update({
            where: { year },
            data: { isCurrent: true },
        });
        res.json({
            message: `Année courante définie sur ${year}`,
            currentYear: updatedYear,
        });
    }
    catch (error) {
        console.error("Erreur setCurrentYear:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.setCurrentYear = setCurrentYear;
// NOUVEAU : Statut du système d'années académiques
const getAcademicYearStatus = async (req, res) => {
    try {
        const currentYear = await (0, academicYearService_1.getCurrentAcademicYear)();
        const allYears = await (0, academicYearService_1.getAllAcademicYears)();
        const availableYears = await (0, academicYearService_1.getAvailableAcademicYears)();
        const shouldCreate = (0, academicYearService_1.shouldCreateNewAcademicYear)();
        res.json({
            status: "ok",
            currentYear: currentYear,
            shouldCreateNewYear: shouldCreate,
            statistics: {
                totalYears: allYears.length,
                availableForEnrollment: availableYears.length,
                yearsRange: allYears.length > 0
                    ? `${allYears[allYears.length - 1].year} - ${allYears[0].year}`
                    : "Aucune année",
            },
            years: allYears,
        });
    }
    catch (error) {
        console.error("Erreur getAcademicYearStatus:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.getAcademicYearStatus = getAcademicYearStatus;
const getAcademicYearById = async (req, res) => {
    try {
        const { id } = req.params;
        const academicYear = await prisma_1.default.academicYear.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentCode: true,
                            },
                        },
                    },
                },
            },
        });
        if (!academicYear) {
            return res.status(404).json({
                error: "Année académique non trouvée",
            });
        }
        res.json(academicYear);
    }
    catch (error) {
        console.error("❌ Erreur récupération année académique:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getAcademicYearById = getAcademicYearById;
//# sourceMappingURL=academicYearController.js.map