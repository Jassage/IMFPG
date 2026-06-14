// components/students/StudentForm.tsx - AVEC CHAMP PHOTO
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/types/academic";
import { useClassStore } from "@/store/classStore";

import { useAcademicYearStore } from "@/store/academicYearStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  UserPlus,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldAlert,
  CheckCircle,
  Mail,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import useStudentStore from "@/store/studentStore";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Constantes pour les valeurs "vides"
const EMPTY_VALUES = {
  NOT_SPECIFIED: "not-specified",
  NO_CLASS: "no-class",
  NO_SEX: "no-sex",
  NO_BLOOD_GROUP: "no-blood-group",
  NO_ACADEMIC_YEAR: "no-academic-year",
  NO_RELATIONSHIP: "no-relationship",
} as const;

// Fonction utilitaire pour valider les dates
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date <= new Date();
};

// Fonction pour formater les dates
const formatDateForInput = (dateString?: string | Date): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Schéma pour un parent/tuteur avec validation améliorée
const guardianSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom contient des caractères invalides"),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides"),

  relationship: z
    .string()
    .min(1, "La relation est requise")
    .refine((value) => value !== EMPTY_VALUES.NO_RELATIONSHIP, {
      message: "Veuillez sélectionner une relation",
    }),

  phone: z
    .string()
    .min(1, "Le téléphone est requis")
    .refine(
      (phone) => {
        if (!phone) return false;
        const cleaned = phone.replace(/[\s\-()]/g, "");
        const phoneRegex = /^(\+509)\d{8}$/;
        return cleaned.length === 12 && phoneRegex.test(cleaned);
      },
      {
        message:
          "Format téléphone invalide. Utilisez +509XXXXXXXX (ex: +50944556677)",
      },
    ),

  email: z.string().email("Email invalide").optional().or(z.literal("")),

  address: z
    .string()
    .max(200, "L'adresse ne peut pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),

  isPrimary: z.boolean().default(false),
});

// Schéma principal avec date de naissance obligatoire
const studentSchema = z.object({
  // Informations personnelles
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom contient des caractères invalides"),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides"),

  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide")
    .refine((email) => email.includes("@"), "Email invalide"),

  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true;
        const cleaned = phone.replace(/[\s\-()]/g, "");
        const phoneRegex = /^(\+509)\d{8}$/;
        return cleaned.length === 12 && phoneRegex.test(cleaned);
      },
      {
        message:
          "Format téléphone invalide. Utilisez +509XXXXXXXX (ex: +50944556677)",
      },
    ),

  dateOfBirth: z
    .string()
    .min(1, "La date de naissance est requise")
    .refine(
      (date) => {
        if (!date || !isValidDate(date)) return false;

        const birthDate = new Date(date);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 13) return false;
        if (age > 25) return false;

        return true;
      },
      {
        message:
          "Date de naissance invalide. L'étudiant doit avoir entre 13 et 25 ans",
      },
    ),

  placeOfBirth: z
    .string()
    .max(100, "Le lieu de naissance ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "L'adresse ne peut pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),

  // NOUVEAU: Champ photo
  photo: z.string().optional().or(z.literal("")),

  photoFile: z.any().optional(), // Pour stocker le fichier temporairement

  bloodGroup: z.string().optional(),

  allergies: z
    .string()
    .max(500, "Les allergies ne peuvent pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  disabilities: z
    .string()
    .max(500, "Les handicaps ne peuvent pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),

  status: z.enum(["Active", "Inactive", "Graduated", "Suspended"]).optional(),

  sexe: z.string().optional(),

  classId: z
    .string()
    .min(1, "La classe est requise")
    .refine((value) => value !== EMPTY_VALUES.NO_CLASS, {
      message: "Veuillez sélectionner une classe",
    }),

  academicYearId: z
    .string()
    .min(1, "L'année académique est requise")
    .refine((value) => value !== EMPTY_VALUES.NO_ACADEMIC_YEAR, {
      message: "Veuillez sélectionner une année académique",
    }),

  guardians: z
    .array(guardianSchema)
    .min(1, "Au moins un parent/tuteur est requis")
    .refine((guardians) => guardians.some((g) => g.isPrimary), {
      message: "Un parent/tuteur principal doit être désigné",
    }),

  createUserAccount: z.boolean().default(false),
  sendWelcomeEmail: z.boolean().default(false),
});

type StudentFormData = z.infer<typeof studentSchema>;
type GuardianData = z.infer<typeof guardianSchema>;

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  isLoading?: boolean;
}

