// controllers/guardianController.ts
import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * @desc Récupère la liste des guardians avec pagination et filtres
 * @route GET /api/guardians
 * @access Admin/Staff
 */
export const getAllGuardians = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📥 GET /api/guardians - Début de la requête");

    const {
      page = 1,
      limit = 50,
      studentId,
      search,
      hasParentAccount,
      isPrimary,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    // Construire les filtres
    const where: any = {};

    if (studentId && studentId !== "all") {
      where.studentId = studentId as string;
    }

    if (hasParentAccount === "true") {
      where.parentId = { not: null };
    } else if (hasParentAccount === "false") {
      where.parentId = null;
    }

    if (isPrimary === "true") {
      where.isPrimary = true;
    } else if (isPrimary === "false") {
      where.isPrimary = false;
    }

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { firstName: { contains: searchStr, mode: "insensitive" } },
        { lastName: { contains: searchStr, mode: "insensitive" } },
        { email: { contains: searchStr, mode: "insensitive" } },
        { phone: { contains: searchStr, mode: "insensitive" } },
        { relationship: { contains: searchStr, mode: "insensitive" } },
      ];
    }

    console.log(`🔍 Filtres Guardians:`, where);

    // Récupérer les guardians avec leurs relations
    const [guardians, total] = await Promise.all([
      prisma.guardian.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          relationship: true,
          isPrimary: true,
          createdAt: true,
          updatedAt: true,
          studentId: true,
          parentId: true,

          // Inclure l'étudiant
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
              status: true,
              classId: true,
              schoolClass: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                },
              },
            },
          },

          // Inclure le parent si existe
          parent: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.guardian.count({ where }),
    ]);

    console.log(
      `✅ ${guardians.length} guardians récupérés sur ${total} total`
    );

    // Formater la réponse
    const response = {
      success: true,
      message: "Guardians récupérés avec succès",
      data: guardians,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ Erreur getAllGuardians:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des guardians",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc Récupère un guardian par son ID
 * @route GET /api/guardians/:id
 * @access Admin/Staff
 */
export const getGuardianById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`📥 GET /api/guardians/${id}`);

    const guardian = await prisma.guardian.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            status: true,
            classId: true,
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
        parent: {
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
                firstName: true,
                lastName: true,
                relationship: true,
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
        },
      },
    });

    if (!guardian) {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé",
      });
      return;
    }

    res.json({
      success: true,
      message: "Guardian récupéré avec succès",
      data: guardian,
    });
  } catch (error: any) {
    console.error(`❌ Erreur getGuardianById ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du guardian",
    });
  }
};

/**
 * @desc Crée un nouveau guardian
 * @route POST /api/guardians
 * @access Admin/Staff
 */
export const createGuardian = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      relationship,
      isPrimary = false,
      studentId,
      parentId,
      notes,
    } = req.body;

    console.log("📥 POST /api/guardians - Création:", {
      firstName,
      lastName,
      studentId,
    });

    // Validation des données requises
    if (!firstName || !lastName || !phone || !studentId) {
      res.status(400).json({
        success: false,
        message: "Prénom, nom, téléphone et étudiant sont requis",
      });
      return;
    }

    // Vérifier que l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
      return;
    }

    // Vérifier l'unicité du téléphone pour cet étudiant
    const existingGuardian = await prisma.guardian.findFirst({
      where: {
        phone,
        studentId,
      },
    });

    if (existingGuardian) {
      res.status(400).json({
        success: false,
        message:
          "Un guardian avec ce numéro de téléphone existe déjà pour cet étudiant",
      });
      return;
    }

    // Vérifier le parent si parentId est fourni
    if (parentId) {
      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        res.status(404).json({
          success: false,
          message: "Parent non trouvé",
        });
        return;
      }

      // Vérifier si ce parent est déjà guardian de cet étudiant
      const existingParentGuardian = await prisma.guardian.findFirst({
        where: {
          parentId,
          studentId,
        },
      });

      if (existingParentGuardian) {
        res.status(400).json({
          success: false,
          message: "Ce parent est déjà tuteur de cet étudiant",
        });
        return;
      }
    }

    // Si c'est le premier guardian pour cet étudiant, le définir comme principal
    const studentGuardians = await prisma.guardian.findMany({
      where: { studentId },
    });

    const shouldBePrimary = studentGuardians.length === 0 || isPrimary;

    // Si on définit comme principal, mettre les autres comme non principaux
    if (shouldBePrimary && studentGuardians.length > 0) {
      await prisma.guardian.updateMany({
        where: { studentId },
        data: { isPrimary: false },
      });
    }

    // Créer le guardian
    const guardian = await prisma.guardian.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone,
        address: address || null,
        relationship: relationship || "Parent",
        isPrimary: shouldBePrimary,
        studentId,
        parentId: parentId || null,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    console.log(`✅ Guardian créé: ${guardian.id}`);

    res.status(201).json({
      success: true,
      message: "Guardian créé avec succès",
      data: guardian,
    });
  } catch (error: any) {
    console.error("❌ Erreur createGuardian:", error);

    // Gestion des erreurs Prisma
    if (error.code === "P2003") {
      res.status(400).json({
        success: false,
        message: "Référence invalide (étudiant ou parent inexistant)",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du guardian",
    });
  }
};

/**
 * @desc Met à jour un guardian
 * @route PUT /api/guardians/:id
 * @access Admin/Staff
 */
export const updateGuardian = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`📥 PUT /api/guardians/${id}`, updateData);

    // Vérifier si le guardian existe
    const existingGuardian = await prisma.guardian.findUnique({
      where: { id },
    });

    if (!existingGuardian) {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé",
      });
      return;
    }

    // Si modification du téléphone, vérifier l'unicité
    if (updateData.phone && updateData.phone !== existingGuardian.phone) {
      const existingPhone = await prisma.guardian.findFirst({
        where: {
          phone: updateData.phone,
          studentId: existingGuardian.studentId,
          id: { not: id },
        },
      });

      if (existingPhone) {
        res.status(400).json({
          success: false,
          message: "Ce numéro de téléphone est déjà utilisé pour cet étudiant",
        });
        return;
      }
    }

    // Si on définit comme principal, mettre les autres comme non principaux
    if (updateData.isPrimary === true) {
      await prisma.guardian.updateMany({
        where: {
          studentId: existingGuardian.studentId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    // Mettre à jour le guardian
    const guardian = await prisma.guardian.update({
      where: { id },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        relationship: updateData.relationship,
        isPrimary: updateData.isPrimary,
        parentId: updateData.parentId,
      },
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
    });

    console.log(`✅ Guardian mis à jour: ${guardian.id}`);

    res.json({
      success: true,
      message: "Guardian mis à jour avec succès",
      data: guardian,
    });
  } catch (error: any) {
    console.error(`❌ Erreur updateGuardian ${req.params.id}:`, error);

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du guardian",
    });
  }
};

/**
 * @desc Supprime un guardian
 * @route DELETE /api/guardians/:id
 * @access Admin/Staff
 */
export const deleteGuardian = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`📥 DELETE /api/guardians/${id}`);

    // Vérifier si le guardian existe
    const guardian = await prisma.guardian.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!guardian) {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé",
      });
      return;
    }

    // Si c'est le guardian principal, en désigner un autre si possible
    if (guardian.isPrimary) {
      const otherGuardians = await prisma.guardian.findMany({
        where: {
          studentId: guardian.studentId,
          id: { not: id },
        },
        take: 1,
      });

      if (otherGuardians.length > 0) {
        await prisma.guardian.update({
          where: { id: otherGuardians[0].id },
          data: { isPrimary: true },
        });
      }
    }

    // Supprimer le guardian
    await prisma.guardian.delete({
      where: { id },
    });

    console.log(`✅ Guardian supprimé: ${id}`);

    res.json({
      success: true,
      message: "Guardian supprimé avec succès",
      data: {
        id,
        studentName: guardian.student
          ? `${guardian.student.firstName} ${guardian.student.lastName}`
          : "Étudiant inconnu",
      },
    });
  } catch (error: any) {
    console.error(`❌ Erreur deleteGuardian ${req.params.id}:`, error);

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du guardian",
    });
  }
};

/**
 * @desc Recherche des guardians
 * @route GET /api/guardians/search
 * @access Admin/Staff
 */
export const searchGuardians = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q, studentId } = req.query;
    console.log(
      `🔍 GET /api/guardians/search - q: ${q}, studentId: ${studentId}`
    );

    if (!q || typeof q !== "string") {
      res.status(400).json({
        success: false,
        message: "Terme de recherche requis",
      });
      return;
    }

    const where: any = {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    };

    if (studentId && typeof studentId === "string") {
      where.studentId = studentId;
    }

    const guardians = await prisma.guardian.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
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
      take: 20,
    });

    res.json({
      success: true,
      message: "Recherche terminée",
      data: guardians,
      count: guardians.length,
    });
  } catch (error: any) {
    console.error("❌ Erreur searchGuardians:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche",
    });
  }
};

/**
 * @desc Définit un guardian comme principal pour un étudiant
 * @route PUT /api/guardians/:id/set-primary
 * @access Admin/Staff
 */
export const setPrimaryGuardian = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    console.log(
      `⭐ PUT /api/guardians/${id}/set-primary pour étudiant ${studentId}`
    );

    if (!studentId) {
      res.status(400).json({
        success: false,
        message: "ID de l'étudiant requis",
      });
      return;
    }

    // Vérifier que le guardian existe et appartient à cet étudiant
    const guardian = await prisma.guardian.findFirst({
      where: {
        id,
        studentId,
      },
    });

    if (!guardian) {
      res.status(404).json({
        success: false,
        message: "Guardian non trouvé pour cet étudiant",
      });
      return;
    }

    // Mettre tous les guardians de cet étudiant comme non principaux
    await prisma.guardian.updateMany({
      where: { studentId },
      data: { isPrimary: false },
    });

    // Définir ce guardian comme principal
    await prisma.guardian.update({
      where: { id },
      data: { isPrimary: true },
    });

    // Récupérer le guardian mis à jour
    const updatedGuardian = await prisma.guardian.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Guardian défini comme principal avec succès",
      data: updatedGuardian,
    });
  } catch (error: any) {
    console.error(`❌ Erreur setPrimaryGuardian ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la définition du guardian principal",
    });
  }
};

