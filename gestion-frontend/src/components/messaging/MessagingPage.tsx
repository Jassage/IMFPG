import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { NewConversationModal } from "./NewConversationModal";
import { useMessageStore } from "@/store/messageStore";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
  const {
    conversations,
    fetchConversations,
    createDirectConversation,
    createGroupConversation,
    setActiveConversation,
    activeConversationId,
    loading,
  } = useMessageStore();

  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false); // Mobile: toggle panel

  useEffect(() => {
    fetchConversations();
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowChat(true);
  };

  const handleConversationCreated = (id: string) => {
    fetchConversations();
    handleSelectConversation(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Messagerie
        </h1>
        <Button size="sm" className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Nouveau
        </Button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — conversations list */}
        <div
          className={cn(
            "w-full md:w-72 lg:w-80 border-r flex flex-col overflow-hidden bg-background",
            showChat && "hidden md:flex",
          )}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            loading={loading}
          />
        </div>

        {/* Chat area */}
        <div
          className={cn(
            "flex-1 overflow-hidden",
            !showChat && "hidden md:flex",
            "flex flex-col",
          )}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onBack={() => setShowChat(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <div className="rounded-full bg-muted/50 p-6">
                <MessageSquare className="h-10 w-10 opacity-40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Sélectionnez une conversation</p>
                <p className="text-xs mt-1">
                  ou démarrez-en une nouvelle avec le bouton "Nouveau"
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewConversationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConversationCreated={handleConversationCreated}
        createDirect={createDirectConversation}
        createGroup={createGroupConversation}
      />
    </div>
  );
}
