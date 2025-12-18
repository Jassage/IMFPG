/**
 * Utilitaires pour la gestion des notes
 */

import {
  ControlType,
  Grade,
  SubjectStatistics,
  ValidationResult,
  ControlCoefficients,
  Student,
  Subject,
  AcademicYear,
} from "../types/grade";

// Noms des contrôles en français
export const CONTROL_NAMES: Record<ControlType, string> = {
  [ControlType.CONTROLE_1]: "Contrôle 1",
  [ControlType.CONTROLE_2]: "Contrôle 2",
  [ControlType.CONTROLE_3]: "Contrôle 3",
  [ControlType.CONTROLE_4]: "Contrôle 4",
};

// Coefficients par défaut
export const DEFAULT_COEFFICIENTS: ControlCoefficients = {
  [ControlType.CONTROLE_1]: 1,
  [ControlType.CONTROLE_2]: 1,
  [ControlType.CONTROLE_3]: 1,
  [ControlType.CONTROLE_4]: 1,
};

// Tous les types de contrôle
export const ALL_CONTROL_TYPES: ControlType[] = [
  ControlType.CONTROLE_1,
  ControlType.CONTROLE_2,
  ControlType.CONTROLE_3,
  ControlType.CONTROLE_4,
];

/**
 * Valide une note individuelle
 */
