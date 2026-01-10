// store/notificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type NotificationType =
  | "GRADE_SUBMITTED"
  | "GRADE_APPROVED"
  | "GRADE_REJECTED"
  | "BULK_GRADES_SUBMITTED";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string; // ID du destinataire
  data?: any;
  read: boolean;
  createdAt: string;
  priority?: "low" | "medium" | "high";
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCountByUser: (userId: string) => number;
  clearNotifications: (userId?: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        // Afficher une notification toast pour l'utilisateur courant
        if (typeof window !== "undefined") {
          const currentUserId = localStorage.getItem("currentUserId");
          if (currentUserId === newNotification.userId) {
            showNotificationToast(newNotification);
          }
        }

        return newNotification;
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      getNotificationsByUser: (userId) => {
        return get()
          .notifications.filter((notif) => notif.userId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getUnreadCountByUser: (userId) => {
        return get().notifications.filter(
          (notif) => notif.userId === userId && !notif.read
        ).length;
      },

      clearNotifications: (userId) => {
        if (userId) {
          set((state) => ({
            notifications: state.notifications.filter(
              (notif) => notif.userId !== userId
            ),
          }));
        } else {
          set({ notifications: [], unreadCount: 0 });
        }
      },
    }),
    {
      name: "notifications-store",
    }
  )
);

// Helper pour afficher les toasts
const showNotificationToast = (notification: Notification) => {
  const toastConfig: any = {
    description: notification.message,
    duration: 8000,
  };

  switch (notification.type) {
    case "GRADE_APPROVED":
      toast.success(notification.title, {
        ...toastConfig,
        action: {
          label: "Voir",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_SUBMITTED":
      toast.info(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_REJECTED":
      toast.error(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Corriger",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "BULK_GRADES_SUBMITTED":
      toast.warning(notification.title, {
        ...toastConfig,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;
  }
};

const handleNotificationClick = (notification: Notification) => {
  switch (notification.type) {
    case "GRADE_SUBMITTED":
    case "BULK_GRADES_SUBMITTED":
      // Rediriger l'admin vers les notes en attente
      window.open("/admin/grades?filter=submitted", "_blank");
      break;

    case "GRADE_REJECTED":
      // Rediriger le professeur vers ses notes rejetées
      window.open("/professor/grades?filter=rejected", "_blank");
      break;

    case "GRADE_APPROVED":
      // Rediriger vers les notes approuvées
      window.open("/professor/grades?filter=approved", "_blank");
      break;
  }
};
