import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GradeSumAggregateInputObjectSchema: z.ZodType<Prisma.GradeSumAggregateInputType, z.ZodTypeDef, Prisma.GradeSumAggregateInputType> = z.object({
  grade: z.literal(true).optional()
}).strict();
export const GradeSumAggregateInputObjectZodSchema = z.object({
  grade: z.literal(true).optional()
}).strict();
