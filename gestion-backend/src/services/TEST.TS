/**
 * @file professeurService.ts
 * @description Services pour la gestion des professeurs
 */

import { PrismaClient, UserStatus } from "../../generated/prisma";
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "./emailService";

const prisma = new PrismaClient();

export interface ProfesseurFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  speciality?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProfesseurData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  matricule?: string;
  userId?: string | null;
  createUserAccount?: boolean;
  sendInvitation?: boolean;
}

export interface UpdateProfesseurData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  matricule?: string;
  status?: string;
  userId?: string | null;
}

// Validation des données
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone?: string): boolean => {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};

const validateProfesseurData = (
  data: CreateProfesseurData | UpdateProfesseurData
): void => {
  const errors: string[] = [];

  if ("email" in data && data.email && !validateEmail(data.email)) {
    errors.push("EMAIL_INVALID");
  }

  if ("phone" in data && data.phone && !validatePhone(data.phone)) {
    errors.push("PHONE_INVALID");
  }

  if (
    "firstName" in data &&
    data.firstName &&
    data.firstName.trim().length < 2
  ) {
    errors.push("FIRSTNAME_TOO_SHORT");
  }

  if ("lastName" in data && data.lastName && data.lastName.trim().length < 2) {
    errors.push("LASTNAME_TOO_SHORT");
  }

  if (errors.length > 0) {
    throw new Error(`VALIDATION_ERROR: ${errors.join(", ")}`);
  }
};

// Classes d'erreur spécifiques
class ProfesseurError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ProfesseurError";
  }
}

/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
 */
export const getProfesseursService = async (filters: ProfesseurFilters) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      speciality,
      sortBy = "lastName",
      sortOrder = "asc"} = filters;

    const pageNum = parseInt(page as any);
    const limitNum = parseInt(limit as any);
    const skip = (pageNum - 1) * limitNum;

    // Validation des paramètres
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new ProfesseurError(
        "INVALID_PARAMETERS",
        "Paramètres de pagination invalides"
      );
    }

    // Filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search} },
        { lastName: { contains: search} },
        { email: { contains: search} },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (speciality) {
      where.speciality = {
        contains: speciality};
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
              status: true}},
          assignments: {
            include: {
              subject: true,
              academicYear: true}},
          _count: {
            select: {
              assignments: true,
              schedules: true}}},
        orderBy: {
          [sortBy]: sortOrder === "desc" ? "desc" : "asc"},
        skip,
        take: limitNum}),
      prisma.professeur.count({ where }),
    ]);

    return {
      professeurs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)}};
  } catch (error) {
    console.error("Erreur dans getProfesseursService:", error);
    throw error;
  }
};

/**
 * @desc Récupère un professeur par ID
 */
export const getProfesseurByIdService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

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
            createdAt: true}},
        assignments: {
          include: {
            subject: true,
            academicYear: true,
            schedules: {
              include: {
                schoolClass: true}}}},
        schedules: {
          include: {
            classAssignment: {
              include: {
                subject: true}},
            schoolClass: true}}}});

    if (!professeur) {
      throw new ProfesseurError(
        "PROFESSEUR_NOT_FOUND",
        "Professeur non trouvé",
        { id }
      );
    }

    return professeur;
  } catch (error) {
    console.error("Erreur dans getProfesseurByIdService:", error);
    throw error;
  }
};

/**
 * @desc Met à jour un professeur
 */
