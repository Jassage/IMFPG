import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FacultyLevelOrderByRelationAggregateInputObjectSchema } from './FacultyLevelOrderByRelationAggregateInput.schema';
import { CourseAssignmentOrderByRelationAggregateInputObjectSchema } from './CourseAssignmentOrderByRelationAggregateInput.schema';
import { EnrollmentOrderByRelationAggregateInputObjectSchema } from './EnrollmentOrderByRelationAggregateInput.schema';
import { FacultyOrderByRelevanceInputObjectSchema } from './FacultyOrderByRelevanceInput.schema'

export const FacultyOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.FacultyOrderByWithRelationInput, z.ZodTypeDef, Prisma.FacultyOrderByWithRelationInput> = z.object({
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
  levels: z.lazy(() => FacultyLevelOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => FacultyOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const FacultyOrderByWithRelationInputObjectZodSchema = z.object({
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
  levels: z.lazy(() => FacultyLevelOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => FacultyOrderByRelevanceInputObjectSchema).optional()
}).strict();
