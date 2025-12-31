"use strict";
/**
 * Types pour la gestion des notes académiques
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.GradeStatus = exports.GradeSession = exports.ControlType = void 0;
// Enums correspondant à Prisma
var ControlType;
(function (ControlType) {
    ControlType["CONTROLE_1"] = "CONTROLE_1";
    ControlType["CONTROLE_2"] = "CONTROLE_2";
    ControlType["CONTROLE_3"] = "CONTROLE_3";
    ControlType["CONTROLE_4"] = "CONTROLE_4";
})(ControlType || (exports.ControlType = ControlType = {}));
var GradeSession;
(function (GradeSession) {
    GradeSession["NORMALE"] = "Normale";
    GradeSession["REPRISE"] = "Reprise";
})(GradeSession || (exports.GradeSession = GradeSession = {}));
var GradeStatus;
(function (GradeStatus) {
    GradeStatus["VALID"] = "Valid_";
    GradeStatus["NON_VALID"] = "Non_valid_";
    GradeStatus["REPRENDRE"] = "Reprendre";
})(GradeStatus || (exports.GradeStatus = GradeStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["PROFESSEUR"] = "Professeur";
    UserRole["SECRETAIRE"] = "Secretaire";
    UserRole["DIRECTEUR"] = "Directeur";
    UserRole["PARENT"] = "Parent";
    UserRole["STUDENT"] = "Student";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=grade.js.map