"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStatistics = exports.downloadTranscript = exports.deleteTranscript = exports.updateTranscript = exports.createTranscript = exports.getTranscriptById = exports.getAllTranscripts = void 0;
const transcriptService_1 = require("../services/transcriptService");
const getAllTranscripts = async (req, res) => {
    try {
        const { studentId, academicYearId, controlType, documentType, page = 1, limit = 10, } = req.query;
        const result = await transcriptService_1.transcriptService.getAllTranscripts({
            studentId: studentId,
            academicYearId: academicYearId,
            controlType: controlType,
            documentType: documentType,
            page: Number(page),
            limit: Number(limit),
        });
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching transcripts:", error);
        res
            .status(500)
            .json({ error: "Erreur serveur lors de la récupération des relevés" });
    }
};
exports.getAllTranscripts = getAllTranscripts;
const getTranscriptById = async (req, res) => {
    try {
        const { id } = req.params;
        const transcript = await transcriptService_1.transcriptService.getTranscriptById(id);
        res.json(transcript);
    }
    catch (error) {
        console.error("Error fetching transcript:", error);
        if (error.message === "Transcript not found") {
            res.status(404).json({ error: "Relevé non trouvé" });
        }
        else {
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
};
exports.getTranscriptById = getTranscriptById;
const createTranscript = async (req, res) => {
    try {
        const { studentId, academicYearId, controlType, classLevel, documentType = "BULLETIN", grades, statistics, language = "FR", withSignature = true, withStamp = true, } = req.body;
        const newTranscript = await transcriptService_1.transcriptService.createTranscript({
            studentId,
            academicYearId,
            controlType,
            classLevel,
            documentType,
            grades,
            statistics,
            language,
            withSignature,
            withStamp,
        });
        res.status(201).json(newTranscript);
    }
    catch (error) {
        console.error("Error creating transcript:", error);
        if (error.message.includes("Missing required fields")) {
            res.status(400).json({ error: error.message });
        }
        else if (error.message.includes("not found")) {
            res.status(404).json({ error: error.message });
        }
        else if (error.message.includes("No valid grades")) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Erreur lors de la création du relevé" });
        }
    }
};
exports.createTranscript = createTranscript;
const updateTranscript = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedTranscript = await transcriptService_1.transcriptService.updateTranscript(id, data);
        res.json(updatedTranscript);
    }
    catch (error) {
        console.error("Error updating transcript:", error);
        res.status(400).json({ error: "Erreur lors de la mise à jour du relevé" });
    }
};
exports.updateTranscript = updateTranscript;
const deleteTranscript = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTranscript = await transcriptService_1.transcriptService.deleteTranscript(id);
        res.json({
            message: "Relevé supprimé avec succès",
            deletedTranscript,
        });
    }
    catch (error) {
        console.error("Error deleting transcript:", error);
        if (error.message === "Transcript not found") {
            res.status(404).json({ error: "Relevé non trouvé" });
        }
        else {
            res
                .status(400)
                .json({ error: "Erreur lors de la suppression du relevé" });
        }
    }
};
exports.deleteTranscript = deleteTranscript;
const downloadTranscript = async (req, res) => {
    try {
        const { id } = req.params;
        const { transcript, pdfBuffer, fileName } = await transcriptService_1.transcriptService.downloadTranscript(id);
        // Configurer les headers pour le téléchargement
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Length", pdfBuffer.length);
        // Envoyer le PDF
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("Error downloading transcript:", error);
        if (error.message === "Transcript not found") {
            res.status(404).json({ error: "Relevé non trouvé" });
        }
        else {
            res.status(500).json({ error: "Erreur lors du téléchargement du PDF" });
        }
    }
};
exports.downloadTranscript = downloadTranscript;
// Endpoint pour calculer les statistiques
const calculateStatistics = async (req, res) => {
    try {
        const { studentId, academicYearId, controlType, classLevel } = req.body;
        if (!studentId || !academicYearId || !controlType || !classLevel) {
            return res.status(400).json({
                error: "studentId, academicYearId, controlType et classLevel sont requis",
            });
        }
        const statistics = await transcriptService_1.transcriptService.calculateStatistics(studentId, academicYearId, controlType, classLevel);
        res.json(statistics);
    }
    catch (error) {
        console.error("Error calculating statistics:", error);
        res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
    }
};
exports.calculateStatistics = calculateStatistics;
//# sourceMappingURL=transcriptController.js.map