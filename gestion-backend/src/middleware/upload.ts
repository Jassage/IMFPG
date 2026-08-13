// middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// Configuration de Multer pour les photos de profil
const profileStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadDir = path.resolve(process.cwd(), "uploads", "profiles");

    console.log("📁 Destination upload:", uploadDir);

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("📁 Dossier créé:", uploadDir);
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error("❌ Erreur création dossier profiles:", error);
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      "profile-" + uniqueSuffix + path.extname(file.originalname);
    console.log("📄 Nom du fichier généré:", filename);
    cb(null, filename);
  },
});

// Configuration pour les fichiers d'importation
const importStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Utiliser un chemin ABSOLU
    const uploadDir = path.resolve(process.cwd(), "uploads", "imports");

    // Créer le dossier récursivement s'il n'existe pas
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error("❌ Erreur création dossier imports:", error);
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: Request, file, cb) => {
    // Corriger le problème de double extension
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = baseName + "-" + uniqueSuffix + extension;

    cb(null, filename);
  },
});

// Filtres de fichiers
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  console.log("🔍 Fichier reçu:", file.originalname, "Type:", file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/json",
    "text/csv",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté: " + file.mimetype));
  }
};

export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export const uploadImport = multer({
  storage: importStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Configuration pour gérer à la fois la photo et les champs texte
export const uploadStudentPhoto = multer({
  storage: profileStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
}).single("photo");

// Middleware pour parser les champs texte après upload
export const parseStudentForm = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Si guardians est une string JSON, le parser
  if (req.body.guardians && typeof req.body.guardians === "string") {
    try {
      req.body.guardians = JSON.parse(req.body.guardians);
    } catch (error) {
      console.error("Erreur parsing guardians:", error);
    }
  }

  // Convertir les boolean strings
  if (req.body.createUserAccount === "true") req.body.createUserAccount = true;
  if (req.body.createUserAccount === "false")
    req.body.createUserAccount = false;

  if (req.body.sendWelcomeEmail === "true") req.body.sendWelcomeEmail = true;
  if (req.body.sendWelcomeEmail === "false") req.body.sendWelcomeEmail = false;

  next();
};
// Configuration pour les pièces jointes de la messagerie (photo / document / voix)
export type AttachmentCategory = "PHOTO" | "DOCUMENT" | "VOICE";

const ATTACHMENT_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/zip",
];

export function getAttachmentCategory(mimetype: string): AttachmentCategory | null {
  if (mimetype.startsWith("image/")) return "PHOTO";
  if (mimetype.startsWith("audio/")) return "VOICE";
  if (ATTACHMENT_DOCUMENT_TYPES.includes(mimetype)) return "DOCUMENT";
  return null;
}

const ATTACHMENT_SUBFOLDER: Record<AttachmentCategory, string> = {
  PHOTO: "photos",
  DOCUMENT: "documents",
  VOICE: "voice",
};

const attachmentStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const category = getAttachmentCategory(file.mimetype);
    const uploadDir = path.resolve(
      process.cwd(),
      "uploads",
      "attachments",
      category ? ATTACHMENT_SUBFOLDER[category] : "other",
    );

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error("❌ Erreur création dossier attachments:", error);
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, "attachment-" + uniqueSuffix + extension);
  },
});

const attachmentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (getAttachmentCategory(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté: " + file.mimetype));
  }
};

export const uploadAttachment = multer({
  storage: attachmentStorage,
  fileFilter: attachmentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
}).single("file");

// Middleware de debug pour voir les fichiers uploadés
export const logUpload = (req: Request, res: Response, next: NextFunction) => {
  console.log("🔄 === MIDDLEWARE MULTER DEBUG ===");
  console.log("📦 Headers:", req.headers);
  console.log("📋 Content-Type:", req.headers["content-type"]);
  console.log("📁 Fichiers dans req.files:", req.files);
  console.log("📄 Fichier dans req.file:", req.file);
  console.log("📝 Corps de la requête:", req.body);
  console.log("================================");
  next();
};
