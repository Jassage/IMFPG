/**
 * @file enrollmentHelpers.ts
 * @description Fonctions utilitaires pour la gestion des réinscriptions
 * @version 1.0.0
 */

import { ClassLevel, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

/**
 * Détermine le niveau suivant en fonction du niveau actuel
 */
export function getNextLevel(currentLevel: ClassLevel): ClassLevel {
  const levelHierarchy: Record<ClassLevel, ClassLevel | null> = {
    [ClassLevel.Sixieme]: ClassLevel.Cinquieme,
    [ClassLevel.Cinquieme]: ClassLevel.Quatrieme,
    [ClassLevel.Quatrieme]: ClassLevel.Troisieme,
    [ClassLevel.Troisieme]: ClassLevel.Seconde,
    [ClassLevel.Seconde]: ClassLevel.Premiere,
    [ClassLevel.Premiere]: ClassLevel.Terminale,
    [ClassLevel.Terminale]: ClassLevel.NSI,
    [ClassLevel.NSI]: ClassLevel.NSII,
    [ClassLevel.NSII]: ClassLevel.NSIII,
    [ClassLevel.NSIII]: ClassLevel.NSIV,
    [ClassLevel.NSIV]: ClassLevel.NSIV, // Dernier niveau, reste le même
  };

  return levelHierarchy[currentLevel] || currentLevel;
}

/**
 * Détermine si l'étudiant peut être promu
 */
export async function canStudentBePromoted(
  studentId: string,
  academicYearId: string
): Promise<{ canPromote: boolean; average: number; reason?: string }> {
  try {
    // Récupérer toutes les notes de l'étudiant pour l'année
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        academicYearId,
        isActive: true,
      },
      select: {
        grade: true,
        subject: {
          select: {
            coefficient: true,
          },
        },
      },
    });

    if (grades.length === 0) {
      return {
        canPromote: true, // Par défaut, on permet la promotion
        average: 0,
        reason: "Aucune note disponible, promotion par défaut",
      };
    }

    // Calculer la moyenne pondérée
    let totalPoints = 0;
    let totalCoefficients = 0;

    for (const grade of grades) {
      const coefficient = grade.subject.coefficient || 1;
      totalPoints += grade.grade * coefficient;
      totalCoefficients += coefficient;
    }

    const average = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;

    // Seuil de promotion (50/100 par défaut)
    const passingThreshold = 50;
    const canPromote = average >= passingThreshold;

    return {
      canPromote,
      average: Math.round(average * 100) / 100,
      reason: canPromote
        ? `Moyenne de ${average.toFixed(2)}/100 atteinte`
        : `Moyenne de ${average.toFixed(2)}/100 insuffisante (minimum ${passingThreshold})`,
    };
  } catch (error) {
    console.error("Erreur vérification promotion:", error);
    return {
      canPromote: false,
      average: 0,
      reason: "Erreur lors du calcul des notes",
    };
  }
}

/**
 * Détermine la classe suivante pour l'étudiant
 */
export async function determineNextClass(
  studentId: string,
  previousClassId: string,
  academicYearId: string
): Promise<{
  nextClassId: string;
  className: string;
  level: ClassLevel;
  promotionStatus: "Promotion" | "Rétention" | "Redoublement";
  reason: string;
}> {
  try {
    // Récupérer la classe précédente
    const previousClass = await prisma.schoolClass.findUnique({
      where: { id: previousClassId },
      select: {
        id: true,
        name: true,
        level: true,
        capacity: true,
      },
    });

    if (!previousClass) {
      throw new Error("Classe précédente non trouvée");
    }

    // Vérifier si l'étudiant peut être promu
    const promotionResult = await canStudentBePromoted(
      studentId,
      academicYearId
    );

    let nextClassId = previousClassId;
    let promotionStatus: "Promotion" | "Rétention" | "Redoublement" =
      "Rétention";
    let reason = promotionResult.reason || "";

    if (promotionResult.canPromote) {
      // Promotion : chercher la classe du niveau suivant
      const nextLevel = getNextLevel(previousClass.level);

      const nextClass = await prisma.schoolClass.findFirst({
        where: {
          level: nextLevel,
          status: "Active",
        },
        select: {
          id: true,
          name: true,
          level: true,
          capacity: true,
        },
      });

      if (nextClass && nextClass.id !== previousClassId) {
        nextClassId = nextClass.id;
        promotionStatus = "Promotion";
        reason = `Promotion de ${previousClass.level} à ${nextClass.level}`;
      } else {
        promotionStatus = "Rétention";
        reason = `Aucune classe disponible au niveau supérieur (${nextLevel})`;
      }
    } else {
      // Rétention/Redoublement : reste dans la même classe
      promotionStatus = "Redoublement";
      reason = `Résultats insuffisants (moyenne: ${promotionResult.average})`;
    }

    // Récupérer les infos de la classe suivante
    const nextClass = await prisma.schoolClass.findUnique({
      where: { id: nextClassId },
      select: {
        id: true,
        name: true,
        level: true,
      },
    });

    return {
      nextClassId,
      className: nextClass?.name || previousClass.name,
      level: nextClass?.level || previousClass.level,
      promotionStatus,
      reason,
    };
  } catch (error) {
    console.error("Erreur détermination classe suivante:", error);
    return {
      nextClassId: previousClassId,
      className: "Classe non déterminée",
      level: ClassLevel.Sixieme,
      promotionStatus: "Rétention",
      reason: "Erreur lors de la détermination",
    };
  }
}

