import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.TranscriptAvgOrderByAggregateInput> = z.object({
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional()
}).strict();
export const TranscriptAvgOrderByAggregateInputObjectZodSchema = z.object({
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional()
}).strict();
