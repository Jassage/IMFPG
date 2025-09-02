import { z } from 'zod';

export const UETypeSchema = z.enum(['Obligatoire', 'Optionnelle'])