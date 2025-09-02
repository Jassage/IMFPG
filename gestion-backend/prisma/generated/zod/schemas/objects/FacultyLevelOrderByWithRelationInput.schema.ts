import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FacultyOrderByWithRelationInputObjectSchema } from './FacultyOrderByWithRelationInput.schema';
import { CourseAssignmentOrderByRelationAggregateInputObjectSchema } from './CourseAssignmentOrderByRelationAggregateInput.schema';
import { FacultyLevelOrderByRelevanceInputObjectSchema } from './FacultyLevelOrderByRelevanceInput.schema'

export const FacultyLevelOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.FacultyLevelOrderByWithRelationInput, z.ZodTypeDef, Prisma.FacultyLevelOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => FacultyLevelOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const FacultyLevelOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => FacultyLevelOrderByRelevanceInputObjectSchema).optional()
}).strict();
