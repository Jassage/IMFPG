// controllers/enrollmentController.ts
import { Request, Response } from "express";
import prisma from "../prisma";

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, faculty, level, academicYear, status, enrollmentDate } =
      req.body;

    // console.log("Données reçues:", req.body);

    // 1. Trouver la faculté par son nom
    const facultyRecord = await prisma.faculty.findFirst({
      where: { name: faculty },
    });

    if (!facultyRecord) {
      return res.status(400).json({
        error: "Faculté non trouvée",
        details: `La faculté "${faculty}" n'existe pas`,
      });
    }

    // 2. Trouver l'année académique par son année
    const academicYearRecord = await prisma.academicYear.findFirst({
      where: { year: academicYear },
    });

    if (!academicYearRecord) {
      return res.status(400).json({
        error: "Année académique non trouvée",
        details: `L'année académique "${academicYear}" n'existe pas`,
      });
    }

    // 3. Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(400).json({
        error: "Étudiant non trouvé",
        details: `L'étudiant avec l'ID ${studentId} n'existe pas`,
      });
    }

    // 4. Vérifier si l'inscription existe déjà
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        facultyId: facultyRecord.id,
        academicYearId: academicYearRecord.id,
        level,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        error: "Inscription déjà existante",
        details:
          "Cet étudiant est déjà inscrit dans cette faculté pour cette année académique",
      });
    }

    // 5. Créer l'inscription
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId,
        facultyId: facultyRecord.id,
        level,
        academicYearId: academicYearRecord.id,
        status: status || "Active",
        enrollmentDate: enrollmentDate || new Date().toISOString(),
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
          },
        },
      },
    });

    res.status(201).json(newEnrollment);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(400).json({
      error: "Erreur lors de la création",
      // details: error.message,
    });
  }
};

// Mettez aussi à jour updateEnrollment pour la même logique
export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentId, faculty, academicYear, ...otherData } = req.body;

    const updateData: any = { ...otherData };

    // Si faculty est fourni, trouver l'ID correspondant
    if (faculty) {
      const facultyRecord = await prisma.faculty.findFirst({
        where: { name: faculty },
      });
      if (!facultyRecord) {
        return res.status(400).json({ error: "Faculté non trouvée" });
      }
      updateData.facultyId = facultyRecord.id;
    }

    // Si academicYear est fourni, trouver l'ID correspondant
    if (academicYear) {
      const academicYearRecord = await prisma.academicYear.findFirst({
        where: { year: academicYear },
      });
      if (!academicYearRecord) {
        return res.status(400).json({ error: "Année académique non trouvée" });
      }
      updateData.academicYearId = academicYearRecord.id;
    }

    // 4. Vérifier si l'inscription existe déjà
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        facultyId: updateData.facultyId,
        academicYearId: updateData.academicYearId,
        level: updateData.level,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        error: "Inscription déjà existante",
        details:
          "Cet étudiant est déjà inscrit dans cette faculté pour cette année académique",
      });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        faculty: {
          select: {
            name: true,
          },
        },
        academicYear: {
          select: {
            year: true,
          },
        },
      },
    });

    res.json(updatedEnrollment);
  } catch (error) {
    console.error("Erreur update:", error);
    res.status(400).json({
      error: "Erreur lors de la mise à jour",
      // details: error.message,
    });
  }
};

// Mettez à jour aussi getAllEnrollments pour inclure les relations
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentId: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transformer les données pour le frontend
    const transformedEnrollments = enrollments.map((enrollment) => ({
      ...enrollment,
      faculty: enrollment.faculty?.name || "",
      academicYear: enrollment.academicYear?.year || "",
    }));

    res.json(transformedEnrollments);
  } catch (error) {
    console.error("Erreur get all:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
