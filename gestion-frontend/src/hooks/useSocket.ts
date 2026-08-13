import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

let socketInstance: Socket | null = null;

export function useSocket() {
  const { token, isAuthenticated, user } = useAuthStore();
  const {
    addMessage,
    incrementUnread,
    fetchUnreadCount,
    setUserOnline,
    setUserOffline,
    setOnlineUsers,
    updateParticipantStatus,
  } = useMessageStore();
  const initialized = useRef(false);

  const getSocket = useCallback((): Socket | null => socketInstance, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketInstance?.emit("join_conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketInstance?.emit("leave_conversation", conversationId);
  }, []);

  const sendMessage = useCallback(
    (
      conversationId: string,
      content: string,
    ): Promise<{ success: boolean; message?: any; error?: string }> => {
      return new Promise((resolve) => {
        if (!socketInstance?.connected) {
          resolve({ success: false, error: "Non connecté" });
          return;
        }
        socketInstance.emit("send_message", { conversationId, content }, resolve);
      });
    },
    [],
  );

  const emitTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketInstance?.emit("typing", { conversationId, isTyping });
  }, []);

  const onTyping = useCallback(
    (handler: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => {
      socketInstance?.on("user_typing", handler);
      return () => socketInstance?.off("user_typing", handler);
    },
    [],
  );

  const userIdRef = useRef<string | undefined>(undefined);
  userIdRef.current = user?.id;

  useEffect(() => {
    if (!isAuthenticated || !token || initialized.current) return;

    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on("new_message", ({ conversationId, message }) => {
      addMessage(conversationId, message);
      incrementUnread(conversationId, message.sender.id, userIdRef.current);
      // Acknowledge delivery for messages from others
      if (message.sender.id !== userIdRef.current) {
        socketInstance?.emit("ack_delivered", { conversationId, messageId: message.id });
      }
    });

    socketInstance.on(
      "message_status",
      ({
        conversationId,
        userId,
        lastReadAt,
        lastDeliveredAt,
      }: {
        conversationId: string;
        userId: string;
        lastReadAt?: string;
        lastDeliveredAt?: string;
      }) => {
        updateParticipantStatus(conversationId, userId, { lastReadAt, lastDeliveredAt });
      },
    );

    socketInstance.on("user_online", ({ userId }: { userId: string }) => {
      setUserOnline(userId);
    });

    socketInstance.on("user_offline", ({ userId }: { userId: string }) => {
      setUserOffline(userId);
    });

    socketInstance.on(
      "online_status",
      ({ onlineUserIds }: { conversationId: string; onlineUserIds: string[] }) => {
        setOnlineUsers(onlineUserIds);
      },
    );

    initialized.current = true;
    fetchUnreadCount();

    return () => {
      // Don't disconnect on unmount — keep socket alive across routes
    };
  }, [
    isAuthenticated,
    token,
    addMessage,
    incrementUnread,
    fetchUnreadCount,
    setUserOnline,
    setUserOffline,
    setOnlineUsers,
    updateParticipantStatus,
  ]);

  // Disconnect when user logs out
  useEffect(() => {
    if (!isAuthenticated && socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      initialized.current = false;
    }
  }, [isAuthenticated]);

  return { getSocket, joinConversation, leaveConversation, sendMessage, emitTyping, onTyping };
}
