import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipAvgOrderByAggregateInput> = z.object({
  amount: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional()
}).strict();
export const ScholarshipAvgOrderByAggregateInputObjectZodSchema = z.object({
  amount: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional()
}).strict();
