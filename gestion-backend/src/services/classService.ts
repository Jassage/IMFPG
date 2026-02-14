/**
 * @file classService.ts
 * @description Service pour la gestion des classes
 */

import { PrismaClient, ClassLevel } from "../../generated/prisma";
import { AuditData } from "../types/auth";

const prisma = new PrismaClient();

// Interfaces
export interface ClassFilters {
  page?: number;
  limit?: number;
  search?: string;
  level?: ClassLevel | string;
  academicYearId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateClassData {
  name: string;
  level: ClassLevel;
  capacity?: number;
}

export interface UpdateClassData {
  name?: string;
  level?: ClassLevel;
  capacity?: number;
  status?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
}

/**
 * Service pour la gestion des classes
 */
export class ClassService {
  /**
   * Récupère la liste des classes
   */
  async getClasses(filters: ClassFilters, auditData: AuditData) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        level,
        academicYearId,
        status = "Active",
        sortBy = "name",
        sortOrder = "asc",
      } = filters;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      // Filtres
      const where: any = { status };

      if (search) {
        where.OR = [{ name: { contains: search } }];
      }

      if (level) {
        where.level = level;
      }

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      // Récupération avec pagination
      const [classes, total] = await Promise.all([
        prisma.schoolClass.findMany({
          where,
          orderBy: {
            [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
          },
          skip,
          take: limitNum,
        }),
        prisma.schoolClass.count({ where }),
      ]);

      // Récupérer les années académiques pour le filtre
      const academicYears = await prisma.academicYear.findMany({
        orderBy: { year: "desc" },
      });

      return {
        success: true,
        message: "Classes récupérées avec succès",
        data: {
          classes,
          academicYears,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      };
    } catch (error: any) {
      console.error(" ClassService - getClasses error:", error);
      throw error;
    }
  }

