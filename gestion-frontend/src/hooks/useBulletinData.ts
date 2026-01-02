import { useState, useEffect, useCallback } from "react";
import {
  ControlType,
  Student as StudentType,
  AcademicYear as AcademicYearType,
  GradeWithDetails,
  normalizeGrade,
} from "@/types/bulletin";
import bulletinService from "@/services/bulletinService";
import api from "@/services/api";

interface UseBulletinDataProps {
  studentId?: string;
  academicYearId?: string;
  controlType?: ControlType | "all";
  classLevel?: string;
}

interface Student {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  enrollments?: Array<{
    schoolClass: {
      name: string;
      level: string;
    };
  }>;
  [key: string]: any;
}

interface AcademicYear {
  createdAt: any;
  updatedAt: any;
  id: string;
  year: string;
  isCurrent: boolean;
  startDate?: Date;
  endDate?: Date;
}

export const useBulletinData = ({
  studentId,
  academicYearId,
  controlType = "all",
  classLevel = "all",
}: UseBulletinDataProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);
  const [gradesByControlType, setGradesByControlType] = useState<
    Record<string, any[]>
  >({});
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [studentClass, setStudentClass] = useState<any>(null);
  const [statistics, setStatistics] = useState({
    weightedAverage: 0,
    totalCoefficient: 0,
    successRate: 0,
    minGrade: 0,
    maxGrade: 0,
    totalSubjects: 0,
    passingSubjects: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour normaliser toutes les notes sur 20
  const normalizeGrades = useCallback((grades: any[]): any[] => {
    if (!grades || !Array.isArray(grades)) {
      console.log("⚠️ No grades to normalize or grades is not an array");
      return [];
    }

    return grades
      .map((grade, index) => {
        if (!grade) {
          console.log(`z Grade at index ${index} is null or undefined`);
          return null;
        }

        try {
          const maxGrade = grade.subject?.maxGrade || 20;

          const gradeValue = grade.grade || 0;

          const normalizedGrade = normalizeGrade(gradeValue, maxGrade);

          // Normaliser aussi les controlGrades si présents
          let controlGrades = {};
          if (grade.controlGrades && typeof grade.controlGrades === "object") {
            controlGrades = Object.keys(grade.controlGrades).reduce(
              (acc, key) => {
                const controlGrade = grade.controlGrades[key];
                if (controlGrade) {
                  const controlGradeValue =
                    controlGrade.grade || controlGrade.note || 0;
                  acc[key] = {
                    ...controlGrade,
                    normalizedGrade: normalizeGrade(
                      controlGradeValue,
                      maxGrade
                    ),
                  };
                }
                return acc;
              },
              {} as any
            );
          }

          return {
            ...grade,
            grade: gradeValue,
            normalizedGrade,
            maxGrade,
            controlGrades,
          };
        } catch (error) {
          console.error(
            `❌ Error normalizing grade at index ${index}:`,
            error,
            grade
          );
          return {
            ...grade,
            grade: 0,
            normalizedGrade: 0,
            maxGrade: 20,
            controlGrades: {},
          };
        }
      })
      .filter(Boolean);
  }, []);

  // Fonction pour calculer la note sur base 20
  const getGradeOnBase20 = useCallback((grade: any): number => {
    if (!grade) return 0;

    // Sinon calculer à partir de grade.grade et maxGrade
    const maxGrade = grade.subject?.maxGrade || 20;
    const rawGrade = grade.grade || 0;
    return Math.round((rawGrade * 20) / maxGrade);
  }, []);

  const calculateStatistics = useCallback(
    (grades: any[]) => {
      if (!grades || grades.length === 0) {
        return {
          weightedAverage: 0,
          totalCoefficient: 0,
          successRate: 0,
          minGrade: 0,
          maxGrade: 0,
          totalSubjects: 0,
          passingSubjects: 0,
        };
      }

      // Calculer la moyenne pondérée
      let totalWeightedSum = 0;
      let totalCoefficient = 0;
      const gradesOn20: number[] = [];

      grades.forEach((grade: any) => {
        const gradeOn20 = getGradeOnBase20(grade);
        const coefficient = grade.subject?.coefficient || 1;

        totalWeightedSum += gradeOn20 * coefficient;
        totalCoefficient += coefficient;
        gradesOn20.push(gradeOn20);
      });

      const weightedAverage =
        totalCoefficient > 0 ? totalWeightedSum / totalCoefficient : 0;

      // Compter les matières validées (≥ 10/20)
      const passingGrades = gradesOn20.filter((grade) => grade >= 10).length;
      const successRate =
        grades.length > 0 ? (passingGrades / grades.length) * 100 : 0;

      // Trouver min/max
      const minGrade = gradesOn20.length > 0 ? Math.min(...gradesOn20) : 0;
      const maxGrade = gradesOn20.length > 0 ? Math.max(...gradesOn20) : 0;

      return {
        weightedAverage,
        totalCoefficient,
        successRate,
        minGrade,
        maxGrade,
        totalSubjects: grades.length,
        passingSubjects: passingGrades,
      };
    },
    [getGradeOnBase20]
  );

  // Charger les étudiants depuis le store ou l'API
  const loadStudents = useCallback(async () => {
    try {
      // Option 1: Utiliser le store si disponible
      if (typeof window !== "undefined" && (window as any).studentStore) {
        const store = (window as any).studentStore;
        const students = store.getState().students;
        if (students && students.length > 0) {
          setStudents(students);

          return;
        }
      }

      // Option 2: Utiliser directement l'API comme dans le store
      const response = await api.get("/students", {
        params: { limit: 100 },
      });

      let studentsList: Student[] = [];
      const responseData = response.data;

      if (responseData.success) {
        if (responseData.data && responseData.data.data) {
          studentsList = responseData.data.data;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          studentsList = responseData.data;
        } else {
          studentsList =
            responseData.data?.students || responseData.students || [];
        }
      }

      // Transformer en format attendu
      const formattedStudents = studentsList.map((student: any) => ({
        id: student.id || student._id,
        studentCode: student.studentCode || student.matricule || "",
        firstName: student.firstName || student.prenom || "",
        lastName: student.lastName || student.nom || "",
        email: student.email || "",
        phone: student.phone || "",
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth)
          : undefined,
        status: student.status || "Active",
        enrollments: student.enrollments || [],
        ...student,
      }));

      setStudents(formattedStudents);
      console.log(`✅ ${formattedStudents.length} étudiants chargés`);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des étudiants:", error);
      setStudents([]);
    }
  }, []);

  // Charger les années académiques
  const loadAcademicYears = useCallback(async () => {
    try {
      console.log("🔄 Loading academic years...");
      const response = await api.get("/academic-years");

      const extractAcademicYears = (data: any): AcademicYear[] => {
        if (!data) return [];

        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || item._id,
            year: item.year || item.academicYear || "Année inconnue",
            isCurrent: item.isCurrent || false,
            startDate: item.startDate ? new Date(item.startDate) : new Date(),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          }));
        }

        if (data.data && Array.isArray(data.data)) {
          return extractAcademicYears(data.data);
        }

        if (data.success && data.data && Array.isArray(data.data)) {
          return extractAcademicYears(data.data);
        }

        return [];
      };

      const academicYearsList = extractAcademicYears(response.data);

      if (academicYearsList.length > 0) {
        setAcademicYears(academicYearsList);

        // Sélectionner une année automatiquement
        if (academicYearId && academicYearId !== "all") {
          const selectedYear = academicYearsList.find(
            (year) => year.id === academicYearId
          );
          setSelectedAcademicYear(selectedYear || null);
        } else {
          const currentYear = academicYearsList.find((year) => year.isCurrent);
          setSelectedAcademicYear(currentYear || academicYearsList[0] || null);
        }
      } else {
        // Créer des années de test
        const currentYear = new Date().getFullYear();
        const testYears = [
          {
            id: "current",
            year: `${currentYear}-${currentYear + 1}`,
            isCurrent: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            startDate: new Date(`${currentYear}-09-01`),
            endDate: new Date(`${currentYear + 1}-07-31`),
          },
          {
            id: "previous",
            year: `${currentYear - 1}-${currentYear}`,
            isCurrent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            startDate: new Date(`${currentYear - 1}-09-01`),
            endDate: new Date(`${currentYear}-07-31`),
          },
        ];

        setAcademicYears(testYears);
        setSelectedAcademicYear(testYears[0]);
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors du chargement des années académiques:",
        error
      );

      // Créer des années de test en cas d'erreur
      const currentYear = new Date().getFullYear();
      const testYears = [
        {
          id: "test-current",
          year: `${currentYear}-${currentYear + 1}`,
          isCurrent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      setAcademicYears(testYears);
      setSelectedAcademicYear(testYears[0]);
    }
  }, [academicYearId]);

  // Charger les données spécifiques à l'étudiant
  const loadData = useCallback(async () => {
    if (!studentId || studentId === "all") {
      console.log("📭 No student selected or studentId is 'all'");
      setStudentGrades([]);
      setGradesByControlType({});
      setStatistics({
        weightedAverage: 0,
        totalCoefficient: 0,
        successRate: 0,
        minGrade: 0,
        maxGrade: 0,
        totalSubjects: 0,
        passingSubjects: 0,
      });
      setSelectedStudent(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("📋 Loading student data for:", studentId);

      // 1. Récupérer l'étudiant
      const student = students.find((s) => s.id === studentId);
      if (student) {
        console.log("👤 Found student in cache:", student);
        setSelectedStudent(student);

        // Extraire la classe de l'étudiant
        if (student.enrollments?.[0]?.schoolClass) {
          setStudentClass(student.enrollments[0].schoolClass);
          console.log("🏫 Student class:", student.enrollments[0].schoolClass);
        }
      } else {
        console.log("🔍 Student not found in cache, fetching from API...");
        // Fallback: charger l'étudiant depuis l'API
        const studentResponse = await bulletinService.getStudent(studentId);
        if (studentResponse.success && studentResponse.data) {
          console.log("👤 Student fetched from API:", studentResponse.data);
          setSelectedStudent(studentResponse.data as Student);
        }
      }

      // 2. Préparer les filtres
      const filters = {
        academicYearId: academicYearId === "all" ? undefined : academicYearId,
        controlType: controlType === "all" ? undefined : controlType,
        classLevel: classLevel === "all" ? undefined : classLevel,
        includeControlGrades: true,
      };

      console.log("🎛️ Filters for grades request:", filters);

      // 3. Charger les notes
      const gradesResponse = await bulletinService.getStudentGrades(
        studentId,
        filters
      );

      console.log("📊 Grades service response:", gradesResponse);

      let gradesData: any[] = [];
      if (gradesResponse.success && gradesResponse.data?.grades) {
        gradesData = gradesResponse.data.grades;
        console.log(`✅ Loaded ${gradesData.length} grades from service`);
      } else {
        console.log("⚠️ No grades found or error in service response");
      }

      // 4. Normaliser les notes
      const normalizedGrades = normalizeGrades(gradesData);
      console.log(`📊 Normalized ${normalizedGrades.length} grades`);

      // 5. Grouper par type de contrôle
      const groupedGrades: Record<string, any[]> = {};
      normalizedGrades.forEach((grade: any) => {
        const gradeControlType = grade.controlType || ControlType.CONTROLE_1;
        if (!groupedGrades[gradeControlType]) {
          groupedGrades[gradeControlType] = [];
        }
        groupedGrades[gradeControlType].push(grade);
      });

      console.log("📊 Grouped by control type:", Object.keys(groupedGrades));
      setGradesByControlType(groupedGrades);

      // 6. Déterminer quelles notes afficher
      let gradesToShow: any[] = [];
      if (controlType && controlType !== "all") {
        gradesToShow = groupedGrades[controlType] || [];
        console.log(
          `📊 Showing ${gradesToShow.length} grades for control type ${controlType}`
        );
      } else {
        // Pour "all", prendre toutes les notes
        gradesToShow = normalizedGrades;
        console.log(`📊 Showing all ${gradesToShow.length} grades`);
      }

      setStudentGrades(gradesToShow);
      console.log("📊 Student grades set:", gradesToShow.length, "items");

      // 7. Calculer les statistiques
      const stats = calculateStatistics(gradesToShow);
      console.log("📈 Calculated statistics:", stats);
      setStatistics(stats);
    } catch (error: any) {
      console.error("❌ Error loading data:", error);
      setError(error.message || "Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [
    studentId,
    academicYearId,
    controlType,
    classLevel,
    students,
    normalizeGrades,
    calculateStatistics,
  ]);

  // Charger les données initiales
  useEffect(() => {
    loadStudents();
    loadAcademicYears();
  }, [loadStudents, loadAcademicYears]);

  // Recharger quand les filtres changent
  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetch = useCallback(() => {
    loadData();
    loadAcademicYears();
  }, [loadData, loadAcademicYears]);

  return {
    students,
    studentGrades,
    gradesByControlType,
    academicYears,
    selectedStudent,
    selectedAcademicYear,
    studentClass,
    statistics,
    isLoading,
    error,
    refetch,
  };
};
