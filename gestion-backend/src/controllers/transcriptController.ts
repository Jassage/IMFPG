import { Request, Response } from "express";
import { transcriptService } from "../services/transcriptService";

export const getAllTranscripts = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      academicYearId,
      controlType,
      documentType,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await transcriptService.getAllTranscripts({
      studentId: studentId as string,
      academicYearId: academicYearId as string,
      controlType: controlType as any,
      documentType: documentType as any,
      page: Number(page),
      limit: Number(limit),
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching transcripts:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des relevés" });
  }
};

export const getTranscriptById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transcript = await transcriptService.getTranscriptById(id);
    res.json(transcript);
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    if (error.message === "Transcript not found") {
      res.status(404).json({ error: "Relevé non trouvé" });
    } else {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

export const createTranscript = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      academicYearId,
      controlType,
      classLevel,
      documentType = "BULLETIN",
      grades,
      statistics,
      language = "FR",
      withSignature = true,
      withStamp = true,
    } = req.body;

    const newTranscript = await transcriptService.createTranscript({
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
  } catch (error: any) {
    console.error("Error creating transcript:", error);

    if (error.message.includes("Missing required fields")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("No valid grades")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Erreur lors de la création du relevé" });
    }
  }
};

export const updateTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedTranscript = await transcriptService.updateTranscript(
      id,
      data
    );
    res.json(updatedTranscript);
  } catch (error: any) {
    console.error("Error updating transcript:", error);
    res.status(400).json({ error: "Erreur lors de la mise à jour du relevé" });
  }
};

export const deleteTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTranscript = await transcriptService.deleteTranscript(id);

    res.json({
      message: "Relevé supprimé avec succès",
      deletedTranscript,
    });
  } catch (error: any) {
    console.error("Error deleting transcript:", error);
    if (error.message === "Transcript not found") {
      res.status(404).json({ error: "Relevé non trouvé" });
    } else {
      res
        .status(400)
        .json({ error: "Erreur lors de la suppression du relevé" });
    }
  }
};

export const downloadTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { transcript, pdfBuffer, fileName } =
      await transcriptService.downloadTranscript(id);

    // Configurer les headers pour le téléchargement
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Envoyer le PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error("Error downloading transcript:", error);
    if (error.message === "Transcript not found") {
      res.status(404).json({ error: "Relevé non trouvé" });
    } else {
      res.status(500).json({ error: "Erreur lors du téléchargement du PDF" });
    }
  }
};

// Endpoint pour calculer les statistiques
export const calculateStatistics = async (req: Request, res: Response) => {
  try {
    const { studentId, academicYearId, controlType, classLevel } = req.body;

    if (!studentId || !academicYearId || !controlType || !classLevel) {
      return res.status(400).json({
        error:
          "studentId, academicYearId, controlType et classLevel sont requis",
      });
    }

    const statistics = await transcriptService.calculateStatistics(
      studentId,
      academicYearId,
      controlType,
      classLevel
    );

    res.json(statistics);
  } catch (error) {
    console.error("Error calculating statistics:", error);
    res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
  }
};
