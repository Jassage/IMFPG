/**
 * @file professeurService.ts
 * @description Services pour la gestion des professeurs
 * @version 1.1.0 - Compatible Haïti
 */

import { PrismaClient, UserStatus } from "../../generated/prisma";
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "./emailService";

const prisma = new PrismaClient();

// Codes d'erreur standardisés
export const PROFESSEUR_ERRORS = {
  // Validation
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
  INVALID_PHONE_FORMAT: "INVALID_PHONE_FORMAT",
  INVALID_NAME_FORMAT: "INVALID_NAME_FORMAT",
  FIRSTNAME_TOO_SHORT: "FIRSTNAME_TOO_SHORT",
  LASTNAME_TOO_SHORT: "LASTNAME_TOO_SHORT",
  INVALID_SPECIALITY: "INVALID_SPECIALITY",

  // Unicité
  PROFESSEUR_EMAIL_EXISTS: "PROFESSEUR_EMAIL_EXISTS",
  PROFESSEUR_MATRICULE_EXISTS: "PROFESSEUR_MATRICULE_EXISTS",
  USER_EMAIL_EXISTS: "USER_EMAIL_EXISTS",
  USER_ALREADY_ASSOCIATED: "USER_ALREADY_ASSOCIATED",

  // Références
  PROFESSEUR_NOT_FOUND: "PROFESSEUR_NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  SUBJECT_NOT_FOUND: "SUBJECT_NOT_FOUND",
  ACADEMIC_YEAR_NOT_FOUND: "ACADEMIC_YEAR_NOT_FOUND",
  CLASS_NOT_FOUND: "CLASS_NOT_FOUND",

  // Métier
  PROFESSEUR_HAS_DEPENDENCIES: "PROFESSEUR_HAS_DEPENDENCIES",
  PROFESSEUR_ACTIVE_ASSIGNMENTS: "PROFESSEUR_ACTIVE_ASSIGNMENTS",
  PROFESSEUR_ACTIVE_SCHEDULES: "PROFESSEUR_ACTIVE_SCHEDULES",
  NO_USER_ACCOUNT: "NO_USER_ACCOUNT",
  USER_ALREADY_PROFESSEUR: "USER_ALREADY_PROFESSEUR",
  CANNOT_DELETE_ACTIVE: "CANNOT_DELETE_ACTIVE",
  NO_USER_SPECIFIED: "NO_USER_SPECIFIED",

  // Import/Email
  IMPORT_VALIDATION_FAILED: "IMPORT_VALIDATION_FAILED",
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",

  // Système
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  DATABASE_ERROR: "DATABASE_ERROR",
  CONCURRENT_MODIFICATION: "CONCURRENT_MODIFICATION",
} as const;

// Messages de succès standardisés
export const PROFESSEUR_SUCCESS = {
  CREATED: "PROFESSEUR_CREATED_SUCCESSFULLY",
  UPDATED: "PROFESSEUR_UPDATED_SUCCESSFULLY",
  DELETED: "PROFESSEUR_DELETED_SUCCESSFULLY",
  ACTIVATED: "PROFESSEUR_ACTIVATED_SUCCESSFULLY",
  DEACTIVATED: "PROFESSEUR_DEACTIVATED_SUCCESSFULLY",
  USER_ATTACHED: "USER_ATTACHED_SUCCESSFULLY",
  USER_DETACHED: "USER_DETACHED_SUCCESSFULLY",
  CREDENTIALS_SENT: "CREDENTIALS_SENT_SUCCESSFULLY",
  BULK_IMPORT_COMPLETE: "BULK_IMPORT_COMPLETE",
} as const;

export interface ProfesseurFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  speciality?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProfesseurData {
  address: any;
  qualifications: any;
  hireDate: any;
  subjects?: Array<{
    subjectId: string;
    isPrimary?: boolean;
    yearsOfExperience?: number;
  }>;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  speciality?: string;
  matricule?: string;
  userId?: string | null;
  createUserAccount?: boolean;
  sendInvitation?: boolean;
}

export interface UpdateProfesseurData {
  address?: any;
  qualifications?: any;
  hireDate?: any;
  subjects?: Array<{
    subjectId: string;
    isPrimary?: boolean;
    yearsOfExperience?: number;
  }>;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  matricule?: string;
  status?: string;
  userId?: string | null;
}

