import { log } from "console";
import api from "./api";
import {
  Bulletin,
  BulletinGenerationRequest,
  ControlType,
  Student,
  AcademicYear,
  GradeWithDetails,
  BulletinStatistics,
  normalizeGrade,
} from "@/types/bulletin";

class BulletinService {
  /**
   * Récupère la liste des étudiants pour les bulletins
   */
  async getStudents(filters?: {
    search?: string;
    classLevel?: string;
    academicYearId?: string;
  }): Promise<{ success: boolean; data: Student[] }> {
    try {
      const response = await api.get("/students", {
        params: {
          ...filters,
          limit: 200, // Augmenter la limite pour avoir tous les étudiants
          includeEnrollments: true,
        },
      });

      console.log("📊 API Response for students:", response.data);

      let studentsList: any[] = [];
      const responseData = response.data;

      // Extraire les étudiants de la réponse
      if (responseData.success) {
        if (responseData.data?.data && Array.isArray(responseData.data.data)) {
          studentsList = responseData.data.data;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          studentsList = responseData.data;
        } else if (Array.isArray(responseData)) {
          studentsList = responseData;
        } else if (Array.isArray(responseData.data)) {
          studentsList = responseData.data;
        }
      }

      // Formater les étudiants
      const formattedStudents = studentsList.map((student: any) => ({
        id: student.id || student._id,
        studentCode:
          student.studentCode ||
          student.matricule ||
          `ETU${Math.random().toString(36).substr(2, 9)}`,
        firstName: student.firstName || student.prenom || "Prénom",
        lastName: student.lastName || student.nom || "Nom",
        email: student.email || "",
        phone: student.phone || "",
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth)
          : undefined,
        placeOfBirth: student.placeOfBirth || "",
        address: student.address || "",
        photo: student.photo || "",
        bloodGroup: student.bloodGroup || "",
        status: student.status || "Active",
        cin: student.cin || "",
        sexe: student.sexe || student.gender || "",
        classId: student.classId || "",
        createdAt: student.createdAt ? new Date(student.createdAt) : new Date(),
        updatedAt: student.updatedAt ? new Date(student.updatedAt) : new Date(),
        enrollments: student.enrollments || [],
      }));

      return {
        success: formattedStudents.length > 0,
        data: formattedStudents,
      };
    } catch (error) {
      console.error("❌ Erreur dans getStudents:", error);
      return {
        success: false,
        data: [],
      };
    }
  }

  /**
   * Récupère un étudiant spécifique
   */
  async getStudent(
    studentId: string
  ): Promise<{ success: boolean; data: Student }> {
    try {
      const response = await api.get(`/students/${studentId}`, {
        params: { includeEnrollments: true },
      });

      const responseData = response.data;
      let studentData: any;

      if (responseData.success && responseData.data) {
        studentData = responseData.data.student || responseData.data;
      } else {
        studentData = responseData.data || responseData;
      }

      // Formater l'étudiant
      const student: Student = {
        id: studentData.id || studentData._id,
        studentCode: studentData.studentCode || studentData.matricule || "",
        firstName: studentData.firstName || studentData.prenom || "",
        lastName: studentData.lastName || studentData.nom || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        dateOfBirth: studentData.dateOfBirth
          ? new Date(studentData.dateOfBirth)
          : undefined,
        placeOfBirth: studentData.placeOfBirth || "",
        address: studentData.address || "",
        photo: studentData.photo || "",
        bloodGroup: studentData.bloodGroup || "",
        status: studentData.status || "Active",
        cin: studentData.cin || "",
        sexe: studentData.sexe || studentData.gender || "",
        classId: studentData.classId || "",
        createdAt: studentData.createdAt
          ? new Date(studentData.createdAt)
          : new Date(),
        updatedAt: studentData.updatedAt
          ? new Date(studentData.updatedAt)
          : new Date(),
        enrollments: studentData.enrollments || [],
      };

      return {
        success: true,
        data: student,
      };
    } catch (error) {
      console.error("❌ Erreur dans getStudent:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère les années académiques
   */
  async getAcademicYears(): Promise<{
    success: boolean;
    data: AcademicYear[];
  }> {
    try {
      const response = await api.get("/academic-years");

      const extractAcademicYears = (data: any): AcademicYear[] => {
        if (!data) return [];

        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            id: item.id || item._id,
            year: item.year || item.academicYear || "Année",
            startDate: item.startDate ? new Date(item.startDate) : new Date(),
            endDate: item.endDate ? new Date(item.endDate) : new Date(),
            isCurrent: item.isCurrent || false,
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

      const academicYears = extractAcademicYears(response.data);

      // Trier par année (plus récente d'abord)
      const sortedYears = academicYears.sort((a, b) => {
        const yearA = parseInt(a.year.split("-")[0]) || 0;
        const yearB = parseInt(b.year.split("-")[0]) || 0;
        return yearB - yearA;
      });

      return {
        success: sortedYears.length > 0,
        data: sortedYears,
      };
    } catch (error) {
      console.error("❌ Erreur dans getAcademicYears:", error);
      return {
        success: false,
        data: [],
      };
    }
  }

  /**
   * Récupère les notes d'un étudiant avec normalisation
   */
  async getStudentGrades(
    studentId: string,
    filters?: {
      academicYearId?: string;
      controlType?: ControlType | "all";
      classLevel?: string;
      includeControlGrades?: boolean;
    }
  ): Promise<{
    success: boolean;
    data: {
      grades: GradeWithDetails[];
      statistics: BulletinStatistics;
      gradesByControlType?: Record<string, GradeWithDetails[]>;
    };
  }> {
    try {
      console.log("📋 Fetching grades for student:", studentId);
      console.log("🎛️ Filters:", filters);

      const response = await api.get(`/grades/student/${studentId}`, {
        params: {
          ...filters,
          includeSubjectDetails: true,
          includeControlGrades: filters?.includeControlGrades || true,
        },
      });

      console.log("📊 Raw grades API response:", response.data);

      let gradesData: any[] = [];
      const responseData = response.data;

      // CORRECTION CRITIQUE : Extrayez correctement les notes
      if (responseData.success && responseData.data) {
        // Structure attendue: { success: true, data: { grades: [...], statistics: {...} } }
        if (
          responseData.data.grades &&
          Array.isArray(responseData.data.grades)
        ) {
          gradesData = responseData.data.grades;
          console.log(
            `📊 Found ${gradesData.length} grades in responseData.data.grades`
          );
        }
        // Autre structure possible: data est directement le tableau de notes
        else if (Array.isArray(responseData.data)) {
          gradesData = responseData.data;
          console.log(
            `📊 Found ${gradesData.length} grades in responseData.data`
          );
        }
      }
      // Si pas de structure success/data
      else if (Array.isArray(responseData)) {
        gradesData = responseData;
        console.log(
          `📊 Found ${gradesData.length} grades in direct array response`
        );
      }
      // Si response.data contient directement les notes
      else if (responseData && Array.isArray(responseData.grades)) {
        gradesData = responseData.grades;
        console.log(
          `📊 Found ${gradesData.length} grades in responseData.grades`
        );
      }

      console.log(`📊 Extracted ${gradesData.length} grades`);

      // Si aucune note trouvée, essayer d'extraire autrement
      if (gradesData.length === 0) {
        console.log(
          "⚠️ No grades found in expected structure, trying alternative..."
        );

        // Essayer d'extraire de la réponse brute
        const rawData = responseData.data || responseData;
        if (rawData && typeof rawData === "object") {
          // Chercher un tableau dans l'objet
          for (const key in rawData) {
            if (Array.isArray(rawData[key])) {
              gradesData = rawData[key];
              console.log(
                `📊 Found ${gradesData.length} grades in property '${key}'`
              );
              break;
            }
          }
        }
      }

      // Normaliser les notes et ajouter les détails
      const gradesWithDetails = gradesData.map((grade: any, index: number) => {
        const maxGrade = grade.subject?.maxGrade; // Valeur par défaut

        const gradeValue = grade.grade || 0;

        const normalizedGrade = normalizeGrade(gradeValue, maxGrade);

        // Préparer les controlGrades si disponibles
        let controlGrades: any = {};
        if (grade.controlGrades) {
          Object.keys(grade.controlGrades).forEach((key: string) => {
            const controlGrade = grade.controlGrades[key];
            if (controlGrade) {
              const controlGradeValue =
                controlGrade.grade || controlGrade.note || 0;
              controlGrades[key] = {
                ...controlGrade,
                normalizedGrade: normalizeGrade(controlGradeValue, maxGrade),
              };
            }
          });
        }

        // Récupérer le nom du professeur
        let professeurName = "Professeur non assigné";
        if (grade.classAssignment?.professeur) {
          const prof = grade.classAssignment.professeur;
          professeurName = `${prof.firstName || ""} ${
            prof.lastName || ""
          }`.trim();
        } else if (grade.professeur) {
          const prof = grade.professeur;
          professeurName = `${prof.firstName || ""} ${
            prof.lastName || ""
          }`.trim();
        }

        return {
          id: grade.id || `grade-${index}-${Date.now()}`,
          grade: gradeValue,
          normalizedGrade,
          subjectName:
            grade.subject?.name ||
            grade.subjectName ||
            grade.subject?.subjectName ||
            "Matière inconnue",
          coefficient: grade.subject?.coefficient || grade.coefficient || 1,
          passingGrade: grade.subject?.passingGrade || grade.passingGrade || 10,
          maxGrade: maxGrade,
          professeurName: professeurName,
          controlType:
            grade.controlType || filters?.controlType || ControlType.CONTROLE_1,
          controlGrades,
          subject: grade.subject || null,
          classAssignment: grade.classAssignment || null,
        };
      });

      console.log(`📊 Created ${gradesWithDetails.length} grade details`);

      // Calculer les statistiques
      const totalCoefficient = gradesWithDetails.reduce(
        (sum, grade) => sum + grade.coefficient,
        0
      );

      const weightedSum = gradesWithDetails.reduce(
        (sum, grade) => sum + grade.normalizedGrade * grade.coefficient,
        0
      );

      const weightedAverage =
        totalCoefficient > 0 ? weightedSum / totalCoefficient : 0;

      const passingSubjects = gradesWithDetails.filter(
        (grade) => grade.normalizedGrade >= 10
      ).length;

      const successRate =
        gradesWithDetails.length > 0
          ? (passingSubjects / gradesWithDetails.length) * 100
          : 0;

      const normalizedGrades = gradesWithDetails.map((g) => g.normalizedGrade);
      const minGrade =
        normalizedGrades.length > 0 ? Math.min(...normalizedGrades) : 0;
      const maxGrade =
        normalizedGrades.length > 0 ? Math.max(...normalizedGrades) : 0;

      const statistics: BulletinStatistics = {
        average: weightedAverage,
        weightedAverage,
        totalCoefficient,
        successRate,
        minGrade,
        maxGrade,
        totalSubjects: gradesWithDetails.length,
        passingSubjects,
      };

      console.log("📈 Calculated statistics:", statistics);

      // Grouper par contrôle si nécessaire
      let gradesByControlType: Record<string, GradeWithDetails[]> = {};
      if (filters?.includeControlGrades && gradesData.length > 0) {
        gradesWithDetails.forEach((grade) => {
          if (
            grade.controlGrades &&
            Object.keys(grade.controlGrades).length > 0
          ) {
            Object.keys(grade.controlGrades).forEach((controlType) => {
              if (!gradesByControlType[controlType]) {
                gradesByControlType[controlType] = [];
              }

              const controlGrade =
                grade.controlGrades![controlType as ControlType];
              gradesByControlType[controlType].push({
                ...grade,
                grade: controlGrade?.grade || 0,
                normalizedGrade: controlGrade?.normalizedGrade || 0,
              });
            });
          } else if (grade.controlType) {
            // Grouper par controlType direct
            const controlType = grade.controlType;
            if (!gradesByControlType[controlType]) {
              gradesByControlType[controlType] = [];
            }
            gradesByControlType[controlType].push(grade);
          }
        });
      }

      console.log(
        "📊 Grades by control type:",
        Object.keys(gradesByControlType)
      );

      return {
        success: true,
        data: {
          grades: gradesWithDetails,
          statistics,
          gradesByControlType:
            Object.keys(gradesByControlType).length > 0
              ? gradesByControlType
              : undefined,
        },
      };
    } catch (error) {
      console.error("❌ Error in getStudentGrades:", error);

      // Données de test pour le débogage
      const testGrades: GradeWithDetails[] = [
        {
          id: "test-1",
          grade: 15,
          normalizedGrade: 15,
          subjectName: "Mathématiques",
          coefficient: 4,
          passingGrade: 10,
          maxGrade: 20,
          professeurName: "Professeur Test",
          controlType: ControlType.CONTROLE_1,
          controlGrades: {
            [ControlType.CONTROLE_1]: { grade: 15, normalizedGrade: 15 },
            [ControlType.CONTROLE_2]: { grade: 14, normalizedGrade: 14 },
          },
        },
        {
          id: "test-2",
          grade: 12,
          normalizedGrade: 12,
          subjectName: "Français",
          coefficient: 3,
          passingGrade: 10,
          maxGrade: 20,
          professeurName: "Professeur Test 2",
          controlType: ControlType.CONTROLE_1,
        },
      ];

      const testStats: BulletinStatistics = {
        average: 13.5,
        weightedAverage: 13.71,
        totalCoefficient: 7,
        successRate: 100,
        minGrade: 12,
        maxGrade: 15,
        totalSubjects: 2,
        passingSubjects: 2,
      };

      console.log("⚠️ Returning test data due to error");
      return {
        success: false,
        data: {
          grades: testGrades,
          statistics: testStats,
        },
      };
    }
  }

  /**
   * Génère un bulletin PDF
   */
  async generateBulletin(request: BulletinGenerationRequest): Promise<{
    success: boolean;
    data: {
      transcriptId: string;
      fileName: string;
      generatedAt: string;
      statistics: BulletinStatistics;
      statisticsByControl?: Record<string, BulletinStatistics>;
      documentUrl?: string;
    };
    message: string;
  }> {
    try {
      const response = await api.post("/bulletins/generate", request);
      console.log("📄 Bulletin generation response:", response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gestion des erreurs
   */
  private handleError(error: any): Error {
    console.error("BulletinService Error:", error);

    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Une erreur est survenue";

      if (error.response.data?.errors) {
        const details = Object.entries(error.response.data.errors)
          .map(
            ([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`
          )
          .join("\n");
        return new Error(`${message}\n${details}`);
      }

      return new Error(message);
    } else if (error.request) {
      return new Error("Impossible de joindre le serveur");
    } else {
      return new Error("Erreur de configuration: " + error.message);
    }
  }
}

export default new BulletinService();
