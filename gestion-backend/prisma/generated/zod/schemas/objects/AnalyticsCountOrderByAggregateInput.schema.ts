import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnalyticsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsCountOrderByAggregateInput, z.ZodTypeDef, Prisma.AnalyticsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional()
}).strict();
export const AnalyticsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional()
}).strict();
