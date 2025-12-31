"use strict";
/**
 * @file enrollmentService.ts
 * @description Service complet pour la gestion des inscriptions avec vérification des moyennes
 * @version 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.EnrollmentService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Enums et Types
var ControlType;
(function (ControlType) {
    ControlType["CONTROLE_1"] = "CONTROLE_1";
    ControlType["CONTROLE_2"] = "CONTROLE_2";
    ControlType["CONTROLE_3"] = "CONTROLE_3";
    ControlType["CONTROLE_4"] = "CONTROLE_4";
})(ControlType || (ControlType = {}));
var ClassLevel;
(function (ClassLevel) {
    ClassLevel["Sixieme"] = "Sixieme";
    ClassLevel["Cinquieme"] = "Cinquieme";
    ClassLevel["Quatrieme"] = "Quatrieme";
    ClassLevel["Troisieme"] = "Troisieme";
    ClassLevel["Seconde"] = "Seconde";
    ClassLevel["Premiere"] = "Premiere";
    ClassLevel["Terminale"] = "Terminale";
    ClassLevel["NSI"] = "NSI";
    ClassLevel["NSII"] = "NSII";
    ClassLevel["NSIII"] = "NSIII";
    ClassLevel["NSIV"] = "NSIV";
})(ClassLevel || (ClassLevel = {}));
var GradeStatus;
(function (GradeStatus) {
    GradeStatus["Valid_"] = "Valid_";
    GradeStatus["Non_valid_"] = "Non_valid_";
    GradeStatus["Reprendre"] = "Reprendre";
})(GradeStatus || (GradeStatus = {}));
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["Active"] = "Active";
    EnrollmentStatus["Suspended"] = "Suspended";
    EnrollmentStatus["Completed"] = "Completed";
})(EnrollmentStatus || (EnrollmentStatus = {}));
/**
 * Service complet pour la gestion des inscriptions
 */
