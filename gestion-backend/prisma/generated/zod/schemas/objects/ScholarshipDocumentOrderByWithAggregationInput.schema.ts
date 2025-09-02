import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ScholarshipDocumentCountOrderByAggregateInputObjectSchema } from './ScholarshipDocumentCountOrderByAggregateInput.schema';
import { ScholarshipDocumentMaxOrderByAggregateInputObjectSchema } from './ScholarshipDocumentMaxOrderByAggregateInput.schema';
import { ScholarshipDocumentMinOrderByAggregateInputObjectSchema } from './ScholarshipDocumentMinOrderByAggregateInput.schema'

export const ScholarshipDocumentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => ScholarshipDocumentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipDocumentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipDocumentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ScholarshipDocumentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => ScholarshipDocumentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScholarshipDocumentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScholarshipDocumentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
