import { useState, useEffect, useCallback, useMemo } from "react";
import { ControlType, DocumentType } from "@/types/bulletin";
import { useStudentStore } from "@/store/studentStore";
import { useGradeStore } from "@/store/gradeStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { GradeStatus, GradeSession } from "@/types/bulletin";

interface UseBulletinDataProps {
  studentId?: string;
  academicYearId?: string;
  controlType?: ControlType | "all";
  classLevel?: string;
}

export const useBulletinData = (props: UseBulletinDataProps = {}) => {
  const { studentId, academicYearId, controlType, classLevel } = props;

  const { students, fetchStudents } = useStudentStore();
  const { grades, fetchGrades } = useGradeStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  //   const { enrollmentDates, calculateEnrollmentDates } = useEnrollmentStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchGrades(),
          fetchAcademicYears(),
        ]);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchStudents, fetchGrades, fetchAcademicYears]);

  // Calculer les dates d'inscription quand l'étudiant change
  //   useEffect(() => {
  //     if (studentId) {
  //       calculateEnrollmentDates(studentId);
  //     }
  //   }, [studentId, calculateEnrollmentDates]);

  // Filtrer les étudiants
  const filteredStudents = useMemo(() => {
    if (!students) return [];

    return students.filter(
      (student) =>
        student.status === "Active" &&
        (!classLevel ||
          student.enrollments?.some((e) => e.schoolClass?.level === classLevel))
    );
  }, [students, classLevel]);

  // Obtenir les notes de l'étudiant
  const studentGrades = useMemo(() => {
    if (!studentId || !grades || grades.length === 0) return [];

    return grades.filter(
      (grade) =>
        grade.studentId === studentId &&
        grade.isActive === true &&
        (!academicYearId || grade.academicYearId === academicYearId) &&
        (controlType === "all" || grade.controlType === controlType) &&
        (!classLevel || grade.classLevel === classLevel)
    );
  }, [studentId, grades, academicYearId, controlType, classLevel]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    if (studentGrades.length === 0) {
      return {
        average: 0,
        weightedAverage: 0,
        totalCoefficient: 0,
        successRate: 0,
        minGrade: 0,
        maxGrade: 0,
      };
    }

    let totalWeightedGrades = 0;
    let totalCoefficient = 0;
    let passedSubjects = 0;
    let minGrade = Infinity;
    let maxGrade = -Infinity;
    let totalGrades = 0;

    studentGrades.forEach((grade) => {
      const coefficient = grade.subject?.coefficient || 1;
      const gradeValue = grade.grade;

      totalWeightedGrades += gradeValue * coefficient;
      totalCoefficient += coefficient;
      totalGrades += gradeValue;

      if (gradeValue >= (grade.subject?.passingGrade || 60)) {
        passedSubjects++;
      }

      minGrade = Math.min(minGrade, gradeValue);
      maxGrade = Math.max(maxGrade, gradeValue);
    });

    const weightedAverage =
      totalCoefficient > 0 ? totalWeightedGrades / totalCoefficient : 0;
    const average =
      studentGrades.length > 0 ? totalGrades / studentGrades.length : 0;
    const successRate =
      studentGrades.length > 0
        ? (passedSubjects / studentGrades.length) * 100
        : 0;

    return {
      average: parseFloat(average.toFixed(2)),
      weightedAverage: parseFloat(weightedAverage.toFixed(2)),
      totalCoefficient,
      successRate: parseFloat(successRate.toFixed(2)),
      minGrade: parseFloat(minGrade.toFixed(2)),
      maxGrade: parseFloat(maxGrade.toFixed(2)),
    };
  }, [studentGrades]);

  // Grouper les notes par type de contrôle
  const gradesByControlType = useMemo(() => {
    return studentGrades.reduce((acc, grade) => {
      const control = grade.controlType;
      if (!acc[control]) {
        acc[control] = [];
      }
      acc[control].push(grade);
      return acc;
    }, {} as Record<ControlType, typeof studentGrades>);
  }, [studentGrades]);

  // Obtenir l'étudiant sélectionné
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === studentId);
  }, [students, studentId]);

  // Obtenir l'année académique
  const selectedAcademicYear = useMemo(() => {
    return academicYears.find((y) => y.id === academicYearId);
  }, [academicYears, academicYearId]);

  // Obtenir la classe de l'étudiant
  const studentClass = useMemo(() => {
    if (!selectedStudent || !selectedStudent.enrollments) return null;

    const currentEnrollment = selectedStudent.enrollments.find(
      (e) => e.academicYearId === academicYearId && e.status === "Active"
    );

    return currentEnrollment?.schoolClass || null;
  }, [selectedStudent, academicYearId]);

  return {
    // Données
    students: filteredStudents,
    studentGrades,
    gradesByControlType,
    academicYears,
    // enrollmentDates,

    // Données sélectionnées
    selectedStudent,
    selectedAcademicYear,
    studentClass,

    // Calculs
    statistics,

    // État
    isLoading,
    error,

    // Méthodes
    refetch: async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchStudents(),
          fetchGrades(),
          fetchAcademicYears(),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
  };
};