export const updateProfesseurService = async (
  id: string,
  data: UpdateProfesseurData
) => {
  try {
    // Validation des données
    validateProfesseurData(data);

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const existingProfesseur = await tx.professeur.findUnique({
        where: { id }});

      if (!existingProfesseur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { id }
        );
      }

      // Vérifier si le nouvel email existe déjà
      if (data.email && data.email !== existingProfesseur.email) {
        const professeurWithEmail = await tx.professeur.findUnique({
          where: { email: data.email }});

        if (professeurWithEmail) {
          throw new ProfesseurError(
            "PROFESSEUR_EMAIL_EXISTS",
            "Un professeur avec cet email existe déjà",
            { email: data.email }
          );
        }
      }

      // Préparer les données de mise à jour
      const updateData: any = { ...data };

      // Gérer le userId (peut être null pour détacher)
      if (data.userId !== undefined) {
        if (data.userId === null || data.userId === "") {
          // Détacher l'utilisateur
          updateData.userId = null;
        } else {
          // Vérifier si l'utilisateur existe
          const user = await tx.user.findUnique({
            where: { id: data.userId }});

          if (!user) {
            throw new ProfesseurError(
              "USER_NOT_FOUND",
              "Utilisateur non trouvé",
              { userId: data.userId }
            );
          }

          // Vérifier si cet utilisateur est déjà associé à un autre professeur
          if (data.userId !== existingProfesseur.userId) {
            const existingProfesseurWithUser = await tx.professeur.findUnique({
              where: { userId: data.userId }});

            if (existingProfesseurWithUser) {
              throw new ProfesseurError(
                "USER_ALREADY_ASSOCIATED",
                "Cet utilisateur est déjà associé à un autre professeur",
                { userId: data.userId }
              );
            }
          }

          updateData.userId = data.userId;
        }
      }

      // Mettre à jour le professeur
      const professeur = await tx.professeur.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true}}}});

      // Mettre à jour l'email de l'utilisateur associé si nécessaire
      if (data.email && professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { email: data.email.toLowerCase().trim() }});
      }

      return professeur;
    });
  } catch (error) {
    console.error("Erreur dans updateProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Supprime/désactive un professeur
 */
export const deleteProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              assignments: true,
              schedules: true}}}});

      if (!professeur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { id }
        );
      }

      // Vérifier les dépendances
      if (professeur._count.assignments > 0) {
        throw new ProfesseurError(
          "PROFESSEUR_HAS_DEPENDENCIES",
          "Impossible de supprimer un professeur avec des assignations actives",
          {
            assignmentsCount: professeur._count.assignments}
        );
      }

      // Désactiver plutôt que supprimer
      await tx.professeur.update({
        where: { id },
        data: { status: "Inactif" }});

      // Si le professeur a un compte utilisateur, le désactiver aussi
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Inactif }});
      }

      return {
        message: "Professeur désactivé avec succès",
        assignmentsCount: professeur._count.assignments};
    });
  } catch (error) {
    console.error("Erreur dans deleteProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Active un professeur
 */
export const activateProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id }});

      if (!professeur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { id }
        );
      }

      // Activer le professeur
      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: { status: "Actif" }});

      // Activer l'utilisateur associé si existe
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Actif }});
      }

      return updatedProfesseur;
    });
  } catch (error) {
    console.error("Erreur dans activateProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Désactive un professeur
 */
export const deactivateProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id }});

      if (!professeur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { id }
        );
      }

      // Désactiver le professeur
      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: { status: "Inactif" }});

      // Désactiver l'utilisateur associé si existe
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Inactif }});
      }

      return updatedProfesseur;
    });
  } catch (error) {
    console.error("Erreur dans deactivateProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Récupère les détails complets d'un professeur
 */
export const getProfesseurFullDetailsService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

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
            updatedAt: true}},
        assignments: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true}},
            academicYear: {
              select: {
                id: true,
                year: true}},
            schedules: {
              include: {
                schoolClass: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                    capacity: true}}},
              orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]}}},
        schedules: {
          include: {
            classAssignment: {
              include: {
                subject: true,
                academicYear: true}},
            schoolClass: true},
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]},
        _count: {
          select: {
            assignments: true,
            schedules: true}}}});

    if (!professeur) {
      throw new ProfesseurError(
        "PROFESSEUR_NOT_FOUND",
        "Professeur non trouvé",
        { id }
      );
    }

    // Organiser l'emploi du temps par jour avec validation
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    professeur.schedules.forEach((schedule: any) => {
      const day = Number(schedule.dayOfWeek);
      if (!Number.isInteger(day) || day < 1 || day > 7) {
        console.warn(
          `Jour de semaine invalide pour le schedule ${schedule.id}: ${day}`
        );
        return;
      }
      scheduleByDay[day].push(schedule);
    });

    // Calculer les statistiques
    const assignments = professeur.assignments || [];
    const schedules = professeur.schedules || [];

    const totalClasses = new Set(
      assignments.flatMap((a: any) =>
        (a.schedules || []).map((s: any) => s.schoolClassId)
      )
    ).size;

    const totalSubjects = new Set(assignments.map((a: any) => a.subjectId))
      .size;

    const weeklyHours = schedules.reduce((total: number, schedule: any) => {
      try {
        const start = new Date(`1970-01-01T${schedule.startTime}`);
        const end = new Date(`1970-01-01T${schedule.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + (isNaN(hours) ? 0 : hours);
      } catch (error) {
        console.warn(
          `Format d'heure invalide pour le schedule ${schedule.id}: ${schedule.startTime}-${schedule.endTime}`
        );
        return total;
      }
    }, 0);

    const stats = {
      totalClasses,
      totalSubjects,
      weeklyHours: Math.round(weeklyHours * 100) / 100};

    return {
      professeur,
      scheduleByDay,
      stats};
  } catch (error) {
    console.error("Erreur dans getProfesseurFullDetailsService:", error);
    throw error;
  }
};

