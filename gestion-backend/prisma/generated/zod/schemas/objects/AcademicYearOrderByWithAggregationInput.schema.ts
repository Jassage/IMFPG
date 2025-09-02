import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AcademicYearCountOrderByAggregateInputObjectSchema } from './AcademicYearCountOrderByAggregateInput.schema';
import { AcademicYearMaxOrderByAggregateInputObjectSchema } from './AcademicYearMaxOrderByAggregateInput.schema';
import { AcademicYearMinOrderByAggregateInputObjectSchema } from './AcademicYearMinOrderByAggregateInput.schema'

export const AcademicYearOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AcademicYearOrderByWithAggregationInput, z.ZodTypeDef, Prisma.AcademicYearOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AcademicYearCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcademicYearMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcademicYearMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AcademicYearOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AcademicYearCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcademicYearMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcademicYearMinOrderByAggregateInputObjectSchema).optional()
}).strict();
