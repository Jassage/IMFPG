import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  AlertCircle,
  Sparkles,
  Hash,
  AtSign,
  PhoneCall,
  GraduationCap,
  Award,
  ShieldAlert,
  CalendarDays,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Professeur } from "@/types/academic";
import useProfesseurStore from "@/store/professorStore";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Fonction pour générer un identifiant unique
const generateProfesseurId = (
  firstName: string,
  lastName: string,
  existingIds: string[] = []
): string => {
  if (!firstName.trim() || !lastName.trim()) return "";

  // Format: PRE-NOM-YYMMDD-XXX
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  // Créer la base du code
  const baseCode = `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}-${year}${month}${day}`;

  // Ajouter un suffixe numérique si nécessaire
  let finalCode = baseCode;
  let counter = 1;
  while (existingIds.includes(finalCode) && counter < 1000) {
    finalCode = `${baseCode}-${counter.toString().padStart(3, "0")}`;
    counter++;
  }

  return finalCode;
};

// Schéma de validation amélioré avec toutes les contraintes
const professeurSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message:
        "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets",
    })
    .refine((value) => value.trim().length > 0, {
      message: "Le prénom ne peut pas être vide",
    })
    .transform((value) => value.trim()),

  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message:
        "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets",
    })
    .refine((value) => value.trim().length > 0, {
      message: "Le nom ne peut pas être vide",
    })
    .transform((value) => value.trim()),

  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Adresse email invalide" })
    .refine(
      (email) => {
        // Vérifier le format de l'email académique
        const academicDomains = [".edu", ".ac.", "univ-", "school", "college"];
        return (
          academicDomains.some((domain) =>
            email.toLowerCase().includes(domain)
          ) || /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        );
      },
      {
        message: "Veuillez utiliser une adresse email valide",
      }
    )
    .transform((value) => value.toLowerCase().trim()),

  phone: z
    .string()
    .refine(
      (phone) => {
        if (!phone || phone.trim() === "") return true; // Optionnel

        // Nettoyer le numéro (supprimer espaces, tirets, parenthèses)
        const cleaned = phone.replace(/[\s\-()]/g, "");

        // Format Haïtien: +509xxxxxxxx (10 chiffres après +509)
        const phoneRegex = /^(\+509)\d{8}$/;

        // Vérifier longueur: +509 (4) + 8 chiffres = 12 caractères
        const isValidLength = cleaned.length === 12;
        const isValidFormat = phoneRegex.test(cleaned);

        return isValidLength && isValidFormat;
      },
      {
        message:
          "Numéro de téléphone invalide. Format: +509XXXXXXXX (ex: +50944556677)",
      }
    )
    .optional()
    .default(""),

  speciality: z
    .string()
    .min(2, { message: "La spécialité doit contenir au moins 2 caractères" })
    .max(100, { message: "La spécialité ne peut pas dépasser 100 caractères" })
    .optional()
    .default(""),

  hireDate: z
    .string()
    .refine(
      (date) => {
        if (!date || date.trim() === "") return true; // Optionnel

        const selectedDate = new Date(date);
        const today = new Date();
        const minDate = new Date("2000-01-01");

        // Vérifier que la date est valide
        if (isNaN(selectedDate.getTime())) return false;

        // Vérifier que la date n'est pas dans le futur
        if (selectedDate > today) return false;

        // Vérifier que la date est après 2000
        if (selectedDate < minDate) return false;

        return true;
      },
      {
        message: "Date invalide. Doit être entre 2000-01-01 et aujourd'hui",
      }
    )
    .optional()
    .default(""),

  status: z.enum(["Actif", "Inactif"]).default("Actif"),

  matricule: z
    .string()
    .min(3, { message: "Le matricule doit contenir au moins 3 caractères" })
    .max(20, { message: "Le matricule ne peut pas dépasser 20 caractères" })
    .regex(/^[A-Z0-9-]+$/, {
      message:
        "Le matricule ne peut contenir que des lettres majuscules, chiffres et tirets",
    })
    .optional()
    .default(""),

  address: z
    .string()
    .max(200, { message: "L'adresse ne peut pas dépasser 200 caractères" })
    .optional()
    .default(""),

  qualifications: z
    .string()
    .max(500, {
      message: "Les qualifications ne peuvent pas dépasser 500 caractères",
    })
    .optional()
    .default(""),
});

type ProfesseurFormData = z.infer<typeof professeurSchema>;

