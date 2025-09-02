// middleware/upload.ts
import multer from "multer";
import path from "path";
import { Request } from "express";

// Configuration de Multer pour les photos de profil
const profileStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "uploads/profiles/");
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// // Configuration pour les fichiers d'importation
// const importStorage = multer.diskStorage({
//   destination: (req: Request, file, cb) => {
//     cb(null, 'uploads/imports/');
//   },
//   filename: (req: Request, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'import-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Filtres de fichiers
// const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else if (
//     file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//     file.mimetype === 'application/vnd.ms-excel' ||
//     file.mimetype === 'application/json'
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error('Type de fichier non supporté'));
//   }
// };
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
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

// // middleware/upload.ts
// import multer from 'multer';
// import path from 'path';

const importStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Créer le dossier s'il n'existe pas
    const fs = require("fs");
    const dir = "uploads/imports/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Corriger le problème de double extension
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, baseName + "-" + uniqueSuffix + extension);
  },
});

export const uploadImport = multer({
  storage: importStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
