import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Send,
  Users,
  ArrowLeft,
  Loader2,
  Paperclip,
  Mic,
  MicOff,
  FileText,
  Check,
  CheckCheck,
  Download,
} from "lucide-react";
import { Conversation, Message, useMessageStore } from "@/store/messageStore";
import { useAuthStore } from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  conversation: Conversation;
  onBack?: () => void;
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { label: string; messages: Message[] }[] = [];
  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    let label = format(date, "d MMMM yyyy", { locale: fr });
    if (isToday(date)) label = "Aujourd'hui";
    else if (isYesterday(date)) label = "Hier";

    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.messages.push(msg);
    } else {
      groups.push({ label, messages: [msg] });
    }
  }
  return groups;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ChatWindow({ conversation, onBack }: Props) {
  const { user } = useAuthStore();
  const {
    messages,
    fetchMessages,
    markAsRead,
    messagesLoading,
    addMessage,
    onlineUserIds,
    sendAttachment,
  } = useMessageStore();
  const { joinConversation, leaveConversation, sendMessage, emitTyping, onTyping } = useSocket();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const othersTypingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const convMessages = messages[conversation.id] ?? [];

  const otherParticipants = conversation.participants.filter((p) => p.userId !== user?.id);

  const conversationName =
    conversation.type === "GROUP"
      ? (conversation.name ?? "Groupe")
      : otherParticipants[0]
        ? `${otherParticipants[0].firstName} ${otherParticipants[0].lastName}`
        : "Conversation";

  const conversationInitials =
    conversation.type === "GROUP"
      ? "GR"
      : otherParticipants[0]
        ? `${otherParticipants[0].firstName[0]}${otherParticipants[0].lastName[0]}`.toUpperCase()
        : "??";

  const isOnline =
    conversation.type === "DIRECT" &&
    !!otherParticipants[0] &&
    onlineUserIds.has(otherParticipants[0].userId);

  const othersTyping = useMemo(
    () =>
      conversation.participants
        .filter((p) => typingUserIds.has(p.userId))
        .map((p) => p.firstName),
    [typingUserIds, conversation.participants],
  );

  const getMessageStatus = useCallback(
    (msg: Message): "sent" | "delivered" | "read" => {
      if (msg.senderId !== user?.id) return "sent";

      const others = conversation.participants.filter((p) => p.userId !== user?.id);
      if (others.length === 0) return "sent";

      const msgTime = new Date(msg.createdAt).getTime();
      const allRead = others.every(
        (p) => p.lastReadAt && new Date(p.lastReadAt).getTime() >= msgTime,
      );
      if (allRead) return "read";

      const allDelivered = others.every(
        (p) => p.lastDeliveredAt && new Date(p.lastDeliveredAt).getTime() >= msgTime,
      );
      if (allDelivered) return "delivered";

      return "sent";
    },
    [conversation.participants, user?.id],
  );

  useEffect(() => {
    joinConversation(conversation.id);
    fetchMessages(conversation.id);
    markAsRead(conversation.id);

    return () => {
      leaveConversation(conversation.id);
    };
  }, [conversation.id]);

  useEffect(() => {
    const unsubscribe = onTyping(({ conversationId: cId, userId, isTyping: typing }) => {
      if (cId !== conversation.id || userId === user?.id) return;

      setTypingUserIds((prev) => {
        const next = new Set(prev);
        if (typing) next.add(userId);
        else next.delete(userId);
        return next;
      });

      if (othersTypingTimers.current[userId]) clearTimeout(othersTypingTimers.current[userId]);
      if (typing) {
        othersTypingTimers.current[userId] = setTimeout(() => {
          setTypingUserIds((prev) => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
        }, 3000);
      }
    });

    return () => {
      unsubscribe();
      Object.values(othersTypingTimers.current).forEach(clearTimeout);
      othersTypingTimers.current = {};
      setTypingUserIds(new Set());
    };
  }, [conversation.id, user?.id, onTyping]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");
    try {
      const result = await sendMessage(conversation.id, content);
      if (result.success && result.message) {
        addMessage(conversation.id, result.message);
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      emitTyping(conversation.id, true);
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
      emitTyping(conversation.id, false);
    }, 1500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSending(true);
    try {
      await sendAttachment(conversation.id, file);
    } finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `vocal-${Date.now()}.webm`, { type: "audio/webm" });
        setSending(true);
        try {
          await sendAttachment(conversation.id, file);
        } finally {
          setSending(false);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const groups = groupMessagesByDate(convMessages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b bg-background/95 backdrop-blur">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="relative flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback
              className={cn(
                "text-xs font-semibold",
                conversation.type === "GROUP"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-primary/10 text-primary",
              )}
            >
              {conversation.type === "GROUP" ? (
                <Users className="h-4 w-4" />
              ) : (
                conversationInitials
              )}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{conversationName}</p>
          {conversation.type === "GROUP" ? (
            <p className="text-xs text-muted-foreground">
              {conversation.participants.length} membres
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{isOnline ? "En ligne" : "Hors ligne"}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messagesLoading && convMessages.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!messagesLoading && convMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <p className="text-sm">Aucun message. Démarrez la conversation !</p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground font-medium px-2">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {group.messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              const senderName = `${msg.sender.firstName} ${msg.sender.lastName}`;
              const status = isMe ? getMessageStatus(msg) : null;

              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", isMe ? "flex-row-reverse" : "flex-row")}
                >
                  {!isMe && (
                    <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                      <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                        {`${msg.sender.firstName[0]}${msg.sender.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] space-y-1",
                      isMe ? "items-end" : "items-start",
                      "flex flex-col",
                    )}
                  >
                    {conversation.type === "GROUP" && !isMe && (
                      <span className="text-[11px] font-medium text-muted-foreground px-1">
                        {senderName}
                      </span>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl text-sm leading-relaxed overflow-hidden",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm",
                        msg.attachmentType ? "p-1.5" : "px-3.5 py-2",
                      )}
                    >
                      {/* Attachment rendering */}
                      {msg.attachmentType === "PHOTO" && msg.attachmentUrl && (
                        <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={msg.attachmentUrl}
                            alt={msg.fileName ?? "Photo"}
                            className="max-w-[240px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            loading="lazy"
                          />
                        </a>
                      )}
                      {msg.attachmentType === "DOCUMENT" && msg.attachmentUrl && (
                        <a
                          href={msg.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-lg hover:opacity-80 transition-opacity",
                            isMe ? "bg-primary-foreground/10" : "bg-background/60",
                          )}
                        >
                          <FileText className="h-8 w-8 flex-shrink-0 opacity-70" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate max-w-[180px]">
                              {msg.fileName ?? "Document"}
                            </p>
                            {msg.fileSize != null && (
                              <p className="text-[10px] opacity-60">{formatFileSize(msg.fileSize)}</p>
                            )}
                          </div>
                          <Download className="h-4 w-4 flex-shrink-0 opacity-60" />
                        </a>
                      )}
                      {msg.attachmentType === "VOICE" && msg.attachmentUrl && (
                        <audio
                          controls
                          src={msg.attachmentUrl}
                          className="max-w-[240px] h-10 rounded"
                          style={{ minWidth: 160 }}
                        />
                      )}
                      {/* Text caption or text-only message */}
                      {msg.content && (
                        <p className={cn(msg.attachmentType ? "px-2 pb-1 pt-1 text-sm" : "")}>
                          {msg.content}
                        </p>
                      )}
                    </div>

                    {/* Timestamp + delivery/read ticks */}
                    <div
                      className={cn(
                        "flex items-center gap-1 px-1",
                        isMe ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(msg.createdAt), "HH:mm")}
                      </span>
                      {status === "read" && (
                        <CheckCheck className="h-3.5 w-3.5 text-primary" aria-label="Lu" />
                      )}
                      {status === "delivered" && (
                        <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" aria-label="Livré" />
                      )}
                      {status === "sent" && (
                        <Check className="h-3.5 w-3.5 text-muted-foreground" aria-label="Envoyé" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {othersTyping.length > 0 && (
        <div className="px-4 pb-1">
          <p className="text-xs text-muted-foreground italic">
            {othersTyping.join(", ")} est en train d'écrire...
          </p>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-destructive font-medium flex-1">
            Enregistrement… {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
            {String(recordingSeconds % 60).padStart(2, "0")}
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-2 text-xs"
            onClick={stopRecording}
          >
            <MicOff className="h-3.5 w-3.5 mr-1" />
            Envoyer
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2 items-end">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-10 w-10 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || isRecording}
            title="Joindre un fichier ou une photo"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "ghost"}
            className="h-10 w-10 flex-shrink-0"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={sending}
            title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message vocal"}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Textarea
            className="min-h-[40px] max-h-32 resize-none text-sm"
            placeholder="Écrire un message… (Entrée pour envoyer)"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={sending || isRecording}
            rows={1}
          />
          <Button
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={handleSend}
            disabled={!input.trim() || sending || isRecording}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
