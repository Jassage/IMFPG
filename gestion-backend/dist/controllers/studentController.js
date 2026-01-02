"use strict";
/**
 * @file studentController.ts
 * @description Contrôleurs pour la gestion des étudiants
 * @version 1.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStudents = exports.getStudentsByClass = exports.checkCINAvailability = exports.checkEmailAvailability = exports.searchStudents = exports.importStudents = exports.getStudentStatistics = exports.assignStudentToClass = exports.updateStudentStatus = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getStudents = void 0;
const studentService_1 = __importDefault(require("../services/studentService"));
const authUtils_1 = require("./auth/authUtils");
const auditController_1 = require("./auditController");
const studentTypes_1 = require("../types/studentTypes");
/**
 * @desc Récupère la liste des étudiants avec pagination et filtres
 * @route GET /api/students
 * @access Admin/Staff/Teacher
 */
const getStudents = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await studentService_1.default.getStudents(req.query, auditData.userId ?? undefined, auditData.userRole);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_LIST_REQUEST,
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
        const response = {
            success: true,
            message: "Liste des étudiants récupérée avec succès",
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - getStudents error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_LIST_ERROR,
            entity: "Student",
            description: "Erreur lors de la récupération des étudiants",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: error.message || "Erreur interne du serveur",
            code: error.code || "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getStudents = getStudents;
/**
 * @desc Récupère un étudiant spécifique par ID
 * @route GET /api/students/:id
 * @access Admin/Staff/Teacher/Parent (si leur enfant)
 */
const getStudentById = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const student = await studentService_1.default.getStudentById(id, auditData.userId ?? undefined, auditData.userRole);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_DETAILS_REQUEST,
            entity: "Student",
            entityId: id,
            userId: auditData.userId,
            description: "Détails de l'étudiant récupérés avec succès",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Étudiant récupéré avec succès",
            data: { student },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - getStudentById error:", error);
        // Gestion des erreurs spécifiques
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "STUDENT_NOT_FOUND") {
            statusCode = 404;
            errorCode = "STUDENT_NOT_FOUND";
            errorMessage = "Étudiant non trouvé";
        }
        else if (error.message === "UNAUTHORIZED") {
            statusCode = 403;
            errorCode = "UNAUTHORIZED";
            errorMessage = "Accès non autorisé";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_DETAILS_ERROR,
            entity: "Student",
            description: "Erreur lors de la récupération des détails de l'étudiant",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.getStudentById = getStudentById;
/**
 * @desc Crée un nouvel étudiant
 * @route POST /api/students
 * @access Admin/Staff
 */
const createStudent = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const result = await studentService_1.default.createStudent(req.body);
        // Préparer la réponse
        const responseData = {
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
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_CREATED,
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
        const response = {
            success: true,
            message: "Étudiant créé avec succès",
            data: responseData,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error(" StudentController - createStudent error:", error);
        // Gestion des erreurs spécifiques
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "MISSING_REQUIRED_FIELDS") {
            statusCode = 400;
            errorCode = "MISSING_REQUIRED_FIELDS";
            errorMessage = "Prénom, nom et email sont requis";
        }
        else if (error.message === "EMAIL_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "EMAIL_ALREADY_EXISTS";
            errorMessage = "Un étudiant avec cet email existe déjà";
        }
        else if (error.message === "USER_EMAIL_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "USER_EMAIL_ALREADY_EXISTS";
            errorMessage =
                "Un utilisateur avec cet email existe déjà. Désactivez 'Créer un compte utilisateur' ou utilisez un email différent.";
        }
        else if (error.message === "CIN_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "CIN_ALREADY_EXISTS";
            errorMessage = "Un étudiant avec ce CIN existe déjà";
        }
        else if (error.message === "CLASS_NOT_FOUND") {
            statusCode = 404;
            errorCode = "CLASS_NOT_FOUND";
            errorMessage = "La classe spécifiée n'existe pas";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_CREATION_ERROR,
            entity: "Student",
            description: "Erreur lors de la création de l'étudiant",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.createStudent = createStudent;
/**
 * @desc Met à jour un étudiant
 * @route PUT /api/students/:id
 * @access Admin/Staff
 */
const updateStudent = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const updatedStudent = await studentService_1.default.updateStudent(id, req.body);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_UPDATED,
            entity: "Student",
            entityId: id,
            userId: auditData.userId,
            description: "Étudiant mis à jour avec succès",
            status: "SUCCESS",
            metadata: {
                updatedFields: Object.keys(req.body),
            },
        });
        const response = {
            success: true,
            message: "Étudiant mis à jour avec succès",
            data: { student: updatedStudent },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - updateStudent error:", error);
        // Gestion des erreurs spécifiques
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "STUDENT_NOT_FOUND") {
            statusCode = 404;
            errorCode = "STUDENT_NOT_FOUND";
            errorMessage = "Étudiant non trouvé";
        }
        else if (error.message === "EMAIL_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "EMAIL_ALREADY_EXISTS";
            errorMessage = "Un étudiant avec cet email existe déjà";
        }
        else if (error.message === "CIN_ALREADY_EXISTS") {
            statusCode = 400;
            errorCode = "CIN_ALREADY_EXISTS";
            errorMessage = "Un étudiant avec ce CIN existe déjà";
        }
        else if (error.message === "CLASS_NOT_FOUND") {
            statusCode = 404;
            errorCode = "CLASS_NOT_FOUND";
            errorMessage = "Classe non trouvée";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_UPDATE_ERROR,
            entity: "Student",
            description: "Erreur lors de la mise à jour de l'étudiant",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.updateStudent = updateStudent;
/**
 * @desc Supprime un étudiant (soft delete)
 * @route DELETE /api/students/:id
 * @access Admin/Staff
 */
const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: "ID de l'étudiant requis",
            });
        }
        await studentService_1.default.deleteStudent(studentId);
        return res.status(200).json({
            success: true,
            message: "Étudiant supprimé avec succès",
        });
    }
    catch (error) {
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
exports.deleteStudent = deleteStudent;
/**
 * @desc Change le statut d'un étudiant
 * @route PUT /api/students/:id/status
 * @access Admin/Staff
 */
const updateStudentStatus = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        const result = await studentService_1.default.updateStudentStatus(id, status, reason);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_STATUS_UPDATED,
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
        const response = {
            success: true,
            message: `Statut de l'étudiant mis à jour avec succès`,
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - updateStudentStatus error:", error);
        // Gestion des erreurs spécifiques
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "INVALID_STATUS") {
            statusCode = 400;
            errorCode = "INVALID_STATUS";
            errorMessage = "Statut invalide";
        }
        else if (error.message === "STUDENT_NOT_FOUND") {
            statusCode = 404;
            errorCode = "STUDENT_NOT_FOUND";
            errorMessage = "Étudiant non trouvé";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_STATUS_UPDATE_ERROR,
            entity: "Student",
            description: "Erreur lors de la mise à jour du statut de l'étudiant",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.updateStudentStatus = updateStudentStatus;
/**
 * @desc Affecte un étudiant à une classe
 * @route PUT /api/students/:id/assign-class
 * @access Admin/Staff
 */
const assignStudentToClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { id } = req.params;
        const { classId, academicYearId } = req.body;
        const result = await studentService_1.default.assignStudentToClass(id, classId, academicYearId);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_CLASS_ASSIGNED,
            entity: "Student",
            entityId: id,
            userId: auditData.userId,
            description: `Étudiant affecté à la classe ${result.metadata.className}`,
            status: "SUCCESS",
            metadata: result.metadata,
        });
        const response = {
            success: true,
            message: `Étudiant affecté à la classe ${result.metadata.className} avec succès`,
            data: { student: result.student },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - assignStudentToClass error:", error);
        // Gestion des erreurs spécifiques
        let statusCode = 500;
        let errorCode = "INTERNAL_ERROR";
        let errorMessage = "Erreur interne du serveur";
        if (error.message === "MISSING_CLASS_ID") {
            statusCode = 400;
            errorCode = "MISSING_CLASS_ID";
            errorMessage = "ID de classe requis";
        }
        else if (error.message === "STUDENT_NOT_FOUND") {
            statusCode = 404;
            errorCode = "STUDENT_NOT_FOUND";
            errorMessage = "Étudiant non trouvé";
        }
        else if (error.message === "CLASS_NOT_FOUND") {
            statusCode = 404;
            errorCode = "CLASS_NOT_FOUND";
            errorMessage = "Classe non trouvée";
        }
        else if (error.message === "ACADEMIC_YEAR_NOT_FOUND") {
            statusCode = 404;
            errorCode = "ACADEMIC_YEAR_NOT_FOUND";
            errorMessage = "Année académique non trouvée";
        }
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_CLASS_ASSIGN_ERROR,
            entity: "Student",
            description: "Erreur lors de l'affectation de l'étudiant à une classe",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.assignStudentToClass = assignStudentToClass;
/**
 * @desc Récupère les statistiques des étudiants
 * @route GET /api/students/statistics
 * @access Admin/Staff
 */
const getStudentStatistics = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const statistics = await studentService_1.default.getStudentStatistics();
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_STATISTICS_REQUEST,
            entity: "Student",
            description: "Statistiques des étudiants récupérées avec succès",
            status: "SUCCESS",
        });
        const response = {
            success: true,
            message: "Statistiques récupérées avec succès",
            data: { statistics },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - getStudentStatistics error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENT_STATISTICS_ERROR,
            entity: "Student",
            description: "Erreur lors de la récupération des statistiques",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getStudentStatistics = getStudentStatistics;
/**
 * @desc Importe des étudiants depuis un fichier CSV/Excel
 * @route POST /api/students/import
 * @access Admin/Staff
 */
const importStudents = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { students } = req.body;
        const results = await studentService_1.default.importStudents(students);
        // Log d'audit
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_IMPORTED,
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
        const response = {
            success: true,
            message: `Import terminé: ${results.success} étudiants créés, ${results.failed} échecs`,
            data: results,
        };
        res.status(201).json(response);
    }
    catch (error) {
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
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_IMPORT_ERROR,
            entity: "Student",
            description: "Erreur lors de l'import des étudiants",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: errorMessage,
            code: errorCode,
        };
        res.status(statusCode).json(response);
    }
};
exports.importStudents = importStudents;
/**
 * @desc Recherche des étudiants par terme
 * @route GET /api/students/search
 * @access Admin/Staff/Teacher
 */
