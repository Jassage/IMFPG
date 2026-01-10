import { ClassLevel } from "../../generated/prisma";
import prisma from "../prisma";
import { ApiResponse } from "../types/classTypes";

// Fonction utilitaire pour les niveaux de classe valides
const VALID_CLASS_LEVELS: ClassLevel[] = [
  "Sixieme",
  "Cinquieme",
  "Quatrieme",
  "Troisieme",
  "Seconde",
  "Premiere",
  "Terminale",
  "NSI",
  "NSII",
  "NSIII",
  "NSIV",
];

const isValidClassLevel = (level: string): level is ClassLevel => {
  return VALID_CLASS_LEVELS.includes(level as ClassLevel);
};

// Types pour les données d'entrée
interface CreateClassAssignmentData {
  subjectId: string;
  professeurId: string;
  classLevel: ClassLevel;
  academicYearId: string;
  status?: "Active" | "Inactive";
  notes?: string;
}

interface UpdateClassAssignmentData {
  subjectId?: string;
  professeurId?: string;
  classLevel?: ClassLevel;
  academicYearId?: string;
  status?: "Active" | "Inactive";
  notes?: string;
}

interface ClassAssignmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  classLevel?: string;
  academicYearId?: string;
  professeurId?: string;
  subjectId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Configuration
const MAX_ASSIGNMENTS_PER_PROFESSOR = 10;
const MAX_PAGINATION_LIMIT = 100;

/**
 * Service pour les opérations CRUD des assignations de classes
 */
