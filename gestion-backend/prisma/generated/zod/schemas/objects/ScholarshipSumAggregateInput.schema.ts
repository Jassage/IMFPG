import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipSumAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipSumAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipSumAggregateInputType> = z.object({
  amount: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional()
}).strict();
export const ScholarshipSumAggregateInputObjectZodSchema = z.object({
  amount: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional()
}).strict();
