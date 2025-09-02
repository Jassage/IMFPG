import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation Zod
const facultySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  dean: z.string().optional(),
  studyDuration: z.number().int().min(1).max(5, 'La durée doit être entre 1 et 5 ans'),
  status: z.enum(['Active', 'Inactive']).default('Active')
});

// Créer une nouvelle faculté
export const createFaculty = async (req: Request, res: Response) => {
  try {
    // Validation des données
    const validation = facultySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: validation.error.message
      });
    }

    const { name, code, description, dean, studyDuration, status } = validation.data;
    

    // Vérifier si le code existe déjà
    const existingFaculty = await prisma.faculty.findUnique({
      where: { code }
    });

    if (existingFaculty) {
      return res.status(400).json({
        message: 'Une faculté avec ce code existe déjà'
      });
    }

    // Générer les niveaux automatiquement
    const levels = Array.from({ length: studyDuration }, (_, i) => `L${i + 1}`);

    // Créer la faculté avec ses niveaux
    const faculty = await prisma.faculty.create({
      data: {
        name,
        code,
        description: description || null,
        dean: dean || null,
        studyDuration,
        status,
        levels: {
          create: levels.map(level => ({ level }))
        }
      },
      include: {
        levels: true
      }
    });

    res.status(201).json({
      message: 'Faculté créée avec succès',
      faculty
    });
  } catch (error) {
    console.error('Erreur création faculté:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer toutes les facultés
export const getFaculties = async (req: Request, res: Response) => {
  try {
    const { includeLevels, search, status } = req.query;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const faculties = await prisma.faculty.findMany({
      where,
      include: {
        levels: includeLevels === 'true',
        _count: {
          select: {
            assignments: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(faculties);
  } catch (error) {
    console.error('Erreur récupération facultés:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer une faculté par son ID
export const getFacultyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeLevels } = req.query;

    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        levels: includeLevels === 'true',
        assignments: {
          include: {
            ue: true,
            professeur: true
          }
        },
        _count: {
          select: {
            assignments: true
          }
        }
      }
    });

    if (!faculty) {
      return res.status(404).json({
        message: 'Faculté non trouvée'
      });
    }

    res.json(faculty);
  } catch (error) {
    console.error('Erreur récupération faculté:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

// Mettre à jour une faculté
export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validation des données
    const validation = facultySchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: validation.error.message
      });
    }

    const { name, code, description, dean, studyDuration, status } = validation.data;

    // Vérifier si la faculté existe
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: { levels: true }
    });

    if (!faculty) {
      return res.status(404).json({
        message: 'Faculté non trouvée'
      });
    }

    // Vérifier les conflits de code
    if (code && code !== faculty.code) {
      const existingCode = await prisma.faculty.findUnique({
        where: { code }
      });
      if (existingCode) {
        return res.status(400).json({
          message: 'Une faculté avec ce code existe déjà'
        });
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name: name ?? undefined,
      code: code ?? undefined,
      description: description ?? undefined,
      dean: dean ?? undefined,
      studyDuration: studyDuration ?? undefined,
      status: status ?? undefined
    };

    // Régénérer les niveaux si la durée change
    if (studyDuration && studyDuration !== faculty.studyDuration) {
      const newLevels = Array.from({ length: studyDuration }, (_, i) => `L${i + 1}`);
      
      updateData.levels = {
        deleteMany: {},
        create: newLevels.map(level => ({ level }))
      };
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data: updateData,
      include: {
        levels: true
      }
    });

    res.json({
      message: 'Faculté mise à jour avec succès',
      faculty: updatedFaculty
    });
  } catch (error) {
    console.error('Erreur modification faculté:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

// Supprimer une faculté
export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la faculté existe
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignments: true
          }
        }
      }
    });

    if (!faculty) {
      return res.status(404).json({
        message: 'Faculté non trouvée'
      });
    }

    // Vérifier si la faculté a des affectations
    if (faculty._count.assignments > 0) {
      return res.status(400).json({
        message: 'Impossible de supprimer cette faculté car elle a des affectations de cours'
      });
    }

    await prisma.faculty.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression faculté:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer les statistiques des facultés
export const getFacultyStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.faculty.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const total = await prisma.faculty.count();
    const active = await prisma.faculty.count({
      where: { status: 'Active' }
    });

    res.json({
      total,
      active,
      inactive: total - active,
      byStatus: stats
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};