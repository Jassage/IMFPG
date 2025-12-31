"use strict";
/**
 * @file classTypes.ts
 * @description Types pour la gestion des classes
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassActionTypes = void 0;
// Types d'actions pour l'audit
var ClassActionTypes;
(function (ClassActionTypes) {
    // Lectures
    ClassActionTypes["CLASSES_LIST_REQUEST"] = "CLASSES_LIST_REQUEST";
    ClassActionTypes["CLASS_DETAILS_REQUEST"] = "CLASS_DETAILS_REQUEST";
    ClassActionTypes["CLASS_STUDENTS_REQUEST"] = "CLASS_STUDENTS_REQUEST";
    ClassActionTypes["CLASS_SCHEDULES_REQUEST"] = "CLASS_SCHEDULES_REQUEST";
    ClassActionTypes["CLASS_STATISTICS_REQUEST"] = "CLASS_STATISTICS_REQUEST";
    ClassActionTypes["AVAILABLE_CLASSES_REQUEST"] = "AVAILABLE_CLASSES_REQUEST";
    // Création
    ClassActionTypes["CLASS_CREATED"] = "CLASS_CREATED";
    ClassActionTypes["CLASS_CREATION_ERROR"] = "CLASS_CREATION_ERROR";
    // Mise à jour
    ClassActionTypes["CLASS_UPDATED"] = "CLASS_UPDATED";
    ClassActionTypes["CLASS_UPDATE_ERROR"] = "CLASS_UPDATE_ERROR";
    ClassActionTypes["CLASS_STATUS_UPDATED"] = "CLASS_STATUS_UPDATED";
    ClassActionTypes["CLASS_STATUS_UPDATE_ERROR"] = "CLASS_STATUS_UPDATE_ERROR";
    ClassActionTypes["CLASS_TEACHER_ASSIGNED"] = "CLASS_TEACHER_ASSIGNED";
    ClassActionTypes["CLASS_TEACHER_ASSIGN_ERROR"] = "CLASS_TEACHER_ASSIGN_ERROR";
    // Suppression
    ClassActionTypes["CLASS_DELETED"] = "CLASS_DELETED";
    ClassActionTypes["CLASS_DELETION_ERROR"] = "CLASS_DELETION_ERROR";
    // Erreurs de lecture
    ClassActionTypes["CLASSES_LIST_ERROR"] = "CLASSES_LIST_ERROR";
    ClassActionTypes["CLASS_DETAILS_ERROR"] = "CLASS_DETAILS_ERROR";
    ClassActionTypes["CLASS_STUDENTS_ERROR"] = "CLASS_STUDENTS_ERROR";
    ClassActionTypes["CLASS_SCHEDULES_ERROR"] = "CLASS_SCHEDULES_ERROR";
    ClassActionTypes["CLASS_STATISTICS_ERROR"] = "CLASS_STATISTICS_ERROR";
    ClassActionTypes["AVAILABLE_CLASSES_ERROR"] = "AVAILABLE_CLASSES_ERROR";
})(ClassActionTypes || (exports.ClassActionTypes = ClassActionTypes = {}));
//# sourceMappingURL=classTypes.js.map