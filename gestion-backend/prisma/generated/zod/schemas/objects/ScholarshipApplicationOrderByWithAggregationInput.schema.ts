import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ScholarshipApplicationCountOrderByAggregateInputObjectSchema } from './ScholarshipApplicationCountOrderByAggregateInput.schema';
import { ScholarshipApplicationMaxOrderByAggregateInputObjectSchema } from './ScholarshipApplicationMaxOrderByAggregateInput.schema';
import { ScholarshipApplicationMinOrderByAggregateInputObjectSchema } from './ScholarshipApplicationMinOrderByAggregateInput.schema'

export const ScholarshipApplicationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationOrderByWithAggregationInput, z.ZodTypeDef, Prisma.ScholarshipApplicationOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => ScholarshipApplicationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipApplicationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipApplicationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => ScholarshipApplicationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipApplicationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipApplicationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
