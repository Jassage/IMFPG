import { z } from 'zod';

export const UserRoleSchema = z.enum(['Admin', 'Professeur', 'Secretaire', 'Directeur'])