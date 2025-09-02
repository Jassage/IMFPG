import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createCourseAssignment = async (req: Request, res: Response) => {
  try {
    const { ueId, professeurId, facultyId, level, academicYearId, semester } =
      req.body;
    console.log("Requête création affectation:", req.body);

    // Validation des champs obligatoires - Utiliser professeurId au lieu de professorId
    if (
      !ueId ||
      !professeurId || // ← Changer professorId à professeurId
      !facultyId ||
      !level ||
      !academicYearId ||
      !semester
    ) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
        receivedData: req.body, // Ajouter les données reçues pour le debug
        missingFields: {
          ueId: !ueId,
          professeurId: !professeurId, // ← Changer ici aussi
          facultyId: !facultyId,
          level: !level,
          academicYearId: !academicYearId,
          semester: !semester,
        },
      });
    }

    // Vérifier si le professeur existe
    const professor = await prisma.professeur.findUnique({
      where: { id: professeurId }, // ← Changer ici
    });

    if (!professor) {
      return res.status(404).json({
        message: "Professeur non trouvé",
      });
    }

    // Vérifier si le cours (UE) existe
    const ue = await prisma.uE.findUnique({
      where: { id: ueId },
    });

    if (!ue) {
      return res.status(404).json({
        message: "UE non trouvée",
      });
    }

    // Vérifier si la faculté existe
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculté non trouvée",
      });
    }

    // Vérifier si l'année académique existe
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return res.status(404).json({
        message: "Année académique non trouvée",
      });
    }

    // Vérifier si l'affectation existe déjà
    const existingAssignment = await prisma.courseAssignment.findFirst({
      where: {
        ueId,
        professeurId: professeurId, // ← Changer ici
        facultyId,
        level,
        academicYearId,
        semester,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "Cette affectation existe déjà",
      });
    }

    // Créer l'affectation
    const assignment = await prisma.courseAssignment.create({
      data: {
        ueId,
        professeurId: professeurId, // ← Changer ici
        facultyId,
        level,
        academicYearId,
        semester,
      },
      include: {
        ue: true,
        professeur: true,
        faculty: true,
        academicYear: true,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Erreur création affectation:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

// Dans getCourseAssignments
export const getCourseAssignments = async (req: Request, res: Response) => {
  try {
    const { professorId, facultyId, academicYearId, semester, level } =
      req.query;

    const where: any = {};

    if (professorId) where.professeurId = professorId;
    if (facultyId) where.facultyId = facultyId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (semester) where.semester = semester;
    if (level) where.level = level;

    const assignments = await prisma.courseAssignment.findMany({
      where,
      include: {
        ue: true,
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        faculty: true,
        academicYear: true,
      },
      orderBy: [
        {
          academicYear: {
            year: "desc",
          },
        },
        {
          semester: "desc",
        },
      ],
    });

    res.json(assignments);
  } catch (error) {
    console.error("Erreur récupération affectations:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const deleteCourseAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'affectation existe
    const assignment = await prisma.courseAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Affectation non trouvée",
      });
    }

    // Supprimer l'affectation
    await prisma.courseAssignment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression affectation:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const updateCourseAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ueId, facultyId, level, academicYearId, semester, professeurId } =
      req.body;

    // Vérifier si l'affectation existe
    const assignment = await prisma.courseAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Affectation non trouvée",
      });
    }

    // Vérifications optionnelles pour les relations
    if (ueId) {
      const ue = await prisma.uE.findUnique({ where: { id: ueId } });
      if (!ue) return res.status(404).json({ message: "UE non trouvée" });
    }

    if (facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId },
      });
      if (!faculty)
        return res.status(404).json({ message: "Faculté non trouvée" });
    }

    if (academicYearId) {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });
      if (!academicYear)
        return res
          .status(404)
          .json({ message: "Année académique non trouvée" });
    }

    if (professeurId) {
      const professor = await prisma.professeur.findUnique({
        where: { id: professeurId },
      });
      if (!professor)
        return res.status(404).json({ message: "Professeur non trouvé" });
    }

    // Mettre à jour l'affectation
    const updatedAssignment = await prisma.courseAssignment.update({
      where: { id },
      data: {
        ueId: ueId ?? undefined,
        facultyId: facultyId ?? undefined,
        level: level ?? undefined,
        academicYearId: academicYearId ?? undefined,
        semester: semester ?? undefined,
        professeurId: professeurId ?? undefined,
      },
      include: {
        ue: true,
        professeur: true,
        faculty: true,
        academicYear: true,
      },
    });

    res.json(updatedAssignment);
  } catch (error) {
    console.error("Erreur modification affectation:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

// Nouvelle fonction pour récupérer les affectations par faculté
export const getAssignmentsByFaculty = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const { level, academicYearId, semester } = req.query;

    const where: any = { facultyId };

    if (level) where.level = level;
    if (academicYearId) where.academicYearId = academicYearId;
    if (semester) where.semester = semester;

    const assignments = await prisma.courseAssignment.findMany({
      where,
      include: {
        ue: true,
        professeur: true,
        faculty: true,
        academicYear: true,
      },
      orderBy: [
        {
          academicYear: {
            year: "desc",
          },
        },
        {
          semester: "desc",
        },
        {
          level: "asc",
        },
      ],
    });

    res.json(assignments);
  } catch (error) {
    console.error("Erreur récupération affectations par faculté:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Fonction pour récupérer les UEs par faculté et niveau
export const getUEsByFacultyAndLevel = async (req: Request, res: Response) => {
  try {
    const { facultyId, level } = req.params;

    if (!facultyId || !level) {
      return res
        .status(400)
        .json({ message: "facultyId et level sont requis" });
    }

    const assignments = await prisma.courseAssignment.findMany({
      where: {
        facultyId,
        level,
      },
      include: {
        ue: true,
      },
      distinct: ["ueId"], // Pour éviter les doublons d'UE
    });

    const ues = assignments.map((assignment) => assignment.ue);

    res.json(ues);
  } catch (error) {
    console.error("Erreur récupération UEs par faculté et niveau:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
