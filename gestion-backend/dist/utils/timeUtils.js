"use strict";
/**
 * @file timeUtils.ts
 * @description Utilitaires pour la gestion du temps avec support ISO
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseISOToObject = exports.createScheduleISO = exports.formatDuration = exports.checkTimeOverlap = exports.calculateDuration = exports.isValidISO = exports.extractHHMMfromISO = exports.convertHHMMtoISO = void 0;
/**
 * Convertit HH:MM en timestamp ISO (UTC)
 */
const convertHHMMtoISO = (timeString, baseDate = "2000-01-01") => {
    if (!timeString || !timeString.includes(":")) {
        return `${baseDate}T00:00:00.000Z`;
    }
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(Date.UTC(2000, 0, 1, // Date fixe pour éviter les problèmes de fuseau horaire
    hours || 0, minutes || 0, 0, 0));
    return date.toISOString();
};
exports.convertHHMMtoISO = convertHHMMtoISO;
/**
 * Extrait HH:MM d'un timestamp ISO
 */
const extractHHMMfromISO = (isoString) => {
    if (!isoString)
        return "00:00";
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime()))
            return "00:00";
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }
    catch {
        return "00:00";
    }
};
exports.extractHHMMfromISO = extractHHMMfromISO;
/**
 * Valide un timestamp ISO
 */
const isValidISO = (isoString) => {
    try {
        const date = new Date(isoString);
        return !isNaN(date.getTime());
    }
    catch {
        return false;
    }
};
exports.isValidISO = isValidISO;
/**
 * Calcule la durée en minutes entre deux timestamps ISO
 */
const calculateDuration = (startISO, endISO) => {
    try {
        const start = new Date(startISO);
        const end = new Date(endISO);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return 0;
        }
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    catch {
        return 0;
    }
};
exports.calculateDuration = calculateDuration;
/**
 * Vérifie si deux créneaux se chevauchent
 */
const checkTimeOverlap = (start1, end1, start2, end2) => {
    try {
        const s1 = new Date(start1).getTime();
        const e1 = new Date(end1).getTime();
        const s2 = new Date(start2).getTime();
        const e2 = new Date(end2).getTime();
        return s1 < e2 && e1 > s2;
    }
    catch {
        return false;
    }
};
exports.checkTimeOverlap = checkTimeOverlap;
/**
 * Formate une durée en minutes en format lisible
 */
const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) {
        return `${mins} minutes`;
    }
    else if (mins === 0) {
        return `${hours} heures`;
    }
    else {
        return `${hours}h${mins.toString().padStart(2, "0")}`;
    }
};
exports.formatDuration = formatDuration;
/**
 * Crée un timestamp ISO à partir d'une heure et d'un jour
 */
const createScheduleISO = (dayOfWeek, timeHHMM) => {
    // Convertir le jour en date (ex: prochain lundi)
    const daysMap = {
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
exports.createScheduleISO = createScheduleISO;
/**
 * Parse un timestamp ISO en objet lisible
 */
const parseISOToObject = (isoString) => {
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
exports.parseISOToObject = parseISOToObject;
//# sourceMappingURL=timeUtils.js.map