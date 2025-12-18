import { body, query, param } from "express-validator";
const isPrismaId = (value: string) => {
  const cuidRegex = /^c[a-z0-9]{24,}$/i;
  return cuidRegex.test(value);
};
export const validateCreateAnnouncement = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Le contenu est requis")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Le contenu doit contenir entre 10 et 5000 caractères"),

  body("publishDate")
    .notEmpty()
    .withMessage("La date de publication est requise")
    .isISO8601()
    .withMessage("La date de publication doit être une date valide"),

  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'expiration doit être une date valide")
    .custom((value, { req }) => {
      if (value && new Date(value) <= new Date(req.body.publishDate)) {
        throw new Error(
          "La date d'expiration doit être postérieure à la date de publication"
        );
      }
      return true;
    }),

  body("targetAudience")
    .optional()
    .trim()
    .isIn(["All", "Students", "Teachers", "Parents", "Staff"])
    .withMessage("Public cible invalide"),

  body("priority")
    .optional()
    .trim()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Priorité invalide"),

  body("attachments")
    .optional()
    .isArray()
    .withMessage("Les pièces jointes doivent être un tableau"),
];

export const validateUpdateAnnouncement = [
  param("id")
    .notEmpty()
    .withMessage("L'ID de l'annonce est requis")
    .custom((value) => {
      if (!isPrismaId(value)) {
        throw new Error("ID d'annonce invalide (format CUID attendu)");
      }
      return true;
    }),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Le contenu doit contenir entre 10 et 5000 caractères"),

  body("publishDate")
    .optional()
    .isISO8601()
    .withMessage("La date de publication doit être une date valide"),

  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("La date d'expiration doit être une date valide"),

  body("targetAudience")
    .optional()
    .trim()
    .isIn(["All", "Students", "Teachers", "Parents", "Staff"])
    .withMessage("Public cible invalide"),

  body("priority")
    .optional()
    .trim()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Priorité invalide"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Le statut actif doit être un booléen"),
];

export const validateAnnouncementQuery = [
  query("targetAudience")
    .optional()
    .trim()
    .isIn(["All", "Students", "Teachers", "Parents", "Staff", "all"])
    .withMessage("Public cible invalide"),

  query("priority")
    .optional()
    .trim()
    .isIn(["Low", "Medium", "High", "Urgent", "all"])
    .withMessage("Priorité invalide"),

  query("isActive")
    .optional()
    .isIn(["true", "false", "all"])
    .withMessage("Le statut actif doit être 'true', 'false' ou 'all'"),

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
    .isIn(["title", "publishDate", "createdAt", "priority"])
    .withMessage("Champ de tri invalide"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'"),
];
