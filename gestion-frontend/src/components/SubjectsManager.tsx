import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Hash,
  Type,
  Calculator,
  Award,
  X,
  Sparkles,
  Filter,
  Download,
  Upload,
  MoreVertical,
  BarChart3,
  Shield,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Maximize2,
  Minimize2,
  RefreshCw,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Subject } from "@/types/academic";
import { cn } from "@/lib/utils";

// Schéma de validation
const subjectSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Minimum 3 caractères" })
    .max(8, { message: "Maximum 8 caractères" })
    .regex(/^[A-Z0-9]+$/, {
      message: "Lettres majuscules et chiffres uniquement",
    }),
  name: z
    .string()
    .min(2, { message: "Minimum 2 caractères" })
    .max(100, { message: "Maximum 100 caractères" })
    .refine((name) => name.trim().length > 0, {
      message: "Le nom est requis",
    }),
  coefficient: z
    .number({
      required_error: "Coefficient requis",
      invalid_type_error: "Doit être un nombre",
    })
    .min(0.5, { message: "Minimum 0.5" })
    .max(10, { message: "Maximum 10" })
    .refine((value) => value % 0.5 === 0, {
      message: "Multiple de 0.5",
    }),
  maxGrade: z
    .number({
      required_error: "Note maximale requise",
      invalid_type_error: "Doit être un nombre",
    })
    .min(10, { message: "Minimum 10" })
    .max(100, { message: "Maximum 100" }),
  description: z
    .string()
    .max(200, { message: "Maximum 200 caractères" })
    .optional()
    .default(""),
  isActive: z.boolean().default(true),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

