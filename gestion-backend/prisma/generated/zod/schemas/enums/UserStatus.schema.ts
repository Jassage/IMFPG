import { z } from 'zod';

export const UserStatusSchema = z.enum(['Actif', 'Inactif'])