const searchStudents = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { q, limit = 10 } = req.query;
        if (!q || q.toString().trim().length < 2) {
            const response = {
                success: true,
                message: "Terme de recherche trop court",
                data: { students: [] },
            };
            res.json(response);
            return;
        }
        const students = await studentService_1.default.searchStudents(q.toString(), parseInt(limit.toString()));
        const response = {
            success: true,
            message: "Recherche effectuée avec succès",
            data: { students },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - searchStudents error:", error);
        const response = {
            success: false,
            message: "Erreur lors de la recherche",
            code: "SEARCH_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.searchStudents = searchStudents;
/**
 * @desc Vérifie la disponibilité d'un email
 * @route GET /api/students/check-email
 * @access Public (pour les formulaires d'inscription)
 */
const checkEmailAvailability = async (req, res) => {
    try {
        const { email, excludeStudentId } = req.query;
        if (!email) {
            const response = {
                success: false,
                message: "Email requis",
                code: "EMAIL_REQUIRED",
            };
            res.status(400).json(response);
            return;
        }
        const isAvailable = await studentService_1.default.checkEmailAvailability(email.toString(), excludeStudentId?.toString());
        const response = {
            success: true,
            message: isAvailable ? "Email disponible" : "Email déjà utilisé",
            data: { available: isAvailable },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - checkEmailAvailability error:", error);
        const response = {
            success: false,
            message: "Erreur lors de la vérification de l'email",
            code: "CHECK_EMAIL_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.checkEmailAvailability = checkEmailAvailability;
/**
 * @desc Vérifie la disponibilité d'un CIN
 * @route GET /api/students/check-cin
 * @access Admin/Staff
 */
const checkCINAvailability = async (req, res) => {
    try {
        const { cin, excludeStudentId } = req.query;
        if (!cin) {
            const response = {
                success: true,
                message: "CIN non fourni (optionnel)",
                data: { available: true },
            };
            res.json(response);
            return;
        }
        const isAvailable = await studentService_1.default.checkCINAvailability(cin.toString(), excludeStudentId?.toString());
        const response = {
            success: true,
            message: isAvailable ? "CIN disponible" : "CIN déjà utilisé",
            data: { available: isAvailable },
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - checkCINAvailability error:", error);
        const response = {
            success: false,
            message: "Erreur lors de la vérification du CIN",
            code: "CHECK_CIN_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.checkCINAvailability = checkCINAvailability;
/**
 * @desc Récupère les étudiants d'une classe spécifique
 * @route GET /api/classes/:classId/students
 * @access Admin/Staff/Teacher
 */
const getStudentsByClass = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        const { classId } = req.params;
        const { status } = req.query;
        const students = await studentService_1.default.getStudents({
            classId,
            status: status?.toString(),
            page: 1,
            limit: 1000,
            sortBy: "lastName",
            sortOrder: "asc",
        }, auditData.userId ?? undefined, auditData.userRole);
        const response = {
            success: true,
            message: "Étudiants de la classe récupérés avec succès",
            data: students,
        };
        res.json(response);
    }
    catch (error) {
        console.error(" StudentController - getStudentsByClass error:", error);
        const response = {
            success: false,
            message: "Erreur lors de la récupération des étudiants de la classe",
            code: "CLASS_STUDENTS_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.getStudentsByClass = getStudentsByClass;
/**
 * @desc Exporte la liste des étudiants en CSV/Excel
 * @route GET /api/students/export
 * @access Admin/Staff
 */
const exportStudents = async (req, res) => {
    const auditData = (0, authUtils_1.extractAuditData)(req);
    try {
        // Récupérer tous les étudiants (sans pagination pour l'export)
        const result = await studentService_1.default.getStudents({
            ...req.query,
            page: 1,
            limit: 10000, // Limite élevée pour l'export
        }, auditData.userId ?? undefined, auditData.userRole);
        // Formater les données pour l'export
        const exportData = result.data.map((student) => ({
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
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_LIST_REQUEST,
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
            res.setHeader("Content-Disposition", `attachment; filename=etudiants_${new Date().toISOString().split("T")[0]}.csv`);
            // Convertir en CSV (simplifié)
            const csvRows = [];
            const headers = Object.keys(exportData[0] || {});
            csvRows.push(headers.join(","));
            for (const row of exportData) {
                const values = headers.map((header) => {
                    const value = row[header];
                    // Échapper les guillemets et les virgules
                    const escaped = ("" + value).replace(/"/g, '""');
                    return `"${escaped}"`;
                });
                csvRows.push(values.join(","));
            }
            res.send(csvRows.join("\n"));
        }
        else {
            // Format JSON par défaut
            const response = {
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
    }
    catch (error) {
        console.error(" StudentController - exportStudents error:", error);
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: studentTypes_1.StudentActionTypes.STUDENTS_LIST_ERROR,
            entity: "Student",
            description: "Erreur lors de l'export des étudiants",
            status: "ERROR",
            errorMessage: error.message?.substring(0, 500),
        });
        const response = {
            success: false,
            message: "Erreur lors de l'export des étudiants",
            code: "EXPORT_ERROR",
        };
        res.status(500).json(response);
    }
};
exports.exportStudents = exportStudents;
//# sourceMappingURL=studentController.js.map