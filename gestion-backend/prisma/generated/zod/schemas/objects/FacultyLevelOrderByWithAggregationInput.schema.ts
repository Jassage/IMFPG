import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FacultyLevelCountOrderByAggregateInputObjectSchema } from './FacultyLevelCountOrderByAggregateInput.schema';
import { FacultyLevelMaxOrderByAggregateInputObjectSchema } from './FacultyLevelMaxOrderByAggregateInput.schema';
import { FacultyLevelMinOrderByAggregateInputObjectSchema } from './FacultyLevelMinOrderByAggregateInput.schema'

export const FacultyLevelOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.FacultyLevelOrderByWithAggregationInput, z.ZodTypeDef, Prisma.FacultyLevelOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  _count: z.lazy(() => FacultyLevelCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => FacultyLevelMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => FacultyLevelMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const FacultyLevelOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  _count: z.lazy(() => FacultyLevelCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => FacultyLevelMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => FacultyLevelMinOrderByAggregateInputObjectSchema).optional()
}).strict();
