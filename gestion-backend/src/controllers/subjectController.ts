/**
 * @file subjectController.ts
 * @description Contrôleurs pour la gestion des matières
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

const prisma = new PrismaClient();

// Interface pour les réponses
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des matières
 */
export const getSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { code: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    // Récupération avec pagination
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              assignments: true,
              grades: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.subject.count({ where }),
    ]);

    await createAuditLog({
      ...auditData,
      action: "SUBJECTS_LIST_REQUEST",
      entity: "Subject",
      description: "Liste des matières récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Matières récupérées avec succès",
      data: {
        subjects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SubjectController - getSubjects error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECTS_LIST_ERROR",
      entity: "Subject",
      description: "Erreur lors de la récupération des matières",
      status: "ERROR",
      errorMessage: error.message,
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
 * @desc Récupère une matière par ID
 */
export const getSubjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignments: {
          include: {
            professeur: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            academicYear: true,
          },
        },
      },
    });

    if (!subject) {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DETAILS_REQUEST",
      entity: "Subject",
      entityId: id,
      description: "Détails de la matière récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Matière récupérée avec succès",
      data: { subject },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SubjectController - getSubjectById error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DETAILS_ERROR",
      entity: "Subject",
      description: "Erreur lors de la récupération de la matière",
      status: "ERROR",
      errorMessage: error.message,
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
 * @desc Crée une nouvelle matière
 */
export const createSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { code, name, coefficient, type, passingGrade, description } =
      req.body;

    console.log("body:", req.body);

    // Vérifier si le code existe déjà
    const existingSubject = await prisma.subject.findUnique({
      where: { code },
    });

    if (existingSubject) {
      const response: ApiResponse = {
        success: false,
        message: "Une matière avec ce code existe déjà",
        code: "SUBJECT_CODE_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Créer la matière
    const userId = auditData.userId || req.user?.id;
    if (!userId) {
      const response: ApiResponse = {
        success: false,
        message: "Utilisateur non identifié",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        coefficient: coefficient || 1, // ← NOUVEAU
        type,
        passingGrade: passingGrade || 60,
        description,
        // Retirez objectives
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_CREATED",
      entity: "Subject",
      entityId: subject.id,
      description: `Matière "${name}" créée`,
      status: "SUCCESS",
      metadata: {
        code,
        type,
        coefficient, // ← AJOUTEZ
        passingGrade,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Matière créée avec succès",
      data: { subject },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ SubjectController - createSubject error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_CREATION_ERROR",
      entity: "Subject",
      description: "Erreur lors de la création de la matière",
      status: "ERROR",
      errorMessage: error.message,
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
 * @desc Met à jour une matière
 */
export const updateSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      code,
      name,
      credits,
      type,
      passingGrade,
      description,
      coefficient,
    } = req.body;

    console.log("📝 Update Subject - Body:", req.body);
    console.log("🔍 ID à mettre à jour:", id);

    // 1. Vérifier si la matière existe
    const existingSubject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // 2. Vérifier si le type est valide (si fourni)
    if (type && !["Obligatoire", "Optionnelle"].includes(type)) {
      const response: ApiResponse = {
        success: false,
        message: "Type invalide. Valeurs acceptées: Obligatoire, Optionnelle",
        code: "INVALID_SUBJECT_TYPE",
      };
      res.status(400).json(response);
      return;
    }

    // 3. Vérifier si le nouveau code existe déjà (seulement si le code change)
    if (code && code !== existingSubject.code) {
      const subjectWithCode = await prisma.subject.findUnique({
        where: { code },
      });

      if (subjectWithCode) {
        const response: ApiResponse = {
          success: false,
          message: "Une autre matière utilise déjà ce code",
          code: "SUBJECT_CODE_EXISTS",
        };
        res.status(400).json(response);
        return;
      }
    }

    // 4. Préparer les données de mise à jour
    const updateData: any = {};

    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (credits !== undefined) updateData.credits = credits;
    if (type !== undefined) updateData.type = type;
    if (passingGrade !== undefined) updateData.passingGrade = passingGrade;
    if (description !== undefined) updateData.description = description;
    if (coefficient !== undefined) updateData.coefficient = coefficient;

    console.log("🔄 Données de mise à jour:", updateData);

    // 5. Mettre à jour la matière
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_UPDATED",
      entity: "Subject",
      entityId: id,
      description: `Matière "${name || existingSubject.name}" mise à jour`,
      status: "SUCCESS",
      metadata: {
        oldCode: existingSubject.code,
        newCode: code || existingSubject.code,
        changes: Object.keys(updateData),
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Matière mise à jour avec succès",
      data: { subject: updatedSubject },
    };

    console.log("✅ Matière mise à jour:", updatedSubject.id);
    res.json(response);
  } catch (error: any) {
    console.error("❌ SubjectController - updateSubject error:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2002") {
      const response: ApiResponse = {
        success: false,
        message: "Une autre matière utilise déjà ce code",
        code: "SUBJECT_CODE_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    if (error.code === "P2025") {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_UPDATE_ERROR",
      entity: "Subject",
      description: "Erreur lors de la mise à jour de la matière",
      status: "ERROR",
      errorMessage: error.message,
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
 * @desc Supprime une matière
 */
export const deleteSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si la matière existe
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignments: true,
            grades: true,
          },
        },
      },
    });

    if (!subject) {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier les dépendances
    if (subject._count.assignments > 0 || subject._count.grades > 0) {
      const response: ApiResponse = {
        success: false,
        message:
          "Cette matière ne peut pas être supprimée car elle est utilisée",
        code: "SUBJECT_HAS_DEPENDENCIES",
        data: {
          assignments: subject._count.assignments,
          grades: subject._count.grades,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Supprimer la matière
    await prisma.subject.delete({
      where: { id },
    });

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DELETED",
      entity: "Subject",
      entityId: id,
      description: `Matière "${subject.name}" supprimée`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Matière supprimée avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ SubjectController - deleteSubject error:", error);

    await createAuditLog({
      ...auditData,
      action: "SUBJECT_DELETION_ERROR",
      entity: "Subject",
      description: "Erreur lors de la suppression de la matière",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
