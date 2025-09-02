export type UserRole = "Admin" | "Professeur" | "Secretaire" | "Directeur";
export type UserStatus = "Actif" | "Inactif";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
