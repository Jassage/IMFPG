import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createUE = async (req: Request, res: Response) => {
  try {
    const {
      code,
      title,
      credits,
      type,
      passingGrade,
      description,
      objectives,
      createdById,
    } = req.body;

    // Validation des champs obligatoires
    if (!code || !title || !credits || !type || !createdById) {
      return res.status(400).json({
        message:
          "Les champs code, title, credits, type et createdById sont obligatoires",
      });
    }

    // Vérifier si le code UE existe déjà
    const existingUE = await prisma.uE.findUnique({
      where: { code },
    });

    if (existingUE) {
      return res.status(400).json({
        message: "Une UE avec ce code existe déjà",
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: createdById },
    });

    if (!user) {
      return res.status(400).json({
        message: "L'utilisateur spécifié n'existe pas",
      });
    }

    // Créer l'UE
    const ue = await prisma.uE.create({
      data: {
        code,
        title,
        credits: parseInt(credits),
        type,
        passingGrade: passingGrade ? parseInt(passingGrade) : 60,
        description: description || null,
        objectives: objectives || null,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(ue);
  } catch (error) {
    console.error("Erreur création UE:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getUEs = async (req: Request, res: Response) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    if (type && type !== "all") {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { code: { contains: search as string, mode: "insensitive" } },
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [ues, total] = await Promise.all([
      prisma.uE.findMany({
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
          prerequisites: {
            include: {
              prerequisite: {
                // Correction: utiliser le bon nom de relation
                select: {
                  id: true,
                  code: true,
                  title: true,
                },
              },
            },
          },
          requiredFor: {
            include: {
              ue: {
                // Correction: utiliser le bon nom de relation
                select: {
                  id: true,
                  code: true,
                  title: true,
                },
              },
            },
          },
          assignments: {
            include: {
              professeur: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              faculty: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        orderBy: {
          code: "asc",
        },
        skip,
        take,
      }),
      prisma.uE.count({ where }),
    ]);

    res.json({
      ues,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Erreur récupération UEs:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getUEById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ue = await prisma.uE.findUnique({
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
        prerequisites: {
          include: {
            prerequisite: {
              select: {
                id: true,
                code: true,
                title: true,
                credits: true,
                type: true,
              },
            },
          },
        },
        requiredFor: {
          include: {
            ue: {
              select: {
                id: true,
                code: true,
                title: true,
                credits: true,
                type: true,
              },
            },
          },
        },
        assignments: {
          include: {
            professeur: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            ue: {
              select: {
                id: true,
                code: true,
                title: true,
              },
            },
          },
        },
        grades: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
              },
            },
          },
        },
        retakes: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
              },
            },
          },
        },
      },
    });

    if (!ue) {
      return res.status(404).json({
        message: "UE non trouvée",
      });
    }

    res.json(ue);
  } catch (error) {
    console.error("Erreur récupération UE:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const updateUE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      code,
      title,
      credits,
      type,
      passingGrade,
      description,
      objectives,
    } = req.body;

    // Vérifier si l'UE existe
    const existingUE = await prisma.uE.findUnique({
      where: { id },
    });

    if (!existingUE) {
      return res.status(404).json({
        message: "UE non trouvée",
      });
    }

    // Vérifier les conflits de code
    if (code && code !== existingUE.code) {
      const existingCode = await prisma.uE.findUnique({
        where: { code },
      });
      if (existingCode) {
        return res.status(400).json({
          message: "Une UE avec ce code existe déjà",
        });
      }
    }

    // Mettre à jour l'UE
    const ue = await prisma.uE.update({
      where: { id },
      data: {
        code: code ?? undefined,
        title: title ?? undefined,
        credits: credits ? parseInt(credits) : undefined,
        type: type ?? undefined,
        passingGrade: passingGrade ? parseInt(passingGrade) : undefined,
        description: description ?? undefined,
        objectives: objectives ?? undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(ue);
  } catch (error) {
    console.error("Erreur modification UE:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const deleteUE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'UE existe
    const ue = await prisma.uE.findUnique({
      where: { id },
      include: {
        assignments: true,
        grades: true,
        retakes: true,
        prerequisites: true,
        requiredFor: true,
      },
    });

    if (!ue) {
      return res.status(404).json({
        message: "UE non trouvée",
      });
    }

    // Vérifier les dépendances
    if (
      ue.assignments.length > 0 ||
      ue.grades.length > 0 ||
      ue.retakes.length > 0
    ) {
      return res.status(400).json({
        message:
          "Impossible de supprimer une UE avec des affectations, notes ou rattrapages",
      });
    }

    // Supprimer les prérequis d'abord
    await prisma.uEPrerequisite.deleteMany({
      where: {
        OR: [{ ueId: id }, { prerequisiteId: id }],
      },
    });

    // Supprimer l'UE
    await prisma.uE.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression UE:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const addPrerequisite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { prerequisiteId } = req.body;

    // Vérifier si l'UE existe
    const ue = await prisma.uE.findUnique({
      where: { id },
    });

    if (!ue) {
      return res.status(404).json({
        message: "UE non trouvée",
      });
    }

    // Vérifier si le prérequi existe
    const prerequisite = await prisma.uE.findUnique({
      where: { id: prerequisiteId },
    });

    if (!prerequisite) {
      return res.status(404).json({
        message: "UE prérequise non trouvée",
      });
    }

    // Éviter les références circulaires
    if (id === prerequisiteId) {
      return res.status(400).json({
        message: "Une UE ne peut pas être son propre prérequis",
      });
    }

    // Vérifier si le prérequis existe déjà
    const existingPrerequisite = await prisma.uEPrerequisite.findUnique({
      where: {
        ueId_prerequisiteId: {
          ueId: id,
          prerequisiteId,
        },
      },
    });

    if (existingPrerequisite) {
      return res.status(400).json({
        message: "Ce prérequis existe déjà",
      });
    }

    // Ajouter le prérequis
    const prerequisiteRelation = await prisma.uEPrerequisite.create({
      data: {
        ueId: id,
        prerequisiteId,
      },
      include: {
        ue: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
        prerequisite: {
          select: {
            id: true,
            code: true,
            title: true,
          },
        },
      },
    });
    res.status(201).json(prerequisiteRelation);
  } catch (error) {
    console.error("Erreur ajout prérequis:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const removePrerequisite = async (req: Request, res: Response) => {
  try {
    const { id, prerequisiteId } = req.params;

    // Vérifier si la relation existe
    const prerequisite = await prisma.uEPrerequisite.findUnique({
      where: {
        ueId_prerequisiteId: {
          ueId: id,
          prerequisiteId,
        },
      },
    });

    if (!prerequisite) {
      return res.status(404).json({
        message: "Relation de prérequis non trouvée",
      });
    }

    // Supprimer le prérequis
    await prisma.uEPrerequisite.delete({
      where: {
        ueId_prerequisiteId: {
          ueId: id,
          prerequisiteId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression prérequis:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getUEStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stats = await prisma.grade.groupBy({
      by: ["status"],
      where: { ueId: id },
      _count: {
        id: true,
      },
    });

    const averageGrade = await prisma.grade.aggregate({
      where: {
        ueId: id,
        status: "Valide",
      },
      _avg: {
        grade: true,
      },
    });

    const retakeStats = await prisma.retake.groupBy({
      by: ["status"],
      where: { ueId: id },
      _count: {
        id: true,
      },
    });

    res.json({
      gradeStats: stats,
      averageGrade: averageGrade._avg.grade,
      retakeStats,
      totalStudents: stats.reduce((sum, item) => sum + item._count.id, 0),
    });
  } catch (error) {
    console.error("Erreur récupération statistiques UE:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const searchUEs = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Le paramètre de recherche est requis",
      });
    }

    const ues = await prisma.uE.findMany({
      where: {
        OR: [
          { code: { contains: q as string } },
          { title: { contains: q as string } },
          { description: { contains: q as string } },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: 20,
    });

    res.json(ues);
  } catch (error) {
    console.error("Erreur recherche UEs:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};
