import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AcademicYearCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.AcademicYearCountOutputTypeSelect, z.ZodTypeDef, Prisma.AcademicYearCountOutputTypeSelect> = z.object({
  grades: z.boolean().optional(),
  enrollments: z.boolean().optional(),
  assignments: z.boolean().optional(),
  payments: z.boolean().optional(),
  scholarship: z.boolean().optional()
}).strict();
export const AcademicYearCountOutputTypeSelectObjectZodSchema = z.object({
  grades: z.boolean().optional(),
  enrollments: z.boolean().optional(),
  assignments: z.boolean().optional(),
  payments: z.boolean().optional(),
  scholarship: z.boolean().optional()
}).strict();
