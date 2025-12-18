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
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Hash,
  Type,
  Bookmark,
  Percent,
  FileText,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Calculator,
  Award,
  GemIcon,
  RefreshCcw,
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
import { useSubjectStore } from "@/store/subjectStore";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Subject } from "@/types/academic";

// Fonction utilitaire pour générer le code à partir du nom
const generateSubjectCode = (
  name: string,
  existingCodes: string[] = []
): string => {
  if (!name.trim()) return "";

  // Nettoyer le nom
  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "");

  // Extraire les mots
  const words = cleanName.split(/\s+/).filter((word) => word.length > 0);

  // Créer la base du code : première lettre de chaque mot (max 3 mots)
  let baseCode = "";
  if (words.length === 1) {
    // Pour un seul mot, prendre les 3 premières lettres
    baseCode = words[0].substring(0, 3);
  } else if (words.length >= 2) {
    // Pour plusieurs mots, prendre la première lettre de chaque (max 3 mots)
    baseCode = words
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join("");
  }

  // Ajouter 3 chiffres aléatoires
  const randomDigits = Math.floor(100 + Math.random() * 900); // 100-999
  let code = `${baseCode}${randomDigits}`;

  // Limiter à 8 caractères maximum
  code = code.substring(0, 8);

  // Vérifier l'unicité et ajuster si nécessaire
  let finalCode = code;
  let counter = 1;
  while (existingCodes.includes(finalCode) && counter < 100) {
    // Si le code existe, changer les chiffres
    const newDigits = Math.floor(100 + Math.random() * 900);
    finalCode = `${baseCode}${newDigits}`.substring(0, 8);
    counter++;
  }

  return finalCode;
};

