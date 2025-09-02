import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FacultyCountOrderByAggregateInputObjectSchema } from './FacultyCountOrderByAggregateInput.schema';
import { FacultyAvgOrderByAggregateInputObjectSchema } from './FacultyAvgOrderByAggregateInput.schema';
import { FacultyMaxOrderByAggregateInputObjectSchema } from './FacultyMaxOrderByAggregateInput.schema';
import { FacultyMinOrderByAggregateInputObjectSchema } from './FacultyMinOrderByAggregateInput.schema';
import { FacultySumOrderByAggregateInputObjectSchema } from './FacultySumOrderByAggregateInput.schema'

export const FacultyOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.FacultyOrderByWithAggregationInput, z.ZodTypeDef, Prisma.FacultyOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dean: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => FacultyCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => FacultyAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => FacultyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => FacultyMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => FacultySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const FacultyOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dean: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => FacultyCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => FacultyAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => FacultyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => FacultyMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => FacultySumOrderByAggregateInputObjectSchema).optional()
}).strict();
