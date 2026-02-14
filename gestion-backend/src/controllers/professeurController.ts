/**
 * @file professeurController.ts
 * @description Contrôleurs pour la gestion des professeurs
 * @version 1.1.0 - Compatible avec le service mis à jour
 */

import { Request, Response } from "express";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import * as professeurService from "../services/professeurService";
import { ProfesseurError } from "../services/professeurService";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  warning?: string;
  details?: any;
  errors?: any[];
}

/**
 * Gestionnaire d'erreurs centralisé
 */
const handleError = async (
  error: any,
  req: Request,
  res: Response,
  auditData: any,
  action: string,
  entity: string = "Professeur",
  entityId?: string
): Promise<void> => {
  // Log d'audit
  await createAuditLog({
    ...auditData,
    action: `${action}_ERROR`,
    entity,
    entityId,
    description: `Erreur lors de l'opération: ${action}`,
    status: "ERROR",
    errorMessage: error.message?.substring(0, 200),
    errorDetails: error.details,
  });

  // Si c'est une ProfesseurError, utiliser ses propriétés
  if (error instanceof ProfesseurError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
    res.status(error.statusCode || 400).json(response);
    return;
  }

  // Gestion des erreurs spécifiques du service
  if (error.code) {
    const errorCodes: Record<string, { message: string; status: number }> = {
      PROFESSEUR_NOT_FOUND: {
        message: "Professeur non trouvé",
        status: 404,
      },
      PROFESSEUR_EMAIL_EXISTS: {
        message: "Un professeur avec cet email existe déjà",
        status: 400,
      },
      PROFESSEUR_MATRICULE_EXISTS: {
        message: "Un professeur avec ce matricule existe déjà",
        status: 400,
      },
      USER_NOT_FOUND: {
        message: "Utilisateur non trouvé",
        status: 404,
      },
      USER_ALREADY_ASSOCIATED: {
        message: "Cet utilisateur est déjà associé à un autre professeur",
        status: 400,
      },
      USER_ALREADY_PROFESSEUR: {
        message: "Cet utilisateur est déjà associé à un professeur",
        status: 400,
      },
      NO_USER_ACCOUNT: {
        message: "Ce professeur n'a pas de compte utilisateur associé",
        status: 400,
      },
      PROFESSEUR_HAS_DEPENDENCIES: {
        message: "Le professeur a des dépendances actives",
        status: 400,
      },
      INVALID_EMAIL_FORMAT: {
        message: "Format d'email invalide",
        status: 422,
      },
      INVALID_PHONE_FORMAT: {
        message:
          "Format de téléphone invalide. Formats acceptés: +509XXXXXXXX, 509XXXXXXXX, 0XXXXXXXX, XXXXXXXXX (8-9 chiffres)",
        status: 422,
      },
      MISSING_REQUIRED_FIELDS: {
        message: "Champs requis manquants",
        status: 422,
      },
    };

    const errorInfo = errorCodes[error.code];
    if (errorInfo) {
      const response: ApiResponse = {
        success: false,
        message: errorInfo.message,
        code: error.code,
        details: error.details,
      };
      res.status(errorInfo.status).json(response);
      return;
    }
  }

  // Erreur générique
  const response: ApiResponse = {
    success: false,
    message: "Erreur interne du serveur",
    code: "INTERNAL_ERROR",
  };
  res.status(500).json(response);
};

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
      metadata: {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
      },
    });

    // Retourner directement le résultat du service qui a déjà la structure correcte
    res.json(result);
  } catch (error: any) {
    await handleError(error, req, res, auditData, "PROFESSEURS_LIST");
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.getProfesseurByIdService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails du professeur récupérés",
      status: "SUCCESS",
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_DETAILS",
      "Professeur",
      req.params.id
    );
  }
};

/**
 * @desc Crée un nouveau professeur avec option de création de compte utilisateur
 */
export const createProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);
  const requestId = `req-${Date.now()}`;

  try {
    const data = req.body;

    // Appeler le service
    const result = await professeurService.createProfesseurService({
      ...data,
      createUserAccount: data.createUserAccount !== false,
      sendInvitation: data.sendInvitation !== false,
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_CREATED",
      entity: "Professeur",
      entityId: result.data?.professeur?.id,
      description: `Professeur "${result.data?.professeur?.firstName} ${result.data?.professeur?.lastName}" créé`,
      status: "SUCCESS",
      metadata: {
        email: result.data?.professeur?.email,
        speciality: result.data?.professeur?.speciality,
        userAccountCreated: result.data?.userAccountCreated,
        emailSent: result.data?.emailSent,
        hasUserAccount: !!result.data?.professeur?.userId,
      },
    });

    // Retourner directement le résultat du service avec le bon status
    res.status(201).json(result);
  } catch (error: any) {
    await handleError(error, req, res, auditData, "PROFESSEUR_CREATION");
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.updateProfesseurService(
      id,
      updateData
    );

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_UPDATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${result.data?.firstName} ${result.data?.lastName}" mis à jour`,
      status: "SUCCESS",
      metadata: {
        fieldsUpdated: Object.keys(updateData),
      },
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_UPDATE",
      "Professeur",
      req.params.id
    );
  }
};

/**
 * @desc Supprime/désactive un professeur
 */
