import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ProfesseurCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProfesseurCountOutputTypeSelect, z.ZodTypeDef, Prisma.ProfesseurCountOutputTypeSelect> = z.object({
  assignments: z.boolean().optional(),
  schedules: z.boolean().optional(),
  grades: z.boolean().optional()
}).strict();
export const ProfesseurCountOutputTypeSelectObjectZodSchema = z.object({
  assignments: z.boolean().optional(),
  schedules: z.boolean().optional(),
  grades: z.boolean().optional()
}).strict();
