import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultySumAggregateInputObjectSchema: z.ZodType<Prisma.FacultySumAggregateInputType, z.ZodTypeDef, Prisma.FacultySumAggregateInputType> = z.object({
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional()
}).strict();
export const FacultySumAggregateInputObjectZodSchema = z.object({
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional()
}).strict();
