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
import { Search, User } from "lucide-react";
import { Student } from "@/types/bulletin";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId?: string;
  searchTerm: string;
  onSelectStudent: (studentId: string) => void;
  onSearchChange: (term: string) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudentId,
  searchTerm,
  onSelectStudent,
  onSearchChange,
}) => {
  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Sélection de l'Élève
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
        </div>

        {/* Sélection */}
        <div className="space-y-2">
          <Label>Élèves ({filteredStudents.length})</Label>
          <Select
            value={selectedStudentId}
            onValueChange={onSelectStudent}
            disabled={filteredStudents.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  filteredStudents.length === 0
                    ? "Aucun élève trouvé"
                    : "Sélectionner un élève"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.studentCode} •{" "}
                        {student.enrollments?.[0]?.schoolClass?.name ||
                          "Non assigné"}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
