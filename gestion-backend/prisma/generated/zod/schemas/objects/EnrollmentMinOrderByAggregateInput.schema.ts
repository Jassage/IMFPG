import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EnrollmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EnrollmentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.EnrollmentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const EnrollmentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  enrollmentDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
