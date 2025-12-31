"use strict";
/**
 * @file professeurService.ts
 * @description Services pour la gestion des professeurs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachUserFromProfesseurService = exports.attachUserToProfesseurService = exports.createProfesseurService = exports.sendLoginCredentialsEmail = exports.getProfesseurFullDetailsService = exports.deactivateProfesseurService = exports.activateProfesseurService = exports.getProfesseurScheduleService = exports.deleteProfesseurService = exports.updateProfesseurService = exports.getProfesseurByIdService = exports.getProfesseursService = void 0;
const prisma_1 = require("../../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailService_1 = require("./emailService");
const prisma = new prisma_1.PrismaClient();
/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
 */
const getProfesseursService = async (filters) => {
    const { page = 1, limit = 20, search, status, speciality, sortBy = "lastName", sortOrder = "asc", } = filters;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Filtres
    const where = {};
    if (search) {
        where.OR = [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }
    if (status) {
        where.status = status;
    }
    if (speciality) {
        where.speciality = {
            contains: speciality,
            mode: "insensitive",
        };
    }
    // Récupération avec pagination
    const [professeurs, total] = await Promise.all([
        prisma.professeur.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
                assignments: {
                    include: {
                        subject: true,
                        academicYear: true,
                    },
                },
                _count: {
                    select: {
                        assignments: true,
                        schedules: true,
                    },
                },
            },
            orderBy: {
                [sortBy]: sortOrder === "desc" ? "desc" : "asc",
            },
            skip,
            take: limitNum,
        }),
        prisma.professeur.count({ where }),
    ]);
    return {
        professeurs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};
exports.getProfesseursService = getProfesseursService;
/**
 * @desc Récupère un professeur par ID
 */
const getProfesseurByIdService = async (id) => {
    const professeur = await prisma.professeur.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    lastLogin: true,
                    createdAt: true,
                },
            },
            assignments: {
                include: {
                    subject: true,
                    academicYear: true,
                    schedules: {
                        include: {
                            schoolClass: true,
                        },
                    },
                },
            },
            schedules: {
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                        },
                    },
                    schoolClass: true,
                },
            },
        },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    return professeur;
};
exports.getProfesseurByIdService = getProfesseurByIdService;
/**
 * @desc Met à jour un professeur
 */
