import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Interface pour les données d'importation
interface ImportStudentData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: "Active" | "Inactive";
  guardianFirstName: string;
  guardianLastName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianAddress?: string;
}

export const createStudent = async (req: Request, res: Response) => {
  try {
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
      guardians,
    } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !studentId || !email) {
      return res.status(400).json({
        message:
          "Les champs firstName, lastName, studentId et email sont obligatoires",
      });
    }

    // Vérifier si l'étudiant existe déjà
    const existingStudent = await prisma.student.findUnique({
      where: { studentId },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Un étudiant avec ce matricule existe déjà",
      });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.student.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Un étudiant avec cet email existe déjà",
      });
    }

    // Validation des responsables
    if (!guardians || !Array.isArray(guardians) || guardians.length === 0) {
      return res.status(400).json({
        message: "Au moins un responsable doit être fourni",
      });
    }

    const primaryGuardians = guardians.filter((g) => g.isPrimary);
    if (primaryGuardians.length !== 1) {
      return res.status(400).json({
        message: "Exactement un responsable principal doit être désigné",
      });
    }

    // Gestion de la photo de profil
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/profiles/${req.file.filename}`;
    }

    // Créer l'étudiant avec ses responsables
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        studentId,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth: placeOfBirth || null,
        address: address || null,
        bloodGroup: bloodGroup || null,
        allergies: allergies || null,
        disabilities: disabilities || null,
        status: status || "Active",
        photo: photoPath,
        guardians: {
          create: guardians.map((guardian: any) => ({
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            relationship: guardian.relationship,
            phone: guardian.phone,
            email: guardian.email || null,
            address: guardian.address || null,
            isPrimary: guardian.isPrimary,
          })),
        },
      },
      include: {
        guardians: true,
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Erreur création étudiant:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const importStudents = async (req: Request, res: Response) => {
  try {
    console.log("=== DÉBUT IMPORT ===");
    console.log("Fichier reçu:", req.file);
    console.log("Nom du fichier:", req.file?.filename);
    console.log("Type MIME:", req.file?.mimetype);
    console.log("Chemin:", req.file?.path);

    if (!req.file) {
      console.log("Aucun fichier reçu");
      return res.status(400).json({
        message: "Aucun fichier fourni",
      });
    }

    const filePath = req.file.path;
    let studentsData: ImportStudentData[] = [];

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log("Fichier non trouvé au path:", filePath);
      return res.status(400).json({
        message: "Fichier non trouvé",
      });
    }

    // Lire le fichier selon son type
    if (
      req.file.mimetype.includes("excel") ||
      req.file.mimetype.includes("spreadsheet") ||
      req.file.originalname.includes(".xlsx") ||
      req.file.originalname.includes(".xls")
    ) {
      console.log("Tentative de lecture Excel...");
      try {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        studentsData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Données Excel lues:", studentsData.length, "lignes");
      } catch (excelError) {
        console.error("Erreur lecture Excel:", excelError);
        throw new Error("Format Excel invalide");
      }
    } else if (
      req.file.mimetype.includes("json") ||
      req.file.originalname.includes(".json")
    ) {
      console.log("Tentative de lecture JSON...");
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        studentsData = JSON.parse(fileContent);
        console.log("Données JSON lues:", studentsData.length, "lignes");
      } catch (jsonError) {
        console.error("Erreur lecture JSON:", jsonError);
        throw new Error("Format JSON invalide");
      }
    } else {
      console.log(
        "Format non supporté:",
        req.file.mimetype,
        req.file.originalname
      );
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "Format de fichier non supporté",
      });
    }

    console.log("Données à traiter:", studentsData);

    const results = {
      success: 0,
      errors: 0,
      details: [] as any[],
    };

    for (const [index, studentData] of studentsData.entries()) {
      try {
        console.log(`Traitement ligne ${index + 1}:`, studentData);

        // Validation des données obligatoires
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

        // Vérifier si l'étudiant existe déjà
        const existingStudent = await prisma.student.findUnique({
          where: { studentId: studentData.studentId },
        });

        if (existingStudent) {
          throw new Error("Matricule déjà existant");
        }

        const existingEmail = await prisma.student.findUnique({
          where: { email: studentData.email },
        });

        if (existingEmail) {
          throw new Error("Email déjà existant");
        }

        // CRÉATION EN BASE DE DONNÉES
        console.log("Création étudiant:", studentData.studentId);
        await prisma.student.create({
          data: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            studentId: studentData.studentId,
            email: studentData.email,
            phone: studentData.phone ? String(studentData.phone) : null,
            dateOfBirth: studentData.dateOfBirth
              ? new Date(studentData.dateOfBirth)
              : null,
            placeOfBirth: studentData.placeOfBirth || null,
            address: studentData.address || null,
            bloodGroup: studentData.bloodGroup || null,
            allergies: studentData.allergies || null,
            disabilities: studentData.disabilities || null,
            status: studentData.status || "Active",
            guardians: {
              create: [
                {
                  firstName: studentData.guardianFirstName,
                  lastName: studentData.guardianLastName,
                  relationship: studentData.guardianRelationship,
                  phone: studentData.guardianPhone
                    ? String(studentData.guardianPhone)
                    : null,
                  email: studentData.guardianEmail || null,
                  address: studentData.guardianAddress || null,
                  isPrimary: true,
                },
              ],
            },
          },
        });

        results.success++;
        results.details.push({
          index: index + 1,
          studentId: studentData.studentId,
          status: "success",
          message: "Étudiant créé avec succès",
        });
      } catch (error: any) {
        console.error(`Erreur ligne ${index + 1}:`, error.message);
        results.errors++;
        results.details.push({
          index: index + 1,
          studentId: studentData.studentId,
          status: "error",
          message: error.message,
        });
      }
    }

    // Supprimer le fichier après traitement
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log("=== IMPORT TERMINÉ ===");
    console.log("Résultats:", results);

    res.json({
      message: `Import terminé: ${results.success} succès, ${results.errors} erreurs`,
      results: results.details,
    });
  } catch (error) {
    console.error("Erreur import étudiants:", error);

    // Nettoyer le fichier en cas d'erreur
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Erreur interne du serveur: " + error,
    });
  }
};

export const updateStudentPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Aucune photo fournie",
      });
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      // Supprimer le fichier uploadé
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // Supprimer l'ancienne photo si elle existe
    if (student.photo) {
      const oldPhotoPath = path.join(__dirname, "..", "..", student.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Mettre à jour la photo
    const photoPath = `/uploads/profiles/${req.file.filename}`;
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        photo: photoPath,
      },
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error("Erreur mise à jour photo:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { includeGuardians } = req.query;

    const students = await prisma.student.findMany({
      include: {
        guardians: true,
        enrollments: true,
        grades: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(students);
  } catch (error) {
    console.error("Erreur récupération étudiants:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      guardians,
    } = req.body;

    // Vérifier si l'étudiant existe
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // Vérifier les conflits de matricule
    if (studentId && studentId !== existingStudent.studentId) {
      const existingStudentId = await prisma.student.findUnique({
        where: { studentId },
      });
      if (existingStudentId) {
        return res.status(400).json({
          message: "Un étudiant avec ce matricule existe déjà",
        });
      }
    }

    // Vérifier les conflits d'email
    if (email && email !== existingStudent.email) {
      const existingEmail = await prisma.student.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res.status(400).json({
          message: "Un étudiant avec cet email existe déjà",
        });
      }
    }

    // Validation des responsables
    if (guardians && Array.isArray(guardians)) {
      const primaryGuardians = guardians.filter((g) => g.isPrimary);
      if (primaryGuardians.length !== 1) {
        return res.status(400).json({
          message: "Exactement un responsable principal doit être désigné",
        });
      }
    }

    // Mettre à jour l'étudiant et ses responsables
    const student = await prisma.student.update({
      where: { id },
      data: {
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        studentId: studentId ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        placeOfBirth: placeOfBirth ?? undefined,
        address: address ?? undefined,
        bloodGroup: bloodGroup ?? undefined,
        allergies: allergies ?? undefined,
        disabilities: disabilities ?? undefined,
        status: status ?? undefined,
        ...(guardians && {
          guardians: {
            deleteMany: {},
            create: guardians.map((guardian: any) => ({
              firstName: guardian.firstName,
              lastName: guardian.lastName,
              relationship: guardian.relationship,
              phone: guardian.phone,
              email: guardian.email || null,
              address: guardian.address || null,
              isPrimary: guardian.isPrimary,
            })),
          },
        }),
      },
      include: {
        guardians: true,
      },
    });

    res.json(student);
  } catch (error) {
    console.error("Erreur modification étudiant:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({
        message: "Étudiant non trouvé",
      });
    }

    // Supprimer la photo si elle existe
    if (student.photo) {
      const photoPath = path.join(__dirname, "..", "..", student.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await prisma.student.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur suppression étudiant:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

// Template pour l'importation
export const downloadImportTemplate = async (req: Request, res: Response) => {
  try {
    // Créer un template Excel
    const templateData = [
      {
        firstName: "Jean",
        lastName: "Dupont",
        studentId: "STU20240001",
        email: "jean.dupont@example.com",
        phone: "1234567890",
        dateOfBirth: "2000-01-01",
        placeOfBirth: "Port-au-Prince",
        address: "123 Rue Principale",
        bloodGroup: "O+",
        allergies: "Aucune",
        disabilities: "Aucune",
        status: "Active",
        guardianFirstName: "Marie",
        guardianLastName: "Dupont",
        guardianRelationship: "Mère",
        guardianPhone: "0987654321",
        guardianEmail: "marie.dupont@example.com",
        guardianAddress: "123 Rue Principale",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Étudiants");

    // Générer le buffer Excel
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Configurer les headers de réponse
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=template-import-etudiants.xlsx"
    );

    // Envoyer le fichier
    res.send(buffer);
  } catch (error) {
    console.error("Erreur génération template:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};
