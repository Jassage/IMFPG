import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptSumAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptSumAggregateInputType, z.ZodTypeDef, Prisma.TranscriptSumAggregateInputType> = z.object({
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional()
}).strict();
export const TranscriptSumAggregateInputObjectZodSchema = z.object({
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional()
}).strict();
