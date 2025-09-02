import * as fs from "fs";
import * as path from "path";

const models = [
  "Student",
  "Enrollment",
  "Guardian",
  "UE",
  "Prerequisite",
  "Grade",
  "Retake",
  "User",
  "Faculty",
  "FacultyLevel",
  "Schedule",
  "Attendance",
  "Payment",
  "Book",
  "BookLoan",
  "Transcript",
  "Message",
  "MessageAttachment",
  "Event",
  "EventParticipant",
  "Announcement",
  "AnnouncementAttachment",
  "Scholarship",
  "ScholarshipApplication",
  "ScholarshipDocument",
  "Room",
  "RoomEquipment",
  "RoomReservation",
  "Certificate",
  "Analytics"
];

// Convertit "Student" => "student"
const camelCase = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

models.forEach((model) => {
  const modelVar = camelCase(model);
  const controllerContent = `
import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getAll${model}s = async (req: Request, res: Response) => {
  try {
    const ${modelVar}s = await prisma.${modelVar}.findMany();
    res.json(${modelVar}s);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const get${model}ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ${modelVar} = await prisma.${modelVar}.findUnique({ where: { id } });
    if (!${modelVar}) return res.status(404).json({ error: "${model} non trouvé" });
    res.json(${modelVar});
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const create${model} = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const new${model} = await prisma.${modelVar}.create({ data });
    res.status(201).json(new${model});
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

export const update${model} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated${model} = await prisma.${modelVar}.update({ where: { id }, data });
    res.json(updated${model});
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const delete${model} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.${modelVar}.delete({ where: { id } });
    res.json({ message: "${model} supprimé" });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression" });
  }
};
`.trim();

  const routesContent = `
import { Router } from "express";
import {
  getAll${model}s,
  get${model}ById,
  create${model},
  update${model},
  delete${model},
} from "../controllers/${modelVar}Controller";

const router = Router();

router.get("/", getAll${model}s);
router.get("/:id", get${model}ById);
router.post("/", create${model});
router.put("/:id", update${model});
router.delete("/:id", delete${model});

export default router;
`.trim();

  // Créer dossiers si pas existants
  const controllersDir = path.join(__dirname, "controllers");
  const routesDir = path.join(__dirname, "routes");

  if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir);
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir);

  // Écrire fichiers
  fs.writeFileSync(path.join(controllersDir, `${modelVar}Controller.ts`), controllerContent);
  fs.writeFileSync(path.join(routesDir, `${modelVar}Routes.ts`), routesContent);

  console.log(`✅ Fichiers générés pour le modèle ${model}`);
});
