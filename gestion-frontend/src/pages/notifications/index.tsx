// pages/notifications/index.tsx
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const {
    getNotificationsByUser,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotificationStore();

  const notifications = userId ? getNotificationsByUser(userId) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "GRADE_APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "GRADE_REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userId) {
    return <div>Connectez-vous pour voir vos notifications</div>;
  }

  <div className="container mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          {unreadCount} non lue{unreadCount > 1 ? "s" : ""} sur{" "}
          {notifications.length} notification
          {notifications.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
        <Button variant="outline" onClick={() => clearNotifications(userId)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Tout supprimer
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Historique des notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium">Aucune notification</h3>
            <p className="text-gray-600">
              Vous n'avez pas encore de notifications
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.read
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                            className="h-7 text-xs"
                          >
                            Marquer comme lu
                          </Button>
                        )}
                      </div>
                    </div>
                    {notification.data && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>;
}
