/**
 * @file studentController.ts
 * @description Contrôleurs pour la gestion des étudiants
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { PrismaClient, Prisma, UserStatus } from "../../generated/prisma";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  StudentActionTypes,
  StudentControllerResponse,
} from "../types/studentTypes";
import * as bcrypt from "bcryptjs";
import {
  convertBloodGroup,
  convertSexe,
  convertUserStatus,
  UserStatusType,
} from "../types/prismaHelpers";

const prisma = new PrismaClient();

/**
 * @desc Récupère la liste des étudiants avec pagination et filtres
 * @route GET /api/students
 * @access Admin/Staff/Teacher
 */
export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      classId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construire la requête de filtrage
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (classId && classId !== "all") {
      where.classId = classId;
    }

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { firstName: { contains: searchStr, mode: "insensitive" } },
        { lastName: { contains: searchStr, mode: "insensitive" } },
        { email: { contains: searchStr, mode: "insensitive" } },
        { studentCode: { contains: searchStr, mode: "insensitive" } },
        { phone: { contains: searchStr, mode: "insensitive" } },
      ];
    }

    // Définir l'ordre de tri
    let orderBy: any = {};
    const validSortFields = [
      "firstName",
      "lastName",
      "email",
      "studentCode",
      "createdAt",
      "dateOfBirth",
    ];

    if (validSortFields.includes(sortBy as string)) {
      orderBy[sortBy as string] = sortOrder === "desc" ? "desc" : "asc";
    } else {
      orderBy = { createdAt: "desc" };
    }

    // Récupérer les étudiants avec pagination
    const [students, totalStudents] = await Promise.all([
      prisma.student.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentCode: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          placeOfBirth: true,
          address: true,
          photo: true,
          bloodGroup: true,
          allergies: true,
          disabilities: true,
          status: true,
          sexe: true,
          cin: true,
          createdAt: true,
          updatedAt: true,
          classId: true,
          schoolClass: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              guardians: true,
              enrollments: true,
              grades: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.student.count({ where }),
    ]);

    const totalPages = Math.ceil(totalStudents / limitNum);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_LIST_REQUEST,
      entity: "Student",
      description: "Liste des étudiants récupérée avec succès",
      status: "SUCCESS",
      metadata: {
        page: pageNum,
        limit: limitNum,
        totalStudents,
        filters: { status, search, classId },
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Liste des étudiants récupérée avec succès",
      data: {
        students,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalStudents,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - getStudents error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_LIST_ERROR,
      entity: "Student",
      description: "Erreur lors de la récupération des étudiants",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère un étudiant spécifique par ID
 * @route GET /api/students/:id
 * @access Admin/Staff/Teacher/Parent (si leur enfant)
 */
export const getStudentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Récupérer l'étudiant avec toutes ses informations
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        placeOfBirth: true,
        address: true,
        photo: true,
        bloodGroup: true,
        allergies: true,
        disabilities: true,
        status: true,
        sexe: true,
        cin: true,
        createdAt: true,
        updatedAt: true,
        classId: true,
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
        guardians: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            relationship: true,
            isPrimary: true,
            address: true,
          },
          orderBy: { isPrimary: "desc" },
        },
        enrollments: {
          select: {
            id: true,
            academicYearId: true,
            enrollmentDate: true,
            status: true,
            academicYear: {
              select: {
                id: true,
                year: true,
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
          orderBy: { enrollmentDate: "desc" },
        },
        grades: {
          select: {
            id: true,
            grade: true,
            session: true,
            subject: {
              select: {
                id: true,
                name: true,
                coefficient: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        payments: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            paymentMethod: true,
            status: true,
            description: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        studentFees: {
          select: {
            id: true,
            feeStructure: {
              select: {
                id: true,
                name: true,
              },
            },
            totalAmount: true,
            dueDate: true,
            status: true,
          },
          orderBy: { dueDate: "desc" },
        },
      },
    });

    if (!student) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier les permissions pour les parents
    if (auditData.userRole === "Parent") {
      const isGuardian = student.guardians.some(
        (guardian) => guardian.id === auditData.userId
      );
      if (!isGuardian) {
        const response: StudentControllerResponse = {
          success: false,
          message: "Accès non autorisé",
          code: "UNAUTHORIZED",
        };
        res.status(403).json(response);
        return;
      }
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_DETAILS_REQUEST,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: "Détails de l'étudiant récupérés avec succès",
      status: "SUCCESS",
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant récupéré avec succès",
      data: { student },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - getStudentById error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_DETAILS_ERROR,
      entity: "Student",
      description: "Erreur lors de la récupération des détails de l'étudiant",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Crée un nouvel étudiant
 * @route POST /api/students
 * @access Admin/Staff
 */
export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      address,
      photo,
      bloodGroup,
      allergies,
      disabilities,
      status = "Active",
      sexe,
      cin,
      classId,
      createUserAccount = false,
      sendWelcomeEmail = false,
      academicYearId,
      guardians = [],
    } = req.body;

    // Validation des données requises
    if (!firstName || !lastName || !email) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Prénom, nom et email sont requis",
        code: "MISSING_REQUIRED_FIELDS",
      };
      res.status(400).json(response);
      return;
    }

    // Utiliser une transaction pour garantir l'intégrité des données
    const result = await prisma.$transaction(
      async (tx) => {
        // Vérifier l'unicité de l'email dans Student
        const existingStudent = await tx.student.findUnique({
          where: { email },
        });

        if (existingStudent) {
          throw new Error("EMAIL_ALREADY_EXISTS");
        }

        // Vérifier l'unicité de l'email dans User si création de compte
        if (createUserAccount) {
          const existingUser = await tx.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            throw new Error("USER_EMAIL_ALREADY_EXISTS");
          }
        }

        // Vérifier l'unicité du CIN si fourni
        if (cin) {
          const existingCIN = await tx.student.findUnique({
            where: { cin },
          });

          if (existingCIN) {
            throw new Error("CIN_ALREADY_EXISTS");
          }
        }

        // Vérifier que la classe existe si classId est fourni
        let schoolClassConnection = undefined;
        if (classId) {
          const schoolClass = await tx.schoolClass.findUnique({
            where: { id: classId },
          });

          if (!schoolClass) {
            throw new Error("CLASS_NOT_FOUND");
          }
          // Préparer la connexion à la classe
          schoolClassConnection = { connect: { id: classId } };
        }

        // Générer un code étudiant unique
        const studentCode = await generateStudentCode(tx);

        let userId = null;
        let createdUser = null;

        // Créer l'utilisateur si demandé
        if (createUserAccount) {
          const hashedPassword = await bcrypt.hash("Etudiant@123", 12);

          createdUser = await tx.user.create({
            data: {
              firstName,
              lastName,
              email,
              phone: phone || null,
              role: "Student",
              status: convertUserStatus("Actif"),
              password: hashedPassword,
            },
          });
          userId = createdUser.id;
        }

        // Créer l'étudiant avec les types corrects
        const studentData: Prisma.StudentCreateInput = {
          firstName,
          lastName,
          studentCode,
          email,
          phone: phone || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          placeOfBirth: placeOfBirth || null,
          address: address || null,
          photo: photo || null,
          bloodGroup: convertBloodGroup(bloodGroup),
          allergies: allergies || null,
          disabilities: disabilities || null,
          status,
          sexe: convertSexe(sexe),
          cin: cin || null,
          // Utiliser schoolClass au lieu de classId
          ...(schoolClassConnection && { schoolClass: schoolClassConnection }),
        };

        // Ajouter l'utilisateur si créé
        if (userId) {
          studentData.user = { connect: { id: userId } };
        }

        const createdStudent = await tx.student.create({
          data: studentData,
          include: {
            schoolClass: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Créer les gardiens si fournis
        if (guardians && guardians.length > 0) {
          for (const guardian of guardians) {
            await tx.guardian.create({
              data: {
                firstName: guardian.firstName,
                lastName: guardian.lastName,
                email: guardian.email || null,
                phone: guardian.phone,
                relationship: guardian.relationship || "Parent",
                isPrimary: guardian.isPrimary || false,
                studentId: createdStudent.id,
              },
            });
          }
        }

        // Créer l'inscription si academicYearId est fourni
        if (academicYearId && classId) {
          await tx.enrollment.create({
            data: {
              studentId: createdStudent.id,
              classId,
              academicYearId,
              enrollmentDate: new Date(),
              status: "Active",
            },
          });
        }

        return {
          student: createdStudent,
          user: createdUser,
          guardiansCount: guardians?.length || 0,
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    // Préparer la réponse
    const responseData: any = {
      student: {
        id: result.student.id,
        firstName: result.student.firstName,
        lastName: result.student.lastName,
        studentCode: result.student.studentCode,
        email: result.student.email,
        phone: result.student.phone,
        status: result.student.status,
        classId: result.student.classId,
        schoolClass: result.student.schoolClass,
      },
    };

    if (result.user) {
      responseData.user = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      };
    }

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CREATED,
      entity: "Student",
      entityId: result.student.id,
      userId: auditData.userId,
      description: "Étudiant créé avec succès",
      status: "SUCCESS",
      metadata: {
        studentCode: result.student.studentCode,
        hasUserAccount: !!result.user,
        guardiansCount: result.guardiansCount,
        sendWelcomeEmail,
      },
    });

    // Envoyer l'email de bienvenue si demandé
    if (sendWelcomeEmail && result.user) {
      // TODO: Implémenter l'envoi d'email
      console.log(`📧 Email de bienvenue à envoyer à: ${email}`);
    }

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant créé avec succès",
      data: responseData,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ StudentController - createStudent error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      statusCode = 400;
      errorCode = "EMAIL_ALREADY_EXISTS";
      errorMessage = "Un étudiant avec cet email existe déjà";
    } else if (error.message === "USER_EMAIL_ALREADY_EXISTS") {
      statusCode = 400;
      errorCode = "USER_EMAIL_ALREADY_EXISTS";
      errorMessage =
        "Un utilisateur avec cet email existe déjà. Désactivez 'Créer un compte utilisateur' ou utilisez un email différent.";
    } else if (error.message === "CIN_ALREADY_EXISTS") {
      statusCode = 400;
      errorCode = "CIN_ALREADY_EXISTS";
      errorMessage = "Un étudiant avec ce CIN existe déjà";
    } else if (error.message === "CLASS_NOT_FOUND") {
      statusCode = 404;
      errorCode = "CLASS_NOT_FOUND";
      errorMessage = "La classe spécifiée n'existe pas";
    }

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CREATION_ERROR,
      entity: "Student",
      description: "Erreur lors de la création de l'étudiant",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
  }
};

/**
 * @desc Met à jour un étudiant
 * @route PUT /api/students/:id
 * @access Admin/Staff
 */
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      address,
      photo,
      bloodGroup,
      allergies,
      disabilities,
      status,
      sexe,
      cin,
      classId,
    } = req.body;

    // Vérifier si l'étudiant existe
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingStudent) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Préparer les données de mise à jour
    const updateData: Prisma.StudentUpdateInput = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }
    if (placeOfBirth !== undefined) updateData.placeOfBirth = placeOfBirth;
    if (address !== undefined) updateData.address = address;
    if (photo !== undefined) updateData.photo = photo;
    if (bloodGroup !== undefined) {
      updateData.bloodGroup = convertBloodGroup(bloodGroup); // CORRECTION ICI
    }
    if (allergies !== undefined) updateData.allergies = allergies;
    if (disabilities !== undefined) updateData.disabilities = disabilities;
    if (status !== undefined) updateData.status = status;
    if (sexe !== undefined) {
      updateData.sexe = convertSexe(sexe); // CORRECTION ICI
    }
    if (cin !== undefined) updateData.cin = cin || null;
    if (classId !== undefined) {
      if (classId === null || classId === "") {
        updateData.schoolClass = { disconnect: true };
      } else {
        // Vérifier que la classe existe
        const schoolClass = await prisma.schoolClass.findUnique({
          where: { id: classId },
        });
        if (!schoolClass) {
          const response: StudentControllerResponse = {
            success: false,
            message: "Classe non trouvée",
            code: "CLASS_NOT_FOUND",
          };
          res.status(404).json(response);
          return;
        }
        updateData.schoolClass = { connect: { id: classId } };
      }
    }

    // Vérifier l'unicité de l'email si modifié
    if (email && email !== existingStudent.email) {
      const studentWithEmail = await prisma.student.findUnique({
        where: { email },
      });

      if (studentWithEmail && studentWithEmail.id !== id) {
        const response: StudentControllerResponse = {
          success: false,
          message: "Un étudiant avec cet email existe déjà",
          code: "EMAIL_ALREADY_EXISTS",
        };
        res.status(400).json(response);
        return;
      }

      // Mettre à jour l'email de l'utilisateur associé
      if (existingStudent.user) {
        await prisma.user.update({
          where: { id: existingStudent.user.id },
          data: { email },
        });
      }
    }

    // Vérifier l'unicité du CIN si modifié
    if (cin !== undefined && cin !== existingStudent.cin) {
      if (cin) {
        const studentWithCIN = await prisma.student.findUnique({
          where: { cin },
        });

        if (studentWithCIN && studentWithCIN.id !== id) {
          const response: StudentControllerResponse = {
            success: false,
            message: "Un étudiant avec ce CIN existe déjà",
            code: "CIN_ALREADY_EXISTS",
          };
          res.status(400).json(response);
          return;
        }
      }
    }

    // Mettre à jour l'étudiant
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        status: true,
        sexe: true,
        cin: true,
        classId: true,
        schoolClass: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedAt: true,
      },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_UPDATED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: "Étudiant mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        updatedFields: Object.keys(updateData),
        oldEmail: existingStudent.email,
        newEmail: updatedStudent.email,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant mis à jour avec succès",
      data: { student: updatedStudent },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - updateStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_UPDATE_ERROR,
      entity: "Student",
      description: "Erreur lors de la mise à jour de l'étudiant",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Supprime un étudiant (soft delete)
 * @route DELETE /api/students/:id
 * @access Admin/Staff
 */
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        guardians: true,
        enrollments: true,
        grades: true,
        payments: true,
      },
    });

    if (!student) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Utiliser une transaction pour garantir l'intégrité
    await prisma.$transaction(async (tx) => {
      // Supprimer les gardiens d'abord
      if (student.guardians.length > 0) {
        await tx.guardian.deleteMany({
          where: { studentId: id },
        });
      }

      // Supprimer l'utilisateur associé s'il existe
      if (student.user) {
        await tx.user.delete({
          where: { id: student.user.id },
        });
      }

      // Supprimer définitivement l'étudiant
      await tx.student.delete({
        where: { id },
      });
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_DELETED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: "Étudiant supprimé définitivement",
      status: "SUCCESS",
      metadata: {
        studentCode: student.studentCode,
        email: student.email,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant supprimé définitivement avec succès",
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - deleteStudent error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_DELETION_ERROR,
      entity: "Student",
      description: "Erreur lors de la suppression de l'étudiant",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Change le statut d'un étudiant
 * @route PUT /api/students/:id/status
 * @access Admin/Staff
 */
export const updateStudentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Valider le statut
    const validStatuses = [
      "Active",
      "Inactive",
      "Graduated",
      "Transferred",
      "Suspended",
    ];
    if (!validStatuses.includes(status)) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Statut invalide",
        code: "INVALID_STATUS",
        data: { validStatuses },
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Étudiant non trouvé",
        code: "STUDENT_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Sauvegarder l'ancien statut
    const oldStatus = student.status;

    // Utiliser une transaction
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le statut de l'étudiant
      await tx.student.update({
        where: { id },
        data: { status },
      });

      // Mettre à jour le statut de l'utilisateur associé si existant
      if (student.user) {
        let userStatus: UserStatusType;
        if (
          ["Inactive", "Suspended", "Graduated", "Transferred"].includes(status)
        ) {
          userStatus = UserStatus.Inactif;
        } else {
          userStatus = UserStatus.Actif;
        }

        await tx.user.update({
          where: { id: student.user.id },
          data: {
            status: userStatus,
          },
        });
      }
    });

    // Récupérer l'étudiant mis à jour
    const updatedStudent = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_STATUS_UPDATED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: `Statut de l'étudiant modifié de ${oldStatus} à ${status}`,
      status: "SUCCESS",
      metadata: {
        oldStatus,
        newStatus: status,
        reason,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: `Statut de l'étudiant mis à jour avec succès`,
      data: {
        student: updatedStudent,
        change: {
          oldStatus,
          newStatus: status,
        },
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - updateStudentStatus error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_STATUS_UPDATE_ERROR,
      entity: "Student",
      description: "Erreur lors de la mise à jour du statut de l'étudiant",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Affecte un étudiant à une classe
 * @route PUT /api/students/:id/assign-class
 * @access Admin/Staff
 */
export const assignStudentToClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { id } = req.params;
    const { classId, academicYearId } = req.body;

    if (!classId) {
      const response: StudentControllerResponse = {
        success: false,
        message: "ID de classe requis",
        code: "MISSING_CLASS_ID",
      };
      res.status(400).json(response);
      return;
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        classId: true,
        studentCode: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!student) {
      const response: StudentControllerResponse = {
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
      const response: StudentControllerResponse = {
        success: false,
        message: "Classe non trouvée",
        code: "CLASS_NOT_FOUND",
      };
      res.status(404).json(response);
      return;
    }

    // Vérifier si l'année académique existe si fournie
    if (academicYearId) {
      const academicYear = await prisma.academicYear.findUnique({
        where: { id: academicYearId },
      });

      if (!academicYear) {
        const response: StudentControllerResponse = {
          success: false,
          message: "Année académique non trouvée",
          code: "ACADEMIC_YEAR_NOT_FOUND",
        };
        res.status(404).json(response);
        return;
      }
    }

    // Sauvegarder l'ancienne classe
    const oldClassId = student.classId;

    // Utiliser une transaction
    await prisma.$transaction(async (tx) => {
      // Mettre à jour l'étudiant
      await tx.student.update({
        where: { id },
        data: { classId },
      });

      // Créer ou mettre à jour l'inscription
      if (academicYearId) {
        await tx.enrollment.upsert({
          where: {
            studentId_academicYearId: {
              studentId: id,
              academicYearId,
            },
          },
          update: {
            classId,
          },
          create: {
            studentId: id,
            classId,
            academicYearId,
            enrollmentDate: new Date(),
            status: "Active",
          },
        });
      }
    });

    // Récupérer l'étudiant mis à jour
    const updatedStudent = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        classId: true,
        schoolClass: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        updatedAt: true,
      },
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CLASS_ASSIGNED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: `Étudiant affecté à la classe ${schoolClass.name}`,
      status: "SUCCESS",
      metadata: {
        studentCode: student.studentCode,
        oldClassId,
        newClassId: classId,
        className: schoolClass.name,
        academicYearId,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: `Étudiant affecté à la classe ${schoolClass.name} avec succès`,
      data: { student: updatedStudent },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - assignStudentToClass error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CLASS_ASSIGN_ERROR,
      entity: "Student",
      description: "Erreur lors de l'affectation de l'étudiant à une classe",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les statistiques des étudiants
 * @route GET /api/students/statistics
 * @access Admin/Staff
 */
export const getStudentStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    // Compter par statut
    const statusCounts = await prisma.student.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Compter par sexe
    const genderCounts = await prisma.student.groupBy({
      by: ["sexe"],
      _count: {
        id: true,
      },
    });

    // Compter par classe
    const classCounts = await prisma.student.groupBy({
      by: ["classId"],
      _count: {
        id: true,
      },
      where: {
        classId: {
          not: null,
        },
      },
    });

    // Nombre total
    const totalStudents = await prisma.student.count();

    // Dernières inscriptions (7 derniers jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentEnrollments = await prisma.student.count({
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
    });

    // Récupérer les informations des classes pour les noms
    const classIds = classCounts
      .map((item) => item.classId)
      .filter(Boolean) as string[];
    const classes = await prisma.schoolClass.findMany({
      where: {
        id: {
          in: classIds,
        },
      },
      select: {
        id: true,
        name: true,
        level: true,
      },
    });

    const classStats = classCounts.map((item) => {
      const classInfo = classes.find((c) => c.id === item.classId);
      return {
        ...item,
        className: classInfo?.name || "Non assigné",
        classLevel: classInfo?.level || null,
      };
    });

    const statistics = {
      total: totalStudents,
      byStatus: statusCounts.reduce(
        (acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
      byGender: genderCounts.reduce(
        (acc, item) => {
          acc[item.sexe || "Non spécifié"] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
      byClass: classStats,
      recentEnrollments,
    };

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_STATISTICS_REQUEST,
      entity: "Student",
      description: "Statistiques des étudiants récupérées avec succès",
      status: "SUCCESS",
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Statistiques récupérées avec succès",
      data: { statistics },
    };

    res.json(response);
  } catch (error: any) {
    console.error("❌ StudentController - getStudentStatistics error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_STATISTICS_ERROR,
      entity: "Student",
      description: "Erreur lors de la récupération des statistiques",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Importe des étudiants depuis un fichier CSV/Excel
 * @route POST /api/students/import
 * @access Admin/Staff
 */
export const importStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Aucune donnée d'étudiant fournie",
        code: "NO_STUDENT_DATA",
      };
      res.status(400).json(response);
      return;
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
      created: [] as any[],
    };

    // Utiliser une transaction pour l'import en masse
    await prisma.$transaction(async (tx) => {
      for (const studentData of students) {
        try {
          // Vérifier l'email
          const existingStudent = await tx.student.findUnique({
            where: { email: studentData.email },
          });

          if (existingStudent) {
            results.failed++;
            results.errors.push({
              student: studentData,
              error: "Email déjà utilisé",
            });
            continue;
          }

          // Générer code étudiant
          const studentCode = await generateStudentCode(tx);

          // Créer l'étudiant avec les bonnes conversions
          const student = await tx.student.create({
            data: {
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              studentCode,
              email: studentData.email,
              phone: studentData.phone || null,
              dateOfBirth: studentData.dateOfBirth
                ? new Date(studentData.dateOfBirth)
                : null,
              placeOfBirth: studentData.placeOfBirth || null,
              address: studentData.address || null,
              sexe: convertSexe(studentData.sexe), // CORRECTION ICI
              cin: studentData.cin || null,
              classId: studentData.classId || null,
              status: "Active",
              bloodGroup: convertBloodGroup(studentData.bloodGroup), // CORRECTION ICI
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
            },
          });

          results.success++;
          results.created.push(student);
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            student: studentData,
            error: error.message,
          });
        }
      }
    });

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_IMPORTED,
      entity: "Student",
      userId: auditData.userId,
      description: `Import d'étudiants: ${results.success} réussis, ${results.failed} échoués`,
      status: results.failed === 0 ? "SUCCESS" : "INFO",
      metadata: {
        total: students.length,
        success: results.success,
        failed: results.failed,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: `Import terminé: ${results.success} étudiants créés, ${results.failed} échecs`,
      data: results,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("❌ StudentController - importStudents error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_IMPORT_ERROR,
      entity: "Student",
      description: "Erreur lors de l'import des étudiants",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    };

    res.status(500).json(response);
  }
};

// Fonction utilitaire pour générer le code étudiant
const generateStudentCode = async (tx: any): Promise<string> => {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `STU${year}`;

  const lastStudent = await tx.student.findFirst({
    where: {
      studentCode: {
        startsWith: prefix,
      },
    },
    orderBy: {
      studentCode: "desc",
    },
    select: {
      studentCode: true,
    },
  });

  let nextNumber = 1;
  if (lastStudent && lastStudent.studentCode) {
    const lastNumber = parseInt(
      lastStudent.studentCode.replace(prefix, ""),
      10
    );
    nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
};