export function validateGrade(grade: number): ValidationResult {
  const errors: string[] = [];

  if (grade < 0 || grade > 20) {
    errors.push("La note doit être comprise entre 0 et 20");
  }

  if (typeof grade !== "number") {
    errors.push("La note doit être un nombre");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide le type de contrôle
 */
export function validateControlType(controlType: string): ValidationResult {
  const errors: string[] = [];

  if (!Object.values(ControlType).includes(controlType as ControlType)) {
    errors.push(
      `Type de contrôle invalide. Valeurs acceptées: ${ALL_CONTROL_TYPES.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calcule les statistiques pour une matière
 */
export function calculateSubjectStatistics(grades: Grade[]): SubjectStatistics {
  if (!grades || grades.length === 0) {
    return {
      average: null,
      totalCoefficient: 0,
      totalPoints: 0,
      missingControls: ALL_CONTROL_TYPES,
      isComplete: false,
      controlCount: 0,
      details: {} as Record<ControlType, Grade>,
    };
  }

  const gradesByControl: Record<ControlType, Grade> = {} as Record<
    ControlType,
    Grade
  >;
  const existingControls = new Set<ControlType>();

  // Organiser les notes par type de contrôle
  grades.forEach((grade) => {
    gradesByControl[grade.controlType] = grade;
    existingControls.add(grade.controlType);
  });

  // Calculer les totaux
  let totalPoints = 0;
  let totalCoefficient = 0;

  ALL_CONTROL_TYPES.forEach((controlType) => {
    const grade = gradesByControl[controlType];
    if (grade) {
      const coefficient =
        grade.coefficient || DEFAULT_COEFFICIENTS[controlType];
      totalPoints += grade.grade * coefficient;
      totalCoefficient += coefficient;
    }
  });

  const missingControls = ALL_CONTROL_TYPES.filter(
    (type) => !existingControls.has(type)
  );
  const average =
    totalCoefficient > 0
      ? parseFloat((totalPoints / totalCoefficient).toFixed(2))
      : null;

  return {
    average,
    totalCoefficient,
    totalPoints,
    missingControls,
    isComplete: missingControls.length === 0,
    controlCount: grades.length,
    details: gradesByControl,
  };
}

/**
 * Calcule la moyenne générale d'un étudiant
 */
export function calculateGeneralAverage(
  subjectsStatistics: SubjectStatistics[]
): number {
  const validSubjects = subjectsStatistics.filter((s) => s.average !== null);

  if (validSubjects.length === 0) {
    return 0;
  }

  const totalAverage = validSubjects.reduce(
    (sum, stats) => sum + (stats.average || 0),
    0
  );
  return parseFloat((totalAverage / validSubjects.length).toFixed(2));
}

/**
 * Vérifie si un étudiant a réussi une matière
 */
export function isSubjectPassing(
  average: number | null,
  passingGrade: number
): boolean {
  return average !== null && average >= passingGrade;
}

/**
 * Génère des recommandations basées sur les notes
 */
export function generateRecommendations(
  subjects: Array<{
    subject: { name: string; passingGrade: number };
    statistics: SubjectStatistics;
  }>
): Array<{
  type: "WARNING" | "INFO" | "SUCCESS";
  subject: string;
  message: string;
  suggestion: string;
}> {
  const recommendations: Array<{
    type: "WARNING" | "INFO" | "SUCCESS";
    subject: string;
    message: string;
    suggestion: string;
  }> = [];

  subjects.forEach((item) => {
    const { subject, statistics } = item;

    // Vérifier les matières avec moyenne basse
    if (
      statistics.average !== null &&
      statistics.average < subject.passingGrade
    ) {
      recommendations.push({
        type: "WARNING",
        subject: subject.name,
        message: `Moyenne basse en ${subject.name} (${statistics.average}/20, minimum: ${subject.passingGrade}/20)`,
        suggestion: "Rattrapage recommandé ou travail supplémentaire",
      });
    }

    // Vérifier les contrôles manquants
    if (!statistics.isComplete) {
      const missingNames = statistics.missingControls
        .map((c) => CONTROL_NAMES[c])
        .join(", ");
      recommendations.push({
        type: "INFO",
        subject: subject.name,
        message: `Contrôles manquants en ${subject.name}: ${missingNames}`,
        suggestion: "Compléter les notes manquantes",
      });
    }

    // Félicitations pour les bonnes moyennes
    if (statistics.average !== null && statistics.average >= 16) {
      recommendations.push({
        type: "SUCCESS",
        subject: subject.name,
        message: `Excellente moyenne en ${subject.name} (${statistics.average}/20)`,
        suggestion: "Continuer les efforts",
      });
    }
  });

  return recommendations;
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return "Non définie";

  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Convertit les notes en format CSV
 */
export function gradesToCSV(
  grades: Array<
    Grade & {
      student?: Student;
      subject?: Subject;
      academicYear?: AcademicYear;
    }
  >
): string {
  const headers = [
    "ID Étudiant",
    "Code Étudiant",
    "Nom",
    "Prénom",
    "Matière",
    "Code Matière",
    "Type de Contrôle",
    "Note",
    "Coefficient",
    "Statut",
    "Session",
    "Niveau",
    "Année Académique",
    "Date Examen",
    "Date de création",
  ];

  const rows = grades.map((grade) => [
    grade.studentId,
    grade.student?.studentCode || "",
    grade.student?.lastName || "",
    grade.student?.firstName || "",
    grade.subject?.name || "",
    grade.subject?.code || "",
    CONTROL_NAMES[grade.controlType],
    grade.grade.toString().replace(".", ","),
    grade.coefficient.toString(),
    grade.status,
    grade.session,
    grade.classLevel,
    grade.academicYear?.year || "",
    grade.examDate ? formatDate(grade.examDate) : "",
    formatDate(grade.createdAt),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
}

/**
 * Valide les coefficients de contrôle
 */
export function validateCoefficients(
  coefficients: Partial<ControlCoefficients>
): ValidationResult {
  const errors: string[] = [];

  ALL_CONTROL_TYPES.forEach((controlType) => {
    const coeff = coefficients[controlType];

    if (coeff === undefined || coeff === null) {
      errors.push(`Coefficient manquant pour ${CONTROL_NAMES[controlType]}`);
    } else if (typeof coeff !== "number") {
      errors.push(
        `Le coefficient pour ${CONTROL_NAMES[controlType]} doit être un nombre`
      );
    } else if (coeff <= 0) {
      errors.push(
        `Le coefficient pour ${CONTROL_NAMES[controlType]} doit être positif`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
