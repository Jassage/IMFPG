/**
 * Middleware pour vérifier si un utilisateur doit changer son mot de passe
 * avant d'accéder à certaines routes.
 */
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export const requirePasswordChange = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return next();
    }

    // Vérifier si le changement de mot de passe est requis
    const requiresChange =
      await AuthService.checkPasswordChangeRequired(userId);

    if (requiresChange) {
      // Exclure les routes de changement de mot de passe
      const excludedPaths = [
        "/api/auth/force-password-change",
        "/api/auth/logout",
        "/api/auth/check-password-change",
      ];

      if (excludedPaths.includes(req.path)) {
        return next();
      }

      // Rediriger ou bloquer l'accès
      return res.status(403).json({
        success: false,
        message: "Changement de mot de passe requis",
        code: "PASSWORD_CHANGE_REQUIRED",
        redirectTo: "/change-password",
      });
    }

    next();
  } catch (error) {
    console.error("Middleware - requirePasswordChange error:", error);
    next();
  }
};
