"use strict";
/**
 * Contrôleur pour la gestion des bulletins
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinController = void 0;
const BulletinService_1 = require("../services/BulletinService");
const prisma_1 = require("../../generated/prisma");
class BulletinController {
    constructor() {
        /**
         * Génère un nouveau bulletin
         */
        this.generateBulletin = async (req, res) => {
            try {
                const request = req.body;
                const userId = req.user?.id || "system";
                // Valider la requête
                if (!request.studentId ||
                    !request.academicYearId ||
                    !request.controlType) {
                    return res.status(400).json({
                        success: false,
                        message: "Données requises manquantes",
                    });
                }
                // Récupérer les données du bulletin
                const bulletinData = await this.bulletinService.getBulletinData(request);
                // Générer le PDF
                const pdfBuffer = await this.bulletinService.generateBulletinPDF(bulletinData, {
                    includeHeader: true,
                    includeFooter: true,
                    includeSchoolLogo: true,
                    language: request.language || "FR",
                });
                // Enregistrer dans la base de données
                const transcript = await this.bulletinService.saveTranscript(bulletinData, pdfBuffer, userId);
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
            }
            catch (error) {
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
        this.downloadBulletin = async (req, res) => {
            try {
                const { transcriptId } = req.params;
                const transcript = await this.bulletinService.getTranscriptById(transcriptId);
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
                await this.bulletinService.recordDocumentAction(transcriptId, "DOWNLOADED", req.user?.id || "system", req.ip, req.get("User-Agent"));
                // Envoyer le PDF
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `attachment; filename="${transcript.fileName}"`);
                res.send(transcript.pdfData);
            }
            catch (error) {
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
        this.getStudentBulletins = async (req, res) => {
            try {
                const { studentId } = req.params;
                const { academicYearId } = req.query;
                const transcripts = await this.bulletinService.getStudentTranscripts(studentId, academicYearId);
                res.json({
                    success: true,
                    data: transcripts,
                });
            }
            catch (error) {
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
        this.previewBulletin = async (req, res) => {
            try {
                const request = req.body;
                // Récupérer les données du bulletin
                const bulletinData = await this.bulletinService.getBulletinData(request);
                // Générer le PDF
                const pdfBuffer = await this.bulletinService.generateBulletinPDF(bulletinData, {
                    includeHeader: true,
                    includeFooter: true,
                    includeSchoolLogo: true,
                    language: request.language || "FR",
                });
                // Renvoyer l'aperçu
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'inline; filename="preview_bulletin.pdf"');
                res.send(pdfBuffer);
            }
            catch (error) {
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
        this.getTranscriptById = async (id) => {
            // Implémentation de la méthode getTranscriptById
            const prisma = new prisma_1.PrismaClient();
            return prisma.transcript.findUnique({
                where: { id },
            });
        };
        this.recordDocumentAction = async (transcriptId, action, userId, ipAddress, userAgent) => {
            // Implémentation de la méthode recordDocumentAction
            const prisma = new prisma_1.PrismaClient();
            await prisma.documentHistory.create({
                data: {
                    transcriptId,
                    action: action,
                    performedBy: userId,
                    ipAddress,
                    userAgent,
                    performedAt: new Date(),
                },
            });
        };
        this.bulletinService = new BulletinService_1.BulletinService();
    }
}
exports.BulletinController = BulletinController;
//# sourceMappingURL=BulletinController.js.map