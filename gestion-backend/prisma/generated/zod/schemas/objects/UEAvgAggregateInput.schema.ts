import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEAvgAggregateInputObjectSchema: z.ZodType<Prisma.UEAvgAggregateInputType, z.ZodTypeDef, Prisma.UEAvgAggregateInputType> = z.object({
  credits: z.literal(true).optional(),
  passingGrade: z.literal(true).optional()
}).strict();
export const UEAvgAggregateInputObjectZodSchema = z.object({
  credits: z.literal(true).optional(),
  passingGrade: z.literal(true).optional()
}).strict();
