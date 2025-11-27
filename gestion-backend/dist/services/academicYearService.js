"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicYearExists = exports.getAvailableAcademicYears = exports.getAllAcademicYears = exports.getCurrentAcademicYear = exports.autoCreateNextAcademicYear = exports.shouldCreateNewAcademicYear = exports.initializeAcademicYear = exports.updateCurrentAcademicYear = exports.ensureFutureAcademicYears = exports.ensureAcademicYearsExist = exports.initializeBaseAcademicYears = exports.getNextAcademicYear = exports.getAcademicYearDates = exports.getAcademicYearFromDate = void 0;
// src/services/academicYearService.ts
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Fonctions utilitaires
const getAcademicYearFromDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Janvier = 1, Décembre = 12
    return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};
exports.getAcademicYearFromDate = getAcademicYearFromDate;
const getAcademicYearDates = (academicYear) => {
    const [startYear] = academicYear.split("-").map(Number);
    return {
        start: new Date(startYear, 8, 1), // 1er septembre
        end: new Date(startYear + 1, 7, 31), // 31 août
    };
};
exports.getAcademicYearDates = getAcademicYearDates;
// Générer la prochaine année académique
const getNextAcademicYear = (currentAcademicYear) => {
    const [startYear, endYear] = currentAcademicYear.split("-").map(Number);
    return `${startYear + 1}-${endYear + 1}`;
};
exports.getNextAcademicYear = getNextAcademicYear;
// Initialiser les années académiques de base (2020-2021 à 2025-2026)
const initializeBaseAcademicYears = async () => {
    try {
        console.log("🔄 Initialisation des années académiques de base...");
        const baseYears = [
            "2020-2021",
            "2021-2022",
            "2022-2023",
            "2023-2024",
            "2024-2025",
            "2025-2026",
        ];
        for (const year of baseYears) {
            const { start, end } = (0, exports.getAcademicYearDates)(year);
            // Vérifier si l'année existe déjà
            const existingYear = await prisma.academicYear.findUnique({
                where: { year },
            });
            if (!existingYear) {
                await prisma.academicYear.create({
                    data: {
                        year,
                        startDate: start,
                        endDate: end,
                        isCurrent: false, // Sera mis à jour après
                    },
                });
                console.log(`✅ Année académique créée: ${year}`);
            }
            else {
                console.log(`ℹ️  Année académique existante: ${year}`);
            }
        }
        console.log("✅ Initialisation des années de base terminée");
    }
    catch (error) {
        console.error("❌ Erreur lors de l'initialisation des années de base:", error);
    }
};
exports.initializeBaseAcademicYears = initializeBaseAcademicYears;
// Vérifier et créer les années académiques manquantes
const ensureAcademicYearsExist = async () => {
    try {
        console.log("🔍 Vérification des années académiques...");
        // D'abord initialiser les années de base
        await (0, exports.initializeBaseAcademicYears)();
        const today = new Date();
        const currentAcademicYear = (0, exports.getAcademicYearFromDate)(today);
        // Vérifier si l'année courante existe
        const currentYearExists = await prisma.academicYear.findUnique({
            where: { year: currentAcademicYear },
        });
        if (!currentYearExists) {
            console.log(`🔄 Création de l'année courante manquante: ${currentAcademicYear}`);
            const { start, end } = (0, exports.getAcademicYearDates)(currentAcademicYear);
            await prisma.academicYear.create({
                data: {
                    year: currentAcademicYear,
                    startDate: start,
                    endDate: end,
                    isCurrent: true,
                },
            });
        }
        // Vérifier et créer les années futures si nécessaire
        await (0, exports.ensureFutureAcademicYears)();
        // Mettre à jour l'année courante
        await (0, exports.updateCurrentAcademicYear)();
        console.log("✅ Vérification des années académiques terminée");
    }
    catch (error) {
        console.error("❌ Erreur lors de la vérification des années académiques:", error);
    }
};
exports.ensureAcademicYearsExist = ensureAcademicYearsExist;
// S'assurer que les années futures existent
const ensureFutureAcademicYears = async (yearsAhead = 2) => {
    try {
        console.log(`🔮 Vérification des ${yearsAhead} prochaines années...`);
        const today = new Date();
        let currentYear = (0, exports.getAcademicYearFromDate)(today);
        for (let i = 0; i < yearsAhead; i++) {
            const nextYear = (0, exports.getNextAcademicYear)(currentYear);
            const yearExists = await prisma.academicYear.findUnique({
                where: { year: nextYear },
            });
            if (!yearExists) {
                const { start, end } = (0, exports.getAcademicYearDates)(nextYear);
                await prisma.academicYear.create({
                    data: {
                        year: nextYear,
                        startDate: start,
                        endDate: end,
                        isCurrent: false,
                    },
                });
                console.log(`✅ Année future créée: ${nextYear}`);
            }
            currentYear = nextYear;
        }
    }
    catch (error) {
        console.error("❌ Erreur lors de la création des années futures:", error);
    }
};
exports.ensureFutureAcademicYears = ensureFutureAcademicYears;
// Mettre à jour l'année académique courante
const updateCurrentAcademicYear = async () => {
    try {
        const today = new Date();
        const currentAcademicYear = (0, exports.getAcademicYearFromDate)(today);
        // Désactiver toutes les années
        await prisma.academicYear.updateMany({
            data: { isCurrent: false },
        });
        // Activer l'année courante
        await prisma.academicYear.update({
            where: { year: currentAcademicYear },
            data: { isCurrent: true },
        });
        console.log(`🎯 Année courante mise à jour: ${currentAcademicYear}`);
    }
    catch (error) {
        console.error("❌ Erreur lors de la mise à jour de l'année courante:", error);
    }
};
exports.updateCurrentAcademicYear = updateCurrentAcademicYear;
// Fonction d'initialisation complète
const initializeAcademicYear = async () => {
    try {
        console.log("🚀 Initialisation complète du système d'années académiques...");
        // 1. Initialiser les années de base
        await (0, exports.initializeBaseAcademicYears)();
        // 2. S'assurer que toutes les années nécessaires existent
        await (0, exports.ensureAcademicYearsExist)();
        // 3. Mettre à jour l'année courante
        await (0, exports.updateCurrentAcademicYear)();
        // 4. Afficher le statut final
        const allYears = await (0, exports.getAllAcademicYears)();
        const currentYear = await (0, exports.getCurrentAcademicYear)();
        console.log("📊 Statut final des années académiques:");
        console.log(`   - Total années: ${allYears.length}`);
        console.log(`   - Année courante: ${currentYear?.year}`);
        console.log("✅ Initialisation terminée avec succès");
    }
    catch (error) {
        console.error("❌ Erreur lors de l'initialisation complète:", error);
    }
};
exports.initializeAcademicYear = initializeAcademicYear;
// Vérifier si c'est le moment de créer une nouvelle année (1er septembre)
const shouldCreateNewAcademicYear = () => {
    const today = new Date();
    return today.getDate() === 1 && today.getMonth() === 8; // 1er septembre
};
exports.shouldCreateNewAcademicYear = shouldCreateNewAcademicYear;
// Créer automatiquement la prochaine année académique si nécessaire
const autoCreateNextAcademicYear = async () => {
    try {
        if ((0, exports.shouldCreateNewAcademicYear)()) {
            console.log("📅 1er septembre détecté - création automatique de la prochaine année...");
            const today = new Date();
            const nextAcademicYear = (0, exports.getNextAcademicYear)((0, exports.getAcademicYearFromDate)(today));
            const yearExists = await prisma.academicYear.findUnique({
                where: { year: nextAcademicYear },
            });
            if (!yearExists) {
                const { start, end } = (0, exports.getAcademicYearDates)(nextAcademicYear);
                await prisma.academicYear.create({
                    data: {
                        year: nextAcademicYear,
                        startDate: start,
                        endDate: end,
                        isCurrent: false,
                    },
                });
                console.log(`✅ Nouvelle année académique créée automatiquement: ${nextAcademicYear}`);
                // Audit log (si vous avez un système d'audit)
                // await createAuditLog({
                //   action: "AUTO_CREATE_ACADEMIC_YEAR",
                //   entity: "AcademicYear",
                //   description: `Création automatique de l'année ${nextAcademicYear}`,
                //   status: "SUCCESS",
                //   userId: "system",
                // });
            }
        }
    }
    catch (error) {
        console.error("❌ Erreur lors de la création automatique:", error);
    }
};
exports.autoCreateNextAcademicYear = autoCreateNextAcademicYear;
// Obtenir l'année académique courante
const getCurrentAcademicYear = async () => {
    return await prisma.academicYear.findFirst({
        where: { isCurrent: true },
    });
};
exports.getCurrentAcademicYear = getCurrentAcademicYear;
// Obtenir toutes les années académiques
const getAllAcademicYears = async () => {
    return await prisma.academicYear.findMany({
        orderBy: { year: "desc" },
    });
};
exports.getAllAcademicYears = getAllAcademicYears;
// Obtenir les années académiques disponibles pour les inscriptions
const getAvailableAcademicYears = async () => {
    const today = new Date();
    const currentYear = (0, exports.getAcademicYearFromDate)(today);
    return await prisma.academicYear.findMany({
        where: {
            year: {
                gte: "2020-2021", // À partir de 2020-2021
            },
        },
        orderBy: { year: "desc" },
    });
};
exports.getAvailableAcademicYears = getAvailableAcademicYears;
// Vérifier si une année académique existe
const academicYearExists = async (year) => {
    const existingYear = await prisma.academicYear.findUnique({
        where: { year },
    });
    return !!existingYear;
};
exports.academicYearExists = academicYearExists;
exports.default = prisma;
//# sourceMappingURL=academicYearService.js.map