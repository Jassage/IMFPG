import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ScholarshipCountOrderByAggregateInputObjectSchema } from './ScholarshipCountOrderByAggregateInput.schema';
import { ScholarshipAvgOrderByAggregateInputObjectSchema } from './ScholarshipAvgOrderByAggregateInput.schema';
import { ScholarshipMaxOrderByAggregateInputObjectSchema } from './ScholarshipMaxOrderByAggregateInput.schema';
import { ScholarshipMinOrderByAggregateInputObjectSchema } from './ScholarshipMinOrderByAggregateInput.schema';
import { ScholarshipSumOrderByAggregateInputObjectSchema } from './ScholarshipSumOrderByAggregateInput.schema'

export const ScholarshipOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ScholarshipOrderByWithAggregationInput, z.ZodTypeDef, Prisma.ScholarshipOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  amount: SortOrderSchema.optional(),
  criteria: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => ScholarshipCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ScholarshipAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ScholarshipSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ScholarshipOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  amount: SortOrderSchema.optional(),
  criteria: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => ScholarshipCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ScholarshipAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ScholarshipSumOrderByAggregateInputObjectSchema).optional()
}).strict();
