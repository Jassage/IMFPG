// src/utils/attendanceUtils.ts

import {
  AttendanceStatus,
  AttendanceSession,
  AttendanceSessionn,
} from "../types/attendance.types";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

// Couleurs pour les statuts (adaptées pour shadcn/ui)
export const getStatusColor = (status: AttendanceStatus): string => {
  const colors: Record<AttendanceStatus, string> = {
    PRESENT: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    ABSENT: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
    LATE: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
    EXCUSED: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    HOLIDAY:
      "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
    SICK: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
    SUSPENDED: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    OTHER: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
  };
  return colors[status] || colors.OTHER;
};

// Icônes pour les statuts (utilisant des emojis simples, ou vous pouvez utiliser lucide-react)
export const getStatusIcon = (status: AttendanceStatus): string => {
  const icons: Record<AttendanceStatus, string> = {
    PRESENT: "✓",
    ABSENT: "✗",
    LATE: "⏰",
    EXCUSED: "📝",
    HOLIDAY: "🎉",
    SICK: "🤒",
    SUSPENDED: "⛔",
    OTHER: "?",
  };
  return icons[status] || icons.OTHER;
};

// Libellés pour les statuts
export const getStatusLabel = (status: AttendanceStatus): string => {
  const labels: Record<AttendanceStatus, string> = {
    PRESENT: "Présent",
    ABSENT: "Absent",
    LATE: "Retard",
    EXCUSED: "Excusé",
    HOLIDAY: "Congé",
    SICK: "Malade",
    SUSPENDED: "Suspendu",
    OTHER: "Autre",
  };
  return labels[status] || status;
};

// Couleurs pour les sessions
export const getSessionColor = (session: AttendanceSession): string => {
  const colors: Record<string, string> = {
    MORNING: "bg-amber-100 text-amber-800",
    AFTERNOON: "bg-indigo-100 text-indigo-800",
    FULL_DAY: "bg-emerald-100 text-emerald-800",
  };
  return colors[session as unknown as string];
};

// Libellés pour les sessions
export const getSessionLabel = (session: AttendanceSession): string => {
  const labels: Record<string, string> = {
    MORNING: "Matin",
    AFTERNOON: "Après-midi",
    FULL_DAY: "Journée complète",
  };
  return labels[session as unknown as string];
};

// Formater une date avec date-fns
export const formatDate = (
  date: string | Date,
  formatType: "short" | "long" = "short",
): string => {
  const d = new Date(date);
  if (formatType === "short") {
    return format(d, "dd/MM/yyyy", { locale: fr });
  }
  return format(d, "EEEE d MMMM yyyy", { locale: fr });
};

// Formater une heure
export const formatTime = (time: string): string => {
  return time;
};

// Calculer le taux de présence
export const calculateAttendanceRate = (
  present: number,
  total: number,
): number => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

// Obtenir la couleur du taux
export const getRateColor = (rate: number): string => {
  if (rate >= 90) return "text-green-600";
  if (rate >= 75) return "text-yellow-600";
  if (rate >= 50) return "text-orange-600";
  return "text-red-600";
};

// Obtenir le libellé de validation
export const getValidationLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    VALIDATED: "Validé",
    REJECTED: "Rejeté",
  };
  return labels[status] || status;
};

// Obtenir la couleur de validation
export const getValidationColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    VALIDATED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Grouper les présences par date
export const groupAttendancesByDate = (attendances: any[]) => {
  return attendances.reduce(
    (groups, attendance) => {
      const date = attendance.date.split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(attendance);
      return groups;
    },
    {} as Record<string, any[]>,
  );
};

// Calculer les statistiques par statut
export const calculateStatusStats = (attendances: any[]) => {
  const total = attendances.length;
  const stats = attendances.reduce(
    (acc, attendance) => {
      acc[attendance.status] = (acc[attendance.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(stats).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    label: getStatusLabel(status as AttendanceStatus),
    color: getStatusColor(status as AttendanceStatus),
  }));
};

// Valider un code étudiant
export const validateStudentCode = (code: string): boolean => {
  // Format: 3 lettres + 6 chiffres (ex: EA123456)
  const regex = /^[A-Z]{3}\d{6}$/;
  return regex.test(code);
};
