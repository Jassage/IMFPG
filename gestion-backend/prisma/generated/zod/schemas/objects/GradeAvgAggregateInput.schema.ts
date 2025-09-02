import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GradeAvgAggregateInputObjectSchema: z.ZodType<Prisma.GradeAvgAggregateInputType, z.ZodTypeDef, Prisma.GradeAvgAggregateInputType> = z.object({
  grade: z.literal(true).optional()
}).strict();
export const GradeAvgAggregateInputObjectZodSchema = z.object({
  grade: z.literal(true).optional()
}).strict();
