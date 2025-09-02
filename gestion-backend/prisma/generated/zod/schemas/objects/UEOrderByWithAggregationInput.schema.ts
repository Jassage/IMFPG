import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UECountOrderByAggregateInputObjectSchema } from './UECountOrderByAggregateInput.schema';
import { UEAvgOrderByAggregateInputObjectSchema } from './UEAvgOrderByAggregateInput.schema';
import { UEMaxOrderByAggregateInputObjectSchema } from './UEMaxOrderByAggregateInput.schema';
import { UEMinOrderByAggregateInputObjectSchema } from './UEMinOrderByAggregateInput.schema';
import { UESumOrderByAggregateInputObjectSchema } from './UESumOrderByAggregateInput.schema'

export const UEOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UEOrderByWithAggregationInput, z.ZodTypeDef, Prisma.UEOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  objectives: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional(),
  _count: z.lazy(() => UECountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => UEAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UEMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UEMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => UESumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UEOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  objectives: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional(),
  _count: z.lazy(() => UECountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => UEAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UEMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UEMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => UESumOrderByAggregateInputObjectSchema).optional()
}).strict();
