// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../controllers/auth.Controllers";

// 🔥 SUPPRIMER AuthenticatedRequest et utiliser Request standard
export const authenticateToken = async (
  req: Request, // 🔥 Utiliser Request standard
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token d'accès requis" });
    }

    const user = await verifyToken(token);

    // Ajouter l'utilisateur à la requête
    req.user = user; // 🔥 Maintenant compatible avec l'interface étendue
    (req as any).userId = user.id; // Pour compatibilité

    next();
  } catch (error: any) {
    console.error("❌ Erreur authentification:", error.message);
    return res.status(401).json({ message: error.message });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    next();
  };
};
