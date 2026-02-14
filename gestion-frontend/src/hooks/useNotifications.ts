// hooks/useNotifications.ts - Version mise à jour
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import api from "@/services/api";

export type NotificationType =
  | "GRADE_TO_VALIDATE"
  | "SYSTEM_ALERT"
  | "USER_PENDING"
  | "BULLETIN_PENDING";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  readAt?: Date;
}

export const useNotifications = (userId?: string, userRole?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Récupérer les notes en attente RÉELLES et les convertir en notifications
  const fetchRealPendingGrades = useCallback(async () => {
    if (
      !userId ||
      !userRole ||
      (userRole !== "Admin" && userRole !== "Professeur")
    ) {
      return [];
    }

    try {
      // Récupérer toutes les notes
      const response = await api.get("/grades", {
        params: { limit: 100 },
      });

      const allGrades =
        response.data.data?.grades || response.data.grades || [];

      // Filtrer les notes en attente
      const pendingGrades = allGrades.filter(
        (grade: any) => grade.status === "Submitted" || grade.status === "Draft"
      );

      // Convertir les notes en attente en notifications
      return pendingGrades.map(
        (grade: any): Notification => ({
          id: `real-grade-${grade.id}`,
          userId: userId,
          type: "GRADE_TO_VALIDATE",
          title: "📝 Note à valider",
          message: `Nouvelle note pour ${
            grade.student?.firstName || "Étudiant"
          } ${grade.student?.lastName || ""} en ${
            grade.subject?.name || "Matière"
          }`,
          data: {
            gradeId: grade.id,
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            controlType: grade.controlType,
            grade: grade.grade,
          },
          priority: "HIGH",
          isRead: false,
          actionUrl: `/grades/${grade.id}/edit`,
          actionLabel: "Valider",
          createdAt: new Date(grade.createdAt || new Date()),
        })
      );
    } catch (error) {
      console.error("Erreur récupération notes:", error);
      return [];
    }
  }, [userId, userRole]);

  // Charger les notifications (localStorage + notes réelles)
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // 1. Charger depuis localStorage
      const saved = localStorage.getItem(`notifications_${userId}`);
      let localStorageNotifications: Notification[] = [];

      if (saved) {
        const parsed = JSON.parse(saved);
        localStorageNotifications = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          readAt: n.readAt ? new Date(n.readAt) : undefined,
        }));
      }

      // 2. Récupérer les notes en attente RÉELLES (uniquement pour admin/prof)
      const realGradeNotifications = await fetchRealPendingGrades();

      // 3. Fusionner les deux listes (éviter les doublons)
      const allNotifications = [...localStorageNotifications];

      realGradeNotifications.forEach((realNotif) => {
        // Vérifier si cette note existe déjà
        const exists = allNotifications.some(
          (n) =>
            n.id === realNotif.id ||
            (n.type === "GRADE_TO_VALIDATE" &&
              n.data?.gradeId === realNotif.data?.gradeId)
        );

        if (!exists) {
          allNotifications.push(realNotif);
        }
      });

      // 4. Trier par date (plus récent d'abord)
      const sorted = allNotifications.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setNotifications(sorted);
      setUnreadCount(sorted.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchRealPendingGrades]);

  // Créer une notification temporaire
  const createTempNotification = useCallback(
    (data: {
      title: string;
      message: string;
      type: NotificationType;
      priority?: NotificationPriority;
      actionUrl?: string;
      actionLabel?: string;
      data?: any;
    }) => {
      if (!userId) return;

      const newNotification: Notification = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        priority: data.priority || "MEDIUM",
        isRead: false,
        actionUrl: data.actionUrl,
        actionLabel: data.actionLabel,
        createdAt: new Date(),
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // Sauvegarder dans localStorage
        localStorage.setItem(
          `notifications_${userId}`,
          JSON.stringify(updated)
        );
        return updated;
      });

      setUnreadCount((prev) => prev + 1);
    },
    [userId, toast]
  );

  const markAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => {
        const updated = prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        );
        // Sauvegarder dans localStorage
        if (userId) {
          localStorage.setItem(
            `notifications_${userId}`,
            JSON.stringify(updated)
          );
        }
        return updated;
      });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [userId]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({
        ...notif,
        isRead: true,
        readAt: new Date(),
      }));
      // Sauvegarder dans localStorage
      if (userId) {
        localStorage.setItem(
          `notifications_${userId}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
    setUnreadCount(0);

    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  }, [userId, toast]);

  // Nettoyer les anciennes notifications
  const cleanupOldNotifications = useCallback(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    setNotifications((prev) => {
      const filtered = prev.filter(
        (notif) => new Date(notif.createdAt) > sevenDaysAgo
      );
      // Sauvegarder dans localStorage
      if (userId) {
        localStorage.setItem(
          `notifications_${userId}`,
          JSON.stringify(filtered)
        );
      }
      return filtered;
    });
  }, [userId]);

  // Charger initialement et régulièrement
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    // Polling toutes les minutes pour les nouvelles notes
    const interval = setInterval(fetchNotifications, 60000);

    // Nettoyer toutes les heures
    const cleanupInterval = setInterval(cleanupOldNotifications, 3600000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [userId, fetchNotifications, cleanupOldNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    createTempNotification,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    cleanupOldNotifications,
  };
};
