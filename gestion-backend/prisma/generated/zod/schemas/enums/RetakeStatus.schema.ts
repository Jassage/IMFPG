import { z } from 'zod';

export const RetakeStatusSchema = z.enum(['Programme', 'EnCours', 'Termine'])