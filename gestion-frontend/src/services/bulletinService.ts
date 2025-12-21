/**
 * Service pour l'interaction avec l'API des bulletins
 */

import axios from "axios";
// import { Bulletin, BulletinGenerationRequest } from "../types/bulletin";
import api from "./api";
import { Bulletin, BulletinGenerationRequest } from "@/types/bulletin";

class BulletinService {
  /**
   * Génère un nouveau bulletin
   */
  async generateBulletin(request: BulletinGenerationRequest): Promise<{
    success: boolean;
    data: {
      transcriptId: string;
      fileName: string;
      generatedAt: string;
      statistics: any;
    };
    message: string;
  }> {
    try {
      const response = await api.post("/generate", request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupère les bulletins d'un étudiant
   */
  async getStudentBulletins(
    studentId: string,
    academicYearId?: string
  ): Promise<{ success: boolean; data: Bulletin[] }> {
    try {
      const params = academicYearId ? { academicYearId } : {};
      const response = await api.get(`/student/${studentId}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Télécharge un bulletin
   */
  async downloadBulletin(transcriptId: string): Promise<void> {
    try {
      const response = await api.get(`/download/${transcriptId}`, {
        responseType: "blob",
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extraire le nom de fichier de l'en-tête Content-Disposition
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "bulletin.pdf";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Aperçu du bulletin
   */
  async previewBulletin(request: BulletinGenerationRequest): Promise<void> {
    try {
      const response = await api.post("/preview", request, {
        responseType: "blob",
      });

      // Ouvrir le PDF dans un nouvel onglet
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gestion des erreurs
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Erreur de l'API
      const message = error.response.data?.message || "Une erreur est survenue";
      throw new Error(message);
    } else if (error.request) {
      // Pas de réponse du serveur
      throw new Error("Pas de réponse du serveur. Vérifiez votre connexion.");
    } else {
      // Erreur lors de la configuration de la requête
      throw new Error("Erreur de configuration de la requête");
    }
  }
}

export default new BulletinService();
