// components/notifications/NotificationBell.tsx
import { useState, useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationBell = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  const {
    notifications,
    getNotificationsByUser,
    getUnreadCountByUser,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      const userNotifs = getNotificationsByUser(userId);
      setUserNotifications(userNotifs);
      setUnreadCount(getUnreadCountByUser(userId));
    }
  }, [userId, notifications, getNotificationsByUser, getUnreadCountByUser]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "GRADE_APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "GRADE_REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "À l'instant";
    } else if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} j`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  };

  if (!userId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-0 text-xs hover:bg-transparent"
            >
              Tout lire
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {userNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
              <p className="text-xs mt-1">
                Les nouvelles notifications apparaîtront ici
              </p>
            </div>
          ) : (
            userNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read
                    ? "bg-blue-50 dark:bg-blue-950/20"
                    : "opacity-80"
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      {!notification.read ? (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-100 dark:bg-blue-900"
                        >
                          Nouveau
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Check className="h-3 w-3" />
                          Lu
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        Marquer comme lu
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        {userNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Rediriger vers la page des notifications complète
                  window.open("/notifications", "_blank");
                }}
              >
                Voir toutes les notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
