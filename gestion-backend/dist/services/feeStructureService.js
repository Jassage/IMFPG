"use strict";
/**
 * @file feeStructureService.ts
 * @description Service pour la gestion des structures de frais scolaires
 * @module Services/FeeStructures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeStructureService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * Service pour la gestion des structures de frais
 */
class FeeStructureService {
    /**
     * Récupère la liste paginée et filtrée des structures de frais
     */
    async getAllFeeStructures(filters) {
        try {
            const { page = 1, limit = 50, academicYear, isActive, search } = filters;
            const pageNum = parseInt(page.toString());
            const limitNum = parseInt(limit.toString());
            const skip = (pageNum - 1) * limitNum;
            // Construction du filtre WHERE
            const where = {};
            if (academicYear) {
                where.academicYear = academicYear;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { academicYear: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }
            // Exécution parallèle des requêtes
            const [feeStructures, total] = await Promise.all([
                prisma.feeStructure.findMany({
                    where,
                    orderBy: { academicYear: "desc" },
                    skip,
                    take: limitNum,
                    select: {
                        id: true,
                        name: true,
                        academicYear: true,
                        amount: true,
                        description: true,
                        isActive: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                studentFees: true,
                            },
                        },
                    },
                }),
                prisma.feeStructure.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limitNum);
            return {
                success: true,
                message: "Structures de frais récupérées avec succès",
                data: {
                    feeStructures,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages,
                        hasNextPage: pageNum < totalPages,
                        hasPrevPage: pageNum > 1,
                    },
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getAllFeeStructures error:", error);
            throw error;
        }
    }
    /**
     * Récupère une structure de frais par son ID avec ses détails
     */
    async getFeeStructureById(id) {
        try {
            const feeStructure = await prisma.feeStructure.findUnique({
                where: { id },
                include: {
                    studentFees: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    studentCode: true,
                                    email: true,
                                },
                            },
                            payments: {
                                select: {
                                    id: true,
                                    amount: true,
                                    paymentDate: true,
                                    paymentMethod: true,
                                },
                                orderBy: { paymentDate: "desc" },
                            },
                        },
                        take: 100,
                    },
                },
            });
            if (!feeStructure) {
                return {
                    success: false,
                    message: "Structure de frais non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
                    },
                };
            }
            return {
                success: true,
                message: "Structure de frais récupérée avec succès",
                data: { feeStructure },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getFeeStructureById error:", error);
            throw error;
        }
    }
    /**
     * Crée une nouvelle structure de frais
     */
    async createFeeStructure(data) {
        try {
            const { name, academicYear, amount, description, isActive = true } = data;
            console.log("📥 Données reçues pour création:", data);
            // Validation des champs requis
            if (!name || !academicYear || amount === undefined) {
                return {
                    success: false,
                    message: "Champs requis manquants",
                    error: "VALIDATION_ERROR",
                    details: {
                        requiredFields: ["name", "academicYear", "amount"],
                        missing: {
                            name: !name,
                            academicYear: !academicYear,
                            amount: amount === undefined,
                        },
                    },
                };
            }
            // Validation du montant
            const amountValue = parseFloat(amount.toString());
            if (isNaN(amountValue) || amountValue < 0) {
                return {
                    success: false,
                    message: "Montant invalide",
                    error: "VALIDATION_ERROR",
                    details: {
                        message: "Le montant doit être un nombre positif",
                    },
                };
            }
            // Vérification de l'unicité
            const existingStructure = await prisma.feeStructure.findFirst({
                where: {
                    name,
                    academicYear,
                },
            });
            if (existingStructure) {
                return {
                    success: false,
                    message: "Structure de frais déjà existante",
                    error: "DUPLICATE_ERROR",
                    details: {
                        message: `Une structure de frais avec le nom "${name}" existe déjà pour l'année ${academicYear}`,
                        existingId: existingStructure.id,
                    },
                };
            }
            // Création
            const newFeeStructure = await prisma.feeStructure.create({
                data: {
                    name,
                    academicYear,
                    amount: amountValue,
                    description,
                    isActive,
                },
            });
            return {
                success: true,
                message: "Structure de frais créée avec succès",
                data: { feeStructure: newFeeStructure },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - createFeeStructure error:", error);
            throw error;
        }
    }
    /**
     * Met à jour une structure de frais existante
     */
    async updateFeeStructure(id, data) {
        try {
            const { name, academicYear, amount, description, isActive } = data;
            console.log("📥 Mise à jour structure:", { id, data });
            // Vérification de l'existence
            const existingStructure = await prisma.feeStructure.findUnique({
                where: { id },
            });
            if (!existingStructure) {
                return {
                    success: false,
                    message: "Structure de frais non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
                    },
                };
            }
            // Vérification d'unicité si l'année académique est modifiée
            if (academicYear && academicYear !== existingStructure.academicYear) {
                const duplicateStructure = await prisma.feeStructure.findFirst({
                    where: {
                        name: name || existingStructure.name,
                        academicYear,
                        id: { not: id },
                    },
                });
                if (duplicateStructure) {
                    return {
                        success: false,
                        message: "Conflit de données",
                        error: "DUPLICATE_ERROR",
                        details: {
                            message: `Une structure de frais avec ce nom existe déjà pour l'année ${academicYear}`,
                        },
                    };
                }
            }
            // Validation du montant
            if (amount !== undefined) {
                const amountValue = parseFloat(amount.toString());
                if (isNaN(amountValue) || amountValue < 0) {
                    return {
                        success: false,
                        message: "Montant invalide",
                        error: "VALIDATION_ERROR",
                        details: {
                            message: "Le montant doit être un nombre positif",
                        },
                    };
                }
            }
            // Préparation des données
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (academicYear !== undefined)
                updateData.academicYear = academicYear;
            if (amount !== undefined)
                updateData.amount = parseFloat(amount.toString());
            if (description !== undefined)
                updateData.description = description;
            if (isActive !== undefined)
                updateData.isActive = Boolean(isActive);
            // Mise à jour
            const updatedFeeStructure = await prisma.feeStructure.update({
                where: { id },
                data: updateData,
            });
            console.log("✅ Structure mise à jour:", id);
            return {
                success: true,
                message: "Structure de frais mise à jour avec succès",
                data: { feeStructure: updatedFeeStructure },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - updateFeeStructure error:", error);
            throw error;
        }
    }
    /**
     * Supprime une structure de frais (soft delete logique)
     */
    async deleteFeeStructure(id) {
        try {
            console.log("🗑️ Tentative suppression structure:", id);
            const feeStructure = await prisma.feeStructure.findUnique({
                where: { id },
                include: {
                    studentFees: {
                        include: {
                            payments: true,
                        },
                    },
                },
            });
            if (!feeStructure) {
                return {
                    success: false,
                    message: "Structure de frais non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
                    },
                };
            }
            // Vérification des paiements
            const hasPayments = feeStructure.studentFees.some((studentFee) => studentFee.payments.length > 0);
            if (hasPayments) {
                return {
                    success: false,
                    message: "Suppression impossible",
                    error: "HAS_DEPENDENCIES",
                    details: {
                        message: "Des paiements sont associés à cette structure",
                        totalStudents: feeStructure.studentFees.length,
                        suggestion: "Désactivez la structure plutôt que de la supprimer",
                    },
                };
            }
            // Vérification des étudiants associés
            if (feeStructure.studentFees.length > 0) {
                return {
                    success: false,
                    message: "Structure utilisée",
                    error: "HAS_DEPENDENCIES",
                    details: {
                        totalStudents: feeStructure.studentFees.length,
                        suggestion: "Utilisez la suppression forcée pour supprimer également les associations étudiants",
                    },
                };
            }
            // Soft delete via désactivation
            const updatedFeeStructure = await prisma.feeStructure.update({
                where: { id },
                data: { isActive: false },
            });
            console.log("✅ Structure désactivée:", id);
            return {
                success: true,
                message: "Structure de frais désactivée avec succès",
                data: { feeStructure: updatedFeeStructure },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - deleteFeeStructure error:", error);
            throw error;
        }
    }
    /**
     * Suppression forcée avec cascade
     */
    async forceDeleteFeeStructure(id) {
        try {
            console.log("💥 Suppression forcée structure:", id);
            const feeStructure = await prisma.feeStructure.findUnique({
                where: { id },
                include: {
                    studentFees: {
                        include: {
                            payments: true,
                        },
                    },
                },
            });
            if (!feeStructure) {
                return {
                    success: false,
                    message: "Structure de frais non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
                    },
                };
            }
            // Blocage si des paiements existent
            const hasPayments = feeStructure.studentFees.some((studentFee) => studentFee.payments.length > 0);
            if (hasPayments) {
                return {
                    success: false,
                    message: "Suppression impossible",
                    error: "HAS_DEPENDENCIES",
                    details: {
                        totalPayments: feeStructure.studentFees.reduce((sum, sf) => sum + sf.payments.length, 0),
                    },
                };
            }
            // Transaction pour la suppression en cascade
            await prisma.$transaction(async (tx) => {
                if (feeStructure.studentFees.length > 0) {
                    await tx.studentFee.deleteMany({
                        where: { feeStructureId: id },
                    });
                }
                await tx.feeStructure.delete({
                    where: { id },
                });
            });
            console.log("✅ Structure supprimée avec cascade:", id);
            return {
                success: true,
                message: "Structure de frais et associations étudiants supprimées avec succès",
                data: {
                    deletedData: {
                        feeStructureId: id,
                        deletedStudentsCount: feeStructure.studentFees.length,
                    },
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - forceDeleteFeeStructure error:", error);
            throw error;
        }
    }
    /**
     * Récupère la structure de frais active par année académique
     */
    async getFeeStructureByAcademicYear(academicYear) {
        try {
            const feeStructure = await prisma.feeStructure.findFirst({
                where: {
                    academicYear,
                    isActive: true,
                },
                include: {
                    studentFees: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    studentCode: true,
                                    email: true,
                                },
                            },
                        },
                        take: 50,
                    },
                },
            });
            if (!feeStructure) {
                return {
                    success: false,
                    message: "Structure non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais active trouvée pour l'année ${academicYear}`,
                        suggestion: "Vérifiez que l'année académique existe et qu'une structure est active",
                    },
                };
            }
            return {
                success: true,
                message: "Structure de frais récupérée avec succès",
                data: { feeStructure },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getFeeStructureByAcademicYear error:", error);
            throw error;
        }
    }
    /**
     * Récupère les structures de frais par ID d'année académique
     */
    async getFeeStructuresByAcademicYearId(academicYearId) {
        try {
            const academicYear = await prisma.academicYear.findUnique({
                where: { id: academicYearId },
            });
            if (!academicYear) {
                return {
                    success: false,
                    message: "Année académique non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune année académique trouvée avec l'ID: ${academicYearId}`,
                    },
                };
            }
            const feeStructures = await prisma.feeStructure.findMany({
                where: {
                    academicYear: academicYear.year,
                    isActive: true,
                },
                select: {
                    id: true,
                    name: true,
                    academicYear: true,
                    amount: true,
                    description: true,
                    isActive: true,
                    _count: {
                        select: {
                            studentFees: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                success: true,
                message: "Structures de frais récupérées avec succès",
                data: {
                    academicYear: academicYear.year,
                    feeStructures,
                    count: feeStructures.length,
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getFeeStructuresByAcademicYearId error:", error);
            throw error;
        }
    }
    /**
     * Récupère toutes les années académiques avec leurs structures de frais
     */
    async getAcademicYearsWithFees() {
        try {
            const feeStructures = await prisma.feeStructure.findMany({
                select: {
                    id: true,
                    academicYear: true,
                    name: true,
                    amount: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            studentFees: true,
                        },
                    },
                },
                orderBy: { academicYear: "desc" },
            });
            // Regroupement par année académique
            const yearsMap = new Map();
            feeStructures.forEach((structure) => {
                const year = structure.academicYear;
                if (!yearsMap.has(year)) {
                    yearsMap.set(year, {
                        academicYear: year,
                        structures: [],
                        totalStructures: 0,
                        totalStudents: 0,
                    });
                }
                const yearData = yearsMap.get(year);
                yearData.structures.push(structure);
                yearData.totalStructures++;
                yearData.totalStudents += structure._count.studentFees;
            });
            const years = Array.from(yearsMap.values());
            return {
                success: true,
                message: "Années académiques récupérées avec succès",
                data: {
                    years,
                    totalYears: years.length,
                    totalStructures: feeStructures.length,
                    summary: {
                        active: feeStructures.filter((s) => s.isActive).length,
                        inactive: feeStructures.filter((s) => !s.isActive).length,
                        totalStudents: feeStructures.reduce((sum, s) => sum + s._count.studentFees, 0),
                    },
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getAcademicYearsWithFees error:", error);
            throw error;
        }
    }
    /**
     * Active ou désactive une structure de frais
     */
    async toggleFeeStructureStatus(id) {
        try {
            const feeStructure = await prisma.feeStructure.findUnique({
                where: { id },
            });
            if (!feeStructure) {
                return {
                    success: false,
                    message: "Structure de frais non trouvée",
                    error: "NOT_FOUND",
                    details: {
                        message: `Aucune structure de frais trouvée avec l'ID: ${id}`,
                    },
                };
            }
            const updatedFeeStructure = await prisma.feeStructure.update({
                where: { id },
                data: {
                    isActive: !feeStructure.isActive,
                },
            });
            return {
                success: true,
                message: `Structure de frais ${updatedFeeStructure.isActive ? "activée" : "désactivée"} avec succès`,
                data: {
                    feeStructure: updatedFeeStructure,
                    previousStatus: feeStructure.isActive,
                    newStatus: updatedFeeStructure.isActive,
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - toggleFeeStructureStatus error:", error);
            throw error;
        }
    }
    /**
     * Recherche avancée dans les structures de frais
     */
    async searchFeeStructures(filters) {
        try {
            const { academicYear, isActive, search } = filters;
            const where = {};
            if (academicYear) {
                where.academicYear = academicYear;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { academicYear: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }
            const feeStructures = await prisma.feeStructure.findMany({
                where,
                orderBy: { academicYear: "desc" },
                select: {
                    id: true,
                    name: true,
                    academicYear: true,
                    amount: true,
                    description: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            studentFees: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Recherche effectuée avec succès",
                data: {
                    feeStructures,
                    total: feeStructures.length,
                    filtersApplied: {
                        academicYear: !!academicYear,
                        isActive: isActive !== undefined,
                        search: !!search,
                    },
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - searchFeeStructures error:", error);
            throw error;
        }
    }
    /**
     * Récupère les statistiques des structures de frais
     */
    async getFeeStructureStats() {
        try {
            const [totalStructures, activeStructures, totalAmount, structuresByYear, recentStructures,] = await Promise.all([
                prisma.feeStructure.count(),
                prisma.feeStructure.count({ where: { isActive: true } }),
                prisma.feeStructure.aggregate({
                    _sum: { amount: true },
                }),
                prisma.feeStructure.groupBy({
                    by: ["academicYear"],
                    _count: { id: true },
                    _sum: { amount: true },
                    orderBy: { academicYear: "desc" },
                }),
                prisma.feeStructure.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        academicYear: true,
                        amount: true,
                        isActive: true,
                        createdAt: true,
                    },
                }),
            ]);
            return {
                success: true,
                message: "Statistiques récupérées avec succès",
                data: {
                    summary: {
                        totalStructures,
                        activeStructures,
                        inactiveStructures: totalStructures - activeStructures,
                        totalAmount: totalAmount._sum.amount || 0,
                    },
                    byYear: structuresByYear.map((year) => ({
                        academicYear: year.academicYear,
                        count: year._count.id,
                        totalAmount: year._sum.amount || 0,
                    })),
                    recent: recentStructures,
                },
            };
        }
        catch (error) {
            console.error("❌ FeeStructureService - getFeeStructureStats error:", error);
            throw error;
        }
    }
}
exports.FeeStructureService = FeeStructureService;
//# sourceMappingURL=feeStructureService.js.map