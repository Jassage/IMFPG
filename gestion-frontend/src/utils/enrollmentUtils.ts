import { useStudentStore } from "@/store/studentStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";

/**
 * Récupère les étudiants filtrés par année académique et niveau
 */
export const getStudentsByAcademicYearAndLevel = (
  academicYearId: string,
  classLevel: string
) => {
  const { students } = useStudentStore.getState();
  const { enrollments } = useEnrollmentStore.getState();

  // 1. Trouver les inscriptions actives pour l'année académique
  const activeEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.academicYearId === academicYearId &&
      enrollment.status === "Active"
  );

  // 2. Extraire les IDs d'étudiants inscrits
  const enrolledStudentIds = activeEnrollments.map((e) => e.studentId);

  // 3. Filtrer les étudiants par classe et statut
  const filteredStudents = students.filter((student) => {
    // Vérifier si l'étudiant est inscrit pour cette année
    if (!enrolledStudentIds.includes(student.id)) {
      return false;
    }

    // Vérifier le niveau de classe
    if (student.schoolClass?.level !== classLevel) {
      return false;
    }

    // Vérifier le statut de l'étudiant
    if (student.status !== "Active") {
      return false;
    }

    return true;
  });

  return filteredStudents;
};
