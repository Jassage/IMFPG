import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { GradeOrderByRelationAggregateInputObjectSchema } from './GradeOrderByRelationAggregateInput.schema';
import { EnrollmentOrderByRelationAggregateInputObjectSchema } from './EnrollmentOrderByRelationAggregateInput.schema';
import { CourseAssignmentOrderByRelationAggregateInputObjectSchema } from './CourseAssignmentOrderByRelationAggregateInput.schema';
import { PaymentOrderByRelationAggregateInputObjectSchema } from './PaymentOrderByRelationAggregateInput.schema';
import { ScholarshipOrderByRelationAggregateInputObjectSchema } from './ScholarshipOrderByRelationAggregateInput.schema';
import { AcademicYearOrderByRelevanceInputObjectSchema } from './AcademicYearOrderByRelevanceInput.schema'

export const AcademicYearOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AcademicYearOrderByWithRelationInput, z.ZodTypeDef, Prisma.AcademicYearOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentOrderByRelationAggregateInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => AcademicYearOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const AcademicYearOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentOrderByRelationAggregateInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => AcademicYearOrderByRelevanceInputObjectSchema).optional()
}).strict();
