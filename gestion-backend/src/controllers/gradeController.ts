/**
 * @file gradeController.ts
 * @description Contrôleurs pour la gestion des notes des étudiants
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

const prisma = new PrismaClient();

// Interface pour les réponses API
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

// Interface pour les filtres de recherche des notes
interface GradeFilters {
  studentId?: string;
  subjectId?: string;
  assignmentId?: string;
  academicYearId?: string;
  classLevel?: string;
  controlType?: string;
  session?: string;
  status?: string;
  minGrade?: number;
  maxGrade?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * @desc Récupère la liste des notes avec filtres et pagination
 */
export const getGrades = async (req: Request, res: Response): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      search,
      studentId,
      subjectId,
      assignmentId,
      academicYearId,
      classLevel,
      controlType,
      session,
      status,
      minGrade,
      maxGrade,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construction des filtres
    const where: any = {};

    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;
    if (assignmentId) where.assignmentId = assignmentId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (classLevel) where.classLevel = classLevel;
    if (controlType) where.controlType = controlType;
    if (session) where.session = session;
    if (status) where.status = status;

    // Filtre par note
    if (minGrade || maxGrade) {
      where.grade = {};
      if (minGrade) where.grade.gte = parseFloat(minGrade as string);
      if (maxGrade) where.grade.lte = parseFloat(maxGrade as string);
    }

    // Filtre par date
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    // Recherche par nom d'étudiant ou sujet (si search est fourni)
    if (search) {
      where.OR = [
        {
          student: {
            OR: [
              {
                firstName: { contains: search as string, mode: "insensitive" },
              },
              { lastName: { contains: search as string, mode: "insensitive" } },
              {
                studentCode: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
        {
          subject: {
            OR: [
              { name: { contains: search as string, mode: "insensitive" } },
              { code: { contains: search as string, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Récupération avec pagination et relations
    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
              classId: true,
              schoolClass: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              coefficient: true,
              type: true,
              passingGrade: true,
              maxGrade: true,
            },
          },
          classAssignment: {
            include: {
              professeur: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  matricule: true,
                },
              },
              subject: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
          academicYear: {
            select: {
              id: true,
              year: true,
              isCurrent: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.grade.count({ where }),
    ]);

    // Calcul des statistiques
    const statistics = {
      totalGrades: total,
      averageGrade:
        grades.length > 0
          ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length
          : 0,
      passedGrades: grades.filter((g) => g.grade >= g.subject.passingGrade)
        .length,
      failedGrades: grades.filter((g) => g.grade < g.subject.passingGrade)
        .length,
    };

    await createAuditLog({
      ...auditData,
      action: "GRADES_LIST_REQUEST",
      entity: "Grade",
      description: "Liste des notes récupérée",
      status: "SUCCESS",
      metadata: { total, filters: where },
    });

    const response: ApiResponse = {
      success: true,
      message: "Notes récupérées avec succès",
      data: {
        grades,
        statistics,
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
    console.error("GradeController - getGrades error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADES_LIST_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes",
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
 * @desc Récupère une note par ID
 */
export const getGradeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
            email: true,
            schoolClass: {
              select: {
                name: true,
                level: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            coefficient: true,
            type: true,
            passingGrade: true,
            description: true,
          },
        },
        classAssignment: {
          include: {
            professeur: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                matricule: true,
              },
            },
            subject: {
              select: {
                code: true,
                name: true,
              },
            },
            academicYear: {
              select: {
                year: true,
                isCurrent: true,
              },
            },
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
        transcriptGrades: {
          include: {
            transcript: {
              select: {
                id: true,
                documentType: true,
                status: true,
                generatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!grade) {
      const response: ApiResponse = {
        success: false,
        message: "Note non trouvée",
        code: "GRADE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Calculer si la note est validée
    const isPassing = grade.grade >= grade.subject.passingGrade;

    await createAuditLog({
      ...auditData,
      action: "GRADE_DETAILS_REQUEST",
      entity: "Grade",
      entityId: id,
      description: "Détails de la note récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Note récupérée avec succès",
      data: {
        grade,
        evaluation: {
          isPassing,
          passingGrade: grade.subject.passingGrade,
          difference: grade.grade - grade.subject.passingGrade,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("GradeController - getGradeById error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADE_DETAILS_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération de la note",
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
 * @desc Crée une nouvelle note
 */
export const createGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      studentId,
      subjectId,
      assignmentId,
      grade: gradeValue,
      status,
      session,
      controlType,
      academicYearId,
      classLevel,
      notes,
    } = req.body;

    // Validation des données requises
    if (
      !studentId ||
      !subjectId ||
      !assignmentId ||
      gradeValue === undefined ||
      !academicYearId
    ) {
      const response: ApiResponse = {
        success: false,
        message: "Données requises manquantes",
        code: "MISSING_REQUIRED_FIELDS",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier l'existence des entités liées
    const [student, subject, assignment, academicYear] = await Promise.all([
      prisma.student.findUnique({ where: { id: studentId } }),
      prisma.subject.findUnique({ where: { id: subjectId } }),
      prisma.classAssignment.findUnique({ where: { id: assignmentId } }),
      prisma.academicYear.findUnique({ where: { id: academicYearId } }),
    ]);

    if (!student) {
      const response: ApiResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (!subject) {
      const response: ApiResponse = {
        success: false,
        message: "Matière non trouvée",
        code: "SUBJECT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    if (!assignment) {
      const response: ApiResponse = {
        success: false,
        message: "Affectation de classe non trouvée",
        code: "ASSIGNMENT_NOT_FOUND",
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

    // Vérifier si une note existe déjà pour cette combinaison
    const existingGrade = await prisma.grade.findUnique({
      where: {
        studentId_subjectId_academicYearId_controlType_assignmentId: {
          studentId,
          subjectId,
          academicYearId,
          controlType: controlType || "CONTROLE_1",
          assignmentId,
        },
      },
    });

    if (existingGrade) {
      const response: ApiResponse = {
        success: false,
        message: "Une note existe déjà pour cette combinaison",
        code: "GRADE_ALREADY_EXISTS",
        data: { existingGradeId: existingGrade.id },
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier que la note est dans les limites (0-20 ou 0-100)
    const gradeNum = parseFloat(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      const response: ApiResponse = {
        success: false,
        message: "La note doit être comprise entre 0 et 100",
        code: "INVALID_GRADE_RANGE",
      };
      res.status(400).json(response);
      return;
    }

    // Créer la note
    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        assignmentId,
        grade: gradeNum,
        status: status || "Valid_",
        controlType: controlType || "CONTROLE_1",
        academicYearId,
        classLevel: classLevel || assignment.classLevel,
        notes,
        isActive: true,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        subject: {
          select: {
            name: true,
            passingGrade: true,
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "GRADE_CREATED",
      entity: "Grade",
      entityId: newGrade.id,
      description: `Note créée pour l'étudiant ${newGrade.student.firstName} ${newGrade.student.lastName} en ${newGrade.subject.name}`,
      status: "SUCCESS",
      metadata: {
        studentId,
        subjectId,
        assignmentId,
        grade: gradeNum,
        academicYearId,
        controlType,
        session,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Note créée avec succès",
      data: { grade: newGrade },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("GradeController - createGrade error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADE_CREATION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la création de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    // Gestion des erreurs spécifiques Prisma
    if (error.code === "P2002") {
      const response: ApiResponse = {
        success: false,
        message: "Une note existe déjà pour cette combinaison",
        code: "GRADE_ALREADY_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour une note existante
 */
export const updateGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      grade: gradeValue,
      status,
      session,
      controlType,
      notes,
      isActive,
    } = req.body;

    // Vérifier si la note existe
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingGrade) {
      const response: ApiResponse = {
        success: false,
        message: "Note non trouvée",
        code: "GRADE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (gradeValue !== undefined) {
      const gradeNum = parseFloat(gradeValue);
      if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
        const response: ApiResponse = {
          success: false,
          message: "La note doit être comprise entre 0 et 100",
          code: "INVALID_GRADE_RANGE",
        };
        res.status(400).json(response);
        return;
      }
      updateData.grade = gradeNum;
    }

    if (status !== undefined) updateData.status = status;
    if (session !== undefined) updateData.session = session;
    if (controlType !== undefined) updateData.controlType = controlType;
    if (notes !== undefined) updateData.notes = notes;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Mettre à jour la note
    const updatedGrade = await prisma.grade.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
        subject: {
          select: {
            name: true,
            passingGrade: true,
          },
        },
        classAssignment: {
          include: {
            professeur: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    await createAuditLog({
      ...auditData,
      action: "GRADE_UPDATED",
      entity: "Grade",
      entityId: id,
      description: `Note mise à jour pour l'étudiant ${existingGrade.student.firstName} ${existingGrade.student.lastName}`,
      status: "SUCCESS",
      metadata: {
        oldGrade: existingGrade.grade,
        newGrade: updatedGrade.grade,
        changes: Object.keys(updateData),
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Note mise à jour avec succès",
      data: { grade: updatedGrade },
    };

    res.json(response);
  } catch (error: any) {
    console.error("GradeController - updateGrade error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADE_UPDATE_ERROR",
      entity: "Grade",
      description: "Erreur lors de la mise à jour de la note",
      status: "ERROR",
      errorMessage: error.message,
    });

    if (error.code === "P2025") {
      const response: ApiResponse = {
        success: false,
        message: "Note non trouvée",
        code: "GRADE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Supprime une note
 */
export const deleteGrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si la note existe
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        transcriptGrades: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!grade) {
      const response: ApiResponse = {
        success: false,
        message: "Note non trouvée",
        code: "GRADE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si la note est utilisée dans des transcripts
    if (grade.transcriptGrades.length > 0) {
      const response: ApiResponse = {
        success: false,
        message:
          "Cette note ne peut pas être supprimée car elle est utilisée dans des transcripts",
        code: "GRADE_HAS_DEPENDENCIES",
        data: {
          transcriptCount: grade.transcriptGrades.length,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Supprimer la note
    await prisma.grade.delete({
      where: { id },
    });

    await createAuditLog({
      ...auditData,
      action: "GRADE_DELETED",
      entity: "Grade",
      entityId: id,
      description: `Note supprimée pour l'étudiant ${grade.student.firstName} ${grade.student.lastName} en ${grade.subject.name}`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Note supprimée avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("GradeController - deleteGrade error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADE_DELETION_ERROR",
      entity: "Grade",
      description: "Erreur lors de la suppression de la note",
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
 * @desc Récupère les notes d'un étudiant spécifique
 */
export const getStudentGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;
    const { academicYearId, classLevel, controlType, session, subjectId } =
      req.query;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        email: true,
        schoolClass: {
          select: {
            name: true,
            level: true,
          },
        },
      },
    });

    if (!student) {
      const response: ApiResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Construction des filtres
    const where: any = { studentId };

    if (academicYearId) where.academicYearId = academicYearId;
    if (classLevel) where.classLevel = classLevel;
    if (controlType) where.controlType = controlType;
    if (session) where.session = session;
    if (subjectId) where.subjectId = subjectId;

    // Récupérer les notes de l'étudiant
    const grades = await prisma.grade.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            coefficient: true,
            type: true,
            passingGrade: true,
            maxGrade: true,
          },
        },
        classAssignment: {
          include: {
            professeur: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        academicYear: {
          select: {
            id: true,
            year: true,
            isCurrent: true,
          },
        },
      },
      orderBy: [
        { academicYearId: "desc" },
        { controlType: "asc" },
        { subject: { name: "asc" } },
      ],
    });

    // Calcul des statistiques par matière et par contrôle
    const statistics = {
      totalGrades: grades.length,
      averageGrade:
        grades.length > 0
          ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length
          : 0,
      subjectsSummary: {} as Record<string, any>,
      controlTypeSummary: {} as Record<string, any>,
    };

    // Organiser par matière
    grades.forEach((grade) => {
      const subjectName = grade.subject.name;
      const controlType = grade.controlType;

      // Statistiques par matière
      if (!statistics.subjectsSummary[subjectName]) {
        statistics.subjectsSummary[subjectName] = {
          subject: grade.subject,
          grades: [],
          average: 0,
          passed: 0,
          failed: 0,
          total: 0,
        };
      }

      statistics.subjectsSummary[subjectName].grades.push(grade);
      statistics.subjectsSummary[subjectName].total++;

      if (grade.grade >= grade.subject.passingGrade) {
        statistics.subjectsSummary[subjectName].passed++;
      } else {
        statistics.subjectsSummary[subjectName].failed++;
      }

      // Statistiques par type de contrôle
      if (!statistics.controlTypeSummary[controlType]) {
        statistics.controlTypeSummary[controlType] = {
          grades: [],
          average: 0,
          total: 0,
        };
      }

      statistics.controlTypeSummary[controlType].grades.push(grade);
      statistics.controlTypeSummary[controlType].total++;
    });

    // Calculer les moyennes
    Object.keys(statistics.subjectsSummary).forEach((subjectName) => {
      const subjectData = statistics.subjectsSummary[subjectName];
      subjectData.average =
        subjectData.grades.length > 0
          ? subjectData.grades.reduce(
              (sum: number, g: any) => sum + g.grade,
              0
            ) / subjectData.grades.length
          : 0;
    });

    Object.keys(statistics.controlTypeSummary).forEach((controlType) => {
      const controlData = statistics.controlTypeSummary[controlType];
      controlData.average =
        controlData.grades.length > 0
          ? controlData.grades.reduce(
              (sum: number, g: any) => sum + g.grade,
              0
            ) / controlData.grades.length
          : 0;
    });

    await createAuditLog({
      ...auditData,
      action: "STUDENT_GRADES_REQUEST",
      entity: "Grade",
      entityId: studentId,
      description: `Notes de l'étudiant ${student.firstName} ${student.lastName} récupérées`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Notes de l'étudiant récupérées avec succès",
      data: {
        student,
        grades,
        statistics,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("GradeController - getStudentGrades error:", error);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_GRADES_ERROR",
      entity: "Grade",
      description: "Erreur lors de la récupération des notes de l'étudiant",
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
 * @desc Importe des notes en masse
 */
export const bulkImportGrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { grades, academicYearId, assignmentId } = req.body;

    if (!Array.isArray(grades) || grades.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune donnée de note fournie",
        code: "NO_GRADES_DATA",
      };
      res.status(400).json(response);
      return;
    }

    if (!academicYearId) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique requise",
        code: "ACADEMIC_YEAR_REQUIRED",
      };
      res.status(400).json(response);
      return;
    }

    // Valider chaque note
    const validatedGrades = [];
    const errors = [];

    for (const [index, gradeData] of grades.entries()) {
      try {
        // Validation des données requises
        if (
          !gradeData.studentId ||
          !gradeData.subjectId ||
          gradeData.grade === undefined
        ) {
          errors.push({
            index,
            error: "Données requises manquantes",
            data: gradeData,
          });
          continue;
        }

        // Vérifier l'existence de l'étudiant et de la matière
        const [student, subject] = await Promise.all([
          prisma.student.findUnique({ where: { id: gradeData.studentId } }),
          prisma.subject.findUnique({ where: { id: gradeData.subjectId } }),
        ]);

        if (!student) {
          errors.push({
            index,
            error: "Étudiant non trouvé",
            data: gradeData,
          });
          continue;
        }

        if (!subject) {
          errors.push({
            index,
            error: "Matière non trouvée",
            data: gradeData,
          });
          continue;
        }

        // Vérifier la plage de la note
        const gradeNum = parseFloat(gradeData.grade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
          errors.push({
            index,
            error: "Note invalide (doit être entre 0 et 100)",
            data: gradeData,
          });
          continue;
        }

        validatedGrades.push({
          studentId: gradeData.studentId,
          subjectId: gradeData.subjectId,
          assignmentId: assignmentId || gradeData.assignmentId,
          grade: gradeNum,
          status: gradeData.status || "Valid_",
          session: gradeData.session || "Normale",
          controlType: gradeData.controlType || "CONTROLE_1",
          academicYearId,
          classLevel: gradeData.classLevel || "Sixieme",
          notes: gradeData.notes,
          isActive: true,
        });
      } catch (error: any) {
        errors.push({
          index,
          error: error.message,
          data: gradeData,
        });
      }
    }

    if (validatedGrades.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune note valide à importer",
        code: "NO_VALID_GRADES",
        data: { errors },
      };
      res.status(400).json(response);
      return;
    }

    // Importer les notes en utilisant createMany
    const result = await prisma.grade.createMany({
      data: validatedGrades,
      skipDuplicates: true, // Ignorer les doublons
    });

    await createAuditLog({
      ...auditData,
      action: "GRADES_BULK_IMPORT",
      entity: "Grade",
      description: `Importation en masse de ${result.count} notes`,
      status: "SUCCESS",
      metadata: {
        importedCount: result.count,
        totalAttempted: grades.length,
        errorCount: errors.length,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: `Importation réussie : ${result.count} notes importées`,
      data: {
        importedCount: result.count,
        errors,
        totalAttempted: grades.length,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("GradeController - bulkImportGrades error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADES_BULK_IMPORT_ERROR",
      entity: "Grade",
      description: "Erreur lors de l'importation en masse des notes",
      status: "ERROR",
      errorMessage: error.message,
    });

    const response: ApiResponse = {
      success: false,
      message: "Erreur lors de l'importation des notes",
      code: "BULK_IMPORT_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les statistiques des notes
 */
export const getGradeStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      academicYearId,
      classLevel,
      controlType,
      subjectId,
      startDate,
      endDate,
    } = req.query;

    // Construction des filtres
    const where: any = { isActive: true };

    if (academicYearId) where.academicYearId = academicYearId;
    if (classLevel) where.classLevel = classLevel;
    if (controlType) where.controlType = controlType;
    if (subjectId) where.subjectId = subjectId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    // Récupérer toutes les notes avec les données nécessaires
    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          select: {
            schoolClass: {
              select: {
                name: true,
                level: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
            passingGrade: true,
            coefficient: true,
            maxGrade: true,
          },
        },
        academicYear: {
          select: {
            year: true,
          },
        },
      },
    });

    if (grades.length === 0) {
      const response: ApiResponse = {
        success: true,
        message: "Aucune note trouvée pour les filtres spécifiés",
        data: {
          totalGrades: 0,
          statistics: {},
        },
      };
      res.json(response);
      return;
    }

    // Calculer les statistiques générales
    const totalGrades = grades.length;
    const totalPoints = grades.reduce((sum, grade) => sum + grade.grade, 0);
    const averageGrade = totalPoints / totalGrades;

    // Statistiques par statut
    const statusStats = {
      Valid_: grades.filter((g) => g.status === "Valid_").length,
      Non_valid_: grades.filter((g) => g.status === "Non_valid_").length,
      Reprendre: grades.filter((g) => g.status === "Reprendre").length,
    };

    // Statistiques par type de contrôle
    const controlTypeStats = {
      CONTROLE_1: grades.filter((g) => g.controlType === "CONTROLE_1").length,
      CONTROLE_2: grades.filter((g) => g.controlType === "CONTROLE_2").length,
      CONTROLE_3: grades.filter((g) => g.controlType === "CONTROLE_3").length,
      CONTROLE_4: grades.filter((g) => g.controlType === "CONTROLE_4").length,
    };

    // Statistiques par niveau de classe
    const classLevelStats: Record<string, number> = {};
    grades.forEach((grade) => {
      const level = grade.classLevel;
      classLevelStats[level] = (classLevelStats[level] || 0) + 1;
    });

    // Taux de réussite global
    const passedGrades = grades.filter(
      (g) => g.grade >= g.subject.passingGrade
    ).length;
    const successRate = (passedGrades / totalGrades) * 100;

    // Distribution des notes
    const gradeDistribution = {
      "0-39": grades.filter((g) => g.grade >= 0 && g.grade < 40).length,
      "40-59": grades.filter((g) => g.grade >= 40 && g.grade < 60).length,
      "60-69": grades.filter((g) => g.grade >= 60 && g.grade < 70).length,
      "70-79": grades.filter((g) => g.grade >= 70 && g.grade < 80).length,
      "80-89": grades.filter((g) => g.grade >= 80 && g.grade < 90).length,
      "90-100": grades.filter((g) => g.grade >= 90 && g.grade <= 100).length,
    };

    const statistics = {
      totalGrades,
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      passedGrades,
      failedGrades: totalGrades - passedGrades,
      statusStats,
      controlTypeStats,
      classLevelStats,
      gradeDistribution,
      byMonth: {} as Record<string, number>,
    };

    // Calculer par mois (si plus d'un mois de données)
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const monthDiff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth();

      if (monthDiff > 0) {
        grades.forEach((grade) => {
          const month = grade.createdAt.toISOString().slice(0, 7); // Format YYYY-MM
          statistics.byMonth[month] = (statistics.byMonth[month] || 0) + 1;
        });
      }
    }

    await createAuditLog({
      ...auditData,
      action: "GRADE_STATISTICS_REQUEST",
      entity: "Grade",
      description: "Statistiques des notes récupérées",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Statistiques récupérées avec succès",
      data: { statistics },
    };

    res.json(response);
  } catch (error: any) {
    console.error("GradeController - getGradeStatistics error:", error);

    await createAuditLog({
      ...auditData,
      action: "GRADE_STATISTICS_ERROR",
      entity: "Grade",
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
