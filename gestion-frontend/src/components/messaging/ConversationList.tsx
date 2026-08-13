import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Users, MessageSquare } from "lucide-react";
import { Conversation, useMessageStore } from "@/store/messageStore";
import { useAuthStore } from "@/store/authStore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

function getConversationName(conv: Conversation, currentUserId: string): string {
  if (conv.type === "GROUP") return conv.name ?? "Groupe";
  const other = conv.participants.find((p) => p.userId !== currentUserId);
  if (!other) return "Conversation";
  return `${other.firstName} ${other.lastName}`;
}

function getConversationInitials(conv: Conversation, currentUserId: string): string {
  if (conv.type === "GROUP") return "GR";
  const other = conv.participants.find((p) => p.userId !== currentUserId);
  if (!other) return "??";
  return `${other.firstName[0]}${other.lastName[0]}`.toUpperCase();
}

function getConversationRole(conv: Conversation, currentUserId: string): string | null {
  if (conv.type === "GROUP") return null;
  const other = conv.participants.find((p) => p.userId !== currentUserId);
  return other?.role ?? null;
}

function getOtherUserId(conv: Conversation, currentUserId: string): string | null {
  if (conv.type === "GROUP") return null;
  const other = conv.participants.find((p) => p.userId !== currentUserId);
  return other?.userId ?? null;
}

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-red-100 text-red-700",
  Directeur: "bg-purple-100 text-purple-700",
  Secretaire: "bg-blue-100 text-blue-700",
  Comptable: "bg-green-100 text-green-700",
  Professeur: "bg-amber-100 text-amber-700",
  Student: "bg-sky-100 text-sky-700",
  Parent: "bg-pink-100 text-pink-700",
};

export function ConversationList({ conversations, activeId, onSelect, loading }: Props) {
  const { user } = useAuthStore();
  const { onlineUserIds } = useMessageStore();
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const name = getConversationName(c, user?.id ?? "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-8 text-sm"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-sm">Aucune conversation</p>
          </div>
        )}

        {filtered.map((conv) => {
          const name = getConversationName(conv, user?.id ?? "");
          const initials = getConversationInitials(conv, user?.id ?? "");
          const role = getConversationRole(conv, user?.id ?? "");
          const otherUserId = getOtherUserId(conv, user?.id ?? "");
          const isOnline = !!otherUserId && onlineUserIds.has(otherUserId);
          const isActive = conv.id === activeId;

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors",
                isActive && "bg-primary/5 border-r-2 border-primary",
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      conv.type === "GROUP"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {conv.type === "GROUP" ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      initials
                    )}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={cn("text-sm font-medium truncate", conv.unreadCount > 0 && "font-semibold")}>
                    {name}
                  </span>
                  {conv.lastMessage && (
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                        addSuffix: false,
                        locale: fr,
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage
                      ? conv.lastMessage.attachmentType === "PHOTO"
                        ? "📷 Photo"
                        : conv.lastMessage.attachmentType === "DOCUMENT"
                          ? "📄 Document"
                          : conv.lastMessage.attachmentType === "VOICE"
                            ? "🎤 Message vocal"
                            : conv.lastMessage.content || "Aucun message"
                      : "Aucun message"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 text-[11px] px-1.5 rounded-full flex-shrink-0">
                      {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                    </Badge>
                  )}
                </div>

                {role && (
                  <span
                    className={cn(
                      "inline-flex mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      ROLE_COLORS[role] ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    {role}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