// Options pour les relations parentales
const RELATIONSHIP_OPTIONS = [
  { value: EMPTY_VALUES.NO_RELATIONSHIP, label: "Sélectionner une relation" },
  { value: "Père", label: "Père" },
  { value: "Mère", label: "Mère" },
  { value: "Tuteur", label: "Tuteur" },
  { value: "Grand-père", label: "Grand-père" },
  { value: "Grand-mère", label: "Grand-mère" },
  { value: "Oncle", label: "Oncle" },
  { value: "Tante", label: "Tante" },
  { value: "Frère", label: "Frère" },
  { value: "Sœur", label: "Sœur" },
  { value: "Autre", label: "Autre" },
];

// Options pour le groupe sanguin
const BLOOD_GROUP_OPTIONS = [
  { value: EMPTY_VALUES.NO_BLOOD_GROUP, label: "Non spécifié" },
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

// Options pour le sexe
const SEXE_OPTIONS = [
  { value: EMPTY_VALUES.NO_SEX, label: "Non spécifié" },
  { value: "M", label: "Masculin" },
  { value: "F", label: "Féminin" },
  { value: "Autre", label: "Autre" },
];

export const StudentForm = ({
  student,
  onClose,
  onSubmit,
  isLoading = false,
}: StudentFormProps) => {
  const { classes, fetchClasses } = useClassStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("student-info");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { fetchStudentById } = useStudentStore();
  const { createStudent, updateStudent } = useStudentStore();

  // États pour le tracking de la complétion
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(
    new Set(["student-info"]),
  );

  // État pour vérifier la disponibilité de l'email
  const [emailAvailability, setEmailAvailability] = useState<{
    checking: boolean;
    available?: boolean;
  }>({ checking: false });

  // Initialiser les données
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchClasses(), fetchAcademicYears()]);
      } catch (err) {
        console.error("Erreur lors de l'initialisation:", err);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible de charger les données initiales",
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [fetchClasses, fetchAcademicYears]);

  // Préparer les valeurs par défaut du formulaire
  const getDefaultValues = useCallback((): StudentFormData => {
    const defaultValues: StudentFormData = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      address: "",
      photo: "",
      photoFile: undefined,
      bloodGroup: EMPTY_VALUES.NO_BLOOD_GROUP,
      allergies: "",
      disabilities: "",
      sexe: EMPTY_VALUES.NO_SEX,
      classId: "",
      academicYearId: "",
      guardians: [
        {
          firstName: "",
          lastName: "",
          relationship: EMPTY_VALUES.NO_RELATIONSHIP,
          phone: "",
          email: "",
          address: "",
          isPrimary: true,
        },
      ],
      createUserAccount: false,
      sendWelcomeEmail: false,
    };

    return defaultValues;
  }, []);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  // Charger les données de l'étudiant pour l'édition
  useEffect(() => {
    const loadStudentData = async () => {
      if (!student?.id) {
        console.log("Mode création - Aucun étudiant à charger");
        return;
      }

      setIsLoadingDetails(true);
      setServerError(null);

      try {
        const fullStudent = await fetchStudentById(student.id);

        if (!fullStudent) {
          throw new Error("Impossible de charger les données de l'étudiant");
        }

        // Préparer les données pour le formulaire
        const studentData: Partial<StudentFormData> = {
          firstName: fullStudent.firstName || "",
          lastName: fullStudent.lastName || "",
          email: fullStudent.email || "",
          phone: fullStudent.phone || "",
          dateOfBirth: formatDateForInput(fullStudent.dateOfBirth) || "",
          placeOfBirth: fullStudent.placeOfBirth || "",
          address: fullStudent.address || "",
          photo: fullStudent.photo || "",
          bloodGroup: fullStudent.bloodGroup || EMPTY_VALUES.NO_BLOOD_GROUP,
          allergies: fullStudent.allergies || "",
          disabilities: fullStudent.disabilities || "",
          status: (fullStudent.status as "Active") || "Active",
          sexe: fullStudent.sexe || EMPTY_VALUES.NO_SEX,
          classId: fullStudent.classId || EMPTY_VALUES.NO_CLASS,
        };

        // Définir l'aperçu de la photo
        if (fullStudent.photo) {
          setPhotoPreview(fullStudent.photo);
        }

        // Gestion des gardiens
        if (fullStudent.guardians && fullStudent.guardians.length > 0) {
          studentData.guardians = fullStudent.guardians.map((guardian) => ({
            firstName: guardian.firstName || "",
            lastName: guardian.lastName || "",
            relationship: guardian.relationship || EMPTY_VALUES.NO_RELATIONSHIP,
            phone: guardian.phone || "",
            email: guardian.email || "",
            address: guardian.address || "",
            isPrimary: guardian.isPrimary || false,
          }));
        } else {
          studentData.guardians = [
            {
              firstName: "",
              lastName: "",
              relationship: EMPTY_VALUES.NO_RELATIONSHIP,
              phone: "",
              email: "",
              address: "",
              isPrimary: true,
            },
          ];
        }

        // Gestion de l'inscription
        if (fullStudent.enrollments && fullStudent.enrollments.length > 0) {
          const latestEnrollment = fullStudent.enrollments[0];
          studentData.academicYearId =
            latestEnrollment.academicYearId || EMPTY_VALUES.NO_ACADEMIC_YEAR;

          if (latestEnrollment.classId) {
            studentData.classId = latestEnrollment.classId;
          }
        }

        if (!studentData.academicYearId && academicYears.length > 0) {
          const currentYear = academicYears.find((year) => year.isCurrent);
          if (currentYear) {
            studentData.academicYearId = currentYear.id;
          }
        }

        form.reset(studentData as StudentFormData);

        setCompletedTabs(new Set(["student-info", "guardians", "enrollment"]));

        toast({
          title: "Données chargées",
          description: "Les données de l'étudiant ont été chargées avec succès",
        });
      } catch (error: any) {
        const errorMessage =
          error.message || "Erreur lors du chargement des données";
        setServerError(errorMessage);

        toast({
          title: "Erreur de chargement",
          description: errorMessage,
          variant: "destructive",
        });

        form.reset(getDefaultValues());
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadStudentData();
  }, [student?.id, fetchStudentById, academicYears, form, getDefaultValues]);

  // Fonction pour gérer l'upload de photo
  // StudentForm.tsx - Version corrigée de handlePhotoUpload

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    console.log("📸 Fichier sélectionné:", file.name, file.type, file.size);
    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format invalide",
        description: "Veuillez uploader une image (JPEG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Créer un aperçu local
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);

      // Stocker le fichier directement (pas en base64)
      form.setValue("photoFile", file);
      form.setValue("photo", previewUrl); // Pour l'aperçu

      console.log("✅ Photo stockée dans le formulaire");

      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Nettoyer les URLs blob
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // CORRECTION: Nettoyer l'URL object lors du démontage
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // Fonction pour supprimer la photo
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    form.setValue("photo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Photo supprimée",
      description: "La photo a été supprimée",
    });
  };

  // Fonction pour vérifier la disponibilité de l'email
  const checkEmailAvailability = useCallback(
    async (email: string) => {
      if (!email || !email.includes("@")) {
        setEmailAvailability({ checking: false, available: undefined });
        return;
      }

      setEmailAvailability({ checking: true, available: undefined });

      try {
        setTimeout(() => {
          const isAvailable = !student || student.email !== email;
          setEmailAvailability({ checking: false, available: isAvailable });
        }, 500);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        setEmailAvailability({ checking: false, available: undefined });
      }
    },
    [student],
  );

  // Calcul du pourcentage de complétion
  const calculateCompletion = () => {
    const values = form.getValues();
    let completed = 0;
    let total = 0;

    const requiredFields = [
      { key: "firstName", value: values.firstName },
      { key: "lastName", value: values.lastName },
      { key: "email", value: values.email },
      { key: "dateOfBirth", value: values.dateOfBirth },
      { key: "classId", value: values.classId },
      { key: "academicYearId", value: values.academicYearId },
    ];

    requiredFields.forEach(({ value }) => {
      total++;
      if (value && value.trim()) completed++;
    });

    if (values.guardians && values.guardians.length > 0) {
      const guardian = values.guardians[0];
      const guardianFields = [
        guardian.firstName,
        guardian.lastName,
        guardian.relationship,
        guardian.phone,
      ];

      guardianFields.forEach((value) => {
        total++;
        if (value && value !== EMPTY_VALUES.NO_RELATIONSHIP) completed++;
      });
    }

    return Math.round((completed / total) * 100);
  };

  // Validation de l'onglet actuel
  const validateCurrentTab = async (): Promise<boolean> => {
    const tabValidations: Record<string, (keyof StudentFormData)[]> = {
      "student-info": [
        "firstName",
        "lastName",
        "email",
        "phone",
        "dateOfBirth",
      ],
      guardians: ["guardians"],
      enrollment: ["classId", "academicYearId"],
    };

    const fields = tabValidations[currentTab];
    if (!fields) return true;

    const result = await form.trigger(fields as any);

    if (result) {
      setCompletedTabs((prev) => new Set([...prev, currentTab]));
    }

    return result;
  };

  // Navigation entre onglets
  const handleTabChange = async (value: string) => {
    if (value === currentTab) return;

    const isValid = await validateCurrentTab();
    if (!isValid) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de continuer",
        variant: "destructive",
      });
      return;
    }

    setCurrentTab(value);
  };

  // Soumission du formulaire
  // StudentForm.tsx - Dans handleSubmit, corriger l'envoi de la photo

  // StudentForm.tsx - Dans handleSubmit
  // StudentForm.tsx - Dans handleSubmit
  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);

    try {
      let requestData: any;
      let isMultipart = false;

      // CORRECTION: Vérification plus stricte
      const hasPhotoToUpload = data.photoFile instanceof File;

      console.log("🔍 Vérification photo:", {
        hasPhotoToUpload,
        photoFileType:
          data.photoFile instanceof File ? "File" : typeof data.photoFile,
        photoPreview: photoPreview
          ? photoPreview.startsWith("blob:")
            ? "blob"
            : "url"
          : "none",
      });

      if (hasPhotoToUpload) {
        isMultipart = true;
        const formData = new FormData();

        // Ajouter tous les champs
        Object.keys(data).forEach((key) => {
          if (key === "photoFile") return; // Skip le champ photoFile
          if (key === "photo") return; // Skip l'ancienne photo

          const value = data[key as keyof StudentFormData];

          if (key === "guardians" && value) {
            formData.append(key, JSON.stringify(value));
          } else if (
            key === "createUserAccount" &&
            typeof value === "boolean"
          ) {
            formData.append(key, String(value));
          } else if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
          }
        });

        // Ajouter la photo (IMPORTANT: le champ doit s'appeler "photo")
        const photoFile = data.photoFile as File;
        formData.append("photo", photoFile);
        console.log(
          "📤 Photo ajoutée au FormData:",
          photoFile.name,
          photoFile.type,
          photoFile.size,
        );

        requestData = formData;
      } else {
        // Mode JSON
        isMultipart = false;
        requestData = { ...data };
        delete requestData.photoFile;

        // Si suppression de photo
        if (data.photo === null || data.photo === "") {
          requestData.photo = null;
        }
      }

      console.log("📤 Envoi de la requête:", {
        isMultipart,
        hasPhoto: isMultipart ? true : !!requestData.photo,
        contentType: isMultipart ? "multipart/form-data" : "application/json",
      });

      if (student) {
        await updateStudent(student.id, requestData);
        toast({ title: "Succès", description: "Étudiant modifié avec succès" });
      } else {
        await createStudent(requestData);
        toast({ title: "Succès", description: "Étudiant créé avec succès" });
      }

      onClose();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des parents/tuteurs
  const guardians = form.watch("guardians");

  const addGuardian = () => {
    const currentGuardians = form.getValues("guardians");
    if (currentGuardians.length >= 5) {
      toast({
        title: "Limite atteinte",
        description: "Vous ne pouvez ajouter que 5 parents/tuteurs maximum",
        variant: "destructive",
      });
      return;
    }

    form.setValue("guardians", [
      ...currentGuardians,
      {
        firstName: "",
        lastName: "",
        relationship: EMPTY_VALUES.NO_RELATIONSHIP,
        phone: "",
        email: "",
        address: "",
        isPrimary: false,
      },
    ]);
  };

  const removeGuardian = (index: number) => {
    const currentGuardians = form.getValues("guardians");
    if (currentGuardians.length <= 1) {
      toast({
        title: "Action impossible",
        description: "Au moins un parent/tuteur est requis",
        variant: "destructive",
      });
      return;
    }

    const guardianToRemove = currentGuardians[index];
    const newGuardians = currentGuardians.filter((_, i) => i !== index);

    if (guardianToRemove.isPrimary && newGuardians.length > 0) {
      newGuardians[0].isPrimary = true;
    }

    form.setValue("guardians", newGuardians);
    form.trigger("guardians");
  };

  const setPrimaryGuardian = (index: number) => {
    const currentGuardians = form.getValues("guardians");
    const newGuardians = currentGuardians.map((guardian, i) => ({
      ...guardian,
      isPrimary: i === index,
    }));
    form.setValue("guardians", newGuardians);
  };

  // Filtrer les classes actives
  const activeClasses = classes.filter((cls) => cls.status === "Active");

  // Fonction pour formater le téléphone
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";

    const cleaned = phone.replace(/[\s\-()]/g, "");

    if (cleaned.startsWith("+509") && cleaned.length === 12) {
      return `+509 ${cleaned.slice(4, 6)} ${cleaned.slice(
        6,
        8,
      )} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
    }

    return phone;
  };

  // Gestionnaire de changement de téléphone
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    if (formatted !== value) {
      e.target.value = formatted;
    }
    onChange(e.target.value);
  };

  // Suivi des changements d'email
  useEffect(() => {
    const email = form.watch("email");
    if (email && email.includes("@")) {
      const timer = setTimeout(() => {
        checkEmailAvailability(email);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [form.watch("email"), checkEmailAvailability]);

  if (isLoadingDetails) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Chargement des données de l'élève...
          </p>
          <p className="text-sm text-gray-500">
            Veuillez patienter pendant le chargement des informations
          </p>
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">
              Impossible de charger les données
            </p>
            <p className="text-sm">{serverError}</p>
          </AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {student ? "Modifier l'élève" : "Nouvel élève"}
          </h3>
          <Badge variant={completedTabs.size === 3 ? "default" : "outline"}>
            {calculateCompletion()}% complété
          </Badge>
        </div>
        <Progress value={calculateCompletion()} className="h-2" />
      </div>

      {/* Messages d'erreur globaux */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Onglets */}
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="student-info" className="relative">
            Informations élèves
            {completedTabs.has("student-info") &&
              !form.formState.errors.firstName &&
              !form.formState.errors.lastName &&
              !form.formState.errors.email &&
              !form.formState.errors.dateOfBirth && (
                <Check className="h-3 w-3 ml-1 text-green-500" />
              )}
          </TabsTrigger>
          <TabsTrigger value="guardians" className="relative">
            Parents/Tuteurs
            {completedTabs.has("guardians") &&
              !form.formState.errors.guardians && (
                <Check className="h-3 w-3 ml-1 text-green-500" />
              )}
          </TabsTrigger>
          <TabsTrigger value="enrollment" className="relative">
            Inscription
            {completedTabs.has("enrollment") &&
              !form.formState.errors.classId &&
              !form.formState.errors.academicYearId && (
                <Check className="h-3 w-3 ml-1 text-green-500" />
              )}
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Onglet Informations étudiant */}
            <TabsContent value="student-info" className="space-y-6">
              {/* Section Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Photo de profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar avec aperçu */}
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-primary/20">
                        <AvatarImage src={photoPreview || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                          {form.watch("firstName")?.[0] || ""}
                          {form.watch("lastName")?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>

                      {/* Badge de chargement */}
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {photoPreview
                          ? "Changer la photo"
                          : "Ajouter une photo"}
                      </Button>

                      {photoPreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemovePhoto}
                          disabled={isUploadingPhoto}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log(
                            "📁 Fichier sélectionné par l'utilisateur:",
                            file.name,
                          );
                          handlePhotoUpload(file);
                        }
                        // Reset l'input pour permettre de sélectionner le même fichier à nouveau
                        e.target.value = "";
                      }}
                    />
                    <FormDescription className="text-center">
                      Formats acceptés: JPEG, PNG, WEBP. Taille max: 5MB
                    </FormDescription>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Prénom"
                              disabled={isSubmitting}
                              className={
                                form.formState.errors.firstName
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nom"
                              disabled={isSubmitting}
                              className={
                                form.formState.errors.lastName
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="email"
                                placeholder="email@example.com"
                                disabled={isSubmitting || !!student}
                                className={
                                  form.formState.errors.email
                                    ? "border-red-500"
                                    : ""
                                }
                                onChange={(e) => {
                                  field.onChange(e);
                                  setEmailAvailability({
                                    checking: false,
                                    available: undefined,
                                  });
                                }}
                              />
                              {emailAvailability.checking && (
                                <div className="absolute right-3 top-3">
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                </div>
                              )}
                              {emailAvailability.available !== undefined &&
                                !form.formState.errors.email && (
                                  <div className="absolute right-3 top-3">
                                    {emailAvailability.available ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="+509 44 55 66 77"
                              disabled={isSubmitting}
                              className={
                                form.formState.errors.phone
                                  ? "border-red-500"
                                  : ""
                              }
                              onChange={(e) =>
                                handlePhoneChange(e, field.onChange)
                              }
                              maxLength={15}
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription className="text-xs">
                            Format: +509XXXXXXXX (ex: +50944556677)
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              disabled={isSubmitting}
                              className={
                                form.formState.errors.dateOfBirth
                                  ? "border-red-500"
                                  : ""
                              }
                              max={new Date().toISOString().split("T")[0]}
                              min={
                                new Date(new Date().getFullYear() - 100, 0, 1)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription className="text-xs">
                            L'étudiant doit avoir entre 13 et 25 ans
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="placeOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu de naissance</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Lieu de naissance"
                              disabled={isSubmitting}
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sexe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexe</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SEXE_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Adresse complète"
                            disabled={isSubmitting}
                            rows={2}
                            maxLength={200}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations médicales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Groupe sanguin</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BLOOD_GROUP_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Allergies connues (ex: Pollen, Arachides, Lactose)"
                            disabled={isSubmitting}
                            rows={2}
                            maxLength={500}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disabilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Handicaps / Besoins spéciaux</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Handicaps ou besoins spéciaux"
                            disabled={isSubmitting}
                            rows={2}
                            maxLength={500}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Parents/Tuteurs (inchangé) */}
            <TabsContent value="guardians" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Parents/Tuteurs</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ajoutez au moins un parent ou tuteur responsable de
                        l'étudiant
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={addGuardian}
                      size="sm"
                      disabled={guardians.length >= 5}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guardians.map((guardian, index) => (
                    <Card
                      key={index}
                      className={
                        guardian.isPrimary ? "border-primary border-2" : ""
                      }
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                guardian.isPrimary ? "default" : "outline"
                              }
                              className="text-xs"
                            >
                              {guardian.isPrimary ? "Principal" : "Secondaire"}
                            </Badge>
                            {!guardian.isPrimary && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setPrimaryGuardian(index)}
                                className="h-6 px-2 text-xs"
                              >
                                Définir comme principal
                              </Button>
                            )}
                          </div>
                          {guardians.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGuardian(index)}
                              className="h-6 w-6 p-0"
                              disabled={guardian.isPrimary}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`guardians.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Prénom"
                                    disabled={isSubmitting}
                                    maxLength={50}
                                    className={
                                      form.formState.errors.guardians?.[index]
                                        ?.firstName
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`guardians.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nom"
                                    disabled={isSubmitting}
                                    maxLength={50}
                                    className={
                                      form.formState.errors.guardians?.[index]
                                        ?.lastName
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`guardians.${index}.relationship`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relation *</FormLabel>
                                <Select
                                  value={
                                    field.value || EMPTY_VALUES.NO_RELATIONSHIP
                                  }
                                  onValueChange={field.onChange}
                                  disabled={isSubmitting}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className={
                                        form.formState.errors.guardians?.[index]
                                          ?.relationship
                                          ? "border-red-500"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {RELATIONSHIP_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`guardians.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone *</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="+509 44 55 66 77"
                                    disabled={isSubmitting}
                                    className={
                                      form.formState.errors.guardians?.[index]
                                        ?.phone
                                        ? "border-red-500"
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handlePhoneChange(e, field.onChange)
                                    }
                                    maxLength={15}
                                  />
                                </FormControl>
                                <FormMessage />
                                <FormDescription className="text-xs">
                                  Format: +509XXXXXXXX
                                </FormDescription>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`guardians.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="email@example.com"
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`guardians.${index}.address`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adresse</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Adresse"
                                    disabled={isSubmitting}
                                    maxLength={200}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Inscription */}
            <TabsContent value="enrollment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inscription à une classe</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez la classe et l'année académique pour inscrire
                    l'étudiant
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classe *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isSubmitting || activeClasses.length === 0
                            }
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  form.formState.errors.classId
                                    ? "border-red-500"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Sélectionner une classe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeClasses.length === 0 ? (
                                <SelectItem value="no-classes" disabled>
                                  Aucune classe active disponible
                                </SelectItem>
                              ) : (
                                activeClasses.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.level}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="academicYearId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année académique *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isSubmitting || academicYears.length === 0
                            }
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  form.formState.errors.academicYearId
                                    ? "border-red-500"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Sélectionner une année" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {academicYears.length === 0 ? (
                                <SelectItem value="no-years" disabled>
                                  Aucune année académique disponible
                                </SelectItem>
                              ) : (
                                academicYears.map((year) => (
                                  <SelectItem key={year.id} value={year.id}>
                                    {year.year} {year.isCurrent && "(En cours)"}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Afficher le champ statut seulement pour l'édition */}
                  {student && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut de l'étudiant *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  form.formState.errors.status
                                    ? "border-red-500"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Actif</SelectItem>
                              <SelectItem value="Inactive">Inactif</SelectItem>
                              <SelectItem value="Graduated">Diplômé</SelectItem>
                              <SelectItem value="Suspended">
                                Suspendu
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Options supplémentaires pour la création */}
                  {!student && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Options supplémentaires</h4>

                      <FormField
                        control={form.control}
                        name="createUserAccount"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Créer un compte utilisateur
                              </FormLabel>
                              <FormDescription className="text-xs">
                                L'étudiant pourra se connecter avec son email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <Separator />

            {/* Boutons d'action */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                {currentTab !== "student-info" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const prevTab =
                        currentTab === "enrollment"
                          ? "guardians"
                          : currentTab === "guardians"
                            ? "student-info"
                            : "student-info";
                      setCurrentTab(prevTab);
                    }}
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>

                {currentTab === "enrollment" ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {student ? "Modification..." : "Création..."}
                      </>
                    ) : student ? (
                      "Modifier l'étudiant"
                    ) : (
                      "Créer l'étudiant"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      const nextTab =
                        currentTab === "student-info"
                          ? "guardians"
                          : currentTab === "guardians"
                            ? "enrollment"
                            : "enrollment";
                      setCurrentTab(nextTab);
                    }}
                    disabled={isSubmitting}
                  >
                    Suivant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};
