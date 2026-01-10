import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Hash,
  Sparkles,
  AtSign,
  PhoneCall,
  Briefcase,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Plus,
  Trash2,
  UserX,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Professeur, Subject } from "@/types/academic";
import api from "@/services/api";

// Schéma étendu pour inclure les matières
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
    .transform((value) => value.toLowerCase().trim()),

  phone: z
    .string()
    .refine(
      (phone) => {
        if (!phone || phone.trim() === "") return true;
        const cleaned = phone.replace(/[\s\-()]/g, "");
        const phoneRegex = /^(\+509)\d{8}$/;
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
        if (!date || date.trim() === "") return true;
        const selectedDate = new Date(date);
        const today = new Date();
        const minDate = new Date("2000-01-01");
        if (isNaN(selectedDate.getTime())) return false;
        if (selectedDate > today) return false;
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

  matieres: z
    .array(
      z.object({
        id: z.string(),
        code: z.string(),
        nom: z.string(),
        coefficient: z.number().min(1).max(10),
      })
    )
    .optional()
    .default([]),

  createUserAccount: z.boolean().optional().default(false),
});

type ProfesseurFormData = z.infer<typeof professeurSchema>;

interface ProfesseurFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProfesseur: Professeur | null;
  onSubmit: (data: ProfesseurFormData) => Promise<void>;
  existingProfesseurs: Professeur[];
  allMatieres?: Subject[];
}

