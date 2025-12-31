/**
 * @file professeurController.ts
 * @description Contrôleurs pour la gestion des professeurs
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import * as professeurService from "../services/professeurService";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  warning?: string;
}

/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
 */
export const getProfesseurs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string,
      status: req.query.status as string,
      speciality: req.query.speciality as string,
      sortBy: (req.query.sortBy as string) || "lastName",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
    };

    const result = await professeurService.getProfesseursService(filters);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEURS_LIST_REQUEST",
      entity: "Professeur",
      description: "Liste des professeurs récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeurs récupérés avec succès",
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - getProfesseurs error:", error);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEURS_LIST_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération des professeurs",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère un professeur par ID
 */
export const getProfesseurById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const professeur = await professeurService.getProfesseurByIdService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails du professeur récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur récupéré avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - getProfesseurById error:", error);

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DETAILS_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour un professeur
 */
export const updateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const updateData = req.body;

    const professeur = await professeurService.updateProfesseurService(
      id,
      updateData
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_UPDATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" mis à jour`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur mis à jour avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - updateProfesseur error:", error);

    // Gérer les erreurs spécifiques
    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (error.message === "PROFESSEUR_EMAIL_EXISTS") {
      const response: ApiResponse = {
        success: false,
        message: "Un autre professeur utilise déjà cet email",
        code: "PROFESSEUR_EMAIL_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "USER_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "L'utilisateur associé n'existe pas",
        code: "USER_NOT_FOUND",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "USER_ALREADY_ASSOCIATED") {
      const response: ApiResponse = {
        success: false,
        message: "Cet utilisateur est déjà associé à un autre professeur",
        code: "USER_ALREADY_ASSOCIATED",
      };
      res.status(400).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_UPDATE_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la mise à jour du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Supprime un professeur
 */
export const deleteProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const result = await professeurService.deleteProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DELETED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur désactivé`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: result.message,
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - deleteProfesseur error:", error);

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (error.message === "PROFESSEUR_HAS_DEPENDENCIES") {
      const response: ApiResponse = {
        success: false,
        message:
          "Ce professeur ne peut pas être supprimé car il est assigné à des classes ou matières",
        code: "PROFESSEUR_HAS_DEPENDENCIES",
      };
      res.status(400).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DELETION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la suppression du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
export const getProfesseurSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { weekStart } = req.query;

    const result = await professeurService.getProfesseurScheduleService(
      id,
      weekStart as string
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_SCHEDULE_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Emploi du temps du professeur récupéré",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Emploi du temps récupéré avec succès",
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - getProfesseurSchedule error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_SCHEDULE_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération de l'emploi du temps",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Active un professeur
 */
export const activateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const professeur = await professeurService.activateProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_ACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" activé`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur activé avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - activateProfesseur error:", error);

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_ACTIVATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de l'activation du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Désactive un professeur
 */
export const deactivateProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const professeur = await professeurService.deactivateProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DEACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${professeur.firstName} ${professeur.lastName}" désactivé`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Professeur désactivé avec succès",
      data: { professeur },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" ProfesseurController - deactivateProfesseur error:", error);

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DEACTIVATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la désactivation du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les détails complets d'un professeur
 */
export const getProfesseurFullDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const result = await professeurService.getProfesseurFullDetailsService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_FULL_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails complets du professeur récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Détails complets récupérés avec succès",
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - getProfesseurFullDetails error:",
      error
    );

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_FULL_DETAILS_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la récupération des détails",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée un nouveau professeur avec option de création de compte utilisateur et envoi d'identifiants
 */
