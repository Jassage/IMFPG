import { body, query, param } from "express-validator";
const isPrismaId = (value: string) => {
  const cuidRegex = /^c[a-z0-9]{24,}$/i;
  return cuidRegex.test(value);
};
export const validateCreateEvent = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description est requise")
    .isLength({ min: 10, max: 2000 })
    .withMessage("La description doit contenir entre 10 et 2000 caractères"),

  body("startDate")
    .notEmpty()
    .withMessage("La date de début est requise")
    .isISO8601()
    .withMessage("La date de début doit être une date valide"),

  body("endDate")
    .notEmpty()
    .withMessage("La date de fin est requise")
    .isISO8601()
    .withMessage("La date de fin doit être une date valide")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error(
          "La date de fin doit être postérieure à la date de début"
        );
      }
      return true;
    }),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Le lieu est requis")
    .isLength({ min: 3, max: 200 })
    .withMessage("Le lieu doit contenir entre 3 et 200 caractères"),

  body("category")
    .optional()
    .trim()
    .isIn(["General", "Academic", "Cultural", "Sports", "Meeting", "Other"])
    .withMessage("Catégorie invalide"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("La visibilité doit être un booléen"),
];

export const validateUpdateEvent = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de l'événement est requis")
    .custom((value) => {
      if (!isPrismaId(value)) {
        throw new Error("ID d'événement invalide (format CUID attendu)");
      }
      return true;
    }),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("La description doit contenir entre 10 et 2000 caractères"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("La date de début doit être une date valide"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("La date de fin doit être une date valide"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Le lieu doit contenir entre 3 et 200 caractères"),

  body("category")
    .optional()
    .trim()
    .isIn(["General", "Academic", "Cultural", "Sports", "Meeting", "Other"])
    .withMessage("Catégorie invalide"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("La visibilité doit être un booléen"),
];

export const validateEventQuery = [
  query("status")
    .optional()
    .trim()
    .isIn(["Scheduled", "Cancelled", "Completed", "Postponed", "all"])
    .withMessage("Statut invalide"),

  query("category").optional().trim(),

  query("isPublic")
    .optional()
    .isIn(["true", "false", "all"])
    .withMessage("La visibilité doit être 'true', 'false' ou 'all'"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("La date de début doit être une date valide"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("La date de fin doit être une date valide"),

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
    .isIn(["title", "startDate", "endDate", "createdAt", "category"])
    .withMessage("Champ de tri invalide"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