export class ClassAssignmentService {
  /**
   * Vérifie si un professeur peut enseigner une matière
   */
  private static async canProfesseurTeachSubject(
    tx: any,
    professeurId: string,
    subjectId: string,
    classLevel: ClassLevel
  ): Promise<{
    canTeach: boolean;
    reason?: string;
    professeurSubject?: any;
    recommendations?: string[];
  }> {
    // Vérifier la relation professeur-matière
    const professeurSubject = await tx.professeurSubject.findFirst({
      where: {
        professeurId,
        subjectId,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
        },
        professeur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            speciality: true,
            status: true,
          },
        },
      },
    });

    if (!professeurSubject) {
      // Récupérer plus d'informations pour un meilleur message d'erreur
      const [professeur, subject] = await Promise.all([
        tx.professeur.findUnique({
          where: { id: professeurId },
          select: {
            firstName: true,
            lastName: true,
            email: true,
            speciality: true,
            status: true,
          },
        }),
        tx.subject.findUnique({
          where: { id: subjectId },
          select: {
            name: true,
            code: true,
            type: true,
            description: true,
          },
        }),
      ]);

      // Construire un message d'erreur informatif
      const professeurName = professeur
        ? `${professeur.firstName} ${professeur.lastName}`
        : `Professeur (ID: ${professeurId})`;

      const subjectName = subject
        ? `${subject.name} (${subject.code})`
        : `Matière (ID: ${subjectId})`;

      let reason = `${professeurName} n'enseigne pas ${subjectName}`;
      const recommendations: string[] = [
        "Ajoutez cette matière à la liste des matières enseignées du professeur",
        "Choisissez un autre professeur qui enseigne cette matière",
      ];

      // Vérifier la compatibilité de la spécialité
      if (professeur?.speciality && subject?.type) {
        if (professeur.speciality === subject.type) {
          reason = `${professeurName} est spécialisé en ${professeur.speciality} mais n'enseigne pas encore ${subjectName}`;
          recommendations.push(
            "La spécialité correspond, il suffit d'ajouter la matière à son profil"
          );
        } else {
          reason = `${professeurName} est spécialisé en ${professeur.speciality} mais ${subjectName} est de type ${subject.type}`;
          recommendations.push(
            "Choisissez un professeur dont la spécialité correspond au type de matière"
          );
        }
      }

      return {
        canTeach: false,
        reason,
        recommendations,
      };
    }

    // Vérifier si le professeur est actif
    if (professeurSubject.professeur.status !== "Actif") {
      return {
        canTeach: false,
        reason: `${professeurSubject.professeur.firstName} ${professeurSubject.professeur.lastName} n'est pas actif`,
        recommendations: [
          "Activez le professeur dans son profil",
          "Choisissez un autre professeur actif",
        ],
      };
    }

    // Vérifier l'expérience pour les niveaux avancés
    const isAdvancedLevel = [
      "Premiere",
      "Terminale",
      "NSI",
      "NSII",
      "NSIII",
      "NSIV",
    ].includes(classLevel);
    const yearsOfExperience = professeurSubject.yearsOfExperience || 0;

    if (isAdvancedLevel && yearsOfExperience < 3) {
      return {
        canTeach: true, // Permettre mais avec un avertissement
        reason: `${professeurSubject.professeur.firstName} ${professeurSubject.professeur.lastName} n'a que ${yearsOfExperience} année(s) d'expérience en ${professeurSubject.subject.name} pour un niveau avancé`,
        professeurSubject,
        recommendations: [
          "Cette assignation peut nécessiter un suivi particulier",
          "Considérez assigner cette matière à un professeur plus expérimenté",
        ],
      };
    }

    // Vérifier pour les niveaux débutants
    const isBeginnerLevel = ["Sixieme", "Cinquieme", "Quatrieme"].includes(
      classLevel
    );
    if (isBeginnerLevel && yearsOfExperience > 10) {
      return {
        canTeach: true,
        reason: `${professeurSubject.professeur.firstName} ${professeurSubject.professeur.lastName} a beaucoup d'expérience (${yearsOfExperience} ans) pour un niveau débutant`,
        professeurSubject,
        recommendations: [
          "Considérez assigner cette matière à un professeur moins expérimenté pour les niveaux débutants",
          "Ce professeur pourrait être plus utile pour les niveaux avancés",
        ],
      };
    }

    return {
      canTeach: true,
      professeurSubject,
    };
  }

  /**
   * Récupère la liste des assignations avec filtres et pagination
   */
  static async getClassAssignments(
    filters: ClassAssignmentFilters
  ): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        classLevel,
        academicYearId,
        professeurId,
        subjectId,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters;

      // Validation de la limite de pagination
      if (limit > MAX_PAGINATION_LIMIT) {
        throw {
          status: 400,
          response: {
            success: false,
            message: `La limite maximum est de ${MAX_PAGINATION_LIMIT} éléments`,
            code: "MAX_LIMIT_EXCEEDED",
          },
        };
      }

      if (page < 1) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Le numéro de page doit être supérieur à 0",
            code: "INVALID_PAGE_NUMBER",
          },
        };
      }

      const skip = (page - 1) * limit;

      // Construction des filtres
      const where: any = {};

      // Filtrer par statut si fourni
      if (status && (status === "Active" || status === "Inactive")) {
        where.status = status;
      }

      // Filtrer par niveau de classe
      if (classLevel && classLevel !== "all" && isValidClassLevel(classLevel)) {
        where.classLevel = classLevel;
      }

      // Autres filtres
      if (academicYearId) where.academicYearId = academicYearId;
      if (professeurId) where.professeurId = professeurId;
      if (subjectId) where.subjectId = subjectId;

      // Filtre de recherche
      if (search) {
        const searchTrimmed = search.trim();
        if (searchTrimmed.length === 0) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "Le terme de recherche ne peut pas être vide",
              code: "EMPTY_SEARCH",
            },
          };
        }

        if (searchTrimmed.length > 100) {
          throw {
            status: 400,
            response: {
              success: false,
              message:
                "Le terme de recherche est trop long (max 100 caractères)",
              code: "SEARCH_TOO_LONG",
            },
          };
        }

        where.OR = [
          {
            subject: {
              OR: [
                {
                  name: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
                {
                  code: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
          {
            professeur: {
              OR: [
                {
                  firstName: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
                {
                  matricule: {
                    contains: searchTrimmed,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
          {
            academicYear: {
              year: { contains: searchTrimmed },
            },
          },
        ];
      }

      // Validation du tri
      const validSortFields = [
        "createdAt",
        "updatedAt",
        "status",
        "classLevel",
        "subject",
        "professeur",
        "academicYear",
      ];

      if (sortBy && !validSortFields.includes(sortBy)) {
        throw {
          status: 400,
          response: {
            success: false,
            message: `Champ de tri invalide. Valeurs acceptées: ${validSortFields.join(", ")}`,
            code: "INVALID_SORT_FIELD",
          },
        };
      }

      if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Ordre de tri invalide. Valeurs acceptées: asc, desc",
            code: "INVALID_SORT_ORDER",
          },
        };
      }

      // Déterminer l'ordre de tri
      const orderBy: any = {};
      if (sortBy === "subject") {
        orderBy.subject = { name: sortOrder };
      } else if (sortBy === "professeur") {
        orderBy.professeur = { lastName: sortOrder };
      } else if (sortBy === "academicYear") {
        orderBy.academicYear = { year: sortOrder };
      } else {
        orderBy[sortBy] = sortOrder;
      }

      // Récupération avec pagination
      const [assignments, total] = await Promise.all([
        prisma.classAssignment.findMany({
          where,
          include: {
            subject: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
                coefficient: true,
              },
            },
            professeur: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                matricule: true,
                status: true,
                speciality: true,
              },
            },
            academicYear: {
              select: {
                id: true,
                year: true,
                isCurrent: true,
                startDate: true,
                endDate: true,
              },
            },
            _count: {
              select: {
                schedules: true,
                grades: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.classAssignment.count({ where }),
      ]);

      return {
        success: true,
        message: "Assignations récupérées avec succès",
        data: {
          assignments,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
          filters: {
            classLevel: classLevel || null,
            status: status || null,
            search: search || null,
          },
        },
      };
    } catch (error: any) {
      // Propagation des erreurs de validation
      if (error.status === 400) throw error;

      console.error("Error fetching class assignments:", error);
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  /**
   * Récupère une assignation par ID
   */
  static async getClassAssignmentById(id: string): Promise<ApiResponse> {
    try {
      // Validation de l'ID
      if (!id || id.trim().length === 0) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "L'ID est requis",
            code: "ID_REQUIRED",
          },
        };
      }

      const assignment = await prisma.classAssignment.findUnique({
        where: { id },
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              coefficient: true,
              passingGrade: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          professeur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              matricule: true,
              speciality: true,
              status: true,
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
          schedules: {
            include: {
              schoolClass: true,
            },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          },
          grades: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  studentCode: true,
                },
              },
            },
          },
          _count: {
            select: {
              schedules: true,
              grades: true,
            },
          },
        },
      });

      if (!assignment) {
        throw {
          status: 404,
          response: {
            success: false,
            message: "Assignation non trouvée",
            code: "ASSIGNMENT_NOT_FOUND",
          },
        };
      }

      return {
        success: true,
        message: "Assignation récupérée avec succès",
        data: { assignment },
      };
    } catch (error: any) {
      if (error.status === 404 || error.status === 400) throw error;

      console.error("Error fetching class assignment by id:", error);
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  /**
   * Crée une nouvelle assignation avec transaction
   */
  static async createClassAssignment(
    data: CreateClassAssignmentData,
    userId?: string // Pour l'audit trail
  ): Promise<ApiResponse> {
    return await prisma.$transaction(async (tx: any) => {
      try {
        const {
          subjectId,
          professeurId,
          classLevel,
          academicYearId,
          status = "Active",
        } = data;

        // Validation des données d'entrée
        if (!subjectId || !professeurId || !classLevel || !academicYearId) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "Tous les champs obligatoires sont requis",
              code: "MISSING_REQUIRED_FIELDS",
              data: {
                missingFields: [
                  !subjectId && "subjectId",
                  !professeurId && "professeurId",
                  !classLevel && "classLevel",
                  !academicYearId && "academicYearId",
                ].filter(Boolean),
              },
            },
          };
        }

        // Validation du niveau de classe
        if (!isValidClassLevel(classLevel)) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "Niveau de classe invalide",
              code: "INVALID_CLASS_LEVEL",
              data: {
                received: classLevel,
                validLevels: VALID_CLASS_LEVELS,
              },
            },
          };
        }

        // Vérifier l'unicité
        const existingAssignment = await tx.classAssignment.findFirst({
          where: {
            subjectId,
            classLevel,
            academicYearId,
            professeurId,
          },
        });

        if (existingAssignment) {
          throw {
            status: 409,
            response: {
              success: false,
              message: "Cette assignation existe déjà",
              code: "ASSIGNMENT_EXISTS",
              data: {
                existingId: existingAssignment.id,
                subjectId,
                classLevel,
                academicYearId,
                professeurId,
              },
            },
          };
        }

        //verifier si ce cours est attribuer a ce niveau par un autre professeur
        const conflictingAssignment = await tx.classAssignment.findFirst({
          where: {
            subjectId,
            classLevel,
            academicYearId,
            NOT: { professeurId: professeurId },
          },
        });

        if (conflictingAssignment) {
          throw {
            status: 409,
            response: {
              success: false,
              message:
                "Cette matière est déjà assignée à ce niveau par un autre professeur",
              code: "SUBJECT_ALREADY_ASSIGNED_TO_LEVEL",
              data: {
                existingId: conflictingAssignment.id,
                subjectId,
                classLevel,
                academicYearId,
                professeurId: conflictingAssignment.professeurId,
              },
            },
          };
        }

        // Vérifier les relations simultanément
        const [subject, academicYear] = await Promise.all([
          tx.subject.findUnique({ where: { id: subjectId } }),
          tx.academicYear.findUnique({ where: { id: academicYearId } }),
        ]);

        if (!subject) {
          throw {
            status: 404,
            response: {
              success: false,
              message: "Matière non trouvée",
              code: "SUBJECT_NOT_FOUND",
            },
          };
        }

        if (!academicYear) {
          throw {
            status: 404,
            response: {
              success: false,
              message: "Année académique non trouvée",
              code: "ACADEMIC_YEAR_NOT_FOUND",
            },
          };
        }

        // Le professeur peut-il enseigner cette matière?
        const teachingValidation = await this.canProfesseurTeachSubject(
          tx,
          professeurId,
          subjectId,
          classLevel
        );

        if (!teachingValidation.canTeach) {
          throw {
            status: 400,
            response: {
              success: false,
              message:
                teachingValidation.reason ||
                "Le professeur ne peut pas enseigner cette matière",
              code: "PROFESSEUR_CANNOT_TEACH_SUBJECT",
              data: {
                professeurId,
                subjectId,
                classLevel,
                recommendations: teachingValidation.recommendations,
              },
            },
          };
        }

        // Vérifier la charge de travail du professeur
        const professorAssignmentsCount = await tx.classAssignment.count({
          where: {
            professeurId,
            academicYearId,
            status: "Active",
          },
        });

        if (professorAssignmentsCount >= MAX_ASSIGNMENTS_PER_PROFESSOR) {
          throw {
            status: 400,
            response: {
              success: false,
              message: `Le professeur a déjà ${professorAssignmentsCount} assignations actives (maximum: ${MAX_ASSIGNMENTS_PER_PROFESSOR})`,
              code: "TOO_MANY_ASSIGNMENTS",
              data: {
                currentCount: professorAssignmentsCount,
                maxAllowed: MAX_ASSIGNMENTS_PER_PROFESSOR,
              },
            },
          };
        }

        // Vérifier si c'est une matière principale du professeur
        const isPrimarySubject =
          teachingValidation.professeurSubject?.isPrimary;

        // Données d'audit
        const auditData: any = {};
        if (userId) {
          auditData.createdById = userId;
          auditData.updatedById = userId;
        }

        // Créer l'assignation
        const assignment = await tx.classAssignment.create({
          data: {
            subjectId,
            professeurId,
            classLevel,
            academicYearId,
            status,
            ...auditData,
          },
          include: {
            subject: true,
            professeur: true,
            academicYear: true,
          },
        });

        return {
          success: true,
          message: "Assignation créée avec succès",
          data: {
            assignment,
            metadata: {
              isPrimarySubject,
            },
          },
        };
      } catch (error: any) {
        if (
          error.status === 404 ||
          error.status === 409 ||
          error.status === 400
        ) {
          throw error;
        }

        console.error("Error creating class assignment:", error);
        throw {
          status: 500,
          response: {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_SERVER_ERROR",
          },
        };
      }
    });
  }

  /**
   * Met à jour une assignation avec transaction
   */
  static async updateClassAssignment(
    id: string,
    data: UpdateClassAssignmentData,
    userId?: string // Pour l'audit trail
  ): Promise<ApiResponse> {
    return await prisma.$transaction(async (tx: any) => {
      try {
        // Validation de l'ID
        if (!id || id.trim().length === 0) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "L'ID est requis",
              code: "ID_REQUIRED",
            },
          };
        }

        // Vérifier si l'assignation existe
        const existingAssignment = await tx.classAssignment.findUnique({
          where: { id },
          include: {
            subject: true,
            professeur: true,
            academicYear: true,
          },
        });

        if (!existingAssignment) {
          throw {
            status: 404,
            response: {
              success: false,
              message: "Assignation non trouvée",
              code: "ASSIGNMENT_NOT_FOUND",
            },
          };
        }

        // Préparer les données de mise à jour
        const updateData: any = {};

        // Appliquer les mises à jour seulement si fournies
        if (data.subjectId !== undefined) updateData.subjectId = data.subjectId;
        if (data.professeurId !== undefined)
          updateData.professeurId = data.professeurId;
        if (data.classLevel !== undefined) {
          // Validation du niveau de classe
          if (!isValidClassLevel(data.classLevel)) {
            throw {
              status: 400,
              response: {
                success: false,
                message: "Niveau de classe invalide",
                code: "INVALID_CLASS_LEVEL",
                data: {
                  received: data.classLevel,
                  validLevels: VALID_CLASS_LEVELS,
                },
              },
            };
          }
          updateData.classLevel = data.classLevel;
        }
        if (data.academicYearId !== undefined)
          updateData.academicYearId = data.academicYearId;
        if (data.status !== undefined) updateData.status = data.status;

        // Vérifier s'il y a des changements
        const hasChanges = Object.keys(updateData).length > 0;
        if (!hasChanges) {
          return {
            success: true,
            message: "Aucune modification nécessaire",
            data: { assignment: existingAssignment },
          };
        }

        // Déterminer les valeurs finales pour la vérification d'unicité
        const finalSubjectId = data.subjectId || existingAssignment.subjectId;
        const finalClassLevel =
          data.classLevel || existingAssignment.classLevel;
        const finalAcademicYearId =
          data.academicYearId || existingAssignment.academicYearId;
        const finalProfesseurId =
          data.professeurId || existingAssignment.professeurId;

        // Vérification de l'unicité (sauf si c'est la même assignation)
        const duplicateAssignment = await tx.classAssignment.findFirst({
          where: {
            id: { not: id },
            subjectId: finalSubjectId,
            classLevel: finalClassLevel,
            academicYearId: finalAcademicYearId,
            professeurId: finalProfesseurId,
          },
        });

        if (duplicateAssignment) {
          throw {
            status: 409,
            response: {
              success: false,
              message: "Cette assignation existe déjà",
              code: "ASSIGNMENT_EXISTS",
              data: {
                existingId: duplicateAssignment.id,
              },
            },
          };
        }

        // Vérifier les nouvelles relations si fournies
        let newAcademicYear = null;

        //  Le professeur peut-il enseigner cette matière?
        if (data.subjectId || data.professeurId) {
          const checkSubjectId = data.subjectId || existingAssignment.subjectId;
          const checkProfesseurId =
            data.professeurId || existingAssignment.professeurId;
          const checkClassLevel =
            data.classLevel || existingAssignment.classLevel;

          const teachingValidation = await this.canProfesseurTeachSubject(
            tx,
            checkProfesseurId,
            checkSubjectId,
            checkClassLevel as ClassLevel
          );

          if (!teachingValidation.canTeach) {
            throw {
              status: 400,
              response: {
                success: false,
                message:
                  teachingValidation.reason ||
                  "Le professeur ne peut pas enseigner cette matière",
                code: "PROFESSEUR_CANNOT_TEACH_SUBJECT",
                data: {
                  professeurId: checkProfesseurId,
                  subjectId: checkSubjectId,
                  classLevel: checkClassLevel,
                  recommendations: teachingValidation.recommendations,
                },
              },
            };
          }
        }

        if (data.academicYearId) {
          newAcademicYear = await tx.academicYear.findUnique({
            where: { id: data.academicYearId },
          });
          if (!newAcademicYear) {
            throw {
              status: 404,
              response: {
                success: false,
                message: "Année académique non trouvée",
                code: "ACADEMIC_YEAR_NOT_FOUND",
              },
            };
          }
        }

        // Vérifier la charge de travail si le professeur change
        if (
          data.professeurId &&
          data.professeurId !== existingAssignment.professeurId
        ) {
          const professorAssignmentsCount = await tx.classAssignment.count({
            where: {
              professeurId: data.professeurId,
              academicYearId: finalAcademicYearId,
              status: "Active",
            },
          });

          if (professorAssignmentsCount >= MAX_ASSIGNMENTS_PER_PROFESSOR) {
            throw {
              status: 400,
              response: {
                success: false,
                message: `Le professeur a déjà ${professorAssignmentsCount} assignations actives (maximum: ${MAX_ASSIGNMENTS_PER_PROFESSOR})`,
                code: "TOO_MANY_ASSIGNMENTS",
              },
            };
          }
        }

        // Données d'audit
        if (userId) {
          updateData.updatedById = userId;
          updateData.updatedAt = new Date();
        }

        // Mettre à jour l'assignation
        const assignment = await tx.classAssignment.update({
          where: { id },
          data: updateData,
          include: {
            subject: true,
            professeur: true,
            academicYear: true,
          },
        });

        // Log des changements
        const changedFields = Object.keys(updateData).filter(
          (key) => updateData[key] !== (existingAssignment as any)[key]
        );

        return {
          success: true,
          message: "Assignation mise à jour avec succès",
          data: { assignment },
        };
      } catch (error: any) {
        if (
          error.status === 404 ||
          error.status === 409 ||
          error.status === 400
        ) {
          throw error;
        }

        console.error("Error updating class assignment:", error);
        throw {
          status: 500,
          response: {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_SERVER_ERROR",
          },
        };
      }
    });
  }

  /**
   * Supprime une assignation avec vérification des dépendances
   */
  static async deleteClassAssignment(
    id: string,
    userId?: string
  ): Promise<ApiResponse> {
    return await prisma.$transaction(async (tx: any) => {
      try {
        // Validation de l'ID
        if (!id || id.trim().length === 0) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "L'ID est requis",
              code: "ID_REQUIRED",
            },
          };
        }

        // Vérifier si l'assignation existe avec les dépendances
        const assignment = await tx.classAssignment.findUnique({
          where: { id },
          include: {
            subject: true,
            professeur: true,
            _count: {
              select: {
                schedules: true,
                grades: true,
              },
            },
          },
        });

        if (!assignment) {
          throw {
            status: 404,
            response: {
              success: false,
              message: "Assignation non trouvée",
              code: "ASSIGNMENT_NOT_FOUND",
            },
          };
        }

        // Vérifier les dépendances avec des messages détaillés
        if (assignment._count.schedules > 0) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "Impossible de supprimer: des cours sont planifiés",
              code: "HAS_SCHEDULES",
              data: {
                schedulesCount: assignment._count.schedules,
                suggestion:
                  "Supprimez d'abord les cours planifiés avant de supprimer cette assignation.",
              },
            },
          };
        }

        if (assignment._count.grades > 0) {
          throw {
            status: 400,
            response: {
              success: false,
              message: "Impossible de supprimer: des notes sont associées",
              code: "HAS_GRADES",
              data: {
                gradesCount: assignment._count.grades,
                suggestion:
                  "Archivez les notes ou transférez-les à une autre assignation avant de supprimer.",
              },
            },
          };
        }

        // Hard delete
        await tx.classAssignment.delete({
          where: { id },
        });

        return {
          success: true,
          message: "Assignation supprimée avec succès",
          data: {
            deletedId: id,
            subjectName: assignment.subject?.name,
            professeurName: `${assignment.professeur?.firstName} ${assignment.professeur?.lastName}`,
            classLevel: assignment.classLevel,
          },
        };
      } catch (error: any) {
        if (error.status === 404 || error.status === 400) {
          throw error;
        }

        throw {
          status: 500,
          response: {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_SERVER_ERROR",
          },
        };
      }
    });
  }

  /**
   * Récupère les assignations d'un professeur
   */
  static async getClassAssignmentsByProfessor(
    professeurId: string,
    academicYearId?: string
  ): Promise<ApiResponse> {
    try {
      // Validation de l'ID
      if (!professeurId || professeurId.trim().length === 0) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "L'ID du professeur est requis",
            code: "PROFESSEUR_ID_REQUIRED",
          },
        };
      }

      const where: any = {
        professeurId,
      };

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      // Vérifier d'abord si le professeur existe
      const professeur = await prisma.professeur.findUnique({
        where: { id: professeurId },
      });

      if (!professeur) {
        throw {
          status: 404,
          response: {
            success: false,
            message: "Professeur non trouvé",
            code: "PROFESSEUR_NOT_FOUND",
          },
        };
      }

      const assignments = await prisma.classAssignment.findMany({
        where,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              coefficient: true,
            },
          },
          academicYear: true,
          _count: {
            select: {
              schedules: true,
              grades: true,
            },
          },
        },
        orderBy: [
          { academicYear: { startDate: "desc" } },
          { classLevel: "asc" },
        ],
      });

      // Vérifier les conflits d'emploi du temps
      const assignmentsWithScheduleConflicts = await Promise.all(
        assignments.map(async (assignment) => {
          const schedules = await prisma.schedule.findMany({
            where: { classAssignment: { id: assignment.id } },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          });

          // Logique de détection de conflits (simplifiée)
          const hasConflicts = schedules.some((schedule, index) => {
            return schedules.slice(index + 1).some((otherSchedule) => {
              return (
                schedule.dayOfWeek === otherSchedule.dayOfWeek &&
                ((schedule.startTime >= otherSchedule.startTime &&
                  schedule.startTime < otherSchedule.endTime) ||
                  (otherSchedule.startTime >= schedule.startTime &&
                    otherSchedule.startTime < schedule.endTime))
              );
            });
          });

          return {
            ...assignment,
            hasScheduleConflicts: hasConflicts,
          };
        })
      );

      return {
        success: true,
        message: "Assignations du professeur récupérées",
        data: {
          professeur: {
            id: professeur.id,
            firstName: professeur.firstName,
            lastName: professeur.lastName,
            email: professeur.email,
            status: professeur.status,
          },
          assignments: assignmentsWithScheduleConflicts,
          total: assignments.length,
        },
      };
    } catch (error: any) {
      if (error.status === 404 || error.status === 400) throw error;

      console.error("Error fetching class assignments by professor:", error);
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  /**
   * Récupère les assignations disponibles pour un niveau
   */
  static async getAvailableAssignments(
    classLevel: string,
    academicYearId?: string,
    filters?: { search?: string; limit?: number; professeurId?: string }
  ): Promise<ApiResponse> {
    try {
      if (!classLevel) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Le niveau de classe est requis",
            code: "CLASS_LEVEL_REQUIRED",
          },
        };
      }

      if (!isValidClassLevel(classLevel)) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Niveau de classe invalide",
            code: "INVALID_CLASS_LEVEL",
            data: {
              received: classLevel,
              validLevels: VALID_CLASS_LEVELS,
            },
          },
        };
      }

      const where: any = {
        classLevel,
        status: "Active",
      };

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      // Assignations existantes
      const existingAssignments = await prisma.classAssignment.findMany({
        where,
        select: {
          subjectId: true,
          professeurId: true,
        },
      });

      const assignedSubjectIds = existingAssignments.map(
        (a: { subjectId: any }) => a.subjectId
      );
      const assignedProfesseurIds = existingAssignments.map(
        (a: { professeurId: any }) => a.professeurId
      );

      // Filtres pour les requêtes
      const searchFilter = filters?.search || "";
      const limitFilter = filters?.limit || 50;
      const professeurIdParam = filters?.professeurId;

      // Récupérer les matières que le professeur peut enseigner
      let availableSubjects = [];

      if (professeurIdParam) {
        // Si un professeur est spécifié, ne récupérer que ses matières
        const professeurSubjectsWhere: any = {
          professeurId: professeurIdParam,
        };

        if (searchFilter) {
          professeurSubjectsWhere.subject = {
            OR: [
              {
                name: { contains: searchFilter },
              },
              {
                code: { contains: searchFilter },
              },
            ],
          };
        }

        const professeurSubjects = await prisma.professeurSubject.findMany({
          where: professeurSubjectsWhere,
          include: {
            subject: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
                coefficient: true,
                description: true,
              },
            },
          },
          orderBy: {
            subject: { name: "asc" },
          },
          take: limitFilter,
        });

        availableSubjects = professeurSubjects
          .map((ps) => ps.subject)
          .filter((subject) => !assignedSubjectIds.includes(subject.id));
      } else {
        // Sinon, récupérer toutes les matières
        const subjectWhere: any = {};
        if (searchFilter) {
          subjectWhere.OR = [
            { name: { contains: searchFilter } },
            { code: { contains: searchFilter } },
          ];
        }

        const allSubjects = await prisma.subject.findMany({
          where: subjectWhere,
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            coefficient: true,
            description: true,
          },
          orderBy: { name: "asc" },
          take: limitFilter,
        });

        availableSubjects = allSubjects.filter(
          (subject) => !assignedSubjectIds.includes(subject.id)
        );
      }

      // Récupérer les professeurs disponibles
      const professeurWhere: any = {
        status: "Actif",
      };

      if (searchFilter) {
        professeurWhere.OR = [
          {
            firstName: { contains: searchFilter },
          },
          {
            lastName: { contains: searchFilter },
          },
          { email: { contains: searchFilter } },
        ];
      }

      if (academicYearId && !professeurIdParam) {
        professeurWhere.id = {
          notIn: assignedProfesseurIds,
        };
      }

      const professeurs = await prisma.professeur.findMany({
        where: professeurWhere,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          speciality: true,
          matricule: true,
        },
        orderBy: { lastName: "asc" },
        take: limitFilter,
      });

      // Années académiques actives
      const academicYears = await prisma.academicYear.findMany({
        where: {
          isCurrent: true,
        },
        select: {
          id: true,
          year: true,
          startDate: true,
          endDate: true,
        },
        orderBy: { year: "desc" },
      });

      return {
        success: true,
        message: "Données pour assignation récupérées",
        data: {
          subjects: availableSubjects,
          professeurs,
          academicYears,
          assignedSubjectIds,
          classLevel,
          academicYearId: academicYearId || academicYears[0]?.id,
          professeurId: professeurIdParam,
          filters: {
            search: searchFilter,
            limit: limitFilter,
          },
        },
      };
    } catch (error: any) {
      if (error.status === 400) throw error;

      console.error("Error fetching available assignments:", error);
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  /**
   * Récupère les assignations d'une classe
   */
  static async getClassAssignmentsByClass(
    classId: string,
    academicYearId?: string,
    level?: string
  ): Promise<ApiResponse> {
    try {
      // Validation de l'ID
      if (!classId || classId.trim().length === 0) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "L'ID de la classe est requis",
            code: "CLASS_ID_REQUIRED",
          },
        };
      }

      // Trouver le niveau de la classe
      const schoolClass = await prisma.schoolClass.findUnique({
        where: { id: classId },
      });

      if (!schoolClass) {
        throw {
          status: 404,
          response: {
            success: false,
            message: "Classe non trouvée",
            code: "CLASS_NOT_FOUND",
          },
        };
      }

      const where: any = {
        classLevel: level || schoolClass.level,
      };

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      const assignments = await prisma.classAssignment.findMany({
        where,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              coefficient: true,
            },
          },
          professeur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          academicYear: true,
          _count: {
            select: {
              schedules: true,
            },
          },
        },
        orderBy: {
          subject: { name: "asc" },
        },
      });

      return {
        success: true,
        message: "Assignations de la classe récupérées",
        data: {
          class: schoolClass,
          assignments,
          total: assignments.length,
        },
      };
    } catch (error: any) {
      if (error.status === 404 || error.status === 400) throw error;

      console.error("Error fetching class assignments by class:", error);
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  /**
   * Récupère les assignations d'une classe et d'un niveau spécifiques
   */
  static async getClassAssignmentsByClassAndLevel(
    classId: string,
    classLevel: string,
    academicYearId?: string
  ): Promise<ApiResponse> {
    try {
      if (!classId || classId.trim().length === 0) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "L'ID de la classe est requis",
            code: "CLASS_ID_REQUIRED",
          },
        };
      }

      if (!classLevel) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Le niveau est requis",
            code: "LEVEL_REQUIRED",
          },
        };
      }

      if (!isValidClassLevel(classLevel)) {
        throw {
          status: 400,
          response: {
            success: false,
            message: "Niveau de classe invalide",
            code: "INVALID_CLASS_LEVEL",
            data: {
              received: classLevel,
              validLevels: VALID_CLASS_LEVELS,
            },
          },
        };
      }

      const where: any = {
        classLevel: classLevel,
      };

      if (academicYearId) {
        where.academicYearId = academicYearId;
      }

      const assignments = await prisma.classAssignment.findMany({
        where,
        include: {
          subject: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
              coefficient: true,
            },
          },
          professeur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          academicYear: true,
          _count: {
            select: {
              schedules: true,
            },
          },
        },
        orderBy: {
          subject: { name: "asc" },
        },
      });

      return {
        success: true,
        message: "Assignations filtrées récupérées",
        data: {
          assignments,
          total: assignments.length,
          classId,
          classLevel,
        },
      };
    } catch (error: any) {
      if (error.status === 400) throw error;

      console.error(
        "Error fetching class assignments by class and level:",
        error
      );
      throw {
        status: 500,
        response: {
          success: false,
          message: "Erreur interne du serveur",
          code: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }
}
