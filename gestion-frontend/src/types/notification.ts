// types/notification.ts
export type NotificationType =
  | "GRADE_TO_VALIDATE"
  | "GRADE_APPROVED"
  | "GRADE_REJECTED"
  | "SYSTEM_ALERT";

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
