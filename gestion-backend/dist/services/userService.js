"use strict";
/**
 * @file userService.ts
 * @description Service de gestion des utilisateurs
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * @class UserService
 * @description Service regroupant la logique métier des utilisateurs
 */
class UserService {
    /**
     * @method getUserProfile
     * @description Récupère le profil complet d'un utilisateur selon son rôle
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<any>} Profil utilisateur complet
     * @throws {Error} Si l'utilisateur n'est pas trouvé
     */
    static async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
                avatar: true,
                professeur: {
                    select: {
                        id: true,
                        speciality: true,
                        status: true,
                    },
                },
                studentRecord: {
                    select: {
                        id: true,
                        studentCode: true,
                        classId: true,
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                            },
                        },
                    },
                },
                parentAccount: {
                    select: {
                        id: true,
                        guardians: {
                            include: {
                                student: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        studentCode: true,
                                        schoolClass: {
                                            select: {
                                                id: true,
                                                name: true,
                                                level: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        const profileData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            avatar: user.avatar,
        };
        // Même logique de rôle
        switch (user.role) {
            case "Professeur":
                profileData.professeur = user.professeur;
                break;
            case "Student":
                profileData.studentRecord = user.studentRecord || {
                    id: user.id,
                    studentCode: `TEMP-${user.id.substring(0, 8)}`,
                    classId: null,
                    schoolClass: null,
                };
                break;
            case "Parent":
                profileData.parent = user.parentAccount;
                if (user.parentAccount) {
                    profileData.children = user.parentAccount.guardians.map((guardian) => ({
                        ...guardian.student,
                        relationship: guardian.relationship,
                        isPrimary: guardian.isPrimary,
                    }));
                }
                break;
        }
        return profileData;
    }
    /**
     * @method updateUserProfile
     * @description Met à jour le profil d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {object} updateData - Données à mettre à jour
     * @returns {Promise<any>} Utilisateur mis à jour
     */
    static async updateUserProfile(userId, updateData) {
        const { firstName, lastName, phone } = updateData;
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone !== undefined && { phone }),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
                avatar: true,
            },
        });
        return user;
    }
    /**
     * @method getUserByEmail
     * @description Récupère un utilisateur par son email
     * @param {string} email - Email de l'utilisateur
     * @returns {Promise<any>} Utilisateur trouvé
     */
    static async getUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
    /**
     * @method updateUserResetToken
     * @description Met à jour le token de réinitialisation d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {string} resetToken - Token de réinitialisation
     * @param {Date} resetTokenExpiry - Date d'expiration du token
     */
    static async updateUserResetToken(userId, resetToken, resetTokenExpiry) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
    }
    /**
     * @method clearUserResetToken
     * @description Efface le token de réinitialisation d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     */
    static async clearUserResetToken(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    }
    /**
     * @method getUserByResetToken
     * @description Récupère un utilisateur par son token de réinitialisation
     * @param {string} token - Token de réinitialisation
     * @returns {Promise<any>} Utilisateur trouvé
     */
    static async getUserByResetToken(token) {
        return await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });
    }
    /**
     * @method getUserProfileWithRoleData
     * @description Récupère le profil utilisateur avec les données spécifiques au rôle
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<any>} Profil complet avec données de rôle
     */
    static async getUserProfileWithRoleData(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
                avatar: true,
                professeur: {
                    select: {
                        id: true,
                        speciality: true,
                        status: true,
                    },
                },
                studentRecord: {
                    select: {
                        id: true,
                        studentCode: true,
                        classId: true,
                        schoolClass: {
                            select: {
                                id: true,
                                name: true,
                                level: true,
                            },
                        },
                    },
                },
                parentAccount: {
                    select: {
                        id: true,
                        guardians: {
                            include: {
                                student: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        studentCode: true,
                                        schoolClass: {
                                            select: {
                                                id: true,
                                                name: true,
                                                level: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        // Structure de base du profil
        const profileData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            avatar: user.avatar,
        };
        // Données spécifiques au rôle - VERSION SIMPLIFIÉE
        switch (user.role) {
            case "Professeur":
                profileData.professeur = user.professeur;
                break;
            case "Student":
                console.log(`[DEBUG] Récupération studentRecord pour: ${user.email}`);
                if (user.studentRecord) {
                    profileData.studentRecord = user.studentRecord;
                    console.log(`[DEBUG] StudentRecord trouvé via relation:`, user.studentRecord);
                }
                else {
                    console.warn(`[WARN] Aucun studentRecord lié à l'utilisateur ${user.email}`);
                    profileData.studentRecord = {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        studentCode: `TEMP-${user.id.substring(0, 8)}`,
                        classId: null,
                        schoolClass: null,
                    };
                }
                break;
            case "Parent":
                profileData.parent = user.parentAccount;
                if (user.parentAccount) {
                    profileData.children = user.parentAccount.guardians.map((guardian) => ({
                        ...guardian.student,
                        relationship: guardian.relationship,
                        isPrimary: guardian.isPrimary,
                    }));
                }
                break;
            case "Admin":
            case "Secretaire":
            case "Directeur":
                // Pas de données supplémentaires
                break;
        }
        return profileData;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map