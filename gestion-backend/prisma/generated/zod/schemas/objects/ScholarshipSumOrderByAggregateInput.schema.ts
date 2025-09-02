import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipSumOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipSumOrderByAggregateInput> = z.object({
  amount: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional()
}).strict();
export const ScholarshipSumOrderByAggregateInputObjectZodSchema = z.object({
  amount: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional()
}).strict();
