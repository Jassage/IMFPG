import { Server, Socket } from "socket.io";
import { verifyJwtToken } from "../utils/security";
import { UserService } from "../services/userService";
import { MessageService } from "../services/messageService";
import { setIO } from "./io";

interface AuthSocket extends Socket {
  userId?: string;
}

// Suivi en mémoire des sockets connectés par utilisateur (un utilisateur peut avoir
// plusieurs onglets/appareils ouverts ; on ne le considère hors ligne que quand son
// dernier socket se déconnecte).
const onlineSockets = new Map<string, Set<string>>();

export function initSocketServer(io: Server) {
  setIO(io);

  // JWT auth middleware for sockets
  io.use(async (socket: AuthSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = verifyJwtToken(token);
      const user = await UserService.getUserProfile(decoded.id);
      if (!user || user.status !== "Actif") return next(new Error("Account disabled"));
      socket.userId = user.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket: AuthSocket) => {
    const userId = socket.userId!;

    // Each user joins their personal room for direct notifications
    socket.join(`user:${userId}`);

    const wasOffline = !onlineSockets.has(userId);
    if (wasOffline) onlineSockets.set(userId, new Set());
    onlineSockets.get(userId)!.add(socket.id);

    if (wasOffline) {
      const conversationIds = await MessageService.getUserConversationIds(userId);
      for (const conversationId of conversationIds) {
        socket.to(`conv:${conversationId}`).emit("user_online", { userId });
      }
    }

    socket.on("join_conversation", async (conversationId: string) => {
      const isMember = await MessageService.isParticipant(conversationId, userId);
      if (!isMember) return;

      socket.join(`conv:${conversationId}`);

      const participantIds = await MessageService.getParticipantIds(conversationId);
      const onlineUserIds = participantIds.filter((id) => onlineSockets.has(id));
      socket.emit("online_status", { conversationId, onlineUserIds });
    });

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on(
      "send_message",
      async (
        { conversationId, content }: { conversationId: string; content: string },
        callback?: (result: { success: boolean; message?: any; error?: string }) => void,
      ) => {
        if (!content?.trim()) {
          callback?.({ success: false, error: "Message vide" });
          return;
        }

        try {
          const message = await MessageService.sendMessage(
            conversationId,
            userId,
            content.trim(),
          );

          // Broadcast to all participants in the conversation room, plus each
          // participant's personal room so delivery doesn't depend on having
          // that specific conversation open.
          io.to(`conv:${conversationId}`).emit("new_message", { conversationId, message });
          const participantIds = await MessageService.getParticipantIds(conversationId);
          for (const participantId of participantIds) {
            if (participantId === userId) continue;
            io.to(`user:${participantId}`).emit("new_message", { conversationId, message });
          }

          callback?.({ success: true, message });
        } catch (err: any) {
          callback?.({ success: false, error: err.message });
        }
      },
    );

    socket.on(
      "ack_delivered",
      async ({ conversationId }: { conversationId: string; messageId?: string }) => {
        const isMember = await MessageService.isParticipant(conversationId, userId);
        if (!isMember) return;

        const lastDeliveredAt = await MessageService.markDelivered(conversationId, userId);
        io.to(`conv:${conversationId}`).emit("message_status", {
          conversationId,
          userId,
          lastDeliveredAt,
        });
      },
    );

    socket.on(
      "typing",
      ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
        socket.to(`conv:${conversationId}`).emit("user_typing", {
          conversationId,
          userId,
          isTyping,
        });
      },
    );

    socket.on("disconnect", async () => {
      const sockets = onlineSockets.get(userId);
      sockets?.delete(socket.id);

      if (sockets && sockets.size === 0) {
        onlineSockets.delete(userId);
        const conversationIds = await MessageService.getUserConversationIds(userId);
        for (const conversationId of conversationIds) {
          io.to(`conv:${conversationId}`).emit("user_offline", { userId });
        }
      }
    });
  });
}
