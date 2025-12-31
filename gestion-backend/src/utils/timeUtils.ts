/**
 * @file timeUtils.ts
 * @description Utilitaires pour la gestion du temps avec support ISO
 * @version 1.0.0
 */

/**
 * Convertit HH:MM en timestamp ISO (UTC)
 */
export const convertHHMMtoISO = (
  timeString: string,
  baseDate = "2000-01-01"
): string => {
  if (!timeString || !timeString.includes(":")) {
    return `${baseDate}T00:00:00.000Z`;
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(
    Date.UTC(
      2000,
      0,
      1, // Date fixe pour éviter les problèmes de fuseau horaire
      hours || 0,
      minutes || 0,
      0,
      0
    )
  );

  return date.toISOString();
};

/**
 * Extrait HH:MM d'un timestamp ISO
 */
export const extractHHMMfromISO = (isoString: string): string => {
  if (!isoString) return "00:00";

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "00:00";

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "00:00";
  }
};

/**
 * Valide un timestamp ISO
 */
export const isValidISO = (isoString: string): boolean => {
  try {
    const date = new Date(isoString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Calcule la durée en minutes entre deux timestamps ISO
 */
export const calculateDuration = (startISO: string, endISO: string): number => {
  try {
    const start = new Date(startISO);
    const end = new Date(endISO);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    return (end.getTime() - start.getTime()) / (1000 * 60);
  } catch {
    return 0;
  }
};

/**
 * Vérifie si deux créneaux se chevauchent
 */
export const checkTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  try {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();

    return s1 < e2 && e1 > s2;
  } catch {
    return false;
  }
};

/**
 * Formate une durée en minutes en format lisible
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins} minutes`;
  } else if (mins === 0) {
    return `${hours} heures`;
  } else {
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  }
};

/**
 * Crée un timestamp ISO à partir d'une heure et d'un jour
 */
export const createScheduleISO = (
  dayOfWeek: string,
  timeHHMM: string
): string => {
  // Convertir le jour en date (ex: prochain lundi)
  const daysMap: { [key: string]: number } = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };

  const targetDay = daysMap[dayOfWeek.toUpperCase()];
  if (targetDay === undefined) {
    throw new Error(`Jour invalide: ${dayOfWeek}`);
  }

  const today = new Date();
  const currentDay = today.getDay();
  let daysToAdd = targetDay - currentDay;

  if (daysToAdd <= 0) {
    daysToAdd += 7; // Prendre la semaine suivante
  }

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);

  // Ajouter l'heure
  const [hours, minutes] = timeHHMM.split(":").map(Number);
  targetDate.setHours(hours, minutes || 0, 0, 0);

  return targetDate.toISOString();
};

/**
 * Parse un timestamp ISO en objet lisible
 */
export const parseISOToObject = (
  isoString: string
): {
  date: Date;
  day: string;
  time: string;
  hour: number;
  minute: number;
} => {
  const date = new Date(isoString);

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const day = days[date.getDay()];

  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  return {
    date,
    day,
    time,
    hour,
    minute,
  };
};
