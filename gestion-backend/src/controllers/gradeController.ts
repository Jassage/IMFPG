import { Request, Response } from "express";
import prisma from "../prisma";
import { GradeStatus, SessionType } from "../../generated/prisma";
// import { GradeStatus, SessionType from "@prisma/client";

// Interface pour les erreurs Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

// Type guard pour vérifier si une erreur est une PrismaError
function isPrismaError(error: unknown): error is PrismaError {
  return error instanceof Error && "code" in error;
}

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const { studentId, ueId, academicYearId, semester } = req.query;

    const whereClause: any = {};

    if (studentId) whereClause.studentId = studentId as string;
    if (ueId) whereClause.ueId = ueId as string;
    if (academicYearId) whereClause.academicYearId = academicYearId as string;
    if (semester) whereClause.semester = semester as string;

    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
        ue: {
          select: {
            id: true,
            code: true,
            title: true,
            credits: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);

    let errorMessage = "Erreur lors de la récupération des notes";
    if (isPrismaError(error)) {
      errorMessage = `Erreur base de données: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

export const getGradeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de la note requis" });
    }

    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
        ue: {
          select: {
            id: true,
            code: true,
            title: true,
            credits: true,
            passingGrade: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!grade) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    res.json(grade);
  } catch (error) {
    console.error("Error fetching grade:", error);

    let errorMessage = "Erreur lors de la récupération de la note";
    if (isPrismaError(error)) {
      errorMessage = `Erreur base de données: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

export const createGrade = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      ueId,
      grade: gradeValue,
      status,
      session,
      semester,
      level,
      academicYearId,
      professeurId,
    } = req.body;

    // Validation des données requises
    if (
      !studentId ||
      !ueId ||
      gradeValue === undefined ||
      !academicYearId ||
      !semester ||
      !level
    ) {
      return res.status(400).json({
        error:
          "Données manquantes: studentId, ueId, grade, academicYearId, semester et level sont requis",
      });
    }

    // Validation de la note
    const numericGrade = parseFloat(gradeValue);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      return res.status(400).json({
        error: "La note doit être un nombre entre 0 et 100",
      });
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Vérifier si l'UE existe
    const ue = await prisma.uE.findUnique({
      where: { id: ueId },
    });

    if (!ue) {
      return res.status(404).json({ error: "UE non trouvée" });
    }

    // Vérifier si l'année académique existe
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return res.status(404).json({ error: "Année académique non trouvée" });
    }

    // Vérifier si le professeur existe (si provided)
    if (professeurId) {
      const professeur = await prisma.professeur.findUnique({
        where: { id: professeurId },
      });

      if (!professeur) {
        return res.status(404).json({ error: "Professeur non trouvé" });
      }
    }

    // Vérifier si une note existe déjà pour cette combinaison
    const existingGrade = await prisma.grade.findFirst({
      where: {
        studentId,
        ueId,
        academicYearId,
        semester,
      },
    });

    if (existingGrade) {
      return res.status(409).json({
        error:
          "Une note existe déjà pour cet étudiant, cette UE, cette année et ce semestre",
        existingGradeId: existingGrade.id,
      });
    }

    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        ueId,
        grade: numericGrade,
        status: status || calculateGradeStatus(numericGrade, ue.passingGrade),
        session: session || SessionType.Normale,
        semester,
        level,
        academicYearId,
        professeurId: professeurId || null,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
        ue: {
          select: {
            code: true,
            title: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Note créée avec succès",
      grade: newGrade,
    });
  } catch (error) {
    console.error("Error creating grade:", error);

    let errorMessage = "Erreur lors de la création de la note";
    let statusCode = 400;

    if (isPrismaError(error)) {
      if (error.code === "P2002") {
        errorMessage = "Une contrainte d'unicité a été violée";
        statusCode = 409;
      } else if (error.code === "P2003") {
        errorMessage = "Référence étrangère non trouvée";
        statusCode = 404;
      } else {
        errorMessage = `Erreur base de données: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID de la note requis" });
    }

    // Vérifier si la note existe
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    // Validation de la note si elle est fournie
    if (data.grade !== undefined) {
      const numericGrade = parseFloat(data.grade);
      if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
        return res.status(400).json({
          error: "La note doit être un nombre entre 0 et 100",
        });
      }
      data.grade = numericGrade;
    }

    // Si la note change, recalculer le statut si nécessaire
    if (data.grade !== undefined && !data.status) {
      const ue = await prisma.uE.findUnique({
        where: { id: existingGrade.ueId },
        select: { passingGrade: true },
      });

      if (ue) {
        data.status = calculateGradeStatus(data.grade, ue.passingGrade);
      }
    }

    const updatedGrade = await prisma.grade.update({
      where: { id },
      data,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        ue: {
          select: {
            code: true,
            title: true,
          },
        },
      },
    });

    res.json({
      message: "Note mise à jour avec succès",
      grade: updatedGrade,
    });
  } catch (error) {
    console.error("Error updating grade:", error);

    let errorMessage = "Erreur lors de la mise à jour de la note";
    let statusCode = 400;

    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        errorMessage = "Note non trouvée";
        statusCode = 404;
      } else {
        errorMessage = `Erreur base de données: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

export const deleteGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de la note requis" });
    }

    // Vérifier si la note existe
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    await prisma.grade.delete({ where: { id } });

    res.json({
      message: "Note supprimée avec succès",
      deletedGrade: {
        id: existingGrade.id,
        studentId: existingGrade.studentId,
        ueId: existingGrade.ueId,
      },
    });
  } catch (error) {
    console.error("Error deleting grade:", error);

    let errorMessage = "Erreur lors de la suppression de la note";
    let statusCode = 400;

    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        errorMessage = "Note non trouvée";
        statusCode = 404;
      } else {
        errorMessage = `Erreur base de données: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

// Fonction utilitaire pour calculer le statut de la note
function calculateGradeStatus(
  grade: number,
  passingGrade: number = 10
): GradeStatus {
  if (grade >= passingGrade) {
    return GradeStatus.Valide;
  } else if (grade >= passingGrade * 0.7) {
    return GradeStatus.AReprendre;
  } else {
    return GradeStatus.EnCours;
  }
}
