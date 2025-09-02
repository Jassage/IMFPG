import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptAvgAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptAvgAggregateInputType, z.ZodTypeDef, Prisma.TranscriptAvgAggregateInputType> = z.object({
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional()
}).strict();
export const TranscriptAvgAggregateInputObjectZodSchema = z.object({
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional()
}).strict();
