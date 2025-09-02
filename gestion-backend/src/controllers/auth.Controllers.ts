// src/controllers/authController.ts
import { Request, Response } from "express";
import { PrismaClient, UserRole } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt";

// Fonction pour vérifier le token JWT
export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    return decoded;
  } catch (error) {
    throw new Error("Token invalide");
  }
};

// Fonction utilitaire pour valider et convertir le rôle
const validateUserRole = (role: string): UserRole => {
  const validRoles = Object.values(UserRole);
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  throw new Error(
    `Rôle invalide: ${role}. Valeurs acceptées: ${validRoles.join(", ")}`
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    // Validation des données requises
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis",
      });
    }

    // Valider que le rôle est acceptable
    const validatedRole = validateUserRole(role);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role: validatedRole,
        password: hashedPassword,
        status: "Actif",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le statut
    if (user.status !== "Actif") {
      return res.status(401).json({
        message: "Votre compte est désactivé",
      });
    }

    // Vérifier le mot de passe
    if (!user.password) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const user = await verifyToken(token);
    res.json({ valid: true, user });
  } catch (error: any) {
    res.status(401).json({ valid: false, message: error.message });
  }
};
