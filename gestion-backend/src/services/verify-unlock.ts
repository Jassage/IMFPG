// backend: /api/auth/verify-unlock.ts
import { Request, Response } from "express";
import { AuthService } from "./authService";

/**
 * Route de vérification de mot de passe pour le déverrouillage
 * Cette route ignore les tokens expirés
 */
export const verifyUnlock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
        code: "MISSING_CREDENTIALS",
      });
      return;
    }

    // Appeler la méthode verifyPassword du AuthService
    const isValid = await AuthService.verifyPassword(email, password);

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
        code: "INVALID_CREDENTIALS",
      });
      return;
    }

    // Succès
    res.status(200).json({
      success: true,
      message: "Mot de passe vérifié avec succès",
    });
  } catch (error: any) {
    console.error("Verify unlock error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification",
      code: "SERVER_ERROR",
    });
  }
};
