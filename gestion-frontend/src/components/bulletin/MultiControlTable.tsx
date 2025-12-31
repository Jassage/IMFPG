import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ControlType } from "@/types/bulletin";

interface MultiControlTableProps {
  grades: any[];
  controlTypes: ControlType[];
  title: string;
}

export const MultiControlTable: React.FC<MultiControlTableProps> = ({
  grades,
  controlTypes,
  title,
}) => {
  console.log("📊 MultiControlTable data:", {
    gradesCount: grades.length,
    controlTypes,
    firstGrade: grades[0],
  });

  // Grouper les notes par matière
  const subjectsMap = new Map();

  grades.forEach((grade) => {
    const subjectId = grade.subject?.id || grade.subjectName;
    const maxGrade = grade.subject?.maxGrade || 20;

    if (!subjectsMap.has(subjectId)) {
      subjectsMap.set(subjectId, {
        subjectName: grade.subjectName,
        coefficient: grade.coefficient,
        maxGrade: maxGrade, // Ajouter maxGrade
        controlGrades: {},
      });
    }

    const subject = subjectsMap.get(subjectId);

    // Ajouter la note pour ce contrôle
    if (grade.controlType && grade.grade !== undefined) {
      // Calculer la note sur base 20
      const gradeOn20 = Math.round((grade.grade * 20) / maxGrade);
      subject.controlGrades[grade.controlType] = {
        grade: grade.grade,
        gradeOn20: gradeOn20,
      };
    }
  });

  const subjects = Array.from(subjectsMap.values());

  // Calculer les totaux par contrôle
  const calculateTotals = () => {
    const totals = {
      totalNotes: Array(controlTypes.length).fill(0),
      countNotes: Array(controlTypes.length).fill(0),
      totalCoefficient: 0,
    };

    subjects.forEach((subject: any) => {
      totals.totalCoefficient += subject.coefficient;

      controlTypes.forEach((controlType, index) => {
        const controlGrade = subject.controlGrades[controlType];
        if (controlGrade?.gradeOn20 !== undefined) {
          totals.totalNotes[index] += controlGrade.gradeOn20;
          totals.countNotes[index]++;
        }
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  if (subjects.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>Aucune donnée disponible pour l'affichage de tous les contrôles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-primary text-primary-foreground px-4 py-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-90 mt-1">
          {subjects.length} matière(s) • {controlTypes.length} contrôle(s)
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 text-center font-semibold">
                No
              </TableHead>
              <TableHead className="font-semibold">Matière</TableHead>
              <TableHead className="w-16 text-center font-semibold">
                BASE
              </TableHead>
              <TableHead className="w-20 text-center font-semibold">
                COEFFICIENT
              </TableHead>
              {controlTypes.map((type, index) => (
                <TableHead
                  key={type}
                  className="w-16 text-center font-semibold"
                >
                  C{index + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {subject.subjectName}
                </TableCell>
                <TableCell className="text-center">
                  {subject.maxGrade} {/* Affiche maxGrade de la matière */}
                </TableCell>
                <TableCell className="text-center">
                  {subject.coefficient}
                </TableCell>

                {controlTypes.map((controlType) => {
                  const controlGrade = subject.controlGrades[controlType];
                  const grade = controlGrade?.grade;

                  return (
                    <TableCell key={controlType} className="text-center">
                      {grade !== undefined ? (
                        <span className="font-medium">{grade}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}

            {/* Ligne vide */}
            <TableRow>
              <TableCell
                colSpan={4 + controlTypes.length}
                className="h-4"
              ></TableCell>
            </TableRow>

            {/* Ligne des totaux */}
            <TableRow className="bg-gray-50 font-semibold">
              <TableCell colSpan={3} className="text-right">
                Total
              </TableCell>
              <TableCell className="text-center">
                {totals.totalCoefficient}
              </TableCell>
              {controlTypes.map((_, index) => (
                <TableCell key={index} className="text-center">
                  {totals.totalNotes[index] > 0
                    ? totals.totalNotes[index]
                    : "-"}
                </TableCell>
              ))}
            </TableRow>

            {/* Ligne des moyennes */}
            <TableRow className="bg-gray-50 font-semibold">
              <TableCell colSpan={3} className="text-right">
                Moyenne
              </TableCell>
              <TableCell className="text-center">-</TableCell>
              {controlTypes.map((_, index) => (
                <TableCell key={index} className="text-center">
                  {totals.countNotes[index] > 0
                    ? Math.round(
                        totals.totalNotes[index] / totals.countNotes[index]
                      )
                    : "-"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
