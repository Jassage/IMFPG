import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UESumAggregateInputObjectSchema: z.ZodType<Prisma.UESumAggregateInputType, z.ZodTypeDef, Prisma.UESumAggregateInputType> = z.object({
  credits: z.literal(true).optional(),
  passingGrade: z.literal(true).optional()
}).strict();
export const UESumAggregateInputObjectZodSchema = z.object({
  credits: z.literal(true).optional(),
  passingGrade: z.literal(true).optional()
}).strict();
