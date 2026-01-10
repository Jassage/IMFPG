import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Key,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { User } from "../types/academic";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Schéma de validation avec Zod
const userSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" })
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
        message: "Le prénom contient des caractères invalides",
      }),
    lastName: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
        message: "Le nom contient des caractères invalides",
      }),
    email: z.string().email({ message: "Adresse email invalide" }),
    phone: z
      .string()
      .regex(/^(\+\d{1,3})?[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/, {
        message: "Numéro de téléphone invalide",
      })
      .optional()
      .or(z.literal("")),
    role: z.enum([
      "Admin",
      "Professeur",
      "Secretaire",
      "Directeur",
      "Student",
      "Comptable",
    ]),
    status: z.enum(["Actif", "Inactif"]),
    password: z
      .union([
        z.string().min(6, {
          message: "Le mot de passe doit contenir au moins 6 caractères",
        }),
        z.string().length(0), // Permettre une chaîne vide (pour l'édition)
      ])
      .optional(),
  })
  .refine((data) => {
    // Pour la création, le mot de passe est requis
    return true; // Cette validation sera gérée dans le composant
  });

type UserFormData = z.infer<typeof userSchema>;

export const UsersManager = () => {
  const {
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    hardDeleteUser,
    getUserDependencies,
    updateUserRole,
    activateUser,
    resetPassword,
    loading,
    error,
    filters,
    setFilters,
  } = useUserStore();

  // If the store doesn't expose totalPages, derive it from users length and an optional pageSize in filters
  const pageSize = (filters as any)?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // États pour les dialogues de confirmation
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [statusReason, setStatusReason] = useState<string>("");
  const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false);
  const [dependencies, setDependencies] = useState<any>(null);
  const [showDependenciesDialog, setShowDependenciesDialog] = useState(false);

  // Initialisation du formulaire avec react-hook-form et zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Comptable",
      status: "Actif",
      password: "",
    },
    mode: "onChange",
  });

  const isEditing = !!editingUser;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, filters]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value, page: 1 }); // Reset à la page 1 lors d'une recherche
  };

  const getAvailableRoles = () => {
    if (currentUser?.role === "Admin") {
      return [
        "Admin",
        "Directeur",
        "Professeur",
        "Secretaire",
        "Student",
        "Comptable",
      ];
    }
    if (currentUser?.role === "Directeur") {
      return ["Professeur", "Secretaire", "Student", "Comptable"];
    }
    if (currentUser?.role === "Secretaire") {
      return ["Student", "Comptable"];
    }
    return [];
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("phone", user.phone || "");
    setValue("role", user.role);
    setValue("status", user.status);
    setValue("password", ""); // On ne remplit pas le mot de passe pour l'édition
    setIsFormOpen(true);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEditingUser(null);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Comptable",
      status: "Actif",
      password: "",
    });
  };

  // Soumission du formulaire
  const onSubmit = async (data: UserFormData) => {
    try {
      // Validation supplémentaire pour le mot de passe lors de la création
      if (!isEditing && (!data.password || data.password.length < 6)) {
        toast({
          title: "Erreur",
          description:
            "Le mot de passe est requis et doit contenir au moins 6 caractères",
          variant: "destructive",
        });
        return;
      }

      if (isEditing) {
        // Mise à jour d'un utilisateur existant
        await updateUser(editingUser!.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role as User["role"],
          status: data.status,
          // Ne pas envoyer le mot de passe s'il est vide
          ...(data.password ? { password: data.password } : {}),
        });

        toast({
          title: "Utilisateur mis à jour",
          description: `L'utilisateur ${data.firstName} ${data.lastName} a été modifié avec succès`,
        });
      } else {
        // Création d'un nouvel utilisateur
        await createUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role as User["role"],
          status: data.status,
          password: data.password!,
          avatar: "",
        });

        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${data.firstName} ${data.lastName} a été ajouté avec succès`,
        });
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast({
        title: "Désactivation réussie",
        description: "L'utilisateur a été désactivé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la désactivation",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      await updateUserStatus(selectedUser.id, newStatus, statusReason);
      toast({
        title: "Statut modifié",
        description: `Le statut a été changé en ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de la modification du statut",
        variant: "destructive",
      });
    } finally {
      setShowStatusDialog(false);
      setSelectedUser(null);
      setNewStatus("");
      setStatusReason("");
    }
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole(selectedUser.id, newRole);
      toast({
        title: "Rôle modifié",
        description: `Le rôle a été changé en ${newRole}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification du rôle",
        variant: "destructive",
      });
    } finally {
      setShowRoleDialog(false);
      setSelectedUser(null);
      setNewRole("");
    }
  };

  const confirmResetPassword = async () => {
    if (!selectedUser) return;

    try {
      await resetPassword(selectedUser.id);
      toast({
        title: "Réinitialisation envoyée",
        description:
          "Un email de réinitialisation a été envoyé à l'utilisateur",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de l'envoi de la réinitialisation",
        variant: "destructive",
      });
    } finally {
      setShowResetPasswordDialog(false);
      setSelectedUser(null);
    }
  };

  const activateSelectedUser = async (user: User) => {
    try {
      await activateUser(user.id);
      toast({
        title: "Utilisateur réactivé",
        description: "L'utilisateur a été réactivé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la réactivation",
        variant: "destructive",
      });
    }
  };

  const handleSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Trier les utilisateurs
  const sortedUsers = [...filteredUsers];
  if (sortConfig !== null) {
    sortedUsers.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Directeur":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Professeur":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Secretaire":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Student":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Comptable":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Actif":
        return "default";
      case "Inactif":
        return "secondary";
      default:
        return "outline";
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof User }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const checkDependencies = async (userId: string) => {
    try {
      const deps = await getUserDependencies(userId);
      setDependencies(deps);
      setShowDependenciesDialog(true);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de la vérification des dépendances",
        variant: "destructive",
      });
    }
  };

  const confirmHardDelete = async () => {
    if (!selectedUser) return;

    try {
      await hardDeleteUser(selectedUser.id);
      toast({
        title: "Suppression réussie",
        description: "L'utilisateur a été supprimé définitivement",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setShowHardDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const canManageUser = (user: User) => {
    if (!currentUser) return false;

    // Un utilisateur ne peut pas se modifier lui-même
    if (user.id === currentUser.id) return false;

    // Logique de hiérarchie des rôles
    const roleHierarchy = {
      Admin: 5,
      Directeur: 4,
      Secretaire: 3,
      Professeur: 2,
      Comptable: 1,
      Student: 0,
    };

    return (
      roleHierarchy[currentUser.role as keyof typeof roleHierarchy] >
      roleHierarchy[user.role as keyof typeof roleHierarchy]
    );
  };

  if (loading && users.length === 0)
    return <div className="flex justify-center p-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Dialogues de confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désactiver l'utilisateur{" "}
              {selectedUser?.firstName} {selectedUser?.lastName} ? L'utilisateur
              ne pourra plus se connecter mais ses données seront conservées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Désactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le statut</AlertDialogTitle>
            <AlertDialogDescription>
              Changer le statut de {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label htmlFor="reason">Raison (optionnel)</Label>
              <Textarea
                id="reason"
                placeholder="Raison du changement de statut..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Modifier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le rôle</AlertDialogTitle>
            <AlertDialogDescription>
              Changer le rôle de {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableRoles().map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Modifier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le mot de passe</AlertDialogTitle>
            <AlertDialogDescription>
              Envoyer un email de réinitialisation de mot de passe à{" "}
              {selectedUser?.firstName} {selectedUser?.lastName} ? Un lien de
              réinitialisation sera envoyé à {selectedUser?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>
              Envoyer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showHardDeleteDialog}
        onOpenChange={setShowHardDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer définitivement</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              ⚠️ ACTION IRREVERSIBLE
            </AlertDialogDescription>
            <AlertDialogDescription>
              Êtes-vous ABSOLUMENT sûr de vouloir supprimer définitivement{" "}
              {selectedUser?.firstName} {selectedUser?.lastName} ?
              <br />
              <strong>
                Toutes les données seront PERDUES et ne pourront pas être
                récupérées.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHardDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={showDependenciesDialog}
        onOpenChange={setShowDependenciesDialog}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dépendances de l'utilisateur</DialogTitle>
          </DialogHeader>
          {dependencies ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cet utilisateur a des données associées qui doivent être gérées
                avant suppression.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(dependencies, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>
              Aucune dépendance trouvée. Vous pouvez supprimer cet utilisateur.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* En-tête */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={resetForm}
              disabled={getAvailableRoles().length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser
                  ? "Modifier Utilisateur"
                  : "Ajouter un utilisateur"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Prénom"
                    className={cn(errors.firstName && "border-red-500")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Nom"
                    className={cn(errors.lastName && "border-red-500")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Téléphone"
                  className={cn(errors.phone && "border-red-500")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Mot de passe"
                    className={cn(errors.password && "border-red-500")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 caractères
                  </p>
                </div>
              )}
              {editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Laissez vide pour ne pas changer"
                    className={cn(errors.password && "border-red-500")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour conserver l'actuel
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Rôle <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("role")}
                  onValueChange={(value: User["role"]) =>
                    setValue("role", value)
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRoles().map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  Statut <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value: User["status"]) =>
                    setValue("status", value)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sticky bottom-0 bg-background pb-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFormOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Traitement..."
                    : editingUser
                    ? "Modifier"
                    : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.role || "all"}
            onValueChange={(value) =>
              setFilters({ role: value === "all" ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger className="w-[150px]">
              <Shield className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Directeur">Directeur</SelectItem>
              <SelectItem value="Professeur">Professeur</SelectItem>
              <SelectItem value="Secretaire">Secrétaire</SelectItem>
              <SelectItem value="Student">Élève</SelectItem>
              <SelectItem value="Comptable">Comptable</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              setFilters({
                status: value === "all" ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <UserCheck className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center">
                      <span>Utilisateur</span>
                      <SortIcon columnKey="firstName" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      <SortIcon columnKey="email" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center">
                      <span>Rôle</span>
                      <SortIcon columnKey="role" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      <span>Statut</span>
                      <SortIcon columnKey="status" />
                    </div>
                  </TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.firstName?.[0] || "U"}
                              {user.lastName?.[0] || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                              {user.id === currentUser?.id && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Vous
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || "Non renseigné"}</TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Jamais"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!canManageUser(user)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(user)}
                              disabled={!canManageUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>

                            {user.status === "Inactif" ? (
                              <DropdownMenuItem
                                onClick={() => activateSelectedUser(user)}
                                disabled={!canManageUser(user)}
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Réactiver
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowStatusDialog(true);
                                }}
                                disabled={!canManageUser(user)}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Changer statut
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleDialog(true);
                              }}
                              disabled={!canManageUser(user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Changer rôle
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowResetPasswordDialog(true);
                              }}
                              disabled={!canManageUser(user)}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Réinitialiser mot de passe
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600"
                              disabled={!canManageUser(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Désactiver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                checkDependencies(user.id);
                              }}
                              className="text-yellow-600"
                              disabled={!canManageUser(user)}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Vérifier dépendances
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowHardDeleteDialog(true);
                              }}
                              className="text-red-600"
                              disabled={!canManageUser(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer définitivement
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <UserCheck className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-muted-foreground">
                          Aucun utilisateur trouvé
                        </p>
                        {searchTerm && (
                          <Button
                            variant="link"
                            onClick={() => {
                              setSearchTerm("");
                              setFilters({ search: "" });
                            }}
                          >
                            Réinitialiser la recherche
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {sortedUsers.length} utilisateur
            {sortedUsers.length > 1 ? "s" : ""}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: (filters.page || 1) - 1 })}
              disabled={(filters.page || 1) === 1}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={
                      (filters.page || 1) === pageNumber ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilters({ page: pageNumber })}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-2">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: (filters.page || 1) + 1 })}
              disabled={(filters.page || 1) >= totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
