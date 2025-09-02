import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnalyticsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.AnalyticsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
export const AnalyticsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
