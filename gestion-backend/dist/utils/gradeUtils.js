"use strict";
/**
 * Utilitaires pour la gestion des notes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CONTROL_TYPES = exports.DEFAULT_COEFFICIENTS = exports.CONTROL_NAMES = void 0;
exports.validateGrade = validateGrade;
exports.validateControlType = validateControlType;
exports.calculateSubjectStatistics = calculateSubjectStatistics;
exports.calculateGeneralAverage = calculateGeneralAverage;
exports.isSubjectPassing = isSubjectPassing;
exports.generateRecommendations = generateRecommendations;
exports.formatDate = formatDate;
exports.gradesToCSV = gradesToCSV;
exports.validateCoefficients = validateCoefficients;
const grade_1 = require("../types/grade");
// Noms des contrôles en français
exports.CONTROL_NAMES = {
    [grade_1.ControlType.CONTROLE_1]: "Contrôle 1",
    [grade_1.ControlType.CONTROLE_2]: "Contrôle 2",
    [grade_1.ControlType.CONTROLE_3]: "Contrôle 3",
    [grade_1.ControlType.CONTROLE_4]: "Contrôle 4",
};
// Coefficients par défaut
exports.DEFAULT_COEFFICIENTS = {
    [grade_1.ControlType.CONTROLE_1]: 1,
    [grade_1.ControlType.CONTROLE_2]: 1,
    [grade_1.ControlType.CONTROLE_3]: 1,
    [grade_1.ControlType.CONTROLE_4]: 1,
};
// Tous les types de contrôle
exports.ALL_CONTROL_TYPES = [
    grade_1.ControlType.CONTROLE_1,
    grade_1.ControlType.CONTROLE_2,
    grade_1.ControlType.CONTROLE_3,
    grade_1.ControlType.CONTROLE_4,
];
/**
 * Valide une note individuelle
 */
function validateGrade(grade) {
    const errors = [];
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
function validateControlType(controlType) {
    const errors = [];
    if (!Object.values(grade_1.ControlType).includes(controlType)) {
        errors.push(`Type de contrôle invalide. Valeurs acceptées: ${exports.ALL_CONTROL_TYPES.join(", ")}`);
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Calcule les statistiques pour une matière
 */
function calculateSubjectStatistics(grades) {
    if (!grades || grades.length === 0) {
        return {
            average: null,
            totalCoefficient: 0,
            totalPoints: 0,
            missingControls: exports.ALL_CONTROL_TYPES,
            isComplete: false,
            controlCount: 0,
            details: {},
        };
    }
    const gradesByControl = {};
    const existingControls = new Set();
    // Organiser les notes par type de contrôle
    grades.forEach((grade) => {
        gradesByControl[grade.controlType] = grade;
        existingControls.add(grade.controlType);
    });
    // Calculer les totaux
    let totalPoints = 0;
    let totalCoefficient = 0;
    exports.ALL_CONTROL_TYPES.forEach((controlType) => {
        const grade = gradesByControl[controlType];
        if (grade) {
            const coefficient = grade.coefficient || exports.DEFAULT_COEFFICIENTS[controlType];
            totalPoints += grade.grade * coefficient;
            totalCoefficient += coefficient;
        }
    });
    const missingControls = exports.ALL_CONTROL_TYPES.filter((type) => !existingControls.has(type));
    const average = totalCoefficient > 0
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
function calculateGeneralAverage(subjectsStatistics) {
    const validSubjects = subjectsStatistics.filter((s) => s.average !== null);
    if (validSubjects.length === 0) {
        return 0;
    }
    const totalAverage = validSubjects.reduce((sum, stats) => sum + (stats.average || 0), 0);
    return parseFloat((totalAverage / validSubjects.length).toFixed(2));
}
/**
 * Vérifie si un étudiant a réussi une matière
 */
function isSubjectPassing(average, passingGrade) {
    return average !== null && average >= passingGrade;
}
/**
 * Génère des recommandations basées sur les notes
 */
function generateRecommendations(subjects) {
    const recommendations = [];
    subjects.forEach((item) => {
        const { subject, statistics } = item;
        // Vérifier les matières avec moyenne basse
        if (statistics.average !== null &&
            statistics.average < subject.passingGrade) {
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
                .map((c) => exports.CONTROL_NAMES[c])
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
function formatDate(date) {
    if (!date)
        return "Non définie";
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
function gradesToCSV(grades) {
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
        exports.CONTROL_NAMES[grade.controlType],
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
function validateCoefficients(coefficients) {
    const errors = [];
    exports.ALL_CONTROL_TYPES.forEach((controlType) => {
        const coeff = coefficients[controlType];
        if (coeff === undefined || coeff === null) {
            errors.push(`Coefficient manquant pour ${exports.CONTROL_NAMES[controlType]}`);
        }
        else if (typeof coeff !== "number") {
            errors.push(`Le coefficient pour ${exports.CONTROL_NAMES[controlType]} doit être un nombre`);
        }
        else if (coeff <= 0) {
            errors.push(`Le coefficient pour ${exports.CONTROL_NAMES[controlType]} doit être positif`);
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=gradeUtils.js.map