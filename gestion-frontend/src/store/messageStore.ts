import { create } from "zustand";
import api from "@/services/api";

export interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string | null;
}

export type AttachmentType = "PHOTO" | "DOCUMENT" | "VOICE";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string | null;
  attachmentType?: AttachmentType | null;
  fileName?: string | null;
  fileSize?: number | null;
  createdAt: string;
  sender: MessageUser;
}

export interface ConversationParticipant extends MessageUser {
  userId: string;
  lastReadAt?: string | null;
  lastDeliveredAt?: string | null;
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string | null;
  updatedAt: string;
  participants: ConversationParticipant[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  totalUnread: number;
  loading: boolean;
  messagesLoading: boolean;
  onlineUserIds: Set<string>;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string, cursor?: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  createDirectConversation: (targetUserId: string) => Promise<Conversation>;
  createGroupConversation: (name: string, memberIds: string[]) => Promise<Conversation>;
  markAsRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  sendAttachment: (conversationId: string, file: File, caption?: string) => Promise<Message>;
  incrementUnread: (conversationId: string, senderId: string, currentUserId?: string) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;
  updateParticipantStatus: (
    conversationId: string,
    userId: string,
    status: { lastReadAt?: string; lastDeliveredAt?: string },
  ) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  totalUnread: 0,
  loading: false,
  messagesLoading: false,
  onlineUserIds: new Set(),

  fetchConversations: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/messages/conversations");
      const conversations: Conversation[] = data.data;
      const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      set({ conversations, totalUnread });
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (conversationId, cursor) => {
    set({ messagesLoading: true });
    try {
      const params = cursor ? { cursor } : {};
      const { data } = await api.get(`/messages/conversations/${conversationId}/messages`, { params });
      const newMessages: Message[] = data.data;
      set((state) => {
        const existing = state.messages[conversationId] ?? [];
        const merged = cursor ? [...newMessages, ...existing] : newMessages;
        return { messages: { ...state.messages, [conversationId]: merged } };
      });
    } finally {
      set({ messagesLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await api.get("/messages/unread-count");
      set({ totalUnread: data.data.count });
    } catch {
      // silently ignore
    }
  },

  createDirectConversation: async (targetUserId) => {
    const { data } = await api.post("/messages/conversations", { type: "DIRECT", targetUserId });
    const conv = data.data as Conversation;
    set((state) => {
      const exists = state.conversations.find((c) => c.id === conv.id);
      return {
        conversations: exists
          ? state.conversations
          : [{ ...conv, unreadCount: 0, lastMessage: null }, ...state.conversations],
      };
    });
    return conv;
  },

  createGroupConversation: async (name, memberIds) => {
    const { data } = await api.post("/messages/conversations", { type: "GROUP", name, memberIds });
    const conv = data.data as Conversation;
    set((state) => ({
      conversations: [{ ...conv, unreadCount: 0, lastMessage: null }, ...state.conversations],
    }));
    return conv;
  },

  markAsRead: async (conversationId) => {
    await api.patch(`/messages/conversations/${conversationId}/read`);
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      );
      const totalUnread = updated.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      return { conversations: updated, totalUnread };
    });
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      const alreadyExists = existing.some((m) => m.id === message.id);
      const updatedMessages = alreadyExists ? existing : [...existing, message];

      const updatedConversations = state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return { ...c, lastMessage: message, updatedAt: message.createdAt };
      });
      updatedConversations.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
        conversations: updatedConversations,
      };
    });
  },

  sendAttachment: async (conversationId, file, caption) => {
    const formData = new FormData();
    formData.append("file", file);
    if (caption?.trim()) formData.append("caption", caption.trim());
    const { data } = await api.post(
      `/messages/conversations/${conversationId}/attachment`,
      formData,
    );
    const message = data.data as Message;
    get().addMessage(conversationId, message);
    return message;
  },

  incrementUnread: (conversationId, senderId, currentUserId) => {
    const { activeConversationId } = get();
    if (activeConversationId === conversationId) return;
    if (currentUserId && senderId === currentUserId) return;

    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c,
      );
      const totalUnread = updated.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      return { conversations: updated, totalUnread };
    });
  },

  setUserOnline: (userId) => {
    set((state) => ({ onlineUserIds: new Set(state.onlineUserIds).add(userId) }));
  },

  setUserOffline: (userId) => {
    set((state) => {
      const updated = new Set(state.onlineUserIds);
      updated.delete(userId);
      return { onlineUserIds: updated };
    });
  },

  setOnlineUsers: (userIds) => {
    set((state) => {
      const updated = new Set(state.onlineUserIds);
      userIds.forEach((id) => updated.add(id));
      return { onlineUserIds: updated };
    });
  },

  updateParticipantStatus: (conversationId, userId, status) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          participants: c.participants.map((p) =>
            p.userId === userId ? { ...p, ...status } : p,
          ),
        };
      }),
    }));
  },
}));