/**
 * @desc Génère et envoie les identifiants de connexion par email
 */
export const sendLoginCredentialsEmail = async (
  email: string,
  firstName: string,
  password: string
) => {
  try {
    if (!email || !firstName || !password) {
      throw new ProfesseurError(
        "MISSING_DATA",
        "Données manquantes pour l'envoi d'email"
      );
    }

    if (!validateEmail(email)) {
      throw new ProfesseurError("INVALID_EMAIL", "Format d'email invalide", {
        email});
    }

    const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password`;

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

    await sendEmail({
      to: email,
      subject: `[${process.env.APP_NAME || "Plateforme"}] Vos identifiants de connexion`,
      html});

    console.log(`✅ Identifiants envoyés à ${email}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Erreur lors de l'envoi des identifiants à ${email}:`,
      error
    );
    throw new ProfesseurError(
      "EMAIL_SEND_FAILED",
      "Échec de l'envoi de l'email",
      { email }
    );
  }
};

/**
 * @desc Génère un mot de passe temporaire sécurisé
 */
const generateTemporaryPassword = (): string => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
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
const createUserForProfesseur = async (
  email: string,
  firstName: string,
  lastName: string,
  sendCredentialsEmail: boolean = true
) => {
  try {
    // Validation
    if (!email || !firstName || !lastName) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "Champs requis manquants pour la création d'utilisateur"
      );
    }

    if (!validateEmail(email)) {
      throw new ProfesseurError("INVALID_EMAIL", "Format d'email invalide", {
        email});
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }});

    if (existingUser) {
      return {
        userId: existingUser.id,
        password: null,
        userExists: true};
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = generateTemporaryPassword();

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Créer un nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "Professeur",
        status: UserStatus.Actif,
        password: hashedPassword,
        isInitialPassword: true}});

    console.log(`✅ Compte professeur créé pour ${email}`);

    // Envoyer les identifiants par email si demandé
    let emailSent = false;
    if (sendCredentialsEmail) {
      try {
        await sendLoginCredentialsEmail(email, firstName, temporaryPassword);
        emailSent = true;
        console.log(`📧 Email avec identifiants envoyé à ${email}`);
      } catch (emailError) {
        console.error(`⚠️ Échec envoi email à ${email}, mais compte créé`);
        // On continue même si l'email échoue
      }
    }

    return {
      userId: user.id,
      password: temporaryPassword,
      emailSent,
      userExists: false};
  } catch (error) {
    console.error("❌ Erreur création compte utilisateur:", error);
    throw error;
  }
};

/**
 * @desc Crée un nouveau professeur avec envoi d'identifiants par email
 * RETOURNE: { professeur, userAccountCreated, emailSent, temporaryPassword? }
 */