// Classes d'erreur spécifiques
export class ProfesseurError extends Error {
  constructor(
    public code: keyof typeof PROFESSEUR_ERRORS,
    message: string,
    public details?: any,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "ProfesseurError";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Utilitaires de validation pour Haïti
 */
class ValidationUtils {
  /**
   * Valide le format d'email
   */
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Valide le format de téléphone haïtien
   * Formats acceptés:
   * - +509XXXXXXXX (13 caractères)
   * - 509XXXXXXXX (12 caractères)
   * - 0XXXXXXXX (9 caractères)
   * - XXXXXXXXX (8-9 caractères)
   */
  /**
   * Valide le format de téléphone haïtien
   * Formats acceptés:
   * - +509XXXXXXXX (13 caractères sans espaces)
   * - 509XXXXXXXX (12 caractères sans espaces)
   * - 0XXXXXXXX (9 caractères)
   * - XXXXXXXXX (8-9 caractères)
   * - Formats avec espaces/parentheses/tirets qui peuvent être nettoyés
   */
  static isValidPhone(phone?: string): boolean {
    if (!phone || phone.trim() === "") return true;

    // Nettoyer le numéro
    const cleanedPhone = phone.trim().replace(/[^\d+]/g, "");

    // Vérifier la longueur après nettoyage
    if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
      return false;
    }

    // Pour les numéros avec +, vérifier le format
    if (cleanedPhone.startsWith("+")) {
      const withoutPlus = cleanedPhone.substring(1);
      if (!/^\d+$/.test(withoutPlus)) {
        return false;
      }

      // Format +509XXXXXXXX (13 caractères)
      if (cleanedPhone.startsWith("+509") && cleanedPhone.length === 13) {
        return true;
      }

      // Autres formats internationaux
      return cleanedPhone.length >= 10 && cleanedPhone.length <= 15;
    }

    // Pour les numéros sans +
    if (!/^\d+$/.test(cleanedPhone)) {
      return false;
    }

    // Format 509XXXXXXXX (12 caractères)
    if (cleanedPhone.startsWith("509") && cleanedPhone.length === 12) {
      return true;
    }

    // Format 0XXXXXXXX (9 caractères)
    if (cleanedPhone.startsWith("0") && cleanedPhone.length === 9) {
      return true;
    }

    // Format XXXXXXXXX (8-9 caractères)
    if (cleanedPhone.length >= 8 && cleanedPhone.length <= 9) {
      return true;
    }

    return false;
  }
  /**
   * Formate un numéro de téléphone pour le stockage
   */
  static formatPhoneForStorage(phone?: string): string | null {
    if (!phone || phone.trim() === "") return null;

    // Supprimer tous les caractères non numériques sauf le +
    const cleanedPhone = phone.trim().replace(/[^\d+]/g, "");

    // Si le numéro commence par +, vérifier s'il est correct
    if (cleanedPhone.startsWith("+")) {
      // Si c'est déjà +509XXXXXXXX, le retourner
      if (cleanedPhone.startsWith("+509") && cleanedPhone.length === 13) {
        return cleanedPhone;
      }
      // Sinon, continuer le traitement
    }

    // Extraire seulement les chiffres
    const digits = cleanedPhone.replace(/\D/g, "");

    // Si nous avons +509 suivi de 8 chiffres
    if (cleanedPhone.startsWith("+509") && digits.length === 11) {
      return cleanedPhone; // Garder le format +509XXXXXXXX
    }

    // Format 509XXXXXXXX (12 caractères sans le +)
    if (digits.startsWith("509") && digits.length === 12) {
      return `+${digits}`;
    }

    // Format 0XXXXXXXX (9 caractères)
    if (digits.startsWith("0") && digits.length === 9) {
      return `+509${digits.substring(1)}`;
    }

    // Format XXXXXXXXX (8-9 caractères sans indicatif)
    if (digits.length >= 8 && digits.length <= 9) {
      const localNumber = digits.length === 8 ? `0${digits}` : digits;
      return `+509${localNumber.substring(1)}`;
    }

    // Pour les numéros internationaux déjà formatés avec +
    if (
      cleanedPhone.startsWith("+") &&
      cleanedPhone.length >= 10 &&
      cleanedPhone.length <= 15
    ) {
      return cleanedPhone;
    }

    // Si aucun format ne correspond, retourner les chiffres avec l'indicatif haïtien par défaut
    if (digits.length >= 8 && digits.length <= 9) {
      const localNumber = digits.length === 8 ? `0${digits}` : digits;
      return `+509${localNumber.substring(1)}`;
    }

    // Fallback: retourner les chiffres nettoyés
    return digits.length > 0 ? `+${digits}` : null;
  }

  /**
   * Valide un nom (prénom ou nom de famille)
   */
  static isValidName(name: string): boolean {
    if (!name || name.trim().length < 2) return false;

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) return false;

    // Lettres, espaces, tirets, apostrophes, accents
    const nameRegex = /^[A-Za-zÀ-ÿ\s\-']+$/;
    return nameRegex.test(trimmedName);
  }

  /**
   * Valide une spécialité
   */
  static isValidSpeciality(speciality?: string): boolean {
    if (!speciality || speciality.trim() === "") return true;

    const trimmedSpeciality = speciality.trim();
    if (trimmedSpeciality.length < 2 || trimmedSpeciality.length > 100) {
      return false;
    }

    return true;
  }

  /**
   * Valide un matricule
   */
  static isValidMatricule(matricule?: string): boolean {
    if (!matricule || matricule.trim() === "") return true;

    const trimmedMatricule = matricule.trim().toUpperCase();
    if (trimmedMatricule.length < 3 || trimmedMatricule.length > 20) {
      return false;
    }

    // Format: lettres et chiffres, peut contenir des tirets
    const matriculeRegex = /^[A-Z0-9\-]+$/;
    return matriculeRegex.test(trimmedMatricule);
  }
}

/**
 * Validation des données des professeurs
 */
const validateProfesseurData = (
  data: CreateProfesseurData | UpdateProfesseurData,
  isUpdate: boolean = false
): void => {
  const errors: { code: string; field: string; message: string }[] = [];

  // Validation pour la création
  if (!isUpdate) {
    if (!data.firstName?.trim()) {
      errors.push({
        code: PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        field: "firstName",
        message: "Le prénom est requis",
      });
    } else if (!ValidationUtils.isValidName(data.firstName)) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_NAME_FORMAT,
        field: "firstName",
        message: "Format de prénom invalide",
      });
    }

    if (!data.lastName?.trim()) {
      errors.push({
        code: PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        field: "lastName",
        message: "Le nom est requis",
      });
    } else if (!ValidationUtils.isValidName(data.lastName)) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_NAME_FORMAT,
        field: "lastName",
        message: "Format de nom invalide",
      });
    }

    if (!data.email?.trim()) {
      errors.push({
        code: PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        field: "email",
        message: "L'email est requis",
      });
    } else if (!ValidationUtils.isValidEmail(data.email)) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_EMAIL_FORMAT,
        field: "email",
        message: "Format d'email invalide",
      });
    }
  }

  // Validation pour la mise à jour
  if (isUpdate) {
    if (
      data.firstName !== undefined &&
      data.firstName.trim() &&
      !ValidationUtils.isValidName(data.firstName)
    ) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_NAME_FORMAT,
        field: "firstName",
        message: "Format de prénom invalide",
      });
    }

    if (
      data.lastName !== undefined &&
      data.lastName.trim() &&
      !ValidationUtils.isValidName(data.lastName)
    ) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_NAME_FORMAT,
        field: "lastName",
        message: "Format de nom invalide",
      });
    }

    if (
      data.email !== undefined &&
      data.email.trim() &&
      !ValidationUtils.isValidEmail(data.email)
    ) {
      errors.push({
        code: PROFESSEUR_ERRORS.INVALID_EMAIL_FORMAT,
        field: "email",
        message: "Format d'email invalide",
      });
    }
  }

  // Validation commune
  if (data.phone && !ValidationUtils.isValidPhone(data.phone)) {
    errors.push({
      code: PROFESSEUR_ERRORS.INVALID_PHONE_FORMAT,
      field: "phone",
      message:
        "Format de téléphone invalide. Formats acceptés: +509XXXXXXXX, 509XXXXXXXX, 0XXXXXXXX, XXXXXXXXX (8-9 chiffres). Les espaces, tirets et parenthèses sont acceptés.",
    });
  }

  if (data.speciality && !ValidationUtils.isValidSpeciality(data.speciality)) {
    errors.push({
      code: PROFESSEUR_ERRORS.INVALID_SPECIALITY,
      field: "speciality",
      message: "La spécialité doit contenir entre 2 et 100 caractères",
    });
  }

  if (data.matricule && !ValidationUtils.isValidMatricule(data.matricule)) {
    errors.push({
      code: "INVALID_MATRICULE_FORMAT",
      field: "matricule",
      message:
        "Format de matricule invalide. Utilisez des lettres, chiffres et tirets (3-20 caractères)",
    });
  }

  if (errors.length > 0) {
    // Déterminer le code d'erreur principal basé sur la première erreur
    const mainErrorCode = (errors[0]?.code ||
      PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS) as keyof typeof PROFESSEUR_ERRORS;
    const errorMessages = errors.map((e) => e.message).join(", ");

    throw new ProfesseurError(
      mainErrorCode,
      `Validation échouée: ${errorMessages}`,
      { errors },
      422
    );
  }
};

