// src/types/prismaHelpers.ts
import { BloodGroup, StudentSexe, UserStatus } from "../../generated/prisma";

// Types pour les enums Prisma
export type BloodGroupType = BloodGroup | null;
export type StudentSexeType = StudentSexe | null;
export type UserStatusType = UserStatus;

// Fonctions de conversion
export const convertBloodGroup = (
  bg: string | null | undefined
): BloodGroupType => {
  if (!bg || bg === "") return null;

  const bloodGroupMap: Record<string, BloodGroup> = {
    "A+": BloodGroup.A_POSITIVE,
    "A-": BloodGroup.A_NEGATIVE,
    "B+": BloodGroup.B_POSITIVE,
    "B-": BloodGroup.B_NEGATIVE,
    "AB+": BloodGroup.AB_POSITIVE,
    "AB-": BloodGroup.AB_NEGATIVE,
    "O+": BloodGroup.O_POSITIVE,
    "O-": BloodGroup.O_NEGATIVE,
    A_POSITIVE: BloodGroup.A_POSITIVE,
    A_NEGATIVE: BloodGroup.A_NEGATIVE,
    B_POSITIVE: BloodGroup.B_POSITIVE,
    B_NEGATIVE: BloodGroup.B_NEGATIVE,
    AB_POSITIVE: BloodGroup.AB_POSITIVE,
    AB_NEGATIVE: BloodGroup.AB_NEGATIVE,
    O_POSITIVE: BloodGroup.O_POSITIVE,
    O_NEGATIVE: BloodGroup.O_NEGATIVE,
  };

  return bloodGroupMap[bg] || null;
};

export const convertSexe = (s: string | null | undefined): StudentSexeType => {
  if (!s || s === "") return null;

  const sexeMap: Record<string, StudentSexe> = {
    M: StudentSexe.Masculin,
    F: StudentSexe.Feminin,
    Autre: StudentSexe.Autre,
    Masculin: StudentSexe.Masculin,
    Feminin: StudentSexe.Feminin,
  };

  return sexeMap[s] || null;
};

export const convertUserStatus = (status: string): UserStatusType => {
  const statusMap: Record<string, UserStatus> = {
    Actif: UserStatus.Actif,
    Inactif: UserStatus.Inactif,
    active: UserStatus.Actif,
    inactive: UserStatus.Inactif,
    Active: UserStatus.Actif,
    Inactive: UserStatus.Inactif,
  };

  return statusMap[status] || UserStatus.Actif;
};