/**
 * Valide un étudiant pour la réinscription
 */
export async function validateStudentForReenrollment(
  studentId: string
): Promise<{
  eligible: boolean;
  validation: any;
  suggestedNextClass?: any;
}> {
  try {
    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        status: true,
      },
    });

    if (!student) {
      return {
        eligible: false,
        validation: {
          error: "Étudiant non trouvé",
          code: "STUDENT_NOT_FOUND",
        },
      };
    }

    // Récupérer l'année académique actuelle
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentYear) {
      return {
        eligible: false,
        validation: {
          error: "Aucune année académique courante",
          code: "NO_CURRENT_YEAR",
        },
      };
    }

    // Vérifier si l'étudiant est déjà inscrit pour l'année courante
    const currentEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_academicYearId: {
          studentId,
          academicYearId: currentYear.id,
        },
      },
      include: {
        schoolClass: true,
      },
    });

    if (currentEnrollment) {
      return {
        eligible: false,
        validation: {
          error: "L'étudiant est déjà inscrit pour cette année",
          code: "ALREADY_ENROLLED",
          currentClass: currentEnrollment.schoolClass.name,
        },
      };
    }

    // Récupérer la dernière inscription
    const lastEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        status: { in: ["Active", "Completed"] },
      },
      include: {
        schoolClass: true,
        academicYear: true,
      },
      orderBy: {
        enrollmentDate: "desc",
      },
    });

    if (!lastEnrollment) {
      return {
        eligible: false,
        validation: {
          error: "Aucune inscription précédente trouvée",
          code: "NO_PREVIOUS_ENROLLMENT",
        },
      };
    }

    // Vérifier les résultats académiques
    const promotionResult = await canStudentBePromoted(
      studentId,
      lastEnrollment.academicYearId
    );

    // Vérifier la situation financière
    const studentFees = await prisma.studentFee.findMany({
      where: {
        studentId,
        academicYearId: lastEnrollment.academicYearId,
      },
      select: {
        totalAmount: true,
        paidAmount: true,
        dueDate: true,
        status: true,
      },
    });

    const totalDue = studentFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const totalPaid = studentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const balance = totalDue - totalPaid;

    // Vérifier les frais en retard
    const today = new Date();
    const overdueFees = studentFees.filter(
      (fee) => fee.dueDate < today && fee.totalAmount > fee.paidAmount
    );

    // Déterminer l'éligibilité
    const academicEligible = promotionResult.canPromote;
    const financialEligible = balance <= 0;
    const noOverdueFees = overdueFees.length === 0;

    const eligible = academicEligible && financialEligible && noOverdueFees;

    // Déterminer la classe suivante
    const nextClass = await determineNextClass(
      studentId,
      lastEnrollment.classId,
      lastEnrollment.academicYearId
    );

    const validation = {
      eligible,
      details: {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentCode: student.studentCode,
        },
        lastEnrollment: {
          id: lastEnrollment.id,
          className: lastEnrollment.schoolClass.name,
          classLevel: lastEnrollment.schoolClass.level,
          academicYear: lastEnrollment.academicYear.year,
          enrollmentDate: lastEnrollment.enrollmentDate,
        },
        academic: {
          average: promotionResult.average,
          canPromote: promotionResult.canPromote,
          reason: promotionResult.reason,
        },
        financial: {
          totalDue,
          totalPaid,
          balance,
          hasBalance: balance > 0,
          overdueFees: overdueFees.length,
          overdueAmount: overdueFees.reduce(
            (sum, fee) => sum + (fee.totalAmount - fee.paidAmount),
            0
          ),
        },
        eligibility: {
          academicEligible,
          financialEligible,
          noOverdueFees,
        },
      },
      nextClass,
    };

    return {
      eligible,
      validation,
      suggestedNextClass: nextClass,
    };
  } catch (error) {
    console.error("Erreur validation réinscription:", error);
    return {
      eligible: false,
      validation: {
        error: "Erreur lors de la validation",
        code: "VALIDATION_ERROR",
        details: error,
      },
    };
  }
}
