import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Users, MessageSquare } from "lucide-react";
import api from "@/services/api";
import { MessageUser } from "@/store/messageStore";

interface Props {
  open: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
  createDirect: (targetUserId: string) => Promise<{ id: string }>;
  createGroup: (name: string, memberIds: string[]) => Promise<{ id: string }>;
}

const ROLE_LABELS: Record<string, string> = {
  Admin: "Admin",
  Directeur: "Directeur",
  Secretaire: "Secrétaire",
  Comptable: "Comptable",
  Professeur: "Professeur",
  Student: "Élève",
  Parent: "Parent",
};

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-red-100 text-red-700",
  Directeur: "bg-purple-100 text-purple-700",
  Secretaire: "bg-blue-100 text-blue-700",
  Comptable: "bg-green-100 text-green-700",
  Professeur: "bg-amber-100 text-amber-700",
  Student: "bg-sky-100 text-sky-700",
  Parent: "bg-pink-100 text-pink-700",
};

const initials = (u: MessageUser) => `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();

function UserRow({ user, action }: { user: MessageUser; action: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials(user)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.firstName} {user.lastName}
        </p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-700"}`}
        >
          {ROLE_LABELS[user.role] ?? user.role}
        </span>
      </div>
      {action}
    </div>
  );
}

export function NewConversationModal({
  open,
  onClose,
  onConversationCreated,
  createDirect,
  createGroup,
}: Props) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<MessageUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<MessageUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/messages/users", { params: { search } });
        setUsers(data.data);
      } catch {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [search, open]);

  const reset = () => {
    setSearch("");
    setGroupName("");
    setSelectedUsers([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleStartDirect = async (user: MessageUser) => {
    setLoading(true);
    try {
      const conv = await createDirect(user.id);
      handleClose();
      onConversationCreated(conv.id);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (user: MessageUser) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    setLoading(true);
    try {
      const conv = await createGroup(
        groupName.trim(),
        selectedUsers.map((u) => u.id),
      );
      handleClose();
      onConversationCreated(conv.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="direct">
          <TabsList className="w-full">
            <TabsTrigger value="direct" className="flex-1 gap-2">
              <MessageSquare className="h-4 w-4" />
              Message direct
            </TabsTrigger>
            <TabsTrigger value="group" className="flex-1 gap-2">
              <Users className="h-4 w-4" />
              Groupe
            </TabsTrigger>
          </TabsList>

          {/* Direct */}
          <TabsContent value="direct" className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {users.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Aucun utilisateur trouvé
                </p>
              )}
              {users.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleStartDirect(u)}
                    >
                      Écrire
                    </Button>
                  }
                />
              ))}
            </div>
          </TabsContent>

          {/* Group */}
          <TabsContent value="group" className="mt-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="group-name">Nom du groupe</Label>
              <Input
                id="group-name"
                placeholder="Ex : Réunion profs de maths"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedUsers.map((u) => (
                  <Badge key={u.id} variant="secondary" className="gap-1">
                    {u.firstName} {u.lastName}
                    <button
                      onClick={() => toggleUser(u)}
                      className="ml-0.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Ajouter des membres..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1">
              {users.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6">
                  Aucun utilisateur trouvé
                </p>
              )}
              {users.map((u) => {
                const selected = !!selectedUsers.find((s) => s.id === u.id);
                return (
                  <UserRow
                    key={u.id}
                    user={u}
                    action={
                      <Button
                        size="sm"
                        variant={selected ? "default" : "outline"}
                        onClick={() => toggleUser(u)}
                      >
                        {selected ? "Retiré" : "Ajouter"}
                      </Button>
                    }
                  />
                );
              })}
            </div>

            <Button
              className="w-full"
              disabled={loading || !groupName.trim() || selectedUsers.length === 0}
              onClick={handleCreateGroup}
            >
              Créer le groupe ({selectedUsers.length} membres)
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
