import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyAvgAggregateInputObjectSchema: z.ZodType<Prisma.FacultyAvgAggregateInputType, z.ZodTypeDef, Prisma.FacultyAvgAggregateInputType> = z.object({
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional()
}).strict();
export const FacultyAvgAggregateInputObjectZodSchema = z.object({
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional()
}).strict();
