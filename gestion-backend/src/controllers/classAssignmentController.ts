/**
 * @file classAssignmentController.ts
 * @description Contrôleurs pour la gestion des assignations de cours aux classes
 * @version 1.0.0
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
 * @desc Récupère la liste des assignations
 */
export const getClassAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      search,
      classLevel,
      academicYearId,
      professeurId,
      subjectId,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construction des filtres
    const where: any = {};

    if (status) where.status = status;
    if (classLevel) where.classLevel = classLevel;
    if (academicYearId) where.academicYearId = academicYearId;
    if (professeurId) where.professeurId = professeurId;
    if (subjectId) where.subjectId = subjectId;

    if (search) {
      where.OR = [
        {
          subject: {
            OR: [
              { name: { contains: search as string, mode: "insensitive" } },
              { code: { contains: search as string, mode: "insensitive" } },
            ],
          },
        },
        {
          professeur: {
            OR: [
              {
                firstName: { contains: search as string, mode: "insensitive" },
              },
              { lastName: { contains: search as string, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Déterminer l'ordre de tri
    const orderBy: any = {};
    if (sortBy === "subject") {
      orderBy.subject = { name: sortOrder };
    } else if (sortBy === "professeur") {
      orderBy.professeur = { lastName: sortOrder };
    } else {
      orderBy[sortBy as string] = sortOrder;
    }

    // Récupération avec pagination
    const [assignments, total] = await Promise.all([
      prisma.classAssignment.findMany({
        where,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              coefficient: true,
            },
          },
          professeur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              matricule: true,
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
              isCurrent: true,
            },
          },
          _count: {
            select: {
              schedules: true,
              grades: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.classAssignment.count({ where }),
    ]);

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_REQUEST",
      entity: "ClassAssignment",
      description: "Liste des assignations récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignations récupérées avec succès",
      data: {
        assignments,
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
    console.error(
      "❌ ClassAssignmentController - getClassAssignments error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENTS_LIST_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la récupération des assignations",
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
 * @desc Récupère une assignation par ID
 */
export const getClassAssignmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const assignment = await prisma.classAssignment.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            coefficient: true,
            passingGrade: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            matricule: true,
            speciality: true,
            status: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
          },
        },
        schedules: {
          include: {
            schoolClass: true,
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        grades: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
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
        _count: {
          select: {
            schedules: true,
            grades: true,
          },
        },
      },
    });

    if (!assignment) {
      const response: ApiResponse = {
        success: false,
        message: "Assignation non trouvée",
        code: "ASSIGNMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DETAILS_REQUEST",
      entity: "ClassAssignment",
      entityId: id,
      description: "Détails de l'assignation récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignation récupérée avec succès",
      data: { assignment },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - getClassAssignmentById error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DETAILS_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la récupération de l'assignation",
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
 * @desc Crée une nouvelle assignation
 */
export const createClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      subjectId,
      professeurId,
      classLevel,
      academicYearId,
      status = "Active",
      notes,
    } = req.body;

    // Validation de l'unicité
    const existingAssignment = await prisma.classAssignment.findFirst({
      where: {
        subjectId,
        classLevel,
        academicYearId,
        professeurId,
      },
    });

    if (existingAssignment) {
      const response: ApiResponse = {
        success: false,
        message: "Cette assignation existe déjà",
        code: "ASSIGNMENT_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier les relations
    const [subject, professeur, academicYear] = await Promise.all([
      prisma.subject.findUnique({ where: { id: subjectId } }),
      prisma.professeur.findUnique({ where: { id: professeurId } }),
      prisma.academicYear.findUnique({ where: { id: academicYearId } }),
    ]);

    if (!subject) {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (!professeur) {
      const response: ApiResponse = {
        success: false,
        message: "Professeur non trouvé",
        code: "PROFESSEUR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (!academicYear) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique non trouvée",
        code: "ACADEMIC_YEAR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Créer l'assignation
    const assignment = await prisma.classAssignment.create({
      data: {
        subjectId,
        professeurId,
        classLevel,
        academicYearId,
        status,
        // notes: notes || null,
      },
      include: {
        subject: true,
        professeur: true,
        academicYear: true,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATED",
      entity: "ClassAssignment",
      entityId: assignment.id,
      description: `Assignation créée: ${subject.name} → ${classLevel} (Prof: ${professeur.firstName} ${professeur.lastName})`,
      status: "SUCCESS",
      metadata: {
        subjectId,
        professeurId,
        classLevel,
        academicYearId,
        status,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignation créée avec succès",
      data: { assignment },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - createClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_CREATION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la création de l'assignation",
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
 * @desc Met à jour une assignation
 */
export const updateClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      subjectId,
      professeurId,
      classLevel,
      academicYearId,
      status,
      notes,
    } = req.body;

    // Vérifier si l'assignation existe
    const existingAssignment = await prisma.classAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      const response: ApiResponse = {
        success: false,
        message: "Assignation non trouvée",
        code: "ASSIGNMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier l'unicité si les champs changent
    if (subjectId || professeurId || classLevel || academicYearId) {
      const duplicateAssignment = await prisma.classAssignment.findFirst({
        where: {
          id: { not: id },
          subjectId: subjectId || existingAssignment.subjectId,
          classLevel: classLevel || existingAssignment.classLevel,
          academicYearId: academicYearId || existingAssignment.academicYearId,
          professeurId: professeurId || existingAssignment.professeurId,
        },
      });

      if (duplicateAssignment) {
        const response: ApiResponse = {
          success: false,
          message: "Cette assignation existe déjà",
          code: "ASSIGNMENT_EXISTS",
        };
        res.status(400).json(response);
        return;
      }
    }

    // Mettre à jour l'assignation
    const assignment = await prisma.classAssignment.update({
      where: { id },
      data: {
        subjectId,
        professeurId,
        classLevel,
        academicYearId,
        status,
        // notes: notes !== undefined ? notes : existingAssignment.notes,
      },
      include: {
        subject: true,
        professeur: true,
        academicYear: true,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation mise à jour: ${assignment.subject.name}`,
      status: "SUCCESS",
      metadata: {
        changes: Object.keys(req.body),
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignation mise à jour avec succès",
      data: { assignment },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - updateClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_UPDATE_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la mise à jour de l'assignation",
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
 * @desc Supprime une assignation
 */
export const deleteClassAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'assignation existe
    const assignment = await prisma.classAssignment.findUnique({
      where: { id },
      include: {
        subject: true,
        professeur: true,
        _count: {
          select: {
            schedules: true,
            grades: true,
          },
        },
      },
    });

    if (!assignment) {
      const response: ApiResponse = {
        success: false,
        message: "Assignation non trouvée",
        code: "ASSIGNMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier les dépendances
    if (assignment._count.schedules > 0) {
      const response: ApiResponse = {
        success: false,
        message: "Impossible de supprimer: des cours sont planifiés",
        code: "HAS_SCHEDULES",
        data: {
          schedulesCount: assignment._count.schedules,
        },
      };
      res.status(400).json(response);
      return;
    }

    if (assignment._count.grades > 0) {
      const response: ApiResponse = {
        success: false,
        message: "Impossible de supprimer: des notes sont associées",
        code: "HAS_GRADES",
        data: {
          gradesCount: assignment._count.grades,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Supprimer l'assignation
    await prisma.classAssignment.delete({
      where: { id },
    });

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETED",
      entity: "ClassAssignment",
      entityId: id,
      description: `Assignation supprimée: ${assignment.subject.name} → ${assignment.classLevel}`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignation supprimée avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - deleteClassAssignment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "CLASS_ASSIGNMENT_DELETION_ERROR",
      entity: "ClassAssignment",
      description: "Erreur lors de la suppression de l'assignation",
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
 * @desc Récupère les assignations d'une classe
 */
export const getClassAssignmentsByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { academicYearId, level } = req.query;

    // Trouver le niveau de la classe
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId as string },
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

    const where: any = {
      // Utiliser le niveau fourni en paramètre ou celui de la classe
      classLevel: (level as string) || schoolClass.level,
    };

    if (academicYearId) {
      where.academicYearId = academicYearId as string;
    }

    // Ajouter un filtre par classe si nécessaire
    // Note: Dans votre modèle ClassAssignment, il n'y a pas de classId
    // Vous pouvez ajouter ce champ si nécessaire
    // where.classId = classId;

    const assignments = await prisma.classAssignment.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            coefficient: true,
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        academicYear: true,
        _count: {
          select: {
            schedules: true,
          },
        },
      },
      orderBy: {
        subject: { name: "asc" },
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignations de la classe récupérées",
      data: {
        class: schoolClass,
        assignments,
        total: assignments.length,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - getClassAssignmentsByClass error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les assignations d'un professeur
 */
export const getClassAssignmentsByProfessor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { professeurId } = req.params;
    const { academicYearId } = req.query;

    const where: any = {
      professeurId,
    };

    if (academicYearId) {
      where.academicYearId = academicYearId as string;
    }

    const assignments = await prisma.classAssignment.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            coefficient: true,
          },
        },
        academicYear: true,
        _count: {
          select: {
            schedules: true,
            grades: true,
          },
        },
      },
      orderBy: [{ academicYear: { startDate: "desc" } }, { classLevel: "asc" }],
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignations du professeur récupérées",
      data: {
        assignments,
        total: assignments.length,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - getClassAssignmentsByProfessor error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les assignations disponibles pour un niveau
 */
export const getAvailableAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classLevel } = req.params;
    const { academicYearId } = req.query;

    const where: any = {
      classLevel,
      status: "Active",
    };

    if (academicYearId) {
      where.academicYearId = academicYearId as string;
    }

    // Assignations existantes
    const existingAssignments = await prisma.classAssignment.findMany({
      where,
      select: {
        subjectId: true,
      },
    });

    const assignedSubjectIds = existingAssignments.map((a) => a.subjectId);

    // Toutes les matières
    const allSubjects = await prisma.subject.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        coefficient: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });

    // Professeurs disponibles
    const professeurs = await prisma.professeur.findMany({
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
      orderBy: { lastName: "asc" },
    });

    const response: ApiResponse = {
      success: true,
      message: "Données pour assignation récupérées",
      data: {
        subjects: allSubjects,
        professeurs,
        assignedSubjectIds,
        classLevel,
        academicYearId,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - getAvailableAssignments error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les assignations d'une classe et d'un niveau spécifiques
 *
 */
export const getClassAssignmentsByClassAndLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { level, academicYearId } = req.query;

    if (!level) {
      const response: ApiResponse = {
        success: false,
        message: "Le niveau est requis",
        code: "LEVEL_REQUIRED",
      };
      res.status(400).json(response);
      return;
    }

    const where: any = {
      classLevel: level as string,
    };

    if (academicYearId) {
      where.academicYearId = academicYearId as string;
    }

    const assignments = await prisma.classAssignment.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            coefficient: true,
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        academicYear: true,
        _count: {
          select: {
            schedules: true,
          },
        },
      },
      orderBy: {
        subject: { name: "asc" },
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Assignations filtrées récupérées",
      data: {
        assignments,
        total: assignments.length,
        classId,
        level,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ClassAssignmentController - getClassAssignmentsByClassAndLevel error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
