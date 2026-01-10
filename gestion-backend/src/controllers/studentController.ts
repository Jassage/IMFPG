/**
 * @file studentController.ts
 * @description Contrôleurs pour la gestion des étudiants
 * @version 1.0.0
 */

import { Request, Response } from "express";
import StudentService from "../services/studentService";
import { extractAuditData } from "./auth/authUtils";
import { createAuditLog } from "./auditController";
import {
  StudentActionTypes,
  StudentControllerResponse,
} from "../types/studentTypes";

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
    const result = await StudentService.getStudents(
      req.query,
      auditData.userId ?? undefined,
      auditData.userRole
    );

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_LIST_REQUEST,
      entity: "Student",
      description: "Liste des étudiants récupérée avec succès",
      status: "SUCCESS",
      metadata: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalStudents: result.pagination.total,
        filters: req.query,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Liste des étudiants récupérée avec succès",
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - getStudents error:", error);

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
      message: error.message || "Erreur interne du serveur",
      code: error.code || "INTERNAL_ERROR",
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

    const student = await StudentService.getStudentById(
      id,
      auditData.userId ?? undefined,
      auditData.userRole
    );

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
    console.error(" StudentController - getStudentById error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "STUDENT_NOT_FOUND") {
      statusCode = 404;
      errorCode = "STUDENT_NOT_FOUND";
      errorMessage = "Étudiant non trouvé";
    } else if (error.message === "UNAUTHORIZED") {
      statusCode = 403;
      errorCode = "UNAUTHORIZED";
      errorMessage = "Accès non autorisé";
    }

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
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
  }
};

/**
 * @desc Crée un nouvel étudiant
 * @route POST /api/students
 * @access Admin/Staff
 */
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
    const result = await StudentService.createStudent(req.body);

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
        sendWelcomeEmail: req.body.sendWelcomeEmail,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant créé avec succès",
      data: responseData,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error(" StudentController - createStudent error:", error);

    // Extraire le code d'erreur du message
    const errorParts = error.message.split(":");
    const errorCode = errorParts[0].trim();
    const errorMessage =
      errorParts.length > 1
        ? errorParts.slice(1).join(":").trim()
        : error.message;

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let responseMessage = errorMessage;
    let responseCode = errorCode;

    const errorMapping: Record<
      string,
      { status: number; message: string; code?: string }
    > = {
      MISSING_REQUIRED_FIELDS: {
        status: 400,
        message: "Prénom, nom et email sont requis",
      },
      EMAIL_ALREADY_EXISTS: {
        status: 409,
        message: errorMessage,
      },
      USER_EMAIL_ALREADY_EXISTS: {
        status: 409,
        message: errorMessage,
      },
      CIN_ALREADY_EXISTS: {
        status: 409,
        message: errorMessage,
      },
      CLASS_NOT_FOUND: {
        status: 404,
        message: errorMessage,
      },
      CLASS_NOT_ACTIVE: {
        status: 400,
        message: errorMessage,
      },
      ACADEMIC_YEAR_NOT_FOUND: {
        status: 404,
        message: errorMessage,
      },
      FUTURE_ACADEMIC_YEAR: {
        status: 400,
        message: errorMessage,
      },
      ACADEMIC_YEAR_NOT_STARTED: {
        status: 400,
        message: errorMessage,
      },
      ACADEMIC_YEAR_NOT_ACTIVE: {
        status: 400,
        message: errorMessage,
      },
      CLASS_YEAR_MISMATCH: {
        status: 400,
        message: errorMessage,
      },
      CLASS_FULL: {
        status: 400,
        message: errorMessage,
      },
      CANNOT_CREATE_INACTIVE_STUDENT: {
        status: 400,
        message: errorMessage,
      },
      STUDENT_ALREADY_ENROLLED_FOR_YEAR: {
        status: 409,
        message: errorMessage,
      },
      AGE_CLASS_MISMATCH: {
        status: 400,
        message: errorMessage,
      },
    };

    if (errorMapping[errorCode]) {
      statusCode = errorMapping[errorCode].status;
      responseMessage = errorMapping[errorCode].message;
      responseCode = errorCode;
    } else {
      // Erreur générique non mappée
      responseMessage = "Erreur interne du serveur";
      responseCode = "INTERNAL_ERROR";
    }

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CREATION_ERROR,
      entity: "Student",
      description: `Erreur création étudiant: ${errorCode}`,
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
      metadata: {
        errorCode,
        errorMessage: error.message,
      },
    });

    const response: StudentControllerResponse = {
      success: false,
      message: responseMessage,
      code: responseCode,
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
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

    const updatedStudent = await StudentService.updateStudent(id, req.body);

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
        updatedFields: Object.keys(req.body),
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiant mis à jour avec succès",
      data: { student: updatedStudent },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - updateStudent error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "STUDENT_NOT_FOUND") {
      statusCode = 404;
      errorCode = "STUDENT_NOT_FOUND";
      errorMessage = "Étudiant non trouvé";
    } else if (error.message === "EMAIL_ALREADY_EXISTS") {
      statusCode = 400;
      errorCode = "EMAIL_ALREADY_EXISTS";
      errorMessage = "Un étudiant avec cet email existe déjà";
    } else if (error.message === "CIN_ALREADY_EXISTS") {
      statusCode = 400;
      errorCode = "CIN_ALREADY_EXISTS";
      errorMessage = "Un étudiant avec ce CIN existe déjà";
    } else if (error.message === "CLASS_NOT_FOUND") {
      statusCode = 404;
      errorCode = "CLASS_NOT_FOUND";
      errorMessage = "Classe non trouvée";
    }

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
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
  }
};

