"use strict";
/**
 * @file studentService.ts
 * @description Service pour la gestion des étudiants - Contient la logique métier
 * @version 1.0.0
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
exports.StudentService = void 0;
const prisma_1 = require("../../generated/prisma");
const bcrypt = __importStar(require("bcryptjs"));
const prismaHelpers_1 = require("../types/prismaHelpers");
const prisma = new prisma_1.PrismaClient();
/**
 * Service pour la gestion des étudiants
 */
class StudentService {
    /**
     * Récupère les étudiants avec pagination et filtres
     */
    async getStudents(options, userId, userRole) {
        const { page = 1, limit = 20, status, search, classId, sortBy = "createdAt", sortOrder = "desc", } = options;
        const pageNum = parseInt(page.toString());
        const limitNum = parseInt(limit.toString());
        const skip = (pageNum - 1) * limitNum;
        // Construire la requête de filtrage
        const where = {};
        if (status && status !== "all") {
            where.status = status;
        }
        if (classId && classId !== "all") {
            where.classId = classId;
        }
        if (search) {
            const searchStr = search;
            where.OR = [
                { firstName: { contains: searchStr } },
                { lastName: { contains: searchStr } },
                { email: { contains: searchStr } },
                { studentCode: { contains: searchStr } },
                { phone: { contains: searchStr } },
            ];
        }
        // Gestion des permissions pour les parents
        if (userRole === "Parent" && userId) {
            where.guardians = {
                some: {
                    id: userId,
                },
            };
        }
        // Définir l'ordre de tri
        let orderBy = {};
        const validSortFields = [
            "firstName",
            "lastName",
            "email",
            "studentCode",
            "createdAt",
            "dateOfBirth",
        ];
        if (validSortFields.includes(sortBy)) {
            orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
        }
        else {
            orderBy = { createdAt: "desc" };
        }
        // Récupérer les étudiants avec pagination
        const [students, totalStudents] = await Promise.all([
            prisma.student.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    studentCode: true,
                    email: true,
                    phone: true,
                    dateOfBirth: true,
                    placeOfBirth: true,
                    address: true,
                    photo: true,
                    bloodGroup: true,
                    allergies: true,
                    disabilities: true,
                    status: true,
                    sexe: true,
                    cin: true,
                    createdAt: true,
                    updatedAt: true,
                    classId: true,
                    enrollments: {
                        select: {
                            id: true,
                            schoolClass: {
                                select: {
                                    id: true,
                                    name: true,
                                    level: true,
                                },
                            },
                        },
                        orderBy: { enrollmentDate: "desc" },
                        take: 1,
                    },
                    schoolClass: {
                        select: {
                            id: true,
                            name: true,
                            level: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    studentFees: {
                        select: {
                            id: true,
                            totalAmount: true,
                            dueDate: true,
                            status: true,
                        },
                        orderBy: { dueDate: "desc" },
                        take: 1,
                    },
                    _count: {
                        select: {
                            guardians: true,
                            enrollments: true,
                            grades: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.student.count({ where }),
        ]);
        const totalPages = Math.ceil(totalStudents / limitNum);
        return {
            data: students,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalStudents,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        };
    }
    /**
     * Récupère un étudiant par son ID
     */
    async getStudentById(id, userId, userRole) {
        // Récupérer l'étudiant avec toutes ses informations
        const student = await prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                placeOfBirth: true,
                address: true,
                photo: true,
                bloodGroup: true,
                allergies: true,
                disabilities: true,
                status: true,
                sexe: true,
                cin: true,
                createdAt: true,
                updatedAt: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
                guardians: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        relationship: true,
                        isPrimary: true,
                        address: true,
                    },
                    orderBy: { isPrimary: "desc" },
                },
                enrollments: {
                    select: {
                        id: true,
                        academicYearId: true,
                        enrollmentDate: true,
                        status: true,
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                            },
                        },
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                            },
                        },
                    },
                    orderBy: { enrollmentDate: "desc" },
                },
                grades: {
                    select: {
                        id: true,
                        grade: true,
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                coefficient: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
                studentFees: {
                    select: {
                        id: true,
                        feeStructure: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        totalAmount: true,
                        dueDate: true,
                        status: true,
                    },
                    orderBy: { dueDate: "desc" },
                },
            },
        });
        if (!student) {
            throw new Error("STUDENT_NOT_FOUND");
        }
        // Vérifier les permissions pour les parents
        if (userRole === "Parent" && userId) {
            const isGuardian = student.guardians.some((guardian) => guardian.id === userId);
            if (!isGuardian) {
                throw new Error("UNAUTHORIZED");
            }
        }
        return student;
    }
    /**
     * Crée un nouvel étudiant
     */
    async createStudent(data) {
        const { firstName, lastName, email, phone, dateOfBirth, placeOfBirth, address, photo, bloodGroup, allergies, disabilities, status = "Active", sexe, cin, classId, createUserAccount = false, academicYearId, guardians = [], } = data;
        // Validation des données requises
        if (!firstName || !lastName || !email) {
            throw new Error("MISSING_REQUIRED_FIELDS");
        }
        // Utiliser une transaction pour garantir l'intégrité des données
        return await prisma.$transaction(async (tx) => {
            // Vérifier l'unicité de l'email dans Student
            const existingStudent = await tx.student.findUnique({
                where: { email },
            });
            if (existingStudent) {
                throw new Error("EMAIL_ALREADY_EXISTS");
            }
            // Vérifier l'unicité de l'email dans User si création de compte
            if (createUserAccount) {
                const existingUser = await tx.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    throw new Error("USER_EMAIL_ALREADY_EXISTS");
                }
            }
            // Vérifier l'unicité du CIN si fourni
            // Vérifier que la classe existe si classId est fourni
            let schoolClassConnection = undefined;
            if (classId) {
                const schoolClass = await tx.schoolClass.findUnique({
                    where: { id: classId },
                });
                if (!schoolClass) {
                    throw new Error("CLASS_NOT_FOUND");
                }
                // Préparer la connexion à la classe
                schoolClassConnection = { connect: { id: classId } };
            }
            // Générer un code étudiant unique
            const studentCode = await this.generateStudentCode(tx);
            let userId = null;
            let createdUser = null;
            // Créer l'utilisateur si demandé
            if (createUserAccount) {
                const hashedPassword = await bcrypt.hash("Etudiant@123", 12);
                createdUser = await tx.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        phone: phone || null,
                        role: "Student",
                        status: (0, prismaHelpers_1.convertUserStatus)("Actif"),
                        password: hashedPassword,
                    },
                });
                userId = createdUser.id;
            }
            // Créer l'étudiant avec les types corrects
            const studentData = {
                firstName,
                lastName,
                studentCode,
                email,
                phone: phone || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                placeOfBirth: placeOfBirth || null,
                address: address || null,
                photo: photo || null,
                bloodGroup: (0, prismaHelpers_1.convertBloodGroup)(bloodGroup),
                allergies: allergies || null,
                disabilities: disabilities || null,
                status: status,
                sexe: (0, prismaHelpers_1.convertSexe)(sexe),
                cin: cin || null,
                ...(schoolClassConnection && { schoolClass: schoolClassConnection }),
            };
            // Ajouter l'utilisateur si créé
            if (userId) {
                studentData.user = { connect: { id: userId } };
            }
            const createdStudent = await tx.student.create({
                data: studentData,
                include: {
                    schoolClass: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Créer les gardiens si fournis
            if (guardians && guardians.length > 0) {
                for (const guardian of guardians) {
                    await tx.guardian.create({
                        data: {
                            firstName: guardian.firstName,
                            lastName: guardian.lastName,
                            email: guardian.email || null,
                            phone: guardian.phone,
                            relationship: guardian.relationship || "Parent",
                            isPrimary: guardian.isPrimary || false,
                            studentId: createdStudent.id,
                        },
                    });
                }
            }
            // Créer l'inscription si academicYearId est fourni
            if (academicYearId && classId) {
                await tx.enrollment.create({
                    data: {
                        studentId: createdStudent.id,
                        classId,
                        academicYearId,
                        enrollmentDate: new Date(),
                        status: "Active",
                    },
                });
            }
            return {
                student: createdStudent,
                user: createdUser,
                guardiansCount: guardians?.length || 0,
            };
        }, {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: prisma_1.Prisma.TransactionIsolationLevel.Serializable,
        });
    }
    /**
     * Met à jour un étudiant
     */
    async updateStudent(id, data) {
        const { firstName, lastName, email, phone, dateOfBirth, placeOfBirth, address, photo, bloodGroup, allergies, disabilities, status, sexe, cin, classId, } = data;
        // Vérifier si l'étudiant existe
        const existingStudent = await prisma.student.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!existingStudent) {
            throw new Error("STUDENT_NOT_FOUND");
        }
        // Préparer les données de mise à jour
        const updateData = {};
        if (firstName !== undefined)
            updateData.firstName = firstName;
        if (lastName !== undefined)
            updateData.lastName = lastName;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone || null;
        if (dateOfBirth !== undefined) {
            updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
        }
        if (placeOfBirth !== undefined)
            updateData.placeOfBirth = placeOfBirth;
        if (address !== undefined)
            updateData.address = address;
        if (photo !== undefined)
            updateData.photo = photo;
        if (bloodGroup !== undefined) {
            updateData.bloodGroup = (0, prismaHelpers_1.convertBloodGroup)(bloodGroup);
        }
        if (allergies !== undefined)
            updateData.allergies = allergies;
        if (disabilities !== undefined)
            updateData.disabilities = disabilities;
        if (status !== undefined)
            updateData.status = status;
        if (sexe !== undefined) {
            updateData.sexe = (0, prismaHelpers_1.convertSexe)(sexe);
        }
        if (cin !== undefined)
            updateData.cin = cin || null;
        if (classId !== undefined) {
            if (classId === null || classId === "") {
                updateData.schoolClass = { disconnect: true };
            }
            else {
                // Vérifier que la classe existe
                const schoolClass = await prisma.schoolClass.findUnique({
                    where: { id: classId },
                });
                if (!schoolClass) {
                    throw new Error("CLASS_NOT_FOUND");
                }
                updateData.schoolClass = { connect: { id: classId } };
            }
        }
        // Vérifier l'unicité de l'email si modifié
        if (email && email !== existingStudent.email) {
            const studentWithEmail = await prisma.student.findUnique({
                where: { email },
            });
            if (studentWithEmail && studentWithEmail.id !== id) {
                throw new Error("EMAIL_ALREADY_EXISTS");
            }
            // Mettre à jour l'email de l'utilisateur associé
            if (existingStudent.user) {
                await prisma.user.update({
                    where: { id: existingStudent.user.id },
                    data: { email },
                });
            }
        }
        // Vérifier l'unicité du CIN si modifié
        if (cin !== undefined && cin !== existingStudent.cin) {
            if (cin) {
                const studentWithCIN = await prisma.student.findUnique({
                    where: { cin },
                });
                if (studentWithCIN && studentWithCIN.id !== id) {
                    throw new Error("CIN_ALREADY_EXISTS");
                }
            }
        }
        // Mettre à jour l'étudiant
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                status: true,
                sexe: true,
                cin: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                updatedAt: true,
            },
        });
        return updatedStudent;
    }
    /**
     * Supprime un étudiant
     */
    async deleteStudent(id) {
        try {
            // Vérifier si l'étudiant existe AVANT la transaction
            const student = await prisma.student.findUnique({
                where: { id },
                include: {
                    user: true,
                    guardians: true,
                    enrollments: true,
                    grades: true,
                    studentFees: {
                        include: {
                            payments: true,
                        },
                    },
                },
            });
            if (!student) {
                throw new Error("STUDENT_NOT_FOUND");
            }
            // Utiliser une transaction pour garantir l'intégrité
            await prisma.$transaction(async (tx) => {
                try {
                    // 1. Supprimer les paiements associés aux frais
                    if (student.studentFees && student.studentFees.length > 0) {
                        const feeIds = student.studentFees.map((fee) => fee.id);
                        // Supprimer les paiements d'abord
                        await tx.feePayment.deleteMany({
                            where: {
                                studentFeeId: {
                                    in: feeIds,
                                },
                            },
                        });
                        // Puis supprimer les frais
                        await tx.studentFee.deleteMany({
                            where: {
                                studentId: id,
                            },
                        });
                    }
                    // 2. Supprimer les notes
                    if (student.grades && student.grades.length > 0) {
                        await tx.grade.deleteMany({
                            where: { studentId: id },
                        });
                    }
                    // 3. Supprimer les inscriptions
                    if (student.enrollments && student.enrollments.length > 0) {
                        await tx.enrollment.deleteMany({
                            where: { studentId: id },
                        });
                    }
                    // 4. Supprimer les gardiens
                    if (student.guardians && student.guardians.length > 0) {
                        await tx.guardian.deleteMany({
                            where: { studentId: id },
                        });
                    }
                    // 5. Supprimer l'utilisateur associé s'il existe
                    if (student.user) {
                        await tx.user.delete({
                            where: { id: student.user.id },
                        });
                    }
                    // 6. Vérifier à nouveau que l'étudiant existe avant de supprimer
                    const studentExists = await tx.student.findUnique({
                        where: { id },
                        select: { id: true },
                    });
                    if (!studentExists) {
                        throw new Error("STUDENT_ALREADY_DELETED");
                    }
                    // 7. Supprimer définitivement l'étudiant
                    await tx.student.delete({
                        where: { id },
                    });
                }
                catch (error) {
                    // Log l'erreur avec un message court pour l'audit
                    console.error("Erreur lors de la suppression de l'étudiant:", {
                        studentId: id,
                        error: error.message?.substring(0, 100) || "Erreur inconnue",
                        code: error.code,
                    });
                    // Relancer l'erreur pour la gestion externe
                    throw error;
                }
            }, {
                maxWait: 10000,
                timeout: 30000,
                isolationLevel: prisma_1.Prisma.TransactionIsolationLevel.Serializable,
            });
        }
        catch (error) {
            // Log l'erreur finale avec un message court
            console.error("Échec de la suppression de l'étudiant:", {
                studentId: id,
                error: error.message?.substring(0, 200) || "Erreur inconnue",
            });
            // Propager l'erreur avec un message court pour l'audit
            throw new Error(`Échec de suppression: ${error.message?.substring(0, 100) || "Erreur inconnue"}`);
        }
    }
    /**
     * Met à jour le statut d'un étudiant
     */
    async updateStudentStatus(id, status, reason) {
        // Valider le statut
        const validStatuses = [
            "Active",
            "Inactive",
            "Graduated",
            "Transferred",
            "Suspended",
        ];
        if (!validStatuses.includes(status)) {
            throw new Error("INVALID_STATUS");
        }
        // Vérifier si l'étudiant existe
        const student = await prisma.student.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!student) {
            throw new Error("STUDENT_NOT_FOUND");
        }
        // Sauvegarder l'ancien statut
        const oldStatus = student.status;
        // Utiliser une transaction
        await prisma.$transaction(async (tx) => {
            // Mettre à jour le statut de l'étudiant
            await tx.student.update({
                where: { id },
                data: { status: status },
            });
            // Mettre à jour le statut de l'utilisateur associé si existant
            if (student.user) {
                let userStatus;
                if (["Inactive", "Suspended", "Graduated", "Transferred"].includes(status)) {
                    userStatus = prisma_1.UserStatus.Inactif;
                }
                else {
                    userStatus = prisma_1.UserStatus.Actif;
                }
                await tx.user.update({
                    where: { id: student.user.id },
                    data: {
                        status: userStatus,
                    },
                });
            }
        });
        // Récupérer l'étudiant mis à jour
        const updatedStudent = await prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                status: true,
                updatedAt: true,
            },
        });
        return {
            student: updatedStudent,
            change: {
                oldStatus,
                newStatus: status,
                reason,
            },
        };
    }
    /**
     * Affecte un étudiant à une classe
     */
    async assignStudentToClass(id, classId, academicYearId) {
        if (!classId) {
            throw new Error("MISSING_CLASS_ID");
        }
        // Vérifier si l'étudiant existe
        const student = await prisma.student.findUnique({
            where: { id },
            select: {
                classId: true,
                studentCode: true,
                firstName: true,
                lastName: true,
            },
        });
        if (!student) {
            throw new Error("STUDENT_NOT_FOUND");
        }
        // Vérifier si la classe existe
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: classId },
        });
        if (!schoolClass) {
            throw new Error("CLASS_NOT_FOUND");
        }
        // Vérifier si l'année académique existe si fournie
        if (academicYearId) {
            const academicYear = await prisma.academicYear.findUnique({
                where: { id: academicYearId },
            });
            if (!academicYear) {
                throw new Error("ACADEMIC_YEAR_NOT_FOUND");
            }
        }
        // Sauvegarder l'ancienne classe
        const oldClassId = student.classId;
        // Utiliser une transaction
        await prisma.$transaction(async (tx) => {
            // Mettre à jour l'étudiant
            await tx.student.update({
                where: { id },
                data: { classId },
            });
            // Créer ou mettre à jour l'inscription
            if (academicYearId) {
                await tx.enrollment.upsert({
                    where: {
                        studentId_academicYearId: {
                            studentId: id,
                            academicYearId,
                        },
                    },
                    update: {
                        classId,
                    },
                    create: {
                        studentId: id,
                        classId,
                        academicYearId,
                        enrollmentDate: new Date(),
                        status: "Active",
                    },
                });
            }
        });
        // Récupérer l'étudiant mis à jour
        const updatedStudent = await prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                    },
                },
                updatedAt: true,
            },
        });
        return {
            student: updatedStudent,
            metadata: {
                oldClassId,
                newClassId: classId,
                className: schoolClass.name,
                academicYearId,
            },
        };
    }
    /**
     * Récupère les statistiques des étudiants
     */
    async getStudentStatistics() {
        // Compter par statut
        const statusCounts = await prisma.student.groupBy({
            by: ["status"],
            _count: {
                id: true,
            },
        });
        // Compter par sexe
        const genderCounts = await prisma.student.groupBy({
            by: ["sexe"],
            _count: {
                id: true,
            },
        });
        // Compter par classe
        const classCounts = await prisma.student.groupBy({
            by: ["classId"],
            _count: {
                id: true,
            },
            where: {
                classId: {
                    not: null,
                },
            },
        });
        // Nombre total
        const totalStudents = await prisma.student.count();
        // Dernières inscriptions (7 derniers jours)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentEnrollments = await prisma.student.count({
            where: {
                createdAt: {
                    gte: weekAgo,
                },
            },
        });
        // Récupérer les informations des classes pour les noms
        const classIds = classCounts
            .map((item) => item.classId)
            .filter(Boolean);
        const classes = await prisma.schoolClass.findMany({
            where: {
                id: {
                    in: classIds,
                },
            },
            select: {
                id: true,
                name: true,
                level: true,
            },
        });
        const classStats = classCounts.map((item) => {
            const classInfo = classes.find((c) => c.id === item.classId);
            return {
                ...item,
                className: classInfo?.name || "Non assigné",
                classLevel: classInfo?.level || null,
            };
        });
        return {
            total: totalStudents,
            byStatus: statusCounts.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {}),
            byGender: genderCounts.reduce((acc, item) => {
                acc[item.sexe || "Non spécifié"] = item._count.id;
                return acc;
            }, {}),
            byClass: classStats,
            recentEnrollments,
        };
    }
    /**
     * Importe des étudiants depuis un fichier
     */
    async importStudents(students) {
        if (!students || !Array.isArray(students) || students.length === 0) {
            throw new Error("NO_STUDENT_DATA");
        }
        const results = {
            success: 0,
            failed: 0,
            errors: [],
            created: [],
        };
        // Utiliser une transaction pour l'import en masse
        await prisma.$transaction(async (tx) => {
            for (const studentData of students) {
                try {
                    // Vérifier l'email
                    const existingStudent = await tx.student.findUnique({
                        where: { email: studentData.email },
                    });
                    if (existingStudent) {
                        results.failed++;
                        results.errors.push({
                            student: studentData,
                            error: "Email déjà utilisé",
                        });
                        continue;
                    }
                    // Générer code étudiant
                    const studentCode = await this.generateStudentCode(tx);
                    // Créer l'étudiant avec les bonnes conversions
                    const student = await tx.student.create({
                        data: {
                            firstName: studentData.firstName,
                            lastName: studentData.lastName,
                            studentCode,
                            email: studentData.email,
                            phone: studentData.phone || null,
                            dateOfBirth: studentData.dateOfBirth
                                ? new Date(studentData.dateOfBirth)
                                : null,
                            placeOfBirth: studentData.placeOfBirth || null,
                            address: studentData.address || null,
                            sexe: (0, prismaHelpers_1.convertSexe)(studentData.sexe),
                            cin: studentData.cin || null,
                            classId: studentData.classId || null,
                            status: "Active",
                            bloodGroup: (0, prismaHelpers_1.convertBloodGroup)(studentData.bloodGroup),
                        },
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                            email: true,
                        },
                    });
                    results.success++;
                    results.created.push(student);
                }
                catch (error) {
                    results.failed++;
                    results.errors.push({
                        student: studentData,
                        error: error.message,
                    });
                }
            }
        });
        return results;
    }
    /**
     * Génère un code étudiant unique
     */
    async generateStudentCode(tx) {
        const year = new Date().getFullYear().toString().slice(-2);
        const prefix = `STU${year}`;
        const lastStudent = await tx.student.findFirst({
            where: {
                studentCode: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                studentCode: "desc",
            },
            select: {
                studentCode: true,
            },
        });
        let nextNumber = 1;
        if (lastStudent && lastStudent.studentCode) {
            const lastNumber = parseInt(lastStudent.studentCode.replace(prefix, ""), 10);
            nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
        }
        return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
    }
    /**
     * Recherche des étudiants par terme
     */
    async searchStudents(searchTerm, limit = 10) {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return [];
        }
        const students = await prisma.student.findMany({
            where: {
                OR: [
                    { firstName: { contains: searchTerm } },
                    { lastName: { contains: searchTerm } },
                    { email: { contains: searchTerm } },
                    { studentCode: { contains: searchTerm } },
                    { cin: { contains: searchTerm } },
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                phone: true,
                status: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });
        return students;
    }
    /**
     * Vérifie si un email est disponible
     */
    async checkEmailAvailability(email, excludeStudentId) {
        const where = {
            email: email,
        };
        if (excludeStudentId) {
            where.id = { not: excludeStudentId };
        }
        const existingStudent = await prisma.student.findFirst({
            where,
        });
        return !existingStudent;
    }
    /**
     * Vérifie si un CIN est disponible
     */
    async checkCINAvailability(cin, excludeStudentId) {
        if (!cin)
            return true;
        const where = {
            cin: cin,
        };
        if (excludeStudentId) {
            where.id = { not: excludeStudentId };
        }
        const existingStudent = await prisma.student.findFirst({
            where,
        });
        return !existingStudent;
    }
    /**
     * Récupère le profil complet d'un étudiant par son ID utilisateur
     */
    async getStudentProfile(userId) {
        // Trouver l'étudiant associé à cet utilisateur
        const student = await prisma.student.findFirst({
            where: {
                user: {
                    id: userId,
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                placeOfBirth: true,
                address: true,
                photo: true,
                bloodGroup: true,
                allergies: true,
                disabilities: true,
                status: true,
                sexe: true,
                cin: true,
                createdAt: true,
                updatedAt: true,
                classId: true,
                schoolClass: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        capacity: true,
                        status: true,
                    },
                },
                enrollments: {
                    select: {
                        id: true,
                        academicYearId: true,
                        enrollmentDate: true,
                        status: true,
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isCurrent: true,
                            },
                        },
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                            },
                        },
                    },
                    orderBy: { enrollmentDate: "desc" },
                    take: 5,
                },
                guardians: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        relationship: true,
                        isPrimary: true,
                    },
                    orderBy: { isPrimary: "desc" },
                },
                studentFees: {
                    select: {
                        id: true,
                        totalAmount: true,
                        paidAmount: true,
                        dueDate: true,
                        status: true,
                    },
                },
                _count: {
                    select: {
                        grades: true,
                        studentFees: true,
                    },
                },
            },
        });
        if (!student) {
            throw new Error("STUDENT_NOT_FOUND");
        }
        // Récupérer les notes récentes
        const recentGrades = await prisma.grade.findMany({
            where: {
                studentId: student.id,
            },
            select: {
                id: true,
                grade: true,
                status: true,
                controlType: true,
                subject: {
                    select: {
                        id: true,
                        name: true,
                        coefficient: true,
                        code: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                    },
                },
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        // Calculer la moyenne générale
        const grades = await prisma.grade.findMany({
            where: {
                studentId: student.id,
            },
            select: {
                grade: true,
                subject: {
                    select: {
                        coefficient: true,
                    },
                },
            },
        });
        let totalWeighted = 0;
        let totalCoefficient = 0;
        grades.forEach((grade) => {
            const coefficient = grade.subject?.coefficient || 1;
            totalWeighted += grade.grade * coefficient;
            totalCoefficient += coefficient;
        });
        const average = totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;
        // Récupérer les frais en attente
        const pendingFees = await prisma.studentFee.findMany({
            where: {
                studentId: student.id,
                OR: [{ status: "Pending" }, { status: "Partially_Paid" }],
            },
            select: {
                id: true,
                feeStructure: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
                totalAmount: true,
                paidAmount: true,
                dueDate: true,
                status: true,
            },
            orderBy: { dueDate: "asc" },
            take: 5,
        });
        // Récupérer les paiements récents
        const feeIds = student.studentFees?.map((f) => f.id) ?? [];
        const recentPayments = feeIds.length === 0
            ? []
            : await prisma.feePayment.findMany({
                where: {
                    studentFeeId: { in: feeIds },
                },
                select: {
                    id: true,
                    amount: true,
                    paymentMethod: true,
                    description: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            });
        return {
            ...student,
            academicProfile: {
                average: parseFloat(average.toFixed(2)),
                totalGrades: grades.length,
                recentGrades,
            },
            financialProfile: {
                pendingFees,
                recentPayments,
                totalPending: pendingFees.reduce((sum, fee) => sum + (fee.totalAmount - fee.paidAmount), 0),
            },
            summary: {
                totalGrades: student._count.grades,
                totalFees: student._count.studentFees,
            },
        };
    }
}
exports.StudentService = StudentService;
exports.default = new StudentService();
//# sourceMappingURL=studentService.js.map