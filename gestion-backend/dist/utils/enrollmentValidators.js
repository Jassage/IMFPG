"use strict";
/**
 * @file enrollmentValidators.ts
 * @description Validators pour les inscriptions
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUnenroll = exports.validateStudentIdParam = exports.validateQueryParams = exports.validateBulkEnrollments = exports.validateReenrollment = exports.validateUpdateEnrollment = exports.validateCreateEnrollment = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Validateur pour la création d'inscription
exports.validateCreateEnrollment = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("L'ID de l'étudiant est requis")
        .isString()
        .withMessage("L'ID de l'étudiant doit être une chaîne")
        .custom(async (value) => {
        const student = await prisma.student.findUnique({
            where: { id: value },
        });
        if (!student) {
            throw new Error("Étudiant non trouvé");
        }
        return true;
    }),
    (0, express_validator_1.body)("classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne")
        .custom(async (value) => {
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: value },
        });
        if (!schoolClass) {
            throw new Error("Classe non trouvée");
        }
        return true;
    }),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID de l'année académique est requis")
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne")
        .custom(async (value) => {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id: value },
        });
        if (!academicYear) {
            throw new Error("Année académique non trouvée");
        }
        return true;
    }),
    (0, express_validator_1.body)("enrollmentDate")
        .optional()
        .isISO8601()
        .withMessage("La date d'inscription doit être une date valide"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Suspended", "Completed"])
        .withMessage("Le statut doit être Active, Suspended ou Completed"),
];
// Validateur pour la mise à jour d'inscription
exports.validateUpdateEnrollment = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de l'inscription est requis")
        .isString()
        .withMessage("L'ID de l'inscription doit être une chaîne"),
    (0, express_validator_1.body)("classId")
        .optional()
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne")
        .custom(async (value) => {
        if (value) {
            const schoolClass = await prisma.schoolClass.findUnique({
                where: { id: value },
            });
            if (!schoolClass) {
                throw new Error("Classe non trouvée");
            }
        }
        return true;
    }),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Active", "Suspended", "Completed"])
        .withMessage("Le statut doit être Active, Suspended ou Completed"),
];
// Validateur pour la réinscription
exports.validateReenrollment = [
    (0, express_validator_1.body)("studentId")
        .notEmpty()
        .withMessage("L'ID de l'étudiant est requis")
        .isString()
        .withMessage("L'ID de l'étudiant doit être une chaîne")
        .custom(async (value) => {
        const student = await prisma.student.findUnique({
            where: { id: value },
        });
        if (!student) {
            throw new Error("Étudiant non trouvé");
        }
        return true;
    }),
    (0, express_validator_1.body)("classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne")
        .custom(async (value) => {
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id: value },
        });
        if (!schoolClass) {
            throw new Error("Classe non trouvée");
        }
        return true;
    }),
    (0, express_validator_1.body)("academicYearId")
        .notEmpty()
        .withMessage("L'ID de l'année académique est requis")
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne")
        .custom(async (value) => {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id: value },
        });
        if (!academicYear) {
            throw new Error("Année académique non trouvée");
        }
        return true;
    }),
    (0, express_validator_1.body)("enrollmentDate")
        .optional()
        .isISO8601()
        .withMessage("La date d'inscription doit être une date valide"),
    (0, express_validator_1.body)("notes")
        .optional()
        .isString()
        .withMessage("Les notes doivent être une chaîne"),
];
// Validateur pour les inscriptions en masse
exports.validateBulkEnrollments = [
    (0, express_validator_1.body)("enrollments")
        .isArray({ min: 1 })
        .withMessage("Les inscriptions doivent être un tableau non vide"),
    (0, express_validator_1.body)("enrollments.*.studentId")
        .notEmpty()
        .withMessage("L'ID de l'étudiant est requis pour chaque inscription")
        .isString()
        .withMessage("L'ID de l'étudiant doit être une chaîne"),
    (0, express_validator_1.body)("enrollments.*.classId")
        .notEmpty()
        .withMessage("L'ID de la classe est requis pour chaque inscription")
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne"),
    (0, express_validator_1.body)("enrollments.*.academicYearId")
        .notEmpty()
        .withMessage("L'ID de l'année académique est requis pour chaque inscription")
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne"),
    (0, express_validator_1.body)("enrollments.*.enrollmentDate")
        .optional()
        .isISO8601()
        .withMessage("La date d'inscription doit être une date valide"),
];
// Validateur pour les paramètres de requête
exports.validateQueryParams = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("La page doit être un nombre positif"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    (0, express_validator_1.query)("academicYearId")
        .optional()
        .isString()
        .withMessage("L'ID de l'année académique doit être une chaîne"),
    (0, express_validator_1.query)("classId")
        .optional()
        .isString()
        .withMessage("L'ID de la classe doit être une chaîne"),
    (0, express_validator_1.query)("studentId")
        .optional()
        .isString()
        .withMessage("L'ID de l'étudiant doit être une chaîne"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["Active", "Suspended", "Completed", "all"])
        .withMessage("Statut invalide"),
    (0, express_validator_1.query)("search")
        .optional()
        .isString()
        .withMessage("La recherche doit être une chaîne"),
    (0, express_validator_1.query)("sortBy")
        .optional()
        .isIn(["enrollmentDate", "createdAt", "status"])
        .withMessage("Tri invalide"),
    (0, express_validator_1.query)("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Ordre de tri invalide"),
];
// Validateur pour l'ID d'étudiant dans les paramètres
exports.validateStudentIdParam = [
    (0, express_validator_1.param)("studentId")
        .notEmpty()
        .withMessage("L'ID de l'étudiant est requis")
        .isString()
        .withMessage("L'ID de l'étudiant doit être une chaîne")
        .custom(async (value) => {
        const student = await prisma.student.findUnique({
            where: { id: value },
        });
        if (!student) {
            throw new Error("Étudiant non trouvé");
        }
        return true;
    }),
];
// Validateur pour la désinscription
exports.validateUnenroll = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("L'ID de l'inscription est requis")
        .isString()
        .withMessage("L'ID de l'inscription doit être une chaîne"),
    (0, express_validator_1.body)("reason")
        .optional()
        .isString()
        .withMessage("La raison doit être une chaîne")
        .isLength({ max: 500 })
        .withMessage("La raison ne doit pas dépasser 500 caractères"),
];
//# sourceMappingURL=enrollmentValidators.js.map