/**
 * @desc Supprime un étudiant (soft delete)
 * @route DELETE /api/students/:id
 * @access Admin/Staff
 */
export /**
 * Supprime un étudiant
 */
const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: "ID de l'étudiant requis",
      });
    }

    await StudentService.deleteStudent(studentId);

    return res.status(200).json({
      success: true,
      message: "Étudiant supprimé avec succès",
    });
  } catch (error: any) {
    console.error("StudentController - deleteStudent error:", error);

    // Gérer spécifiquement le cas où l'étudiant est déjà supprimé
    if (error.message.includes("STUDENT_ALREADY_DELETED")) {
      return res.status(200).json({
        success: true,
        message: "Étudiant déjà supprimé",
      });
    }

    // Gérer le cas où l'étudiant n'est pas trouvé
    if (error.message.includes("STUDENT_NOT_FOUND")) {
      return res.status(404).json({
        success: false,
        error: "Étudiant non trouvé",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de l'étudiant",
    });
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

    const result = await StudentService.updateStudentStatus(id, status, reason);

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_STATUS_UPDATED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: `Statut de l'étudiant modifié de ${result.change.oldStatus} à ${status}`,
      status: "SUCCESS",
      metadata: {
        oldStatus: result.change.oldStatus,
        newStatus: status,
        reason,
      },
    });

    const response: StudentControllerResponse = {
      success: true,
      message: `Statut de l'étudiant mis à jour avec succès`,
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - updateStudentStatus error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "INVALID_STATUS") {
      statusCode = 400;
      errorCode = "INVALID_STATUS";
      errorMessage = "Statut invalide";
    } else if (error.message === "STUDENT_NOT_FOUND") {
      statusCode = 404;
      errorCode = "STUDENT_NOT_FOUND";
      errorMessage = "Étudiant non trouvé";
    }

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
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
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

    const result = await StudentService.assignStudentToClass(
      id,
      classId,
      academicYearId
    );

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENT_CLASS_ASSIGNED,
      entity: "Student",
      entityId: id,
      userId: auditData.userId,
      description: `Étudiant affecté à la classe ${result.metadata.className}`,
      status: "SUCCESS",
      metadata: result.metadata,
    });

    const response: StudentControllerResponse = {
      success: true,
      message: `Étudiant affecté à la classe ${result.metadata.className} avec succès`,
      data: { student: result.student },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - assignStudentToClass error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "MISSING_CLASS_ID") {
      statusCode = 400;
      errorCode = "MISSING_CLASS_ID";
      errorMessage = "ID de classe requis";
    } else if (error.message === "STUDENT_NOT_FOUND") {
      statusCode = 404;
      errorCode = "STUDENT_NOT_FOUND";
      errorMessage = "Étudiant non trouvé";
    } else if (error.message === "CLASS_NOT_FOUND") {
      statusCode = 404;
      errorCode = "CLASS_NOT_FOUND";
      errorMessage = "Classe non trouvée";
    } else if (error.message === "ACADEMIC_YEAR_NOT_FOUND") {
      statusCode = 404;
      errorCode = "ACADEMIC_YEAR_NOT_FOUND";
      errorMessage = "Année académique non trouvée";
    }

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
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
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
    const statistics = await StudentService.getStudentStatistics();

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
    console.error(" StudentController - getStudentStatistics error:", error);

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

    const results = await StudentService.importStudents(students);

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
    console.error(" StudentController - importStudents error:", error);

    // Gestion des erreurs spécifiques
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Erreur interne du serveur";

    if (error.message === "NO_STUDENT_DATA") {
      statusCode = 400;
      errorCode = "NO_STUDENT_DATA";
      errorMessage = "Aucune donnée d'étudiant fournie";
    }

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
      message: errorMessage,
      code: errorCode,
    };

    res.status(statusCode).json(response);
  }
};

/**
 * @desc Recherche des étudiants par terme
 * @route GET /api/students/search
 * @access Admin/Staff/Teacher
 */
