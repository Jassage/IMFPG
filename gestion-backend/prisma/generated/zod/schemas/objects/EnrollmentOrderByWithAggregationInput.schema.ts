import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { EnrollmentCountOrderByAggregateInputObjectSchema } from './EnrollmentCountOrderByAggregateInput.schema';
import { EnrollmentMaxOrderByAggregateInputObjectSchema } from './EnrollmentMaxOrderByAggregateInput.schema';
import { EnrollmentMinOrderByAggregateInputObjectSchema } from './EnrollmentMinOrderByAggregateInput.schema'

export const EnrollmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.EnrollmentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.EnrollmentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => EnrollmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => EnrollmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => EnrollmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const EnrollmentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => EnrollmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => EnrollmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => EnrollmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
