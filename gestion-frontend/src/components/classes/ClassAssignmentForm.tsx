import React, { useEffect, useState } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Interface pour les données du formulaire - TOUTES les propriétés sont requises
interface AssignmentFormData {
  subjectId: string;
  professeurId: string;
  classLevel: string;
  academicYearId: string;
  status: "Active" | "Inactive";
}

// Schéma Zod avec TOUTES les propriétés REQUISES
const formSchema = z.object({
  subjectId: z.string().min(1, "La matière est requise"),
  professeurId: z.string().min(1, "Le professeur est requis"),
  classLevel: z.string().min(1, "La classe est requise"),
  academicYearId: z.string().min(1, "L'année académique est requise"),
  status: z.enum(["Active", "Inactive"]),
});

// Type TypeScript déduit du schéma Zod
type FormValues = z.infer<typeof formSchema>;

interface ClassAssignmentFormProps {
  assignment?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClassAssignmentForm({
  assignment,
  onSuccess,
  onCancel,
}: ClassAssignmentFormProps) {
  const {
    createAssignment,
    updateAssignment,
    loading,
    subjects,
    professeurs,
    academicYears,
    classLevels,
  } = useAssignmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: assignment?.subjectId || "",
      professeurId: assignment?.professeurId || "",
      classLevel: assignment?.classLevel || "",
      academicYearId: assignment?.academicYearId || "",
      status: assignment?.status || "Active",
    },
    mode: "onChange", // Valide au fur et à mesure
  });

  // Vérifie si le formulaire est valide
  const isFormValid = form.formState.isValid;

  // Mettre à jour les valeurs par défaut si l'assignation change
  useEffect(() => {
    if (assignment) {
      form.reset({
        subjectId: assignment.subjectId || "",
        professeurId: assignment.professeurId || "",
        classLevel: assignment.classLevel || "",
        academicYearId: assignment.academicYearId || "",
        status: assignment.status || "Active",
      });
    }
  }, [assignment, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Convertir les valeurs du formulaire en données d'assignation
      // Toutes les propriétés sont garanties d'être présentes grâce à Zod
      const assignmentData = {
        subjectId: values.subjectId,
        professeurId: values.professeurId,
        classLevel: values.classLevel,
        academicYearId: values.academicYearId,
        status: values.status,
      };

      if (assignment) {
        await updateAssignment(assignment.id, assignmentData);
        toast({
          title: "✅ Assignation mise à jour",
          description: "L'assignation a été modifiée avec succès",
        });
      } else {
        await createAssignment(assignmentData);
        toast({
          title: "✅ Assignation créée",
          description: "La nouvelle assignation a été créée avec succès",
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Matière <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une matière" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucune matière disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professeurId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Professeur <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un professeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professeurs.length > 0 ? (
                      professeurs.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.firstName} {prof.lastName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucun professeur disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Classe/Niveau <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une classe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classLevels.length > 0 ? (
                      classLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucune classe disponible
                      </SelectItem>
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
                <FormLabel>
                  Année académique <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une année" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears.length > 0 ? (
                      academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.year} {year.isCurrent ? "(En cours)" : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucune année disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Statut</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Activez ou désactivez cette assignation
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "Active"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "Active" : "Inactive")
                  }
                  disabled={isSubmitting || loading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading || !isFormValid}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {assignment ? "Modification..." : "Création..."}
              </>
            ) : assignment ? (
              "Modifier l'assignation"
            ) : (
              "Créer l'assignation"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
