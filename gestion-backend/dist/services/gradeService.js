"use strict";
/**
 * @file gradeService.ts
 * @description Service pour la gestion des notes des étudiants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * Service pour la gestion des notes
 */
class GradeService {
    /**
     * Récupère la liste des notes avec filtres et pagination
     */
    async getGrades(filters, auditData) {
        try {
            const { page = 1, limit = 20, search, studentId, subjectId, assignmentId, academicYearId, classLevel, controlType, session, status, minGrade, maxGrade, startDate, endDate, sortBy = "createdAt", sortOrder = "desc", } = filters;
            const pageNum = parseInt(page.toString());
            const limitNum = parseInt(limit.toString());
            const skip = (pageNum - 1) * limitNum;
            // Construction des filtres
            const where = {};
            if (studentId)
                where.studentId = studentId;
            if (subjectId)
                where.subjectId = subjectId;
            if (assignmentId)
                where.assignmentId = assignmentId;
            if (academicYearId)
                where.academicYearId = academicYearId;
            if (classLevel)
                where.classLevel = classLevel;
            if (controlType)
                where.controlType = controlType;
            if (session)
                where.session = session;
            if (status)
                where.status = status;
            // Filtre par note
            if (minGrade || maxGrade) {
                where.grade = {};
                if (minGrade)
                    where.grade.gte = minGrade;
                if (maxGrade)
                    where.grade.lte = maxGrade;
            }
            // Filtre par date
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate)
                    where.createdAt.gte = startDate;
                if (endDate)
                    where.createdAt.lte = endDate;
            }
            // Recherche par nom d'étudiant ou sujet
            if (search) {
                where.OR = [
                    {
                        student: {
                            OR: [
                                { firstName: { contains: search, mode: "insensitive" } },
                                { lastName: { contains: search, mode: "insensitive" } },
                                { studentCode: { contains: search, mode: "insensitive" } },
                            ],
                        },
                    },
                    {
                        subject: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { code: { contains: search, mode: "insensitive" } },
                            ],
                        },
                    },
                ];
            }
            // Récupération avec pagination et relations
            const [grades, total] = await Promise.all([
                prisma.grade.findMany({
                    where,
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentCode: true,
                                email: true,
                                classId: true,
                                schoolClass: {
                                    select: {
                                        name: true,
                                        level: true,
                                    },
                                },
                            },
                        },
                        subject: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                coefficient: true,
                                type: true,
                                maxGrade: true,
                                passingGrade: true,
                            },
                        },
                        classAssignment: {
                            include: {
                                professeur: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        matricule: true,
                                    },
                                },
                                subject: {
                                    select: {
                                        code: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isCurrent: true,
                            },
                        },
                    },
                    orderBy: {
                        [sortBy]: sortOrder === "desc" ? "desc" : "asc",
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.grade.count({ where }),
            ]);
            // Calcul des statistiques
            const statistics = {
                totalGrades: total,
                averageGrade: grades.length > 0
                    ? grades.reduce((sum, grade) => sum + grade.grade, 0) /
                        grades.length
                    : 0,
                passedGrades: grades.filter((g) => g.grade >= g.subject.passingGrade)
                    .length,
                failedGrades: grades.filter((g) => g.grade < g.subject.passingGrade)
                    .length,
            };
            return {
                success: true,
                message: "Notes récupérées avec succès",
                data: {
                    grades,
                    statistics,
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
            console.error("GradeService - getGrades error:", error);
            throw error;
        }
    }
    /**
     * Récupère une note par ID
     */
    async getGradeById(id, auditData) {
        try {
            const grade = await prisma.grade.findUnique({
                where: { id },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                            email: true,
                            schoolClass: {
                                select: {
                                    name: true,
                                    level: true,
                                },
                            },
                        },
                    },
                    subject: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            coefficient: true,
                            type: true,
                            maxGrade: true,
                            passingGrade: true,
                            description: true,
                        },
                    },
                    classAssignment: {
                        include: {
                            professeur: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    matricule: true,
                                },
                            },
                            subject: {
                                select: {
                                    code: true,
                                    name: true,
                                },
                            },
                            academicYear: {
                                select: {
                                    year: true,
                                    isCurrent: true,
                                },
                            },
                        },
                    },
                    academicYear: {
                        select: {
                            id: true,
                            year: true,
                            startDate: true,
                            endDate: true,
                            isCurrent: true,
                        },
                    },
                    transcriptGrades: {
                        include: {
                            transcript: {
                                select: {
                                    id: true,
                                    documentType: true,
                                    status: true,
                                    generatedAt: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!grade) {
                return {
                    success: false,
                    message: "Note non trouvée",
                    code: "GRADE_NOT_FOUND",
                };
            }
            // Calculer si la note est validée
            const isPassing = grade.grade >= grade.subject.passingGrade;
            return {
                success: true,
                message: "Note récupérée avec succès",
                data: {
                    grade,
                    evaluation: {
                        isPassing,
                        passingGrade: grade.subject.passingGrade,
                        difference: grade.grade - grade.subject.passingGrade,
                    },
                },
            };
        }
        catch (error) {
            console.error("GradeService - getGradeById error:", error);
            throw error;
        }
    }
    /**
     * Crée une nouvelle note
     */
    async createGrade(data, auditData) {
        try {
            const { studentId, subjectId, assignmentId, grade: gradeValue, status, controlType, academicYearId, classLevel, notes, } = data;
            // Validation des données requises
            if (!studentId ||
                !subjectId ||
                !assignmentId ||
                gradeValue === undefined ||
                !academicYearId) {
                return {
                    success: false,
                    message: "Données requises manquantes",
                    code: "MISSING_REQUIRED_FIELDS",
                };
            }
            // Vérifier l'existence des entités liées
            const [student, subject, assignment, academicYear] = await Promise.all([
                prisma.student.findUnique({ where: { id: studentId } }),
                prisma.subject.findUnique({ where: { id: subjectId } }),
                prisma.classAssignment.findUnique({ where: { id: assignmentId } }),
                prisma.academicYear.findUnique({ where: { id: academicYearId } }),
            ]);
            if (!student) {
                return {
                    success: false,
                    message: "Étudiant non trouvé",
                    code: "STUDENT_NOT_FOUND",
                };
            }
            if (!subject) {
                return {
                    success: false,
                    message: "Matière non trouvée",
                    code: "SUBJECT_NOT_FOUND",
                };
            }
            if (!assignment) {
                return {
                    success: false,
                    message: "Affectation de classe non trouvée",
                    code: "ASSIGNMENT_NOT_FOUND",
                };
            }
            if (!academicYear) {
                return {
                    success: false,
                    message: "Année académique non trouvée",
                    code: "ACADEMIC_YEAR_NOT_FOUND",
                };
            }
            // Vérifier si une note existe déjà pour cette combinaison
            const existingGrade = await prisma.grade.findUnique({
                where: {
                    studentId_subjectId_academicYearId_controlType_assignmentId: {
                        studentId,
                        subjectId,
                        academicYearId,
                        controlType: controlType || prisma_1.ControlType.CONTROLE_1,
                        assignmentId,
                    },
                },
            });
            if (existingGrade) {
                return {
                    success: false,
                    message: "Une note existe déjà pour cette combinaison",
                    code: "GRADE_ALREADY_EXISTS",
                    data: { existingGradeId: existingGrade.id },
                };
            }
            // Vérifier que la note est dans les limites (0-20 ou 0-100)
            const gradeNum = parseFloat(gradeValue.toString());
            if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
                return {
                    success: false,
                    message: "La note doit être comprise entre 0 et 100",
                    code: "INVALID_GRADE_RANGE",
                };
            }
            // Créer la note
            const newGrade = await prisma.grade.create({
                data: {
                    studentId,
                    subjectId,
                    assignmentId,
                    grade: gradeNum,
                    status: status || prisma_1.GradeStatus.Valid_,
                    controlType: controlType || prisma_1.ControlType.CONTROLE_1,
                    academicYearId,
                    classLevel: classLevel || assignment.classLevel,
                    notes,
                    isActive: true,
                },
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                        },
                    },
                    subject: {
                        select: {
                            name: true,
                            passingGrade: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Note créée avec succès",
                data: { grade: newGrade },
                metadata: {
                    studentId,
                    subjectId,
                    assignmentId,
                    grade: gradeNum,
                    academicYearId,
                    controlType,
                },
            };
        }
        catch (error) {
            console.error("GradeService - createGrade error:", error);
            // Gestion des erreurs spécifiques Prisma
            if (error.code === "P2002") {
                return {
                    success: false,
                    message: "Une note existe déjà pour cette combinaison",
                    code: "GRADE_ALREADY_EXISTS",
                };
            }
            throw error;
        }
    }
    /**
     * Met à jour une note existante
     */
    async updateGrade(id, data, auditData) {
        try {
            const { grade: gradeValue, status, session, controlType, notes, isActive, } = data;
            // Vérifier si la note existe
            const existingGrade = await prisma.grade.findUnique({
                where: { id },
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (!existingGrade) {
                return {
                    success: false,
                    message: "Note non trouvée",
                    code: "GRADE_NOT_FOUND",
                };
            }
            // Préparer les données de mise à jour
            const updateData = {};
            if (gradeValue !== undefined) {
                const gradeNum = parseFloat(gradeValue.toString());
                if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
                    return {
                        success: false,
                        message: "La note doit être comprise entre 0 et 100",
                        code: "INVALID_GRADE_RANGE",
                    };
                }
                updateData.grade = gradeNum;
            }
            if (status !== undefined)
                updateData.status = status;
            if (session !== undefined)
                updateData.session = session;
            if (controlType !== undefined)
                updateData.controlType = controlType;
            if (notes !== undefined)
                updateData.notes = notes;
            if (isActive !== undefined)
                updateData.isActive = isActive;
            // Mettre à jour la note
            const updatedGrade = await prisma.grade.update({
                where: { id },
                data: updateData,
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                        },
                    },
                    subject: {
                        select: {
                            name: true,
                            passingGrade: true,
                        },
                    },
                    classAssignment: {
                        include: {
                            professeur: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                success: true,
                message: "Note mise à jour avec succès",
                data: { grade: updatedGrade },
                metadata: {
                    oldGrade: existingGrade.grade,
                    newGrade: updatedGrade.grade,
                    changes: Object.keys(updateData),
                },
            };
        }
        catch (error) {
            console.error("GradeService - updateGrade error:", error);
            if (error.code === "P2025") {
                return {
                    success: false,
                    message: "Note non trouvée",
                    code: "GRADE_NOT_FOUND",
                };
            }
            throw error;
        }
    }
    /**
     * Supprime une note
     */
    async deleteGrade(id, auditData) {
        try {
            // Vérifier si la note existe
            const grade = await prisma.grade.findUnique({
                where: { id },
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                    transcriptGrades: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!grade) {
                return {
                    success: false,
                    message: "Note non trouvée",
                    code: "GRADE_NOT_FOUND",
                };
            }
            // Vérifier si la note est utilisée dans des transcripts
            if (grade.transcriptGrades.length > 0) {
                return {
                    success: false,
                    message: "Cette note ne peut pas être supprimée car elle est utilisée dans des transcripts",
                    code: "GRADE_HAS_DEPENDENCIES",
                    data: {
                        transcriptCount: grade.transcriptGrades.length,
                    },
                };
            }
            // Supprimer la note
            await prisma.grade.delete({
                where: { id },
            });
            return {
                success: true,
                message: "Note supprimée avec succès",
                metadata: {
                    studentName: `${grade.student.firstName} ${grade.student.lastName}`,
                    subjectName: grade.subject.name,
                },
            };
        }
        catch (error) {
            console.error("GradeService - deleteGrade error:", error);
            throw error;
        }
    }
    /**
     * Récupère les notes d'un étudiant spécifique
     */
    async getStudentGrades(studentId, filters, auditData) {
        try {
            // Vérifier si l'étudiant existe
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    studentCode: true,
                    email: true,
                    schoolClass: {
                        select: {
                            name: true,
                            level: true,
                        },
                    },
                },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Étudiant non trouvé",
                    code: "STUDENT_NOT_FOUND",
                };
            }
            // Construction des filtres
            const where = { studentId };
            if (filters.academicYearId)
                where.academicYearId = filters.academicYearId;
            if (filters.classLevel)
                where.classLevel = filters.classLevel;
            if (filters.controlType)
                where.controlType = filters.controlType;
            if (filters.session)
                where.session = filters.session;
            if (filters.subjectId)
                where.subjectId = filters.subjectId;
            // Récupérer les notes de l'étudiant
            const grades = await prisma.grade.findMany({
                where,
                include: {
                    subject: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            coefficient: true,
                            type: true,
                            passingGrade: true,
                        },
                    },
                    classAssignment: {
                        include: {
                            professeur: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    academicYear: {
                        select: {
                            id: true,
                            year: true,
                            isCurrent: true,
                        },
                    },
                },
                orderBy: [
                    { academicYearId: "desc" },
                    { controlType: "asc" },
                    { subject: { name: "asc" } },
                ],
            });
            // Calcul des statistiques
            const statistics = this.calculateStudentGradeStatistics(grades);
            return {
                success: true,
                message: "Notes de l'étudiant récupérées avec succès",
                data: {
                    student,
                    grades,
                    statistics,
                },
            };
        }
        catch (error) {
            console.error("GradeService - getStudentGrades error:", error);
            throw error;
        }
    }
    /**
     * Importe des notes en masse
     */
    async bulkImportGrades(gradesData, academicYearId, assignmentId) {
        try {
            if (!Array.isArray(gradesData) || gradesData.length === 0) {
                return {
                    success: false,
                    message: "Aucune donnée de note fournie",
                    code: "NO_GRADES_DATA",
                };
            }
            if (!academicYearId) {
                return {
                    success: false,
                    message: "Année académique requise",
                    code: "ACADEMIC_YEAR_REQUIRED",
                };
            }
            // Valider chaque note
            const validatedGrades = [];
            const errors = [];
            for (const [index, gradeData] of gradesData.entries()) {
                try {
                    // Validation des données requises
                    if (!gradeData.studentId ||
                        !gradeData.subjectId ||
                        gradeData.grade === undefined) {
                        errors.push({
                            index,
                            error: "Données requises manquantes",
                            data: gradeData,
                        });
                        continue;
                    }
                    // Vérifier l'existence de l'étudiant et de la matière
                    const [student, subject] = await Promise.all([
                        prisma.student.findUnique({ where: { id: gradeData.studentId } }),
                        prisma.subject.findUnique({ where: { id: gradeData.subjectId } }),
                    ]);
                    if (!student) {
                        errors.push({
                            index,
                            error: "Étudiant non trouvé",
                            data: gradeData,
                        });
                        continue;
                    }
                    if (!subject) {
                        errors.push({
                            index,
                            error: "Matière non trouvée",
                            data: gradeData,
                        });
                        continue;
                    }
                    // Vérifier la plage de la note
                    const gradeNum = parseFloat(gradeData.grade.toString());
                    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
                        errors.push({
                            index,
                            error: "Note invalide (doit être entre 0 et 100)",
                            data: gradeData,
                        });
                        continue;
                    }
                    validatedGrades.push({
                        studentId: gradeData.studentId,
                        subjectId: gradeData.subjectId,
                        assignmentId: assignmentId || gradeData.assignmentId,
                        grade: gradeNum,
                        status: gradeData.status || prisma_1.GradeStatus.Valid_,
                        session: gradeData.session || prisma_1.GradeSession.Normale,
                        controlType: gradeData.controlType || prisma_1.ControlType.CONTROLE_1,
                        academicYearId,
                        classLevel: gradeData.classLevel || "Sixieme",
                        notes: gradeData.notes,
                        isActive: true,
                    });
                }
                catch (error) {
                    errors.push({
                        index,
                        error: error.message,
                        data: gradeData,
                    });
                }
            }
            if (validatedGrades.length === 0) {
                return {
                    success: false,
                    message: "Aucune note valide à importer",
                    code: "NO_VALID_GRADES",
                    data: { errors },
                };
            }
            // Importer les notes en utilisant createMany
            const result = await prisma.grade.createMany({
                data: validatedGrades,
                skipDuplicates: true,
            });
            return {
                success: true,
                message: `Importation réussie : ${result.count} notes importées`,
                data: {
                    importedCount: result.count,
                    errors,
                    totalAttempted: gradesData.length,
                },
                metadata: {
                    importedCount: result.count,
                    totalAttempted: gradesData.length,
                    errorCount: errors.length,
                },
            };
        }
        catch (error) {
            console.error("GradeService - bulkImportGrades error:", error);
            throw error;
        }
    }
    /**
     * Récupère les statistiques des notes
     */
    async getGradeStatistics(filters, auditData) {
        try {
            // Construction des filtres
            const where = { isActive: true };
            if (filters.academicYearId)
                where.academicYearId = filters.academicYearId;
            if (filters.classLevel)
                where.classLevel = filters.classLevel;
            if (filters.controlType)
                where.controlType = filters.controlType;
            if (filters.subjectId)
                where.subjectId = filters.subjectId;
            if (filters.startDate || filters.endDate) {
                where.createdAt = {};
                if (filters.startDate)
                    where.createdAt.gte = filters.startDate;
                if (filters.endDate)
                    where.createdAt.lte = filters.endDate;
            }
            // Récupérer toutes les notes avec les données nécessaires
            const grades = await prisma.grade.findMany({
                where,
                include: {
                    student: {
                        select: {
                            schoolClass: {
                                select: {
                                    name: true,
                                    level: true,
                                },
                            },
                        },
                    },
                    subject: {
                        select: {
                            name: true,
                            passingGrade: true,
                            coefficient: true,
                        },
                    },
                    academicYear: {
                        select: {
                            year: true,
                        },
                    },
                },
            });
            if (grades.length === 0) {
                return {
                    success: true,
                    message: "Aucune note trouvée pour les filtres spécifiés",
                    data: {
                        totalGrades: 0,
                        statistics: {},
                    },
                };
            }
            const statistics = this.calculateGradeStatistics(grades, filters);
            return {
                success: true,
                message: "Statistiques récupérées avec succès",
                data: { statistics },
            };
        }
        catch (error) {
            console.error("GradeService - getGradeStatistics error:", error);
            throw error;
        }
    }
    /**
     * Calcule les statistiques pour un étudiant
     * @private
     */
    calculateStudentGradeStatistics(grades) {
        const statistics = {
            totalGrades: grades.length,
            averageGrade: grades.length > 0
                ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length
                : 0,
            subjectsSummary: {},
            controlTypeSummary: {},
        };
        // Organiser par matière
        grades.forEach((grade) => {
            const subjectName = grade.subject.name;
            const controlType = grade.controlType;
            // Statistiques par matière
            if (!statistics.subjectsSummary[subjectName]) {
                statistics.subjectsSummary[subjectName] = {
                    subject: grade.subject,
                    grades: [],
                    average: 0,
                    passed: 0,
                    failed: 0,
                    total: 0,
                };
            }
            statistics.subjectsSummary[subjectName].grades.push(grade);
            statistics.subjectsSummary[subjectName].total++;
            if (grade.grade >= grade.subject.passingGrade) {
                statistics.subjectsSummary[subjectName].passed++;
            }
            else {
                statistics.subjectsSummary[subjectName].failed++;
            }
            // Statistiques par type de contrôle
            if (!statistics.controlTypeSummary[controlType]) {
                statistics.controlTypeSummary[controlType] = {
                    grades: [],
                    average: 0,
                    total: 0,
                };
            }
            statistics.controlTypeSummary[controlType].grades.push(grade);
            statistics.controlTypeSummary[controlType].total++;
        });
        // Calculer les moyennes
        Object.keys(statistics.subjectsSummary).forEach((subjectName) => {
            const subjectData = statistics.subjectsSummary[subjectName];
            subjectData.average =
                subjectData.grades.length > 0
                    ? subjectData.grades.reduce((sum, g) => sum + g.grade, 0) / subjectData.grades.length
                    : 0;
        });
        Object.keys(statistics.controlTypeSummary).forEach((controlType) => {
            const controlData = statistics.controlTypeSummary[controlType];
            controlData.average =
                controlData.grades.length > 0
                    ? controlData.grades.reduce((sum, g) => sum + g.grade, 0) / controlData.grades.length
                    : 0;
        });
        return statistics;
    }
    /**
     * Calcule les statistiques générales des notes
     * @private
     */
    calculateGradeStatistics(grades, filters) {
        const totalGrades = grades.length;
        const totalPoints = grades.reduce((sum, grade) => sum + grade.grade, 0);
        const averageGrade = totalPoints / totalGrades;
        // Statistiques par statut
        const statusStats = {
            Valid_: grades.filter((g) => g.status === "Valid_").length,
            Non_valid_: grades.filter((g) => g.status === "Non_valid_").length,
            Reprendre: grades.filter((g) => g.status === "Reprendre").length,
        };
        // Statistiques par session
        const sessionStats = {
            Normale: grades.filter((g) => g.session === prisma_1.GradeSession.Normale).length,
            Reprise: grades.filter((g) => g.session === prisma_1.GradeSession.Reprise).length,
        };
        // Statistiques par type de contrôle
        const controlTypeStats = {
            CONTROLE_1: grades.filter((g) => g.controlType === "CONTROLE_1").length,
            CONTROLE_2: grades.filter((g) => g.controlType === "CONTROLE_2").length,
            CONTROLE_3: grades.filter((g) => g.controlType === "CONTROLE_3").length,
            CONTROLE_4: grades.filter((g) => g.controlType === "CONTROLE_4").length,
        };
        // Statistiques par niveau de classe
        const classLevelStats = {};
        grades.forEach((grade) => {
            const level = grade.classLevel;
            classLevelStats[level] = (classLevelStats[level] || 0) + 1;
        });
        // Taux de réussite global
        const passedGrades = grades.filter((g) => g.grade >= g.subject.passingGrade).length;
        const successRate = (passedGrades / totalGrades) * 100;
        // Distribution des notes
        const gradeDistribution = {
            "0-39": grades.filter((g) => g.grade >= 0 && g.grade < 40).length,
            "40-59": grades.filter((g) => g.grade >= 40 && g.grade < 60).length,
            "60-69": grades.filter((g) => g.grade >= 60 && g.grade < 70).length,
            "70-79": grades.filter((g) => g.grade >= 70 && g.grade < 80).length,
            "80-89": grades.filter((g) => g.grade >= 80 && g.grade < 90).length,
            "90-100": grades.filter((g) => g.grade >= 90 && g.grade <= 100).length,
        };
        const statistics = {
            totalGrades,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            successRate: parseFloat(successRate.toFixed(2)),
            passedGrades,
            failedGrades: totalGrades - passedGrades,
            statusStats,
            sessionStats,
            controlTypeStats,
            classLevelStats,
            gradeDistribution,
            byMonth: {},
        };
        // Calculer par mois (si plus d'un mois de données)
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            const monthDiff = (end.getFullYear() - start.getFullYear()) * 12 +
                end.getMonth() -
                start.getMonth();
            if (monthDiff > 0) {
                grades.forEach((grade) => {
                    const month = grade.createdAt.toISOString().slice(0, 7); // Format YYYY-MM
                    statistics.byMonth[month] = (statistics.byMonth[month] || 0) + 1;
                });
            }
        }
        return statistics;
    }
    /**
     * Récupère les notes par classe
     */
    async getGradesByClass(classId, academicYearId, auditData) {
        try {
            const students = await prisma.student.findMany({
                where: { classId, status: "Active" },
                select: { id: true },
            });
            const studentIds = students.map((student) => student.id);
            const grades = await prisma.grade.findMany({
                where: {
                    studentId: { in: studentIds },
                    academicYearId,
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
                    subject: {
                        select: {
                            id: true,
                            name: true,
                            coefficient: true,
                        },
                    },
                },
                orderBy: [
                    { student: { lastName: "asc" } },
                    { subject: { name: "asc" } },
                ],
            });
            // Organiser les notes par étudiant
            const gradesByStudent = {};
            grades.forEach((grade) => {
                const studentId = grade.studentId;
                if (!gradesByStudent[studentId]) {
                    gradesByStudent[studentId] = {
                        student: grade.student,
                        grades: [],
                    };
                }
                gradesByStudent[studentId].grades.push(grade);
            });
            // Calculer les moyennes par étudiant
            Object.values(gradesByStudent).forEach((studentData) => {
                const total = studentData.grades.reduce((sum, g) => {
                    return sum + g.grade * g.subject.coefficient;
                }, 0);
                const totalCoefficient = studentData.grades.reduce((sum, g) => {
                    return sum + g.subject.coefficient;
                }, 0);
                studentData.average =
                    totalCoefficient > 0 ? total / totalCoefficient : 0;
            });
            return {
                success: true,
                message: "Notes par classe récupérées avec succès",
                data: {
                    gradesByStudent: Object.values(gradesByStudent),
                    totalStudents: students.length,
                    totalGrades: grades.length,
                },
            };
        }
        catch (error) {
            console.error("GradeService - getGradesByClass error:", error);
            throw error;
        }
    }
    /**
     * Récupère les notes par matière
     */
    async getGradesBySubject(subjectId, academicYearId, auditData) {
        try {
            const grades = await prisma.grade.findMany({
                where: {
                    subjectId,
                    academicYearId,
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                            schoolClass: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    classAssignment: {
                        include: {
                            professeur: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ grade: "desc" }, { student: { lastName: "asc" } }],
            });
            if (grades.length === 0) {
                return {
                    success: true,
                    message: "Aucune note trouvée pour cette matière",
                    data: { grades: [] },
                };
            }
            // Calculer les statistiques de la matière
            const subject = await prisma.subject.findUnique({
                where: { id: subjectId },
                select: {
                    name: true,
                    passingGrade: true,
                    coefficient: true,
                },
            });
            const averageGrade = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
            const passedCount = grades.filter((g) => g.grade >= subject.passingGrade).length;
            const successRate = (passedCount / grades.length) * 100;
            return {
                success: true,
                message: "Notes par matière récupérées avec succès",
                data: {
                    subject,
                    grades,
                    statistics: {
                        total: grades.length,
                        average: parseFloat(averageGrade.toFixed(2)),
                        passedCount,
                        failedCount: grades.length - passedCount,
                        successRate: parseFloat(successRate.toFixed(2)),
                        highestGrade: Math.max(...grades.map((g) => g.grade)),
                        lowestGrade: Math.min(...grades.map((g) => g.grade)),
                    },
                },
            };
        }
        catch (error) {
            console.error("GradeService - getGradesBySubject error:", error);
            throw error;
        }
    }
}
exports.GradeService = GradeService;
//# sourceMappingURL=gradeService.js.map