/**
 * @desc Récupère la liste des professeurs avec pagination et filtres
 */
export const getProfesseursService = async (filters: ProfesseurFilters) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      speciality,
      sortBy = "lastName",
      sortOrder = "asc",
    } = filters;

    const pageNum = Math.max(1, parseInt(page as any));
    const limitNum = Math.min(Math.max(1, parseInt(limit as any)), 100);
    const skip = (pageNum - 1) * limitNum;

    // Validation des paramètres
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.INVALID_EMAIL_FORMAT,
        "Paramètres de pagination invalides",
        { page: pageNum, limit: limitNum }
      );
    }

    // Filtres
    const where: any = {
      status: {}, // Exclure les archives par défaut
    };

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { firstName: { contains: searchStr } },
        { lastName: { contains: searchStr } },
        { email: { contains: searchStr } },
        { matricule: { contains: searchStr } },
        { phone: { contains: searchStr } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (speciality && speciality !== "all") {
      where.speciality = {
        contains: speciality,
      };
    }

    // Récupération avec pagination
    const [professeurs, total] = await Promise.all([
      prisma.professeur.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              lastLogin: true,
            },
          },
          assignments: {
            take: 3,
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          subjectsTaught: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
            orderBy: [{ isPrimary: "desc" }],
            take: 3,
          },
          _count: {
            select: {
              assignments: true,
              schedules: true,
              subjectsTaught: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder === "desc" ? "desc" : "asc",
        },
        skip,
        take: limitNum,
      }),
      prisma.professeur.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      success: true,
      data: professeurs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      metadata: {
        totalActive: await prisma.professeur.count({
          where: { status: "Actif" },
        }),
        totalInactive: await prisma.professeur.count({
          where: { status: "Inactif" },
        }),
      },
    };
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans getProfesseursService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.DATABASE_ERROR,
      "Erreur lors de la récupération des professeurs",
      { error: error.message }
    );
  }
};

/**
 * @desc Récupère un professeur par ID
 */
