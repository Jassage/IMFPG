import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptSumOrderByAggregateInput, z.ZodTypeDef, Prisma.TranscriptSumOrderByAggregateInput> = z.object({
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional()
}).strict();
export const TranscriptSumOrderByAggregateInputObjectZodSchema = z.object({
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional()
}).strict();
