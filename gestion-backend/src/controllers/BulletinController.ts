/**
 * Contrôleur pour la gestion des bulletins
 */

import { Request, Response } from "express";
import { BulletinService } from "../services/BulletinService";
import { BulletinRequest, DocumentType } from "../types/bulletin";
import prisma from "../prisma";

export class BulletinController {
  private bulletinService: BulletinService;

  constructor() {
    this.bulletinService = new BulletinService();
  }

  /**
   * Génère un nouveau bulletin
   */
  generateBulletin = async (req: Request, res: Response) => {
    try {
      const request: BulletinRequest = req.body;
      const userId = req.user?.id || "system";
      const generatedByName = req.user
        ? `${req.user.firstName} ${req.user.lastName}`.trim()
        : "Système";

      // Valider la requête
      if (
        !request.studentId ||
        !request.academicYearId ||
        !request.documentType
      ) {
        return res.status(400).json({
          success: false,
          message: "Données requises manquantes",
        });
      }

      // Récupérer les données du bulletin
      const bulletinData = await this.bulletinService.getBulletinData(request);

      // Générer le PDF
      const pdfBuffer = await this.bulletinService.generateBulletinPDF(
        bulletinData,
        {
          includeHeader: true,
          includeFooter: true,
          includeSchoolLogo: true,
          language: request.language || "FR",
        }
      );

      // Enregistrer dans la base de données
      const transcript = await this.bulletinService.saveTranscript(
        bulletinData,
        pdfBuffer,
        generatedByName
      );

      res.json({
        success: true,
        message: "Bulletin généré avec succès",
        data: {
          transcriptId: transcript.id,
          fileName: transcript.fileName,
          generatedAt: transcript.generatedAt,
          statistics: bulletinData.statistics,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la génération du bulletin:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la génération du bulletin",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  };

  /**
   * Télécharge un bulletin existant
   */
  downloadBulletin = async (req: Request, res: Response) => {
    try {
      const { transcriptId } = req.params;

      const transcript =
        await this.bulletinService.getTranscriptById(transcriptId);

      if (!transcript) {
        return res.status(404).json({
          success: false,
          message: "Bulletin non trouvé",
        });
      }

      if (!transcript.pdfData) {
        return res.status(404).json({
          success: false,
          message: "PDF non disponible",
        });
      }

      // Enregistrer l'historique de téléchargement
      await this.bulletinService.recordDocumentAction(
        transcriptId,
        "DOWNLOADED",
        req.user?.id || "system",
        req.ip,
        req.get("User-Agent")
      );

      // Envoyer le PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${transcript.fileName}"`
      );
      res.send(transcript.pdfData);
    } catch (error) {
      console.error("Erreur lors du téléchargement du bulletin:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors du téléchargement du bulletin",
      });
    }
  };

  /**
   * Récupère les bulletins d'un étudiant
   */
  getStudentBulletins = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const { academicYearId, documentType } = req.query;

      const transcripts = await this.bulletinService.getStudentTranscripts(
        studentId,
        academicYearId as string | undefined,
        documentType as DocumentType | undefined
      );

      res.json({
        success: true,
        data: transcripts,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des bulletins:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des bulletins",
      });
    }
  };

  /**
   * Aperçu du bulletin sans enregistrement
   */
  previewBulletin = async (req: Request, res: Response) => {
    try {
      const request: BulletinRequest = req.body;

      // Valider la requête
      if (
        !request.studentId ||
        !request.academicYearId ||
        !request.documentType
      ) {
        return res.status(400).json({
          success: false,
          message: "Données requises manquantes",
        });
      }

      // Récupérer les données du bulletin
      const bulletinData = await this.bulletinService.getBulletinData(request);

      // Générer le PDF
      const pdfBuffer = await this.bulletinService.generateBulletinPDF(
        bulletinData,
        {
          includeHeader: true,
          includeFooter: true,
          includeSchoolLogo: true,
          language: request.language || "FR",
        }
      );

      // Renvoyer l'aperçu
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="preview_bulletin.pdf"'
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Erreur lors de la génération de l'aperçu:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la génération de l'aperçu",
      });
    }
  };

  /**
   * Méthodes supplémentaires pour le service
   */
  private getTranscriptById = async (id: string) => {
    // Implémentation de la méthode getTranscriptById
    return prisma.transcript.findUnique({
      where: { id },
    });
  };

  private recordDocumentAction = async (
    transcriptId: string,
    action: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) => {
    // Implémentation de la méthode recordDocumentAction
    await prisma.documentHistory.create({
      data: {
        transcriptId,
        action: action as any,
        performedBy: userId,
        ipAddress,
        userAgent,
        performedAt: new Date(),
      },
    });
  };
}
