/**
 * @file userController.ts
 * @description Contrôleurs pour la gestion des utilisateurs (partie admin)
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

import {
  generateResetToken,
  generateResetTokenExpiry,
  hashPassword,
} from "../utils/security";
import {
  extractAuditData,
  generateEmailTemplate,
  generateResetLink,
} from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import { AuthActionTypes, AuthControllerResponse } from "./auth/authTypes";
import { sendEmail } from "../services/emailService";

const prisma = new PrismaClient();

/**
 * @desc Récupère la liste des utilisateurs avec pagination et filtres
 * @route GET /api/auth/users
 * @access Admin
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construire la requête de filtrage
    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchStr = search as string;
      filter.OR = [
        { email: { contains: searchStr } },
        { firstName: { contains: searchStr } },
        { lastName: { contains: searchStr } },
      ];

      if (process.env.NODE_ENV !== "production") {
        console.log(`Recherche avec terme: ${searchStr}`);
      }
    }

    // Récupérer les utilisateurs avec pagination
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: filter,
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
          updatedAt: true,
          loginAttempts: true,
        },
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.user.count({
        where: filter,
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / limitNum);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USERS_LIST_REQUEST,
      entity: "User",
      description: "Liste des utilisateurs récupérée avec succès",
      status: "SUCCESS",
      metadata: {
        page: pageNum,
        limit: limitNum,
        totalUsers,
        filters: { role, status, search },
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Liste des utilisateurs récupérée avec succès",
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalUsers,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - getUsers error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USERS_LIST_ERROR,
      entity: "User",
      description: "Erreur lors de la récupération des utilisateurs",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère un utilisateur spécifique par ID
 * @route GET /api/auth/users/:id
 * @access Admin
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Récupérer l'utilisateur avec ses informations
    const user = await prisma.user.findUnique({
      where: { id },
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
        updatedAt: true,
        loginAttempts: {
          orderBy: {
            attemptTime: "desc",
          },
          take: 5,
        },
      },
    });

    if (!user) {
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.USER_NOT_FOUND,
        entity: "User",
        description: "Utilisateur non trouvé",
        status: "ERROR",
        metadata: { userId: id },
      });

      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DETAILS_REQUEST,
      entity: "User",
      entityId: id,
      description: "Détails de l'utilisateur récupérés avec succès",
      status: "SUCCESS",
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur récupéré avec succès",
      data: { user },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - getUserById error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DETAILS_ERROR,
      entity: "User",
      description:
        "Erreur lors de la récupération des détails de l'utilisateur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour un utilisateur
 * @route PUT /api/auth/users/:id
 * @access Admin
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      preferences,
      status,
      role,
    } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail && userWithEmail.id !== id) {
        const response: AuthControllerResponse = {
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur",
          code: "EMAIL_ALREADY_EXISTS",
        };
        res.status(400).json(response);
        return;
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    // if (preferences !== undefined)
    //   updateData.preferences = { ...existingUser.preferences, ...preferences };
    if (status !== undefined) updateData.status = status;
    if (role !== undefined) updateData.role = role;

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_UPDATE_SUCCESS,
      entity: "User",
      entityId: id,
      userId: id,
      description: "Utilisateur mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        updatedFields: Object.keys(updateData),
        oldEmail: existingUser.email,
        newEmail: updatedUser.email,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: { user: updatedUser },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - updateUser error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_UPDATE_ERROR,
      entity: "User",
      description: "Erreur lors de la mise à jour de l'utilisateur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Désactive un utilisateur (soft delete)
 * @route DELETE /api/auth/users/:id
 * @access Admin
 */
