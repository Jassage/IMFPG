// src/components/students/ExportStudents.tsx
import React, { useState, useMemo } from "react";
import { Download, Filter, FileDown, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAcademicStore } from "@/store/studentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/types/academic";
import { getStudentEnrollmentInfo } from "@/utils/enrollmentUtils";
import * as XLSX from "xlsx";

interface ExportStudentsProps {
  students?: Student[];
  onClose?: () => void;
}

export const ExportStudents: React.FC<ExportStudentsProps> = ({
  students: propStudents,
  onClose,
}) => {
  const { students: storeStudents, enrollments } = useAcademicStore();
  const { currentAcademicYear } = useAcademicYearStore();
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {
      // Informations de base
      firstName: true,
      lastName: true,
      studentId: true,
      email: true,
      phone: true,

      // Informations personnelles
      dateOfBirth: true,
      placeOfBirth: true,
      address: true,
      bloodGroup: true,
      allergies: true,
      disabilities: true,
      cin: true,
      sexe: true,
      status: true,

      // Informations académiques
      faculty: true,
      level: true,
      academicYear: true,

      // Informations du tuteur
      guardianFirstName: true,
      guardianLastName: true,
      guardianRelationship: true,
      guardianPhone: true,
      guardianEmail: true,
      guardianAddress: true,
    }
  );
  const [exporting, setExporting] = useState(false);

  const students = propStudents || storeStudents;
  const academicYear = currentAcademicYear ? currentAcademicYear.year : "";

  // Préparer les données pour l'exportation
  const exportData = useMemo(() => {
    return students.map((student) => {
      const enrollmentInfo = getStudentEnrollmentInfo(
        student,
        enrollments,
        academicYear
      );

      const data: any = {};

      // Informations de base
      if (selectedFields.firstName) data.firstName = student.firstName || "";
      if (selectedFields.lastName) data.lastName = student.lastName || "";
      if (selectedFields.studentId) data.studentId = student.studentId || "";
      if (selectedFields.email) data.email = student.email || "";
      if (selectedFields.phone) data.phone = student.phone || "";

      // Informations personnelles
      if (selectedFields.dateOfBirth) {
        data.dateOfBirth = student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "";
      }
      if (selectedFields.placeOfBirth)
        data.placeOfBirth = student.placeOfBirth || "";
      if (selectedFields.address) data.address = student.address || "";
      if (selectedFields.bloodGroup) {
        // Convertir le format interne vers le format simplifié
        const bloodGroupMap: { [key: string]: string } = {
          A_POSITIVE: "A+",
          A_NEGATIVE: "A-",
          B_POSITIVE: "B+",
          B_NEGATIVE: "B-",
          AB_POSITIVE: "AB+",
          AB_NEGATIVE: "AB-",
          O_POSITIVE: "O+",
          O_NEGATIVE: "O-",
        };
        data.bloodGroup = student.bloodGroup
          ? bloodGroupMap[student.bloodGroup] || student.bloodGroup
          : "";
      }
      if (selectedFields.allergies) data.allergies = student.allergies || "";
      if (selectedFields.disabilities)
        data.disabilities = student.disabilities || "";
      if (selectedFields.cin) data.cin = student.cin || "";
      if (selectedFields.sexe) data.sexe = student.sexe || "";
      if (selectedFields.status) data.status = student.status || "";

      // Informations académiques
      if (selectedFields.faculty) data.faculty = enrollmentInfo?.faculty || "";
      if (selectedFields.level) data.level = enrollmentInfo?.level || "";
      if (selectedFields.academicYear)
        data.academicYear = enrollmentInfo?.academicYear || "";

      // Informations du tuteur (on prend le premier tuteur principal)
      const primaryGuardian = student.guardians?.[0];
      if (selectedFields.guardianFirstName)
        data.guardianFirstName = primaryGuardian?.firstName || "";
      if (selectedFields.guardianLastName)
        data.guardianLastName = primaryGuardian?.lastName || "";
      if (selectedFields.guardianRelationship)
        data.guardianRelationship = primaryGuardian?.relationship || "";
      if (selectedFields.guardianPhone)
        data.guardianPhone = primaryGuardian?.phone || "";
      if (selectedFields.guardianEmail)
        data.guardianEmail = primaryGuardian?.email || "";
      if (selectedFields.guardianAddress)
        data.guardianAddress = primaryGuardian?.address || "";

      return data;
    });
  }, [students, enrollments, academicYear, selectedFields]);

  const handleExport = async (format: "excel" | "json") => {
    if (exportData.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Il n'y a aucune donnée correspondant à vos critères",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);

    try {
      if (format === "excel") {
        // Créer le classeur Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Étudiants");

        // Ajouter une feuille d'instructions
        const instructions = [
          {
            Champ: "bloodGroup",
            Format: "A+, A-, B+, B-, AB+, AB-, O+, O-",
            Exemple: "A+",
          },
          {
            Champ: "sexe",
            Format: "Masculin, Feminin, Autre",
            Exemple: "Masculin",
          },
          {
            Champ: "status",
            Format: "Active, Inactive, Graduated, Suspended",
            Exemple: "Active",
          },
          { Champ: "dateOfBirth", Format: "YYYY-MM-DD", Exemple: "2005-03-15" },
        ];

        const instructionSheet = XLSX.utils.json_to_sheet(instructions);
        XLSX.utils.book_append_sheet(
          workbook,
          instructionSheet,
          "Instructions"
        );

        // Générer et télécharger le fichier
        XLSX.writeFile(
          workbook,
          `etudiants-export-${new Date().toISOString().split("T")[0]}.xlsx`
        );
      } else if (format === "json") {
        // Créer et télécharger le fichier JSON
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `etudiants-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Exportation réussie",
        description: `${
          exportData.length
        } étudiants exportés au format ${format.toUpperCase()}`,
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const toggleAllFields = (checked: boolean) => {
    const newSelection = Object.keys(selectedFields).reduce((acc, key) => {
      acc[key] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedFields(newSelection);
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectedCount = Object.values(selectedFields).filter(Boolean).length;
  const totalFields = Object.keys(selectedFields).length;

  // Groupes de champs pour une meilleure organisation
  const fieldGroups = [
    {
      title: "Informations de base",
      fields: [
        { key: "firstName", label: "Prénom" },
        { key: "lastName", label: "Nom" },
        { key: "studentId", label: "ID Étudiant" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Téléphone" },
      ],
    },
    {
      title: "Informations personnelles",
      fields: [
        { key: "dateOfBirth", label: "Date de naissance" },
        { key: "placeOfBirth", label: "Lieu de naissance" },
        { key: "address", label: "Adresse" },
        { key: "bloodGroup", label: "Groupe sanguin" },
        { key: "allergies", label: "Allergies" },
        { key: "disabilities", label: "Handicaps" },
        { key: "cin", label: "CIN" },
        { key: "sexe", label: "Sexe" },
        { key: "status", label: "Statut" },
      ],
    },
    {
      title: "Informations académiques",
      fields: [
        { key: "faculty", label: "Faculté" },
        { key: "level", label: "Niveau" },
        { key: "academicYear", label: "Année académique" },
      ],
    },
    {
      title: "Informations du tuteur",
      fields: [
        { key: "guardianFirstName", label: "Prénom du tuteur" },
        { key: "guardianLastName", label: "Nom du tuteur" },
        { key: "guardianRelationship", label: "Relation" },
        { key: "guardianPhone", label: "Téléphone du tuteur" },
        { key: "guardianEmail", label: "Email du tuteur" },
        { key: "guardianAddress", label: "Adresse du tuteur" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Exportation des Étudiants
          </CardTitle>
          <CardDescription>
            Exportez les données des étudiants dans le même format que
            l'importation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-blue-600">Étudiants</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedCount}
                </div>
                <div className="text-sm text-green-600">
                  Champs sélectionnés
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Filter className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {totalFields}
                </div>
                <div className="text-sm text-purple-600">
                  Champs disponibles
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des champs */}
      <Card>
        <CardHeader>
          <CardTitle>Champs à exporter</CardTitle>
          <CardDescription>
            Sélectionnez les champs que vous souhaitez inclure dans
            l'exportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sélection globale */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                checked={selectedCount === totalFields}
                onCheckedChange={(checked) => toggleAllFields(!!checked)}
                id="select-all"
              />
              <label
                htmlFor="select-all"
                className="font-medium cursor-pointer"
              >
                {selectedCount === totalFields
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </label>
              <Badge variant="secondary" className="ml-auto">
                {selectedCount}/{totalFields}
              </Badge>
            </div>

            {/* Groupes de champs */}
            {fieldGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.fields.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedFields[field.key]}
                        onCheckedChange={() => toggleField(field.key)}
                        id={field.key}
                      />
                      <label
                        htmlFor={field.key}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Options d'exportation */}
      <Card>
        <CardHeader>
          <CardTitle>Format d'exportation</CardTitle>
          <CardDescription>
            Choisissez le format de fichier pour l'exportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleExport("excel")}
              disabled={exporting || students.length === 0}
              className="flex-1 gap-2"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Exporter en Excel (.xlsx)
            </Button>

            <Button
              onClick={() => handleExport("json")}
              disabled={exporting || students.length === 0}
              className="flex-1 gap-2"
              size="lg"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Exporter en JSON
            </Button>
          </div>

          {students.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                Aucun étudiant à exporter. Veuillez d'abord ajouter des
                étudiants.
              </p>
            </div>
          )}

          {exporting && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                Exportation en cours... Veuillez patienter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aperçu des données */}
      {exportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des données</CardTitle>
            <CardDescription>
              Premier enregistrement de l'exportation ({exportData.length} au
              total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(exportData[0], null, 2)}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Les données seront exportées dans le même format que le template
              d'importation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
