import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnalyticsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsMinOrderByAggregateInput, z.ZodTypeDef, Prisma.AnalyticsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
export const AnalyticsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