// Schéma de validation
const subjectSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Le code doit contenir au moins 3 caractères" })
    .max(8, { message: "Le code ne peut pas dépasser 8 caractères" })
    .regex(/^[A-Z0-9]+$/, {
      message:
        "Le code ne peut contenir que des lettres majuscules et chiffres",
    })
    .refine((code) => /[A-Z]/.test(code) && /\d/.test(code), {
      message: "Le code doit contenir au moins une lettre et un chiffre",
    }),
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" })
    .refine((name) => name.trim().length > 0, {
      message: "Le nom ne peut pas être vide",
    }),
  coefficient: z
    .number({
      required_error: "Le coefficient est requis",
      invalid_type_error: "Le coefficient doit être un nombre",
    })
    .min(0.5, { message: "Le coefficient doit être au moins 0.5" })
    .max(10, { message: "Le coefficient ne peut pas dépasser 10" })
    .refine((value) => value % 0.5 === 0, {
      message: "Le coefficient doit être un multiple de 0.5",
    }),
  type: z.enum(["Obligatoire", "Optionnelle"], {
    required_error: "Le type est requis",
  }),
  passingGrade: z
    .number({
      required_error: "La note de passage est requise",
      invalid_type_error: "La note de passage doit être un nombre",
    })
    .min(0, { message: "La note de passage doit être au moins 0" })
    .max(100, { message: "La note de passage ne peut pas dépasser 100" })
    .refine((value) => value % 0.5 === 0, {
      message: "La note de passage doit être un multiple de 0.5",
    }),
  description: z
    .string()
    .max(500, { message: "La description ne peut pas dépasser 500 caractères" })
    .default("")
    .optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export const SubjectsManager = () => {
  const {
    subjects,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    loading,
    error,
    filters,
    setFilters,
  } = useSubjectStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Subject;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

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
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      coefficient: 1,
      type: "Obligatoire",
      passingGrade: 60,
      description: "",
    },
    mode: "onChange",
  });

  const nameValue = watch("name");
  const codeValue = watch("code");
  const coefficientValue = watch("coefficient");
  const passingGradeValue = watch("passingGrade");
  const descriptionValue = watch("description");

  // Effet pour générer le code automatiquement
  useEffect(() => {
    if (!isFormOpen) return;

    if (!editingSubject && nameValue && nameValue.trim().length >= 2) {
      const generatedCode = generateSubjectCode(
        nameValue,
        subjects.map((s) => s.code)
      );

      // Mettre à jour seulement si l'utilisateur n'a pas modifié le code
      if (!codeValue || codeValue === generateSubjectCode("")) {
        setValue("code", generatedCode, { shouldValidate: true });
      }
    }
  }, [nameValue, isFormOpen, editingSubject, subjects, setValue, codeValue]);

  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  // Fonction pour regénérer le code manuellement
  const handleRegenerateCode = () => {
    if (!nameValue || nameValue.trim().length < 2) {
      toast({
        title: "Attention",
        description: "Veuillez d'abord saisir un nom de matière",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCode(true);
    const newCode = generateSubjectCode(
      nameValue,
      subjects
        .map((s) => s.code)
        .filter((code) => code !== editingSubject?.code)
    );

    setValue("code", newCode, { shouldValidate: true });

    setTimeout(() => {
      setIsGeneratingCode(false);
    }, 300);
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setValue("code", subject.code);
    setValue("name", subject.name);
    setValue("coefficient", subject.coefficient);
    setValue("type", subject.type);
    setValue("passingGrade", subject.passingGrade);
    setValue("description", subject.description || "");
    setFormErrors([]);
    setIsFormOpen(true);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEditingSubject(null);
    setFormErrors([]);
    reset({
      code: "",
      name: "",
      coefficient: 1,
      type: "Obligatoire",
      passingGrade: 60,
      description: "",
    });
  };

  // Vérifier si le code est unique
  const isCodeUnique = (code: string): boolean => {
    const existingCodes = subjects.map((s) => s.code);
    if (editingSubject) {
      return !existingCodes.some(
        (c) => c === code && code !== editingSubject.code
      );
    }
    return !existingCodes.includes(code);
  };

  // Soumission du formulaire
  const onSubmit = async (data: SubjectFormData) => {
    try {
      // Valider l'unicité du code
      if (!isCodeUnique(data.code)) {
        setError("code", {
          type: "manual",
          message: "Ce code est déjà utilisé par une autre matière",
        });
        toast({
          title: "Code dupliqué",
          description: "Ce code est déjà utilisé par une autre matière",
          variant: "destructive",
        });
        return;
      }

      // Valider les données avec Zod
      const validation = subjectSchema.safeParse(data);
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

      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
        toast({
          title: " Matière mise à jour",
          description: `La matière "${data.name}" a été modifiée avec succès`,
        });
      } else {
        await createSubject(data);
        toast({
          title: " Matière créée",
          description: `La matière "${data.name}" a été ajoutée avec succès`,
        });
      }

      setIsFormOpen(false);
      resetForm();
      setFormErrors([]);
    } catch (error: any) {
      const errorMessage =
        error.message || "Une erreur est survenue lors de l'enregistrement";
      setFormErrors([errorMessage]);
      toast({
        title: " Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedSubject) return;

    try {
      const isUsed =
        (selectedSubject._count?.assignments || 0) > 0 ||
        (selectedSubject._count?.grades || 0) > 0;

      if (isUsed) {
        toast({
          title: "Impossible de supprimer",
          description:
            "Cette matière est utilisée dans des classes ou notes et ne peut pas être supprimée",
          variant: "destructive",
        });
        return;
      }

      await deleteSubject(selectedSubject.id);
      toast({
        title: " Suppression réussie",
        description: "La matière a été supprimée avec succès",
      });
    } catch (error: any) {
      toast({
        title: " Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedSubject(null);
    }
  };

  const handleSort = (key: keyof Subject) => {
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

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.description &&
          subject.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = filters.type ? subject.type === filters.type : true;

      return matchesSearch && matchesFilter;
    });
  }, [subjects, searchTerm, filters.type]);

  // Trier les matières
  const sortedSubjects = useMemo(() => {
    const subjectsToSort = [...filteredSubjects];
    if (sortConfig !== null) {
      subjectsToSort.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return subjectsToSort;
  }, [filteredSubjects, sortConfig]);

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Obligatoire":
        return "default";
      case "Optionnelle":
        return "secondary";
      default:
        return "outline";
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Subject }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (loading && subjects.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Chargement des matières...
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
          onClick={() => fetchSubjects()}
          variant="outline"
          className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Dialogue de confirmation de suppression */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Supprimer la matière
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  <p>
                    Êtes-vous sûr de vouloir supprimer la matière{" "}
                    <span className="font-semibold">
                      {selectedSubject?.name}
                    </span>{" "}
                    (<span className="font-mono">{selectedSubject?.code}</span>)
                    ?
                  </p>
                  {(selectedSubject?._count?.assignments || 0) > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-amber-800 text-sm">
                        ⚠️ Cette matière est assignée à{" "}
                        {selectedSubject._count.assignments} classe(s). La
                        suppression pourrait affecter les données associées.
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

        {/* En-tête */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Gestion des Matières
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez les matières enseignées dans l'établissement
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
                Nouvelle Matière
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {editingSubject ? (
                    <>
                      <Edit className="h-6 w-6 text-primary" />
                      Modifier la matière
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-6 w-6 text-primary" />
                      Nouvelle matière
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {editingSubject
                    ? `Modifiez les informations de la matière`
                    : "Remplissez les informations pour créer une nouvelle matière"}
                </DialogDescription>
              </DialogHeader>

              {/* Affichage des erreurs globales */}
              {formErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section Informations principales */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Informations principales
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      * Champs requis
                    </Badge>
                  </div>

                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Nom de la matière *
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Ex: Mathématiques Avancées"
                        className={`pl-10 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          register("name").onChange(e);
                          clearErrors("code");
                        }}
                      />
                      <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Code */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="code" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Code unique *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-muted-foreground">
                              <RefreshCcw />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Code généré automatiquement à partir du nom (ex:
                              MAT123)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateCode}
                        disabled={
                          !nameValue ||
                          nameValue.trim().length < 2 ||
                          isGeneratingCode
                        }
                        className="h-7 px-2"
                      >
                        {isGeneratingCode ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        <span className="ml-1 text-xs">Nouveau</span>
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="code"
                        {...register("code")}
                        placeholder="Ex: MAT101"
                        className={`font-mono uppercase pl-10 ${
                          errors.code ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          e.target.value = value;
                          register("code").onChange(e);
                        }}
                        maxLength={8}
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {codeValue?.length || 0}/8
                      </div>
                    </div>
                    {errors.code && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.code.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Format: Lettres majuscules et chiffres uniquement (ex:
                      MATH123, FR101)
                    </p>
                  </div>

                  {/* Type et Coefficient */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        Type
                      </Label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Obligatoire">
                                Obligatoire
                              </SelectItem>
                              <SelectItem value="Optionnelle">
                                Optionnelle
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.type && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="coefficient"
                        className="flex items-center gap-2"
                      >
                        <Calculator className="h-4 w-4" />
                        Coefficient
                      </Label>
                      <div className="relative">
                        <Input
                          id="coefficient"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="10"
                          {...register("coefficient", { valueAsNumber: true })}
                          className="pr-10"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          pts
                        </div>
                      </div>
                      {errors.coefficient && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.coefficient.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Note de passage */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="passingGrade"
                      className="flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Note de passage minimale
                    </Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          id="passingGrade"
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          {...register("passingGrade", { valueAsNumber: true })}
                          className="pr-12"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          %
                        </div>
                      </div>
                    </div>
                    {errors.passingGrade && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.passingGrade.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Section Description */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Informations supplémentaires
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Décrivez brièvement le contenu de la matière, les objectifs d'apprentissage..."
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      {errors.description && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {descriptionValue?.length || 0}/500 caractères
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                  <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                    {editingSubject && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          Créée le{" "}
                          {new Date(
                            editingSubject.createdAt
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
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : editingSubject ? (
                        "Mettre à jour"
                      ) : (
                        "Créer la matière"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, code ou description..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters({ type: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-[180px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type de matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Obligatoire">Obligatoire</SelectItem>
                <SelectItem value="Optionnelle">Optionnelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total des matières</p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">
                    Matières obligatoires
                  </p>
                  <p className="text-2xl font-bold">
                    {subjects.filter((s) => s.type === "Obligatoire").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">
                    Matières optionnelles
                  </p>
                  <p className="text-2xl font-bold">
                    {subjects.filter((s) => s.type === "Optionnelle").length}
                  </p>
                </div>
                <Bookmark className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des matières */}
        <Card className="shadow-lg border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleSort("code")}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span>Code</span>
                        <SortIcon columnKey="code" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <span>Nom</span>
                        <SortIcon columnKey="name" />
                      </div>
                    </TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Note de passage</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubjects.map((subject) => (
                    <TableRow
                      key={subject.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block">
                          {subject.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{subject.name}</div>
                          {subject.description && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px] cursor-help">
                                  {subject.description}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {subject.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          ×{subject.coefficient}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getTypeBadgeVariant(subject.type)}
                          className={`${
                            subject.type === "Obligatoire"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          }`}
                        >
                          {subject.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {subject.passingGrade >= 50 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-amber-500 mr-2" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {subject.passingGrade}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>
                              {subject._count?.assignments || 0} classe(s)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{subject._count?.grades || 0} note(s)</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
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
                              onClick={() => handleEdit(subject)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSubject(subject);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600 focus:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {sortedSubjects.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune matière trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm
                      ? `Aucun résultat pour "${searchTerm}"`
                      : "Commencez par créer votre première matière"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={resetForm} className="shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une matière
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination et informations */}
        {subjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Affichage de{" "}
              <span className="font-semibold">{sortedSubjects.length}</span>{" "}
              matière{sortedSubjects.length > 1 ? "s" : ""} sur{" "}
              <span className="font-semibold">{subjects.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (filters.page > 1) {
                    setFilters({ page: filters.page - 1 });
                  }
                }}
                disabled={filters.page === 1}
                className="shadow-sm"
              >
                Précédent
              </Button>
              <div className="flex items-center px-3 py-1 bg-background border rounded-md shadow-sm">
                <span className="text-sm font-medium">Page {filters.page}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({ page: filters.page + 1 });
                }}
                disabled={sortedSubjects.length < 10}
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
