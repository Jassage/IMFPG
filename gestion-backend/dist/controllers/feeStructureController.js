"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFeeStructures = exports.toggleFeeStructureStatus = exports.getAcademicYearsWithFees = exports.getFeeStructuresByAcademicYearId = exports.getFeeStructureByAcademicYear = exports.forceDeleteFeeStructure = exports.deleteFeeStructure = exports.updateFeeStructure = exports.createFeeStructure = exports.getFeeStructureById = exports.getAllFeeStructures = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getAllFeeStructures = async (req, res) => {
    try {
        const feeStructures = await prisma_1.default.feeStructure.findMany({
            orderBy: { academicYear: "desc" },
            include: {
                studentFees: {
                    select: {
                        id: true,
                        student: {
                            select: {
                                firstName: true,
                                lastName: true,
                                studentId: true,
                            },
                        },
                        totalAmount: true,
                        paidAmount: true,
                        status: true,
                    },
                },
            },
        });
        res.json(feeStructures);
    }
    catch (error) {
        console.error("❌ Erreur récupération structures de frais:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getAllFeeStructures = getAllFeeStructures;
const getFeeStructureById = async (req, res) => {
    try {
        const { id } = req.params;
        const feeStructure = await prisma_1.default.feeStructure.findUnique({
            where: { id },
            include: {
                studentFees: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentId: true,
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
                        },
                    },
                },
            },
        });
        if (!feeStructure) {
            return res.status(404).json({ error: "Structure de frais non trouvée" });
        }
        res.json(feeStructure);
    }
    catch (error) {
        console.error("❌ Erreur récupération structure:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getFeeStructureById = getFeeStructureById;
const createFeeStructure = async (req, res) => {
    try {
        const { name, academicYear, amount, description, dueDate, isActive } = req.body;
        console.log("📥 Données reçues pour création frais:", req.body);
        // Validation des champs requis
        if (!name || !academicYear || amount === undefined) {
            return res.status(400).json({
                error: "Le nom, l'année académique et le montant sont obligatoires",
                details: {
                    name: !name ? "Requis" : "OK",
                    academicYear: !academicYear ? "Requis" : "OK",
                    amount: amount === undefined ? "Requis" : "OK",
                },
            });
        }
        // Vérifier si une structure existe déjà pour cette année académique
        const existingStructure = await prisma_1.default.feeStructure.findFirst({
            where: {
                name,
            },
        });
        if (existingStructure) {
            return res.status(400).json({
                error: `Une structure de frais existe déjà avec ce nom ${name}`,
                existingStructure: {
                    id: existingStructure.id,
                    name: existingStructure.name,
                    amount: existingStructure.amount,
                },
            });
        }
        // Validation du montant
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue < 0) {
            return res.status(400).json({
                error: "Le montant doit être un nombre positif",
            });
        }
        // Préparer les données pour la création
        const feeStructureData = {
            name,
            academicYear,
            amount: amountValue,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        };
        // Ajouter les champs optionnels s'ils sont fournis
        if (description !== undefined) {
            feeStructureData.description = description;
        }
        const newFeeStructure = await prisma_1.default.feeStructure.create({
            data: feeStructureData,
        });
        console.log("✅ Structure de frais créée:", newFeeStructure.id);
        res.status(201).json({
            message: "Structure de frais créée avec succès",
            feeStructure: newFeeStructure,
        });
    }
    catch (error) {
        console.error("❌ Erreur création structure de frais:", error);
        res.status(400).json({
            error: "Erreur lors de la création",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};
exports.createFeeStructure = createFeeStructure;
const updateFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, academicYear, amount, description, dueDate, isActive } = req.body;
        console.log("📥 Mise à jour structure frais:", { id, data: req.body });
        // Vérifier que la structure existe
        const existingStructure = await prisma_1.default.feeStructure.findUnique({
            where: { id },
        });
        if (!existingStructure) {
            return res.status(404).json({
                error: "Structure de frais non trouvée",
            });
        }
        // Si l'année académique est modifiée, vérifier qu'elle n'existe pas déjà
        if (academicYear && academicYear !== existingStructure.academicYear) {
            const duplicateStructure = await prisma_1.default.feeStructure.findFirst({
                where: {
                    academicYear,
                    id: { not: id },
                },
            });
            if (duplicateStructure) {
                return res.status(400).json({
                    error: `Une structure de frais existe déjà pour l'année académique ${academicYear}`,
                });
            }
        }
        // Validation du montant si fourni
        if (amount !== undefined) {
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue < 0) {
                return res.status(400).json({
                    error: "Le montant doit être un nombre positif",
                });
            }
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (academicYear !== undefined)
            updateData.academicYear = academicYear;
        if (amount !== undefined)
            updateData.amount = parseFloat(amount);
        if (description !== undefined)
            updateData.description = description;
        if (dueDate !== undefined)
            updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (isActive !== undefined)
            updateData.isActive = Boolean(isActive);
        const updatedFeeStructure = await prisma_1.default.feeStructure.update({
            where: { id },
            data: updateData,
        });
        console.log("✅ Structure de frais mise à jour:", id);
        res.json({
            message: "Structure de frais mise à jour avec succès",
            feeStructure: updatedFeeStructure,
        });
    }
    catch (error) {
        console.error("❌ Erreur mise à jour structure:", error);
        res.status(400).json({
            error: "Erreur lors de la mise à jour",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};
exports.updateFeeStructure = updateFeeStructure;
const deleteFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🗑️ Tentative suppression structure frais:", id);
        // Vérifier si la structure existe
        const feeStructure = await prisma_1.default.feeStructure.findUnique({
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
            return res.status(404).json({
                error: "Structure de frais non trouvée",
            });
        }
        // Vérifier si la structure est utilisée par des étudiants
        if (feeStructure.studentFees.length > 0) {
            const studentsWithPayments = feeStructure.studentFees.filter((studentFee) => studentFee.payments.length > 0);
            if (studentsWithPayments.length > 0) {
                return res.status(400).json({
                    error: "Impossible de supprimer cette structure car des paiements y sont associés",
                    details: {
                        totalStudents: feeStructure.studentFees.length,
                        studentsWithPayments: studentsWithPayments.length,
                        suggestion: "Désactivez la structure plutôt que de la supprimer",
                    },
                });
            }
            // Si des étudiants sont associés mais sans paiements, proposer une suppression en cascade
            return res.status(400).json({
                error: "Cette structure est associée à des étudiants",
                details: {
                    totalStudents: feeStructure.studentFees.length,
                    suggestion: "Utilisez la suppression forcée pour supprimer également les associations étudiants",
                },
            });
        }
        await prisma_1.default.feeStructure.delete({ where: { id } });
        console.log("✅ Structure de frais supprimée:", id);
        res.json({
            message: "Structure de frais supprimée avec succès",
        });
    }
    catch (error) {
        console.error("❌ Erreur suppression structure:", error);
        res.status(400).json({
            error: "Erreur lors de la suppression",
            details: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};
exports.deleteFeeStructure = deleteFeeStructure;
// NOUVEAU : Suppression forcée avec cascade
const forceDeleteFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("💥 Suppression forcée structure frais:", id);
        // Vérifier que la structure existe
        const feeStructure = await prisma_1.default.feeStructure.findUnique({
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
            return res.status(404).json({
                error: "Structure de frais non trouvée",
            });
        }
        // Vérifier s'il y a des paiements (bloquant)
        const hasPayments = feeStructure.studentFees.some((studentFee) => studentFee.payments.length > 0);
        if (hasPayments) {
            return res.status(400).json({
                error: "Impossible de supprimer: des paiements sont associés à cette structure",
                details: {
                    totalPayments: feeStructure.studentFees.reduce((sum, sf) => sum + sf.payments.length, 0),
                },
            });
        }
        // Suppression en cascade des studentFees associés
        await prisma_1.default.$transaction(async (tx) => {
            // Supprimer d'abord les studentFees
            await tx.studentFee.deleteMany({
                where: { feeStructureId: id },
            });
            // Puis supprimer la structure
            await tx.feeStructure.delete({
                where: { id },
            });
        });
        console.log("✅ Structure de frais supprimée avec cascade:", id);
        res.json({
            message: "Structure de frais et associations étudiants supprimées avec succès",
            deletedStudentsCount: feeStructure.studentFees.length,
        });
    }
    catch (error) {
        console.error("❌ Erreur suppression forcée:", error);
        res.status(400).json({
            error: "Erreur lors de la suppression forcée",
        });
    }
};
exports.forceDeleteFeeStructure = forceDeleteFeeStructure;
// NOUVEAU : Obtenir la structure de frais par année académique
const getFeeStructureByAcademicYear = async (req, res) => {
    try {
        const { academicYear } = req.params;
        const feeStructure = await prisma_1.default.feeStructure.findFirst({
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
                                studentId: true,
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
                        },
                    },
                },
            },
        });
        if (!feeStructure) {
            return res.status(404).json({
                error: `Aucune structure de frais active trouvée pour l'année ${academicYear}`,
            });
        }
        res.json(feeStructure);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par année:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getFeeStructureByAcademicYear = getFeeStructureByAcademicYear;
// NOUVEAU : Obtenir les structures de frais par ID d'année académique
const getFeeStructuresByAcademicYearId = async (req, res) => {
    try {
        const { academicYearId } = req.params;
        // Récupérer l'année académique
        const academicYear = await prisma_1.default.academicYear.findUnique({
            where: { id: academicYearId },
        });
        if (!academicYear) {
            return res.status(404).json({
                error: "Année académique non trouvée",
            });
        }
        // Récupérer les structures de frais pour cette année
        const feeStructures = await prisma_1.default.feeStructure.findMany({
            where: {
                academicYear: academicYear.year,
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
                                studentId: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(feeStructures);
    }
    catch (error) {
        console.error("❌ Erreur récupération frais par ID année:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getFeeStructuresByAcademicYearId = getFeeStructuresByAcademicYearId;
// NOUVEAU : Obtenir toutes les années académiques avec structures de frais
const getAcademicYearsWithFees = async (req, res) => {
    try {
        const feeStructures = await prisma_1.default.feeStructure.findMany({
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
        res.json({
            years: feeStructures,
            total: feeStructures.length,
        });
    }
    catch (error) {
        console.error("❌ Erreur récupération années avec frais:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.getAcademicYearsWithFees = getAcademicYearsWithFees;
// NOUVEAU : Activer/Désactiver une structure de frais
const toggleFeeStructureStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const feeStructure = await prisma_1.default.feeStructure.findUnique({
            where: { id },
        });
        if (!feeStructure) {
            return res.status(404).json({
                error: "Structure de frais non trouvée",
            });
        }
        const updatedFeeStructure = await prisma_1.default.feeStructure.update({
            where: { id },
            data: {
                isActive: !feeStructure.isActive,
            },
        });
        res.json({
            message: `Structure de frais ${updatedFeeStructure.isActive ? "activée" : "désactivée"} avec succès`,
            feeStructure: updatedFeeStructure,
        });
    }
    catch (error) {
        console.error("❌ Erreur changement statut structure:", error);
        res.status(400).json({ error: "Erreur lors du changement de statut" });
    }
};
exports.toggleFeeStructureStatus = toggleFeeStructureStatus;
// NOUVEAU : Rechercher les structures de frais
const searchFeeStructures = async (req, res) => {
    try {
        const { academicYear, isActive, search } = req.query;
        const where = {};
        if (academicYear) {
            where.academicYear = academicYear;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { academicYear: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const feeStructures = await prisma_1.default.feeStructure.findMany({
            where,
            orderBy: { academicYear: "desc" },
            include: {
                _count: {
                    select: {
                        studentFees: true,
                    },
                },
            },
        });
        res.json({
            feeStructures,
            total: feeStructures.length,
        });
    }
    catch (error) {
        console.error("❌ Erreur recherche structures:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
exports.searchFeeStructures = searchFeeStructures;
//# sourceMappingURL=feeStructureController.js.map