// hooks/useGradePermissions.ts
import { useAuthStore } from "@/store/authStore";
import { Grade } from "@/types/academic";
import { GradeStatus } from "@/types/bulletin";

export const useGradePermissions = () => {
  const { user } = useAuthStore();

  const isTeacher = user?.role === "Professeur";
  const isAdmin = user?.role === "Admin";

  const canEditGrade = (grade: Grade | undefined): boolean => {
    if (!grade) return true; // Nouvelle note

    if (isAdmin) return true; // Admin peut tout modifier

    if (isTeacher) {
      // Le professeur peut modifier ses propres notes non validées
      return (
        grade.submittedBy === user?.id &&
        (grade.status === GradeStatus.DRAFT ||
          grade.status === GradeStatus.SUBMITTED)
      );
    }

    return false;
  };

  const canDeleteGrade = (grade: Grade): boolean => {
    if (isAdmin) return true;

    if (isTeacher) {
      return (
        grade.submittedBy === user?.id && grade.status === GradeStatus.DRAFT
      );
    }

    return false;
  };

  const canSubmitForApproval = (grade: Grade): boolean => {
    return (
      isTeacher &&
      grade.submittedBy === user?.id &&
      grade.status === GradeStatus.DRAFT
    );
  };

  const canApproveGrade = (grade: Grade): boolean => {
    return isAdmin && grade.status === GradeStatus.SUBMITTED;
  };

  const canRejectGrade = (grade: Grade): boolean => {
    return isAdmin && grade.status === GradeStatus.SUBMITTED;
  };

  const canPublishGrade = (grade: Grade): boolean => {
    return isAdmin && grade.status === GradeStatus.APPROVED;
  };

  return {
    isTeacher,
    isAdmin,
    canEditGrade,
    canDeleteGrade,
    canSubmitForApproval,
    canApproveGrade,
    canRejectGrade,
    canPublishGrade,
    userId: user?.id,
    userRole: user?.role,
  };
};
