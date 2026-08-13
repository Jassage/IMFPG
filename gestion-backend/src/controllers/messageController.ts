import { Response } from "express";
import { AuthRequest } from "./auth/authTypes";
import { MessageService } from "../services/messageService";
import { getAttachmentCategory } from "../middleware/upload";
import { getIO } from "../socket/io";

export const MessageController = {
  async getConversations(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const conversations = await MessageService.getConversations(userId);
    res.json({ success: true, data: conversations });
  },

  async createConversation(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { type, targetUserId, name, memberIds } = req.body;

    if (type === "GROUP") {
      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: "Le nom du groupe est requis" });
      }
      if (!memberIds || memberIds.length < 1) {
        return res.status(400).json({ success: false, message: "Au moins un autre membre est requis" });
      }
      const conversation = await MessageService.createGroupConversation(userId, name.trim(), memberIds);
      return res.status(201).json({ success: true, data: conversation });
    }

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: "L'ID du destinataire est requis" });
    }

    const conversation = await MessageService.getOrCreateDirectConversation(userId, targetUserId);
    res.status(201).json({ success: true, data: conversation });
  },

  async getMessages(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;
    const { cursor, limit } = req.query;

    const messages = await MessageService.getMessages(
      id,
      userId,
      cursor as string | undefined,
      limit ? parseInt(limit as string) : 40,
    );
    res.json({ success: true, data: messages });
  },

  async markAsRead(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;
    const lastReadAt = await MessageService.markAsRead(id, userId);
    getIO().to(`conv:${id}`).emit("message_status", {
      conversationId: id,
      userId,
      lastReadAt,
    });
    res.json({ success: true });
  },

  async sendAttachment(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Aucun fichier reçu" });
    }

    const category = getAttachmentCategory(file.mimetype);
    if (!category) {
      return res.status(400).json({ success: false, message: "Type de fichier non supporté" });
    }

    const relativePath = file.path
      .split(/uploads[\\/]/)[1]
      .split(/[\\/]/)
      .join("/");
    const url = `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;

    const message = await MessageService.sendAttachment(id, userId, {
      url,
      type: category,
      fileName: file.originalname,
      fileSize: file.size,
      caption: typeof req.body.caption === "string" ? req.body.caption : undefined,
    });

    const io = getIO();
    io.to(`conv:${id}`).emit("new_message", { conversationId: id, message });
    const participantIds = await MessageService.getParticipantIds(id);
    for (const participantId of participantIds) {
      if (participantId === userId) continue;
      io.to(`user:${participantId}`).emit("new_message", { conversationId: id, message });
    }

    res.status(201).json({ success: true, data: message });
  },

  async getUnreadCount(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const count = await MessageService.getUnreadCount(userId);
    res.json({ success: true, data: { count } });
  },

  async getUsers(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { search } = req.query;
    const users = await MessageService.getUsers(userId, search as string | undefined);
    res.json({ success: true, data: users });
  },
};