export const deleteProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.deleteProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DELETED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur désactivé`,
      status: "SUCCESS",
      metadata: {
        assignmentsCount: result.data?.assignmentsCount,
        schedulesCount: result.data?.schedulesCount,
      },
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_DELETION",
      "Professeur",
      req.params.id
    );
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.activateProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_ACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${result.data.firstName} ${result.data.lastName}" activé`,
      status: "SUCCESS",
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_ACTIVATION",
      "Professeur",
      req.params.id
    );
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.deactivateProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_DEACTIVATED",
      entity: "Professeur",
      entityId: id,
      description: `Professeur "${result.firstName} ${result.lastName}" désactivé`,
      status: "SUCCESS",
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_DEACTIVATION",
      "Professeur",
      req.params.id
    );
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

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
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_SCHEDULE",
      "Professeur",
      req.params.id
    );
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.getProfesseurFullDetailsService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_FULL_DETAILS_REQUEST",
      entity: "Professeur",
      entityId: id,
      description: "Détails complets du professeur récupérés",
      status: "SUCCESS",
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_FULL_DETAILS",
      "Professeur",
      req.params.id
    );
  }
};

/**
 * @desc Associe un compte utilisateur à un professeur existant
 */
export const attachUserToProfesseur = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const options = req.body;

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "professeurId" }
      );
    }

    const result = await professeurService.attachUserToProfesseurService(id, {
      ...options,
      sendCredentialsEmail: options.sendCredentialsEmail !== false,
    });

    await createAuditLog({
      ...auditData,
      action: result.data?.userAccountCreated
        ? "PROFESSEUR_USER_ACCOUNT_CREATED"
        : "PROFESSEUR_USER_ATTACHED",
      entity: "Professeur",
      entityId: id,
      description: result.data?.userAccountCreated
        ? `Compte utilisateur créé et associé au professeur ${result.data?.professeur?.firstName} ${result.data?.professeur?.lastName}`
        : `Compte utilisateur associé au professeur ${result.data?.professeur?.firstName} ${result.data?.professeur?.lastName}`,
      status: "SUCCESS",
      metadata: {
        userId: result.data?.professeur?.userId,
        userEmail: result.data?.professeur?.user?.email,
        userCreated: result.data?.userAccountCreated,
        emailSent: result.data?.emailSent,
      },
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_USER_ATTACHMENT",
      "Professeur",
      req.params.id
    );
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

    if (!id) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const result = await professeurService.detachUserFromProfesseurService(id);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_USER_DETACHED",
      entity: "Professeur",
      entityId: id,
      description: `Compte utilisateur détaché du professeur ${result.data?.professeur?.firstName} ${result.data?.professeur?.lastName}`,
      status: "SUCCESS",
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(
      error,
      req,
      res,
      auditData,
      "PROFESSEUR_USER_DETACHMENT",
      "Professeur",
      req.params.id
    );
  }
};

/**
 * @desc Importe des professeurs en masse
 */
export const importProfesseurs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const professeurs = req.body;

    if (!professeurs || !Array.isArray(professeurs)) {
      throw new ProfesseurError(
        "MISSING_REQUIRED_FIELDS",
        "Données d'import requises",
        { field: "professeurs" }
      );
    }

    const result =
      await professeurService.importProfesseursService(professeurs);

    await createAuditLog({
      ...auditData,
      action: "PROFESSEURS_IMPORT",
      entity: "Professeur",
      description: `Import de ${result.data?.success} professeurs`,
      status: "SUCCESS",
      metadata: {
        total: professeurs.length,
        success: result.data?.success,
        failed: result.data?.failed,
      },
    });

    // Retourner directement le résultat du service
    res.json(result);
  } catch (error: any) {
    await handleError(error, req, res, auditData, "PROFESSEURS_IMPORT");
  }
};

/**
 * @desc Récupère les statistiques des professeurs
 */
export const getProfesseurStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    // Compter les professeurs par statut
    const [actifs, inactifs, total] = await Promise.all([
      professeurService.getProfesseursService({ status: "Actif", limit: 1 }),
      professeurService.getProfesseursService({ status: "Inactif", limit: 1 }),
      professeurService.getProfesseursService({ limit: 1 }),
    ]);

    // Compter par spécialité
    const specialities = await professeurService.getProfesseursService({
      limit: 1000,
    });

    const specialityCounts: Record<string, number> = {};
    specialities.data?.forEach((prof: any) => {
      if (prof.speciality) {
        specialityCounts[prof.speciality] =
          (specialityCounts[prof.speciality] || 0) + 1;
      }
    });

    // Statistiques
    const stats = {
      total: total.pagination?.total || 0,
      actifs: actifs.pagination?.total || 0,
      inactifs: inactifs.pagination?.total || 0,
      withUserAccount:
        specialities.data?.filter((p: any) => p.userId).length || 0,
      specialityCounts,
      recentAdditions: specialities.data?.slice(0, 5) || [],
    };

    await createAuditLog({
      ...auditData,
      action: "PROFESSEUR_STATISTICS_REQUEST",
      entity: "Professeur",
      description: "Statistiques des professeurs récupérées",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Statistiques récupérées avec succès",
      data: stats,
    };

    res.json(response);
  } catch (error: any) {
    await handleError(error, req, res, auditData, "PROFESSEUR_STATISTICS");
  }
};
