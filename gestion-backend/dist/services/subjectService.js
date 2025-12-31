"use strict";
/**
 * @file subjectService.ts
 * @description Service pour la gestion des matières
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * Service pour la gestion des matières
 */
class SubjectService {
    /**
     * Récupère la liste des matières avec pagination et filtres
     */
    async getSubjects(filters, auditData) {
        try {
            const { page = 1, limit = 20, search, type, sortBy = "name", sortOrder = "asc", } = filters;
            const pageNum = parseInt(page.toString());
            const limitNum = parseInt(limit.toString());
            const skip = (pageNum - 1) * limitNum;
            // Filtres
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }
            if (type) {
                where.type = type;
            }
            // Récupération avec pagination
            const [subjects, total] = await Promise.all([
                prisma.subject.findMany({
                    where,
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        _count: {
                            select: {
                                assignments: true,
                                grades: true,
                            },
                        },
                    },
                    orderBy: {
                        [sortBy]: sortOrder === "desc" ? "desc" : "asc",
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.subject.count({ where }),
            ]);
            return {
                success: true,
                message: "Matières récupérées avec succès",
                data: {
                    subjects,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                },
            };
        }
        catch (error) {
            console.error("❌ SubjectService - getSubjects error:", error);
            throw error;
        }
    }
    /**
     * Récupère une matière par ID
     */
    async getSubjectById(id, auditData) {
        try {
            const subject = await prisma.subject.findUnique({
                where: { id },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    assignments: {
                        include: {
                            professeur: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                            academicYear: true,
                        },
                    },
                },
            });
            if (!subject) {
                return {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                };
            }
            return {
                success: true,
                message: "Matière récupérée avec succès",
                data: { subject },
            };
        }
        catch (error) {
            console.error("❌ SubjectService - getSubjectById error:", error);
            throw error;
        }
    }
    /**
     * Crée une nouvelle matière
     */
    async createSubject(data, userId, auditData) {
        try {
            const { code, name, coefficient, type, passingGrade, maxGrade, description, } = data;
            // Vérifier si le code existe déjà
            const existingSubject = await prisma.subject.findUnique({
                where: { code },
            });
            if (existingSubject) {
                return {
                    success: false,
                    message: "Une matière avec ce code existe déjà",
                    code: "SUBJECT_CODE_EXISTS",
                };
            }
            const existsubj = await prisma.subject.findFirst({
                where: {
                    name,
                },
            });
            if (existsubj) {
                return {
                    success: false,
                    message: "Une matière avec ce nom existe déjà",
                    code: "SUBJECT_NAME_EXISTS",
                };
            }
            if (!userId) {
                return {
                    success: false,
                    message: "Utilisateur non identifié",
                    code: "UNAUTHORIZED",
                };
            }
            // Créer la matière
            const subject = await prisma.subject.create({
                data: {
                    code,
                    name,
                    coefficient: coefficient || 1,
                    type: type || "Obligatoire",
                    passingGrade: passingGrade || 50,
                    description,
                    maxGrade: maxGrade,
                    createdById: userId,
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Matière créée avec succès",
                data: { subject },
                metadata: {
                    code,
                    type,
                    coefficient,
                    passingGrade,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Met à jour une matière
     */
    async updateSubject(id, data, auditData) {
        try {
            const { code, name, credits, type, passingGrade, description, maxGrade, coefficient, } = data;
            // Vérifier si la matière existe
            const existingSubject = await prisma.subject.findUnique({
                where: { id },
            });
            if (!existingSubject) {
                return {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                };
            }
            // Vérifier si le type est valide (si fourni)
            const validSubjectTypes = [
                "Obligatoire",
                "Optionnelle",
            ];
            if (type && !validSubjectTypes.includes(type)) {
                return {
                    success: false,
                    message: "Type invalide. Valeurs acceptées: Obligatoire, Optionnelle",
                    code: "INVALID_SUBJECT_TYPE",
                };
            }
            // Vérifier si le nouveau code existe déjà (seulement si le code change)
            if (code && code !== existingSubject.code) {
                const subjectWithCode = await prisma.subject.findUnique({
                    where: { code },
                });
                if (subjectWithCode) {
                    return {
                        success: false,
                        message: "Une autre matière utilise déjà ce code",
                        code: "SUBJECT_CODE_EXISTS",
                    };
                }
            }
            // Préparer les données de mise à jour
            const updateData = {};
            if (code !== undefined)
                updateData.code = code;
            if (name !== undefined)
                updateData.name = name;
            if (credits !== undefined)
                updateData.credits = credits;
            if (type !== undefined)
                updateData.type = type;
            if (passingGrade !== undefined)
                updateData.passingGrade = passingGrade;
            if (description !== undefined)
                updateData.description = description;
            if (coefficient !== undefined)
                updateData.coefficient = coefficient;
            if (maxGrade !== undefined)
                updateData.maxGrade = maxGrade;
            // Mettre à jour la matière
            const updatedSubject = await prisma.subject.update({
                where: { id },
                data: updateData,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Matière mise à jour avec succès",
                data: { subject: updatedSubject },
                metadata: {
                    oldCode: existingSubject.code,
                    newCode: code || existingSubject.code,
                    changes: Object.keys(updateData),
                },
            };
        }
        catch (error) {
            console.error("❌ SubjectService - updateSubject error:", error);
            // Gestion spécifique des erreurs Prisma
            if (error.code === "P2002") {
                return {
                    success: false,
                    message: "Une autre matière utilise déjà ce code",
                    code: "SUBJECT_CODE_EXISTS",
                };
            }
            if (error.code === "P2025") {
                return {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                };
            }
            throw error;
        }
    }
    /**
     * Supprime une matière
     */
    async deleteSubject(id, auditData) {
        try {
            // Vérifier si la matière existe
            const subject = await prisma.subject.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            assignments: true,
                            grades: true,
                        },
                    },
                },
            });
            if (!subject) {
                return {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                };
            }
            // Vérifier les dépendances
            if (subject._count.assignments > 0 || subject._count.grades > 0) {
                return {
                    success: false,
                    message: "Cette matière ne peut pas être supprimée car elle est utilisée",
                    code: "SUBJECT_HAS_DEPENDENCIES",
                    data: {
                        assignments: subject._count.assignments,
                        grades: subject._count.grades,
                    },
                };
            }
            // Supprimer la matière
            await prisma.subject.delete({
                where: { id },
            });
            return {
                success: true,
                message: "Matière supprimée avec succès",
                subjectName: subject.name,
            };
        }
        catch (error) {
            console.error("❌ SubjectService - deleteSubject error:", error);
            throw error;
        }
    }
}
exports.SubjectService = SubjectService;
//# sourceMappingURL=subjectService.js.map