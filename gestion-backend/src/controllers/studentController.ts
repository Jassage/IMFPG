import { Request, Response } from "express";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { z } from "zod";
import prisma from "../prisma";
import { createAuditLog } from "./auditController";
import { BloodGroup, StudentSexe, StudentStatus } from "../../generated/prisma";

// Fonction utilitaire pour gérer les erreurs unknown
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  } else {
    return "Erreur inconnue";
  }
};

// Fonction pour convertir les dates Excel en format ISO
const convertExcelDate = (excelDate: number): string => {
  const excelEpoch = new Date(1900, 0, 1);
  const date = new Date(
    excelEpoch.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000
  );
  return date.toISOString().split("T")[0];
};

// Fonction pour nettoyer et valider les numéros de téléphone
const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return phone;

  let cleaned = phone
    .replace(/[()\s+]/g, "")
    .replace(/^33/, "0")
    .replace(/^0033/, "0");

  if (cleaned.startsWith("33") && cleaned.length === 11) {
    cleaned = "0" + cleaned.slice(2);
  }

  return cleaned;
};

// Fonction pour nettoyer le CIN (supprimer les guillemets)
const cleanCin = (cin: string): string => {
  if (!cin) return cin;
  return cin.replace(/["']/g, "");
};

// Fonction pour normaliser le groupe sanguin
const normalizeBloodGroup = (bloodGroup: string): BloodGroup | null => {
  if (!bloodGroup) return null;

  const groupMap: { [key: string]: BloodGroup } = {
    "A+": "A_POSITIVE",
    "A-": "A_NEGATIVE",
    "B+": "B_POSITIVE",
    "B-": "B_NEGATIVE",
    "AB+": "AB_POSITIVE",
    "AB-": "AB_NEGATIVE",
    "O+": "O_POSITIVE",
    "O-": "O_NEGATIVE",
    A_POSITIVE: "A_POSITIVE",
    A_NEGATIVE: "A_NEGATIVE",
    B_POSITIVE: "B_POSITIVE",
    B_NEGATIVE: "B_NEGATIVE",
    AB_POSITIVE: "AB_POSITIVE",
    AB_NEGATIVE: "AB_NEGATIVE",
    O_POSITIVE: "O_POSITIVE",
    O_NEGATIVE: "O_NEGATIVE",
    "A POSITIVE": "A_POSITIVE",
    "A NEGATIVE": "A_NEGATIVE",
    "B POSITIVE": "B_POSITIVE",
    "B NEGATIVE": "B_NEGATIVE",
    "AB POSITIVE": "AB_POSITIVE",
    "AB NEGATIVE": "AB_NEGATIVE",
    "O POSITIVE": "O_POSITIVE",
    "O NEGATIVE": "O_NEGATIVE",
  };

  return groupMap[bloodGroup.toUpperCase().trim()] || null;
};

// Fonction pour normaliser le statut
const normalizeStatus = (status: string): StudentStatus => {
  const statusMap: { [key: string]: StudentStatus } = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    GRADUATED: "Graduated",
    SUSPENDED: "Suspended",
    ACTIF: "Active",
    INACTIF: "Inactive",
    DIPLÔMÉ: "Graduated",
    DIPLOME: "Graduated",
    SUSPENDU: "Suspended",
  };

  return statusMap[status.toUpperCase().trim()] || "Active";
};

// Fonction pour normaliser le sexe
const normalizeSexe = (sexe: string): StudentSexe => {
  const sexeMap: { [key: string]: StudentSexe } = {
    M: "Masculin",
    F: "Feminin",
    A: "Autre",
    MALE: "Masculin",
    FEMALE: "Feminin",
    OTHER: "Autre",
    HOMME: "Masculin",
    FEMME: "Feminin",
  };

  return sexeMap[sexe.toUpperCase().trim()] || "Masculin";
};

// Schémas de validation avec Zod
const GuardianSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),
  relationship: z.string().min(1, "La relation est requise").max(50),
  phone: z
    .string()
    .min(10, "Le téléphone doit contenir au moins 10 chiffres")
    .max(15)
    .regex(/^[0-9]+$/, "Le téléphone ne doit contenir que des chiffres"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  address: z.string().max(500).optional(),
  isPrimary: z.boolean().default(false),
});

const StudentCreateSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),
  studentId: z.string().min(1, "L'ID étudiant est requis").max(50),
  email: z.string().email("Email invalide").max(255),
  phone: z
    .string()
    .min(10, "Le téléphone doit contenir au moins 10 chiffres")
    .max(15)
    .regex(/^[0-9]+$/, "Le téléphone ne doit contenir que des chiffres")
    .optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().max(500).optional(),
  disabilities: z.string().max(500).optional(),
  cin: z
    .string()
    .min(8, "Le CIN doit contenir au moins 8 caractères")
    .max(20)
    .regex(/^[0-9]+$/, "Le CIN ne doit contenir que des chiffres")
    .optional(),
  sexe: z.enum(["Masculin", "Feminin", "Autre"]).optional(),
  status: z
    .enum(["Active", "Inactive", "Graduated", "Suspended"])
    .default("Active"),
  guardians: z.array(GuardianSchema).optional().default([]),
});

const StudentUpdateSchema = StudentCreateSchema.partial();

// Interface pour les données d'importation
interface ImportStudentData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone?: string;
  dateOfBirth?: string | number;
  placeOfBirth?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string;
  cin?: string;
  sexe?: string;
  disabilities?: string;
  status?: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianAddress?: string;
}

// Utilitaires de sécurité
const safeDeleteFile = async (filePath: string): Promise<void> => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error(`Erreur suppression fichier ${filePath}:`, error);
  }
};

const validateUploadedFile = (file: Express.Multer.File): void => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/json",
  ];

  const maxSize = 10 * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Type de fichier non autorisé");
  }

  if (file.size > maxSize) {
    throw new Error("Fichier trop volumineux (max 10MB)");
  }
};

