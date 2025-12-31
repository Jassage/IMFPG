"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calculator,
  User,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DocumentType,
  ControlType,
  ClassLevel,
  DocumentLanguage,
  CreateTranscriptData,
} from "@/types/transcript";

const formSchema = z.object({
  studentId: z.string().min(1, "L'étudiant est requis"),
  academicYearId: z.string().min(1, "L'année académique est requise"),
  controlType: z.nativeEnum(ControlType),
  classLevel: z.nativeEnum(ClassLevel),
  documentType: z.nativeEnum(DocumentType).default(DocumentType.BULLETIN),
  language: z.nativeEnum(DocumentLanguage).default(DocumentLanguage.FR),
  withSignature: z.boolean().default(true),
  withStamp: z.boolean().default(true),
  notes: z.string().optional(),
});

interface TranscriptFormProps {
  mode: "create" | "edit";
  initialData?: any;
  onSubmit: (data: CreateTranscriptData) => void;
  onCancel: () => void;
}

export default function TranscriptForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: TranscriptFormProps) {
  const [step, setStep] = useState(0);
  const [students, setStudents] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [availableGrades, setAvailableGrades] = useState<any[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(
    initialData?.grades || []
  );
  const [statistics, setStatistics] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      controlType: ControlType.CONTROLE_1,
      classLevel: ClassLevel.SIXIEME,
      documentType: DocumentType.BULLETIN,
      language: DocumentLanguage.FR,
      withSignature: true,
      withStamp: true,
    },
  });

  const watchStudentId = form.watch("studentId");
  const watchAcademicYearId = form.watch("academicYearId");
  const watchControlType = form.watch("controlType");
  const watchClassLevel = form.watch("classLevel");

  useEffect(() => {
    // Simuler le chargement des données
    const mockStudents = [
      { id: "1", firstName: "Jean", lastName: "Dupont", studentCode: "ET001" },
      { id: "2", firstName: "Marie", lastName: "Martin", studentCode: "ET002" },
    ];
    setStudents(mockStudents);

    const mockYears = [
      { id: "1", year: "2023-2024", isCurrent: true },
      { id: "2", year: "2024-2025", isCurrent: false },
    ];
    setAcademicYears(mockYears);
  }, []);

  useEffect(() => {
    if (
      watchStudentId &&
      watchAcademicYearId &&
      watchControlType &&
      watchClassLevel
    ) {
      const mockGrades = [
        {
          id: "g1",
          grade: 15,
          maxGrade: 20,
          subject: { name: "Mathématiques", coefficient: 3, passingGrade: 10 },
        },
        {
          id: "g2",
          grade: 18,
          maxGrade: 20,
          subject: { name: "Physique", coefficient: 2, passingGrade: 10 },
        },
      ];
      setAvailableGrades(mockGrades);
    }
  }, [watchStudentId, watchAcademicYearId, watchControlType, watchClassLevel]);

  const calculateStatistics = () => {
    const selected = availableGrades.filter((g) =>
      selectedGrades.includes(g.id)
    );
    if (selected.length === 0) return;

    const totalCoefficients = selected.reduce(
      (sum, g) => sum + g.subject.coefficient,
      0
    );
    const weightedSum = selected.reduce((sum, g) => {
      const normalized = (g.grade / g.maxGrade) * 20;
      return sum + normalized * g.subject.coefficient;
    }, 0);

    const average = totalCoefficients > 0 ? weightedSum / totalCoefficients : 0;
    const passed = selected.filter(
      (g) => g.grade >= g.subject.passingGrade
    ).length;
    const successRate = (passed / selected.length) * 100;

    setStatistics({
      average: average.toFixed(2),
      successRate: successRate.toFixed(2),
      totalSubjects: selected.length,
      passed,
      failed: selected.length - passed,
      totalCoefficients,
    });
  };

  useEffect(() => {
    calculateStatistics();
  }, [selectedGrades]);

  const steps = [
    {
      title: "Informations",
      icon: User,
      description:
        "Remplissez les informations de l'étudiant et l'année académique",
    },
    {
      title: "Notes",
      icon: Calculator,
      description: "Sélectionnez les notes à inclure dans le transcript",
    },
    {
      title: "Configuration",
      icon: Settings,
      description:
        "Choisissez le type de document et les options de génération",
    },
    {
      title: "Confirmation",
      icon: CheckCircle2,
      description: "Vérifiez et confirmez les informations avant création",
    },
  ];

  const handleNext = () => {
    if (step === 0) {
      if (!watchStudentId || !watchAcademicYearId) {
        return;
      }
    }
    if (step === 1) {
      if (selectedGrades.length === 0) {
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmitForm = (values: z.infer<typeof formSchema>) => {
    const payload: CreateTranscriptData = {
      studentId: values.studentId!,
      academicYearId: values.academicYearId!,
      controlType: values.controlType,
      classLevel: values.classLevel,
      documentType: values.documentType,
      language: values.language,
      withSignature: values.withSignature,
      withStamp: values.withStamp,
      grades: selectedGrades,
      statistics: statistics
        ? {
            gpa: parseFloat(statistics.average),
            successRate: parseFloat(statistics.successRate),
            totalCredits: statistics.totalSubjects * 3,
            creditsEarned: statistics.passed * 3,
            average: parseFloat(statistics.average),
          }
        : undefined,
    };

    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create"
            ? "Créer un nouveau transcript"
            : "Modifier le transcript"}
        </CardTitle>
        <CardDescription>
          {steps[step].description || "Remplissez les informations requises"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <React.Fragment key={s.title}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      index <= step
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-sm">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={(step / (steps.length - 1)) * 100} className="h-2" />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            {step === 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Étudiant</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un étudiant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.lastName} {student.firstName} (
                              {student.studentCode})
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
                  name="academicYearId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année académique</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une année" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year.id} value={year.id}>
                              {year.year} {year.isCurrent && "(actuelle)"}
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
                  name="controlType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de contrôle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ControlType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace("_", " ")}
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
                  name="classLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ClassLevel).map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Sélection des notes</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedGrades.length} note(s) sélectionnée(s)
                  </p>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b p-4 font-medium">
                    <div className="col-span-2">Matière</div>
                    <div className="text-center">Note</div>
                    <div className="text-center">Coefficient</div>
                    <div className="text-center">Statut</div>
                  </div>
                  {availableGrades.map((grade) => {
                    const isSelected = selectedGrades.includes(grade.id);
                    const isPassed = grade.grade >= grade.subject.passingGrade;
                    const normalized = (grade.grade / grade.maxGrade) * 20;

                    return (
                      <div
                        key={grade.id}
                        className={`grid grid-cols-5 items-center p-4 border-b hover:bg-muted/50 cursor-pointer ${
                          isSelected ? "bg-primary/5" : ""
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGrades((prev) =>
                              prev.filter((id) => id !== grade.id)
                            );
                          } else {
                            setSelectedGrades((prev) => [...prev, grade.id]);
                          }
                        }}
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <Checkbox checked={isSelected} />
                          <div>
                            <div className="font-medium">
                              {grade.subject.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Note sur {grade.maxGrade}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">{grade.grade}</div>
                          <div className="text-sm text-muted-foreground">
                            ({normalized.toFixed(1)}/20)
                          </div>
                        </div>
                        <div className="text-center">
                          {grade.subject.coefficient}
                        </div>
                        <div className="text-center">
                          {isPassed ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Réussi
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 hover:bg-red-100"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Échoué
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {statistics && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {statistics.average}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Moyenne /20
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {statistics.successRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Taux de réussite
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {statistics.passed}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Réussis
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {statistics.failed}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Échoués
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de document</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(DocumentType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0) + word.slice(1).toLowerCase()
                                )
                                .join(" ")}
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
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Langue</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FR">Français</SelectItem>
                          <SelectItem value="EN">Anglais</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="withSignature"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Inclure la signature</FormLabel>
                          <FormDescription>
                            Ajoute la signature officielle sur le document
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="withStamp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Inclure le cachet</FormLabel>
                          <FormDescription>
                            Ajoute le cachet officiel de l'établissement
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes additionnelles</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes optionnelles..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vérifiez les informations avant de créer le transcript
                  </AlertDescription>
                </Alert>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Informations générales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Étudiant:</span>
                        <span className="font-medium">
                          {
                            students.find((s) => s.id === watchStudentId)
                              ?.lastName
                          }{" "}
                          {
                            students.find((s) => s.id === watchStudentId)
                              ?.firstName
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Année:</span>
                        <span className="font-medium">
                          {
                            academicYears.find(
                              (y) => y.id === watchAcademicYearId
                            )?.year
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contrôle:</span>
                        <span className="font-medium">{watchControlType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Niveau:</span>
                        <span className="font-medium">{watchClassLevel}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Type de document:
                        </span>
                        <span className="font-medium">
                          {form.watch("documentType")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Langue:</span>
                        <span className="font-medium">
                          {form.watch("language") === "FR"
                            ? "Français"
                            : "Anglais"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Signature:
                        </span>
                        <span className="font-medium">
                          {form.watch("withSignature") ? "Oui" : "Non"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cachet:</span>
                        <span className="font-medium">
                          {form.watch("withStamp") ? "Oui" : "Non"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {statistics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Résumé des statistiques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {statistics.average}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Moyenne /20
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {statistics.successRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Taux de réussite
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {statistics.passed}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mat. réussies
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {statistics.failed}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mat. échouées
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={step === 0 ? onCancel : () => setStep(step - 1)}
              >
                {step === 0 ? "Annuler" : "Retour"}
              </Button>

              <div className="flex gap-2">
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Suivant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    {mode === "create"
                      ? "Créer le transcript"
                      : "Mettre à jour"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