class EnrollmentService {
    // ==================== MÉTHODES PUBLIQUES ====================
    /**
     * Récupère la liste des inscriptions
     */
    async getEnrollments(filters, auditData) {
        try {
            const { page = 1, limit = 20, academicYearId, classId, studentId, status, search, sortBy = "enrollmentDate", sortOrder = "desc", } = filters;
            const pageNum = parseInt(page.toString());
            const limitNum = parseInt(limit.toString());
            const skip = (pageNum - 1) * limitNum;
            // Filtres
            const where = {};
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            if (classId) {
                where.classId = classId;
            }
            if (studentId) {
                where.studentId = studentId;
            }
            if (status && status !== "all") {
                where.status = status;
            }
            if (search) {
                where.student = {
                    OR: [
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { studentCode: { contains: search, mode: "insensitive" } },
                    ],
                };
            }
            // Récupération avec pagination
            const [enrollments, total] = await Promise.all([
                prisma.enrollment.findMany({
                    where,
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                studentCode: true,
                                email: true,
                                photo: true,
                            },
                        },
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                                capacity: true,
                            },
                        },
                        academicYear: true,
                    },
                    orderBy: {
                        [sortBy]: sortOrder === "desc" ? "desc" : "asc",
                    },
                    skip,
                    take: limitNum,
                }),
                prisma.enrollment.count({ where }),
            ]);
            return {
                success: true,
                message: "Inscriptions récupérées avec succès",
                data: {
                    enrollments,
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
            console.error("❌ EnrollmentService - getEnrollments error:", error);
            throw error;
        }
    }
    /**
     * Récupère une inscription par ID
     */
    async getEnrollmentById(id, auditData) {
        try {
            const enrollment = await prisma.enrollment.findUnique({
                where: { id },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                            email: true,
                            phone: true,
                            dateOfBirth: true,
                            photo: true,
                        },
                    },
                    schoolClass: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                            capacity: true,
                        },
                    },
                    academicYear: true,
                    previousEnrollment: {
                        include: {
                            schoolClass: true,
                            academicYear: true,
                        },
                    },
                    nextEnrollments: {
                        include: {
                            schoolClass: true,
                            academicYear: true,
                        },
                        orderBy: {
                            enrollmentDate: "desc",
                        },
                    },
                },
            });
            if (!enrollment) {
                return {
                    success: false,
                    message: "Inscription non trouvée",
                    code: "ENROLLMENT_NOT_FOUND",
                };
            }
            return {
                success: true,
                message: "Inscription récupérée avec succès",
                data: { enrollment },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getEnrollmentById error:", error);
            throw error;
        }
    }
    /**
     * Crée une nouvelle inscription avec vérification de promotion
     */
    async createEnrollment(data, auditData) {
        try {
            const { studentId, classId, academicYearId, enrollmentDate, assignFees = false, selectedFeeStructures = [], bypassPromotionCheck = false, promotionCheckReason = "", } = data;
            // Vérifier si l'étudiant existe
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                include: { schoolClass: true },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Étudiant non trouvé",
                    code: "STUDENT_NOT_FOUND",
                };
            }
            // Vérifier si la classe existe
            const schoolClass = await prisma.schoolClass.findUnique({
                where: { id: classId },
            });
            if (!schoolClass) {
                return {
                    success: false,
                    message: "Classe non trouvée",
                    code: "CLASS_NOT_FOUND",
                };
            }
            // Vérifier si l'année académique existe
            const academicYear = await prisma.academicYear.findUnique({
                where: { id: academicYearId },
            });
            if (!academicYear) {
                return {
                    success: false,
                    message: "Année académique non trouvée",
                    code: "ACADEMIC_YEAR_NOT_FOUND",
                };
            }
            // Vérifier si l'étudiant est déjà inscrit pour cette année
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    studentId_academicYearId: {
                        studentId,
                        academicYearId,
                    },
                },
            });
            if (existingEnrollment) {
                return {
                    success: false,
                    message: "Cet étudiant est déjà inscrit pour cette année académique",
                    code: "ENROLLMENT_EXISTS",
                };
            }
            // Vérifier la capacité de la classe
            const currentEnrollments = await prisma.enrollment.count({
                where: {
                    classId,
                    academicYearId,
                    status: EnrollmentStatus.Active,
                },
            });
            if (currentEnrollments >= (schoolClass.capacity || 30)) {
                return {
                    success: false,
                    message: "La classe a atteint sa capacité maximale",
                    code: "CLASS_FULL",
                    data: {
                        capacity: schoolClass.capacity,
                        current: currentEnrollments,
                    },
                };
            }
            // ============ VÉRIFICATION DE PROMOTION ============
            let promotionValidation = null;
            const isPromotion = this.isHigherLevel(schoolClass.level, student.schoolClass?.level || ClassLevel.Sixieme);
            if (isPromotion && !bypassPromotionCheck) {
                promotionValidation = await this.checkPromotionEligibility(studentId, classId, auditData);
                if (!promotionValidation.success ||
                    !promotionValidation.data.isEligible) {
                    return {
                        success: false,
                        message: "Promotion non autorisée - Résultats académiques insuffisants",
                        code: "PROMOTION_DENIED",
                        data: {
                            promotionDetails: promotionValidation.data,
                            requiredAverage: promotionValidation.data.criteria.minAverage,
                            studentAverage: promotionValidation.data.academicEvaluation.finalAverage,
                            failedSubjects: promotionValidation.data.academicEvaluation.failedSubjects,
                            allowedFailures: promotionValidation.data.criteria.maxFailures,
                            financialBalance: promotionValidation.data.financialCheck.balance,
                        },
                        metadata: {
                            canOverride: true,
                            overridePermission: "OVERRIDE_PROMOTION",
                        },
                    };
                }
            }
            else if (isPromotion && bypassPromotionCheck) {
                // Journaliser la dérogation
                await prisma.promotionOverrideLog.create({
                    data: {
                        studentId,
                        targetClassLevel: schoolClass.level,
                        reason: promotionCheckReason,
                        overrideBy: auditData.userId,
                        overrideDate: new Date(),
                    },
                });
            }
            // Créer l'inscription
            const enrollment = await prisma.enrollment.create({
                data: {
                    studentId,
                    classId,
                    academicYearId,
                    enrollmentDate: enrollmentDate
                        ? new Date(enrollmentDate)
                        : new Date(),
                    status: EnrollmentStatus.Active,
                    isReenrollment: false,
                },
                include: {
                    student: true,
                    schoolClass: true,
                    academicYear: true,
                },
            });
            // Mettre à jour la classe de l'étudiant
            await prisma.student.update({
                where: { id: studentId },
                data: {
                    classId,
                    status: "Active",
                },
            });
            // Gérer l'attribution des frais
            let feeAssignmentResult = null;
            if (assignFees) {
                feeAssignmentResult = await this.assignFeesOnEnrollment(studentId, academicYearId, selectedFeeStructures);
            }
            return {
                success: true,
                message: "Inscription créée avec succès",
                data: {
                    enrollment,
                    ...(feeAssignmentResult && { feeAssignment: feeAssignmentResult }),
                    ...(promotionValidation && {
                        promotionValidation: promotionValidation.data,
                    }),
                },
                metadata: {
                    studentId,
                    classId,
                    academicYearId,
                    studentCode: student.studentCode,
                    className: schoolClass.name,
                    feesAssigned: assignFees,
                    feeStructures: selectedFeeStructures.length,
                    isPromotion,
                    promotionChecked: true,
                    promotionEligible: promotionValidation?.data?.isEligible ?? true,
                    promotionBypassed: bypassPromotionCheck,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - createEnrollment error:", error);
            throw error;
        }
    }
    /**
     * Met à jour une inscription
     */
    async updateEnrollment(id, data, auditData) {
        try {
            const { classId, status, notes } = data;
            // Vérifier si l'inscription existe
            const enrollment = await prisma.enrollment.findUnique({
                where: { id },
                include: {
                    student: true,
                },
            });
            if (!enrollment) {
                return {
                    success: false,
                    message: "Inscription non trouvée",
                    code: "ENROLLMENT_NOT_FOUND",
                };
            }
            // Vérifier si la nouvelle classe existe (si changement)
            if (classId && classId !== enrollment.classId) {
                const schoolClass = await prisma.schoolClass.findUnique({
                    where: { id: classId },
                });
                if (!schoolClass) {
                    return {
                        success: false,
                        message: "Nouvelle classe non trouvée",
                        code: "CLASS_NOT_FOUND",
                    };
                }
                // Vérifier la capacité de la nouvelle classe
                const currentEnrollments = await prisma.enrollment.count({
                    where: {
                        classId,
                        academicYearId: enrollment.academicYearId,
                        status: EnrollmentStatus.Active,
                    },
                });
                if (currentEnrollments >= (schoolClass.capacity || 30)) {
                    return {
                        success: false,
                        message: "La nouvelle classe a atteint sa capacité maximale",
                        code: "CLASS_FULL",
                        data: {
                            capacity: schoolClass.capacity,
                            current: currentEnrollments,
                        },
                    };
                }
            }
            // Mettre à jour
            const updateData = {};
            if (typeof classId !== "undefined") {
                updateData.classId = classId;
            }
            if (typeof status !== "undefined") {
                updateData.status = status;
            }
            if (notes) {
                updateData.notes = notes;
            }
            const updatedEnrollment = await prisma.enrollment.update({
                where: { id },
                data: updateData,
                include: {
                    student: true,
                    schoolClass: true,
                    academicYear: true,
                },
            });
            // Mettre à jour la classe de l'étudiant si nécessaire
            if (classId && classId !== enrollment.classId) {
                await prisma.student.update({
                    where: { id: enrollment.studentId },
                    data: {
                        classId,
                    },
                });
            }
            return {
                success: true,
                message: "Inscription mise à jour avec succès",
                data: { enrollment: updatedEnrollment },
                metadata: {
                    oldStatus: enrollment.status,
                    newStatus: status,
                    oldClassId: enrollment.classId,
                    newClassId: classId,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - updateEnrollment error:", error);
            throw error;
        }
    }
    /**
     * Désinscrit un étudiant
     */
    async unenrollStudent(id, reason, auditData) {
        try {
            // Vérifier si l'inscription existe
            const enrollment = await prisma.enrollment.findUnique({
                where: { id },
                include: {
                    student: true,
                },
            });
            if (!enrollment) {
                return {
                    success: false,
                    message: "Inscription non trouvée",
                    code: "ENROLLMENT_NOT_FOUND",
                };
            }
            // Désinscrire
            const updatedEnrollment = await prisma.enrollment.update({
                where: { id },
                data: {
                    status: EnrollmentStatus.Suspended,
                },
            });
            // Mettre à jour le statut de l'étudiant
            await prisma.student.update({
                where: { id: enrollment.studentId },
                data: {
                    status: "Inactive",
                },
            });
            // Journaliser la désinscription
            await prisma.auditLog.create({
                data: {
                    action: "UNENROLL_STUDENT",
                    entity: "Enrollment",
                    entityId: id,
                    description: `Désinscription de l'étudiant ${enrollment.student.studentCode}`,
                    oldData: { status: enrollment.status },
                    newData: { status: EnrollmentStatus.Suspended },
                    userId: auditData.userId,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent,
                    metadata: { reason },
                },
            });
            return {
                success: true,
                message: "Étudiant désinscrit avec succès",
                data: { enrollment: updatedEnrollment },
                metadata: {
                    studentCode: enrollment.student.studentCode,
                    reason,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - unenrollStudent error:", error);
            throw error;
        }
    }
    /**
     * Gère la réinscription d'un étudiant avec vérification académique
     */
    async reenrollStudent(data, auditData) {
        try {
            const { studentId, classId, academicYearId, enrollmentDate, notes, bypassAcademicCheck = false, academicCheckReason = "", } = data;
            // Vérifier si l'étudiant existe
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                include: { schoolClass: true },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Étudiant non trouvé",
                    code: "STUDENT_NOT_FOUND",
                };
            }
            // Récupérer l'année académique précédente
            const previousYear = await prisma.academicYear.findFirst({
                where: {
                    isCurrent: false,
                },
                orderBy: {
                    startDate: "desc",
                },
            });
            if (!previousYear) {
                return {
                    success: false,
                    message: "Aucune année académique précédente trouvée",
                    code: "NO_PREVIOUS_YEAR",
                };
            }
            // Vérifier l'inscription précédente
            const previousEnrollment = await prisma.enrollment.findUnique({
                where: {
                    studentId_academicYearId: {
                        studentId,
                        academicYearId: previousYear.id,
                    },
                },
                include: {
                    schoolClass: true,
                },
            });
            if (!previousEnrollment) {
                return {
                    success: false,
                    message: "L'étudiant n'était pas inscrit l'année précédente",
                    code: "NO_PREVIOUS_ENROLLMENT",
                };
            }
            // Vérifier l'année académique cible
            const targetYear = await prisma.academicYear.findUnique({
                where: { id: academicYearId },
            });
            if (!targetYear) {
                return {
                    success: false,
                    message: "Année académique cible non trouvée",
                    code: "TARGET_YEAR_NOT_FOUND",
                };
            }
            // Vérifier si l'étudiant est déjà inscrit pour cette année
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    studentId_academicYearId: {
                        studentId,
                        academicYearId: targetYear.id,
                    },
                },
            });
            if (existingEnrollment) {
                return {
                    success: false,
                    message: "L'étudiant est déjà inscrit pour cette année",
                    code: "ALREADY_ENROLLED",
                };
            }
            // Vérifier si la classe existe
            const schoolClass = await prisma.schoolClass.findUnique({
                where: { id: classId },
            });
            if (!schoolClass) {
                return {
                    success: false,
                    message: "Classe non trouvée",
                    code: "CLASS_NOT_FOUND",
                };
            }
            // Vérifier la capacité de la classe
            const currentEnrollments = await prisma.enrollment.count({
                where: {
                    classId,
                    academicYearId: targetYear.id,
                    status: EnrollmentStatus.Active,
                },
            });
            if (currentEnrollments >= (schoolClass.capacity || 30)) {
                return {
                    success: false,
                    message: "La classe a atteint sa capacité maximale",
                    code: "CLASS_FULL",
                };
            }
            // ============ VÉRIFICATION DES RÉSULTATS ACADÉMIQUES ============
            if (!bypassAcademicCheck) {
                const academicEvaluation = await this.evaluateAcademicPerformance(studentId, previousYear.id, schoolClass.level);
                if (!academicEvaluation.hasValidatedYear) {
                    return {
                        success: false,
                        message: "L'étudiant n'a pas validé son année académique précédente",
                        code: "ACADEMIC_YEAR_NOT_VALIDATED",
                        data: {
                            academicEvaluation,
                            student: {
                                id: student.id,
                                name: `${student.firstName} ${student.lastName}`,
                                studentCode: student.studentCode,
                            },
                            previousClass: previousEnrollment.schoolClass.name,
                            targetClass: schoolClass.name,
                        },
                        metadata: {
                            canOverride: true,
                            overridePermission: "OVERRIDE_ACADEMIC_VALIDATION",
                        },
                    };
                }
            }
            else {
                // Journaliser la dérogation
                await prisma.promotionOverrideLog.create({
                    data: {
                        studentId,
                        targetClassLevel: schoolClass.level,
                        reason: `Réinscription avec bypass académique: ${academicCheckReason}`,
                        overrideBy: auditData.userId,
                        overrideDate: new Date(),
                    },
                });
            }
            // Calculer les frais de réinscription
            const reenrollmentFee = await this.calculateReenrollmentFee(studentId, previousYear.id, targetYear.id);
            // Créer la réinscription
            const enrollment = await prisma.enrollment.create({
                data: {
                    studentId,
                    classId,
                    academicYearId: targetYear.id,
                    enrollmentDate: enrollmentDate
                        ? new Date(enrollmentDate)
                        : new Date(),
                    status: EnrollmentStatus.Active,
                    isReenrollment: true,
                    previousEnrollmentId: previousEnrollment.id,
                    reenrollmentDate: new Date(),
                    reenrollmentNotes: notes,
                },
                include: {
                    student: true,
                    schoolClass: true,
                    academicYear: true,
                    previousEnrollment: true,
                },
            });
            // Mettre à jour la classe de l'étudiant
            await prisma.student.update({
                where: { id: studentId },
                data: {
                    classId,
                    status: "Active",
                },
            });
            // Créer un paiement pour les frais de réinscription
            if (reenrollmentFee.amount > 0) {
                await prisma.feePayment.create({
                    data: {
                        studentId,
                        amount: reenrollmentFee.amount,
                        paidDate: new Date(),
                        paymentMethod: "Bank",
                        status: "Pending",
                        description: `Frais de réinscription - ${targetYear.year}`,
                        type: "Tuition",
                        academicYearId: targetYear.id,
                    },
                });
            }
            // Mettre à jour l'inscription précédente
            await prisma.enrollment.update({
                where: { id: previousEnrollment.id },
                data: {
                    nextEnrollments: {
                        connect: { id: enrollment.id },
                    },
                },
            });
            // Créer les frais de scolarité pour la nouvelle année
            await this.createStudentFees(studentId, targetYear.id);
            return {
                success: true,
                message: "Étudiant réinscrit avec succès",
                data: {
                    enrollment,
                    reenrollmentFee,
                },
                metadata: {
                    studentId,
                    classId,
                    academicYearId: targetYear.id,
                    reenrollmentFee: reenrollmentFee.amount,
                    notes,
                    academicCheckBypassed: bypassAcademicCheck,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - reenrollStudent error:", error);
            throw error;
        }
    }
    /**
     * Vérifie l'éligibilité à la promotion
     */
    async checkPromotionEligibility(studentId, targetClassId, auditData) {
        try {
            // 1. Récupérer l'étudiant
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                include: { schoolClass: true },
            });
            if (!student) {
                return {
                    success: false,
                    message: "Étudiant non trouvé",
                    code: "STUDENT_NOT_FOUND",
                };
            }
            // 2. Récupérer la classe cible
            const targetClass = await prisma.schoolClass.findUnique({
                where: { id: targetClassId },
            });
            if (!targetClass) {
                return {
                    success: false,
                    message: "Classe cible non trouvée",
                    code: "TARGET_CLASS_NOT_FOUND",
                };
            }
            // 3. Vérifier si c'est une promotion
            const isPromotion = this.isHigherLevel(targetClass.level, student.schoolClass?.level || ClassLevel.Sixieme);
            if (!isPromotion) {
                return {
                    success: true,
                    message: "Aucune vérification de promotion nécessaire",
                    data: {
                        requiresPromotionCheck: false,
                        eligible: true,
                        reason: "Même niveau ou niveau inférieur",
                    },
                };
            }
            // 4. Récupérer l'année académique précédente
            const previousYear = await prisma.academicYear.findFirst({
                where: { isCurrent: false },
                orderBy: { startDate: "desc" },
            });
            if (!previousYear) {
                return {
                    success: false,
                    message: "Aucune année académique précédente trouvée",
                    code: "NO_PREVIOUS_YEAR",
                };
            }
            // 5. Évaluer la performance académique
            const academicEvaluation = await this.evaluateAcademicPerformance(studentId, previousYear.id, targetClass.level);
            // 6. Vérifier la situation financière
            const financialCheck = await this.checkFinancialClearance(studentId, previousYear.id, targetClass.level);
            // 7. Récupérer les critères de promotion
            const criteria = await this.getPromotionCriteria(targetClass.level);
            // 8. Évaluer l'éligibilité
            let isEligible = true;
            const rejectionReasons = [];
            const recommendations = [];
            // Vérifier les résultats académiques
            if (!academicEvaluation.hasValidatedYear) {
                isEligible = false;
                rejectionReasons.push(...academicEvaluation.reasons);
                recommendations.push(...academicEvaluation.recommendations);
            }
            // Vérifier la situation financière
            if (criteria.requiresFinancialClearance && !financialCheck.isClear) {
                isEligible = false;
                rejectionReasons.push(`Solde financier impayé: ${financialCheck.balance} FCFA`);
                recommendations.push(`Régler le solde impayé de ${financialCheck.balance} FCFA`);
            }
            // 9. Préparer le résultat
            const result = {
                isEligible,
                academicEvaluation,
                financialCheck,
                criteria,
                summary: {
                    student: {
                        id: student.id,
                        name: `${student.firstName} ${student.lastName}`,
                        studentCode: student.studentCode,
                        currentClass: student.schoolClass?.name,
                    },
                    targetClass: {
                        id: targetClass.id,
                        name: targetClass.name,
                        level: targetClass.level,
                    },
                    decision: isEligible ? "APPROVED" : "REJECTED",
                    reasons: rejectionReasons,
                    recommendations,
                    details: {
                        average: academicEvaluation.finalAverage,
                        requiredAverage: criteria.minAverage,
                        failedSubjects: academicEvaluation.failedSubjects,
                        allowedFailures: criteria.maxFailures,
                        financialBalance: financialCheck.balance,
                        financialClearanceRequired: criteria.requiresFinancialClearance,
                    },
                },
            };
            return {
                success: true,
                message: isEligible
                    ? "Étudiant éligible pour la promotion"
                    : "Étudiant non éligible pour la promotion",
                data: result,
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - checkPromotionEligibility error:", error);
            throw error;
        }
    }
    /**
     * Récupère les inscriptions d'un étudiant
     */
    async getStudentEnrollments(studentId, auditData) {
        try {
            const enrollments = await prisma.enrollment.findMany({
                where: { studentId },
                include: {
                    schoolClass: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                        },
                    },
                    academicYear: true,
                },
                orderBy: {
                    enrollmentDate: "desc",
                },
            });
            return {
                success: true,
                message: "Historique des inscriptions récupéré",
                data: { enrollments },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getStudentEnrollments error:", error);
            throw error;
        }
    }
    /**
     * Récupère les statistiques d'inscription
     */
    async getEnrollmentStats(academicYearId, auditData) {
        try {
            const where = {};
            if (academicYearId) {
                where.academicYearId = academicYearId;
            }
            // Statistiques par classe - convertir BigInt en Number
            const classStats = await prisma.enrollment.groupBy({
                by: ["classId"],
                where,
                _count: {
                    id: true,
                },
            });
            // Convertir BigInt en Number pour la sérialisation JSON
            const serializableClassStats = classStats.map((stat) => ({
                classId: stat.classId,
                count: Number(stat._count.id), // Convertir BigInt en Number
            }));
            // Statistiques par statut
            const statusStats = await prisma.enrollment.groupBy({
                by: ["status"],
                where,
                _count: {
                    id: true,
                },
            });
            const serializableStatusStats = statusStats.reduce((acc, stat) => {
                acc[stat.status] = Number(stat._count.id); // Convertir BigInt en Number
                return acc;
            }, {});
            // Total d'inscriptions - peut aussi être un BigInt
            const total = await prisma.enrollment.count({ where });
            // Inscriptions ce mois-ci
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const thisMonth = await prisma.enrollment.count({
                where: {
                    ...where,
                    enrollmentDate: {
                        gte: startOfMonth,
                    },
                },
            });
            // Tendances (30 derniers jours)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            let trendData;
            try {
                // Utiliser une approche différente pour éviter les BigInt
                const trendQuery = academicYearId
                    ? prisma_1.Prisma.sql `
            SELECT 
              DATE(enrollmentDate) as date,
              CAST(COUNT(*) AS UNSIGNED) as count
            FROM enrollments
            WHERE enrollmentDate >= ${thirtyDaysAgo}
            AND academicYearId = ${academicYearId}
            GROUP BY DATE(enrollmentDate)
            ORDER BY date
          `
                    : prisma_1.Prisma.sql `
            SELECT 
              DATE(enrollmentDate) as date,
              CAST(COUNT(*) AS UNSIGNED) as count
            FROM enrollments
            WHERE enrollmentDate >= ${thirtyDaysAgo}
            GROUP BY DATE(enrollmentDate)
            ORDER BY date
          `;
                const rawTrendData = await prisma.$queryRaw(trendQuery);
                // Convertir les BigInt en Number
                trendData = rawTrendData.map((item) => ({
                    date: item.date,
                    count: Number(item.count), // Convertir BigInt en Number
                }));
            }
            catch (error) {
                console.error("Error fetching trend data:", error);
                trendData = [];
            }
            // Statistiques par niveau de classe
            const levelStats = await prisma.$queryRaw `
      SELECT 
        sc.level as level,
        CAST(COUNT(e.id) AS UNSIGNED) as count
      FROM enrollments e
      JOIN school_classes sc ON e.classId = sc.id
      ${academicYearId ? prisma_1.Prisma.sql `WHERE e.academicYearId = ${academicYearId}` : prisma_1.Prisma.sql ``}
      GROUP BY sc.level
      ORDER BY count DESC
    `;
            const serializableLevelStats = levelStats.map((stat) => ({
                level: stat.level,
                count: Number(stat.count),
            }));
            // Statistiques par réinscription
            const reenrollmentStats = await prisma.$queryRaw `
      SELECT 
        isReenrollment,
        CAST(COUNT(id) AS UNSIGNED) as count
      FROM enrollments
      ${academicYearId ? prisma_1.Prisma.sql `WHERE academicYearId = ${academicYearId}` : prisma_1.Prisma.sql ``}
      GROUP BY isReenrollment
    `;
            const serializableReenrollmentStats = {
                reenrollments: Number(reenrollmentStats.find((s) => s.isReenrollment === true)?.count || 0n),
                newEnrollments: Number(reenrollmentStats.find((s) => s.isReenrollment === false)?.count || 0n),
            };
            const stats = {
                total: Number(total), // Convertir BigInt en Number
                thisMonth: Number(thisMonth), // Convertir BigInt en Number
                byClass: serializableClassStats,
                byStatus: serializableStatusStats,
                byLevel: serializableLevelStats,
                reenrollmentStats: serializableReenrollmentStats,
                trends: trendData,
                // Ajouter des pourcentages
                percentages: {
                    activeRate: serializableStatusStats["Active"]
                        ? ((serializableStatusStats["Active"] / Number(total)) *
                            100).toFixed(1)
                        : "0.0",
                    reenrollmentRate: serializableReenrollmentStats.reenrollments
                        ? ((serializableReenrollmentStats.reenrollments / Number(total)) *
                            100).toFixed(1)
                        : "0.0",
                },
            };
            return {
                success: true,
                message: "Statistiques récupérées",
                data: { stats },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getEnrollmentStats error:", error);
            // Retourner des statistiques par défaut en cas d'erreur
            return {
                success: false,
                message: "Erreur lors de la récupération des statistiques",
                code: "STATS_ERROR",
                data: {
                    stats: {
                        total: 0,
                        thisMonth: 0,
                        byClass: [],
                        byStatus: {},
                        byLevel: [],
                        reenrollmentStats: { reenrollments: 0, newEnrollments: 0 },
                        trends: [],
                        percentages: { activeRate: "0.0", reenrollmentRate: "0.0" },
                    },
                },
            };
        }
    }
    /**
     * Crée des inscriptions en masse
     */
    async createBulkEnrollments(enrollments, auditData) {
        try {
            if (!Array.isArray(enrollments) || enrollments.length === 0) {
                return {
                    success: false,
                    message: "Aucune donnée d'inscription fournie",
                    code: "NO_DATA",
                };
            }
            const results = {
                success: [],
                failed: [],
            };
            // Traiter chaque inscription
            for (const enrollmentData of enrollments) {
                try {
                    const { studentId, classId, academicYearId, enrollmentDate, assignFees = false, } = enrollmentData;
                    // Vérifications
                    const student = await prisma.student.findUnique({
                        where: { id: studentId },
                        include: { schoolClass: true },
                    });
                    if (!student) {
                        results.failed.push({
                            studentId,
                            error: "Étudiant non trouvé",
                        });
                        continue;
                    }
                    const schoolClass = await prisma.schoolClass.findUnique({
                        where: { id: classId },
                    });
                    if (!schoolClass) {
                        results.failed.push({
                            studentId,
                            error: "Classe non trouvée",
                        });
                        continue;
                    }
                    // Vérifier si déjà inscrit
                    const existing = await prisma.enrollment.findUnique({
                        where: {
                            studentId_academicYearId: {
                                studentId,
                                academicYearId,
                            },
                        },
                    });
                    if (existing) {
                        results.failed.push({
                            studentId,
                            error: "Déjà inscrit",
                        });
                        continue;
                    }
                    // Vérifier la capacité de la classe
                    const currentEnrollments = await prisma.enrollment.count({
                        where: {
                            classId,
                            academicYearId,
                            status: EnrollmentStatus.Active,
                        },
                    });
                    if (currentEnrollments >= (schoolClass.capacity || 30)) {
                        results.failed.push({
                            studentId,
                            error: "Classe pleine",
                        });
                        continue;
                    }
                    // Créer l'inscription
                    const enrollment = await prisma.enrollment.create({
                        data: {
                            studentId,
                            classId,
                            academicYearId,
                            enrollmentDate: enrollmentDate
                                ? new Date(enrollmentDate)
                                : new Date(),
                            status: EnrollmentStatus.Active,
                            isReenrollment: false,
                        },
                        include: {
                            student: true,
                            schoolClass: true,
                        },
                    });
                    // Mettre à jour la classe de l'étudiant
                    await prisma.student.update({
                        where: { id: studentId },
                        data: { classId },
                    });
                    // Créer les frais de scolarité
                    if (assignFees) {
                        await this.createStudentFees(studentId, academicYearId);
                    }
                    results.success.push({
                        enrollment,
                        student: {
                            name: `${student.firstName} ${student.lastName}`,
                            studentCode: student.studentCode,
                        },
                    });
                }
                catch (error) {
                    results.failed.push({
                        studentId: enrollmentData.studentId,
                        error: error.message,
                    });
                }
            }
            return {
                success: true,
                message: "Inscriptions en masse terminées",
                data: { results },
                metadata: {
                    total: enrollments.length,
                    successCount: results.success.length,
                    failedCount: results.failed.length,
                    successRate: (results.success.length / enrollments.length) * 100,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - createBulkEnrollments error:", error);
            throw error;
        }
    }
    /**
     * Récupère l'historique complet des inscriptions d'un étudiant
     */
    async getEnrollmentHistory(studentId, auditData) {
        try {
            const enrollments = await prisma.enrollment.findMany({
                where: { studentId },
                include: {
                    schoolClass: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                        },
                    },
                    academicYear: true,
                    previousEnrollment: {
                        select: {
                            id: true,
                            enrollmentDate: true,
                            schoolClass: {
                                select: {
                                    name: true,
                                    level: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    enrollmentDate: "asc",
                },
            });
            // Construire la chaîne d'inscriptions
            const history = [];
            const enrollmentMap = new Map();
            enrollments.forEach((enrollment) => {
                enrollmentMap.set(enrollment.id, { ...enrollment, next: null });
            });
            // Construire la chaîne
            enrollments.forEach((enrollment) => {
                if (enrollment.previousEnrollmentId) {
                    const previous = enrollmentMap.get(enrollment.previousEnrollmentId);
                    if (previous) {
                        previous.next = enrollment;
                    }
                }
            });
            // Trouver la première inscription
            const firstEnrollment = enrollments.find((e) => !e.previousEnrollmentId);
            // Parcourir la chaîne
            let current = firstEnrollment;
            while (current) {
                history.push({
                    id: current.id,
                    enrollmentDate: current.enrollmentDate,
                    academicYear: current.academicYear.year,
                    className: current.schoolClass.name,
                    classLevel: current.schoolClass.level,
                    status: current.status,
                    isReenrollment: current.isReenrollment,
                });
                // Trouver la prochaine inscription
                const next = enrollments.find((e) => e.previousEnrollmentId === current?.id);
                current = next;
            }
            return {
                success: true,
                message: "Historique des inscriptions récupéré",
                data: {
                    history,
                    total: history.length,
                },
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getEnrollmentHistory error:", error);
            throw error;
        }
    }
    /**
     * Récupère le bulletin détaillé d'un étudiant
     */
    async getStudentReportCard(studentId, academicYearId, auditData) {
        try {
            // Récupérer l'étudiant
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                include: {
                    schoolClass: true,
                    enrollments: {
                        where: { academicYearId },
                        include: { schoolClass: true },
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
            // Récupérer l'année académique
            const academicYear = await prisma.academicYear.findUnique({
                where: { id: academicYearId },
            });
            if (!academicYear) {
                return {
                    success: false,
                    message: "Année académique non trouvée",
                    code: "ACADEMIC_YEAR_NOT_FOUND",
                };
            }
            // Évaluer la performance
            const enrollment = student.enrollments[0];
            const targetLevel = enrollment?.schoolClass?.level || ClassLevel.Sixieme;
            const academicEvaluation = await this.evaluateAcademicPerformance(studentId, academicYearId, targetLevel);
            // Récupérer les critères
            const criteria = await this.getPromotionCriteria(targetLevel);
            // Calculer les classements
            const subjectRankings = await this.calculateSubjectRankings(studentId, academicYearId, academicEvaluation.subjects);
            const overallRank = await this.calculateOverallRank(studentId, academicYearId);
            // Préparer le bulletin
            const reportCard = {
                student: {
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    studentCode: student.studentCode,
                    photo: student.photo ?? undefined,
                    class: student.schoolClass?.name,
                },
                academicYear: {
                    id: academicYear.id,
                    year: academicYear.year,
                    startDate: academicYear.startDate,
                    endDate: academicYear.endDate,
                },
                evaluation: academicEvaluation,
                criteria,
                subjectRankings,
                overallRank,
                decision: academicEvaluation.hasValidatedYear ? "VALIDÉ" : "NON VALIDÉ",
                nextSteps: academicEvaluation.recommendations,
            };
            return {
                success: true,
                message: "Bulletin récupéré avec succès",
                data: reportCard,
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getStudentReportCard error:", error);
            throw error;
        }
    }
    /**
     * Récupère les statistiques de classe
     */
    async getClassStatistics(classId, academicYearId, auditData) {
        try {
            // Récupérer tous les étudiants de la classe
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    classId,
                    academicYearId,
                    status: EnrollmentStatus.Active,
                },
                include: {
                    student: true,
                    schoolClass: true,
                },
            });
            const statistics = {
                classInfo: {
                    id: classId,
                    name: enrollments[0]?.schoolClass.name || "Classe inconnue",
                    level: enrollments[0]?.schoolClass.level || ClassLevel.Sixieme,
                    totalStudents: enrollments.length,
                },
                academicYear: await prisma.academicYear.findUnique({
                    where: { id: academicYearId },
                }),
                averages: {
                    classAverage: 0,
                    subjectAverages: [],
                },
                distribution: {
                    excellent: 0, // >= 16
                    good: 0, // 14 - 15.9
                    average: 0, // 12 - 13.9
                    belowAverage: 0, // 10 - 11.9
                    failing: 0, // < 10
                },
                promotionRates: {
                    eligible: 0,
                    notEligible: 0,
                    pending: 0,
                },
                topStudents: [],
                strugglingStudents: [],
            };
            // Calculer les moyennes par étudiant
            const studentAverages = [];
            for (const enrollment of enrollments) {
                const evaluation = await this.evaluateAcademicPerformance(enrollment.studentId, academicYearId, enrollment.schoolClass.level);
                const average = evaluation.finalAverage;
                studentAverages.push({
                    name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
                    average,
                    studentId: enrollment.studentId,
                });
                // Classer selon la moyenne
                if (average >= 16)
                    statistics.distribution.excellent++;
                else if (average >= 14)
                    statistics.distribution.good++;
                else if (average >= 12)
                    statistics.distribution.average++;
                else if (average >= 10)
                    statistics.distribution.belowAverage++;
                else
                    statistics.distribution.failing++;
                // Vérifier l'éligibilité à la promotion
                const criteria = await this.getPromotionCriteria(enrollment.schoolClass.level);
                const isEligible = evaluation.finalAverage >= criteria.minAverage &&
                    evaluation.failedSubjects <= criteria.maxFailures;
                if (isEligible)
                    statistics.promotionRates.eligible++;
                else
                    statistics.promotionRates.notEligible++;
            }
            // Calculer la moyenne de classe
            statistics.averages.classAverage =
                studentAverages.length > 0
                    ? studentAverages.reduce((sum, sa) => sum + sa.average, 0) /
                        studentAverages.length
                    : 0;
            // Trier les étudiants
            studentAverages.sort((a, b) => b.average - a.average);
            // Top 3 étudiants
            statistics.topStudents = studentAverages.slice(0, 3).map((sa) => ({
                name: sa.name,
                average: sa.average,
            }));
            // Étudiants en difficulté
            statistics.strugglingStudents = studentAverages
                .filter((sa) => sa.average < 10)
                .map((sa) => ({
                name: sa.name,
                average: sa.average,
                reasons: ["Moyenne insuffisante"],
            }));
            return {
                success: true,
                message: "Statistiques de classe récupérées",
                data: statistics,
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - getClassStatistics error:", error);
            throw error;
        }
    }
    /**
     * Génère un rapport de fin d'année
     */
    async generateYearEndReport(classId, academicYearId, auditData) {
        try {
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    classId,
                    academicYearId,
                    status: EnrollmentStatus.Active,
                },
                include: {
                    student: true,
                    schoolClass: true,
                },
            });
            const report = {
                classInfo: {
                    id: classId,
                    name: enrollments[0]?.schoolClass.name || "Classe inconnue",
                    level: enrollments[0]?.schoolClass.level || ClassLevel.Sixieme,
                    totalStudents: enrollments.length,
                },
                academicYear: await prisma.academicYear.findUnique({
                    where: { id: academicYearId },
                }),
                students: [],
                summary: {
                    classAverage: 0,
                    promotionRate: 0,
                    successRate: 0,
                    topStudents: [],
                    strugglingStudents: [],
                },
            };
            const studentResults = [];
            for (const enrollment of enrollments) {
                const evaluation = await this.evaluateAcademicPerformance(enrollment.studentId, academicYearId, enrollment.schoolClass.level);
                const criteria = await this.getPromotionCriteria(enrollment.schoolClass.level);
                const promotionEligible = evaluation.hasValidatedYear;
                studentResults.push({
                    studentId: enrollment.studentId,
                    name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
                    studentCode: enrollment.student.studentCode,
                    average: evaluation.finalAverage,
                    passed: evaluation.finalAverage >= 10,
                    promotionEligible,
                    subjects: evaluation.subjects.map((subject) => ({
                        name: subject.subjectName,
                        grade: subject.normalizedGrade,
                        passed: subject.passed,
                    })),
                    recommendations: evaluation.recommendations,
                });
            }
            // Trier par moyenne
            studentResults.sort((a, b) => b.average - a.average);
            report.students = studentResults;
            report.summary.classAverage =
                studentResults.length > 0
                    ? studentResults.reduce((sum, s) => sum + s.average, 0) /
                        studentResults.length
                    : 0;
            report.summary.promotionRate =
                studentResults.length > 0
                    ? (studentResults.filter((s) => s.promotionEligible).length /
                        studentResults.length) *
                        100
                    : 0;
            report.summary.successRate =
                studentResults.length > 0
                    ? (studentResults.filter((s) => s.passed).length /
                        studentResults.length) *
                        100
                    : 0;
            report.summary.topStudents = studentResults.slice(0, 3).map((s) => ({
                name: s.name,
                average: s.average,
            }));
            report.summary.strugglingStudents = studentResults
                .filter((s) => s.average < 10 || !s.promotionEligible)
                .map((s) => ({
                name: s.name,
                average: s.average,
                reasons: s.recommendations,
            }));
            return {
                success: true,
                message: "Rapport de fin d'année généré",
                data: report,
            };
        }
        catch (error) {
            console.error("❌ EnrollmentService - generateYearEndReport error:", error);
            throw error;
        }
    }
    // ==================== MÉTHODES PRIVÉES ====================
    /**
     * Récupère les critères de promotion pour un niveau
     */
    async getPromotionCriteria(level) {
        try {
            // Dans une vraie implémentation, vous récupéreriez depuis la base
            // Pour l'instant, retournons des valeurs par défaut
            return {
                minAverage: 50.0,
                maxFailures: 2,
                attendanceThreshold: 0.75,
                requiresFinancialClearance: true,
                criticalSubjects: [],
            };
        }
        catch (error) {
            console.error("Error getting promotion criteria:", error);
            return {
                minAverage: 50.0,
                maxFailures: 2,
                attendanceThreshold: 0.75,
                requiresFinancialClearance: true,
                criticalSubjects: [],
            };
        }
    }
    /**
     * Récupère la configuration des contrôles
     */
    async getControlConfigs(academicYearId) {
        return [
            { controlType: ControlType.CONTROLE_1, weight: 0.2, isFinal: false },
            { controlType: ControlType.CONTROLE_2, weight: 0.2, isFinal: false },
            { controlType: ControlType.CONTROLE_3, weight: 0.2, isFinal: false },
            { controlType: ControlType.CONTROLE_4, weight: 0.4, isFinal: true },
        ];
    }
    /**
     * Normalise une note selon sa base
     */
    normalizeGrade(grade, baseGrade) {
        if (baseGrade === 20)
            return grade;
        return (grade / baseGrade) * 20;
    }
    /**
     * Évalue la performance académique complète
     */
    async evaluateAcademicPerformance(studentId, academicYearId, targetLevel) {
        // Récupérer toutes les notes
        const grades = await prisma.grade.findMany({
            where: {
                studentId,
                academicYearId,
                isActive: true,
                status: GradeStatus.Valid_,
            },
            include: {
                subject: true,
            },
        });
        if (grades.length === 0) {
            return {
                studentId,
                academicYearId,
                controls: [],
                subjects: [],
                totalCoefficient: 0,
                totalWeightedGrade: 0,
                finalAverage: 0,
                passedSubjects: 0,
                failedSubjects: 0,
                criticalSubjectsPassed: false,
                hasValidatedYear: false,
                reasons: ["Aucune note disponible"],
                recommendations: ["Vérifier les notes saisies"],
            };
        }
        // Configuration des contrôles
        const controlWeights = await this.getControlConfigs(academicYearId);
        // Grouper les notes par matière
        const gradesBySubject = new Map();
        grades.forEach((grade) => {
            if (!gradesBySubject.has(grade.subjectId)) {
                gradesBySubject.set(grade.subjectId, []);
            }
            gradesBySubject.get(grade.subjectId).push({
                id: grade.id,
                grade: grade.grade,
                controlType: grade.controlType,
                session: grade.session,
                subject: {
                    id: grade.subject.id,
                    name: grade.subject.name,
                    coefficient: grade.subject.coefficient,
                    passingGrade: grade.subject.passingGrade,
                    maxGrade: grade.subject.maxGrade,
                },
            });
        });
        // Évaluer chaque matière
        const subjectEvaluations = [];
        let totalCoefficient = 0;
        let totalWeightedGrade = 0;
        for (const [subjectId, subjectGrades] of gradesBySubject) {
            const subject = subjectGrades[0].subject;
            const baseGrade = 20; // Par défaut
            // Calculer la moyenne pondérée des contrôles
            let subjectWeightedGrade = 0;
            let totalWeight = 0;
            const gradeDetails = [];
            // Grouper par contrôle
            const controlGrades = new Map();
            subjectGrades.forEach((grade) => {
                controlGrades.set(grade.controlType, grade.grade);
            });
            // Calculer avec les poids
            controlWeights.forEach((control) => {
                const grade = controlGrades.get(control.controlType) || 0;
                const normalizedGrade = this.normalizeGrade(grade, baseGrade);
                subjectWeightedGrade += normalizedGrade * control.weight;
                totalWeight += control.weight;
                gradeDetails.push({
                    controlType: control.controlType,
                    grade,
                    weight: control.weight,
                });
            });
            const weightedGrade = totalWeight > 0 ? subjectWeightedGrade / totalWeight : 0;
            const normalizedGrade = this.normalizeGrade(weightedGrade, 20);
            const passed = normalizedGrade >= subject.passingGrade;
            // Extraire les notes par contrôle
            const control1Grade = subjectGrades.find((g) => g.controlType === ControlType.CONTROLE_1)?.grade;
            const control2Grade = subjectGrades.find((g) => g.controlType === ControlType.CONTROLE_2)?.grade;
            const control3Grade = subjectGrades.find((g) => g.controlType === ControlType.CONTROLE_3)?.grade;
            const control4Grade = subjectGrades.find((g) => g.controlType === ControlType.CONTROLE_4)?.grade;
            subjectEvaluations.push({
                subjectId,
                subjectName: subject.name,
                coefficient: subject.coefficient,
                passingGrade: subject.passingGrade,
                baseGrade,
                isCritical: false,
                minRequired: subject.passingGrade,
                control1Grade,
                control2Grade,
                control3Grade,
                control4Grade,
                weightedGrade,
                normalizedGrade,
                passed,
                grades: gradeDetails,
            });
            // Ajouter aux totaux
            totalCoefficient += subject.coefficient;
            totalWeightedGrade += normalizedGrade * subject.coefficient;
        }
        // Calculer la moyenne générale
        const finalAverage = totalCoefficient > 0 ? totalWeightedGrade / totalCoefficient : 0;
        // Calculer les statistiques
        const passedSubjects = subjectEvaluations.filter((se) => se.passed).length;
        const failedSubjects = subjectEvaluations.length - passedSubjects;
        // Récupérer les critères
        const criteria = await this.getPromotionCriteria(targetLevel);
        // Évaluer la validation
        const hasValidatedYear = finalAverage >= criteria.minAverage &&
            failedSubjects <= criteria.maxFailures;
        // Générer les raisons et recommandations
        const reasons = [];
        const recommendations = [];
        if (!hasValidatedYear) {
            if (finalAverage < criteria.minAverage) {
                reasons.push(`Moyenne insuffisante: ${finalAverage.toFixed(2)}/${criteria.minAverage}`);
                recommendations.push(`Améliorer la moyenne générale de ${(criteria.minAverage - finalAverage).toFixed(2)} points`);
            }
            if (failedSubjects > criteria.maxFailures) {
                reasons.push(`Trop de matières échouées: ${failedSubjects}/${criteria.maxFailures}`);
                const failedSubjectNames = subjectEvaluations
                    .filter((se) => !se.passed)
                    .map((se) => se.subjectName);
                recommendations.push(`Réussir les matières échouées: ${failedSubjectNames.join(", ")}`);
            }
        }
        return {
            studentId,
            academicYearId,
            controls: controlWeights,
            subjects: subjectEvaluations,
            totalCoefficient,
            totalWeightedGrade,
            finalAverage,
            passedSubjects,
            failedSubjects,
            criticalSubjectsPassed: true, // À implémenter avec les matières critiques
            hasValidatedYear,
            reasons,
            recommendations,
        };
    }
    /**
     * Vérifie la situation financière
     */
    async checkFinancialClearance(studentId, academicYearId, targetLevel) {
        // Récupérer les frais étudiants
        const studentFees = await prisma.studentFee.findMany({
            where: {
                studentId,
                academicYearId,
            },
            include: {
                feeStructure: true,
            },
        });
        // Calculer les totaux
        const totalDue = studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
        const totalPaid = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
        const balance = totalDue - totalPaid;
        // Récupérer les frais impayés
        const outstandingFees = studentFees
            .filter((fee) => fee.totalAmount - fee.paidAmount > 0)
            .map((fee) => ({
            type: fee.feeStructure.name,
            amount: fee.totalAmount - fee.paidAmount,
        }));
        // Récupérer les critères
        const criteria = await this.getPromotionCriteria(targetLevel);
        return {
            isClear: !criteria.requiresFinancialClearance || balance <= 0,
            totalDue,
            totalPaid,
            balance,
            outstandingFees,
        };
    }
    /**
     * Calcule les classements par matière
     */
    async calculateSubjectRankings(studentId, academicYearId, studentSubjects) {
        const rankings = [];
        for (const subject of studentSubjects) {
            // Ici, vous devriez récupérer toutes les notes de la classe pour cette matière
            // Pour l'instant, retournons des données simulées
            rankings.push({
                subjectId: subject.subjectId,
                subjectName: subject.subjectName,
                studentGrade: subject.normalizedGrade,
                classAverage: 12.5, // À calculer réellement
                rank: 1, // À calculer réellement
                totalStudents: 30, // À récupérer réellement
            });
        }
        return rankings;
    }
    /**
     * Calcule le classement général
     */
    async calculateOverallRank(studentId, academicYearId) {
        // Ici, vous devriez récupérer tous les étudiants de la classe et calculer les rangs
        // Pour l'instant, retournons des données simulées
        return {
            rank: 5,
            totalStudents: 30,
            percentile: 85,
        };
    }
    /**
     * Vérifie si un niveau est supérieur à un autre
     */
    isHigherLevel(level1, level2) {
        const order = {
            [ClassLevel.Sixieme]: 1,
            [ClassLevel.Cinquieme]: 2,
            [ClassLevel.Quatrieme]: 3,
            [ClassLevel.Troisieme]: 4,
            [ClassLevel.Seconde]: 5,
            [ClassLevel.Premiere]: 6,
            [ClassLevel.Terminale]: 7,
            [ClassLevel.NSI]: 8,
            [ClassLevel.NSII]: 9,
            [ClassLevel.NSIII]: 10,
            [ClassLevel.NSIV]: 11,
        };
        return order[level1] > order[level2];
    }
    /**
     * Attribue des frais à un étudiant
     */
    async assignFeesOnEnrollment(studentId, academicYearId, feeStructureIds = []) {
        try {
            const assignedFees = [];
            if (feeStructureIds.length === 0) {
                const feeStructures = await prisma.feeStructure.findMany({
                    where: {
                        isActive: true,
                    },
                });
                feeStructureIds = feeStructures.map((fee) => fee.id);
            }
            for (const feeStructureId of feeStructureIds) {
                const feeStructure = await prisma.feeStructure.findUnique({
                    where: { id: feeStructureId },
                });
                if (!feeStructure) {
                    console.warn(`Structure de frais ${feeStructureId} non trouvée`);
                    continue;
                }
                const existingFee = await prisma.studentFee.findFirst({
                    where: {
                        studentId,
                        feeStructureId,
                        academicYearId,
                    },
                });
                if (existingFee) {
                    console.log(`L'étudiant a déjà ces frais: ${feeStructure.name}`);
                    continue;
                }
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + 3);
                const studentFee = await prisma.studentFee.create({
                    data: {
                        studentId,
                        feeStructureId,
                        academicYearId,
                        totalAmount: feeStructure.amount,
                        paidAmount: 0,
                        status: "pending",
                        dueDate,
                    },
                    include: {
                        feeStructure: {
                            select: {
                                name: true,
                                amount: true,
                                description: true,
                            },
                        },
                    },
                });
                assignedFees.push({
                    id: studentFee.id,
                    name: studentFee.feeStructure.name,
                    amount: studentFee.totalAmount,
                    dueDate: studentFee.dueDate,
                    status: studentFee.status,
                });
            }
            return {
                success: true,
                message: assignedFees.length > 0
                    ? `${assignedFees.length} frais attribués`
                    : "Aucun nouveau frais attribué",
                assignedFees,
            };
        }
        catch (error) {
            console.error(" Erreur attribution frais:", error);
            return {
                success: false,
                message: "Erreur lors de l'attribution des frais",
                assignedFees: [],
            };
        }
    }
    /**
     * Calcule les frais de réinscription
     */
    async calculateReenrollmentFee(studentId, previousYearId, currentYearId) {
        try {
            const previousPayments = await prisma.payment.findMany({
                where: {
                    studentId,
                    academicYearId: previousYearId,
                },
            });
            const totalPaid = previousPayments
                .filter((p) => p.status === "Paid")
                .reduce((sum, payment) => sum + payment.amount, 0);
            const totalDue = previousPayments.reduce((sum, payment) => sum + payment.amount, 0);
            const previousBalance = totalDue - totalPaid;
            const reenrollmentFeeStructure = await prisma.feeStructure.findFirst({
                where: {
                    name: { contains: "réinscription" },
                    isActive: true,
                },
            });
            const baseFee = reenrollmentFeeStructure?.amount || 10000;
            const totalFee = baseFee + previousBalance;
            return {
                amount: totalFee,
                details: {
                    baseFee,
                    previousBalance,
                    totalFee,
                },
            };
        }
        catch (error) {
            console.error("Error calculating reenrollment fee:", error);
            return {
                amount: 10000,
                details: { baseFee: 10000, previousBalance: 0, totalFee: 10000 },
            };
        }
    }
    /**
     * Crée les frais de scolarité pour un étudiant
     */
    async createStudentFees(studentId, academicYearId) {
        try {
            const feeStructures = await prisma.feeStructure.findMany({
                where: {
                    isActive: true,
                },
            });
            for (const feeStructure of feeStructures) {
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + 3);
                await prisma.studentFee.create({
                    data: {
                        studentId,
                        feeStructureId: feeStructure.id,
                        academicYearId,
                        totalAmount: feeStructure.amount,
                        paidAmount: 0,
                        status: "pending",
                        dueDate,
                    },
                });
            }
        }
        catch (error) {
            console.error("Error creating student fees:", error);
        }
    }
}
exports.EnrollmentService = EnrollmentService;
exports.enrollmentService = new EnrollmentService();
//# sourceMappingURL=enrollmentServ.js.map