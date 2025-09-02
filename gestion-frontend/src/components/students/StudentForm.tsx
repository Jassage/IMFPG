import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Correction de l'import
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { useAcademicStore } from "../../store/studentStore";
import { Student, Guardian } from "../../types/academic";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useFacultyStore } from "@/store/facultyStore";
import { useAcademicYearStore } from "@/store/academicYearStore";

// Schéma de validation
const studentSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  studentId: z.string().min(1, "L'ID étudiant est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  disabilities: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Graduated"]),
});

const guardianSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  relationship: z.string().min(1, "Le lien de parenté est requis"),
  phone: z.string().min(8, "Le téléphone est requis"),
  email: z.string().email("Email invalide").or(z.literal("")),
  address: z.string().optional(),
  isPrimary: z.boolean(),
});

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
}

export const StudentForm = ({ student, onClose }: StudentFormProps) => {
  const { addStudent, updateStudent } = useAcademicStore();
  const { faculties } = useFacultyStore();
  const { academicYears } = useAcademicYearStore();

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentId: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      address: "",
      bloodGroup: "",
      allergies: "",
      disabilities: "",
      status: "Active",
      facultyId: "",
      level: "L1",
      academicYearId: "",
    },
  });

  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      firstName: "",
      lastName: "",
      relationship: "Père",
      phone: "",
      email: "",
      address: "",
      isPrimary: true,
      studentId: "",
    },
  ]);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Génération automatique de l'ID étudiant
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `STU${year}${random}`;
  };

  useEffect(() => {
    if (!student) {
      form.setValue("studentId", generateStudentId());

      // Définir l'année académique courante par défaut
      const currentAcademicYear = academicYears.find((ay) => ay.isCurrent);
      if (currentAcademicYear) {
        form.setValue("academicYearId", currentAcademicYear.id);
      }
    }

    if (student) {
      form.reset({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        studentId: student.studentId || "",
        email: student.email || "",
        phone: student.phone || "",
        dateOfBirth: student.dateOfBirth || "",
        placeOfBirth: student.placeOfBirth || "",
        address: student.address || "",
        bloodGroup: student.bloodGroup || "",
        allergies: student.allergies || "",
        disabilities: student.disabilities || "",
        status: student.status || "Active",
      });

      if (student.guardians && student.guardians.length > 0) {
        setGuardians(student.guardians);
      }
    }
  }, [student, form, academicYears]);

  const addGuardian = () => {
    setGuardians([
      ...guardians,
      {
        firstName: "",
        lastName: "",
        relationship: "Mère",
        phone: "",
        email: "",
        address: "",
        isPrimary: false,
        studentId: "",
      },
    ]);
  };

  const removeGuardian = (index: number) => {
    if (guardians.length > 1) {
      const updatedGuardians = guardians.filter((_, i) => i !== index);

      // Si on supprime le responsable principal, désigner le premier comme principal
      if (guardians[index].isPrimary && updatedGuardians.length > 0) {
        updatedGuardians[0].isPrimary = true;
      }

      setGuardians(updatedGuardians);
    }
  };

  const updateGuardian = (
    index: number,
    field: keyof Guardian,
    value: string | boolean
  ) => {
    const updatedGuardians = [...guardians];
    updatedGuardians[index] = { ...updatedGuardians[index], [field]: value };
    setGuardians(updatedGuardians);
  };

  const setPrimaryGuardian = (index: number) => {
    const updatedGuardians = guardians.map((guardian, i) => ({
      ...guardian,
      isPrimary: i === index,
    }));
    setGuardians(updatedGuardians);
  };

  const validateGuardians = () => {
    for (const guardian of guardians) {
      try {
        guardianSchema.parse(guardian);
      } catch (error) {
        return false;
      }
    }
    return guardians.some((g) => g.isPrimary);
  };

  const onSubmit = async (data: any) => {
    if (!validateGuardians()) {
      toast({
        title: "Erreur de validation",
        description:
          "Veuillez corriger les informations des responsables et désigner un responsable principal",
        variant: "destructive",
      });
      console.log("erreur");

      return;
    }

    const studentData: Student = {
      id: student?.id || crypto.randomUUID(),
      ...data,
      guardians: guardians.filter((g) => g.firstName && g.lastName && g.phone),
      createdAt: student?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retakes: [],
    };

    console.log(studentData);

    try {
      if (student) {
        await updateStudent(student.id, studentData);
        toast({
          title: "Succès",
          description: "Étudiant modifié avec succès",
        });
      } else {
        await addStudent(studentData);
        toast({
          title: "Succès",
          description: "Étudiant créé avec succès",
        });
      }

      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-screen overflow-y-auto p-1"
      >
        {/* Informations de l'étudiant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations de l'étudiant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photo de profil */}
            <div className="space-y-2">
              <Label>Photo de profil</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setProfileImage(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Étudiant *</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
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
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de Naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de Naissance</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Groupe Sanguin</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Handicaps</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Actif</SelectItem>
                      <SelectItem value="Inactive">Inactif</SelectItem>
                      <SelectItem value="Graduated">Diplômé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        {/* Responsables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personnes responsables ({guardians.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guardians.map((guardian, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Responsable {index + 1}</h4>
                  {guardians.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuardian(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={guardian.firstName}
                      onChange={(e) =>
                        updateGuardian(index, "firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={guardian.lastName}
                      onChange={(e) =>
                        updateGuardian(index, "lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lien de parenté *</Label>
                    <Select
                      value={guardian.relationship}
                      onValueChange={(value) =>
                        updateGuardian(index, "relationship", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un lien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Père">Père</SelectItem>
                        <SelectItem value="Mère">Mère</SelectItem>
                        <SelectItem value="Tuteur">Tuteur</SelectItem>
                        <SelectItem value="Tutrice">Tutrice</SelectItem>
                        <SelectItem value="Frère">Frère</SelectItem>
                        <SelectItem value="Sœur">Sœur</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input
                      value={guardian.phone}
                      onChange={(e) =>
                        updateGuardian(index, "phone", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={guardian.email || ""}
                      onChange={(e) =>
                        updateGuardian(index, "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={guardian.address || ""}
                      onChange={(e) =>
                        updateGuardian(index, "address", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={guardian.isPrimary}
                    onChange={() => setPrimaryGuardian(index)}
                    className="h-4 w-4"
                  />
                  <Label>Responsable principal</Label>
                </div>
              </div>
            ))}

            <Button type="button" onClick={addGuardian} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un responsable
            </Button>
          </CardContent>
        </Card>

        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            {student ? "Modifier" : "Créer"} l'étudiant
          </Button>
        </div>
      </form>
    </Form>
  );
};
