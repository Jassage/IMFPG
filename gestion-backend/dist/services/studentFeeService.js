"use strict";
/**
 * @file studentFeeService.ts
 * @description Service pour la gestion des frais étudiants
 * @module Services/StudentFees
 *
 * Ce service gère :
 * - L'attribution de frais aux étudiants
 * - La consultation des frais étudiants
 * - La mise à jour du statut des frais
 * - La suppression des frais
 * - Le suivi des paiements
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentFeeService = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../prisma"));
/**
 * @constant AssignFeeSchema
 * @description Schéma Zod pour la validation de l'attribution de frais
 */
const AssignFeeSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "L'ID étudiant est requis"),
    feeStructureId: zod_1.z.string().min(1, "L'ID de structure de frais est requis"),
    academicYearId: zod_1.z.string().min(1, "L'ID d'année académique est requis"),
});
/**
 * @constant StudentFeeUpdateSchema
 * @description Schéma Zod pour la validation de la mise à jour des frais étudiants
 */
const StudentFeeUpdateSchema = zod_1.z
    .object({
    dueDate: zod_1.z.string().datetime("Date d'échéance invalide").optional(),
    status: zod_1.z.enum(["pending", "partial", "paid", "overdue"]).optional(),
})
    .partial();
/**
 * @class StudentFeeService
 * @description Service pour la gestion des frais étudiants
 */
