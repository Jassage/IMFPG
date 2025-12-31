import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User, BookOpen } from "lucide-react";
import { Student } from "@/types/bulletin";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId?: string;
  searchTerm: string;
  onSelectStudent: (studentId: string) => void;
  onSearchChange: (term: string) => void;
  classLevel: string;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudentId,
  searchTerm,
  onSelectStudent,
  onSearchChange,
  classLevel,
}) => {
  // Fonction pour obtenir le niveau de l'étudiant
  const getStudentLevel = (student: Student): string => {
    if (student.enrollments?.[0]?.schoolClass?.level) {
      return student.enrollments[0].schoolClass.level;
    }
    return student.classId || "";
  };

  // Filtrer les étudiants par niveau si spécifié
  const filteredByLevel = React.useMemo(() => {
    if (classLevel !== "all") {
      return students.filter((student) => {
        const studentLevel = getStudentLevel(student);
        return studentLevel === classLevel;
      });
    }
    return students;
  }, [students, classLevel]);

  // Filtrer par recherche
  const filteredStudents = React.useMemo(() => {
    if (!searchTerm.trim()) return filteredByLevel;

    const term = searchTerm.toLowerCase();
    return filteredByLevel.filter(
      (student) =>
        student.firstName?.toLowerCase().includes(term) ||
        student.lastName?.toLowerCase().includes(term) ||
        student.studentCode?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term)
    );
  }, [filteredByLevel, searchTerm]);

  // Trouver l'étudiant sélectionné
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Sélection de l'Élève
          {classLevel !== "all" && (
            <span className="text-sm font-normal text-muted-foreground ml-auto flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Niveau: {classLevel}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche */}
        <div className="space-y-2">
          <Label>Rechercher un élève</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Nom, prénom ou code..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            {filteredStudents.length} élève(s) trouvé(s)
          </p>
        </div>

        {/* Sélection */}
        <div className="space-y-2">
          <Label>
            Élèves
            {classLevel !== "all" && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                du niveau {classLevel}
              </span>
            )}
          </Label>
          <Select
            value={selectedStudentId}
            onValueChange={onSelectStudent}
            disabled={filteredStudents.length === 0}
          >
            <SelectTrigger>
              {selectedStudent ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </span>
                </div>
              ) : (
                <SelectValue
                  placeholder={
                    filteredStudents.length === 0
                      ? classLevel !== "all"
                        ? `Aucun élève en ${classLevel}`
                        : "Aucun élève trouvé"
                      : "Sélectionner un élève"
                  }
                />
              )}
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((student) => {
                const studentClass = student.enrollments?.[0]?.schoolClass;
                return (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {student.studentCode} •{" "}
                          {studentClass?.name || "Non assigné"}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {selectedStudent && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium ml-2">
                    {selectedStudent.studentCode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium ml-2">
                    {selectedStudent.email || "Non renseigné"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="font-medium ml-2">
                    {selectedStudent.phone || "Non renseigné"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Statut:</span>
                  <span
                    className={`font-medium ml-2 px-2 py-1 rounded text-xs ${
                      selectedStudent.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          {classLevel !== "all" && filteredStudents.length === 0 && (
            <p className="text-xs text-destructive">
              Aucun étudiant trouvé dans ce niveau. Changez le niveau ou
              réessayez.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