/**
 * @desc Récupère les statistiques des guardians
 * @route GET /api/guardians/statistics
 * @access Admin/Staff
 */
export const getGuardianStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📊 GET /api/guardians/statistics");

    // Compter par relation
    const relationshipStats = await prisma.guardian.groupBy({
      by: ["relationship"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Compter les guardians avec/sans compte parent
    const parentAccountStats = await prisma.guardian.groupBy({
      by: ["parentId"],
      _count: {
        id: true,
      },
    });

    // Compter par statut principal
    const primaryStats = await prisma.guardian.groupBy({
      by: ["isPrimary"],
      _count: {
        id: true,
      },
    });

    // Nombre total
    const totalGuardians = await prisma.guardian.count();

    // Derniers ajouts (7 derniers jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentAdditions = await prisma.guardian.count({
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
    });

    // Statistiques par étudiant
    const studentsWithGuardians = await prisma.student.findMany({
      where: {
        guardians: {
          some: {},
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            guardians: true,
          },
        },
      },
      orderBy: {
        guardians: {
          _count: "desc",
        },
      },
      take: 5,
    });

    const statistics = {
      total: totalGuardians,
      byRelationship: relationshipStats.reduce(
        (acc, item) => {
          acc[item.relationship] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
      withParentAccount:
        parentAccountStats.find((item) => item.parentId)?._count.id || 0,
      withoutParentAccount:
        parentAccountStats.find((item) => !item.parentId)?._count.id || 0,
      primary: primaryStats.find((item) => item.isPrimary)?._count.id || 0,
      secondary: primaryStats.find((item) => !item.isPrimary)?._count.id || 0,
      recentAdditions,
      topStudentsWithGuardians: studentsWithGuardians.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        guardianCount: student._count.guardians,
      })),
    };

    res.json({
      success: true,
      message: "Statistiques récupérées avec succès",
      data: { statistics },
    });
  } catch (error: any) {
    console.error("❌ Erreur getGuardianStatistics:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
