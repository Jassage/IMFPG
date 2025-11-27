"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrollmentDates = exports.downloadEnrollmentImportTemplate = exports.exportEnrollments = exports.importEnrollments = exports.fixStudentEnrollmentStatus = exports.fixEnrollmentStatuses = exports.ensureSingleActiveEnrollment = exports.deleteEnrollment = exports.getAllEnrollments = exports.updateEnrollment = exports.createEnrollment = void 0;
const XLSX = __importStar(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../prisma"));
const auditController_1 = require("./auditController");
// import { EnrollmentStatus } from "@prisma/client";
// Fonction utilitaire pour gérer les erreurs unknown
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    else if (typeof error === "string") {
        return error;
    }
    else if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    else {
        return "Erreur inconnue";
    }
};
// Schéma de validation pour l'importation
const EnrollmentImportSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "L'ID étudiant est requis"),
    facultyName: zod_1.z.string().min(1, "Le nom de la faculté est requis"),
    level: zod_1.z.string().min(1, "Le niveau est requis"),
    academicYear: zod_1.z.string().min(1, "L'année académique est requise"),
    status: zod_1.z.enum(["Active", "Completed", "Suspended"]).default("Active"),
    enrollmentDate: zod_1.z.string().optional(),
});
// Fonction pour normaliser le statut
const normalizeStatus = (status) => {
    const statusMap = {
        Active: "Active",
        Completed: "Completed",
        Suspended: "Suspended",
    };
    return statusMap[status.toUpperCase()] || "Active";
};
// Utilitaires de sécurité
const safeDeleteFile = async (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            await fs_1.default.promises.unlink(filePath);
        }
    }
    catch (error) {
        console.error(`Erreur suppression fichier ${filePath}:`, error);
    }
};
const validateUploadedFile = (file) => {
    const allowedMimeTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error("Type de fichier non autorisé");
    }
    if (file.size > maxSize) {
        throw new Error("Fichier trop volumineux (max 10MB)");
    }
};
// Fonction pour mapper les noms de colonnes
const mapColumnNames = (rawData) => {
    const columnMapping = {
        // ID Étudiant
        ID_Etudiant: "studentId",
        "ID Etudiant": "studentId",
        "Student ID": "studentId",
        studentId: "studentId",
        ID: "studentId",
        Matricule: "studentId",
        // Faculté
        Faculte: "facultyName",
        Faculté: "facultyName",
        Faculty: "facultyName",
        facultyName: "facultyName",
        Filiere: "facultyName",
        Filière: "facultyName",
        // Niveau
        Niveau: "level",
        Level: "level",
        level: "level",
        Classe: "level",
        Grade: "level",
        // Année Académique
        Annee_Academique: "academicYear",
        "Année Académique": "academicYear",
        "Academic Year": "academicYear",
        academicYear: "academicYear",
        Annee: "academicYear",
        Année: "academicYear",
        // Statut
        Statut: "status",
        Status: "status",
        status: "status",
        État: "status",
        // Date d'inscription
        Date_Inscription: "enrollmentDate",
        "Date Inscription": "enrollmentDate",
        "Enrollment Date": "enrollmentDate",
        enrollmentDate: "enrollmentDate",
        Date: "enrollmentDate",
    };
    const mappedData = {};
    for (const [key, value] of Object.entries(rawData)) {
        const mappedKey = columnMapping[key] || key;
        // Nettoyer la valeur
        if (value !== null && value !== undefined) {
            mappedData[mappedKey] = typeof value === "string" ? value.trim() : value;
        }
        else {
            mappedData[mappedKey] = "";
        }
    }
    return mappedData;
};
/**
 * Convertit un nombre de date Excel en Date JavaScript
 * Excel date: nombre de jours depuis le 1er janvier 1900
 */
const convertExcelDate = (excelDate) => {
    try {
        // Si c'est déjà une date au format string, la parser
        if (typeof excelDate === "string") {
            // Essayer différents formats de date
            const dateFormats = [
                /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
                /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
                /^\d{2}\/\d{2}\/\d{2}$/, // DD/MM/YY
            ];
            for (const format of dateFormats) {
                if (format.test(excelDate)) {
                    return new Date(excelDate);
                }
            }
        }
        // Si c'est un nombre Excel (jours depuis 1900)
        if (typeof excelDate === "number") {
            // Excel a un bug: il considère 1900 comme année bissextile
            // Donc on doit ajuster pour les dates après le 28 février 1900
            const excelEpoch = new Date(1899, 11, 30); // 30 décembre 1899
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            // Ajustement pour le bug Excel du 29 février 1900
            const adjustedDate = excelDate > 60 ? excelDate - 1 : excelDate;
            const resultDate = new Date(excelEpoch.getTime() + adjustedDate * millisecondsPerDay);
            console.log(`📅 Conversion date Excel: ${excelDate} → ${resultDate.toISOString().split("T")[0]}`);
            return resultDate;
        }
        // Si aucune conversion n'a fonctionné, retourner la date actuelle
        console.warn(`⚠️  Date non reconnue: ${excelDate}, utilisation date actuelle`);
        return new Date();
    }
    catch (error) {
        console.error(`❌ Erreur conversion date ${excelDate}:`, error);
        return new Date(); // Date actuelle par défaut
    }
};
/**
 * Valide et formate une date pour l'importation
 */
