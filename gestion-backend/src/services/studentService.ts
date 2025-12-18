/**
 * @file studentService.ts
 * @description Service de gestion des élèves et création de comptes
 * @version 1.0.0
 */

import { PrismaClient } from "../../generated/prisma";
import { hashPassword } from "../utils/security";
import { sanitizeInput, validateEmail } from "../utils/validators";

const prisma = new PrismaClient();

/**
 * @class StudentService
 * @description Service regroupant la logique métier des élèves
 */
export class StudentService {
  /**
   * @method createStudentWithUserAccount
   * @description Crée un élève avec son compte utilisateur associé
   * @param {object} studentData - Données de l'élève
   * @param {string} temporaryPassword - Mot de passe temporaire
   * @returns {Promise<any>} Élève créé avec son compte
   */
  static async createStudentWithUserAccount(
    studentData: any,
    temporaryPassword: string = "password123" // À changer par l'élève
  ): Promise<any> {
    try {
      const {
        firstName,
        lastName,
        studentCode,
        email,
        phone,
        dateOfBirth,
        placeOfBirth,
        address,
        classId,
        cin,
        sexe,
      } = studentData;

      // Validation de l'email
      if (!validateEmail(email)) {
        throw new Error("Format d'email invalide");
      }

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizeInput(email).toLowerCase() },
      });

      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }

      // Vérifier si le code élève existe déjà
      const existingStudent = await prisma.student.findUnique({
        where: { studentCode },
      });

      if (existingStudent) {
        throw new Error("Un élève avec ce code existe déjà");
      }

      // Hasher le mot de passe temporaire
      const hashedPassword = await hashPassword(temporaryPassword);

      // Créer l'utilisateur et l'élève en transaction
      const result = await prisma.$transaction(async (tx) => {
        // Créer l'utilisateur
        const user = await tx.user.create({
          data: {
            firstName: sanitizeInput(firstName),
            lastName: sanitizeInput(lastName),
            email: sanitizeInput(email).toLowerCase(),
            phone: phone ? sanitizeInput(phone) : null,
            role: "Student",
            password: hashedPassword,
            status: "Actif",
          },
        });

        // Créer l'élève
        const student = await tx.student.create({
          data: {
            firstName: sanitizeInput(firstName),
            lastName: sanitizeInput(lastName),
            studentCode,
            email: sanitizeInput(email).toLowerCase(),
            phone: phone ? sanitizeInput(phone) : null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            placeOfBirth: placeOfBirth ? sanitizeInput(placeOfBirth) : null,
            address: address ? sanitizeInput(address) : null,
            cin: cin ? sanitizeInput(cin) : null,
            sexe,
            classId: classId || null,
            userId: user.id,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                status: true,
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
        });

        return student;
      });

      return result;
    } catch (error) {
      console.error(
        "❌ StudentService - createStudentWithUserAccount error:",
        error
      );
      throw error;
    }
  }

  /**
   * @method getStudentProfile
   * @description Récupère le profil complet d'un élève
   * @param {string} studentId - ID de l'élève
   * @returns {Promise<any>} Profil élève complet
   */
  static async getStudentProfile(studentId: string): Promise<any> {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              role: true,
              status: true,
              lastLogin: true,
              avatar: true,
            },
          },
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
              mainTeacher: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          guardians: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              relationship: true,
              phone: true,
              email: true,
              isPrimary: true,
            },
          },
          grades: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  type: true,
                },
              },
              classAssignment: {
                select: {
                  professeur: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          enrollments: {
            include: {
              academicYear: true,
              schoolClass: true,
            },
          },
          studentFees: {
            include: {
              feeStructure: true,
              payments: true,
              academicYear: true,
            },
          },
          transcripts: {
            orderBy: {
              generatedAt: "desc",
            },
            take: 5,
          },
        },
      });

      if (!student) {
        throw new Error("Élève non trouvé");
      }

      return student;
    } catch (error) {
      console.error("❌ StudentService - getStudentProfile error:", error);
      throw error;
    }
  }

  /**
   * @method getStudentByUserId
   * @description Récupère un élève par son ID utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<any>} Élève trouvé
   */
  static async getStudentByUserId(userId: string): Promise<any> {
    try {
      const student = await prisma.student.findFirst({
        where: { userId },
        include: {
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
        },
      });

      return student;
    } catch (error) {
      console.error("❌ StudentService - getStudentByUserId error:", error);
      throw error;
    }
  }

  /**
   * @method updateStudentProfile
   * @description Met à jour le profil d'un élève
   * @param {string} studentId - ID de l'élève
   * @param {object} updateData - Données à mettre à jour
   * @returns {Promise<any>} Élève mis à jour
   */
  static async updateStudentProfile(
    studentId: string,
    updateData: any
  ): Promise<any> {
    try {
      const { phone, address, photo, allergies, disabilities, classId } =
        updateData;

      const student = await prisma.student.update({
        where: { id: studentId },
        data: {
          ...(phone !== undefined && { phone: sanitizeInput(phone) }),
          ...(address !== undefined && { address: sanitizeInput(address) }),
          ...(photo !== undefined && { photo }),
          ...(allergies !== undefined && {
            allergies: sanitizeInput(allergies),
          }),
          ...(disabilities !== undefined && {
            disabilities: sanitizeInput(disabilities),
          }),
          ...(classId !== undefined && { classId }),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
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
      });

      return student;
    } catch (error) {
      console.error("❌ StudentService - updateStudentProfile error:", error);
      throw error;
    }
  }

  /**
   * @method getClassStudents
   * @description Récupère tous les élèves d'une classe
   * @param {string} classId - ID de la classe
   * @returns {Promise<any[]>} Liste des élèves
   */
  static async getClassStudents(classId: string): Promise<any[]> {
    try {
      const students = await prisma.student.findMany({
        where: { classId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
              lastLogin: true,
            },
          },
          grades: {
            select: {
              id: true,
              grade: true,
              subject: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      });

      return students;
    } catch (error) {
      console.error("❌ StudentService - getClassStudents error:", error);
      throw error;
    }
  }
}
