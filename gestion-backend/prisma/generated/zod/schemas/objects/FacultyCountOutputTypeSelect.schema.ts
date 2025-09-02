import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.FacultyCountOutputTypeSelect, z.ZodTypeDef, Prisma.FacultyCountOutputTypeSelect> = z.object({
  levels: z.boolean().optional(),
  assignments: z.boolean().optional(),
  enrollments: z.boolean().optional()
}).strict();
export const FacultyCountOutputTypeSelectObjectZodSchema = z.object({
  levels: z.boolean().optional(),
  assignments: z.boolean().optional(),
  enrollments: z.boolean().optional()
}).strict();
