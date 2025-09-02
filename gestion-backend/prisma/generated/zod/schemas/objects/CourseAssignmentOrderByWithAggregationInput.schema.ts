import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CourseAssignmentCountOrderByAggregateInputObjectSchema } from './CourseAssignmentCountOrderByAggregateInput.schema';
import { CourseAssignmentMaxOrderByAggregateInputObjectSchema } from './CourseAssignmentMaxOrderByAggregateInput.schema';
import { CourseAssignmentMinOrderByAggregateInputObjectSchema } from './CourseAssignmentMinOrderByAggregateInput.schema'

export const CourseAssignmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CourseAssignmentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.CourseAssignmentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CourseAssignmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CourseAssignmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CourseAssignmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CourseAssignmentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CourseAssignmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CourseAssignmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CourseAssignmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