export const getProfesseurByIdService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis",
        { field: "id" }
      );
    }

    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        subjectsTaught: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
          },
          orderBy: [{ isPrimary: "desc" }],
        },
        assignments: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
            academicYear: {
              select: {
                id: true,
                year: true,
                isCurrent: true,
              },
            },
            schedules: {
              include: {
                schoolClass: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        schedules: {
          include: {
            classAssignment: {
              include: {
                subject: true,
                academicYear: true,
              },
            },
            schoolClass: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        _count: {
          select: {
            assignments: true,
            schedules: true,
            subjectsTaught: true,
          },
        },
      },
    });

    if (!professeur) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
        "Professeur non trouvé",
        { id }
      );
    }

    // Calculer les statistiques
    const totalWeeklyHours = professeur.schedules.reduce((total, schedule) => {
      try {
        const start = new Date(`1970-01-01T${schedule.startTime}`);
        const end = new Date(`1970-01-01T${schedule.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + (isNaN(hours) ? 0 : hours);
      } catch (error) {
        return total;
      }
    }, 0);

    // Organiser l'emploi du temps par jour
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    professeur.schedules.forEach((schedule: any) => {
      const day = Number(schedule.dayOfWeek);
      if (day >= 1 && day <= 7) {
        scheduleByDay[day].push(schedule);
      }
    });

    return {
      success: true,
      data: {
        ...professeur,
        statistics: {
          totalAssignments: professeur._count.assignments,
          totalSchedules: professeur._count.schedules,
          totalSubjects: professeur._count.subjectsTaught,
          totalWeeklyHours: Math.round(totalWeeklyHours * 100) / 100,
        },
        scheduleByDay,
      },
    };
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans getProfesseurByIdService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.DATABASE_ERROR,
      "Erreur lors de la récupération du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Récupère le professeur associé à un compte utilisateur
 */
export const getProfesseurByUserIdService = async (userId: string) => {
  try {
    if (!userId) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID utilisateur requis",
        { field: "userId" }
      );
    }

    const professeur = await prisma.professeur.findUnique({
      where: { userId },
    });

    if (!professeur) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
        "Professeur non trouvé pour cet utilisateur",
        { userId }
      );
    }

    return {
      success: true,
      data: { professeur },
    };
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans getProfesseurByUserIdService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.DATABASE_ERROR,
      "Erreur lors de la récupération du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Crée un nouveau professeur avec envoi d'identifiants par email
 */
export const createProfesseurService = async (data: CreateProfesseurData) => {
  try {
    // Validation des données
    validateProfesseurData(data, false);

    const {
      firstName,
      lastName,
      email,
      phone,
      speciality,
      matricule,
      userId,
      createUserAccount = false,
      sendInvitation = true,
    } = data;

    console.log("date:", data);

    return await prisma.$transaction(async (tx) => {
      // Formater les données
      const formattedEmail = email.toLowerCase().trim();
      const formattedPhone = phone
        ? ValidationUtils.formatPhoneForStorage(phone)
        : null;
      const formattedMatricule = matricule
        ? matricule.trim().toUpperCase()
        : null;

      // Vérifier l'unicité de l'email
      const existingProfesseurByEmail = await tx.professeur.findUnique({
        where: { email: formattedEmail },
      });

      if (existingProfesseurByEmail) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_EMAIL_EXISTS,
          "Un professeur avec cet email existe déjà",
          { email: formattedEmail }
        );
      }

      // Vérifier l'unicité du matricule si fourni
      if (formattedMatricule) {
        const existingProfesseurByMatricule = await tx.professeur.findUnique({
          where: { matricule: formattedMatricule },
        });

        if (existingProfesseurByMatricule) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.PROFESSEUR_MATRICULE_EXISTS,
            "Un professeur avec ce matricule existe déjà",
            { matricule: formattedMatricule }
          );
        }
      }

      let finalUserId = userId || null;
      let userAccountCreated = false;
      let emailSent = false;
      let temporaryPassword: string | null = null;

      // Création du compte utilisateur
      if (createUserAccount && !finalUserId) {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await tx.user.findUnique({
          where: { email: formattedEmail },
        });

        if (existingUser) {
          finalUserId = existingUser.id;

          //verifier le rôle
          if (existingUser.role !== "Professeur") {
            throw new ProfesseurError(
              PROFESSEUR_ERRORS.USER_ALREADY_ASSOCIATED,
              "Cet utilisateur n'a pas le rôle de professeur",
              { email: formattedEmail }
            );
          }

          // Vérifier si cet utilisateur est déjà un professeur
          const existingProfesseurWithUser = await tx.professeur.findUnique({
            where: { userId: existingUser.id },
          });

          if (existingProfesseurWithUser) {
            throw new ProfesseurError(
              PROFESSEUR_ERRORS.USER_ALREADY_PROFESSEUR,
              "Cet utilisateur est déjà associé à un professeur"
            );
          }
        } else {
          temporaryPassword = "Professeur123"; // Mot de passe par défaut plus sûr
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

          // Créer l'utilisateur
          const user = await tx.user.create({
            data: {
              email: formattedEmail,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              role: "Professeur",
              status: UserStatus.Actif,
              password: hashedPassword,
              isInitialPassword: true,
            },
          });

          finalUserId = user.id;
          userAccountCreated = true;
        }
      }

      // Si un userId est fourni, vérifier
      if (finalUserId && !userAccountCreated) {
        const user = await tx.user.findUnique({
          where: { id: finalUserId },
        });

        if (!user) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.USER_NOT_FOUND,
            "Utilisateur non trouvé"
          );
        }

        // Vérifier si l'utilisateur est déjà un professeur
        const existingProfesseurWithUser = await tx.professeur.findUnique({
          where: { userId: finalUserId },
        });

        if (existingProfesseurWithUser) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.USER_ALREADY_PROFESSEUR,
            "Cet utilisateur est déjà associé à un professeur"
          );
        }
      }

      // Créer le professeur
      const professeurData: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: formattedEmail,
        status: "Actif",
      };

      if (formattedPhone) professeurData.phone = formattedPhone;
      if (speciality?.trim()) professeurData.speciality = speciality.trim();
      if (formattedMatricule) professeurData.matricule = formattedMatricule;
      if (finalUserId) professeurData.userId = finalUserId;
      if (data.address) professeurData.address = data.address.trim();
      if (data.qualifications)
        professeurData.qualifications = data.qualifications.trim();
      if (data.hireDate) professeurData.hireDate = new Date(data.hireDate);

      const professeur = await tx.professeur.create({
        data: professeurData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
          _count: {
            select: {
              assignments: true,
              schedules: true,
            },
          },
        },
      });

      // Ajouter les matières enseignées si spécifiées
      if (data.subjects && data.subjects.length > 0) {
        const professeurSubjects = data.subjects.map((subject) => ({
          professeurId: professeur.id,
          subjectId: subject.subjectId,
          isPrimary: subject.isPrimary || false,
          yearsOfExperience: subject.yearsOfExperience || 0,
        }));

        await tx.professeurSubject.createMany({
          data: professeurSubjects,
        });
      }

      // Récupérer le professeur avec toutes ses relations
      const professeurWithSubjects = await tx.professeur.findUnique({
        where: { id: professeur.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
          subjectsTaught: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
          _count: {
            select: {
              assignments: true,
              schedules: true,
              subjectsTaught: true,
            },
          },
        },
      });

      return {
        success: true,
        code: PROFESSEUR_SUCCESS.CREATED,
        message: "Professeur créé avec succès",
        data: {
          professeur: professeurWithSubjects,
          userAccountCreated,
          emailSent,
          ...(temporaryPassword && !emailSent && { temporaryPassword }),
        },
      };
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans createProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de la création du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Met à jour un professeur
 */
export const updateProfesseurService = async (
  id: string,
  data: UpdateProfesseurData
) => {
  try {
    // Validation des données
    validateProfesseurData(data, true);

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const existingProfesseur = await tx.professeur.findUnique({
        where: { id },
      });

      if (!existingProfesseur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { id }
        );
      }

      // Préparer les données formatées
      const formattedEmail = data.email
        ? data.email.toLowerCase().trim()
        : existingProfesseur.email;

      const formattedPhone =
        data.phone !== undefined
          ? ValidationUtils.formatPhoneForStorage(data.phone)
          : existingProfesseur.phone;

      const formattedMatricule =
        data.matricule !== undefined
          ? data.matricule.trim().toUpperCase()
          : existingProfesseur.matricule;

      // Vérifier l'unicité de l'email si modifié
      if (data.email && formattedEmail !== existingProfesseur.email) {
        const professeurWithEmail = await tx.professeur.findUnique({
          where: { email: formattedEmail },
        });

        if (professeurWithEmail && professeurWithEmail.id !== id) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.PROFESSEUR_EMAIL_EXISTS,
            "Un professeur avec cet email existe déjà",
            { email: formattedEmail }
          );
        }
      }

      // Vérifier l'unicité du matricule si modifié
      if (
        data.matricule &&
        formattedMatricule !== existingProfesseur.matricule
      ) {
        if (formattedMatricule) {
          const professeurWithMatricule = await tx.professeur.findUnique({
            where: { matricule: formattedMatricule },
          });

          if (professeurWithMatricule && professeurWithMatricule.id !== id) {
            throw new ProfesseurError(
              PROFESSEUR_ERRORS.PROFESSEUR_MATRICULE_EXISTS,
              "Un professeur avec ce matricule existe déjà",
              { matricule: formattedMatricule }
            );
          }
        }
      }

      // Préparer les données de mise à jour
      const updateData: any = {};

      if (data.firstName !== undefined)
        updateData.firstName = data.firstName.trim();
      if (data.lastName !== undefined)
        updateData.lastName = data.lastName.trim();
      if (data.email !== undefined) updateData.email = formattedEmail;
      if (data.phone !== undefined) updateData.phone = formattedPhone;
      if (data.speciality !== undefined)
        updateData.speciality = data.speciality?.trim();
      if (data.matricule !== undefined)
        updateData.matricule = formattedMatricule;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.address !== undefined) updateData.address = data.address?.trim();
      if (data.qualifications !== undefined)
        updateData.qualifications = data.qualifications?.trim();
      if (data.hireDate !== undefined) {
        updateData.hireDate = data.hireDate ? new Date(data.hireDate) : null;
      }

      // Gérer le userId
      if (data.userId !== undefined) {
        if (data.userId === null || data.userId === "") {
          updateData.userId = null;
        } else {
          // Vérifier si l'utilisateur existe
          const user = await tx.user.findUnique({
            where: { id: data.userId },
          });

          if (!user) {
            throw new ProfesseurError(
              PROFESSEUR_ERRORS.USER_NOT_FOUND,
              "Utilisateur non trouvé",
              { userId: data.userId }
            );
          }

          // Vérifier si cet utilisateur est déjà associé à un autre professeur
          if (data.userId !== existingProfesseur.userId) {
            const existingProfesseurWithUser = await tx.professeur.findUnique({
              where: { userId: data.userId },
            });

            if (existingProfesseurWithUser) {
              throw new ProfesseurError(
                PROFESSEUR_ERRORS.USER_ALREADY_ASSOCIATED,
                "Cet utilisateur est déjà associé à un autre professeur",
                { userId: data.userId }
              );
            }
          }

          updateData.userId = data.userId;
        }
      }

      // Mettre à jour le professeur
      const professeur = await tx.professeur.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Mettre à jour l'email de l'utilisateur associé si nécessaire
      if (data.email && professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { email: formattedEmail },
        });
      }

      // Gérer les matières enseignées
      if (data.subjects !== undefined) {
        // Supprimer toutes les matières existantes
        await tx.professeurSubject.deleteMany({
          where: { professeurId: id },
        });

        // Ajouter les nouvelles matières
        if (data.subjects.length > 0) {
          const professeurSubjects = data.subjects.map((subject) => ({
            professeurId: id,
            subjectId: subject.subjectId,
            isPrimary: subject.isPrimary || false,
            yearsOfExperience: subject.yearsOfExperience || 0,
          }));

          await tx.professeurSubject.createMany({
            data: professeurSubjects,
          });
        }
      }

      // Récupérer le professeur mis à jour avec les matières
      const updatedProfesseur = await tx.professeur.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          subjectsTaught: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
          _count: {
            select: {
              assignments: true,
              schedules: true,
              subjectsTaught: true,
            },
          },
        },
      });

      return {
        success: true,
        code: PROFESSEUR_SUCCESS.UPDATED,
        message: "Professeur mis à jour avec succès",
        data: updatedProfesseur,
      };
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans updateProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de la mise à jour du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Supprime/désactive un professeur
 */
export const deleteProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis",
        { field: "id" }
      );
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              assignments: {
                where: {
                  academicYear: {
                    isCurrent: true,
                  },
                },
              },
              schedules: true,
            },
          },
        },
      });

      if (!professeur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { id }
        );
      }

      // Vérifier les dépendances pour l'année en cours
      if (professeur._count.assignments > 0) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_ACTIVE_ASSIGNMENTS,
          "Impossible de désactiver un professeur avec des assignations en cours",
          {
            assignmentsCount: professeur._count.assignments,
            suggestion:
              "Réassignez d'abord ses cours ou attendez la fin de l'année académique",
          }
        );
      }

      // Désactiver le professeur
      await tx.professeur.update({
        where: { id },
        data: {
          status: "Inactif",
          // archivedAt: new Date()
        },
      });

      // Désactiver l'utilisateur associé si existe
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Inactif },
        });
      }

      return {
        success: true,
        code: PROFESSEUR_SUCCESS.DELETED,
        message: "Professeur désactivé avec succès",
        data: {
          assignmentsCount: professeur._count.assignments,
          schedulesCount: professeur._count.schedules,
        },
      };
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans deleteProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de la désactivation du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Active un professeur
 */
export const activateProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis",
        { field: "id" }
      );
    }

    return await prisma.$transaction(async (tx) => {
      const professeur = await tx.professeur.findUnique({
        where: { id },
      });

      if (!professeur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { id }
        );
      }

      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: {
          status: "Actif",
        },
      });

      // Activer l'utilisateur associé si existe
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Actif },
        });
      }

      return {
        success: true,
        code: PROFESSEUR_SUCCESS.ACTIVATED,
        message: "Professeur activé avec succès",
        data: updatedProfesseur,
      };
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans activateProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de l'activation du professeur",
      { error: error.message }
    );
  }
};

/**
 * @desc Génère et envoie les identifiants de connexion par email
 */
export const sendLoginCredentialsEmail = async (
  email: string,
  firstName: string,
  password: string
) => {
  try {
    if (!email || !firstName || !password) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "Données manquantes pour l'envoi d'email"
      );
    }

    if (!ValidationUtils.isValidEmail(email)) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.INVALID_EMAIL_FORMAT,
        "Format d'email invalide",
        { email }
      );
    }

    const appName = process.env.APP_NAME || "Notre Plateforme Éducative";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const loginUrl = `${frontendUrl}/auth/login`;
    const resetPasswordUrl = `${frontendUrl}/auth/reset-password`;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .credentials { background-color: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
          .password { font-family: monospace; font-size: 18px; font-weight: bold; color: #d32f2f; }
          .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue sur ${appName}</h1>
          </div>
          <div class="content">
            <p>Bonjour ${firstName},</p>
            
            <p>Votre compte professeur a été créé avec succès.</p>
            
            <div class="credentials">
              <p><strong>Vos identifiants de connexion :</strong></p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Mot de passe temporaire :</strong> <span class="password">${password}</span></p>
            </div>
            
            <p class="warning">⚠️ IMPORTANT : Ce mot de passe est temporaire. Vous devrez le changer lors de votre première connexion.</p>
            
            <p>Pour accéder à votre compte :</p>
            <ol>
              <li>Rendez-vous sur : <a href="${loginUrl}">${loginUrl}</a></li>
              <li>Connectez-vous avec vos identifiants ci-dessus</li>
              <li>Suivez les instructions pour changer votre mot de passe</li>
            </ol>
            
            <a href="${loginUrl}" class="button">Accéder à mon compte</a>
            
            <p>Si vous avez des difficultés à vous connecter, vous pouvez réinitialiser votre mot de passe ici :</p>
            <a href="${resetPasswordUrl}">Réinitialiser mon mot de passe</a>
            
            <p>Pour toute assistance, contactez l'administrateur à : ${adminEmail}</p>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: `[${appName}] Vos identifiants de connexion`,
      html,
    });

    return {
      success: true,
      code: PROFESSEUR_SUCCESS.CREDENTIALS_SENT,
      message: "Identifiants envoyés avec succès",
    };
  } catch (error: any) {
    console.error(`Erreur lors de l'envoi des identifiants à ${email}:`, error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.EMAIL_SEND_FAILED,
      "Échec de l'envoi de l'email",
      { email }
    );
  }
};

/**
 * @desc Génère un mot de passe temporaire sécurisé
 */
const generateTemporaryPassword = (): string => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  // Assurer au moins une majuscule, un chiffre et un caractère spécial
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

  // Remplir le reste
  for (let i = 3; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Mélanger
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

/**
 * @desc Associe un compte utilisateur à un professeur existant
 */
export const attachUserToProfesseurService = async (
  professeurId: string,
  options: {
    userId?: string;
    email?: string;
    createIfNotExists?: boolean;
    sendCredentialsEmail?: boolean;
  }
) => {
  try {
    const {
      userId,
      email,
      createIfNotExists = false,
      sendCredentialsEmail = true,
    } = options;

    if (!professeurId) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis",
        { field: "professeurId" }
      );
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id: professeurId },
      });

      if (!professeur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { professeurId }
        );
      }

      let finalUserId = userId;
      let userCreated = false;
      let temporaryPassword: string | null = null;
      let emailSent = false;

      // Si email fourni sans userId
      if (email && !userId) {
        if (!ValidationUtils.isValidEmail(email)) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.INVALID_EMAIL_FORMAT,
            "Format d'email invalide",
            { email }
          );
        }

        const formattedEmail = email.toLowerCase().trim();
        const existingUser = await tx.user.findUnique({
          where: { email: formattedEmail },
        });

        if (existingUser) {
          finalUserId = existingUser.id;
        } else if (createIfNotExists) {
          // Générer un mot de passe temporaire
          temporaryPassword = generateTemporaryPassword();
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

          // Créer un nouvel utilisateur
          const user = await tx.user.create({
            data: {
              email: formattedEmail,
              firstName: professeur.firstName,
              lastName: professeur.lastName,
              role: "Professeur",
              status: UserStatus.Actif,
              password: hashedPassword,
              isInitialPassword: true,
            },
          });

          finalUserId = user.id;
          userCreated = true;

          // Envoyer les identifiants
          if (sendCredentialsEmail) {
            try {
              await sendLoginCredentialsEmail(
                formattedEmail,
                professeur.firstName,
                temporaryPassword
              );
              emailSent = true;
            } catch (emailError) {
              console.warn("Échec de l'envoi d'email, mais compte créé");
            }
          }
        } else {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.USER_NOT_FOUND,
            "Utilisateur non trouvé",
            { email }
          );
        }
      }

      // Vérifier si l'utilisateur existe
      if (finalUserId) {
        const user = await tx.user.findUnique({
          where: { id: finalUserId },
        });

        if (!user) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.USER_NOT_FOUND,
            "Utilisateur non trouvé"
          );
        }

        // Vérifier si cet utilisateur est déjà associé à un autre professeur
        const existingProfesseurWithUser = await tx.professeur.findUnique({
          where: { userId: finalUserId },
        });

        if (
          existingProfesseurWithUser &&
          existingProfesseurWithUser.id !== professeurId
        ) {
          throw new ProfesseurError(
            PROFESSEUR_ERRORS.USER_ALREADY_ASSOCIATED,
            "Cet utilisateur est déjà associé à un autre professeur"
          );
        }

        // Mettre à jour le professeur
        const updatedProfesseur = await tx.professeur.update({
          where: { id: professeurId },
          data: { userId: finalUserId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                status: true,
              },
            },
          },
        });

        return {
          success: true,
          code: PROFESSEUR_SUCCESS.USER_ATTACHED,
          message: "Compte utilisateur associé avec succès",
          data: {
            professeur: updatedProfesseur,
            userAccountCreated: userCreated,
            emailSent,
            temporaryPassword:
              temporaryPassword && !emailSent ? temporaryPassword : undefined,
          },
        };
      } else {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.NO_USER_SPECIFIED,
          "Aucun utilisateur spécifié"
        );
      }
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans attachUserToProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de l'association de l'utilisateur",
      { error: error.message }
    );
  }
};

