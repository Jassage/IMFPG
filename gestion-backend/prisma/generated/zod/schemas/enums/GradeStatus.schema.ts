import { z } from 'zod';

export const GradeStatusSchema = z.enum(['Valide', 'AReprendre', 'EnCours'])