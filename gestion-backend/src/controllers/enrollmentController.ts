/**
 * @file enrollmentController.ts
 * @description Contrôleurs pour la gestion des inscriptions
 * @version 1.0.0
 */
/**
 * @file enrollmentController.ts
 * @description Contrôleurs pour la gestion des inscriptions
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient, Prisma } from "../../generated/prisma";
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
 * @desc Récupère la liste des inscriptions
 */
export const getEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      academicYearId,
      classId,
      studentId,
      status,
      search,
      sortBy = "enrollmentDate",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Filtres
    const where: any = {};

    if (academicYearId) {
      where.academicYearId = academicYearId;
    }

    if (classId) {
      where.classId = classId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    // Recherche par nom d'étudiant
    if (search) {
      where.student = {
        OR: [
          { firstName: { contains: search as string, mode: "insensitive" } },
          { lastName: { contains: search as string, mode: "insensitive" } },
          { studentCode: { contains: search as string, mode: "insensitive" } },
        ],
      };
    }

    // Récupération avec pagination
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
              photo: true,
            },
          },
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
              capacity: true,
            },
          },
          academicYear: true,
        },
        orderBy: {
          [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.enrollment.count({ where }),
    ]);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENTS_LIST_REQUEST",
      entity: "Enrollment",
      description: "Liste des inscriptions récupérée",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Inscriptions récupérées avec succès",
      data: {
        enrollments,
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
    console.error("❌ EnrollmentController - getEnrollments error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENTS_LIST_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération des inscriptions",
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
 * @desc Récupère une inscription par ID
 */
export const getEnrollmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
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
            photo: true,
          },
        },
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
            capacity: true,
          },
        },
        academicYear: true,
        previousEnrollment: {
          include: {
            schoolClass: true,
            academicYear: true,
          },
        },
        nextEnrollments: {
          include: {
            schoolClass: true,
            academicYear: true,
          },
          orderBy: {
            enrollmentDate: "desc",
          },
        },
      },
    });

    if (!enrollment) {
      const response: ApiResponse = {
        success: false,
        message: "Inscription non trouvée",
        code: "ENROLLMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DETAILS_REQUEST",
      entity: "Enrollment",
      entityId: id,
      description: "Détails de l'inscription récupérés",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Inscription récupérée avec succès",
      data: { enrollment },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - getEnrollmentById error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_DETAILS_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération de l'inscription",
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
 * @desc Crée une nouvelle inscription avec option d'attribution de frais
 */
export const createEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      studentId,
      classId,
      academicYearId,
      enrollmentDate,
      assignFees = false,
      selectedFeeStructures = [],
    } = req.body;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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

    // Vérifier si la classe existe
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
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

    // Vérifier si l'année académique existe
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique non trouvée",
        code: "ACADEMIC_YEAR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'étudiant est déjà inscrit pour cette année
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_academicYearId: {
          studentId,
          academicYearId,
        },
      },
    });

    if (existingEnrollment) {
      const response: ApiResponse = {
        success: false,
        message: "Cet étudiant est déjà inscrit pour cette année académique",
        code: "ENROLLMENT_EXISTS",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier la capacité de la classe
    const currentEnrollments = await prisma.enrollment.count({
      where: {
        classId,
        academicYearId,
        status: "Active",
      },
    });

    if (currentEnrollments >= (schoolClass.capacity || 30)) {
      const response: ApiResponse = {
        success: false,
        message: "La classe a atteint sa capacité maximale",
        code: "CLASS_FULL",
        data: {
          capacity: schoolClass.capacity,
          current: currentEnrollments,
        },
      };
      res.status(400).json(response);
      return;
    }

    // Créer l'inscription
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        classId,
        academicYearId,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
        status: "Active",
        isReenrollment: false,
      },
      include: {
        student: true,
        schoolClass: true,
        academicYear: true,
      },
    });

    // Mettre à jour la classe de l'étudiant
    await prisma.student.update({
      where: { id: studentId },
      data: {
        classId,
        status: "Active",
      },
    });

    // Gérer l'attribution des frais
    let feeAssignmentResult = null;
    if (assignFees) {
      feeAssignmentResult = await assignFeesOnEnrollment(
        studentId,
        academicYearId,
        selectedFeeStructures
      );
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_CREATED",
      entity: "Enrollment",
      entityId: enrollment.id,
      description: `Inscription de ${student.firstName} ${student.lastName} créée`,
      status: "SUCCESS",
      metadata: {
        studentId,
        classId,
        academicYearId,
        studentCode: student.studentCode,
        className: schoolClass.name,
        feesAssigned: assignFees,
        feeStructures: selectedFeeStructures.length,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Inscription créée avec succès",
      data: {
        enrollment,
        ...(feeAssignmentResult && { feeAssignment: feeAssignmentResult }),
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - createEnrollment error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_CREATION_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la création de l'inscription",
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
 * @desc Met à jour une inscription
 */
export const updateEnrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { classId, status } = req.body;

    // Vérifier si l'inscription existe
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!enrollment) {
      const response: ApiResponse = {
        success: false,
        message: "Inscription non trouvée",
        code: "ENROLLMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si la nouvelle classe existe (si changement)
    if (classId && classId !== enrollment.classId) {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        const response: ApiResponse = {
          success: false,
          message: "Nouvelle classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }
    }

    // Mettre à jour
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        ...(classId && { classId }),
        ...(status && { status }),
      },
      include: {
        student: true,
        schoolClass: true,
        academicYear: true,
      },
    });

    // Mettre à jour la classe de l'étudiant si nécessaire
    if (classId && classId !== enrollment.classId) {
      await prisma.student.update({
        where: { id: enrollment.studentId },
        data: {
          classId,
        },
      });
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_UPDATED",
      entity: "Enrollment",
      entityId: id,
      description: `Inscription de ${enrollment.student.firstName} ${enrollment.student.lastName} mise à jour`,
      status: "SUCCESS",
      metadata: {
        oldStatus: enrollment.status,
        newStatus: status,
        oldClassId: enrollment.classId,
        newClassId: classId,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Inscription mise à jour avec succès",
      data: { enrollment: updatedEnrollment },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - updateEnrollment error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_UPDATE_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la mise à jour de l'inscription",
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
 * @desc Désinscrit un étudiant
 */
export const unenrollStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Vérifier si l'inscription existe
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!enrollment) {
      const response: ApiResponse = {
        success: false,
        message: "Inscription non trouvée",
        code: "ENROLLMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Désinscrire
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status: "Suspended",
      },
    });

    // Mettre à jour le statut de l'étudiant
    await prisma.student.update({
      where: { id: enrollment.studentId },
      data: {
        status: "Inactive",
      },
    });

    await createAuditLog({
      ...auditData,
      action: "STUDENT_UNENROLLED",
      entity: "Enrollment",
      entityId: id,
      description: `Étudiant ${enrollment.student.firstName} ${enrollment.student.lastName} désinscrit`,
      status: "SUCCESS",
      metadata: {
        studentCode: enrollment.student.studentCode,
        reason,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Étudiant désinscrit avec succès",
      data: { enrollment: updatedEnrollment },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - unenrollStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_UNENROLL_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la désinscription de l'étudiant",
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
 * @desc Gère la réinscription d'un étudiant
 */
export const reenrollStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId, classId, academicYearId, enrollmentDate, notes } =
      req.body;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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

    // Récupérer l'année précédente
    const previousYear = await prisma.academicYear.findFirst({
      where: {
        isCurrent: false,
      },
      orderBy: {
        startDate: "desc",
      },
      take: 1,
    });

    if (!previousYear) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune année académique précédente trouvée",
        code: "NO_PREVIOUS_YEAR",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier l'inscription précédente
    const previousEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_academicYearId: {
          studentId,
          academicYearId: previousYear.id,
        },
      },
    });

    if (!previousEnrollment) {
      const response: ApiResponse = {
        success: false,
        message: "L'étudiant n'était pas inscrit l'année précédente",
        code: "NO_PREVIOUS_ENROLLMENT",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier l'année académique cible
    const targetYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!targetYear) {
      const response: ApiResponse = {
        success: false,
        message: "Année académique cible non trouvée",
        code: "TARGET_YEAR_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'étudiant est déjà inscrit pour cette année
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_academicYearId: {
          studentId,
          academicYearId: targetYear.id,
        },
      },
    });

    if (existingEnrollment) {
      const response: ApiResponse = {
        success: false,
        message: "L'étudiant est déjà inscrit pour cette année",
        code: "ALREADY_ENROLLED",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier si la classe existe
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
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

    // Vérifier la capacité de la classe
    const currentEnrollments = await prisma.enrollment.count({
      where: {
        classId,
        academicYearId: targetYear.id,
        status: "Active",
      },
    });

    if (currentEnrollments >= (schoolClass.capacity || 30)) {
      const response: ApiResponse = {
        success: false,
        message: "La classe a atteint sa capacité maximale",
        code: "CLASS_FULL",
      };
      res.status(400).json(response);
      return;
    }

    // Calculer les frais de réinscription
    const reenrollmentFee = await calculateReenrollmentFee(
      studentId,
      previousYear.id,
      targetYear.id
    );

    // Créer la réinscription
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        classId,
        academicYearId: targetYear.id,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
        status: "Active",
        isReenrollment: true,
        previousEnrollmentId: previousEnrollment.id,
        reenrollmentDate: new Date(),
        reenrollmentNotes: notes,
      },
      include: {
        student: true,
        schoolClass: true,
        academicYear: true,
        previousEnrollment: true,
      },
    });

    // Mettre à jour la classe de l'étudiant
    await prisma.student.update({
      where: { id: studentId },
      data: {
        classId,
        status: "Active",
      },
    });

    // Créer un paiement pour les frais de réinscription
    await prisma.payment.create({
      data: {
        studentId,
        amount: reenrollmentFee.amount,
        paidDate: new Date(),
        paymentMethod: "Bank",
        status: "Pending",
        description: `Frais de réinscription - ${targetYear.year}`,
        type: "Tuition",
        academicYearId: targetYear.id,
      },
    });

    // Mettre à jour l'inscription précédente pour référencer la nouvelle
    await prisma.enrollment.update({
      where: { id: previousEnrollment.id },
      data: {
        nextEnrollments: {
          connect: { id: enrollment.id },
        },
      },
    });

    // Créer les frais de scolarité pour la nouvelle année
    await createStudentFees(studentId, targetYear.id);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_REENROLLED",
      entity: "Enrollment",
      entityId: enrollment.id,
      description: `Réinscription de ${student.firstName} ${student.lastName}`,
      status: "SUCCESS",
      metadata: {
        studentId,
        classId,
        academicYearId: targetYear.id,
        reenrollmentFee: reenrollmentFee.amount,
        notes,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Étudiant réinscrit avec succès",
      data: {
        enrollment,
        reenrollmentFee,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - reenrollStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: "STUDENT_REENROLL_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la réinscription de l'étudiant",
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
 * @desc Valide un étudiant pour la réinscription
 */
export const validateReenrollment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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

    // Récupérer l'année précédente
    const previousYear = await prisma.academicYear.findFirst({
      where: {
        isCurrent: false,
      },
      orderBy: {
        startDate: "desc",
      },
      take: 1,
    });

    if (!previousYear) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune année académique précédente trouvée",
        code: "NO_PREVIOUS_YEAR",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier l'inscription précédente
    const previousEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_academicYearId: {
          studentId,
          academicYearId: previousYear.id,
        },
      },
      include: {
        schoolClass: true,
      },
    });

    if (!previousEnrollment) {
      const response: ApiResponse = {
        success: false,
        message: "L'étudiant n'était pas inscrit l'année précédente",
        code: "NO_PREVIOUS_ENROLLMENT",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier les résultats académiques
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        academicYearId: previousYear.id,
      },
      include: {
        subject: true,
      },
    });

    // Vérifier si l'étudiant a validé son année
    const passed = validateAcademicResults(grades);

    // Vérifier les paiements
    const payments = await prisma.payment.findMany({
      where: {
        studentId,
        academicYearId: previousYear.id,
      },
    });

    const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const balance = totalDue - totalPaid;

    // Vérifier l'assiduité (à implémenter si vous avez un modèle d'assiduité)
    // const attendance = await prisma.attendance.findMany({
    //   where: {
    //     studentId,
    //     academicYearId: previousYear.id,
    //   },
    // });

    // const attendanceRate = calculateAttendanceRate(attendance);
    const attendanceRate = 1.0; // Temporaire

    const validation = {
      canReenroll: passed && balance <= 0 && attendanceRate >= 0.75,
      academicStatus: passed ? "Passed" : "Failed",
      financialStatus: balance <= 0 ? "Clear" : "BalanceDue",
      attendanceStatus:
        attendanceRate >= 0.75 ? "Satisfactory" : "Unsatisfactory",
      details: {
        grades,
        payments,
        balance,
        attendanceRate,
        previousClass: previousEnrollment.schoolClass.name,
      },
    };

    await createAuditLog({
      ...auditData,
      action: "REENROLLMENT_VALIDATION",
      entity: "Enrollment",
      description: `Validation de réinscription pour ${student.firstName} ${student.lastName}`,
      status: "SUCCESS",
      metadata: { studentId, validation },
    });

    const response: ApiResponse = {
      success: true,
      message: "Validation de réinscription terminée",
      data: { validation },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ EnrollmentController - validateReenrollment error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "REENROLLMENT_VALIDATION_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la validation de réinscription",
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
 * @desc Récupère les inscriptions d'un étudiant
 */
export const getStudentEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        academicYear: true,
      },
      orderBy: {
        enrollmentDate: "desc",
      },
    });

    await createAuditLog({
      ...auditData,
      action: "STUDENT_ENROLLMENTS_REQUEST",
      entity: "Enrollment",
      description: "Historique des inscriptions récupéré",
      status: "SUCCESS",
      metadata: { studentId },
    });

    const response: ApiResponse = {
      success: true,
      message: "Historique des inscriptions récupéré",
      data: { enrollments },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ EnrollmentController - getStudentEnrollments error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "STUDENT_ENROLLMENTS_ERROR",
      entity: "Enrollment",
      description:
        "Erreur lors de la récupération de l'historique des inscriptions",
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
 * @desc Récupère les statistiques d'inscription
 */
export const getEnrollmentStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { academicYearId } = req.query;

    const where: any = {};
    if (academicYearId) {
      where.academicYearId = academicYearId as string;
    }

    // Statistiques par classe
    const classStats = await prisma.enrollment.groupBy({
      by: ["classId"],
      where,
      _count: {
        id: true,
      },
    });

    // Statistiques par statut
    const statusStats = await prisma.enrollment.groupBy({
      by: ["status"],
      where,
      _count: {
        id: true,
      },
    });

    // Total d'inscriptions
    const total = await prisma.enrollment.count({ where });

    // Inscriptions ce mois-ci
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonth = await prisma.enrollment.count({
      where: {
        ...where,
        enrollmentDate: {
          gte: startOfMonth,
        },
      },
    });

    // Tendances (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendQuery = academicYearId
      ? Prisma.sql`
          SELECT 
            DATE(enrollmentDate) as date,
            COUNT(*) as count
          FROM enrollments
          WHERE enrollmentDate >= ${thirtyDaysAgo}
          AND academicYearId = ${academicYearId}
          GROUP BY DATE(enrollmentDate)
          ORDER BY date
        `
      : Prisma.sql`
          SELECT 
            DATE(enrollmentDate) as date,
            COUNT(*) as count
          FROM enrollments
          WHERE enrollmentDate >= ${thirtyDaysAgo}
          GROUP BY DATE(enrollmentDate)
          ORDER BY date
        `;

    const trendData = await prisma.$queryRaw(trendQuery);

    const stats = {
      total,
      thisMonth,
      byClass: classStats.map((stat) => ({
        classId: stat.classId,
        count: stat._count.id,
      })),
      byStatus: statusStats.reduce((acc: Record<string, number>, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      }, {}),
      trends: trendData,
    };

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_STATS_REQUEST",
      entity: "Enrollment",
      description: "Statistiques d'inscription récupérées",
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Statistiques récupérées",
      data: { stats },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ EnrollmentController - getEnrollmentStats error:", error);

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_STATS_ERROR",
      entity: "Enrollment",
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

/**
 * @desc Crée des inscriptions en masse
 */
export const createBulkEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { enrollments } = req.body;

    if (!Array.isArray(enrollments) || enrollments.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune donnée d'inscription fournie",
        code: "NO_DATA",
      };
      res.status(400).json(response);
      return;
    }

    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    // Traiter chaque inscription
    for (const enrollmentData of enrollments) {
      try {
        const { studentId, classId, academicYearId, enrollmentDate } =
          enrollmentData;

        // Vérifications
        const student = await prisma.student.findUnique({
          where: { id: studentId },
        });

        if (!student) {
          results.failed.push({
            studentId,
            error: "Étudiant non trouvé",
          });
          continue;
        }

        const schoolClass = await prisma.schoolClass.findUnique({
          where: { id: classId },
        });

        if (!schoolClass) {
          results.failed.push({
            studentId,
            error: "Classe non trouvée",
          });
          continue;
        }

        // Vérifier si déjà inscrit
        const existing = await prisma.enrollment.findUnique({
          where: {
            studentId_academicYearId: {
              studentId,
              academicYearId,
            },
          },
        });

        if (existing) {
          results.failed.push({
            studentId,
            error: "Déjà inscrit",
          });
          continue;
        }

        // Créer l'inscription
        const enrollment = await prisma.enrollment.create({
          data: {
            studentId,
            classId,
            academicYearId,
            enrollmentDate: enrollmentDate
              ? new Date(enrollmentDate)
              : new Date(),
            status: "Active",
            isReenrollment: false,
          },
          include: {
            student: true,
            schoolClass: true,
          },
        });

        // Mettre à jour la classe de l'étudiant
        await prisma.student.update({
          where: { id: studentId },
          data: { classId },
        });

        // Créer les frais de scolarité
        await createStudentFees(studentId, academicYearId);

        results.success.push(enrollment);
      } catch (error: any) {
        results.failed.push({
          studentId: enrollmentData.studentId,
          error: error.message,
        });
      }
    }

    await createAuditLog({
      ...auditData,
      action: "BULK_ENROLLMENTS_CREATED",
      entity: "Enrollment",
      description: `Inscriptions en masse: ${results.success.length} réussies, ${results.failed.length} échouées`,
      status: "SUCCESS",
      metadata: {
        total: enrollments.length,
        successCount: results.success.length,
        failedCount: results.failed.length,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Inscriptions en masse terminées",
      data: { results },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error(
      "❌ EnrollmentController - createBulkEnrollments error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "BULK_ENROLLMENTS_ERROR",
      entity: "Enrollment",
      description: "Erreur lors des inscriptions en masse",
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

// ==================== FONCTIONS UTILITAIRES ====================

// Fonction pour calculer les frais de réinscription
const calculateReenrollmentFee = async (
  studentId: string,
  previousYearId: string,
  currentYearId: string
): Promise<{ amount: number; details: any }> => {
  try {
    // Récupérer les paiements de l'année précédente
    const previousPayments = await prisma.payment.findMany({
      where: {
        studentId,
        academicYearId: previousYearId,
      },
    });

    // Calculer le solde de l'année précédente
    const totalPaid = previousPayments
      .filter((p) => p.status === "Paid")
      .reduce((sum, payment) => sum + payment.amount, 0);

    const totalDue = previousPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const previousBalance = totalDue - totalPaid;

    // Récupérer les frais de réinscription standard
    const reenrollmentFeeStructure = await prisma.feeStructure.findFirst({
      where: {
        name: { contains: "réinscription" },
        isActive: true,
      },
    });

    const baseFee = reenrollmentFeeStructure?.amount || 10000; // Frais par défaut

    // Calculer le total (solde précédent + frais de réinscription)
    const totalFee = baseFee + previousBalance;

    return {
      amount: totalFee,
      details: {
        baseFee,
        previousBalance,
        totalFee,
      },
    };
  } catch (error) {
    console.error("Error calculating reenrollment fee:", error);
    return {
      amount: 10000,
      details: { baseFee: 10000, previousBalance: 0, totalFee: 10000 },
    };
  }
};

// Fonction pour créer les frais de scolarité
const createStudentFees = async (
  studentId: string,
  academicYearId: string
): Promise<void> => {
  try {
    // Récupérer les structures de frais actives
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        isActive: true,
      },
    });

    // Créer les frais pour l'étudiant
    for (const feeStructure of feeStructures) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 3); // 3 mois après l'inscription

      await prisma.studentFee.create({
        data: {
          studentId,
          feeStructureId: feeStructure.id,
          academicYearId,
          totalAmount: feeStructure.amount,
          paidAmount: 0,
          status: "pending",
          dueDate,
        },
      });
    }
  } catch (error) {
    console.error("Error creating student fees:", error);
  }
};

