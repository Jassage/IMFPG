import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createprofesseur = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, speciality, status } = req.body;
    console.log(req.body);

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Les champs firstName, lastName et email sont obligatoires",
      });
    }

    // Vérifier si l'email existe déjà
    const existingprofesseur = await prisma.professeur.findUnique({
      where: { email },
    });

    if (existingprofesseur) {
      return res.status(400).json({
        message: "Un professeur avec cet email existe déjà",
      });
    }

    // Créer le professeur
    const professeur = await prisma.professeur.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        speciality: speciality || null,
        status: status || "Active",
      },
    });

    res.status(201).json(professeur);
  } catch (error) {
    console.error("Erreur création professeur:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getprofesseurs = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const professeurs = await prisma.professeur.findMany({
      where,
      orderBy: {
        lastName: "asc",
      },
    });

    res.json(professeurs);
  } catch (error) {
    console.error("Erreur récupération professeurs:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getprofesseurById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            ue: true,
            faculty: true,
          },
        },
      },
    });

    if (!professeur) {
      return res.status(404).json({
        message: "Professeur non trouvé",
      });
    }

    res.json(professeur);
  } catch (error) {
    console.error("Erreur récupération professeur:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const updateprofesseur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, speciality, status } = req.body;

    // Vérifier si le professeur existe
    const existingprofesseur = await prisma.professeur.findUnique({
      where: { id },
    });

    if (!existingprofesseur) {
      return res.status(404).json({
        message: "Professeur non trouvé",
      });
    }

    // Vérifier les conflits d'email
    if (email && email !== existingprofesseur.email) {
      const existingEmail = await prisma.professeur.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res.status(400).json({
          message: "Un professeur avec cet email existe déjà",
        });
      }
    }

    // Mettre à jour le professeur
    const professeur = await prisma.professeur.update({
      where: { id },
      data: {
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
        speciality: speciality ?? undefined,
        status: status ?? undefined,
      },
    });

    res.json(professeur);
  } catch (error) {
    console.error("Erreur modification professeur:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const deleteprofesseur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
      where: { id },
    });

    if (!professeur) {
      return res.status(404).json({
        message: "Professeur non trouvé",
      });
    }

    // Vérifier s'il a des affectations
    const assignments = await prisma.courseAssignment.count({
      where: { professeurId: id },
    });

    if (assignments > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer un professeur avec des affectations de cours",
      });
    }

    // Supprimer le professeur
    await prisma.professeur.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression professeur:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getprofesseurAssignments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assignments = await prisma.courseAssignment.findMany({
      where: { professeurId: id },
      include: {
        ue: true,
        faculty: true,
      },
      orderBy: [{ semester: "desc" }],
    });

    res.json(assignments);
  } catch (error) {
    console.error("Erreur récupération affectations:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

// export const getprofesseurStats = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const currentYear = new Date().getFullYear().toString();

//     const stats = await prisma.courseAssignment.groupBy({
//       by: ["academicYear"],
//       where: { professeurId: id },
//       _count: {
//         id: true,
//       },
//     });

//     const currentYearAssignments = await prisma.courseAssignment.count({
//       where: {
//         professeurId: id,
//         academicYear: currentYear,
//       },
//     });

//     res.json({
//       byYear: stats,
//       currentYear: currentYearAssignments,
//       total: stats.reduce(
//         (sum: number, item: { academicYear: string; _count: { id: number } }) =>
//           sum + item._count.id,
//         0
//       ),
//     });
//   } catch (error) {
//     console.error("Erreur récupération statistiques:", error);
//     res.status(500).json({
//       message: "Erreur interne du serveur",
//     });
//   }
// };