// Middleware de validation
const validateStudentData = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: any) => {
    try {
      let body = req.body;

      if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch (parseError) {
          return res.status(400).json({
            message: "Format de données invalide",
          });
        }
      }

      if (body.phone) {
        body.phone = cleanPhoneNumber(body.phone);
      }
      if (body.cin) {
        body.cin = cleanCin(body.cin);
      }
      if (body.guardians && Array.isArray(body.guardians)) {
        body.guardians = body.guardians.map((guardian: any) => ({
          ...guardian,
          phone: guardian.phone
            ? cleanPhoneNumber(guardian.phone)
            : guardian.phone,
        }));
      }

      const validatedData = schema.parse(body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Données de validation invalides",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Fonction pour créer les données étudiantes avec typage correct
const createStudentData = (studentData: any) => {
  const baseData: any = {
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    studentId: studentData.studentId,
    email: studentData.email,
    phone: studentData.phone || null,
    dateOfBirth: studentData.dateOfBirth
      ? new Date(studentData.dateOfBirth)
      : null,
    placeOfBirth: studentData.placeOfBirth || null,
    address: studentData.address || null,
    allergies: studentData.allergies || null,
    disabilities: studentData.disabilities || null,
    cin: studentData.cin || null,
    updatedAt: new Date(),
  };

  // Gestion des champs enum avec conversion
  if (studentData.bloodGroup) {
    const bloodGroup = normalizeBloodGroup(studentData.bloodGroup);
    if (bloodGroup) {
      baseData.bloodGroup = bloodGroup;
    }
  }

  if (studentData.status) {
    baseData.status = normalizeStatus(studentData.status);
  } else {
    baseData.status = "Active";
  }

  if (studentData.sexe) {
    baseData.sexe = normalizeSexe(studentData.sexe);
  }

  return baseData;
};

// Fonction pour traiter les données d'importation
const processImportData = (studentData: ImportStudentData) => {
  if (studentData.phone) {
    studentData.phone = cleanPhoneNumber(studentData.phone);
  }

  if (studentData.cin) {
    studentData.cin = cleanCin(studentData.cin);
  }

  if (studentData.guardianPhone) {
    studentData.guardianPhone = cleanPhoneNumber(studentData.guardianPhone);
  }

  let processedDateOfBirth: string | null = null;
  if (studentData.dateOfBirth) {
    if (typeof studentData.dateOfBirth === "number") {
      processedDateOfBirth = convertExcelDate(studentData.dateOfBirth);
    } else {
      processedDateOfBirth = studentData.dateOfBirth;
    }
  }

  return {
    ...studentData,
    dateOfBirth: processedDateOfBirth,
  };
};

// Création d'étudiant
export const createStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).user?.id || (req as any).userId || null,
  };

  let fileCleanupRequired = false;

  try {
    let body = req.body;

    if (body.studentData && typeof body.studentData === "string") {
      try {
        body = JSON.parse(body.studentData);
      } catch (parseError) {
        console.error("❌ Erreur parsing studentData:", parseError);
        await createAuditLog({
          ...auditData,
          action: "CREATE_STUDENT_ATTEMPT",
          entity: "Student",
          description:
            "Tentative de création d'étudiant - format de données invalide",
          status: "ERROR",
          errorMessage: "Format de données invalide",
        });
        return res.status(400).json({ message: "Format de données invalide" });
      }
    }

    if (body.phone) body.phone = cleanPhoneNumber(body.phone);
    if (body.cin) body.cin = cleanCin(body.cin);
    if (body.guardians && Array.isArray(body.guardians)) {
      body.guardians = body.guardians.map((guardian: any) => ({
        ...guardian,
        phone: guardian.phone
          ? cleanPhoneNumber(guardian.phone)
          : guardian.phone,
      }));
    }

    const {
      firstName,
      lastName,
      studentId,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      address,
      bloodGroup,
      allergies,
      disabilities,
      cin,
      sexe,
      status,
      guardians = [],
    } = body;

    try {
      StudentCreateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);
        await createAuditLog({
          ...auditData,
          action: "CREATE_STUDENT_ATTEMPT",
          entity: "Student",
          description:
            "Tentative de création d'étudiant - validation des données échouée",
          status: "ERROR",
          errorMessage: "Données de validation invalides",
          metadata: {
            errors: validationError.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        });
        return res.status(400).json({
          message: "Données de validation invalides",
          errors: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      throw validationError;
    }

    if (req.file) {
      fileCleanupRequired = true;
      validateUploadedFile(req.file);
    }

    const existingStudent = await prisma.student.findUnique({
      where: { studentId },
    });
    const existingEmail = await prisma.student.findUnique({
      where: { email },
    });
    const existingCin = cin
      ? await prisma.student.findUnique({ where: { cin } })
      : null;

    if (existingStudent) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_STUDENT_ATTEMPT",
        entity: "Student",
        description:
          "Tentative de création d'étudiant - matricule déjà existant",
        status: "ERROR",
        metadata: { studentId },
      });
      throw new Error("Un étudiant avec ce matricule existe déjà");
    }
    if (existingEmail) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_STUDENT_ATTEMPT",
        entity: "Student",
        description: "Tentative de création d'étudiant - email déjà existant",
        status: "ERROR",
        metadata: { email },
      });
      throw new Error("Un étudiant avec cet email existe déjà");
    }
    if (existingCin) {
      await createAuditLog({
        ...auditData,
        action: "CREATE_STUDENT_ATTEMPT",
        entity: "Student",
        description: "Tentative de création d'étudiant - CIN déjà existant",
        status: "ERROR",
        metadata: { cin },
      });
      throw new Error("Un étudiant avec ce CIN existe déjà");
    }

    const studentCreateData = createStudentData({
      firstName,
      lastName,
      studentId,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      address,
      bloodGroup,
      allergies,
      disabilities,
      cin,
      sexe,
      status,
    });

    if (req.file) {
      studentCreateData.photo = `uploads/profiles/${req.file.filename}`;
    }

    const student = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: studentCreateData,
      });

      if (guardians && guardians.length > 0) {
        const guardiansToCreate = guardians.map((guardian: any) => ({
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          relationship: guardian.relationship,
          phone: guardian.phone,
          email: guardian.email || null,
          address: guardian.address || null,
          isPrimary: guardian.isPrimary || false,
          studentId: newStudent.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await tx.guardian.createMany({
          data: guardiansToCreate,
        });
      }

      return await tx.student.findUnique({
        where: { id: newStudent.id },
        include: { guardians: true },
      });
    });

    await createAuditLog({
      ...auditData,
      action: "CREATE_STUDENT_SUCCESS",
      entity: "Student",
      entityId: student?.id,
      description: "Étudiant créé avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: student?.studentId,
        email: student?.email,
        guardiansCount: guardians.length,
        hasPhoto: !!req.file,
      },
    });

    res.status(201).json({
      message: "Étudiant créé avec succès",
      student,
    });

    fileCleanupRequired = false;
  } catch (error: unknown) {
    console.error("❌ Erreur création étudiant:", error);

    if (fileCleanupRequired && req.file?.path) {
      await safeDeleteFile(req.file.path);
    }

    const errorMessage = getErrorMessage(error);

    await createAuditLog({
      ...auditData,
      action: "CREATE_STUDENT_ERROR",
      entity: "Student",
      description: "Erreur lors de la création de l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(400).json({
      message: errorMessage || "Erreur lors de la création",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Mise à jour d'étudiant
export const updateStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  let fileCleanupRequired = false;

  try {
    const { id } = req.params;
    let body = req.body;

    if (body.studentData && typeof body.studentData === "string") {
      try {
        body = JSON.parse(body.studentData);
      } catch (parseError) {
        console.error("❌ Erreur parsing studentData:", parseError);
        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative de mise à jour d'étudiant - format de données invalide",
          status: "ERROR",
          errorMessage: "Format de données invalide",
        });
        return res.status(400).json({ message: "Format de données invalide" });
      }
    }

    if (body.phone) body.phone = cleanPhoneNumber(body.phone);
    if (body.cin) body.cin = cleanCin(body.cin);
    if (body.guardians && Array.isArray(body.guardians)) {
      body.guardians = body.guardians.map((guardian: any) => ({
        ...guardian,
        phone: guardian.phone
          ? cleanPhoneNumber(guardian.phone)
          : guardian.phone,
      }));
    }

    const {
      firstName,
      lastName,
      studentId,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      address,
      bloodGroup,
      allergies,
      disabilities,
      status,
      cin,
      sexe,
      guardians,
    } = body;

    try {
      StudentUpdateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("❌ Erreur validation Zod:", validationError.issues);
        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative de mise à jour d'étudiant - validation des données échouée",
          status: "ERROR",
          errorMessage: "Données de validation invalides",
          metadata: {
            errors: validationError.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        });
        return res.status(400).json({
          message: "Données de validation invalides",
          errors: validationError.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      throw validationError;
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { guardians: true },
    });

    if (!existingStudent) {
      await createAuditLog({
        ...auditData,
        action: "UPDATE_STUDENT_ATTEMPT",
        entity: "Student",
        entityId: id,
        description:
          "Tentative de mise à jour d'étudiant - étudiant non trouvé",
        status: "ERROR",
      });
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    if (studentId && studentId !== existingStudent.studentId) {
      const existingStudentId = await prisma.student.findUnique({
        where: { studentId },
      });
      if (existingStudentId) {
        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative de mise à jour d'étudiant - matricule déjà existant",
          status: "ERROR",
          metadata: { studentId },
        });
        throw new Error("Un étudiant avec ce matricule existe déjà");
      }
    }

    if (email && email !== existingStudent.email) {
      const existingEmail = await prisma.student.findUnique({
        where: { email },
      });
      if (existingEmail) {
        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative de mise à jour d'étudiant - email déjà existant",
          status: "ERROR",
          metadata: { email },
        });
        throw new Error("Un étudiant avec cet email existe déjà");
      }
    }

    if (cin && cin !== existingStudent.cin) {
      const existingCin = await prisma.student.findUnique({ where: { cin } });
      if (existingCin) {
        await createAuditLog({
          ...auditData,
          action: "UPDATE_STUDENT_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative de mise à jour d'étudiant - CIN déjà existant",
          status: "ERROR",
          metadata: { cin },
        });
        throw new Error("Un étudiant avec ce CIN existe déjà");
      }
    }

    if (req.file) {
      fileCleanupRequired = true;
      validateUploadedFile(req.file);
    }

    let photoPath = existingStudent.photo;
    if (req.file) {
      if (existingStudent.photo) {
        const oldPhotoPath = path.join(
          __dirname,
          "..",
          "..",
          existingStudent.photo
        );
        await safeDeleteFile(oldPhotoPath);
      }
      photoPath = `/uploads/profiles/${req.file.filename}`;
    }

    let dobDate = existingStudent.dateOfBirth;
    if (dateOfBirth) {
      dobDate = new Date(dateOfBirth);
      if (isNaN(dobDate.getTime())) {
        dobDate = existingStudent.dateOfBirth;
      }
    }

    const updateData: any = {
      firstName: firstName ?? existingStudent.firstName,
      lastName: lastName ?? existingStudent.lastName,
      studentId: studentId ?? existingStudent.studentId,
      email: email ?? existingStudent.email,
      phone: phone ?? existingStudent.phone,
      dateOfBirth: dobDate,
      placeOfBirth: placeOfBirth ?? existingStudent.placeOfBirth,
      address: address ?? existingStudent.address,
      allergies: allergies ?? existingStudent.allergies,
      disabilities: disabilities ?? existingStudent.disabilities,
      cin: cin ?? existingStudent.cin,
      photo: photoPath,
    };

    // Gestion des champs enum
    if (bloodGroup) {
      const normalizedBloodGroup = normalizeBloodGroup(bloodGroup);
      if (normalizedBloodGroup) {
        updateData.bloodGroup = normalizedBloodGroup;
      }
    } else {
      updateData.bloodGroup = existingStudent.bloodGroup;
    }

    if (status) {
      updateData.status = normalizeStatus(status);
    } else {
      updateData.status = existingStudent.status;
    }

    if (sexe) {
      updateData.sexe = normalizeSexe(sexe);
    } else {
      updateData.sexe = existingStudent.sexe;
    }

    const student = await prisma.$transaction(async (tx) => {
      const updatedStudent = await tx.student.update({
        where: { id },
        data: updateData,
      });

      if (guardians && Array.isArray(guardians)) {
        await tx.guardian.deleteMany({ where: { studentId: id } });

        if (guardians.length > 0) {
          await tx.guardian.createMany({
            data: guardians.map((guardian: any) => ({
              firstName: guardian.firstName,
              lastName: guardian.lastName,
              relationship: guardian.relationship,
              phone: guardian.phone,
              email: guardian.email || null,
              address: guardian.address || null,
              isPrimary: guardian.isPrimary || false,
              studentId: id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          });
        }
      }

      return await tx.student.findUnique({
        where: { id },
        include: { guardians: true },
      });
    });

    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_SUCCESS",
      entity: "Student",
      entityId: student?.id,
      description: "Étudiant mis à jour avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: student?.studentId,
        updatedFields: Object.keys(updateData),
        guardiansUpdated: !!guardians,
        photoUpdated: !!req.file,
      },
    });

    res.json({
      message: "Étudiant mis à jour avec succès",
      student,
    });

    fileCleanupRequired = false;
  } catch (error: unknown) {
    console.error("❌ Erreur modification étudiant:", error);

    if (fileCleanupRequired && req.file?.path) {
      await safeDeleteFile(req.file.path);
    }

    const errorMessage = getErrorMessage(error);

    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_ERROR",
      entity: "Student",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour de l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(400).json({
      message: errorMessage || "Erreur lors de la modification",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Importation d'étudiants
export const importStudents = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  if (!req.file) {
    await createAuditLog({
      ...auditData,
      action: "IMPORT_STUDENTS_ATTEMPT",
      entity: "Student",
      description: "Tentative d'importation d'étudiants - aucun fichier fourni",
      status: "ERROR",
    });
    return res.status(400).json({ message: "Aucun fichier fourni" });
  }

  try {
    validateUploadedFile(req.file);
    const filePath = req.file.path;
    let studentsData: any[] = [];

    await createAuditLog({
      ...auditData,
      action: "IMPORT_STUDENTS_START",
      entity: "Student",
      description: "Début de l'importation des étudiants",
      status: "SUCCESS",
      metadata: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });

    if (
      req.file.mimetype.includes("excel") ||
      req.file.mimetype.includes("spreadsheet") ||
      req.file.originalname.match(/\.(xlsx|xls)$/i)
    ) {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      studentsData = XLSX.utils.sheet_to_json(worksheet);
    } else if (
      req.file.mimetype.includes("json") ||
      req.file.originalname.match(/\.json$/i)
    ) {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      studentsData = JSON.parse(fileContent);
    } else {
      await safeDeleteFile(filePath);
      await createAuditLog({
        ...auditData,
        action: "IMPORT_STUDENTS_ERROR",
        entity: "Student",
        description: "Format de fichier non supporté pour l'importation",
        status: "ERROR",
        metadata: { mimeType: req.file.mimetype },
      });
      return res.status(400).json({
        message:
          "Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou JSON",
      });
    }

    console.log("📊 Données importées:", studentsData.length, "étudiants");

    const results = {
      success: 0,
      errors: 0,
      details: [] as any[],
    };

    for (const [index, rawStudentData] of studentsData.entries()) {
      try {
        const studentData = processImportData(rawStudentData);

        if (
          !studentData.firstName ||
          !studentData.lastName ||
          !studentData.studentId ||
          !studentData.email ||
          !studentData.guardianFirstName ||
          !studentData.guardianLastName ||
          !studentData.guardianRelationship ||
          !studentData.guardianPhone
        ) {
          throw new Error("Données obligatoires manquantes");
        }

        const [existingStudent, existingEmail] = await Promise.all([
          prisma.student.findUnique({
            where: { studentId: studentData.studentId },
          }),
          prisma.student.findUnique({ where: { email: studentData.email } }),
        ]);

        if (existingStudent) throw new Error("Matricule déjà existant");
        if (existingEmail) throw new Error("Email déjà existant");

        if (
          studentData.bloodGroup &&
          !normalizeBloodGroup(studentData.bloodGroup)
        ) {
          throw new Error(
            `Groupe sanguin invalide: ${studentData.bloodGroup}. Utilisez A+, A-, B+, B-, AB+, AB-, O+, O-`
          );
        }

        const studentCreateData = createStudentData(studentData);

        await prisma.$transaction(async (tx) => {
          const newStudent = await tx.student.create({
            data: studentCreateData,
          });

          const guardianData = {
            firstName: studentData.guardianFirstName,
            lastName: studentData.guardianLastName,
            relationship: studentData.guardianRelationship,
            phone: studentData.guardianPhone,
            email: studentData.guardianEmail || null,
            address: studentData.guardianAddress || null,
            isPrimary: true,
            studentId: newStudent.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await tx.guardian.create({ data: guardianData });
        });

        results.success++;
        results.details.push({
          index: index + 1,
          studentId: studentData.studentId,
          status: "success",
          message: "Étudiant créé avec succès",
        });
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error(`❌ Erreur ligne ${index + 1}:`, errorMessage);
        results.errors++;
        results.details.push({
          index: index + 1,
          studentId: rawStudentData.studentId,
          status: "error",
          message: errorMessage,
          data: rawStudentData,
        });
      }
    }

    await safeDeleteFile(filePath);

    console.log(
      "🎉 Import terminé:",
      results.success,
      "succès,",
      results.errors,
      "erreurs"
    );

    await createAuditLog({
      ...auditData,
      action: "IMPORT_STUDENTS_COMPLETE",
      entity: "Student",
      description: "Importation des étudiants terminée",
      status: "SUCCESS",
      metadata: {
        total: studentsData.length,
        success: results.success,
        errors: results.errors,
        successRate: `${((results.success / studentsData.length) * 100).toFixed(2)}%`,
      },
    });

    res.json({
      message: `Import terminé: ${results.success} succès, ${results.errors} erreurs`,
      summary: {
        total: studentsData.length,
        success: results.success,
        errors: results.errors,
      },
      results: results.details,
    });
  } catch (error: unknown) {
    console.error("❌ Erreur import étudiants:", error);

    if (req.file?.path) {
      await safeDeleteFile(req.file.path);
    }

    const errorMessage = getErrorMessage(error);

    await createAuditLog({
      ...auditData,
      action: "IMPORT_STUDENTS_ERROR",
      entity: "Student",
      description: "Erreur lors de l'importation des étudiants",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de l'importation: " + errorMessage,
    });
  }
};
export const updateStudentPhoto = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    if (!req.file) {
      await createAuditLog({
        ...auditData,
        action: "UPDATE_STUDENT_PHOTO_ATTEMPT",
        entity: "Student",
        entityId: id,
        description: "Tentative de mise à jour de photo - aucune photo fournie",
        status: "ERROR",
      });

      return res.status(400).json({
        message: "Aucune photo fournie",
      });
    }

    validateUploadedFile(req.file);

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      await safeDeleteFile(req.file.path);

      await createAuditLog({
        ...auditData,
        action: "UPDATE_STUDENT_PHOTO_ATTEMPT",
        entity: "Student",
        entityId: id,
        description: "Tentative de mise à jour de photo - étudiant non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // Supprimer l'ancienne photo si elle existe
    if (student.photo) {
      const oldPhotoPath = path.join(__dirname, "..", "..", student.photo);
      await safeDeleteFile(oldPhotoPath);
    }

    // Mettre à jour la photo
    const photoPath = `/uploads/profiles/${req.file.filename}`;
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { photo: photoPath },
    });

    // Log de succès
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_PHOTO_SUCCESS",
      entity: "Student",
      entityId: id,
      description: "Photo de l'étudiant mise à jour avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: student.studentId,
        oldPhoto: student.photo ? "supprimée" : "aucune",
        newPhoto: photoPath,
      },
    });

    res.json({
      message: "Photo mise à jour avec succès",
      student: updatedStudent,
    });
  } catch (error: unknown) {
    console.error("Erreur mise à jour photo:", error);

    // Nettoyer le fichier en cas d'erreur
    if (req.file?.path) {
      await safeDeleteFile(req.file.path);
    }

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "UPDATE_STUDENT_PHOTO_ERROR",
      entity: "Student",
      entityId: req.params.id,
      description: "Erreur lors de la mise à jour de la photo de l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de la mise à jour de la photo",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).user.id || "unknown",
  };

  try {
    const user = (req as any).user;
    const facultyId = (req as any).facultyId;

    let whereCondition: any = {};

    // Si c'est un doyen, limiter aux étudiants de sa faculté
    if (user?.role === "Doyen" && facultyId) {
      whereCondition = {
        enrollments: {
          some: {
            facultyId: facultyId,
            status: "Active",
          },
        },
      };
    }

    const students = await prisma.student.findMany({
      where: whereCondition,
      include: {
        guardians: true,
        enrollments: {
          where: user?.role === "Doyen" ? { facultyId: facultyId } : undefined,
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            academicYear: true,
          },
        },
        grades: {
          include: {
            ue: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Log de consultation
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENTS_LIST",
      entity: "Student",
      description: "Consultation de la liste des étudiants",
      status: "SUCCESS",
      metadata: {
        count: students.length,
        userRole: user?.role,
        facultyFilter: facultyId || "none",
      },
    });

    res.json(students);
  } catch (error: unknown) {
    console.error("Erreur récupération étudiants:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENTS_LIST_ERROR",
      entity: "Student",
      description: "Erreur lors de la récupération de la liste des étudiants",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de la récupération des étudiants",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;
    const user = (req as any).user;
    const facultyId = (req as any).facultyId;

    // Vérifier l'accès pour les doyens
    if (user?.role === "Doyen") {
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          studentId: id,
          facultyId: facultyId,
          status: "Active",
        },
      });

      if (!enrollment) {
        await createAuditLog({
          ...auditData,
          action: "GET_STUDENT_DETAILS_ATTEMPT",
          entity: "Student",
          entityId: id,
          description:
            "Tentative d'accès non autorisé aux détails d'un étudiant",
          status: "ERROR",
          metadata: {
            userRole: user?.role,
            facultyId: facultyId,
          },
        });

        return res.status(403).json({
          message: "Accès non autorisé à cet étudiant",
        });
      }
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        guardians: true,
        enrollments: {
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
                code: true,
                dean: true,
              },
            },
            academicYear: true,
          },
        },
        grades: {
          include: {
            ue: true,
          },
        },
      },
    });

    if (!student) {
      await createAuditLog({
        ...auditData,
        action: "GET_STUDENT_DETAILS_ATTEMPT",
        entity: "Student",
        entityId: id,
        description: "Tentative de consultation d'étudiant - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // Log de consultation réussie
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_DETAILS_SUCCESS",
      entity: "Student",
      entityId: id,
      description: "Consultation des détails de l'étudiant",
      status: "SUCCESS",
      metadata: {
        studentId: student.studentId,
        hasGuardians: student.guardians.length > 0,
        hasEnrollments: student.enrollments.length > 0,
      },
    });

    res.json(student);
  } catch (error: unknown) {
    console.error("Erreur récupération étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "GET_STUDENT_DETAILS_ERROR",
      entity: "Student",
      entityId: req.params.id,
      description: "Erreur lors de la récupération des détails de l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de la récupération de l'étudiant",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const { id } = req.params;

    // Vérifier d'abord si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        guardians: true,
        enrollments: true,
        grades: true,
      },
    });

    if (!student) {
      await createAuditLog({
        ...auditData,
        action: "DELETE_STUDENT_ATTEMPT",
        entity: "Student",
        entityId: id,
        description: "Tentative de suppression d'étudiant - non trouvé",
        status: "ERROR",
      });

      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // CORRECTION : Transaction simplifiée pour la suppression
    await prisma.$transaction(async (tx) => {
      // Supprimer les données liées dans l'ordre
      if (student.grades && student.grades.length > 0) {
        await tx.grade.deleteMany({
          where: { studentId: id },
        });
      }

      if (student.enrollments && student.enrollments.length > 0) {
        await tx.enrollment.deleteMany({
          where: { studentId: id },
        });
      }

      if (student.guardians && student.guardians.length > 0) {
        await tx.guardian.deleteMany({
          where: { studentId: id },
        });
      }

      // Supprimer l'étudiant
      await tx.student.delete({
        where: { id },
      });
    });

    // Supprimer la photo si elle existe
    if (student.photo) {
      const photoPath = path.join(__dirname, "..", "..", student.photo);
      await safeDeleteFile(photoPath);
    }

    // Log de suppression réussie
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_SUCCESS",
      entity: "Student",
      entityId: id,
      description: "Étudiant supprimé avec succès",
      status: "SUCCESS",
      metadata: {
        studentId: student.studentId,
        deletedGuardians: student.guardians.length,
        deletedEnrollments: student.enrollments.length,
        deletedGrades: student.grades.length,
        photoDeleted: !!student.photo,
      },
    });

    res.json({
      message: "Étudiant supprimé avec succès",
    });
  } catch (error: unknown) {
    console.error("Erreur suppression étudiant:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur de suppression
    await createAuditLog({
      ...auditData,
      action: "DELETE_STUDENT_ERROR",
      entity: "Student",
      entityId: req.params.id,
      description: "Erreur lors de la suppression de l'étudiant",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de la suppression de l'étudiant",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

export const downloadImportTemplate = async (req: Request, res: Response) => {
  const auditData = {
    ipAddress: req.ip || "unknown",
    userAgent: req.get("User-Agent") || "unknown",
    userId: (req as any).userId || "unknown",
  };

  try {
    const templateData = [
      {
        firstName: "Jean",
        lastName: "Dupont",
        studentId: "ETU20240001",
        email: "jean.dupont@example.com",
        phone: "0612345678",
        dateOfBirth: "2005-03-15",
        placeOfBirth: "Paris",
        address: "123 Avenue des Champs, Paris",
        bloodGroup: "A+", // FORMAT SIMPLIFIÉ
        allergies: "Aucune",
        disabilities: "Aucune",
        cin: "123456789012",
        sexe: "Masculin",
        status: "Active",
        guardianFirstName: "Pierre",
        guardianLastName: "Dupont",
        guardianRelationship: "Père",
        guardianPhone: "0612345679",
        guardianEmail: "pierre.dupont@example.com",
        guardianAddress: "123 Avenue des Champs, Paris",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Étudiants");

    // Ajouter une feuille d'instructions
    const instructions = [
      {
        Champ: "bloodGroup",
        Format: "A+, A-, B+, B-, AB+, AB-, O+, O-",
        Exemple: "A+",
      },
      {
        Champ: "sexe",
        Format: "Masculin, Feminin, Autre",
        Exemple: "Masculin",
      },
      {
        Champ: "status",
        Format: "Active, Inactive, Graduated, Suspended",
        Exemple: "Active",
      },
      { Champ: "dateOfBirth", Format: "YYYY-MM-DD", Exemple: "2005-03-15" },
    ];

    const instructionSheet = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=template-import-etudiants.xlsx"
    );

    // Log de téléchargement du template
    await createAuditLog({
      ...auditData,
      action: "DOWNLOAD_IMPORT_TEMPLATE",
      entity: "Student",
      description: "Téléchargement du template d'importation d'étudiants",
      status: "SUCCESS",
    });

    res.send(buffer);
  } catch (error: unknown) {
    console.error("Erreur génération template:", error);

    const errorMessage = getErrorMessage(error);

    // Log d'erreur
    await createAuditLog({
      ...auditData,
      action: "DOWNLOAD_IMPORT_TEMPLATE_ERROR",
      entity: "Student",
      description: "Erreur lors de la génération du template d'importation",
      status: "ERROR",
      errorMessage: errorMessage,
    });

    res.status(500).json({
      message: "Erreur lors de la génération du template",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
