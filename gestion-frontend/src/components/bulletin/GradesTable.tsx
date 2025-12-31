import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradeWithDetails } from "@/types/bulletin";

interface GradesTableProps {
  grades: GradeWithDetails[];
  title?: string;
}

export const GradesTable: React.FC<GradesTableProps> = ({
  grades,
  title = "RÉSULTATS",
}) => {
  // Calculer la moyenne pondérée
  let totalWeightedSum = 0;
  let totalCoefficient = 0;

  grades.forEach((grade) => {
    const maxGrade = grade.subject?.maxGrade || 20;
    const gradeOn20 = Math.round((grade.grade * 20) / maxGrade);
    const coefficient = grade.coefficient || 1;

    totalWeightedSum += gradeOn20 * coefficient;
    totalCoefficient += coefficient;
  });

  const weightedAverage =
    totalCoefficient > 0 ? Math.round(totalWeightedSum / totalCoefficient) : 0;

  // Calculer le total des notes sur base 20 (pour affichage)
  const totalNotes = grades.reduce((sum, grade) => {
    const maxGrade = grade.subject?.maxGrade || 20;
    const gradeOn20 = Math.round((grade.grade * 20) / maxGrade);
    return sum + gradeOn20;
  }, 0);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* En-tête du tableau */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm opacity-90 mt-1">
              {grades.length} matière(s) • Moyenne: {weightedAverage}/20
            </p>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 text-center font-semibold text-gray-700">
                No
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Matière
              </TableHead>
              <TableHead className="w-16 text-center font-semibold text-gray-700">
                BASE
              </TableHead>
              <TableHead className="w-24 text-center font-semibold text-gray-700">
                COEFFICIENT
              </TableHead>
              <TableHead className="w-20 text-center font-semibold text-gray-700">
                NOTES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade, index) => {
              const maxGrade = grade.subject?.maxGrade || 20;
              const gradeOn20 = Math.round((grade.grade * 20) / maxGrade);

              return (
                <TableRow key={grade.id || index} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {grade.subjectName}
                  </TableCell>
                  <TableCell className="text-center">
                    {maxGrade} {/* Affiche maxGrade de la matière */}
                  </TableCell>
                  <TableCell className="text-center">
                    {grade.coefficient}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    <span>{gradeOn20}</span>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Ligne vide */}
            <TableRow>
              <TableCell colSpan={5} className="h-4"></TableCell>
            </TableRow>

            {/* Ligne Total coefficient */}
            <TableRow className="bg-gray-100 font-semibold">
              <TableCell colSpan={3} className="text-right">
                Total coefficient
              </TableCell>
              <TableCell className="text-center">{totalCoefficient}</TableCell>
              <TableCell className="text-center">-</TableCell>
            </TableRow>

            {/* Ligne Moyenne pondérée */}
            <TableRow className="bg-gray-100 font-semibold">
              <TableCell colSpan={3} className="text-right">
                Moyenne pondérée
              </TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">{weightedAverage}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