  /**
   * Récupère une classe par ID
   */
  async getClassById(id: string, auditData: AuditData) {
    try {
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id },
      });

      if (!schoolClass) {
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      // Récupérer les professeurs disponibles
      const availableTeachers = await prisma.professeur.findMany({
        where: {
          status: "Actif",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          speciality: true,
        },
        orderBy: {
          lastName: "asc",
        },
      });

      return {
        success: true,
        message: "Classe récupérée avec succès",
        data: {
          class: schoolClass,
          availableTeachers,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - getClassById error:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle classe
   */
  async createClass(data: CreateClassData, auditData: AuditData) {
    try {
      const { name, level, capacity } = data;

      // Vérifier l'unicité du nom dans l'année académique
      const existingClass = await prisma.schoolClass.findFirst({
        where: {
          name,
        },
      });

      if (existingClass) {
        return {
          success: false,
          message: "Une classe avec ce nom existe déjà",
          code: "CLASS_NAME_EXISTS",
        };
      }

      // Créer la classe
      const schoolClass = await prisma.schoolClass.create({
        data: {
          name,
          level,
          capacity: capacity || 30,
          status: "Active",
        },
      });

      return {
        success: true,
        message: "Classe créée avec succès",
        data: { class: schoolClass },
        metadata: {
          level,
          capacity: capacity || 30,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - createClass error:", error);
      throw error;
    }
  }

  /**
   * Met à jour une classe
   */
  async updateClass(id: string, data: UpdateClassData, auditData: AuditData) {
    try {
      const { name, level, capacity, status } = data;

      // Vérifier si la classe existe
      const existingClass = await prisma.schoolClass.findUnique({
        where: { id },
      });

      if (!existingClass) {
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      // Vérifier l'unicité du nom si modifié
      if (name && name !== existingClass.name) {
        const classWithName = await prisma.schoolClass.findFirst({
          where: {
            name,
            id: { not: id },
          },
        });

        if (classWithName) {
          return {
            success: false,
            message:
              "Une autre classe utilise déjà ce nom pour cette année académique",
            code: "CLASS_NAME_EXISTS",
          };
        }
      }

      // Mettre à jour
      const schoolClass = await prisma.schoolClass.update({
        where: { id },
        data: {
          name,
          level,
          capacity,
          status,
        },
      });

      return {
        success: true,
        message: "Classe mise à jour avec succès",
        data: { class: schoolClass },
        metadata: {
          oldName: existingClass.name,
          newName: name,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - updateClass error:", error);
      throw error;
    }
  }

  /**
   * Supprime (désactive) une classe
   */
  async deleteClass(id: string, auditData: AuditData) {
    try {
      // Vérifier si la classe existe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              students: true,
              schedules: true,
              enrollments: true,
            },
          },
        },
      });

      if (!schoolClass) {
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      // Vérifier les dépendances
      if (schoolClass._count.students > 0) {
        return {
          success: false,
          message:
            "Cette classe ne peut pas être supprimée car elle contient des élèves",
          code: "CLASS_HAS_STUDENTS",
          data: {
            students: schoolClass._count.students,
          },
        };
      }

      // Désactiver plutôt que supprimer
      await prisma.schoolClass.update({
        where: { id },
        data: { status: "Inactive" },
      });

      return {
        success: true,
        message: "Classe désactivée avec succès",
        metadata: {
          className: schoolClass.name,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - deleteClass error:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une classe
   */
  async getClassStats(id: string, auditData: AuditData) {
    try {
      const stats = await prisma.schoolClass.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              students: true,
              schedules: true,
            },
          },
          students: {
            select: {
              status: true,
            },
          },
        },
      });

      if (!stats) {
        return {
          success: false,
          message: "Classe non trouvée",
          code: "CLASS_NOT_FOUND",
        };
      }

      // Calculer les statistiques
      const statusCounts = stats.students.reduce(
        (acc, student) => {
          acc[student.status] = (acc[student.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        success: true,
        message: "Statistiques récupérées avec succès",
        data: {
          totalStudents: stats._count.students,
          totalSchedules: stats._count.schedules,
          statusDistribution: statusCounts,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - getClassStats error:", error);
      throw error;
    }
  }

  /**
   * Récupère les étudiants d'une classe
   */
  async getClassStudents(classId: string, auditData: AuditData) {
    try {
      const students = await prisma.student.findMany({
        where: {
          classId,
          status: "Active",
        },
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
        orderBy: {
          lastName: "asc",
        },
      });

      return {
        success: true,
        message: "Étudiants de la classe récupérés",
        data: { students },
      };
    } catch (error: any) {
      console.error(" ClassService - getClassStudents error:", error);
      throw error;
    }
  }

  /**
   * Récupère l'emploi du temps d'une classe
   */
  async getClassSchedule(classId: string, auditData: AuditData) {
    try {
      const schedules = await prisma.schedule.findMany({
        where: {
          classId,
        },
        include: {
          professeur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      return {
        success: true,
        message: "Emploi du temps récupéré",
        data: { schedules },
      };
    } catch (error: any) {
      console.error(" ClassService - getClassSchedule error:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les classes disponibles (pour les filtres, etc.)
   */
  async getAllClasses(auditData: AuditData) {
    try {
      const classes = await prisma.schoolClass.findMany({
        where: {
          status: "Active",
        },
        select: {
          id: true,
          name: true,
          level: true,
          capacity: true,
        },
        orderBy: {
          level: "asc",
          name: "asc",
        },
      });

      return {
        success: true,
        message: "Classes récupérées",
        data: { classes },
      };
    } catch (error: any) {
      console.error(" ClassService - getAllClasses error:", error);
      throw error;
    }
  }

  /**
   * Récupère les niveaux de classe disponibles
   */
  async getClassLevels(auditData: AuditData) {
    try {
      const levels = await prisma.schoolClass.groupBy({
        by: ["level"],
        where: {
          status: "Active",
        },
        _count: {
          id: true,
        },
        orderBy: {
          level: "asc",
        },
      });

      return {
        success: true,
        message: "Niveaux de classe récupérés",
        data: {
          levels: levels.map((level) => ({
            level: level.level,
            count: level._count.id,
          })),
        },
      };
    } catch (error: any) {
      console.error(" ClassService - getClassLevels error:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques générales des classes
   */
  async getOverallClassStats(auditData: AuditData) {
    try {
      // Statistiques par niveau
      const statsByLevel = await prisma.schoolClass.groupBy({
        by: ["level"],
        where: {
          status: "Active",
        },
        _count: {
          id: true,
        },
        _sum: {
          capacity: true,
        },
      });

      // Total des classes
      const totalClasses = await prisma.schoolClass.count({
        where: { status: "Active" },
      });

      // Total des étudiants inscrits par classe
      const classStudentCounts = await prisma.schoolClass.findMany({
        where: { status: "Active" },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              students: true,
            },
          },
          capacity: true,
        },
      });

      const classOccupancy = classStudentCounts.map((cls) => ({
        id: cls.id,
        name: cls.name,
        current: cls._count.students,
        capacity: cls.capacity,
        occupancyRate:
          cls.capacity > 0 ? (cls._count.students / cls.capacity) * 100 : 0,
      }));

      // Moyenne d'occupation
      const avgOccupancy =
        classOccupancy.length > 0
          ? classOccupancy.reduce((sum, cls) => sum + cls.occupancyRate, 0) /
            classOccupancy.length
          : 0;

      return {
        success: true,
        message: "Statistiques générales récupérées",
        data: {
          totalClasses,
          statsByLevel: statsByLevel.map((stat) => ({
            level: stat.level,
            classCount: stat._count.id,
            totalCapacity: stat._sum.capacity || 0,
          })),
          classOccupancy,
          avgOccupancy: Math.round(avgOccupancy * 100) / 100,
        },
      };
    } catch (error: any) {
      console.error(" ClassService - getOverallClassStats error:", error);
      throw error;
    }
  }
}