const validateAndFormatDate = (dateValue) => {
    try {
        if (!dateValue) {
            return { isValid: true, date: new Date() }; // Date actuelle par défaut
        }
        let date;
        // Si c'est un nombre (date Excel)
        if (typeof dateValue === "number") {
            date = convertExcelDate(dateValue);
            return { isValid: true, date };
        }
        // Si c'est une string, essayer de la parser
        if (typeof dateValue === "string") {
            const trimmedValue = dateValue.trim();
            // Format YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
                date = new Date(trimmedValue);
            }
            // Format DD/MM/YYYY
            else if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmedValue)) {
                const [day, month, year] = trimmedValue.split("/").map(Number);
                date = new Date(year, month - 1, day);
            }
            // Format DD/MM/YY
            else if (/^\d{2}\/\d{2}\/\d{2}$/.test(trimmedValue)) {
                const [day, month, year] = trimmedValue.split("/").map(Number);
                const fullYear = year + 2000; // Supposer 20xx
                date = new Date(fullYear, month - 1, day);
            }
            // Autres formats
            else {
                date = new Date(trimmedValue);
            }
            if (isNaN(date.getTime())) {
                return {
                    isValid: false,
                    error: `Format de date invalide: "${dateValue}". Utilisez YYYY-MM-DD ou DD/MM/YYYY`,
                };
            }
            return { isValid: true, date };
        }
        // Type non supporté
        return {
            isValid: false,
            error: `Type de date non supporté: ${typeof dateValue}`,
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: `Erreur traitement date: ${error}`,
        };
    }
};
// Fonction pour traiter les données d'importation
// Modifiez la fonction processImportEnrollmentData
const processImportEnrollmentData = (enrollmentData) => {
    console.log("🔄 Données brutes reçues:", enrollmentData);
    // Appliquer le mapping des colonnes d'abord
    const mappedData = mapColumnNames(enrollmentData);
    console.log("📊 Données après mapping:", mappedData);
    // Traiter la date d'inscription
    let enrollmentDate;
    let dateError = null;
    if (mappedData.enrollmentDate) {
        const dateValidation = validateAndFormatDate(mappedData.enrollmentDate);
        if (dateValidation.isValid && dateValidation.date) {
            enrollmentDate = dateValidation.date.toISOString(); // Format YYYY-MM-DD
            console.log(`✅ Date convertie: ${mappedData.enrollmentDate} → ${enrollmentDate}`);
        }
        else {
            dateError = dateValidation.error || "Erreur de date inconnue";
            console.log(`❌ Erreur date: ${dateError}`);
        }
    }
    // Nettoyer et valider les données
    const processedData = {
        studentId: String(mappedData.studentId || "").trim(),
        facultyName: String(mappedData.facultyName || "").trim(),
        level: String(mappedData.level || "").trim(),
        academicYear: String(mappedData.academicYear || "").trim(),
        status: mappedData.status
            ? normalizeStatus(String(mappedData.status))
            : "Active",
        enrollmentDate: enrollmentDate, // Utiliser la date convertie ou undefined
    };
    // Stocker l'erreur de date dans l'objet pour validation ultérieure
    if (dateError) {
        processedData.dateError = dateError;
    }
    console.log("✅ Données après traitement:", processedData);
    return processedData;
};
// Fonction pour valider une ligne de données
const validateEnrollmentData = (data) => {
    const errors = [];
    if (!data.studentId) {
        errors.push("ID étudiant est requis");
    }
    if (!data.facultyName) {
        errors.push("Nom de la faculté est requis");
    }
    if (!data.level) {
        errors.push("Niveau est requis");
    }
    if (!data.academicYear) {
        errors.push("Année académique est requise");
    }
    // Vérifier s'il y a une erreur de date spécifique
    if (data.dateError) {
        errors.push(data.dateError);
    }
    // VALIDATION DE DATE MODIFIÉE : Accepter le format ISO
    if (data.enrollmentDate) {
        // Accepter les formats :
        // - YYYY-MM-DD (2020-10-28)
        // - YYYY-MM-DDTHH:mm:ss.sssZ (2020-10-28T04:49:00.000Z)
        // - Toute string de date valide JavaScript
        const date = new Date(data.enrollmentDate);
        if (isNaN(date.getTime())) {
            errors.push(`Date d'inscription invalide: ${data.enrollmentDate}`);
        }
        // Validation optionnelle: la date ne doit pas être dans le futur
        const today = new Date();
        if (date > today) {
            errors.push(`La date d'inscription ne peut pas être dans le futur: ${data.enrollmentDate}`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
// Schémas de validation avec Zod
const EnrollmentCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1, "L'ID étudiant est requis"),
    faculty: zod_1.z.string().min(1, "La faculté est requise"),
    level: zod_1.z.string().min(1, "Le niveau est requis"), // Accepter string
    academicYearId: zod_1.z.string().min(1, "L'ID de l'année académique est requis"), // Changer le nom
    status: zod_1.z.enum(["Active", "Completed", "Suspended"]).default("Active"),
    enrollmentDate: zod_1.z.string().datetime("Date d'inscription invalide").optional(),
});
const EnrollmentUpdateSchema = EnrollmentCreateSchema.partial();
const createEnrollment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentId, faculty, level, academicYearId, status, enrollmentDate, } = req.body;
        console.log("📥 Données reçues pour nouvelle inscription:", req.body);
        // Log de tentative de création
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_ENROLLMENT_ATTEMPT",
            entity: "Enrollment",
            description: "Tentative de création d'une nouvelle inscription",
            status: "SUCCESS",
            metadata: {
                studentId,
                faculty,
                level,
                academicYearId,
                status,
            },
        });
        // Valider les données avec Zod
        try {
            EnrollmentCreateSchema.parse(req.body);
        }
        catch (validationError) {
            if (validationError instanceof zod_1.z.ZodError) {
                console.error("❌ Erreur validation Zod:", validationError.issues);
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "CREATE_ENROLLMENT_ATTEMPT",
                    entity: "Enrollment",
                    description: "Tentative de création d'inscription - validation des données échouée",
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
                    error: "Données de validation invalides",
                    details: validationError.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }
            throw validationError;
        }
        // 1. Trouver la faculté par son nom
        const facultyRecord = await prisma_1.default.faculty.findFirst({
            where: { id: faculty },
        });
        if (!facultyRecord) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                description: `Tentative de création d'inscription - faculté "${faculty}" non trouvée`,
                status: "ERROR",
                metadata: { faculty },
            });
            return res.status(400).json({
                error: "Faculté non trouvée",
                details: `La faculté "${faculty}" n'existe pas`,
            });
        }
        // 2. Trouver l'année académique par son année
        const academicYearRecord = await prisma_1.default.academicYear.findFirst({
            where: { id: academicYearId },
        });
        if (!academicYearRecord) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                description: `Tentative de création d'inscription - année académique "${academicYearId}" non trouvée`,
                status: "ERROR",
                metadata: { academicYearId },
            });
            return res.status(400).json({
                error: "Année académique non trouvée",
                details: `L'année académique "${academicYearId}" n'existe pas`,
            });
        }
        // 3. Vérifier si l'étudiant existe
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                description: `Tentative de création d'inscription - étudiant avec ID ${studentId} non trouvé`,
                status: "ERROR",
                metadata: { studentId },
            });
            return res.status(400).json({
                error: "Étudiant non trouvé",
                details: `L'étudiant avec l'ID ${studentId} n'existe pas`,
            });
        }
        // 4. VALIDATION CRITIQUE : Vérifier si l'étudiant est déjà inscrit dans un niveau différent pour la même année
        const existingEnrollmentSameYear = await prisma_1.default.enrollment.findFirst({
            where: {
                studentId: studentId,
                academicYearId: academicYearRecord.id,
                NOT: {
                    level: level,
                },
            },
            include: {
                academicYear: { select: { year: true } },
                faculty: { select: { name: true } },
            },
        });
        if (existingEnrollmentSameYear) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                description: "Tentative de création d'inscription - inscription multiple interdite",
                status: "ERROR",
                errorMessage: "Inscription multiple interdite",
                metadata: {
                    studentId,
                    existingEnrollment: {
                        faculty: existingEnrollmentSameYear.faculty.name,
                        level: existingEnrollmentSameYear.level,
                        academicYear: existingEnrollmentSameYear.academicYear.year,
                        status: existingEnrollmentSameYear.status,
                    },
                },
            });
            return res.status(400).json({
                error: "Inscription multiple interdite",
                details: `Cet étudiant est déjà inscrit en ${existingEnrollmentSameYear.level}ème année (${existingEnrollmentSameYear.faculty.name}) pour l'année académique ${existingEnrollmentSameYear.academicYear.year}. Un étudiant ne peut pas s'inscrire dans deux niveaux différents pour la même année académique.`,
                existingEnrollment: {
                    faculty: existingEnrollmentSameYear.faculty.name,
                    level: existingEnrollmentSameYear.level,
                    academicYear: existingEnrollmentSameYear.academicYear.year,
                    status: existingEnrollmentSameYear.status,
                },
            });
        }
        // 5. Vérifier si l'étudiant est déjà inscrit exactement au même niveau/faculté/année
        const existingExactEnrollment = await prisma_1.default.enrollment.findFirst({
            where: {
                studentId,
                facultyId: facultyRecord.id,
                academicYearId: academicYearRecord.id,
                level,
            },
        });
        if (existingExactEnrollment) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "CREATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                description: "Tentative de création d'inscription - inscription déjà existante",
                status: "ERROR",
                errorMessage: "Inscription déjà existante",
                metadata: {
                    studentId,
                    facultyId: facultyRecord.id,
                    academicYearId: academicYearRecord.id,
                    level,
                },
            });
            return res.status(400).json({
                error: "Inscription déjà existante",
                details: "Cet étudiant est déjà inscrit dans cette faculté à ce niveau pour cette année académique",
            });
        }
        // 6. VÉRIFICATION : Marquer toutes les inscriptions précédentes comme "Completed"
        const previousEnrollments = await prisma_1.default.enrollment.findMany({
            where: {
                studentId: studentId,
                status: "Active",
            },
        });
        console.log(`Inscriptions précédentes Actives trouvées: ${previousEnrollments.length}`);
        // 7. Mettre à jour les inscriptions précédentes
        if (previousEnrollments.length > 0) {
            await prisma_1.default.enrollment.updateMany({
                where: {
                    studentId: studentId,
                    status: "Active",
                },
                data: {
                    status: "Completed",
                },
            });
            console.log(`Mise à jour de ${previousEnrollments.length} inscription(s) précédente(s) en statut "Completed"`);
        }
        // 8. Créer la nouvelle inscription avec statut "Active"
        const newEnrollment = await prisma_1.default.enrollment.create({
            data: {
                studentId,
                facultyId: facultyRecord.id,
                level,
                academicYearId: academicYearRecord.id,
                status: "Active",
                enrollmentDate: enrollmentDate || new Date().toISOString(),
            },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                    },
                },
            },
        });
        console.log("✅ Nouvelle inscription créée avec succès:", newEnrollment.id);
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_ENROLLMENT_SUCCESS",
            entity: "Enrollment",
            entityId: newEnrollment.id,
            description: "Inscription créée avec succès",
            status: "SUCCESS",
            metadata: {
                studentId: newEnrollment.studentId,
                faculty: facultyRecord.name,
                level: newEnrollment.level,
                academicYear: academicYearRecord.year,
                previousEnrollmentsUpdated: previousEnrollments.length,
            },
        });
        res.status(201).json(newEnrollment);
    }
    catch (error) {
        console.error("❌ Erreur détaillée lors de la création d'inscription:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "CREATE_ENROLLMENT_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la création de l'inscription",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(400).json({
            error: "Erreur lors de la création de l'inscription",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.createEnrollment = createEnrollment;
const updateEnrollment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.user?.id || req.userId || null,
    };
    try {
        const { id } = req.params;
        const { studentId, faculty, academicYear, ...otherData } = req.body;
        console.log("📥 Requête mise à jour inscription - ID:", id, "Body:", req.body);
        // Log de tentative de mise à jour
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_ENROLLMENT_ATTEMPT",
            entity: "Enrollment",
            entityId: id,
            description: "Tentative de mise à jour d'inscription",
            status: "SUCCESS",
            metadata: {
                updateFields: Object.keys(req.body),
            },
        });
        // Vérifier si l'inscription existe
        const existingEnrollment = await prisma_1.default.enrollment.findUnique({
            where: { id },
        });
        if (!existingEnrollment) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "UPDATE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                entityId: id,
                description: "Tentative de mise à jour d'inscription - inscription non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({ error: "Inscription non trouvée" });
        }
        const updateData = { ...otherData };
        // Si faculty est fourni, trouver l'ID correspondant
        if (faculty) {
            const facultyRecord = await prisma_1.default.faculty.findFirst({
                where: { id: faculty },
            });
            if (!facultyRecord) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "UPDATE_ENROLLMENT_ATTEMPT",
                    entity: "Enrollment",
                    entityId: id,
                    description: `Tentative de mise à jour d'inscription - faculté "${faculty}" non trouvée`,
                    status: "ERROR",
                    metadata: { faculty },
                });
                return res.status(400).json({ error: "Faculté non trouvée" });
            }
            updateData.facultyId = facultyRecord.id;
        }
        // Si academicYear est fourni, trouver l'ID correspondant
        if (academicYear) {
            const academicYearRecord = await prisma_1.default.academicYear.findFirst({
                where: { year: academicYear },
            });
            if (!academicYearRecord) {
                await (0, auditController_1.createAuditLog)({
                    ...auditData,
                    action: "UPDATE_ENROLLMENT_ATTEMPT",
                    entity: "Enrollment",
                    entityId: id,
                    description: `Tentative de mise à jour d'inscription - année académique "${academicYear}" non trouvée`,
                    status: "ERROR",
                    metadata: { academicYear },
                });
                return res.status(400).json({ error: "Année académique non trouvée" });
            }
            updateData.academicYearId = academicYearRecord.id;
        }
        const updatedEnrollment = await prisma_1.default.enrollment.update({
            where: { id },
            data: updateData,
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                faculty: {
                    select: {
                        name: true,
                    },
                },
                academicYear: {
                    select: {
                        year: true,
                    },
                },
            },
        });
        console.log("✅ Inscription mise à jour avec succès:", id);
        // Log de succès
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_ENROLLMENT_SUCCESS",
            entity: "Enrollment",
            entityId: id,
            description: "Inscription mise à jour avec succès",
            status: "SUCCESS",
            metadata: {
                updatedFields: Object.keys(updateData),
                studentId: updatedEnrollment.studentId,
            },
        });
        res.json(updatedEnrollment);
    }
    catch (error) {
        console.error("❌ Erreur mise à jour inscription:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "UPDATE_ENROLLMENT_ERROR",
            entity: "Enrollment",
            entityId: req.params.id,
            description: "Erreur lors de la mise à jour de l'inscription",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(400).json({
            error: "Erreur lors de la mise à jour",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.updateEnrollment = updateEnrollment;
const getAllEnrollments = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const enrollments = await prisma_1.default.enrollment.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studentId: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Transformer les données pour le frontend
        const transformedEnrollments = enrollments.map((enrollment) => ({
            ...enrollment,
            faculty: enrollment.faculty?.name || "",
            academicYear: enrollment.academicYear?.year || "",
        }));
        // Log de consultation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_ENROLLMENTS",
            entity: "Enrollment",
            description: "Consultation de la liste de toutes les inscriptions",
            status: "SUCCESS",
            metadata: {
                count: enrollments.length,
            },
        });
        res.json(transformedEnrollments);
    }
    catch (error) {
        console.error("❌ Erreur récupération inscriptions:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "GET_ALL_ENROLLMENTS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la récupération de la liste des inscriptions",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            error: "Erreur serveur",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.getAllEnrollments = getAllEnrollments;
const deleteEnrollment = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { id } = req.params;
        console.log("🗑️ Tentative de suppression inscription:", id);
        // Vérifier si l'inscription existe
        const existingEnrollment = await prisma_1.default.enrollment.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        studentId: true,
                    },
                },
                faculty: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!existingEnrollment) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "DELETE_ENROLLMENT_ATTEMPT",
                entity: "Enrollment",
                entityId: id,
                description: "Tentative de suppression d'inscription - non trouvée",
                status: "ERROR",
            });
            return res.status(404).json({ error: "Inscription non trouvée" });
        }
        await prisma_1.default.enrollment.delete({
            where: { id },
        });
        console.log("✅ Inscription supprimée avec succès:", id);
        // Log de suppression réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_ENROLLMENT_SUCCESS",
            entity: "Enrollment",
            entityId: id,
            description: "Inscription supprimée avec succès",
            status: "SUCCESS",
            metadata: {
                studentId: existingEnrollment.student.studentId,
                studentName: `${existingEnrollment.student.firstName} ${existingEnrollment.student.lastName}`,
                faculty: existingEnrollment.faculty.name,
                level: existingEnrollment.level,
                status: existingEnrollment.status,
            },
        });
        res.json({ message: "Inscription supprimée avec succès" });
    }
    catch (error) {
        console.error("❌ Erreur suppression inscription:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur de suppression
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DELETE_ENROLLMENT_ERROR",
            entity: "Enrollment",
            entityId: req.params.id,
            description: "Erreur lors de la suppression de l'inscription",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            error: "Erreur serveur",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.deleteEnrollment = deleteEnrollment;
// Fonction utilitaire pour s'assurer qu'un étudiant n'a qu'une seule inscription Active
const ensureSingleActiveEnrollment = async (studentId) => {
    const ActiveEnrollments = await prisma_1.default.enrollment.findMany({
        where: {
            studentId: studentId,
            status: "Active",
        },
    });
    // S'il y a plus d'une inscription Active, garder la plus récente
    if (ActiveEnrollments.length > 1) {
        // Trier par date d'inscription (la plus récente en premier)
        const sortedEnrollments = ActiveEnrollments.sort((a, b) => new Date(b.enrollmentDate).getTime() -
            new Date(a.enrollmentDate).getTime());
        // Garder la première (plus récente) et marquer les autres comme "Completed"
        const enrollmentsToUpdate = sortedEnrollments.slice(1);
        for (const enrollment of enrollmentsToUpdate) {
            await prisma_1.default.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    status: "Completed",
                },
            });
        }
        console.log(`Mise à jour de ${enrollmentsToUpdate.length} inscription(s) pour l'étudiant ${studentId}`);
    }
};
exports.ensureSingleActiveEnrollment = ensureSingleActiveEnrollment;
const fixEnrollmentStatuses = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const studentId = req.params.studentId;
        // Log de début de correction
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FIX_ENROLLMENT_STATUSES_START",
            entity: "Enrollment",
            description: "Début de la correction des statuts d'inscription",
            status: "SUCCESS",
            metadata: {
                studentId: studentId || "all",
            },
        });
        if (studentId) {
            console.log(`🔧 Vérification des statuts pour l'étudiant: ${studentId}`);
            await (0, exports.ensureSingleActiveEnrollment)(studentId);
            const result = await prisma_1.default.enrollment.findMany({
                where: { studentId },
                select: { id: true, status: true, academicYear: true, level: true },
            });
            // Log de correction pour un étudiant spécifique
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FIX_ENROLLMENT_STATUSES_COMPLETE",
                entity: "Enrollment",
                description: `Correction des statuts d'inscription pour l'étudiant ${studentId}`,
                status: "SUCCESS",
                metadata: {
                    studentId,
                    enrollmentsCount: result.length,
                    enrollments: result,
                },
            });
            return res.json({
                message: `Statuts vérifiés pour l'étudiant ${studentId}`,
                enrollments: result,
            });
        }
        // Vérifier tous les étudiants si aucun ID spécifique
        console.log("🔧 Vérification des statuts pour tous les étudiants...");
        const allStudents = await prisma_1.default.student.findMany();
        let fixedCount = 0;
        let studentsChecked = 0;
        for (const student of allStudents) {
            const beforeCount = (await prisma_1.default.enrollment.findMany({
                where: { studentId: student.id, status: "Active" },
            })).length;
            await (0, exports.ensureSingleActiveEnrollment)(student.id);
            const afterCount = (await prisma_1.default.enrollment.findMany({
                where: { studentId: student.id, status: "Active" },
            })).length;
            if (beforeCount !== afterCount) {
                fixedCount++;
                console.log(`Corrigé étudiant ${student.firstName} ${student.lastName}: ${beforeCount} → ${afterCount} inscription(s) Active(s)`);
            }
            studentsChecked++;
        }
        // Log de correction globale
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FIX_ENROLLMENT_STATUSES_COMPLETE",
            entity: "Enrollment",
            description: "Correction des statuts d'inscription pour tous les étudiants",
            status: "SUCCESS",
            metadata: {
                studentsChecked,
                fixedCount,
                successRate: `${(((studentsChecked - fixedCount) / studentsChecked) * 100).toFixed(2)}%`,
            },
        });
        res.json({
            message: `Statuts vérifiés pour ${studentsChecked} étudiants, ${fixedCount} corrigés`,
        });
    }
    catch (error) {
        console.error("❌ Erreur lors de la vérification des statuts:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FIX_ENROLLMENT_STATUSES_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la correction des statuts d'inscription",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            error: "Erreur serveur",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.fixEnrollmentStatuses = fixEnrollmentStatuses;
// Fonction spécifique pour un étudiant
const fixStudentEnrollmentStatus = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const { studentId } = req.params;
        if (!studentId) {
            return res.status(400).json({ error: "ID étudiant requis" });
        }
        // Vérifier que l'étudiant existe
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "FIX_STUDENT_ENROLLMENT_STATUS_ATTEMPT",
                entity: "Enrollment",
                description: `Tentative de correction des statuts - étudiant ${studentId} non trouvé`,
                status: "ERROR",
                metadata: { studentId },
            });
            return res.status(404).json({ error: "Étudiant non trouvé" });
        }
        console.log(`🔧 Correction des statuts pour l'étudiant: ${student.firstName} ${student.lastName}`);
        // Appliquer la correction
        await (0, exports.ensureSingleActiveEnrollment)(studentId);
        // Récupérer les inscriptions mises à jour
        const updatedEnrollments = await prisma_1.default.enrollment.findMany({
            where: { studentId },
            include: {
                academicYear: { select: { year: true } },
                faculty: { select: { name: true } },
            },
            orderBy: { enrollmentDate: "desc" },
        });
        // Log de correction réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FIX_STUDENT_ENROLLMENT_STATUS_SUCCESS",
            entity: "Enrollment",
            description: `Statuts d'inscription corrigés pour ${student.firstName} ${student.lastName}`,
            status: "SUCCESS",
            metadata: {
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                enrollmentsCount: updatedEnrollments.length,
                ActiveEnrollments: updatedEnrollments.filter((e) => e.status === "Active").length,
            },
        });
        res.json({
            message: `Statuts corrigés pour ${student.firstName} ${student.lastName}`,
            student: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
            },
            enrollments: updatedEnrollments.map((e) => ({
                id: e.id,
                faculty: e.faculty.name,
                level: e.level,
                academicYear: e.academicYear.year,
                status: e.status,
                enrollmentDate: e.enrollmentDate,
            })),
        });
    }
    catch (error) {
        console.error("❌ Erreur lors de la correction des statuts:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "FIX_STUDENT_ENROLLMENT_STATUS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la correction des statuts d'inscription pour un étudiant",
            status: "ERROR",
            errorMessage: errorMessage,
            metadata: {
                studentId: req.params.studentId,
            },
        });
        res.status(500).json({
            error: "Erreur serveur",
            details: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
exports.fixStudentEnrollmentStatus = fixStudentEnrollmentStatus;
const importEnrollments = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    console.log("🔄 Début importation - Fichier reçu:", req.file?.originalname);
    if (!req.file) {
        console.log("❌ Aucun fichier fourni");
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_ENROLLMENTS_ATTEMPT",
            entity: "Enrollment",
            description: "Tentative d'importation d'inscriptions - aucun fichier fourni",
            status: "ERROR",
        });
        return res.status(400).json({
            message: "Aucun fichier fourni",
        });
    }
    let filePath = req.file.path;
    try {
        console.log("📁 Validation du fichier...");
        validateUploadedFile(req.file);
        let enrollmentsData = [];
        console.log("📊 Lecture du fichier...", {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
        });
        // Log de début d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_ENROLLMENTS_START",
            entity: "Enrollment",
            description: "Début de l'importation des inscriptions",
            status: "SUCCESS",
            metadata: {
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
            },
        });
        // Lire le fichier
        if (req.file.mimetype.includes("excel") ||
            req.file.mimetype.includes("spreadsheet") ||
            req.file.originalname.match(/\.(xlsx|xls)$/i)) {
            console.log("📗 Fichier Excel détecté");
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            console.log("📋 Feuille trouvée:", sheetName);
            const worksheet = workbook.Sheets[sheetName];
            enrollmentsData = XLSX.utils.sheet_to_json(worksheet);
            console.log("📊 Données brutes extraites:", enrollmentsData.length, "lignes");
            // Afficher les premières lignes pour debug
            if (enrollmentsData.length > 0) {
                console.log("📝 Première ligne:", enrollmentsData[0]);
                console.log("📝 En-têtes:", Object.keys(enrollmentsData[0]));
            }
        }
        else if (req.file.mimetype.includes("json") ||
            req.file.originalname.match(/\.json$/i)) {
            console.log("📘 Fichier JSON détecté");
            const fileContent = await fs_1.default.promises.readFile(filePath, "utf-8");
            enrollmentsData = JSON.parse(fileContent);
        }
        else {
            await safeDeleteFile(filePath);
            console.log("❌ Format non supporté:", req.file.mimetype);
            await (0, auditController_1.createAuditLog)({
                ...auditData,
                action: "IMPORT_ENROLLMENTS_ERROR",
                entity: "Enrollment",
                description: "Format de fichier non supporté pour l'importation",
                status: "ERROR",
                metadata: { mimeType: req.file.mimetype },
            });
            return res.status(400).json({
                message: "Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou JSON",
            });
        }
        // VÉRIFICATION CRITIQUE : Structure des données
        console.log("🔍 Vérification structure données...");
        if (enrollmentsData.length === 0) {
            throw new Error("Aucune donnée trouvée dans le fichier");
        }
        const firstRow = enrollmentsData[0];
        const availableColumns = Object.keys(firstRow);
        console.log("📝 Colonnes disponibles:", availableColumns);
        // Vérifier la présence des colonnes requises (avec mapping)
        const mappedFirstRow = mapColumnNames(firstRow);
        const requiredFields = [
            "studentId",
            "facultyName",
            "level",
            "academicYear",
        ];
        const missingFields = requiredFields.filter((field) => !mappedFirstRow[field]);
        if (missingFields.length > 0) {
            console.log("❌ Champs manquants après mapping:", missingFields);
            console.log("📝 Champs mappés:", mappedFirstRow);
            throw new Error(`Champs obligatoires manquants ou non reconnus. Colonnes disponibles: ${availableColumns.join(", ")}`);
        }
        console.log("✅ Structure des données validée");
        const results = {
            success: 0,
            errors: 0,
            details: [],
        };
        // Traiter chaque inscription
        for (const [index, rawEnrollmentData] of enrollmentsData.entries()) {
            try {
                console.log(`\n--- Traitement ligne ${index + 1} ---`);
                // Traiter et nettoyer les données d'importation
                const enrollmentData = processImportEnrollmentData(rawEnrollmentData);
                // Validation des données de base
                const validation = validateEnrollmentData(enrollmentData);
                if (!validation.isValid) {
                    throw new Error(validation.errors.join(", "));
                }
                console.log(`🔍 Recherche étudiant: ${enrollmentData.studentId}`);
                // Vérifier que l'étudiant existe
                const student = await prisma_1.default.student.findUnique({
                    where: { studentId: enrollmentData.studentId },
                });
                if (!student) {
                    throw new Error(`Étudiant avec ID "${enrollmentData.studentId}" non trouvé`);
                }
                console.log("✅ Étudiant trouvé:", student.firstName, student.lastName);
                console.log(`🔍 Recherche faculté: ${enrollmentData.facultyName}`);
                // Recherche de faculté
                const faculty = await prisma_1.default.faculty.findFirst({
                    where: {
                        name: enrollmentData.facultyName,
                    },
                });
                if (!faculty) {
                    throw new Error(`Faculté "${enrollmentData.facultyName}" non trouvée. Facultés disponibles: ${(await prisma_1.default.faculty.findMany()).map((f) => f.name).join(", ")}`);
                }
                console.log("✅ Faculté trouvée:", faculty.name);
                console.log(`🔍 Recherche année académique: ${enrollmentData.academicYear}`);
                // Vérifier que l'année académique existe
                const academicYear = await prisma_1.default.academicYear.findFirst({
                    where: {
                        year: enrollmentData.academicYear,
                    },
                });
                if (!academicYear) {
                    throw new Error(`Année académique "${enrollmentData.academicYear}" non trouvée. Années disponibles: ${(await prisma_1.default.academicYear.findMany()).map((y) => y.year).join(", ")}`);
                }
                console.log("✅ Année académique trouvée:", academicYear.year);
                // Vérifier si l'inscription existe déjà
                const existingEnrollment = await prisma_1.default.enrollment.findFirst({
                    where: {
                        studentId: student.id,
                        facultyId: faculty.id,
                        academicYearId: academicYear.id,
                        level: enrollmentData.level,
                    },
                });
                if (existingEnrollment) {
                    throw new Error("Inscription déjà existante pour cet étudiant, faculté, niveau et année académique");
                }
                // VALIDATION : Vérifier si l'étudiant est déjà inscrit dans un niveau différent pour la même année
                const existingEnrollmentSameYear = await prisma_1.default.enrollment.findFirst({
                    where: {
                        studentId: student.id,
                        academicYearId: academicYear.id,
                        NOT: {
                            level: enrollmentData.level,
                        },
                    },
                    include: {
                        faculty: { select: { name: true } },
                    },
                });
                if (existingEnrollmentSameYear) {
                    throw new Error(`L'étudiant est déjà inscrit en niveau ${existingEnrollmentSameYear.level} (${existingEnrollmentSameYear.faculty.name}) pour la même année académique`);
                }
                // Si c'est une nouvelle inscription active, marquer les précédentes comme "Completed"
                if (enrollmentData.status === "Active") {
                    const previousActiveEnrollments = await prisma_1.default.enrollment.findMany({
                        where: {
                            studentId: student.id,
                            status: "Active",
                        },
                    });
                    if (previousActiveEnrollments.length > 0) {
                        console.log(`🔄 Mise à jour de ${previousActiveEnrollments.length} inscription(s) précédente(s) en statut "Completed"`);
                        await prisma_1.default.enrollment.updateMany({
                            where: {
                                studentId: student.id,
                                status: "Active",
                            },
                            data: {
                                status: "Completed",
                            },
                        });
                    }
                }
                // Préparer la date d'inscription
                let enrollmentDateValue = new Date();
                if (enrollmentData.enrollmentDate) {
                    enrollmentDateValue = new Date(enrollmentData.enrollmentDate);
                    if (isNaN(enrollmentDateValue.getTime())) {
                        enrollmentDateValue = new Date();
                    }
                }
                // Créer l'inscription
                console.log("💾 Création de l'inscription...");
                const newEnrollment = await prisma_1.default.enrollment.create({
                    data: {
                        studentId: student.id,
                        facultyId: faculty.id,
                        level: enrollmentData.level,
                        academicYearId: academicYear.id,
                        status: enrollmentData.status,
                        enrollmentDate: enrollmentDateValue,
                    },
                });
                console.log("✅ Inscription créée avec ID:", newEnrollment.id);
                results.success++;
                results.details.push({
                    index: index + 1,
                    studentId: enrollmentData.studentId,
                    studentName: `${student.firstName} ${student.lastName}`,
                    faculty: faculty.name,
                    level: enrollmentData.level,
                    academicYear: academicYear.year,
                    status: "success",
                    message: "Inscription créée avec succès",
                    enrollmentId: newEnrollment.id,
                });
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                console.error(`❌ Erreur ligne ${index + 1}:`, errorMessage);
                results.errors++;
                results.details.push({
                    index: index + 1,
                    studentId: rawEnrollmentData.studentId ||
                        rawEnrollmentData.ID_Etudiant ||
                        "N/A",
                    status: "error",
                    message: errorMessage,
                    data: rawEnrollmentData,
                });
            }
        }
        // Supprimer le fichier après traitement
        if (filePath) {
            await safeDeleteFile(filePath);
            filePath = null;
        }
        console.log("🎉 Import inscriptions terminé:", results.success, "succès,", results.errors, "erreurs");
        // Log de fin d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_ENROLLMENTS_COMPLETE",
            entity: "Enrollment",
            description: "Importation des inscriptions terminée",
            status: "SUCCESS",
            metadata: {
                total: enrollmentsData.length,
                success: results.success,
                errors: results.errors,
                successRate: `${((results.success / enrollmentsData.length) * 100).toFixed(2)}%`,
            },
        });
        res.json({
            message: `Import terminé: ${results.success} succès, ${results.errors} erreurs`,
            summary: {
                total: enrollmentsData.length,
                success: results.success,
                errors: results.errors,
                successRate: `${((results.success / enrollmentsData.length) * 100).toFixed(2)}%`,
            },
            results: results.details,
        });
    }
    catch (error) {
        console.error("❌ ERREUR DÉTAILLÉE importation:", error);
        // Nettoyer le fichier en cas d'erreur
        if (filePath) {
            await safeDeleteFile(filePath);
        }
        const errorMessage = getErrorMessage(error);
        // Log d'erreur d'importation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "IMPORT_ENROLLMENTS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de l'importation des inscriptions",
            status: "ERROR",
            errorMessage: errorMessage,
            metadata: {
                fileName: req.file?.originalname,
                fileSize: req.file?.size,
            },
        });
        res.status(400).json({
            message: "Erreur lors de l'importation",
            error: errorMessage,
            details: process.env.NODE_ENV === "development"
                ? {
                    stack: error instanceof Error ? error.stack : undefined,
                    file: req.file
                        ? {
                            name: req.file.originalname,
                            size: req.file.size,
                            type: req.file.mimetype,
                        }
                        : undefined,
                }
                : undefined,
        });
    }
};
exports.importEnrollments = importEnrollments;
// Exportation des inscriptions
const exportEnrollments = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        // Récupérer toutes les inscriptions avec les relations
        const enrollments = await prisma_1.default.enrollment.findMany({
            include: {
                student: {
                    select: {
                        studentId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                faculty: {
                    select: {
                        name: true,
                    },
                },
                academicYear: {
                    select: {
                        year: true,
                    },
                },
            },
            orderBy: {
                enrollmentDate: "desc",
            },
        });
        // Fonction pour formater le statut pour l'export
        const formatStatusForExport = (status) => {
            const statusMap = {
                Active: "Active",
                Completed: "Completed",
                Suspended: "Suspended",
            };
            return statusMap[status] || status;
        };
        // Préparer les données pour l'exportation
        const exportData = enrollments.map((enrollment) => ({
            studentId: enrollment.student.studentId,
            studentFirstName: enrollment.student.firstName,
            studentLastName: enrollment.student.lastName,
            studentEmail: enrollment.student.email,
            facultyName: enrollment.faculty.name,
            level: enrollment.level,
            academicYear: enrollment.academicYear.year,
            status: formatStatusForExport(enrollment.status),
            enrollmentDate: enrollment.enrollmentDate.toISOString().split("T")[0],
        }));
        // Log de début d'exportation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_ENROLLMENTS_START",
            entity: "Enrollment",
            description: "Début de l'exportation des inscriptions",
            status: "SUCCESS",
            metadata: {
                enrollmentsCount: enrollments.length,
            },
        });
        // Créer le fichier Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inscriptions");
        // Ajouter une feuille d'instructions
        const instructions = [
            {
                Champ: "studentId",
                Description: "ID unique de l'étudiant (obligatoire)",
                Exemple: "ETU2024001",
            },
            {
                Champ: "facultyName",
                Description: "Nom de la faculté (obligatoire)",
                Exemple: "Faculté des Sciences",
            },
            {
                Champ: "level",
                Description: "Niveau d'étude (obligatoire)",
                Exemple: "1",
            },
            {
                Champ: "academicYear",
                Description: "Année académique (obligatoire)",
                Exemple: "2024-2025",
            },
            {
                Champ: "status",
                Description: "Statut: Active, Completed, Suspended",
                Exemple: "Active",
            },
            {
                Champ: "enrollmentDate",
                Description: "Date d'inscription (YYYY-MM-DD)",
                Exemple: "2024-09-01",
            },
        ];
        const instructionSheet = XLSX.utils.json_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        // Log d'exportation réussie
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_ENROLLMENTS_SUCCESS",
            entity: "Enrollment",
            description: "Exportation des inscriptions terminée avec succès",
            status: "SUCCESS",
            metadata: {
                enrollmentsExported: enrollments.length,
                fileFormat: "Excel",
            },
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=inscriptions-export-${new Date().toISOString().split("T")[0]}.xlsx`);
        res.send(buffer);
    }
    catch (error) {
        console.error("❌ Erreur export inscriptions:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur d'exportation
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "EXPORT_ENROLLMENTS_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de l'exportation des inscriptions",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            message: "Erreur lors de l'exportation: " + errorMessage,
        });
    }
};
exports.exportEnrollments = exportEnrollments;
// Téléchargement du template d'importation
const downloadEnrollmentImportTemplate = async (req, res) => {
    const auditData = {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        userId: req.userId || "unknown",
    };
    try {
        const templateData = [
            {
                studentId: "ETU2024001",
                facultyName: "Faculté des Sciences",
                level: "1",
                academicYear: "2024-2025",
                status: "Active",
                enrollmentDate: "2024-09-01",
            },
            {
                studentId: "ETU2024002",
                facultyName: "Faculté de Médecine",
                level: "2",
                academicYear: "2024-2025",
                status: "Active",
                enrollmentDate: "2024-09-01",
            },
        ];
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inscriptions");
        // Ajouter une feuille d'instructions
        const instructions = [
            {
                Champ: "studentId",
                Description: "ID unique de l'étudiant (doit exister)",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "facultyName",
                Description: "Nom exact de la faculté",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "level",
                Description: "Niveau d'étude (1, 2, 3, etc.)",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "academicYear",
                Description: "Année académique",
                Format: "Texte",
                Obligatoire: "Oui",
            },
            {
                Champ: "status",
                Description: "Statut de l'inscription",
                Format: "Active/Completed/Suspended",
                Obligatoire: "Non",
            },
            {
                Champ: "enrollmentDate",
                Description: "Date d'inscription",
                Format: "YYYY-MM-DD",
                Obligatoire: "Non",
            },
        ];
        const instructionSheet = XLSX.utils.json_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        // Log de téléchargement du template
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DOWNLOAD_ENROLLMENT_TEMPLATE",
            entity: "Enrollment",
            description: "Téléchargement du template d'importation d'inscriptions",
            status: "SUCCESS",
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=template-import-inscriptions.xlsx");
        res.send(buffer);
    }
    catch (error) {
        console.error("Erreur génération template inscriptions:", error);
        const errorMessage = getErrorMessage(error);
        // Log d'erreur
        await (0, auditController_1.createAuditLog)({
            ...auditData,
            action: "DOWNLOAD_ENROLLMENT_TEMPLATE_ERROR",
            entity: "Enrollment",
            description: "Erreur lors de la génération du template d'importation d'inscriptions",
            status: "ERROR",
            errorMessage: errorMessage,
        });
        res.status(500).json({
            message: "Erreur lors de la génération du template",
            error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        });
    }
};
exports.downloadEnrollmentImportTemplate = downloadEnrollmentImportTemplate;
// Nouvelle fonction pour obtenir les dates d'inscription (API endpoint)
const getEnrollmentDates = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!studentId) {
            return res.status(400).json({
                error: "ID étudiant requis",
            });
        }
        console.log(`📅 Calcul des dates d'inscription pour l'étudiant: ${studentId}`);
        // Récupérer toutes les inscriptions de l'étudiant triées par date
        const enrollments = await prisma_1.default.enrollment.findMany({
            where: {
                studentId: studentId,
            },
            include: {
                academicYear: {
                    select: {
                        year: true,
                    },
                },
            },
            orderBy: {
                enrollmentDate: "asc",
            },
        });
        if (enrollments.length === 0) {
            // Aucune inscription trouvée
            const result = {
                startDate: "janvier 2021",
                endDate: "octobre 2025",
                hasData: false,
            };
            return res.json(result);
        }
        // Trouver la première et dernière inscription
        const firstEnrollment = enrollments[0];
        const lastEnrollment = enrollments[enrollments.length - 1];
        const firstEnrollmentDate = new Date(firstEnrollment.enrollmentDate);
        const lastEnrollmentDate = new Date(lastEnrollment.enrollmentDate);
        const firstYear = firstEnrollmentDate.getFullYear();
        const lastYear = lastEnrollmentDate.getFullYear();
        // Map des mois en français
        const months = [
            "janvier",
            "février",
            "mars",
            "avril",
            "mai",
            "juin",
            "juillet",
            "août",
            "septembre",
            "octobre",
            "novembre",
            "décembre",
        ];
        // StartDate: 1er mois (janvier) de l'année de la première inscription
        // EndDate: 10e mois (octobre) de l'année de la dernière inscription
        const startDate = `${months[0]} ${firstYear}`;
        const endDate = `${months[9]} ${lastYear}`;
        const result = {
            startDate,
            endDate,
            hasData: true,
            firstEnrollment: firstEnrollmentDate.toISOString(),
            lastEnrollment: lastEnrollmentDate.toISOString(),
            totalEnrollments: enrollments.length,
        };
        console.log(`✅ Dates calculées pour étudiant ${studentId}:`, result);
        res.json(result);
    }
    catch (error) {
        console.error("❌ Erreur calcul dates inscription:", error);
        const errorMessage = getErrorMessage(error);
        const fallbackResult = {
            startDate: "janvier 2021",
            endDate: "octobre 2025",
            hasData: false,
            error: errorMessage,
        };
        res.status(500).json(fallbackResult);
    }
};
exports.getEnrollmentDates = getEnrollmentDates;
//# sourceMappingURL=enrollmentController.js.map