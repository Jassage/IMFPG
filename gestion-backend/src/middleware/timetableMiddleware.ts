// Fichier: src/middleware/timetableMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { TimetableControllerResponse } from "../types/timetableTypes";

const prisma = new PrismaClient();

/**
 * Vérifie si l'utilisateur peut accéder à l'emploi du temps d'une classe
 */
export const canAccessClassTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "Utilisateur non authentifié",
        code: "UNAUTHORIZED",
      };
      res.status(401).json(response);
      return;
    }

    // Vérifier si la classe existe
    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
    });

    if (!schoolClass) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Admin, Staff et Professeurs ont toujours accès
    if (["Admin", "Staff", "Professeur"].includes(userRole || "")) {
      next();
      return;
    }

    // Étudiant: vérifier s'il est dans cette classe
    if (userRole === "Student") {
      const student = await prisma.student.findFirst({
        where: {
          userId,
          classId,
        },
      });

      if (student) {
        next();
        return;
      }
    }

    // Parent: vérifier si son enfant est dans cette classe
    if (userRole === "Parent") {
      const studentInClass = await prisma.student.findFirst({
        where: {
          guardians: {
            some: {
              parent: {
                userId,
              },
            },
          },
          classId,
        },
      });

      if (studentInClass) {
        next();
        return;
      }
    }

    const response: TimetableControllerResponse = {
      success: false,
      message: "Accès non autorisé à cet emploi du temps",
      code: "FORBIDDEN",
    };
    res.status(403).json(response);
  } catch (error: any) {
    console.error("❌ TimetableMiddleware error:", error);

    const response: TimetableControllerResponse = {
      success: false,
      message: "Erreur de vérification des permissions",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
};

/**
 * Vérifie les conflits avant de créer/mettre à jour un horaire
 */
export const checkScheduleConflictsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;
    const { assignmentId, scheduleId } = req.params;

    if (!dayOfWeek || !startTime || !endTime) {
      next();
      return;
    }

    // Validation des heures
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (startMinutes >= endMinutes) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "L'heure de fin doit être après l'heure de début",
        code: "INVALID_TIME_RANGE",
      };
      res.status(400).json(response);
      return;
    }

    if (endMinutes - startMinutes < 30) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "La durée minimale d'un cours est de 30 minutes",
        code: "MIN_DURATION_NOT_MET",
      };
      res.status(400).json(response);
      return;
    }

    if (endMinutes - startMinutes > 240) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "La durée maximale d'un cours est de 4 heures",
        code: "MAX_DURATION_EXCEEDED",
      };
      res.status(400).json(response);
      return;
    }

    // Récupérer les informations nécessaires pour la vérification
    let professeurId: string;
    let classId: string;

    if (scheduleId) {
      // Mise à jour: récupérer l'horaire existant
      const existingSchedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        select: {
          professeurId: true,
          classId: true,
          assignmentId: true,
        },
      });

      if (!existingSchedule) {
        const response: TimetableControllerResponse = {
          success: false,
          message: "Horaire non trouvé",
          code: "SCHEDULE_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }

      professeurId = req.body.professeurId || existingSchedule.professeurId;
      classId = req.body.classId || existingSchedule.classId;
    } else {
      // Création: récupérer l'assignation
      const assignment = await prisma.classAssignment.findUnique({
        where: { id: assignmentId || req.body.assignmentId },
        select: {
          professeurId: true,
        },
      });

      if (!assignment) {
        const response: TimetableControllerResponse = {
          success: false,
          message: "Assignation non trouvée",
          code: "ASSIGNMENT_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }

      professeurId = assignment.professeurId;
      classId = req.body.classId;
    }

    if (!classId) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "ID de classe requis",
        code: "MISSING_CLASS_ID",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier les conflits du professeur
    const professorConflicts = await prisma.schedule.findMany({
      where: {
        professeurId,
        dayOfWeek,
        id: scheduleId ? { not: scheduleId } : undefined,
        status: "ACTIVE",
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
      include: {
        schoolClass: {
          select: { name: true },
        },
        classAssignment: {
          select: {
            subject: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (professorConflicts.length > 0) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "Le professeur a déjà un cours à ce créneau",
        code: "PROFESSEUR_CONFLICT",
        data: {
          conflicts: professorConflicts.map(
            (conflict: {
              id: any;
              classAssignment: { subject: { name: any } };
              schoolClass: { name: any };
              startTime: any;
              endTime: any;
            }) => ({
              id: conflict.id,
              subject: conflict.classAssignment?.subject?.name,
              class: conflict.schoolClass?.name,
              startTime: conflict.startTime,
              endTime: conflict.endTime,
            })
          ),
        },
      };
      res.status(409).json(response);
      return;
    }

    // Vérifier les conflits de la classe
    const classConflicts = await prisma.schedule.findMany({
      where: {
        classId,
        dayOfWeek,
        id: scheduleId ? { not: scheduleId } : undefined,
        status: "ACTIVE",
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
      include: {
        classAssignment: {
          select: {
            subject: {
              select: { name: true },
            },
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

    if (classConflicts.length > 0) {
      const response: TimetableControllerResponse = {
        success: false,
        message: "La classe a déjà un cours à ce créneau",
        code: "CLASS_CONFLICT",
        data: {
          conflicts: classConflicts.map(
            (conflict: {
              id: any;
              classAssignment: {
                subject: { name: any };
                professeur: { firstName: any; lastName: any };
              };
              startTime: any;
              endTime: any;
            }) => ({
              id: conflict.id,
              subject: conflict.classAssignment?.subject?.name,
              professeur: conflict.classAssignment?.professeur
                ? `${conflict.classAssignment.professeur.firstName} ${conflict.classAssignment.professeur.lastName}`
                : null,
              startTime: conflict.startTime,
              endTime: conflict.endTime,
            })
          ),
        },
      };
      res.status(409).json(response);
      return;
    }

    next();
  } catch (error: any) {
    console.error("❌ Conflict check error:", error);

    const response: TimetableControllerResponse = {
      success: false,
      message: "Erreur lors de la vérification des conflits",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
};
