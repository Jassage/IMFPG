import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GradeWithDetails } from "@/types/bulletin";

interface GradesTableProps {
  grades: GradeWithDetails[];
  title?: string;
}

export const GradesTable: React.FC<GradesTableProps> = ({ grades, title }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead className="w-20 text-center">Coef.</TableHead>
            <TableHead className="w-24 text-center">Note/20</TableHead>
            <TableHead className="w-24 text-center">Mention</TableHead>
            <TableHead className="w-32 text-center">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade, index) => {
            const getMention = (note: number): string => {
              if (note >= 16) return "Très Bien";
              if (note >= 14) return "Bien";
              if (note >= 12) return "Assez Bien";
              if (note >= 10) return "Passable";
              return "Insuffisant";
            };

            const isPassing = grade.grade >= grade.passingGrade;

            return (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{grade.subjectName}</div>
                    <div className="text-xs text-gray-500">
                      {grade.professeurName}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {grade.coefficient}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`
                    font-bold text-lg
                    ${isPassing ? "text-green-600" : "text-red-600"}
                  `}
                  >
                    {grade.grade.toFixed(2)}
                  </span>
                  {grade.session === "Reprise" && (
                    <span className="text-xs text-gray-500 ml-1">(R)</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">{getMention(grade.grade)}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={isPassing ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {isPassing ? "Validé" : "Non validé"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
