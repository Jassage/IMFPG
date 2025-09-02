import { Request, Response } from "express";
import prisma from "../prisma";

export const getAllTranscripts = async (req: Request, res: Response) => {
  try {
    const transcripts = await prisma.transcript.findMany();
    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getTranscriptById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transcript = await prisma.transcript.findUnique({ where: { id } });
    if (!transcript) return res.status(404).json({ error: "Transcript non trouvé" });
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createTranscript = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newTranscript = await prisma.transcript.create({ data });
    res.status(201).json(newTranscript);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

export const updateTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedTranscript = await prisma.transcript.update({ where: { id }, data });
    res.json(updatedTranscript);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const deleteTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.transcript.delete({ where: { id } });
    res.json({ message: "Transcript supprimé" });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression" });
  }
};