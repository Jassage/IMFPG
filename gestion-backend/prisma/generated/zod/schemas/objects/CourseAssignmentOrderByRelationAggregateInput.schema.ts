import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CourseAssignmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CourseAssignmentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.CourseAssignmentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CourseAssignmentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