export const deactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'utilisateur est déjà désactivé
    if (user.status === "Inactif") {
      const response: AuthControllerResponse = {
        success: false,
        message: "L'utilisateur est déjà désactivé",
        code: "USER_ALREADY_DEACTIVATED",
      };
      res.status(400).json(response);
      return;
    }

    // Empêcher l'auto-désactivation
    if (id === auditData.userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Vous ne pouvez pas désactiver votre propre compte",
        code: "SELF_DEACTIVATION_NOT_ALLOWED",
      };
      res.status(400).json(response);
      return;
    }

    // Désactiver l'utilisateur
    const deactivatedUser = await prisma.user.update({
      where: { id },
      data: {
        status: "Inactif",
        // deactivatedAt: new Date(),
        // deactivatedBy: auditData.userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        // deactivatedAt: true,
      },
    });

    // Envoyer un email de notification
    try {
      const emailTemplate = `
        <h2>Compte désactivé</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre compte a été désactivé par un administrateur.</p>
        <p>Date de désactivation : ${new Date().toLocaleDateString("fr-FR")}</p>
        <p>Pour toute question, veuillez contacter le support.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Votre compte a été désactivé",
        html: emailTemplate,
      });
    } catch (emailError) {
      console.error(
        "❌ Erreur lors de l'envoi de l'email de désactivation:",
        emailError
      );
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DEACTIVATION_SUCCESS,
      entity: "User",
      entityId: id,
      userId: id,
      description: "Utilisateur désactivé avec succès",
      status: "SUCCESS",
      metadata: {
        deactivatedAt: new Date(),
        deactivatedBy: auditData.userId,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur désactivé avec succès",
      data: { user: deactivatedUser },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - deactivateUser error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DEACTIVATION_ERROR,
      entity: "User",
      description: "Erreur lors de la désactivation de l'utilisateur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Change le statut d'un utilisateur
 * @route PUT /api/auth/users/:id/status
 * @access Admin
 */
export const updateUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Valider le statut
    const validStatuses = ["Actif", "Inactif", "Suspendu", "En attente"];
    if (!validStatuses.includes(status)) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Statut invalide",
        code: "INVALID_STATUS",
        data: { validStatuses },
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Sauvegarder l'ancien statut
    const oldStatus = user.status;

    // Préparer les données de mise à jour
    const updateData: any = {
      status,
    };

    // Gérer les dates selon le statut
    if (status === "Suspendu") {
      updateData.suspendedAt = new Date();
      updateData.suspendedBy = auditData.userId;
      updateData.suspensionReason = reason;
    } else if (status === "Inactif") {
      updateData.deactivatedAt = new Date();
      updateData.deactivatedBy = auditData.userId;
      updateData.deactivationReason = reason;
    } else {
      // Si on réactive l'utilisateur
      updateData.suspendedAt = null;
      updateData.suspendedBy = null;
      updateData.suspensionReason = null;
      updateData.deactivatedAt = null;
      updateData.deactivatedBy = null;
      updateData.deactivationReason = null;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        // suspendedAt: true,
        // deactivatedAt: true,
      },
    });

    // Envoyer un email de notification si le statut a changé
    if (oldStatus !== status) {
      try {
        const emailSubject = `Modification du statut de votre compte`;
        const emailTemplate = `
          <h2>Statut du compte modifié</h2>
          <p>Bonjour ${user.firstName} ${user.lastName},</p>
          <p>Le statut de votre compte a été modifié :</p>
          <ul>
            <li>Ancien statut : ${oldStatus}</li>
            <li>Nouveau statut : ${status}</li>
            ${reason ? `<li>Raison : ${reason}</li>` : ""}
          </ul>
          <p>Date du changement : ${new Date().toLocaleDateString("fr-FR")}</p>
          ${
            status === "Suspendu" || status === "Inactif"
              ? `<p>Pour toute question, veuillez contacter le support.</p>`
              : ""
          }
        `;

        await sendEmail({
          to: user.email,
          subject: emailSubject,
          html: emailTemplate,
        });
      } catch (emailError) {
        console.error(
          "❌ Erreur lors de l'envoi de l'email de notification:",
          emailError
        );
      }
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_STATUS_UPDATE_SUCCESS,
      entity: "User",
      entityId: id,
      userId: id,
      description: `Statut de l'utilisateur modifié de ${oldStatus} à ${status}`,
      status: "SUCCESS",
      metadata: {
        oldStatus,
        newStatus: status,
        reason,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: `Statut de l'utilisateur mis à jour avec succès`,
      data: {
        user: updatedUser,
        change: {
          oldStatus,
          newStatus: status,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - updateUserStatus error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_STATUS_UPDATE_ERROR,
      entity: "User",
      description: "Erreur lors de la mise à jour du statut",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Change le rôle d'un utilisateur
 * @route PUT /api/auth/users/:id/role
 * @access Admin
 */
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { role } = req.body;

    // Valider le rôle
    const validRoles = ["Parent", "Staff", "Admin"];
    if (!validRoles.includes(role)) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Rôle invalide",
        code: "INVALID_ROLE",
        data: { validRoles },
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Empêcher l'auto-modification du rôle
    if (id === auditData.userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Vous ne pouvez pas modifier votre propre rôle",
        code: "SELF_ROLE_MODIFICATION_NOT_ALLOWED",
      };
      res.status(400).json(response);
      return;
    }

    // Sauvegarder l'ancien rôle
    const oldRole = user.role;

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Envoyer un email de notification
    try {
      const emailTemplate = `
        <h2>Modification de votre rôle</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre rôle dans l'application a été modifié :</p>
        <ul>
          <li>Ancien rôle : ${oldRole}</li>
          <li>Nouveau rôle : ${role}</li>
        </ul>
        <p>Date du changement : ${new Date().toLocaleDateString("fr-FR")}</p>
        <p>Pour toute question, veuillez contacter le support.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Modification de votre rôle",
        html: emailTemplate,
      });
    } catch (emailError) {
      console.error(
        "❌ Erreur lors de l'envoi de l'email de notification:",
        emailError
      );
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_ROLE_UPDATE_SUCCESS,
      entity: "User",
      entityId: id,
      userId: id,
      description: `Rôle de l'utilisateur modifié de ${oldRole} à ${role}`,
      status: "SUCCESS",
      metadata: {
        oldRole,
        newRole: role,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: `Rôle de l'utilisateur mis à jour avec succès`,
      data: {
        user: updatedUser,
        change: {
          oldRole,
          newRole: role,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - updateUserRole error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_ROLE_UPDATE_ERROR,
      entity: "User",
      description: "Erreur lors de la mise à jour du rôle",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Réactive un utilisateur
 * @route PUT /api/auth/users/:id/activate
 * @access Admin
 */
export const activateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'utilisateur est déjà actif
    if (user.status === "Actif") {
      const response: AuthControllerResponse = {
        success: false,
        message: "L'utilisateur est déjà actif",
        code: "USER_ALREADY_ACTIVE",
      };
      res.status(400).json(response);
      return;
    }

    // Réactiver l'utilisateur
    const activatedUser = await prisma.user.update({
      where: { id },
      data: {
        status: "Actif",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Envoyer un email de notification
    try {
      const emailTemplate = `
        <h2>Compte réactivé</h2>
        <p>Bonjour ${user.firstName} ${user.lastName},</p>
        <p>Votre compte a été réactivé par un administrateur.</p>
        <p>Vous pouvez maintenant vous connecter normalement.</p>
        <p>Date de réactivation : ${new Date().toLocaleDateString("fr-FR")}</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Votre compte a été réactivé",
        html: emailTemplate,
      });
    } catch (emailError) {
      console.error(
        "❌ Erreur lors de l'envoi de l'email de réactivation:",
        emailError
      );
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_ACTIVATION_SUCCESS,
      entity: "User",
      entityId: id,
      userId: id,
      description: "Utilisateur réactivé avec succès",
      status: "SUCCESS",
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur réactivé avec succès",
      data: { user: activatedUser },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - activateUser error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_ACTIVATION_ERROR,
      entity: "User",
      description: "Erreur lors de la réactivation de l'utilisateur",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Réinitialise le mot de passe d'un utilisateur (admin seulement)
 * @route POST /api/auth/users/:id/reset-password
 * @access Admin
 */
export const adminResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Générer un token de réinitialisation
    const resetToken = generateResetToken();
    const resetTokenExpiry = generateResetTokenExpiry();

    // Sauvegarde du token
    await prisma.user.update({
      where: { id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Génération du lien et de l'email
    const resetLink = generateResetLink(resetToken);
    const emailTemplate = generateEmailTemplate(user.firstName, resetLink);

    // Envoi de l'email
    try {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe (administrateur)",
        html: emailTemplate,
      });

      // Log d'audit
      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.ADMIN_PASSWORD_RESET_REQUEST,
        entity: "User",
        entityId: id,
        userId: id,
        description: "Email de réinitialisation envoyé par admin",
        status: "SUCCESS",
        metadata: { emailSent: true, resetToken },
      });
    } catch (emailError) {
      console.error("❌ Erreur envoi email de réinitialisation:", emailError);

      await createAuditLog({
        ...auditData,
        action: AuthActionTypes.ADMIN_PASSWORD_RESET_ERROR,
        entity: "User",
        entityId: id,
        userId: id,
        description: "Erreur lors de l'envoi de l'email de réinitialisation",
        status: "ERROR",
        errorMessage:
          typeof emailError === "object" &&
          emailError !== null &&
          "message" in emailError
            ? (emailError as any).message
            : String(emailError),
      });
    }

    const response: AuthControllerResponse = {
      success: true,
      message: "Email de réinitialisation envoyé avec succès",
      data: {
        email: user.email,
        token: process.env.NODE_ENV === "development" ? resetToken : undefined,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - adminResetPassword error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.ADMIN_PASSWORD_RESET_ERROR,
      entity: "User",
      description:
        "Erreur lors de la réinitialisation du mot de passe par admin",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée un nouvel utilisateur (admin seulement)
 * @route POST /api/auth/users
 * @access Admin
 */
export const createUserByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { email, password, firstName, lastName, phone, role, status } =
      req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
        code: "EMAIL_ALREADY_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Hasher le mot de passe si fourni, sinon générer un mot de passe temporaire
    const hashedPassword = password
      ? await hashPassword(password)
      : await hashPassword(generateTemporaryPassword());

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role,
        password: hashedPassword,
        status: status || "Actif",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_CREATED_BY_ADMIN,
      entity: "User",
      entityId: user.id,
      description: "Utilisateur créé par admin avec succès",
      status: "SUCCESS",
      metadata: {
        role: user.role,
        status: user.status,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur créé avec succès",
      data: { user },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ UserController - createUserByAdmin error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_CREATION_ERROR,
      entity: "User",
      description: "Erreur lors de la création de l'utilisateur par admin",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Recherche d'utilisateurs avec filtres avancés
 * @route POST /api/auth/users/search
 * @access Admin
 */
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      search,
      role,
      status,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.body;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Construire la requête de filtrage
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Exécuter les requêtes en parallèle
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: {
          [sortBy]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / limitNum);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USERS_SEARCH_REQUEST,
      entity: "User",
      description: "Recherche d'utilisateurs effectuée avec succès",
      status: "SUCCESS",
      metadata: {
        search,
        role,
        status,
        results: users.length,
        totalUsers,
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Recherche d'utilisateurs effectuée avec succès",
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalUsers,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - searchUsers error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USERS_SEARCH_ERROR,
      entity: "User",
      description: "Erreur lors de la recherche d'utilisateurs",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

// Fonction utilitaire pour générer un mot de passe temporaire
const generateTemporaryPassword = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * @desc Supprime définitivement un utilisateur (hard delete)
 * @route DELETE /api/auth/users/:id/hard-delete
 * @access Admin/SuperAdmin
 */
export const hardDeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        loginAttempts: true,
        // Ajouter d'autres relations selon votre schéma
        // parent: true,
        // staff: true,
        // etc.
      },
    });

    if (!user) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Utilisateur non trouvé",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Empêcher la suppression d'un admin par un non-super-admin
    if (user.role === "Admin" && req.user?.role !== "Admin") {
      const response: AuthControllerResponse = {
        success: false,
        message: "Vous n'avez pas la permission de supprimer un administrateur",
        code: "UNAUTHORIZED",
      };
      res.status(403).json(response);
      return;
    }

    // Empêcher l'auto-suppression
    if (id === auditData.userId) {
      const response: AuthControllerResponse = {
        success: false,
        message: "Vous ne pouvez pas supprimer votre propre compte",
        code: "SELF_DELETION_NOT_ALLOWED",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier les dépendances avant suppression
    const hasDependencies = await checkUserDependencies(id);
    if (hasDependencies) {
      const response: AuthControllerResponse = {
        success: false,
        message:
          "Cet utilisateur a des données associées. Veuillez d'abord supprimer ou transférer ces données.",
        code: "USER_HAS_DEPENDENCIES",
        data: { dependencies: hasDependencies },
      };
      res.status(400).json(response);
      return;
    }

    // Supprimer les tentatives de connexion d'abord (si existent)
    if (user.loginAttempts) {
      await prisma.loginAttempt.deleteMany({
        where: { userId: id },
      });
    }

    // Supprimer les autres relations selon votre schéma
    // Exemple:
    // if (user.parent) {
    //   await prisma.parent.delete({
    //     where: { userId: id },
    //   });
    // }

    // Supprimer définitivement l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_HARD_DELETION_SUCCESS,
      entity: "User",
      entityId: id,
      description: "Utilisateur supprimé définitivement",
      status: "SUCCESS",
      metadata: {
        email: user.email,
        role: user.role,
        deletedAt: new Date(),
      },
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Utilisateur supprimé définitivement avec succès",
      data: {
        deletedUser: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - hardDeleteUser error:", error);

    // Limiter la longueur du message d'erreur
    const shortErrorMessage = error.message
      ? error.message.substring(0, 500)
      : "Erreur inconnue";

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_HARD_DELETION_ERROR,
      entity: "User",
      description: "Erreur lors de la suppression définitive de l'utilisateur",
      status: "ERROR",
      errorMessage: shortErrorMessage,
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Vérifie les dépendances d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object | null>} Liste des dépendances
 */
const checkUserDependencies = async (
  userId: string
): Promise<object | null> => {
  const dependencies: any = {};

  // 1. Vérifier les logs d'audit
  const auditLogs = await prisma.auditLog.count({
    where: { userId },
  });
  if (auditLogs > 0) {
    dependencies.auditLogs = auditLogs;
  }

  // 2. Vérifier les tokens de réinitialisation (si table séparée)
  // const resetTokens = await prisma.passwordResetToken.count({
  //   where: { userId },
  // });
  // if (resetTokens > 0) {
  //   dependencies.resetTokens = resetTokens;
  // }

  // 3. Vérifier d'autres relations selon votre application
  // - Messages
  // - Commentaires
  // - Commandes
  // - etc.

  return Object.keys(dependencies).length > 0 ? dependencies : null;
};

/**
 * @desc Récupère les statistiques des dépendances d'un utilisateur
 * @route GET /api/auth/users/:id/dependencies
 * @access Admin
 */
export const getUserDependencies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const dependencies = await checkUserDependencies(id);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DEPENDENCIES_CHECK,
      entity: "User",
      entityId: id,
      description: "Vérification des dépendances de l'utilisateur",
      status: "SUCCESS",
    });

    const response: AuthControllerResponse = {
      success: true,
      message: "Dépendances récupérées avec succès",
      data: { dependencies },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ UserController - getUserDependencies error:", error);

    await createAuditLog({
      ...auditData,
      action: AuthActionTypes.USER_DEPENDENCIES_CHECK_ERROR,
      entity: "User",
      description: "Erreur lors de la vérification des dépendances",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: AuthControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
