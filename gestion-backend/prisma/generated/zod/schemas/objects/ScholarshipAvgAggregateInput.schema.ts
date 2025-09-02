import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipAvgAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipAvgAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipAvgAggregateInputType> = z.object({
  amount: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional()
}).strict();
export const ScholarshipAvgAggregateInputObjectZodSchema = z.object({
  amount: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional()
}).strict();
