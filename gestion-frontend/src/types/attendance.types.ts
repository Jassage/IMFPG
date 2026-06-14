// src/types/attendance.types.ts

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED"
  | "HOLIDAY"
  | "SICK"
  | "SUSPENDED"
  | "OTHER";

export type AttendanceSessionn = "MORNING" | "AFTERNOON" | "FULL_DAY";

export type AttendanceValidationStatus = "PENDING" | "VALIDATED" | "REJECTED";

export type AttendanceJustificationType =
  | "MEDICAL_CERTIFICATE"
  | "FAMILY_REASON"
  | "ADMINISTRATIVE"
  | "TRANSPORT_ISSUE"
  | "OTHER";

export interface BulkValidationData {
  attendanceIds: string[];
  validationStatus: "VALIDATED" | "REJECTED";
  notes?: string;
}
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  photo?: string;
  class?: SchoolClass;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Professeur {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  date: string;
  session: AttendanceSessionn;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  expectedCheckIn?: string;
  expectedCheckOut?: string;
  validationStatus: AttendanceValidationStatus;
  validatedBy?: string;
  validatedAt?: string;
  justification?: string;
  justificationType?: AttendanceJustificationType;
  justificationDoc?: string;
  justifiedAt?: string;
  justifiedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  student?: Student;
  schoolClass?: SchoolClass;
  createdBy?: User;
  validatedByUser?: User;
  justifiedByUser?: User;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  subjectId: string;
  professeurId: string;
  academicYearId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic?: string;
  description?: string;
  isCompleted: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  schoolClass?: SchoolClass;
  subject?: Subject;
  professeur?: Professeur;
  createdBy?: User;
  _count?: {
    attendanceRecords: number;
  };
}

export interface AttendanceStats {
  id: string;
  studentId: string;
  academicYearId: string;
  month: number;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  sickDays: number;
  attendanceRate: number;
  punctualityRate: number;
  lastCalculated: string;

  student?: Student;
}

export interface AttendanceFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  academicYearId?: string;
  status?: AttendanceStatus;
  validationStatus?: AttendanceValidationStatus;
  startDate?: string;
  endDate?: string;
  session?: AttendanceSessionn;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  date?: string;
  classIds?: string[];
  studentIds?: string[];
}

export interface AttendanceSessionFilters {
  page?: number;
  limit?: number;
  classId?: string;
  subjectId?: string;
  professeurId?: string;
  academicYearId?: string;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
  isCancelled?: boolean;
}

export interface AttendanceSettings {
  id: string;
  schoolId: string;
  defaultMorningStart: string;
  defaultMorningEnd: string;
  defaultAfternoonStart: string;
  defaultAfternoonEnd: string;
  lateThreshold: number;
  autoValidateAfter?: number;
  notifyOnAbsence: boolean;
  notifyParentsOnAbsence: boolean;
  notifyOnLate: boolean;
  requireJustification: boolean;
  maxConsecutiveAbsences: number;
  alertThreshold: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  metadata?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  sick: number;
  rate: number;
  byClass: {
    classId: string;
    className: string;
    total: number;
    present: number;
    rate: number;
  }[];
  byDate: {
    date: string;
    present: number;
    absent: number;
    rate: number;
  }[];
}

// Formater une date
export const formatDate = (
  date: string | Date,
  formatType: "short" | "long" = "short",
): string => {
  if (!date) return "Date inconnue";

  try {
    const d = new Date(date);

    // Vérifier si la date est valide
    if (isNaN(d.getTime())) {
      console.warn("Date invalide:", date);
      return "Date invalide";
    }

    if (formatType === "short") {
      // Format: DD/MM/YYYY
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Format long: lundi 22 mars 2026
    const days = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const dayName = days[d.getDay()];
    const dayNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    return `${dayName} ${dayNum} ${monthName} ${year}`;
  } catch (error) {
    console.error("Erreur formatage date:", error);
    return "Date invalide";
  }
};

// Formater une heure
export const formatTime = (time: string): string => {
  if (!time) return "--:--";

  try {
    // Si c'est déjà au format HH:MM
    if (time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time;
    }

    // Si c'est un timestamp ISO
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // Si c'est une chaîne comme "2026-03-22T15:39:05.701Z", on extrait l'heure
    if (time.includes("T")) {
      const parts = time.split("T")[1].split(".")[0].split(":");
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }

    return "--:--";
  } catch (error) {
    console.error("Erreur formatage heure:", error);
    return "--:--";
  }
};

// Formater une date et heure combinées
export const formatDateTime = (date: string | Date): string => {
  if (!date) return "Date inconnue";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Date invalide";

    const dateStr = formatDate(date, "short");
    const timeStr = formatTime(date);
    return `${dateStr} à ${timeStr}`;
  } catch (error) {
    return "Date invalide";
  }
};

// Obtenir le libellé du statut
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

// Obtenir la couleur du statut
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

// Obtenir l'icône du statut (emoji)
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

// Valider un code étudiant
export const validateStudentCode = (code: string): boolean => {
  if (!code) return false;
  // Format: 2 lettres + 4 chiffres (ex: ET1234) ou STU + 6 chiffres (ex: STU260003)
  const regex = /^([A-Z]{2}\d{4}|STU\d{6})$/;
  return regex.test(code.toUpperCase());
};

// Grouper les présences par date
export const groupAttendancesByDate = (attendances: any[]) => {
  return attendances.reduce(
    (groups, attendance) => {
      const date = formatDate(attendance.date, "short");
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
    percentage: total > 0 ? (count / total) * 100 : 0,
    label: getStatusLabel(status as AttendanceStatus),
    color: getStatusColor(status as AttendanceStatus),
  }));
};
