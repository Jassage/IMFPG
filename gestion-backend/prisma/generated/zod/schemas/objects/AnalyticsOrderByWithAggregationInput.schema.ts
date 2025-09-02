import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AnalyticsCountOrderByAggregateInputObjectSchema } from './AnalyticsCountOrderByAggregateInput.schema';
import { AnalyticsMaxOrderByAggregateInputObjectSchema } from './AnalyticsMaxOrderByAggregateInput.schema';
import { AnalyticsMinOrderByAggregateInputObjectSchema } from './AnalyticsMinOrderByAggregateInput.schema'

export const AnalyticsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AnalyticsOrderByWithAggregationInput, z.ZodTypeDef, Prisma.AnalyticsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional(),
  _count: z.lazy(() => AnalyticsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnalyticsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnalyticsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AnalyticsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional(),
  _count: z.lazy(() => AnalyticsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnalyticsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnalyticsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
