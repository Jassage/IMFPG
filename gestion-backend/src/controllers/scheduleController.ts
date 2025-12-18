/**
 * @file scheduleController.ts
 * @description Contrôleurs pour la gestion des emplois du temps
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";

const prisma = new PrismaClient();

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

interface ConflictCheck {
  hasConflict: boolean;
  conflicts: any[];
}

/**
 * @desc Vérifier les conflits d'horaire
 */
const checkScheduleConflicts = async (
  professeurId: string,
  classId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  classroom?: string,
  excludeScheduleId?: string
): Promise<ConflictCheck> => {
  const conflicts = [];

  // Vérifier conflits pour le professeur
  const professeurConflicts = await prisma.schedule.findMany({
    where: {
      professeurId,
      dayOfWeek,
      id: excludeScheduleId ? { not: excludeScheduleId } : undefined,
      OR: [
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      ],
    },
    include: {
      schoolClass: true,
      classAssignment: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (professeurConflicts.length > 0) {
    conflicts.push({
      type: "PROFESSEUR_CONFLICT",
      message: "Le professeur a déjà un cours à cette heure",
      details: professeurConflicts.map((c) => ({
        id: c.id,
        subject: c.classAssignment.subject.name,
        class: c.schoolClass.name,
        dayOfWeek: c.dayOfWeek,
        startTime: c.startTime,
        endTime: c.endTime,
        classroom: c.classroom,
      })),
    });
  }

  // Vérifier conflits pour la classe
  const classConflicts = await prisma.schedule.findMany({
    where: {
      classId,
      dayOfWeek,
      id: excludeScheduleId ? { not: excludeScheduleId } : undefined,
      OR: [
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      ],
    },
    include: {
      professeur: true,
      classAssignment: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (classConflicts.length > 0) {
    conflicts.push({
      type: "CLASS_CONFLICT",
      message: "La classe a déjà un cours à cette heure",
      details: classConflicts.map((c) => ({
        id: c.id,
        subject: c.classAssignment.subject.name,
        professeur: `${c.professeur.firstName} ${c.professeur.lastName}`,
        dayOfWeek: c.dayOfWeek,
        startTime: c.startTime,
        endTime: c.endTime,
        classroom: c.classroom,
      })),
    });
  }

  // Vérifier conflits de salle (si spécifiée)
  if (classroom) {
    const roomConflicts = await prisma.schedule.findMany({
      where: {
        classroom,
        dayOfWeek,
        id: excludeScheduleId ? { not: excludeScheduleId } : undefined,
        OR: [
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        ],
      },
      include: {
        schoolClass: true,
        professeur: true,
      },
    });

    if (roomConflicts.length > 0) {
      conflicts.push({
        type: "ROOM_CONFLICT",
        message: "La salle est déjà occupée à cette heure",
        details: roomConflicts.map((c) => ({
          id: c.id,
          class: c.schoolClass.name,
          professeur: `${c.professeur.firstName} ${c.professeur.lastName}`,
          dayOfWeek: c.dayOfWeek,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      });
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};

/**
 * @desc Crée un nouvel horaire
 */
export const createSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      assignmentId,
      classId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      recurrence,
      untilDate,
      notes,
    } = req.body;

    // Validation des données
    if (
      new Date(`2000-01-01T${startTime}`) >= new Date(`2000-01-01T${endTime}`)
    ) {
      const response: ApiResponse = {
        success: false,
        message: "L'heure de fin doit être après l'heure de début",
        code: "INVALID_TIME_RANGE",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier l'assignation
    const assignment = await prisma.classAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        professeur: true,
        subject: true,
        academicYear: true,
      },
    });

    if (!assignment) {
      const response: ApiResponse = {
        success: false,
        message: "Assignation non trouvée",
        code: "ASSIGNMENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Formater les heures pour la base de données
    const formattedStartTime = `2000-01-01T${startTime}:00.000Z`;
    const formattedEndTime = `2000-01-01T${endTime}:00.000Z`;

    // Vérifier les conflits
    const conflictCheck = await checkScheduleConflicts(
      assignment.professeurId,
      classId,
      dayOfWeek,
      formattedStartTime,
      formattedEndTime,
      classroom
    );

    if (conflictCheck.hasConflict) {
      const response: ApiResponse = {
        success: false,
        message: "Conflit d'horaire détecté",
        code: "SCHEDULE_CONFLICT",
        data: {
          conflicts: conflictCheck.conflicts,
        },
      };
      res.status(409).json(response);
      return;
    }

    // Créer l'horaire
    const schedule = await prisma.schedule.create({
      data: {
        assignmentId,
        classId,
        professeurId: assignment.professeurId,
        dayOfWeek,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        classroom,
        recurrence,
        untilDate: untilDate ? new Date(untilDate) : null,
        notes: notes || null,
        status: "ACTIVE",
      },
      include: {
        classAssignment: {
          include: {
            subject: true,
            professeur: true,
            academicYear: true,
          },
        },
        schoolClass: true,
        professeur: true,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_CREATED",
      entity: "Schedule",
      entityId: schedule.id,
      description: `Horaire créé: ${schedule.classAssignment.subject.name} - ${schedule.schoolClass.name}`,
      status: "SUCCESS",
      metadata: {
        dayOfWeek,
        startTime,
        endTime,
        classroom,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Horaire créé avec succès",
      data: { schedule },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - createSchedule error:", error);

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_CREATION_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la création de l'horaire",
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
 * @desc Récupère tous les horaires
 */
export const getAllSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      classId,
      professeurId,
      dayOfWeek,
      status,
      academicYearId,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) where.status = status;
    if (classId) where.classId = classId;
    if (professeurId) where.professeurId = professeurId;
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;

    // Filtrer par année académique via l'assignation
    if (academicYearId) {
      const assignments = await prisma.classAssignment.findMany({
        where: { academicYearId: academicYearId as string },
        select: { id: true },
      });
      const assignmentIds = assignments.map((a) => a.id);
      where.assignmentId = { in: assignmentIds };
    }

    const [schedules, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        include: {
          classAssignment: {
            include: {
              subject: true,
              professeur: true,
              academicYear: true,
            },
          },
          schoolClass: true,
          professeur: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        skip,
        take: limitNum,
      }),
      prisma.schedule.count({ where }),
    ]);

    const response: ApiResponse = {
      success: true,
      message: "Horaires récupérés avec succès",
      data: {
        schedules,
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
    console.error("❌ ScheduleController - getAllSchedules error:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère un horaire par ID
 */
export const getScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        classAssignment: {
          include: {
            subject: true,
            professeur: true,
            academicYear: true,
          },
        },
        schoolClass: true,
        professeur: true,
      },
    });

    if (!schedule) {
      const response: ApiResponse = {
        success: false,
        message: "Horaire non trouvé",
        code: "SCHEDULE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: "Horaire récupéré avec succès",
      data: { schedule },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - getScheduleById error:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère l'emploi du temps d'une classe
 */
export const getClassTimetable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { academicYearId } = req.query;

    const where: any = {
      classId,
    };

    // Filtrer par année académique via l'assignation
    if (academicYearId) {
      const assignments = await prisma.classAssignment.findMany({
        where: { academicYearId: academicYearId as string },
        select: { id: true },
      });
      const assignmentIds = assignments.map((a) => a.id);
      where.assignmentId = { in: assignmentIds };
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        classAssignment: {
          include: {
            subject: true,
            professeur: true,
          },
        },
        schoolClass: true,
        professeur: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Organiser par jour de la semaine
    const timetableByDay: any = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };

    schedules.forEach((schedule) => {
      if (timetableByDay[schedule.dayOfWeek]) {
        timetableByDay[schedule.dayOfWeek].push({
          id: schedule.id,
          subject: schedule.classAssignment.subject,
          professeur: schedule.professeur,
          classroom: schedule.classroom,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          status: schedule.status,
        });
      }
    });

    const response: ApiResponse = {
      success: true,
      message: "Emploi du temps récupéré",
      data: {
        classId,
        timetable: timetableByDay,
        totalSchedules: schedules.length,
        weekSummary: Object.keys(timetableByDay).reduce((acc, day) => {
          acc[day] = timetableByDay[day].length;
          return acc;
        }, {} as any),
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - getClassTimetable error:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Génère un emploi du temps automatiquement
 */
export const generateTimetable = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classId, academicYearId, constraints } = req.body;

    // Récupérer la classe
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

    // Récupérer toutes les assignations pour cette classe et année
    const assignments = await prisma.classAssignment.findMany({
      where: {
        classLevel: schoolClass.level,
        academicYearId,
        status: "Active",
      },
      include: {
        subject: true,
        professeur: true,
      },
    });

    if (assignments.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Aucune assignation trouvée pour cette classe",
        code: "NO_ASSIGNMENTS",
      };
      res.status(404).json(response);
      return;
    }

    // Configuration des créneaux
    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    const timeSlots = [
      { start: "08:00", end: "09:30" },
      { start: "09:45", end: "11:15" },
      { start: "11:30", end: "13:00" },
      { start: "14:00", end: "15:30" },
      { start: "15:45", end: "17:15" },
    ];

    // Contraintes par défaut
    const defaultConstraints = {
      maxHoursPerDay: constraints?.maxHoursPerDay || 6,
      breakTime: constraints?.breakTime || { start: "12:00", end: "14:00" },
    };

    const generatedSchedules = [];
    const errors = [];
    const professeurAssignments = new Map();
    const classroomAssignments = new Map();

    // Tenter de placer chaque assignation
    for (const assignment of assignments) {
      let placed = false;

      for (const day of daysOfWeek) {
        if (placed) break;

        for (const slot of timeSlots) {
          if (placed) break;

          // Vérifier les contraintes de pause
          if (defaultConstraints.breakTime) {
            const breakStart = defaultConstraints.breakTime.start;
            const breakEnd = defaultConstraints.breakTime.end;
            if (
              (slot.start >= breakStart && slot.start < breakEnd) ||
              (slot.end > breakStart && slot.end <= breakEnd)
            ) {
              continue; // Skip les créneaux pendant la pause
            }
          }

          const formattedStartTime = `2000-01-01T${slot.start}:00.000Z`;
          const formattedEndTime = `2000-01-01T${slot.end}:00.000Z`;

          // Vérifier les conflits
          const conflictCheck = await checkScheduleConflicts(
            assignment.professeurId,
            classId,
            day,
            formattedStartTime,
            formattedEndTime
          );

          if (!conflictCheck.hasConflict) {
            try {
              // Assigner une salle disponible
              const availableClassrooms = [
                "A101",
                "A102",
                "A103",
                "B201",
                "B202",
              ];
              const assignedClassroom =
                availableClassrooms.find(
                  (room) =>
                    !classroomAssignments
                      .get(`${day}-${slot.start}`)
                      ?.includes(room)
                ) || "A101";

              const schedule = await prisma.schedule.create({
                data: {
                  assignmentId: assignment.id,
                  classId,
                  professeurId: assignment.professeurId,
                  dayOfWeek: day,
                  startTime: formattedStartTime,
                  endTime: formattedEndTime,
                  classroom: assignedClassroom,
                  status: "ACTIVE",
                  notes: "Généré automatiquement",
                  recurrence: null,
                  untilDate: null,
                },
              });

              generatedSchedules.push(schedule);
              placed = true;

              // Mettre à jour les compteurs
              const professeurKey = `${assignment.professeurId}-${day}`;
              professeurAssignments.set(
                professeurKey,
                (professeurAssignments.get(professeurKey) || 0) + 1
              );

              const classroomKey = `${day}-${slot.start}`;
              classroomAssignments.set(classroomKey, [
                ...(classroomAssignments.get(classroomKey) || []),
                assignedClassroom,
              ]);
            } catch (error: any) {
              errors.push({
                assignmentId: assignment.id,
                subject: assignment.subject.name,
                error: error.message,
              });
            }
          }
        }
      }

      if (!placed) {
        errors.push({
          assignmentId: assignment.id,
          subject: assignment.subject.name,
          message: `Impossible de placer ${assignment.subject.name}`,
        });
      }
    }

    await createAuditLog({
      ...auditData,
      action: "TIMETABLE_GENERATED",
      entity: "Schedule",
      description: `Emploi du temps généré pour la classe ${schoolClass.name}`,
      status: "SUCCESS",
      metadata: {
        classId,
        academicYearId,
        generated: generatedSchedules.length,
        errors: errors.length,
        totalAssignments: assignments.length,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: `Emploi du temps généré avec ${generatedSchedules.length} créneaux sur ${assignments.length} assignations`,
      data: {
        schedules: generatedSchedules,
        errors,
        statistics: {
          totalAssignments: assignments.length,
          successfullyPlaced: generatedSchedules.length,
          failed: errors.length,
          successRate: (generatedSchedules.length / assignments.length) * 100,
        },
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - generateTimetable error:", error);

    await createAuditLog({
      ...auditData,
      action: "TIMETABLE_GENERATION_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la génération de l'emploi du temps",
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
 * @desc Récupère l'emploi du temps d'un professeur
 */
export const getProfessorSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { professeurId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = {
      professeurId,
    };

    if (startDate && endDate) {
      // Pour une recherche par période spécifique
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        classAssignment: {
          include: {
            subject: true,
            academicYear: true,
          },
        },
        schoolClass: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Organiser par jour
    const scheduleByDay: any = {};
    schedules.forEach((schedule) => {
      if (!scheduleByDay[schedule.dayOfWeek]) {
        scheduleByDay[schedule.dayOfWeek] = [];
      }
      scheduleByDay[schedule.dayOfWeek].push(schedule);
    });

    const response: ApiResponse = {
      success: true,
      message: "Emploi du temps du professeur récupéré",
      data: {
        schedules,
        scheduleByDay,
        totalSchedules: schedules.length,
        weeklyHours: schedules.reduce((total, s) => {
          const start = new Date(s.startTime);
          const end = new Date(s.endTime);
          return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0),
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - getProfessorSchedule error:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Vérifie les conflits d'horaire
 */
export const checkConflicts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      professeurId,
      classId,
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      excludeScheduleId,
    } = req.query;

    const formattedStartTime = `2000-01-01T${startTime}:00.000Z`;
    const formattedEndTime = `2000-01-01T${endTime}:00.000Z`;

    const conflictCheck = await checkScheduleConflicts(
      professeurId as string,
      classId as string,
      dayOfWeek as string,
      formattedStartTime,
      formattedEndTime,
      classroom as string,
      excludeScheduleId as string
    );

    const response: ApiResponse = {
      success: true,
      message: conflictCheck.hasConflict
        ? "Conflits détectés"
        : "Aucun conflit",
      data: conflictCheck,
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - checkConflicts error:", error);

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les créneaux disponibles
 */
export const getAvailableTimeSlots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId, dayOfWeek, professeurId, classroom } = req.query;

    // Créneaux de base
    const baseTimeSlots = [
      { start: "08:00", end: "09:30" },
      { start: "09:45", end: "11:15" },
      { start: "11:30", end: "13:00" },
      { start: "14:00", end: "15:30" },
      { start: "15:45", end: "17:15" },
    ];

    // Récupérer les créneaux occupés
    const where: any = {
      dayOfWeek: dayOfWeek as string,
    };

    if (classId) where.classId = classId as string;
    if (professeurId) where.professeurId = professeurId as string;
    if (classroom) where.classroom = classroom as string;

    const occupiedSchedules = await prisma.schedule.findMany({
      where,
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Filtrer les créneaux disponibles
    const availableSlots = baseTimeSlots.filter((slot) => {
      const slotStart = `2000-01-01T${slot.start}:00.000Z`;
      const slotEnd = `2000-01-01T${slot.end}:00.000Z`;

      return !occupiedSchedules.some((occupied) => {
        return (
          (slotStart < occupied.endTime && slotEnd > occupied.startTime) ||
          (occupied.startTime < slotEnd && occupied.endTime > slotStart)
        );
      });
    });

    const response: ApiResponse = {
      success: true,
      message: "Créneaux disponibles récupérés",
      data: {
        dayOfWeek,
        availableSlots,
        totalAvailable: availableSlots.length,
        totalBase: baseTimeSlots.length,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "❌ ScheduleController - getAvailableTimeSlots error:",
      error
    );

    const response: ApiResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Met à jour un horaire
 */
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      dayOfWeek,
      startTime,
      endTime,
      classroom,
      recurrence,
      untilDate,
      notes,
      status,
    } = req.body;

    // Vérifier si l'horaire existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        classAssignment: {
          include: {
            professeur: true,
          },
        },
      },
    });

    if (!existingSchedule) {
      const response: ApiResponse = {
        success: false,
        message: "Horaire non trouvé",
        code: "SCHEDULE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Formater les heures
    const formattedStartTime = startTime
      ? `2000-01-01T${startTime}:00.000Z`
      : existingSchedule.startTime;
    const formattedEndTime = endTime
      ? `2000-01-01T${endTime}:00.000Z`
      : existingSchedule.endTime;

    // Vérifier les conflits (sauf avec lui-même)
    const conflictCheck = await checkScheduleConflicts(
      existingSchedule.professeurId,
      existingSchedule.classId,
      dayOfWeek || existingSchedule.dayOfWeek,
      formattedStartTime,
      formattedEndTime,
      classroom || existingSchedule.classroom,
      id
    );

    if (conflictCheck.hasConflict) {
      const response: ApiResponse = {
        success: false,
        message: "Conflit d'horaire détecté",
        code: "SCHEDULE_CONFLICT",
        data: {
          conflicts: conflictCheck.conflicts,
        },
      };
      res.status(409).json(response);
      return;
    }

    // Mettre à jour l'horaire
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        dayOfWeek: dayOfWeek || existingSchedule.dayOfWeek,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        classroom:
          classroom !== undefined ? classroom : existingSchedule.classroom,
        recurrence:
          recurrence !== undefined ? recurrence : existingSchedule.recurrence,
        untilDate: untilDate ? new Date(untilDate) : existingSchedule.untilDate,
        notes: notes !== undefined ? notes : existingSchedule.notes,
        status: status || existingSchedule.status,
      },
      include: {
        classAssignment: {
          include: {
            subject: true,
            professeur: true,
          },
        },
        schoolClass: true,
        professeur: true,
      },
    });

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_UPDATED",
      entity: "Schedule",
      entityId: id,
      description: `Horaire modifié: ${schedule.classAssignment.subject.name}`,
      status: "SUCCESS",
      metadata: {
        changes: Object.keys(req.body),
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "Horaire mis à jour avec succès",
      data: { schedule },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - updateSchedule error:", error);

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_UPDATE_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la mise à jour de l'horaire",
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
 * @desc Supprime un horaire
 */
export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'horaire existe
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        classAssignment: {
          include: {
            subject: true,
          },
        },
        schoolClass: true,
      },
    });

    if (!schedule) {
      const response: ApiResponse = {
        success: false,
        message: "Horaire non trouvé",
        code: "SCHEDULE_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Supprimer l'horaire
    await prisma.schedule.delete({
      where: { id },
    });

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_DELETED",
      entity: "Schedule",
      entityId: id,
      description: `Horaire supprimé: ${schedule.classAssignment.subject.name} - ${schedule.schoolClass.name}`,
      status: "SUCCESS",
    });

    const response: ApiResponse = {
      success: true,
      message: "Horaire supprimé avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ ScheduleController - deleteSchedule error:", error);

    await createAuditLog({
      ...auditData,
      action: "SCHEDULE_DELETION_ERROR",
      entity: "Schedule",
      description: "Erreur lors de la suppression de l'horaire",
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