class StudentFeeService {
    /**
     * Récupère tous les frais étudiants avec filtres optionnels
     */
    static async getAllStudentFees(filters) {
        const { studentId, academicYear } = filters;
        console.log("📥 Consultation tous les frais étudiants - Filtres:", {
            studentId,
            academicYear,
        });
        const whereClause = {};
        if (studentId)
            whereClause.studentId = studentId;
        if (academicYear) {
            whereClause.feeStructure = {
                academicYear: academicYear,
            };
        }
        const studentFees = await prisma_1.default.studentFee.findMany({
            where: whereClause,
            include: {
                feeStructure: true,
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                payments: {
                    orderBy: { paymentDate: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return {
            success: true,
            data: studentFees,
            metadata: {
                count: studentFees.length,
                studentFilter: studentId || "none",
                academicYearFilter: academicYear || "none",
                statusSummary: {
                    pending: studentFees.filter((f) => f.status === "pending").length,
                    partial: studentFees.filter((f) => f.status === "partial").length,
                    paid: studentFees.filter((f) => f.status === "paid").length,
                    overdue: studentFees.filter((f) => f.status === "overdue").length,
                },
            },
        };
    }
    /**
     * Récupère les frais d'un étudiant par son ID
     */
    static async getStudentFeeById(id) {
        console.log("📥 Consultation frais étudiant par ID:", id);
        const studentFee = await prisma_1.default.studentFee.findUnique({
            where: { id },
            include: {
                feeStructure: true,
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                payments: {
                    orderBy: { paymentDate: "desc" },
                },
            },
        });
        if (!studentFee) {
            throw {
                status: 404,
                message: "Frais étudiant non trouvé",
            };
        }
        return {
            success: true,
            data: studentFee,
            metadata: {
                studentId: studentFee.studentId,
                studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
                feeStructure: studentFee.feeStructure.name,
                totalAmount: studentFee.totalAmount,
                paidAmount: studentFee.paidAmount,
                status: studentFee.status,
                paymentsCount: studentFee.payments.length,
            },
        };
    }
    /**
     * Met à jour les frais d'un étudiant
     */
    static async updateStudentFee(id, data) {
        console.log("📥 Mise à jour frais étudiant - ID:", id, "Données:", data);
        // Valider les données avec Zod
        try {
            StudentFeeUpdateSchema.parse(data);
        }
        catch (validationError) {
            if (validationError instanceof zod_1.z.ZodError) {
                console.error("❌ Erreur validation Zod:", validationError.issues);
                throw {
                    status: 400,
                    message: "Données de validation invalides",
                    details: validationError.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                };
            }
            throw validationError;
        }
        // Vérifier si les frais existent
        const existingStudentFee = await prisma_1.default.studentFee.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!existingStudentFee) {
            throw {
                status: 404,
                message: "Frais étudiant non trouvé",
            };
        }
        const updatedStudentFee = await prisma_1.default.studentFee.update({
            where: { id },
            data: {
                ...data,
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
            },
            include: {
                feeStructure: true,
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
            },
        });
        console.log("✅ Frais étudiant mis à jour:", id);
        return {
            success: true,
            message: "Frais étudiant mis à jour avec succès",
            data: updatedStudentFee,
            metadata: {
                studentId: updatedStudentFee.studentId,
                studentName: `${updatedStudentFee.student.firstName} ${updatedStudentFee.student.lastName}`,
                updatedFields: Object.keys(data),
                oldStatus: existingStudentFee.status,
                newStatus: updatedStudentFee.status,
            },
        };
    }
    /**
     * Supprime les frais d'un étudiant (si aucun paiement associé)
     */
    static async deleteStudentFee(id) {
        console.log("🗑️ Suppression frais étudiant - ID:", id);
        // Vérifier s'il y a des paiements associés
        const payments = await prisma_1.default.feePayment.findMany({
            where: { studentFeeId: id },
        });
        if (payments.length > 0) {
            throw {
                status: 400,
                message: "Impossible de supprimer ces frais car des paiements y sont associés",
                details: `${payments.length} paiement(s) associé(s) trouvé(s)`,
                metadata: {
                    paymentsCount: payments.length,
                    totalPaymentsAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
                },
            };
        }
        // Récupérer les informations avant suppression
        const studentFeeToDelete = await prisma_1.default.studentFee.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                feeStructure: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!studentFeeToDelete) {
            throw {
                status: 404,
                message: "Frais étudiant non trouvé",
            };
        }
        await prisma_1.default.studentFee.delete({ where: { id } });
        console.log("✅ Frais étudiant supprimé:", id);
        return {
            success: true,
            message: "Frais étudiant supprimés",
            metadata: {
                studentId: studentFeeToDelete.studentId,
                studentName: `${studentFeeToDelete.student.firstName} ${studentFeeToDelete.student.lastName}`,
                feeStructure: studentFeeToDelete.feeStructure.name,
                totalAmount: studentFeeToDelete.totalAmount,
                status: studentFeeToDelete.status,
            },
        };
    }
    /**
     * Attribue une structure de frais à un étudiant pour une année académique
     */
    static async assignFeeToStudent(data) {
        const { studentId, feeStructureId, academicYearId } = data;
        console.log("📥 Attribution frais à étudiant - Données:", data);
        // Valider les données avec Zod
        try {
            AssignFeeSchema.parse(data);
        }
        catch (validationError) {
            if (validationError instanceof zod_1.z.ZodError) {
                console.error("❌ Erreur validation Zod:", validationError.issues);
                throw {
                    status: 400,
                    message: "Données de validation invalides",
                    details: validationError.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                };
            }
            throw validationError;
        }
        // Vérifier si l'étudiant existe
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            throw {
                status: 404,
                message: "Étudiant non trouvé",
            };
        }
        // Vérifier si la structure de frais existe
        const feeStructure = await prisma_1.default.feeStructure.findUnique({
            where: { id: feeStructureId },
        });
        if (!feeStructure) {
            throw {
                status: 404,
                message: "Structure de frais non trouvée",
            };
        }
        // Vérifier si l'année académique existe
        const academicYear = await prisma_1.default.academicYear.findUnique({
            where: { id: academicYearId },
        });
        if (!academicYear) {
            throw {
                status: 404,
                message: "Année académique non trouvée",
            };
        }
        // Vérifier les doublons
        const existingFee = await prisma_1.default.studentFee.findFirst({
            where: {
                studentId,
                feeStructureId,
                academicYearId,
            },
        });
        if (existingFee) {
            throw {
                status: 400,
                message: "Des frais existent déjà pour cette combinaison",
            };
        }
        // Créer les frais étudiants
        const studentFee = await prisma_1.default.studentFee.create({
            data: {
                student: { connect: { id: studentId } },
                feeStructure: { connect: { id: feeStructureId } },
                academicYear: { connect: { id: academicYearId } },
                totalAmount: feeStructure.amount,
                paidAmount: 0,
                status: "pending",
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                feeStructure: { select: { id: true, name: true, amount: true } },
                academicYear: { select: { id: true, year: true } },
            },
        });
        console.log("✅ Frais attribués à l'étudiant:", studentFee.id);
        return {
            success: true,
            message: "Frais attribués avec succès",
            data: studentFee,
            metadata: {
                studentId: studentFee.studentId,
                studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
                feeStructure: studentFee.feeStructure.name,
                academicYear: studentFee.academicYear.year,
                totalAmount: studentFee.totalAmount,
                dueDate: studentFee.dueDate,
            },
        };
    }
    /**
     * Récupère les frais d'un étudiant pour une année académique spécifique
     */
    static async getStudentFeeByStudentAndYear(studentId, academicYearId) {
        console.log("📥 Consultation frais par étudiant et année - Student:", studentId, "Année:", academicYearId);
        const studentFee = await prisma_1.default.studentFee.findFirst({
            where: {
                studentId,
                academicYearId: academicYearId,
            },
            include: {
                feeStructure: true,
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                payments: {
                    orderBy: { paymentDate: "desc" },
                },
            },
        });
        if (!studentFee) {
            throw {
                status: 404,
                message: "Frais étudiant non trouvé",
            };
        }
        return {
            success: true,
            data: studentFee,
            metadata: {
                studentId: studentFee.studentId,
                studentName: `${studentFee.student.firstName} ${studentFee.student.lastName}`,
                academicYear: academicYearId,
                feeStructure: studentFee.feeStructure.name,
                totalAmount: studentFee.totalAmount,
                paidAmount: studentFee.paidAmount,
                status: studentFee.status,
                paymentsCount: studentFee.payments.length,
            },
        };
    }
    /**
     * Récupère tous les frais d'un étudiant (toutes années confondues)
     */
    static async getStudentFeesByStudent(studentId) {
        console.log("📥 Consultation frais par étudiant - Student ID:", studentId);
        const studentFees = await prisma_1.default.studentFee.findMany({
            where: { studentId },
            include: {
                feeStructure: true,
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
                payments: {
                    orderBy: { paymentDate: "desc" },
                },
            },
        });
        return {
            success: true,
            data: studentFees,
            metadata: {
                studentId,
                count: studentFees.length,
                totalAmount: studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0),
                totalPaid: studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0),
                statusSummary: {
                    pending: studentFees.filter((f) => f.status === "pending").length,
                    partial: studentFees.filter((f) => f.status === "partial").length,
                    paid: studentFees.filter((f) => f.status === "paid").length,
                    overdue: studentFees.filter((f) => f.status === "overdue").length,
                },
            },
        };
    }
}
exports.StudentFeeService = StudentFeeService;
//# sourceMappingURL=studentFeeService.js.map