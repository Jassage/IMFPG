/**
 * @file classController.ts
 * @description Contrôleurs pour la gestion des classes
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

const prisma = new PrismaClient();

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * @desc Récupère la liste des classes
 */
export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      search,
      level,
      academicYearId,
      status = "Active",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Filtres
    const where: any = { status };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (level) {
      where.level = level;
    }

    if (academicYearId) {
      where.academicYearId = academicYearId;
    }

    // Récupération avec pagination
    const [classes, total] = await Promise.all([
      prisma.schoolClass.findMany({
        where,
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.schoolClass.count({ where }),
    ]);

    // Récupérer les années académiques pour le filtre
    const academicYears = await prisma.academicYear.findMany({
      orderBy: { year: "desc" },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASSES_LIST_REQUEST",
      entity: "SchoolClass",
      description: "Liste des classes récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Classes récupérées avec succès",
      data: {
        classes,
        academicYears,
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
    console.error("❌ ClassController - getClasses error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASSES_LIST_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération des classes",
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
 * @desc Récupère une classe par ID
 */
export const getClassById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id },
    });

    if (!schoolClass) {
      const response: ApiResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Récupérer les professeurs disponibles
    const availableTeachers = await prisma.professeur.findMany({
      where: {
        status: "Actif",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        speciality: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_DETAILS_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Détails de la classe récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Classe récupérée avec succès",
      data: {
        class: schoolClass,
        availableTeachers,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ClassController - getClassById error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASS_DETAILS_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération de la classe",
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
 * @desc Crée une nouvelle classe
 */
export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { name, level, capacity } = req.body;

    // Vérifier l'unicité du nom dans l'année académique
    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        name,
      },
    });

    if (existingClass) {
      const response: ApiResponse = {
        success: false,
        message: "Une classe avec ce nom existe déjà ",
        code: "CLASS_NAME_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Créer la classe
    const schoolClass = await prisma.schoolClass.create({
      data: {
        name,
        level,
        capacity: capacity || 30,
        status: "Active",
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_CREATED",
      entity: "SchoolClass",
      entityId: schoolClass.id,
      description: `Classe "${name}" créée`,
      status: "SUCCESS",
      metadata: {
        level,
        capacity,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Classe créée avec succès",
      data: { class: schoolClass },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ ClassController - createClass error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASS_CREATION_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la création de la classe",
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
 * @desc Met à jour une classe
 */
export const updateClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { name, level, capacity, status } = req.body;

    // Vérifier si la classe existe
    const existingClass = await prisma.schoolClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      const response: ApiResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier l'unicité du nom si modifié
    if (name && name !== existingClass.name) {
      const classWithName = await prisma.schoolClass.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (classWithName) {
        const response: ApiResponse = {
          success: false,
          message:
            "Une autre classe utilise déjà ce nom pour cette année académique",
          code: "CLASS_NAME_EXISTS",
        };
        res.status(400).json(response);
        return;
      }
    }

    // Mettre à jour
    const schoolClass = await prisma.schoolClass.update({
      where: { id },
      data: {
        name,
        level,
        capacity,
        status,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_UPDATED",
      entity: "SchoolClass",
      entityId: id,
      description: `Classe "${name}" mise à jour`,
      status: "SUCCESS",
      metadata: {
        oldName: existingClass.name,
        newName: name,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Classe mise à jour avec succès",
      data: { class: schoolClass },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ClassController - updateClass error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASS_UPDATE_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la mise à jour de la classe",
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
 * @desc Supprime une classe
 */
export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si la classe existe
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            schedules: true,
            enrollments: true,
          },
        },
      },
    });

    if (!schoolClass) {
      const response: ApiResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier les dépendances
    if (schoolClass._count.students > 0) {
      const response: ApiResponse = {
        success: false,
        message:
          "Cette classe ne peut pas être supprimée car elle contient des élèves",
        code: "CLASS_HAS_STUDENTS",
        data: {
          students: schoolClass._count.students,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Désactiver plutôt que supprimer
    await prisma.schoolClass.update({
      where: { id },
      data: { status: "Inactive" },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_DELETED",
      entity: "SchoolClass",
      entityId: id,
      description: `Classe "${schoolClass.name}" désactivée`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Classe désactivée avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ClassController - deleteClass error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASS_DELETION_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la suppression de la classe",
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
 * @desc Récupère les statistiques d'une classe
 */
export const getClassStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const stats = await prisma.schoolClass.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            students: true,
            schedules: true,
          },
        },
        students: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!stats) {
      const response: ApiResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Calculer les statistiques
    const statusCounts = stats.students.reduce(
      (acc, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_STATS_REQUEST",
      entity: "SchoolClass",
      entityId: id,
      description: "Statistiques de la classe récupérées",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Statistiques récupérées avec succès",
      data: {
        totalStudents: stats._count.students,
        totalSchedules: stats._count.schedules,
        statusDistribution: statusCounts,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ClassController - getClassStats error:", error);

    await createAuditLog({
      ...auditData,
      action: "CLASS_STATS_ERROR",
      entity: "SchoolClass",
      description: "Erreur lors de la récupération des statistiques",
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
