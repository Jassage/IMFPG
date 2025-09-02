import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RetakeCountOrderByAggregateInputObjectSchema } from './RetakeCountOrderByAggregateInput.schema';
import { RetakeAvgOrderByAggregateInputObjectSchema } from './RetakeAvgOrderByAggregateInput.schema';
import { RetakeMaxOrderByAggregateInputObjectSchema } from './RetakeMaxOrderByAggregateInput.schema';
import { RetakeMinOrderByAggregateInputObjectSchema } from './RetakeMinOrderByAggregateInput.schema';
import { RetakeSumOrderByAggregateInputObjectSchema } from './RetakeSumOrderByAggregateInput.schema'

export const RetakeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RetakeOrderByWithAggregationInput, z.ZodTypeDef, Prisma.RetakeOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RetakeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RetakeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RetakeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RetakeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RetakeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RetakeOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RetakeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RetakeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RetakeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RetakeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RetakeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