export const ProfesseursManager = () => {
  const {
    professeurs,
    fetchProfesseurs,
    fetchProfesseurById,
    createProfesseur,
    updateProfesseur,
    deleteProfesseur,
    activateProfesseur,
    deactivateProfesseur,
    loading,
    error,
    filters,
    setFilters,
  } = useProfesseurStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Professeur;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingProfesseur, setEditingProfesseur] = useState<Professeur | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedProfesseur, setSelectedProfesseur] =
    useState<Professeur | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [actionType, setActionType] = useState<"activate" | "deactivate">(
    "activate"
  );
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isGeneratingMatricule, setIsGeneratingMatricule] = useState(false);

  // Initialisation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
    trigger,
    clearErrors,
    setError,
  } = useForm<ProfesseurFormData>({
    resolver: zodResolver(professeurSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      speciality: "",
      hireDate: new Date().toISOString().split("T")[0],
      status: "Actif",
      matricule: "",
      address: "",
      qualifications: "",
    },
    mode: "onChange",
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const matriculeValue = watch("matricule");
  const phoneValue = watch("phone");

  useEffect(() => {
    fetchProfesseurs();
  }, [fetchProfesseurs, filters]);

  // Effet pour générer le matricule automatiquement
  useEffect(() => {
    if (!isFormOpen) return;

    if (!editingProfesseur && firstNameValue && lastNameValue) {
      const generatedMatricule = generateProfesseurId(
        firstNameValue,
        lastNameValue,
        professeurs.map((p) => p.matricule || "")
      );

      // Ne mettre à jour que si l'utilisateur n'a pas modifié manuellement le matricule
      if (!matriculeValue) {
        setValue("matricule", generatedMatricule, { shouldValidate: true });
      }
    }
  }, [
    firstNameValue,
    lastNameValue,
    isFormOpen,
    editingProfesseur,
    professeurs,
    setValue,
    matriculeValue,
  ]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value });
  };

  // Fonction pour formater le téléphone
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";

    const cleaned = phone.replace(/[\s\-()]/g, "");

    // Format Haïtien: +509 XX XX XX XX
    if (cleaned.startsWith("+509") && cleaned.length === 12) {
      return `+509 ${cleaned.slice(4, 6)} ${cleaned.slice(
        6,
        8
      )} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
    }

    return phone;
  };

  // Fonction pour regénérer le matricule
  const handleRegenerateMatricule = () => {
    if (!firstNameValue || !lastNameValue) {
      toast({
        title: "Attention",
        description: "Veuillez d'abord saisir le prénom et le nom",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMatricule(true);
    const newMatricule = generateProfesseurId(
      firstNameValue,
      lastNameValue,
      professeurs
        .map((p) => p.matricule || "")
        .filter((m) => m !== editingProfesseur?.matricule)
    );

    setValue("matricule", newMatricule, { shouldValidate: true });

    setTimeout(() => {
      setIsGeneratingMatricule(false);
    }, 300);
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEdit = async (professeur: Professeur) => {
    try {
      const professeurDetails = await fetchProfesseurById(professeur.id);
      setEditingProfesseur(professeurDetails);
      setFormErrors([]);

      setValue("firstName", professeurDetails.firstName);
      setValue("lastName", professeurDetails.lastName);
      setValue("email", professeurDetails.email);
      setValue("phone", professeurDetails.phone || "");
      setValue("speciality", professeurDetails.speciality || "");
      setValue("hireDate", professeurDetails.hireDate?.split("T")[0] || "");
      setValue("status", professeurDetails.status);
      setValue("matricule", professeurDetails.matricule || "");
      setValue("address", professeurDetails.address || "");
      setValue("qualifications", professeurDetails.qualifications || "");

      setIsFormOpen(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du professeur",
        variant: "destructive",
      });
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEditingProfesseur(null);
    setFormErrors([]);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      speciality: "",
      hireDate: new Date().toISOString().split("T")[0],
      status: "Actif",
      matricule: "",
      address: "",
      qualifications: "",
    });
  };

  // Vérifier si l'email est unique
  const isEmailUnique = (email: string): boolean => {
    const existingEmails = professeurs.map((p) => p.email.toLowerCase());
    if (editingProfesseur) {
      return !existingEmails.some(
        (e) =>
          e === email.toLowerCase() &&
          email.toLowerCase() !== editingProfesseur.email.toLowerCase()
      );
    }
    return !existingEmails.includes(email.toLowerCase());
  };

  // Soumission du formulaire
  const onSubmit = async (data: ProfesseurFormData) => {
    try {
      // Valider l'unicité de l'email
      if (!isEmailUnique(data.email)) {
        setError("email", {
          type: "manual",
          message: "Cette adresse email est déjà utilisée",
        });
        toast({
          title: "Email dupliqué",
          description:
            "Cette adresse email est déjà utilisée par un autre professeur",
          variant: "destructive",
        });
        return;
      }

      // Valider les données avec Zod
      const validation = professeurSchema.safeParse(data);
      if (!validation.success) {
        const errors = validation.error.errors.map((err) => err.message);
        setFormErrors(errors);
        toast({
          title: "Erreur de validation",
          description: "Veuillez corriger les erreurs dans le formulaire",
          variant: "destructive",
        });
        return;
      }

      // Préparer les données pour l'API
      const professeurData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        status: data.status,
        phone: data.phone?.trim() || undefined,
        speciality: data.speciality?.trim() || undefined,
        hireDate: data.hireDate?.trim() || undefined,
        matricule: data.matricule?.trim() || undefined,
        address: data.address?.trim() || undefined,
        qualifications: data.qualifications?.trim() || undefined,
      };

      if (editingProfesseur) {
        await updateProfesseur(editingProfesseur.id, professeurData);
        toast({
          title: "✅ Professeur mis à jour",
          description: `Le professeur ${data.firstName} ${data.lastName} a été modifié avec succès`,
        });
      } else {
        await createProfesseur(professeurData);
        toast({
          title: "✅ Professeur créé",
          description: `Le professeur ${data.firstName} ${data.lastName} a été ajouté avec succès`,
        });
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.message || "Une erreur est survenue lors de l'enregistrement";
      setFormErrors([errorMessage]);
      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedProfesseur) return;

    try {
      // Vérifier si le professeur a des assignations
      // CORRECTION: Utiliser seulement assignments puisque classes n'existe pas
      const hasAssignments = (selectedProfesseur._count?.assignments || 0) > 0;

      if (hasAssignments) {
        toast({
          title: "Impossible de supprimer",
          description:
            "Ce professeur a des cours assignés et ne peut pas être supprimé",
          variant: "destructive",
        });
        return;
      }

      await deleteProfesseur(selectedProfesseur.id);
      toast({
        title: "✅ Suppression réussie",
        description: "Le professeur a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedProfesseur(null);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedProfesseur) return;

    try {
      if (actionType === "activate") {
        await activateProfesseur(selectedProfesseur.id);
        toast({
          title: "✅ Activation réussie",
          description: "Le professeur a été activé avec succès",
        });
      } else {
        await deactivateProfesseur(selectedProfesseur.id);
        toast({
          title: "⚠️ Désactivation réussie",
          description: "Le professeur a été désactivé avec succès",
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors du changement de statut",
        variant: "destructive",
      });
    } finally {
      setShowStatusDialog(false);
      setSelectedProfesseur(null);
    }
  };

  const handleSort = (key: keyof Professeur) => {
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

  const filteredProfesseurs = useMemo(() => {
    return professeurs.filter((professeur) => {
      const matchesSearch =
        `${professeur.firstName} ${professeur.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        professeur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (professeur.speciality &&
          professeur.speciality
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (professeur.matricule &&
          professeur.matricule
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus = filters.status
        ? professeur.status === filters.status
        : true;
      const matchesSpeciality = filters.speciality
        ? professeur.speciality &&
          professeur.speciality
            .toLowerCase()
            .includes(filters.speciality.toLowerCase())
        : true;

      // Filtre par onglet
      if (activeTab === "active") {
        return (
          matchesSearch &&
          matchesStatus &&
          matchesSpeciality &&
          professeur.status === "Actif"
        );
      } else if (activeTab === "inactive") {
        return (
          matchesSearch &&
          matchesStatus &&
          matchesSpeciality &&
          professeur.status === "Inactif"
        );
      }

      return matchesSearch && matchesStatus && matchesSpeciality;
    });
  }, [professeurs, searchTerm, filters.status, filters.speciality, activeTab]);

  // Trier les professeurs
  const sortedProfesseurs = useMemo(() => {
    const professeursToSort = [...filteredProfesseurs];
    if (sortConfig !== null) {
      professeursToSort.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return professeursToSort;
  }, [filteredProfesseurs, sortConfig]);

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Professeur }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Calcul des statistiques pour les cartes
  const totalProfesseurs = professeurs.length;
  const activeProfesseurs = professeurs.filter(
    (p) => p.status === "Actif"
  ).length;
  const totalAssignments = professeurs.reduce(
    (total, prof) => total + (prof._count?.assignments || 0),
    0
  );

  if (loading && professeurs.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Chargement des professeurs...
          </p>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-700">
            Erreur de chargement
          </h3>
        </div>
        <p className="mt-2 text-red-600">{error}</p>
        <Button
          onClick={() => fetchProfesseurs()}
          variant="outline"
          className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Dialogues de confirmation */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Supprimer le professeur
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  <p>
                    Êtes-vous sûr de vouloir supprimer le professeur{" "}
                    <span className="font-semibold">
                      {selectedProfesseur?.firstName}{" "}
                      {selectedProfesseur?.lastName}
                    </span>{" "}
                    ?
                  </p>
                  {/* CORRECTION: Utiliser seulement assignments */}
                  {(selectedProfesseur?._count?.assignments || 0) > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-amber-800 text-sm">
                        ⚠️ Ce professeur a{" "}
                        {selectedProfesseur._count.assignments} cours assignés.
                        La suppression pourrait affecter le planning des cours.
                      </p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {actionType === "activate" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-500" />
                )}
                {actionType === "activate" ? "Activer" : "Désactiver"} le
                professeur
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir{" "}
                {actionType === "activate" ? "activer" : "désactiver"} le
                professeur{" "}
                <span className="font-semibold">
                  {selectedProfesseur?.firstName} {selectedProfesseur?.lastName}
                </span>{" "}
                ?
                {actionType === "deactivate" && (
                  <p className="mt-2 text-amber-600 text-sm">
                    ⚠️ Ce professeur ne pourra plus être assigné à de nouveaux
                    cours.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmStatusChange}
                className={
                  actionType === "activate"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }
              >
                {actionType === "activate" ? "Activer" : "Désactiver"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* En-tête */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              Gestion des Professeurs
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez les professeurs et leurs informations académiques
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
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={resetForm}
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Professeur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {editingProfesseur ? (
                    <>
                      <Edit className="h-6 w-6 text-primary" />
                      Modifier le professeur
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-6 w-6 text-primary" />
                      Nouveau professeur
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {editingProfesseur
                    ? "Modifiez les informations du professeur"
                    : "Remplissez les informations pour créer un nouveau professeur"}
                </DialogDescription>
              </DialogHeader>

              {/* Affichage des erreurs globales */}
              {formErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md mt-4">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Erreurs à corriger</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 mt-4"
              >
                {/* Section Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations personnelles
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="flex items-center gap-2"
                      >
                        <span>Prénom *</span>
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Prénom"
                        className={`${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="flex items-center gap-2"
                      >
                        <span>Nom *</span>
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Nom"
                        className={`${errors.lastName ? "border-red-500" : ""}`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="matricule"
                        className="flex items-center gap-2"
                      >
                        <Hash className="h-4 w-4" />
                        Matricule *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-muted-foreground">
                              ℹ️
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Identifiant unique généré automatiquement
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateMatricule}
                        disabled={
                          !firstNameValue ||
                          !lastNameValue ||
                          isGeneratingMatricule
                        }
                        className="h-7 px-2"
                      >
                        {isGeneratingMatricule ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        <span className="ml-1 text-xs">Nouveau</span>
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="matricule"
                        {...register("matricule")}
                        placeholder="Ex: JD-231201-001"
                        className={`font-mono uppercase ${
                          errors.matricule ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          e.target.value = value;
                          register("matricule").onChange(e);
                        }}
                        maxLength={20}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {matriculeValue?.length || 0}/20
                      </div>
                    </div>
                    {errors.matricule && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.matricule.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Format: Lettres majuscules et chiffres uniquement
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Section Contact */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <PhoneCall className="h-4 w-4" />
                    Informations de contact
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <AtSign className="h-4 w-4" />
                        Email académique *
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="nom.prenom@gmail.com"
                          className={`pl-10 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase();
                            e.target.value = value;
                            register("email").onChange(e);
                          }}
                        />
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="+509 44 55 66 77"
                          className={`pl-10 ${
                            errors.phone ? "border-red-500" : ""
                          }`}
                          onChange={(e) => {
                            // Formater le numéro en temps réel
                            const value = e.target.value;
                            const formatted = formatPhoneNumber(value);
                            if (formatted !== value) {
                              e.target.value = formatted;
                            }
                            register("phone").onChange(e);
                          }}
                          maxLength={15} // +509 XX XX XX XX = 15 caractères max
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        {phoneValue && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Badge variant="outline" className="text-xs">
                              {
                                phoneValue
                                  .replace(/[\s\-()]/g, "")
                                  .replace("+509", "").length
                              }
                              /8 chiffres
                            </Badge>
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Format: +509XXXXXXXX (ex: +50944556677) - 8 chiffres
                        après +509
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="flex items-center gap-2"
                      >
                        Adresse
                      </Label>
                      <Textarea
                        id="address"
                        {...register("address")}
                        placeholder="Adresse complète..."
                        rows={2}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section Professionnelle */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Informations professionnelles
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="speciality"
                        className="flex items-center gap-2"
                      >
                        <Award className="h-4 w-4" />
                        Spécialité
                      </Label>
                      <Controller
                        name="speciality"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="speciality">
                              <SelectValue placeholder="Sélectionnez une spécialité" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mathématiques">
                                Mathématiques
                              </SelectItem>
                              <SelectItem value="Physique">Physique</SelectItem>
                              <SelectItem value="Chimie">Chimie</SelectItem>
                              <SelectItem value="Sciences de la Vie et de la Terre">
                                Sciences de la Vie et de la Terre
                              </SelectItem>
                              <SelectItem value="Informatique">
                                Informatique
                              </SelectItem>
                              <SelectItem value="Français">Français</SelectItem>
                              <SelectItem value="Anglais">Anglais</SelectItem>
                              <SelectItem value="Espagnol">Espagnol</SelectItem>
                              <SelectItem value="Arabe">Arabe</SelectItem>
                              <SelectItem value="Histoire-Géographie">
                                Histoire-Géographie
                              </SelectItem>
                              <SelectItem value="Philosophie">
                                Philosophie
                              </SelectItem>
                              <SelectItem value="Éducation Physique et Sportive">
                                Éducation Physique et Sportive
                              </SelectItem>
                              <SelectItem value="Arts Plastiques">
                                Arts Plastiques
                              </SelectItem>
                              <SelectItem value="Musique">Musique</SelectItem>
                              <SelectItem value="Économie">Économie</SelectItem>
                              <SelectItem value="Gestion">Gestion</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.speciality && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.speciality.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="hireDate"
                        className="flex items-center gap-2"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Date d'embauche
                      </Label>
                      <div className="relative">
                        <Input
                          id="hireDate"
                          type="date"
                          {...register("hireDate")}
                          className={errors.hireDate ? "border-red-500" : ""}
                          max={new Date().toISOString().split("T")[0]}
                          min="2000-01-01"
                        />
                      </div>
                      {errors.hireDate && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.hireDate.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Doit être entre 2000-01-01 et aujourd'hui
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="status"
                        className="flex items-center gap-2"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        Statut
                      </Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="Actif"
                                className="flex items-center gap-2"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Actif
                              </SelectItem>
                              <SelectItem
                                value="Inactif"
                                className="flex items-center gap-2"
                              >
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                Inactif
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="qualifications"
                      className="flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Qualifications & Diplômes
                    </Label>
                    <Textarea
                      id="qualifications"
                      {...register("qualifications")}
                      placeholder="Listez les diplômes, certifications, expériences..."
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-between">
                      {errors.qualifications && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.qualifications.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {watch("qualifications")?.length || 0}/500 caractères
                      </p>
                    </div>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Récapitulatif
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Nom complet:</p>
                      <p className="font-semibold">
                        {watch("firstName") && watch("lastName")
                          ? `${watch("firstName")} ${watch("lastName")}`
                          : "Non renseigné"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Matricule:</p>
                      <p className="font-mono font-bold">
                        {watch("matricule") || "Génération automatique"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Email:</p>
                      <p className="font-medium truncate">
                        {watch("email") || "Non renseigné"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Statut:</p>
                      <Badge
                        variant={
                          watch("status") === "Actif" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {watch("status") || "Non défini"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                  <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                    {editingProfesseur && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          Créé le{" "}
                          {new Date(
                            editingProfesseur.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Traitement...
                        </>
                      ) : editingProfesseur ? (
                        "Mettre à jour"
                      ) : (
                        "Créer le professeur"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres et onglets */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-none">
                Tous ({totalProfesseurs})
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="flex-1 md:flex-none flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3 text-green-500" />
                Actifs ({activeProfesseurs})
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="flex-1 md:flex-none flex items-center gap-1"
              >
                <XCircle className="h-3 w-3 text-gray-400" />
                Inactifs ({totalProfesseurs - activeProfesseurs})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, matricule, email ou spécialité..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ status: value === "all" ? "" : value })
                }
              >
                <SelectTrigger className="w-[150px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.speciality}
                onValueChange={(value) =>
                  setFilters({ speciality: value === "all" ? "" : value })
                }
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Spécialité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes spécialités</SelectItem>
                  <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                  <SelectItem value="Physique">Physique</SelectItem>
                  <SelectItem value="Chimie">Chimie</SelectItem>
                  <SelectItem value="Sciences de la Vie et de la Terre">
                    SVT
                  </SelectItem>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="Anglais">Anglais</SelectItem>
                  <SelectItem value="Arabe">Arabe</SelectItem>
                  <SelectItem value="Histoire-Géographie">
                    Histoire-Géo
                  </SelectItem>
                  <SelectItem value="Philosophie">Philosophie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total professeurs</p>
                  <p className="text-2xl font-bold">{totalProfesseurs}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Actifs</p>
                  <p className="text-2xl font-bold">{activeProfesseurs}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Cours assignés</p>
                  <p className="text-2xl font-bold">{totalAssignments}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Inactifs</p>
                  <p className="text-2xl font-bold">
                    {totalProfesseurs - activeProfesseurs}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des professeurs */}
        <Card className="shadow-lg border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Professeur</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors min-w-[150px]"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Contact</span>
                        <SortIcon columnKey="email" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Spécialité</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Matricule</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Assignations</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Statut</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProfesseurs.map((professeur) => (
                    <TableRow
                      key={professeur.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(
                                professeur.firstName,
                                professeur.lastName
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {professeur.firstName} {professeur.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {professeur.hireDate
                                ? `Embauche: ${new Date(
                                    professeur.hireDate
                                  ).toLocaleDateString()}`
                                : "Sans date d'embauche"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-sm truncate max-w-[150px] cursor-help">
                                  {professeur.email}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{professeur.email}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          {professeur.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-mono">
                                {formatPhoneNumber(professeur.phone)}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {professeur.speciality ? (
                          <Badge
                            variant="outline"
                            className="truncate max-w-[120px]"
                          >
                            {professeur.speciality}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Non spécifié
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block text-sm">
                          {professeur.matricule || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3" />
                            <span className="text-sm">
                              {professeur._count?.assignments || 0} cours
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(professeur.status)}
                          className={`${
                            professeur.status === "Actif"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          {professeur.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/professeurs/${professeur.id}`}>
                                  <span className="sr-only">Détails</span>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Voir les détails</p>
                            </TooltipContent>
                          </Tooltip>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleEdit(professeur)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {professeur.status === "Actif" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProfesseur(professeur);
                                    setActionType("deactivate");
                                    setShowStatusDialog(true);
                                  }}
                                  className="text-amber-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Désactiver
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProfesseur(professeur);
                                    setActionType("activate");
                                    setShowStatusDialog(true);
                                  }}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProfesseur(professeur);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {sortedProfesseurs.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Aucun professeur trouvé
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filters.status || filters.speciality
                      ? "Aucun résultat pour vos critères de recherche"
                      : "Commencez par créer votre premier professeur"}
                  </p>
                  {!searchTerm && !filters.status && !filters.speciality && (
                    <Button onClick={resetForm} className="shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un professeur
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination et informations */}
        {professeurs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Affichage de{" "}
              <span className="font-semibold">{sortedProfesseurs.length}</span>{" "}
              professeur{sortedProfesseurs.length > 1 ? "s" : ""} sur{" "}
              <span className="font-semibold">{professeurs.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ page: (filters.page || 1) - 1 })}
                disabled={filters.page === 1}
                className="shadow-sm"
              >
                Précédent
              </Button>
              <div className="flex items-center px-3 py-1 bg-background border rounded-md shadow-sm">
                <span className="text-sm font-medium">
                  Page {filters.page || 1}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ page: (filters.page || 1) + 1 })}
                disabled={(filters.page || 1) * 10 >= professeurs.length}
                className="shadow-sm"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
