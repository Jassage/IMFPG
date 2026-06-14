// controllers/parentController.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { hashPassword } from "../utils/security";
import { sendEmail } from "../services/emailService";

/**
 * @desc Crée un compte parent (User role=Parent + Parent) et le rattache
 *       à un ou plusieurs élèves via la table Guardian.
 *
 *       Sémantique de liaison (décidée avec le métier) : pour chaque élève,
 *       si un tuteur portant le même email existe déjà et n'est lié à aucun
 *       compte parent, on lui rattache simplement le nouveau parent (parentId)
 *       en conservant sa relation existante (Père/Mère/...). Sinon on crée une
 *       nouvelle ligne Guardian (relationship="Parent").
 *
 * @route POST /api/parents/create
 * @access Admin/Staff
 */
export const createParentAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      children = [],
      sendWelcomeEmail = true,
    } = req.body;

    console.log("📥 POST /api/parents/create - Création:", {
      firstName,
      lastName,
      email,
      children,
    });

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Prénom, nom, email et mot de passe sont requis",
      });
      return;
    }

    if (!Array.isArray(children)) {
      res.status(400).json({
        success: false,
        message: "La liste des enfants (children) doit être un tableau",
      });
      return;
    }

    // Vérifier l'unicité de l'email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
      return;
    }

    // Vérifier que tous les élèves existent avant toute écriture
    const uniqueChildren: string[] = Array.from(new Set(children as string[]));

    if (uniqueChildren.length > 0) {
      const foundStudents = await prisma.student.findMany({
        where: { id: { in: uniqueChildren } },
        select: { id: true },
      });

      if (foundStudents.length !== uniqueChildren.length) {
        res.status(404).json({
          success: false,
          message: "Un ou plusieurs élèves sélectionnés sont introuvables",
        });
        return;
      }
    }

    // Hacher le mot de passe choisi
    const hashedPassword = await hashPassword(password);

    // Création atomique : User + Parent + liaisons Guardian
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || null,
          role: "Parent",
          status: "Actif",
          password: hashedPassword,
          // Le mot de passe est défini à la création par l'admin : ce n'est
          // pas un mot de passe initial à changer obligatoirement.
          isInitialPassword: false,
        },
      });

      const parent = await tx.parent.create({
        data: { userId: user.id },
      });

      // Rattacher / créer un Guardian pour chaque enfant
      for (const studentId of uniqueChildren) {
        // Tuteur existant correspondant (même email, pas encore lié à un parent)
        const existingGuardian = await tx.guardian.findFirst({
          where: {
            studentId,
            parentId: null,
            email,
          },
        });

        if (existingGuardian) {
          // Rattacher au compte parent en conservant la relation existante
          await tx.guardian.update({
            where: { id: existingGuardian.id },
            data: { parentId: parent.id },
          });
        } else {
          // Premier tuteur de cet élève => principal par défaut
          const guardianCount = await tx.guardian.count({
            where: { studentId },
          });

          await tx.guardian.create({
            data: {
              firstName,
              lastName,
              relationship: "Parent",
              phone: phone || "",
              email: email || null,
              address: address || null,
              isPrimary: guardianCount === 0,
              studentId,
              parentId: parent.id,
            },
          });
        }
      }

      return { user, parent };
    });

    // Email de bienvenue (best-effort, hors transaction : ne doit pas
    // faire échouer la création du compte si l'envoi échoue).
    let emailSent = false;
    if (sendWelcomeEmail && email) {
      try {
        await sendEmail({
          to: email,
          subject: "Bienvenue sur le portail parent",
          html: `
            <p>Bonjour ${firstName} ${lastName},</p>
            <p>Un compte parent a été créé pour vous afin de suivre la scolarité de vos enfants.</p>
            <p><strong>Identifiant de connexion :</strong> ${email}</p>
            <p>Utilisez le mot de passe qui vous a été communiqué par l'établissement pour vous connecter au portail.</p>
            <p>À bientôt,<br/>L'équipe de l'établissement</p>
          `,
        });
        emailSent = true;
      } catch (emailError) {
        console.error(
          "⚠️ Compte parent créé mais échec de l'email de bienvenue:",
          emailError
        );
      }
    }

    // Récupérer le parent complet pour la réponse (sans le mot de passe)
    const createdParent = await prisma.parent.findUnique({
      where: { id: result.parent.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        guardians: {
          select: {
            id: true,
            relationship: true,
            isPrimary: true,
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
              },
            },
          },
        },
      },
    });

    console.log(`✅ Compte parent créé: ${result.parent.id}`);

    res.status(201).json({
      success: true,
      message: "Compte parent créé avec succès",
      data: createdParent,
      emailSent,
    });
  } catch (error: any) {
    console.error("❌ Erreur createParentAccount:", error);

    // Email déjà utilisé (collision unique côté User)
    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
      return;
    }

    // Référence invalide (élève inexistant)
    if (error.code === "P2003") {
      res.status(400).json({
        success: false,
        message: "Référence invalide (élève inexistant)",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte parent",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