export const searchStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.toString().trim().length < 2) {
      const response: StudentControllerResponse = {
        success: true,
        message: "Terme de recherche trop court",
        data: { students: [] },
      };
      res.json(response);
      return;
    }

    const students = await StudentService.searchStudents(
      q.toString(),
      parseInt(limit.toString())
    );

    const response: StudentControllerResponse = {
      success: true,
      message: "Recherche effectuée avec succès",
      data: { students },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - searchStudents error:", error);

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur lors de la recherche",
      code: "SEARCH_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Vérifie la disponibilité d'un email
 * @route GET /api/students/check-email
 * @access Public (pour les formulaires d'inscription)
 */
export const checkEmailAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, excludeStudentId } = req.query;

    if (!email) {
      const response: StudentControllerResponse = {
        success: false,
        message: "Email requis",
        code: "EMAIL_REQUIRED",
      };
      res.status(400).json(response);
      return;
    }

    const isAvailable = await StudentService.checkEmailAvailability(
      email.toString(),
      excludeStudentId?.toString()
    );

    const response: StudentControllerResponse = {
      success: true,
      message: isAvailable ? "Email disponible" : "Email déjà utilisé",
      data: { available: isAvailable },
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - checkEmailAvailability error:", error);

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur lors de la vérification de l'email",
      code: "CHECK_EMAIL_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Récupère les étudiants d'une classe spécifique
 * @route GET /api/classes/:classId/students
 * @access Admin/Staff/Teacher
 */
export const getStudentsByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    const { classId } = req.params;
    const { status } = req.query;

    const students = await StudentService.getStudents(
      {
        classId,
        status: status?.toString(),
        page: 1,
        limit: 1000,
        sortBy: "lastName",
        sortOrder: "asc",
      },
      auditData.userId ?? undefined,
      auditData.userRole
    );

    const response: StudentControllerResponse = {
      success: true,
      message: "Étudiants de la classe récupérés avec succès",
      data: students,
    };

    res.json(response);
  } catch (error: any) {
    console.error(" StudentController - getStudentsByClass error:", error);

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur lors de la récupération des étudiants de la classe",
      code: "CLASS_STUDENTS_ERROR",
    };

    res.status(500).json(response);
  }
};

/**
 * @desc Exporte la liste des étudiants en CSV/Excel
 * @route GET /api/students/export
 * @access Admin/Staff
 */
export const exportStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const auditData = extractAuditData(req);

  try {
    // Récupérer tous les étudiants (sans pagination pour l'export)
    const result = await StudentService.getStudents(
      {
        ...req.query,
        page: 1,
        limit: 10000, // Limite élevée pour l'export
      },
      auditData.userId ?? undefined,
      auditData.userRole
    );

    // Formater les données pour l'export
    const exportData = result.data.map((student: any) => ({
      "Code Étudiant": student.studentCode,
      Prénom: student.firstName,
      Nom: student.lastName,
      Email: student.email,
      Téléphone: student.phone || "",
      "Date de naissance": student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString()
        : "",
      "Lieu de naissance": student.placeOfBirth || "",
      Adresse: student.address || "",
      "Groupe sanguin": student.bloodGroup || "",
      Allergies: student.allergies || "",
      Handicaps: student.disabilities || "",
      Statut: student.status,
      Sexe: student.sexe || "",
      CIN: student.cin || "",
      Classe: student.schoolClass?.name || "Non assigné",
      "Date d'inscription": new Date(student.createdAt).toLocaleDateString(),
    }));

    // Log d'audit
    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_LIST_REQUEST,
      entity: "Student",
      description: "Export des étudiants généré avec succès",
      status: "SUCCESS",
      metadata: {
        exportCount: exportData.length,
        format: req.query.format || "csv",
      },
    });

    // Retourner les données selon le format demandé
    const format = req.query.format || "json";

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=etudiants_${new Date().toISOString().split("T")[0]}.csv`
      );

      // Convertir en CSV (simplifié)
      const csvRows = [];
      const headers = Object.keys(exportData[0] || {});
      csvRows.push(headers.join(","));

      for (const row of exportData) {
        const values = headers.map((header) => {
          const value = (row as Record<string, any>)[header];
          // Échapper les guillemets et les virgules
          const escaped = ("" + value).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      }

      res.send(csvRows.join("\n"));
    } else {
      // Format JSON par défaut
      const response: StudentControllerResponse = {
        success: true,
        message: "Données d'export générées avec succès",
        data: {
          students: exportData,
          total: exportData.length,
          generatedAt: new Date().toISOString(),
        },
      };

      res.json(response);
    }
  } catch (error: any) {
    console.error(" StudentController - exportStudents error:", error);

    await createAuditLog({
      ...auditData,
      action: StudentActionTypes.STUDENTS_LIST_ERROR,
      entity: "Student",
      description: "Erreur lors de l'export des étudiants",
      status: "ERROR",
      errorMessage: error.message?.substring(0, 500),
    });

    const response: StudentControllerResponse = {
      success: false,
      message: "Erreur lors de l'export des étudiants",
      code: "EXPORT_ERROR",
    };

    res.status(500).json(response);
  }
};