const updateProfesseurService = async (id, data) => {
    // Vérifier si le professeur existe
    const existingProfesseur = await prisma.professeur.findUnique({
        where: { id },
    });
    if (!existingProfesseur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    // Vérifier si le nouvel email existe déjà
    if (data.email && data.email !== existingProfesseur.email) {
        const professeurWithEmail = await prisma.professeur.findUnique({
            where: { email: data.email },
        });
        if (professeurWithEmail) {
            throw new Error("PROFESSEUR_EMAIL_EXISTS");
        }
    }
    // Préparer les données de mise à jour
    const updateData = { ...data };
    // Gérer le userId (peut être null pour détacher)
    if (data.userId !== undefined) {
        if (data.userId === null || data.userId === "") {
            // Détacher l'utilisateur
            updateData.userId = null;
        }
        else {
            // Vérifier si l'utilisateur existe
            const user = await prisma.user.findUnique({
                where: { id: data.userId },
            });
            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }
            // Vérifier si cet utilisateur est déjà associé à un autre professeur
            if (data.userId !== existingProfesseur.userId) {
                const existingProfesseurWithUser = await prisma.professeur.findUnique({
                    where: { userId: data.userId },
                });
                if (existingProfesseurWithUser) {
                    throw new Error("USER_ALREADY_ASSOCIATED");
                }
            }
            updateData.userId = data.userId;
        }
    }
    // Mettre à jour
    const professeur = await prisma.professeur.update({
        where: { id },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
    return professeur;
};
exports.updateProfesseurService = updateProfesseurService;
/**
 * @desc Supprime/désactive un professeur
 */
const deleteProfesseurService = async (id) => {
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    assignments: true,
                    schedules: true,
                },
            },
        },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    // Vérifier les dépendances
    if (professeur._count.assignments > 0) {
        throw new Error("PROFESSEUR_HAS_DEPENDENCIES");
    }
    // Désactiver plutôt que supprimer
    await prisma.professeur.update({
        where: { id },
        data: { status: "Inactif" },
    });
    return {
        message: "Professeur désactivé avec succès",
        assignmentsCount: professeur._count.assignments,
    };
};
exports.deleteProfesseurService = deleteProfesseurService;
/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
const getProfesseurScheduleService = async (id, weekStart) => {
    // Récupérer tous les horaires du professeur
    const schedules = await prisma.schedule.findMany({
        where: {
            professeurId: id,
        },
        include: {
            classAssignment: {
                include: {
                    subject: true,
                    academicYear: true,
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
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    // Organiser par jour
    const scheduleByDay = {
        1: [], // Lundi
        2: [], // Mardi
        3: [], // Mercredi
        4: [], // Jeudi
        5: [], // Vendredi
        6: [], // Samedi
        7: [], // Dimanche
    };
    schedules.forEach((schedule) => {
        const day = Number(schedule.dayOfWeek);
        if (!Number.isInteger(day) || day < 1 || day > 7)
            return;
        scheduleByDay[day].push(schedule);
    });
    return {
        scheduleByDay,
        totalSessions: schedules.length,
    };
};
exports.getProfesseurScheduleService = getProfesseurScheduleService;
/**
 * @desc Active un professeur
 */
const activateProfesseurService = async (id) => {
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
        where: { id },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    // Activer le professeur
    const updatedProfesseur = await prisma.professeur.update({
        where: { id },
        data: { status: "Actif" },
    });
    return updatedProfesseur;
};
exports.activateProfesseurService = activateProfesseurService;
/**
 * @desc Désactive un professeur
 */
const deactivateProfesseurService = async (id) => {
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
        where: { id },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    // Désactiver le professeur
    const updatedProfesseur = await prisma.professeur.update({
        where: { id },
        data: { status: "Inactif" },
    });
    return updatedProfesseur;
};
exports.deactivateProfesseurService = deactivateProfesseurService;
/**
 * @desc Récupère les détails complets d'un professeur
 */
const getProfesseurFullDetailsService = async (id) => {
    const professeur = await prisma.professeur.findUnique({
        where: { id },
        include: {
            // Informations utilisateur
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            // Assignations avec détails
            assignments: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            description: true,
                        },
                    },
                    academicYear: {
                        select: {
                            id: true,
                            year: true,
                        },
                    },
                    schedules: {
                        include: {
                            schoolClass: {
                                select: {
                                    id: true,
                                    name: true,
                                    level: true,
                                    capacity: true,
                                },
                            },
                        },
                        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
                    },
                },
            },
            // Emploi du temps complet
            schedules: {
                include: {
                    classAssignment: {
                        include: {
                            subject: true,
                            academicYear: true,
                        },
                    },
                    schoolClass: true,
                },
                orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            },
            // Classes enseignées (via les assignations)
            _count: {
                select: {
                    assignments: true,
                    schedules: true,
                },
            },
        },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    // Organiser l'emploi du temps par jour
    const scheduleByDay = {
        1: [], // Lundi
        2: [], // Mardi
        3: [], // Mercredi
        4: [], // Jeudi
        5: [], // Vendredi
        6: [], // Samedi
        7: [], // Dimanche
    };
    professeur.schedules.forEach((schedule) => {
        const day = Number(schedule.dayOfWeek);
        if (!Number.isInteger(day) || day < 1 || day > 7)
            return;
        scheduleByDay[day].push(schedule);
    });
    // Calculer les statistiques
    const assignments = professeur.assignments || [];
    const schedules = professeur.schedules || [];
    const totalClasses = new Set(assignments.flatMap((a) => (a.schedules || []).map((s) => s.schoolClassId))).size;
    const totalSubjects = new Set(assignments.map((a) => a.subjectId)).size;
    const weeklyHours = schedules.reduce((total, schedule) => {
        const start = new Date(`1970-01-01T${schedule.startTime}`);
        const end = new Date(`1970-01-01T${schedule.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + (isNaN(hours) ? 0 : hours);
    }, 0);
    const stats = {
        totalClasses,
        totalSubjects,
        weeklyHours,
    };
    return {
        professeur,
        scheduleByDay,
        stats,
    };
};
exports.getProfesseurFullDetailsService = getProfesseurFullDetailsService;
/**
 * @desc Génère et envoie les identifiants de connexion par email
 */
const sendLoginCredentialsEmail = async (email, firstName, password) => {
    try {
        const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:4000"}/auth/login`;
        const resetPasswordUrl = `${process.env.FRONTEND_URL || "http://localhost:4000"}/auth/reset-password`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .credentials { background-color: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
          .password { font-family: monospace; font-size: 18px; font-weight: bold; color: #d32f2f; }
          .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue sur ${process.env.APP_NAME || "Notre Plateforme Éducative"}</h1>
          </div>
          <div class="content">
            <p>Bonjour ${firstName},</p>
            
            <p>Votre compte professeur a été créé avec succès.</p>
            
            <div class="credentials">
              <p><strong>Vos identifiants de connexion :</strong></p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Mot de passe temporaire :</strong> <span class="password">${password}</span></p>
            </div>
            
            <p class="warning">⚠️ IMPORTANT : Ce mot de passe est temporaire. Vous devrez le changer lors de votre première connexion.</p>
            
            <p>Pour accéder à votre compte :</p>
            <ol>
              <li>Rendez-vous sur : <a href="${loginUrl}">${loginUrl}</a></li>
              <li>Connectez-vous avec vos identifiants ci-dessus</li>
              <li>Suivez les instructions pour changer votre mot de passe</li>
            </ol>
            
            <a href="${loginUrl}" class="button">Accéder à mon compte</a>
            
            <p>Si vous avez des difficultés à vous connecter, vous pouvez réinitialiser votre mot de passe ici :</p>
            <a href="${resetPasswordUrl}">Réinitialiser mon mot de passe</a>
            
            <p>Pour toute assistance, contactez l'administrateur à : ${process.env.ADMIN_EMAIL || "admin@example.com"}</p>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || "Plateforme Éducative"}. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
        await (0, emailService_1.sendEmail)({
            to: email,
            subject: `[${process.env.APP_NAME || "Plateforme"}] Vos identifiants de connexion`,
            html,
        });
        console.log(`✅ Identifiants envoyés à ${email}`);
        return true;
    }
    catch (error) {
        console.error(`❌ Erreur lors de l'envoi des identifiants à ${email}:`, error);
        throw new Error("EMAIL_SEND_FAILED");
    }
};
exports.sendLoginCredentialsEmail = sendLoginCredentialsEmail;
/**
 * @desc Génère un mot de passe temporaire sécurisé
 */
const generateTemporaryPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    // Assurer au moins une majuscule, un chiffre et un caractère spécial
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
    // Remplir le reste
    for (let i = 3; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    // Mélanger
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};
/**
 * @desc Crée un nouvel utilisateur pour un professeur
 */
const createUserForProfesseur = async (email, firstName, lastName, sendCredentialsEmail = true) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return {
                userId: existingUser.id,
                password: null,
                userExists: true,
            };
        }
        // Générer un mot de passe temporaire
        const temporaryPassword = generateTemporaryPassword();
        // Hasher le mot de passe
        const hashedPassword = await bcrypt_1.default.hash(temporaryPassword, 10);
        // Créer un nouvel utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                role: "Professeur",
                status: prisma_1.UserStatus.Actif,
                password: hashedPassword,
                isInitialPassword: true,
            },
        });
        console.log(`✅ Compte professeur créé pour ${email}`);
        // Envoyer les identifiants par email si demandé
        let emailSent = false;
        if (sendCredentialsEmail) {
            try {
                await (0, exports.sendLoginCredentialsEmail)(email, firstName, temporaryPassword);
                emailSent = true;
                console.log(`📧 Email avec identifiants envoyé à ${email}`);
            }
            catch (emailError) {
                console.error(`⚠️ Échec envoi email à ${email}, mais compte créé`);
                // On continue même si l'email échoue
            }
        }
        return {
            userId: user.id,
            password: temporaryPassword,
            emailSent,
            userExists: false,
        };
    }
    catch (error) {
        console.error("❌ Erreur création compte utilisateur:", error);
        throw error;
    }
};
/**
 * @desc Crée un nouveau professeur avec envoi d'identifiants par email
 * RETOURNE: { professeur, userAccountCreated, emailSent, temporaryPassword? }
 */
const createProfesseurService = async (data) => {
    const { firstName, lastName, email, phone, speciality, matricule, userId, createUserAccount = false, sendInvitation = true, } = data;
    console.log("🚀 Création professeur:", {
        firstName,
        lastName,
        email,
        createUserAccount,
        sendInvitation,
    });
    // Vérifier si l'email existe déjà
    const existingProfesseur = await prisma.professeur.findUnique({
        where: { email },
    });
    if (existingProfesseur) {
        throw new Error("PROFESSEUR_EMAIL_EXISTS");
    }
    let finalUserId = userId || null;
    let userAccountCreated = false;
    let emailSent = false;
    let temporaryPassword = null;
    // Création du compte utilisateur
    if (createUserAccount && !finalUserId) {
        try {
            const userResult = await createUserForProfesseur(email, firstName, lastName, sendInvitation);
            finalUserId = userResult.userId;
            userAccountCreated = !userResult.userExists;
            emailSent = userResult.emailSent || false;
            temporaryPassword = userResult.password;
            console.log("✅ Compte utilisateur traité:", {
                userId: finalUserId,
                created: userAccountCreated,
                emailSent,
            });
        }
        catch (userError) {
            console.error("❌ Erreur création utilisateur:", userError);
            // On continue même si la création de l'utilisateur échoue
            finalUserId = null;
        }
    }
    // Si un userId est fourni, vérifier qu'il existe
    if (finalUserId && !userAccountCreated) {
        const user = await prisma.user.findUnique({
            where: { id: finalUserId },
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        // Vérifier si l'utilisateur a déjà un professeur
        const existingProfesseurWithUser = await prisma.professeur.findUnique({
            where: { userId: finalUserId },
        });
        if (existingProfesseurWithUser) {
            throw new Error("USER_ALREADY_PROFESSEUR");
        }
    }
    // Créer le professeur
    const createData = {
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        status: "Actif",
    };
    // Ajouter les champs optionnels
    if (phone && phone.trim())
        createData.phone = phone.trim();
    if (speciality && speciality.trim())
        createData.speciality = speciality.trim();
    if (matricule && matricule.trim())
        createData.matricule = matricule.trim();
    const professeur = await prisma.professeur.create({
        data: createData,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    isInitialPassword: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    schedules: true,
                },
            },
        },
    });
    console.log("✅ Professeur créé:", professeur.id);
    // Retourner le format attendu par le contrôleur
    return {
        professeur,
        userAccountCreated,
        emailSent,
        ...(temporaryPassword && { temporaryPassword }),
    };
};
exports.createProfesseurService = createProfesseurService;
/**
 * @desc Associe un compte utilisateur à un professeur existant
 */
