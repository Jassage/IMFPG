import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { UEPrerequisiteOrderByRelationAggregateInputObjectSchema } from './UEPrerequisiteOrderByRelationAggregateInput.schema';
import { CourseAssignmentOrderByRelationAggregateInputObjectSchema } from './CourseAssignmentOrderByRelationAggregateInput.schema';
import { GradeOrderByRelationAggregateInputObjectSchema } from './GradeOrderByRelationAggregateInput.schema';
import { RetakeOrderByRelationAggregateInputObjectSchema } from './RetakeOrderByRelationAggregateInput.schema';
import { UEOrderByRelevanceInputObjectSchema } from './UEOrderByRelevanceInput.schema'

export const UEOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UEOrderByWithRelationInput, z.ZodTypeDef, Prisma.UEOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  objectives: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteOrderByRelationAggregateInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => UEOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const UEOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  objectives: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteOrderByRelationAggregateInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteOrderByRelationAggregateInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => UEOrderByRelevanceInputObjectSchema).optional()
}).strict();
