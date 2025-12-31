"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableActionTypes = exports.SubjectType = exports.ClassLevel = void 0;
// Enums pour correspondre à votre schéma
var ClassLevel;
(function (ClassLevel) {
    ClassLevel["Sixieme"] = "Sixieme";
    ClassLevel["Cinquieme"] = "Cinquieme";
    ClassLevel["Quatrieme"] = "Quatrieme";
    ClassLevel["Troisieme"] = "Troisieme";
    ClassLevel["Seconde"] = "Seconde";
    ClassLevel["Premiere"] = "Premiere";
    ClassLevel["Terminale"] = "Terminale";
    ClassLevel["NSI"] = "NSI";
    ClassLevel["NSII"] = "NSII";
    ClassLevel["NSIII"] = "NSIII";
    ClassLevel["NSIV"] = "NSIV";
})(ClassLevel || (exports.ClassLevel = ClassLevel = {}));
var SubjectType;
(function (SubjectType) {
    SubjectType["Obligatoire"] = "Obligatoire";
    SubjectType["Optionnelle"] = "Optionnelle";
})(SubjectType || (exports.SubjectType = SubjectType = {}));
// Enums pour les actions d'audit
var TimetableActionTypes;
(function (TimetableActionTypes) {
    // Assignations
    TimetableActionTypes["ASSIGNMENT_CREATED"] = "ASSIGNMENT_CREATED";
    TimetableActionTypes["ASSIGNMENT_UPDATED"] = "ASSIGNMENT_UPDATED";
    TimetableActionTypes["ASSIGNMENT_DELETED"] = "ASSIGNMENT_DELETED";
    // Emplois du temps
    TimetableActionTypes["SCHEDULE_CREATED"] = "SCHEDULE_CREATED";
    TimetableActionTypes["SCHEDULE_UPDATED"] = "SCHEDULE_UPDATED";
    TimetableActionTypes["SCHEDULE_DELETED"] = "SCHEDULE_DELETED";
    TimetableActionTypes["TIMETABLE_GENERATED"] = "TIMETABLE_GENERATED";
    // Erreurs
    TimetableActionTypes["ASSIGNMENT_CREATION_ERROR"] = "ASSIGNMENT_CREATION_ERROR";
    TimetableActionTypes["ASSIGNMENT_UPDATE_ERROR"] = "ASSIGNMENT_UPDATE_ERROR";
    TimetableActionTypes["ASSIGNMENT_DELETION_ERROR"] = "ASSIGNMENT_DELETION_ERROR";
    TimetableActionTypes["SCHEDULE_CREATION_ERROR"] = "SCHEDULE_CREATION_ERROR";
    TimetableActionTypes["SCHEDULE_UPDATE_ERROR"] = "SCHEDULE_UPDATE_ERROR";
    TimetableActionTypes["SCHEDULE_DELETION_ERROR"] = "SCHEDULE_DELETION_ERROR";
})(TimetableActionTypes || (exports.TimetableActionTypes = TimetableActionTypes = {}));
//# sourceMappingURL=timetableTypes.js.map