const attachUserToProfesseurService = async (professeurId, options) => {
    const { userId, email, createIfNotExists = false, sendCredentialsEmail = true, } = options;
    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
        where: { id: professeurId },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    let finalUserId = userId;
    let userCreated = false;
    let temporaryPassword = null;
    let emailSent = false;
    // Si email fourni sans userId
    if (email && !userId) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            finalUserId = existingUser.id;
        }
        else if (createIfNotExists) {
            // Créer un nouvel utilisateur
            const result = await createUserForProfesseur(email, professeur.firstName, professeur.lastName, sendCredentialsEmail);
            finalUserId = result.userId;
            temporaryPassword = result.password;
            userCreated = !result.userExists;
            emailSent = result.emailSent || false;
        }
        else {
            throw new Error("USER_NOT_FOUND");
        }
    }
    // Vérifier si l'utilisateur existe
    if (finalUserId) {
        const user = await prisma.user.findUnique({
            where: { id: finalUserId },
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        // Vérifier si cet utilisateur est déjà associé à un autre professeur
        const existingProfesseurWithUser = await prisma.professeur.findUnique({
            where: { userId: finalUserId },
        });
        if (existingProfesseurWithUser &&
            existingProfesseurWithUser.id !== professeurId) {
            throw new Error("USER_ALREADY_ASSOCIATED");
        }
        // Mettre à jour le professeur
        const updatedProfesseur = await prisma.professeur.update({
            where: { id: professeurId },
            data: { userId: finalUserId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });
        return {
            professeur: updatedProfesseur,
            userAccountCreated: userCreated,
            emailSent,
            temporaryPassword,
        };
    }
    else {
        throw new Error("NO_USER_SPECIFIED");
    }
};
exports.attachUserToProfesseurService = attachUserToProfesseurService;
/**
 * @desc Détache un compte utilisateur d'un professeur
 */
const detachUserFromProfesseurService = async (id) => {
    const professeur = await prisma.professeur.findUnique({
        where: { id },
    });
    if (!professeur) {
        throw new Error("PROFESSEUR_NOT_FOUND");
    }
    if (!professeur.userId) {
        throw new Error("NO_USER_ACCOUNT");
    }
    // Détacher l'utilisateur
    const updatedProfesseur = await prisma.professeur.update({
        where: { id },
        data: { userId: null },
    });
    return { professeur: updatedProfesseur };
};
exports.detachUserFromProfesseurService = detachUserFromProfesseurService;
//# sourceMappingURL=professeurService.js.map