export const createProfesseurService = async (data: CreateProfesseurData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      speciality,
      matricule,
      userId,
      createUserAccount = false,
      sendInvitation = true} = data;

    console.log("🚀 Création professeur:", {
      firstName,
      lastName,
      email,
      createUserAccount,
      sendInvitation});

    // Validation des données
    validateProfesseurData(data);

    if (!email || !firstName || !lastName) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "Prénom, nom et email sont requis"
      );
    }

    return await prisma.$transaction(
      async (tx) => {
        // Vérifier si l'email existe déjà (dans la transaction)
        const existingProfesseur = await tx.professeur.findUnique({
          where: { email: email.toLowerCase().trim() }});

        if (existingProfesseur) {
          throw new ProfesseurError(
            "PROFESSEUR_EMAIL_EXISTS",
            "Un professeur avec cet email existe déjà",
            { email }
          );
        }

        let finalUserId = userId || null;
        let userAccountCreated = false;
        let emailSent = false;
        let temporaryPassword: string | null = null;

        // Création du compte utilisateur dans la transaction
        if (createUserAccount && !finalUserId) {
          try {
            // Vérifier si l'utilisateur existe déjà (même transaction)
            const existingUser = await tx.user.findUnique({
              where: { email: email.toLowerCase().trim() }});

            if (existingUser) {
              finalUserId = existingUser.id;
              userAccountCreated = false;

              // Vérifier si cet utilisateur est déjà associé à un professeur
              const existingProfesseurWithUser = await tx.professeur.findUnique(
                {
                  where: { userId: existingUser.id }}
              );

              if (existingProfesseurWithUser) {
                throw new ProfesseurError(
                  "USER_ALREADY_PROFESSEUR",
                  "Cet utilisateur est déjà associé à un professeur"
                );
              }
            } else {
              // Générer un mot de passe temporaire
              temporaryPassword = generateTemporaryPassword();
              const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

              // Créer l'utilisateur
              const user = await tx.user.create({
                data: {
                  email: email.toLowerCase().trim(),
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  role: "Professeur",
                  status: UserStatus.Actif,
                  password: hashedPassword,
                  isInitialPassword: true}});

              finalUserId = user.id;
              userAccountCreated = true;

              // Envoyer les identifiants par email si demandé
              if (sendInvitation) {
                try {
                  await sendLoginCredentialsEmail(
                    email,
                    firstName,
                    temporaryPassword
                  );
                  emailSent = true;
                  console.log(`📧 Email avec identifiants envoyé à ${email}`);
                } catch (emailError) {
                  console.error(
                    `⚠️ Échec envoi email à ${email}, mais compte créé`
                  );
                  // On continue même si l'email échoue
                }
              }
            }

            console.log("✅ Compte utilisateur traité:", {
              userId: finalUserId,
              created: userAccountCreated,
              emailSent});
          } catch (userError: any) {
            console.error("❌ Erreur création utilisateur:", userError);
            // Annuler toute la transaction en cas d'erreur
            throw userError;
          }
        }

        // Si un userId est fourni, vérifier qu'il existe
        if (finalUserId && !userAccountCreated) {
          const user = await tx.user.findUnique({
            where: { id: finalUserId }});

          if (!user) {
            throw new ProfesseurError(
              "USER_NOT_FOUND",
              "Utilisateur non trouvé"
            );
          }

          // Vérifier si l'utilisateur a déjà un professeur
          const existingProfesseurWithUser = await tx.professeur.findUnique({
            where: { userId: finalUserId }});

          if (existingProfesseurWithUser) {
            throw new ProfesseurError(
              "USER_ALREADY_PROFESSEUR",
              "Cet utilisateur est déjà associé à un professeur"
            );
          }
        }

        // Créer le professeur
        const createData: any = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          status: "Actif"};

        // Ajouter les champs optionnels
        if (phone && phone.trim()) createData.phone = phone.trim();
        if (speciality && speciality.trim())
          createData.speciality = speciality.trim();
        if (matricule && matricule.trim())
          createData.matricule = matricule.trim();
        if (finalUserId) createData.userId = finalUserId;

        const professeur = await tx.professeur.create({
          data: createData,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                status: true,
                isInitialPassword: true}},
            _count: {
              select: {
                assignments: true,
                schedules: true}}}});

        console.log("✅ Professeur créé:", professeur.id);

        return {
          professeur,
          userAccountCreated,
          emailSent,
          ...(temporaryPassword && { temporaryPassword })};
      },
      {
        timeout: 10000, // Timeout de 10 secondes pour la transaction
      }
    );
  } catch (error) {
    console.error("❌ Erreur dans createProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Associe un compte utilisateur à un professeur existant
 */
export const attachUserToProfesseurService = async (
  professeurId: string,
  options: {
    userId?: string;
    email?: string;
    createIfNotExists?: boolean;
    sendCredentialsEmail?: boolean;
  }
) => {
  try {
    const {
      userId,
      email,
      createIfNotExists = false,
      sendCredentialsEmail = true} = options;

    if (!professeurId) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id: professeurId }});

      if (!professeur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { professeurId }
        );
      }

      let finalUserId = userId;
      let userCreated = false;
      let temporaryPassword: string | null = null;
      let emailSent = false;

      // Si email fourni sans userId
      if (email && !userId) {
        if (!validateEmail(email)) {
          throw new ProfesseurError(
            "INVALID_EMAIL",
            "Format d'email invalide",
            { email }
          );
        }

        const existingUser = await tx.user.findUnique({
          where: { email: email.toLowerCase().trim() }});

        if (existingUser) {
          finalUserId = existingUser.id;
        } else if (createIfNotExists) {
          // Générer un mot de passe temporaire
          temporaryPassword = generateTemporaryPassword();
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

          // Créer un nouvel utilisateur
          const user = await tx.user.create({
            data: {
              email: email.toLowerCase().trim(),
              firstName: professeur.firstName,
              lastName: professeur.lastName,
              role: "Professeur",
              status: UserStatus.Actif,
              password: hashedPassword,
              isInitialPassword: true}});

          finalUserId = user.id;
          userCreated = true;

          // Envoyer les identifiants
          if (sendCredentialsEmail) {
            try {
              await sendLoginCredentialsEmail(
                email,
                professeur.firstName,
                temporaryPassword
              );
              emailSent = true;
            } catch (emailError) {
              console.error("⚠️ Échec envoi email, mais compte créé");
            }
          }
        } else {
          throw new ProfesseurError(
            "USER_NOT_FOUND",
            "Utilisateur non trouvé",
            { email }
          );
        }
      }

      // Vérifier si l'utilisateur existe
      if (finalUserId) {
        const user = await tx.user.findUnique({
          where: { id: finalUserId }});

        if (!user) {
          throw new ProfesseurError("USER_NOT_FOUND", "Utilisateur non trouvé");
        }

        // Vérifier si cet utilisateur est déjà associé à un autre professeur
        const existingProfesseurWithUser = await tx.professeur.findUnique({
          where: { userId: finalUserId }});

        if (
          existingProfesseurWithUser &&
          existingProfesseurWithUser.id !== professeurId
        ) {
          throw new ProfesseurError(
            "USER_ALREADY_ASSOCIATED",
            "Cet utilisateur est déjà associé à un autre professeur"
          );
        }

        // Mettre à jour le professeur
        const updatedProfesseur = await tx.professeur.update({
          where: { id: professeurId },
          data: { userId: finalUserId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                status: true}}}});

        return {
          professeur: updatedProfesseur,
          userAccountCreated: userCreated,
          emailSent,
          temporaryPassword};
      } else {
        throw new ProfesseurError(
          "NO_USER_SPECIFIED",
          "Aucun utilisateur spécifié"
        );
      }
    });
  } catch (error) {
    console.error("Erreur dans attachUserToProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Détache un compte utilisateur d'un professeur
 */
export const detachUserFromProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError("MISSING_ID", "ID du professeur requis");
    }

    return await prisma.$transaction(async (tx) => {
      const professeur = await tx.professeur.findUnique({
        where: { id }});

      if (!professeur) {
        throw new ProfesseurError(
          "PROFESSEUR_NOT_FOUND",
          "Professeur non trouvé",
          { id }
        );
      }

      if (!professeur.userId) {
        throw new ProfesseurError(
          "NO_USER_ACCOUNT",
          "Ce professeur n'a pas de compte utilisateur associé"
        );
      }

      // Détacher l'utilisateur
      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: { userId: null }});

      return { professeur: updatedProfesseur };
    });
  } catch (error) {
    console.error("Erreur dans detachUserFromProfesseurService:", error);
    throw error;
  }
};
