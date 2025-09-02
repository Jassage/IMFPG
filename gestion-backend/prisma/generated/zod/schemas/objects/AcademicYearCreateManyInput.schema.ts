import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AcademicYearCreateManyInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateManyInput, z.ZodTypeDef, Prisma.AcademicYearCreateManyInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AcademicYearCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
