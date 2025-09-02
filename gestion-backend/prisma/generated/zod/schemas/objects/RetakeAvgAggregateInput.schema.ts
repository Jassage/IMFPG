import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RetakeAvgAggregateInputObjectSchema: z.ZodType<Prisma.RetakeAvgAggregateInputType, z.ZodTypeDef, Prisma.RetakeAvgAggregateInputType> = z.object({
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional()
}).strict();
export const RetakeAvgAggregateInputObjectZodSchema = z.object({
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional()
}).strict();