export const createProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const requestId = `req-${Date.now()}`;

  try {
    const data = req.body;

    console.log(`[${requestId}] 📥 Requête création professeur:`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      createUserAccount: data.createUserAccount,
      sendInvitation: data.sendInvitation,
    });

    // Appeler le service - IMPORTANT: Le service retourne directement l'objet
    const result = await professeurService.createProfesseurService({
      ...data,
      createUserAccount: data.createUserAccount !== false, // true par défaut
      sendInvitation: data.sendInvitation !== false, // true par défaut
    });

    console.log(`[${requestId}] ✅ Service retourné:`, {
      professeurId: result.professeur?.id,
      userAccountCreated: result.userAccountCreated,
      emailSent: result.emailSent,
    });

    // Extraire les données du résultat
    const professeur = result.professeur;
    const userAccountCreated = result.userAccountCreated || false;
    const emailSent = result.emailSent || false;
    const temporaryPassword = result.temporaryPassword;

    // Construire le message en fonction du résultat
    let message = "Professeur créé avec succès";

    if (userAccountCreated) {
      if (emailSent) {
        message =
          "Professeur créé avec succès. Les identifiants ont été envoyés par email.";
      } else {
        message =
          "Professeur créé avec succès. IMPORTANT : Les identifiants n'ont pas pu être envoyés par email.";
      }
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_CREATED",
      entity: "Professeur",
      entityId: professeur?.id,
      description: `Professeur "${professeur?.firstName} ${professeur?.lastName}" créé`,
      status: "SUCCESS",
      metadata: {
        email: professeur?.email,
        speciality: professeur?.speciality,
        userAccountCreated,
        emailSent,
        hasUserAccount: !!professeur?.userId,
      },
    });

    // Construire la réponse
    const responseData: any = {
      professeur,
      userAccountCreated,
      emailSent,
    };

    // Ajouter le mot de passe temporaire seulement si nécessaire
    if (temporaryPassword && !emailSent) {
      responseData.temporaryPassword = temporaryPassword;
      responseData.warning =
        "Veuillez communiquer manuellement ce mot de passe au professeur";
    }

    const response: ApiResponse = {
      success: true,
      message,
      data: responseData,
    };

    console.log(`[${requestId}] 📤 Réponse envoyée:`, {
      status: 201,
      professeurId: professeur?.id,
    });

    res.status(201).json(response);
  } catch (error: any) {
    console.error(`[${requestId}] ❌ Erreur contrôleur:`, error);

    // Gérer les erreurs spécifiques
    if (error.message === "PROFESSEUR_EMAIL_EXISTS") {
      const response: ApiResponse = {
        success: false,
        message: "Un professeur avec cet email existe déjà",
        code: "PROFESSEUR_EMAIL_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "USER_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "L'utilisateur associé n'existe pas",
        code: "USER_NOT_FOUND",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "USER_ALREADY_PROFESSEUR") {
      const response: ApiResponse = {
        success: false,
        message: "Cet utilisateur est déjà associé à un professeur",
        code: "USER_ALREADY_PROFESSEUR",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "EMAIL_SEND_FAILED") {
      // Échec d'envoi d'email mais création réussie
      const response: ApiResponse = {
        success: true, // Succès partiel
        message: "Professeur créé mais l'envoi d'email a échoué",
        code: "EMAIL_SEND_FAILED",
        warning:
          "Veuillez communiquer manuellement les identifiants au professeur",
      };
      res.status(201).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_CREATION_ERROR",
      entity: "Professeur",
      description: "Erreur lors de la création du professeur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Associe un compte utilisateur à un professeur existant avec envoi d'identifiants
 */
export const attachUserToProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const options = req.body;

    const result = await professeurService.attachUserToProfesseurService(id, {
      ...options,
      sendCredentialsEmail: options.sendCredentialsEmail !== false,
    });

    // Construire le message en fonction du résultat
    let message = "Compte utilisateur associé avec succès";
    if (result.userAccountCreated) {
      if (result.emailSent) {
        message = "Compte utilisateur créé et identifiants envoyés par email";
      } else {
        message = "Compte utilisateur créé mais l'envoi d'email a échoué";
      }
    }

    await createAuditLog({
      ...auditData,
      action: result.userAccountCreated
        ? "PROFESSEUR_USER_ACCOUNT_CREATED"
        : "PROFESSEUR_USER_ATTACHED",
      entity: "Professeur",
      entityId: id,
      description: result.userAccountCreated
        ? `Compte utilisateur créé et associé au professeur ${result.professeur.firstName} ${result.professeur.lastName}`
        : `Compte utilisateur associé au professeur ${result.professeur.firstName} ${result.professeur.lastName}`,
      status: "SUCCESS",
      metadata: {
        userId: result.professeur.userId,
        userEmail: result.professeur.user?.email,
        userCreated: result.userAccountCreated,
        emailSent: result.emailSent,
      },
    });

    const response: ApiResponse = {
      success: true,
      message,
      data: {
        professeur: result.professeur,
        userAccountCreated: result.userAccountCreated,
        emailSent: result.emailSent,
        // Ne pas envoyer le mot de passe dans la réponse sauf en cas d'erreur d'email
        ...(result.temporaryPassword &&
          !result.emailSent && {
            temporaryPassword: result.temporaryPassword,
            warning:
              "Veuillez communiquer manuellement ce mot de passe au professeur",
          }),
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - attachUserToProfesseur error:",
      error
    );

    // Gérer les erreurs spécifiques
    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (error.message === "USER_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Aucun utilisateur trouvé avec cet email",
        code: "USER_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (error.message === "USER_ALREADY_ASSOCIATED") {
      const response: ApiResponse = {
        success: false,
        message: "Cet utilisateur est déjà associé à un autre professeur",
        code: "USER_ALREADY_ASSOCIATED",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "NO_USER_SPECIFIED") {
      const response: ApiResponse = {
        success: false,
        message: "Aucun utilisateur spécifié",
        code: "NO_USER_SPECIFIED",
      };
      res.status(400).json(response);
      return;
    }

    if (error.message === "EMAIL_SEND_FAILED") {
      // Compte créé mais email échoué
      const response: ApiResponse = {
        success: true, // Succès partiel
        message: "Compte utilisateur créé mais l'envoi d'email a échoué",
        code: "EMAIL_SEND_FAILED",
        data: {
          warning:
            "Veuillez communiquer manuellement les identifiants au professeur",
          manualCredentials: true,
        },
      };
      res.json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_ATTACHMENT_ERROR",
      entity: "Professeur",
      description: "Erreur lors de l'association du compte utilisateur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Détache un compte utilisateur d'un professeur
 */
export const detachUserFromProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const result = await professeurService.detachUserFromProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_DETACHED",
      entity: "Professeur",
      entityId: id,
      description: `Compte utilisateur détaché du professeur ${result.professeur.firstName} ${result.professeur.lastName}`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Compte utilisateur détaché avec succès",
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      " ProfesseurController - detachUserFromProfesseur error:",
      error
    );

    if (error.message === "PROFESSEUR_NOT_FOUND") {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (error.message === "NO_USER_ACCOUNT") {
      const response: ApiResponse = {
        success: false,
        message: "Ce professeur n'a pas de compte utilisateur associé",
        code: "NO_USER_ACCOUNT",
      };
      res.status(400).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_DETACHMENT_ERROR",
      entity: "Professeur",
      description: "Erreur lors du détachement du compte utilisateur",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 200),
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
