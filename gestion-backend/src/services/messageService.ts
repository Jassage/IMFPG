import prisma from "../prisma";
import { AppError } from "../middleware/errorMiddleware";

const PARTICIPANT_INCLUDE = {
  include: {
    user: {
      select: { id: true, firstName: true, lastName: true, role: true, avatar: true },
    },
  },
} as const;

type ParticipantWithUser = {
  userId: string;
  lastReadAt: Date | null;
  lastDeliveredAt: Date | null;
  user: { firstName: string; lastName: string; role: string; avatar: string | null };
};

function mapParticipants(participants: ParticipantWithUser[]) {
  return participants.map((p) => ({
    userId: p.userId,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    role: p.user.role,
    avatar: p.user.avatar,
    lastReadAt: p.lastReadAt,
    lastDeliveredAt: p.lastDeliveredAt,
  }));
}

export const MessageService = {
  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    return !!participant;
  },

  async getParticipantIds(conversationId: string): Promise<string[]> {
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
      select: { userId: true },
    });
    return participants.map((p) => p.userId);
  },

  async getUserConversationIds(userId: string): Promise<string[]> {
    const participants = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    return participants.map((p) => p.conversationId);
  },

  async getConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true, avatar: true },
            },
          },
        },
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return conversations.map((conv) => {
      const myParticipant = conv.participants.find((p) => p.userId === userId);
      const lastReadAt = myParticipant?.lastReadAt;

      const unreadCount = conv.messages.filter(
        (m) => !lastReadAt || m.createdAt > lastReadAt,
      ).length;

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        updatedAt: conv.updatedAt,
        participants: conv.participants.map((p) => ({
          userId: p.userId,
          firstName: p.user.firstName,
          lastName: p.user.lastName,
          role: p.user.role,
          avatar: p.user.avatar,
          lastReadAt: p.lastReadAt,
          lastDeliveredAt: p.lastDeliveredAt,
        })),
        lastMessage: conv.messages[0] ?? null,
        unreadCount,
      };
    });
  },

  async getOrCreateDirectConversation(userId: string, targetUserId: string) {
    if (targetUserId === userId) {
      throw new AppError(
        "Vous ne pouvez pas démarrer une conversation avec vous-même",
        400,
        "INVALID_TARGET",
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, status: true },
    });
    if (!targetUser || targetUser.status !== "Actif") {
      throw new AppError("Utilisateur introuvable", 404, "USER_NOT_FOUND");
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: { every: { userId: { in: [userId, targetUserId] } } },
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: { participants: PARTICIPANT_INCLUDE },
    });

    if (existing && existing.participants.length === 2) {
      return { ...existing, participants: mapParticipants(existing.participants) };
    }

    const created = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        createdById: userId,
        participants: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
      include: { participants: PARTICIPANT_INCLUDE },
    });

    return { ...created, participants: mapParticipants(created.participants) };
  },

  async createGroupConversation(
    userId: string,
    name: string,
    memberIds: string[],
  ) {
    const uniqueIds = Array.from(new Set([userId, ...memberIds]));

    const members = await prisma.user.findMany({
      where: { id: { in: uniqueIds }, status: "Actif" },
      select: { id: true },
    });
    if (members.length !== uniqueIds.length) {
      throw new AppError(
        "Un ou plusieurs membres sélectionnés sont introuvables",
        404,
        "USER_NOT_FOUND",
      );
    }

    const created = await prisma.conversation.create({
      data: {
        type: "GROUP",
        name,
        createdById: userId,
        participants: {
          create: uniqueIds.map((id) => ({ userId: id })),
        },
      },
      include: { participants: PARTICIPANT_INCLUDE },
    });

    return { ...created, participants: mapParticipants(created.participants) };
  },

  async getMessages(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 40,
  ) {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      throw new AppError("Vous n'êtes pas membre de cette conversation", 403, "FORBIDDEN");
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, role: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Récupérer ces messages prouve qu'ils ont atteint l'appareil de l'utilisateur
    await MessageService.markDelivered(conversationId, userId);

    return messages.reverse();
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });

    if (!participant) {
      throw new AppError("Vous n'êtes pas membre de cette conversation", 403, "FORBIDDEN");
    }

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: { conversationId, senderId, content },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, role: true, avatar: true },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  },

  async sendAttachment(
    conversationId: string,
    senderId: string,
    data: {
      url: string;
      type: "PHOTO" | "DOCUMENT" | "VOICE";
      fileName: string;
      fileSize: number;
      caption?: string;
    },
  ) {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });

    if (!participant) {
      throw new AppError("Vous n'êtes pas membre de cette conversation", 403, "FORBIDDEN");
    }

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId,
          content: data.caption?.trim() ?? "",
          attachmentUrl: data.url,
          attachmentType: data.type,
          fileName: data.fileName,
          fileSize: data.fileSize,
        },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, role: true, avatar: true },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  },

  async markAsRead(conversationId: string, userId: string): Promise<Date> {
    const now = new Date();
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: now },
    });
    return now;
  },

  async markDelivered(conversationId: string, userId: string): Promise<Date> {
    const now = new Date();
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastDeliveredAt: now },
    });
    return now;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const participants = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    if (participants.length === 0) return 0;

    return prisma.message.count({
      where: {
        deletedAt: null,
        senderId: { not: userId },
        OR: participants.map((p) => ({
          conversationId: p.conversationId,
          ...(p.lastReadAt ? { createdAt: { gt: p.lastReadAt } } : {}),
        })),
      },
    });
  },

  async getUsers(currentUserId: string, search?: string) {
    return prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        status: "Actif",
        ...(search
          ? {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      take: 50,
    });
  },
};