/**
 * @desc Détache un compte utilisateur d'un professeur
 */
export const detachUserFromProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis",
        { field: "id" }
      );
    }

    return await prisma.$transaction(async (tx) => {
      const professeur = await tx.professeur.findUnique({
        where: { id },
      });

      if (!professeur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { id }
        );
      }

      if (!professeur.userId) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.NO_USER_ACCOUNT,
          "Ce professeur n'a pas de compte utilisateur associé"
        );
      }

      // Détacher l'utilisateur
      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: { userId: null },
      });

      return {
        success: true,
        code: PROFESSEUR_SUCCESS.USER_DETACHED,
        message: "Compte utilisateur détaché avec succès",
        data: { professeur: updatedProfesseur },
      };
    });
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans detachUserFromProfesseurService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors du détachement de l'utilisateur",
      { error: error.message }
    );
  }
};

/**
 * @desc Importe des professeurs en masse
 */
export const importProfesseursService = async (professeurs: any[]) => {
  try {
    if (
      !professeurs ||
      !Array.isArray(professeurs) ||
      professeurs.length === 0
    ) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "Aucune donnée de professeur à importer"
      );
    }

    if (professeurs.length > 500) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.IMPORT_VALIDATION_FAILED,
        "Limite d'import dépassée (500 maximum)",
        { count: professeurs.length }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
      created: [] as any[],
    };

    await prisma.$transaction(
      async (tx) => {
        for (const [index, professeurData] of professeurs.entries()) {
          try {
            // Validation de base
            if (
              !professeurData.firstName?.trim() ||
              !professeurData.lastName?.trim() ||
              !professeurData.email?.trim()
            ) {
              results.failed++;
              results.errors.push({
                index,
                data: professeurData,
                error: "Champs requis manquants (prénom, nom, email)",
              });
              continue;
            }

            if (!ValidationUtils.isValidEmail(professeurData.email)) {
              results.failed++;
              results.errors.push({
                index,
                data: professeurData,
                error: "Format d'email invalide",
              });
              continue;
            }

            if (
              professeurData.phone &&
              !ValidationUtils.isValidPhone(professeurData.phone)
            ) {
              results.failed++;
              results.errors.push({
                index,
                data: professeurData,
                error: "Format de téléphone invalide",
              });
              continue;
            }

            const formattedEmail = professeurData.email.toLowerCase().trim();
            const formattedPhone = professeurData.phone
              ? ValidationUtils.formatPhoneForStorage(professeurData.phone)
              : null;
            const formattedMatricule = professeurData.matricule
              ? professeurData.matricule.trim().toUpperCase()
              : null;

            // Vérifier l'unicité
            const existingProfesseur = await tx.professeur.findUnique({
              where: { email: formattedEmail },
            });

            if (existingProfesseur) {
              results.failed++;
              results.errors.push({
                index,
                data: professeurData,
                error: "Email déjà utilisé",
              });
              continue;
            }

            if (formattedMatricule) {
              const existingByMatricule = await tx.professeur.findUnique({
                where: { matricule: formattedMatricule },
              });

              if (existingByMatricule) {
                results.failed++;
                results.errors.push({
                  index,
                  data: professeurData,
                  error: "Matricule déjà utilisé",
                });
                continue;
              }
            }

            // Créer le professeur
            const professeur = await tx.professeur.create({
              data: {
                firstName: professeurData.firstName.trim(),
                lastName: professeurData.lastName.trim(),
                email: formattedEmail,
                phone: formattedPhone,
                speciality: professeurData.speciality?.trim(),
                matricule: formattedMatricule,
                status: "Actif",
              },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                matricule: true,
              },
            });

            results.success++;
            results.created.push(professeur);
          } catch (error: any) {
            results.failed++;
            results.errors.push({
              index,
              data: professeurData,
              error: error.message || "Erreur lors de l'import",
            });
          }
        }
      },
      {
        timeout: 30000,
        isolationLevel: "Serializable",
      }
    );

    return {
      success: true,
      code: PROFESSEUR_SUCCESS.BULK_IMPORT_COMPLETE,
      message: "Import des professeurs terminé",
      data: results,
    };
  } catch (error: any) {
    if (error instanceof ProfesseurError) {
      throw error;
    }
    console.error("Erreur dans importProfesseursService:", error);
    throw new ProfesseurError(
      PROFESSEUR_ERRORS.TRANSACTION_FAILED,
      "Erreur lors de l'import des professeurs",
      { error: error.message }
    );
  }
};

