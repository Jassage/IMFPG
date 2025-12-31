"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUserStatus = exports.convertSexe = exports.convertBloodGroup = void 0;
// src/types/prismaHelpers.ts
const prisma_1 = require("../../generated/prisma");
// Fonctions de conversion
const convertBloodGroup = (bg) => {
    if (!bg || bg === "")
        return null;
    const bloodGroupMap = {
        "A+": prisma_1.BloodGroup.A_POSITIVE,
        "A-": prisma_1.BloodGroup.A_NEGATIVE,
        "B+": prisma_1.BloodGroup.B_POSITIVE,
        "B-": prisma_1.BloodGroup.B_NEGATIVE,
        "AB+": prisma_1.BloodGroup.AB_POSITIVE,
        "AB-": prisma_1.BloodGroup.AB_NEGATIVE,
        "O+": prisma_1.BloodGroup.O_POSITIVE,
        "O-": prisma_1.BloodGroup.O_NEGATIVE,
        A_POSITIVE: prisma_1.BloodGroup.A_POSITIVE,
        A_NEGATIVE: prisma_1.BloodGroup.A_NEGATIVE,
        B_POSITIVE: prisma_1.BloodGroup.B_POSITIVE,
        B_NEGATIVE: prisma_1.BloodGroup.B_NEGATIVE,
        AB_POSITIVE: prisma_1.BloodGroup.AB_POSITIVE,
        AB_NEGATIVE: prisma_1.BloodGroup.AB_NEGATIVE,
        O_POSITIVE: prisma_1.BloodGroup.O_POSITIVE,
        O_NEGATIVE: prisma_1.BloodGroup.O_NEGATIVE,
    };
    return bloodGroupMap[bg] || null;
};
exports.convertBloodGroup = convertBloodGroup;
const convertSexe = (s) => {
    if (!s || s === "")
        return null;
    const sexeMap = {
        M: prisma_1.StudentSexe.Masculin,
        F: prisma_1.StudentSexe.Feminin,
        Autre: prisma_1.StudentSexe.Autre,
        Masculin: prisma_1.StudentSexe.Masculin,
        Feminin: prisma_1.StudentSexe.Feminin,
    };
    return sexeMap[s] || null;
};
exports.convertSexe = convertSexe;
const convertUserStatus = (status) => {
    const statusMap = {
        Actif: prisma_1.UserStatus.Actif,
        Inactif: prisma_1.UserStatus.Inactif,
        active: prisma_1.UserStatus.Actif,
        inactive: prisma_1.UserStatus.Inactif,
        Active: prisma_1.UserStatus.Actif,
        Inactive: prisma_1.UserStatus.Inactif,
    };
    return statusMap[status] || prisma_1.UserStatus.Actif;
};
exports.convertUserStatus = convertUserStatus;
//# sourceMappingURL=prismaHelpers.js.map