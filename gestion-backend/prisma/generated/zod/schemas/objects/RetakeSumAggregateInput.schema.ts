import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RetakeSumAggregateInputObjectSchema: z.ZodType<Prisma.RetakeSumAggregateInputType, z.ZodTypeDef, Prisma.RetakeSumAggregateInputType> = z.object({
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional()
}).strict();
export const RetakeSumAggregateInputObjectZodSchema = z.object({
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional()
}).strict();