/**
 * @desc Récupère l'emploi du temps d'un professeur
 */
export const getProfesseurScheduleService = async (
  id: string,
  weekStart?: string
) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis"
      );
    }

    // Vérifier si le professeur existe
    const professeur = await prisma.professeur.findUnique({
      where: { id },
    });

    if (!professeur) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
        "Professeur non trouvé",
        { id }
      );
    }

    // Récupérer tous les horaires du professeur
    const schedules = await prisma.schedule.findMany({
      where: {
        professeurId: id,
      },
      include: {
        classAssignment: {
          include: {
            subject: true,
            academicYear: true,
          },
        },
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Organiser par jour avec validation
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    schedules.forEach((schedule) => {
      const day = Number((schedule as any).dayOfWeek);
      if (!Number.isInteger(day) || day < 1 || day > 7) {
        console.warn(
          `Jour de semaine invalide pour le schedule ${schedule.id}: ${day}`
        );
        return;
      }
      scheduleByDay[day].push(schedule);
    });

    return {
      scheduleByDay,
      totalSessions: schedules.length,
      professeur: {
        id: professeur.id,
        firstName: professeur.firstName,
        lastName: professeur.lastName,
      },
    };
  } catch (error) {
    console.error("Erreur dans getProfesseurScheduleService:", error);
    throw error;
  }
};

/**
 * @desc Désactive un professeur
 */
export const deactivateProfesseurService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis"
      );
    }

    return await prisma.$transaction(async (tx) => {
      // Vérifier si le professeur existe
      const professeur = await tx.professeur.findUnique({
        where: { id },
      });

      if (!professeur) {
        throw new ProfesseurError(
          PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
          "Professeur non trouvé",
          { id }
        );
      }

      // Désactiver le professeur
      const updatedProfesseur = await tx.professeur.update({
        where: { id },
        data: { status: "Inactif" },
      });

      // Désactiver l'utilisateur associé si existe
      if (professeur.userId) {
        await tx.user.update({
          where: { id: professeur.userId },
          data: { status: UserStatus.Inactif },
        });
      }

      return updatedProfesseur;
    });
  } catch (error) {
    console.error("Erreur dans deactivateProfesseurService:", error);
    throw error;
  }
};