// Fonctions utilitaires pour la validation
const validateAcademicResults = (grades: any[]): boolean => {
  if (grades.length === 0) return false;

  const average =
    grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
  return average >= 50; // Note moyenne minimale de 50
};

const calculateAttendanceRate = (attendance: any[]): number => {
  if (attendance.length === 0) return 0;

  const present = attendance.filter((a) => a.status === "Present").length;
  return present / attendance.length;
};

// Export des fonctions utilitaires si besoin
export {
  calculateReenrollmentFee,
  createStudentFees,
  validateAcademicResults,
  calculateAttendanceRate,
};

/**
 * @desc Récupère l'historique complet des inscriptions d'un étudiant
 */
export const getEnrollmentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { studentId } = req.params;

    // Récupérer toutes les inscriptions de l'étudiant triées par date
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        academicYear: true,
        previousEnrollment: {
          select: {
            id: true,
            enrollmentDate: true,
            schoolClass: {
              select: {
                name: true,
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrollmentDate: "asc",
      },
    });

    // Construire une chaîne d'inscriptions
    const history = [];
    const enrollmentMap = new Map();

    // Créer un mapping par ID
    enrollments.forEach((enrollment) => {
      enrollmentMap.set(enrollment.id, { ...enrollment, next: null });
    });

    // Construire la chaîne
    enrollments.forEach((enrollment) => {
      if (enrollment.previousEnrollmentId) {
        const previous = enrollmentMap.get(enrollment.previousEnrollmentId);
        if (previous) {
          previous.next = enrollment;
        }
      }
    });

    // Trouver la première inscription (celle sans prédécesseur)
    const firstEnrollment = enrollments.find((e) => !e.previousEnrollmentId);

    // Parcourir la chaîne
    let current = firstEnrollment;
    while (current) {
      history.push({
        id: current.id,
        enrollmentDate: current.enrollmentDate,
        academicYear: current.academicYear.year,
        className: current.schoolClass.name,
        classLevel: current.schoolClass.level,
        status: current.status,
        isReenrollment: current.isReenrollment,
      });

      // Trouver la prochaine inscription dans la chaîne
      const next = enrollments.find(
        (e) => e.previousEnrollmentId === current?.id
      );
      current = next;
    }

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_HISTORY_REQUEST",
      entity: "Enrollment",
      description: "Historique des inscriptions récupéré",
      status: "SUCCESS",
      metadata: { studentId },
    });

    const response: ApiResponse = {
      success: true,
      message: "Historique des inscriptions récupéré",
      data: {
        history,
        total: history.length,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ EnrollmentController - getEnrollmentHistory error:",
      error
    );

    await createAuditLog({
      ...auditData,
      action: "ENROLLMENT_HISTORY_ERROR",
      entity: "Enrollment",
      description: "Erreur lors de la récupération de l'historique",
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
 * @desc Attribue des frais à un étudiant lors de l'inscription
 * @private
 */
const assignFeesOnEnrollment = async (
  studentId: string,
  academicYearId: string,
  feeStructureIds: string[] = []
): Promise<{ success: boolean; message: string; assignedFees: any[] }> => {
  try {
    const assignedFees = [];

    // Si aucun frais spécifié, on attribue les frais actifs par défaut
    if (feeStructureIds.length === 0) {
      const feeStructures = await prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },
      });

      feeStructureIds = feeStructures.map((fee) => fee.id);
    }

    // Pour chaque structure de frais, créer une entrée StudentFee
    for (const feeStructureId of feeStructureIds) {
      const feeStructure = await prisma.feeStructure.findUnique({
        where: { id: feeStructureId },
      });

      if (!feeStructure) {
        console.warn(`Structure de frais ${feeStructureId} non trouvée`);
        continue;
      }

      // Vérifier si l'étudiant a déjà ces frais pour cette année
      const existingFee = await prisma.studentFee.findFirst({
        where: {
          studentId,
          feeStructureId,
          academicYearId,
        },
      });

      if (existingFee) {
        console.log(`L'étudiant a déjà ces frais: ${feeStructure.name}`);
        continue;
      }

      // Créer les frais avec une date d'échéance à 3 mois
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 3);

      const studentFee = await prisma.studentFee.create({
        data: {
          studentId,
          feeStructureId,
          academicYearId,
          totalAmount: feeStructure.amount,
          paidAmount: 0,
          status: "pending",
          dueDate,
        },
        include: {
          feeStructure: {
            select: {
              name: true,
              amount: true,
              description: true,
            },
          },
        },
      });

      assignedFees.push({
        id: studentFee.id,
        name: studentFee.feeStructure.name,
        amount: studentFee.totalAmount,
        dueDate: studentFee.dueDate,
        status: studentFee.status,
      });

      console.log(` Frais attribués: ${feeStructure.name}`);
    }

    return {
      success: true,
      message:
        assignedFees.length > 0
          ? `${assignedFees.length} frais attribués`
          : "Aucun nouveau frais attribué",
      assignedFees,
    };
  } catch (error) {
    console.error(" Erreur attribution frais:", error);
    return {
      success: false,
      message: "Erreur lors de l'attribution des frais",
      assignedFees: [],
    };
  }
};

/**
 * @desc Récupère les structures de frais disponibles
 */
export const getAvailableFeeStructures = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        description: true,
        academicYear: true,
        _count: {
          select: {
            studentFees: true,
          },
        },
      },
      orderBy: {
        academicYear: "desc",
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Structures de frais disponibles",
      data: { feeStructures },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ Erreur récupération structures de frais:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur lors de la récupération des structures de frais",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};
