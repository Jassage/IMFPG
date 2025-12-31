/**
 * @file professeurService.ts
 * @description Services pour la gestion des professeurs
 */

import { PrismaClient, UserStatus } from "../../generated/prisma";
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "./emailService"; // Assurez-vous que ce service existe

const prisma = new PrismaClient();

// ... autres interfaces existantes ...

/**
 * @desc Génère et envoie les identifiants de connexion par email
 */
export const sendLoginCredentialsEmail = async (
  email: string,
  firstName: string,
  password: string
) => {
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

    await sendEmail({
      to: email,
      subject: `[${process.env.APP_NAME || "Plateforme"}] Vos identifiants de connexion`,
      html,
    });

    console.log(`✅ Identifiants envoyés à ${email}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Erreur lors de l'envoi des identifiants à ${email}:`,
      error
    );
    throw new Error("EMAIL_SEND_FAILED");
  }
};

/**
 * @desc Crée un utilisateur pour un professeur avec envoi d'email
 */
export const createProfesseurUserAccountService = async (
  email: string,
  firstName: string,
  lastName: string,
  sendCredentialsEmail: boolean = true
) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { userId: existingUser.id, password: null };
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = generateTemporaryPassword();

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Créer un nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role: "Professeur",
        status: UserStatus.Actif,
        password: hashedPassword,
        mustChangePassword: true, // Ajouter ce champ pour forcer le changement
      },
    });

    console.log(`✅ Compte professeur créé pour ${email}`);

    // Envoyer les identifiants par email si demandé
    if (sendCredentialsEmail) {
      try {
        await sendLoginCredentialsEmail(email, firstName, temporaryPassword);
        console.log(`📧 Email avec identifiants envoyé à ${email}`);
      } catch (emailError) {
        console.error(`⚠️ Échec envoi email à ${email}, mais compte créé`);
        // On continue même si l'email échoue
      }
    }

    return {
      userId: user.id,
      password: temporaryPassword,
      emailSent: sendCredentialsEmail,
    };
  } catch (error) {
    console.error("❌ Erreur création compte utilisateur:", error);
    throw error;
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
 * @desc Crée un nouveau professeur avec envoi d'identifiants par email
 */
export const createProfesseurService = async (data: CreateProfesseurData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    speciality,
    matricule,
    userId,
    createUserAccount = false,
    sendInvitation = true, // Par défaut, on envoie l'invitation
  } = data;

  // Vérifier si l'email existe déjà
  const existingProfesseur = await prisma.professeur.findUnique({
    where: { email },
  });

  if (existingProfesseur) {
    throw new Error("PROFESSEUR_EMAIL_EXISTS");
  }

  let finalUserId = userId || null;
  let userAccountCreated = false;
  let temporaryPassword: string | null = null;
  let emailSent = false;

  // Si createUserAccount est true et qu'aucun userId n'est fourni, créer un utilisateur
  if (createUserAccount && !finalUserId) {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Associer l'utilisateur existant
      finalUserId = existingUser.id;

      // Vérifier si cet utilisateur a déjà un profil professeur
      const existingProfesseurWithUser = await prisma.professeur.findUnique({
        where: { userId: existingUser.id },
      });

      if (existingProfesseurWithUser) {
        throw new Error("USER_ALREADY_PROFESSEUR");
      }
    } else {
      // Créer un nouvel utilisateur
      const result = await createProfesseurUserAccountService(
        email,
        firstName,
        lastName,
        sendInvitation
      );
      finalUserId = result.userId;
      temporaryPassword = result.password;
      userAccountCreated = true;
      emailSent = result.emailSent || false;
    }
  }

  // Si un userId est fourni, vérifier qu'il existe
  if (finalUserId) {
    const user = await prisma.user.findUnique({
      where: { id: finalUserId },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Vérifier si l'utilisateur a déjà un profil professeur
    const existingProfesseurWithUser = await prisma.professeur.findUnique({
      where: { userId: finalUserId },
    });

    if (existingProfesseurWithUser) {
      throw new Error("USER_ALREADY_PROFESSEUR");
    }
  }

  // Créer le professeur
  const createData: any = {
    firstName,
    lastName,
    email,
    phone,
    speciality,
    status: UserStatus.Actif,
    userId: finalUserId,
  };

  // Ajouter matricule uniquement s'il est défini
  if (matricule !== undefined) {
    createData.matricule = matricule;
  }

  const professeur = await prisma.professeur.create({
    data: createData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          mustChangePassword: true,
        },
      },
    },
  });

  // Préparer la réponse
  const responseData: any = {
    success: true,
    professeur,
    userAccountCreated,
    emailSent,
    message: "Professeur créé avec succès",
  };

  // Ajouter des informations supplémentaires si un compte a été créé
  if (userAccountCreated) {
    responseData.temporaryPassword = temporaryPassword;

    if (emailSent) {
      responseData.message += " - Les identifiants ont été envoyés par email";
    } else {
      responseData.message +=
        " - IMPORTANT : Les identifiants n'ont pas pu être envoyés par email";
      responseData.warning =
        "Veuillez communiquer manuellement le mot de passe au professeur";
    }
  }

  return responseData;
};

/**
 * @desc Associe un compte utilisateur à un professeur existant avec envoi d'email
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
  const {
    userId,
    email,
    createIfNotExists = false,
    sendCredentialsEmail = true,
  } = options;

  // Vérifier si le professeur existe
  const professeur = await prisma.professeur.findUnique({
    where: { id: professeurId },
  });

  if (!professeur) {
    throw new Error("PROFESSEUR_NOT_FOUND");
  }

  let finalUserId = userId;
  let userCreated = false;
  let temporaryPassword: string | null = null;
  let emailSent = false;

  // Si email fourni sans userId
  if (email && !userId) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      finalUserId = existingUser.id;
    } else if (createIfNotExists) {
      // Créer un nouvel utilisateur
      const result = await createProfesseurUserAccountService(
        email,
        professeur.firstName,
        professeur.lastName,
        sendCredentialsEmail
      );
      finalUserId = result.userId;
      temporaryPassword = result.password;
      userCreated = true;
      emailSent = result.emailSent || false;
    } else {
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

    if (
      existingProfesseurWithUser &&
      existingProfesseurWithUser.id !== professeurId
    ) {
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
      success: true,
      professeur: updatedProfesseur,
      userAccountCreated: userCreated,
      emailSent,
      temporaryPassword,
      message: userCreated
        ? emailSent
          ? "Compte utilisateur créé et identifiants envoyés par email"
          : "Compte utilisateur créé (échec envoi email)"
        : "Compte utilisateur associé avec succès",
    };
  } else {
    throw new Error("NO_USER_SPECIFIED");
  }
};

// ... le reste du code reste inchangé ...
