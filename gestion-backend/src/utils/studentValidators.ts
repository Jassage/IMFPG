/**
 * @file studentValidators.ts
 * @description Validateurs pour la gestion des étudiants
 * @version 1.0.0
 */

import { body, param, query } from "express-validator";
import { validatePhoneNumber } from "./validators";
// import { validateEmail, validatePhoneNumber } from "../../utils/validators";

/**
 * @desc Validateur pour la création d'un étudiant
 */
export const validateCreateStudent = [
  body("firstName")
    .exists()
    .withMessage("Le prénom est requis")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom ne doit contenir que des lettres, espaces et tirets"
    ),

  body("lastName")
    .exists()
    .withMessage("Le nom est requis")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),

  body("email")
    .exists()
    .withMessage("L'email est requis")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("L'email doit être valide"),

  body("phone")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!validatePhoneNumber(value)) {
        throw new Error("Le numéro de téléphone doit être valide");
      }
      return true;
    }),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("La date de naissance doit être au format YYYY-MM-DD")
    .custom((value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 10;
    })
    .withMessage("L'éleve doit avoir au minimum 10 ans"),

  body("sexe")
    .optional()
    .isIn(["M", "F", "Autre"])
    .withMessage("Le sexe doit être M, F ou Autre"),

  body("cin")
    .optional()
    .trim()
    .isLength({ min: 8, max: 12 })
    .withMessage("Le CIN doit contenir entre 8 et 12 caractères"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive", "Graduated", "Transferred", "Suspended"])
    .withMessage(
      "Le statut doit être Active, Inactive, Graduated, Transferred ou Suspended"
    ),

  body("bloodGroup")
    .optional()
    .isIn([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .withMessage("Le groupe sanguin doit être valide")
    .withMessage(
      "Le groupe sanguin doit être A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE, AB_POSITIVE, AB_NEGATIVE, O_POSITIVE ou O_NEGATIVE"
    ),

  body("allergies")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les allergies ne doivent pas dépasser 500 caractères"),

  body("disabilities")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les handicaps ne doivent pas dépasser 500 caractères"),
];

/**
 * @desc Validateur pour la mise à jour d'un étudiant
 */
export const validateUpdateStudent = [
  param("id")
    .exists()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom ne doit contenir que des lettres, espaces et tirets"
    ),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres, espaces et tirets"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("L'email doit être valide"),

  body("phone")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      if (!validatePhoneNumber(value)) {
        throw new Error("Le numéro de téléphone doit être valide");
      }
      return true;
    }),
];

/**
 * @desc Validateur pour la recherche d'étudiants
 */
export const validateStudentSearch = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Le terme de recherche ne doit pas dépasser 100 caractères"),

  query("status")
    .optional()
    .isIn([
      "Active",
      "Inactive",
      "Graduated",
      "Transferred",
      "Suspended",
      "all",
    ])
    .withMessage("Le statut doit être valide"),

  query("classId")
    .optional()
    .isString()
    .withMessage("L'ID de classe doit être une chaîne"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100"),

  query("sortBy")
    .optional()
    .isIn([
      "firstName",
      "lastName",
      "email",
      "studentCode",
      "createdAt",
      "dateOfBirth",
    ])
    .withMessage("Le tri doit être sur un champ valide"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];

/**
 * @desc Validateur pour le changement de statut
 */
export const validateStudentStatusUpdate = [
  param("id")
    .exists()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("status")
    .exists()
    .withMessage("Le statut est requis")
    .isIn(["Active", "Inactive", "Graduated", "Transferred", "Suspended"])
    .withMessage("Le statut doit être valide"),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La raison ne doit pas dépasser 500 caractères"),
];

/**
 * @desc Validateur pour l'affectation à une classe
 */
export const validateAssignClass = [
  param("id")
    .exists()
    .withMessage("L'ID de l'étudiant est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne de caractères"),

  body("classId")
    .exists()
    .withMessage("L'ID de la classe est requis")
    .isString()
    .withMessage("L'ID de classe doit être une chaîne"),
];