// Fonction utilitaire pour générer le code
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
  let code = `${baseCode}${randomDigits}`.substring(0, 8);

  let finalCode = code;
  let counter = 1;
  while (existingCodes.includes(finalCode) && counter < 100) {
    const newDigits = Math.floor(100 + Math.random() * 900);
    finalCode = `${baseCode}${newDigits}`.substring(0, 8);
    counter++;
  }

  return finalCode;
};

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
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set()
  );
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    setValue,
    watch,
    control,
    setError,
    trigger,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      coefficient: 1,
      maxGrade: 20,
      description: "",
      isActive: true,
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const nameValue = watch("name");
  const codeValue = watch("code");
  const coefficientValue = watch("coefficient");
  const maxGradeValue = watch("maxGrade");
  const descriptionValue = watch("description");
  const isActiveValue = watch("isActive");

  // Options pour les notes maximales
  const maxGradeOptions = [
    { value: 10, label: "10 points" },
    { value: 20, label: "20 points" },
    { value: 30, label: "30 points" },
    { value: 40, label: "40 points" },
    { value: 50, label: "50 points" },
    { value: 100, label: "100 points" },
  ];

  // Effet pour générer le code automatiquement
  useEffect(() => {
    if (!isFormOpen || editingSubject) return;

    const debounceTimer = setTimeout(() => {
      if (nameValue && nameValue.trim().length >= 2) {
        const generatedCode = generateSubjectCode(
          nameValue,
          subjects.map((s) => s.code)
        );

        if (!codeValue || codeValue === generateSubjectCode("")) {
          setValue("code", generatedCode, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
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

  // Fonction pour regénérer le code
  const handleRegenerateCode = async () => {
    if (!nameValue || nameValue.trim().length < 2) {
      toast({
        title: "Nom requis",
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

    setValue("code", newCode, { shouldValidate: true, shouldDirty: true });
    await trigger("code");

    setTimeout(() => {
      setIsGeneratingCode(false);
      toast({
        title: "Code généré",
        description: "Un nouveau code a été généré",
      });
    }, 300);
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    reset({
      code: subject.code,
      name: subject.name,
      coefficient: subject.coefficient,
      maxGrade: subject.maxGrade || 20,
      description: subject.description || "",
      isActive: subject.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingSubject(null);
    reset({
      code: "",
      name: "",
      coefficient: 1,
      maxGrade: 20,
      description: "",
      isActive: true,
    });
  };

  // Vérifier l'unicité du code
  const isCodeUnique = (code: string): boolean => {
    if (!code) return true;
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
      // Validation de l'unicité du code
      if (!isCodeUnique(data.code)) {
        setError("code", {
          type: "manual",
          message: "Ce code est déjà utilisé",
        });
        toast({
          title: "Code dupliqué",
          description: "Ce code est déjà utilisé par une autre matière",
          variant: "destructive",
        });
        return;
      }

      // Validation Zod
      const validation = subjectSchema.safeParse(data);
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        toast({
          title: "Erreurs de validation",
          description: (
            <ul className="list-disc pl-4">
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          ),
          variant: "destructive",
        });
        return;
      }

      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
        toast({
          title: "✅ Matière mise à jour",
          description: `"${data.name}" a été modifiée avec succès`,
        });
      } else {
        await createSubject(data);
        toast({
          title: "✅ Matière créée",
          description: `"${data.name}" a été ajoutée avec succès`,
        });
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Suppression
  const confirmDelete = async () => {
    if (!selectedSubject) return;

    try {
      const isUsed =
        (selectedSubject._count?.assignments || 0) > 0 ||
        (selectedSubject._count?.grades || 0) > 0;

      if (isUsed) {
        toast({
          title: "⛔ Suppression impossible",
          description: "Cette matière est utilisée dans des évaluations",
          variant: "destructive",
        });
        return;
      }

      await deleteSubject(selectedSubject.id);
      toast({
        title: "🗑️ Suppression réussie",
        description: "La matière a été supprimée",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedSubject(null);
    }
  };

  // Tri
  const handleSort = (key: keyof Subject) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  // Filtrage et tri des matières
  const filteredSubjects = useMemo(() => {
    let result = subjects;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (subject) =>
          subject.name.toLowerCase().includes(term) ||
          subject.code.toLowerCase().includes(term) ||
          (subject.description &&
            subject.description.toLowerCase().includes(term))
      );
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [subjects, searchTerm, sortConfig]);

  // Statistiques
  const stats = useMemo(() => {
    const total = subjects.length;
    const active = subjects.filter((s) => s.isActive).length;
    const avgCoefficient =
      total > 0
        ? subjects.reduce((sum, s) => sum + s.coefficient, 0) / total
        : 0;
    const avgMaxGrade =
      total > 0
        ? subjects.reduce((sum, s) => sum + (s.maxGrade || 20), 0) / total
        : 0;

    return { total, active, avgCoefficient, avgMaxGrade };
  }, [subjects]);

  // Composant d'icône de tri
  const SortIcon = ({ columnKey }: { columnKey: keyof Subject }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-3 w-3 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  // Scroll vers les erreurs dans le formulaire
  useEffect(() => {
    if (Object.keys(errors).length > 0 && formRef.current) {
      const firstError = Object.keys(errors)[0];
      const errorElement = formRef.current.querySelector(
        `[name="${firstError}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [errors]);

  if (loading && subjects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">
            Chargement des matières...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-1">
        {/* Dialogue de suppression */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La matière{" "}
                <span className="font-semibold">{selectedSubject?.name}</span>{" "}
                sera définitivement supprimée.
                {selectedSubject &&
                  ((selectedSubject._count?.assignments || 0) > 0 ||
                    (selectedSubject._count?.grades || 0) > 0) && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                      <Info className="h-4 w-4 inline mr-1 text-amber-600" />
                      <span className="text-amber-700 text-sm">
                        Cette matière est utilisée dans{" "}
                        {selectedSubject._count?.assignments || 0} classe(s) et{" "}
                        {selectedSubject._count?.grades || 0} note(s)
                      </span>
                    </div>
                  )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={
                  selectedSubject &&
                  ((selectedSubject._count?.assignments || 0) > 0 ||
                    (selectedSubject._count?.grades || 0) > 0)
                }
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* En-tête avec actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Gestion des Matières
                </h1>
                <p className="text-muted-foreground">
                  {subjects.length} matière{subjects.length !== 1 ? "s" : ""}{" "}
                  enregistrée{subjects.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "grid" : "table")
                  }
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {viewMode === "table" ? "Vue grille" : "Vue tableau"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog
              open={isFormOpen}
              onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={resetForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle matière
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {editingSubject ? (
                          <Edit2 className="h-5 w-5 text-primary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <DialogTitle className="text-xl">
                          {editingSubject
                            ? `Modifier ${editingSubject.name}`
                            : "Nouvelle matière"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingSubject
                            ? "Modifiez les informations de la matière"
                            : "Renseignez les informations de la nouvelle matière"}
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFormOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>

                {/* Formulaire avec scroll */}
                <div
                  ref={formRef}
                  className="flex-1 overflow-y-auto px-6 py-4"
                  style={{ maxHeight: "calc(90vh - 200px)" }}
                >
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    id="subject-form"
                  >
                    {/* Informations principales */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Nom */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <Type className="h-4 w-4" />
                          Nom de la matière *
                        </Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Mathématiques, Physique..."
                          className={cn(
                            "h-11",
                            errors.name &&
                              "border-red-500 focus-visible:ring-red-500"
                          )}
                          autoFocus
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Code */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="code"
                            className="flex items-center gap-2"
                          >
                            <Hash className="h-4 w-4" />
                            Code unique *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRegenerateCode}
                                disabled={
                                  !nameValue || nameValue.trim().length < 2
                                }
                                className="h-7 px-2 text-xs"
                              >
                                {isGeneratingCode ? (
                                  <Clock className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <Sparkles className="h-3 w-3 mr-1" />
                                )}
                                Générer
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Générer un code basé sur le nom
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="code"
                            {...register("code")}
                            placeholder="MAT101"
                            className={cn(
                              "h-11 font-mono uppercase pl-3 pr-16",
                              errors.code &&
                                "border-red-500 focus-visible:ring-red-500"
                            )}
                            maxLength={8}
                            onChange={(e) => {
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              e.target.value = value;
                              register("code").onChange(e);
                            }}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {codeValue?.length || 0}/8
                            </Badge>
                          </div>
                        </div>
                        {errors.code && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {errors.code.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Paramètres d'évaluation */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Coefficient */}
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
                            {...register("coefficient", {
                              valueAsNumber: true,
                            })}
                            className={cn(
                              "h-11 pr-12",
                              errors.coefficient &&
                                "border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          <Badge className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            ×{coefficientValue || 1}
                          </Badge>
                        </div>
                        {errors.coefficient && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {errors.coefficient.message}
                          </p>
                        )}
                      </div>

                      {/* Note maximale */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="maxGrade"
                          className="flex items-center gap-2"
                        >
                          <Award className="h-4 w-4" />
                          Note maximale
                        </Label>
                        <Controller
                          name="maxGrade"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                            >
                              <SelectTrigger
                                id="maxGrade"
                                className={cn(
                                  "h-11",
                                  errors.maxGrade &&
                                    "border-red-500 focus-visible:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                {maxGradeOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.maxGrade && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {errors.maxGrade.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Description de la matière..."
                        className={cn(
                          "min-h-[100px] resize-none",
                          errors.description &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
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
                  </form>
                </div>

                {/* Footer fixe */}
                <DialogFooter className="px-6 py-4 border-t bg-background">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {isDirty && (
                        <span className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Modifications non enregistrées
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsFormOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        form="subject-form"
                        disabled={isSubmitting || !isValid}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Enregistrement...
                          </>
                        ) : editingSubject ? (
                          "Mettre à jour"
                        ) : (
                          "Créer la matière"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total matières
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.active} active{stats.active !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Moy. coefficient
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.avgCoefficient.toFixed(1)}
                  </p>
                  <div className="mt-2">
                    <Progress
                      value={(stats.avgCoefficient / 10) * 100}
                      className="h-1"
                    />
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                  <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Moy. note max</p>
                  <p className="text-2xl font-bold">
                    {Math.round(stats.avgMaxGrade)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">points</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisation</p>
                  <p className="text-2xl font-bold">
                    {subjects.reduce(
                      (acc, s) => acc + (s._count?.assignments || 0),
                      0
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    affectations actives
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des matières */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50px]">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedSubjects.size === subjects.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubjects(
                                new Set(subjects.map((s) => s.id))
                              );
                            } else {
                              setSelectedSubjects(new Set());
                            }
                          }}
                        />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort("code")}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3" />
                        <span>Code</span>
                        <SortIcon columnKey="code" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <Type className="h-3 w-3" />
                        <span>Nom</span>
                        <SortIcon columnKey="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort("coefficient")}
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="h-3 w-3" />
                        <span>Coeff</span>
                        <SortIcon columnKey="coefficient" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort("maxGrade")}
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-3 w-3" />
                        <span>Note max</span>
                        <SortIcon columnKey="maxGrade" />
                      </div>
                    </TableHead>
                    <TableHead>Utilisation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow
                      key={subject.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        !subject.isActive && "opacity-60"
                      )}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedSubjects.has(subject.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedSubjects);
                            if (e.target.checked) {
                              newSelected.add(subject.id);
                            } else {
                              newSelected.delete(subject.id);
                            }
                            setSelectedSubjects(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-semibold text-primary">
                          {subject.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{subject.name}</div>
                          {subject.description && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px] cursor-help">
                                  {subject.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm">{subject.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subject.coefficient >= 2 ? "default" : "outline"
                          }
                          className={cn(
                            "font-mono",
                            subject.coefficient >= 2 &&
                              "bg-primary/10 text-primary hover:bg-primary/20"
                          )}
                        >
                          ×{subject.coefficient}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {subject.maxGrade || 20}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              Classes:
                            </span>
                            <Badge variant="secondary" className="h-5 text-xs">
                              {subject._count?.assignments || 0}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              Notes:
                            </span>
                            <Badge variant="outline" className="h-5 text-xs">
                              {subject._count?.grades || 0}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(subject)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedSubject(subject);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {(subject._count?.assignments || 0) > 0 ||
                              (subject._count?.grades || 0) > 0
                                ? "Impossible de supprimer (utilisée)"
                                : "Supprimer"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSubjects.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {searchTerm ? "Aucun résultat" : "Aucune matière"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {searchTerm
                      ? `Aucune matière ne correspond à "${searchTerm}"`
                      : "Commencez par créer votre première matière"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une matière
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination et actions groupées */}
        {filteredSubjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              {selectedSubjects.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedSubjects.size} sélectionné
                    {selectedSubjects.size > 1 ? "s" : ""}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    Supprimer
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Affichage de {filteredSubjects.length} sur {subjects.length}{" "}
                matière
                {subjects.length > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ page: Math.max(1, filters.page - 1) })
                  }
                  disabled={filters.page === 1}
                >
                  ←
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.ceil(subjects.length / 10) },
                    (_, i) => i + 1
                  )
                    .slice(
                      Math.max(0, filters.page - 3),
                      Math.min(
                        Math.ceil(subjects.length / 10),
                        filters.page + 2
                      )
                    )
                    .map((page) => (
                      <Button
                        key={page}
                        variant={page === filters.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters({ page })}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ page: filters.page + 1 })}
                  disabled={filteredSubjects.length < 10}
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Erreur de chargement</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSubjects}
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
