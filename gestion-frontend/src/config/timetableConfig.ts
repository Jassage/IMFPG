// Fichier: src/config/timetableConfig.ts
export const TimetableConfig = {
  // Heures de travail standard
  workingHours: {
    start: "08:00",
    end: "19:00",
  },

  // Créneaux horaires par défaut
  defaultTimeSlots: [
    { start: "08:00", end: "09:30", duration: 90 },
    { start: "09:45", end: "11:15", duration: 90 },
    { start: "11:30", end: "13:00", duration: 90 },
    { start: "14:00", end: "15:30", duration: 90 },
    { start: "15:45", end: "17:15", duration: 90 },
    { start: "17:30", end: "19:00", duration: 90 },
  ],

  // Jours de la semaine (0 = Lundi, 5 = Samedi)
  weekDays: [
    { id: 0, name: "Lundi", abbreviation: "LUN", isActive: true },
    { id: 1, name: "Mardi", abbreviation: "MAR", isActive: true },
    { id: 2, name: "Mercredi", abbreviation: "MER", isActive: true },
    { id: 3, name: "Jeudi", abbreviation: "JEU", isActive: true },
    { id: 4, name: "Vendredi", abbreviation: "VEN", isActive: true },
    { id: 5, name: "Samedi", abbreviation: "SAM", isActive: true },
  ],

  // Types de sessions
  sessionTypes: [
    { value: "Cours", label: "Cours", color: "#3b82f6", duration: 90 },
    {
      value: "TP",
      label: "Travaux pratiques",
      color: "#10b981",
      duration: 120,
    },
    { value: "TD", label: "Travaux dirigés", color: "#f59e0b", duration: 90 },
    { value: "Examen", label: "Examen", color: "#ef4444", duration: 120 },
    { value: "Autre", label: "Autre", color: "#6b7280", duration: 60 },
  ],

  // Contraintes de génération par défaut
  generationConstraints: {
    maxSessionsPerDay: 6,
    minBreakBetweenSessions: 15, // minutes
    maxHoursPerDay: 8,
    avoidAfternoonSessions: false,
    preferredTimes: [
      { start: "08:00", end: "10:00", weight: 1.2 },
      { start: "10:00", end: "12:00", weight: 1.0 },
      { start: "14:00", end: "16:00", weight: 0.8 },
      { start: "16:00", end: "18:00", weight: 0.6 },
    ],
  },

  // Configuration des conflits
  conflictChecks: {
    checkTeacherConflicts: true,
    checkClassroomConflicts: true,
    checkClassConflicts: true,
    allowOverlappingSessions: false,
  },

  // Configuration des exports
  exportFormats: {
    ics: {
      enabled: true,
      timezone: "Africa/Tunis",
      includeDescription: true,
      includeLocation: true,
    },
    pdf: {
      enabled: true,
      orientation: "landscape",
      format: "A3",
    },
    excel: {
      enabled: true,
      includeTeachers: true,
      includeClassrooms: true,
    },
  },

  // Notifications
  notifications: {
    onTimetableChange: true,
    onSessionConflict: true,
    onRoomChange: true,
    emailNotifications: true,
    pushNotifications: true,
  },

  // Cache configuration
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour in seconds
    maxSize: 1000,
  },
};

// Fonction utilitaire pour formater les heures
export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonction pour calculer la durée en minutes
export const calculateDuration = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / (1000 * 60);
};

// Fonction pour vérifier si un créneau est valide
export const isValidTimeSlot = (start: Date, end: Date): boolean => {
  const duration = calculateDuration(start, end);
  const startHour = start.getHours();
  const endHour = end.getHours();

  return (
    duration > 0 &&
    duration <= 240 && // Max 4 heures
    startHour >= 8 &&
    endHour <= 19
  );
};

// Fonction pour obtenir le nom du jour
export const getDayName = (dayOfWeek: number): string => {
  return TimetableConfig.weekDays[dayOfWeek]?.name || `Jour ${dayOfWeek}`;
};

// Fonction pour obtenir la couleur du type de session
export const getSessionTypeColor = (type: string): string => {
  const sessionType = TimetableConfig.sessionTypes.find(
    (t) => t.value === type
  );
  return sessionType?.color || "#6b7280";
};
