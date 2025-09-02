import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CourseAssignmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CourseAssignmentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.CourseAssignmentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const CourseAssignmentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
