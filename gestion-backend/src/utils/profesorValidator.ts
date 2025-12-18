import { body, param, query } from "express-validator";

/**
 * Validateur pour la création d'un professeur
 */
export const validateProfesseurCreate = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le prénom contient des caractères invalides"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom contient des caractères invalides"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .custom((value) => {
      if (!value) return true; // Optionnel

      // Nettoyer le numéro
      const cleaned = value.replace(/[\s\-()]/g, "");

      // Vérifier le format haïtien: +509XXXXXXXX
      const phoneRegex = /^(\+509)\d{8}$/;

      // Vérifier longueur: +509 (4) + 8 chiffres = 12 caractères
      const isValidLength = cleaned.length === 12;
      const isValidFormat = phoneRegex.test(cleaned);

      if (!isValidLength || !isValidFormat) {
        throw new Error(
          "Numéro de téléphone invalide. Format: +509XXXXXXXX (ex: +50944556677)"
        );
      }

      return true;
    }),

  body("speciality")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("La spécialité ne peut pas dépasser 100 caractères"),

  body("hireDate")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;

      const date = new Date(value);
      const today = new Date();
      const minDate = new Date("2000-01-01");

      // Vérifier que la date est valide
      if (isNaN(date.getTime())) {
        throw new Error("Date d'embauche invalide");
      }

      // Vérifier que la date n'est pas dans le futur
      if (date > today) {
        throw new Error("La date d'embauche ne peut pas être dans le futur");
      }

      // Vérifier que la date est après 2000
      if (date < minDate) {
        throw new Error(
          "La date d'embauche doit être après le 1er janvier 2000"
        );
      }

      return true;
    }),

  body("status")
    .optional({ values: "falsy" })
    .isIn(["Actif", "Inactif"])
    .withMessage("Statut invalide. Doit être 'Actif' ou 'Inactif'"),

  body("matricule")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Le matricule doit contenir entre 3 et 20 caractères")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "Le matricule ne peut contenir que des lettres majuscules, chiffres et tirets"
    ),

  body("address")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("L'adresse ne peut pas dépasser 200 caractères"),

  body("qualifications")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les qualifications ne peuvent pas dépasser 500 caractères"),

  body("userId")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("L'ID utilisateur doit être une chaîne valide"),
];

/**
 * Validateur pour la mise à jour d'un professeur
 */
export const validateProfesseurUpdate = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du professeur est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne valide"),

  body("firstName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le prénom contient des caractères invalides"),

  body("lastName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage("Le nom contient des caractères invalides"),

  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Email invalide")
    .normalizeEmail(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .custom((value) => {
      if (!value) return true; // Optionnel

      // Nettoyer le numéro
      const cleaned = value.replace(/[\s\-()]/g, "");

      // Vérifier le format haïtien: +509XXXXXXXX
      const phoneRegex = /^(\+509)\d{8}$/;

      // Vérifier longueur: +509 (4) + 8 chiffres = 12 caractères
      const isValidLength = cleaned.length === 12;
      const isValidFormat = phoneRegex.test(cleaned);

      if (!isValidLength || !isValidFormat) {
        throw new Error(
          "Numéro de téléphone invalide. Format: +509XXXXXXXX (ex: +50944556677)"
        );
      }

      return true;
    }),

  body("speciality")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("La spécialité ne peut pas dépasser 100 caractères"),

  body("hireDate")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;

      const date = new Date(value);
      const today = new Date();
      const minDate = new Date("2000-01-01");

      // Vérifier que la date est valide
      if (isNaN(date.getTime())) {
        throw new Error("Date d'embauche invalide");
      }

      // Vérifier que la date n'est pas dans le futur
      if (date > today) {
        throw new Error("La date d'embauche ne peut pas être dans le futur");
      }

      // Vérifier que la date est après 2000
      if (date < minDate) {
        throw new Error(
          "La date d'embauche doit être après le 1er janvier 2000"
        );
      }

      return true;
    }),

  body("status")
    .optional({ values: "falsy" })
    .isIn(["Actif", "Inactif"])
    .withMessage("Statut invalide. Doit être 'Actif' ou 'Inactif'"),

  body("matricule")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Le matricule doit contenir entre 3 et 20 caractères")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "Le matricule ne peut contenir que des lettres majuscules, chiffres et tirets"
    ),

  body("address")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("L'adresse ne peut pas dépasser 200 caractères"),

  body("qualifications")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Les qualifications ne peuvent pas dépasser 500 caractères"),
];

/**
 * Validateur pour les filtres de recherche
 */
export const validateSearchFilters = [
  query("search")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Le terme de recherche ne peut pas dépasser 100 caractères"),

  query("page")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être supérieur à 0")
    .toInt(),

  query("limit")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être entre 1 et 100")
    .toInt(),

  query("sortBy")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Le champ de tri doit être une chaîne"),

  query("sortOrder")
    .optional({ values: "falsy" })
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),

  query("status")
    .optional({ values: "falsy" })
    .isIn(["Actif", "Inactif", ""])
    .withMessage("Le statut doit être 'Actif', 'Inactif' ou vide"),

  query("speciality")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("La spécialité ne peut pas dépasser 100 caractères"),
];

/**
 * Validateur pour le changement de statut
 */
export const validateStatusChange = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du professeur est requis")
    .isString()
    .withMessage("L'ID doit être une chaîne valide"),

  body("status")
    .notEmpty()
    .withMessage("Le statut est requis")
    .isIn(["Actif", "Inactif"])
    .withMessage("Statut invalide. Doit être 'Actif' ou 'Inactif'"),
];