export const ProfesseurForm = ({
  isOpen,
  onClose,
  editingProfesseur,
  onSubmit,
  existingProfesseurs,
  allMatieres = [],
}: ProfesseurFormProps) => {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isGeneratingMatricule, setIsGeneratingMatricule] = useState(false);
  const [availableMatieres, setAvailableMatieres] = useState<Subject[]>([]);
  const [loadingMatieres, setLoadingMatieres] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [matiereCoefficient, setMatiereCoefficient] = useState<number>(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
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
      matieres: [],
      createUserAccount: false,
    },
    mode: "onChange",
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const matriculeValue = watch("matricule");
  const phoneValue = watch("phone");
  const createUserAccountValue = watch("createUserAccount");
  const matieresValue = watch("matieres") || [];

  // Charger les matières disponibles
  useEffect(() => {
    if (isOpen) {
      loadAvailableMatieres();
    }
  }, [isOpen]);

  const loadAvailableMatieres = async () => {
    setLoadingMatieres(true);
    try {
      if (allMatieres.length > 0) {
        setAvailableMatieres(allMatieres);
      } else {
        const response = await api.get("/matieres", {
          params: { status: "Actif", limit: 100 },
        });
        setAvailableMatieres(response.data.data?.matieres || []);
      }
    } catch (error) {
      console.error("Erreur chargement matières:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des matières",
        variant: "destructive",
      });
    } finally {
      setLoadingMatieres(false);
    }
  };

  // Effet pour générer le matricule automatiquement
  useEffect(() => {
    if (!isOpen) return;

    if (!editingProfesseur && firstNameValue && lastNameValue) {
      const generatedMatricule = generateProfesseurId(
        firstNameValue,
        lastNameValue,
        existingProfesseurs.map((p) => p.matricule || "")
      );

      if (!matriculeValue) {
        setValue("matricule", generatedMatricule, { shouldValidate: true });
      }
    }

    // Pré-remplir le formulaire en mode édition
    if (editingProfesseur && isOpen) {
      setValue("firstName", editingProfesseur.firstName);
      setValue("lastName", editingProfesseur.lastName);
      setValue("email", editingProfesseur.email);
      setValue("phone", editingProfesseur.phone || "");
      setValue("speciality", editingProfesseur.speciality || "");
      setValue("hireDate", editingProfesseur.hireDate?.split("T")[0] || "");
      setValue("status", editingProfesseur.status);
      setValue("matricule", editingProfesseur.matricule || "");
      setValue("address", editingProfesseur.address || "");
      setValue("qualifications", editingProfesseur.qualifications || "");
      //   setValue("matieres", editingProfesseur.S || []);
      setValue("createUserAccount", !!editingProfesseur.userId);
    }
  }, [isOpen, editingProfesseur, firstNameValue, lastNameValue]);

  // Fonction pour générer un identifiant unique
  const generateProfesseurId = (
    firstName: string,
    lastName: string,
    existingIds: string[] = []
  ): string => {
    if (!firstName.trim() || !lastName.trim()) return "";

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    const baseCode = `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}-${year}${month}${day}`;

    let finalCode = baseCode;
    let counter = 1;
    while (existingIds.includes(finalCode) && counter < 1000) {
      finalCode = `${baseCode}-${counter.toString().padStart(3, "0")}`;
      counter++;
    }

    return finalCode;
  };

  // Fonction pour formater le téléphone
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/[\s\-()]/g, "");
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
      existingProfesseurs
        .map((p) => p.matricule || "")
        .filter((m) => m !== editingProfesseur?.matricule)
    );

    setValue("matricule", newMatricule, { shouldValidate: true });

    setTimeout(() => {
      setIsGeneratingMatricule(false);
    }, 300);
  };

  // Fonctions pour gérer les matières
  const handleAddMatiere = () => {
    if (!selectedMatiere) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une matière",
        variant: "destructive",
      });
      return;
    }

    const matiere = availableMatieres.find((m) => m.id === selectedMatiere);
    if (!matiere) return;

    // Vérifier si la matière est déjà sélectionnée
    const alreadySelected = matieresValue.some((m) => m.id === matiere.id);
    if (alreadySelected) {
      toast({
        title: "Attention",
        description: "Cette matière est déjà sélectionnée",
        variant: "destructive",
      });
      return;
    }

    const newSubject = {
      id: matiere.id,
      code: matiere.code,
      nom: matiere.name,
      coefficient: matiereCoefficient,
    };

    const updatedMatieres = [...matieresValue, newSubject];
    setValue("matieres", updatedMatieres, { shouldValidate: true });

    // Réinitialiser la sélection
    setSelectedMatiere("");
    setMatiereCoefficient(1);
  };

  const handleRemoveMatiere = (matiereId: string) => {
    const updatedMatieres = matieresValue.filter((m) => m.id !== matiereId);
    setValue("matieres", updatedMatieres, { shouldValidate: true });
  };

  const handleUpdateCoefficient = (matiereId: string, coefficient: number) => {
    const updatedMatieres = matieresValue.map((m) =>
      m.id === matiereId ? { ...m, coefficient } : m
    );
    setValue("matieres", updatedMatieres, { shouldValidate: true });
  };

  // Vérifier si l'email est unique
  const isEmailUnique = (email: string): boolean => {
    const existingEmails = existingProfesseurs.map((p) =>
      p.email.toLowerCase()
    );
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
  const handleFormSubmit = async (data: ProfesseurFormData) => {
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

      await onSubmit(data);
      reset();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.message || "Une erreur est survenue lors de l'enregistrement";
      setFormErrors([errorMessage]);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
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
      matieres: [],
      createUserAccount: false,
    });
    setFormErrors([]);
    setSelectedMatiere("");
    setMatiereCoefficient(1);
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {editingProfesseur ? (
                <>
                  <Briefcase className="h-6 w-6 text-primary" />
                  Modifier le professeur
                </>
              ) : (
                <>
                  <User className="h-6 w-6 text-primary" />
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

          <ScrollArea className="flex-1 px-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6 py-4"
            >
              {/* Affichage des erreurs globales */}
              {formErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
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
                      className={`${errors.firstName ? "border-red-500" : ""}`}
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
                            <Info className="h-4 w-4" />
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
                    <Label htmlFor="email" className="flex items-center gap-2">
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
                    <Label htmlFor="phone" className="flex items-center gap-2">
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
                          const value = e.target.value;
                          const formatted = formatPhoneNumber(value);
                          if (formatted !== value) {
                            e.target.value = formatted;
                          }
                          register("phone").onChange(e);
                        }}
                        maxLength={15}
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
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section Matières enseignées */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Matières enseignées
                </h3>

                <div className="space-y-4">
                  {/* Sélection de matière */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="matiereSelect">
                        Sélectionner une matière
                      </Label>
                      <Select
                        value={selectedMatiere}
                        onValueChange={setSelectedMatiere}
                        disabled={loadingMatieres}
                      >
                        <SelectTrigger id="matiereSelect">
                          <SelectValue
                            placeholder={
                              loadingMatieres
                                ? "Chargement des matières..."
                                : "Choisir une matière"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMatieres.map((matiere) => (
                            <SelectItem key={matiere.id} value={matiere.id}>
                              {matiere.code} - {matiere.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coefficient">Coefficient</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="coefficient"
                          type="number"
                          min="1"
                          max="10"
                          value={matiereCoefficient}
                          onChange={(e) =>
                            setMatiereCoefficient(Number(e.target.value))
                          }
                          className="w-20"
                        />
                        <Button
                          type="button"
                          onClick={handleAddMatiere}
                          disabled={!selectedMatiere}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Liste des matières sélectionnées */}
                  {matieresValue.length > 0 && (
                    <div className="space-y-2">
                      <Label>
                        Matières sélectionnées ({matieresValue.length})
                      </Label>
                      <div className="space-y-2">
                        {matieresValue.map((matiere) => (
                          <div
                            key={matiere.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {matiere.code} - {matiere.nom}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                  Coef: {matiere.coefficient}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select
                                value={matiere.coefficient.toString()}
                                onValueChange={(value) =>
                                  handleUpdateCoefficient(
                                    matiere.id,
                                    Number(value)
                                  )
                                }
                              >
                                <SelectTrigger className="w-20 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                    (coef) => (
                                      <SelectItem
                                        key={coef}
                                        value={coef.toString()}
                                      >
                                        {coef}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMatiere(matiere.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matieresValue.length === 0 && (
                    <div className="text-center py-4 border rounded-lg bg-muted/10">
                      <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Aucune matière sélectionnée. Ajoutez les matières que ce
                        professeur peut enseigner.
                      </p>
                    </div>
                  )}
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
                      Spécialité principale
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
                      <Calendar className="h-4 w-4" />
                      Date d'embauche
                    </Label>
                    <Input
                      id="hireDate"
                      type="date"
                      {...register("hireDate")}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {errors.hireDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.hireDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <textarea
                    id="qualifications"
                    {...register("qualifications")}
                    placeholder="Diplômes, certifications, expériences..."
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {watch("qualifications")?.length || 0}/500 caractères
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section Compte utilisateur */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Compte utilisateur
                </h3>

                {editingProfesseur && editingProfesseur.userId ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">
                        Compte utilisateur associé
                      </span>
                    </div>
                    <div className="text-sm text-green-600">
                      <p>Email: {editingProfesseur.user?.email}</p>
                      <p>Statut: {editingProfesseur.user?.status}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="createUserAccount"
                        {...register("createUserAccount")}
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor="createUserAccount"
                        className="cursor-pointer"
                      >
                        Créer un compte utilisateur pour ce professeur
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="p-6 pt-4 border-t">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 w-full">
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                {editingProfesseur && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      {editingProfesseur.userId ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Compte utilisateur associé
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <UserX className="h-3 w-3" />
                          Aucun compte utilisateur
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(handleFormSubmit)}
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
            </div>
          </DialogFooter>
        </div>
      </div>
    </TooltipProvider>
  );
};