/**
 * @desc Récupère les détails complets d'un professeur
 */
export const getProfesseurFullDetailsService = async (id: string) => {
  try {
    if (!id) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.MISSING_REQUIRED_FIELDS,
        "ID du professeur requis"
      );
    }

    const professeur = await prisma.professeur.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        assignments: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
            academicYear: {
              select: {
                id: true,
                year: true,
              },
            },
            schedules: {
              include: {
                schoolClass: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                    capacity: true,
                  },
                },
              },
              orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            },
          },
        },
        schedules: {
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
        },
        _count: {
          select: {
            assignments: true,
            schedules: true,
          },
        },
      },
    });

    if (!professeur) {
      throw new ProfesseurError(
        PROFESSEUR_ERRORS.PROFESSEUR_NOT_FOUND,
        "Professeur non trouvé",
        { id }
      );
    }

    // Organiser l'emploi du temps par jour avec validation
    const scheduleByDay: Record<number, any[]> = {
      1: [], // Lundi
      2: [], // Mardi
      3: [], // Mercredi
      4: [], // Jeudi
      5: [], // Vendredi
      6: [], // Samedi
      7: [], // Dimanche
    };

    (professeur.schedules || []).forEach((schedule: any) => {
      const day = Number(schedule.dayOfWeek);
      if (!Number.isInteger(day) || day < 1 || day > 7) {
        console.warn(
          `Jour de semaine invalide pour le schedule ${schedule.id}: ${day}`
        );
        return;
      }
      scheduleByDay[day].push(schedule);
    });

    // Calculer les statistiques
    const assignments = professeur.assignments || [];
    const schedules = professeur.schedules || [];

    const totalClasses = new Set(
      assignments.flatMap((a: any) =>
        (a.schedules || []).map((s: any) => s.schoolClassId)
      )
    ).size;

    const totalSubjects = new Set(assignments.map((a: any) => a.subjectId))
      .size;

    const weeklyHours = schedules.reduce((total: number, schedule: any) => {
      try {
        const start = new Date(`1970-01-01T${schedule.startTime}`);
        const end = new Date(`1970-01-01T${schedule.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + (isNaN(hours) ? 0 : hours);
      } catch (error) {
        console.warn(
          `Format d'heure invalide pour le schedule ${schedule.id}: ${schedule.startTime}-${schedule.endTime}`
        );
        return total;
      }
    }, 0);

    const stats = {
      totalClasses,
      totalSubjects,
      weeklyHours: Math.round(weeklyHours * 100) / 100,
    };

    return {
      professeur,
      scheduleByDay,
      stats,
    };
  } catch (error) {
    console.error("Erreur dans getProfesseurFullDetailsService:", error);
    throw error;
  }
};

// Exporter aussi les fonctions restantes avec les mêmes améliorations
