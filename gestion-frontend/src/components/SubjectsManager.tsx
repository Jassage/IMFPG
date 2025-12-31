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
  Hash,
  Type,
  Percent,
  FileText,
  RefreshCw,
  AlertCircle,
  Calculator,
  Award,
  X,
  Sparkles,
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

  const cleanName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "");

  const words = cleanName.split(/\s+/).filter((word) => word.length > 0);

  let baseCode = "";
  if (words.length === 1) {
    baseCode = words[0].substring(0, 3);
  } else if (words.length >= 2) {
    baseCode = words
      .slice(0, 3)
      .map((word) => word.charAt(0))
      .join("");
  }

  const randomDigits = Math.floor(100 + Math.random() * 900);
  let code = `${baseCode}${randomDigits}`;
  code = code.substring(0, 8);

  let finalCode = code;
  let counter = 1;
  while (existingCodes.includes(finalCode) && counter < 100) {
    const newDigits = Math.floor(100 + Math.random() * 900);
    finalCode = `${baseCode}${newDigits}`.substring(0, 8);
    counter++;
  }

  return finalCode;
};

// Schéma de validation simplifié
const subjectSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Le code doit contenir au moins 3 caractères" })
    .max(8, { message: "Le code ne peut pas dépasser 8 caractères" })
    .regex(/^[A-Z0-9]+$/, {
      message:
        "Le code ne peut contenir que des lettres majuscules et chiffres",
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
  maxGrade: z
    .number({
      required_error: "La note maximale est requise",
      invalid_type_error: "La note maximale doit être un nombre",
    })
    .min(10, { message: "La note maximale doit être au moins 10" })
    .max(100, { message: "La note maximale ne peut pas dépasser 100" }),
  description: z
    .string()
    .max(200, { message: "La description ne peut pas dépasser 200 caractères" })
    .optional()
    .default(""),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
    clearErrors,
    setError,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      coefficient: 1,
      maxGrade: 20,
      description: "",
    },
    mode: "onChange",
  });

  const nameValue = watch("name");
  const codeValue = watch("code");
  const maxGradeValue = watch("maxGrade");
  const descriptionValue = watch("description");

  // Options pour les notes maximales
  const maxGradeOptions = [
    { value: 10, label: "10 points" },
    { value: 20, label: "20 points" },
    { value: 30, label: "30 points" },
    { value: 40, label: "40 points" },
  ];

  // Effet pour générer le code automatiquement
  useEffect(() => {
    if (!isFormOpen) return;

    if (!editingSubject && nameValue && nameValue.trim().length >= 2) {
      const generatedCode = generateSubjectCode(
        nameValue,
        subjects.map((s) => s.code)
      );

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
    setValue("maxGrade", subject.maxGrade || 20);
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
      maxGrade: 20,
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

      return matchesSearch;
    });
  }, [subjects, searchTerm]);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Dialogue de confirmation de suppression */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Supprimer la matière
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la matière{" "}
                <span className="font-semibold">{selectedSubject?.name}</span> ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* En-tête */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Gestion des Matières
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les matières enseignées
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
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Matière
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 max-h-[85vh] overflow-hidden">
              {/* Header avec bouton fermer */}
              <div className="flex items-center justify-between p-6 border-b">
                <DialogHeader className="p-0">
                  <DialogTitle className="text-xl flex items-center gap-2">
                    {editingSubject ? (
                      <>
                        <Edit className="h-5 w-5 text-primary" />
                        Modifier la matière
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-5 w-5 text-primary" />
                        Nouvelle matière
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-1">
                    {editingSubject
                      ? "Modifiez les informations de la matière"
                      : "Remplissez les informations pour créer une nouvelle matière"}
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsFormOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Affichage des erreurs globales */}
              {formErrors.length > 0 && (
                <div className="p-4 bg-red-50 border-b border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Erreurs à corriger
                    </span>
                  </div>
                  <ul className="mt-1 space-y-1 text-red-600 text-sm">
                    {formErrors.slice(0, 2).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-4 overflow-y-auto"
              >
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    Nom de la matière *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Ex: Mathématiques"
                      className={`pl-9 ${errors.name ? "border-red-500" : ""}`}
                    />
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code" className="text-sm">
                      Code unique *
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRegenerateCode}
                      disabled={
                        !nameValue ||
                        nameValue.trim().length < 2 ||
                        isGeneratingCode
                      }
                      className="h-7 px-2 text-xs"
                    >
                      {isGeneratingCode ? (
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      Générer
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="code"
                      {...register("code")}
                      placeholder="Ex: MAT101"
                      className={`font-mono uppercase pl-9 ${
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
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Coefficient et Note maximale */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coefficient" className="text-sm">
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
                      <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                    {errors.coefficient && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.coefficient.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGrade" className="text-sm">
                      Note maximale
                    </Label>
                    <Controller
                      name="maxGrade"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                        >
                          <SelectTrigger id="maxGrade" className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {maxGradeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.maxGrade && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.maxGrade.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Brève description de la matière..."
                    className="min-h-[80px] resize-none text-sm"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {descriptionValue?.length || 0}/200 caractères
                    </p>
                    {errors.description && (
                      <p className="text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <DialogFooter className="pt-4 border-t">
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          En cours...
                        </>
                      ) : editingSubject ? (
                        "Mettre à jour"
                      ) : (
                        "Créer"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une matière..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Statistiques compactes */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{subjects.length}</p>
                </div>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Moy. coeff</p>
                  <p className="text-lg font-bold">
                    {subjects.length > 0
                      ? (
                          subjects.reduce((sum, s) => sum + s.coefficient, 0) /
                          subjects.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <Calculator className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Moy. note max</p>
                  <p className="text-lg font-bold">
                    {subjects.length > 0
                      ? Math.round(
                          subjects.reduce(
                            (sum, s) => sum + (s.maxGrade || 20),
                            0
                          ) / subjects.length
                        )
                      : "20"}
                  </p>
                </div>
                <Award className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des matières */}
        <Card className="border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead
                      className="w-[100px] cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("code")}
                    >
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        <span>Code</span>
                        <SortIcon columnKey="code" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        <Type className="h-3 w-3" />
                        <span>Nom</span>
                        <SortIcon columnKey="name" />
                      </div>
                    </TableHead>
                    <TableHead>Coeff</TableHead>
                    <TableHead>Note max</TableHead>
                    <TableHead>Util.</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubjects.map((subject) => (
                    <TableRow key={subject.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="font-mono font-medium text-primary text-sm">
                          {subject.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          {subject.description && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px] cursor-help">
                                  {subject.description}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-sm">
                                  {subject.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          ×{subject.coefficient}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Award className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="font-medium">
                            {subject.maxGrade || 20}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-xs">
                              <div>
                                {subject._count?.assignments || 0} classe(s)
                              </div>
                              <div>{subject._count?.grades || 0} note(s)</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">
                              {subject._count?.assignments || 0} classe(s)
                              <br />
                              {subject._count?.grades || 0} note(s)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEdit(subject)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {sortedSubjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-3">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Aucune matière trouvée</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchTerm
                      ? `Aucun résultat pour "${searchTerm}"`
                      : "Créez votre première matière"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={resetForm} size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Créer une matière
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination compacte */}
        {subjects.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {sortedSubjects.length} sur {subjects.length} matière
              {sortedSubjects.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ page: filters.page - 1 })}
                disabled={filters.page === 1}
              >
                ←
              </Button>
              <span className="px-2">Page {filters.page}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ page: filters.page + 1 })}
                disabled={sortedSubjects.length < 10}
              >
                →
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
